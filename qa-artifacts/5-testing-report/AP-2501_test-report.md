# Test Execution Report

**Report ID:** TR-20261102-002
**Project:** Avantage Plus v2 — Dealer and Admin portals, AP-2501: Permaplate invoice — include name of the term in the description
**Test Cycle:** AP-2501 single-ticket STLC run, run folder no-sprint
**Application version:** Not known — the Dev build shows no version number; the ticket's pull request was merged on 2026-10-30
**Tested on:** Dev (v2dev) — `https://v2dev.garantieavantageplus.ca/`, Dealer portal (dealer 1380, "Test QA staging") and Admin portal, by the user's decision. **Staging was not checked**; the test-case files still name v2staging as their environment.
**Date:** 2026-11-02
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** Only 1 of 6 test cases passed (17%, against a 90% pass-rate threshold — the share of test cases that must pass). The invoice PDF, one of the places the term must appear, cannot be opened at all on Dev (new High bug AP-2529), and the rule about where the term sits in the description is still waiting on the ticket author (Q-001).

---

## Executive Summary

We tested whether a Permaplate invoice now names the protection term that was sold (for example "10 ans") in its description. On the invoice details page it does: a new invoice (941) shows the contract number "PNA-0000000020" and, on the next line, "10 ans", with no retail price. The same two lines also appear on the invoice lists in the Dealer portal and in the Admin portal. The invoice PDF could not be checked, because the Admin "PDF" button returns an error page for every invoice on Dev, not only Permaplate ones (AP-2529, High). The dealer's invoice page has no PDF at all, only a "Print" button. Three cases could not be finished because the test dealer can sell only one term on Dev, so we could not show that a different term produces a different name. One case waits on the ticket author to confirm where the term must sit in the description (Q-001). The story therefore stays in QC.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 2 of 4 judged (REQ-001 and REQ-002 ran to a PASS or FAIL; REQ-003 and REQ-004 are BLOCKED) |
| Total test cases | 6 |
| Passed | 1 (17%) |
| Failed | 1 (17%) |
| Blocked | 4 (67%) |
| Skipped | 0 |
| **Pass rate** | **17% (1 of 6)** |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 1 | 0 | 1 |
| Medium | 0 | 0 | 0 |
| Low | 0 | 0 | 0 |
| **Total** | **1** | **0** | **1** |

Defect density: 1 bug over 6 test cases = 0.17 per test case.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| Every test case has a status other than Not Run | 6 of 6 | 6 of 6 (1 PASS, 1 FAIL, 4 BLOCKED) | ✅ |
| Every FAIL filed, linked or dismissed at Gate C | Yes | Yes — 1 FAIL → new bug AP-2529 | ✅ |
| Pass rate | ≥ 90% of non-skipped cases | 17% (1 of 6) | ❌ |
| No open Critical or High bug | 0 | 1 High open (AP-2529) | ❌ |
| Q-001 answered | Answered | Open — no reply on AP-2501 as of 2026-11-02 | ❌ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken. Coverage here is the share of the requirement's cases that ran to a PASS or FAIL._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Term name on the invoice details page | 2 | 1 | 0 | 1 | 50% |
| REQ-002 — Term name on the invoice PDF | 1 | 0 | 1 | 0 | 100% |
| REQ-003 — Term name on the dealer and admin invoice lists | 2 | 0 | 0 | 2 | 0% |
| REQ-004 — Term name follows the contract number | 1 | 0 | 0 | 1 | 0% |
| **Total** | **6** | **1** | **1** | **4** | **33%** |

| TC ID | Title | Priority | Status | Bug / blocker |
|---|---|:---:|:---:|---|
| AP2501_001 | A new Permaplate invoice's details page names the term sold, beside the real contract number and no retail price | High | PASS | — |
| AP2501_002 | A Permaplate contract sold with a different term raises an invoice naming that term, not the first one | High | BLOCKED | Environment — dealer 1380 has only one Permaplate term ("10 ans") linked on Dev |
| AP2501_003 | The PDF of a new Permaplate invoice names the term sold in its description | High | FAIL | AP-2529 |
| AP2501_004 | The Dealer Portal invoice list shows the term name in the new Permaplate invoice's row | Medium | BLOCKED | Environment — no second-term invoice can be made (same as AP2501_002); the "10 ans" row was correct |
| AP2501_005 | The Admin-area invoice list shows the term name in the new Permaplate invoice's row | Medium | BLOCKED | Environment — same as AP2501_004; the "10 ans" row was correct |
| AP2501_006 | On every invoice surface, the term name sits on the line right after the contract number | Medium | BLOCKED | Q-001 (Blocking, unanswered); PDF part also blocked by AP-2529 |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | Admin invoice PDF button (/admin/invoice/{id}/pdf) returns an HTTP 500 error page on Dev for every invoice | High | P1 | REQ-002 (and the PDF part of REQ-004) | [AP-2529](https://garantieavantageplus.atlassian.net/browse/AP-2529) | Open |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md` | 2026-11-01 (Q-007 added 2026-11-02) |
| Test Plan | `qa-artifacts/2-test-plan/AP-2501_test-plan.md` | 2026-11-01 |
| Test Cases | `qa-artifacts/3-test-cases/AP2501_TestCases_001-005.md`, `AP2501_TestCases_006-006.md` | 2026-11-01 (results 2026-11-02) |
| Test-case review findings | `qa-artifacts/3-test-cases/AP2501_ReviewFindings_2026-11-01.md` | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md` | 2026-11-02 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2501_bug-report.md` | 2026-11-02 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/` (5 files) | 2026-11-02 |
| Review record | `qa-artifacts/7-reviews/AP-2501_review.md` | 2026-11-01 – 2026-11-02 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2501_test-report.md` | 2026-11-02 |

---

## Risks and Observations

- **Tested on Dev only.** Every result comes from Dev (v2dev), by the user's decision. Staging was not checked, so the results say nothing about the staging build.
- **The invoice PDF is broken for every invoice on Dev (AP-2529).** The Admin "PDF" button (`/admin/invoice/{id}/pdf`) answered HTTP 500 for invoices 941, 940, 937, 936, 935, 934, 930, 900 and 800 during execution, and for 500, 200 and 50 when the reviewer re-checked, while the invoice page itself loads. Warranty invoices fail too, so the fault is not caused by the term line alone. The AP-1381 run saw the same on invoice 934 on 2026-11-01. Whether the PDF names the term is therefore not known.
- **The dealer has no invoice PDF.** The Dealer portal's invoice page offers only "Print" (the browser's print of the page) and a link to the contract PDF. Recorded as Q-007 for the author: is the criterion's "invoice generated PDF" the Admin PDF, or should dealers be able to download it too?
- **Only one term can be sold on Dev.** Dealer 1380 has only Permaplate product "10 ans" linked on Dev, so no invoice with a second term could be made. AP2501_002, 004 and 005 stay BLOCKED until a second term is linked; the QA decides whether to change that shared dealer's configuration.
- **What we did see is correct.** On invoice 941 the details page, the Dealer list and the Admin list all show "PNA-0000000020" followed by "10 ans" on the next line, with no retail price. The term text is exactly "10 ans" in the English interface (Q-002 recorded, not judged).
- **Known bugs met on the way, not re-filed:** the Permaplate contract download returns the same error page (AP-2512), and the Esthetic protection row shows "-" as its amount (AP-2516).
- **Test data left on Dev:** quote 6555 (client Terme Invoice1102) with contract PNA-0000000020 and unpaid invoice 941 ($91.98); quote 6556 (client Terme Second1102) with vehicle 915 and no product. They cannot be deleted.

---

## Recommendations

1. Fix AP-2529 so the Admin "PDF" button returns the invoice PDF, then re-run AP2501_003 with "AP-2501 --from s4" to check that the PDF names the term.
2. Ask the ticket author (Ken Nguyen) on AP-2501 to answer Q-001 — does the criterion mean the term's name, directly after the contract number? — so AP2501_006 can be judged; and Q-007 — should dealers also get the invoice PDF?
3. To unblock AP2501_002, 004 and 005, the QA links a second enabled term (for example "5 ans") to dealer 1380 under Admin → dealer → Esthetic protection, then re-runs the cases from s4.
4. Check the term line on Staging before release, since this run covered Dev only.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-02 |
| QA Lead | Vinh Le - QC | Pending | | |
| Development Lead | Not known — no development lead is named in the registry | Pending | | |
| Product Owner | Ken Nguyen (ticket reporter) | Pending | | |
