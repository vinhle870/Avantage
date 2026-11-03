# Test Cases — AP2436 (File 1 of 4)

**Project:** Avantage Plus (AP) — Dealer Portal, release 5.1.0
**Requirement:** AP2436 — Dealer portal: Sending insurance compliance documents
**Source:** requirements/AP-2436-dealer-compliance-documents.md · qa-artifacts/1-requirements-analysis/requirements-analysis.md · qa-artifacts/2-test-plan/test-plan.md
**Date:** 2026-08-28
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2436_001 to AP2436_005 (5 test cases)
**Coverage:** Functional · Negative · UI

> **Test data source note.** Accounts and portal URLs come from
> [execute.env.md](../base-test/execute.env.md) — environment Staging (v2staging), one
> login (`vinhle870@gmail.com`) serving both the Admin Portal and the Dealer Portal.
> Vehicles and other shared data come from
> [test-centralized.md](../base-test/test-centralized.md); vehicle 915, a 2008 Ford Focus,
> is the one on file, and its **Create quote** action is the quickest way to reach the
> quote a send needs. Two items are still missing: a dealership outside Quebec, needed by
> AP2436_004, and a client email inbox. Both are listed under "Still needed for AP-2436" in
> execute.env.md.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2436_001 | A Quebec dealer opening Insurance Quick Quote sees the "Send compliance documents" button | Functional | High | PASS |
| AP2436_002 | A Quebec dealer opening a saved quote's Quote Details page sees the same send button | Functional | High | PASS |
| AP2436_003 | With the portal in French the button reads "Envoyer les documents de comformité" in dark style | UI | Medium | PASS |
| AP2436_004 | A dealer outside Quebec opens the quote pages — record whether the send button appears | Negative | Medium | FAIL |
| AP2436_005 | Clicking the send button opens a modal asking only for client name, client email and Send | Functional | High | FAIL |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2436_001 — A Quebec dealer opening Insurance Quick Quote sees the "Send compliance documents" button

| Field | Value |
|---|---|
| **TC ID** | AP2436_001 |
| **Title** | A Quebec dealer opening Insurance Quick Quote sees the "Send compliance documents" button |
| **Requirement** | AP2436 — REQ-001, acceptance criterion 1 |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | PASS — Button visible and enabled on Insurance Quick Quote. Province evidenced indirectly by the generated PDF address field ("QC"); the product list and a real province field remain unverified. See [execution-log_AP-2436_2026-08-29.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-08-29.md). |

**Why this matters:** This button is the only entrance to the whole feature. If it does not appear for a Quebec dealer, none of the other nineteen test cases can run and the story delivers nothing.

**Test Data:**

| Variable | Value |
|---|---|
| Dealer portal URL | https://v2staging.garantieavantageplus.ca/login — see [execute.env.md](../base-test/execute.env.md) |
| Dealer login (Quebec province) | `vinhle870@gmail.com` — password in [execute.env.md](../base-test/execute.env.md) → Portals → Dealer Portal |
| Portal language | English |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open the dealer portal URL and log in with the Quebec dealer account | The dealer area loads and shows the dealer's dashboard with the dealership name in the header |
| 2 | [Pre-Condition] Confirm the signed-in dealership's province is Quebec on the dealer profile or dealership details screen | The province shown for the dealership is Quebec |
| 3 | Open the "Insurance Quick Quote" link on the Dashboard, beside "Create quote" (route `/quick-insurance-quote`) | The page loads with heading "Creditors Insurance Quick Quote" and the "Creditors Insurance Quote" form visible |
| 4 | [Verification] Verify the navigation component on this page shows a button labelled "Send compliance documents" and that the button is enabled | The button "Send compliance documents" is visible in the navigation component and can be clicked |

---

### AP2436_002 — A Quebec dealer opening a saved quote's Quote Details page sees the same send button

| Field | Value |
|---|---|
| **TC ID** | AP2436_002 |
| **Title** | A Quebec dealer opening a saved quote's Quote Details page sees the same send button |
| **Requirement** | AP2436 — REQ-001, acceptance criterion 2 |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | PASS — reached via Quotes -> "Create a quote" -> client form -> /quote/{id}/details. The send control is present with class "btn btn-dark" and additionally pre-fills the client email in its href. See [execution-log_AP-2436_2026-08-29.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-08-29.md). |

**Why this matters:** The story names two pages, not one. A dealer who has already saved a quote works from Quote Details, so a button that only exists on Quick Quote would leave the most common path without the feature.

**Test Data:**

| Variable | Value |
|---|---|
| Dealer login (Quebec province) | `vinhle870@gmail.com` — password in [execute.env.md](../base-test/execute.env.md) → Portals → Dealer Portal |
| Quote to open | A quote on vehicle 915 (2008 Ford Focus, VIN `1FAHP35NX8W239204`) — see [test-centralized.md](../base-test/test-centralized.md). Use an existing quote from the vehicle's **Quotes** tab, or raise one with **Create quote** on https://v2staging.garantieavantageplus.ca/vehicle/915/details |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal with the Quebec dealer account | The dealer area loads and shows the dealer's dashboard |
| 2 | [Pre-Condition] Open the dealer's quote list and select an existing quote, or create a quote from "Insurance Quick Quote" and save it | A quote exists and is selectable from the quote list |
| 3 | Open the "Quote Details" page for that quote | The Quote Details page loads and shows the quote's protections and prices |
| 4 | [Verification] Verify the navigation component shows the enabled button "Send compliance documents", and take a screenshot of it | The button "Send compliance documents" is visible and enabled on the Quote Details page |

---

### AP2436_003 — With the portal in French the button reads "Envoyer les documents de comformité" in dark style

| Field | Value |
|---|---|
| **TC ID** | AP2436_003 |
| **Title** | With the portal in French the button reads "Envoyer les documents de comformité" in dark style |
| **Requirement** | AP2436 — REQ-001, acceptance criterion 3 |
| **Type** | UI |
| **Priority** | Medium |
| **Status** | PASS |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | PASS — French label reads "Envoyer les documents de comformité" with class "btn btn-dark" — matches the story character for character, misspelling included. See [execution-log_AP-2436_2026-08-29.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-08-29.md). |

**Why this matters:** Every dealer in scope is in Quebec, so French is the language most of them will actually see. The story spells the label "comformité", which is a misspelling of "conformité" — open question Q-008. Record exactly what the screen shows and do not correct it silently, so the team can decide which spelling is intended.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Portal language | French | Switched using the portal's language selector |
| Expected label as written in the story | Envoyer les documents de comformité | Compare character by character and report any difference, including the "comformité" / "conformité" spelling |
| Expected style | Dark button | The story specifies "Type: Dark button" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal with the Quebec dealer account and open the "Insurance Quick Quote" page | The Insurance Quick Quote page loads with the send button visible |
| 2 | Switch the portal language to French using the language selector | The page reloads in French and the navigation labels are in French |
| 3 | [Verification] Verify the button label text, capture a screenshot, and note whether it reads "comformité" or "conformité" and whether the button is rendered in the dark button style | The button reads "Envoyer les documents de comformité" and is drawn in the dark button style; the screenshot records the exact spelling seen |

---

### AP2436_004 — A dealer outside Quebec opens the quote pages — record whether the send button appears

| Field | Value |
|---|---|
| **TC ID** | AP2436_004 |
| **Title** | A dealer outside Quebec opens the quote pages — record whether the send button appears |
| **Requirement** | AP2436 — REQ-001, Given clause (Quebec dealers only) |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | FAIL |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | FAIL (partly run) — the CLIENT province is not enforced: a quote for an Ontario client still offers "Send compliance documents". The DEALER-province half is still blocked for want of a non-Quebec dealer login. See [execution-log_AP-2436_2026-08-29.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-08-29.md). |

**Why this matters:** The story restricts the feature to Quebec but never says what a dealer elsewhere should see, so this case has no agreed expected result — it is open question Q-001. Run it and record the behaviour as an observation. Do not mark it Failed on the basis of a rule nobody has written; if the button does appear outside Quebec, that observation is what the product owner needs in order to answer Q-001.

**Test Data:**

| Variable | Value |
|---|---|
| Dealer login (province other than Quebec) | Not available. No non-Quebec dealership is on file — listed under "Still needed for AP-2436" in [execute.env.md](../base-test/execute.env.md). This case cannot run until one is supplied. |
| Expected result | Not known — the story defines no behaviour for a non-Quebec dealer. Record what happens. |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal with the non-Quebec dealer account and confirm the dealership's province is not Quebec | The dealer area loads and the dealership's province is something other than Quebec |
| 2 | Open the "Insurance Quick Quote" page | The Insurance Quick Quote page loads |
| 3 | Open the "Quote Details" page for any quote belonging to this dealer | The Quote Details page loads |
| 4 | [Verification] Verify on both pages whether the "Send compliance documents" button is absent, present but disabled, or present and enabled, and screenshot each page | The observed state is recorded and screenshotted on both pages. The result is reported as an observation against open question Q-001, not as a pass or a fail. |

---

### AP2436_005 — Clicking the send button opens a modal asking only for client name, client email and Send

| Field | Value |
|---|---|
| **TC ID** | AP2436_005 |
| **Title** | Clicking the send button opens a modal asking only for client name, client email and Send |
| **Requirement** | AP2436 — REQ-002, acceptance criteria 1 to 3 |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | FAIL — English modal correct with exactly three controls. French email label reads "Courriel du client" where the story specifies "Adresse courriel". Wording only — nothing functionally broken. See [execution-log_AP-2436_2026-08-29.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-08-29.md). |

**Why this matters:** The story is precise that the form has exactly three controls. An extra field would mean the advisor is being asked for something the story never agreed, and a missing field would make the send impossible.

**Test Data:**

| Variable | Value |
|---|---|
| Expected English labels | "Client Name", "Client Email", "Send" |
| Expected French labels | "Nom du client", "Adresse courriel", "Envoyer" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal with the Quebec dealer account, in English, and open the "Insurance Quick Quote" page | The Insurance Quick Quote page loads with the send button visible |
| 2 | Click "Send compliance documents" | A modal window opens over the page and the page behind it cannot be used until the modal is closed |
| 3 | [Verification] Verify the modal contains exactly three controls — a "Client Name" text field, a "Client Email" text field and a "Send" button — and no other input, then screenshot the modal | The modal shows the "Client Name" and "Client Email" text fields and the "Send" button, and no additional input field is present |
| 4 | Switch the portal language to French and reopen the modal | The modal reopens with its labels in French |
| 5 | [Verification] Verify the French modal shows "Nom du client", "Adresse courriel" and "Envoyer", and screenshot it | The three French labels appear exactly as written, and the screenshot records them |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 AC1 — button on Insurance Quick Quote | AP2436_001 | — | — | — |
| REQ-001 AC2 — button on Quote Details | AP2436_002 | — | — | — |
| REQ-001 AC3 — French label and dark button style | AP2436_003 | — | — | — |
| REQ-001 Given — Quebec dealers only | — | AP2436_004 | — | — |
| REQ-002 AC1–AC3 — modal with three controls, both languages | AP2436_005 | — | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2436_001 | ✅ PASS | `screenshots/5.1.0/AP-2436/AP2436_001-step4-SendComplianceDocsButtonVisible_pass.png` |
| AP2436_002 | ✅ PASS | `AP2436_002-step4-QuoteDetailsSendButton_pass.png` |
| AP2436_003 | ✅ PASS | see execution log |
| AP2436_004 | ❌ FAIL | `AP2436_004-step4-OntarioClientButtonStillShown_fail.png` |
| AP2436_005 | ❌ FAIL | see execution log |
