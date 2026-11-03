# Test Plan

**Plan ID:** TP-20261101-AP1381
**Project:** Avantage Plus v2 — Billing & Payments, dealer invoice "TO" section (Jira AP-1381)
**Version:** 1.0
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-1381_requirements-analysis.md

---

## 1. Test Objectives

- Verify that a dealer invoice opened in the Dealer portal shows the dealer's name only once in its TO section (the block naming who the invoice is addressed to), as REQ-001 requires.
- Verify that the same invoice opened in the Admin portal shows the dealer's name only once, as REQ-002 requires.
- Confirm that the single name shown is the dealer's *Name value, as the reporter stated on 2022-08-03 ("the *Name is what will appear in the invoice"), using a dealer whose *Name and company values differ so the two can be told apart.
- Record, without passing or failing on it, how the PDF copy of the invoice shows the name (Q-003), and whether any invoice created before the fix still shows the duplicate (Q-002).

---

## 2. Scope

### 2.1 In Scope

| Requirement | Test Types |
|---|---|
| REQ-001 — Dealer portal invoice shows the dealer's name only once | Functional, UI, Regression |
| REQ-002 — Admin portal invoice shows the dealer's name only once | Functional, UI, Regression |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| Invoice amounts, line items, taxes and payment | The ticket is about the name only; nothing else on the invoice is described. |
| Correcting invoices created before the fix | The developer comment of 2022-09-15 says they cannot be changed, and the reporter accepted it ("ok good to go"). Observed only, as a record (Q-002). |
| Emailed invoice copies | No email of an invoice is mentioned in the ticket or the knowledge base; not reachable without a payment flow. |
| Negative tests | The change has no user input, so there is nothing invalid to enter. |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Description | Responsible |
|---|---|---|
| System testing | The invoice is opened in each portal through the browser and its TO section is read on screen. | QA Agent |
| Regression | The rest of the TO section (address and contact lines) is checked to still be present after the duplicate line was removed. Regression means checking that the fix did not break something that used to work. | QA Agent |

### 3.2 Test Types

| Type | Approach |
|---|---|
| Functional | Read the dealer's *Name and company values from Dealer Details in the Admin portal, then open an invoice for that dealer and count how often each value appears in the TO section. |
| UI | Screenshot the TO section in each portal as evidence. |
| Edge-case | Use dealer 1380, whose *Name ("Offical VinhLe870@gmail.com") and company ("Test QA staging") differ, so the result shows which value the invoice uses. Open the PDF copy of the invoice when the page offers one, and record what it shows (record-only, Q-003). |
| Regression | Confirm the dealer's address block in the TO section is still shown. |

### 3.3 Test Execution Method

All manual test cases will be executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, `playwright` (`mcp__playwright__*`), as set in `qa-artifacts/qa-config/tools.md` §1. The agent navigates the browser, captures screenshots as evidence and logs step results. Bugs and ticket comments go through the `tracker` provider, `jira`, via the `tools/jira-cli` wrapper. `notify` is disabled and is not needed.

---

## 4. Entry Criteria

- [ ] v2staging (`https://v2staging.garantieavantageplus.ca`) is reachable and the shared login works in both portals.
- [ ] `qa-artifacts/1-requirements-analysis/AP-1381_requirements-analysis.md` passed Gate A (no Blocking question open).
- [ ] Test cases `AP1381_TestCases_*.md` exist and passed Gate B.
- [ ] Dealer 1380 has at least one invoice on `/invoice`, or one can be created in a pre-condition step.

---

## 5. Exit Criteria

- [ ] Every test case has been executed and has a status other than Not Run.
- [ ] No open Critical or High-severity bug against AP-1381.
- [ ] Pass rate ≥ 90 % (the registry's `story_pass_threshold`), counted over all cases except SKIPPED.
- [ ] `qa-artifacts/5-testing-report/AP-1381_test-report.md` written.

---

## 6. Suspension & Resumption Criteria

### Suspend testing when:

- v2staging is unreachable or returns HTTP 5xx for more than 30 minutes.
- No invoice can be found or created for the test dealer — every case depends on one.

### Resume testing when:

- The environment answers again and the login works.
- An invoice for the test dealer exists.

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | `https://v2staging.garantieavantageplus.ca` (from the `env` source, `execute.env.md`) |
| **Browser** | Chromium (Playwright default), 1280 × 800 |
| **OS** | Windows 11 (QA workstation) |
| **Application version** | Not known — v2staging build as deployed on the day of execution. The ticket's fix version is 1.25.0 (2022). |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/1.25.0/AP-1381/` |
| **Bug tracker** | `jira` — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Dealer / Admin login | The shared account `vinhle870@gmail.com`, which serves both portals | Static — from `execute.env.md` |
| Dealer 1380 | The dealership under test. *Name "Offical VinhLe870@gmail.com", company "Test QA staging" (verified 2026-09-01) | Static — values re-read from `/admin/dealer/1380/edit` in a pre-condition step, because the assertion depends on them |
| A dealer-1380 invoice | Any invoice for dealer 1380 created after the fix (2022-09-19) | Dynamic — see §8.1 |

### 8.1 Test Data Classification

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer / Admin login | Static | None applied | Named in the Execution Context, resolved from `env` |
| Dealer 1380 *Name and company values | Static | None applied — they are read, not changed | Read and recorded in a `[Pre-Condition]` step so the expected result uses the values as they are on the day |
| A dealer-1380 invoice | Dynamic | Q2 — the developer comment says the dealer's name is "stamped" on an invoice when it is created, so the assertion depends on creation-time values | Reuse the newest invoice on `/invoice` and record its number and date; when none exists, create one through a sale (a Permaplate sale raises an invoice, per AP-2446). Creating one leaves a quote, a contract and an unpaid invoice on staging. |

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| Unstable test environment | Medium | High | Run the environment check before execution. |
| The v2 invoice may not label its addressee block "TO", and the invoice page layout is not in the knowledge base (Billing is listed as not yet mapped) | High | Medium | Identify the addressee block at execution, record its real label, and write the Billing routes back to `qa-docs`. |
| The Admin portal route to a dealer's invoice is not known | High | Medium | Find it at execution from the admin sidebar; if no admin invoice view exists, mark the REQ-002 case BLOCKED with that reason rather than failing it. |
| The description says "company name" while the reporter's later comment says "*Name" | Medium | Medium | Expected results follow the reporter's later quoted answer (Q-001); both values are recorded so a reader can see which one the invoice shows. |
| No invoice exists for dealer 1380 and creating one is slow | Medium | Medium | Reuse an existing invoice; create one only when the list is empty. |
| `playwright` browser provider unreachable | Low | High | Run the preflight before starting; reconnect if needed. |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-11-01 | Analysis | Requirements analysis | stlc-requirements-analyst |
| 2026-11-01 | Planning | Test plan design | stlc-test-plan-designer |
| 2026-11-01 | Design | Test case design and review | stlc-testcase-designer, stlc-testcase-reviewer |
| Next execution slot | Execution | Manual test execution via `playwright` | stlc-manual-executor |
| After execution | Reporting | Bug reporting and test report | stlc-bug-reporter, stlc-test-reporter |
| After reporting | Closure | Tracker ticket update | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Execute the STLC skills and write every artifact |
| QA reviewer (`stlc-qa-reviewer`) | Approve each gate in place of a manual review (`gate_mode: reviewer`) |
| Developer | Fix defects and confirm fixes before re-test |
| Eric Lindquist (reporter) | Answer the open questions Q-002 and Q-003 |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [x] Exit criteria thresholds agreed (pass rate ≥ 90%)
- [ ] Risk mitigations acknowledged by team
