package ProjectContext.pageObject.dealerPortal.warrantyDetails_Page;

import ProjectContext.BusinessObject.Admin.DealerInfo;
import ProjectContext.BusinessObject.Dealer.ExtraComponents;
import ProjectContext.BusinessObject.Dealer.QuoteClient;
import ProjectContext.BusinessObject.Dealer.QuoteInfo;
import ProjectContext.BusinessObject.Dealer.QuoteWarranty;
import ProjectContext.BusinessObject.Dealer.VehicleInfo;
import ProjectContext.custom_Func.FileManage;
import ProjectContext.dataReader.GlobalConfigsReader;
import core.browser.Browser;
import core.helper.BrowserHelper;
import org.openqa.selenium.Keys;

import java.io.File;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;

public class WarrantyDetailsPage_Func {
    WarrantyDetails_Page warrantyDetailsPage;

    public WarrantyDetailsPage_Func() {
        this.warrantyDetailsPage = new WarrantyDetails_Page();
    }


    public void selectWarrantyProgram(QuoteWarranty quoteWarranty, Boolean submit) throws InterruptedException {
        // program expansion state (not currently used)

        String progName = quoteWarranty.getProgramName();

        String optionName = quoteWarranty.getProgramOption();

        String termName = quoteWarranty.getOptionTerm();

        Boolean isDisplayed =
           warrantyDetailsPage.chk_OptionTerm(progName, optionName, termName).getElement()
                .isDisplayed();
        //Click on Program Name incase its not expanded
        if (!isDisplayed) {
           warrantyDetailsPage.ProgramHeading(quoteWarranty.getProgramName()).click();
        }

        //Option - Term
       warrantyDetailsPage.chk_OptionTerm(progName, optionName, termName).click();

        //Extra Component
        selectExtraComponents(quoteWarranty.getExtraComponents());

        //Sale Price
       warrantyDetailsPage.txt_SalePrice().fillValue(quoteWarranty.getSalePrice());

        //VehicleDeliveryDate
       warrantyDetailsPage.txt_VehicleDeliveryDate()
            .fillValue(quoteWarranty.getVehicleDeliveryDate());

        //WarrantyStartDate
        /***
         * /8/27/2025 - chk_SameAsDeliveryDate is removed

        if (quoteWarranty.getSameAsDeliveryDate().equals("true")) {
            //WarrantyDetails_Page.chk_SameAsDeliveryDate().select();
        } else {
           warrantyDetailsPage.txt_WarrantyStartDate()
                .fillValue(quoteWarranty.getWarrantyStartDate());
        }
        ***/
        //Select Start date from date picker
       Thread.sleep(1000);

       warrantyDetailsPage.txt_VehicleDeliveryDate().getElement().sendKeys(Keys.TAB);

       Thread.sleep(1000);

       String guid =warrantyDetailsPage.txt_WarrantyStartDate().getElement().getAttribute("data-guid");

       warrantyDetailsPage.clendar_DatePicker(guid).pickDate(quoteWarranty.getWarrantyStartDate());

        //WarrantyDetails_Page.txt_WarrantyStartDate()
        //       .fillValue(quoteWarranty.getWarrantyStartDate());

        if (submit) {
           warrantyDetailsPage.btn_Save().click();
        }

    }

    public void backToQuote() {
       warrantyDetailsPage.lnk_backToQuote().click();
    }

    public void finalizeSale(Boolean submit) {
       warrantyDetailsPage.lnk_finalizeSale().click();
        if (submit) {
           warrantyDetailsPage.btn_Save().click();
        }
    }

    private void selectExtraComponents(ExtraComponents extraComponents) {

        for (String curCom : extraComponents.getComponnentName()) {
            if (!curCom.isEmpty()) {
               warrantyDetailsPage.chk_ExtraComponent(curCom).click();
            }
        }//for

    }//void

    public String downloadWarrantyContractPdf() {
        String home_folder = GlobalConfigsReader.getInstance().getTestFileDownloadUrl();

        LocalDateTime current_datetime = LocalDateTime.now();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyMMddhhmmss");

        String datetime_str = current_datetime.format(formatter);

        String filename = home_folder + "WarrantyContract_" + datetime_str + ".pdf";

        //Navigate to the pdf url
        String pdfFile_Url =
           warrantyDetailsPage.lnk_EmbedPDFUrl().getElement().getAttribute("src");

        //Open the PDF file on new Browser Tab
        Browser.openUrlOnNewTab(pdfFile_Url);

        //Using Save As - Browser page (pdf) to download the file
        BrowserHelper.saveSourcePage(filename);

        //Close the Browser Tab - pdf file
        Browser.closeCurrentTab();

        return filename;
    }

    private  String getWarrantyPDFTemplate() {
        String file =
            GlobalConfigsReader.getInstance().getTestResourceUrl() + "Template" + File.separator +
                "template_WarrantyContractPdf.txt";

        return new FileManage().getFileContent_func(file);
    }

    public String generateExpectedWarrantyPDFContent(QuoteInfo quoteInfo,
                                                            DealerInfo dealerInfo,
                                                            VehicleInfo vehicleInfo)
        throws ParseException {
        String pdfTemplate_str = getWarrantyPDFTemplate();

        return mapWarrantyContractInfoToExpectedPdfContent(quoteInfo, pdfTemplate_str, dealerInfo,
            vehicleInfo);
    }

    private  String mapWarrantyContractInfoToExpectedPdfContent(QuoteInfo quoteInfo,
                                                                      String pdfContentTemplate,
                                                                      DealerInfo dealerInfo,
                                                                      VehicleInfo vehicleInfo)
        throws ParseException {
        pdfContentTemplate =
            mapGeneralInfoToContractPdfContent(quoteInfo, pdfContentTemplate, vehicleInfo,
                dealerInfo);

        return pdfContentTemplate;
    }

    private  String mapGeneralInfoToContractPdfContent(QuoteInfo quoteInfo,
                                                             String pdfContentTemplate,
                                                             VehicleInfo vehicleInfo,
                                                             DealerInfo dealerInfo)
        throws ParseException {
        QuoteClient client = quoteInfo.getQuoteClient();

        QuoteWarranty quoteWarranty = quoteInfo.getQuoteWarranty();

        Double gst = 0.0;
        Double pst = 0.0;
        String gstText = "";
        String pstText = "";


        String result = pdfContentTemplate;

        switch (dealerInfo.getDealer().get(0).getProvince()) {
            case "Quebec":
                result = result.replace("${DealerProvince}", "QC");
                break;
            case "New Brunswick":
                result = result.replace("${DealerProvince}", "NB");
                break;
            case "Ontario":
                result = result.replace("${DealerProvince}", "ON");
                break;
            case "Nova Scotia":
                result = result.replace("${DealerProvince}", "NS");
                break;
            case "Alberta":
                result = result.replace("${DealerProvince}", "AB");
                break;
            case "British Columbia":
                result = result.replace("${DealerProvince}", "BC");
                break;
            case "Manitoba":
                result = result.replace("${DealerProvince}", "MB");
                break;
            case "Saskatchewan":
                result = result.replace("${DealerProvince}", "SK");
                break;
            case "Prince Edward Island":
                result = result.replace("${DealerProvince}", "PE");
                break;
            case "Newfoundland and Labrador":
                result = result.replace("${DealerProvince}", "NL");
                break;
            case "Nunavut":
                result = result.replace("${DealerProvince}", "NU");
                break;
            case "Yukon":
                result = result.replace("${DealerProvince}", "YT");
                break;
            case "Northwest territories":
                result = result.replace("${DealerProvince}", "NT");
                break;
        }

        switch (quoteInfo.getQuoteClient().getProvince()) {
            case "Québec":
                gst = Double.parseDouble(quoteWarranty.getSalePrice()) * 0.05;
                pst = Double.parseDouble(quoteWarranty.getSalePrice()) * 0.09975;
                gstText = "GST : $";
                pstText = "PST : $";
                break;
            case "New Brunswick":
                gst = Double.parseDouble(quoteWarranty.getSalePrice()) * 0.15;
                pst = 0.0;
                gstText = "HST : $";
                pstText = "RemoveTax";
                break;
            case "Ontario":
                gst = Double.parseDouble(quoteWarranty.getSalePrice()) * 0.13;
                pst = 0.0;
                gstText = "HST : $";
                pstText = "RemoveTax";
                break;
            case "Nova Scotia":
                gst = Double.parseDouble(quoteWarranty.getSalePrice()) * 0.15;
                pst = 0.0;
                gstText = "HST : $";
                pstText = "RemoveTax";
                break;
            case "Alberta":
                result = result.replace("${DealerProvince}", "AB");
                gst = Double.parseDouble(quoteWarranty.getSalePrice()) * 0.05;
                pst = 0.0;
                gstText = "GST : $";
                pstText = "RemoveTax";
                break;
            case "British Columbia":
                gst = Double.parseDouble(quoteWarranty.getSalePrice()) * 0.05;
                pst = Double.parseDouble(quoteWarranty.getSalePrice()) * 0.07;
                gstText = "GST : $";
                pstText = "PST : $";
                break;
            case "Manitoba":
                gst = Double.parseDouble(quoteWarranty.getSalePrice()) * 0.05;
                pst = Double.parseDouble(quoteWarranty.getSalePrice()) * 0.07;
                gstText = "GST : $";
                pstText = "PST : $";
                break;
            case "Saskatchewan":
                gst = Double.parseDouble(quoteWarranty.getSalePrice()) * 0.05;
                pst = Double.parseDouble(quoteWarranty.getSalePrice()) * 0.06;
                gstText = "GST : $";
                pstText = "PST : $";
                break;
            case "Prince Edward Island":
                gst = Double.parseDouble(quoteWarranty.getSalePrice()) * 0.15;
                pst = 0.0;
                gstText = "HST : $";
                pstText = "RemoveTax";
                break;
            case "Newfoundland and Labrador":
                gst = Double.parseDouble(quoteWarranty.getSalePrice()) * 0.15;
                pst = 0.0;
                gstText = "HST : $";
                pstText = "RemoveTax";
                break;
            case "Nunavut":
                result = result.replace("${DealerProvince}", "NU");
                gst = Double.parseDouble(quoteWarranty.getSalePrice()) * 0.05;
                pst = 0.0;
                gstText = "GST : $";
                pstText = "RemoveTax";
                break;
            case "Yukon":
                gst = Double.parseDouble(quoteWarranty.getSalePrice()) * 0.05;
                pst = 0.0;
                gstText = "GST : $";
                pstText = "RemoveTax";
                break;
            case "Northwest Territories":
                gst = Double.parseDouble(quoteWarranty.getSalePrice()) * 0.05;
                pst = 0.0;
                gstText = "GST : $";
                pstText = "RemoveTax";
                break;
        }

        if (quoteInfo.getQuoteClient().getIndianStatusCertificate().isEmpty()) {
            result = result.replace("${WarrantyGST}", gstText + String.format("%,.2f", gst));
            result = result.replace("${WarrantyPST}", pstText + String.format("%,.2f", pst));
        } else {
            gst = 0.0;
            pst = 0.0;
            result = result.replace("${WarrantyGST}", "");
            result = result.replace("${WarrantyPST}", "");
        }

        result = result.replace("${Vehicle_MAKE}", vehicleInfo.getBranch());
        result = result.replace("${Vehicle_MODEL}", vehicleInfo.getModel());
        result = result.replace("${Vehicle_YEAR}", vehicleInfo.getYear());

        String isAutomatic = "✓";
        if (vehicleInfo.getFuelType().equals("DIESEL")) {
            isAutomatic += " ✓";
        }
        if (vehicleInfo.getIsTurboEngine().equals("Yes")) {
            isAutomatic += " ✓";
        }
        if (vehicleInfo.getIs4X4().equals("Yes")) {
            isAutomatic += " ✓";
        }
        if (vehicleInfo.getIsAllWheelDrive().equals("Yes")) {
            isAutomatic += " ✓";
        }

        result = result.replace("${Vehicle_Automatic}", isAutomatic);

        result = result.replace("${Vehicle_VIN}", vehicleInfo.getVIN());
        result = result.replace("${Vehicle_CYLINDERS}", vehicleInfo.getCylinders());
        result = result.replace("${Vehicle_ EngineSize}", vehicleInfo.getEngineSize());
        result = result.replace("${Vehicle_ EngineSizeUnit}", vehicleInfo.getEngineSizeUnit());

        result = result.replace("${Vehicle_DeliveredDate}",
            quoteInfo.getQuoteVehicle().getDeliveryDate());

        result = result.replace("${Vehicle_km}", vehicleInfo.getKm());

        result = result.replace("${Vehicle_Price}",
            String.format("%.2f", Double.parseDouble(vehicleInfo.getPrice())));

        result = result.replace("${ClientLastName}", client.getLastName());
        result = result.replace("${ClientFirstName}", client.getFirstName());
        result = result.replace("${ClientCompany}", client.getSecondaryOwnerOrCompany());
        result = result.replace("${ClientAddress}", client.getAddress());

        if (client.getAddress2().isEmpty()) {
            result = result.replace("${ClientAddress2}", client.getAddress2());
        } else {
            result = result.replace("${ClientAddress2}", " " + client.getAddress2());
        }

        if (client.getCity().isEmpty()) {
            result = result.replace("${ClientCity}", client.getCity());
        } else {
            result = result.replace("${ClientCity}", client.getCity() + " ");
        }

        result = result.replace("${ClientPROVINCE}", client.getProvince());

        if (client.getPostalCode().isEmpty()) {
            result = result.replace("${ClientPostal}", client.getPostalCode());
        } else {
            result = result.replace("${ClientPostal}", " " + client.getPostalCode());
        }

        if (client.getTelHome().isEmpty()) {
            result = result.replace("${ClientTelHome}", client.getTelHome());
        } else {
            result = result.replace("${ClientTelHome}", client.getTelHome() + " ");
        }

        if (client.getTelWork().isEmpty()) {
            result = result.replace("${ClientTelWork}", client.getTelWork());
        } else {
            result = result.replace("${ClientTelWork}", client.getTelWork() + " ");
        }

        result = result.replace("${ClientEmail}", client.getEmail());

        result = result.replace("${ProgramOptionTermMonth}", quoteWarranty.getOptionTermMonth());

        result = result.replace("${ProgramOptionKm}", quoteWarranty.getOptionTermKm());

        result = result.replace("${ProgramOption}", quoteWarranty.getProgramOption());

        result = result.replace("${ProgramDescription}", quoteWarranty.getProgramDescription());

        result = result.replace("${ProgramOptionTermPrice}", quoteWarranty.getOptionTermPrice());

        result = result.replace("${ProgramOptionTermAmountPerVisit}",
            quoteWarranty.getOptionTermAmountPerVisit());

        if (quoteWarranty.getOptionTermAmountTotal().isEmpty()) {
            result = result.replace("${ProgramOptionTermAmountTotal}",
                " ");
        } else {
            result = result.replace("${ProgramOptionTermAmountTotal}",
                " " + quoteWarranty.getOptionTermAmountTotal());
        }

        if (quoteWarranty.getOptionTermAmountText().isEmpty()) {
            result = result.replace("${ProgramOptionTermAmountText}",
                " ");
        } else {
            result = result.replace("${ProgramOptionTermAmountText}",
                " " + quoteWarranty.getOptionTermAmountText());
        }

        result = result.replace("${WarrantyStartDate}", quoteWarranty.getWarrantyStartDate());

        result = result.replace("${WarrantyEndDate}", LocalDate.parse(quoteWarranty.getWarrantyStartDate()).plusMonths(Long.parseLong(quoteWarranty.getOptionTermMonth())).toString());
        //result = result.replace("${WarrantyEndDate}", "2030-10-04");

        if (vehicleInfo.getFullCoverageEndDate().isEmpty()) {
            result = result.replace("${VehicleFullDate}", "-");
        } else {
            result = result.replace("${VehicleFullDate}",
                vehicleInfo.getFullCoverageEndDate());
        }

        if (vehicleInfo.getFullCoverageMaxMile().isEmpty()) {
            result = result.replace("${VehicleFullKm}", "-");
        } else {
            result = result.replace("${VehicleFullKm}",
                vehicleInfo.getFullCoverageMaxMile());
        }

        if (vehicleInfo.getPowertrainCoverageEndDate().isEmpty()) {
            result = result.replace("${VehiclePowertrainDate}", "-");
        } else {
            result = result.replace("${VehiclePowertrainDate}",
                vehicleInfo.getPowertrainCoverageEndDate());
        }

        if (vehicleInfo.getPowertrainCoverageMaxMile().isEmpty()) {
            result = result.replace("${VehiclePowertrainKm}", "-");
        } else {
            result = result.replace("${VehiclePowertrainKm}",
                vehicleInfo.getPowertrainCoverageMaxMile());
        }

        result = result.replace("${WarrantyPrice}", String.format("%,.2f",
            Double.parseDouble(quoteWarranty.getSalePrice())));

        result = result.replace("${WarrantyTotalPrice}",
            String.format("%,.2f", Double.parseDouble(quoteWarranty.getSalePrice()) + gst + pst));

        String programComponent = "";

        Collections.sort(quoteWarranty.getExtraComponents().getComponnentName());

        for (String s : quoteWarranty.getExtraComponents().getComponnentName()) {
            programComponent += s + "\n";
        }

        result = result.replace("${ProgramComponent}", programComponent);

        if (dealerInfo.getDealer().get(0).getCompanyName().isEmpty()) {
            result =
                result.replace("${DealerCompany}", dealerInfo.getDealer().get(0).getCompanyName());
        } else {
            result = result.replace("${DealerCompany}",
                "\n" + dealerInfo.getDealer().get(0).getCompanyName() + "\n");
        }

        if (dealerInfo.getDealer().get(0).getAddress().isEmpty()) {
            result = result.replace("${DealerAddress}", dealerInfo.getDealer().get(0).getAddress());
        } else {
            result = result.replace("${DealerAddress}",
                "\n" + dealerInfo.getDealer().get(0).getAddress() + "\n");
        }

        result = result.replace("${DealerCity}", dealerInfo.getDealer().get(0).getCity());

        result =
            result.replace("${DealerPostalCode}", dealerInfo.getDealer().get(0).getPostalCode());

        result = result.replace("${DealerPhone}", dealerInfo.getDealer().get(0).getPhone());

        if (dealerInfo.getDealer().get(0).getIsShowTaxInfo().equals("True")) {
            result = result.replace("${DealerRegistrationGST}",
                "\nRegistration GST: " + dealerInfo.getDealer().get(0).getRegistrationGST());

            result = result.replace("${DealerRegistrationPST}",
                "\nRegistration PST: " + dealerInfo.getDealer().get(0).getRegistrationPST());
        } else {
            result = result.replace("${DealerRegistrationGST}", "");
            result = result.replace("${DealerRegistrationPST}", "");
        }

        return result;
    }
}
