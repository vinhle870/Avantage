package ProjectContext.pageObject.dealerPortal.dealerLeftMenuPnel;


import core.components.link.iLink;
import core.components.link.linkImpl;
import org.openqa.selenium.By;

public class Dealer_LeftMenuPanel {

    public Dealer_LeftMenuPanel() {
    }

    public iLink lnk_Quotes() {
        return new linkImpl(By.cssSelector("[href=\"/quotes\"]"));
    }

    public iLink lnk_Inventory() {
        return new linkImpl(By.cssSelector("a[href=\"/vehicle/inventory\"]"));
    }

    public iLink lnk_Logout() {
        return new linkImpl(By.cssSelector("[href=\"/logout\"]"));
    }
}
