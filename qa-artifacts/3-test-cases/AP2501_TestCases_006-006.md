# Test Cases — AP2501 (File 2 of 2)

**Project:** Avantage Plus v2 — Permaplate ("Esthetic protection") invoicing
**Requirement:** AP2501 — Permaplate invoice: the term name follows the contract number in the description (REQ-004)
**Source:** `requirements/AP-2501-permaplate-invoice-include-name-of-the.md`, `qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md`, `qa-artifacts/2-test-plan/AP-2501_test-plan.md`
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2501_006 to AP2501_006 (1 test case)
**Coverage:** Functional · UI

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer Portal (details page, PDF, list); Admin Portal (list) | `navigation` |
| **Entry route** | Dealer `/invoice` (`navigation`); `/invoice/{invoiceId}` (from the AP-2446 execution log of 2026-09-13, not yet in `navigation`/`domain`); the invoice PDF control (identified by invoice number and Grand Total, not the contract download) and the Admin invoice list as recorded by AP2501_003 and AP2501_005 | `navigation`, `execution-log_AP-2446_2026-09-13.md`, AP2501 execution log |
| **Viewport** | 1280 × 800 | `navigation` (registry `browser` settings) |
| **Environment** | v2staging — Dealer and Admin Portal URLs as listed in the `env` source | `env` |
| **Login** | One shared account for both portals: username and password from the `env` source (`qa-artifacts/base-test/execute.env.md`, *Portals* table); Dealer ID `1380` | `env` |
| **Test data** | The invoice created by AP2501_001 (term `TERM_A`, its contract number and invoice ID are in the execution log) | `test-data`, execution log |
| **Language** | English UI by default; record the language at each check | `navigation` |
| **Leaves behind** | Nothing new — this case only reads the AP2501_001 invoice | `cleanup` (missing) |

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | Whether "the name of the invoice should follow the contract number in the description" means the **term's** name (as the title and description say), and whether "follow" means the very next line | AP2501_006 | Open — Q-001 (Blocking), posted on AP-2501 as Jira comment 19437 on 2026-11-01 |

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2501_006 | On every invoice surface, the term name sits on the line right after the contract number | Functional | Medium | BLOCKED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2501_006 — On every invoice surface, the term name sits on the line right after the contract number

| Field | Value |
|---|---|
| **TC ID** | AP2501_006 |
| **Title** | On every invoice surface, the term name sits on the line right after the contract number |
| **Requirement** | AP2501 — REQ-004 AC 1 ("Then the name of the invoice should follow the contract number in the description") |
| **Route** | `/invoice/{invoiceId}`, the invoice PDF, Dealer `/invoice`, the Admin invoice list |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Q-001 (Blocking — unanswered): the criterion says "the name of the invoice", the title and description say "the name of the term" |
| **Executed on** | 2026-11-02 — Dev (v2dev); not executed |
| **Result** | BLOCKED — Q-001 still unanswered on 2026-11-02 — see `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md` |

**Why this matters:** The only acceptance criterion that states a position names "the name
of the invoice", which does not exist, while every other line of the ticket talks about the
term. Reading it as "term" is very likely right, but it is still a guess, and a pass or fail
on a guess is not a result. The steps are written so the case can run the moment the
reporter answers; until then the observed order is recorded by AP2501_001 and this case stays
BLOCKED, which also keeps the story in QC.

**Test Data:**

| Variable | Value |
|---|---|
| Login | Dealer and Admin Portal account from the `env` source |
| Invoice | The AP2501_001 invoice (ID, contract number `PNA-…` and `TERM_A` in the execution log) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer Portal with the `env` account and open `/invoice/{invoiceId}` for the AP2501_001 invoice | The invoice details page loads with its Description cell |
| 2 | Record the order of the lines in the Description cell on the details page, then open the **invoice PDF** identified in AP2501_003 step 2 (the PDF showing this invoice's number and Grand Total — never the `permaplate-{contractId}.pdf` contract download) and record the order of its description lines | The line order on both surfaces is recorded verbatim, with the contract-number line and the term line marked. If AP2501_003 found no invoice PDF (BLOCKED on Q-007), record the PDF surface as not checked — do not substitute the contract PDF |
| 3 | Read the AP2501_001 row on the Dealer `/invoice` list and on the Admin invoice list recorded in AP2501_005, and record where the term text sits relative to the contract number | The order on both list pages is recorded |
| 4 | [Verification] Judge the position on all four surfaces against the answer to Q-001 | Not known — Q-001. Once answered, the expected result is the item and position the answer states (the attached screenshot suggests the term on the line right after the contract number), the same on every surface. **Objective faults (FAIL) regardless of the answer:** the contract number is missing, or the term appears on one surface but not another |
