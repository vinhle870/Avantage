package ProjectContext.pageObject.dealerPortal.vehicleInventoryPage;

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
import core.components.table.iTable;
import core.components.table.tableImpl;
import org.openqa.selenium.By;

public class AddNewVehicle_Page {

    public iTable tbl_VehicleList() {
        return new tableImpl(By.tagName("table"));
    }

    public iLink lnk_Back() {
        return new linkImpl(By.xpath("//a[@class='btn btn-link text-dark']"));
    }

    public iLink lnk_SelecteVehicle() {
        return new linkImpl(By.cssSelector("[id=dropdownMenuLink1]"));
    }

    public iLink lnk_AddVehicle(String vehicleType) {
        return new linkImpl(
            By.cssSelector("[href='/vehicle/new/edit/" + vehicleType.toUpperCase() + "']"));
    }

    public iInput txt_VehicleVin() {
        return new inputImpl(By.cssSelector("[id=vehicle_VIN]"));
    }

    public iDropdown dpd_VehicleMake() {
        return new dropdownImpl(By.xpath("//div[*[@for='vehicle_make']]/div"));
    }

    public iDropdown dpd_VehicleModel() {
        return new dropdownImpl(By.xpath("//div[*[@for='vehicle_model']]/div"));
    }

    public iInput txt_VehicleYear() {
        return new inputImpl(By.cssSelector("[id=vehicle_year]"));
    }

    public iInput txt_VehiclePrice() {
        return new inputImpl(By.cssSelector("[id=vehicle_price]"));
    }

    public iInput txt_VehicleKM() {
        return new inputImpl(By.cssSelector("[id=vehicle_kilometers]"));
    }

    public iDropdown dpd_VehicleCondition() {
        return new dropdownImpl(By.xpath("//div[*[@for='vehicle_condition']]/div"));
    }

    public iDropdown dpd_VehicleFuelType() {
        return new dropdownImpl(By.xpath("//div[*[@for='vehicle_fuelType']]/div"));
    }

    public iDropdown dpd_VehicleTransmission() {
        return new dropdownImpl(By.xpath("//div[*[@for='vehicle_transmission']]/div"));
    }

    public iInput txt_VehicleCylinders() {
        return new inputImpl(By.cssSelector("[id=vehicle_cylinders]"));
    }

    public iInput txt_VehicleEngineSize() {
        return new inputImpl(By.cssSelector("[id=vehicle_engineSize]"));
    }

    public iDropdown dpd_VehicleEngineSizeUnit() {
        return new dropdownImpl(By.xpath("//div[*[@for='vehicle_engineSizeUnit']]/div"));
    }

    public iDropdown dpd_VehicleDesignation() {
        return new dropdownImpl(By.xpath("//div[*[@for='vehicle_designation']]/div"));
    }

    public iCheckbox cbx_VehicleIsTurbo() {
        return new checkboxImpl(By.cssSelector("[id=vehicle_isTurbo]"));
    }

    public iCheckbox cbx_VehicleIs4x4() {
        return new checkboxImpl(By.cssSelector("[id=vehicle_is4x4]"));
    }

    public iCheckbox cbx_VehicleIsFWD() {
        return new checkboxImpl(By.cssSelector("[id=vehicle_isFWD]"));
    }

    public iInput txt_VehicleManufacturerFullDateEnd() {
        return new inputImpl(By.cssSelector("[id=vehicle_manufacturerFullDateEnd]"));
    }

    public iInput txt_VehicleManufacturerFullKmEnd() {
        return new inputImpl(By.cssSelector("[id=vehicle_manufacturerFullKmEnd]"));
    }

    public iInput txt_VehicleManufacturerPowertrainDateEnd() {
        return new inputImpl(By.cssSelector("[id=vehicle_manufacturerPowertrainDateEnd]"));
    }

    public iInput txt_VehicleManufacturerPowertrainKmEnd() {
        return new inputImpl(By.cssSelector("[id=vehicle_manufacturerPowertrainKmEnd]"));
    }

    public iButton btn_Save() {
        return new buttonImpl(By.cssSelector("[type=submit]"));
    }

}
