package ProjectContext.pageObject.adminPortal.programManage.progTermMdal;

import core.components.buttons.buttonImpl;
import core.components.buttons.iButton;
import core.components.input.iInput;
import core.components.input.inputImpl;
import org.openqa.selenium.By;

public class ProgTerm_Modal {

    public static iInput txt_EligYears()
    {
        return new inputImpl(By.cssSelector("[id=\"program_term_eligibilityYears\"]"));
    }

    public static iInput txt_EligKm()
    {
        return new inputImpl(By.cssSelector("[id=\"program_term_eligibilityKm\"]"));
    }

    public static iInput txt_TermMonths()
    {
        return new inputImpl(By.cssSelector("[id=\"program_term_termMonths\"]"));
    }

    public static iInput txt_TermKm()
    {
        return new inputImpl(By.cssSelector("[id=\"program_term_termKm\"]"));
    }


    public static iInput txt_FranchiseAmount()
    {
       return new inputImpl(By.cssSelector("[id=\"program_term_franchiseAmount\"]"));
    }

    public static iInput txt_RepairAmountPerVisit()
    {
        return new inputImpl(By.cssSelector("[id=\"program_term_repairAmountPerVisit\"]"));
    }

    public static iInput txt_RepairAmountTotal()
    {
        return new inputImpl(By.cssSelector("[id=\"program_term_repairAmountTotal\"]"));
    }

    public static iInput txt_RepairAmountText()
    {
        return new inputImpl(By.cssSelector("[id=\"program_term_repairAmountText\"]"));
    }

    public static iButton btn_Save()
    {
        return new buttonImpl(By.cssSelector("[type=\"submit\"]"));
    }


}
