import { Page, Locator } from '@playwright/test';
import { ProgOption } from '../../data/admin-portal';

/**
 * Program Option Modal - Add/Edit an option of a program.
 * Converted from ProgOptionDetail_Mdal.java + ProgOptionDetail_Mdal_Func.java
 */
export class ProgramOptionModal {
    private page: Page;

    // Locators
    readonly txtName: Locator;
    readonly txtCode: Locator;
    readonly btnSave: Locator;

    constructor(page: Page) {
        this.page = page;
        this.txtName = page.locator('[id="program_option_name"]');
        this.txtCode = page.locator('[id="program_option_code"]');
        this.btnSave = page.locator('[type="submit"]').first();
    }

    async fillProgramOption(option: ProgOption, submit: boolean = true): Promise<void> {
        await this.txtName.fill(option.name);
        await this.txtCode.fill(option.code);
        if (submit) {
            await this.btnSave.click();
        }
    }
}
