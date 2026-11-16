# Run Summary — AP-2533: Update quote form UI
Updated: 2026-11-07T11:30:27Z · Run folder: no-sprint · Stages run: update-ticket (previous dispatch: file-bugs → report, correct-cases skipped) · Run status: done

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2533: Update quote form UI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 3 REQ · 2 High risks · 1 Blocking question (Q-002, posted, still unanswered)
 Test cases   : 11 designed · 9 proposed by review (1 promoted as AP2533_011)
 Execution    : 10 PASS · 0 FAIL · 1 BLOCKED (90.9%, 10 of 11) — Environment: Dev
 Bugs         : 0 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS
 Verdict      : CONDITIONAL PASS
 Tickets      : AP-2533 result comment 19515 · stays QC (Q-002 Blocking + Open) · 0 bugs updated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Done:** update-ticket applied the R4-approved Gate D outcome. AP-2533 stays in QC until Q-002 is answered; then re-test AP2533_002.

**What passed**
- Environment: Dev (v2dev), dealer 1380, executed 2026-11-07 11:07–11:16 UTC on bundle `/build/app.18b4959e.js`, which carries the decoder fix.
- Decoding: clicking "Décoder" with the Tesla VIN keeps the "Create a quote" form on screen and fills TESLA, Model 3 and 2020 (AP2533_001). No decode created a quote — with a typed name, after hand-chosen values, on the ATV / UTV form, or with a malformed or empty VIN (AP2533_003, 005, 006, 011). Only the dealer's Save creates the quote (AP2533_004, quote 6602).
- Vehicle type: the drop-down labelled "Vehicle type" is the first field, above the Quote name, and stays there after a type change and in French (AP2533_007–009). Saving with Brand, Model and Year empty is still refused (AP2533_010).

**Failures**
- None. AP2533_002 (the hidden-input half of the first criterion) is BLOCKED by Q-002 (Blocking, Open, comment 19510) — a question for the author, not a bug.

**Decisions made**
- Gate C (by reviewer, R3 round 1, APPROVE): skipped — the execution log has no FAIL. No "Not a bug" decision, so correct-cases was skipped; file-bugs filed no bug and linked nothing to AP-2507.
- R3 minor findings applied in the test report: F-1 (byte-identical search screenshots; the reviewer's live re-check at 11:23Z found the VIN search lists only quote 6602), F-2 (French "Quote name" label and "Passenger" option untranslated — observation and question, no FAIL), F-3 (the ATV / UTV decode filled hidden `quote_vehicle[id]` with 1157; what a Save would do to vehicle 1157 is untested — under Q-004 / Q-005), F-4 (AP2533_005 and AP2533_010 step 4 read only "Loaded").
- Verdict CONDITIONAL PASS: the pass rate (90.9%) meets the 90% threshold and no bug is open, but the test plan's exit criterion on Q-002 is not met.
- Gate D (by reviewer, R4 round 1, APPROVE; applied at 2026-11-07T11:30:27Z): story result comment 19515 posted on AP-2533, mentioning the reporter Nicolas-Eric Tain for the three questions. It is **not moved** to Ready for release because Q-002 (Blocking) is still Open (routing §3.1 blocking-question check); the pass-rate and stopping-bug checks hold. Assignee unchanged. AP-2507 is not touched — it is the related bug this story fixes, re-tested PASS today and already Done (comment 19514).

**Left behind**
- Test data on Dev: quote 6602 "QA-AP2533-004-111033" with vehicle 1157 (TESLA Model 3 2020, VIN `5YJ3E1EA0LF734293`), from AP2533_004. Dealers cannot delete quotes.
- Tracker: comment 19515 on AP-2533 (QA result, Environment: Dev). Status QC and assignee Vinh Le - QC unchanged; AP-2507 untouched. Q-002 (comment 19510) is still unanswered.
- Observations that are not failures: French "Quote name" label and "Passenger" option untranslated (question for the author); ATV / UTV decode reuses vehicle 1157 in the hidden id, Save effect untested (question for the author); Q-003, Q-004, Q-006, Q-007, Q-008 record-only results as listed in the test report.
- Knowledge files added or changed: None in this dispatch (the execute dispatch updated quote-creation.md, test-centralized.md and navigation-map.md).

**Files**
- [AP-2533_test-report.md](AP-2533_test-report.md)
- [AP-2533_bug-report.md](AP-2533_bug-report.md)
- [execution log](../4-execution-results/no-sprint/execution-log_AP-2533_2026-11-07.md)
- [review record](../7-reviews/AP-2533_review.md)
- [run state](../.pipeline/AP-2533.md)

## Automation
- Spec: `playwright-automation/src/tests/dealer/quoteFormUi_AP2533.spec.ts` · tag `@AP-2533`
- 10 of 10 PASSED cases automated — 10 passing, 0 fixme (two separate runs, both 10/10; each run leaves one quote and vehicle from AP2533_004: quotes 6609 and 6610, vehicles 1164 and 1165)
- AP2533_002 — not automated: BLOCKED by Q-002 (no hidden input or value named)
- Rework after R5 round 1 (F-1 to F-5): AP2533_009 asserts only the French position (label recorded, Q-009) and restores the step-1 language, checked on a fresh load; form labels checked in order; the AP2533_010 message wording recorded, not asserted; vehicle 1157 recorded, not asserted. Lint pass; one run 10/10 passed (1.7 min); left quote 6612 and vehicle 1167
- PR: not opened — awaiting R5
