# Run Summary — AP-2503: Generate contract for a quote's extended warranty
Updated: 2026-11-15T09:52:37Z · Run folder: no-sprint · Stages run: update-ticket → update-ticket · Run status: complete · Environment: Dev (v2dev)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2503: Generate contract for a quote's extended warranty
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 5 REQ · 11 of 11 questions Answered (not re-run in this dispatch)
 Test cases   : 10 executed (6 High, 4 Medium) · P1–P10 proposed by review, not promoted
 Execution    : 5 PASS · 5 FAIL · 0 BLOCKED — 50% (5 of 10) on Dev (v2dev)
 Bugs         : 2 filed (AP-2563, AP-2564) · 3 linked to existing (AP-2530, AP-2531, AP-2532 commented) · 1 step not a bug (AP2503_002 step 3, AP-2559)
 Corrected    : 0 test cases rewritten · 0 retired (correct-cases skipped — no rule C1 decision)
 Verdict      : FAIL
 Tickets      : AP-2503 result comment 19584, status QC and assignee unchanged · 0 bugs moved (3 commented, 2 created at file-bugs)
 Stopped at   : — (run complete after update-ticket; automation gate not met)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

This dispatch ran update-ticket only (`--from update-ticket --until update-ticket`) and applied the Gate D decision of the orchestrator's qa-reviewer (R4 round 1, APPROVE). The run is complete. Automation is not started: the automation gate needs at least 90% PASS and no open High bug; this run has 50% and AP-2532 (High) open.

**What passed**
- AP2503_001 — "Generate Contract" in the Extended warranty row's ⋯ menu opens its own page at `/quote/{id}/warranty/generate-contract` (HTTP 200 typed directly, no pop-up, "Back" to the quote).
- AP2503_004 — every owner, vehicle and financing value the page shows matches what quote 6704 holds.
- AP2503_006 — submitting a financed quote created contract APOP01-848 and invoice #952 for $456.00 (the warranty cost); the ⋯ menu became the contract link and a PDF icon.
- AP2503_009 — a start date 30 days before delivery (2026-10-16) was accepted and is the start date of contract APOP01-850 on the list and in the PDF.
- AP2503_010 — the page opens for a quote with no financing, pre-fills the owner and the VIN, and shows no financing card, as delivered Story AP-2559 defines.

**Failures**
- **The page under test was redesigned on Dev after the cases were written.** Delivered Stories AP-2544, AP-2545, AP-2546, AP-2559 and AP-2560 turned it into the shared "check out" page ("Product Summary", read-only vehicle values except the VIN, a financing resume card, a required Financing company picker, server-side checks, the quote's client updated on submit).
- AP2503_002 step 4 — the right column has no contract preview and no "Open PDF in new tab" link (AC 1, AC 2); the 2026-11-02 run saw both on this page, so it is a regression. Gate C: filed as **AP-2563** (Medium). Step 3 (no Financing information card on quote 6703) is PASS — superseded by AP-2559.
- AP2503_003 step 3 — the Product Summary still shows no vehicle delivery date (AC 2). Gate C: linked to **AP-2530** (comment 19581).
- AP2503_005 steps 2 and 5 — the VIN can still be typed over (AC 3); the delivery date is now read-only. Gate C: linked to **AP-2531** (comment 19582), which quotes AP-2544 "All inputs are read-only except for the VIN input." and leaves to the developer whether that supersedes the VIN half.
- AP2503_007 step 3 — a quote without financing is refused with "This value should not be blank." on the required Financing company picker. Gate C: linked to **AP-2532** (High, comment 19583).
- AP2503_008 step 4 — submitting with the warranty start date cleared returns HTTP 500 and the error page, twice; no contract created. Gate C: filed as **AP-2564** (Medium).

**Decisions made**
- Gate C (rules C2/C4, by reviewer — R3 round 2 APPROVE): C2 comment on AP-2530 (AP2503_003), AP-2531 (AP2503_005, VIN only, cite AP-2544), AP-2532 (AP2503_007); C4 file new for F4 (AP2503_002 step 4) and F5 (AP2503_008 step 4); AP2503_002 step 3 not a bug (AP-2559). Re-check at file-bugs found no new duplicate.
- Batch decisions: the QA's answer to Q-001–Q-011 ("all current behavior actual result is correct as expected") accepts the 2026-11-02 behaviour on the questions only — AP-2530/2531/2532 stay open (AC wins). Delivered Stories AP-2544, AP-2545, AP-2546, AP-2559 and AP-2560 supersede AP-2503 on the points they define; AP-2550 and AP-2561 are In Progress and do not.
- New bugs AP-2563 and AP-2564: priority Medium, assigned to Minh Lưu (`bug_new_assign`), Relates → AP-2503, labels qa-agent / stlc-automated, one screenshot each embedded and verified (apply_mode automatic).
- Verdict FAIL: 50% against the 90% threshold; one High bug open (AP-2532).
- Gate D (rule D §3.1, by reviewer — R4 round 1 APPROVE, 0/0/2; apply_mode automatic): story result comment **19584** posted on AP-2503 at 2026-11-15T09:51:39Z with the reviewer's exact text (21 lines) and read back — body identical to the file, author Vinh Le - QC. AP-2503 stays **QC**, assignee Vinh Le - QC — not moved to Ready for release: pass rate 50% (needs 90%) and AP-2532 (High) is open; 0 Blocking questions. §3.2 not applicable: AP-2530, AP-2531, AP-2532, AP-2563 and AP-2564 are all in Backlog (read back 2026-11-15T09:52Z) — no action taken on them.
- R4 minor F-2: AP-2530, AP-2531 and AP-2532 are assigned to Minh Lưu in Jira today; the bug report (Tracker Ticket rows and Ticket Update Log) said Ken Nguyen, the 2026-11-02 assignee. Corrected in the file only, no tracker change.

**Left behind**
- Test data on Dev (v2dev): vehicles 1231–1235 (VINs AP2503TC001/004/007/008/009111509), quotes 6703–6707, a financing on quote 6704, and **three permanent contracts with invoices: APOP01-848 (quote 6704, invoice #952), APOP01-849 (quote 6705, invoice #953), APOP01-850 (quote 6707, invoice #954)**. Quote 6705's client was edited by the submit (now ContractEd / 300 Rue Edit / 5145550299, per AP-2545). Nothing was deleted. This dispatch created no test data.
- Observations that are not failures: quote 6704 shows a Financing information card although it has no GAP/Creditor insurance, which AP-2559 read literally would hide (for AP-2559's author); the Owner identification card shows "Indian status certificate" and "Drivers license", which AP-2545 says are not shown (for AP-2545's testing). Cases AP2503_002, _005, _007, _008 and _010 (and _004 for AP-2559) should be redesigned against the delivered Stories in a later design pass.
- Knowledge files added or changed: None in this dispatch (the execute dispatch wrote the `domain` quote-creation.md Dev section and the `navigation` row on 2026-11-15).

**Files**
- [AP-2503_test-report.md](qa-artifacts/5-testing-report/AP-2503_test-report.md)
- [AP-2503_bug-report.md](qa-artifacts/5-testing-report/AP-2503_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-15.md)
- [run state](qa-artifacts/.pipeline/AP-2503.md)
- Story result comment: [AP-2503](qa-artifacts/4-execution-results/comment_AP-2503_2026-11-15.md) (Jira comment 19584)
- Bug comments: [AP-2530](qa-artifacts/4-execution-results/comment_AP-2530_2026-11-15.md) · [AP-2531](qa-artifacts/4-execution-results/comment_AP-2531_2026-11-15.md) · [AP-2532](qa-artifacts/4-execution-results/comment_AP-2532_2026-11-15.md)

## Automation
Not run yet for the 2026-11-15 execution. The spec from 2026-11-02 (`playwright-automation/src/tests/dealer/warrantyGenerateContract_AP2503.spec.ts`) checks the old page ("Program Summary", "Financing information", PDF preview), so it no longer matches Dev. Automation gate not met (50% < 90%, AP-2532 High open) — no qa-automator dispatch for this run.
