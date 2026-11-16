import { expect, Page, Response, test } from '@playwright/test';
import { config } from '../data/config';
import { PermaplateContractPage } from '../pages/dealerPortal/PermaplateContractPage';
import { PermaplateFinancingPage } from '../pages/dealerPortal/PermaplateFinancingPage';

const origin = (url: string): string => new URL(url).origin;

const BLANK_MESSAGE = 'This value should not be blank.';
const CONTRACT_GENERATED = 'Esthetic protection contract generated successfully';

/** A financing company of the contract form: the option value and its label. */
export interface FinancingCompany {
    id: string;
    name: string;
}

/** What a generated contract is identified by. */
export interface GeneratedContract {
    quoteId: string;
    contractNumber: string;
    invoiceId: string;
}

/**
 * Dealer Permaplate ("Esthetic protection") contract and its "Financing company" — AP-2459.
 * Added in its own file so the QA's uncommitted DealerFlow.ts is left untouched; the login stays in
 * DealerFlow.loginToDealerPortal() and the quote is built with QuoteCancelProductFlow.createQuoteFromVehicle().
 * submitBlankFinancingCompany() is refused by the server, so nothing is created. selectPermaplate() and
 * generateContractWithFinancingCompany() write to Dev — use them only on a quote the test made: the second
 * creates a contract and an unpaid invoice that cannot be deleted.
 * The contract PDF is never opened (open bug AP-2512 returns HTTP 500).
 */
export class PermaplateFinancingFlow {
    private readonly contract: PermaplateContractPage;
    private readonly financing: PermaplateFinancingPage;

    constructor(private readonly page: Page) {
        this.contract = new PermaplateContractPage(page);
        this.financing = new PermaplateFinancingPage(page);
    }

    private url(path: string): string {
        return `${origin(config.dealerPortalUrl)}${path}`;
    }

    /** Waits for the POST of the contract form that `click` triggers. */
    private async postContractForm(quoteId: string, click: () => Promise<void>): Promise<Response> {
        const [response] = await Promise.all([
            this.page.waitForResponse(r => r.request().method() === 'POST'
                && r.url().endsWith(`/quote/${quoteId}/permaplate-create-contract`)),
            click(),
        ]);
        return response;
    }

    /** AP2459_002 step 3 (second half): /quote/{id}/permaplate → term + option → Save; the hub lists the option. */
    async selectPermaplate(quoteId: string, term: string, option: string, cost: string): Promise<void> {
        await test.step(`Dealer selects Esthetic protection "${term}" with "${option}"`, async () => {
            await this.financing.open(this.url(`/quote/${quoteId}/permaplate`));
            await expect(this.contract.lblHeading, 'Permaplate Quote step').toHaveText('Permaplate Quote');
            await this.financing.selectTermAndOption(term, option);
            await this.financing.savePermaplateQuote();
            await expect(this.page, 'Saving returns to the quote hub').toHaveURL(new RegExp(`/quote/${quoteId}/details`));
            await expect(this.financing.alertWithText('Esthetic protection quote saved successfully'), 'Saved flash').toHaveCount(1);
            await expect(this.contract.rowEstheticProtection(quoteId), 'Esthetic protection row names the option')
                .toContainText(option);
            await expect(this.contract.rowEstheticProtection(quoteId), 'Esthetic protection row shows the cost')
                .toContainText(cost);
        });
    }

    /** Opens the contract form from the Esthetic protection row's ⋯ menu ("Generate Contract"). */
    async openContractFormFromRowMenu(quoteId: string): Promise<void> {
        await test.step(`Dealer opens the contract form of quote ${quoteId} from the row menu`, async () => {
            await this.contract.openRowMenu(quoteId);
            await expect(this.contract.lnkGenerateContract(quoteId), 'Menu item').toHaveText('Generate Contract');
            await this.contract.clickGenerateContractMenuItem(quoteId);
            await expect(this.page, 'Contract form URL').toHaveURL(new RegExp(`/quote/${quoteId}/permaplate-create-contract$`));
            await expect(this.contract.lblHeading, 'Contract form heading').toHaveText('Esthetic protection Contract');
            await expect(this.financing.lblFinancingCompany, '"Financing company" in Product Summary').toBeVisible();
        });
    }

    /** AP2459_001 step 4: Financing company left on "Choose", nothing else changed, Generate Contract clicked once. */
    async submitBlankFinancingCompany(quoteId: string): Promise<void> {
        await test.step('Dealer leaves Financing company on "Choose" and clicks Generate Contract', async () => {
            expect(await this.financing.readSelectedFinancingCompany(), 'Financing company default').toBe('Choose');
            const response = await this.postContractForm(quoteId, () => this.contract.clickGenerateContract());
            test.info().annotations.push({ type: 'POST permaplate-create-contract', description: `HTTP ${response.status()}` });
            expect(response.status(), 'No server error (the reported HTTP 500)').toBeLessThan(500);
        });
    }

    /**
     * AP2459_001 steps 4–5, branch (b) — the branch the build chose on 2026-11-08: the form comes back with
     * "This value should not be blank." beside Financing company only, no error page, and no contract.
     */
    async verifyBlankFinancingCompanyRefused(quoteId: string, clientName: string): Promise<void> {
        await test.step('VERIFY: the blank Financing company is refused beside the field and no contract is created', async () => {
            await expect(this.financing.lblServerErrorPage, 'No "difficultés techniques" error page').toHaveCount(0);
            await expect(this.page, 'Still on the contract form').toHaveURL(new RegExp(`/quote/${quoteId}/permaplate-create-contract$`));
            await expect(this.contract.lblHeading, 'Contract form heading').toHaveText('Esthetic protection Contract');
            await expect(this.financing.lblFinancingCompanyError, 'Message beside Financing company').toHaveText(BLANK_MESSAGE);
            await expect(this.financing.lblFinancingCompanyError, 'Message visible').toBeVisible();
            await expect(this.financing.selFinancingCompany, 'Financing company flagged').toHaveClass(/is-invalid/);
            await expect(this.financing.lblAllFieldErrors, 'Financing company is the only field refused').toHaveCount(1);
            await expect(this.financing.alertWithText(CONTRACT_GENERATED), 'No success alert').toHaveCount(0);

            await this.contract.open(this.url('/permaplate-contracts'));
            await expect(this.contract.lblHeading, 'Dealer contract list').toHaveText('Esthetic protection contracts');
            await expect(this.contract.contractRowFor(clientName), `No contract row for ${clientName}`).toHaveCount(0);
            await expect(this.financing.contractListRow(quoteId), `No contract row for quote ${quoteId}`).toHaveCount(0);
        });
    }

    /** AP2459_002 step 4: choose the company and click Generate Contract; returns the contract and invoice created. */
    async generateContractWithFinancingCompany(quoteId: string, company: FinancingCompany): Promise<GeneratedContract> {
        return test.step(`Dealer chooses "${company.name}" and clicks Generate Contract`, async () => {
            await this.financing.chooseFinancingCompany(company.id);
            expect(await this.financing.readSelectedFinancingCompany(), 'Financing company chosen').toBe(company.name);
            const response = await this.postContractForm(quoteId, () => this.contract.clickGenerateContract());
            expect(response.status(), 'No server error').toBeLessThan(500);

            await expect(this.page, 'Back on the quote hub').toHaveURL(new RegExp(`/quote/${quoteId}/details`));
            await expect(this.financing.lblServerErrorPage, 'No error page').toHaveCount(0);
            await expect(this.financing.alertWithText(CONTRACT_GENERATED), `"${CONTRACT_GENERATED}"`).toHaveCount(1);
            const invoiceAlert = this.financing.alertWithText('is created');
            await expect(invoiceAlert, '"Invoice #N ($80) is created"').toHaveCount(1);
            const invoiceId = /Invoice #(\d+)/.exec(await invoiceAlert.innerText())?.[1] ?? '';
            expect(invoiceId, 'Invoice number in the alert').not.toBe('');

            await expect(this.financing.lnkContractNumber(quoteId), 'Contract number on the row').toHaveText(/PNA-\d+/);
            const contractNumber = await this.financing.readContractNumber(quoteId);
            await expect(this.contract.lnkDownloadContract(quoteId), 'PDF link shown (not opened — AP-2512)').toHaveCount(1);
            await expect(this.contract.lnkGenerateContract(quoteId), 'No second Generate Contract').toHaveCount(0);

            test.info().annotations.push({
                type: 'Left on Dev (cannot be deleted)',
                description: `quote ${quoteId}, contract ${contractNumber}, invoice ${invoiceId} (Payment pending)`,
            });
            return { quoteId, contractNumber, invoiceId };
        });
    }

    /** AP2459_002 step 5: the contract is listed on /permaplate-contracts and its invoice on /invoice. */
    async verifyContractAndInvoiceListed(generated: GeneratedContract, clientName: string): Promise<void> {
        await test.step(`VERIFY: ${generated.contractNumber} and invoice ${generated.invoiceId} are listed for ${clientName}`, async () => {
            await this.contract.open(this.url('/permaplate-contracts'));
            await expect(this.contract.lblHeading, 'Dealer contract list').toHaveText('Esthetic protection contracts');
            const row = this.financing.contractListRow(generated.quoteId);
            await expect(row, `Contract row of quote ${generated.quoteId}`).toHaveCount(1);
            await expect(row, 'Row names the client').toContainText(clientName);
            await expect(row, 'Row names the VIN').toContainText('1FAHP35NX8W239204');

            await this.contract.open(this.url('/invoice'));
            await expect(this.contract.lblHeading, 'Invoice list').toHaveText('Invoices');
            const invoice = this.financing.invoiceListRow(generated.invoiceId);
            await expect(invoice, `Invoice ${generated.invoiceId} listed`).toHaveCount(1);
            await expect(invoice, 'Invoice names the contract').toContainText(generated.contractNumber);
            await expect(invoice, 'Invoice names the client').toContainText(clientName);
        });
    }
}
