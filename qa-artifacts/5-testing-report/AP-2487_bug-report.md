# Bug Report

**Project:** Avantage Plus v2 — Admin portal, AP-2487: Earning assignments parameter — warranty start date range and multiple Coverage Codes
**Report ID:** BR-20261012-001
**Test Cycle:** AP-2487 single-ticket STLC run, run folder 5.2.0 — 12 test cases executed on v2staging on 2026-10-12 (12 PASS, 0 FAIL, 0 BLOCKED)
**Date:** 2026-10-12
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2487_2026-10-12.md · qa-artifacts/3-test-cases/AP2487_TestCases_*.md

| Metric | Value |
|---|:---:|
| Total defects | 0 |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Tracker tickets created | 0 |

**Gate C decisions:** Not reached. No test case failed or was blocked, so there was nothing to file, link or dismiss.

**Observed but not filed.** The ticket does not settle these points, so they are recorded for the product owner rather than filed as bugs:
- **Reversed start date range (Q-002).** A "Start date from" later than "Start date To" (2026-12-31 / 2026-01-01) is saved without any warning and listed exactly as entered. Such a rule can never match a contract. The odometer range on the same form behaves the same way.
- **Empty Start date display (Q-003).** An empty Start date cell in the parameter list is **blank**, while every other empty optional field shows "All". A half range shows only the filled side (`2026-04-01 -`), whereas Sale Date shows `2026-04-01 - All`. The Start date boxes also have no "All" hint, unlike the Sale Date boxes. This is a display inconsistency only; no data is affected.
- **Several codes in the list (Q-004).** Each selected code is listed on its own line with its full "CODE - Name" label.
- **Select All (Q-005).** "Select All" stores all 57 codes one by one. The list then shows all 57 lines (a row about 1,560 px tall), not "All", and the closed button shows a comma list cut off with "...". It is not stated whether "every code" should mean the same as "All".
- **Date picker overlap.** After a date is typed, the picker stays open and covers the **Submit** button until the admin clicks elsewhere in the dialog.
- **Repeated coverage code labels.** "AVR - AVR" appears twice in the Coverage Code list, and "1 - AVLX" and "1 - SEGAVL" share the code "1". This is reference data, not part of AP-2487.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| — | — | No defects found in this cycle | — | — | — | — |

---

## Bug Details

None. All twelve test cases passed. Evidence is in the execution log above and in
`qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/` (18 screenshots).

---

## Previously filed bugs touching this area

| Ticket | Title | Relevance to this run |
|---|---|---|
| [AP-2484](https://garantieavantageplus.atlassian.net/browse/AP-2484) | The earning assignment details page returns HTTP 500 once an assignment has 11 parameters | Avoided by design: fixture assignment #16 was stopped at 9 parameters and a second assignment (#17) was created. Not re-tested and not linked to this run. |
