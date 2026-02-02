
package ProjectContext.pageObject.adminPortal.programManage.landingProgramPage;

import core.components.link.iLink;
import core.components.link.linkImpl;
import core.components.table.iTable;
import core.components.table.tableImpl;
import org.openqa.selenium.By;

public class Admin_ProgramsPage  {


    public static iLink lnk_AddNew()
    {
       return new linkImpl(By.cssSelector("[href=\"/admin/program/new/edit\"]"));
    }

    public static iTable tbl_ProgramList()
    {
        return new tableImpl(By.tagName("table"));

    }

}
