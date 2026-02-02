package core.components.checkbox;

import core.components.baseComponent.baseComponent;
import core.configuration.ApplicationDriver.ApplicationDriver;
import org.openqa.selenium.By;

public class checkboxImpl extends baseComponent implements iCheckbox{

    public checkboxImpl(ApplicationDriver appDriver, By locator) {
        super(appDriver, locator);
    }
    public checkboxImpl(By locator)
    {
        super(locator);
    }


    @Override
    public void select() {
        if (!getStatus()) click();
    }

    @Override
    public void unSelect() {
        if (getStatus()) click();
    }

    @Override
    public Boolean getStatus() {
        return this.getElement().isSelected();
    }

}
