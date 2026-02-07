import { Page, Locator, expect } from "@playwright/test";
import { TableComponent } from "../../../core/components/TableComponent";
import { AdminDealersLocator } from "../locators/AdminDealersLocator";

export class AdminDealersPage {
  private page: Page;

  // Locators
  readonly lnkAddNewDealer: Locator;
  readonly tblDealers: TableComponent;
  readonly btnDeleteConfirm: Locator;
  readonly btnDeleteCancel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.lnkAddNewDealer = page.locator(
      AdminDealersLocator.lnkAddNewDealerLocator,
    );
    this.tblDealers = new TableComponent(
      page,
      AdminDealersLocator.tblDealersLocator,
    );
    this.btnDeleteConfirm = page.locator(
      AdminDealersLocator.btnDeleteConfirmLocator,
    );
    this.btnDeleteCancel = page.locator(
      AdminDealersLocator.btnDeleteCancelocator,
    );
  }

  /**
   * Click on Add New Dealer link to open new dealer page
   */
  async openNewDealerPage(): Promise<void> {
    await this.lnkAddNewDealer.click();
  }

  /**
   * Delete a dealer by name
   */
  async deleteDealer(
    dealerName: string,
    submit: boolean = true,
  ): Promise<void> {
    await this.tblDealers.clickOnChildInRow(
      dealerName,
      "//span[@class='fal fa-trash']",
    );

    if (submit) {
      await this.btnDeleteConfirm.click();
    } else {
      await this.btnDeleteCancel.click();
    }
  }

  /**
   * Check if a dealer is available in the list
   */
  async isDealerAvailableOnList(dealerName: string): Promise<boolean> {
    const row = await this.tblDealers.findRow(dealerName);
    return row !== null;
  }

  /**
   * Wait for dealers table to be visible
   */
  async waitForTableVisible(): Promise<void> {
    await this.tblDealers.waitForVisible();
  }
}
