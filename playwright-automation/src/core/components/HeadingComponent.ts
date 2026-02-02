import { Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * Heading component for h1-h6 elements.
 * Converted from Java headingImpl.java
 */
export class HeadingComponent extends BaseComponent {
    constructor(page: Page, selector: string) {
        super(page, selector);
    }

    /**
     * Get the heading text
     */
    async getHeadingText(): Promise<string> {
        return await this.getText();
    }

    /**
     * Get the heading level (1-6)
     */
    async getLevel(): Promise<number> {
        const tagName = await this.locator.evaluate((el) => el.tagName.toLowerCase());
        const match = tagName.match(/h(\d)/);
        return match ? parseInt(match[1]) : 0;
    }
}
