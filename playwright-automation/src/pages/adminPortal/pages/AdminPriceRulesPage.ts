import { Page, Locator, expect } from "@playwright/test";
import { TableComponent } from "../../../core/components/TableComponent";
import { AdminPriceRulesLocator } from "../locators/AdminPriceRulesLocator";
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
    this.lnkAddNewPriceRule = this.page.locator(
      AdminPriceRulesLocator.lnkAddNewPriceRuleLocator,
    );
    this.tblPriceRules = new TableComponent(
      this.page,
      AdminPriceRulesLocator.tblPriceRulesLocator,
    );
    this.btnDeleteConfirm = this.page.locator(
      AdminPriceRulesLocator.btnDeleteConfirmLocator,
    );
    this.lblPriceRuleSaved = this.page.locator(
      AdminPriceRulesLocator.lblPriceRuleSavedLocator,
    );
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
  async deletePriceRule(
    priceRule: PriceRuleData,
    submit: boolean = true,
  ): Promise<void> {
    await this.tblPriceRules.clickOnChildInRow(
      priceRule.name,
      "//span[@class='fal fa-trash']",
    );

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
