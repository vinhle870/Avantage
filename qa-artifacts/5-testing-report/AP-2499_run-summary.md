# Run Summary — AP-2499: Add GAP/creditors insurance to a quote: embed the financing form in the add modal
Updated: 2026-11-02T00:28:00Z · Run folder: no-sprint · Stages run: s5 → s7 · Run status: complete · Tested on: Dev (v2dev)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2499: Add GAP/creditors insurance to a quote: embed the financing form in the add modal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 6 REQ · 3 High risks
 Test cases   : 13 designed · 8 proposed by review (0 promoted)
 Execution    : 5 PASS · 5 FAIL · 3 BLOCKED (Dev, v2dev)
 Bugs         : 3 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS (s4c skipped — no Not-a-bug decision)
 Verdict      : FAIL
 Tickets      : AP-2499 unchanged (QC) · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2499 FAIL — 5 of 13 test cases passed on Dev (v2dev), missing the 90% pass-rate threshold (38%). 3 bugs filed. Ticket comment posted and verified.

**What passed**
- Alert replaced: on a quote with no financing, both the GAP and the creditors "+" open a window with an empty financing form instead of "Please add a financing…" (AP2499_001, AP2499_002).
- Validation: an empty financing form shows "This value should not be blank." under each required field and stores nothing (AP2499_010); a text base amount is refused with "This value is not valid." and the stored financing stays unchanged (AP2499_011); an empty residual and date of birth are refused and nothing is stored (AP2499_012).
- Saving a new financing in the GAP window stores all eight values and moves to the GAP step without leaving the page, and a corrected base amount in the creditors window replaces the old one (the passing steps of AP2499_003 and AP2499_006).

**Failures**
- AP2499_003, AP2499_004 — once a financing exists, the financing form opens folded into one line ("Financing · 60 months · 25,000.00$ · AutoCapital Canada") with an Edit link; the stored values are correct after Edit. Gate C: filed as AP-2526 (rule C4), linked relates to AP-2499, AP-2521 and AP-2524.
- AP2499_006 — after Save in the creditors window, the window shows the whole quote page instead of the insurance step; the new amount 30000 is saved. Gate C: filed as AP-2527 (rule C4).
- AP2499_007, AP2499_008 — Get Quote reloads the whole page and closes the window, so the result never appears below the form. Gate C: filed as AP-2528 (rule C3 → reviewer rule E2), linked relates to AP-2499 and AP-2410 (which reports an error on the same Get Quote instead).

**Decisions made**
- Gate A (rule A3, by reviewer R1): continue — 0 Blocking, 11 Judgement, 4 Info questions; nothing posted at Gate A (earlier run).
- Gate B (rule B3, by reviewer R2 round 2): execute the current cases — 0 uncovered ACs, 0 High proposals (earlier run).
- Gate C (rules C4, C4, C3→E2; independent reviewer R3 round 1, which overrides the inline R3): 003+004 → new bug AP-2526; 006 → new bug AP-2527; 007+008 → new bug AP-2528. No C1 sentence in the capture or comments, so s4c was skipped.
- Gate D (rules, automatic; reviewer R4 APPROVE): AP-2499 not moved — pass rate 38% (needs 90%); status stays QC, assignee unchanged. The new bugs are in Backlog, so no bug-ticket action.
- Environment: executed on Dev (v2dev) by the user's decision; run folder no-sprint (no sprint, no fix version). Test-case files: "Blocked by" set to Q-011 for AP2499_005 and to Q-007 for AP2499_009 (R3 F-3).

**Left behind**
- Test data on Dev (v2dev): quotes 6533–6544 on vehicle 915 (dealer 1380), clients client.stage.2499001–2499012@yopmail.com; financings on 6535, 6536, 6538, 6539, 6540, 6541, 6543; Chubb creditors quotes (no contract) on 6539 and 6541; a GAP quote (no contract) on 6540.
- Observations that are not failures: Life term 999 is priced by Chubb as a 60-month term (recorded under Q-007, AP2499_009 BLOCKED); the residual is required (Q-011 raised on AP-2499, AP2499_005 BLOCKED); no Humania dealer on Dev (Q-002, AP2499_013 BLOCKED); after a save in the GAP window the page behind still says "You have not added financing details yet" until reloaded (context in AP-2526).
- Knowledge files added or changed: None in this run (the Dev section of qa-artifacts/qa-docs/quote-creation.md was written by the s4 run).

**Files**
- [AP-2499_test-report.md](qa-artifacts/5-testing-report/AP-2499_test-report.md)
- [AP-2499_bug-report.md](qa-artifacts/5-testing-report/AP-2499_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2499_2026-11-02.md)
- [run state](qa-artifacts/.pipeline/AP-2499.md)

## Automation
- Spec: `playwright-automation/src/tests/dealer/gapCreditorsFinancingForm_AP2499.spec.ts`, tag `@AP-2499` (new flow `src/flows/GapCreditorsFinancingFlow.ts`, new page object `src/pages/dealerPortal/GapCreditorsFinancingModal.ts`; no existing file changed). Report: `qa-artifacts/6-automation/AP-2499_automation-report.md`; reviewer R5 APPROVE.
- 5 of 5 PASSED cases automated — 5 passing, 0 fixme (AP2499_001, 002, 010, 011, 012; lint clean, run twice on Dev, 1.8 min each). Each run creates five quotes on vehicle 915 and one financing; no Get Quote, so no Chubb or GAP request.
- Not automated: AP2499_003, 004 (FAIL, AP-2526), 006 (FAIL, AP-2527), 007, 008 (FAIL, AP-2528), 005 (BLOCKED, Q-011), 009 (BLOCKED, Q-007), 013 (BLOCKED, Q-002) — no confirmed behaviour to assert.
- PR skipped: gh CLI not installed.
