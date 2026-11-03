import { test } from '../../core/fixtures/test-fixtures';
import { EarningCurveFlow } from '../../flows/EarningCurveFlow';

/**
 * Custom earning curve with an empty Monthly Factor — automated from AP-2486 manual test cases
 * (bug re-test: the empty factor used to return the HTTP 500 error page).
 * Source: qa-artifacts/3-test-cases/AP2486_TestCases_001-003.md
 *
 * AP2486_001 and AP2486_003 leave one Custom curve each per run (earning curves have no delete
 * control); names are unique per run. AP2486_002 saves nothing. Only curves the spec creates are edited.
 */
const FACTORS = ['0.4000', '0.3000', '0.2000', '0.1000'];

test.describe('Custom Earning Curve Empty Monthly Factor @admin @AP-2486', () => {

    test('AP2486_001_SavingACustomCurveAfterClearingOneMonthlyFactorBoxNoLongerShowsTheHttp500ErrorPage',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);
            const name = `QA-AP2486-Retest-${Date.now()}`;

            await adminUser.loginToAdminPortal();
            await curves.openCreateEarningCurve();
            await curves.setTermMonth(4);
            await curves.selectCustomType();
            await curves.enterMonthlyFactors(FACTORS);
            await curves.saveCustomEarningCurve(name, 4);
            const editUrl = await curves.openEarningCurveForEdit(name);
            await curves.verifyMonthlyFactors(FACTORS);
            await curves.clearMonthlyFactor(3);
            await curves.verifySaveRefusedForBlankFactor(3, `Earning curve #${editUrl.split('/')[3]}`);
            await curves.reopenEarningCurve(name, editUrl);
            await curves.verifyMonthlyFactors(FACTORS);
        });

    test('AP2486_002_CreatingANewCustomCurveWithLettersTypedIntoAMonthlyFactorBoxNoLongerShowsTheErrorPage',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);
            const name = `QA-AP2486-CreateEmpty-${Date.now()}`;

            await adminUser.loginToAdminPortal();
            await curves.openCreateEarningCurve();
            await curves.setTermMonth(4);
            await curves.selectCustomType();
            // Rows 1-3 typed; row 4 keeps its Custom default 0.0000 until the letters replace it.
            await curves.enterMonthlyFactors(['0.4000', '0.3000', '0.2000', '0.0000']);
            await curves.typeLettersIntoMonthlyFactor(3, 'abc');
            await curves.fillCurveDetails(name);
            await curves.verifySaveRefusedForBlankFactor(3, 'Create earning curve');
            await curves.verifyEarningCurveNotListed(name);
        });

    test('AP2486_003_EditingACustomCurveWithEveryMonthlyFactorFilledStillSavesAndKeepsTheNewValues',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);
            const name = `QA-AP2486-Valid-${Date.now()}`;
            const edited = ['0.4000', '0.3000', '0.1500', '0.1500'];
            const editedCumulative = ['0.4000', '0.7000', '0.8500', '1.0000'];

            await adminUser.loginToAdminPortal();
            await curves.openCreateEarningCurve();
            await curves.setTermMonth(4);
            await curves.selectCustomType();
            await curves.enterMonthlyFactors(FACTORS);
            await curves.saveCustomEarningCurve(name, 4);
            const editUrl = await curves.openEarningCurveForEdit(name);
            await curves.replaceMonthlyFactors({ 2: '0.1500', 3: '0.1500' });
            await curves.verifyMonthlyFactors(edited, editedCumulative);
            await curves.saveEarningCurveChanges(name);
            await curves.openEarningCurveForEdit(name, editUrl);
            await curves.verifyMonthlyFactors(edited, editedCumulative);
        });
});
