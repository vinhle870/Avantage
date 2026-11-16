import { Locator, Page } from '@playwright/test';

/** One coverage block of the Chubb form: type, term and (quote page only) covered person; '' clears a field. */
export interface ChubbCoverage {
    type: string;   // option value, e.g. DECREASING, 30D_RETRO, or '' for "Select type"
    term: string;
    forWhom?: string; // option value BORROWER / CO_BORROWER / BOTH, or '' for "Select coverage" (quote page only)
}

export type ChubbBlock = 'life' | 'criticalIllness' | 'disability';

/**
 * Chubb creditor insurance — the quote insurance page (/quote/{id}/insurance, form quote_financing_insurance_chubb),
 * the Creditors insurance row details on /quote/{id}/details, and the Insurance Quick Quote page
 * (/quick-insurance-quote, form quick_insurance_chubb) — AP-2410, dealer portal, Dev (v2dev).
 * Language / Tax exempt / Form / Life locators and the Summary-of-products rows are reused from
 * QuoteProductSummaryPage; this class holds only what that page lacks (Critical illness, Disability, the row's
 * chevron details and the quick quote).
 * Locators verified on v2dev 2026-11-08 (AP-2410 s8) on quote 6696 and /quick-insurance-quote — each counts 1.
 * Added in its own file so the QA's uncommitted page objects and index.ts are left untouched.
 * No assertions here — see ChubbInsuranceQuoteFlow.
 */
export class ChubbInsuranceQuotePage {
    private readonly page: Page;

    // Quote insurance page
    readonly frmChubb: Locator;
    readonly lblFinancingBlock: Locator;
    readonly lblInvalidField: Locator;

    // Quote details — Creditors insurance row details
    readonly btnCreditorsChevron: Locator;
    readonly pnlCreditorsDetails: Locator;
    readonly rowsCreditorsCoverage: Locator;

    // Quick quote page
    readonly frmQuick: Locator;
    readonly selQuickForm: Locator;
    readonly txtQuickBorrowerDob: Locator;
    readonly txtQuickMonthlyPayment: Locator;
    readonly txtQuickTermMonths: Locator;
    readonly txtQuickResidual: Locator;
    readonly btnQuickGetQuote: Locator;
    readonly tblQuickResults: Locator;
    readonly rowsQuickCoverage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.frmChubb = page.locator('form[name="quote_financing_insurance_chubb"]');
        this.lblFinancingBlock = page.locator('form[name="quote_financing"]');
        this.lblInvalidField = page.locator('.is-invalid, .form-error-message');

        this.btnCreditorsChevron = page.locator('button[data-target="#chubbDetails"]');
        this.pnlCreditorsDetails = page.locator('#chubbDetails');
        this.rowsCreditorsCoverage = this.pnlCreditorsDetails.locator('table').first().locator('tbody tr');

        this.frmQuick = page.locator('form[name="quick_insurance_chubb"]');
        this.selQuickForm = page.locator('#quick_insurance_chubb_form');
        this.txtQuickBorrowerDob = page.locator('#quick_insurance_chubb_borrowerDOB');
        this.txtQuickMonthlyPayment = page.locator('#quick_insurance_chubb_monthlyPayment');
        this.txtQuickTermMonths = page.locator('#quick_insurance_chubb_termMonths');
        this.txtQuickResidual = page.locator('#quick_insurance_chubb_residualAmount');
        this.btnQuickGetQuote = this.frmQuick.locator('button[type="submit"]');
        this.tblQuickResults = page.locator('main table');
        this.rowsQuickCoverage = this.tblQuickResults.first().locator('tbody tr');
    }

    // ── Quote insurance page ─────────────────────────────────────────────────

    selType(block: ChubbBlock): Locator {
        return this.page.locator(`#quote_financing_insurance_chubb_${block}Type`);
    }

    txtTerm(block: ChubbBlock): Locator {
        return this.page.locator(`#quote_financing_insurance_chubb_${block}Term`);
    }

    selFor(block: ChubbBlock): Locator {
        return this.page.locator(`#quote_financing_insurance_chubb_${block}For`);
    }

    /** The selects are wrapped by bootstrap-select; the hidden native <select> is set and its change event fired. */
    async choose(select: Locator, value: string): Promise<void> {
        await select.selectOption(value, { force: true });
    }

    /** Values of the options a native <select> lists. */
    async optionValues(select: Locator): Promise<string[]> {
        return select.locator('option').evaluateAll(opts => opts.map(o => (o as HTMLOptionElement).value));
    }

    /** "value=label" of every option a native <select> lists (recorded, never asserted on the label). */
    async optionLabels(select: Locator): Promise<string[]> {
        return select.locator('option').evaluateAll(opts =>
            opts.map(o => `${(o as HTMLOptionElement).value}=${(o.textContent ?? '').trim()}`));
    }

    async setCoverage(block: ChubbBlock, c: ChubbCoverage): Promise<void> {
        await this.choose(this.selType(block), c.type);
        await this.txtTerm(block).fill(c.term);
        if (c.forWhom !== undefined) await this.choose(this.selFor(block), c.forWhom);
    }

    // ── Quote details row ────────────────────────────────────────────────────

    async openCreditorsDetails(): Promise<void> {
        await this.btnCreditorsChevron.click();
    }

    async readCreditorsDetails(): Promise<string> {
        return (await this.pnlCreditorsDetails.innerText()).replace(/\s+/g, ' ').trim();
    }

    // ── Quick quote page ─────────────────────────────────────────────────────

    quickType(block: ChubbBlock): Locator {
        return this.page.locator(`#quick_insurance_chubb_${block}Type`);
    }

    quickTerm(block: ChubbBlock): Locator {
        return this.page.locator(`#quick_insurance_chubb_${block}Term`);
    }

    async fillQuickQuote(q: {
        form: string; borrowerDob: string; monthlyPayment: string; termMonths: string; residual: string;
    }): Promise<void> {
        await this.choose(this.selQuickForm, q.form);
        await this.txtQuickBorrowerDob.fill(q.borrowerDob);
        await this.txtQuickMonthlyPayment.fill(q.monthlyPayment);
        await this.txtQuickTermMonths.fill(q.termMonths);
        await this.txtQuickResidual.fill(q.residual);
    }

    async setQuickCoverage(block: ChubbBlock, c: ChubbCoverage): Promise<void> {
        await this.choose(this.quickType(block), c.type);
        await this.quickTerm(block).fill(c.term);
    }

    async clickQuickGetQuote(): Promise<void> {
        await this.btnQuickGetQuote.click();
    }
}
