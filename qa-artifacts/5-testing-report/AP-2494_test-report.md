# Test Execution Report

**Report ID:** TR-20261102-002
**Project:** Avantage Plus v2 — Dealer portal, AP-2494: Quotes list — replace "Produits" with "Contracts" and add quote search
**Test Cycle:** AP-2494 single-ticket STLC run, run folder no-sprint (the ticket has no sprint and no fix version)
**Application version:** Not known — the Dev build does not show a version number. The AP-2494 pull request (merged 2026-10-22) was confirmed present on Dev before testing: `/quotes` shows the headers Vehicle · Client · Contracts · Date Created and a search button beside "Create a quote".
**Date:** 2026-11-02
**Prepared by:** QA Agent — Test Reporter Skill

**Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca`, by the user's decision. Staging was not opened in this run.

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** 14 of 19 test cases passed, a pass rate of 74 %, which is under the 90 % pass-rate threshold the test plan sets for this story. One case failed (a saved sale contract number is missing from the Contracts column — bug AP-2517, Medium) and four could not be run: three because Dev returns an error page when a roadside contract is generated (bug AP-2518, High, still open) and one because Dev has no GAP insurance contract to look at.

---

## Executive Summary

The QA agent tested the two changes AP-2494 makes to the dealer's quote list: the old "Produits" column is replaced by a "Contracts" column that lists each contract made for the quote, and a new search finds quotes by quote name, client first name, last name, email or vehicle VIN. Nineteen test cases cover all nine acceptance criteria. **The search works:** every kind of search found the right quotes, partial and lower-case terms work, a term that matches nothing shows "No entities found" with no error, and a dealer never sees another dealership's quotes. **The new column is in place on both tabs and in French** ("Contrats"), and it correctly shows the extended-warranty, creditor-insurance and Permaplate contract numbers and stays blank when a quote has no contract. Two problems remain. First, a sale contract saved on a quote does not appear in the column, although the acceptance criteria say it should; on two older archived quotes it does appear, so the product owner is asked when a sale number is meant to show (bug AP-2517). Second, Dev fails with a technical-error page whenever a roadside contract is generated (bug AP-2518), so the roadside contract, a quote with two contracts, and a product saved without a contract could not be checked, and GAP could not be checked because no GAP contract exists on Dev. Because only 74 % of the cases passed, against the 90 % the story needs, AP-2494 stays in QC.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 5 of 5 (REQ-002 only in part — 4 of its 9 cases could not run) |
| Total test cases | 19 |
| Passed | 14 (74%) |
| Failed | 1 (5%) |
| Blocked | 4 (21%) |
| Skipped | 0 |
| **Pass rate** | **74%** (14 of 19) |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

The pass rate is the share of test cases that passed, counted over every case that was not skipped (14 ÷ 19 = 73.7 %, rounded to 74 %). A blocked case — one that could not be run because something it depends on failed first — counts as not passed. Defect density — bugs found per test case — is 2 ÷ 19 = 0.11.

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 1 | 0 | 1 |
| Medium | 1 | 0 | 1 |
| Low | 0 | 0 | 0 |
| **Total** | **2** | **0** | **2** |

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 73% (8 of 11 run to a result; AP2494_005, _008, _012 BLOCKED by AP-2518) | ❌ |
| Pass rate | ≥ 90% | 74% (14 of 19) | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 0 | 1 (AP-2518) | ❌ |
| Test report generated | Yes | Yes | ✅ |
| All tracker tickets created | Yes | Yes — AP-2517, AP-2518 | ✅ |
| Every FAIL filed, linked or dismissed | Yes | Yes — AP2494_010 filed as AP-2517 | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — "Produits" replaced by "Contracts" on both tabs (AC 1) | 3 (AP2494_001–003) | 3 | 0 | 0 | 100% |
| REQ-002 — Contracts column lists each generated contract (AC 2–6) | 9 (AP2494_004–012) | 4 | 1 | 4 | 56% |
| REQ-003 — Search by partial, case-insensitive quote name (AC 7) | 1 (AP2494_013) | 1 | 0 | 0 | 100% |
| REQ-004 — Search by client first name, last name, email or full name (AC 8) | 3 (AP2494_014, _015, _019) | 3 | 0 | 0 | 100% |
| REQ-005 — Search by partial VIN (AC 9) | 1 (AP2494_016) | 1 | 0 | 0 | 100% |
| Search, shared — no-match and clearing; tab scope and paging (AC 7–9) | 2 (AP2494_017, _018) | 2 | 0 | 0 | 100% |
| **Total** | **19** | **14** | **1** | **4** | **79%** |

Coverage here means the share of cases run to a result (pass or fail). REQ-002 is the weak spot: the roadside (AC 3), GAP (AC 3), two-contract (AC 3/6) and product-without-contract (AC 6) checks were not run.

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | A saved sale contract number does not appear in the Contracts column of the quote list | Medium | P2 | REQ-002 (AC 4) | [AP-2517](https://garantieavantageplus.atlassian.net/browse/AP-2517) | Open |
| BUG-002 | Opening the roadside "Generate Contract" page of a quote returns an HTTP 500 error page | High | P2 | REQ-002 (blocks AC 3, AC 6 checks) | [AP-2518](https://garantieavantageplus.atlassian.net/browse/AP-2518) | Open |

AP-2517 covers AP2494_010 and asks the product owner Q-003: should a sale number appear as soon as the sale is saved, or only once the quote has a warranty contract or is archived? AP-2518 is not caused by AP-2494 but blocks three of its cases (AP2494_005, _008, _012); it relates to AP-2508 (same roadside pages, different behaviour). Both quotes it was seen on were on vehicle 915, whose roadside page warns "There's already a contract created for the same VIN. Contract #2697, 2698" — a possible cause, not confirmed.

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2494-quotes-list-replace-produits-with-contracts.md` | 2026-11-01 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2494_requirements-analysis.md` | 2026-11-01 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2494_test-plan.md` | 2026-11-01 |
| Test Cases | `qa-artifacts/3-test-cases/AP2494_TestCases_001-005.md`, `AP2494_TestCases_006-010.md`, `AP2494_TestCases_011-015.md`, `AP2494_TestCases_016-019.md` | 2026-11-01 (Result rows updated with bug refs 2026-11-02) |
| Test-case review findings | `qa-artifacts/3-test-cases/AP2494_ReviewFindings_2026-11-01.md` | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md` | 2026-11-02 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2494_bug-report.md` | 2026-11-02 |
| Review record | `qa-artifacts/7-reviews/AP-2494_review.md` | 2026-11-01 / 2026-11-02 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/` (29 files) | 2026-11-02 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2494_test-report.md` | 2026-11-02 |

---

## Risks and Observations

- **Tested on Dev, not staging.** The cases were designed against staging; Dev ids and some screens differ (the roadside page has no "Save and Generate Contract", the Chubb contract button reads "Generate Contract", dealer 1380 is "Test QA staging" in the admin lists). Staging behaviour is not proven by this run.
- **The sale-number rule is unclear.** Archived quotes 6040 and 6041 list their sale number next to a warranty contract (their warranties are, as recorded in the execution log, APOP01-671 "Pending approval" and APOP01-663 "Cancelled"), while active quote 6480 with a saved sale and no warranty does not. A cancelled warranty contract (APOP01-663) still appears in the column — relevant to Q-008.
- **Recorded behaviour for the open questions on Dev** (recorded, not judged — the product owner has not answered them):
  - Q-001 (how a contract is shown): its contract number as plain text, not a link and not the product name ("26df1-844", "AVP000170", "PNA-0000000019").
  - Q-002 (several contracts): one list item per contract, one per line (quote 6254: "2698" and "AVP000162").
  - Q-003 ("generated" vs "finalized"): a sale has only a Save step; the saved sale does not show (AP-2517).
  - Q-004 / Q-005 / Q-006: the tabs are "Active" (French "Créé") and "Archived"; "Contracts" is the third column, where staging showed "Program"; the French header is "Contrats".
  - Q-007: a magnifier button beside "Create a quote" opens a dialog with one box and a **Search** button (Enter also submits).
  - Q-009: no match shows "No entities found"; there is no clear control — clearing means submitting an empty box.
  - Q-010: the quote name is set on the vehicle-first "Create a quote" form and shown in capitals above the vehicle.
  - Q-011: the search covers only the tab being viewed, keeps newest-first order and keeps the term across pages; switching tab drops it.
  - Q-012 / Q-013: client-name, email and VIN searches are partial and case-insensitive; the reversed "last first" name also matches.
  - Q-014: another dealership's client and VIN return "No entities found" — no leak.
- **Test data left on Dev:** quotes 6479–6483 (clients `client.stage.956`, `957`, `958`, `960@yopmail.com`; quote 6482 named "Zephyrine AP2494 959"), the permanent Chubb creditor contract AVP000170 on quote 6480 (created through Chubb's development API), sale AP2494-S-957 on quote 6480, and roadside products saved without a contract on 6479 and 6480. Quotes cannot be deleted.

---

## Recommendations

1. The product owner answers Q-003 on AP-2517: should a sale contract number show as soon as the sale is saved, or only with a warranty contract / once archived? If the current behaviour is intended, say so in a comment and the QA corrects AP2494_010; otherwise fix the column to list the saved sale.
2. Fix AP-2518 so a roadside contract can be generated on Dev (or explain the "already a contract for the same VIN" rule with a message instead of an error page), then re-run AP2494_005, _008 and _012.
3. Create a GAP insurance contract on Dev (or run AP2494_007 on staging, where one exists) so the GAP part of AC 3 can be checked.
4. Re-test with "AP-2494 --from s4" once 1–3 are done; the 14 passing cases need no re-run on Dev. Passing all five would bring the pass rate to 100 %.
5. The product owner answers the remaining open questions in a comment on AP-2494 — especially Q-008 (should a cancelled contract such as APOP01-663 still appear?) and Q-011 (search limited to the current tab).
6. Run the passing cases on staging before release, since this cycle ran on Dev only.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-02 |
| QA Lead | Vinh Le - QC | Pending | | |
| Development Lead | Ken Nguyen | Pending | | |
| Product Owner | Nicolas-Eric Tain | Pending | | |
