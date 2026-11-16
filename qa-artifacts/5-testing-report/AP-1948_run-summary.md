# Run Summary — AP-1948: CBI / CVE Tesla Price modification
Updated: 2026-11-15T10:13:30Z · Run folder: 1.39.0 · Environment: Dev (v2dev) · Stages run: file-bugs → report, then update-ticket · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-1948: CBI / CVE Tesla Price modification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 3 REQ · 0 High risks open (Q-002 Accepted)
 Test cases   : 9 designed · 0 promoted (Pass 2 #1–#10 not promoted)
 Execution    : 8 PASS · 0 FAIL · 1 BLOCKED (89%, 8 of 9)
 Bugs         : 0 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired (correct-cases skipped, no FAIL)
 Verdict      : CONDITIONAL PASS
 Tickets      : AP-1948 unchanged (QC) · comment 19585 posted · 0 bugs updated
 Finished     : update-ticket (s7 done; Gate D by reviewer, R4 round 2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Finished:** update-ticket done at 2026-11-15T10:12:57Z — the R4-approved story result comment was posted on AP-1948 (comment 19585) and read back identical; AP-1948 stays in QC (89% < 90%), assignee Vinh Le - QC unchanged. The run is complete.

**What passed**
- Price shown equals the admin price (REQ-002): AP1948_001, 002 and 009 — the Summary Subtotal equals the term's suggested retail price, follows the term picked, and follows an admin price change.
- Category filter (REQ-001): AP1948_004, 005 and 006 — the Tesla Model 3 is offered only terms of its category, and moving it to another category removes the terms that do not cover it.
- Tesla term prices (REQ-003, Q-002 Accepted): AP1948_007 and 008 — for Model 3, Model Y, Model S and Model X, every offered term's Subtotal equals its suggested retail price with nothing added (24 pairs).

**Failures**
- None. AP1948_003 is BLOCKED (not a failure): "Continue with payment" opens a Stripe sandbox card page and no Stripe test card exists in the test data, so the amount charged at payment is unverified. At 8 of 9 passed (89%), the ticket is one point under the 90% threshold because of this case.

**Decisions made**
- Gate C: skipped — the execution log has no FAIL; no bug to file or link, correct-cases stays skipped — rule: Gate C skip condition (routing §3) — decided by the reviewer (R3 round 2, 10:05:27Z).
- File-bugs: bug report BR-20261115-002 rewritten on the full log (morning and Run 2) — 0 defects, nothing filed. AP1948_003 (no Stripe test card) is listed as blocked, not a defect.
- Report: test report TR-20261115-002 rewritten on the full log — verdict CONDITIONAL PASS (8/9 = 89% < 90%; 0 Critical, 0 High; no Blocking question open). Includes the R3 round 2 F-3 risk: the hidden radio `price` attributes differ from the suggested retail price (term 16 = 625.00, term 129 = 0.00) and the amount sent to Stripe is unverified while AP1948_003 is blocked — not filed as a bug.
- R4 round 1 minor (name Ken Nguyen for Q-002): closed by removal — Q-002 is Accepted, so the report no longer recommends asking it; it recommends obtaining a Stripe test card instead.
- Gate D: decided by the reviewer (R4 round 2, 10:11:32Z) and applied at 10:12:57Z — rule D (§3.1), `apply_mode: automatic`. AP-1948 is a story: post the story result comment below; do not move to Ready for release — pass rate 89% (needs 90%); no stopping bug (none linked); no Blocking question open. Assignee unchanged (Vinh Le - QC). No bug-ticket action. The morning comment that re-asked Q-002 is superseded and is never posted.

**Update-ticket comment — posted as comment 19585 (2026-11-15T10:12:57Z, REST v2 wiki markup; read back identical, renders as an h3 heading)**

```
h3. QA result — CONDITIONAL PASS · Dev (v2dev) · 2026-11-15

*8/9 passed (89%, needs 90%)* · 0 failed · 1 blocked

*Failed / blocked:*
* AP1948_003 — Stripe sandbox checkout needs a test card; amount charged not verified — test data
*Passed:* 001, 002, 004–009

*Bugs:* None
*Questions:* None

*Next:* Stays in QC — re-test AP1948_003 once a Stripe test card is available. Not moved to Ready for release: pass rate 89% (needs 90%).
```

**Left behind**
- Test data on Dev: Client portal quote-request sessions for customer 1493 with client.stage.1948101 to 1948108@yopmail.com (101–104 morning, 105–108 Run 2). One unpaid Stripe sandbox checkout from client.stage.1948103 (CA$1,178.49); the others stopped at the Summary page. No configuration is left changed (term 16 = 1025, Model 3 #3124 = Category A). This run (file-bugs, report, update-ticket) used no browser and created no data.
- Observations that are not failures: CVE terms "CVE A" 122–126 and "CVE B" 129–133 are still offered on Dev although comment 19544 says the CVE program was disabled (fact F-1); fuel type does not filter the term list (Q-010 Accepted); hidden term radio `price` attributes differ from the suggested retail price (risk, not a bug).
- Knowledge files added or changed: None in this run.

**Files**
- [AP-1948_test-report.md](AP-1948_test-report.md)
- [AP-1948_bug-report.md](AP-1948_bug-report.md)
- [execution log](../4-execution-results/1.39.0/execution-log_AP-1948_2026-11-15.md) (morning section and "Run 2")
- [run state](../.pipeline/AP-1948.md)

## Automation
Not run for this execution — automation gate not met: 8 of 9 passed (89% < 90%). The 2026-11-01 spec `playwright-automation/src/tests/client/termPrice_AP1948.spec.ts` (AP1948_001, 002, 009) still matches today's results. AP1948_004–008 now pass manually and are not yet automated; the automation gate (≥ 90%) is not met at 89%.
