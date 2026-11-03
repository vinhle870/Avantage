import { test } from '../../core/fixtures/test-fixtures';
import { EarningCurveFlow } from '../../flows/EarningCurveFlow';

/**
 * Admin Earning Curve management — automated from AP-2471 manual test cases (Dev, 2026-11-02).
 * Source: qa-artifacts/3-test-cases/AP2471_TestCases_001-005.md, _006-010.md, _011-015.md, _016-017.md
 *
 * Earning curves cannot be deleted. Creations are kept to the minimum each case needs:
 * AP2471_001-009 save nothing; AP2471_010, _011, _012, _013 (attempt D only), _014, _016 and _017
 * leave exactly one curve each per run (7 per run), named QA-AP2471-<case>-<epoch ms>.
 * Only curves this spec creates are edited. AP2471_015 (delete) was SKIPPED manually — not automated.
 */
const FACTORS = ['0.4000', '0.3000', '0.2000', '0.1000'];
const FACTORS_CUMULATIVE = ['0.4000', '0.7000', '0.9000', '1.0000'];
const zeros = (n: number): string[] => Array.from({ length: n }, () => '0.0000');

test.describe('Earning Curve Management @admin @AP-2471', () => {

    test('AP2471_001_TheAdminMenuShowsEarningCurvesUnderTheTachometerIconRiskManagementSectionAndOpensTheList',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);

            await adminUser.loginToAdminPortal();
            await curves.verifyRiskManagementMenu();
            await curves.openEarningCurvesFromMenu();
        });

    test('AP2471_002_TheEarningCurvesPageShowsItsTitleACreateNewItemAndAListWithTheSixRequiredColumns',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);

            await adminUser.loginToAdminPortal();
            await curves.verifyEarningCurvesListPage();
        });

    test('AP2471_003_ANewEarningCurveFormOpensWithTermMonth12TypeProRataAndA12RowEarningPointsTable',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);

            await adminUser.loginToAdminPortal();
            await curves.openCreateEarningCurve();
            await curves.verifyNewFormDefaults();
            await curves.verifyMonthlyFactorsReadOnly(true);
        });

    test('AP2471_004_A12MonthProRataCurveEarns8_3333PercentEveryMonthAndTheCumulativeReaches100Percent',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);

            await adminUser.loginToAdminPortal();
            await curves.openCreateEarningCurve();
            await curves.verifyEarningCurveTable('Pro-Rata', 12);
            await curves.selectEarningCurveType('Rule of 78');
            await curves.selectEarningCurveType('Pro-Rata');
            await curves.verifyEarningCurveTable('Pro-Rata', 12);
        });

    test('AP2471_005_ChoosingRuleOf78OnA12MonthCurveFrontLoadsEarning',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);

            await adminUser.loginToAdminPortal();
            await curves.openCreateEarningCurve();
            await curves.selectEarningCurveType('Rule of 78');
            await curves.verifyMonthlyFactorsReadOnly(true);
            await curves.verifyEarningCurveTable('Rule of 78', 12);
        });

    test('AP2471_006_ChoosingReverseRuleOf78OnA12MonthCurveBackLoadsEarningWithMonth8CumulativeAt46_15Percent',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);

            await adminUser.loginToAdminPortal();
            await curves.openCreateEarningCurve();
            await curves.selectEarningCurveType('Reverse rule of 78');
            // The oracle gives row 8 cumulative 0.4615 (the formula), not the ticket's 53.85 typo.
            await curves.verifyEarningCurveTable('Reverse rule of 78', 12);
        });

    test('AP2471_007_ChangingTermMonthTo24RebuildsTheTableWith24RowsAndRecalculatesRuleOf78Over300',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);

            await adminUser.loginToAdminPortal();
            await curves.openCreateEarningCurve();
            await curves.selectEarningCurveType('Rule of 78');
            await curves.verifyEarningCurveTable('Rule of 78', 12);
            await curves.setTermMonth(24);
            await curves.verifyEarningCurveTable('Rule of 78', 24);
            await curves.selectEarningCurveType('Pro-Rata');
            await curves.verifyEarningCurveTable('Pro-Rata', 24);
        });

    test('AP2471_008_A1MonthTermGivesOneRowOf100PercentForEachPredefinedTypeAndA60MonthTermGives60Rows',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);

            await adminUser.loginToAdminPortal();
            await curves.openCreateEarningCurve();
            await curves.setTermMonth(1);
            await curves.verifyEarningCurveTable('Pro-Rata', 1);
            await curves.selectEarningCurveType('Rule of 78');
            await curves.verifyEarningCurveTable('Rule of 78', 1);
            await curves.selectEarningCurveType('Reverse rule of 78');
            await curves.verifyEarningCurveTable('Reverse rule of 78', 1);
            await curves.setTermMonth(60);
            await curves.selectEarningCurveType('Rule of 78');
            await curves.verifyEarningCurveTable('Rule of 78', 60);
        });

    test('AP2471_009_WithTheCustomTypeTheMonthlyFactorsBecomeEditableAndTheCumulativeRecalculatesOnEveryChange',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);

            await adminUser.loginToAdminPortal();
            await curves.openCreateEarningCurve();
            await curves.setTermMonth(4);
            await curves.selectCustomType();
            await curves.verifyMonthlyFactorsReadOnly(false);
            await curves.verifyMonthlyFactors(zeros(4), zeros(4));
            await curves.enterMonthlyFactors(FACTORS);
            await curves.verifyMonthlyFactors(FACTORS, FACTORS_CUMULATIVE);
            await curves.markPageForReloadCheck();
            await curves.replaceMonthlyFactors({ 1: '0.2500' });
            await curves.verifyMonthlyFactors(['0.4000', '0.2500', '0.2000', '0.1000'], ['0.4000', '0.6500', '0.8500', '0.9500']);
            await curves.verifyNoPageReload();
            // Nothing is saved: the page is left without clicking Save.
        });

    test('AP2471_010_ACustomCurveWithTypedFactorsSavesAndReopeningItShowsTheSameFactors',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);
            const name = `QA-AP2471-Custom-${Date.now()}`;

            await adminUser.loginToAdminPortal();
            await curves.openCreateEarningCurve();
            await curves.setTermMonth(4);
            await curves.selectCustomType();
            await curves.enterMonthlyFactors(FACTORS);
            await curves.verifyMonthlyFactors(FACTORS, FACTORS_CUMULATIVE);
            await curves.saveCustomEarningCurve(name, 4);
            await curves.openEarningCurveForEdit(name);
            await curves.verifyStoredCurveFields(4, 'Custom', '0', '60000');
            await curves.verifyMonthlyFactors(FACTORS, FACTORS_CUMULATIVE);
        });

    test('AP2471_011_ASavedProRataCurveAppearsInTheListWithItsNameTermOdometerRangeTypeAndEnabledState',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);
            const name = `QA-AP2471-ProRata-${Date.now()}`;

            await adminUser.loginToAdminPortal();
            await curves.openCreateEarningCurve();
            await curves.setTermMonth(36);
            await curves.verifyEarningCurveTable('Pro-Rata', 36);
            await curves.saveNewEarningCurve(name, '0', '100000');
            await curves.verifyListRow(name, 36, '0 - 100000', 'Pro-Rata', 'Yes');
        });

    test('AP2471_012_EditingASavedCurvesNameAndTypeThroughEditStoresTheChangeAndUpdatesItsListRow',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);
            const stamp = Date.now();
            const name = `QA-AP2471-ProRata-${stamp}`;
            const edited = `QA-AP2471-Edited-${stamp}`;

            await adminUser.loginToAdminPortal();
            await curves.openCreateEarningCurve();
            await curves.setTermMonth(36);
            const editUrl = await curves.saveNewEarningCurve(name, '0', '100000');
            const count = await curves.countEarningCurves();
            await curves.reopenEarningCurve(name, editUrl);
            await curves.verifyStoredCurveFields(36, 'Pro-Rata', '0', '100000');
            await curves.verifyEarningCurveTable('Pro-Rata', 36);
            await curves.selectEarningCurveType('Rule of 78');
            await curves.verifyEarningCurveTable('Rule of 78', 36);
            await curves.renameEarningCurve(edited);
            await curves.saveEarningCurveChanges(edited);
            await curves.verifyListRow(edited, 36, '0 - 100000', 'Rule of 78', 'Yes');
            await curves.verifyNameNotListed(name);
            await curves.verifyEarningCurveCount(count);
            await curves.reopenEarningCurve(edited, editUrl);
            await curves.verifyEarningCurveTable('Rule of 78', 36);
        });

    test('AP2471_013_ABlankNameAZeroOrNegativeTermAndAnInvertedOdometerRangeCauseNoErrorPage',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);
            const stamp = Date.now();
            const refused = `QA-AP2471-Neg-Term-${stamp}`;
            const range = `QA-AP2471-Neg-Range-${stamp}`;

            await adminUser.loginToAdminPortal();
            const count = await curves.countEarningCurves();

            // Attempt A — blank name: refused with a message under Name.
            await curves.openCreateEarningCurve();
            await curves.fillCurveDetails('');
            await curves.verifySaveRefusedWithFieldError('earning_curve[name]', 'This value should not be blank.');

            // Attempt B — Term month 0: the table keeps 12 rows; Save is refused under Term month.
            await curves.openCreateEarningCurve();
            await curves.typeInvalidTermMonth('0', 12);
            await curves.fillCurveDetails(refused);
            await curves.verifySaveRefusedWithFieldError('earning_curve[termMonth]', 'This value should be between 1 and 999.');

            // Attempt C — Term month -1: same.
            await curves.openCreateEarningCurve();
            await curves.typeInvalidTermMonth('-1', 12);
            await curves.fillCurveDetails(refused);
            await curves.verifySaveRefusedWithFieldError('earning_curve[termMonth]', 'This value should be between 1 and 999.');
            await curves.verifyEarningCurveCount(count);

            // Attempt D — odometer from 50000 to 10000: saved exactly as typed (no from <= to rule on Dev).
            await curves.openCreateEarningCurve();
            await curves.saveNewEarningCurve(range, '50000', '10000');
            await curves.verifyListRow(range, 12, '50000 - 10000', 'Pro-Rata', 'Yes');
            await curves.verifyNameNotListed(refused);
            await curves.verifyEarningCurveCount(count + 1);
        });

    test('AP2471_014_CustomFactorsTotalling90PercentANegativeFactorAndAnEmptiedFactorBoxCauseNoErrorPage',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);
            const name = `QA-AP2471-Neg-Custom90-${Date.now()}`;
            const negative = ['0.4000', '0.3000', '0.1000', '-0.0500'];
            const negativeCumulative = ['0.4000', '0.7000', '0.8000', '0.7500'];

            await adminUser.loginToAdminPortal();
            await curves.openCreateEarningCurve();
            await curves.setTermMonth(4);
            await curves.selectCustomType();
            // Attempt 1 — total 90%: saves with no warning.
            await curves.enterMonthlyFactors(['0.4000', '0.3000', '0.1000', '0.1000']);
            await curves.verifyMonthlyFactors(['0.4000', '0.3000', '0.1000', '0.1000'], ['0.4000', '0.7000', '0.8000', '0.9000']);
            await curves.saveCustomEarningCurve(name, 4);
            // Attempt 2 — a negative factor: saves with no warning.
            const editUrl = await curves.openEarningCurveForEdit(name);
            await curves.replaceMonthlyFactors({ 3: '-0.0500' });
            await curves.verifyMonthlyFactors(negative, negativeCumulative);
            await curves.saveEarningCurveChanges(name);
            // Attempt 3 — letters typed into the number box leave it empty: refused under that box, no HTTP 500.
            await curves.openEarningCurveForEdit(name, editUrl);
            await curves.typeLettersIntoMonthlyFactor(3, 'abc');
            await curves.verifySaveRefusedForBlankFactor(3, `Earning curve #${editUrl.split('/')[3]}`);
            // The curve holds the last attempt that saved.
            await curves.reopenEarningCurve(name, editUrl);
            await curves.verifyStoredCurveFields(4, 'Custom', '0', '60000');
            await curves.verifyMonthlyFactors(negative, negativeCumulative);
        });

    test('AP2471_016_SwitchingTypedCustomFactorsToProRataAndBackThenSavingStoresExactlyWhatTheFormShowed',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);
            const name = `QA-AP2471-Switch-${Date.now()}`;

            await adminUser.loginToAdminPortal();
            await curves.openCreateEarningCurve();
            await curves.setTermMonth(4);
            await curves.selectCustomType();
            await curves.enterMonthlyFactors(FACTORS);
            await curves.verifyMonthlyFactors(FACTORS, FACTORS_CUMULATIVE);
            await curves.selectEarningCurveType('Pro-Rata');
            await curves.verifyEarningCurveTable('Pro-Rata', 4);
            await curves.verifyMonthlyFactorsReadOnly(true);
            await curves.selectCustomType();
            await curves.verifyMonthlyFactors(zeros(4), zeros(4));
            await curves.saveCustomEarningCurve(name, 4);
            await curves.openEarningCurveForEdit(name);
            await curves.verifyStoredCurveFields(4, 'Custom', '0', '60000');
            await curves.verifyMonthlyFactors(zeros(4), zeros(4));
        });

    test('AP2471_017_ShorteningASaved4MonthCustomCurveTo3MonthsStoresExactly3FactorsMatchingWhatTheFormShowed',
        async ({ adminUser, page }) => {
            const curves = new EarningCurveFlow(page);
            const name = `QA-AP2471-Shorten-${Date.now()}`;

            await adminUser.loginToAdminPortal();
            await curves.openCreateEarningCurve();
            await curves.setTermMonth(4);
            await curves.selectCustomType();
            await curves.enterMonthlyFactors(FACTORS);
            await curves.saveCustomEarningCurve(name, 4);
            const editUrl = await curves.openEarningCurveForEdit(name);
            await curves.verifyMonthlyFactors(FACTORS, FACTORS_CUMULATIVE);
            await curves.setTermMonth(3);
            await curves.verifyStoredCurveFields(3, 'Custom', '0', '60000');
            await curves.verifyMonthlyFactors(zeros(3), zeros(3));
            await curves.saveEarningCurveChanges(name);
            await curves.verifyListRow(name, 3, '0 - 60000', 'Custom', 'Yes');
            await curves.openEarningCurveForEdit(name, editUrl);
            await curves.verifyStoredCurveFields(3, 'Custom', '0', '60000');
            await curves.verifyMonthlyFactors(zeros(3), zeros(3));
        });
});
