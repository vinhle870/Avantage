---
description: Convert Selenium-Java automation tests to Playwright-TypeScript
---

# Selenium-Java to Playwright-TypeScript Conversion Guide

## Context

You are a Senior Automation QA Engineer tasked with converting an existing Selenium-Java automation test framework to Playwright-TypeScript. The source code uses:

- **Test Framework**: Serenity BDD + JUnit 5 + Cucumber
- **Browser Automation**: Selenium WebDriver
- **Design Pattern**: Page Object Model with Component-based architecture
- **Language**: Java 17

## Source Code Architecture

### 1. Core Components Layer (`core/components/`)

```java
// Base component with common methods
public class baseComponent implements iBaseComponent {
    private WebElement webElement;
    By locator;
    public ApplicationDriver appDriver;

    public void click() { ... }
    public void waitForElementDisplay(By element_by) { ... }
    public void waitForFieldEnable(By element_by) { ... }
    public WebElement getElement() { ... }
    public iBaseComponent getChildComponent(By selector) { ... }
}

// Specific components: inputImpl, buttonImpl, dropdownImpl, labelImpl, etc.
```

### 2. Page Object Layer (`ProjectContext/pageObject/`)

```java
// Page class defines elements
public class LoginPage {
    public iInput txt_Username() {
        return new inputImpl(By.xpath("//input[@name='_username']"));
    }
    public iButton btn_SignIn() {
        return new buttonImpl(By.xpath("//button[@type='submit']"));
    }
}

// PageFunc class defines actions
public class LoginPageFunc {
    public LoginPage page = new LoginPage();

    public void loginToPortal(String userName, String password) {
        page.txt_Username().fillValue(userName);
        page.txt_Password().fillValue(password);
        page.btn_SignIn().click();
    }
}
```

### 3. Other Layers
- **Step Definitions** (`ProjectContext/stepsDefinition/`)
- **Business Objects** (`ProjectContext/BusinessObject/`)
- **Data Readers** (`ProjectContext/dataReader/`)
- **Test Cases** (`testcases/`)

---

## Target Technology Stack

- **Test Framework**: Playwright Test (`@playwright/test`)
- **Language**: TypeScript
- **Design Pattern**: Page Object Model (maintain component-based approach)
- **Reporting**: Playwright HTML Reporter

---

## Conversion Mapping Tables

### Locator Strategies

| Selenium (Java)                                | Playwright (TypeScript)                              |
|------------------------------------------------|------------------------------------------------------|
| `By.xpath("//input[@name='username']")`        | `page.locator("//input[@name='username']")`          |
| `By.id("elementId")`                           | `page.locator("#elementId")`                         |
| `By.cssSelector(".class-name")`                | `page.locator(".class-name")`                        |
| `By.linkText("Click Here")`                    | `page.getByRole('link', { name: 'Click Here' })`     |
| `driver.findElement(locator)`                  | `page.locator(selector)`                             |
| `driver.findElements(locator)`                 | `page.locator(selector).all()`                       |

### Actions

| Selenium (Java)                        | Playwright (TypeScript)                    |
|----------------------------------------|--------------------------------------------|
| `element.click()`                      | `await locator.click()`                    |
| `element.sendKeys("text")`             | `await locator.fill("text")`               |
| `element.clear()`                      | `await locator.clear()`                    |
| `element.getText()`                    | `await locator.textContent()`              |
| `element.getAttribute("value")`        | `await locator.getAttribute("value")`      |
| `element.isDisplayed()`                | `await locator.isVisible()`                |
| `element.isEnabled()`                  | `await locator.isEnabled()`                |
| `Select(element).selectByVisibleText()`| `await locator.selectOption({ label: "" })`|

### Waits

| Selenium (Java)                                           | Playwright (TypeScript)                                    |
|-----------------------------------------------------------|------------------------------------------------------------|
| `new WebDriverWait(driver, Duration.ofSeconds(10))`       | `await locator.waitFor({ timeout: 10000 })`                |
| `wait.until(ExpectedConditions.visibilityOfElementLocated)` | `await locator.waitFor({ state: 'visible' })`            |
| `wait.until(ExpectedConditions.elementToBeClickable)`     | `await locator.waitFor({ state: 'visible' })`              |
| `Thread.sleep(1000)`                                      | `await page.waitForTimeout(1000)` *(avoid if possible)*    |

### Assertions

| Selenium/JUnit (Java)                  | Playwright (TypeScript)                              |
|----------------------------------------|------------------------------------------------------|
| `assertEquals(expected, actual)`       | `expect(actual).toBe(expected)`                      |
| `assertTrue(condition)`                | `expect(condition).toBeTruthy()`                     |
| `assertThat(element).isDisplayed()`    | `await expect(locator).toBeVisible()`                |
| `assertThat(element).hasText("text")`  | `await expect(locator).toHaveText("text")`           |

### Browser/Driver Setup

| Selenium (Java)                            | Playwright (TypeScript)                                   |
|--------------------------------------------|-----------------------------------------------------------|
| `WebDriverManager.chromedriver().setup()`  | Built-in - no driver management needed                    |
| `new ChromeDriver(options)`                | `browser.newPage()` (via test fixtures)                   |
| `driver.get(url)`                          | `await page.goto(url)`                                    |
| `driver.navigate().refresh()`              | `await page.reload()`                                     |
| `driver.getCurrentUrl()`                   | `page.url()`                                              |

---

## Target Project Structure

```
playwright-automation/
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── .env
├── src/
│   ├── core/
│   │   ├── components/
│   │   │   ├── BaseComponent.ts
│   │   │   ├── InputComponent.ts
│   │   │   ├── ButtonComponent.ts
│   │   │   ├── DropdownComponent.ts
│   │   │   ├── LabelComponent.ts
│   │   │   └── TableComponent.ts
│   │   ├── fixtures/
│   │   │   └── test-fixtures.ts
│   │   └── utils/
│   │       └── helpers.ts
│   ├── pages/
│   │   ├── common/
│   │   │   └── LoginPage.ts
│   │   ├── adminPortal/
│   │   │   ├── DealersPage.ts
│   │   │   └── PriceRulesPage.ts
│   │   └── dealerPortal/
│   │       ├── QuotesPage.ts
│   │       └── InvoicePage.ts
│   ├── data/
│   │   ├── testData.json
│   │   └── config.ts
│   └── tests/
│       ├── admin/
│       │   └── dealers.spec.ts
│       └── dealer/
│           └── quotes.spec.ts
```

---

## Conversion Example

### Input (Java - Selenium):

```java
// LoginPage.java
public class LoginPage {
    public iInput txt_Username() {
        return new inputImpl(By.xpath("//input[@name='_username']"));
    }
    public iInput txt_Password() {
        return new inputImpl(By.xpath("//input[@name='_password']"));
    }
    public iButton btn_SignIn() {
        return new buttonImpl(By.xpath("//button[@type='submit']"));
    }
}

// LoginPageFunc.java
public class LoginPageFunc {
    public LoginPage page = new LoginPage();

    public void loginToPortal(String userName, String password) {
        page.txt_Username().fillValue(userName);
        page.txt_Password().fillValue(password);
        page.btn_SignIn().click();
    }
}
```

### Output (TypeScript - Playwright):

```typescript
// LoginPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    private page: Page;

    // Locators
    readonly txtUsername: Locator;
    readonly txtPassword: Locator;
    readonly btnSignIn: Locator;
    readonly lblWelcome: Locator;

    constructor(page: Page) {
        this.page = page;
        this.txtUsername = page.locator("//input[@name='_username']");
        this.txtPassword = page.locator("//input[@name='_password']");
        this.btnSignIn = page.locator("//button[@type='submit']");
        this.lblWelcome = page.locator(".text-muted");
    }

    // Actions
    async loginToPortal(userName: string, password: string): Promise<void> {
        await this.txtUsername.fill(userName);
        await this.txtPassword.fill(password);
        await this.btnSignIn.click();
    }

    async forgotPassword(): Promise<void> {
        await this.page.getByRole('link', { name: 'Mot de passe oublié?' }).click();
    }

    // Assertions
    async verifyWelcomeVisible(): Promise<void> {
        await expect(this.lblWelcome).toBeVisible();
    }
}
```

---

## Special Handling Instructions

1. **Serenity BDD `@Step` annotations** → Convert to descriptive method names or use `test.step()` for grouping
2. **Cucumber Step Definitions** → Convert to Playwright test specs with `test.describe()` and `test()` blocks
3. **Custom waits** → Leverage Playwright's auto-wait; only use explicit waits when necessary
4. **ApplicationDriver singleton** → Use Playwright's test fixtures and page objects
5. **Data readers (Excel/JSON)** → Use `fs` module or test fixtures for data-driven tests
6. **Environment configs** → Use `dotenv` and `playwright.config.ts`

---

## Quality Checklist

For each converted file:

- [ ] All locators use Playwright's recommended selectors (prefer roles, text over XPath)
- [ ] All methods are `async` and properly `await` actions
- [ ] Error handling is appropriate
- [ ] No `Thread.sleep()` equivalent unless absolutely necessary
- [ ] Assertions use Playwright's `expect()` with auto-retry
- [ ] Page object follows single responsibility principle
- [ ] TypeScript types are properly defined

---

## Scope of Conversion:
The entire project (core components + all pages + tests)


## Target Location:
 A new folder alongside the existing project (e.g., d:\AutomationProject\Avantage\playwright-automation)

## Workflow Steps

// turbo-all

1. **Analyze the source Java file** to understand:
   - Locator strategies used
   - Actions performed
   - Assertions made
   - Dependencies on other classes

2. **Create the corresponding TypeScript file** with:
   - Proper imports from `@playwright/test`
   - Constructor accepting `Page` object
   - Locators as readonly properties
   - Async methods for all actions

3. **Convert locators** using the mapping table above, preferring:
   - `getByRole()` for buttons, links, headings
   - `getByLabel()` for form inputs
   - `getByText()` for text content
   - CSS selectors over XPath when possible

4. **Convert actions** ensuring:
   - All are async/await
   - No explicit waits unless necessary
   - Proper return types

5. **Add assertions** using Playwright's expect API

6. **Run and verify** the converted tests