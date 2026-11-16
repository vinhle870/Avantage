import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { DealerUserPermissionsFlow, MultiDealerUser } from '../../flows/DealerUserPermissionsFlow';
import { LinkAction } from '../../pages/adminPortal/UserLinkActions';

/**
 * Admin: manage a dealer user's permissions from the Dealer User Details page — automated from the AP-2441
 * manual test cases. Source: qa-artifacts/3-test-cases/AP2441_TestCases_001-005.md, _006-010.md, _011-012.md
 * Execution: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2441_2026-11-04.md (Dev, v2dev, 12/12 PASS)
 *
 * Test data: dealer user vinhle8702@gmail.com (id 110) linked to dealer 1510 "Vinh le 2" — reserved for
 * AP-2441. Dealer 1380 is never touched. AP2441_002 / _010 / _012 use a dealer user linked to two or more
 * dealers (none of them 1380), found read-only at run time — user 130 when it still qualifies.
 *
 * What the runs change and restore:
 *  - AP2441_005 switches the "Window Sticker" role of user 110 at dealer 1510, saves, then restores exactly the
 *    step-1 role set in `finally` (one more attempt if the first restore does not take).
 *  - AP2441_006 switches it without saving; `finally` restores only if the roles changed anyway.
 *  - AP2441_007 unlinks user 110 from dealer 1510 and re-links it with the step-1 roles in `finally`. Each
 *    re-link creates a new link id (recorded as the "Left behind" annotation): one new link per run.
 *  - AP2441_008 opens the Unlink confirmation and dismisses it with Escape; `finally` re-links if needed.
 *  - Every other case is read-only and fails if any of these forms is submitted.
 * AP2441_007 runs last: if its restore fails, no later case depends on user 110.
 * Runs on Dev (v2dev) only, where the cases passed; the suite skips itself elsewhere.
 */
const USER = { email: 'vinhle8702@gmail.com', id: 110 };
const DEALER = { dealerId: 1510, name: 'Vinh le 2' };
const SHARED_DEALER = 1380;
const MULTI_DEALER_HINT = 130;
const WINDOW_STICKER = 'ROLE_WINDOW_STICKER';

test.describe('Dealer User Details Permissions @admin @AP-2441', () => {
    test.skip(!/v2dev\./.test(config.baseUrl) || !/v2dev\./.test(config.adminPortalUrl),
        'AP-2441 automation runs on Dev (v2dev) only — the environment the cases passed on');

    let flow: DealerUserPermissionsFlow;

    test.beforeEach(async ({ adminUser, page }) => {
        flow = new DealerUserPermissionsFlow(page);
        await adminUser.loginToAdminPortal();
    });

    async function multiDealerUser(): Promise<MultiDealerUser> {
        const user = await flow.findMultiDealerUser(MULTI_DEALER_HINT, [USER.id], SHARED_DEALER);
        test.skip(!user, 'BLOCKED — no dealer user with two or more dealers (none of them 1380) found');
        return user!;
    }

    test('AP2441_011_DealerUsersTabStillOffersTheFourActions', async () => {
        await flow.readUserRowOnDealerTab(DEALER.dealerId, USER.email, 'Step 1 Dealer > Users row');
        await flow.verifyDealerTabPage(DEALER.name);
        await flow.verifyDealerTabRowActions(USER.email);
        flow.verifyNothingSubmitted();
        flow.verifyNoServerError();
    });

    test('AP2441_001_UserDetailsDealerRowShowsFourActionsAndNoEditUser', async () => {
        const reference = await flow.readUserRowOnDealerTab(DEALER.dealerId, USER.email, 'Step 1 Dealer > Users row');
        const rowForm = await flow.recordRowEditUserForm(DEALER.dealerId, USER.email);

        const userId = await flow.openUserDetailsBySearch(USER.email);
        const headerForm = await flow.recordHeaderEditUserForm();

        const row = await flow.readDealerRowOnDetails(DEALER.dealerId);
        await flow.openEditLikeRowButtons(DEALER.dealerId, userId, [rowForm, headerForm]);

        await flow.verifyDetailsRowActions(DEALER.dealerId);
        flow.verifySameActions(row, reference, `User Details dealer ${DEALER.dealerId} row`, true);
        flow.verifyNothingSubmitted();
        flow.verifyNoServerError();
    });

    for (const [tc, action, title] of [
        ['AP2441_003', 'autoShield', 'AutoShieldFromUserDetailsOpensTheSameFormAsFromDealerUsers'],
        ['AP2441_004', 'dealYourRate', 'DealYourRateFromUserDetailsOpensTheSameFormAsFromDealerUsers'],
    ] as [string, LinkAction, string][]) {
        test(`${tc}_${title}`, async () => {
            const start = await flow.readUserRowOnDealerTab(DEALER.dealerId, USER.email, 'Step 1 Dealer > Users row');
            const reference = await flow.openRowActionOnDealerTab(USER.email, action);
            await flow.closeModal(`${action} (Dealer > Users)`);
            await flow.verifyRoles(DEALER.dealerId, USER.email, start.badges, 'Step 1 row after the reference');

            await flow.openUserDetailsBySearch(USER.email);
            await flow.readDealerRowOnDetails(DEALER.dealerId);
            const form = await flow.openRowActionOnDetails(DEALER.dealerId, action);
            await flow.closeModal(`${action} (User Details)`);

            flow.verifySameForm(form, reference, action);
            flow.verifyNothingSubmitted();
            flow.verifyNoServerError();
        });
    }

    test('AP2441_005_EditPermissionsFromUserDetailsChangesTheRoleForThatDealer', async () => {
        let start: string[] | undefined;
        try {
            const reference = await flow.readUserRowOnDealerTab(DEALER.dealerId, USER.email, 'Step 1 Dealer > Users row');
            start = reference.badges;

            await flow.openUserDetailsBySearch(USER.email);
            const row = await flow.readDealerRowOnDetails(DEALER.dealerId);
            const form = await flow.openRowActionOnDetails(DEALER.dealerId, 'editPermissions');
            flow.verifyFormLink(form, 'editPermissions', reference.linkId, 'Step 2');
            flow.verifyFormLink(form, 'editPermissions', row.linkId, 'Step 2 (row button)');
            flow.verifyFormRoles(await flow.readFormRoles(), start, 'Step 2 form');

            const switched = await flow.toggleRole(WINDOW_STICKER);
            await flow.submitModal('Edit permissions (User Details)');

            await flow.verifyRoles(DEALER.dealerId, USER.email, flow.withRoleSwitched(start, switched),
                'Step 4 before the restore');
            await flow.attachScreenshot('AP2441_005 step 4 — dealer 1510 row after the save from User Details');
        } finally {
            if (start) await flow.ensureLinkedWithRoles(DEALER.dealerId, USER.email, start);
        }
        await flow.verifyRoles(DEALER.dealerId, USER.email, start!, 'Step 5 after the restore');
        flow.verifyNoServerError();
    });

    test('AP2441_006_ClosingEditPermissionsWithoutSavingLeavesTheRolesUnchanged', async () => {
        let start: string[] | undefined;
        try {
            const reference = await flow.readUserRowOnDealerTab(DEALER.dealerId, USER.email, 'Step 1 Dealer > Users row');
            start = reference.badges;

            await flow.openUserDetailsBySearch(USER.email);
            const form = await flow.openRowActionOnDetails(DEALER.dealerId, 'editPermissions');
            flow.verifyFormLink(form, 'editPermissions', reference.linkId, 'Step 2');

            await flow.toggleRole(WINDOW_STICKER);
            await flow.closeModal('Edit permissions');

            await flow.verifyRoles(DEALER.dealerId, USER.email, start, 'Step 4');
            flow.verifyNothingSubmitted();
        } finally {
            if (start) await flow.ensureLinkedWithRoles(DEALER.dealerId, USER.email, start);
        }
        flow.verifyNoServerError();
    });

    test('AP2441_002_UserWithSeveralDealersSeesTheSameFourActionsOnEveryRow', async () => {
        const user = await multiDealerUser();
        const first = user.dealers[0];
        const last = user.dealers[user.dealers.length - 1];

        const before = await flow.readUserRowOnDealerTab(first.dealerId, user.email, 'Step 2 first dealer row');
        const referenceForm = await flow.recordRowEditUserForm(first.dealerId, user.email);
        await flow.verifyRoles(first.dealerId, user.email, before.badges, 'Step 2 row after the reload');

        await flow.openUserDetails(user.id);
        const firstRow = await flow.readDealerRowOnDetails(first.dealerId, 'First row');
        const lastRow = await flow.readDealerRowOnDetails(last.dealerId, 'Last row');
        await flow.openEditLikeRowButtons(first.dealerId, user.id, [referenceForm]);
        await flow.openEditLikeRowButtons(last.dealerId, user.id, [referenceForm]);

        await flow.openUserDetails(user.id);
        await flow.verifyDealerRowsUnchanged(user.dealers);
        for (const d of user.dealers) await flow.verifyDetailsRowActions(d.dealerId);
        flow.verifySameActions(lastRow, firstRow, 'Last row compared with the first row', false);
        flow.verifyNothingSubmitted();
        flow.verifyNoServerError();
    });

    test('AP2441_012_EditPermissionsOnTheLastRowOpensThatDealersPermissions', async () => {
        const user = await multiDealerUser();
        const first = user.dealers[0];
        const last = user.dealers[user.dealers.length - 1];

        const lastBadges = (await flow.readUserRowOnDealerTab(last.dealerId, user.email, 'Step 2 last dealer row')).badges;
        const firstBadges = (await flow.readUserRowOnDealerTab(first.dealerId, user.email, 'Step 2 first dealer row')).badges;

        await flow.openUserDetails(user.id);
        await flow.readDealerRowOnDetails(last.dealerId, 'Last row');
        const form = await flow.openRowActionOnDetails(last.dealerId, 'editPermissions');
        await flow.attachScreenshot('AP2441_012 step 3 — Edit permissions form opened from the last row');
        const roles = await flow.readFormRoles();
        await flow.closeModal('Edit permissions');
        await flow.verifyRoles(last.dealerId, user.email, lastBadges, 'Step 4 last dealer row after the close');

        const decided = flow.verifyFormForDealer(form, roles, last, first, lastBadges, firstBadges);
        flow.verifyNothingSubmitted();
        flow.verifyNoServerError();
        test.skip(!decided, 'BLOCKED — not distinguishable: the form names no dealer and both dealers grant the same roles');
    });

    test('AP2441_010_ClickingTheLastDealerRowOpensThatDealerNotTheFirst', async () => {
        const user = await multiDealerUser();
        await flow.openUserDetails(user.id);
        const rows = await flow.readDealerRows();
        const first = rows[0];
        const last = rows[rows.length - 1];

        await flow.clickDealerName(last.dealerId);
        await flow.verifyOnDealerPage(last.dealerId, last.name, first.dealerId);
        flow.verifyNothingSubmitted();
        flow.verifyNoServerError();
    });

    test('AP2441_009_ClickingADealerRowOpensThatDealersDetailsPage', async () => {
        await flow.readUserRowOnDealerTab(DEALER.dealerId, USER.email, 'Step 1 Dealer > Users row');
        await flow.openUserDetailsBySearch(USER.email);
        await flow.readDealerRowOnDetails(DEALER.dealerId);

        await flow.clickDealerName(DEALER.dealerId);
        await flow.verifyOnDealerPage(DEALER.dealerId, DEALER.name);
        flow.verifyNothingSubmitted();
        flow.verifyNoServerError();
    });

    test('AP2441_008_CancellingUnlinkKeepsTheUserLinkedToTheDealer', async () => {
        let start: string[] | undefined;
        try {
            start = (await flow.readUserRowOnDealerTab(DEALER.dealerId, USER.email, 'Step 1 Dealer > Users row')).badges;
            const userId = await flow.openUserDetailsBySearch(USER.email);
            await flow.verifyUserDealers(DEALER.dealerId, true, []);

            const confirmation = await flow.openUnlinkConfirmation(DEALER.dealerId);
            test.skip(!confirmation, 'Unlink has no confirmation to cancel (the link is restored in finally)');
            await flow.closeModal('Unlink confirmation');

            await flow.openUserDetails(userId);
            await flow.verifyUserDealers(DEALER.dealerId, true, []);
            await flow.verifyRoles(DEALER.dealerId, USER.email, start, 'Step 4');
            flow.verifyNothingSubmitted();
        } finally {
            if (start) await flow.ensureLinkedWithRoles(DEALER.dealerId, USER.email, start);
        }
        flow.verifyNoServerError();
    });

    test('AP2441_007_UnlinkFromUserDetailsRemovesTheUserFromThatDealerThenRelinked', async () => {
        let start: string[] | undefined;
        let userId = USER.id;
        try {
            const reference = await flow.readUserRowOnDealerTab(DEALER.dealerId, USER.email, 'Step 1 Dealer > Users row');
            const otherUsers = (await flow.readDealerUserEmails(DEALER.dealerId)).filter(e => e !== USER.email);
            userId = await flow.openUserDetailsBySearch(USER.email);
            const otherDealers = (await flow.readDealerRows()).map(d => d.dealerId).filter(id => id !== DEALER.dealerId);
            flow.record('Link before the unlink', `${reference.linkId}`);
            start = reference.badges;

            await flow.openRowActionOnDetails(DEALER.dealerId, 'unlink');
            await flow.submitModal('Unlink (User Details)');

            flow.record('Q-005 search after the unlink', `${await flow.searchUsers(USER.email)} row(s) for ${USER.email}`);
            await flow.openUserDetails(userId);
            await flow.verifyUserDealers(DEALER.dealerId, false, otherDealers);
            await flow.attachScreenshot('AP2441_007 step 3 — User Details after the unlink');
            await flow.verifyDealerUsers(DEALER.dealerId, USER.email, false, otherUsers);
            await flow.attachScreenshot('AP2441_007 step 3 — dealer 1510 Users after the unlink');
        } finally {
            if (start) await flow.ensureLinkedWithRoles(DEALER.dealerId, USER.email, start);
        }
        await flow.verifyRoles(DEALER.dealerId, USER.email, start!, 'Step 5 dealer 1510 row');
        await flow.openUserDetails(userId);
        await flow.verifyUserDealers(DEALER.dealerId, true, []);
        flow.verifyNoServerError();
    });
});
