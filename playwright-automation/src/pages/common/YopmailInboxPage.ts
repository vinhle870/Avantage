import { FrameLocator, Locator, Page } from '@playwright/test';

/**
 * Yopmail web inbox (https://yopmail.com/en/?login=<name>), used to read the emails the
 * application sends to Yopmail test inboxes. Added for AP-2374.
 * Locators confirmed on 2026-11-01 with a match count of 1 (inbox frame, mail frame, refresh;
 * one `div.m` per email; one `a.pj` per attachment).
 *
 * The page holds three iframes: #ifinbox (the list, newest first), #ifmail (the open email)
 * and #ifnoinb. Each email row is `div.m` with a stable id `e_<token>`; the open email's
 * frame URL carries `id=me_<token>`.
 */
export class YopmailInboxPage {
    static readonly BASE = 'https://yopmail.com/en/';

    private page: Page;

    readonly frmInbox: FrameLocator;
    readonly frmMail: FrameLocator;
    readonly btnRefresh: Locator;
    readonly lstMails: Locator;
    readonly lnkAttachments: Locator;

    constructor(page: Page) {
        this.page = page;
        this.frmInbox = page.frameLocator('#ifinbox');
        this.frmMail = page.frameLocator('#ifmail');
        this.btnRefresh = page.locator('#refresh');
        this.lstMails = this.frmInbox.locator('div.m');
        this.lnkAttachments = this.frmMail.locator('a.pj');
    }

    async open(inbox: string): Promise<void> {
        await this.page.goto(`${YopmailInboxPage.BASE}?login=${encodeURIComponent(inbox)}`);
        await this.page.locator('#ifinbox').waitFor({ state: 'attached' });
    }

    async refresh(): Promise<void> {
        await this.btnRefresh.click();
    }

    /** Ids of the emails on the first inbox page, newest first. */
    async mailIds(): Promise<string[]> {
        await this.frmInbox.locator('body').waitFor({ state: 'attached' });
        const ids = await this.lstMails.evaluateAll(els => els.map(e => e.id));
        return ids.filter(id => id.length > 0);
    }

    mailRow(mailId: string): Locator {
        return this.frmInbox.locator(`div.m[id="${mailId}"]`);
    }

    async mailRowText(mailId: string): Promise<string> {
        return ((await this.mailRow(mailId).innerText()) ?? '').replace(/\s+/g, ' ').trim();
    }

    /** Opens one email and waits until the mail frame shows it. */
    async openMail(mailId: string): Promise<void> {
        await this.mailRow(mailId).locator('button.lm').click();
        const token = mailId.replace(/^e_/, '');
        await this.page.waitForFunction(
            t => {
                const f = document.querySelector<HTMLIFrameElement>('#ifmail');
                return !!f && !!f.contentWindow && f.contentWindow.location.href.includes(`id=me_${t}`);
            },
            token,
        );
        await this.frmMail.locator('body').waitFor({ state: 'attached' });
    }

    /** Attachment file names of the open email. */
    async attachmentNames(): Promise<string[]> {
        const titles = await this.lnkAttachments.evaluateAll(els => els.map(e => e.getAttribute('title') ?? ''));
        return titles.map(t => t.trim()).filter(t => t.length > 0);
    }
}
