import { Page, Locator, expect } from '@playwright/test';
import { TableComponent } from '../../core/components/TableComponent';

/**
 * Vehicle data interface
 */
export interface VehicleData {
    vin: string;
    make?: string;
    model?: string;
    year?: string;
    price?: string;
    kilometers?: string;
    condition?: string;
    fuelType?: string;
    transmission?: string;
    cylinders?: string;
    engineSize?: string;
    engineSizeUnit?: string;
    designation?: string;
    isTurbo?: boolean;
    is4x4?: boolean;
    isFWD?: boolean;
    manufacturerFullDateEnd?: string;
    manufacturerFullKmEnd?: string;
    manufacturerPowertrainDateEnd?: string;
    manufacturerPowertrainKmEnd?: string;
}

/**
 * Vehicle Inventory Page - Add and manage vehicles.
 * Converted from AddNewVehicle_Page.java + AddNewVehiclelPage_Func.java
 */
export class VehicleInventoryPage {
    private page: Page;

    // Locators
    readonly tblVehicleList: TableComponent;
    readonly lnkBack: Locator;
    readonly lnkSelectVehicle: Locator;
    readonly txtVehicleVin: Locator;
    readonly dpdVehicleMake: Locator;
    readonly dpdVehicleModel: Locator;
    readonly txtVehicleYear: Locator;
    readonly txtVehiclePrice: Locator;
    readonly txtVehicleKM: Locator;
    readonly dpdVehicleCondition: Locator;
    readonly dpdVehicleFuelType: Locator;
    readonly dpdVehicleTransmission: Locator;
    readonly txtVehicleCylinders: Locator;
    readonly txtVehicleEngineSize: Locator;
    readonly dpdVehicleEngineSizeUnit: Locator;
    readonly dpdVehicleDesignation: Locator;
    readonly cbxVehicleIsTurbo: Locator;
    readonly cbxVehicleIs4x4: Locator;
    readonly cbxVehicleIsFWD: Locator;
    readonly txtManufacturerFullDateEnd: Locator;
    readonly txtManufacturerFullKmEnd: Locator;
    readonly txtManufacturerPowertrainDateEnd: Locator;
    readonly txtManufacturerPowertrainKmEnd: Locator;
    readonly btnSave: Locator;

    constructor(page: Page) {
        this.page = page;
        this.tblVehicleList = new TableComponent(page, 'table');
        this.lnkBack = page.locator('a.btn.btn-link.text-dark');
        this.lnkSelectVehicle = page.locator('#dropdownMenuLink1');
        this.txtVehicleVin = page.locator('#vehicle_VIN');
        this.dpdVehicleMake = page.locator("//div[*[@for='vehicle_make']]/div");
        this.dpdVehicleModel = page.locator("//div[*[@for='vehicle_model']]/div");
        this.txtVehicleYear = page.locator('#vehicle_year');
        this.txtVehiclePrice = page.locator('#vehicle_price');
        this.txtVehicleKM = page.locator('#vehicle_kilometers');
        this.dpdVehicleCondition = page.locator("//div[*[@for='vehicle_condition']]/div");
        this.dpdVehicleFuelType = page.locator("//div[*[@for='vehicle_fuelType']]/div");
        this.dpdVehicleTransmission = page.locator("//div[*[@for='vehicle_transmission']]/div");
        this.txtVehicleCylinders = page.locator('#vehicle_cylinders');
        this.txtVehicleEngineSize = page.locator('#vehicle_engineSize');
        this.dpdVehicleEngineSizeUnit = page.locator("//div[*[@for='vehicle_engineSizeUnit']]/div");
        this.dpdVehicleDesignation = page.locator("//div[*[@for='vehicle_designation']]/div");
        this.cbxVehicleIsTurbo = page.locator('#vehicle_isTurbo');
        this.cbxVehicleIs4x4 = page.locator('#vehicle_is4x4');
        this.cbxVehicleIsFWD = page.locator('#vehicle_isFWD');
        this.txtManufacturerFullDateEnd = page.locator('#vehicle_manufacturerFullDateEnd');
        this.txtManufacturerFullKmEnd = page.locator('#vehicle_manufacturerFullKmEnd');
        this.txtManufacturerPowertrainDateEnd = page.locator('#vehicle_manufacturerPowertrainDateEnd');
        this.txtManufacturerPowertrainKmEnd = page.locator('#vehicle_manufacturerPowertrainKmEnd');
        this.btnSave = page.locator('[type="submit"]');
    }

    /**
     * Get add vehicle link for specific type
     */
    getAddVehicleLink(vehicleType: string): Locator {
        return this.page.locator(`[href="/vehicle/new/edit/${vehicleType.toUpperCase()}"]`);
    }

    /**
     * Open add new vehicle page
     */
    async openAddNewVehiclePage(vehicleType: string): Promise<void> {
        await this.lnkSelectVehicle.click();
        await this.getAddVehicleLink(vehicleType).click();
    }

    /**
     * Fill new vehicle form
     */
    async fillVehicleForm(vehicle: VehicleData, submit: boolean = true): Promise<void> {
        await this.txtVehicleVin.fill(vehicle.vin);

        if (vehicle.make) {
            await this.dpdVehicleMake.click();
            await this.page.locator(`li:has-text("${vehicle.make}")`).click();
        }
        if (vehicle.model) {
            await this.dpdVehicleModel.click();
            await this.page.locator(`li:has-text("${vehicle.model}")`).click();
        }
        if (vehicle.year) await this.txtVehicleYear.fill(vehicle.year);
        if (vehicle.price) await this.txtVehiclePrice.fill(vehicle.price);
        if (vehicle.kilometers) await this.txtVehicleKM.fill(vehicle.kilometers);
        if (vehicle.condition) {
            await this.dpdVehicleCondition.click();
            await this.page.locator(`li:has-text("${vehicle.condition}")`).click();
        }
        if (vehicle.fuelType) {
            await this.dpdVehicleFuelType.click();
            await this.page.locator(`li:has-text("${vehicle.fuelType}")`).click();
        }
        if (vehicle.transmission) {
            await this.dpdVehicleTransmission.click();
            await this.page.locator(`li:has-text("${vehicle.transmission}")`).click();
        }
        if (vehicle.cylinders) await this.txtVehicleCylinders.fill(vehicle.cylinders);
        if (vehicle.engineSize) await this.txtVehicleEngineSize.fill(vehicle.engineSize);
        if (vehicle.engineSizeUnit) {
            await this.dpdVehicleEngineSizeUnit.click();
            await this.page.locator(`li:has-text("${vehicle.engineSizeUnit}")`).click();
        }
        if (vehicle.designation) {
            await this.dpdVehicleDesignation.click();
            await this.page.locator(`li:has-text("${vehicle.designation}")`).click();
        }
        if (vehicle.isTurbo) await this.cbxVehicleIsTurbo.check();
        if (vehicle.is4x4) await this.cbxVehicleIs4x4.check();
        if (vehicle.isFWD) await this.cbxVehicleIsFWD.check();
        if (vehicle.manufacturerFullDateEnd) await this.txtManufacturerFullDateEnd.fill(vehicle.manufacturerFullDateEnd);
        if (vehicle.manufacturerFullKmEnd) await this.txtManufacturerFullKmEnd.fill(vehicle.manufacturerFullKmEnd);
        if (vehicle.manufacturerPowertrainDateEnd) await this.txtManufacturerPowertrainDateEnd.fill(vehicle.manufacturerPowertrainDateEnd);
        if (vehicle.manufacturerPowertrainKmEnd) await this.txtManufacturerPowertrainKmEnd.fill(vehicle.manufacturerPowertrainKmEnd);

        if (submit) {
            await this.btnSave.click();
        }
    }

    /**
     * Go back to inventory list
     */
    async goBack(): Promise<void> {
        await this.lnkBack.click();
    }

    /**
     * Check if vehicle exists in list
     */
    async isVehicleInList(vin: string): Promise<boolean> {
        const row = await this.tblVehicleList.findRow(vin);
        return row !== null;
    }

    /**
     * Wait for table to be visible
     */
    async waitForTableVisible(): Promise<void> {
        await this.tblVehicleList.waitForVisible();
    }
}
