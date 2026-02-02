package ProjectContext.pageObject.dealerPortal.quoteDetail_Page;

import ProjectContext.BusinessObject.Dealer.QuoteVehicle;
import ProjectContext.pageObject.dealerPortal.quoteDetail_Page.vehicle_Modal.Vehicle_Modal;

public class QuoteDetailPage_Func {
    public QuoteDetail_Page quoteDetailPage;

    public QuoteDetailPage_Func() {
        this.quoteDetailPage = new QuoteDetail_Page();
    }
    public void addQuoteVehicle(QuoteVehicle quotevehicle) {
        quoteDetailPage.btn_AddVehicle().click();

        //NumberFormat currencyformat = NumberFormat.getCurrencyInstance(Locale.US);

        //currencyformat.setMaximumFractionDigits(0);

        String formatPrice = String.format("%,.0f$", Double.parseDouble(quotevehicle.getVehicleInfo().getPrice()));

        String full_vehicleoption = quotevehicle.getVehicleInfo().getBranch()+" "
                                +quotevehicle.getVehicleInfo().getModel() +" "
                                +quotevehicle.getVehicleInfo().getYear()+" "
                                +formatPrice;

        String Vin_Numb = quotevehicle.getVehicleInfo().getVIN();

        Vehicle_Modal.ddl_Vehicle().selectOption(full_vehicleoption+"\n"+Vin_Numb);

        Vehicle_Modal.txt_DeliveryDate().fillValue(quotevehicle.getDeliveryDate());

        Vehicle_Modal.txt_Price().fillValue(quotevehicle.getPrice());

        Vehicle_Modal.btn_Save().click();

    }



    public void openWarrantyDetailsPage() {
        quoteDetailPage.lnk_NewWarranty().click();
    }


    public void openSaleContractDetailsPage()
    {
        quoteDetailPage.lnk_CreateSale().click();
    }

    public void gotoInvoicePageAfterFinalize() {
        quoteDetailPage.lnk_GotoInvoice().click();
    }



}
