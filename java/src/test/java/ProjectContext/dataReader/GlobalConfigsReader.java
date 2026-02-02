package ProjectContext.dataReader;

import core.enums.browserType;

import java.io.File;
import java.util.Arrays;
import java.util.List;

public class GlobalConfigsReader {
	private String ProjectRootUrl = "user.dir";
	private String TestResourceUrl = File.separator+"src"+File.separator+"test"+File.separator+"resources"+File.separator;

	private String TestFileDownloadUrl = File.separator+"src"+File.separator+"test"+File.separator+"resources"+File.separator+"TestDocument"+File.separator;

	private static GlobalConfigsReader globalconfigsReader;
	public static String EnvName;

	public static Boolean headlessMode;
	public static int WaitTime;
	public static boolean CloseBrowser;
	//Mail Account for testing
	public static List<String> Browsers;

	// EnvFileReader used during initialization only

	public static GlobalConfigsReader getInstance()
	{
		if(globalconfigsReader==null)
			globalconfigsReader = new GlobalConfigsReader() ;

		return globalconfigsReader;
	}

	private GlobalConfigsReader() {

//		try{
			new EnvFileReader();

			 String main_resources_path = getEnvInfoUrl();

			 String filePath_Properties =  "Exec_Config.properties";

			//1. ===================Read Env Properties Files
			ProptiesReader Env_property = new ProptiesReader();

			Env_property.LoadPropertyFile(main_resources_path+filePath_Properties);

			//Check what env is selected
			//2.===================Read Browsers Properties Files

			WaitTime = Integer.parseInt(Env_property.property_var.getProperty("WaitTime"));

			headlessMode = Boolean.parseBoolean(Env_property.property_var.getProperty("HeadlessMode"));

			CloseBrowser = Boolean.parseBoolean(Env_property.property_var.getProperty("CloseBrowser"));

			Browsers = Arrays.asList(Env_property.property_var.getProperty("Browsers").split(",") )  ;

			EnvName= Env_property.property_var.getProperty("EnvName");
//		}
//	catch(Exception e)
//	{
//		TestAssertions.markStepFailed("Can't Read the Global Config file due to:" +e.getMessage(), Failure_Handler.STOP_RUN);
//	}

	}//init

	public browserType getBrowserType()
	{
		return switch (GlobalConfigsReader.Browsers.get(0))
		{
			case "Chrome" -> browserType.Chrome;

			case "Firefox" ->browserType.FireFox;

			default -> browserType.MsEdge;

		};
	}

	public String getTestFileDownloadUrl()
	{
		return  System.getProperty(ProjectRootUrl)+TestFileDownloadUrl;
	}

	public String getEnvInfoUrl()
	{
		return  System.getProperty(ProjectRootUrl)+ TestResourceUrl + "EnvInfo" +File.separator;
	}

	public String getTestResourceUrl()
	{
		return  System.getProperty(ProjectRootUrl)+ TestResourceUrl;
	}

}
