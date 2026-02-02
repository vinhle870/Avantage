package ProjectContext.stepsDefiniton;


import ProjectContext.BusinessObject.Admin.DealerInfo;
import ProjectContext.BusinessObject.Dealer.*;
import ProjectContext.custom_Func.FileManage;
import ProjectContext.pageObject.common.loginPage.LoginPageFunc;
import ProjectContext.pageObject.dealerPortal.InvoiceDetailPage.InvoiceDetailPage_Func;
import ProjectContext.pageObject.dealerPortal.dealerLeftMenuPnel.Dealer_LeftMenuPanelFunc;
import ProjectContext.pageObject.dealerPortal.dealerNewQuoteClientPage.Dealer_NewQuoteClientPageFunc;
import ProjectContext.pageObject.dealerPortal.dealerQuotesPage.Dealer_QuotePageFunc;
import ProjectContext.pageObject.dealerPortal.quoteDetail_Page.QuoteDetailPage_Func;
import ProjectContext.pageObject.dealerPortal.quoteDetail_Page.quote_SaleContract_Page.quoteSaleContractPage_Func;
import ProjectContext.pageObject.dealerPortal.quoteDetail_Page.vehicle_Modal.Exchange_Vehicle_Modal_Func;
import ProjectContext.pageObject.dealerPortal.vehicleInventoryPage.AddNewVehiclelPage_Func;
import ProjectContext.pageObject.dealerPortal.warrantyDetails_Page.WarrantyDetailsPage_Func;
import core.assertion.TestAssertions;
import core.browser.Browser;
import java.text.ParseException;
import net.serenitybdd.annotations.Step;

public class DealerSteps extends StepsBase {

    private static QuoteDetailPage_Func quoteDetailPageFunc = new QuoteDetailPage_Func();
    private static WarrantyDetailsPage_Func warrantyDetailsPageFunc = new WarrantyDetailsPage_Func();
    private static quoteSaleContractPage_Func quoteSaleContractPageFunc = new quoteSaleContractPage_Func();
    private static AddNewVehiclelPage_Func addNewVehiclelPageFunc = new AddNewVehiclelPage_Func();
    private static InvoiceDetailPage_Func invoiceDetailPageFunc = new InvoiceDetailPage_Func();
    @Step("Dealer goes to Dealer Portal page")
    public void loginToDealerPortal() {
        Browser.openUrl(envInfoReader.dealer.url);

        LoginPageFunc pageFunc = new LoginPageFunc();

        pageFunc.loginToPortal(envInfoReader.dealer.username, envInfoReader.dealer.password);
    }

    @Step("Dealer navigates to page with url")
    public void navigateToUrl(String url) {
        Browser.openUrl(url);

    }

    @Step("Dealer Logout From Portal")
    public void logoutFromDealerPortal() {
        new Dealer_LeftMenuPanelFunc().logout();
    }

    @Step("Dealer Forget Password")
    public void forgetPassword() {
        new LoginPageFunc().forgetPassword();
    }

    @Step("Dealer Create New Quote on Dealer Portal")
    public void createNewQuote(QuoteClient quoteClient, boolean submit) {
        new Dealer_LeftMenuPanelFunc().goToQuotesPage();

        new Dealer_QuotePageFunc().openNewQuotePage();

        new Dealer_NewQuoteClientPageFunc().fillNewClientForm(quoteClient, submit);
    }

    @Step("Dealer Create New Warranty Contract")
    public void createNewWarranty(QuoteInfo quoteInfo, Boolean submit) {
        try {
            //1. Add Quote Vehicle
            quoteDetailPageFunc.addQuoteVehicle(quoteInfo.getQuoteVehicle());

            //2. Select Warranty Program
            quoteDetailPageFunc.openWarrantyDetailsPage();

            warrantyDetailsPageFunc.selectWarrantyProgram(quoteInfo.getQuoteWarranty(), submit);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }

    @Step("Dealer Update Warranty Program")
    public void updateExistingProgram(QuoteInfo quoteInfo, Boolean submit) {
        try {
            warrantyDetailsPageFunc.selectWarrantyProgram(quoteInfo.getQuoteWarranty(), submit);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }



    @Step("Back To Quote From Warranty Detail")
    public void backToQuoteFromWarrantyDetail() {
        warrantyDetailsPageFunc.backToQuote();
    }

    @Step("Go to Invoice detail page after finalize sale")
    public void goToInvoiceAfterFinalizeSale() {
        quoteDetailPageFunc.gotoInvoicePageAfterFinalize();
    }


    @Step("Dealer Downloads the Warranty Contract PDF")
    public String downloadWarrantyContractPDF() {
        return warrantyDetailsPageFunc.downloadWarrantyContractPdf();
    }

    @Step("Dealer Read The Actual Downloaded WarrantyContract PDF File")
    public String readWarrantyContractPDF(String filename) {
        return new FileManage().getFileContent_func(filename);
    }

    @Step("Dealer Create New Warranty Contract")
    public void finalizeSale(Boolean submit) {
        //Finalize Sale
        warrantyDetailsPageFunc.finalizeSale(submit);
    }

    @Step("Dealer Adds Vehicle To Quote Detail")
    public void addQuoteVehicle(QuoteInfo quoteInfo) {
        //1. Add Quote Vehicle
        quoteDetailPageFunc.addQuoteVehicle(quoteInfo.getQuoteVehicle());
    }

    @Step("Dealer Creates Sale Contract Info")
    public void createSaleContractInfo(QuoteSaleContract quoteSaleContract, Boolean submit) {
        quoteDetailPageFunc.openSaleContractDetailsPage();

        quoteSaleContractPageFunc.fillSaleContractInfo(quoteSaleContract, submit);
    }

    /**
     * Download SaleContract PDF File from UI
     *
     * @param filename
     * @return String: FileName
     */
    @Step("Dealer Downloads the Sale Contract PDF")
    public String downloadSaleContractPDF(String filename) {
        return quoteSaleContractPageFunc.downloadSaleContractPdf();
    }

    /**
     * Read the downloaded Sale Contract from the File directory
     *
     * @param filename
     * @return
     */
    @Step("Dealer Read The Actual Downloaded SaleContract PDF File")
    public String readSaleContractPDF(String filename) {
        // String home = System.getProperty("user.home") + "/Downloads/";

        //String filepath = home + filename;

        return new FileManage().getFileContent_func(filename);
    }

    @Step("VERIFICATION POINT: WARRANTY CONTENT MUST BE CORRECT")
    public void verifyWarrantyContentIsCorrect(String actualContent, QuoteInfo expectedQuoteIno,
                                               DealerInfo dealerInfo, VehicleInfo vehicleInfo)
        throws ParseException {
        String failed_msg = "Warranty PDF File is not correct as expected.";
        String expected_content =
            warrantyDetailsPageFunc.generateExpectedWarrantyPDFContent(expectedQuoteIno,
                dealerInfo, vehicleInfo);
        expected_content = expected_content.replace("\r", "");
        expected_content = expected_content.replace("RemoveTax0.00", "");
        expected_content = expected_content.replaceAll("\\n{2,}", "\n");

        TestAssertions.compareStringEquals(actualContent, expected_content, failed_msg);
    }

    @Step("VERIFICATION POINT: SALE CONTRACT CONTENT MUST BE CORRECT")
    public void verifySaleContractContentIsCorrect(String actualContent,
                                                   QuoteInfo expectedQuoteIno,
                                                   DealerInfo dealerInfo) {
        String failed_msg = "Sale Contact PDF File is not correct as expected.";
        String expected_content =
            quoteSaleContractPageFunc.generateExpectedSaleContractPDFContent(expectedQuoteIno,
                dealerInfo);
        expected_content = expected_content.replace("\r", "");
        expected_content = expected_content.replaceAll("(?m)^ \\n", "\n");
        expected_content = expected_content.replaceAll("\\n{2,}", "\n");

        TestAssertions.compareStringEquals(actualContent, expected_content, failed_msg);
    }

    @Step("Dealer Add New Vehicle")
    public void addNewVehicle(VehicleInfo vehicleInfo, Boolean submit) throws InterruptedException {
        // 1.goto Vehicle inventory
        new Dealer_LeftMenuPanelFunc().goToInventoryPage();

        // 2.select vehicle
        addNewVehiclelPageFunc.selectVehicle();

        // 3.open ađ new vehicle modal
        addNewVehiclelPageFunc.openAddNewVehicleModal(vehicleInfo.getVehicleType());

        // 4.Fill data into modal
        addNewVehiclelPageFunc.fillNewVehicleInfo(vehicleInfo, submit);
    }

    @Step("Dealer Add New Vehicle")
    public void addExchangeVehicle(QuoteExchangeVehicle quoteExchangeVehicle, Boolean submit)
        throws InterruptedException {
        // 1.open add exchange vehicle modal
        Exchange_Vehicle_Modal_Func.openExchangeVehicleModal();

        // 2.Fill data into modal
        Exchange_Vehicle_Modal_Func.fillExchangeVehicleInfo(quoteExchangeVehicle, submit);
    }


    @Step("Verify invoice info")
    public void VerifyInvoiceInfo(InvoiceInfo invoiceInfo, DealerInfo dealerInfo) {

        invoiceDetailPageFunc.getInvoiceInfo(invoiceInfo);

        String failed_msg = "Invoice info is not correct as expected.";

        String result = invoiceDetailPageFunc.verifyInvoiceInfo(invoiceInfo, dealerInfo);
        TestAssertions.CheckResultCondition(result, failed_msg);

    }

}
