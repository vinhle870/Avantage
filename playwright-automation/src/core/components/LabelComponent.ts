import { Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * Label component for text labels and display elements.
 * Converted from Java labelImpl.java
 */
export class LabelComponent extends BaseComponent {
    constructor(page: Page, selector: string) {
        super(page, selector);
    }

    /**
     * Get the label text
     */
    async getLabelText(): Promise<string> {
        return await this.getText();
    }

    /**
     * Check if label contains specific text
     */
    async containsText(text: string): Promise<boolean> {
        const labelText = await this.getText();
        return labelText.includes(text);
    }
}
