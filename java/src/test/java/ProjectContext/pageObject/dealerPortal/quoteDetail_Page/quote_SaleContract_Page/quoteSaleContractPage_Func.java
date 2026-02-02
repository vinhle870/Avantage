package ProjectContext.pageObject.dealerPortal.quoteDetail_Page.quote_SaleContract_Page;


import ProjectContext.BusinessObject.Admin.DealerInfo;
import ProjectContext.BusinessObject.Dealer.QuoteClient;
import ProjectContext.BusinessObject.Dealer.QuoteExchangeVehicle;
import ProjectContext.BusinessObject.Dealer.QuoteInfo;
import ProjectContext.BusinessObject.Dealer.QuoteSaleContract;
import ProjectContext.BusinessObject.Dealer.QuoteVehicle;
import ProjectContext.BusinessObject.Dealer.QuoteWarranty;
import ProjectContext.BusinessObject.Dealer.VehicleInfo;
import ProjectContext.BusinessObject.Pdf.SaleContractPdf;
import ProjectContext.BusinessObject.Pdf.pdfFactory;
import ProjectContext.custom_Func.FileManage;
import ProjectContext.dataReader.GlobalConfigsReader;
import core.browser.Browser;
import core.helper.BrowserHelper;
import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class quoteSaleContractPage_Func {
    QuoteSaleContractPage quoteSaleContractPage;

    public quoteSaleContractPage_Func() {
        this.quoteSaleContractPage = new QuoteSaleContractPage();
    }

    public void fillSaleContractInfo(QuoteSaleContract quoteSaleContract, Boolean submit) {
        quoteSaleContractPage.txt_ContractNumber().fillValue(quoteSaleContract.getContractNumber());

        quoteSaleContractPage.txt_SalesRepName().fillValue(quoteSaleContract.getSalesRepName());

        quoteSaleContractPage.txt_DeliveredAt().fillValue(quoteSaleContract.getDeliveredOn());

        quoteSaleContractPage.txt_signedAt().fillValue(quoteSaleContract.getSignedOn());

        quoteSaleContractPage.txt_signedLocation().fillValue(quoteSaleContract.getSignedLocation());

        quoteSaleContractPage.txt_discountAmount().fillValue(quoteSaleContract.getDiscountAmount());

        quoteSaleContractPage.txt_vehicleMarketValue()
            .fillValue(quoteSaleContract.getVehicleMarketValue());

        quoteSaleContractPage.txt_transitAmount().fillValue(quoteSaleContract.getTransitAmount());

        quoteSaleContractPage.txt_RDPRMAmount().fillValue(quoteSaleContract.getRDPRMAmount());

        quoteSaleContractPage.txt_warrantyAmount().fillValue(quoteSaleContract.getWarrantyAmount());

        quoteSaleContractPage.txt_accessories().fillValue(quoteSaleContract.getAccessories());

        quoteSaleContractPage.txt_accessoriesAmount()
            .fillValue(quoteSaleContract.getAccessoriesAmount());

        quoteSaleContractPage.txt_newTiresDutyAmount()
            .fillValue(quoteSaleContract.getNewTiresDutyAmount());

        quoteSaleContractPage.txt_maintenanceScheduleAmount()
            .fillValue(quoteSaleContract.getMaintenanceScheduleAmount());

        quoteSaleContractPage.txt_replacementInsuranceAmount()
            .fillValue(quoteSaleContract.getReplacementInsuranceAmount());

        quoteSaleContractPage.txt_replacementInsuranceNumber()
            .fillValue(quoteSaleContract.getReplacementInsuranceContractNumber());

        quoteSaleContractPage.txt_loanInsuranceAmount()
            .fillValue(quoteSaleContract.getLoanInsuranceAmount());

        quoteSaleContractPage.txt_loanInsuranceNumber()
            .fillValue(quoteSaleContract.getLoanInsuranceContractNumber());

        quoteSaleContractPage.txt_depositAmount().fillValue(quoteSaleContract.getDepositAmount());

        quoteSaleContractPage.txt_otherClause().fillValue(quoteSaleContract.getOtherClause());

        if (submit) {
            quoteSaleContractPage.btn_Save().click();
        }
    }//void

    /**
     * Download SaleContract PDF File from UI
     *
     * @return String:  File Directory + name for reading purpose
     */
    public String downloadSaleContractPdf() {
        String home_folder = GlobalConfigsReader.getInstance().getTestFileDownloadUrl();

        LocalDateTime current_datetime = LocalDateTime.now();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyMMddhhmmss");

        String datetime_str = current_datetime.format(formatter);

        String filename = home_folder + "SaleContract_" + datetime_str + ".pdf";

        //Navigate to the pdf url
        String pdfFile_Url =
            quoteSaleContractPage.lnk_EmbedPDFUrl().getElement().getAttribute("src");

        //Open the PDF file on new Browser Tab
        Browser.openUrlOnNewTab(pdfFile_Url);

        //Using Save As - Browser page (pdf) to download the file
        BrowserHelper.saveSourcePage(filename);

        //Close the Browser Tab - pdf file
        Browser.closeCurrentTab();

        return filename;
    }

    public String generateExpectedSaleContractPDFContent(QuoteInfo quoteInfo,
                                                                DealerInfo dealerInfo) {
        String pdfTemplate_str = getSaleContractPDFTemplate();

        return mapSaleContractInfoToExpectedPdfContent(quoteInfo, pdfTemplate_str, dealerInfo);
    }

    private static String getSaleContractPDFTemplate() {
        String file =
            GlobalConfigsReader.getInstance().getTestResourceUrl() + "Template" + File.separator +
                "template_SaleContractPdf.txt";

        return new FileManage().getFileContent_func(file);
    }

    private static String mapSaleContractInfoToExpectedPdfContent(QuoteInfo quoteInfo,
                                                                  String pdfContentTemplate,
                                                                  DealerInfo dealerInfo) {

        pdfContentTemplate =
            mapGeneralInfoToContractPdfContent(quoteInfo, pdfContentTemplate, dealerInfo);

        pdfContentTemplate = mapVehicleInfoToContractPdfContent(quoteInfo, pdfContentTemplate);

        pdfContentTemplate = mapContractInfoToContractPdfContent(quoteInfo, pdfContentTemplate);

        pdfContentTemplate =
            mapExchangeVehicleInfoToContractPdfContent(quoteInfo, pdfContentTemplate);

        return pdfContentTemplate;

    }

    private static String mapGeneralInfoToContractPdfContent(QuoteInfo quoteInfo,
                                                             String pdfContentTemplate,
                                                             DealerInfo dealerInfo) {
        QuoteClient client = quoteInfo.getQuoteClient();

        QuoteSaleContract quoteSaleContract = quoteInfo.getQuoteSale().getQuoteSaleContract();

        String Dealer_Company_Name = dealerInfo.getDealer().get(0).getCompanyName();
        String Dealer_Location = dealerInfo.getDealer().get(0).getAddress();
        if (dealerInfo.getDealer().get(0).getCity().isEmpty()) {
            Dealer_Location += dealerInfo.getDealer().get(0).getCity();
        } else {
            Dealer_Location += " " + dealerInfo.getDealer().get(0).getCity();
        }

        if (dealerInfo.getDealer().get(0).getProvince().equals("Quebec")) {
            Dealer_Location += ", QC";
        }
        switch (dealerInfo.getDealer().get(0).getProvince()) {
            case "Quebec":
                Dealer_Location += ", QC";
                break;
            case "New Brunswick":
                Dealer_Location += ", NB";
                break;
            case "Ontario":
                Dealer_Location += ", ON";
                break;
            case "Nova Scotia":
                Dealer_Location += ", NS";
                break;
            case "Alberta":
                Dealer_Location += ", AB";
                break;
            case "British Columbia":
                Dealer_Location += ", BC";
                break;
            case "Manitoba":
                Dealer_Location += ", MB";
                break;
            case "Saskatchewan":
                Dealer_Location += ", SK";
                break;
            case "Prince Edward Island":
                Dealer_Location += ", PE";
                break;
            case "Newfoundland and Labrador":
                Dealer_Location += ", NL";
                break;
            case "Nunavut":
                Dealer_Location += ", NU";
                break;
            case "Yukon":
                Dealer_Location += ", YT";
                break;
            case "Northwest territories":
                Dealer_Location += ", NT";
                break;
        }


        String Dealer_PostalCode = dealerInfo.getDealer().get(0).getPostalCode();
        String Dealer_Phone = dealerInfo.getDealer().get(0).getPhone();

        String Dealer_RegistrationPST = dealerInfo.getDealer().get(0).getRegistrationPST();
        String Dealer_RegistrationGST = dealerInfo.getDealer().get(0).getRegistrationGST();

        String Dealer_LicenseNumber = dealerInfo.getDealer().get(0).getLicenseNo();

        QuoteWarranty warranty = quoteInfo.getQuoteWarranty();

        String result = pdfContentTemplate;
        result = result.replace("${Contract_Number}", quoteSaleContract.getContractNumber());
        result = result.replace("${Contract_SalesRepName}", quoteSaleContract.getSalesRepName());
        result = result.replace("${Contract_Signedon}", quoteSaleContract.getSignedOn());
        if (quoteSaleContract.getSignedLocation().isEmpty()) {
            result =
                result.replace("${Contract_Signedlocation}", quoteSaleContract.getSignedLocation());
        } else {
            result = result.replace("${Contract_Signedlocation}",
                " " + quoteSaleContract.getSignedLocation());
        }

        result = result.replace("${Dealer_Name}", Dealer_Company_Name);
        result = result.replace("${Dealer_Location}", Dealer_Location);
        result = result.replace("${Dealer_PostalCode}", Dealer_PostalCode);
        result = result.replace("${Dealer_Phone}", Dealer_Phone);
        result = result.replace("${Dealer_RegistrationPST}", Dealer_RegistrationPST);

        if (Dealer_RegistrationGST.isEmpty()) {
            result = result.replace("${Dealer_RegistrationGST}", Dealer_RegistrationGST);
        } else {
            result = result.replace("${Dealer_RegistrationGST}", " " + Dealer_RegistrationGST);
        }
        result = result.replace("${Dealer_LicenseNumber}", Dealer_LicenseNumber);

        result = result.replace("${ClientFirstName}", client.getFirstName());
        if (client.getIndianStatusCertificate().isEmpty()) {
            result = result.replace("${ClientLastName}", client.getLastName());
        } else {
            result = result.replace("${ClientLastName}",
                client.getLastName() + " (" + client.getIndianStatusCertificate() +
                    ") - Hereafter, to be known as CSSI / SCIS");
        }
        result = result.replace("${ClientEmail}", client.getEmail());
        result = result.replace("${ClientAddress}", client.getAddress());

        if (client.getAddress2().isEmpty()) {
            result = result.replace("${ClientAddress2}", client.getAddress2());
        } else {
            result = result.replace("${ClientAddress2}", " " + client.getAddress2());
        }

        result = result.replace("${ClientDriverLicense}", client.getDriversLicense());
        result = result.replace("${ClientCity}", client.getCity());
        result = result.replace("${ClientPhone}", client.getTelWork());
        result = result.replace("${ClientPROVINCE}", client.getProvince());
        result = result.replace("${ClientSecOwnerOrComp}", client.getSecondaryOwnerOrCompany());
        result = result.replace("${ClientPostal}", client.getPostalCode());
        result = result.replace("${ClientCELL}", client.getTelHome());
        result = result.replace("${WarrantID}", warranty.getWarrantyID());

        return result;

    }

    private static String mapVehicleInfoToContractPdfContent(QuoteInfo quoteInfo,
                                                             String pdfContentTemplate) {
        VehicleInfo vehicleInfo = quoteInfo.getQuoteVehicle().getVehicleInfo();
        pdfContentTemplate = pdfContentTemplate.replace("${Vehicle_MAKE}", vehicleInfo.getBranch());
        pdfContentTemplate = pdfContentTemplate.replace("${Vehicle_MODEL}", vehicleInfo.getModel());
        pdfContentTemplate = pdfContentTemplate.replace("${Vehicle_YEAR}", vehicleInfo.getYear());
        pdfContentTemplate = pdfContentTemplate.replace("${Vehicle_VIN}", vehicleInfo.getVIN());
        pdfContentTemplate =
            pdfContentTemplate.replace("${Vehicle_CYLINDERS}", vehicleInfo.getCylinders());
        pdfContentTemplate =
            pdfContentTemplate.replace("${Vehicle_ EngineSize}", vehicleInfo.getEngineSize());
        pdfContentTemplate = pdfContentTemplate.replace("${Vehicle_ EngineSizeUnit}",
            vehicleInfo.getEngineSizeUnit());

        String isAutomatic = "x";
        if (vehicleInfo.getFuelType().equals("DIESEL")) {
            isAutomatic += " x";
        }
        if (vehicleInfo.getIsTurboEngine().equals("Yes")) {
            isAutomatic += " x";
        }
        if (vehicleInfo.getIs4X4().equals("Yes")) {
            isAutomatic += " x";
        }
        if (vehicleInfo.getIsAllWheelDrive().equals("Yes")) {
            isAutomatic += " x";
        }

        pdfContentTemplate = pdfContentTemplate.replace("${Vehicle_Automatic}", isAutomatic);
        pdfContentTemplate =
            pdfContentTemplate.replace("${Vehicle_CONDITION}", vehicleInfo.getCondition());
        pdfContentTemplate = pdfContentTemplate.replace("${Vehicle_km}", vehicleInfo.getKm());
        pdfContentTemplate =
            pdfContentTemplate.replace("${Vehicle_ID}", vehicleInfo.getVehicleID());
        pdfContentTemplate = pdfContentTemplate.replace("${Vehicle_Price}",
            String.format("%,.2f", Double.parseDouble(quoteInfo.getQuoteVehicle().getPrice())));

        return pdfContentTemplate;
    }

    private static String mapExchangeVehicleInfoToContractPdfContent(QuoteInfo quoteInfo,
                                                                     String pdfContentTemplate) {
        QuoteExchangeVehicle vehicleInfo = quoteInfo.getQuoteSale().getQuoteExchangeVehicle();
        pdfContentTemplate = pdfContentTemplate.replace("${ExchangeVehicle_Make_Model}",
            vehicleInfo.getBranch() + " " + vehicleInfo.getModel());
        pdfContentTemplate = pdfContentTemplate.replace("${ExchangeVehicle_Vin_CYLINDERS}",
            vehicleInfo.getVIN() + " " + vehicleInfo.getCylinders());
        pdfContentTemplate = pdfContentTemplate.replace("${ExchangeVehicle_LicensePlateNumber_KM}",
            vehicleInfo.getLicensePlateNumber() + " " + vehicleInfo.getKm());

        if (vehicleInfo.getIsAccommodationSale().equals("Yes")) {
            pdfContentTemplate = pdfContentTemplate.replace("${ExchangeVehicle_RealKM}",
                vehicleInfo.getRealKilometers() + "x\n" +
                    vehicleInfo.getAccommodationSaleContractNumber());
        } else {
            pdfContentTemplate = pdfContentTemplate.replace("${ExchangeVehicle_RealKM}",
                vehicleInfo.getRealKilometers() + "x");
        }

        pdfContentTemplate =
            pdfContentTemplate.replace("${ExchangeVehicle_Year}", vehicleInfo.getYear());
        if (!vehicleInfo.getTaxRegistration().isEmpty()) {
            pdfContentTemplate = pdfContentTemplate.replace("${ExchangeVehicle_TaxRegistration}",
                " " + vehicleInfo.getTaxRegistration());
        } else {
            pdfContentTemplate = pdfContentTemplate.replace("${ExchangeVehicle_TaxRegistration}",
                vehicleInfo.getTaxRegistration());
        }

        pdfContentTemplate = pdfContentTemplate.replace("${ExchangeVehicle_BalanceAmount}",
            vehicleInfo.getBalanceAmount());

        pdfContentTemplate =
            pdfContentTemplate.replace("${ExchangeVehicle_Bank}", vehicleInfo.getBank());

        return pdfContentTemplate;

    }

    private static String mapContractInfoToContractPdfContent(QuoteInfo quoteInfo,
                                                              String pdfContentTemplate) {
        QuoteSaleContract input_SaleContract = quoteInfo.getQuoteSale().getQuoteSaleContract();

        QuoteVehicle input_QuoteVehicle = quoteInfo.getQuoteVehicle();
        QuoteClient input_QuoteClient = quoteInfo.getQuoteClient();
        QuoteExchangeVehicle input_QuoteExchangeVehicle =
            quoteInfo.getQuoteSale().getQuoteExchangeVehicle();
        QuoteWarranty input_QuoteWarranty = quoteInfo.getQuoteWarranty();

        SaleContractPdf saleContractPdf =
            new pdfFactory().createSaleContractPdf(input_SaleContract, input_QuoteVehicle,
                input_QuoteExchangeVehicle, input_QuoteWarranty, input_QuoteClient);

        pdfContentTemplate = pdfContentTemplate.replace("${Contract_DeliveredOn}",
            input_SaleContract.getDeliveredOn());
        pdfContentTemplate = pdfContentTemplate.replace("${Contract_DISCOUNT}",
            String.format("%,.2f", Double.parseDouble(input_SaleContract.getDiscountAmount())));
        pdfContentTemplate = pdfContentTemplate.replace("${Contract_NETSUBTOTAL}",
            String.format("%,.2f",
                Double.parseDouble(saleContractPdf.getC_NetSubTotal().toString())));
        pdfContentTemplate = pdfContentTemplate.replace("${Contract_EXCHANGE}",
            String.format("%,.2f",
                Double.parseDouble(input_QuoteExchangeVehicle.getValueAmount())));

        if (saleContractPdf.getE_SubTotalWithExchange() < 0) {
            pdfContentTemplate = pdfContentTemplate.replace("${Contract_SUBTOTALWITHEXCHANGE}",
                String.format("(%,.2f)", Math.abs(
                    Double.parseDouble(saleContractPdf.getE_SubTotalWithExchange().toString()))));
        } else {
            pdfContentTemplate = pdfContentTemplate.replace("${Contract_SUBTOTALWITHEXCHANGE}",
                String.format("%,.2f",
                    Double.parseDouble(saleContractPdf.getE_SubTotalWithExchange().toString())));
        }

        pdfContentTemplate = pdfContentTemplate.replace("${Contract_F_GST}",
            String.format("%,.2f", Double.parseDouble(saleContractPdf.getF_GST().toString())));

        if (saleContractPdf.getG_SubTotalBeforeQST() < 0) {
            pdfContentTemplate = pdfContentTemplate.replace("${Contract_G_SUBTOTALBeforeQST}",
                String.format("(%,.2f)", Math.abs(
                    Double.parseDouble(saleContractPdf.getG_SubTotalBeforeQST().toString()))));
        } else {
            pdfContentTemplate = pdfContentTemplate.replace("${Contract_G_SUBTOTALBeforeQST}",
                String.format("%,.2f",
                    Double.parseDouble(saleContractPdf.getG_SubTotalBeforeQST().toString())));
        }

        pdfContentTemplate = pdfContentTemplate.replace("${Contract_H_MARKETVALUE}",
            String.format("%,.2f", Double.parseDouble(input_SaleContract.getVehicleMarketValue())));
        pdfContentTemplate = pdfContentTemplate.replace("${Contract_I_QST}",
            String.format("%,.2f", Double.parseDouble(saleContractPdf.getI_QST().toString())));

        if (saleContractPdf.getJ_SubTotal() < 0) {
            pdfContentTemplate = pdfContentTemplate.replace("${Contract_J_SUBTOTAL}",
                String.format("(%,.2f)",
                    Math.abs(Double.parseDouble(saleContractPdf.getJ_SubTotal().toString()))));
        } else {
            pdfContentTemplate = pdfContentTemplate.replace("${Contract_J_SUBTOTAL}",
                String.format("%,.2f",
                    Double.parseDouble(saleContractPdf.getJ_SubTotal().toString())));
        }

        pdfContentTemplate = pdfContentTemplate.replace("${Contract_K_BALANCEDUEONEXCHANGEVEHICLE}",
            String.format("%,.2f",
                Double.parseDouble(input_QuoteExchangeVehicle.getBalanceAmount())));

        if (saleContractPdf.getL_Total() < 0) {
            pdfContentTemplate = pdfContentTemplate.replace("${Contract_L_TOTAL}",
                String.format("(%,.2f)",
                    Math.abs(Double.parseDouble(saleContractPdf.getL_Total().toString()))));
        } else {
            pdfContentTemplate = pdfContentTemplate.replace("${Contract_L_TOTAL}",
                String.format("%,.2f",
                    Double.parseDouble(saleContractPdf.getL_Total().toString())));
        }

        pdfContentTemplate = pdfContentTemplate.replace("${Contract_Z1_TRANSIT}",
            String.format("%,.2f", Double.parseDouble(input_SaleContract.getTransitAmount())));
        pdfContentTemplate = pdfContentTemplate.replace("${Contract_Z2_RDPRM}",
            String.format("%,.2f", Double.parseDouble(input_SaleContract.getRDPRMAmount())));

        if (saleContractPdf.getSOLDE_TOTAL() < 0) {
            pdfContentTemplate = pdfContentTemplate.replace("${Contract_SOLDETOTAL}",
                String.format("(%,.2f)",
                    Math.abs(Double.parseDouble(saleContractPdf.getSOLDE_TOTAL().toString()))));
        } else {
            pdfContentTemplate = pdfContentTemplate.replace("${Contract_SOLDETOTAL}",
                String.format("%,.2f",
                    Double.parseDouble(saleContractPdf.getSOLDE_TOTAL().toString())));
        }

        pdfContentTemplate = pdfContentTemplate.replace("${Contract_M_EXTENDEDWARRANTY}",
            String.format("%,.2f",
                Double.parseDouble(saleContractPdf.getM_ExtendedWarranty().toString())));
        pdfContentTemplate = pdfContentTemplate.replace("${WarrantID}", "");
        if (saleContractPdf.getN_ACCNumber().isEmpty()) {
            pdfContentTemplate =
                pdfContentTemplate.replace("${Contract_N_ACC}", saleContractPdf.getN_ACCNumber());
        } else {
            pdfContentTemplate = pdfContentTemplate.replace("${Contract_N_ACC}",
                saleContractPdf.getN_ACCNumber() + " ");
        }
        pdfContentTemplate = pdfContentTemplate.replace("${Contract_AccessoriesAmount}",
            String.format("%,.2f", Double.parseDouble(saleContractPdf.getN_ACC().toString())));
        pdfContentTemplate = pdfContentTemplate.replace("${Contract_O_NEWTIRESSPECIFICDUTY}",
            String.format("%,.2f",
                Double.parseDouble(saleContractPdf.getO_NewTiresSpecificDuty().toString())));
        pdfContentTemplate = pdfContentTemplate.replace("${Contract_P_MAINTENANCEPROGRAM}",
            String.format("%,.2f",
                Double.parseDouble(saleContractPdf.getP_MaintenanceProgram().toString())));
        pdfContentTemplate = pdfContentTemplate.replace("${Contract_Q_GST}",
            String.format("%,.2f", Double.parseDouble(saleContractPdf.getQ_GST_2().toString())));
        pdfContentTemplate = pdfContentTemplate.replace("${Contract_R_QST}",
            String.format("%,.2f", Double.parseDouble(saleContractPdf.getR_QST_2().toString())));
        pdfContentTemplate = pdfContentTemplate.replace("${Contract_S_TOTAL}",
            String.format("%,.2f", Double.parseDouble(saleContractPdf.getS_Total_2().toString())));
        pdfContentTemplate = pdfContentTemplate.replace("${Contract_T_REPLACEMENTINSURANCE}",
            String.format("%,.2f",
                Double.parseDouble(saleContractPdf.getT_ReplaceInsurance().toString())));
        pdfContentTemplate =
            pdfContentTemplate.replace("${Contract_ReplacementInsuranceContractNumber}",
                saleContractPdf.getT_ReplaceInsuranceNumber());
        pdfContentTemplate = pdfContentTemplate.replace("${Contract_U_LIFEDISABILITYINSURANCE}",
            String.format("%,.2f",
                Double.parseDouble(saleContractPdf.getU_Life_DisabilityInsurance().toString())));
        pdfContentTemplate = pdfContentTemplate.replace("${Contract_LoanInsuranceContractNumber}",
            saleContractPdf.getT_ReplaceInsuranceNumber());
        pdfContentTemplate = pdfContentTemplate.replace("${Contract_V_9PERCENTINSURANCETAX}",
            String.format("%,.2f",
                Double.parseDouble(saleContractPdf.getV_NinePercentInsuranceTax().toString())));
        pdfContentTemplate = pdfContentTemplate.replace("${Contract_W_INSURANCESTOTAL}",
            String.format("%,.2f",
                Double.parseDouble(saleContractPdf.getW_InsuranceTotal().toString())));
        pdfContentTemplate = pdfContentTemplate.replace("${Contract_FinancedQSTOrPaidToSAAQ}",
            String.format("%,.2f",
                Double.parseDouble(saleContractPdf.getFinancedQSTOrPaidToSAAQ().toString())));
        pdfContentTemplate = pdfContentTemplate.replace("${Contract_AdvancePayment}",
            String.format("%,.2f",
                Double.parseDouble(saleContractPdf.getAdvancePayment().toString())));

        if (saleContractPdf.getFinancedBalanceIncludeQST() < 0) {
            pdfContentTemplate =
                pdfContentTemplate.replace("${Contract_FINANCEDBALANCEIncludingQST}",
                    String.format("(%,.2f)", Math.abs(Double.parseDouble(
                        saleContractPdf.getFinancedBalanceIncludeQST().toString()))));
        } else {
            pdfContentTemplate =
                pdfContentTemplate.replace("${Contract_FINANCEDBALANCEIncludingQST}",
                    String.format("%,.2f", Double.parseDouble(
                        saleContractPdf.getFinancedBalanceIncludeQST().toString())));
        }

        if (saleContractPdf.getPayableBalanceExcludeQST() < 0) {
            pdfContentTemplate =
                pdfContentTemplate.replace("${Contract_PAYABLEBALANCEExcludingQST}",
                    String.format("(%,.2f)", Math.abs(Double.parseDouble(
                        saleContractPdf.getPayableBalanceExcludeQST().toString()))));
        } else {
            pdfContentTemplate =
                pdfContentTemplate.replace("${Contract_PAYABLEBALANCEExcludingQST}",
                    String.format("%,.2f", Double.parseDouble(
                        saleContractPdf.getPayableBalanceExcludeQST().toString())));
        }

        pdfContentTemplate =
            pdfContentTemplate.replace("${Contract_OTHERCLAUSE}", saleContractPdf.getOtherClause());

        return pdfContentTemplate;
    }

}