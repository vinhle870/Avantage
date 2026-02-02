package core.components.table;

import core.components.baseComponent.iBaseComponent;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public interface iTable extends iBaseComponent {

    void clickOnChild(String searchValue, By locator);

    void clickOnChildContainingText(String searchValue, By locator);

    String getRowTextContent(String rowMatchedText, String separator);

    WebElement findRow(String searchValue);

    String getFirstRow(String separator);
}
