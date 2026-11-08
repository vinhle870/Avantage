import { Page, Locator } from '@playwright/test';
import { Condition, PriceRule } from '../../data/admin-portal';
import { selectCheckbox, selectDropdownOption } from '../../core/utils/uiActions';

/**
 * Admin New Price Rule Page - Create/Edit price rule form.
 * Converted from Admin_NewPriceRulesPage.java + Admin_NewPriceRulePageFunc.java
 */
export class AdminNewPriceRulePage {
    private page: Page;

    // Locators
    readonly txtName: Locator;
    readonly txtPosition: Locator;
    readonly dpdApplyRuleIf: Locator;
    readonly lnkAddConditions: Locator;
    readonly lnkRemoveConditions: Locator;
    readonly lblConditions: Locator;
    readonly ddlConditionAttributes: Locator;
    readonly ddlConditionOperators: Locator;
    readonly txtConditionValues: Locator;
    readonly dpdApply: Locator;
    readonly txtAmount: Locator;
    readonly cbxStopFurtherProcessing: Locator;
    readonly btnSave: Locator;

    constructor(page: Page) {
        this.page = page;
        this.txtName = page.locator('#price_rule_name');
        this.txtPosition = page.locator('#price_rule_position');
        this.dpdApplyRuleIf = page.locator('#price_rule_applyRuleIf');
        this.lnkAddConditions = page.locator("//i[@class='fal fa-plus-circle']").first();
        this.lnkRemoveConditions = page.locator("//i[@class='fal fa-minus-circle']").first();
        this.lblConditions = page.locator("//label[@for='Condition']");
        // One attribute/operator/value per condition card, in page order
        this.ddlConditionAttributes = page.locator("//select[contains(@id, '_attribute')]");
        this.ddlConditionOperators = page.locator("//select[contains(@id, '_operator')]");
        this.txtConditionValues = page.locator("//input[contains(@id, '_value')]");
        this.dpdApply = page.locator('#price_rule_actionType');
        this.txtAmount = page.locator('#price_rule_actionAmount');
        this.cbxStopFurtherProcessing = page.locator('#price_rule_stopFurtherProcessing');
        this.btnSave = page.locator('#price_rule_save');
    }

    /**
     * Fill the price rule form
     */
    async fillPriceRuleForm(priceRule: PriceRule, submit: boolean = true): Promise<void> {
        await this.txtName.fill(priceRule.name);
        await this.txtPosition.fill(priceRule.position);
        await selectDropdownOption(this.dpdApplyRuleIf, priceRule.applyRuleIf);
        await this.addAndFillConditions(priceRule.conditions);
        await selectDropdownOption(this.dpdApply, priceRule.apply);
        await this.txtAmount.fill(priceRule.amount);
        if (priceRule.stopFurtherProcessing.toLowerCase() === 'true') {
            await selectCheckbox(this.cbxStopFurtherProcessing);
        }

        if (submit) {
            await this.btnSave.click();
        }
    }

    /**
     * Fill the conditions; the form starts with one empty condition card
     */
    async addAndFillConditions(conditions: Condition[]): Promise<void> {
        for (let i = 0; i < conditions.length; i++) {
            if (i > 0) {
                await this.lnkAddConditions.click();
            }
            const condition = conditions[i];
            await this.ddlConditionAttributes.nth(i).selectOption({ label: condition.attribute });
            await this.ddlConditionOperators.nth(i).selectOption({ label: condition.operator });
            await this.txtConditionValues.nth(i).fill(condition.value);
        }
    }

    /**
     * Remove a condition
     */
    async removeCondition(): Promise<void> {
        await this.lnkRemoveConditions.click();
    }

    /**
     * Click save button
     */
    async save(): Promise<void> {
        await this.btnSave.click();
    }
}
