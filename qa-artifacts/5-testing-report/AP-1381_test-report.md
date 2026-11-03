# Test Execution Report — AP-1381

**Report ID:** TR-20261101-001
**Project:** Avantage Plus v2 — Dealer portal and Admin portal (Jira project AP)
**Test Cycle:** Test of AP-1381 "duplicate name visual" — the dealer's name shown once in the "To:" block of a dealer invoice (run folder `1.25.0`, the ticket's fix version)
**Application version:** Not known — the Dev site does not show a build number; the fix shipped in release 1.25.0 (2022-09-19)
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Reporter Skill
**Tested on:** Dev (v2dev) — https://v2dev.garantieavantageplus.ca (the user's decision for this run, instead of Staging)

---

## Verdict

> # ✅ PASS — Ready for Release

**Rationale:** All 3 test cases that could be judged passed (100%, threshold 90%; the 1 SKIPPED case is not counted), no bug was found, and the only Blocking question (Q-001) is answered by the reporter.

---

## Executive Summary

The QA team checked that a dealer invoice no longer shows the dealer's name twice in its
addressee ("To:") block. On the Dev test site, the newest warranty invoice of the test
dealer (invoice 934) shows the dealer's name, "Offical VinhLe870@gmail.com", exactly once,
both when the dealer opens it in the Dealer portal and when staff open it in the Admin
portal; the company name "Test QA staging" is not added as a second name. This matches the
reporter's own answer of 2022-08-03: "the *Name is what will appear in the invoice". The
oldest invoice on the site (invoice 65, from 2020) still opens normally. One check, on the
PDF copy of the invoice, could not be done because the Dealer portal offers no PDF, only a
Print button. No defect was found, so the ticket is ready for release.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 2 of 2 |
| Total test cases | 4 |
| Passed | 3 (75% of all 4; 100% of the 3 counted) |
| Failed | 0 (0%) |
| Blocked | 0 |
| Skipped | 1 |
| **Pass rate** | **100%** (3 of 3 — the pass rate is the share of judged cases that passed; SKIPPED cases are not counted) |
| Pass rate threshold | 90% |
| Threshold met? | ✅ Yes |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 |
| Low | 0 | 0 | 0 |
| **Total** | **0** | **0** | **0** |

Defect density: 0 bugs ÷ 4 test cases = 0.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| Every test case has a status other than Not Run | 100% | 100% (4 of 4) | ✅ |
| All High-priority TCs executed | 100% | 100% (AP1381_001, 002) | ✅ |
| Pass rate (all cases except SKIPPED) | ≥ 90% | 100% (3 of 3) | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | 0 | 0 | ✅ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Dealer portal invoice shows the dealer's name only once | 3 (AP1381_001, 003, 004) | 2 | 0 | 0 | 67% (AP1381_003 SKIPPED) |
| REQ-002 — Admin portal invoice shows the dealer's name only once | 1 (AP1381_002) | 1 | 0 | 0 | 100% |
| **Total** | **4** | **3** | **0** | **0** | **75%** (3 of 4 run to the end) |

| TC ID | Title | Priority | Result | Evidence |
|---|---|:---:|:---:|---|
| AP1381_001 | A dealer opening an invoice in the Dealer portal sees the dealer's name once in the TO section, not twice | High | ✅ PASS | Invoice 934 "To:" block: "Offical VinhLe870@gmail.com" 1 time, "Test QA staging" 0 times. Permaplate invoice 927 (recorded only) also shows the name once |
| AP1381_002 | An admin opening the same dealer invoice in the Admin portal sees the dealer's name once in the TO section | High | ✅ PASS | `/admin/invoices` → `/admin/invoice/934`: same "To:" block, name 1 time |
| AP1381_003 | The downloadable PDF of a dealer invoice shows the dealer's name without an error — how often it appears is recorded | Medium | ⏭️ SKIPPED | Dealer page `/invoice/934` offers only "Print" — "no PDF copy offered" by the case's own rule |
| AP1381_004 | The oldest dealer invoice still opens without an error — whether it keeps the duplicated name is recorded | Low | ✅ PASS | Invoice 65 (2020-11-25) opens; "VinhLeDealer01" shown once (recorded for Q-002) |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| — | No defects found in this run | — | — | — | — | — |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-1381-duplicate-name-visual.md` | 2026-11-01 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-1381_requirements-analysis.md` | 2026-11-01 |
| Test Plan | `qa-artifacts/2-test-plan/AP-1381_test-plan.md` | 2026-11-01 |
| Test Cases | `qa-artifacts/3-test-cases/AP1381_TestCases_001-004.md` | 2026-11-01 |
| Review Findings | `qa-artifacts/3-test-cases/AP1381_ReviewFindings_2026-11-01.md` | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/1.25.0/execution-log_AP-1381_2026-11-01.md` | 2026-11-01 |
| Bug Report | `qa-artifacts/5-testing-report/AP-1381_bug-report.md` | 2026-11-01 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/1.25.0/AP-1381/` (6 files) | 2026-11-01 |
| Review record | `qa-artifacts/7-reviews/AP-1381_review.md` (R1, R2, R3 — all APPROVE) | 2026-11-01 |
| **This Report** | `qa-artifacts/5-testing-report/AP-1381_test-report.md` | 2026-11-01 |

Screenshots: AP1381_001-step5-WarrantyInvoice934ToBlock_pass.png ·
AP1381_001-step5-PermaplateInvoice927ToBlock_pass.png ·
AP1381_002-step5-AdminInvoice934ToBlock_pass.png ·
AP1381_003-step2-DealerInvoiceOnlyPrintNoPdf_skip.png ·
AP1381_003-obs-AdminInvoice934PdfHttp500.png ·
AP1381_004-step4-OldestInvoice65ToBlock_pass.png

---

## Risks and Observations

- **Tested on Dev, not Staging.** The run used the Dev site (v2dev) by the user's decision.
  The cases were designed with Staging invoice numbers; each case's own selection rule picked
  the Dev ones (warranty invoice 934, Permaplate invoice 927, oldest invoice 65). Dealer 1380
  has the same Name and Company on Dev as on Staging.
- **Admin portal PDF error (observation, not a failure).** On the Admin portal invoice page,
  the "PDF" button (`/admin/invoice/934/pdf`) showed the French error page "Erreur — Désolé,
  l'application éprouve des difficultés techniques…". The execution log records it as
  HTTP 500 but does not say how the status code was read; the screenshot shows only the error
  page. It was seen once, on Dev only, and not retried. No case covers the Admin portal PDF,
  and whether AP-1381 covers the PDF at all is the open question Q-003, so no bug was filed.
  If Q-003 is answered "the PDF is in scope", retry it once and check it on Staging before
  any bug is filed.
- **Q-002 (Judgement, open) — old invoices.** The oldest invoice (65, from 2020, before the
  2022-09-19 fix) shows its dealer name once, not twice, on Dev.
- **Q-003 (Judgement, open) — PDF copy.** No evidence: the Dealer portal offers no PDF and
  the Admin portal PDF errors.

---

## Recommendations

1. Move AP-1381 to "Ready for release": both requirements pass on the newest warranty invoice in both portals, with no defect.
2. Ask Eric Lindquist (reporter) to answer Q-003 — does the "name once" rule also cover the PDF copy of the invoice? If yes, extend AP1381_003 to the Admin portal PDF and re-check `/admin/invoice/{id}/pdf` on Staging.
3. Retry the Admin portal "PDF" button once on Staging; if it errors there too, raise it as its own bug, separate from AP-1381.
4. Mark Q-002 Answered on the next analysis pass, quoting Ken Nguyen's 2022-09-15 comment and Eric Lindquist's "ok good to go" (R2 round 2 finding F-3), so it is not asked again.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | PASS | _(automated)_ | 2026-11-01 |
| QA Lead | Vinh Le | Pending | | |
| Development Lead | Not known | Pending | | |
| Product Owner | Eric Lindquist | Pending | | |
