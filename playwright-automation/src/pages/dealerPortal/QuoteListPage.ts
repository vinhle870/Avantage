import { Locator, Page } from '@playwright/test';

/**
 * Dealer quote list (/quotes and /quotes/archived) on Dev (v2dev): the "Contracts" column and the
 * keyword search added by AP-2494.
 * Locators verified on v2dev 2026-11-02 (AP-2494 s8), each with a match count of 1 on the page
 * (row / cell locators once scoped to one quote id):
 *  - search button  a[data-target="#searchForm"]       · keyword #quote_search_keyword · submit #quote_search_save
 *  - quote row      tbody tr:has(td[data-href="/quote/{id}/details"])  (each cell of a row carries that data-href)
 *  - empty state    div.alert-warning[role=alert] "No entities found"
 *  - pagination     .pagination a ("1", "2", …, "Next", "Last" — "Suivant", "Fin" in French)
 * Added in its own file so the QA's uncommitted DealerQuotesPage / index.ts are left untouched.
 * No assertions here — see QuoteListFlow.
 */
export class QuoteListPage {
    private readonly page: Page;

    readonly lblHeading: Locator;
    readonly tblQuotes: Locator;
    readonly lblHeaders: Locator;
    readonly rows: Locator;
    readonly lblNoEntities: Locator;
    readonly lnkPages: Locator;

    // Search dialog (#searchForm)
    readonly btnOpenSearch: Locator;
    readonly mdlSearch: Locator;
    readonly lblSearchKeyword: Locator;
    readonly txtSearchKeyword: Locator;
    readonly btnSearch: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lblHeading = page.locator('h1');
        this.tblQuotes = page.locator('table').first();
        this.lblHeaders = page.locator('table thead th');
        this.rows = page.locator('table tbody tr');
        this.lblNoEntities = page.locator('div.alert-warning[role="alert"]');
        this.lnkPages = page.locator('.pagination a');

        this.btnOpenSearch = page.locator('a[data-target="#searchForm"]');
        this.mdlSearch = page.locator('#searchForm');
        this.lblSearchKeyword = page.locator('label[for="quote_search_keyword"]');
        this.txtSearchKeyword = page.locator('#quote_search_keyword');
        this.btnSearch = page.locator('#quote_search_save');
    }

    /**
     * A tab link by its exact visible label, e.g. "Active", "Archived", "Créé", "Archivée".
     * (The sidebar also links to /quotes, so tabs are matched by text, not by href.)
     */
    tab(label: string): Locator {
        return this.page.locator('a.nav-link', { hasText: new RegExp(`^\\s*${label}\\s*$`) });
    }

    /** The row of one quote; every cell of the row carries data-href="/quote/{id}/details". */
    row(quoteId: string): Locator {
        return this.page.locator(`table tbody tr:has(td[data-href="/quote/${quoteId}/details"])`);
    }

    cell(quoteId: string, column: number): Locator {
        return this.row(quoteId).locator('td').nth(column);
    }

    /** Third column ("Contracts" / "Contrats"). */
    contractsCell(quoteId: string): Locator {
        return this.cell(quoteId, 2);
    }

    contractEntries(quoteId: string): Locator {
        return this.contractsCell(quoteId).locator('li');
    }

    async open(path: string): Promise<number> {
        const response = await this.page.goto(path);
        return response?.status() ?? 0;
    }

    async readHeaders(): Promise<string[]> {
        return (await this.lblHeaders.allInnerTexts()).map(t => t.trim());
    }

    /** Quote ids of the rows on the current page, in order. */
    async readRowQuoteIds(): Promise<string[]> {
        const hrefs = await this.rows.locator('td:first-child').evaluateAll(
            tds => tds.map(td => td.getAttribute('data-href') || ''));
        return hrefs.map(h => (/\/quote\/(\d+)\//.exec(h) || [])[1] || '');
    }

    async readRowTexts(): Promise<string[]> {
        return (await this.rows.allInnerTexts()).map(t => t.replace(/\s+/g, ' ').trim());
    }

    /** Opens the search dialog and submits a keyword (an empty keyword clears the search). */
    async search(keyword: string): Promise<void> {
        await this.btnOpenSearch.click();
        await this.txtSearchKeyword.waitFor({ state: 'visible' });
        await this.txtSearchKeyword.fill(keyword);
        await Promise.all([
            this.page.waitForURL(/quote_search/),
            this.btnSearch.click(),
        ]);
    }

    /** Highest page number any pagination link points to (1 when there is no pagination). Language-independent. */
    async readLastPageNumber(): Promise<number> {
        const hrefs = await this.lnkPages.evaluateAll(as => as.map(a => a.getAttribute('href') || ''));
        const pages = hrefs.map(h => Number((/[?&]page=(\d+)/.exec(h) || [])[1] || 1));
        return Math.max(1, ...pages);
    }

    url(): string {
        return this.page.url();
    }
}
