package core.configuration.ApplicationDriver;

import core.enums.browserType;
import org.openqa.selenium.WebDriver;

public class DriverBase implements ApplicationDriver {
	
	public ThreadLocal<WebDriver> driver = new ThreadLocal<WebDriver>();
	//public DesiredCapabilities Capacities;
	public boolean IsClose;
	public String browserName;
	public int waitTime;
	public void startDriver() throws Exception {

	}
	public DriverBase()
	{
		
	}

	@Override
	public void startDriver(browserType browsertype, Boolean headless)  {

	}

	public WebDriver getDriver()
	{
		return driver.get();
	}

	public void setDriver(WebDriver driver)
	{
		this.driver.set(driver);
	}

	public  void closeDriver() {}

	public int getWaitTime()
	{
		return this.waitTime;
	}


	
	
	
}
