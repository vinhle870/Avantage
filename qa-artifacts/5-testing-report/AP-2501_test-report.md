# Test Execution Report

**Report ID:** TR-20261115-001 (replaces TR-20261102-002)
**Project:** Avantage Plus v2 — Dealer and Admin portals, AP-2501: Permaplate invoice — include name of the term in the description
**Test Cycle:** AP-2501 single-ticket STLC run, run folder no-sprint, batch qa-agent 2026-11-15
**Application version:** Not known — the Dev build shows no version number (footer "Avantage Plus System v2.0.0"); the ticket's pull request was merged on 2026-10-30
**Environment:** Dev (v2dev) — `https://v2dev.garantieavantageplus.ca/`, Dealer portal (dealer 1380, "Test QA staging") and Admin portal — the registry's `execution_env`. **Staging was not checked.**
**Date:** 2026-11-15 (execution 2026-11-15 10:43–10:48 UTC; AP2501_001 and AP2501_006 carried from 2026-11-02)
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** 4 of 6 test cases passed (66.7%, against a 90% pass-rate threshold — the share of test cases that must pass). The invoice PDF, one of the places the term must appear, still cannot be opened at all on Dev (open High bug AP-2529), and the rule about where the term sits in the description is still waiting on the ticket author (Q-001, Blocking). The term itself is right on every screen that could be read.

---

## Executive Summary

We tested whether a Permaplate invoice now names the protection term that was sold in its description. It does, on every screen we could read. An invoice made with the "10 ans" term (invoice 941) shows "10 ans", and a new invoice made today with a different term, "5 ans" (invoice 956), shows "5 ans" and never "10 ans" — so the invoice names the term actually sold, not a fixed text. Both invoices show the term in full, on the line right after the contract number, on the invoice page, on the Dealer portal's invoice list and on the Admin invoice list. The invoice PDF could not be checked: the Admin "PDF" button still returns an error page for every invoice on Dev, old and new (AP-2529, High, reported on 2026-11-02 and re-confirmed today). One case still waits on the ticket author to confirm what the acceptance criterion's "name of the invoice" means (Q-001). The story therefore stays in QC.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 3 of 4 judged (REQ-001, REQ-002 and REQ-003 ran to a PASS or FAIL; REQ-004 is BLOCKED on Q-001) |
| Total test cases | 6 |
| Passed | 4 (66.7%) |
| Failed | 1 (16.7%) |
| Blocked | 1 (16.7%) |
| Skipped | 0 |
| **Pass rate** | **66.7% (4 of 6)** |
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

Defect density: 1 bug over 6 test cases = 0.17 per test case. No new bug was filed this run; the one failure is the open bug AP-2529, which was given a re-check comment.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| Every test case has a status other than Not Run | 6 of 6 | 6 of 6 (4 PASS, 1 FAIL, 1 BLOCKED) | ✅ |
| Every FAIL filed, linked or dismissed at Gate C | Yes | Yes — 1 FAIL → comment on existing AP-2529 (rule C2, decided by the independent reviewer) | ✅ |
| Pass rate | ≥ 90% of non-skipped cases | 66.7% (4 of 6) | ❌ |
| No open Critical or High bug | 0 | 1 High open (AP-2529, Backlog) | ❌ |
| Q-001 answered | Answered | Open — asked 2026-11-01 (comment 19437) and 2026-11-08; no answer as of 2026-11-15 | ❌ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken. Coverage here is the share of the requirement's cases that ran to a PASS or FAIL._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Term name on the invoice details page | 2 | 2 | 0 | 0 | 100% |
| REQ-002 — Term name on the invoice PDF | 1 | 0 | 1 | 0 | 100% |
| REQ-003 — Term name on the dealer and admin invoice lists | 2 | 2 | 0 | 0 | 100% |
| REQ-004 — Term name follows the contract number | 1 | 0 | 0 | 1 | 0% |
| **Total** | **6** | **4** | **1** | **1** | **83%** |

| TC ID | Title | Priority | Status | Bug / blocker |
|---|---|:---:|:---:|---|
| AP2501_001 | A new Permaplate invoice's details page names the term sold, beside the real contract number and no retail price | High | PASS | — (2026-11-02, carried; invoice 941 re-read unchanged today) |
| AP2501_002 | A Permaplate contract sold with a different term raises an invoice naming that term, not the first one | High | PASS | — (invoice 956 reads "5 ans"; the temporary "5 ans" link was removed and the removal confirmed) |
| AP2501_003 | The Admin invoice PDF of a new Permaplate invoice names the term sold in its description | High | FAIL | AP-2529 — `/admin/invoice/941/pdf` and `/admin/invoice/956/pdf` answer HTTP 500 |
| AP2501_004 | The Dealer Portal invoice list shows each Permaplate invoice's own term name in full | Medium | PASS | — |
| AP2501_005 | The Admin-area invoice list shows each Permaplate invoice's own term name in full | Medium | PASS | — |
| AP2501_006 | On every invoice surface, the term name sits on the line right after the contract number | Medium | BLOCKED | Q-001 (Blocking, Open); PDF part also blocked by AP-2529 |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | Admin invoice PDF button (/admin/invoice/{id}/pdf) returns an HTTP 500 error page on Dev for every invoice | High | P1 | REQ-002 (and the PDF part of REQ-004) | [AP-2529](https://garantieavantageplus.atlassian.net/browse/AP-2529) — filed 2026-11-02; re-check comment 19587 on 2026-11-15 | Open (Backlog, assignee Minh Lưu) |

AP-2512 (Permaplate contract download, HTTP 500) and AP-2519 ("Download all documents", HTTP 500) are both open (Backlog, High) on Dev, but neither is linked to AP-2501 or listed in its bug report; they are not counted here.

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md` | 2026-11-01; re-run 2026-11-15 (knowledge lookup, R1 rework) |
| Test Plan | `qa-artifacts/2-test-plan/AP-2501_test-plan.md` | 2026-11-01; v1.1 2026-11-15 |
| Test Cases | `qa-artifacts/3-test-cases/AP2501_TestCases_001-005.md`, `AP2501_TestCases_006-006.md` | 2026-11-01; revised 2026-11-15 |
| Test-case review findings | `qa-artifacts/3-test-cases/AP2501_ReviewFindings_2026-11-15.md` (earlier: `AP2501_ReviewFindings_2026-11-01.md`) | 2026-11-15 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-15.md` (AP2501_001 and AP2501_006 in `execution-log_AP-2501_2026-11-02.md`) | 2026-11-15 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2501_bug-report.md` (BR-20261115-001) | 2026-11-15 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/` — 8 screenshots and 1 network file from 2026-11-15 (names carry "Nov15") | 2026-11-15 |
| Review record | `qa-artifacts/7-reviews/AP-2501_review.md` | 2026-11-01 – 2026-11-15 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2501_test-report.md` | 2026-11-15 |

---

## Risks and Observations

- **Tested on Dev only.** Every result comes from Dev (v2dev), the registry's execution environment. Staging was not checked.
- **The invoice PDF is still broken for every invoice on Dev (AP-2529).** On 2026-11-15 the Admin "PDF" button answered `GET https://v2dev.garantieavantageplus.ca/admin/invoice/941/pdf → 500 text/html` and the same for today's invoice 956, while both invoice pages load. Whether the PDF names the term is therefore still not known. The re-check was added to AP-2529 as comment 19587 with the screenshot and request lines; no new bug was filed.
- **The term is the term sold.** With a second term linked for the test, invoice 956 ("5 ans") and invoice 941 ("10 ans") each show their own term on the invoice page and on both lists, in full, one item per line (Q-002 and Q-005 accepted). On every surface that could be read, the term sits on the line right after the contract number — recorded for Q-001/Q-008, not judged.
- **Questions settled since 2026-11-08.** Q-002 (exact term text), Q-005 (list layout) and Q-007 (which PDF — the Admin invoice PDF, per AP-2099), posted with screenshots on 2026-11-08, are now settled and need no answer. Only Q-001 is still open.
- **Q-001 is still open (Blocking).** The acceptance criterion says "the name of the **invoice** should follow the contract number", the title and description say "the name of the **term**". It was asked on 2026-11-01 (comment 19437) and again on 2026-11-08; it was not asked again. AP2501_006 stays BLOCKED until a non-developer answers.
- **Wording changes seen in setup screens, not faults:** the Admin dealer page's link and unlink messages now say "Esthetic protection product" instead of "Permaplate product"; the quote header's "Generate Contract" now opens a check-out page (`/quote/{id}/checkout`), while the Esthetic protection row still opens the Permaplate contract page.
- **Test data left on Dev:** from 2026-11-15 — client terme.second.1115@yopmail.com (Terme Second1115), quote 6709, Permaplate contract PNA-0000000028 (term "5 ans", Financing company AutoCapital Canada) and unpaid invoice 956 ($40.24). The temporary "5 ans" link on dealer 1380 was removed and the removal confirmed (only "10 ans" remains, as before the run). From 2026-11-02 — quote 6555 with contract PNA-0000000020 and unpaid invoice 941 ($91.98), and quote 6556. Invoices cannot be deleted.

---

## Recommendations

1. Fix AP-2529 so the Admin "PDF" button returns the invoice PDF, then re-run AP2501_003 (and the PDF part of AP2501_006) with "AP-2501 --from execute" to check that the PDF names the term.
2. The ticket author (Ken Nguyen) answers Q-001 on AP-2501 — does the criterion mean the term's name, directly after the contract number? — so AP2501_006 can be judged. It has been asked twice; it is named again in the result comment, not re-posted as a new question.
3. Check the term line on Staging before release, since this run covered Dev only.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-15 |
| QA Lead | Vinh Le - QC | Pending | | |
| Development Lead | Not known — no development lead is named in the registry | Pending | | |
| Product Owner | Ken Nguyen (ticket reporter) | Pending | | |
