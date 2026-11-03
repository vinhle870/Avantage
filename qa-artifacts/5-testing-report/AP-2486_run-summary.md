# Run Summary — AP-2486: [BUG-002][AP2471_014] — Saving a Custom earning curve with an empty monthly factor shows an HTTP 500 error page
Updated: 2026-11-01T14:43:00Z · Run folder: no-sprint · Environment: Dev (v2dev) · Stages run: intake → s8 (s3 in Wave 1; s4–s4c, then s5–s7 in Wave 2; s8 automation) · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2486: Saving a Custom earning curve with an empty monthly factor shows an HTTP 500 error page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 1 REQ (bug re-test — steps to reproduce) · 0 High risks
 Test cases   : 3 designed · 0 proposed by review
 Execution    : 3 PASS · 0 FAIL · 0 BLOCKED
 Bugs         : 0 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS
 Verdict      : PASS — 3/3 (100%)
 Tickets      : AP-2486 commented (19440) and moved QC → Done
 Automation   : 1 spec, 3 test cases, all passing (@AP-2486)
 Stopped at   : — (run complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** All 3 test cases for AP-2486 passed on Dev (v2dev). The fix holds: saving a Custom earning curve with an empty Monthly Factor box no longer shows the HTTP 500 error page. The server now shows the form again with "This value should not be blank." under the empty box. No bugs were filed. The test report gives the verdict PASS, the re-test comment 19440 was posted on AP-2486, and the ticket was moved from QC to Done. All three cases are now automated in a Playwright spec that passes on Dev.

**What passed**
- Earning curve edit page (AP2486_001, the bug's own steps): curve #22 was saved with four factors, then row 4 was cleared and "Save" clicked. The request returned HTTP 200, the edit page came back with "This value should not be blank." under row 4, and reopening the curve showed the original 0.4000 / 0.3000 / 0.2000 / 0.1000, so nothing was damaged.
- Earning curve create page (AP2486_002, the original trigger): letters typed into the row 4 box left it empty. "Save" returned HTTP 200 with the same field message, and no curve was added to the list.
- Normal Custom saves (AP2486_003): curve #23 was created, then rows 3–4 were edited to 0.1500 each. It saved with "Earning curve saved" and stored exactly 0.4000 / 0.3000 / 0.1500 / 0.1500 (cumulative 1.0000) under the same id, so the new factor checks do not reject ordinary values.

**Failures**
None.

**Decisions made**
- Gate B: decided by the orchestrator's R2 review (APPROVE, rule B3), so the cases ran as designed.
- Gate C: not reached, because there was no failure. The R3 review of these results is left to the orchestrator (gate_mode reviewer).
- s4c: skipped, because there was no "Not a bug" (C1) decision to correct.
- Gate C (s5): skipped because there was no failure. Reviewer R3 approved in round 1, so no bug was filed (qa-artifacts/5-testing-report/AP-2486_bug-report.md records 0 defects).
- Verdict (s6): PASS. All 3 cases passed (100%) and no bug is open. Tested on Dev (v2dev), not staging.
- Gate D (s7): reviewer R4 approved in round 1 under rule D §3.2 (All PASS). Comment 19440 ("Re-test PASSED", Tested on: Dev (v2dev)) was posted and read back. AP-2486 was moved from QC to Done, which a re-read confirmed. The assignee was not changed.
- Automation (s8): reviewer R5 approved in round 1 with 0 blocker, 0 major and 2 minor findings. The pull request was skipped because the gh CLI is not installed.
- Environment: executed on Dev (v2dev) by the user's decision for this batch, not on staging. The test cases still name v2staging in step 1; only the host changed.
- Outcome reached: in both empty-box cases, the browser's own required-field popup did not stop the save. The server answered with its field message, which is outcome (a) in the test cases.
- Credential cleanup: the test-case file held the admin login and password in clear text. They were replaced with a reference to the `env` source and a Revisions row was added. No step changed, so no case needed re-running.

**Left behind**
- Test data on Dev (v2dev): the manual run left earning curve #22 `QA-AP2486-Retest-034814` and earning curve #23 `QA-AP2486-Valid-034928`. The automation left two more kinds of curve: 6 spec curves `QA-AP2486-Retest-<epoch ms>` / `QA-AP2486-Valid-<epoch ms>` (two per spec run, three runs), and the locator probe's #24 and #25 `QA-AP2486-Probe-<epoch ms>`. Earning curves have no delete control. No curve this run did not create was changed.
- Not tested: the ±1000 Monthly Factor bound from the developer's comment. The comment does not say whether the bound is inclusive or what message it shows. Negative factors are out of scope (AP-2471).
- Knowledge to update: `qa-docs/earning-curves.md` still says an empty Custom factor gives HTTP 500. On Dev it now gives "This value should not be blank." The file was not changed, because it describes staging.
- Observation that is not a failure: the admin login page logs `ReferenceError: $ is not defined` on load, which is unrelated to this ticket.

**Files**
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2486_2026-11-01.md)
- [test cases](qa-artifacts/3-test-cases/AP2486_TestCases_001-003.md)
- [run state](qa-artifacts/.pipeline/AP-2486.md)
- [bug report](qa-artifacts/5-testing-report/AP-2486_bug-report.md) — 0 defects
- [test report](qa-artifacts/5-testing-report/AP-2486_test-report.md) — verdict PASS
- [automation report](qa-artifacts/6-automation/AP-2486_automation-report.md)
- [review record](qa-artifacts/7-reviews/AP-2486_review.md) — R2, R3, R4, R5 all APPROVE
- Screenshots: qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2486/ (5 files)

## Automation
- Spec: `playwright-automation/src/tests/admin/earningCurveEmptyFactor_AP2486.spec.ts` · tag `@AP-2486` (run: `npx playwright test --project=chromium --grep @AP-2486`, against Dev only)
- 3 of 3 PASSED cases automated — 3 passing, 0 fixme (lint clean; `--repeat-each=2` gave 6 passed, no flaky tests; reviewer R5 APPROVE)
- Not automated: none
- PR skipped: gh CLI not installed (vcs preflight failed); run with --no-pr
