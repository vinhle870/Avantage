import { Locator, Page } from '@playwright/test';

/**
 * Read-only views of a quote and its vehicle used by the AP-2477 checks:
 * the /quotes list rows, the quote details hub, its warranty modal, and the vehicle's
 * details (/vehicle/{id}/details) and edit (/vehicle/{id}/edit) pages.
 * Locators verified on Dev (v2dev) 2026-11-01, each matching exactly one element
 * (the list cells and the modal are scoped before use).
 * Added in its own file so the QA's DealerQuotesPage / QuoteDetailPage stay untouched.
 */
export class DealerQuoteRecordPage {
    private readonly page: Page;

    // /quotes
    readonly cellQuoteRows: Locator;

    // /quote/{id}/details
    readonly lblHeading: Locator;
    readonly lblAlert: Locator;
    readonly lnkVehicleDetails: Locator;
    readonly lblMain: Locator;
    readonly btnAddWarranty: Locator;

    // warranty modal (/quote/{id}/warranty/edit)
    readonly mdlWarranty: Locator;
    readonly frmWarrantyVehicle: Locator;
    readonly txtWarrantyKilometers: Locator;
    readonly selWarrantyFuelType: Locator;
    readonly btnUpdateVehicle: Locator;
    readonly lblNoEligibleProgram: Locator;

    // /vehicle/{id}/details and /vehicle/{id}/edit
    readonly lblVehicleDetails: Locator;
    readonly txtVehiclePrice: Locator;
    readonly txtVehicleKilometers: Locator;
    readonly optVehicleConditionSelected: Locator;
    // AP-2507 — /vehicle/{id}/edit, read only (verified on Dev 2026-11-07, count 1 each)
    readonly txtVehicleVin: Locator;
    readonly selVehicleMake: Locator;
    readonly selVehicleModel: Locator;
    readonly txtVehicleYear: Locator;
    readonly vehicleDetailFields: Record<string, Locator>;

    constructor(page: Page) {
        this.page = page;
        this.cellQuoteRows = page.locator('main td[data-href^="/quote/"]');

        this.lblHeading = page.locator('main h1');
        this.lblAlert = page.locator('main [role="alert"]');
        this.lnkVehicleDetails = page.locator('main a[href^="/vehicle/"][href$="/details"]').first();
        this.lblMain = page.locator('main');
        this.btnAddWarranty = page.locator('main tr').filter({ hasText: 'Extended warranty' })
            .locator('a[href$="/warranty/edit"]');

        this.mdlWarranty = page.locator('#myModal.show');
        this.frmWarrantyVehicle = this.mdlWarranty.locator('form[name="quote_warranty_vehicle"]');
        this.txtWarrantyKilometers = this.mdlWarranty.locator('#quote_warranty_vehicle_kilometers');
        this.selWarrantyFuelType = this.mdlWarranty.locator('#quote_warranty_vehicle_fuelType');
        this.btnUpdateVehicle = this.mdlWarranty.getByRole('button', { name: 'Update vehicle' });
        this.lblNoEligibleProgram = this.mdlWarranty.locator('[role="alert"]', { hasText: 'There are no eligible program' });

        this.lblVehicleDetails = page.locator('main .card-body p').first();
        this.txtVehiclePrice = page.locator('#vehicle_price');
        this.txtVehicleKilometers = page.locator('#vehicle_kilometers');
        this.optVehicleConditionSelected = page.locator('#vehicle_condition option[selected]');

        this.txtVehicleVin = page.locator('#vehicle_VIN');
        this.selVehicleMake = page.locator('#vehicle_make');
        this.selVehicleModel = page.locator('#vehicle_model');
        this.txtVehicleYear = page.locator('#vehicle_year');
        this.vehicleDetailFields = {
            'Fuel type': page.locator('#vehicle_fuelType'),
            Transmission: page.locator('#vehicle_transmission'),
            'Engine size': page.locator('#vehicle_engineSize'),
            'Engine size unit': page.locator('#vehicle_engineSizeUnit'),
            Cylinders: page.locator('#vehicle_cylinders'),
            Turbo: page.locator('#vehicle_isTurbo'),
        };
    }

    /** Id and text of every row of the first /quotes page (the id is only in the cells' data-href). */
    async quoteRows(): Promise<{ id: number; text: string }[]> {
        return this.cellQuoteRows.evaluateAll(cells => {
            const rows = new Map<Element, { id: number; text: string }>();
            for (const cell of cells) {
                const tr = cell.closest('tr') ?? cell;
                if (rows.has(tr)) continue;
                const id = Number(/\/quote\/(\d+)\/details/.exec(cell.getAttribute('data-href') ?? '')?.[1] ?? NaN);
                rows.set(tr, { id, text: (tr as HTMLElement).innerText.replace(/\s+/g, ' ').trim() });
            }
            return [...rows.values()];
        });
    }

    /** Label of the chosen option of a select on the vehicle edit form. */
    async chosenOption(select: Locator): Promise<string> {
        return (await select.locator('option:checked').innerText()).trim();
    }

    /** Shown value of each record-only vehicle detail (select label, input value, checkbox state). */
    async vehicleDetailValues(): Promise<Record<string, string>> {
        const values: Record<string, string> = {};
        for (const [label, field] of Object.entries(this.vehicleDetailFields)) {
            values[label] = await field.evaluate(e => {
                if (e instanceof HTMLSelectElement) return e.selectedOptions[0]?.textContent?.trim() ?? '';
                if (e instanceof HTMLInputElement && e.type === 'checkbox') return String(e.checked);
                return (e as HTMLInputElement).value;
            });
        }
        return values;
    }

    async openQuotesList(): Promise<void> {
        await this.page.goto('/quotes');
        await this.cellQuoteRows.first().waitFor();
    }

    /** Quote id of the newest row of /quotes (rows are newest-first; the id is only in data-href). */
    async newestQuoteId(): Promise<number> {
        const href = await this.cellQuoteRows.first().getAttribute('data-href');
        return Number(/\/quote\/(\d+)\/details/.exec(href ?? '')?.[1] ?? NaN);
    }

    /** Text of every row of the first /quotes page (quote name and vehicle). */
    async quoteRowTexts(): Promise<string[]> {
        return this.cellQuoteRows.allInnerTexts();
    }

    /** Quote id from the current /quote/{id}/details URL. */
    currentQuoteId(): number {
        return Number(/\/quote\/(\d+)\/details/.exec(this.page.url())?.[1] ?? NaN);
    }

    async openQuoteDetails(quoteId: number): Promise<void> {
        await this.page.goto(`/quote/${quoteId}/details`);
    }

    async reload(): Promise<void> {
        await this.page.reload();
    }

    /** Vehicle id from the vehicle link of the quote details page. */
    async vehicleIdOnQuote(): Promise<number> {
        const href = await this.lnkVehicleDetails.getAttribute('href');
        return Number(/\/vehicle\/(\d+)\/details/.exec(href ?? '')?.[1] ?? NaN);
    }

    async openWarrantyStep(): Promise<void> {
        await this.btnAddWarranty.click();
        await this.frmWarrantyVehicle.waitFor();
    }

    /** Label of the option shown by the warranty modal's Fuel type select. */
    async warrantyFuelTypeShown(): Promise<string> {
        return (await this.selWarrantyFuelType.locator('option:checked').innerText()).trim();
    }

    async openVehicleDetails(vehicleId: number): Promise<void> {
        await this.page.goto(`/vehicle/${vehicleId}/details`);
    }

    /** Opened read-only: the edit form is only read, never saved. */
    async openVehicleEditForm(vehicleId: number): Promise<void> {
        await this.page.goto(`/vehicle/${vehicleId}/edit`);
    }
}
