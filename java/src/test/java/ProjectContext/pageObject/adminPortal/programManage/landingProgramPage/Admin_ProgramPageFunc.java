package ProjectContext.pageObject.adminPortal.programManage.landingProgramPage;

import ProjectContext.BusinessObject.Admin.Program;
import org.openqa.selenium.By;

public class Admin_ProgramPageFunc {

    public static Admin_ProgramsPage page;

    public static void openNewProgramPage() {
        Admin_ProgramsPage.lnk_AddNew().click();
    }

    public static void openExistingProgramPage(String programName) {
        Admin_ProgramsPage.tbl_ProgramList().clickOnChild(programName, By.xpath(".//td"));
    }

    public static String findProgramInfoOnList(Program program) {
        return Admin_ProgramsPage.tbl_ProgramList().getRowTextContent(program.getName(), "|");
    }
}
