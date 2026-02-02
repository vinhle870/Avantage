import { test, expect } from '@playwright/test';

// Simple smoke test to verify the admin login page loads
test('smoke: admin login page loads', async ({ page }) => {
  const url = 'https://v2staging.garantieavantageplus.ca/admin/login';

  await page.goto(url, { waitUntil: 'networkidle' });

  // Basic assertions: URL and non-empty title
  await expect(page).toHaveURL(/admin\/login/);
  const title = await page.title();
  console.log('Page title:', title);
  expect(title.length).toBeGreaterThan(0);
});
