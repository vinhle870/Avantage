# Test Cases — AP2463 (File 1 of 1)

**Project:** Avantage Plus v2 — Dealer and Admin portals, Permaplate ("Esthetic Protection") contract lists
**Requirement:** AP2463 — Bug re-test: the "Client phone" column shows the work number while the quote page shows the home number
**Source:** requirements/AP-2463-permaplate-list-client-phone-work-vs-home.md (bug steps to reproduce + the fix agreed by Ken Nguyen on 2026-09-10)
**Date:** 2026-10-04
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2463_001 to AP2463_003 (3 test cases)
**Coverage:** Functional (re-test) · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer (AP2463_001, 003) and Admin (AP2463_002) | `navigation` |
| **Entry route** | Dealer: `/permaplate-contracts` (sidebar Contracts → Permaplate — the program may now be labelled "Esthetic Protection" / "Protection esthétique"). Quote details: `/quote/6284/details`. Admin: `/admin/permaplate-contracts`, contract details `/admin/permaplate-contract/7`. | `navigation`, PERMAPLATE execution log 2026-09-06 |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Dealer: `vinhle870@gmail.com` / `<password from the env source>` at `/login` (Dealer 1380, "Test QA staging"). Admin: same account at `/admin/login` (French login page). Both sessions can be held at once. | `env` |
| **Test data** | Contract **PNA-0000000007** (internal id 7) on quote **6284**, client **Perma Testclient** — Phone (home) `5145550100`, Phone (work) `5145550101`, VIN `1FAHP35NX8W239204`, created 2026-09-06 by the run that raised this bug. Static: re-used unchanged. The phones are snapshotted onto the contract at creation, so this contract carries both. | Execution log `5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |
| **Language** | EN dealer and admin UI. Login pages in French. | `navigation` |
| **Leaves behind** | Nothing — all three cases only read. | — |

**Expected format** (Ken Nguyen, AP-2463 comment of 2026-09-10): under the "Client phone" column, two lines — `Cell: xxx-xxx-xxxx` and `Home: xxx-xxx-xxxx`. For Perma Testclient that is **`Cell: 514-555-0101`** and **`Home: 514-555-0100`**. In this product "cell" is the client's work number field (ownerPhoneCell = work, per Minh Lưu's comment of 2026-09-10).

**Known blockers:** None. If PNA-0000000007 is no longer listed, the executor may create a new contract with the bug's own steps 3–6 (client with home 5145550100 and work 5145550101), and records it.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2463_001 | The dealer's Permaplate contract list shows both the client's cell and home numbers, labelled, for Perma Testclient | Functional | High | PASS |
| AP2463_002 | The admin Permaplate contract list shows the same labelled cell and home numbers as the dealer list | Functional | High | PASS |
| AP2463_003 | After the fix, the dealer list's other columns, its Download button and the quote page's home number are unchanged | Regression | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2463_001 — The dealer's Permaplate contract list shows both the client's cell and home numbers, labelled, for Perma Testclient

| Field | Value |
|---|---|
| **TC ID** | AP2463_001 |
| **Title** | The dealer's Permaplate contract list shows both the client's cell and home numbers, labelled, for Perma Testclient |
| **Requirement** | AP2463 — bug steps 7–8; agreed fix (Ken Nguyen, 2026-09-10) |
| **Route** | `/permaplate-contracts` — dealer Permaplate contracts |
| **Type** | Functional (re-test) |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, Chromium 1280×800 |
| **Result** | PASS — dealer "Client phone" cell reads "Cell: 5145550101" / "Home: 5145550100" (two lines, labels correct). Observation: digits not dashed (agreed format 514-555-0101). Program now labelled "Esthetic protection". |

**Why this matters:** This is the reported defect. Before the fix the column showed only 5145550101 (the work number) while the quote page showed 5145550100, with nothing saying which was which. The fix passes only if both numbers appear, each with its label.

**Test Data:**

| Variable | Value |
|---|---|
| Contract | PNA-0000000007, client Perma Testclient, VIN 1FAHP35NX8W239204 |
| Expected cell text | `Cell: 514-555-0101` and `Home: 514-555-0100` (two lines) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal at `/login` with `vinhle870@gmail.com` / `<password from the env source>` | The dealer home page opens for "Test QA staging". |
| 2 | Open `/permaplate-contracts` (sidebar Contracts → Permaplate / Esthetic Protection) | The contract list loads. Record the page heading and the sidebar label. |
| 3 | Find the row whose Client name is "Perma Testclient" and VIN is `1FAHP35NX8W239204` (check every page) | The row is found. |
| 4 | [Verification] Read the "Client phone" cell of that row | The cell shows two labelled numbers: "Cell: 514-555-0101" and "Home: 514-555-0100". Record the exact text, including the formatting of the digits. FAIL if only one number appears, a label is missing, or the labels are swapped (Cell showing 5145550100). |

---

### AP2463_002 — The admin Permaplate contract list shows the same labelled cell and home numbers as the dealer list

| Field | Value |
|---|---|
| **TC ID** | AP2463_002 |
| **Title** | The admin Permaplate contract list shows the same labelled cell and home numbers as the dealer list |
| **Requirement** | AP2463 — bug step 9; "apply it consistently to both the dealer and admin lists" (Minh Lưu, 2026-09-10) |
| **Route** | `/admin/permaplate-contracts` — admin Permaplate contracts |
| **Type** | Functional (re-test) |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, Chromium 1280×800 |
| **Result** | PASS — admin "Client" cell reads "Cell: 5145550101" / "Home: 5145550100" (tel: links), same as dealer list. Contract id 7 = PNA-0000000007. Same undashed-digits observation. |

**Why this matters:** The bug was found on both lists. Fixing only the dealer list would leave admins comparing a different number with what dealers see.

**Test Data:**

| Variable | Value |
|---|---|
| Contract | PNA-0000000007 (admin id 7), client Perma Testclient |
| Expected text | `Cell: 514-555-0101` and `Home: 514-555-0100` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal at `/admin/login` ("Courriel" `vinhle870@gmail.com`, "Mot de passe" `<password from the env source>`, "Se connecter") | The admin home page `/admin` opens. |
| 2 | Open `/admin/permaplate-contracts` | The admin contract list loads. Record the heading and the column headers. |
| 3 | Find the row for PNA-0000000007 / Perma Testclient (check every page) | The row is found. |
| 4 | [Verification] Read the phone shown for that row (in the Client or Client phone column) | It shows "Cell: 514-555-0101" and "Home: 514-555-0100", in the same format as the dealer list in AP2463_001. Record the exact text. FAIL if only one number appears or the labels are missing or swapped. |

---

### AP2463_003 — After the fix, the dealer list's other columns, its Download button and the quote page's home number are unchanged

| Field | Value |
|---|---|
| **TC ID** | AP2463_003 |
| **Title** | After the fix, the dealer list's other columns, its Download button and the quote page's home number are unchanged |
| **Requirement** | AP2463 — regression around the fix (AP-2443 criteria 6–7: five columns and a PDF Download button) |
| **Route** | `/permaplate-contracts`, `/quote/6284/details` |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, Chromium 1280×800 |
| **Result** | PASS — headers VIN / Client name / Client phone / Contract cost price / Actions unchanged; row 145.00$, Download (fa-file-pdf) → HTTP 200 application/pdf permaplate-7.pdf; quote 6284 Client card still shows 5145550100. All 3 dealer rows use Cell/Home layout. |

**Why this matters:** Changing what the phone cell renders could break the row layout, the other columns or the download link, and the fix should not have changed the quote page, which was already correct.

**Test Data:**

| Variable | Value |
|---|---|
| Columns before the fix (2026-09-06) | "VIN", "Client name", "Client phone", "Contract cost price", "Actions" |
| PNA-0000000007 row values before the fix | VIN `1FAHP35NX8W239204` · Perma Testclient · cost `145.00$` · Download → `/quote/6284/permaplate-contract-download` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Signed in to the Dealer portal; open `/permaplate-contracts` | The contract list loads. |
| 2 | [Verification] Read the column headers and the PNA-0000000007 row | Headers are "VIN", "Client name", "Client phone", "Contract cost price", "Actions" (a renamed program label elsewhere on the page is recorded, not failed). The row shows VIN `1FAHP35NX8W239204`, "Perma Testclient", `145.00$`, and a "Download" button with a PDF icon linking to `/quote/6284/permaplate-contract-download`. Every other row's Client phone cell uses the same "Cell: … / Home: …" layout; record how a row with a missing number is shown. |
| 3 | Click "Download" on the PNA-0000000007 row | The contract PDF for PNA-0000000007 / Perma Testclient opens or downloads (HTTP 200, application/pdf). |
| 4 | Open `/quote/6284/details` | The quote page "#6284 - Perma Testclient" loads. |
| 5 | [Verification] Read the phone number in the Client section | It still shows the home number 5145550100 (in any format), as before the fix. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| Dealer list shows both numbers, labelled (bug steps 7–8) | AP2463_001 | — | — | — |
| Admin list shows the same (bug step 9) | AP2463_002 | — | — | — |
| Other columns, Download and quote page unchanged | — | — | AP2463_003 (missing-number rows recorded) | AP2463_003 |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2463_001 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2463/AP2463_001-step4-pass.png` |
| AP2463_002 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2463/AP2463_002-step4-pass.png` |
| AP2463_003 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2463/AP2463_003-step2-pass.png`, `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2463/AP2463_003-step5-pass.png` |

Execution log: `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2463_2026-10-04.md`
