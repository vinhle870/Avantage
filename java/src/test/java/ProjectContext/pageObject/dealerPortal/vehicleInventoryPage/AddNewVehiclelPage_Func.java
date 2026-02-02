package ProjectContext.pageObject.dealerPortal.vehicleInventoryPage;

import ProjectContext.BusinessObject.Dealer.VehicleInfo;

public class AddNewVehiclelPage_Func {
    public AddNewVehicle_Page addNewVehiclePage;

    public AddNewVehiclelPage_Func() {
        this.addNewVehiclePage = new AddNewVehicle_Page();
    }

    public void fillNewVehicleInfo(VehicleInfo vehicleInfo, boolean submit)
        throws InterruptedException {
        addNewVehiclePage.txt_VehicleVin().fillValue(vehicleInfo.getVIN());

        addNewVehiclePage.dpd_VehicleMake().selectOption(vehicleInfo.getBranch());

        Thread.sleep(3000);

        addNewVehiclePage.dpd_VehicleModel().selectOption(vehicleInfo.getModel());

        addNewVehiclePage.txt_VehicleYear().fillValue(vehicleInfo.getYear());

        addNewVehiclePage.txt_VehiclePrice().fillValue(vehicleInfo.getPrice());

        addNewVehiclePage.txt_VehicleKM().fillValue(vehicleInfo.getKm());

        addNewVehiclePage.dpd_VehicleCondition().selectOption(vehicleInfo.getCondition());

        addNewVehiclePage.dpd_VehicleFuelType().selectOption(vehicleInfo.getFuelType());

        addNewVehiclePage.dpd_VehicleTransmission().selectOption(vehicleInfo.getTransmission());

        addNewVehiclePage.txt_VehicleCylinders().fillValue(vehicleInfo.getCylinders());

        addNewVehiclePage.txt_VehicleEngineSize().fillValue(vehicleInfo.getEngineSize());

        addNewVehiclePage.dpd_VehicleEngineSizeUnit()
            .selectOption(vehicleInfo.getEngineSizeUnit());

        addNewVehiclePage.dpd_VehicleDesignation().selectOption(vehicleInfo.getDesignation());

        if (vehicleInfo.getIsTurboEngine().contains("Yes")) {
            addNewVehiclePage.cbx_VehicleIsTurbo().select();
        }

        if (vehicleInfo.getIs4X4().contains("Yes")) {
            addNewVehiclePage.cbx_VehicleIs4x4().select();
        }

        if (vehicleInfo.getIsAllWheelDrive().contains("Yes")) {
            addNewVehiclePage.cbx_VehicleIsFWD().select();
        }

        addNewVehiclePage.txt_VehicleManufacturerFullDateEnd()
            .fillValue(vehicleInfo.getFullCoverageEndDate());

        addNewVehiclePage.txt_VehicleManufacturerFullKmEnd()
            .fillValue(vehicleInfo.getFullCoverageMaxMile());

        addNewVehiclePage.txt_VehicleManufacturerPowertrainDateEnd()
            .fillValue(vehicleInfo.getPowertrainCoverageEndDate());

        addNewVehiclePage.txt_VehicleManufacturerPowertrainKmEnd()
            .fillValue(vehicleInfo.getPowertrainCoverageMaxMile());

        if (submit) {
            addNewVehiclePage.btn_Save().click();
        }

        backToVehicleList();

        updateVehicleId(vehicleInfo);
    }

    public void backToVehicleList() {
        addNewVehiclePage.lnk_Back().click();
    }

    public void selectVehicle() {
        addNewVehiclePage.lnk_SelecteVehicle().click();
    }

    public void openAddNewVehicleModal(String vehicleType) {
        addNewVehiclePage.lnk_AddVehicle(vehicleType).click();
    }

    public String getAddedVehicle(String separator) {
        return addNewVehiclePage.tbl_VehicleList().getFirstRow(separator);
    }

    public void updateVehicleId(VehicleInfo vehicleInfo) {
        String firstRow = getAddedVehicle(",");
        vehicleInfo.setVehicleID(firstRow.split(",")[0]);
    }

}
