---
name: generate-pom
description: >-
  Generate or extend a Page Object in this repo (src/pages/adminPortal,
  src/pages/dealerPortal, src/pages/common). A Page Object is a class with
  `readonly` Locator fields built in the constructor plus async action/reader
  methods. NO assertions or verifyXxx methods — those live in the flows
  (see generate-flow). Use when the user asks to add a page, a field, a modal,
  or an action to a page object.
---

# Generate POM — Skill

> **Hard rule**: a Page Object holds locators, actions and readers only.
> No `expect()`, no `verifyXxx()`. Guard waits before an action
> (`locator.waitFor({ state: 'visible' })`) are fine — they are not assertions.

Match the sibling file you are extending; the examples below are taken from this repo.

---

## Where things live

| Path | Holds |
|---|---|
| `src/pages/<portal>/<Name>Page.ts` (or `<Name>Modal.ts`) | One class per page or modal |
| `src/pages/<portal>/index.ts` | Re-exports — add every new class here |
| `src/core/fixtures/test-fixtures.ts` | One fixture per page — add new pages here |
| `src/core/utils/uiActions.ts` | Shared actions: `selectDropdownOption`, `selectCheckbox`, `clickSidebarLink`, `downloadEmbeddedPdf` |
| `src/core/components/` | `TableComponent` (find/click rows), `DatePickerComponent` |
| `src/data/*-portal.ts` | Typed data models the form methods take (all fields are strings) |

---

## The pattern

```typescript
import { Page, Locator } from '@playwright/test';
import { QuoteSaleContract } from '../../data/dealer-portal';
import { downloadEmbeddedPdf } from '../../core/utils/uiActions';

/**
 * Quote Sale Contract Page - Sale contract form and its generated PDF.
 * Converted from QuoteSaleContractPage.java + quoteSaleContractPage_Func.java
 */
export class QuoteSaleContractPage {
    private page: Page;

    // Locators
    readonly txtContractNumber: Locator;
    readonly embedPdf: Locator;
    readonly btnSave: Locator;

    constructor(page: Page) {
        this.page = page;
        this.txtContractNumber = page.locator('#sales_contract_contractNumber');
        this.embedPdf = page.locator('embed').first();
        // Scope submit buttons to their own form: the header search form is on every page
        this.btnSave = page.locator('form:has(#sales_contract_contractNumber) [type="submit"]').first();
    }

    async fillSaleContractInfo(contract: QuoteSaleContract, submit: boolean = true): Promise<void> {
        await this.txtContractNumber.fill(contract.contractNumber);
        if (submit) {
            await this.btnSave.click();
        }
    }

    async downloadSaleContractPdf(): Promise<Buffer> {
        return await downloadEmbeddedPdf(this.page, this.embedPdf);
    }
}
```

Conventions:
- Field prefixes: `txt` input, `dpd`/`ddl` dropdown, `chk`/`cbx` checkbox, `btn` button, `lnk` link, `lbl` text, `tbl` table, `embed` PDF.
- Prefer ids (`#quote_client_email`). Keep a legacy XPath only when the page offers nothing better, and say why in a comment.
- Scope generic selectors (`[type="submit"]`, `a[href*=...]`) to the page's form or `main`, and add `.first()` where several can match.
- Parameterised locators are methods: `getAddVehicleLink(vehicleType): Locator`.
- Form methods take the typed model and write **every** field (an empty string clears it), with a trailing `submit: boolean = true`.

## The app's widgets — use the helpers, not raw clicks

| Widget | How |
|---|---|
| Dropdown (styled combobox over a hidden `<select>`, or a native `<select>`) | `selectDropdownOption(rootLocator, labelOrValue)` — the root is usually `//div[*[@for='<select id>']]/div`. It waits for AJAX-loaded options and accepts an option value (`l`) as well as its label (`Litre`). |
| Checkbox | `selectCheckbox(locator)` — ticks only when unticked |
| Sidebar link | `clickSidebarLink(page, '/admin/price-rule')` — expands the collapsible section; works with the minimized admin sidebar |
| PDF shown in an `<embed>` | `downloadEmbeddedPdf(page, embedLocator)` → `Buffer` |
| Table row | `new TableComponent(page, selectorOrLocator)` → `findRow`, `clickOnChildInRow`, `getRowTextContent`, `getFirstRow` |
| Calendar popup | `new DatePickerComponent(page, rootSelector).pickDate('YYYY-MM-DD')` |

---

## Steps

1. **Read** the page file you are extending (or the closest sibling). The legacy Java page objects were removed from the repo; check git history only if an original locator is in question.
2. **Grep** for every locator and method name you plan to add — reuse what exists.
3. **Confirm every new selector against the live app** (`get-unique-locator` skill, or a Playwright probe that prints `locator.count()`). Never invent one.
4. Add the `readonly` field, initialise it in the constructor, add the action/reader method.
5. New class → export it from the portal `index.ts` and add a fixture in `test-fixtures.ts`.
6. `npm run lint` (`tsc --noEmit`) must pass.

## Checklist

- [ ] No `expect()` / `verifyXxx` in the page object
- [ ] Every new selector confirmed on the live app
- [ ] Generic selectors scoped to the page's form or `main`
- [ ] Dropdowns, checkboxes, sidebar links and PDFs go through the `uiActions` helpers
- [ ] New class exported from `index.ts` and exposed as a fixture
- [ ] `npm run lint` passes
