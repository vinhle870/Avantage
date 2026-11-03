# Run Summary — AP-2491: Cleanup deprecated functions
Updated: 2026-11-01T01:13:00Z · Run folder: no-sprint · Stages run: intake → s1 · Run status: stopped_at_gate

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2491: Cleanup deprecated functions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 1 REQ · 2 High risks
 Test cases   : 0 designed · 0 proposed by review
 Execution    : 0 PASS · 0 FAIL · 0 BLOCKED
 Bugs         : 0 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS
 Verdict      : — (not tested)
 Tickets      : AP-2491 unchanged · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s1 (Gate A rule A1 — every requirement blocked by an unanswered question; parked by the reviewer, waiting on the author)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Stopped:** at s1 — AP-2491 has no description, no acceptance criteria and no comments, so its only requirement is blocked by question Q-001 (which deprecated functions were removed, where they were used, and what a user should observe afterwards). The question was posted on the ticket for the author. Resume with "AP-2491 --from s1" once it is answered.

**What passed**
- None. No test case could be designed, so nothing was tested.

**Failures**
- None.

**Decisions made**
- Gate A (rule A1, by the reviewer — R1 PARK): the questions comment was posted on AP-2491 (comment 19436, read back) and the run stopped — evidence: 1 requirement, 1 of 1 has a Blocking + Open question (Q-001); 1 Judgement question (Q-002) is held for the story comment; 0 Info.
- Gate B: not reached — s2, s3 and s3b did not run.
- Gate C: not reached — no execution in this run (browser not used; run limited to s3b).
- Gate D: not reached — no ticket status or assignee was changed.
- Run folder: `no-sprint`, because the ticket has no sprint, no fix version and the registry has no default run folder (reviewer rule E3).
- Status check: AP-2491 is in QC, which maps to ready_for_qa, so the build should contain the change once testing can start.

**Left behind**
- Test data on v2staging: None.
- Observations that are not failures: Jira's development panel shows code activity in 5 repositories and a deployment to preprod on 2026-10-15, but it does not name the removed functions, so it was not used as requirement text. The CLI first posted the questions comment with a mis-encoded dash; it was rewritten through the REST API and now reads correctly.
- Knowledge files added or changed: None.

**Files**
- [requirement capture](../../requirements/AP-2491-cleanup-deprecated-functions.md)
- [AP-2491_requirements-analysis.md](../1-requirements-analysis/AP-2491_requirements-analysis.md)
- [review record](../7-reviews/AP-2491_review.md)
- [run state](../.pipeline/AP-2491.md)

## Automation
Not run yet.
