import { expect, Page, Response, test } from '@playwright/test';
import { QuoteClient } from '../data/dealer-portal';
import { FinancingField, GapCreditorsFinancingModal } from '../pages/dealerPortal/GapCreditorsFinancingModal';
import { QuoteProductSummaryPage } from '../pages/dealerPortal/QuoteProductSummaryPage';
import { QuoteCancelProductFlow } from './QuoteCancelProductFlow';

/** The insurance row whose "+" opens the modal, and the route that modal loads and posts to. */
export type InsuranceModal = 'gap' | 'creditors';
const ROUTE: Record<InsuranceModal, string> = { gap: 'gap-insurance', creditors: 'insurance' };

/** Values typed into the embedded financing form; an omitted field is left as it is. */
export interface FinancingEntry {
    dateOfBirth?: string;
    type?: string;          // option value, e.g. TYPE_FINANCING
    baseAmount?: string;
    residual?: string;
    frequency?: string;     // option value, e.g. FREQUENCY_MONTHLY
    termMonths?: string;    // option value, e.g. 60
    interestRate?: string;
    companyId?: string;     // option value, e.g. 39 = AutoCapital Canada
}

export const NOT_BLANK = 'This value should not be blank.';
export const NOT_VALID = 'This value is not valid.';
const NO_FINANCING = 'You have not added financing details yet';
const NONE_SELECTED = '- None Selected -';
const TEXT_FIELDS: FinancingField[] = ['applicant_dateOfBirthText', 'baseAmount', 'residualAmount', 'interestRate'];

/**
 * Financing form embedded in the add-GAP / add-creditors insurance modals — AP-2499, dealer portal, Dev (v2dev).
 * Added in its own file so the QA's uncommitted DealerFlow.ts is left untouched; the login stays in
 * DealerFlow.loginToDealerPortal(), the quote is built with QuoteCancelProductFlow.createQuoteFromVehicle() and a
 * stored financing with QuoteCancelProductFlow.addFinancing().
 *
 * Only what PASSED manually is asserted (AP2499_001, 002, 010, 011, 012). Nothing here asserts how the form looks
 * once a financing exists (AP-2526), what Save draws in the creditors modal (AP-2527) or where the insurance result
 * appears (AP-2528) — those cases FAILED. No method presses "Get Quote", so no Chubb or GAP quote is requested.
 * Writes to Dev: only a valid financing Save stores anything; every submit made here is refused by the server.
 */
export class GapCreditorsFinancingFlow {
    private readonly modal: GapCreditorsFinancingModal;
    private readonly summary: QuoteProductSummaryPage;
    private readonly quoteBuilder: QuoteCancelProductFlow;

    constructor(private readonly page: Page) {
        this.modal = new GapCreditorsFinancingModal(page);
        this.summary = new QuoteProductSummaryPage(page);
        this.quoteBuilder = new QuoteCancelProductFlow(page);
    }

    // ── Preconditions (write to Dev) ─────────────────────────────────────────

    /** /quote/new/client?fromVehicleId={id} → client → vehicle step. Returns the new quote id (no financing). */
    async createQuote(vehicleId: string, client: QuoteClient): Promise<string> {
        return this.quoteBuilder.createQuoteFromVehicle(vehicleId, client, '2026-11-01', '20000');
    }

    /** Stores a financing of 25,000 / 60 months / 6.99 % through the Financing card's "Add a financing". */
    async addFinancing(quoteId: string): Promise<void> {
        await this.quoteBuilder.addFinancing(quoteId);
    }

    // ── Modal ────────────────────────────────────────────────────────────────

    /** Clicks "+" on the Gap Insurance / Creditors insurance row; the route loads into the modal on the same page. */
    async openInsuranceModal(quoteId: string, which: InsuranceModal): Promise<void> {
        await test.step(`Dealer clicks "+" on the ${which === 'gap' ? 'Gap Insurance' : 'Creditors insurance'} row of quote ${quoteId}`, async () => {
            const loaded = this.page.waitForResponse(r =>
                r.url().includes(`/quote/${quoteId}/${ROUTE[which]}`) && r.request().method() === 'GET');
            await this.summary.clickRowAdd(which);
            expect((await loaded).status(), `GET /quote/${quoteId}/${ROUTE[which]} HTTP status`).toBeLessThan(400);
            await expect(this.modal.mdlOpen, 'Modal open').toHaveCount(1);
            await expect(this.modal.frmFinancing, 'Financing form in the modal').toHaveCount(1);
            await expect(this.page, 'Still on the quote page').toHaveURL(new RegExp(`/quote/${quoteId}/details`));
        });
    }

    /** Types the given values (omitted ones are left) and clicks the financing Save; the modal stays on the page. */
    async submitFinancing(quoteId: string, which: InsuranceModal, entry: FinancingEntry): Promise<Response> {
        return test.step(`Dealer submits the financing form in the ${which} modal with ${JSON.stringify(entry)}`, async () => {
            await this.modal.expandFinancing();
            if (entry.dateOfBirth !== undefined) {
                await this.summary.txtFinancingDateOfBirth.fill(entry.dateOfBirth);
                await this.modal.closeDatePicker();
            }
            if (entry.type !== undefined) await this.modal.choose(this.summary.selFinancingType, entry.type);
            if (entry.baseAmount !== undefined) await this.summary.txtFinancingBaseAmount.fill(entry.baseAmount);
            if (entry.residual !== undefined) await this.summary.txtFinancingResidual.fill(entry.residual);
            if (entry.frequency !== undefined) await this.modal.choose(this.summary.selFinancingFrequency, entry.frequency);
            if (entry.termMonths !== undefined) await this.modal.choose(this.summary.selFinancingTerm, entry.termMonths);
            if (entry.interestRate !== undefined) await this.summary.txtFinancingInterest.fill(entry.interestRate);
            if (entry.companyId !== undefined) await this.modal.choose(this.summary.selFinancingCompany, entry.companyId);

            const posted = this.page.waitForResponse(r =>
                r.url().includes(`/quote/${quoteId}/${ROUTE[which]}`) && r.request().method() === 'POST');
            await this.summary.btnFinancingSave.click();
            const response = await posted;
            expect(response.status(), 'Financing Save answers without a server error').toBeLessThan(500);
            await expect(this.page, 'URL unchanged').toHaveURL(new RegExp(`/quote/${quoteId}/details`));
            await expect(this.modal.mdlOpen, 'Modal still open').toHaveCount(1);
            return response;
        });
    }

    async reloadQuote(quoteId: string): Promise<void> {
        await this.quoteBuilder.reloadQuoteDetails(quoteId);
    }

    // ── Verifications ────────────────────────────────────────────────────────

    /** AP2499_001 / 002 step 3: no alert; the financing form comes first, its text fields empty; nothing below it. */
    async verifyEmptyFinancingFormFirst(which: InsuranceModal): Promise<void> {
        await test.step(`VERIFICATION POINT: the ${which} modal shows the empty financing form, not the "Please add a financing" alert`, async () => {
            await expect(this.modal.lblAddFinancingAlert, 'No "Please add a financing…" alert').toHaveCount(0);
            await expect(this.modal.lblFinancingHeading, 'First block is "Financing"').toBeVisible();
            await expect(this.summary.txtFinancingInterest, 'Financing fields are shown').toBeVisible();
            await expect(this.summary.txtFinancingDateOfBirth, 'Date of birth empty').toHaveValue('');
            await expect(this.summary.txtFinancingBaseAmount, 'Net amount financed empty').toHaveValue('');
            await expect(this.summary.txtFinancingResidual, 'Residual empty').toHaveValue('');
            await expect(this.summary.txtFinancingInterest, 'Interest rate empty').toHaveValue('');
            await expect(this.summary.btnFinancingSave, 'Save button').toHaveText(/Save/);
            await expect(this.modal.frmGapInsurance, 'No GAP form below while there is no financing (Q-003)').toHaveCount(0);
            await expect(this.modal.frmCreditorInsurance, 'No creditors form below while there is no financing (Q-003)').toHaveCount(0);

            const dropDowns = {
                type: await this.modal.selectedText(this.summary.selFinancingType),
                paymentFrequency: await this.modal.selectedText(this.summary.selFinancingFrequency),
                termMonths: await this.modal.selectedText(this.summary.selFinancingTerm),
                financingCompany: await this.modal.selectedText(this.summary.selFinancingCompany),
            };
            test.info().annotations.push({ type: 'Drop-down opening state (Q-004, record only)', description: JSON.stringify(dropDowns) });
        });
    }

    /** AP2499_002 step 3: /quote/{id}/insurance opened directly shows the financing form, no error and no alert (Q-001). */
    async verifyInsuranceRouteShowsFinancingForm(quoteId: string): Promise<void> {
        await test.step(`VERIFICATION POINT: /quote/${quoteId}/insurance opened directly shows the financing form`, async () => {
            const response = await this.page.goto(`/quote/${quoteId}/insurance`);
            expect(response?.status() ?? 0, `HTTP status of /quote/${quoteId}/insurance`).toBeLessThan(400);
            await expect(this.summary.lblErrorText, 'No error page').toHaveCount(0);
            await expect(this.page.getByText('Please add a financing'), 'No "Please add a financing…" alert').toHaveCount(0);
            await expect(this.modal.frmFinancingOnPage, 'Financing form on the page').toHaveCount(1);
            await expect(this.modal.txtBaseAmountOnPage, 'Net amount financed field').toBeVisible();
            await expect(this.modal.frmCreditorInsuranceOnPage, 'No creditors form while there is no financing').toHaveCount(0);
        });
    }

    async verifyFieldErrors(fields: FinancingField[], message: string): Promise<void> {
        await test.step(`VERIFICATION POINT: "${message}" under ${fields.join(', ')}`, async () => {
            for (const field of fields) {
                await expect(this.modal.fieldError(field), `Error under ${field}`).toHaveText(message);
            }
        });
    }

    async verifyNoFieldError(fields: FinancingField[]): Promise<void> {
        await test.step(`VERIFICATION POINT: no error under ${fields.join(', ')}`, async () => {
            for (const field of fields) {
                await expect(this.modal.fieldError(field), `No error under ${field}`).toHaveCount(0);
            }
        });
    }

    /** A refused Save keeps the modal on the financing step: no insurance form is shown below it. */
    async verifyStillOnFinancingStep(): Promise<void> {
        await test.step('VERIFICATION POINT: the modal stays on the financing step (no insurance form)', async () => {
            await expect(this.modal.frmFinancing, 'Financing form still shown').toHaveCount(1);
            await expect(this.modal.frmGapInsurance, 'No GAP form').toHaveCount(0);
            await expect(this.modal.frmCreditorInsurance, 'No creditors form').toHaveCount(0);
        });
    }

    /** AP2499_010 / 012 step 5: after the reload the quote has no financing and neither insurance row is filled. */
    async verifyNothingStored(quoteId: string): Promise<void> {
        await test.step(`VERIFICATION POINT: quote ${quoteId} has no financing and no GAP / creditors insurance`, async () => {
            await expect(this.modal.cardFinancing, 'Financing card').toContainText(NO_FINANCING);
            await expect(this.summary.rowAmount('gap'), 'Gap Insurance row').toContainText(NONE_SELECTED);
            await expect(this.summary.rowAmount('creditors'), 'Creditors insurance row').toContainText(NONE_SELECTED);
        });
    }

    /** AP2499_011 step 5: the stored financing is still 25,000.00$ / 60 / 6.9900 %. */
    async verifyFinancingUnchanged(): Promise<void> {
        await test.step('VERIFICATION POINT: the stored financing is unchanged (25,000.00$, term 60, 6.9900 %)', async () => {
            const card = await this.modal.readFinancingCard();
            expect(card, 'Financed amount').toContain('Financed amount : 25,000.00$');
            expect(card, 'Term').toContain('Term : 60 ');
            expect(card, 'Interest rate').toContain('Interest rate : 6.9900%');
        });
    }

    /** AP2499_012 step 5: the re-opened form holds no residual and no date of birth. */
    async verifyResidualAndDateOfBirthEmpty(): Promise<void> {
        await test.step('VERIFICATION POINT: the re-opened form shows no residual and no date of birth', async () => {
            await this.modal.expandFinancing();
            await expect(this.summary.txtFinancingResidual, 'Residual').toHaveValue('');
            await expect(this.summary.txtFinancingDateOfBirth, 'Date of birth').toHaveValue('');
        });
    }

    /** Every listed text field is empty (used before submitting AP2499_010). */
    async verifyTextFieldsEmptyExcept(keep: FinancingField[]): Promise<void> {
        await test.step(`Text fields other than ${keep.join(', ') || 'none'} are empty`, async () => {
            for (const field of TEXT_FIELDS.filter(f => !keep.includes(f))) {
                await expect(this.modal.field(field), `${field} empty`).toHaveValue('');
            }
        });
    }
}
