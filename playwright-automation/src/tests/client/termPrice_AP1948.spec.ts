import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { TermPriceFlow } from '../../flows/TermPriceFlow';
import type { ClientQuoteClient } from '../../pages/common/ClientQuoteRequestPage';

/**
 * Client portal term price = program term "Suggested retail price" — automated from AP-1948 manual test cases.
 * Source: qa-artifacts/3-test-cases/AP1948_TestCases_001-005.md, AP1948_TestCases_006-009.md
 * Execution: qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-01.md (Dev, v2dev)
 *
 * Only the cases that PASSED manually (001, 002, 009). Test data is Dev's: customer 1493, vehicle ids
 * 80 (2022 TESLA Model 3 Long Range) and 81 (2023 TESLA Model Y), terms 16 and 122 — so the suite skips
 * itself unless the configured base URL is v2dev. Each test leaves an unsubmitted quote request in the
 * Client portal session; "Continue with payment" (Stripe checkout) is never pressed.
 * AP1948_009 changes only term 16's suggested retail price and always restores it in `finally`.
 */
const CUSTOMER_ID = '1493';
const TERM_AT_36 = '16';          // L'Avantageuse AT — 36 months and/or 60000 km
const TERM_CVE_12 = '122';        // CVE — 12 months - Unlimited mileage
const AT_36_LABEL = '36 months and/or 60000 km';
const CVE_12_LABEL = /^12 months/;
const OWNERSHIP = { dateOwner: '2026-11-01' };

const MODEL_3 = { vehicleId: '80', vin: '5YJ3E1EB0NF000001', mileage: '20000', marketValue: '45000' };
const MODEL_Y = { vehicleId: '81', vin: '7SAYGDEE0PF000001', mileage: '20000', marketValue: '45000' };

const client = (): ClientQuoteClient => ({
    firstName: 'Marie',
    lastName: 'Tremblay',
    address1: '123 Rue Test',
    city: 'Montreal',
    provinceValue: '1',           // Québec
    postalCode: 'H2X 1Y4',
    phone1: '5145550100',
    email: `client.stage.${Date.now()}@yopmail.com`,
});

/** Set by AP1948_009 while term 16 may hold a changed price; cleared once the restore is confirmed. */
let pendingRestore: number | undefined;

test.describe('Client Portal Term Price From Admin @client @AP-1948', () => {
    test.skip(!/v2dev\./.test(config.baseUrl), 'AP-1948 test data (customer 1493, vehicles 80/81, terms 16/122) exists on Dev (v2dev) only');

    test('AP1948_001_SelectedTermPriceEqualsThatTermsSuggestedRetailPriceInAdmin', async ({ adminUser, page }) => {
        const prices = new TermPriceFlow(page, CUSTOMER_ID);

        await prices.openQuoteRequestUpToTermChoice(MODEL_3, OWNERSHIP);
        await prices.chooseTermAndReachSummary(TERM_AT_36, client());
        const portal = await prices.readSummarySubtotal(AT_36_LABEL);

        await adminUser.loginToAdminPortal();
        const admin = await prices.readSuggestedRetailPrice(TERM_AT_36);
        await prices.verifyPriceEquals(portal, admin, `Summary Subtotal ${portal} equals term ${TERM_AT_36}'s suggested retail price ${admin}`);
    });

    test('AP1948_002_SwitchingTermChangesThePriceToTheNewTermsSuggestedRetailPrice', async ({ adminUser, page }) => {
        const prices = new TermPriceFlow(page, CUSTOMER_ID);

        await prices.openQuoteRequestUpToTermChoice(MODEL_Y, OWNERSHIP);
        await prices.chooseTermAndReachSummary(TERM_AT_36, client());
        const firstPortal = await prices.readSummarySubtotal(AT_36_LABEL);
        await prices.switchTermAndReachSummary(TERM_CVE_12);
        const secondPortal = await prices.readSummarySubtotal(CVE_12_LABEL);

        await adminUser.loginToAdminPortal();
        const firstAdmin = await prices.readSuggestedRetailPrice(TERM_AT_36);
        const secondAdmin = await prices.readSuggestedRetailPrice(TERM_CVE_12);
        await prices.verifyPriceEquals(firstPortal, firstAdmin, `First term: Subtotal ${firstPortal} equals admin ${firstAdmin}`);
        await prices.verifyPriceEquals(secondPortal, secondAdmin, `Second term: Subtotal ${secondPortal} equals admin ${secondAdmin}`);
        await prices.verifyPricesDiffer(firstPortal, secondPortal, 'The price changed with the term');
    });

    // Second line of defence: if the in-test `finally` could not finish (page broken, timeout), restore here.
    test.afterEach(async ({ adminUser, page }) => {
        if (pendingRestore === undefined) return;
        await adminUser.loginToAdminPortal();
        await new TermPriceFlow(page, CUSTOMER_ID).restoreSuggestedRetailPrice(TERM_AT_36, pendingRestore);
        pendingRestore = undefined;
    });

    test('AP1948_009_AdminPriceChangeShowsAsTheNewPriceOnTheCustomerPortal', async ({ adminUser, page }) => {
        test.setTimeout(240_000);
        const prices = new TermPriceFlow(page, CUSTOMER_ID);

        await prices.openQuoteRequestUpToTermChoice(MODEL_3, OWNERSHIP);
        await prices.chooseTermAndReachSummary(TERM_AT_36, client());
        const before = await prices.readSummarySubtotal(AT_36_LABEL);

        await adminUser.loginToAdminPortal();
        const original = await prices.readSuggestedRetailPrice(TERM_AT_36);
        await prices.verifyPriceEquals(before, original, `Before the change: Subtotal ${before} equals admin ${original}`);
        pendingRestore = original;
        try {
            await prices.setSuggestedRetailPrice(TERM_AT_36, original + 100);

            await prices.openQuoteRequestUpToTermChoice(MODEL_3, OWNERSHIP);
            await prices.chooseTermAndReachSummary(TERM_AT_36, client());
            const after = await prices.readSummarySubtotal(AT_36_LABEL);
            await prices.verifyPriceEquals(after, original + 100, `After the change: Subtotal ${after} equals ${original} + 100`);
        } finally {
            await prices.restoreSuggestedRetailPrice(TERM_AT_36, original);
            pendingRestore = undefined;
        }
    });
});
