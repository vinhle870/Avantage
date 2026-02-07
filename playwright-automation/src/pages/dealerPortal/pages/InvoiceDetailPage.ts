import { Page, Locator } from "@playwright/test";
import { InvoiceDetailLocator } from "../locators/InvoiceDetailLocator";

/**
 * Invoice Info data interface
 */
export interface InvoiceInfoData {
  dealerName?: string;
  dealerAddress?: string;
  dealerLocation?: string;
  dealerEmail?: string;
  dealerPhone?: string;
  invoiceDescription?: string;
  invoiceTotal?: string;
  invoiceGrandTotal?: string;
  taxInfo1?: string;
  taxInfo2?: string;
  apt1?: string;
  apt2?: string;
}

/**
 * Dealer Info data interface for verification
 */
export interface DealerInfoData {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  email: string;
  phone: string;
}

/**
 * Invoice Detail Page - View invoice details after sale finalization.
 * Converted from InvoiceDetail_Page.java + InvoiceDetailPage_Func.java
 */
export class InvoiceDetailPage {
  private page: Page;

  // Locators - Using more stable CSS selectors where possible
  readonly lblDealerName: Locator;
  readonly lblDealerAddress: Locator;
  readonly lblDealerLocation: Locator;
  readonly lblDealerEmail: Locator;
  readonly lblDealerPhone: Locator;
  readonly lblInvoiceDescription: Locator;
  readonly lblInvoiceTotal: Locator;
  readonly lblInvoiceGrandTotal: Locator;
  readonly lblAVAddress: Locator;

  constructor(page: Page) {
    this.page = page;
    // Using XPath from original source - these may need adjustment for stability
    this.lblDealerName = this.page.locator(
      InvoiceDetailLocator.lblDealerNameLocator,
    );
    this.lblDealerAddress = this.page.locator(
      InvoiceDetailLocator.lblDealerAddressLocator,
    );
    this.lblDealerLocation = this.page.locator(
      InvoiceDetailLocator.lblDealerLocationLocator,
    );
    this.lblDealerEmail = this.page.locator(
      InvoiceDetailLocator.lblDealerEmailLocator,
    );
    this.lblDealerPhone = this.page.locator(
      InvoiceDetailLocator.lblDealerPhoneLocator,
    );
    this.lblInvoiceDescription = this.page.locator(
      InvoiceDetailLocator.lblInvoiceDescriptionLocator,
    );
    this.lblInvoiceTotal = this.page.locator(
      InvoiceDetailLocator.lblInvoiceTotalLocator,
    );
    this.lblInvoiceGrandTotal = this.page
      .locator(InvoiceDetailLocator.lblInvoiceGrandTotalLocator)
      .first();
    this.lblAVAddress = this.page.locator(
      InvoiceDetailLocator.lblAVAddressLocator,
    );
  }

  /**
   * Get all invoice info
   */
  async getInvoiceInfo(): Promise<InvoiceInfoData> {
    return {
      dealerName: (await this.lblDealerName.textContent()) || "",
      dealerAddress: (await this.lblDealerAddress.textContent()) || "",
      dealerLocation: (await this.lblDealerLocation.textContent()) || "",
      dealerEmail: (await this.lblDealerEmail.textContent()) || "",
      dealerPhone: (await this.lblDealerPhone.textContent()) || "",
      invoiceDescription:
        (await this.lblInvoiceDescription.textContent()) || "",
      invoiceTotal: (await this.lblInvoiceTotal.textContent()) || "",
      invoiceGrandTotal: (await this.lblInvoiceGrandTotal.textContent()) || "",
    };
  }

  /**
   * Verify invoice info against dealer info
   * Returns empty string if all matches, otherwise returns the field that doesn't match
   */
  async verifyInvoiceInfo(
    invoiceInfo: InvoiceInfoData,
    dealerInfo: DealerInfoData,
  ): Promise<string> {
    // Province abbreviation mapping
    const provinceMap: {
      [key: string]: { abbr: string; gstRate: number; pstRate: number };
    } = {
      Quebec: { abbr: "QC", gstRate: 0.05, pstRate: 0.09975 },
      "New Brunswick": { abbr: "NB", gstRate: 0.15, pstRate: 0 },
      Ontario: { abbr: "ON", gstRate: 0.13, pstRate: 0 },
      "Nova Scotia": { abbr: "NS", gstRate: 0.15, pstRate: 0 },
      Alberta: { abbr: "AB", gstRate: 0.05, pstRate: 0 },
      "British Columbia": { abbr: "BC", gstRate: 0.05, pstRate: 0.07 },
      Manitoba: { abbr: "MB", gstRate: 0.05, pstRate: 0.07 },
      Saskatchewan: { abbr: "SK", gstRate: 0.05, pstRate: 0.06 },
      "Prince Edward Island": { abbr: "PE", gstRate: 0.15, pstRate: 0 },
      "Newfoundland and Labrador": { abbr: "NL", gstRate: 0.15, pstRate: 0 },
      Nunavut: { abbr: "NU", gstRate: 0.05, pstRate: 0 },
      Yukon: { abbr: "YT", gstRate: 0.05, pstRate: 0 },
      "Northwest territories": { abbr: "NT", gstRate: 0.05, pstRate: 0 },
    };

    const provinceInfo = provinceMap[dealerInfo.province] || {
      abbr: "",
      gstRate: 0,
      pstRate: 0,
    };

    if (!invoiceInfo.dealerName?.includes(dealerInfo.name))
      return "Dealer's name";
    if (!invoiceInfo.dealerAddress?.includes(dealerInfo.address))
      return "Dealer's address";
    if (!invoiceInfo.dealerLocation?.includes(dealerInfo.postalCode))
      return "Postalcode";
    if (!invoiceInfo.dealerLocation?.includes(dealerInfo.city))
      return "Dealer's city";
    if (!invoiceInfo.dealerLocation?.includes(provinceInfo.abbr))
      return "Dealer's province";
    if (!invoiceInfo.dealerEmail?.includes(dealerInfo.email))
      return "Dealer's email";
    if (!invoiceInfo.dealerPhone?.includes(dealerInfo.phone))
      return "Dealer's phone";

    // Calculate expected grand total
    const total = parseFloat(invoiceInfo.invoiceTotal?.replace("$", "") || "0");
    const expectedGrandTotal =
      total + total * provinceInfo.gstRate + total * provinceInfo.pstRate;
    const actualGrandTotal = parseFloat(
      invoiceInfo.invoiceGrandTotal?.replace("$", "") || "0",
    );

    if (Math.abs(expectedGrandTotal - actualGrandTotal) > 0.01)
      return "Grand total";

    return "";
  }

  /**
   * Get AV Address text for tax verification
   */
  async getAVAddressText(): Promise<string> {
    return (await this.lblAVAddress.textContent()) || "";
  }
}
