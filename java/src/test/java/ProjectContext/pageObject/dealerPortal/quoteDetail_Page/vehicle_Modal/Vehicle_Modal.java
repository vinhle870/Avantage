package ProjectContext.pageObject.dealerPortal.quoteDetail_Page.vehicle_Modal;

import core.components.buttons.buttonImpl;
import core.components.buttons.iButton;
import core.components.dropdowns.dropdownImpl;
import core.components.dropdowns.iDropdown;
import core.components.input.iInput;
import core.components.input.inputImpl;
import org.openqa.selenium.By;

public class Vehicle_Modal {

    public static iDropdown ddl_Vehicle()
    {
        return new dropdownImpl(By.xpath("//div[*[@for='quote_vehicle_vehicle']]/div"));
    }

    public static iInput txt_DeliveryDate()
    {
        return new inputImpl(By.cssSelector("[id=quote_vehicle_deliveredAt]"));
    }

    public static iInput txt_Price()
    {
        return new inputImpl(By.cssSelector("[id=quote_vehicle_price]"));
    }

    public static iButton btn_Save()
    {
        return  new buttonImpl(By.cssSelector("[type=submit]"));
    }


}
