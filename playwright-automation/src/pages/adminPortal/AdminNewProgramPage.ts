import { Page, Locator } from '@playwright/test';
import { Program } from '../../data/admin-portal';
import { selectDropdownOption } from '../../core/utils/uiActions';

/**
 * Admin New Program Page - Create/Edit program form.
 * Converted from Admin_NewProgramsPage.java + Admin_NewProgramPageFunc.java
 */
export class AdminNewProgramPage {
    private page: Page;

    // Locators
    readonly txtName: Locator;
    readonly txtDescription: Locator;
    readonly txtCode: Locator;
    readonly dpdWarrantyCondition: Locator;
    readonly dpdWholesaler: Locator;
    readonly txtWarrantyStartDateDelay: Locator;
    readonly formErrors: Locator;
    readonly btnSave: Locator;

    constructor(page: Page) {
        this.page = page;
        this.txtName = page.locator('input[id="program_name"]');
        this.txtDescription = page.locator('input[id="program_description"]');
        this.txtCode = page.locator('input[id="program_code"]');
        this.dpdWarrantyCondition = page.locator("//select[@id='program_customCondition']");
        this.dpdWholesaler = page.locator('//div[label[text()="Wholesaler"]]');
        this.txtWarrantyStartDateDelay = page.locator('#program_warrantyStartDateDelay');
        this.formErrors = page.locator('form:has(#program_name) .invalid-feedback, form:has(#program_name) .form-error-message');
        // The page also holds the header search form; use the program form's own submit
        this.btnSave = page.locator('form:has(#program_name) [type="submit"]').first();
    }

    /**
     * Fill the new program form
     */
    async fillNewProgramForm(program: Program, submit: boolean = true): Promise<void> {
        await this.txtName.fill(program.name);
        await this.txtCode.fill(program.code);
        await this.txtDescription.fill(program.description);
        await selectDropdownOption(this.dpdWarrantyCondition, program.warrantyCondition.name);
        await this.txtWarrantyStartDateDelay.fill(program.warrantyStartDateDelay);

        if (submit) {
            await this.btnSave.click();
        }
    }
}
