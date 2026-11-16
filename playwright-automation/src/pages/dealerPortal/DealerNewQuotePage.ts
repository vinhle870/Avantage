import { Page, Locator } from '@playwright/test';
import { VehicleInfo } from '../../data/dealer-portal';
import { DealerQuoteVehicleFormPage } from './DealerQuoteVehicleFormPage';
import { VehicleInventoryPage } from './VehicleInventoryPage';

/**
 * Dealer New Quote Page (/quote/new/edit-vehicle).
 * A quote starts from its vehicle. Since AP-2477 / AP-2533 the form `quote_vehicle` holds only
 * Vehicle type, Quote name, VIN, Brand, Model and Year (the price, kilometres, condition, fuel,
 * engine and coverage fields are gone). Saving creates the quote and its vehicle and opens the
 * quote detail page; the rest of the vehicle is then completed on /vehicle/{id}/edit, which still
 * carries every `vehicle_*` field of the inventory form. The client is added afterwards from the
 * quote detail page.
 *
 * Updated 2026-11-07 (AP-2491 regression): the old `#vehicle_quote_name` / `#vehicle_VIN` fields no
 * longer exist on the new-quote form (count 0 on Dev). Locators verified on Dev 2026-11-07, count 1 each.
 */
export class DealerNewQuotePage {
    private page: Page;
    private readonly quoteForm: DealerQuoteVehicleFormPage;
    private readonly vehicleForm: VehicleInventoryPage;

    // Locators
    readonly txtQuoteName: Locator;
    readonly btnSave: Locator;

    constructor(page: Page) {
        this.page = page;
        this.quoteForm = new DealerQuoteVehicleFormPage(page);
        this.vehicleForm = new VehicleInventoryPage(page);
        this.txtQuoteName = page.locator('#quote_vehicle_quote_name');
        this.btnSave = page.locator('form[name="quote_vehicle"] [type="submit"]');
    }

    /**
     * Fill VIN, Brand, Model, Year and the quote name on the new-quote form, then save.
     * Choosing a Brand re-renders the form, so the quote name is typed last.
     */
    async fillNewQuoteForm(vehicle: VehicleInfo, quoteName: string, submit: boolean = true): Promise<void> {
        await this.quoteForm.fillVin(vehicle.vin);
        await this.quoteForm.chooseBrand(vehicle.branch);
        await this.quoteForm.chooseModel(vehicle.model);
        await this.quoteForm.fillYear(vehicle.year);
        await this.txtQuoteName.fill(quoteName);
        if (submit) {
            await this.btnSave.click();
        }
    }

    /**
     * Completes the quote's vehicle on /vehicle/{id}/edit with every value of the test data
     * (price, kilometres, condition, fuel, transmission, engine, designation, options, coverage)
     * and saves it. Returns the HTTP status of the save.
     */
    async completeVehicleDetails(vehicleId: string, vehicle: VehicleInfo): Promise<number> {
        await this.page.goto(`/vehicle/${vehicleId}/edit`);
        const saved = this.page.waitForResponse(r => r.request().method() === 'POST'
            && new URL(r.url()).pathname === `/vehicle/${vehicleId}/edit`);
        await this.vehicleForm.fillVehicleForm(vehicle, true);
        const status = (await saved).status();
        await this.page.waitForLoadState();
        return status;
    }
}
