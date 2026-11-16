# QA Batch Report — 2026-11-08

**Selection:** `--only AP-2506,AP-2459,AP-2410`. All three are in Jira status QA, not QC; the QA decided to test them now ("retest"), overriding planning rule P9.
**Environment:** Dev (v2dev). Environment check PASS.
**Before the batch:** AP-2491 was moved to Ready for release (assigned to Ken Nguyen) by the QA's decision, with comment 19517.

## Summary

| Result | Tickets |
|---|---|
| Passed and closed | AP-2459 → Done · AP-2410 → Done |
| Failed | AP-2506 (55.6%, stays in QA) |
| Automated | AP-2459 (2 tests) · AP-2410 (4 tests). Both R5 APPROVE; no PR, because gh is not logged in |
| Bugs filed | AP-2555 (Medium), AP-2556 (High), AP-2557 (Medium), AP-2558 (Medium). All assigned to Minh Lưu, all in the short ticket format |

## Per ticket

| Ticket | Tests (P/F/B/S) | Pass rate | Reviews | Jira (read back) | Bugs | Automation |
|---|---|---|---|---|---|---|
| AP-2459 — [BUG-001] Permaplate HTTP 500 | 2/0/0/1 | 100% | R3 ✓ · R4 ✓ · R5 ✓ | QA → **Done** (comment 19518) | none new; note on AP-2512 (19519) | 2 tests, no records reused (AP2459_002 creates one quote, contract and invoice per run) |
| AP-2410 — Chubb Insurance quote error | 4/0/0/0 | 100% | R2 ×3 · R3 ×3 · R4 ✓ · R5 ✓ | QA → **Done** (comment 19523) | AP-2557, AP-2558 | 4 tests on quote 6696, create nothing |
| AP-2506 — Esthetic protection contract | 5/3/1/0 | 55.6% | R2 ×3 · R3 ✓ · R4 ✓ | stays **QA** (comment 19521) | AP-2555, AP-2556; AP-2512 (comment 19520) | gate failed: 55.6% < 90%, High bugs open |

## Ticket details

- **AP-2459:** The fix works. A blank Financing company is now refused with a field message instead of HTTP 500, and with a company chosen, contract PNA-0000000021 and invoice 945 were created. The contract PDF still returns HTTP 500 (AP-2512), recorded as an observation.
- **AP-2410:** "Debtor is -1 years old" / HTTP 400 no longer occurs, re-tested with a co-applicant and Co borrower / Both coverage. Life "Residual Value Coverage" is not offered on Dev and was not replayed. Questions to the developer: Tax exempt Yes still shows 9% tax; the Borrower Life premium changes once a co-applicant exists; is the RT rate table meant to return?
- **AP-2506:** Contracts are generated, required fields are enforced, and the action disappears after a contract exists. Three failures:
  - the section headings (AP-2555);
  - the wrong vehicle price on the contract (AP-2556, High);
  - the PDF returns HTTP 500 (AP-2512).
  AP2506_002 stays blocked on Q-001 (author Nicolas-Eric Tain). A note on AP-2516 (19522) says that bug may already be fixed.

## Re-test loop (the QA's standing request)

After the batch, every story in QC was checked for bugs that are all Done. **None qualifies.** Every tested story still has at least one bug in Backlog, or AP-2542 in Deploy to staging. AP-2533 waits on Q-002 and AP-1948 on Ken's questions. No ticket needs more work until developers move bugs or answer questions.

## Reviews

R2 found the AP-2410 and AP-2506 designs still targeted staging and the old contract-page layout; both were reworked for Dev. R3 sent AP-2410 back twice:
- AP2410_004 had not re-sent the original co-borrower inputs.
- A step-5 screenshot was byte-identical to step 3; it was confirmed to be an honest capture of an unchanged page.

## Harness defects (Skill Defect Rule)

1. **stlc-manual-executor:** a screenshot alone is accepted as proof that a reopened page kept its saved values, even when it cannot be told apart from the before-save capture (AP2410_004 step 5).
2. **stlc-qa-reviewer check 4.7 vs tracker-manage-child-ticket template:** 4.7 forbids any cross-reference to another bug, while the template allows a "relates to AP-NNNN" Note.
3. **playwright-automation/.claude/skills/:** an older copy of agent-coordination (still triggered by "qa agent") and scaffold-skill (without Defect mode) shadows the root skills for work under playwright-automation/.

All three fixes were applied on 2026-11-08 after the QA agreed:
1. `stlc-manual-executor` 2d now requires a `{TC_ID}-step{N}-values.txt` values record beside the screenshot of a persistence step, and `stlc-qa-reviewer` check 3.5a enforces it.
2. Check 4.7 now allows a reference to another ticket in the template's Note line only.
3. The stale copies under `playwright-automation/.claude/skills/` were removed with `git rm`.

## Left behind on Dev

- **AP-2459:** quotes 6689–6691, contract PNA-0000000021, invoice 945.
- **AP-2506:** quotes 6692–6695, contract PNA-0000000022, invoice 946.
- **AP-2410:** quote 6696, with a co-applicant and a saved Chubb quote.
- **Automation runs:** quotes 6698–6701 and one more, contracts PNA-0000000023–27, invoices 947–951.
- **Workbench:** 6 new uncommitted automation files (AP-2459 and AP-2410).
