package core.components.datepicker;

import core.components.baseComponent.baseComponent;
import core.components.baseComponent.iBaseComponent;
import core.components.table.iTable;
import core.components.table.tableImpl;
import org.openqa.selenium.By;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.Locale;

public class DatePickerImpl extends baseComponent implements iDatePicker {
    private iTable tbl_DateItems;

    public DatePickerImpl(By locator) {
        super(locator);

    }
    @Override
    public void pickDate(String date) {

        tbl_DateItems = new tableImpl(By.xpath(".//table"));

        String year = date.split("-")[0];

        String monthNumber = date.split("-")[1];
        String monthShort = Month.of(Integer.parseInt(monthNumber))
                .getDisplayName(TextStyle.SHORT, Locale.ENGLISH); // "Mar"

        String day = date.split("-")[2];

        By div_Navigation = By.xpath(".//div[@role='period']");

        iBaseComponent navigator = this.getChildComponent(div_Navigation);

        //Select YEAR
        for(int i=0; i<2; i++)
        {
            navigator.click();
        }

        iBaseComponent table = this.getChildComponent(By.xpath(".//table"));

        this.tbl_DateItems.setElement(table.getElement());

        //clickOnChildContainingText
        this.tbl_DateItems.clickOnChild(year, By.xpath(".//div[text()='"+year+"']"));

        //Select MONTH
        this.tbl_DateItems.clickOnChild(monthShort, By.xpath(".//div[text()='"+monthShort+"']"));

        //Select DAY
        table = this.getChildComponent(By.xpath(".//table"));

        this.tbl_DateItems.setElement(table.getElement());

        this.tbl_DateItems.clickOnChild(day, By.xpath(".//div[text()='"+day+"']"));

        System.out.println("Date selected: "+date);

    }

}
