# Run Summary — AP-2225: Dealer Area: AutoShield create contract
Updated: 2026-11-01T16:52:00Z · Run folder: 3.0.0 · Stages run: s5 → s7 · Run status: complete
Tested on: Dev (v2dev)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2225: Dealer Area: AutoShield create contract
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 6 REQ · 3 High risks
 Test cases   : 15 designed · 8 proposed by review (3 promoted)
 Execution    : 1 PASS · 7 FAIL · 7 BLOCKED (Dev, v2dev)
 Bugs         : 1 filed (AP-2508) · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run —
 Verdict      : FAIL
 Tickets      : AP-2225 unchanged (QC) · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2225 FAIL — 1 of 15 test cases passed on Dev (v2dev), missing the 90% threshold. 1 bug filed (AP-2508). Ticket comment posted and verified.

**What passed**
- AutoShield product list (AP2225_001): the Road side protection page of a new quote on Dev lists five AutoShield products, each with a price, so Dev is connected to AutoShield and a dealer can see what coverage is on offer.

**Failures**
- AP2225_002 — the page shows only VIN (correct) and Year; Stock Number, Condition, Odometer Reading, the four dates, Interest Rate, Sale Price (CAD), Financing Company and the financing amounts are missing. Gate C: filed as AP-2508.
- AP2225_003 — the page has no client section or client field, so the dealer cannot check the client details that go on the contract. Gate C: filed as AP-2508.
- AP2225_005 — there is no Odometer Reading or Stock Number field to override, so "override and Save" cannot be exercised. Gate C: filed as AP-2508.
- AP2225_006 — there is no Sale Price (CAD) or Delivery Date field; the only price field is the AutoShield "Policy Sale price". Gate C: filed as AP-2508.
- AP2225_007 — the only button is "Save" ("Sauvegarder" in French); there is no "Generate Contract" / "Générer le contrat" button and no "Save and Generate Contract". Gate C: filed as AP-2508.
- AP2225_008 — there is no Odometer Reading field to empty. Gate C: filed as AP-2508.
- AP2225_014 — the dealer cannot override odometer, stock number or sale price, because none of those fields exists, and no contract button exists. Gate C: filed as AP-2508.
- These fields and the "Save and Generate Contract" button were on staging on 2026-07-25 (QA comment on AP-2423) and 2026-08-29 (staging page map) and are missing from the current build on Dev, which carries the later AP-2423, AP-2424 and AP-2498 changes. AP-2508 asks the developer whether they were removed on purpose and, if so, which control now creates the contract.

**Decisions made**
- Gate A (rule A3, by the reviewer, earlier run): continue — 12 open questions (9 Judgement, 3 Info), none Blocking; none posted.
- Gate B (rule B1, by the reviewer, earlier run, round 3 independent APPROVE): execute the current cases.
- Gate C (rule C4, by the independent reviewer R3, APPROVE 0/0/4): one new bug for all seven FAILs — no sentence in the capture or a non-developer comment says the page should lack these fields or the button (C1 not met), and the open-bug search for "road side", "roadside", "autoshield" and "generate contract" found only AP-2488, AP-2461 and AP-2459 on other screens (C2, C3 not met). Filed AP-2508 (High), relates to AP-2225, assigned to Ken Nguyen (bug_new_assign), six screenshots embedded and verified. The planned "no standalone Save" bug was not filed, because Save exists on Dev.
- Gate D (rules, automatic; R4 by the reviewer inline, APPROVE 0/0/1): AP-2225 not moved — pass rate 6.7% (needs 90%) and AP-2508 (High) blocks AP2225_009–013 and AP2225_015. Status stays QC, assignee Ken Nguyen. Result comment posted (id 19444) and read back with all 15 rows. No bug ticket action: AP-2508 is new (Backlog).
- E4 answer applied (R3): "Save" was never pressed in place of Generate Contract. AP2225_009–013 and AP2225_015 stay BLOCKED by AP-2508; re-run them with "AP-2225 --from s4" once a build with a contract-generating control is on the test environment or a developer names that control on AP-2508.
- Environment: Dev (v2dev) by the user's decision. R3 corrections applied in the bug and the test report: the failures are described as missing from the current build, not as Dev lagging behind staging (F-1); contracts #2697 and #2698 were created on staging, not on Dev (F-2); AP-2508 is named as the blocker of AP2225_009–013 and _015 (F-3).
- s4c skipped: Gate C has no C1 ("not a bug") decision.

**Left behind**
- Test data on Dev (v2dev): quotes 6451, 6452 and 6453. No AutoShield contract was created; no configuration changed.
- Observations that are not failures: AP2225_004 is BLOCKED because Dev requires a Delivery date on the quote's vehicle step; from the quote hub the Roadside Protection pencil opens the page in a modal; the Vehicle box's Make picker shows "Choose" for a Ford Focus; every Road side protection page warns that contracts #2697 and #2698 (created on staging) exist for VIN 1FAHP35NX8W239204.
- Knowledge files added or changed: None in this run (s5 → s7).

**Files**
- [AP-2225_test-report.md](qa-artifacts/5-testing-report/AP-2225_test-report.md)
- [AP-2225_bug-report.md](qa-artifacts/5-testing-report/AP-2225_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/3.0.0/execution-log_AP-2225_2026-11-01.md)
- [run state](qa-artifacts/.pipeline/AP-2225.md)

## Automation
- Spec: `playwright-automation/src/tests/dealer/roadSideProtection_AP2225.spec.ts`, tag `@AP-2225` (runs on Dev (v2dev) only; read-only — never presses Save or any Generate button).
- 1 of 1 PASSED cases automated — 1 passing, 0 fixme (lint pass; `--repeat-each=2` 2/2 passed; reviewer R5 APPROVE 0/0/1).
- Not automated: AP2225_002, _003, _005, _006, _007, _008, _014 — FAIL manually (AP-2508); AP2225_004 — BLOCKED (Dev requires a Delivery date); AP2225_009–013, _015 — BLOCKED by AP-2508.
- PR skipped: gh CLI not installed.
