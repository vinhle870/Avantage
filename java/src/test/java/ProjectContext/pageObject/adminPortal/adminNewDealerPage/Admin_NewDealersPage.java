
package ProjectContext.pageObject.adminPortal.adminNewDealerPage;

import core.components.buttons.buttonImpl;
import core.components.buttons.iButton;
import core.components.dropdowns.dropdownImpl;
import core.components.dropdowns.iDropdown;
import core.components.input.iInput;
import core.components.input.inputImpl;
import core.components.label.iLabel;
import core.components.label.labelImpl;
import org.openqa.selenium.By;

public class Admin_NewDealersPage{

    public Admin_NewDealersPage() {

    }

    public static iInput txt_Email() {
        return new inputImpl(By.xpath("//*[@id='dealer_email']"));
    }

    public static iInput txt_Name() {
        return new inputImpl(By.xpath("//*[@id='dealer_name']"));
    }

    public static iInput txt_Phone() {
        return new inputImpl(By.xpath("//*[@id='dealer_phone']"));
    }

    public static iInput txt_Fax() {
        return new inputImpl(By.xpath("//*[@id='dealer_fax']"));
    }

    public static iInput txt_Company_name() {
        return new inputImpl(By.xpath("//*[@id='dealer_companyName']"));
    }

    public static iInput txt_Address() {
        return new inputImpl(By.xpath("//*[@id='dealer_address']"));
    }

    public static iInput txt_City() {
        return new inputImpl(By.xpath("//*[@id='dealer_city']"));
    }

    public static iDropdown dpd_Province() {
        return new dropdownImpl(By.xpath("//select[@id='dealer_province']"));
    }

    public static iInput txt_Postal_code() {
        return new inputImpl(By.xpath("//*[@id='dealer_postalCode']"));
    }

    public static iInput txt_Internal_id() {
        return new inputImpl(By.xpath("//*[@id='dealer_internalId']"));
    }

    public static iInput txt_Contact_title() {
        return new inputImpl(By.xpath("//*[@id='dealer_contactTitle']"));
    }

    public static iInput txt_License_no() {
        return new inputImpl(By.xpath("//*[@id='dealer_licenseNo']"));
    }

    public static iInput txt_Registration_GST() {
        return new inputImpl(By.xpath("//*[@id='dealer_registrationTps']"));
    }

    public static iInput txt_Registration_PST() {
        return new inputImpl(By.xpath("//*[@id='dealer_registrationTvq']"));
    }

    public static iDropdown dpd_Group() {
        return new dropdownImpl(By.xpath("//select[@id='dealer_dealerGroup']"));
    }

    public static iInput txt_Notes() {
        return new inputImpl(By.xpath("//*[@id='dealer_notes']"));
    }

    public static iDropdown dpd_Humania_Commission_Rate() {
        return new dropdownImpl(By.xpath("//*[@id='dealer_humaniaCommissionRate']"));
    }

    public static iButton btn_Save() {
        return new buttonImpl(By.xpath("//*[@type='submit']"));
    }

    public static iLabel lab_Dealer_Saved() {
        return new labelImpl(By.xpath("//div[@role='alert' and contains(text(), 'Dealer saved')]"));
    }
}
