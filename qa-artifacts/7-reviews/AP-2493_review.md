# QA Reviews — AP-2493

## R1 — Requirements analysis — round 1 — 2026-11-01T00:30:00Z
Reviewed: requirements/AP-2493-cancelling-a-product-from-a-quote.md, qa-artifacts/1-requirements-analysis/AP-2493_requirements-analysis.md, qa-artifacts/.pipeline/AP-2493.md
Verdict: **APPROVE** · Gate A: Continue — rule A3
Findings: 0 blocker · 0 major · 1 minor

The analysis maps each of the three acceptance criteria to one requirement and quotes
every criterion and description sentence it relies on, so nothing is invented. Every open
question carries an Impact and a Status; the only Blocking question (Q-001, description
vs. old AC 3) is Answered with the reporter's quoted comment of 2026-10-17, and the
developer's stated assumptions (label "Delete", financing not recalculated) are correctly
left Open rather than treated as answers. No Blocking question is Open, so Gate A rule A3
applies and nothing is posted to the ticket. Run inline under the fresh-eyes rule (this
pipeline runs inside a worker subagent).

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP-2493_requirements-analysis.md — REQ-001 risk table, Roadside row | The "Save and Generate Contract" risk rests on domain knowledge mapped on 2026-08-29 and is not dated in the risk text. | No change needed for this run; the executor should date the observation when it records the Roadside stage. |

Checks: 1.1 AC 1→REQ-001, AC 2→REQ-002, AC 3→REQ-003 ✓ · 1.2 no invented scope (user
stories labelled inferred) ✓ · 1.3 all 10 questions have Impact and Status ✓ · 1.4 every
REQ has an AC ✓ · 1.5 Q-001 quotes Nicolas-Eric Tain, 2026-10-17 ✓.

## R2 — Test cases — round 1 — 2026-11-01T01:10:00Z
Reviewed: qa-artifacts/3-test-cases/AP2493_TestCases_001-005.md, AP2493_TestCases_006-010.md, AP2493_TestCases_011-014.md, AP2493_ReviewFindings_2026-11-01.md, qa-artifacts/1-requirements-analysis/AP-2493_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2493_test-plan.md
Verdict: **APPROVE** · Gate B: Execute the current cases — rule B3
Findings: 0 blocker · 0 major · 3 minor

Fourteen cases in three files cover every acceptance criterion: the cancel action for all
five product types, the finalized-product guard, decline, dismiss and confirm in the
modal, the freed slot with a re-add, and the Subtotal drop. Expected results are concrete
(a row present or absent, a Subtotal equal to before minus the recorded amount, a
Download link visible), and every point the ticket leaves open is record-only with its
question named. No literal credential appears; login points at the `env` source. The
review findings list no uncovered acceptance criterion and no High proposal, so Gate B
rule B3 applies: execute the current cases. Unpromoted proposals: #1–#8 (5 Medium, 3 Low).
Run inline under the fresh-eyes rule.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2493_TestCases_001-005.md — AP2493_005 Test Data; AP2493_TestCases_011-014.md — AP2493_014 Test Data | The GAP form values come from the quick-quote GAP tab (`domain`, chubb-insurance.md §6), not from a mapped quote-level GAP form; the case says so and falls back to recording the real fields. | None now. After execution, map the quote GAP route into `domain` (mandatory write-back). |
| F-2 | Minor | AP2493_TestCases_006-010.md — AP2493_008 step 3 | Two dismiss methods (Escape and click outside) share one step, so a failure needs the log to say which one. | Executor records each method's outcome separately in the Actual Result. |
| F-3 | Minor | AP2493_TestCases_001-005.md — AP2493_001–005 step 3 | Opening every row control is a record-only step whose Expected Result is "recorded"; it carries no pass/fail. | None — acceptable as an observation step before the verification. |

Checks: 2.1 every REQ/AC has ≥ 1 case and every case cites one ✓ · 2.2 expected results
concrete ✓ · 2.3 ≤ 5 cases per file, ≤ 5 steps per case (max 5 in _007, _008), IDs
AP2493_001–014 with no gap ✓ · 2.4 no Blocking + Open question, so no case needs BLOCKED ✓
· 2.5 Q-002–Q-008 record-only ✓ · 2.6 no High proposal ✓ · 2.7 entry route and data from
`navigation` / `domain` / `test-data` / `contract-setup`, or created in `[Pre-Condition]`
steps ✓.

## R2 — Test cases — round 1 — 2026-11-01T01:22:29Z
Reviewed: requirements/AP-2493-cancelling-a-product-from-a-quote.md, qa-artifacts/.pipeline/AP-2493.md, qa-artifacts/1-requirements-analysis/AP-2493_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2493_test-plan.md, qa-artifacts/3-test-cases/AP2493_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2493_TestCases_006-010.md, qa-artifacts/3-test-cases/AP2493_TestCases_011-014.md, qa-artifacts/3-test-cases/AP2493_ReviewFindings_2026-11-01.md, qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/qa-docs/chubb-insurance.md, qa-artifacts/base-test/test-centralized.md, qa-artifacts/base-test/06-chubb-contract-setup.md
Verdict: **REWORK** · Gate B: Execute the current cases — rule B3 (applies once the rework is done)
Findings: 1 blocker · 0 major · 3 minor

Independent review, run in a separate subagent that wrote none of these files. The
fourteen cases cover every acceptance criterion and the Subtotal sentence, the IDs and
sizes follow the rules, and the routes and data trace back to `navigation`, `domain` and
`test-data` or are created in `[Pre-Condition]` steps. The review findings have no Pass 1
gap that cites an uncovered requirement and no High proposal, so Gate B resolves to B3.
One case, AP2493_014, cannot be trusted as written: its Subtotal check gives a FAIL
whenever the creditor premium changes, which is the open Judgement question Q-007, so the
result depends on a guessed answer. That check must be rewritten before execution.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Blocker | AP2493_TestCases_011-014.md — AP2493_014 step 4, check (c) | The check requires "Subtotal after = Subtotal before − the GAP amount", but Q-007 (Judgement, Open) asks whether cancelling GAP changes the creditor insurance premium on the same quote. If the build recalculates the creditor premium and that premium counts in the Subtotal, the Subtotal drops by more than the GAP amount and the case FAILs on a point the ticket leaves open (check 2.5). | Rewrite check (c) so it does not depend on Q-007: record the creditor premium before (step 2) and after (step 4), and require "Subtotal after = Subtotal before − GAP amount − (creditor premium before − creditor premium after)" when the creditor premium counts in the Subtotal, i.e. the Subtotal equals the sum of the products still active. Keep the premium change itself record-only for Q-007. |
| F-2 | Minor | AP2493_TestCases_006-010.md — AP2493_010 step 4 | The Action says "verify … the Subtotal now includes the new warranty amount", but the Expected Result only says "Record the new Subtotal" and lists no Subtotal failure, so the step verifies something it never judges. AP2493_012 step 4 does judge the same point. | Either add "a Subtotal that did not rise by the new warranty amount is a FAIL" to the Expected Result, as in AP2493_012, or change the Action to "record the Subtotal". |
| F-3 | Minor | AP2493_TestCases_006-010.md — AP2493_006 Test Data and step 1 | The finalized product is first taken from quote 6276 / contract AVP000160, which comes from the `contract-setup` source; the knowledge registry says that source is a designer reference only and each case should create its contract in a `[Pre-Condition]` step. The case keeps a fallback that creates one (step 2), and the check is read-only, so no result changes. | Optional: make step 2 the main path, or keep quote 6276 and also record that it is in the Active tab (AC 1 speaks of non-archived quotes). |
| F-4 | Minor | AP2493_TestCases_001-005.md — AP2493_004 and _005 step 2; AP2493_TestCases_011-014.md — AP2493_014 step 1 | `domain` (quote-creation.md) marks **Add a financing** as "disabled until prerequisites are met" without naming them, and these cases click it on a quote that has only a client and a vehicle. The same sequence worked in earlier tickets (AP-2496), so this is a setup risk, not a coverage gap. | None before execution. If the button is disabled, the executor records the prerequisite it shows and marks the case BLOCKED with that reason, then writes it back to `domain`. |

Checks: 2.1 AC 1 → _001–005 (+ _013 edge), "not finalized" → _006, AC 2 → _007 (decline), _008 (dismiss), _009/_011/_014 (confirm), AC 3 → _010, _012, Subtotal → _009, _011, _014; every case cites a REQ ✓ · 2.2 expected results concrete (row present/absent, Subtotal before − amount, Download link visible) — F-2 minor ✓ · 2.3 3 files of 5/5/4 cases, max 5 steps (_007, _008), IDs AP2493_001–014 with no gap or duplicate ✓ · 2.4 no Blocking + Open question; Q-001 Answered ✓ · 2.5 Q-002, Q-003, Q-004, Q-005, Q-006, Q-008 record-only ✓; Q-007 leaks into AP2493_014 (c) ✗ F-1 · 2.6 0 High proposals ✓ · 2.7 routes in quote-creation.md, vehicle 915 and Yopmail inboxes in test-centralized.md, quotes created in `[Pre-Condition]` steps; GAP route unmapped and recorded at run time ✓ (F-3, F-4 minor).

## R2 — Test cases — round 2 — 2026-11-01T01:55:00Z
Reviewed: qa-artifacts/.pipeline/AP-2493.md, qa-artifacts/1-requirements-analysis/AP-2493_requirements-analysis.md, qa-artifacts/3-test-cases/AP2493_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2493_TestCases_006-010.md, qa-artifacts/3-test-cases/AP2493_TestCases_011-014.md, qa-artifacts/3-test-cases/AP2493_ReviewFindings_2026-11-01.md, qa-artifacts/7-reviews/AP-2493_review.md (round 1), .claude/skills/stlc-ticket-pipeline/routing.md §3
Verdict: **APPROVE** · Gate B: Execute the current cases — rule B3
Findings: 0 blocker · 0 major · 1 minor

Independent review, run in a separate subagent that wrote none of these files. The round-1
Blocker is fixed: AP2493_014 now records the creditor premium before (step 2) and after
(step 4), records in step 2 whether the creditor premium counts in the Subtotal, and judges
the Subtotal as the sum of the products still active, so no PASS or FAIL depends on the
open Judgement question Q-007; the premium change itself is record-only. The round-1
minors are also applied: AP2493_010 step 4 now judges the Subtotal rise, AP2493_006 makes
creating its own contract the primary path, and AP2493_004, _005 and _014 mark the case
BLOCKED with the stated prerequisite if **Add a financing** is disabled. The cases can be
trusted for execution. Unpromoted proposals: #1–#8 (5 Medium, 3 Low); no Pass 1 gap cites
an uncovered requirement and no proposal is High, so Gate B resolves to B3.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2493_TestCases_006-010.md — AP2493_006 Test Data vs step 1 | The Test Data says quote 6276 is used only if it is found in the `/quotes` **Active** tab, but step 1 opens `/quote/6276/details` directly and does not ask the executor to check the Active tab. | Executor records whether quote 6276 is in the Active tab before using it in step 1; if it is not, run step 2. No change to any result. |

Checks: 2.1 AC 1 → _001–005 (+ _013 edge), "not finalized" → _006, AC 2 → _007, _008, _009/_011/_014, AC 3 → _010, _012, Subtotal → _009, _010, _011, _012, _014; every case cites a REQ ✓ · 2.2 expected results concrete; _010 step 4 now judges the Subtotal (round-1 F-2 closed) ✓ · 2.3 3 files of 5/5/4 cases, max 5 steps (_007, _008), IDs AP2493_001–014 with no gap or duplicate ✓ · 2.4 no Blocking + Open question (Q-001 Answered) ✓ · 2.5 Q-002–Q-008 record-only; AP2493_014 (c) no longer hangs on Q-007 (round-1 F-1 closed) ✓ · 2.6 0 High proposals ✓ · 2.7 routes and data from `navigation`, `domain`, `test-data` or created in `[Pre-Condition]` steps; _006 contract created in step 2 as primary path (round-1 F-3 closed); disabled financing handled as BLOCKED (round-1 F-4 closed) ✓.

## R3 — Execution results — round 1 — 2026-11-01T20:01:10Z
Reviewed: qa-artifacts/.pipeline/AP-2493.md, requirements/AP-2493-cancelling-a-product-from-a-quote.md, qa-artifacts/1-requirements-analysis/AP-2493_requirements-analysis.md (Q-001–Q-010, REQ-003 risks), qa-artifacts/3-test-cases/AP2493_TestCases_006-010.md, qa-artifacts/3-test-cases/AP2493_TestCases_011-014.md, qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md, qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/ (16 files), qa-artifacts/base-test/test-centralized.md, qa-artifacts/base-test/navigation-map.md, qa-artifacts/qa-docs/quote-creation.md, Jira AP-2515, AP-2461, AP-2460 (+ 9 duplicate searches)
Verdict: **REWORK** · Gate C: File new — one bug for AP2493_011 + AP2493_012 — rule C4 (decided now; s5 applies it once the AP2493_010 re-run is reviewed)
Findings: 0 blocker · 1 major · 3 minor

The log can be trusted: 14 of 14 cases are recorded, the counts (11 PASS · 2 FAIL · 1 BLOCKED, 79 %) match the rows, every PASS carries an observed value, and the ten screenshots inspected show what their rows claim. The two FAILs are real observations but are **not a fault of the cancel action**: the Esthetic protection (Permaplate) cost is left out of the Subtotal before any cancellation (AP2493_003 step 2: Permaplate 80$ active, Subtotal CA$20,000.00; AP2493_011 step 1: Subtotal CA$21,500.00 = vehicle + warranty), and the Permaplate row shows no amount in its amount column ("-") — so cancelling it removes nothing because nothing was ever added. They are one defect in how the Subtotal is composed, filed once (C4), not a regression of the AP-2493 cancel/delete/slot behaviour, which works for Permaplate (row deleted, "+" back, warranty untouched, a new row created on re-add). AP2493_010 is BLOCKED for a reason that can be worked around on vehicle 915 itself, so it goes back for one re-run.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Major | AP2493_TestCases_006-010.md — AP2493_010 Test Data "New warranty", steps 2 and 4; execution log AP2493_010 step 2 | The case is BLOCKED because vehicle 915 offers one warranty term, but the second term is only a means to tell a new row from the cancelled one coming back. On Dev the warranty modal requires a **Sale price** that sets the row amount (AP2493_009: sale price 1500 → row CA$1,500.00), so re-adding the same 20m/20000km term with a different sale price gives the same distinction. No other Dev dealer vehicle with two terms is recorded in `test-data` (the Tesla VIN 5YJ3E1EA0LF734293 is a customer-portal VIN with no dealer vehicle id), so a vehicle swap is not available from known data. | s3 edits AP2493_010 only: Test Data "New warranty" = the same term with Sale price `1800` (different from the cancelled 1,500); step 4 expects one warranty row with amount CA$1,800.00 (not CA$1,500.00) and Subtotal CA$21,800.00 (20,000.00 + 1,800.00). Then s4 re-runs AP2493_010 only, on quote 6467, which is still in the state AP2493_009 left it (no warranty, Subtotal CA$20,000.00). No new quote is needed. |
| F-2 | Minor | AP2493_TestCases_011-014.md — AP2493_011 step 4(c), AP2493_012 step 4; execution log same rows | Step 4(c) takes the Permaplate "Cost: 80$" (145$) printed under the row as "its amount", while the row's amount column — the column every other product feeds into the Subtotal — reads "-". The analysis' REQ-003 risk rule for Q-003 says to record every amount when a row shows more than one. The FAIL stands only because no capture sentence or non-developer comment states that Permaplate is meant to stay out of the Subtotal (no C1 evidence). | s5 writes ONE bug for both cases, titled on the Subtotal composition, e.g. "The quote Subtotal never includes the Esthetic protection (Permaplate) cost — the row shows no amount, so adding or cancelling it does not change the Subtotal". Steps: AP2493_011 step 1 (Subtotal without the 80$ while the product is active), then the cancel (no change) and the re-add of 145$ (no change). Expected cites the capture sentence "Cancelling a product also removes its amount from the quote Subtotal, so the Subtotal reflects only active products" with Permaplate among the listed products, and asks Q-003 (should the Permaplate cost, or a sale price, be in the Subtotal). State that delete, freed slot and re-add work. Link it "relates to" AP-2493. Recommended severity Medium (a displayed total; no evidence of a wrong billed or stored amount; it fails the last step and blocks no case), so it is not a stopping bug by itself. |
| F-3 | Minor | screenshots/no-sprint/AP-2493/AP2493_010-step2-OnlyOneTermBlocked_fail.png | A BLOCKED case's screenshot carries the `_fail` suffix. | Name the re-run screenshot by its real outcome (`_pass` / `_fail`); no result changes. |
| F-4 | Minor | qa-artifacts/base-test/test-centralized.md line 44 | The new note repeats the single-term fact already on line 23 (AP-2374) and says a case needing two terms "cannot run on it", which F-1 shows is not true for a case that only needs a distinguishable second row. | Add/refresh only: after the F-1 re-run, append "a different Sale price on the same term distinguishes a re-added warranty row" to line 44. No existing fact removed. |

Gate C — duplicate search (JQL `type = Bug [AND statusCategory != Done] AND text ~ …` on "Permaplate", "Subtotal", "Esthetic protection", "Permaplate subtotal", "sub-total", "invoice total", "Summary of products", "quote total", "cancel product"):
- AP-2512 (Backlog) — Permaplate contract PDF download from the quote details page returns HTTP 500 — different action (PDF download), not the Subtotal. No match.
- AP-2515 (Backlog) — Permaplate **contract form** Program Summary shows "Total" instead of "Cost Price" — different screen (contract form, not the quote Subtotal). No match.
- AP-2513, AP-2514 (Backlog) — Permaplate contract form fields. No match.
- AP-2461 (QA) — Permaplate invoice cites contract PNA-0000000000 — invoice description, not the Subtotal. No match.
- AP-2460 (Done) — Permaplate invoice amount vs the creation alert (tax) — invoice amount, closed, different screen. No match.
- AP-2459 (QA) — Permaplate contract generation HTTP 500. No match.
- No open or closed bug names the quote details Subtotal. C1: no sentence in the capture or a non-developer comment says the Permaplate cost stays out of the Subtotal (Minh Lưu's 2026-10-17 comment says only "only the Subtotal changes"). C2/C3: no candidate names the same screen and field. → **C4 File new**, one ticket for AP2493_011 and AP2493_012 (same root cause, seen before any cancel).

Pre-existing or caused by AP-2493: not provable on Dev — the Subtotal is computed when the page renders, so an older quote shows the current build, and no pre-merge build is reachable on v2dev. What is proven is that the omission does not depend on cancelling (AP2493_003 step 2, AP2493_011 step 1, AP2493_012 step 4). The bug states exactly that and claims neither way.

Outcome note for R4: the pass rate is 79 % (11/14); even if AP2493_010 passes it is 86 % (12/14), under the 90 % threshold, so the story does not move to Ready for release while the Permaplate bug is open, whatever its severity.

Write-backs (add/refresh only): quote-creation.md gained a dated, Dev-labelled section "On Dev (v2dev) — quote details 'Summary of products' … mapped 2026-11-02 (AP-2493 s4)"; the AP-2428 Permaplate facts above it are intact. navigation-map.md row "Quote creation" was refreshed with the AP-2493 Dev items and date 2026-11-02; no row removed. test-centralized.md gained one line (inboxes 947–955 and the one-term fact); see F-4. No staging fact was overwritten. ✓

Checks: 3.1 14/14 in the log, none Not Run ✓ · 3.2 11 + 2 + 1 = 14, 11/14 = 78.6 % → 79 % ✓ · 3.3 every PASS step states an observed value ✓ · 3.4 all 16 screenshot paths exist ✓ · 3.5 inspected below ✓ · 3.6 both FAILs name step 4(c) with expected vs actual Subtotal ✓ · 3.7 no environment failure recorded as FAIL; no 5xx on Dev ✓ · 3.8 AP2493_010 BLOCKED names its missing data (see F-1 for the workaround) ✓ · 3.9 no Gate C decision was taken by the worker; decided here ✓.

Screenshots inspected: AP2493_011-step4-PermaplateRemovedSubtotalUnchanged_fail.png — matches (no Esthetic row, warranty CA$1,500.00, Subtotal CA$21,500.00) · AP2493_012-step4-NewPermaplateSubtotalNotRaised_fail.png — matches (Esthetic row "Peinture – Céramique + Graphene, Extra care … Cost: CA$145.00$", amount column "-", Subtotal CA$21,500.00) · AP2493_003-step4-PermaplateMenuDelete_pass.png — matches (Antirouille CA$80.00$, Edit / Generate Contract / Delete; Subtotal hidden by the open menu, value in the log) · AP2493_010-step2-OnlyOneTermBlocked_fail.png — matches (one radio "20m/20000km", required Sale price field) · AP2493_001-step4-WarrantyMenuDelete_pass.png — matches · AP2493_002-step4-RoadsideMenuDelete_pass.png — matches · AP2493_004-step4-CreditorMenuDelete_pass.png — matches (CA$18.58 /m, Subtotal CA$20,018.58) · AP2493_006-step4-FinalizedNoDeleteDownload_pass.png — matches (AVP000169, PDF icon, no ⋯) · AP2493_007-step5-WarrantyKeptAfterNo_pass.png — matches · AP2493_009-step4-WarrantyRemovedSubtotalDrop_pass.png — matches (warranty "- None Selected -", "+", Subtotal CA$20,000.00). Browser not used — judged from disk.

Side note for the QA lead (not a finding on AP-2493): the descriptions of AP-2460 and AP-2461 contain an Admin-portal password in plain text in their Steps to Reproduce. It is not repeated here; consider redacting it from those tickets.

## R3 — Execution results — round 2 — 2026-11-01T20:07:33Z
Reviewed: qa-artifacts/.pipeline/AP-2493.md, qa-artifacts/7-reviews/AP-2493_review.md (R3 round 1), qa-artifacts/3-test-cases/AP2493_TestCases_006-010.md (AP2493_010 and Revisions), qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md (summary, Result Overview, AP2493_010 step results, Blocked section), qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/ (AP2493_010 files), qa-artifacts/base-test/test-centralized.md line 44
Verdict: **APPROVE** · Gate C: File new — one bug for AP2493_011 + AP2493_012 — rule C4
Findings: 0 blocker · 0 major · 0 minor

Independent review, run in a separate subagent that wrote none of these files; scope is the round-1 rework of AP2493_010 only. The case was redesigned exactly as round-1 F-1 asked (same 20m/20000km term, Sale price 1800, step 4 expects one warranty row of CA$1,800.00 and Subtotal CA$21,800.00, with a CA$1,500.00 row or two rows named as a FAIL) and re-run on Dev quote 6467 from the state AP2493_009 left. Every step states an observed value, and the screenshot shows one Extended warranty row of CA$1,800.00 (Program 26, 20m/20000km, Cost CA$1,000.00, Commission CA$800.00) and Subtotal CA$21,800.00, so the freed slot takes a new product whose values differ from the cancelled one. The PASS can be trusted. The re-run does not touch AP2493_011 or AP2493_012, so the round-1 Gate C decision (C4, one bug on the Subtotal composition for Permaplate) stands unchanged; s5 applies it.

Round-1 items closed: F-1 (AP2493_010 redesigned and re-run, PASS) ✓ · F-3 (log now cites `…_blocked.png`; the copied file exists, 49,220 bytes like the original) ✓ · F-4 (test-centralized.md line 44 appended with the Sale-price workaround; earlier facts kept) ✓ · F-2 is for s5.

Checks: 3.1 14/14 in the log, none Not Run ✓ · 3.2 Result Overview recount 12 ✅ (001–010, 013, 014) + 2 ❌ (011, 012) + 0 BLOCKED = 14; 12/14 = 85.7 % → 86 % equals the summary ✓ · 3.3 AP2493_010 steps 1–4 each state an observed value (heading, "+" link, flash "Warranty saved", rows = 1, CA$1,800.00, CA$21,800.00) ✓ · 3.4 both AP2493_010 screenshot paths cited in the log exist ✓ · 3.5 inspected below ✓ · 3.6 FAIL rows unchanged since round 1 ✓ · 3.7 no environment failure; flash and reload without error ✓ · 3.8 no BLOCKED case remains ✓ · 3.9 Gate C C4 evidence quoted in round 1, unchanged ✓.

Screenshots inspected: AP2493_010-step4-NewWarrantyRow1800Subtotal21800_pass.png — matches (quote #6467, one Extended warranty row CA$1,800.00 with Program 26 / 20m/20000km / Cost CA$1,000.00 / Commission CA$800.00, other products "- None Selected -", Esthetic "-", Subtotal CA$21,800.00). Browser not used — judged from disk.

Outcome note for R4 (unchanged): pass rate 86 % (12/14) is under the 90 % threshold, so the story does not move to Ready for release while the Permaplate Subtotal bug is open.

## R4 — Outcome plan — round 1 — 2026-11-01T20:12:00Z
Reviewed: qa-artifacts/5-testing-report/AP-2493_test-report.md, qa-artifacts/5-testing-report/AP-2493_bug-report.md, qa-artifacts/1-requirements-analysis/AP-2493_requirements-analysis.md (Open Questions), qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md (Result Overview), qa-artifacts/qa-config/tools.md §2 (QA outcome rules), Jira AP-2493 (status QC, assignee Vinh Le - QC), Jira AP-2516 (Backlog)
Verdict: **APPROVE** · Gate D: AP-2493 result comment posted, status left in QC, assignee unchanged — rule D (§3.1, pass-rate check fails)
Findings: 0 blocker · 0 major · 0 minor

Run inline under the fresh-eyes rule (this pipeline runs inside a worker subagent; no independent subagent is available here), so this review is not independent of s5/s6. The plan follows the rules: the pass rate recomputed from the log is 12 ÷ (14 − 0) = 85.7 % → 86 %, under `story_pass_threshold` 90, so AP-2493 is not moved to Ready for release and its assignee stays; `story_fail_status` is "—", so the status stays QC. The comment lists all 14 cases and the open Judgement questions with what Dev does today. No bug-ticket action applies: AP-2516 is in Backlog, not the QA status.

Checks: 4.1 12/14 = 86 % equals the test report and the log ✓ · 4.2 both FAILs (AP2493_011, _012) filed as AP-2516 in the bug report ✓ · 4.3 AP-2516 is not stopping — Medium (not Critical/High), it fails step 4, the last step of each case, and blocks no other case ✓ · 4.4 status move refused on the pass-rate check alone (no stopping bug; no Blocking question Open — Q-001 Answered) ✓ · 4.5 the comment carries one row per TC ID 001–014 with status and bug ✓ · 4.6 no bug re-assignment in this plan (AP-2516 not in QA status) ✓.

Outcome plan (apply_mode automatic): (1) post the story result comment on AP-2493 — "Not moved to Ready for release: pass rate 86% (needs 90%)"; (2) no status change; (3) no assignee change.

## R5 — Automation specs — round 1 — 2026-11-01T20:29:25Z
Reviewed: playwright-automation/src/tests/dealer/cancelQuoteProduct_AP2493.spec.ts, playwright-automation/src/flows/QuoteCancelProductFlow.ts, playwright-automation/src/pages/dealerPortal/QuoteProductSummaryPage.ts, qa-artifacts/3-test-cases/AP2493_TestCases_*.md, qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md
Verdict: **APPROVE** · Gate —: —
Findings: 0 blocker · 0 major · 2 minor

Run inline under the fresh-eyes rule (the automator runs inside a worker subagent; no independent subagent is available), so this review is not independent of the code it checks. The spec automates the 12 PASSED cases, one test each, every title starting with its TC ID, under `describe('Cancel Quote Product @dealer @AP-2493')`. Lint passed and both repetitions passed, so the specs can be trusted on Dev. All new code is in three new files; no existing file was edited.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | cancelQuoteProduct_AP2493.spec.ts — AP2493_001–008, _013 | These tests read quotes 6461–6466 and 6245 that the manual run left on Dev; if someone cancels those products, the precondition guard fails with a message naming the quote rather than a product fault. | None now; the guard message tells the reader what to do. |
| F-2 | Minor | cancelQuoteProduct_AP2493.spec.ts — AP2493_009, _010, _014 | Each run creates three Dev quotes (and clients) that cannot be deleted. | None — the cases need fresh quotes; the header comment and the automation report record what each run leaves. |

Run: `npm run lint` — pass · `npx playwright test --project=chromium --grep @AP-2493 --repeat-each=2` — 24 passed, 0 failed, 0 fixme, no flaky tests (5.7 min).
Traceability:
| TC ID | Step | Expected result | Assertion |
|---|---|---|---|
| AP2493_001 | 4 | Warranty row offers a visible, enabled Delete | QuoteCancelProductFlow.verifyDeleteOffered() — expect(lnkDelete).toBeVisible / toBeEnabled / toHaveText(/Delete/) |
| AP2493_002 | 4 | Roadside row offers Delete | verifyDeleteOffered('roadside') — same |
| AP2493_003 | 4 | Esthetic protection row offers Delete | verifyDeleteOffered('permaplate') — same |
| AP2493_004 | 4 | Creditors insurance row offers Delete | verifyDeleteOffered('creditors') — same |
| AP2493_005 | 4 | GAP row offers Delete | verifyDeleteOffered('gap') — same |
| AP2493_006 | 4 | No cancel/delete; Download link visible | verifyFinalizedHasNoDelete() — expect(btnRowMenu).toHaveCount(0), expect(lnkCancelProductAny).toHaveCount(0), expect(lnkRowPdf).toBeVisible() |
| AP2493_007 | 3 | Modal visible; row and Subtotal unchanged | verifyCancelModalShownAndRowUnchanged() — title/question/buttons toHaveText, rowAmount toContainText, lblSubtotal toHaveText |
| AP2493_007 | 5 | Warranty and Subtotal unchanged after No + reload | verifyProductUnchanged() — rowAmount toContainText, btnRowMenu toHaveCount(1), lblSubtotal toHaveText |
| AP2493_008 | 2–3 | No × icon; Escape and outside click close the modal | dismissCancelModalWithoutAnswering() — btnCancelClose toHaveCount(0), mdlOpen toHaveCount(0) twice, URL unchanged |
| AP2493_008 | 5 | Warranty and Subtotal unchanged | verifyProductUnchanged() |
| AP2493_009 | 2 | Modal closes, no error page; message recorded | confirmCancel() — alert "The product has been cancelled" toHaveCount(1), lblErrorText toHaveCount(0) |
| AP2493_009 | 4 | (a) no warranty row (b) "+" back (c) Subtotal = before − warranty | verifyProductRemovedAndAddBack() + verifySubtotal(before − warranty) — expect.poll toBeCloseTo |
| AP2493_010 | 4 | One warranty row CA$1,800.00; Subtotal + 1,800 | verifySingleRowWithAmount() — row toHaveCount(1), rowAmount toHaveText('CA$1,800.00'); verifySubtotal(empty + 1800) |
| AP2493_013 | 4 | Archived quote renders without an error | verifyQuoteIsArchived() + verifyArchivedQuoteRenders() — listed in /quotes/archived, lblErrorText toHaveCount(0), row toHaveCount(1); Delete offered recorded (Q-004) |
| AP2493_014 | 4 | (a) no GAP row, "+" back (b) creditor still shown (c) Subtotal = before − GAP − (creditor before − after) | verifyProductRemovedAndAddBack('gap'), verifyProductStillThere('creditors'), verifySubtotal(...); creditor change recorded (Q-007) |

Checks: 5.1 lint pass, 24/24 over two repetitions ✓ · 5.2 every title starts with a PASS TC ID; describe carries @AP-2493 ✓ · 5.3 every [Verification] step has an assertion (table above) ✓ · 5.4 no waitForTimeout, no test.only, credentials only through DealerFlow.loginToDealerPortal() / getCredentials, routes relative to baseURL ✓ · 5.5 page object has no expect / test.step; flow holds steps and assertions; spec calls flows only ✓ · 5.6 no existing file changed (git status: three new untracked files) ✓ · 5.7 new client email and last name carry Date.now() ✓ · 5.8 no fixme ✓ · 5.9 new locators recorded with count 1 in the automation report ✓.
