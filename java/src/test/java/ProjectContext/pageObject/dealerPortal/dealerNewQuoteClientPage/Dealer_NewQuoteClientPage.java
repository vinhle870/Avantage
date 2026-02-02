package ProjectContext.pageObject.dealerPortal.dealerNewQuoteClientPage;


import core.components.buttons.buttonImpl;
import core.components.buttons.iButton;
import core.components.checkbox.checkboxImpl;
import core.components.checkbox.iCheckbox;
import core.components.dropdowns.dropdownImpl;
import core.components.dropdowns.iDropdown;
import core.components.input.iInput;
import core.components.input.inputImpl;
import org.openqa.selenium.By;

public class Dealer_NewQuoteClientPage {

    public Dealer_NewQuoteClientPage() {

    }

    public iInput txt_Email() {
        return new inputImpl(By.xpath("//*[@id='quote_client_email']"));
    }

    public iInput txt_First_name() {
        return new inputImpl(By.xpath("//*[@id='quote_client_firstName']"));
    }

    public iInput txt_Last_name() {
        return new inputImpl(By.xpath("//*[@id='quote_client_lastName']"));
    }

    public iInput txt_Secondary_owner_or_company() {
        return new inputImpl(By.xpath("//*[@id='quote_client_company']"));
    }

    public iInput txt_Distributor_name() {
        return new inputImpl(By.xpath("//*[@id='quote_client_distributorName']"));
    }

    public iInput txt_Address() {
        return new inputImpl(By.xpath("//*[@id='quote_client_address']"));
    }

    public iInput txt_Address2() {
        return new inputImpl(By.xpath("//*[@id='quote_client_address2']"));
    }

    public iInput txt_City() {
        return new inputImpl(By.xpath("//*[@id='quote_client_city']"));
    }

    public iDropdown dpd_Province() {
        return new dropdownImpl(By.xpath("//div[*[@for='quote_client_province']]/div"));
    }

    public iInput txt_Postal_code() {
        return new inputImpl(By.xpath("//*[@id='quote_client_postalCode']"));
    }

    public iInput txt_Tel_home() {
        return new inputImpl(By.xpath("//*[@id='quote_client_telHome']"));
    }

    public iInput txt_Tel_work() {
        return new inputImpl(By.xpath("//*[@id='quote_client_telWork']"));
    }

    public iInput txt_Indian_status_certificate() {
        return new inputImpl(By.xpath("//*[@id='quote_client_indianStatusCertificate']"));
    }

    public iInput txt_Drivers_license() {
        return new inputImpl(By.xpath("//*[@id='quote_client_driversLicense']"));
    }

    public iCheckbox chk_AggreePolicy() {
        return new checkboxImpl(By.xpath("//*[@id='quote_client_isAgreePolicy']"));
    }

    public iButton btn_Save() {
        return new buttonImpl(By.xpath("//*[@type='submit']"));
    }
}
