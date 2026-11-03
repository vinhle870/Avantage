import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { PermaplateContractFlow } from '../../flows/PermaplateContractFlow';

/**
 * Dealer Permaplate ("Esthetic protection") contract — automated from AP-2428 manual test cases.
 * Source: qa-artifacts/3-test-cases/AP2428_TestCases_*.md
 * Execution: qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md (Dev, v2dev)
 *
 * Only cases that PASSED manually. AP2428_005, _007, _010, _012 FAILED (bugs AP-2512 to AP-2515) and
 * AP2428_004, _008 are BLOCKED by open questions, so they have no confirmed behaviour to assert.
 * AP2428_009 and _015 are not automated: each run would leave a new quote, a contract and an invoice on Dev.
 *
 * Read-only on the Dev quotes the manual run left behind (no quote, contract or invoice is created):
 *  - 6459 "Vide Champs2428": Permaplate selection saved, no contract (AP2428_001, _003, _006, _011)
 *  - 6458 "Sans Permaplate2428": no Permaplate selection (AP2428_002)
 *  - 6456 "Perma Contrat2428": contract PNA-0000000017 made (AP2428_013, _014)
 * AP2428_011 clicks Generate Contract only with Last name and VIN blank, which the server refuses.
 * AP2428_014 changes option 20's Dealer Cost by +10.00 and restores it in a finally block.
 * Runs on Dev (v2dev) only, where the cases were executed; the suite skips itself elsewhere.
 */
const QUOTE_WITH_SELECTION = { id: '6459', client: 'Vide Champs2428' };
const QUOTE_WITHOUT_SELECTION = { id: '6458' };
const QUOTE_WITH_CONTRACT = { id: '6456', client: 'Perma Contrat2428' };
const VEHICLE_915 = { make: 'Ford', model: 'Focus', vin: '1FAHP35NX8W239204', odometer: '5000', deliveryDate: '2026-11-01' };
const PRODUCT_10_ANS = {
    productId: '3',
    optionId: '20', // Antirouille – Rust+Sound (combo)
    summary: {
        term: '10 ans',
        startDate: '2026-11-01',
        endDate: '2036-11-01',
        options: ['Antirouille – Rust+Sound (combo)', 'Peinture – Céramique + Graphene', 'Extra care (5 ans couverture )'],
    },
};

test.describe('Permaplate Contract @dealer @AP-2428', () => {
    test.skip(!/v2dev\./.test(config.baseUrl), 'AP-2428 automation runs on Dev (v2dev) only — the environment the cases passed on');

    test('AP2428_001_QuoteWithPermaplateSelectionOffersGenerateContractThatOpensTheContractForm', async ({ dealerUser, page }) => {
        const permaplate = new PermaplateContractFlow(page);

        await dealerUser.loginToDealerPortal();
        await permaplate.openQuoteDetails(QUOTE_WITH_SELECTION.id);
        await permaplate.verifyQuoteHasSelectionWithoutContract(QUOTE_WITH_SELECTION.id);
        await permaplate.openContractFormFromRowMenu(QUOTE_WITH_SELECTION.id);
        await permaplate.verifyContractFormSections();
    });

    test('AP2428_002_QuoteWithoutPermaplateSelectionHasNoContractControlAndTheFormUrlRedirects', async ({ dealerUser, page }) => {
        const permaplate = new PermaplateContractFlow(page);

        await dealerUser.loginToDealerPortal();
        await permaplate.openQuoteDetails(QUOTE_WITHOUT_SELECTION.id);
        await permaplate.verifyNoContractControl(QUOTE_WITHOUT_SELECTION.id);
        await permaplate.verifyContractFormUrlRedirects(QUOTE_WITHOUT_SELECTION.id, 'Please create a quote first');
    });

    test('AP2428_003_ContractFormPrefillsMakeModelVinOdometerAndDeliveryDateFromTheVehicle', async ({ dealerUser, page }) => {
        const permaplate = new PermaplateContractFlow(page);

        await dealerUser.loginToDealerPortal();
        await permaplate.openQuoteDetails(QUOTE_WITH_SELECTION.id);
        await permaplate.verifyQuoteHasSelectionWithoutContract(QUOTE_WITH_SELECTION.id);
        await permaplate.openContractForm(QUOTE_WITH_SELECTION.id);
        await permaplate.verifyVehiclePrefill(VEHICLE_915);
    });

    test('AP2428_006_ProgramSummaryShowsTermDatesAndEverySelectedOptionAsReadOnlyText', async ({ dealerUser, page }) => {
        const permaplate = new PermaplateContractFlow(page);

        await dealerUser.loginToDealerPortal();
        await permaplate.openQuoteDetails(QUOTE_WITH_SELECTION.id);
        await permaplate.verifyQuoteHasSelectionWithoutContract(QUOTE_WITH_SELECTION.id);
        await permaplate.openContractForm(QUOTE_WITH_SELECTION.id);
        await permaplate.verifyProgramSummary(PRODUCT_10_ANS.summary);
    });

    test('AP2428_011_ContractFormWithLastNameAndVinClearedIsRefusedWithoutCreatingAContract', async ({ dealerUser, page }) => {
        const permaplate = new PermaplateContractFlow(page);

        await dealerUser.loginToDealerPortal();
        await permaplate.openQuoteDetails(QUOTE_WITH_SELECTION.id);
        await permaplate.verifyQuoteHasSelectionWithoutContract(QUOTE_WITH_SELECTION.id);
        await permaplate.openContractForm(QUOTE_WITH_SELECTION.id);
        await permaplate.submitWithBlankLastNameAndVin();
        await permaplate.verifyBlankSubmitRefused(QUOTE_WITH_SELECTION.id, QUOTE_WITH_SELECTION.client);
    });

    test('AP2428_013_QuoteWithAContractOffersNoSecondContractAndTheFormUrlRedirects', async ({ dealerUser, page }) => {
        const permaplate = new PermaplateContractFlow(page);

        await dealerUser.loginToDealerPortal();
        await permaplate.openQuoteDetails(QUOTE_WITH_CONTRACT.id);
        await permaplate.verifyContractExistsControls(QUOTE_WITH_CONTRACT.id);
        await permaplate.verifyContractFormUrlRedirects(QUOTE_WITH_CONTRACT.id, null);
    });

    test('AP2428_014_ExistingContractKeepsItsCostPriceAfterTheOptionDealerCostChanges', async ({ dealerUser, adminUser, page }) => {
        const permaplate = new PermaplateContractFlow(page);

        await dealerUser.loginToDealerPortal();
        const before = await permaplate.readContractCostPrice(QUOTE_WITH_CONTRACT.client);

        await adminUser.loginToAdminPortal();
        const original = await permaplate.readDealerCost(PRODUCT_10_ANS.productId, PRODUCT_10_ANS.optionId);
        try {
            await permaplate.raiseDealerCost(PRODUCT_10_ANS.productId, PRODUCT_10_ANS.optionId, original, 10);
            const after = await permaplate.readContractCostPrice(QUOTE_WITH_CONTRACT.client);
            await permaplate.verifyCostPriceUnchanged(before, after);
        } finally {
            await permaplate.restoreDealerCost(PRODUCT_10_ANS.productId, PRODUCT_10_ANS.optionId, original);
        }
    });
});
