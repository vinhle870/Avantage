import { Page, Locator, expect } from '@playwright/test';
import { TableComponent } from '../../core/components/TableComponent';

/**
 * PriceRule data interface
 */
export interface PriceRuleData {
    name: string;
}

/**
 * Admin Price Rules Page - Manage custom price rules.
 * Converted from Admin_PriceRulesPage.java + Admin_PriceRulePageFunc.java
 */
export class AdminPriceRulesPage {
    private page: Page;

    // Locators
    readonly lnkAddNewPriceRule: Locator;
    readonly tblPriceRules: TableComponent;
    readonly btnDeleteConfirm: Locator;
    readonly lblPriceRuleSaved: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lnkAddNewPriceRule = page.locator('[href="/admin/price-rule/new/edit"]');
        this.tblPriceRules = new TableComponent(page, "//table[@class='table table-striped table-borderless m-0 table-hover']");
        this.btnDeleteConfirm = page.locator('#form_save');
        this.lblPriceRuleSaved = page.locator("//div[@role='alert' and contains(text(), 'Price rule saved')]");
    }

    /**
     * Open new price rule page
     */
    async openNewPriceRulePage(): Promise<void> {
        await this.lnkAddNewPriceRule.click();
    }

    /**
     * Delete a price rule by name
     */
    async deletePriceRule(priceRule: PriceRuleData, submit: boolean = true): Promise<void> {
        await this.tblPriceRules.clickOnChildInRow(priceRule.name, "//span[@class='fal fa-trash']");

        if (submit) {
            await this.btnDeleteConfirm.click();
        }
    }

    /**
     * Check if a price rule is available in the list
     */
    async isPriceRuleAvailableOnList(name: string): Promise<boolean> {
        const row = await this.tblPriceRules.findRow(name);
        return row !== null;
    }

    /**
     * Verify price rule saved message is visible
     */
    async verifyPriceRuleSaved(): Promise<void> {
        await expect(this.lblPriceRuleSaved).toBeVisible();
    }

    /**
     * Wait for table to be visible
     */
    async waitForTableVisible(): Promise<void> {
        await this.tblPriceRules.waitForVisible();
    }
}
