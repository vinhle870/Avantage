# Test Plan

**Plan ID:** TP-20261003-001
**Project:** Avantage Plus v2 — Admin portal, AP-2471: Admin: Earning Curve management
**Version:** 1.1 (re-run; 1.0 written 2026-10-03)
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2471_requirements-analysis.md
**Total requirements:** 8 (REQ-001 – REQ-008)

> **Gate A note — 2026-11-01.** Gate A was decided by rule A2 (reviewer R1, APPROVE): two of eight requirements have a Blocking question that is still open — Q-001 (REQ-007 Save) and Q-002 (REQ-008 Delete). The questions were posted again on AP-2471 (comment 19435) and testing continues. For REQ-007 this plan tests only what the user story itself promises: a saved curve is stored, listed and can be reopened. The save message, required fields and error display are recorded, never judged. The REQ-008 delete case stays **BLOCKED** until Q-002 is answered. Because both questions are open, the story cannot move to Ready for release in this cycle, whatever the pass rate.
>
> **What changed since version 1.0.** The ticket text is unchanged. This version: (1) applies the open-question Impact rules — every expected result that depends on a Judgement question (Q-004, Q-005, Q-006, Q-008, Q-009, Q-010) is now *record-only*, so validation cases fail only on an objective fault such as an error page or a lost value; (2) files results under run folder `no-sprint`; (3) takes routes and the Save button label from the `domain` source (`qa-docs/earning-curves.md`, mapped 2026-10-04); (4) notes the two bugs from the previous cycle, AP-2485 and AP-2486, which are in QC and are re-tested by their own tickets.

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify that all acceptance criteria in REQ-001 to REQ-006 are met under normal conditions, and that the minimum behaviour the user story promises for REQ-007 and REQ-008 holds.
2. Prove that the Pro-Rata, Rule of 78 and Reverse Rule of 78 factors match the ticket's formulas to 4 decimal places. These factors decide how much premium is booked as earned income, so a wrong digit is a financial misstatement.
3. Re-confirm the defect Ken Nguyen reported on 2026-09-24 stays fixed: Custom monthly factors save, and the cumulative column recalculates. The previous cycle (2026-10-04) found it fixed.
4. Record how the form handles invalid input (blank, zero, negative or out-of-range values). The ticket defines no validation, so these results are *record-only*: they feed the open questions and fail only on an objective fault (an error page, a lost value, a value stored differently from what was typed).
5. Exercise again the areas of the two bugs from the previous cycle, AP-2485 (12-month Pro-Rata keeps the previous type's factors) and AP-2486 (HTTP 500 on an empty Custom factor), through AP2471_004 and AP2471_014. Their own re-test runs decide those tickets.
6. Detect defects before the feature reaches production.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | "Earning Curves" menu item under Risk Management | Functional · UI · Regression |
| REQ-002 | Earning Curves list page | Functional · UI · Regression |
| REQ-003 | Create / Edit form fields and defaults | Functional · Negative · Edge-case · UI |
| REQ-004 | Earning points table follows Term month | Functional · Edge-case · UI |
| REQ-005 | Factor calculation for Pro-Rata, Rule of 78, Reverse Rule of 78 | Functional · Edge-case · Regression |
| REQ-006 | Custom type: editable monthly factors | Functional · Negative · Edge-case · Regression |
| REQ-007 | Saving a curve (create and edit) — minimum only | Functional · Negative · Regression |
| REQ-008 | Deleting a curve — presence check and minimum only | Functional |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| Earning Sets, Earning Groups, Earning Assignments | These are separate sidebar items under Risk Management. AP-2471 does not describe them. |
| Downstream use of a curve (income recognition on contracts, effect of "Is Enabled? = No") | No acceptance criterion describes it, and nothing in this ticket consumes a curve. |
| The "unearned factor" the description's code returns | No acceptance criterion asks the screen to show it. |
| Role-based access (non-admin or restricted admin) | Only one admin account is available, and the ticket names no roles (Q-011). |
| Performance, accessibility, API testing | Not suggested by the ticket. The project tests through the UI only (`api-baseline` is `missing` in the knowledge registry). |
| Deleting a curve that is in use by an Earning Set | No rule exists (Q-002). Deleting a curve other data depends on could damage shared staging data. |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end checks of the admin screens in a real browser on v2staging. | QA Agent |
| Integration Testing | Not applicable. The project has no API baseline, and the ticket defines no API contract. Save is checked through what the UI shows after a reload. | — |
| Regression Testing | Regression testing means re-checking that something that used to work still works. Here it re-checks the reported Custom-save defect and confirms the existing admin sidebar still loads. | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Execute each acceptance criterion step by step, and compare every computed factor against the oracle in §8.1. An oracle is the independent source of expected results. | playwright |
| Negative | Enter blank, zero, negative, non-numeric and inverted (from > to) values. Record whether the form refuses them and what message it shows. The ticket states no rule for any of them (Judgement questions Q-005, Q-006, Q-009), so a case passes when no objective fault occurs and the outcome is recorded for the question. | playwright |
| Edge-case | Use boundary value analysis, which tests the exact edges of an allowed range where off-by-one mistakes hide. Cases: Term month 1, 12 (default), 24 and 60, a Custom total of 100% compared with one under 100%, and the last-row rounding to 100%. | playwright |
| UI / Visual | Menu icon, page title, column headers and field types, checked against the accessibility snapshot and screenshots. | playwright screenshots |
| API | Not used. See §3.1. | — |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **playwright** (see `qa-artifacts/qa-config/tools.md`). The AI agent:
- Drives the browser step by step
- Takes screenshots as evidence
- Records PASS / FAIL / BLOCKED per step and per test case

Reading factor values: the executor reads the table cells from the page snapshot, or with `browser.evaluate` when a value sits inside an input box. It compares each one against §8.1 at the precision the page shows.

Capability groups this run needs (from `mcp-tools.md` §7):
- `browser` (playwright, `active`) is required for s4.
- `tracker` (jira via the CLI, `active`) is needed for bugs and the summary comment.
- `notify` is `disabled`, so no notification step runs.

---

## 4. Entry Criteria

_Entry criteria are what has to be ready before testing can usefully start. Starting before these are in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [ ] The application is deployed and reachable at `https://v2staging.garantieavantageplus.ca`, and the admin login works.
- [ ] `qa-artifacts/1-requirements-analysis/AP-2471_requirements-analysis.md` exists and has been reviewed. Gate A was passed on 2026-11-01 by rule A2.
- [ ] At least 1 `qa-artifacts/3-test-cases/AP2471_TestCases_*.md` file exists, with at least 10 test cases. That is enough to give every REQ at least one case and REQ-005 one case per type.
- [ ] The test environment is stable, with no known blocking infrastructure issues. The `agent-coordination` c2 health check passes.
- [ ] Test data is ready: the shared admin account resolves from the `env` source. Curves are created by the run itself (see §8).
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds.

---

## 5. Exit Criteria

_Exit criteria are what has to be true before we can say testing is finished and the release is safe to consider. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] All High-priority test cases have been executed. These are the cases for REQ-003 to REQ-007.
- [ ] Test pass rate ≥ **90%** of judged cases. 90% allows for one failing low-impact UI case without hiding a calculation defect, because any calculation failure is High and is covered by the next two lines.
- [ ] Zero **Critical** severity bugs remain open.
- [ ] **High** severity bugs ≤ **0** open. A wrong factor or a curve that does not save is a financial or blocking defect, so even one is a reason not to ship.
- [ ] `qa-artifacts/5-testing-report/AP-2471_test-report.md` has been generated and reviewed.
- [ ] All tracker tickets created in `qa-artifacts/5-testing-report/AP-2471_bug-report.md`.
- [ ] No `Blocking` question is still open. Today Q-001 and Q-002 are open, so this box cannot be ticked until Ken Nguyen answers them.

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and what has to be fixed before we pick it back up._

### Suspend testing when:
- Application is inaccessible for more than **30 minutes**
- More than **30%** of test cases are blocked by a single defect. For example, if Save fails for every type, every edit and persistence case is blocked.
- A **Critical** severity bug is found that prevents further execution

### Resume testing when:
- The blocking issue is resolved and confirmed by dev team
- Environment is stable for at least **15 minutes**
- A patch has been deployed addressing the blocking defect

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | `https://v2staging.garantieavantageplus.ca` — Admin Portal at `/admin/login`, list at `/admin/earning-curve`, create form at `/admin/earning-curve/new/edit`, edit form at `/admin/earning-curve/{id}/edit` (from the `env` source and the `domain` source `qa-docs/earning-curves.md`, mapped 2026-10-04) |
| **Browser** | Chromium (Playwright default), viewport 1280 × 800 (`admin_viewport` in tools.md) |
| **OS** | Windows 11 (the QA agent host) |
| **Application version** | Not known. The ticket carries no fix version or sprint, and the staging build number is not exposed. Results of this cycle are filed under run folder `no-sprint`. The previous cycle's results stay under `5.2.0`. |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/` |
| **Bug tracker** | jira (via `tools/jira-cli`) — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Admin account | The shared admin login from the `env` source. It has full admin rights. | Static — resolved from `qa-artifacts/base-test/execute.env.md` |
| Earning curve records | One curve per type the case needs. Each is named `QA-AP2471-<type>-<HHMM>` so it is unique and clearly marked as test data. | Created in each case's `[Pre-Condition]` step via **Create New** |
| Boundary inputs | Term month 1, 12, 24, 60, 0, −1 and blank. Odometer from 0 / to 100000, and from 50000 / to 10000 (inverted). Custom factors that total exactly 100% and ones that total 90%. | Typed inline in the step |

### 6.1 Test Data Classification

_Decided once here, and inherited by every test case. `stlc-testcase-designer` reads this table instead of re-deriving it, and puts Static values in the Execution Context, Dynamic values in a `[Pre-Condition]` step, and Configuration values in a change-then-restore pair._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Admin login (`env` source) | Static | None applied | Named in the Execution Context and resolved from `env`. |
| An earning curve to view, edit or delete | Dynamic | Q1 — it does not exist yet. Q2 — the assertions depend on its Term month and type. | Created in a `[Pre-Condition]` step with explicit field values. |
| Earning curve created as the result of a test | Dynamic | Q1 — the case creates it. | Created by the case's own steps, with a unique `QA-AP2471-…` name. |
| Admin sidebar / Risk Management menu | Static | None applied | Read only. |
| Existing earning curves made by other people | Static (read only) | None applied | Never edited or deleted by this run. They are only observed in the list. This includes the seeded curves 1–6, the AP-2472 curves 7–8 and the curves left by the previous AP-2471 cycle (ids 9–13, per `qa-docs/earning-curves.md`). Curve 13 holds AP-2485's evidence and must not be touched. |

**Cost of the Dynamic items:** creating a curve takes about 30 seconds through the form and calls no third party. Each run leaves its `QA-AP2471-…` curves on staging, because the `cleanup` source is `missing`. Where the build offers a delete action, the REQ-008 case deletes only a curve it created itself. One saved curve per type may be reused across the read-only cases of a run, but every case still states how to create one when it is absent.

### 8.1 Calculation oracle

These values come from the ticket's own formulas, computed independently. They are the expected values for REQ-005. Monthly factors are shown to 4 decimals and cumulative factors to 2, as percentages. If the app shows fractions instead, divide by 100 and compare at the precision the page shows — 8.3333% is 0.0833 at 4 decimals. Which scale is right is Judgement question Q-004, so the scale itself is recorded, never failed; only a value that differs from the oracle on the scale the page uses is a failure.

**12 months** (Term month default):

| m | Pro-Rata monthly | Pro-Rata cumul. | Rule of 78 monthly | Rule of 78 cumul. | Reverse monthly | Reverse cumul. |
|---|---|---|---|---|---|---|
| 1 | 8.3333 | 8.33 | 15.3846 | 15.38 | 1.2821 | 1.28 |
| 2 | 8.3333 | 16.67 | 14.1026 | 29.49 | 2.5641 | 3.85 |
| 3 | 8.3333 | 25.00 | 12.8205 | 42.31 | 3.8462 | 7.69 |
| 4 | 8.3333 | 33.33 | 11.5385 | 53.85 | 5.1282 | 12.82 |
| 5 | 8.3333 | 41.67 | 10.2564 | 64.10 | 6.4103 | 19.23 |
| 6 | 8.3333 | 50.00 | 8.9744 | 73.08 | 7.6923 | 26.92 |
| 7 | 8.3333 | 58.33 | 7.6923 | 80.77 | 8.9744 | 35.90 |
| 8 | 8.3333 | 66.67 | 6.4103 | 87.18 | 10.2564 | **46.15** ← ticket example wrongly shows 53.85 |
| 9 | 8.3333 | 75.00 | 5.1282 | 92.31 | 11.5385 | 57.69 |
| 10 | 8.3333 | 83.33 | 3.8462 | 96.15 | 12.8205 | 70.51 |
| 11 | 8.3333 | 91.67 | 2.5641 | 98.72 | 14.1026 | 84.62 |
| 12 | 8.3333 | 100.00 | 1.2821 | 100.00 | 15.3846 | 100.00 |

**24 months** (spot rows; denominator 300):

| m | Pro-Rata monthly / cumul. | Rule of 78 monthly / cumul. | Reverse monthly / cumul. |
|---|---|---|---|
| 1 | 4.1667 / 4.17 | 8.0000 / 8.00 | 0.3333 / 0.33 |
| 2 | 4.1667 / 8.33 | 7.6667 / 15.67 | 0.6667 / 1.00 |
| 12 | 4.1667 / 50.00 | 4.3333 / 74.00 | 4.0000 / 26.00 |
| 23 | 4.1667 / 95.83 | 0.6667 / 99.67 | 7.6667 / 92.00 |
| 24 | 4.1667 / 100.00 | 0.3333 / 100.00 | 8.0000 / 100.00 |

**Other boundaries:**
- Term month 1: every type gives a single row of 100.0000 / 100.00.
- Term month 60: Pro-Rata 1.6667 per month. The smallest Rule-of-78 factor (m = 60) and the smallest Reverse factor (m = 1) are both 0.0546% (0.0005 as a 4-decimal fraction).

**Rounding tolerance:** 12 × 8.3333 = 99.9996, and 24 × 4.1667 = 100.0008. The ticket's own example shows the last row at 100.00%, so a final cumulative that reads 100.00 at the example's 2-decimal precision (that is, within **±0.01** percentage points, or 1.0000 as a fraction) passes. *How* the build reaches 100% — an adjusted last factor or display rounding — is Judgement question Q-008: record the exact value, never fail on it.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| Unstable test environment. Staging is shared and was last verified on 2026-09-01. | Medium | High | Run the c2 health check before s4, and stop if it fails. |
| Missing or incomplete test data | Low | Medium | Every case creates its own curve, so nothing depends on pre-existing records. |
| Ambiguous ACs in REQ-007 and REQ-008. Save and Delete have no criteria (Gate A was passed anyway). | High | High | Test only the user-story minimum, label everything else an observation, and state the gap in the test report. A green result here does not mean Save is fully specified. |
| The ticket's example table is wrong at Reverse row 8, so a tester following the table would raise a false bug. | High | Medium | Use the §8.1 oracle computed from the formulas, never the ticket's table. |
| Custom save was reported broken (2026-09-24) and found fixed on 2026-10-04. If it breaks again, the Custom edit and persistence cases are blocked. | Low | High | Run the Custom save case first among the Custom cases. If it fails, record the dependent cases BLOCKED with that reason rather than FAIL. |
| AP-2485 (High) — a 12-month curve switched back to Pro-Rata keeps the previous type's factors — was open in QC on 2026-11-01. If it is not fixed, AP2471_004 fails again on the same defect. | Medium | High | At Gate C, link the failure to AP-2485 (rule C2) rather than filing a new bug. |
| AP-2486 (Medium) — saving a Custom curve with an empty factor box gives HTTP 500 — was open in QC on 2026-11-01. | Medium | Medium | AP2471_014 records it; at Gate C link it to AP-2486. |
| Test curves accumulate on staging, because no cleanup source exists. | High | Low | Use the `QA-AP2471-` prefix so they are easy to find, and delete them where a delete action exists. |
| playwright unreachable, or the browser profile is locked by a leftover Chrome (seen on 2026-09-13). | Low | High | Run the preflight before starting. Kill the stale `mcp-chrome` process if the browser reports "already in use". |
| Factor cells are input boxes, so their value is not in the page's text. | Medium | Medium | Read the values with `browser.evaluate` (input `.value`), not from the visible text. |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-11-01 | Analysis | Requirements analysis (re-run) | stlc-requirements-analyst |
| 2026-11-01 | Planning | Test plan design (this version) | stlc-test-plan-designer |
| 2026-11-01 | Design | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| Wave 2 of the QA batch | Execution | Manual test execution via playwright | stlc-manual-executor |
| Wave 2 of the QA batch | Reporting | Bug reporting + ticket creation (after Gate C) | stlc-bug-reporter |
| Wave 2 of the QA batch | Reporting | Test report generation | stlc-test-reporter |
| Wave 2 of the QA batch | Closure | Tracker ticket update (Gate D) | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Runs every STLC stage for AP-2471 and generates all artifacts. |
| QA Lead / Human reviewer (Vinh Le) | Approves the sign-off checklist. In this cycle Gates A–D are decided by the `stlc-qa-reviewer` (`gate_mode: reviewer`). |
| Developer (Minh Lưu) | Fixes defects, answers Q-004 and Q-008, and confirms fixes before a re-test. |
| Product Owner (Ken Nguyen) | Answers the open questions, especially Q-001 (Save) and Q-002 (Delete), and approves the exit criteria. |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%, zero open High bugs)
- [ ] Risk mitigations acknowledged by team
