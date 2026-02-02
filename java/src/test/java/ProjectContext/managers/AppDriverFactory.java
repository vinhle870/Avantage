package ProjectContext.managers;


import core.enums.driverType;
import core.configuration.ApplicationDriver.ApplicationDriver;
import core.configuration.SeleniumDriver.SeleniumDriver;

public class AppDriverFactory {

	private ApplicationDriver appDriver;

	private AppDriverFactory()
	{

	}

	public static AppDriverFactory getInstance() {
		return SingletonHelper.INSTANCE;
	}

	private static class SingletonHelper {
		private static final AppDriverFactory INSTANCE = new AppDriverFactory();
	}



public void createApplicationDriver(driverType drivertype)
{
	switch (drivertype)
			{
				case Selenium -> appDriver = new SeleniumDriver();

				default -> throw new IllegalStateException("Unexpected value: " + drivertype);
			};


}

public ApplicationDriver getAppDriver()
{
	return this.appDriver;
}


}
