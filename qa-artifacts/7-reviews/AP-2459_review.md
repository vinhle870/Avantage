# QA Review Record — AP-2459

## R2 — Test cases — round 1 — 2026-11-01T01:48:26Z
Reviewed: qa-artifacts/.pipeline/AP-2459.md, requirements/AP-2459-permaplate-contract-generation-returns-http-500.md, qa-artifacts/3-test-cases/AP2459_TestCases_001-003.md
Verdict: **APPROVE** · Gate B: execute the current cases (design-only run — stops after s3b) — rule B3
Findings: 0 blocker · 0 major · 2 minor

The three test cases for this bug re-test were reviewed inline (the pipeline runs as a
worker subagent) by re-reading the files from disk. Every expected result rests on a
sentence the ticket states — the either/or Expected Result, the "AutoCapital Canada"
success path, the REQ-004 invoice row and the PDF block named in the Suggested Root Cause —
and the two points the ticket leaves open (which branch is intended, what the empty
financing block shows) are record-only. There is no requirements analysis, test plan or
review-findings file because the bug flow skips s1, s2 and s3b, so checks 2.4–2.6 have
nothing to apply to and Gate B falls to rule B3. No credential is copied into the
artifacts, the entry route avoids the bare `/quote/new/client` route that has crashed since
2026-10-03, every hidden link has a URL fallback, and the shared product link on dealer 1380
is only restored by this run if this run created it.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2459_TestCases_001-003.md — AP2459_003 step 1 | The fallback path relies on AP2459_001 step 1 for the dealer's product link instead of carrying the link check itself. | None required now; if AP2459_003 is ever run on its own, add the product-link check to its step 1 as in AP2459_002 step 1. |
| F-2 | Minor | AP2459_TestCases_001-003.md — all cases, Delivered at | The fixed delivery date `2026-11-01` will be in the past if execution happens weeks later; nothing in the ticket says a past date is refused, but the quote stage may behave differently. | Executor records the date used; if the vehicle save refuses it, use the execution date and note it. |

## R2 — Test cases — round 1 — 2026-11-01T01:50:36Z
Reviewed: qa-artifacts/.pipeline/AP-2459.md, requirements/AP-2459-permaplate-contract-generation-returns-http-500.md, qa-artifacts/3-test-cases/AP2459_TestCases_001-003.md, qa-artifacts/qa-config/knowledge.md, qa-artifacts/base-test/test-centralized.md, qa-artifacts/base-test/navigation-map.md, qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2446_2026-09-13.md, qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2463_2026-10-04.md, .claude/skills/stlc-ticket-pipeline/routing.md (§3 Gate B, §4 bug re-test flow)
Verdict: **APPROVE** · Gate B: execute the current cases (design-only run, status "QA" — no execution in this batch) — rule B3
Findings: 0 blocker · 0 major · 2 minor

Independent reviewer pass (separate subagent, artifacts read fresh from disk; the earlier
inline R2 record was not relied on). The three cases follow the bug re-test flow in
routing.md §4 — one re-test of the steps to reproduce plus two nearby regression checks —
and every expected result traces to a sentence in the capture: the either/or Expected
Result (AP2459_001), the "AutoCapital Canada" success path in the Actual Result
(AP2459_002) and the PDF financing block in the Suggested Root Cause (AP2459_003). The one
open product point (which branch the build should choose, and what the empty financing
block shows) is record-only, so no PASS/FAIL hangs on a guess. Test data and routes were
checked against the sources: vehicle 915 / VIN `1FAHP35NX8W239204` and the
`client.stage.NNN` inbox rule are in `test-data`, the `/vehicle/915/details` → Create quote
entry and the `/quote/new/client` HTTP 500 warning are in `domain` quote-creation.md, the
dealer contract list and `permaplate-{contractId}.pdf` download are in `domain`, and the
invoice description naming the client is evidenced by the AP-2446 run of 2026-09-13
(invoice #926). The admin product-link routes and the contract-form route come from the
ticket's own steps, which the Execution Context discloses. There is no analysis, plan or
review-findings file because the bug flow skips s1, s2 and s3b, so checks 2.4 and 2.6 have
nothing to apply to, and Gate B falls to B3. The cases can be trusted for execution once the
ticket reaches QC; the two minor points below do not change any result.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2459_TestCases_001-003.md — AP2459_003 step 4 | The expected result requires the PDF to show the client name and VIN, but no source states the PDF's contents, and the AP-2463 run of 2026-10-04 records that the PDF text is compressed and the client name inside was not read — so the executor may be unable to confirm it, or could fail the case on an unsourced expectation. | When next touched, identify the document by the `permaplate-{contractId}.pdf` file name and the quote id in the Download link (as AP-2463 did), and record the client name and VIN seen in the PDF as observed values only; the pass condition stays HTTP 200 + `application/pdf` with no error page. |
| F-2 | Minor | AP2459_TestCases_001-003.md — AP2459_003 step 1 (fallback path) | The fallback quote depends on dealer 1380 having "10 ans" linked but points to AP2459_001 step 1 instead of carrying the link check itself, so the case is not self-contained if run alone. | When next touched, copy AP2459_002 step 1's conditional link check ("skip if AP2459_001 step 1 already ran") into AP2459_003's fallback path. |

## R3 — Execution results — round 1 — 2026-11-08T03:14:45Z
Reviewed: qa-artifacts/.pipeline/AP-2459.md, requirements/AP-2459-permaplate-contract-generation-returns-http-500.md, qa-artifacts/3-test-cases/AP2459_TestCases_001-003.md, qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2459_2026-11-08.md, every file in qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/ (6 images, 2 network logs), qa-artifacts/qa-docs/quote-creation.md (AP-2459 note), qa-artifacts/base-test/test-centralized.md (AP-2459 line), qa-artifacts/qa-config/tools.md, .claude/skills/stlc-ticket-pipeline/routing.md §3 Gate C, Jira AP-2512 (read back) and six open-bug searches
Verdict: **APPROVE** · Gate C: skipped — the log has no FAIL, so nothing is filed, linked or dismissed; s5 proceeds with zero bugs — rule — (no FAIL)
Findings: 0 blocker · 0 major · 2 minor

Independent reviewer pass, artifacts read fresh from disk. The two PASS results and the one SKIPPED result can be trusted. AP2459_001 passes on branch (b) of the ticket's own Expected Result: "or, if a financing company really is mandatory, the form refuses the submission with a message beside the field saying so" — the screenshot shows "ERROR This value should not be blank." directly above the red-bordered Financing company select, the network log shows POST 200 (no 5xx, no "Erreur — Désolé" page), and the step 5 screenshot shows the contract list unchanged at 7 rows with no "Perma Retest2459" row. Which branch is the intended one was record-only in the approved design, so the change from the 2026-11-02 Dev behaviour (blank company accepted) is correctly recorded and not judged. AP2459_002 is proven by the contract-list screenshot (new top row "Perma Finance2459", 80.00$) and the invoice screenshot (945, "#PNA-0000000021", "Perma Finance2459", $91.98). AP2459_003's SKIPPED rests on a rule written in the case itself (step 2: "If the build refuses the submission with a field message (branch (b) of AP2459_001), mark this case SKIPPED"), and the fallback quote 6691 screenshot shows the same refusal. The UI mapping is sound: the case's step 4 already allows reaching `/quote/{id}/permaplate-create-contract` when no "Create Contract" button exists, and the ⋯ → "Generate Contract" menu item opens that same route (also the route AP-2512's own steps use); the Financing company select is the same field, now under "Product Summary". The PDF HTTP 500 on PNA-0000000021 is correctly an observation only: no AP-2459 step downloads a PDF of a contract with a company, and it is already reported as AP-2512 (High, Backlog, open), whose summary and description name the same route `/quote/{quoteId}/permaplate-contract-download` and the same HTTP 500 technical-error page, so a new bug would be a duplicate. Both knowledge write-backs only add dated lines whose facts (quotes 6689–6691, PNA-0000000021, invoice 945, the refusal text, AutoCapital Canada value 39, the PDF 500) all appear in this run's log and evidence; the older Dev facts are kept, not deleted. No Dev or staging password from the `env` source appears in any of this ticket's artifacts, evidence files or the two write-back files (compared without printing).

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | execution-log_AP-2459_2026-11-08.md — AP2459_001 step 4 comment and Environment Observations ("Financing company label") | The ticket's Notes complain that "a dealer has no way to know they must set it"; the build now refuses a blank company but the label still carries no "*". No AP-2459 step judges the asterisk, so the PASS stands, but the point is only in the log. | s6 and the s7 outcome comment on AP-2459 should state it as an observation (label not marked required although the server refuses a blank value) so the author can decide whether it needs a ticket; it must not change the result. |
| F-2 | Minor | Jira AP-2512 — step 5 of its Steps | AP-2512's reproduction step 5 says to leave Financing company on "Choose", which this run shows is now refused on Dev, so its steps no longer produce a contract. | Optional, at s5: add a comment on AP-2512 that it still reproduces on 2026-11-08 with PNA-0000000021 (quote 6690, financing company AutoCapital Canada) and that a financing company must now be chosen in step 5. Not a new bug. |

Screenshots inspected:
- qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/AP2459_001-step4-BlankCompanyRefusedWithFieldMessage_pass.png — matches (form re-rendered, "ERROR This value should not be blank." above the red-bordered "Choose" select, "1" badge on Product Summary, owner values kept)
- qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/AP2459_001-step5-NoContractRowForRetest2459_pass.png — matches (7 rows, no "Perma Retest2459")
- qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/AP2459_002-step5-ContractRowFinance2459Listed_pass.png — matches (8 rows, top row "Perma Finance2459", VIN 1FAHP35NX8W239204, 80.00$)
- qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/AP2459_002-step5-Invoice945Finance2459_pass.png — matches (invoice 945, "#PNA-0000000021", "Perma Finance2459", $91.98, Payment pending; the "Created at" date shows Saturday, November 7, 2026, which is the server's local date for 03:08Z on 8 November)
- qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/AP2459_003-step2-FallbackQuoteRefusedBlankCompany_skipped.png — matches (quote for "Perma Pdf2459", same field message)
- qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/Observation-Quote6690PdfDownload500-AP2512_blocked.png — matches (French "Erreur — Désolé…" page)

## R4 — Outcome plan — round 1 — 2026-11-08T03:18:38Z
Reviewed: qa-artifacts/.pipeline/AP-2459.md, qa-artifacts/5-testing-report/AP-2459_test-report.md, qa-artifacts/5-testing-report/AP-2459_bug-report.md, qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2459_2026-11-08.md, qa-artifacts/qa-config/tools.md (QA outcome rules, Pipeline gate rules), .claude/skills/stlc-ticket-pipeline/routing.md (§3 Gate D §3.1–§3.3, §4 bug re-test flow), .claude/skills/stlc-ticket-pipeline/template.md §4.2, qa-artifacts/7-reviews/AP-2459_review.md (R2, R3 sections), the `env` source values (compared without printing)
Verdict: **APPROVE** · Gate D: bug re-test All PASS — post the bug re-test comment on AP-2459, move AP-2459 to Done, no assignee change; post the prepared AP-2512 comment with no status or assignee change — rule §3.2 All PASS
Findings: 0 blocker · 0 major · 1 minor

Independent reviewer pass, artifacts read fresh from disk; no tracker write has happened yet. The pass rate recomputes from the execution log as 2 PASS ÷ (3 total − 1 SKIPPED) = 100%, matching the report, and AP2459_003's SKIPPED rests on its own step 2 rule (accepted at R3), so it is neither FAIL nor BLOCKED and §3.2's "All PASS" row applies: re-test comment, then `bug_pass_status` = Done, with no re-assignment (re-assignment is only on FAIL or BLOCKED, and the plan names no assignee, so check 4.6 is satisfied). There is no FAIL, no bug in the bug report and therefore no stopping bug (4.2, 4.3 hold); the §3.1 story checks do not apply because AP-2459 is a bug, and AP-2459's Jira status "QA" is not re-raised per the QA's decision of 2026-11-08. The planned AP-2459 comment follows template §4.2 and lists all three cases with their status (4.5); its only extra line is the observation that the Financing company label has no "*" although the server now requires it, with no analysis, root cause or product opinion. The prepared AP-2512 comment states only observed facts (still reproduces on 2026-11-08, PNA-0000000021, quote 6690, AutoCapital Canada, the route and HTTP 500 page, and that step 5 must now choose a financing company); it carries no credential and no local path. Check 4.7 does not apply: no bug was filed in this run. None of the `env` source's login or password values appears in the test report, bug report or execution log (11 values compared, 0 hits).

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP-2459_test-report.md — Outcome plan row 1 | The plan does not spell out the template's "Evidence:" line or the one-line "What was checked" text per row, so the updater fills them itself; the test report's Risks section also holds points (cash sales need a company, contract-page vehicle price) that are not part of the planned comment. | When posting, write "Evidence:" with screenshot file names only (no absolute or local filesystem path), keep "What was checked" to the steps in one line, and add nothing from the Risks section beyond the "*" label observation. |

## R5 — Automation specs — round 1 — 2026-11-08T03:53:00Z
Reviewed: qa-artifacts/6-automation/AP-2459_automation-report.md, playwright-automation/src/tests/dealer/permaplateFinancingCompany_AP2459.spec.ts, playwright-automation/src/flows/PermaplateFinancingFlow.ts, playwright-automation/src/pages/dealerPortal/PermaplateFinancingPage.ts, playwright-automation/src/flows/PermaplateContractFlow.ts (reused guard), qa-artifacts/3-test-cases/AP2459_TestCases_001-003.md, qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2459_2026-11-08.md, qa-artifacts/.pipeline/AP-2459.md, `git status` of playwright-automation/
Verdict: **APPROVE** · Gate —: specs accepted as written — no PR yet (vcs not available)
Findings: 0 blocker · 0 major · 2 minor

Independent reviewer pass, files read fresh from disk and the spec re-run by the reviewer on Dev (`.env` BASE_URL is v2dev, matching `execution_env` Dev). Lint (`npx tsc --noEmit`) passes, and the repeat-each=2 run passed 4 of 4 with no flaky test, so the automator's 2/2 passing, 0 fixme claim holds. Both tests trace to cases whose final manual status is PASS (AP2459_003, SKIPPED, is correctly not automated); every [Verification] step has a matching assertion; the page object holds no `expect` or `test.step`; there is no `waitForTimeout`, `test.only`, hard-coded URL or credential (the `env` source's login values were compared against the three code files and every AP-2459 artifact: 0 hits). Workbench check: the 22 pre-existing modified/untracked paths in `git status` all have modification times on or before 2026-11-07 19:48; only the three new AP-2459 files carry 2026-11-08 times, so no existing workbench file was changed. AP2459_001 is read-only on quote 6689 (POST 200, refused both repeats; guard `verifyQuoteHasSelectionWithoutContract()` names the fix if 6689 changes); AP2459_002 makes unique data with `Date.now()`, reads the invoice number from the alert, and only counts the PDF link (AP-2512).

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | PermaplateFinancingFlow.ts — `verifyBlankFinancingCompanyRefused()` (AP2459_001 steps 4–5) | The test asserts branch (b) only, while the manual case's expected result accepts branch (a) or (b) and calls the choice record-only; if the product later accepts a blank company, the test fails although the manual case would pass (and creates one contract on quote 6689). The automation report states this openly. | Optional: keep branch (b) as the asserted behaviour (it is what the build chose and the report documents it), or let the step accept either branch and annotate which one occurred; no change is required for this review. |
| F-2 | Minor | AP-2459_automation-report.md — New locators, row `lblAlerts / lblServerErrorPage` | No match count is recorded for these two locators ("—"). They are filters asserted at 0 or 1 in the flow, and the run proves they resolve, so the gap is documentary. | Optional: record the counts seen (e.g. 1 success alert after generation, 0 error-page bodies). |

Run: `npx playwright test --project=chromium --grep @AP-2459 --repeat-each=2` (after `npm run lint`: pass) — 4 passed, 0 failed, 0 fixme, no flaky tests, 1.2 min. Left on Dev by this review run (cannot be deleted): quote 6700 / PNA-0000000026 / invoice 950 and quote 6701 / PNA-0000000027 / invoice 951 (Payment pending, AutoCapital Canada, vehicle 915). AP2459_001 POST returned HTTP 200 (refused form) in both repeats.
Traceability:
| TC ID | Step | Expected result | Assertion |
|---|---|---|---|
| AP2459_001 | 4 | No HTTP 500 and no "difficultés techniques" error screen | PermaplateFinancingFlow.submitBlankFinancingCompany() — expect(response.status()).toBeLessThan(500); verifyBlankFinancingCompanyRefused() — expect(lblServerErrorPage).toHaveCount(0) |
| AP2459_001 | 4 | Branch (b): same form returned with a message beside "Financing company" | verifyBlankFinancingCompanyRefused() — expect(page).toHaveURL(/permaplate-create-contract$/), expect(lblHeading).toHaveText('Esthetic protection Contract'), expect(alertWithText(CONTRACT_GENERATED)).toHaveCount(0) |
| AP2459_001 | 5 | (b) Field message visible next to "Financing company" | verifyBlankFinancingCompanyRefused() — expect(lblFinancingCompanyError).toHaveText('This value should not be blank.'), .toBeVisible(), expect(selFinancingCompany).toHaveClass(/is-invalid/), expect(lblAllFieldErrors).toHaveCount(1) |
| AP2459_001 | 5 | (b) No contract created — `/permaplate-contracts` has no row for the client | verifyBlankFinancingCompanyRefused() — expect(contractRowFor('Perma Retest2459')).toHaveCount(0), expect(contractListRow('6689')).toHaveCount(0) |
| AP2459_002 | 3 | Saves complete; details shows the Esthetic protection section with option and Cost | PermaplateFinancingFlow.selectPermaplate() — expect(page).toHaveURL(/details/), expect(alertWithText('…quote saved successfully')).toHaveCount(1), expect(rowEstheticProtection).toContainText(option) and toContainText('CA$80.00') |
| AP2459_002 | 4 | No error page, no HTTP 500; success alert that the contract was generated | generateContractWithFinancingCompany() — expect(response.status()).toBeLessThan(500), expect(lblServerErrorPage).toHaveCount(0), expect(alertWithText('Esthetic protection contract generated successfully')).toHaveCount(1) |
| AP2459_002 | 5 | Contract row listed for the client and VIN `1FAHP35NX8W239204` | verifyContractAndInvoiceListed() — expect(contractListRow(quoteId)).toHaveCount(1), toContainText(clientName), toContainText('1FAHP35NX8W239204') |
| AP2459_002 | 5 | A new invoice naming the client exists; invoice and contract numbers recorded | generateContractWithFinancingCompany() — expect(invoiceAlert).toHaveCount(1), expect(invoiceId).not.toBe(''), expect(lnkContractNumber).toHaveText(/PNA-\d+/); verifyContractAndInvoiceListed() — expect(invoiceListRow(invoiceId)).toHaveCount(1), toContainText(contractNumber), toContainText(clientName); annotation "Left on Dev" |
