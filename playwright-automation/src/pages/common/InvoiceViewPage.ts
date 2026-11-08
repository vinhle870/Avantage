import { Page, Locator } from '@playwright/test';

/**
 * Invoice list + invoice detail, shared by the Dealer portal (/invoice, /invoice/{id}) and the
 * Admin portal (/admin/invoices, /admin/invoice/{id}) — both render the same table and the same
 * "From: / To: / Status:" layout (qa-artifacts/qa-docs/billing-invoices.md).
 * Locators verified unique on v2dev, 2026-11-01 (AP-1381). No assertions here — see InvoiceToBlockFlow.
 */
export class InvoiceViewPage {
    private page: Page;

    // Invoice list
    readonly rows: Locator;
    readonly warrantyRows: Locator;
    readonly lnkLastPage: Locator;

    // Invoice detail
    readonly lblHeading: Locator;
    readonly blkTo: Locator;
    readonly lblToName: Locator;
    // Line-item table of the invoice detail (AP-2501; verified count = 1 on /invoice/941, v2dev, 2026-11-02)
    readonly lblDescriptionCell: Locator;
    readonly lblLineTotalCell: Locator;
    readonly lnkPermaplateContract: Locator;

    constructor(page: Page) {
        this.page = page;
        this.rows = page.locator('tr.clickable-row[data-href]');
        // The link in the Invoice ID cell names the source contract: "Warranty #…" or "#PNA-…"
        this.warrantyRows = this.rows.filter({
            has: page.locator('td:first-child a', { hasText: /^\s*Warranty #/ }),
        });
        this.lnkLastPage = page.locator('a.page-link').filter({ hasText: /^\s*Last\s*$/ });
        this.lblHeading = page.locator('h1');
        this.blkTo = page.locator("xpath=//div[h6[normalize-space()='To:']]");
        this.lblToName = this.blkTo.locator('xpath=./div/strong');
        this.lblDescriptionCell = page.locator("xpath=//table[thead/tr/th[normalize-space()='Description']]/tbody/tr/td[1]");
        this.lblLineTotalCell = page.locator("xpath=//table[thead/tr/th[normalize-space()='Description']]/tbody/tr/td[2]");
        // Footer link "#PNA-…" to the source contract's PDF download — the contract, not the invoice PDF
        this.lnkPermaplateContract = page.locator('a[href*="permaplate-contract-download"]');
    }

    /** Each `<br>`-separated line of the invoice's Description cell, trimmed, empty lines dropped. */
    async readDescriptionLines(): Promise<string[]> {
        const text = await this.lblDescriptionCell.innerText();
        return text.split('\n').map(l => l.trim()).filter(l => l !== '');
    }

    async open(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /** One list row by its target, e.g. "/invoice/934" or "/admin/invoice/934". */
    row(href: string): Locator {
        return this.page.locator(`tr.clickable-row[data-href="${href}"]`);
    }

    /** Opens the invoice by clicking its Description cell — the Invoice ID link goes to the source contract. */
    async openRow(href: string): Promise<void> {
        await this.row(href).locator('td').nth(1).click();
    }

    async goToLastPage(): Promise<void> {
        await this.lnkLastPage.click();
    }

    /** data-href, Invoice ID link text and "Created at" of a list row. */
    async readRow(row: Locator): Promise<{ href: string; source: string; createdAt: string }> {
        return {
            href: (await row.getAttribute('data-href')) || '',
            source: ((await row.locator('td:first-child a').textContent()) || '').trim(),
            createdAt: (await row.locator('td').nth(3).innerText()).trim(),
        };
    }

    /** Every line of the To block, without the "To:" label. */
    async readToLines(): Promise<string[]> {
        const text = await this.blkTo.innerText();
        return text.split('\n').map(l => l.trim()).filter(l => l !== '' && l !== 'To:');
    }

    async readToName(): Promise<string> {
        return ((await this.lblToName.innerText()) || '').trim();
    }
}
