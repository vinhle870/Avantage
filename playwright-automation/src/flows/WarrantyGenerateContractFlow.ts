import { expect, Page, test } from '@playwright/test';
import { config } from '../data/config';
import { WarrantyGenerateContractPage } from '../pages/dealerPortal/WarrantyGenerateContractPage';

const origin = (url: string): string => new URL(url).origin;

/** Owner and vehicle values the page must prefill from the quote (AP2503_010). */
export interface GenerateContractPrefill {
    firstName: string;
    lastName: string;
    vin: string;
}

/**
 * Dealer extended-warranty Generate Contract page — AP-2503.
 * Added in its own file so the QA's uncommitted AdminFlow.ts / DealerFlow.ts are left untouched; the login
 * stays in DealerFlow.loginToDealerPortal().
 * Never creates a contract: "Generate Contract" is clicked only with the owner's last name emptied (refused by the
 * browser's own check), and every POST to the page is aborted as a safety net, so no contract or invoice is made.
 */
export class WarrantyGenerateContractFlow {
    private readonly contract: WarrantyGenerateContractPage;

    constructor(private readonly page: Page) {
        this.contract = new WarrantyGenerateContractPage(page);
    }

    private url(path: string): string {
        return `${origin(config.dealerPortalUrl)}${path}`;
    }

    /** The quote hub opens with "#{id}" in its heading. */
    async openQuoteDetails(quoteId: string): Promise<void> {
        await test.step(`Dealer opens quote ${quoteId}`, async () => {
            const response = await this.contract.open(this.url(`/quote/${quoteId}/details`));
            expect(response?.status() ?? 0, `HTTP status of /quote/${quoteId}/details`).toBeLessThan(400);
            await expect(this.contract.lblHeading, 'Quote hub heading').toContainText(`#${quoteId}`);
        });
    }

    /** Precondition guard: the quote's extended warranty still offers Generate Contract (no contract yet). */
    async verifyQuoteHasWarrantyWithoutContract(quoteId: string): Promise<void> {
        await test.step(`Quote ${quoteId} has an extended warranty and no contract yet`, async () => {
            await expect(this.contract.lnkGenerateContract(quoteId),
                `Quote ${quoteId} must still offer Generate Contract — if a contract was made on it, pick another Dev quote with an extended warranty and no contract`)
                .toHaveCount(1);
            await expect(this.contract.lnkWarrantyContracts(), 'No warranty contract link on the quote').toHaveCount(0);
        });
    }

    /** AP2503_001 step 3: ⋯ menu of the Extended warranty row → "Generate Contract" navigates to the page. */
    async openGenerateContractFromRowMenu(quoteId: string): Promise<void> {
        await test.step('Dealer opens Generate Contract from the Extended warranty row menu', async () => {
            await expect(this.contract.rowExtendedWarranty(quoteId), 'Extended warranty row').toContainText('Extended warranty');
            await this.contract.openRowMenu(quoteId);
            await expect(this.contract.lnkGenerateContract(quoteId), 'Menu item visible').toBeVisible();
            await expect(this.contract.lnkGenerateContract(quoteId), 'Menu item label').toHaveText('Generate Contract');
            await this.contract.clickGenerateContractMenuItem(quoteId);
            await expect(this.page, 'Generate-contract address').toHaveURL(new RegExp(`/quote/${quoteId}/warranty/generate-contract$`));
            await expect(this.contract.lblHeading, 'Page heading').toHaveText('Extended Warranty Contract');
        });
    }

    /** AP2503_001 step 4 and the other cases: the page loads directly from its address. */
    async openGenerateContractPage(quoteId: string): Promise<void> {
        await test.step(`Dealer opens /quote/${quoteId}/warranty/generate-contract`, async () => {
            const response = await this.contract.open(this.url(`/quote/${quoteId}/warranty/generate-contract`));
            expect(response?.status() ?? 0, 'HTTP status of the generate-contract page').toBe(200);
            await expect(this.page, 'Address unchanged').toHaveURL(new RegExp(`/quote/${quoteId}/warranty/generate-contract$`));
            await expect(this.contract.lblHeading, 'Page heading').toHaveText('Extended Warranty Contract');
            await expect(this.contract.frmContract, 'Contract form').toBeVisible();
        });
    }

    /** AP2503_001 step 5: a full page, not a modal, with the Program Summary and the Generate Contract button. */
    async verifyFullPageWithSummaryAndButton(quoteId: string): Promise<void> {
        await test.step('VERIFY: a full page (no modal) with Program Summary and the Generate Contract button', async () => {
            await expect(this.contract.openModals, 'No open modal').toHaveCount(0);
            await expect(this.contract.lnkBack(quoteId), '"Back" link to the quote').toHaveCount(1);
            await expect(this.contract.lblProgramSummary, 'Program Summary').toBeVisible();
            await expect(this.contract.btnGenerateContract, 'Generate Contract button').toBeVisible();
            await expect(this.contract.btnGenerateContract, 'Button label').toHaveText(/Generate Contract/);
        });
    }

    /** AP2503_002 step 3: Owner information and Financing information sit in the left column. */
    async verifyLeftColumn(): Promise<void> {
        await test.step('VERIFY: Owner information and Financing information are in the left column', async () => {
            await expect(this.contract.lblOwnerSection, 'Owner information').toHaveCount(1);
            await expect(this.contract.lblFinancingSection, 'Financing information').toHaveCount(1);
            const owner = await this.contract.leftEdge(this.contract.lblOwnerSection);
            const financing = await this.contract.leftEdge(this.contract.lblFinancingSection);
            const summary = await this.contract.leftEdge(this.contract.lblProgramSummary);
            expect(Math.abs(owner - financing), 'Owner and Financing share the left column').toBeLessThan(5);
            expect(owner, 'Left column is left of the Program Summary').toBeLessThan(summary);
            // Q-001 (record only): the vehicle details are the first left section, "Vehicle identification"
            test.info().annotations.push({ type: 'Vehicle section (record only)',
                description: `${await this.contract.lblVehicleSection.count()} "Vehicle identification" heading(s)` });
        });
    }

    /** AP2503_002 step 4: Program Summary, Generate Contract and an embedded PDF preview in the right column. */
    async verifyRightColumn(quoteId: string): Promise<void> {
        await test.step('VERIFY: Program Summary, Generate Contract and the PDF preview are in the right column', async () => {
            const owner = await this.contract.leftEdge(this.contract.lblOwnerSection);
            const summary = await this.contract.leftEdge(this.contract.lblProgramSummary);
            const button = await this.contract.leftEdge(this.contract.btnGenerateContract);
            await expect(this.contract.embedPdfPreview, 'One embedded PDF preview').toHaveCount(1);
            await expect(this.contract.embedPdfPreview, 'Preview source').toHaveAttribute('src', new RegExp(`^/quote/${quoteId}/warranty/pdf`));
            const preview = await this.contract.leftEdge(this.contract.embedPdfPreview);
            expect(summary, 'Program Summary right of the left column').toBeGreaterThan(owner);
            expect(Math.abs(button - summary), 'Button in the Program Summary column').toBeLessThan(5);
            expect(Math.abs(preview - summary), 'Preview in the Program Summary column').toBeLessThan(5);
            // Q-002 (record only): the preview is the extended-warranty contract draft, with an "Open PDF in new tab" link
            await expect(this.contract.lnkOpenPdf(quoteId), '"Open PDF in new tab" link').toHaveCount(1);
        });
    }

    /** AP2503_010 step 3: owner and VIN prefilled; Program Summary and button present; financing section recorded. */
    async verifyPrefillWithoutFinancing(expected: GenerateContractPrefill): Promise<void> {
        await test.step('VERIFY: owner and VIN are prefilled and the page still offers Program Summary and Generate Contract', async () => {
            await expect(this.contract.txtClientFirstName, 'Client first name').toHaveValue(expected.firstName);
            await expect(this.contract.txtClientLastName, 'Client last name').toHaveValue(expected.lastName);
            await expect(this.contract.txtVehicleVin, 'VIN').toHaveValue(expected.vin);
            await expect(this.contract.lblProgramSummary, 'Program Summary').toBeVisible();
            await expect(this.contract.btnGenerateContract, 'Generate Contract button').toBeVisible();
            // Q-008 (record only): with no financing the picker is at "Choose" and the six company fields are empty
            await expect(this.contract.ddlFinancingCompany, 'Financing Company picker').toHaveValue('');
            const empty: string[] = [];
            for (const field of this.contract.financingCompanyFields()) {
                if ((await field.inputValue()) === '') empty.push((await field.getAttribute('id')) ?? '?');
            }
            test.info().annotations.push({ type: 'Empty financing-company fields (record only, Q-008)', description: empty.join(', ') || 'none' });
        });
    }

    /**
     * AP2503_008 steps 2–3: picks a financing company (so only the last name is missing, as in the manual run),
     * empties the last name and clicks Generate Contract. Every POST is aborted, so nothing can be created even
     * if the browser check ever stopped working; the number of POSTs tried is returned.
     */
    async submitWithEmptyLastName(financingCompanyOption: string): Promise<number> {
        return test.step('Dealer empties the last name and clicks Generate Contract', async () => {
            let posts = 0;
            await this.page.route('**/warranty/generate-contract', async (route) => {
                if (route.request().method() === 'POST') {
                    posts += 1;
                    await route.abort();
                } else {
                    await route.continue();
                }
            });
            // Same order as the manual run: empty the last name first, then pick the company
            await this.contract.clearLastName();
            await expect(this.contract.txtClientLastName, 'Last name emptied').toHaveValue('');
            await this.contract.pickFinancingCompany(financingCompanyOption);
            await expect(this.contract.txtFinancingCompanyName, 'Picker filled the company name').not.toHaveValue('');
            await this.contract.clickGenerateContract();
            await expect.poll(() => this.contract.txtClientLastName.evaluate((el) => (el as HTMLInputElement).validity.valueMissing),
                { message: 'The browser flags the empty last name' }).toBe(true);
            return posts;
        });
    }

    /** AP2503_008 steps 3–4: refused without a request; the other values are kept; no contract was made. */
    async verifyEmptyLastNameRefused(quoteId: string, kept: { firstName: string; city: string; postalCode: string; startDate: string; salePrice: string }, posts: number): Promise<void> {
        await test.step('VERIFY: the submit is refused in the browser and the other values are kept', async () => {
            expect(posts, 'No form request was sent').toBe(0);
            await expect(this.page, 'Still on the generate-contract page').toHaveURL(new RegExp(`/quote/${quoteId}/warranty/generate-contract$`));
            // Q-006 (record only): the refusal is the browser's own message on the field
            const message = await this.contract.validationMessage(this.contract.txtClientLastName);
            expect(message, 'Browser validation message on Last name').not.toBe('');
            test.info().annotations.push({ type: 'Last name validation message (record only, Q-006)', description: message });
            await expect(this.contract.txtClientFirstName, 'First name kept').toHaveValue(kept.firstName);
            await expect(this.contract.txtClientCity, 'City kept').toHaveValue(kept.city);
            await expect(this.contract.txtClientPostalCode, 'Postal code kept').toHaveValue(kept.postalCode);
            await expect(this.contract.txtStartDate, 'Start date kept').toHaveValue(kept.startDate);
            await expect(this.contract.txtSalePrice, 'Sale price kept').toHaveValue(kept.salePrice);
        });
        await this.page.unroute('**/warranty/generate-contract');
        await this.openQuoteDetails(quoteId);
        await this.verifyQuoteHasWarrantyWithoutContract(quoteId);
    }
}
