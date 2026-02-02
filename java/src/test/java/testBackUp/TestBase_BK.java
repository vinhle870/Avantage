/*
package testcases;

import ProjectContext.dataReader.EnvInfoReader;
import ProjectContext.dataReader.GlobalConfigsReader;
import ProjectContext.managers.AppDriverFactory;
import ProjectContext.managers.TestControl;
import ProjectContext.stepsDefiniton.AdminSteps;
import core.configuration.ApplicationDriver.ApplicationDriver;
import net.serenitybdd.junit.runners.SerenityParameterizedRunner;
import net.serenitybdd.annotations.Steps;
import net.thucydides.junit.annotations.Concurrent;
import net.thucydides.junit.annotations.TestData;
import org.junit.After;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;

import java.util.Arrays;
import java.util.Collection;


@RunWith(SerenityParameterizedRunner.class)
@Concurrent(threads = "10x")
public class TestBase_BK {

	public static GlobalConfigsReader glbConfigReader;

	public ApplicationDriver exec_driver;

	public TestControl testControl;
	@Steps
	public AdminSteps AdminUser;

	@TestData
    public static Collection<Object[]> testData() {

    	Object[][] driver_list = new Object[GlobalConfigsReader.getInstance().Browsers.size()][1];
    	for(String browser:GlobalConfigsReader.getInstance().Browsers)
    	{
			ApplicationDriver newDriver = AppDriverFactory.createApplicationDriver(browser);

			System.out.println("=========SUCCESS GET CAPACITIES");

			driver_list[GlobalConfigsReader.getInstance().Browsers.indexOf(browser)][0] = newDriver;
      	}

    	return Arrays.asList(driver_list);
    }

    //Get driver from parameterized Driver list
	public TestBase_BK(ApplicationDriver appDriver)
	{
		this.exec_driver = appDriver;
		
		System.out.println("Completed the TestData driver-parameters to main DriverBase");
	}
	
	//Before run Test method
	@Before
	public void setup()
	{
		EnvInfoReader.ReadEnvInfoFile();

		try {
			//AdminUser = new AdminSteps(new TestControl());

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}


    }
	
	@After
	public void after()
	{
		exec_driver.closeDriver();
	}
	
	@Test
	public void TC_001()
	{
		AdminUser.Login_to_ARC_Portal_as_admin();
	}
}
*/
