package ProjectContext.pageObject.adminPortal.adminNewDealerPage;


import ProjectContext.BusinessObject.Admin.Dealer;

public class Admin_NewDealerPageFunc {

    public static void fillNewDealerForm(Dealer dealer, boolean submit) {
        Admin_NewDealersPage.txt_Email().fillValue(dealer.getEmail());
        Admin_NewDealersPage.txt_Name().fillValue(dealer.getName());
        Admin_NewDealersPage.txt_Phone().fillValue(dealer.getPhone());
        Admin_NewDealersPage.txt_Fax().fillValue(dealer.getFax());
        Admin_NewDealersPage.txt_Company_name().fillValue(dealer.getCompanyName());
        Admin_NewDealersPage.txt_Address().fillValue(dealer.getAddress());
        Admin_NewDealersPage.txt_City().fillValue(dealer.getCity());
        Admin_NewDealersPage.dpd_Province().selectOption(dealer.getProvince());
        Admin_NewDealersPage.txt_Postal_code().fillValue(dealer.getPostalCode());
        Admin_NewDealersPage.txt_Internal_id().fillValue(dealer.getInternalId());
        Admin_NewDealersPage.txt_Contact_title().fillValue(dealer.getContactTitle());
        Admin_NewDealersPage.txt_License_no().fillValue(dealer.getLicenseNo());
        Admin_NewDealersPage.txt_Registration_GST().fillValue(dealer.getRegistrationGST());
        Admin_NewDealersPage.txt_Registration_PST().fillValue(dealer.getRegistrationPST());
        Admin_NewDealersPage.dpd_Group().selectOption(dealer.getGroup());
        Admin_NewDealersPage.txt_Notes().fillValue(dealer.getNotes());
        Admin_NewDealersPage.dpd_Humania_Commission_Rate().selectOption(dealer.getHumaniaCommissionRate());
        if (submit) Admin_NewDealersPage.btn_Save().click();
    }
}
