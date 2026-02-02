package testcases;

import ProjectContext.managers.TestControl;
import ProjectContext.stepsDefiniton.AdminSteps;
import ProjectContext.stepsDefiniton.DealerSteps;
import core.assertion.TestAssertions;
import net.serenitybdd.annotations.Steps;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import net.serenitybdd.junit5.SerenityJUnit5Extension;

/**
import net.serenitybdd.annotations.Managed;
import net.serenitybdd.annotations.Steps;
import net.serenitybdd.junit5.SerenityJUnit5Extension;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.openqa.selenium.WebDriver;

**/

@ExtendWith(SerenityJUnit5Extension.class)
public class TestBase {

    public TestControl testControl;

    @Steps
    public AdminSteps AdminUser;
    @Steps
    public DealerSteps DealerUser;

    //Before run Test method
    @BeforeEach
    public void setup() {

        System.out.println("Runtime Classpath: " + System.getProperty("java.class.path"));
        testControl = new TestControl();

        AdminUser.InitObject(testControl);

        DealerUser.InitObject(testControl);
    }

    @AfterEach
    public void after() {
       // Browser.closeBrowser();

        TestAssertions.markTCFailed();
    }
}
