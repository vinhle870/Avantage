# QA Review Record — AP-2498

## R1 — Requirements analysis — round 1 — 2026-11-01T08:45:00Z
Reviewed: requirements/AP-2498-roadside-protection-keep-existing-vehicle-form.md, qa-artifacts/1-requirements-analysis/AP-2498_requirements-analysis.md, qa-artifacts/.pipeline/AP-2498.md
Verdict: **APPROVE** · Gate A: continue — rule A3
Findings: 0 blocker · 0 major · 2 minor

The analysis was re-read from disk against the capture. All eight acceptance-criterion
blocks in the capture map one-to-one to REQ-001 … REQ-008, every requirement quotes its
criterion word for word, and no requirement states behaviour the capture does not
contain. All 13 open questions carry an Impact and a Status; none is Blocking, because
every criterion has an observable Given/When/Then outcome, and none is marked Answered,
so no quote was needed. The analysis can be trusted as the basis for the test plan.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP-2498_requirements-analysis.md — REQ-001 … REQ-008, User Story rows | Every user story is inferred, because the ticket states none; each row says so, but the wording reads like a requirement. | None required — the "(Inferred)" label is present. Test cases must cite the acceptance criteria, not the user stories. |
| F-2 | Minor | AP-2498_requirements-analysis.md — Q-012 | The question about the product section's own VIN field rests on the `/quote/{id}/road-side-protection` page mapped in `quote-creation.md`, which may not be the same flow as the modal (Q-002). | None required — keep Q-012 record-only until Q-002 is answered by the first execution. |

Gate A evidence: 0 Blocking + Open questions; 11 Judgement, 2 Info (Q-011, Q-013) — none posted at Gate A (rule A3).

## R2 — Test cases — round 1 — 2026-11-01T09:25:00Z
Reviewed: qa-artifacts/3-test-cases/AP2498_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2498_TestCases_006-010.md, qa-artifacts/3-test-cases/AP2498_TestCases_011-014.md, qa-artifacts/3-test-cases/AP2498_ReviewFindings_2026-11-01.md, qa-artifacts/1-requirements-analysis/AP-2498_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2498_test-plan.md
Verdict: **REWORK** · Gate B: — (decided after rework)
Findings: 0 blocker · 1 major · 2 minor

The three test-case files were re-read from disk. Every requirement REQ-001 … REQ-008 has
at least one case, every case cites its requirement, IDs run AP2498_001–014 without gaps,
no file holds more than five cases and no case more than five steps, and all dynamic data
(vehicle, client, quote) is created in `[Pre-Condition]` steps with its values written in.
One expected result asserts behaviour the capture does not state, and must be made
record-only before the set can be executed.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Major | AP2498_TestCases_006-010.md — AP2498_006 step 3 | The expected result says the refused form keeps "the chosen Year/Make/Model still shown". The capture says only that VIN is required; whether a refused submit keeps the other entered values is not stated, so the case could FAIL on an unstated display detail (rule 2.5). | Keep "the submit is refused, VIN still empty, no error page or HTTP 5xx", and change the Year/Make/Model part to record-only: record whether they keep the entered values. |
| F-2 | Minor | AP2498_TestCases_001-005.md — AP2498_004 step 5 | "No new form type" is judged only through a shared `name` prefix (also Pass 1 #2 of the review findings). | None required — the limit is stated in the test plan §2.2. |
| F-3 | Minor | AP2498_TestCases_006-010.md — AP2498_007 step 5 | "The Model list for Make B does not contain the Model chosen for Make A" could misfire if two fallback makes share a model name. | None required — `Toyota` / `Honda` are the planned makes; the executor records both lists. |

```
=== REVIEW VERDICT ===
ticket: AP-2498
checkpoint: R2
round: 1
verdict: REWORK
gate: —
rework_stage: s3
rework_scope: AP2498_006
findings: 0/1/2
park_reason: —
record: qa-artifacts/7-reviews/AP-2498_review.md
=== END ===
```

## R2 — Test cases — round 2 — 2026-11-01T09:35:00Z
Reviewed: qa-artifacts/3-test-cases/AP2498_TestCases_006-010.md (AP2498_006, re-read from disk after the s3 rework), qa-artifacts/3-test-cases/AP2498_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2498_TestCases_011-014.md, qa-artifacts/3-test-cases/AP2498_ReviewFindings_2026-11-01.md
Verdict: **APPROVE** · Gate B: execute the current cases — rule B3
Findings: 0 blocker · 0 major · 2 minor

Round 1's F-1 is fixed: AP2498_006 step 3 now judges only that the empty-VIN submit is
refused with VIN still empty and no error page, and records whether Year, Make and Model
keep the entered values. No other case changed. The 14 cases can be executed as written.
Gate B: the review findings list two Pass 1 gaps, both citing the test plan or Q-001 and
not an uncovered REQ or acceptance criterion, so rule B1 does not apply; no Pass 2
proposal is High, so rule B2 does not apply; rule B3 — execute the current cases.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-2 | Minor | AP2498_TestCases_001-005.md — AP2498_004 step 5 | Carried from round 1: "no new form type" is judged only through a shared `name` prefix. | None required. |
| F-3 | Minor | AP2498_TestCases_006-010.md — AP2498_007 step 5 | Carried from round 1: the Model-list comparison could misfire if two fallback makes share a model name. | None required. |

Unpromoted Pass 2 proposals (all Medium or Low): #1 Make without Model (Medium), #2 quote page Vehicle card after submit (Medium), #3 malformed VIN (Medium), #4 Year boundaries (Low), #5 markup in VIN (Medium), #6 contract carries the corrected VIN (Medium), #7 double-click Continue (Low), #8 French notice (Low).

```
=== REVIEW VERDICT ===
ticket: AP-2498
checkpoint: R2
round: 2
verdict: APPROVE
gate: Gate B: execute the current cases — rule B3
rework_stage: —
rework_scope: —
findings: 0/0/2
park_reason: —
record: qa-artifacts/7-reviews/AP-2498_review.md
=== END ===
```

## R2 — Test cases — round 1 (independent reviewer) — 2026-11-01T01:40:21Z
Reviewed: requirements/AP-2498-roadside-protection-keep-existing-vehicle-form.md, qa-artifacts/.pipeline/AP-2498.md, qa-artifacts/1-requirements-analysis/AP-2498_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2498_test-plan.md, qa-artifacts/3-test-cases/AP2498_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2498_TestCases_006-010.md, qa-artifacts/3-test-cases/AP2498_TestCases_011-014.md, qa-artifacts/3-test-cases/AP2498_ReviewFindings_2026-11-01.md, qa-artifacts/qa-docs/quote-creation.md (RSP rows)
Verdict: **REWORK** · Gate B: — (decided after rework)
Findings: 1 blocker · 0 major · 2 minor

This is an independent review of the 14 cases as they stand on disk today, after the
earlier rework of AP2498_006. Coverage is complete (REQ-001 … REQ-008 each have at least
one case and every case cites its requirement), IDs AP2498_001–014 run without gaps, no
file holds more than five cases or any case more than five steps, no question is
Blocking, every vehicle, client and quote is created in a `[Pre-Condition]` step, and the
review findings hold no High Pass 2 proposal. One problem remains: three cases still judge
which VIN and Year the form shows when the submitted values differ from the vehicle's.
That is open question Q-008 (Judgement), and the test plan (§ Edge-case row) says that
situation is record-only. The same cases already treat it as record-only in their later
step, so they contradict themselves. Those steps must become record-only before
execution.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Blocker | AP2498_TestCases_006-010.md — AP2498_009 step 3 and AP2498_010 step 3; AP2498_TestCases_011-014.md — AP2498_013 step 4 | After the submit, these expected results require the form to show the submitted values: in AP2498_009 Year `2021` (the vehicle's year is `2022`), in AP2498_010 VIN `2T1BURHE8NC498110` and Year `2020` (the vehicle has `2T1BURHE4NC498010` / `2022`), and in AP2498_013 VIN `1HGCM82633A004352` and Year `2003` (the vehicle has `2T1BURHEXNC498013` / `2022`). Which value the form shows when the RSP program and the vehicle disagree is Q-008, an open Judgement question; the capture states only "VIN/Year show the stored RSP values (or the vehicle's VIN/year)". AP2498_009 step 5 and AP2498_010 step 5 already accept either value on re-open, so a PASS/FAIL in step 3 / step 4 hangs on a guessed answer (rule 2.5). | In AP2498_009 step 3, keep "accepted, no error page or HTTP 5xx, still in the RSP flow, form shown" and judge VIN, Make and Model, but make Year record-only: "`2021` or the vehicle's `2022` — any other value is a fault; record which (Q-008)". In AP2498_010 step 3, judge Make and Model, and make VIN and Year record-only the same way (submitted or vehicle value; any other value is a fault; record which — Q-008). In AP2498_013 step 4, keep "the RSP form is still shown" and the Make/Model check, and make VIN and Year record-only the same way (Q-008). |
| F-2 | Minor | AP2498_TestCases_001-005.md — AP2498_003 step 5 | The stored Make/Model are chosen by the catalogue choice rule (`Toyota` / `Corolla`), which equals the vehicle's own make and model, so the step cannot tell a stored value from a prefill from the vehicle (Q-009). REQ-002's main point — the form is visible with products below it — is still proven, and storage is proven separately by AP2498_009 with `Honda`. | None required. Optionally choose a Make other than the vehicle's, as AP2498_009 does, so the step also proves the values came from storage. |
| F-3 | Minor | AP2498_TestCases_011-014.md — AP2498_014 step 5 | "the **Save and Generate Contract** button, enabled": `quote-creation.md` maps the button on `/quote/{id}/road-side-protection` but says nothing about its enabled state, and whether the **+** flow is that page is Q-002. | None required — the executor records the button state; if the **+** flow is not that page, record the difference and write it back to `domain`. |

Gate B (to apply after the rework): the review findings' two Pass 1 gaps cite the test
plan and Q-001, not an uncovered REQ or acceptance criterion (not B1); no Pass 2 proposal
is High (not B2); so rule B3 — execute the current cases — will apply once F-1 is fixed.

```
=== REVIEW VERDICT ===
ticket: AP-2498
checkpoint: R2
round: 1
verdict: REWORK
gate: —
rework_stage: s3
rework_scope: AP2498_009, AP2498_010, AP2498_013
findings: 1/0/2
park_reason: —
record: qa-artifacts/7-reviews/AP-2498_review.md
=== END ===
```

## R2 — Test cases — round 2 (independent reviewer) — 2026-11-01T01:43:42Z
Reviewed: requirements/AP-2498-roadside-protection-keep-existing-vehicle-form.md, qa-artifacts/.pipeline/AP-2498.md, qa-artifacts/1-requirements-analysis/AP-2498_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2498_test-plan.md, qa-artifacts/3-test-cases/AP2498_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2498_TestCases_006-010.md, qa-artifacts/3-test-cases/AP2498_TestCases_011-014.md, qa-artifacts/3-test-cases/AP2498_ReviewFindings_2026-11-01.md, qa-artifacts/7-reviews/AP-2498_review.md (earlier sections)
Verdict: **REWORK** · Gate B: — (decided after rework)
Findings: 2 blocker · 0 major · 0 minor

All three findings of the independent round 1 are fixed on disk: AP2498_009 step 3 now
makes Year record-only, AP2498_010 step 3 and AP2498_013 step 4 make VIN and Year
record-only (submitted or vehicle value, any other value a fault, Q-008), AP2498_003
stores `Honda` instead of the vehicle's make, and AP2498_014 step 5 records the
**Save and Generate Contract** state instead of requiring it enabled. Coverage, IDs, file
and step limits, test data and the review findings' promotion state all still hold. One
problem is left, in the branch every Vehicle N case already plans for: if the inventory
form refuses a vehicle with no VIN, the case saves the vehicle with its fallback VIN, and
then three VIN expectations no longer hold. AP2498_009 and AP2498_012 already say so for
step 5, but not for step 3, and AP2498_006 step 5 would fail a build that behaves as the
acceptance criterion states. These must be made conditional before execution.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Blocker | AP2498_TestCases_006-010.md — AP2498_009 step 3; AP2498_TestCases_011-014.md — AP2498_012 step 3 | Both cases use Vehicle N with a fallback VIN (`2T1BURHE8NC498009`, `2T1BURHE8NC498012`) when the inventory refuses an empty VIN. Their Test Data says that, in that branch, "the VIN check at step 5 becomes record-only under Q-008", but step 3 still requires the form to show the submitted VIN (`2T1BURHE1NC498109`, `2T1BURHE1NC498112`). With the fallback, the vehicle and the RSP program hold different VINs right after the submit, which is open Judgement question Q-008, so the step 3 PASS/FAIL hangs on a guessed answer (rule 2.5), and the case contradicts its own Test Data note. | In AP2498_009 step 3 and AP2498_012 step 3, add: "If the fallback VIN was used at step 1, VIN shows the submitted value or the vehicle's fallback VIN — any other value is a fault; record which (Q-008)". Also extend each Test Data note from "the VIN check at step 5" to "the VIN checks at steps 3 and 5". Keep the VIN judged as written when Vehicle N was saved with no VIN. |
| F-2 | Blocker | AP2498_TestCases_006-010.md — AP2498_006 step 5 | The expected result requires "VIN is empty" after re-opening. If the fallback VIN `2T1BURHE2NC498006` was used, the vehicle has a VIN and nothing is stored on the RSP program, so by the acceptance criterion "VIN/Year show the stored RSP values (or the vehicle's VIN/year)" the form should show `2T1BURHE2NC498006`. The case would then FAIL a build that does what the ticket says. The Test Data note only covers clearing VIN at step 3, not the re-open. | Change step 5 to: "VIN is empty, or — if the fallback VIN was used at step 1 — shows the vehicle's `2T1BURHE2NC498006`; any other value (in particular a value typed at step 3) is a fault", and keep the Make/Model check unchanged. |

Gate B (to apply after the rework): the review findings' two Pass 1 gaps cite the test
plan and Q-001, not an uncovered REQ or acceptance criterion (not B1); no Pass 2 proposal
is High (not B2); rule B3 — execute the current cases — will apply once F-1 and F-2 are
fixed. Checked and found sound: AP2498_011 avoids the same problem because its RSP VIN and
Year equal the fallback VIN and the vehicle's year; AP2498_008 judges only the vehicle's own
values on a fresh quote.

```
=== REVIEW VERDICT ===
ticket: AP-2498
checkpoint: R2
round: 2
verdict: REWORK
gate: —
rework_stage: s3
rework_scope: AP2498_006, AP2498_009, AP2498_012
findings: 2/0/0
park_reason: —
record: qa-artifacts/7-reviews/AP-2498_review.md
=== END ===
```

## R2 — Test cases — round 3 (independent reviewer) — 2026-11-01T01:48:53Z
Reviewed: requirements/AP-2498-roadside-protection-keep-existing-vehicle-form.md, qa-artifacts/.pipeline/AP-2498.md, qa-artifacts/1-requirements-analysis/AP-2498_requirements-analysis.md (open questions, REQ-005/REQ-006 notes), qa-artifacts/2-test-plan/AP-2498_test-plan.md (test data, edge-case and risk rows), qa-artifacts/3-test-cases/AP2498_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2498_TestCases_006-010.md, qa-artifacts/3-test-cases/AP2498_TestCases_011-014.md, qa-artifacts/3-test-cases/AP2498_ReviewFindings_2026-11-01.md, qa-artifacts/qa-docs/*.md (hidden `_token` fields), .claude/skills/stlc-manual-executor/SKILL.md (BLOCKED rule for an unmet pre-condition), qa-artifacts/7-reviews/AP-2498_review.md (earlier sections)
Verdict: **PARK** · Gate B: execute the current cases except AP2498_004 — rule B3
Findings: 0 blocker · 1 major · 2 minor

All 14 cases were re-read from disk. Both round-2 findings are fixed: AP2498_009 and
AP2498_012 now accept, at steps 3 and 5, either the submitted VIN or the vehicle's
fallback VIN when the fallback was used (any other value is a fault; Q-008), and their
Test Data notes say "steps 3 and 5"; AP2498_006 steps 3 and 5 accept an empty VIN or the
fallback `2T1BURHE2NC498006`, and treat a value typed at step 3 as a fault. Coverage
(REQ-001 … REQ-008), IDs AP2498_001–014, file and step limits, test data created in
`[Pre-Condition]` steps, and the review findings (no High Pass 2 proposal) all still hold,
and no PASS/FAIL now depends on Q-008. The flagged AP2498_001 step 1 issue is real but
Minor (F-2): it cannot produce a false FAIL or a lost case, because the shared Vehicle N
rule in the same file and the test plan's Vehicle N row both say what to do when the
inventory forces the fallback VIN. One Major problem remains, in a case no earlier round
flagged. AP2498_004 step 5 requires the form to hold "nothing else" besides the five named
controls, while step 3 records every control inside the form element, hidden ones
included. The app's other mapped forms carry a hidden CSRF field `{prefix}[_token]`, so a
correct build could FAIL this case. This is round 3, so the skill's final-round rule
applies: the ticket's test cases are parked on AP2498_004 only, and the other 13 cases go
to execution.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Major | AP2498_TestCases_001-005.md — AP2498_004 steps 3 and 5 | Step 3 asks the executor to record every control inside the RSP form element with its `name`, and step 5 says the form holds the existing Make (`vehicleMake`), Model (`vehicleModel`) and **Continue** (`continue`) controls plus one VIN and one Year input, "nothing else". The domain docs show that this app's forms carry a hidden CSRF input (`earning_curve[_token]`, `earning_group[_token]`, `earning_set[_token]`, `dealer_search[_token]`). If `QuoteAutoShieldMakeModelType` renders one too, which the old form would already have had, the literal check fails on a build that keeps "exactly the existing fields". The AC lists only `vehicleMake`, `vehicleModel` and `continue`, so whether hidden framework inputs count is not stated, and the PASS/FAIL hangs on that reading. | In step 5, judge only the visible, user-editable controls: the five named controls and nothing else that a dealer can see or edit. Make hidden inputs record-only: "record any hidden input (e.g. `{prefix}[_token]`) and its `name`; a hidden input is not a fault unless it carries a vehicle, client or contract value". Keep the shared `name`-prefix check. |
| F-2 | Minor | AP2498_TestCases_001-005.md — AP2498_001 step 1 | The expected result says the vehicle details page shows "an empty VIN". If the inventory refuses an empty VIN, that cannot hold. It cannot cause a false FAIL or a BLOCKED case: the file's shared Vehicle N rule says to save with the case's fallback VIN `2T1BURHE3NC498001` and log that the no-VIN state could not be prepared, the test plan's Vehicle N row says the case records that and continues, and step 4 judges only that the form sits above the notice, which the AC requires for any vehicle ("make/model known or empty"). With the fallback, AutoShield may return products, and step 4 already sends that case to BLOCKED under Q-001. | None required before execution. When the case is next edited, change the step 1 expected result to "an empty VIN, or the fallback `2T1BURHE3NC498001` if the inventory refused an empty VIN (recorded per the Vehicle N rule)". The executor follows the Vehicle N rule and does not BLOCK or FAIL step 1 on it. |
| F-3 | Minor | AP2498_TestCases_011-014.md — AP2498_012 step 5 | "Make and Model are not filled with a value nobody entered" is looser than AP2498_008 step 4, which names the two acceptable states: the placeholder, or the vehicle's own `Toyota` / `Corolla`. An executor could read a prefill from the vehicle as "a value nobody entered". | None required. The executor treats the placeholder or the vehicle's own make and model as acceptable and records which (Q-009), as in AP2498_008. |

Gate B for the cases that are not parked: the review findings' two Pass 1 gaps cite the
test plan and Q-001, not an uncovered REQ or acceptance criterion (not B1). No Pass 2
proposal is High (not B2). Rule B3 applies: execute the current cases AP2498_001–003 and
AP2498_005–014. Unpromoted: #1–#8 (5 Medium, 3 Low).

Parked because: this is the third R2 round and a Major finding remains. The fix is QA
wording, but the rules allow no fourth rework round. To unpark AP2498_004, either the
author (Nicolas-Eric Tain) confirms on AP-2498 which inputs the RSP form must contain,
including hidden ones, or a fresh R2 cycle is run on that case after step 5 is changed as
F-1 says. Until then AP2498_004 is BLOCKED, so REQ-003's first acceptance criterion
(exactly the existing fields plus VIN and Year, with no vehicle editor, client or contract
fields) has no executed case. The second criterion (only VIN required, no VIN lookup) is
still covered by AP2498_005 and AP2498_006.

```
=== REVIEW VERDICT ===
ticket: AP-2498
checkpoint: R2
round: 3
verdict: PARK
gate: Gate B: execute the current cases except AP2498_004 — rule B3
rework_stage: —
rework_scope: AP2498_004 (BLOCKED by the park; no rework round left)
findings: 0/1/2
park_reason: Round 3 still has a Major finding: AP2498_004 step 5 requires "nothing else" in a form that probably carries a hidden CSRF `_token` input, and nobody has stated whether hidden inputs count among "the existing fields". AP2498_004 stays BLOCKED until the author confirms the form's inputs or the case gets a fresh R2 cycle.
record: qa-artifacts/7-reviews/AP-2498_review.md
=== END ===
```

## R3 — Execution results — round 1 — 2026-11-01T23:31:00Z
Reviewed: qa-artifacts/.pipeline/AP-2498.md, requirements/AP-2498-roadside-protection-keep-existing-vehicle-form.md, qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2498_2026-11-02.md, qa-artifacts/3-test-cases/AP2498_TestCases_001-005.md, AP2498_TestCases_006-010.md, AP2498_TestCases_011-014.md, qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/ (19 files), tracker search of open AP bugs (AP-2508, AP-2518, AP-2521 read)
Verdict: **APPROVE** · Gate C: file new for D1, D2 and D3, each *relates to* AP-2508 (D2 also AP-2521) — rule C3 → reviewer rule E2; no C1, so s4c is skipped
Findings: 0 blocker · 0 major · 1 minor

The Dev (v2dev) run executed 13 of 14 cases and left none `Not Run`; AP2498_004 is BLOCKED by the Gate B park and AP2498_014 by AP-2508, each with its reason. The counts recount to 2 PASS, 10 FAIL, 2 BLOCKED (14%, 2 of 14), every screenshot path exists, and the ten FAILs reduce to three objective defects on the roadside modal, each shown on screen. The results can be trusted and passed to s5.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | execution-log_AP-2498_2026-11-02.md — AP2498_001 step 1 | The step is ✅ although its expected result says "an empty VIN" and the vehicle was saved with the fallback VIN `2T1BURHE3NC498001`. The R2 round-3 record (F-2) already ruled that this set-up step follows the shared Vehicle N rule and must not BLOCK or FAIL the case, and the log's Comment says the no-VIN state could not be prepared. | None. When the case is next edited, reword step 1's expected result as R2 F-2 says. |

Checks: 3.1 all 14 cases have a status. 3.2 recount 2/10/2/0 matches the summary. 3.3 every PASS step states observed values (e.g. AP2498_008 step 4 "VIN = 2T1BURHE6NC498008, Year = 2022, Make = Choose"). 3.6 every FAIL names its step and states the difference. 3.7 no environment failure — Dev returned no 5xx, no timeout, no login problem; the FAILs are at the steps under test. 3.8 both BLOCKED cases name the park and AP-2508. 3.9 Gate C decisions quote the candidate bug summaries; no C1 is claimed. The "form shown/visible" judgement rests on the capture's title "keep the existing vehicle form visible" and AC "the form does not disappear", not on an assumption; the FAIL is the measured visibility (zero size until "Edit" is clicked).

Gate C per FAIL: D1 (AP2498_001, 012) notice text "No road side protection products are available for this vehicle." vs the capture's "In order to get a quote for road side protection, please specify the make and model of the vehicle." — no capture sentence or non-developer comment says the actual text is intended (not C1); AP-2508 names the same screen ("Road side protection page") with a different behaviour (C3) → reviewer rule E2: file new, relates to AP-2508. D2 (AP2498_002, 003, 009, 010, 011, 013) form collapsed behind "Edit" whenever products are listed — AP-2521 has the same behaviour but on the add-extended-warranty modal, a different screen (not C2); AP-2508 same screen, different behaviour (C3) → file new, relates to AP-2508 and AP-2521. D3 (AP2498_005, 006) VIN not required and an empty-VIN submit accepted and saved — C3 on AP-2508 → file new, relates to AP-2508.

Screenshots inspected: AP2498_001-step4-FormAboveDifferentNotice_fail.png — matches; AP2498_002-step5-FormCollapsedAboveTiers_fail.png — matches; AP2498_002-step5-FormAfterEditClick_fail.png — matches; AP2498_005-step5-VinNotRequiredNoLookup_fail.png — matches (no lookup button; Make/Model "Choose"; the `required` attribute itself is not visible in an image and is taken from the DOM read in the log); AP2498_006-step3-EmptyVinSubmitAccepted_fail.png — matches (tiers, empty summary line); AP2498_008-step4-VinYearPrefilledFromVehicle_pass.png — matches; AP2498_012-step3-VinOnlyAcceptedWrongNotice_fail.png — matches; AP2498_013-step4-SameTiersFormCollapsed_fail.png — matches; AP2498_014-step5-TierSelectedNoGenerateButton_blocked.png — matches (first tier selected, only Save).

```
=== REVIEW VERDICT ===
ticket: AP-2498
checkpoint: R3
round: 1
verdict: APPROVE
gate: Gate C: file new ×3 (D1 notice text; D2 form collapsed when products are listed; D3 VIN not required / empty VIN accepted), each relates to AP-2508 — rule C3 → reviewer E2
rework_stage: —
rework_scope: —
findings: 0/0/1
park_reason: —
record: qa-artifacts/7-reviews/AP-2498_review.md
=== END ===
```

## R3 — Execution results — round 1 (independent reviewer) — 2026-11-01T23:35:22Z
Reviewed: qa-artifacts/.pipeline/AP-2498.md, requirements/AP-2498-roadside-protection-keep-existing-vehicle-form.md, qa-artifacts/1-requirements-analysis/AP-2498_requirements-analysis.md (Open Questions), qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2498_2026-11-02.md, qa-artifacts/3-test-cases/AP2498_TestCases_001-005.md, AP2498_TestCases_006-010.md, AP2498_TestCases_011-014.md, qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/ (19 files, all 19 log paths exist), qa-artifacts/qa-docs/quote-creation.md (AP-2498 section), qa-artifacts/base-test/navigation-map.md (quote-creation row), tracker: AP-2498 (comments), own open-bug search (8 queries) with AP-2508 and AP-2521 read in full
Verdict: **APPROVE** · Gate C: file new ×3 — D1, D2, D3 each *relates to* AP-2508 (D2 also *relates to* AP-2521) — rule C3 → reviewer rule E2; no C1, s4c skipped
Findings: 0 blocker · 0 major · 3 minor

Judged independently of the worker's R3 section above. The Dev run accounts for all 14 cases (2 PASS, 10 FAIL, 2 BLOCKED, 14%, recounted from the per-case rows), every FAIL is at its step under test with a stated difference, and the ten FAILs reduce to three defects that each rest on a sentence of the capture, not on an assumption. The results can be trusted and passed to s5; the three Minor findings must be carried into s6/s7, not reworked now.

**Are the three defects real against the AC wording?**
- **D1 (AP2498_001, 012) — yes.** The description says "When no products are returned, the screen shows the existing message *"In order to get a quote for road side protection, please specify the make and model of the vehicle."* below the form", and the AC "A VIN-only submit is accepted and saved" repeats the same text. Dev shows "No road side protection products are available for this vehicle." (screenshots 001 step 4 and 012 step 3). The position below Continue is right; only the text is wrong. No capture sentence or comment states that the new text is intended (AP-2498 still has only its 2026-10-23 hand-over comment), so not C1.
- **D2 (AP2498_002, 003, 009, 010, 011, 013) — yes, a genuine contradiction.** The ticket title is "keep the existing vehicle form **visible**", the first AC block is headed "The existing form is **always visible** in the RSP flow", and the second says "the form is still rendered with the stored values … — **the form does not disappear because make/model are complete**". On Dev the form is in the DOM but collapsed to a summary line until "Edit" is clicked, and it collapses exactly when make/model are complete and products return — the case the second AC rules out. The description's "The dealer should never have to go back and forth" points the same way. AP-2521 (filed today on AP-2497's add-extended-warranty modal, AC "the required-field form is shown") is the same summary-plus-Edit pattern on a sibling modal and was judged a defect on equivalent wording; that is consistency, not C1 evidence for either outcome. The bug should say the collapse looks shared with AP-2521 and ask the developer to confirm the design there.
- **D3 (AP2498_005, 006) — yes, "VIN required" is stated word for word.** AC "The form is the existing form plus VIN and Year; VIN is the only required field": "Then the VIN input is required and Year/Make/Model carry no `required` constraint"; the description says "a required **VIN**". Dev: VIN `required` = false (DOM read, 005 step 5); an empty-VIN Continue is accepted, priced, and stores Honda/Accord on the program (006 step 3 and step 5 screenshots). How the refusal shows is open (Q-004, Judgement), but the cases judge only that the submit is refused and saves nothing, which "required" itself states.

**AP2498_013 — FAIL is correct, not BLOCKED.** Step 4 has two parts. "The RSP form is still shown" is objective and failed (the form collapsed again; the screenshot shows only "2003 Honda Accord · 1HGCM82633A004352" and Edit) — this does not depend on Q-001. The "no longer qualify" part could not be produced (identical five tiers) and, by the case's own rule, is BLOCKED Q-001. A reproduced defect at the verification step outranks the blocked half; marking the whole case BLOCKED would hide D2's evidence. The unproduced direction is a coverage gap to report (F-1), not a reason to change the status.

**Other checks.** 3.1 all 14 cases have a final status; AP2498_004 is BLOCKED by the Gate B park with its reason, none Not Run. 3.3 PASS steps state observed values (e.g. 007 step 3 "152 options = Choose + 151 makes", 009 step 5 "VIN = 2T1BURHE1NC498109 … Year = 2021"). 3.7 no environment failure: no 5xx, timeout or login problem on Dev. 3.8 AP2498_014 BLOCKED by AP-2508 is right — step 5 needs the Save and Generate Contract button that AP-2508 already reports missing; the tier selection itself worked. Knowledge write-backs are add-only: `qa-docs/quote-creation.md` gained one new dated section "On Dev (v2dev) — the add-roadside-protection modal after AP-2498" at the end of the file with earlier sections intact, and the `navigation-map.md` quote-creation row had one clause appended and its date moved to 2026-11-02; neither file is under git, so this is judged from the content, not from a diff. Credentials: the 11 AP-2498 artifacts were searched for every login and password value in the `env` source (count only, nothing printed) — 0 matches; the only "password" mentions are the TC files' "read from there at run time and never written". The browser was not used for this review; no Dev data was changed.

**Gate C — own duplicate search.** Queries for "road side protection", "roadside", "AutoShield", "VIN required", "make and model", "Edit vehicle form collapsed", "collapse Edit", "no products available" (open Bugs in AP). Candidates: AP-2508 (roadside page missing contract fields and the Generate Contract button — same screen `/quote/{id}/road-side-protection`, different behaviour; its description opens the Edit box but does not report the collapse, the notice text or the VIN constraint), AP-2518 (roadside create-contract page HTTP 500 — different page and behaviour), AP-2521 (warranty modal form collapsed behind Edit — same behaviour, different screen), AP-2522 (warranty modal field errors hidden inside the collapsed form — different screen; not in the worker's Gate C list), AP-2520 (warranty modal Vehicle type field — unrelated). No C1 for any FAIL; no C2 (no open bug names this screen with the same wrong behaviour); C3 on AP-2508 for each defect → reviewer rule E2 → **file new**, linked *relates to* AP-2508, with D2 also *relates to* AP-2521. Same decision as the worker's, reached independently.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | execution-log_AP-2498_2026-11-02.md — AP2498_013 step 4 | The case is correctly FAIL on the collapsed form, but the AC's "or no longer qualify" direction of REQ-008 was never produced (AutoShield on Dev returned the same five tiers for every make/model, Q-001), so REQ-008 is only half tested. | In s6/s7, list REQ-008 "no longer qualify" as not covered (Q-001) in the test report and the story comment; do not count AP2498_013 as covering it. |
| F-2 | Minor | execution-log_AP-2498_2026-11-02.md — AP2498_001 step 1 | As in the earlier R3 F-1: the step is ✅ although its expected result says "an empty VIN"; the inventory forces a VIN, so the fallback was used per the shared Vehicle N rule. It does not change any result. | Reword step 1's expected result when the case is next edited (R2 round-3 F-2). |
| F-3 | Minor | qa-artifacts/.pipeline/AP-2498.md — Gate log, R2 round 3 PARK | The Gate B PARK of AP2498_004 has not been posted on AP-2498 ("not posted in this worker run"), so the author does not yet know that REQ-003's first AC has no executed case. | Post the park reason on AP-2498 through `tracker-manage-child-ticket` no later than s7, and name AP2498_004 as BLOCKED in the story comment. |

Screenshots inspected (10): AP2498_001-step4-FormAboveDifferentNotice_fail.png — matches (expanded form, red notice "No road side protection products are available for this vehicle." below Continue); AP2498_002-step5-FormCollapsedAboveTiers_fail.png — matches (Vehicle summary + Edit only, 5 tiers); AP2498_003-step5-StoredHondaFormCollapsed_fail.png — matches ("2022 Honda Accord · 2T1BURHE7NC498003", collapsed); AP2498_005-step5-VinNotRequiredNoLookup_fail.png — matches for what an image can show (no lookup button, Make/Model "Choose", no asterisks; the `required` attribute comes from the DOM read); AP2498_006-step3-EmptyVinSubmitAccepted_fail.png — matches (tiers after the empty-VIN submit; the summary line is blank, consistent with the empty VIN); AP2498_006-step5-HondaSavedFromEmptyVinSubmit_fail.png — matches ("2022 Honda Accord · 2T1BURHE2NC498006"); AP2498_011-step4-TiersInPlaceFormCollapsed_fail.png — matches; AP2498_012-step3-VinOnlyAcceptedWrongNotice_fail.png — matches (VIN 2T1BURHE1NC498112, Year empty, wrong notice); AP2498_013-step4-SameTiersFormCollapsed_fail.png — matches (same five prices, collapsed); AP2498_008-step4-VinYearPrefilledFromVehicle_pass.png — matches (High PASS: VIN 2T1BURHE6NC498008, Year 2022, Make/Model "Choose").

```
=== REVIEW VERDICT ===
ticket: AP-2498
checkpoint: R3
round: 1
verdict: APPROVE
gate: Gate C: file new ×3 (D1 notice text; D2 form collapsed behind Edit when products are listed; D3 VIN not required / empty VIN accepted), each relates to AP-2508, D2 also AP-2521 — rule C3 → reviewer E2
rework_stage: —
rework_scope: —
findings: 0/0/3
park_reason: —
record: qa-artifacts/7-reviews/AP-2498_review.md
=== END ===
```

## R4 — Outcome plan — round 1 — 2026-11-01T23:50:00Z
Reviewed: qa-artifacts/5-testing-report/AP-2498_test-report.md, qa-artifacts/5-testing-report/AP-2498_bug-report.md, qa-artifacts/1-requirements-analysis/AP-2498_requirements-analysis.md (Open Questions), qa-artifacts/qa-config/tools.md (QA outcome rules), qa-artifacts/4-execution-results/comment_AP-2498_2026-11-02.md (planned story comment)
Verdict: **APPROVE** · Gate D: story result comment on AP-2498, status and assignee unchanged (pass rate 14%, needs 90%); no bug action (AP-2523/2524/2525 are in Backlog, not the QA status) — rule D (§3.1, §3.2)
Findings: 0 blocker · 0 major · 0 minor

Run inline by the pipeline worker (it runs as a subagent, routing §3.0). The plan follows the outcome rules: the story stays where it is because the pass-rate check fails, the comment carries one row per test case, and the R3 findings F-1 (REQ-008 "no longer qualify" not covered) and F-3 (AP2498_004 park reason) are both in the comment and the test report.

Checks: 4.1 pass rate recomputed 2 ÷ (14 − 0) = 14%, equals the report. 4.2 all 10 FAILs are filed — AP-2523 (001, 012), AP-2524 (002, 003, 009, 010, 011, 013), AP-2525 (005, 006). 4.3 no stopping bug: all three are Medium, none made a case BLOCKED (AP2498_014 is blocked by AP-2508, which is not in this run's bug report; 004 by the Gate B park), and where AP-2524 failed a non-final step (009, 010 step 3) the remaining steps were still run. 4.4 no move: pass rate 14% < 90%; 0 Blocking questions open. 4.5 the comment lists all 14 test cases with status and bug. 4.6 no bug is re-assigned — the three new bugs are in Backlog, not the QA status, so §3.2 does not apply.

```
=== REVIEW VERDICT ===
ticket: AP-2498
checkpoint: R4
round: 1
verdict: APPROVE
gate: Gate D: story comment, status unchanged (pass rate 14%, needs 90%); no bug action — rule D §3.1/§3.2
rework_stage: —
rework_scope: —
findings: 0/0/0
park_reason: —
record: qa-artifacts/7-reviews/AP-2498_review.md
=== END ===
```

## R5 — Automation specs — round 1 — 2026-11-02T00:10:00Z
Reviewed: qa-artifacts/6-automation/AP-2498_automation-report.md (draft), playwright-automation/src/tests/dealer/roadSideProtectionVehicleForm_AP2498.spec.ts, playwright-automation/src/flows/RoadSideProtectionFlow.ts (AP-2498 members), playwright-automation/src/pages/dealerPortal/RoadSideProtectionPage.ts (AP-2498 members), qa-artifacts/3-test-cases/AP2498_TestCases_006-010.md (AP2498_007, 008), qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2498_2026-11-02.md
Verdict: **APPROVE** · Gate —: specs accepted — rule R5
Findings: 0 blocker · 0 major · 1 minor

Run inline by the pipeline worker (it runs as a subagent). Both tests trace to cases that PASSED manually, every [Verification] step has an assertion, lint passes, and two consecutive runs pass with no flaky test. The one finding concerns another ticket's spec that picks "the newest quote" and is not caused by a changed line.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | playwright-automation/src/tests/dealer/roadSideProtection_AP2225.spec.ts — RoadSideProtectionFlow.openNewestQuoteWithVehicle() (AP-2225, not changed) | After the AP-2498 run, AP2225_001 fails at "No error message": it opens the newest quote with a VIN, which is now a quote made by AP2498_007/008 (no Make/Model stored), and that quote's Road side protection page shows the AP-2498 "no products" alert. The method's code is unchanged; the AP-2225 spec depends on whatever quote was made last (AP2497 quotes have the same effect). | None for AP-2498 (another ticket's file). The QA should make AP2225_001 pick a quote with stored make/model, or run it before the quote-creating suites. |

Run: `npx playwright test --project=chromium --grep @AP-2498 --repeat-each=2` — 4 passed, 0 failed, 0 fixme, no flaky tests (plus one earlier single run: 2 passed). Lint `npm run lint`: pass.
Traceability:
| TC ID | Step | Expected result | Assertion |
|---|---|---|---|
| AP2498_007 | 3 | Make list holds ≥ 1 real make; after Make A, Model list holds ≥ 1 model | RoadSideProtectionFlow.verifyMakeListFilled() — expect(makes.length).toBeGreaterThan(0); chooseMakeAndReadModels() — get-models status < 400, expect.poll(models).not.toHaveLength(0) |
| AP2498_007 | 4 | No error page (Model clearing recorded, Q-007) | chooseMakeAndReadModels('Honda') — get-models status < 400; recordModelAfterMakeChange() annotation (record only) |
| AP2498_007 | 5 | Make B list differs from Make A's and has no Model chosen for A | verifyModelListFollowsMake() — expect(secondModels).not.toEqual(firstModels); expect(secondModels).not.toContain('Corolla') |
| AP2498_008 | 3 | Flow opens without error page / 5xx | openRoadSideModal() — GET status < 400, modal and form count 1, URL still /details, no error text |
| AP2498_008 | 4 | VIN = vehicle VIN, Year = 2022; Make/Model placeholder or the vehicle's | verifyPrefillFromVehicle() — toHaveValue(vin), toHaveValue('2022'), expect([Choose, Choice, Toyota]).toContain(make), same for Model |

Checks: 5.2 both titles start with a PASS TC ID; describe carries `@AP-2498`. 5.4 no waitForTimeout, no test.only, no credential or account; login through DealerFlow. 5.5 the page object holds locators and actions only; assertions and test.step live in the flow; the spec calls flows only. 5.6 only new members were added to RoadSideProtectionPage / RoadSideProtectionFlow; no existing line inside a used method changed (see F-1 for a data-only interaction).

```
=== REVIEW VERDICT ===
ticket: AP-2498
checkpoint: R5
round: 1
verdict: APPROVE
gate: —
rework_stage: —
rework_scope: —
findings: 0/0/1
park_reason: —
record: qa-artifacts/7-reviews/AP-2498_review.md
=== END ===
```
