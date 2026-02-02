package testcases.DealerPortal;

import ProjectContext.BusinessObject.Dealer.QuoteInfo;
import ProjectContext.BusinessObject.Dealer.VehicleInfo;
import java.io.File;
import java.text.ParseException;

import testcases.TestBase;
import org.junit.jupiter.api.Test;


public class Test_Dealer_NewQuoteManage extends TestBase {

    @Test
    public void TC007_DealerCanLoginToDealerPortal() {
        DealerUser.loginToDealerPortal();
    }

    @Test
    public void TC008_DealerCanCreateNewQuote() {
        this.testControl.getDataFileReader().readDealerPortalData(new File(
            "src/test/resources/TestCaseData/DealerPortal/TC008_DealerCanCreateNewQuote.xml"));

        DealerUser.loginToDealerPortal();

        DealerUser.createNewQuote(
            this.testControl.getDataFileReader().dealerPortal.getQuoteInfo().getQuoteClient(),
            false);
    }

    @Test
    public void TC010_DealerCanCreateWarranty() throws InterruptedException, ParseException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC010_DealerCanFinishQuoteForClient_DealerPortal.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.createNewWarranty(this.testControl.getDataFileReader().dealerPortal.getQuoteInfo(), true);

        String fileDirectory = DealerUser.downloadWarrantyContractPDF();

        String actual_result = DealerUser.readWarrantyContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifyWarrantyContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo(),
            vehicleInfo);

        DealerUser.backToQuoteFromWarrantyDetail();
//        DealerUser.finalizeSale(true);
    }

    @Test
    public void TC011_DealerCanCreateSaleContractWithExchangeVehicle() throws InterruptedException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC011_DealerCanCreateSaleContractWithExchangeVehicle.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.addExchangeVehicle(quoteInfo.getQuoteSale().getQuoteExchangeVehicle(), true);

        DealerUser.createSaleContractInfo(quoteInfo.getQuoteSale().getQuoteSaleContract(), true);

        String fileDirectory =
            DealerUser.downloadSaleContractPDF("TC011_DealerCanCreateSaleContract.pdf");

        String actual_result = DealerUser.readSaleContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifySaleContractContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo());
    }

    @Test
    public void TC012_DealerCanCreateSaleContract() throws InterruptedException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC012_DealerCanCreateSaleContract.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.createSaleContractInfo(quoteInfo.getQuoteSale().getQuoteSaleContract(), true);

        String fileDirectory =
            DealerUser.downloadSaleContractPDF("TC011_DealerCanCreateSaleContract.pdf");

        String actual_result = DealerUser.readSaleContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifySaleContractContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo());
    }

    @Test
    public void TC0914_DealerCanCreateSaleContractWithExchangeVehicle() throws InterruptedException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC914_DealerCanCreateSaleContractWithExchangeVehicle.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.addExchangeVehicle(quoteInfo.getQuoteSale().getQuoteExchangeVehicle(), true);

        DealerUser.createSaleContractInfo(quoteInfo.getQuoteSale().getQuoteSaleContract(), true);

        String fileDirectory =
            DealerUser.downloadSaleContractPDF("TC914_DealerCanCreateSaleContract.pdf");

        String actual_result = DealerUser.readSaleContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifySaleContractContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo());
    }

    @Test
    public void TC0920_DealerCanCreateSaleContractWithExchangeVehicle() throws InterruptedException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC920_DealerCanCreateSaleContractWithExchangeVehicle.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.addExchangeVehicle(quoteInfo.getQuoteSale().getQuoteExchangeVehicle(), true);

        DealerUser.createSaleContractInfo(quoteInfo.getQuoteSale().getQuoteSaleContract(), true);

        String fileDirectory =
            DealerUser.downloadSaleContractPDF("TC920_DealerCanCreateSaleContract.pdf");

        String actual_result = DealerUser.readSaleContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifySaleContractContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo());
    }

    @Test
    public void TC0921_DealerCanCreateSaleContractWithExchangeVehicle() throws InterruptedException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC921_DealerCanCreateSaleContractWithExchangeVehicle.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.addExchangeVehicle(quoteInfo.getQuoteSale().getQuoteExchangeVehicle(), true);

        DealerUser.createSaleContractInfo(quoteInfo.getQuoteSale().getQuoteSaleContract(), true);

        String fileDirectory =
            DealerUser.downloadSaleContractPDF("TC921_DealerCanCreateSaleContract.pdf");

        String actual_result = DealerUser.readSaleContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifySaleContractContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo());
    }

    @Test
    public void TC0924_DealerCanCreateSaleContractWithExchangeVehicle() throws InterruptedException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC924_DealerCanCreateSaleContractWithExchangeVehicle.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.addExchangeVehicle(quoteInfo.getQuoteSale().getQuoteExchangeVehicle(), true);

        DealerUser.createSaleContractInfo(quoteInfo.getQuoteSale().getQuoteSaleContract(), true);

        String fileDirectory =
            DealerUser.downloadSaleContractPDF("TC924_DealerCanCreateSaleContract.pdf");

        String actual_result = DealerUser.readSaleContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifySaleContractContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo());
    }

    @Test
    public void TC0922_DealerCanCreateSaleContractWithExchangeVehicle() throws InterruptedException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC922_DealerCanCreateSaleContractWithExchangeVehicle.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.addExchangeVehicle(quoteInfo.getQuoteSale().getQuoteExchangeVehicle(), true);

        DealerUser.createSaleContractInfo(quoteInfo.getQuoteSale().getQuoteSaleContract(), true);

        String fileDirectory =
            DealerUser.downloadSaleContractPDF("TC922_DealerCanCreateSaleContract.pdf");

        String actual_result = DealerUser.readSaleContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifySaleContractContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo());
    }

    @Test
    public void TC0923_DealerCanCreateSaleContractWithExchangeVehicle() throws InterruptedException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC923_DealerCanCreateSaleContractWithExchangeVehicle.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.addExchangeVehicle(quoteInfo.getQuoteSale().getQuoteExchangeVehicle(), true);

        DealerUser.createSaleContractInfo(quoteInfo.getQuoteSale().getQuoteSaleContract(), true);

        String fileDirectory =
            DealerUser.downloadSaleContractPDF("TC923_DealerCanCreateSaleContract.pdf");

        String actual_result = DealerUser.readSaleContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifySaleContractContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo());
    }

    @Test
    public void TC1417_DealerCanCreateSaleContract() throws InterruptedException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1417_DealerCanCreateSaleContract.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.createSaleContractInfo(quoteInfo.getQuoteSale().getQuoteSaleContract(), true);

        String fileDirectory =
            DealerUser.downloadSaleContractPDF("TC1417_DealerCanCreateSaleContract.pdf");

        String actual_result = DealerUser.readSaleContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifySaleContractContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo());
    }

    @Test
    public void TC01419_DealerCanCreateSaleContractWithExchangeVehicle() throws InterruptedException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1419_DealerCanCreateSaleContractWithExchangeVehicle.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.addExchangeVehicle(quoteInfo.getQuoteSale().getQuoteExchangeVehicle(), true);

        DealerUser.createSaleContractInfo(quoteInfo.getQuoteSale().getQuoteSaleContract(), true);

        String fileDirectory =
            DealerUser.downloadSaleContractPDF("TC1419_DealerCanCreateSaleContract.pdf");

        String actual_result = DealerUser.readSaleContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifySaleContractContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo());
    }

    @Test
    public void TC01420_DealerCanCreateSaleContractWithExchangeVehicle() throws InterruptedException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1420_DealerCanCreateSaleContractWithExchangeVehicle.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.addExchangeVehicle(quoteInfo.getQuoteSale().getQuoteExchangeVehicle(), true);

        DealerUser.createSaleContractInfo(quoteInfo.getQuoteSale().getQuoteSaleContract(), true);

        String fileDirectory =
            DealerUser.downloadSaleContractPDF("TC1420_DealerCanCreateSaleContract.pdf");

        String actual_result = DealerUser.readSaleContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifySaleContractContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo());
    }

    @Test
    public void TC01421_DealerCanCreateSaleContractWithExchangeVehicle() throws InterruptedException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1421_DealerCanCreateSaleContractWithExchangeVehicle.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.addExchangeVehicle(quoteInfo.getQuoteSale().getQuoteExchangeVehicle(), true);

        DealerUser.createSaleContractInfo(quoteInfo.getQuoteSale().getQuoteSaleContract(), true);

        String fileDirectory =
            DealerUser.downloadSaleContractPDF("TC1421_DealerCanCreateSaleContract.pdf");

        String actual_result = DealerUser.readSaleContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifySaleContractContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo());
    }

    @Test
    public void TC01422_DealerCanCreateSaleContractWithExchangeVehicle() throws InterruptedException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1422_DealerCanCreateSaleContractWithExchangeVehicle.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.addExchangeVehicle(quoteInfo.getQuoteSale().getQuoteExchangeVehicle(), true);

        DealerUser.createSaleContractInfo(quoteInfo.getQuoteSale().getQuoteSaleContract(), true);

        String fileDirectory =
            DealerUser.downloadSaleContractPDF("TC1422_DealerCanCreateSaleContract.pdf");

        String actual_result = DealerUser.readSaleContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifySaleContractContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo());
    }

    @Test
    public void TC01423_DealerCanCreateSaleContractWithExchangeVehicle() throws InterruptedException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1423_DealerCanCreateSaleContractWithExchangeVehicle.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.addExchangeVehicle(quoteInfo.getQuoteSale().getQuoteExchangeVehicle(), true);

        DealerUser.createSaleContractInfo(quoteInfo.getQuoteSale().getQuoteSaleContract(), true);

        String fileDirectory =
            DealerUser.downloadSaleContractPDF("TC1423_DealerCanCreateSaleContract.pdf");

        String actual_result = DealerUser.readSaleContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifySaleContractContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo());
    }

    @Test
    public void TC01424_DealerCanCreateSaleContractWithExchangeVehicle() throws InterruptedException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1424_DealerCanCreateSaleContractWithExchangeVehicle.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.addExchangeVehicle(quoteInfo.getQuoteSale().getQuoteExchangeVehicle(), true);

        DealerUser.createSaleContractInfo(quoteInfo.getQuoteSale().getQuoteSaleContract(), true);

        String fileDirectory =
            DealerUser.downloadSaleContractPDF("TC1424_DealerCanCreateSaleContract.pdf");

        String actual_result = DealerUser.readSaleContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifySaleContractContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo());
    }

    @Test
    public void TC01425_DealerCanCreateSaleContractWithExchangeVehicle() throws InterruptedException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1425_DealerCanCreateSaleContractWithExchangeVehicle.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.addExchangeVehicle(quoteInfo.getQuoteSale().getQuoteExchangeVehicle(), true);

        DealerUser.createSaleContractInfo(quoteInfo.getQuoteSale().getQuoteSaleContract(), true);

        String fileDirectory =
            DealerUser.downloadSaleContractPDF("TC1425_DealerCanCreateSaleContract.pdf");

        String actual_result = DealerUser.readSaleContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifySaleContractContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo());
    }

    @Test
    public void TC01426_DealerCanCreateSaleContractWithExchangeVehicle() throws InterruptedException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1426_DealerCanCreateSaleContractWithExchangeVehicle.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.addExchangeVehicle(quoteInfo.getQuoteSale().getQuoteExchangeVehicle(), true);

        DealerUser.createSaleContractInfo(quoteInfo.getQuoteSale().getQuoteSaleContract(), true);

        String fileDirectory =
            DealerUser.downloadSaleContractPDF("TC1426_DealerCanCreateSaleContract.pdf");

        String actual_result = DealerUser.readSaleContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifySaleContractContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo());
    }

    @Test
    public void TC01427_DealerCanCreateSaleContractWithExchangeVehicle() throws InterruptedException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1427_DealerCanCreateSaleContractWithExchangeVehicle.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.addExchangeVehicle(quoteInfo.getQuoteSale().getQuoteExchangeVehicle(), true);

        DealerUser.createSaleContractInfo(quoteInfo.getQuoteSale().getQuoteSaleContract(), true);

        String fileDirectory =
            DealerUser.downloadSaleContractPDF("TC1427_DealerCanCreateSaleContract.pdf");

        String actual_result = DealerUser.readSaleContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifySaleContractContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo());
    }
    
    @Test
    public void TC1576_DealerCanCreateWarranty() throws InterruptedException, ParseException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1576_DealerCanFinishQuoteForClient_DealerPortal.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.createNewWarranty(
            this.testControl.getDataFileReader().dealerPortal.getQuoteInfo(), true);

        String fileDirectory = DealerUser.downloadWarrantyContractPDF();

        String actual_result = DealerUser.readWarrantyContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifyWarrantyContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo(),
            vehicleInfo);

        DealerUser.backToQuoteFromWarrantyDetail();
//        DealerUser.finalizeSale(true);
    }

    @Test
    public void TC1577_DealerCanCreateWarranty() throws InterruptedException, ParseException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1577_DealerCanFinishQuoteForClient_DealerPortal.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.createNewWarranty(
            this.testControl.getDataFileReader().dealerPortal.getQuoteInfo(), true);

        String fileDirectory = DealerUser.downloadWarrantyContractPDF();

        String actual_result = DealerUser.readWarrantyContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifyWarrantyContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo(),
            vehicleInfo);

        DealerUser.backToQuoteFromWarrantyDetail();
//        DealerUser.finalizeSale(true);
    }

    @Test
    public void TC1578_DealerCanCreateWarranty() throws InterruptedException, ParseException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1578_DealerCanFinishQuoteForClient_DealerPortal.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.createNewWarranty(
            this.testControl.getDataFileReader().dealerPortal.getQuoteInfo(), true);

        String fileDirectory = DealerUser.downloadWarrantyContractPDF();

        String actual_result = DealerUser.readWarrantyContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifyWarrantyContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo(),
            vehicleInfo);

        DealerUser.backToQuoteFromWarrantyDetail();
//        DealerUser.finalizeSale(true);
    }

    @Test
    public void TC1579_DealerCanCreateWarranty() throws InterruptedException, ParseException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1579_DealerCanFinishQuoteForClient_DealerPortal.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.createNewWarranty(
            this.testControl.getDataFileReader().dealerPortal.getQuoteInfo(), true);

        String fileDirectory = DealerUser.downloadWarrantyContractPDF();

        String actual_result = DealerUser.readWarrantyContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifyWarrantyContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo(),
            vehicleInfo);

        DealerUser.backToQuoteFromWarrantyDetail();
//        DealerUser.finalizeSale(true);
    }

    @Test
    public void TC1580_DealerCanCreateWarranty() throws InterruptedException, ParseException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1580_DealerCanFinishQuoteForClient_DealerPortal.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.createNewWarranty(
            this.testControl.getDataFileReader().dealerPortal.getQuoteInfo(), true);

        String fileDirectory = DealerUser.downloadWarrantyContractPDF();

        String actual_result = DealerUser.readWarrantyContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifyWarrantyContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo(),
            vehicleInfo);

        DealerUser.backToQuoteFromWarrantyDetail();
//        DealerUser.finalizeSale(true);
    }

    @Test
    public void TC1581_DealerCanCreateWarranty() throws InterruptedException, ParseException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1581_DealerCanFinishQuoteForClient_DealerPortal.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.createNewWarranty(
            this.testControl.getDataFileReader().dealerPortal.getQuoteInfo(), true);

        String fileDirectory = DealerUser.downloadWarrantyContractPDF();

        String actual_result = DealerUser.readWarrantyContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifyWarrantyContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo(),
            vehicleInfo);

        DealerUser.backToQuoteFromWarrantyDetail();
//        DealerUser.finalizeSale(true);
    }

    @Test
    public void TC1582_DealerCanCreateWarranty() throws InterruptedException, ParseException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1582_DealerCanFinishQuoteForClient_DealerPortal.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.createNewWarranty(
            this.testControl.getDataFileReader().dealerPortal.getQuoteInfo(), true);

        String fileDirectory = DealerUser.downloadWarrantyContractPDF();

        String actual_result = DealerUser.readWarrantyContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifyWarrantyContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo(),
            vehicleInfo);

        DealerUser.backToQuoteFromWarrantyDetail();
//        DealerUser.finalizeSale(true);
    }

    @Test
    public void TC1583_DealerCanCreateWarranty() throws InterruptedException, ParseException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1583_DealerCanFinishQuoteForClient_DealerPortal.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.createNewWarranty(
            this.testControl.getDataFileReader().dealerPortal.getQuoteInfo(), true);

        String fileDirectory = DealerUser.downloadWarrantyContractPDF();

        String actual_result = DealerUser.readWarrantyContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifyWarrantyContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo(),
            vehicleInfo);

        DealerUser.backToQuoteFromWarrantyDetail();
//        DealerUser.finalizeSale(true);
    }

    @Test
    public void TC1584_DealerCanCreateWarranty() throws InterruptedException, ParseException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1584_DealerCanFinishQuoteForClient_DealerPortal.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.createNewWarranty(
            this.testControl.getDataFileReader().dealerPortal.getQuoteInfo(), true);

        String fileDirectory = DealerUser.downloadWarrantyContractPDF();

        String actual_result = DealerUser.readWarrantyContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifyWarrantyContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo(),
            vehicleInfo);

        DealerUser.backToQuoteFromWarrantyDetail();
//        DealerUser.finalizeSale(true);
    }

    @Test
    public void TC15785_DealerCanCreateWarranty() throws InterruptedException, ParseException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1585_DealerCanFinishQuoteForClient_DealerPortal.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.createNewWarranty(
            this.testControl.getDataFileReader().dealerPortal.getQuoteInfo(), true);

        String fileDirectory = DealerUser.downloadWarrantyContractPDF();

        String actual_result = DealerUser.readWarrantyContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifyWarrantyContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo(),
            vehicleInfo);

        DealerUser.backToQuoteFromWarrantyDetail();
//        DealerUser.finalizeSale(true);
    }

    @Test
    public void TC1586_DealerCanCreateWarranty() throws InterruptedException, ParseException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1586_DealerCanFinishQuoteForClient_DealerPortal.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.createNewWarranty(
            this.testControl.getDataFileReader().dealerPortal.getQuoteInfo(), true);

        String fileDirectory = DealerUser.downloadWarrantyContractPDF();

        String actual_result = DealerUser.readWarrantyContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifyWarrantyContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo(),
            vehicleInfo);

        DealerUser.backToQuoteFromWarrantyDetail();
//        DealerUser.finalizeSale(true);
    }

    @Test
    public void TC1587_DealerCanCreateWarranty() throws InterruptedException, ParseException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1587_DealerCanFinishQuoteForClient_DealerPortal.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.createNewWarranty(
            this.testControl.getDataFileReader().dealerPortal.getQuoteInfo(), true);

        String fileDirectory = DealerUser.downloadWarrantyContractPDF();

        String actual_result = DealerUser.readWarrantyContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifyWarrantyContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo(),
            vehicleInfo);

        DealerUser.backToQuoteFromWarrantyDetail();
//        DealerUser.finalizeSale(true);
    }

    @Test
    public void TC1588_DealerCanCreateWarranty() throws InterruptedException, ParseException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC1588_DealerCanFinishQuoteForClient_DealerPortal.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
            this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.createNewWarranty(
            this.testControl.getDataFileReader().dealerPortal.getQuoteInfo(), true);

        String fileDirectory = DealerUser.downloadWarrantyContractPDF();
        String actual_result = DealerUser.readWarrantyContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
            new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifyWarrantyContentIsCorrect(actual_result, quoteInfo,
            this.testControl.getDataFileReader().adminPortal.getDealerInfo(),
            vehicleInfo);

        DealerUser.backToQuoteFromWarrantyDetail();
//        DealerUser.finalizeSale(true);
    }

    @Test
    public void TC1411_DealerCanCreateWarranty() throws InterruptedException, ParseException {
        this.testControl.dataFileReader.readDealerPortalData(
                new File(
                        "src/test/resources/TestCaseData/DealerPortal/TC1411_DealerCanFinishQuoteForClient_DealerPortal.xml"));

        DealerUser.loginToDealerPortal();

        VehicleInfo vehicleInfo =
                this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                        .getVehicleInfo();

        DealerUser.addNewVehicle(vehicleInfo, true);

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.addQuoteVehicle(quoteInfo);

        DealerUser.createNewWarranty(
                this.testControl.getDataFileReader().dealerPortal.getQuoteInfo(), true);

        this.testControl.getDataFileReader().readAdminPortalData(
                new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.backToQuoteFromWarrantyDetail();
        DealerUser.finalizeSale(true);
        DealerUser.goToInvoiceAfterFinalizeSale();
        DealerUser.VerifyInvoiceInfo(this.testControl.dataFileReader.dealerPortal.getInvoiceInfo(), this.testControl.getDataFileReader().adminPortal.getDealerInfo());
    }
}

