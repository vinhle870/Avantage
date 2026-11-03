# Run Summary — AP-2493: Cancelling a product from a quote
Updated: 2026-11-01T20:12:47Z · Run folder: no-sprint · Stages run: s5 → s7 · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2493: Cancelling a product from a quote
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 3 REQ · 2 High risks
 Test cases   : 14 designed · 8 proposed by review
 Execution    : 12 PASS · 2 FAIL · 0 BLOCKED
 Bugs         : 1 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS
 Verdict      : FAIL
 Tickets      : AP-2493 unchanged (QC) · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2493 FAIL — 12 of 14 test cases passed on Dev (v2dev), missing the 90% threshold (86%). 1 bug filed (AP-2516). Ticket comment posted and verified.

**What passed**
- Cancel action placement: a "Delete" action is offered on a product without a contract for all five products — extended warranty, Roadside Protection, Esthetic protection (Permaplate), creditor insurance and GAP — and is absent on a creditor product with a generated contract, which keeps its download link.
- Confirmation: choosing Delete always opens a confirmation window first; answering "No", pressing Escape or clicking outside closes it and leaves the product and the Subtotal unchanged.
- Cancelling: confirming deletes the product, brings back its "+" add action, and lowers the Subtotal by the product's amount (warranty, GAP); cancelling GAP leaves the creditor insurance on the same quote in place.
- Re-adding: after a cancellation a new product of the same type can be added and appears as a new row with its own values (warranty re-added with Sale price 1,800).
- An archived quote with a product opens without an error.

**Failures**
- AP2493_011 — after the 80$ Permaplate product was cancelled, the Subtotal stayed at CA$21,500.00 because it never included the 80$ in the first place. Gate C: filed as AP-2516.
- AP2493_012 — after a new 145$ Permaplate product was added, the Subtotal stayed at CA$21,500.00. Gate C: filed as AP-2516 (same root cause; the re-add itself worked).

**Decisions made**
- Gate A (rule A3): Continue — no Blocking question open (Q-001 Answered: hard delete); 7 Judgement and 2 Info questions not posted at Gate A. Decided in an earlier run.
- Gate B (rule B3): Execute the current cases — no uncovered acceptance criterion, no High proposal; 8 proposals not promoted. Decided in an earlier run.
- Gate C (rule C4 for AP2493_011 and AP2493_012, by the reviewer, R3 round 2 APPROVE): one new bug written about the Subtotal, not the cancel action — no capture sentence or non-developer comment says the Permaplate cost stays out of the Subtotal, and no open or closed bug names the quote details Subtotal.
- Gate D (rules, automatic; R4 APPROVE run inline): AP-2493 not moved: pass rate 86% (needs 90%). Result comment posted; status left in QC and assignee unchanged. AP-2516 is Medium and fails only the last step, so it is not a stopping bug. No bug-ticket action — AP-2516 is in Backlog.
- Environment: Dev (v2dev) by the user's decision; run folder no-sprint (no sprint, no fix version).

**Left behind**
- Test data on Dev (v2dev): quotes 6461–6469 (clients client.stage.947–955@yopmail.com), Chubb creditor contract AVP000169 on quote 6466 (permanent), and quote 6467's new warranty (Sale price 1,800). Quotes cannot be deleted.
- Observations that are not failures: Q-002 — the cancel action is a red "Delete" item in each row's "⋯" menu. Q-003 — the Subtotal uses the row amount (warranty sale price, Roadside policy sale price, GAP premium, creditor monthly premium); Permaplate is not counted (AP-2516). Q-004 — Delete is offered and enabled on archived quote 6245. Q-005 — modal "Cancel a product - {product}" with "Yes, cancel the product" / "No", no × icon. Q-006 — financing is not recalculated. Q-007 — the creditor premium stays 20.88$/month after the GAP is cancelled. Q-008 — the message is "The product has been cancelled". All were posted on AP-2493 for the product owner.
- Observations that are not failures: the Permaplate page saved a product with no option ticked as "Cost: CA$0.00$" (quote 6463); whether the Permaplate Subtotal gap predates AP-2493 could not be proven on Dev.
- Knowledge files added or changed: None in this run (s5–s7).
- Test data on Dev from the automation (s8): quotes 6470–6478 for vehicle 915 (clients qa.ap2493.<tc>.<timestamp>@yopmail.com), no contracts.

**Files**
- [AP-2493_test-report.md](qa-artifacts/5-testing-report/AP-2493_test-report.md)
- [AP-2493_bug-report.md](qa-artifacts/5-testing-report/AP-2493_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md)
- [run state](qa-artifacts/.pipeline/AP-2493.md)

## Automation
- Spec: `playwright-automation/src/tests/dealer/cancelQuoteProduct_AP2493.spec.ts`, tag `@AP-2493` (Dev only; skips elsewhere). Report: qa-artifacts/6-automation/AP-2493_automation-report.md.
- 12 of 12 PASSED cases automated — 12 passing, 0 fixme (lint pass; `--repeat-each=2`: 24/24, no flaky tests; reviewer R5 APPROVE, run inline).
- AP2493_011, AP2493_012 — not automated: they FAILED manually (bug AP-2516).
- PR skipped: gh CLI not installed.
- Each run creates three Dev quotes (AP2493_009, _010, _014, new yopmail clients, no contract); the runs of 2026-11-02 left quotes 6470–6478.
