import { expect, Page, test } from '@playwright/test';
import { config } from '../data/config';
import { InvoiceViewPage } from '../pages/common/InvoiceViewPage';
import { PermaplateQuotePage } from '../pages/dealerPortal/PermaplateQuotePage';

const origin = (url: string): string => new URL(url).origin;

/** An amount such as "$80.00", "80$", "1,234.56" — a price must never appear inside the Description cell. */
const PRICE = /\$\s*\d|\d[\d,]*[.,]\d{2}\s*\$?|\d+\s*\$/;

export interface PermaplateInvoice {
    invoiceId: string;
    quoteId: string;
    contractNumber: string;
    termName: string;
    lineTotal: string;
}

/**
 * Permaplate invoice names the term sold in its description (AP-2501).
 * Added in its own file so the QA's uncommitted AdminFlow.ts / DealerFlow.ts are left untouched.
 * Read-only: opens an existing quote and its invoice; never generates a contract or saves anything.
 */
export class PermaplateInvoiceTermFlow {
    private readonly invoices: InvoiceViewPage;
    private readonly permaplateQuote: PermaplateQuotePage;

    constructor(private readonly page: Page) {
        this.invoices = new InvoiceViewPage(page);
        this.permaplateQuote = new PermaplateQuotePage(page);
    }

    private dealerUrl(path: string): string {
        return `${origin(config.dealerPortalUrl)}${path}`;
    }

    /** AP2501_001 step 2: the term saved on the quote's Permaplate Quote page is the one expected. */
    async verifyTermSoldOnQuote(invoice: PermaplateInvoice): Promise<void> {
        await test.step(`Quote ${invoice.quoteId} has the Permaplate term "${invoice.termName}" selected`, async () => {
            await this.permaplateQuote.open(this.dealerUrl(`/quote/${invoice.quoteId}/permaplate`));
            await expect(this.permaplateQuote.lblHeading, 'Permaplate Quote page').toHaveText('Permaplate Quote');
            await expect(this.permaplateQuote.radSelectedTerm, 'Exactly one term is selected').toHaveCount(1);
            expect(await this.permaplateQuote.readSelectedTermName(), 'Term saved on the quote').toBe(invoice.termName);
        });
    }

    /** AP2501_001 step 4: open /invoice/{id}; it loads and its contract link names the quote's contract. */
    async openDealerInvoice(invoice: PermaplateInvoice): Promise<void> {
        await test.step(`Dealer opens invoice ${invoice.invoiceId}`, async () => {
            const response = await this.page.goto(this.dealerUrl(`/invoice/${invoice.invoiceId}`));
            expect(response?.status() ?? 0, `HTTP status of /invoice/${invoice.invoiceId}`).toBeLessThan(400);
            await expect(this.invoices.lblHeading, 'Invoice detail heading').toHaveText(`Invoice #${invoice.invoiceId}`);
            await expect(this.invoices.lblDescriptionCell, 'Description cell is shown').toBeVisible();
            await expect(this.invoices.lnkPermaplateContract, 'Source contract link').toHaveText(`#${invoice.contractNumber}`);
            await expect(this.invoices.lnkPermaplateContract, 'Contract link belongs to the quote')
                .toHaveAttribute('href', `/quote/${invoice.quoteId}/permaplate-contract-download`);
        });
    }

    /**
     * AP2501_001 step 5: the Description names the term sold and the real contract number, and holds no price.
     * The term's position after the contract number (Q-001, Blocking) is recorded, not judged.
     */
    async verifyDescriptionNamesTerm(invoice: PermaplateInvoice): Promise<void> {
        await test.step(`Invoice ${invoice.invoiceId} description names "${invoice.termName}" and ${invoice.contractNumber}, no price`, async () => {
            const lines = await this.invoices.readDescriptionLines();
            test.info().annotations.push({ type: 'Description lines', description: lines.join(' | ') });

            expect(lines, `Description contains the term "${invoice.termName}"`).toContain(invoice.termName);
            expect(lines, `Description contains the contract number ${invoice.contractNumber}`).toContain(invoice.contractNumber);
            expect(lines.filter(l => /^PNA-\d+$/.test(l)), 'Only the real contract number is cited')
                .toEqual([invoice.contractNumber]);
            expect(lines.filter(l => PRICE.test(l)), 'No price inside the Description').toEqual([]);
            await expect(this.invoices.lblLineTotalCell, 'Line Total is the dealer cost').toHaveText(invoice.lineTotal);

            const position = lines.indexOf(invoice.termName) - lines.indexOf(invoice.contractNumber);
            test.info().annotations.push({
                type: 'Q-001 (record only)',
                description: `term is ${position} line(s) after the contract number`,
            });
        });
    }
}
