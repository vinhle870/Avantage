import { Locator, Page, Response } from '@playwright/test';

export type VehicleTab = 'Details' | 'Window sticker' | 'Quotes';

/** Last path segment of each tab of /vehicle/{id}/… (used only to find the tab link, never to wait on a URL). */
export const VEHICLE_TAB_PATH: Record<VehicleTab, string> = {
    'Details': 'details',
    'Window sticker': 'window-sticker',
    'Quotes': 'quotes',
};

/**
 * Dealer vehicle details page (/vehicle/{id}/details) with its three tabs, its two header actions
 * ("Edit vehicle" modal, "Create quote" → client form) and the Inventory list (/vehicle/inventory) it is
 * opened from — added for AP-2495.
 * Locators verified on Dev (v2dev) 2026-11-04 on vehicle 915, each matching exactly one element
 * (rows and tabs are scoped before use). None depends on the UI language (English or French).
 * Added in its own file so the QA's VehicleInventoryPage / DealerQuoteRecordPage stay untouched.
 * Read-only: nothing here clicks a Save button.
 * Navigation waits never filter on a route: a click waits for the next main-frame document response
 * (redirects skipped), whatever its URL.
 */
export class VehicleDetailsPage {
    private readonly page: Page;

    // /vehicle/{id}/<tab>
    readonly lblHeading: Locator;          // "Vehicle VIN:<VIN>"
    readonly lblSummary: Locator;          // Details tab: "<Brand Model Year> VIN: … Mileage: … Designation: …"
    readonly lstTabs: Locator;
    readonly lnkActiveTab: Locator;
    readonly lblTabHeading: Locator;       // Details / Window sticker tab heading
    readonly frmWindowSticker: Locator;
    readonly rowsVehicleQuotes: Locator;   // Quotes tab
    readonly lnkEditVehicle: Locator;
    readonly lnkCreateQuote: Locator;
    readonly lblBody: Locator;

    // "Edit vehicle" modal (loaded over the details page)
    readonly mdlEditVehicle: Locator;
    readonly lblEditVehicleTitle: Locator; // "Vehicle #<id>"
    readonly frmEditVehicle: Locator;
    readonly txtEditVehicleVin: Locator;

    // Page opened by "Create quote"
    readonly frmVisibleInMain: Locator;    // any visible form — the hard check
    readonly frmQuoteClient: Locator;      // recorded only
    readonly crdQuoteVehicle: Locator;     // recorded only

    // /vehicle/inventory
    readonly rowsInventory: Locator;
    readonly lnkInventoryPages: Locator;

    constructor(page: Page) {
        this.page = page;

        this.lblHeading = page.locator('main nav h1');
        this.lblSummary = page.locator('main .card-body p').first();
        this.lstTabs = page.locator('main ul.nav-tabs');
        this.lnkActiveTab = this.lstTabs.locator('a.nav-link.active');
        this.lblTabHeading = page.locator('main h3');
        this.frmWindowSticker = page.locator('main form[name="window_sticker"]');
        this.rowsVehicleQuotes = page.locator('main table tbody tr');
        this.lnkEditVehicle = page.locator('main nav a[href$="/edit"]');
        this.lnkCreateQuote = page.locator('main nav a[href^="/quote/new/client?fromVehicleId="]');
        this.lblBody = page.locator('body');

        this.mdlEditVehicle = page.locator('#myModal.show');
        this.lblEditVehicleTitle = this.mdlEditVehicle.locator('h1');
        this.frmEditVehicle = this.mdlEditVehicle.locator('form[name="vehicle"]');
        this.txtEditVehicleVin = this.mdlEditVehicle.locator('#vehicle_VIN');

        this.frmVisibleInMain = page.locator('main form').filter({ visible: true }).first();
        this.frmQuoteClient = page.locator('main form[name="quote_client"]');
        this.crdQuoteVehicle = page.locator('aside #timeline');

        this.rowsInventory = page.locator('main table tbody tr');
        this.lnkInventoryPages = page.locator('main .pagination a[href*="page="]');
    }

    /** Opens a vehicle page by URL; returns the main document response (null when none). */
    async openVehiclePage(vehicleId: number, tab: VehicleTab = 'Details'): Promise<Response | null> {
        return this.page.goto(`/vehicle/${vehicleId}/${VEHICLE_TAB_PATH[tab]}`);
    }

    tab(tab: VehicleTab): Locator {
        return this.lstTabs.locator(`a.nav-link[href$="/${VEHICLE_TAB_PATH[tab]}"]`);
    }

    /**
     * Clicks an element that navigates the page and returns the main-frame document response that ends
     * the navigation (3xx redirects skipped), with no filter on its URL. Resolves once the new document
     * has reached DOMContentLoaded.
     */
    async clickAndWaitForNavigation(target: Locator): Promise<Response> {
        const main = this.page.mainFrame();
        const [response] = await Promise.all([
            this.page.waitForResponse(r => r.request().isNavigationRequest() && r.frame() === main
                && (r.status() < 300 || r.status() >= 400)),
            this.page.waitForEvent('framenavigated', f => f === main),
            target.click(),
        ]);
        await this.page.waitForLoadState('domcontentloaded');
        return response;
    }

    /** Clicks a tab and returns the response of the page it navigates to. */
    async clickTab(tab: VehicleTab): Promise<Response> {
        return this.clickAndWaitForNavigation(this.tab(tab));
    }

    /** Clicks "Create quote" and returns the response of the page it opens. Nothing is filled in. */
    async clickCreateQuote(): Promise<Response> {
        return this.clickAndWaitForNavigation(this.lnkCreateQuote);
    }

    /** Clicks "Edit vehicle" (the modal loads over the page, no navigation). Nothing is saved. */
    async clickEditVehicle(): Promise<void> {
        await this.lnkEditVehicle.click();
    }

    /** The edit modal has no Cancel / × button: Escape closes it without submitting the form. */
    async closeEditVehicleModal(): Promise<void> {
        await this.page.keyboard.press('Escape');
    }

    async goBack(): Promise<Response | null> {
        return this.page.goBack();
    }

    async openInventoryPage(pageNo: number): Promise<Response | null> {
        return this.page.goto(pageNo === 1 ? '/vehicle/inventory' : `/vehicle/inventory?page=${pageNo}`);
    }

    /** Inventory row of one vehicle id (its cells carry data-href="/vehicle/{id}/details"). */
    inventoryRowById(vehicleId: number): Locator {
        return this.rowsInventory.filter({ has: this.page.locator(`td[data-href="/vehicle/${vehicleId}/details"]`) });
    }

    /** VIN cell (2nd cell) of a row — clickable, navigates to its data-href. */
    vinCell(row: Locator): Locator {
        return row.locator('td').nth(1);
    }

    /** Vehicle id and VIN of every row of the current Inventory page, top to bottom. */
    async readInventoryRows(): Promise<{ id: number; vin: string }[]> {
        const rows = await this.rowsInventory.all();
        const out: { id: number; vin: string }[] = [];
        for (const row of rows) {
            const href = await row.locator('td[data-href]').first().getAttribute('data-href');
            const vin = (await this.vinCell(row).innerText()).trim();
            out.push({ id: Number(/\/vehicle\/(\d+)\/details/.exec(href ?? '')?.[1] ?? NaN), vin });
        }
        return out;
    }

    /**
     * Highest page number linked from the Inventory pagination (any link carrying page=N, so it does not
     * depend on the "Last" / "Dernière" label); 1 when there is no pagination.
     */
    async inventoryLastPage(): Promise<{ lastPage: number; links: number }> {
        const links = await this.lnkInventoryPages.all();
        let lastPage = 1;
        for (const link of links) {
            const n = Number(/[?&]page=(\d+)/.exec(await link.getAttribute('href') ?? '')?.[1] ?? 1);
            if (n > lastPage) lastPage = n;
        }
        return { lastPage, links: links.length };
    }

    currentPath(): string {
        return new URL(this.page.url()).pathname;
    }
}
