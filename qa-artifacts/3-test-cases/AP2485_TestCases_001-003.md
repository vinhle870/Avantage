# Test Cases — AP2485 (File 1 of 1)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2485 — Bug: Switching a 12-month earning curve back to Pro-Rata keeps the previous type's factors (re-test)
**Source:** requirements/AP-2485-switching-a-12-month-earning-curve-back.md (bug re-test flow — s1 and s2 skipped; the bug's steps to reproduce and expected result are the requirement). Oracle values from the `domain` source `qa-docs/earning-curves.md` and from AP-2471's capture (`requirements/AP-2471-admin-earning-curve-management.md`).
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2485_001 to AP2485_003 (3 test cases)
**Coverage:** Re-test (steps to reproduce) · Regression (Reverse rule of 78 path and 24-month term) · Regression (existing curve's edit page)

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin | `navigation` |
| **Entry route** | `/admin/earning-curve` — Earning Curves list (sidebar → Risk Management → Earning Curves). The create form is `/admin/earning-curve/new/edit` ("Create earning curve", reached by the red **Create New** link); an existing curve's form is `/admin/earning-curve/{id}/edit` ("Earning curve #{id}", reached by the pencil button on its row — the button has no text, find it by `a[href$="/edit"]` inside the row). | `navigation` → `domain` (`earning-curves.md`) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Admin account — see `env` source, ADMIN_PASSWORD (Admin Portal row: login and password; the values are never copied into this file), signing in at `/admin/login`. The login page is in French: "Courriel", "Mot de passe", "Se connecter" (fields `_username` / `_password`; the labels are not linked to the inputs). | `env`, `domain` |
| **Test data** | None static beyond the login. Every curve that is saved is created by the case that needs it. **Do not use curve #13 (QA-AP2471-Del-0043)** — it was saved with the wrong factors as evidence for this bug. Never edit seeded curves 1–6 or the AP-2472 curves 7–8. | `test-data`, `domain` |
| **Language** | EN admin UI. The login page is always French. | `navigation` |
| **Leaves behind** | AP2485_001 leaves one curve `QA-AP2485-Repro-{HHMMSS}` and AP2485_003 leaves one curve `QA-AP2485-Edit-{HHMMSS}` (12 months, odometer 0 – 10000). Earning curves have no delete control. AP2485_002 saves nothing. | `cleanup` (missing), `domain` |

**How the form behaves.** Changing "Earning curve type", or changing "Term month" and
leaving the field (Tab), posts the whole form back to the same URL and re-renders the page.
Wait for the re-render before reading the table. The type control is a bootstrap-select:
click the visible `button.dropdown-toggle` beside the hidden native select, then the option
in `.dropdown-menu.show a.dropdown-item`. Fill Name and the odometer fields **last**, right
before Save, because each re-post can reset them.

**Reading factor values.** Monthly Factor and Cumulative Factor are read-only `<input>`
boxes, so their numbers are not in the page text. Read them with
`[...document.querySelectorAll('input[name$="[monthlyFactor]"]')].map(i => i.value)` and the
same with `[cumulativeFactor]`. Values are fractions with 4 decimals (12-month Pro-Rata =
`0.0833`), not percentages.

**Oracle** (formulas confirmed in `earning-curves.md`; Pro-Rata from AP-2471 and Ken Nguyen's
2026-09-22 comment: monthly factor constant at 1/Term month, cumulative = month/Term month):

| Curve | Monthly Factor, rows 1 → N | Cumulative Factor |
|---|---|---|
| Pro-Rata, 12 months | `0.0833` on every row | 0.0833 · 0.1667 · 0.2500 · 0.3333 · 0.4167 · **0.5000** (row 6) · 0.5833 · 0.6667 · 0.7500 · 0.8333 · 0.9167 · **1.0000** (row 12) |
| Rule of 78, 12 months | 0.1538 · 0.1410 · 0.1282 · 0.1154 · 0.1026 · 0.0897 · 0.0769 · 0.0641 · 0.0513 · 0.0385 · 0.0256 · 0.0128 | row 6 = 0.7308 |
| Reverse rule of 78, 12 months | 0.0128 · 0.0256 · 0.0385 · 0.0513 · 0.0641 · 0.0769 · 0.0897 · 0.1026 · 0.1154 · 0.1282 · 0.1410 · 0.1538 | row 8 = 0.4615 |
| Pro-Rata, 24 months | `0.0417` on every row | row 12 = 0.5000 · row 24 = 1.0000 |
| Rule of 78, 24 months | row 1 = 0.0800 | — |

**Known blockers:** None.

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-01 | Execution Context, row **Login**: the clear-text admin login and password replaced with a reference to the `env` source | A credential must not be stored in a test-case artifact (R3 finding F-2 in qa-artifacts/7-reviews/AP-2485_review.md). No step or expected result changed, so no case needs re-running | stlc-qa-reviewer, R3 round 1 |

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2485_001 | Switching a 12-month curve from Rule of 78 back to Pro-Rata shows and saves 0.0833 on every row | Re-test | High | PASS |
| AP2485_002 | Switching from Reverse rule of 78 back to Pro-Rata regenerates at 12 months, and 24-month switching still works | Regression | High | PASS |
| AP2485_003 | On an existing 12-month Rule of 78 curve, changing the type to Pro-Rata saves Pro-Rata factors | Regression | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2485_001 — Switching a 12-month curve from Rule of 78 back to Pro-Rata shows and saves 0.0833 on every row

| Field | Value |
|---|---|
| **TC ID** | AP2485_001 |
| **Title** | Switching a 12-month curve from Rule of 78 back to Pro-Rata shows and saves 0.0833 on every row |
| **Requirement** | AP2485 — Steps to Reproduce 1–5 and Expected Result: "The table regenerates with the Pro-Rata calculation … Every row should show Monthly Factor 0.0833, with Cumulative Factor running 0.0833, 0.1667 … 1.0000 (row 6 = 0.5000)." (AP-2471 AC: "When the earning type is changed, the table is generated based the earning type calculations") |
| **Route** | `/admin/earning-curve` → "Create New" → `/admin/earning-curve/new/edit` |
| **Type** | Re-test |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | PASS — saved curve #14 reopened with Pro-Rata, 0.0833 on every row |

**Why this matters:** This is the bug's own reproduction. Pro-Rata is the default type, so
opening the form, trying another type and going back is the most common path. Before the fix,
a curve labelled Pro-Rata was saved with Rule of 78 factors and recognised premium on the wrong
schedule, with nothing on screen to warn the admin. The case therefore checks the stored curve,
not only the form.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Term month | 12 | The default — leave it unchanged |
| First type | Rule of 78 | |
| Final type | Pro-Rata | |
| Name | `QA-AP2485-Repro-{HHMMSS}` | Dynamic — current time, so each run is unique |
| Coverage odometer from / to | `0` / `10000` | |
| Expected after fix | Monthly `0.0833` × 12; Cumulative row 6 `0.5000`, row 12 `1.0000` | See the Oracle |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context, open `/admin/earning-curve` and click "Create New" | The "Create earning curve" page opens with Term month 12 and Earning curve type "Pro-Rata". The table has 12 rows, each with Monthly Factor 0.0833. |
| 2 | Leave Term month at 12. In "Earning curve type", select "Rule of 78" and wait for the page to re-render | The type box shows "Rule of 78". The table regenerates: row 1 Monthly Factor 0.1538, row 12 Monthly Factor 0.0128. |
| 3 | In "Earning curve type", select "Pro-Rata" again, wait for the re-render, and read all 12 Monthly Factor and Cumulative Factor values | The type box shows "Pro-Rata". All 12 Monthly Factors are 0.0833 (not 0.1538 falling to 0.0128). Cumulative Factor is 0.5000 on row 6 (not 0.7308) and 1.0000 on row 12. All 24 values are recorded in the log. |
| 4 | Enter Name `QA-AP2485-Repro-{HHMMSS}`, Coverage odometer from `0` and to `10000`, click "Save", then click the pencil (Edit) button on that curve's row in the list | The list page shows the alert "Earning curve saved", and the new curve is the first row, reading Term month 12 and type "Pro-Rata". Its edit page "Earning curve #{id}" opens. The curve id is recorded. |
| 5 | [Verification] On the reopened edit page, verify Earning curve type is "Pro-Rata" and read all 12 Monthly Factor and Cumulative Factor values | Type is "Pro-Rata". Every Monthly Factor is 0.0833; Cumulative Factor reads 0.0833, 0.1667, 0.2500, 0.3333, 0.4167, 0.5000, 0.5833, 0.6667, 0.7500, 0.8333, 0.9167, 1.0000. No row shows a Rule of 78 value (0.1538 … 0.0128), so the stored curve carries Pro-Rata factors. |

---

### AP2485_002 — Switching from Reverse rule of 78 back to Pro-Rata regenerates at 12 months, and 24-month switching still works

| Field | Value |
|---|---|
| **TC ID** | AP2485_002 |
| **Title** | Switching from Reverse rule of 78 back to Pro-Rata regenerates at 12 months, and 24-month switching still works |
| **Requirement** | AP2485 — Actual Result: "The same happens when switching from 'Reverse rule of 78' back to 'Pro-Rata' … With Term month 24 or 60, switching back to Pro-Rata regenerates correctly." Expected Result as in AP2485_001 |
| **Route** | `/admin/earning-curve` → "Create New" → `/admin/earning-curve/new/edit` |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | PASS — Reverse rule of 78 → Pro-Rata at 12 months and the 24-month path regenerate correctly; nothing saved |

**Why this matters:** The bug also appeared when coming back from Reverse rule of 78, and a fix
aimed at the 12-month default could break the 24-month path that worked before. This case
covers both without saving anything.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Term month | 12, then 24 | 24 is entered in step 4 |
| Types, in order | Reverse rule of 78 → Pro-Rata → (Term 24) Rule of 78 → Pro-Rata | |
| Expected Pro-Rata, 12 months | Monthly `0.0833` × 12; Cumulative row 6 `0.5000`, row 12 `1.0000` | See the Oracle |
| Expected Rule of 78, 24 months | Row 1 Monthly `0.0800` | See the Oracle |
| Expected Pro-Rata, 24 months | Monthly `0.0417` × 24; Cumulative row 12 `0.5000`, row 24 `1.0000` | See the Oracle |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context, open `/admin/earning-curve` and click "Create New" | The "Create earning curve" page opens with Term month 12, type "Pro-Rata" and 12 rows of Monthly Factor 0.0833. |
| 2 | Leave Term month at 12. In "Earning curve type", select "Reverse rule of 78" and wait for the re-render | The type box shows "Reverse rule of 78". The table regenerates: row 1 Monthly Factor 0.0128 rising to 0.1538 on row 12. |
| 3 | In "Earning curve type", select "Pro-Rata" again, wait for the re-render, and read all 12 Monthly Factor and Cumulative Factor values | The type box shows "Pro-Rata". All 12 Monthly Factors are 0.0833 (not 0.0128 rising). Cumulative Factor is 0.5000 on row 6 and 1.0000 on row 12. |
| 4 | Set Term month to `24` and press Tab; after the re-render select "Rule of 78"; after the next re-render select "Pro-Rata" again | After Tab the table has 24 rows. With "Rule of 78" row 1 Monthly Factor is 0.0800. After switching back, the type box shows "Pro-Rata". |
| 5 | [Verification] Verify the table has 24 rows and read all 24 Monthly Factor and Cumulative Factor values | 24 rows. Every Monthly Factor is 0.0417; Cumulative Factor is 0.5000 on row 12 and 1.0000 on row 24. No row keeps a Rule of 78 value. Nothing is saved — leave the page without clicking "Save". |

---

### AP2485_003 — On an existing 12-month Rule of 78 curve, changing the type to Pro-Rata saves Pro-Rata factors

| Field | Value |
|---|---|
| **TC ID** | AP2485_003 |
| **Title** | On an existing 12-month Rule of 78 curve, changing the type to Pro-Rata saves Pro-Rata factors |
| **Requirement** | AP2485 — Summary: "On the earning curve form ('Create earning curve' or an existing curve's edit page), with Term month 12 …"; Reproducibility: "plus 1/1 on an existing curve's edit page". Expected Result as in AP2485_001 |
| **Route** | `/admin/earning-curve/{id}/edit` — "Earning curve #{id}" |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | PASS — curve #15 edited from Rule of 78 to Pro-Rata, reopened with 0.0833 on every row, same id |

**Why this matters:** The edit page posts to a different URL (`/{id}/edit`) and starts from
stored points, not the default ones. The bug reproduced there too, so a fix that only covers the
create page would leave existing curves exposed.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Name | `QA-AP2485-Edit-{HHMMSS}` | Dynamic — created in step 2 |
| Term month | 12 | |
| Coverage odometer from / to | `0` / `10000` | |
| Type at creation | Rule of 78 | Decides the stored points the edit page starts from |
| Type after edit | Pro-Rata | |
| Expected after fix | Monthly `0.0833` × 12; Cumulative row 6 `0.5000`, row 12 `1.0000` | See the Oracle |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context, open `/admin/earning-curve` and click "Create New" | The "Create earning curve" page opens with Term month 12 and type "Pro-Rata". |
| 2 | [Pre-Condition] Create a 12-month Rule of 78 curve: leave Term month `12`, select Earning curve type **"Rule of 78"**, wait for the re-render, then enter Name `QA-AP2485-Edit-{HHMMSS}`, Coverage odometer from `0` and to `10000` → **Save** | The list shows the alert "Earning curve saved". The new curve is the first row, reading Term month 12 and type "Rule of 78". |
| 3 | Click the pencil (Edit) button on that row, then in "Earning curve type" select "Pro-Rata" and wait for the re-render | The "Earning curve #{id}" page opened with type "Rule of 78" and row 1 Monthly Factor 0.1538. After the switch the type box shows "Pro-Rata" and every Monthly Factor is 0.0833 (not 0.1538 falling to 0.0128). The curve id is recorded. |
| 4 | Check that Name and the odometer fields still hold `QA-AP2485-Edit-{HHMMSS}`, `0` and `10000` (re-enter them if the re-render cleared them), click "Save", then click the pencil (Edit) button on the same row again | The list shows "Earning curve saved" and the row now reads Term month 12 and type "Pro-Rata" under the same id (no duplicate row). The edit page reopens. |
| 5 | [Verification] On the reopened edit page, verify Earning curve type is "Pro-Rata" and read all 12 Monthly Factor and Cumulative Factor values | Type is "Pro-Rata". Every Monthly Factor is 0.0833; Cumulative Factor is 0.5000 on row 6 and 1.0000 on row 12. No row keeps a Rule of 78 value, so the stored curve carries Pro-Rata factors. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Re-test | Regression |
|---|:---:|:---:|
| Steps to Reproduce 1–5 + Expected Result (Rule of 78 → Pro-Rata, 12 months, create page, saved and reopened) | AP2485_001 | — |
| Actual Result — same fault from Reverse rule of 78 | — | AP2485_002 |
| Actual Result — 24/60 months regenerate correctly (must stay so after the fix) | — | AP2485_002 (24 months) |
| Summary / Reproducibility — existing curve's edit page | — | AP2485_003 |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2485_001 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2485/AP2485_001-step5-ReopenedProRataFactors_pass.png` |
| AP2485_002 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2485/AP2485_002-step5-ProRata24MonthFactors_pass.png` |
| AP2485_003 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2485/AP2485_003-step5-EditedCurveProRataFactors_pass.png` |
