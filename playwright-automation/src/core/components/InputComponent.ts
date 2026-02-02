import { Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * Input component for text input fields.
 * Converted from Java inputImpl.java
 */
export class InputComponent extends BaseComponent {
    constructor(page: Page, selector: string) {
        super(page, selector);
    }

    /**
     * Fill the input with a value (clears first)
     */
    async fillValue(value: string | number): Promise<void> {
        await this.waitForVisible();
        await this.locator.clear();
        await this.locator.fill(String(value));
    }

    /**
     * Type text character by character (for inputs that don't support fill)
     */
    async typeValue(value: string): Promise<void> {
        await this.waitForVisible();
        await this.locator.clear();
        await this.locator.pressSequentially(value);
    }

    /**
     * Get the current value of the input
     */
    async getValue(): Promise<string> {
        return (await this.locator.inputValue()) || '';
    }

    /**
     * Clear the input field
     */
    async clear(): Promise<void> {
        await this.locator.clear();
    }

    /**
     * Get the shown/displayed value
     */
    async getShownValue(): Promise<string> {
        return await this.getValue();
    }
}
