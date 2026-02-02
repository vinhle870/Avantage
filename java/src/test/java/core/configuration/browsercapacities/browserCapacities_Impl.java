package core.configuration.browsercapacities;

import ProjectContext.dataReader.GlobalConfigsReader;

import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.util.HashMap;

public class browserCapacities_Impl implements browserCapacities{

     private String download_folder;

     public browserCapacities_Impl()
    {
        download_folder = GlobalConfigsReader.getInstance().getTestFileDownloadUrl();
    }

    public DesiredCapabilities getDesiredCapabilities(String browser)  {

        DesiredCapabilities caps_var = new DesiredCapabilities();

        if(caps_var.getCapability("platformName")==null)
        {
           //Setup the some extra browser config: like default download folder for Desktop OS

            switch(browser)
            {
                case "FireFox":
                    caps_var.merge(Set_FFOptions());
                    break;

                case "Chrome":
                    caps_var.setCapability(ChromeOptions.CAPABILITY,Set_ChromeOptions());
                    break;
            }//end switch

        }//if platform

        return caps_var;
    }//void



    private FirefoxOptions Set_FFOptions()
    {
        FirefoxOptions options = new FirefoxOptions();

        FirefoxProfile profile = new FirefoxProfile();

        String destination_folder = download_folder;

        //Set Location to store files after downloading.
        profile.setPreference("browser.download.dir", destination_folder);

        profile.setPreference("browser.download.folderList", 2);

        //Set Preference to not show file download confirmation dialogue using MIME types Of different file extension types.
        profile.setPreference("browser.helperApps.neverAsk.saveToDisk", "application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/pdf, text/csv, text/plain");

        profile.setPreference( "browser.download.manager.showWhenStarting", false );

        //profile.setPreference( "-headless", true );

        // profile.setPreference( "-disable-gpu", true );

        profile.setPreference( "pdfjs.disabled", true );

        options.setProfile(profile);

        return options;
    }//end void


    private ChromeOptions Set_ChromeOptions()
    {
        ChromeOptions options = new ChromeOptions();

        HashMap<String, Object> chromePrefs = new HashMap<String, Object>();
        chromePrefs.put("profile.default_content_settings.popups", 0);
        chromePrefs.put("download.default_directory", download_folder);


        //chromePrefs.put("-headless",1);
        chromePrefs.put("-disable-gpu",1);

        options.setExperimentalOption("prefs", chromePrefs);
        options.addArguments("start-maximized");

        options.addArguments("--proxy-server='direct://'");
        options.addArguments("--proxy-bypass-list=*");

        return options;
    }//end void

    /*
    public ArrayList<Object> getCapacitiesSet() throws Exception {
        String jsonLocation = file_direction+file_name;
        ArrayList<Object> capacitiesSets = new ArrayList<>();


        JSONArray capabilitiesArray = parseJSON(jsonLocation);

        for (Object jsonObj : capabilitiesArray) {
            JSONObject capability = (JSONObject) jsonObj;
            capacitiesSets.add(capability.get("caps"));

        }
        return capacitiesSets;
    }//void

    //******Currently this function is not used due to FF Profile is confg on TestConfigs

	public  void ChangeFFDownloadSetting_func()
	{
		if(glb_webdriver!=null)
		{
		glb_webdriver.get("about:config");

		((JavascriptExecutor) glb_webdriver).executeScript("document.getElementsByTagName('button')[0].click();");

		((JavascriptExecutor) glb_webdriver).executeScript("var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);prefs.setBoolPref('browser.download.useDownloadDir', false);");
		}
		else
		{
			glb_webdriver.navigate().to(TestConfigs.ARCPortal_env);
		}

	}




    private static JSONArray parseJSON(String jsonLocation) throws Exception {
        JSONParser jsonParser = new JSONParser();
        return (JSONArray) jsonParser.parse(new FileReader(jsonLocation));
    }



    private static HashMap<String, Object> convertCapsToHashMap(Object jsonobject) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(jsonobject.toString(), HashMap.class);
    }
*/

}
