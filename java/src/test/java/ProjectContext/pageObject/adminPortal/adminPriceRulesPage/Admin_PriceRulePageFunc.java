
package ProjectContext.pageObject.adminPortal.adminPriceRulesPage;

import ProjectContext.BusinessObject.Admin.PriceRule;
import org.openqa.selenium.By;

public class Admin_PriceRulePageFunc {

    public static void openNewPriceRulePage() {
        Admin_PriceRulesPage.lnk_AddNewPriceRule().click();
    }

    public static void deletePriceRule(PriceRule priceRule, boolean submit) {
        Admin_PriceRulesPage.tbl_PriceRules().clickOnChild(priceRule.getName(), By.xpath("//span[@class='fal fa-trash']"));
        if (submit) Admin_PriceRulesPage.btn_DeleteConfirm().click();
    }

    public static boolean IsPriceRuleAvailableOnList(String name) {
        return Admin_PriceRulesPage.tbl_PriceRules().findRow(name) != null;
    }
}
