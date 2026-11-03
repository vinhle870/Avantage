# Run Summary — AP-2503: Generate contract for a quote's extended warranty
Updated: 2026-11-02T01:35:00Z · Run folder: no-sprint · Stages run: s5 → s7 · Run status: complete · Tested on: Dev (v2dev)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2503: Generate contract for a quote's extended warranty
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 5 REQ · 1 High risk (REQ-005 "current process" has no baseline)
 Test cases   : 10 designed · 9 proposed by review (none promoted)
 Execution    : 7 PASS · 3 FAIL · 0 BLOCKED   (Dev, v2dev)
 Bugs         : 3 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired (s4c skipped — no C1 decision)
 Verdict      : FAIL
 Tickets      : AP-2503 unchanged (QC) · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2503 FAIL — 7 of 10 test cases passed on Dev (v2dev), missing the 90% threshold (70%). 3 bugs filed (AP-2530, AP-2531, AP-2532). Ticket comment 19456 posted and verified; the story stays in QC.

**What passed**
- Dedicated page: "Generate Contract" on the Extended warranty row opens a full page at the unchanged address `/quote/{id}/warranty/generate-contract` (HTTP 200, also when typed directly), with no pop-up (AP2503_001).
- Layout: Owner and Financing information sit in the left column; the Program Summary, the "Generate Contract" button and an embedded PDF preview of the warranty contract sit in the right column (AP2503_002).
- Pre-fill: owner, vehicle and financing-company values are copied from the quote, including a quote without financing (AP2503_004, AP2503_010).
- Contract creation: submitting creates the contract and its invoice (APOP01-845, invoice #942), and a start date changed on the page — even one 30 days before delivery — becomes the contract's start date (AP2503_006, AP2503_009, and AP2503_007 steps 4–5).
- Bad input: an emptied last name is refused without an error page and nothing else is lost (AP2503_008).

**Failures**
- AP2503_003 — The Program Summary shows Program Term, Start Date, End date and Sale price but not the vehicle delivery date that acceptance criterion 2 lists there; the date is only in the left "Vehicle identification" section. Gate C: filed as AP-2530 (Medium).
- AP2503_005 — The VIN and the delivery date accept typing (`AP2503TC099999999`, `2026-10-15`) although acceptance criterion 3 says they are read-only; Make, Model, Year and Mileage are editable too, recorded only (Q-003). Gate C: filed as AP-2531 (Medium).
- AP2503_007 — A quote without financing cannot become a contract unless the dealer enters a financing company: six required financing-company fields stop the submit ("Please fill out this field."). Whether this is intended is not known (Q-006, Q-007), so the bug asks for an either/or answer. Gate C: filed as AP-2532 (High), related to AP-2503 and AP-2459.

**Decisions made**
- Gate A (rule A3, earlier run, by reviewer): continue — 0 Blocking, 10 Judgement, 1 Info questions; none posted.
- Gate B (rule B3, earlier run, by reviewer after R2 rework): execute the current cases; 9 review proposals not promoted.
- Gate C (rule C4 for all three, by reviewer R3 round 1 APPROVE): AP2503_003, AP2503_005 and AP2503_007 filed new — no quotable "intended" sentence (0 ticket comments) and no open bug with the same screen and behaviour (AP-2515, AP-2520–2522 and AP-2459 differ). R3 findings F-1–F-3 applied in the bug wording.
- Gate D (rules, automatic, by reviewer R4 round 1 APPROVE): AP-2503 not moved — pass rate 70% (needs 90%) and AP-2532 (High) is a stopping bug; result comment 19456 posted. AP-2530/2531/2532 are in Backlog, so no bug action.
- Environment: Dev (v2dev) by the user's decision; Staging not checked. Run folder `no-sprint` from the earlier intake (rule E3). This run started at s5 (`--from s5`).

**Left behind**
- Test data on Dev (v2dev): vehicles 1125–1129; quotes 6557–6561 (6557 and 6560 without a contract); a financing on quote 6558 (AutoCapital Canada, 25,000, 60 months); contracts APOP01-845 (quote 6558), APOP01-846 (6559) and APOP01-847 (6561) with invoices #942, #943 and #944 ($456.00 each, payment pending) — none can be deleted. APOP01-846 and APOP01-847 carry the financing company AutoCapital Canada although their quotes have no financing (workaround in AP2503_007 and AP2503_009).
- Observations that are not failures: the "delivery date has passed the acceptable timeframe" banner shows even with today's delivery date; the End date does not recalculate on screen; the invoice is the warranty cost ($456), not the sale price ($2,500); a phone edited on the page goes onto the contract only (Q-009); once a financing company is picked, the empty company phone no longer stops the submit.
- Knowledge files added or changed: None in this run (quote-creation.md was updated by the s4 run).

**Files**
- [AP-2503_test-report.md](qa-artifacts/5-testing-report/AP-2503_test-report.md)
- [AP-2503_bug-report.md](qa-artifacts/5-testing-report/AP-2503_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-02.md)
- [run state](qa-artifacts/.pipeline/AP-2503.md)

## Automation
- Spec: `playwright-automation/src/tests/dealer/warrantyGenerateContract_AP2503.spec.ts`, tag `@AP-2503` (read-only on Dev quote 6557; creates nothing). New page object `WarrantyGenerateContractPage.ts` and flow `WarrantyGenerateContractFlow.ts`; no existing file changed.
- 4 of 7 PASSED cases automated — 3 passing (AP2503_001, _002, _010), 1 fixme (AP2503_008). Reviewer R5 APPROVE, 0/0/2.
- Not automated: AP2503_004 — needs a quote with financing and no contract (6558 now has APOP01-845); AP2503_006 and AP2503_009 — each run would create an undeletable contract and invoice. AP2503_008 fixme — in the Playwright runner the click posts the form with an empty last name (aborted by the test, nothing created) instead of the browser refusing it as in the manual run; cause not known yet.
- PR skipped: gh CLI not installed.
