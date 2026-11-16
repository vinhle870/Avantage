import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { Vehicle, VehicleDetailsFlow } from '../../flows/VehicleDetailsFlow';

/**
 * Vehicle details page — automated from AP-2495 manual test cases (bug re-test: "Cannot view vehicle
 * detail's page", PHP "Too few arguments to function BaseController::__construct()" in TabsTrait.php).
 * Source: qa-artifacts/3-test-cases/AP2495_TestCases_001-004.md
 * Execution: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2495_2026-11-04.md (Dev, v2dev)
 *
 * All four cases PASSED manually and are automated.
 *
 * Read-only. No form is filled in or saved, no quote or vehicle is created: "Create quote" only opens the
 * client form, the "Edit vehicle" modal is closed with Escape (it has no Cancel / ×), and the Window
 * sticker tab's form is never submitted.
 * Vehicle V is 915 (VIN 1FAHP35NX8W239204) when /vehicle/915/details answers; on a 404 / "not found" page
 * it is resolved by the cases' fallback (Inventory search by VIN, then the Vehicle B rule).
 * Runs on Dev (v2dev) only, where the cases passed; the suite skips itself elsewhere.
 */
const HINT_V: Vehicle = { id: 915, vin: '1FAHP35NX8W239204' };

/** Ids other tickets reserve on Dev — never picked as Vehicle B (test cases, "Vehicle B rule"). */
const RESERVED_IDS = new Set<number>([
    1067,
    ...range(1082, 1097),
    ...range(1106, 1118),
    ...range(1125, 1135),
]);

function range(from: number, to: number): number[] {
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

test.describe('Vehicle Details Page @dealer @AP-2495', () => {
    test.skip(!/v2dev\./.test(config.baseUrl), 'AP-2495 automation runs on Dev (v2dev) only — the environment the cases passed on');

    let flow: VehicleDetailsFlow;
    let v: Vehicle;

    test.beforeEach(async ({ dealerUser, page }) => {
        flow = new VehicleDetailsFlow(page);
        await dealerUser.loginToDealerPortal();
        v = await flow.resolveVehicleV(HINT_V, RESERVED_IDS);
    });

    test('AP2495_001_VehicleDetailsByUrlShowsVehicleNotServerError', async () => {
        await flow.openVehicleDetails(v);
        flow.verifyNoServerError();
    });

    test('AP2495_002_DetailsWindowStickerAndQuotesTabsOpenWithoutServerError', async () => {
        await flow.openVehicleDetails(v);
        await flow.clickTab(v, 'Window sticker');
        await flow.clickTab(v, 'Quotes');
        await flow.clickTab(v, 'Details');
        flow.verifyNoServerError();
    });

    test('AP2495_003_VehicleOpenedFromInventoryForVAndSecondVehicle', async () => {
        // Vehicle A = V, found by its VIN (the list has no search box, so it is paged read-only). The id is
        // matched too: vehicle 1081 on Dev carries the same VIN as 915.
        await flow.findInventoryRowByVin(v.vin, true, v.id);
        await flow.openFromInventoryRow(v);

        // Vehicle B = first Inventory row not 915, not V and not a reserved id.
        const b = await flow.pickVehicleB(new Set([HINT_V.id, v.id, ...RESERVED_IDS]));
        if (b) {
            await flow.openFromInventoryRow(b);
        } else {
            test.info().annotations.push({ type: 'Vehicle B',
                description: 'No Inventory row qualifies — Vehicle A judged alone (test case rule)' });
        }
        flow.verifyNoServerError();
    });

    test('AP2495_004_CreateQuoteAndEditVehicleOpenTheirFormsWithoutServerError', async () => {
        const summaryBefore = await flow.openVehicleDetails(v);

        await flow.openCreateQuoteForm(v);
        await flow.goBackToDetails(v);

        await flow.openEditVehicleModal(v);
        await flow.closeEditVehicleModal(v);

        await flow.verifyVehicleUnchanged(v, summaryBefore);
        flow.verifyNoServerError();
    });
});
