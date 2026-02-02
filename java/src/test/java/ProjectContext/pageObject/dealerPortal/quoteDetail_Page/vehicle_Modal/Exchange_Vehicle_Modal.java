package ProjectContext.pageObject.dealerPortal.quoteDetail_Page.vehicle_Modal;

import core.components.buttons.buttonImpl;
import core.components.buttons.iButton;
import core.components.checkbox.checkboxImpl;
import core.components.checkbox.iCheckbox;
import core.components.dropdowns.dropdownImpl;
import core.components.dropdowns.iDropdown;
import core.components.input.iInput;
import core.components.input.inputImpl;
import core.components.link.iLink;
import core.components.link.linkImpl;
import org.openqa.selenium.By;

public class Exchange_Vehicle_Modal {

    public static iLink lnk_AddExchangeVehicle()
    {
        return new linkImpl(By.xpath("//*[contains(@href,\"exchange-vehicle\")]"));
    }

    public static iInput txt_VehicleVin() {
        return new inputImpl(By.cssSelector("[id=exchange_vehicle_VIN]"));
    }

    public static iDropdown dpd_VehicleMake() {
        return new dropdownImpl(By.xpath("//div[*[@for='exchange_vehicle_make']]/div"));
    }

    public static iDropdown dpd_VehicleModel() {
        return new dropdownImpl(By.xpath("//div[*[@for='exchange_vehicle_model']]/div"));
    }

    public static iInput txt_VehicleYear() {
        return new inputImpl(By.cssSelector("[id=exchange_vehicle_year]"));
    }

    public static iInput txt_VehicleCylinders() {
        return new inputImpl(By.cssSelector("[id=exchange_vehicle_cylinders]"));
    }

    public static iInput txt_VehicleLicensePlate() {
        return new inputImpl(By.cssSelector("[id=exchange_vehicle_licensePlateNumber]"));
    }

    public static iInput txt_VehicleKM() {
        return new inputImpl(By.cssSelector("[id=exchange_vehicle_kilometers]"));
    }

    public static iCheckbox cbx_VehicleIsAccommodationSale() {
        return new checkboxImpl(By.cssSelector("[id=exchange_vehicle_isAccommodationSale]"));
    }

    public static iInput txt_VehicleRealKM() {
        return new inputImpl(By.cssSelector("[id=exchange_vehicle_realKilometers]"));
    }

    public static iInput txt_VehicleAccommodationSaleContractNumber() {
        return new inputImpl(By.cssSelector("[id=exchange_vehicle_accommodationSaleContractNumber]"));
    }

    public static iInput txt_VehicleTaxRegistration() {
        return new inputImpl(By.cssSelector("[id=exchange_vehicle_taxRegistration]"));
    }

    public static iInput txt_VehicleValueAmount() {
        return new inputImpl(By.cssSelector("[id=exchange_vehicle_valueAmount]"));
    }

    public static iInput txt_VehicleBalanceAmount() {
        return new inputImpl(By.cssSelector("[id=exchange_vehicle_balanceAmount]"));
    }

    public static iInput txt_VehicleBank() {
        return new inputImpl(By.cssSelector("[id=exchange_vehicle_bank]"));
    }

    public static iButton btn_Save() {
        return new buttonImpl(By.cssSelector("[type=submit]"));
    }
}
