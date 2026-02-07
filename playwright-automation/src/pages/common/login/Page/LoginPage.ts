import { Page, Locator, expect } from "@playwright/test";
import { LoginLocator } from "../locator/LoginLocator";

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
    this.txtUsername = this.page.locator(LoginLocator.txtUsernameLocator);
    this.txtPassword = this.page.locator(LoginLocator.txtPasswordLocator);
    this.btnSignIn = this.page.locator(LoginLocator.btnSignInLocator);
    this.lnkForgotPassword = this.page.locator(
      LoginLocator.lnkForgotPasswordLocator,
    );
    this.lblWelcome = this.page.locator(LoginLocator.lblWelcomeLocator);
  }

  /**
   * Navigate to login page
   */
  async goto(url?: string): Promise<void> {
    await this.page.goto(url || "/");
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
    return (await this.lblWelcome.textContent()) || "";
  }

  /**
   * Check if login page is displayed
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    return await this.txtUsername.isVisible();
  }
}
