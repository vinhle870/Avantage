import { Locator, Page } from '@playwright/test';

/**
 * Inventory "Add a vehicle" form (/vehicle/new/edit/{TYPE}), form `vehicle` — added for AP-2477
 * to check that the full form keeps Vehicle Price and Kilometers. Field filling reuses
 * VehicleInventoryPage; this class holds only the form-scoped locators that page lacks.
 * Locators verified on Dev (v2dev) 2026-11-01, each matching exactly one element.
 */
export class VehicleAddFormPage {
    private readonly page: Page;

    readonly lblHeading: Locator;
    readonly frmVehicle: Locator;
    readonly lblFields: Locator;
    readonly btnSave: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lblHeading = page.locator('main h1');
        this.frmVehicle = page.locator('form[name="vehicle"]');
        this.lblFields = this.frmVehicle.locator('label');
        this.btnSave = this.frmVehicle.locator('[type="submit"]');
    }

    async open(typeCode: string): Promise<void> {
        await this.page.goto(`/vehicle/new/edit/${typeCode}`);
        await this.frmVehicle.waitFor();
    }

    /** The "This value should not be blank." message under one field's label. */
    fieldError(fieldId: string): Locator {
        return this.frmVehicle.locator(`.form-group:has(> label[for="${fieldId}"]) .form-error-message`);
    }

    /** Texts of the form's labels, error badges excluded. */
    async fieldLabels(): Promise<string[]> {
        return this.lblFields.evaluateAll(els => els.map(e => (e.firstChild?.textContent ?? '').trim()));
    }

    async save(): Promise<void> {
        await this.btnSave.click();
    }
}
