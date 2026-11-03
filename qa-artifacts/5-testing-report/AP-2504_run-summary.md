# Run Summary — AP-2504: Generate contract for a quote's GAP/Creditor Insurance product
Updated: 2026-11-03T04:52:30Z · Run folder: no-sprint · Stages run: s5 → s7 · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2504: Generate contract for a quote's GAP/Creditor Insurance product
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 5 REQ · 3 High risks
 Test cases   : 11 designed · 9 proposed by review (none promoted, rule B3)
 Execution    : 9 PASS · 1 FAIL · 1 BLOCKED   (Environment: Dev)
 Bugs         : 4 filed (AP-2538, AP-2539, AP-2540, AP-2541) · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · s4c skipped (no C1 decision)
 Verdict      : FAIL
 Tickets      : AP-2504 unchanged (QC) · 0 bugs updated (none in the QA status)
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2504 FAIL — 9 of 11 test cases passed on Dev (81.8%), missing the 90% threshold. 4 bugs filed. Ticket comment 19462 posted and verified; the story stays in QC.

**What passed**
- Opening the contract page (AP2504_001, AP2504_010): "Generate Contract" on the Gap Insurance row and on the Creditors insurance row opens a full page in the same tab, with no pop-up; the GAP address also opens when typed.
- Layout and pre-fill (AP2504_003, AP2504_004, AP2504_005): the GAP page shows the vehicle, owner and financing on the left and the Program Summary with the button on the right; vehicle, owner and co-applicant values are filled in from the quote.
- Financing is read-only (AP2504_006 steps 4–5): the financing values cannot be changed on the page.
- Creating contracts (AP2504_007, AP2504_011): the GAP page created GAP contract AVPG000064 and the creditor page created creditor contract AVP000171.
- Error and repeat handling (AP2504_008, AP2504_009): an emptied owner last name is refused with a message and creates nothing; a quote with a GAP contract offers no second one.

**Failures**
- AP2504_006 — the financing section of the GAP and creditor contract pages shows "FREQUENCY_MONTHLY" and "TYPE_FINANCING" instead of "Monthly" and "Financing", in English and French, and five labels stay in English on the French page. Gate C: filed as AP-2538 (Medium, rule C4).

**Decisions made**
- Gate A (rule A2, by reviewer R1, earlier run): Q-001 posted as comment 19460; AP2504_002 stays BLOCKED until it is answered (still unanswered on 2026-11-03T04:51Z).
- Gate B (rule B3, by reviewer R2 round 1, earlier run): executed the current 11 cases.
- Gate C (by reviewer R3 round 1): AP2504_006 → rule C4, new bug AP-2538 (Medium). No sentence states the raw codes are intended, and no open bug covers this section. Record-only observations filed on the reviewer's plan: AP-2539 (High, Chubb contract PDFs HTTP 500, relates to AP-2519 and AP-2512, not an AP-2504 regression, so steps 5 of 007 and 011 stay PASS), AP-2540 (Low, wrong product in the "already created" message), AP-2541 (Low, co-applicant date of birth, standalone, not counted against AP-2504). Observation (b), no invoice, left recorded under Q-008/Q-009.
- Gate D (rules, automatic): AP-2504 not moved. The pass rate is 81.8% (needs 90%) and Q-001 (Blocking) is unanswered; AP-2538 also fails AC 3. Result comment 19462 posted with all 11 cases and 13 open questions. The four new bugs are in Backlog, not the QA status, so they get no Gate D action.
- Bug severity: AP-2539 was set to High by the bug-reporter severity table (the dealer cannot get the contract document for any Chubb contract), matching the related PDF bugs AP-2512 and AP-2519, which are High. The "file only Severity ≥ Medium" rule was overridden for AP-2540 and AP-2541 by the reviewer's Gate C decision.

**Left behind**
- Test data on Dev: quotes 6562–6566 (clients `client.stage.2504001/004/007/008/010@yopmail.com`), co-applicant "Coowner Coapp2504" on quote 6563, GAP contract **AVPG000064** (quote 6564), creditor contract **AVP000171** (quote 6566). This run (s5–s7) created no new application data; nothing was removed (the `cleanup` source is missing).
- Observations that are not failures: neither Chubb contract creates an invoice (Q-008/Q-009, not filed).
- Knowledge files added or changed: `qa-artifacts/qa-docs/quote-creation.md` — dated Dev refresh note (2026-11-03) under the 2026-11-02 "/gap-insurance-contracts is empty" line, saying AVPG000064 now exists (reviewer minor F-3; added only, the old line kept).

**Files**
- [AP-2504_test-report.md](qa-artifacts/5-testing-report/AP-2504_test-report.md)
- [AP-2504_bug-report.md](qa-artifacts/5-testing-report/AP-2504_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2504_2026-11-03.md)
- [run state](qa-artifacts/.pipeline/AP-2504.md)
- Story comment source: `qa-artifacts/4-execution-results/comment_AP-2504_2026-11-03_result.md`

## Automation
Not run yet.
