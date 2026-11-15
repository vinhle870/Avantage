import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { RoadSideProtectionFlow } from '../../flows/RoadSideProtectionFlow';

/**
 * Road side protection (AutoShield) — automated from AP-2225 manual test cases.
 * Source: qa-artifacts/3-test-cases/AP2225_TestCases_001-005.md
 * Execution: qa-artifacts/4-execution-results/3.0.0/execution-log_AP-2225_2026-11-01.md (Dev, v2dev)
 *
 * Only the case that PASSED manually (AP2225_001). AP2225_002–008 and _014 FAILED (bug AP-2508) and
 * AP2225_004, _009–013 and _015 were BLOCKED, so they have no confirmed behaviour to assert.
 * Read-only: opens an existing quote instead of creating one, and never presses "Save" or any
 * Generate button — an AutoShield contract cannot be deleted from the portal.
 * Runs on Dev (v2dev) only, where the case was executed; the suite skips itself elsewhere.
 */
test.describe('Road Side Protection AutoShield @dealer @AP-2225', () => {
    test.skip(!/v2dev\./.test(config.baseUrl), 'AP-2225 automation runs on Dev (v2dev) only — the environment the case passed on');

    test('AP2225_001_RoadSideProtectionPageListsAutoShieldProductsEachWithAPrice', async ({ dealerUser, page }) => {
        const roadSide = new RoadSideProtectionFlow(page);

        await dealerUser.loginToDealerPortal();
        const quoteId = await roadSide.openNewestQuoteWithVehicle();
        await roadSide.openRoadSideProtection(quoteId);
        await roadSide.verifyProductsListedWithPrices();
    });
});
