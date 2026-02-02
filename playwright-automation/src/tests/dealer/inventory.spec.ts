import { test, expect } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import testData from '../../data/testData.json';

/**
 * Dealer Inventory Tests
 * Converted from Dealer_Inventory.java
 */
test.describe('Dealer Vehicle Inventory', () => {

    test.beforeEach(async ({ page, loginPage }) => {
        // Navigate to dealer portal and login
        await page.goto(config.dealerPortalUrl);
        await loginPage.loginToPortal(
            testData.credentials.dealer.username,
            testData.credentials.dealer.password
        );
    });

    test('TC001 - Dealer can view inventory', async ({
        page,
        dealerLeftMenu,
        vehicleInventoryPage
    }) => {
        // Navigate to inventory page
        await dealerLeftMenu.goToInventoryPage();

        // Wait for table to load
        await vehicleInventoryPage.waitForTableVisible();

        // Verify inventory page loaded
        await expect(vehicleInventoryPage.lnkSelectVehicle).toBeVisible();
    });

    test('TC002 - Dealer can add new vehicle', async ({
        page,
        dealerLeftMenu,
        vehicleInventoryPage
    }) => {
        // Navigate to inventory page
        await dealerLeftMenu.goToInventoryPage();

        // Open add new vehicle form
        await vehicleInventoryPage.openAddNewVehiclePage('auto');

        // Fill vehicle form with test data
        const vehicleData = testData.dealer.vehicles[0];
        await vehicleInventoryPage.fillVehicleForm(vehicleData, true);

        // Verify vehicle was added (navigate back and check list)
        await vehicleInventoryPage.goBack();
        await vehicleInventoryPage.waitForTableVisible();

        const vehicleExists = await vehicleInventoryPage.isVehicleInList(vehicleData.vin);
        expect(vehicleExists).toBe(true);
    });
});
