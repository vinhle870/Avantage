package core.browser;


import ProjectContext.dataReader.GlobalConfigsReader;
import ProjectContext.managers.AppDriverFactory;
import core.assertion.TestAssertions;
import core.configuration.ApplicationDriver.ApplicationDriver;
import core.enums.Failure_Handler;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WindowType;

import java.time.Duration;

public class Browser {

    private static ApplicationDriver i_driver;

    private static String originalWindow;

    public static void start()
    {
       try{
           i_driver = AppDriverFactory.getInstance().getAppDriver();

           i_driver.startDriver(GlobalConfigsReader.getInstance().getBrowserType(), GlobalConfigsReader.headlessMode);

           //Set wait time before open URL
           i_driver.getDriver().manage().timeouts().implicitlyWait(Duration.ofSeconds((long) i_driver.getWaitTime()));

           originalWindow = i_driver.getDriver().getWindowHandle();

       }
       catch (Exception e)
       {

           TestAssertions.markStepFailed("CAN'T START THE DRIVER DUE TO: "+e.getMessage(), Failure_Handler.STOP_RUN);
       }

    }

    public static void openUrl(String url)
    {
        WebDriver driver_tmp = i_driver.getDriver();
        driver_tmp.navigate().to(url);
       // driver_tmp.get("www.google.com");

    }

    public static void closeBrowser()
    {

        if(GlobalConfigsReader.CloseBrowser)
            i_driver.closeDriver();
    }

    public static void openUrlOnNewTab(String url)
    {
        i_driver.getDriver().switchTo().newWindow(WindowType.TAB);

        i_driver.getDriver().get(url);
    }


    public static void closeCurrentTab()
    {
        //Close the tab or window
        i_driver.getDriver().close();

        //Switch back to the old tab or window
        i_driver.getDriver().switchTo().window(originalWindow);
    }


}
