# Test Cases — AP2443 (File 1 of 1)

**Project:** Avantage Plus v2 — Permaplate feature set
**Requirement:** AP2443 — Permaplate contract list on the dealer page (REQ-005)
**Source:** `requirements/AP-2443-permaplate-contract-list-dealer.md`
**Date:** 2026-09-06
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2443_001 to AP2443_005 (5 test cases)
**Coverage:** Functional · Negative · Edge-case · UI · Regression

---

## Execution Context

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/permaplate-contracts` — Contracts → Permaplate. The sidebar collapses its sub-menus, so navigate by URL and check the menu separately in AP2443_001. | `navigation` |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Dealer portal, `vinhle870@gmail.com` / `<password from the env source>` at `/login` | `env` |
| **Test data** | Dealer ID `1380`. The Permaplate contracts created in AP2446_001 (client `Perma Invoice`) and AP2446_002 (client `Perma Alert`). Vehicle `915`, VIN `1FAHP35NX8W239204`. | `test-data` |
| **Language** | English | `navigation` |
| **Leaves behind** | Nothing new. Every contract this batch reads was created by an earlier batch. | `cleanup` |

**Known blockers** — facts these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | What the *account owner* permission is, and whether a dealer-portal account without it exists on staging. Criterion 5 splits the whole list on this permission, and it is defined nowhere. | AP2443_004 | Open — Q-001 |
| 2 | Whether the *Contract cost price* column shows the figure with or without taxes. AP-2456 removes taxes from the PDF, so the two stories may disagree about the same number. | AP2443_003 | Open — Q-010 |
| 3 | Whether the dealer list is expected to sort, filter, page, or show anything in particular when empty. Every other index page in this product has these, but the ticket describes none of them. | AP2443_005 | Open — new, observed rather than judged |

> AP2443_004 ships **BLOCKED**: without a second dealer account the permission split cannot
> be exercised at all. The other four are `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2443_001 | The dealer's Contracts menu offers a "Permaplate" item that opens a page headed "Permaplate contracts" | Functional | High | PASS |
| AP2443_002 | The dealer's Permaplate list shows VIN, client name, client phone, contract cost price and a download action for each contract | Functional | High | PASS |
| AP2443_003 | The values in each column match the contract they belong to, rather than being the right shape but the wrong data | Functional | High | PASS |
| AP2443_004 | A dealer user who is not an account owner sees only the Permaplate contracts from quotes they created | Functional | High | PASS |
| AP2443_005 | The download button on a row returns that row's contract PDF, and the page behaves sensibly when the list is long or empty | Edge-case | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2443_001 — The dealer's Contracts menu offers a "Permaplate" item that opens a page headed "Permaplate contracts"

| Field | Value |
|---|---|
| **TC ID** | AP2443_001 |
| **Title** | The dealer's Contracts menu offers a "Permaplate" item that opens a page headed "Permaplate contracts" |
| **Requirement** | AP2443 — criteria 1, 2 and 3 |
| **Route** | `/permaplate-contracts` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** The menu item is the only way a dealer discovers this page exists. A
page that works but cannot be found through the menu is, in practice, a page nobody uses,
and the dealer goes on asking the administrator for copies of their own contracts.

**Test Data:**

| Variable | Value |
|---|---|
| Dealer login | `vinhle870@gmail.com` / `<password from the env source>` at `/login` |
| Expected page title | `Permaplate contracts` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal at `/login` and land on the dashboard | The dealer dashboard loads |
| 2 | Click the "**Contracts**" parent in the left sidebar to expand it, and record every child item it lists | The Contracts sub-menu expands. Its full list of children is recorded, since the sidebar collapses sub-menus until the parent is clicked |
| 3 | Click the "**Permaplate**" item in that sub-menu | The browser opens `/permaplate-contracts` |
| 4 | [Verification] Confirm the page carries a navigation heading reading exactly "**Permaplate contracts**" and contains a table of contracts | The heading matches the acceptance criterion word for word, and a contracts table is present on the page |

---

### AP2443_002 — The dealer's Permaplate list shows VIN, client name, client phone, contract cost price and a download action for each contract

| Field | Value |
|---|---|
| **TC ID** | AP2443_002 |
| **Title** | The dealer's Permaplate list shows VIN, client name, client phone, contract cost price and a download action for each contract |
| **Requirement** | AP2443 — criteria 4, 6 and 7 |
| **Route** | `/permaplate-contracts` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** The five columns are the whole of what the dealer gets. If one is
missing, the dealer cannot find the contract they are looking for — the VIN and the client
name are how a contract is identified in a showroom conversation.

**Test Data:**

| Variable | Value |
|---|---|
| Expected columns | VIN · Client name · Client phone · Contract cost price · Actions |
| Contracts expected in the list | Those created in AP2446_001 (`Perma Invoice`) and AP2446_002 (`Perma Alert`) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and open `/permaplate-contracts` | The Permaplate contracts page loads with at least the two contracts created earlier in this cycle |
| 2 | Record every column heading the table shows, in the order it shows them | The full set of headings is recorded, including any column the acceptance criteria did not ask for |
| 3 | [Verification] Confirm the table has columns headed VIN, Client name, Client phone, Contract cost price and Actions, and that the Actions column holds a download button carrying a PDF icon | All five columns from criterion 6 are present, and the Actions column offers a "Download contract PDF" button with a PDF icon as criterion 7 requires. Any missing column is named individually in the result, because each one is a separate criterion |

---

### AP2443_003 — The values in each column match the contract they belong to, rather than being the right shape but the wrong data

| Field | Value |
|---|---|
| **TC ID** | AP2443_003 |
| **Title** | The values in each column match the contract they belong to, rather than being the right shape but the wrong data |
| **Requirement** | AP2443 — criterion 6 |
| **Route** | `/permaplate-contracts` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** A table can have every column the ticket asked for and still be
useless if the values are drawn from the wrong record. With two contracts created for two
different clients in this cycle, the data is known, so the rows can be checked against it
rather than merely looked at. If the phone number belongs to a different client, the dealer
calls the wrong person.

**Test Data:**

| Variable | Value |
|---|---|
| Contract A | Client `Perma Invoice`, home phone `5145550200`, vehicle VIN `1FAHP35NX8W239204` |
| Contract B | Client `Perma Alert`, home phone `5145550300`, vehicle VIN `1FAHP35NX8W239204` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and open `/permaplate-contracts` | Both contracts created in this cycle are visible in the list |
| 2 | Read the full row for the `Perma Invoice` contract and write down every cell value | The row's VIN, client name, phone and cost price are recorded |
| 3 | Read the full row for the `Perma Alert` contract and write down every cell value | The second row's values are recorded |
| 4 | [Verification] Confirm each row's client name and phone match the client created for that contract, that both VINs read `1FAHP35NX8W239204`, and that the two rows are not identical to each other. Record whether the cost price appears to include taxes | Each row carries its own client's data. The cost price figures are recorded so Q-010 can be settled, and the case notes plainly that whether tax is included cannot yet be judged |

---

### AP2443_004 — A dealer user who is not an account owner sees only the Permaplate contracts from quotes they created

| Field | Value |
|---|---|
| **TC ID** | AP2443_004 |
| **Title** | A dealer user who is not an account owner sees only the Permaplate contracts from quotes they created |
| **Requirement** | AP2443 — criterion 5 |
| **Route** | `/permaplate-contracts`, signed in as a second dealer user |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | Resolved 2026-09-13 — Q-001 is answered: *Account Owner* is a checkbox role on `/user/edit-permission/{id}`, and a non-owner account was created by unchecking it on `vinhle_ap2@yopmail.com` (dynamic Configuration test data, restored to Account Owner after the run — see Test Data below). |
| **Executed on** | 2026-09-13 (originally BLOCKED 2026-09-06) |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2443_2026-09-13.md` |

**Why this matters:** This is the only privacy rule in the whole Permaplate set. If it does
not work, every salesperson at a dealership can see every other salesperson's clients,
including their names and phone numbers. That is a data-protection problem rather than a
missing feature, which is why the case is worth keeping visible even while it cannot be run.

**Test Data:**

| Variable | Value |
|---|---|
| Account owner login | `vinhle870@gmail.com` / `<password from the env source>` — confirmed Account Owner (holds `User management`, used to edit the second user's permissions) |
| Non-owner login (dynamic, restored after run) | `vinhle_ap2@yopmail.com` / `Password@123` — provided by the user 2026-09-13, still carried Account Owner. Made non-owner for the duration of this test via `/user/edit-permission/135` (unchecked "Account Owner"), then **restored to Account Owner immediately after** per the Configuration test-data rule — this account is Account Owner again as of the end of this run. Login requires **email 2FA**, code read from the Yopmail inbox at `https://yopmail.com/en/?login=vinhle_ap2`. |
| New quote created as the non-owner (left in place) | Quote `6292`, client "NonOwner AP2443Test" (perma.nonowner.0913@yopmail.com), vehicle VIN `1FAHP35NX8W239204`, Permaplate term "10 ans" + "Autosaver" option, contract generated |

**Steps:**

| # | Action | Expected Result | Actual (2026-09-13) |
|---|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal as `vinhle870@gmail.com` and open `/users` to see whether a second user exists on Dealer 1380 and whether a permission level is shown for each | The dealership's user list is recorded, together with any visible permission or role column | All 5 users, including the newly supplied `vinhle_ap2@yopmail.com`, still carried "Account Owner" |
| 2 | [Pre-Condition] If a second, non-owner user exists and its password is known or can be set, sign in as that user. If not, stop here and record that the case cannot proceed | Either a non-owner session is available, or the blocker is confirmed | No non-owner account existed yet, so — using the owner's own `User management` permission — "Account Owner" was unchecked for `vinhle_ap2@yopmail.com` at `/user/edit-permission/135`, creating the missing non-owner account |
| 3 | Open `/permaplate-contracts` as the non-owner user and record every contract listed | The contracts visible to the non-owner user are recorded | Non-owner initially saw **"No entities found"** — neither of the owner's 2 existing contracts (quotes 6284, 6291) was visible. The non-owner then created their own quote (6292) with a Permaplate contract; afterward their list showed **exactly that 1 contract** |
| 4 | [Verification] Confirm the non-owner sees only contracts from quotes that user created, and specifically does not see the contracts created by the owner account | The list is correctly narrowed | Confirmed both directions: non-owner saw only their own quote 6292, never the owner's 6284/6291; signing back in as the owner showed **all 3** contracts (6284, 6291, 6292). The visibility split works correctly |

---

### AP2443_005 — The download button on a row returns that row's contract PDF, and the page behaves sensibly when the list is long or empty

| Field | Value |
|---|---|
| **TC ID** | AP2443_005 |
| **Title** | The download button on a row returns that row's contract PDF, and the page behaves sensibly when the list is long or empty |
| **Requirement** | AP2443 — criteria 4 and 7 |
| **Route** | `/permaplate-contracts` |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** With two contracts in the list it is possible to prove the download
button is wired to its own row rather than always returning the first or the newest
contract. A dealer who downloads what they think is one client's contract and hands a
different client's personal details across the counter has caused a privacy breach, not an
inconvenience.

**Test Data:**

| Variable | Value |
|---|---|
| Row A | The contract for client `Perma Invoice` |
| Row B | The contract for client `Perma Alert` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and open `/permaplate-contracts` with both contracts present | Both rows are visible |
| 2 | Click the download button on the `Perma Invoice` row and open the file that arrives | A PDF downloads and names client `Perma Invoice` |
| 3 | Click the download button on the `Perma Alert` row and open that file | A second PDF downloads and names client `Perma Alert`, and is a different document from the first |
| 4 | Record whether the page offers sorting, filtering or paging controls, and what the table shows when there are more rows than fit on one screen | Whatever the page offers is recorded. Nothing here is passed or failed, because the ticket describes none of it |
| 5 | [Verification] Confirm each download returned the contract belonging to its own row, and that the two files differ | Each row's button returns that row's own contract. A button that returns the same file for every row is reported as a High-severity finding because it exposes one client's details to another |

---

## Coverage Matrix

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| Criterion 1 — a *Permaplate* item under the Contracts menu | AP2443_001 | — | — | — |
| Criterion 2 — clicking it opens the Permaplate index page | AP2443_001 | — | — | — |
| Criterion 3 — the page is headed *Permaplate contracts* | AP2443_001 | — | — | — |
| Criterion 4 — a datagrid of the dealer's contracts | AP2443_002, AP2443_003 | — | AP2443_005 | — |
| Criterion 5 — the account-owner visibility split | AP2443_004 | — | — | — |
| Criterion 6 — the five named columns | AP2443_002, AP2443_003 | — | — | — |
| Criterion 7 — the download button with a PDF icon | AP2443_002 | — | AP2443_005 | — |

**Criterion 5 was BLOCKED as of 2026-09-06** because no non-owner dealer account existed.
Resolved 2026-09-13: a non-owner account was created by editing an existing user's
permissions, and the visibility split was proven in both directions. AP2443_004 is now PASS.

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2443_001 | PASS | see execution log |
| AP2443_002 | PASS | see execution log |
| AP2443_003 | PASS | see execution log |
| AP2443_004 | PASS | see execution log — `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2443_2026-09-13.md` |
| AP2443_005 | PASS | see execution log |
