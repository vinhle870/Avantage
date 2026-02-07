export class AdminDealersLocator {
  public static lnkAddNewDealerLocator: string =
    '[href="/admin/dealer/new/edit"]';
  public static tblDealersLocator: string =
    "//table[@class='table table-striped table-borderless m-0 table-hover']";
  public static btnDeleteConfirmLocator: string =
    "//button[@type='submit' and @class='btn btn-primary']";
  public static btnDeleteCancelocator: string = 'a[data-dismiss="modal"]';
}
