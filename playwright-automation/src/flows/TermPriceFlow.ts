import { expect, Page, test } from '@playwright/test';
import { config } from '../data/config';
import {
    ClientQuoteClient, ClientQuoteOwnership, ClientQuoteRequestPage, ClientQuoteVehicle,
} from '../pages/common/ClientQuoteRequestPage';
import { AdminProgramTermPage } from '../pages/adminPortal/AdminProgramTermPage';

/** "CA$1,025.00" → 1025; "1025" → 1025. Compares amounts only (Q-005: the format is recorded, not judged). */
export function amountOf(text: string): number {
    const n = Number(text.replace(/[^0-9.\-]/g, ''));
    if (Number.isNaN(n) || text.trim() === '') throw new Error(`Not an amount: "${text}"`);
    return n;
}

const origin = (url: string): string => new URL(url).origin;

/**
 * Client portal term price ↔ admin program term "Suggested retail price" (AP-1948).
 * Added in its own file so the QA's uncommitted AdminFlow.ts / DealerFlow.ts are left untouched.
 * Admin login stays in AdminFlow.loginToAdminPortal(). Never presses "Continue with payment".
 */
export class TermPriceFlow {
    private readonly quote: ClientQuoteRequestPage;
    private readonly term: AdminProgramTermPage;

    constructor(private readonly page: Page, private readonly customerId: string) {
        this.quote = new ClientQuoteRequestPage(page);
        this.term = new AdminProgramTermPage(page);
    }

    private quoteUrl(step = ''): string {
        return `${origin(config.baseUrl)}/customer/${this.customerId}/quote-request${step}`;
    }

    private termUrl(termId: string): string {
        return `${origin(config.adminPortalUrl)}/admin/program-term/${termId}/edit`;
    }

    /** Steps 1–3: vehicle, ownership, then the term list is shown. */
    async openQuoteRequestUpToTermChoice(vehicle: ClientQuoteVehicle, ownership: ClientQuoteOwnership): Promise<void> {
        await test.step(`Customer opens the quote request and picks vehicle ${vehicle.vehicleId}`, async () => {
            await this.quote.open(this.quoteUrl());
            await expect(this.page, 'Step 1 route').toHaveURL(new RegExp(`/customer/${this.customerId}/quote-request$`));
            await this.quote.enterVehicle(vehicle);
            await expect(this.quote.ddlVehicle, 'Vehicle selected').toHaveValue(vehicle.vehicleId);
            await this.quote.continue();
            await expect(this.page, 'Step 2 "Enter the ownership info"').toHaveURL(/\/quote-request\/ownership$/);
            await this.quote.enterOwnership(ownership);
            await this.quote.continue();
            await expect(this.page, 'Step 3 "Select Coverage"').toHaveURL(/\/quote-request\/program$/);
        });
    }

    /** Step 3 → 5: pick the term, fill Client Info, reach the Summary page. */
    async chooseTermAndReachSummary(termId: string, client: ClientQuoteClient): Promise<void> {
        await test.step(`Customer selects term ${termId} and continues to the Summary page`, async () => {
            await expect(this.quote.termCard(termId), `Term ${termId} is offered`).toBeVisible();
            await this.quote.selectTerm(termId);
            await expect(this.quote.termRadio(termId), `Term ${termId} radio checked`).toBeChecked();
            await this.quote.continue();
            await expect(this.page, 'Step 4 "Client Info"').toHaveURL(/\/quote-request\/client$/);
            await this.quote.enterClient(client);
            await this.quote.continue();
            await expect(this.page, 'Step 5 "Summary"').toHaveURL(/\/quote-request\/payment$/);
            await expect(this.quote.lblSubtotal, 'Summary Subtotal shown').toHaveText(/CA\$[\d,]+\.\d{2}/);
        });
    }

    /** Back to "Select Coverage" (the session keeps the vehicle and client), pick another term, reach Summary again. */
    async switchTermAndReachSummary(termId: string): Promise<void> {
        await test.step(`Customer goes back to Select Coverage and switches to term ${termId}`, async () => {
            await this.quote.open(this.quoteUrl('/program'));
            await expect(this.page, 'Step 3 "Select Coverage"').toHaveURL(/\/quote-request\/program$/);
            await this.quote.selectTerm(termId);
            await expect(this.quote.termRadio(termId), `Term ${termId} radio checked`).toBeChecked();
            await this.quote.continue();
            await expect(this.page, 'Step 4 "Client Info"').toHaveURL(/\/quote-request\/client$/);
            await this.quote.tickAgreePolicy();
            await this.quote.continue();
            await expect(this.page, 'Step 5 "Summary"').toHaveURL(/\/quote-request\/payment$/);
        });
    }

    /** Reads the Summary Subtotal of the selected term and checks the program / term it is shown for. */
    async readSummarySubtotal(expectedWarrantyTerm: string | RegExp): Promise<number> {
        return test.step('Customer reads the Summary "Subtotal"', async () => {
            await expect(this.quote.lblWarrantyTerm, 'Summary "Warranty term"').toHaveText(expectedWarrantyTerm);
            return amountOf(await this.quote.subtotalText());
        });
    }

    /** Admin reads "Suggested retail price" on /admin/program-term/{id}/edit. Nothing is saved. */
    async readSuggestedRetailPrice(termId: string): Promise<number> {
        return test.step(`Admin reads term ${termId}'s "Suggested retail price"`, async () => {
            await this.term.open(this.termUrl(termId));
            await expect(this.page, 'Program term edit page').toHaveURL(new RegExp(`/admin/program-term/${termId}/edit$`));
            await expect(this.term.txtSuggestedRetailPrice, '"Suggested retail price" has a value').not.toHaveValue('');
            return amountOf(await this.term.suggestedRetailPrice());
        });
    }

    /** Admin sets "Suggested retail price" and saves; checks the save message and the stored value. */
    async setSuggestedRetailPrice(termId: string, value: number): Promise<void> {
        await test.step(`Admin sets term ${termId}'s "Suggested retail price" to ${value} and saves`, async () => {
            await this.term.open(this.termUrl(termId));
            await this.term.setSuggestedRetailPrice(String(value));
            await this.term.save();
            await expect(this.page, 'Save redirects to the program terms list').toHaveURL(/\/admin\/program-terms/);
            await expect(this.term.lblSaved.first(), 'Message "Program terms saved"').toBeVisible();
            await this.term.open(this.termUrl(termId));
            expect(amountOf(await this.term.suggestedRetailPrice()), 'Stored "Suggested retail price"').toBe(value);
        });
    }

    /** Puts the original price back only when it differs — safe to call from a finally block. */
    async restoreSuggestedRetailPrice(termId: string, original: number): Promise<void> {
        await test.step(`Admin restores term ${termId}'s "Suggested retail price" to ${original}`, async () => {
            await this.term.open(this.termUrl(termId));
            if (amountOf(await this.term.suggestedRetailPrice()) !== original) {
                await this.term.setSuggestedRetailPrice(String(original));
                await this.term.save();
                await expect(this.term.lblSaved.first(), 'Message "Program terms saved"').toBeVisible();
                await this.term.open(this.termUrl(termId));
            }
            expect(amountOf(await this.term.suggestedRetailPrice()), 'Restored "Suggested retail price"').toBe(original);
        });
    }

    async verifyPriceEquals(portal: number, expected: number, what: string): Promise<void> {
        await test.step(`VERIFICATION POINT: ${what}`, async () => {
            expect(portal, what).toBe(expected);
        });
    }

    async verifyPricesDiffer(first: number, second: number, what: string): Promise<void> {
        await test.step(`VERIFICATION POINT: ${what}`, async () => {
            expect(second, what).not.toBe(first);
        });
    }
}
