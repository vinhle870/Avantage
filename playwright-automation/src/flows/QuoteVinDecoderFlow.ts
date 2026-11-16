import { expect, Page, test } from '@playwright/test';
import { DealerLeftMenu, DealerQuotesPage } from '../pages/dealerPortal';
import { DealerQuoteVehicleFormPage } from '../pages/dealerPortal/DealerQuoteVehicleFormPage';
import { DealerQuoteRecordPage } from '../pages/dealerPortal/DealerQuoteRecordPage';
import { MinimalVehicle } from './QuoteVehicleFormFlow';

/** Labels of the "Create a quote" form since AP-2533 (Dev, 2026-11-07): "Vehicle type" comes first. */
const FORM_LABELS = ['Vehicle type', 'Quote name', 'VIN', 'Brand', 'Model', 'Year'];
/** Vehicles that must never become the saved quote's vehicle (AP-2477 decode record, inventory vehicle). */
const FORBIDDEN_VEHICLE_IDS = [915, 1067];
/** Fixed build: the novalidate key is built from the form's name, e.g. `o.push({name:i+"[novalidate]",value:!0})`. */
const KEY_FROM_FORM_NAME = /name:\s*\w+\s*\+\s*["']\[novalidate\]["']/;
/** Broken build: the key was hardcoded as `vehicle[novalidate]`. */
const HARDCODED_KEY = /["']vehicle\[novalidate\]["']/;
/** Quote details heading "#6600-QA-…"; the h1 carries surrounding spaces and line breaks. */
const quoteHeading = (id: number, name: string): RegExp => new RegExp(`^\\s*#${id}\\s*-\\s*${name}\\s*$`);

/**
 * Dealer business flows for the "Décoder" VIN lookup on the new-quote form (AP-2507 re-test).
 * Reuses the AP-2477 page objects; its own file so QuoteVehicleFormFlow (whose openCreateAQuote
 * still expects the old top-right type button) keeps its behaviour.
 *
 * Every decode must save nothing. Saving after a decode leaves one quote and one vehicle per
 * call (dealers cannot delete quotes); each is recorded as a `test-data-left` annotation.
 */
export class QuoteVinDecoderFlow {
    private readonly leftMenu: DealerLeftMenu;
    private readonly quotesPage: DealerQuotesPage;
    private readonly form: DealerQuoteVehicleFormPage;
    private readonly record: DealerQuoteRecordPage;

    constructor(private readonly page: Page) {
        this.leftMenu = new DealerLeftMenu(page);
        this.quotesPage = new DealerQuotesPage(page);
        this.form = new DealerQuoteVehicleFormPage(page);
        this.record = new DealerQuoteRecordPage(page);
    }

    private note(type: string, description: string): void {
        test.info().annotations.push({ type, description });
    }

    // ── Quotes list ──────────────────────────────────────────────────────────

    /** Top-row id of /quotes, used only as a baseline to compare against — never opened. */
    async readBaselineQuoteId(): Promise<number> {
        return await test.step('Dealer opens /quotes and notes the top-row id as the baseline (not opened)', async () => {
            await this.record.openQuotesList();
            const rows = await this.record.quoteRows();
            const baseline = Math.max(...rows.map(r => r.id));
            expect(baseline, 'Baseline quote id').toBeGreaterThan(0);
            this.note('baseline', `quote ${baseline}`);
            return baseline;
        });
    }

    async verifyDecodeSavedNoQuote(baselineId: number, vin: string): Promise<void> {
        await test.step(`VERIFICATION POINT: no quote above ${baselineId} carries VIN ${vin} — the decode saved nothing`, async () => {
            await this.record.openQuotesList();
            const newer = (await this.record.quoteRows()).filter(r => r.id > baselineId);
            expect(newer.filter(r => r.text.includes(vin)).map(r => r.id), 'Quotes with the decoded VIN above the baseline')
                .toEqual([]);
        });
    }

    async verifyOnlyTheSavedQuoteAdded(baselineId: number, quoteId: number, quoteName: string, vin: string): Promise<void> {
        await test.step(`VERIFICATION POINT: quote ${quoteId} "${quoteName}" is the only new quote with VIN ${vin}`, async () => {
            await this.record.openQuotesList();
            const newer = (await this.record.quoteRows()).filter(r => r.id > baselineId);
            expect(newer.filter(r => r.text.includes(vin)).map(r => r.id), 'New quotes with the decoded VIN')
                .toEqual([quoteId]);
            const row = newer.find(r => r.id === quoteId);
            expect(row?.text, `Row of quote ${quoteId} on /quotes`).toContain(quoteName);
            expect(newer.filter(r => r.text.includes(quoteName)), `Exactly one row named "${quoteName}"`).toHaveLength(1);
        });
    }

    // ── New-quote form ───────────────────────────────────────────────────────

    async openCreateAQuote(): Promise<void> {
        await test.step('Dealer opens /quotes and clicks "Create a quote" (Vehicle type Passenger)', async () => {
            await this.leftMenu.goToQuotesPage();
            await this.quotesPage.openNewQuotePage();
            await expect(this.page, 'Create a quote opens the vehicle form').toHaveURL(/\/quote\/new\/edit-vehicle$/);
            await expect(this.form.lblHeading, 'Form heading').toHaveText('Create a quote');
            expect(await this.form.vehicleTypeShown(), 'Vehicle type').toBe('Passenger');
            await expect(this.form.btnDecoder, '"Décoder" button').toHaveText('Décoder');
        });
    }

    async verifyDecoderFixInBuild(): Promise<void> {
        await test.step('VERIFICATION POINT: the page\'s scripts build the novalidate key from the form name (AP-2533 fix), '
            + 'without clicking "Décoder"', async () => {
            const sources = await this.form.buildScriptSources();
            expect(sources.length, 'Application scripts loaded from /build/').toBeGreaterThan(0);
            const fromFormName: string[] = [];
            const hardcoded: string[] = [];
            for (const src of sources) {
                const response = await this.page.request.get(new URL(src, this.page.url()).toString());
                expect(response.status(), `${src} readable`).toBe(200);
                const body = await response.text();
                for (const m of body.matchAll(/.{0,60}novalidate.{0,30}/g)) {
                    if (KEY_FROM_FORM_NAME.test(m[0])) fromFormName.push(`${src}: ${m[0]}`);
                    if (HARDCODED_KEY.test(m[0])) hardcoded.push(`${src}: ${m[0]}`);
                }
            }
            fromFormName.forEach(line => this.note('build-check', line));
            expect(hardcoded, 'No hardcoded vehicle[novalidate] (the AP-2507 bug)').toEqual([]);
            expect(fromFormName.length, 'A script builds the key from the form name').toBeGreaterThan(0);
        });
    }

    async fillQuoteName(quoteName: string): Promise<void> {
        await test.step(`Dealer types "${quoteName}" in Quote name`, async () => {
            await this.form.fillQuoteName(quoteName);
        });
    }

    /** Types the VIN (Brand left on "Choose"), clicks "Décoder" once and waits for the re-render. */
    async decodeVin(vin: string, expected: MinimalVehicle): Promise<Record<string, string>> {
        return await test.step(`Dealer types VIN ${vin}, clicks "Décoder" once and waits for the form to re-render`, async () => {
            await this.form.fillVin(vin);
            const post = await this.form.decode();
            expect(post.status(), 'Decoder post answers 200, not a 302 redirect').toBe(200);
            const fields = (post.request().postData() ?? '').split('&').map(p => decodeURIComponent(p.split('=')[0]));
            this.note('decoder-post', `POST ${new URL(post.url()).pathname} → ${post.status()}; `
                + `novalidate field: ${fields.find(f => f.endsWith('[novalidate]')) ?? 'none'}`);
            await expect(this.form.dpdMake.locator('button'), 'Form re-rendered with the decoded Brand')
                .toHaveAttribute('title', expected.brand);
            const hidden = await this.form.hiddenDetailValues();
            this.note('decoded-hidden-details', JSON.stringify(hidden));
            return hidden;
        });
    }

    async verifyFormPrefilled(vin: string, vehicle: MinimalVehicle, quoteName = ''): Promise<void> {
        await test.step(`VERIFICATION POINT: the form is re-rendered with ${vehicle.brand} / ${vehicle.model} / ${vehicle.year}, `
            + 'nothing saved', async () => {
            await expect(this.page, 'Still on the new-quote form').toHaveURL(/\/quote\/new\/edit-vehicle$/);
            await expect(this.form.lblHeading, 'No error page').toHaveText('Create a quote');
            await expect(this.form.txtVin, 'VIN kept').toHaveValue(vin);
            await expect(this.form.dpdMake.locator('button'), 'Brand').toHaveAttribute('title', vehicle.brand);
            await expect(this.form.dpdModel.locator('button'), 'Model').toHaveAttribute('title', vehicle.model);
            await expect(this.form.txtYear, 'Year').toHaveValue(vehicle.year);
            await expect(this.form.txtQuoteName, 'Quote name').toHaveValue(quoteName);
            expect(await this.form.visibleFieldLabels(), 'The form card is not empty — same fields as before').toEqual(FORM_LABELS);
            await expect(this.form.btnSave, 'Save button').toHaveText('Save');
            await expect(this.page.locator('main [role="alert"]', { hasText: 'Vehicle saved' }), 'No "Vehicle saved" banner')
                .toHaveCount(0);
        });
    }

    /** Saves and returns the new quote id. Leaves one quote and one vehicle on the environment. */
    async saveAndVerifyQuoteCreated(vehicle: MinimalVehicle, vin: string, quoteName: string): Promise<number> {
        return await test.step(`Dealer clicks "Save" — quote "${quoteName}" is created and its details page opens`, async () => {
            await this.form.save();
            await expect(this.page, 'Saved quote opens its details page').toHaveURL(/\/quote\/\d+\/details$/);
            const quoteId = this.record.currentQuoteId();
            await expect(this.record.lblAlert.first(), 'Save banner').toContainText('Vehicle saved');
            await expect(this.record.lblHeading, 'Quote heading with the name').toHaveText(quoteHeading(quoteId, quoteName));
            await expect(this.record.lnkVehicleDetails, 'Vehicle on the quote')
                .toHaveText(`${vehicle.brand} ${vehicle.model} ${vehicle.year}`);
            await expect(this.record.lblMain, 'VIN on the quote').toContainText(vin);
            const vehicleId = await this.record.vehicleIdOnQuote();
            this.note('test-data-left', `quote ${quoteId} "${quoteName}", vehicle ${vehicleId}`);
            console.log(`AP-2507 test data left: quote ${quoteId} "${quoteName}", vehicle ${vehicleId}`);
            return quoteId;
        });
    }

    async verifySavedVehicleIsNewDecodedVehicle(quoteId: number, vin: string, vehicle: MinimalVehicle,
        decodedHiddenId: string): Promise<void> {
        await test.step('VERIFICATION POINT: the quote\'s vehicle is a new Ford Focus 2008 with the VIN (read only); '
            + 'fuel, transmission, engine and turbo recorded, not judged', async () => {
            await this.record.openQuoteDetails(quoteId);
            const vehicleId = await this.record.vehicleIdOnQuote();
            expect(vehicleId, 'Vehicle id on the quote').toBeGreaterThan(0);
            expect(FORBIDDEN_VEHICLE_IDS, `Vehicle ${vehicleId} is not 915 or 1067`).not.toContain(vehicleId);
            expect(String(vehicleId), 'Not the existing vehicle the decoder returned').not.toBe(decodedHiddenId);

            // Read only — the edit form is never saved
            await this.record.openVehicleEditForm(vehicleId);
            await expect(this.record.lblHeading, 'Vehicle edit form').toHaveText(`Vehicle #${vehicleId}`);
            await expect(this.record.txtVehicleVin, 'VIN').toHaveValue(vin);
            expect(await this.record.chosenOption(this.record.selVehicleMake), 'Make').toBe(vehicle.brand);
            expect(await this.record.chosenOption(this.record.selVehicleModel), 'Model').toBe(vehicle.model);
            await expect(this.record.txtVehicleYear, 'Year').toHaveValue(vehicle.year);

            // Record-only (AP2477_008 / AP-2552 judge these, not AP-2507)
            this.note('record-only-vehicle-details', `vehicle ${vehicleId}: ${JSON.stringify(await this.record.vehicleDetailValues())}`);
        });
    }

    async verifyQuoteNameOnDetails(quoteId: number, quoteName: string): Promise<void> {
        await test.step(`VERIFICATION POINT: quote ${quoteId} details show the name "${quoteName}"`, async () => {
            await this.record.openQuoteDetails(quoteId);
            await expect(this.record.lblHeading, 'Quote heading with the name').toHaveText(quoteHeading(quoteId, quoteName));
        });
    }
}
