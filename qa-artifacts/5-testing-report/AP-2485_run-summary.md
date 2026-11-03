# Run Summary — AP-2485: [BUG-001][AP2471_004] — Switching a 12-month earning curve back to Pro-Rata keeps the previous type's factors
Updated: 2026-11-01T03:40:41Z · Run folder: no-sprint · Environment: Dev (v2dev) · Stages run: s5 → s7 (--from s5; s4 ran earlier on Dev, 03:31:27Z–03:34:29Z) · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2485: Switching a 12-month earning curve back to Pro-Rata keeps the previous type's factors
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 1 REQ (bug re-test — steps to reproduce) · 0 High risks
 Test cases   : 3 designed · 0 proposed by review
 Execution    : 3 PASS · 0 FAIL · 0 BLOCKED
 Bugs         : 0 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS
 Verdict      : PASS
 Tickets      : AP-2485 → Done · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2485 PASS — 3 of 3 test cases passed on Dev (v2dev), meeting the 90% threshold. 0 bugs filed. Ticket comment posted and verified (comment 19439), and AP-2485 moved from QC to Done.

**What passed**
- Earning curve create page: a 12-month curve switched from "Rule of 78" back to "Pro-Rata" now shows 0.0833 on every row, and the saved curve (#14) keeps those Pro-Rata values when reopened — the bug's own steps no longer reproduce it.
- Reverse rule of 78 and longer terms: switching from "Reverse rule of 78" back to "Pro-Rata" at 12 months regenerates correctly, and a 24-month curve still switches correctly (0.0417 on every row).
- Earning curve edit page: an existing 12-month Rule of 78 curve (#15) changed to "Pro-Rata" saves Pro-Rata values under the same id, with no duplicate row.

**Failures**
None.

**Decisions made**
- Gate A: not applicable — s1 was skipped by the bug re-test flow.
- Gate B (rule B3, by the reviewer): executed the current cases — s3b skipped, so no gaps and no High proposals (R2 APPROVE).
- Gate C: not reached — no failures (R3 APPROVE, 3 PASS / 0 FAIL / 0 BLOCKED).
- Gate D (rule §3.2 "All PASS", automatic, by the reviewer R4 APPROVE): AP-2485 → Done, re-test comment 19439 posted; assignee unchanged because a passing re-test re-assigns no one.
- Environment: executed on Dev (v2dev) by the user's decision for this batch, not on staging; the test report and ticket comment both say "Tested on: Dev (v2dev)".
- Run folder: no-sprint (reviewer rule E3 — the ticket has no sprint or fix version).
- Credential cleanup: the test-case file's Login row now points to the `env` source instead of holding the admin password in clear text (R3 finding F-2), with a Revisions row; no step changed, so no case was re-run.

**Left behind**
- Test data on Dev (v2dev): earning curve #14 `QA-AP2485-Repro-033220` and earning curve #15 `QA-AP2485-Edit-033346` — earning curves have no delete control.
- Observations that are not failures: 60-month curves were not re-checked (24 months stands in for the non-default terms); only the final state of each case was screenshotted; the admin login page logs `ReferenceError: $ is not defined` on load, unrelated to this ticket.
- Knowledge files added or changed: None.

**Files**
- [AP-2485_test-report.md](qa-artifacts/5-testing-report/AP-2485_test-report.md)
- [AP-2485_bug-report.md](qa-artifacts/5-testing-report/AP-2485_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2485_2026-11-01.md)
- [run state](qa-artifacts/.pipeline/AP-2485.md)

## Automation
- Spec: playwright-automation/src/tests/admin/earningCurveType_AP2485.spec.ts · tag `@AP-2485` (run on Dev (v2dev), the base URL in the framework's gitignored `.env`; reviewer R5 APPROVE, 6/6 passing over 2 repeats).
- 3 of 3 PASSED cases automated — 3 passing, 0 fixme.
- Not automated: none.
- PR skipped: gh CLI not installed. The 3 automated runs also left 6 more `QA-AP2485-Repro-*` / `QA-AP2485-Edit-*` curves on Dev.
