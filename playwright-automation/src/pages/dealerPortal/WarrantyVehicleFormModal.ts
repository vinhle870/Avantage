import { Locator, Page } from '@playwright/test';
import { selectDropdownOption } from '../../core/utils/uiActions';

/** Field ids of the vehicle form `quote_warranty_vehicle` inside the add-extended-warranty modal. */
export type WarrantyVehicleField = 'make' | 'model' | 'year' | 'kilometers' | 'fuelType';

/**
 * Vehicle section of the add-extended-warranty modal (the "+" on the quote's "Extended warranty" row,
 * body from GET /quote/{id}/warranty/edit) — AP-2497, dealer portal, Dev (v2dev).
 * The section shows a summary line "{Make} {Model} {Year} · {km} km · {FUEL}" and an "Edit" toggle; the
 * form `quote_warranty_vehicle` (`novalidate`) holds Brand, Model, Year, Kilometers, Fuel type and
 * "Update vehicle", which posts by AJAX to /quote/{id}/warranty/edit and re-renders the modal.
 * Below it, the program form `quote_warranty` lists the eligible programs (one h5 link per program).
 * Locators verified on v2dev 2026-11-01 on quote 6503, each matching exactly one element in the open modal.
 * Added in its own file so the QA's uncommitted page objects and index.ts are left untouched.
 * No assertions here — see WarrantyVehicleFormFlow.
 */
export class WarrantyVehicleFormModal {
    private readonly page: Page;

    readonly mdlOpen: Locator;
    readonly frmVehicle: Locator;
    readonly lblSummary: Locator;
    readonly btnEdit: Locator;
    readonly pnlFields: Locator;
    readonly dpdMake: Locator;
    readonly dpdModel: Locator;
    readonly selMake: Locator;
    readonly selModel: Locator;
    readonly selFuelType: Locator;
    readonly txtYear: Locator;
    readonly txtKilometers: Locator;
    readonly btnUpdateVehicle: Locator;
    readonly frmProgram: Locator;
    readonly lnkPrograms: Locator;

    constructor(page: Page) {
        this.page = page;
        this.mdlOpen = page.locator('#myModal.show');
        this.frmVehicle = this.mdlOpen.locator('form[name="quote_warranty_vehicle"]');
        this.lblSummary = this.frmVehicle.locator('h4 + div');
        this.btnEdit = this.mdlOpen.locator('button[data-target="#warrantyVehicleForm"]');
        this.pnlFields = this.mdlOpen.locator('#warrantyVehicleForm');
        this.dpdMake = this.mdlOpen.locator('.form-group:has(> label[for="quote_warranty_vehicle_make"]) > .bootstrap-select');
        this.dpdModel = this.mdlOpen.locator('.form-group:has(> label[for="quote_warranty_vehicle_model"]) > .bootstrap-select');
        this.selMake = this.mdlOpen.locator('#quote_warranty_vehicle_make');
        this.selModel = this.mdlOpen.locator('#quote_warranty_vehicle_model');
        this.selFuelType = this.mdlOpen.locator('#quote_warranty_vehicle_fuelType');
        this.txtYear = this.mdlOpen.locator('#quote_warranty_vehicle_year');
        this.txtKilometers = this.mdlOpen.locator('#quote_warranty_vehicle_kilometers');
        this.btnUpdateVehicle = this.frmVehicle.locator('button[type="submit"]');
        this.frmProgram = this.mdlOpen.locator('form[name="quote_warranty"]');
        this.lnkPrograms = this.frmProgram.locator('h5 > a');
    }

    /** The server's field error under one field's label (present in the page whether or not the form is expanded). */
    fieldError(field: WarrantyVehicleField): Locator {
        return this.mdlOpen.locator(`label[for="quote_warranty_vehicle_${field}"] .form-error-message`);
    }

    /** Text of the selected option of a hidden <select> (Brand, Model, Fuel type). */
    async selectedText(select: Locator): Promise<string> {
        return (await select.locator('option:checked').textContent())?.trim() ?? '';
    }

    /** Program anchors ("#program-AP", …) in display order — the ids the server renders for the eligible programs. */
    async programIds(): Promise<string[]> {
        return this.lnkPrograms.evaluateAll(els => els.map(e => e.getAttribute('href') ?? ''));
    }

    /** Opens the fields when the section is collapsed (it collapses on open and after every re-render). */
    async expandFields(): Promise<void> {
        if (!(await this.pnlFields.isVisible())) {
            await this.btnEdit.click();
            await this.pnlFields.waitFor({ state: 'visible' });
        }
    }

    async fillYear(value: string): Promise<void> {
        await this.txtYear.fill(value);
    }

    async fillKilometers(value: string): Promise<void> {
        await this.txtKilometers.fill(value);
    }

    /** Brand change posts the form with refresh=1 and re-renders the modal (Model list reloaded). */
    async chooseMake(optionText: string): Promise<void> {
        await selectDropdownOption(this.dpdMake, optionText);
    }

    async chooseModel(optionText: string): Promise<void> {
        await selectDropdownOption(this.dpdModel, optionText);
    }

    async clickUpdateVehicle(): Promise<void> {
        await this.btnUpdateVehicle.click();
    }
}
