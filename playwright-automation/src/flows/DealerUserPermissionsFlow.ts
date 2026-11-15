import { expect, Locator, Page, Response, test } from '@playwright/test';
import { config } from '../data/config';
import { AdminDealerUsersListPage } from '../pages/adminPortal/AdminDealerUsersListPage';
import { AdminDealerUserDetailsPage, DealerRow } from '../pages/adminPortal/AdminDealerUserDetailsPage';
import { AdminDealerUsersTabPage } from '../pages/adminPortal/AdminDealerUsersTabPage';
import { AdminUserLinkModal, FormSignature, RoleCheckbox } from '../pages/adminPortal/AdminUserLinkModal';
import { LINK_ACTION_PATH, LINK_ACTIONS, LinkAction, RowButton, UserLinkActions } from '../pages/adminPortal/UserLinkActions';

/** A user-to-dealer link as read from one table row. */
export type LinkRow = { badges: string[]; buttons: RowButton[]; linkId: number | null };
export type MultiDealerUser = { id: number; email: string; dealers: DealerRow[] };
export type OpenedForm = { route: string; heading: string; signature: FormSignature };

/** Routes whose non-GET request means a form was submitted (saved / unlinked / linked). */
const SUBMIT_ROUTE = /^\/admin\/(auto-shield|rate-user|edit-permission|unlink-permission)\/\d+|^\/admin\/dealer-user\/\d+\/edit|^\/admin\/dealer\/\d+\/link-user/;
/** Same-origin paths that belong to the Cloudflare beacon and the chat widget, not to the application. */
const NOT_APP_PATH = /^\/cdn-cgi\/|widget|webchat/i;

/** One discovery per worker: AP2441_002, _010 and _012 share the multi-dealer user. */
let multiDealerUserCache: MultiDealerUser | null | undefined;

const sorted = (a: string[]): string[] => [...a].sort();

/**
 * Admin Portal — managing a dealer user's links from the Dealer User Details page (AP-2441), Dev (v2dev).
 * Added in its own file so the QA's AdminFlow.ts stays untouched; the login stays in
 * AdminFlow.loginToAdminPortal().
 *
 * Hard assertions are only what AP2441_TestCases_*.md judges: rows listed / not listed, the four action
 * routes present and matching the Dealer > Users row (same link id, tooltip and icon — compared with each
 * other, never with English text), no "Edit user" button and no row button opening the user's edit form,
 * the same form opened from both pages, role badges equal to the step-1 set, a dealer row click opening
 * that dealer, no HTTP 5xx from the application, and nothing submitted in the read-only cases.
 * Everything a case marks record-only — headings, URLs, tooltips' order, the header "Edit user" button,
 * flash messages, landing pages, the Unlink confirmation wording — goes to test.info().annotations.
 * No assertion depends on the UI language: actions are found by route, roles by checkbox value or by the
 * badge text read in the same run.
 */
export class DealerUserPermissionsFlow {
    readonly list: AdminDealerUsersListPage;
    readonly details: AdminDealerUserDetailsPage;
    readonly dealerTab: AdminDealerUsersTabPage;
    readonly modal: AdminUserLinkModal;

    private readonly appOrigin = new URL(config.baseUrl).origin;
    private readonly serverErrors: string[] = [];
    private readonly otherServerErrors: string[] = [];
    private readonly submissions: string[] = [];

    constructor(private readonly page: Page) {
        this.list = new AdminDealerUsersListPage(page);
        this.details = new AdminDealerUserDetailsPage(page);
        this.dealerTab = new AdminDealerUsersTabPage(page);
        this.modal = new AdminUserLinkModal(page);

        page.on('response', r => {
            if (r.status() < 500) return;
            const u = new URL(r.url());
            const entry = `${r.status()} ${r.request().method()} ${r.url()}`;
            (u.origin === this.appOrigin && !NOT_APP_PATH.test(u.pathname) ? this.serverErrors : this.otherServerErrors).push(entry);
        });
        page.on('request', r => {
            if (r.method() === 'GET') return;
            const u = new URL(r.url());
            if (u.origin === this.appOrigin && SUBMIT_ROUTE.test(u.pathname)) this.submissions.push(`${r.method()} ${u.pathname}`);
        });
    }

    // ── Records and shared checks ───────────────────────────────────────────

    record(type: string, description: string): void {
        test.info().annotations.push({ type, description });
    }

    private expectNot5xx(response: Response | null, label: string): void {
        expect(response, `${label}: a response was received`).not.toBeNull();
        expect(response!.status(), `${label}: HTTP status`).toBeLessThan(500);
    }

    /** No response from the application itself answered 5xx. A 5xx from the widget / beacon is recorded only. */
    verifyNoServerError(): void {
        for (const e of this.otherServerErrors) this.record('Third-party HTTP 5xx (not judged)', e);
        expect(this.serverErrors, 'Application responses with HTTP 5xx during the test').toEqual([]);
    }

    /** Read-only cases: no Auto Shield / Deal your rate / permissions / unlink / edit-user / link form was submitted. */
    verifyNothingSubmitted(): void {
        expect(this.submissions, 'Forms submitted during a read-only case').toEqual([]);
    }

    /** Clicks and waits for the next main-frame document response (redirects skipped) — no URL filter. */
    private async clickAndWaitForNavigation(target: Locator): Promise<Response> {
        const main = this.page.mainFrame();
        const [response] = await Promise.all([
            this.page.waitForResponse(r => r.request().isNavigationRequest() && r.frame() === main
                && (r.status() < 300 || r.status() >= 400)),
            this.page.waitForEvent('framenavigated', f => f === main),
            target.click(),
        ]);
        await this.page.waitForLoadState('domcontentloaded');
        return response;
    }

    private async flashText(): Promise<string> {
        return await this.modal.lblFlash.count() > 0
            ? (await this.modal.lblFlash.first().innerText()).replace(/\s+/g, ' ').trim() : '(none)';
    }

    private linkIdOf(buttons: RowButton[]): number | null {
        const b = buttons.find(x => x.path.startsWith(LINK_ACTION_PATH.editPermissions));
        return b ? Number(b.path.slice(LINK_ACTION_PATH.editPermissions.length)) : null;
    }

    private async readRow(row: Locator): Promise<LinkRow> {
        const buttons = await UserLinkActions.readButtons(row);
        return { badges: await UserLinkActions.readBadges(row), buttons, linkId: this.linkIdOf(buttons) };
    }

    // ── Dealer Details > Users ──────────────────────────────────────────────

    async openDealerUsersTab(dealerId: number): Promise<void> {
        await test.step(`Admin opens /admin/dealer/${dealerId}/users`, async () => {
            this.expectNot5xx(await this.dealerTab.open(dealerId), `/admin/dealer/${dealerId}/users`);
        });
    }

    /**
     * Hard: the user is listed on the dealer's Users tab (the cases' step-1 test-data check).
     * Recorded: heading, role badges, buttons (route, tooltip, icon) and the link id.
     */
    async readUserRowOnDealerTab(dealerId: number, email: string, label = 'Dealer > Users row'): Promise<LinkRow> {
        return test.step(`Admin reads ${email}'s row on /admin/dealer/${dealerId}/users`, async () => {
            await this.openDealerUsersTab(dealerId);
            const row = this.dealerTab.userRow(email);
            await expect(row, `BLOCKED — test data missing on Dev: ${email} not linked to dealer ${dealerId}`).toHaveCount(1);
            const read = await this.readRow(row);
            this.record(`${label} — heading`, (await this.dealerTab.lblHeading.innerText()).trim());
            this.record(`${label} — roles`, `${read.badges.length}: ${read.badges.join(', ')}`);
            this.record(`${label} — buttons`, read.buttons.map(b => `"${b.tooltip}" ${b.path} (${b.icon})`).join(' | '));
            return read;
        });
    }

    async isUserListedOnDealerTab(dealerId: number, email: string): Promise<boolean> {
        await this.openDealerUsersTab(dealerId);
        return await this.dealerTab.userRow(email).count() > 0;
    }

    async readDealerUserEmails(dealerId: number): Promise<string[]> {
        return test.step(`Admin reads every user of dealer ${dealerId}`, async () => {
            await this.openDealerUsersTab(dealerId);
            const emails = await this.dealerTab.readUserEmails();
            this.record(`Dealer ${dealerId} users`, emails.join(', ') || '(none)');
            return emails;
        });
    }

    /** Hard: the page lists every user from `expected`, and lists / does not list `email`. */
    async verifyDealerUsers(dealerId: number, email: string, listed: boolean, others: string[]): Promise<void> {
        await test.step(`Dealer ${dealerId} Users tab ${listed ? 'lists' : 'no longer lists'} ${email}`, async () => {
            await this.openDealerUsersTab(dealerId);
            await expect(this.dealerTab.userRow(email), `${email} on dealer ${dealerId}`).toHaveCount(listed ? 1 : 0);
            const now = await this.dealerTab.readUserEmails();
            for (const o of others) expect(now, `Other user ${o} still on dealer ${dealerId}`).toContain(o);
            this.record(`Dealer ${dealerId} users now`, now.join(', ') || '(none)');
        });
    }

    // ── Dealer users list and User Details ─────────────────────────────────

    /** Searches the list by e-mail (the dialog must be submitted) and returns the number of matching rows. */
    async searchUsers(email: string): Promise<number> {
        return test.step(`Admin searches ${email} in /admin/dealer-users`, async () => {
            this.expectNot5xx(await this.list.open(), '/admin/dealer-users');
            await this.list.openSearch();
            await this.list.fillKeyword(email);
            this.expectNot5xx(await this.clickAndWaitForNavigation(this.list.btnSearch), 'Dealer users search');
            return this.list.rowByEmail(email).count();
        });
    }

    /** Hard: the search lists the user once and its row opens the User Details page. Returns the user id. */
    async openUserDetailsBySearch(email: string): Promise<number> {
        return test.step(`Admin opens the User Details page of ${email} from the search`, async () => {
            expect(await this.searchUsers(email), `Search result rows for ${email}`).toBe(1);
            const cell = this.list.userIdCell(this.list.rowByEmail(email));
            const userId = Number(((await cell.getAttribute('data-href')) || '').split('/').pop());
            this.expectNot5xx(await this.clickAndWaitForNavigation(cell), 'User Details page');
            this.record('User Details page', `${this.page.url()} — ${(await this.details.lblHeading.innerText()).trim()}`);
            return userId;
        });
    }

    async openUserDetails(userId: number): Promise<void> {
        await test.step(`Admin opens /admin/dealer-users/${userId}`, async () => {
            this.expectNot5xx(await this.details.open(userId), `/admin/dealer-users/${userId}`);
        });
    }

    async readDealerRows(): Promise<DealerRow[]> {
        const rows = await this.details.readDealerRows();
        this.record('User Details — dealers', rows.map(r => `${r.dealerId} ${r.name}`).join(', ') || '(none)');
        return rows;
    }

    /** Hard: the User Details page has a row for this dealer. */
    async readDealerRowOnDetails(dealerId: number, label = 'User Details row'): Promise<LinkRow> {
        return test.step(`Admin reads the dealer ${dealerId} row of the User Details page`, async () => {
            const row = this.details.dealerRow(dealerId);
            await expect(row, `User Details page lists dealer ${dealerId}`).toHaveCount(1);
            const read = await this.readRow(row);
            this.record(`${label} ${dealerId} — buttons`, read.buttons.map(b => `"${b.tooltip}" ${b.path} (${b.icon})`).join(' | '));
            return read;
        });
    }

    /** Hard: the User Details page does (not) list this dealer, and still lists every dealer in `others`. */
    async verifyUserDealers(dealerId: number, listed: boolean, others: number[]): Promise<void> {
        await test.step(`User Details page ${listed ? 'lists' : 'no longer lists'} dealer ${dealerId}`, async () => {
            await expect(this.details.dealerRow(dealerId), `Dealer ${dealerId} row`).toHaveCount(listed ? 1 : 0);
            const ids = (await this.readDealerRows()).map(r => r.dealerId);
            for (const o of others) expect(ids, `Other dealer ${o} still listed`).toContain(o);
        });
    }

    // ── Row buttons and the action modal ────────────────────────────────────

    /**
     * Clicks a row button and waits for its form in the modal. Hard: the browser does not go to a dealer
     * details page, the form loads. Recorded: heading, form route.
     */
    async openRowAction(row: Locator, action: LinkAction | 'editUser', label: string): Promise<OpenedForm> {
        return test.step(`Admin clicks "${action}" on ${label}`, async () => {
            const button = action === 'editUser' ? UserLinkActions.editUser(row) : UserLinkActions.action(row, action);
            return this.openModalFrom(button, label);
        });
    }

    private async openModalFrom(button: Locator, label: string): Promise<OpenedForm> {
        const route = ((await button.getAttribute('data-href')) || '').split('?')[0];
        await button.click();
        await expect(this.modal.formFor(route), `${label}: form of ${route} shown in the modal`).toBeVisible();
        expect(new URL(this.page.url()).pathname, `${label}: the browser did not go to a dealer details page`)
            .not.toMatch(/^\/admin\/dealer\/\d+\/?$/);
        const heading = await this.modal.lblHeading.count() > 0 ? (await this.modal.lblHeading.first().innerText()).trim() : '';
        const signature = await this.modal.readFormSignature();
        this.record(`${label} — form`, `heading "${heading}", ${signature.name} → ${signature.action}; fields ${signature.fields.join('; ') || '(none)'}`);
        return { route, heading, signature };
    }

    /** Escape (the modal has no Cancel / ×). Hard: the modal closes. Recorded: where the browser is. */
    async closeModal(label: string): Promise<void> {
        await test.step(`Admin closes the ${label} modal with Escape, without saving`, async () => {
            await this.modal.close();
            await expect(this.modal.root, `${label} modal closed`).toBeHidden();
            this.record(`${label} — after close`, this.page.url());
        });
    }

    /** Opens the header "Edit user" form if the page has one (Q-001, recorded), closes it unsaved. */
    async recordHeaderEditUserForm(): Promise<OpenedForm | null> {
        return test.step('Admin opens the User Details header "Edit user" form, if present (Q-001)', async () => {
            if (await this.details.btnHeaderEditUser.count() === 0) {
                this.record('Q-001 header "Edit user"', 'absent');
                return null;
            }
            this.record('Q-001 header "Edit user"', 'present');
            const form = await this.openModalFrom(this.details.btnHeaderEditUser, 'Header "Edit user"');
            await this.closeModal('Header "Edit user"');
            return form;
        });
    }

    /** Opens the row's "Edit user" form if the row has one (Q-006, recorded), closes it unsaved. */
    async recordRowEditUserForm(dealerId: number, email: string): Promise<OpenedForm | null> {
        return test.step(`Admin opens the "Edit user" form of ${email} on dealer ${dealerId}, if present`, async () => {
            const row = this.dealerTab.userRow(email);
            if (await UserLinkActions.editUser(row).count() === 0) {
                this.record('Reference edit form (Dealer > Users row)', 'no "Edit user" button on the row (Q-006)');
                return null;
            }
            const form = await this.openRowAction(row, 'editUser', `Dealer ${dealerId} > Users "Edit user"`);
            await this.closeModal('Edit user');
            return form;
        });
    }

    /**
     * Steps "click each edit-like row button except Edit Permissions": a row button whose route is none of
     * the four link actions, or that carries the pencil icon. Each one is opened, checked and closed unsaved.
     * Hard: none opens the user's own edit form (/admin/dealer-user/{userId}/edit or a reference form's route).
     */
    async openEditLikeRowButtons(dealerId: number, userId: number, references: (OpenedForm | null)[]): Promise<void> {
        await test.step(`Admin opens every edit-like button of the dealer ${dealerId} row except Edit Permissions`, async () => {
            const row = this.details.dealerRow(dealerId);
            const known = LINK_ACTIONS.map(a => LINK_ACTION_PATH[a]);
            const buttons = await UserLinkActions.readButtons(row);
            const editLike = buttons.filter(b => !b.path.startsWith(LINK_ACTION_PATH.editPermissions)
                && (!known.some(k => b.path.startsWith(k)) || /fa-pen/.test(b.icon)));
            this.record(`Dealer ${dealerId} row — edit-like buttons other than Edit Permissions`,
                editLike.map(b => `"${b.tooltip}" ${b.path}`).join(' | ') || 'none');
            const userForms = new Set([`/admin/dealer-user/${userId}/edit`,
                ...references.filter((r): r is OpenedForm => !!r).map(r => r.signature.action)]);
            for (const b of editLike) {
                const form = await this.openModalFrom(row.locator(`.table-column-group-action a[data-href^="${b.path}"]`),
                    `Dealer ${dealerId} row "${b.tooltip}"`);
                expect(userForms.has(form.signature.action), `Row button ${b.path} opens the user's edit form`).toBe(false);
                await this.closeModal(b.tooltip || b.path);
            }
        });
    }

    async openRowActionOnDealerTab(email: string, action: LinkAction): Promise<OpenedForm> {
        return this.openRowAction(this.dealerTab.userRow(email), action, `Dealer > Users row of ${email}`);
    }

    async openRowActionOnDetails(dealerId: number, action: LinkAction): Promise<OpenedForm> {
        return this.openRowAction(this.details.dealerRow(dealerId), action, `User Details dealer ${dealerId} row`);
    }

    /** Hard: the form's route carries this link id (the form is for this user at this dealer). */
    verifyFormLink(form: OpenedForm, action: LinkAction, linkId: number | null, label: string): void {
        expect(linkId, `${label}: link id read from the row`).not.toBeNull();
        expect(form.route, `${label}: form route for link ${linkId}`).toBe(`${LINK_ACTION_PATH[action]}${linkId}`);
    }

    private async expectLinkActions(row: Locator, label: string): Promise<void> {
        for (const a of LINK_ACTIONS) {
            await expect(UserLinkActions.action(row, a), `${label}: ${a} button (${LINK_ACTION_PATH[a]}…)`).toHaveCount(1);
        }
    }

    /** Hard: the User Details dealer row has every link action, no "Edit user" button and no pencil icon. */
    async verifyDetailsRowActions(dealerId: number): Promise<void> {
        const label = `User Details dealer ${dealerId} row`;
        await test.step(`${label} has Auto Shield, Deal your rate, Edit Permissions and Unlink, and no Edit user`, async () => {
            const row = this.details.dealerRow(dealerId);
            await this.expectLinkActions(row, label);
            await expect(UserLinkActions.editUser(row), `${label}: "Edit user" button`).toHaveCount(0);
            await expect(UserLinkActions.pencilIcon(row), `${label}: pencil icon`).toHaveCount(0);
        });
    }

    /** Hard: the dealer page heading names the dealer and the "Link user" button is there (AP2441_011 step 1). */
    async verifyDealerTabPage(dealerName: string): Promise<void> {
        await test.step(`Dealer "${dealerName}" > Users page with a Link user button`, async () => {
            await expect(this.dealerTab.lblHeading, 'Heading names the dealer').toContainText(dealerName);
            await expect(this.dealerTab.btnLinkUser, '"Link user" button').toBeVisible();
        });
    }

    /**
     * Hard: the Dealer > Users row has every link action, and every button has a tooltip or an icon.
     * Recorded: whether "Edit user" is still on the row (Q-006) and the order of the buttons.
     */
    async verifyDealerTabRowActions(email: string): Promise<void> {
        const label = `Dealer > Users row of ${email}`;
        await test.step(`${label} offers Auto Shield, Deal your rate, Edit Permissions and Unlink`, async () => {
            const row = this.dealerTab.userRow(email);
            const buttons = await UserLinkActions.readButtons(row);
            for (const b of buttons) expect(b.tooltip || b.icon, `${label}: button ${b.path} has a tooltip or an icon`).not.toBe('');
            await this.expectLinkActions(row, label);
            this.record('Q-006 "Edit user" on the Dealer > Users row', await UserLinkActions.editUser(row).count() > 0 ? 'present' : 'absent');
            this.record(`${label} — button order`, buttons.map(b => b.tooltip || b.path).join(' → '));
        });
    }

    /** Hard: the User Details page shows exactly the same dealer rows as before. */
    async verifyDealerRowsUnchanged(expected: DealerRow[]): Promise<void> {
        await test.step('User Details "Dealers" table unchanged', async () => {
            expect(await this.readDealerRows(), 'Dealer rows after the reload').toEqual(expected);
        });
    }

    /** The role set with `label` switched (removed if present, added if absent). */
    withRoleSwitched(roles: string[], label: string): string[] {
        return roles.includes(label) ? roles.filter(r => r !== label) : [...roles, label];
    }

    /** Restore after a data-changing case: link again if unlinked, then roles back to exactly `labels`. */
    async ensureLinkedWithRoles(dealerId: number, email: string, labels: string[]): Promise<void> {
        await this.relinkUser(dealerId, email, labels);
        await this.restoreRoles(dealerId, email, labels);
    }

    /**
     * Clicks Unlink on the User Details row and waits for its confirmation form. Returns null when no
     * confirmation appears (AP2441_008 step 2 — recorded). Recorded: the confirmation heading and buttons (Q-004).
     */
    async openUnlinkConfirmation(dealerId: number): Promise<OpenedForm | null> {
        return test.step(`Admin clicks "Unlink" on the dealer ${dealerId} row`, async () => {
            const button = UserLinkActions.action(this.details.dealerRow(dealerId), 'unlink');
            const route = ((await button.getAttribute('data-href')) || '').split('?')[0];
            await button.click();
            const shown = await this.modal.formFor(route).waitFor({ state: 'visible', timeout: 15000 }).then(() => true, () => false);
            if (!shown) {
                this.record('Q-004 Unlink confirmation', 'none appeared');
                return null;
            }
            const heading = await this.modal.lblHeading.count() > 0 ? (await this.modal.lblHeading.first().innerText()).trim() : '';
            const buttons = (await this.modal.root.locator('button').allInnerTexts()).map(t => t.trim()).filter(Boolean);
            this.record('Q-004 Unlink confirmation', `heading "${heading}", buttons: ${buttons.join(', ')}`);
            return { route, heading, signature: await this.modal.readFormSignature() };
        });
    }

    /**
     * AP2441_012 step 5. Hard: the form belongs to the last row's dealer — its heading names the last dealer and
     * not the first; or, if it names neither, its granted roles equal the last dealer's badges where those
     * differ from the first dealer's. Returns false when neither can tell the dealers apart (BLOCKED).
     */
    verifyFormForDealer(form: OpenedForm, roles: RoleCheckbox[], last: DealerRow, first: DealerRow,
        lastBadges: string[], firstBadges: string[]): boolean {
        const namesLast = form.heading.includes(last.name);
        const namesFirst = form.heading.includes(first.name) && !last.name.includes(first.name);
        this.record('Step 5 — form heading', `"${form.heading}" (last "${last.name}", first "${first.name}")`);
        if (namesLast || namesFirst) {
            expect({ namesLast, namesFirst }, 'The form names the last row\'s dealer, not the first').toEqual({ namesLast: true, namesFirst: false });
            return true;
        }
        if (JSON.stringify(sorted(lastBadges)) === JSON.stringify(sorted(firstBadges))) {
            this.record('Step 5', 'not distinguishable — the form names no dealer and both dealers grant the same roles');
            return false;
        }
        this.verifyFormRoles(roles, lastBadges, 'Step 5 form (last dealer)');
        return true;
    }

    /** Hard: each link action has the same tooltip and icon as on `reference`, and (when given) the same link id. */
    verifySameActions(actual: LinkRow, reference: LinkRow, label: string, sameLink: boolean): void {
        for (const a of LINK_ACTIONS) {
            const mine = actual.buttons.find(b => b.path.startsWith(LINK_ACTION_PATH[a]));
            const ref = reference.buttons.find(b => b.path.startsWith(LINK_ACTION_PATH[a]));
            expect(mine, `${label}: ${a} button`).toBeDefined();
            expect(ref, `Reference: ${a} button`).toBeDefined();
            expect({ tooltip: mine!.tooltip, icon: mine!.icon }, `${label}: ${a} tooltip and icon match the reference`)
                .toEqual({ tooltip: ref!.tooltip, icon: ref!.icon });
        }
        if (sameLink) expect(actual.linkId, `${label}: same user-to-dealer link as the reference`).toBe(reference.linkId);
        this.record(`${label} — button order`, actual.buttons.map(b => b.tooltip || b.path).join(' → '));
    }

    /** Hard: both forms are the same form (name, route, visible fields and their values) and same heading. */
    verifySameForm(actual: OpenedForm, reference: OpenedForm, label: string): void {
        expect({ heading: actual.heading, ...actual.signature }, `${label}: same form as from Dealer Details > Users`)
            .toEqual({ heading: reference.heading, ...reference.signature });
    }

    // ── Roles (Edit Permissions) ────────────────────────────────────────────

    async readFormRoles(): Promise<RoleCheckbox[]> {
        return this.modal.readCheckboxes(this.modal.chkRoles);
    }

    /** Hard: the roles the form shows as granted are exactly the badges. */
    verifyFormRoles(roles: RoleCheckbox[], badges: string[], label: string): void {
        expect(sorted(roles.filter(r => r.checked).map(r => r.label)), `${label}: granted roles = the step-1 badges`)
            .toEqual(sorted(badges));
    }

    /** Switches the role with this checkbox value to the opposite state. Returns its label. */
    async toggleRole(value: string): Promise<string> {
        return test.step(`Admin switches role ${value}`, async () => {
            const box = this.modal.checkboxByValue(this.modal.chkRoles, value);
            await expect(box, `Role checkbox ${value}`).toHaveCount(1);
            const before = await box.isChecked();
            await box.setChecked(!before);
            const label = (await this.readFormRoles()).find(r => r.value === value)!.label;
            this.record('Role switched', `${label} (${value}): ${before ? 'on → off' : 'off → on'}`);
            return label;
        });
    }

    /** Submits the open modal form. Hard: no 5xx. Recorded: landing page and flash message. */
    async submitModal(label: string): Promise<void> {
        await test.step(`Admin submits the ${label} form`, async () => {
            this.expectNot5xx(await this.clickAndWaitForNavigation(this.modal.btnSubmit), `${label} submit`);
            this.record(`${label} — after submit`, `${this.page.url()} — message: ${await this.flashText()}`);
        });
    }

    /** Hard: the dealer row's badges are exactly `expected` (as a set — badges show in grant order). */
    async verifyRoles(dealerId: number, email: string, expected: string[], label: string): Promise<void> {
        await test.step(`${label}: ${email}'s roles on dealer ${dealerId}`, async () => {
            const row = await this.readUserRowOnDealerTab(dealerId, email, label);
            expect(sorted(row.badges), `${label}: role badges`).toEqual(sorted(expected));
        });
    }

    /**
     * Restores the row's roles to exactly `labels` through the row's Edit permissions form (Dealer > Users),
     * with one more attempt if the first save did not restore them. Hard: the roles end equal to `labels`.
     */
    async restoreRoles(dealerId: number, email: string, labels: string[]): Promise<void> {
        await test.step(`Restore ${email}'s roles on dealer ${dealerId} to the step-1 list`, async () => {
            for (let attempt = 1; attempt <= 2; attempt++) {
                await this.openDealerUsersTab(dealerId);
                const row = this.dealerTab.userRow(email);
                await expect(row, `${email} listed on dealer ${dealerId}`).toHaveCount(1);
                if (JSON.stringify(sorted(await UserLinkActions.readBadges(row))) === JSON.stringify(sorted(labels))) {
                    this.record('Restore', attempt === 1 ? 'roles already equal to the step-1 list' : 'roles restored');
                    return;
                }
                await this.openRowAction(row, 'editPermissions', `Restore attempt ${attempt}`);
                await this.modal.setCheckedLabels(this.modal.chkRoles, labels);
                await this.submitModal(`Restore attempt ${attempt}`);
            }
            await this.verifyRoles(dealerId, email, labels, 'After the second restore attempt');
        });
    }

    // ── Unlink and re-link ──────────────────────────────────────────────────

    /** Re-links the user to the dealer with exactly `labels` if it is not linked. Returns the new link id. */
    async relinkUser(dealerId: number, email: string, labels: string[]): Promise<number | null> {
        return test.step(`Restore: link ${email} to dealer ${dealerId} with the step-1 roles`, async () => {
            if (await this.isUserListedOnDealerTab(dealerId, email)) return null;
            await this.openModalFrom(this.dealerTab.btnLinkUser, 'Link user');
            await this.modal.fillLinkEmail(email);
            await this.modal.setCheckedLabels(this.modal.chkPermissions, labels);
            await this.submitModal('Link user');
            await this.openDealerUsersTab(dealerId);
            const row = this.dealerTab.userRow(email);
            await expect(row, `${email} linked again to dealer ${dealerId}`).toHaveCount(1);
            const linkId = this.linkIdOf(await UserLinkActions.readButtons(row));
            this.record('Left behind', `${email} re-linked to dealer ${dealerId} as new link ${linkId} (each re-link creates a new link id)`);
            return linkId;
        });
    }

    // ── Multi-dealer user (AP2441_002, _010, _012) ──────────────────────────

    private async qualifies(userId: number, forbiddenDealer: number): Promise<MultiDealerUser | null> {
        await this.openUserDetails(userId);
        const dealers = await this.details.readDealerRows();
        if (dealers.length < 2 || dealers.some(d => d.dealerId === forbiddenDealer)) return null;
        return { id: userId, email: await this.details.readEmail(), dealers };
    }

    /**
     * Read-only search for a dealer user with two or more dealers, none of them `forbiddenDealer`: the user the
     * manual run used (`hintId`) when it still qualifies, else the list read page by page to the last page.
     * Returns null when no user qualifies (the cases' BLOCKED condition).
     */
    async findMultiDealerUser(hintId: number, excludeIds: number[], forbiddenDealer: number): Promise<MultiDealerUser | null> {
        if (multiDealerUserCache !== undefined) {
            this.record('Multi-dealer user', multiDealerUserCache ? `${multiDealerUserCache.id} ${multiDealerUserCache.email} (found earlier in this run)` : 'none (searched earlier in this run)');
            return multiDealerUserCache;
        }
        return test.step(`Find a dealer user with ≥ 2 dealers, none ${forbiddenDealer} (read-only)`, async () => {
            let found = await this.qualifies(hintId, forbiddenDealer);
            let how = `user ${hintId}, the one the manual run used`;
            for (let p = 1, last = 1; !found && p <= last; p++) {
                this.expectNot5xx(await this.list.open(p), `/admin/dealer-users page ${p}`);
                last = await this.list.lastPageNumber();
                for (const u of await this.list.readRows()) {
                    if (u.id === hintId || excludeIds.includes(u.id)) continue;
                    found = await this.qualifies(u.id, forbiddenDealer);
                    if (found) { how = `first qualifying user in list order, page ${p}`; break; }
                }
            }
            multiDealerUserCache = found;
            this.record('Multi-dealer user', found
                ? `${found.id} ${found.email} — ${found.dealers.map(d => `${d.dealerId} ${d.name}`).join(', ')} (${how})`
                : 'none found on any page');
            return found;
        });
    }

    // ── Dealer row click (AP2441_009, _010) ─────────────────────────────────

    /** Clicks the Name cell of the dealer row (not an action button). Hard: no 5xx. */
    async clickDealerName(dealerId: number): Promise<void> {
        await test.step(`Admin clicks the Name cell of the dealer ${dealerId} row`, async () => {
            const row = this.details.dealerRow(dealerId);
            await expect(row, `Dealer ${dealerId} row`).toHaveCount(1);
            this.expectNot5xx(await this.clickAndWaitForNavigation(this.details.nameCell(row)), 'Dealer page');
        });
    }

    /** Hard: the page is dealer `dealerId`'s (URL /admin/dealer/{id}, heading names it), not `notDealerId`'s. */
    async verifyOnDealerPage(dealerId: number, name: string, notDealerId?: number): Promise<void> {
        await test.step(`The page belongs to dealer ${dealerId} "${name}"`, async () => {
            await expect(this.page, 'URL of the dealer page').toHaveURL(new RegExp(`/admin/dealer/${dealerId}(?:[/?#]|$)`));
            if (notDealerId !== undefined) {
                expect(this.page.url(), `Not the first row's dealer ${notDealerId}`).not.toMatch(new RegExp(`/admin/dealer/${notDealerId}(?:[/?#]|$)`));
            }
            await expect(this.dealerTab.lblHeading, 'Heading names the dealer').toContainText(name);
            const tab = await this.dealerTab.lblActiveTab.count() > 0 ? (await this.dealerTab.lblActiveTab.first().innerText()).trim() : '(none)';
            this.record('Dealer page', `${this.page.url()} — heading "${(await this.dealerTab.lblHeading.innerText()).trim()}", active tab "${tab}"`);
        });
    }

    async attachScreenshot(name: string): Promise<void> {
        await test.info().attach(name, { body: await this.page.screenshot(), contentType: 'image/png' });
    }
}
