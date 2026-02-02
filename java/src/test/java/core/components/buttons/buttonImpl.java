package core.components.buttons;

import core.components.baseComponent.baseComponent;
import core.configuration.ApplicationDriver.ApplicationDriver;
import org.openqa.selenium.By;

public class buttonImpl extends baseComponent implements iButton {
  
  public buttonImpl(ApplicationDriver appDriver, By locator) {
    super(appDriver, locator);
    
  }

   public buttonImpl(By locator)
  {
    super(locator);
  }
  

  @Override
  public String getName() {
    return this.getElement().getAttribute("value");
  }//void
  
  
}
