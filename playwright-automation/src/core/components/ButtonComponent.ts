import { Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * Button component for clickable buttons.
 * Converted from Java buttonImpl.java
 */
export class ButtonComponent extends BaseComponent {
    constructor(page: Page, selector: string) {
        super(page, selector);
    }

    /**
     * Get the button name/value
     */
    async getName(): Promise<string> {
        return (await this.locator.getAttribute('value')) || '';
    }

    /**
     * Get the button text
     */
    async getButtonText(): Promise<string> {
        return await this.getText();
    }

    /**
     * Check if button is disabled
     */
    async isDisabled(): Promise<boolean> {
        return await this.locator.isDisabled();
    }
}
