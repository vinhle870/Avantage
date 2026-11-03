# QA Review Record — AP-2499

## R1 — Requirements analysis — round 1 — 2026-11-01T08:40:00Z
Reviewed: qa-artifacts/.pipeline/AP-2499.md, requirements/AP-2499-add-gap-creditors-insurance-financing-form.md, qa-artifacts/1-requirements-analysis/AP-2499_requirements-analysis.md, .claude/skills/stlc-ticket-pipeline/routing.md §3 Gate A
Verdict: **APPROVE** · Gate A: Continue — rule A3
Findings: 0 blocker · 0 major · 1 minor

The analysis was read from disk and checked against the capture. The capture has six acceptance criteria, each in Given/When/Then form with an observable outcome, and the analysis maps them one-to-one to REQ-001 to REQ-006, quoting each word for word. No requirement states behaviour the capture does not contain: the user stories are marked as inferred, and every point the ticket leaves open (other entry points, the Humania dealer account, what sits below the financing form, empty/placeholder states, what "backed by the saved financing" shows, update versus create on correction, how a provider failure is produced, re-open behaviour, unsaved financing edits, the meaning of "invalid", optional residual and date of birth, French labels, the GAP-first notice, the old financing page, unconfigured dealers) is raised as a question instead of answered. All fifteen questions carry an Impact and a Status; none is Blocking, which is correct because each main result can be written from the capture's own words. The analysis can be trusted for test design.

Checklist: 1.1 pass (6 ACs → REQ-001…006) · 1.2 pass (no invented scope) · 1.3 pass (15 questions: 11 Judgement, 4 Info, all Open) · 1.4 not applicable (every REQ has an AC) · 1.5 not applicable (no question marked Answered).

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP-2499_requirements-analysis.md — REQ-005 risk "The failure path needs the insurance provider to reject the quote" | The recommendation to try "a term far beyond the financing term" is a test heuristic, not a known failure trigger; it must not become a PASS/FAIL expectation. | None needed in the analysis; the test cases should make the failure branch record-only or BLOCKED when no failure can be produced (Q-007). |

=== REVIEW VERDICT ===
ticket: AP-2499
checkpoint: R1
round: 1
verdict: APPROVE
gate: Gate A: Continue — rule A3
rework_stage: —
rework_scope: —
findings: 0/0/1
park_reason: —
record: qa-artifacts/7-reviews/AP-2499_review.md
=== END ===

## R2 — Test cases — round 1 — 2026-11-01T09:10:00Z
Reviewed: qa-artifacts/.pipeline/AP-2499.md, requirements/AP-2499-add-gap-creditors-insurance-financing-form.md, qa-artifacts/1-requirements-analysis/AP-2499_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2499_test-plan.md, qa-artifacts/3-test-cases/AP2499_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2499_TestCases_006-010.md (after the Gate B correction), qa-artifacts/3-test-cases/AP2499_TestCases_011-013.md, qa-artifacts/3-test-cases/AP2499_ReviewFindings_2026-11-01.md, qa-artifacts/qa-docs/quote-creation.md and qa-artifacts/qa-docs/chubb-insurance.md (`domain`), qa-artifacts/base-test/navigation-map.md (`navigation`), qa-artifacts/base-test/test-centralized.md (`test-data`), .claude/skills/stlc-ticket-pipeline/routing.md §3 Gate B
Verdict: **APPROVE** · Gate B: Correct the guessed "kept values after a successful quote" check in AP2499_007 and AP2499_008 to record-only (done — Revisions row in AP2499_TestCases_006-010.md), then execute — rule B1
Findings: 0 blocker · 0 major · 2 minor

The thirteen test cases were read from disk after the Gate B correction. Every acceptance criterion has at least one case (REQ-001 → 001, 002, 013; REQ-002 → 001–005, 013; REQ-003 → 004, 005, 012; REQ-004 → 003, 006; REQ-005 → 007–009; REQ-006 → 010–012), and every case cites its REQ and AC by title. Expected results are concrete (the absent alert text, field values, URL unchanged, Financing card values, "- None Selected -"). No case asserts an answer to an Open question after the correction: Q-001, Q-003–Q-007 and Q-009–Q-012 are recorded, and the one case that needs a fact no source holds (AP2499_013, Humania dealer, Q-002) ships BLOCKED with a Blocked by value. Test data is vehicle 915 from `test-data` (read only — these cases change a quote's financing, not the vehicle) and per-case quotes created in `[Pre-Condition]` steps with their values written in. No credential is written into any file. The set can be trusted for execution.

Checklist: 2.1 pass · 2.2 pass · 2.3 pass (5 + 5 + 3 cases, all ≤ 5 steps, IDs 001–013 with no gap) · 2.4 not applicable (no Blocking question) · 2.5 pass after the B1 correction · 2.6 pass (no High Pass 2 proposal) · 2.7 pass.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2499_TestCases_006-010.md — AP2499_010 step 3 | The step expects an error next to Type, Payment frequency and Financing company, but these are drop-downs that may have no empty option, in which case they cannot be left missing. | None in the file; the executor records a drop-down with no empty option as "cannot be left empty" for that field rather than a FAIL. |
| F-2 | Minor | AP2499_TestCases_006-010.md — AP2499_009 | The failure trigger (Life term 999) is a guess (Q-007). If Chubb prices it, REQ-005's failure branch is unproven, and the case passes only on the absence of objective faults. | None; the test report must state that the failure branch was not reproduced if that happens. |

=== REVIEW VERDICT ===
ticket: AP-2499
checkpoint: R2
round: 1
verdict: APPROVE
gate: Gate B: correct AP2499_007/008 step 5 to record-only, then execute — rule B1
rework_stage: —
rework_scope: —
findings: 0/0/2
park_reason: —
record: qa-artifacts/7-reviews/AP-2499_review.md
=== END ===

## R2 — Test cases — round 1 — 2026-11-01T01:37:36Z (independent reviewer)
Reviewed: qa-artifacts/.pipeline/AP-2499.md, requirements/AP-2499-add-gap-creditors-insurance-financing-form.md, qa-artifacts/1-requirements-analysis/AP-2499_requirements-analysis.md, qa-artifacts/3-test-cases/AP2499_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2499_TestCases_006-010.md, qa-artifacts/3-test-cases/AP2499_TestCases_011-013.md, qa-artifacts/3-test-cases/AP2499_ReviewFindings_2026-11-01.md, qa-artifacts/qa-config/knowledge.md, qa-artifacts/base-test/test-centralized.md (`test-data`), qa-artifacts/qa-docs/quote-creation.md (`domain`), .claude/skills/stlc-ticket-pipeline/routing.md §3 Gate B
Verdict: **REWORK** · Gate B: Execute the current cases once the rework below is done — rule B3
Findings: 1 blocker · 2 major · 2 minor

This is a second, independent R2 review made from the files on disk; it does not reuse the inline review above. Coverage is complete (every REQ-001 to REQ-006 has cases, every case cites its REQ and AC), test data and routes come from `test-data` and `domain`, IDs and step counts follow the rules, no Pass 2 proposal is High, and AP2499_013 is correctly BLOCKED on Q-002. The set cannot be executed as written, though: AP2499_009 would report a PASS for the failure branch of REQ-005 even when no failure was ever produced, and three cases leave the executor to guess whether a residual of `0` or a pre-selected drop-down is a pass or a fail, which is exactly the open question Q-004 / Q-010. These must be fixed in `stlc-testcase-designer` before execution.

Checklist: 2.1 pass · 2.2 fail (F-2) · 2.3 pass (5 + 5 + 3 cases, all ≤ 5 steps, IDs 001–013 with no gap or duplicate) · 2.4 not applicable (no Blocking question) · 2.5 fail (F-1, F-3) · 2.6 pass (0 High Pass 2 proposals) · 2.7 pass (vehicle 915 in `test-data`; `fromVehicleId` route in `domain` quote-creation.md; quotes and financings created in `[Pre-Condition]` steps).

Gate B: the only Pass 1 gap (#1, kept values after a successful quote in 007/008) cites REQ-005 AC 1, but REQ-005 already has cases 007–009, so it is a wrong assertion, not a requirement without a test case. B1 therefore does not fire; B2 does not fire (no High Pass 2 proposal); the rule is **B3 — execute the current cases**. The 007/008 correction already in the file is right on its own merits under check 2.5.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Blocker | AP2499_TestCases_006-010.md — AP2499_009 step 4 (and Known blockers row 2) | If Chubb prices Life term 999 instead of failing, the step says "the case then passes only on the absence of objective faults", so a case titled "When the insurance quote fails, the modal shows an error and keeps the values" would be logged PASS although the failure branch of REQ-005 was never exercised. The analysis (REQ-005 risk) says "If no failure can be produced, record the failure half BLOCKED with the reason — never claim it passed", and ReviewFindings Q-007 says the log "must say so rather than count it as covered". | Change step 4 so that when a priced result is returned the case is recorded **BLOCKED** with reason "failure not reproduced with Life term 999 — Q-007", not PASS (an objective fault seen on the way is still a FAIL). Update Known blockers row 2 of the same file to the same wording. |
| F-2 | Major | AP2499_TestCases_001-005.md — AP2499_005 step 4 and "Why this matters"; AP2499_TestCases_011-013.md — AP2499_012 step 5 | The pass/fail outcome for a residual showing `0` is undecidable. AP2499_005's "Why this matters" calls "a residual of 0 the dealer never typed" an invented value (a FAIL), while step 4 lists `0` as one of the outcomes to record, and AP2499_012 step 5 does the same ("record exactly what each shows (empty, placeholder or `0`)") after saying neither field may show "a value nobody entered". What the "normal empty/placeholder state" is, is Q-004 (Judgement, Open), so the executor would have to guess. | State one rule in both cases: empty, a placeholder text or `0` in the residual field is record-only for Q-004; the case fails only if residual shows a non-zero number, or (012) if date of birth shows any date. Remove "a residual of 0 the dealer never typed" from AP2499_005's "Why this matters", or reword it to "a non-zero residual". |
| F-3 | Major | AP2499_TestCases_006-010.md — AP2499_010 steps 2–3; AP2499_TestCases_001-005.md — AP2499_001 step 3 and AP2499_002 step 4 | AP2499_010 expects an error next to Type, Payment frequency and Financing company, and 001/002 expect every field "empty or at their placeholder". Both assume each drop-down has an empty option; whether a drop-down opens empty or on a default value is Q-004 (Open). A correct build whose Payment frequency opens on "Monthly" would fail 010 (no error can appear on a field that is not missing) and possibly 001/002. | In AP2499_010 step 2, record any drop-down that cannot be left empty (pre-selected, no empty option); in step 3, require an error only next to each field that was actually left empty, and keep "nothing stored" at step 5 as the main check. In AP2499_001 step 3 and AP2499_002 step 4, judge only that no field shows a stored financing value (text/number fields empty); a drop-down showing a placeholder or a default option is recorded for Q-004. |
| F-4 | Minor | qa-artifacts/.pipeline/AP-2499.md — Gate log, Gate B line; AP2499_TestCases_006-010.md — Revisions row | The Gate B decision is logged as rule B1, but B1 needs a requirement or AC with no test case, and REQ-005 has three. The correction itself is valid (check 2.5), so no result changes. | When the pipeline re-logs Gate B after this rework, cite rule B3 and give the 007/008 correction as a reviewer 2.5 fix. |
| F-5 | Minor | AP2499_002 step 4, AP2499_007 step 5, AP2499_008 step 5, AP2499_013 step 5 | The verification step reads "the screenshot taken after step N", but the earlier step's action never says to take that screenshot, so the executor may only capture the final state. | Add "take a screenshot of the modal" to the action of the step the verification refers to (002 step 2, 007/008 step 3, 013 steps 2–4). |

=== REVIEW VERDICT ===
ticket: AP-2499
checkpoint: R2
round: 1
verdict: REWORK
gate: Gate B: execute the current cases after rework — rule B3
rework_stage: s3
rework_scope: AP2499_009, AP2499_005, AP2499_012, AP2499_010, AP2499_001, AP2499_002
findings: 1/2/2
park_reason: —
record: qa-artifacts/7-reviews/AP-2499_review.md
=== END ===

## R2 — Test cases — round 2 — 2026-11-01T01:43:11Z (independent reviewer)
Reviewed: qa-artifacts/.pipeline/AP-2499.md, requirements/AP-2499-add-gap-creditors-insurance-financing-form.md, qa-artifacts/1-requirements-analysis/AP-2499_requirements-analysis.md (REQ-002, Open Questions), qa-artifacts/3-test-cases/AP2499_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2499_TestCases_006-010.md, qa-artifacts/3-test-cases/AP2499_TestCases_011-013.md, qa-artifacts/3-test-cases/AP2499_ReviewFindings_2026-11-01.md, qa-artifacts/7-reviews/AP-2499_review.md (round-1 findings), .claude/skills/stlc-ticket-pipeline/routing.md §3 Gate B
Verdict: **APPROVE** · Gate B: Execute the current cases — rule B3
Findings: 0 blocker · 0 major · 2 minor

All three reworked files were read again from disk and every round-1 finding was checked against the text. F-1 is fixed: if Chubb prices Life term 999, AP2499_009 step 4 now records the case BLOCKED ("failure not reproduced with Life term 999 — Q-007") and never PASS, and Known blockers row 2 says the same. F-2 is fixed: in AP2499_005 step 4 and AP2499_012 step 5, an empty residual, a placeholder or `0` is only recorded for Q-004, and the case fails only on a non-zero residual (or, in 012, on any date of birth appearing). The phrase "a residual of 0 the dealer never typed" is gone. F-3 is fixed: AP2499_010 records any drop-down that cannot be emptied and expects an error only next to fields that were really left empty, with "nothing stored" at step 5 as the main check, and AP2499_001 step 3 and AP2499_002 step 4 judge only the text, number and date fields, recording each drop-down's opening state for Q-004. F-4 is fixed: the Revisions row in 006-010 and the run-state Gate log now cite rule B3. F-5 is fixed: each step that a later verification step relies on now says to take the screenshot (002 step 2, 007/008 step 3, 013 steps 2–4, and also 009 step 3). Rule-check: no new guessed assertion was introduced, and the set can be trusted for execution.

Checklist: 2.1 pass (REQ-001 → 001, 002, 013; REQ-002 → 001–005, 013; REQ-003 → 003, 004, 005, 012; REQ-004 → 003, 006; REQ-005 → 007–009; REQ-006 → 010–012; every case cites its REQ and AC) · 2.2 pass (concrete values, alert texts, URL unchanged, Financing card values, "- None Selected -") · 2.3 pass (5 + 5 + 3 cases, all ≤ 5 steps, IDs 001–013 with no gap or duplicate) · 2.4 not applicable (no Blocking question; AP2499_013 BLOCKED on Q-002 with a Blocked by value) · 2.5 pass (Q-001, Q-003–Q-008, Q-010–Q-012 all record-only; 009 no longer passes without a failure) · 2.6 pass (0 High Pass 2 proposals) · 2.7 pass (vehicle 915 from `test-data`; `fromVehicleId` route from `domain`; quotes and financings created in `[Pre-Condition]` steps).

Gate B: no Pass 1 gap cites a REQ or AC that has no test case (the one Pass 1 gap is a wrong assertion in 007/008, already corrected under check 2.5), so B1 does not fire; no Pass 2 proposal is High, so B2 does not fire. Rule **B3 — execute the current cases**. Pass 2 proposals #1–#8 (4 Medium, 4 Low) are not promoted.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2499_TestCases_006-010.md — AP2499_009 step 4 | The case passes on "a provider error **or a validation message**". A field-level validation message on Life term `999` is a rejection by the form, not a quote that the insurance provider refused. Both satisfy the criterion's words "on failure an error is shown", so no result changes, but a PASS from a validation message does not prove the provider-failure path. | No change to the file. When the case passes, the execution log and test report must state which kind of failure was exercised (validation message or provider error), using the outcome recorded at step 3. |
| F-2 | Minor | AP2499_TestCases_011-013.md — AP2499_012 step 5 | Typo: "…the recorded type and company), Record exactly what…" has a comma and a capital letter where a full stop belongs. | Change it to "…the recorded type and company). Record exactly what…" the next time the file is edited. |

=== REVIEW VERDICT ===
ticket: AP-2499
checkpoint: R2
round: 2
verdict: APPROVE
gate: Gate B: execute the current cases — rule B3
rework_stage: —
rework_scope: —
findings: 0/0/2
park_reason: —
record: qa-artifacts/7-reviews/AP-2499_review.md
=== END ===

## R3 — Execution results — round 1 — 2026-11-02T00:14:00Z
Reviewed: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2499_2026-11-02.md, qa-artifacts/3-test-cases/AP2499_TestCases_001-005.md, AP2499_TestCases_006-010.md, AP2499_TestCases_011-013.md, requirements/AP-2499-add-gap-creditors-insurance-financing-form.md, qa-artifacts/.pipeline/AP-2499.md, the 21 screenshots in qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/, open AP bugs from 9 Jira duplicate searches, AP-2410
Verdict: **APPROVE** · Gate C: File new for every FAIL (AP2499_003, 004, 006, 007, 008); no Not-a-bug decision, so s4c is skipped — rule C4
Findings: 0 blocker · 0 major · 2 minor

The Dev run of all 13 cases is complete and can be trusted: every case has a final status (5 PASS, 5 FAIL, 3 BLOCKED, recounted from the per-case rows; 38%), every PASS row records the observed value, every screenshot path exists, and the ten images inspected show what the log claims. AP2499_003 was re-judged FAIL by the executor before this review because its step-3 and step-5 screenshots show the same collapsed financing summary that AP2499_004 fails on; the two cases are now consistent. The three BLOCKED cases each name their blocker (Q-011 empty residual refused, Q-007 failure not reproduced, Q-002 no Humania dealer on Dev). No environment failure was recorded as FAIL, and none of the known Dev defects was hit.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2499_TestCases_001-005.md, 006-010.md, 011-013.md — Execution Context, Environment row | The rows still say "v2staging"; this run was on Dev by the user's decision (the log notes it). | Next s3 touch: say the environment is taken from `env` at run time. |
| F-2 | Minor | AP2499_TestCases_*.md — shared financing values F1 | "Term months `60`" reads as typed text; on Dev it is a drop-down (3–240 in steps of 3). No result changed. | Next s3 touch: say "select 60". |

Gate C per FAIL:
- **AP2499_003 + AP2499_004** (financing form collapsed to a one-line summary once a financing exists) — C1 does not hold: the capture says "the financing form does not disappear when a financing already exists" and no sentence says a summary is intended. C2/C3 do not hold: the closest open bug, AP-2524 ("the roadside-protection modal folds the vehicle form … behind an "Edit" link"), is a different screen (roadside modal). → **C4 File new** (one bug for both cases; link AP-2524 as *relates to*).
- **AP2499_006** (Save in the creditors modal on a quote with a financing draws the whole quote page inside the modal) — no candidate names this modal. → **C4 File new**.
- **AP2499_007 + AP2499_008** (Get Quote reloads the quote page and closes the modal; result not shown below the form) — AP-2410 (open, QA) names the Chubb Get Quote but describes "an error message" on a valid submit, a different behaviour; no other candidate. → **C4 File new** (one bug for both cases).

Screenshots inspected: AP2499_001-step3-GapModalFinancingFormFirst_pass.png matches · AP2499_002-step2-CreditorsModalFinancingForm_pass.png matches · AP2499_003-step3-FinancingEditExpanded_pass.png matches · AP2499_003-step5-ReopenedGapModalFinancingSummary_fail.png matches · AP2499_004-step4-FinancingCollapsedToSummary_fail.png matches · AP2499_006-step3-ModalRendersQuotePage_fail.png matches · AP2499_007-step3-PageReloadedModalClosed_fail.png matches · AP2499_008-step3-PageReloadedModalClosed_fail.png matches · AP2499_010-step5-NothingStored_pass.png matches · AP2499_011-step5-FinancingUnchanged_pass.png matches

## R3 — Execution results — round 1 — 2026-11-02T00:18:38Z (independent reviewer)
Reviewed: qa-artifacts/.pipeline/AP-2499.md, requirements/AP-2499-add-gap-creditors-insurance-financing-form.md, qa-artifacts/1-requirements-analysis/AP-2499_requirements-analysis.md (Open Questions), qa-artifacts/3-test-cases/AP2499_TestCases_001-005.md, AP2499_TestCases_006-010.md, AP2499_TestCases_011-013.md, qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2499_2026-11-02.md, 10 screenshots in qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/ (all 21 paths checked on disk), qa-artifacts/qa-docs/quote-creation.md (AP-2499 Dev section), .claude/skills/stlc-ticket-pipeline/routing.md §3 Gate C, 17 Jira searches of my own (13 open-bug text searches, 4 all-status summary searches), AP-2521, AP-2524, AP-2410, AP-2462
Verdict: **APPROVE** · Gate C: File new ×3 — 003+004 (rule C4, relates to AP-2521 and AP-2524), 006 (rule C4), 007+008 (rule C3 → reviewer rule E2, relates to AP-2410); no C1, s4c skipped
Findings: 0 blocker · 0 major · 3 minor

This is a separate review made from the files on disk; it does not reuse the inline R3 section above. The Dev run is complete and can be trusted: all 13 cases have a final status, the counts recount to 5 PASS, 5 FAIL, 3 BLOCKED (5 ÷ 13 = 38%), every PASS row states the value seen, every screenshot path exists, and the ten images I opened show what the log says. None of the five FAILs rests on a record-only point. 007 and 008 fail because the result is not shown "below the form in the same modal" (the page reloads and the modal closes), not because typed values were lost after a successful quote; 003 and 004 fail because the financing form is folded into a summary line, not because of an empty, placeholder or `0` residual. The three BLOCKED cases are right: 009 was priced, so the failure branch was never produced and it is correctly not a PASS; 013 has no Humania dealer (Q-002); and 005 is not a hidden FAIL, because no sentence in the capture says the residual may be left empty. The Validation criterion only leaves the residual off its list, and whether it is optional is still open as Q-011 (Judgement). No credential appears in any AP-2499 file, and the write-backs only added content (a new Dev section in `quote-creation.md`, result fields and Execution Log sections in the test-case files, and the run-state Gate log). The three minor findings change how the bugs are linked, not any result.

Checklist: 3.1 pass (13 of 13 in the log, none Not Run) · 3.2 pass (5/5/3, 38%; step counts per row match) · 3.3 pass · 3.4 pass (21 of 21 paths exist) · 3.5 pass (10 images, see below) · 3.6 pass (each FAIL names its step and states how the result differs) · 3.7 pass (no login failure, timeout or 5xx before a step under test; the 302 in 006 is the result under test) · 3.8 pass in the log (Q-011, Q-007, Q-002); the test-case header fields are Minor F-3 · 3.9 pass with corrections F-1 and F-2.

Judgement of each FAIL against the acceptance criteria:
- **AP2499_003 (steps 3 and 5) and AP2499_004 (step 4).** These are real FAILs. AC "Financing form is always present above the insurance form" says "the financing form does not disappear when a financing already exists", and AC "Prefill from the existing financing" says "each field shows the stored value — type, base amount, residual, payment frequency, term months, interest rate, financing company, applicant date of birth". In both screenshots the form is a single line, "Financing · 60 months · 25,000.00$ · AutoCapital Canada", with an Edit link, so residual, rate, frequency, type and date of birth are not visible. The stored values are correct once Edit is clicked, so this is about how the form is shown, not about the data. No Open question covers a collapsed form, so this is not a guess. In 003, saving the financing and moving on inside the modal worked (step 3 URL unchanged, card values at step 5 match F1).
- **AP2499_006 (step 3).** This is a real FAIL. AC "Submit persists and continues in the modal" requires "the modal refreshes to the insurance step backed by the saved financing". After Save, the modal holds the whole `/quote/6538/details` page (screenshot: heading "#6538 - Gap Gap2499-006…", Vehicle, Financing 30,000.00$, Summary of products) and no creditors step. The data part passed (30000 was stored as one updated financing). This is a different defect from 003: in 003 the save in the GAP modal, on a quote with no financing, re-rendered correctly.
- **AP2499_007 and AP2499_008 (steps 3 and 5).** These are real FAILs. AC "Insurance results render below the form" requires "the result renders below the form in the same modal". After Get Quote, the whole page reloads with "Chubb insurance quote saved successfully" or "GAP insurance quote saved successfully", the modal is gone, and the premium appears only on the Summary-of-products row (CA$18.58 /m or CA$3,094.00). The FAIL does not depend on whether the typed values were kept, which is record-only.

Distinct defects and Gate C (based on my own searches):
1. **The financing form in the GAP/creditors modal is folded into a summary line behind "Edit" once a financing exists** (AP2499_003, AP2499_004). The closest candidates show the same pattern on other screens: AP-2521 (add-extended-warranty modal, "hides the vehicle form behind 'Edit' on open") and AP-2524 (roadside-protection modal, "folds the vehicle form … behind an 'Edit' link"). Both are on different modals and different forms, so C2 and C3 do not hold, because neither names this screen. → **C4 File new**, linked *relates to* AP-2521 and AP-2524, because the three are probably the same shared component.
2. **Saving the financing in the creditors modal on a quote with a financing draws the whole quote page inside the modal** (AP2499_006). No open bug names this modal. AP-2462 (admin "Link a product" opens as a full page) and AP-2479 (earning group shows its error on a separate page) are other screens. → **C4 File new**.
3. **Get Quote in the GAP/creditors modal reloads the quote page and closes the modal; the result is never shown in the modal** (AP2499_007, AP2499_008). AP-2410 (open, status QA) names the same control on the same route, the Chubb Insurance Quote `/quote/{id}/insurance` "Get Quote", which is the route the creditors modal loads. Its behaviour is different, though: "Submit unsuccessfully with the error message". On Dev the submit succeeds. Same control, different behaviour → **C3**, which in reviewer mode is rule E2 → **File new**, linked *relates to* AP-2410, with one line in the description naming AP-2410 and the difference (here the quote is saved, but it is shown outside the modal).
No C1: no sentence in the capture and no comment (the ticket has none) says that a collapsed form, a page drawn inside the modal, or a reload is intended. s4c is skipped. The all-status searches for "GAP", "creditor" and "insurance modal" returned no bugs, and "Chubb" returned only AP-2410. So no older GAP or creditors bug exists to re-open.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | qa-artifacts/.pipeline/AP-2499.md — Gate log, Gate C line (and the inline R3 section) | The bug for AP2499_003 and AP2499_004 is to be linked only to AP-2524. AP-2521 reports the same "hidden behind Edit" folding in the add-extended-warranty modal and turned up in the same search. | When s5 files the bug, link it *relates to* both AP-2521 and AP-2524, and name both in the description as the same pattern on other modals. |
| F-2 | Minor | qa-artifacts/.pipeline/AP-2499.md — Gate log, Gate C line for AP2499_007 and AP2499_008 | The decision for AP-2410 is logged as C4 with no link. AP-2410 names the same Get Quote control on the same `/quote/{id}/insurance` route with a different behaviour, so rule C3 applies, and its reviewer rule E2 says to file new *and* link. | When s5 files the bug, link it *relates to* AP-2410 and add one line to the description: "AP-2410 reports an error on Get Quote on this route; here the quote is saved but the page reloads and the modal closes." |
| F-3 | Minor | AP2499_TestCases_001-005.md — AP2499_005 header; AP2499_TestCases_006-010.md — AP2499_009 header | Both cases are BLOCKED, but their **Blocked by** field still says "—". The reasons (Q-011 and Q-007) appear only in the Result field and in the log. | The next time s3 or s4 touches these files, set **Blocked by** to "Q-011 — an empty residual cannot be stored" (005) and "Q-007 — failure not reproduced with Life term 999" (009). |

Notes for s5 and s6 (no finding): the AP2499_003 step-3 screenshot shows the quote page behind the modal still reading "You have not added financing details yet" after the save. This is cosmetic and covered by no criterion, so record it in the bug for defect 1 only as context. AP2499_009 shows that Life term 999 is priced as a 60-month term. Record it under Q-007, not as a bug. AP2499_005 should be raised on AP-2499 as Q-011 in s7 (is the residual meant to be optional?).

Screenshots inspected: AP2499_001-step3-GapModalFinancingFormFirst_pass.png matches · AP2499_002-step2-CreditorsModalFinancingForm_pass.png matches · AP2499_003-step3-ModalMovedToGapStep_fail.png matches · AP2499_003-step5-ReopenedGapModalFinancingSummary_fail.png matches · AP2499_004-step4-FinancingCollapsedToSummary_fail.png matches · AP2499_006-step3-ModalRendersQuotePage_fail.png matches · AP2499_007-step3-PageReloadedModalClosed_fail.png matches · AP2499_008-step3-PageReloadedModalClosed_fail.png matches · AP2499_010-step5-NothingStored_pass.png matches · AP2499_011-step5-FinancingUnchanged_pass.png matches

=== REVIEW VERDICT ===
ticket: AP-2499
checkpoint: R3
round: 1
verdict: APPROVE
gate: Gate C: File new ×3 — 003+004 (C4, relates AP-2521, AP-2524), 006 (C4), 007+008 (C3→E2, relates AP-2410); s4c skipped
rework_stage: —
rework_scope: —
findings: 0/0/3
park_reason: —
record: qa-artifacts/7-reviews/AP-2499_review.md
=== END ===

## R4 — Outcome plan — round 1 — 2026-11-02T00:26:00Z (inline, run inside the AP-2499 worker)
Reviewed: qa-artifacts/5-testing-report/AP-2499_test-report.md, qa-artifacts/5-testing-report/AP-2499_bug-report.md, qa-artifacts/1-requirements-analysis/AP-2499_requirements-analysis.md (Open Questions), qa-artifacts/qa-config/tools.md §2 QA outcome rules, qa-artifacts/4-execution-results/comment_AP-2499_2026-11-02.md (planned story comment), AP-2526/AP-2527/AP-2528 read back from Jira
Verdict: **APPROVE** · Gate D: post the story result comment on AP-2499; leave the status (QC) and assignee unchanged — pass rate 38% (needs 90%); no bug-ticket action
Findings: 0 blocker · 0 major · 0 minor

The outcome plan follows the rules. 4.1 pass: PASS ÷ (13 − 0 SKIPPED) = 5 ÷ 13 = 38%, the figure in the test report and the planned comment. 4.2 pass: the five FAILs (003, 004, 006, 007, 008) are filed as AP-2526, AP-2527 and AP-2528, each read back from Jira as Bug, Medium, Backlog, assigned to Ken Nguyen and linked *relates to* AP-2499. 4.3 pass: none of the three bugs is stopping — each is Medium, none made another case BLOCKED (the BLOCKED cases rest on Q-011, Q-007 and Q-002), and in every failing case the later steps still ran. 4.4 pass: the pass-rate check fails (38% < 90%), so the story is not moved to Ready for release and the assignee stays; there is no Blocking question (all 15 are Judgement or Info). 4.5 pass: the comment lists all 13 test cases with status and bug, the three bugs, the three BLOCKED reasons, Q-011 raised as a question, the Life term 999 pricing under Q-007, every Open question with today's behaviour, "Tested on: Dev (v2dev)", and the "Not moved" line. 4.6 not applicable: no bug of this run is in the tracker's QA status, so no re-assignment is planned.

=== REVIEW VERDICT ===
ticket: AP-2499
checkpoint: R4
round: 1
verdict: APPROVE
gate: Gate D: comment only — not moved to Ready for release (pass rate 38%, needs 90%)
rework_stage: —
rework_scope: —
findings: 0/0/0
park_reason: —
record: qa-artifacts/7-reviews/AP-2499_review.md
=== END ===

## R5 — Automation specs — round 1 — 2026-11-02T00:37:00Z (inline, run inside the AP-2499 worker)
Reviewed: qa-artifacts/6-automation/AP-2499_automation-report.md, playwright-automation/src/tests/dealer/gapCreditorsFinancingForm_AP2499.spec.ts, src/flows/GapCreditorsFinancingFlow.ts, src/pages/dealerPortal/GapCreditorsFinancingModal.ts, the execution log and AP2499_TestCases_*.md
Verdict: **APPROVE**
Findings: 0 blocker · 0 major · 1 minor

5.1 pass with a deviation: `npm run lint` clean; the spec was run twice (5/5 passed both times, 1.8 min each) as two separate runs rather than `--repeat-each=2` in one, to keep the quotes created on Dev to two runs (worker instruction "keep creations minimal"). 5.2 pass: five tests titled AP2499_001, 002, 010, 011, 012 — all PASS in the log; describe carries `@AP-2499`. 5.3 pass — step → assertion: 001 step 3 → verifyEmptyFinancingFormFirst (no alert, "Financing" first, DOB/base/residual/rate empty, no GAP or creditors form below; drop-downs recorded for Q-004); 002 step 3 → verifyInsuranceRouteShowsFinancingForm (HTTP < 400, no error, no alert, financing form); 002 step 4 → verifyEmptyFinancingFormFirst('creditors'); 010 step 3 → seven "This value should not be blank." errors + modal still on the financing step; 010 step 5 → card "You have not added financing details yet", both rows "- None Selected -"; 011 step 3 → "This value is not valid." under the base amount; 011 step 5 → card 25,000.00$ / Term 60 / 6.9900%; 012 step 3 → Residual error, modal on the financing step; 012 step 5 → nothing stored, re-opened residual and date of birth empty. 5.4 pass: no waitForTimeout, no test.only, no credential or absolute URL (login via dealerUser, relative routes). 5.5 pass: the page object has no expect / test.step. 5.6 pass: no existing file changed (git status shows three new untracked files only). 5.7 pass: client e-mail and last name carry Date.now(); every quote is created by the test, none picked by "newest". 5.8 not applicable (no fixme). 5.9 pass: every new locator has its count recorded.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | GapCreditorsFinancingFlow.verifyFinancingUnchanged | The card check for AP2499_011 uses the amounts of QuoteCancelProductFlow.addFinancing (25,000 / 60 / 6.99), which match the manual F1 values; if that shared precondition ever changes, this check must follow. | None now. |

=== REVIEW VERDICT ===
ticket: AP-2499
checkpoint: R5
round: 1
verdict: APPROVE
gate: —
rework_stage: —
rework_scope: —
findings: 0/0/1
park_reason: —
record: qa-artifacts/7-reviews/AP-2499_review.md
=== END ===
