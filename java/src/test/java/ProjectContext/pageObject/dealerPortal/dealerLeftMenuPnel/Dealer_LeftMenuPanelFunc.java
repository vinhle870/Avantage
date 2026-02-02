package ProjectContext.pageObject.dealerPortal.dealerLeftMenuPnel;

public class Dealer_LeftMenuPanelFunc {

    Dealer_LeftMenuPanel menu;

    public Dealer_LeftMenuPanelFunc()
            {
        menu = new Dealer_LeftMenuPanel();
    }

    public void goToQuotesPage() {
        menu.lnk_Quotes().click();
    }

    public void goToInventoryPage() {
        menu.lnk_Inventory().click();
    }

    public void logout() {
        menu.lnk_Logout().click();
    }
}
