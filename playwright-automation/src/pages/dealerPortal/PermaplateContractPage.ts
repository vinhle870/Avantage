import { Page, Locator } from '@playwright/test';

/**
 * Dealer Permaplate ("Esthetic protection") contract pages of AP-2428:
 * the quote hub's Esthetic protection row (/quote/{id}/details), the contract form
 * (/quote/{id}/permaplate-create-contract) and the dealer contract list (/permaplate-contracts).
 * Locators verified on v2dev, 2026-11-02 (AP-2428 s8): each counts 1 (option list items 3, list rows by name 1)
 * on quotes 6459 (selection, no contract), 6458 (no selection) and 6456 (contract made).
 * No assertions here — see PermaplateContractFlow.
 */
export class PermaplateContractPage {
    private page: Page;

    // Shared
    readonly lblHeading: Locator;
    readonly alertError: Locator;

    // Contract form
    readonly frmContract: Locator;
    readonly lblVehicleSection: Locator;
    readonly lblOwnerSection: Locator;
    readonly lblProgramSummary: Locator;
    readonly btnGenerateContract: Locator;
    readonly txtVehicleMake: Locator;
    readonly txtVehicleModel: Locator;
    readonly txtVehicleVin: Locator;
    readonly txtVehicleOdometer: Locator;
    readonly txtDeliveryDate: Locator;
    readonly txtOwnerLastName: Locator;
    readonly lblBlankFieldErrors: Locator;
    readonly lstProgramSummary: Locator;
    readonly lblProgramTerm: Locator;
    readonly lblStartDate: Locator;
    readonly lblEndDate: Locator;
    readonly lstSelectedOptions: Locator;
    readonly inpProgramSummaryControls: Locator;
    readonly btnVehicleDetails: Locator;

    // Dealer contract list
    readonly contractRows: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lblHeading = page.locator('h1');
        this.alertError = page.locator('.alert-danger');

        this.frmContract = page.locator('form[name="permaplate_contract"]');
        this.lblVehicleSection = page.locator('xpath=//h4[normalize-space()="Vehicle identification"]');
        // Dev renamed the sections (2026-11): "Owner information" → "Owner identification",
        // "Program Summary" → "Product Summary"; both titles are accepted
        this.lblOwnerSection = page.locator('xpath=//h4[normalize-space()="Owner information" or normalize-space()="Owner identification"]');
        this.lblProgramSummary = page.locator('xpath=//h3[normalize-space()="Program Summary" or normalize-space()="Product Summary"]');
        this.btnGenerateContract = page.locator('form[name="permaplate_contract"] button[type="submit"]');
        // Dev redesign (2026-11): the vehicle fields sit in a collapsed "Vehicle details" panel. VIN is still an
        // input (id now ...vehicleVIN); Make, Model, Odometer and Delivery date are read-only <dd> text.
        this.btnVehicleDetails = page.getByRole('button', { name: 'Vehicle details' });
        this.txtVehicleMake = page.locator('xpath=//dt[normalize-space()="Make"]/following-sibling::dd[1]');
        this.txtVehicleModel = page.locator('xpath=//dt[normalize-space()="Model"]/following-sibling::dd[1]');
        this.txtVehicleVin = page.locator('#permaplate_contract_vehicleVIN, #permaplate_contract_vehicleVin');
        this.txtVehicleOdometer = page.locator('xpath=//dt[normalize-space()="Odometer at delivery"]/following-sibling::dd[1]');
        this.txtDeliveryDate = page.locator('xpath=//dt[normalize-space()="Delivery date"]/following-sibling::dd[1]');
        this.txtOwnerLastName = page.locator('#permaplate_contract_ownerLastName');
        this.lblBlankFieldErrors = page.locator('.form-error-message', { hasText: 'This value should not be blank.' });
        this.lstProgramSummary = page.locator('dl.row');
        this.lblProgramTerm = page.locator('xpath=//dt[normalize-space()="Program Term"]/following-sibling::dd[1]');
        this.lblStartDate = page.locator('xpath=//dt[normalize-space()="Start Date"]/following-sibling::dd[1]');
        this.lblEndDate = page.locator('xpath=//dt[normalize-space()="End date"]/following-sibling::dd[1]');
        this.lstSelectedOptions = page.locator('dl.row ul li');
        // Controls in the summary, except the Financing company field Dev added there (AP-2459 financing)
        // (the Vehicle details list has its own dl, so the summary dl is found by its "Program Term" entry)
        this.inpProgramSummaryControls = page.locator('xpath=//dl[dt[normalize-space()="Program Term"]]/dd[not(preceding-sibling::dt[1][normalize-space()="Financing company"])]//*[self::input or self::select or self::textarea]');

        this.contractRows = page.locator('tbody tr');
    }

    async open(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /** The quote hub row that carries the contract control: "Esthetic protection". */
    rowEstheticProtection(quoteId: string): Locator {
        return this.page.locator(`tr:has(a[href="/quote/${quoteId}/permaplate-create-contract"])`);
    }

    /** The ⋯ button of the Esthetic protection row (opens the Edit / Generate Contract / Delete menu). */
    btnRowMenu(quoteId: string): Locator {
        return this.rowEstheticProtection(quoteId).locator('button[data-toggle="dropdown"]');
    }

    /** "Generate Contract" menu item → /quote/{id}/permaplate-create-contract. */
    lnkGenerateContract(quoteId: string): Locator {
        return this.page.locator(`a[href="/quote/${quoteId}/permaplate-create-contract"]`);
    }

    /** PDF icon shown once the contract exists → /quote/{id}/permaplate-contract-download. */
    lnkDownloadContract(quoteId: string): Locator {
        return this.page.locator(`a[href="/quote/${quoteId}/permaplate-contract-download"]`);
    }

    /**
     * Every link on the quote hub that belongs to this quote and creates or downloads a contract (sidebar links
     * excluded). The contract-number link to /quote/{id}/permaplate-contract that Dev added (2026-11) only views
     * the existing contract, so it is not counted.
     */
    lnkQuoteContractControls(quoteId: string): Locator {
        return this.page.locator(`a[href^="/quote/${quoteId}/"][href*="contract"]:not([href$="/permaplate-contract"])`);
    }

    /**
     * Opens the dealer contract list (/permaplate-contracts, newest first, paged) at the first page that lists
     * the client, checking at most `maxPages` pages. Leaves the last page checked open when the client is absent.
     */
    async openContractListAt(baseUrl: string, clientName: string, maxPages = 10): Promise<void> {
        for (let n = 1; n <= maxPages; n++) {
            await this.page.goto(`${baseUrl}/permaplate-contracts?page=${n}`);
            if (await this.contractRowFor(clientName).count() > 0) return;
            if (await this.page.locator(`a[href="/permaplate-contracts?page=${n + 1}"]`).count() === 0) return;
        }
    }

    alertWithText(text: string): Locator {
        return this.alertError.filter({ hasText: text });
    }

    contractRowFor(clientName: string): Locator {
        return this.contractRows.filter({ hasText: clientName });
    }

    async openRowMenu(quoteId: string): Promise<void> {
        await this.btnRowMenu(quoteId).click();
    }

    async clickGenerateContractMenuItem(quoteId: string): Promise<void> {
        await this.lnkGenerateContract(quoteId).click();
    }

    /** Expands the collapsed "Vehicle details" panel (no-op when it is already open). */
    async openVehicleDetails(): Promise<void> {
        if (!(await this.txtVehicleVin.isVisible())) await this.btnVehicleDetails.click();
        await this.txtVehicleVin.waitFor({ state: 'visible' });
    }

    async clearLastNameAndVin(): Promise<void> {
        await this.openVehicleDetails();
        await this.txtOwnerLastName.fill('');
        await this.txtVehicleVin.fill('');
    }

    async clickGenerateContract(): Promise<void> {
        await this.btnGenerateContract.click();
    }

    async readSelectedOptions(): Promise<string[]> {
        return (await this.lstSelectedOptions.allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim());
    }

    /** "Contract cost price" cell (4th column) of the contract list row for a client. */
    async readContractCostPrice(clientName: string): Promise<string> {
        return ((await this.contractRowFor(clientName).locator('td').nth(3).innerText()) || '').trim();
    }
}
