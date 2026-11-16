import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { ChubbInsuranceQuoteFlow, ChubbQuoteInput, PM30, PM50, UNSET } from '../../flows/ChubbInsuranceQuoteFlow';

/**
 * Chubb Insurance Quote — automated from the AP-2410 bug re-test cases that PASSED on Dev (v2dev) on 2026-11-08.
 * Source: qa-artifacts/3-test-cases/AP2410_TestCases_001-004.md
 * Execution: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2410_2026-11-08.md
 *
 * Test data: AP2410_001, 002 and 004 reuse quote 6696, which the manual run created on Dev (client
 * Retest Chubb2410-001, vehicle 915, financing 25,000 / 12 months / AutoCapital Canada, co-applicant
 * Coapp Retest2410). No quote, client, financing or co-applicant is created; vehicle 915 is never edited. Each of the
 * three tests re-saves the quote's Chubb creditor insurance quote; the file runs in order, so after every run the
 * saved quote is AP2410_004's (PM30 / English / Tax exempt Yes / Life Borrower, Critical illness Co borrower,
 * Disability Both, term 12) — the state the manual run left. AP2410_003 uses the quick quote and stores nothing
 * known. No contract is generated.
 *
 * Not asserted (open bugs): the Form value of the reopened insurance form (AP-2557) and the co-applicant contact
 * block (AP-2558).
 *
 * AP-2410 was re-tested on Dev only, so the suite runs only when the portal URLs point at v2dev.
 */
const QUOTE_ID = '6696';
const CLIENT = 'Retest Chubb2410-001';
const VIN = '1FAHP35NX8W239204';
const FINANCING = 'Financing · 12 months · 25,000.00$ · AutoCapital Canada';
const TERM = '12'; // the financing term — every coverage term matches it

const LIFE_BORROWER = { type: 'DECREASING', term: TERM, forWhom: 'BORROWER' };

const AP2410_001: ChubbQuoteInput = {
    language: 'E', taxExempt: '0', form: PM30, life: LIFE_BORROWER, criticalIllness: UNSET, disability: UNSET,
};
const AP2410_002: ChubbQuoteInput = {
    language: 'F', taxExempt: '0', form: PM50, life: LIFE_BORROWER, criticalIllness: UNSET, disability: UNSET,
};
const AP2410_004: ChubbQuoteInput = {
    language: 'E', taxExempt: '1', form: PM30,
    life: LIFE_BORROWER,
    criticalIllness: { type: 'DECREASING', term: TERM, forWhom: 'CO_BORROWER' },
    disability: { type: '30D_RETRO', term: TERM, forWhom: 'BOTH' },
};

test.describe('Chubb Insurance Quote @dealer @AP-2410', () => {
    test.skip(!config.dealerPortalUrl.includes('v2dev') || !config.baseUrl.includes('v2dev'),
        'AP-2410 was re-tested on Dev (v2dev) only — set BASE_URL and DEALER_PORTAL_URL to v2dev to run it');

    test('AP2410_001_GettingAChubbInsuranceQuoteWithEveryRequiredOptionFilledAndRateTablePM30SavesWithoutAnError',
        async ({ dealerUser, page }) => {
            const chubb = new ChubbInsuranceQuoteFlow(page);

            await dealerUser.loginToDealerPortal();
            await chubb.verifyQuoteOfRecord(QUOTE_ID, CLIENT, VIN);
            await chubb.openInsurancePage(QUOTE_ID, FINANCING);
            await chubb.verifyFormOptions();
            await chubb.fillQuote(AP2410_001);
            await chubb.getQuote(QUOTE_ID);
            await chubb.verifySavedOnDetails({
                rateTable: 'PM30', language: 'English', taxExempt: 'No',
                coverages: [{ label: 'Life Decreasing', forWhom: 'BORROWER', term: TERM }],
            });
            await chubb.verifyReopenedForm(QUOTE_ID, AP2410_001, false);
        });

    test('AP2410_002_GettingAChubbInsuranceQuoteInFrenchWithRateTablePM50SavesWithoutAnError',
        async ({ dealerUser, page }) => {
            const chubb = new ChubbInsuranceQuoteFlow(page);

            await dealerUser.loginToDealerPortal();
            await chubb.verifyQuoteOfRecord(QUOTE_ID, CLIENT, VIN);
            await chubb.openInsurancePage(QUOTE_ID, FINANCING);
            await chubb.fillQuote(AP2410_002);
            await chubb.getQuote(QUOTE_ID);
            await chubb.verifySavedOnDetails({
                rateTable: 'PM50', language: 'Français', taxExempt: 'No',
                coverages: [{ label: 'Life Decreasing', forWhom: 'BORROWER', term: TERM }],
            });
            await chubb.verifyReopenedForm(QUOTE_ID, AP2410_002, false);
        });

    test('AP2410_003_InsuranceQuickQuoteWithRateTablePM30ShowsPricedResultsWithoutAnError',
        async ({ dealerUser, page }) => {
            const chubb = new ChubbInsuranceQuoteFlow(page);

            await dealerUser.loginToDealerPortal();
            await chubb.openQuickQuote();
            await chubb.fillQuickQuote(
                { form: PM30, borrowerDob: '1990-01-01', monthlyPayment: '500', termMonths: '60', residual: '0' },
                {
                    life: { type: 'DECREASING', term: '60' },
                    criticalIllness: { type: 'DECREASING', term: '60' },
                    disability: { type: '30D_RETRO', term: '60' },
                });
            await chubb.getQuickQuoteAndVerifyPriced([
                { label: 'Life Decreasing', term: '60' },
                { label: 'Criticalillness Decreasing', term: '60' },
                { label: 'Disability 30 Day Retro', term: '60' },
            ]);
        });

    test('AP2410_004_ReplayingTheReportedInputsWithCoBorrowerAndBothCoverageNoLongerReturnsDebtorIsMinus1YearsOld',
        async ({ dealerUser, page }) => {
            const chubb = new ChubbInsuranceQuoteFlow(page);

            await dealerUser.loginToDealerPortal();
            await chubb.verifyQuoteOfRecord(QUOTE_ID, CLIENT, VIN);
            await chubb.openInsurancePage(QUOTE_ID, FINANCING);
            await chubb.verifyCoBorrowerOffered();
            await chubb.fillQuote(AP2410_004);
            await chubb.getQuote(QUOTE_ID);
            await chubb.verifySavedOnDetails({
                rateTable: 'PM30', language: 'English', taxExempt: 'Yes',
                coverages: [
                    { label: 'Life Decreasing', forWhom: 'BORROWER', term: TERM },
                    { label: 'Criticalillness Decreasing', forWhom: 'CO_BORROWER', term: TERM },
                    { label: 'Disability 30 Day Retro', forWhom: 'BOTH', term: TERM },
                ],
            });
            await chubb.verifyReopenedForm(QUOTE_ID, AP2410_004, true);
        });
});
