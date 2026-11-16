# Run Summary — AP-2428: Dealer Permaplate Contract
Updated: 2026-11-15T09:18Z · Run folder: 5.0.0 · Stages run: analyze → analyze (knowledge lookup re-run) · Run status: stopped_at_gate

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2428: Dealer Permaplate Contract
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 8 REQ · 5 High risks (3 now settled: Q-001 and Q-002 Accepted, Q-003 Answered)
 Test cases   : 15 designed (2026-11-01) · not re-designed in this run
 Execution    : not run in this run (last run 2026-11-02 on Dev: 9 PASS · 4 FAIL · 2 BLOCKED)
 Bugs         : 0 filed · 0 linked to existing · 0 not a bug (AP-2512 to AP-2515 untouched)
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS
 Verdict      : — (not reached; last verdict FAIL on 2026-11-02)
 Tickets      : AP-2428 unchanged (QC) · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : analyze (--until analyze; Gate A is next, reviewed by qa-reviewer R1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Stopped:** at analyze. The run was dispatched with --until analyze, and Gate A is next, reviewed by the orchestrator's qa-reviewer (R1). Resume with "AP-2428 --from plan" once Gate A is approved.

**What passed**
- Not run in this run. The analysis was re-run only to apply the new knowledge lookup (Step 3c) to every open question. The browser was not used.
- Lookup results: AP-2456 and AP-2506 answer Q-003. The contract form shows no Retail price, Subtotal, Taxes or Grand Total; its Program Summary ends with a "Total" line. AP-2506 also answers Q-004: the "Generate Contract" control is a row action on the quote details page.
- No Story or Task defines Q-001, Q-002 or Q-005 to Q-009, so the build's current behaviour is accepted as the expected result. Year is the vehicle's year ("2008"). The form shows no tax line, and the invoice adds 14.975 % Québec taxes to the 225.00$ cost. The other accepted values come from the 2026-11-02 execution log.

**Failures**
- None in this run. The four failures of 2026-11-02 (AP2428_005, _007, _010, _012) and their bugs AP-2512 (High), AP-2513, AP-2514 and AP-2515 are unchanged and were not touched.

**Decisions made**
- Gate A: not decided here. It is due next and goes to the orchestrator's qa-reviewer (R1). Questions now: 0 Blocking Open (Q-001 and Q-002 Accepted, Q-003 Answered); Judgement: Q-004 Answered, Q-005 to Q-009 Accepted, Q-010 Open; Info: Q-011 and Q-012 Open. Q-010 to Q-012 are not about product knowledge: the PDF content is shown only in unread attachments, one question asks about fix status, and one is a library note. Nothing was posted to Jira.
- Stages plan through update-ticket were marked pending as stale. AP2428_004 and AP2428_008 (BLOCKED until now) can be redesigned with the new expected results at the next design dispatch.
- For Gate C later: AP-2506 lists the Program Summary money line as "Total". That may make AP-2515 (AP2428_007, "no Cost Price label") a "not a bug" case under rule C1. It is recorded in the run state, not acted on.
- Environment: Dev (execution_env), not used. Run folder 5.0.0 from the fix version.

**Left behind**
- Test data on Dev: none created in this run.
- Observations that are not failures: AP-2428 carries QA comment 19538 (2026-11-08), which re-posted Q-001 to Q-010 with screenshots. It was not in the capture and is now recorded there. Step 3c now says Accepted questions are never posted, and the comment was left as it is.
- Knowledge files added or changed: None.

**Files**
- [requirements analysis](qa-artifacts/1-requirements-analysis/AP-2428_requirements-analysis.md)
- [requirement capture](requirements/AP-2428-dealer-permaplate-contract.md)
- [AP-2428_test-report.md](qa-artifacts/5-testing-report/AP-2428_test-report.md) (2026-11-02, stale)
- [AP-2428_bug-report.md](qa-artifacts/5-testing-report/AP-2428_bug-report.md) (2026-11-02)
- [execution log](qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md)
- [run state](qa-artifacts/.pipeline/AP-2428.md)

## Automation
- Spec: `playwright-automation/src/tests/dealer/permaplateContract_AP2428.spec.ts`, tag `@AP-2428` (Dev v2dev only; read-only on Dev quotes 6456, 6458 and 6459; AP2428_014 changes option 20's Dealer Cost and restores it in `finally`). Reviewer R5: APPROVE, 2 minor findings.
- 7 of 9 PASSED cases automated — 7 passing, 0 fixme (lint pass; `--repeat-each=2`: 14 passed, no flaky tests).
- Not automated: AP2428_009 — passed, but every run would leave a new quote, contract and invoice on Dev. AP2428_015 — same reason. AP2428_005, _007, _010, _012 — FAIL (AP-2512 to AP-2515). AP2428_004, _008 — BLOCKED (Q-001–Q-003).
- PR skipped: gh CLI not installed. Four new files left uncommitted for the QA: src/pages/dealerPortal/PermaplateContractPage.ts, src/pages/adminPortal/AdminPermaplateOptionPage.ts, src/flows/PermaplateContractFlow.ts, src/tests/dealer/permaplateContract_AP2428.spec.ts.
