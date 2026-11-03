# Test Execution Report

**Report ID:** TR-20261102-001
**Project:** Avantage Plus v2 — Dealer portal, AP-2497: Add extended warranty to a quote: capture missing vehicle fields instead of a dead end
**Test Cycle:** AP-2497 single-ticket STLC run, run folder no-sprint (the ticket has no sprint and no fix version)
**Application version:** Not known — the Dev build exposes no version number to the dealer; tested on the Dev build deployed on 2026-11-02
**Tested on:** **Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal, dealer 1380 ("Test QA staging"), by the user's decision. Staging was not tested.
**Date:** 2026-11-02
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** Only 4 of 15 test cases passed (27%), far below the 90% needed, because three defects in the add-extended-warranty window (AP-2520, AP-2521, AP-2522) break four of the five acceptance criteria.

---

## Executive Summary

AP-2497 adds a short vehicle form to the window that opens when a dealer adds an extended warranty to a quote, so that a dealer whose vehicle is missing a value can fix it there instead of hitting the message "There are no eligible program for the vehicle". The QA team ran 15 test cases on the Dev environment, covering all five acceptance criteria. The core of the feature works: values typed in the form are saved on the vehicle, the list of eligible warranty programs is recalculated in the same window, and invalid values are never saved. But only 4 of the 15 cases passed, because of three medium-severity defects in the same window. The form is missing one of the six fields the ticket asks for (Vehicle type, AP-2520). For a vehicle with every value filled in, the form is hidden behind an "Edit" link and folds away again after every save (AP-2521) — this may be a deliberate design, and the ticket author is asked to decide. And when the dealer submits an invalid value, the error message is drawn inside the hidden form, so the dealer sees no message at all (AP-2522). The story should not be released until these are fixed or, for AP-2521, confirmed as intended.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 5 of 5 |
| Total test cases | 15 |
| Passed | 4 (27%) |
| Failed | 11 (73%) |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **27% (4 of 15)** |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

The pass rate is the share of test cases that passed, out of all cases except skipped ones: 4 ÷ 15 = 27%. Defect density (bugs per test case) is 3 ÷ 15 = 0.2.

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 3 | 0 | 3 |
| Low | 0 | 0 | 0 |
| **Total** | **3** | **0** | **3** |

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 100% (10 of 10) | ✅ |
| Pass rate | ≥ 90% | 27% (4 of 15) | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | 0 (test plan §5) | 0 | ✅ |
| Every FAIL filed, linked or dismissed | Yes | Yes — 11 FAILs covered by AP-2520, AP-2521, AP-2522 | ✅ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — The form is shown in the add-extended-warranty flow, results below it (AP2497_001, 002) | 2 | 0 | 2 | 0 | 100% |
| REQ-002 — The form has only the six required fields, all editable (AP2497_003) | 1 | 0 | 1 | 0 | 100% |
| REQ-003 — The form is prefilled from the stored vehicle (AP2497_004) | 1 | 0 | 1 | 0 | 100% |
| REQ-004 — Submit saves the vehicle and re-evaluates eligibility in place (AP2497_005, 006, 007, 015) | 4 | 1 | 3 | 0 | 100% |
| REQ-005 — Invalid Year/Kilometers give a field error and save nothing (AP2497_008–014) | 7 | 3 | 4 | 0 | 100% |
| **Total** | **15** | **4** | **11** | **0** | **100%** |

Coverage here means every case of the requirement was executed. AP2497_014 also touches REQ-002 (Make and Model as required fields) and is counted once, under REQ-005. AP2497_012, 013 and 014 are *record-only* cases: they record behaviour the ticket does not specify (year and mileage limits, empty Make/Model) and fail only on an objective fault such as an error page.

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | The vehicle form in the add-extended-warranty modal has no Vehicle type field | Medium | P2 | REQ-002, REQ-003 | [AP-2520](https://garantieavantageplus.atlassian.net/browse/AP-2520) | Open |
| BUG-002 | The add-extended-warranty modal hides the vehicle form behind "Edit" on open and collapses it again after every "Update vehicle" | Medium | P2 | REQ-001, REQ-004 | [AP-2521](https://garantieavantageplus.atlassian.net/browse/AP-2521) | Open |
| BUG-003 | A refused "Update vehicle" shows no error: the field error is drawn inside the collapsed vehicle form | Medium | P2 | REQ-005 | [AP-2522](https://garantieavantageplus.atlassian.net/browse/AP-2522) | Open |

Which failed cases each bug explains: AP-2520 fails AP2497_001, 003, 004 and 006, and is part of the failure of 005 and 007. AP-2521 fails AP2497_002, 005, 006 and 007, and is also seen in 001 (on opening) and in 003 and 006 (after changing Brand). AP-2522 fails AP2497_008, 009, 010 and 011, and is reproduced in the record-only cases 012, 013 and 014. All three are linked to AP-2497 as *relates to*; AP-2522 is also linked to AP-2521.

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2497_requirements-analysis.md` | 2026-11-01 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2497_test-plan.md` | 2026-11-01 |
| Test Cases | `qa-artifacts/3-test-cases/AP2497_TestCases_001-005.md`, `AP2497_TestCases_006-010.md`, `AP2497_TestCases_011-015.md` (review: `AP2497_ReviewFindings_2026-11-01.md`) | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md` | 2026-11-02 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2497_bug-report.md` | 2026-11-02 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/` (33 files) | 2026-11-02 |
| Review record | `qa-artifacts/7-reviews/AP-2497_review.md` (R1, R2, R3 rounds 1–2) | 2026-11-01 / 2026-11-02 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2497_test-report.md` | 2026-11-02 |

---

## Risks and Observations

- **The ticket's central path was not run as a test case.** The story exists for a vehicle with no mileage: the dealer fills Kilometers in the window and the "no eligible program" notice is replaced by a list of programs. On Dev the inventory form refuses to save a vehicle without mileage, so AP2497_001, 005 and 015 ran on a fallback vehicle with 15000 km, whose program list was already shown (005 and 015 then typed 25000, so the save was still proven). The no-mileage state was only observed outside the test cases, on extra vehicle 1097 / quote 6505 made through the vehicle-first quote form: the window opened with the form expanded, Kilometers empty and the "no eligible program" notice below. Nothing was submitted there. When the bugs come back for re-test, the test cases should create the vehicle through `/quote/new/edit-vehicle` and run 001, 005 and 015 from that state (review R3 F-5).
- **AP-2521 may be intended.** A vehicle with no mileage opens with the form expanded, so the collapse for a complete vehicle looks deliberate. The acceptance criteria say the form "is shown" and "remains visible with the saved values", so it is filed as a bug and the decision is left to the ticket author. If the author confirms the design, the affected test cases will be corrected, but AP-2522 stays valid.
- **Fallback steps marked as passed.** Step 1 of AP2497_001, 005 and 015 is marked passed although the planned "no mileage" vehicle could not be made; the fallback described in the test case was used instead (review R3 F-3).
- **Passed steps that only cover five fields.** Step 5 of AP2497_002, 006 and 007 passed for the five fields that exist; Vehicle type could not be checked because the field is missing (review R3 F-4). Each of these cases already fails at step 3.
- **Identical "after submit" screenshots.** The screenshots taken right after a refused submit in AP2497_009, 010 and 011 are byte-identical to AP2497_008's, because the collapsed window looks the same each time. Each is paired with a distinct "after Edit" image that shows that case's own input (review R3 round 2 F-1). The HTTP status of AP2497_010's Year `-2020` submit was not re-read in the re-run; the first run recorded 200 (F-2).
- **Saving changes the inventory vehicle itself**, not a copy held by the quote: vehicles 1085, 1086, 1093 and 1096 show the values submitted in the window. The ticket does not say which is intended (question Q-007); this is recorded, not judged.
- **Other observations not judged by any case:** the Honda Model list in the window has a blank option and "Civic" twice; the Brand list for the no-mileage vehicle also contains RV and boat makes (Airstream, Bayliner).
- **Test data left on Dev:** vehicles 1082–1097 and quotes 6490–6505 (clients client.stage.970–984). Vehicles 1085 and 1096 are now at 25000 km, 1086 is now a Honda Civic 2019 with 48000 km and Diesel, 1093 is at 0 km, and quote 6491 holds an extended warranty without a contract. Nothing was deleted (no cleanup procedure is defined).
- **Navigation index not refreshed.** The navigation map's "Quote creation" row does not yet mention the add-extended-warranty window mapping and still says `/quote/new/edit-vehicle` is not deployed, although it works on Dev as of 2026-11-02 (review R3 F-7).

---

## Recommendations

1. Add the Vehicle type field to the add-extended-warranty vehicle form, prefilled from the vehicle's stored type (AP-2520), so the dealer can correct every value the eligibility check uses without leaving the quote.
2. Ticket author: decide on AP-2521 whether the vehicle form should stay visible on opening and after "Update vehicle", as the acceptance criteria say, or whether the collapsed summary with "Edit" is the intended design — and write the decision on AP-2497.
3. Make a refused "Update vehicle" show its error to the dealer in either layout — for example by keeping the form expanded when it holds errors (AP-2522).
4. When the fixes reach Dev, re-test with `AP-2497 --from s4`, with the no-mileage vehicle made through `/quote/new/edit-vehicle` for AP2497_001, 005 and 015, so the ticket's central path is run as a test case.
5. Before testing on staging, confirm the build is deployed there; this run covered Dev only.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-02 |
| QA Lead | Vinh Le - QC | Pending | | |
| Development Lead | Not known — to be named by the team | Pending | | |
| Product Owner | Nicolas-Eric Tain (ticket reporter) | Pending | | |
