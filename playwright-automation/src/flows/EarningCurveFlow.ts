import { expect, Page, test } from '@playwright/test';
import { AdminEarningCurvePage } from '../pages/adminPortal/AdminEarningCurvePage';

/** Expected factor columns, 4 decimals, as the admin form shows them. */
export interface EarningFactors {
    monthly: string[];
    cumulative: string[];
}

const fmt = (n: number): string => n.toFixed(4);

/**
 * Oracle values from qa-artifacts/qa-docs/earning-curves.md (formulas confirmed on AP-2471):
 * Pro-Rata 1/N; Rule of 78 (N-m+1)/(N(N+1)/2); Reverse rule of 78 m/(N(N+1)/2).
 */
export function expectedFactors(type: 'Pro-Rata' | 'Rule of 78' | 'Reverse rule of 78', months: number): EarningFactors {
    const sum = (months * (months + 1)) / 2;
    const raw = Array.from({ length: months }, (_, i) => {
        const m = i + 1;
        if (type === 'Pro-Rata') return 1 / months;
        if (type === 'Rule of 78') return (months - m + 1) / sum;
        return m / sum;
    });
    let running = 0;
    const cumulative = raw.map(v => { running += v; return fmt(running); });
    return { monthly: raw.map(fmt), cumulative };
}

/**
 * Admin Earning Curve business flows (Risk Management → Earning Curves).
 * Added for AP-2485 in its own file so the QA's uncommitted AdminFlow.ts is left untouched.
 * Login stays in AdminFlow.loginToAdminPortal().
 */
export class EarningCurveFlow {
    private readonly curvesPage: AdminEarningCurvePage;

    constructor(private readonly page: Page) {
        this.curvesPage = new AdminEarningCurvePage(page);
    }

    async openCreateEarningCurve(): Promise<void> {
        await test.step('Admin opens "Create New" on the Earning Curves list', async () => {
            await this.curvesPage.openList();
            await this.curvesPage.openCreatePage();
            await expect(this.curvesPage.lblHeading, 'Create page heading').toHaveText('Create earning curve');
        });
    }

    async selectEarningCurveType(label: 'Pro-Rata' | 'Rule of 78' | 'Reverse rule of 78'): Promise<void> {
        await test.step(`Admin selects Earning curve type "${label}"`, async () => {
            await this.curvesPage.selectType(label);
            expect(await this.curvesPage.selectedTypeLabel(), 'Selected earning curve type').toBe(label);
        });
    }

    async setTermMonth(months: number): Promise<void> {
        await test.step(`Admin sets Term month to ${months} and leaves the field`, async () => {
            await this.curvesPage.setTermMonth(months);
            await expect(this.curvesPage.txtTermMonth, 'Term month').toHaveValue(String(months));
        });
    }

    /** Checks the type label, row count and every Monthly / Cumulative factor on the form. */
    async verifyEarningCurveTable(type: 'Pro-Rata' | 'Rule of 78' | 'Reverse rule of 78', months: number): Promise<void> {
        await test.step(`VERIFICATION POINT: the table shows ${type} factors for ${months} months`, async () => {
            const expected = expectedFactors(type, months);
            expect(await this.curvesPage.selectedTypeLabel(), 'Selected earning curve type').toBe(type);
            await expect(this.curvesPage.txtTermMonth, 'Term month').toHaveValue(String(months));
            expect(await this.curvesPage.monthlyFactors(), `${type} Monthly Factors (${months} months)`)
                .toEqual(expected.monthly);
            expect(await this.curvesPage.cumulativeFactors(), `${type} Cumulative Factors (${months} months)`)
                .toEqual(expected.cumulative);
        });
    }

    /** Fills Name and odometer last (each re-post can reset them), saves, and checks the list row. */
    async saveEarningCurve(name: string, months: number, type: string): Promise<void> {
        await test.step(`Admin saves earning curve "${name}"`, async () => {
            await this.curvesPage.fillDetails(name, '0', '10000');
            await this.curvesPage.save();
            await expect(this.curvesPage.lblSaved, 'Alert "Earning curve saved"').toBeVisible();
            const row = this.curvesPage.rowByName(name);
            await expect(row, `Exactly one list row for "${name}"`).toHaveCount(1);
            await expect(row, 'List row: Term month, odometer and type')
                .toContainText(new RegExp(`${name}\\s+${months}\\s+0 - 10000\\s+${type}`));
        });
    }

    /** Clicks the pencil on the curve's row and returns the edit URL (/admin/earning-curve/{id}/edit). */
    async openEarningCurveForEdit(name: string, expectedHref?: string): Promise<string> {
        return test.step(`Admin opens earning curve "${name}" for editing`, async () => {
            const href = await this.curvesPage.openEditPage(name);
            expect(href, 'Edit link of the curve').toMatch(/^\/admin\/earning-curve\/\d+\/edit$/);
            if (expectedHref) expect(href, 'Same curve id after saving the edit').toBe(expectedHref);
            const id = href.split('/')[3];
            await expect(this.curvesPage.lblHeading, 'Edit page heading').toHaveText(`Earning curve #${id}`);
            await expect(this.curvesPage.txtName, 'Name kept on the edit page').toHaveValue(name);
            return href;
        });
    }

    // ---- Added for AP-2486: Custom curves and the empty Monthly Factor ----

    async selectCustomType(): Promise<void> {
        await test.step('Admin selects Earning curve type "Custom"', async () => {
            await this.curvesPage.selectType('Custom');
            expect(await this.curvesPage.selectedTypeLabel(), 'Selected earning curve type').toBe('Custom');
            await expect(this.curvesPage.txtMonthlyFactors.first(), 'Custom Monthly Factor box editable').toBeEditable();
        });
    }

    /** Types the Custom Monthly Factors into rows 1..n (one value per row, in order). */
    async enterMonthlyFactors(factors: string[]): Promise<void> {
        await test.step(`Admin types Monthly Factors ${factors.join(' / ')}`, async () => {
            await expect(this.curvesPage.txtMonthlyFactors, 'Factor rows').toHaveCount(factors.length);
            for (const [row, value] of factors.entries()) {
                await this.curvesPage.fillMonthlyFactor(row, value);
            }
            expect(await this.curvesPage.monthlyFactors(), 'Monthly Factors typed').toEqual(factors);
        });
    }

    /** Replaces the Monthly Factor of the given rows (0-based) on the form. */
    async replaceMonthlyFactors(values: Record<number, string>): Promise<void> {
        await test.step(`Admin replaces Monthly Factors ${JSON.stringify(values)}`, async () => {
            for (const [row, value] of Object.entries(values)) {
                await this.curvesPage.fillMonthlyFactor(Number(row), value);
            }
        });
    }

    async clearMonthlyFactor(row: number): Promise<void> {
        await test.step(`Admin clears the row ${row + 1} Monthly Factor box`, async () => {
            await this.curvesPage.clearMonthlyFactor(row);
            await expect(this.curvesPage.txtMonthlyFactors.nth(row), `Row ${row + 1} Monthly Factor`).toHaveValue('');
        });
    }

    async typeLettersIntoMonthlyFactor(row: number, letters: string): Promise<void> {
        await test.step(`Admin types "${letters}" into the row ${row + 1} Monthly Factor box`, async () => {
            await this.curvesPage.typeIntoMonthlyFactor(row, letters);
            await expect(this.curvesPage.txtMonthlyFactors.nth(row), 'The number box accepted no letters')
                .toHaveValue('');
        });
    }

    /** Fills Name and odometer 0 - 60000 without saving. Call last: every re-post can reset them. */
    async fillCurveDetails(name: string): Promise<void> {
        await test.step(`Admin fills Name "${name}" and odometer 0 - 60000`, async () => {
            await this.curvesPage.fillDetails(name, '0', '60000');
            await expect(this.curvesPage.txtOdometerFrom, 'Coverage odometer from').toHaveValue('0');
            await expect(this.curvesPage.txtOdometerTo, 'Coverage odometer to').toHaveValue('60000');
        });
    }

    /** Fills Name and odometer 0 - 60000 last, saves a new Custom curve and checks its single list row. */
    async saveCustomEarningCurve(name: string, months: number): Promise<void> {
        await test.step(`Admin saves Custom earning curve "${name}"`, async () => {
            await this.curvesPage.fillDetails(name, '0', '60000');
            await this.curvesPage.save();
            await expect(this.curvesPage.lblSaved, 'Alert "Earning curve saved"').toBeVisible();
            const row = this.curvesPage.rowByName(name);
            await expect(row, `Exactly one list row for "${name}"`).toHaveCount(1);
            await expect(row, 'List row: Term month, odometer, type, enabled')
                .toContainText(new RegExp(`${name}\\s+${months}\\s+0 - 60000\\s+Custom\\s+Yes`));
        });
    }

    /** Saves the open edit page, expecting "Earning curve saved" and still one list row for the curve. */
    async saveEarningCurveChanges(name: string): Promise<void> {
        await test.step(`Admin saves the changes to "${name}"`, async () => {
            const status = await this.curvesPage.saveAndGetStatus();
            expect(status, 'Save request HTTP status').not.toBe(500);
            await expect(this.curvesPage.lblFieldErrors, 'No field message').toHaveCount(0);
            await expect(this.page, 'Back on the Earning Curves list').toHaveURL(/\/admin\/earning-curve(\?.*)?$/);
            await expect(this.curvesPage.lblSaved, 'Alert "Earning curve saved"').toBeVisible();
            await expect(this.curvesPage.rowByName(name), `Exactly one list row for "${name}"`).toHaveCount(1);
        });
    }

    /**
     * Clicks Save with one Monthly Factor box empty. The fix (AP-2486) must answer with the form again
     * (HTTP 200) and "This value should not be blank." under that box only — never the HTTP 500 page.
     */
    async verifySaveRefusedForBlankFactor(row: number, expectedHeading: string): Promise<void> {
        await test.step(`VERIFICATION POINT: Save is refused with a message under row ${row + 1}, no HTTP 500`, async () => {
            const status = await this.curvesPage.saveAndGetStatus();
            expect(status, 'Save request HTTP status (500 = the bug)').toBe(200);
            await expect(this.curvesPage.lblServerError, 'French "technical difficulties" error page').toHaveCount(0);
            await expect(this.curvesPage.lblHeading, 'Form shown again').toHaveText(expectedHeading);
            await expect(this.curvesPage.monthlyFactorError(row), `Message under row ${row + 1}`)
                .toHaveText('This value should not be blank.');
            await expect(this.curvesPage.lblFieldErrors, 'Only the empty box has a message').toHaveCount(1);
        });
    }

    async verifyMonthlyFactors(monthly: string[], cumulative?: string[]): Promise<void> {
        await test.step(`VERIFICATION POINT: Monthly Factors read ${monthly.join(' / ')}`, async () => {
            expect(await this.curvesPage.monthlyFactors(), 'Monthly Factors').toEqual(monthly);
            if (cumulative) {
                expect(await this.curvesPage.cumulativeFactors(), 'Cumulative Factors').toEqual(cumulative);
            }
        });
    }

    /** Goes back to the list and reopens the curve; the edit URL must be the same curve id. */
    async reopenEarningCurve(name: string, editUrl: string): Promise<void> {
        await test.step(`Admin reopens earning curve "${name}" from the list`, async () => {
            await this.curvesPage.openList();
            await expect(this.curvesPage.rowByName(name), `Exactly one list row for "${name}"`).toHaveCount(1);
        });
        await this.openEarningCurveForEdit(name, editUrl);
    }

    async verifyEarningCurveNotListed(name: string): Promise<void> {
        await test.step(`VERIFICATION POINT: no curve "${name}" in the list`, async () => {
            await this.curvesPage.openList();
            await expect(this.curvesPage.tblRows.first(), 'List loaded').toBeVisible();
            await expect(this.curvesPage.rowByName(name), `Rows named "${name}"`).toHaveCount(0);
        });
    }

    // ---- Added for AP-2471: menu, list page, form defaults, validation, stored curves ----

    async verifyRiskManagementMenu(): Promise<void> {
        await test.step('VERIFICATION POINT: "Earning Curves" sits in the tachometer-icon Risk Management section', async () => {
            await expect(this.curvesPage.lblRiskManagementHeading, 'Heading with the tachometer icon').toHaveCount(1);
            await expect(this.curvesPage.lblRiskManagementHeading, 'Heading text').toHaveText(/^\s*Risk Management\s*$/i);
            await expect(this.curvesPage.lnkRiskManagementItems, 'Risk Management items')
                .toHaveText(['Earning Curves', 'Earning Sets', 'Earning Groups', 'Earning Assignments']);
            await expect(this.curvesPage.lnkMenuEarningCurves.locator('i'), 'No icon on the "Earning Curves" item').toHaveCount(0);
        });
    }

    async openEarningCurvesFromMenu(): Promise<void> {
        await test.step('Admin clicks "Earning Curves" in the menu', async () => {
            await this.curvesPage.clickMenuEarningCurves();
            await expect(this.page, 'Earning Curves list URL').toHaveURL(/\/admin\/earning-curve$/);
            await expect(this.curvesPage.lblHeading, 'List page heading').toHaveText('Earning Curves');
        });
    }

    async verifyEarningCurvesListPage(): Promise<void> {
        await test.step('VERIFICATION POINT: list title, one "Create New" item, six columns and an Edit action per row', async () => {
            await this.curvesPage.openList();
            await expect(this.curvesPage.lblHeading, 'List page heading').toHaveText('Earning Curves');
            await expect(this.curvesPage.lnkListNavItems, 'Navigation items').toHaveText(['Create New']);
            await expect(this.curvesPage.lnkListNavItems.first(), '"Create New" target')
                .toHaveAttribute('href', '/admin/earning-curve/new/edit');
            await expect(this.curvesPage.lblColumnHeaders, 'Column headers in order').toHaveText(
                ['Name', 'Term month', 'Coverage odometer', 'Earning curve type', 'Is Enabled?', 'Actions']);
            const rows = await this.curvesPage.tblRows.count();
            expect(rows, 'List rows on the first page').toBeGreaterThan(0);
            await expect(this.curvesPage.tblRows.first().locator('td').nth(2), 'Coverage odometer "from - to"')
                .toHaveText(/^\s*\d+ - \d+\s*$/);
            await expect(this.curvesPage.lnkRowActions, 'One action link per row').toHaveCount(rows);
            for (const href of await this.curvesPage.lnkRowActions.evaluateAll(els => els.map(e => e.getAttribute('href')))) {
                expect(href, 'Row action is the Edit link').toMatch(/^\/admin\/earning-curve\/\d+\/edit$/);
            }
            await expect(this.curvesPage.lblRowEditTooltips, 'Tooltip "Edit" on every row action').toHaveCount(rows);
        });
    }

    async verifyNewFormDefaults(): Promise<void> {
        await test.step('VERIFICATION POINT: new form fields, defaults (Term 12, Pro-Rata, enabled) and the 12-row table', async () => {
            const p = this.curvesPage;
            await expect(p.txtName, 'Name is an empty text box').toHaveAttribute('type', 'text');
            await expect(p.txtName, 'Name empty').toHaveValue('');
            await expect(p.txtTermMonth, 'Term month is numeric').toHaveAttribute('type', 'number');
            await expect(p.txtTermMonth, 'Term month default').toHaveValue('12');
            await expect(p.txtOdometerFrom, 'Odometer from is numeric').toHaveAttribute('type', 'number');
            await expect(p.txtOdometerTo, 'Odometer to is numeric').toHaveAttribute('type', 'number');
            expect(await p.selectedTypeLabel(), 'Default earning curve type').toBe('Pro-Rata');
            await expect(p.lstTypeSelectOptions, 'Earning curve type options')
                .toHaveText(['Pro-Rata', 'Rule of 78', 'Reverse rule of 78', 'Custom']);
            // AC says "Yes/No toggle"; Dev renders one checkbox (ticked = Yes).
            await expect(p.chkIsEnabled, 'Is Enabled? is a checkbox').toHaveAttribute('type', 'checkbox');
            await expect(p.chkIsEnabled, 'Is Enabled? ticked by default').toBeChecked();
            await expect(p.lblPointsHeaders, 'Table columns').toHaveText(['Earning point', 'Monthly Factor', 'Cumulative Factor']);
            await expect(p.lblPointNumbers, 'Earning points 1-12')
                .toHaveText(Array.from({ length: 12 }, (_, i) => String(i + 1)));
            expect(await p.monthlyFactors(), 'Monthly Factors, 4 decimals').toEqual(expectedFactors('Pro-Rata', 12).monthly);
        });
    }

    async verifyMonthlyFactorsReadOnly(readOnly: boolean): Promise<void> {
        await test.step(`VERIFICATION POINT: Monthly Factor boxes are ${readOnly ? 'read-only' : 'editable'}`, async () => {
            const flags = await this.curvesPage.monthlyFactorsReadOnly();
            expect(flags.length, 'Factor rows').toBeGreaterThan(0);
            expect(flags, 'readOnly per Monthly Factor box').toEqual(flags.map(() => readOnly));
        });
    }

    async markPageForReloadCheck(): Promise<void> {
        await test.step('Admin keeps the form open (reload marker set)', async () => {
            await this.curvesPage.markPage();
        });
    }

    async verifyNoPageReload(): Promise<void> {
        await test.step('VERIFICATION POINT: the cumulative recalculated without a page reload', async () => {
            expect(await this.curvesPage.pageMarkerPresent(), 'Same page instance (no reload)').toBe(true);
        });
    }

    /** Counts every curve across the list pages. */
    async countEarningCurves(): Promise<number> {
        return test.step('Admin counts the earning curves across every list page', async () => {
            return this.curvesPage.countAllCurves();
        });
    }

    async verifyEarningCurveCount(expected: number): Promise<void> {
        await test.step(`VERIFICATION POINT: the list holds ${expected} earning curves`, async () => {
            expect(await this.curvesPage.countAllCurves(), 'Earning curves across all pages').toBe(expected);
        });
    }

    /** Fills Name and the odometer range last, saves a new curve, and returns its edit URL. */
    async saveNewEarningCurve(name: string, odometerFrom: string, odometerTo: string): Promise<string> {
        return test.step(`Admin saves earning curve "${name}" (odometer ${odometerFrom} - ${odometerTo})`, async () => {
            await this.curvesPage.fillDetails(name, odometerFrom, odometerTo);
            await this.curvesPage.save();
            await expect(this.curvesPage.lblSaved, 'Alert "Earning curve saved"').toBeVisible();
            await expect(this.curvesPage.rowByName(name), `Exactly one list row for "${name}"`).toHaveCount(1);
            const href = await this.curvesPage.rowEditHref(name);
            expect(href, 'Edit link of the new curve').toMatch(/^\/admin\/earning-curve\/\d+\/edit$/);
            return href;
        });
    }

    /** Checks the curve's list row cell by cell: Name · Term month · odometer · type · Is Enabled? */
    async verifyListRow(name: string, months: number, odometer: string, type: string, enabled: 'Yes' | 'No'): Promise<void> {
        await test.step(`VERIFICATION POINT: list row "${name} · ${months} · ${odometer} · ${type} · ${enabled}"`, async () => {
            await this.curvesPage.openList();
            await expect(this.curvesPage.rowByName(name), `Exactly one list row for "${name}"`).toHaveCount(1);
            const cells = await this.curvesPage.rowCells(name);
            expect(cells.slice(0, 5), 'Row cells').toEqual([name, String(months), odometer, type, enabled]);
            await expect(this.curvesPage.rowByName(name).locator('td:last-child a[href$="/edit"]'), 'One Edit action on the row')
                .toHaveCount(1);
            await expect(this.curvesPage.rowByName(name).locator('td:last-child [data-original-title="Edit"]'), 'Tooltip "Edit"')
                .toHaveCount(1);
        });
    }

    /** No list row on the first page (newest first) whose Name cell is exactly `name`. */
    async verifyNameNotListed(name: string): Promise<void> {
        await test.step(`VERIFICATION POINT: no list row named "${name}" on the first page`, async () => {
            await this.curvesPage.openList();
            await expect(this.curvesPage.tblRows.first(), 'List loaded').toBeVisible();
            const exact = this.curvesPage.tblRows.filter({
                has: this.page.locator('td:first-child', { hasText: new RegExp(`^\\s*${name}\\s*$`) }),
            });
            await expect(exact, `Rows named exactly "${name}"`).toHaveCount(0);
        });
    }

    async renameEarningCurve(name: string): Promise<void> {
        await test.step(`Admin renames the curve to "${name}"`, async () => {
            await this.curvesPage.fillName(name);
            await expect(this.curvesPage.txtName, 'Name').toHaveValue(name);
        });
    }

    /** Checks the stored header fields on the open edit form. */
    async verifyStoredCurveFields(months: number, type: string, odometerFrom: string, odometerTo: string): Promise<void> {
        await test.step(`VERIFICATION POINT: stored Term ${months}, type ${type}, odometer ${odometerFrom} - ${odometerTo}, enabled`, async () => {
            await expect(this.curvesPage.txtTermMonth, 'Term month').toHaveValue(String(months));
            expect(await this.curvesPage.selectedTypeLabel(), 'Earning curve type').toBe(type);
            await expect(this.curvesPage.txtOdometerFrom, 'Coverage odometer from').toHaveValue(odometerFrom);
            await expect(this.curvesPage.txtOdometerTo, 'Coverage odometer to').toHaveValue(odometerTo);
            await expect(this.curvesPage.chkIsEnabled, 'Is Enabled?').toBeChecked();
            await expect(this.curvesPage.txtMonthlyFactors, 'Factor rows').toHaveCount(months);
        });
    }

    /** Types an invalid Term month (0, -1) and Tab; the table must keep its rows. */
    async typeInvalidTermMonth(value: string, rowsKept: number): Promise<void> {
        await test.step(`Admin types Term month "${value}" and leaves the field`, async () => {
            await this.curvesPage.typeTermMonthNoRender(value);
            await expect(this.curvesPage.txtMonthlyFactors, 'Table not regenerated for an invalid term').toHaveCount(rowsKept);
        });
    }

    /** Clicks Save on the create form; it must re-show the form with `message` under `fieldName` and no error page. */
    async verifySaveRefusedWithFieldError(fieldName: string, message: string): Promise<void> {
        await test.step(`VERIFICATION POINT: Save refused with "${message}" under ${fieldName}`, async () => {
            const status = await this.curvesPage.saveAndGetStatus();
            expect(status, 'Save request HTTP status').toBeLessThan(500);
            await expect(this.curvesPage.lblServerError, 'French "technical difficulties" error page').toHaveCount(0);
            await expect(this.curvesPage.lblHeading, 'Create form shown again').toHaveText('Create earning curve');
            await expect(this.curvesPage.fieldError(fieldName), `Message under ${fieldName}`).toHaveText(message);
            await expect(this.curvesPage.lblSaved, 'No "Earning curve saved" alert').toHaveCount(0);
        });
    }

    async verifyDetailsKept(name: string): Promise<void> {
        await test.step('VERIFICATION POINT: Name and odometer survive the re-render', async () => {
            await expect(this.curvesPage.txtName, 'Name').toHaveValue(name);
            await expect(this.curvesPage.txtOdometerFrom, 'Coverage odometer from').toHaveValue('0');
            await expect(this.curvesPage.txtOdometerTo, 'Coverage odometer to').toHaveValue('10000');
        });
    }
}
