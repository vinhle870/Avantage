# Test Automator — Templates

---

## 1. Automation report — `qa-artifacts/6-automation/{KEY}_automation-report.md`

```markdown
# Automation Report — {{KEY}}
Date: {{DATE}} · Source log: {{execution log path}}
Spec: playwright-automation/{{spec path}} · Tag: @{{KEY}}
Result: {{M}} of {{N}} PASSED cases automated — {{P}} passing, {{F}} fixme

## Summary
{{Two or three sentences: what is now covered automatically, what is not and why.}}

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| {{TC_ID}} | {{title}} | {{automated — passing | automated — fixme | manual-only | needs locators | not selected}} | {{one line, or —}} |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| {{TC_ID}} | {{n}} | {{AdminFlow.loginToAdminPortal() | AdminPriceRulesPage.lnkAddNewPriceRule}} | {{reused | new}} |

## New locators
| Name | Expression | Page | Count |
|---|---|---|---|
| {{btnSaveAssignment}} | {{page.locator('#form_save')}} | {{/admin/earning-assignment/new}} | 1 |

## Files changed
| File | Change |
|---|---|
| {{src/pages/adminPortal/X.ts}} | {{added lnkFoo, clickFoo()}} |

## Run
Command: `npx playwright test --project=chromium --grep @{{KEY}}`
Lint: {{pass | <N> errors}} · Run: {{P}} passed, {{F}} fixme, {{duration}}

## Pull request
{{PR #n — url — branch qa-automation/KEY → base — waiting for merge | PR skipped: reason | PR failed at step n: error}}

## Not passing
{{Per fixme test: the error in one sentence, the last thing tried, what to check next.
"None" if empty.}}
```

---

## 2. Code-writing order and spec skeleton

Write in this order so each layer compiles against the one before it:

| Order | Layer | Path | Holds |
|---|---|---|---|
| 1 | Page object | `src/pages/<adminPortal|dealerPortal|common>/<Name>Page.ts` (+ export in that folder's `index.ts`) | `readonly` locators, action methods — no `expect` |
| 2 | Flow | `src/flows/<AdminFlow|DealerFlow>.ts` | business steps in `test.step()`, assertions with `expect` |
| 3 | Fixture | `src/core/fixtures/test-fixtures.ts` | only if the spec uses the page object directly |
| 4 | Spec | `src/tests/<admin|dealer>/<feature>_{SPEC}.spec.ts` | flow calls only |

Spec skeleton — match `src/tests/admin/priceRules.spec.ts`:

```typescript
import { test } from '../../core/fixtures/test-fixtures';

/**
 * {{Feature}} — automated from {{KEY}} manual test cases.
 * Source: qa-artifacts/3-test-cases/{{SPEC}}_TestCases_*.md
 */
test.describe('{{Feature}} @{{portal}} @{{KEY}}', () => {

    test('{{TC_ID}}_{{PascalCaseTitle}}', async ({ adminUser }) => {
        const name = `QA-{{SPEC}}-${Date.now()}`;

        await adminUser.loginToAdminPortal();
        await adminUser.{{businessStep}}(name);
        await adminUser.{{verifyStep}}(name);
    });
});
```

---

## 3. Pull request body

```markdown
## {{KEY}} — {{ticket subject}}

Automates {{M}} of {{N}} test cases that passed manual testing on {{environment}}.
Tag: `@{{KEY}}` · Run locally: `npx playwright test --project=chromium --grep @{{KEY}}`

### Test cases
| TC ID | Title | Result |
|---|---|---|
| {{TC_ID}} | {{title}} | {{passing | fixme — reason}} |

### Changes
| File | Change |
|---|---|
| {{path}} | {{added lnkFoo, clickFoo() | new spec}} |

### Checks
- Lint: {{pass}} · Run ×2: {{P}} passed, {{F}} fixme, {{no flaky tests | flaky: …}}
- Reviewer R5: {{APPROVE}} — {{n}} minor findings: {{list or "none"}}
- Not automated: {{TC ID — reason, one per line | none}}

**Merge is up to you.** To ask for changes, comment on this PR — the next QA batch run
reads every comment posted after the latest commit, fixes it, and pushes here.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```
