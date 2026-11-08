import { Page, Locator } from '@playwright/test';

/**
 * Admin Permaplate option edit form (/admin/permaplate/{productId}/option/{optionId}/edit) — AP-2428.
 * Locators verified on v2dev, 2026-11-02 (option 20 of product 3): heading, Dealer Cost field and Save
 * button each count 1; Save returns to /admin/permaplate/{productId}/details with "Option saved successfully".
 * No assertions here — see PermaplateContractFlow.
 */
export class AdminPermaplateOptionPage {
    private page: Page;

    readonly lblHeading: Locator;
    readonly txtDealerCost: Locator;
    readonly btnSave: Locator;
    readonly alertSaved: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lblHeading = page.locator('h1');
        this.txtDealerCost = page.locator('#permaplate_option_dealerCost');
        this.btnSave = page.locator('form[name="permaplate_option"] button[type="submit"]');
        this.alertSaved = page.locator('.alert-success', { hasText: 'Option saved successfully' });
    }

    async open(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async readDealerCost(): Promise<string> {
        return this.txtDealerCost.inputValue();
    }

    async setDealerCostAndSave(value: string): Promise<void> {
        await this.txtDealerCost.fill(value);
        await this.btnSave.click();
    }
}
