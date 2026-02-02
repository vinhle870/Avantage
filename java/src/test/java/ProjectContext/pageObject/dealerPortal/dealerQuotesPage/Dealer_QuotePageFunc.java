package ProjectContext.pageObject.dealerPortal.dealerQuotesPage;

public class Dealer_QuotePageFunc {

    public Dealer_QuotesPage page;

    public Dealer_QuotePageFunc() {
        this.page = new Dealer_QuotesPage();
    }

    public void openNewQuotePage() {
        page.lnk_CreateAQuote().click();
    }
}
