import { Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * Link component for anchor/link elements.
 * Converted from Java linkImpl.java
 */
export class LinkComponent extends BaseComponent {
    constructor(page: Page, selector: string) {
        super(page, selector);
    }

    /**
     * Click the link with retry using JavaScript if needed
     */
    async clickWithFallback(): Promise<void> {
        try {
            await this.locator.click();
        } catch {
            // Fallback to JavaScript click if normal click fails
            await this.locator.evaluate((el: Element) => { (el as any).click(); });
        }
    }

    /**
     * Get the href attribute of the link
     */
    async getHref(): Promise<string> {
        return (await this.locator.getAttribute('href')) || '';
    }

    /**
     * Get the link text
     */
    async getLinkText(): Promise<string> {
        return await this.getText();
    }

    /**
     * Check if link opens in new tab
     */
    async opensInNewTab(): Promise<boolean> {
        const target = await this.locator.getAttribute('target');
        return target === '_blank';
    }
}
