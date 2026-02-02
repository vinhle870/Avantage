package testcases.DealerPortal;

import java.io.File;
import org.junit.jupiter.api.Test;
import testcases.TestBase;

public class Dealer_Inventory extends TestBase {

    @Test
    public void DealerCanCreateNewVehicle() throws InterruptedException {
        this.testControl.dataFileReader.readDealerPortalData(new File("src/test/resources/TestCaseData/DealerPortal/DealerCanAddNewVehicle.xml"));

        DealerUser.loginToDealerPortal();

        DealerUser.addNewVehicle( this.testControl.dataFileReader.dealerPortal.getVehicleInfo(), true);
    }
}

