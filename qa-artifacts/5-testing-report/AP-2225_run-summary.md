# Run Summary — AP-2225: Dealer Area: AutoShield create contract
Updated: 2026-11-15T09:45:11Z · Run folder: 3.0.0 · Stages run: analyze only (knowledge lookup) · Run status: stopped_at_gate · Environment: Dev (not used — no browser in this run)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2225: Dealer Area: AutoShield create contract
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 6 REQ · 3 High risks · 13 questions (3 Answered, 8 Accepted, 2 Open, 0 Blocking)
 Test cases   : 15 designed (unchanged in this run) · 8 proposed by review (3 promoted)
 Execution    : not run this time — kept 2026-11-01 results on Dev (v2dev): 1 PASS · 7 FAIL · 7 BLOCKED
 Bugs         : 0 filed · 0 linked to existing · 0 not a bug (AP-2508 stays open, not touched)
 Corrected    : 0 test cases rewritten · 0 retired · re-run —
 Verdict      : — (report stage not run; the 2026-11-01 verdict FAIL stands)
 Tickets      : AP-2225 unchanged (QC, Ken Nguyen) · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : analyze (--until analyze; Gate A waits for the reviewer R1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Stopped:** at analyze. The batch of 2026-11-15 asked for every open question to be double-checked against Jira Stories and Tasks. The re-checked analysis now waits for its independent review (Gate A).

**What passed**
- Nothing was executed in this run. Kept from 2026-11-01 on Dev: the Road side protection page lists five AutoShield products, each with a price (AP2225_001).

**Failures**
- None in this run. The seven 2026-11-01 FAILs (AP2225_002, _003, _005, _006, _007, _008, _014) stand under bug AP-2508 (High, Backlog), which this run did not touch.

**Decisions made**
- Knowledge lookup (analysis Step 3c). Each open question was searched in Jira Story and Task tickets, at any status, with at least two word sets. The plausible hits were read. Nothing was posted to Jira.
  - Answered by a Story: Q-006 (AP-2226: the AutoShield Lender ID is a field on the Admin financing-company edit page), Q-012 (AP-2431: the Road side protection contracts list shows every dealer program that has a contract ID) and Q-013, split out of Q-008 (AP-2188: every product the AutoShield quote returns is listed, each tier labelled tier + term + suggested price).
  - Accepted, because no Story or Task defines them: Q-001, Q-003, Q-004, Q-005, Q-007, Q-008, Q-009 and Q-010. The behaviour the build shows is accepted as the expected result. Each takes the value recorded in the 2026-11-01 execution log, or is recorded at the next execution.
  - Still Open, because they are not knowledge questions: Q-002 asks whether the reporter's own Purchase Type mapping is a mistake, and Q-011 asks how an environment is set up. No Blocking question is open.
- The acceptance criteria still win over the build:
  - The page must show client fields (Q-001) and a 'Generate Contract' button (Q-003), so AP2225_003 and AP2225_007 stay FAIL.
  - All 17 contract-page items stay required (Q-008).
  - An error page or an HTTP 5xx is still a FAIL (Q-005, Q-007).
- Two delivered later Stories replace two points of the 2025 text. Both are Done and explicitly about the Road side protection page:
  - AP-2241 removes the Classification Date field.
  - AP-2240 says "The backend should not create new autoshield lenders VIA the API anymore". This replaces the create-lender step.
- AP-2505 (QC, not delivered) describes a separate Generate Contract page. It changes no acceptance criterion and is recorded only as a note in the run state.
- The orchestrator made this ticket analysis-only in this batch. Stages s2 to s7 were not set back to pending, and nothing was executed. A run-state note tells the next design pass to:
  - turn the record-only steps on the Accepted questions into record-and-accept steps;
  - revise AP2225_013, which expects a new lender ID (AP-2240);
  - drop Classification Date from AP2225_002 (AP-2241).

**Left behind**
- Test data on Dev: none created in this run. The 2026-11-01 records remain: quotes 6451, 6452 and 6453, with no AutoShield contract.
- Ticket changes since the 2026-11-01 capture: no change to the description or the acceptance criteria. The only new activity is the QA account's comments 19444 (2026-11-01) and 19527 (2026-11-08), plus the AP-2508 link. They are recorded in the capture's new section "Ticket changes since capture — 2026-11-15".
- Knowledge files added or changed: none.

**Files**
- [requirements analysis](qa-artifacts/1-requirements-analysis/AP-2225_requirements-analysis.md) (re-run 2026-11-15)
- [requirement capture](requirements/AP-2225-dealer-area-autoshield-create-contract.md) (section added 2026-11-15)
- [AP-2225_test-report.md](qa-artifacts/5-testing-report/AP-2225_test-report.md) (2026-11-01)
- [AP-2225_bug-report.md](qa-artifacts/5-testing-report/AP-2225_bug-report.md) (2026-11-01)
- [execution log](qa-artifacts/4-execution-results/3.0.0/execution-log_AP-2225_2026-11-01.md) (2026-11-01)
- [run state](qa-artifacts/.pipeline/AP-2225.md)

## Automation
- Spec: `playwright-automation/src/tests/dealer/roadSideProtection_AP2225.spec.ts`, tag `@AP-2225`. It runs on Dev (v2dev) only and is read-only: it never presses Save or any Generate button.
- 1 of 1 PASSED cases automated: 1 passing, 0 fixme. Lint passed, `--repeat-each=2` passed 2 of 2, and reviewer R5 approved with 0/0/1.
- Not automated:
  - AP2225_002, _003, _005, _006, _007, _008 and _014 FAILED manually (AP-2508).
  - AP2225_004 is BLOCKED because Dev requires a Delivery date.
  - AP2225_009 to _013 and _015 are BLOCKED by AP-2508.
- PR skipped: the gh CLI is not installed.
