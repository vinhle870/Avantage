# Test Execution Report

**Report ID:** TR-20261103-002
**Project:** Avantage Plus v2 — Dealer portal and Admin portal
**Test Cycle:** AP-2502 — separate compliance document PDF for GC960 and 6201 (single-ticket STLC run, run folder no-sprint)
**Application version:** Not known — the Dev build that carries the merged AP-2502 pull request (ticket moved to QC on 2026-11-02); the UI shows no build number
**Date:** 2026-11-03
**Prepared by:** QA Agent — Test Reporter Skill
**Environment:** Dev — `https://v2dev.garantieavantageplus.ca/` (registry `execution_env: Dev`). Staging was not checked.

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** None of the 5 test cases passed (0%, against a 90% threshold) and one Critical bug, AP-2542, is open: the form that sends compliance documents fails to load on Dev, so no compliance documents can be sent at all.

---

## Executive Summary

The QA agent tested AP-2502 on the Dev environment with 5 test cases covering all 4 requirements. The story changes which disclosure document (the "Parlons assurance / Let's Talk Insurance" sheet) a client receives when a dealer sends compliance documents: GC960 dealers should get a new GC960 document, GC6201 dealers should keep the existing one. All 5 test cases failed at the same point: when the dealer clicks "Send compliance documents", the form never opens because the server answers with an error (HTTP 500 — a server-side failure). This happened for every dealer setup tried, from both pages that offer the send, and also for a dealer set up exactly as before this change, so today no dealer on Dev can send compliance documents to a client. Because nothing was sent, the new GC960 documents themselves could not be checked: the change is unproven, not shown to be wrong. One Critical bug, AP-2542, was filed for the developer; the story should not be released until it is fixed and the tests are run again.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 4 of 4 (planned and executed; none could be judged — see Requirement Coverage) |
| Total test cases | 5 |
| Passed | 0 (0%) |
| Failed | 5 (100%) |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **0% (0 of 5)** |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

Pass rate = test cases passed ÷ all test cases except skipped ones (0 ÷ 5). Defect density: 1 bug for 5 test cases (0.2).

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 1 | 0 | 1 |
| High | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 |
| Low | 0 | 0 | 0 |
| **Total** | **1** | **0** | **1** |

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 100% (AP2502_001, 002, 003 executed; all FAIL) | ✅ |
| Pass rate | ≥ 90% | 0% (0 of 5) | ❌ |
| Critical bugs open | 0 | 1 (AP-2542) | ❌ |
| High bugs open | ≤ 0 | 0 | ✅ |
| Dealer 1380 creditor forms equal the start-of-run value | Equal | Equal — `AP0001`; `GC6201MQ:PM30`, `GC6201MQ:PM50`, `AVPG:TGGAP` (final check 04:59:32Z, re-checked by the reviewer 05:05Z) | ✅ |
| Test report generated | Yes | Yes | ✅ |
| All tracker tickets created | Yes | Yes — AP-2542 | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — A dealer assigned to a 960 form sends a separately filled GC960 document | 3 (001, 004, 005) | 0 | 3 | 0 | 0% — document content untested; the send form failed |
| REQ-002 — A dealer assigned to a GC6201 form keeps the existing parlons-assurance document | 2 (002, 005) | 0 | 2 | 0 | 0% — the existing send itself fails (regression) |
| REQ-003 — A dealer assigned to both families receives one document per family | 1 (003) | 0 | 1 | 0 | 0% — document content untested; the send form failed |
| REQ-004 — The English GC960 document is the English file supplied in the ticket | 1 (001) | 0 | 1 | 0 | 0% — document content untested; the send form failed |
| **Total** | **5** | **0** | **5** | **0** | **0%** |

A test case can cover more than one requirement, so the per-requirement counts add up to more than 5.

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | Opening the "Send compliance documents" form returns HTTP 500 on Dev for every creditor-form setup and from both entry points, so no compliance documents can be sent | Critical | P1 (Jira Highest) | REQ-001 – REQ-004 | [AP-2542](https://garantieavantageplus.atlassian.net/browse/AP-2542) | Open (Backlog) |

AP-2542 is linked "relates to" AP-2502 and AP-2452. AP-2452 is a different HTTP 500 on the same screen (on Send, with a client name of 256 characters or more, on Staging); here the form never loads, on Dev, for any input.

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2502-separate-compliance-document-pdf-for-gc960.md` | 2026-11-03 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2502_requirements-analysis.md` | 2026-11-03 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2502_test-plan.md` | 2026-11-03 |
| Test Cases | `qa-artifacts/3-test-cases/AP2502_TestCases_001-005.md` | 2026-11-03 |
| Review findings | `qa-artifacts/3-test-cases/AP2502_ReviewFindings_2026-11-03.md` | 2026-11-03 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2502_2026-11-03.md` | 2026-11-03 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2502_bug-report.md` | 2026-11-03 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/` (12 .png and 5 network .txt files) | 2026-11-03 |
| Review record | `qa-artifacts/7-reviews/AP-2502_review.md` (R1, R2 rounds 1–2, R3 round 1) | 2026-11-03 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2502_test-report.md` | 2026-11-03 |

---

## Risks and Observations

- **The AP-2502 change is unproven, not disproven.** The send form failed before any document was sent, so the product line, the GC960 footers and the English GC960 file were never checked. Nothing in this run says the GC960 document is wrong.
- **Regression of the existing send.** AP2502_002 used dealer 1380's unchanged GC6201 setup and the send still failed, so the fault reaches every dealer, not only GC960 dealers. Whether it comes from the AP-2502 change cannot be seen from the UI; dealer 1380's compliance log on Dev shows its newest successful send on Oct 2, 2026.
- **Observation, not filed (Q-001):** with only `GC960S:S30` assigned, the dealer's creditor **Form** drop-down on Insurance Quick Quote is empty; with GC6201 and GC960 forms assigned it lists `GC960S:S30` as "Total Premium (Commercial) S30". No acceptance criterion covers this drop-down; it is asked of the author under Q-001.
- **Observation, not filed (Q-008):** the admin page saves an empty creditor-form selection without any message, and the dealer page then shows "Your account is not configured with creditors insurance. Please contact support." while still offering the "Send compliance documents" link (whose form then fails with the same 500). It is asked of the author under Q-008.
- **Open questions:** 7 Judgement and 2 Info questions (Q-001 – Q-009) stay open; none is Blocking. They go to Ken Nguyen in the story comment.
- **Records left on Dev:** quote 6567 (vehicle 915, client Rosalie Bouchard AP2502-004, `client.stage.2502004@yopmail.com`). Dealer 1380's configuration is back at its starting value.

---

## Recommendations

1. Fix AP-2542 (Critical) before releasing AP-2502: find why `GET /compliance-documents/send` answers HTTP 500 on Dev for every dealer setup, including the unchanged GC6201 one.
2. Once AP-2542 is deployed to Dev, re-run all five test cases with "AP-2502 --from s4"; this is the first run that can check the GC960 and GC6201 document content.
3. Ask Ken Nguyen to answer Q-001 (which forms are "960 forms", and whether the empty Form drop-down for a GC960-only dealer is intended) and Q-008 (what a dealer with no creditor form should be able to send).
4. Check whether the same 500 occurs on Staging before AP-2502 is promoted there.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-03 |
| QA Lead | Vinh Le | Pending | | |
| Development Lead | Not known | Pending | | |
| Product Owner | Ken Nguyen | Pending | | |
