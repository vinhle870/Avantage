
package testcases.AdminPortal;

import core.enums.Failure_Handler;
import org.junit.jupiter.api.Test;
import testcases.TestBase;

import java.io.File;

public class Admin_ProgramManage extends TestBase {

    @Test
    public void TC001_AdminCanCreateNewProgram() {

        this.testControl.getDataFileReader().readAdminPortalData(new File("src/test/resources/TestCaseData/AdminPortal/AdminPortal_Request.xml"));

        AdminUser.loginToAdminPortal();

        AdminUser.createNewProgram( this.testControl.getDataFileReader().adminPortal.getProgramInfo().getProgram().get(0), true);

        AdminUser.verifyProgramIsAvailableOnProgramList( this.testControl.getDataFileReader().adminPortal.getProgramInfo().getProgram().get(0), Failure_Handler.STOP_RUN);
    }

    @Test
    public void TC006_AdminCanLoginToAdminPortal() {
        AdminUser.loginToAdminPortal();
    }


}

