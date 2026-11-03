import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { MinimalVehicle, QuoteVehicleFormFlow } from '../../flows/QuoteVehicleFormFlow';

/**
 * Minimal new-quote vehicle form — automated from the AP-2477 manual test cases that PASSED
 * on Dev (v2dev) on 2026-11-01.
 * Source: qa-artifacts/3-test-cases/AP2477_TestCases_001-005.md, _006-010.md, _011-012.md
 *
 * Not automated: AP2477_007 (FAIL — AP-2507), AP2477_008 and AP2477_009 (BLOCKED by it).
 * No test clicks "Décoder": on dev it saves a quote (AP-2507).
 *
 * Test data: AP2477_003, AP2477_004 and AP2477_012 each leave one quote and one vehicle
 * (Toyota Corolla 2020) per run — dealers cannot delete quotes, and the vehicle also shows in
 * Vehicle Inventory. AP2477_005, 006 and 011 save nothing (refused by the server).
 *
 * AP-2477 is deployed on dev only ("not ready for staging yet", AP-2477 comment 2026-10-28),
 * so the suite runs only when the dealer portal URL points at v2dev.
 */
const COROLLA: MinimalVehicle = { brand: 'Toyota', model: 'Corolla', year: '2020' };

test.describe('Minimal New-Quote Vehicle Form @dealer @AP-2477', () => {
    test.skip(!config.dealerPortalUrl.includes('v2dev'),
        'AP-2477 is deployed on Dev (v2dev) only — set DEALER_PORTAL_URL to v2dev to run it');

    test('AP2477_001_TheNewQuoteVehicleFormShowsOnlyQuoteNameVinBrandModelAndYearInThatOrder',
        async ({ dealerUser, page }) => {
            const quoteForm = new QuoteVehicleFormFlow(page);

            await dealerUser.loginToDealerPortal();
            await quoteForm.openCreateAQuote();
            await quoteForm.verifyOnlyFiveFieldsInOrder();
        });

    test('AP2477_002_OnlyBrandModelAndYearCarryTheRequiredMarkerQuoteNameAndVinDoNot',
        async ({ dealerUser, page }) => {
            const quoteForm = new QuoteVehicleFormFlow(page);

            await dealerUser.loginToDealerPortal();
            await quoteForm.openCreateAQuote();
            await quoteForm.verifyOnlyBrandModelYearRequired();
        });

    test('AP2477_003_SavingWithOnlyBrandModelAndYearCreatesTheQuoteAndOpensItsDetailsPage',
        async ({ dealerUser, page }) => {
            const quoteForm = new QuoteVehicleFormFlow(page);

            await dealerUser.loginToDealerPortal();
            const before = await quoteForm.readNewestQuoteId();
            await quoteForm.openCreateAQuote();
            await quoteForm.fillMinimalForm(COROLLA);
            const quoteId = await quoteForm.saveAndVerifyQuoteCreated(COROLLA);
            await quoteForm.verifyNewestQuote(quoteId, before);
        });

    test('AP2477_004_AVehicleSavedFromTheMinimalFormHasNoKilometresConditionDesignationOrPrice',
        async ({ dealerUser, page }) => {
            const quoteForm = new QuoteVehicleFormFlow(page);
            const quoteName = `QA-AP2477-004-${Date.now()}`;

            await dealerUser.loginToDealerPortal();
            await quoteForm.openCreateAQuote();
            await quoteForm.fillMinimalForm(COROLLA, quoteName);
            const quoteId = await quoteForm.saveAndVerifyQuoteCreated(COROLLA, quoteName);
            await quoteForm.verifyVehicleStoredEmpty(quoteId);
        });

    test('AP2477_005_SavingWithoutABrandIsRefusedWithAnErrorAndNoQuoteIsCreated',
        async ({ dealerUser, page }) => {
            const quoteForm = new QuoteVehicleFormFlow(page);
            const quoteName = `QA-AP2477-005-${Date.now()}`;

            await dealerUser.loginToDealerPortal();
            const before = await quoteForm.readNewestQuoteId();
            await quoteForm.openCreateAQuote();
            await quoteForm.fillMinimalForm({ year: '2020' }, quoteName);
            await quoteForm.saveAndVerifyRefused(['vehicle_make', 'vehicle_model'], { quoteName });
            await quoteForm.verifyNoQuoteCreated(before, quoteName);
        });

    test('AP2477_006_SavingWithBrandAndModelButNoYearIsRefusedWithAnErrorAndNoQuoteIsCreated',
        async ({ dealerUser, page }) => {
            const quoteForm = new QuoteVehicleFormFlow(page);
            const quoteName = `QA-AP2477-006-${Date.now()}`;

            await dealerUser.loginToDealerPortal();
            const before = await quoteForm.readNewestQuoteId();
            await quoteForm.openCreateAQuote();
            await quoteForm.fillMinimalForm({ brand: COROLLA.brand, model: COROLLA.model }, quoteName);
            await quoteForm.saveAndVerifyRefused(['vehicle_year'], { quoteName, brand: COROLLA.brand, model: COROLLA.model });
            await quoteForm.verifyNoQuoteCreated(before, quoteName);
        });

    test('AP2477_010_TheDecoderButtonShowsForACarTypeButNotForAnRvBoatOrConstructionType',
        async ({ dealerUser, page }) => {
            const quoteForm = new QuoteVehicleFormFlow(page);

            await dealerUser.loginToDealerPortal();
            await quoteForm.openCreateAQuote();
            await quoteForm.verifyDecoderShownForPassenger();
            await quoteForm.chooseVehicleType('RV_CLASS_A', 'RV CLASS A');
            await quoteForm.verifyNoDecoderAndFiveFields();
        });

    test('AP2477_011_TheInventoryAddVehicleFormStillShowsPriceAndKilometersAndRefusesToSaveWithoutThem',
        async ({ dealerUser, page }) => {
            const quoteForm = new QuoteVehicleFormFlow(page);
            const vin = `QAAP2477011${Date.now().toString().slice(-6)}`;

            await dealerUser.loginToDealerPortal();
            const newestBefore = await quoteForm.readNewestInventoryVehicleId();
            await quoteForm.openInventoryAddForm('PASSENGER');
            await quoteForm.verifyInventoryFormKeepsPriceAndKilometers();
            await quoteForm.fillInventoryFormWithoutPriceAndKm(vin, COROLLA);
            await quoteForm.saveInventoryFormAndVerifyRefused();
            await quoteForm.verifyNoInventoryVehicleAdded(newestBefore);
        });

    test('AP2477_012_AQuoteCreatedFromTheMinimalFormOpensItsDetailsAndWarrantyStepWithoutAnErrorPage',
        async ({ dealerUser, page }) => {
            const quoteForm = new QuoteVehicleFormFlow(page);
            const quoteName = `QA-AP2477-012-${Date.now()}`;

            await dealerUser.loginToDealerPortal();
            await quoteForm.openCreateAQuote();
            await quoteForm.fillMinimalForm(COROLLA, quoteName);
            const quoteId = await quoteForm.saveAndVerifyQuoteCreated(COROLLA, quoteName);
            await quoteForm.verifyQuoteDetailsLoad(quoteId, COROLLA, quoteName);
            await quoteForm.openWarrantyStepAndVerifyItAsksForMissingValues(quoteId);
        });
});
