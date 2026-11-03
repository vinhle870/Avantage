import { Page, Locator } from '@playwright/test';
import { TableComponent } from '../../core/components/TableComponent';
import { VehicleInfo } from '../../data/dealer-portal';
import { selectCheckbox, selectDropdownOption } from '../../core/utils/uiActions';

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
        this.lnkBack = page.locator("//a[@class='btn btn-link text-dark']");
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
     * Get add vehicle link for specific type (e.g. "Passenger")
     */
    getAddVehicleLink(vehicleType: string): Locator {
        return this.page.locator(`[href='/vehicle/new/edit/${vehicleType.toUpperCase()}']`);
    }

    /**
     * Open the "select vehicle" menu, then the add form for the vehicle type
     */
    async openAddNewVehiclePage(vehicleType: string): Promise<void> {
        await this.lnkSelectVehicle.click();
        await this.getAddVehicleLink(vehicleType).click();
    }

    /**
     * Fill the new vehicle form. Every field is written, like the Java fillNewVehicleInfo.
     */
    async fillVehicleForm(vehicle: VehicleInfo, submit: boolean = true): Promise<void> {
        await this.txtVehicleVin.fill(vehicle.vin);
        await selectDropdownOption(this.dpdVehicleMake, vehicle.branch);
        // Model options load after Make is chosen; selectDropdownOption retries until they appear
        await selectDropdownOption(this.dpdVehicleModel, vehicle.model);
        await this.txtVehicleYear.fill(vehicle.year);
        await this.txtVehiclePrice.fill(vehicle.price);
        await this.txtVehicleKM.fill(vehicle.km);
        await selectDropdownOption(this.dpdVehicleCondition, vehicle.condition);
        await selectDropdownOption(this.dpdVehicleFuelType, vehicle.fuelType);
        await selectDropdownOption(this.dpdVehicleTransmission, vehicle.transmission);
        await this.txtVehicleCylinders.fill(vehicle.cylinders);
        await this.txtVehicleEngineSize.fill(vehicle.engineSize);
        await selectDropdownOption(this.dpdVehicleEngineSizeUnit, vehicle.engineSizeUnit);
        await selectDropdownOption(this.dpdVehicleDesignation, vehicle.designation);
        if (vehicle.isTurboEngine.includes('Yes')) await selectCheckbox(this.cbxVehicleIsTurbo);
        if (vehicle.is4x4.includes('Yes')) await selectCheckbox(this.cbxVehicleIs4x4);
        if (vehicle.isAllWheelDrive.includes('Yes')) await selectCheckbox(this.cbxVehicleIsFWD);
        await this.txtManufacturerFullDateEnd.fill(vehicle.fullCoverageEndDate);
        await this.txtManufacturerFullKmEnd.fill(vehicle.fullCoverageMaxMile);
        await this.txtManufacturerPowertrainDateEnd.fill(vehicle.powertrainCoverageEndDate);
        await this.txtManufacturerPowertrainKmEnd.fill(vehicle.powertrainCoverageMaxMile);

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
     * Inventory ID (first column) of the newest vehicle — the first row of the list
     */
    async getNewestVehicleId(): Promise<string> {
        await this.waitForTableVisible();
        const firstRow = await this.tblVehicleList.getFirstRow(',');
        return firstRow.split(',')[0].trim();
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
