import { expect, Locator, Page, Response, test } from '@playwright/test';
import { VehicleDetailsPage, VehicleTab, VEHICLE_TAB_PATH } from '../pages/dealerPortal/VehicleDetailsPage';

export type Vehicle = { id: number; vin: string };

/** Texts that mean the AP-2495 defect (or the generic server error page) is back. */
const ERROR_TEXTS = [/Too few arguments to function/i, /difficultés techniques/i];

/**
 * Dealer vehicle details page — AP-2495 ("Cannot view vehicle detail's page", PHP "Too few arguments to
 * function BaseController::__construct()" raised in Vehicle/TabsTrait.php), Dev (v2dev).
 * Added in its own file so the QA's uncommitted DealerFlow.ts is left untouched; the login stays in
 * DealerFlow.loginToDealerPortal().
 * Read-only: every method only opens pages, clicks tabs and header links, and closes the edit modal with
 * Escape. No form is filled in or saved, no quote or vehicle is created.
 *
 * What fails a test (AP2495_TestCases_001-004.md judges only objective faults):
 *  - an HTTP 5xx — on each page request, and on any response of the test (collector, verifyNoServerError);
 *  - either error text ("Too few arguments to function", "difficultés techniques") on any page;
 *  - the details summary not showing the vehicle's VIN (V, or the Inventory row it was opened from);
 *  - no form visible after "Create quote"; the Edit vehicle modal not visible;
 *  - V's summary changed at the end of AP2495_004.
 * Everything else — URLs, HTTP statuses below 500, tab labels and content, a missing tab, the quote page's
 * Vehicle card, the edit modal's title and VIN field — is recorded with test.info().annotations, not judged.
 * No assertion depends on the UI language.
 */
export class VehicleDetailsFlow {
    readonly vehicle: VehicleDetailsPage;
    private readonly serverErrors: string[] = [];

    constructor(private readonly page: Page) {
        this.vehicle = new VehicleDetailsPage(page);
        page.on('response', r => {
            if (r.status() >= 500) this.serverErrors.push(`${r.status()} ${r.request().method()} ${r.url()}`);
        });
    }

    // ── Shared checks and records ───────────────────────────────────────────

    private record(type: string, description: string): void {
        test.info().annotations.push({ type, description });
    }

    private expectNot5xx(response: Response | null, label: string): void {
        expect(response, `${label}: a response was received`).not.toBeNull();
        expect(response!.status(), `${label}: HTTP status (5xx = the AP-2495 defect)`).toBeLessThan(500);
    }

    /** Hard: the page request is not 5xx. Recorded: its URL and status. */
    private checkPageRequest(response: Response | null, label: string): void {
        this.expectNot5xx(response, label);
        this.record(label, `HTTP ${response!.status()} — ${this.page.url()}`);
    }

    /** Neither "Too few arguments to function" nor the French "difficultés techniques" error page is shown. */
    async verifyNoErrorText(label: string): Promise<void> {
        for (const text of ERROR_TEXTS) {
            await expect(this.vehicle.lblBody, `${label}: error text ${text}`).not.toContainText(text);
        }
    }

    /** No response of the whole test answered HTTP 5xx. */
    verifyNoServerError(): void {
        expect(this.serverErrors, 'Responses with HTTP 5xx during the test').toEqual([]);
    }

    private async textOrNone(locator: Locator): Promise<string> {
        return await locator.count() > 0 ? (await locator.first().innerText()).replace(/\s+/g, ' ').trim() : '(none)';
    }

    // ── Vehicle under test V ────────────────────────────────────────────────

    /**
     * Vehicle V per the test cases' Execution Context: the hinted vehicle (915) when /vehicle/915/details
     * answers; on a 404 / "not found" page, the vehicle whose Inventory row carries the VIN; else the
     * Vehicle B rule. A 5xx or error text is never a fallback trigger — it fails here as the defect.
     */
    async resolveVehicleV(hint: Vehicle, reservedIds: Set<number>): Promise<Vehicle> {
        return test.step(`Resolve vehicle V (default ${hint.id}, VIN ${hint.vin})`, async () => {
            const response = await this.vehicle.openVehiclePage(hint.id);
            this.expectNot5xx(response, `/vehicle/${hint.id}/details`);
            await this.verifyNoErrorText(`/vehicle/${hint.id}/details`);
            const notFound = response!.status() === 404
                || /not found|introuvable/i.test(await this.vehicle.lblBody.innerText());
            if (!notFound) {
                this.record('Vehicle V', `${hint.id} (VIN ${hint.vin}) — default, HTTP ${response!.status()}`);
                return hint;
            }

            const found = await this.findInventoryRowByVin(hint.vin, false);
            if (found) {
                this.record('Vehicle V', `${found.vehicle.id} (VIN ${found.vehicle.vin}) — fallback: ${hint.id} answered not found, VIN found in the Inventory`);
                return found.vehicle;
            }
            const b = await this.pickVehicleB(new Set([hint.id, ...reservedIds]));
            if (!b) throw new Error(`Vehicle ${hint.id} not found, VIN ${hint.vin} not in the Inventory, and no Inventory row qualifies as a fallback`);
            this.record('Vehicle V', `${b.id} (VIN ${b.vin}) — fallback: ${hint.id} not found, VIN not in the Inventory, Vehicle B rule`);
            return b;
        });
    }

    // ── Details page and tabs (AP2495_001, _002) ───────────────────────────

    async openVehicleDetails(v: Vehicle): Promise<string> {
        return test.step(`Dealer opens /vehicle/${v.id}/details by URL`, async () => {
            const response = await this.vehicle.openVehiclePage(v.id);
            this.checkPageRequest(response, `Open /vehicle/${v.id}/details`);
            return this.verifyDetailsPage(v, 'Details page');
        });
    }

    /**
     * Hard: no error text, the summary shows the VIN. Recorded: URL and heading.
     * Returns the summary text (for the "unchanged" check).
     */
    async verifyDetailsPage(v: Vehicle, label: string): Promise<string> {
        return test.step(`${label} of vehicle ${v.id} shows VIN ${v.vin} and no error`, async () => {
            await this.verifyNoErrorText(label);
            await expect(this.vehicle.lblSummary, `${label}: vehicle summary shows VIN ${v.vin}`).toContainText(v.vin);
            this.record(`${label} — URL`, this.page.url());
            this.record(`${label} — heading`, await this.textOrNone(this.vehicle.lblHeading));
            return (await this.vehicle.lblSummary.innerText()).trim();
        });
    }

    /** A tab missing from the page is recorded and skipped (the ticket does not list the tabs). */
    async clickTab(v: Vehicle, tab: VehicleTab): Promise<void> {
        await test.step(`Dealer clicks the "${tab}" tab of vehicle ${v.id}`, async () => {
            if (await this.vehicle.tab(tab).count() === 0) {
                this.record(`Tab "${tab}"`, `missing — no tab link ending in /${VEHICLE_TAB_PATH[tab]} on the page; not judged`);
                return;
            }
            const response = await this.vehicle.clickTab(tab);
            this.expectNot5xx(response, `"${tab}" tab`);
            await this.verifyNoErrorText(`"${tab}" tab`);

            let content: string;
            switch (tab) {
                case 'Details':
                    await expect(this.vehicle.lblSummary, 'Details tab: vehicle summary shows the VIN').toContainText(v.vin);
                    content = `summary "${(await this.vehicle.lblSummary.innerText()).replace(/\s+/g, ' ').trim()}"`;
                    break;
                case 'Window sticker':
                    content = `heading "${await this.textOrNone(this.vehicle.lblTabHeading)}", `
                        + `window_sticker form ${await this.vehicle.frmWindowSticker.count() > 0 ? 'shown' : 'absent'}`;
                    break;
                case 'Quotes':
                    content = `${await this.vehicle.rowsVehicleQuotes.count()} quote row(s) listed`;
                    break;
            }
            this.record(`Tab "${tab}"`, `HTTP ${response.status()} — ${this.page.url()} — label "${await this.textOrNone(this.vehicle.lnkActiveTab)}" — ${content}`);
        });
    }

    // ── Inventory (AP2495_003) ─────────────────────────────────────────────

    async openInventory(pageNo = 1): Promise<void> {
        await test.step(`Dealer opens the Inventory list, page ${pageNo}`, async () => {
            const response = await this.vehicle.openInventoryPage(pageNo);
            this.expectNot5xx(response, `/vehicle/inventory page ${pageNo}`);
            await this.verifyNoErrorText(`/vehicle/inventory page ${pageNo}`);
        });
    }

    /**
     * Walks the Inventory read-only, page by page up to the last page, until the row with this VIN is shown
     * (the list has no search box). When `id` is given, only the row with that id counts: the Dev inventory
     * holds more than one vehicle with VIN 1FAHP35NX8W239204 (915 and 1081 on 2026-11-04). Leaves the
     * browser on that page. Returns null when absent and `required` is false.
     */
    async findInventoryRowByVin(vin: string, required = true, id?: number): Promise<{ vehicle: Vehicle; pageNo: number } | null> {
        return test.step(`Dealer finds VIN ${vin}${id ? ` (vehicle ${id})` : ''} in the Inventory list`, async () => {
            for (let p = 1; ; p++) {
                await this.openInventory(p);
                const row = (await this.vehicle.readInventoryRows()).find(r => r.vin === vin && (id === undefined || r.id === id));
                const { lastPage, links } = await this.vehicle.inventoryLastPage();
                if (row) {
                    this.record('Vehicle A in the Inventory', `${row.id} (VIN ${row.vin}) on page ${p} of ${lastPage} (${links} pagination links)`);
                    return { vehicle: row, pageNo: p };
                }
                if (p >= lastPage) {
                    if (required) throw new Error(`VIN ${vin}${id ? ` (vehicle ${id})` : ''} is not on any of the ${lastPage} Inventory pages`);
                    return null;
                }
            }
        });
    }

    /**
     * Vehicle B rule: the first Inventory row, read from page 1 up to the last page, whose id is not
     * excluded (rule of the test cases — no page cap).
     */
    async pickVehicleB(excluded: Set<number>): Promise<Vehicle | null> {
        return test.step('Dealer picks Vehicle B — first Inventory row not 915, not V, not reserved', async () => {
            for (let p = 1; ; p++) {
                await this.openInventory(p);
                const row = (await this.vehicle.readInventoryRows()).find(r => !Number.isNaN(r.id) && !excluded.has(r.id));
                if (row) {
                    this.record('Vehicle B', `${row.id} (VIN ${row.vin}) — Inventory page ${p}`);
                    return row;
                }
                if (p >= (await this.vehicle.inventoryLastPage()).lastPage) {
                    this.record('Vehicle B', `none — no row on any of the ${p} Inventory pages qualifies`);
                    return null;
                }
            }
        });
    }

    /** On the current Inventory page, clicks the VIN cell of the vehicle's row; its details page must show that row's VIN. */
    async openFromInventoryRow(v: Vehicle): Promise<void> {
        await test.step(`Dealer clicks the Inventory row of vehicle ${v.id}`, async () => {
            const row = this.vehicle.inventoryRowById(v.id);
            await expect(row, `Inventory row of vehicle ${v.id}`).toHaveCount(1);
            const rowVin = (await this.vehicle.vinCell(row).innerText()).trim();
            const response = await this.vehicle.clickAndWaitForNavigation(this.vehicle.vinCell(row));
            this.checkPageRequest(response, `Inventory row ${v.id} (VIN ${rowVin}) clicked`);
            await this.verifyDetailsPage({ id: v.id, vin: rowVin }, `Details page from the Inventory row of ${v.id}`);
        });
    }

    // ── Header actions (AP2495_004) ────────────────────────────────────────

    async openCreateQuoteForm(v: Vehicle): Promise<void> {
        await test.step(`Dealer clicks "Create quote" on vehicle ${v.id} — nothing is filled in`, async () => {
            const response = await this.vehicle.clickCreateQuote();
            this.expectNot5xx(response, 'Create quote');
            await this.verifyNoErrorText('Create quote');
            await expect(this.vehicle.frmVisibleInMain, 'A form is shown after "Create quote"').toBeVisible();

            const expected = `/quote/new/client?fromVehicleId=${v.id}`;
            const url = new URL(this.page.url());
            const actual = url.pathname + url.search;
            this.record('Create quote — URL', `HTTP ${response.status()} — ${actual}${actual === expected ? ' (as documented)' : ` (differs from documented ${expected})`}`);
            this.record('Create quote — form', `quote_client form ${await this.vehicle.frmQuoteClient.count() > 0 ? 'shown' : 'absent'}`);
            const card = await this.textOrNone(this.vehicle.crdQuoteVehicle);
            this.record('Create quote — Vehicle card', card.includes(v.vin) ? `shown with VIN ${v.vin}` : `VIN ${v.vin} not found in the sidebar card (text: ${card.slice(0, 200)})`);
        });
    }

    async goBackToDetails(v: Vehicle): Promise<void> {
        await test.step(`Dealer uses the browser Back button to return to vehicle ${v.id}`, async () => {
            const response = await this.vehicle.goBack();
            if (response) this.expectNot5xx(response, 'Back to the details page');
            await this.page.waitForLoadState('domcontentloaded');
            await this.verifyDetailsPage(v, 'Details page after Back');
        });
    }

    /** Hard: the modal is visible, no error text, no 5xx (collector). Recorded: requests, title, form, VIN field. */
    async openEditVehicleModal(v: Vehicle): Promise<void> {
        await test.step(`Dealer clicks "Edit vehicle" on vehicle ${v.id} — nothing is changed`, async () => {
            const seen: Response[] = [];
            const onResponse = (r: Response) => {
                if (['document', 'xhr', 'fetch'].includes(r.request().resourceType())) seen.push(r);
            };
            this.page.on('response', onResponse);
            try {
                await this.vehicle.clickEditVehicle();
                await expect(this.vehicle.mdlEditVehicle, 'Edit vehicle modal').toBeVisible();
                await this.vehicle.frmEditVehicle.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => undefined);
            } finally {
                this.page.off('response', onResponse);
            }
            for (const r of seen) this.expectNot5xx(r, `Edit vehicle: ${r.request().method()} ${r.url()}`);
            await this.verifyNoErrorText('Edit vehicle modal');

            this.record('Edit vehicle — requests', seen.length
                ? seen.map(r => `${r.request().method()} ${new URL(r.url()).pathname} → HTTP ${r.status()}`).join('; ')
                : 'none recorded');
            this.record('Edit vehicle — URL', this.page.url());
            this.record('Edit vehicle — modal title', await this.textOrNone(this.vehicle.lblEditVehicleTitle));
            this.record('Edit vehicle — form', `vehicle form ${await this.vehicle.frmEditVehicle.count() > 0 ? 'shown' : 'absent'}`);
            this.record('Edit vehicle — VIN field', await this.vehicle.txtEditVehicleVin.count() > 0
                ? await this.vehicle.txtEditVehicleVin.inputValue() : '(no VIN field)');
        });
    }

    /** Escape closes the modal (it has no Cancel / ×); the form is never submitted. Recorded, not judged. */
    async closeEditVehicleModal(v: Vehicle): Promise<void> {
        await test.step('Dealer closes the Edit vehicle modal with Escape — Save is never clicked', async () => {
            await this.vehicle.closeEditVehicleModal();
            const closed = await this.vehicle.mdlEditVehicle.waitFor({ state: 'hidden', timeout: 10_000 })
                .then(() => true, () => false);
            this.record('Edit vehicle — closed with Escape', `${closed ? 'modal closed' : 'modal still shown'} — ${this.page.url()} (vehicle ${v.id})`);
        });
    }

    /** Hard: reloaded details page shows the VIN, no error, and the same summary as at the start. */
    async verifyVehicleUnchanged(v: Vehicle, summaryBefore: string): Promise<void> {
        await test.step(`Vehicle ${v.id} is unchanged after both actions`, async () => {
            const response = await this.vehicle.openVehiclePage(v.id);
            this.checkPageRequest(response, `Reload /vehicle/${v.id}/details`);
            const summaryAfter = await this.verifyDetailsPage(v, 'Details page at the end');
            expect(summaryAfter, 'Vehicle summary (brand, model, year, VIN, mileage, designation)').toBe(summaryBefore);
        });
    }
}
