import { expect, Page, test } from '@playwright/test';
import { QuoteDocumentsDownloadPage } from '../pages/dealerPortal/QuoteDocumentsDownloadPage';

/** Product rows of the "Summary of products" card on Dev, in page order. */
export const PRODUCT_ROWS = ['Extended warranty', 'Roadside Protection', 'Gap Insurance', 'Creditors insurance', 'Esthetic protection'] as const;

/**
 * "Download all documents" on a quote — AP-2496, dealer portal, Dev (v2dev).
 * Added in its own file so the QA's uncommitted DealerFlow.ts is left untouched; the login stays in
 * DealerFlow.loginToDealerPortal().
 * Every method is read-only: it opens quote pages and, at most, sends a GET to a download address.
 * Nothing is saved, created or cancelled on Dev.
 */
export class QuoteDocumentsDownloadFlow {
    private readonly docs: QuoteDocumentsDownloadPage;

    constructor(private readonly page: Page) {
        this.docs = new QuoteDocumentsDownloadPage(page);
    }

    async openQuoteDetails(quoteId: string, headingText: string): Promise<void> {
        await test.step(`Dealer opens quote ${quoteId}`, async () => {
            const response = await this.docs.open(quoteId);
            expect(response?.status() ?? 0, `HTTP status of /quote/${quoteId}/details`).toBeLessThan(400);
            await expect(this.docs.lblHeading, 'Quote heading').toContainText(`#${quoteId} - ${headingText}`);
            await expect(this.docs.cardSummary, 'Summary of products card').toBeVisible();
            await expect(this.docs.lblErrorText, 'No error page / HTTP error text').toHaveCount(0);
        });
    }

    /**
     * Locator control: on a quote that holds contracts (6040, read in the manual run's S-1) the action is found
     * exactly once with its own href — so the "hidden" checks below cannot pass because of a wrong locator.
     */
    async verifyLocatorControlOnQuoteWithContracts(quoteId: string): Promise<void> {
        await test.step(`CONTROL: quote ${quoteId} (holds contracts) shows exactly one "Download all documents" link`, async () => {
            await this.docs.open(quoteId);
            await expect(this.docs.lblHeading, 'Control quote heading').toContainText(`#${quoteId}`);
            await expect(this.docs.lnkDownloadAll(quoteId),
                `Control quote ${quoteId} must still hold a contract and show the action (AP-2496 S-1) — `
                + 'if it does not, pick another Dev quote with a generated contract').toHaveCount(1);
            await expect(this.docs.lnkDownloadAll(quoteId), 'Label').toHaveText(/Download all documents/);
            await expect(this.docs.lnkDownloadAllAny, 'Only one download-all link on the page').toHaveCount(1);
            await expect(this.docs.ctlDownloadAllByName, 'Only one control by name').toHaveCount(1);
        });
    }

    /** AP2496_002 steps 3–4 (state left by the manual run): the removed product is no longer active. */
    async verifyRemovedProductNoLongerActive(rowName: string, removedProductText: string): Promise<void> {
        await test.step(`The ${rowName} row no longer shows "${removedProductText}"`, async () => {
            await expect(this.docs.productRow(rowName), `${rowName} row`).toHaveCount(1);
            await expect(this.docs.productRow(rowName), 'Removed product no longer shown').not.toContainText(removedProductText);
        });
    }

    /** AP2496_002 step 4 first half / AP2496_003 step 2: every product row is empty and no contract document link is shown. */
    async verifyNoProductAndNoContractDocument(): Promise<void> {
        await test.step('No active product, contract number or contract download link on the quote', async () => {
            for (const row of PRODUCT_ROWS.filter((r) => r !== 'Esthetic protection')) {
                await expect(this.docs.productRow(row), `${row} row`).toContainText('None Selected');
            }
            const esthetic = await this.docs.readRowAmount('Esthetic protection');
            expect(esthetic, 'Esthetic protection amount column').toBe('-');
            await expect(this.docs.lnkContractDocumentAny, 'No contract PDF / download link').toHaveCount(0);
        });
    }

    /** AP2496_002 step 4 (judged): with nothing to download, the action is not shown. */
    async verifyDownloadAllHidden(quoteId: string): Promise<void> {
        await test.step('VERIFY: no "Download all documents" action is shown', async () => {
            await expect(this.docs.lnkDownloadAll(quoteId), 'Download-all link of this quote').toHaveCount(0);
            await expect(this.docs.lnkDownloadAllAny, 'Any download-all link').toHaveCount(0);
            await expect(this.docs.ctlDownloadAllByName, 'Any control named "Download all documents"').toHaveCount(0);
        });
    }

    /**
     * AP2496_003 steps 2–4 (record-only for Q-001): the page has no objective fault. Whether the action is shown is
     * recorded, not judged; if it is shown, its address must not answer with an HTTP 5xx.
     */
    async verifyNoFaultAndRecordAction(quoteId: string): Promise<void> {
        await test.step('VERIFY: no error on the page; the download action state is recorded (Q-001)', async () => {
            await expect(this.docs.lblErrorText, 'No error page / HTTP error text').toHaveCount(0);
            const shown = await this.docs.lnkDownloadAllAny.count();
            test.info().annotations.push({ type: 'Q-001 (record only)', description: `"Download all documents" shown on product-less quote ${quoteId}: ${shown > 0}` });
            if (shown > 0) {
                const href = await this.docs.readHref(this.docs.lnkDownloadAllAny.first());
                const response = await this.page.request.get(href);
                test.info().annotations.push({ type: 'Q-001 (record only)', description: `${href} → HTTP ${response.status()} ${response.headers()['content-type'] ?? ''}` });
                expect(response.status(), `HTTP status of ${href}`).toBeLessThan(500);
            }
        });
    }
}
