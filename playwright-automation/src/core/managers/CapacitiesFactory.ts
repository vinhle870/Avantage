/**
 * Test Capabilities Factory
 * Manages browser capabilities and configurations
 */

// Playwright does not export a `BrowserName` type; define a local alias
type BrowserName = 'chromium' | 'firefox' | 'webkit';

export interface BrowserCapabilities {
  browserName: BrowserName;
  headless: boolean;
  slowMo: number;
  timeout: number;
  screenshot: 'only-on-failure' | 'off';
  video: 'retain-on-failure' | 'off';
  trace: 'retain-on-failure' | 'off';
}

export class CapacitiesFactory {
  private static instance: CapacitiesFactory;
  private capabilities: Map<string, BrowserCapabilities> = new Map();

  private constructor() {
    this.initializeCapabilities();
  }

  public static getInstance(): CapacitiesFactory {
    if (!CapacitiesFactory.instance) {
      CapacitiesFactory.instance = new CapacitiesFactory();
    }
    return CapacitiesFactory.instance;
  }

  private initializeCapabilities(): void {
    // Chrome capabilities
    this.capabilities.set('chrome', {
      browserName: 'chromium',
      headless: true,
      slowMo: 0,
      timeout: 30000,
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'retain-on-failure',
    });

    // Firefox capabilities
    this.capabilities.set('firefox', {
      browserName: 'firefox',
      headless: true,
      slowMo: 0,
      timeout: 30000,
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'retain-on-failure',
    });

    // Safari capabilities
    this.capabilities.set('safari', {
      browserName: 'webkit',
      headless: true,
      slowMo: 0,
      timeout: 30000,
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'retain-on-failure',
    });

    // Edge capabilities
    this.capabilities.set('edge', {
      browserName: 'chromium',
      headless: true,
      slowMo: 0,
      timeout: 30000,
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'retain-on-failure',
    });
  }

  /**
   * Get capabilities for browser
   */
  public getCapabilities(browserName: string): BrowserCapabilities {
    const capabilities = this.capabilities.get(browserName.toLowerCase());
    if (!capabilities) {
      throw new Error(`Capabilities not found for browser: ${browserName}`);
    }
    return capabilities;
  }

  /**
   * Set capabilities for browser
   */
  public setCapabilities(browserName: string, capabilities: BrowserCapabilities): void {
    this.capabilities.set(browserName.toLowerCase(), capabilities);
  }

  /**
   * Get all capabilities
   */
  public getAllCapabilities(): Map<string, BrowserCapabilities> {
    return new Map(this.capabilities);
  }

  /**
   * Update specific capability
   */
  public updateCapability(browserName: string, key: keyof BrowserCapabilities, value: any): void {
    const capabilities = this.getCapabilities(browserName);
    (capabilities as any)[key] = value;
  }

  /**
   * Create custom capabilities
   */
  public createCustomCapabilities(
    browserName: BrowserName,
    options?: Partial<BrowserCapabilities>
  ): BrowserCapabilities {
    const defaultCapabilities: BrowserCapabilities = {
      browserName,
      headless: true,
      slowMo: 0,
      timeout: 30000,
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'retain-on-failure',
    };

    return { ...defaultCapabilities, ...options };
  }

  /**
   * Get headless mode setting
   */
  public isHeadlessMode(browserName: string): boolean {
    return this.getCapabilities(browserName).headless;
  }

  /**
   * Get timeout setting
   */
  public getTimeout(browserName: string): number {
    return this.getCapabilities(browserName).timeout;
  }

  /**
   * Get screenshot setting
   */
  public getScreenshotSetting(browserName: string): 'only-on-failure' | 'off' {
    return this.getCapabilities(browserName).screenshot;
  }

  /**
   * Get video setting
   */
  public getVideoSetting(browserName: string): 'retain-on-failure' | 'off' {
    return this.getCapabilities(browserName).video;
  }

  /**
   * Get trace setting
   */
  public getTraceSetting(browserName: string): 'retain-on-failure' | 'off' {
    return this.getCapabilities(browserName).trace;
  }
}
