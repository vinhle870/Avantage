import { Page, Locator, expect } from '@playwright/test';

/**
 * Login Page - Common page for both Admin and Dealer portals.
 * Converted from LoginPage.java + LoginPageFunc.java
 */
export class LoginPage {
    private page: Page;

    // Locators
    readonly txtUsername: Locator;
    readonly txtPassword: Locator;
    readonly btnSignIn: Locator;
    readonly lnkForgotPassword: Locator;
    readonly lblWelcome: Locator;

    constructor(page: Page) {
        this.page = page;
        this.txtUsername = page.locator("//input[@name='_username']");
        this.txtPassword = page.locator("//input[@name='_password']");
        this.btnSignIn = page.locator("//button[@type='submit']");
        this.lnkForgotPassword = page.getByRole('link', { name: 'Mot de passe oublié?' });
        this.lblWelcome = page.locator("small.text-muted");
    }

    /**
     * Navigate to login page
     */
    async goto(url?: string): Promise<void> {
        await this.page.goto(url || '/');
    }

    /**
     * Login to portal with username and password
     */
    async loginToPortal(userName: string, password: string): Promise<void> {
        await this.txtUsername.fill(userName);
        await this.txtPassword.fill(password);
        await this.btnSignIn.click();
    }

    /**
     * Click on forgot password link
     */
    async forgotPassword(): Promise<void> {
        await this.lnkForgotPassword.click();
    }

    /**
     * Verify welcome message is visible
     */
    async verifyWelcomeVisible(): Promise<void> {
        await expect(this.lblWelcome).toBeVisible();
    }

    /**
     * Get welcome text
     */
    async getWelcomeText(): Promise<string> {
        return (await this.lblWelcome.textContent()) || '';
    }

    /**
     * Check if login page is displayed
     */
    async isLoginPageDisplayed(): Promise<boolean> {
        return await this.txtUsername.isVisible();
    }
}
