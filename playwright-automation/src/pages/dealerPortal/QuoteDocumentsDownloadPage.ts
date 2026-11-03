import { Locator, Page } from '@playwright/test';

/**
 * The "Download all documents" action of a quote's details page (/quote/{id}/details) — AP-2496, Dev (v2dev).
 * On Dev the action is one link in the last row of the "Summary of products" card, directly under Subtotal:
 * `<a href="/quote/{id}/documents/download" target="_blank">Download all documents</a>`
 * (French label "Télécharger tous les documents") — read on quote 6040 in the AP-2496 manual run (S-1).
 * Locators confirmed with a count of exactly 1 on quote 6040 by the spec's control step (AP-2496 s8, 2026-11-02).
 * Added in its own file so the QA's uncommitted QuoteDetailPage.ts / index.ts are left untouched.
 * No assertions here — see QuoteDocumentsDownloadFlow.
 */
export class QuoteDocumentsDownloadPage {
    private readonly page: Page;

    readonly lblHeading: Locator;
    readonly cardSummary: Locator;
    /** Any link to a merged-documents download, anywhere on the page. */
    readonly lnkDownloadAllAny: Locator;
    /** Any control whose visible name is "Download all documents" (EN) or "Télécharger tous les documents" (FR). */
    readonly ctlDownloadAllByName: Locator;
    /** Contract PDF / contract download links anywhere on the page (warranty, sale, Chubb, Permaplate…). */
    readonly lnkContractDocumentAny: Locator;
    /** The French / English technical-error page, or an "HTTP nnn" error text. */
    readonly lblErrorText: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lblHeading = page.locator('main h1').first();
        this.cardSummary = page.locator('.card').filter({ has: page.locator('h3', { hasText: 'Summary of products' }) });
        this.lnkDownloadAllAny = page.locator('a[href*="/documents/download"]');
        this.ctlDownloadAllByName = page.locator('a, button').filter({ hasText: /Download all documents|Télécharger tous les documents/ });
        this.lnkContractDocumentAny = page.locator('main a[href*="pdf"], main a[href*="contract-download"]');
        this.lblErrorText = page.locator('body', { hasText: /HTTP \d{3}|difficultés techniques/ });
    }

    /** The "Download all documents" link of this quote, inside the Summary of products card. */
    lnkDownloadAll(quoteId: string): Locator {
        return this.cardSummary.locator(`a[href="/quote/${quoteId}/documents/download"]`);
    }

    /** The product row whose first cell starts with the given name, e.g. "Esthetic protection". */
    productRow(rowName: string): Locator {
        return this.cardSummary.locator('tr').filter({ hasText: new RegExp(`^\\s*${rowName}`) });
    }

    /** The "⋯" menu button of a product row (a product without a contract has one). */
    btnRowMenu(rowName: string): Locator {
        return this.productRow(rowName).locator('button[data-toggle="dropdown"]');
    }

    async open(quoteId: string) {
        return this.page.goto(`/quote/${quoteId}/details`);
    }

    async readRowAmount(rowName: string): Promise<string> {
        return (await this.productRow(rowName).locator('td.text-right').first().innerText()).replace(/\s+/g, ' ').trim();
    }

    async readHref(locator: Locator): Promise<string> {
        return (await locator.getAttribute('href')) ?? '';
    }
}
