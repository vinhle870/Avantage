import { Page, Locator } from '@playwright/test';
import { VehicleInfo } from '../../data/dealer-portal';
import { VehicleInventoryPage } from './VehicleInventoryPage';

/**
 * Dealer New Quote Page (/quote/new/edit-vehicle).
 * A quote now starts from its vehicle: the page holds the same vehicle fields as the
 * inventory form (vehicle_*), plus the quote name. Saving creates both and opens the
 * quote detail page. The client is added afterwards from the quote detail page.
 */
export class DealerNewQuotePage {
    private page: Page;
    private readonly vehicleForm: VehicleInventoryPage;

    // Locators
    readonly txtQuoteName: Locator;
    readonly btnSave: Locator;

    constructor(page: Page) {
        this.page = page;
        this.vehicleForm = new VehicleInventoryPage(page);
        this.txtQuoteName = page.locator('#vehicle_quote_name');
        this.btnSave = page.locator('form:has(#vehicle_quote_name) [type="submit"]').first();
    }

    /**
     * Fill the vehicle and the quote name, then save
     */
    async fillNewQuoteForm(vehicle: VehicleInfo, quoteName: string, submit: boolean = true): Promise<void> {
        await this.vehicleForm.fillVehicleForm(vehicle, false);
        await this.txtQuoteName.fill(quoteName);
        if (submit) {
            await this.btnSave.click();
        }
    }
}
