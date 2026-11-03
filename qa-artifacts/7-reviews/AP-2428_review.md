# QA Review Record — AP-2428

## R1 — Requirements analysis — round 1 — 2026-11-01T00:58:00Z
Reviewed: qa-artifacts/1-requirements-analysis/AP-2428_requirements-analysis.md, requirements/AP-2428-dealer-permaplate-contract.md, qa-artifacts/.pipeline/AP-2428.md
Verdict: **APPROVE** · Gate A: post the 3 Blocking questions on AP-2428 and continue — rule A2
Findings: 0 blocker · 0 major · 2 minor

The analysis covers every acceptance criterion in the capture across eight requirements,
and the eighth (stored contract values) is quoted from the reporter's 2026-08-06 comment,
so no scope is invented. All twelve open questions carry an Impact and a Status, none is
marked Answered, and the three Blocking ones (Year prefill, tax rules, the AP-2456 retail
conflict) sit on REQ-002 and REQ-005 only, so the other six requirements stay testable.
It can be trusted as the input to test design.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP-2428_requirements-analysis.md — REQ-003 AC 1 | "The section shows 'Information about the client pre-filled'" reads as if that sentence is displayed on screen, while the capture uses it to say the owner fields are prefilled from the client. | Test design should treat it as "each owner field is prefilled from the client record", not as a label to look for. |
| F-2 | Minor | AP-2428_requirements-analysis.md — Open Questions Q-012 | Q-012 is written as a statement, not a question. | None needed for testing; reword on the next re-run of s1. |

Checks: 1.1 pass (all 6 AC groups and the 2026-08-06 comment map to REQ-001–REQ-008) · 1.2 pass (REQ-008 quotes the comment; no other behaviour added) · 1.3 pass (12/12 questions have Impact + Status) · 1.4 pass (every REQ has at least one AC) · 1.5 pass (no question is Answered).
Gate A evidence: Blocking + Open questions Q-001 (REQ-002), Q-002 (REQ-005), Q-003 (REQ-005); REQ-001, REQ-003, REQ-004, REQ-006, REQ-007 and REQ-008 have none, so not every requirement is blocked → A2. Judgement 7 (Q-004–Q-010), Info 2 (Q-011, Q-012).

## R2 — Test cases — round 1 — 2026-11-01T01:20:00Z
Reviewed: qa-artifacts/3-test-cases/AP2428_TestCases_001-005.md, AP2428_TestCases_006-010.md, AP2428_TestCases_011-014.md, AP2428_ReviewFindings_2026-11-01.md, qa-artifacts/1-requirements-analysis/AP-2428_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2428_test-plan.md, requirements/AP-2428-dealer-permaplate-contract.md
Verdict: **REWORK** · Gate B: promote Pass 1 gap 1 (REQ-007 AC 1) and the one High Pass 2 proposal (double-click Generate Contract), re-run s3 — rule B1
Findings: 1 blocker · 0 major · 2 minor

Fourteen cases cover all eight requirements, the two cases tied to Blocking questions
ship BLOCKED with the question named, and every other Judgement-dependent step is
record-only — except AP2428_010, which fails the PDF on content the ticket never lists.
That one step must be made record-only before the set can be executed; the High
double-submit proposal is promoted by Gate B in the same s3 re-run.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Blocker | AP2428_TestCases_006-010.md — AP2428_010 step 4 | The verification requires the PDF to show the VIN and the owner's name and address, but which fields the PDF carries is Q-010 (Judgement, Open); the capture only says "Example of PDF:" with unread attachments. | Make step 4 record-only: FAIL only on a download error, a blank PDF, or a VIN, owner name or address that differs from the form; record which fields appear and the language for Q-010. |
| F-2 | Minor | AP2428_TestCases_001-005.md — AP2428_001 step 3 | The expected "A success message appears" is not a capture statement; it is a precondition so it decides no result. | Optional: say "the save completes without an error and the Permaplate section shows the selection". |
| F-3 | Minor | AP2428_TestCases_001-005.md — Execution Context, product-link note | The Permaplate product link created in AP2428_001 is restored after the last AP-2428 case rather than in the same case. The deviation is stated and justified (every case needs the link). | None; keep the note so the executor unlinks it at the end. |

Checks: 2.1 pass (REQ-001–REQ-008 each have ≥ 1 case; every case cites one) · 2.2 pass except F-1 · 2.3 pass (5/5/4 cases, ≤ 5 steps, AP2428_001–014 with no gaps) · 2.4 pass (AP2428_004 → Q-001; AP2428_008 → Q-002, Q-003) · 2.5 FAIL (F-1) · 2.6 pending — the High Pass 2 proposal is promoted by Gate B B1 in this re-run · 2.7 pass (vehicle 915 and logins from `test-data`/`env`; clients and quotes created in `[Pre-Condition]` steps with values).
Gate B evidence: Pass 1 gap 1 cites REQ-007 AC 1 → B1. High Pass 2 proposals: 1 (double-click Generate Contract). Not promoted: Pass 2 rows 2–10 (Medium/Low).

=== REVIEW VERDICT ===
ticket: AP-2428
checkpoint: R2
round: 1
verdict: REWORK
gate: Gate B: promote REQ-007 AC 1 gap + 1 High proposal, re-run s3 — rule B1
rework_stage: s3
rework_scope: AP2428_010 (step 4); new case for Pass 2 row 1
findings: 1/0/2
park_reason: —
record: qa-artifacts/7-reviews/AP-2428_review.md
=== END ===

## R2 — Test cases — round 2 — 2026-11-01T01:35:00Z
Reviewed: qa-artifacts/3-test-cases/AP2428_TestCases_001-005.md, AP2428_TestCases_006-010.md, AP2428_TestCases_011-014.md, AP2428_TestCases_015-015.md, AP2428_ReviewFindings_2026-11-01.md, qa-artifacts/1-requirements-analysis/AP-2428_requirements-analysis.md
Verdict: **APPROVE** · Gate B: execute the current 15 cases (promotion done once, s3b not re-run) — rule B1 applied
Findings: 0 blocker · 0 major · 1 minor

AP2428_010 step 4 now fails only on objective faults (download error, blank PDF, a VIN or
owner different from the form) and records the fields and language for Q-010, with a
Revisions row citing B1 and F-1. The promoted double-click case AP2428_015 is in its own
file, cites REQ-006 AC 1, creates its own client and quote with values in the steps, and
ends in a concrete count check. The set is ready for execution.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2428_TestCases_001-005.md — AP2428_001 step 3 | Carried from round 1 F-2: "A success message appears" on a precondition step. | Optional wording change; decides no result. |

Checks: 2.1 pass (REQ-001–REQ-008 covered; AP2428_015 cites REQ-006) · 2.2 pass · 2.3 pass (5/5/4/1 cases, ≤ 5 steps, AP2428_001–015 with no gaps) · 2.4 pass (AP2428_004, AP2428_008 BLOCKED with questions named) · 2.5 pass (AP2428_010 now record-only for Q-010) · 2.6 pass (the only High Pass 2 proposal is AP2428_015; rows 2–10 not promoted, Medium/Low, logged) · 2.7 pass.

=== REVIEW VERDICT ===
ticket: AP-2428
checkpoint: R2
round: 2
verdict: APPROVE
gate: Gate B: execute current cases after B1 promotion — rule B1
rework_stage: —
rework_scope: —
findings: 0/0/1
park_reason: —
record: qa-artifacts/7-reviews/AP-2428_review.md
=== END ===

## R2 — Test cases — round 1 (independent reviewer) — 2026-11-01T01:07:16Z
Reviewed: qa-artifacts/3-test-cases/AP2428_TestCases_001-005.md, AP2428_TestCases_006-010.md, AP2428_TestCases_011-014.md, AP2428_TestCases_015-015.md, AP2428_ReviewFindings_2026-11-01.md, qa-artifacts/1-requirements-analysis/AP-2428_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2428_test-plan.md, requirements/AP-2428-dealer-permaplate-contract.md, qa-artifacts/.pipeline/AP-2428.md, qa-artifacts/qa-config/knowledge.md, qa-artifacts/base-test/test-centralized.md, qa-artifacts/base-test/navigation-map.md, qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/qa-docs/admin-portal.md, qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md (route provenance only)
Verdict: **REWORK** · Gate B: execute the current cases once the rework below is done — rule B2 (the High Pass 2 proposal is already promoted as AP2428_015; promotion is not repeated)
Findings: 1 blocker · 0 major · 6 minor

This is an independent re-review of the current 15 cases; the earlier R2 sections were not relied on. Coverage is complete: all eight requirements are tested, the two cases that depend on Blocking questions (AP2428_004, AP2428_008) are BLOCKED and name them, AP2428_010 is now record-only for Q-010, and the High double-click proposal is in as AP2428_015. One step still decides PASS/FAIL on a guessed answer to a Judgement question: AP2428_002 step 4 fails the build if a contract form opens for a quote with no Permaplate selection, which the ticket never rules on (Q-005). Fix that step and the set can be executed.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Blocker | AP2428_TestCases_001-005.md — AP2428_002 step 4 | The expected result "no contract form offering an empty product selection to submit" makes it a FAIL if the form opens by direct URL for a quote with no Permaplate selection. The capture only says the button appears "when a permaplate quote exists" and says nothing about the form at a direct URL; Q-005 (Judgement, Open) asks exactly this. The case's own "Why this matters" says it fails only on an objective fault such as "a contract created with no product", and step 4 is stricter than that. | Make step 4 record-only for Q-005: FAIL only on an error page or HTTP 5xx in any step; record whether a form opened and what its Selected protection products table holds. Do not submit the form. |
| F-2 | Minor | qa-artifacts/.pipeline/AP-2428.md — Gate log and AP2428_TestCases_015-015.md header | The earlier Gate B decision is logged as rule B1, but Pass 1 gap 1 cites REQ-007 AC 1, which already had a test case (AP2428_010); B1 needs a cited criterion with no test case. The rule that matched is B2 (one High Pass 2 proposal). The AP2428_010 fix was a 2.5 rework, not a promotion. The outcome is the same. | Cite B2 for the promotion of AP2428_015 the next time the run state and the file header are written. |
| F-3 | Minor | AP2428_TestCases_001-005.md, 006-010.md, 011-014.md, 015-015.md — Execution Context, Source column | The routes `/quote/{id}/permaplate-create-contract`, `/admin/dealer/1380/permaplate`, `/admin/dealer/1380/permaplate/link`, `/admin/dealer/{id}/permaplate/{productId}/unlink` and `/admin/permaplate/{termId}/option/{optionId}/edit` (with the "Dealer Cost" field) are credited to `navigation` / `domain` (quote-creation.md), but none of them is in those sources. They were observed in execution-log_PERMAPLATE_2026-09-06.md, so they are real, and the entry route `/vehicle/915/details` and vehicle 915 do come from `navigation` / `test-data`. | Credit those routes to the 2026-09-06 execution log, and fold them into qa-docs/quote-creation.md through the baseline generator so later cases can cite `domain`. |
| F-4 | Minor | AP2428_TestCases_001-005.md — AP2428_001 step 4 | The action looks for the control only on `/quote/{id}/details`, while Q-004 says the button may be on the Permaplate page, and step 5 fails only if the control is missing "anywhere on the quote". | Make step 4 say to look on both `/quote/{id}/details` and `/quote/{id}/permaplate`. |
| F-5 | Minor | AP2428_TestCases_011-014.md — AP2428_014 Test Data and Blocked by | The case needs the contract generated in AP2428_009 but, unlike AP2428_013, does not say it is BLOCKED if AP2428_009 produced no contract. | Add "If AP2428_009 did not generate a contract, this case is BLOCKED by that result". |
| F-6 | Minor | AP2428_TestCases_015-015.md — AP2428_015 step 4 | The step fails on "two new invoices", but the test plan §2.2 puts the invoice raised on contract creation out of scope (AP-2446). A double invoice from one contract would be an AP-2446 defect. | Keep the invoice count, but say in the FAIL wording that two invoices for one contract row is filed against AP-2446, and two contract rows is filed against AP-2428. |
| F-7 | Minor | AP2428_TestCases_001-005.md — AP2428_001 step 3 and AP2428_005 step 4 | "A success message appears" is not stated anywhere for the Permaplate save, and "Province dropdown lists the provinces" names no list. Neither decides the result of the case. | Write "the save completes without an error and the details page shows the selection", and "the dropdown lists the Canadian provinces and territories; record the list". |

Checks: 2.1 pass (REQ-001 → 001, 002, 013; REQ-002 → 003, 004; REQ-003 → 005, 012; REQ-004 → 006; REQ-005 → 007, 008; REQ-006 → 009, 011, 015; REQ-007 → 010; REQ-008 → 014; every case cites a REQ) · 2.2 pass (expected results name values, labels, URLs or counts) · 2.3 pass (5/5/4/1 cases, at most 5 steps each, AP2428_001–015 with no gaps or duplicates) · 2.4 pass (AP2428_004 → Q-001; AP2428_008 → Q-002, Q-003; no other case depends on a Blocking question) · 2.5 FAIL (F-1; AP2428_005 phones, 006 end date and columns, 007 cost comparison, 010 PDF fields, 011, 012, 013 are correctly record-only) · 2.6 pass (the one High Pass 2 proposal is AP2428_015; rows 2–10 are Medium/Low and logged as not promoted) · 2.7 pass with F-3 (vehicle 915, VIN and logins from `test-data` / `env`; every client and quote is created in a `[Pre-Condition]` step with its values written in the case).
Gate B evidence: Pass 1 gap 1 cites REQ-007 AC 1, which has AP2428_010, and gap 2 cites only the test plan, so B1 does not match; Pass 2 row 1 is High, so B2 matches, and it is already promoted as AP2428_015. Promotion happens once per run, so after the F-1 rework the run goes to s4 without re-running s3b.

=== REVIEW VERDICT ===
ticket: AP-2428
checkpoint: R2
round: 1
verdict: REWORK
gate: Gate B: execute current cases after the F-1 fix (AP2428_015 already promoted) — rule B2
rework_stage: s3
rework_scope: AP2428_002 (step 4)
findings: 1/0/6
park_reason: —
record: qa-artifacts/7-reviews/AP-2428_review.md
=== END ===

## R2 — Test cases — round 2 (independent reviewer) — 2026-11-01T01:11:27Z
Reviewed: qa-artifacts/3-test-cases/AP2428_TestCases_001-005.md, AP2428_TestCases_006-010.md, AP2428_TestCases_011-014.md, AP2428_TestCases_015-015.md, AP2428_ReviewFindings_2026-11-01.md, qa-artifacts/1-requirements-analysis/AP-2428_requirements-analysis.md (Open Questions), qa-artifacts/.pipeline/AP-2428.md, qa-artifacts/base-test/navigation-map.md and qa-artifacts/qa-docs/quote-creation.md (route provenance only)
Verdict: **APPROVE** · Gate B: execute the current 15 cases (AP2428_015 already promoted; s3b not re-run) — rule B2
Findings: 0 blocker · 0 major · 1 minor

The round-1 Blocker is fixed: AP2428_002 step 4 now fails only on an error page or HTTP 5xx, records whether the form opened and what its products table holds for Q-005, tells the executor not to submit, and carries a Revisions row naming F-1. All six round-1 minors were applied on disk: the run-state Gate log and the AP2428_015 header cite B2 (F-2); the `permaplate-create-contract`, `/admin/dealer/1380/permaplate…` and option-edit routes are credited to execution-log_PERMAPLATE_2026-09-06.md (F-3); AP2428_001 step 4 looks on both the details and Permaplate pages (F-4); AP2428_014 is BLOCKED if AP2428_009 made no contract (F-5); AP2428_015 step 4 records the invoice count only and routes a double invoice to AP-2446 (F-6); AP2428_001 step 3 and AP2428_005 step 4 use concrete wording (F-7). No new step depends on a guessed answer, so the set can be executed as written.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2428_TestCases_001-005.md — AP2428_002 "Why this matters" | The paragraph still names "a contract created with no product" as a failing fault, but step 4 now forbids clicking Generate Contract, so the case can never observe that fault. It decides no result. | On the next s3 re-run, drop "or a contract created with no product" from the paragraph so it matches step 4. |

Checks: 2.1 pass (REQ-001 → 001, 002, 013; REQ-002 → 003, 004, 011; REQ-003 → 005, 011, 012; REQ-004 → 006; REQ-005 → 007, 008; REQ-006 → 009, 011, 012, 015; REQ-007 → 010; REQ-008 → 014; every case cites a REQ) · 2.2 pass (expected results name values, labels, URLs, HTTP status or row counts) · 2.3 pass (5/5/4/1 cases, at most 5 steps each, AP2428_001–015 with no gaps or duplicates) · 2.4 pass (AP2428_004 → Q-001; AP2428_008 → Q-002, Q-003; no other case depends on a Blocking question) · 2.5 pass (AP2428_002 step 4 now record-only for Q-005; 001 step 4 Q-004, 005 phones Q-007, 006 Q-008/Q-009, 007 cost comparison, 010 Q-010, 011/012 Q-006, 013 Q-005 all record-only) · 2.6 pass (the one High Pass 2 proposal is AP2428_015; rows 2–10 Medium/Low, logged as not promoted) · 2.7 pass (vehicle 915, VIN and logins from `test-data` / `env`; `/permaplate-contracts` and `/invoice` confirmed in navigation-map.md and quote-creation.md; routes not in a source are credited to the 2026-09-06 execution log; every client and quote is created in a `[Pre-Condition]` step with its values).
Gate B evidence: Pass 1 gap 1 cites REQ-007 AC 1, which has AP2428_010, and gap 2 cites only the test plan, so B1 does not match; Pass 2 row 1 is High → B2, already promoted as AP2428_015. Promotion happens once per run, so the run goes to s4 without re-running s3b.

=== REVIEW VERDICT ===
ticket: AP-2428
checkpoint: R2
round: 2
verdict: APPROVE
gate: Gate B: execute current 15 cases (AP2428_015 already promoted) — rule B2
rework_stage: —
rework_scope: —
findings: 0/0/1
park_reason: —
record: qa-artifacts/7-reviews/AP-2428_review.md
=== END ===


---

## R3 — Execution results — round 1 (independent reviewer) — 2026-11-01T18:45:00Z
Reviewed: qa-artifacts/.pipeline/AP-2428.md, requirements/AP-2428-dealer-permaplate-contract.md, requirements/AP-2456-remove-retail-pricing.md, qa-artifacts/1-requirements-analysis/AP-2428_requirements-analysis.md (questions table), qa-artifacts/3-test-cases/AP2428_TestCases_001-005.md, AP2428_TestCases_006-010.md, AP2428_TestCases_011-014.md, AP2428_TestCases_015-015.md, qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md, 8 screenshots in qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/, write-backs qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/base-test/navigation-map.md, qa-artifacts/base-test/test-centralized.md, registry qa-artifacts/qa-config/knowledge.md, Jira AP-2428 (comments), AP-2459, AP-2461 and 18 duplicate-search queries
Verdict: **APPROVE** · Gate C: file new bugs for every FAIL — rule C4 (4 new bugs: PDF download HTTP 500 for AP2428_010 with AP2428_012 linked; two separate bugs for AP2428_005; one for AP2428_007)
Findings: 0 blocker · 0 major · 5 minor

The Dev (v2dev) run of 15 cases can be trusted. Every case is in the log, and the counts recount to 9 PASS, 4 FAIL, 2 BLOCKED (60%). Every screenshot path exists, and every FAIL names its step with an observed value that differs from the expected result in a stated way. The reviewer re-checked two claims live on v2dev, read-only. The client record of quote 6456 holds "Secondary owner or company" = "Garage Test 2428 Inc" and uses a Province dropdown (Choose / Québec selected / Ontario …). The PDF download of the third contract, quote 6457, which the run did not try, also returns HTTP 500. Only small corrections remain, and none of them changes a result.

**AP2428_003 judgement.** The PASS stands. For each vehicle field, the ticket says "Text field with the vehicle's … prefilled". It never says the field can be edited. The case's own Expected Result fails only on "an empty field or a different value", and all five values are prefilled and correct. Failing the case because Make, Model and Delivery date are read-only would add a requirement the ticket does not state. The word "editable" in the Action text of steps 3 and 4 was added by the designer (F-2).

**Gate C decisions.** Open AP bugs were searched for: permaplate contract, permaplate PDF, contract download, permaplate 500, download 500, contract PDF, esthetic protection, Erreur difficultés, other name on file, Other name, company name contract, permaplate company, province dropdown, province text, cost price, Total cost, permaplate. AP-2428 has no linked issues and no comment after the QA questions comment of 2026-11-01.

| FAIL | Rule | Decision | Evidence |
|---|---|---|---|
| AP2428_010 (steps 2 and 4) | C4 | **File one new bug**, severity High: "Permaplate contract PDF download returns HTTP 500 on Dev". Link it *relates to* AP-2459 | AP-2459 is about a different action on a different screen: "Clicking "Generate Contract" on the Permaplate Contract form returns an HTTP 500 … whenever the "Financing company" dropdown is left on its default "Choose" value". On Dev, generating a contract with "Choose" works (AP2428_009, _012, _015); the 500 comes from `/quote/{id}/permaplate-contract-download`. AP-2461 is about the invoice description ("Permaplate invoice cites contract number PNA-0000000000"), and its own step 7 downloads the PDF successfully on staging. Neither bug says the download link shows an error, so C2 and C3 do not hold. The new bug must say the environment is Dev, and that the same link returned HTTP 200 `application/pdf` on staging on 2026-10-04 (qa-docs/quote-creation.md, AP-2463 re-test). It must also list every quote that fails: 6456, 6457 (checked by the reviewer), 6460 and the older 6284 |
| AP2428_012 (steps 4 and 5) | C4 (same bug) | **Do not file a second bug.** List AP2428_012 in the AP2428_010 bug as a second affected case | Same URL pattern and the same HTTP 500 page. The address edit itself worked, and the client record kept "10 rue Ontario Est" |
| AP2428_005 (step 4), fault 1 | C4 | **File new**: "Other name on file (Company's name)" on the Permaplate contract form is empty although the client has a company. Severity Medium | Capture: "Other name on file — Text field with client's company prefilled". Client record, checked live by the reviewer: "Secondary owner or company" = "Garage Test 2428 Inc". No open bug names this field. AP-2488 matched only on words; it is about HST labels on warranty contracts |
| AP2428_005 (step 4), fault 2 | C4 | **File new, separately**: Province on the Permaplate contract form is a free-text box, not a dropdown of provinces. Severity Medium | Capture: "Province — Dropdown of provinces". The client form uses a dropdown; the contract form does not. AP-2490 (Nunavut spelling in the client province list) and AP-2454 (the province does not control the Quebec disclosures) are about different screens and behaviours |
| AP2428_007 (step 3) | C4 | **File new**: the Program Summary has no "Cost Price" line, and the cost amount is labelled "Total 225.00$". Severity Low | The capture lists "Cost Price" under Program Summary. AP-2456, from the same feature set, says "only the dealer's own cost price is shown", so the cost line is still wanted, and its label tells the dealer which price it is. No open bug names Cost Price. The bug must state that the amount equals the quote Cost (225$), so only the label is wrong |

**Why AP2428_005 is two bugs, not one.** The two faults are on two different fields and need two different fixes: one is a missing data mapping, the other a changed field type. Each can be fixed and re-tested on its own. A single ticket would stay open while either half is unfixed, and its re-test result would be unclear. Both bugs cite AP2428_005 step 4. The re-test of AP2428_005 passes only when both are closed.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | execution-log_AP-2428_2026-11-02.md — Result Overview rows AP2428_010 and AP2428_012 | The step counts do not match the step tables. AP2428_010 has steps 2 and 4 failed and step 3 blocked, but its row says 1 failed. AP2428_012 has steps 4 and 5 failed, but its row says 1 failed. | The next time s4 updates this log, set AP2428_010 to 1 passed / 2 failed (step 3 blocked) and AP2428_012 to 3 passed / 2 failed. |
| F-2 | Minor | AP2428_TestCases_001-005.md — AP2428_003 steps 3 and 4 (Action column) | The Action asks to verify that "each is an editable text field". The ticket does not say this, and the Expected Result does not check it. Three fields are read-only, so the step text and the PASS appear to disagree. | s3: remove "editable" from step 4's Action, and keep recording editability in step 3 as record-only. Carry "should Make, Model and Delivery date be editable on the contract form?" as a Judgement item in the s7 story comment. |
| F-3 | Minor | execution-log_AP-2428_2026-11-02.md — AP2428_005 step 2 comment | The claim that the client has the company "Garage Test 2428 Inc" is supported only by text; no screenshot shows the client record. The reviewer confirmed it live on v2dev (/quote/6456/client, field "Secondary owner or company"). | s5: in the "Other name on file" bug, name the client field "Secondary owner or company" on /quote/6456/client as the source of the value, and attach a capture of it if one is taken. |
| F-4 | Minor | screenshots — AP2428_012-step5-PdfDownloadHttp500_fail.png | The image was taken while the page was still changing: the error page is faded behind a grey overlay. Like the AP2428_010 image, it shows no URL, so on its own it does not tie the error to quote 6460. The log's HTTP 500 for 6460 and the reviewer's reproduction on 6457 confirm the fault. | s5: use the AP2428_010 image as the bug's main evidence, and write the URLs and HTTP status in the bug text. |
| F-5 | Minor | execution-log_AP-2428_2026-11-02.md — Environment Observations | The log says every Permaplate PDF on Dev returns HTTP 500. It does not mention that the same link returned HTTP 200 `application/pdf` on staging on 2026-10-04. That is the most useful fact for the developer, because it points at Dev's PDF set-up or at the HTMLtoPDF change. | s5: add the staging fact and its source (qa-docs/quote-creation.md, AP-2463 re-test) to the PDF bug's Environment and Notes sections. |

Other checks:
- 3.1: all 15 cases are logged; none is Not Run.
- 3.2: the recount gives 9 PASS, 4 FAIL, 2 BLOCKED and 60%, matching the summary.
- 3.3: every PASS step records an observed value. In AP2428_014, steps 1 and 3 record the PDF 500 and compare option names from the admin list instead of the PDF. This is accepted, because the case fails only on the cost price, and the cost price held.
- 3.4: all 14 screenshot paths exist.
- 3.6: every FAIL names its step.
- 3.7: each HTTP 500 happens on the step under test (the download), not before it, so FAIL is the correct result.
- 3.8: AP2428_004 names Q-001, and AP2428_008 names Q-002 and Q-003. All three are still open on AP-2428.
- 3.9: the s4c decision that no FAIL meets C1 quotes the capture for each FAIL.

**Write-backs.** All changes add or refresh content; none deletes a staging fact.
- quote-creation.md: a new subsection, "On Dev (v2dev) … mapped 2026-11-02 (AP-2428 s4)", was added. The staging subsection above it is unchanged, including "returns HTTP 200 `application/pdf`".
- navigation-map.md: the Permaplate row in §3 was extended with the Dev facts, and its date moved to 2026-11-02. The AP-2463 scope text is kept, and no row was removed.
- test-centralized.md: one line was added (inboxes client.stage.942–946, quotes 6456–6460). Both vehicle rows are unchanged.
- knowledge.md: last written at 00:16 on 2026-11-02, before the run started at 01:21. The run changed no registry binding.

Screenshots inspected:
- AP2428_005-step4-OwnerCompanyEmptyProvinceText_fail.png — matches: Other name on file is empty, and Province is a plain text box with "Québec" and no dropdown arrow.
- AP2428_007-step3-NoCostPriceLabelOnlyTotal_fail.png — matches: the Program Summary shows only "Total 225.00$".
- AP2428_010-step2-PdfDownloadHttp500_fail.png — matches: the French "Erreur … difficultés techniques" page.
- AP2428_012-step5-PdfDownloadHttp500_fail.png — matches, but faded (F-4).
- AP2428_001-step5-ContractFormSections_pass.png — matches: Vehicle identification, Owner information, Program Summary and the Generate Contract button.
- AP2428_003-step4-VehiclePrefillValues_pass.png — matches: VIN 1FAHP35NX8W239204, 5000, Ford, Focus, 11/01/2026; Make, Model and Delivery date are greyed out.
- AP2428_009-step4-QuoteDetailsWithPdfDownload_pass.png — matches: quote #6456, both success banners, and the PDF icon on the Esthetic protection row.
- AP2428_015-step4-OneContractRowAfterDoubleClick_pass.png — matches: one "Double Clic2428" row at 225.00$.

Live re-check (v2dev, read-only, no data changed, browser closed):
- /quote/6456/client: "Secondary owner or company" = "Garage Test 2428 Inc"; Province is a dropdown with "Québec" selected.
- /quote/6457/permaplate-contract-download: HTTP 500.

```
=== REVIEW VERDICT ===
ticket: AP-2428
checkpoint: R3
round: 1
verdict: APPROVE
gate: Gate C: file new for every FAIL — rule C4 (4 bugs: PDF download 500 [AP2428_010 + AP2428_012 linked, relates to AP-2459]; AP2428_005 company not prefilled; AP2428_005 province free text; AP2428_007 no Cost Price label)
rework_stage: —
rework_scope: —
findings: 0/0/5
park_reason: —
record: qa-artifacts/7-reviews/AP-2428_review.md
=== END ===
```

---

## R4 — Outcome plan — round 1 — 2026-11-02T01:55+07:00
Reviewed: qa-artifacts/5-testing-report/AP-2428_test-report.md, qa-artifacts/5-testing-report/AP-2428_bug-report.md, qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md (Result Overview), qa-artifacts/1-requirements-analysis/AP-2428_requirements-analysis.md (Open Questions), qa-artifacts/qa-config/tools.md §2 (QA outcome rules), the planned s7 story comment (worker scratchpad AP-2428_s7_comment.txt), Jira AP-2428 (status QC, latest comment 19434) and AP-2512 to AP-2515 (status Backlog)
Verdict: **APPROVE** · Gate D: post the story result comment on AP-2428; leave status QC and assignee unchanged; no bug-ticket action — rules §3.1/§3.2, apply_mode automatic
Findings: 0 blocker · 0 major · 0 minor

Run inline by the worker under the fresh-eyes rule (this run is itself a subagent), with every figure recounted from the files on disk. The plan can be applied as written: the story fails all three move checks, so only the comment is posted.

Checks:
- 4.1 pass: PASS ÷ (all − SKIPPED) = 9 ÷ (15 − 0) = 60%; the test report and the comment both say 60%, and the per-case statuses in both match the execution log for all 15 cases.
- 4.2 pass: every FAIL has a filed bug — AP2428_005 → AP-2513 and AP-2514, AP2428_007 → AP-2515, AP2428_010 and AP2428_012 → AP-2512. No FAIL is dismissed.
- 4.3 pass: AP-2512 is stopping on both tests — it is High severity, and it fails AP2428_010 at step 2, not the last step, so step 3 could not run. AP-2513 and AP-2514 (Medium) fail AP2428_005 at its last step (4) and block no other case; AP-2515 (Low) fails AP2428_007 at its last step (3). Those three are not stopping.
- 4.4 pass: no move to Ready for release — pass rate 60% < 90%; stopping bug AP-2512 open; Q-001, Q-002 and Q-003 are Blocking and Open (no comment after 19434 of 2026-11-01). The status stays QC, and the assignee stays Vinh Le - QC because it changes only with a move.
- 4.5 pass: the comment lists all 15 test cases with title, priority, status and bug, the four bugs with severity and status, every Blocking and Judgement question with what the build does today, the new Judgement item on AP2428_003 (are Make, Model and Delivery date meant to be editable — R3 F-2), a reminder to Ken Nguyen that Q-001–Q-003 are unanswered, and "Tested on: Dev (v2dev)".
- 4.6 pass (not applicable): AP-2512 to AP-2515 are in Backlog, not the QA status, so §3.2 takes no action and no re-assignment is planned.

```
=== REVIEW VERDICT ===
ticket: AP-2428
checkpoint: R4
round: 1
verdict: APPROVE
gate: Gate D: story comment on AP-2428; status QC and assignee unchanged (pass rate 60% < 90%, AP-2512 stopping, Q-001–Q-003 open); no bug-ticket action — rules §3.1/§3.2
rework_stage: —
rework_scope: —
findings: 0/0/0
park_reason: —
record: qa-artifacts/7-reviews/AP-2428_review.md
=== END ===
```

---

## R5 — Automation specs — round 1 — 2026-11-02T02:10+07:00
Reviewed: qa-artifacts/6-automation/AP-2428_automation-report.md, playwright-automation/src/tests/dealer/permaplateContract_AP2428.spec.ts, playwright-automation/src/flows/PermaplateContractFlow.ts, playwright-automation/src/pages/dealerPortal/PermaplateContractPage.ts, playwright-automation/src/pages/adminPortal/AdminPermaplateOptionPage.ts, qa-artifacts/3-test-cases/AP2428_TestCases_*.md ([Verification] steps), the execution log's Result Overview, `git status` of playwright-automation/
Verdict: **APPROVE** · Gate —: specs accepted — rule —
Findings: 0 blocker · 0 major · 2 minor

Run inline by the worker under the fresh-eyes rule (this run is itself a subagent), from the files on disk. The seven tests are traceable to passed manual cases, pass twice in a row on Dev, create no quote, contract or invoice, and restore the one configuration value they change. The two minor points below are trade-offs the report already states; neither blocks the specs.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | permaplateContract_AP2428.spec.ts — AP2428_014 step 5 | Step 5 also asks that the contract's option names stay unchanged; only the cost price and the restored Dealer Cost are asserted, because the PDF that would show the option names returns HTTP 500 (AP-2512). The manual run accepted the same gap. | When AP-2512 is fixed, add a PDF option-name comparison to AP2428_014. |
| F-2 | Minor | permaplateContract_AP2428.spec.ts — constants QUOTE_WITH_SELECTION / QUOTE_WITHOUT_SELECTION / QUOTE_WITH_CONTRACT | Check 5.7 asks for unique data per run; the spec instead reads fixed Dev quotes 6456, 6458 and 6459. This is the read-only choice for this ticket (a fresh quote per run would leave undeletable data), and a guard step fails with a clear message if 6459 gets a contract. | None now. If the Dev data is reset, point the constants at new quotes with the same state. |

Run: `npm run lint` — pass · `npx playwright test --project=chromium --grep @AP-2428 --repeat-each=2` — 14 passed, 0 failed, 0 fixme, no flaky tests (2.0 m, one worker, Dev v2dev).

Other checks: 5.2 pass — the seven titles start with AP2428_001, _002, _003, _006, _011, _013, _014, all PASS in the log; the describe carries `@AP-2428`. 5.4 pass — no `waitForTimeout`, no `test.only`; credentials only through DealerFlow/AdminFlow → `getCredentials`; URLs built from `config`. 5.5 pass — both page objects hold locators and actions only; every `test.step` and `expect` is in PermaplateContractFlow; the spec calls flows only. 5.6 pass — `git status` shows only the four new untracked files from this run; no existing file in playwright-automation/ changed. 5.8 pass — no fixme. 5.9 pass — every new locator in the report has a recorded count.

Traceability:
| TC ID | Step | Expected result | Assertion |
|---|---|---|---|
| AP2428_001 | 4 | A page opens without error from the create-contract control | PermaplateContractFlow.openContractFormFromRowMenu() — expect(page).toHaveURL(/permaplate-create-contract$/), heading "Esthetic protection Contract", alertError count 0 |
| AP2428_001 | 5 | Vehicle, Owner information, Program Summary sections and the Generate Contract button are visible | verifyContractFormSections() — three headings toBeVisible, button toHaveText(/Generate Contract/) and toBeVisible |
| AP2428_002 | 4 | No error page or HTTP 5xx; the form does not open | verifyNoContractControl() count 0; verifyContractFormUrlRedirects() — status < 400, URL /details, form count 0, "Please create a quote first" count 1 |
| AP2428_003 | 4 | Make Ford, Model Focus, VIN 1FAHP35NX8W239204, Odometer 5000, Delivery date 2026-11-01 prefilled | verifyVehiclePrefill() — five toHaveValue |
| AP2428_006 | 4 | Term, Start Date = delivery date, End date as read-only text; every option listed | verifyProgramSummary() — three toHaveText, input count 0, options toEqual the three names |
| AP2428_011 | 4 | No server error; no contract made | verifyBlankSubmitRefused() — URL still the form, 2 "This value should not be blank." messages, both fields is-invalid, no row for "Vide Champs2428" on /permaplate-contracts |
| AP2428_013 | 4 | No error page or 5xx; no second contract control | verifyContractExistsControls() — PDF link 1, Generate Contract 0; verifyContractFormUrlRedirects(null) — status < 400, URL /details, form 0, alertError 0 |
| AP2428_014 | 5 | Cost price unchanged after the Dealer Cost change; Dealer Cost restored | verifyCostPriceUnchanged() — toBe(before); restoreDealerCost() — toHaveValue(original). Option names: not asserted (F-1) |

```
=== REVIEW VERDICT ===
ticket: AP-2428
checkpoint: R5
round: 1
verdict: APPROVE
gate: —
rework_stage: —
rework_scope: —
findings: 0/0/2
park_reason: —
record: qa-artifacts/7-reviews/AP-2428_review.md
=== END ===
```
