import { Page, Locator } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * Dropdown component for select elements and custom UL-based dropdowns.
 * Converted from Java dropdownImpl.java
 */
export class DropdownComponent extends BaseComponent {
    constructor(page: Page, selector: string) {
        super(page, selector);
    }

    /**
     * Select an option by visible text.
     * Handles both native select elements and custom UL-based dropdowns.
     */
    async selectOption(optionText: string): Promise<void> {
        await this.waitForVisible();

        // Click to open dropdown
        await this.click();

        // Try to find UL element for custom dropdown
        const ulElement = this.locator.locator('ul');
        const hasUL = await ulElement.count() > 0;

        if (hasUL) {
            // Custom UL-based dropdown
            await this.selectFromULDropdown(optionText);
        } else {
            // Native select element
            await this.locator.selectOption({ label: optionText });
        }
    }

    /**
     * Select an option by value attribute
     */
    async selectByValue(value: string): Promise<void> {
        await this.locator.selectOption({ value });
    }

    /**
     * Select an option by index
     */
    async selectByIndex(index: number): Promise<void> {
        await this.locator.selectOption({ index });
    }

    /**
     * Get all available options (for native select)
     */
    async getOptions(): Promise<string[]> {
        const options = this.locator.locator('option');
        const count = await options.count();
        const optionTexts: string[] = [];

        for (let i = 0; i < count; i++) {
            const text = await options.nth(i).textContent();
            if (text) optionTexts.push(text);
        }

        return optionTexts;
    }

    /**
     * Get the currently selected option text
     */
    async getSelectedOption(): Promise<string> {
        const selectedOption = this.locator.locator('option:checked');
        return (await selectedOption.textContent()) || '';
    }

    /**
     * Remove/deselect an option (for multi-select)
     */
    async removeSelectedOption(optionText: string): Promise<void> {
        // Implementation depends on specific dropdown behavior
        console.log(`Removing option: ${optionText}`);
    }
}
