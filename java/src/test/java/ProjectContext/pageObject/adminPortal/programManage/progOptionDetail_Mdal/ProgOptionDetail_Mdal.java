package ProjectContext.pageObject.adminPortal.programManage.progOptionDetail_Mdal;

import core.components.buttons.buttonImpl;
import core.components.buttons.iButton;
import core.components.input.iInput;
import core.components.input.inputImpl;
import org.openqa.selenium.By;

public class ProgOptionDetail_Mdal {

    public static iInput txt_Name()
    {
        return new inputImpl(By.cssSelector("[id=\"program_option_name\"]"));
    }

    public static iInput txt_Code()
    {
        return new inputImpl(By.cssSelector("[id=\"program_option_code\"]"));
    }

    public static iButton btn_Save()
    {
        return new buttonImpl(By.cssSelector("[type=\"submit\"]"));
    }
}
