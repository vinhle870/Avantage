import { test } from '../../core/fixtures/test-fixtures';
import { EarningCurveFlow } from '../../flows/EarningCurveFlow';

/**
 * Earning curve type switching — automated from AP-2485 manual test cases (bug re-test).
 * Source: qa-artifacts/3-test-cases/AP2485_TestCases_001-003.md
 *
 * AP2485_001 and AP2485_003 leave one earning curve each per run (earning curves have no
 * delete control); names are unique per run. AP2485_002 saves nothing.
 */
test.describe('Earning Curve Type Switching @admin @AP-2485', () => {

    test('AP2485_001_SwitchingA12MonthCurveFromRuleOf78BackToProRataShowsAndSaves0_0833OnEveryRow',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);
            const name = `QA-AP2485-Repro-${Date.now()}`;

            await adminUser.loginToAdminPortal();
            await curves.openCreateEarningCurve();
            await curves.verifyEarningCurveTable('Pro-Rata', 12);
            await curves.selectEarningCurveType('Rule of 78');
            await curves.verifyEarningCurveTable('Rule of 78', 12);
            await curves.selectEarningCurveType('Pro-Rata');
            await curves.verifyEarningCurveTable('Pro-Rata', 12);
            await curves.saveEarningCurve(name, 12, 'Pro-Rata');
            await curves.openEarningCurveForEdit(name);
            await curves.verifyEarningCurveTable('Pro-Rata', 12);
        });

    test('AP2485_002_SwitchingFromReverseRuleOf78BackToProRataRegeneratesAt12Months_And24MonthSwitchingStillWorks',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);

            await adminUser.loginToAdminPortal();
            await curves.openCreateEarningCurve();
            await curves.verifyEarningCurveTable('Pro-Rata', 12);
            await curves.selectEarningCurveType('Reverse rule of 78');
            await curves.verifyEarningCurveTable('Reverse rule of 78', 12);
            await curves.selectEarningCurveType('Pro-Rata');
            await curves.verifyEarningCurveTable('Pro-Rata', 12);
            await curves.setTermMonth(24);
            await curves.verifyEarningCurveTable('Pro-Rata', 24);
            await curves.selectEarningCurveType('Rule of 78');
            await curves.verifyEarningCurveTable('Rule of 78', 24);
            await curves.selectEarningCurveType('Pro-Rata');
            await curves.verifyEarningCurveTable('Pro-Rata', 24);
            // Nothing is saved: the page is left without clicking Save.
        });

    test('AP2485_003_OnAnExisting12MonthRuleOf78Curve_ChangingTheTypeToProRataSavesProRataFactors',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);
            const name = `QA-AP2485-Edit-${Date.now()}`;

            await adminUser.loginToAdminPortal();
            await curves.openCreateEarningCurve();
            await curves.selectEarningCurveType('Rule of 78');
            await curves.saveEarningCurve(name, 12, 'Rule of 78');
            const editUrl = await curves.openEarningCurveForEdit(name);
            await curves.verifyEarningCurveTable('Rule of 78', 12);
            await curves.selectEarningCurveType('Pro-Rata');
            await curves.verifyEarningCurveTable('Pro-Rata', 12);
            await curves.verifyDetailsKept(name);
            await curves.saveEarningCurve(name, 12, 'Pro-Rata');
            await curves.openEarningCurveForEdit(name, editUrl);
            await curves.verifyEarningCurveTable('Pro-Rata', 12);
        });
});
