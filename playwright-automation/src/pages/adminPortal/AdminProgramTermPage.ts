import { Locator, Page } from '@playwright/test';

/**
 * Admin — one program term's edit form (/admin/program-term/{id}/edit). No sidebar link reaches it;
 * the term id is the value of the Client portal's term radio.
 * Added for AP-1948. Locators verified on Dev (v2dev) 2026-11-01, each with a match count of 1.
 * Save redirects to /admin/program-terms with the message "Program terms saved".
 */
export class AdminProgramTermPage {
    private readonly page: Page;

    readonly lblHeading: Locator;
    readonly txtSuggestedRetailPrice: Locator;
    readonly btnSave: Locator;
    readonly lblSaved: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lblHeading = page.locator('h1, h2, h3, h4, h5').first();
        this.txtSuggestedRetailPrice = page.locator('#program_term_suggestedRetailPrice');
        this.btnSave = page.getByRole('button', { name: 'Save', exact: true });
        this.lblSaved = page.getByText('Program terms saved');
    }

    async open(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async suggestedRetailPrice(): Promise<string> {
        return (await this.txtSuggestedRetailPrice.inputValue()).trim();
    }

    async setSuggestedRetailPrice(value: string): Promise<void> {
        await this.txtSuggestedRetailPrice.fill(value);
    }

    async save(): Promise<void> {
        await this.btnSave.click();
    }
}
