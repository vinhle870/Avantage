# Test Execution Report — AP-2225

**Report ID:** TR-20261101-001
**Project:** Avantage Plus v2 — Dealer portal (Jira project AP)
**Test Cycle:** AP-2225 "Dealer Area: AutoShield create contract" — run folder `3.0.0` (the ticket's fix version)
**Application version:** Not known — the portal shows no build number. Tested on: Dev (v2dev), https://v2dev.garantieavantageplus.ca, on 2026-11-01. Its Road side protection page carries the AP-2423, AP-2424 and AP-2498 changes (AP-2498's pull request merged 2026-10-26)
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** Only 1 of 15 test cases passed (6.7 %, against the 90 % threshold), and one High severity bug, AP-2508, is open: the page has no "Generate Contract" button, so no AutoShield contract can be created at all.

---

## Executive Summary

Tested on: Dev (v2dev), by the user's decision. AP-2225 lets a car dealer buy AutoShield road-side protection for a customer: on a quote's "Road side protection" page the dealer picks a product, checks the vehicle and customer details that are filled in from the quote, saves them, and presses "Generate Contract" to create the contract with AutoShield. Of the 15 checks, one passed: the page lists five AutoShield products, each with a price, so the connection to AutoShield works. Seven checks failed for a single reason: the page shows no vehicle details beyond VIN and year, no customer details, no dates or financing details, and no "Generate Contract" button, only "Save". That is recorded as one bug, AP-2508 (High), which asks the developer whether these parts were removed on purpose and, if so, which control now creates the contract. The remaining seven checks could not be run: six need a generated contract, and one needs a quote without a delivery date, which Dev does not allow. The story is not ready for release.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 6 of 6 (each has at least one test case; only REQ-001 could be judged as passing) |
| Total test cases | 15 |
| Passed | 1 (6.7%) |
| Failed | 7 (46.7%) |
| Blocked | 7 |
| Skipped | 0 |
| **Pass rate** | **6.7%** (1 of 15) |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

The **pass rate** is the share of test cases that passed, counting every case except
skipped ones; a blocked case counts as not passed.

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 1 | 0 | 1 |
| Medium | 0 | 0 | 0 |
| Low | 0 | 0 | 0 |
| **Total** | **1** | **0** | **1** |

Defect density: 1 bug for 15 test cases (0.07). The one bug accounts for all seven failures
and six of the seven blocked cases.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 60% (6 of 10; AP2225_009, _010, _011, _015 blocked by AP-2508) | ❌ |
| Pass rate | ≥ 90% | 6.7% (1 of 15) | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 0 | 1 (AP-2508) | ❌ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

Each case is counted once, under its main requirement.

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — AutoShield products and pricing | 1 (AP2225_001) | 1 | 0 | 0 | 100% |
| REQ-002 — Vehicle and client fields prefilled from the quote | 5 (AP2225_002, _003, _004, _005, _014) | 0 | 4 | 1 | 80% |
| REQ-003 — 'Generate Contract' button and its French label | 1 (AP2225_007) | 0 | 1 | 0 | 100% |
| REQ-004 — Save stores the data in the autoShield quote | 2 (AP2225_006, _008) | 0 | 2 | 0 | 100% |
| REQ-005 — Generate Contract creates the contract at AutoShield | 4 (AP2225_009, _012, _013, _015) | 0 | 0 | 4 | 0% |
| REQ-006 — The autoShield contract page | 2 (AP2225_010, _011) | 0 | 0 | 2 | 0% |
| **Total** | **15** | **1** | **7** | **7** | **53%** |

Coverage is the share of cases that reached a verdict (passed or failed): 8 of 15.

---

## Test Case Results

| TC ID | Title | Priority | Status | Bug |
|---|---|:---:|:---:|---|
| AP2225_001 | The Road side protection page of a new quote lists AutoShield products, each with a price | High | PASS | — |
| AP2225_002 | The vehicle fields on the Road side protection page are prefilled with the quote's vehicle, sale and financing data | High | FAIL | AP-2508 |
| AP2225_003 | The client fields on the Road side protection page show the quote's client details | High | FAIL | AP-2508 |
| AP2225_004 | On a quote with no delivery date and no financing, dates default to today and Financed Amount to the sale price | Medium | BLOCKED | — (test data: Dev requires a delivery date) |
| AP2225_005 | A prefilled value the dealer overrides is kept after Save and a page reload | High | FAIL | AP-2508 |
| AP2225_006 | Saving a changed value on the Road side protection page leaves the quote's own vehicle data unchanged | High | FAIL | AP-2508 |
| AP2225_007 | The contract button reads "Generate Contract" in English and "Générer le contrat" in French | Medium | FAIL | AP-2508 |
| AP2225_008 | Saving with Odometer Reading emptied does not crash the page or keep a value nobody entered | Medium | FAIL | AP-2508 |
| AP2225_009 | Generate Contract opens the autoShield contract page with an AutoShield contract ID | High | BLOCKED | AP-2508 (blocks) |
| AP2225_010 | The autoShield contract page shows all 17 contract fields | High | BLOCKED | AP-2508 (blocks) |
| AP2225_011 | The contract page's PDF link delivers the AutoShield contract as a PDF document | High | BLOCKED | AP-2508 (blocks) |
| AP2225_012 | Generate Contract on a quote with no financing company ends on a page without a crash | Medium | BLOCKED | AP-2508 (blocks) |
| AP2225_013 | Generating a contract with a financing company that has no AutoShield Lender ID stores a new lender ID on it | Medium | BLOCKED | AP-2508 (blocks) |
| AP2225_014 | Values the dealer overrides and saves are the values shown on the generated contract | High | FAIL | AP-2508 |
| AP2225_015 | Double-clicking "Generate Contract" creates only one AutoShield contract for the quote | High | BLOCKED | AP-2508 (blocks) |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | The Road side protection page has no vehicle, client, date or financing fields and no "Generate Contract" button, so no AutoShield contract can be created | High | P1 | REQ-002, REQ-003, REQ-004 (blocks REQ-005, REQ-006) | [AP-2508](https://garantieavantageplus.atlassian.net/browse/AP-2508) | Open |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2225-dealer-area-autoshield-create-contract.md` | 2026-11-01 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2225_requirements-analysis.md` | 2026-11-01 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2225_test-plan.md` | 2026-11-01 |
| Test Cases | `qa-artifacts/3-test-cases/AP2225_TestCases_001-005.md`, `_006-010.md`, `_011-012.md`, `_013-015.md` | 2026-11-01 |
| Review Findings | `qa-artifacts/3-test-cases/AP2225_ReviewFindings_2026-11-01.md` | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/3.0.0/execution-log_AP-2225_2026-11-01.md` | 2026-11-01 |
| Review record (gates A, B, C) | `qa-artifacts/7-reviews/AP-2225_review.md` | 2026-11-01 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2225_bug-report.md` | 2026-11-01 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/` (14 files) | 2026-11-01 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2225_test-report.md` | 2026-11-01 |

---

## Risks and Observations

- **The failures describe the current build, not an old one.** Dev carries later work on the same page (AP-2423's VIN warning, AP-2424's Make/Model form, AP-2498's VIN and Year inputs, merged 2026-10-26). On staging the page still had the Purchase Date and In service date fields on 2026-07-25 (QA comment on AP-2423) and the stock number, condition, odometer fields and a "Save and Generate Contract" button on 2026-08-29 (QA page map). So these parts are missing from the current build on Dev (independent review R3, finding F-1).
- **No contract was created.** QA did not press "Save" in place of "Generate Contract": the ticket describes them as two different actions, and an AutoShield contract is a real record that cannot be deleted from the portal. Whether "Save" itself creates a contract on Dev is unknown and is asked on AP-2508.
- **Correction to the execution log:** AutoShield contracts #2697 and #2698 (quotes 6253 and 6254, 2026-07-25) were created on staging, not on Dev; bug AP-2432 shows them at v2staging addresses. Dev's data appears to be copied from staging (R3 finding F-2).
- **AP2225_004 could not be set up on Dev:** the quote vehicle step requires a Delivery date ("This value should not be blank."), so the "today if empty" default cannot be reached this way. Not a bug.
- The Vehicle box's Make picker shows "Choose" although vehicle 915 is a Ford Focus — recorded, not judged.
- Twelve open questions to the ticket author (Q-001 to Q-012, 9 Judgement, 3 Info, none Blocking) remain unanswered.
- Test data left on Dev: quotes 6451, 6452 and 6453, with no AutoShield contract.

---

## Recommendations

1. Developer: answer AP-2508 — say whether the vehicle, client, date and financing fields and the contract button were removed from the Road side protection page on purpose and, if so, which control now creates the AutoShield contract; otherwise restore them.
2. QA: once a build with a contract-generating control is on the test environment, or a developer names that control on AP-2508, re-run AP2225_009–013 and AP2225_015 (and the seven failed cases) with "AP-2225 --from s4". Never press "Save" in place of "Generate Contract".
3. Product owner (Ken Nguyen): answer Q-001 (client fields), Q-003 (separate Save and Generate Contract buttons) and Q-007 (no financing company), which the re-run needs.
4. QA: for AP2225_004, agree with the designer another way to reach a quote with no delivery date, or retire the case if Dev's required Delivery date is the intended behaviour.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-01 |
| QA Lead | Vinh Le | Pending | | |
| Development Lead | Not known | Pending | | |
| Product Owner | Ken Nguyen | Pending | | |
