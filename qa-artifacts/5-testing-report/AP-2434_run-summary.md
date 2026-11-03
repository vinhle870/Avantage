# Run Summary — AP-2434: Admin API: create warranty notes
Updated: 2026-11-01T01:15:00Z · Run folder: 5.0.0 · Stages run: intake → s3b · Run status: stopped_at_gate

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2434: Admin API: create warranty notes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 4 REQ · 1 High risks
 Test cases   : 8 designed (all BLOCKED by Q-002) · 8 proposed by review
 Execution    : 0 PASS · 0 FAIL · 0 BLOCKED (not run — design only)
 Bugs         : 0 filed · 0 linked to existing · 0 not a bug
 Corrected    : 8 test cases reworked at s3 (independent R2 review) · 0 retired · re-run 0/0 PASS
 Verdict      : — (not executed)
 Tickets      : AP-2434 unchanged · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s3b (--until s3b — design only, by the run's instruction)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Stopped:** at s3b — the run was limited to design (`--until s3b`), so nothing was executed. Resume with "AP-2434" (it continues from s4), but only after QA has a staging admin API key: every test case is BLOCKED without one.

**What passed**
- None. No test case has been executed yet. Eight test cases are designed and approved: a valid API call with the key creates a note that appears on the warranty in the admin area (AP2434_001, public; AP2434_002, private), HTML note text just over 255 characters is kept in full (AP2434_003), and five cases record how the API treats a missing key, a wrong key, missing fields, an unknown warranty ID or an invalid public flag, and a script tag in the HTML (AP2434_004–008).

**Failures**
- None. Execution has not run.

**Decisions made**
- Gate A (rule A3, by the reviewer, R1 APPROVE): continue — no Blocking question. Ten questions stay open and were not posted: eight Judgement (the path "/api/admin/warranty/-notes" may be a typo; no success response, validation or key-rejection behaviour is specified; where the note appears and how `description` differs from `file_content`; whether HTML is rendered and scripts removed; the upper length limit) and two Info (how QA gets an API key; what `is_public` changes outside the admin area). They reach the author in the s7 comment.
- Gate B (rule B3, by the reviewer, R2 round 2 APPROVE): execute the current eight cases. Round 1 returned REWORK because AP2434_003 asserted that a 2,000-character note must be accepted, which the ticket does not say (it says only "more than 255 characters"); the case was corrected so that result is recorded, failing only on silent truncation. Not promoted: French accented text, titles over 255 characters, quotes and SQL-like text (Medium); double submit, empty strings, JSON body, other omitted fields, dealer-side visibility of public notes (Low).
- Gate B, independent R2 review (REWORK, 1 blocker · 2 major · 4 minor): the cases were reworked at s3 and Gate B rule B3 stands; the s3b coverage review was not re-run. Fixes: every request now sends fields with `curl --form-string` and `-sS` — with `-F`, curl treated each note body starting with `<` as a local file and sent nothing, silently — and a response with no HTTP status line makes the case BLOCKED (environment), not PASS or FAIL. In AP2434_004/005, a note stored after the API refused the key now fails (test plan §3.2). AP2434_001 records both the URL record ID and the displayed warranty number, retries once on "warranty not found", and fails for the path (Q-001) only on a route "not found". Also: how to load the key from `/.env` by variable name, existing note titles recorded before the no-key/wrong-key calls, rendered or raw HTML both counting as a match, and an unknown warranty value built in the same format as `<W>` instead of `999999999`.
- Gate C: not reached — no execution.
- Gate D: not reached — AP-2434 was not commented on or moved.
- Run folder `5.0.0`, taken from the ticket's fix version (the ticket has no sprint). The ticket is in QC, which maps to ready for QA.
- All eight cases were set BLOCKED at design time by Q-002: there is no admin API key in `/.env` or in any knowledge file, and the API host is only assumed to be the portal host.

**Left behind**
- Test data on v2staging: None.
- Observations that are not failures: This is the project's first API-only story — the framework has no `api` capability and the `api-baseline` knowledge source is missing, so the cases send requests with `curl` and save the raw responses as evidence. The admin page that shows a warranty's notes is not mapped yet; AP2434_001 step 1 records it at execution. The ticket clones AP-2371 (Admin API: upload claim attachment, Done), which may show how the team provisions API keys.
- Knowledge files added or changed: None.

**Files**
- [requirement capture](requirements/AP-2434-admin-api-create-warranty-notes.md)
- [AP-2434_requirements-analysis.md](qa-artifacts/1-requirements-analysis/AP-2434_requirements-analysis.md)
- [AP-2434_test-plan.md](qa-artifacts/2-test-plan/AP-2434_test-plan.md)
- [AP2434_TestCases_001-005.md](qa-artifacts/3-test-cases/AP2434_TestCases_001-005.md)
- [AP2434_TestCases_006-008.md](qa-artifacts/3-test-cases/AP2434_TestCases_006-008.md)
- [AP2434_ReviewFindings_2026-11-01.md](qa-artifacts/3-test-cases/AP2434_ReviewFindings_2026-11-01.md)
- [review record](qa-artifacts/7-reviews/AP-2434_review.md)
- [run state](qa-artifacts/.pipeline/AP-2434.md)

## Automation
Not run yet.
