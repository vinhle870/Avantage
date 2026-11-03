import { expect, Page, test } from '@playwright/test';
import { config } from '../data/config';
import { AdminClaimDetailsPage, ClaimStatusValue } from '../pages/adminPortal/AdminClaimDetailsPage';
import { YopmailInboxPage } from '../pages/common/YopmailInboxPage';

/** Status value used in the change-status URL → label shown on the claim's status badge. */
const STATUS_LABEL: Record<'authorized' | 'refused', string> = {
    authorized: 'Authorized',
    refused: 'Refused',
};

/** Yopmail test inboxes this ticket may email (safety rule of the AP-2374 test cases). */
const ALLOWED_RECIPIENTS = ['client.stage.930@yopmail.com', 'client.stage.931@yopmail.com'];

/**
 * Admin claim "Change status" + email notification flows (AP-2374).
 * Added in its own file so the QA's uncommitted AdminFlow.ts is left untouched.
 * Login stays in AdminFlow.loginToAdminPortal().
 *
 * Only the Authorized and Refused forms carry "Notify by email" today (AP-2509), so every
 * status change here toggles a claim between those two statuses.
 */
export class ClaimStatusNotifyFlow {
    private readonly claimPage: AdminClaimDetailsPage;
    private readonly inbox: YopmailInboxPage;

    constructor(private readonly page: Page) {
        this.claimPage = new AdminClaimDetailsPage(page);
        this.inbox = new YopmailInboxPage(page);
    }

    async openClaim(claimId: number): Promise<void> {
        await test.step(`Admin opens claim #${claimId}`, async () => {
            await this.claimPage.open(config.baseUrl, claimId);
            await expect(this.claimPage.lblStatusBadge, 'Claim status badge').toBeVisible();
        });
    }

    /** The notify-capable status that differs from the claim's current one. */
    async otherNotifyStatus(): Promise<'authorized' | 'refused'> {
        const current = await this.claimPage.statusLabel();
        return current === STATUS_LABEL.refused ? 'authorized' : 'refused';
    }

    async openChangeStatusForm(claimId: number, status: ClaimStatusValue): Promise<void> {
        await test.step(`Admin clicks "Change status" → ${status} on claim #${claimId}`, async () => {
            await this.claimPage.openChangeStatusForm(claimId, status);
            await expect(this.claimPage.lblModalHeading, 'Change status modal heading')
                .toHaveText(`Change status for claim #${claimId}`);
            await expect(this.claimPage.lblServerError, 'No error page').toHaveCount(0);
        });
    }

    /** Recipient list split on commas, trimmed, empty entries dropped. */
    private static recipients(value: string): string[] {
        return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }

    /**
     * VERIFICATION (AP2374_008): the recipient field lists the contract client's email and no
     * address that is on neither the claim nor the contract. The exact value is recorded (Q-003).
     */
    async verifyRecipientFieldHoldsClientEmail(clientEmail: string): Promise<string> {
        return test.step(`VERIFICATION POINT: "Recipient email(s)" holds ${clientEmail} and no foreign address`,
            async () => {
                await expect(this.claimPage.txtRecipientEmails, 'Recipient email(s) field').toBeVisible();
                const value = await this.claimPage.recipientEmails();
                const list = ClaimStatusNotifyFlow.recipients(value);
                expect(list, 'Recipient list contains the client email').toContain(clientEmail);
                for (const address of list) {
                    expect(ALLOWED_RECIPIENTS, `Recipient "${address}" belongs to the claim or the contract`)
                        .toContain(address);
                }
                test.info().annotations.push({ type: 'Q-003 recorded', description: `Recipient field value: "${value}"` });
                return value;
            });
    }

    async closeChangeStatusForm(): Promise<void> {
        await test.step('Admin closes the Change status form without saving', async () => {
            await this.claimPage.closeChangeStatusForm();
        });
    }

    /**
     * Fills and saves the open Change status form, then checks the claim shows the new status
     * with "Claim saved" and no error page. `recipients` undefined = leave the pre-filled list.
     */
    async submitStatusChange(claimId: number, status: 'authorized' | 'refused', opts: {
        notify: boolean; recipients?: string; note: string;
    }): Promise<void> {
        const label = STATUS_LABEL[status];
        await test.step(`Admin saves ${label} on claim #${claimId} — notify ${opts.notify ? 'ticked' : 'unticked'}` +
            `${opts.recipients === undefined ? '' : `, recipients "${opts.recipients}"`}`, async () => {
            if (opts.notify && opts.recipients === undefined) {
                // Safety rule: never email an address outside this ticket's Yopmail test inboxes.
                for (const address of ClaimStatusNotifyFlow.recipients(await this.claimPage.recipientEmails())) {
                    expect(ALLOWED_RECIPIENTS, `Pre-filled recipient "${address}" is a test inbox`).toContain(address);
                }
            }
            await this.claimPage.setNotifyByEmail(opts.notify);
            await expect(this.claimPage.chkNotifyByEmail, '"Notify by email" state').toBeChecked({ checked: opts.notify });
            if (opts.recipients !== undefined) {
                await this.claimPage.setRecipientEmails(opts.recipients);
            }
            await this.claimPage.fillNote(opts.note);
            const httpStatus = await this.claimPage.saveStatusChange(claimId);
            expect(httpStatus, 'Change status POST is not a server error').toBeLessThan(500);
            await expect(this.claimPage.lblServerError, 'No error page').toHaveCount(0);
            await expect(this.claimPage.lblClaimSaved, '"Claim saved" message').toBeVisible();
            await expect(this.claimPage.lblStatusBadge, 'Claim status badge').toHaveText(label);
        });
    }

    async snapshotInbox(inbox: string): Promise<string[]> {
        return test.step(`Record the emails already in Yopmail inbox ${inbox}`, async () => {
            await this.inbox.open(inbox);
            return this.inbox.mailIds();
        });
    }

    /** Refreshes the inbox until at least one email not in `before` arrives; returns the new ids. */
    async waitForNewMails(inbox: string, before: string[]): Promise<string[]> {
        return test.step(`Wait for a new email in Yopmail inbox ${inbox}`, async () => {
            await this.inbox.open(inbox);
            let fresh: string[] = [];
            await expect(async () => {
                await this.inbox.refresh();
                fresh = (await this.inbox.mailIds()).filter(id => !before.includes(id));
                expect(fresh.length, `New emails in ${inbox}`).toBeGreaterThan(0);
            }, `A new email reaches ${inbox}`).toPass({ timeout: 120_000, intervals: [3_000, 5_000, 10_000] });
            return fresh;
        });
    }

    async attachmentsOf(mailId: string): Promise<string[]> {
        return test.step(`Open email ${mailId} and list its attachments`, async () => {
            await this.inbox.openMail(mailId);
            await expect(this.inbox.lnkAttachments.first(), 'Email has an attachment').toBeVisible();
            const names = await this.inbox.attachmentNames();
            test.info().annotations.push({ type: 'Attachments', description: `${mailId}: ${names.join(', ')}` });
            return names;
        });
    }

    /**
     * VERIFICATION (AP2374_010): the new email for this claim arrived and carries no file that
     * belongs to another claim. The attachment list is recorded (Q-008).
     */
    async verifyClaimEmailReceived(inbox: string, before: string[], claimId: number, foreignFile: string): Promise<void> {
        await test.step(`VERIFICATION POINT: ${inbox} received the email for claim #${claimId}, without "${foreignFile}"`,
            async () => {
                const fresh = await this.waitForNewMails(inbox, before);
                expect(fresh, 'Exactly one new email').toHaveLength(1);
                expect(await this.inbox.mailRowText(fresh[0]), 'New email subject').toContain('Claim updated');
                const names = await this.attachmentsOf(fresh[0]);
                expect(names, 'Attachments include the PDF of this claim').toContain(`claim-${claimId}.pdf`);
                expect(names, `Attachments do not include "${foreignFile}"`).not.toContain(foreignFile);
                for (const name of names) {
                    expect(name, 'No PDF of another claim').not.toMatch(new RegExp(`^claim-(?!${claimId}\\.pdf$)`));
                }
            });
    }

    /**
     * VERIFICATION (AP2374_007, AP2374_009): no email for `silentClaimId` reached the inbox.
     * Proven with a control email: a later ticked change on `controlClaimId` is sent to the
     * same inbox; once it arrives, it must be the only new email — an email from the earlier
     * submits would have arrived before it.
     */
    async verifyNoEmailForClaim(inbox: string, before: string[], silentClaimId: number, controlClaimId: number): Promise<void> {
        await test.step(`VERIFICATION POINT: no email for claim #${silentClaimId} reached ${inbox}`, async () => {
            const fresh = await this.waitForNewMails(inbox, before);
            for (const id of fresh) {
                const names = await this.attachmentsOf(id);
                expect(names, `New email ${id} is not about claim #${silentClaimId}`).not.toContain(`claim-${silentClaimId}.pdf`);
                expect(names, `New email ${id} is the control email of claim #${controlClaimId}`).toContain(`claim-${controlClaimId}.pdf`);
            }
            expect(fresh, 'Only the control email arrived').toHaveLength(1);
        });
    }
}
