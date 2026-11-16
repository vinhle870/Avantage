import { Locator, Page, Response } from '@playwright/test';
import { selectDropdownOption } from '../../core/utils/uiActions';

/**
 * Minimal new-quote vehicle form (/quote/new/edit-vehicle) — added for AP-2477.
 * Form `quote_vehicle`: Quote name, VIN (+ "Décoder" for car types), Brand, Model, Year, Save.
 * Locators verified on Dev (v2dev) 2026-11-01, each matching exactly one element.
 *
 * Kept apart from DealerNewQuotePage (whose `#vehicle_quote_name` locators predate the
 * deployed form) so that file is left untouched.
 *
 * "Décoder" saved a quote on the 2026-11-01 build (AP-2507). Fixed on Dev by AP-2533 (build
 * app.18b4959e.js, 2026-11-07): the decode now re-renders the form and saves nothing. Only the
 * AP-2507 and AP-2533 specs click it (decode() and decodeOnCurrentForm()), each after checking
 * the build for the fix (QuoteVinDecoderFlow.verifyDecoderFixInBuild).
 *
 * AP-2507 members (verified on Dev 2026-11-07, count 1 each): selVehicleTypeSwitch (the
 * "Vehicle type" select that replaced the top-right type button), hiddenDetails, decode().
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
    // AP-2507
    readonly selVehicleTypeSwitch: Locator;
    readonly hiddenDetails: Locator;
    readonly scriptsFromBuild: Locator;
    // AP-2533 (verified on Dev 2026-11-07, count 1 each)
    readonly lblVehicleType: Locator;
    readonly dpdVehicleType: Locator;
    readonly lblSavedBanner: Locator;

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
        this.selVehicleTypeSwitch = page.locator('#vehicle_type_switch');
        this.hiddenDetails = this.frmQuoteVehicle.locator('input[type="hidden"][name^="quote_vehicle["]');
        this.scriptsFromBuild = page.locator('script[src^="/build/"]');
        this.lblVehicleType = this.frmQuoteVehicle.locator('label[for="vehicle_type_switch"]');
        this.dpdVehicleType = page.locator("//form[@name='quote_vehicle']//div[*[@for='vehicle_type_switch']]/div");
        this.lblSavedBanner = page.locator('main [role="alert"]', { hasText: 'Vehicle saved' });
    }

    // ── AP-2533 ──────────────────────────────────────────────────────────────

    /** Every option of the "Vehicle type" select: code, label, the URL it navigates to, and whether it is chosen. */
    async vehicleTypeOptions(): Promise<{ value: string; label: string; url: string; selected: boolean }[]> {
        return this.selVehicleTypeSwitch.locator('option').evaluateAll(els => els.map(e => ({
            value: (e as HTMLOptionElement).value,
            label: (e.textContent ?? '').trim(),
            url: e.getAttribute('data-url') ?? '',
            selected: (e as HTMLOptionElement).selected,
        })));
    }

    /** Chooses a type in the "Vehicle type" Bootstrap-select; the page then navigates to that type's form. */
    async chooseVehicleTypeInSelect(label: string): Promise<void> {
        await selectDropdownOption(this.dpdVehicleType, label);
    }

    /** Whether the "Vehicle type" select comes before the Quote name field in the page structure. */
    async vehicleTypeComesBeforeQuoteName(): Promise<boolean> {
        return this.selVehicleTypeSwitch.evaluate(s => {
            const name = document.querySelector('#quote_vehicle_quote_name');
            return !!name && !!(s.compareDocumentPosition(name) & Node.DOCUMENT_POSITION_FOLLOWING);
        });
    }

    /** On-screen boxes of the visible "Vehicle type" control and of the Quote name field. */
    async vehicleTypeAndQuoteNameBoxes(): Promise<{ type: { x: number; y: number; height: number } | null;
        name: { x: number; y: number; height: number } | null }> {
        return { type: await this.dpdVehicleType.boundingBox(), name: await this.txtQuoteName.boundingBox() };
    }

    /**
     * Clicks "Décoder" on whichever type's form is open and waits until the form is re-rendered:
     * the decoder posts to the current form URL and replaces the whole `quote_vehicle` form, so the
     * form is marked first and the mark's disappearance shows the re-render. Returns the post.
     */
    async decodeOnCurrentForm(): Promise<Response> {
        const path = new URL(this.page.url()).pathname;
        await this.frmQuoteVehicle.evaluate(f => f.setAttribute('data-qa-before-decode', '1'));
        const post = this.page.waitForResponse(r => r.request().method() === 'POST'
            && new URL(r.url()).pathname === path);
        await this.btnDecoder.click();
        const response = await post;
        await this.page.locator('form[name="quote_vehicle"][data-qa-before-decode]').waitFor({ state: 'detached' });
        await this.frmQuoteVehicle.waitFor();
        return response;
    }

    /** Title shown by a Bootstrap-select (Brand / Model): the chosen label, or the "Choose" placeholder. */
    async dropdownShown(dropdown: Locator): Promise<string> {
        return ((await dropdown.locator('button').getAttribute('title')) ?? '').trim();
    }

    /** Texts of the validation messages shown in the form. */
    async formErrorTexts(): Promise<string[]> {
        return (await this.frmQuoteVehicle.locator('.form-error-message').allInnerTexts()).map(t => t.replace(/\s+/g, ' ').trim());
    }

    /** Label of the type chosen in the "Vehicle type" select (Bootstrap-select keeps the native select). */
    async vehicleTypeShown(): Promise<string> {
        return (await this.selVehicleTypeSwitch.locator('option:checked').innerText()).trim();
    }

    async fillVin(vin: string): Promise<void> {
        await this.txtVin.fill(vin);
    }

    /** Clicks "Décoder" and returns the decoder's AJAX post (it re-renders the form in place). */
    async decode(): Promise<Response> {
        const post = this.page.waitForResponse(r => r.request().method() === 'POST'
            && /\/quote\/new\/edit-vehicle$/.test(new URL(r.url()).pathname));
        await this.btnDecoder.click();
        return post;
    }

    /** `name=value` of every hidden `quote_vehicle[...]` input; the CSRF token value is masked. */
    async hiddenDetailValues(): Promise<Record<string, string>> {
        return this.hiddenDetails.evaluateAll(els => Object.fromEntries(els.map(e => {
            const name = e.getAttribute('name') ?? '';
            return [name, name.endsWith('[_token]') ? '***' : (e as HTMLInputElement).value];
        })));
    }

    /** `src` of each application script the page loads from /build/ (the bundle hash changes per deploy). */
    async buildScriptSources(): Promise<string[]> {
        return this.scriptsFromBuild.evaluateAll(els => els.map(e => e.getAttribute('src') ?? ''));
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
