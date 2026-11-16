# Test Execution Report

**Report ID:** TR-20261108-001
**Project:** AP (Avantage)
**Test Cycle:** AP-2506 — "Generate contract for a quote's Esthetic protection product" — run folder no-sprint
**Application version:** Dev (v2dev, https://v2dev.garantieavantageplus.ca) as deployed on 2026-11-08 — no build number is shown, and the ticket links no pull request
**Date:** 2026-11-08
**Prepared by:** QA Agent — Test Reporter Skill (stlc-worker, QA batch)
**Environment:** Dev

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** 5 of 9 test cases passed (55.6%), below the 90% the story needs; one High bug is open (AP-2556, wrong vehicle price on the contract page) together with the existing High bug AP-2512 (contract PDF cannot be downloaded), and the Blocking question Q-001 is still unanswered.

---

## Executive Summary

The QA agent tested the new Esthetic protection contract page on the Dev environment on
8 November 2026, with 9 test cases covering all 5 requirements of AP-2506. The page opens
as its own page from the quote at the unchanged address, its summary column shows the
term, dates, chosen product and total, bad entries are refused cleanly, and a contract
cannot be created twice. Three things do not work as the story asks. The page shows the
vehicle's inventory price (CA$10,000) instead of the price agreed on the quote
(CA$25,000), so a contract could carry the wrong price (new bug AP-2556, High). Two
section headings differ from the story's wording, which may be an intended redesign
that the author must confirm (new bug AP-2555, Medium). The contract is created, but its
PDF cannot be downloaded (existing bug AP-2512, High). One test case could not be run
because the story's first acceptance criterion contradicts its description (question
Q-001, unanswered). The story should not be released until AP-2556 and AP-2512 are fixed
and Q-001 is answered.

---

## Test Metrics

The **pass rate** is the share of test cases that passed, counted over every case except
those skipped on purpose (none here); blocked cases count as not passed.

| Metric | Value |
|---|:---:|
| Requirements covered | 5 of 5 (REQ-001 only partly — AP2506_002 blocked) |
| Total test cases | 9 |
| Passed | 5 (55.6%) |
| Failed | 3 (33.3%) |
| Blocked | 1 |
| Skipped | 0 |
| **Pass rate** | **55.6% (5 of 9)** |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 2 (AP-2556 new; AP-2512 existing) | 0 | 2 |
| Medium | 1 (AP-2555 new) | 0 | 1 |
| Low | 0 | 0 | 0 |
| **Total** | **3** | **0** | **3** |

Defect density (bugs per test case): 3 ÷ 9 = 0.33.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| Every test case has a status other than Not Run | 100% | 100% (9 of 9) | ✅ |
| All High-priority TCs executed | 100% | 80% (4 of 5; AP2506_002 blocked by Q-001) | ❌ |
| Every FAIL filed, linked or dismissed (Gate C) | 3 of 3 | 3 of 3 (AP-2555, AP-2556 filed; AP-2512 commented) | ✅ |
| Pass rate | ≥ 90% | 55.6% | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | 0 (a High bug stops the story at Gate D) | 2 | ❌ |
| Blocking question Q-001 answered | Yes | No — open since 2026-11-01 | ❌ |
| Test report generated | Yes | Yes | ✅ |
| Result comment posted on AP-2506 | Yes | Not yet — update-ticket runs after the Gate D review | ❌ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — "Generate Contract" opens a dedicated page at the unchanged address (AP2506_001, _002, _009) | 3 | 2 | 0 | 1 | 67% |
| REQ-002 — two-column layout with named sections (AP2506_003) | 1 | 0 | 1 | 0 | 100% |
| REQ-003 — Program Summary content (AP2506_004) | 1 | 1 | 0 | 0 | 100% |
| REQ-004 — vehicle and owner pre-filled from the quote (AP2506_005) | 1 | 0 | 1 | 0 | 100% |
| REQ-005 — submit creates the contract through the current process (AP2506_006, _007, _008) | 3 | 2 | 1 | 0 | 100% |
| **Total** | **9** | **5** | **3** | **1** | **89%** |

Coverage = cases that ran (passed or failed) ÷ cases designed for the requirement.

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | The Esthetic protection contract page shows "Owner identification" and "Product Summary" instead of "Owner information" and "Program Summary" (AP2506_003) | Medium | P3 | REQ-002 | [AP-2555](https://garantieavantageplus.atlassian.net/browse/AP-2555) | Open (Backlog) |
| BUG-002 | The Esthetic protection contract page shows the vehicle's inventory price (CA$10,000.00) instead of the quote's vehicle price (CA$25,000.00) (AP2506_005) | High | P2 | REQ-004 | [AP-2556](https://garantieavantageplus.atlassian.net/browse/AP-2556) | Open (Backlog) |
| — (existing) | The contract PDF download returns HTTP 500 on Dev (AP2506_006 step 5; contract PNA-0000000022) | High | — | REQ-005 | [AP-2512](https://garantieavantageplus.atlassian.net/browse/AP-2512) — commented, linked | Open (Backlog) |

### Results per test case

| TC ID | Title | Priority | Result | Note |
|---|---|:---:|:---:|---|
| AP2506_001 | Generate Contract opens its own page at the unchanged address, not a pop-up | High | ✅ PASS | Same tab, full page, address typed directly gives the same page |
| AP2506_002 | Generate Contract in the Extended Warranty row actions (AC 1 as written) | High | 🚫 BLOCKED | Q-001 unanswered |
| AP2506_003 | Vehicle and owner on the left, Program Summary and button on the right | Medium | ❌ FAIL | Headings "Owner identification" / "Product Summary" — AP-2555 |
| AP2506_004 | Summary shows term, start and end dates, chosen products and a total | High | ✅ PASS | 10 ans · 2026-11-08 · 2036-11-08 · Antirouille – Rust+Sound (combo) · CA$80.00 |
| AP2506_005 | Page pre-filled with the quote's vehicle and client details | High | ❌ FAIL | Vehicle Price 10000.00, not 25000 — AP-2556 |
| AP2506_006 | Submitting valid values creates a contract with a downloadable PDF | High | ❌ FAIL | Contract PNA-0000000022 created; PDF HTTP 500 — AP-2512 |
| AP2506_007 | Owner's last name emptied — no crash, no lost values | Medium | ✅ PASS | Refused with "This value should not be blank." |
| AP2506_008 | Financing company on "Choose" — no server error | Medium | ✅ PASS | Refused with a message at the field; no 5xx |
| AP2506_009 | Contract page for a quote that already has a contract | Medium | ✅ PASS | Redirects to the quote; still one contract |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2506-generate-contract-for-a-quotes-esthetic.md` | 2026-11-01 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2506_requirements-analysis.md` | 2026-11-01 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2506_test-plan.md` | 2026-11-01 |
| Test Cases | `qa-artifacts/3-test-cases/AP2506_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP2506_TestCases_006-009.md` | 2026-11-01, reworked 2026-11-08 |
| Review findings | `qa-artifacts/3-test-cases/AP2506_ReviewFindings_2026-11-01.md` | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2506_2026-11-08.md` | 2026-11-08 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2506_bug-report.md` | 2026-11-08 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/` (13 images, 3 network files) | 2026-11-08 |
| Review record | `qa-artifacts/7-reviews/AP-2506_review.md` | 2026-11-01 – 2026-11-08 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2506_test-report.md` | 2026-11-08 |

---

## Risks and Observations

- **Q-001 is still open (Blocking, REQ-001).** Acceptance criterion 1 starts from the
  Extended Warranty row but expects the Esthetic protection address. AP2506_002 cannot be
  run, and the story cannot move to Ready for release until the author answers.
- **The ticket is in status QA, not QC, and links no pull request.** The QA decided on
  2026-11-08 to test on Dev anyway; the results describe Dev as deployed that day.
- **The contract's stored vehicle price could not be checked.** Because the PDF download
  fails (AP-2512), it is not known whether a created contract also carries the 10,000
  price shown on the page (AP-2556).
- **Financing company has no "*".** It is required on submit (blank → "This value should
  not be blank.") but its label shows no required marker, unlike the other required
  fields. No requirement covers markers (Q-003 / Q-008 are Judgement questions), so this
  is recorded only, for the author.
- **AP-2516 may be fixed.** On quotes 6692–6695 the Esthetic protection row showed
  CA$80.00 and the subtotal CA$25,080.00 included it; AP-2516 says the row shows "-".
  This run did not follow AP-2516's cancel-and-re-add steps and has no subtotal
  screenshot, so it is a note for AP-2516's owner, not a re-test.
- **Recorded behaviour (Judgement questions):** the start date is the run date and cannot
  be edited (Q-004); the end date is start + 10 years (Q-005); the total equals the
  quote's Esthetic protection cost without tax (Q-006); only the VIN and owner fields are
  editable (Q-007); a submit lands on the quote page with a success message and an
  invoice notice (Q-009); once a contract exists the action disappears and the address
  redirects to the quote (Q-010).
- **Test data left on Dev:** quotes 6692, 6694 and 6695 (no contract) and quote 6693
  with contract PNA-0000000022 and invoice 946 ($80). No mail was sent.

---

## Recommendations

1. Fix AP-2556 (High) so the contract page takes the vehicle price from the quote
   (25,000 in the test) rather than the vehicle record, then check that a created contract
   stores that price.
2. Fix AP-2512 (High) so the contract PDF downloads; re-run AP2506_006 afterwards.
3. Ask the author of AP-2506 to answer Q-001 (which row's action opens the page) and to
   say on AP-2555 whether "Owner identification" / "Product Summary" are the intended
   headings — if yes, update acceptance criterion 2 and close AP-2555 and AP-2553 together.
4. Move AP-2506 to QC when the fixes are deployed, then re-run with
   "AP-2506 --from execute"; take a quote-page screenshot of quote 6692's vehicle price on
   that run (R3 finding F-1).
5. Decide whether "Financing company" should show the "*" required marker; open a ticket
   if so.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-08 |
| QA Lead | Vinh Le - QC | Pending | | |
| Development Lead | Not known — the ticket names no developer | Pending | | |
| Product Owner | Nicolas-Eric Tain (ticket reporter) | Pending | | |
