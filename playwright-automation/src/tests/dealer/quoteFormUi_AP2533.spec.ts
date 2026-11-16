import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { MinimalVehicle } from '../../flows/QuoteVehicleFormFlow';
import { QuoteFormUiFlow } from '../../flows/QuoteFormUiFlow';
import { QuoteVinDecoderFlow } from '../../flows/QuoteVinDecoderFlow';

/**
 * Updated "Create a quote" form — automated from the AP-2533 manual test cases that PASSED on
 * Dev (v2dev) on 2026-11-07. AP2533_002 is not automated (BLOCKED by Q-002).
 * Source: qa-artifacts/3-test-cases/AP2533_TestCases_001-005.md, _006-010.md, _011-011.md
 *
 * Test data: the Tesla VIN 5YJ3E1EA0LF734293, typed (never a "newest" record). Quote names are
 * unique per run (QA-AP2533-<case>-<timestamp>) and searched by the full name.
 * AP2533_004 leaves one quote "QA-AP2533-004-<timestamp>" (and its vehicle) per run — dealers
 * cannot delete quotes; see its `test-data-left` annotation. Every other test saves nothing.
 * AP2533_009 switches the shared account to French and restores the language read in step 1 in `finally`.
 * Observations the manual cases record without a verdict (Q-002 … Q-009) are annotations only.
 *
 * AP-2533 is verified on Dev only, so the suite runs only when both portal URLs point at v2dev.
 */
const VIN = '5YJ3E1EA0LF734293';
const TESLA: MinimalVehicle = { brand: 'TESLA', model: 'Model 3', year: '2020' };
const FOCUS: MinimalVehicle = { brand: 'Ford', model: 'Focus', year: '2008' };
const DEV_HOST = 'v2dev.garantieavantageplus.ca';
const onDev = [config.baseUrl, config.dealerPortalUrl].every(u => {
    try { return new URL(u).host === DEV_HOST; } catch { return false; }
});
const name = (tc: string): string => `QA-AP2533-${tc}-${Date.now()}`;

test.describe('Quote Form UI @dealer @AP-2533', () => {
    test.skip(!onDev, 'AP-2533 is verified on Dev (v2dev) only — set BASE_URL and DEALER_PORTAL_URL to v2dev to run it');

    test('AP2533_001_ClickingDecoderWithTheTeslaVinKeepsTheFormOnScreenWithTeslaModel3And2020FilledIn',
        async ({ dealerUser, page }) => {
            const decoder = new QuoteVinDecoderFlow(page);
            const ui = new QuoteFormUiFlow(page);

            await dealerUser.loginToDealerPortal();
            await decoder.openCreateAQuote();
            await decoder.verifyDecoderFixInBuild();
            await ui.recordHiddenInputs('before-decode');
            await decoder.decodeVin(VIN, TESLA);
            await decoder.verifyFormPrefilled(VIN, TESLA);
        });

    test('AP2533_003_ClickingDecoderWithoutPressingSaveCreatesNoQuoteAndKeepsTheDealerOnTheCreateAQuoteForm',
        async ({ dealerUser, page }) => {
            const decoder = new QuoteVinDecoderFlow(page);
            const ui = new QuoteFormUiFlow(page);
            const quoteName = name('003');

            await dealerUser.loginToDealerPortal();
            const vinBaseline = await ui.searchQuoteIds(VIN);
            await decoder.openCreateAQuote();
            await decoder.verifyDecoderFixInBuild();
            await decoder.fillQuoteName(quoteName);
            await decoder.decodeVin(VIN, TESLA);
            await decoder.verifyFormPrefilled(VIN, TESLA, quoteName);
            await ui.verifyNoQuoteFound(quoteName);
            await ui.verifySearchUnchanged(VIN, vinBaseline);
        });

    test('AP2533_004_SavingTheFormAfterADecodeCreatesExactlyOneQuoteCarryingTheDecodedTeslaModel32020',
        async ({ dealerUser, page }) => {
            const decoder = new QuoteVinDecoderFlow(page);
            const ui = new QuoteFormUiFlow(page);
            const quoteName = name('004');

            await dealerUser.loginToDealerPortal();
            await ui.verifyNoQuoteFound(quoteName);
            await decoder.openCreateAQuote();
            await decoder.verifyDecoderFixInBuild();
            await decoder.fillQuoteName(quoteName);
            const hidden = await decoder.decodeVin(VIN, TESLA);
            await decoder.verifyFormPrefilled(VIN, TESLA, quoteName);
            const quoteId = await ui.saveAndVerifyQuoteCreated(TESLA, VIN, quoteName, hidden['quote_vehicle[id]'] ?? '');
            await ui.verifyQuoteVehicle(quoteId, TESLA, VIN);
            await ui.verifyExactlyOneQuoteNamed(quoteName, quoteId, `${TESLA.brand} ${TESLA.model} ${TESLA.year}`);
        });

    test('AP2533_005_ClickingDecoderWithAMalformedOrEmptyVinShowsNoErrorPageKeepsTheFormAndCreatesNoQuote',
        async ({ dealerUser, page }) => {
            const decoder = new QuoteVinDecoderFlow(page);
            const ui = new QuoteFormUiFlow(page);
            const quoteName = name('005');

            await dealerUser.loginToDealerPortal();
            await decoder.openCreateAQuote();
            await decoder.verifyDecoderFixInBuild();
            await decoder.fillQuoteName(quoteName);

            await ui.decodeAndStayOnForm('ABC123');
            await ui.verifyFormCardShown();
            await ui.recordQuoteNameAndMessages('Q-003-malformed-vin');

            await ui.decodeAndStayOnForm('');
            await ui.verifyFormCardShown();
            await ui.recordQuoteNameAndMessages('Q-003-empty-vin');

            await ui.verifyNoQuoteFound(quoteName);
        });

    test('AP2533_006_DecodingTheTeslaVinAfterChoosingFordFocusAnd2008ByHandKeepsTheFormAndCreatesNoQuote',
        async ({ dealerUser, page }) => {
            const decoder = new QuoteVinDecoderFlow(page);
            const ui = new QuoteFormUiFlow(page);
            const quoteName = name('006');

            await dealerUser.loginToDealerPortal();
            await decoder.openCreateAQuote();
            await decoder.verifyDecoderFixInBuild();
            await decoder.fillQuoteName(quoteName);
            await ui.chooseVehicleByHand(FOCUS);
            await ui.decodeAndStayOnForm(VIN);
            await ui.verifyFormCardShown();
            await ui.verifyQuoteNameKept(quoteName);
            await ui.verifyEachValueHandChosenOrDecoded(FOCUS, TESLA);
            await ui.verifyNoQuoteFound(quoteName);
        });

    test('AP2533_007_TheCreateAQuoteFormShowsADropDownLabelledVehicleTypePlacedBeforeTheQuoteName',
        async ({ dealerUser, page }) => {
            const decoder = new QuoteVinDecoderFlow(page);
            const ui = new QuoteFormUiFlow(page);

            await dealerUser.loginToDealerPortal();
            await decoder.openCreateAQuote();
            await ui.recordVehicleTypeControl();
            await ui.verifyVehicleTypeBeforeQuoteName();
        });

    test('AP2533_008_ChangingTheVehicleTypeInTheDropDownReloadsTheFormWithoutErrorAndKeepsVehicleTypeBeforeQuoteName',
        async ({ dealerUser, page }) => {
            const decoder = new QuoteVinDecoderFlow(page);
            const ui = new QuoteFormUiFlow(page);

            await dealerUser.loginToDealerPortal();
            await decoder.openCreateAQuote();
            const defaultType = await ui.recordVehicleTypeControl();
            await decoder.fillQuoteName(name('008'));

            await ui.chooseVehicleType('RV CLASS A');
            await ui.recordAfterTypeChange();
            await ui.verifyFormCardShown();
            await ui.verifyVehicleTypeShows('RV CLASS A');
            await ui.verifyVehicleTypeBeforeQuoteName();

            await ui.chooseVehicleType(defaultType);
            await ui.verifyFormCardShown();
            await ui.verifyVehicleTypeShows(defaultType);
            await ui.verifyVehicleTypeBeforeQuoteName();
        });

    test('AP2533_009_InTheFrenchInterfaceTheVehicleTypeDropDownStillSitsBeforeTheQuoteNameField',
        async ({ dealerUser, page }) => {
            const ui = new QuoteFormUiFlow(page);

            await dealerUser.loginToDealerPortal();
            await ui.openNewQuoteForm();
            const original = await ui.readInterfaceLanguage();
            try {
                await ui.switchToFrenchAndRecordLabels();
                await ui.verifyVehicleTypePositionOnlyBeforeQuoteName('French');
            } finally {
                // Always give the shared account back the language read in step 1
                await ui.restoreLanguage(original);
            }
            test.info().annotations.push({ type: 'language-restored', description: `original "${original}", restored "${original}"` });
            await ui.verifyLanguageRestored(original);
        });

    test('AP2533_010_SavingTheUpdatedFormWithBrandModelAndYearEmptyIsRefusedAndCreatesNoQuote',
        async ({ dealerUser, page }) => {
            const decoder = new QuoteVinDecoderFlow(page);
            const ui = new QuoteFormUiFlow(page);
            const quoteName = name('010');

            await dealerUser.loginToDealerPortal();
            await decoder.openCreateAQuote();
            await ui.recordFormMap();
            await decoder.fillQuoteName(quoteName);
            await ui.saveAndVerifyRefused(['vehicle_make', 'vehicle_model', 'vehicle_year']);
            await ui.verifyNoQuoteFound(quoteName);
        });

    test('AP2533_011_DecodingTheTeslaVinOnASecondCarTypesFormKeepsTheFormOnScreenAndCreatesNoQuote',
        async ({ dealerUser, page }) => {
            const decoder = new QuoteVinDecoderFlow(page);
            const ui = new QuoteFormUiFlow(page);
            const quoteName = name('011');

            await dealerUser.loginToDealerPortal();
            await decoder.openCreateAQuote();
            await decoder.verifyDecoderFixInBuild();
            await ui.recordVehicleTypeControl();
            const chosen = await ui.findSecondTypeWithDecoder();
            test.skip(!chosen, 'No second car type offers "Décoder" on Dev');

            await decoder.fillQuoteName(quoteName);
            await ui.decodeAndStayOnForm(VIN);
            await ui.verifyFormCardShown();
            await ui.verifyVehicleTypeShows(chosen!.label);
            await ui.verifyQuoteNameKept(quoteName);
            await ui.verifyVinKept(VIN);
            await ui.recordQuoteNameAndMessages('Q-004-second-type');
            await ui.verifyNoQuoteFound(quoteName);
        });
});
