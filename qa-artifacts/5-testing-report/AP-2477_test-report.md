# Test Execution Report

**Report ID:** TR-20261101-001
**Project:** Avantage Plus v2 — Dealer portal
**Test Cycle:** AP-2477 — Simplify /quote/new/edit-vehicle to minimal fields with VIN decoder pre-fill. Run folder 5.2.0, single-ticket STLC run
**Application version:** Not known. The page footer reads "Avantage Plus System v2.0.0", and no build ID is shown
**Tested on:** Dev (v2dev) — `https://v2dev.garantieavantageplus.ca/`, by the user's decision. On 2026-10-28 the developer side commented on AP-2477 that the feature "is now on v2dev" and "is not ready for staging yet". Staging was not used for these results
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** 9 of 12 test cases passed (75%), which is below the 90% release threshold. Two High-severity bugs are open: AP-2507 (the "Décoder" button saves a quote) on dev and AP-2492 (the form is missing on staging). AP-2507 also stopped two more test cases from running.

---

## Executive Summary

We tested the new, shorter "Create a quote" vehicle form on the Dev environment. It asks the dealer for only a quote name, a VIN (the vehicle identification number), a brand, a model and a year. Nine of the twelve checks passed. The form shows exactly the five intended fields. It saves a quote with only brand, model and year. It refuses to save when one of those is missing. Other screens, such as adding a vehicle to inventory, keep their full set of fields. A quote made this way opens its warranty step without an error and asks for the missing kilometres. One important check failed. When a dealer types a VIN and clicks "Décoder" to fill in the vehicle automatically, the system immediately saves a quote with no name, instead of filling in the form for the dealer to review. Dealers cannot delete quotes, so every click leaves an unwanted quote behind. This failure (AP-2507, High) also stopped two related checks from running. The feature should not be released until AP-2507 is fixed and those three checks are re-run.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 5 of 7 fully passed; REQ-002 partly (1 of 2 cases passed); REQ-003 and REQ-007 not proven (0 cases passed) |
| Total test cases | 12 |
| Passed | 9 (75%) |
| Failed | 1 (8%) |
| Blocked | 2 |
| Skipped | 0 |
| **Pass rate** | **75%** (9 of 12; pass rate = cases passed ÷ all cases except skipped) |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 2 | 0 | 2 |
| Medium | 0 | 0 | 0 |
| Low | 0 | 0 | 0 |
| **Total** | **2** | **0** | **2** |

Defect density (bugs per test case): 2 ÷ 12 = 0.17.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 83% (5 of 6: AP2477_008 is BLOCKED) | ❌ |
| Pass rate | ≥ 90% | 75% (9 of 12) | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 0 | 2 (AP-2507, AP-2492) | ❌ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

Some test cases cover two requirements, so the per-requirement rows add up to more than 12.

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Five fields, in a fixed order | 2 | 2 | 0 | 0 | 100% |
| REQ-002 — "Décoder" only for decoder-enabled vehicle types | 2 | 1 | 1 | 0 | 50% |
| REQ-003 — Decoding a VIN pre-fills and keeps the hidden details | 2 | 0 | 1 | 1 | 0% |
| REQ-004 — Only Brand, Model and Year required | 4 | 4 | 0 | 0 | 100% |
| REQ-005 — A missing required field is refused | 2 | 2 | 0 | 0 | 100% |
| REQ-006 — The other vehicle forms are unchanged | 1 | 1 | 0 | 0 | 100% |
| REQ-007 — Quote name kept across a decode | 1 | 0 | 0 | 1 | 0% |
| **Total (unique test cases)** | **12** | **9** | **1** | **2** | **75%** |

**Per test case:**

| TC ID | Title | Priority | Status | Bug |
|---|---|:---:|:---:|---|
| AP2477_001 | The new-quote vehicle form shows only Quote name, VIN, Brand, Model and Year, in that order | High | PASS | — |
| AP2477_002 | Only Brand, Model and Year carry the required marker | Medium | PASS | — |
| AP2477_003 | Saving with only Brand, Model and Year creates the quote and opens its details page | High | PASS | — |
| AP2477_004 | A vehicle saved from the minimal form has no kilometres, condition, designation or price | High | PASS | — |
| AP2477_005 | Saving without a Brand is refused with an error and no quote is created | Medium | PASS | — |
| AP2477_006 | Saving with Brand and Model but no Year is refused and no quote is created | Medium | PASS | — |
| AP2477_007 | Clicking "Décoder" with a valid VIN fills Brand, Model and Year | High | FAIL | AP-2507 |
| AP2477_008 | A quote saved after decoding keeps the decoded transmission, engine, fuel, cylinders and turbo | High | BLOCKED | AP-2507 |
| AP2477_009 | A Quote name typed before "Décoder" is kept and saved with the quote | Medium | BLOCKED | AP-2507 |
| AP2477_010 | "Décoder" shows for a car type but not for an RV, boat or construction type | Medium | PASS | — |
| AP2477_011 | The inventory "add vehicle" form still shows Price and Kilometers and requires them | Medium | PASS | — |
| AP2477_012 | A quote from the minimal form opens its details and warranty step without an error page | High | PASS | — |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | The simplified new-quote vehicle form is missing on staging: /quote/new/edit-vehicle returns HTTP 404 | High | P1 | REQ-001 to REQ-007 (staging) | [AP-2492](https://garantieavantageplus.atlassian.net/browse/AP-2492) | Open (Backlog) |
| BUG-002 | Clicking "Décoder" on the new-quote vehicle form saves a quote and empties the form instead of re-rendering it pre-filled | High | P1 | REQ-003, REQ-007 | [AP-2507](https://garantieavantageplus.atlassian.net/browse/AP-2507) | Open (Backlog) |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2477_requirements-analysis.md` | 2026-10-11 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2477_test-plan.md` | 2026-10-12 |
| Test Cases | `qa-artifacts/3-test-cases/AP2477_TestCases_001-005.md`, `_006-010.md`, `_011-012.md` | 2026-10-12 (results 2026-11-01) |
| Execution Log | `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2477_2026-11-01.md` (the 2026-10-12 staging log is kept for the record) | 2026-11-01 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2477_bug-report.md` | 2026-11-01 |
| Review record | `qa-artifacts/7-reviews/AP-2477_review.md` (R3 APPROVE) | 2026-11-01 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/` (20 files from the dev run, plus 4 from the staging run) | 2026-11-01 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2477_test-report.md` | 2026-11-01 |

---

## Risks and Observations

- **Results are from Dev, not staging.** On staging the form does not exist yet (AP-2492). The developer comment of 2026-10-28 says that the feature "is not ready for staging yet". Once it reaches staging, the High-priority cases should be run again there.
- **Test data left on Dev.** Dealers cannot delete quotes. Quote 6437 and vehicle 1067 (Ford Focus 2008) were created without intent by the one "Décoder" click. Quotes 6438, 6439 "QA-AP2477-004-145431" and 6440 "QA-AP2477-012-145539", with vehicles 1068, 1069 and 1070 (Toyota Corolla 2020), were created on purpose. A vehicle saved from this form also appears in the dealer's Vehicle Inventory (seen for vehicle 1067).
- **Hidden decoded details may be incomplete (observation for the AP2477_008 re-run).** The form renders only transmission and engine-size unit as hidden inputs. Fuel type, cylinders, engine size and turbo are not on the page, although the ticket asks for them to stay as hidden inputs. Vehicle 1067 did store those values on the save that the decode triggered. Whether they survive the dealer's own Save can only be checked once AP-2507 is fixed.
- **Edit-form defaults.** A vehicle saved from the minimal form has no condition and no designation. The full vehicle edit form displays "new" and "Particular" for these empty values. A dealer who opens that form and presses Save would store those values without choosing them.
- **Inventory "Create quote" still opens the old client-first form.** For inventory vehicle 915, "Create quote" leads to `/quote/new/client?fromVehicleId=915`. This is outside the ticket's stated scope, so it is recorded here and not filed.
- **Open questions are not classified.** The analysis lists six open questions (Q-001 to Q-006) without a Blocking, Judgement or Info impact. The dev run answered Q-001, Q-002, Q-003 and Q-006 by observation. Q-004 (quote name across a decode) is blocked by AP-2507, and Q-005 (accepted years) was not observed.

---

## Recommendations

1. Fix AP-2507: "Décoder" must re-render the form pre-filled without saving. Check first whether the `novalidate` flag reaches the server under the form's real name, `quote_vehicle`.
2. Once AP-2507 is fixed, re-run AP2477_007, AP2477_008 and AP2477_009 on dev with `AP-2477 --from s4`. During AP2477_008, check whether fuel type, cylinders, engine size and turbo are rendered as hidden inputs and are stored after the dealer's own Save.
3. Decide what happens to AP-2492, since the team says the feature is not meant for staging yet. Re-run the High-priority cases on staging when it is deployed there.
4. Ask the developer (Minh Lưu) to confirm the accepted Year range (Q-005), so a boundary case can be added.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-01 |
| QA Lead | Vinh Le | Pending | | |
| Development Lead | Minh Lưu | Pending | | |
| Product Owner | Nicolas-Eric Tain | Pending | | |
