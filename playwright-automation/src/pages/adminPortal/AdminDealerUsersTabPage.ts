import { Locator, Page, Response } from '@playwright/test';

/**
 * Admin > Dealer Details > Users tab — /admin/dealer/{dealerId}/users (AP-2441).
 * One row per linked user: Name, Email, role badges, and the action group (see UserLinkActions).
 * lblHeading and lblActiveTab are the shared dealer-page header, so they also read the dealer details
 * page /admin/dealer/{dealerId} that a dealer row click opens.
 */
export class AdminDealerUsersTabPage {
    readonly lblHeading: Locator;
    readonly lblActiveTab: Locator;
    readonly btnLinkUser: Locator;
    readonly userRows: Locator;

    constructor(private readonly page: Page) {
        this.lblHeading = page.locator('#ui-view h1');
        this.lblActiveTab = page.locator('#ui-view .card-header .nav-link.active');
        this.btnLinkUser = page.locator('#ui-view nav a[data-href$="/link-user"]');
        this.userRows = page.locator('#ui-view table tbody tr')
            .filter({ has: page.locator('.table-column-group-action') });
    }

    async open(dealerId: number): Promise<Response | null> {
        return this.page.goto(`/admin/dealer/${dealerId}/users`);
    }

    userRow(email: string): Locator {
        return this.userRows.filter({ has: this.page.getByRole('cell', { name: email, exact: true }) });
    }

    /** E-mail (second column) of every listed user. */
    async readUserEmails(): Promise<string[]> {
        return this.userRows.evaluateAll(trs => trs.map(tr => (tr.querySelectorAll('td')[1]?.textContent || '').trim()));
    }
}
