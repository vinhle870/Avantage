import { Page, Locator } from "@playwright/test";
import { DealerQuotesLocator } from "../locators/DealerQuotesLocator";

/**
 * Dealer Quotes Page - Manage quotes.
 * Converted from Dealer_QuotesPage.java + Dealer_QuotePageFunc.java
 */
export class DealerQuotesPage {
  private page: Page;

  // Locators
  readonly lnkCreateAQuote: Locator;

  constructor(page: Page) {
    this.page = page;
    this.lnkCreateAQuote = this.page.locator(
      DealerQuotesLocator.lnkCreateAQuoteLocator,
    );
  }

  /**
   * Open new quote page
   */
  async openNewQuotePage(): Promise<void> {
    await this.lnkCreateAQuote.click();
  }

  /**
   * Check if create quote link is visible
   */
  async isCreateQuoteLinkVisible(): Promise<boolean> {
    return await this.lnkCreateAQuote.isVisible();
  }
}
