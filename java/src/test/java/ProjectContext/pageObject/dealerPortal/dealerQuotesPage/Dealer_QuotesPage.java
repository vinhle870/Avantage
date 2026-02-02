package ProjectContext.pageObject.dealerPortal.dealerQuotesPage;


import core.components.link.iLink;
import core.components.link.linkImpl;
import org.openqa.selenium.By;

public class Dealer_QuotesPage  {
    public Dealer_QuotesPage() {

    }

    public iLink lnk_CreateAQuote() {
        return new linkImpl(By.cssSelector("[href=\"/quote\"]"));
    }
}
