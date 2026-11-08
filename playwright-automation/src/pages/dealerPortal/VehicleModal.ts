import { Page, Locator } from '@playwright/test';
import { selectDropdownOption } from '../../core/utils/uiActions';

/**
 * Vehicle Modal - Modal for adding/selecting vehicle in quote.
 * Converted from Vehicle_Modal.java
 */
export class VehicleModal {
    private page: Page;

    // Locators
    readonly ddlVehicle: Locator;
    readonly selVehicle: Locator;
    readonly txtDeliveryDate: Locator;
    readonly txtPrice: Locator;
    readonly btnSave: Locator;

    constructor(page: Page) {
        this.page = page;
        this.ddlVehicle = page.locator("//div[*[@for='quote_vehicle_vehicle']]/div");
        this.selVehicle = page.locator('#quote_vehicle_vehicle');
        this.txtDeliveryDate = page.locator('#quote_vehicle_deliveredAt');
        this.txtPrice = page.locator('#quote_vehicle_price');
        this.btnSave = page.locator('form:has(#quote_vehicle_price) [type="submit"]').first();
    }

    /**
     * Select vehicle from dropdown.
     * The inventory can hold several vehicles with the same label, so when the vehicle's
     * inventory ID is known and already selected (the quote was created with it), keep it.
     */
    async selectVehicle(vehicleOption: string, vehicleId?: string): Promise<void> {
        await this.ddlVehicle.waitFor({ state: 'visible' });
        if (vehicleId && (await this.selVehicle.inputValue()) === vehicleId) return;
        await selectDropdownOption(this.ddlVehicle, vehicleOption);
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
