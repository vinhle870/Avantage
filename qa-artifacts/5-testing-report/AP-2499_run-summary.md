# Run Summary — AP-2499: Add GAP/creditors insurance to a quote: embed the financing form in the add modal
Updated: 2026-11-15T11:27Z · Run folder: no-sprint · Stages run: file-bugs → report, then update-ticket · Run status: complete (s7 done; automation gate not met) · Environment: Dev (v2dev)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2499: Add GAP/creditors insurance to a quote: embed the financing form in the add modal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 6 REQ · 3 High risks · 15 questions: 2 Answered, 12 Accepted, 1 Open (0 Blocking)
 Test cases   : 13 designed · 3 proposed by review (2026-11-15, unpromoted)
 Execution    : 5 PASS · 6 FAIL · 2 BLOCKED of 13 — 38%, Environment: Dev (v2dev) (2026-11-15: 005 FAIL, 009 BLOCKED; 11 carried forward from 2026-11-02)
 Bugs         : 1 filed (AP-2566) · 0 linked to existing · 0 not a bug — 3 still open from 2026-11-02 (AP-2526, AP-2527, AP-2528)
 Corrected    : 0 test cases rewritten · 0 retired (correct-cases skipped — no rule C1)
 Verdict      : FAIL
 Tickets      : AP-2499 unchanged (QC, Vinh Le - QC) — result comment 19589 posted · 0 bugs updated
 Stopped at   : update-ticket (complete; automation gate not met — 38% < 90%, open bugs)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Complete:** update-ticket posted the Gate D comment (19589) on AP-2499 and read it back; AP-2499 stays in QC, assigned to Vinh Le - QC. Automation (s8) is not due: the gate needs at least 90% passed and no open High/Highest bug — this run passed 38%.

**What passed**
- Nothing new passed in this run, which only filed the bug and wrote the report. The five passes of 2026-11-02 stand: on a quote with no financing, both the GAP and the creditors windows show the financing form instead of the "Please add a financing" alert (AP2499_001, 002), and missing or invalid financing values are refused with field errors and nothing is stored (AP2499_010, 011, 012).

**Failures**
- AP2499_005 — a financing saved with Date of birth left empty comes back with today's date (2026-11-15) in the Date of birth field: the server returns that date as the field's value on `/quote/{id}/financing`, on `/quote/{id}/insurance` and in both windows. A Get Quote would send it to the insurer as the borrower's date of birth. Gate C: filed as AP-2566 (rule C4).
- AP2499_009 is BLOCKED by the same behaviour (its trigger, a borrower with no date of birth, cannot be set up); it was not filed separately, and its "Blocked by" now names AP-2566.
- AP2499_003, 004 (AP-2526), 006 (AP-2527), 007, 008 (AP-2528) — carried forward from 2026-11-02; the bugs are still open in Backlog.

**Decisions made**
- Gate C (rule C4, by reviewer — R3 round 1): file AP2499_005 as a new bug relating to AP-2499; AP2499_009 stays BLOCKED by it. No sentence in the capture or the comments says an empty date of birth should become today's date, and no open bug names the date of birth. No rule C1, so correct-cases was skipped.
- AP-2566 filed automatically (apply_mode automatic): Bug, priority Medium — severity Medium, because the other financing values are correct and the dealer can type the real date of birth, but an unnoticed date would price the insurance for a wrong age. Assigned to Minh Lưu (bug_new_assign), labels qa-agent and stlc-automated, linked Relates → AP-2499. The description follows the bug description shape and embeds the AP2499_005 step-4 screenshot; read back, 1 image verified by its media id.
- Gate D (rule §3.1, by reviewer — R4 round 1 independent, APPROVE, 0/0/3): post the reviewer's corrected comment word for word; no status move (pass rate 38%, needs 90%; AP-2566 is a stopping bug — it blocks AP2499_009); assignee unchanged (Vinh Le - QC); no bug ticket action. Applied 2026-11-15T11:26Z: comment 19589 posted as Jira wiki markup (REST v2), read back identical; Jira shows status QC, assignee Vinh Le - QC.
- Questions: Q-002 (which Dev dealer is configured for Humania, so AP2499_013 can run) is listed in the posted comment — it is the one question still Open. The other questions of the 2026-11-08 comment (Q-001 to Q-015) are settled: Q-007 and Q-008 Answered by AP-2405, the other 12 Accepted. (R4 F-1: the earlier draft said "None"; the reviewer's text replaced it.)

**Left behind**
- Test data on Dev: quotes 6710 (client client.stage.2499013@yopmail.com) and 6711 (client.stage.2499014@yopmail.com) on vehicle 915, each with a financing of 25,000 / residual 0 / 60 months / 6.99 % / monthly / AutoCapital Canada saved without a date of birth; no insurance quote, no contract. Nothing new was created on Dev in this run.
- Observations that are not failures: all five earlier bugs read on 2026-11-15 (AP-2521, AP-2524, AP-2526, AP-2527, AP-2528) are in Backlog, assigned to Minh Lưu.
- Knowledge files added or changed: None in this run.

**Files**
- [AP-2499_test-report.md](qa-artifacts/5-testing-report/AP-2499_test-report.md) (rewritten, TR-20261115-001)
- [AP-2499_bug-report.md](qa-artifacts/5-testing-report/AP-2499_bug-report.md) (BUG-004 → AP-2566 added)
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2499_2026-11-15.md)
- [test cases 001–005](qa-artifacts/3-test-cases/AP2499_TestCases_001-005.md) (AP2499_005 Result names AP-2566)
- [test cases 006–010](qa-artifacts/3-test-cases/AP2499_TestCases_006-010.md) (AP2499_009 Blocked by AP-2566, Revisions row)
- [run state](qa-artifacts/.pipeline/AP-2499.md)

## Posted update-ticket comment

Posted 2026-11-15T11:26Z on AP-2499 as comment 19589 (Jira wiki markup, REST v2), word for word from the R4 round 1 gate decision; read back identical. Jira after the post: status QC, assignee Vinh Le - QC. No bug ticket action.

```
h3. QA result — FAIL · Dev (v2dev) · 2026-11-15

*5/13 passed (38%, needs 90%)* · 6 failed · 2 blocked

*Failed / blocked:*
* AP2499_003, AP2499_004 — financing form folded behind "Edit" once a financing exists — AP-2526
* AP2499_005 — Date of birth saved empty comes back as today's date — AP-2566
* AP2499_006 — saving a corrected financing draws the quote page in the window — AP-2527
* AP2499_007, AP2499_008 — "Get Quote" reloads the page and closes the window — AP-2528
* AP2499_009 (blocked) — insurer error for a missing date of birth cannot be set up — AP-2566
* AP2499_013 (blocked) — no Humania dealer on Dev — Q-002 (test data)
*Passed:* 001, 002, 010–012

*Bugs:* AP-2566 (Medium) — empty Date of birth comes back as today's date in the financing form · AP-2526, AP-2527, AP-2528 (Medium) — open since 2026-11-02
*Questions:* Q-002 — Which dealer account on Dev is configured for Humania, so AP2499_013 can run? The other questions of the 2026-11-08 comment are settled (Q-007 and Q-008 answered by AP-2405; the rest accepted as the current behaviour) — no reply needed on them.
*No screenshot yet:* Q-002 — test data, no screen to show.

*Next:* Stays in QC — re-test after AP-2566, AP-2526, AP-2527 and AP-2528 are fixed and a Humania dealer is named (Q-002). Not moved to Ready for release: pass rate 38% (needs 90%); AP-2566 blocks AP2499_009.
```

## Automation
Not run: the automation gate is not met (38% passed, needs at least 90%). The 2026-11-02 automation — 5 passing specs in `gapCreditorsFinancingForm_AP2499.spec.ts`, report `qa-artifacts/6-automation/AP-2499_automation-report.md` — covers only cases whose results did not change on 2026-11-15.
