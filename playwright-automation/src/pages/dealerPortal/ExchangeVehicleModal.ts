import { Page, Locator } from '@playwright/test';
import { QuoteExchangeVehicle } from '../../data/dealer-portal';
import { selectCheckbox, selectDropdownOption } from '../../core/utils/uiActions';

/**
 * Exchange Vehicle Modal - Trade-in vehicle on a quote.
 * Converted from Exchange_Vehicle_Modal.java + Exchange_Vehicle_Modal_Func.java
 */
export class ExchangeVehicleModal {
    private page: Page;

    // Locators
    readonly lnkAddExchangeVehicle: Locator;
    readonly txtVehicleVin: Locator;
    readonly dpdVehicleMake: Locator;
    readonly dpdVehicleModel: Locator;
    readonly txtVehicleYear: Locator;
    readonly txtVehicleCylinders: Locator;
    readonly txtVehicleLicensePlate: Locator;
    readonly txtVehicleKM: Locator;
    readonly cbxIsAccommodationSale: Locator;
    readonly txtVehicleRealKM: Locator;
    readonly txtAccommodationSaleContractNumber: Locator;
    readonly txtTaxRegistration: Locator;
    readonly txtValueAmount: Locator;
    readonly txtBalanceAmount: Locator;
    readonly txtBank: Locator;
    readonly btnSave: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lnkAddExchangeVehicle = page.locator("//*[contains(@href,'exchange-vehicle')]").first();
        this.txtVehicleVin = page.locator('#exchange_vehicle_VIN');
        this.dpdVehicleMake = page.locator("//div[*[@for='exchange_vehicle_make']]/div");
        this.dpdVehicleModel = page.locator("//div[*[@for='exchange_vehicle_model']]/div");
        this.txtVehicleYear = page.locator('#exchange_vehicle_year');
        this.txtVehicleCylinders = page.locator('#exchange_vehicle_cylinders');
        this.txtVehicleLicensePlate = page.locator('#exchange_vehicle_licensePlateNumber');
        this.txtVehicleKM = page.locator('#exchange_vehicle_kilometers');
        this.cbxIsAccommodationSale = page.locator('#exchange_vehicle_isAccommodationSale');
        this.txtVehicleRealKM = page.locator('#exchange_vehicle_realKilometers');
        this.txtAccommodationSaleContractNumber = page.locator('#exchange_vehicle_accommodationSaleContractNumber');
        this.txtTaxRegistration = page.locator('#exchange_vehicle_taxRegistration');
        this.txtValueAmount = page.locator('#exchange_vehicle_valueAmount');
        this.txtBalanceAmount = page.locator('#exchange_vehicle_balanceAmount');
        this.txtBank = page.locator('#exchange_vehicle_bank');
        this.btnSave = page.locator('[type="submit"]').first();
    }

    /**
     * Open the exchange vehicle modal from the quote detail page
     */
    async open(): Promise<void> {
        await this.lnkAddExchangeVehicle.click();
    }

    /**
     * Fill the exchange vehicle form (Make/Model first, as the Java flow did)
     */
    async fillExchangeVehicleInfo(exchange: QuoteExchangeVehicle, submit: boolean = true): Promise<void> {
        await selectDropdownOption(this.dpdVehicleMake, exchange.branch);
        await selectDropdownOption(this.dpdVehicleModel, exchange.model);
        await this.txtVehicleVin.fill(exchange.vin);
        await this.txtVehicleYear.fill(exchange.year);
        await this.txtVehicleCylinders.fill(exchange.cylinders);
        await this.txtVehicleLicensePlate.fill(exchange.licensePlateNumber);
        await this.txtVehicleKM.fill(exchange.km);
        if (exchange.isAccommodationSale.includes('Yes')) await selectCheckbox(this.cbxIsAccommodationSale);
        await this.txtVehicleRealKM.fill(exchange.realKilometers);
        await this.txtAccommodationSaleContractNumber.fill(exchange.accommodationSaleContractNumber);
        await this.txtTaxRegistration.fill(exchange.taxRegistration);
        await this.txtValueAmount.fill(exchange.valueAmount);
        await this.txtBalanceAmount.fill(exchange.balanceAmount);
        await this.txtBank.fill(exchange.bank);

        if (submit) {
            await this.btnSave.click();
        }
    }
}
