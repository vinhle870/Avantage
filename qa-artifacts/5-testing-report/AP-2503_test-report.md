# Test Execution Report

**Report ID:** TR-20261115-001 (replaces TR-20261102-003)
**Project:** Avantage Plus v2 — Dealer portal, AP-2503: Generate contract for a quote's extended warranty
**Test Cycle:** AP-2503 single-ticket STLC run, run folder no-sprint — qa-agent batch 2026-11-15 (re-test with the QA's answers to Q-001–Q-011)
**Application version:** Not known — the Dev build shows only "Avantage Plus System v2.0.0" in its footer
**Environment:** Dev (v2dev) — `https://v2dev.garantieavantageplus.ca/`, Dealer portal (dealer 1380, "Test QA staging"), per `execution_env` in the registry. **Staging was not checked.**
**Date:** 2026-11-15
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** 5 of 10 test cases passed (50%, against a 90% pass-rate threshold — the share of test cases that must pass). Five faults remain open: the summary still has no vehicle delivery date (AP-2530), the VIN can still be typed over (AP-2531), a sale without financing still cannot become a contract without a financing company (AP-2532, High), and two new faults — the contract preview has disappeared from the page (AP-2563) and clearing the start date crashes the submit with a server error (AP-2564).

---

## Executive Summary

We re-tested the page a dealer uses to turn a quote's extended warranty into a contract, this time using the QA's answers to the eleven open questions from the first run. Since the first run on 2026-11-02, the page has been rebuilt by five later stories (AP-2544, AP-2545, AP-2546, AP-2559, AP-2560) into a shared "check out" page, and those stories now decide the points they define. The core still works: "Generate Contract" opens its own page, the page is filled in from the quote, and submitting creates the contract and its invoice with the start date the dealer chose. Five things do not match the ticket. Three were already reported and are still there: the summary leaves out the delivery date, the VIN can be typed over (a later story now allows this, so the developer must decide whether that bug is closed), and a sale without financing cannot become a contract until the dealer picks a financing company the customer does not have. Two are new: the page no longer shows a preview of the contract before it is created — it did on 2026-11-02, so this is a regression (something that used to work and now does not) — and clearing the warranty start date before submitting shows the application's error page and loses everything typed. All testing was done on Dev, not Staging. The story stays in QC.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 5 of 5 judged (every requirement has at least one case that ran to a PASS or FAIL) |
| Total test cases | 10 |
| Passed | 5 (50%) |
| Failed | 5 (50%) |
| Blocked | 0 (0%) |
| Skipped | 0 |
| **Pass rate** | **50% (5 of 10)** |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 1 | 0 | 1 |
| Medium | 4 | 0 | 4 |
| Low | 0 | 0 | 0 |
| **Total** | **5** | **0** | **5** |

Defect density: 5 bugs over 10 test cases = 0.5 per test case (3 seen again from 2026-11-02, 2 new).

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| Every test case has a status other than Not Run | 10 of 10 | 10 of 10 (5 PASS, 5 FAIL) | ✅ |
| Every FAIL filed, linked or dismissed at Gate C | Yes | Yes — 3 commented on the open bugs AP-2530, AP-2531, AP-2532; 2 filed new as AP-2563 and AP-2564 (Gate C by the independent reviewer, R3 round 2) | ✅ |
| Pass rate | ≥ 90% of non-skipped cases | 50% (5 of 10) | ❌ |
| No open Critical or High bug | 0 | 1 High open (AP-2532) | ❌ |
| No Blocking question open | 0 | 0 — Q-001–Q-011 all answered by the QA on 2026-11-15 | ✅ |
| Test report generated and result comment posted on AP-2503 | Yes | Report yes; comment pending (update-ticket stage, after the outcome review) | ❌ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken. Coverage here is the share of the requirement's cases that ran to a PASS or FAIL. A case that covers two requirements is counted under each._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Dedicated page at the unchanged route | 1 | 1 | 0 | 0 | 100% |
| REQ-002 — Two-column layout with PDF preview | 1 | 0 | 1 | 0 | 100% |
| REQ-003 — Program Summary content | 3 | 1 | 2 | 0 | 100% |
| REQ-004 — Pre-fill and read-only / editable fields | 4 | 2 | 2 | 0 | 100% |
| REQ-005 — Submit creates the contract | 4 | 2 | 2 | 0 | 100% |
| **Total (distinct cases)** | **10** | **5** | **5** | **0** | **100%** |

| TC ID | Title | Priority | Status | Bug / blocker |
|---|---|:---:|:---:|---|
| AP2503_001 | Clicking "Generate Contract" on the extended warranty opens its own page at the unchanged address, not a pop-up | High | PASS | — |
| AP2503_002 | The generate-contract page shows vehicle, owner and financing details on the left, and summary, contract preview and button on the right | Medium | FAIL | AP-2563 (step 4 — no contract preview or "Open PDF in new tab" link). Step 3 PASS: no Financing card on a quote without GAP/Creditor insurance, as AP-2559 defines |
| AP2503_003 | The Program Summary shows the quote's delivery date, an editable warranty start date and a warranty sale price | High | FAIL | AP-2530 (seen again) |
| AP2503_004 | The generate-contract page is pre-filled with the quote's client, vehicle and financing values | High | PASS | — |
| AP2503_005 | On the generate-contract page the VIN and the delivery date cannot be changed, while owner fields and start date can | High | FAIL | AP-2531 (seen again, VIN only — the delivery date is now read-only) |
| AP2503_006 | Submitting the generate-contract page with its pre-filled values creates the contract and its invoice as before | High | PASS | — |
| AP2503_007 | A no-financing quote submits, and the start date and owner details edited on the page reach the contract | High | FAIL | AP-2532 (seen again — now one required "Financing company" picker) |
| AP2503_008 | An emptied owner last name is refused, keeping the other values and creating no contract | Medium | FAIL | AP-2564 (step 4 — HTTP 500 with the start date cleared). The last-name refusal itself passed |
| AP2503_009 | A warranty start date 30 days before delivery is accepted and becomes the start date of the created contract | Medium | PASS | — |
| AP2503_010 | The generate-contract page opens for a quote with no financing and pre-fills owner and vehicle | Medium | PASS | — |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | The "Program Summary" (now "Product Summary") on the extended-warranty Generate Contract page does not show the vehicle delivery date | Medium | P2 | REQ-003 | [AP-2530](https://garantieavantageplus.atlassian.net/browse/AP-2530) — commented 2026-11-15 | Open |
| BUG-002 | The VIN can be edited on the extended-warranty Generate Contract page although it should be read-only | Medium | P2 | REQ-004 | [AP-2531](https://garantieavantageplus.atlassian.net/browse/AP-2531) — commented 2026-11-15 | Open |
| BUG-003 | A quote without financing cannot become an extended-warranty contract unless the dealer picks a financing company | High | P2 | REQ-005 | [AP-2532](https://garantieavantageplus.atlassian.net/browse/AP-2532) — commented 2026-11-15 | Open |
| BUG-004 | The extended-warranty Generate Contract page no longer shows the contract preview or the "Open PDF in new tab" link | Medium | P2 | REQ-002 | [AP-2563](https://garantieavantageplus.atlassian.net/browse/AP-2563) — new | Open |
| BUG-005 | Submitting the extended-warranty Generate Contract page with the warranty start date cleared returns HTTP 500 | Medium | P2 | REQ-005 | [AP-2564](https://garantieavantageplus.atlassian.net/browse/AP-2564) — new | Open |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2503-generate-contract-for-a-quotes-extended.md` | 2026-11-01 (answer appended 2026-11-15) |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2503_requirements-analysis.md` | 2026-11-15 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2503_test-plan.md` | 2026-11-15 (version 2.0) |
| Test Cases | `qa-artifacts/3-test-cases/AP2503_TestCases_001-005.md`, `AP2503_TestCases_006-010.md` | 2026-11-15 |
| Test-case review findings | `qa-artifacts/3-test-cases/AP2503_ReviewFindings_2026-11-15.md` | 2026-11-15 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-15.md` | 2026-11-15 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2503_bug-report.md` | 2026-11-15 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/` (22 files from this run: 20 images, 2 network files) | 2026-11-15 |
| Bug comments | `qa-artifacts/4-execution-results/comment_AP-2530_2026-11-15.md`, `comment_AP-2531_2026-11-15.md`, `comment_AP-2532_2026-11-15.md` | 2026-11-15 |
| Review record | `qa-artifacts/7-reviews/AP-2503_review.md` | 2026-11-01 – 2026-11-15 |
| Previous run | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-02.md` (7 PASS / 3 FAIL, 70%) | 2026-11-02 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2503_test-report.md` | 2026-11-15 |

---

## Risks and Observations

- **Tested on Dev only.** Every result comes from Dev (v2dev). Staging was not checked, so the results say nothing about the staging build.
- **Batch decisions that shaped this run:**
  - The QA answered Q-001–Q-011 on 2026-11-15: "AP-2503: according to the question: all current behavior actual result is correct as expected." The answer accepts the 2026-11-02 behaviour on the questions only; it does not override an acceptance criterion, so AP-2530, AP-2531 and AP-2532 stay open (the acceptance criterion wins).
  - Later Stories that are delivered (Deploy to staging) — **AP-2544, AP-2545, AP-2546, AP-2559, AP-2560** — supersede AP-2503 on the points they define. Four steps whose expected result came only from a question answer were judged against them: AP2503_005 step 5 (vehicle values read-only — AP-2544), AP2503_007 step 5 (the quote's client is updated on submit — AP-2545), AP2503_008 step 2 (refusal message inside the owner card — AP-2560), AP2503_002 step 3 and AP2503_010 step 3 (no Financing information card on a quote without GAP/Creditor insurance — AP-2559).
  - **AP-2550 and AP-2561 are still In Progress and do not supersede anything.** No result was judged against them.
  - No delivered Story removes the contract preview or defines the delivery date or sale price for an extended warranty, so AP-2503 acceptance criteria 1 and 2 still apply (AP-2563, AP-2530). The read-only sale price was recorded and accepted (AC 2 says only "Warranty sale price").
- **AP-2531 may be closed by a later story.** AP-2544 states "All inputs are read-only except for the VIN input.", which makes the VIN editable on purpose. The comment on AP-2531 asks the developer to decide; until then the VIN half stays open against AP-2503 acceptance criterion 3.
- **A contract for a sale without financing carries a financing company the customer does not have.** To finish AP2503_007, AP2503_008 and AP2503_009, the QA picked AutoCapital Canada on quotes without financing (AP-2532). Contracts **APOP01-849** and **APOP01-850** on Dev therefore show that company. They cannot be deleted.
- **Observations, not AP-2503 bugs (recorded for the stories' own authors):**
  - **Quote 6704's Financing card vs AP-2559.** Quote 6704 has a financing but no GAP/Creditor insurance, yet the "Financing information" card is shown. Read literally, AP-2559 ("Given the dealer is checking-out a quote without a GAP/Creditor insurance … the “Financing information” card is not visible") would hide it. Whether AP-2559 means "without GAP/Creditor" or "without financing" is for AP-2559's author. AP2503_004 step 5 (financing pre-filled, AC 3) stays PASS.
  - **Owner card fields vs AP-2545.** The Owner identification card shows "Indian status certificate" and "Drivers license", which AP-2545 says "are not shown". This belongs to AP-2545's own testing; no AP-2503 result changes.
- **Other observations:** every generate-contract page shows the red "acceptable timeframe" banner even with today's delivery date, and it does not stop a submit (AP-2489); the quote page now also has its own "Generate Contract" link to `/quote/{id}/checkout` (AP-2551), not used by these cases; the direct `/quote/{id}/warranty/edit` page lists programs with empty names (setup used the add modal).
- **Left behind on Dev (cannot all be deleted):** vehicles **1231–1235** (VINs AP2503TC001/004/007/008/009111509); quotes **6703–6707**; a financing on quote 6704 (AutoCapital Canada, 25,000, 60 months); contracts **APOP01-848** (quote 6704, invoice **#952**), **APOP01-849** (quote 6705, invoice **#953**) and **APOP01-850** (quote 6707, invoice **#954**), $456.00 each, payment pending. **Quote 6705's client was edited** by the submit (now ContractEd / 300 Rue Edit / 5145550299, as AP-2545 defines). Contracts and invoices cannot be deleted; nothing was deleted.

---

## Recommendations

1. Restore the contract preview and the "Open PDF in new tab" link in the right column (AP-2563), or, if they were removed on purpose, update AP-2503 to say so. Fix the HTTP 500 on an empty start date so it is refused with a message like the other required fields (AP-2564).
2. The developer decides whether AP-2544 supersedes AP-2531's VIN half and closes or fixes AP-2531; add the delivery date to the Product Summary (AP-2530); the product owner settles AP-2532 (is a financing company required for a sale without financing?).
3. **Redesign the test cases against the delivered Stories in a later design pass** before the next run: AP2503_002 (financing card per AP-2559, tested on a quote that shows the card; owner fields per AP-2545), AP2503_005 (vehicle card read-only except the VIN, per AP-2544), AP2503_007 (quote client updated per AP-2545), AP2503_008 (server message in the client card per AP-2560), AP2503_010 (no Financing card per AP-2559, picker in the Product Summary), and AP2503_004 for the AP-2559 visibility question. Then re-run with "AP-2503 --from execute".
4. Check the page on Staging before release, since this run covered Dev only.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-15 |
| QA Lead | Vinh Le - QC | Pending | | |
| Development Lead | Not known — no development lead is named in the registry | Pending | | |
| Product Owner | Nicolas-Eric Tain (ticket reporter) | Pending | | |
