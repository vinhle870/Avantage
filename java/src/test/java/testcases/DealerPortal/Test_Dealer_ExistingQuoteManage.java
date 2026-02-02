package testcases.DealerPortal;

import ProjectContext.BusinessObject.Dealer.QuoteInfo;
import ProjectContext.BusinessObject.Dealer.VehicleInfo;
import org.junit.jupiter.api.Test;
import testcases.TestBase;

import java.io.File;
import java.text.ParseException;


public class Test_Dealer_ExistingQuoteManage extends TestBase {


    @Test
    public void TC001_SmokeTest_DealerCanCreateNewWarrantyForExistingVehicle() throws InterruptedException, ParseException {
        this.testControl.dataFileReader.readDealerPortalData(
            new File(
                "src/test/resources/TestCaseData/DealerPortal/TC010_DealerCanFinishQuoteForClient_DealerPortal.xml"));
        VehicleInfo vehicleInfo =
                this.testControl.dataFileReader.dealerPortal.getQuoteInfo().getQuoteVehicle()
                        .getVehicleInfo();

        QuoteInfo quoteInfo = this.testControl.getDataFileReader().dealerPortal.getQuoteInfo();

        DealerUser.loginToDealerPortal();

        DealerUser.createNewQuote(quoteInfo.getQuoteClient(), true);

        DealerUser.createNewWarranty(quoteInfo, true);

        //DealerUser.navigateToUrl("https://v2staging.garantieavantageplus.ca/quote/6124/warranty/edit");

        String fileDirectory = DealerUser.downloadWarrantyContractPDF();

        String actual_result = DealerUser.readWarrantyContractPDF(fileDirectory);

        this.testControl.getDataFileReader().readAdminPortalData(
                new File("src/test/resources/TestCaseData/AdminPortal/TC_145_AdminPortal_Request.xml"));

        DealerUser.verifyWarrantyContentIsCorrect(actual_result, quoteInfo,
                this.testControl.getDataFileReader().adminPortal.getDealerInfo(),
                vehicleInfo);
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


}

