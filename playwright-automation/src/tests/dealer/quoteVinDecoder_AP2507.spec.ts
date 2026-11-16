import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { MinimalVehicle } from '../../flows/QuoteVehicleFormFlow';
import { QuoteVinDecoderFlow } from '../../flows/QuoteVinDecoderFlow';

/**
 * "Décoder" VIN lookup on the new-quote form — automated from the AP-2507 bug re-test cases
 * that PASSED on Dev (v2dev) on 2026-11-07.
 * Source: qa-artifacts/3-test-cases/AP2507_TestCases_001-003.md
 *
 * Test data: the known VIN 1FAHP35NX8W239204 (typed, not chosen from inventory).
 * AP2507_001 saves nothing (it fails if the decode saves a quote). AP2507_002 and AP2507_003
 * each leave one quote "QA-AP2507-00x-<timestamp>" and one new Ford Focus 2008 vehicle per run —
 * dealers cannot delete quotes. Each is listed in the test's `test-data-left` annotation.
 *
 * The fix (AP-2533) is on Dev only, so the suite runs only when the dealer portal URL points at v2dev.
 */
const VIN = '1FAHP35NX8W239204';
const FOCUS: MinimalVehicle = { brand: 'Ford', model: 'Focus', year: '2008' };

test.describe('Quote VIN Decoder @dealer @AP-2507', () => {
    test.skip(!config.dealerPortalUrl.includes('v2dev'),
        'AP-2507 is verified on Dev (v2dev) only — set DEALER_PORTAL_URL to v2dev to run it');

    test('AP2507_001_ClickingDecoderWithAValidVinReRendersTheFormWithFordFocus2008AndSavesNoQuote',
        async ({ dealerUser, page }) => {
            const decoder = new QuoteVinDecoderFlow(page);

            await dealerUser.loginToDealerPortal();
            const baseline = await decoder.readBaselineQuoteId();
            await decoder.openCreateAQuote();
            await decoder.verifyDecoderFixInBuild();
            await decoder.decodeVin(VIN, FOCUS);
            await decoder.verifyFormPrefilled(VIN, FOCUS);
            await decoder.verifyDecodeSavedNoQuote(baseline, VIN);
        });

    test('AP2507_002_AQuoteSavedByTheDealerAfterDecodingKeepsTheDecodedVehicleDetailsOnItsVehicle',
        async ({ dealerUser, page }) => {
            const decoder = new QuoteVinDecoderFlow(page);
            const quoteName = `QA-AP2507-002-${Date.now()}`;

            await dealerUser.loginToDealerPortal();
            const baseline = await decoder.readBaselineQuoteId();
            await decoder.openCreateAQuote();
            const hidden = await decoder.decodeVin(VIN, FOCUS);
            await decoder.verifyFormPrefilled(VIN, FOCUS);
            await decoder.fillQuoteName(quoteName);
            const quoteId = await decoder.saveAndVerifyQuoteCreated(FOCUS, VIN, quoteName);
            await decoder.verifyOnlyTheSavedQuoteAdded(baseline, quoteId, quoteName, VIN);
            await decoder.verifySavedVehicleIsNewDecodedVehicle(quoteId, VIN, FOCUS, hidden['quote_vehicle[id]'] ?? '');
        });

    test('AP2507_003_AQuoteNameTypedBeforeClickingDecoderSurvivesTheDecodeAndIsSavedWithTheQuote',
        async ({ dealerUser, page }) => {
            const decoder = new QuoteVinDecoderFlow(page);
            const quoteName = `QA-AP2507-003-${Date.now()}`;

            await dealerUser.loginToDealerPortal();
            const baseline = await decoder.readBaselineQuoteId();
            await decoder.openCreateAQuote();
            await decoder.fillQuoteName(quoteName);
            await decoder.decodeVin(VIN, FOCUS);
            await decoder.verifyFormPrefilled(VIN, FOCUS, quoteName);
            const quoteId = await decoder.saveAndVerifyQuoteCreated(FOCUS, VIN, quoteName);
            await decoder.verifyQuoteNameOnDetails(quoteId, quoteName);
            await decoder.verifyOnlyTheSavedQuoteAdded(baseline, quoteId, quoteName, VIN);
        });
});
