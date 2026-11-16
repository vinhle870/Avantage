# Run Summary — AP-2434: Admin API: create warranty notes
Updated: 2026-11-15T09:43:35Z · Run folder: 5.0.0 · Stages run: analyze → analyze · Run status: stopped_at_gate

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2434: Admin API: create warranty notes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 4 REQ · 1 High risks (resolved) · 10 questions: 2 Answered, 6 Accepted, 2 Open, 0 Blocking
 Test cases   : 8 designed · 8 proposed by review (not promoted) — unchanged
 Execution    : 3 PASS · 5 FAIL · 0 BLOCKED (Environment: Dev, 2026-11-05) — 37.5% — not re-run
 Bugs         : 3 filed 2026-11-05 (AP-2547 High, AP-2548 Medium, AP-2549 Medium) · untouched in this run
 Corrected    : 0 test cases corrected · 0 retired · re-run 0/0 PASS
 Verdict      : FAIL (from the 2026-11-05 run)
 Tickets      : AP-2434 not changed in this run — stays QC, assignee Vinh Le - QC · nothing posted
 Stopped at   : analyze (--until analyze) — before Gate A
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Stopped:** at analyze, before Gate A — this run was limited to `--from analyze --until analyze` to re-check the open questions (user instruction of 2026-11-15, "double check all tickets' question"). The independent reviewer (R1) decides Gate A next. Plan, design, execution, bug filing, the report and the ticket update stay done from 2026-11-05: the ticket has not changed in a way that matters, and the orchestrator decided not to re-execute.

**What passed**
- Nothing was executed in this run. The latest results (Environment: Dev, 2026-11-05) stand: a missing or wrong API key is refused with 401 and stores no note (AP2434_004, 005); missing fields return 400 and an unknown warranty 404, with no note stored (AP2434_006, 007 first half).
- The question re-check: Q-002 (how an admin gets an API key) is now answered by Story AP-2308, and Q-010 (what "public" changes) by Story AP-1596 — only notes marked "Is public" show in the dealer portal.
- Six questions with no defining Story now take the build's recorded behaviour as the expected result: the success response 201 with `noteId` (Q-003), the 400/404 validation answers (Q-004), the 401 key answers (Q-005), the note's place and fields on the admin warranty page (Q-006), HTML display (Q-008, to be recorded once a body is kept) and the length limit (Q-009, 2,000 characters accepted).

**Failures**
- No new failures. The five 2026-11-05 FAILs stand: AP2434_001 (Bearer header refused — AP-2549; note body lost — AP-2547), 002, 003 and 008 (note body lost — AP-2547), 007 (`is_public=maybe` → HTTP 500 — AP-2548).
- Two questions stay open with the ticket's author, Ken Nguyen. Q-001: is the path `/api/admin/warranty/-notes` in the ticket a typo? The build answers 405 there. Q-007: what is `file_content` for, and which field is the note body? The build drops `file_content`, but the ticket says it must keep HTML longer than 255 characters, and the ticket's text wins over what the build does. Both were already asked on the ticket on 2026-11-05 and 2026-11-08, so nothing new was posted.

**Decisions made**
- Q-001 and Q-007 were not marked Accepted, even though no Story defines them. Accepting the build's behaviour would overrule the ticket's own acceptance criterion: its path, and its `file_content` row.
- Q-004 accepts the 400 and 404 answers but not the HTTP 500 for `is_public=maybe`: a server error is still a failure (AP-2548). Q-008 accepts nothing yet: a script that runs in the admin's browser will still be a failure.
- AP-2267 (warranty notes with an uploaded file, Done 2025) was not used to answer Q-007. It came before this ticket and does not redesign it.
- The next design pass turns the record-only steps on the six Accepted questions into record-and-accept steps (run-state warning).
- The run-state header was corrected: it said "stopped" although every stage through update-ticket was done on 2026-11-05.

**Left behind**
- Test data on Dev (from 2026-11-05, unchanged): warranty notes 64–69 on warranty contract 827 (APOP01-827). Nothing new was created.
- Bug tickets AP-2547, AP-2548, AP-2549 — not touched in this run.
- Observation for the QA lead: the comments the QA account posted on AP-2401 and AP-2404 (2026-02-07) show an admin API key and a bearer token in clear text. They were found while reading Stories during the lookup and were not copied anywhere. Revoking that key and editing those comments is the QA lead's decision.
- Knowledge files added or changed: None.

**Files**
- [requirements analysis](qa-artifacts/1-requirements-analysis/AP-2434_requirements-analysis.md) — open questions re-checked, with the queries per question
- [requirement capture](requirements/AP-2434-admin-api-create-warranty-notes.md) — "Ticket changes since capture — 2026-11-15" appended
- [run state](qa-artifacts/.pipeline/AP-2434.md)
- [test report](qa-artifacts/5-testing-report/AP-2434_test-report.md) — unchanged, 2026-11-05
- [execution log](qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2434_2026-11-05.md) — unchanged

## Automation
Not run yet.
