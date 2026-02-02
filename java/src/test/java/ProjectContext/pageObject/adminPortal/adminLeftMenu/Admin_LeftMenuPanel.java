
package ProjectContext.pageObject.adminPortal.adminLeftMenu;

import core.components.link.iLink;
import core.components.link.linkImpl;
import org.openqa.selenium.By;

public class Admin_LeftMenuPanel  {

     public static iLink lnk_Users() {
        return new linkImpl(By.cssSelector("[href=\"/admin/dealers\"]"));
    }

    public static iLink lnk_Programs() {
        return new linkImpl(By.cssSelector("[href=\"/admin/programs\"]"));
    }

    public static iLink lnk_ProgramComponents() {
        return new linkImpl(By.cssSelector("[href=\"/admin/list-program-components\"]"));
    }

    public static iLink lnk_WarrantyConditions() {
        return new linkImpl(By.cssSelector("[href=\"/admin/warranty-conditions\"]"));
    }

    public static iLink lnk_Logout() {
        return new linkImpl(By.cssSelector("[href=\"/admin/logout\"]"));
    }

    public static iLink lnk_CustomPriceRules() {
        return new linkImpl(By.cssSelector("[href=\"/admin/price-rule\"]"));
    }

}
