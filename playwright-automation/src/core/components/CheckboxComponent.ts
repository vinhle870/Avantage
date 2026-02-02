import { Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * Checkbox component for checkbox inputs.
 * Converted from Java checkboxImpl.java
 */
export class CheckboxComponent extends BaseComponent {
    constructor(page: Page, selector: string) {
        super(page, selector);
    }

    /**
     * Select/check the checkbox (only if not already checked)
     */
    async select(): Promise<void> {
        const isChecked = await this.isChecked();
        if (!isChecked) {
            await this.click();
        }
    }

    /**
     * Unselect/uncheck the checkbox (only if currently checked)
     */
    async unselect(): Promise<void> {
        const isChecked = await this.isChecked();
        if (isChecked) {
            await this.click();
        }
    }

    /**
     * Check the checkbox using Playwright's check method
     */
    async check(): Promise<void> {
        await this.locator.check();
    }

    /**
     * Uncheck the checkbox using Playwright's uncheck method
     */
    async uncheck(): Promise<void> {
        await this.locator.uncheck();
    }

    /**
     * Get the current checked status
     */
    async isChecked(): Promise<boolean> {
        return await this.locator.isChecked();
    }

    /**
     * Alias for isChecked - matches Java getStatus() method
     */
    async getStatus(): Promise<boolean> {
        return await this.isChecked();
    }
}
