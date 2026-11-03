# Run Summary — AP-2494: Quotes list: replace "Produits" with "Contracts" and add quote search
Updated: 2026-11-01T21:20:00Z · Run folder: no-sprint · Stages run: s5 → s7 · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2494: Quotes list: replace "Produits" with "Contracts" and add quote search
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 5 REQ · 2 High risks
 Test cases   : 19 designed · 7 proposed by review
 Execution    : 14 PASS · 1 FAIL · 4 BLOCKED
 Bugs         : 2 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS
 Verdict      : FAIL
 Tickets      : AP-2494 unchanged · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2494 FAIL — 14 of 19 test cases passed on Dev (v2dev), missing the 90% threshold (74%). 2 bugs filed. Ticket comment posted and verified.

**What passed**
- Contracts column: "Produits" is gone and "Contracts" is the third column on both the Active and Archived tabs, and "Contrats" in French (AP2494_001–003).
- Contract numbers in the column: the extended-warranty ("26df1-844"), creditor-insurance ("AVP000170") and Permaplate ("PNA-0000000019") contract numbers show in their quote's cell, and a quote with no contract shows a blank cell (AP2494_004, _006, _009, _011).
- Search: quote name, client first name, last name, email, full name and VIN all find the right quotes, partial and in any letter case; a term that matches nothing shows "No entities found" with no error; the search stays on the current tab; and another dealership's client and VIN return nothing (AP2494_013–019).

**Failures**
- AP2494_010 — after a sale `AP2494-S-957` was saved on quote 6480, the quote's Contracts cell still listed only "AVP000170"; archived quotes 6040 and 6041, which carry a warranty, do list their sale numbers. Gate C: filed as AP-2517 (Medium), with Q-003 to the author.
- AP2494_005, _008, _012 (BLOCKED, not failed) — Dev returns HTTP 500 at `/quote/{id}/road-side-protection-create-contract` (4 tries on quotes 6479 and 6480). Gate C: filed as AP-2518 (High), Relates → AP-2508.
- AP2494_007 (BLOCKED) — test data not on dev: no GAP contract.

**Decisions made**
- Gate A (rule A3, by reviewer R1): continued with no questions posted — 0 Blocking, 13 Judgement, 2 Info.
- Gate B (rule B1, by reviewer R2, round 3 APPROVE): promoted three Pass 1 gaps and one High proposal (AP2494_019); s3 re-run.
- Gate C (rules C4 and C3 → E2; by reviewer R3, round 2 APPROVE): AP2494_010 → filed new AP-2517 (no sentence says a saved sale stays off the list; AC 4: "the "Contracts" column shows those contract numbers"); roadside HTTP 500 → filed new AP-2518, linked Relates → AP-2508, which says "No error message and no HTTP 500 appear" — no comment posted on AP-2508.
- Gate D (rules, automatic; reviewer R4 APPROVE 0/0/0): AP-2494 not moved — pass rate 74% (needs 90%) and AP-2518 (High) blocks AP2494_005, _008 and _012; assignee unchanged. AP-2517 and AP-2518 are in Backlog, so they get no re-test action.
- Run folder no-sprint (reviewer rule E3); executed on Dev (v2dev) by the user's decision; s4c skipped (no rule C1 decision).

**Left behind**
- Test data on Dev: quotes 6479–6483; Chubb creditor contract AVP000170 on quote 6480 (created through Chubb's development API); sale AP2494-S-957 on quote 6480; roadside products saved without a contract on 6479 and 6480.
- Observations that are not failures: a cancelled warranty contract (APOP01-663) still shows in quote 6041's Contracts cell (Q-008); the search covers only the current tab and switching tab drops the term (Q-011); Dev has no GAP insurance contract.
- Knowledge files added or changed: qa-artifacts/qa-docs/quote-creation.md (R3 F-5 — the "no separate generate/finalize step" line now applies only to the sales page and quotes without a warranty, with the 6040/6041/6480 facts).

**Files**
- [AP-2494_test-report.md](qa-artifacts/5-testing-report/AP-2494_test-report.md)
- [AP-2494_bug-report.md](qa-artifacts/5-testing-report/AP-2494_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md)
- [run state](qa-artifacts/.pipeline/AP-2494.md)

## Automation
- Spec: `playwright-automation/src/tests/dealer/quoteListContractsSearch_AP2494.spec.ts`, tag `@AP-2494` (with `QuoteListFlow.ts` and `QuoteListPage.ts`, all new files). Read-only on Dev quotes left by the manual runs; no contract generated; runs on v2dev only.
- 14 of 14 PASSED cases automated — 14 passing, 0 fixme (lint pass; `--repeat-each=2`: 28 passed; R5 reviewer APPROVE 0/0/2).
- Not automated: AP2494_010 — failed manually (AP-2517); AP2494_005, _008, _012 — blocked manually (AP-2518); AP2494_007 — blocked manually (no GAP contract on Dev).
- PR skipped: gh CLI not installed.
