# Run Summary — AP-2459: [BUG-001][AP2446_001] Permaplate contract generation returns HTTP 500 when Financing company is left unselected
Updated: 2026-11-08T03:20:23Z · Run folder: no-sprint · Stages run: update-ticket → update-ticket · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2459: Permaplate contract generation returns HTTP 500 when Financing company is left unselected
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 0 REQ (bug re-test — analyze skipped) · 0 High risks
 Test cases   : 3 designed · 0 proposed by review
 Execution    : 2 PASS · 0 FAIL · 0 BLOCKED · 1 SKIPPED (Environment: Dev)
 Bugs         : 0 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS
 Verdict      : PASS (2 of 2 counted, 100%; threshold 90%)
 Tickets      : AP-2459 → Done · 0 bugs updated (0 → Done, 0 → In Progress); AP-2512 commented, unchanged
 Stopped at   : update-ticket (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2459 PASS — 2 of 3 test cases passed on Dev (2 of 2 counted, 100%; the third was skipped by its own rule), meeting the 90% threshold. 0 bugs filed. Ticket comment posted and verified, and AP-2459 moved to Done.

**What passed**
- Esthetic protection (Permaplate) contract with no financing company (AP2459_001, the reported scenario): on Dev the dealer no longer gets the French "technical difficulties" error page. The form refuses the submission with "This value should not be blank." directly above the Financing company field, keeps every other value, and creates no contract and no invoice.
- Esthetic protection contract with a financing company chosen (AP2459_002): choosing "AutoCapital Canada" still generates contract PNA-0000000021 and invoice 945 ($91.98).

**Failures**
- None. AP2459_003 (PDF of a contract made with no financing company) is SKIPPED by its own step 2 rule, because such a contract can no longer be created.

**Decisions made**
- Gate B (rule B3, decided by qa-reviewer R2 round 1): execute the current cases.
- Gate C (decided by qa-reviewer R3 round 1): not reached — no failures; file-bugs wrote a zero-defect bug report.
- Gate D (rules, automatic; approved by qa-reviewer R4 round 1, rule §3.2 All PASS): AP-2459 → Done, assignee unchanged (Vinh Le - QC); bug re-test comment posted with the one observation that the Financing company label has no "*". The prepared note was posted on AP-2512 unchanged; AP-2512 stays in Backlog, assigned to Minh Lưu.
- R4 minor finding F-1 applied: the comment's Evidence line names screenshot files only, each "What was checked" cell is one line, and nothing else from the test report's Risks section was added.
- Bug re-test run on the QA's decision of 2026-11-08 although AP-2459 was in Jira status "QA" (not "QC"); the normal outcome rules applied. Run folder no-sprint. The browser was not used in this run.

**Left behind**
- Test data on Dev: quote 6689 (Perma Retest2459, `client.stage.2459001@yopmail.com`, no contract); quote 6690 (Perma Finance2459, `client.stage.2459002@yopmail.com`, contract PNA-0000000021, invoice 945 Payment pending); quote 6691 (Perma Pdf2459, `client.stage.2459003@yopmail.com`, no contract). All on vehicle 915. Dealer 1380's "10 ans" link left unchanged. Nothing new was created by this run.
- Observations that are not failures: the Financing company label has no "*" although the field is now required; the PDF of PNA-0000000021 returns HTTP 500 (AP-2512, High, Backlog); the contract page's vehicle line shows CA$10,000.00 though the quote price is 25000. In the posted Jira comments, the CLI rendered the `*Environment:*`-style labels in italics rather than bold; the content is unchanged.
- Knowledge files added or changed: None.

**Files**
- [AP-2459_test-report.md](AP-2459_test-report.md)
- [AP-2459_bug-report.md](AP-2459_bug-report.md)
- [execution log](../4-execution-results/no-sprint/execution-log_AP-2459_2026-11-08.md)
- [run state](../.pipeline/AP-2459.md)

## Automation
- Spec: `playwright-automation/src/tests/dealer/permaplateFinancingCompany_AP2459.spec.ts` · tag `@AP-2459`
- 2 of 2 PASSED cases automated — 2 passing, 0 fixme (awaiting the independent R5 review)
- AP2459_003 — not automated: SKIPPED manually by its own rule (a contract without a financing company can no longer be created)
- PR skipped: vcs not available (gh not logged in); run with `--review external --no-pr`
