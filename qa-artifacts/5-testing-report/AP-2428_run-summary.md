# Run Summary — AP-2428: Dealer Permaplate Contract
Updated: 2026-11-02T01:50+07:00 · Run folder: 5.0.0 · Stages run: s5 → s7 (s1–s4 on 2026-11-01/02, earlier run) · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2428: Dealer Permaplate Contract
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 8 REQ · 5 High risks
 Test cases   : 15 designed · 10 proposed by review (1 promoted)
 Execution    : 9 PASS · 4 FAIL · 2 BLOCKED
 Bugs         : 4 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS
 Verdict      : FAIL
 Tickets      : AP-2428 unchanged (QC) · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2428 FAIL — 9 of 15 test cases passed on Dev (v2dev), missing the 90% threshold (60%). 4 bugs filed. Ticket comment posted and verified (comment 19447).

**What passed**
- Create contract control: a quote with a saved Permaplate selection offers "Generate Contract" (in the ⋯ menu of the Esthetic protection row on the quote details page), and it opens the contract form with its Vehicle, Owner and Program Summary sections (AP2428_001). Quotes with no selection, or with a contract already made, offer no control and redirect safely (AP2428_002, AP2428_013).
- Vehicle prefill: Make, Model, VIN, Odometer and Delivery date are prefilled with the vehicle's values (AP2428_003).
- Program summary: term, start date (= delivery date), end date and every selected option are shown as read-only text (AP2428_006).
- Generate Contract: submitting returns the dealer to the quote details page with a PDF icon (AP2428_009); blank Last name or VIN is refused with no contract made (AP2428_011); a double click creates exactly one contract and one invoice (AP2428_015).
- Stored values: an existing contract keeps its cost price (225.00$) after the admin changes the option's Dealer Cost (AP2428_014).

**Failures**
- AP2428_010 — the contract PDF download returns HTTP 500 and a French technical-error page for every contract on Dev (quotes 6456, 6457, 6460 and the older 6284); the same link returned a PDF on staging on 2026-10-04. Gate C: filed as AP-2512 (High), relates to AP-2459.
- AP2428_012 — the contract with an edited address is created, but its PDF download returns the same HTTP 500. Gate C: covered by AP-2512.
- AP2428_005 — "Other name on file (Company's name)" is empty although the client's company is "Garage Test 2428 Inc", and Province is a free-text box instead of a dropdown. Gate C: filed as AP-2513 (Medium) and AP-2514 (Medium).
- AP2428_007 — the Program Summary has no "Cost Price" label; the correct amount (225.00$, equal to the quote Cost) is labelled "Total". Gate C: filed as AP-2515 (Low).

**Decisions made**
- Gate A (rule A2, by the reviewer R1): 3 Blocking questions (Q-001–Q-003) posted on AP-2428 on 2026-11-01 and the run continued — 3 Blocking, 7 Judgement, 2 Info.
- Gate B (rule B2, by the reviewer R2): the one High review proposal (double-click Generate Contract) was promoted as AP2428_015; 9 Medium/Low proposals not promoted.
- Gate C (rule C4 for every FAIL, by the reviewer R3): AP2428_010 + AP2428_012 → one new bug AP-2512; AP2428_005 → two new bugs AP-2513 and AP-2514 (two fields, two fixes); AP2428_007 → new bug AP-2515. No capture sentence or comment says any actual result is intended, and 17 duplicate searches found no matching open bug.
- Gate D (rules, automatic, by the reviewer R4): AP-2428 not moved — pass rate 60% (needs 90%), AP-2512 (High) open, and Q-001, Q-002, Q-003 (Blocking) unanswered. Status stays QC, assignee unchanged. AP-2512 to AP-2515 are in Backlog, so no bug-ticket action.
- Environment: executed on Dev (v2dev) by the user's decision; staging was not opened. Run folder 5.0.0 from the fix version. s4c skipped (no "not a bug" decision). R3 minor findings F-1 and F-5 applied to the execution log; F-2's question posted in the s7 comment as a Judgement item.

**Left behind**
- Test data on Dev (v2dev): quotes 6456–6460; contracts PNA-0000000017, PNA-0000000018 and PNA-0000000019; invoices #938, #939 and #940 ($258.69 each). Option 20's Dealer Cost was changed and restored to 80.00.
- Observations that are not failures: the invoice is $258.69 (225 + 14.975 % Quebec taxes) while the banner says "Invoice #N ($225) is created"; the quote details row prints the currency twice ("Cost: CA$225.00$"); the vehicle section is titled "Vehicle identification"; Make, Model and Delivery date are read-only (asked as a Judgement item); Q-001–Q-003 are still unanswered — Ken Nguyen reminded in comment 19447.
- Knowledge files added or changed: None in this run (s4 added the Dev facts to qa-docs/quote-creation.md, base-test/navigation-map.md and base-test/test-centralized.md).

**Files**
- [AP-2428_test-report.md](qa-artifacts/5-testing-report/AP-2428_test-report.md)
- [AP-2428_bug-report.md](qa-artifacts/5-testing-report/AP-2428_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md)
- [run state](qa-artifacts/.pipeline/AP-2428.md)

## Automation
- Spec: `playwright-automation/src/tests/dealer/permaplateContract_AP2428.spec.ts`, tag `@AP-2428` (Dev v2dev only; read-only on Dev quotes 6456, 6458 and 6459; AP2428_014 changes option 20's Dealer Cost and restores it in `finally`). Reviewer R5: APPROVE, 2 minor findings.
- 7 of 9 PASSED cases automated — 7 passing, 0 fixme (lint pass; `--repeat-each=2`: 14 passed, no flaky tests).
- Not automated: AP2428_009 — passed, but every run would leave a new quote, contract and invoice on Dev. AP2428_015 — same reason. AP2428_005, _007, _010, _012 — FAIL (AP-2512 to AP-2515). AP2428_004, _008 — BLOCKED (Q-001–Q-003).
- PR skipped: gh CLI not installed. Four new files left uncommitted for the QA: src/pages/dealerPortal/PermaplateContractPage.ts, src/pages/adminPortal/AdminPermaplateOptionPage.ts, src/flows/PermaplateContractFlow.ts, src/tests/dealer/permaplateContract_AP2428.spec.ts.
