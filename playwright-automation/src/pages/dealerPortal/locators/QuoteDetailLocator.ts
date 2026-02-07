export class QuoteDetailLocator {
  public static btnAddVehicleLocator: string =
    "//*[contains(@data-href, '/vehicle')]";
  public static lnkNewWarrantyLocator: string =
    "//*[contains(@href,'warranty/edit')]";
  public static btnFinalizeSaleLocator: string =
    "//*[contains(@href, '/finalize')]";
  public static lblAlertMsgLocator: string = "[role='alert']";
  public static lnkCreateSaleLocator: string = "//*[contains(@href,'sale')]";
  public static lnkGotoInvoiceLocator: string =
    "body > div:nth-child(1) > main > div > div > div:nth-child(1) > a";
}
