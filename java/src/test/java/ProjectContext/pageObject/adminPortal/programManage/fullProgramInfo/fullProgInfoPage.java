package ProjectContext.pageObject.adminPortal.programManage.fullProgramInfo;

import core.components.buttons.buttonImpl;
import core.components.buttons.iButton;
import core.components.heading.headingImpl;
import core.components.heading.iHeading;
import core.components.label.iLabel;
import core.components.label.labelImpl;
import core.components.table.iTable;
import core.components.wrappercomponent.iwrapperComp;
import core.components.wrappercomponent.wrapperCompImpl;
import org.openqa.selenium.By;

public class fullProgInfoPage {

    
    public static iHeading topHeading()
    {
        return new headingImpl(By.tagName("h1"));
    }

    public static iHeading innerHeading()
    {
        return new headingImpl(By.cssSelector(".h4 mb-2"));
    }

    public static iLabel lbl_ProgName()
    {
        return new labelImpl(By.xpath("//div[strong[.=\"Name: \"]]"));
    }

    public static iLabel lbl_ProgDescr()
    {
        return new labelImpl(By.xpath("//div[strong[.=\"Description: \"]]"));
    }

    public iLabel lbl_ProgCode()
    {
        return new labelImpl(By.xpath("//div[strong[.=\"Code: \"]]"));
    }
    public iLabel lbl_ProgType()
    {
        return new labelImpl(By.xpath("//div[strong[.=\"Type: \"]]"));
    }

    public iLabel lbl_WarrantyCondt()
    {
        return new labelImpl(By.xpath("//div[strong[.=\"Warranty Conditions: \"]]"));
    }

    public static iwrapperComp section_ProgOption(String optionName)
    {
        iwrapperComp child = new wrapperCompImpl(By.xpath("//*[p[contains(text(),\""+optionName+"\")]]"));

        return child;

    }

    public static iButton btn_EditOption(String optionName)
    {
        return (iButton) section_ProgOption(optionName).getChildButton(By.xpath(".//*[contains(text(),\"Edit Option\")]"));

    }

    public static iButton btn_AddTerm(String optionName)
    {
        return new buttonImpl(By.xpath("//*[contains(text(),\"Add Term\")]"));
    }

    public static iButton btn_EditProg()
    {
        return new buttonImpl(By.xpath("//ul//*[contains(text(),\"Edit\")]"));
    }

    public static iButton btn_AddOption()
    {
        return new buttonImpl(By.xpath("//*[contains(text(),\"Add Option\")]"));
    }

    public static iTable tbl_TermList(String optionName)
    {
        return (iTable) section_ProgOption(optionName).getChildTable(By.xpath(".//table"));

    }


}
