package ProjectContext.pageObject.adminPortal.adminDealersPage;


import core.components.buttons.buttonImpl;
import core.components.buttons.iButton;
import core.components.link.iLink;
import core.components.link.linkImpl;
import core.components.table.iTable;
import core.components.table.tableImpl;
import org.openqa.selenium.By;

public class Admin_DealersPage {

    public static iLink lnk_AddNewDealer() {
        return new linkImpl(By.cssSelector("[href=\"/admin/dealer/new/edit\"]"));
    }

    public static iTable tbl_Dealers() {
        return new tableImpl(By.xpath("//table[@class='table table-striped table-borderless m-0 table-hover']"));
    }

    public static iButton btn_DeleteConfirm() {
        return new buttonImpl(By.xpath("//button[@type='submit' and @class='btn btn-primary']"));
    }

    public static iLink btn_DeleteCancel() {
        return new linkImpl(By.xpath("//a[@data-dismiss=\"modal\"]"));
    }
}
