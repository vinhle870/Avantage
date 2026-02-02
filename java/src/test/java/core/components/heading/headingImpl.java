package core.components.heading;

import core.components.baseComponent.baseComponent;
import core.configuration.ApplicationDriver.ApplicationDriver;
import org.openqa.selenium.By;

public class headingImpl extends baseComponent implements iHeading {

    public headingImpl(ApplicationDriver appDriver, By locator) {
        super(appDriver, locator);
    }

    public headingImpl(By locator)
    {
        super(locator);
    }

    @Override
    public String getText() {

        return getElementText();
    }

}
