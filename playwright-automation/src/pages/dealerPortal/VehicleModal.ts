import { Page, Locator } from '@playwright/test';

/**
 * Vehicle Modal - Modal for adding/selecting vehicle in quote.
 * Converted from Vehicle_Modal.java
 */
export class VehicleModal {
    private page: Page;

    // Locators
    readonly ddlVehicle: Locator;
    readonly txtDeliveryDate: Locator;
    readonly txtPrice: Locator;
    readonly btnSave: Locator;

    constructor(page: Page) {
        this.page = page;
        this.ddlVehicle = page.locator("//div[*[@for='quote_vehicle_vehicle']]/div");
        this.txtDeliveryDate = page.locator('#quote_vehicle_deliveredAt');
        this.txtPrice = page.locator('#quote_vehicle_price');
        this.btnSave = page.locator('[type="submit"]');
    }

    /**
     * Select vehicle from dropdown
     */
    async selectVehicle(vehicleOption: string): Promise<void> {
        await this.ddlVehicle.click();
        await this.page.locator(`li:has-text("${vehicleOption}")`).click();
    }

    /**
     * Fill delivery date
     */
    async fillDeliveryDate(date: string): Promise<void> {
        await this.txtDeliveryDate.fill(date);
    }

    /**
     * Fill price
     */
    async fillPrice(price: string): Promise<void> {
        await this.txtPrice.fill(price);
    }

    /**
     * Click save button
     */
    async save(): Promise<void> {
        await this.btnSave.click();
    }
}
