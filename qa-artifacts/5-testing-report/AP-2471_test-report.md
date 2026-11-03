# Test Execution Report

**Report ID:** TR-20261102-001
**Project:** Avantage Plus v2 — Admin portal
**Test Cycle:** AP-2471 — Admin: Earning Curve management (second test cycle, run folder no-sprint)
**Tested on:** Dev (v2dev) — https://v2dev.garantieavantageplus.ca/, by the user's decision
**Application version:** Avantage Plus System v2.0.0 (footer of v2dev). The ticket carries no fix version.
**Date:** 2026-11-02
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ✅ PASS — Ready for Release

**Rationale:** 16 of the 16 test cases that could run passed (100%), above the 90% the test plan requires. No bug is open: the two bugs from the first cycle (AP-2485 High, AP-2486 Medium) are Done in Jira and did not recur on Dev. No Blocking question is still open — by the user's decision of 2026-11-02, every open question was answered by what Dev does. One case (deleting a curve) was skipped because Dev has no delete function.

---

## Executive Summary

We tested the admin screen where staff create and edit **earning curves**. An earning curve is the month-by-month table that decides how much of a contract's premium counts as earned income. This was the second round of testing, run on the Dev environment.

Everything we could test works:
- The menu item, the list page and the create/edit form behave as the ticket describes.
- All three built-in calculation methods (Pro-Rata, Rule of 78 and Reverse Rule of 78) produce exactly the right numbers, for terms of 1, 12, 24, 36 and 60 months.
- Hand-entered "Custom" factors are saved and come back exactly as typed.
- The two problems found in the first round are fixed: switching a 12-month curve back to Pro-Rata now recalculates the table (AP-2485), and leaving a Custom factor blank now shows a message on that box instead of an error page (AP-2486).

Some behaviours were never specified in the ticket. The user decided that what Dev does is the accepted behaviour, and these answers are listed in the ticket comment so the author, Ken Nguyen, can object:
- There is **no delete** for earning curves, although the user story says "create, edit and delete".
- An odometer range whose start is greater than its end can be saved.
- Custom factors that do not add up to 100%, and negative factors, can be saved without a warning.
- "Is Enabled?" is a **checkbox**, while the acceptance criterion says "Yes/No toggle".

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 7 of 8 (REQ-008 Delete could not be tested: no delete control exists on Dev) |
| Total test cases | 17 |
| Passed | 16 (94.1% of 17) |
| Failed | 0 |
| Blocked | 0 |
| Skipped | 1 (AP2471_015 — delete) |
| **Pass rate** | **100%** (16 passed out of the 16 cases that ran; 17 designed − 1 skipped) |
| Pass rate threshold | 90% |
| Threshold met? | ✅ Yes |

The pass rate is the share of test cases that passed, counted over every case except the skipped one, as the project's release rule defines it. Over all 17 designed cases it is 94.1% (16 of 17), which also meets the threshold.

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 1 (AP-2485, first cycle) | 1 |
| Medium | 0 | 1 (AP-2486, first cycle) | 1 |
| Low | 0 | 0 | 0 |
| **Total** | **0** | **2** | **2** |

Defect density in this cycle is 0 new bugs across 17 test cases. The two resolved bugs were found in the first cycle (2026-10-04) and re-checked here by AP2471_004 and AP2471_014, which both passed.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 100% (13 of 13 High-priority cases executed) | ✅ |
| Pass rate | ≥ 90% | 100% (16 of 16 judged) | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 0 | 0 (AP-2485 Done) | ✅ |
| Blocking questions open | 0 | 0 (Q-001, Q-002 answered by observation on Dev, user decision 2026-11-02) | ✅ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

Coverage here means the share of a requirement's test cases that could be executed and judged (PASS or FAIL).

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — "Earning Curves" menu item | 1 | 1 | 0 | 0 | 100% |
| REQ-002 — Earning Curves list page | 1 | 1 | 0 | 0 | 100% |
| REQ-003 — Create / Edit form fields and validation | 2 | 2 | 0 | 0 | 100% |
| REQ-004 — Table follows Term month | 3 | 3 | 0 | 0 | 100% |
| REQ-005 — Pro-Rata / Rule of 78 / Reverse calculations | 4 | 4 | 0 | 0 | 100% |
| REQ-006 — Custom factors | 3 | 3 | 0 | 0 | 100% |
| REQ-007 — Save (create and edit) | 2 | 2 | 0 | 0 | 100% |
| REQ-008 — Delete | 1 | 0 | 0 | 0 | 0% (skipped — not built on Dev) |
| **Total** | **17** | **16** | **0** | **0** | **94%** |

Each case is counted once, under its main requirement: REQ-003 = AP2471_003, _013; REQ-004 = _007, _008, _017; REQ-005 = _004, _005, _006, _016; REQ-006 = _009, _010, _014; REQ-007 = _011, _012. Several cases also touch a second requirement; for example, AP2471_010 proves both Custom factors and Save.

---

## Defect Summary

No new defects in this cycle.

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 (2026-10-04) | Switching a 12-month curve back to Pro-Rata keeps the previous type's factors, and saves them | High | P2 | REQ-004, REQ-005 | [AP-2485](https://garantieavantageplus.atlassian.net/browse/AP-2485) | Done — not recurring |
| BUG-002 (2026-10-04) | Saving a Custom curve with an empty monthly factor shows an HTTP 500 error page | Medium | P2 | REQ-006, REQ-007 | [AP-2486](https://garantieavantageplus.atlassian.net/browse/AP-2486) | Done — not recurring |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2471_requirements-analysis.md` | 2026-11-01, questions answered 2026-11-02 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2471_test-plan.md` (v1.1) | 2026-11-01 |
| Test Cases | `qa-artifacts/3-test-cases/AP2471_TestCases_001-005.md`, `_006-010.md`, `_011-015.md`, `_016-017.md` (+ review findings `AP2471_ReviewFindings_2026-11-01.md`) | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md` | 2026-11-02 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2471_bug-report.md` | 2026-11-02 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/` (25 files) | 2026-11-02 |
| Review record | `qa-artifacts/7-reviews/AP-2471_review.md` (R3 APPROVE) | 2026-11-02 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2471_test-report.md` | 2026-11-02 |

---

## Risks and Observations

- **Tested on Dev, not staging.** The user chose Dev (v2dev) for this cycle. The first cycle's bugs were on staging; their fixes are confirmed on Dev only.
- **Unspecified behaviour was accepted as observed.** Save, Delete, field limits and Custom-factor rules have no written acceptance criteria. By the user's decision, what Dev does is treated as correct, so a PASS here means "works and does not contradict the ticket", not "matches a written design". The author can still object; the answers are listed in the ticket comment.
- **Delete is missing.** The user story promises delete, but there is no delete control on the list or the edit form (AP2471_015 skipped, Q-002). Test curves cannot be removed.
- **The form accepts curves that may be financially questionable.** An odometer range with start greater than end, Custom totals of 90%, 75% and 0%, and a negative factor all save without a warning (Q-006, Q-009). These were accepted under the user's decision.
- **"Is Enabled?" is a checkbox**, while acceptance criterion 6 of REQ-003 says "Yes/No toggle". It is judged as a yes/no control (reviewer R3 F-1).
- **A disabled curve is still offered downstream**: curve #13 (Is Enabled? No) appears in the Earning Group assign-curve dropdown (Q-012). This is outside this ticket but worth knowing.
- **The ticket's Reverse Rule of 78 example is still wrong at month 8** (it shows 53.85%; the formula and the build give 46.15%).
- **Test data left on Dev** (no delete): curves #32–#37 (`QA-AP2471-Custom-190721`, `QA-AP2471-Edited-190835`, `QA-AP2471-Neg-Range-190916`, `QA-AP2471-Neg-Custom90-191022`, `QA-AP2471-Switch-191209`, `QA-AP2471-Shorten-191304`). #34–#37 hold invalid data on purpose and must not be assigned to Earning Groups used by other tests.

---

## Recommendations

1. Ask Ken Nguyen to confirm, or object to, the observed answers in the s7 ticket comment — especially that delete is out of scope and that "Is Enabled?" may be a checkbox.
2. Decide whether Custom factors should be checked to total 100% and whether an odometer range must run low to high; if yes, open follow-up stories, since the current build allows both.
3. Correct the Reverse Rule of 78 example in AP-2471 (row 8 → 46.15%) so the ticket matches the formula.
4. Add a delete (or archive) function, or a cleanup route, so test and mistaken curves can be removed.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | PASS | _(automated)_ | 2026-11-02 |
| QA Lead | Vinh Le | Pending | | |
| Development Lead | Minh Lưu | Pending | | |
| Product Owner | Ken Nguyen | Pending | | |
