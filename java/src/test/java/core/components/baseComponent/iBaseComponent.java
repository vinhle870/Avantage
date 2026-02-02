package core.components.baseComponent;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

public interface iBaseComponent {

    public WebElement getElement();

    public void click();

    public void SelectDropdownItem(WebElement element, String item_text, String note_str) throws InterruptedException;

    public void executeJsAction(String script);

    public String getElementText();

    public List<iBaseComponent> getChildComponents(By selector);

    public iBaseComponent getChildComponent(By selector);

    public void setElement(WebElement e);

    public void clickOnChildElement(By selector);


}
