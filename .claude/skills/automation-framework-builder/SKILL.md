---
name: automation-framework-builder
description: >-
  Scaffold a production-grade Playwright TypeScript automation framework with
  Page Object Model (POM), Builder pattern for test data, and global
  configuration accessible in every test via Playwright's "use" fixture
  annotation. Trigger when the user says "build automation framework",
  "init automation framework", "scaffold playwright framework", "create test
  automation project", "set up playwright with POM", "initialize automation
  tests", or "create e2e framework".
argument-hint: "[project-name] [target-directory] [base-url]"
---

# Skill: Automation Framework Builder

You are a senior SDET with 10+ years of experience. Your job is to scaffold a
complete, working Playwright TypeScript framework on disk — create every file,
run every install command, and verify the result before handing off.

---

## Pre-flight — Gather Inputs

Ask the user (or infer from arguments) before doing anything:

| Input | Default |
|---|---|
| **Project name** | `automation-framework` |
| **Target directory** | current working directory |
| **App base URL** | `http://localhost:3000` |

Confirm: _"I'll scaffold the framework at `{target-dir}/{project-name}` targeting
`{base-url}`. Proceed?"_

---

## Framework Architecture

```
{project-name}/
├── src/
│   ├── config/
│   │   └── config.ts              # AppConfig interface + env-driven singleton
│   ├── fixtures/
│   │   └── base.fixture.ts        # Playwright base.extend() — appConfig, logger,
│   │                              #   pages exposed via "use" to every test
│   ├── pages/
│   │   ├── BasePage.ts            # Abstract POM with shared browser interactions
│   │   ├── LoginPage.ts           # Sample concrete page object
│   │   └── PageFactory.ts         # Lazy-init page instance cache (per test)
│   ├── builders/
│   │   ├── BaseBuilder.ts         # Abstract fluent builder with clone/reset
│   │   └── UserBuilder.ts         # Sample test-data builder
│   └── utils/
│       ├── logger.ts              # Structured console logger
│       └── waiter.ts              # Explicit wait helpers wrapping Playwright waits
├── tests/
│   └── ui/
│       └── login.spec.ts          # Sample test — uses all four patterns
├── test-results/
│   ├── html/                      # HTML report output
│   └── screenshots/               # takeScreenshot() output path
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── .env.example
└── .gitignore
```

---

## Workflow

### Step 1 — Scaffold directory structure

Run the platform init script, or create directories manually.

- **Windows:** `.claude/skills/automation-framework-builder/scripts/init.ps1`
  with `-ProjectName` and `-TargetDir` parameters.
- **Linux/macOS:** `.claude/skills/automation-framework-builder/scripts/init.sh`
  with positional args `project-name target-dir`.

Directories to ensure exist:

```
{root}/src/config/
{root}/src/fixtures/
{root}/src/pages/
{root}/src/builders/
{root}/src/utils/
{root}/tests/ui/
{root}/test-results/
```

---

### Step 2 — Write `package.json`

Replace `{project-name}` and `{base-url}` with the user's inputs.

```json
{
  "name": "{project-name}",
  "version": "1.0.0",
  "description": "Playwright automation test framework",
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:ui": "playwright test --ui",
    "test:report": "playwright show-report test-results/html",
    "test:chromium": "playwright test --project=chromium",
    "test:firefox": "playwright test --project=firefox",
    "test:webkit": "playwright test --project=webkit",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@playwright/test": "^1.44.0",
    "@types/node": "^20.0.0",
    "dotenv": "^16.0.0",
    "typescript": "^5.4.0"
  }
}
```

---

### Step 3 — Write `tsconfig.json`

Path aliases (`@config/*`, `@fixtures/*`, etc.) are consumed by Playwright's
built-in TypeScript bundler — no extra tsconfig-paths plugin needed.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@config/*": ["src/config/*"],
      "@fixtures/*": ["src/fixtures/*"],
      "@pages/*": ["src/pages/*"],
      "@builders/*": ["src/builders/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src/**/*.ts", "tests/**/*.ts", "playwright.config.ts"],
  "exclude": ["node_modules", "test-results", "dist"]
}
```

---

### Step 4 — Write `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'test-results/html', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],

  use: {
    baseURL: process.env.BASE_URL || '{base-url}',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

---

### Step 5 — Write `src/config/config.ts`

The `AppConfig` interface is the single source of truth for all environment
values. Tests access it via the `appConfig` fixture, not by importing this
file directly.

```typescript
import dotenv from 'dotenv';

dotenv.config();

export interface AppConfig {
  baseUrl: string;
  apiUrl: string;
  timeout: number;
  retries: number;
  credentials: {
    adminEmail: string;
    adminPassword: string;
  };
}

export const config: AppConfig = {
  baseUrl: process.env.BASE_URL || '{base-url}',
  apiUrl: process.env.API_URL || 'http://localhost:8080/api',
  timeout: Number(process.env.DEFAULT_TIMEOUT) || 30_000,
  retries: Number(process.env.RETRIES) || 1,
  credentials: {
    adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
    adminPassword: process.env.ADMIN_PASSWORD || 'AdminPass123!',
  },
};
```

---

### Step 6 — Write `src/fixtures/base.fixture.ts`

This is the **"use" annotation** core. Every test that imports `test` from
this file automatically receives `appConfig`, `logger`, and `pages` via
Playwright's fixture injection (`async ({}, use) => { await use(value); }`).

Tests can override `baseURL` per file or per describe block:
```typescript
test.use({ baseURL: 'https://staging.example.com' });
```

```typescript
import { test as base } from '@playwright/test';
import { config, AppConfig } from '@config/config';
import { Logger } from '@utils/logger';
import { PageFactory } from '@pages/PageFactory';

type TestFixtures = {
  /** Global app configuration — reads BASE_URL, credentials, timeouts from .env */
  appConfig: AppConfig;
  /** Structured console logger scoped to the current test */
  logger: Logger;
  /** Lazy-init page object registry — call pages.login, pages.dashboard, etc. */
  pages: PageFactory;
};

/**
 * Extended Playwright test fixture.
 *
 * Import `test` and `expect` from this file in every spec:
 *   import { test, expect } from '@fixtures/base.fixture';
 *
 * Fixtures exposed via the `use` annotation:
 *   - appConfig  → global env config (baseUrl, apiUrl, credentials, timeouts)
 *   - logger     → structured console logger
 *   - pages      → PageFactory instance (lazy page object cache)
 *
 * Override baseURL for a specific file:
 *   test.use({ baseURL: 'https://staging.example.com' });
 */
export const test = base.extend<TestFixtures>({
  appConfig: async ({ baseURL }, use) => {
    await use({ ...config, baseUrl: baseURL ?? config.baseUrl });
  },

  logger: async ({}, use) => {
    await use(new Logger());
  },

  pages: async ({ page }, use) => {
    const factory = new PageFactory(page);
    await use(factory);
    factory.clear();
  },
});

export { expect } from '@playwright/test';
```

---

### Step 7 — Write `src/pages/BasePage.ts`

```typescript
import { Page, Locator } from '@playwright/test';
import { Logger } from '@utils/logger';
import { Waiter } from '@utils/waiter';

export abstract class BasePage {
  protected readonly logger: Logger;
  protected readonly waiter: Waiter;

  constructor(protected readonly page: Page) {
    this.logger = new Logger();
    this.waiter = new Waiter(page);
  }

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  async navigateTo(path: string): Promise<void> {
    this.logger.info(`Navigating to: ${path}`);
    await this.page.goto(path, { waitUntil: 'networkidle' });
  }

  async typeText(selector: string, text: string): Promise<void> {
    this.logger.info(`Typing into ${selector}`);
    await this.locator(selector).fill(text);
  }

  async click(selector: string): Promise<void> {
    this.logger.info(`Clicking ${selector}`);
    await this.locator(selector).click();
  }

  async getText(selector: string): Promise<string> {
    const text = await this.locator(selector).textContent();
    return text?.trim() ?? '';
  }

  async isVisible(selector: string, timeout = 5_000): Promise<boolean> {
    try {
      await this.locator(selector).waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async currentUrl(): Promise<string> {
    return this.page.url();
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
    this.logger.info(`Screenshot saved: ${name}.png`);
  }
}
```

---

### Step 8 — Write `src/pages/LoginPage.ts`

Locators are `private readonly` constants — never scattered in test files.

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly sel = {
    emailInput:    'input[name="email"]',
    passwordInput: 'input[name="password"]',
    submitButton:  'button[type="submit"]',
    errorMessage:  '[data-testid="error-message"]',
  } as const;

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.navigateTo('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.typeText(this.sel.emailInput, email);
    await this.typeText(this.sel.passwordInput, password);
    await this.click(this.sel.submitButton);
    await this.waitForNavigation();
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.sel.errorMessage);
  }

  async isErrorVisible(): Promise<boolean> {
    return this.isVisible(this.sel.errorMessage);
  }
}
```

---

### Step 9 — Write `src/pages/PageFactory.ts`

Instance-based (not static) so each test gets its own isolated cache.

```typescript
import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';

type PageConstructor<T> = new (page: Page) => T;

export class PageFactory {
  private readonly cache = new Map<string, unknown>();

  constructor(private readonly page: Page) {}

  get<T>(PageClass: PageConstructor<T>): T {
    const key = PageClass.name;
    if (!this.cache.has(key)) {
      this.cache.set(key, new PageClass(this.page));
    }
    return this.cache.get(key) as T;
  }

  get login(): LoginPage {
    return this.get(LoginPage);
  }

  /** Add more getters here as you add page objects, e.g.:
   *  get dashboard(): DashboardPage { return this.get(DashboardPage); }
   */

  clear(): void {
    this.cache.clear();
  }
}
```

---

### Step 10 — Write `src/builders/BaseBuilder.ts`

```typescript
export abstract class BaseBuilder<T> {
  protected data: Partial<T> = {};

  abstract build(): T;

  /** Bulk-set multiple fields. */
  with(props: Partial<T>): this {
    this.data = { ...this.data, ...props };
    return this;
  }

  /** Reset all fields to initial state. */
  reset(): this {
    this.data = {};
    return this;
  }

  /** Deep-copy the current builder state into a new builder instance. */
  clone(): this {
    const copy = new (this.constructor as new () => this)();
    copy.data = { ...this.data };
    return copy;
  }
}
```

---

### Step 11 — Write `src/builders/UserBuilder.ts`

Defaults are set in the constructor so `.build()` is safe to call immediately.

```typescript
import { BaseBuilder } from './BaseBuilder';

export interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'viewer';
  isActive: boolean;
}

export class UserBuilder extends BaseBuilder<UserPayload> {
  constructor() {
    super();
    this.data = {
      firstName: 'Test',
      lastName: 'User',
      email: `test.user.${Date.now()}@example.com`,
      password: 'TestPass123!',
      role: 'user',
      isActive: true,
    };
  }

  withFirstName(firstName: string): this {
    this.data.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): this {
    this.data.lastName = lastName;
    return this;
  }

  withEmail(email: string): this {
    this.data.email = email;
    return this;
  }

  withPassword(password: string): this {
    this.data.password = password;
    return this;
  }

  withRole(role: UserPayload['role']): this {
    this.data.role = role;
    return this;
  }

  asAdmin(): this {
    return this.withRole('admin');
  }

  asInactive(): this {
    this.data.isActive = false;
    return this;
  }

  build(): UserPayload {
    const { firstName, email, password, role } = this.data;
    if (!firstName || !email || !password || !role) {
      throw new Error('UserBuilder: firstName, email, password, and role are required');
    }
    return this.data as UserPayload;
  }
}
```

---

### Step 12 — Write `src/utils/logger.ts`

```typescript
type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export class Logger {
  private log(level: LogLevel, message: string, data?: unknown): void {
    const ts = new Date().toISOString();
    if (data !== undefined) {
      console.log(`[${level}] ${ts} — ${message}`, data);
    } else {
      console.log(`[${level}] ${ts} — ${message}`);
    }
  }

  info(message: string, data?: unknown): void {
    this.log('INFO', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log('WARN', message, data);
  }

  error(message: string, data?: unknown): void {
    this.log('ERROR', message, data);
  }

  debug(message: string, data?: unknown): void {
    this.log('DEBUG', message, data);
  }
}
```

---

### Step 13 — Write `src/utils/waiter.ts`

```typescript
import { Page, Locator } from '@playwright/test';

export class Waiter {
  constructor(private readonly page: Page) {}

  async forElement(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async forUrl(pattern: string | RegExp, timeout = 10_000): Promise<void> {
    await this.page.waitForURL(pattern, { timeout });
  }

  async forNetworkIdle(timeout = 10_000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  async forSelector(selector: string, timeout = 10_000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  async forResponse(urlPattern: string | RegExp, timeout = 10_000): Promise<void> {
    await this.page.waitForResponse(urlPattern, { timeout });
  }
}
```

---

### Step 14 — Write `tests/ui/login.spec.ts`

This sample test demonstrates all four framework patterns working together.

```typescript
import { test, expect } from '@fixtures/base.fixture';
import { UserBuilder } from '@builders/UserBuilder';

/**
 * Use annotation: override baseURL for this entire file if needed.
 * Uncomment the line below to run this suite against a different environment:
 */
// test.use({ baseURL: 'https://staging.example.com' });

test.describe('Authentication', () => {
  test.beforeEach(async ({ pages }) => {
    await pages.login.navigate();
  });

  test('TC-001: valid credentials redirect to dashboard', async ({
    page,
    pages,
    appConfig,
    logger,
  }) => {
    // Builder pattern: construct test data fluently with defaults
    const user = new UserBuilder()
      .withEmail(appConfig.credentials.adminEmail)
      .withPassword(appConfig.credentials.adminPassword)
      .build();

    logger.info(`Logging in as ${user.email}`);

    // Page Object Model: all UI interaction through LoginPage
    await pages.login.login(user.email, user.password);

    // Global config via fixture: appConfig.baseUrl available without import
    logger.info(`Base URL from fixture: ${appConfig.baseUrl}`);

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('TC-002: invalid credentials show error message', async ({
    pages,
    logger,
  }) => {
    const user = new UserBuilder()
      .withEmail('invalid@example.com')
      .withPassword('WrongPassword!')
      .build();

    logger.info('Testing invalid login scenario');
    await pages.login.login(user.email, user.password);

    expect(await pages.login.isErrorVisible()).toBe(true);
    expect(await pages.login.getErrorMessage()).toContain('Invalid');
  });

  test('TC-003: builder shorthand methods produce correct payloads', async () => {
    const admin = new UserBuilder().asAdmin().withEmail('admin@example.com').build();
    expect(admin.role).toBe('admin');

    const inactive = new UserBuilder().asInactive().build();
    expect(inactive.isActive).toBe(false);

    const cloned = new UserBuilder().withRole('viewer').clone().asAdmin().build();
    expect(cloned.role).toBe('admin');
  });
});
```

---

### Step 15 — Write `.env.example`

Replace `{base-url}` with the user's input.

```bash
# Target application
BASE_URL={base-url}
API_URL=http://localhost:8080/api

# Test credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=AdminPass123!

# Timeouts & retries
DEFAULT_TIMEOUT=30000
RETRIES=1

# Set to "false" to run headed locally
HEADLESS=true
```

---

### Step 16 — Write `.gitignore`

```
node_modules/
dist/
test-results/
.env
*.log
playwright-report/
```

---

### Step 17 — Install dependencies

Run from the project root directory:

```bash
npm install
npx playwright install --with-deps
```

---

### Step 18 — Verify TypeScript compilation

```bash
npx tsc --noEmit
```

If this passes with zero errors, the scaffold is complete. If errors appear,
fix them before reporting success.

---

### Step 19 — Run the sample test (smoke check)

```bash
npx playwright test tests/ui/login.spec.ts --project=chromium --headed
```

Expected: test TC-003 passes (pure builder logic, no browser needed for that
assertion). TC-001 and TC-002 will fail if no real app is running — that is
expected and acceptable at scaffold time. Report this to the user.

---

## Rules

- Never overwrite an existing `.env` file — only create `.env.example`.
- Always use `private readonly` for POM locator maps.
- Never put locator selectors in test files — only in page objects.
- Page objects inherit from `BasePage`; builders inherit from `BaseBuilder<T>`.
- `PageFactory` must be instantiated per test (via the `pages` fixture), never
  as a static singleton — static shared state breaks parallel test runs.
- When adding a new page object: create the class in `src/pages/`, add a
  getter to `PageFactory`, no other changes required.
- When adding a new builder: create the class in `src/builders/`, extend
  `BaseBuilder<YourPayload>`. No registration needed.

---

## Extending the Framework

### Adding a new page object

1. Create `src/pages/YourPage.ts` extending `BasePage`
2. Add a getter to `src/pages/PageFactory.ts`:
   ```typescript
   get yourPage(): YourPage { return this.get(YourPage); }
   ```
3. Use in tests: `pages.yourPage.doSomething()`

### Adding a new builder

1. Create `src/builders/YourBuilder.ts` extending `BaseBuilder<YourPayload>`
2. Import and use directly in any test file — no registration needed.

### Using `test.use()` for environment overrides

```typescript
// Run this entire spec file against staging
test.use({ baseURL: 'https://staging.example.com' });

// Or scope the override to one describe block
test.describe('Staging smoke tests', () => {
  test.use({ baseURL: 'https://staging.example.com' });
  // tests here run against staging; tests outside run against default
});
```

---

## Handoff

When all steps are complete, tell the user:

> **Framework scaffolded at `{target-dir}/{project-name}/`.**
>
> What was created:
> - `playwright.config.ts` — multi-browser, env-driven
> - `src/config/config.ts` — `AppConfig` singleton (reads `.env`)
> - `src/fixtures/base.fixture.ts` — `appConfig`, `logger`, `pages` injected
>   into every test via Playwright's `use` annotation
> - `src/pages/` — `BasePage`, `LoginPage`, `PageFactory`
> - `src/builders/` — `BaseBuilder<T>`, `UserBuilder`
> - `src/utils/` — `Logger`, `Waiter`
> - `tests/ui/login.spec.ts` — sample tests demonstrating all patterns
>
> Next steps:
> 1. Copy `.env.example` → `.env` and fill in real credentials.
> 2. Add page objects under `src/pages/` and register them in `PageFactory`.
> 3. Add builders under `src/builders/` for each data entity.
> 4. Run `npm test` to execute the full suite.
