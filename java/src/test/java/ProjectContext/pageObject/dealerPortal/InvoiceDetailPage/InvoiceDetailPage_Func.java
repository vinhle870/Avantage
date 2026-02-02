package ProjectContext.pageObject.dealerPortal.InvoiceDetailPage;

import ProjectContext.BusinessObject.Admin.DealerInfo;
import ProjectContext.BusinessObject.Dealer.InvoiceInfo;

public class InvoiceDetailPage_Func {
    InvoiceDetail_Page InvoiceDetailPage;

    public InvoiceDetailPage_Func() {
        this.InvoiceDetailPage = new InvoiceDetail_Page();
    }

    public void getInvoiceInfo(InvoiceInfo invoiceInfo) {
        invoiceInfo.setDealerName(InvoiceDetailPage.lbl_DealerName().getText());
        invoiceInfo.setDealerAddress(InvoiceDetailPage.lbl_DealerAddress().getText());
        invoiceInfo.setDealerAddress(InvoiceDetailPage.lbl_DealerAddress().getText());
        invoiceInfo.setDealerLocation(InvoiceDetailPage.lbl_DealerLocation().getText());
        invoiceInfo.setDealerEmail(InvoiceDetailPage.lbl_DealerEmail().getText());
        invoiceInfo.setDealerPhone(InvoiceDetailPage.lbl_DealerPhone().getText());
        invoiceInfo.setInvoiceDescription(InvoiceDetailPage.lbl_InvoiceDescription().getText());
        invoiceInfo.setInvoiceTotal(InvoiceDetailPage.lbl_InvoiceTotal().getText());
        invoiceInfo.setInvoiceGrandTotal(InvoiceDetailPage.lbl_InvoiceGrandTotal().getText());
    }

    public String verifyInvoiceInfo(InvoiceInfo invoiceInfo, DealerInfo dealerInfo) {
        String result = "";
        String dealerProvince = "";

        Double gst = 0.0;
        Double pst = 0.0;

        switch (dealerInfo.getDealer().get(0).getProvince()) {
            case "Quebec":
                dealerProvince = "QC";
                gst = Double.parseDouble(invoiceInfo.getInvoiceTotal().replace("$","")) * 0.05;
                pst = Double.parseDouble(invoiceInfo.getInvoiceTotal().replace("$","")) * 0.09975;
                break;
            case "New Brunswick":
                dealerProvince= "NB";
                gst = Double.parseDouble(invoiceInfo.getInvoiceTotal().replace("$","")) * 0.15;
                pst = 0.0;
                break;
            case "Ontario":
                dealerProvince = "ON";
                gst = Double.parseDouble(invoiceInfo.getInvoiceTotal().replace("$","")) * 0.13;
                pst = 0.0;
                break;
            case "Nova Scotia":
                dealerProvince = "NS";
                gst = Double.parseDouble(invoiceInfo.getInvoiceTotal().replace("$","")) * 0.15;
                pst = 0.0;
                break;
            case "Alberta":
                dealerProvince = "AB";
                gst = Double.parseDouble(invoiceInfo.getInvoiceTotal().replace("$","")) * 0.05;
                pst = 0.0;
                break;
            case "British Columbia":
                dealerProvince = "BC";
                gst = Double.parseDouble(invoiceInfo.getInvoiceTotal().replace("$","")) * 0.05;
                pst = Double.parseDouble(invoiceInfo.getInvoiceTotal().replace("$","")) * 0.07;
                break;
            case "Manitoba":
                dealerProvince += "MB";
                gst = Double.parseDouble(invoiceInfo.getInvoiceTotal().replace("$","")) * 0.05;
                pst = Double.parseDouble(invoiceInfo.getInvoiceTotal().replace("$","")) * 0.07;
                break;
            case "Saskatchewan":
                dealerProvince += "SK";
                gst = Double.parseDouble(invoiceInfo.getInvoiceTotal().replace("$","")) * 0.05;
                pst = Double.parseDouble(invoiceInfo.getInvoiceTotal().replace("$","")) * 0.06;
                break;
            case "Prince Edward Island":
                dealerProvince += "PE";
                gst = Double.parseDouble(invoiceInfo.getInvoiceTotal().replace("$","")) * 0.15;
                pst = 0.0;
                break;
            case "Newfoundland and Labrador":
                dealerProvince += "NL";
                gst = Double.parseDouble(invoiceInfo.getInvoiceTotal().replace("$","")) * 0.15;
                pst = 0.0;
                break;
            case "Nunavut":
                dealerProvince += "NU";
                gst = Double.parseDouble(invoiceInfo.getInvoiceTotal().replace("$","")) * 0.05;
                pst = 0.0;
                break;
            case "Yukon":
                dealerProvince += "YT";
                gst = Double.parseDouble(invoiceInfo.getInvoiceTotal().replace("$","")) * 0.05;
                pst = 0.0;
                break;
            case "Northwest territories":
                dealerProvince += "NT";
                gst = Double.parseDouble(invoiceInfo.getInvoiceTotal().replace("$","")) * 0.05;
                pst = 0.0;
                break;
        }

        if(!invoiceInfo.getDealerName().contains(dealerInfo.getDealer().get(0).getName())) {
            return "Dealer's name";}

        if(!invoiceInfo.getDealerAddress().contains(dealerInfo.getDealer().get(0).getAddress())) {
            return "Dealer's address";}

        if(!invoiceInfo.getDealerLocation().contains(dealerInfo.getDealer().get(0).getPostalCode())) {
            return "Postalcode";}

        if(!invoiceInfo.getDealerLocation().contains(dealerInfo.getDealer().get(0).getCity())) {
            return "Dealer's city";}

        if(!invoiceInfo.getDealerLocation().contains(dealerProvince)) {
            return "Dealer's province";}

        if(!invoiceInfo.getDealerEmail().contains(dealerInfo.getDealer().get(0).getEmail())) {
            return "Dealer's email";}

        if(!invoiceInfo.getDealerPhone().contains(dealerInfo.getDealer().get(0).getPhone())) {
            return "Dealer's phone";}

        if(!InvoiceDetailPage.lbl_AVAddress().getText().contains(invoiceInfo.getTaxInfo1())) {
            return "Tax info 1";}

        if(!InvoiceDetailPage.lbl_AVAddress().getText().contains(invoiceInfo.getTaxInfo2())) {
            return "Tax info 2";}

        if(!InvoiceDetailPage.lbl_AVAddress().getText().contains(invoiceInfo.getApt1())) {
            return "APT address 1";}

        if(!InvoiceDetailPage.lbl_AVAddress().getText().contains(invoiceInfo.getApt2())) {
            return "APT address 2";}

        if(!invoiceInfo.getInvoiceGrandTotal().replace("$","").equals(String.format("%,.2f",gst + pst + Double.parseDouble(invoiceInfo.getInvoiceTotal().replace("$",""))))) {
            return "Grand total";}

        return result;
    }
}
