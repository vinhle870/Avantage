# Run Summary — AP-2497: Add extended warranty to a quote: capture missing vehicle fields instead of a dead end
Updated: 2026-11-01T22:58:00Z · Run folder: no-sprint · Stages run: s5 → s7 (this run; intake → s4 ran earlier, s4c skipped) · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2497: Add extended warranty to a quote: capture missing vehicle fields instead of a dead end
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 5 REQ · 2 High risks
 Test cases   : 15 designed · 10 proposed by review (1 promoted as AP2497_015)
 Execution    : 4 PASS · 11 FAIL · 0 BLOCKED
 Bugs         : 3 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run —
 Verdict      : FAIL
 Tickets      : AP-2497 unchanged (QC) · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2497 FAIL — 4 of 15 test cases passed on Dev (v2dev), missing the 90% threshold (27%). 3 bugs filed. Ticket comment posted and verified (comment 19452); the story stays in QC.

**What passed**
- Saving from the add-extended-warranty window: values typed in the vehicle form are saved on the vehicle and survive a reload (AP2497_005 step 4–5, AP2497_006 step 4–5, AP2497_007).
- Eligibility refresh: after "Update vehicle" the program list is recalculated in the same window from a new server response, without leaving the quote page (AP2497_015).
- Invalid input: a future year, a 16-digit or decimal mileage and an empty Brand or Model are refused without an error page, and no invalid or partial value is ever saved (AP2497_012, 013, 014; step 5 of 008–011).

**Failures**
- AP2497_001 — the form has only five fields (no Vehicle type) and opens folded behind "Edit". Gate C: filed as AP-2520 (and AP-2521).
- AP2497_002 — for a complete vehicle the form is hidden behind "Edit" when the window opens. Gate C: filed as AP-2521.
- AP2497_003 — only five controls exist; Vehicle type is missing. Gate C: filed as AP-2520.
- AP2497_004 — five fields prefill correctly, but Vehicle type cannot be shown. Gate C: filed as AP-2520.
- AP2497_005 — after "Update vehicle" with 25000 km the value is saved and the results refresh, but the form folds away again (and has five fields). Gate C: filed as AP-2521 (and AP-2520).
- AP2497_006 — Vehicle type cannot be corrected and the form folds away after the submit; the other five values are saved. Gate C: filed as AP-2520 and AP-2521.
- AP2497_007 — submitting unchanged values folds the form away (five fields). Gate C: filed as AP-2521 (and AP-2520).
- AP2497_008 — an empty Year or Kilometers is refused, but the error is hidden inside the folded form. Gate C: filed as AP-2522.
- AP2497_009 — Kilometers `15k` is refused with a hidden error. Gate C: filed as AP-2522.
- AP2497_010 — Year `-2020` and Kilometers `-500` are refused with hidden errors. Gate C: filed as AP-2522.
- AP2497_011 — Model Camry with an empty Year is not saved, but the Year error is hidden. Gate C: filed as AP-2522.

**Decisions made**
- Gate A (rule A3, by the reviewer — R1 APPROVE): continue — 0 Blocking, 9 Judgement, 2 Info questions; none posted.
- Gate B (rule B2, by the reviewer — R2 APPROVE): High proposal #1 promoted as AP2497_015, then executed; Medium/Low proposals not promoted.
- Gate C (rule C4 for all 11 FAILs, by the reviewer — R3 round 2 APPROVE): file new ×3. C1 does not hold (AP-2497 has 0 comments; no capture sentence calls the behaviour intended); C2/C3 do not hold (no open bug names the add-extended-warranty modal's vehicle form). AP-2520 (Vehicle type missing) for 001, 003, 004, 006 (+005, 007); AP-2521 (form collapsed) for 002, 005, 006, 007, quoting both acceptance-criterion sentences and leaving the call to the author; AP-2522 (hidden field error) for 008–011 with 012–014 as extra reproductions, linked *relates to* AP-2521. All three are Medium, linked *relates to* AP-2497 and assigned to Ken Nguyen.
- Gate D (rules, automatic — R4 APPROVE inline): AP-2497 not moved: pass rate 27% (needs 90%); story result comment posted; assignee unchanged. No action on AP-2520–2522 (Backlog, not in the QA status).
- Environment: executed on Dev (v2dev) by the user's decision; stated in each bug, the test report and the ticket comment. Run folder no-sprint (no sprint, no fix version). s4c skipped (no "Not a bug" decision).

**Left behind**
- Test data on Dev (v2dev): vehicles 1082–1097, quotes 6490–6505 (clients client.stage.970–984). Vehicles 1085 and 1096 at 25000 km, 1086 now Honda Civic 2019, 48000 km, Diesel, 1093 at 0 km; quote 6491 holds an extended warranty without a contract.
- Observations that are not failures: the ticket's central path (a vehicle with no mileage, Kilometers filled in the window, the "no eligible program" notice replaced by programs) was only observed on extra vehicle 1097 / quote 6505, not run as a test case (R3 F-5) — the re-test should make the vehicle through `/quote/new/edit-vehicle`. AP-2521 may be deliberate (a no-mileage vehicle opens expanded). Saving changes the inventory vehicle itself (Q-007). The Honda Model list has a blank option and "Civic" twice.
- Knowledge files added or changed: None in this run (the s4 run added the AP-2497 Dev section to `qa-artifacts/qa-docs/quote-creation.md`; the navigation index row is still not refreshed — R3 F-7).

**Files**
- [AP-2497_test-report.md](qa-artifacts/5-testing-report/AP-2497_test-report.md)
- [AP-2497_bug-report.md](qa-artifacts/5-testing-report/AP-2497_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md)
- [run state](qa-artifacts/.pipeline/AP-2497.md)

## Automation
- Spec: `playwright-automation/src/tests/dealer/warrantyVehicleForm_AP2497.spec.ts`, tag `@AP-2497` (runs only against v2dev); new files only: `src/pages/dealerPortal/WarrantyVehicleFormModal.ts`, `src/flows/WarrantyVehicleFormFlow.ts`. Report: `qa-artifacts/6-automation/AP-2497_automation-report.md`; reviewer R5 APPROVE (inline, 0/0/1).
- 4 of 4 PASSED cases automated — 4 passing, 0 fixme (lint pass; 4/4 in two consecutive runs). Each run creates 4 vehicles, 4 clients and 4 quotes on Dev; the two runs left vehicles 1098–1105 and quotes 6506–6513.
- Not automated: AP2497_001–011 — failed manually (AP-2520, AP-2521, AP-2522); their expected behaviour is not confirmed until the bugs are fixed or decided.
- PR skipped: gh CLI not installed.
