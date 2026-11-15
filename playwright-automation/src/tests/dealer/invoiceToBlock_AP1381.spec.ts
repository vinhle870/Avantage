import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { InvoiceToBlockFlow } from '../../flows/InvoiceToBlockFlow';

/**
 * Dealer invoice "To:" block names the dealer once — automated from AP-1381 manual test cases.
 * Source: qa-artifacts/3-test-cases/AP1381_TestCases_001-004.md
 * Execution: qa-artifacts/4-execution-results/1.25.0/execution-log_AP-1381_2026-11-01.md (Dev, v2dev)
 *
 * Only the cases that PASSED manually (001, 002, 004); AP1381_003 was SKIPPED (no PDF on the dealer page).
 * Expected values follow the reporter's answer to Q-001: "the *Name is what will appear in the invoice".
 * Read-only: opens existing invoices and dealer 1380's edit form, creates and saves nothing.
 * The shared QA account's dealer is 1380 on Dev, so the suite skips itself unless the base URL is v2dev.
 */
const DEALER_ID = '1380';

test.describe('Dealer Invoice To Block @dealer @admin @AP-1381', () => {
    test.skip(!/v2dev\./.test(config.baseUrl), 'AP-1381 automation runs on Dev (v2dev) only — dealer 1380 of the shared QA account');

    test('AP1381_001_DealerPortalInvoiceShowsTheDealerNameOnceInTheToSection', async ({ adminUser, dealerUser, page }) => {
        const invoices = new InvoiceToBlockFlow(page);

        await adminUser.loginToAdminPortal();
        const names = await invoices.readDealerNames(DEALER_ID);

        await dealerUser.loginToDealerPortal();
        const invoice = await invoices.pickNewestWarrantyInvoice();
        await invoices.openDealerInvoice(invoice);
        await invoices.verifyToBlockNamesDealerOnce(names);
    });

    test('AP1381_002_AdminPortalInvoiceShowsTheDealerNameOnceInTheToSection', async ({ adminUser, dealerUser, page }) => {
        const invoices = new InvoiceToBlockFlow(page);

        await dealerUser.loginToDealerPortal();
        const invoice = await invoices.pickNewestWarrantyInvoice();

        await adminUser.loginToAdminPortal();
        const names = await invoices.readDealerNames(DEALER_ID);
        await invoices.openAdminInvoiceFromList(invoice);
        await invoices.verifyToBlockNamesDealerOnce(names);
    });

    test('AP1381_004_OldestDealerInvoiceStillOpensWithoutAnError', async ({ dealerUser, page }) => {
        const invoices = new InvoiceToBlockFlow(page);

        await dealerUser.loginToDealerPortal();
        const oldest = await invoices.pickOldestInvoice();
        await invoices.openDealerInvoice(oldest);
        await invoices.verifyToBlockNotEmptyAndRecordName();
    });
});
