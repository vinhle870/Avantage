import { Page, Locator } from '@playwright/test';

/**
 * Dealer Left Menu Panel - Navigation menu for Dealer Portal.
 * Converted from Dealer_LeftMenuPanel.java + Dealer_LeftMenuPanelFunc.java
 */
export class DealerLeftMenu {
    private page: Page;

    // Locators
    readonly lnkQuotes: Locator;
    readonly lnkInventory: Locator;
    readonly lnkLogout: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lnkQuotes = page.locator('[href="/quotes"]');
        this.lnkInventory = page.locator('a[href="/vehicle/inventory"]');
        this.lnkLogout = page.locator('[href="/logout"]');
    }

    /**
     * Navigate to Quotes page
     */
    async goToQuotesPage(): Promise<void> {
        await this.lnkQuotes.click();
    }

    /**
     * Navigate to Inventory page
     */
    async goToInventoryPage(): Promise<void> {
        await this.lnkInventory.click();
    }

    /**
     * Logout from dealer portal
     */
    async logout(): Promise<void> {
        await this.lnkLogout.click();
    }
}
