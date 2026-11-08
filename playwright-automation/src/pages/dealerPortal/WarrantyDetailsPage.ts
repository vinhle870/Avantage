import { Page, Locator } from '@playwright/test';
import { QuoteWarranty } from '../../data/dealer-portal';
import { DatePickerComponent } from '../../core/components/DatePickerComponent';
import { downloadEmbeddedPdf } from '../../core/utils/uiActions';

/**
 * Warranty Details Page - Choose the warranty program/option/term for a quote.
 * Converted from WarrantyDetails_Page.java + WarrantyDetailsPage_Func.java
 */
export class WarrantyDetailsPage {
    private page: Page;

    // Locators
    readonly form: Locator;
    readonly txtSalePrice: Locator;
    readonly ddlFinancingCompany: Locator;
    readonly txtVehicleDeliveryDate: Locator;
    readonly txtWarrantyStartDate: Locator;
    readonly chkSameAsDeliveryDate: Locator;
    readonly lnkBackToQuote: Locator;
    readonly lnkFinalizeSale: Locator;
    readonly embedPdf: Locator;
    readonly btnSave: Locator;
    readonly btnGenerateContract: Locator;

    constructor(page: Page) {
        this.page = page;
        this.form = page.locator('form[name="quote_warranty"]');
        this.txtSalePrice = page.locator('#quote_warranty_salePrice');
        this.ddlFinancingCompany = page.locator('#quote_warranty_financingCompany');
        this.txtVehicleDeliveryDate = page.locator('#quote_warranty_deliveredAt');
        this.txtWarrantyStartDate = page.locator('#quote_warranty_warrantyStartDate');
        this.chkSameAsDeliveryDate = page.locator('#quote_warranty_isSameAsDeliveryDate');
        this.lnkBackToQuote = page.locator('main a[href^="/quote/"][href$="/details"]').first();
        this.lnkFinalizeSale = page.locator('a[href*=finalize]').first();
        this.embedPdf = page.locator('embed').first();
        this.btnSave = page.locator('form[name="quote_warranty"] [type="submit"]').first();
        // Submit of the "Generate Contract" modal (finalizes the warranty and creates the invoice)
        this.btnGenerateContract = page.locator('#warranty_finalize_save');
    }

    /**
     * Collapsible heading of a program in the warranty form
     */
    programHeading(programName: string): Locator {
        return this.form.locator(`//a[contains(., "${programName}")]`).first();
    }

    /**
     * Panel the program heading expands (its aria-controls target)
     */
    async programPanel(programName: string): Promise<Locator> {
        const panelId = await this.programHeading(programName).getAttribute('aria-controls');
        if (!panelId) throw new Error(`Program "${programName}" heading has no aria-controls`);
        return this.page.locator(`[id="${panelId}"]`);
    }

    /**
     * Label of an option term inside a program, e.g. option "option 1", term "100m/20000km"
     */
    async optionTermLabel(programName: string, optionName: string, termName: string): Promise<Locator> {
        const panel = await this.programPanel(programName);
        return panel
            .locator(`xpath=.//*[p[contains(., "${optionName}")]]//label[contains(., "${termName}")]`)
            .first();
    }

    /**
     * Checkbox of an extra component, matched on the trimmed label text
     */
    extraComponentCheckbox(componentName: string): Locator {
        return this.form
            .locator('[class*="component-wrapper"] label')
            .filter({ hasText: new RegExp(`^\\s*${escapeRegExp(componentName)}\\s*$`) })
            .first()
            .locator('input');
    }

    /**
     * Select the program option term, extra components, price and dates, then save
     */
    async selectWarrantyProgram(warranty: QuoteWarranty, submit: boolean = true): Promise<void> {
        const term = await this.optionTermLabel(warranty.programName, warranty.programOption, warranty.optionTerm);

        // Expand the program when it is collapsed
        if (!(await term.isVisible())) {
            await this.programHeading(warranty.programName).click();
        }
        await term.click();

        for (const component of warranty.extraComponents) {
            if (component !== '') {
                await this.extraComponentCheckbox(component).click();
            }
        }

        await this.txtSalePrice.fill(warranty.salePrice);

        // The current warranty modal takes its dates from the quote vehicle's delivery date;
        // earlier versions of the form had their own delivery/start date fields
        if ((await this.txtVehicleDeliveryDate.count()) > 0) {
            await this.txtVehicleDeliveryDate.fill(warranty.vehicleDeliveryDate);

            // Tabbing out of the delivery date opens the start date calendar, linked by data-guid
            await this.txtVehicleDeliveryDate.press('Tab');
            const guid = await this.txtWarrantyStartDate.getAttribute('data-guid');
            if (!guid) throw new Error('Warranty start date input has no data-guid');
            await new DatePickerComponent(this.page, `//*[@guid='${guid}']`).pickDate(warranty.warrantyStartDate);
        }

        if (submit) {
            await this.btnSave.click();
        }
    }

    /**
     * Back to the quote detail page
     */
    async backToQuote(): Promise<void> {
        // The current app edits the warranty in a modal over the quote detail page
        if (/\/quote\/\d+\/details/.test(this.page.url())) {
            await this.page.keyboard.press('Escape');
            return;
        }
        await this.lnkBackToQuote.click();
    }

    /**
     * Legacy app: open finalize sale and confirm it
     */
    async finalizeSale(submit: boolean = true): Promise<void> {
        await this.lnkFinalizeSale.click();
        if (submit) {
            await this.btnSave.click();
        }
    }

    /**
     * Current app: submit the open "Generate Contract" modal
     */
    async generateContract(): Promise<void> {
        await this.btnGenerateContract.click();
    }

    /**
     * Bytes of the warranty contract PDF embedded on the page after saving
     */
    async downloadWarrantyContractPdf(): Promise<Buffer> {
        return await downloadEmbeddedPdf(this.page, this.embedPdf);
    }
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
