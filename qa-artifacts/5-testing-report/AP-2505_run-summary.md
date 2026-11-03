# Run Summary — AP-2505: Generate contract for a quote's Roadside protection product
Updated: 2026-11-03T05:39:19Z · Run folder: no-sprint · Stages run: s5 → s7 · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2505: Generate contract for a quote's Roadside protection product
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 4 REQ · 4 High risks · 1 Blocking question open (Q-001)
 Test cases   : 10 designed · 9 proposed by review (none promoted, Gate B rule B3)
 Execution    : 0 PASS · 2 FAIL · 8 BLOCKED   (Environment: Dev)
 Bugs         : 0 filed · 1 linked to existing (AP-2518, High) · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired (s4c skipped — no C1 decision)
 Verdict      : FAIL
 Tickets      : AP-2505 unchanged (QC) · 1 bug updated (AP-2518 commented + linked; 0 → Done, 0 → In Progress)
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2505 FAIL — 0 of 10 test cases passed on Dev, missing the 90% threshold. 0 bugs filed; the failures are the existing bug AP-2518, which now carries this run's evidence and is linked to AP-2505. Ticket comment posted and verified (comment 19465); the story stays in QC.

**What passed**
- No test case passed. Building the test data on Dev worked: six inventory Toyota Corolla 2022 vehicles, their quotes, financing, one GAP quote and six roadside products all saved without error. The roadside contract page itself never opened.

**Failures**
- AP2505_001 — on quote 6568 (with a GAP quote), ⋯ → "Generate Contract" on the Roadside Protection row opened a pop-up stuck on "Loading...", and `/quote/6568/road-side-protection-create-contract` answered HTTP 500, also when typed directly. Gate C: linked to AP-2518 (rule C2) — comment 19464 with the screenshots.
- AP2505_002 — the same pop-up and HTTP 500 on quote 6569, which has no GAP quote. Gate C: linked to AP-2518 (rule C2) — same comment.

**Decisions made**
- Gate A (rule A2, earlier run): Blocking Q-001 posted on AP-2505 and still unanswered — AP2505_004 stays BLOCKED.
- Gate B (rule B3, R2 round 2 APPROVED, earlier run): executed the current 10 cases; no proposal promoted.
- Gate C (rule C2 for both FAILs, decided by the independent reviewer R3 round 1, APPROVE): comment on existing AP-2518, quoting its summary "opening its contract page /quote/{quote id}/road-side-protection-create-contract returns HTTP 500 … the dialog stays on "Loading..."". The comment adds that the 500 also happens on six fresh VINs with no roadside contract (quotes 6568–6573), with and without a GAP quote and with and without financing, which rules out the cause AP-2518 suggested. The four FAIL screenshots are embedded and the network .txt is attached (5 media nodes read back). A "relates to" link AP-2518 ↔ AP-2505 was added and read back on both tickets.
- Gate D (rules, automatic): AP-2505 not moved — pass rate 0% (needs 90%), AP-2518 (High, open) blocks AP2505_003 and AP2505_005–010, and Q-001 (Blocking) is unanswered. Story result comment 19465 posted with all 10 test-case rows, the open questions Q-001–Q-012, and a deployment question to the developer: the Roadside row's Generate Contract link on Dev is still `data-toggle="modal" data-target="#myModal"` while the GAP row's is a plain link, and AP-2505 shows 1 Bitbucket branch (last updated 2026-10-30) and no pull request — is the change merged and deployed to Dev? Re-test with "AP-2505 --from s4" once it is. AP-2518 is in Backlog, not a QA status, so it got no Gate D status action.
- BLOCKED cases: AP2505_003, _005, _007, _009 (step 2), _006 (step 3), _008 (step 1), _010 (step 1) — AP-2518; AP2505_004 — Q-001.
- Reviewer minors recorded in the test report: F-11 (two screenshots captured while the error page faded in; no address bar visible) and F-12 (the quote-building script was not kept on disk).

**Left behind**
- Test data on Dev: vehicles 1130–1135 (VINs 2T1BURHE0NC505001, 002, 006, 007, 008, 009); quotes 6568–6573 (clients `client.stage.2505001/002/006/007/008/009@yopmail.com`), each with a roadside product (CA$250.00); financing on all except 6570; a GAP quote on 6568. No contract and no invoice were created.
- Observations that are not failures: the AP-2505 change does not appear to be deployed to Dev (pop-up link still in place; branch, no pull request) — asked on the ticket. The error page shows in French even with English selected.
- Knowledge files added or changed: None in this run (the Dev facts were written back in s4 to `qa-artifacts/qa-docs/quote-creation.md`, `qa-artifacts/base-test/navigation-map.md` and `qa-artifacts/base-test/test-centralized.md`).

**Files**
- [AP-2505_test-report.md](qa-artifacts/5-testing-report/AP-2505_test-report.md)
- [AP-2505_bug-report.md](qa-artifacts/5-testing-report/AP-2505_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2505_2026-11-03.md)
- [run state](qa-artifacts/.pipeline/AP-2505.md)
- Comment files: `qa-artifacts/4-execution-results/comment_AP-2518_2026-11-03.md`, `qa-artifacts/4-execution-results/comment_AP-2505_2026-11-03_result.md`

## Automation
Not run yet.
