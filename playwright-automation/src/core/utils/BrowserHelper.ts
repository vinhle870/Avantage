/**
 * Browser Helper Utilities
 * Browser interaction and utility functions
 */

import { Page } from '@playwright/test';
import { AppDriverFactory } from '../managers/AppDriverFactory';
import { GlobalConfigsReader } from '../config/GlobalConfigsReader';

export class BrowserHelper {
  /**
   * Take screenshot of entire page
   */
  public static async takeScreenshot(filename: string): Promise<Buffer> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    const screenshot = await page.screenshot({ fullPage: true });
    console.log(`Screenshot saved: ${filename}`);
    return screenshot;
  }

  /**
   * Save page source (HTML)
   */
  public static async savePageSource(filename: string): Promise<string> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    const content = await page.content();
    console.log(`Page source saved: ${filename}`);
    return content;
  }

  /**
   * Get page title
   */
  public static async getPageTitle(): Promise<string> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    return await page.title();
  }

  /**
   * Get current URL
   */
  public static async getCurrentUrl(): Promise<string> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    return page.url();
  }

  /**
   * Refresh page
   */
  public static async refreshPage(): Promise<void> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    await page.reload({ waitUntil: 'networkidle' });
  }

  /**
   * Go back
   */
  public static async goBack(): Promise<void> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    await page.goBack();
  }

  /**
   * Go forward
   */
  public static async goForward(): Promise<void> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    await page.goForward();
  }

  /**
   * Maximize window (not applicable for Playwright, but included for compatibility)
   */
  public static async maximizeWindow(): Promise<void> {
    console.log('Playwright runs in optimized viewport. Maximization not needed.');
  }

  /**
   * Get page HTML
   */
  public static async getPageHTML(): Promise<string> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    return await page.content();
  }

  /**
   * Clear cookies
   */
  public static async clearCookies(): Promise<void> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const context = driver.getContext();
    await context.clearCookies();
  }

  /**
   * Get all cookies
   */
  public static async getAllCookies(): Promise<any[]> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const context = driver.getContext();
    return await context.cookies();
  }

  /**
   * Add cookie
   */
  public static async addCookie(name: string, value: string, options?: any): Promise<void> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const context = driver.getContext();
    await context.addCookies([
      {
        name,
        value,
        url: await this.getCurrentUrl(),
        ...options,
      },
    ]);
  }

  /**
   * Wait for URL to match
   */
  public static async waitForUrl(urlPattern: string | RegExp, timeout?: number): Promise<void> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    await page.waitForURL(urlPattern, { timeout: timeout || GlobalConfigsReader.getWaitTime() * 1000 });
  }

  /**
   * Wait for navigation
   */
  public static async waitForNavigation(): Promise<void> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    await page.waitForLoadState('networkidle');
  }

  /**
   * Execute JavaScript
   */
  public static async executeScript(script: string, ...args: any[]): Promise<any> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    // Pass a single serializable object to avoid tuple/spread typing issues
    return await page.evaluate(({ code, evalArgs }: { code: string; evalArgs: any[] }) => {
      // eslint-disable-next-line no-eval
      return eval(code);
    }, { code: script, evalArgs: args });
  }

  /**
   * Get window handles (Playwright: all pages in context)
   */
  public static async getWindowHandles(): Promise<Page[]> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const context = driver.getContext();
    return context.pages();
  }

  /**
   * Switch to window by index
   */
  public static async switchToWindowByIndex(index: number): Promise<Page> {
    const pages = await this.getWindowHandles();
    if (index < 0 || index >= pages.length) {
      throw new Error(`Invalid window index: ${index}`);
    }
    return pages[index];
  }

  /**
   * Switch to frame
   */
  public static async switchToFrame(selector: string): Promise<void> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    const frameElement = await page.$(selector);
    if (!frameElement) {
      throw new Error(`Frame not found: ${selector}`);
    }
  }

  /**
   * Hover over element
   */
  public static async hoverOverElement(selector: string): Promise<void> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    await page.hover(selector);
  }

  /**
   * Scroll to element
   */
  public static async scrollToElement(selector: string): Promise<void> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    await page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Scroll page
   */
  public static async scrollPage(x: number, y: number): Promise<void> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    await page.evaluate(([scrollX, scrollY]) => {
      window.scrollBy(scrollX, scrollY);
    }, [x, y]);
  }

  /**
   * Get viewport size
   */
  public static async getViewportSize(): Promise<{ width: number; height: number } | null> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    return page.viewportSize();
  }

  /**
   * Set viewport size
   */
  public static async setViewportSize(width: number, height: number): Promise<void> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    await page.setViewportSize({ width, height });
  }

  /**
   * Accept alert
   */
  public static async acceptAlert(): Promise<void> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    page.once('dialog', dialog => dialog.accept());
  }

  /**
   * Dismiss alert
   */
  public static async dismissAlert(): Promise<void> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    page.once('dialog', dialog => dialog.dismiss());
  }

  /**
   * Get alert text
   */
  public static async getAlertText(): Promise<string> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    let alertText = '';
    page.once('dialog', dialog => {
      alertText = dialog.message();
      dialog.accept();
    });
    return alertText;
  }

  /**
   * Type in alert
   */
  public static async typeInAlert(text: string): Promise<void> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    page.once('dialog', dialog => {
      dialog.accept(text);
    });
  }

  /**
   * Download file
   */
  public static async downloadFile(linkSelector: string): Promise<string> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click(linkSelector),
    ]);

    const path = await download.path();
    return path || '';
  }

  /**
   * Upload file
   */
  public static async uploadFile(inputSelector: string, filePath: string): Promise<void> {
    const driver = AppDriverFactory.getInstance().getAppDriver();
    const page = driver.getPage();
    await page.locator(inputSelector).setInputFiles(filePath);
  }
}
