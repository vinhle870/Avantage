# Run Summary — AP-2506: Generate contract for a quote's Esthetic protection product
Updated: 2026-11-15T09:41:11Z · Run folder: no-sprint · Stages run: analyze → analyze · Run status: stopped by --until analyze (before Gate A, awaiting the independent R1 review) · Environment: Dev (v2dev) — no browser used in this run

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2506: Generate contract for a quote's Esthetic protection product
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 5 REQ · 12 questions: 1 Blocking Open (Q-001) · 2 other Open (Q-002, Q-012) · 4 Answered · 5 Accepted
 Test cases   : 9 designed (unchanged) · AP2506_002 still BLOCKED by Q-001
 Execution    : not re-run — last run 2026-11-08: 5 PASS · 3 FAIL · 1 BLOCKED (Environment: Dev)
 Bugs         : none filed or changed by this run
 Corrected    : 0 test cases rewritten
 Verdict      : — (last verdict 2026-11-08: FAIL, 55.6%)
 Tickets      : AP-2506 unchanged (QA, Vinh Le - QC) · nothing posted
 Stopped at   : analyze (--until)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** On the QA's instruction of 2026-11-15, the analysis of AP-2506 was re-checked: every open question went through the knowledge lookup (a search of Jira Story and Task tickets for a sentence that answers it). Nine of the twelve questions are now settled, but the one Blocking question, Q-001, stays open, so the blocked test case cannot run yet. Nothing was posted to Jira and no browser was used.

**What passed**
- Nothing was executed in this run. The 2026-11-08 results stand: 5 of 9 cases passed on Dev.

**Failures**
- None new. AP2506_003 (headings, bug AP-2555), AP2506_005 (vehicle price, bug AP-2556) and AP2506_006 (PDF HTTP 500, bug AP-2512) stay failed; the acceptance criteria still decide them, so the lookup changes none of them.

**Decisions made**
- Q-001 (Blocking) stays Open. It is not missing product knowledge: the ticket contradicts itself. Acceptance criterion 1 starts from "a quote with an extended warranty quote" and tells the dealer to use "the Extended Warranty row actions", yet expects the Esthetic protection address, while the description talks about the Esthetic protection action. The search found no answer, and no delivered Story explicitly redesigns this entry point (AP-2551 adds a separate quote-level checkout; AP-2550 and AP-2561 are still In Progress). The behaviour of the build is never used to pick one reading. AP2506_002 stays BLOCKED. The question was already asked on 2026-11-01 and 2026-11-08, so nothing new is posted.
- Answered from other Stories: Q-003 (no "Financing information" card on a quote without GAP/Creditor insurance) by AP-2559 and AP-2546; Q-004 (start date = delivery date, not editable) by AP-2428; Q-007 (vehicle read-only except the VIN, owner fields editable) by AP-2544 and AP-2545; Q-009 (back to the quote page with a PDF download, invoice created and announced) by AP-2428 and AP-2446.
- Accepted as the expected result (no Story defines them, so what Dev showed on 2026-11-08 is correct): Q-005 (end date = start + term), Q-006 (Total = the Cost, no tax), Q-008 (blank required field refused with "This value should not be blank."), Q-010 (action withdrawn, address redirects to the quote), Q-011 (row ⋯ menu "Generate Contract").
- Q-002 (the description says the action "should match Esthetic Protection", naming itself) and Q-012 (whether the change is deployed) are not product knowledge and stay Open.
- Gate A is left to the independent reviewer (R1). No later stage was set back to pending, because no test case became runnable.

**Left behind**
- No test data, no Jira change, no knowledge-file change. For the next Dev run: Stories delivered after 2026-11-08 (AP-2559, AP-2544, AP-2551, AP-2562) may have changed the page or its entry point; they are listed in the analysis.

**Files**
- [requirements analysis](qa-artifacts/1-requirements-analysis/AP-2506_requirements-analysis.md) — see *Knowledge lookup — 2026-11-15* for every query tried
- [requirement capture](requirements/AP-2506-generate-contract-for-a-quotes-esthetic.md) — *Ticket changes since capture — 2026-11-15*
- [run state](qa-artifacts/.pipeline/AP-2506.md)
- Last test report: [AP-2506_test-report.md](qa-artifacts/5-testing-report/AP-2506_test-report.md)

## Automation
Not run yet.
