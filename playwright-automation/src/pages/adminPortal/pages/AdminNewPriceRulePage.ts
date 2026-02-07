import { Page, Locator, expect } from "@playwright/test";
import { AdminNewPriceRuleLocator } from "../locators/AdminNewPriceRuleLocator";

/**
 * Condition data interface
 */
export interface ConditionData {
  attribute: string;
  operator: string;
  value: string;
}

/**
 * PriceRule form data interface
 */
export interface PriceRuleFormData {
  name: string;
  position?: string;
  applyRuleIf?: string;
  conditions?: ConditionData[];
  apply?: string;
  amount?: string;
  stopFurtherProcessing?: boolean;
}

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
  readonly dpdApply: Locator;
  readonly txtAmount: Locator;
  readonly cbxStopFurtherProcessing: Locator;
  readonly btnSave: Locator;

  constructor(page: Page) {
    this.page = page;
    this.txtName = this.page.locator(AdminNewPriceRuleLocator.txtNameLocator);
    this.txtPosition = this.page.locator(
      AdminNewPriceRuleLocator.txtPositionLocator,
    );
    this.dpdApplyRuleIf = this.page.locator(
      AdminNewPriceRuleLocator.dpdApplyRuleIfLocator,
    );
    this.lnkAddConditions = this.page.locator(
      AdminNewPriceRuleLocator.lnkAddConditionsLocator,
    );
    this.lnkRemoveConditions = this.page.locator(
      AdminNewPriceRuleLocator.lnkRemoveConditionsLocator,
    );
    this.lblConditions = this.page.locator(
      AdminNewPriceRuleLocator.lblConditionsLocator,
    );
    this.dpdApply = this.page.locator(AdminNewPriceRuleLocator.dpdApplyLocator);
    this.txtAmount = this.page.locator(
      AdminNewPriceRuleLocator.txtAmountLocator,
    );
    this.cbxStopFurtherProcessing = this.page.locator(
      AdminNewPriceRuleLocator.cbxStopFurtherProcessingLocator,
    );
    this.btnSave = this.page.locator(AdminNewPriceRuleLocator.btnSaveLocator);
  }

  /**
   * Fill the price rule form
   */
  async fillPriceRuleForm(
    priceRule: PriceRuleFormData,
    submit: boolean = true,
  ): Promise<void> {
    await this.txtName.fill(priceRule.name);

    if (priceRule.position) await this.txtPosition.fill(priceRule.position);
    if (priceRule.applyRuleIf)
      await this.dpdApplyRuleIf.selectOption({ label: priceRule.applyRuleIf });

    if (priceRule.conditions && priceRule.conditions.length > 0) {
      await this.addAndFillConditions(priceRule.conditions);
    }

    if (priceRule.apply)
      await this.dpdApply.selectOption({ label: priceRule.apply });
    if (priceRule.amount) await this.txtAmount.fill(priceRule.amount);

    if (priceRule.stopFurtherProcessing) {
      await this.cbxStopFurtherProcessing.check();
    }

    if (submit) {
      await this.btnSave.click();
    }
  }

  /**
   * Add and fill multiple conditions
   */
  async addAndFillConditions(conditions: ConditionData[]): Promise<void> {
    for (let i = 0; i < conditions.length; i++) {
      if (i > 0) {
        await this.lnkAddConditions.click();
      }

      const condition = conditions[i];
      const cardBody = this.page.locator("div.card-body").nth(i);

      // Fill attribute dropdown
      const attributeSelect = cardBody.locator("select[id*='_attribute']");
      await attributeSelect.selectOption({ label: condition.attribute });

      // Fill operator dropdown
      const operatorSelect = cardBody.locator("select[id*='_operator']");
      await operatorSelect.selectOption({ label: condition.operator });

      // Fill value input
      const valueInput = cardBody.locator("input[id*='_value']");
      await valueInput.fill(condition.value);
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
