package ProjectContext.pageObject.dealerPortal.warrantyDetails_Page;

import core.components.buttons.buttonImpl;
import core.components.buttons.iButton;
import core.components.checkbox.checkboxImpl;
import core.components.checkbox.iCheckbox;
import core.components.datepicker.DatePickerImpl;
import core.components.datepicker.iDatePicker;
import core.components.dropdowns.dropdownImpl;
import core.components.dropdowns.iDropdown;
import core.components.input.iInput;
import core.components.input.inputImpl;
import core.components.link.iLink;
import core.components.link.linkImpl;
import core.components.wrappercomponent.iwrapperComp;
import core.components.wrappercomponent.wrapperCompImpl;
import java.util.List;
import org.openqa.selenium.By;

public class WarrantyDetails_Page {

    public iLink lnk_EmbedPDFUrl() {
        //Usage: get the url to navigate to pdf document
        return new linkImpl(By.tagName("embed"));
    }

    public iLink ProgramHeading(String name) {
        return new linkImpl(
            By.xpath("//form[@name =\"quote_warranty\"]//a[contains(.,\"" + name + "\")]"));
    }

    public List<iwrapperComp> ProgOptionList(String progName) {
        //parentNode = div[@id="program-AX"]
        iwrapperComp parentNode = new wrapperCompImpl(By.cssSelector(
            "[id=" + ProgramHeading(progName).getElement().getAttribute("aria-controls") + "]"));

        return parentNode.getChildWrapperCompos(By.xpath("./*[@class=\"card-body\"]"));
    }

    public List<iwrapperComp> OptionTermNameList(String progName, String optionName) {
        //div[@id="program-AP"]
        iwrapperComp parentNode = new wrapperCompImpl(By.cssSelector(
            "[id=" + ProgramHeading(progName).getElement().getAttribute("aria-controls") + "]"));

        By by = By.xpath(".//*[p[contains(., \"" + optionName + "\")]]//label");

        return parentNode.getChildWrapperCompos(by);

    }

    public List<iwrapperComp> ExtraComponentsNameList() {
        //div[@id="program-AP"]
        iwrapperComp parentNode = new wrapperCompImpl(By.cssSelector("[name=quote_warranty]"));


        By by = By.xpath(".//*[contains(@class,\"component-wrapper\")]//label");

        return parentNode.getChildWrapperCompos(by);

    }

    public iCheckbox chk_OptionTerm(String progName, String optionName, String termName) {
        //div[@id="program-AX"]
        iwrapperComp parentNode = new wrapperCompImpl(By.cssSelector(
            "[id=" + ProgramHeading(progName).getElement().getAttribute("aria-controls") + "]"));

        By by = By.xpath(
            ".//*[p[contains(., \"" + optionName + "\")]]//label[contains(., \"" + termName +
                "\")]");

        return (iCheckbox) parentNode.getChildCheckBox(by);
    }

    public iCheckbox chk_ExtraComponent(String componentName) {
        //For debug
        //List<iwrapperComp> listComp = ExtraComponentsNameList();

        iwrapperComp extraName = ExtraComponentsNameList().stream().
            filter((iwrapperComp cur) -> {
                System.out.println("Current Extra Component: " + cur.getElementText().trim());

                return cur.getElementText().trim().equals(componentName);

            })
            .findAny().orElse(null);

        return (iCheckbox) extraName.getChildCheckBox(By.xpath(".//input"));

    }

    public iInput txt_SalePrice() {
        return new inputImpl(By.cssSelector("[id=quote_warranty_salePrice"));
    }

    public iDropdown ddl_FinancingCompany() {
        return new dropdownImpl(By.cssSelector("[id=quote_warranty_financingCompany]"));
    }

    public iInput txt_VehicleDeliveryDate() {
        return new inputImpl(By.cssSelector("[id=quote_warranty_deliveredAt"));
    }

    public iInput txt_WarrantyStartDate() {
        return new inputImpl(By.cssSelector("[id=quote_warranty_warrantyStartDate"));
    }

    public iDatePicker clendar_DatePicker(String guid) {
        return new DatePickerImpl(By.xpath("//*[@guid='"+ guid + "']"));
    }

    public iCheckbox chk_SameAsDeliveryDate() {
        return new checkboxImpl(By.cssSelector("[id=quote_warranty_isSameAsDeliveryDate]"));
    }

    public iLink lnk_backToQuote() {
        return new linkImpl(By.cssSelector("a[href*=details]"));
    }

    public iLink lnk_finalizeSale() {
        return new linkImpl(By.cssSelector("a[href*=finalize]"));
    }

    public iButton btn_Save() {
        return new buttonImpl(By.cssSelector("[type=submit]"));
    }


}
