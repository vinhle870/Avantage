import { Page, Locator } from '@playwright/test';
import { VehicleModal } from './VehicleModal';
import { QuoteVehicle } from '../../data/dealer-portal';
import { formatGrouped, toNumber } from '../../core/utils/javaFormat';

/**
 * Quote Detail Page - View and manage quote details.
 * Converted from QuoteDetail_Page.java + QuoteDetailPage_Func.java
 */
export class QuoteDetailPage {
    private page: Page;
    public vehicleModal: VehicleModal;

    // Locators
    readonly btnAddVehicle: Locator;
    readonly lnkNewWarranty: Locator;
    readonly btnFinalizeSale: Locator;
    readonly lblAlertMsg: Locator;
    readonly lnkCreateSale: Locator;
    readonly lnkGotoInvoice: Locator;
    readonly lnkAddClient: Locator;
    readonly lnkVehicleDetails: Locator;
    readonly rowWarranty: Locator;

    constructor(page: Page) {
        this.page = page;
        this.vehicleModal = new VehicleModal(page);

        const main = page.locator('main');
        // Edit icon of the vehicle row in "Summary of products" (/quote/{id}/vehicle)
        this.btnAddVehicle = main.locator('a[href^="/quote/"][href$="/vehicle"]').first();
        this.lnkNewWarranty = main.locator("//*[contains(@href,'warranty/edit')]").first();
        this.btnFinalizeSale = main.locator("//*[contains(@href, '/finalize')]").first();
        this.lblAlertMsg = main.locator('[role="alert"]');
        this.lnkCreateSale = main.locator('a[href^="/quote/"][href$="/sales"]').first();
        // "Invoice #N ... is created" alert link shown after the contract is generated
        this.lnkGotoInvoice = page.locator('main a[href^="/invoice/"]').first();
        // "Client" section: Add (new quote) or Edit link to /quote/{id}/client
        this.lnkAddClient = main.locator('a[href^="/quote/"][href$="/client"]').first();
        // Vehicle section title links to /vehicle/{vehicleId}/details
        this.lnkVehicleDetails = main.locator('a[href^="/vehicle/"][href$="/details"]').first();
        // "Extended warranty" row of the summary, with its ⋯ actions menu
        this.rowWarranty = main.locator('tr').filter({ hasText: 'Extended warranty' }).first();
    }

    /**
     * Dropdown label of an inventory vehicle: "<make> <model> <year> <price>$" over its VIN,
     * price grouped with no decimals (Java "%,.0f$")
     */
    static vehicleOptionLabel(quoteVehicle: QuoteVehicle): string {
        const v = quoteVehicle.vehicleInfo;
        const price = `${formatGrouped(toNumber(v.price), 0)}$`;
        return `${v.branch} ${v.model} ${v.year} ${price}\n${v.vin}`;
    }

    /**
     * Set the quote vehicle's delivery date and price (vehicle modal)
     */
    async addQuoteVehicle(quoteVehicle: QuoteVehicle): Promise<void> {
        await this.btnAddVehicle.click();
        await this.vehicleModal.selectVehicle(
            QuoteDetailPage.vehicleOptionLabel(quoteVehicle), quoteVehicle.vehicleInfo.vehicleId);
        await this.vehicleModal.fillDeliveryDate(quoteVehicle.deliveryDate);
        await this.vehicleModal.fillPrice(quoteVehicle.price);
        await this.vehicleModal.save();
    }

    /**
     * Inventory ID of the quote's vehicle, from the vehicle link (/vehicle/{id}/details)
     */
    async getVehicleId(): Promise<string> {
        const href = (await this.lnkVehicleDetails.getAttribute('href')) ?? '';
        const id = href.match(/\/vehicle\/(\d+)\//)?.[1];
        if (!id) throw new Error(`No vehicle ID in the quote vehicle link "${href}"`);
        return id;
    }

    /**
     * Open the client form of the quote
     */
    async openClientForm(): Promise<void> {
        await this.lnkAddClient.click();
    }

    /**
     * Open the warranty's "Generate Contract" modal. It shows the contract PDF preview
     * (<embed src="/quote/{id}/pdf">) above the finalize form; nothing is generated
     * until its "Generate Contract" button is pressed.
     */
    async openWarrantyContractModal(): Promise<void> {
        await this.rowWarranty.locator('[data-toggle="dropdown"]').click();
        await this.rowWarranty.locator('a[href$="/warranty/generate-contract"]').click();
    }

    /**
     * Open warranty details page
     */
    async openWarrantyDetailsPage(): Promise<void> {
        await this.lnkNewWarranty.click();
    }

    /**
     * Open sale contract details page
     */
    async openSaleContractDetailsPage(): Promise<void> {
        await this.lnkCreateSale.click();
    }

    /**
     * Click finalize sale button
     */
    async finalizeSale(): Promise<void> {
        await this.btnFinalizeSale.click();
    }

    /**
     * Go to invoice page after finalize
     */
    async gotoInvoicePageAfterFinalize(): Promise<void> {
        await this.lnkGotoInvoice.click();
    }

    /**
     * Get alert message text
     */
    async getAlertMessage(): Promise<string> {
        return (await this.lblAlertMsg.textContent()) || '';
    }
}
