# QA Review Record — AP-2485

## R2 — Test cases — round 1 — 2026-11-01T07:55:00+07:00
Reviewed: qa-artifacts/.pipeline/AP-2485.md, requirements/AP-2485-switching-a-12-month-earning-curve-back.md, qa-artifacts/3-test-cases/AP2485_TestCases_001-003.md, qa-artifacts/qa-docs/earning-curves.md (oracle values)
Verdict: **APPROVE** · Gate B: Execute the current cases — rule B3
Findings: 0 blocker · 0 major · 1 minor

This is a bug re-test, so there is no requirements analysis, test plan or review-findings file (s1, s2 and s3b are skipped by the bug re-test flow). The three cases were checked against the bug's Steps to Reproduce, Expected Result and Actual Result in the capture. AP2485_001 follows the five reproduction steps exactly and checks the stored curve after reopening; AP2485_002 covers the Reverse rule of 78 path and the 24-month path that must stay correct; AP2485_003 covers the edit page. Every expected result names exact factor values, which match the formulas in `earning-curves.md` (recomputed: Reverse 12-month m/78, Rule of 78 24-month row 1 = 24/300 = 0.0800, Pro-Rata 24-month 1/24 = 0.0417). Saved curves are created in `[Pre-Condition]` or action steps with their values written in, and curve #13 is excluded. The cases can be trusted for execution.

Checklist: 2.1 pass (every case cites a quoted part of the bug; every reported path is covered) · 2.2 pass (all expected results are concrete values, alerts or labels) · 2.3 pass (1 file, 3 cases, ≤ 5 steps each, IDs 001–003 with no gaps) · 2.4 / 2.5 not applicable (no Open questions — no analysis in the bug flow, and no expected result depends on an unstated behaviour) · 2.6 not applicable (s3b skipped, no Pass 2 proposals) · 2.7 pass (login and routes from `env` / `navigation` → `earning-curves.md`; curves created in the steps).

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2485_TestCases_001-003.md — Summary Table and each case's **Type** | Types "Re-test" and "Regression" are not in the template's Functional / Negative / Edge-case set. | None needed for execution; keep them, since the Coverage Matrix columns match. |

## R2 — Test cases — round 1 — 2026-11-01T08:10:00+07:00
Reviewed: qa-artifacts/.pipeline/AP-2485.md, requirements/AP-2485-switching-a-12-month-earning-curve-back.md, qa-artifacts/3-test-cases/AP2485_TestCases_001-003.md, qa-artifacts/qa-config/knowledge.md, qa-artifacts/qa-docs/earning-curves.md (`domain`), qa-artifacts/base-test/navigation-map.md (`navigation`), qa-artifacts/base-test/execute.env.md (`env`), .claude/skills/stlc-ticket-pipeline/routing.md §3 Gate B and §4
Verdict: **APPROVE** · Gate B: Execute the current cases — rule B3
Findings: 0 blocker · 0 major · 3 minor

Independent second review (separate subagent, fresh read of every file; the earlier inline record above was not used as evidence). This is a bug re-test, so s1, s2 and s3b are skipped by routing §4 and the bug's Steps to Reproduce, Expected Result and Actual Result are the requirement. The three cases cover the reproduction on the create page with save and reopen (AP2485_001), the Reverse rule of 78 path and the 24-month path (AP2485_002), and the existing curve's edit page (AP2485_003). Every oracle value was recomputed by hand from the formulas in `earning-curves.md` — Rule of 78 12-month rows (13−m)/78 = 0.1538 … 0.0128 and cumulative row 6 = 57/78 = 0.7308; Reverse cumulative row 8 = 36/78 = 0.4615; Pro-Rata 12-month cumulative m/12 = 0.0833 … 1.0000; Pro-Rata 24-month 1/24 = 0.0417; Rule of 78 24-month row 1 = 24/300 = 0.0800 — and all match. The cases can be trusted for execution; the findings below are wording and scope notes only.

Checklist: 2.1 pass (each case quotes the part of the bug it covers; the reproduction, the Reverse variant and the edit page are all covered) · 2.2 pass (every expected result is a factor value, row count, type label, alert text or list row; "newest first" and "same id, no duplicate" are stated in `earning-curves.md` → Side effects) · 2.3 pass with F-1 (1 file, 3 cases, 5 steps each, IDs AP2485_001–003, no gaps) · 2.4 not applicable (no Open questions) · 2.5 not applicable (no expected result rests on an unstated behaviour; the Pro-Rata values come from the bug's Expected Result, which quotes AP-2471's AC and Ken Nguyen's confirmation) · 2.6 not applicable (s3b skipped, no Pass 2 proposals) · 2.7 pass (admin login from `env` → execute.env.md line 29; routes, selectors and the re-post behaviour from `navigation` → `earning-curves.md`; both saved curves are created inside the cases with timestamped names; curve #13 and seeded curves 1–8 are excluded).

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2485_TestCases_001-003.md — Summary Table and AP2485_001 **Type** | The type "Re-test" is not in the designer's vocabulary (Functional / Negative / Edge-case, with Regression as a marker per stlc-testcase-designer SKILL.md line 163). It changes no result. | None needed before execution; the designer may relabel AP2485_001 as "Functional" with a re-test note on a later edit. |
| F-2 | Minor | AP2485_TestCases_001-003.md — Coverage Matrix row "24/60 months regenerate correctly" and AP2485_002 | The matrix row names 24 and 60 months, but only 24 months is exercised; the 60-month path the bug says works is not checked. The Rule of 78 / Pro-Rata formula is the same at both terms, so 24 months is a fair representative. | None needed before execution; reword the matrix row to "24 months (representative of the non-default terms)" on a later edit, or add a 60-month check if a regression case is ever added. |
| F-3 | Minor | AP2485_TestCases_001-003.md — AP2485_002 step 4 | One step holds three actions (set Term 24 + Tab, select Rule of 78, select Pro-Rata). Each sub-action has its own expected value, so a failure is still traceable, but the executor must name which sub-action failed. | None needed before execution; the executor should record the three observed values separately in the Actual Result. |

## R3 — Execution results — round 1 — 2026-11-01T03:45:00Z
Reviewed: qa-artifacts/.pipeline/AP-2485.md, requirements/AP-2485-switching-a-12-month-earning-curve-back.md, qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2485_2026-11-01.md, qa-artifacts/3-test-cases/AP2485_TestCases_001-003.md, qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2485/ (3 images), .claude/skills/stlc-ticket-pipeline/routing.md §3 Gate C
Verdict: **APPROVE** · Gate C: not applicable — the log has no FAIL, so there is no bug search and no C1–C4 decision (routing §3 Gate C, "Skip it when the execution log has no FAIL")
Findings: 0 blocker · 0 major · 2 minor

Independent review of the Dev (v2dev) run of 2026-11-01T03:31:27Z–03:34:29Z, which by the user's decision for this batch replaces staging; the test-case file still naming v2staging is expected and is not a finding. All three cases appear in the log as PASS with five step rows each, every Actual Result states the observed values (all 12 or 24 Monthly and Cumulative factors, headings, URLs, curve ids 14 and 15, alert text), and every value matches the Oracle in the test-case file. The three final-state screenshots exist and show exactly what the log claims, so the results can be trusted and the run can go on to s5–s7.

Checklist: 3.1 pass (AP2485_001–003 all in the log, none Not Run) · 3.2 pass (recounted: 3 PASS, 0 FAIL, 0 BLOCKED, 0 SKIPPED, 3/3 = 100%, equals the summary; 15 of 15 step rows ✅) · 3.3 pass (every PASS step lists observed values; AP2485_002 step 4 records its three sub-actions separately as R2 F-3 asked) · 3.4 pass (all 3 paths exist on disk) · 3.5 pass (all 3 images read, the last [Verification] step of each High-priority PASS) · 3.6 / 3.7 / 3.8 not applicable (no FAIL, no BLOCKED; the two earlier E4 stops executed no case and are recorded as superseded) · 3.9 not applicable (no Gate C decision). Not re-checked in the browser: the screenshots of the saved curves #14 and #15 already prove the stored state.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | execution-log_AP-2485_2026-11-01.md — AP2485_001 step 3, AP2485_002 step 3, AP2485_003 step 3 | The step where the bug used to show on screen (the table after switching back to Pro-Rata) has no screenshot of its own; only the final state of each case is captured. The stored-state images of #14 and #15 and the 24-month image still prove the fix, so no result changes. | None needed now; on a later re-run, capture the on-screen table right after the switch back to Pro-Rata as well. |
| F-2 | Minor | AP2485_TestCases_001-003.md — Execution Context, row **Login** | The row writes the admin password in clear text instead of only pointing to the `env` source. Outside the R3 checklist and it changes no result, but it puts a credential in a test-case artifact. | The test-case designer should replace the value with a reference to the `env` source on the next edit of this file (owner: s3). |

Screenshots inspected:
- qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2485/AP2485_001-step5-ReopenedProRataFactors_pass.png — matches ("Earning curve #14", Name QA-AP2485-Repro-033220, Term 12, 0 / 10000, type Pro-Rata, Monthly 0.0833 on all 12 rows, Cumulative 0.0833 … 0.5000 (row 6) … 1.0000)
- qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2485/AP2485_002-step5-ProRata24MonthFactors_pass.png — matches ("Create earning curve", Name empty so nothing saved, Term 24, type Pro-Rata, 24 rows of 0.0417, Cumulative row 12 0.5000, row 24 1.0000)
- qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2485/AP2485_003-step5-EditedCurveProRataFactors_pass.png — matches ("Earning curve #15", Name QA-AP2485-Edit-033346, Term 12, 0 / 10000, type Pro-Rata, Monthly 0.0833 on all 12 rows, Cumulative row 6 0.5000, row 12 1.0000)

## R4 — Outcome plan — round 1 — 2026-11-01T03:39:45Z
Reviewed: qa-artifacts/.pipeline/AP-2485.md, requirements/AP-2485-switching-a-12-month-earning-curve-back.md, qa-artifacts/5-testing-report/AP-2485_test-report.md, qa-artifacts/5-testing-report/AP-2485_bug-report.md, qa-artifacts/3-test-cases/AP2485_TestCases_001-003.md, qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2485_2026-11-01.md, qa-artifacts/4-execution-results/comment_AP-2485_2026-11-01.md, qa-artifacts/qa-config/tools.md §2 QA outcome rules, tracker read of AP-2485 (status QC, type Bug)
Verdict: **APPROVE** · Gate D: post the bug re-test comment, then move AP-2485 to `Done` (bug_pass_status); no re-assignment — rule D (routing §3.2, "All PASS")
Findings: 0 blocker · 0 major · 1 minor

This is the bug re-test flow, so Gate D follows routing §3.2 for the ticket itself: every re-test case passed, which calls for the re-test comment and a move to `bug_pass_status` (`Done`), with no developer re-assignment. The pass rate recomputed from the test-case Summary Table is 3 PASS ÷ (3 − 0 SKIPPED) = 100%, equal to the test report; the bug report has no FAIL to account for, and no stopping bug exists. The planned comment lists all three test cases with status PASS and states the Dev environment, so the plan can be applied as written.

Checklist: 4.1 pass (3 ÷ 3 = 100%, equals the report) · 4.2 not applicable (no FAIL) · 4.3 pass (no bug linked to this run, so no stopping bug) · 4.4 pass (bug re-test: all PASS → `Done`; no requirements analysis in this flow, so no Blocking question can be open) · 4.5 pass (comment table has AP2485_001–003, each PASS) · 4.6 not applicable (no re-assignment on PASS).

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP-2485_test-report.md — Risks and Observations | The fix is proven on Dev (v2dev) only, while the bug was found on staging; the move to Done rests on the Dev build. This was the user's decision for the batch and changes no result. | None; the report and the ticket comment both state "Dev (v2dev)", so the reader knows which environment the evidence comes from. |

## R5 — Automation specs — round 1 — 2026-11-01T03:45:19Z
Reviewed: qa-artifacts/6-automation/AP-2485_automation-report.md (draft), playwright-automation/src/tests/admin/earningCurveType_AP2485.spec.ts, playwright-automation/src/flows/EarningCurveFlow.ts, playwright-automation/src/pages/adminPortal/AdminEarningCurvePage.ts, qa-artifacts/3-test-cases/AP2485_TestCases_001-003.md, qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2485_2026-11-01.md
Verdict: **APPROVE** · Gate —: — rule —
Findings: 0 blocker · 0 major · 2 minor

Inline review (this run is itself a subagent). The spec automates all three manually passed cases, each test calls flow methods only, and every [Verification] step has an assertion that reads all Monthly and Cumulative factor values and compares them to the formula oracle. The reviewer ran lint and the tagged suite twice against Dev (v2dev, the base URL the framework's gitignored `.env` sets) and every test passed both times, so the automation can be trusted.

Checklist: 5.1 pass (`npm run lint` clean; `--repeat-each=2` 6 passed, no flaky) · 5.2 pass (titles start AP2485_001–003, all PASS manually; describe carries `@AP-2485`) · 5.3 pass (see traceability) · 5.4 pass (no `waitForTimeout`, no `test.only`; login via `AdminFlow.loginToAdminPortal()` → `getCredentials`; routes relative to `baseURL`) · 5.5 pass (page object has no `expect` / `test.step`; flow holds both; spec calls flows) · 5.6 pass (no existing file changed — three new files only) · 5.7 pass (names `QA-AP2485-*-${Date.now()}`) · 5.8 not applicable (no fixme) · 5.9 pass (every new locator recorded with count 1 on Dev).

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | earningCurveType_AP2485.spec.ts | The flow is built in the spec (`new EarningCurveFlow(page)`) instead of coming from a fixture, because `test-fixtures.ts` and `AdminFlow.ts` hold the QA's uncommitted work and were left untouched. | When the QA commits the framework, register an `earningCurves` fixture and switch the spec to it. |
| F-2 | Minor | AP2485_001 and AP2485_003 | Each run leaves two earning curves on the environment, since curves cannot be deleted. | None possible from the UI; keep runs of `@AP-2485` deliberate. |

Run: `npx playwright test --project=chromium --grep @AP-2485 --repeat-each=2` — 6 passed, 0 failed, 0 fixme, no flaky tests
Traceability:
| TC ID | Step | Expected result | Assertion |
|---|---|---|---|
| AP2485_001 | 5 | Reopened curve: type Pro-Rata, Monthly 0.0833 ×12, Cumulative 0.0833 … 1.0000 | EarningCurveFlow.openEarningCurveForEdit() — heading/name; verifyEarningCurveTable('Pro-Rata', 12) — expect(type).toBe, expect(monthly).toEqual, expect(cumulative).toEqual |
| AP2485_002 | 5 | 24 rows, Monthly 0.0417 ×24, Cumulative row 12 0.5000, row 24 1.0000, nothing saved | verifyEarningCurveTable('Pro-Rata', 24) — expect(monthly).toEqual (24 values), expect(cumulative).toEqual; no save call |
| AP2485_003 | 5 | Reopened curve (same id): type Pro-Rata, Monthly 0.0833 ×12, Cumulative row 6 0.5000, row 12 1.0000 | openEarningCurveForEdit(name, editUrl) — expect(href).toBe(editUrl); verifyEarningCurveTable('Pro-Rata', 12) |
