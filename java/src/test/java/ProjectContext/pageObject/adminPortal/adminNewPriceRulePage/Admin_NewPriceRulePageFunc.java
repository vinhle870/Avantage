
package ProjectContext.pageObject.adminPortal.adminNewPriceRulePage;

import ProjectContext.BusinessObject.Admin.Condition;
import ProjectContext.BusinessObject.Admin.PriceRule;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class Admin_NewPriceRulePageFunc {

    public static void fillPriceRuleForm(PriceRule priceRule, boolean submit) {
        Admin_NewPriceRulesPage.txt_Name().fillValue(priceRule.getName());
        Admin_NewPriceRulesPage.txt_Position().fillValue(priceRule.getPosition());
        Admin_NewPriceRulesPage.dpd_Apply_rule_if().selectOption(priceRule.getApplyRuleIf());
        addAndFillCondition(priceRule.getConditions().getCondition());
        Admin_NewPriceRulesPage.dpd_Apply().selectOption(priceRule.getApply());
        Admin_NewPriceRulesPage.txt_Amount().fillValue(priceRule.getAmount());
        if (Boolean.parseBoolean(priceRule.getStopFurtherProcessing())) Admin_NewPriceRulesPage.cbx_Stop_further_processing().select();

        if (submit) Admin_NewPriceRulesPage.btn_Save().click();
    }

    public static void addAndFillCondition(List<Condition> conditions) {
        AtomicInteger counter = new AtomicInteger();
        conditions.forEach(condition -> {
            if (counter.get() > 0) {
                Admin_NewPriceRulesPage.lnk_Add_Conditions().click();
            }


            WebElement card = Admin_NewPriceRulesPage.lab_Conditions().getElement()
                    .findElements((By.xpath("//div[contains(@class, 'card-body')]")))
                    .get(counter.get());

            //Fill condition info
            WebElement attribute = card.findElements(By.xpath("//select[contains(@id, '_attribute')]")).get(counter.get());
            new Select(attribute).selectByVisibleText(condition.getAttribute());

            WebElement operator = card.findElements(By.xpath("//select[contains(@id, '_operator')]")).get(counter.get());
            new Select(operator).selectByVisibleText(condition.getOperator());

            WebElement value = card.findElements(By.xpath("//input[contains(@id, '_value')]")).get(counter.get());
            value.sendKeys(condition.getValue());

            counter.getAndIncrement();
        });
    }

    public static void removeCondition() {
//        Admin_NewPriceRulesPage.lnk_Remove_Conditions().click();
    }
}
