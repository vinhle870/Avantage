# Execution Log — AP-2502: separate compliance document PDF for GC960 and 6201

---

## Execution Summary

**Environment:** Dev
**Executed by:** QA Agent — Manual Executor Skill (stlc-worker, `--from s4 --until s4c`)
**Date:** 2026-11-03
**Base URL:** https://v2dev.garantieavantageplus.ca
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 2026-11-03T04:53:30Z → 2026-11-03T04:59:55Z
**Test-case file:** `qa-artifacts/3-test-cases/AP2502_TestCases_001-005.md` (R2 round 2 approved, Gate B rule B3)
**Accounts:** dealer 1380 ("Test QA staging") on the Dealer portal and the Admin portal — credentials from the `env` source, Dev Environment section, typed only into the login forms
**Env-check source:** `missing` in the knowledge registry. The orchestrator's environment health check passed (Dev up, 2026-11-03T04:36Z); both portals logged in normally in this run

| Metric | Value |
|---|:---:|
| Total test cases | 5 |
| Passed | 0 |
| Failed | 5 |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **0% (0 of 5)** |

**One defect explains all five failures.** The send-compliance-documents form itself —
`GET /compliance-documents/send?...` — answers **HTTP 500** ("Erreur — Désolé,
l'application éprouve des difficultés techniques…") on Dev for every creditor-form
configuration tried (GC6201 + GAP as found, GC960 only, GC6201 + GC960 + GAP, none) and
from both entry points (Insurance Quick Quote and Quote Details). Clicking **"Send
compliance documents"** opens a modal that stays on "Loading..." forever, so the Client
name / Client email fields never appear and no document can be sent. No PDF was received,
so none of the document-content checks (product line, footers, English GC960 file) could be
judged in this run.

---

## Dealer 1380 creditor-form configuration — baseline and final check

Recorded at 2026-11-03T04:53:52Z, before any change, from `/admin/dealer/1380/chubb-insurance`:

| Field | Value at start |
|---|---|
| `chubb_insurance[creditorAccountNumber]` | `AP0001` |
| Selected creditor forms | `GC6201MQ:PM30` "Creditor Monthly PM30" · `GC6201MQ:PM50` "Creditor Monthly PM50" · `AVPG:TGGAP` "GAP" |
| Not selected | `GC6201:PM30` "Creditor PM30" · `GC6201:PM50` "Creditor PM50" · `GC960S:S30` "Creditor (Commercial) S30" · `GC960S:S45` "Creditor (Commercial) S45" · `GC960M:M25` "Creditor Monthly (Commercial) M25" · `GC960M:M30` "Creditor Monthly (Commercial) M30" |

The first option whose label or value contains `960`, in the multi-select's own order, is
`GC960S:S30` "Creditor (Commercial) S30" — that is the 960 form used by AP2502_001, 003 and 004.

Every change was restored inside its own case (step 4) and read back on reopening the page.

**Final check — 2026-11-03T04:59:32Z.** Reopened `/admin/dealer/1380/chubb-insurance` after
the last case: account number `AP0001`; selected `GC6201MQ:PM30`, `GC6201MQ:PM50`,
`AVPG:TGGAP`; nothing else selected. **This equals the state recorded at the very start.**
Evidence: `AP2502-baseline-Dealer1380CreditorFormsOriginal_pass.png` and
`AP2502-final-Dealer1380CreditorFormsEqualBaseline_pass.png`.

| Time (UTC) | Case | Change saved | Read back |
|---|---|---|---|
| 04:55:32 | AP2502_001 step 1 | `GC960S:S30` only | `AP0001`; `GC960S:S30` |
| 04:56:14 | AP2502_001 step 4 | restore | `AP0001`; `GC6201MQ:PM30`, `GC6201MQ:PM50`, `AVPG:TGGAP` |
| 04:56:36 | AP2502_003 step 1 | step-1 forms + `GC960S:S30` | `AP0001`; `GC6201MQ:PM30`, `GC6201MQ:PM50`, `GC960S:S30`, `AVPG:TGGAP` |
| 04:57:07 | AP2502_003 step 4 | restore | `AP0001`; `GC6201MQ:PM30`, `GC6201MQ:PM50`, `AVPG:TGGAP` |
| 04:57:20 | AP2502_004 step 1 | `GC960S:S30` only | `AP0001`; `GC960S:S30` |
| 04:58:21 | AP2502_004 step 4 | restore | `AP0001`; `GC6201MQ:PM30`, `GC6201MQ:PM50`, `AVPG:TGGAP` |
| 04:58:35 | AP2502_005 step 1 | none selected | `AP0001`; nothing selected (the save was accepted) |
| 04:59:31 | AP2502_005 step 4 | restore | `AP0001`; `GC6201MQ:PM30`, `GC6201MQ:PM50`, `AVPG:TGGAP` |

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2502_002 | A dealer assigned only GC6201 forms still sends the existing parlons-assurance document, naming only GC6201 | High | ❌ | 1 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_002-step2-SendFormHttp500_fail.png` | Send form returns HTTP 500 with the dealer's unchanged GC6201 forms; steps 3–5 could not run |
| AP2502_001 | A dealer assigned only a 960 form sends the GC960 French and English documents, naming only GC960 | High | ❌ | 2 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_001-step2-SendModalStuckLoading_fail.png` | Send form returns HTTP 500 with GC960S:S30 only; no GC960 document could be sent |
| AP2502_003 | A dealer assigned both families receives one separate document per family, each naming only its own | High | ❌ | 2 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_003-step2-SendModalStuckLoading_fail.png` | Send form returns HTTP 500 with GC6201 + GC960 forms; no documents sent |
| AP2502_004 | Sending from a quote's details page also attaches the GC960 document for a 960-form dealer | Medium | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_004-step3-QuoteSendModalStuckLoading_fail.png` | Quote 6567 created; send form from Quote Details also HTTP 500 |
| AP2502_005 | Sending with no creditor form assigned records what is sent and does not crash | Low | ❌ | 2 | 2 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_005-step2-SendModalStuckLoading_fail.png` | Send form returns HTTP 500 with no form assigned — the crash this case guards against |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED
>
> Execution order: High first (002 — read-only — then 001, 003), then 004 (Medium), then 005 (Low).
> Steps after a failed step that depend on the send are marked 🚫 in the step tables: they could
> not run because of the failure, not because of missing data. The case result is FAIL.

---

## Step-by-Step Results

### AP2502_002 — A dealer assigned only GC6201 forms still sends the existing parlons-assurance document, naming only GC6201 — Step Results

Executed 2026-11-03T04:53:52Z–04:55:11Z. Creditor forms not changed.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Read admin selection; read dealer Form drop-down | Every Form value begins with `GC6201`; no selected admin option contains `960` | Admin selected = `GC6201MQ:PM30`, `GC6201MQ:PM50`, `AVPG:TGGAP` (none contains `960`). Dealer Form drop-down `quick_insurance_chubb[form]` options = `GC6201MQ:PM30` "Monthly Premium PM30", `GC6201MQ:PM50` "Monthly Premium PM50" | ✅ | The GAP form does not appear in the creditor Form drop-down; dealer 1380 is GC6201-only for creditor forms |
| 2 | Click "Send compliance documents", type the client, click Send | Returns to `/quick-insurance-quote` with "Compliance documents have been sent."; no error page and no HTTP 5xx | Modal dialog opened and stayed on "Loading..."; its request `GET /compliance-documents/send?redirectUrl=/quick-insurance-quote` = **HTTP 500**. Opening the URL directly (twice) shows the error page "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." The Client name / Client email fields never rendered, so nothing could be typed or sent | ❌ | Reproduced 3 times (modal + 2 direct loads). A dealer with today's GC6201 setup cannot send compliance documents at all — the regression this case guards against |
| 3 | Open Yopmail `client.stage.2502002`, download attachments | One "Compliance documents" email | Not run — no send happened at step 2 | 🚫 | Could not run: step 2 failed |
| 4 | Sort attachments by the exclusion rule | French and English GC6201 documents found | Not run | 🚫 | Could not run: no attachments |
| 5 `[Verification]` | Check the GC6201 product line | Product line contains `GC6201`, not `GC960` | Not run — no document exists to read. Q-002 / Q-004 / Q-009 not observable | 🚫 | Could not run: step 2 failed. Failing-state screenshot taken at step 2 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_002-step2-SendFormHttp500_fail.png` — the send page loaded directly shows the French technical-difficulties error page (HTTP 500)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_002-step2-SendFormHttp500_fail.txt` — request lines (method, URL, status) for the three 500 responses

### AP2502_001 — A dealer assigned only a 960 form sends the GC960 French and English documents, naming only GC960 — Step Results

Executed 2026-11-03T04:55:19Z–04:56:20Z. Client `Gisèle Tremblay AP2502-001` / `client.stage.2502001@yopmail.com` (never submitted).

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Record the selection; select only the first `960` option; Save | Saves without error; reopen shows only the 960 form; account number unchanged | Recorded: `AP0001`; `GC6201MQ:PM30`, `GC6201MQ:PM50`, `AVPG:TGGAP`. First `960` option = `GC960S:S30` "Creditor (Commercial) S30". After Save the browser went to `/admin/dealer/1380` with no error; reopening shows account `AP0001`, selected = `GC960S:S30` only | ✅ | 960 test data exists on Dev (four GC960 options), so the case was not BLOCKED |
| 2 `[Pre-Condition]` | Record Form values; Send compliance documents for the client | Returns with "Compliance documents have been sent."; no error page, no HTTP 5xx | Form drop-down `quick_insurance_chubb[form]` has **no options** with GC960S:S30 only (record-only, Q-001). Send: direct load of `/compliance-documents/send?redirectUrl=/quick-insurance-quote` = **HTTP 500**; retried by clicking the link — modal stuck on "Loading...", same request = HTTP 500 | ❌ | The fault is at the send itself, the action every check of this case depends on. A 960-form dealer cannot send the GC960 documents |
| 3 | Open Yopmail `client.stage.2502001`, download attachments | One "Compliance documents" email | Not run — nothing was sent | 🚫 | Could not run: step 2 failed |
| 4 | Restore the step-1 selection; Save | Reopen shows exactly the step-1 selection and the same account number | Reopened: `AP0001`; `GC6201MQ:PM30` "Creditor Monthly PM30", `GC6201MQ:PM50` "Creditor Monthly PM50", `AVPG:TGGAP` "GAP" | ✅ | Restored at 04:56:14Z |
| 5 `[Verification]` | Read every attachment and compare with the identification table | French and English GC960 documents, product line `GC960`, not `GC6201` | Not run — no attachment exists. Q-002 / Q-003 / Q-009 not observable. Step 4's restore held | 🚫 | Could not run: step 2 failed. Failing-state screenshot taken at step 2 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502-baseline-Dealer1380CreditorFormsOriginal_pass.png` — dealer 1380's Chubb configuration before any change (Creditor Monthly PM30, Creditor Monthly PM50, GAP)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_001-step2-SendModalStuckLoading_fail.png` — the send modal on Insurance Quick Quote stuck on "Loading..."
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_001-step2-SendFormHttp500_fail.txt` — request lines for the two 500 responses
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_001-step4-CreditorFormsRestored_pass.png` — configuration restored to the step-1 selection

### AP2502_003 — A dealer assigned both families receives one separate document per family, each naming only its own — Step Results

Executed 2026-11-03T04:56:26Z–04:57:08Z. Client `Hélène Gagnon AP2502-003` / `client.stage.2502003@yopmail.com` (never submitted).

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Read Form values; record admin selection; add the first `960` option; Save | At least one Form value begins `GC6201`; reopen shows step-1 forms plus the 960 form | Form values = `GC6201MQ:PM30`, `GC6201MQ:PM50`. Recorded admin: `AP0001`; `GC6201MQ:PM30`, `GC6201MQ:PM50`, `AVPG:TGGAP`. After Save, reopen shows `GC6201MQ:PM30`, `GC6201MQ:PM50`, `GC960S:S30`, `AVPG:TGGAP`; no error | ✅ | — |
| 2 `[Pre-Condition]` | Record Form values; Send compliance documents for the client | Returns with "Compliance documents have been sent."; no HTTP 5xx | Form drop-down now = `GC6201MQ:PM30` "Monthly Premium PM30", `GC6201MQ:PM50` "Monthly Premium PM50", `GC960S:S30` "Total Premium (Commercial) S30" (record-only, Q-001). Send link → modal stuck on "Loading...", `GET /compliance-documents/send?redirectUrl=/quick-insurance-quote` = **HTTP 500**; direct load retried = HTTP 500 | ❌ | A dealer selling both families cannot send either family's documents |
| 3 | Open Yopmail `client.stage.2502003`, download attachments | One email | Not run — nothing was sent | 🚫 | Could not run: step 2 failed |
| 4 | Restore the step-1 selection; Save | Exactly the step-1 selection and the same account number | Reopened: `AP0001`; `GC6201MQ:PM30`, `GC6201MQ:PM50`, `AVPG:TGGAP` | ✅ | Restored at 04:57:07Z |
| 5 `[Verification]` | Sort attachments; check each family's product line | Separate GC960 and GC6201 documents, each naming only its own family | Not run — no attachment exists. Step 4's restore held | 🚫 | Could not run: step 2 failed. Failing-state screenshot taken at step 2 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_003-step2-SendModalStuckLoading_fail.png` — the send modal stuck on "Loading..." with both families assigned
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_003-step2-SendFormHttp500_fail.txt` — request lines for the two 500 responses
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_003-step4-CreditorFormsRestored_pass.png` — configuration restored

### AP2502_004 — Sending from a quote's details page also attaches the GC960 document for a 960-form dealer — Step Results

Executed 2026-11-03T04:57:16Z–04:58:22Z.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Record the selection; select only the first `960` option; Save | Reopen shows only the 960 form; no error | Recorded: `AP0001`; `GC6201MQ:PM30`, `GC6201MQ:PM50`, `AVPG:TGGAP`. Reopened after Save: `AP0001`; `GC960S:S30` only | ✅ | — |
| 2 `[Pre-Condition]` | Create a quote from vehicle 915 with the Test Data client; Save | Lands on `/quote/{id}/details`, heading "#{id}", "Send compliance documents" link present | Vehicle 915 exists on Dev ("Vehicle VIN:1FAHP35NX8W239204", Ford Focus 2008). Quote saved → URL `/quote/6567/details`, heading "#6567 - Rosalie Bouchard AP2502-004 1FAHP35NX8W239204"; link "Send compliance documents" → `/compliance-documents/send?redirectUrl=/quote/6567/details&clientEmail=client.stage.2502004@yopmail.com` | ✅ | **Quote 6567 created and left on Dev** (client Rosalie Bouchard AP2502-004, `client.stage.2502004@yopmail.com`) |
| 3 | Click Send compliance documents; check pre-filled email; type name; Send | Returns to `/quote/6567/details` with the success alert and a row in "Compliance documents sent" | Modal stuck on "Loading..."; `GET /compliance-documents/send?redirectUrl=/quote/6567/details&clientEmail=client.stage.2502004@yopmail.com` = **HTTP 500**; direct load retried = HTTP 500. The pre-filled email could not be seen because the form never rendered | ❌ | The Quote Details entry point fails the same way as Insurance Quick Quote |
| 4 | Restore the step-1 selection; Save | Exactly the step-1 selection and the same account number | Reopened: `AP0001`; `GC6201MQ:PM30`, `GC6201MQ:PM50`, `AVPG:TGGAP` | ✅ | Restored at 04:58:21Z |
| 5 `[Verification]` | Open Yopmail `client.stage.2502004`; read attachments | GC960 French and English documents, product line `GC960`, not `GC6201` | Not run — nothing was sent. Step 4's restore held | 🚫 | Could not run: step 3 failed. Failing-state screenshot taken at step 3 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_004-step3-QuoteSendModalStuckLoading_fail.png` — the send modal on Quote Details #6567 stuck on "Loading..."
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_004-step3-QuoteSendFormHttp500_fail.txt` — request lines for the two 500 responses
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_004-step4-CreditorFormsRestored_pass.png` — configuration restored

### AP2502_005 — Sending with no creditor form assigned records what is sent and does not crash — Step Results

Executed 2026-11-03T04:58:28Z–04:59:32Z. Client `Benoît Lavoie AP2502-005` / `client.stage.2502005@yopmail.com` (never submitted).

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Record the selection; deselect every form (keep account number); Save | Record-only: saves, or refuses with a message | Recorded: `AP0001`; `GC6201MQ:PM30`, `GC6201MQ:PM50`, `AVPG:TGGAP`. Save **accepted** with no form selected (redirect to `/admin/dealer/1380`, no message); reopen shows `AP0001` and nothing selected | ✅ | Record-only outcome: the admin allows a dealer with no creditor form |
| 2 | Open `/quick-insurance-quote`; record the link; Send | No error page and no HTTP 5xx; record alert text or link absence (Q-008) | Form drop-down has no options, and the page shows the red message **"Your account is not configured with creditors insurance. Please contact support."** (visible in the step-2 screenshot; added 2026-11-03T05:12Z after R3 finding F-1). The "Send compliance documents" link **is shown**. Clicking it → modal stuck on "Loading...", `GET /compliance-documents/send?redirectUrl=/quick-insurance-quote` = **HTTP 500**; direct load retried = HTTP 500. No success or error alert from the send | ❌ | Objective fault named by the step: an HTTP 500. Q-008 outcome: the page says the account is not configured with creditors insurance, yet the send link is offered and its form crashes |
| 3 | Open Yopmail `client.stage.2502005`, wait | Record whether an email arrived (Q-008) | 04:59:12Z: inbox `client.stage.2502005@yopmail.com` shows "This inbox is empty", 0 mail | ✅ | Consistent with step 2: nothing was sent |
| 4 | Restore the step-1 selection; Save | Exactly the step-1 selection and the same account number | Reopened: `AP0001`; `GC6201MQ:PM30` "Creditor Monthly PM30", `GC6201MQ:PM50` "Creditor Monthly PM50", `AVPG:TGGAP` "GAP" | ✅ | Restored at 04:59:31Z |
| 5 `[Verification]` | Review steps 1–4 for objective faults | No error page or HTTP 5xx at steps 1–4; forms equal the step-1 selection | An HTTP 500 occurred at step 2. The forms equal the step-1 selection. No success alert, so the "email arrived" check does not apply | ❌ | Fails on the HTTP 500 at step 2; the restore part holds |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_005-step2-SendModalStuckLoading_fail.png` — the send modal stuck on "Loading..." with no creditor form assigned
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_005-step2-SendFormHttp500_fail.txt` — request lines for the two 500 responses
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_005-step3-InboxEmpty_pass.png` — Yopmail inbox for client.stage.2502005 is empty
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_005-step4-CreditorFormsRestored_pass.png` — configuration restored
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502-final-Dealer1380CreditorFormsEqualBaseline_pass.png` — final configuration, equal to the baseline

---

## Blocked / Skipped Test Cases

None. No case was BLOCKED or SKIPPED; the 🚫 step rows above are steps that could not run after a failed step inside a FAIL case.

---

## Environment Observations

- **Root cause shared by all five failures:** `GET /compliance-documents/send` returns HTTP 500 on Dev for dealer 1380 with every creditor-form selection tried (GC6201MQ PM30 + PM50 + GAP; GC960S:S30 only; GC6201 + GC960 + GAP; none) and from both entry points. Every other page used in this run (admin login, dealer login, `/admin/dealer/1380/chubb-insurance`, `/quick-insurance-quote`, `/vehicle/915/details`, `/quote/new/client`, `/quote/6567/details`, `/insurance-compliance-log`) loaded normally, so this is not a Dev outage. Whether the fault comes from the AP-2502 change is not known from the UI; the bug report should ask.
- **Dealer compliance log:** `/insurance-compliance-log` on Dev lists its most recent send as Log ID 24 on Oct 2, 2026 (`vinhle0002@yopmail.com`). This run added no row (no send succeeded).
- **Creditor-form option list on Dev** (admin multi-select): nine options, including four GC960 forms — `GC960S:S30`, `GC960S:S45`, `GC960M:M25`, `GC960M:M30`. The Q-001 "960 form" test data therefore exists on Dev. With `GC960S:S30` assigned, the dealer Form drop-down labels it "Total Premium (Commercial) S30"; with only that form assigned the drop-down was empty, and with GC6201 + GC960 it listed all three (record-only, Q-001).
- **Known defects:** AP-2538 – AP-2541 (Chubb contract pages/PDFs) were not touched by any step of this run.
- **Records other tickets reserve** (AP-2504 quotes 6562–6566, GAP contract AVPG000064, creditor contract AVP000171, AutoShield contracts 2697/2698, AP-2498 / AP-2494 records): not opened or changed.
- **Credential handling:** credentials were read from the env source's Dev section with the Read tool and typed only into the two login forms. The AP2502 test-case file holds no clear-text credential (it references the env source), so no Revisions row was needed for that.

### Records left behind on Dev

| Record | Id | Note |
|---|---|---|
| Quote | 6567 | Vehicle 915, client Rosalie Bouchard AP2502-004, `client.stage.2502004@yopmail.com`; no compliance send attached (send failed) |
| Compliance emails | none | No send succeeded, so inboxes `client.stage.2502001`–`005` received nothing from this run |
| Dealer 1380 creditor forms | restored | Equal to the start-of-run state (see the final check above) |

---

## Re-run after correction (s4c)

Not run. s4c applies only to a Gate C rule C1 ("not a bug") decision with a quoted intended
behaviour. No sentence in the requirement capture or a ticket comment says that an HTTP 500
on the send form is intended, so there is no C1 candidate and no test case to correct.
