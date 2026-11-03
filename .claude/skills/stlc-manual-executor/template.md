# Execution Log

> Written to `qa-artifacts/4-execution-results/execution-log.md` by the **stlc-manual-executor** skill
> after all test cases have been executed. Do not write this manually.

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill
**Date:** {{DATE}}
**Base URL:** {{APP_BASE_URL}}
**Browser:** Chromium (Playwright)
**Duration:** {{START_TIME}} → {{END_TIME}}

| Metric | Value |
|---|:---:|
| Total test cases | {{TOTAL}} |
| Passed | {{PASSED}} |
| Failed | {{FAILED}} |
| Blocked | {{BLOCKED}} |
| Skipped | {{SKIPPED}} |
| **Pass rate** | **{{PASS_RATE}}%** |

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| TC-001 | {{TITLE}} | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/{{SPRINT}}/{{TICKET_ID}}/TC-001-pass-step4.png` | {{COMMENT}} |
| TC-002 | {{TITLE}} | High | ❌ | 2 | 1 | `qa-artifacts/4-execution-results/screenshots/{{SPRINT}}/{{TICKET_ID}}/TC-002-fail-step3.png` | {{COMMENT — e.g. "Fails on duplicate name; see Step Results row 3"}} |
| TC-003 | {{TITLE}} | Medium | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/{{SPRINT}}/{{TICKET_ID}}/TC-003-blocked.png` | {{COMMENT — e.g. "Blocked on precondition, see Step Results"}} |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

> **Required for every test case, regardless of overall outcome** — one Result table per TC, one row per step (including `[Pre-Condition]` and `[Verification]` steps). This is the evidence trail; the Result Overview above is only a rollup of these tables.
>
> **Actual Result must record the exact observed field state, not a paraphrase.** State the concrete status/value/visibility read from the `browser_snapshot` — never write "worked as expected" or "showed correctly". Use the form `<element> <property> = <value>`, for example:
> - `Field "Email" value = "user@test.com"`
> - `Dropdown "Department" selected value = "Engineering"`
> - `Checkbox "Remember me" checked = false`
> - `Error banner visible = true; text = "Duplicate policy name"`
> - `Toggle "Active" status = Off`
> - `URL = /admin/policies/42; page heading = "Edit Policy"`
>
> If actual and expected differ, the mismatch must be visible by comparing the two columns directly — do not summarize the diff in prose.

### TC-001 — {{TITLE}} — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 | {{ACTION}} | {{EXPECTED_RESULT}} | {{ACTUAL — exact field status/value/visibility}} | ✅ | {{COMMENT}} |
| 2 | {{ACTION}} | {{EXPECTED_RESULT}} | {{ACTUAL — exact field status/value/visibility}} | ✅ | {{COMMENT}} |
| 3 `[Verification]` | {{ACTION}} | {{EXPECTED_RESULT}} | {{ACTUAL — exact field status/value/visibility}} | ✅ | {{COMMENT}} |
| 4 | {{ACTION}} | {{EXPECTED_RESULT}} | {{ACTUAL — exact field status/value/visibility}} | ✅ | {{COMMENT}} |

### TC-002 — {{TITLE}} — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 | {{ACTION}} | {{EXPECTED_RESULT}} | {{ACTUAL — exact field status/value/visibility}} | ✅ | {{COMMENT}} |
| 2 | {{ACTION}} | {{EXPECTED_RESULT}} | {{ACTUAL — exact field status/value/visibility}} | ✅ | {{COMMENT}} |
| 3 `[Verification]` | Click "**{{BUTTON_LABEL}}**" | {{EXPECTED_RESULT}} | {{ACTUAL — exact field status/value/visibility, e.g. "Error banner visible = false; page still on /form"}} | ❌ | {{COMMENT — e.g. "Console: TypeError at submit.js:42. Reproduced 2/3 attempts."}} |

### TC-003 — {{TITLE}} — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | {{ACTION}} | {{EXPECTED_RESULT}} | {{ACTUAL — exact field status/value/visibility, e.g. "Response status = 500; page = error screen"}} | 🚫 | {{COMMENT — e.g. "Blocked: BUG-001 must be resolved before this TC can run"}} |

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| TC-003 | 🚫 | {{REASON — e.g. "Login page returned 500 Internal Server Error; see Step Results above"}} |
| TC-00X | ⏭️ | {{REASON — e.g. "Out of scope for this cycle per test plan v1.0 section 2.2"}} |

_(Remove table if no test cases were blocked or skipped)_

---

## Environment Observations

{{ANY_NOTES_ABOUT_ENVIRONMENT_DURING_EXECUTION}}

> _Example: "Application was slow to respond between 14:30–14:45; response times > 5s observed on TC-004 step 2. Likely unrelated to test failures."_

_(Write "None" if no observations)_
