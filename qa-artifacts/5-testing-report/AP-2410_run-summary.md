# Run Summary — AP-2410: [AP-2405] Dealer portal - Chubb Insurance Quote - page, although fill all required options but still receive an error message when submit
Updated: 2026-11-08T04:15:54Z · Run folder: no-sprint · Stages run: update-ticket → update-ticket · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2410: Chubb Insurance Quote page shows an error on a valid submit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : bug re-test — steps to reproduce + expected result · analyze skipped
 Test cases   : 4 executed · 0 proposed (review-cases skipped)
 Execution    : 4 PASS · 0 FAIL · 0 BLOCKED (Environment: Dev, v2dev)
 Bugs         : 2 filed (AP-2557, AP-2558 — Medium) · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS
 Verdict      : PASS
 Tickets      : AP-2410 → Done · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : update-ticket (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2410 PASS — 4 of 4 test cases passed on Dev (v2dev), meeting the 90% pass-rate threshold. 2 bugs filed (AP-2557, AP-2558, Medium). Ticket comment posted and verified (id 19523); AP-2410 moved to Done.

**What passed**
- Chubb creditors insurance quote on a dealer quote with PM30 in English (AP2410_001): Get Quote saved it with "Chubb insurance quote saved successfully" at CA$15.74 /m, with no error.
- The same with PM50 in French (AP2410_002): saved at CA$21.78 /m, with no error.
- Insurance Quick Quote (AP2410_003, regression): PM30 with Life, Critical illness and Disability priced in two result tables, with no error.
- Replay of the reported 2026-03-29 inputs (AP2410_004): with a co-applicant on the financing, Critical illness for the Co borrower and Disability for Both saved at CA$150.92 /m. "Debtor is -1 years old" and the HTTP 400 did not appear. Only Life "Residual Value Coverage" was replaced (by "Decreasing"), because Dev does not offer it.

**Failures**
- None. Both bugs below come from observations on passing cases, filed by the reviewer's Gate C decision:
  - AP-2557 (BUG-001, Medium) — reopening a quote saved with PM50 shows Form "Monthly Premium PM30", so Get Quote would re-price it as PM30. Seen in AP2410_002.
  - AP-2558 (BUG-002, Medium) — a co-applicant saved with only a name and date of birth shows another client's email and phone in the quote's Co-applicant block. Seen in AP2410_004.

**Decisions made**
- Gate A: not applicable — analyze is skipped by the bug re-test flow.
- Gate B (rule B3, by reviewer — R2 round 2): execute the current cases AP2410_001–004.
- Gate C (by reviewer — R3 round 3, APPROVE): no FAIL, so rules C1–C4 were not triggered by any case. O-1 → File new (rule C4) → AP-2557, relates to AP-2410 and AP-2528. O-7 → File new (stop rule E2 settled by the reviewer: AP-2541 names the same block with another behaviour) → AP-2558, relates to AP-2410 and AP-2541. O-2, O-3, O-4, O-5, O-6 and O-8 recorded, not filed. No stopping bug.
- Filing (apply_mode automatic): both bugs created as Medium, assigned to Minh Lưu (`bug_new_assign`, account id read back), labels qa-agent and stlc-automated. Each description is condensed to the bug description shape, and its screenshots are embedded in the description and verified through the read-back (AP-2557: 2 of 2; AP-2558: 1 of 1). At the orchestrator's request, the AP-2558 summary carries no contact values. Its description states them once and says whose they are.
- Verdict (s6): PASS under the default exit criteria (no test plan in the bug re-test flow): 100% pass rate, 0 Critical and 0 High bugs open.
- Gate D (rules, automatic — decided by reviewer R4 round 1, routing.md §3.2 All PASS): AP-2410 → Done (QA → Done, read back), assignee unchanged (Vinh Le - QC). The bug re-test comment (REST v2 wiki markup, read back) lists the 4 PASS cases, the line "Not replayed: Life Residual Value Coverage (not offered on Dev; Decreasing used). Tested on Dev, not staging.", questions O-2, O-8 and Q-001, and the related bugs AP-2557 and AP-2558 (Medium, not stopping). No action on AP-2557/AP-2558.

**Left behind**
- Test data on Dev: quote 6696 (client Retest Chubb2410-001, `client.stage.2410001@yopmail.com`, on vehicle 915, which was not edited). The quote carries its financing (25,000.00$, Term 12, AutoCapital Canada), the co-applicant Coapp Retest2410 (born 1988-04-10) and a saved Chubb creditor quote (PM30, English, Tax exempt Yes, CA$150.92 /m). No contract was generated. This run created no new test data; it wrote only to Jira.
- Questions for the developer (posted in the AP-2410 comment, with Q-001 — only PM30/PM50 offered, no RT table; is RT meant to return?):
  - O-2: Tax exempt "Yes" still shows 9 % tax on every coverage row. Should it remove the tax?
  - O-8: the Borrower's Life premium went from 16.25$ to 16.60$ once a co-applicant existed, with the same Life inputs. Is that intended?
- Observations that are not failures:
  - O-3: the reopened insurance page shows no Coverage table; it is shown only in the row details.
  - O-4: changing the Form clears the Life type.
  - O-5: some coverage options are hidden; Residual Value Coverage is not offered on Dev; "For" offers only Borrower until the financing has a co-applicant.
  - O-6: the Quick Quote result is in French although the UI is in English.
- Knowledge files added or changed: none in this run (update-ticket wrote only to Jira). The earlier s4 runs wrote `quote-creation.md`, `chubb-insurance.md` and `test-centralized.md`.

**Files**
- [AP-2410_test-report.md](qa-artifacts/5-testing-report/AP-2410_test-report.md)
- [AP-2410_bug-report.md](qa-artifacts/5-testing-report/AP-2410_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2410_2026-11-08.md)
- [run state](qa-artifacts/.pipeline/AP-2410.md)

## Automation
- Spec: `playwright-automation/src/tests/dealer/chubbInsuranceQuote_AP2410.spec.ts` · tag `@AP-2410`
- 4 of 4 PASSED cases automated — 4 passing, 0 fixme (lint clean, two full runs green)
- Not automated: none. AP2410_001 step 1 (create quote + financing) and AP2410_004 step 1 (add co-applicant) are replaced by read-only guards on quote 6696, which the manual run left on Dev
- PR skipped: vcs not available (gh not logged in); awaiting R5 review (`--review external --no-pr`)
