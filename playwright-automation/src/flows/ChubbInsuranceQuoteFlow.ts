import { expect, Page, test } from '@playwright/test';
import { ChubbBlock, ChubbCoverage, ChubbInsuranceQuotePage } from '../pages/dealerPortal/ChubbInsuranceQuotePage';
import { QuoteProductSummaryPage } from '../pages/dealerPortal/QuoteProductSummaryPage';

/** One Chubb creditor quote as the dealer fills the /quote/{id}/insurance form (option values, never labels). */
export interface ChubbQuoteInput {
    language: 'E' | 'F';
    taxExempt: '0' | '1';
    form: string;                  // GC6201MQ:PM30 / GC6201MQ:PM50
    life: ChubbCoverage;
    criticalIllness: ChubbCoverage;
    disability: ChubbCoverage;
}

/** What the Creditors insurance row details on /quote/{id}/details must show after the save. */
export interface ChubbSavedExpectation {
    rateTable: string;             // PM30 / PM50
    language: string;              // English / Français
    taxExempt: string;             // Yes / No
    coverages: { label: string; forWhom: string; term: string }[];
}

export const PM30 = 'GC6201MQ:PM30';
export const PM50 = 'GC6201MQ:PM50';
export const UNSET: ChubbCoverage = { type: '', term: '', forWhom: '' };

const SAVED = 'Chubb insurance quote saved successfully';
/** A Chubb API failure starts "HTTP/2 4xx returned for …"; the reported one said "Debtor is -1 years old". */
const CHUBB_ERROR = /HTTP\/|HTTP \d{3}|years old/;
const BLOCKS: ChubbBlock[] = ['life', 'criticalIllness', 'disability'];

/**
 * Chubb creditor insurance quote — AP-2410 re-test (bug: submitting with every required option filled still showed
 * an error), dealer portal, Dev (v2dev).
 * Added in its own file so the QA's uncommitted DealerFlow.ts is left untouched; the login stays in
 * DealerFlow.loginToDealerPortal().
 * Not asserted on purpose: the Form value of the reopened insurance form (open bug AP-2557 — the saved rate table
 * is not restored) and the co-applicant contact block (open bug AP-2558).
 * Writes to Dev: getQuote() re-saves the creditor insurance quote of the quote it is given. No contract is generated.
 */
export class ChubbInsuranceQuoteFlow {
    private readonly summary: QuoteProductSummaryPage;
    private readonly chubb: ChubbInsuranceQuotePage;

    constructor(private readonly page: Page) {
        this.summary = new QuoteProductSummaryPage(page);
        this.chubb = new ChubbInsuranceQuotePage(page);
    }

    private async expectNoChubbError(where: string): Promise<void> {
        await expect(this.summary.lblAlerts.filter({ hasText: CHUBB_ERROR }), `${where}: no Chubb error banner`).toHaveCount(0);
        await expect(this.page.locator('body'), `${where}: no "HTTP" / "years old" text`).not.toContainText(CHUBB_ERROR);
    }

    // ── Quote details (precondition) ─────────────────────────────────────────

    /** Step 1 guard: the quote the manual run left on Dev still exists with its client and its vehicle. */
    async verifyQuoteOfRecord(quoteId: string, clientName: string, vin: string): Promise<void> {
        await test.step(`Quote ${quoteId} (${clientName}, VIN ${vin}) is still on Dev`, async () => {
            const response = await this.page.goto(`/quote/${quoteId}/details`);
            expect(response?.status() ?? 0, `HTTP status of /quote/${quoteId}/details`).toBeLessThan(400);
            await expect(this.summary.lblHeading,
                `Quote ${quoteId} must still be the AP-2410 quote — if it changed, run AP2410_001 step 1 by hand and update QUOTE_ID`)
                .toContainText(`#${quoteId} - ${clientName} ${vin}`);
            await expect(this.summary.row('creditors'), 'Creditors insurance row').toHaveCount(1);
        });
    }

    // ── Quote insurance page ─────────────────────────────────────────────────

    /** Step 2: /quote/{id}/insurance opens as a page with the collapsed Financing block and the Chubb form. */
    async openInsurancePage(quoteId: string, financingSummary: string): Promise<void> {
        await test.step(`Dealer opens /quote/${quoteId}/insurance`, async () => {
            const response = await this.page.goto(`/quote/${quoteId}/insurance`);
            expect(response?.status() ?? 0, `HTTP status of /quote/${quoteId}/insurance`).toBeLessThan(400);
            await expect(this.page.locator('main h1').first(), 'Page heading').toContainText('Insurance for');
            await expect(this.chubb.lblFinancingBlock, 'Financing block').toContainText(financingSummary);
            await expect(this.chubb.frmChubb, 'Creditors Insurance Quote form').toBeVisible();
            await expect(this.summary.btnChubbGetQuote, 'Get Quote button').toHaveText(/Get Quote/);
            await this.expectNoChubbError('Insurance page on open');
        });
    }

    /** AP2410_001 step 2: the Form drop-down offers PM30 and PM50 (labels recorded only — Q-001). */
    async verifyFormOptions(): Promise<void> {
        await test.step('VERIFICATION POINT: the Form drop-down offers GC6201MQ:PM30 and GC6201MQ:PM50', async () => {
            const values = await this.chubb.optionValues(this.summary.selChubbForm);
            expect(values, 'Form option values').toEqual(expect.arrayContaining([PM30, PM50]));
            test.info().annotations.push({ type: 'Form options (Q-001, record only)',
                description: (await this.chubb.optionLabels(this.summary.selChubbForm)).join(' | ') });
        });
    }

    /** AP2410_004 step 1/3 guard: Co borrower and Both are offered only once the financing has a co-applicant. */
    async verifyCoBorrowerOffered(): Promise<void> {
        await test.step('Precondition: every "For" drop-down offers Co borrower and Both (the co-applicant is on the financing)', async () => {
            for (const block of BLOCKS) {
                expect(await this.chubb.optionValues(this.chubb.selFor(block)),
                    `${block} "For" options — Co borrower / Both need the co-applicant Coapp Retest2410 the manual run added`)
                    .toEqual(expect.arrayContaining(['BORROWER', 'CO_BORROWER', 'BOTH']));
            }
        });
    }

    /** Step 3: sets every field (Form before Life — changing Form clears the Life type, O-4) and checks each one. */
    async fillQuote(q: ChubbQuoteInput): Promise<void> {
        await test.step(`Dealer fills the Chubb form: ${JSON.stringify(q)}`, async () => {
            await this.chubb.choose(this.summary.selChubbLanguage, q.language);
            await this.chubb.choose(this.summary.selChubbTaxExempt, q.taxExempt);
            await this.chubb.choose(this.summary.selChubbForm, q.form);
            await this.chubb.setCoverage('life', q.life);
            await this.chubb.setCoverage('criticalIllness', q.criticalIllness);
            await this.chubb.setCoverage('disability', q.disability);

            await expect(this.summary.selChubbLanguage, 'Language').toHaveValue(q.language);
            await expect(this.summary.selChubbTaxExempt, 'Tax exempt').toHaveValue(q.taxExempt);
            await expect(this.summary.selChubbForm, 'Form (by value)').toHaveValue(q.form);
            await this.expectCoverages(q);
            await expect(this.chubb.lblInvalidField, 'No field shown as invalid before Get Quote').toHaveCount(0);
        });
    }

    private async expectCoverages(q: ChubbQuoteInput): Promise<void> {
        for (const block of BLOCKS) {
            const c = q[block];
            await expect(this.chubb.selType(block), `${block} type`).toHaveValue(c.type);
            await expect(this.chubb.txtTerm(block), `${block} term`).toHaveValue(c.term);
            if (c.forWhom !== undefined) await expect(this.chubb.selFor(block), `${block} for`).toHaveValue(c.forWhom);
        }
    }

    /** Step 4: Get Quote → back on /quote/{id}/details with the success flash and no Chubb error. */
    async getQuote(quoteId: string): Promise<void> {
        await test.step('Dealer clicks Get Quote — the quote is saved without an error', async () => {
            await this.summary.btnChubbGetQuote.click();
            await expect(this.page, 'Redirect to the quote details').toHaveURL(new RegExp(`/quote/${quoteId}/details`), { timeout: 45000 });
            await expect(this.summary.alertWithText(SAVED), `Flash "${SAVED}"`).toHaveCount(1);
            await this.expectNoChubbError('After Get Quote');
            test.info().annotations.push({ type: 'Re-saved on Dev', description: `creditor insurance quote of quote ${quoteId}` });
        });
    }

    /** Step 5a: the Creditors insurance row shows a monthly premium and, in its chevron details, the saved quote. */
    async verifySavedOnDetails(e: ChubbSavedExpectation): Promise<void> {
        await test.step(`VERIFICATION POINT: the Creditors insurance row shows the saved ${e.rateTable} / ${e.language} quote`, async () => {
            await expect(this.summary.rowAmount('creditors'), 'Monthly premium on the row').toHaveText(/CA\$[\d,]+\.\d{2}\s*\/m/);
            await this.chubb.openCreditorsDetails();
            await expect(this.chubb.pnlCreditorsDetails, 'Row details open').toBeVisible();
            const details = await this.chubb.readCreditorsDetails();
            expect(details, 'Rate table').toContain(`Rate table: ${e.rateTable}`);
            expect(details, 'Language').toContain(`Language: ${e.language}`);
            expect(details, 'Tax exempt').toContain(`Tax exempt: ${e.taxExempt}`);
            await expect(this.chubb.rowsCreditorsCoverage, 'Coverage rows').toHaveCount(e.coverages.length);
            for (const c of e.coverages) {
                await expect(this.chubb.rowsCreditorsCoverage.filter({ hasText: c.label }),
                    `Coverage row ${c.label} ${c.forWhom} ${c.term} with a premium`)
                    .toHaveText(new RegExp(`${c.label}\\s+${c.forWhom}\\s+${c.term}\\s+[\\d,]+\\.\\d{2}\\$`));
            }
            test.info().annotations.push({ type: 'Saved creditor quote', description: details });
            await this.expectNoChubbError('Quote details');
        });
    }

    /** Step 5b: the reopened form holds the saved Language, Tax exempt and coverages (Form not asserted — AP-2557). */
    async verifyReopenedForm(quoteId: string, q: ChubbQuoteInput, withCoverages: boolean): Promise<void> {
        await test.step('VERIFICATION POINT: the reopened insurance form holds the saved values (Form not checked — AP-2557)', async () => {
            const response = await this.page.goto(`/quote/${quoteId}/insurance`);
            expect(response?.status() ?? 0, `HTTP status of /quote/${quoteId}/insurance`).toBeLessThan(400);
            await expect(this.summary.selChubbLanguage, 'Language').toHaveValue(q.language);
            await expect(this.summary.selChubbTaxExempt, 'Tax exempt').toHaveValue(q.taxExempt);
            if (withCoverages) await this.expectCoverages(q);
            await this.expectNoChubbError('Reopened insurance page');
        });
    }

    // ── Insurance Quick Quote (AP2410_003) ───────────────────────────────────

    async openQuickQuote(): Promise<void> {
        await test.step('Dealer opens /quick-insurance-quote', async () => {
            const response = await this.page.goto('/quick-insurance-quote');
            expect(response?.status() ?? 0, 'HTTP status of /quick-insurance-quote').toBeLessThan(400);
            await expect(this.page.locator('main h1').first(), 'Heading').toHaveText('Creditors Insurance Quick Quote');
            await expect(this.chubb.frmQuick, 'Quick quote form').toBeVisible();
            expect(await this.chubb.optionValues(this.chubb.selQuickForm), 'Form option values')
                .toEqual(expect.arrayContaining([PM30, PM50]));
            await expect(this.chubb.tblQuickResults, 'No result yet').toHaveCount(0);
        });
    }

    async fillQuickQuote(q: { form: string; borrowerDob: string; monthlyPayment: string; termMonths: string; residual: string },
        coverages: Record<ChubbBlock, ChubbCoverage>): Promise<void> {
        await test.step(`Dealer fills the quick quote: ${JSON.stringify({ ...q, ...coverages })}`, async () => {
            await this.chubb.fillQuickQuote(q);
            for (const block of BLOCKS) await this.chubb.setQuickCoverage(block, coverages[block]);

            await expect(this.chubb.selQuickForm, 'Form (by value)').toHaveValue(q.form);
            await expect(this.chubb.txtQuickBorrowerDob, 'Borrower date of birth').toHaveValue(q.borrowerDob);
            await expect(this.chubb.txtQuickMonthlyPayment, 'Monthly payment').toHaveValue(q.monthlyPayment);
            await expect(this.chubb.txtQuickTermMonths, 'Term months').toHaveValue(q.termMonths);
            await expect(this.chubb.txtQuickResidual, 'Residual amount').toHaveValue(q.residual);
            for (const block of BLOCKS) {
                await expect(this.chubb.quickType(block), `${block} type`).toHaveValue(coverages[block].type);
                await expect(this.chubb.quickTerm(block), `${block} term`).toHaveValue(coverages[block].term);
            }
        });
    }

    /** AP2410_003 steps 4–5: the priced result is drawn in place — two tables, a premium per coverage, no error. */
    async getQuickQuoteAndVerifyPriced(coverages: { label: string; term: string }[]): Promise<void> {
        await test.step('VERIFICATION POINT: Get Quote prices the quick quote in place, without an error', async () => {
            await this.chubb.clickQuickGetQuote();
            await expect(this.chubb.tblQuickResults, 'Two result tables').toHaveCount(2, { timeout: 45000 });
            await expect(this.page, 'URL stays on the quick quote').toHaveURL(/\/quick-insurance-quote$/);
            await expect(this.chubb.rowsQuickCoverage, 'One priced row per coverage').toHaveCount(coverages.length);
            for (const c of coverages) {
                await expect(this.chubb.rowsQuickCoverage.filter({ hasText: c.label }), `${c.label} row with a premium`)
                    .toHaveText(new RegExp(`${c.label}\\s+BORROWER\\s+${c.term}\\s+[\\d,]+\\.\\d{2}\\$`));
            }
            await expect(this.chubb.tblQuickResults.nth(1), 'Equivalent Single Premium').toContainText('Equivalent Single Premium');
            await expect(this.chubb.lblInvalidField, 'No field error').toHaveCount(0);
            await this.expectNoChubbError('Quick quote result');
            test.info().annotations.push({ type: 'Quick quote result',
                description: (await this.chubb.tblQuickResults.first().innerText()).replace(/\s+/g, ' ') });
        });
    }
}
