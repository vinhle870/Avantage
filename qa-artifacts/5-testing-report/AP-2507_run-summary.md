# Run Summary — AP-2507: [BUG-002][AP2477_007] — Clicking "Décoder" on the new-quote vehicle form saves a quote and empties the form instead of re-rendering it pre-filled
Updated: 2026-11-07T11:12:48Z · Run folder: no-sprint · Environment: Dev (v2dev) · Stages run: update-ticket · Run status: done

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2507: Clicking "Décoder" saves a quote and empties the form
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : bug re-test — steps to reproduce are the requirement · analysis skipped
 Test cases   : 3 designed · 0 proposed by review (review-cases skipped)
 Execution    : 3 PASS · 0 FAIL · 0 BLOCKED (100%, 3 of 3) — Environment: Dev
 Bugs         : 0 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS (correct-cases skipped — no Gate C "not a bug")
 Verdict      : PASS — Ready for Release
 Tickets      : AP-2507 → Done (comment 19514) · 0 bugs updated
 Stopped at   : — (run complete after update-ticket)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2507 PASS — 3 of 3 test cases passed on Dev, meeting the 90% threshold. 0 bugs filed. Ticket comment posted and verified (id 19514), and AP-2507 moved to Done.

**What passed**
All three cases passed on Dev. The fix is on Dev: the page's script bundle `/build/app.18b4959e.js` builds the decoder's "novalidate" key from the form name, as the developer described for AP-2533. Clicking "Décoder" with VIN 1FAHP35NX8W239204 now answers 200 and re-renders the form filled with Ford, Focus and 2008, and no quote is saved — the top of the quotes list stayed at 6599 (AP2507_001). After the decode, the dealer's own Save created exactly one quote with the decoded Ford Focus 2008 on a new vehicle (AP2507_002, quote 6600 / vehicle 1155), and a quote name typed before the decode survived it and was saved (AP2507_003, quote 6601 / vehicle 1156). Today's separate AP-2477 run (09:47–09:58 UTC) saw the same thing in AP2477_007, the case that first raised this bug.

**Failures**
None.

**Decisions made**
- Gate C was decided by the qa-reviewer (R3 round 1, APPROVE, no findings): skipped, because the execution log has no failure. Nothing was filed or linked, and correct-cases did not run. The bug report records no bugs.
- The test report's verdict is PASS — Ready for Release: 3 of 3 passed (100%, threshold 90%), no bug open.
- Gate D was decided by the qa-reviewer (R4 round 1, APPROVE, rule §3.2 All PASS) and applied word for word: the bug re-test comment "Re-test PASSED — 2026-11-07" was posted on AP-2507 (comment 19514, read back), and AP-2507 moved from QC to Done (read back: Done). The assignee was not changed, and no other bug (including AP-2552 and AP-2533) was touched.

**Left behind**
- Test data on Dev (dealers cannot delete quotes): quote 6600 "QA-AP2507-002-105955" with vehicle 1155, and quote 6601 "QA-AP2507-003-110048" with vehicle 1156 — both Ford Focus 2008, VIN 1FAHP35NX8W239204. AP2507_001 saved nothing.
- Observation that is not a failure here: after the decode the hidden engine size unit is "kW" while the saved vehicle shows "Litre". That is already filed as AP-2552 (Medium) from AP-2477 and was not judged by this run.
- AP-2507 is now in Done; its assignee is still Vinh Le - QC.

**Files**
- [test report](AP-2507_test-report.md)
- [bug report](AP-2507_bug-report.md)
- [execution log](../4-execution-results/no-sprint/execution-log_AP-2507_2026-11-07.md)
- [test cases](../3-test-cases/AP2507_TestCases_001-003.md)
- [screenshots](../4-execution-results/screenshots/no-sprint/AP-2507/)
- [review record](../7-reviews/AP-2507_review.md)
- [run state](../.pipeline/AP-2507.md)

## Automation
- Spec: `playwright-automation/src/tests/dealer/quoteVinDecoder_AP2507.spec.ts` · tag `@AP-2507` (runs on Dev / v2dev only)
- 3 of 3 PASSED cases automated — 3 passing, 0 fixme (lint clean; two separate full runs, 3 passed each). Each run leaves two quotes and two vehicles on Dev (AP2507_002 and AP2507_003); the two runs left quotes 6603–6606 and vehicles 1158–1161 — see the [automation report](../6-automation/AP-2507_automation-report.md).
- Not automated: none.
- PR: not opened — awaiting R5 (--review external). PR skipped: vcs preflight fails (gh not logged in) and the framework commit 22fa313 is only on main, not origin/dev.
