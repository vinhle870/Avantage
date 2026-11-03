# Run Summary — AP-2477: Simplify /quote/new/edit-vehicle to minimal fields with VIN decoder pre-fill
Updated: 2026-11-01T15:14:00Z · Run folder: 5.2.0 · Tested on: Dev (v2dev) · Stages run: s5 → s7 · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2477: Simplify /quote/new/edit-vehicle to minimal fields with VIN decoder pre-fill
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 7 REQ · 4 High risks
 Test cases   : 12 designed · 8 proposed by review
 Execution    : 9 PASS · 1 FAIL · 2 BLOCKED
 Bugs         : 1 filed (AP-2507) · 0 linked to existing · 0 not a bug  (AP-2492 from 2026-10-12 kept)
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS (s4c skipped)
 Verdict      : FAIL
 Tickets      : AP-2477 unchanged (QC) · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2477 FAIL. 9 of 12 test cases passed on Dev (v2dev), which is 75% and misses the 90% threshold. 1 bug filed (AP-2507). The story result comment was posted and verified (comment 19441), and the story stays in QC.

**What passed**
- New quote form: "Create a quote" opens `/quote/new/edit-vehicle`, which shows only Quote name, VIN (with "Décoder"), Brand, Model and Year, in that order, then Save (AP2477_001).
- Required fields: only Brand, Model and Year are starred and required (AP2477_002).
- Saving with only Brand, Model and Year works. Quote 6438 (Toyota Corolla 2020) was created and opened at its details page without an error (AP2477_003).
- Empty values are stored empty: the vehicle saved from the form (1069) has no price, no kilometres, no condition and a blank designation (AP2477_004).
- Missing values are refused. Without a Brand, or without a Year, the save gave "This value should not be blank." at the missing field, and no quote was created (AP2477_005, AP2477_006).
- Decoder visibility: "Décoder" shows for Passenger and not for RV CLASS A (AP2477_010).
- Inventory form unchanged: "Add a vehicle" still requires Vehicle Price and Kilometers (AP2477_011).
- Later quote steps cope with the empty values. Quote 6440's details page loads, and its warranty step opens without an error and asks for Kilometers and Fuel type (AP2477_012).

**Failures**
- AP2477_007 — clicking "Décoder" with a valid VIN saved quote #6437 at once and emptied the form, instead of re-rendering it pre-filled. The single click was not retried. Gate C: filed as AP-2507 (High), linked Relates → AP-2492 and AP-2477.
- AP2477_008 and AP2477_009 are BLOCKED by the same fault and were not filed separately.

**Decisions made**
- Gate A: not run in this stage range (decided 2026-10-12 — continue, by the user).
- Gate B: not run in this stage range (decided 2026-10-12 — execute the current cases, by the user).
- Gate C (rule C3 → reviewer rule E2, R3 APPROVE): AP2477_007 was filed new as AP-2507 and linked to AP-2492 as *relates to*. AP-2492 covers the same screen with a different fault, an HTTP 404 on staging. The bug states that the decode request sends the whole `quote_vehicle` form plus `quote_vehicle[novalidate]=true` (R3 F-1).
- Gate D (rules, automatic; R4 APPROVE): AP-2477 was not moved, because the pass rate is 75% (needs 90%) and AP-2507 blocks AP2477_008–009. The comment was posted and the status and assignee are unchanged. AP-2492 and AP-2507 are in Backlog, so no bug re-test action applied.
- Intake check on `--from s5`: AP-2492 is not a rejected bug. The ticket changed after capture (Ken Nguyen, 2026-10-28: the feature is on v2dev and "not ready for staging yet"), and that comment was appended to the capture.
- Environment: Dev (v2dev) only, by the user's decision.

**Left behind**
- Test data on Dev (v2dev) — dealers cannot delete quotes: quote 6437 / vehicle 1067 (Ford Focus 2008, from the "Décoder" click); quote 6438 / vehicle 1068; quote 6439 "QA-AP2477-004-145431" / vehicle 1069; quote 6440 "QA-AP2477-012-145539" / vehicle 1070 (Toyota Corolla 2020). Vehicle 1067 also shows in Vehicle Inventory.
- Observations that are not failures: fuel type, cylinders, engine size and turbo are not rendered as hidden inputs (check during the AP2477_008 re-run). The full vehicle edit form shows Condition "new" and Designation "Particular" for empty values. The inventory "Create quote" action still opens the old client form. The analysis open questions have no Impact classification (R4 F-1, minor).
- Knowledge files added or changed: `qa-artifacts/qa-docs/quote-creation.md`. The header, the Routes diagram and the `/quote` redirect line are now labelled as staging facts. The new dev facts are `/vehicle/inventory` (`/vehicle` → 404), `/vehicle/new/edit/{TYPE}`, quote vehicles in Vehicle Inventory, the decode request body, the missing hidden inputs and the single-click wording. `requirements/AP-2477-…md` has an appended "Ticket changes since capture" section. Not changed: the `navigation-map.md` feature-index row still says "not deployed (HTTP 404) as of 2026-10-12".

**Files**
- [AP-2477_test-report.md](AP-2477_test-report.md)
- [AP-2477_bug-report.md](AP-2477_bug-report.md)
- [execution log](../4-execution-results/5.2.0/execution-log_AP-2477_2026-11-01.md)
- [run state](../.pipeline/AP-2477.md)

## Automation
- Spec: `playwright-automation/src/tests/dealer/minimalQuoteVehicleForm_AP2477.spec.ts`, tag `@AP-2477`. It runs on Dev (v2dev) only and skips itself on any other dealer URL. It never clicks "Décoder". Report: `qa-artifacts/6-automation/AP-2477_automation-report.md` (R5 APPROVE).
- 9 of 9 PASSED cases automated — 9 passing, 0 fixme. Lint passed; the final full run passed 9 of 9. Each run leaves 3 quotes on dev. These runs left quotes 6441–6450, each with a Toyota Corolla 2020 vehicle; 6441–6444 come from failed attempts during the one fix round.
- Not automated: AP2477_007 — FAIL (AP-2507); AP2477_008 — BLOCKED by AP2477_007; AP2477_009 — BLOCKED by AP2477_007.
- PR skipped: gh CLI not installed.
