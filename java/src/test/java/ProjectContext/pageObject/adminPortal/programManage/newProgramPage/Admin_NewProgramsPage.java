
package ProjectContext.pageObject.adminPortal.programManage.newProgramPage;

import core.components.buttons.buttonImpl;
import core.components.buttons.iButton;
import core.components.dropdowns.dropdownImpl;
import core.components.dropdowns.iDropdown;
import core.components.input.iInput;
import core.components.input.inputImpl;
import org.openqa.selenium.By;

public class Admin_NewProgramsPage {


    public static iInput txt_Name()
    {
        return new inputImpl(By.cssSelector("input[id=\"program_name\"]"));
    }

    public static iInput txt_Description()
    {
        return new inputImpl(By.cssSelector("input[id=\"program_description\"]"));
    }

    public static iInput txt_Code()
    {
        return new inputImpl(By.cssSelector("input[id=\"program_code\"]"));
    }

    public static iDropdown dpd_WarrantyCondt()
    {
        return  new dropdownImpl(By.xpath("//select[@id='program_customCondition']"));
    }

    public static iDropdown dpd_Wholesaler()
    {
        return  new dropdownImpl(By.xpath("//div[label[text()=\"Wholesaler\"]]"));

    }

    public static iButton btn_Save()
    {
        return new buttonImpl(By.cssSelector("[type=\"submit\"]"));
    }

}
