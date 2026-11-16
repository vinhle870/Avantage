# Run Summary — AP-2477: Simplify /quote/new/edit-vehicle to minimal fields with VIN decoder pre-fill
Updated: 2026-11-07T10:17:30Z · Run folder: 5.2.0 · Environment: Dev (v2dev) · Stages run: execute → update-ticket (last dispatch: update-ticket; correct-cases skipped) · Run status: done

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2477: Simplify /quote/new/edit-vehicle to minimal fields with VIN decoder pre-fill
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 7 REQ · 4 High risks
 Test cases   : 12 designed · 8 proposed by review
 Execution    : 11 PASS · 1 FAIL · 0 BLOCKED
 Bugs         : 1 filed (AP-2552, Medium) · 0 linked to existing · 0 not a bug  (AP-2492, AP-2507 from earlier runs, still open)
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS (correct-cases skipped — no "not a bug" decision)
 Verdict      : FAIL
 Tickets      : AP-2477 commented (19511), not moved (QC) · 0 bugs updated
 Stopped at   : — (s7 done; s8 not run — automation gate not met)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Done:** s7 applied the R4-approved Gate D outcome on 2026-11-07 at 10:17 UTC: result comment 19511 posted on AP-2477 and read back; AP-2477 stays in QC with assignee Vinh Le - QC. Environment: Dev (v2dev).

This was a re-test after a fix (orchestrator plan rule P5), executed on Dev on 2026-11-07, 09:47–09:58 UTC. 11 of 12 test cases passed (91.7%), which meets the 90% threshold. The verdict is still FAIL because the test plan also requires no open High bug, and two remain open (AP-2507 awaiting its own re-test, AP-2492 for staging), and because the one failure breaks the second acceptance criterion.

**What passed**
- The AP-2507 scenario (AP2477_007) passed on 2026-11-07 between 09:47 and 09:58 UTC: clicking "Décoder" re-renders the form with Ford / Focus / 2008 and saves nothing. This is context only — AP-2507 was not changed by this run; its own re-test (AP2507_001–003) decides it.
- A quote name typed before "Décoder" is kept and saved (AP2477_009, quote 6592).
- The new form shows Quote name, VIN with "Décoder", Brand, Model and Year; only Brand, Model and Year are required (AP2477_001, 002).
- Saving with only Brand, Model and Year works and leaves price, kilometres, condition and designation empty (AP2477_003, 004). A missing Brand or Year is refused by the server (AP2477_005, 006).
- "Décoder" shows for Passenger and not for RV CLASS A (AP2477_010). The inventory "Add a vehicle" form still requires Price and Kilometers (AP2477_011). A minimal-form quote opens its warranty step without an error (AP2477_012).

**Failures**
- AP2477_008 — after a decode the form submitted engine size unit "kW", and the saved vehicle 1146 (quote 6591) stores "Litre". Cylinders 4 and engine size 2 were carried over from the decode; fuel type and transmission show values a non-decoded vehicle also shows. Gate C: filed as AP-2552 (Medium, P2), linked to AP-2507 and AP-2477.

**Decisions made**
- Gate A, Gate B: not part of this run (design kept; review-cases skipped on a `--from execute` run).
- Gate C (rule C3 → reviewer rule E2, by the orchestrator's qa-reviewer, R3 round 1 APPROVE): AP2477_008 filed new as AP-2552. The acceptance criterion says decoded values including "engine size unit" are "stored on the vehicle row when the quote is saved". AP-2507 is the same screen but a different behaviour (the decode saved a quote). No "not a bug" decision, so correct-cases was skipped.
- Bug priority: Medium — the flow works and four of five compared values are stored; the dealer can correct the unit on the vehicle edit form. Flagged for R4: the test plan describes a High bug as one where "quotes are saved with wrong vehicle data".
- Gate D (rule D §3.1, §3.2, by reviewer — R4 round 1 APPROVE, 0/0/2): comment 19511 posted on AP-2477 (11/12 = 91.7%, AP2477_008 → AP-2552), read back via v3; not moved to Ready for release because AP-2507 and AP-2492 (High) are still open; status QC and assignee unchanged; no §3.2 action on AP-2492, AP-2507 or AP-2552. AP-2552 stays Medium (R4 decision 1). If AP-2507's own re-test does not run in this batch, the next AP-2477 s7 must apply §3.2 to AP-2507 from AP2477_007's PASS (R4 F-2).
- R3 minor findings: F-3 applied (the log and the quote-creation note now say the quote name shows in the Vehicle column, "-" under Client). F-1 applied in the AP-2552 description. F-2 (case wording for the AP-2533 layout) left for a later design maintenance run.
- Environment: Dev (v2dev), the registry's `execution_env`. AP-2492 (staging 404) was not re-tested.

**Left behind**
- Test data on Dev: quotes 6588 (no name, vehicle 1143), 6589 "QA-AP2477-004-095118" (vehicle 1144), 6590 "QA-AP2477-012-095207" (vehicle 1145), 6591 "QA-AP2477-008-095303" (vehicle 1146, Ford Focus 2008), 6592 "QA-AP2477-009-095457" (vehicle 1147, Ford Focus 2008). Dealers cannot delete quotes. No new records in this dispatch (no browser used).
- Observations that are not failures: the decoder's hidden `quote_vehicle[id]` holds 863, an existing vehicle with the same VIN (left unchanged; noted as a risk in AP-2552); "No entities found" alert on a freshly saved quote; edit-form defaults "new" / "Particular".
- Knowledge files added or changed: `qa-artifacts/qa-docs/quote-creation.md` — the Dev 2026-11-07 entry now says "Vehicle column" (R3 F-3) and names AP-2552.

**Files**
- [AP-2477_test-report.md](qa-artifacts/5-testing-report/AP-2477_test-report.md)
- [AP-2477_bug-report.md](qa-artifacts/5-testing-report/AP-2477_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2477_2026-11-07.md)
- [run state](qa-artifacts/.pipeline/AP-2477.md)

## Automation
Not run yet for the 2026-11-07 execution. The earlier automation from 2026-11-01 covers the 9 cases that passed then: spec `playwright-automation/src/tests/dealer/minimalQuoteVehicleForm_AP2477.spec.ts` (R5 APPROVE, PR skipped because the gh CLI was not installed). It does not cover AP2477_007–009. The automation gate (≥ 90% and no open High/Highest bug) is not met while AP-2507 and AP-2492 stay open.
