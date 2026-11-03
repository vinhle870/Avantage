# Test Execution Report

**Report ID:** TR-20261103-002
**Project:** Avantage Plus v2 — Dealer portal
**Test Cycle:** AP-2505 — Generate contract for a quote's Roadside protection product (single-ticket STLC run, run folder no-sprint)
**Application version:** Not known — Dev does not show a build number, and AP-2505 shows one Bitbucket branch (last updated 2026-10-30) and no pull request, so its change does not appear to be deployed to Dev
**Date:** 2026-11-03
**Prepared by:** QA Agent — Test Reporter Skill
**Environment:** Dev — `https://v2dev.garantieavantageplus.ca/`, Dealer portal (dealer 1380, "Test QA staging"). Staging was not checked.

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** 0 of 10 test cases passed (0%), far below the 90% pass rate this story needs. The roadside contract page answers with a server error (HTTP 500) on Dev, which is the open High bug AP-2518, and the Blocking question Q-001 on acceptance criterion 2 is still unanswered. The change this story describes does not appear to be on Dev yet, so the story could not really be tested.

---

## Executive Summary

The QA agent tried to test the new full-page "Generate Contract" screen for roadside protection on the Dev site, with 10 test cases covering all 4 requirements of the story. None of them could pass. When a dealer chooses "Generate Contract" on a quote's Roadside Protection row, Dev still opens a pop-up, as before the change, and the pop-up never stops showing "Loading..." because the page behind it fails with a technical-error page. Typing the page's address directly gives the same error. This was seen on all six quotes built for the test, with and without a GAP insurance quote and with and without financing, and on brand-new vehicles that have no earlier roadside contract. That last point matters: the existing bug report (AP-2518, High) guessed that earlier contracts on the same vehicle caused the error, and this run shows they do not. Two test cases are recorded as failed and seven as blocked by that bug; one more waits for the story's author to say which column the "Vehicle identification" section belongs in (question Q-001). No new bug was filed, because the fault is already reported as AP-2518; the new evidence was added there and the two tickets were linked. The developer is asked whether the AP-2505 change has been merged and deployed to Dev. The story should stay in QC and be re-tested once it is.

---

## Test Metrics

_The pass rate is the share of test cases that passed, out of all cases except skipped ones; a blocked case counts as not passed._

| Metric | Value |
|---|:---:|
| Requirements covered | 4 of 4 (by design); 1 of 4 reached in execution (REQ-001) |
| Total test cases | 10 |
| Passed | 0 (0%) |
| Failed | 2 (20%) |
| Blocked | 8 (80%) |
| Skipped | 0 |
| **Pass rate** | **0%** |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 1 | 0 | 1 |
| Medium | 0 | 0 | 0 |
| Low | 0 | 0 | 0 |
| **Total** | **1** | **0** | **1** |

Defect density: 1 bug over 10 test cases (0.1 per case). The one bug is the existing AP-2518 (High, Backlog), linked to this run; no new ticket was created.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 25% (1 of 4 — AP2505_001 ran to its step under test; AP2505_005, _007, _008 blocked by AP-2518) | ❌ |
| Pass rate | ≥ 90% | 0% (0 of 10) | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | 0 | 1 (AP-2518, blocks 9 of 10 cases) | ❌ |
| Test report generated | Yes | Yes | ✅ |

Test-plan criteria: every case has a status other than Not Run ✅; every FAIL is filed or linked (AP-2518, Gate C rule C2) ✅; pass rate ≥ 90% and Q-001 answered ❌; report written and result comment on AP-2505 — done in stage s7.

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._ Coverage here is the share of the requirement's cases that were run to a pass or fail; each case is counted under its main requirement.

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Dedicated page at the unchanged address | 2 (001, 002) | 0 | 2 | 0 | 100% |
| REQ-002 — Two-column layout | 2 (003, 004) | 0 | 0 | 2 | 0% |
| REQ-003 — Pre-fill and read-only financing | 2 (005, 006) | 0 | 0 | 2 | 0% |
| REQ-004 — Submit creates the contract | 4 (007, 008, 009, 010) | 0 | 0 | 4 | 0% |
| **Total** | **10** | **0** | **2** | **8** | **20%** |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | Opening the roadside contract page of a quote returns HTTP 500, and its "Generate Contract" pop-up stays on "Loading..." (existing bug — commented with new evidence, linked to AP-2505) | High | P1 | REQ-001 (blocks REQ-002–REQ-004) | [AP-2518](https://garantieavantageplus.atlassian.net/browse/AP-2518) | Open (Backlog) |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2505_requirements-analysis.md` | 2026-11-03 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2505_test-plan.md` | 2026-11-03 |
| Test Cases | `qa-artifacts/3-test-cases/AP2505_TestCases_001-005.md`, `AP2505_TestCases_006-010.md` | 2026-11-03 |
| Test-case review | `qa-artifacts/3-test-cases/AP2505_ReviewFindings_2026-11-03.md` | 2026-11-03 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2505_2026-11-03.md` | 2026-11-03 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2505_bug-report.md` | 2026-11-03 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/` (11 screenshots, 1 network .txt file) | 2026-11-03 |
| Review record | `qa-artifacts/7-reviews/AP-2505_review.md` (R2 rounds 1–2, R3 round 1 — APPROVE) | 2026-11-03 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2505_test-report.md` | 2026-11-03 |

---

## Risks and Observations

- **The AP-2505 change does not appear to be on Dev.** The Roadside row's "Generate Contract" link is still a pop-up link (`data-toggle="modal" data-target="#myModal"`), while the GAP row's link on the same quote is a plain link to its own page. AP-2505 shows one Bitbucket branch (last updated 2026-10-30) and no pull request. The developer is asked in the AP-2505 comment whether it is merged and deployed.
- **AP-2518's suggested cause is ruled out.** It suggested existing roadside contracts on the same VIN; the six VINs used here (`2T1BURHE0NC505001/002/006/007/008/009`) had none, and every one failed. This evidence was added to AP-2518 (comment 19464, with screenshots).
- **Acceptance criterion 2 cannot be fully judged.** The description puts "vehicle and owner information on the left", while AC 2 puts "Vehicle identification" in the right column. AP2505_004 stays BLOCKED until the author answers Q-001 (asked on AP-2505 on 2026-11-03, no reply yet).
- **Test data left on Dev.** Vehicles 1130–1135 and quotes 6568–6573 (clients `client.stage.2505001/002/006/007/008/009@yopmail.com`), each with a roadside product of CA$250.00; financing on all except 6570; a GAP quote on 6568. No contract and no invoice were created. The cleanup source is missing, so nothing was removed.
- **Evidence quality (reviewer minors).** F-11: two screenshots (`AP2505_002-step4-DirectAddressHttp500_fail.png`, `AP2505_008-step1-ContractPageHttp500_blocked.png`) were captured while the error page was still fading in, so the text is faint, and no screenshot shows the address bar — the quote id of each error page rests on the execution log and the network .txt. F-12: the Playwright script that built the six quotes was not kept on disk, so what it typed is known only from the log. Both are to be fixed on the re-run.
- The technical-error page shows in French even when the session is set to English.

---

## Recommendations

1. Developer of AP-2505: confirm whether the branch has been merged and deployed to Dev. Today the Roadside row still opens a pop-up. Once it is deployed, re-test with `AP-2505 --from s4`.
2. Fix AP-2518 (High): the page `/quote/{id}/road-side-protection-create-contract` answers HTTP 500 on every quote, not only on VINs with earlier contracts. It may be fixed by the AP-2505 change itself (question Q-012) — the developer should say which.
3. Ask the author of AP-2505 (Nicolas-Eric Tain) to answer Q-001, which column holds "Vehicle identification", so AP2505_004 can run; the story cannot move to Ready for release while it is open.
4. On the re-run, wait for each error page to finish rendering before the screenshot and capture the address (F-11), and keep the quote-building script without credentials next to the screenshots (F-12).

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-03 |
| QA Lead | Not known — not named in the registry | Pending | | |
| Development Lead | Not known — not named in the registry | Pending | | |
| Product Owner | Nicolas-Eric Tain (ticket reporter) | Pending | | |
