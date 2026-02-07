import { Page, Locator } from "@playwright/test";
import { VehicleModalLocator } from "../locators/VehicleModalLocator";

/**
 * Vehicle Modal - Modal for adding/selecting vehicle in quote.
 * Converted from Vehicle_Modal.java
 */
export class VehicleModal {
  private page: Page;

  // Locators
  readonly ddlVehicle: Locator;
  readonly txtDeliveryDate: Locator;
  readonly txtPrice: Locator;
  readonly btnSave: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ddlVehicle = this.page.locator(VehicleModalLocator.ddlVehicleLocator);
    this.txtDeliveryDate = this.page.locator(
      VehicleModalLocator.txtDeliveryDateLocator,
    );
    this.txtPrice = this.page.locator(VehicleModalLocator.txtPriceLocator);
    this.btnSave = this.page.locator(VehicleModalLocator.btnSaveLocator);
  }

  /**
   * Select vehicle from dropdown
   */
  async selectVehicle(vehicleOption: string): Promise<void> {
    await this.ddlVehicle.click();
    await this.page.locator(`li:has-text("${vehicleOption}")`).click();
  }

  /**
   * Fill delivery date
   */
  async fillDeliveryDate(date: string): Promise<void> {
    await this.txtDeliveryDate.fill(date);
  }

  /**
   * Fill price
   */
  async fillPrice(price: string): Promise<void> {
    await this.txtPrice.fill(price);
  }

  /**
   * Click save button
   */
  async save(): Promise<void> {
    await this.btnSave.click();
  }
}
