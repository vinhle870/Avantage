import { test } from '../../core/fixtures/test-fixtures';
import { loadAdminPortalData } from '../../data/testDataLoader';

/**
 * Admin Dealer Management Tests
 * Converted from Admin_DealerManage.java
 *
 * The legacy data reused the email/name of the real dealer account the dealer tests
 * log in with, so TC003 could delete that account. Each run now creates its own dealer.
 */
test.describe('Admin Dealer Management @admin', () => {
    // TC003 deletes the dealer TC002 creates
    test.describe.configure({ mode: 'serial' });

    const runId = Date.now();
    const dealer = loadAdminPortalData('AdminPortal/AdminPortal_Request.xml').dealers[0];
    dealer.name = `Automation Dealer ${runId}`;
    dealer.email = `ap_automation_dealer_${runId}@yopmail.com`;
    let created = false;

    test('TC002_AdminCanCreateNewDealer', async ({ adminUser }) => {
        await adminUser.loginToAdminPortal();
        await adminUser.createNewDealer(dealer, true);
        created = true;
    });

    test('TC003_AdminCanDeleteDealer', async ({ adminUser }) => {
        await adminUser.loginToAdminPortal();
        // Run on its own, TC003 first creates the dealer it deletes
        if (!created) {
            await adminUser.createNewDealer(dealer, true);
        }
        await adminUser.deleteDealer(dealer.name, true);
    });
});
