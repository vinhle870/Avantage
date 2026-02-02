package ProjectContext.pageObject.dealerPortal.quoteDetail_Page.vehicle_Modal;

import ProjectContext.BusinessObject.Dealer.QuoteExchangeVehicle;

public class Exchange_Vehicle_Modal_Func {

    public static void fillExchangeVehicleInfo(QuoteExchangeVehicle quoteExchangeVehicle, boolean submit)
        throws InterruptedException {

        Exchange_Vehicle_Modal.dpd_VehicleMake().selectOption(quoteExchangeVehicle.getBranch());

        Thread.sleep(3000);

        Exchange_Vehicle_Modal.dpd_VehicleModel().selectOption(quoteExchangeVehicle.getModel());

        Exchange_Vehicle_Modal.txt_VehicleVin().fillValue(quoteExchangeVehicle.getVIN());

        Exchange_Vehicle_Modal.txt_VehicleYear().fillValue(quoteExchangeVehicle.getYear());

        Exchange_Vehicle_Modal.txt_VehicleCylinders().fillValue(quoteExchangeVehicle.getCylinders());

        Exchange_Vehicle_Modal.txt_VehicleLicensePlate().fillValue(quoteExchangeVehicle.getLicensePlateNumber());

        Exchange_Vehicle_Modal.txt_VehicleKM().fillValue(quoteExchangeVehicle.getKm());

        if (quoteExchangeVehicle.getIsAccommodationSale().contains("Yes")) Exchange_Vehicle_Modal.cbx_VehicleIsAccommodationSale().select();

        Exchange_Vehicle_Modal.txt_VehicleRealKM().fillValue(quoteExchangeVehicle.getRealKilometers());

        Exchange_Vehicle_Modal.txt_VehicleAccommodationSaleContractNumber().fillValue(quoteExchangeVehicle.getAccommodationSaleContractNumber());

        Exchange_Vehicle_Modal.txt_VehicleTaxRegistration().fillValue(quoteExchangeVehicle.getTaxRegistration());

        Exchange_Vehicle_Modal.txt_VehicleValueAmount().fillValue(quoteExchangeVehicle.getValueAmount());

        Exchange_Vehicle_Modal.txt_VehicleBalanceAmount().fillValue(quoteExchangeVehicle.getBalanceAmount());

        Exchange_Vehicle_Modal.txt_VehicleBank().fillValue(quoteExchangeVehicle.getBank());

        if (submit) {
            Exchange_Vehicle_Modal.btn_Save().click();
        }
    }

    public static void openExchangeVehicleModal() {
        Exchange_Vehicle_Modal.lnk_AddExchangeVehicle().click();
    }
}
