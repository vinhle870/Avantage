import { expect, Page, Response, test } from '@playwright/test';
import { selectDropdownOption } from '../core/utils/uiActions';
import { QuoteClient } from '../data/dealer-portal';
import { VehicleInventoryPage } from '../pages/dealerPortal';
import { QuoteProductSummaryPage } from '../pages/dealerPortal/QuoteProductSummaryPage';
import { VehicleAddFormPage } from '../pages/dealerPortal/VehicleAddFormPage';
import { WarrantyVehicleField, WarrantyVehicleFormModal } from '../pages/dealerPortal/WarrantyVehicleFormModal';
import { QuoteCancelProductFlow } from './QuoteCancelProductFlow';

/** The inventory vehicle every AP-2497 case starts from (V1 in AP2497_TestCases_*.md). */
export interface WarrantyTestVehicle {
    vin: string;
    make: string;
    model: string;
    year: string;
    kilometers: string;
    price: string;
}

/** Values the vehicle form shows after a reload. */
export interface WarrantyVehicleValues {
    make: string;
    model: string;
    year: string;
    kilometers: string;
}

/** Field edits typed before "Update vehicle"; omitted fields stay as prefilled. */
export interface WarrantyVehicleEdit {
    make?: string;
    model?: string;
    year?: string;
    kilometers?: string;
}

const NOT_BLANK = 'This value should not be blank.';
const PROGRAM_ID = /<h5[^>]*>\s*<a[^>]*href="(#program-[^"]*)"/g;

/**
 * Dealer business flows for the vehicle form of the add-extended-warranty modal (AP-2497).
 * Added in its own file so the QA's uncommitted DealerFlow.ts is left untouched; the login stays in
 * DealerFlow.loginToDealerPortal(), and the quote is built with QuoteCancelProductFlow.createQuoteFromVehicle().
 *
 * Only the record-only and refresh behaviour that PASSED manually on Dev is asserted. The field errors are
 * read from the page whether or not the form is expanded, because on Dev a refused submit draws its error
 * inside the collapsed form (AP-2522); nothing here asserts that the form is collapsed (AP-2521) or that it
 * has five fields (AP-2520).
 *
 * Writes to Dev: createVehicle() adds one inventory vehicle, createQuote() one client and one quote, and an
 * accepted "Update vehicle" changes that inventory vehicle.
 */
export class WarrantyVehicleFormFlow {
    private readonly modal: WarrantyVehicleFormModal;
    private readonly summary: QuoteProductSummaryPage;
    private readonly inventory: VehicleInventoryPage;
    private readonly addForm: VehicleAddFormPage;
    private readonly quoteBuilder: QuoteCancelProductFlow;

    constructor(private readonly page: Page) {
        this.modal = new WarrantyVehicleFormModal(page);
        this.summary = new QuoteProductSummaryPage(page);
        this.inventory = new VehicleInventoryPage(page);
        this.addForm = new VehicleAddFormPage(page);
        this.quoteBuilder = new QuoteCancelProductFlow(page);
    }

    // ── Preconditions (write to Dev) ─────────────────────────────────────────

    /** /vehicle/new/edit/PASSENGER: the fields the form requires; Condition, Fuel type (GASOLINE), Transmission,
     *  Engine size unit and Designation keep their defaults. Returns the new vehicle id. */
    async createVehicle(vehicle: WarrantyTestVehicle): Promise<string> {
        return test.step(`Dealer adds inventory vehicle ${vehicle.vin}: ${vehicle.make} ${vehicle.model} ${vehicle.year}, `
            + `${vehicle.kilometers} km`, async () => {
            await this.addForm.open('PASSENGER');
            await expect(this.addForm.lblHeading, 'Add form heading').toHaveText('Add a vehicle');
            await this.inventory.txtVehicleVin.fill(vehicle.vin);
            await selectDropdownOption(this.inventory.dpdVehicleMake, vehicle.make);
            await selectDropdownOption(this.inventory.dpdVehicleModel, vehicle.model);
            await this.inventory.txtVehicleYear.fill(vehicle.year);
            await this.inventory.txtVehiclePrice.fill(vehicle.price);
            await this.inventory.txtVehicleKM.fill(vehicle.kilometers);
            await this.inventory.txtVehicleCylinders.fill('4');
            await this.inventory.txtVehicleEngineSize.fill('1.8');
            await this.addForm.save();
            await expect(this.page, 'Saving opens the vehicle details').toHaveURL(/\/vehicle\/\d+\/details/);
            const vehicleId = /\/vehicle\/(\d+)\//.exec(this.page.url())?.[1] ?? '';
            test.info().annotations.push({ type: 'Vehicle created on Dev', description: `${vehicleId} (${vehicle.vin})` });
            return vehicleId;
        });
    }

    async createQuote(vehicleId: string, client: QuoteClient): Promise<string> {
        return this.quoteBuilder.createQuoteFromVehicle(vehicleId, client, '2026-11-01', '20000');
    }

    // ── Modal ────────────────────────────────────────────────────────────────

    /** Clicks "+" on the Extended warranty row and waits for the modal's vehicle and program sections. */
    async openWarrantyModal(quoteId: string): Promise<void> {
        await test.step(`Dealer clicks "+" on the Extended warranty row of quote ${quoteId}`, async () => {
            const loaded = this.page.waitForResponse(r =>
                r.url().endsWith(`/quote/${quoteId}/warranty/edit`) && r.request().method() === 'GET');
            await this.summary.clickRowAdd('warranty');
            expect((await loaded).status(), 'GET warranty/edit HTTP status').toBeLessThan(400);
            await expect(this.modal.mdlOpen, 'Modal open').toHaveCount(1);
            await expect(this.modal.frmVehicle, 'Vehicle form in the modal').toHaveCount(1);
            await expect(this.page, 'Still on the quote page').toHaveURL(new RegExp(`/quote/${quoteId}/details`));
        });
    }

    /** Reloads the quote page, reopens the modal and expands the vehicle fields. */
    async reloadAndReopen(quoteId: string): Promise<void> {
        await test.step(`Dealer reloads quote ${quoteId} and reopens the warranty modal`, async () => {
            const response = await this.page.goto(`/quote/${quoteId}/details`);
            expect(response?.status() ?? 0, 'Quote page HTTP status after reload').toBeLessThan(400);
            await expect(this.summary.lblErrorText, 'No error page').toHaveCount(0);
            await this.openWarrantyModal(quoteId);
            await this.modal.expandFields();
        });
    }

    /** Types the edits and clicks "Update vehicle"; checks no error page and that the modal stays on the quote. */
    async submitVehicle(quoteId: string, edit: WarrantyVehicleEdit): Promise<Response> {
        return test.step(`Dealer submits the warranty vehicle form with ${JSON.stringify(edit)}`, async () => {
            await this.modal.expandFields();
            if (edit.make !== undefined) await this.chooseMake(quoteId, edit.make);
            if (edit.model !== undefined) await this.modal.chooseModel(edit.model);
            if (edit.year !== undefined) await this.modal.fillYear(edit.year);
            if (edit.kilometers !== undefined) await this.modal.fillKilometers(edit.kilometers);
            const posted = this.page.waitForResponse(r =>
                r.url().endsWith(`/quote/${quoteId}/warranty/edit`) && r.request().method() === 'POST');
            await this.modal.clickUpdateVehicle();
            const response = await posted;
            expect(response.status(), '"Update vehicle" POST answers without a server error').toBeLessThan(400);
            await expect(this.page, 'URL unchanged').toHaveURL(new RegExp(`/quote/${quoteId}/details`));
            await expect(this.modal.mdlOpen, 'Modal still open').toHaveCount(1);
            await expect(this.modal.frmVehicle, 'Vehicle form re-rendered').toHaveCount(1);
            return response;
        });
    }

    async readProgramIds(): Promise<string[]> {
        return this.modal.programIds();
    }

    // ── Verifications ────────────────────────────────────────────────────────

    async verifyFieldError(field: WarrantyVehicleField, message: string): Promise<void> {
        await test.step(`VERIFICATION POINT: the server answered "${message}" for ${field}`, async () => {
            await expect(this.modal.fieldError(field), `Error under ${field}`).toHaveText(message);
        });
    }

    async verifyNoFieldError(field: WarrantyVehicleField): Promise<void> {
        await test.step(`VERIFICATION POINT: no error for ${field}`, async () => {
            await expect(this.modal.fieldError(field), `No error under ${field}`).toHaveCount(0);
        });
    }

    async verifyMakeAndModelBlankErrors(): Promise<void> {
        await this.verifyFieldError('make', NOT_BLANK);
        await this.verifyFieldError('model', NOT_BLANK);
    }

    /** Record-only cases: the value read after the reload must be one of the allowed ones, never anything else. */
    async verifyStoredOneOf(field: 'year' | 'kilometers', allowed: string[], recorded: string): Promise<void> {
        await test.step(`VERIFICATION POINT: ${field} after the reload is one of ${allowed.join(' / ')} (Dev: ${recorded})`, async () => {
            const box = field === 'year' ? this.modal.txtYear : this.modal.txtKilometers;
            const value = await box.inputValue();
            expect(allowed, `${field} stored after the reload`).toContain(value);
            expect(value, `${field} as recorded on Dev, 2026-11-02`).toBe(recorded);
        });
    }

    async verifyValues(expected: WarrantyVehicleValues): Promise<void> {
        await test.step(`VERIFICATION POINT: the form shows ${expected.make} ${expected.model} ${expected.year}, `
            + `${expected.kilometers} km`, async () => {
            expect(await this.modal.selectedText(this.modal.selMake), 'Brand').toBe(expected.make);
            expect(await this.modal.selectedText(this.modal.selModel), 'Model').toBe(expected.model);
            await expect(this.modal.txtYear, 'Year').toHaveValue(expected.year);
            await expect(this.modal.txtKilometers, 'Kilometers').toHaveValue(expected.kilometers);
        });
    }

    async verifySummaryShowsKm(km: string): Promise<void> {
        await test.step(`VERIFICATION POINT: the vehicle summary shows ${km} km`, async () => {
            await expect(this.modal.lblSummary, 'Summary line').toContainText(`· ${km} km ·`);
        });
    }

    /** AP2497_015 step 5: the programs now shown are exactly those of the POST answered after the submit. */
    async verifyResultsFromNewCheck(response: Response, before: string[]): Promise<void> {
        await test.step('VERIFICATION POINT: the programs shown come from the new eligibility response', async () => {
            const body = await response.text();
            const fromResponse = [...body.matchAll(PROGRAM_ID)].map(m => m[1]);
            const shown = await this.modal.programIds();
            expect(fromResponse.length, 'Programs in the POST response').toBeGreaterThan(0);
            expect(shown, 'Programs shown = programs in the POST response').toEqual(fromResponse);
            await expect(this.modal.lblSummary, 'Summary carries the submitted mileage').toContainText('25000 km');
            test.info().annotations.push({
                type: 'Programs before → after',
                description: `${before.length} (${before.join(' ')}) → ${shown.length} (${shown.join(' ')})`,
            });
        });
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    /** Brand change re-posts the form (refresh=1) and re-renders the modal; wait for that answer. */
    private async chooseMake(quoteId: string, make: string): Promise<void> {
        const refreshed = this.page.waitForResponse(r =>
            r.url().includes(`/quote/${quoteId}/warranty/edit`) && r.request().method() === 'POST');
        await this.modal.chooseMake(make);
        expect((await refreshed).status(), 'Brand refresh HTTP status').toBeLessThan(400);
        await this.modal.expandFields();
    }
}
