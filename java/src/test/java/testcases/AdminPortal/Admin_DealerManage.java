package testcases.AdminPortal;

import java.io.File;
import org.junit.jupiter.api.Test;
import testcases.TestBase;

public class Admin_DealerManage extends TestBase {

    @Test
    public void TC002_AdminCanCreateNewDealer() {

        this.testControl.getDataFileReader().readAdminPortalData(new File("src/test/resources/TestCaseData/AdminPortal/AdminPortal_Request.xml"));

        AdminUser.loginToAdminPortal();

        AdminUser.createNewDealer(this.testControl.getDataFileReader().adminPortal.getDealerInfo().getDealer().get(0), true);
    }

    @Test
    public void TC003_AdminCanDeleteDealer() {
        this.testControl.getDataFileReader().readAdminPortalData(new File("src/test/resources/TestCaseData/AdminPortal/AdminPortal_Request.xml"));

        AdminUser.loginToAdminPortal();

        AdminUser.deleteDealer(this.testControl.getDataFileReader().adminPortal.getDealerInfo().getDealer().get(0).getName(), true);
    }

}
