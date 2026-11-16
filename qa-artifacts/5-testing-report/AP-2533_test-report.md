# Test Execution Report

**Report ID:** TR-20261107-002
**Project:** AP (Avantage)
**Test Cycle:** AP-2533 story run — "Update quote form UI" — run folder no-sprint
**Application version:** Dev (https://v2dev.garantieavantageplus.ca), footer "Avantage Plus System v2.0.0", page bundle `/build/app.18b4959e.js` (the build that carries this ticket's decoder change, confirmed by the build check in AP2533_001 step 1). No build number is shown by the application.
**Environment:** Dev
**Date:** 2026-11-07
**Prepared by:** QA Agent — Test Reporter Skill (stlc-worker, QA batch)

---

## Verdict

> # ⚠️ CONDITIONAL PASS — Ship with conditions

**Rationale:** 10 of 11 test cases passed on Dev (90.9%, just above the 90% threshold) and no bug was found, but the Blocking question Q-002 is still unanswered, so the hidden-input half of the first acceptance criterion (AP2533_002) could not be judged; the story should not move to release until Q-002 is answered and AP2533_002 is run.

---

## Executive Summary

AP-2533 changes the "Create a quote" form that dealers use to start a quote. It asks for
two things: clicking the "Décoder" button next to the vehicle identification number (VIN)
must fill in the vehicle's details without creating a quote, and the vehicle-type choice
must become a drop-down labelled "Vehicle type" placed above the quote name. The QA team
first confirmed the change is in the application running on the Dev environment, then ran
11 test cases. Ten passed: decoding now fills in TESLA, Model 3 and 2020 and keeps the form
on screen, no decode created a quote (only the dealer's own Save does), and the "Vehicle
type" drop-down is the first field, above the quote name, in English and in French. No
defect was found. One test case could not be run because the ticket does not say which
hidden values the decode must fill in; that question (Q-002) was posted on the ticket and
has no answer yet, so part of the first requirement remains unchecked. The related bug
AP-2507, which this change fixes, was re-tested separately today and is already closed.
The result applies to Dev only; Staging was not tested.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 3 of 3 (REQ-001 partly — its hidden-input check is blocked by Q-002) |
| Total test cases | 11 |
| Passed | 10 (90.9%) |
| Failed | 0 (0%) |
| Blocked | 1 (AP2533_002 — Q-002) |
| Skipped | 0 |
| **Pass rate** | **90.9% (10 of 11)** |
| Pass rate threshold | 90% |
| Threshold met? | ✅ Yes |

The pass rate is the share of test cases that passed, out of every case except skipped
ones: 10 passed ÷ (11 total − 0 skipped) = 90.9%. A blocked case counts as not passed.
Defect density (bugs per test case) is 0 ÷ 11 = 0.

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 |
| Low | 0 | 0 | 0 |
| **Total** | **0** | **0** | **0** |

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

Criteria from the test plan (`AP-2533_test-plan.md` §5).

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| Every case not BLOCKED at design time executed | 100% | 100% — 10 of 10 (AP2533_002 was blocked at design by Q-002) | ✅ |
| All High-priority TCs executed | 100% | 5 of 6 (83%) — AP2533_002 (High) blocked by Q-002 | ❌ |
| Pass rate | ≥ 90% | 90.9% (10 of 11) | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open (filed or linked by this run) | 0 | 0 | ✅ |
| Q-002 answered, or the story stays out of "Ready for release" | Answered | Open — no answer to comment 19510 | ❌ |
| Every FAIL filed, linked or dismissed | Yes | Yes — no FAIL | ✅ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — clicking "Décoder" fills the form (visible and hidden inputs) with the decoded vehicle | 5 (001, 002, 005, 006, 011) | 4 | 0 | 1 | 80% |
| REQ-002 — clicking "Décoder" does not create the quote | 3 (003, 004, 011) | 3 | 0 | 0 | 100% |
| REQ-003 — a drop-down labelled "Vehicle type" sits before the Quote name | 4 (007–010) | 4 | 0 | 0 | 100% |
| **Total (unique cases)** | **11** | **10** | **0** | **1** | **90.9%** |

AP2533_011 covers both REQ-001 and REQ-002, so the per-requirement rows add up to 12.

| TC ID | What was checked | Priority | Result |
|---|---|:---:|:---:|
| AP2533_001 | Build check (read-only) found the fix in `/build/app.18b4959e.js`; one "Décoder" click with VIN `5YJ3E1EA0LF734293` answered 200, kept the form and filled Brand TESLA, Model "Model 3", Year 2020; no "Vehicle saved" | High | ✅ PASS |
| AP2533_002 | The decode fills the form's hidden vehicle inputs with the decoded values | High | 🚫 BLOCKED — Q-002 |
| AP2533_003 | Decoding without Save keeps the dealer on "Create a quote" with the typed name, and creates no quote and no inventory vehicle | High | ✅ PASS |
| AP2533_004 | Saving after a decode creates exactly one quote (6602) with a new vehicle (1157) holding TESLA Model 3 2020 and the VIN | High | ✅ PASS |
| AP2533_005 | Decoding a malformed (`ABC123`) or empty VIN shows no error page, keeps the form and the typed name, and creates no quote | Medium | ✅ PASS |
| AP2533_006 | Decoding after choosing Ford / Focus / 2008 by hand keeps the form and creates no quote | Medium | ✅ PASS |
| AP2533_011 | Decoding on a second type that offers "Décoder" (ATV / UTV) keeps the form, the name and the VIN, and creates no quote | High | ✅ PASS |
| AP2533_007 | The form's first field is a drop-down labelled exactly "Vehicle type", 80 px above the Quote name; the old top-right type button is gone | High | ✅ PASS |
| AP2533_008 | Switching to RV CLASS A and back to Passenger reloads the form without error and keeps "Vehicle type" before the Quote name | Medium | ✅ PASS |
| AP2533_009 | In French the drop-down ("Type de véhicule") still sits before the quote-name field; English restored afterwards | Medium | ✅ PASS |
| AP2533_010 | Saving with Brand, Model and Year empty is refused with "This value should not be blank." under each, and creates no quote | Medium | ✅ PASS |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| — | No defects found in this run | — | — | — | — | — |

Gate C (the check before filing bugs) was skipped because no case failed — decided by the
independent qa-reviewer (R3 round 1, APPROVE, 0 blocker / 0 major / 4 minor). No bug was
filed or linked.

**Related bug, already closed:** AP-2507 ("Clicking Décoder on the new-quote vehicle form
saves a quote and empties the form", High) is the bug this story fixes. It was re-tested
on its own today (AP2507_001–003, all PASS, 10:58–11:01 UTC, same Dev bundle) and moved to
Done (comment 19514). This run agrees: none of the decodes in this run saved a quote.

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2533-update-quote-form-ui.md` | 2026-11-07 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2533_requirements-analysis.md` | 2026-11-07 (reworked after R1 round 1) |
| Test Plan | `qa-artifacts/2-test-plan/AP-2533_test-plan.md` | 2026-11-07 |
| Test Cases | `qa-artifacts/3-test-cases/AP2533_TestCases_001-005.md`, `AP2533_TestCases_006-010.md`, `AP2533_TestCases_011-011.md` | 2026-11-07 (reworked after R2 round 1) |
| Test-case review | `qa-artifacts/3-test-cases/AP2533_ReviewFindings_2026-11-07.md` | 2026-11-07 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2533_2026-11-07.md` | 2026-11-07 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2533_bug-report.md` | 2026-11-07 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/` (22 .png, 5 .txt) | 2026-11-07 |
| Review record | `qa-artifacts/7-reviews/AP-2533_review.md` | 2026-11-07 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2533_test-report.md` | 2026-11-07 |

**Evidence.** The text records hold only request lines (method, URL, status) and the
build-check lines — no cookies, tokens or credentials. The qa-reviewer inspected the
screenshots at R3 and found each matches its result.

**Evidence notes (R3 findings F-1 and F-4).**
- Six "No entities found" search screenshots are byte-identical, and the AP2533_004 name
  search screenshot is byte-identical to the closing VIN search screenshot; no picture
  shows the search keyword or URL, so a picture alone cannot tell a name search from a VIN
  search. The qa-reviewer therefore re-checked Dev read-only at 11:23 UTC: the VIN search
  for `5YJ3E1EA0LF734293` lists exactly one quote, 6602 "QA-AP2533-004-111033 TESLA Model
  3 2020", and the search "QA-AP2533" lists only that same row. No result changes. Later
  runs will save the search URL next to each search screenshot.
- In AP2533_005 and AP2533_010, step 4 records only "Loaded" as its actual result; the
  following step records the observed value ("No entities found"), so no result changes.
  Later runs will write what loaded.

---

## Risks and Observations

- **Q-002 is unanswered (Blocking).** The first acceptance criterion says the decode fills
  the form's "visible and hidden input". Which hidden inputs and which values are not
  stated, so AP2533_002 was never run. What the build does today (recorded, not judged):
  after the Tesla decode a hidden `fuelType` = BEV appears; `transmission` = automatic and
  `engineSizeUnit` = l stay as they were; no cylinders or engine size inputs appear for
  this electric car.
- **Question for the author — French labels (R3 F-2).** In the French interface the
  quote-name field keeps the English label "Quote name", and the vehicle-type drop-down
  shows the English option "Passenger" (AP2533_009, screenshot
  `AP2533_009-step4-FrenchTypeBeforeQuoteName_pass.png`). This is outside the acceptance
  criteria (which only require the drop-down before the quote name, labelled "Vehicle
  type"), and no record shows these were ever translated, so it is an observation, not a
  failure. Should the quote-name label and the type options be translated? This extends
  the open questions Q-008 (other UI changes) and Q-009 (French label of the drop-down).
- **Question for the author — decode on another vehicle type reuses an existing vehicle
  (R3 F-3, under Q-004 / Q-005).** On the ATV / UTV form, decoding the Tesla VIN filled the
  hidden vehicle id `quote_vehicle[id]` with **1157** — the Passenger TESLA Model 3 that
  AP2533_004 had just created — while Brand and Model showed "This value is not valid." /
  "Choose a valid model" (TESLA and Model 3 are not in the ATV / UTV lists). The form was
  not saved, so **what a Save there would do to vehicle 1157 is untested**. May a decode
  on one vehicle type pick up an inventory vehicle of a different type, and should a Save
  then change that vehicle?
- **Other record-only observations (open Judgement questions — no result depends on
  them):**
  - Q-003: a malformed or empty VIN gives no message at all; an empty VIN still sends the
    decoder request.
  - Q-004: on the Passenger form the decoded TESLA / Model 3 / 2020 replace values the
    dealer had chosen by hand.
  - Q-005: decoding adds no vehicle to the inventory.
  - Q-006: "Décoder" shows on Passenger and ATV / UTV, not on 3 wheels, 5TH WHEEL or RV
    CLASS A.
  - Q-007: changing the vehicle type reloads the page at `/quote/new/edit-vehicle/{TYPE}`
    and clears a typed quote name.
  - Q-008: the type drop-down was added, the old top-right type button removed and a
    hidden `quote_vehicle[id]` added; the ids of Quote name, VIN, Brand, Model and Year are
    unchanged.
- **The fix for AP-2507 lives in this story.** If AP-2533 is held back or reverted, the
  AP-2507 behaviour (a decode saving an unwanted quote) comes back with it.
- **Dev only.** Staging was not tested.
- **Test data left behind on Dev (dealers cannot delete quotes):** quote **6602**
  "QA-AP2533-004-111033" with vehicle **1157** (TESLA Model 3 2020, VIN
  `5YJ3E1EA0LF734293`), from AP2533_004. No other record was created; other tickets' data
  (quotes 6437, 6588–6601; vehicles 915, 1067, 1143–1156; contract 2782) was not touched.

---

## Recommendations

1. Ask the author (Nicolas-Eric Tain) to answer Q-002 on AP-2533; once answered, re-run
   AP2533_002 with `AP-2533 --from execute`. Until then AP-2533 stays in QC.
2. Ask the author whether the French "Quote name" label and the "Passenger" option should
   be translated (Q-008 / Q-009 follow-up).
3. Ask the author whether a decode on the ATV / UTV form may reuse vehicle 1157 (a
   Passenger vehicle) and what a Save should do to it; if the answer is "no", a test case
   that saves after that decode should be added.
4. Release AP-2533 together with the AP-2507 fix — they are the same change.

### Outcome plan for Gate D (for review by R4 — not applied by this stage)

Source: the *QA outcome rules* in `qa-artifacts/qa-config/tools.md` §2 and
`stlc-ticket-pipeline/routing.md` §3.1 (story tickets). `apply_mode: automatic`.
AP-2533 is a Story in status QC (canonical `ready_for_qa`).

**Move check (§3.1 — all three must hold):**

| Check | Rule | Actual | Holds? |
|---|---|---|:---:|
| Pass rate | PASS ÷ (all − SKIPPED) ≥ `story_pass_threshold` 90% | 10 ÷ 11 = 90.9% | ✅ |
| No stopping bug | No bug linked to this run still open and stopping | `AP-2533_bug-report.md` lists 0 bugs; AP-2507 is not in it and is already Done | ✅ |
| No blocking question | No Blocking question in the analysis still Open | Q-002 is Blocking + Open (comment 19510 unanswered) | ❌ |

**Decision: AP-2533 does not move.** It stays in QC and its assignee is unchanged,
because an unanswered Blocking question means part of REQ-001 was never judged, whatever
the pass rate.

| # | Ticket | Rule | Action | Evidence |
|---|---|---|---|---|
| 1 | AP-2533 (story) | §3.1 — always post the story result comment | Post the comment below (template §4.1) | Execution log 10 PASS · 0 FAIL · 1 BLOCKED; R3 APPROVE |
| 2 | AP-2533 | §3.1 — blocking-question check fails | **No status change** (stays QC); `story_fail_status` is "—" | Q-002 Blocking + Open |
| 3 | AP-2533 | §3.1 — assignee changes only with a move to `story_pass_status` | **No assignee change** | Not moved |
| — | Other bugs | §3.2 second clause | No action — the bug report lists no bug tickets. **AP-2507** is not touched: it is not in this run's bug report, its own re-test already closed it (Done, comment 19514), and the run state's Warnings say AP-2533's s7 never changes AP-2507 | 0 defects |

**Comment points (for R4):**

```
h3. QA result — CONDITIONAL PASS · Dev · 2026-11-07

*10/11 passed (90.9%, needs 90%)* · 0 failed · 1 blocked

*Failed / blocked:*
* AP2533_002 — hidden inputs the decode must fill are not specified — Q-002
*Passed:* 001, 003–011

*Bugs:* None. Related: AP-2507 (the decode-saves-a-quote bug) re-tested PASS today and already Done.
*Questions:* [~mention: author / Ken Nguyen as in comment 19510]
* Q-002 — Which hidden inputs must the decode fill, and with which values? (asked in comment 19510, still Blocking)
* In French, "Quote name" and the type option "Passenger" stay in English — should they be translated?
* On the ATV / UTV form the Tesla decode filled the hidden vehicle id with 1157 (a Passenger vehicle) — may it, and what should Save do to that vehicle? (not tested)

*Next:* Stays in QC — re-test AP2533_002 after Q-002 is answered. Not moved to Ready for release: Q-002 (Blocking) is unanswered.
```

The comment follows the duplicate rule: Q-002 is restated as the reason the story does
not move, not as a new question post. The mention uses the same person the s7 updater
resolves for the questions (comment 19510 mentioned Ken Nguyen; the analysis assigns the
questions to Nicolas-Eric Tain) — the updater uses the account id it can resolve and
never guesses one. A transition is not attempted, so none can be refused.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | CONDITIONAL PASS | _(automated)_ | 2026-11-07 |
| QA Lead | Not known — not named in the ticket | Pending | | |
| Development Lead | Not known — not named in the ticket | Pending | | |
| Product Owner | Not known — not named in the ticket | Pending | | |
