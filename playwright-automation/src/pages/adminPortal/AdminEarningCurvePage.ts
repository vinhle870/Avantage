import { Locator, Page } from '@playwright/test';
import { clickSidebarLink } from '../../core/utils/uiActions';

/**
 * Admin Earning Curves - the list (/admin/earning-curve) and the create / edit form
 * (/admin/earning-curve/new/edit, /admin/earning-curve/{id}/edit).
 * Added for AP-2485. Locators confirmed on Dev (v2dev) with a match count of 1.
 *
 * Changing the type, or the Term month followed by Tab, POSTs the whole form and
 * re-renders the page server side; the actions below wait for that re-render.
 */
export class AdminEarningCurvePage {
    static readonly LIST = '/admin/earning-curve';

    private page: Page;

    // List page
    readonly lnkCreateNew: Locator;
    readonly tblRows: Locator;
    readonly lblSaved: Locator;

    // Create / edit form
    readonly lblHeading: Locator;
    readonly txtName: Locator;
    readonly txtTermMonth: Locator;
    readonly txtOdometerFrom: Locator;
    readonly txtOdometerTo: Locator;
    readonly selType: Locator;
    readonly btnTypeToggle: Locator;
    readonly lstTypeOptions: Locator;
    readonly txtMonthlyFactors: Locator;
    readonly txtCumulativeFactors: Locator;
    readonly btnSave: Locator;

    // Added for AP-2486: field messages on the re-rendered form, and the French HTTP 500 page
    readonly lblFieldErrors: Locator;
    readonly lblServerError: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lnkCreateNew = page.locator('main a.btn.btn-primary[href="/admin/earning-curve/new/edit"]');
        this.tblRows = page.locator('main table tbody tr');
        this.lblSaved = page.locator('[role="alert"]', { hasText: 'Earning curve saved' });

        this.lblHeading = page.locator('main h1');
        this.txtName = page.locator('input[name="earning_curve[name]"]');
        this.txtTermMonth = page.locator('input[name="earning_curve[termMonth]"]');
        this.txtOdometerFrom = page.locator('input[name="earning_curve[coverageOdometerFrom]"]');
        this.txtOdometerTo = page.locator('input[name="earning_curve[coverageOdometerTo]"]');
        this.selType = page.locator('select[name="earning_curve[type]"]');
        this.btnTypeToggle = page.locator('.bootstrap-select:has(select[name="earning_curve[type]"]) button.dropdown-toggle');
        this.lstTypeOptions = page.locator('.dropdown-menu.show a.dropdown-item');
        this.txtMonthlyFactors = page.locator('input[name$="[monthlyFactor]"]');
        this.txtCumulativeFactors = page.locator('input[name$="[cumulativeFactor]"]');
        this.btnSave = page.locator('button[name="earning_curve[save]"]');
        this.lblFieldErrors = page.locator('.invalid-feedback');
        this.lblServerError = page.getByText(/éprouve des difficultés techniques/);
    }

    async openList(): Promise<void> {
        await this.page.goto(AdminEarningCurvePage.LIST);
    }

    async openCreatePage(): Promise<void> {
        await this.lnkCreateNew.click();
        await this.page.waitForURL('**/admin/earning-curve/new/edit');
    }

    /** First row of the list (newest first) whose text contains the curve name. */
    rowByName(name: string): Locator {
        return this.tblRows.filter({ hasText: name });
    }

    /** Clicks the pencil (Edit) button of the curve's row and returns the edit URL. */
    async openEditPage(name: string): Promise<string> {
        const edit = this.rowByName(name).first().locator('a[href$="/edit"]');
        const href = (await edit.getAttribute('href')) ?? '';
        await edit.click();
        await this.page.waitForURL(`**${href}`);
        return href;
    }

    /** Runs an action that re-posts the form, then waits until the old factor table is replaced. */
    private async reRender(action: () => Promise<void>): Promise<void> {
        const before = await this.txtMonthlyFactors.first().elementHandle();
        await action();
        if (before) {
            await this.page.waitForFunction(el => !el.isConnected, before);
            await before.dispose();
        }
        await this.page.waitForLoadState('load');
        await this.txtMonthlyFactors.first().waitFor({ state: 'visible' });
    }

    /** Selects an Earning curve type label ("Pro-Rata", "Rule of 78", "Reverse rule of 78"). */
    async selectType(label: string): Promise<void> {
        await this.reRender(async () => {
            await this.btnTypeToggle.click();
            await this.lstTypeOptions.filter({ hasText: new RegExp(`^\\s*${label}\\s*$`) }).click();
        });
    }

    /** Sets Term month and leaves the field with Tab, which re-posts the form. */
    async setTermMonth(months: number): Promise<void> {
        await this.reRender(async () => {
            await this.txtTermMonth.fill(String(months));
            await this.txtTermMonth.press('Tab');
        });
    }

    async selectedTypeLabel(): Promise<string> {
        return (await this.btnTypeToggle.innerText()).trim();
    }

    async monthlyFactors(): Promise<string[]> {
        return this.txtMonthlyFactors.evaluateAll(els => els.map(e => (e as HTMLInputElement).value));
    }

    async cumulativeFactors(): Promise<string[]> {
        return this.txtCumulativeFactors.evaluateAll(els => els.map(e => (e as HTMLInputElement).value));
    }

    /** Fills Name and the odometer range. Call last, right before Save: every re-post can reset them. */
    async fillDetails(name: string, odometerFrom: string, odometerTo: string): Promise<void> {
        await this.txtName.fill(name);
        await this.txtOdometerFrom.fill(odometerFrom);
        await this.txtOdometerTo.fill(odometerTo);
    }

    async save(): Promise<void> {
        await this.btnSave.click();
        await this.page.waitForURL(/\/admin\/earning-curve(\?.*)?$/);
    }

    // ---- Added for AP-2486 (Custom factors, field errors). Confirmed on Dev (v2dev). ----

    /** Field message under the Monthly Factor box of a row (0-based index). */
    monthlyFactorError(row: number): Locator {
        return this.page.locator(
            `td:has(> input[name="earning_curve[points][${row}][monthlyFactor]"]) .form-error-message`);
    }

    /** Replaces the value of a Monthly Factor box (Custom type only; cumulative recalculates client side). */
    async fillMonthlyFactor(row: number, value: string): Promise<void> {
        await this.txtMonthlyFactors.nth(row).fill(value);
    }

    /** Empties a Monthly Factor box and leaves it with Tab (a factor box does not re-post the form). */
    async clearMonthlyFactor(row: number): Promise<void> {
        await this.txtMonthlyFactors.nth(row).fill('');
        await this.txtMonthlyFactors.nth(row).press('Tab');
    }

    /** Empties a Monthly Factor box, types text key by key, and leaves it with Tab. */
    async typeIntoMonthlyFactor(row: number, text: string): Promise<void> {
        await this.txtMonthlyFactors.nth(row).fill('');
        await this.txtMonthlyFactors.nth(row).pressSequentially(text);
        await this.txtMonthlyFactors.nth(row).press('Tab');
    }

    /** Clicks Save and returns the HTTP status of the form POST, without assuming where it lands. */
    async saveAndGetStatus(): Promise<number> {
        const [response] = await Promise.all([
            this.page.waitForResponse(r => r.request().method() === 'POST'
                && /\/admin\/earning-curve\/(new|\d+)\/edit$/.test(new URL(r.url()).pathname)),
            this.btnSave.click(),
        ]);
        await this.page.waitForLoadState('load');
        return response.status();
    }

    // ---- Added for AP-2471 (menu, list page, form defaults, validation). Confirmed on Dev (v2dev). ----

    /** Sidebar heading of the Risk Management section (the tachometer icon sits on it). */
    get lblRiskManagementHeading(): Locator {
        return this.page.locator('h6.nav-link:has(i.fa-tachometer-alt-average)');
    }

    /** The items of the flyout that holds "Earning Curves". */
    get lnkRiskManagementItems(): Locator {
        return this.page.locator('ul.nav-dropdown-items:has(a[href="/admin/earning-curve"]) > li > a.nav-link');
    }

    get lnkMenuEarningCurves(): Locator {
        return this.page.locator('a.nav-link[href="/admin/earning-curve"]');
    }

    /** Navigation items above the list ("Create New"). */
    get lnkListNavItems(): Locator {
        return this.page.locator('main ul.nav a');
    }

    get lblColumnHeaders(): Locator {
        return this.page.locator('main table thead th');
    }

    get lnkLastPage(): Locator {
        return this.page.locator('.pagination a', { hasText: /^\s*Last\s*$/ });
    }

    get chkIsEnabled(): Locator {
        return this.page.locator('input[name="earning_curve[isEnabled]"]');
    }

    get lstTypeSelectOptions(): Locator {
        return this.selType.locator('option');
    }

    get lblPointsHeaders(): Locator {
        return this.page.locator('form table thead th');
    }

    get lblPointNumbers(): Locator {
        return this.page.locator('tr.earning-curve-point-row > td:first-child');
    }

    /** Field message under the input named `fieldName` (e.g. "earning_curve[name]"). */
    fieldError(fieldName: string): Locator {
        return this.page.locator(`input[name="${fieldName}"]`)
            .locator('xpath=ancestor::*[.//*[contains(@class,"form-error-message")]][1]')
            .locator('.form-error-message');
    }

    /** The Actions cell links of every list row. */
    get lnkRowActions(): Locator {
        return this.tblRows.locator('td:last-child a');
    }

    /** The tooltip wrappers of every row's Edit link. */
    get lblRowEditTooltips(): Locator {
        return this.tblRows.locator('td:last-child [data-original-title="Edit"]');
    }

    /** Opens the Risk Management flyout (the sidebar collapses after load) and clicks "Earning Curves". */
    async clickMenuEarningCurves(): Promise<void> {
        await clickSidebarLink(this.page, AdminEarningCurvePage.LIST);
        await this.page.waitForURL('**/admin/earning-curve');
    }

    /** Cell texts of the first list row matching the name. */
    async rowCells(name: string): Promise<string[]> {
        return (await this.rowByName(name).first().locator('td').allInnerTexts()).map(t => t.trim());
    }

    /** Edit link (/admin/earning-curve/{id}/edit) of the first list row matching the name. */
    async rowEditHref(name: string): Promise<string> {
        return (await this.rowByName(name).first().locator('a[href$="/edit"]').getAttribute('href')) ?? '';
    }

    /** Counts every curve across the list pages (10 rows per page). Leaves the browser on the last page. */
    async countAllCurves(): Promise<number> {
        await this.openList();
        await this.tblRows.first().waitFor({ state: 'visible' });
        if (await this.lnkLastPage.count() === 0) return this.tblRows.count();
        const href = (await this.lnkLastPage.getAttribute('href')) ?? '';
        const last = Number(new URL(href, this.page.url()).searchParams.get('page') ?? '1');
        const perPage = await this.tblRows.count();
        await this.page.goto(`${AdminEarningCurvePage.LIST}?page=${last}`);
        await this.tblRows.first().waitFor({ state: 'visible' });
        return perPage * (last - 1) + await this.tblRows.count();
    }

    /** Types a Term month and leaves the field with Tab, without waiting for a re-render (invalid terms do not re-render). */
    async typeTermMonthNoRender(value: string): Promise<void> {
        await this.txtTermMonth.fill(value);
        await this.txtTermMonth.press('Tab');
        await this.page.waitForLoadState('networkidle');
    }

    async fillName(name: string): Promise<void> {
        await this.txtName.fill(name);
    }

    /** Puts a marker on the window; it disappears if the page reloads. */
    async markPage(): Promise<void> {
        await this.page.evaluate(() => { (window as unknown as Record<string, unknown>).__qaNoReload = true; });
    }

    async pageMarkerPresent(): Promise<boolean> {
        return this.page.evaluate(() => (window as unknown as Record<string, unknown>).__qaNoReload === true);
    }

    /** readOnly flag of every Monthly Factor box. */
    async monthlyFactorsReadOnly(): Promise<boolean[]> {
        return this.txtMonthlyFactors.evaluateAll(els => els.map(e => (e as HTMLInputElement).readOnly));
    }
}
