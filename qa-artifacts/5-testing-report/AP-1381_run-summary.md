# Run Summary — AP-1381: duplicate name visual
Updated: 2026-11-01T16:18:58Z · Run folder: 1.25.0 · Stages run: s5 → s7 · Run status: complete · Tested on: Dev (v2dev)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-1381: duplicate name visual
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 2 REQ · 0 High risks
 Test cases   : 4 designed · 4 proposed by review
 Execution    : 3 PASS · 0 FAIL · 0 BLOCKED (1 SKIPPED) — Dev (v2dev)
 Bugs         : 0 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS
 Verdict      : PASS
 Tickets      : AP-1381 → Ready for release (assigned to Ken Nguyen) · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-1381 PASS — 3 of 4 test cases passed on Dev (v2dev), and the fourth was SKIPPED, so the pass rate is 100% (3 of 3 counted), meeting the 90% threshold. 0 bugs filed. Ticket comment posted and verified; AP-1381 moved to Ready for release and assigned to Ken Nguyen.

**What passed**
- Dealer portal invoice (AP1381_001): on the newest warranty invoice of dealer 1380 on Dev, invoice 934, the "To:" block names the dealer once, as "Offical VinhLe870@gmail.com" (the dealer's required Name field), and does not add the company name "Test QA staging" as a second name. The newest Permaplate invoice, 927, shows the name once too (recorded only).
- Admin portal invoice (AP1381_002): staff opening the same invoice 934 from Admin → Invoices (`/admin/invoices` → `/admin/invoice/934`) see the same "To:" block with the name once.
- Oldest invoice (AP1381_004): invoice 65, created November 25, 2020, still opens without an error and shows its dealer name ("VinhLeDealer01") once — recorded for Q-002.

**Failures**
- None. AP1381_003 (the invoice PDF) was SKIPPED by its own rule: the Dealer portal invoice page offers no PDF, only a "Print" button.

**Decisions made**
- Gate A (rule A3, by the reviewer, earlier run): continue — no Blocking question open; Q-001 answered by the reporter's 2022-08-03 comment; Q-002 and Q-003 (Judgement) not posted.
- Gate B (rule B3, by the reviewer, earlier run): execute the current four cases — no requirement gap and no High proposal.
- Gate C: not reached — no failures (R3 APPROVE, independent reviewer). The admin PDF HTTP 500 is out of scope and was neither filed nor linked.
- Gate D (rules, automatic; R4 APPROVE, run inline): AP-1381 → Ready for release, assigned to Ken Nguyen — pass rate 100% ≥ 90%, no bug, no Blocking question open. Comment 19443 posted; status and assignee read back.
- Environment Dev (v2dev), not Staging, by the user's decision; each case's own selection rule picked the Dev ids (warranty invoice 934, Permaplate invoice 927, oldest invoice 65).

**Left behind**
- Test data on Dev (v2dev): None — nothing was created or changed; only existing invoices were opened.
- Observations that are not failures: on the Admin portal, the "PDF" button of invoice 934 (`/admin/invoice/934/pdf`) showed the error page "Erreur — Désolé, l'application éprouve des difficultés techniques…". The execution log records it as HTTP 500 but does not say how that status code was read (the screenshot shows only the error page); it was seen once, on Dev only, and not retried. It is listed on AP-1381 against Q-003; if Q-003 brings the PDF into scope, retry it and check it on Staging before any bug is filed.
- Open questions for the reporter: Q-002 (should pre-fix invoices change?) and Q-003 (does the rule cover the PDF copy?), both Judgement, listed in the AP-1381 comment.
- Knowledge files added or changed: None in this run (s4 earlier added `qa-artifacts/qa-docs/billing-invoices.md` and updated `navigation-map.md` and `knowledge.md`).

**Files**
- [AP-1381_test-report.md](qa-artifacts/5-testing-report/AP-1381_test-report.md)
- [AP-1381_bug-report.md](qa-artifacts/5-testing-report/AP-1381_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/1.25.0/execution-log_AP-1381_2026-11-01.md)
- [run state](qa-artifacts/.pipeline/AP-1381.md)

## Automation
- Spec: `playwright-automation/src/tests/dealer/invoiceToBlock_AP1381.spec.ts`, tag `@AP-1381` (Dev only — skips itself unless the base URL is v2dev). Report: qa-artifacts/6-automation/AP-1381_automation-report.md.
- 3 of 3 PASSED cases automated — 3 passing, 0 fixme (repeat run 6 of 6; reviewer R5 APPROVE, 2 minor findings).
- AP1381_003 not automated: it was SKIPPED manually — the Dealer portal invoice page offers no PDF copy.
- PR skipped: gh CLI not installed.
