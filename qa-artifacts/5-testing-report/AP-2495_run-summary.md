# Run Summary — AP-2495: Cannot view vehicle detail's page
Updated: 2026-11-04T17:05:30Z · Environment: Dev · Run folder: no-sprint · Stages run: update-ticket · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2495: Cannot view vehicle detail's page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : bug re-test — analyze skipped · 0 High risks
 Test cases   : 4 designed · 0 proposed by review (review-cases skipped)
 Execution    : 4 PASS · 0 FAIL · 0 BLOCKED
 Bugs         : 0 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS
 Verdict      : PASS
 Tickets      : AP-2495 → Done (re-test comment posted, assignee unchanged) · 0 bugs updated
 Stopped at   : — (run complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Complete:** AP-2495 is fixed on Dev (Environment: Dev). All four re-test and regression cases passed, no bug was filed, and the ticket was moved from QA to **Done** with a re-test comment. Jira read back the status as Done and the assignee unchanged (Vinh Le - QC).

**What passed**
- Vehicle details page (Environment: Dev): opening `/vehicle/915/details` by URL now shows the vehicle (Ford Focus 2008, VIN `1FAHP35NX8W239204`) with HTTP 200 instead of the "Too few arguments to function" crash the ticket reported (AP2495_001).
- Vehicle tabs: the Details, Window sticker and Quotes tabs all open with HTTP 200 and no error page (AP2495_002). The screenshot shows only the Details tab; the qa-reviewer re-checked the Window sticker and Quotes tabs on Dev at 16:58Z and both answered HTTP 200 without error.
- Inventory path: clicking a row in the Inventory list reaches the right details page, for vehicle 915 and for a second vehicle, 1142 (AP2495_003).
- Header actions: "Create quote" opens the quote client form with vehicle 915 attached, and "Edit vehicle" opens its edit form, both without errors; nothing was saved (AP2495_004).

**Failures**
- None.

**Decisions made**
- Gate A: not applicable — AP-2495 is a bug, so analysis is skipped and the bug report is the requirement.
- Gate B (rule B3, decided by qa-reviewer R2 round 2): execute the current cases AP2495_001–004.
- Gate C (decided by qa-reviewer R3 round 1, applied by reviewer): skipped — the execution log has no FAIL, so no bug was filed and nothing was recorded against AP-2495 as a failure. The vehicle-915 Designation mismatch and the pop-up Back link were ruled out of scope and carried as a note in the test report.
- Gate D (rule §3.2 All PASS, decided by qa-reviewer R4 round 1, applied by reviewer, `apply_mode: automatic`): post the re-test comment on AP-2495, then move it to `Done` (`bug_pass_status`), with no assignee change. Applied at 2026-11-04T17:04:59Z.
- Re-test comment (id 19471): the Jira CLI treated the body as Markdown, adding backslashes before dashes and underscores and turning bold into italic. The same comment was rewritten in Jira wiki markup through the REST v2 path the adapter documents. The read-back now matches the approved text exactly, so there is still only one comment. The Designation and Back-link note was kept out of the comment and stays in the test report.
- file-bugs wrote a clean bug report with 0 defects and made no tracker write. The test report's optional team notification was skipped because `notify` is disabled.

**Left behind**
- Test data on Dev: None. Every case was read-only; vehicles 915 and 1142 were only viewed.
- Observations that are not failures: vehicle 915's details page shows Designation COMMERCIAL, but its Edit vehicle pop-up pre-selects "Particular", so saving that form would probably change the vehicle; and the pop-up's Back link goes to the Inventory list. Out of scope for this re-test — the QA lead decides whether either deserves its own ticket.
- Tracker changes: comment 19471 on AP-2495; status QA → Done.
- Knowledge files added or changed: None in this dispatch (the execute dispatch added `qa-artifacts/qa-docs/vehicle-details.md`, a `navigation-map.md` index row and a `test-centralized.md` Dev note).

**Files**
- [re-test comment body](qa-artifacts/4-execution-results/comment_AP-2495_2026-11-04.md)
- [AP-2495_test-report.md](qa-artifacts/5-testing-report/AP-2495_test-report.md)
- [AP-2495_bug-report.md](qa-artifacts/5-testing-report/AP-2495_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2495_2026-11-04.md)
- [run state](qa-artifacts/.pipeline/AP-2495.md)

## Automation
- Spec: `playwright-automation/src/tests/dealer/vehicleDetails_AP2495.spec.ts` · tag `@AP-2495`
- 4 of 4 PASSED cases automated — 4 passing, 0 fixme
- Not automated: none
- PR skipped: workbench not clean — 208 tracked files in `playwright-automation/` differ from `origin/dev` (local `main` 22fa313 is not on `dev`), and the GitHub CLI is not signed in. R5: APPROVE (round 2, 1 minor finding F-4 open). Push the framework to `dev`, sign in with `bash tools/gh-cli/gh.sh auth login`, then re-run with `--pr-only`
