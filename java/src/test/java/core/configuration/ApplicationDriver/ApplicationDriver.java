package core.configuration.ApplicationDriver;

import core.enums.browserType;
import org.openqa.selenium.WebDriver;

public interface ApplicationDriver {

   public void startDriver(browserType browsertype, Boolean headless) ;

   public WebDriver getDriver();

    public void setDriver(WebDriver driver);

    public int getWaitTime();

    public void closeDriver();




}
