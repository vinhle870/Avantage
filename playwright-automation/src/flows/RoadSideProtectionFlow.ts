import { expect, Page, test } from '@playwright/test';
import { config } from '../data/config';
import { QuoteProductSummaryPage } from '../pages/dealerPortal/QuoteProductSummaryPage';
import { RoadSideProtectionPage } from '../pages/dealerPortal/RoadSideProtectionPage';

const origin = (url: string): string => new URL(url).origin;

/** A tier option ends with its price in dollars, e.g. "… | 12 months | 200$" or "… | 445.5$". */
export const PRICE_AT_END = /\|\s*\d+(?:[.,]\d+)?\s*\$\*?\s*$/;

/**
 * AutoShield products on the quote's Road side protection page (AP-2225, REQ-001).
 * Added in its own file so the QA's uncommitted AdminFlow.ts / DealerFlow.ts are left untouched.
 * The login stays in DealerFlow.loginToDealerPortal().
 * Read-only: opens an existing quote and its Road side protection page; never presses "Save",
 * "Generate Contract" or any other button that creates an AutoShield quote or contract.
 */
export class RoadSideProtectionFlow {
    private readonly roadSide: RoadSideProtectionPage;

    constructor(private readonly page: Page) {
        this.roadSide = new RoadSideProtectionPage(page);
    }

    private dealerUrl(path: string): string {
        return `${origin(config.dealerPortalUrl)}${path}`;
    }

    /** Step 1: the newest quote on /quotes that has a vehicle with a VIN; its hub opens. Returns the quote id. */
    async openNewestQuoteWithVehicle(): Promise<string> {
        return test.step('Dealer opens the newest quote that has a vehicle with a VIN', async () => {
            await this.roadSide.open(this.dealerUrl('/quotes'));
            await expect(this.roadSide.lblHeading, 'Quotes list').toHaveText('Quotes');
            await expect(this.roadSide.quoteRowsWithVin.first(), 'A quote with a vehicle VIN is listed on page 1').toBeVisible();
            const href = await this.roadSide.readNewestQuoteWithVinHref();
            const id = href.match(/^\/quote\/(\d+)\/details$/)?.[1] ?? '';
            expect(id, `Quote id read from "${href}"`).not.toBe('');

            await this.roadSide.open(this.dealerUrl(href));
            await expect(this.roadSide.lblHeading, 'Quote hub heading').toContainText(`#${id}`);
            test.info().annotations.push({ type: 'Quote', description: id });
            return id;
        });
    }

    /** Step 2: the hub links to /quote/{id}/road-side-protection, and that page opens with its heading and no error. */
    async openRoadSideProtection(quoteId: string): Promise<void> {
        await test.step(`Dealer opens the Road side protection page of quote ${quoteId}`, async () => {
            const path = `/quote/${quoteId}/road-side-protection`;
            await expect(this.roadSide.lnkRoadSideProtection(quoteId), 'Hub links to the Road side protection page').toHaveCount(1);

            const response = await this.page.goto(this.dealerUrl(path));
            expect(response?.status() ?? 0, `HTTP status of ${path}`).toBeLessThan(400);
            await expect(this.roadSide.lblHeading, 'Road side protection heading').toHaveText('Road Side protection program');
            await expect(this.roadSide.alertError, 'No error message').toHaveCount(0);
            await expect(this.roadSide.frmAutoShield, 'AutoShield form is shown').toBeVisible();
        });
    }

    /** Step 3: at least one AutoShield product option is listed, and every option shows a price in dollars. */
    async verifyProductsListedWithPrices(): Promise<void> {
        await test.step('Every AutoShield product option shows a price in dollars', async () => {
            await expect(this.roadSide.radTiers.first(), 'At least one AutoShield option').toBeVisible();
            const labels = await this.roadSide.readTierLabels();
            expect(labels.length, 'One label per option').toBe(await this.roadSide.radTiers.count());
            test.info().annotations.push({ type: 'AutoShield options (Q-008, record only)', description: labels.join(' || ') });
            for (const label of labels) {
                expect(label, `Option "${label}" ends with a dollar price`).toMatch(PRICE_AT_END);
            }
        });
    }

    // ── AP-2498: the vehicle form of the add-roadside-protection modal ──────────
    // Read-only on the modal: these methods never click "Continue" (a Continue creates the quote's
    // roadside row), "Save" or "Generate Contract". Nothing here asserts the notice text (AP-2523), the
    // folded form (AP-2524) or the VIN's required state (AP-2525) — those cases FAILED manually.

    /** Clicks "+" on the quote's "Roadside Protection" row ("- None Selected -"); the modal opens on the quote page. */
    async openRoadSideModal(quoteId: string): Promise<void> {
        await test.step(`Dealer clicks "+" on the Roadside Protection row of quote ${quoteId}`, async () => {
            const summary = new QuoteProductSummaryPage(this.page);
            expect(await summary.readRowAmount('roadside'), 'Roadside Protection row before').toBe('- None Selected -');
            const loaded = this.page.waitForResponse(r =>
                r.url().endsWith(`/quote/${quoteId}/road-side-protection`) && r.request().method() === 'GET');
            await summary.clickRowAdd('roadside');
            expect((await loaded).status(), 'GET road-side-protection HTTP status').toBeLessThan(400);
            await expect(this.roadSide.mdlOpen, 'Modal open').toHaveCount(1);
            await expect(this.roadSide.frmRsVehicle, 'Roadside vehicle form in the modal').toHaveCount(1);
            await expect(this.page, 'Still on the quote page').toHaveURL(new RegExp(`/quote/${quoteId}/details`));
            await expect(summary.lblErrorText, 'No error page').toHaveCount(0);
        });
    }

    /** AP2498_007 step 3: the Make list holds at least one real make. Returns the makes. */
    async verifyMakeListFilled(): Promise<string[]> {
        return test.step('VERIFICATION POINT: the Make list holds at least one real make', async () => {
            const makes = await this.roadSide.readRealOptionTexts(this.roadSide.selRsMake);
            expect(makes.length, 'Real makes besides the placeholder').toBeGreaterThan(0);
            test.info().annotations.push({
                type: 'Makes (Q-006, record only)', description: `${makes.length}: ${makes.slice(0, 10).join(', ')} …`,
            });
            return makes;
        });
    }

    /** Chooses a Make, waits for the Model list it loads (GET …/get-models) and returns that list (at least one model). */
    async chooseMakeAndReadModels(quoteId: string, make: string): Promise<string[]> {
        return test.step(`Dealer chooses Make ${make}; the Model list is reloaded`, async () => {
            const loaded = this.page.waitForResponse(r =>
                r.url().includes(`/quote/${quoteId}/road-side-protection/get-models`) && r.request().method() === 'GET');
            await this.roadSide.chooseRsMake(make);
            expect((await loaded).status(), 'get-models HTTP status').toBeLessThan(400);
            await expect.poll(() => this.roadSide.readRealOptionTexts(this.roadSide.selRsModel),
                { message: `Models of ${make}` }).not.toHaveLength(0);
            const models = await this.roadSide.readRealOptionTexts(this.roadSide.selRsModel);
            test.info().annotations.push({ type: `Models of ${make}`, description: `${models.length}: ${models.join(', ')}` });
            return models;
        });
    }

    async chooseModel(model: string): Promise<void> {
        await test.step(`Dealer chooses Model ${model}`, async () => {
            await this.roadSide.chooseRsModel(model);
            expect(await this.roadSide.readSelectedText(this.roadSide.selRsModel), 'Model selected').toBe(model);
        });
    }

    /** Q-007, record only: which Model is selected after the Make changed. */
    async recordModelAfterMakeChange(): Promise<void> {
        const selected = await this.roadSide.readSelectedText(this.roadSide.selRsModel);
        test.info().annotations.push({ type: 'Model after the Make change (Q-007, record only)', description: selected });
    }

    /** AP2498_007 step 5: the second Make's models differ from the first's and do not hold the Model chosen first. */
    async verifyModelListFollowsMake(firstModels: string[], secondModels: string[], firstModel: string): Promise<void> {
        await test.step(`VERIFICATION POINT: the second Model list differs and has no "${firstModel}"`, async () => {
            expect(secondModels, 'Model list after the Make change').not.toEqual(firstModels);
            expect(secondModels, `Second Make's models`).not.toContain(firstModel);
        });
    }

    /** AP2498_008 step 4: VIN and Year show the vehicle's; Make/Model show a placeholder or the vehicle's own. */
    async verifyPrefillFromVehicle(vin: string, year: string, make: string, model: string): Promise<void> {
        await test.step(`VERIFICATION POINT: the form shows VIN ${vin} and Year ${year}`, async () => {
            await expect(this.roadSide.txtRsVin, 'VIN').toHaveValue(vin);
            await expect(this.roadSide.txtRsYear, 'Year').toHaveValue(year);
            const shownMake = await this.roadSide.readSelectedText(this.roadSide.selRsMake);
            const shownModel = await this.roadSide.readSelectedText(this.roadSide.selRsModel);
            expect(['Choose', 'Choice', make], 'Make: placeholder or the vehicle\'s').toContain(shownMake);
            expect(['Choose', 'Choice', model], 'Model: placeholder or the vehicle\'s').toContain(shownModel);
            test.info().annotations.push({ type: 'Make / Model shown (Q-009, record only)', description: `${shownMake} / ${shownModel}` });
        });
    }
}
