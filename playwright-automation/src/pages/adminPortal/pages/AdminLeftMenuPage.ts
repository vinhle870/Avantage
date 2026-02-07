import { Page, Locator } from "@playwright/test";
import { AdminLeftLocator } from "../locators/AdminLeftMenuLocator";

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
    this.lnkUsers = page.locator(AdminLeftLocator.lnkUsersLocator);
    this.lnkPrograms = page.locator(AdminLeftLocator.lnkProgramsLocator);
    this.lnkProgramComponents = page.locator(
      AdminLeftLocator.lnkProgramComponentsLocator,
    );
    this.lnkWarrantyConditions = page.locator(
      AdminLeftLocator.lnkWarrantyConditionsLocator,
    );
    this.lnkLogout = page.locator(AdminLeftLocator.lnkLogoutLocator);
    this.lnkCustomPriceRules = page.locator(
      AdminLeftLocator.lnkCustomPriceRulesLocator,
    );
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
