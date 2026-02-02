package core.components.table;

import core.components.baseComponent.baseComponent;
// iBaseComponent import removed (not used)
import core.configuration.ApplicationDriver.ApplicationDriver;
import java.util.List;
import java.util.Objects;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class tableImpl extends baseComponent implements iTable {

    public tableImpl(ApplicationDriver appDriver, By locator) {
        super(appDriver, locator);
    }

    public tableImpl(By locator) {
        super(locator);
    }

    @Override
    public void clickOnChild(String searchValue, By locator) {
        WebElement e = Objects.requireNonNull(findRow(searchValue));
        e.findElement(locator).click();
    }

    public void clickOnChildContainingText(String searchValue, By locator) {
        WebElement e = Objects.requireNonNull(findRowContainingText(searchValue));
        e.findElement(locator).click();
    }

    @Override
    public String getRowTextContent(String rowMatchedText, String separator) {

        WebElement row = findRow(rowMatchedText);

        List<WebElement> columns = row.findElements(By.tagName("td"));
        String row_text = "";
        for (WebElement column : columns) {
            row_text += column.getText() + separator;
        }
        return row_text;
    }

    public WebElement findRow(String searchValue) {
        List<WebElement> rows = this.getElement().findElements(By.tagName("tr"));

        for (WebElement row : rows) {
            List<WebElement> columns = row.findElements(By.tagName("td"));

            for (WebElement column : columns) {
                String colText = column.getAttribute("innerText");
                System.out.println("========Column Text:" + colText);
                if (column.getText().equalsIgnoreCase(searchValue)) {
                    return row;
                }//if
            }//for 2
        }//for 1

        return null;
    }

    private WebElement findRowContainingText(String searchValue) {
        return this.getElement()
                .findElements(By.tagName("tr"))
                .stream()
                .filter(row -> row.findElements(By.tagName("td"))
                        .stream()
                        .peek( column -> System.out.println("========Peek:" + column.getAttribute("innerText")))
                        .anyMatch(column -> column.getAttribute("innerText").contains(searchValue)))
                .findFirst()
                .orElse(null);
    }

    @Override
    public String getFirstRow(String separator) {
        WebElement firstRow = this.getElement().findElements(By.tagName("tr")).get(1);
        List<WebElement> columns = firstRow.findElements(By.tagName("td"));
        String row_text = "";
        for (WebElement column : columns) {
            row_text += column.getText() + separator;
        }
        return row_text;
    }
}
