import { test } from '../../core/fixtures/test-fixtures';
import { loadAdminPortalData } from '../../data/testDataLoader';

/**
 * Admin Custom Price Rule Management Tests
 * Converted from Admin_CustomPriceRuleManage.java
 */
test.describe('Admin Custom Price Rule Management @admin', () => {

    test('AP145_AdminUserCanDeleteCustomPricingRule', async ({ adminUser }) => {
        const priceRule = loadAdminPortalData('AdminPortal/TC_145_AdminPortal_Request.xml')
            .priceRules.find(rule => rule.name.startsWith('Automation Test'))!;

        await adminUser.loginToAdminPortal();
        await adminUser.createNewPriceRule(priceRule, true);
        await adminUser.deletePriceRule(priceRule, true);
    });
});
