package ProjectContext.pageObject.dealerPortal.dealerNewQuoteClientPage;



import ProjectContext.BusinessObject.Dealer.QuoteClient;

public class Dealer_NewQuoteClientPageFunc {

    public Dealer_NewQuoteClientPage page;

    public Dealer_NewQuoteClientPageFunc() {

        page = new Dealer_NewQuoteClientPage();

    }

    public void fillNewClientForm(QuoteClient quoteclient, boolean submit) {
        page.txt_Email().fillValue(quoteclient.getEmail());
        page.txt_First_name().fillValue(quoteclient.getFirstName());
        page.txt_Last_name().fillValue(quoteclient.getLastName());
        page.txt_Secondary_owner_or_company().fillValue(quoteclient.getSecondaryOwnerOrCompany());
        page.txt_Distributor_name().fillValue(quoteclient.getDistributorName());
        page.txt_Address().fillValue(quoteclient.getAddress());
        page.txt_Address2().fillValue(quoteclient.getAddress2());
        page.txt_City().fillValue(quoteclient.getCity());
        page.dpd_Province().selectOption(quoteclient.getProvince());
        page.txt_Postal_code().fillValue(quoteclient.getPostalCode());
        page.txt_Tel_home().fillValue(quoteclient.getTelHome());
        page.txt_Tel_work().fillValue(quoteclient.getTelWork());
        page.txt_Indian_status_certificate().fillValue(quoteclient.getIndianStatusCertificate());
        page.txt_Drivers_license().fillValue(quoteclient.getDriversLicense());
        page.chk_AggreePolicy().select();
        if (submit) page.btn_Save().click();
    }
}
