import { Locator, Page, Response } from '@playwright/test';

export type DealerUserListRow = { id: number; name: string; email: string };

/**
 * Admin > Dealer users list — /admin/dealer-users (AP-2441).
 * The search only works by submitting its dialog (a URL parameter is ignored). Rows link to
 * /admin/dealer-users/{id} through data-href on their cells.
 */
export class AdminDealerUsersListPage {
    readonly btnOpenSearch: Locator;
    readonly txtKeyword: Locator;
    readonly btnSearch: Locator;
    readonly rows: Locator;
    readonly lnkPages: Locator;

    constructor(private readonly page: Page) {
        this.btnOpenSearch = page.locator('#ui-view a[data-target="#searchForm"]');
        this.txtKeyword = page.locator('#user_search_keyword');
        this.btnSearch = page.locator('#user_search_save');
        this.rows = page.locator('#ui-view table tbody tr')
            .filter({ has: page.locator('td[data-href^="/admin/dealer-users/"]') });
        this.lnkPages = page.locator('#ui-view .pagination a[href*="page="]');
    }

    async open(pageNo = 1): Promise<Response | null> {
        return this.page.goto(pageNo === 1 ? '/admin/dealer-users' : `/admin/dealer-users?page=${pageNo}`);
    }

    rowByEmail(email: string): Locator {
        return this.rows.filter({ has: this.page.getByRole('cell', { name: email, exact: true }) });
    }

    /** First clickable cell of a row (User ID) — opens the User Details page. */
    userIdCell(row: Locator): Locator {
        return row.locator('td[data-href^="/admin/dealer-users/"]').first();
    }

    async openSearch(): Promise<void> {
        await this.btnOpenSearch.click();
        await this.txtKeyword.waitFor({ state: 'visible' });
    }

    async fillKeyword(keyword: string): Promise<void> {
        await this.txtKeyword.fill(keyword);
    }

    async readRows(): Promise<DealerUserListRow[]> {
        return this.rows.evaluateAll(trs => trs.map(tr => {
            const tds = Array.from(tr.querySelectorAll('td'));
            const href = tr.querySelector('td[data-href]')?.getAttribute('data-href') || '';
            return {
                id: Number(href.split('/').pop()),
                name: (tds[1]?.textContent || '').trim(),
                email: (tds[2]?.textContent || '').trim(),
            };
        }));
    }

    /** Highest page=N among the pagination links (1 when there is no pagination). Locale-free. */
    async lastPageNumber(): Promise<number> {
        const hrefs = await this.lnkPages.evaluateAll(as => as.map(a => a.getAttribute('href') || ''));
        return Math.max(1, ...hrefs.map(h => Number(/[?&]page=(\d+)/.exec(h)?.[1] || 1)));
    }
}
