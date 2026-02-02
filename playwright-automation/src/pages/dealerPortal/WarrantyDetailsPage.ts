/**
 * Warranty Details Page
 * Page object for viewing and managing warranty details in dealer portal
 */

import { Page, Locator } from '@playwright/test';

export class WarrantyDetailsPage {
  private page: Page;

  // Page elements
  private readonly warrantyProgramName: Locator;
  private readonly warrantyTerm: Locator;
  private readonly warrantyStartDate: Locator;
  private readonly warrantyEndDate: Locator;
  private readonly totalCoverage: Locator;
  private readonly selectedOptions: Locator;
  private readonly priceBreakdown: Locator;
  private readonly coverageDetails: Locator;
  private readonly editButton: Locator;
  private readonly deleteButton: Locator;
  private readonly backButton: Locator;
  private readonly printButton: Locator;
  private readonly successMessage: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators
    this.warrantyProgramName = page.locator('[data-testid="warranty-program-name"]');
    this.warrantyTerm = page.locator('[data-testid="warranty-term"]');
    this.warrantyStartDate = page.locator('[data-testid="warranty-start-date"]');
    this.warrantyEndDate = page.locator('[data-testid="warranty-end-date"]');
    this.totalCoverage = page.locator('[data-testid="total-coverage"]');
    this.selectedOptions = page.locator('[data-testid="selected-options"]');
    this.priceBreakdown = page.locator('[data-testid="price-breakdown"]');
    this.coverageDetails = page.locator('[data-testid="coverage-details"]');
    this.editButton = page.locator('button:has-text("Edit")');
    this.deleteButton = page.locator('button:has-text("Delete")');
    this.backButton = page.locator('button:has-text("Back")');
    this.printButton = page.locator('button:has-text("Print")');
    this.successMessage = page.locator('[class*="success"]');
    this.errorMessage = page.locator('[class*="error"]');
  }

  /**
   * Get warranty program name
   */
  public async getWarrantyProgramName(): Promise<string> {
    return await this.warrantyProgramName.textContent() || '';
  }

  /**
   * Get warranty term
   */
  public async getWarrantyTerm(): Promise<string> {
    return await this.warrantyTerm.textContent() || '';
  }

  /**
   * Get warranty start date
   */
  public async getWarrantyStartDate(): Promise<string> {
    return await this.warrantyStartDate.textContent() || '';
  }

  /**
   * Get warranty end date
   */
  public async getWarrantyEndDate(): Promise<string> {
    return await this.warrantyEndDate.textContent() || '';
  }

  /**
   * Get total coverage amount
   */
  public async getTotalCoverage(): Promise<string> {
    return await this.totalCoverage.textContent() || '';
  }

  /**
   * Get selected options list
   */
  public async getSelectedOptions(): Promise<string[]> {
    const options = await this.selectedOptions.all();
    const optionsText: string[] = [];

    for (const option of options) {
      const text = await option.textContent();
      if (text) {
        optionsText.push(text);
      }
    }

    return optionsText;
  }

  /**
   * Get price breakdown details
   */
  public async getPriceBreakdown(): Promise<any> {
    const breakdown = await this.priceBreakdown.textContent();
    // Parse the breakdown information
    return breakdown || '';
  }

  /**
   * Get coverage details
   */
  public async getCoverageDetails(): Promise<string> {
    return await this.coverageDetails.textContent() || '';
  }

  /**
   * Click edit button
   */
  public async clickEdit(): Promise<void> {
    await this.editButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click delete button
   */
  public async clickDelete(): Promise<void> {
    await this.deleteButton.click();
  }

  /**
   * Click back button
   */
  public async clickBack(): Promise<void> {
    await this.backButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click print button
   */
  public async clickPrint(): Promise<void> {
    await this.printButton.click();
  }

  /**
   * Get success message
   */
  public async getSuccessMessage(): Promise<string> {
    return await this.successMessage.textContent() || '';
  }

  /**
   * Get error message
   */
  public async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Verify warranty details are displayed
   */
  public async verifyWarrantyDetailsDisplayed(): Promise<boolean> {
    const programName = await this.getWarrantyProgramName();
    const term = await this.getWarrantyTerm();
    const startDate = await this.getWarrantyStartDate();

    return !!programName && !!term && !!startDate;
  }

  /**
   * Wait for page to load
   */
  public async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Export warranty details (if available)
   */
  public async exportWarrantyDetails(format: 'pdf' | 'excel'): Promise<void> {
    const exportButton = this.page.locator(`button:has-text("Export as ${format.toUpperCase()}")`);
    if (await exportButton.isVisible()) {
      await exportButton.click();
    } else {
      throw new Error(`Export as ${format.toUpperCase()} option not available`);
    }
  }

  /**
   * Compare with another warranty
   */
  public async compareWarranty(warrantyId: string): Promise<void> {
    const compareButton = this.page.locator(`button[data-warranty-id="${warrantyId}"]`);
    await compareButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
