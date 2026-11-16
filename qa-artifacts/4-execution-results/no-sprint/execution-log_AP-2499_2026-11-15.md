# Execution Log — AP-2499

> Written by the **stlc-manual-executor** skill (run by `stlc-ticket-pipeline`, `--from execute --until correct-cases`, batch qa-agent 2026-11-15, Wave 2).

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (stlc-worker)
**Date:** 2026-11-15 — 2026-11-15T11:06Z to 2026-11-15T11:10Z
**Environment:** Dev (v2dev)
**Base URL:** https://v2dev.garantieavantageplus.ca/ — the "Dev Environment" section of the `env` source (`qa-artifacts/base-test/execute.env.md`), the registry's `execution_env`. v2staging was not opened.
**Login:** the shared dealer account from the `env` source, Dev Environment section, typed only into the dealer login form (signed in as "Test QA staging", dealer 1380). No credential is reproduced here.
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800, English UI (`?_locale=en`).
**Scope of this run:** Gate B (rule B3, by reviewer, R2 round 2) — execute **AP2499_005** and **AP2499_009** only, both re-designed on 2026-11-15. The other 11 cases were not re-run; their results are carried forward from `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2499_2026-11-02.md`. AP2499_013 stays BLOCKED (Q-002, no Humania dealer).
**Test cases:** `AP2499_TestCases_001-005.md` (AP2499_005), `AP2499_TestCases_006-010.md` (AP2499_009)

| Metric | Value |
|---|:---:|
| Total test cases | 13 (2 executed today, 11 carried forward) |
| Passed | 5 |
| Failed | 6 |
| Blocked | 2 |
| Skipped | 0 |
| **Pass rate** | **38% (5 of 13)** |

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2499_001 | GAP modal on a quote with no financing shows the financing form, not the alert | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_001-step3-GapModalFinancingFormFirst_pass.png` | Carried forward from the 2026-11-02 log (quote 6533) |
| AP2499_002 | Creditors modal on a quote with no financing shows the financing form, not the alert | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_002-step2-CreditorsModalFinancingForm_pass.png` | Carried forward from the 2026-11-02 log (quote 6534) |
| AP2499_003 | Financing submitted in the GAP modal is saved and the modal moves on | High | ❌ | 3 | 2 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_003-step5-ReopenedGapModalFinancingSummary_fail.png` | Carried forward 2026-11-02 — AP-2526 (financing collapsed to a summary) |
| AP2499_004 | Creditors modal on a quote with a financing shows the financing form first with the stored values | High | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_004-step4-FinancingCollapsedToSummary_fail.png` | Carried forward 2026-11-02 — AP-2526 |
| AP2499_005 | GAP modal on a quote whose stored financing has no date of birth shows Date of birth blank | Medium | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_005-step4-Nov15-DOBShowsTodayDate_fail.png` | **Run today.** Quote 6710: DOB saved empty, modal shows today's date 2026-11-15 |
| AP2499_006 | Correcting the base amount in the creditors modal saves the new amount | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_006-step3-ModalRendersQuotePage_fail.png` | Carried forward 2026-11-02 — AP-2527 |
| AP2499_007 | Creditors quote result shows below the form in the same modal | High | ❌ | 3 | 2 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_007-step3-PageReloadedModalClosed_fail.png` | Carried forward 2026-11-02 — AP-2528 |
| AP2499_008 | GAP quote result shows below the form in the same modal | High | ❌ | 3 | 2 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_008-step3-PageReloadedModalClosed_fail.png` | Carried forward 2026-11-02 — AP-2528 |
| AP2499_009 | A creditors quote for a borrower with no date of birth shows an error and keeps the entered values | Medium | 🚫 | 2 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_009-step3-Nov15-DOBShowsTodayDate_blocked.png` | **Run today.** Quote 6711: DOB saved empty, form shows 2026-11-15 — trigger cannot be set up |
| AP2499_010 | An empty financing form shows field errors and saves nothing | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_010-step5-NothingStored_pass.png` | Carried forward from the 2026-11-02 log (quote 6542) |
| AP2499_011 | Text base amount and negative rate leave the stored financing unchanged | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_011-step5-FinancingUnchanged_pass.png` | Carried forward from the 2026-11-02 log (quote 6543) |
| AP2499_012 | Empty residual and date of birth do not store invented values | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_012-step5-NoFinancingStored_pass.png` | Carried forward from the 2026-11-02 log (quote 6544) |
| AP2499_013 | Humania dealer: financing form above the insurance form | High | 🚫 | 0 | 0 | — | Carried forward — Q-002: no Humania dealer on Dev; not re-run |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED
> "Carried forward" rows were not executed today; their step results, screenshots and comments are in `execution-log_AP-2499_2026-11-02.md`.

---

## Step-by-Step Results

### AP2499_005 — GAP modal on a stored financing with no date of birth — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in, `/vehicle/915/details` → **Create quote**, client `Gap2499-005b` (`client.stage.2499013@yopmail.com`), Save; `/quote/6710/vehicle` Delivery date 2026-11-01, Price 20000 → Save | `/quote/{id}/details` loads with no financing | The client Save went straight to `/quote/6710/details` (heading "#6710 - Gap Gap2499-005b 1FAHP35NX8W239204"); the Financing card read "You have not added financing details yet". The vehicle step was then opened by URL and saved; the Summary of products shows "Delivery date: Nov 1, 2026" and CA$20,000.00 | ✅ | Quote 6710 created. The client form's consent box now reads "I confirm that I have provided a copy of FORM-L25…" |
| 2 `[Pre-Condition]` | `/quote/6710/financing`: F1 with Date of birth left empty (Residual 0) → Save; read the Financing card and the client block | Flash "Financing saved"; card shows the financing; route and any date of birth recorded | The page was usable (Date of birth field empty before Save). Save → `/quote/6710/details` with the flash "Financing saved". Financing card: Type Financing, Financed amount 25,000.00$, Residual 0.00$, Term 60, Interest rate 6.9900%, Payment amount 494.91$ Monthly. Neither the card nor the client block shows a date of birth. Route used: `/quote/6710/financing` | ✅ | The save was **not** refused for an empty date of birth, so the case continues (no BLOCKED). Type = "Financing", company = "AutoCapital Canada" |
| 3 | Click + on the "Gap Insurance" row, wait for the GAP form; Edit on a folded Financing block | Modal opens on the same page without an error; financing fields visible | The modal opened over `/quote/6710/details` (URL unchanged, no error). The Financing block opened **folded** to "Financing · 60 months · 25,000.00$ · AutoCapital Canada · 494.91$ Monthly" (known bug AP-2526, recorded, not failed again); **Edit** showed the fields | ✅ | AP-2526 still present on Dev 2026-11-15 |
| 4 `[Verification]` | Inspect the modal top to bottom, screenshot | Financing block first, GAP form below; seven stored values shown; **Date of birth blank** | Blocks in order: "Financing", then "Gap Insurance Quote" (Rate table TGGAP, Language English, Tax exempt No, Gap Term empty). Type = "Financing", Net amount financed including RDPRM = "25000", Residual = "0", Payment frequency = "Monthly", Term months = "60", Interest rate = "6.99", Financing company = "AutoCapital Canada 200-11, Church Street Toronto", Province = "Québec". **Date of birth = "2026-11-15"** — today's date, which was never typed. The value comes from the server (the field's HTML `value` attribute is 2026-11-15); `/quote/6710/financing` and `/quote/6710/insurance` also show 2026-11-15 | ❌ | The financing was saved with no date of birth, yet the form now presents today's date as the applicant's date of birth. A dealer who opens the modal and clicks Get Quote would send a newborn applicant to the insurer, so the GAP or creditors premium is priced on a wrong age. REQ-003 AC 1: a field with no stored value must fall back to its empty state. Number format: plain (`25000`, `6.99`) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_005-step2-Nov15-FinancingSavedNoDOB_pass.png` — quote 6710 after the financing Save: "Financing saved", the Financing card with no date of birth
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_005-step4-Nov15-DOBShowsTodayDate_fail.png` — the GAP modal after Edit: Date of birth shows 2026-11-15 although it was saved empty (final state)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_005-step4-Nov15-values.txt` — values record: each field as read after Edit, plus the date-of-birth value on the financing and insurance pages (method, URL, status, value only)

### AP2499_009 — Creditors quote for a borrower with no date of birth — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote from vehicle 915 (`/quote/new/client?fromVehicleId=915`, the "Create quote" link), client `Gap2499-009b` (`client.stage.2499014@yopmail.com`); `/quote/6711/vehicle` Delivery date 2026-11-01, Price 20000 → Save | `/quote/{id}/details` with no financing; id, URL and e-mail recorded | URL = `https://v2dev.garantieavantageplus.ca/quote/6711/details`; Financing card "You have not added financing details yet" before the financing step; vehicle step saved | ✅ | Quote 6711 created |
| 2 `[Pre-Condition]` | `/quote/6711/financing`: F1 with Date of birth empty (Residual 0) → Save; read the Financing card | Flash "Financing saved"; card shows Type, Financed amount 25,000, Residual 0, Term 60, Interest rate 6.99, a Payment amount | Date of birth was empty right before Save. Save → `/quote/6711/details`, flash "Financing saved". Card: Type Financing, Financed amount 25,000.00$, Residual 0.00$, Term 60, Interest rate 6.9900%, Payment amount 494.91$ Monthly. Route: `/quote/6711/financing` | ✅ | The save was not refused — no BLOCKED at this step |
| 3 | Click + on "Creditors insurance", wait for "Creditors Insurance Quote"; Edit on a folded Financing block; read Date of birth | Modal on the same page; Financing block first; after Edit **Date of birth blank** — a date shown → stop BLOCKED | The modal opened over `/quote/6711/details` (URL unchanged, no error); the heading "Creditors Insurance Quote" appeared. The Financing block was **folded** ("Financing · 60 months · 25,000.00$ · AutoCapital Canada · 494.91$ Monthly", AP-2526, recorded). After **Edit**: **Date of birth = "2026-11-15"**, Type Financing, Net amount 25000, Residual 0, Payment frequency Monthly, Term months 60, Interest rate 6.99, Financing company AutoCapital Canada. Creditors form opening values: Language English, Tax exempt No, Form "Monthly Premium PM30", Life type "Select type", Life term empty, Life for "Select coverage"; Critical illness and Disability "Select type" / empty / "Select coverage" | 🚫 | Stop rule of step 3: a date of birth is on the financing form, so the AP-2405 trigger (no borrower date of birth, Q-007) cannot be set up. Nothing was typed into the creditors form and **Get Quote was not clicked**, so no creditors quote was saved |
| 4 | Get Quote, record outcome | — | Not run | 🚫 | Stopped at step 3 |
| 5 `[Verification]` | Compare with the opening values | — | Not run | 🚫 | Stopped at step 3 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_009-step3-Nov15-DOBShowsTodayDate_blocked.png` — the creditors modal after Edit: Date of birth shows 2026-11-15 although it was saved empty
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_009-step3-OpeningValues-Nov15_blocked.png` — the creditors form's opening values before anything was typed (final state)

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2499_009 | 🚫 | A date of birth is stored on the financing — the AP-2405 trigger (Q-007) cannot be set up. The financing was saved with Date of birth empty, but the form then shows today's date (2026-11-15), so a Get Quote would send that date, not a missing one. Unblocks when an empty date of birth stays empty (see the AP2499_005 failure) |
| AP2499_013 | 🚫 | Carried forward — Q-002: no dealer configured for Humania on Dev. Not re-run |

---

## Observations for Gate C

- **AP2499_005 FAIL** — the date of birth left empty on `/quote/{id}/financing` comes back as **today's date** (2026-11-15) in the financing form on the financing page, the creditors page and both modals. Whether the server stores today's date or only renders it for an empty value cannot be told from the UI; either way the form submits it with the next save or Get Quote. Bugs already filed by this ticket: AP-2526 (folded financing block), AP-2527, AP-2528 — none names the date of birth. The 2026-11-02 run (AP2499_012) refused the empty-DOB submit on Residual first, so this was not visible then.
- **AP2499_009** is BLOCKED by the same behaviour, not failed.
- **Knowledge lookup:** "date of birth defaults to today when empty" → none found in `domain` (quote-creation.md, chubb-insurance.md) or the analysis; REQ-003 AC 1 already settles it ("any field with no stored value falls back to its normal empty/placeholder state"), so it was judged against the AC.

---

## Environment Observations

- **Records left on Dev today by this run (no cleanup source):** quote **6710** (client "Gap Gap2499-005b", `client.stage.2499013@yopmail.com`, vehicle 915) and quote **6711** (client "Gap Gap2499-009b", `client.stage.2499014@yopmail.com`, vehicle 915), each with a financing 25,000 / Residual 0 / 60 months / 6.99 % / Monthly / AutoCapital Canada saved with Date of birth empty (now shown as 2026-11-15). **No GAP or creditors insurance quote, no contract, no invoice.** The vehicle was only read. Records made by other tickets today (AP-2503, AP-2374, AP-2501, AP-1948) were not touched.
- **Client form (Dev, 2026-11-15):** the consent checkbox now reads "I confirm that I have provided a copy of FORM-L25, at the request of Les Produits Avantage Plus Inc. …" (was "I agree to the policy"), with a second, optional box "Send a copy of the privacy policy to the client's email address". Save on `/quote/new/client?fromVehicleId=915` now goes straight to `/quote/{id}/details` (the vehicle step was reached by URL; Delivery date pre-filled with today, Price 20000).
- The check-out redesign (AP-2544/2546/2559) was not reached: neither case opens a Generate Contract or check-out page.
- Browser tab closed at the end of the run.
