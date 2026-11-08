import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Dealer flows add a vehicle and then read the newest row of the shared inventory,
 * so tests on one dealer account must not run concurrently. Raise WORKERS only when
 * each worker has its own account.
 */
const workers = Number(process.env.WORKERS || 1);

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://v2staging.garantieavantageplus.ca',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30000,
    navigationTimeout: 30000,
  },

  timeout: 120000,

  projects: [
    {
      // Offline checks of the PDF expectation logic — no browser, no application
      name: 'unit',
      testMatch: /.*\.unit\.spec\.ts/,
    },
    {
      name: 'chromium',
      testIgnore: /.*\.unit\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
