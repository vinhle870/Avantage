# Run Summary — AP-2498: Roadside protection: keep the existing vehicle form visible and add VIN + Year
Updated: 2026-11-01T23:52:00Z · Run folder: no-sprint · Environment: Dev (v2dev) · Stages run: s5 → s7 · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2498: Roadside protection: keep the existing vehicle form visible and add VIN + Year
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 8 REQ · 2 High risks
 Test cases   : 14 designed · 8 proposed by review (0 promoted)
 Execution    : 2 PASS · 10 FAIL · 2 BLOCKED (Dev, v2dev)
 Bugs         : 3 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS (s4c skipped — no C1)
 Verdict      : FAIL
 Tickets      : AP-2498 unchanged (QC) · 0 bugs updated (AP-2523/2524/2525 new, in Backlog)
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2498 FAIL — 2 of 14 test cases passed on Dev (v2dev), missing the 90% threshold (14%). 3 bugs filed (AP-2523, AP-2524, AP-2525). Ticket comment posted and verified (comment 19453).

**What passed**
- Make and Model lists (AP2498_007): the Make list holds 151 makes, choosing a Make loads only that make's models (Toyota 63, Honda 23), and changing the Make clears the chosen Model.
- Prefill on a new quote (AP2498_008): the roadside form opens with the vehicle's VIN and year; Make and Model stay on "Choose".
- Parts of the failing cases also worked: submitted VIN, Year, Make and Model are saved on the roadside record and shown again after a reload (AP2498_009, 010, 012); the submit does not change the inventory vehicle; a VIN-only submit is accepted without an error screen; the prices refresh inside the modal without a page reload (AP2498_011); there is no VIN lookup button and Year, Make and Model are not required (AP2498_005).

**Failures**
- AP2498_001, AP2498_012 — when no products come back, the notice below the form reads "No road side protection products are available for this vehicle." instead of "In order to get a quote for road side protection, please specify the make and model of the vehicle."; the placement is right, only the text is wrong. Gate C: filed as AP-2523 (rule C3 → reviewer E2), relates to AP-2508 and AP-2498.
- AP2498_002, 003, 009, 010, 011, 013 — whenever products are listed, the vehicle form's fields and Continue are folded behind an "Edit" link, against the title "keep the existing vehicle form visible" and the criterion "the form does not disappear because make/model are complete". Gate C: filed as AP-2524 (C3 → E2), relates to AP-2508, AP-2498 and AP-2521 (likely shared cause with the warranty modal).
- AP2498_005, AP2498_006 — the VIN has no `required` constraint, and an empty-VIN submit returns prices and saves Honda/Accord, although the ticket says "the VIN input is required". Gate C: filed as AP-2525 (C3 → E2), relates to AP-2508 and AP-2498.

**Decisions made**
- Gate A (rule A3, by reviewer R1 — earlier run): no Blocking question; nothing posted.
- Gate B (rule B3, by reviewer R2 round 3 — PARK of AP2498_004): AP2498_004 stays BLOCKED because its step 5 required "nothing else" in a form that probably carries a hidden security-token input; it waits for the author to confirm which inputs the form must contain. The park reason is now posted on AP-2498 in the s7 comment (R3 F-3).
- Gate C (rule C3 → reviewer rule E2, by the independent reviewer R3 round 1 — APPROVE, 0/0/3): three new bugs, each linked to AP-2508 and AP-2498, BUG-002 also to AP-2521; all Medium, assigned to Ken Nguyen (`bug_new_assign`). A fresh duplicate search at filing time found nothing new.
- Gate D (rules, automatic; reviewer R4 round 1 inline — APPROVE): AP-2498 not moved — pass rate 14% (needs 90%); the story result comment lists all 14 cases, states "Tested on: Dev (v2dev)", the AP2498_004 park reason, AP2498_014 blocked by AP-2508, and REQ-008 "no longer qualify" as not covered (Q-001, R3 F-1). No bug action: the three new bugs are in Backlog, not the QA status.
- Environment: Dev (v2dev) only, by the user's decision; staging was not tested.

**Left behind**
- Test data on Dev: vehicles 1106–1118 and quotes 6514–6526 (clients `client.stage.2498001`–`2498014@yopmail.com`, no 004); CA$0.00 roadside rows on quotes 6516–6518 and 6521–6526. No contract, no Save.
- Observations that are not failures: the roadside flow is a modal on the quote page (Q-002); no field label has "*" (Q-003); the roadside record's VIN and year win over the vehicle's, and the vehicle is not changed (Q-008, Q-010); Make/Model are not prefilled from the vehicle (Q-009); AutoShield on Dev returns the same five tiers for any make and model and nothing while they are empty (Q-001); the first Continue creates a CA$0.00 roadside row.
- Knowledge files added or changed: None in this run (s5–s7).

**Files**
- [AP-2498_test-report.md](AP-2498_test-report.md)
- [AP-2498_bug-report.md](AP-2498_bug-report.md)
- [execution log](../4-execution-results/no-sprint/execution-log_AP-2498_2026-11-02.md)
- [run state](../.pipeline/AP-2498.md)

## Automation
- Spec `playwright-automation/src/tests/dealer/roadSideProtectionVehicleForm_AP2498.spec.ts`, tag `@AP-2498` (members added to the AP-2225 batch files `RoadSideProtectionPage.ts` and `RoadSideProtectionFlow.ts`); report `qa-artifacts/6-automation/AP-2498_automation-report.md`; reviewer R5 APPROVE (0/0/1).
- 2 of 2 PASSED cases automated — 2 passing, 0 fixme (AP2498_007, AP2498_008; run ×2 with no flaky test). Test data left on Dev: vehicles 1119–1124, quotes 6527–6532, no Continue/Save/contract.
- Not automated: AP2498_001–003, 005, 006, 009–013 — FAIL (AP-2523, AP-2524, AP-2525); AP2498_004 — BLOCKED (Gate B park); AP2498_014 — BLOCKED (AP-2508). R5 F-1: the AP-2225 spec now fails because it opens the newest quote, which is an AP-2498 quote with no products — its quote choice needs fixing by the QA.
- PR skipped: gh CLI not installed.
