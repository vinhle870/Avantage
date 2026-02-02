import { Page, Locator } from '@playwright/test';

/**
 * Admin Left Menu Panel - Navigation menu for Admin Portal.
 * Converted from Admin_LeftMenuPanel.java + Admin_LeftMenuPanelFunc.java
 */
export class AdminLeftMenu {
    private page: Page;

    // Locators
    readonly lnkUsers: Locator;
    readonly lnkPrograms: Locator;
    readonly lnkProgramComponents: Locator;
    readonly lnkWarrantyConditions: Locator;
    readonly lnkLogout: Locator;
    readonly lnkCustomPriceRules: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lnkUsers = page.locator('[href="/admin/dealers"]');
        this.lnkPrograms = page.locator('[href="/admin/programs"]');
        this.lnkProgramComponents = page.locator('[href="/admin/list-program-components"]');
        this.lnkWarrantyConditions = page.locator('[href="/admin/warranty-conditions"]');
        this.lnkLogout = page.locator('[href="/admin/logout"]');
        this.lnkCustomPriceRules = page.locator('[href="/admin/price-rule"]');
    }

    /**
     * Navigate to Users/Dealers page
     */
    async goToUsersPage(): Promise<void> {
        await this.lnkUsers.click();
    }

    /**
     * Navigate to Programs page
     */
    async goToProgramsPage(): Promise<void> {
        await this.lnkPrograms.click();
    }

    /**
     * Navigate to Program Components page
     */
    async goToProgramComponentsPage(): Promise<void> {
        await this.lnkProgramComponents.click();
    }

    /**
     * Navigate to Warranty Conditions page
     */
    async goToWarrantyConditionsPage(): Promise<void> {
        await this.lnkWarrantyConditions.click();
    }

    /**
     * Navigate to Custom Price Rules page
     */
    async goToPriceRulesPage(): Promise<void> {
        await this.lnkCustomPriceRules.click();
    }

    /**
     * Logout from admin portal
     */
    async logout(): Promise<void> {
        await this.lnkLogout.click();
    }
}
