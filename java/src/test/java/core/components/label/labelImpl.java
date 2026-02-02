package core.components.label;

import core.components.baseComponent.baseComponent;
import core.configuration.ApplicationDriver.ApplicationDriver;
import org.openqa.selenium.By;

public class labelImpl extends baseComponent implements iLabel {
    public labelImpl(ApplicationDriver appDriver, By locator) {
        super(appDriver, locator);
    }

    public labelImpl(By locator)
    {
        super(locator);
    }
    @Override
    public String getText()
    {
        return getElement().getText();
    }

}
