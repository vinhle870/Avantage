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
