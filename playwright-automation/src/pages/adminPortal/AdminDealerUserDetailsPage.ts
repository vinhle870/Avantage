import { Locator, Page, Response } from '@playwright/test';

export type DealerRow = { dealerId: number; name: string };

/**
 * Admin > Dealer User Details — /admin/dealer-users/{userId} (AP-2441).
 * A "Dealers" table with one row per linked dealer; each row's cells link to /admin/dealer/{dealerId}
 * (data-href) and its action group holds the link buttons (see UserLinkActions).
 */
export class AdminDealerUserDetailsPage {
    readonly lblHeading: Locator;
    /** Header "Edit user" button — opens /admin/dealer-user/{userId}/edit. */
    readonly btnHeaderEditUser: Locator;
    /** User's e-mail: first line of the user details block (its <strong> label is dropped when read). */
    readonly lblEmail: Locator;
    readonly dealerRows: Locator;

    constructor(private readonly page: Page) {
        this.lblHeading = page.locator('#ui-view h1');
        this.btnHeaderEditUser = page.locator('#ui-view nav a[data-href^="/admin/dealer-user/"][data-href*="/edit"]');
        this.lblEmail = page.locator('#ui-view .card-body .row .col > div').first();
        this.dealerRows = page.locator('#ui-view table tbody tr')
            .filter({ has: page.locator('td[data-href^="/admin/dealer/"]') });
    }

    async open(userId: number): Promise<Response | null> {
        return this.page.goto(`/admin/dealer-users/${userId}`);
    }

    dealerRow(dealerId: number): Locator {
        return this.dealerRows.filter({ has: this.page.locator(`td[data-href="/admin/dealer/${dealerId}"]`) });
    }

    /** The row's Name cell (second column) — clicking it opens the dealer page. */
    nameCell(row: Locator): Locator {
        return row.locator('td[data-href]').nth(1);
    }

    async readDealerRows(): Promise<DealerRow[]> {
        return this.dealerRows.evaluateAll(trs => trs.map(tr => {
            const cells = Array.from(tr.querySelectorAll('td[data-href]'));
            const href = cells[0]?.getAttribute('data-href') || '';
            return { dealerId: Number(href.split('/').pop()), name: (cells[1]?.textContent || '').trim() };
        }));
    }

    async readEmail(): Promise<string> {
        return this.lblEmail.evaluate(div => Array.from(div.childNodes)
            .filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent || '').join('').trim());
    }
}
