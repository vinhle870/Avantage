package testcases.AdminPortal;

import ProjectContext.BusinessObject.Admin.PriceRule;
import org.junit.jupiter.api.Test;
import testcases.TestBase;

import java.io.File;

public class Admin_CustomPriceRuleManage extends TestBase {

    @Test
    public void AP145_AdminUserCanDeleteCustomPricingRule() {

        this.testControl.getDataFileReader().readAdminPortalData(new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        AdminUser.loginToAdminPortal();

        AdminUser.createNewPriceRule(getPriceRuleData("Automation Test"), true);

        AdminUser.deletePriceRule(getPriceRuleData("Automation Test"), true);
    }

    private PriceRule getPriceRuleData(String tcsId) {
        return this.testControl.getDataFileReader().adminPortal.getPriceRuleInfo().getPriceRule()
                .stream().filter(priceRule -> priceRule.getName().startsWith(tcsId)).toList().get(0);
    }
}
