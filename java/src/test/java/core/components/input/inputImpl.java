package core.components.input;


import core.components.baseComponent.baseComponent;
import core.configuration.ApplicationDriver.ApplicationDriver;
import org.openqa.selenium.By;


public class inputImpl extends baseComponent implements iInput {
  
  public inputImpl(ApplicationDriver appDriver, By locator) {
    super(appDriver, locator);
  }


  public inputImpl(By locator)
  {
    super(locator);
  }
  
  @Override
  public void fillValue(Object value) {
    
       waitForElementDisplay(this.getLocator());

      this.getElement().clear();
      
      this.getElement().sendKeys(value.toString());

  }
  
  @Override
  public String getShownValue() {
    return null;
  }
}
