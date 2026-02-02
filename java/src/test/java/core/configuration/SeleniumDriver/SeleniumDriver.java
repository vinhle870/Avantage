package core.configuration.SeleniumDriver;


import core.configuration.browsercapacities.browserCapacities;
import core.configuration.browsercapacities.browserCapacities_Impl;
import core.enums.browserType;
// ApplicationDriver import removed (not used)
import core.configuration.ApplicationDriver.DriverBase;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ThreadGuard;

public class SeleniumDriver extends DriverBase {

    public boolean IsHeadless;

    public SeleniumDriver() {


    }//init

    @Override
    public void startDriver(browserType browsertype, Boolean headless) {
        System.out.println("START TO CREATE LOCAL WEB DRIVER");

        //==============Set driver location as System.Property

        switch (browsertype) {
            case FireFox -> {
                WebDriverManager.firefoxdriver().setup();
                FirefoxOptions option_ff = new FirefoxOptions();

                //option_ff.merge(Capacities);
                if(IsHeadless)
                   option_ff.addArguments("-headless");
                driver.set(ThreadGuard.protect(new FirefoxDriver(option_ff))) ;
            }
            case MsEdge -> {
                WebDriverManager.edgedriver().setup();
                EdgeOptions edge_options = new EdgeOptions();
                //edge_options.merge(Capacities);
                driver.set(ThreadGuard.protect(new EdgeDriver(edge_options))) ;

            }
            default -> {

                browserCapacities browserCapacities = new browserCapacities_Impl();

                DesiredCapabilities chrome_cap =  browserCapacities.getDesiredCapabilities("Chrome");

                WebDriverManager.chromedriver().clearDriverCache().setup();
                ChromeOptions chrome_options = new ChromeOptions();

                chrome_options.addArguments("--remote-allow-origins=*");
                if(IsHeadless)
                    chrome_options.addArguments("--headless=new");

                chrome_options.merge(chrome_cap);

                this.driver.set(ThreadGuard.protect(new ChromeDriver(chrome_options)));

            }
        }

        if (!IsHeadless) this.getDriver().manage().window().maximize();

        System.out.println("=======SUCCESS CREATED WEB DRIVER");
    }

    @Override
    public void closeDriver() {
         this.getDriver().quit();

         this.driver.remove();

    }

}
