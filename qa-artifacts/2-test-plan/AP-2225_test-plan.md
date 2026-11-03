# Test Plan

**Plan ID:** TP-20261101-AP2225
**Project:** Avantage Plus v2 — Dealer portal, Quote › Road Side Protection (AutoShield contract) (Jira AP-2225)
**Version:** 1.0
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2225_requirements-analysis.md
**Total requirements:** 6

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify all acceptance criteria in REQ-001 to REQ-006 are met for a dealer quote that has a vehicle, a client and a financing company.
2. Confirm that the Road side protection page shows AutoShield products with prices, and that its vehicle and client fields are prefilled with the quote's data, using the defaults the reporter stated on 2025-04-14.
3. Confirm that Save keeps the dealer's entries on the autoShield quote without changing the vehicle quote itself.
4. Confirm that Generate Contract produces an autoShield contract page showing the AutoShield contract ID, the 17 contract fields and a working PDF link — the only visible proof that the backend login, lender check and contract creation worked.
5. Record, without judging, how the build behaves on every point the ticket leaves open (Judgement questions Q-001 to Q-009), so the reporter can answer them from facts.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | AutoShield products and pricing on the Road side protection page | Functional · UI · Regression |
| REQ-002 | Vehicle and client fields prefilled from the quote | Functional · Edge-case · UI |
| REQ-003 | 'Generate Contract' button, English and French labels | UI · Regression |
| REQ-004 | Save stores the data in the autoShield quote, separate from the vehicle's quote | Functional · Negative · Regression |
| REQ-005 | Generate Contract creates the contract at AutoShield | Functional · Negative (proven through REQ-006's visible result) |
| REQ-006 | The autoShield contract page and the PDF link | Functional · UI · Edge-case |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| Direct calls to the AutoShield login, create lender, create contract and get contract APIs | This project tests through the user interface only (`api-baseline` is declared not needed in the knowledge registry), and the AutoShield credentials are not QA's to use. The calls are proven by their visible result. |
| Correctness of AutoShield prices | Prices are calculated by AutoShield; the dealer portal only displays them. |
| Forcing AutoShield failures (login refused, AutoShield down) | QA cannot switch AutoShield off or change its credentials on staging. Any failure seen naturally is recorded (Q-005). |
| Creating the autoShield quote itself (AP-2188) and the autoshieldLenderID field (AP-2226) | Delivered by those tickets; used here as preconditions only. |
| The Road Side Protection contract list (`/road-side-protection-contracts`) | Not mentioned in this ticket (Q-012). |
| Performance, accessibility | No requirement states a target. |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end dealer flow in the browser: quote → Road side protection → Save → Generate Contract → contract page | QA Agent |
| Integration Testing | The AutoShield integration, observed only through the screens (contract ID and API fields appear on the contract page) | QA Agent |
| Regression Testing (re-checking that something which worked before still works) | The quote details hub and the vehicle quote data stay unchanged after Save on the Road side protection page; bug AP-2258 (Generate Contract showed the Quote Dashboard with an error) does not come back | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Execute each acceptance criterion step by step on a fresh quote | playwright |
| Negative | Save or generate with a required-looking field emptied; record the message shown (Q-004) | playwright |
| Edge-case | Quote with no delivery date and no financing, to check the "today if empty" and "sale price if empty" defaults; display of record-type fields | playwright |
| UI / Visual | Button label in English and French; presence and labels of the 17 contract fields; screenshots as evidence | playwright screenshots |
| API | Not executed directly — see §2.2. The contract ID and API field values on the contract page stand in for the API checks | — |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **playwright** (`mcp__playwright__*`, see `qa-artifacts/qa-config/tools.md`). The AI agent:
- Drives the browser step by step
- Takes screenshots as evidence
- Records PASS / FAIL / BLOCKED per step and per test case

The pipeline also needs `tracker` (jira, CLI — active) for questions, bugs and the result comment. `notify` is disabled, which is not a failure. `vcs` (github) is used only by automation after this plan.

---

## 4. Entry Criteria

_What has to be ready before testing can usefully start. Starting before these are
in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [ ] Application is deployed and accessible at `https://v2staging.garantieavantageplus.ca` (dealer login reachable)
- [ ] `qa-artifacts/1-requirements-analysis/AP-2225_requirements-analysis.md` exists and Gate A has passed
- [ ] `qa-artifacts/3-test-cases/AP2225_TestCases_*.md` exist with at least 8 test cases
- [ ] Test environment is stable (the environment health check before s4 passes)
- [ ] Test data is available: dealer 1380 can create a quote from vehicle 915 through the `fromVehicleId` entry point, and at least one financing company is selectable on the quote's financing page
- [ ] The Road side protection page of a fresh quote loads and lists AutoShield products (build check — if the page shows no products, AutoShield is unreachable and every case is BLOCKED, not FAIL)
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds

---

## 5. Exit Criteria

_What has to be true before we can say testing is finished and the release is safe
to consider. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] All High-priority test cases have been executed
- [ ] Test pass rate ≥ **90%** — the project's `story_pass_threshold`, the level at which the story may move to Ready for release
- [ ] Zero **Critical** severity bugs remain open
- [ ] **High** severity bugs ≤ 0 open — a High bug is a stopping bug under the project's outcome rules
- [ ] `qa-artifacts/5-testing-report/AP-2225_test-report.md` has been generated and reviewed
- [ ] All tracker tickets created in `qa-artifacts/5-testing-report/AP-2225_bug-report.md`

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and
what has to be fixed before we pick it back up._

### Suspend testing when:
- Application is inaccessible for more than **30 minutes**
- More than **30%** of test cases are blocked by a single defect — for example Generate Contract failing again as in AP-2258, which blocks every contract-page case
- A **Critical** severity bug is found that prevents further execution
- The Road side protection page shows no AutoShield products (AutoShield unreachable from staging)

### Resume testing when:
- The blocking issue is resolved and confirmed by dev team
- Environment is stable for at least **15 minutes**
- A patch has been deployed addressing the blocking defect

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | `https://v2staging.garantieavantageplus.ca` (from the `env` source) |
| **Browser** | Chromium (Playwright default) |
| **OS** | Windows 11 |
| **Application version** | Not known — the ticket's fix version is 3.0.0, but the deployed staging build number is not recorded. The executor records the footer version at run time. |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/` |
| **Bug tracker** | jira — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Dealer login | `vinhle870@gmail.com`, dealer 1380 "Test QA staging" | From the `env` source |
| Vehicle | Vehicle 915, VIN `1FAHP35NX8W239204`, Ford Focus 2008 | From the `test-data` source; used through `/vehicle/915/details` → Create quote |
| Quote with vehicle, client, sale price, delivery date and financing company | The main quote for the happy path | Created in a `[Pre-Condition]` step: client form, vehicle step with delivery date and price, financing page with a financing company and interest rate |
| Quote with vehicle and price but no delivery date and no financing | For the "today if empty" and "sale price if empty" defaults, and the no-financing case | Created in a `[Pre-Condition]` step |
| Client details | Unique name per run, e.g. `QA AP2225 {timestamp}`, client email `client.stage.NNN@yopmail.com` | Generated at run time |

### 8.1 Test Data Classification

Classified with the decision procedure in `stlc-testcase-designer` SKILL.md → Step 4. Undecided means Dynamic.

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer login and dealer 1380 | Static | None applied | Named in Execution Context, resolved from `env` |
| Vehicle 915 | Static | None applied — the cases read its VIN and attach it to a new quote; they never change it | Named in Execution Context, resolved from `test-data` |
| Quote with full data (client, vehicle, delivery date, price, financing) | Dynamic | Q2 — the prefill assertions depend on the values entered at creation | Created in a `[Pre-Condition]` step with every value written in the step |
| Quote without delivery date and financing | Dynamic | Q2 — the fallback assertions depend on those fields being empty | Created in a `[Pre-Condition]` step |
| autoShield quote (products, saved form values) | Dynamic | Q1 — it does not exist until the Road side protection page is opened for the quote | Created by opening the page inside the case |
| AutoShield contract | Dynamic | Q3 — Generate Contract consumes the autoShield quote and creates a record that cannot be undone | Created inside the case; its contract ID is written to the execution log |
| Financing company's autoshieldLenderID | Configuration | Q5 — Generate Contract may write it on a shared financing company | Observed only; it cannot be cleared from the dealer portal, so no case depends on it being empty (Q-006) |

**Cost of the Dynamic items:** each quote takes about three minutes to build through four
forms. Each Generate Contract calls AutoShield's test system and leaves a contract there
that cannot be deleted from the portal, so the cases share one generated contract where
they only read the contract page. Quotes are left behind on staging (there is no cleanup
source); the execution log lists their IDs.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| Unstable test environment | Medium | High | Run the environment health check before s4; record environment failures as BLOCKED, not FAIL |
| AutoShield test system unreachable from staging, so no products or no contract | Medium | High — every case after the product list would be BLOCKED | Build check in §4; suspend per §6 |
| The page map recorded one "Save and Generate Contract" button, not two (REQ-003, Q-003) | High | Medium — the label case may fail and Save may not exist on its own | Test the ticket's wording exactly; let Gate C decide any failure |
| Backend steps (login, lender, contract creation) cannot be seen | High | Medium — a defect inside them shows only as a missing contract | Prove them by the contract page; do not claim the calls were checked |
| No error path described (Q-005) | High | Medium | Record any error seen; no case expects a guessed message |
| Display of record-type fields and PDF behaviour not stated (Q-008, Q-009) | High | Low | Record-only expected results for labels and formats |
| Generated contracts pile up in AutoShield's test system | Medium | Low | Share one generated contract across read-only cases; list every contract ID |
| playwright unreachable | Low | High | Run the preflight before starting; reconnect if needed |
| `notify` capability disabled | — | None | Not needed by this plan |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-11-01 | Analysis | Requirements analysis | stlc-requirements-analyst |
| 2026-11-01 | Planning | Test plan design | stlc-test-plan-designer |
| 2026-11-01 | Design | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| Next execution slot | Execution | Manual test execution via playwright | stlc-manual-executor |
| Same day | Reporting | Bug reporting + ticket creation | stlc-bug-reporter |
| Same day | Reporting | Test report generation | stlc-test-reporter |
| Same day | Closure | Tracker ticket update | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Execute all STLC skills, generate all artifacts |
| QA Reviewer (stlc-qa-reviewer) | Decide gates A–D in place of a manual review |
| QA Lead / Human reviewer | Merge automation, read the run summary |
| Developer (Minh Lưu) | Fix defects; confirm fixes before re-test |
| Product Owner (Ken Nguyen) | Answer open questions Q-001 to Q-012; approve exit criteria |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%)
- [ ] Risk mitigations acknowledged by team
