# Test Cases — AP2486 (File 1 of 1)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2486 — Saving a Custom earning curve with an empty monthly factor shows an HTTP 500 error page (bug re-test)
**Source:** requirements/AP-2486-custom-earning-curve-empty-factor-http-500.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2486_001 to AP2486_003 (3 test cases)
**Coverage:** Re-test · Regression

> **Bug re-test flow.** AP-2486 is a bug, so the pipeline skipped requirements analysis
> and the test plan: the bug's steps to reproduce and its Expected Result are the
> requirement. Every case below is derived directly from the raw requirement capture —
> no formal requirements analysis exists for this spec.

---

## Execution Context

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin | `navigation` |
| **Entry route** | `/admin/earning-curve` — Earning Curves list (sidebar → Risk Management → Earning Curves; navigating by URL is faster). **Create New** opens `/admin/earning-curve/new/edit`; the pencil (Edit) button on a row opens `/admin/earning-curve/{id}/edit` ("Earning curve #{id}"). | `navigation` → `domain` (earning-curves.md, mapped 2026-10-04) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Admin account — see `env` source, ADMIN_USERNAME / ADMIN_PASSWORD (the values are never copied into this file), signing in at `/admin/login` (French page: "Courriel", "Mot de passe", "Se connecter"; the inputs are `_username` / `_password`, and the labels are not linked to them) | `env`, `domain` |
| **Test data** | None static beyond the login. Every curve is created inside its own case. **Never edit the seeded curves 1–8 or the AP-2471 fixtures 9–13.** | `test-data`, `domain` |
| **Language** | EN admin UI; field errors render in English under the field (`.invalid-feedback`); the server error page is French ("Erreur — Désolé, l'application éprouve des difficultés techniques…") | `navigation`, `domain` |
| **Leaves behind** | Each case saves one Custom curve named `QA-AP2486-…-<HHMM>` (Term month 4, odometer 0 - 60000). Curves have **no delete** in the UI, so 3 curves stay on staging per run. | `cleanup` (missing) |

**Reading factor values.** Monthly and Cumulative Factor cells are `<input>` boxes, so their
values are not in the page text. Read them with
`[...document.querySelectorAll('input[name$="[monthlyFactor]"]')].map(i => i.value)`
(and `[cumulativeFactor]` for the other column).

**Fill the odometer fields last.** Changing Term month (on Tab) or Earning curve type re-posts
the whole form and re-renders it. Check that both odometer values are still filled right
before clicking "Save".

**What counts as the error page.** The defect's signature is the French page "Erreur —
Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre
fois." with an "Aller à l'accueil" button, returned by the Save request with HTTP 500.
Record the Save request's HTTP status in every case.

**Known blockers:** None.

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-01 | Execution Context row **Login** and step 1 of AP2486_001–003: the clear-text admin login and password replaced with a reference to the `env` source | A credential must not be stored in a test-case artifact. No step or expected result changed, so no case needs re-running | QA worker, s4 (AP-2486) |

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2486_001 | Saving a Custom curve after clearing one Monthly Factor box no longer shows the HTTP 500 error page | Re-test | High | PASS |
| AP2486_002 | Creating a new Custom curve with letters typed into a Monthly Factor box no longer shows the error page | Regression | High | PASS |
| AP2486_003 | Editing a Custom curve with every Monthly Factor filled still saves and keeps the new values | Regression | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2486_001 — Saving a Custom curve after clearing one Monthly Factor box no longer shows the HTTP 500 error page

| Field | Value |
|---|---|
| **TC ID** | AP2486_001 |
| **Title** | Saving a Custom curve after clearing one Monthly Factor box no longer shows the HTTP 500 error page |
| **Requirement** | AP2486 — Steps to Reproduce 1–5 and Expected Result: _"Either the form refuses to save and shows a message on the empty Monthly Factor box … or, if an empty factor is allowed, the curve saves. … A server error is not."_ |
| **Route** | `/admin/earning-curve` → "Create New" → save → pencil (Edit) → `/admin/earning-curve/{id}/edit` → "Save" |
| **Type** | Re-test |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | PASS — outcome (a): Save returned HTTP 200 with "This value should not be blank." under the empty row 4 box; curve #22 unchanged |

**Why this matters:** This is the exact path in the bug report. Before the fix, an admin who left one factor box empty lost the whole edit to a generic French "technical difficulties" page and was never told which box to fill in. The ticket accepts two outcomes — a field message, or a successful save — so this case passes on either one and records which happened. It fails only on the server error, or if the attempt damages the curve's other values.

**Test Data:**

| Variable | Value |
|---|---|
| Name | `QA-AP2486-Retest-<HHMM>` (HHMM = current time, so each run is unique) |
| Term month | `4` |
| Coverage odometer from / to | `0` / `60000` |
| Earning curve type | Custom |
| Monthly Factors, rows 1–4 | `0.4000`, `0.3000`, `0.2000`, `0.1000` |
| Box to clear | Row 4 Monthly Factor |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open `https://v2staging.garantieavantageplus.ca/admin/login`, enter the admin login and password from the `env` source in "Courriel" and "Mot de passe", click **"Se connecter"**, then go to `/admin/earning-curve` | The admin dashboard loads after sign-in, then the "Earning Curves" list is shown with a "Create New" button. |
| 2 | [Pre-Condition] Click "Create New". Enter Name `QA-AP2486-Retest-<HHMM>`, Term month `4` and press Tab (the table re-renders with 4 rows), select Earning curve type "Custom", type Monthly Factors `0.4000`, `0.3000`, `0.2000`, `0.1000` into rows 1–4, then Coverage odometer from `0` and to `60000` → **"Save"** | The browser returns to `/admin/earning-curve` with the alert "Earning curve saved", and the new curve is the first row: term 4, odometer "0 - 60000", type Custom, enabled "Yes". |
| 3 | Click the pencil (Edit) button on the `QA-AP2486-Retest-<HHMM>` row. On "Earning curve #{id}", click into the row 4 Monthly Factor box, delete its value so the box is empty, and press Tab | The edit page opens at `/admin/earning-curve/{id}/edit` with factors 0.4000 / 0.3000 / 0.2000 / 0.1000. After clearing row 4, the box is empty and no page reload happens. |
| 4 | Click **"Save"** | No "Erreur — Désolé, l'application éprouve des difficultés techniques" page appears and the Save request does not return HTTP 500. Exactly one of two outcomes appears: **(a)** the edit page is shown again with a message under the empty row 4 Monthly Factor box, or **(b)** the list is shown with the alert "Earning curve saved". Record which outcome happened, the exact message text for (a), and the Save request's HTTP status. |
| 5 | [Verification] Open the `QA-AP2486-Retest-<HHMM>` curve again with the pencil (Edit) button and read all four Monthly Factor values | Rows 1–3 still read `0.4000`, `0.3000`, `0.2000`. Row 4 reads `0.1000` after outcome (a), because nothing was saved. After outcome (b), record the value row 4 now holds — the ticket does not say what an allowed empty factor is stored as. The case **fails** if the error page appeared in step 4, or if any of rows 1–3 changed. |

---

### AP2486_002 — Creating a new Custom curve with letters typed into a Monthly Factor box no longer shows the error page

| Field | Value |
|---|---|
| **TC ID** | AP2486_002 |
| **Title** | Creating a new Custom curve with letters typed into a Monthly Factor box no longer shows the error page |
| **Requirement** | AP2486 — Notes: _"First seen when typing `abc`, which the number box rejects, leaving it empty."_ — and the Expected Result quoted in AP2486_001 |
| **Route** | `/admin/earning-curve` → "Create New" → `/admin/earning-curve/new/edit` → "Save" |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | PASS — outcome (a): Save returned HTTP 200 with "This value should not be blank." under row 4; nothing saved |

**Why this matters:** The bug was first hit by typing letters, not by clearing a box, and it was hit on a curve being built, not only on an existing one. A fix placed only on the Edit request would leave the Create page still failing. This case checks the other entry point with the original trigger. As in AP2486_001, a field message or a successful save both pass; the server error fails.

**Test Data:**

| Variable | Value |
|---|---|
| Name | `QA-AP2486-CreateEmpty-<HHMM>` |
| Term month | `4` |
| Coverage odometer from / to | `0` / `60000` |
| Earning curve type | Custom |
| Monthly Factors, rows 1–3 | `0.4000`, `0.3000`, `0.2000` |
| Row 4 Monthly Factor | type `abc` (the number box rejects letters and stays empty) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open `https://v2staging.garantieavantageplus.ca/admin/login`, enter the admin login and password from the `env` source in "Courriel" and "Mot de passe", click **"Se connecter"**, then go to `/admin/earning-curve` and click "Create New" | The "Create earning curve" page opens at `/admin/earning-curve/new/edit`. |
| 2 | Enter Name `QA-AP2486-CreateEmpty-<HHMM>`, Term month `4` and press Tab, select Earning curve type "Custom", type `0.4000`, `0.3000`, `0.2000` into the row 1–3 Monthly Factor boxes, type `abc` into the row 4 box and press Tab, then enter Coverage odometer from `0` and to `60000` | The table shows 4 rows. Rows 1–3 hold the typed factors, and the row 4 box is empty (the letters were not accepted). Both odometer boxes are filled. |
| 3 | Click **"Save"** | No "Erreur — Désolé, l'application éprouve des difficultés techniques" page appears and the Save request does not return HTTP 500. Exactly one of two outcomes appears: **(a)** the create page is shown again with a message under the empty row 4 Monthly Factor box, or **(b)** the list is shown with the alert "Earning curve saved". Record which outcome happened, the exact message text for (a), and the Save request's HTTP status. |
| 4 | [Verification] Go to `/admin/earning-curve` and look for `QA-AP2486-CreateEmpty-<HHMM>` in the first rows. If it is listed, open it with the pencil (Edit) button and read all four Monthly Factor values | After outcome (a), no curve with this name is listed, because nothing was saved. After outcome (b), the curve is listed once, rows 1–3 read `0.4000`, `0.3000`, `0.2000`, and the value row 4 holds is recorded. The case **fails** if the error page appeared in step 3, if the curve was saved after a field message was shown, or if rows 1–3 were stored with values other than those typed. |

---

### AP2486_003 — Editing a Custom curve with every Monthly Factor filled still saves and keeps the new values

| Field | Value |
|---|---|
| **TC ID** | AP2486_003 |
| **Title** | Editing a Custom curve with every Monthly Factor filled still saves and keeps the new values |
| **Requirement** | AP2486 — Steps to Reproduce 2–3 (a filled Custom curve saves with "Earning curve saved"), and the developer's comment of 2026-10-29 that the fix adds a ±1000 bound to Monthly Factor values |
| **Route** | `/admin/earning-curve` → "Create New" → save → pencil (Edit) → "Save" |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | PASS — curve #23 saved and stores 0.4000 / 0.3000 / 0.1500 / 0.1500 (cumulative 1.0000) |

**Why this matters:** The fix adds new checks to the factor boxes (the developer names a ±1000 bound). New checks can also reject or alter ordinary values. This case proves that the normal Custom-curve path — every box filled with a small fraction — still saves on both Create and Edit, and that the stored values are exactly those typed. It does not test the ±1000 bound itself: the comment does not say whether the bound is inclusive or what message it shows, so there is nothing quotable to assert.

**Test Data:**

| Variable | Value |
|---|---|
| Name | `QA-AP2486-Valid-<HHMM>` |
| Term month | `4` |
| Coverage odometer from / to | `0` / `60000` |
| Earning curve type | Custom |
| Monthly Factors at creation, rows 1–4 | `0.4000`, `0.3000`, `0.2000`, `0.1000` |
| Edited factors, rows 3–4 | `0.1500`, `0.1500` (total stays 1.0000) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open `https://v2staging.garantieavantageplus.ca/admin/login`, enter the admin login and password from the `env` source in "Courriel" and "Mot de passe", click **"Se connecter"**, then go to `/admin/earning-curve` | The "Earning Curves" list is shown with a "Create New" button. |
| 2 | [Pre-Condition] Click "Create New". Enter Name `QA-AP2486-Valid-<HHMM>`, Term month `4` and press Tab, select Earning curve type "Custom", type Monthly Factors `0.4000`, `0.3000`, `0.2000`, `0.1000` into rows 1–4, then Coverage odometer from `0` and to `60000` → **"Save"** | The list is shown with the alert "Earning curve saved", and the new curve is the first row: term 4, odometer "0 - 60000", type Custom, enabled "Yes". |
| 3 | Click the pencil (Edit) button on the `QA-AP2486-Valid-<HHMM>` row. Replace the row 3 Monthly Factor with `0.1500` and the row 4 Monthly Factor with `0.1500`, press Tab, then click **"Save"** | Before saving, the Cumulative Factor column reads `0.4000`, `0.7000`, `0.8500`, `1.0000`. After "Save", the list is shown with the alert "Earning curve saved"; no field message and no error page appear. |
| 4 | [Verification] Open `QA-AP2486-Valid-<HHMM>` again with the pencil (Edit) button and read all Monthly and Cumulative Factor values, and check the list row | Monthly Factors read `0.4000`, `0.3000`, `0.1500`, `0.1500`; Cumulative Factors read `0.4000`, `0.7000`, `0.8500`, `1.0000`. The list still shows exactly one `QA-AP2486-Valid-<HHMM>` row (an edit updates the same curve, it does not create a copy). |

---

## Coverage Matrix

_Which test cases check which part of the bug report. A part with no test case beside it is
one we currently have no way of proving is fixed._

| Requirement / AC | Re-test | Regression |
|---|:---:|:---:|
| Steps to Reproduce 1–5 — Edit page, cleared Monthly Factor box, "Save" → no HTTP 500 | AP2486_001 | — |
| Expected Result — a field message on the empty box, or a successful save; never a server error | AP2486_001 | AP2486_002 |
| Notes — the original trigger (letters typed into the number box) and the Create page | — | AP2486_002 |
| Expected Result — a refused save writes nothing; the other factors are not damaged | AP2486_001 | AP2486_002 |
| Fix side effect — filled Custom factors still save and are stored exactly on Create and Edit | — | AP2486_003 |
| Developer comment — ±1000 bound on Monthly Factor values | — | — (not asserted: bound edges and message not stated) |
| Developer comment — negative factors still accepted | — | — (out of scope: open question on AP-2471) |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2486_001 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2486/AP2486_001-step5-FactorsUnchangedAfterRefusedSave_pass.png` |
| AP2486_002 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2486/AP2486_002-step4-NoCurveSavedInList_pass.png` |
| AP2486_003 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2486/AP2486_003-step4-EditedFactorsStored_pass.png` |
