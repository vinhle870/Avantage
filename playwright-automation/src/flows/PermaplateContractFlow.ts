import { expect, Page, test } from '@playwright/test';
import { config } from '../data/config';
import { PermaplateContractPage } from '../pages/dealerPortal/PermaplateContractPage';
import { AdminPermaplateOptionPage } from '../pages/adminPortal/AdminPermaplateOptionPage';

const origin = (url: string): string => new URL(url).origin;

/** Vehicle values the contract form must prefill (AP2428_003). */
export interface ContractVehicle {
    make: string;
    model: string;
    vin: string;
    odometer: string;
    /** ISO date as the date input holds it, e.g. "2026-11-01". */
    deliveryDate: string;
}

/** Program Summary values (AP2428_006). */
export interface ProgramSummary {
    term: string;
    startDate: string;
    endDate: string;
    options: string[];
}

/**
 * Dealer Permaplate ("Esthetic protection") contract — AP-2428.
 * Added in its own file so the QA's uncommitted AdminFlow.ts / DealerFlow.ts are left untouched; the logins
 * stay in DealerFlow.loginToDealerPortal() and AdminFlow.loginToAdminPortal().
 * Never submits a valid contract form: "Generate Contract" is clicked only with Last name and VIN blank,
 * which the server refuses, so no contract or invoice is created. The only write is the admin Dealer Cost
 * change of AP2428_014, which restoreDealerCost() undoes (call it from a finally block).
 */
export class PermaplateContractFlow {
    private readonly contract: PermaplateContractPage;
    private readonly option: AdminPermaplateOptionPage;

    constructor(private readonly page: Page) {
        this.contract = new PermaplateContractPage(page);
        this.option = new AdminPermaplateOptionPage(page);
    }

    private url(path: string): string {
        return `${origin(config.dealerPortalUrl)}${path}`;
    }

    /** The quote hub opens with "#{id}" in its heading. */
    async openQuoteDetails(quoteId: string): Promise<void> {
        await test.step(`Dealer opens quote ${quoteId}`, async () => {
            const response = await this.page.goto(this.url(`/quote/${quoteId}/details`));
            expect(response?.status() ?? 0, `HTTP status of /quote/${quoteId}/details`).toBeLessThan(400);
            await expect(this.contract.lblHeading, 'Quote hub heading').toContainText(`#${quoteId}`);
        });
    }

    /** Precondition guard: the quote has a saved Permaplate selection and no contract yet. */
    async verifyQuoteHasSelectionWithoutContract(quoteId: string): Promise<void> {
        await test.step(`Quote ${quoteId} has a Permaplate selection and no contract yet`, async () => {
            await expect(this.contract.lnkGenerateContract(quoteId),
                `Quote ${quoteId} must still offer Generate Contract — if a contract was made on it, pick another Dev quote with a Permaplate selection`)
                .toHaveCount(1);
            await expect(this.contract.lnkDownloadContract(quoteId), 'No contract PDF yet').toHaveCount(0);
        });
    }

    /** AP2428_001 step 4: ⋯ menu of the Esthetic protection row → "Generate Contract" opens the contract form. */
    async openContractFormFromRowMenu(quoteId: string): Promise<void> {
        await test.step('Dealer opens the contract form from the Esthetic protection row menu', async () => {
            await expect(this.contract.rowEstheticProtection(quoteId), 'Esthetic protection row').toContainText('Esthetic protection');
            await this.contract.openRowMenu(quoteId);
            await expect(this.contract.lnkGenerateContract(quoteId), 'Menu item label').toHaveText('Generate Contract');
            await expect(this.contract.lnkGenerateContract(quoteId), 'Menu item visible').toBeVisible();
            await this.contract.clickGenerateContractMenuItem(quoteId);
            await expect(this.page, 'Contract form URL').toHaveURL(new RegExp(`/quote/${quoteId}/permaplate-create-contract$`));
            await expect(this.contract.lblHeading, 'Contract form heading').toHaveText('Esthetic protection Contract');
            await expect(this.contract.alertError, 'No error message').toHaveCount(0);
        });
    }

    /** Opens /quote/{id}/permaplate-create-contract directly (same address as the menu item). */
    async openContractForm(quoteId: string): Promise<void> {
        await test.step(`Dealer opens the contract form of quote ${quoteId}`, async () => {
            const response = await this.page.goto(this.url(`/quote/${quoteId}/permaplate-create-contract`));
            expect(response?.status() ?? 0, 'HTTP status of the contract form').toBeLessThan(400);
            await expect(this.contract.lblHeading, 'Contract form heading').toHaveText('Esthetic protection Contract');
            await expect(this.contract.frmContract, 'Contract form').toBeVisible();
        });
    }

    /** AP2428_001 step 5: Vehicle, Owner and Program Summary sections and the "Generate Contract" button. */
    async verifyContractFormSections(): Promise<void> {
        await test.step('VERIFY: the contract form shows its three sections and the Generate Contract button', async () => {
            // The ticket says "Vehicle information"; the build titles it "Vehicle identification" (recorded at s4, not failed)
            await expect(this.contract.lblVehicleSection, 'Vehicle section').toBeVisible();
            await expect(this.contract.lblOwnerSection, 'Owner information section').toBeVisible();
            await expect(this.contract.lblProgramSummary, 'Program Summary section').toBeVisible();
            await expect(this.contract.btnGenerateContract, 'Generate Contract button').toHaveText(/Generate Contract/);
            await expect(this.contract.btnGenerateContract, 'Generate Contract button visible').toBeVisible();
        });
    }

    /** AP2428_002 step 2: the quote hub offers no control of this quote that creates or downloads a contract. */
    async verifyNoContractControl(quoteId: string): Promise<void> {
        await test.step(`VERIFY: quote ${quoteId} offers no contract control`, async () => {
            await expect(this.contract.lnkQuoteContractControls(quoteId), 'Contract links of this quote').toHaveCount(0);
        });
    }

    /**
     * AP2428_002 step 3 / AP2428_013 step 3: opening the form URL directly redirects to the quote hub without an
     * error page and without a form. `message` = the flash message expected, or null for a silent redirect.
     */
    async verifyContractFormUrlRedirects(quoteId: string, message: string | null): Promise<void> {
        await test.step(`VERIFY: /quote/${quoteId}/permaplate-create-contract redirects to the quote hub`, async () => {
            const response = await this.page.goto(this.url(`/quote/${quoteId}/permaplate-create-contract`));
            expect(response?.status() ?? 0, 'HTTP status after redirect (no error page)').toBeLessThan(400);
            await expect(this.page, 'Redirected to the quote hub').toHaveURL(new RegExp(`/quote/${quoteId}/details$`));
            await expect(this.contract.lblHeading, 'Quote hub heading').toContainText(`#${quoteId}`);
            await expect(this.contract.frmContract, 'No contract form').toHaveCount(0);
            if (message) {
                await expect(this.contract.alertWithText(message), `Message "${message}"`).toHaveCount(1);
            } else {
                await expect(this.contract.alertError, 'No error message').toHaveCount(0);
            }
        });
    }

    /** AP2428_003 step 4: the five vehicle fields are prefilled with the vehicle's values. */
    async verifyVehiclePrefill(vehicle: ContractVehicle): Promise<void> {
        await test.step('VERIFY: Make, Model, VIN, Odometer and Delivery date are prefilled from the vehicle', async () => {
            await expect(this.contract.txtVehicleMake, 'Make').toHaveValue(vehicle.make);
            await expect(this.contract.txtVehicleModel, 'Model').toHaveValue(vehicle.model);
            await expect(this.contract.txtVehicleVin, 'VIN').toHaveValue(vehicle.vin);
            await expect(this.contract.txtVehicleOdometer, 'Odometer').toHaveValue(vehicle.odometer);
            await expect(this.contract.txtDeliveryDate, 'Delivery date').toHaveValue(vehicle.deliveryDate);
            // Record only (Judgement item posted on AP-2428): Make, Model and Delivery date are read-only today
            const readOnly = [];
            for (const [name, field] of [['Make', this.contract.txtVehicleMake], ['Model', this.contract.txtVehicleModel],
                ['VIN', this.contract.txtVehicleVin], ['Odometer', this.contract.txtVehicleOdometer],
                ['Delivery date', this.contract.txtDeliveryDate]] as const) {
                if (await field.getAttribute('readonly') !== null) readOnly.push(name);
            }
            test.info().annotations.push({ type: 'Read-only vehicle fields (record only)', description: readOnly.join(', ') || 'none' });
        });
    }

    /** AP2428_006 step 4: Program Term, Start Date, End date and every option shown as read-only text. */
    async verifyProgramSummary(expected: ProgramSummary): Promise<void> {
        await test.step('VERIFY: the Program Summary shows term, dates and every selected option as read-only text', async () => {
            await expect(this.contract.lblProgramTerm, 'Program Term').toHaveText(expected.term);
            await expect(this.contract.lblStartDate, 'Start Date (= delivery date)').toHaveText(expected.startDate);
            await expect(this.contract.lblEndDate, 'End date').toHaveText(expected.endDate);
            await expect(this.contract.inpProgramSummaryControls, 'No input in the Program Summary').toHaveCount(0);
            const options = await this.contract.readSelectedOptions();
            expect(options, 'Every selected option is listed').toEqual(expected.options);
        });
    }

    /** AP2428_011 step 3: clear Last name and VIN, then click Generate Contract. */
    async submitWithBlankLastNameAndVin(): Promise<void> {
        await test.step('Dealer clears Last name and VIN and clicks Generate Contract', async () => {
            await this.contract.clearLastNameAndVin();
            await this.contract.clickGenerateContract();
        });
    }

    /** AP2428_011 step 4: the form is refused in place, both fields are flagged, and no contract row exists. */
    async verifyBlankSubmitRefused(quoteId: string, clientName: string): Promise<void> {
        await test.step('VERIFY: the blank form is refused and no contract is created', async () => {
            await expect(this.page, 'Still on the contract form').toHaveURL(new RegExp(`/quote/${quoteId}/permaplate-create-contract$`));
            await expect(this.contract.lblBlankFieldErrors, '"This value should not be blank." under Last name and VIN').toHaveCount(2);
            await expect(this.contract.txtOwnerLastName, 'Last name flagged').toHaveClass(/is-invalid/);
            await expect(this.contract.txtVehicleVin, 'VIN flagged').toHaveClass(/is-invalid/);

            await this.contract.open(this.url('/permaplate-contracts'));
            await expect(this.contract.lblHeading, 'Dealer contract list').toHaveText('Esthetic protection contracts');
            await expect(this.contract.contractRowFor(clientName), `No contract row for ${clientName}`).toHaveCount(0);
        });
    }

    /** AP2428_013 steps 1–2: once the contract exists the row shows the PDF link and no Generate Contract control. */
    async verifyContractExistsControls(quoteId: string): Promise<void> {
        await test.step(`VERIFY: quote ${quoteId} shows only the contract PDF link, no second Generate Contract`, async () => {
            await expect(this.contract.lnkDownloadContract(quoteId), 'PDF link of the existing contract').toHaveCount(1);
            await expect(this.contract.lnkGenerateContract(quoteId), 'No Generate Contract').toHaveCount(0);
            await expect(this.contract.lnkQuoteContractControls(quoteId), 'The PDF link is the only contract control').toHaveCount(1);
        });
    }

    /** AP2428_014 steps 1 and 3: the "Contract cost price" of the client's row on /permaplate-contracts. */
    async readContractCostPrice(clientName: string): Promise<string> {
        return test.step(`Dealer reads the contract cost price of ${clientName}`, async () => {
            await this.contract.open(this.url('/permaplate-contracts'));
            await expect(this.contract.lblHeading, 'Dealer contract list').toHaveText('Esthetic protection contracts');
            await expect(this.contract.contractRowFor(clientName), `One contract row for ${clientName}`).toHaveCount(1);
            const cost = await this.contract.readContractCostPrice(clientName);
            test.info().annotations.push({ type: `Cost price of ${clientName}`, description: cost });
            return cost;
        });
    }

    private optionUrl(productId: string, optionId: string): string {
        return `${origin(config.adminPortalUrl)}/admin/permaplate/${productId}/option/${optionId}/edit`;
    }

    /** AP2428_014 step 2 (before the change): admin reads the option's current Dealer Cost. */
    async readDealerCost(productId: string, optionId: string): Promise<string> {
        return test.step(`Admin reads the Dealer Cost of option ${optionId}`, async () => {
            await this.option.open(this.optionUrl(productId, optionId));
            await expect(this.option.lblHeading, 'Option edit heading').toHaveText(`Edit Option #${optionId}`);
            const original = await this.option.readDealerCost();
            expect(Number.isNaN(parseFloat(original)), `Dealer Cost "${original}" is a number`).toBe(false);
            return original;
        });
    }

    /** AP2428_014 step 2: admin raises the option's Dealer Cost from `original` by `delta`. Undo with restoreDealerCost(). */
    async raiseDealerCost(productId: string, optionId: string, original: string, delta: number): Promise<void> {
        await test.step(`Admin raises the Dealer Cost of option ${optionId} by ${delta.toFixed(2)}`, async () => {
            const raised = (parseFloat(original) + delta).toFixed(2);
            await this.option.open(this.optionUrl(productId, optionId));
            await this.option.setDealerCostAndSave(raised);
            await expect(this.option.alertSaved, 'Option saved successfully').toBeVisible();
            test.info().annotations.push({ type: `Option ${optionId} Dealer Cost`, description: `${original} → ${raised}` });
        });
    }

    /** AP2428_014 step 4: admin sets the Dealer Cost back and reads it back. Call from a finally block. */
    async restoreDealerCost(productId: string, optionId: string, original: string): Promise<void> {
        await test.step(`Admin restores the Dealer Cost of option ${optionId} to ${original}`, async () => {
            await this.option.open(this.optionUrl(productId, optionId));
            await this.option.setDealerCostAndSave(original);
            await expect(this.option.alertSaved, 'Option saved successfully').toBeVisible();
            await this.option.open(this.optionUrl(productId, optionId));
            await expect(this.option.txtDealerCost, 'Dealer Cost restored').toHaveValue(original);
        });
    }

    /** AP2428_014 step 5: the existing contract's cost price did not move with the Dealer Cost. */
    async verifyCostPriceUnchanged(before: string, after: string): Promise<void> {
        await test.step('VERIFY: the existing contract keeps its cost price', async () => {
            expect(after, `Cost price after the Dealer Cost change (before: ${before})`).toBe(before);
        });
    }
}
