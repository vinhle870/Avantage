# Test Execution Report

**Report ID:** TR-20261103-001
**Project:** Avantage Plus v2 — Dealer portal
**Test Cycle:** AP-2504 — Generate contract for a quote's GAP/Creditor Insurance product (single-ticket STLC run, run folder no-sprint)
**Application version:** Not known — Dev does not show a build number; the ticket's change was merged and deployed to `develop` on 2026-10-30
**Date:** 2026-11-03
**Prepared by:** QA Agent — Test Reporter Skill
**Environment:** Dev — `https://v2dev.garantieavantageplus.ca/`, Dealer portal (dealer 1380, "Test QA staging"). Staging was not checked.

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** 9 of 11 test cases passed (81.8%), below the 90% pass rate this story needs, one acceptance criterion fails (AP-2538, the financing section shows internal codes), and the Blocking question Q-001 on acceptance criterion 1 is still unanswered, so that criterion could not be judged.

---

## Executive Summary

The QA agent tested the new full-page "Generate Contract" screens for GAP insurance and creditor insurance on the Dev site, with 11 test cases covering all 5 requirements of the story. 9 cases passed: both buttons now open a dedicated page in the same tab instead of a pop-up, the page shows the vehicle, owner, co-owner and financing on the left and the program summary on the right, and submitting it creates a real GAP contract (AVPG000064) and a real creditor contract (AVP000171). One case failed: the financing section of both new pages shows internal codes ("FREQUENCY_MONTHLY", "TYPE_FINANCING") instead of "Monthly" and "Financing", and on the French page five of its labels stay in English (AP-2538, Medium). One case could not be run because the first acceptance criterion names the wrong row (the Extended Warranty row) and the author has not yet said which is meant. Three side findings were also filed: the contract PDFs of both Chubb products return an error page (AP-2539, High — this already happened before the change, so it is not caused by this story), a wrong product name in one message (AP-2540, Low) and a date of birth shown one day early on the quote page (AP-2541, Low, outside this story). The story should stay in QC until AP-2538 is fixed and the question is answered.

---

## Test Metrics

_The pass rate is the share of test cases that passed, out of all cases except skipped ones; a blocked case counts as not passed._

| Metric | Value |
|---|:---:|
| Requirements covered | 5 of 5 |
| Total test cases | 11 |
| Passed | 9 (81.8%) |
| Failed | 1 (9.1%) |
| Blocked | 1 |
| Skipped | 0 |
| **Pass rate** | **81.8%** |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 1 | 0 | 1 |
| Medium | 1 | 0 | 1 |
| Low | 2 | 0 | 2 |
| **Total** | **4** | **0** | **4** |

Defect density: 4 bugs over 11 test cases (0.36 per case). Only AP-2538 counts against AP-2504; AP-2539 (High) is older than this change, AP-2541 is outside its scope, and AP-2540 is a wrong message on a behaviour the story does not describe.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 87.5% (7 of 8 — AP2504_002 blocked by Q-001) | ❌ |
| Pass rate | ≥ 90% | 81.8% (9 of 11) | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 0 caused by this story | 0 caused by this story (1 older High, AP-2539, not an AP-2504 regression) | ✅ |
| Test report generated | Yes | Yes | ✅ |

Test-plan criteria: every case has a status other than Not Run ✅; every FAIL is filed (AP-2538, Gate C rule C4) ✅; pass rate ≥ 90% and Q-001 answered ❌; report written and result comment on AP-2504 — done in stage s7.

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._ Coverage here is the share of the requirement's cases that were run (passed or failed); each case is counted under its main requirement.

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — GAP "Generate Contract" opens a dedicated page in the same tab | 3 (001, 002, 009) | 2 | 0 | 1 | 67% |
| REQ-002 — Two-column layout, co-owner section only with a co-applicant | 2 (003, 004) | 2 | 0 | 0 | 100% |
| REQ-003 — Pre-filled values, read-only financing | 2 (005, 006) | 1 | 1 | 0 | 100% |
| REQ-004 — Submit creates the GAP contract | 2 (007, 008) | 2 | 0 | 0 | 100% |
| REQ-005 — Creditor insurance at its own address | 2 (010, 011) | 2 | 0 | 0 | 100% |
| **Total** | **11** | **9** | **1** | **1** | **91%** |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | Financing information on the GAP and creditor contract pages shows FREQUENCY_MONTHLY / TYPE_FINANCING; five labels stay English in French | Medium | P2 | REQ-003, REQ-005 | [AP-2538](https://garantieavantageplus.atlassian.net/browse/AP-2538) | Open |
| BUG-002 | GAP and creditor (Chubb) contract PDF links answer HTTP 500 — not an AP-2504 regression | High | P2 | Outside AP-2504 | [AP-2539](https://garantieavantageplus.atlassian.net/browse/AP-2539) | Open |
| BUG-003 | Reopening the GAP contract page of a quote with a GAP contract says "Creditor insurance already created" | Low | P4 | REQ-001 | [AP-2540](https://garantieavantageplus.atlassian.net/browse/AP-2540) | Open |
| BUG-004 | Quote page shows the co-applicant's date of birth one day early | Low | P4 | Outside AP-2504 | [AP-2541](https://garantieavantageplus.atlassian.net/browse/AP-2541) | Open |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2504_requirements-analysis.md` | 2026-11-03 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2504_test-plan.md` | 2026-11-03 |
| Test Cases | `qa-artifacts/3-test-cases/AP2504_TestCases_001-005.md`, `AP2504_TestCases_006-010.md`, `AP2504_TestCases_011-011.md` | 2026-11-03 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2504_2026-11-03.md` | 2026-11-03 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2504_bug-report.md` | 2026-11-03 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/` (20 screenshots, 2 network .txt files) | 2026-11-03 |
| Review record | `qa-artifacts/7-reviews/AP-2504_review.md` (R1, R2, R3 — all APPROVE) | 2026-11-03 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2504_test-report.md` | 2026-11-03 |

---

## Risks and Observations

- **Acceptance criterion 1 is not judged.** It says the GAP page opens from "the Extended Warranty row actions". AP2504_002 stays BLOCKED until the author answers Q-001 (asked in comment 19460 on 2026-11-03, no reply yet). AP2504_001 confirms the GAP row's own action works.
- **No invoice is created for either Chubb contract** (GAP AVPG000064, creditor AVP000171). The ticket says invoice behaviour stays unchanged, and no record shows a Chubb contract ever made an invoice, so this is recorded, not filed; questions Q-008 and Q-009 ask the author.
- **Contract PDFs cannot be opened for Chubb products on Dev** (AP-2539). Dealers can create the contracts but cannot print them; this predates AP-2504 (quote 6480, 2026-11-02).
- **Real contracts were left on Dev.** Quotes 6562–6566 (clients `client.stage.2504001/004/007/008/010@yopmail.com`), the co-applicant "Coowner Coapp2504" on quote 6563, GAP contract AVPG000064 (quote 6564) and creditor contract AVP000171 (quote 6566). The cleanup source is missing, so nothing was removed; Chubb contracts cannot be deleted from the portal.
- Two of the record-only screenshots were saved twice under different step names (reviewer minor F-2); each still shows what both steps claim.

---

## Recommendations

1. Fix AP-2538 (Medium): translate the payment frequency and financing type on both contract pages, the same way the quote page does, and add French labels for Creditor address, Due type, Financing type, Loan term and Residual value. Then re-test with `AP-2504 --from s4`.
2. Ask the author of AP-2504 to answer Q-001 (which row acceptance criterion 1 means) so AP2504_002 can run; the story cannot move to Ready for release while it is open.
3. Triage AP-2539 (High) together with AP-2512 and AP-2519 — all three are contract or document PDFs answering HTTP 500 on Dev and may share a cause.
4. AP-2540 and AP-2541 (Low) are text and display fixes and can be scheduled with normal priority.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-03 |
| QA Lead | Not known — not named in the registry | Pending | | |
| Development Lead | Not known — not named in the registry | Pending | | |
| Product Owner | Nicolas-Eric Tain (ticket reporter) | Pending | | |
