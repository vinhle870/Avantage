# Run Summary — AP-2374: Status Change email notification: Add notify email and client email
Updated: 2026-11-15T10:42Z · Run folder: 3.6.0 · Stages run: analyze → update-ticket (2026-11-15, in batch waves) · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2374: Status Change email notification: Add notify email and client email
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 5 REQ · 0 Blocking questions open
 Test cases   : 11 designed · 1 promoted by review (AP2374_011)
 Execution    : 8 PASS · 2 FAIL · 1 BLOCKED
 Bugs         : 1 filed (AP-2565) · 1 carried (AP-2509) · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · correct-cases skipped (no C1 decision)
 Verdict      : FAIL
 Tickets      : AP-2374 commented (19586) · stays QC · Ken Nguyen · 0 bugs updated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2374 FAIL — 8 of 11 test cases passed on Dev (v2dev), missing the 90% threshold (73%). 1 bug filed (AP-2565), 1 carried (AP-2509). Ticket comment posted and verified (19586).

**What passed**
- Recipient pre-fill (AP2374_002): on claim 333 the Authorized and Refused forms both pre-fill "Recipient email(s)" with the notify address and the client address, comma-separated, and nothing else.
- Delivery to both people (AP2374_003, AP2374_004): moving the claim to Authorized and then to Refused with "Notify by email" ticked delivered a separate "Claim updated" email with `claim-333.pdf` to both the notify inbox and the client inbox each time.
- The email follows the list (AP2374_011): removing the notify address from the box before Authorizing meant only the client was emailed.
- Carried from 2026-11-01 (AP2374_007–010): an unticked box sends nothing; a claim with no notify email lists only the client, with no stray comma; an invalid or empty list saves without error and emails no one; a claim with no files still gets the email with the claim PDF.

**Failures**
- AP2374_001 — the "Notify by email" checkbox and recipient field are on only the Authorized and Refused forms (Pending has a different label; six forms have neither). Gate C: already filed as AP-2509 (Medium), no action.
- AP2374_005 — neither the Authorized (10:19:16Z) nor the Refused (10:20:08Z) email contains "The claim ID … has been updated to status …"; the claim number appears only in the attachment name `claim-333.pdf`. Gate C: filed as AP-2565 (Medium, assigned to Minh Lưu), linked *Relates* to AP-2374 and to AP-2392 (Done, same symptom, not reopened).
- AP2374_006 (BLOCKED, not a failure) — Dev cannot create …/uploads/claim_attachments/ — claim attachment upload returns HTTP 500 on the admin form and the Admin API; AP2374_006 re-runs once the folder is writable. No bug filed.

**Decisions made**
- Gate A (rule A3, by reviewer — R1, 2026-11-15): continue, post no question — 0 Blocking + Open questions (Q-001–Q-008 Accepted, Q-009 and Q-010 Answered).
- Gate B (rule B2, by reviewer — R2 rounds 1–2): promoted Pass 2 proposal 2 as AP2374_011 and re-ran design once; review-cases not re-run.
- Gate C (by reviewer — R3 round 1): AP2374_005 → rule C4, file new (AP-2565), Medium, `bug_new_assign`, linked to AP-2374 and AP-2392 with the line "Same symptom as AP-2392 (Done), reproduced on Dev 2026-11-15 on claim 333"; AP2374_001 → already filed as AP-2509, no action; AP2374_006 BLOCKED → no bug, environment fault named in the update-ticket comment. No C1 decision, so correct-cases was skipped.
- Gate D (rule §3.1, automatic, by reviewer — R4 round 1 APPROVE): AP-2374 not moved: pass rate 73% (needs 90%) — comment 19586 posted (R4-corrected text, F-1), stays QC, assignee Ken Nguyen unchanged; AP-2509 and AP-2565 (both Backlog) no action. No stopping bug, no Blocking question open.
- Automation gate not met: pass rate 73% < 90% — no qa-automator hand-off for this execution.
- Environment: Dev (v2dev), per `execution_env`. Tracker preflight (`jira.sh me`) passed at 10:33Z.

**Left behind**
- Test data on Dev: quote 6708, contract 26df1-851 (invoice #955), claim 333 (Authorized, notify email `client.stage.2374001@yopmail.com`, no attachment), emails in `client.stage.2374001` (2) and `client.stage.2374002` (3). The next run uses inboxes 2374003/2374004.
- Tracker records created: comment 19586 on AP-2374; AP-2565 (Bug, Backlog, Medium, Minh Lưu, labels `qa-agent` + `stlc-automated`, attachments 14503 and 14504 embedded in the description and verified through the v3 read-back).
- Observations that are not failures: the Dev claim attachment upload fault (above); the Admin API `POST /api/admin/claim` needs an `items` array (HTTP 400 without it); Generate Contract on Dev requires a Financing company; the notify email is not shown on the admin claim page.
- Knowledge files added or changed: None in this run.

**Files**
- [AP-2374_test-report.md](qa-artifacts/5-testing-report/AP-2374_test-report.md)
- [AP-2374_bug-report.md](qa-artifacts/5-testing-report/AP-2374_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2374_2026-11-15.md)
- [run state](qa-artifacts/.pipeline/AP-2374.md)

## Posted update-ticket comment

Posted 2026-11-15T10:41Z as comment 19586 on AP-2374 via REST v2 (Jira wiki markup), the R4 round 1 text word for word (F-1 shortened the AP2374_006 line). Read back: v2 body identical (16 lines), v3 renders heading + bullet lists; AP-2374 QC, Ken Nguyen (unchanged). AP-2509 Backlog, Minh Lưu (re-assigned outside this run — R4 F-2); AP-2565 Backlog, Minh Lưu. No action on either bug.

```
h3. QA result — FAIL · Dev · 2026-11-15

*8/11 passed (73%, needs 90%)* · 2 failed · 1 blocked

*Failed / blocked:*
* AP2374_001 — "Notify by email" only on the Authorized and Refused forms — AP-2509
* AP2374_005 — emails lack "The claim ID … has been updated to status …" — AP-2565
* AP2374_006 — BLOCKED: claim file upload fails on Dev (HTTP 500, claim_attachments folder) — Dev environment, no bug
*Passed:* 002–004, 007–011

*Bugs:*
* AP-2509 (Medium) — "Notify by email" missing from 7 of the 9 Change status forms
* AP-2565 (Medium) — status-change emails do not state the claim ID and new status (same symptom as AP-2392)
*Questions:* None

*Next:* Stays in QC — re-test after AP-2509 and AP-2565 are fixed and the Dev claim_attachments folder is writable. Not moved to Ready for release: pass rate 73% (needs 90%).
```

## Automation
Not run for the 2026-11-15 execution — automation gate not met (pass rate 73% < 90%). The earlier spec `playwright-automation/src/tests/admin/claimStatusNotify_AP2374.spec.ts` (AP2374_007–010, 2026-11-01) still exists; newly passed AP2374_002–004 and AP2374_011 are not automated.
