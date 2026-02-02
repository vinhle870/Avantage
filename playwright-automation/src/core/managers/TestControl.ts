/**
 * Test Control Manager
 * Manages test execution flow and lifecycle
 */

import { AppDriverFactory } from './AppDriverFactory';
import { CapacitiesFactory } from './CapacitiesFactory';
import { GlobalConfigsReader } from '../config/GlobalConfigsReader';
import { EnvInfoReader } from '../config/EnvInfoReader';

export interface TestExecutionContext {
  testName: string;
  startTime: Date;
  endTime?: Date;
  status: 'RUNNING' | 'PASSED' | 'FAILED' | 'SKIPPED';
  errorMessage?: string;
}

export class TestControl {
  private static instance: TestControl;
  private appDriverFactory: AppDriverFactory;
  private capacitiesFactory: CapacitiesFactory;
  private executionContexts: Map<string, TestExecutionContext> = new Map();
  private currentTestContext: TestExecutionContext | null = null;

  private constructor() {
    this.appDriverFactory = AppDriverFactory.getInstance();
    this.capacitiesFactory = CapacitiesFactory.getInstance();
  }

  public static getInstance(): TestControl {
    if (!TestControl.instance) {
      TestControl.instance = new TestControl();
    }
    return TestControl.instance;
  }

  /**
   * Initialize test environment
   */
  public async initializeTest(testName: string): Promise<void> {
    try {
      console.log(`Initializing test: ${testName}`);

      // Create execution context
      this.currentTestContext = {
        testName,
        startTime: new Date(),
        status: 'RUNNING',
      };

      this.executionContexts.set(testName, this.currentTestContext);

      // Load configurations
      const config = GlobalConfigsReader.getConfig();
      const envInfo = EnvInfoReader.getEnvInfo();

      console.log(`Environment: ${config.envName}`);
      console.log(`Browser: ${config.browsers[0]}`);
      console.log(`Headless: ${config.headlessMode}`);

      // Create app driver
      const driver = this.appDriverFactory.createAppDriver({
        headless: config.headlessMode,
      });

      await driver.launch();
      await driver.createContext();
      await driver.createPage();

      console.log(`Test initialized successfully: ${testName}`);
    } catch (error) {
      console.error(`Error initializing test ${testName}:`, error);
      if (this.currentTestContext) {
        this.currentTestContext.status = 'FAILED';
        this.currentTestContext.errorMessage = String(error);
      }
      throw error;
    }
  }

  /**
   * Clean up after test
   */
  public async cleanupTest(): Promise<void> {
    try {
      if (this.currentTestContext) {
        const testName = this.currentTestContext.testName;
        console.log(`Cleaning up test: ${testName}`);

        // Close driver
        await this.appDriverFactory.closeAppDriver();

        // Update context
        this.currentTestContext.endTime = new Date();
        const duration = this.currentTestContext.endTime.getTime() - this.currentTestContext.startTime.getTime();
        console.log(`Test cleanup completed. Duration: ${duration}ms`);
      }
    } catch (error) {
      console.error('Error during test cleanup:', error);
      throw error;
    }
  }

  /**
   * Mark test as passed
   */
  public markTestPassed(): void {
    if (this.currentTestContext) {
      this.currentTestContext.status = 'PASSED';
      console.log(`Test marked as PASSED: ${this.currentTestContext.testName}`);
    }
  }

  /**
   * Mark test as failed
   */
  public markTestFailed(errorMessage: string): void {
    if (this.currentTestContext) {
      this.currentTestContext.status = 'FAILED';
      this.currentTestContext.errorMessage = errorMessage;
      console.error(`Test marked as FAILED: ${this.currentTestContext.testName} - ${errorMessage}`);
    }
  }

  /**
   * Mark test as skipped
   */
  public markTestSkipped(): void {
    if (this.currentTestContext) {
      this.currentTestContext.status = 'SKIPPED';
      console.log(`Test marked as SKIPPED: ${this.currentTestContext.testName}`);
    }
  }

  /**
   * Get current test context
   */
  public getCurrentTestContext(): TestExecutionContext | null {
    return this.currentTestContext;
  }

  /**
   * Get test execution context by name
   */
  public getTestContext(testName: string): TestExecutionContext | undefined {
    return this.executionContexts.get(testName);
  }

  /**
   * Get all execution contexts
   */
  public getAllExecutionContexts(): Map<string, TestExecutionContext> {
    return new Map(this.executionContexts);
  }

  /**
   * Get test statistics
   */
  public getTestStatistics(): {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  } {
    let passed = 0;
    let failed = 0;
    let skipped = 0;

    this.executionContexts.forEach(context => {
      if (context.status === 'PASSED') passed++;
      else if (context.status === 'FAILED') failed++;
      else if (context.status === 'SKIPPED') skipped++;
    });

    return {
      total: this.executionContexts.size,
      passed,
      failed,
      skipped,
    };
  }

  /**
   * Clear all execution contexts
   */
  public clearAllContexts(): void {
    this.executionContexts.clear();
    this.currentTestContext = null;
    console.log('All execution contexts cleared');
  }

  /**
   * Get app driver
   */
  public getAppDriver() {
    return this.appDriverFactory.getAppDriver();
  }

  /**
   * Get capacities factory
   */
  public getCapacitiesFactory(): CapacitiesFactory {
    return this.capacitiesFactory;
  }

  /**
   * Wait for specified milliseconds
   */
  public async wait(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * Retry operation with backoff
   */
  public async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          const backoffDelay = delayMs * Math.pow(2, i);
          await this.wait(backoffDelay);
        }
      }
    }

    throw lastError || new Error('Operation failed after retries');
  }
}
