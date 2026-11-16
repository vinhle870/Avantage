# Run Summary — AP-2501: Permaplate invoice - include name of the term in the description
Updated: 2026-11-15T11:05:40Z · Run folder: no-sprint · Stages run: update-ticket (file-bugs → report ran earlier the same day, 10:56–10:59Z) · Run status: complete · Environment: Dev (v2dev)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2501: Permaplate invoice - include name of the term in the description
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 4 REQ · 1 High risk open (REQ-004 — Q-001, Blocking)
 Test cases   : 6 designed · 0 proposed by review promoted (Gate B rule B3)
 Execution    : 4 PASS · 1 FAIL · 1 BLOCKED — 66.7% (4 of 6)
 Bugs         : 0 filed · 1 linked to existing (AP-2529, re-check comment 19587) · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS (correct-cases skipped)
 Verdict      : FAIL
 Tickets      : AP-2501 unchanged (QC, comment 19588) · 0 bugs updated (AP-2529 commented only — Backlog, Minh Lưu, unchanged)
 Stopped at   : update-ticket (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2501 FAIL — 4 of 6 test cases passed on Dev, missing the 90% threshold (66.7%). 0 bugs filed (1 linked to the existing AP-2529). Ticket comment posted and verified (comment 19588).

**What passed**
- AP2501_001 (carried from 2026-11-02): invoice 941's details page names the term "10 ans" on the line after the contract number PNA-0000000020, with no retail price.
- AP2501_002: a contract sold with a second term, "5 ans", produced invoice 956 whose description reads "5 ans" and never "10 ans", next to its own contract number PNA-0000000028. The invoice names the term actually sold.
- AP2501_004 and AP2501_005: the Dealer Portal and Admin invoice lists show "5 ans" on invoice 956 and "10 ans" on invoice 941, each description in full on six lines.

**Failures**
- AP2501_003 — the Admin invoice page's "PDF" button still answers HTTP 500 with the French "technical difficulties" page, for invoice 941 and for today's invoice 956, so no invoice PDF exists to check the term on. Gate C: linked to AP-2529 (rule C2) — re-check comment 19587 posted with the screenshot and request lines, and read back.

**Decisions made**
- Gate A (rule A2, decided by the independent reviewer, R1 round 2, 2026-11-15): continue; Q-001 (Blocking, REQ-004) not posted again as a questions comment — already asked 2026-11-01 (comment 19437) and 2026-11-08.
- Gate B (rule B3, decided by the independent reviewer, R2 round 1): execute the current cases; no proposal promoted.
- Gate C (rule C2, decided by the independent reviewer, R3 round 1): AP2501_003 → comment on the existing AP-2529 (open, Backlog, High, already linked to AP-2501, same screen and same fault). No new bug; AP-2529's status and assignee were not changed.
- Gate D (rule §3.1, decided by the independent reviewer, R4 round 1, applied automatically): AP-2501 not moved to Ready for release — pass rate 66.7% (needs 90%), AP-2529 (High) open, Q-001 (Blocking) open. Story result comment 19588 posted with the reviewer's correction (F-1: Q-003 added to the settled-questions line) and read back: one inline image (AP-2501_Q-001_highlighted.png, attached 2026-11-08, not re-uploaded) and the mention of Ken Nguyen. Status QC and assignee Vinh Le - QC unchanged; no action on AP-2529.
- Before posting, AP-2501's comments were checked: none was dated 2026-11-15, so the comment is not a duplicate.
- Automation: the gate is not met (66.7% < 90%, AP-2529 High open), so no automation run follows this execution.

**Left behind**
- Test data on Dev (2026-11-15): client terme.second.1115@yopmail.com (Terme Second1115), quote 6709, Permaplate contract PNA-0000000028 (term "5 ans", Financing company AutoCapital Canada) and unpaid invoice 956 ($40.24) — invoices are permanent. The temporary "5 ans" link on dealer 1380 was removed and the restore verified (only "10 ans" remains). Earlier records remain: quotes 6555 and 6556, contract PNA-0000000020, invoice 941.
- Observations that are not failures: AP2501_006 stays BLOCKED on Q-001; on every surface that could be read, the term sits on the line right after the contract number. Q-002, Q-003, Q-005 and Q-007 are settled and the ticket comment says they need no answer. AP-2529's assignee is now Minh Lưu (the bug report's 2026-11-02 record said Ken Nguyen; the change was made in Jira, not by QA).
- Knowledge files added or changed: None in this run (the 2026-11-15 execution write-backs to `quote-creation.md`, `billing-invoices.md` and `navigation-map.md` were made at execute).

**Files**
- [AP-2501_test-report.md](qa-artifacts/5-testing-report/AP-2501_test-report.md)
- [AP-2501_bug-report.md](qa-artifacts/5-testing-report/AP-2501_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-15.md)
- [AP-2501 comment body (19588)](qa-artifacts/4-execution-results/comment_AP-2501_2026-11-15.md)
- [AP-2529 comment body (19587)](qa-artifacts/4-execution-results/comment_AP-2529_2026-11-15.md)
- [run state](qa-artifacts/.pipeline/AP-2501.md)

## Automation
Not run for the 2026-11-15 execution: the automation gate is not met (pass rate 66.7%, needs 90%; AP-2529 High open). The existing spec `playwright-automation/src/tests/dealer/permaplateInvoiceTerm_AP2501.spec.ts` (`@AP-2501`, AP2501_001 only, 2026-11-02) is unchanged.
