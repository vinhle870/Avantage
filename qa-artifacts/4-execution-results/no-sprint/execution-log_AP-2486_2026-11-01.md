# Execution Log — AP-2486

> Written by the **stlc-manual-executor** skill (stage s4 of `stlc-ticket-pipeline`, bug re-test flow).

---

## Execution Summary

**Ticket:** AP-2486 — Saving a Custom earning curve with an empty monthly factor shows an HTTP 500 error page (bug re-test)
**Environment:** Dev (v2dev)
**Executed by:** QA Agent — Manual Executor Skill
**Date:** 2026-11-01
**Base URL:** https://v2dev.garantieavantageplus.ca/ (admin portal, logged in at `/admin/login` with the Dev admin account from the `env` source)
**Browser:** Chromium (Playwright), viewport 1280 × 800
**Duration:** 2026-11-01T03:47:36Z → 2026-11-01T03:49:57Z
**Test cases:** qa-artifacts/3-test-cases/AP2486_TestCases_001-003.md

| Metric | Value |
|---|:---:|
| Total test cases | 3 |
| Passed | 3 |
| Failed | 0 |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **100% (3 of 3)** |

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2486_001 | Saving a Custom curve after clearing one Monthly Factor box no longer shows the HTTP 500 error page | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2486/AP2486_001-step5-FactorsUnchangedAfterRefusedSave_pass.png` | Fix holds on Edit: outcome (a), field message, HTTP 200, curve #22 unchanged |
| AP2486_002 | Creating a new Custom curve with letters typed into a Monthly Factor box no longer shows the error page | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2486/AP2486_002-step4-NoCurveSavedInList_pass.png` | Fix holds on Create: outcome (a), field message, HTTP 200, nothing saved |
| AP2486_003 | Editing a Custom curve with every Monthly Factor filled still saves and keeps the new values | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2486/AP2486_003-step4-EditedFactorsStored_pass.png` | Normal Custom save still works; curve #23 stores the edited factors exactly |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Test data used

None of the cases needs pre-existing data on Dev beyond the admin login, which worked. Every
curve was created by its own case, named with an `<HHMMSS>` suffix and reopened by its id.

| Case | Curve created | Id | State at the end of the run |
|---|---|:---:|---|
| AP2486_001 | `QA-AP2486-Retest-034814` | #22 | Term 4, odometer 0 - 60000, Custom 0.4000 / 0.3000 / 0.2000 / 0.1000, enabled |
| AP2486_002 | `QA-AP2486-CreateEmpty-034903` | — | Not saved (the server refused it, as expected) |
| AP2486_003 | `QA-AP2486-Valid-034928` | #23 | Term 4, odometer 0 - 60000, Custom 0.4000 / 0.3000 / 0.1500 / 0.1500, enabled |

---

## Step-by-Step Results

### AP2486_001 — Saving a Custom curve after clearing one Monthly Factor box no longer shows the HTTP 500 error page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in to the Admin portal on Dev and open `/admin/earning-curve` | Dashboard after sign-in, then the "Earning Curves" list with "Create New" | URL = /admin/earning-curve; heading = "Earning Curves"; "Create New" link present | ✅ | Dev login with the `env` admin account worked first time |
| 2 `[Pre-Condition]` | Create New → Name `QA-AP2486-Retest-034814`, Term month 4 + Tab, type Custom, factors 0.4000 / 0.3000 / 0.2000 / 0.1000, odometer 0 / 60000 → Save | List shown with "Earning curve saved"; new curve is the first row: 4, "0 - 60000", Custom, Yes | Table re-rendered with 4 rows after Tab; before Save type = "custom", odometer = "0" / "60000", factors = 0.4000 / 0.3000 / 0.2000 / 0.1000. Save request HTTP 302 → /admin/earning-curve; alert = "Earning curve saved"; first row = "QA-AP2486-Retest-034814 · 4 · 0 - 60000 · Custom · Yes", edit link /admin/earning-curve/22/edit | ✅ | Curve #22 created for this case |
| 3 | Pencil (Edit) on the row; clear the row 4 Monthly Factor box; Tab | Edit page at `/admin/earning-curve/{id}/edit` with 0.4000 / 0.3000 / 0.2000 / 0.1000; after clearing, row 4 is empty and no reload happens | URL = /admin/earning-curve/22/edit; heading = "Earning curve #22"; factors before = 0.4000 / 0.3000 / 0.2000 / 0.1000; after clearing, factors = 0.4000 / 0.3000 / 0.2000 / "" ; POST requests on Tab = 0 | ✅ | No re-post on Tab, as expected for a factor box |
| 4 | Click "Save" | No French "Erreur" page, no HTTP 500; either (a) the page re-shown with a message under row 4, or (b) "Earning curve saved". Record outcome, message, HTTP status | Outcome **(a)**. Save request POST /admin/earning-curve/22/edit returned **HTTP 200**; the "Earning curve #22" edit page was shown again; row 4 Monthly Factor box outlined red, empty, with the message **"This value should not be blank."** (preceded by a red "ERROR" badge); rows 1–3 had no message. No "Erreur — Désolé…" page | ✅ | The bug's HTTP 500 no longer happens. The browser's own required-field popup did not stop the submit, so the server-side message is what the user sees |
| 5 `[Verification]` | Reopen the curve with the pencil and read all four Monthly Factors | Rows 1–3 read 0.4000 / 0.3000 / 0.2000; row 4 reads 0.1000 after outcome (a) | List shows exactly 1 "QA-AP2486-Retest-034814" row; heading = "Earning curve #22"; Monthly Factors = 0.4000 / 0.3000 / 0.2000 / 0.1000; Cumulative = 0.4000 / 0.7000 / 0.9000 / 1.0000 | ✅ | The refused save wrote nothing; the stored curve is intact |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2486/AP2486_001-step4-BlankFactorFieldMessage_pass.png` — the edit page shown again after Save, with "This value should not be blank." under the empty row 4 Monthly Factor box
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2486/AP2486_001-step5-FactorsUnchangedAfterRefusedSave_pass.png` — curve #22 reopened, still holding 0.4000 / 0.3000 / 0.2000 / 0.1000

### AP2486_002 — Creating a new Custom curve with letters typed into a Monthly Factor box no longer shows the error page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Admin session on Dev → `/admin/earning-curve` → "Create New" | "Create earning curve" opens at `/admin/earning-curve/new/edit` | URL = /admin/earning-curve/new/edit; heading = "Create earning curve" | ✅ | Same login session as AP2486_001 |
| 2 | Name `QA-AP2486-CreateEmpty-034903`, Term month 4 + Tab, type Custom, rows 1–3 = 0.4000 / 0.3000 / 0.2000, row 4 typed `abc` key by key + Tab, odometer 0 / 60000 | 4 rows; rows 1–3 hold the typed factors; row 4 empty (letters rejected); both odometers filled | Rows = 4; type = "custom"; Monthly Factors = 0.4000 / 0.3000 / 0.2000 / "" (the number box accepted none of the letters); odometer from = "0", to = "60000" | ✅ | Letters typed key by key, as the design review advised |
| 3 | Click "Save" | No "Erreur" page, no HTTP 500; (a) create page re-shown with a message under row 4, or (b) "Earning curve saved" | Outcome **(a)**. Save request POST /admin/earning-curve/new/edit returned **HTTP 200**; heading still "Create earning curve"; row 4 Monthly Factor empty with **"This value should not be blank."**; rows 1–3 kept 0.4000 / 0.3000 / 0.2000 with no message. No "Erreur — Désolé…" page | ✅ | Create entry point is fixed too |
| 4 `[Verification]` | Go to `/admin/earning-curve` and look for the curve | After outcome (a), no curve with this name is listed | Rows matching "QA-AP2486-CreateEmpty" = 0; first row is "QA-AP2486-Retest-034814" (#22) | ✅ | Nothing was saved after the field message |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2486/AP2486_002-step3-CreatePageBlankFactorMessage_pass.png` — the create page shown again with "This value should not be blank." under the empty row 4 box
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2486/AP2486_002-step4-NoCurveSavedInList_pass.png` — the Earning Curves list with no `QA-AP2486-CreateEmpty` row

### AP2486_003 — Editing a Custom curve with every Monthly Factor filled still saves and keeps the new values — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Admin session on Dev → `/admin/earning-curve` | The "Earning Curves" list with "Create New" | URL = /admin/earning-curve; "Create New" link present | ✅ | Same login session |
| 2 `[Pre-Condition]` | Create New → `QA-AP2486-Valid-034928`, Term 4, Custom, 0.4000 / 0.3000 / 0.2000 / 0.1000, odometer 0 / 60000 → Save | "Earning curve saved"; first row 4, "0 - 60000", Custom, Yes | Save HTTP 302 → /admin/earning-curve; alert = "Earning curve saved"; first row = "QA-AP2486-Valid-034928 · 4 · 0 - 60000 · Custom · Yes", edit link /admin/earning-curve/23/edit | ✅ | Curve #23 created for this case |
| 3 | Edit #23; row 3 = 0.1500, row 4 = 0.1500, Tab, Save | Before Save, Cumulative = 0.4000 / 0.7000 / 0.8500 / 1.0000; after Save, "Earning curve saved", no field message, no error page | Heading = "Earning curve #23"; before Save Monthly = 0.4000 / 0.3000 / 0.1500 / 0.1500, Cumulative = 0.4000 / 0.7000 / 0.8500 / 1.0000. Save HTTP 302; alert = "Earning curve saved"; field messages = none | ✅ | New factor checks do not reject ordinary values |
| 4 `[Verification]` | Reopen #23 and read all factors; check the list row | Monthly 0.4000 / 0.3000 / 0.1500 / 0.1500; Cumulative 0.4000 / 0.7000 / 0.8500 / 1.0000; exactly one list row | Monthly = 0.4000 / 0.3000 / 0.1500 / 0.1500; Cumulative = 0.4000 / 0.7000 / 0.8500 / 1.0000; rows matching "QA-AP2486-Valid-034928" = 1 ("4 · 0 - 60000 · Custom · Yes") | ✅ | Edit updated the same curve; no copy created |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2486/AP2486_003-step4-EditedFactorsStored_pass.png` — curve #23 reopened with Monthly 0.4000 / 0.3000 / 0.1500 / 0.1500 and Cumulative ending at 1.0000

---

## Environment Observations

- **Environment: Dev (v2dev)**, by the user's decision for this batch. The test-case file's Execution Context and step 1 of each case name v2staging; Dev was used instead, as instructed. Routes, form behaviour, the bootstrap-select type control and the messages matched the Execution Context.
- The `env-check` source is `missing`, so its smoke test could not be run; the environment health check had already passed upstream, and the admin login and Earning Curves list loaded normally.
- The Monthly Factor boxes carry the HTML `required` attribute, yet clicking "Save" with an empty box still sent the Save request to the server, which answered with its own field message. The design review's warning that the browser's required-field popup might stop the save did not apply on Dev; the outcome is the server-side message (outcome a) in both AP2486_001 and AP2486_002.
- The `domain` file `earning-curves.md` still lists "Custom factor box empty → HTTP 500" under Validation and messages. On Dev this is now "This value should not be blank." under the box. The knowledge file was not changed in this run, because the fix is not yet confirmed on staging, which that file describes.
- The admin login page logs a JavaScript error on load (`ReferenceError: $ is not defined` at /admin/login line 230). It did not stop the login and is unrelated to this ticket.
- **Left behind on Dev** (earning curves have no delete control): curve **#22** `QA-AP2486-Retest-034814` and curve **#23** `QA-AP2486-Valid-034928`. AP2486_002 saved nothing.
- No earning curve this run did not create was modified. The AP-2485 curves (#14, #15 and the other `QA-AP2485-…` curves) were not opened or changed.
- The test-case file held the admin login and password in clear text; they were replaced with a reference to the `env` source before execution, and a Revisions row records it. No step or expected result changed.
- No knowledge gaps: the Earning Curves pages are mapped in the `navigation` index (`earning-curves.md`).
