
package ProjectContext.pageObject.adminPortal.adminNewPriceRulePage;

import core.components.buttons.buttonImpl;
import core.components.buttons.iButton;
import core.components.checkbox.checkboxImpl;
import core.components.checkbox.iCheckbox;
import core.components.dropdowns.dropdownImpl;
import core.components.dropdowns.iDropdown;
import core.components.input.iInput;
import core.components.input.inputImpl;
import core.components.label.iLabel;
import core.components.label.labelImpl;
import core.components.link.iLink;
import core.components.link.linkImpl;
import org.openqa.selenium.By;

public class Admin_NewPriceRulesPage {

    public static iInput txt_Name() {
        return new inputImpl(By.xpath("//*[@id='price_rule_name']"));
    }

    public static iInput txt_Position() {
        return new inputImpl(By.xpath("//*[@id='price_rule_position']"));
    }

    public static iDropdown dpd_Apply_rule_if() {
        return new dropdownImpl(By.xpath("//select[@id='price_rule_applyRuleIf']"));
    }

    public static iLink lnk_Add_Conditions() {
        return new linkImpl(By.xpath("//i[@class='fal fa-plus-circle']"));
    }

    public static iLink lnk_Remove_Conditions() {
        return new linkImpl(By.xpath("//i[@class='fal fa-minus-circle']"));
    }

    public static iLabel lab_Conditions() {
        return new labelImpl(By.xpath("//label[@for='Condition']"));
    }

    public static iDropdown dpd_Apply() {
        return new dropdownImpl(By.xpath("//select[@id='price_rule_actionType']"));
    }

    public static iInput txt_Amount() {
        return new inputImpl(By.xpath("//*[@id='price_rule_actionAmount']"));
    }

    public static iCheckbox cbx_Stop_further_processing() {
        return new checkboxImpl(By.xpath("//*[@id='price_rule_stopFurtherProcessing']"));
    }

    public static iButton btn_Save() {
        return new buttonImpl(By.xpath("//*[@id='price_rule_save']"));
    }
}
