# Run Summary — AP-2502: separate compliance document PDF for GC960 and 6201
Updated: 2026-11-03T05:15:00Z · Run folder: no-sprint · Stages run: s5 → s7 · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2502: separate compliance document PDF for GC960 and 6201
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 4 REQ · 0 Blocking questions (7 Judgement, 2 Info)
 Test cases   : 5 designed · 6 proposed by review (none promoted, Gate B rule B3)
 Execution    : 0 PASS · 5 FAIL · 0 BLOCKED  (Environment: Dev)
 Bugs         : 1 filed (AP-2542, Critical / Highest) · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · s4c skipped (no C1 decision)
 Verdict      : FAIL
 Tickets      : AP-2502 unchanged (QC) · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2502 FAIL — 0 of 5 test cases passed on Dev, missing the 90% threshold. 1 bug filed (AP-2542). Ticket comment posted and verified (comment 19463); AP-2502 stays in QC.

**What passed**
- Nothing at test-case level: all five cases failed at the send step.
- Supporting steps worked on Dev: the admin Chubb page saves and reads back every creditor-form selection tried, quote 6567 could be created from vehicle 915, and dealer 1380's configuration was restored after every case and equals the start-of-run state.

**Failures**
- AP2502_001, AP2502_002, AP2502_003, AP2502_004, AP2502_005 — opening the "Send compliance documents" form (`GET /compliance-documents/send?redirectUrl=...`, from Insurance Quick Quote and from Quote Details) returns HTTP 500 on Dev for every creditor-form setup tried, including the unchanged GC6201 setup (regression, AP2502_002), so no dealer can send compliance documents. Gate C: filed as AP-2542 (rule C3 resolved as "file new" by reviewer rule E2; relates to AP-2452).
- The document content (product line, GC960 footers, English GC960 file) is untested because the send form failed: the GC960 change is unproven, not disproven.

**Decisions made**
- Gate A (rule A3, earlier run): continue — 0 Blocking questions; nothing posted.
- Gate B (rule B3, R2 round 2 APPROVED, earlier run): execute the current cases — 0 uncovered ACs, 0 High proposals.
- Gate C (rule C3 → reviewer rule E2, R3 round 1 APPROVED): one new bug for all five FAILs, severity Critical (canonical `immediate`, Jira Highest), linked "relates to" AP-2502 and AP-2452. AP-2452 is a 500 on Send with a client name of 256+ characters on Staging; this one is the form never loading, on Dev, for any input.
- Gate D (rules, automatic): AP-2502 not moved — pass rate 0% (needs 90%) and AP-2542 (Critical) blocks AP2502_001–005. Comment 19463 posted with all 5 cases, the bug and all 9 open questions. AP-2542 is in Backlog, so no bug re-test action applies.
- Not filed, by the reviewer's plan: the empty dealer Form drop-down with only `GC960S:S30` (recorded under Q-001) and the admin page accepting an empty selection, after which the dealer page shows "Your account is not configured with creditors insurance. Please contact support." (recorded under Q-008).

**Left behind**
- Test data on Dev: quote 6567 (vehicle 915, client Rosalie Bouchard AP2502-004, `client.stage.2502004@yopmail.com`). Dealer 1380's configuration is at its baseline (`AP0001`; `GC6201MQ:PM30`, `GC6201MQ:PM50`, `AVPG:TGGAP`). No records were created in s5–s7.
- Observations that are not failures: Q-001 empty Form drop-down for a GC960-only dealer; Q-008 empty creditor-form selection accepted without a message.
- Knowledge files added or changed: `qa-artifacts/qa-docs/chubb-insurance.md` (dated Dev note beside the stale "S30 and M30 … have not appeared anywhere" sentence, R3 F-3), `qa-artifacts/qa-docs/compliance-documents.md` (AP-2542 reference added to the 2026-11-03 Dev block). The execution log's AP2502_005 step 2 now records the dealer-page message (R3 F-1).

**Files**
- [AP-2502_test-report.md](qa-artifacts/5-testing-report/AP-2502_test-report.md)
- [AP-2502_bug-report.md](qa-artifacts/5-testing-report/AP-2502_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2502_2026-11-03.md)
- [run state](qa-artifacts/.pipeline/AP-2502.md)

## Automation
Not run yet.
