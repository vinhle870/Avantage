# QA Review Record — AP-2501

## R1 — Requirements analysis — round 1 — 2026-11-01T01:31:00Z
Reviewed: qa-artifacts/.pipeline/AP-2501.md, requirements/AP-2501-permaplate-invoice-include-name-of-the.md, qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md, qa-artifacts/qa-config/tools.md (QA outcome rules, not_developers)
Verdict: **APPROVE** · Gate A: post the Blocking question on AP-2501 and continue — rule A2
Findings: 0 blocker · 0 major · 1 minor

The analysis was re-read from disk against the capture. Every line of the Given/When/Then
field maps to a requirement — the term in the description (REQ-001), the three named surfaces
(REQ-001 details page, REQ-002 PDF, REQ-003 dealer and admin lists) and the position after the
contract number (REQ-004) — and no requirement adds behaviour the ticket does not contain. All
six questions carry an Impact and a Status, none is marked Answered, and the one Blocking
question (Q-001) is correctly raised: the criterion's "name of the invoice" contradicts the
title's and description's "name of the term", so the position cannot be judged without the
reporter. Q-001 blocks REQ-004 only, so rule A2 applies, not A1.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP-2501_requirements-analysis.md — REQ-002, REQ-003 | The surfaces in REQ-002 and REQ-003 come from lines that sit under the ambiguous "Then the name of the invoice…" sentence; the analysis applies them to the term on the strength of the title and description, which is sound but is not said in so many words. | No change needed now; if Q-001 is answered with something other than the term, re-run s1 and revisit REQ-002 and REQ-003 together with REQ-004. |

=== REVIEW VERDICT ===
ticket: AP-2501
checkpoint: R1
round: 1
verdict: APPROVE
gate: Gate A: post Blocking question Q-001 and continue — rule A2
rework_stage: —
rework_scope: —
findings: 0/0/1
park_reason: —
record: qa-artifacts/7-reviews/AP-2501_review.md
=== END ===

## R2 — Test cases — round 1 — 2026-11-01T01:36:00Z
Reviewed: qa-artifacts/.pipeline/AP-2501.md, requirements/AP-2501-permaplate-invoice-include-name-of-the.md, qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2501_test-plan.md, qa-artifacts/3-test-cases/AP2501_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2501_TestCases_006-006.md, qa-artifacts/3-test-cases/AP2501_ReviewFindings_2026-11-01.md
Verdict: **APPROVE** · Gate B: execute the current cases — rule B3
Findings: 0 blocker · 0 major · 2 minor

The six cases were re-read from disk. Every requirement and acceptance criterion has a case
and every case cites one (2.1); every final expected result names concrete values to compare
— the recorded term label, the created contract number, the invoice ID (2.2); file and step
limits and IDs are respected (2.3); AP2501_006 depends on the Blocking question Q-001 and
ships BLOCKED naming it (2.4); the Judgement questions Q-002 and Q-005 are record-only and
fail only on objective faults (2.5); there is no High Pass 2 proposal and no Pass 1 gap
citing a requirement, so rule B3 applies (2.6); vehicle 915 comes from `test-data`, logins
from `env`, and every client, quote and contract is created in a `[Pre-Condition]` step (2.7).
No credential is written into the case files.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2501_TestCases_001-005.md — AP2501_001 step 5 | The "no retail price in the description" check comes from AP-2456 criterion 4, not from AP-2501's capture; it is a legitimate regression check but a FAIL on it would be an AP-2456 defect, not an AP-2501 one. | No change needed; at Gate C, file any FAIL on this check against AP-2456's behaviour, not as a failure of AP-2501's requirement. |
| F-2 | Minor | AP2501_TestCases_001-005.md — AP2501_004, AP2501_005 | Both list-page cases read the invoices created by AP2501_001 and AP2501_002 and, unlike AP2501_003, give no fallback if those cases did not run. | No change needed for this run; the executor runs the file in order. If the designer is re-run, add the "repeat AP2501_001 steps 1–3 first" fallback to both. |

=== REVIEW VERDICT ===
ticket: AP-2501
checkpoint: R2
round: 1
verdict: APPROVE
gate: Gate B: execute the current cases — rule B3
rework_stage: —
rework_scope: —
findings: 0/0/2
park_reason: —
record: qa-artifacts/7-reviews/AP-2501_review.md
=== END ===

## R2 — Test cases — round 1 — 2026-11-01T01:37:09Z (independent reviewer)
Reviewed: qa-artifacts/.pipeline/AP-2501.md, requirements/AP-2501-permaplate-invoice-include-name-of-the.md, qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2501_test-plan.md, qa-artifacts/3-test-cases/AP2501_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2501_TestCases_006-006.md, qa-artifacts/3-test-cases/AP2501_ReviewFindings_2026-11-01.md, qa-artifacts/qa-config/knowledge.md, qa-artifacts/base-test/test-centralized.md (vehicle 915), qa-artifacts/base-test/navigation-map.md, qa-artifacts/base-test/execute.env.md (routes only), qa-artifacts/qa-docs/quote-creation.md (Permaplate routes and contract PDF), qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2446_2026-09-13.md (source of the Create Contract flow and /invoice/{id})
Verdict: **REWORK** · Gate B: execute the current cases once AP2501_003 is fixed — rule B3 (no promotion)
Findings: 0 blocker · 1 major · 3 minor

This review was made independently of the earlier R2 section and re-read every file from
disk. Coverage is complete (REQ-001 → 001/002, REQ-002 → 003, REQ-003 → 004/005, REQ-004 →
006), IDs and limits are respected, AP2501_006 is correctly BLOCKED on the Blocking question
Q-001, the Judgement questions Q-002/Q-003/Q-005 are record-only, no Pass 2 proposal is High
and the only Pass 1 gap cites the test plan, so rule B3 applies. One case cannot be trusted
as written: AP2501_003 gives the executor no way to tell the invoice PDF from the Permaplate
contract PDF that the `domain` source already documents, so REQ-002 could pass on the wrong
document. Fix that case, then execute.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Major | AP2501_TestCases_001-005.md — AP2501_003 steps 2 and 4 | Step 2 expects "a PDF of this invoice opens", with no observable way to tell it is the invoice. The `domain` source (quote-creation.md, Permaplate contract lists) documents a different PDF for the same sale — the contract download `/quote/{quoteId}/permaplate-contract-download`, file `permaplate-{contractId}.pdf` — and the AP-2446 log (2026-09-13, AP2446 invoice check step 3) saw a "download link" on the invoice page that carries the contract number, so it may well be that contract PDF. A contract PDF naming the term would produce a false PASS for REQ-002 ("On the invoice generated PDF"). | Rewrite step 2's expected result to identify the invoice PDF by observable content — it shows the invoice number from AP2501_001 and the same Grand Total / Balance as `/invoice/{invoiceId}`, and is not the `permaplate-{contractId}.pdf` contract download. Add the outcome when the only PDF reachable from the invoice is the contract PDF, or no invoice PDF control exists: record the controls found and mark the case BLOCKED with a question to the reporter on AP-2501 (reviewer rule E4), not PASS. Keep AP2501_006 step 2, which reuses "the control recorded in AP2501_003", pointing at that same invoice PDF. |
| F-2 | Minor | AP2501_TestCases_001-005.md — Execution Context, *Entry route* row | The **Create Contract** control, the alert texts and the `/invoice/{invoiceId}` details route are attributed to `navigation` / `domain`, but neither source contains them; they come from the AP-2446 execution log of 2026-09-13. The facts are correct, only the source column is wrong. | Cite `execution-log_AP-2446_2026-09-13.md` for these facts, and have the executor write the Permaplate Create Contract flow and the invoice details route back to `domain` after s4. |
| F-3 | Minor | AP-2501_test-plan.md — §4 Entry Criteria, second item | "AP-2501's change is deployed … confirmed by the first new invoice showing a term line" is circular: a missing term line — the main defect this ticket can have — could be read as "not deployed" and turned into a BLOCKED instead of a FAIL. The test cases themselves correctly treat no term as a FAIL. | At the next s2 run, confirm deployment from the merged PR and QC status only; a missing term line on a new invoice is a FAIL in AP2501_001. |
| F-4 | Minor | AP2501_TestCases_001-005.md — AP2501_004, AP2501_005 Test Data | Both list cases read the invoices from AP2501_001 and AP2501_002 and, unlike AP2501_003, give no fallback if those cases did not run. | While reworking AP2501_003, add "if AP2501_001 / AP2501_002 did not run, repeat their steps 1–3 first" to both. |

=== REVIEW VERDICT ===
ticket: AP-2501
checkpoint: R2
round: 1
verdict: REWORK
gate: Gate B: execute the current cases after rework — rule B3
rework_stage: s3
rework_scope: AP2501_003 (steps 2 and 4); AP2501_006 step 2 by reference; AP2501_004 and AP2501_005 Test Data fallback (Minor F-4)
findings: 0/1/3
park_reason: —
record: qa-artifacts/7-reviews/AP-2501_review.md
=== END ===

## R2 — Test cases — round 2 — 2026-11-01T01:42:18Z (independent reviewer)
Reviewed: qa-artifacts/.pipeline/AP-2501.md, qa-artifacts/7-reviews/AP-2501_review.md (round-1 findings), requirements/AP-2501-permaplate-invoice-include-name-of-the.md, qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2501_test-plan.md, qa-artifacts/3-test-cases/AP2501_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2501_TestCases_006-006.md, qa-artifacts/3-test-cases/AP2501_ReviewFindings_2026-11-01.md, qa-artifacts/qa-docs/quote-creation.md (Permaplate contract lists — Dealer Download), qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2446_2026-09-13.md (AP2446 invoice steps), .claude/skills/stlc-ticket-pipeline/routing.md §3 Gate B
Verdict: **APPROVE** · Gate B: execute the current cases — rule B3
Findings: 0 blocker · 0 major · 3 minor

This review re-read every file from disk and checked each round-1 finding against the
reworked text. F-1 is fixed: AP2501_003 step 1 now records the invoice number, Grand Total
and Balance, step 2 accepts as the invoice PDF only the file that shows that invoice number
and Grand Total and is not `/quote/{quoteId}/permaplate-contract-download` /
`permaplate-{contractId}.pdf` (the route and file name match `quote-creation.md`), and the
case goes BLOCKED, never PASS, when only the contract PDF or no PDF is reachable; step 4
repeats the identity check and states that a term found only in the contract PDF is never a
PASS. AP2501_006 step 2 points at the same invoice PDF and forbids substituting the contract
PDF. F-2 (the Execution Context now credits the AP-2446 log of 2026-09-13 for the Create
Contract flow and `/invoice/{invoiceId}`, and that log does contain them), F-3 (test plan §4
now confirms deployment from QC status and the merged PR only, and calls a missing term line
a FAIL) and F-4 (AP2501_004 and AP2501_005 now carry a Test Data fallback and a step 1 that
uses it) are fixed. The full R2 checklist still holds: every REQ and AC has a case and every
case cites one; every expected result names concrete values; files hold at most 5 cases and
cases at most 5 steps, IDs AP2501_001–006 have no gap; AP2501_006 is BLOCKED naming Q-001;
Q-002, Q-003 and Q-005 are record-only; the review findings have no High Pass 2 proposal and
the only Pass 1 gap cites the test plan, so rule B3 applies; data comes from `env`,
`test-data` and `[Pre-Condition]` steps, with no credential in the files. The cases can be
trusted for execution.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2501_TestCases_001-005.md — AP2501_003 step 2; AP-2501_requirements-analysis.md — Open Questions | AP2501_003 names a question Q-007 ("Where does a dealer get the generated invoice PDF…"), but Q-007 exists only in the test case and the run-state warnings, not in the analysis's Open Questions table, so the question register is incomplete. The conditional BLOCKED handling itself is correct (reviewer rule E4). | If AP2501_003 goes BLOCKED at s4, add Q-007 to the analysis as Blocking against REQ-002 and post it on AP-2501 at that point rather than waiting for the s7 comment; no change needed before execution. |
| F-2 | Minor | AP-2501_test-plan.md — header and §9 Risks, row "How to reach the invoice PDF has not been recorded" | The plan was edited for round-1 F-3 but still says Version 1.0 with no revision note, and its PDF risk row still says only "locate the download control", without the contract-PDF trap that the test cases now guard against. | At the next s2 run, bump the version with a dated revision note and add "identify the invoice PDF by invoice number and Grand Total; the contract download is not the invoice PDF" to the mitigation. |
| F-3 | Minor | AP2501_TestCases_006-006.md — header | AP2501_006 step 2 and its Execution Context *Entry route* row were changed in the rework, but the file has no **Revised** line, unlike file 1 of 2. | Add a Revised line naming the R2 round-1 rework (F-1 by reference, F-2 source credit) the next time the designer touches the file. |

=== REVIEW VERDICT ===
ticket: AP-2501
checkpoint: R2
round: 2
verdict: APPROVE
gate: Gate B: execute the current cases — rule B3
rework_stage: —
rework_scope: —
findings: 0/0/3
park_reason: —
record: qa-artifacts/7-reviews/AP-2501_review.md
=== END ===

## R3 — Execution results — round 1 — 2026-11-02T00:50:39Z (independent reviewer)
Reviewed: qa-artifacts/.pipeline/AP-2501.md, requirements/AP-2501-permaplate-invoice-include-name-of-the.md, qa-artifacts/3-test-cases/AP2501_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2501_TestCases_006-006.md, qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md, the five screenshots in qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/, qa-artifacts/qa-docs/billing-invoices.md, qa-artifacts/qa-docs/quote-creation.md (AP-2501 Dev bullet), qa-artifacts/4-execution-results/1.25.0/execution-log_AP-1381_2026-11-01.md and qa-artifacts/7-reviews/AP-1381_review.md (earlier invoice-PDF observation), Jira search for open bugs (invoice PDF, PDF, invoice, admin invoice pdf), AP-2512 and AP-2519 read in full, Dev re-check of /admin/invoice/{id}/pdf (read-only)
Verdict: **APPROVE** · Gate C: AP2501_003 → File new — rule C4
Findings: 0 blocker · 0 major · 2 minor

The log can be trusted. All six cases are in it, the counts recount to 1 PASS · 1 FAIL ·
4 BLOCKED (16.7 %), the one PASS (AP2501_001) quotes the observed Description lines and its
screenshot shows "PNA-0000000020" followed by "10 ans" on invoice 941, and every screenshot
path exists.

**AP2501_003 stays FAIL.** The case's own step 2 expected result ("HTTP 200,
application/pdf") and its step 4 objective-fault list ("the invoice PDF control returns an
error or a non-PDF"), both approved at R2 round 2, name this outcome as a FAIL. Checklist 3.7
moves only an environment failure *before* the step under test to BLOCKED (a login failure,
a timeout, an outage); this 500 is an application fault on the very surface the criterion
names ("On the invoice generated PDF"), it reproduces, and it was retried. The reviewer
re-checked on Dev at 00:49Z (read-only fetch while signed in to the Admin portal):
`/admin/invoice/{id}/pdf` returned HTTP 500 `text/html` ("Erreur") for 941, 940, 934, 800,
500, 200 and 50, while `/admin/invoice/941` returned 200 and carries the PDF link. So the
fault is route-wide, not Permaplate-specific — but nothing on disk shows the route ever worked
on Dev, and the first sighting (invoice 934, AP-1381 run, 2026-11-01) post-dates AP-2501's
merged PR (2026-10-30), so "pre-existing and unrelated to AP-2501" cannot be stated either
(no-assumption rule). Whatever its cause, the acceptance criterion's PDF surface does not
exist today, and the term on the PDF was never judged. The bug must be written as a route-wide
invoice-PDF fault, not as "the term is missing from the PDF".

**Gate C — AP2501_003: File new (rule C4).** No open bug names the Admin invoice "PDF"
control or `/admin/invoice/{id}/pdf`. AP-2512 (Backlog) is the Permaplate **contract**
download `/quote/{quoteId}/permaplate-contract-download` from the quote details page;
AP-2519 (Backlog) is "Download all documents" `/quote/{id}/documents/download`. Both are a
different screen and a different document, so neither C2 nor C3 holds. AP-993 ("Admin cannot
view invoice PDF in the claims details page") is Done and concerns claim attachments. AP-1381
filed nothing for invoice 934. File: "Admin invoice PDF button (/admin/invoice/{id}/pdf)
returns an HTTP 500 error page on Dev for every invoice", severity High, test case
AP2501_003 step 2, evidence invoices 941/940/937/936/935/934/930/900/800 (executor) and
500/200/50 (reviewer), links *relates to* AP-2501 and AP-2512 (same error page, different
route), and a line saying the AP-2501 term on the PDF could not be checked and the AP-1381
run saw the same on invoice 934 on 2026-11-01. It blocks AP2501_003 steps 3–4 and the PDF
surface of AP2501_006, so it is a stopping bug at Gate D.

**AP2501_002/004/005 are correctly BLOCKED.** AP2501_002 step 2 says "If only one term is
offered, record the list and mark the case BLOCKED (environment — no second term to sell)";
AP2501_004/005 Test Data *Fallback* says the same when the `TERM_B` invoice cannot be made.
The screenshot of quote 6556 shows the single radio "10 ans". No case authorises changing
dealer 1380's product links, and the worker did not, which is right. Linking a second term is
a change to a shared Dev dealer; adding it as a `[Pre-Condition]` is a design decision for s3
with the QA's consent, not something R3 can require. The `TERM_A` halves observed in 004/005
("10 ans" on row 941, both lists) are correctly recorded as observations, not partial passes.

**AP2501_006** is correctly BLOCKED on Q-001 (Blocking, Open — no non-developer answer on
AP-2501 at 00:39Z).

**Credentials:** the Dev password from the `env` source occurs 0 times in the capture,
analysis, test plan, test cases, review findings, execution log, run state, this record,
billing-invoices.md and quote-creation.md (checked by count, value not printed). The log names
only the `env` source. **Write-backs:** billing-invoices.md gains one dated section "On Dev
(v2dev) — … mapped 2026-11-02 (AP-2501 s4)" at the end and keeps the 2026-11-01 rows
(invoice 934 row, Gotchas) intact; quote-creation.md gains one dated "Dev, 2026-11-02
(AP-2501 s4)" bullet. Both files are untracked in git, so this is judged on structure, not on
a diff — nothing earlier appears removed or rewritten.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2501_003-step2-AdminInvoicePdfHttp500_fail.png — AP2501_003 step 2 | The screenshot shows the French "Erreur" page in the dealer layout but no URL and no status code, so on its own it does not prove the page came from `/admin/invoice/941/pdf` or that the status was 500; the log's fetch result carries that. The reviewer's re-check confirms HTTP 500, so no result changes. | In the new bug ticket, quote the request line and status ("GET /admin/invoice/941/pdf → 500 text/html") in the Actual Result next to the screenshot; on future runs capture the address bar or a network entry with the status. |
| F-2 | Minor | AP2501_TestCases_001-005.md and 006-006.md — Execution Context *Environment* row | Both files still say "v2staging" while the run used Dev by the user's decision; the log's pre-run checks state the deviation, so the results are not affected. | No change needed for this run; the s7 story comment and the test report must say "tested on Dev (v2dev) only, Staging not checked". |

Screenshots inspected: AP2501_001-step5-InvoiceDescriptionTerm_pass.png — matches (invoice #941, Description line 4 "PNA-0000000020", line 5 "10 ans", no price in the Description cell); AP2501_003-step2-AdminInvoicePdfHttp500_fail.png — matches the error page, URL/status not visible (F-1); AP2501_002-step2-OnlyOneTermOffered_blocked.png — matches (single term "10 ans"); AP2501_004-step3-DealerListTermARowOnly_blocked.png — matches (row 941, "10 ans" after "PNA-0000000020"); AP2501_005-step4-AdminListTermARowOnly_blocked.png — matches (Admin list, row 941, same lines)

=== REVIEW VERDICT ===
ticket: AP-2501
checkpoint: R3
round: 1
verdict: APPROVE
gate: Gate C: AP2501_003 → File new — rule C4
rework_stage: —
rework_scope: —
findings: 0/0/2
park_reason: —
record: qa-artifacts/7-reviews/AP-2501_review.md
=== END ===

## R4 — Outcome plan — round 1 — 2026-11-02T01:00:00Z (inline, worker run --from s5)
Reviewed: qa-artifacts/5-testing-report/AP-2501_test-report.md, qa-artifacts/5-testing-report/AP-2501_bug-report.md, qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md (Open Questions), qa-artifacts/qa-config/tools.md (QA outcome rules), AP-2529 read back from Jira (Backlog, High, Ken Nguyen, Relates AP-2501 / AP-2512)
Verdict: **APPROVE** · Gate D: post the story result comment on AP-2501; status and assignee unchanged (rules §3.1); no bug action (§3.2)
Findings: 0 blocker · 0 major · 1 minor

Run inline inside the AP-2501 worker (the runtime is itself a subagent), so this is not an
independent read; every figure below was recomputed from the files on disk. Pass rate
(4.1): PASS 1 ÷ (6 − 0 SKIPPED) × 100 = 16.7 %, reported as 17 % (1 of 6) — matches. Every
FAIL has a bug (4.2): AP2501_003 → BUG-001 / AP-2529, filed by rule C4 as approved at R3.
Stopping bugs (4.3): AP-2529 is stopping on both counts — it blocks AP2501_003 steps 3–4 and
the PDF part of AP2501_006, and its severity is High; it is open and not in `bug_pass_status`.
Planned move (4.4): all three checks fail — pass rate 17 % < 90 %, AP-2529 stopping and open,
Q-001 Blocking and Open — so AP-2501 stays in QC and its assignee is unchanged
(`story_fail_status` = —). The planned comment (4.5) lists all six cases with status and bug.
Bug tickets (4.6): AP-2529 is in Backlog, not the QA status, and was filed in this run, so
§3.2 gives it no action; no re-assignment is planned.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP-2501_requirements-analysis.md — Q-007 | Q-007 (dealer has no invoice PDF) was added at s6/s7, after Gate A, as Judgement; it reaches the author only through the s7 comment. | No change needed; re-run s1 when Q-001 or Q-007 is answered. |

=== REVIEW VERDICT ===
ticket: AP-2501
checkpoint: R4
round: 1
verdict: APPROVE
gate: Gate D: comment only — not moved to Ready for release (pass rate 17 %, AP-2529 stopping, Q-001 open)
rework_stage: —
rework_scope: —
findings: 0/0/1
park_reason: —
record: qa-artifacts/7-reviews/AP-2501_review.md
=== END ===

## R5 — Automation specs — round 1 — 2026-11-02T01:05:00Z (inline, worker s8)
Reviewed: qa-artifacts/6-automation/AP-2501_automation-report.md, playwright-automation/src/tests/dealer/permaplateInvoiceTerm_AP2501.spec.ts, src/flows/PermaplateInvoiceTermFlow.ts, src/pages/dealerPortal/PermaplateQuotePage.ts, src/pages/common/InvoiceViewPage.ts
Verdict: **APPROVE**
Findings: 0 blocker · 0 major · 1 minor

This review ran inline inside the AP-2501 worker, so it is not independent. 5.1: `npm run lint` passes, and `--grep @AP-2501 --repeat-each=2` gave 2 passed. 5.2: there is one test, titled AP2501_001_… (manual PASS), and the describe is tagged `@dealer @AP-2501`. 5.3: step 5 is asserted by `toContain('10 ans')`, by `toContain('PNA-0000000020')` with a single `PNA-` line, by no line matching the price pattern, and by a line Total of `$80.00`. Step 2 is asserted by the selected term being "10 ans". The Q-001 position is recorded only. 5.4: there is no `waitForTimeout`, no `test.only` and no credential. URLs are built from `config.dealerPortalUrl`, and login goes through `DealerFlow.loginToDealerPortal()`. 5.5: page objects hold no `expect` or `test.step`, the flow holds all assertions, and the spec calls the flow. 5.6: `InvoiceViewPage.ts` only gained members, and the AP-1381 spec that uses it re-ran with 3 passed. 5.8: there is no fixme. 5.9: every new locator has a count of 1 recorded.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | permaplateInvoiceTerm_AP2501.spec.ts — `INVOICE_941` | Check 5.7 asks for unique data per run. This test uses fixed ids (invoice 941, quote 6555) on the run's explicit instruction, to stay read-only and avoid creating a contract and an unpaid invoice on every run. It depends on that Dev data surviving. | None now. If Dev is reset, re-point the constants to a new Permaplate invoice or add a creation path. |

=== REVIEW VERDICT ===
ticket: AP-2501
checkpoint: R5
round: 1
verdict: APPROVE
gate: —
rework_stage: —
rework_scope: —
findings: 0/0/1
park_reason: —
record: qa-artifacts/7-reviews/AP-2501_review.md
=== END ===

## R1 — Requirements analysis — round 1 — 2026-11-15T09:16:50Z (independent reviewer, batch qa-agent 2026-11-15, s1 re-run with Step 3c)
Reviewed: qa-artifacts/.pipeline/AP-2501.md, requirements/AP-2501-permaplate-invoice-include-name-of-the.md (incl. the 2026-11-15 capture note), qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md, qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md, .claude/skills/stlc-requirements-analyst/SKILL.md (Step 3b, Step 3c), .claude/skills/stlc-qa-reviewer/checklists.md (§1, §6 E4), .claude/skills/stlc-ticket-pipeline/routing.md §3 Gate A, .claude/skills/providers/jira.md (knowledge lookup query), qa-artifacts/qa-config/tools.md, Jira AP-2099 (read), Jira AP-2428, AP-2504, AP-2446 (read for invoice-description sentences), Jira knowledge-lookup JQL run by the reviewer: `permaplate invoice description term`, `invoice list description`, `invoice name contract number`, `permaplate term invoice`; credential comparison against the `env` source (no value printed)
Verdict: **REWORK** · Gate A: rule A2 after the s1 fix (Q-001 Blocking + Open on REQ-004 only; already asked 2026-11-01 and 2026-11-08, so do not post again; continue)
Findings: 1 blocker · 0 major · 2 minor

The re-analysis is sound for six of its seven questions. Q-007 quotes AP-2099 word for word
(Story, Done; checked in Jira) and names the queries. Q-002 to Q-006 are knowledge questions,
each names its queries, and each cited observation matches the 2026-11-02 log: "10 ans" is
step 5 of AP2501_001 and the radio label in step 2; the six full lines are step 2 of
AP2501_004 and step 3 of AP2501_005. I re-ran two of the recorded lookups and got exactly the
recorded hits. Two other phrasings of my own added AP-2428 and AP-2504, and neither defines
the invoice description. Nothing was posted, and no credential value appears in the analysis,
the capture or the run state.

Q-001 must not be `Accepted`. It is not a knowledge question. It is a contradiction in the
ticket's own text: the acceptance criterion says "the name of the **invoice**" and the title
says "the name of the **term**". Step 3b test 1 makes that Blocking ("two statements
contradict"). Checklist §6 E4 lists "a contradiction inside the AC text" as a question the
lookup cannot settle. Analyst Step 3b (SKILL.md:73-75) keeps such questions `Open`. The
re-analysis also breaks its own AC-wins limit. It keeps the criterion's words for the
position ("follow the contract number") but lets the 2026-11-02 actual result replace the
criterion's subject ("the name of the invoice"). Under Step 3c the AC wins over the actual
result, so the actual result cannot decide which noun the AC means. This also makes
AP2501_006 circular: its expected result would be copied from the same build it judges, so
it could only pass. Gate D could then move the story without the reporter ever confirming a
question already asked twice.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Blocker | AP-2501_requirements-analysis.md — Open Questions Q-001; Executive Summary "Update 2026-11-15" note; REQ-004 risk rows; *Knowledge lookup — 2026-11-15* Q-001 row and "What this changes for testing" first bullet; Testability Risk Summary REQ-004 rows; Sign-off last item. Also requirements/AP-2501-…md 2026-11-15 note and qa-artifacts/.pipeline/AP-2501.md s1 note and Warnings | Q-001 is marked `Accepted`, and the 2026-11-02 actual result ("10 ans" after "PNA-0000000020") is used to decide what the acceptance criterion's "the name of the invoice" means. That is a contradiction in the ticket's own text, not unknown product knowledge (Step 3b test 1; checklist §6 E4; analyst SKILL.md:73-75). It also breaks the Step 3c limit "where the ticket's own acceptance criterion states the result, the AC wins over the actual result". The result is that Gate A goes to A3 instead of A2. | Set Q-001 back to Impact `Blocking`, Status `Open`. Write in the Answer column: "Not product knowledge — the AC ('the name of the invoice') contradicts the title and description ('the name of the term'); lookup run, nothing settles it (queries as recorded); asked on AP-2501 2026-11-01 (comment 19437) and 2026-11-08, no answer". Keep the lookup row as evidence. The second half of Q-001 ("follow" means the very next line, or anywhere after) is a format question. Split it into its own Judgement question, which may be `Accepted` with the observed "next line". Restore the REQ-004 risk, the summary and the sign-off to "REQ-004 BLOCKED on Q-001". Replace the "Q-001 no longer blocks" bullet with "AP2501_006 stays BLOCKED on Q-001; its line-order observations stay record-only". Add a dated correction blockquote under the capture's 2026-11-15 note, and correct the run-state s1 note and Warnings to match. Leave Q-002 to Q-007 unchanged. |
| F-2 | Minor | AP-2501_requirements-analysis.md — Q-002, Q-005 (and Q-001's position half) | These questions were posted with screenshots on AP-2501 on 2026-11-08. They are now settled by the lookup, but the reporter is still being asked them. | At s7, have the story comment say that Q-002, Q-005 and Q-007 were settled by the knowledge lookup (Q-007 by AP-2099) and need no answer, so only Q-001 is still open. This posts no new question. |
| F-3 | Minor | AP-2501_requirements-analysis.md — *Knowledge lookup — 2026-11-15*, Q-001 row | The Q-001 hits list AP-2504, AP-2443 and AP-2428 (and the reviewer's phrasing also returned AP-2428). These were not read. The reviewer read them and none defines the invoice description, so the result does not change. | When s1 is re-run for F-1, list them under "Tickets read" or say why they were skipped (contract-page stories with no invoice-description sentence). |

Gate A evaluation on the corrected table: 4 requirements. One `Blocking` + `Open` question (Q-001) blocks REQ-004 only, and REQ-001 to REQ-003 have none. So rule A1 does not hold and rule **A2** applies. The questions comment already lists Q-001 (comment 19437, 2026-11-01, repeated in the 2026-11-08 comment), so record "already asked on 2026-11-01" and do not post it again. Continue: s2–s7 re-run. AP2501_006 ships BLOCKED on Q-001. AP2501_002, AP2501_004 and AP2501_005 proceed with the orchestrator's dealer-1380 second-term setup (link, then unlink and confirm the restore in the same case). The other questions are not posted.

harness_defect: stlc-requirements-analyst — Step 3b's `Open` examples (SKILL.md:73-75: attachment, comment author's intent, test data, access) do not name "the ticket's own text contradicts itself", although test 1 (SKILL.md:59) and reviewer checklist §6 E4 (checklists.md:126) do. The re-run took Q-001's contradiction to Step 3c and marked it `Accepted`. Proposed: add "a contradiction between the AC and the title or description, or inside the AC" to the `Open` examples, and add a line to Step 3c: "never use the actual result to choose between two readings of the ticket's own text".

=== REVIEW VERDICT ===
ticket: AP-2501
checkpoint: R1
round: 1
verdict: REWORK
gate: Gate A: continue — rule A2 after the s1 fix (Q-001 Blocking + Open on REQ-004 only; already asked 2026-11-01 comment 19437 and 2026-11-08 — do not post again)
rework_stage: s1
rework_scope: Q-001 only (Status back to Blocking + Open; split its "next line" half into a Judgement question that may be Accepted) and every text that relies on Q-001 being Accepted — analysis Executive Summary note, REQ-004 risks, Knowledge lookup Q-001 row and first "What this changes" bullet, Risk Summary, Sign-off; capture 2026-11-15 note (add a correction blockquote); run-state s1 note and Warnings. Q-002–Q-007 unchanged
findings: 1/0/2
park_reason: —
record: qa-artifacts/7-reviews/AP-2501_review.md
=== END ===

## R1 — Requirements analysis — round 2 — 2026-11-15T09:24:00Z (independent reviewer, batch qa-agent 2026-11-15, s1 rework check)
Reviewed: qa-artifacts/7-reviews/AP-2501_review.md (R1 round 1 findings), qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md, requirements/AP-2501-permaplate-invoice-include-name-of-the.md (2026-11-15 note and correction blockquote), qa-artifacts/.pipeline/AP-2501.md (s1 row, Gate log, Warnings), qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md (lines 39, 59–60, 95, 107, 119), .claude/skills/stlc-qa-reviewer/checklists.md §1, .claude/skills/stlc-ticket-pipeline/routing.md §3 Gate A; credential comparison against the `env` source (no value printed, no match). No browser, no tracker write.
Verdict: **APPROVE** · Gate A: continue without posting — Q-001 already asked 2026-11-01 (comment 19437) and 2026-11-08 — rule A2
Findings: 0 blocker · 0 major · 0 minor

The s1 rework closes all three round-1 findings and changes nothing else. F-1: Q-001 is again
Blocking + Open on REQ-004. Its Answer says it is not product knowledge, lists the queries
and the tickets read, records that it was asked on 2026-11-01 (comment 19437) and 2026-11-08,
and states that the actual result is not used to choose a reading. The position half is now
Q-008 (Judgement, REQ-004, Accepted: the line directly after the contract number). Q-008 is
limited to position, names its queries, and cites evidence that matches the execution log
(invoice 941: "PNA-0000000020" then "10 ans" on the details page, log line 59, and on both
lists, lines 95 and 107). The Executive Summary correction, the REQ-004 risk rows, the
Knowledge lookup Q-001 and Q-008 rows, the "What this changes" first bullet, the Risk Summary
and the Sign-off now all say REQ-004 is BLOCKED on Q-001 and REQ-001 to REQ-003 proceed. The
capture keeps its original 2026-11-15 note and adds a dated correction blockquote below it.
In the run state, the 09:20:51Z Gate log entry marks the 09:13:57Z "Accepted" entry as
superseded, and the s1 row and Warnings agree. F-2: the s7 note (Q-002, Q-005 and Q-007 are
settled; only Q-001 is open; nothing new is posted) is in the analysis and in the run-state
Warnings. F-3: the Q-001 row lists AP-2428, AP-2443 and AP-2504 as read and gives the reason
none of them settles the question. Q-002 to Q-007 keep the Impact, Status and cited evidence
checked in round 1. No question was posted, and no credential value appears in the analysis,
the capture or the run state.

Checklist §1: 1.1 pass (every AC line maps to REQ-001–004) · 1.2 pass · 1.3 pass (Q-001–Q-008 each have Impact and Status) · 1.4 pass · 1.5 pass (Q-007 quotes AP-2099) · 1.6 pass (every Accepted question names its queries; nothing Accepted was posted).

Gate A evaluation: 4 requirements. One Blocking + Open question (Q-001) blocks REQ-004 only. REQ-001 to REQ-003 have no Blocking question, so rule A1 does not hold and rule **A2** applies. Q-001 is already in the questions comment 19437 (2026-11-01) and the 2026-11-08 comment, so it is not posted again. Continue to s2–s7. AP2501_006 stays BLOCKED on Q-001, and its line-order observations are recorded only, not judged. Q-008 sets the expected position for when Q-001 is answered. Per the orchestrator's decision, AP2501_002, AP2501_004 and AP2501_005 each link a second Permaplate term to dealer 1380 as their own setup step, then unlink it in the same case and confirm the restore. At s7, the story comment says Q-002, Q-005 and Q-007 need no answer.

=== REVIEW VERDICT ===
ticket: AP-2501
checkpoint: R1
round: 2
verdict: APPROVE
gate: Gate A: continue — rule A2 (Q-001 Blocking + Open on REQ-004 only; already asked 2026-11-01 comment 19437 and 2026-11-08 — do not post again; REQ-001–REQ-003 proceed; REQ-004 / AP2501_006 BLOCKED on Q-001)
rework_stage: —
rework_scope: —
findings: 0/0/0
park_reason: —
record: qa-artifacts/7-reviews/AP-2501_review.md
=== END ===

## R2 — Test cases — round 1 — 2026-11-15T09:33:58Z (independent reviewer, batch qa-agent 2026-11-15, design pass after the knowledge-lookup re-analysis)
Reviewed: qa-artifacts/.pipeline/AP-2501.md, qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md (Open Questions and lookup tables), qa-artifacts/2-test-plan/AP-2501_test-plan.md (v1.1), qa-artifacts/3-test-cases/AP2501_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2501_TestCases_006-006.md, qa-artifacts/3-test-cases/AP2501_ReviewFindings_2026-11-15.md, qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md, qa-artifacts/qa-docs/quote-creation.md (Permaplate Dev sections 2026-11-02 / 2026-11-08, check-out page 2026-11-15), qa-artifacts/base-test/test-centralized.md (vehicle 915), .claude/skills/stlc-testcase-designer/SKILL.md Step 1c
Verdict: **APPROVE** · Gate B: Execute the current cases — rule B3
Findings: 0 blocker · 0 major · 3 minor

The six cases can be trusted for execution on Dev. Every REQ/AC has a case (REQ-001 → 001/002, REQ-002 → 003, REQ-003 AC 1/2 → 004/005, REQ-004 → 006 BLOCKED on Q-001); Accepted questions are asserted only at their observed values, as designer Step 1c allows; AP2501_003's expected result rests on the AP-2099 quote and REQ-002 AC 1, with AP-2529 named only as the known objective fault. AP2501_002 restores dealer 1380 on every path after a link it made (steps 2 and 3 failing or BLOCKED both go to step 4), stays at 5 steps, and compares the term as a whole line. AP2501_001's kept PASS is not invalidated: the 2026-11-02 log shows it already ran through `fromVehicleId` and the row-menu Generate Contract, so the only real action change is Financing company "Choose" → "AutoCapital Canada", a setup input that no expected result reads; the current build's invoice generation is re-proved by AP2501_002 and invoice 941 is re-read on the current build by AP2501_003 step 1, 004 and 005. The AP-2503 "check out" redesign (AP-2544/2545/2546/2559/2560) touches only the contract form, which these cases use as setup; no AP-2501 expected result conflicts with it. No credential value appears in the test cases or the plan (compared without printing).

Gate B evidence: Pass 1 has 0 gaps citing a REQ/AC (gap 1, pre-change invoice, cites test plan §2.2 / Q-003 only — not a B1 trigger); Pass 2 has 0 High proposals. Unpromoted: P1 French interface term (Medium), P2 dealer quote page after unlink (Low), P3 pre-change invoice (Low); 2026-11-01 proposals 3–5 (Low/Low/Low) unchanged.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2501_TestCases_001-005.md — AP2501_002 step 1 | The BLOCKED branch ("neither can be linked … nothing was changed, so skip step 4") trusts that a failed Save changed nothing; a Save that errors but persists the link would leave TERM_B on the shared dealer with no restore. | On that branch, re-read `/admin/dealer/1380/permaplate` and, if it differs from LINKS_BEFORE, set LINKED_BY_CASE = yes and run step 4. Executor can apply it as written practice this run. |
| F-2 | Minor | AP2501_TestCases_001-005.md — Execution Context "Contract → invoice flow", AP2501_001/002 step 3 | The contract page is described by its 2026-11-08 layout; AP-2544/2545/2546 (Deploy to staging, all quote products incl. Esthetic Protection) redesigned it on Dev by 2026-11-15 (quote-creation.md check-out section), so field layout and required owner fields may differ. | Add a line that the page may appear in its check-out form; the case uses only Program Term, Financing company and submit, and the executor writes the Permaplate check-out layout back to quote-creation.md. |
| F-3 | Minor | AP2501_TestCases_001-005.md — AP2501_002 step 5 | "A line reading exactly TERM_B" (the radio label) extends Q-002's accepted value, observed only for "10 ans"; a different text form of the right term would be neither a pass nor a listed objective fault. | State that a line naming TERM_B in another form is recorded for Q-002 and accepted (record-and-accept); only TERM_A, another term or no term fails. |

## R3 — Execution results — round 1 — 2026-11-15T10:56:00Z (independent reviewer, batch qa-agent 2026-11-15, Dev)
Reviewed: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-15.md, qa-artifacts/3-test-cases/AP2501_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2501_TestCases_006-006.md, qa-artifacts/.pipeline/AP-2501.md, the 2026-11-15 screenshots and AP2501_003-step3-Nov15-AdminInvoicePdfHttp500_fail-network.txt in qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/, write-backs in qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/qa-docs/billing-invoices.md, qa-artifacts/base-test/navigation-map.md, Jira AP-2529 (tracker CLI), Dev /admin/dealer/1380/permaplate (read only)
Verdict: **APPROVE** · Gate C: AP2501_003 → Comment on existing AP-2529 — rule C2
Findings: 0 blocker · 0 major · 2 minor

The 2026-11-15 run can be trusted. All six cases are in the log; the recount gives 4 PASS (001 carried, 002, 004, 005), 1 FAIL (003), 1 BLOCKED (006, Q-001), so 66.7% (4 of 6) is correct. Every PASS step states observed values that match its expected result, and every screenshot named in the log exists, carries a 2026-11-15 timestamp and a hash distinct from the 2026-11-02 files (no tracked 2026-11-02 screenshot is modified). The AP2501_003 FAIL is on the step under test (step 3, click "PDF"), against an objective fault: HTTP 500 text/html with the French technical-error page for /admin/invoice/941/pdf and /admin/invoice/956/pdf, so it is correctly FAIL and not BLOCKED (checklist 3.7). AP2501_006 is BLOCKED and names Q-001 (Blocking, Open) as its cause. The dealer 1380 restore is proven: the step 5 screenshot (10:46:24Z, after the 10:46:20Z unlink) shows the alert "Esthetic protection product unlinked" and the single row 3 "10 ans" 120 Yes, and this reviewer re-read /admin/dealer/1380/permaplate on Dev at 10:54Z: one row only, 3 "10 ans", 120 months, Enabled Yes — equal to LINKS_BEFORE.

Gate C (own search): open bugs, JQL `type = Bug AND statusCategory != Done AND text ~ "<words>"` with six phrasings — "invoice PDF 500", "admin invoice pdf", "invoice pdf error", "PDF button error", "difficultés techniques", "invoice PDF". Candidates: AP-2529 (every query), AP-2512 (contract PDF download — different screen and document), AP-2461 (contract number in the description — different behaviour), and unrelated HTTP 500 bugs on other screens (AP-2564, AP-2542, AP-2519, AP-2518, AP-2510, AP-2484, AP-2482, AP-2478). C1 does not apply: no sentence in the capture or a non-developer comment states that an HTTP 500 is intended. C2 applies to AP2501_003: AP-2529 is open (Backlog, High) and names the same screen and the same wrong behaviour — "On the Admin portal invoice page, the **PDF** button (/admin/invoice/❬id❭/pdf) returns an HTTP 500 error page instead of the invoice PDF, for every invoice." Decision: **comment on AP-2529** with the 2026-11-15 re-check (invoices 941 and new invoice 956, both HTTP 500 text/html on Dev), no new bug. AP-2529 is already linked "relates to" AP-2501, so no new link is needed.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | execution-log_AP-2501_2026-11-15.md — AP2501_002 step 4 and Environment Observations | The second restore read "at 10:48Z after the last case" has no screenshot or values file; only the 10:46:24Z screenshot backs the restore. This reviewer's Dev read at 10:54Z confirms the state, so no result changes. | Next run, capture the final restore re-read (screenshot or a values file with time and table rows) when the log cites it. |
| F-2 | Minor | screenshots AP2501_003-step3-Nov15-AdminInvoicePdfHttp500_fail.png and AP2501_003-step4-Nov15-NoInvoicePdfToCompare_fail.png | Neither image shows the URL or status, so the image alone cannot tell the Admin PDF route from another error page; the URL and HTTP 500 rest on the -network.txt file, which does carry them. | When filing or commenting at s5, attach the -network.txt lines with the screenshot; no re-run needed. |

Screenshots inspected: AP2501_002-step3-Nov15-Invoice956Term5ans_pass.png — matches (Invoice #956, line 4 "PNA-0000000028", line 5 "5 ans", no "10 ans", Grand Total $40.24); AP2501_002-step5-Nov15-RestoreConfirmedOnly10ans_pass.png — matches (alert "Esthetic protection product unlinked", single row 3 "10 ans" 120 Yes); AP2501_003-step3-Nov15-AdminInvoicePdfHttp500_fail.png — matches (French "Erreur — Désolé, l'application éprouve des difficultés techniques"); AP2501_003-step4-Nov15-NoInvoicePdfToCompare_fail.png — matches (same error page); AP2501_004-step3-Nov15-DealerListRow956Term5ans_pass.png — matches (row 956, six lines, "5 ans"); AP2501_004-step3-Nov15-DealerListRow941Term10ans_pass.png — matches (row 941, six lines, "10 ans"); AP2501_005-step4-Nov15-AdminListRow956Term5ans_pass.png — matches (Admin layout, row 956 "5 ans"); AP2501_005-step4-Nov15-AdminListRow941Term10ans_pass.png — matches (Admin layout, row 941 "10 ans"); AP2501_003-step2-AdminInvoicePdfHttp500_fail.png (2026-11-02, compared only — different hash and timestamp from the 2026-11-15 file).

Other checks: 3.5a not applicable (no step checks entered values surviving a save or reload; step 4/5 of 002 checks a table after unlink, backed by screenshot and the reviewer's Dev read). Credential scan: the env source's password value does not appear in the log, the network file, the case files, the run state, the review record or the three write-back files (compared by script, value not printed). Write-backs only add or refresh: quote-creation.md gains the "Dev, 2026-11-15 (AP-2501 s4)" bullet (link/unlink modals, "5 ans" options, contract page, checkout page), billing-invoices.md gains the 2026-11-15 bullet (invoice 956, lists, PDF still HTTP 500), and navigation-map.md refreshes the Permaplate row's notes and date to 2026-11-15; the facts match the log. Left behind on Dev as recorded: client terme.second.1115@yopmail.com, quote 6709, contract PNA-0000000028 (AutoCapital Canada), unpaid invoice 956; the "5 ans" link is removed.

## R4 — Outcome plan — round 1 — 2026-11-15T11:10:00Z (independent reviewer, batch qa-agent 2026-11-15, Dev)
Reviewed: qa-artifacts/5-testing-report/AP-2501_run-summary.md (section "Planned update-ticket comment"), qa-artifacts/5-testing-report/AP-2501_test-report.md (TR-20261115-001), qa-artifacts/5-testing-report/AP-2501_bug-report.md (BR-20261115-001), qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-15.md, qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md, qa-artifacts/.pipeline/AP-2501.md, qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP-2501_Q-001_highlighted.png, qa-artifacts/qa-config/tools.md (QA outcome rules), .claude/skills/stlc-ticket-pipeline/template.md §4.1, .claude/skills/stlc-ticket-pipeline/routing.md (Gate A, Question screenshot, Gate D §3.1–3.3), Jira AP-2501 and AP-2529 (tracker CLI, read only)
Verdict: **APPROVE** · Gate D: comment only (corrected text below); no status move, AP-2501 stays in QC; assignee unchanged (Vinh Le - QC); no action on AP-2529 — rule §3.1 (all three move checks fail)
Findings: 0 blocker · 0 major · 1 minor

The outcome plan can be trusted. The recount from the execution log gives 4 PASS (001 carried, 002, 004, 005), 1 FAIL (003), 1 BLOCKED (006), 0 SKIPPED, so 4 ÷ 6 = 66.7%, the figure in the report and the comment. All three move checks fail: 66.7% < 90%; AP-2529 is open and stopping (severity High, and it fails AP2501_003 at step 3 of 4); Q-001 is Blocking + Open. AP-2512 and AP-2519 are correctly not counted: Jira shows AP-2501's only issue link is AP-2529, and neither appears in the bug report. Listing Q-001 in the story comment is not a re-post: the Gate A "already asked, do not post again" rule governs the Gate A questions comment, while template §4.1 requires every open Blocking question on the *Questions:* line of the s7 result comment with its screenshot; the "(asked 2026-11-01 and 2026-11-08)" note marks it as a reminder. One wording fix is needed (F-1), and the corrected comment text is given below.

Read-back of AP-2529 (2026-11-15): Backlog, High, assignee Minh Lưu, links Relates → AP-2501 and AP-2512; comment 19587 by Vinh Le - QC, heading "QA re-check — still failing · Dev · 2026-11-15", carries both request lines (941 and 956 → 500 text/html) in a code block and one mediaSingle/media node with id 7c980f2c-… (the 2026-11-15 screenshot, attached to AP-2529). AP-2529 is not in the QA status, so §3.2 gives it no Gate D action.

Checklist: 4.1 pass (66.7% recomputed). 4.2 pass (AP2501_003 → AP-2529, comment 19587). 4.3 pass (AP-2529 stopping; AP-2512/AP-2519 not linked to this run). 4.4 pass (no move). 4.5 pass (003 and 006 each on a line with bug or question; passed IDs 001–002, 004–005). 4.6 not applicable (no bug re-assignment; AP-2529's assignee change to Minh Lưu was made in Jira, not by QA, and Minh Lưu is not in not_developers). 4.6a pass: AP-2501_Q-001_highlighted.png exists on disk (56,989 bytes) and is the same file attached to AP-2501 on 2026-11-08 (same size, the only attachment of that name, so `!AP-2501_Q-001_highlighted.png!` resolves without an upload); reading it, the red box frames "PNA-0000000020" and "10 ans" on the next line of Invoice #941's Description, which is the point of Q-001 (which name follows the contract number); the caption matches the image. 4.7 not applicable (no bug filed this run). Template §4.1: header, totals, failed/blocked lines, passed ranges, bugs, questions with the reporter mention (accountId 5ae11c42b076312e0e25c600 = Ken Nguyen, AP-2501 reporter), one image, and a Next line naming all three failed checks; about 12 text lines, under the 20-line limit. Credential scan: no env-source credential value appears in the run summary, test report, bug report, execution log, AP-2529 comment body, run state, this review record or the Jira reads (compared by script, value not printed).

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP-2501_run-summary.md — Planned update-ticket comment, line "Q-002, Q-005 and Q-007 (posted 2026-11-08) are now settled…" | Q-003 was also put to the reporter — listed in the 2026-11-02 result comment 19455 and named on the "No screenshot yet: Q-003 — added at the next test run" line of the 2026-11-08 comment 19541 — and is now Accepted, but the line leaves it out, so the reporter may still think Q-003 waits for an answer (R1 round 1 F-2 on 2026-11-15 omitted it too). | Post the corrected line: "Q-002, Q-003, Q-005 and Q-007 (asked in earlier QA comments) are now settled and need no answer." The full corrected comment is in the verdict hand-off; no re-run of s6 is needed. |
