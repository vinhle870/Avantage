# QA Batch Report — 2026-11-01
Generated: 2026-11-02 · Selected: 26 (ready for QA: 21, assigned to me: 5) · Tested: 18 · Skipped: 0

**Tested on: Dev (v2dev), not staging.** On 2026-11-01 at 03:17Z the user decided to run the test cases on the Dev environment (v2dev) instead of staging. No ticket in this batch was tested on staging. Every PASS and every FAIL below describes what Dev did. Wave 1 (writing the test cases, with no browser) covered all 26 tickets. Wave 2 (running the test cases in a browser) covered 18 tickets.

## Summary
Four tickets passed every test case that could run. Two bug fixes (AP-2485, AP-2486) were moved to Done, and two features (AP-1381, AP-2471) were moved to Ready for release. Those four results come from Dev only, so check them on staging before release. Fourteen executed tickets are not ready. Thirteen failed, with 26 new bugs filed. AP-1948 could not be judged: 6 of its 9 cases wait on answers from the author. Of the 8 tickets that were not executed, 2 need an admin API key, 1 waits on its author and 5 are not yet in QC. **First action:** the developers should look at the High bugs that block other tickets: AP-2508, where the AutoShield contract fields and the Generate button are missing; AP-2518, where creating a roadside contract gives an HTTP 500 error; and AP-2512 and AP-2529, where the contract and invoice PDFs give an HTTP 500 error. Between them they block cases on AP-2225, AP-2494, AP-2496, AP-2498, AP-2428 and AP-2501.

| Verdict | Tickets |
|---|---|
| Ready for release | AP-1381 (Ready for release), AP-2471 (Ready for release), AP-2485 (bug fix → Done), AP-2486 (bug fix → Done) — all on Dev only |
| Not ready — failed | AP-2477, AP-2225, AP-2374, AP-2377, AP-2428, AP-2493, AP-2494, AP-2496, AP-2497, AP-2498, AP-2499, AP-2501, AP-2503 |
| Not ready — blocked | AP-1948 (executed, 3 of 9 passed; 5 cases wait on the author's Q-001/Q-002 and 1 stops at the Stripe payment page); AP-2434, AP-2435 (designed, not executed; every case needs a staging admin API key, AVP_ADMIN_API_KEY, which QA does not have) |
| Waiting on author | AP-2491 (the ticket has only a title; question Q-001 posted in Jira comment 19436, rule E1) |
| Parked by reviewer | Partial parks only: AP-2498 case AP2498_004 (Gate B round 3, so the author must confirm which inputs the form may contain); AP-2374 cases AP2374_002–004 (Gate C, R3, waiting on Q-010 for Ken Nguyen). The other cases of both tickets ran. |
| Design only (build not in QC) | AP-2410, AP-2441, AP-2459, AP-2495, AP-2506 (Jira status "QA", which this project does not treat as ready for QA) |
| Skipped | — |

## Per ticket
BLOCKED means a case could not be judged (missing data, an open question or another bug in the way). It does not mean the feature is broken.

| Ticket | Plan | Verdict | PASS | FAIL | BLOCKED | Bugs filed | Automated | Report |
|---|---|---|---|---|---|---|---|---|
| AP-2485 | bug-retest | PASS → Done | 3 | 0 | 0 | — | 3 TCs | [summary](AP-2485_run-summary.md) |
| AP-2486 | bug-retest | PASS → Done | 3 | 0 | 0 | — | 3 TCs | [summary](AP-2486_run-summary.md) |
| AP-2477 | resume | FAIL | 9 | 1 | 2 | AP-2507 | 9 TCs | [summary](AP-2477_run-summary.md) |
| AP-1948 | full | Not ready — blocked | 3 | 0 | 6 | — | 3 TCs | [summary](AP-1948_run-summary.md) |
| AP-1381 | full | PASS → Ready for release | 3 | 0 | 0 (+1 SKIPPED) | — | 3 TCs | [summary](AP-1381_run-summary.md) |
| AP-2225 | full | FAIL | 1 | 7 | 7 | AP-2508 | 1 TC | [summary](AP-2225_run-summary.md) |
| AP-2374 | full | FAIL (002–004 parked) | 4 | 1 | 5 | AP-2509 | 4 TCs | [summary](AP-2374_run-summary.md) |
| AP-2377 | full | FAIL | 7 | 3 | 1 | AP-2510, AP-2511 | 7 TCs | [summary](AP-2377_run-summary.md) |
| AP-2428 | full | FAIL | 9 | 4 | 2 | AP-2512, AP-2513, AP-2514, AP-2515 | 7 TCs | [summary](AP-2428_run-summary.md) |
| AP-2434 | full | Designed — blocked (no API key) | — | — | 8 at design | — | — | [summary](AP-2434_run-summary.md) |
| AP-2435 | full | Designed — blocked (no API key) | — | — | 12 at design | — | — | [summary](AP-2435_run-summary.md) |
| AP-2471 | full | PASS → Ready for release | 16 | 0 | 0 (+1 SKIPPED) | — | 16 TCs | [summary](AP-2471_run-summary.md) |
| AP-2491 | full | Waiting on author | — | — | — | — | — | [summary](AP-2491_run-summary.md) |
| AP-2493 | full | FAIL | 12 | 2 | 0 | AP-2516 | 12 TCs | [summary](AP-2493_run-summary.md) |
| AP-2494 | full | FAIL | 14 | 1 | 4 | AP-2517, AP-2518 | 14 TCs | [summary](AP-2494_run-summary.md) |
| AP-2496 | full | FAIL | 2 | 1 | 6 | AP-2519 | 2 TCs | [summary](AP-2496_run-summary.md) |
| AP-2497 | full | FAIL | 4 | 11 | 0 | AP-2520, AP-2521, AP-2522 | 4 TCs | [summary](AP-2497_run-summary.md) |
| AP-2498 | full | FAIL (004 parked) | 2 | 10 | 2 | AP-2523, AP-2524, AP-2525 | 2 TCs | [summary](AP-2498_run-summary.md) |
| AP-2499 | full | FAIL | 5 | 5 | 3 | AP-2526, AP-2527, AP-2528 | 5 TCs | [summary](AP-2499_run-summary.md) |
| AP-2501 | full | FAIL | 1 | 1 | 4 | AP-2529 | 1 TC | [summary](AP-2501_run-summary.md) |
| AP-2503 | full | FAIL | 7 | 3 | 0 | AP-2530, AP-2531, AP-2532 | 3 TCs (+1 fixme) | [summary](AP-2503_run-summary.md) |
| AP-2410 | design-only | Design only (4 TCs) | — | — | — | — | — | [summary](AP-2410_run-summary.md) |
| AP-2441 | design-only | Design only (12 TCs) | — | — | — | — | — | [summary](AP-2441_run-summary.md) |
| AP-2459 | design-only | Design only (3 TCs) | — | — | — | — | — | [summary](AP-2459_run-summary.md) |
| AP-2495 | design-only | Design only (4 TCs) | — | — | — | — | — | [summary](AP-2495_run-summary.md) |
| AP-2506 | design-only | Design only (9 TCs) | — | — | — | — | — | [summary](AP-2506_run-summary.md) |

Executed totals (18 tickets): 105 PASS · 50 FAIL · 42 BLOCKED · 2 SKIPPED.

## Ticket details

### AP-2485 — Switching a 12-month earning curve back to Pro-Rata keeps the previous type's factors
**Result: PASS. All 3 test cases passed on Dev (v2dev), 0 bugs were filed, comment 19439 was posted, and AP-2485 moved from QC to Done.**

- **Where it is:** last stage s8 · Jira QC → Done · Vinh Le - QC
- **Failures:** None.
- **Decisions:** Gate A not applicable (bug re-test) · Gate B rule B3, execute (R2, round 1) · Gate C not reached, no failures (R3, round 1) · Gate D rule §3.2 "All PASS", move to Done (R4, round 1). The user confirmed the move to Done based on the Dev re-test.
- **Needs someone:** Nothing.
- **Left behind:** Curves #14 and #15 from the manual run plus 6 more `QA-AP2485-*` curves from the automation runs, all on Dev. Earning curves cannot be deleted. 60-month curves were not re-checked.
- **Automation:** `earningCurveType_AP2485.spec.ts`, 3 of 3 passed cases automated, all passing (R5 APPROVE). No pull request, because the gh CLI is not installed.

[Full run summary](AP-2485_run-summary.md) · [Test report](AP-2485_test-report.md) · [Review record](../7-reviews/AP-2485_review.md)

### AP-2486 — Saving a Custom earning curve with an empty monthly factor shows an HTTP 500 error page
**Result: PASS. All 3 test cases passed on Dev (v2dev). An empty Monthly Factor now shows "This value should not be blank." instead of the HTTP 500 page. Comment 19440 was posted and AP-2486 moved from QC to Done.**

- **Where it is:** last stage s8 · Jira QC → Done · Vinh Le - QC
- **Failures:** None.
- **Decisions:** Gate B rule B3, execute (R2, round 1) · Gate C skipped, no failures (R3, round 1) · Gate D rule §3.2 "All PASS", move to Done (R4, round 1).
- **Needs someone:** Nothing. `qa-docs/earning-curves.md` still says that an empty factor gives HTTP 500, which is the staging behaviour, so update it once staging has the fix.
- **Left behind:** Curves #22 and #23 from the manual run, 6 spec curves from the automation, and probe curves #24 and #25, all on Dev and none deletable. The ±1000 factor limit was not tested.
- **Automation:** `earningCurveEmptyFactor_AP2486.spec.ts`, 3 of 3 automated, all passing (R5 APPROVE). No pull request (gh missing).

[Full run summary](AP-2486_run-summary.md) · [Test report](AP-2486_test-report.md) · [Review record](../7-reviews/AP-2486_review.md)

### AP-2477 — Simplify /quote/new/edit-vehicle to minimal fields with VIN decoder pre-fill
**Result: FAIL. 9 of 12 test cases passed on Dev (75%; the threshold is 90%). 1 bug was filed (AP-2507). Comment 19441 was posted and the story stays in QC.**

- **Where it is:** last stage s8 · Jira QC → unchanged · Vinh Le - QC
- **Failures:** AP2477_007: clicking "Décoder" with a valid VIN saves quote #6437 at once and empties the form instead of filling it in. Filed as AP-2507 (High), related to AP-2492. AP2477_008 and AP2477_009 are BLOCKED by the same fault.
- **Decisions:** Gates A and B were decided by the user on 2026-10-12 · Gate C rule C3 → E2, file new and link to AP-2492 (R3, round 1) · Gate D, not moved, 75% (R4). The orchestrator allowed the bare `/quote` route on Dev, because that form is the feature under test.
- **Needs someone:** The developer must fix AP-2507. Then re-run AP2477_007–009.
- **Left behind:** Quotes 6437–6440 with vehicles 1067–1070 from the manual run, and quotes 6441–6450 from the automation, all on Dev. Dealers cannot delete quotes. The `navigation-map.md` row for this route is out of date.
- **Automation:** `minimalQuoteVehicleForm_AP2477.spec.ts`, 9 of 9 passed cases automated, all passing (R5 APPROVE). It never clicks "Décoder". No pull request (gh missing).

[Full run summary](AP-2477_run-summary.md) · [Test report](AP-2477_test-report.md) · [Review record](../7-reviews/AP-2477_review.md)

### AP-1948 — CBI / CVE Tesla Price modification
**Result: not ready, blocked. 3 of 9 test cases passed on Dev (33%) and none failed. 6 are BLOCKED. Comment 19442 was posted and the ticket stays in QC.**

- **Where it is:** last stage s8 · Jira QC → unchanged · Vinh Le - QC
- **Failures:** None. AP1948_004–006 wait on Q-001 (which vehicles are in Category A, B and C). AP1948_007–008 wait on Q-002 (whether the original Tesla prices still apply). AP1948_003 stops at the Stripe payment page because there is no test card.
- **Decisions:** Gate A rule A2, questions posted in comment 19432, continue (R1) · Gate B rule B2, promote AP1948_009 (R2, rework 1, approved round 2) · Gate C not reached (R3, rework 1 because a 2022 Model 3 is usable, approved round 2) · Gate D, not moved, 33% and Blocking questions open (R4).
- **Needs someone:** The author of AP-1948 must answer Q-001 and Q-002. The QA must provide Stripe sandbox test card details for AP1948_003.
- **Left behind:** Quote requests for customer 1493 (client.stage.916–919) on Dev, one of them with an unpaid Stripe sandbox checkout. Program term 16's price was changed and then restored to 1025.
- **Automation:** `termPrice_AP1948.spec.ts`, 3 of 3 automated, all passing. It restores term 16's price in `finally`. No pull request (gh missing).

[Full run summary](AP-1948_run-summary.md) · [Test report](AP-1948_test-report.md) · [Review record](../7-reviews/AP-1948_review.md)

### AP-1381 — duplicate name visual
**Result: PASS. 3 of 4 test cases passed on Dev and the fourth was SKIPPED (100% of the cases that ran). Comment 19443 was posted. AP-1381 moved to Ready for release and was assigned to Ken Nguyen.**

- **Where it is:** last stage s8 · Jira QC → Ready for release · Ken Nguyen
- **Failures:** None. AP1381_003 was SKIPPED: the dealer invoice page offers no PDF, only a "Print" button.
- **Decisions:** Gate A rule A3, continue (R1) · Gate B rule B3, execute (R2, rework 1 because the case picked a Permaplate invoice instead of a warranty invoice, approved round 2) · Gate C not reached (R3, round 1) · Gate D, Ready for release with Ken Nguyen as assignee (R4).
- **Needs someone:** The reporter's Judgement questions Q-002 and Q-003 are open. On Dev, the admin invoice "PDF" button gave an error page once (see AP-2529). If Q-003 brings the PDF into scope, check it on staging.
- **Left behind:** Nothing was created. Earlier s4 work added `qa-docs/billing-invoices.md`.
- **Automation:** `invoiceToBlock_AP1381.spec.ts`, 3 of 3 automated, all passing (R5 APPROVE). No pull request (gh missing).

[Full run summary](AP-1381_run-summary.md) · [Test report](AP-1381_test-report.md) · [Review record](../7-reviews/AP-1381_review.md)

### AP-2225 — Dealer Area: AutoShield create contract
**Result: FAIL. 1 of 15 test cases passed on Dev (6.7%). 1 bug was filed (AP-2508, High). Comment 19444 was posted and the story stays in QC.**

- **Where it is:** last stage s8 · Jira QC → unchanged · Ken Nguyen
- **Failures:** AP2225_002, 003, 005, 006, 007, 008 and 014. The Road side protection page on Dev has no vehicle, client, date or financing fields and no "Generate Contract" button, so no AutoShield contract can be made. All seven are filed as one bug, AP-2508 (High). This is a regression (something that used to work and stopped working): these fields were on staging in July and August 2026.
- **Decisions:** Gate A rule A3, continue (R1) · Gate B rule B1 (R2, rework 2, approved round 3) · Gate C rule C4, one new bug (R3, round 1) · Gate D, not moved, 6.7% (R4). E4 answer: "Save" must never be pressed as a stand-in for Generate Contract.
- **Needs someone:** The developer must answer AP-2508: were the fields removed on purpose, and which control now creates the contract? AP2225_009–013 and 015 stay BLOCKED until then. **The QA should fix the spec:** it opens the newest quote with a VIN, which is now an AP-2498 quote, so it fails.
- **Left behind:** Quotes 6451–6453 on Dev. No contract was created.
- **Automation:** `roadSideProtection_AP2225.spec.ts`, 1 of 1 automated and read-only. It passed when written but **now fails** because of the quote choice described above. No pull request (gh missing).

[Full run summary](AP-2225_run-summary.md) · [Test report](AP-2225_test-report.md) · [Review record](../7-reviews/AP-2225_review.md)

### AP-2374 — Status Change email notification: Add notify email and client email
**Result: FAIL. 4 of 10 test cases passed on Dev (40%). 1 bug was filed (AP-2509). Comment 19445 was posted and the story stays in QC.**

- **Where it is:** last stage s8 · Jira QC → unchanged · Ken Nguyen
- **Failures:** AP2374_001: the "Notify by email" checkbox and recipient field appear only on the Authorized and Refused status forms. Filed as AP-2509 (Medium).
- **Decisions:** Gate A rule A2, Q-001 posted (R1) · Gate B rule B3 (R2, rework 1 because setup must start from a vehicle, approved round 2) · Gate C rule C4, file AP-2509; **R3 parked AP2374_002–004** because Q-010 had never been asked · Gate D, not moved, 40% (R4).
- **Needs someone:** Ken Nguyen must answer Q-010 (where the notify email is entered) and Q-001. AP2374_006 is blocked by an HTTP 500 error on the admin "Add attachment" action, which was recorded but not filed.
- **Left behind:** Quote 6454, contract 26df1-844, and claims 331 and 332 on Dev. The automation adds status changes to claims 331 and 332 and sends "Claim updated" emails on every run.
- **Automation:** `claimStatusNotify_AP2374.spec.ts`, 4 of 4 automated, all passing (R5 APPROVE). No pull request (gh missing).

[Full run summary](AP-2374_run-summary.md) · [Test report](AP-2374_test-report.md) · [Review record](../7-reviews/AP-2374_review.md)

### AP-2377 — Customer portal changes
**Result: FAIL. 7 of 11 test cases passed on Dev (63.6%). 2 bugs were filed. Comment 19446 was posted and the story stays in QC.**

- **Where it is:** last stage s8 · Jira QC → unchanged · Ken Nguyen
- **Failures:** AP2377_004: letters in "Warranty mileage limit" give an HTTP 500 error page (AP-2510, Medium). AP2377_008 and 011: the surcharge summary line leaves out "OUI" (AP-2511, Medium). AP2377_010 is BLOCKED because there is no test payment method.
- **Decisions:** Gate A rule A3 (R1) · Gate B rule B2, promote AP2377_011 (R2, rework 1 for a credential in a case file and a late check, approved round 2) · Gate C rule C4, two new bugs (R3, round 1) · Gate D, not moved (R4).
- **Needs someone:** The author must answer the mileage-limit rule (Q-001) and say whether "OUI" is required (on AP-2510 and AP-2511).
- **Left behind:** Purchase sessions for client.stage.932–941 on Dev, plus 7 more sessions from each automation run. Nothing was paid. The header logo returns HTTP 500 on every page.
- **Automation:** `buyOnline_AP2377.spec.ts`, 7 of 7 automated, all passing (R5 APPROVE). No pull request (gh missing).

[Full run summary](AP-2377_run-summary.md) · [Test report](AP-2377_test-report.md) · [Review record](../7-reviews/AP-2377_review.md)

### AP-2428 — Dealer Permaplate Contract
**Result: FAIL. 9 of 15 test cases passed on Dev (60%). 4 bugs were filed. Comment 19447 was posted and the story stays in QC.**

- **Where it is:** last stage s8 · Jira QC → unchanged · Vinh Le - QC
- **Failures:**
  - AP2428_010 and 012: the contract PDF download gives an HTTP 500 error for every contract on Dev. Filed as AP-2512 (High).
  - AP2428_005: "Other name on file" is empty (AP-2513, Medium), and Province is a free-text box (AP-2514, Medium).
  - AP2428_007: there is no "Cost Price" label (AP-2515, Low).
- **Decisions:** Gate A rule A2, Q-001–Q-003 posted (R1) · Gate B rule B2, promote AP2428_015 (R2, rework 1, approved round 2) · Gate C rule C4 ×4 (R3, round 1) · Gate D, not moved, 60%, a High bug and Blocking questions open (R4).
- **Needs someone:** Ken Nguyen must answer Q-001–Q-003. AP2428_004 and 008 are BLOCKED until then.
- **Left behind:** Quotes 6456–6460, contracts PNA-0000000017–19 and invoices #938–#940 on Dev. Option 20's Dealer Cost was changed and then restored.
- **Automation:** `permaplateContract_AP2428.spec.ts`, 7 of 9 passed cases automated, all passing (R5 APPROVE). AP2428_009 and 015 were not automated, because each run would create a contract that cannot be deleted. No pull request (gh missing).

[Full run summary](AP-2428_run-summary.md) · [Test report](AP-2428_test-report.md) · [Review record](../7-reviews/AP-2428_review.md)

### AP-2434 — Admin API: create warranty notes
**Stopped: at s3b. The 8 test cases are designed and approved but were not executed, because every case needs a staging admin API key that QA does not have.**

- **Where it is:** last stage s3b · Jira QC → unchanged · Vinh Le - QC
- **Failures:** None (not executed).
- **Decisions:** Gate A rule A3, continue (R1) · Gate B rule B3 (independent R2, rework 1 because curl would read a note starting with "<" as a file and send nothing, approved round 2).
- **Needs someone:** The QA must provide a staging admin API key, stored as `AVP_ADMIN_API_KEY` in `/.env`, and confirm the API host (Q-002). Then resume with "AP-2434".
- **Left behind:** Nothing.
- **Automation:** Not run.

[Full run summary](AP-2434_run-summary.md) · [Review record](../7-reviews/AP-2434_review.md)

### AP-2435 — Admin API - warranty search
**Stopped: at s3b. The 12 test cases are designed and approved but were not executed. All are BLOCKED on the same missing admin API key (Q-012).**

- **Where it is:** last stage s3b · Jira QC → unchanged · Vinh Le - QC
- **Failures:** None (not executed).
- **Decisions:** Gate A rule A3, continue (R1) · Gate B rule B3 (independent R2, rework 2, approved round 3). The orchestrator did not let the worker create an API key, because creating a real credential is the QA's decision.
- **Needs someone:** The QA must provide the key, the same one as AP-2434. One can be created at `/admin/api-keys`. Then resume with "AP-2435".
- **Left behind:** Nothing.
- **Automation:** Not run.

[Full run summary](AP-2435_run-summary.md) · [Review record](../7-reviews/AP-2435_review.md)

### AP-2471 — Admin: Earning Curve management
**Result: PASS. 16 of 17 test cases passed on Dev and 1 was SKIPPED (100% of the cases that ran). Comment 19448 was posted. AP-2471 moved to Ready for release and was assigned to Ken Nguyen.**

- **Where it is:** last stage s8 · Jira QC → Ready for release · Ken Nguyen
- **Failures:** None. AP2471_015 (delete) was SKIPPED because Dev has no delete control.
- **Decisions:** Gate A rule A2, Q-001/Q-002 posted in comment 19435 · **User decision (2026-11-01T14:36Z): every open question is answered by what Dev does** · Gate B rule B2, promote AP2471_016–017 (R2, round 1) · Gate C not reached (R3, round 1) · Gate D, Ready for release (R4).
- **Needs someone:** Nothing is blocking. Note that the PASS rests on Dev's behaviour being accepted as the answer to the open questions. Dev has no delete, although the user story promises one, and odd values (negative factors, totals other than 100%) save without a warning.
- **Left behind:** Curves #32–#37 plus 14 curves from the automation runs on Dev, none deletable. Each automation run adds 7 more.
- **Automation:** `earningCurveManagement_AP2471.spec.ts`, 16 of 16 automated, all passing (R5 APPROVE). No pull request (gh missing).

[Full run summary](AP-2471_run-summary.md) · [Test report](AP-2471_test-report.md) · [Review record](../7-reviews/AP-2471_review.md)

### AP-2491 — Cleanup deprecated functions
**Stopped: at s1. The ticket has only a title, so no test case could be designed. Question Q-001 was posted for the author (comment 19436).**

- **Where it is:** last stage s1 · Jira QC → unchanged · Nicolas-Eric Tain
- **Failures:** None (not tested).
- **Decisions:** Gate A rule A1, PARK, waiting on the author (R1, round 1).
- **Needs someone:** The author must say which functions were removed, where they were used and what users should see afterwards. Then resume with "AP-2491 --from s1".
- **Left behind:** Nothing.
- **Automation:** Not run.

[Full run summary](AP-2491_run-summary.md) · [Review record](../7-reviews/AP-2491_review.md)

### AP-2493 — Cancelling a product from a quote
**Result: FAIL. 12 of 14 test cases passed on Dev (86%). 1 bug was filed (AP-2516). The ticket comment was posted and the story stays in QC.**

- **Where it is:** last stage s8 · Jira QC → unchanged · Vinh Le - QC
- **Failures:** AP2493_011 and 012: the quote Subtotal never includes the Permaplate cost, so cancelling or re-adding Permaplate never changes it. Filed as AP-2516 (Medium). The cancel action itself works.
- **Decisions:** Gate A rule A3 (R1) · Gate B rule B3 (R2, rework 1 because the subtotal check assumed an open answer, approved round 2) · Gate C rule C4, one bug (R3, rework 1 to re-run AP2493_010, approved round 2) · Gate D, not moved, 86% (R4).
- **Needs someone:** The developer must fix AP-2516. Questions Q-002–Q-008 were posted for the product owner.
- **Left behind:** Quotes 6461–6469 with Chubb contract AVP000169 (permanent), and quotes 6470–6478 from the automation, all on Dev.
- **Automation:** `cancelQuoteProduct_AP2493.spec.ts`, 12 of 12 automated, all passing (R5 APPROVE). No pull request (gh missing).

[Full run summary](AP-2493_run-summary.md) · [Test report](AP-2493_test-report.md) · [Review record](../7-reviews/AP-2493_review.md)

### AP-2494 — Quotes list: replace "Produits" with "Contracts" and add quote search
**Result: FAIL. 14 of 19 test cases passed on Dev (74%). 2 bugs were filed. Comment 19450 was posted and the story stays in QC.**

- **Where it is:** last stage s8 · Jira QC → unchanged · Vinh Le - QC
- **Failures:**
  - AP2494_010: a saved sale number does not appear in the quote's Contracts cell. Filed as AP-2517 (Medium).
  - AP2494_005, 008 and 012 are BLOCKED because creating a roadside contract gives an HTTP 500 error. Filed as AP-2518 (High), related to AP-2508.
  - AP2494_007 is BLOCKED because Dev has no GAP contract.
- **Decisions:** Gate A rule A3 (R1) · Gate B rule B1 (R2, rework 2, approved round 3) · Gate C rules C4 and C3 → E2, two new bugs (R3, rework 1 for evidence, approved round 2) · Gate D, not moved, 74% (R4).
- **Needs someone:** The developer must fix AP-2518 and answer Q-003 on AP-2517.
- **Left behind:** Quotes 6479–6483, Chubb contract AVP000170 and sale AP2494-S-957 on Dev.
- **Automation:** `quoteListContractsSearch_AP2494.spec.ts`, 14 of 14 automated, all passing and read-only (R5 APPROVE). No pull request (gh missing).

[Full run summary](AP-2494_run-summary.md) · [Test report](AP-2494_test-report.md) · [Review record](../7-reviews/AP-2494_review.md)

### AP-2496 — Download all finalized documents from a quote in one click
**Result: FAIL. 2 of 9 test cases passed on Dev (22%). 1 bug was filed (AP-2519). Comment 19451 was posted and the story stays in QC.**

- **Where it is:** last stage s8 · Jira QC → unchanged · Vinh Le - QC
- **Failures:** AP2496_008: "Download all documents" (`/quote/{id}/documents/download`) gives an HTTP 500 error on every quote, even where each single PDF downloads fine. Filed as AP-2519 (High). Six cases are BLOCKED by AP-2518.
- **Decisions:** Gate A rule A3 (R1) · Gate B rule B2, promote AP2496_009 (R2, rework 2, approved round 3) · Gate C rule C4, new bug (R3, rework 1 for evidence, approved round 2) · Gate D, not moved (R4).
- **Needs someone:** The developer must fix AP-2519 and AP-2518. Then re-run with "AP-2496 --from s4".
- **Left behind:** Quotes 6484–6489 on Dev. No contract was created.
- **Automation:** `downloadAllDocuments_AP2496.spec.ts`, 2 of 2 automated, all passing and read-only. No pull request (gh missing).

[Full run summary](AP-2496_run-summary.md) · [Test report](AP-2496_test-report.md) · [Review record](../7-reviews/AP-2496_review.md)

### AP-2497 — Add extended warranty to a quote: capture missing vehicle fields instead of a dead end
**Result: FAIL. 4 of 15 test cases passed on Dev (27%). 3 bugs were filed. Comment 19452 was posted and the story stays in QC.**

- **Where it is:** last stage s8 · Jira QC → unchanged · Vinh Le - QC
- **Failures:** 11 cases fail on three faults in the add-extended-warranty window:
  - The Vehicle type field is missing (AP-2520, Medium).
  - The form is folded behind "Edit" (AP-2521, Medium).
  - Field errors are hidden inside the folded form (AP-2522, Medium).
- **Decisions:** Gate A rule A3 (R1) · Gate B rule B2, promote AP2497_015 (R2, round 1) · Gate C rule C4 ×3 (R3, rework 1 for failing-step screenshots, approved round 2) · Gate D, not moved, 27% (R4).
- **Needs someone:** The author must say whether the folded form (AP-2521) is intended. The ticket's central path was only observed, not run as a test case. Re-test it with a vehicle made through `/quote/new/edit-vehicle`.
- **Left behind:** Vehicles 1082–1097 and quotes 6490–6505 on Dev, several of them changed. The automation left vehicles 1098–1105 and quotes 6506–6513.
- **Automation:** `warrantyVehicleForm_AP2497.spec.ts`, 4 of 4 automated, all passing (R5 APPROVE). No pull request (gh missing).

[Full run summary](AP-2497_run-summary.md) · [Test report](AP-2497_test-report.md) · [Review record](../7-reviews/AP-2497_review.md)

### AP-2498 — Roadside protection: keep the existing vehicle form visible and add VIN + Year
**Result: FAIL. 2 of 14 test cases passed on Dev (14%). 3 bugs were filed. Comment 19453 was posted and the story stays in QC.**

- **Where it is:** last stage s8 · Jira QC → unchanged · Vinh Le - QC
- **Failures:**
  - The wrong notice text appears when there are no products (AP2498_001, 012). Filed as AP-2523.
  - The vehicle form folds behind "Edit" when products are listed (AP2498_002, 003, 009, 010, 011, 013). Filed as AP-2524, related to AP-2521.
  - The VIN is not required (AP2498_005, 006). Filed as AP-2525.
  - All three are Medium.
- **Decisions:** Gate A rule A3 (R1) · Gate B rule B3 (R2, rework 2; **round 3 parked AP2498_004 only**, because the "nothing else" check clashes with a likely hidden security field) · Gate C rule C3 → E2 ×3 (independent R3, round 1. The worker had run its own inline R3, which the orchestrator did not rely on.) · Gate D, not moved, 14% (R4).
- **Needs someone:** The author must confirm which inputs the form may contain (the AP2498_004 park reason is posted in comment 19453). AP2498_014 is blocked by AP-2508.
- **Left behind:** Vehicles 1106–1118 and quotes 6514–6526 on Dev, plus vehicles 1119–1124 and quotes 6527–6532 from the automation. **Side effect:** these quotes broke the AP-2225 spec.
- **Automation:** `roadSideProtectionVehicleForm_AP2498.spec.ts`, 2 of 2 automated, all passing (R5 APPROVE). No pull request (gh missing).

[Full run summary](AP-2498_run-summary.md) · [Test report](AP-2498_test-report.md) · [Review record](../7-reviews/AP-2498_review.md)

### AP-2499 — Add GAP/creditors insurance to a quote: embed the financing form in the add modal
**Result: FAIL. 5 of 13 test cases passed on Dev (38%). 3 bugs were filed. Comment 19454 was posted and the story stays in QC.**

- **Where it is:** last stage s8 · Jira QC → unchanged · Vinh Le - QC
- **Failures:**
  - AP2499_003 and 004: the financing form opens folded into one line. Filed as AP-2526.
  - AP2499_006: the creditors window draws the whole quote page inside it. Filed as AP-2527.
  - AP2499_007 and 008: "Get Quote" reloads the page and closes the window. Filed as AP-2528, related to AP-2410.
  - All three are Medium.
- **Decisions:** Gate A rule A3 (R1) · Gate B rule B3 (R2, rework 1, approved round 2) · Gate C rules C4, C4 and C3 → E2 (independent R3, round 1, which overrode the worker's inline R3) · Gate D, not moved, 38% (R4).
- **Needs someone:** The author must answer Q-011 (is the residual required?) and Q-007. There is no Humania dealer on Dev (Q-002), so AP2499_013 is BLOCKED.
- **Left behind:** Quotes 6533–6544 on vehicle 915 on Dev, with financings and Chubb/GAP quotes but no contracts.
- **Automation:** `gapCreditorsFinancingForm_AP2499.spec.ts`, 5 of 5 automated, all passing (R5 APPROVE). No pull request (gh missing).

[Full run summary](AP-2499_run-summary.md) · [Test report](AP-2499_test-report.md) · [Review record](../7-reviews/AP-2499_review.md)

### AP-2501 — Permaplate invoice - include name of the term in the description
**Result: FAIL. 1 of 6 test cases passed on Dev (17%). 1 bug was filed (AP-2529, High). Comment 19455 was posted and the story stays in QC.**

- **Where it is:** last stage s8 · Jira QC → unchanged · Vinh Le - QC
- **Failures:** AP2501_003: the admin invoice "PDF" button (`/admin/invoice/{id}/pdf`) gives an HTTP 500 error for every invoice on Dev. Filed as AP-2529 (High). AP2501_002, 004 and 005 are BLOCKED because dealer 1380 has only one Permaplate term on Dev. AP2501_006 is BLOCKED on Q-001.
- **Decisions:** Gate A rule A2, Q-001 posted in comment 19437 (R1) · Gate B rule B3 (R2, rework 1 because the case could not tell the invoice PDF from the contract PDF, approved round 2) · Gate C rule C4, new bug (R3, round 1) · Gate D, not moved (R4).
- **Needs someone:** The author must answer Q-001 (Blocking) and Q-007. **The QA must decide** whether to link a second Permaplate term (for example "5 ans") to dealer 1380 on Dev so that AP2501_002, 004 and 005 can run.
- **Left behind:** Quotes 6555 and 6556, contract PNA-0000000020 and unpaid invoice 941 on Dev.
- **Automation:** `permaplateInvoiceTerm_AP2501.spec.ts`, 1 of 1 automated, passing and read-only. No pull request (gh missing).

[Full run summary](AP-2501_run-summary.md) · [Test report](AP-2501_test-report.md) · [Review record](../7-reviews/AP-2501_review.md)

### AP-2503 — Generate contract for a quote's extended warranty
**Result: FAIL. 7 of 10 test cases passed on Dev (70%). 3 bugs were filed. Comment 19456 was posted and the story stays in QC.**

- **Where it is:** last stage s8 · Jira QC → unchanged · Vinh Le - QC
- **Failures:**
  - AP2503_003: the Program Summary has no delivery date. Filed as AP-2530 (Medium).
  - AP2503_005: the VIN and delivery date can be edited although they should be read-only. Filed as AP-2531 (Medium).
  - AP2503_007: a quote without financing cannot become a contract unless the dealer enters a financing company. Filed as AP-2532 (High), worded as a question.
- **Decisions:** Gate A rule A3 (R1) · Gate B rule B3 (R2, rework 1 because the read-only VIN was never judged, approved round 2) · Gate C rule C4 ×3 (R3, round 1) · Gate D, not moved, 70% and a High bug (R4).
- **Needs someone:** **The QA must re-check AP-2532 before the developer acts on it.** In the Playwright test runner, the Generate Contract form was posted with an empty last name and no financing company. That contradicts the browser refusal that AP-2532 and AP2503_007/008 rest on.
- **Left behind:** Vehicles 1125–1129 and quotes 6557–6561 on Dev, with contracts APOP01-845/846/847 and invoices #942–#944 ($456.00 each, payment pending). None of them can be deleted.
- **Automation:** `warrantyGenerateContract_AP2503.spec.ts`, 3 passing plus 1 fixme (a test that is written but switched off until its problem is fixed), AP2503_008. 4 of the 7 passed cases are covered. AP2503_004, 006 and 009 were not automated, because they would create contracts that cannot be deleted or need data that no longer exists. No pull request (gh missing).

[Full run summary](AP-2503_run-summary.md) · [Test report](AP-2503_test-report.md) · [Review record](../7-reviews/AP-2503_review.md)

### AP-2410 — Chubb Insurance Quote page shows an error on a valid submit
**Stopped: at s3b. This was a design-only run, because the ticket is in Jira status "QA", not QC. 4 re-test cases are designed, including AP2410_004, which replays the exact inputs that gave "Debtor is -1 years old".**

- **Where it is:** last stage s3b · Jira QA → unchanged · Vinh Le - QC
- **Failures:** None (not executed).
- **Decisions:** Gate A not applicable (bug re-test) · Gate B rule B3 (independent R2, rework 2, approved round 3).
- **Needs someone:** Move the ticket to QC once the fix is deployed. Then run "AP-2410 --from s4". AP-2528 (Get Quote reloads the page) touches the same button.
- **Left behind:** Nothing.
- **Automation:** Not run.

[Full run summary](AP-2410_run-summary.md) · [Review record](../7-reviews/AP-2410_review.md)

### AP-2441 — Admin: Manage user permissions from a User Details Page
**Stopped: at s3b. This was a design-only run, because the ticket is in Jira status "QA". 12 test cases are designed.**

- **Where it is:** last stage s3b · Jira QA → unchanged · Vinh Le - QC
- **Failures:** None (not executed).
- **Decisions:** Gate A rule A3 (R1) · Gate B rule B2, promote AP2441_012 (independent R2, rework 1 because the edit action was never checked, approved round 2).
- **Needs someone:** Move the ticket to QC once the build is ready. Then run "AP-2441".
- **Left behind:** Nothing.
- **Automation:** Not run.

[Full run summary](AP-2441_run-summary.md) · [Review record](../7-reviews/AP-2441_review.md)

### AP-2459 — Permaplate contract generation returns HTTP 500 when Financing company is left unselected
**Stopped: at s3b. This was a design-only run, because the ticket is in Jira status "QA". 3 re-test cases are designed.**

- **Where it is:** last stage s3b · Jira QA → unchanged · Vinh Le - QC
- **Failures:** None (not executed).
- **Decisions:** Gate A not applicable (bug re-test) · Gate B rule B3 (independent R2, round 1).
- **Needs someone:** Move the ticket to QC once the fix is deployed. Then run "AP-2459 --from s4". AP-2532 (financing company required on the warranty contract) is related.
- **Left behind:** Nothing.
- **Automation:** Not run.

[Full run summary](AP-2459_run-summary.md) · [Review record](../7-reviews/AP-2459_review.md)

### AP-2495 — Cannot view vehicle detail's page
**Stopped: at s3b. This was a design-only run, because the ticket is in Jira status "QA". 4 read-only test cases are designed. The fix was deployed only to the develop environment (2026-10-15).**

- **Where it is:** last stage s3b · Jira QA → unchanged · Vinh Le - QC
- **Failures:** None (not executed).
- **Decisions:** Gate A not applicable (bug re-test) · Gate B rule B3 (independent R2, round 1).
- **Needs someone:** Move the ticket to QC once the fix is deployed. Then run "AP-2495 --from s4".
- **Left behind:** Nothing.
- **Automation:** Not run.

[Full run summary](AP-2495_run-summary.md) · [Review record](../7-reviews/AP-2495_review.md)

### AP-2506 — Generate contract for a quote's Esthetic protection product
**Stopped: at s3b. This was a design-only run, because the ticket is in Jira status "QA". 9 test cases are designed, and AP2506_002 waits on the author's Blocking question Q-001.**

- **Where it is:** last stage s3b · Jira QA → unchanged · Vinh Le - QC
- **Failures:** None (not executed).
- **Decisions:** Gate A rule A2, Q-001 posted (R1) · Gate B rule B3 (independent R2, rework 1, approved round 2).
- **Needs someone:** The author must say which row acceptance criterion 1 means (Q-001). Move the ticket to QC once the build is ready.
- **Left behind:** Nothing.
- **Automation:** Not run.

[Full run summary](AP-2506_run-summary.md) · [Review record](../7-reviews/AP-2506_review.md)

## Bugs filed in this batch
26 bugs, AP-2507 to AP-2532: 7 High, 18 Medium, 1 Low. All were filed as new bugs in Backlog and assigned to Ken Nguyen. All describe Dev (v2dev).

| Bug | Severity | Ticket | Summary |
|---|---|---|---|
| AP-2507 | High | AP-2477 | Clicking "Décoder" on the new-quote vehicle form saves a quote and empties the form instead of filling it in |
| AP-2508 | High | AP-2225 | The Road side protection page has no vehicle, client, date or financing fields and no "Generate Contract" button, so no AutoShield contract can be created |
| AP-2509 | Medium | AP-2374 | The "Notify by email" checkbox and recipient field appear only on the Authorized and Refused claim status forms |
| AP-2510 | Medium | AP-2377 | Letters in the optional "Warranty mileage limit" field give an HTTP 500 error page on Continue |
| AP-2511 | Medium | AP-2377 | The summary shows the air-suspension surcharge question without the answer "OUI" |
| AP-2512 | High | AP-2428 | Downloading a Permaplate contract PDF from the quote details page gives an HTTP 500 error page |
| AP-2513 | Medium | AP-2428 | "Other name on file (Company's name)" on the Permaplate contract form is empty although the client has a company |
| AP-2514 | Medium | AP-2428 | Province on the Permaplate contract form is a free-text box instead of a list of provinces |
| AP-2515 | Low | AP-2428 | The Permaplate Program Summary has no "Cost Price" label; the cost is shown as "Total" |
| AP-2516 | Medium | AP-2493 | The quote Subtotal never includes the Permaplate cost, so adding or cancelling Permaplate never changes it |
| AP-2517 | Medium | AP-2494 | A saved sale contract number does not appear in the Contracts column of the quote list |
| AP-2518 | High | AP-2494 | Opening the roadside "Generate Contract" page of a quote gives an HTTP 500 error page |
| AP-2519 | High | AP-2496 | "Download all documents" gives an HTTP 500 error page even when every single PDF downloads correctly |
| AP-2520 | Medium | AP-2497 | The vehicle form in the add-extended-warranty window has no Vehicle type field |
| AP-2521 | Medium | AP-2497 | The add-extended-warranty window hides the vehicle form behind "Edit" and folds it again after every update |
| AP-2522 | Medium | AP-2497 | A refused "Update vehicle" shows no error, because the error is drawn inside the folded form |
| AP-2523 | Medium | AP-2498 | The roadside window shows "No road side protection products…" instead of the make-and-model notice the ticket names |
| AP-2524 | Medium | AP-2498 | When products are listed, the roadside window folds the vehicle form behind an "Edit" link |
| AP-2525 | Medium | AP-2498 | The roadside VIN field is not required; an empty-VIN Continue returns prices and saves |
| AP-2526 | Medium | AP-2499 | Once a quote has a financing, the GAP/creditors window folds the financing form into one line behind "Edit" |
| AP-2527 | Medium | AP-2499 | Saving the financing in the creditors window draws the whole quote page inside the window |
| AP-2528 | Medium | AP-2499 | "Get Quote" in the GAP/creditors window reloads the page and closes the window, so no result is shown |
| AP-2529 | High | AP-2501 | The admin invoice "PDF" button (`/admin/invoice/{id}/pdf`) gives an HTTP 500 error page for every invoice |
| AP-2530 | Medium | AP-2503 | The Program Summary on the warranty Generate Contract page does not show the delivery date |
| AP-2531 | Medium | AP-2503 | The VIN and delivery date can be edited on the warranty Generate Contract page although they should be read-only |
| AP-2532 | High | AP-2503 | A quote without financing cannot become a warranty contract unless the dealer enters a financing company (re-check this first, see AP-2503) |

## Open questions
- **AP-1948:** Q-001 (which vehicles are in categories A, B and C) and Q-002 (do the original Tesla prices still apply). Both are Blocking and must be answered by the ticket author (asked in comment 19432, reminded in 19442).
- **AP-2374:** Q-010 (where the notify email is entered, which blocks the parked cases 002–004) and Q-001. Both must be answered by Ken Nguyen (comments 19433 and 19445).
- **AP-2428:** Q-001–Q-003 (Blocking) must be answered by Ken Nguyen (reminded in comment 19447).
- **AP-2501:** Q-001 (Blocking, comment 19437) and Q-007 (no invoice PDF on the dealer side) must be answered by the author.
- **AP-2499:** Q-011 (is the residual required?) must be answered by the author (comment 19454).
- **AP-2498:** the park reason for AP2498_004 asks the author which inputs the form may contain (comment 19453).
- **AP-2491:** Q-001 (which functions were removed, and what should users see) must be answered by the author (comment 19436).
- **AP-2506:** Q-001 (which row acceptance criterion 1 means) must be answered by the author.
- **AP-1381:** Q-002 and Q-003 are Judgement questions for the reporter. They do not block the release.
- **AP-2434 / AP-2435:** the QA must provide a staging admin API key (`AVP_ADMIN_API_KEY`) and confirm the API host.
- **AP-2501:** the QA must decide whether to link a second Permaplate term to dealer 1380 on Dev.
- **AP-1948:** the QA must provide Stripe sandbox test card details for AP1948_003.
- **Answered during the batch:** the browser login permission question (E4) was resolved when the user added allow rules at 03:30Z. For AP-2471, the user decided that Dev's behaviour answers all open questions.

## Reviews
The independent reviewers sent most tickets back. Each ticket's worker ran its own review inside the run (an "inline" review). The orchestrator then sent the same work to a separate reviewer who had not seen the worker's reasoning (an "independent" review).

- **Test cases (Gate B, R2):** 24 tickets reached an independent R2 review. **18 of those 24 were sent back for rework at least once, and in every one of those 18 the worker's inline review had already approved the cases.** Six needed a second rework: AP-2225, AP-2435, AP-2494, AP-2496, AP-2498 and AP-2410. AP-2498 used up its last round and had one case parked. Six passed first time: AP-2485, AP-2486, AP-2471, AP-2497, AP-2459 and AP-2495. Common reasons were checks that judged an open question as if it were answered, invented test data, a curl recipe that silently sent nothing, and a credential written into a case file.
- **Execution results (Gate C, R3):** 18 tickets were reviewed. 12 were approved first time. 5 were sent back once, for re-runs or missing evidence: AP-1948, AP-2493, AP-2494, AP-2496 and AP-2497. AP-2374 was partly parked. For AP-2498 and AP-2499, the worker ran its own R3 inline. The orchestrator ran the independent R3 anyway, and that review's decision is the one that counts.
- **Gate A (R1):** AP-2491 was parked, waiting on the author. Every other R1 continued.
- **Outcome plans (R4) and automation (R5):** every outcome plan and every spec was approved in round 1.
- **Minor findings left open:** each review record lists them. The ones that matter outside the ticket:
  - The test-case files of AP-1948, AP-2486 and AP-2501 still name staging, although they were run on Dev.
  - `navigation-map.md` is out of date for AP-2477 and AP-2497.
  - `qa-docs/earning-curves.md` is out of date for AP-2486.
- **Credential notes from reviewers (no values copied here):**
  - A reviewer's login printed the Dev admin password in its tool output (AP-1948).
  - `playwright-log/` (ignored by git) has 49 files that mention password or fill, and nobody has inspected them.
  - AP-2460 and AP-2461 contain an admin password in plain text.
  - `qa-artifacts/base-test/execute.env.md` holds plain-text passwords, and a staging password appeared in a reviewer's output while that file was read (AP-2496).
  - The QA should rotate or scrub these.

Review records: [AP-2485](../7-reviews/AP-2485_review.md) · [AP-2486](../7-reviews/AP-2486_review.md) · [AP-2477](../7-reviews/AP-2477_review.md) · [AP-1948](../7-reviews/AP-1948_review.md) · [AP-1381](../7-reviews/AP-1381_review.md) · [AP-2225](../7-reviews/AP-2225_review.md) · [AP-2374](../7-reviews/AP-2374_review.md) · [AP-2377](../7-reviews/AP-2377_review.md) · [AP-2428](../7-reviews/AP-2428_review.md) · [AP-2434](../7-reviews/AP-2434_review.md) · [AP-2435](../7-reviews/AP-2435_review.md) · [AP-2471](../7-reviews/AP-2471_review.md) · [AP-2491](../7-reviews/AP-2491_review.md) · [AP-2493](../7-reviews/AP-2493_review.md) · [AP-2494](../7-reviews/AP-2494_review.md) · [AP-2496](../7-reviews/AP-2496_review.md) · [AP-2497](../7-reviews/AP-2497_review.md) · [AP-2498](../7-reviews/AP-2498_review.md) · [AP-2499](../7-reviews/AP-2499_review.md) · [AP-2501](../7-reviews/AP-2501_review.md) · [AP-2503](../7-reviews/AP-2503_review.md) · [AP-2410](../7-reviews/AP-2410_review.md) · [AP-2441](../7-reviews/AP-2441_review.md) · [AP-2459](../7-reviews/AP-2459_review.md) · [AP-2495](../7-reviews/AP-2495_review.md) · [AP-2506](../7-reviews/AP-2506_review.md)

## Automation pull requests — waiting for you
None — gh CLI not installed; specs are in the working tree, uncommitted.

The batch could not open pull requests because the GitHub command-line tool (`gh`) is not installed. Every automation run used `--no-pr`. The 18 spec files below, and the new page objects and flows they use, are in `playwright-automation/` as untracked files. Each spec runs only against Dev (v2dev).

| Ticket | Spec file | Tag | Tests |
|---|---|---|---|
| AP-2485 | `src/tests/admin/earningCurveType_AP2485.spec.ts` | `@AP-2485` | 3 passing |
| AP-2486 | `src/tests/admin/earningCurveEmptyFactor_AP2486.spec.ts` | `@AP-2486` | 3 passing |
| AP-2477 | `src/tests/dealer/minimalQuoteVehicleForm_AP2477.spec.ts` | `@AP-2477` | 9 passing |
| AP-1948 | `src/tests/client/termPrice_AP1948.spec.ts` | `@AP-1948` | 3 passing |
| AP-1381 | `src/tests/dealer/invoiceToBlock_AP1381.spec.ts` | `@AP-1381` | 3 passing |
| AP-2225 | `src/tests/dealer/roadSideProtection_AP2225.spec.ts` | `@AP-2225` | 1, **now failing** (picks an AP-2498 quote) |
| AP-2374 | `src/tests/admin/claimStatusNotify_AP2374.spec.ts` | `@AP-2374` | 4 passing |
| AP-2377 | `src/tests/client/buyOnline_AP2377.spec.ts` | `@AP-2377` | 7 passing |
| AP-2428 | `src/tests/dealer/permaplateContract_AP2428.spec.ts` | `@AP-2428` | 7 passing |
| AP-2471 | `src/tests/admin/earningCurveManagement_AP2471.spec.ts` | `@AP-2471` | 16 passing |
| AP-2493 | `src/tests/dealer/cancelQuoteProduct_AP2493.spec.ts` | `@AP-2493` | 12 passing |
| AP-2494 | `src/tests/dealer/quoteListContractsSearch_AP2494.spec.ts` | `@AP-2494` | 14 passing |
| AP-2496 | `src/tests/dealer/downloadAllDocuments_AP2496.spec.ts` | `@AP-2496` | 2 passing |
| AP-2497 | `src/tests/dealer/warrantyVehicleForm_AP2497.spec.ts` | `@AP-2497` | 4 passing |
| AP-2498 | `src/tests/dealer/roadSideProtectionVehicleForm_AP2498.spec.ts` | `@AP-2498` | 2 passing |
| AP-2499 | `src/tests/dealer/gapCreditorsFinancingForm_AP2499.spec.ts` | `@AP-2499` | 5 passing |
| AP-2501 | `src/tests/dealer/permaplateInvoiceTerm_AP2501.spec.ts` | `@AP-2501` | 1 passing |
| AP-2503 | `src/tests/dealer/warrantyGenerateContract_AP2503.spec.ts` | `@AP-2503` | 3 passing, 1 fixme |

Total: 100 tests in 18 specs. 98 pass, 1 fails (AP-2225) and 1 is fixme (AP-2503). Several specs create test data that cannot be deleted on every run:
- AP-2471 adds 7 earning curves.
- AP-2477 and AP-2493 add 3 quotes each.
- AP-2497 adds 4 vehicles and 4 quotes.
- AP-2499 adds 5 quotes.
- AP-2377 adds 7 purchase sessions.

To ship these, install `gh`, commit the files and re-run `run the QA batch --prs`.
