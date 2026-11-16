import { expect, Page, test } from '@playwright/test';
import { DealerQuoteVehicleFormPage } from '../pages/dealerPortal/DealerQuoteVehicleFormPage';
import { DealerQuoteRecordPage } from '../pages/dealerPortal/DealerQuoteRecordPage';
import { QuoteListPage } from '../pages/dealerPortal/QuoteListPage';
import { MinimalVehicle } from './QuoteVehicleFormFlow';

/** Labels of the "Create a quote" form since AP-2533 (Dev, 2026-11-07): "Vehicle type" comes first. */
const FORM_LABELS = ['Vehicle type', 'Quote name', 'VIN', 'Brand', 'Model', 'Year'];
const NEW_QUOTE_PATH = /\/quote\/new\/edit-vehicle(\/[A-Z0-9_]+)?$/;
const HEADING = { en: 'Create a quote', fr: 'Créer une cotation' } as const;
const quoteHeading = (id: number, name: string): RegExp => new RegExp(`^\\s*#${id}\\s*-\\s*${name}\\s*$`);

/** True when every expected label appears in `shown`, in the same relative order (other labels may sit between). */
const containsInOrder = (shown: string[], expected: string[]): boolean => {
    let i = 0;
    for (const label of shown) if (label === expected[i]) i++;
    return i === expected.length;
};

/**
 * Dealer business flows for the updated "Create a quote" form (AP-2533, Dev v2dev): "Décoder"
 * fills the form without saving, and the "Vehicle type" select sits before Quote name.
 * Works alongside QuoteVinDecoderFlow (AP-2507), which opens the form, runs the build check and
 * decodes a VIN whose Brand is known; this file adds what AP-2533's cases need beyond that.
 *
 * Read-only except saveAndVerifyQuoteCreated (one quote per call; dealers cannot delete quotes —
 * recorded as a `test-data-left` annotation) and the ?_locale= switch (callers restore the original language).
 * Observations the manual cases record without a verdict (Q-002 … Q-009) are annotations only.
 */
export class QuoteFormUiFlow {
    private readonly form: DealerQuoteVehicleFormPage;
    private readonly record: DealerQuoteRecordPage;
    private readonly list: QuoteListPage;

    constructor(private readonly page: Page) {
        this.form = new DealerQuoteVehicleFormPage(page);
        this.record = new DealerQuoteRecordPage(page);
        this.list = new QuoteListPage(page);
    }

    private note(type: string, description: string): void {
        test.info().annotations.push({ type, description });
    }

    // ── Quote search (/quotes?quote_search[keyword]=…) ───────────────────────

    private async openSearch(keyword: string, page = 1): Promise<void> {
        const path = `/quotes?quote_search%5Bkeyword%5D=${encodeURIComponent(keyword)}${page > 1 ? `&page=${page}` : ''}`;
        const status = await this.list.open(path);
        expect(status, `HTTP status of ${path}`).toBeLessThan(400);
        await expect(this.list.lblHeading, 'Quote list heading').toBeVisible();
    }

    /** Ids of every quote the keyword search lists, over all pages (empty for "No entities found"). */
    async searchQuoteIds(keyword: string): Promise<string[]> {
        return await test.step(`Dealer searches the quotes for "${keyword}" and reads the ids on every page`, async () => {
            await this.openSearch(keyword);
            if (await this.list.lblNoEntities.isVisible()) return [];
            const ids = await this.list.readRowQuoteIds();
            const last = await this.list.readLastPageNumber();
            for (let p = 2; p <= last; p++) {
                await this.openSearch(keyword, p);
                ids.push(...await this.list.readRowQuoteIds());
            }
            this.note('quote-search', `"${keyword}": ${ids.length} quote(s) ${ids.join(', ')}`);
            return ids;
        });
    }

    async verifyNoQuoteFound(keyword: string): Promise<void> {
        await test.step(`VERIFICATION POINT: searching "${keyword}" shows "No entities found" — no quote was created`, async () => {
            await this.openSearch(keyword);
            await expect(this.list.lblNoEntities, 'Empty-state message').toHaveText('No entities found');
            await expect(this.list.rows, 'No quote row').toHaveCount(0);
        });
    }

    async verifySearchUnchanged(keyword: string, baseline: string[]): Promise<void> {
        await test.step(`VERIFICATION POINT: searching "${keyword}" lists the same ${baseline.length} quote(s) as before`, async () => {
            const now = await this.searchQuoteIds(keyword);
            expect([...now].sort(), `Quotes found for "${keyword}"`).toEqual([...baseline].sort());
        });
    }

    async verifyExactlyOneQuoteNamed(quoteName: string, quoteId: number, vehicleText: string): Promise<void> {
        await test.step(`VERIFICATION POINT: searching "${quoteName}" lists exactly one quote, ${quoteId}`, async () => {
            await this.openSearch(quoteName);
            await expect(this.list.rows, `Quotes named "${quoteName}"`).toHaveCount(1);
            expect(await this.list.readRowQuoteIds(), 'Listed quote id').toEqual([String(quoteId)]);
            const [row] = await this.list.readRowTexts();
            expect(row.toLowerCase(), 'Vehicle cell carries the quote name').toContain(quoteName.toLowerCase());
            expect(row, 'Vehicle cell carries the vehicle').toContain(vehicleText);
        });
    }

    // ── Form observations (record-only) ─────────────────────────────────────

    async recordHiddenInputs(when: string): Promise<Record<string, string>> {
        const hidden = await this.form.hiddenDetailValues();
        this.note(`record-only-hidden-inputs-${when}`, JSON.stringify(hidden));
        return hidden;
    }

    async recordVehicleTypeControl(): Promise<string> {
        return await test.step('Dealer reads the "Vehicle type" control (default, number of types, old top-right button) — '
            + 'record-only', async () => {
            const options = await this.form.vehicleTypeOptions();
            const shown = await this.form.vehicleTypeShown();
            this.note('record-only-vehicle-type', `default "${shown}", ${options.length} types, `
                + `old top-right button count ${await this.form.btnVehicleType.count()}, URL ${new URL(this.page.url()).pathname}`);
            return shown;
        });
    }

    // ── Decoding on any form ────────────────────────────────────────────────

    /** Types the VIN, clicks "Décoder" once and checks no error page and no 5xx; stays on the same form URL. */
    async decodeAndStayOnForm(vin: string): Promise<void> {
        await test.step(`Dealer types VIN "${vin}", clicks "Décoder" once — no error page, still on the same form`, async () => {
            const url = this.page.url();
            await this.form.fillVin(vin);
            const post = await this.form.decodeOnCurrentForm();
            this.note('decoder-post', `VIN "${vin}": POST ${new URL(post.url()).pathname} → ${post.status()}`);
            expect(post.status(), 'Decoder post answers without a server error').toBeLessThan(500);
            expect(post.status(), 'Decoder post does not redirect to a saved quote').not.toBe(302);
            await expect(this.page, 'Still on the same form').toHaveURL(url);
            await expect(this.page, 'No redirect to a quote details page').not.toHaveURL(/\/quote\/\d+\/details/);
            await expect(this.form.lblHeading, 'No error page').toHaveText('Create a quote');
        });
    }

    async verifyFormCardShown(): Promise<void> {
        await test.step('VERIFICATION POINT: the form card is not empty — Vehicle type, Quote name, VIN, Brand, Model, Year '
            + 'and "Save" shown, no "Vehicle saved" banner', async () => {
            const labels = await this.form.visibleFieldLabels();
            this.note('form-labels', JSON.stringify(labels));
            expect(containsInOrder(labels, FORM_LABELS),
                `Visible field labels ${JSON.stringify(labels)} include ${JSON.stringify(FORM_LABELS)} in that order`).toBe(true);
            await expect(this.form.btnSave, 'Save button').toBeVisible();
            await expect(this.form.btnSave, 'Save button').toHaveText('Save');
            await expect(this.form.lblSavedBanner, 'No "Vehicle saved" banner').toHaveCount(0);
        });
    }

    async verifyQuoteNameKept(quoteName: string): Promise<void> {
        await expect(this.form.txtQuoteName, 'Quote name still holds the typed value').toHaveValue(quoteName);
    }

    async verifyVinKept(vin: string): Promise<void> {
        await expect(this.form.txtVin, 'VIN kept').toHaveValue(vin);
    }

    async recordQuoteNameAndMessages(when: string): Promise<void> {
        this.note(`record-only-${when}`, `Quote name "${await this.form.txtQuoteName.inputValue()}", `
            + `Brand "${await this.form.dropdownShown(this.form.dpdMake)}", Model "${await this.form.dropdownShown(this.form.dpdModel)}", `
            + `Year "${await this.form.txtYear.inputValue()}", messages ${JSON.stringify(await this.form.formErrorTexts())}`);
    }

    // ── Hand-chosen vehicle, then decode (AP2533_006) ───────────────────────

    async chooseVehicleByHand(vehicle: MinimalVehicle): Promise<void> {
        await test.step(`Dealer chooses ${vehicle.brand} / ${vehicle.model} / ${vehicle.year} by hand`, async () => {
            await this.form.chooseBrand(vehicle.brand);
            await this.form.chooseModel(vehicle.model);
            await this.form.fillYear(vehicle.year);
            await expect(this.form.dpdMake.locator('button'), 'Brand').toHaveAttribute('title', vehicle.brand);
            await expect(this.form.dpdModel.locator('button'), 'Model').toHaveAttribute('title', vehicle.model);
            await expect(this.form.txtYear, 'Year').toHaveValue(vehicle.year);
        });
    }

    async verifyEachValueHandChosenOrDecoded(hand: MinimalVehicle, decoded: MinimalVehicle): Promise<void> {
        await test.step(`VERIFICATION POINT: Brand, Model and Year are each the hand-chosen or the decoded value, none empty `
            + '(which one wins is record-only, Q-004)', async () => {
            const shown = {
                brand: await this.form.dropdownShown(this.form.dpdMake),
                model: await this.form.dropdownShown(this.form.dpdModel),
                year: await this.form.txtYear.inputValue(),
            };
            this.note('record-only-Q-004', `after decode: ${shown.brand} / ${shown.model} / ${shown.year}`);
            expect([hand.brand, decoded.brand], 'Brand').toContain(shown.brand);
            expect([hand.model, decoded.model], 'Model').toContain(shown.model);
            expect([hand.year, decoded.year], 'Year').toContain(shown.year);
        });
    }

    // ── Vehicle type select (AP2533_007 / 008 / 009 / 011) ──────────────────

    /** Chooses a type in "Vehicle type" and waits for that type's form; returns its URL path. */
    async chooseVehicleType(label: string): Promise<string> {
        return await test.step(`Dealer chooses "${label}" in "Vehicle type" — no error page`, async () => {
            const option = (await this.form.vehicleTypeOptions()).find(o => o.label === label);
            expect(option, `"${label}" offered in Vehicle type`).toBeTruthy();
            await this.form.chooseVehicleTypeInSelect(label);
            await expect(this.page, `Form of type "${label}"`).toHaveURL(new RegExp(`${option!.url}$`));
            await expect(this.form.lblHeading, 'No error page').toHaveText('Create a quote');
            return option!.url;
        });
    }

    /** English form (AP2533_007 / 008): the label "Vehicle type" is stated by REQ-003 AC 1, so it is asserted. */
    async verifyVehicleTypeBeforeQuoteName(label = 'Vehicle type'): Promise<void> {
        await test.step(`VERIFICATION POINT: the type control is labelled "${label}" and sits before and above Quote name`, async () => {
            await expect(this.form.lblVehicleType, 'Label of the type control').toHaveText(label);
            await this.expectTypeControlBeforeQuoteName();
        });
    }

    /**
     * Any language (AP2533_009, French): asserts only the position. The label is not stated by the
     * ticket (Q-009, Judgement), so it is recorded as an annotation.
     */
    async verifyVehicleTypePositionOnlyBeforeQuoteName(language: string): Promise<void> {
        await test.step(`VERIFICATION POINT: in ${language} the type control sits before and above Quote name `
            + '(label record-only, Q-009)', async () => {
            this.note('record-only-Q-009', `${language} type-control label "${(await this.form.lblVehicleType.innerText()).trim()}"`);
            await this.expectTypeControlBeforeQuoteName();
        });
    }

    private async expectTypeControlBeforeQuoteName(): Promise<void> {
        expect(await this.form.vehicleTypeComesBeforeQuoteName(), 'Type control comes first in the page structure').toBe(true);
        const { type, name } = await this.form.vehicleTypeAndQuoteNameBoxes();
        expect(type, 'Type control is shown').not.toBeNull();
        expect(name, 'Quote name is shown').not.toBeNull();
        this.note('layout', `type x=${type!.x} y=${type!.y}; Quote name x=${name!.x} y=${name!.y}`);
        const above = type!.y + type!.height <= name!.y;
        const sameRowLeft = Math.abs(type!.y - name!.y) < 5 && type!.x < name!.x;
        expect(above || sameRowLeft, 'Type control shown above Quote name (or on its row, to its left)').toBe(true);
    }

    async verifyVehicleTypeShows(label: string): Promise<void> {
        expect(await this.form.vehicleTypeShown(), 'Vehicle type shows the chosen type').toBe(label);
    }

    async recordAfterTypeChange(): Promise<void> {
        this.note('record-only-type-change', `URL ${new URL(this.page.url()).pathname}, `
            + `Quote name "${await this.form.txtQuoteName.inputValue()}", "Décoder" shown: ${await this.form.btnDecoder.isVisible()}`);
    }

    /**
     * Chooses each type after the default, in list order, until one shows "Décoder" (AP2533_011 step 2).
     * Returns its label and URL path, or null when no second type offers "Décoder".
     */
    async findSecondTypeWithDecoder(): Promise<{ label: string; url: string } | null> {
        return await test.step('Dealer chooses each type in list order, skipping the default, until one shows "Décoder"', async () => {
            const options = (await this.form.vehicleTypeOptions()).filter(o => !o.selected);
            const checked: string[] = [];
            for (const option of options) {
                const url = await this.chooseVehicleType(option.label);
                const decoder = await this.form.btnDecoder.isVisible();
                checked.push(`${option.label}: ${decoder ? 'Décoder' : 'no Décoder'}`);
                if (decoder) {
                    this.note('record-only-Q-006', checked.join('; '));
                    return { label: option.label, url };
                }
            }
            this.note('record-only-Q-006', checked.join('; '));
            return null;
        });
    }

    // ── Language (AP2533_009) ───────────────────────────────────────────────

    async openNewQuoteForm(query = ''): Promise<void> {
        const path = `/quote/new/edit-vehicle${query ? `?${query}` : ''}`;
        await test.step(`Dealer opens ${path}`, async () => {
            const response = await this.page.goto(path);
            expect(response?.status() ?? 0, `HTTP status of ${path}`).toBeLessThan(400);
            await expect(this.form.frmQuoteVehicle, 'The quote form is shown').toBeVisible();
        });
    }

    async readInterfaceLanguage(): Promise<'en' | 'fr'> {
        const heading = (await this.form.lblHeading.innerText()).trim();
        this.note('language', `heading "${heading}"`);
        if (heading === HEADING.fr) return 'fr';
        expect(heading, 'Interface language recognised (English or French heading)').toBe(HEADING.en);
        return 'en';
    }

    async switchToFrenchAndRecordLabels(): Promise<void> {
        await test.step('Dealer opens the form with ?_locale=fr — the French form loads; labels record-only (Q-009)', async () => {
            await this.openNewQuoteForm('_locale=fr');
            await expect(this.form.lblHeading, 'French heading — no error page').toHaveText(HEADING.fr);
            this.note('record-only-Q-009', `French labels ${JSON.stringify(await this.form.visibleFieldLabels())}`);
        });
    }

    async restoreLanguage(locale: 'en' | 'fr'): Promise<void> {
        await test.step(`Dealer restores the interface language "${locale}" with ?_locale=${locale}`, async () => {
            await this.openNewQuoteForm(`_locale=${locale}`);
        });
    }

    /** Opens the form afresh, with no ?_locale= parameter, and checks the account kept `locale`. */
    async verifyLanguageRestored(locale: 'en' | 'fr'): Promise<void> {
        await test.step(`VERIFICATION POINT: on a fresh load of the form the interface is back in "${locale}"`, async () => {
            await this.openNewQuoteForm();
            expect(new URL(this.page.url()).search, 'No locale parameter in the URL').not.toContain('_locale');
            await expect(this.form.lblHeading, 'Heading').toHaveText(HEADING[locale]);
            if (locale === 'en') {
                expect(await this.form.visibleFieldLabels(), 'English labels').toContain('Quote name');
            }
        });
    }

    // ── Save (AP2533_004 / 010) ─────────────────────────────────────────────

    /** Saves and returns the new quote id. Leaves one quote (and its vehicle) on the environment. */
    async saveAndVerifyQuoteCreated(vehicle: MinimalVehicle, vin: string, quoteName: string,
        decodedHiddenId: string): Promise<number> {
        return await test.step(`Dealer clicks "Save" once — quote "${quoteName}" is created and its details page opens`, async () => {
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
            this.note('record-only-Q-002', `saved vehicle ${vehicleId}; hidden quote_vehicle[id] after decode "${decodedHiddenId}"`);
            console.log(`AP-2533 test data left: quote ${quoteId} "${quoteName}", vehicle ${vehicleId}`);
            return quoteId;
        });
    }

    async verifyQuoteVehicle(quoteId: number, vehicle: MinimalVehicle, vin: string): Promise<void> {
        await test.step(`VERIFICATION POINT: the vehicle of quote ${quoteId} shows ${vehicle.brand} ${vehicle.model} `
            + `${vehicle.year} and VIN ${vin} (read only)`, async () => {
            await this.record.openQuoteDetails(quoteId);
            const vehicleId = await this.record.vehicleIdOnQuote();
            expect(vehicleId, 'Vehicle id on the quote').toBeGreaterThan(0);
            await this.record.openVehicleDetails(vehicleId);
            await expect(this.record.lblMain, 'Vehicle details').toContainText(`${vehicle.brand} ${vehicle.model} ${vehicle.year}`);
            await expect(this.record.lblMain, 'VIN on the vehicle').toContainText(vin);
        });
    }

    /** A message must show under each empty field; its wording is recorded and compared with 2026-11-01, not asserted. */
    async saveAndVerifyRefused(blankFieldIds: string[]): Promise<void> {
        await test.step('Dealer clicks "Save" once with Brand, Model and Year empty — the form refuses it', async () => {
            await this.form.save();
            await expect(this.form.fieldError(blankFieldIds[0]), 'Validation message shown').toBeVisible();
            await expect(this.page, 'Still on the new-quote form').toHaveURL(NEW_QUOTE_PATH);
            await expect(this.form.lblHeading, 'No error page').toHaveText('Create a quote');
            await expect(this.form.lblSavedBanner, 'No "Vehicle saved" banner').toHaveCount(0);
            const wording: Record<string, string> = {};
            for (const id of blankFieldIds) {
                await expect(this.form.fieldError(id), `Message under ${id}`).toBeVisible();
                await expect(this.form.fieldError(id), `Message under ${id} has text`).not.toHaveText(/^\s*$/);
                wording[id] = (await this.form.fieldError(id).innerText()).trim();
            }
            const same = Object.values(wording).every(t => t.includes('This value should not be blank.'));
            this.note('record-only-message-wording', `${JSON.stringify(wording)}; same as the 2026-11-01 wording `
                + `"This value should not be blank.": ${same}`);
        });
    }

    async recordFormMap(): Promise<void> {
        this.note('record-only-Q-008', `visible controls ${JSON.stringify(await this.form.visibleControlNames())}; `
            + `hidden ${JSON.stringify(Object.keys(await this.form.hiddenDetailValues()))}; `
            + `old top-right type button count ${await this.form.btnVehicleType.count()}`);
    }
}
