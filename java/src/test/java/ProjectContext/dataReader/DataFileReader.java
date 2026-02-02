package ProjectContext.dataReader;

import ProjectContext.BusinessObject.Admin.AdminPortal;
import ProjectContext.BusinessObject.Dealer.DealerPortal;
import ProjectContext.BusinessObject.Dealer.QuoteInfo;
import ProjectContext.BusinessObject.Dealer.QuoteWarranty;
import jakarta.xml.bind.JAXBContext;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.io.File;

public class DataFileReader {
    public AdminPortal adminPortal;
    public DealerPortal dealerPortal;

    public DataFileReader() {

    }

    private void customData() {
        if (adminPortal.getProgramInfo() != null && adminPortal.getProgramInfo().getProgram() != null) {

            double number = Math.random() * 100000;
            String cur_name = adminPortal.getProgramInfo().getProgram().get(0).getName();

            adminPortal.getProgramInfo().getProgram().get(0).setName(cur_name + "_" + number);

            adminPortal.getProgramInfo().getProgram().get(0).setCode(Double.toString(number));
        }
    }

    public void readDealerPortalData(File filedata) {
        try {
            dealerPortal = (DealerPortal) JAXBContext.newInstance(DealerPortal.class)
                    .createUnmarshaller()
                    .unmarshal(filedata);

            QuoteInfo quoteInfo = this.dealerPortal.getQuoteInfo();
            QuoteWarranty warranty = quoteInfo.getQuoteWarranty();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate currentDate = LocalDate.now();
            warranty.setVehicleDeliveryDate(currentDate.format(formatter));
            warranty.setWarrantyStartDate(currentDate.plusDays(15).format(formatter));
            quoteInfo.setQuoteWarranty(warranty);
            this.dealerPortal.setQuoteInfo(quoteInfo);

            //Randomly Data
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public void readAdminPortalData(File filedata) {
        try {
            adminPortal = (AdminPortal) JAXBContext.newInstance(AdminPortal.class)
                    .createUnmarshaller()
                    .unmarshal(filedata);

            //Randomly Data;

            customData();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
