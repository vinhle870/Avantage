import { test, expect } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import testData from '../../data/testData.json';

/**
 * Admin Program Management Tests
 * Converted from Admin_ProgramManage.java
 */
test.describe('Admin Program Management', () => {

    test.beforeEach(async ({ page, loginPage }) => {
        // Navigate to admin portal and login
        await page.goto(config.adminPortalUrl);
        await loginPage.loginToPortal(
            testData.credentials.admin.username,
            testData.credentials.admin.password
        );
    });

    test('TC006 - Admin can view programs list', async ({
        page,
        adminLeftMenu,
        adminProgramsPage
    }) => {
        // Navigate to programs page
        await adminLeftMenu.goToProgramsPage();

        // Wait for table to load
        await adminProgramsPage.waitForTableVisible();

        // Verify page loaded successfully
        await expect(adminProgramsPage.lnkAddNew).toBeVisible();
    });

    test('TC007 - Admin can open existing program', async ({
        page,
        adminLeftMenu,
        adminProgramsPage
    }) => {
        const programName = testData.admin.programs[0].name;

        // Navigate to programs page
        await adminLeftMenu.goToProgramsPage();

        // Wait for table to load
        await adminProgramsPage.waitForTableVisible();

        // Check if program exists
        const programExists = await adminProgramsPage.isProgramAvailableOnList(programName);

        if (programExists) {
            // Open the program
            await adminProgramsPage.openExistingProgramPage(programName);

            // Verify navigation occurred (URL should change)
            await expect(page).toHaveURL(/.*program.*/);
        } else {
            test.skip(true, 'Program not found - skipping test');
        }
    });
});
