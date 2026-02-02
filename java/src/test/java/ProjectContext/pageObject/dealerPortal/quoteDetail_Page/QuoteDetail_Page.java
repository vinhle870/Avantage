package ProjectContext.pageObject.dealerPortal.quoteDetail_Page;

import core.components.buttons.buttonImpl;
import core.components.buttons.iButton;
import core.components.label.iLabel;
import core.components.label.labelImpl;
import core.components.link.iLink;
import core.components.link.linkImpl;
import org.openqa.selenium.By;

public class QuoteDetail_Page {

    public iButton btn_AddVehicle()
    {
        return new buttonImpl(By.xpath("//*[contains(@data-href, \"/vehicle\")]"));
    }

    public iLink lnk_NewWarranty()
    {
       return new linkImpl(By.xpath("//*[contains(@href,\"warranty/edit\")]"));
    }

    public iButton btn_FinalizeSale()
    {
        return new buttonImpl(By.xpath("//*[contains(@href, \"/finalize\")]"));
    }

    public iLabel lbl_AlertMsg()
    {
        return new labelImpl(By.cssSelector("[role=alert]"));
    }

    public iLink lnk_CreateSale()
    {
        return new linkImpl(By.xpath("//*[contains(@href,\"sale\")]"));
    }

    public iLink lnk_GotoInvoice()
    {
        return new linkImpl(By.xpath("/html/body/div[1]/main/div/div/div[1]/a"));
    }




}
