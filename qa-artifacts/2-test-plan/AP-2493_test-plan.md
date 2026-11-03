# Test Plan

**Plan ID:** TP-20261101-AP2493
**Project:** Avantage Plus v2 — Dealer portal, Quote Details page: cancelling a product (Jira AP-2493)
**Version:** 1.0
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2493_requirements-analysis.md
**Total requirements:** 3

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify that the acceptance criteria of REQ-001 to REQ-003 are met on staging: a cancel action is offered on every non-finalized product of the five types in scope, the dealer must confirm in a modal, and a confirmed cancellation removes the product, frees its slot and lowers the Subtotal by the product's amount.
2. Confirm the safe paths: declining or dismissing the modal changes nothing, and a finalized product (one with a generated contract) offers no cancel action and keeps its download action.
3. Confirm that cancelling one product leaves the other products on the same quote untouched (regression).
4. Record, without judging, what the build does on the points the ticket leaves open (Q-002 to Q-008): the action label, the modal wording, the success message, archived quotes, the Subtotal's source amount, financing, and GAP/creditor interaction.
5. Detect defects before the feature reaches production.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | Cancel action offered only for a non-finalized product (5 product types) | Functional · Negative · Regression · UI |
| REQ-002 | Confirmation modal: confirm applies, decline or dismiss changes nothing | Functional · Negative · UI |
| REQ-003 | Confirmed cancellation: product gone, add (+) back, new product creates a new row, Subtotal lowered | Functional · Edge-case · Regression · UI |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| Cancelling a finalized product | The description says finalized products "are out of scope for cancellation here"; only the absence of the cancel action is checked (REQ-001 regression). |
| Verifying the database row is physically deleted | QA has no database access on staging. The visible effects (row gone after reload, slot free, new values on re-add) are tested instead, and the report says so. |
| Financing recalculation and GAP-to-creditor premium effects as pass/fail checks | The ticket does not state them (Q-006, Q-007). They are recorded only. |
| Admin portal, client portal and contract list pages | The ticket changes the dealer Quote Details page only. |
| Performance, accessibility and API testing | Not asked for by the ticket; the feature is a single page action. |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end in the Dealer portal on staging: add a product, cancel it, confirm the effects | QA Agent |
| Integration Testing | N/A — no API is exposed to QA for this feature | — |
| Regression Testing | Other products on the same quote and finalized products keep their behaviour; re-verification after any fix | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Execute each acceptance criterion step by step, one product type per case for AC 1 | playwright |
| Negative | Decline / dismiss the modal; a finalized product shows no cancel action | playwright |
| Edge-case | Two products on one quote, cancel one; cancel then re-add the same type; reload after cancel | playwright |
| UI / Visual | Screenshot of the action, the modal and the page after confirm; record labels and messages | playwright screenshots |
| API | N/A — not in scope | — |

A *regression* check confirms something that worked before still works. A *smoke test* is
the quick environment check (log in, open a quote) run before the cases.

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **playwright** (`mcp__playwright__*`, see `qa-artifacts/qa-config/tools.md`). The AI agent:
- Drives the browser step by step
- Takes screenshots as evidence under `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/`
- Records PASS / FAIL / BLOCKED per step and per test case

Capability groups the pipeline needs: `tracker` (jira, active), `browser` (playwright,
active). `notify` is `disabled` — no notification is sent, which does not affect testing.

---

## 4. Entry Criteria

_What has to be ready before testing can usefully start. Starting before these are
in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [ ] Staging (`env` source — v2staging) is reachable and the shared dealer account (dealer 1380) can log in
- [ ] **Build check:** the AP-2493 change is deployed — on a quote with an unfinalized product, the product row offers a cancel/delete action. The ticket's pull request was merged on 2026-10-26, but deployment to staging is not confirmed. If no cancel action exists on any product, every case is BLOCKED with "build does not contain AP-2493", not FAIL
- [ ] `AP-2493_requirements-analysis.md` exists and Gate A is approved
- [ ] At least 8 test cases exist in `AP2493_TestCases_*.md`
- [ ] Test environment is stable (no known blocking infrastructure issues)
- [ ] Test data: a quote created through the `fromVehicleId` entry point (vehicle 915) — see §8
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds

---

## 5. Exit Criteria

_What has to be true before we can say testing is finished and the release is safe
to consider. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] All High-priority test cases have been executed
- [ ] Test pass rate ≥ **90%** — the registry's `story_pass_threshold`; below it the story stays in QC
- [ ] Zero **Critical** severity bugs remain open
- [ ] **High** severity bugs: 0 open — a High bug here would mean a product can be lost or misquoted, which blocks release
- [ ] `qa-artifacts/5-testing-report/AP-2493_test-report.md` has been generated and reviewed
- [ ] Every FAIL is filed, linked or dismissed in `qa-artifacts/5-testing-report/AP-2493_bug-report.md`

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and
what has to be fixed before we pick it back up._

### Suspend testing when:
- Application is inaccessible for more than **30 minutes**
- More than **30%** of test cases are blocked by a single defect
- A **Critical** severity bug is found that prevents further execution (for example, cancelling one product deletes another)
- The build check fails (no cancel action anywhere) — the build does not contain the change

### Resume testing when:
- The blocking issue is resolved and confirmed by dev team
- Environment is stable for at least **15 minutes**
- A patch has been deployed addressing the blocking defect

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | Staging (v2staging) — resolved from the `env` knowledge source (`qa-artifacts/base-test/execute.env.md`) |
| **Browser** | Chromium (Playwright default), viewport 1280 × 800 |
| **OS** | Windows 11 (QA workstation) |
| **Application version** | Not known — staging shows no build number; the build check in §4 stands in for it |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/` |
| **Bug tracker** | jira — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Dealer account | Shared dealer account, dealer 1380 ("Test QA staging") | `env` source; credentials from `/.env` / `execute.env.md`, never copied into artifacts |
| Test quote | A fresh quote per case, created through `/vehicle/915/details` → "Create quote" (`fromVehicleId`), so the Details page loads (the bare `/quote/new/client` route returns HTTP 500) | `[Pre-Condition]` step in each case |
| Non-finalized products | One product of the type under test added through its quote stage without generating a contract: warranty `/quote/{id}/warranty/edit`, Roadside `/quote/{id}/road-side-protection`, Permaplate `/quote/{id}/permaplate`, creditor insurance `/quote/{id}/insurance`, GAP — route to be read from the Details page (not mapped) | `[Pre-Condition]` step |
| Finalized product | A product with a generated contract (e.g. a Permaplate or Chubb creditor contract) | `[Pre-Condition]` step that generates the contract; a contract cannot be removed afterwards |
| Archived quote | Any quote in the `/quotes` Archived tab | Read from the list at run time; record-only check |

### 8.1 Test Data Classification

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer login (dealer 1380) | Static | None applied | Named in Execution Context, resolved from `env` |
| Vehicle 915 | Static | None applied — read only, used as the quote's vehicle | Named in Execution Context, from `test-data` |
| Test quote | Dynamic | Q3 — the run consumes it (products are added and deleted) | Created in a `[Pre-Condition]` step via the `fromVehicleId` entry point. About 1 minute; no third party; the quote is left on staging (quotes cannot be deleted) |
| Non-finalized product on the quote | Dynamic | Q1 — does not exist yet | Added in a `[Pre-Condition]` step with its values recorded. Cancelled by the case itself, so nothing is left behind except the quote |
| Finalized product (with contract) | Dynamic | Q1 — does not exist yet | Created in a `[Pre-Condition]` step. Generating a Chubb contract calls a third party (~5 s) and leaves a contract on staging; prefer Permaplate if its contract can be generated from the quote |
| Archived quote | Static | None applied — read only | Taken from the `/quotes` Archived tab at run time |
| Dealer Chubb configuration | Configuration | Q5 — only if a GAP or creditor product cannot be added with the current setting | Not changed by default. If a change is needed, record the original, change, restore in the same case |

Each Dynamic quote costs one leftover quote on staging. One quote may hold several cases
only when a case's end state is the next case's start state; each case still says how to
create its quote when absent.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| Unstable test environment | Medium | High | Run the environment check (login + open quote) before execution |
| The build on staging does not yet contain AP-2493 (PR merged 2026-10-26; deployment unconfirmed) | Medium | High | Build check in §4; cases BLOCKED, not FAIL, if the action is absent everywhere |
| GAP insurance has no mapped quote stage, and GAP/creditor products depend on the dealer's Chubb configuration | High | Medium | Read the add route from the Details page at run time; record a product that cannot be added as BLOCKED with the reason |
| Saving Roadside may generate its contract at once ("Save and Generate Contract"), so a non-finalized Roadside product may be impossible | Medium | Medium | Record the row state after save; BLOCKED with the reason if it is finalized at once |
| Database deletion not observable | High | Low | Verify visible effects only and say so in the report |
| Ambiguous points in REQ-001–REQ-003 (Q-002 to Q-008) | High | Low | Record-only expected results; questions go to the author in the s7 comment |
| playwright unreachable | Low | High | Run the preflight before starting; reconnect if needed |
| Leftover quotes and contracts on the shared dealer account | High | Low | Name each created quote `QA-AP2493-<time>` where a name is possible, and list them in the execution log |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-11-01 | Analysis | Requirements analysis | stlc-requirements-analyst |
| 2026-11-01 | Planning | Test plan design | stlc-test-plan-designer |
| 2026-11-01 | Design | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| Wave 2 (one ticket at a time) | Execution | Manual test execution via playwright | stlc-manual-executor |
| Wave 2 | Reporting | Bug reporting + ticket creation | stlc-bug-reporter |
| Wave 2 | Reporting | Test report generation | stlc-test-reporter |
| Wave 2 | Closure | Tracker ticket update | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Execute the STLC skills, generate all artifacts |
| QA Reviewer (stlc-qa-reviewer) | Approve Gates A–D in reviewer mode |
| Developer (Minh Lưu) | Fix defects; confirm fixes before re-test |
| Product Owner (Nicolas-Eric Tain, reporter) | Answer Q-002 to Q-008; approve exit criteria |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%)
- [ ] Risk mitigations acknowledged by team
