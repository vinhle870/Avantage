export class WarrantyDetailsLocator {
  public static warrantyProgramNameLocator: string =
    '[data-testid="warranty-program-name"]';
  public static warrantyTermLocator: string = '[data-testid="warranty-term"]';
  public static warrantyStartDateLocator: string =
    '[data-testid="warranty-start-date"]';
  public static warrantyEndDateLocator: string =
    '[data-testid="warranty-end-date"]';
  public static totalCoverageLocator: string = '[data-testid="total-coverage"]';
  public static selectedOptionsLocator: string =
    '[data-testid="selected-options"]';
  public static priceBreakdownLocator: string =
    '[data-testid="price-breakdown"]';
  public static coverageDetailsLocator: string =
    '[data-testid="coverage-details"]';
  public static editButtonLocator: string = 'button:has-text("Edit")';
  public static deleteButtonLocator: string = 'button:has-text("Delete")';
  public static backButtonLocator: string = 'button:has-text("Back")';
  public static printButtonLocator: string = 'button:has-text("Print")';
  public static successMessageLocator: string = '[class*="success"]';
  public static errorMessageLocator: string = '[class*="error"]';
}
