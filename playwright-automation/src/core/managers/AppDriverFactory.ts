/**
 * Application Driver Factory
 * Creates and manages Playwright browser instances
 */

import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';
import { GlobalConfigsReader } from '../config/GlobalConfigsReader';

export interface DriverConfig {
  headless?: boolean;
  slowMo?: number;
  downloadsPath?: string;
  args?: string[];
}

export class AppDriver {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private config: DriverConfig;

  constructor(config?: DriverConfig) {
    this.config = config || {};
  }

  /**
   * Launch browser
   */
  public async launch(): Promise<void> {
    const browserType = GlobalConfigsReader.getPrimaryBrowser().toLowerCase();
    const headlessMode = GlobalConfigsReader.isHeadlessMode();

    const launchOptions = {
      headless: headlessMode,
      slowMo: this.config.slowMo || 0,
      args: this.config.args || [],
    };

    try {
      switch (browserType) {
        case 'chrome':
          this.browser = await chromium.launch(launchOptions);
          break;
        case 'firefox':
          this.browser = await firefox.launch(launchOptions);
          break;
        case 'safari':
          this.browser = await webkit.launch(launchOptions);
          break;
        default:
          this.browser = await chromium.launch(launchOptions);
      }

      console.log(`Browser launched: ${browserType}`);
    } catch (error) {
      console.error('Error launching browser:', error);
      throw error;
    }
  }

  /**
   * Create new context
   */
  public async createContext(): Promise<BrowserContext> {
    if (!this.browser) {
      throw new Error('Browser not launched. Call launch() first.');
    }

    try {
      this.context = await this.browser.newContext({
        viewport: { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true,
      });

      console.log('New context created');
      return this.context;
    } catch (error) {
      console.error('Error creating context:', error);
      throw error;
    }
  }

  /**
   * Create new page
   */
  public async createPage(): Promise<Page> {
    if (!this.context) {
      await this.createContext();
    }

    try {
      this.page = await this.context!.newPage();
      console.log('New page created');
      return this.page;
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  }

  /**
   * Get current page
   */
  public getPage(): Page {
    if (!this.page) {
      throw new Error('Page not created. Call createPage() first.');
    }
    return this.page;
  }

  /**
   * Get browser instance
   */
  public getBrowser(): Browser {
    if (!this.browser) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    return this.browser;
  }

  /**
   * Get context
   */
  public getContext(): BrowserContext {
    if (!this.context) {
      throw new Error('Context not created. Call createContext() first.');
    }
    return this.context;
  }

  /**
   * Close page
   */
  public async closePage(): Promise<void> {
    if (this.page) {
      await this.page.close();
      this.page = null;
      console.log('Page closed');
    }
  }

  /**
   * Close context
   */
  public async closeContext(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
      console.log('Context closed');
    }
  }

  /**
   * Close browser
   */
  public async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log('Browser closed');
    }
  }

  /**
   * Close all (page, context, browser)
   */
  public async closeAll(): Promise<void> {
    await this.closePage();
    await this.closeContext();
    await this.closeBrowser();
  }

  /**
   * Navigate to URL
   */
  public async navigateTo(url: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page not created. Call createPage() first.');
    }

    try {
      await this.page.goto(url, { waitUntil: 'networkidle' });
      console.log(`Navigated to: ${url}`);
    } catch (error) {
      console.error(`Error navigating to ${url}:`, error);
      throw error;
    }
  }

  /**
   * Wait for page load
   */
  public async waitForPageLoad(): Promise<void> {
    if (!this.page) {
      throw new Error('Page not created.');
    }

    try {
      await this.page.waitForLoadState('networkidle', { timeout: GlobalConfigsReader.getWaitTime() * 1000 });
    } catch (error) {
      console.error('Error waiting for page load:', error);
      throw error;
    }
  }
}

/**
 * App Driver Factory - Singleton pattern
 */
export class AppDriverFactory {
  private static instance: AppDriverFactory;
  private appDriver: AppDriver | null = null;

  private constructor() {}

  public static getInstance(): AppDriverFactory {
    if (!AppDriverFactory.instance) {
      AppDriverFactory.instance = new AppDriverFactory();
    }
    return AppDriverFactory.instance;
  }

  public createAppDriver(config?: DriverConfig): AppDriver {
    this.appDriver = new AppDriver(config);
    return this.appDriver;
  }

  public getAppDriver(): AppDriver {
    if (!this.appDriver) {
      throw new Error('AppDriver not created. Call createAppDriver() first.');
    }
    return this.appDriver;
  }

  public async closeAppDriver(): Promise<void> {
    if (this.appDriver) {
      await this.appDriver.closeAll();
      this.appDriver = null;
    }
  }
}
