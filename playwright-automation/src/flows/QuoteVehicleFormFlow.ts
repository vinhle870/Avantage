import { expect, Page, test } from '@playwright/test';
import { selectDropdownOption } from '../core/utils/uiActions';
import { DealerLeftMenu, DealerQuotesPage, VehicleInventoryPage } from '../pages/dealerPortal';
import { DealerQuoteVehicleFormPage } from '../pages/dealerPortal/DealerQuoteVehicleFormPage';
import { DealerQuoteRecordPage } from '../pages/dealerPortal/DealerQuoteRecordPage';
import { VehicleAddFormPage } from '../pages/dealerPortal/VehicleAddFormPage';

/** Brand / Model / Year a minimal quote is saved with. */
export interface MinimalVehicle {
    brand: string;
    model: string;
    year: string;
}

const NOT_BLANK = 'This value should not be blank.';
/** Quote details heading "#6441 -" / "#6442-QA-…"; the h1 carries surrounding spaces and line breaks. */
const quoteHeading = (id: number, name: string): RegExp => new RegExp(`^\\s*#${id}\\s*-\\s*${name}\\s*$`);
const FIVE_FIELDS = ['Quote name', 'VIN', 'Brand', 'Model', 'Year'];
const FIVE_CONTROLS = [
    'quote_vehicle[quote_name]', 'quote_vehicle[VIN]', 'quote_vehicle[make]', 'quote_vehicle[model]', 'quote_vehicle[year]',
];

/**
 * Dealer business flows for the minimal new-quote vehicle form (AP-2477).
 * Added in its own file so the QA's uncommitted DealerFlow.ts is left untouched.
 * Login stays in DealerFlow.loginToDealerPortal().
 *
 * No method clicks "Décoder": on dev it saves a quote (AP-2507).
 */
export class QuoteVehicleFormFlow {
    private readonly leftMenu: DealerLeftMenu;
    private readonly quotesPage: DealerQuotesPage;
    private readonly form: DealerQuoteVehicleFormPage;
    private readonly record: DealerQuoteRecordPage;
    private readonly inventory: VehicleInventoryPage;
    private readonly addForm: VehicleAddFormPage;

    constructor(private readonly page: Page) {
        this.leftMenu = new DealerLeftMenu(page);
        this.quotesPage = new DealerQuotesPage(page);
        this.form = new DealerQuoteVehicleFormPage(page);
        this.record = new DealerQuoteRecordPage(page);
        this.inventory = new VehicleInventoryPage(page);
        this.addForm = new VehicleAddFormPage(page);
    }

    // ── New-quote form ────────────────────────────────────────────────────────

    async openCreateAQuote(): Promise<void> {
        await test.step('Dealer opens /quotes and clicks "Create a quote" (type Passenger)', async () => {
            await this.leftMenu.goToQuotesPage();
            await this.quotesPage.openNewQuotePage();
            await expect(this.page, 'Create a quote opens the minimal vehicle form').toHaveURL(/\/quote\/new\/edit-vehicle$/);
            await expect(this.form.lblHeading, 'Form heading').toHaveText('Create a quote');
            await expect(this.form.btnVehicleType, 'Vehicle type button').toHaveText('Passenger');
        });
    }

    async verifyOnlyFiveFieldsInOrder(): Promise<void> {
        await test.step('VERIFICATION POINT: only Quote name, VIN, Brand, Model, Year, then Save', async () => {
            expect(await this.form.visibleFieldLabels(), 'Visible field labels, top to bottom').toEqual(FIVE_FIELDS);
            expect(await this.form.visibleControlNames(), 'Editable controls of the form').toEqual(FIVE_CONTROLS);
            await expect(this.form.btnSave, 'Save button').toHaveText('Save');
            await expect(this.form.txtPriceInForm, 'No Price field').toHaveCount(0);
            await expect(this.form.txtKilometersInForm, 'No Kilometers field').toHaveCount(0);
        });
    }

    async verifyOnlyBrandModelYearRequired(): Promise<void> {
        await test.step('VERIFICATION POINT: only Brand, Model and Year are starred and required', async () => {
            expect(await this.form.requiredLabelTexts(), 'Labels with the required star').toEqual(['Brand', 'Model', 'Year']);
            expect((await this.form.requiredControlNames()).sort(), 'Controls with the required attribute')
                .toEqual(['quote_vehicle[make]', 'quote_vehicle[model]', 'quote_vehicle[year]']);
            await expect(this.form.txtQuoteName, 'Quote name is optional').not.toHaveAttribute('required', /.*/);
            await expect(this.form.txtVin, 'VIN is optional').not.toHaveAttribute('required', /.*/);
        });
    }

    async fillMinimalForm(vehicle: Partial<MinimalVehicle>, quoteName = ''): Promise<void> {
        await test.step(`Dealer fills Quote name "${quoteName}", Brand "${vehicle.brand ?? 'Choose'}", `
            + `Model "${vehicle.model ?? 'Choose'}", Year "${vehicle.year ?? ''}" (VIN empty)`, async () => {
            if (quoteName) await this.form.fillQuoteName(quoteName);
            // Choosing a Brand re-posts and re-renders the form, so the name is checked afterwards
            if (vehicle.brand) await this.form.chooseBrand(vehicle.brand);
            if (vehicle.model) await this.form.chooseModel(vehicle.model);
            if (vehicle.year) await this.form.fillYear(vehicle.year);
            await expect(this.form.txtQuoteName, 'Quote name kept').toHaveValue(quoteName);
        });
    }

    /** Saves and returns the new quote id. Leaves one quote on the environment (dealers cannot delete quotes). */
    async saveAndVerifyQuoteCreated(vehicle: MinimalVehicle, quoteName = ''): Promise<number> {
        return await test.step('Dealer clicks "Save" — the quote is created and its details page opens', async () => {
            await this.form.save();
            await expect(this.page, 'Saved quote opens its details page').toHaveURL(/\/quote\/\d+\/details$/);
            const quoteId = this.record.currentQuoteId();
            await expect(this.record.lblAlert.first(), 'Save banner').toContainText('Vehicle saved');
            await expect(this.record.lblHeading, 'Quote heading').toHaveText(quoteHeading(quoteId, quoteName));
            await expect(this.record.lnkVehicleDetails, 'Vehicle on the quote')
                .toHaveText(`${vehicle.brand} ${vehicle.model} ${vehicle.year}`);
            // Record the quote left on the environment, so the report can list it
            test.info().annotations.push({ type: 'test-data-left', description: `quote ${quoteId} (${this.page.url()})` });
            console.log(`AP-2477 test data left: quote ${quoteId}`);
            return quoteId;
        });
    }

    async saveAndVerifyRefused(blankFieldIds: string[], kept: { quoteName?: string; brand?: string; model?: string }): Promise<void> {
        await test.step(`Dealer clicks "Save" — refused with "${NOT_BLANK}" at ${blankFieldIds.join(', ')}`, async () => {
            await this.form.save();
            for (const id of blankFieldIds) {
                await expect(this.form.fieldError(id), `Error under ${id}`).toHaveText(NOT_BLANK);
            }
            await expect(this.form.frmQuoteVehicle.locator('.form-error-message'), 'No error on any other field')
                .toHaveCount(blankFieldIds.length);
            await expect(this.page, 'Still on the form, no quote opened').toHaveURL(/\/quote\/new\/edit-vehicle$/);
            await expect(this.form.lblHeading, 'Form shown again, no error page').toHaveText('Create a quote');
            if (kept.quoteName !== undefined) await expect(this.form.txtQuoteName, 'Quote name kept').toHaveValue(kept.quoteName);
            if (kept.brand) await expect(this.form.dpdMake.locator('button'), 'Brand kept').toHaveAttribute('title', kept.brand);
            if (kept.model) await expect(this.form.dpdModel.locator('button'), 'Model kept').toHaveAttribute('title', kept.model);
        });
    }

    async verifyDecoderShownForPassenger(): Promise<void> {
        await test.step('VERIFICATION POINT: Passenger shows "Décoder" and the VIN field is a VIN lookup', async () => {
            await expect(this.form.btnDecoder, '"Décoder" button').toBeVisible();
            await expect(this.form.btnDecoder).toHaveText('Décoder');
            await expect(this.form.txtVin, 'VIN input').toHaveClass(/\bvinlookup\b/);
        });
    }

    async chooseVehicleType(typeCode: string, label: string): Promise<void> {
        await test.step(`Dealer opens the type menu and chooses "${label}"`, async () => {
            await this.form.chooseVehicleType(typeCode);
            await expect(this.page, `${label} form`).toHaveURL(new RegExp(`/quote/new/edit-vehicle/${typeCode}$`));
            await expect(this.form.btnVehicleType, 'Vehicle type button').toHaveText(label);
        });
    }

    async verifyNoDecoderAndFiveFields(): Promise<void> {
        await test.step('VERIFICATION POINT: no "Décoder", plain VIN input, still only the five fields', async () => {
            await expect(this.form.btnDecoder, 'No "Décoder" button').toHaveCount(0);
            await expect(this.form.txtVin, 'VIN is a plain input').not.toHaveClass(/\bvinlookup\b/);
            expect(await this.form.visibleFieldLabels(), 'Visible field labels').toEqual(FIVE_FIELDS);
        });
    }

    // ── Quotes list ──────────────────────────────────────────────────────────

    async readNewestQuoteId(): Promise<number> {
        return await test.step('Dealer opens /quotes and notes the newest quote', async () => {
            await this.record.openQuotesList();
            const id = await this.record.newestQuoteId();
            expect(id, 'Newest quote id').toBeGreaterThan(0);
            return id;
        });
    }

    async verifyNewestQuote(expectedId: number, previousId: number): Promise<void> {
        await test.step(`VERIFICATION POINT: quote ${expectedId} is the newest row of /quotes`, async () => {
            await this.record.openQuotesList();
            expect(await this.record.newestQuoteId(), 'Newest quote').toBe(expectedId);
            expect(expectedId, 'Newer than the earlier newest quote').toBeGreaterThan(previousId);
        });
    }

    async verifyNoQuoteCreated(previousId: number, quoteName: string): Promise<void> {
        await test.step(`VERIFICATION POINT: no new quote — newest still ${previousId}, "${quoteName}" absent`, async () => {
            await this.record.openQuotesList();
            expect(await this.record.newestQuoteId(), 'Newest quote unchanged').toBe(previousId);
            const rows = await this.record.quoteRowTexts();
            expect(rows.some(r => r.includes(quoteName)), `"${quoteName}" not listed`).toBe(false);
        });
    }

    // ── Saved quote and its vehicle ──────────────────────────────────────────

    async verifyVehicleStoredEmpty(quoteId: number): Promise<void> {
        await test.step('VERIFICATION POINT: the quote vehicle has no kilometres, condition, designation or price', async () => {
            await this.record.openQuoteDetails(quoteId);
            const vehicleId = await this.record.vehicleIdOnQuote();
            expect(vehicleId, 'Vehicle id on the quote').toBeGreaterThan(0);

            await this.record.openVehicleDetails(vehicleId);
            await expect(this.record.lblVehicleDetails, 'Mileage shown without a number')
                .toContainText(/Mileage:\s*km/);
            await expect(this.record.lblVehicleDetails, 'Designation blank').toContainText(/Designation:\s*$/);

            // Read only — the edit form is never saved (it would store its defaults)
            await this.record.openVehicleEditForm(vehicleId);
            await expect(this.record.txtVehiclePrice, 'Vehicle Price empty').toHaveValue('');
            await expect(this.record.txtVehicleKilometers, 'Kilometers empty').toHaveValue('');
            await expect(this.record.optVehicleConditionSelected, 'No condition stored').toHaveCount(0);
        });
    }

    async verifyQuoteDetailsLoad(quoteId: number, vehicle: MinimalVehicle, quoteName: string): Promise<void> {
        await test.step('VERIFICATION POINT: quote details load, also after a reload, with empty mileage', async () => {
            for (const pass of ['first load', 'reload']) {
                if (pass === 'reload') await this.record.reload();
                await expect(this.record.lblHeading, `Heading (${pass})`).toHaveText(quoteHeading(quoteId, quoteName));
                await expect(this.record.lnkVehicleDetails, `Vehicle (${pass})`)
                    .toHaveText(`${vehicle.brand} ${vehicle.model} ${vehicle.year}`);
                await expect(this.record.lblMain, `Empty kilometres shown (${pass})`).toContainText(/Mileage:\s*km/);
            }
        });
    }

    async openWarrantyStepAndVerifyItAsksForMissingValues(quoteId: number): Promise<void> {
        await test.step('VERIFICATION POINT: the warranty step opens and asks for Kilometers and Fuel type', async () => {
            const response = this.page.waitForResponse(r => r.url().endsWith(`/quote/${quoteId}/warranty/edit`));
            await this.record.openWarrantyStep();
            expect((await response).status(), 'Warranty step HTTP status').toBe(200);
            await expect(this.record.txtWarrantyKilometers, 'Kilometers empty').toHaveValue('');
            await expect(this.record.txtWarrantyKilometers, 'Kilometers required').toHaveAttribute('required', /.*/);
            expect(await this.record.warrantyFuelTypeShown(), 'Fuel type not chosen').toBe('Choose');
            await expect(this.record.btnUpdateVehicle, '"Update vehicle" offered (not clicked)').toBeVisible();
            await expect(this.record.lblNoEligibleProgram, 'No program until the values are filled')
                .toContainText('There are no eligible program for the vehicle.');
        });
    }

    // ── Inventory add form ───────────────────────────────────────────────────

    async readNewestInventoryVehicleId(): Promise<string> {
        return await test.step('Dealer opens the Vehicle Inventory and notes the newest vehicle', async () => {
            await this.leftMenu.goToInventoryPage();
            return this.inventory.getNewestVehicleId();
        });
    }

    async openInventoryAddForm(typeCode: string): Promise<void> {
        await test.step(`Dealer opens the inventory "Add a vehicle" form for ${typeCode}`, async () => {
            await this.addForm.open(typeCode);
            await expect(this.addForm.lblHeading, 'Add form heading').toHaveText('Add a vehicle');
        });
    }

    async verifyInventoryFormKeepsPriceAndKilometers(): Promise<void> {
        await test.step('VERIFICATION POINT: the inventory form still shows and requires Price and Kilometers', async () => {
            const labels = await this.addForm.fieldLabels();
            for (const label of ['VIN', 'Brand', 'Model', 'Year', 'Vehicle Price', 'Kilometers', 'Condition', 'Fuel type',
                'Transmission', 'Cylinders', 'Engine size', 'Engine size unit', 'Designation']) {
                expect(labels, `Field "${label}" shown`).toContain(label);
            }
            await expect(this.inventory.txtVehiclePrice, 'Vehicle Price required').toHaveAttribute('required', /.*/);
            await expect(this.inventory.txtVehicleKM, 'Kilometers required').toHaveAttribute('required', /.*/);
        });
    }

    async fillInventoryFormWithoutPriceAndKm(vin: string, vehicle: MinimalVehicle): Promise<void> {
        await test.step(`Dealer fills VIN ${vin}, ${vehicle.brand} ${vehicle.model} ${vehicle.year}, `
            + 'Cylinders 4, Engine size 1.8 — Price and Kilometers left empty', async () => {
            await this.inventory.txtVehicleVin.fill(vin);
            await selectDropdownOption(this.inventory.dpdVehicleMake, vehicle.brand);
            await selectDropdownOption(this.inventory.dpdVehicleModel, vehicle.model);
            await this.inventory.txtVehicleYear.fill(vehicle.year);
            await this.inventory.txtVehicleCylinders.fill('4');
            await this.inventory.txtVehicleEngineSize.fill('1.8');
        });
    }

    async saveInventoryFormAndVerifyRefused(): Promise<void> {
        await test.step('Dealer clicks "Save" — refused at Vehicle Price and Kilometers', async () => {
            await this.addForm.save();
            await expect(this.addForm.fieldError('vehicle_price'), 'Error under Vehicle Price').toHaveText(NOT_BLANK);
            await expect(this.addForm.fieldError('vehicle_kilometers'), 'Error under Kilometers').toHaveText(NOT_BLANK);
            await expect(this.addForm.lblHeading, 'Still on "Add a vehicle"').toHaveText('Add a vehicle');
        });
    }

    async verifyNoInventoryVehicleAdded(previousNewestId: string): Promise<void> {
        await test.step(`VERIFICATION POINT: no vehicle added — newest inventory row still ${previousNewestId}`, async () => {
            await this.leftMenu.goToInventoryPage();
            expect(await this.inventory.getNewestVehicleId(), 'Newest inventory vehicle').toBe(previousNewestId);
        });
    }
}
