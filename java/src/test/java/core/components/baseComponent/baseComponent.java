package core.components.baseComponent;

import ProjectContext.dataReader.GlobalConfigsReader;
import core.enums.Failure_Handler;
import core.assertion.TestAssertions;
import ProjectContext.managers.AppDriverFactory;
import core.configuration.ApplicationDriver.ApplicationDriver;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

public class baseComponent implements iBaseComponent{

    private WebElement webElement;
    By locator;
    public ApplicationDriver appDriver;

    public baseComponent(ApplicationDriver appDriver, By locator) {
        this.locator = locator;

        this.appDriver = appDriver;


    }//func

    public baseComponent(By locator)
    {
        this.appDriver = AppDriverFactory.getInstance().getAppDriver();

        this.locator = locator;
    }


    public WebElement getElement() {

        if(this.webElement==null)
            this.webElement = findWebElement(this.locator);

        return this.webElement;
    }

    public void click() {
        try {

            waitForElementDisplay(this.getLocator());

            this.getElement().click();

        } catch (Exception e) {
            new WebDriverWait(appDriver.getDriver(), Duration.ofSeconds(3)).until(ExpectedConditions.elementToBeClickable(locator)).click();
//            ((JavascriptExecutor) appDriver.getDriver()).executeScript("arguments[0].scrollIntoView(true);", this.webElement);
//            ((JavascriptExecutor) appDriver.getDriver()).executeScript("arguments[0].click();", this.webElement);
        }

    }//end void

    @Override
    public void setElement(WebElement e)
    {
        webElement = e;
    }

    @Override
    public void clickOnChildElement(By selector) {

        getChildComponent(selector).click();

    }



    private WebElement findWebElement(By locator) {
        try {

            waitForElementDisplay(locator);
            return this.appDriver.getDriver().findElement(locator);

        } catch (org.openqa.selenium.NoSuchElementException e) {
            return null;
        }
    }//func

    public void SelectDropdownItem(WebElement element, String item_text, String note_str) throws InterruptedException {
        String tag_name = element.getTagName();

        String ul_tag = "ul";

        if (tag_name.equals(ul_tag)) {
            SelectItemULElement_func(element, item_text, note_str);
        } else {
            element.click();
            Thread.sleep(300);
            Select slect_e = new Select(element);

            slect_e.selectByVisibleText(item_text);

        }//end else
		/*
		}catch(NoSuchElementException | InterruptedException e)
		{
			TestAssertions.markStepFailed("Can't Select the option["+item_text+"] from Dropdown");

		}
*/


    }//end void

    protected void SelectItemULElement_func(WebElement ul_element, String item_text, String note) {
        try {

            List<WebElement> item_list = null;
            WebElement dropdown = ul_element;
            //'To locate rows of table it will Capture all the rows available in the table'

            Thread.sleep(1000);

            item_list = dropdown.findElements(By.tagName("li"));

            int rows_count = item_list.size();

            if (rows_count == 0) {

                TestAssertions.markStepFailed("Dropdown is empty", Failure_Handler.STOP_RUN);

            }
            //for per one item
            Boolean exist = false;

            for (WebElement cur : item_list) {
                WebElement child_span = cur.findElement(By.xpath(".//span"));

                String str_tmp = child_span.getText();

                if (str_tmp.equals(item_text)) {
                    exist = true;

                    cur.click();

                    Thread.sleep(500);

                    break;
                }

            }//end for

            if (!exist) {
                TestAssertions.markStepFailed("Not Found the item[" + item_text + "]", Failure_Handler.STOP_RUN);
            }

        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }//end void

    public By getLocator() {
        return this.locator;
    }

  public void executeJsAction(String script)
  {
    //Creating the JavascriptExecutor interface object by Type casting
    JavascriptExecutor js = (JavascriptExecutor) this.appDriver.getDriver();
    //
    js.executeScript(script, this.webElement);
  }

  public String getElementText()
  {
      return this.webElement.getText();
  }

    @Override
    public List<iBaseComponent> getChildComponents(By selector) {

        List<iBaseComponent> iCompList = new ArrayList<>();

        List<WebElement> WebElist = getElement().findElements(selector);

        for(WebElement cur:WebElist)
        {
            iBaseComponent e = new baseComponent(this.appDriver,selector);

            e.setElement(cur);

            iCompList.add(e);
        }

        return iCompList;

    }

    @Override
    public iBaseComponent getChildComponent(By selector) {

        try{
            iBaseComponent e = new baseComponent(this.appDriver,selector);

            WebElement parentE = this.getElement();

            WebElement webE = parentE.findElement(selector);

            e.setElement(webE);

            return e;
        }
        catch (NoSuchElementException e) {
            return null;
        }

    }

    public void waitForElementDisplay(By element_by) {

        try{
            WebDriverWait wait = new WebDriverWait(this.appDriver.getDriver(), Duration.ofSeconds((long) GlobalConfigsReader.WaitTime));

            wait.until(ExpectedConditions.visibilityOfElementLocated(element_by));
        }
        catch(Exception e)
        {
//Assertions.assertFail("Time Out on waiting the element to display due to: "+e.getMessage()+System.lineSeparator(), FailureHandling.STOP_ON_FAILURE)
        }

    }//end void


    public void waitForFieldEnable(By element_by)
    {
     try
        {
            WebDriverWait wait = new WebDriverWait(this.appDriver.getDriver(), Duration.ofSeconds((long) GlobalConfigsReader.WaitTime));

            wait.until(ExpectedConditions.elementToBeClickable(element_by));

        }
        catch(TimeoutException e)
        {

       }

    }//void

   public void waitForFieldValueNotEmpty(By element)
    {
        boolean stopwait = false;
        while(stopwait==false)
        {
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }

            String txt_str = getElementText();

            if(!txt_str.equals(""))
            {
                stopwait = true;
            }//if

        }//while
    }//void

    public void scrollWebElementToViewPort(WebElement element)
    {
        int element_y = element.getLocation().getY();

        ((JavascriptExecutor) this.appDriver.getDriver()).executeScript("window.scrollTo(0,"+(element_y-200)+")","");

        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
            /*
            int center_y= max_y/2+150;
            int y_distance = element_y - center_y;
            if(y_distance>100)
            {
            ((JavascriptExecutor) driver).executeScript("window.scrollTo(0,"+max_y+")","");
            //int x = element.getLocation().getX();
            //Math math_c = new Math();
            ((JavascriptExecutor) driver).executeScript("window.scrollTo(0,"+y_distance+")","");
            Thread.sleep(1000);
            }
            */

    }//void

    /*
    public void DownloadFile_func(String file_name)
    {
        try {

            Thread.sleep(3000);

            Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();

            StringSelection string_slect = new StringSelection(GlobalConfigsReader.test_data_full_path+file_name);

            clipboard.setContents(string_slect, string_slect);

                Robot rbot;

                rbot = new Robot();

                //SELECT OPTION SAVE FILE
                rbot.keyPress(KeyEvent.VK_ALT);
                rbot.keyPress(KeyEvent.VK_S);
                Thread.sleep(2000);

                rbot.keyRelease(KeyEvent.VK_S);
                rbot.keyRelease(KeyEvent.VK_ALT);

                Thread.sleep(2000);
                rbot.keyPress(KeyEvent.VK_ENTER);
                rbot.keyRelease(KeyEvent.VK_ENTER);
                Thread.sleep(1000);

                rbot.keyPress(KeyEvent.VK_CONTROL);
                rbot.keyPress(KeyEvent.VK_V);
                Thread.sleep(1000);
                rbot.keyRelease(KeyEvent.VK_V);
                rbot.keyRelease(KeyEvent.VK_CONTROL);
                Thread.sleep(2000);

                rbot.keyPress(KeyEvent.VK_ENTER);
                rbot.keyRelease(KeyEvent.VK_ENTER);
                Thread.sleep(2000);

        }//try
        catch (AWTException | InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }//catch


    }//void
*/
}
