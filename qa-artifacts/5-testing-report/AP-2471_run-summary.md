# Run Summary — AP-2471: Admin: Earning Curve management
Updated: 2026-11-01T19:27:00Z · Run folder: no-sprint · Stages run: s5 → s7 (s4 earlier the same day) · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2471: Admin: Earning Curve management
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 8 REQ · 4 High risks (all now closed by observation on Dev)
 Test cases   : 17 designed · 10 proposed by review (2 promoted)
 Execution    : 16 PASS · 0 FAIL · 0 BLOCKED (1 SKIPPED)
 Bugs         : 0 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS
 Verdict      : PASS
 Tickets      : AP-2471 → Ready for release (assigned to Ken Nguyen) · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2471 PASS — 16 of 17 test cases passed on Dev (v2dev) (16 of the 16 that ran, 100%), meeting the 90% threshold. 0 bugs filed. Ticket comment posted and verified (comment 19448), and the story was moved to Ready for release and assigned to Ken Nguyen.

**What passed**
- Menu and list: the "Earning Curves" item sits under the Risk Management section and opens a list with the six required columns and an Edit action on every row.
- Calculations: Pro-Rata, Rule of 78 and Reverse Rule of 78 give exactly the formula's values for 1, 12, 24, 36 and 60 months, and the cumulative column always ends at 100%.
- Custom curves: typed factors are editable, the cumulative recalculates as you type, and a saved curve reopens with exactly what was entered.
- Save and edit: a new curve appears at the top of the list, and editing a curve updates the same record without creating a duplicate.
- The first cycle's bugs stay fixed: switching a 12-month curve back to Pro-Rata now recalculates (AP-2485), and an empty Custom factor shows a field message instead of an error page (AP-2486).

**Failures**
None.

**Decisions made**
- Gate A (rule A2): the Blocking questions Q-001 and Q-002 were posted on 2026-11-01 (comment 19435) and testing continued; on 2026-11-02 the user decided every open question is answered by what Dev does.
- Gate B (rule B2): the two High review proposals were promoted as AP2471_016–017 before execution.
- Gate C (rules —): not reached — no failures (reviewer R3 APPROVE: 16 PASS, 0 FAIL, 1 SKIPPED).
- Gate D (rules, automatic, reviewer R4 APPROVE): AP-2471 → Ready for release, assigned to Ken Nguyen — pass rate 100%, AP-2485 and AP-2486 are Done, no Blocking question open.
- Environment: executed on Dev (v2dev) by the user's decision; run folder no-sprint (no sprint, no fix version). AP2471_015 (delete) SKIPPED because Dev has no delete control.

**Left behind**
- Test data on Dev (v2dev): earning curves #32–#37 (`QA-AP2471-Custom-190721`, `QA-AP2471-Edited-190835`, `QA-AP2471-Neg-Range-190916`, `QA-AP2471-Neg-Custom90-191022`, `QA-AP2471-Switch-191209`, `QA-AP2471-Shorten-191304`); they cannot be deleted, and #34–#37 hold invalid values on purpose.
- Observations that are not failures: "Is Enabled?" is a checkbox, while the acceptance criterion says "Yes/No toggle".
- Observations that are not failures: there is no delete for earning curves, although the user story promises it.
- Observations that are not failures: an inverted odometer range, Custom totals other than 100% and a negative factor all save without a warning.
- Observations that are not failures: the ticket's Reverse Rule of 78 example still shows 53.85% at month 8 (the formula gives 46.15%).
- Knowledge files added or changed: None in this run (s5–s7).

**Files**
- [AP-2471_test-report.md](qa-artifacts/5-testing-report/AP-2471_test-report.md)
- [AP-2471_bug-report.md](qa-artifacts/5-testing-report/AP-2471_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md)
- [run state](qa-artifacts/.pipeline/AP-2471.md)

## Automation
- Spec: `playwright-automation/src/tests/admin/earningCurveManagement_AP2471.spec.ts`, tag `@AP-2471` (report: qa-artifacts/6-automation/AP-2471_automation-report.md).
- 16 of 16 PASSED cases automated — 16 passing, 0 fixme (reviewer R5 APPROVE). Each run leaves 7 undeletable earning curves on Dev; this run's two spec runs left 14 (`QA-AP2471-*-<epoch ms>`).
- AP2471_015 — not automated: SKIPPED manually, Dev has no delete control.
- PR skipped: gh CLI not installed.
