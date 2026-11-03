# QA Review Record — AP-2491

## R1 — Requirements analysis — round 1 — 2026-11-01T01:12:00Z
Reviewed: requirements/AP-2491-cleanup-deprecated-functions.md, qa-artifacts/1-requirements-analysis/AP-2491_requirements-analysis.md, qa-artifacts/.pipeline/AP-2491.md
Verdict: **PARK** · Gate A: Post the Blocking question on AP-2491 and stop until the author answers — rule A1 (stop point E1, reviewer rule: PARK, waiting on author)
Findings: 0 blocker · 0 major · 1 minor

The analysis was read from disk and is faithful to the capture: the ticket has only a summary line, no description, no acceptance criteria and no comments, and the analysis extracts one requirement without inventing any criterion. Its only requirement, REQ-001, carries an Open Blocking question (Q-001), so every requirement is blocked and Gate A rule A1 applies. Nothing can be designed or tested until the author names the removed functions and the screens they served; the Blocking question was posted on AP-2491 as comment 19436 and read back.

Checklist: 1.1 pass (the capture has no acceptance criterion to map) · 1.2 pass (no REQ states behaviour absent from the capture) · 1.3 pass (Q-001 Blocking/Open, Q-002 Judgement/Open) · 1.4 pass (REQ-001 has no AC and has Blocking Q-001) · 1.5 pass (no question is marked Answered).

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP-2491_requirements-analysis.md — REQ-001 User Story row | The row offers a "plausible reading" of a user story that the ticket does not contain; it is labelled as an inference and no result depends on it, but it could be read as scope. | On the next s1 run, write only "Not stated in the ticket." unless the author supplies a user story. |

Parked because: the ticket has no description or acceptance criteria, and only the author (Nicolas-Eric Tain) can say which deprecated functions were removed, where they were used and what a user should observe afterwards. Resume with "AP-2491 --from s1" once Q-001 is answered on the ticket.
