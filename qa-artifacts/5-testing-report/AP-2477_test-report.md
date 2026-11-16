# Test Execution Report

**Report ID:** TR-20261107-001 (supersedes TR-20261101-001)
**Project:** Avantage Plus v2 — Dealer portal
**Test Cycle:** AP-2477 — Simplify /quote/new/edit-vehicle to minimal fields with VIN decoder pre-fill. Run folder 5.2.0, single-ticket STLC run — re-test after the AP-2507 fix (orchestrator plan rule P5)
**Application version:** Not known. The page footer reads "Avantage Plus System v2.0.0", and no build ID is shown
**Tested on:** Environment: Dev (v2dev) — `https://v2dev.garantieavantageplus.ca/`, the registry's `execution_env`. Executed 2026-11-07, 09:47–09:58 UTC. Staging was not opened
**Date:** 2026-11-07
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** 11 of 12 test cases passed (91.7%), which **meets** the 90% release threshold. But the test plan's exit criteria also require no open High-severity bug, and two are still open in the tracker: AP-2507 (the "Décoder" button saved a quote — fixed on this build and passed here, but still in QC until its own re-test closes it later today) and AP-2492 (the form is missing on staging, Backlog). In addition, the second acceptance criterion is not fully met: the decoded engine size unit is stored wrong (new bug AP-2552, Medium). What is risked by releasing now: decoded vehicles carry a wrong engine size unit, and the feature is still absent on staging.

---

## Executive Summary

We re-tested the new, shorter "Create a quote" vehicle form on the Dev environment after the developers fixed the problem found last week. The form asks the dealer for only a quote name, a VIN (the vehicle identification number), a brand, a model and a year. Eleven of the twelve checks passed. The fix works: clicking "Décoder" now fills in Ford, Focus and 2008 on the form for the dealer to review, and no longer saves an unwanted quote. A quote name typed before decoding is kept. The form saves with only brand, model and year, refuses to save when one is missing, and the resulting quote opens its warranty step without an error. Other screens, such as adding a vehicle to inventory, are unchanged. One check failed: after decoding and saving, the vehicle's engine size unit is stored as "Litre" although the decoder said "kW". The other decoded details were stored. This is a smaller problem (Medium) that a dealer could correct by hand, but it breaks the ticket's promise that decoded values are stored. Before release, AP-2552 needs a fix or a developer decision, AP-2507 needs its own re-test to close it, and the team must decide what to do about the staging gap (AP-2492).

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 6 of 7 fully passed; REQ-003 partly (1 of 2 cases passed) |
| Total test cases | 12 |
| Passed | 11 (91.7%) |
| Failed | 1 (8.3%) |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **91.7%** (11 of 12; pass rate = cases passed ÷ all cases except skipped) |
| Pass rate threshold | 90% |
| Threshold met? | ✅ Yes |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 2 | 0 | 2 |
| Medium | 1 | 0 | 1 |
| Low | 0 | 0 | 0 |
| **Total** | **3** | **0** | **3** |

"Resolved" counts only bugs in the tracker's Done status. AP-2507 is fixed on this build (not reproduced) but stays open until its own re-test moves it.

Defect density (bugs per test case): 3 ÷ 12 = 0.25 over the whole cycle; 1 ÷ 12 = 0.08 found in this run.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 100% (6 of 6: 001, 003, 004, 007, 008, 012) | ✅ |
| Pass rate | ≥ 90% | 91.7% (11 of 12) | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 0 | 2 (AP-2507 in QC awaiting its own re-test; AP-2492 in Backlog) | ❌ |
| Test report generated | Yes | Yes | ✅ |
| All tracker tickets created | Yes | Yes — AP-2552 filed for the one new failure | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

Some test cases cover two requirements, so the per-requirement rows add up to more than 12.

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Five fields, in a fixed order | 2 | 2 | 0 | 0 | 100% |
| REQ-002 — "Décoder" only for decoder-enabled vehicle types | 2 | 2 | 0 | 0 | 100% |
| REQ-003 — Decoding a VIN pre-fills and keeps the hidden details | 2 | 1 | 1 | 0 | 50% |
| REQ-004 — Only Brand, Model and Year required | 4 | 4 | 0 | 0 | 100% |
| REQ-005 — A missing required field is refused | 2 | 2 | 0 | 0 | 100% |
| REQ-006 — The other vehicle forms are unchanged | 1 | 1 | 0 | 0 | 100% |
| REQ-007 — Quote name kept across a decode | 1 | 1 | 0 | 0 | 100% |
| **Total (unique test cases)** | **12** | **11** | **1** | **0** | **91.7%** |

**Per test case:**

| TC ID | Title | Priority | Status | Bug |
|---|---|:---:|:---:|---|
| AP2477_001 | The new-quote vehicle form shows only Quote name, VIN, Brand, Model and Year, in that order | High | PASS | — |
| AP2477_002 | Only Brand, Model and Year carry the required marker | Medium | PASS | — |
| AP2477_003 | Saving with only Brand, Model and Year creates the quote and opens its details page | High | PASS | — |
| AP2477_004 | A vehicle saved from the minimal form has no kilometres, condition, designation or price | High | PASS | — |
| AP2477_005 | Saving without a Brand is refused with an error and no quote is created | Medium | PASS | — |
| AP2477_006 | Saving with Brand and Model but no Year is refused and no quote is created | Medium | PASS | — |
| AP2477_007 | Clicking "Décoder" with a valid VIN fills Brand, Model and Year (the AP-2507 scenario) | High | PASS | — (AP-2507 not reproduced) |
| AP2477_008 | A quote saved after decoding keeps the decoded transmission, engine, fuel, cylinders and turbo | High | FAIL | AP-2552 |
| AP2477_009 | A Quote name typed before "Décoder" is kept and saved with the quote | Medium | PASS | — |
| AP2477_010 | "Décoder" shows for a car type but not for an RV, boat or construction type | Medium | PASS | — |
| AP2477_011 | The inventory "add vehicle" form still shows Price and Kilometers and requires them | Medium | PASS | — |
| AP2477_012 | A quote from the minimal form opens its details and warranty step without an error page | High | PASS | — |

**Compared with 2026-11-01:** AP2477_007 FAIL → PASS; AP2477_008 BLOCKED → FAIL; AP2477_009 BLOCKED → PASS; the other nine unchanged (PASS). Pass rate 75% → 91.7%.

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | The simplified new-quote vehicle form is missing on staging: /quote/new/edit-vehicle returns HTTP 404 | High | P1 | REQ-001 to REQ-007 (staging) | [AP-2492](https://garantieavantageplus.atlassian.net/browse/AP-2492) | Open (Backlog) — not re-tested, Dev only |
| BUG-002 | Clicking "Décoder" on the new-quote vehicle form saves a quote and empties the form instead of re-rendering it pre-filled | High | P1 | REQ-003, REQ-007 | [AP-2507](https://garantieavantageplus.atlassian.net/browse/AP-2507) | Open (QC) — not reproduced 2026-11-07; its own re-test owns the verdict |
| BUG-003 | Saving a quote after "Décoder" stores the decoded engine size unit "kW" as "Litre" on the vehicle | Medium | P2 | REQ-003 | [AP-2552](https://garantieavantageplus.atlassian.net/browse/AP-2552) | Open (Backlog, new) |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2477_requirements-analysis.md` | 2026-10-11 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2477_test-plan.md` | 2026-10-12 |
| Test Cases | `qa-artifacts/3-test-cases/AP2477_TestCases_001-005.md`, `_006-010.md`, `_011-012.md` | 2026-10-12 (results 2026-11-07) |
| Execution Log | `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2477_2026-11-07.md` (the 2026-11-01 and 2026-10-12 logs are kept for the record) | 2026-11-07 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2477_bug-report.md` | 2026-11-07 |
| Review record | `qa-artifacts/7-reviews/AP-2477_review.md` (R3 round 1 APPROVE, 2026-11-07) | 2026-11-07 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/` — 23 `-20261107_*.png` files and `AP2477_008-step1-4-DecodedVsStoredValues-20261107_fail.txt` | 2026-11-07 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2477_test-report.md` | 2026-11-07 |

---

## Risks and Observations

- **AP-2507 context only.** AP2477_007, the AP-2507 scenario, passed on 2026-11-07 between 09:47 and 09:58 UTC: "Décoder" re-renders the form and saves nothing. This run did not change AP-2507; it is in QC and its own bug re-test (AP2507_001–003, later today) decides whether it closes.
- **Results are from Dev, not staging.** The form does not exist on staging (AP-2492, not re-tested). Once it reaches staging, the High-priority cases should be run there.
- **Decoder carries an existing vehicle id.** After "Décoder", the hidden `quote_vehicle[id]` holds 863, an existing inventory vehicle with the same VIN. Saving created new vehicles (1146, 1147) and left 863 unchanged. No criterion covers reuse; noted as a risk in AP-2552.
- **Fuel type and transmission cannot be proven decoded.** A vehicle saved without a decode shows the same GASOLINE / Automatic, so only cylinders and engine size are proven to come from the decode (R3 F-1).
- **Form layout changed by AP-2533.** The Vehicle type select now sits above Quote name, labels are English and input ids are `#quote_vehicle_*`. No result was affected. The case wording should be refreshed in the next design maintenance run (R3 F-2); correct-cases was not run, because it is only for failures confirmed as not a bug.
- **Test data left on Dev.** Quotes 6588 (no name), 6589 "QA-AP2477-004-095118", 6590 "QA-AP2477-012-095207", 6591 "QA-AP2477-008-095303", 6592 "QA-AP2477-009-095457", with vehicles 1143–1147. Dealers cannot delete quotes.
- **Edit-form defaults and "No entities found".** Unchanged from 2026-11-01: the full vehicle edit form displays "new" and "Particular" for empty condition and designation, and a blue "No entities found" alert shows on a freshly saved quote. Neither is an error page.
- **Open questions are not classified.** The analysis lists Q-001 to Q-006 without a Blocking / Judgement / Info impact. This run answered Q-001, Q-002, Q-003, Q-004 and Q-006 by observation; Q-005 (accepted years) was not observed.

---

## Recommendations

1. Fix AP-2552, or have the developer state which unit is correct: check whether the save maps `quote_vehicle[engineSizeUnit]` onto the new vehicle, and whether the decoder should return "kW" for a combustion engine. Then re-run AP2477_008 with `AP-2477 --from execute`.
2. Let AP-2507's own re-test (AP2507_001–003) close it; this run's AP2477_007 PASS supports that.
3. Decide what happens to AP-2492, since the team says the feature is not meant for staging yet. Re-run the High-priority cases on staging when it is deployed there.
4. Refresh the test-case wording for the AP-2533 layout in the next design maintenance run.
5. Ask the developer (Minh Lưu) to confirm the accepted Year range (Q-005), so a boundary case can be added.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-07 |
| QA Lead | Vinh Le | Pending | | |
| Development Lead | Minh Lưu | Pending | | |
| Product Owner | Nicolas-Eric Tain | Pending | | |
