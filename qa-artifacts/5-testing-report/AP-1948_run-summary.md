# Run Summary — AP-1948: CBI / CVE Tesla Price modification
Updated: 2026-11-01T15:56:00Z · Run folder: 1.39.0 · Environment: Tested on: Dev (v2dev) · Stages run: s5 → s7 (execution s4 done earlier the same day) · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-1948: CBI / CVE Tesla Price modification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 3 REQ · 2 High risks
 Test cases   : 9 designed · 7 proposed by review (1 promoted)
 Execution    : 3 PASS · 0 FAIL · 6 BLOCKED   (Dev, v2dev)
 Bugs         : 0 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS  (s4c skipped)
 Verdict      : FAIL — not ready (33%, needs 90%; 0 defects, 6 BLOCKED)
 Tickets      : AP-1948 unchanged (QC) · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-1948 FAIL — 3 of 9 test cases passed on Dev (v2dev), missing the 90% threshold. 0 bugs filed. Ticket comment 19442 posted and verified; the ticket stays in QC because the pass rate is 33% and the two Blocking questions Q-001 and Q-002 are still unanswered.

**What passed**
- Client portal pricing (REQ-002), AP1948_001: for a 2022 Tesla Model 3 Long Range on customer 1493's quote request, the term "L'Avantageuse AT 36 months and/or 60000 km" showed Subtotal CA$1,025.00 on the Summary page — exactly the 1025 that admin holds as that term's suggested retail price.
- Client portal pricing (REQ-002), AP1948_002: switching to the "CVE 12 months" term changed the Subtotal to CA$2,700.00, which matches that term's admin price of 2700.
- Client portal pricing (REQ-002), AP1948_009: when the admin raised the AT term's suggested retail price to 1125, the customer saw CA$1,125.00 on the next page load. This proves the price is read from the program term. The price was then put back to 1025 and checked in admin and on the portal.

**Failures**
- None. No test case failed. Six cases are BLOCKED, which means they could not be judged, not that anything is broken: AP1948_004–006 wait on Q-001 (which vehicles are in Category A, B and C), AP1948_007–008 wait on Q-002 (whether the "Original ask" Tesla prices still apply), and AP1948_003 stops at the Stripe payment page because there are no test card details.

**Decisions made**
- Gate A (rule A2, by reviewer R1): Q-001 and Q-002 were posted as Blocking questions in comment 19432 earlier today, and the run continued. A fresh read of AP-1948 at 15:55Z shows no answer after that comment, so the questions were not posted again; the result comment reminds the author of them.
- Gate B (rule B2, by reviewer R2): the one High review proposal was promoted as AP1948_009 (decided earlier today).
- Gate C (by reviewer R3 round 2, APPROVE): not reached — no failures. The reviewer approved the execution results after the re-run of AP1948_001, 003 and 009 with a 2022 Model 3, because the vehicle year is not a test condition.
- Gate D (rules, automatic, by reviewer R4 APPROVE): AP-1948 not moved — pass rate 33% (needs 90%), and Q-001 / Q-002 (Blocking) are unanswered, so category filtering and the Tesla prices were never judged. Comment 19442 lists all nine test cases, what passed, what is blocked and why. Status QC and assignee Vinh Le - QC unchanged.
- Environment: Dev (v2dev), by the user's decision; staging was not used. Run folder 1.39.0 comes from the ticket's fix version. This run started at s5 (`--from s5`); the tracker preflight and environment health check had already passed in this batch.

**Left behind**
- Test data on Dev (v2dev):
  - Quote request for customer 1493 with client.stage.916@yopmail.com (2023 Tesla Model Y, client Marie Tremblay) — stopped at the Summary page.
  - Quote request for customer 1493 with client.stage.917@yopmail.com (2022 Tesla Model 3 Long Range, VIN 5YJ3E1EB0NF000001) — stopped at the Summary page.
  - Quote request for customer 1493 with client.stage.918@yopmail.com (same vehicle) — "Continue with payment" was pressed, which created an unpaid Stripe sandbox checkout for CA$1,178.49. Whether this left a pending quote on the customer is not known, because no cleanup procedure is recorded.
  - Program term 16: changed 1025 → 1125 for about one minute and restored to 1025; the reviewer re-checked it live. Nothing is left changed.
- Observations that are not failures:
  - Q-005, price format: the customer sees "CA$1,025.00", labelled Subtotal, before GST and PST; admin stores the plain number 1025.
  - Q-006, when the price appears: the term cards show no price; it first appears on the Summary page after Client Info, and the Stripe checkout shows only the Total including taxes.
  - For Q-001: term 16 (categories A, B, C; fuel types gasoline and diesel only) is offered for a 2022 Tesla Model 3.
  - The test-case files still name Staging, a typed "2023 Model 3" and a price at term selection, and do not define where AP1948_003's "submit" ends; reword on the next s3 re-run (review R3 F-3).
- Knowledge files added or changed: None in this run.

**Files**
- [AP-1948_test-report.md](AP-1948_test-report.md)
- [AP-1948_bug-report.md](AP-1948_bug-report.md)
- [execution log](../4-execution-results/1.39.0/execution-log_AP-1948_2026-11-01.md)
- [automation report](../6-automation/AP-1948_automation-report.md)
- [run state](../.pipeline/AP-1948.md) · [review record](../7-reviews/AP-1948_review.md) · [posted comment](../4-execution-results/comment_AP-1948_2026-11-01.md)

## Automation
- Spec: `playwright-automation/src/tests/client/termPrice_AP1948.spec.ts`, tag `@AP-1948` — run on Dev (v2dev) only; it skips itself on any other base URL.
- 3 of 3 PASSED cases automated — 3 passing, 0 fixme (lint pass; `--repeat-each=2` 6 passed; reviewer R5 APPROVE). AP1948_009 restores term 16's suggested retail price in `finally`; it read 1025 after the runs.
- Not automated: AP1948_003 — BLOCKED at the Stripe payment page; AP1948_004–006 — BLOCKED by Q-001; AP1948_007–008 — BLOCKED by Q-002.
- PR skipped: gh CLI not installed (--no-pr). Report: qa-artifacts/6-automation/AP-1948_automation-report.md
