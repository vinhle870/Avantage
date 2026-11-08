---
name: generate-flow
description: >-
  Generate or extend a business flow in this repo (src/flows/AdminFlow.ts,
  src/flows/DealerFlow.ts — the ports of the Java AdminSteps / DealerSteps).
  A flow method is one business step wrapped in test.step(), orchestrating page
  objects and owning ALL assertions (Playwright expect / expect.poll). Specs call
  the flows through the `adminUser` / `dealerUser` fixtures. Companion to the
  generate-pom skill.
---

# Generate Flow — Skill

> **Hard rule**: assertions live in the flow (or the spec), never in a page object.
> A flow method = one business step, named after the Java `@Step` it replaces,
> wrapped in `test.step('<step text>', ...)` so the HTML report reads like the old Serenity report.

---

## Where things live

| Path | Holds |
|---|---|
| `src/flows/AdminFlow.ts` | Admin portal steps (`adminUser` fixture) |
| `src/flows/DealerFlow.ts` | Dealer portal steps (`dealerUser` fixture; gets `TestInfo` for attachments) |
| `src/expectations/*.ts` | Expected-content builders (PDF text, tax maths) used by verify steps |
| `src/data/testDataLoader.ts` | Loads the XML test data the steps receive |

---

## The pattern

```typescript
async createNewPriceRule(priceRule: PriceRule, submit: boolean): Promise<void> {
    await test.step('Admin Create Custom Price Rule on Admin Portal', async () => {
        await this.leftMenu.goToPriceRulesPage();
        await this.priceRulesPage.openNewPriceRulePage();
        await this.newPriceRulePage.fillPriceRuleForm(priceRule, submit);
        await expect(this.priceRulesPage.lblPriceRuleSaved, 'Unable to create new price rule').toBeVisible();
    });
}

async deletePriceRule(priceRule: PriceRule, submit: boolean): Promise<void> {
    await test.step('Admin Delete Custom Price Rule on Admin Portal', async () => {
        await this.leftMenu.goToPriceRulesPage();
        await this.priceRulesPage.waitForTableVisible();
        await this.priceRulesPage.deletePriceRule(priceRule.name, submit);
        if (submit) {
            await expect.poll(() => this.priceRulesPage.isPriceRuleAvailableOnList(priceRule.name),
                { message: 'PriceRule not deleted successfully' }).toBe(false);
        }
    });
}
```

Rules:
- Every `expect` carries the failure message the Java step used (`markStepFailed("...")`).
- Use web-first assertions (`toBeVisible`, `toHaveURL`) or `expect.poll` for values that settle — no fixed waits.
- Verify that a save actually happened: a rejected form usually stays on its URL with field errors. Put those errors in the failure message (see `AdminFlow.createNewProgram`).
- Comparing many fields → collect mismatches and assert `expect(mismatches).toEqual([])` (see `DealerFlow.verifyInvoiceInfo`).
- Files the test produces (PDFs, extracted text) → `attachFile(...)` in `DealerFlow`, which saves under `test-results/` and attaches to the report.
- A step may write runtime values back into the data model when later steps need them (e.g. `vehicle.vehicleId` read from the quote page).
- Flows take typed models from `src/data`; they never read XML or `.env` themselves (`getCredentials()` is the exception for login).

---

## Steps

1. **Read** the flow file. The legacy Java steps (`AdminSteps` / `DealerSteps`) were removed from the repo; look them up in git history only if a step's original behaviour is in question.
2. **Grep** for the method name — reuse what exists.
3. Make sure every page action you need exists; if not, run **generate-pom** first.
4. Add the method with `test.step`, page calls, and assertions.
5. Call it from the spec; keep spec titles equal to the Java test method names.
6. `npm run lint` must pass; run the spec against staging.

## Checklist

- [ ] Wrapped in `test.step` with the Java `@Step` text
- [ ] Assertions here (or in the spec), none in page objects
- [ ] Failure messages match the Java step's messages
- [ ] Saves are verified (URL left the form / success alert / row present)
- [ ] `npm run lint` passes
