
package ProjectContext.pageObject.adminPortal.adminDealersPage;


import org.openqa.selenium.By;

public class Admin_DealerPageFunc {

    public static void openNewDealerPage() {
        Admin_DealersPage.lnk_AddNewDealer().click();
    }

    public static void deleteDealer(String dealerName, boolean submit) {
        Admin_DealersPage.tbl_Dealers().clickOnChild(dealerName, By.xpath("//span[@class='fal fa-trash']"));
        if (submit) {
            Admin_DealersPage.btn_DeleteConfirm().click();
            //TODO Uncomment for failed case
//            page.btn_DeleteCancel().click();
        }
    }

    public static Boolean IsDealerAvailableOnList(String dealerName) {
        if (Admin_DealersPage.tbl_Dealers().findRow(dealerName) == null)
            return false;

        return true;
    }
}
