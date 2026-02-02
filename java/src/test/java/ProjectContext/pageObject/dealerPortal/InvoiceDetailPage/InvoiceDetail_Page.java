package ProjectContext.pageObject.dealerPortal.InvoiceDetailPage;

import core.components.label.iLabel;
import core.components.label.labelImpl;
import org.openqa.selenium.By;

public class InvoiceDetail_Page {

    public iLabel lbl_DealerName() {
        return new labelImpl(By.xpath("/html/body/div[1]/main/div/div/div[3]/div/div[2]/div[2]/div[1]/strong"));
    }

    public iLabel lbl_DealerAddress() {
        return new labelImpl(By.xpath("/html/body/div[1]/main/div/div/div[3]/div/div[2]/div[2]/div[2]"));
    }

    public iLabel lbl_DealerLocation() {
        return new labelImpl(By.xpath("/html/body/div[1]/main/div/div/div[3]/div/div[2]/div[2]/div[3]"));
    }

    public iLabel lbl_DealerEmail() {
        return new labelImpl(By.xpath("/html/body/div[1]/main/div/div/div[3]/div/div[2]/div[2]/div[4]"));
    }

    public iLabel lbl_DealerPhone() {
        return new labelImpl(By.xpath("/html/body/div[1]/main/div/div/div[3]/div/div[2]/div[2]/div[5]"));
    }
    public iLabel lbl_InvoiceDescription() {
        return new labelImpl(By.xpath("/html/body/div[1]/main/div/div/div[3]/div/div[3]/table/tbody/tr/td[1]"));
    }

    public iLabel lbl_InvoiceTotal() {
        return new labelImpl(By.xpath("/html/body/div[1]/main/div/div/div[3]/div/div[3]/table/tbody/tr/td[2]"));
    }

    public iLabel lbl_InvoiceGrandTotal() {
        iLabel control = null;
        try {
            control = new labelImpl(By.xpath("/html/body/div[1]/main/div/div/div[3]/div/div[4]/div[2]/table/tbody/tr[2]/td[2]/strong"));
        } catch (Exception e) {
        } finally {
            if(control.getElement() == null) {
                return new labelImpl(By.xpath("/html/body/div[1]/main/div/div/div[3]/div/div[4]/div[2]/table/tbody/tr[3]/td[2]/strong"));
            }
        }
        return control;
    }

    public iLabel lbl_AVAddress() {
        return new labelImpl(By.xpath("/html/body/div[1]/main/div/div/div[3]/div/div[4]/div[1]/p[2]"));
    }
}
