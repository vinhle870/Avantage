# Test Case Review — AP-2471

**Date:** 2026-10-03
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2471_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2471_test-plan.md, qa-artifacts/3-test-cases/AP2471_TestCases_001-005.md, AP2471_TestCases_006-010.md, AP2471_TestCases_011-015.md

**Standing caveat:** Real acceptance criteria were retrieved for REQ-001 to REQ-006. **REQ-007 (Save) and REQ-008 (Delete) have none.** The ticket's criteria end on an empty "Save button" heading, and delete appears only in the user story. AP2471_010–015 therefore test the minimum the user story promises, plus safe-behaviour expectations. A PASS on those cases means the feature behaves sensibly. It does not prove it matches a specification, because none exists for those parts.

The `domain` source has no earning-curve page, and the create-form route is not mapped. The batch handles this honestly: it reaches the form through "Create New" and records the URL, rather than guessing one. That is not a blocker, but the run must write the routes back to `qa-docs` afterwards.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | No case changes the type or the Term month **after** Custom factors have been typed, so the risk "what happens to typed factors" is recorded but never exercised. | REQ-006 risk 3, Q-010 | High | An admin who briefly switches type loses every factor they typed, with no warning. |
| 2 | No case edits the **Term month** of a saved curve, which the analysis flags as an unknown under REQ-007. AP2471_012 changes only the name and type. | REQ-007 risk 2, Q-010 | High | Changing a saved 36-month curve to 24 months could keep 36 stored factors, so the curve totals more than 100%. |
| 3 | Reverse Rule of 78 is checked only at 12 months. The 24- and 60-month checks cover Rule of 78 and Pro-Rata only. | REQ-005 AC 4 | Medium | A Reverse formula with a hard-coded 78 denominator passes every current case and is wrong for every non-12-month curve. |
| 4 | "Is Enabled? = No" is set in AP2471_015 but never checked in the list's "Is Enabled?" column. | REQ-002 AC 3, REQ-003 AC 6 | Low | A disabled curve that shows "Yes" in the list misleads the admin about which curves are live. |
| 5 | The 4-decimal precision rule is checked only on generated values. No case types more than 4 decimals into a Custom factor. | REQ-004 AC 3 | Medium | A value like 33.33333 might be stored at full precision or silently truncated, so totals drift away from 100%. |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every TC's Requirement field cites a REQ ID and AC number that exist in the analysis. AP2471_013 and AP2471_014 correctly cite open questions instead of non-existent criteria.

**Unresolved Open Questions affecting coverage:**
- Q-001 (Save behaviour) is still open. AP2471_010–012 can only check "stored and shown again", not success messages or landing pages.
- Q-002 (Delete in scope?) is still open. AP2471_015 may legitimately end SKIPPED.
- Q-003 (cumulative as running total, or previous + current row) is still open. All cases assume a running total, as the examples show. If the literal reading was intended, AP2471_004–009 would all need new expected values.
- Q-004 (percentage or fraction) is still open. The cases accept either scale.
- Q-005 and Q-006 (field limits and validation) are still open. AP2471_013's expected results are safe-behaviour assumptions, not requirements.
- Q-007 (the wrong row 8 in the ticket's example) is still open. AP2471_006 deliberately uses the formula value, 46.15.
- Q-008 (rounding of the last row) is still open. A ±0.01 tolerance is applied.
- Q-009 (Custom total must be 100%?) is still open. AP2471_014's expected result is a safe-behaviour assumption.
- Q-010 (read-only factors, persistence across type and term changes) is still open. See gaps 1 and 2.
- Q-011 and Q-012 (roles; downstream effect of disabling) are out of scope for this run.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

All the cases below are risk-based. Where they touch save, validation or delete, they depend on open questions and are not confirmed requirements.

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | Typing Custom factors, switching to Pro-Rata and back to Custom: are the typed values kept, discarded, or replaced with Pro-Rata values? | State transition | The admin loses manual work silently, or saves a "Custom" curve that actually holds Pro-Rata values. This closes Pass 1 gap 1. | High |
| 2 | Editing a saved 36-month Custom curve down to 24 months and saving: does the stored curve have 24 factors that total 100%? | State transition | A shortened curve keeps orphan factors or totals more or less than 100%, misstating income on every contract using it. This closes Pass 1 gap 2. | High |
| 3 | Clicking the save button twice quickly on a new curve creates only one curve | Error guessing | A double-submit creates duplicate curves with the same name, and the admin cannot tell which one Earning Sets will use. | Medium |
| 4 | Saving a second curve with a name that already exists is refused or warned about | Equivalence partitioning | Two curves called "Standard 36" become indistinguishable in every dropdown that lists curves. | Medium |
| 5 | Reverse Rule of 78 at 24 months: row 1 = 0.3333, row 24 = 8.0000, cumulative row 12 = 26.00 | Boundary value analysis | A Reverse formula with a hard-coded denominator of 78 is wrong for every term except 12. This closes Pass 1 gap 3. | Medium |
| 6 | Term month `12.5` and `999`: is a non-whole term refused, and does a very large term render without freezing the page? | Equivalence partitioning / Boundary value analysis | A fractional term produces a table whose row count disagrees with its denominator. A huge term can freeze the admin's browser. | Medium |
| 7 | A Custom factor typed with 5 decimals (`33.33333`) is rounded or refused at 4 decimals as the criteria require | Boundary value analysis | Stored precision differs from what is displayed, so the curve's real total quietly drifts from the 100.00 the admin sees. This closes Pass 1 gap 5. | Medium |
| 8 | Two enabled curves with the same Term month and overlapping odometer ranges (0–60000 and 50000–100000) | Decision table | If a downstream rule picks "the" curve by term and mileage, an overlap makes the choice ambiguous. This only matters once Q-006 is answered. | Low |
| 9 | Saving with "Is Enabled?" = No shows "No" in the list, and the record keeps that state on Edit | State transition | A disabled curve that displays or stores as enabled could be used when the admin meant it to be off. This closes Pass 1 gap 4. | Low |
| 10 | Name containing `<script>alert(1)</script>` is shown as plain text in the list and edit form | Security | Script injection (XSS, where text typed into a field runs as code in another admin's browser) through an admin-entered name. | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| Decision table | Work through every combination of two or more settings that interact, so no combination is left untried. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |

> 2 additional lower-priority candidates were not listed: a check of datagrid sorting and paging (no requirement exists), and a cross-entity check that a disabled curve is hidden from Earning Sets (outside this ticket, Q-012).

---

## Recommendation

The 15 designed cases are ready to execute as they stand. They cover every written acceptance criterion for the menu, list, form, table generation and all three predefined calculations. The calculations are checked against an independent oracle (a set of expected values computed separately from the formulas) rather than the ticket's flawed example table. Both halves of the reported Custom defect are re-tested directly.

The two **High** Pass 2 items, #1 (switching type after typing Custom factors) and #2 (shortening a saved curve's term), cover the biggest blind spot. Both are places where an admin's data could be silently lost or a curve could stop totalling 100%. If you want them executed in this run, promote those two before execution. Items #3–#10 can wait for the backlog, or for the answers to Q-001, Q-005, Q-006 and Q-009.
