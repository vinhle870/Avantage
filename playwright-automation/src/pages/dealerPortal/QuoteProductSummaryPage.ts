import { Locator, Page } from '@playwright/test';

/** The five optional products of a quote and the route segment of each one's add / edit form and cancel action. */
export type QuoteProduct = 'warranty' | 'roadside' | 'gap' | 'creditors' | 'permaplate';

export const PRODUCT_ROW_NAME: Record<QuoteProduct, string> = {
    warranty: 'Extended warranty',
    roadside: 'Roadside Protection',
    gap: 'Gap Insurance',
    creditors: 'Creditors insurance',
    permaplate: 'Esthetic protection',
};

/**
 * Quote details "Summary of products" card (/quote/{id}/details) on Dev (v2dev), its product rows,
 * the "⋯" row menus, the "Cancel a product" confirmation modal (AP-2493), and the forms the
 * AP-2493 cases use to build a fresh quote: vehicle step, warranty, financing, GAP and creditor insurance.
 * Locators verified on v2dev 2026-11-02 (AP-2493 s8) on quotes 6461, 6462, 6464 — each counts 1 once
 * scoped to its row or to the open modal (#myModal.show).
 * Added in its own file so the QA's uncommitted QuoteDetailPage.ts / index.ts are left untouched.
 * No assertions here — see QuoteCancelProductFlow.
 */
export class QuoteProductSummaryPage {
    private readonly page: Page;

    // Quote details
    readonly lblHeading: Locator;
    readonly lblAlerts: Locator;
    readonly cardSummary: Locator;
    readonly lblSubtotal: Locator;
    readonly lnkCancelProductAny: Locator;
    readonly lblErrorText: Locator;

    // Bootstrap modal shared by every product form and the cancel confirmation
    readonly mdlOpen: Locator;

    // Cancel confirmation modal
    readonly lblCancelTitle: Locator;
    readonly lblCancelQuestion: Locator;
    readonly btnCancelYes: Locator;
    readonly btnCancelNo: Locator;
    readonly btnCancelClose: Locator;

    // Vehicle step modal (/quote/{id}/vehicle)
    readonly txtVehicleDeliveredAt: Locator;
    readonly txtVehiclePrice: Locator;
    readonly btnVehicleSave: Locator;

    // Warranty modal (/quote/{id}/warranty/edit)
    readonly txtWarrantySalePrice: Locator;
    readonly btnWarrantySave: Locator;

    // Financing modal (/quote/{id}/financing)
    readonly lnkAddFinancing: Locator;
    readonly txtFinancingDateOfBirth: Locator;
    readonly selFinancingType: Locator;
    readonly txtFinancingBaseAmount: Locator;
    readonly txtFinancingResidual: Locator;
    readonly selFinancingFrequency: Locator;
    readonly selFinancingTerm: Locator;
    readonly txtFinancingInterest: Locator;
    readonly selFinancingCompany: Locator;
    readonly btnFinancingSave: Locator;

    // GAP modal (/quote/{id}/gap-insurance)
    readonly txtGapTerm: Locator;
    readonly btnGapGetQuote: Locator;

    // Creditor insurance page (/quote/{id}/insurance)
    readonly selChubbLanguage: Locator;
    readonly selChubbTaxExempt: Locator;
    readonly selChubbForm: Locator;
    readonly selChubbLifeType: Locator;
    readonly txtChubbLifeTerm: Locator;
    readonly selChubbLifeFor: Locator;
    readonly btnChubbGetQuote: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lblHeading = page.locator('main h1').first();
        this.lblAlerts = page.locator('[role="alert"]');
        this.cardSummary = page.locator('.card').filter({ has: page.locator('h3', { hasText: 'Summary of products' }) });
        this.lblSubtotal = this.cardSummary.locator('td.h5 strong');
        this.lnkCancelProductAny = page.locator('a[href*="/cancel-product/"]');
        this.lblErrorText = page.locator('body', { hasText: /HTTP \d{3}|difficultés techniques/ });

        this.mdlOpen = page.locator('#myModal.show');

        this.lblCancelTitle = this.mdlOpen.locator('h1');
        this.lblCancelQuestion = this.mdlOpen.locator('label[for="form_text"]');
        this.btnCancelYes = this.mdlOpen.locator('#form_save');
        this.btnCancelNo = this.mdlOpen.locator('a[data-dismiss="modal"]');
        this.btnCancelClose = this.mdlOpen.locator('button.close, [aria-label="Close"]');

        this.txtVehicleDeliveredAt = this.mdlOpen.locator('#quote_vehicle_deliveredAt');
        this.txtVehiclePrice = this.mdlOpen.locator('#quote_vehicle_price');
        this.btnVehicleSave = this.mdlOpen.locator('form[name="quote_vehicle"] button[type="submit"]');

        this.txtWarrantySalePrice = this.mdlOpen.locator('#quote_warranty_salePrice');
        this.btnWarrantySave = this.mdlOpen.locator('form[name="quote_warranty"] button[type="submit"]');

        this.lnkAddFinancing = page.locator('main a.btn[href$="/financing"]', { hasText: 'Add a financing' });
        this.txtFinancingDateOfBirth = this.mdlOpen.locator('#quote_financing_applicant_dateOfBirthText');
        this.selFinancingType = this.mdlOpen.locator('#quote_financing_type');
        this.txtFinancingBaseAmount = this.mdlOpen.locator('#quote_financing_baseAmount');
        this.txtFinancingResidual = this.mdlOpen.locator('#quote_financing_residualAmount');
        this.selFinancingFrequency = this.mdlOpen.locator('#quote_financing_paymentFrequency');
        this.selFinancingTerm = this.mdlOpen.locator('#quote_financing_termMonths');
        this.txtFinancingInterest = this.mdlOpen.locator('#quote_financing_interestRate');
        this.selFinancingCompany = this.mdlOpen.locator('#quote_financing_financingCompany');
        this.btnFinancingSave = this.mdlOpen.locator('form[name="quote_financing"] button[type="submit"]');

        this.txtGapTerm = this.mdlOpen.locator('#quote_financing_insurance_gap_gapTerm');
        this.btnGapGetQuote = this.mdlOpen.locator('form[name="quote_financing_insurance_gap"] button[type="submit"]');

        this.selChubbLanguage = page.locator('#quote_financing_insurance_chubb_language');
        this.selChubbTaxExempt = page.locator('#quote_financing_insurance_chubb_taxExempt');
        this.selChubbForm = page.locator('#quote_financing_insurance_chubb_formCompound');
        this.selChubbLifeType = page.locator('#quote_financing_insurance_chubb_lifeType');
        this.txtChubbLifeTerm = page.locator('#quote_financing_insurance_chubb_lifeTerm');
        this.selChubbLifeFor = page.locator('#quote_financing_insurance_chubb_lifeFor');
        this.btnChubbGetQuote = page.locator('form[name="quote_financing_insurance_chubb"] button[type="submit"]');
    }

    // ── Rows of the Summary of products card ─────────────────────────────────

    /** The product row whose first cell starts with the product name (the GAP note under Creditors is excluded). */
    row(product: QuoteProduct): Locator {
        return this.cardSummary.locator('tr').filter({ hasText: new RegExp(`^\\s*${PRODUCT_ROW_NAME[product]}`) });
    }

    /** Amount column of a product row: "CA$1,500.00", "- None Selected -", or "-" for Permaplate. */
    rowAmount(product: QuoteProduct): Locator {
        return this.row(product).locator('td.text-right').first();
    }

    /** The "⋯" button of a product row (only a product without a contract has one). */
    btnRowMenu(product: QuoteProduct): Locator {
        return this.row(product).locator('button[data-toggle="dropdown"]');
    }

    /** The red "+" of an empty product row. */
    lnkRowAdd(product: QuoteProduct): Locator {
        return this.row(product).locator('a.btn:has(.fa-plus-circle)');
    }

    /** The "Delete" item of a product row menu → /quote/{id}/cancel-product/{product}. */
    lnkDelete(quoteId: string, product: QuoteProduct): Locator {
        return this.page.locator(`a[href="/quote/${quoteId}/cancel-product/${product}"]`);
    }

    /** Any link of a row other than the menu items (e.g. a contract PDF link). */
    lnkRowPdf(product: QuoteProduct): Locator {
        return this.row(product).locator('a[href*="pdf"]');
    }

    alertWithText(text: string): Locator {
        return this.lblAlerts.filter({ hasText: text });
    }

    // ── Actions ──────────────────────────────────────────────────────────────

    async open(path: string): Promise<void> {
        await this.page.goto(path);
    }

    async reload(): Promise<void> {
        await this.page.reload();
    }

    /** Quote id from the current /quote/{id}/... URL. */
    currentQuoteId(): string {
        return /\/quote\/(\d+)\//.exec(this.page.url())?.[1] ?? '';
    }

    async readSubtotal(): Promise<string> {
        return (await this.lblSubtotal.innerText()).trim();
    }

    async readRowAmount(product: QuoteProduct): Promise<string> {
        return (await this.rowAmount(product).innerText()).replace(/\s+/g, ' ').trim();
    }

    async openRowMenu(product: QuoteProduct): Promise<void> {
        await this.btnRowMenu(product).click();
    }

    async clickDelete(quoteId: string, product: QuoteProduct): Promise<void> {
        await this.lnkDelete(quoteId, product).click();
    }

    async clickRowAdd(product: QuoteProduct): Promise<void> {
        await this.lnkRowAdd(product).click();
    }

    async confirmCancel(): Promise<void> {
        await this.btnCancelYes.click();
    }

    async declineCancel(): Promise<void> {
        await this.btnCancelNo.click();
    }

    async pressEscape(): Promise<void> {
        await this.page.keyboard.press('Escape');
    }

    /** Clicks the modal backdrop, outside the dialog box (top-left corner of the full-screen modal layer). */
    async clickOutsideModal(): Promise<void> {
        await this.mdlOpen.click({ position: { x: 5, y: 5 } });
    }

    async fillVehicleStep(deliveredAt: string, price: string): Promise<void> {
        await this.txtVehicleDeliveredAt.fill(deliveredAt);
        await this.txtVehiclePrice.fill(price);
        await this.btnVehicleSave.click();
    }

    /** Warranty modal: picks the term radio by its label, types the sale price, saves. */
    async fillWarranty(term: string, salePrice: string): Promise<void> {
        await this.mdlOpen.getByRole('radio', { name: term }).check();
        await this.txtWarrantySalePrice.fill(salePrice);
        await this.btnWarrantySave.click();
    }

    /** The selects are wrapped by bootstrap-select; the hidden native <select> is set and its change event fired. */
    private async choose(select: Locator, value: string): Promise<void> {
        await select.selectOption(value, { force: true });
    }

    async fillFinancing(f: {
        dateOfBirth: string; type: string; baseAmount: string; residual: string;
        frequency: string; termMonths: string; interestRate: string; companyId: string;
    }): Promise<void> {
        await this.txtFinancingDateOfBirth.fill(f.dateOfBirth);
        await this.choose(this.selFinancingType, f.type);
        await this.txtFinancingBaseAmount.fill(f.baseAmount);
        await this.txtFinancingResidual.fill(f.residual);
        await this.choose(this.selFinancingFrequency, f.frequency);
        await this.choose(this.selFinancingTerm, f.termMonths);
        await this.txtFinancingInterest.fill(f.interestRate);
        await this.choose(this.selFinancingCompany, f.companyId);
        await this.btnFinancingSave.click();
    }

    async fillGap(gapTerm: string): Promise<void> {
        await this.txtGapTerm.fill(gapTerm);
        await this.btnGapGetQuote.click();
    }

    async fillCreditorInsurance(c: {
        language: string; taxExempt: string; form: string; lifeType: string; lifeTerm: string; lifeFor: string;
    }): Promise<void> {
        await this.choose(this.selChubbLanguage, c.language);
        await this.choose(this.selChubbTaxExempt, c.taxExempt);
        await this.choose(this.selChubbForm, c.form);
        await this.choose(this.selChubbLifeType, c.lifeType);
        await this.txtChubbLifeTerm.fill(c.lifeTerm);
        await this.choose(this.selChubbLifeFor, c.lifeFor);
        await this.btnChubbGetQuote.click();
    }
}
