package ProjectContext.pageObject.adminPortal.adminLeftMenu;


public class Admin_LeftMenuPanelFunc {

    public static void goToUserPage() {
        Admin_LeftMenuPanel.lnk_Users().click();
    }

    public static void goToProgramPage() {
        Admin_LeftMenuPanel.lnk_Programs().click();
    }

    public static void goToPriceRulesPage() {
        Admin_LeftMenuPanel.lnk_CustomPriceRules().click();
    }

    public static void logout() {
        Admin_LeftMenuPanel.lnk_Logout().click();
    }
}
