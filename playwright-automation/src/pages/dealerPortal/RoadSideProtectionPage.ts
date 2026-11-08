import { Page, Locator } from '@playwright/test';
import { selectDropdownOption } from '../../core/utils/uiActions';

/**
 * Dealer quote list (/quotes), quote hub (/quote/{id}/details) and the quote's
 * "Road Side protection program" page (/quote/{id}/road-side-protection) — the AutoShield page of AP-2225.
 * Locators verified on v2dev, 2026-11-01 (AP-2225): heading, form and hub link each count 1;
 * the tier radios and their labels count 5 on quote 6451. No assertions here — see RoadSideProtectionFlow.
 * Read-only: this page object has no member for the "Save" button or any contract button.
 */
export class RoadSideProtectionPage {
    private page: Page;

    // Quote list
    readonly quoteRowsWithVin: Locator;

    // Shared
    readonly lblHeading: Locator;
    readonly alertError: Locator;

    // Road side protection page
    readonly frmAutoShield: Locator;
    readonly radTiers: Locator;
    readonly lblTiers: Locator;

    // Add-roadside-protection modal on the quote page (the "+" of the "Roadside Protection" row) — AP-2498.
    // Form `quote_auto_shield_make_model`: VIN, Make, Model, Year and Continue. Each locator counts 1 in the
    // open modal (#myModal.show), verified on v2dev 2026-11-02 on quote 6520. Never clicked here: Continue.
    readonly mdlOpen: Locator;
    readonly frmRsVehicle: Locator;
    readonly txtRsVin: Locator;
    readonly txtRsYear: Locator;
    readonly selRsMake: Locator;
    readonly selRsModel: Locator;
    readonly dpdRsMake: Locator;
    readonly dpdRsModel: Locator;
    readonly btnRsContinue: Locator;

    constructor(page: Page) {
        this.page = page;
        // Each /quotes row cell carries data-href="/quote/{id}/details"; keep rows whose Vehicle cell has a 17-character VIN
        this.quoteRowsWithVin = page.locator('tbody tr').filter({ hasText: /VIN:\s*[A-HJ-NPR-Z0-9]{17}/ });
        this.lblHeading = page.locator('h1');
        this.alertError = page.locator('.alert-danger');
        this.frmAutoShield = page.locator('form[name="quote_auto_shield"]');
        this.radTiers = page.locator('input[type="radio"][name="quote_auto_shield[selectedTier]"]');
        this.lblTiers = page.locator('label[for^="quote_auto_shield_selectedTier_"]');

        this.mdlOpen = page.locator('#myModal.show');
        this.frmRsVehicle = this.mdlOpen.locator('form[name="quote_auto_shield_make_model"]');
        this.txtRsVin = this.mdlOpen.locator('#quote_auto_shield_make_model_VIN');
        this.txtRsYear = this.mdlOpen.locator('#quote_auto_shield_make_model_vehicleYear');
        this.selRsMake = this.mdlOpen.locator('#quote_auto_shield_make_model_vehicleMake');
        this.selRsModel = this.mdlOpen.locator('#quote_auto_shield_make_model_vehicleModel');
        this.dpdRsMake = this.mdlOpen.locator('.form-group:has(> label[for="quote_auto_shield_make_model_vehicleMake"]) > .bootstrap-select');
        this.dpdRsModel = this.mdlOpen.locator('.form-group:has(> label[for="quote_auto_shield_make_model_vehicleModel"]) > .bootstrap-select');
        this.btnRsContinue = this.mdlOpen.locator('#quote_auto_shield_make_model_continue');
    }

    /** Text of the selected option of a hidden <select> (Make, Model); a placeholder reads "Choose" or "Choice". */
    async readSelectedText(select: Locator): Promise<string> {
        return (await select.locator('option:checked').textContent())?.trim() ?? '';
    }

    /** Labels of the real options of a hidden <select> — the placeholder (empty value) is left out. */
    async readRealOptionTexts(select: Locator): Promise<string[]> {
        return select.locator('option').evaluateAll(els => els
            .filter(e => (e as HTMLOptionElement).value !== '')
            .map(e => (e.textContent ?? '').trim()));
    }

    /** Make change fires GET /quote/{id}/road-side-protection/get-models and refills the Model list. */
    async chooseRsMake(optionText: string): Promise<void> {
        await selectDropdownOption(this.dpdRsMake, optionText);
    }

    async chooseRsModel(optionText: string): Promise<void> {
        await selectDropdownOption(this.dpdRsModel, optionText);
    }

    async open(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /** The quote hub's link to the Road side protection page (pencil of the "Roadside Protection" row). */
    lnkRoadSideProtection(quoteId: string): Locator {
        return this.page.locator(`a[href="/quote/${quoteId}/road-side-protection"]`);
    }

    /** "/quote/{id}/details" of the newest listed quote that has a vehicle with a VIN. */
    async readNewestQuoteWithVinHref(): Promise<string> {
        return (await this.quoteRowsWithVin.first().locator('td[data-href]').first().getAttribute('data-href')) || '';
    }

    /** The visible text of every tier option, e.g. "Protection Hasards PNEU + ROUE | Standard | 12 months | 200$". */
    async readTierLabels(): Promise<string[]> {
        return (await this.lblTiers.allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim());
    }
}
