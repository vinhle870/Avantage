# Playwright Automation - Avantage

Converted from the legacy Selenium-Java suite (Serenity BDD + JUnit 5), since removed from the repo — see git history before the removal for the original code.

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env   # then fill in the admin and dealer credentials
```

## Running Tests

```bash
npm test                    # all browser tests (chromium project)
npm run test:unit           # offline checks of the PDF expectation logic — no browser, no app
npm run test:admin          # admin portal
npm run test:dealer         # dealer portal
npm run test:warranty       # warranty contract cases (@warranty)
npm run test:sale-contract  # sale contract cases (@saleContract)
npm run test:headed         # visible browser
npm run test:debug          # Playwright inspector
npm run report              # open the HTML report
npm run lint                # tsc --noEmit
```

Tests run one at a time by default (`WORKERS=1`): the dealer flows add a vehicle and then
read the newest row of the shared inventory, so concurrent tests on one dealer account
would pick up each other's vehicles.

## Project Structure

```
test-data/
├── TestCaseData/       # Legacy XML test data, one file per test case (unchanged from Java)
├── Template/           # Expected PDF text templates
└── TestDocument/       # PDFs produced by the app, used by the offline unit checks
src/
├── core/
│   ├── components/     # Base components (table, date picker, ...)
│   ├── fixtures/       # Page object + flow fixtures (adminUser, dealerUser)
│   └── utils/          # uiActions (dropdowns, checkboxes, PDF download), pdfReader, javaFormat
├── data/               # Typed models, XML loader, environment config
├── expectations/       # Expected warranty / sale contract PDF content (incl. tax maths)
├── flows/              # AdminFlow / DealerFlow — ports of AdminSteps / DealerSteps
├── pages/              # Page Objects (locators + actions, no assertions)
└── tests/              # Specs: admin, dealer, smoke, unit
```

## Java → Playwright mapping

| Java | Playwright |
|---|---|
| `TestBase` + `@Steps AdminUser / DealerUser` | fixtures `adminUser` / `dealerUser` |
| `AdminSteps` / `DealerSteps` (`@Step`) | `src/flows/AdminFlow.ts` / `DealerFlow.ts` (`test.step`) |
| `*_Page.java` + `*_Func.java` | one class in `src/pages/**` |
| `DataFileReader` (JAXB) | `src/data/testDataLoader.ts` (same XML files) |
| `generateExpected*PDFContent`, `pdfFactory` | `src/expectations/*.ts` |
| PDF via new tab + Ctrl+S (`java.awt.Robot`) + PDFBox | `downloadEmbeddedPdf` (HTTP with session cookies) + `pdfReader` (pdf.js) |
| `Thread.sleep` before dependent dropdowns | `selectDropdownOption` retries until the option appears |

| Java test class | Spec |
|---|---|
| `Admin_DealerManage` | `tests/admin/dealers.spec.ts` |
| `Admin_CustomPriceRuleManage` | `tests/admin/priceRules.spec.ts` |
| `Admin_ProgramManage` | `tests/admin/programs.spec.ts` |
| `Dealer_Inventory` | `tests/dealer/inventory.spec.ts` |
| `Test_Dealer_NewQuoteManage` TC007, TC008 | `tests/dealer/newQuote.spec.ts` |
| `Test_Dealer_NewQuoteManage` TC010, TC1411, TC1576–TC1588 | `tests/dealer/warranty.spec.ts` |
| `Test_Dealer_NewQuoteManage` sale contract cases | `tests/dealer/saleContract.spec.ts` |
| `Test_Dealer_ExistingQuoteManage` TC001 | `tests/dealer/existingQuote.spec.ts` |
| `Test_Dealer_ExistingQuoteManage` sale contract cases | duplicates of the NewQuoteManage cases — covered once in `saleContract.spec.ts` |

## Configuration

`.env` (see `.env.example`): portal URLs, admin/dealer credentials, `WORKERS`.
