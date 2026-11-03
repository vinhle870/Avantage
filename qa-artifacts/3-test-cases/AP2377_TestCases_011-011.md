# Test Cases — AP2377 (File 3 of 3)

**Project:** Avantage Plus v2 — Customer portal, online warranty purchase
**Requirement:** AP2377 — Customer portal changes (surcharges on the summary page)
**Source:** requirements/AP-2377-customer-portal-changes.md · qa-artifacts/1-requirements-analysis/AP-2377_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2377_test-plan.md · qa-artifacts/3-test-cases/AP2377_ReviewFindings_2026-11-01.md (P2-1, promoted at Gate B by rule B2)
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2377_011 to AP2377_011 (1 test case)
**Coverage:** Functional (state transition)

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Client (customer) portal — the public "buy a warranty online" flow, no login. | `navigation`, ticket capture |
| **Entry route** | `/customer/avantage-plus/buy` (from the ticket's Given; flow **not mapped** — record each step's URL and labels). | capture AC 1, `navigation` gap |
| **Viewport** | 1280 × 800 (desktop). `navigation` gives no Client viewport; desktop matches the ticket's screenshots. No expected result depends on it. | `navigation` (gap), tools.md browser settings |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | None. | `env` |
| **Test data** | Vehicle from the ticket's summary screenshot (A3): 2020 TESLA Model 3 Plus, VIN `5YJ3E1EA0LF734293`. Program CVE · CVE 60m/0km · BEV with the question "Ce véhicule est-il équipé d'un système de suspension pneumatique ?" (A3). Client: a fresh `client.stage.NNN@yopmail.com` per run (next unused three-digit number; write the one used in the log). | capture A3, `env` (Yopmail pattern) |
| **Language** | French, so the surcharge line can be matched word for word with A3. | capture A3 |
| **Leaves behind** | One unfinished online purchase (plus a client record if the portal saves one). Nothing is paid. | `cleanup` (missing — no teardown defined) |
| **Write-back after execution** | The entry route, the purchase-flow steps and labels and the test data (VIN `5YJ3E1EA0LF734293`, program CVE · CVE 60m/0km · BEV) come from the ticket capture, not from the `navigation` or `test-data` sources. After s4, write what was found back to `qa-docs` and the `navigation` / `test-data` sources (knowledge-sources.md §4). | capture; knowledge gap |

**Known blockers** — a fact these test cases need that nobody has supplied yet:

None.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2377_011 | Changing the air-suspension answer from Oui to Non removes the OUI surcharge line from the summary | Functional | High | FAIL |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2377_011 — Changing the air-suspension answer from Oui to Non removes the OUI surcharge line from the summary

| Field | Value |
|---|---|
| **TC ID** | AP2377_011 |
| **Title** | Changing the air-suspension answer from Oui to Non removes the OUI surcharge line from the summary |
| **Requirement** | AP2377 — REQ-005, AC 5 ("The page lists info about the surcharges selected as YES" + attachment A3); how a NO answer is shown is record-only (Q-007 — Judgement, Open). Promoted from review proposal P2-1 (state transition) at Gate B, rule B2. |
| **Route** | `/customer/avantage-plus/buy` — Vehicle → Client Info → Coverage → summary → back to Coverage → summary, in French |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) — see `qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2377_2026-11-02.md` |
| **Result** | FAIL — step 2: summary after Oui has no "OUI" (as AP2377_008); after Non the question is gone (step 5 passes) |

**Why this matters:** Customers often go back and change an answer before paying. If the
summary keeps showing "OUI" for a surcharge the customer has just changed to "Non", they
are shown — and may be charged for — cover they declined. The ticket says the summary lists
surcharges answered YES, so after the change the YES line must be gone; whether the
question then disappears or shows "NON" is not stated and is only recorded.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | VIN `5YJ3E1EA0LF734293` (2020 TESLA Model 3 Plus), Kilométrage `10000`, Valeur marchande `45000.00`, Warranty Number `2131331`, Warranty end date `2027-12-18`, Warranty mileage limit `100000` |
| Client | Prénom `Client`, Nom `Stage NNN`, Adresse `2280 de la Rousserolle`, Ville `Laval`, Province `Québec`, Code postal `H7L0C4`, Téléphone 1 `5146906330`, Courriel `client.stage.NNN@yopmail.com` |
| Program | `CVE` · `CVE 60m/0km` · `BEV` |
| Surcharge answer | First **Oui**, then changed to **Non** |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open `/customer/avantage-plus/buy` in French (click "Français" if needed), fill the vehicle fields with the Test Data and click "Continuer"; fill the client fields with the Test Data, tick the FORM L25 checkbox and click "Demander un devis" | The coverage step ("Choisir la couverture") opens. |
| 2 | Choose program "CVE", coverage "CVE 60m/0km", components "BEV"; answer "Ce véhicule est-il équipé d'un système de suspension pneumatique ?" with **Oui**; move on to the summary | The summary ("Sommaire") shows "Ce véhicule est-il équipé d'un système de suspension pneumatique ? OUI" under "Description du programme". Record the "Total". If the program or question is not offered, record the case BLOCKED with what was offered — do not pick another program. |
| 3 | Click "Éditer" beside "Description du programme" (or "Back" if no such link exists; record which was used) | The coverage step opens with no error page or HTTP 5xx; record whether the program and the **Oui** answer are still selected. |
| 4 | Change the air-suspension answer to **Non**, keep the same program, and move on to the summary | The summary opens with no error page or HTTP 5xx. Record the "Total" (the price is not judged — no criterion states it). |
| 5 | [Verification] Verify the "Description du programme" section | The line "Ce véhicule est-il équipé d'un système de suspension pneumatique ? OUI" is **not** shown. Record the outcome for Q-007: the question is absent, or shown with "NON". |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-005 AC 5 — summary lists YES surcharges (answer changed) | AP2377_011 | — | — | — |

The other requirements are covered in AP2377_TestCases_001-005.md and AP2377_TestCases_006-010.md.

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2377_011 | ❌ FAIL | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_011-step2-SurchargeOuiLineNoOui_fail.png` |
