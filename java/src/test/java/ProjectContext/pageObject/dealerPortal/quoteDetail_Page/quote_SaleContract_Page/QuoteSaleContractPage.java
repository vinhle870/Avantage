package ProjectContext.pageObject.dealerPortal.quoteDetail_Page.quote_SaleContract_Page;

import core.components.buttons.buttonImpl;
import core.components.buttons.iButton;
import core.components.input.iInput;
import core.components.input.inputImpl;
import core.components.link.iLink;
import core.components.link.linkImpl;
import org.openqa.selenium.By;

public class QuoteSaleContractPage {

    public iInput txt_ContractNumber()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_contractNumber]"));
    }

    public iInput txt_SalesRepName()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_salesRepName]"));
    }

    public iInput txt_DeliveredAt()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_deliveredAt]"));
    }

    public iInput txt_signedAt()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_signedAt]"));
    }

    public iInput txt_signedLocation()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_signedLocation]"));
    }

    public iInput txt_discountAmount()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_discountAmount]"));
    }

    public iInput txt_vehicleMarketValue()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_vehicleMarketValue]"));
    }
    public iInput txt_transitAmount()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_transitAmount]"));
    }
    public iInput txt_RDPRMAmount()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_rdprmAmount]"));
    }
    public iInput txt_warrantyAmount()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_warrantyAmount]"));
    }
    public iInput txt_accessories()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_accessories]"));
    }
    public iInput txt_accessoriesAmount()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_accessoriesAmount]"));
    }
    public iInput txt_newTiresDutyAmount()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_newTiresDutyAmount]"));
    }
    public iInput txt_maintenanceScheduleAmount()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_maintenanceScheduleAmount]"));
    }

    public iInput txt_replacementInsuranceAmount()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_replacementInsuranceAmount]"));
    }

    public iInput txt_replacementInsuranceNumber()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_replacementInsuranceNumber]"));
    }
    public iInput txt_loanInsuranceAmount()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_loanInsuranceAmount]"));
    }
    public iInput txt_loanInsuranceNumber()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_loanInsuranceNumber]"));
    }
    public iInput txt_depositAmount()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_depositAmount]"));
    }
    public iInput txt_otherClause()
    {
        return new inputImpl(By.cssSelector("[id=sales_contract_otherClause]"));
    }

    public iLink lnk_EmbedPDFUrl()
    {
        //Usage: get the url to navigate to pdf document
        return new linkImpl(By.tagName("embed"));

    }

    public iButton btn_PdfDownload()
    {
        //Need to navigate to pdf url before downloading;
        return new buttonImpl(By.xpath("//cr-icon-button[@id='download']"));
    }

    public iButton btn_Save()
    {
        return new buttonImpl(By.cssSelector("[type=submit]"));
    }




}
