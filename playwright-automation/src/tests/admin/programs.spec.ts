import { test } from '../../core/fixtures/test-fixtures';
import { loadAdminPortalData } from '../../data/testDataLoader';

/**
 * Admin Program Management Tests
 * Converted from Admin_ProgramManage.java
 */
test.describe('Admin Program Management @admin', () => {

    test('TC001_AdminCanCreateNewProgram', async ({ adminUser }) => {
        const program = loadAdminPortalData('AdminPortal/AdminPortal_Request.xml').programs[0];
        // Program names must be unique, so every run creates its own
        program.name = `${program.name}_${Date.now()}`;

        await adminUser.loginToAdminPortal();
        await adminUser.createNewProgram(program, true);
        await adminUser.verifyProgramIsAvailableOnProgramList(program);
    });

    test('TC006_AdminCanLoginToAdminPortal', async ({ adminUser }) => {
        await adminUser.loginToAdminPortal();
    });
});
