import { expect, Page, test } from '@playwright/test';
import { config } from '../data/config';
import { BuyOnlineClient, BuyOnlinePage, BuyOnlineVehicle } from '../pages/common/BuyOnlinePage';

export type Lang = 'en' | 'fr';

/** Texts the AP-2377 cases check, per language (EN from the ticket; FR recorded on Dev 2026-11-02). */
export const BUY_TEXT = {
    en: {
        title: 'Buy a warranty online',
        steps: ['Enter the vehicle', 'Client Info', 'Select Coverage', 'Summary'],
        warrantyHeading: 'Current manufacturer/extended warranty',
        warrantyHelp: [
            'If your vehicle is still under manufacturer, or extended warranty coverage please include the contract number.',
            'This warranty will begin after the current warranty has expired, or if the current warranty has already expired, this warranty will begin thirty (30) days from the date of purchase.',
        ],
        warrantyLabels: ['Warranty Number', 'Warranty end date', 'Warranty mileage limit'],
        vehicleButton: 'Continue',
        clientButton: 'Get rates now',
        coverageHeading: 'Select base coverage for the',
        agreePolicy: 'I confirm that I have read FORM-L25, at the request of Les Produits Avantage Plus Inc., all in accordance with the requirements of the Act respecting the protection of personal information in the private sector.',
        agreePolicyError: 'You must confirm to have read the FORM-L25',
        pdfPrivacy: '/en/pdf-privacy',
    },
    fr: {
        title: 'Acheter une garantie en-ligne',
        steps: ['Info du véhicule', 'Info Client', 'Choisir la couverture', 'Sommaire'],
        vehicleButton: 'Continuer',
        clientButton: 'Demander un devis',
        coverageHeading: 'Choisissez la durée de couverture pour la',
    },
} as const;

const norm = (s: string | null): string => (s || '').replace(/\s+/g, ' ').trim();
const esc = (s: string): string => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');

/**
 * Customer portal "buy a warranty online" flow (AP-2377): vehicle → Client Info → Coverage → Summary.
 * Added in its own file so the QA's uncommitted AdminFlow.ts / DealerFlow.ts are left untouched.
 * No login. Never ticks "I accept the terms and conditions" and never presses "Continue with payment".
 */
export class BuyOnlineFlow {
    private readonly buy: BuyOnlinePage;

    constructor(private readonly page: Page) {
        this.buy = new BuyOnlinePage(page);
    }

    private url(step = ''): string {
        return `${new URL(config.baseUrl).origin}/customer/avantage-plus/buy${step}`;
    }

    /** Opens step 1 in a fresh session; French is reached by clicking the "Français" link. */
    async openVehicleStep(lang: Lang = 'en'): Promise<void> {
        await test.step(`Customer opens the buy-online page (${lang === 'fr' ? 'French' : 'English'})`, async () => {
            await this.buy.open(this.url());
            await expect(this.page, 'Vehicle step route').toHaveURL(/\/customer\/avantage-plus\/buy$/);
            if (lang === 'fr') {
                await this.buy.switchToFrench();
                await expect(this.page, 'French locale').toHaveURL(/_locale=fr/);
            }
            await expect(this.buy.lblPageTitle, 'Page heading').toHaveText(BUY_TEXT[lang].title);
            await expect(this.buy.txtVin, 'Vehicle form shown').toBeVisible();
        });
    }

    async enterVehicle(v: BuyOnlineVehicle): Promise<void> {
        await test.step(`Customer fills the vehicle step (VIN ${v.vin}, email ${v.email})`, async () => {
            await this.buy.enterVehicle(v);
            await expect(this.buy.txtVin).toHaveValue(v.vin);
            await expect(this.buy.txtMileage).toHaveValue(v.mileage);
            await expect(this.buy.txtEmail).toHaveValue(v.email);
            await expect(this.buy.txtPostalCode).toHaveValue(v.postalCode);
            await expect(this.buy.txtMarketValue).toHaveValue(v.marketValue);
            if (v.warrantyNumber !== undefined) await expect(this.buy.txtWarrantyNumber).toHaveValue(v.warrantyNumber);
            if (v.warrantyEndDate !== undefined) await expect(this.buy.txtWarrantyEndDate).toHaveValue(v.warrantyEndDate);
            if (v.warrantyMileageLimit !== undefined) await expect(this.buy.txtWarrantyMileageLimit).toHaveValue(v.warrantyMileageLimit);
        });
    }

    /** AP2377_001 step 3: heading, both help sentences, then the three fields in order, below Market Value. */
    async verifyWarrantySectionAtEndOfForm(): Promise<void> {
        const t = BUY_TEXT.en;
        await test.step('VERIFICATION POINT: the "Current manufacturer/extended warranty" section ends the vehicle form', async () => {
            await expect(this.buy.lblWarrantySectionHeading, 'Section heading').toHaveText(t.warrantyHeading);
            const help = norm(await this.buy.lblWarrantySectionHelp.textContent());
            expect(help, 'Help text, first sentence').toContain(t.warrantyHelp[0]);
            expect(help, 'Help text, second sentence').toContain(t.warrantyHelp[1]);
            expect(help.indexOf(t.warrantyHelp[0]), 'Help sentences in order').toBeLessThan(help.indexOf(t.warrantyHelp[1]));

            const ids = await this.buy.vehicleInputs.evaluateAll(els => els.map(e => e.id));
            const at = (id: string): number => ids.indexOf(`customer_buy_vehicle_${id}`);
            expect(at('marketValue'), 'Market Value is before the warranty fields').toBeGreaterThanOrEqual(0);
            expect(at('warrantyNumber'), 'Warranty Number right after Market Value').toBe(at('marketValue') + 1);
            expect(at('manufacturerWarrantyEndDate'), 'Warranty end date next').toBe(at('marketValue') + 2);
            expect(at('manufacturerWarrantyEndKm'), 'Warranty mileage limit next').toBe(at('marketValue') + 3);
            expect(at('manufacturerWarrantyEndKm'), 'Warranty mileage limit is the last input').toBe(ids.length - 1);

            for (const [i, field] of [this.buy.txtWarrantyNumber, this.buy.txtWarrantyEndDate, this.buy.txtWarrantyMileageLimit].entries()) {
                const id = await field.getAttribute('id');
                await expect(this.page.locator(`label[for="${id}"]`), `Label of field ${i + 1}`).toHaveText(t.warrantyLabels[i]);
            }
        });
    }

    async verifySubmitLabel(label: string, what: string): Promise<void> {
        await test.step(`VERIFICATION POINT: the ${what} button reads exactly "${label}"`, async () => {
            await expect(this.buy.btnSubmit, `${what} button`).toHaveCount(1);
            await expect(this.buy.btnSubmit, `${what} button label`).toHaveText(label);
        });
    }

    /** Clicks the vehicle step's button and lands on Client Info. */
    async submitVehicleStep(): Promise<void> {
        await test.step('Customer submits the vehicle step', async () => {
            await this.buy.submit();
            await expect(this.page, 'Client Info route').toHaveURL(/\/customer\/avantage-plus\/buy\/client$/);
            await expect(this.buy.txtFirstName, 'Client Info form shown').toBeVisible();
        });
    }

    /** Step bar: the four labels in order; `current` (0-based) is highlighted and later steps are not. */
    async verifyStepBar(lang: Lang, current: number): Promise<void> {
        const labels = BUY_TEXT[lang].steps;
        await test.step(`VERIFICATION POINT: step bar reads ${labels.join(' · ')} with "${labels[current]}" current`, async () => {
            await expect(this.buy.stepBarItems, 'Four steps').toHaveCount(4);
            for (const [i, label] of labels.entries()) {
                await expect(this.buy.stepBarItems.nth(i), `Step ${i + 1}`).toContainText(label);
            }
            await expect(this.buy.stepBarItems.nth(current), 'Current step highlighted').toHaveClass(/text-success/);
            await expect(this.buy.stepBarItems.nth(current), 'Current step shows its number')
                .toContainText(new RegExp(`${current + 1}\\s*${esc(labels[current])}`));
            for (let i = current + 1; i < labels.length; i++) {
                await expect(this.buy.stepBarItems.nth(i), `Step ${i + 1} not reached`).toHaveClass(/text-muted/);
            }
        });
    }

    /** AP2377_005 steps 2–3: one unticked checkbox, its exact text, and FORM-L25 linking to the privacy PDF. */
    async verifyAgreePolicyCheckbox(): Promise<void> {
        const t = BUY_TEXT.en;
        await test.step('VERIFICATION POINT: Client Info has one unticked FORM-L25 checkbox with the mock-up text', async () => {
            await expect(this.buy.clientCheckboxes, 'Exactly one checkbox on the form').toHaveCount(1);
            await expect(this.buy.chkAgreePolicy, 'Checkbox unticked by default').not.toBeChecked();
            const ids = await this.buy.frmClient.locator('input:not([type="hidden"])').evaluateAll(els => els.map(e => e.id));
            expect(ids.indexOf('customer_quote_client_isAgreePolicy'), 'Checkbox placed after Email')
                .toBe(ids.indexOf('customer_quote_client_email') + 1);
            expect(norm(await this.buy.lblAgreePolicy.textContent()), 'Checkbox text').toBe(t.agreePolicy);
        });
        await test.step('VERIFICATION POINT: "FORM-L25" is a link that opens the privacy PDF in a new tab', async () => {
            await expect(this.buy.lnkFormL25, 'FORM-L25 link').toHaveText('FORM-L25');
            await expect(this.buy.lnkFormL25, 'Link target').toHaveAttribute('href', t.pdfPrivacy);
            await expect(this.buy.lnkFormL25, 'Opens in a new tab').toHaveAttribute('target', '_blank');
            const res = await this.page.context().request.get(new URL(t.pdfPrivacy, this.page.url()).toString());
            expect(res.status(), 'PDF answers HTTP 200').toBe(200);
            expect(res.headers()['content-type'], 'PDF content type').toContain('application/pdf');
        });
    }

    async enterClient(c: BuyOnlineClient, tickAgreePolicy: boolean): Promise<void> {
        await test.step(`Customer fills Client Info (${c.firstName} ${c.lastName}), FORM-L25 ${tickAgreePolicy ? 'ticked' : 'left unticked'}`, async () => {
            await this.buy.enterClient(c);
            if (tickAgreePolicy) await this.buy.tickAgreePolicy();
            await this.verifyClientValues(c, 'typed');
            if (tickAgreePolicy) await expect(this.buy.chkAgreePolicy).toBeChecked();
            else await expect(this.buy.chkAgreePolicy).not.toBeChecked();
        });
    }

    private async verifyClientValues(c: BuyOnlineClient, when: string): Promise<void> {
        await expect(this.buy.txtFirstName, `First name ${when}`).toHaveValue(c.firstName);
        await expect(this.buy.txtLastName, `Last name ${when}`).toHaveValue(c.lastName);
        await expect(this.buy.txtAddress1, `Address ${when}`).toHaveValue(c.address1);
        await expect(this.buy.txtCity, `City ${when}`).toHaveValue(c.city);
        await expect(this.buy.ddlProvince, `Province ${when}`).toHaveValue(c.provinceValue);
        await expect(this.buy.txtClientPostalCode, `Postal code ${when}`).toHaveValue(c.postalCode);
        await expect(this.buy.txtPhone1, `Phone 1 ${when}`).toHaveValue(c.phone1);
        await expect(this.buy.txtClientEmail, `Email ${when}`).toHaveValue(c.email);
    }

    /** AP2377_006 step 3: "Get rates now" with the box ticked opens the coverage choice with priced terms. */
    async submitClientAndVerifyCoverageStep(lang: Lang = 'en'): Promise<void> {
        await test.step('VERIFICATION POINT: "Get rates now" opens the Coverage step with priced terms', async () => {
            await this.buy.submit();
            await expect(this.page, 'Coverage route').toHaveURL(/\/customer\/avantage-plus\/buy\/coverage$/);
            await expect(this.buy.lblStepHeading, 'Coverage heading').toContainText(BUY_TEXT[lang].coverageHeading);
            const terms = await this.buy.ddlProgramTerm.locator('option').evaluateAll(
                els => els.map(e => ({ value: (e as HTMLOptionElement).value, text: (e.textContent || '').trim() })).filter(o => o.value !== ''));
            expect(terms.length, 'At least one coverage term offered').toBeGreaterThan(0);
            for (const term of terms) expect(term.text, `Term ${term.value} shows a price`).toMatch(/\d+\.\d{2}\$$/);
        });
    }

    /** AP2377_007 steps 3–4: unticked box → page stays, message under the box, every value kept. */
    async submitClientAndVerifyRefusedWithValuesKept(c: BuyOnlineClient): Promise<void> {
        await test.step('VERIFICATION POINT: "Get rates now" with FORM-L25 unticked stays on Client Info, shows the message and keeps every value', async () => {
            const response = this.page.waitForResponse(r => r.request().method() === 'POST' && /\/buy\/client$/.test(r.url()));
            await this.buy.submit();
            expect((await response).status(), 'No error page — the server answers the submit').toBeLessThan(500);
            await expect(this.page, 'Still on Client Info').toHaveURL(/\/customer\/avantage-plus\/buy\/client$/);
            // Q-004 (Judgement, open) is record-only: the message is noted in the report, not asserted.
            const message = (await this.buy.lblAgreePolicyError.count()) ? norm(await this.buy.lblAgreePolicyError.textContent()) : '(none)';
            test.info().annotations.push({ type: 'Q-004 recorded', description: `Message under the FORM-L25 box: ${message}` });
            await this.verifyClientValues(c, 'kept');
            await expect(this.buy.chkAgreePolicy, 'Checkbox still unticked').not.toBeChecked();
        });
    }

    /** Coverage → term → surcharge page → summary. Never goes past the summary. */
    async chooseTermAnswerSurchargeAndReachSummary(termId: string, surchargeId: string, answer: 'yes' | 'no'): Promise<void> {
        await test.step(`Customer chooses term ${termId}, answers surcharge ${surchargeId} "${answer}" and reaches the summary`, async () => {
            await this.buy.selectProgramTerm(termId);
            await expect(this.buy.ddlProgramTerm).toHaveValue(termId);
            await this.buy.submit();
            await expect(this.page, 'Surcharge page').toHaveURL(/\/customer\/avantage-plus\/buy\/coverage-2$/);
            await this.buy.answerSurcharge(surchargeId, answer);
            await expect(this.buy.rdoSurcharge(surchargeId, answer)).toBeChecked();
            await this.buy.submit();
            await expect(this.page, 'Summary route').toHaveURL(/\/customer\/avantage-plus\/buy\/summary$/);
        });
    }

    /**
     * AP2377_009 step 4: the "… pneumatique ? OUI" line is not shown for a surcharge answered No.
     * How a No answer appears (question absent, empty "Surcharge" heading) is Q-007, record-only: annotated, not asserted.
     */
    async verifySummaryHasNoYesLine(program: RegExp, question: string): Promise<void> {
        await test.step('VERIFICATION POINT: the summary does not show the surcharge line answered OUI', async () => {
            await expect(this.buy.lblSummaryProgram, 'Summary "Programme" shown').toHaveText(program);
            await expect(this.page.locator('body'), 'No "<question> OUI" line')
                .not.toContainText(new RegExp(`${esc(question)}\\s*OUI`, 'i'));
            const block = (await this.buy.blkSummarySurcharge.count()) ? norm(await this.buy.blkSummarySurcharge.textContent()) : '(no Surcharge block)';
            test.info().annotations.push({ type: 'Q-007 recorded', description: `Summary surcharge block after No: "${block}"` });
        });
    }
}
