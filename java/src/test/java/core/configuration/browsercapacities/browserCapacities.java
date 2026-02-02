package core.configuration.browsercapacities;

import org.openqa.selenium.remote.DesiredCapabilities;

public interface browserCapacities {

    public DesiredCapabilities getDesiredCapabilities(String browser);

}
