# QA Reviews — AP-2471

## R1 — Requirements analysis — round 1 — 2026-11-01T01:12:00Z
Reviewed: requirements/AP-2471-admin-earning-curve-management.md, qa-artifacts/1-requirements-analysis/AP-2471_requirements-analysis.md, qa-artifacts/.pipeline/AP-2471.md
Verdict: **APPROVE** · Gate A: post the Blocking questions Q-001 and Q-002 on AP-2471 and continue — rule A2
Findings: 0 blocker · 0 major · 2 minor

Run inline inside the AP-2471 batch worker (a subagent), read from disk under the fresh-eyes rule. The analysis can be trusted: every acceptance criterion in the capture maps to REQ-001 to REQ-006, the two requirements without criteria (REQ-007 Save, REQ-008 Delete) each carry a Blocking question, and all 13 open questions now have an Impact and a Status. The three Answered questions quote capture sentences. Two requirements out of eight have a Blocking + Open question, so not every requirement is blocked and rule A2 applies.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP-2471_requirements-analysis.md — Q-013 | Q-013 is Answered by the QA's own scope clarification of 2026-10-04, drawn from the reporter's mock-up, not by a sentence the author wrote. It is a capture sentence, so it meets the rule, but the author has never confirmed it. | None needed for this run. Mention Q-013 in the s7 story comment so Ken Nguyen can object if the reading is wrong. |
| F-2 | Minor | AP-2471_requirements-analysis.md — REQ-006 AC 3 | AC 3 ("manually entered factors must be saved") comes from Ken Nguyen's 2026-09-24 defect comment, not a written criterion. It is labelled as such, so it is not invented scope. | None. Keep the label. |

Gate A evidence: Blocking + Open = 2 (Q-001 → REQ-007, Q-002 → REQ-008) of 8 requirements; Blocking + Answered = 3 (Q-003, Q-007, Q-013); Judgement = 6 (Q-004, Q-005, Q-006, Q-008, Q-009, Q-010); Info = 2 (Q-011, Q-012). No QA comment listed the IDs Q-001/Q-002, so the questions comment was posted: AP-2471 comment 19435, read back and matching. Judgement and Info questions are not posted at Gate A.

## R2 — Test cases — round 1 — 2026-11-01T01:40:00Z
Reviewed: qa-artifacts/3-test-cases/AP2471_TestCases_001-005.md, AP2471_TestCases_006-010.md, AP2471_TestCases_011-015.md, AP2471_ReviewFindings_2026-11-01.md, qa-artifacts/1-requirements-analysis/AP-2471_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2471_test-plan.md, qa-artifacts/qa-docs/earning-curves.md
Verdict: **APPROVE** · Gate B: promote the two High Pass 2 proposals (#1 type switch after Custom factors, #2 shortening a saved curve's term) and re-run s3 — rule B2
Findings: 0 blocker · 0 major · 3 minor

Run inline inside the AP-2471 batch worker, read from disk under the fresh-eyes rule. The 15 revised cases can be trusted: every acceptance criterion of REQ-001 to REQ-006 has a case, REQ-007 is covered at its user-story minimum with the save message recorded for Q-001, and REQ-008's only case is BLOCKED by Q-002 with "Not known — Q-002" in its dependent results. No expected result asserts an answer to a Judgement question: AP2471_013 and AP2471_014 are record-only and fail only on objective faults, and every factor check accepts either scale (Q-004). Structure checked by script: 15 cases in 3 files of 5, each with 4–5 steps ending in a `[Verification]` step, IDs AP2471_001–015 with no gaps. All curves are created in `[Pre-Condition]` steps with their values written in; routes come from the `domain` source.

No Pass 1 gap cites an acceptance criterion without a test case (gaps 1–2 cite analysis risks, gaps 3–5 cite the test plan or partially covered criteria), so rule B1 does not fire. Pass 2 has two High proposals, so rule B2 promotes exactly those.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2471_TestCases_001-005.md — AP2471_003 step 3 | The criterion says "Is Enabled? — Yes/No toggle"; the `domain` source records a plain checkbox. A checkbox switches Yes/No, so the step is judgeable, but the executor should record the control type. | None now. The executor records "checkbox" in the Actual Result. |
| F-2 | Minor | AP2471_TestCases_011-015.md — AP2471_012 step 4 | "The row count has not changed" relies on the list showing every curve; the list pages at 10 rows. | None now. The executor counts across pages or checks the curve's id stays the same. |
| F-3 | Minor | AP2471_TestCases_006-010.md — AP2471_009 step 4 | The old expected result "updates without a page reload" was softened to "record whether the page reloads"; fine, but the case title still says "recalculates on every change". | None. The title states the criterion; the reload is an observation. |

Unpromoted proposals (logged per rule B2): Pass 2 #3–#10 and Pass 1 gaps 3–5 stay in the review file for the backlog or for the answers to Q-001, Q-005, Q-006 and Q-009.

### R2 — round 1 addendum — promoted cases — 2026-11-01T01:50:00Z
Reviewed: qa-artifacts/3-test-cases/AP2471_TestCases_016-017.md
Verdict: **APPROVE** — the promotion re-run of s3 is consistent with the rules; no further review round needed.
Findings: 0 blocker · 0 major · 0 minor

AP2471_016 and AP2471_017 each have 5 steps ending in `[Verification]`, create their own curve with the field values in step 1, and assert only what the capture states (REQ-005 AC 1 regeneration to Pro-Rata at 1/4; REQ-004 AC 5 row count) plus the objective fault "stored differs from what the form showed". What happens to typed factors on a type or term change is record-only for Q-010, and the total after shortening is record-only for Q-009. Per routing.md §3 Gate B, s3b is not re-run after promotion.

## R2 — Test cases — round 1 — 2026-11-01T02:45:00Z
Reviewed: qa-artifacts/.pipeline/AP-2471.md, requirements/AP-2471-admin-earning-curve-management.md, qa-artifacts/1-requirements-analysis/AP-2471_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2471_test-plan.md, qa-artifacts/3-test-cases/AP2471_TestCases_001-005.md, AP2471_TestCases_006-010.md, AP2471_TestCases_011-015.md, AP2471_TestCases_016-017.md, AP2471_ReviewFindings_2026-11-01.md, qa-artifacts/5-testing-report/AP-2471_bug-report.md, qa-artifacts/3-test-cases/AP2485_TestCases_001-003.md, AP2486_TestCases_001-003.md, qa-artifacts/qa-docs/earning-curves.md, qa-artifacts/.pipeline/_batch-2026-11-01.md
Verdict: **APPROVE** · Gate B: execute the current 17 cases (the High Pass 2 proposals #1 and #2 are already promoted as AP2471_016–017; promotion happens at most once per run) — rule B2
Findings: 0 blocker · 0 major · 5 minor

Independent review by a separate subagent that wrote none of these files; the earlier R2 verdict in this file was not reused. All 17 cases (4 files, 4–5 steps each, IDs AP2471_001–017 with no gaps) were read from disk. Every acceptance criterion of REQ-001 to REQ-006 has a case, REQ-007 is judged only at its user-story minimum with the Q-001 parts recorded, and AP2471_015 is BLOCKED by Q-002. No expected result hangs on a Judgement question. The oracle values in AP2471_004–008, 011, 012 and 016 were recomputed from the formulas and all match. **Bug re-test overlap:** only two cases retrace the AP-2485/AP-2486 paths. AP2471_004 steps 2–4 switch a 12-month form to Rule of 78 and back without saving. AP2471_014 attempt 3 is one save with an empty box. The test plan (objective 5, risks for AP-2485/AP-2486) states this overlap on purpose, as story-level evidence that is linked at Gate C, not filed again. The saved-curve, Reverse, edit-page and create-page variants are left to AP2485_001–003 and AP2486_001–003. That overlap is small and justified. **Protected curves:** no case edits or deletes a seeded curve (1–6), an AP-2472 curve (7–8) or a previous-cycle curve (9–13). Every Execution Context forbids it and names curve 13 as AP-2485's evidence. The only edits target curves the same run creates (AP2471_012 → AP2471_011's curve; AP2471_014 and AP2471_017 → their own). The cases can be executed as they stand. The minor points below are refinements.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2471_TestCases_001-005.md — AP2471_004 steps 1–4 | The only 12-month Pro-Rata value check runs after the Rule of 78 → Pro-Rata switch, which is AP-2485's reproduction (also run by AP2485_001 steps 2–3). If AP-2485 is still unfixed, REQ-005 AC 2 at 12 months gets no evidence that does not depend on the bug, even though the fresh default table may be correct. AP2471_003 step 4 counts the rows but does not check their values. | Have step 1 read the fresh default 12-row table and check 1/12 (0.0833 or 8.3333) before the switch, so the Pro-Rata calculation is judged separately from the AP-2485 path. |
| F-2 | Minor | AP2471_TestCases_011-015.md — AP2471_014 step 4; AP2471_TestCases_006-010.md — AP2471_007 steps 4–5 | AP2471_014 attempt 3 repeats AP2486_001 steps 3–4 (empty factor box, then Save). AP2471_007's 24-month Rule of 78 → Pro-Rata switch overlaps AP2485_002. Both overlaps are deliberate (test plan objective 5) and small. | No change to the cases. At Gate C, link a recurrence to AP-2485 / AP-2486 by rule C2, and do not count it as a new defect in the story's bug report. |
| F-3 | Minor | All four files — curve names `QA-AP2471-…-<HHMM>` (AP2471_010–017) | The previous cycle's curves 9–13 carry the same prefixes with the suffix `0043` (for example curve 13 `QA-AP2471-Del-0043` and curve 12 `QA-AP2471-Neg-Custom90-0043`). A run at 00:43 would create rows with the same name, and AP2471_012 step 1 ("find … or create"), AP2471_014 step 3 ("open the curve again") and AP2471_015 step 5 could then act on a protected curve. | Use `<HHMMSS>` as AP2485_001–003 do, or have each case reopen its curve by the id recorded at save rather than by name. |
| F-4 | Minor | AP2471_TestCases_001-005.md — AP2471_001 step 2 | The expected result says "Earning Curves" is the flyout's *first* item. Neither the acceptance criteria nor the 2026-10-04 scope clarification states an order, so a reordered menu would fail on an unstated rule. | Drop "first" from the expected result, and record the item's position instead. |
| F-5 | Minor | AP2471_TestCases_006-010.md — AP2471_008 step 2 | The expected result gives only the percentage scale (Monthly 100.0000, Cumulative 100.00). The previous cycle and the `domain` source show the fraction scale (1.0000), and other cases list both scales. | Add "(1.0000 / 1.0000 on a fraction page)", as step 4 already does. |

Unpromoted proposals stand as logged at the earlier Gate B (Pass 2 #3–#10, Pass 1 gaps 3–5). They are not Major here: none cites an acceptance criterion without a test case.

## R3 — Execution results — round 1 — 2026-11-01T19:20:00Z
Reviewed: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md, qa-artifacts/3-test-cases/AP2471_TestCases_001-005.md, AP2471_TestCases_006-010.md, AP2471_TestCases_011-015.md, AP2471_TestCases_016-017.md, qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/ (25 files), qa-artifacts/1-requirements-analysis/AP-2471_requirements-analysis.md (Open Questions)
Verdict: **APPROVE** · Gate C: skipped — no FAIL in the log, nothing to file or link; s4c skipped — no rule C1 decision
Findings: 0 blocker · 0 major · 2 minor

The 2026-11-02 Dev run executed all 17 cases: 16 PASS, 0 FAIL, 0 BLOCKED, 1 SKIPPED (AP2471_015, delete not in scope on Dev). Reviewed inline by the worker under the fresh-eyes rule, from the files on disk. Counts recount correctly (16 ÷ (17 − 1) = 100%), every PASS step records observed values, every screenshot path exists, and the inspected images show what the Actual Results claim. The record-only steps were judged under the user's binding decision of 2026-11-02 ("explore in the dev env and accept the actual result"), which is quoted in the log and the analysis; no explicit acceptance criterion was contradicted and no objective fault (HTTP 5xx, error page, stored value different from what was entered) occurred.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | execution log — AP2471_002 steps 2–4 | The three verification screenshots are copies of one capture of the list page. | None needed — all three checks are on that single screen; note kept in the log. |
| F-2 | Minor | execution log — AP2471_003 step 3 | AC 6 says "Is Enabled? is a Yes/No toggle"; Dev renders a single checkbox (ticked = Yes, list shows Yes/No). Judged PASS as a binary yes/no control, as in the 2026-10-04 cycle. | Mention the control type in the s7 story comment so the author can object. |

Screenshots inspected: AP2471_003-step3-NewFormDefaults_pass.png matches · AP2471_004-step4-ProRataAfterSwitch_pass.png matches · AP2471_010-step5-ReopenedCustomCurve32_pass.png matches · AP2471_012-step4-EditedCurve33RuleOf78_pass.png matches · AP2471_013-step5-OnlyRangeAttemptSaved34_pass.png matches · AP2471_014-step4-EmptyFactorFieldError_pass.png matches · AP2471_016-step5-Curve36StoredAsShown_pass.png matches · AP2471_017-step5-Curve37ThreeRowsStored_pass.png matches · AP2471_001-step2-RiskManagementFlyout_pass.png matches

## R3 — Execution results — round 1 — 2026-11-01T19:21:27Z (independent reviewer)
Reviewed: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md, qa-artifacts/3-test-cases/AP2471_TestCases_001-005.md, AP2471_TestCases_006-010.md, AP2471_TestCases_011-015.md, AP2471_TestCases_016-017.md, qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/ (25 files, every log path checked), qa-artifacts/1-requirements-analysis/AP-2471_requirements-analysis.md, requirements/AP-2471-admin-earning-curve-management.md, qa-artifacts/.pipeline/AP-2471.md, qa-artifacts/qa-docs/earning-curves.md
Verdict: **APPROVE** · Gate C: skipped — no FAIL in the log, nothing to file or link; s4c skipped — no rule C1 decision
Findings: 0 blocker · 0 major · 5 minor

This is an independent review of the 2026-11-02 Dev (v2dev) run, done from the files on disk; the browser was not re-opened and no Dev data was touched. The log can be trusted: all 17 cases are present (16 PASS, 0 FAIL, 0 BLOCKED, 1 SKIPPED; 16 ÷ (17 − 1) = 100%), every PASS step records observed values, every screenshot exists, and the ten inspected images show exactly what the Actual Results claim. Under the user's binding decision ("explore in the dev env and accept the actual result"), every formerly open question is recorded as "answered by observation on Dev (v2dev), 2026-11-02" with the observed behaviour in both the analysis (Q-001, Q-002, Q-004–Q-006, Q-008–Q-012) and the log. No PASS hides an explicit-criterion violation or an objective fault: the cumulative column is the running total that the ticket's examples, the Custom criterion ("recalculate the cumulative sum") and the description's code all show (Q-003, answered from the capture); 12-month Pro-Rata reads 0.0833 × 12 with cumulative 0.0833 … 1.0000, equal to the ticket's example ÷ 100; the AP-2485 case (AP2471_004: Rule of 78 → Pro-Rata at 12 months) and the AP-2486 case (AP2471_014 step 4: empty factor box gives a field error, no HTTP 500) both pass with screenshots that show it. The cumulative values are computed from the unrounded factor (row 2 = 0.1667, not 0.0833 + 0.0833 = 0.1666); this matches the ticket's own example (16.67%), so it is not a fault. AP2471_015 is correctly SKIPPED: Dev has no delete control in the list or the Edit form (screenshot shows only the pencil in every Actions cell), and no extra undeletable curve was created to look for it. Only curves #32–#37 were created or edited; the log states that no other curve was opened for editing, and the list screenshots show the AP-2486 curves unchanged. Curve #13 was only read as a dropdown label for Q-012. The write-back to qa-artifacts/qa-docs/earning-curves.md appends a dated "Dev (v2dev) — observed 2026-11-02" section and leaves the staging notes intact (add/refresh only).

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | execution log — AP2471_003 step 3 | The acceptance criterion says "Is Enabled? — Yes/No toggle"; Dev renders a single checkbox (ticked = Yes, list shows Yes/No). Judged PASS as a binary yes/no control. | Name the control type in the s7 story comment so the author can object. |
| F-2 | Minor | AP-2471_requirements-analysis.md — Q-005 answer vs execution log — Questions answered by observation, Q-005 | The analysis says "1, 24, 36 and 60 work"; the log says "1 and 60 work". Both are true (24 and 36 ran in AP2471_007 and _011), but the two records differ. | Align the log's Q-005 line with the analysis at the next s4 or s6 edit. |
| F-3 | Minor | AP-2471_requirements-analysis.md — risk summary table (REQ-007, REQ-008, REQ-003, REQ-006, REQ-004 scale, REQ-005 rounding, REQ-006 read-only, REQ-007 edit, REQ-001 roles) | These risks still read "Open" although the questions behind them are now answered by observation on Dev. | Mark them "Closed — answered by observation on Dev (v2dev), 2026-11-02" at the next s1 edit. |
| F-4 | Minor | qa-artifacts/.pipeline/AP-2471.md — Warnings | One warning calls AP-2485 and AP-2486 "both Done", the next says they are "in QC". | Fix the run state to the tracker's current status before s5/s7 rely on it. |
| F-5 | Minor | qa-artifacts/qa-docs/earning-curves.md — "The flow" and "Validation and messages" | These staging sections still state an HTTP 500 for an empty factor box and the Pro-Rata-at-12 gotcha, with the Dev correction only in the appended section; the `domain` row in qa-config/knowledge.md still shows Last verified 2026-10-04. | Mark both staging statements "(staging, 2026-10-04 — fixed on Dev)" and refresh the `domain` Last verified date. |

Screenshots inspected: AP2471_004-step4-ProRataAfterSwitch_pass.png matches · AP2471_005-step4-RuleOf78Factors_pass.png matches · AP2471_006-step4-ReverseRuleOf78Row8_pass.png matches · AP2471_007-step5-ProRataTerm24_pass.png matches · AP2471_009-step5-CustomCumulativeRecalculated_pass.png matches · AP2471_012-step4-EditedCurve33RuleOf78_pass.png matches · AP2471_013-step5-OnlyRangeAttemptSaved34_pass.png matches · AP2471_014-step4-EmptyFactorFieldError_pass.png matches · AP2471_014-step5-Curve35LastSavedNegative_pass.png matches · AP2471_017-step5-Curve37ThreeRowsStored_pass.png matches · (SKIPPED evidence) AP2471_015-step2-NoDeleteControl_skipped.png matches

## R4 — Outcome plan — round 1 — 2026-11-01T19:24:53Z
Reviewed: qa-artifacts/5-testing-report/AP-2471_test-report.md, qa-artifacts/5-testing-report/AP-2471_bug-report.md, qa-artifacts/1-requirements-analysis/AP-2471_requirements-analysis.md (Open Questions), qa-artifacts/qa-config/tools.md §2 (QA outcome rules), the drafted s7 story comment, AP-2471 / AP-2485 / AP-2486 read from Jira on 2026-11-02
Verdict: **APPROVE** · Gate D: post the story result comment, move AP-2471 to Ready for release, assign to Ken Nguyen — rule D (§3.1, all three checks hold)
Findings: 0 blocker · 0 major · 0 minor

Run inline inside the AP-2471 worker (a subagent), from the files on disk and the tracker. The outcome plan can be trusted. 4.1: PASS ÷ (all − SKIPPED) = 16 ÷ (17 − 1) = 100%, equal to the report and ≥ the 90% threshold. 4.2: the execution log has no FAIL, so nothing needs filing. 4.3: no bug is linked to this run — AP-2485 and AP-2486 are both in Done (`bug_pass_status`), so neither counts as open or stopping. 4.4: no Blocking question is Open (Q-001 and Q-002 answered by observation on Dev under the user's decision of 2026-11-02; Q-003, Q-007, Q-013 answered from the capture), so the move to Ready for release meets all three checks. 4.5: the drafted comment lists all 17 test cases with status and bug, states "Tested on: Dev (v2dev)", lists each formerly open question as "answered by observation on Dev: <behaviour>", names the Is Enabled? checkbox-versus-toggle difference (R3 F-1) and mentions Q-013 (R1 F-1) and the Q-007 typo. 4.6: no bug ticket is re-assigned in this plan.

## R5 — Automation specs — round 1 — 2026-11-01T19:37:28Z
Reviewed: playwright-automation/src/tests/admin/earningCurveManagement_AP2471.spec.ts, playwright-automation/src/pages/adminPortal/AdminEarningCurvePage.ts, playwright-automation/src/flows/EarningCurveFlow.ts, qa-artifacts/3-test-cases/AP2471_TestCases_001-005.md, _006-010.md, _011-015.md, _016-017.md, qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md
Verdict: **APPROVE** · Gate —: specs accepted
Findings: 0 blocker · 0 major · 4 minor

Run inline inside the AP-2471 worker. The spec automates the 16 cases that passed manually (AP2471_015 was SKIPPED and is not automated), each test titled with its TC ID under `describe('Earning Curve Management @admin @AP-2471')`. Lint passes, and the whole tag passed on two separate runs against Dev (v2dev) with no flaky test. The changes to the page object and the flow are additions only — a diff against the pre-edit copies shows no removed or changed line, so the AP-2485 and AP-2486 specs keep their behaviour. No `waitForTimeout`, no `test.only`, no credential, URL or account in the code; login goes through `AdminFlow.loginToAdminPortal()`. Page-object members hold no `expect`; every assertion is in `EarningCurveFlow` inside `test.step`.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | Run (5.1) | The flaky check is two separate full runs, not one `--repeat-each=2`, because every run of AP2471_010–017 leaves 7 undeletable curves on Dev. | None — recorded in the automation report. |
| F-2 | Minor | spec — AP2471_013 attempt A | Reuses `fillCurveDetails()`, so odometer is 0 / 60000 instead of the case's 0 / 50000; the verdict (blank Name refused) does not depend on it. | None. |
| F-3 | Minor | flow — verifyEarningCurvesListPage() | The odometer format and Edit-only Actions are checked on the first list page (10 rows), as the manual run did. | None. |
| F-4 | Minor | flow — verifyNameNotListed() | Checks the first list page only; "no duplicate" in AP2471_012 is also covered by the unchanged total count across all pages. | None. |

Run: `npx playwright test --project=chromium --grep @AP-2471` — 16 passed, 0 failed, 0 fixme, no flaky tests (second full run; the first runs were 9/9 for 001–009 after one fix to 001, and 7/7 for 010–017)
Traceability:
| TC ID | Step | Expected result | Assertion |
|---|---|---|---|
| AP2471_001 | 2 | Risk Management heading carries the tachometer icon; Earning Curves item without icon | EarningCurveFlow.verifyRiskManagementMenu() — heading count 1 + text, items toHaveText([4]), item icon count 0 |
| AP2471_001 | 4 | URL /admin/earning-curve, heading "Earning Curves" | openEarningCurvesFromMenu() — toHaveURL, lblHeading toHaveText |
| AP2471_002 | 2–4 | Title, one "Create New", six headers, "from - to", Edit per row | verifyEarningCurvesListPage() — nav toHaveText(['Create New']), headers toHaveText([6]), odometer regex, actions = rows, tooltips = rows |
| AP2471_003 | 3 | Field types and defaults, 4 type options, Is Enabled? ticked checkbox | verifyNewFormDefaults() |
| AP2471_003 | 4 | 3 columns, 12 rows 1–12, 4 decimals, read-only | verifyNewFormDefaults() + verifyMonthlyFactorsReadOnly(true) |
| AP2471_004 | 4 | 0.0833 × 12, cumulative to 1.0000 after the switch | verifyEarningCurveTable('Pro-Rata', 12) — full oracle |
| AP2471_005 | 4 | Rule of 78 oracle, row 6 cumulative 0.7308 | verifyEarningCurveTable('Rule of 78', 12) |
| AP2471_006 | 4 | Reverse oracle, row 8 cumulative 0.4615 | verifyEarningCurveTable('Reverse rule of 78', 12) |
| AP2471_007 | 3, 5 | 24-row Rule of 78 over 300; 24-row Pro-Rata 0.0417 | verifyEarningCurveTable('Rule of 78', 24), ('Pro-Rata', 24) |
| AP2471_008 | 2, 4 | 1 row of 1.0000 per type; 60 rows, row 60 0.0005 / 1.0000 | verifyEarningCurveTable(type, 1) × 3, ('Rule of 78', 60) |
| AP2471_009 | 2–5 | Editable, zeros, cumulative 0.4/0.7/0.9/1.0 then 0.4/0.65/0.85/0.95, no reload | verifyMonthlyFactorsReadOnly(false), verifyMonthlyFactors(...) × 3, verifyNoPageReload() |
| AP2471_010 | 3, 5 | Saved alert and row; reopened values equal typed | saveCustomEarningCurve(), verifyStoredCurveFields(4, 'Custom', '0', '60000'), verifyMonthlyFactors(...) |
| AP2471_011 | 2, 4 | 36 rows of 0.0278; row "name · 36 · 0 - 100000 · Pro-Rata · Yes" with Edit | verifyEarningCurveTable('Pro-Rata', 36), verifyListRow(...) |
| AP2471_012 | 3–4 | Rule of 78 on 36; same id; renamed row; old name gone; count unchanged | verifyEarningCurveTable('Rule of 78', 36), saveEarningCurveChanges(), verifyListRow(), verifyNameNotListed(), verifyEarningCurveCount(count), reopenEarningCurve(edited, editUrl) |
| AP2471_013 | 2–5 | A/B/C refused with field messages, nothing saved; D saved as typed | verifySaveRefusedWithFieldError() × 3, typeInvalidTermMonth() rows 12, verifyEarningCurveCount(count / count+1), verifyListRow(range, 12, '50000 - 10000', …) |
| AP2471_014 | 2–5 | 90% and −0.05 save; empty box refused, no 500; last saved kept | saveCustomEarningCurve(), saveEarningCurveChanges(), verifySaveRefusedForBlankFactor(3, …), verifyMonthlyFactors(negative, …) |
| AP2471_016 | 2–5 | Pro-Rata 0.25 read-only; Custom back to zeros; stored as shown | verifyEarningCurveTable('Pro-Rata', 4), verifyMonthlyFactorsReadOnly(true), verifyMonthlyFactors(zeros) × 2, verifyStoredCurveFields() |
| AP2471_017 | 3–5 | 3 rows of 0.0000, odometer kept; row Term 3; reopened 3 rows | verifyStoredCurveFields(3, …), verifyMonthlyFactors(zeros(3)) × 2, verifyListRow(name, 3, …) |
