# Run Summary — AP-2374: Status Change email notification: Add notify email and client email
Updated: 2026-11-01T17:34:00Z · Run folder: 3.6.0 · Stages run: s5 → s7 · Run status: complete · Tested on: Dev (v2dev)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2374: Status Change email notification: Add notify email and client email
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 5 REQ · 1 High risks
 Test cases   : 10 designed · 8 proposed by review
 Execution    : 4 PASS · 1 FAIL · 5 BLOCKED
 Bugs         : 1 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS
 Verdict      : FAIL
 Tickets      : AP-2374 unchanged (QC) · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2374 FAIL — 4 of 10 test cases passed on Dev (v2dev), missing the 90% threshold (40%). 1 bug filed (AP-2509). Ticket comment 19445 posted and verified; the story stays in QC.

**What passed**
- Unticked "Notify by email": the new status is saved and no email is sent (AP2374_007).
- A claim with no notify email opens the Change status form and the recipient field holds only the client's email, with no stray comma (AP2374_008).
- An invalid address or an emptied recipient list is saved without an error page and emails nobody (AP2374_009); no validation message is shown (Q-004, recorded).
- A claim with no files still sends the "Claim updated" email, carrying only the claim PDF (AP2374_010).

**Failures**
- AP2374_001 — the "Notify by email" checkbox and the recipient field appear only on the Authorized and Refused forms; Pending shows "Notify customer by email", unticked; Created, Submitted, Preapproved, Accepted by Dealer, Paid and Cancelled show neither. Gate C: filed as AP-2509 (rule C4; Medium, assigned to Ken Nguyen, linked Relates AP-2374, 4 screenshots embedded).

**Decisions made**
- Gate A (rule A2, reviewer R1, earlier run): Q-001 posted in comment 19433 and continued — 1 Blocking, 8 Judgement, 1 Info.
- Gate B (rules B1 then B3, reviewer R2, earlier run): one AC gap promoted, then executed the reworked cases.
- Gate C (rule C4, reviewer R3 PARK of AP2374_002–004 only): AP2374_001 filed new as AP-2509 — no open bug names the Change status form. Park: Q-010 posted on AP-2374 and raised to Blocking in the analysis; AP2374_002–004 stay BLOCKED.
- Gate D (rules, automatic, reviewer R4 APPROVE): AP-2374 not moved — pass rate 40% (needs 90%), Q-001 and Q-010 Blocking and unanswered. AP-2509: no action (new, in Backlog).
- Environment: Dev (v2dev) by the user's decision. Two extra screenshots (Pending and Paid forms on claim 331, opened and closed without saving) were taken at s5 for the bug, as review R3 F-4 asked.

**Left behind**
- Test data on Dev: quote 6454 (quote 6455 abandoned), contract 26df1-844 (warranty 844, invoice #937), claims 331 and 332; Yopmail inboxes client.stage.930 (empty) and client.stage.931. The automation runs (s8) then added 9 status changes to each of claims 331 and 332 (notes `QA-AP2374-<case>-<epoch ms>`) and 9 "Claim updated" emails for claim 332 to client.stage.931.
- Observations that are not failures: admin claim "Add attachment" returns HTTP 500 on Dev (2 of 2 tries) — out of scope, not filed, blocks AP2374_006. Q-001 (comment 19433) and Q-010 (comment 19445) wait for Ken Nguyen; re-run with "AP-2374 --from s4" once answered.
- Knowledge files added or changed: None in this run (claims.md was added at s4).

**Files**
- [AP-2374_test-report.md](qa-artifacts/5-testing-report/AP-2374_test-report.md)
- [AP-2374_bug-report.md](qa-artifacts/5-testing-report/AP-2374_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2374_2026-11-01.md)
- [run state](qa-artifacts/.pipeline/AP-2374.md)

## Automation
- Spec: `playwright-automation/src/tests/admin/claimStatusNotify_AP2374.spec.ts`, tag `@AP-2374` (runs on Dev only; reuses claims 331 and 332).
- 4 of 4 PASSED cases automated — 4 passing, 0 fixme (`--repeat-each=2`: 8 passed, no flaky tests; reviewer R5 APPROVE, 3 minor).
- Not automated: AP2374_001 — FAIL (AP-2509); AP2374_002–004 — BLOCKED by Q-010; AP2374_005 — BLOCKED by Q-001; AP2374_006 — BLOCKED by the attachment upload HTTP 500.
- PR skipped: gh CLI not installed.
