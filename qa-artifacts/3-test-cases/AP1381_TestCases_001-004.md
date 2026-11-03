# Test Cases — AP1381 (File 1 of 1)

**Project:** Avantage Plus v2 — Billing & Payments, dealer invoice
**Requirement:** AP1381 — duplicate name visual (the dealer's name is shown twice on the invoice)
**Source:** requirements/AP-1381-duplicate-name-visual.md · qa-artifacts/1-requirements-analysis/AP-1381_requirements-analysis.md · qa-artifacts/2-test-plan/AP-1381_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP1381_001 to AP1381_004 (4 test cases)
**Coverage:** Functional · UI · Edge-case (record-only) · Regression (record-only)

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer portal (AP1381_001, 003, 004) and Admin portal (AP1381_002, plus the dealer-data read in every case). One login serves both, and both sessions can be open at once in one browser. | `navigation` |
| **Entry route** | Dealer: `/invoice` — Billing → Invoices list; an invoice's own detail page is `/invoice/{id}`. Admin: Dealer Details `/admin/dealer/1380/edit`; the admin sidebar has an "Invoices" section whose route is not yet mapped — record it at execution. | `navigation`, `env` |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` — executed 2026-11-01 on **Dev (v2dev)** `https://v2dev.garantieavantageplus.ca` by the user's decision; ids used on Dev are in the execution log |
| **Login** | Admin: `/admin/login` · Dealer: `/login` — the shared QA account; read the login and password from the `env` source (`qa-artifacts/base-test/execute.env.md`, section of the environment in use). Never copy them here | `env` |
| **Test data** | Dealer ID `1380`. As verified on 2026-09-01: **Name** = `Offical VinhLe870@gmail.com`, **Company** = `Test QA staging`. The two values differ, so the invoice shows which one it uses. Each case re-reads them in its first step. | `env` |
| **Language** | EN for the Dealer portal. The admin login page is always in French ("Connexion", "Courriel", "Mot de passe", "Se connecter"). | `navigation` |
| **Invoice under test** | The defect (2022) was raised on a **warranty** invoice — the only kind that existed then. AP1381_001 and AP1381_002 therefore verify the newest warranty invoice: the newest row on `/invoice` whose link beside the Invoice ID reads `Warranty #…` (it opens `/warranty/{n}`). As last recorded (2026-09-13 snapshot) that is `909` — `Warranty #26df1-829`, created Sunday, July 5, 2026; `908` — `Warranty #APOP01-828` is the next. The newest Permaplate invoice (link reads `PNA-…`; last recorded `926`, created 2026-09-13) is a recorded second check only (review proposal P2-1). | `env`; v2staging `/invoice` snapshot 2026-09-13 |
| **Leaves behind** | Nothing — existing invoices are reused and nothing is created. | `cleanup` (missing — no teardown is defined) |

**Known blockers** — a fact these test cases need that nobody has supplied yet:

None. The layout of the v2 invoice detail page and the admin invoice route are not in the
knowledge base, but both are found and recorded at execution rather than guessed; neither
decides an expected result. If the Admin portal turns out to have no way to open a dealer's
invoice, AP1381_002 is recorded BLOCKED with that reason, not FAIL. If `/invoice` lists no
warranty invoice for dealer 1380, AP1381_001 and AP1381_002 are recorded BLOCKED with "no
warranty invoice listed for dealer 1380" — they never fall back to a Permaplate invoice.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP1381_001 | A dealer opening an invoice in the Dealer portal sees the dealer's name once in the TO section, not twice | Functional | High | PASS |
| AP1381_002 | An admin opening the same dealer invoice in the Admin portal sees the dealer's name once in the TO section | Functional | High | PASS |
| AP1381_003 | The downloadable PDF of a dealer invoice shows the dealer's name without an error — how often it appears is recorded | Edge-case | Medium | SKIPPED |
| AP1381_004 | The oldest dealer invoice still opens without an error — whether it keeps the duplicated name is recorded | Regression | Low | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP1381_001 — A dealer opening an invoice in the Dealer portal sees the dealer's name once in the TO section, not twice

| Field | Value |
|---|---|
| **TC ID** | AP1381_001 |
| **Title** | A dealer opening an invoice in the Dealer portal sees the dealer's name once in the TO section, not twice |
| **Requirement** | AP1381 — REQ-001, acceptance criterion 1 ("on the invoice - the name of the dealer is duplicated - only company name is needed to show"), with Q-001 answered: "the *Name is what will appear in the invoice" — Eric Lindquist, 2022-08-03 |
| **Route** | `/admin/dealer/1380/edit`, then `/invoice` → `/invoice/{id}` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | PASS — warranty invoice 934 (Warranty #APOP01-843, 2026-10-06): To block names "Offical VinhLe870@gmail.com" once, no company line. Permaplate 927 recorded: name once |

**Why this matters:** The invoice is the document a dealer pays from and may pass on. When
the addressee block names the dealer twice, it looks like a printing error and makes the
bill look unreliable. This is the exact defect the reporter raised. The reporter's later
comment settles which name must stay — the dealer's "*Name" field — so the case checks
both that the name appears once and that it is that value, using a dealer whose name and
company differ.

**Test Data:**

| Variable | Value |
|---|---|
| Admin and Dealer login | The shared QA account — see the `env` source (`execute.env.md`) |
| Dealer | ID `1380` — expected *Name `Offical VinhLe870@gmail.com`, Company `Test QA staging` (re-read in step 1) |
| Invoice (verified) | The newest **warranty** invoice on `/invoice`: the highest Invoice ID whose link reads `Warranty #…` (last recorded: `909` — `Warranty #26df1-829`, created Sunday, July 5, 2026). It post-dates the fix release of 2022-09-19 — confirm from its "Created at" value. No fallback: if no warranty invoice is listed, the case is BLOCKED |
| Invoice (second check, recorded only) | The newest Permaplate invoice on `/invoice`: the highest Invoice ID whose link reads `PNA-…` (last recorded: `926`, created Sunday, September 13, 2026) — review proposal P2-1 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal at `/admin/login`, open `/admin/dealer/1380/edit`, and write down the exact label and value of the required "*Name" field and the value of the company field on the Dealer Details form. If no field is labelled "*Name", use the field labelled "Name" (the one the Dealers list search matches on) and note the label actually shown | The Dealer Details form for dealer 1380 opens. The name field's label, its value (expected `Offical VinhLe870@gmail.com`) and the company value (expected `Test QA staging`) are recorded in the log; if either value differs from the expected one, the recorded value is used in step 5 |
| 2 | [Pre-Condition] Sign in to the Dealer portal at `/login` and open `/invoice`. Pick the newest warranty invoice — the highest Invoice ID whose link reads `Warranty #…` — and record its ID, its description (the `Warranty #…` label) and its "Created at" date. Also record the ID and "Created at" of the newest Permaplate invoice (link reads `PNA-…`) for the second check. If no warranty invoice is listed, stop and record the case BLOCKED with "no warranty invoice listed for dealer 1380" — do not use a Permaplate invoice instead | One warranty invoice is recorded with its ID, `Warranty #…` description and creation date (later than 2022-09-19; last recorded: `909` — `Warranty #26df1-829`, July 5, 2026), plus the newest Permaplate invoice ID if one is listed |
| 3 | Open the warranty invoice's detail page `/invoice/{id}` | The invoice detail page loads with the invoice number, the itemised lines and the addressee block. Record the addressee block's exact label ("TO" or the label the v2 page uses) |
| 4 | Read every line of the addressee (TO) block from top to bottom and copy them into the log | The full text of the TO block is in the log, line by line |
| 5 | [Verification] Verify in the warranty invoice's TO block that the *Name value from step 1 appears exactly once, and that no second line repeats the dealer's name or shows the company value from step 1 as another name. Then, as a recorded second check, open the Permaplate invoice from step 2 at `/invoice/{id}`, copy its TO block into the log and record how many times the name appears | The warranty invoice's TO block shows `Offical VinhLe870@gmail.com` (the *Name value) once and does not also show `Test QA staging` as a second name line — this alone decides PASS/FAIL. Screenshot of the TO block required. The Permaplate invoice's TO block and name count are recorded as evidence for proposal P2-1, not judged (screenshot required) |

---

### AP1381_002 — An admin opening the same dealer invoice in the Admin portal sees the dealer's name once in the TO section

| Field | Value |
|---|---|
| **TC ID** | AP1381_002 |
| **Title** | An admin opening the same dealer invoice in the Admin portal sees the dealer's name once in the TO section |
| **Requirement** | AP1381 — REQ-002, acceptance criterion 1, with Q-001 answered ("the *Name is what will appear in the invoice" — Eric Lindquist, 2022-08-03); linked Xray test AP-1552 |
| **Route** | `/admin/dealer/1380/edit`, then the Admin portal "Invoices" section (route recorded at execution) |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | PASS — `/admin/invoices` → `/admin/invoice/934`: To block names "Offical VinhLe870@gmail.com" once, no company line |

**Why this matters:** Avantage Plus staff open the same invoices from the Admin portal, and
the ticket's linked Xray test AP-1552 checks the rule there. If the fix was applied only to
the dealer's view, staff would still see — and could send out — a copy with the name
printed twice.

**Test Data:**

| Variable | Value |
|---|---|
| Admin and Dealer login | The shared QA account — see the `env` source (`execute.env.md`) |
| Dealer | ID `1380` — *Name and company re-read in step 1 |
| Invoice | The warranty invoice ID used in AP1381_001; if AP1381_001 has not run, the newest warranty invoice on the Dealer portal's `/invoice` (highest Invoice ID whose link reads `Warranty #…`; last recorded `909` — `Warranty #26df1-829`). No fallback to a Permaplate invoice |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal at `/admin/login`, open `/admin/dealer/1380/edit`, and record the exact label and value of the "*Name" field and the company value. If no field is labelled "*Name", use the field labelled "Name" (the one the Dealers list search matches on) and note the label actually shown | The Dealer Details form opens; the name field's label and both values are recorded (expected `Offical VinhLe870@gmail.com` and `Test QA staging`) |
| 2 | [Pre-Condition] Take the warranty invoice used in AP1381_001. If AP1381_001 has not run, sign in to the Dealer portal at `/login`, open `/invoice` and pick the highest Invoice ID whose link reads `Warranty #…`. Record its ID, its `Warranty #…` description and its "Created at" date. If no warranty invoice is listed, stop and record the case BLOCKED with "no warranty invoice listed for dealer 1380" — do not use a Permaplate invoice instead | One warranty invoice for dealer 1380 is recorded with its ID, description and creation date |
| 3 | In the Admin portal sidebar, click "Invoices", find the recorded invoice ID in the list (submit the page's search form if it has one), and open the invoice. Record the route of the list and of the opened invoice | The admin view of that invoice opens, showing the same invoice number. If the Admin portal offers no way to open a single dealer invoice, stop and record the case BLOCKED with "no admin invoice view found" |
| 4 | Read every line of the addressee (TO) block and copy them into the log | The full text of the TO block is in the log, line by line |
| 5 | [Verification] Verify in the TO block that the *Name value from step 1 appears exactly once, and that no second line repeats the dealer's name or shows the company value as another name | The TO block shows `Offical VinhLe870@gmail.com` once and does not also show `Test QA staging` as a second name line. Screenshot of the TO block required |

---

### AP1381_003 — The downloadable PDF of a dealer invoice shows the dealer's name without an error — how often it appears is recorded

| Field | Value |
|---|---|
| **TC ID** | AP1381_003 |
| **Title** | The downloadable PDF of a dealer invoice shows the dealer's name without an error — how often it appears is recorded |
| **Requirement** | AP1381 — REQ-001; expected result is record-only for Q-003 (Judgement, Open: does the rule cover the PDF copy?) |
| **Route** | `/invoice/{id}` → the invoice's download/PDF link |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | SKIPPED |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | SKIPPED — no PDF copy offered: the dealer invoice page has only "Print" (window.print). Q-003 not answered |

**Why this matters:** A dealer who prints or forwards the invoice sends the PDF, not the
web page. The ticket says only "on the invoice", so whether the PDF must also show the
name once is an open question (Q-003). This case does not guess the answer: it fails only
on an objective fault and records what the PDF shows, so the reporter can answer Q-003
from evidence.

**Test Data:**

| Variable | Value |
|---|---|
| Dealer login | The shared QA account — see the `env` source (`execute.env.md`) |
| Dealer | ID `1380` — *Name `Offical VinhLe870@gmail.com`, Company `Test QA staging` (use the values recorded in AP1381_001 step 1 if it ran) |
| Invoice | The same invoice ID used in AP1381_001 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal at `/login` and open `/invoice/{id}` for the invoice used in AP1381_001 | The invoice detail page loads |
| 2 | Click the invoice's download or PDF link. Record its exact label and the URL it opens | A PDF of the invoice opens or downloads. If the page has no download or PDF control, record the case SKIPPED with "no PDF copy offered" |
| 3 | Read the addressee (TO) block of the PDF and copy its lines into the log | The full text of the PDF's TO block is in the log |
| 4 | [Verification] Check the PDF for objective faults, then record how many times the dealer's *Name appears in its TO block and whether the company value appears as a second name line | No objective fault: the PDF opens without an error page or HTTP 5xx, and its TO block names dealer 1380 (by its *Name or company value) rather than being empty or naming another dealer. Record the outcome for Q-003 — the count of name lines is recorded, not judged. Screenshot required |

---

### AP1381_004 — The oldest dealer invoice still opens without an error — whether it keeps the duplicated name is recorded

| Field | Value |
|---|---|
| **TC ID** | AP1381_004 |
| **Title** | The oldest dealer invoice still opens without an error — whether it keeps the duplicated name is recorded |
| **Requirement** | AP1381 — REQ-001 out-of-scope note; expected result is record-only for Q-002 (Judgement, Open: must invoices created before the fix also change?) |
| **Route** | `/invoice` → `/invoice/{id}` |
| **Type** | Regression |
| **Priority** | Low |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | PASS — oldest invoice 65 (2020-11-25) opens; To block names "VinhLeDealer01" once (recorded for Q-002) |

**Why this matters:** On 2022-09-15 Ken Nguyen (who triages and releases, not a developer)
wrote: "this issue will be fixed on invoices created after the date it was released.
invoices created before already has that info stamped on them so we cannot modify those."
The reporter, Eric Lindquist, accepted it the same day: "ok good to go". That exchange is
a quotable answer to Q-002 — older invoices are expected to keep the duplicated name — and
the next `s1` pass is to mark Q-002 Answered with it. Regression here means checking that
the fix did not break older invoices: they must still open. Whether they still show the
name twice is recorded as evidence against that answer, never passed or failed.

**Test Data:**

| Variable | Value |
|---|---|
| Dealer login | The shared QA account — see the `env` source (`execute.env.md`) |
| Invoice | The invoice with the oldest "Created at" date on `/invoice` (use the list's last page) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal at `/login` and open `/invoice` | The Invoices page loads with its columns Invoice ID, Description, Amount, Created at and Status |
| 2 | Go to the last page of the list, pick the invoice with the oldest "Created at" date, and record its ID and date, noting whether the date is before 2022-09-19 (the fix release date) | One invoice ID and its creation date are recorded |
| 3 | Open that invoice's detail page `/invoice/{id}` and copy the lines of its addressee (TO) block into the log | The detail page loads and the TO block's text is in the log |
| 4 | [Verification] Check the old invoice for objective faults, then record how many times the dealer's name appears in its TO block | No objective fault: the page opens without an error page or HTTP 5xx, and the TO block is not empty. Record the outcome for Q-002 — whether the old invoice shows the name once or twice, and its creation date. Screenshot required |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 AC 1 — Dealer portal invoice shows the *Name once (Q-001 answer) | AP1381_001 | — (no user input to make invalid) | AP1381_003 (PDF, record-only, Q-003) | AP1381_004 (older invoice, record-only, Q-002) |
| REQ-002 AC 1 — Admin portal invoice shows the *Name once (Q-001 answer) | AP1381_002 | — (no user input to make invalid) | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP1381_001 | PASS | `screenshots/1.25.0/AP-1381/AP1381_001-step5-WarrantyInvoice934ToBlock_pass.png` |
| AP1381_002 | PASS | `screenshots/1.25.0/AP-1381/AP1381_002-step5-AdminInvoice934ToBlock_pass.png` |
| AP1381_003 | SKIPPED | `screenshots/1.25.0/AP-1381/AP1381_003-step2-DealerInvoiceOnlyPrintNoPdf_skip.png` |
| AP1381_004 | PASS | `screenshots/1.25.0/AP-1381/AP1381_004-step4-OldestInvoice65ToBlock_pass.png` |

> Full log: `qa-artifacts/4-execution-results/1.25.0/execution-log_AP-1381_2026-11-01.md` — Environment: Dev (v2dev).

---

## Revisions

| Date | Change | By | Reason |
|---|---|---|---|
| 2026-11-01 | Replaced the clear-text login and password in the Execution Context and in the Test Data tables of AP1381_001–004 with a reference to the `env` source (`qa-artifacts/base-test/execute.env.md`) | stlc-manual-executor (s4) | Credentials must not be copied into test-case artifacts |
| 2026-11-01 | Filled Status / Executed on / Result for all four cases after execution on Dev (v2dev); noted the Dev run in the Environment row | stlc-manual-executor (s4) | Execution write-back |
