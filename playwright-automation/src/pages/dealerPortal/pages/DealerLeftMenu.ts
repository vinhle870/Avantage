import { Page, Locator } from "@playwright/test";
import { DealerLeftMenuLocator } from "../locators/DealerLeftMenuLocator";

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
    this.lnkQuotes = this.page.locator(DealerLeftMenuLocator.lnkQuotesLocator);
    this.lnkInventory = this.page.locator(
      DealerLeftMenuLocator.lnkInventoryLocator,
    );
    this.lnkLogout = this.page.locator(DealerLeftMenuLocator.lnkLogoutLocator);
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
