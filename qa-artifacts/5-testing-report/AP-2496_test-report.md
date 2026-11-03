# Test Execution Report

**Report ID:** TR-20261102-001
**Project:** Avantage Plus (AP) — Dealer portal
**Test Cycle:** AP-2496 — Download all finalized documents from a quote in one click (run folder `no-sprint`)
**Application version:** Not known — Dev shows no build number on its pages. Tested on: Dev (v2dev), https://v2dev.garantieavantageplus.ca/, by the user's decision (v2staging was not used)
**Date:** 2026-11-02
**Prepared by:** QA Agent — Test Reporter Skill (inside stlc-ticket-pipeline, `--from s5`)

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** Only 2 of 9 test cases passed (22%, against the 90% needed), and the one feature the story adds — downloading all of a quote's documents as one PDF — returns a server error on every try (High bug AP-2519); six more cases could not be run because roadside contracts cannot be created on Dev (open bug AP-2518).

---

## Executive Summary

The QA agent tested the new "Download all documents" action on the Dev site with 9 test cases covering the story's 4 requirements. The action appears in the right places — it is hidden on quotes with nothing to download, and those 2 checks passed — but clicking it never produces the promised merged PDF: the site shows a French "technical difficulties" error page instead, even on a quote whose two documents each download fine on their own. This was filed as a High-severity bug, AP-2519, and assigned to Ken Nguyen. Six of the nine test cases could not be run at all, because they need a roadside contract and creating one fails on Dev today (already reported as AP-2518); so whether the merged file has the right pages, in the right order, without removed or cancelled products, is still unknown. The story should not be released; it will be re-tested once AP-2518 and AP-2519 are fixed.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 1 of 4 (REQ-002 has executed cases; REQ-001, REQ-003, REQ-004 have only blocked or failed cases) |
| Total test cases | 9 |
| Passed | 2 (22%) |
| Failed | 1 (11%) |
| Blocked | 6 |
| Skipped | 0 |
| **Pass rate** | **22% (2 of 9)** |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

The pass rate is the share of test cases that passed, counted over every case except skipped ones; blocked cases count as not passed.

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 1 | 0 | 1 |
| Medium | 0 | 0 | 0 |
| Low | 0 | 0 | 0 |
| **Total** | **1** | **0** | **1** |

Not counted above: AP-2518 (roadside "Generate Contract" returns HTTP 500 on Dev) was found in an earlier run and blocks six cases of this one.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished (the test plan's exit criteria), and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 14% — 1 of 7 High cases ran to a result (AP2496_002); 001, 004, 005, 006, 007 and 009 are blocked | ❌ |
| Pass rate | ≥ 90% | 22% (2 of 9) | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | 0 | 1 (AP-2519) | ❌ |
| Every FAIL filed, linked or dismissed | Yes | Yes — AP2496_008 filed as AP-2519 | ✅ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Action shown with a generated contract | 1 (001) | 0 | 0 | 1 | 0% |
| REQ-002 — Action hidden with nothing to download | 3 (002, 003, 008) | 2 | 1 | 0 | 100% |
| REQ-003 — One PDF named with the quote id | 4 (004, 005, 008, 009) | 0 | 1 | 3 | 25% |
| REQ-004 — Removed / cancelled items excluded | 2 (006, 007) | 0 | 0 | 2 | 0% |
| **Total** | **9 distinct (008 counts under two requirements)** | **2** | **1** | **6** | **33% (3 of 9 cases reached a result)** |

Coverage here is the share of a requirement's cases that ran to a pass or fail result.

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | "Download all documents" (`/quote/{id}/documents/download`) returns an HTTP 500 error page on Dev instead of the merged PDF | High | P1 | REQ-003 (and REQ-002) | [AP-2519](https://garantieavantageplus.atlassian.net/browse/AP-2519) | Open |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2496-download-all-finalized-documents-from-quote.md` | 2026-11-01 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2496_requirements-analysis.md` | 2026-11-01 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2496_test-plan.md` | 2026-11-01 |
| Test Cases | `qa-artifacts/3-test-cases/AP2496_TestCases_001-005.md`, `AP2496_TestCases_006-009.md` | 2026-11-01 |
| Review findings | `qa-artifacts/3-test-cases/AP2496_ReviewFindings_2026-11-01.md` | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2496_2026-11-02.md` | 2026-11-02 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2496_bug-report.md` | 2026-11-02 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/` (14 files: 12 page captures, 2 network-request text files) | 2026-11-02 |
| Review record | `qa-artifacts/7-reviews/AP-2496_review.md` | 2026-11-02 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2496_test-report.md` | 2026-11-02 |

---

## Risks and Observations

- **The core feature fails on Dev.** On quote 6040 the warranty PDF (5 pages) and the sales PDF (6 pages) both download with HTTP 200, but the merged download returns HTTP 500 four times out of four (AP-2519). The same address also fails on a quote with no product (6486, 6488) and on quote 6480, whose own Chubb contract PDF also fails, so 6480 is weaker evidence.
- **Six of nine cases are blocked by AP-2518.** Roadside "Generate Contract" returned HTTP 500 on quotes 6484 (twice), 6487 and 6489. Because of it, nothing is known yet about the merged file's content, page count, file name, or the exclusion of removed or cancelled products (REQ-001, REQ-003, REQ-004).
- **AP2496_009 needs a quote of another dealership.** The admin Esthetic protection contract pages on Dev show no quote id, so a cross-dealership request could not be tried even apart from AP-2518. This is a security check (can one dealer download another dealer's documents?) and remains open.
- **The test environment was Dev, not staging.** The user chose Dev for this run. The roadside form on Dev differs from the staging steps the cases were written for (no vehicle fields, contract generated from the row menu).
- **Observed behaviour worth confirming with the author (recorded, not judged):** the action is shown once, under "Subtotal" in the "Summary of products" table, labelled "Télécharger tous les documents" in French; it is hidden on a quote with no product; saving an Esthetic protection product does not create a contract on Dev.
- **Records left on Dev:** quotes 6484–6489 (client inboxes `client.stage.961` to `client.stage.966@yopmail.com`). No contract was created; nothing was cleaned up because no cleanup procedure is defined.

---

## Recommendations

1. Fix AP-2519 (High — the merged download returns HTTP 500 even when every source PDF works) before AP-2496 is released; the server log for 2026-11-01 22:01:59Z–22:02:23Z UTC should show the exception.
2. Fix AP-2518 (roadside "Generate Contract" HTTP 500 on Dev), which blocks six of this story's nine test cases.
3. Once both are fixed, re-run the cases with "AP-2496 --from s4" so REQ-001, REQ-003 and REQ-004 get an actual result.
4. Provide a known quote id of another dealership on Dev (or a screen that shows one) so the cross-dealership security check AP2496_009 can run.
5. Optionally, before the re-run, add a warranty-contract precondition to the blocked cases (warranty contracts can be generated on Dev), so they no longer depend on roadside contracts.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-02 |
| QA Lead | Vinh Le | Pending | | |
| Development Lead | Not known — not named on the ticket | Pending | | |
| Product Owner | Not known — not named on the ticket | Pending | | |
