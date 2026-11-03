import { test, expect } from '../../core/fixtures/test-fixtures';
import { loadDealerPortalData } from '../../data/testDataLoader';

/**
 * Dealer Inventory Tests
 * Converted from Dealer_Inventory.java
 */
test.describe('Dealer Vehicle Inventory @dealer', () => {

    test('DealerCanCreateNewVehicle', async ({ dealerUser, vehicleInventoryPage }) => {
        const vehicleInfo = loadDealerPortalData('DealerPortal/DealerCanAddNewVehicle.xml').vehicleInfo!;

        await dealerUser.loginToDealerPortal();
        await dealerUser.addNewVehicle(vehicleInfo, true);

        // The new vehicle is the newest row of the inventory
        expect(vehicleInfo.vehicleId, 'New vehicle ID was not read from the inventory').not.toBe('');
        expect(await vehicleInventoryPage.isVehicleInList(vehicleInfo.vin)).toBe(true);
    });
});
