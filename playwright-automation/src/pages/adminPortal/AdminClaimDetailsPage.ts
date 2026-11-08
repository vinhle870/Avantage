import { Locator, Page } from '@playwright/test';

/**
 * Admin claim details page (/admin/claim/{id}/details) and its "Change status" modal
 * (#myModal, form claim_status, posted to /admin/claim/{id}/change-status?status=<value>).
 * Added for AP-2374. Locators confirmed on Dev (v2dev) on 2026-11-01 with a match count of 1
 * (status links: one per status value).
 *
 * The modal's fields depend on the status picked: only Authorized and Refused carry
 * "Notify by email" + "Recipient email(s)" (Pending has "Notify customer by email") — AP-2509.
 */
export type ClaimStatusValue =
    'created' | 'submitted' | 'pending' | 'approved' | 'dealer_accepted' | 'authorized' | 'paid' | 'refused' | 'cancelled';

export class AdminClaimDetailsPage {
    private page: Page;

    // Details page
    readonly lblStatusBadge: Locator;
    readonly btnChangeStatus: Locator;
    readonly lblClaimSaved: Locator;
    readonly lblServerError: Locator;

    // Change status modal
    readonly dlgChangeStatus: Locator;
    readonly lblModalHeading: Locator;
    readonly chkNotifyByEmail: Locator;
    readonly lblNotifyByEmail: Locator;
    readonly txtRecipientEmails: Locator;
    readonly txtDeductibleAmount: Locator;
    readonly txtNote: Locator;
    readonly btnSave: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lblStatusBadge = page.locator("//h5[normalize-space()='Status']/following-sibling::span[contains(@class,'badge')]");
        this.btnChangeStatus = page.locator('a.dropdown-toggle[href$="/change-status"]');
        this.lblClaimSaved = page.locator('.alert', { hasText: 'Claim saved' });
        this.lblServerError = page.getByText(/éprouve des difficultés techniques/);

        this.dlgChangeStatus = page.locator('#myModal');
        this.lblModalHeading = page.locator('#myModal h1');
        this.chkNotifyByEmail = page.locator('#claim_status_notifyByEmail');
        this.lblNotifyByEmail = page.locator('label[for="claim_status_notifyByEmail"]');
        this.txtRecipientEmails = page.locator('#claim_status_recipientEmails');
        this.txtDeductibleAmount = page.locator('#claim_status_deductibleAmount');
        this.txtNote = page.locator('#claim_status_claimStatusNotes_0_description');
        this.btnSave = page.locator('#myModal button[type="submit"]');
    }

    static detailsPath(claimId: number): string {
        return `/admin/claim/${claimId}/details`;
    }

    lnkStatus(claimId: number, status: ClaimStatusValue): Locator {
        return this.page.locator(`a.dropdown-item[href="/admin/claim/${claimId}/change-status?status=${status}"]`);
    }

    async open(baseUrl: string, claimId: number): Promise<void> {
        await this.page.goto(`${baseUrl.replace(/\/$/, '')}${AdminClaimDetailsPage.detailsPath(claimId)}`);
    }

    async statusLabel(): Promise<string> {
        return ((await this.lblStatusBadge.textContent()) ?? '').trim();
    }

    /** Opens the "Change status" dropdown and picks a status; the modal form opens. */
    async openChangeStatusForm(claimId: number, status: ClaimStatusValue): Promise<void> {
        await this.btnChangeStatus.click();
        await this.lnkStatus(claimId, status).click();
        await this.dlgChangeStatus.waitFor({ state: 'visible' });
        await this.txtNote.waitFor({ state: 'visible' });
    }

    async recipientEmails(): Promise<string> {
        return this.txtRecipientEmails.inputValue();
    }

    async setNotifyByEmail(checked: boolean): Promise<void> {
        await this.chkNotifyByEmail.setChecked(checked);
    }

    async setRecipientEmails(value: string): Promise<void> {
        await this.txtRecipientEmails.fill(value);
    }

    async fillNote(note: string): Promise<void> {
        await this.txtNote.fill(note);
    }

    /** Clicks Save and returns the HTTP status of the change-status POST. */
    async saveStatusChange(claimId: number): Promise<number> {
        const [response] = await Promise.all([
            this.page.waitForResponse(r =>
                r.request().method() === 'POST' && r.url().includes(`/admin/claim/${claimId}/change-status`)),
            this.btnSave.click(),
        ]);
        await this.page.waitForLoadState('domcontentloaded');
        return response.status();
    }

    async closeChangeStatusForm(): Promise<void> {
        await this.page.keyboard.press('Escape');
        await this.dlgChangeStatus.waitFor({ state: 'hidden' });
    }
}
