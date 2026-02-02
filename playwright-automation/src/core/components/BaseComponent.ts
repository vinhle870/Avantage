import { Locator, Page } from '@playwright/test';

/**
 * Base component class for all UI components.
 * Provides common functionality like click, wait, get text, etc.
 * Converted from Java baseComponent.java
 */
export class BaseComponent {
    protected page: Page;
    protected locator: Locator;
    protected selector: string;

    constructor(page: Page, selector: string) {
        this.page = page;
        this.selector = selector;
        this.locator = page.locator(selector);
    }

    /**
     * Get the Playwright Locator for this component
     */
    getLocator(): Locator {
        return this.locator;
    }

    /**
     * Get the selector string for this component
     */
    getSelector(): string {
        return this.selector;
    }

    /**
     * Click on the element
     */
    async click(): Promise<void> {
        await this.locator.waitFor({ state: 'visible' });
        await this.locator.click();
    }

    /**
     * Get the text content of the element
     */
    async getText(): Promise<string> {
        return (await this.locator.textContent()) || '';
    }

    /**
     * Get an attribute value from the element
     */
    async getAttribute(name: string): Promise<string | null> {
        return await this.locator.getAttribute(name);
    }

    /**
     * Wait for the element to be visible
     */
    async waitForVisible(timeout?: number): Promise<void> {
        await this.locator.waitFor({ state: 'visible', timeout });
    }

    /**
     * Wait for the element to be enabled/clickable
     */
    async waitForEnabled(timeout?: number): Promise<void> {
        await this.locator.waitFor({ state: 'visible', timeout });
        // Playwright auto-waits for actionability, but we can check enabled state
        await this.locator.isEnabled();
    }

    /**
     * Check if element is visible
     */
    async isVisible(): Promise<boolean> {
        return await this.locator.isVisible();
    }

    /**
     * Check if element is enabled
     */
    async isEnabled(): Promise<boolean> {
        return await this.locator.isEnabled();
    }

    /**
     * Execute JavaScript on this element
     */
    async executeScript(script: string): Promise<void> {
        await this.locator.evaluate((el, script) => {
            const fn = new Function('arguments', script);
            fn([el]);
        }, script);
    }

    /**
     * Scroll the element into view
     */
    async scrollIntoView(): Promise<void> {
        await this.locator.scrollIntoViewIfNeeded();
    }

    /**
     * Get a child component by selector (relative to this component)
     */
    getChildLocator(selector: string): Locator {
        return this.locator.locator(selector);
    }

    /**
     * Get all child locators matching a selector
     */
    getChildLocators(selector: string): Locator {
        return this.locator.locator(selector);
    }

    /**
     * Click on a child element using a selector
     */
    async clickOnChild(selector: string): Promise<void> {
        await this.locator.locator(selector).click();
    }

    /**
     * Select an option from a UL dropdown list
     */
    async selectFromULDropdown(optionText: string): Promise<void> {
        const ulElement = this.locator.locator('ul');
        const items = ulElement.locator('li');
        const count = await items.count();

        for (let i = 0; i < count; i++) {
            const item = items.nth(i);
            const span = item.locator('span');
            const text = await span.textContent();

            if (text === optionText) {
                await item.click();
                return;
            }
        }

        throw new Error(`Option "${optionText}" not found in dropdown`);
    }
}
