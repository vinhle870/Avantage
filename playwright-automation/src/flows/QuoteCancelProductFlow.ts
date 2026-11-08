import { expect, Page, test } from '@playwright/test';
import { QuoteClient } from '../data/dealer-portal';
import { DealerNewQuoteClientPage } from '../pages/dealerPortal/DealerNewQuoteClientPage';
import { PRODUCT_ROW_NAME, QuoteProduct, QuoteProductSummaryPage } from '../pages/dealerPortal/QuoteProductSummaryPage';

/** "CA$21,500.00" / "CA$18.58 /m" → 21500 / 18.58. */
export const money = (text: string): number => {
    const m = /CA\$\s*([\d,]+\.\d{2})/.exec(text);
    if (!m) throw new Error(`No CA$ amount in "${text}"`);
    return Number(m[1].replace(/,/g, ''));
};

/** Warranty values of vehicle 915 on Dev: one program, one term, a required Sale price. */
export interface WarrantyChoice {
    term: string;
    salePrice: string;
}

/** Values the AP-2493 cases type into the financing, GAP and creditor insurance forms. */
export const FINANCING_60M = {
    dateOfBirth: '1985-06-15', type: 'TYPE_FINANCING', baseAmount: '25000', residual: '0',
    frequency: 'FREQUENCY_MONTHLY', termMonths: '60', interestRate: '6.99', companyId: '39', // AutoCapital Canada
};
export const CREDITOR_PM30 = {
    language: 'E', taxExempt: '0', form: 'GC6201MQ:PM30', lifeType: 'DECREASING', lifeTerm: '60', lifeFor: 'BORROWER',
};

const CANCELLED = 'The product has been cancelled';

/**
 * Cancelling a product from a quote — AP-2493, dealer portal, Dev (v2dev).
 * Added in its own file so the QA's uncommitted DealerFlow.ts is left untouched; the login stays in
 * DealerFlow.loginToDealerPortal().
 * Read-only methods never confirm a cancellation. createQuoteFromVehicle(), addWarranty(), addFinancing(),
 * addGap(), addCreditorInsurance() and confirmCancel() write to Dev — use them only on a quote the test made.
 * No method generates a contract.
 */
export class QuoteCancelProductFlow {
    private readonly summary: QuoteProductSummaryPage;
    private readonly client: DealerNewQuoteClientPage;

    constructor(private readonly page: Page) {
        this.summary = new QuoteProductSummaryPage(page);
        this.client = new DealerNewQuoteClientPage(page);
    }

    // ── Opening and reading ──────────────────────────────────────────────────

    async openQuoteDetails(quoteId: string): Promise<void> {
        await test.step(`Dealer opens quote ${quoteId}`, async () => {
            const response = await this.page.goto(`/quote/${quoteId}/details`);
            expect(response?.status() ?? 0, `HTTP status of /quote/${quoteId}/details`).toBeLessThan(400);
            await expect(this.summary.lblHeading, 'Quote heading').toContainText(`#${quoteId}`);
            await expect(this.summary.cardSummary, 'Summary of products card').toBeVisible();
        });
    }

    async reloadQuoteDetails(quoteId: string): Promise<void> {
        await test.step(`Dealer reloads quote ${quoteId}`, async () => {
            await this.summary.open(`/quote/${quoteId}/details`);
            await expect(this.summary.lblHeading, 'Quote heading after reload').toContainText(`#${quoteId}`);
            await expect(this.summary.lblErrorText, 'No error page / HTTP error text').toHaveCount(0);
        });
    }

    async readSubtotal(): Promise<number> {
        return money(await this.summary.readSubtotal());
    }

    async readAmount(product: QuoteProduct): Promise<number> {
        return money(await this.summary.readRowAmount(product));
    }

    /** Precondition guard for a quote the manual run left on Dev: the product is still active, with this amount. */
    async verifyProductActive(quoteId: string, product: QuoteProduct, amount: string): Promise<void> {
        await test.step(`Quote ${quoteId} still has an active ${PRODUCT_ROW_NAME[product]} of ${amount}`, async () => {
            await expect(this.summary.row(product), `${PRODUCT_ROW_NAME[product]} row`).toHaveCount(1);
            await expect(this.summary.rowAmount(product),
                `Quote ${quoteId} must still carry its ${PRODUCT_ROW_NAME[product]} (left by the AP-2493 manual run) — `
                + 'if it was cancelled or changed, pick another Dev quote with this product and no contract')
                .toContainText(amount);
        });
    }

    // ── Building a fresh quote (writes to Dev) ───────────────────────────────

    /** /vehicle/{id}/details → "Create quote" (= /quote/new/client?fromVehicleId={id}), client form, then the vehicle step. */
    async createQuoteFromVehicle(vehicleId: string, client: QuoteClient, deliveredAt: string, price: string): Promise<string> {
        return test.step(`Dealer creates a quote from vehicle ${vehicleId} for ${client.lastName}`, async () => {
            await this.page.goto(`/quote/new/client?fromVehicleId=${vehicleId}`);
            await this.client.fillNewClientForm(client, true);
            await expect(this.page, 'Saving the client opens the quote details').toHaveURL(/\/quote\/\d+\/details/);
            await expect(this.summary.alertWithText('Client saved'), 'Flash "Client saved"').toHaveCount(1);
            const quoteId = this.summary.currentQuoteId();
            await expect(this.summary.lblHeading, 'Quote heading').toContainText(`#${quoteId} - ${client.firstName} ${client.lastName}`);

            await this.page.locator(`a.btn[href="/quote/${quoteId}/vehicle"]`).click();
            await this.summary.fillVehicleStep(deliveredAt, price);
            await this.reloadQuoteDetails(quoteId);
            await expect(this.summary.cardSummary.locator('tr').first(), 'Vehicle price on the quote')
                .toContainText(`CA$${Number(price).toLocaleString('en-US')}.00`);
            test.info().annotations.push({ type: 'Quote created on Dev', description: `${quoteId} (${client.email})` });
            return quoteId;
        });
    }

    async addWarranty(quoteId: string, warranty: WarrantyChoice): Promise<void> {
        await test.step(`Dealer adds the ${warranty.term} warranty at sale price ${warranty.salePrice}`, async () => {
            await expect(this.summary.lnkRowAdd('warranty'), 'Warranty add action').toBeVisible();
            await this.summary.clickRowAdd('warranty');
            await expect(this.summary.btnWarrantySave, 'Warranty modal').toBeVisible();
            await this.summary.fillWarranty(warranty.term, warranty.salePrice);
            await expect(this.summary.alertWithText('Warranty saved'), 'Flash "Warranty saved"').toHaveCount(1);
            await this.reloadQuoteDetails(quoteId);
        });
    }

    async addFinancing(quoteId: string): Promise<void> {
        await test.step('Dealer adds a financing (25,000, 60 months, 6.99 %)', async () => {
            await this.summary.lnkAddFinancing.click();
            await expect(this.summary.btnFinancingSave, 'Financing modal').toBeVisible();
            await this.summary.fillFinancing(FINANCING_60M);
            await expect(this.summary.alertWithText('Financing saved'), 'Flash "Financing saved"').toHaveCount(1);
            await this.reloadQuoteDetails(quoteId);
        });
    }

    async addGap(quoteId: string, gapTerm: string): Promise<void> {
        await test.step(`Dealer adds GAP insurance (Gap Term ${gapTerm})`, async () => {
            await this.summary.clickRowAdd('gap');
            await expect(this.summary.btnGapGetQuote, 'GAP modal').toBeVisible();
            await this.summary.fillGap(gapTerm);
            await expect(this.summary.alertWithText('GAP insurance quote saved successfully'), 'GAP saved').toHaveCount(1);
            await this.reloadQuoteDetails(quoteId);
        });
    }

    async addCreditorInsurance(quoteId: string): Promise<void> {
        await test.step('Dealer gets a creditor insurance quote (PM30, Life Decreasing 60, Borrower)', async () => {
            await this.summary.open(`/quote/${quoteId}/insurance`);
            await expect(this.summary.btnChubbGetQuote, 'Creditor insurance form').toBeVisible();
            await this.summary.fillCreditorInsurance(CREDITOR_PM30);
            await expect(this.summary.alertWithText('Chubb insurance quote saved successfully'), 'Creditor quote saved')
                .toHaveCount(1, { timeout: 30000 });
            await this.reloadQuoteDetails(quoteId);
        });
    }

    // ── Cancel action (AC 1) ─────────────────────────────────────────────────

    /** AP2493_001–005 step 4: the row's "⋯" menu offers a visible, enabled "Delete" pointing to cancel-product. */
    async verifyDeleteOffered(quoteId: string, product: QuoteProduct): Promise<void> {
        await test.step(`VERIFY: the ${PRODUCT_ROW_NAME[product]} row offers Delete`, async () => {
            await this.summary.openRowMenu(product);
            const del = this.summary.lnkDelete(quoteId, product);
            await expect(del, 'Delete menu item').toBeVisible();
            await expect(del, 'Delete menu item enabled').toBeEnabled();
            await expect(del, 'Label').toHaveText(/Delete/);
            await expect(this.summary.row(product).locator(`a[href="/quote/${quoteId}/cancel-product/${product}"]`),
                'Delete belongs to this row').toHaveCount(1);
            await this.summary.pressEscape();
        });
    }

    /** AP2493_006 step 4: a product with a generated contract has no menu and no cancel action, and keeps its PDF link. */
    async verifyFinalizedHasNoDelete(product: QuoteProduct, contractNumber: string): Promise<void> {
        await test.step(`VERIFY: the ${PRODUCT_ROW_NAME[product]} with contract ${contractNumber} has no Delete and keeps its download link`, async () => {
            await expect(this.summary.row(product), 'Row carries the contract number').toContainText(contractNumber);
            await expect(this.summary.btnRowMenu(product), 'No "⋯" menu on the finalized row').toHaveCount(0);
            await expect(this.summary.lnkCancelProductAny, 'No cancel action anywhere on the quote').toHaveCount(0);
            await expect(this.summary.lnkRowPdf(product), 'Contract download (PDF) link').toBeVisible();
        });
    }

    // ── Confirmation modal (AC 2) ────────────────────────────────────────────

    async openCancelModal(quoteId: string, product: QuoteProduct): Promise<void> {
        await test.step(`Dealer chooses Delete on the ${PRODUCT_ROW_NAME[product]} row`, async () => {
            await this.summary.openRowMenu(product);
            await this.summary.clickDelete(quoteId, product);
            await expect(this.summary.btnCancelYes, 'Confirmation modal open').toBeVisible();
        });
    }

    /** AP2493_007 step 3: the modal is shown, names the product, and nothing has changed behind it. */
    async verifyCancelModalShownAndRowUnchanged(quoteId: string, product: QuoteProduct, amount: string, subtotal: string): Promise<void> {
        await test.step('VERIFY: the confirmation modal is open and the product is still on the quote', async () => {
            const name = PRODUCT_ROW_NAME[product];
            await expect(this.page, 'Still on the quote details').toHaveURL(new RegExp(`/quote/${quoteId}/details`));
            await expect(this.summary.lblCancelTitle, 'Modal title (Q-005, recorded)').toHaveText(`Cancel a product - ${name}`);
            await expect(this.summary.lblCancelQuestion, 'Modal question (Q-005, recorded)')
                .toHaveText(`Are you sure you want to cancel this product: ${name}?`);
            await expect(this.summary.btnCancelYes, 'Confirm button').toHaveText('Yes, cancel the product');
            await expect(this.summary.btnCancelNo, 'Decline button').toHaveText('No');
            await expect(this.summary.rowAmount(product), 'Row unchanged behind the modal').toContainText(amount);
            await expect(this.summary.lblSubtotal, 'Subtotal unchanged behind the modal').toHaveText(subtotal);
        });
    }

    async declineCancel(): Promise<void> {
        await test.step('Dealer clicks "No"', async () => {
            await this.summary.declineCancel();
            await expect(this.summary.mdlOpen, 'Modal closed').toHaveCount(0);
        });
    }

    /** AP2493_008 steps 2–3: no × icon; Escape closes the modal; a click outside closes it. */
    async dismissCancelModalWithoutAnswering(quoteId: string, product: QuoteProduct): Promise<void> {
        await test.step('Dealer closes the modal without answering — Escape, then a click outside', async () => {
            await this.openCancelModal(quoteId, product);
            await expect(this.summary.btnCancelClose, 'No × close icon (recorded)').toHaveCount(0);
            await this.summary.pressEscape();
            await expect(this.summary.mdlOpen, 'Escape closes the modal').toHaveCount(0);
            await expect(this.page, 'URL unchanged after Escape').toHaveURL(new RegExp(`/quote/${quoteId}/details`));

            await this.openCancelModal(quoteId, product);
            await this.summary.clickOutsideModal();
            await expect(this.summary.mdlOpen, 'A click outside closes the modal').toHaveCount(0);
            await expect(this.page, 'URL unchanged after the outside click').toHaveURL(new RegExp(`/quote/${quoteId}/details`));
        });
    }

    /** AP2493_007 step 5 / AP2493_008 step 5: after a reload the product and the Subtotal are as before. */
    async verifyProductUnchanged(product: QuoteProduct, amount: string, subtotal: string): Promise<void> {
        await test.step(`VERIFY: the ${PRODUCT_ROW_NAME[product]} and the Subtotal are unchanged`, async () => {
            await expect(this.summary.rowAmount(product), 'Product amount').toContainText(amount);
            await expect(this.summary.btnRowMenu(product), 'Product still has its menu').toHaveCount(1);
            await expect(this.summary.lblSubtotal, 'Subtotal').toHaveText(subtotal);
        });
    }

    /** Confirms the cancellation — writes to Dev. */
    async confirmCancel(quoteId: string, product: QuoteProduct): Promise<void> {
        await test.step(`Dealer confirms "Yes, cancel the product" for the ${PRODUCT_ROW_NAME[product]}`, async () => {
            await this.openCancelModal(quoteId, product);
            await this.summary.confirmCancel();
            await expect(this.page, 'Back on the quote details').toHaveURL(new RegExp(`/quote/${quoteId}/details`));
            await expect(this.summary.alertWithText(CANCELLED), `Flash "${CANCELLED}" (Q-008, recorded)`).toHaveCount(1);
            await expect(this.summary.lblErrorText, 'No error page').toHaveCount(0);
        });
    }

    // ── After cancelling (AC 3 + Subtotal) ───────────────────────────────────

    /** AP2493_009 step 4 / AP2493_014 step 4(a): the product is gone and its add action is back. */
    async verifyProductRemovedAndAddBack(quoteId: string, product: QuoteProduct): Promise<void> {
        await test.step(`VERIFY: no ${PRODUCT_ROW_NAME[product]} left and its "+" is back`, async () => {
            await expect(this.summary.rowAmount(product), 'Row shows no product').toContainText('None Selected');
            await expect(this.summary.btnRowMenu(product), 'No menu on the empty row').toHaveCount(0);
            await expect(this.summary.lnkRowAdd(product), 'Add action back').toBeVisible();
            await expect(this.summary.lnkDelete(quoteId, product), 'No cancel action left for it').toHaveCount(0);
        });
    }

    async verifySubtotal(expected: number, why: string): Promise<void> {
        await test.step(`VERIFY: Subtotal = ${expected.toFixed(2)} (${why})`, async () => {
            await expect.poll(() => this.readSubtotal(), { message: `Subtotal (${why})` }).toBeCloseTo(expected, 2);
        });
    }

    /** AP2493_010 step 4: exactly one warranty row, carrying the new sale price. */
    async verifySingleRowWithAmount(product: QuoteProduct, amount: string, notAmount: string): Promise<void> {
        await test.step(`VERIFY: one ${PRODUCT_ROW_NAME[product]} row of ${amount} (not ${notAmount})`, async () => {
            await expect(this.summary.row(product), 'Exactly one row').toHaveCount(1);
            await expect(this.summary.rowAmount(product), 'New amount').toHaveText(amount);
            await expect(this.summary.btnRowMenu(product), 'The new product has its own menu').toHaveCount(1);
        });
    }

    /** AP2493_014 step 4(b): the other product is still shown with its own cancel action. */
    async verifyProductStillThere(quoteId: string, product: QuoteProduct): Promise<void> {
        await test.step(`VERIFY: the ${PRODUCT_ROW_NAME[product]} is still on the quote`, async () => {
            await expect(this.summary.rowAmount(product), 'Amount shown').toContainText('CA$');
            await expect(this.summary.lnkDelete(quoteId, product), 'Its own Delete is still there').toHaveCount(1);
        });
    }

    // ── Archived quote (AP2493_013) ──────────────────────────────────────────

    /** AP2493_013 step 1: the quote is listed in the Archived tab (/quotes/archived). */
    async verifyQuoteIsArchived(quoteId: string): Promise<void> {
        await test.step(`Quote ${quoteId} is listed in the Archived tab`, async () => {
            await this.summary.open('/quotes/archived');
            await expect(this.page.locator(`main td[data-href="/quote/${quoteId}/details"]`).first(),
                `Quote ${quoteId} in /quotes/archived`).toBeAttached();
        });
    }

    /** AP2493_013 step 4: the archived quote renders without an error; whether Delete is offered is recorded (Q-004). */
    async verifyArchivedQuoteRenders(quoteId: string, product: QuoteProduct): Promise<void> {
        await test.step(`VERIFY: archived quote ${quoteId} renders without an error`, async () => {
            await expect(this.summary.lblErrorText, 'No error page / HTTP error text').toHaveCount(0);
            await expect(this.summary.row(product), `${PRODUCT_ROW_NAME[product]} row shown`).toHaveCount(1);
            const offered = await this.summary.lnkDelete(quoteId, product).count();
            test.info().annotations.push({ type: 'Q-004 (record only)', description: `Delete offered on archived quote ${quoteId}: ${offered > 0}` });
        });
    }
}
