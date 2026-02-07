import { Page, Locator, expect } from "@playwright/test";
import { VehicleModal } from "./VehicleModal";
import { QuoteDetailLocator } from "../locators/QuoteDetailLocator";

/**
 * Quote Vehicle data interface
 */
export interface QuoteVehicleData {
  vehicleInfo: {
    branch: string;
    model: string;
    year: string;
    price: string;
    vin: string;
  };
  deliveryDate: string;
  price: string;
}

/**
 * Quote Detail Page - View and manage quote details.
 * Converted from QuoteDetail_Page.java + QuoteDetailPage_Func.java
 */
export class QuoteDetailPage {
  private page: Page;
  public vehicleModal: VehicleModal;

  // Locators
  readonly btnAddVehicle: Locator;
  readonly lnkNewWarranty: Locator;
  readonly btnFinalizeSale: Locator;
  readonly lblAlertMsg: Locator;
  readonly lnkCreateSale: Locator;
  readonly lnkGotoInvoice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.vehicleModal = new VehicleModal(page);

    this.btnAddVehicle = this.page.locator(
      QuoteDetailLocator.btnAddVehicleLocator,
    );
    this.lnkNewWarranty = this.page.locator(
      QuoteDetailLocator.lnkNewWarrantyLocator,
    );
    this.btnFinalizeSale = this.page.locator(
      QuoteDetailLocator.btnFinalizeSaleLocator,
    );
    this.lblAlertMsg = this.page.locator(QuoteDetailLocator.lblAlertMsgLocator);
    this.lnkCreateSale = this.page.locator(
      QuoteDetailLocator.lnkCreateSaleLocator,
    );
    this.lnkGotoInvoice = this.page.locator(
      QuoteDetailLocator.lnkGotoInvoiceLocator,
    );
  }

  /**
   * Add a vehicle to the quote
   */
  async addQuoteVehicle(quoteVehicle: QuoteVehicleData): Promise<void> {
    await this.btnAddVehicle.click();

    // Format the vehicle option string
    const formatPrice = `${Number(quoteVehicle.vehicleInfo.price).toLocaleString("en-US", { maximumFractionDigits: 0 })}$`;
    const fullVehicleOption = `${quoteVehicle.vehicleInfo.branch} ${quoteVehicle.vehicleInfo.model} ${quoteVehicle.vehicleInfo.year} ${formatPrice}\n${quoteVehicle.vehicleInfo.vin}`;

    await this.vehicleModal.selectVehicle(fullVehicleOption);
    await this.vehicleModal.fillDeliveryDate(quoteVehicle.deliveryDate);
    await this.vehicleModal.fillPrice(quoteVehicle.price);
    await this.vehicleModal.save();
  }

  /**
   * Open warranty details page
   */
  async openWarrantyDetailsPage(): Promise<void> {
    await this.lnkNewWarranty.click();
  }

  /**
   * Open sale contract details page
   */
  async openSaleContractDetailsPage(): Promise<void> {
    await this.lnkCreateSale.click();
  }

  /**
   * Click finalize sale button
   */
  async finalizeSale(): Promise<void> {
    await this.btnFinalizeSale.click();
  }

  /**
   * Go to invoice page after finalize
   */
  async gotoInvoicePageAfterFinalize(): Promise<void> {
    await this.lnkGotoInvoice.click();
  }

  /**
   * Get alert message text
   */
  async getAlertMessage(): Promise<string> {
    return (await this.lblAlertMsg.textContent()) || "";
  }

  /**
   * Verify alert message is visible
   */
  async verifyAlertVisible(): Promise<void> {
    await expect(this.lblAlertMsg).toBeVisible();
  }
}
