# Test Plan

**Plan ID:** TP-20261103-AP2505
**Project:** Avantage Plus v2 — Dealer portal, Roadside Protection "Generate Contract" page `/quote/{quoteId}/road-side-protection-create-contract` (Jira AP-2505)
**Version:** 1.1
**Date:** 2026-11-03
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2505_requirements-analysis.md

---

## 1. Test Objectives

- Verify that the Roadside Protection row's "Generate Contract" action on a dealer quote opens a dedicated page at `/quote/{quoteId}/road-side-protection-create-contract` in the same tab, not a modal, and that the page loads without a server error (REQ-001).
- Verify that the page shows "Owner information" and "Financing information" in the left column and "Program Summary" with a "Generate Contract" button in the right column; the column of "Vehicle identification" waits for the Blocking question Q-001 (REQ-002).
- Verify that the vehicle, client and financing values are pre-filled from the quote and that the financing values cannot be changed (REQ-003).
- Verify that submitting valid values creates the roadside (AutoShield) contract — shown on the quote and listed on the dealer's Road Side Protection contract list with a PDF — and record what the dealer sees afterwards: landing page, message, invoice (REQ-004).

---

## 2. Scope

### 2.1 In Scope

| Requirement | Test Types |
|---|---|
| REQ-001 — Dedicated page at the unchanged address | Functional, UI, Regression, Edge-case |
| REQ-002 — Two-column layout | UI, Functional |
| REQ-003 — Pre-fill and read-only financing | Functional, UI, Negative, Edge-case |
| REQ-004 — Submit creates the contract | Functional, Regression, Negative |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| The internal route name `quote-insurance-create-contract` | Not observable in the browser; only the address is (Q-011) |
| The wording of the AutoShield contract PDF and the invoice amounts | The story says they "stay unchanged" and gives no new rule; they are recorded, not judged (Q-009) |
| The add-roadside-protection modal (VIN/Make/Model/Year form, tiers) | Belongs to AP-2498; it is used here only as a setup step |
| The Esthetic protection and extended-warranty contract pages | Belong to AP-2506 and AP-2503; they are the model this page should match, consulted through `domain`, not re-tested |
| French UI wording; narrow screen widths | Not mentioned by the story; judgements are made in EN at 1280 × 800 |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Description | Responsible |
|---|---|---|
| System Testing | End-to-end checks of the dealer quote and the roadside contract page in a real browser | QA Agent |
| Regression | Contract creation from the new page, checked against what `domain` records about roadside contracts (AutoShield contract id, details page `/quote/{quoteId}/auto-shield-contract/{contractId}` with PDF links, dealer list `/road-side-protection-contracts`) | QA Agent |

### 3.2 Test Types

| Type | Approach |
|---|---|
| Functional | Follow each acceptance criterion step by step on a quote the case builds itself |
| UI | Check the two columns and the sections each one holds, by their headings and their horizontal position |
| Negative | Try to change a financing value (read-only); empty a required owner field before submit and record the response (Q-008) |
| Edge-case | Open the page on a quote without a GAP quote (Q-002), without a financing (Q-006), and after its contract exists (Q-010) |
| Regression | After submit, the contract appears on the quote and on "Road Side Protection" contracts, and its PDF opens |

Every expected result that rests on an open Judgement question (Q-002 – Q-010) is
*record-only*: the step records what the build shows, and fails only on an objective
fault — an error page or HTTP 5xx, a lost value, a value different from the one entered.
The case that depends on the Blocking question Q-001 ships BLOCKED.

**Known open bugs on these pages** (both High, status Backlog on 2026-11-03):

- **AP-2518** — opening `/quote/{id}/road-side-protection-create-contract` returned HTTP 500 on Dev, and the ⋯ menu's dialog stayed on "Loading...". The split, identical in both test-case files:
  - **Step under test — a 500 is a FAIL**, compared with AP-2518 at Gate C: AP2505_001 step 3 (the action opens the page), AP2505_002 step 4 (the page on a quote with no GAP quote), AP2505_010 step 3 (the page reopened after the contract exists).
  - **AP2505_006 step 3** (no financing): a FAIL only when the 500 is specific to the missing financing — a financed quote of the same run opened its page; if the financed quote's page also returned 500, or no financed quote could be compared, it is BLOCKED — AP-2518.
  - **Setup — a 500 makes the case BLOCKED — AP-2518:** AP2505_003 – AP2505_005 step 2 and AP2505_007 – AP2505_009 step 2.
- **AP-2508** — the roadside product form has no contract fields and no contract button. Setup saves the roadside product through the add modal's **Save**; if the product cannot be saved, the case is BLOCKED naming AP-2508.

### 3.3 Test Execution Method

All manual test cases are executed by **stlc-manual-executor** through the project's
bound `browser` provider, **playwright** (`mcp__playwright__*`, state `active` in
`qa-artifacts/qa-config/tools.md` §1), on the **Dev** environment (`execution_env: Dev`).
Bugs and the result comment go through the `tracker` provider, **jira** (CLI wrapper
`tools/jira-cli/jira.sh`, state `active`). The `notify` group is `disabled`, so no
notification is sent. Screenshots go under
`qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/`.

---

## 4. Entry Criteria

- [x] AP-2505 is in QC (canonical `ready_for_qa`) — true at capture (2026-11-03).
- [ ] Dev is reachable and the shared dealer account (dealer 1380, from the `env` source, "Dev Environment" section) can log in.
- [x] Gate A has passed — rule A2; Q-001 posted on AP-2505 on 2026-11-03.
- [ ] Test cases are written and reviewed (`AP2505_TestCases_*.md`, Gate B).
- [ ] A Toyota Corolla 2022 offers AutoShield tiers in the add-roadside-protection modal (checked in each case's pre-condition; `domain` recorded 5 tiers on Dev on 2026-11-02; none → the case is BLOCKED, not FAIL).

## 5. Exit Criteria

- [ ] Every test case has a status other than `Not Run`.
- [ ] Every FAIL is filed, linked to an existing bug (AP-2518, AP-2508 first), or dismissed with a quoted reason (Gate C).
- [ ] Pass rate ≥ 90 % (registry `story_pass_threshold`), no open stopping bug and Q-001 answered, for the story to move to Ready for release.
- [ ] `AP-2505_test-report.md` is written and the result comment is posted on AP-2505.

## 6. Suspension & Resumption Criteria

### Suspend testing when:

- Dev or the dealer login fails twice in a row, or returns HTTP 5xx before the step under test.
- The page returns HTTP 500 in AP2505_001 (AP-2518 still present) — the remaining cases that open the page as **setup** (AP2505_003 – AP2505_005, AP2505_007 – AP2505_009) and AP2505_006 (same 500 as the financed quote → BLOCKED by its rule) are recorded BLOCKED naming AP-2518 after one confirming attempt each, not executed further. **Excluded:** AP2505_002 is still executed in full, because opening the page is its step under test (a 500 there is a FAIL). AP2505_010 is then BLOCKED by the reason that stopped AP2505_007 (no contract to reopen), per its Test Data.
- AutoShield refuses contract creation for two different test VINs — every remaining submit case would hit the same refusal.

### Resume testing when:

- The environment answers again and a login succeeds.
- AP-2518 is fixed and deployed to Dev.
- AutoShield accepts the test VINs again (or a VIN it accepts is named by the developer).

---

## 7. Test Environment

| Component | Details |
|---|---|
| Application URL | Dev (v2dev) dealer portal — base URL from the `env` source, "Dev Environment" section |
| Login | The shared dealer account (dealer 1380) from the `env` source; the password is read there at run time and never written into an artifact |
| Browsers | Chromium through playwright, viewport 1280 × 800 |
| Test data | A new inventory vehicle and a new quote per case — see §8 |
| Bug tracker | jira (`tracker`, CLI) |
| Screenshot path | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Dealer login | Shared dealer account (dealer 1380) | `env` source, Dev section |
| Inventory vehicle | A new Toyota Corolla 2022 per case, VIN `2T1BURHE0NC505{NNN}` where `{NNN}` is the case number (e.g. `…505007` for AP2505_007), 15000 km, Cylinders 4, Engine size 1.8 — made at `/vehicle/new/edit/PASSENGER` (`domain`, AP-2497 mapping). **Not vehicle 915**: its VIN already has AutoShield contracts 2697 and 2698, and AP-2518 was reproduced on it | `[Pre-Condition]` step; if the VIN is already in the inventory, add a letter-free suffix change (`…505{NNN}` → next free number) and record it |
| Quote with client | Entered from the new vehicle's details page → **Create quote** (the `fromVehicleId` entry — never the bare `/quote` entry, which returns HTTP 500 without a vehicle). Client email `client.stage.2505{NNN}@yopmail.com`, a fixed name, address, city, province Québec, postal code and two phones | `[Pre-Condition]` step |
| Delivery date and price on the quote vehicle | Today's date and 20000, set at `/quote/{id}/vehicle` (Dev requires a delivery date) | `[Pre-Condition]` step |
| Financing on the quote | AutoCapital Canada, Financing, 25,000, residual 0, Monthly, 60 months, 6.99 % — through "Add a financing" on the quote details page | `[Pre-Condition]` step; omitted only in AP2505_006 |
| GAP insurance quote | Gap Insurance row "+" → Rate table TGGAP, English, Tax exempt No, Gap Term 60 → **Get Quote** (needs the financing first) | `[Pre-Condition]` step in the AC 1 cases; omitted in AP2505_002 |
| Roadside product | Roadside Protection row "+" → Make Toyota, Model Corolla, Year 2022 → **Continue** → first tier → Policy Sale price 250 → **Save** | `[Pre-Condition]` step; tier name and price recorded |
| Quotes, vehicles and contracts of other tickets (e.g. AP-2498 vehicles 1106–1118, quotes 6514–6526; AP-2494 quotes 6479–6483) | Records reserved for other tickets | **Not used** |

### 8.1 Test Data Classification

_Decided once here, and inherited by every test case._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer login | Static | None applied | Named in Execution Context, resolved from `env` |
| Inventory vehicle | Dynamic | Q1 — does not exist yet; Q4 — AutoShield may tie a contract to one VIN, so one instance per case | Created per case with its own VIN. About 1 minute; left on Dev (no `cleanup` source) |
| Quote and client | Dynamic | Q1 — does not exist yet; Q2 — pre-fill assertions depend on the client values | Created per case. About 2 minutes; left on Dev |
| Delivery date / price on the quote vehicle | Dynamic | Q2 — pre-fill is compared with them | Set per quote in a `[Pre-Condition]` step |
| Financing | Dynamic | Q2 — financing pre-fill and read-only checks compare with it | Saved per quote |
| GAP insurance quote | Dynamic | Q2 — AC 1's given clause; Q1 — does not exist yet | Saved per quote where the case needs it; no GAP contract is generated |
| Roadside product | Dynamic | Q3 — consumed by a contract | Saved per quote; tier and price recorded |
| Generated roadside contract and invoice | Dynamic | Q3 — consumed; created by the submit cases | Left on Dev; every contract, invoice, quote and vehicle id is listed in the execution log |
| Dealer 1380's AutoShield configuration (lender id, products) | Configuration — read only | Q5 would apply only if a case changed it; none does | Never changed. No tiers offered → cases BLOCKED |

A quote that has not been submitted may be reused by the read-only cases of the same run
(AP2505_003, AP2505_004 and AP2505_005 never change it) — each case still spells out how
to build one when it is absent. A submitted quote is reused only by AP2505_010, which
tests that state.

**Cost:** each submitting case calls AutoShield, an outside service, and leaves a real
contract on the shared dealer account. Only AP2505_007 submits valid values by design;
AP2505_008 and AP2505_010 reuse its contract (AP2505_008 makes its own only if AP2505_007
made none), and AP2505_009 submits with an emptied field.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| AP-2518 — the page returns HTTP 500 on Dev | High | High | FAIL at the step under test in AP2505_001 step 3, AP2505_002 step 4 and AP2505_010 step 3 (Gate C compares with AP-2518); AP2505_006 step 3 FAIL only if the 500 is specific to the missing financing, else BLOCKED; BLOCKED naming AP-2518 at setup in AP2505_003 – _005 and _007 – _009 (step 2) — see §3.2 |
| Description and AC 2 contradict on the "Vehicle identification" column (Q-001, Blocking) | High | Medium | Posted on AP-2505 at Gate A; AP2505_004 BLOCKED; the agreed layout points are tested in AP2505_003 |
| "Current process" after submit has no Dev baseline (Q-009) | High | High | Judge only what `domain` records (contract id on the row, `/road-side-protection-contracts` row, details page with PDF links); record the landing page, message and invoice |
| AutoShield refuses a test VIN or a duplicate VIN (Q-010) | Medium | High | A fresh VIN per case; a refusal before the step under test is BLOCKED; a refusal at submit with a valid fresh VIN is recorded and compared at Gate C |
| AP-2508 — roadside product cannot be saved | Low | High | `domain` shows Save works on Dev after AP-2498; if it fails, BLOCKED naming AP-2508 |
| AC 1's GAP precondition (Q-002) | Medium | Low | AC 1 cases build the GAP quote literally; AP2505_002 records the no-GAP behaviour |
| Each submit leaves a real contract and invoice on the shared dealer account | High | Medium | Ids logged; only the submit cases create contracts |
| playwright unreachable | Low | High | Browser preflight before s4 |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-11-03 | Analysis | Requirements analysis | stlc-requirements-analyst |
| 2026-11-03 | Planning | Test plan design | stlc-test-plan-designer |
| 2026-11-03 | Design | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| Wave 2 of the QA batch | Execution | Manual test execution on Dev via playwright | stlc-manual-executor |
| Wave 2 | Reporting | Bug reporting + test report | stlc-bug-reporter, stlc-test-reporter |
| Wave 2 | Closure | Story comment and status per Gate D | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Run the STLC skills and write every artifact |
| QA Reviewer (stlc-qa-reviewer) | Approve gates A–D in place of the QA lead (`gate_mode: reviewer`) |
| Developer | Fix defects (AP-2518, AP-2508); confirm the post-submit behaviour (Q-009) |
| Product Owner (Nicolas-Eric Tain) | Answer the Blocking question Q-001 and the Judgement questions Q-002 – Q-010 |

---

## 12. Sign-off Checklist

- [x] Every requirement REQ-001 – REQ-004 is in scope with its test types
- [x] Entry and exit criteria are stated
- [x] Test data is classified and its cost stated
- [x] Risks have mitigations
- [x] Providers named from the registry (jira, playwright; notify disabled)
- [ ] Reviewed by QA Lead (reviewer mode — Gate B covers the cases)

---

## 13. Revisions

| Date | Section | Change | Why |
|---|---|---|---|
| 2026-11-03 | — | Version 1.0 — first version | — |
| 2026-11-03 | §3.2 | AP-2518 split stated per case and step (FAIL: 001 step 3, 002 step 4, 010 step 3; 006 step 3 only if specific to no financing; BLOCKED: 003–005 and 007–009 step 2), identical to both test-case files | Review R2 round 1, F-3 |
| 2026-11-03 | §6 | AP-2518 suspension rule excludes AP2505_002 (its step under test) and states how AP2505_006 and AP2505_010 end | Review R2 round 1, F-3 |
| 2026-11-03 | §9 | AP-2518 risk mitigation aligned with the §3.2 split | Review R2 round 1, F-3 |
