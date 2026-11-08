import { Page, Locator } from '@playwright/test';

/**
 * Permaplate Quote page of a quote — `/quote/{quoteId}/permaplate` ("Permaplate Quote").
 * One radio per Permaplate term linked to the dealer (`input[name="permaplate_id"]`, id `permaplate_{productId}`),
 * each with a `label[for=…]` carrying the term name, e.g. "10 ans".
 * Locators verified on v2dev, quote 6555, 2026-11-02 (AP-2501). No assertions here — see PermaplateInvoiceTermFlow.
 */
export class PermaplateQuotePage {
    private page: Page;

    readonly lblHeading: Locator;
    readonly radTerms: Locator;
    readonly radSelectedTerm: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lblHeading = page.locator('h1');
        this.radTerms = page.locator('input[type="radio"][name="permaplate_id"]');
        this.radSelectedTerm = page.locator('input[type="radio"][name="permaplate_id"]:checked');
    }

    async open(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /** Label text of the term radio that is checked (the term saved on the quote). */
    async readSelectedTermName(): Promise<string> {
        const id = (await this.radSelectedTerm.getAttribute('id')) || '';
        return ((await this.page.locator(`label[for="${id}"]`).innerText()) || '').trim();
    }
}
