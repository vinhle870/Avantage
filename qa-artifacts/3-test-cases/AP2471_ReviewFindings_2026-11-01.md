# Test Case Review — AP-2471

**Date:** 2026-11-01
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2471_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2471_test-plan.md, qa-artifacts/3-test-cases/AP2471_TestCases_001-005.md, AP2471_TestCases_006-010.md, AP2471_TestCases_011-015.md; knowledge sources `domain` (`qa-docs/earning-curves.md`) and `navigation` (`base-test/navigation-map.md`)

**Standing caveat:** Real acceptance criteria exist for REQ-001 to REQ-006. **REQ-007 (Save) and REQ-008 (Delete) still have none**, and their Blocking questions Q-001 and Q-002 are unanswered (asked again in AP-2471 comment 19435). AP2471_010–012 therefore prove only what the user story promises — a curve is stored, listed and shown again — and record the save message. AP2471_015 is BLOCKED. A green run cannot sign off Save or Delete, and the story cannot be released while those two questions are open.

This review replaces the one of 2026-10-03. Since then the `domain` source gained an earning-curve page (mapped 2026-10-04), so the routes, the Save button and the factor inputs are now verified facts rather than guesses. The test cases were revised on 2026-11-01: the two validation cases became record-only, the delete case became BLOCKED, and every factor check accepts either scale.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

Every acceptance criterion of REQ-001 to REQ-006 has at least one test case, and REQ-007 and REQ-008 each have one (REQ-008's is BLOCKED). The gaps below are partial: risks the analysis names, or oracle rows the test plan defines, that no case exercises.

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | No case changes the type **after** Custom factors have been typed, so the analysis risk "what happens to typed factors when the type changes" is recorded but never exercised. | REQ-006 risk 3 (Q-010, Judgement) | High | An admin who briefly switches type loses every factor they typed with no warning, or saves a "Custom" curve that silently holds another type's values. |
| 2 | No case edits the **Term month** of a saved curve. AP2471_012 changes only the name and type. | REQ-007 risk 2 (Q-010, Judgement) | High | Shortening a saved curve could keep the old rows' factors, so the stored curve has more factors than months or no longer totals what it showed. |
| 3 | The test plan's 24-month Reverse Rule of 78 oracle rows (§8.1) are never used. Reverse is checked only at 12 months. | Test plan §8.1 (24-month Reverse rows) | Medium | A Reverse formula with a hard-coded denominator of 78 passes every current case and is wrong for every term except 12. |
| 4 | "Is Enabled? = No" is never shown in the list. The only case that saves a disabled curve, AP2471_015, is BLOCKED. | Test plan §8 (enabled state); REQ-002 AC 3 and REQ-003 AC 6 are covered for "Yes" only | Low | A disabled curve that shows "Yes" in the list misleads the admin about which curves are live. |
| 5 | The 4-decimal rule is checked only on generated values. No case types more than 4 decimals into a Custom factor. | Test plan §3.2 (edge-case precision); REQ-004 AC 3 is covered by AP2471_003 for generated values | Medium | A value like 0.333333 might be stored at full precision or cut short, so totals drift away from 100%. |

**Guessed answers in expected results:** none found. The 2026-10-03 versions of AP2471_013 and AP2471_014 asserted that bad input must be refused — an answer to Judgement questions Q-005, Q-006 and Q-009 that nobody has given. The 2026-11-01 revision made both record-only, so this is closed.

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every case's Requirement row cites a REQ and AC that exist in the analysis, or a question ID from its Open Questions table.

**Unresolved Open Questions affecting coverage:**
- Q-001 (Blocking) — Save behaviour. AP2471_010–012 record the message and landing page; they cannot judge them.
- Q-002 (Blocking) — Delete in scope. AP2471_015 is BLOCKED.
- Q-004 (Judgement) — percentage or fraction. Every factor case records the scale and accepts either.
- Q-005, Q-006 (Judgement) — field limits and validation. AP2471_013 records the outcomes.
- Q-008 (Judgement) — how the last row reaches 100%. AP2471_004 and AP2471_007 record the exact value.
- Q-009 (Judgement) — Custom total and negative factors. AP2471_014 records the outcomes.
- Q-010 (Judgement) — read-only factors and what happens on type or term changes. AP2471_003 and AP2471_009 record part of it; see gaps 1 and 2.
- Q-011, Q-012 (Info) — roles and the downstream effect of disabling. No case depends on them.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

Rows that touch save, validation or delete depend on open questions. They are what a senior tester would test, not confirmed requirements, and any promoted case must keep the open part record-only.

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | Typing Custom factors, switching to Pro-Rata and back to Custom, then saving: what is kept, and does the stored curve match what was shown? | State transition (checking the system ends in the right state after each change) | The admin loses manual work silently, or saves a "Custom" curve that actually holds Pro-Rata values. Closes Pass 1 gap 1. High because it can corrupt the income schedule of every contract on the curve. | High |
| 2 | Editing a saved 4-month Custom curve down to 3 months and saving: does the stored curve have exactly 3 factors, matching what the form showed? | State transition | A shortened curve keeps orphan factors or totals differently from what the admin saw. Closes Pass 1 gap 2. High for the same reason as #1. | High |
| 3 | Reverse Rule of 78 at 24 months: row 1 = 0.3333%, row 12 cumulative = 26.00%, row 24 = 8.0000% | Boundary value analysis (testing the exact edges of an allowed range, where off-by-one mistakes hide) | A hard-coded 78 denominator in the Reverse formula. Closes Pass 1 gap 3. Medium: one type, one wrong denominator. | Medium |
| 4 | A Custom factor typed with 6 decimals (`0.333333`) is shown, stored and reopened at 4 decimals | Boundary value analysis | Stored precision differs from what is displayed, so the curve's real total drifts from the total the admin sees. Closes Pass 1 gap 5. | Medium |
| 5 | Clicking **Save** twice quickly on a new curve creates only one curve | Error guessing (deliberately trying what commonly breaks software) | A double-submit creates two curves with the same name, and the admin cannot tell which one Earning Groups will use. | Medium |
| 6 | Saving a second curve with a name that already exists is refused or warned about | Equivalence partitioning (testing one value from each group of inputs that should behave alike) | Two curves called "Standard 36" become indistinguishable in every dropdown that lists curves. No rule exists, so the outcome would be record-only. | Medium |
| 7 | Term month `12.5` and `999`: a fractional term is refused or rounded, and a very large term draws without freezing the page | Equivalence partitioning / Boundary value analysis | A fractional term gives a table whose row count disagrees with its denominator; a huge term freezes the admin's browser. Q-005 is open, so record-only. | Medium |
| 8 | Saving with "Is Enabled?" unticked shows "No" in the list and keeps that state on Edit | State transition | A disabled curve that displays or stores as enabled could be used when the admin meant it to be off. Closes Pass 1 gap 4. | Low |
| 9 | Two enabled curves with the same Term month and overlapping odometer ranges (0–60000 and 50000–100000) | Decision table (working through every combination of settings that interact) | If a downstream rule picks "the" curve by term and mileage, an overlap makes the choice ambiguous. Only matters once Q-006 is answered. | Low |
| 10 | A Name containing `<script>alert(1)</script>` is shown as plain text in the list and the edit form | Security (trying to make the application do something it should not) | Script injection (XSS, where text typed into a field runs as code in another admin's browser) through an admin-entered name. | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| Decision table | Work through every combination of two or more settings that interact, so no combination is left untried. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |

> 2 lower-priority candidates were not listed: datagrid sorting and paging (no requirement exists; the list pages at 10 rows), and a cross-entity check that a disabled curve is hidden from Earning Groups (outside this ticket, Q-012).

---

## Recommendation

The 15 revised cases can be executed as they stand. They cover every written acceptance criterion for the menu, list, form, table generation and all three predefined calculations, against an oracle computed from the formulas rather than the ticket's flawed example table. No expected result now asserts an answer nobody has given.

The two **High** proposals, #1 (switching type after typing Custom factors) and #2 (shortening a saved curve's term), cover the biggest blind spot: places where an admin's data could be silently lost or a stored curve could differ from what the screen showed. Gate B rule B2 promotes exactly those two. Items #3–#10 can wait for the backlog, or for the answers to Q-001, Q-005, Q-006 and Q-009.
