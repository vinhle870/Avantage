package core.components.dropdowns;

import core.assertion.TestAssertions;
import core.enums.Failure_Handler;
import core.components.baseComponent.baseComponent;
import core.configuration.ApplicationDriver.ApplicationDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

import java.util.List;

public class dropdownImpl extends baseComponent implements iDropdown {

  public WebElement ulElement;
  public dropdownImpl(ApplicationDriver appDriver, By locator) {
    super(appDriver, locator);
  }

  public dropdownImpl(By locator)
  {
    super(locator);
  }
  @Override
  public void selectOption(String optionText) {
    
    try {

        waitForElementDisplay(this.getLocator());

        //Click on root element
        click();

      ulElement = this.getElement().findElement(By.xpath(".//ul"));

      SelectItemULElement_func(ulElement, optionText, "");

    } catch (NoSuchElementException /*| InterruptedException*/ e) {
      TestAssertions.markStepFailed("Can't Select the option[" + optionText + "] from Dropdown due to: "+e.getMessage(), Failure_Handler.STOP_RUN);

    }
  }//void
  
  @Override
  public void removeSelectedOption(String optionText) {
  
  }
  
  @Override
  public List<WebElement> getOptionsList() {
    try{
      return new Select(this.getElement()).getOptions();
    }

    catch(java.lang.NullPointerException e)
    {
      TestAssertions.markStepFailed("Can't get options list of "+ this.getLocator() +"Due to: "+e.getMessage(),Failure_Handler.STOP_RUN);
    }
    return null;

  }
  
  @Override
  public String getSelectedOption() {
    return null;
  }
  
}
