# Run Summary — AP-2504: Generate contract for a quote's GAP/Creditor Insurance product
Updated: 2026-11-15T09:32:35Z · Run folder: no-sprint · Stages run: analyze → analyze · Run status: stopped by --until analyze (before Gate A, awaiting the independent R1 review)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2504: Generate contract for a quote's GAP/Creditor Insurance product
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 5 REQ · 13 questions: 1 Blocking Open (Q-001) · 3 Answered · 9 Accepted
 Test cases   : 11 designed (unchanged) · AP2504_002 still BLOCKED by Q-001
 Execution    : not re-run — last run 2026-11-03: 9 PASS · 1 FAIL · 1 BLOCKED (Environment: Dev)
 Bugs         : none filed or changed by this run
 Corrected    : 0 test cases rewritten
 Verdict      : — (last verdict 2026-11-03: FAIL)
 Tickets      : AP-2504 unchanged (QC, Ken Nguyen) · nothing posted
 Stopped at   : analyze (--until)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** On the QA's instruction of 2026-11-15, the analysis of AP-2504 was re-checked: every open question went through the knowledge lookup (a search of Jira Story and Task tickets for a sentence that answers it). Twelve of the thirteen questions are now settled, but the one Blocking question, Q-001, stays open, so the blocked test case cannot run yet. Nothing was posted to Jira and no browser was used.

**What passed**
- Nothing was executed in this run. The 2026-11-03 results stand: 9 of 11 cases passed on Dev.

**Failures**
- None new. AP2504_006 (raw codes "FREQUENCY_MONTHLY" / "TYPE_FINANCING" in the financing section) stays failed under bug AP-2538.

**Decisions made**
- Q-001 (Blocking) stays Open. It is not missing product knowledge: the ticket contradicts itself. Acceptance criterion 1 starts from a GAP insurance quote and expects the GAP address, yet tells the dealer to use "the Extended Warranty row actions", while the description talks about the GAP action. The search found no answer (the sibling stories AP-2505 and AP-2506 carry the same copied wording), and the behaviour of the build is never used to pick one reading. AP2504_002 stays BLOCKED. The question was already asked in comments 19460 and 19533, so nothing new is posted.
- Answered from other Stories: Q-006 (which fields the dealer may edit, and what an edit changes) by AP-2544, AP-2545 and AP-2550; Q-009 (where the GAP contract PDF is offered) by AP-2431; Q-011 (the creditor page uses the same standard sections) by AP-2544, AP-2545 and AP-2546. AP-2544, AP-2545, AP-2546 and AP-2550 are later Stories on the same contract page (Deploy to staging / In Progress); the 2026-11-03 build predates them.
- Accepted as the expected result (no Story defines them, so what Dev showed on 2026-11-03 is correct): Q-002, Q-003, Q-004, Q-005, Q-007, Q-008, Q-010, Q-012, Q-013. The acceptance criteria still win where they state a result: read-only financing (AC 3), and the bugs AP-2538, AP-2539 and AP-2540 stay valid.
- Gate A is left to the independent reviewer (R1). No later stage was set back to pending, because no test case became runnable.

**Left behind**
- No test data, no Jira change, no knowledge-file change.

**Files**
- [requirements analysis](qa-artifacts/1-requirements-analysis/AP-2504_requirements-analysis.md) — see *Knowledge lookup — 2026-11-15* for every query tried
- [requirement capture](requirements/AP-2504-generate-contract-for-a-quotes-gap.md) — *Ticket changes since capture — 2026-11-15*
- [run state](qa-artifacts/.pipeline/AP-2504.md)
- Last test report: [AP-2504_test-report.md](qa-artifacts/5-testing-report/AP-2504_test-report.md)

## Automation
Not run yet.
