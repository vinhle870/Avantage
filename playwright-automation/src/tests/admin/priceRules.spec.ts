import { test, expect } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import testData from '../../data/testData.json';

/**
 * Admin Price Rules Management Tests
 * Converted from Admin_CustomPriceRuleManage.java
 */
test.describe('Admin Price Rules Management', () => {

    test.beforeEach(async ({ page, loginPage }) => {
        // Navigate to admin portal and login
        await page.goto(config.adminPortalUrl);
        await loginPage.loginToPortal(
            testData.credentials.admin.username,
            testData.credentials.admin.password
        );
    });

    test('TC004 - Admin can create new price rule', async ({
        page,
        adminLeftMenu,
        adminPriceRulesPage,
        adminNewPriceRulePage
    }) => {
        // Navigate to price rules page
        await adminLeftMenu.goToPriceRulesPage();

        // Open new price rule form
        await adminPriceRulesPage.openNewPriceRulePage();

        // Fill price rule form with test data
        const priceRuleData = testData.admin.priceRules[0];
        await adminNewPriceRulePage.fillPriceRuleForm(priceRuleData, true);

        // Verify price rule was saved
        await adminPriceRulesPage.verifyPriceRuleSaved();
    });

    test('TC005 - Admin can view price rules list', async ({
        page,
        adminLeftMenu,
        adminPriceRulesPage
    }) => {
        // Navigate to price rules page
        await adminLeftMenu.goToPriceRulesPage();

        // Wait for table to load
        await adminPriceRulesPage.waitForTableVisible();

        // Verify page loaded successfully
        await expect(adminPriceRulesPage.lnkAddNewPriceRule).toBeVisible();
    });
});
