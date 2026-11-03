import { test } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import { ClaimStatusNotifyFlow } from '../../flows/ClaimStatusNotifyFlow';

/**
 * Claim "Change status" email notification — automated from AP-2374 manual test cases
 * (the four that PASSED on Dev: AP2374_007–010).
 * Source: qa-artifacts/3-test-cases/AP2374_TestCases_006-010.md
 *
 * Runs on Dev (v2dev) only, against the standing claims the manual run created on contract
 * 26df1-844 (client email client.stage.931@yopmail.com, no notify email — Q-010):
 *   claim 331 — the claim whose status is changed without an email (007, 009);
 *   claim 332 — read-only in 008; emailed in 010 and as the control email of 007 and 009.
 * Every run toggles claims 331 and 332 between Authorized and Refused (adding status notes)
 * and sends "Claim updated" emails for claim 332 to the Yopmail test inbox client.stage.931.
 */
const SILENT_CLAIM = 331;
const EMAIL_CLAIM = 332;
const CLIENT_INBOX = 'client.stage.931';
const CLIENT_EMAIL = `${CLIENT_INBOX}@yopmail.com`;
const FOREIGN_FILE = 'AP2374-attachment.png';

test.describe('Claim Change Status Email Notification @admin @AP-2374', () => {
    test.describe.configure({ mode: 'serial' });

    test.beforeEach(() => {
        test.skip(!config.baseUrl.includes('v2dev'), 'AP-2374 specs run only against Dev (v2dev): claims 331/332 exist there only');
    });

    /** Ticked change on claim 332 with the pre-filled list: the control email for 007 and 009. */
    async function sendControlEmail(claims: ClaimStatusNotifyFlow, note: string): Promise<void> {
        await claims.openClaim(EMAIL_CLAIM);
        const status = await claims.otherNotifyStatus();
        await claims.openChangeStatusForm(EMAIL_CLAIM, status);
        await claims.submitStatusChange(EMAIL_CLAIM, status, { notify: true, note });
    }

    test('AP2374_007_ChangingAClaimsStatusWithNotifyByEmailUntickedSavesTheStatusAndSendsNoEmail',
        async ({ adminUser, page }) => {
            const claims = new ClaimStatusNotifyFlow(page);
            const run = `QA-AP2374-007-${Date.now()}`;

            await adminUser.loginToAdminPortal();
            const before = await claims.snapshotInbox(CLIENT_INBOX);
            await claims.openClaim(SILENT_CLAIM);
            const status = await claims.otherNotifyStatus();
            await claims.openChangeStatusForm(SILENT_CLAIM, status);
            await claims.submitStatusChange(SILENT_CLAIM, status, { notify: false, note: `${run} unticked` });
            await sendControlEmail(claims, `${run} control email`);
            await claims.verifyNoEmailForClaim(CLIENT_INBOX, before, SILENT_CLAIM, EMAIL_CLAIM);
        });

    test('AP2374_008_AClaimWithNoNotifyEmailOpensChangeStatusWithoutAnErrorAndStillListsTheClientsEmail',
        async ({ adminUser, page }) => {
            const claims = new ClaimStatusNotifyFlow(page);

            await adminUser.loginToAdminPortal();
            await claims.openClaim(EMAIL_CLAIM);
            await claims.openChangeStatusForm(EMAIL_CLAIM, await claims.otherNotifyStatus());
            await claims.verifyRecipientFieldHoldsClientEmail(CLIENT_EMAIL);
            await claims.closeChangeStatusForm();
        });

    test('AP2374_009_AnInvalidOrEmptiedRecipientListWithNotifyTickedCausesNoErrorPageAndEmailsNoOneOutsideTheList',
        async ({ adminUser, page }) => {
            const claims = new ClaimStatusNotifyFlow(page);
            const run = `QA-AP2374-009-${Date.now()}`;

            await adminUser.loginToAdminPortal();
            const before = await claims.snapshotInbox(CLIENT_INBOX);
            await claims.openClaim(SILENT_CLAIM);
            const first = await claims.otherNotifyStatus();
            await claims.openChangeStatusForm(SILENT_CLAIM, first);
            await claims.submitStatusChange(SILENT_CLAIM, first,
                { notify: true, recipients: 'not-an-email', note: `${run} invalid recipient` });
            const second = await claims.otherNotifyStatus();
            await claims.openChangeStatusForm(SILENT_CLAIM, second);
            await claims.submitStatusChange(SILENT_CLAIM, second,
                { notify: true, recipients: '', note: `${run} empty recipient` });
            await sendControlEmail(claims, `${run} control email`);
            await claims.verifyNoEmailForClaim(CLIENT_INBOX, before, SILENT_CLAIM, EMAIL_CLAIM);
        });

    test('AP2374_010_AClaimWithNoAttachedFilesStillSendsTheNotificationEmail',
        async ({ adminUser, page }) => {
            const claims = new ClaimStatusNotifyFlow(page);
            const run = `QA-AP2374-010-${Date.now()}`;

            await adminUser.loginToAdminPortal();
            const before = await claims.snapshotInbox(CLIENT_INBOX);
            await claims.openClaim(EMAIL_CLAIM);
            const status = await claims.otherNotifyStatus();
            await claims.openChangeStatusForm(EMAIL_CLAIM, status);
            await claims.submitStatusChange(EMAIL_CLAIM, status, { notify: true, note: `${run} notify ticked` });
            await claims.verifyClaimEmailReceived(CLIENT_INBOX, before, EMAIL_CLAIM, FOREIGN_FILE);
        });
});
