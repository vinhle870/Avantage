# QA Batch Report — 2026-11-07
Generated: 2026-11-07 · Selected: 24 (ready for QA: 21, assigned to me but not in QC: 3) · Tested: 5 · Skipped: 19

## Summary
None of the five tickets tested today can be released yet, but one bug is closed. AP-2507 (the "Décoder saves a quote" bug) is fixed on Dev and moved to Done, and its fix, AP-2533, passed 10 of 11 cases. AP-2533 waits only for the author's answer to Q-002. AP-2477 passed 11 of 12, but two older High bugs (AP-2507, now closed, and the staging-only AP-2492) plus a new Medium bug keep it in QC. AP-2505 improved from 0% to 50% and has two new bugs, and AP-2502 could not run because AP-2542 still returns HTTP 500 on Dev. The team's first job: Nicolas-Eric Tain answers Q-002 on AP-2533, and the team decides whether AP-2492 (a staging-only 404) still blocks AP-2477.

| Verdict | Tickets |
|---|---|
| Ready for release | — |
| Bug closed (Done) | AP-2507 |
| Not ready — failed | AP-2477 (91.7%, High bugs AP-2492 open; AP-2552 new), AP-2505 (50%, AP-2553, AP-2554 new) |
| Not ready — blocked | AP-2502 (AP-2542 still HTTP 500 on Dev — not executed), AP-2533 (90.9%, Blocking question Q-002 open) |
| Waiting on author | AP-2491 (Q-001), AP-1948 (two questions to Ken) |
| Parked by reviewer | — |
| Design only (build not in QA) | — |
| Skipped | AP-2434, AP-2504, AP-2503, AP-2501, AP-2499, AP-2498, AP-2497, AP-2496, AP-2494, AP-2493, AP-2428, AP-2377, AP-2374, AP-2225 (P7 — tested, waiting on their open bugs); AP-2491, AP-1948 (P7 — waiting on author); AP-2506, AP-2459, AP-2410 (P9 — status QA, not QC) |

## Per ticket
| Ticket | Plan | Verdict | PASS | FAIL | BLOCKED | Bugs filed | Automated | Report |
|---|---|---|---|---|---|---|---|---|
| AP-2477 | retest-after-fix | FAIL | 11 | 1 | 0 | AP-2552 | — (gate failed) | [summary](AP-2477_run-summary.md) |
| AP-2505 | retest-after-fix | FAIL | 5 | 4 | 1 | AP-2553, AP-2554 | — (gate failed) | [summary](AP-2505_run-summary.md) |
| AP-2507 | bug-retest | PASS | 3 | 0 | 0 | — | 3 TCs | [summary](AP-2507_run-summary.md) |
| AP-2502 | re-capture | BLOCKED (not executed) | — | — | — | — | — | [summary](AP-2502_run-summary.md) |
| AP-2533 | full | CONDITIONAL PASS | 10 | 0 | 1 | — | 10 TCs | [summary](AP-2533_run-summary.md) |

## Ticket details

### AP-2477 — Simplify /quote/new/edit-vehicle to minimal fields with VIN decoder pre-fill
**FAIL — 11 of 12 passed (91.7%) on Dev; stays in QC because High bugs AP-2507 and AP-2492 were open at Gate D.**

- **Where it is:** last stage update-ticket · Jira QC → unchanged · Vinh Le - QC · comment 19511
- **Failures:** AP2477_008 — decoded engine size unit "kW" is saved as "Litre" on vehicle 1146 (quote 6591) — AP-2552 (Medium)
- **Decisions:** Gate C C3→E2 — file new AP-2552 — by reviewer R3, round 1 · Gate D §3.1 — comment only, no move — by reviewer R4, round 1
- **Needs someone:** the team decides whether AP-2492 (High, a staging-only 404; AP2477_001 passes on Dev) still blocks this ticket; Ken fixes AP-2552. AP-2507 is now Done, so only AP-2492 and AP-2552 remain.
- **Left behind:** quotes 6588–6592, vehicles 1143–1147 on Dev. The test cases still describe the old form layout (R3 F-2 — refresh in the next design run).
- **Automation:** not run — gate failed (High bugs open). The existing AP-2477 specs from 2026-11-01 now fail on Dev because AP-2533 removed the top-right type button (`#dropdownMenuLink1`) — see *Left behind* below.

[Full run summary](AP-2477_run-summary.md) · [Test report](AP-2477_test-report.md) · [Review record](../7-reviews/AP-2477_review.md)

### AP-2505 — Generate contract for a quote's Roadside protection product
**FAIL — 5 of 10 passed (50%) on Dev; the 2026-11-03 blocker AP-2518 no longer reproduces; two new bugs.**

- **Where it is:** last stage update-ticket · Jira QC → unchanged · Vinh Le - QC · comment 19513
- **Failures:** AP2505_001/002/003 — page shows "Product Summary" / "Owner identification" and no "Financing information" section (AC 2) — AP-2553 (Medium) · AP2505_005 — financing not pre-filled (CASH, company "Choose") and editable; contract 2782 saved as Cash on a financed quote (AC 3) — AP-2554 (High)
- **Decisions:** R3 round 1 REWORK (007 was a test-design gap: Stock number / In service date) · round 2 REWORK (phone format; outcome rule restored) · round 3 APPROVE — Gate C C4 file new ×2, AP-2518 "not reproduced" comment 19512 · Gate D §3.1 — comment only — by reviewer R4, round 1
- **Needs someone:** Ken fixes AP-2553 and AP-2554; the author answers Q-001 (which column holds "Vehicle identification"); the developer answers the phone-format question (the page pre-fills `5145550501`, the submit requires `###-###-####`); the triager decides whether to close AP-2518.
- **Left behind:** quotes 6593–6599, vehicles 1148–1154, AutoShield contract 2782 (quote 6597); stray quote 6594 / vehicle 1149 with "undefined" in VIN/email from a script error.
- **Automation:** not run — gate failed (50%, High bug open).

[Full run summary](AP-2505_run-summary.md) · [Test report](AP-2505_test-report.md) · [Review record](../7-reviews/AP-2505_review.md)

### AP-2507 — [BUG-002][AP2477_007] Clicking "Décoder" saves a quote and empties the form
**PASS — 3 of 3 on Dev; the fix (shipped in AP-2533) is deployed; moved to Done.**

- **Where it is:** last stage update-ticket · Jira QC → **Done** · Vinh Le - QC · comment 19514
- **Failures:** None
- **Decisions:** R2 round 1 REWORK (judge only what the bug states; robust build check), round 2 APPROVE · Gate C skipped (no FAIL) · Gate D §3.2 All PASS — move to Done — by reviewer R4, round 1
- **Needs someone:** Nothing
- **Left behind:** quotes 6600, 6601 (manual) and 6603–6608 (automation runs), vehicles 1155, 1156, 1158–1163
- **Automation:** 3 tests in `playwright-automation/src/tests/dealer/quoteVinDecoder_AP2507.spec.ts`, 3 passing, R5 APPROVE. PR not opened (GitHub not logged in).

[Full run summary](AP-2507_run-summary.md) · [Test report](AP-2507_test-report.md) · [Review record](../7-reviews/AP-2507_review.md)

### AP-2502 — Separate compliance document PDF for GC960 and 6201
**BLOCKED — not executed: the Gate B probe of the send form returned HTTP 500 on Dev at 11:05Z (AP-2542 still reproduces).**

- **Where it is:** last stage review-cases · Jira QC → unchanged · Vinh Le - QC · no comment (Gate B: post nothing)
- **Failures:** None new — the 2026-11-03 FAIL results stand.
- **Decisions:** Gate A A3 — continue, post nothing — R1 round 1 · Gate B B3 conditional on a read-only probe — R2 round 1
- **Needs someone:** Ken sends Minh the Dev prod.log CRITICAL lines and the QPDF_PATH setting for AP-2542 (Highest). Then re-run `AP-2502 --from execute`.
- **Left behind:** Nothing
- **Automation:** Not run

[Full run summary](AP-2502_run-summary.md) · [Review record](../7-reviews/AP-2502_review.md)

### AP-2533 — Update quote form UI
**CONDITIONAL PASS — 10 of 11 on Dev (90.9%); stays in QC only because Q-002 (Blocking) is unanswered.**

- **Where it is:** last stage update-ticket · Jira QC → unchanged · Vinh Le - QC · Q-002 comment 19510, result comment 19515
- **Failures:** None. AP2533_002 BLOCKED by Q-002.
- **Decisions:** R1 round 1 REWORK → round 2 APPROVE (Gate A A2, Q-002 posted) · R2 round 1 REWORK (B2 promoted AP2533_011) → round 2 APPROVE · Gate C skipped (no FAIL) · Gate D §3.1 — comment only — by reviewer R4, round 1
- **Needs someone:** Nicolas-Eric Tain answers Q-002 (which hidden inputs the decode must fill), and whether the French "Quote name" / "Passenger" labels should be translated, and whether the ATV / UTV decode may reuse vehicle 1157.
- **Left behind:** quote 6602, vehicle 1157
- **Automation:** 10 tests in `playwright-automation/src/tests/dealer/quoteFormUi_AP2533.spec.ts`, 10 passing; R5 round 1 REWORK (French label is open question Q-009 — now record-only), round 2 APPROVE. AP2533_002 not automated (blocked by Q-002). PR not opened (GitHub not logged in).
- **Left behind (automation):** each run of AP2533_004 leaves one quote and vehicle: quotes 6609–6613, vehicles 1164–1168.

[Full run summary](AP-2533_run-summary.md) · [Test report](AP-2533_test-report.md) · [Review record](../7-reviews/AP-2533_review.md)

## Bugs filed in this batch
| Bug | Severity | Ticket | Summary |
|---|---|---|---|
| AP-2552 | Medium | AP-2477 | Saving a quote after "Décoder" stores the decoded engine size unit "kW" as "Litre" on the vehicle |
| AP-2553 | Medium | AP-2505 | The roadside contract page shows "Product Summary" and "Owner identification" and has no "Financing information" section |
| AP-2554 | High | AP-2505 | The roadside contract page does not pre-fill the quote's financing, lets the dealer change it, and saves the contract as "Cash" with no lender |

## Open questions
- **AP-2533 Q-002** (Blocking) — which hidden inputs the decode must fill — Nicolas-Eric Tain (comment 19510).
- **AP-2505 Q-001** (Blocking) — which column holds "Vehicle identification" — Nicolas-Eric Tain (comment 19513).
- **AP-2505 developer question** — pre-filled Home phone format vs the contract submit's `###-###-####` rule — developer (comment 19513).
- **AP-2477** — whether the staging-only AP-2492 still blocks a Dev-tested story — QA lead / Ken.
- **AP-2491 Q-001**, **AP-1948** (two questions) — unchanged from earlier batches.

## AP-2491 — regression run (user request)

The full Playwright suite was run on Dev with one worker (184 tests). **Before** test maintenance: 110 passed, 58 failed, 13 skipped, 3 did not run. **After**: 135 passed, 33 failed, 13 skipped, 3 did not run. 26 tests were repaired; they had broken because the new-quote form is now minimal (AP-2477 / AP-2533). No assertion was changed.

The 33 remaining failures, each classified in [AP-2491_regression-report.md](../6-automation/AP-2491_regression-report.md):
- **15 product defect candidates.** The Extended Warranty contract page has lost its PDF preview (14 tests), and the Province list says "Nanavut" (1).
- **12 caused by a page change not yet confirmed as intended.** The Permaplate and Extended Warranty contract pages were redesigned roadside-style (8). Financing company is now required on a cash sale (1). The Esthetic protection amount cell changed (3).
- **5 test data.** AP-2494's fixed quotes drift past page 15 of the quote list as each run adds quotes.
- **1 environment.** The Yopmail inbox timed out.

Comment 19516 is posted on AP-2491. The ticket stays in QC because Q-001 is still open. **Decision needed:** is the contract-page redesign intended, and under which ticket? The answer decides whether 12 specs are updated or the rows become bugs. No bugs were filed from the regression: the defect candidates depend on that answer.

## Reviews
- **AP-2477:** R3, R4 approved first round. Open minors: case wording describes the old layout (F-2); questions Q-001–Q-006 not classified (R4 F-1). [Record](../7-reviews/AP-2477_review.md)
- **AP-2505:** R3 needed 3 rounds (a test-design gap, then the phone format); R4 approved. Open minors: duplicate screenshot names (F-2, F-16), no capture of the filled form before submit (F-15). [Record](../7-reviews/AP-2505_review.md)
- **AP-2507:** R2 2 rounds; R3, R4, R5 first round. Open minors: R5 F-1 (pre-decode state not asserted), F-2 (build-check pattern tied to minified code). [Record](../7-reviews/AP-2507_review.md)
- **AP-2502:** R1, R2 first round. Open minors: test plan §9 wording, seven-digit inbox numbers, stale "no 960 form" sentences. [Record](../7-reviews/AP-2502_review.md)
- **AP-2533:** R1 2 rounds, R2 2 rounds, R5 2 rounds; R3, R4 first round. Open minors: byte-identical search screenshots (F-1), French labels (F-2), ATV / UTV hidden id 1157 (F-3), "Loaded" actual results (F-4). [Record](../7-reviews/AP-2533_review.md)

## Automation pull requests — waiting for you
None opened. GitHub CLI is not logged in, and the QA framework commit `22fa313` exists only on `main`, not on `origin/dev`. Approved specs waiting for a PR: AP-2495 (4), AP-2441 (12), AP-2435 (12), AP-2507 (3), AP-2533 (10). Run `bash tools/gh-cli/gh.sh auth login` and choose the base branch, then say "open the PRs".

## Left behind (environment and workbench)
- **Dev data:** quotes 6588–6613, vehicles 1143–1168, AutoShield contract 2782. Dealers cannot delete quotes.
- **Workbench:** the stale `QuoteVehicleFormFlow` / `DealerNewQuotePage` / `DealerFlow` were fixed by the AP-2491 regression maintenance (see below); these changes are uncommitted, with no PR.
- **Dev data from the regression:** quotes 6614–6688, vehicles 1173–1229, sale contract info on quotes 6652–6669 (dealer 1380).
- **Knowledge files:** the shared dealer username was removed from `qa-docs/quote-creation.md` line 4. The same address still appears in about 100 older test cases, logs and page snapshots (it is also the dealer's display name); passwords were already scrubbed.
