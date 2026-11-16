# QA Batch Report — 2026-11-15
Generated: 2026-11-15 · Selected: 19 (ready for QA: 18, assigned to me: 19; AP-2506 in QA status included by the QA's instruction) · Tested on Dev: 5 · Analysis re-checked: 11 · Blocked: 1 · Untouched: 2

## Summary
No ticket is ready for release. Five tickets were re-tested on Dev after their open questions were settled. AP-1948 came closest at 89% (8 of 9; the only gap is a missing Stripe test card), and the other four still fail on open bugs. Four new bugs were filed, all Medium. Every open question on every selected ticket was checked against Jira Stories and Tasks under the new knowledge-lookup rule. Most are now answered or accepted as current behaviour, and nothing new was posted as a question. The first thing the team should do: deploy the AP-2542 fix to Dev and make Dev's `claim_attachments` upload folder writable. Each of these blocks a whole set of cases.

| Verdict | Tickets |
|---|---|
| Ready for release | — |
| Not ready — failed | AP-2503 (50%), AP-2374 (73%), AP-2501 (67%), AP-2499 (38%) |
| Not ready — conditional | AP-1948 (89%, one case blocked on test data) |
| Not ready — blocked | AP-2502 (AP-2542 not on Dev; probe still HTTP 500) |
| Waiting on author | AP-2428 (Q-001, Q-003), AP-2501 (Q-001), AP-2504 (Q-001), AP-2505 (Q-001), AP-2506 (Q-001): each keeps one or two cases blocked by a sentence of the ticket that contradicts itself or reads two ways. All were already asked; nothing re-posted |
| Analysis re-checked only (no re-execution) | AP-2225, AP-2428, AP-2434, AP-2493, AP-2494, AP-2496, AP-2497, AP-2498, AP-2504, AP-2505, AP-2506 |
| Untouched | AP-2477 (no open question; waits for AP-2492, AP-2552), AP-2377 (blocked only by a customer-portal payment method) |

## Per ticket
| Ticket | Plan | Verdict | PASS | FAIL | BLOCKED | Bugs filed | Automated | Report |
|---|---|---|---|---|---|---|---|---|
| AP-1948 | re-plan with answer (Q-001/Q-003 answers, then knowledge lookup) | CONDITIONAL PASS | 8 | 0 | 1 | — | gate not met (89%) | [summary](AP-1948_run-summary.md) |
| AP-2503 | re-plan with answer (the QA's answer to Q-001–Q-011) | FAIL | 5 | 5 | 0 | AP-2563, AP-2564 | gate not met | [summary](AP-2503_run-summary.md) |
| AP-2374 | re-plan with knowledge lookup | FAIL | 8 | 2 | 1 | AP-2565 | gate not met | [summary](AP-2374_run-summary.md) |
| AP-2501 | re-plan with knowledge lookup | FAIL | 4 | 1 | 1 | — (AP-2529 commented) | gate not met | [summary](AP-2501_run-summary.md) |
| AP-2499 | re-plan with knowledge lookup | FAIL | 5 | 6 | 2 | AP-2566 | gate not met | [summary](AP-2499_run-summary.md) |
| AP-2502 | resume (probe) | BLOCKED | — | — | — | — | — | [summary](AP-2502_run-summary.md) |

## Ticket details

### AP-1948 — CBI / CVE Tesla Price modification
**CONDITIONAL PASS — 8/9 (89%), 0 bugs. Jira QC → QC (comment 19585).**
- **Where it is:** s7 done · Jira QC, unchanged · Vinh Le - QC
- **Failures:** None. AP1948_003 is BLOCKED: the Stripe sandbox checkout needs a test card that no one has.
- **Decisions:**
  - Q-001 was answered by Ken (19545) and Q-003 by Eric (19544).
  - Q-002 (the Tesla "Original ask" prices) is Accepted. The ticket's acceptance criteria say only that the price equals the term's suggested retail price; the "Original ask" figures are background.
  - All four Tesla models and both CVE term sets (122–126 for Category A, 129–133 for Category B) match the suggested retail price.
  - The morning's held comment, which re-asked Q-002, was never posted.
- **Needs someone:** a Stripe test card, so AP1948_003 can run. It should also check the amount charged: the hidden radio `price` attributes differ from the suggested retail price (term 129 shows 0.00).
- **Left behind:** quote-request sessions client.stage.1948101–108 for customer 1493 (1948103 left an unpaid Stripe sandbox checkout). No configuration changed.
- **Automation:** not run (89% < 90%).

### AP-2503 — Generate contract for a quote's extended warranty
**FAIL — 5/10 (50%). Jira QC → QC (comment 19584).**
- **Failures:**
  - AP2503_002: no contract preview and no "Open PDF in new tab" link. New bug **AP-2563**.
  - AP2503_003: no delivery date in the summary. Comment on AP-2530.
  - AP2503_005: the VIN accepts typing. Comment on AP-2531, citing AP-2544, which makes the VIN editable on purpose; the developer decides.
  - AP2503_007: a quote without financing still needs a financing company. Comment on AP-2532 (High).
  - AP2503_008: an empty start date gives HTTP 500. New bug **AP-2564**.
- **Decisions:**
  - The QA answered Q-001–Q-011 ("current behaviour is correct") and kept AP-2530, AP-2531 and AP-2532 open.
  - Orchestrator decision: delivered later Stories AP-2544/2545/2546/2559/2560 (Deploy to staging) supersede AP-2503's older criteria on the points they redesign. AP-2550 and AP-2561 (In Progress) do not.
- **Needs someone:** redesign AP2503_002, 004, 005, 007, 008 and 010 against the delivered check-out Stories in a later pass.
- **Left behind:** vehicles 1231–1235, quotes 6703–6707, permanent contracts APOP01-848/849/850 with invoices #952–#954. Quote 6705's client was edited.
- **Note:** comment 19584 was written by the R4 reviewer, because no draft was on disk (harness defect #7). Whether to re-review it is the QA's call.

### AP-2374 — Status change email notification
**FAIL — 8/11 (73%). Jira QC → QC (comment 19586).**
- **Decisions:**
  - Knowledge lookup: Q-010 was answered by AP-2357/AP-2372 (the notify email is set through the Admin API), so the four blocked cases ran on API-created claim 333.
  - Q-001–Q-008 are Accepted. AC 4's sentence is still required.
- **Failures:**
  - AP2374_001: AP-2509, unchanged.
  - AP2374_005: the emails lack "The claim ID … has been updated to status …". New bug **AP-2565**, related to AP-2392 (Done, not reopened).
- **Blocked:** AP2374_006. Dev cannot create `…/uploads/claim_attachments/`, so attachment upload returns HTTP 500 on both the admin form and the API.
- **Left behind:** quote 6708, contract 26df1-851 (invoice #955), claim 333 (Authorized), emails in client.stage.2374001 and 2374002.

### AP-2501 — Permaplate invoice: include the term name
**FAIL — 4/6 (67%). Jira QC → QC (comment 19588).**
- **Decisions:**
  - Q-007 was answered by AP-2099. The rest are Accepted.
  - Q-001 (the AC says "name of the invoice", the title says "name of the term") stays Blocking + Open as a contradiction.
  - AP2501_002 linked a second term ("5 ans") to dealer 1380 and unlinked it afterwards; the reviewer confirmed the restore on Dev.
- **Failures:** AP2501_003, the admin invoice PDF returns HTTP 500. Commented on **AP-2529** (High).
- **Blocked:** AP2501_006, on Q-001.
- **Left behind:** client terme.second.1115@yopmail.com, quote 6709, contract PNA-0000000028, unpaid invoice 956.

### AP-2499 — GAP/creditors insurance: embed the financing form
**FAIL — 5/13 (38%). Jira QC → QC (comment 19589).**
- **Decisions:**
  - Q-007 was answered by a developer comment on AP-2405 (a missing borrower date of birth fails the creditors quote). Q-008 was also answered by AP-2405. The other 12 are Accepted.
- **Failures:**
  - AP2499_005: a financing saved with an empty date of birth comes back with today's date. New bug **AP-2566**.
  - AP-2526, AP-2527 and AP-2528 are still open.
- **Blocked:**
  - AP2499_009: by AP-2566, because the error trigger cannot be set up.
  - AP2499_013: no Humania dealer on Dev (Q-002, test data).
- **Left behind:** quotes 6710 and 6711, each with a financing.

### AP-2502 — Separate compliance document PDF
**BLOCKED.** The 2026-11-15T11:27Z probe of `GET /compliance-documents/send` still returns HTTP 500. AP-2542 (Highest) is in Deploy to staging, but its fix is not on Dev. No cases were run.

## Bugs filed in this batch
| Bug | Severity | Ticket | Summary |
|---|---|---|---|
| AP-2563 | Medium | AP-2503 | Extended-warranty Generate Contract page no longer shows the contract preview or "Open PDF in new tab" link |
| AP-2564 | Medium | AP-2503 | Submitting with the warranty start date cleared returns HTTP 500 |
| AP-2565 | Medium | AP-2374 | Claim status-change emails do not contain "The claim ID … has been updated to status …" (same symptom as AP-2392, Done) |
| AP-2566 | Medium | AP-2499 | A financing saved with an empty Date of birth comes back with today's date |

All four are in Backlog and assigned to Minh Lưu. Existing bugs commented: AP-2530, AP-2531, AP-2532 (from AP-2503) and AP-2529 (from AP-2501).

## Open questions
Every open question was run through the new knowledge lookup (search Jira Stories and Tasks, otherwise accept the current behaviour). Nothing new was posted. These remain open because they are not product knowledge:
- **Contradictions or two-way readings in the ticket's own text**, already asked:
  - AP-2501 Q-001, AP-2504 Q-001, AP-2505 Q-001, AP-2506 Q-001
  - AP-2428 Q-001 and Q-003
  - Judgement only: AP-2494 Q-006/Q-015, AP-2496 Q-001/Q-007, AP-2497 Q-005/Q-008, AP-2498 Q-008/Q-009
- **Test data or access:**
  - AP-2499 Q-002 (Humania dealer)
  - AP-2498 Q-001 and Q-006
- **Information only:** AP-1948 Q-007/Q-008, AP-2225 Q-002/Q-011, AP-2505 Q-012, AP-2506 Q-002/Q-012.

## Reviews
Every checkpoint was decided by an independent qa-reviewer. The rework rounds were useful:
- **R1:** caught answers that the lookup had accepted wrongly. Self-contradictions on AP-2501, AP-2428 and AP-2497 Q-008, the AP-2496 Q-001 product/quote ambiguity and the AP-2434 Q-001/Q-007 status were all corrected before design.
- **R2:** strengthened weak checks: AP-1948 005 path A, AP-2374 007/009 and the new AP2374_011, and AP-2499 009's opening-values check.
- **R3:** stopped a Story-superseded result from being filed as a bug (AP-2503 002 step 3).
Records: `qa-artifacts/7-reviews/{KEY}_review.md`.

## Harness changes made today
At the QA's request, the knowledge lookup is in place, and agents no longer post questions for unknown field or workflow knowledge. During the batch it was refined so that:
- the ticket's own text (acceptance criteria or description) still wins over current behaviour;
- a contradiction or a two-way reading stays Open;
- the lookup reads the Acceptance Criteria field (`--plain` hides it);
- questions that are not product knowledge stay Open.

**Limitation:** lookups run before the AC-field fix may have missed definitions that sit only in that field. Reviewers checked the AC fields of the cited tickets on most of them.

Eleven further harness defects are written up as proposals, not applied, in `qa-artifacts/7-reviews/_harness-audit-2026-11-15.md`. Two need the QA's decision (D1: do Ken's answers count; D2: does Deploy to staging count as delivered).

## Automation pull requests — waiting for you
25 open automation PRs (#2–#26), all waiting for merge with no feedback. None was opened or changed by this batch, because no ticket passed the automation gate.
