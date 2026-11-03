# Test Plan

**Plan ID:** TP-20261101-001
**Project:** Avantage Plus v2 — AP-2428 Dealer Permaplate Contract
**Version:** 1.0
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2428_requirements-analysis.md
**Total requirements:** 8

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify that a dealer can open the Permaplate contract form from a quote that has a Permaplate selection, and that the form shows the vehicle, owner and program information described in REQ-001 to REQ-004.
2. Confirm that submitting the form with Generate Contract creates the contract, returns the dealer to the quote details page and offers a PDF download (REQ-006, REQ-007).
3. Record — without judging — what the form shows for prices and taxes until the three Blocking questions (Q-001 to Q-003) are answered (REQ-002 Year, REQ-005).
4. Confirm that an existing contract keeps its own option values after an administrator changes an option price (REQ-008).
5. Check whether the two failures the QA account reported on the ticket (2026-08-14 no contract shown, 2026-08-18 error on Generate Contract) still occur on the current build.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | Create contract button on the quote page | Functional · Negative · UI |
| REQ-002 | Vehicle information prefilled | Functional · Edge-case · UI |
| REQ-003 | Owner information prefilled | Functional · Negative · UI |
| REQ-004 | Program summary, display only | Functional · UI |
| REQ-005 | Pricing: cost, retail, subtotal, taxes, grand total | Functional · Edge-case (record-only until Q-002/Q-003 are answered) |
| REQ-006 | Generate Contract submit and redirect | Functional · Negative · Regression |
| REQ-007 | Contract PDF download | Functional · UI |
| REQ-008 | Contract keeps its own option values | Regression · Edge-case |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| Database tables (`permaplate_contract_option`, cost/retail/tax storage) | The project tests through the UI only; REQ-008 is checked by its visible effect instead. |
| The PDF library (HTMLtoPDF vs Zend_PDF) | An implementation choice with no user-visible result (Q-012). |
| Invoice raised on contract creation, contract lists, PDF conditions pages | Covered by AP-2446, AP-2443/AP-2448 and AP-2445. They are noted if seen, not tested. |
| Performance and accessibility | No requirement in the ticket asks for them. |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end dealer flow in the browser: quote → contract form → Generate Contract → PDF | QA Agent |
| Integration Testing | N/A — no API is described; the contract is checked through the UI and the downloaded PDF | — |
| Regression Testing | REQ-008: an existing contract is not changed by a later admin price change | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Execute each acceptance criterion step by step, comparing prefilled values with the quote's client and vehicle | playwright |
| Negative | Empty required-looking fields and submit; record the behaviour (validation is not specified — Q-006) | playwright |
| Edge-case | Quote with no Permaplate selection; quote whose contract was already generated; record-only (Q-005) | playwright |
| UI / Visual | Screenshot of each form section and the quote details page after submit | playwright screenshots |
| API | N/A — not in scope | — |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **playwright** (see `qa-artifacts/qa-config/tools.md`). The AI agent:
- Drives the browser step by step
- Takes screenshots as evidence
- Records PASS / FAIL / BLOCKED per step and per test case

Expected results that depend on a *Judgement* question are **record-only**: the test writes down what the build does and does not pass or fail on it. Steps that depend on a *Blocking* question (Q-001, Q-002, Q-003) are designed BLOCKED.

---

## 4. Entry Criteria

_What has to be ready before testing can usefully start. Starting before these are
in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [ ] Application is deployed and accessible at `https://v2staging.garantieavantageplus.ca`
- [ ] `AP-2428_requirements-analysis.md` exists and Gate A has been decided
- [ ] At least 8 `AP2428_TestCases_*.md` test cases exist, one per requirement
- [ ] Test environment is stable (the environment health check passes)
- [ ] Dealer 1380 has at least one Permaplate product linked (link one at `/admin/dealer/1380/permaplate/link` if not; restore afterwards)
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds

---

## 5. Exit Criteria

_What has to be true before we can say testing is finished and the release is safe
to consider. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] All High-priority test cases have been executed
- [ ] Test pass rate ≥ **90%** — the project's `story_pass_threshold`, counted over all cases except SKIPPED
- [ ] Zero **Critical** severity bugs remain open
- [ ] **High** severity bugs ≤ 0 open — a High bug on a contract-creating flow means clients receive a wrong contract
- [ ] `AP-2428_test-report.md` has been generated and reviewed
- [ ] All tracker tickets created in `AP-2428_bug-report.md`

The story cannot move to *Ready for release* while Q-001, Q-002 or Q-003 is open, whatever the pass rate, because REQ-002 (Year) and REQ-005 are then never judged.

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and
what has to be fixed before we pick it back up._

### Suspend testing when:
- Application is inaccessible for more than **30 minutes**
- More than **30%** of test cases are blocked by a single defect — for example, if Generate Contract still returns an error (the QA report of 2026-08-18), REQ-006, REQ-007 and REQ-008 cannot run
- A **Critical** severity bug is found that prevents further execution
- The create-contract button does not appear at all on a quote with a Permaplate selection (the QA report of 2026-08-14)

### Resume testing when:
- The blocking issue is resolved and confirmed by dev team
- Environment is stable for at least **15 minutes**
- A patch has been deployed addressing the blocking defect

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | `https://v2staging.garantieavantageplus.ca` (from `env`) |
| **Browser** | Chromium (Playwright default), viewport 1280 × 800 |
| **OS** | Windows 11 (the QA workstation) |
| **Application version** | Not known — no build number is shown in the UI; fix version on the ticket is 5.0.0 |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/` |
| **Bug tracker** | jira — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Dealer login | `vinhle870@gmail.com`, Dealer ID 1380, province QC | From `env` |
| Admin login | Same account at `/admin/login` | From `env` |
| Vehicle | Vehicle 915 — Ford Focus 2008, VIN `1FAHP35NX8W239204`, 5000 km | From `test-data` |
| Client | A new client with last name, first name, company, address, city, province, postal code, two phone numbers and a fresh `client.stage.NNN@yopmail.com` email | Created in a `[Pre-Condition]` step |
| Permaplate quote | A quote for that client with vehicle 915 and a Permaplate product and at least one option saved at `/quote/{id}/permaplate` | Created in a `[Pre-Condition]` step |
| Permaplate product link | Dealer 1380 must have a linked product | Checked, linked if missing, restored at the end |
| Permaplate option price | One option's Dealer Cost, changed and restored by the REQ-008 case | Changed in the case, restored in the same case |

### 8.1 Test Data Classification

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer login / admin login | Static | None applied | Named in Execution Context, resolved from `env` |
| Vehicle 915 | Static | None applied — its make, model, VIN and km are recorded in `test-data` | Named in Execution Context; prefill assertions use the recorded values |
| Client with all owner fields | Dynamic | Q2 — the owner-prefill assertions depend on the values set at creation | Created in a `[Pre-Condition]` step with every field value written in the case; about 1 minute; leaves a client record |
| Permaplate quote | Dynamic | Q3 — generating the contract consumes the quote (the create-contract path may close afterwards) | Created per case that generates a contract; about 2 minutes; leaves a quote |
| Permaplate contract | Dynamic | Q1 — does not exist until the case creates it | Created by Generate Contract; leaves a contract and an invoice (AP-2446) on staging |
| Dealer 1380 Permaplate product link | Configuration | Q5 — shared configuration the feature needs | Recorded, linked if absent, restored inside the same case |
| Permaplate option Dealer Cost | Configuration | Q5 — REQ-008 changes shared configuration | Original recorded, changed, restored inside the same case |

**Cost of Dynamic data:** each contract-generating case leaves a client, a quote, a Permaplate contract and an automatically raised invoice on staging. None calls a third party. The prefill cases (REQ-002 to REQ-005) can share one quote, opened without submitting; only REQ-006, REQ-007 and REQ-008 generate a contract.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| Unstable test environment | Medium | High | Run the environment health check before execution |
| Generate Contract still errors (QA comment 2026-08-18, no reply) | High | High | Run REQ-006 first; if it fails, record it and suspend dependent cases per §6 |
| No Permaplate product linked to dealer 1380 (the last run left it unlinked) | High | High | Pre-condition step checks and links one, then restores |
| Year prefill, tax rules and the AP-2456 retail conflict are unanswered (Q-001–Q-003) | High | Medium | Questions posted on AP-2428 (comment 19434); affected steps BLOCKED; story not released while open |
| Changing an option's Dealer Cost affects other tickets' tests | Medium | Medium | Restore the original value inside the same case and record both values |
| Example PDFs exist only as attachments | Medium | Low | PDF content checks are record-only (Q-010) |
| playwright unreachable | Low | High | Run the preflight before starting; reconnect if needed |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| Day 1 | Analysis | Requirements analysis | stlc-requirements-analyst |
| Day 1 | Planning | Test plan design | stlc-test-plan-designer |
| Day 1 | Design | Test case design and peer review | stlc-testcase-designer · stlc-testcase-reviewer |
| Day 2 | Execution | Manual test execution via playwright | stlc-manual-executor |
| Day 2 | Reporting | Bug reporting + ticket creation | stlc-bug-reporter |
| Day 2 | Reporting | Test report generation | stlc-test-reporter |
| Day 2 | Closure | Tracker ticket update | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Execute the STLC skills, generate all artifacts |
| QA Lead / Human reviewer | Review artifacts, approve sign-off checklist (in this project, `stlc-qa-reviewer` decides the gates) |
| Developer (Minh Lưu) | Fix defects; confirm fixes before re-test |
| Product Owner (Ken Nguyen) | Answer Q-001 to Q-003 and the Judgement questions; approve exit criteria |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%)
- [ ] Risk mitigations acknowledged by team
