# Test Execution Report

**Report ID:** TR-20261107-001 (replaces TR-20261103-002)
**Project:** Avantage Plus v2 — Dealer portal
**Test Cycle:** AP-2505 — Generate contract for a quote's Roadside protection product — re-test after fix (test plan rule P6), run folder no-sprint
**Application version:** Avantage Plus System v2.0.0 (page footer on Dev; no build number shown). AP-2505 was moved QC → Deploy to staging → QC by Ken Nguyen on 2026-11-04, and its change is now visible on Dev
**Date:** 2026-11-07
**Prepared by:** QA Agent — Test Reporter Skill
**Environment:** Dev — `https://v2dev.garantieavantageplus.ca/`, Dealer portal (dealer 1380, "Test QA staging"), Chromium 1280 × 800. Staging was not checked.

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** 5 of 10 test cases passed (50%), below the 90% this story needs. Two new bugs are open: AP-2554 (High) means a contract can be saved with the wrong financing, and AP-2553 (Medium) means the page's sections do not match acceptance criterion 2. The Blocking question Q-001 on criterion 2 is also still unanswered. Shipping now would risk roadside contracts that record a financed sale as a cash sale with no lender.

---

## Executive Summary

The QA agent re-tested the new full-page "Generate Contract" screen for roadside protection on the Dev site, with 10 test cases covering all 4 requirements of the story. The fault that stopped the first test round on 2026-11-03 is gone. The screen now opens as its own page in the same browser tab, with no pop-up, and it works with and without a GAP insurance quote. A contract was created from it (contract 2782), its details page and its English and French PDFs open, and reopening the screen for the same quote leads to the existing contract instead of creating a second one. Five test cases passed. Four failed, on two problems. First, the screen's section names and columns differ from what the story asks for: "Product Summary" instead of "Program Summary", "Owner identification" instead of "Owner information", and no "Financing information" section on the left (new bug AP-2553, Medium). Second, the financing is not copied from the quote and can be changed, although the story says it must be pre-filled and read-only. Because of this, the contract created in the test was saved as a cash sale with no lender, although the quote was financed by AutoCapital Canada (new bug AP-2554, High). One test case is waiting for the story's author to say which column "Vehicle identification" belongs in (question Q-001). The story should stay in QC until both bugs are fixed and Q-001 is answered.

---

## Test Metrics

_The pass rate is the share of test cases that passed, out of all cases except skipped ones; a blocked case counts as not passed._

| Metric | Value |
|---|:---:|
| Requirements covered | 4 of 4 (by design); 4 of 4 reached in execution |
| Total test cases | 10 |
| Passed | 5 (50%) |
| Failed | 4 (40%) |
| Blocked | 1 (10%) |
| Skipped | 0 |
| **Pass rate** | **50% (5 of 10)** |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 2 | 0 | 2 |
| Medium | 1 | 0 | 1 |
| Low | 0 | 0 | 0 |
| **Total** | **3** | **0** | **3** |

High: AP-2554 (new) and AP-2518 (filed 2026-11-02, still open in Backlog, but **not reproduced on 2026-11-07** — a candidate for closure by the triager). Medium: AP-2553 (new). Defect density: 2 new bugs over 10 test cases (0.2 per case); 3 bugs counting AP-2518.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 100% (4 of 4 — AP2505_001 and _005 FAIL, _007 and _008 PASS) | ✅ |
| Pass rate | ≥ 90% | 50% (5 of 10) | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | 0 | 2 (AP-2554 new; AP-2518 open but not reproduced) | ❌ |
| Test report generated | Yes | Yes | ✅ |

Test-plan criteria (§5): every case has a status other than Not Run ✅; every FAIL is filed (AP-2553, AP-2554 — Gate C rule C4, decided by the independent reviewer) ✅; pass rate ≥ 90%, no open stopping bug and Q-001 answered ❌; report written ✅, result comment on AP-2505 — stage update-ticket, not run in this dispatch.

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._ Coverage here is the share of the requirement's cases that were run to a pass or fail; each case is counted under its main requirement.

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Dedicated page at the unchanged address | 2 (001, 002) | 0 | 2 | 0 | 100% |
| REQ-002 — Two-column layout | 2 (003, 004) | 0 | 1 | 1 | 50% |
| REQ-003 — Pre-fill and read-only financing | 2 (005, 006) | 1 | 1 | 0 | 100% |
| REQ-004 — Submit creates the contract | 4 (007, 008, 009, 010) | 4 | 0 | 0 | 100% |
| **Total** | **10** | **5** | **4** | **1** | **90%** |

REQ-001 note: the navigation itself works (same tab, no pop-up, address unchanged, HTTP 200). AP2505_001 and _002 fail only because their final check looks for the "Program Summary" heading of criterion 2 (AP-2553).

Per case:

| TC ID | Priority | Result | Reason |
|---|:---:|:---:|---|
| AP2505_001 | High | ❌ FAIL | Page opens correctly; no "Program Summary" (titled "Product Summary") — AP-2553 |
| AP2505_002 | Medium | ❌ FAIL | Same without a GAP quote — AP-2553 |
| AP2505_003 | Medium | ❌ FAIL | "Owner identification", no "Financing information" in the left column, "Product Summary" on the right — AP-2553 |
| AP2505_004 | Medium | 🚫 BLOCKED | Q-001 (Blocking) unanswered — which column holds "Vehicle identification" |
| AP2505_005 | High | ❌ FAIL | Financing company "Choose", Purchase type CASH; all financing values editable — AP-2554 |
| AP2505_006 | Medium | ✅ PASS | No-financing quote: vehicle and owner pre-filled, financing empty |
| AP2505_007 | High | ✅ PASS | Contract 2782 created on the first submit (Stock number, In service date, Home phone 514-555-0501 filled) |
| AP2505_008 | High | ✅ PASS | Contract 2782 details page and en/fr PDFs open with the right contract, VIN and client |
| AP2505_009 | Medium | ✅ PASS | Empty last name refused with "This value should not be blank."; nothing created |
| AP2505_010 | Medium | ✅ PASS | Reopening the address redirects to contract 2782; no second contract |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | Opening the roadside contract page returns HTTP 500 and its "Generate Contract" pop-up stays on "Loading..." — not reproduced 2026-11-07 (comment 19512 added; no status change by QA) | High | P1 | REQ-001 | [AP-2518](https://garantieavantageplus.atlassian.net/browse/AP-2518) | Open (Backlog) |
| BUG-002 | The roadside contract page shows "Product Summary" and "Owner identification" and has no "Financing information" section in the left column | Medium | P2 | REQ-002 | [AP-2553](https://garantieavantageplus.atlassian.net/browse/AP-2553) | Open (Backlog) |
| BUG-003 | The roadside contract page does not pre-fill the quote's financing, lets the dealer change it, and saves the contract as "Cash" with no lender | High | P1 | REQ-003 | [AP-2554](https://garantieavantageplus.atlassian.net/browse/AP-2554) | Open (Backlog) |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2505_requirements-analysis.md` | 2026-11-03 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2505_test-plan.md` | 2026-11-03 |
| Test Cases | `qa-artifacts/3-test-cases/AP2505_TestCases_001-005.md`, `AP2505_TestCases_006-010.md` (AP2505_007/_008 corrected after review R3 rounds 1–2) | 2026-11-03, revised 2026-11-07 |
| Test-case review | `qa-artifacts/3-test-cases/AP2505_ReviewFindings_2026-11-03.md` | 2026-11-03 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2505_2026-11-07.md` (first pass + re-runs after R3 rounds 1 and 2; the round-2 re-run results are final) | 2026-11-07 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2505_bug-report.md` | 2026-11-07 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/` (27 screenshots and 3 network .txt files with `Nov07` in the name, plus the build snippet `AP2505_build-script_2026-11-07.js.txt`) | 2026-11-07 |
| Review record | `qa-artifacts/7-reviews/AP-2505_review.md` (R3 rounds 1–3 of 2026-11-07; round 3 APPROVE) | 2026-11-07 |
| Previous cycle | `execution-log_AP-2505_2026-11-03.md` (0 of 10, AP-2518) | 2026-11-03 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2505_test-report.md` | 2026-11-07 |

---

## Risks and Observations

- **Wrong financing on generated contracts (AP-2554).** Contract 2782 on quote 6597 was saved with purchaseType CASH and an empty lender, and both PDFs tick "Cash" / "Comptant", although the quote is financed (AutoCapital Canada, 60 months). The page's Financing company list does not contain AutoCapital Canada, so a dealer cannot correct it either.
- **Pre-filled phone refused (not filed — question to the developer).** The page pre-fills Home phone `5145550501` from the client, and Generate Contract then refuses it: "The phone number is invalid. Please ensure it follows the format: ###-###-####." With `514-555-0501` the contract was created. A dealer who keeps the pre-filled values cannot generate the contract. This goes to the developer as a question in the AP-2505 result comment.
- **Four more observations, recorded but not judged** (the story states no value for them): a refused submit still saved Stock number and In service date to the quote; contract 2782's details page shows Total Tax CAD 0 while both PDFs show Taxes 29.95; the contract carries vehicleConditionCode "used" together with purchaseState "New" and isNew 1; the French PDF viewer shows 5 pages while its footer reads "Page 1 de 8".
- **AP-2518 no longer reproduces.** HTTP 200 on 8 quotes, including 6568 and 6570, which failed on 2026-11-03. Comment 19512 says so on AP-2518; closing it is for the triager.
- **Acceptance criterion 2 is still partly undecided.** The description puts "vehicle and owner information on the left", while AC 2 puts "Vehicle identification" on the right. AP2505_004 stays BLOCKED until the author answers Q-001 (asked 2026-11-03). On Dev, "Vehicle identification" is the first section of the left column.
- **Evidence quality (reviewer minors, R3 round 3).** F-16: `AP2505_010-step5-Nov07r3CountStill1_pass.png` is byte-identical to `AP2505_007-step5-Nov07r3ContractList3Rows_pass.png` (md5 bad4cd3b…). The one image of the contract list (2782, 2698, 2697) serves both steps, and the 302 redirect in AP2505_010 step 3 rests on the log's request line. F-15: no image shows the form after Stock number, In service date and Home phone were typed, just before the submit. The saved contract and the saved client phone prove what was submitted. In the same way, `AP2505_005-step3-Nov07PrefillCompanyEmptyCash_fail.png` is byte-identical to `AP2505_003-step3-Nov07ColumnsNoFinancingSection_fail.png` (md5 6ca30ea8…). It is the same unsubmitted page of quote 6593 and shows both the columns and the pre-filled financing.
- **Test data left on Dev** (no cleanup source): vehicles 1148–1154 and quotes 6593–6599 (6594 / vehicle 1149 is a stray build used by no case, VIN `2T1BURHE0NC505undefined`). Each has a roadside product of CA$250.00. AutoShield roadside contract **2782** (RHTWQ-2782) is on quote 6597, and no invoice was created. Quote 6597's client Home phone is now `514-555-0501`. The records from 2026-11-03 (vehicles 1130–1135, quotes 6568–6573) are also still there.

---

## Recommendations

1. Fix AP-2554 (High) before release. Pre-fill the quote's financing (lender, purchase type, amount, rate) on the roadside contract page, make it read-only as AC 3 says, and make sure the contract and its PDFs carry it. Then re-test with `AP-2505 --from execute`.
2. Fix AP-2553 (Medium). Rename the sections to "Program Summary" and "Owner information", and add a "Financing information" section in the left column, as AC 2 says.
3. Ask the author of AP-2505 (Nicolas-Eric Tain) to answer Q-001, which column holds "Vehicle identification", so AP2505_004 can run. The story cannot move to Ready for release while Q-001 is open.
4. Developer: answer the pre-filled phone question in the AP-2505 result comment, and confirm whether any of the four recorded observations (tax 0 vs 29.95, used/New, French PDF page count, Stock number saved on a refused submit) is unintended. QA files a bug for any the developer confirms.
5. Triager: AP-2518 can be re-tested and closed on the 2026-11-07 evidence (comment 19512).
6. On the next run, capture the filled form just before each submit click (F-15), and give each step its own capture or say in the log when one image serves two steps (F-16).

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-07 |
| QA Lead | Not known — not named in the registry | Pending | | |
| Development Lead | Not known — not named in the registry | Pending | | |
| Product Owner | Nicolas-Eric Tain (ticket reporter) | Pending | | |
