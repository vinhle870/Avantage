import { expect, Page, test } from '@playwright/test';
import { QuoteListPage } from '../pages/dealerPortal/QuoteListPage';

export type QuoteTab = 'active' | 'archived';

const TAB_PATH: Record<QuoteTab, string> = { active: '/quotes', archived: '/quotes/archived' };

/**
 * Dealer quote list — AP-2494 ("Contracts" column replacing "Produits", keyword search), Dev (v2dev).
 * Added in its own file so the QA's uncommitted DealerFlow.ts is left untouched; the login stays in
 * DealerFlow.loginToDealerPortal().
 * Read-only: every method only opens list pages, submits searches (GET) or switches the interface
 * language through ?_locale= (switchLanguage — callers restore English). Nothing is saved.
 */
export class QuoteListFlow {
    readonly list: QuoteListPage;

    constructor(private readonly page: Page) {
        this.list = new QuoteListPage(page);
    }

    // ── Opening ──────────────────────────────────────────────────────────────

    async openQuoteList(tab: QuoteTab = 'active', query = '_locale=en'): Promise<void> {
        const path = `${TAB_PATH[tab]}${query ? `?${query}` : ''}`;
        await test.step(`Dealer opens the quote list ${path}`, async () => {
            const status = await this.list.open(path);
            expect(status, `HTTP status of ${path}`).toBeLessThan(400);
            await expect(this.list.lblHeading, 'Quote list heading').toBeVisible();
        });
    }

    /** Switches the shared account's interface language with ?_locale= on the current tab. */
    async switchLanguage(locale: 'en' | 'fr', tab: QuoteTab = 'active'): Promise<void> {
        await test.step(`Dealer switches the quote list to "${locale}"`, async () => {
            const status = await this.list.open(`${TAB_PATH[tab]}?_locale=${locale}`);
            expect(status, `HTTP status of ${TAB_PATH[tab]}?_locale=${locale}`).toBeLessThan(400);
            await expect(this.list.lblHeading, 'Quote list heading')
                .toHaveText(locale === 'fr' ? 'Cotations' : 'Quotes');
        });
    }

    async clickTab(label: string, expectedPath: string): Promise<void> {
        await test.step(`Dealer clicks the "${label}" tab`, async () => {
            await this.list.tab(label).click();
            await expect(this.page, `URL after clicking "${label}"`)
                .toHaveURL(new RegExp(`${expectedPath.replace(/\//g, '\\/')}(\\?|$)`));
        });
    }

    // ── Column checks ───────────────────────────────────────────────────────

    async verifyTabSelected(label: string): Promise<void> {
        await expect(this.list.tab(label), `"${label}" tab is the selected one`).toHaveClass(/\bactive\b/);
    }

    async verifyHeaders(expected: string[]): Promise<void> {
        await test.step(`Column headers are ${expected.join(' · ')}`, async () => {
            await expect(this.list.rows.first(), 'At least one quote row').toBeVisible();
            const headers = await this.list.readHeaders();
            expect(headers, 'Column headers, left to right').toEqual(expected);
            expect(headers, 'No "Produits" column').not.toContain('Produits');
        });
    }

    /** Walks the list page by page until the quote's row is shown; returns the page it is on. */
    async findQuoteRow(quoteId: string, tab: QuoteTab = 'active', maxPages = 15): Promise<number> {
        return test.step(`Dealer finds quote ${quoteId} on the ${tab} list`, async () => {
            for (let p = 1; p <= maxPages; p++) {
                await this.openQuoteList(tab, `_locale=en&page=${p}`);
                if (await this.list.row(quoteId).count() === 1) return p;
            }
            throw new Error(`Quote ${quoteId} is not on pages 1–${maxPages} of the ${tab} list — `
                + 'it is test data left on Dev by the AP-2494 manual run; if it was archived or removed, pick another quote');
        });
    }

    async verifyContractsCell(quoteId: string, expected: string[]): Promise<void> {
        await test.step(`Contracts cell of quote ${quoteId} lists exactly ${expected.join(', ')}`, async () => {
            await expect(this.list.contractEntries(quoteId), `Contract entries of quote ${quoteId}`).toHaveText(expected);
            await this.verifyCellClean(quoteId);
        });
    }

    async verifyContractsCellContains(quoteId: string, contract: string): Promise<void> {
        await test.step(`Contracts cell of quote ${quoteId} lists ${contract}`, async () => {
            const entries = (await this.list.contractEntries(quoteId).allInnerTexts()).map(t => t.trim());
            expect(entries, `Contract entries of quote ${quoteId}`).toContain(contract);
            await this.verifyCellClean(quoteId);
        });
    }

    async verifyContractsCellBlank(quoteId: string): Promise<void> {
        await test.step(`Contracts cell of quote ${quoteId} is blank`, async () => {
            await expect(this.list.contractEntries(quoteId), 'No contract entry').toHaveCount(0);
            const text = (await this.list.contractsCell(quoteId).innerText()).trim();
            expect(text, 'Cell text — no placeholder such as "-", "null" or "undefined"').toBe('');
        });
    }

    /** Every entry has text, none reads "null"/"undefined", and the cell holds no link. */
    private async verifyCellClean(quoteId: string): Promise<void> {
        const entries = (await this.list.contractEntries(quoteId).allInnerTexts()).map(t => t.trim());
        for (const e of entries) {
            expect(e, `Contract entry of quote ${quoteId} is not blank`).not.toBe('');
            expect(e, `Contract entry of quote ${quoteId}`).not.toMatch(/\b(null|undefined)\b/i);
        }
        await expect(this.list.contractsCell(quoteId).locator('a'), 'No link inside the Contracts cell').toHaveCount(0);
    }

    // ── Search ──────────────────────────────────────────────────────────────

    /** Opens the search dialog, checks its label, and submits the keyword. */
    async search(keyword: string, tab: QuoteTab = 'active'): Promise<void> {
        await test.step(`Dealer searches "${keyword}" on the ${tab} tab`, async () => {
            await expect(this.list.btnOpenSearch, 'Search button beside "Create a quote"').toBeVisible();
            await this.list.search(keyword);
            await expect(this.list.lblSearchKeyword, 'Search field label')
                .toHaveText('Quote name, client name, client email or VIN');
            const url = new URL(this.page.url());
            expect(url.pathname, 'The search submits to the tab being viewed').toBe(TAB_PATH[tab]);
            expect(url.searchParams.get('quote_search[keyword]'), 'Keyword in the URL').toBe(keyword);
            await expect(this.page.locator('body'), 'No error page').not.toContainText(/HTTP\s*\d{3}|Erreur|difficultés techniques/);
        });
    }

    async verifyQuoteListed(quoteId: string): Promise<void> {
        await expect(this.list.row(quoteId), `Quote ${quoteId} is listed`).toHaveCount(1);
    }

    async verifyQuoteFirst(quoteId: string): Promise<void> {
        const ids = await this.list.readRowQuoteIds();
        expect(ids[0], `Quote ${quoteId} is the first row`).toBe(quoteId);
    }

    async verifyOnlyQuotesListed(quoteIds: string[]): Promise<void> {
        await expect(this.list.rows, 'Number of listed quotes').toHaveCount(quoteIds.length);
        expect((await this.list.readRowQuoteIds()).sort(), 'Listed quote ids').toEqual([...quoteIds].sort());
    }

    async verifyEveryRowContains(text: string): Promise<void> {
        const rows = await this.list.readRowTexts();
        expect(rows.length, 'At least one row').toBeGreaterThan(0);
        for (const r of rows) expect(r.toLowerCase(), `Row "${r}"`).toContain(text.toLowerCase());
    }

    async verifyNoEntities(): Promise<void> {
        await test.step('The list shows "No entities found" and no table', async () => {
            await expect(this.list.lblNoEntities, 'Empty-state message').toHaveText('No entities found');
            await expect(this.list.tblQuotes, 'No quote table').toHaveCount(0);
        });
    }

    async verifyNoRowMentions(text: string): Promise<void> {
        const rows = await this.list.readRowTexts();
        for (const r of rows) expect(r, `Row "${r}"`).not.toContain(text);
    }

    async verifyKeywordBoxHolds(keyword: string): Promise<void> {
        await expect(this.list.txtSearchKeyword, 'Search box value').toHaveValue(keyword);
    }

    /**
     * Pages through the current search result (the page links keep the keyword) and checks every row on
     * every page contains `text`. Returns the number of pages.
     */
    async verifyEveryRowOnEveryPageContains(text: string): Promise<number> {
        return test.step(`Every row on every page contains "${text}"`, async () => {
            const base = new URL(this.page.url());
            const last = await this.list.readLastPageNumber();
            for (let p = 1; p <= last; p++) {
                base.searchParams.set('page', String(p));
                const status = await this.list.open(base.pathname + base.search);
                expect(status, `HTTP status of page ${p}`).toBeLessThan(400);
                await this.verifyEveryRowContains(text);
            }
            return last;
        });
    }

    // ── Result-size and paging checks ──────────────────────────────────────

    async verifyFewerPagesThan(pages: number, unfilteredPages: number, term: string): Promise<void> {
        expect(pages, `"${term}" narrows the list (unfiltered: ${unfilteredPages} pages)`).toBeLessThan(unfilteredPages);
    }

    async countBoldElements(): Promise<number> {
        return this.page.locator('b').count();
    }

    /** The typed term is shown as text, not rendered as HTML: no extra <b> element appears. */
    async verifyTermNotRenderedAsHtml(boldOnEmptyPage: number): Promise<void> {
        await expect(this.page.locator('b'), 'The term is not rendered as HTML (no extra <b> element)')
            .toHaveCount(boldOnEmptyPage);
    }

    /** After clearing: a full first page (10 rows) and, when given, the same page count as before the search. */
    async verifyFullListBack(unfilteredPages?: number): Promise<void> {
        await test.step('The full list is back after clearing the search', async () => {
            await expect(this.list.rows, 'Full first page after clearing').toHaveCount(10);
            if (unfilteredPages !== undefined) {
                expect(await this.list.readLastPageNumber(), 'Same page count as before the search').toBe(unfilteredPages);
            }
        });
    }

    /** Page 2 of the active list shows quotes that are not on page 1. */
    async verifyPage2DiffersFromPage1(): Promise<void> {
        await test.step('Page 2 of the Active list differs from page 1', async () => {
            const page1 = await this.list.readRowQuoteIds();
            await this.openQuoteList('active', '_locale=en&page=2');
            const page2 = await this.list.readRowQuoteIds();
            expect(page2.length, 'Rows on page 2').toBeGreaterThan(0);
            expect(page2.filter(id => page1.includes(id)), 'Page 2 shows different quotes from page 1').toEqual([]);
        });
    }

    async readLastPageNumber(): Promise<number> {
        return this.list.readLastPageNumber();
    }

    async readRowQuoteIds(): Promise<string[]> {
        return this.list.readRowQuoteIds();
    }
}
