import { Page, Locator } from '@playwright/test';

/**
 * Dealer extended-warranty "Generate Contract" page of AP-2503:
 * the quote hub's Extended warranty row (/quote/{id}/details) and the full page
 * /quote/{id}/warranty/generate-contract (form "warranty_finalize").
 * Locators verified on v2dev, 2026-11-02 (AP-2503 s8) on quote 6557: each counts 1.
 * No assertions here — see WarrantyGenerateContractFlow.
 */
export class WarrantyGenerateContractPage {
    private page: Page;

    readonly lblHeading: Locator;
    readonly openModals: Locator;
    readonly frmContract: Locator;

    // Left column
    readonly lblVehicleSection: Locator;
    readonly lblOwnerSection: Locator;
    readonly lblFinancingSection: Locator;
    readonly txtVehicleVin: Locator;
    readonly txtClientFirstName: Locator;
    readonly txtClientLastName: Locator;
    readonly txtClientCity: Locator;
    readonly txtClientPostalCode: Locator;
    readonly ddlFinancingCompany: Locator;
    readonly txtFinancingCompanyName: Locator;
    readonly txtFinancingCompanyPhone: Locator;
    readonly txtFinancingCompanyAddress: Locator;
    readonly txtFinancingCompanyCity: Locator;
    readonly txtFinancingCompanyProvince: Locator;
    readonly txtFinancingCompanyPostalCode: Locator;

    // Right column
    readonly lblProgramSummary: Locator;
    readonly txtStartDate: Locator;
    readonly txtSalePrice: Locator;
    readonly btnGenerateContract: Locator;
    readonly embedPdfPreview: Locator;

    // Dealer contract list (/warranty)
    readonly contractRows: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lblHeading = page.locator('h1');
        this.openModals = page.locator('.modal.show');
        this.frmContract = page.locator('form[name="warranty_finalize"]');

        this.lblVehicleSection = page.locator('xpath=//h4[normalize-space()="Vehicle identification"]');
        this.lblOwnerSection = page.locator('xpath=//h4[normalize-space()="Owner information"]');
        this.lblFinancingSection = page.locator('xpath=//h4[normalize-space()="Financing information"]');
        this.txtVehicleVin = page.locator('#warranty_finalize_vehicleVIN');
        this.txtClientFirstName = page.locator('#warranty_finalize_clientFirstName');
        this.txtClientLastName = page.locator('#warranty_finalize_clientLastName');
        this.txtClientCity = page.locator('#warranty_finalize_clientCity');
        this.txtClientPostalCode = page.locator('#warranty_finalize_clientPostalCode');
        this.ddlFinancingCompany = page.locator('#warranty_finalize_financingCompany');
        this.txtFinancingCompanyName = page.locator('#warranty_finalize_financingCompanyName');
        this.txtFinancingCompanyPhone = page.locator('#warranty_finalize_financingCompanyPhone');
        this.txtFinancingCompanyAddress = page.locator('#warranty_finalize_financingCompanyAddress');
        this.txtFinancingCompanyCity = page.locator('#warranty_finalize_financingCompanyCity');
        this.txtFinancingCompanyProvince = page.locator('#warranty_finalize_financingCompanyProvince');
        this.txtFinancingCompanyPostalCode = page.locator('#warranty_finalize_financingCompanyPostalCode');

        this.lblProgramSummary = page.locator('xpath=//h3[normalize-space()="Program Summary"]');
        this.txtStartDate = page.locator('#warranty_finalize_dateStart');
        this.txtSalePrice = page.locator('#warranty_finalize_salePrice');
        this.btnGenerateContract = page.locator('#warranty_finalize_save');
        this.embedPdfPreview = page.locator('embed');

        this.contractRows = page.locator('tbody tr');
    }

    /** The six financing-company text fields, in page order. */
    financingCompanyFields(): Locator[] {
        return [this.txtFinancingCompanyName, this.txtFinancingCompanyPhone, this.txtFinancingCompanyAddress,
            this.txtFinancingCompanyCity, this.txtFinancingCompanyProvince, this.txtFinancingCompanyPostalCode];
    }

    /** "Generate Contract" item of the Extended warranty row menu on the quote hub. */
    lnkGenerateContract(quoteId: string): Locator {
        return this.page.locator(`a[href="/quote/${quoteId}/warranty/generate-contract"]`);
    }

    /** The quote hub row that carries the Generate Contract item: "Extended warranty". */
    rowExtendedWarranty(quoteId: string): Locator {
        return this.page.locator(`tr:has(a[href="/quote/${quoteId}/warranty/generate-contract"])`);
    }

    /** The ⋯ button of the Extended warranty row (Edit / Generate Contract / Delete). */
    btnRowMenu(quoteId: string): Locator {
        return this.rowExtendedWarranty(quoteId).locator('button[data-toggle="dropdown"]');
    }

    /** Links to a created warranty contract (/warranty/{id}) — none while the quote has no contract. */
    lnkWarrantyContracts(): Locator {
        return this.page.locator('a[href^="/warranty/"]');
    }

    /** "Open PDF in new tab" link of the page's contract preview. */
    lnkOpenPdf(quoteId: string): Locator {
        return this.page.locator(`a[href="/quote/${quoteId}/warranty/pdf"]`);
    }

    /** "Back" link to the quote hub. */
    lnkBack(quoteId: string): Locator {
        return this.page.locator(`a[href="/quote/${quoteId}/details"]`);
    }

    contractRowFor(text: string): Locator {
        return this.contractRows.filter({ hasText: text });
    }

    async open(url: string) {
        return this.page.goto(url);
    }

    async openRowMenu(quoteId: string): Promise<void> {
        await this.btnRowMenu(quoteId).click();
    }

    async clickGenerateContractMenuItem(quoteId: string): Promise<void> {
        await this.lnkGenerateContract(quoteId).click();
    }

    /** Picks a company in the "Financing Company" picker by its option value (it fills the company fields). */
    async pickFinancingCompany(optionValue: string): Promise<void> {
        await this.ddlFinancingCompany.selectOption(optionValue);
    }

    async clearLastName(): Promise<void> {
        await this.txtClientLastName.fill('');
    }

    async clickGenerateContract(): Promise<void> {
        await this.btnGenerateContract.click();
    }

    /** The browser's own validation message of a field ("" when valid). */
    async validationMessage(field: Locator): Promise<string> {
        return field.evaluate((el) => (el as HTMLInputElement).validationMessage);
    }

    /** Left edge (CSS px) of an element, for column checks. */
    async leftEdge(element: Locator): Promise<number> {
        const box = await element.boundingBox();
        if (!box) throw new Error('Element has no bounding box');
        return box.x;
    }
}
