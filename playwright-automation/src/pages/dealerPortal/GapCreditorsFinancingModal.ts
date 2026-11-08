import { Locator, Page } from '@playwright/test';

/** Fields of the financing form `quote_financing` embedded in the GAP / creditors add modal. */
export type FinancingField =
    | 'applicant_dateOfBirthText' | 'type' | 'baseAmount' | 'residualAmount'
    | 'paymentFrequency' | 'termMonths' | 'interestRate' | 'financingCompany';

/**
 * Financing form embedded in the add-GAP-insurance and add-creditors-insurance modals (the "+" on the quote's
 * "Gap Insurance" / "Creditors insurance" rows, bodies from GET /quote/{id}/gap-insurance and /quote/{id}/insurance)
 * — AP-2499, dealer portal, Dev (v2dev).
 * The field inputs and the financing Save button are reused from QuoteProductSummaryPage (txtFinancing*,
 * selFinancing*, btnFinancingSave — all scoped to #myModal.show). This class holds only what that page lacks.
 * Locators verified on v2dev 2026-11-02 (AP-2499 s8) on quotes 6542 (GAP modal, no financing), 6543 (creditors
 * modal, financing stored) and 6534 (/quote/{id}/insurance opened as a page) — each counts exactly 1.
 * Added in its own file so the QA's uncommitted page objects and index.ts are left untouched.
 * No assertions here — see GapCreditorsFinancingFlow.
 */
export class GapCreditorsFinancingModal {
    private readonly page: Page;

    readonly mdlOpen: Locator;
    readonly frmFinancing: Locator;
    readonly lblFinancingHeading: Locator;
    readonly btnFinancingEdit: Locator;
    readonly pnlFinancingFields: Locator;
    readonly frmGapInsurance: Locator;
    readonly frmCreditorInsurance: Locator;
    readonly lblAddFinancingAlert: Locator;

    // Quote details page (outside the modal)
    readonly cardFinancing: Locator;

    // /quote/{id}/insurance opened directly as a page
    readonly frmFinancingOnPage: Locator;
    readonly txtBaseAmountOnPage: Locator;
    readonly frmCreditorInsuranceOnPage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.mdlOpen = page.locator('#myModal.show');
        this.frmFinancing = this.mdlOpen.locator('form[name="quote_financing"]');
        this.lblFinancingHeading = this.mdlOpen.locator('h4', { hasText: 'Financing' });
        this.btnFinancingEdit = this.frmFinancing.locator('button[data-toggle="collapse"]');
        this.pnlFinancingFields = this.frmFinancing.locator('.collapse');
        this.frmGapInsurance = this.mdlOpen.locator('form[name="quote_financing_insurance_gap"]');
        this.frmCreditorInsurance = this.mdlOpen.locator('form[name="quote_financing_insurance_chubb"]');
        this.lblAddFinancingAlert = this.mdlOpen.getByText('Please add a financing');

        this.cardFinancing = page.locator('.card').filter({ has: page.locator('h3', { hasText: /^\s*Financing\s*$/ }) });

        this.frmFinancingOnPage = page.locator('form[name="quote_financing"]');
        this.txtBaseAmountOnPage = page.locator('#quote_financing_baseAmount');
        this.frmCreditorInsuranceOnPage = page.locator('form[name="quote_financing_insurance_chubb"]');
    }

    /** The server's error text under one field's label inside the modal ("This value should not be blank."). */
    fieldError(field: FinancingField): Locator {
        return this.mdlOpen.locator(`label[for="quote_financing_${field}"] .form-error-message`);
    }

    /** One input of the embedded financing form, by its field name. */
    field(field: FinancingField): Locator {
        return this.mdlOpen.locator(`#quote_financing_${field}`);
    }

    /** The text of the option currently selected in a native <select> of the modal. */
    async selectedText(select: Locator): Promise<string> {
        return (await select.locator('option:checked').innerText()).trim();
    }

    /** The selects are wrapped by bootstrap-select; the hidden native <select> is set and its change event fired. */
    async choose(select: Locator, value: string): Promise<void> {
        await select.selectOption(value, { force: true });
    }

    /** Clicks the "Financing" heading so an open date picker closes before Save (Escape would close the modal). */
    async closeDatePicker(): Promise<void> {
        await this.lblFinancingHeading.click();
    }

    async readFinancingCard(): Promise<string> {
        return (await this.cardFinancing.innerText()).replace(/\s+/g, ' ').trim();
    }

    async expandFinancing(): Promise<void> {
        if (!(await this.pnlFinancingFields.evaluate(el => el.classList.contains('show')))) {
            await this.btnFinancingEdit.click();
        }
    }
}
