export class AdminPriceRulesLocator {
  public static lnkAddNewPriceRuleLocator: string =
    '[href="/admin/price-rule/new/edit"]';
  public static tblPriceRulesLocator: string =
    "//table[@class='table table-striped table-borderless m-0 table-hover']";
  public static btnDeleteConfirmLocator: string = "#form_save";
  public static lblPriceRuleSavedLocator: string =
    "//div[@role='alert' and contains(text(), 'Price rule saved')]";
}
