# Bug Report

**Project:** Avantage Plus v2 — Admin portal, Risk Management (AP-2473: Earning Sets)
**Report ID:** BR-20261003-002
**Test Cycle:** AP-2473 Earning Sets — run folder 5.2.0, executed 2026-10-03 on v2staging
**Date:** 2026-10-03
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2473_2026-10-03.md · qa-artifacts/3-test-cases/AP2473_TestCases_001-005.md · qa-artifacts/3-test-cases/AP2473_TestCases_006-010.md

| Metric | Value |
|---|:---:|
| Total defects | 0 |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Tracker tickets created | 0 |

Execution produced **10 results: 9 PASS, 1 FAIL, 0 BLOCKED** on 2026-10-03. The single FAIL (AP2473_006) was reviewed at Gate C, and the QA decided it is **not a bug**. On 2026-10-04 the test case was revised to expect duplicates and re-judged **PASS**, so the run now stands at **10 PASS, 0 FAIL**. No tracker ticket was created.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| — | — | No defects filed | — | — | — | — |

---

## Bug Details

None. No FAIL was classified as a defect.

---

## Dismissed at Gate C — not a bug

### AP2473_006 — A second earning set with the same description as an existing one is saved without error

| Field | Value |
|---|---|
| **Test Case** | AP2473_006 |
| **Requirement** | REQ-003 / REQ-004 — Description validation (open question Q-004) |
| **Decision** | Not a bug — decided by the QA (Vinh Le) at Gate C, 2026-10-03. Test case revised to expect duplicates and re-judged PASS on 2026-10-04 |
| **Reason** | Duplicate descriptions are intended behaviour, as the QA confirmed. The ticket sets no uniqueness rule for the Description field, so accepting a duplicate does not break any acceptance criterion. |
| **Environment** | Chromium (Playwright) · Windows 11 · v2staging, admin portal, 1280 × 800 |
| **Reproducibility** | Always (1/1 attempts, still two rows after a reload) |

**What was observed:**
An admin opened `/admin/earning-set`, clicked "Create New", saved the description `QA-AP2473-D-190013`, then clicked "Create New" again and saved exactly the same description. The second save showed the normal green "Earning set saved" message, with no warning. The grid then listed two rows reading `QA-AP2473-D-190013` (IDs 6 and 7), and both were still there after a reload.

**Side effect to remember:**
The two copies also appear as two identical options (values 6 and 7) in the "Earning Set" dropdown on the Earning Assignment create form.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_006-step2-DuplicateSavedNoError_fail.png` |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_006-step3-TwoDuplicateRowsAfterReload_fail.png` |
| Console log | None captured. The Earning Sets pages logged no errors. |

---

## Observations (not test failures)

These were seen during execution. None fails an acceptance criterion, so none was filed. They are listed for the product owner.

| # | Observation | Related question |
|---|---|---|
| 1 | A 255-character description with no spaces widens the Description column to about 1,970 px. Every row's "Edit" button is pushed out of view behind a horizontal scrollbar. | Q-004 (length) |
| 2 | The description has no length limit. A 256-character value was accepted and stored in full. | Q-004 |
| 3 | The create/edit dialog has no "Cancel" or close button. The only way out without saving is the browser's Back button. | Q-003 |
| 4 | When a blank description is refused, the error "This value should not be blank." appears on the standalone page `/admin/earning-set/new/edit` rather than inside the dialog. | Q-003, Q-008 |

---

## Ticket Update Log

| Date | Action | Reference |
|---|---|---|
| 2026-10-03 | Duplicate search in Jira (`type = Bug AND statusCategory != Done AND text ~ "earning"`) | No open bugs found |
| 2026-10-03 | Gate C: AP2473_006 → Not a bug | No ticket created |
| 2026-10-04 | AP2473_006 test case revised (duplicates allowed) and re-judged PASS | No ticket created |
