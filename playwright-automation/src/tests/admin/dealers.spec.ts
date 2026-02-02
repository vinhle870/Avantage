import { test, expect } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import testData from '../../data/testData.json';

/**
 * Admin Dealer Management Tests
 * Converted from Admin_DealerManage.java
 */
test.describe('Admin Dealer Management', () => {

    test.beforeEach(async ({ page, loginPage }) => {
        // Navigate to admin portal and login
        await page.goto(config.adminPortalUrl);
        await loginPage.loginToPortal(
            testData.credentials.admin.username,
            testData.credentials.admin.password
        );
    });

    test('TC002 - Admin can create new dealer', async ({
        page,
        adminLeftMenu,
        adminDealersPage,
        adminNewDealerPage
    }) => {
        // Navigate to dealers page
        await adminLeftMenu.goToUsersPage();

        // Open new dealer form
        await adminDealersPage.openNewDealerPage();

        // Fill dealer form with test data
        const dealerData = testData.admin.dealers[0];
        await adminNewDealerPage.fillNewDealerForm(dealerData, true);

        // Verify dealer was saved
        await adminNewDealerPage.verifyDealerSaved();
    });

    test('TC003 - Admin can delete dealer', async ({
        page,
        adminLeftMenu,
        adminDealersPage
    }) => {
        const dealerName = testData.admin.dealers[0].name;

        // Navigate to dealers page
        await adminLeftMenu.goToUsersPage();

        // Wait for table to load
        await adminDealersPage.waitForTableVisible();

        // Check if dealer exists before attempting to delete
        const dealerExists = await adminDealersPage.isDealerAvailableOnList(dealerName);

        if (dealerExists) {
            // Delete the dealer
            await adminDealersPage.deleteDealer(dealerName, true);

            // Verify dealer was deleted
            await page.waitForTimeout(1000); // Wait for page refresh
            const stillExists = await adminDealersPage.isDealerAvailableOnList(dealerName);
            expect(stillExists).toBe(false);
        } else {
            test.skip(true, 'Dealer not found - skipping delete test');
        }
    });
});
