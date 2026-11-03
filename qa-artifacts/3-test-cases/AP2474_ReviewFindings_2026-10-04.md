# Test Case Review — AP2474

**Date:** 2026-10-04
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2474_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2474_test-plan.md, qa-artifacts/3-test-cases/AP2474_TestCases_001-005.md, AP2474_TestCases_006-010.md, AP2474_TestCases_011-015.md

The ticket's real acceptance criteria were retrieved (from `customfield_10150`), so this review checks the 15 cases against confirmed criteria, not placeholders. The `domain` and `navigation` sources are bound and active; the Execution Context of all three files is filled and their Known blockers tables are correctly empty. The one unmapped area — the details page, Edit and Add Parameter forms — is called out as "never opened" in each Execution Context, which is the honest state.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

Every requirement (REQ-001 to REQ-007) and every stated acceptance criterion traces to at least one case. The gaps below are risks the analysis named but no case exercises.

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | Overlapping parameters on one assignment are named as a risk but never tried. | REQ-006 risk, Q-011 | Medium | Two parameters matching the same contracts with different earning groups could be saved silently, leaving it ambiguous which earning rule applies to a dealer's contracts. |
| 2 | Description length and special characters (accents, HTML) are named in the analysis but not tested; only blank is. | REQ-003 risk, Q-001 | Low | A long or accented description could be cut off or shown as raw markup in the list and the details title. The sibling screens handled both safely, so the risk is low. |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every case cites a REQ that exists in the analysis.

**Unresolved Open Questions affecting coverage:**
- Q-001, Q-002, Q-006 — validation rules. AP2474_005, 006, 007, 012 and 013 are written to record the behaviour and fail only on harmful outcomes, so they cannot prove the intended rule; they can only report what the build does.
- Q-004 — Edit. AP2474_008 tests only the minimum implied by the word "Edit".
- Q-003, Q-005, Q-008, Q-009 — dropdown semantics and defaults. AP2474_003 and 009 record them rather than assert them.
- Q-011 — overlapping parameters. No case (see gap 1).

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

These are what a senior tester would add, not confirmed requirements.

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | Adding a second parameter identical to an existing one on the same assignment is refused or recorded | Error guessing | Duplicate or overlapping rules saved silently would make the earning group for those contracts ambiguous, and nobody would notice until earnings were reported wrongly. | Medium |
| 2 | A parameter with only "Sale Date from" filled and "Sale Date to" left blank is refused or shown as an open range | Decision table | A half-empty date range could be stored as a range that matches nothing, or crash the page, silently removing a dealer group's earning rule. | Medium |
| 3 | A parameter added to one assignment does not appear on another assignment's details page | Cross-entity | If parameters leaked between assignments, editing one dealer group's rules would change another's. | Medium |
| 4 | Clicking "Submit" twice quickly on Add Parameter creates only one row | Error guessing | Double-submits creating duplicate parameters would fill the grid with copies an admin then has to remove one by one. | Medium |
| 5 | Editing an assignment and clearing its description is refused | Equivalence partitioning | Edit may skip the validation that Create applies, letting an admin blank out an existing assignment's name so it cannot be found again. | Medium |
| 6 | A description of 255 characters, and one with accents and HTML (`É & <b>x</b>`), save and display exactly | Boundary value analysis | A long or special-character description could be truncated or rendered as markup in the details title. | Low |
| 7 | Model Year Age values just outside the defaults (-2 and 100) and an odometer of 10,000,000 save or are refused cleanly | Boundary value analysis | Values past the stated defaults could overflow storage and return an error page, or be silently clamped to a different value. | Low |
| 8 | Each Condition (New, Used) and each Lag Interval (0, 6, 12) saves and displays as chosen | Equivalence partitioning | A mapping slip (for example 6 stored as 12) would apply the wrong lag to every contract. Partly covered: 010/011/014 together use New, Used, 0, 6 and 12. | Low |
| 9 | A disabled earning group or set still appears (or not) in the dropdowns, and the result is recorded | Cross-entity | An admin could attach a disabled earning group to a live parameter without warning. | Low |
| 10 | Opening the unassign URL of a parameter directly, without the confirmation form, does not remove it | Security | A GET request or a crafted link removing a parameter would bypass the confirmation that protects live rules. | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| Decision table | Work through every combination of two or more settings that interact, so no combination is left untried. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |
| Cross-entity | Check that what this feature produces is read correctly by the next feature in the workflow. |

> 3 additional lower-priority candidates not listed (Escape/back without saving on each modal; paging of the parameter grid past 10 rows; date-picker keyboard entry), because they repeat behaviour the sibling screens already showed to be safe.

---

## Recommendation

The 15 cases are ready to execute as they stand. Every stated acceptance criterion is covered, including the four default values and both option lists, and the negative cases are written so that undefined validation is recorded rather than wrongly failed. None of the proposed cases is High priority. If the QA wants more depth before execution, the three most valuable additions are **#1 (identical/overlapping parameter)**, **#2 (half-empty sale-date range)** and **#3 (parameters isolated between assignments)**, because each could silently change which earning rule applies to a dealer group's contracts.
