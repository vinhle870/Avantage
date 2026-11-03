import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { QuoteClient } from '../../data/dealer-portal';
import { GapCreditorsFinancingFlow, NOT_BLANK, NOT_VALID } from '../../flows/GapCreditorsFinancingFlow';

/**
 * Financing form embedded in the add-GAP / add-creditors insurance modals — automated from the AP-2499 manual
 * test cases that PASSED on Dev (v2dev) on 2026-11-02.
 * Source: qa-artifacts/3-test-cases/AP2499_TestCases_001-005.md, _006-010.md, _011-013.md
 * Execution: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2499_2026-11-02.md
 *
 * Not automated: AP2499_003, 004, 006, 007, 008 (FAIL — AP-2526 folded financing form, AP-2527 quote page drawn in
 * the creditors modal, AP-2528 Get Quote reloads the page) and AP2499_005, 009, 013 (BLOCKED — Q-011, Q-007, Q-002).
 *
 * Test data: each test creates its own quote on vehicle 915 with a new client (qa.ap2499.<tc>.<stamp>@yopmail.com);
 * no test picks an existing quote. AP2499_011 also stores one financing (25,000 / 60 months / 6.99 %) through the
 * Financing card. Every financing Save in these tests is refused by the server, so nothing else is stored, and
 * "Get Quote" is never pressed — no GAP or Chubb quote is requested. Dealers cannot delete quotes: each run leaves
 * five quotes on Dev.
 *
 * AP-2499 was tested on Dev only, so the suite runs only when the dealer portal URL points at v2dev.
 */
const VEHICLE_ID = '915';

const newClient = (tc: string): QuoteClient => {
    const stamp = Date.now();
    return {
        email: `qa.ap2499.${tc}.${stamp}@yopmail.com`,
        firstName: 'Gap',
        lastName: `Auto2499-${tc}-${stamp}`,
        secondaryOwnerOrCompany: '',
        distributorName: '',
        address: '100 Rue Test',
        address2: '',
        city: 'Montréal',
        province: 'Québec',
        postalCode: 'H2X 1Y4',
        telHome: '5145550101',
        telWork: '5145550102',
        indianStatusCertificate: '',
        driversLicense: '',
    };
};

test.describe('GAP and Creditors Insurance Financing Form @dealer @AP-2499', () => {
    test.skip(!config.dealerPortalUrl.includes('v2dev'),
        'AP-2499 was tested on Dev (v2dev) only — set DEALER_PORTAL_URL to v2dev to run it');

    test('AP2499_001_AddingGapInsuranceToAQuoteWithNoFinancingShowsTheFinancingFormInsteadOfTheAlert',
        async ({ dealerUser, page }) => {
            const financing = new GapCreditorsFinancingFlow(page);

            await dealerUser.loginToDealerPortal();
            const quoteId = await financing.createQuote(VEHICLE_ID, newClient('001'));
            await financing.openInsuranceModal(quoteId, 'gap');
            await financing.verifyEmptyFinancingFormFirst('gap');
        });

    test('AP2499_002_AddingCreditorsInsuranceToAQuoteWithNoFinancingShowsTheFinancingFormInsteadOfTheAlert',
        async ({ dealerUser, page }) => {
            const financing = new GapCreditorsFinancingFlow(page);

            await dealerUser.loginToDealerPortal();
            const quoteId = await financing.createQuote(VEHICLE_ID, newClient('002'));
            await financing.openInsuranceModal(quoteId, 'creditors');
            await financing.verifyEmptyFinancingFormFirst('creditors');
            await financing.verifyInsuranceRouteShowsFinancingForm(quoteId);
        });

    test('AP2499_010_SubmittingAnEmptyFinancingFormShowsAnErrorOnEachRequiredFieldAndSavesNothing',
        async ({ dealerUser, page }) => {
            const financing = new GapCreditorsFinancingFlow(page);

            await dealerUser.loginToDealerPortal();
            const quoteId = await financing.createQuote(VEHICLE_ID, newClient('010'));
            await financing.openInsuranceModal(quoteId, 'gap');
            await financing.verifyTextFieldsEmptyExcept([]);
            await financing.submitFinancing(quoteId, 'gap', { dateOfBirth: '1990-01-01' });
            await financing.verifyFieldErrors(
                ['type', 'baseAmount', 'residualAmount', 'paymentFrequency', 'termMonths', 'interestRate', 'financingCompany'],
                NOT_BLANK);
            await financing.verifyStillOnFinancingStep();
            await financing.reloadQuote(quoteId);
            await financing.verifyNothingStored(quoteId);
        });

    test('AP2499_011_CorrectingAFinancingWithATextBaseAmountAndANegativeRateLeavesTheStoredFinancingUnchanged',
        async ({ dealerUser, page }) => {
            const financing = new GapCreditorsFinancingFlow(page);

            await dealerUser.loginToDealerPortal();
            const quoteId = await financing.createQuote(VEHICLE_ID, newClient('011'));
            await financing.addFinancing(quoteId);
            await financing.openInsuranceModal(quoteId, 'creditors');
            await financing.submitFinancing(quoteId, 'creditors', { termMonths: '72', baseAmount: 'abc', interestRate: '-5' });
            await financing.verifyFieldErrors(['baseAmount'], NOT_VALID);
            await financing.reloadQuote(quoteId);
            await financing.verifyFinancingUnchanged();
        });

    test('AP2499_012_EmptyResidualAndDateOfBirthDoNotStoreInventedValues',
        async ({ dealerUser, page }) => {
            const financing = new GapCreditorsFinancingFlow(page);

            await dealerUser.loginToDealerPortal();
            const quoteId = await financing.createQuote(VEHICLE_ID, newClient('012'));
            await financing.openInsuranceModal(quoteId, 'gap');
            await financing.submitFinancing(quoteId, 'gap', {
                type: 'TYPE_FINANCING', baseAmount: '25000', frequency: 'FREQUENCY_MONTHLY',
                termMonths: '60', interestRate: '6.99', companyId: '39',
            });
            await financing.verifyFieldErrors(['residualAmount'], NOT_BLANK);
            await financing.verifyStillOnFinancingStep();
            await financing.reloadQuote(quoteId);
            await financing.verifyNothingStored(quoteId);
            await financing.openInsuranceModal(quoteId, 'gap');
            await financing.verifyResidualAndDateOfBirthEmpty();
        });
});
