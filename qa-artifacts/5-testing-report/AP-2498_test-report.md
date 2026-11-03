# Test Execution Report

**Report ID:** TR-20261102-002
**Project:** Avantage Plus v2 — Dealer portal, AP-2498: Roadside protection: keep the existing vehicle form visible and add VIN + Year
**Test Cycle:** AP-2498 single-ticket STLC run, run folder no-sprint (the ticket has no sprint and no fix version)
**Application version:** Not known as a release number — the Dev footer reads "Avantage Plus System v2.0.0"; tested on the Dev build deployed on 2026-11-02
**Tested on:** **Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal, dealer 1380 ("Test QA staging"), by the user's decision. Staging was not tested.
**Date:** 2026-11-02
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** Only 2 of 14 test cases passed (14%), far below the 90% needed, because three defects in the add-roadside-protection window (AP-2523, AP-2524, AP-2525) break six of the eight requirements, and two more cases could not be run.

---

## Executive Summary

AP-2498 changes the window that opens when a dealer adds roadside protection to a quote. The window must always show a small vehicle form — VIN, Year, Make and Model with a Continue button — above either the list of roadside products or, when there are none, a notice asking for the make and model. The VIN must be required. The QA team ran 14 test cases on the Dev environment. Several parts work: the Make and Model lists fill correctly, a new quote shows the vehicle's VIN and year, the values a dealer submits are saved, and the prices refresh in the same window without leaving the quote. But only 2 of the 14 cases passed, because of three medium-severity defects in that window. First, the notice shown when there are no products says "No road side protection products are available for this vehicle." instead of the make-and-model message the ticket names (AP-2523). Second, as soon as products are listed, the vehicle form folds away behind an "Edit" link, which is exactly what the ticket was written to stop (AP-2524) — the same pattern was already reported on the extended-warranty window (AP-2521), and the ticket author is asked to confirm the design. Third, the VIN is not required: a dealer can leave it empty, get prices, and save the make and model (AP-2525). Two cases were not judged: one waits for the author to say which inputs the form may contain, and one is blocked by the existing bug AP-2508. The story should not be released until these defects are fixed or, for AP-2524, confirmed as intended.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 8 of 8 (REQ-008 only in part — see Requirement Coverage) |
| Total test cases | 14 |
| Passed | 2 (14%) |
| Failed | 10 (71%) |
| Blocked | 2 (14%) |
| Skipped | 0 |
| **Pass rate** | **14% (2 of 14)** |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

The pass rate is the share of test cases that passed, out of all cases except skipped ones: 2 ÷ 14 = 14%. Blocked cases count as not passed. Defect density (bugs per test case) is 3 ÷ 14 = 0.21.

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
| All High-priority TCs executed | 100% | 90% (9 of 10) — AP2498_004 was parked before execution | ❌ |
| Pass rate | ≥ 90% | 14% (2 of 14) | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | 0 (test plan §5) | 0 | ✅ |
| Every FAIL filed, linked or dismissed | Yes | Yes — 10 FAILs covered by AP-2523, AP-2524, AP-2525 | ✅ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — The form is always shown, results or notice below it (AP2498_001, 002, 014) | 3 | 0 | 2 | 1 | 67% |
| REQ-002 — The form stays when make/model are stored (AP2498_003) | 1 | 0 | 1 | 0 | 100% |
| REQ-003 — Existing fields plus VIN and Year; only VIN required (AP2498_004, 005, 006) | 3 | 0 | 2 | 1 | 67% |
| REQ-004 — Make/Model lists from the AutoShield catalogue (AP2498_007) | 1 | 1 | 0 | 0 | 100% |
| REQ-005 — Prefill from existing data (AP2498_008) | 1 | 1 | 0 | 0 | 100% |
| REQ-006 — Submit saves on the roadside program and re-quotes in place (AP2498_009, 010) | 2 | 0 | 2 | 0 | 100% |
| REQ-007 — A VIN-only submit is accepted and saved (AP2498_012) | 1 | 0 | 1 | 0 | 100% |
| REQ-008 — Results update and the form stays (AP2498_011, 013) | 2 | 0 | 2 | 0 | 100% of cases; "no longer qualify" not covered |
| **Total** | **14** | **2** | **10** | **2** | **86% (12 of 14 executed)** |

Coverage here means the share of the requirement's cases that were executed and judged. Each case is counted once, under its main requirement; AP2498_009 and 010 also touch REQ-005, and AP2498_011 also touches REQ-006.

**Not covered — REQ-008 "or no longer qualify" (review R3 F-1).** The acceptance criterion "Results update without hiding the form" covers two directions: a vehicle that newly qualifies for products, and one that no longer qualifies. Only the first was produced (AP2498_011). AP2498_013 tried the second by changing a priced vehicle to a 2003 Honda Accord, but AutoShield on Dev returned the same five tiers for every make and model submitted (open question Q-001), so no "no longer qualifies" state could be reached. AP2498_013 stays FAIL because the form folded again after the submit (AP-2524), but it does not count as covering the "no longer qualify" direction.

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | The roadside-protection modal shows "No road side protection products are available for this vehicle." instead of the make-and-model notice the ticket names | Medium | P2 | REQ-001, REQ-007 | [AP-2523](https://garantieavantageplus.atlassian.net/browse/AP-2523) | Open |
| BUG-002 | When products are listed, the roadside-protection modal folds the vehicle form (VIN, Make, Model, Year, Continue) behind an "Edit" link | Medium | P2 | REQ-001, REQ-002, REQ-008 | [AP-2524](https://garantieavantageplus.atlassian.net/browse/AP-2524) | Open |
| BUG-003 | The VIN field of the roadside-protection form is not required: an empty-VIN Continue returns prices and saves the Make and Model | Medium | P2 | REQ-003 | [AP-2525](https://garantieavantageplus.atlassian.net/browse/AP-2525) | Open |

Which failed cases each bug explains: AP-2523 fails AP2498_001 and 012. AP-2524 fails AP2498_002, 003, 009, 010, 011 and 013. AP-2525 fails AP2498_005 and 006. Each is linked to AP-2498 and to AP-2508 as *relates to*; AP-2524 is also linked to AP-2521, the same folded-form pattern on the extended-warranty window. All three are assigned to Ken Nguyen and sit in Backlog.

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2498_requirements-analysis.md` | 2026-11-01 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2498_test-plan.md` | 2026-11-01 |
| Test Cases | `qa-artifacts/3-test-cases/AP2498_TestCases_001-005.md`, `AP2498_TestCases_006-010.md`, `AP2498_TestCases_011-014.md` (review: `AP2498_ReviewFindings_2026-11-01.md`) | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2498_2026-11-02.md` | 2026-11-02 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2498_bug-report.md` | 2026-11-02 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/` (19 files) | 2026-11-02 |
| Review record | `qa-artifacts/7-reviews/AP-2498_review.md` (R1, R2 rounds 1–3, R3) | 2026-11-01 / 2026-11-02 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2498_test-report.md` | 2026-11-02 |

---

## Risks and Observations

- **AP2498_004 is BLOCKED — parked at Gate B (review R2 round 3).** Its step 5 required the form to contain "nothing else" than VIN, Year, Make, Model and Continue, but the form probably carries a hidden security-token input (`quote_auto_shield_make_model[_token]`, seen in other cases). The case stays BLOCKED until the ticket author confirms which inputs the form must contain. As a result the first acceptance criterion of REQ-003 ("contains exactly the existing fields … plus a plain VIN text input and an editable Year input") has no executed case.
- **AP2498_014 is BLOCKED by AP-2508.** A product tier can be selected, but the product section has no "Save and Generate Contract" button and no VIN field on the current Dev build, which AP-2508 already reports. The button's state and the product step's VIN (Q-012) could not be checked.
- **AP-2524 may be intended.** The form is expanded while no products are listed and folds as soon as they are, and the extended-warranty window does the same (AP-2521). The ticket's title and acceptance criteria say the form stays visible, so it is filed as a bug and the decision is left to the ticket author. If the author confirms the design, the six affected cases will be corrected.
- **AutoShield on Dev prices any make and model (Q-001).** With Make and Model empty no products come back; with any make and model (any year 2003–2022, even with an empty VIN) the same five tiers come back. That is why REQ-008's "no longer qualify" direction could not be tested.
- **The no-VIN state could not be prepared.** The inventory form on Dev refuses to save a vehicle without a VIN, so every "Vehicle N" case used its fallback VIN, as the test cases allow (review R3 F-2). AP2498_001 step 1 is marked passed on that set-up; its wording should be adjusted when the case is next edited.
- **Values submitted in the window win over the vehicle's and do not change the inventory vehicle** (Q-008, Q-010): the roadside program keeps its own VIN, year, make and model.
- **A first Continue creates the roadside row** on the quote ("CA$0.00" with Edit · Generate Contract · Delete), even when nothing is chosen afterwards.
- **Test data left on Dev:** vehicles 1106–1118 and quotes 6514–6526 (clients client.stage.2498001–2498014@yopmail.com, none for 004). Quotes 6516–6518 and 6521–6526 hold CA$0.00 roadside rows; no contract was generated and Save was never pressed. Nothing was deleted (no cleanup procedure is defined).

---

## Recommendations

1. Show the existing message "In order to get a quote for road side protection, please specify the make and model of the vehicle." below the form when no products come back (AP-2523).
2. Ticket author: decide on AP-2498 whether the vehicle form must stay expanded when products are listed, as the title and acceptance criteria say, or whether the folded summary with "Edit" is the intended design — and decide the same for AP-2521 so both windows behave alike (AP-2524).
3. Make the VIN input required in the browser and on the server, so an empty-VIN Continue is refused and saves nothing (AP-2525).
4. Ticket author: state which inputs the form may contain (for example, whether the hidden security token counts), so AP2498_004 can be un-parked and run.
5. Provide a make/model that AutoShield on Dev does not price, or a test switch, so the "no longer qualify" direction of REQ-008 can be tested.
6. When the fixes reach Dev, re-test with `AP-2498 --from s4`; run AP2498_014 again once AP-2508 is fixed.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-02 |
| QA Lead | Vinh Le - QC | Pending | | |
| Development Lead | Not known — to be named by the team | Pending | | |
| Product Owner | Nicolas-Eric Tain (ticket reporter) | Pending | | |
