# QA Review Record — AP-2494

## R1 — Requirements analysis — round 1 — 2026-11-01T00:00:00Z
Reviewed: qa-artifacts/.pipeline/AP-2494.md, requirements/AP-2494-quotes-list-replace-produits-with-contracts.md, qa-artifacts/1-requirements-analysis/AP-2494_requirements-analysis.md
Verdict: **APPROVE** · Gate A: continue, no questions posted — rule A3
Findings: 0 blocker · 0 major · 1 minor

The analysis was re-read from disk and checked against the capture. All nine acceptance
criteria map to a requirement (AC 1 → REQ-001, AC 2–6 → REQ-002, AC 7 → REQ-003, AC 8 →
REQ-004, AC 9 → REQ-005), each quoted word for word, and no requirement adds behaviour the
capture does not contain — the inferred user stories are labelled as inferred. All fifteen
open questions carry an Impact and a Status; none is `Answered`, and none is `Blocking`,
which is correct because every criterion names an observable outcome in the ticket's own
words. It can be trusted as the input to test planning.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP-2494_requirements-analysis.md — Q-015 | Q-015 (the loose wording "a quote with a partial VIN" in AC 9) is classed Info, although the reading chosen decides what the VIN case searches; Judgement would be the safer class. No result changes, because both readings are tested by searching a substring of the full VIN. | None required; test design should search a substring of the quote's VIN and record the result for the full VIN too. |

## R2 — Test cases — round 1 — 2026-11-01T00:00:00Z
Reviewed: qa-artifacts/.pipeline/AP-2494.md, requirements/AP-2494-quotes-list-replace-produits-with-contracts.md, qa-artifacts/1-requirements-analysis/AP-2494_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2494_test-plan.md, qa-artifacts/3-test-cases/AP2494_TestCases_001-005.md, AP2494_TestCases_006-010.md, AP2494_TestCases_011-015.md, AP2494_TestCases_016-018.md, AP2494_ReviewFindings_2026-11-01.md
Verdict: **REWORK** · Gate B: promote Pass 1 #1–#3 and High Pass 2 #1, re-run s3 — rule B1
Findings: 3 blocker · 1 major · 0 minor

The 18 cases were re-read from disk. Every acceptance criterion has a case, every case
cites an existing REQ and AC, files and steps stay within the limits, and test data comes
from the `test-data`, `contract-setup` and `domain` sources or is created in a
`[Pre-Condition]` step. Three steps judge a point that an open Judgement question leaves
unsettled, and one expected result is too vague to judge; these must change before the
cases can be executed. Gate B rule B1 holds: Pass 1 rows #1–#3 cite REQ-003 AC 7, REQ-004
AC 8 and REQ-005 AC 9, and Pass 2 #1 is High.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Blocker | AP2494_TestCases_016-018.md — AP2494_017 step 4 | The step expects the full list with the same first-page rows after the search is cleared; how a search is cleared is Q-009 (Judgement, Open). | Make step 4 record-only: judge only that no error page appears and the page shows quote rows or a stated message; record how the search was cleared and what the list shows, for Q-009. |
| F-2 | Blocker | AP2494_TestCases_016-018.md — AP2494_018 step 2 | The step expects the archived quote to be listed when searching on the Archived tab; whether the search covers that tab is Q-011 (Judgement, Open). | Make step 2 record-only: judge only that no error page appears; record whether the archived quote is listed and which tab is selected, for Q-011. |
| F-3 | Blocker | AP2494_TestCases_016-018.md — AP2494_016 step 2 | The step expects the quote "on page 1, as the newest quote on vehicle 915"; ordering and paging under a search are Q-011 (Judgement, Open). | Judge that the quote is listed in the search results (on any page, paging through if needed); record its page and position for Q-011. |
| F-4 | Major | AP2494_TestCases_011-015.md — AP2494_011 step 3 | "The row's other cells … display normally" is not an observable result. | Name the values: the Client cell shows `Vide Contrat-NNN` and the Vehicle cell shows the 2008 Ford Focus of vehicle 915. |

Promotion for Gate B (not a rework round): Pass 2 #1 — "Searching a client name that
belongs only to another dealership lists none of that dealership's quotes" (Security, High),
which also closes Pass 1 #4.

## R2 — Test cases — round 2 — 2026-11-01T00:00:00Z
Reviewed: qa-artifacts/3-test-cases/AP2494_TestCases_011-015.md, AP2494_TestCases_016-019.md (renamed from 016-018), AP2494_ReviewFindings_2026-11-01.md, qa-artifacts/1-requirements-analysis/AP-2494_requirements-analysis.md
Verdict: **APPROVE** · Gate B: promotion applied (Pass 1 #1–#3 corrected, Pass 2 #1 promoted as AP2494_019); proceed to s4 — rule B1
Findings: 0 blocker · 0 major · 1 minor

Round 1 findings were re-checked on disk. F-1 (AP2494_017 step 4), F-2 (AP2494_018 step
2) and F-3 (AP2494_016 step 2) are now record-only for Q-009 and Q-011, with a Revisions
row each; F-4 (AP2494_011 step 3) now names the Client and Vehicle values. The promoted
case AP2494_019 cites REQ-004 AC 8 and the description's "dealer quote list", has five
steps ending in a `[Verification]`, takes its data from an admin list in a
`[Pre-Condition]` step, and judges only a row that is not on dealer 1380's own list — an
objective fault — leaving the rest of Q-014 record-only. The set of 19 cases is ready for
execution.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-5 | Minor | AP2494_TestCases_016-019.md — Coverage Matrix | AP2494_019 (type Security) is placed under the Negative column, since the matrix has no Security column. | None required; the type row of the case states Security. |

## R2 — Test cases — round 1 — 2026-11-01T01:00:00Z
Independent review (separate reviewer; the inline R2 verdicts above were not reused).
Reviewed: qa-artifacts/.pipeline/AP-2494.md, requirements/AP-2494-quotes-list-replace-produits-with-contracts.md, qa-artifacts/1-requirements-analysis/AP-2494_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2494_test-plan.md, qa-artifacts/3-test-cases/AP2494_TestCases_001-005.md, AP2494_TestCases_006-010.md, AP2494_TestCases_011-015.md, AP2494_TestCases_016-019.md, AP2494_ReviewFindings_2026-11-01.md, qa-artifacts/qa-config/knowledge.md, qa-artifacts/base-test/06-chubb-contract-setup.md, qa-artifacts/base-test/test-centralized.md, qa-artifacts/base-test/execute.env.md, qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/qa-docs/chubb-insurance.md
Verdict: **REWORK** · Gate B: promotion already applied (Pass 1 #1–#3 corrected, Pass 2 #1 promoted as AP2494_019; promotion happens at most once per run) — rework s3 for the named cases, then proceed to s4 — rule B1
Findings: 1 blocker · 2 major · 2 minor

All 19 cases were read from disk. Coverage is complete (every AC 1–9 has a case and every
case cites an existing REQ and AC), the file and step limits hold, IDs AP2494_001–019 have
no gaps, no question is Blocking, and the High Pass 2 proposal was promoted. Most open
Judgement points are correctly record-only. Three things still need fixing before
execution: one step judges paging after a search, which Q-011 leaves open; the
dealer-isolation case cannot tell a leak from a dealer-1380 quote that happens to share
the client and VIN; and two cases build on, and write to, the Chubb register's quote 6276,
which the register forbids test cases to point at.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Blocker | AP2494_TestCases_016-019.md — AP2494_018 step 4 | The step expects that after clearing the search and clicking the first tab, `?page=2` "loads with a different set of rows from page 1". Whether a search persists across tabs and paging is Q-011 ("does it keep paging?") and how a search is cleared is Q-009, both Judgement and Open — the same reason AP2494_017 step 4 was made record-only. If the executor's way of clearing does not drop the filter, page 2 of `Brakwater-NNN` is empty and the case fails on unspecified behaviour. | Make the paging check independent of the search: first record how the search was cleared and what the list shows (for Q-009/Q-011), then open `/quotes?_locale=en&page=2` in a fresh navigation with the search box confirmed empty, and judge only that page 2 loads with no error page and with rows different from page 1. If the box still holds a term or the list is still filtered after clearing, record it for Q-009/Q-011 instead of judging page 2. |
| F-2 | Major | AP2494_TestCases_016-019.md — AP2494_019 steps 1 and 5 | Step 1 takes any admin Permaplate row whose Dealer is not dealer 1380, and step 5 fails if a dealer-1380 search lists "the other dealership's client together with the recorded VIN". Test VINs are shared on staging (vehicle 915's VIN `1FAHP35NX8W239204` sits on many dealer-1380 quotes, e.g. 6276 "Marie Tremblay"), so a dealer-1380 quote can legitimately carry the same client name and VIN, and the case would record a privacy FAIL that is not one. The expected result cannot distinguish a leak from the dealer's own quote. | In step 1, pick a row whose VIN is not `1FAHP35NX8W239204` and whose client last name and VIN appear on no dealer-1380 ("Offical VinhLe870@gmail.com") row of `/admin/permaplate-contracts`; record that check. In step 5, judge a leak only for a listed row whose client and VIN both match the recorded values; for any such row, record its quote id and open `/quote/{id}/details` to show whose quote it is before calling it a FAIL. |
| F-3 | Major | AP2494_TestCases_006-010.md — AP2494_008 steps 1–2 and AP2494_010 steps 1–2 (also AP2494_006 step 1, Execution Context "Test data") | Both cases take quote 6276 / contract `AVP000160` from the `contract-setup` register, which states "No test case may satisfy a data prerequisite by pointing here", with no fallback if 6276 has changed, and both write to it (AP2494_008 generates a roadside contract, AP2494_010 saves a sales contract). The register assigns 6276 to AP-2437 cases (AP2437_001–005, 006, 011, 012), so these writes change data another ticket's tests read. AP2494_006 has a fallback but still names 6276 as its first choice. | In AP2494_006, AP2494_008 and AP2494_010 step 1, select the quote from the domain-mapped list `/creditor-insurance-contracts` (newest row whose quote is not 6276, quote id from the Download link `/quote/{quoteId}/chubb/insurance/contract-pdf`) and record its id and contract number; have AP2494_008 and AP2494_010 reuse the quote AP2494_006 recorded; remove 6276 / `AVP000160` as fixed values from the Test Data tables and the Execution Context. |
| F-4 | Minor | AP2494_TestCases_011-015.md — AP2494_013 step 3 | "Every listed quote has `phyrine` (any case) in its name or another searched field" cannot be read from the list, which shows no quote name column (quote-creation.md, 2026-10-12). | State how to check it: for each listed row other than quote {id}, open `/quote/{id}/details` and record the field that holds the term. |
| F-5 | Minor | AP2494_TestCases_001-005.md — Execution Context "Entry route" | It says rows "are not clickable under automation"; the `contract-setup` source records that note as out of date (corrected 2026-09-03). No result changes, because every case opens a quote by URL. | None required; drop the stale clause on the next edit. |

## R2 — Test cases — round 2 — 2026-11-01T02:00:00Z
Independent review of the rework (separate reviewer; earlier verdicts were not reused).
Reviewed: qa-artifacts/.pipeline/AP-2494.md, qa-artifacts/7-reviews/AP-2494_review.md (round-1 independent findings), qa-artifacts/3-test-cases/AP2494_TestCases_001-005.md, AP2494_TestCases_006-010.md, AP2494_TestCases_011-015.md, AP2494_TestCases_016-019.md, qa-artifacts/qa-config/knowledge.md, qa-artifacts/base-test/06-chubb-contract-setup.md, qa-artifacts/qa-docs/chubb-insurance.md, qa-artifacts/qa-docs/quote-creation.md
Verdict: **REWORK** · Gate B: promotion already applied (Pass 1 #1–#3 corrected, Pass 2 #1 promoted as AP2494_019) — rework s3 for AP2494_006 (and the fallbacks in AP2494_008 and AP2494_010 that reuse its steps), then proceed to s4 — rule B1
Findings: 0 blocker · 1 major · 0 minor

All five round-1 findings are fixed on disk. AP2494_018 step 4 now judges only "no error
page" and records clearing, tab and page 2 for Q-009/Q-011 (F-1). AP2494_019 picks another
dealership's row off VIN `1FAHP35NX8W239204` with no shared client-and-VIN pair, records its
contract number, and step 5 judges a leak on that contract number or a refused details page,
so a dealer-1380 quote on a shared VIN is no longer misread (F-2). No case reads or writes
quote 6276 or `AVP000160` any more: AP2494_006 creates its own creditor contract in its
`[Pre-Condition]` steps, which is exactly what the `contract-setup` registry row requires,
and AP2494_008 and AP2494_010 reuse that quote with a fallback (F-3). AP2494_013 step 3 now
checks each other row on `/quote/{id}/details` (F-4), and the stale "not clickable" clause is
gone (F-5). One problem remains in the new AP2494_006 flow: it depends on two links that the
newer `domain` mapping says are not shown, so the case can be marked BLOCKED for a reason that
is not real, and AP2494_008 and AP2494_010 would be blocked with it.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Major | AP2494_TestCases_006-010.md — AP2494_006 steps 2–3 (also reached through the AP2494_008 step 1 and AP2494_010 step 1 fallbacks) | Step 2 expects "**Add creditors insurance** is now shown" and step 3 says to click **Add creditors insurance** and then **Generate Contract** in the Creditors insurance panel. Those links come from `contract-setup` (verified 2026-09-04); the newer `domain` mapping (chubb-insurance.md §5, mapped 2026-10-03) says the insurance screen has "no visible link when the Creditors insurance row has nothing yet — navigate by URL" and that the "Generate Contract" link "was not found on this page … reach it directly". An executor following the steps can fail a precondition on a missing link and record AP2494_006 — and with it AP2494_008 and possibly AP2494_010 — BLOCKED for no real reason. Step 3 also says only "if either step shows an error", while chubb-insurance.md §5 warns that the Create Contract failure is an `alert`-role banner starting "HTTP/2 400" that a search for "error" misses. | In step 2, judge only the "Financing saved" flash and the Financing panel; record whether **Add creditors insurance** is shown, without expecting it. In step 3, open `/quote/{id}/insurance` (by the link if shown, else by URL), and after the "Chubb insurance quote saved successfully" flash open `/quote/{id}/insurance/create-contract` (by the **Generate Contract** link if shown, else by URL) → **Create Contract**; state that a failure is detected by an `alert`-role banner or the text "HTTP" and that its full text is recorded with the BLOCKED result. |

## R2 — Test cases — round 3 — 2026-11-01T01:45:39Z
Independent review of the round-2 rework, final round (separate reviewer; earlier verdicts were not reused — all 19 cases were judged again).
Reviewed: qa-artifacts/.pipeline/AP-2494.md, qa-artifacts/7-reviews/AP-2494_review.md, requirements/AP-2494-quotes-list-replace-produits-with-contracts.md, qa-artifacts/1-requirements-analysis/AP-2494_requirements-analysis.md, qa-artifacts/3-test-cases/AP2494_TestCases_001-005.md, AP2494_TestCases_006-010.md, AP2494_TestCases_011-015.md, AP2494_TestCases_016-019.md, AP2494_ReviewFindings_2026-11-01.md, qa-artifacts/qa-config/knowledge.md, qa-artifacts/qa-docs/chubb-insurance.md (§5), qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/base-test/test-centralized.md, qa-artifacts/base-test/06-chubb-contract-setup.md, qa-artifacts/base-test/navigation-map.md, .claude/skills/stlc-ticket-pipeline/routing.md (Gate B)
Verdict: **APPROVE** · Gate B: promotion already applied (Pass 1 #1–#3 corrected, Pass 2 #1 promoted as AP2494_019; promotion happens at most once per run) — proceed to s4 — rule B1
Findings: 0 blocker · 0 major · 3 minor

The round-2 finding is fixed on disk. AP2494_006 step 2 now judges only the "Financing
saved" flash and the Financing panel and merely records whether **Add creditors insurance**
is shown; step 3 opens `/quote/{id}/insurance` and `/quote/{id}/insurance/create-contract`
by link if shown, otherwise by URL (both routes confirmed in chubb-insurance.md §5 and
quote-creation.md), and detects a failure by an `alert`-role banner or the text "HTTP"
with the full banner text recorded. The AP2494_008 and AP2494_010 step-1 fallbacks point
at the reworked steps and say a missing link is not a reason to block, and Known blocker 3
matches. Re-checking all 19 cases: every AC 1–9 has a case and every case cites an existing
REQ, files hold 5/5/5/4 cases with at most 5 steps, IDs AP2494_001–019 have no gaps, no
question is Blocking, every Judgement point (Q-001–Q-012, Q-014) is record-only except where
a case judges only an objective fault, no case reads or writes another ticket's quote, and
every route used is in the `domain` / `navigation` sources. The set can be trusted for
execution; the three points below are wording only and change no result.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2494_TestCases_016-019.md — AP2494_016 step 3 | Step 3 expects quote {id} "listed in the results" and "every listed row's vehicle" on the full-VIN search, but unlike step 2 it does not say to page through; vehicle 915 carries many quotes and ordering under a search is Q-011, so an executor reading only page 1 could misjudge it. | On the next edit, add "page through the results as in step 2" to step 3 and record the page on which quote {id} appears. |
| F-2 | Minor | AP2494_TestCases_006-010.md — AP2494_009 step 2 | The admin row is found by "the same client and vehicle" only; the admin list has a Dealer column and test VINs are shared across dealerships on staging. Dealer 1380's three Permaplate rows have distinct client names today (e.g. "Perma Testclient", "Perma Retest0913"), so the pairing is unambiguous now. | On the next edit, also require Dealer = "Offical VinhLe870@gmail.com" in step 2 and record BLOCKED if more than one admin row matches. |
| F-3 | Minor | AP2494_TestCases_006-010.md — Execution Context, Known blocker 3 | It says the Create Contract failure banner "contains neither 'error' nor 'success'", but the quoted banner contains `"success":false`. Detection is by `alert` role or "HTTP", so no result changes. | On the next edit, say the banner contains no "error" and no success flash text, rather than no "success". |

## R3 — Execution results — round 1 — 2026-11-01T21:01:29Z
Reviewed: qa-artifacts/.pipeline/AP-2494.md, requirements/AP-2494-quotes-list-replace-produits-with-contracts.md, qa-artifacts/1-requirements-analysis/AP-2494_requirements-analysis.md (Open Questions), qa-artifacts/3-test-cases/AP2494_TestCases_006-010.md, qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md, 10 screenshots under qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/, qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/base-test/06-chubb-contract-setup.md, qa-artifacts/base-test/test-centralized.md, qa-artifacts/base-test/navigation-map.md, playwright-automation/src/pages/dealerPortal/QuoteDetailPage.ts, Jira AP-2508 and six duplicate searches
Verdict: **REWORK** · Gate C: AP2494_010 file new — rule C4; roadside HTTP 500 (blocks AP2494_005, 008, 012) file new, linked *relates to* AP-2508 — rule C3 → reviewer rule E2
Findings: 1 blocker · 1 major · 4 minor

The log is complete and its counts are right: 19 cases, 14 PASS, 1 FAIL, 4 BLOCKED, 74 % (14 of 19), every screenshot path exists, and every PASS step states an observed value. The AP2494_010 FAIL is a real FAIL on the plain words of AC 4. The sale page has no generate or finalize step, so a saved sale is as "generated" as a sale gets, and no capture sentence or comment says a saved sale is meant to stay off the list. But the run holds no image of the sale it says exists, and the AP2494_016 screenshot cannot be told apart from the unfiltered list. Re-capture those two pieces of evidence (both read-only on Dev) before the bugs are filed.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Blocker | execution-log_AP-2494_2026-11-02.md — AP2494_016 step 4; screenshot AP2494_016-step4-LowercaseVinSearch_pass.png | The step claims a lower-case VIN search returned 43 rows over 5 pages with quote 6483 first. The image shows only the top of the Active tab: no search keyword, no row count and no pagination. Page 1 of the unfiltered list (6483, 6482, 6481, 6480, 6479, then AP-2493 quotes, all on VIN 1FAHP35NX8W239204) looks exactly the same, so the image does not prove a search was applied (checklist 3.5). | Re-run AP2494_016 step 4 only (read-only search `1fahp35nx8w239204` on v2dev). Save a full-page screenshot that shows the pagination with 5 pages (the unfiltered list has 57), and record the URL `/quotes?quote_search[keyword]=1fahp35nx8w239204` in the Actual Result. |
| F-2 | Major | execution-log_AP-2494_2026-11-02.md — AP2494_010 steps 2 and 4 | The FAIL rests on the sale `AP2494-S-957` existing on quote 6480, and the comment compares it with archived quotes 6040 and 6041. No image shows the sale on `/quote/6480/details`, and none shows the 6040/6041 cells. The only image is the list row, which proves the cell but not that a sale was there to show, so the bug s5 files would carry no proof of its precondition. | Re-run AP2494_010 step 2 as a read-only check (do not save the sale again). Screenshot the Sale section of `/quote/6480/details` showing "#AP2494-S-957", and screenshot the `/quotes/archived` rows of 6040 and 6041 with their Contracts cells. Also record whether 6040 and 6041 carry a finalized warranty, since both list a warranty number next to the sale (see F-5). Add the paths to the log. |
| F-3 | Minor | execution-log — AP2494_005, 007, 008 screenshots | The images of the three BLOCKED cases end in `_fail` (`AP2494_005-step2-RoadsideGenerateContractHttp500_fail.png`, `AP2494_005-step2-RoadsideModalStuckLoading_fail.png`, `AP2494_007-step1-GapContractListEmpty_fail.png`, `AP2494_008-step2-RoadsideGenerateContractHttp500_fail.png`), so a reader scanning the folder counts four failures that are not failures. No result changes. | On the next execution of these cases, name blocked evidence with a `_blocked` suffix. |
| F-4 | Minor | execution-log — AP2494_005, 008, 012 BLOCKED reasons; Gate C | The block is correct under checklist 3.7: HTTP 500 at `/quote/{id}/road-side-protection-create-contract` is a precondition failure before the step under test, tried 3 times on 6479 and once on 6480. But the reason names a fault, not a bug, and the fault is a reproducible product defect, not an outage. AP-2508 (Backlog) covers the same page family but a different behaviour: it says the page has **no** Generate Contract button and "No error message and no HTTP 500 appear". This run reached the contract route from the row's ⋯ menu and by URL and got HTTP 500. That is a partial match (rule C3), so reviewer rule E2 applies. | At s5, file a **new** bug for the HTTP 500 (and the ⋯ modal stuck on "Loading..."), linked *relates to* AP-2508, with one line naming AP-2508 and the difference. Note that both quotes were on vehicle 915, whose page warns "There's already a contract created for the same VIN. Contract #2697, 2698". Name the new bug in the BLOCKED reason of AP2494_005, 008 and 012. Do not comment on AP-2508. |
| F-5 | Minor | qa-artifacts/qa-docs/quote-creation.md — "Sales contract on Dev" bullet (line ~106) | The bullet says "No separate generate/finalize step" without saying where. That is true of the sales page and of the details page of quote 6480, which has no warranty. But the automation page objects (`QuoteDetailPage.btnFinalizeSale`, `WarrantyDetailsPage.lnkFinalizeSale`, `a[href*=finalize]`) show a finalize action on quotes with a warranty, and both quotes whose sale does show in the list (6040, 6041) also carry a warranty contract. Left unscoped, the line could mislead the AP2494_010 bug and later designers. Otherwise the four write-backs (quote-creation.md, 06-chubb-contract-setup.md, test-centralized.md, navigation-map.md) only add dated Dev entries and keep the staging facts. The files are untracked, so this was checked by content, not by diff. | When F-2 is re-run, change the bullet to "no generate/finalize step on the sales page or on the details page of a quote without a warranty (6480)", and add what F-2 finds for 6040/6041. |
| F-6 | Minor | AP2494_019 screenshot | The image shows "No entities found" but not which of the two searches (`Nguyen` or the VIN) it belongs to. It still supports the claim, because the unfiltered list is never empty. | On the next run, include the URL or the search term in the evidence. |

Gate C (own duplicate search, `type = Bug AND statusCategory != Done`, text ~ "roadside contract", "road-side-protection-create-contract", "Generate Contract 500", "sale contract number quote list", "Contracts column", "sales contract"):
- **AP2494_010 → File new (C4).** C1 is not met. The capture's description says the column "lists the quote's finalized contract", but no sentence states that a saved sale stays off the list, and the ticket has 0 comments. Candidates AP-2508, AP-2488, AP-2459, AP-2512, AP-2515 and AP-2461 concern the roadside page, warranty tax labels and Permaplate contracts, PDFs and invoices; none names the `/quotes` Contracts cell or sales contracts. The new bug must ask the author Q-003 directly: "Does a sale contract number appear only once a warranty is finalized or the quote is archived (as on 6040/6041), or as soon as the sale is saved?"
- **Roadside HTTP 500 (blocks 005, 008, 012) → File new, linked *relates to* AP-2508 (C3 → reviewer rule E2)**, see F-4. AP-2459 (HTTP 500 on Permaplate generation with no financing company) is a different screen.

Answers to the caller's points: (1) 010 is a FAIL, not a PARK. The rules route the unanswered "generated vs finalized" question through the bug ticket (routing §3 Gate C: "the bug ticket asks the question for you"), and the AC words are concrete. Its evidence is incomplete (F-2). (2) The 500 is a legitimate BLOCK for this ticket's cases and a product defect to file as a new bug linked to AP-2508, not folded into it (F-4). (3) Minor (F-3). (4) See Gate C above. (5) Add/refresh only, with one wording fix (F-5).

Screenshots inspected: AP2494_010-step4-SalesContractMissingInCell_fail.png — matches (Credito Chubbline-957 row, Contracts "AVP000170" only); AP2494_005-step2-RoadsideGenerateContractHttp500_fail.png — matches (French "Erreur … difficultés techniques" page; URL not in frame); AP2494_008-step2-RoadsideGenerateContractHttp500_fail.png — matches (same page); AP2494_001-step3-ActiveTabContractsHeader_pass.png — matches (Vehicle · Client · Contracts · Date Created); AP2494_004-step4-WarrantyContractInCell_pass.png — matches (Marie Tremblay row outlined, "26df1-844"); AP2494_006-step5-CreditorContractInCell_pass.png — matches ("AVP000170"); AP2494_009-step4-PermaplateNumberInCell_pass.png — matches ("PNA-0000000019"); AP2494_011-step3-BlankContractsCell_pass.png — matches (Vide Contrat-958, empty cell); AP2494_016-step4-LowercaseVinSearch_pass.png — does not match (F-1); AP2494_019-step5-OtherDealerVinNoResult_pass.png — matches, search term not shown (F-6). Not inspected because of the 10-image cap: AP2494_014 (High PASS), the Medium and Low PASS images, and AP2494_007.

Browser re-check: not done. v2dev opened and redirected to `/login`, and reading the Dev credential was denied, so this review was judged from disk. The tab was closed and no data was changed.

## R3 — Execution results — round 2 — 2026-11-01T21:10:47Z
Reviewed: qa-artifacts/7-reviews/AP-2494_review.md (R3 round 1), qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md (Execution Summary, AP2494_010, AP2494_016, "Evidence re-capture — R3 round 1"), 9 of the 10 new screenshots under qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/
Verdict: **APPROVE** · Gate C: AP2494_010 file new — rule C4; roadside HTTP 500 (blocks AP2494_005, 008, 012) file new, linked *relates to* AP-2508 — rule C3 → reviewer rule E2
Findings: 0 blocker · 0 major · 1 minor

This round judged only the evidence re-captured for round-1 F-1 and F-2. Both are closed: the AP2494_016 images now prove a lower-case VIN search was applied (4 numbered pages plus Last on page 1, a 3-row page 5 with no Next, and the term `1fahp35nx8w239204` in the dialog), and the AP2494_010 images prove the sale `#AP2494-S-957` exists on quote 6480 while its Contracts cell holds only "AVP000170". All 10 new paths exist on disk, the re-capture was read-only, and the counts are unchanged (19 cases: 14 PASS, 1 FAIL, 4 BLOCKED, 74 %). The results can be trusted and handed to s5.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | execution-log — AP2494_010 step 4 re-capture; screenshots AP2494_010-step4-Warranty671PendingApprovalRow_fail.png and AP2494_010-step4-Warranty663CancelledRow_fail.png | The log says APOP01-671 is in "Pending approval" and APOP01-663 is "Cancelled … Warranty created in error", but both images are row crops: they show the client, contract number, invoice and credit memo, not the tab name, the status or the cancel reason. The statuses only add context to the bug and do not decide the FAIL, so nothing is blocked. | When s5 files the AP2494_010 bug, either quote these statuses as "seen in the log" or attach a frame that includes the `/warranty` tab heading (Pending approval / Cancelled). Round-1 F-5 (scope the "no generate/finalize step" bullet in quote-creation.md) still stands and now has its input: 6040 and 6041 both carry a generated warranty, 6480 has none. |

Gate C (confirmed from round 1; the new evidence changes neither decision):
- **AP2494_010 → File new (C4).** The precondition is now proven, and the archived rows show the list does display sale numbers on some quotes (6041 "APOP01-663 · ContractNumber_12345", 6040 "APOP01-671 · 11111"), both of which carry a generated warranty and are archived, while active 6480 (no warranty) does not. No capture sentence or ticket comment settles whether that is intended, so the bug carries Q-003 to the author: "Does a sale contract number appear only once a warranty exists or the quote is archived (as on 6040/6041), or as soon as the sale is saved?"
- **Roadside HTTP 500 → File new, linked *relates to* AP-2508 (C3 → reviewer rule E2)**, name the new bug in the BLOCKED reasons of AP2494_005, 008 and 012 (round-1 F-4).

Screenshots inspected: AP2494_016-step4-LowercaseVinSearchPage1of5FullPage_pass.png — matches (10 rows on VIN 1FAHP35NX8W239204, first row Ysolde Brakwater-960 = quote 6483, pagination 1 2 3 4 Next Last); AP2494_016-step4-LowercaseVinSearchPage5of5FullPage_pass.png — matches (3 rows, all on the same VIN, page 5 active, no Next); AP2494_016-step4-LowercaseVinSearchTermInDialog_pass.png — matches (dialog box holds `1fahp35nx8w239204`); AP2494_010-step2-Quote6480SaleSectionAP2494-S-957_fail.png — matches (#6480 Sale "#AP2494-S-957 · Sales rep: QA Agent · Edit sale"; Extended warranty "- None Selected -"; Creditors insurance AVP000170); AP2494_010-step4-Archived6040And6041ContractsCells_fail.png — matches (Archived tab: "APOP01-663 / ContractNumber_12345" and "APOP01-671 / 11111"); AP2494_010-step4-Quote6040DetailsSaleAndWarranty_fail.png — matches (Sale "#11111", Extended warranty APOP01-671); AP2494_010-step4-Quote6041DetailsSaleAndWarranty_fail.png — matches (Sale "#ContractNumber_12345", Extended warranty APOP01-663); AP2494_010-step4-Warranty671PendingApprovalRow_fail.png and AP2494_010-step4-Warranty663CancelledRow_fail.png — match the contract, invoice and credit-memo details, but do not show the status (F-1). Not opened: AP2494_010-step4-Warranty671ContractOf6040_fail.png (context only).

Browser re-check: not done, by the caller's instruction. Judged from disk.

## R4 — Outcome plan — round 1 — 2026-11-01T21:18:20Z
Reviewed: qa-artifacts/.pipeline/AP-2494.md, qa-artifacts/qa-config/tools.md (QA outcome rules), qa-artifacts/1-requirements-analysis/AP-2494_requirements-analysis.md (Open Questions), qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md (Result Overview, Blocked table, "Bugs filed at s5"), qa-artifacts/5-testing-report/AP-2494_bug-report.md, qa-artifacts/5-testing-report/AP-2494_test-report.md, qa-artifacts/4-execution-results/comment_AP-2494_2026-11-02.md (planned story comment), Jira AP-2494, AP-2517, AP-2518 (read back)
Verdict: **APPROVE** · Gate D: post the story result comment on AP-2494; do not move it (stays QC, assignee unchanged); no bug-ticket action — rule D (§3.1, §3.2)
Findings: 0 blocker · 0 major · 0 minor

Reviewed inline, inside the AP-2494 worker, under the fresh-eyes rule (every figure re-read from disk; the Result Overview was re-parsed by script and compared with the planned comment table: 19 rows, identical TC IDs, priorities and statuses). The plan follows the rules: the pass rate is under the threshold and a stopping bug is open, so the story must not move, and neither new bug is in a QA status, so neither gets a re-test action. It can be applied as planned.

| # | Check | Result |
|---|---|---|
| 4.1 | Pass rate recomputed | 14 PASS ÷ (19 − 0 SKIPPED) = 73.7 % → 74 %; equals the test report, bug report and comment |
| 4.2 | Every FAIL has a bug | AP2494_010 (the only FAIL) → AP-2517 (filed, Relates → AP-2494, Ken Nguyen) |
| 4.3 | Stopping bugs | AP-2518 is stopping on both counts: it made AP2494_005, _008 and _012 BLOCKED, and it is High. AP-2517 is not: Medium, and it fails AP2494_010 at step 4 of 4 (the last step), blocking no other case |
| 4.4 | Status move vs the three checks | Pass rate 74 % < 90 % ✗; stopping bug AP-2518 open ✗; Blocking questions open: 0 ✓ → no move to Ready for release, no assignee change. Comment's last line names both failed checks |
| 4.5 | Comment lists every case | 19 of 19 rows with status and bug; AP2494_007's reason "test data not on dev: no GAP contract" stated; 15 open questions listed with Dev behaviour; "Tested on: Dev (v2dev)" present |
| 4.6 | Re-assign target not in `not_developers` | Not applicable — no bug in `{KEY}_bug-report.md` is in the QA status (AP-2517 and AP-2518 are Backlog), so no re-assignment is planned |

## R5 — Automation specs — round 1 — 2026-11-01T21:40:26Z
Reviewed: qa-artifacts/6-automation/AP-2494_automation-report.md, playwright-automation/src/tests/dealer/quoteListContractsSearch_AP2494.spec.ts, playwright-automation/src/flows/QuoteListFlow.ts, playwright-automation/src/pages/dealerPortal/QuoteListPage.ts, qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md, qa-artifacts/3-test-cases/AP2494_TestCases_*.md
Verdict: **APPROVE** · Gate —: specs accepted — rule R5
Findings: 0 blocker · 0 major · 2 minor

Reviewed inline inside the AP-2494 worker under the fresh-eyes rule, after the spec's inline assertions were moved into QuoteListFlow (5.5). The 14 tests map one-to-one to the 14 manual PASS cases, all three files are new (no existing method changed, 5.6), the spec is read-only and generates no contract, and it passed twice in a row on Dev. It can be trusted as a regression check for the Contracts column and the search, on Dev only.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | spec — AP2494_009 and AP2494_019 | The admin-portal steps (009 step 2 cross-check of PNA-0000000019; 019 step 1 lookup of PNA-0000000016) are not repeated; the numbers recorded by the manual run are used as constants. | Accept; if the admin numbers change on Dev, update `LEFT_ON_DEV` from `/admin/permaplate-contracts`. |
| F-2 | Minor | spec — `LEFT_ON_DEV` | The tests depend on Dev quotes left by the manual runs (6245, 6454, 6460, 6480–6483). Checklist 5.7 (unique data per run) does not apply because nothing is created, but archiving or editing those quotes breaks the tests with a clear message. | None now; note it for Dev clean-ups. |

Run: `npm run lint` — pass; `npx playwright test --project=chromium --grep @AP-2494 --repeat-each=2` — 28 passed, 0 failed, 0 fixme, no flaky tests (4.4 min).
Checks: 5.2 every title starts with a PASS TC ID, describe carries `@AP-2494` · 5.4 no `waitForTimeout`, no `test.only`, credentials via `DealerFlow.loginToDealerPortal()` → `getCredentials` · 5.5 page object has no `expect`/`test.step`; spec calls flow methods only · 5.8 no fixme · 5.9 every new locator has a count recorded.
Traceability:
| TC ID | Step | Expected result | Assertion |
|---|---|---|---|
| AP2494_001 | 3 | Headers Vehicle · Client · Contracts · Date Created, no "Produits" | QuoteListFlow.verifyHeaders() — expect(headers).toEqual(EN) / not.toContain('Produits') |
| AP2494_002 | 3 | Same headers on Archived | verifyTabSelected('Archived') — toHaveClass(/active/); verifyHeaders() |
| AP2494_003 | 3, 5 | French "Contrats", no "Produits"; English restored | verifyHeaders(FR) on both tabs; switchLanguage('en') — heading toHaveText('Quotes'); verifyHeaders(EN) |
| AP2494_004 | 4 | Cell shows "26df1-844", no null/undefined | verifyContractsCell() — li toHaveText(['26df1-844']); verifyCellClean() |
| AP2494_006 | 5 | Cell identifies AVP000170 | verifyContractsCellContains() — expect(entries).toContain('AVP000170') |
| AP2494_009 | 4 | Cell shows PNA-0000000019 exactly | verifyContractsCell() — li toHaveText(['PNA-0000000019']) |
| AP2494_011 | 3 | Blank cell, no placeholder | verifyContractsCellBlank() — li toHaveCount(0); text toBe('') |
| AP2494_013 | 3 | Quote 6482 listed; every row contains "phyrine" | verifyQuoteListed() — row toHaveCount(1); verifyEveryRowContains() |
| AP2494_014 | 5 | 6483 listed for the full name; every row's client matches | verifyQuoteListed(); verifyEveryRowContains('Ysolde Brakwater-960') |
| AP2494_015 | 4 | Every search lists 6483 with no error | search() — no error text; verifyQuoteListed('6483') |
| AP2494_016 | 4 | Every row on vehicle 915; lower-case search returns the list | verifyEveryRowOnEveryPageContains('VIN: 1FAHP35NX8W239204'); verifyFewerPagesThan() |
| AP2494_017 | 4 | Clearing restores the full list, no error | verifyFullListBack(unfilteredPages) — rows toHaveCount(10), same last page |
| AP2494_018 | 4 | No error; clearing, tab and page 2 behave as recorded | verifyFullListBack(); clickTab('Active') toHaveURL; verifyPage2DiffersFromPage1() |
| AP2494_019 | 5 | No row is the other dealership's contract | verifyNoRowMentions('PNA-0000000016'); verifyNoEntities() |
