# QA Review Record — AP-2506

## R1 — Requirements analysis — round 1 — 2026-11-01T01:51:04Z
Reviewed: requirements/AP-2506-generate-contract-for-a-quotes-esthetic.md, qa-artifacts/1-requirements-analysis/AP-2506_requirements-analysis.md, qa-artifacts/.pipeline/AP-2506.md
Verdict: **APPROVE** · Gate A: post the Blocking question on AP-2506 and continue — rule A2
Findings: 0 blocker · 0 major · 1 minor

The analysis maps all four acceptance criteria and the description to five requirements
and states no behaviour the capture does not contain. All twelve questions carry an
Impact and a Status; none is marked Answered. Q-001 is correctly Blocking: AC 1 names the
Extended Warranty row and an extended-warranty quote while the description and the
expected address are Esthetic protection's, so AC 1's expected result cannot be written
from the capture alone. It is raised against REQ-001 only, so not every requirement is
blocked (A2, not A1).

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP-2506_requirements-analysis.md — REQ-001 risk table | The Q-001 recommendation says to test the description's statement from the Esthetic protection row; the designer must make sure that case cites only the description sentence, not AC 1's *given/when* | None needed in the analysis; the R2 review checks it on the test cases |

Gate A evidence: 5 REQ; 1 Blocking + Open (Q-001, REQ-001); 9 Judgement (Q-002 – Q-010); 2 Info (Q-011, Q-012); ticket has 0 comments, so the question has not been asked before.

## R2 — Test cases — round 1 — 2026-11-01T01:56:13Z
Reviewed: qa-artifacts/3-test-cases/AP2506_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2506_TestCases_006-009.md, qa-artifacts/3-test-cases/AP2506_ReviewFindings_2026-11-01.md, qa-artifacts/1-requirements-analysis/AP-2506_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2506_test-plan.md
Verdict: **REWORK** · Gate B: — (decided after rework) — rule —
Findings: 1 blocker · 0 major · 1 minor

The nine cases cover all five requirements, stay within the size limits, ship the AC 1
case BLOCKED on Q-001, and build every quote from vehicle 915 through **Create quote**.
No literal credential appears. One expected result hangs a PASS/FAIL on a guessed answer
to an open Judgement question and must become record-only before execution.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Blocker | AP2506_TestCases_006-009.md — AP2506_008 step 4 | The refused branch requires "a message beside 'Financing company'"; where (or whether) a refusal message shows is open (Q-003, Q-008), so a correct refusal shown as a page banner would FAIL | Accept any refusal that shows the contract page again with the other values kept, and record the message text and where it shows (Q-008) |
| F-2 | Minor | AP2506_TestCases_001-005.md — AP2506_001 step 5 | "Record any visible difference from the extended-warranty contract page … if known to the executor" does not tell the executor what to compare | Optional: name the points to record (section headings, column order) or drop the clause; AP2506_003 already records Q-002 |

rework_stage: s3 · rework_scope: AP2506_008

## R2 — Test cases — round 2 — 2026-11-01T01:56:38Z
Reviewed: qa-artifacts/3-test-cases/AP2506_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2506_TestCases_006-009.md, qa-artifacts/3-test-cases/AP2506_ReviewFindings_2026-11-01.md
Verdict: **APPROVE** · Gate B: Execute the current cases — rule B3
Findings: 0 blocker · 0 major · 0 minor

F-1 is fixed: AP2506_008 step 4 now fails only on an error page, HTTP 5xx or a lost value,
and records the outcome, message text and position; a Revisions row names the change.
F-2 is fixed: the vague comparison clause was removed from AP2506_001 step 5. Every other
expected result was re-read: the remaining assertions rest on the description, AC 2 – AC 4,
values the case entered, or vehicle 915's recorded values. AP2506_002 stays BLOCKED on
Q-001.

Gate B evidence: Pass 1 — 0 gaps citing a REQ/AC; Pass 2 — 10 proposals, 0 High (4 Medium, 6 Low). Unpromoted: P1 several options (Medium), P2 double-click (Medium), P3 no-Esthetic-protection address (Medium), P4 other dealer's quote id (Medium), P5 owner edits on contract (Low), P6 province/taxes (Low), P7 start-date boundaries (Low), P8 browser Back (Low), P9 French headings (Low), P10 narrow width (Low).

## R2 — Test cases — round 1 — 2026-11-01T01:58:55Z
Reviewed: requirements/AP-2506-generate-contract-for-a-quotes-esthetic.md, qa-artifacts/.pipeline/AP-2506.md, qa-artifacts/1-requirements-analysis/AP-2506_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2506_test-plan.md, qa-artifacts/3-test-cases/AP2506_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2506_TestCases_006-009.md, qa-artifacts/3-test-cases/AP2506_ReviewFindings_2026-11-01.md, qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/base-test/test-centralized.md
Verdict: **REWORK** · Gate B: — (decided after rework; on the current findings file it would be B3) — rule —
Findings: 0 blocker · 2 major · 3 minor

Independent review (orchestrator batch, design-only ticket, not executed). The nine cases cover all five requirements and every acceptance criterion, stay within the size limits, keep the AC 1 case BLOCKED on Q-001, record every open Judgement point, and take their data and routes from `test-data`, `navigation` and `domain` or build them in pre-conditions. Two expected results can still give a wrong verdict: AP2506_001 checks "no modal" on the page reached by typing the address rather than on the page the action opened, and AP2506_004 fails the case unless the option name (not the product name) is listed, a reading of "Selected protection products" the capture does not state. Both are fixable by the designer without the author.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Major | AP2506_TestCases_001-005.md — AP2506_001 steps 3–5 | The story's core claim — the *action* opens a dedicated page with no modal — is only judged in step 5, after step 4 has re-opened the page by typing the address; step 3's expected result checks only the address change and no error, so a modal opened by the action over the quote page (a router-driven modal can also change the address) would still PASS | Put the full-page check into step 3's expected result (no modal dialog open, quote page not visible behind the contract page, "Program Summary" and "Generate Contract" present), or move the [Verification] step before the direct-address step and verify the direct-address load separately |
| F-2 | Major | AP2506_TestCases_001-005.md — AP2506_004 step 3 | The expected result requires the "Selected protection products" list to name the *option* chosen; `domain` (quote-creation.md) shows Esthetic protection has a product (`permaplate_id` radio) and options (`option_ids[]`), and AC 2 does not say which of them is listed, so a page listing the chosen product name would FAIL on a guessed reading | Accept a list naming the chosen product and/or the chosen option, record which names appear, and fail only if the list is missing, empty, or names a product or option that was not chosen |
| F-3 | Minor | AP2506_TestCases_001-005.md — AP2506_003 step 4 | "Record … any visible difference from the extended-warranty contract page (Q-002)" gives the executor no defined comparison — the same vague clause the earlier round removed from AP2506_001 step 5 | Name the points to record (section headings, column order, button label) or drop the clause |
| F-4 | Minor | AP2506_TestCases_001-005.md — AP2506_005 step 4 | Province is expected as "Québec" verbatim; the page may show the province code ("QC") or the select value, which is the same value, not a fault | Accept the province name or its code and record the form shown |
| F-5 | Minor | AP2506_TestCases_006-009.md — AP2506_006 step 5 | The PDF is required to show the client name, while the test plan §2.2 puts the PDF content out of scope ("recorded, not judged") | Either record the client name on the PDF instead of judging it, or update the plan to say the client name is the one PDF value judged |

Gate B evidence (for the post-rework decision): Pass 1 — 0 gaps citing a REQ/AC; Pass 2 — 10 proposals, 0 High (4 Medium, 6 Low), so B3 applies once the rework is done. Checklist 2.3, 2.4, 2.6, 2.7 pass; 2.5 passes for Q-002 – Q-010 (every point resting on them is record-only, AP2506_008 step 4 included).

rework_stage: s3 · rework_scope: AP2506_001, AP2506_004 (and optionally AP2506_003, AP2506_005, AP2506_006 for the Minor findings)

## R2 — Test cases — round 2 — 2026-11-01T02:01:54Z
Reviewed: requirements/AP-2506-generate-contract-for-a-quotes-esthetic.md, qa-artifacts/.pipeline/AP-2506.md, qa-artifacts/1-requirements-analysis/AP-2506_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2506_test-plan.md, qa-artifacts/3-test-cases/AP2506_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2506_TestCases_006-009.md, qa-artifacts/3-test-cases/AP2506_ReviewFindings_2026-11-01.md, qa-artifacts/7-reviews/AP-2506_review.md
Verdict: **APPROVE** · Gate B: Execute the current cases — rule B3
Findings: 0 blocker · 0 major · 1 minor

Independent round-2 review of the rework for the 01:58:55Z findings (design-only ticket, not executed this batch; no browser used). All five findings are fixed on disk. F-1: AP2506_001 step 3 now judges the page the action itself opened (address change, no modal, quote page not visible behind it, "Program Summary" and "Generate Contract" present) and forbids the address fallback there; step 5 judges the typed-address load separately. F-2: AP2506_004 step 3 accepts the chosen product and/or option, records which appear, and fails only on a missing or empty list or a name that was not chosen. F-3: AP2506_003 step 4 records the section headings in order and the button label for Q-002, not judged. F-4: AP2506_005 steps 3–4 accept `Québec` or `QC` and tolerate postal-code, phone, letter-case and km formats, recording the form shown (also AP2506_007 step 4). F-5: AP2506_006 step 5 records the PDF client name and contract number, in line with test plan §2.2, and still judges only the HTTP 200 `application/pdf` recorded in `domain`. Every other expected result was re-read: each rests on a description sentence, AC 2 – AC 4, a value the case entered, or vehicle 915's recorded values; every point on Q-002 – Q-010 is record-only; AP2506_002 stays BLOCKED on Q-001 (Blocking, Open). The cases can be trusted for execution once the ticket reaches QC.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2506_TestCases_006-009.md — AP2506_006 step 5 and AP2506_009 step 4 | Both require "exactly one row" for client `Esthetic Owner2506-006` on `/permaplate-contracts`, but the last name is fixed rather than unique per run, so a later re-run (s4c, or a second batch) would find two rows and FAIL a contract that was created correctly; the first execution is not affected | Identify the row by its Download address carrying quote C's id (or a run-unique last name, e.g. suffixed with `RUN_DATE`), and in AP2506_009 judge that the count of rows for quote C did not change |

Gate B evidence: Pass 1 — 0 gaps citing a REQ/AC; Pass 2 — 10 proposals, 0 High (4 Medium, 6 Low), so B3 applies. Unpromoted: P1 several options (Medium), P2 double-click (Medium), P3 no-Esthetic-protection address (Medium), P4 other dealer's quote id (Medium), P5 owner edits on contract (Low), P6 province/taxes (Low), P7 start-date boundaries (Low), P8 browser Back (Low), P9 French headings (Low), P10 narrow width (Low). Checklist 2.1 – 2.7 pass: every REQ-001 – REQ-005 and AC 1 – AC 4 has a case and every case cites one; IDs AP2506_001 – _009 with no gap, ≤ 5 cases per file and ≤ 5 steps per case; data and routes come from `test-data`, `navigation` and `domain` or are built in pre-conditions.
