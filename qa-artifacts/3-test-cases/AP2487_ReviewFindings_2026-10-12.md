# Test Case Review — AP-2487

**Date:** 2026-10-12
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2487_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2487_test-plan.md, qa-artifacts/3-test-cases/AP2487_TestCases_001-005.md, AP2487_TestCases_006-010.md, AP2487_TestCases_011-012.md

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

All three requirements and every acceptance criterion trace to at least one test case. REQ-001
has 7 cases, REQ-002 has 5 and REQ-003 has 5. The ticket's acceptance criteria were retrieved in
full, so this is real coverage, not a smoke check. Three small gaps remain:

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | The field order "after Sale Date to" is checked on the **Add** form only (AP2487_001). The criterion says "add/edit form", and the Edit dialog is a separate view. | REQ-001 AC 2 | Low | If the Edit dialog places the fields elsewhere, admins see a different layout when editing — confusing, though no data is lost. AP2487_003 opens the Edit dialog and can note the order at no extra cost. |
| 2 | The test plan lists a same-day range (`2026-06-15` in both boxes) as boundary data, but no case uses it. | Test plan §8 | Low | A one-day range refused as "from must be before to" would block a valid rule for warranties starting on a single date. |
| 3 | The test plan's regression line "Sale Date from/to still behave as before" has no explicit step. AP2487_002 checks Sale Date shows "All" when empty, but no case fills Sale Date alongside the start dates. | Test plan §1 obj. 5 | Medium | The new fields share a date picker and sit next to Sale Date; a mix-up (start dates saved into Sale Date or the other way round) would only show when both are filled. |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every cited REQ and Q ID exists in the analysis.

**Unresolved Open Questions affecting coverage:**
- Q-001 — still open; the effect of the start date range and of several codes on the earning calculation is out of scope and cannot be verified by any case here.
- Q-002 — still open; AP2487_006 records the reversed-range outcome but cannot judge a silent save.
- Q-003 — still open; AP2487_004 and AP2487_011 record whether an empty Start date cell is blank or "All".
- Q-004 — still open; AP2487_008 records how several codes are listed.
- Q-005 — still open; AP2487_012 records how "Select All" is shown.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | Editing only Lag Interval on a parameter that has start dates and two coverage codes keeps the dates and both codes | State transition | A save that rebuilds the parameter from defaults would wipe the range and codes whenever an admin changes something unrelated, silently widening the rule. | Medium |
| 2 | When a required field is left blank, the standalone error page keeps the start dates and the ticked coverage codes | Error guessing | The form already moves to a standalone page on a blank required field (AP-2475 notes). If the multi-select loses its ticks there, an admin who fixes the blank and resubmits saves a rule for "All" codes without noticing. | Medium |
| 3 | A parameter with Sale Date and Start date both filled with different ranges stores each in its own column | Equivalence partitioning | Covers Pass 1 gap 3: two neighbouring date fields mixed up in the form binding would only show when both are filled. | Medium |
| 4 | Ticking a code after filtering the Coverage Code list with the search box keeps the codes ticked before the search | Error guessing | Some multi-select widgets reset hidden options on search; the admin would save fewer codes than they chose. | Medium |
| 5 | A one-day range (same date in Start date from and To) saves and is listed | Boundary value analysis | Covers Pass 1 gap 2: an over-strict "from must be before to" check would refuse a valid single-day rule. | Low |
| 6 | Choosing a start date by clicking it in the date picker stores the same value as typing it | Equivalence partitioning | If the picker writes a different format (for example `10/12/2026`), the server may refuse it or read day and month the wrong way round. | Low |
| 7 | Rows saved before AP-2487 (AP-2476 fixture #15) show an empty Start date cell, not a made-up date | State transition | Old rows with no value in the new column could display `1970-01-01` or today, misleading admins about rules nobody restricted. | Low |
| 8 | "Deselect All" after ticking codes returns the button to "All" and saves the parameter with no code | State transition | If "Deselect All" leaves a hidden code selected, the rule is narrower than it looks. | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |

> 2 additional lower-priority candidates not listed: a leap-day date (`2028-02-29`), and two admins editing the same parameter at once (no locking exists on any admin form so far, so the result is predictable).

---

## Recommendation

The 12 test cases are ready for execution as they stand. They cover every acceptance criterion,
including the edit path, open-ended and reversed ranges, several codes, and the pre-change
single-code row. No proposed case is High priority. If the user wants the strongest set before
execution, promote Pass 2 items **1** (editing an unrelated field keeps dates and codes) and
**2** (the standalone error page keeps the ticked codes). Both guard against the rule silently
widening to "All", which is the most expensive way this feature could fail.
