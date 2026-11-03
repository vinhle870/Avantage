# Bug Report

**Project:** Avantage Plus v2 — Admin portal, AP-2476: Make Earning Assignment Parameter fields optional
**Report ID:** BR-20261011-001
**Test Cycle:** AP-2476 single-ticket STLC run, run folder 5.2.0 — 10 test cases executed on v2staging on 2026-10-11 (10 PASS, 0 FAIL, 0 BLOCKED)
**Date:** 2026-10-11
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2476_2026-10-11.md · qa-artifacts/3-test-cases/AP2476_TestCases_*.md

| Metric | Value |
|---|:---:|
| Total defects | 0 |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Tracker tickets created | 0 |

**Gate C decisions:** Not reached. No test case failed or was blocked, so there was nothing to file, link or dismiss.

**Observed but not filed** (outside AP-2476's acceptance criteria, recorded for the product owner):
- The parameter dialog now has **13 fields, not 11**: two new optional boxes, "Start date from" and "Start date To", and a matching "Start date" column in the parameter list. They show no "All" hint while empty. They appear to come from another ticket, which this run did not test.
- **Coverage Code is now a multi-select** with a search box and Select All / Deselect All. Its button reads "All" when nothing is ticked, but the list has no "All" item. The field id changed from `earning_assignment_parameter_coverageCode` to `…_coverageCodes`, so automation that uses the old id will break.
- Parameters saved before the change, such as the seeded "AV+" rule, keep odometer-to **9999999**. New rules default to **999999**, as the ticket asks.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| — | — | No defects found in this cycle | — | — | — | — |

---

## Bug Details

None. All ten test cases passed. Evidence is in the execution log above and in
`qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/` (15 screenshots).

---

## Previously filed bugs touching this area

| Ticket | Title | Relevance to this run |
|---|---|---|
| [AP-2484](https://garantieavantageplus.atlassian.net/browse/AP-2484) | The earning assignment details page returns HTTP 500 once an assignment has 11 parameters | Avoided by design: the fixture assignment #15 held only 6 parameters. Not re-tested and not linked to this run. |
