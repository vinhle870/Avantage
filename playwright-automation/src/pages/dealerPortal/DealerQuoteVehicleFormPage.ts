import { Locator, Page } from '@playwright/test';
import { selectDropdownOption } from '../../core/utils/uiActions';

/**
 * Minimal new-quote vehicle form (/quote/new/edit-vehicle) — added for AP-2477.
 * Form `quote_vehicle`: Quote name, VIN (+ "Décoder" for car types), Brand, Model, Year, Save.
 * Locators verified on Dev (v2dev) 2026-11-01, each matching exactly one element.
 *
 * Kept apart from DealerNewQuotePage (whose `#vehicle_quote_name` locators predate the
 * deployed form) so that file is left untouched.
 *
 * Never click the "Décoder" button in automation: on dev it saves a quote (AP-2507).
 */
export class DealerQuoteVehicleFormPage {
    private readonly page: Page;

    readonly lblHeading: Locator;
    readonly btnVehicleType: Locator;
    readonly frmQuoteVehicle: Locator;
    readonly lblFields: Locator;
    readonly lblRequiredFields: Locator;
    readonly txtQuoteName: Locator;
    readonly txtVin: Locator;
    readonly btnDecoder: Locator;
    readonly selMake: Locator;
    readonly dpdMake: Locator;
    readonly selModel: Locator;
    readonly dpdModel: Locator;
    readonly txtYear: Locator;
    readonly btnSave: Locator;
    readonly txtPriceInForm: Locator;
    readonly txtKilometersInForm: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lblHeading = page.locator('main h1');
        this.btnVehicleType = page.locator('#dropdownMenuLink1');
        this.frmQuoteVehicle = page.locator('form[name="quote_vehicle"]');
        this.lblFields = this.frmQuoteVehicle.locator('label');
        this.lblRequiredFields = this.frmQuoteVehicle.locator('label.required');
        this.txtQuoteName = page.locator('#quote_vehicle_quote_name');
        this.txtVin = page.locator('#quote_vehicle_VIN');
        this.btnDecoder = this.frmQuoteVehicle.locator('button[data-action="vinLookup"]');
        this.selMake = page.locator('#vehicle_make');
        this.dpdMake = page.locator("//form[@name='quote_vehicle']//div[*[@for='vehicle_make']]/div");
        this.selModel = page.locator('#vehicle_model');
        this.dpdModel = page.locator("//form[@name='quote_vehicle']//div[*[@for='vehicle_model']]/div");
        this.txtYear = page.locator('#vehicle_year');
        this.btnSave = this.frmQuoteVehicle.locator('[type="submit"]');
        this.txtPriceInForm = this.frmQuoteVehicle.locator('[name$="[price]"]');
        this.txtKilometersInForm = this.frmQuoteVehicle.locator('[name$="[kilometers]"]');
    }

    /** Menu entry for a vehicle type: `''` = Passenger, else the type code (e.g. `RV_CLASS_A`). */
    vehicleTypeLink(typeCode: string): Locator {
        const href = typeCode ? `/quote/new/edit-vehicle/${typeCode}` : '/quote/new/edit-vehicle';
        return this.page.locator(`a.dropdown-item[href="${href}"]`);
    }

    /** The "This value should not be blank." style message under one field's label. */
    fieldError(fieldId: string): Locator {
        return this.frmQuoteVehicle.locator(`.form-group:has(> label[for="${fieldId}"]) .form-error-message`);
    }

    async chooseVehicleType(typeCode: string): Promise<void> {
        await this.btnVehicleType.click();
        await this.vehicleTypeLink(typeCode).click();
    }

    async fillQuoteName(name: string): Promise<void> {
        await this.txtQuoteName.fill(name);
    }

    async chooseBrand(brand: string): Promise<void> {
        await selectDropdownOption(this.dpdMake, brand);
    }

    async chooseModel(model: string): Promise<void> {
        await selectDropdownOption(this.dpdModel, model);
    }

    async fillYear(year: string): Promise<void> {
        await this.txtYear.fill(year);
    }

    async save(): Promise<void> {
        await this.btnSave.click();
    }

    /** Texts of the visible field labels, top to bottom, error badges excluded. */
    async visibleFieldLabels(): Promise<string[]> {
        return this.lblFields.evaluateAll(els => els
            .filter(e => (e as HTMLElement).offsetParent !== null)
            .map(e => (e.firstChild?.textContent ?? '').trim()));
    }

    /** `name` of every visible, user-editable control of the form (text, number, select). */
    async visibleControlNames(): Promise<string[]> {
        return this.frmQuoteVehicle.locator('input[name], select[name], textarea[name]').evaluateAll(els => els
            .filter(e => (e as HTMLInputElement).type !== 'hidden')
            .filter(e => e.tagName === 'SELECT' || (e as HTMLElement).offsetParent !== null)
            .map(e => e.getAttribute('name') ?? ''));
    }

    /** `name` of every control carrying the HTML `required` attribute. */
    async requiredControlNames(): Promise<string[]> {
        return this.frmQuoteVehicle.locator('[required]').evaluateAll(els => els.map(e => e.getAttribute('name') ?? ''));
    }

    /** Texts of the labels marked required (the star), error badges excluded. */
    async requiredLabelTexts(): Promise<string[]> {
        return this.lblRequiredFields.evaluateAll(els => els.map(e => (e.firstChild?.textContent ?? '').trim()));
    }
}
