# Run Summary — AP-2410: [AP-2405] Dealer portal - Chubb Insurance Quote - page, although fill all required options but still receive an error message when submit
Updated: 2026-11-01T01:56:55Z · Run folder: no-sprint · Stages run: s3 (rework) → s3b · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2410: Chubb Insurance Quote page shows an error on a valid submit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : bug re-test — steps to reproduce + expected result · s1 skipped
 Test cases   : 4 designed, reworked twice after review · 0 proposed (s3b skipped)
 Execution    : 0 PASS · 0 FAIL · 0 BLOCKED (not run — design only)
 Bugs         : 0 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS
 Verdict      : — (not executed)
 Tickets      : AP-2410 unchanged · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s3b (--until s3b — design only, ticket is in Jira status QA, not QC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Stopped:** at s3b — design only, because AP-2410 is in Jira status "QA", which this project does not map to ready for QA, so the fix may not be on staging yet. Resume with "AP-2410 --from s4" once the ticket reaches QC.

**What passed**
- None. No test case was executed in this run.

**Failures**
- None. No test case was executed in this run.

**Decisions made**
- Intake: AP-2410 is a Bug, so the run followed the bug re-test flow — requirements analysis (s1), test plan (s2) and peer review (s3b) were skipped, and the bug's steps to reproduce and its expected result "Submit successfully" are the requirement.
- Run folder: `no-sprint` — the ticket has no sprint and no fix version, and the registry sets no default run folder (reviewer rule E3).
- Gate A: not applicable — s1 skipped by the bug re-test flow.
- Gate B (rule B3, after rework): the first inline review approved the cases, but an independent review (round 1) asked for rework — 1 Major and 2 Minor findings. That earlier approval is superseded. Fixed: step 1 of AP2410_001 and AP2410_002 no longer requires the "Add creditors insurance" link (two knowledge sources disagree on whether it is shown, and step 2 opens the page by URL), so it only records whether the link appears; the ticket's two screenshots were read and the original errors are named in the test cases; step 4 of every case records the full text of any error banner; AP2410_002 step 3 confirms each field was changed from the restored PM30 / English values. s3b was not re-run.
- Gate B (rule B3, after round-2 rework): the independent review (round 2) asked for rework again — 2 Major and 1 Minor findings; the round-1 approval is superseded. Fixed: step 1 of every quote case now records the financing's term, date of birth and co-borrower, and every coverage term uses that recorded term, because the contract setup guide says the Life term must match the financing term (a financing this batch adds uses 12 months, the term in the reported screenshot); a new High re-test, AP2410_004, replays the exact inputs that produced "Debtor is -1 years old" (Tax exempt Yes, co-borrower and Both coverage); AP2410_003's Disability is now fixed to 30D_RETRO. The file was renamed to AP2410_TestCases_001-004.md. s3b was not re-run.
- Original errors, from the screenshots: on 2026-02-07 rate table RT50 returned "To sign up for creditor program please contact Unity at 1 (888) 561-1101." (HTTP 400); on 2026-03-29 rate table PM30 returned "Debtor is -1 years old. Age of Debtor is not within the plan limits." (HTTP 400). The second is the one the fix must remove.
- Gate C: not reached — no execution.
- Gate D: not reached — the ticket's status and assignee were not changed.
- Test design: the two re-test cases run the ticket's own steps on quote 6167, once with rate table PM30 in English and once with PM50 in French, because the developer asked on 2026-03-23 to "try PM50 or PM30". A fourth, AP2410_004, replays the inputs from the 2026-03-29 screenshot, because the first two use borrower-only coverage and would pass even if only that path were fixed. A regression case (AP2410_003) sends the same Chubb rating call from the Insurance Quick Quote page.
- One open question, Q-001 (Judgement): the developer wrote "RT is not available right now", but nothing says whether an RT rate table should still be offered. AP2410_001 only records the options the Form dropdown lists; no result depends on the answer.
- A second open question, Q-002 (Judgement), applies only if quote 6167's financing has no co-borrower: nothing says whether co-borrower or Both coverage should then be accepted or refused. AP2410_004 then records the outcome and fails only on objective faults, such as an impossible age like "-1 years old".

**Left behind**
- Test data on Staging: None — nothing was executed. When s4 runs it will add a financing to quote 6167 if it has none and save a Chubb insurance quote on it (PM50 / Français after AP2410_002, replaced by the AP2410_004 replay if that saves).
- Observations that are not failures: None.
- Knowledge files added or changed: None.

**Files**
- [AP2410_TestCases_001-004.md](qa-artifacts/3-test-cases/AP2410_TestCases_001-004.md)
- [requirement capture](requirements/AP-2410-ap-2405-dealer-portal-chubb-insurance-quote.md)
- [review record](qa-artifacts/7-reviews/AP-2410_review.md)
- [run state](qa-artifacts/.pipeline/AP-2410.md)

## Automation
Not run yet.
