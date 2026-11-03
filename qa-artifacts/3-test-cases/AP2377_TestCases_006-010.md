# Test Cases — AP2377 (File 2 of 3)

**Project:** Avantage Plus v2 — Customer portal, online warranty purchase
**Requirement:** AP2377 — Customer portal changes (new current-warranty fields, Client Info before Coverage, FORM L25 consent, surcharges on the summary and in the admin)
**Source:** requirements/AP-2377-customer-portal-changes.md · qa-artifacts/1-requirements-analysis/AP-2377_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2377_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2377_006 to AP2377_010 (5 test cases)
**Coverage:** Functional · Negative (record-only) · Edge-case (record-only) · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Client (customer) portal — the public "buy a warranty online" flow, no login. AP2377_010 also uses the Admin portal. | `navigation`, ticket capture |
| **Entry route** | `/customer/avantage-plus/buy` (from the ticket's Given; flow **not mapped** — record each step's URL and labels). Admin: `/admin/login`; the admin warranty details page is **not mapped** — find it from the admin sidebar and record the route. | capture AC 1, `navigation` gap |
| **Viewport** | 1280 × 800 (desktop). `navigation` gives no Client viewport; desktop matches the ticket's screenshots. No expected result depends on it. | `navigation` (gap), tools.md browser settings |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Customer flow: none. Admin (AP2377_010 only): the admin account from the `env` source — Admin Portal row (credential variables `ADMIN_USERNAME` / `ADMIN_PASSWORD`) — at `/admin/login` (the admin login page is always in French). No credential is written in this file (mcp-tools.md §5). | `env`, `navigation` |
| **Test data** | Vehicle from the ticket's summary screenshot (A3): 2020 TESLA Model 3 Plus, VIN `5YJ3E1EA0LF734293`, 10000 km. Program with a surcharge question (A3): CVE · CVE 60m/0km · BEV, question "Ce véhicule est-il équipé d'un système de suspension pneumatique ?". Client: a fresh `client.stage.NNN@yopmail.com` per run (next unused three-digit number; write the one used in the log). | capture A3, `env` (Yopmail pattern) |
| **Language** | English for AP2377_006 and 007; French for AP2377_008–010, because the ticket's surcharge example (A3) is in French and can be matched word for word. | capture A3 |
| **Leaves behind** | One unfinished online purchase per case (plus a client record if the portal saves one). AP2377_010, once unblocked, leaves a paid warranty contract on staging. | `cleanup` (missing — no teardown defined) |
| **Write-back after execution** | The entry route, the purchase-flow steps and labels, the test data (VIN `5YJ3E1EA0LF734293`, program CVE · CVE 60m/0km · BEV) and the admin warranty details route come from the ticket capture, not from the `navigation` or `test-data` sources. After s4, write what was found back to `qa-docs` and the `navigation` / `test-data` sources (knowledge-sources.md §4). | capture; knowledge gap |

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | A test payment method (card or other) that the customer portal accepts on v2staging. No knowledge source holds one, and the ticket does not describe the payment step. | AP2377_010 | Open — new; not a requirement question, so not on the analysis's question list. Raised as the High risk in the analysis (REQ-006) and the test plan §9. Asked of the QA lead through the run summary on 2026-11-01. |

> Every test case named in **Affects** ships with **Status: BLOCKED** and a **Blocked by**
> value — not `Not Run`. A blocker found while writing costs a minute; the same blocker
> found at step 4 of execution costs the run.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2377_006 | Clicking "Get rates now" with the FORM L25 box ticked opens the Coverage step | Functional | High | PASS |
| AP2377_007 | Clicking "Get rates now" with the FORM L25 box unticked causes no error page and loses no client details | Negative | Medium | PASS |
| AP2377_008 | A surcharge answered YES at Coverage is listed on the summary page | Functional | High | FAIL |
| AP2377_009 | A surcharge answered NO causes no error on the summary page — whether it is listed is recorded | Edge-case | Medium | PASS |
| AP2377_010 | After a paid purchase, the admin warranty details page shows the surcharge answered YES | Functional | High | BLOCKED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2377_006 — Clicking "Get rates now" with the FORM L25 box ticked opens the Coverage step

| Field | Value |
|---|---|
| **TC ID** | AP2377_006 |
| **Title** | Clicking "Get rates now" with the FORM L25 box ticked opens the Coverage step |
| **Requirement** | AP2377 — REQ-004, AC 4 ("When the customer clicks ‘Get rates now’ … The user is redirected to the coverage step"). The step after Coverage (Q-003 — Judgement, Open) is recorded in AP2377_008 step 3, not here. |
| **Route** | `/customer/avantage-plus/buy` — Client Info step → Coverage step |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) — see `qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2377_2026-11-02.md` |
| **Result** | PASS — "Get rates now" opens /buy/coverage, step 3 current, priced terms |

**Why this matters:** "Get rates now" is the only way forward from the Client Info step. If
it does not open Coverage, no customer can see a price or buy a warranty.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | VIN `5YJ3E1EA0LF734293` (or Year `2020`, Make `TESLA`, Model `Model 3 Plus`), Mileage `10000`, Market Value `45000.00`, Warranty Number `2131331`, Warranty end date `2027-12-18`, Warranty mileage limit `100000` |
| Client | First name `Client`, Last name `Stage NNN`, Address `2280 de la Rousserolle`, City `Laval`, Province `Quebec`, Postal code `H7L0C4`, Phone1 `5146906330`, Email `client.stage.NNN@yopmail.com` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open `/customer/avantage-plus/buy` in English, fill the vehicle fields with the Test Data and click "Continue" | The Client Info step opens. |
| 2 | Fill the client fields with the Test Data and tick the checkbox "I confirm that I have read FORM-L25, …" | Every field shows the value typed; the checkbox is ticked. |
| 3 | [Verification] Click "Get rates now" and verify the step that opens | No error page or HTTP 5xx. The page that opens is the coverage choice — a list of programs or coverage options with prices — and the step bar marks the coverage step as the current step, third after "Vehicle" and "Client Info". Judge the position of the coverage step, not the label text: a step-bar label that differs from these is recorded, not failed. Record the URL; the screenshot of this page is the evidence for AC 4. |

---

### AP2377_007 — Clicking "Get rates now" with the FORM L25 box unticked causes no error page and loses no client details

| Field | Value |
|---|---|
| **TC ID** | AP2377_007 |
| **Title** | Clicking "Get rates now" with the FORM L25 box unticked causes no error page and loses no client details |
| **Requirement** | AP2377 — REQ-003 AC 3; whether the box is required is record-only (Q-004 — Judgement, Open: "opt for" versus the asterisk in A2) |
| **Route** | `/customer/avantage-plus/buy` — Client Info step |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) — see `qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2377_2026-11-02.md` |
| **Result** | PASS — box required (message under it); every client field kept (Q-004 recorded) |

**Why this matters:** The ticket says "opt for", which sounds optional, while the mock-up
marks the box with the asterisk used for required fields. The case does not decide which
is right; it records what the build does and fails only if the customer loses what they
typed or hits an error page.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | VIN `5YJ3E1EA0LF734293` (or Year / Make / Model), Mileage `10000`, Market Value `45000.00`, Warranty Number `2131331`, Warranty end date `2027-12-18`, Warranty mileage limit `100000` |
| Client | First name `Client`, Last name `Stage NNN`, Address `2280 de la Rousserolle`, City `Laval`, Province `Quebec`, Postal code `H7L0C4`, Phone1 `5146906330`, Email `client.stage.NNN@yopmail.com` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open `/customer/avantage-plus/buy` in English, fill the vehicle fields with the Test Data and click "Continue" | The Client Info step opens. |
| 2 | Fill the client fields with the Test Data and leave the FORM L25 checkbox unticked | Every field shows the value typed; the checkbox is unticked. |
| 3 | Click "Get rates now" | No error page or HTTP 5xx. Record the outcome for Q-004: the page moves on to Coverage, or stays with a message (record its exact text and where it appears). |
| 4 | [Verification] If the page moved on, click "Back" once. Verify the client fields | Every client field still holds the value typed in step 2; nothing is emptied or changed. |

---

### AP2377_008 — A surcharge answered YES at Coverage is listed on the summary page

| Field | Value |
|---|---|
| **TC ID** | AP2377_008 |
| **Title** | A surcharge answered YES at Coverage is listed on the summary page |
| **Requirement** | AP2377 — REQ-005, AC 5 ("The page lists info about the surcharges selected as YES" + attachment A3: "Ce véhicule est-il équipé d'un système de suspension pneumatique ? OUI"); the step after Coverage is record-only (Q-003 — Judgement, Open), recorded in step 3 |
| **Route** | `/customer/avantage-plus/buy` — Vehicle → Client Info → Coverage → summary ("Sommaire"), in French |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) — see `qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2377_2026-11-02.md` |
| **Result** | FAIL — step 5: summary shows the question with "(MSRP: 1500.00)" but no "OUI" (A3 shows "? OUI") |

**Why this matters:** The summary is the last page before payment. A surcharge the customer
said yes to costs them money; if it is missing from the summary, they pay without seeing
what they are paying for.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | VIN `5YJ3E1EA0LF734293` (2020 TESLA Model 3 Plus), Kilométrage `10000`, Valeur marchande `45000.00`, Warranty Number `2131331`, Warranty end date `2027-12-18`, Warranty mileage limit `100000` |
| Client | Prénom `Client`, Nom `Stage NNN`, Adresse `2280 de la Rousserolle`, Ville `Laval`, Province `Québec`, Code postal `H7L0C4`, Téléphone 1 `5146906330`, Courriel `client.stage.NNN@yopmail.com` |
| Program | `CVE` · `CVE 60m/0km` · `BEV` |
| Surcharge answer | "Ce véhicule est-il équipé d'un système de suspension pneumatique ?" → **Oui** |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open `/customer/avantage-plus/buy` in French (click "Français" if needed), fill the vehicle fields with the Test Data and click "Continuer" | The Client Info step ("Info Client") opens. |
| 2 | [Pre-Condition] Fill the client fields with the Test Data, tick the FORM L25 checkbox and click "Demander un devis" | The coverage step ("Choisir la couverture") opens. |
| 3 | Choose program "CVE", coverage "CVE 60m/0km", components "BEV"; answer "Ce véhicule est-il équipé d'un système de suspension pneumatique ?" with **Oui**; click the button that moves on (record its label) | No error page or HTTP 5xx. Record the outcome for Q-003: which step opens after Coverage — its URL and its step-bar label (A3's flow suggests the summary, "Sommaire", but the ticket does not say). If it is not the summary, record each step shown and move on until the summary opens; that alone does not fail the case. If this program or the question is not offered for this vehicle, stop and record the case BLOCKED with the programs and questions that were offered — do not pick another program. |
| 4 | Scroll to the "Description du programme" section | The section shows "Programme" CVE / CVE 60m/0km / BEV. |
| 5 | [Verification] Verify the surcharge line in "Description du programme" | The line "Ce véhicule est-il équipé d'un système de suspension pneumatique ? OUI" is shown. |

---

### AP2377_009 — A surcharge answered NO causes no error on the summary page — whether it is listed is recorded

| Field | Value |
|---|---|
| **TC ID** | AP2377_009 |
| **Title** | A surcharge answered NO causes no error on the summary page — whether it is listed is recorded |
| **Requirement** | AP2377 — REQ-005 AC 5; display of a NO answer is record-only (Q-007 — Judgement, Open) |
| **Route** | `/customer/avantage-plus/buy` — Vehicle → Client Info → Coverage → summary, in French |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) — see `qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2377_2026-11-02.md` |
| **Result** | PASS — no OUI line; question absent, empty "Surcharge" heading (Q-007 recorded) |

**Why this matters:** The ticket says the summary lists surcharges answered YES; it does not
say what happens to a NO. The case makes sure a NO answer never shows as YES (a value nobody
chose) and records whether it is hidden or shown as NO, for the author to confirm.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | VIN `5YJ3E1EA0LF734293`, Kilométrage `10000`, Valeur marchande `45000.00`, Warranty Number `2131331`, Warranty end date `2027-12-18`, Warranty mileage limit `100000` |
| Client | Prénom `Client`, Nom `Stage NNN`, Adresse `2280 de la Rousserolle`, Ville `Laval`, Province `Québec`, Code postal `H7L0C4`, Téléphone 1 `5146906330`, Courriel `client.stage.NNN@yopmail.com` |
| Program | `CVE` · `CVE 60m/0km` · `BEV` |
| Surcharge answer | "Ce véhicule est-il équipé d'un système de suspension pneumatique ?" → **Non** |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open `/customer/avantage-plus/buy` in French, fill the vehicle fields with the Test Data and click "Continuer" | The Client Info step opens. |
| 2 | [Pre-Condition] Fill the client fields with the Test Data, tick the FORM L25 checkbox and click "Demander un devis" | The coverage step opens. |
| 3 | Choose program "CVE", coverage "CVE 60m/0km", components "BEV"; answer the air-suspension question with **Non**; move on to the summary | The summary step opens with no error page or HTTP 5xx. If the program or question is not offered, record the case BLOCKED as in AP2377_008. |
| 4 | [Verification] Verify the "Description du programme" section | The line "Ce véhicule est-il équipé d'un système de suspension pneumatique ? OUI" is **not** shown (the customer answered Non). Record the outcome for Q-007: the question is absent, or shown with "NON". |

---

### AP2377_010 — After a paid purchase, the admin warranty details page shows the surcharge answered YES

| Field | Value |
|---|---|
| **TC ID** | AP2377_010 |
| **Title** | After a paid purchase, the admin warranty details page shows the surcharge answered YES |
| **Requirement** | AP2377 — REQ-006, AC 6 ("The surcharges that were selected is displayed in the admin panel warranty details page"); wording on the admin page is record-only (Q-007 — Judgement, Open) |
| **Route** | `/customer/avantage-plus/buy` → payment; then Admin portal → warranty details page (route not mapped — record it) |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Known blocker 1 — no test payment method for the customer portal on v2staging is known |
| **Executed on** | Not executed — confirmed still BLOCKED on 2026-11-02, Dev (v2dev); see `qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2377_2026-11-02.md` |
| **Result** | BLOCKED — known blocker 1: no test payment method; card details never entered |

**Why this matters:** Staff read the admin warranty details page when a claim comes in. If a
paid surcharge (such as air-suspension cover) is missing there, a valid claim on that part
could be refused.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle, Client, Program, Surcharge | As in AP2377_008 (VIN `5YJ3E1EA0LF734293`; client `client.stage.NNN@yopmail.com`; CVE · CVE 60m/0km · BEV; air suspension **Oui**) |
| Payment method | Not known — known blocker 1 |
| Admin login | From the `env` source — Admin Portal row (`ADMIN_USERNAME` / `ADMIN_PASSWORD`); never copied into this file |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] In French, walk `/customer/avantage-plus/buy` to the summary exactly as AP2377_008 steps 1–3 (vehicle → "Continuer"; client details, FORM L25 ticked → "Demander un devis"; CVE / CVE 60m/0km / BEV with air suspension **Oui**) | The summary shows "Ce véhicule est-il équipé d'un système de suspension pneumatique ? OUI". |
| 2 | [Pre-Condition] Tick "J'accepte les termes et conditions", click "Continuer au paiement" and pay with the staging test payment method (Not known — known blocker 1) | A payment confirmation appears; record the contract or warranty number shown. |
| 3 | Log in at `/admin/login` with the admin account and open the warranty list from the sidebar; find the new warranty by the contract number from step 2 or by `client.stage.NNN@yopmail.com` | The new warranty is listed; record the list and details routes. |
| 4 | Open the warranty's details page | The details page loads with no error page or HTTP 5xx. |
| 5 | [Verification] Verify the surcharge on the details page | The page shows the air-suspension surcharge question with the answer YES (or OUI). Record its heading and exact wording for Q-007. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-003 AC 3 — FORM L25 checkbox (required or not) | — | AP2377_007 | — | AP2377_007 (client details kept) |
| REQ-004 AC 4 — "Get rates now" opens Coverage | AP2377_006 | — | — | — |
| REQ-005 AC 5 — summary lists YES surcharges | AP2377_008 | — | AP2377_009 | — |
| REQ-006 AC 6 — admin warranty page shows surcharges | AP2377_010 (BLOCKED) | — | — | — |

REQ-001, REQ-002 and the rest of REQ-003 are covered in file 1 (AP2377_001–005).

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2377_006 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_006-step3-CoverageStepOpens_pass.png` |
| AP2377_007 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_007-step4-L25RequiredFieldsKept_pass.png` |
| AP2377_008 | ❌ FAIL | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_008-step5-SurchargeLineNoOui_fail.png` |
| AP2377_009 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_009-step4-NonQuestionAbsent_pass.png` |
| AP2377_010 | 🚫 BLOCKED | — (not executed) |
