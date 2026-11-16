# Test Cases — AP2501 (File 2 of 2)

**Project:** Avantage Plus v2 — Permaplate ("Esthetic protection") invoicing
**Requirement:** AP2501 — Permaplate invoice: the term name follows the contract number in the description (REQ-004)
**Source:** `requirements/AP-2501-permaplate-invoice-include-name-of-the.md`, `qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md`, `qa-artifacts/2-test-plan/AP-2501_test-plan.md`
**Date:** 2026-11-01
**Revised:** 2026-11-15 — Execution Context moved to Dev and to the mapped invoice PDF control (Admin "PDF" button, Q-007 Answered by AP-2099); step 2 no longer has a Q-007 branch; step 4 names Q-008 (Accepted: the line directly after the contract number). Still BLOCKED on Q-001 (Blocking + Open; R1 round 2, rule A2). The 2026-11-02 result stands
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
| **Portal** | Dealer Portal (details page, list); Admin Portal (invoice PDF, list) | `navigation` |
| **Entry route** | Dealer `/invoice` and `/invoice/{invoiceId}`; Admin `/admin/invoices`, `/admin/invoice/{invoiceId}` and its header **"PDF"** button → `/admin/invoice/{invoiceId}/pdf` — the invoice PDF (Q-007, Answered by AP-2099), never the contract download `/quote/{quoteId}/permaplate-contract-download` | `navigation`, `domain` (`billing-invoices.md`), AP-2099 |
| **Viewport** | 1280 × 800 | `navigation` (registry `browser` settings) |
| **Environment** | **Dev (v2dev)** — the registry's `execution_env`; Dealer and Admin Portal URLs from the *Dev Environment* section of the `env` source | `env`, `qa-artifacts/qa-config/tools.md` |
| **Login** | One shared account for both portals: username and password from the *Dev Environment* section of the `env` source (`qa-artifacts/base-test/execute.env.md`); Dealer ID `1380`. No credential is written in this file | `env` |
| **Test data** | Invoice **941** on Dev (contract PNA-0000000020, `TERM_A` "10 ans"), created by AP2501_001 on 2026-11-02 | `test-data`, execution log 2026-11-02 |
| **Language** | English UI by default; record the language at each check | `navigation` |
| **Leaves behind** | Nothing new — this case only reads the AP2501_001 invoice | `cleanup` (missing) |

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | Whether "the name of the invoice should follow the contract number in the description" means the **term's** name, as the title and description say — a contradiction in the ticket's own text | AP2501_006 | Open — Q-001 (Blocking), asked on AP-2501 on 2026-11-01 (comment 19437) and 2026-11-08; not posted again. The position half ("follow" = the very next line) is now Q-008, Accepted |

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
| **Requirement** | AP2501 — REQ-004 AC 1 ("Then the name of the invoice should follow the contract number in the description"); Q-008 Accepted ("follow" = the line directly after the contract number) |
| **Route** | `/invoice/{invoiceId}`, `/admin/invoice/{invoiceId}/pdf`, Dealer `/invoice`, Admin `/admin/invoices` |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Q-001 (Blocking — unanswered, asked 2026-11-01 and 2026-11-08): the criterion says "the name of the invoice", the title and description say "the name of the term" |
| **Executed on** | 2026-11-02 — Dev (v2dev); not executed |
| **Result** | BLOCKED — Q-001 still unanswered on 2026-11-02 and on 2026-11-15 — see `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md`; line-order observations of 2026-11-15 (invoices 941 and 956: term on the line right after the contract number on the details pages and both lists; PDF unreadable, AP-2529) in `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-15.md` |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Step 2 opens the Admin "PDF" button directly and drops the Q-007 branch; step 4 states the position from Q-008; Q-001 dates updated. Still BLOCKED; the 2026-11-02 result stands | Q-007 Answered (AP-2099) and Q-008 Accepted in the 2026-11-15 analysis; Q-001 still Blocking + Open (R1 round 2, rule A2) | Analysis 2026-11-15; orchestrator re-execution scope |

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
| 2 | Record the order of the lines in the Description cell on the details page, then sign in to the Admin Portal, open `/admin/invoice/{invoiceId}`, click **"PDF"** (`/admin/invoice/{invoiceId}/pdf` — never the `permaplate-{contractId}.pdf` contract download) and record the order of its description lines | The line order on both surfaces is recorded verbatim, with the contract-number line and the term line marked. If the "PDF" button answers an error (AP-2529, open), record the PDF surface as not checked, naming AP-2529 — do not substitute the contract PDF |
| 3 | Read the invoice 941 row on the Dealer `/invoice` list and on the Admin `/admin/invoices` list, and record where the term text sits relative to the contract number | The order on both list pages is recorded |
| 4 | [Verification] Judge the position on all four surfaces against the answer to Q-001 | **Which item:** Not known — Q-001. **Where (Q-008 Accepted):** on the line directly after the contract-number line, the same on every surface. Once Q-001 is answered, the case passes when the item the answer names sits there on every surface. **Objective faults (FAIL) regardless of the answer:** the contract number is missing, or the term appears on one surface but not another. Until then the observed order is record-only |
