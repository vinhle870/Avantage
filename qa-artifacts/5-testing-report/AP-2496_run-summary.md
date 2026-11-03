# Run Summary — AP-2496: Download all finalized documents from a quote in one click
Updated: 2026-11-02T05:14:00+07:00 · Run folder: no-sprint · Stages run: s5 → s7 (`--from s5`, after R3 round 2 APPROVE) · Run status: complete

**Tested on: Dev (v2dev)** — chosen by the user for this run; v2staging was not opened.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2496: Download all finalized documents from a quote in one click
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 4 REQ · 2 High risks (0 Blocking questions; 9 Judgement, 1 Info)
 Test cases   : 9 designed · 7 proposed by review (1 promoted)
 Execution    : 2 PASS · 1 FAIL · 6 BLOCKED (Dev, v2dev)
 Bugs         : 1 filed (AP-2519) · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · s4c skipped (no C1 decision)
 Verdict      : FAIL
 Tickets      : AP-2496 unchanged (QC) · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2496 FAIL — 2 of 9 test cases passed on Dev (v2dev), missing the 90% threshold. 1 bug filed (AP-2519). Ticket comment posted and verified.

**What passed**
- Hiding the action when there is nothing to download: the "Download all documents" link is not shown on a quote whose only product (Esthetic protection) was removed before any contract existed (AP2496_002, quote 6485), nor on a quote that never had a product (AP2496_003, quote 6486).

**Failures**
- AP2496_008 — opening `/quote/6488/documents/download` for a quote with no contract returned HTTP 500 (the French technical-error page) on 4 of 4 tries, and the same address fails on quote 6040, where both source PDFs download correctly (warranty 5 pages, sales 6 pages, both HTTP 200), so a dealer never gets the merged PDF. Gate C: filed as AP-2519 (rule C4, High, relates to AP-2496, assigned to Ken Nguyen).

**Decisions made**
- Gate A (rule A3): continue — 0 Blocking, 9 Judgement, 1 Info questions; no questions posted (earlier run).
- Gate B (rule B2): Pass 2 proposal #1 promoted as AP2496_009 (earlier run).
- Gate C (rule C4, reviewer R3 round 2 APPROVE): AP2496_008 → file new. No open bug names `/quote/{id}/documents/download`; AP-2512 is a different address and AP-2518 is contract creation. Rule C1 did not hold — no sentence says a 500 is intended.
- Gate D (rules, automatic; reviewer R4 APPROVE): AP-2496 not moved — pass rate 22% (needs 90%), AP-2519 (High) open, AP-2518 blocks AP2496_001, 004–007 and 009. Story result comment posted (Jira comment 19451); status QC and assignee unchanged.
- Environment: Dev (v2dev) by the user's decision. The six BLOCKED cases name AP-2518 (roadside "Generate Contract" HTTP 500); AP2496_009 also lacks a known quote id of another dealership. They are re-run with "AP-2496 --from s4" once AP-2518 is fixed.

**Left behind**
- Test data on Dev: quotes 6484–6489 (client inboxes `client.stage.961` to `client.stage.966@yopmail.com`). No contract was created. Quotes 6040 and 6480 and admin contracts 10, 11, 14, 15, 16 were only read.
- Observations that are not failures: saving a Permaplate product creates no contract on Dev; the remove action is the row menu's "Delete", confirmed by "Yes, cancel the product" (Q-010); the quote page shows no "finalized" state (Q-001); the action sits once under Subtotal in "Summary of products", French label "Télécharger tous les documents" (Q-005); it is shown on archived quote 6040 (Q-009); the Chubb contract PDF of quote 6480 also returns HTTP 500 on Dev.
- Knowledge files added or changed: None in this run.

**Files**
- [AP-2496_test-report.md](qa-artifacts/5-testing-report/AP-2496_test-report.md)
- [AP-2496_bug-report.md](qa-artifacts/5-testing-report/AP-2496_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2496_2026-11-02.md)
- [run state](qa-artifacts/.pipeline/AP-2496.md)

## Automation
- Spec: `playwright-automation/src/tests/dealer/downloadAllDocuments_AP2496.spec.ts`, tag `@AP-2496` (Dev only, read-only on quotes 6040, 6485, 6486; nothing left on Dev).
- 2 of 2 PASSED cases automated — 2 passing, 0 fixme (lint pass; 4 of 4 with `--repeat-each=2`; reviewer R5 APPROVE).
- Not automated: AP2496_008 — FAILED manually (AP-2519). AP2496_001, 004, 005, 006, 007, 009 — BLOCKED manually by AP-2518.
- PR skipped: gh CLI not installed
