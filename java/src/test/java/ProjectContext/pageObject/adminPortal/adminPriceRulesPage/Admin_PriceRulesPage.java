
package ProjectContext.pageObject.adminPortal.adminPriceRulesPage;

import core.components.buttons.buttonImpl;
import core.components.buttons.iButton;
import core.components.label.iLabel;
import core.components.label.labelImpl;
import core.components.link.iLink;
import core.components.link.linkImpl;
import core.components.table.iTable;
import core.components.table.tableImpl;
import org.openqa.selenium.By;

public class Admin_PriceRulesPage {

    public static iLink lnk_AddNewPriceRule() {
        return new linkImpl(By.cssSelector("[href=\"/admin/price-rule/new/edit\"]"));
    }

    public static iTable tbl_PriceRules() {
        return new tableImpl(By.xpath("//table[@class='table table-striped table-borderless m-0 table-hover']"));
    }

    public static iButton btn_DeleteConfirm() {
        return new buttonImpl(By.xpath("//button[@id='form_save']"));
    }

    public static iLabel btn_PriceRuleSaved() {
        return new labelImpl(By.xpath("//div[@role='alert' and contains(text(), 'Price rule saved')]"));
    }
}
