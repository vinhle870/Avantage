# Test Case Review — AP-2475

**Date:** 2026-10-04
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2475_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2475_test-plan.md, qa-artifacts/3-test-cases/AP2475_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2475_TestCases_006-010.md. Knowledge: `domain` → qa-docs/risk-management.md, qa-docs/earning-groups.md; `navigation` → base-test/navigation-map.md.

**Standing caveat:** The ticket has real acceptance criteria for the pencil icon (REQ-001) and for the dialog opening (REQ-002), but none for saving (REQ-003). REQ-003's cases test the user-story minimum agreed at Gate A: the same row changes and nothing else does. They cannot confirm a success message, a landing page or any validation rule, because none is specified.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | No case checks the pencil on a parameter of an assignment whose "Is Enabled?" is **No**. Every case uses an enabled assignment. | REQ-001 risk "every row gets a pencil"; Q-005 | Low | If the pencil is hidden or broken on disabled assignments, an admin cannot correct a rule before re-enabling it. Low because a disabled assignment presumably does not apply to contracts. |
| 2 | The test plan's negative strategy says "a range entered backwards", but only the **odometer** range is tested. Sale dates and model-year age backwards are not. | Test plan §3.2 Negative; Q-006 | Low | A sale-date range that ends before it starts would make the parameter match no contract, silently. Low because the odometer case already shows whether any range validation exists; the other two would most likely behave the same way. |

**Orphan references:** None. Every test case cites REQ-001, REQ-002 or REQ-003, and all three exist in the analysis.

**Unresolved Open Questions affecting coverage:**
- Q-001 (pre-filling) — still open. AP2475_002 and AP2475_004 *assume* pre-filling. If the author says the dialog should open blank, both expectations change.
- Q-002 (same fields as Add) — still open. AP2475_002 records missing or extra fields, but cannot judge whether a field is meant to be locked after creation.
- Q-003 (Save behaviour) — still open. AP2475_003 records the message and landing page without judging them.
- Q-004 (close without saving) — still open. AP2475_008 records whichever way out exists.
- Q-005 (pencil on every row) — still open. See gap 1.
- Q-006 (validation rules) — still open. AP2475_006 and AP2475_010 pass on either outcome. Only AP2475_007 has a firm expectation, because AP-2474 calls the odometer field "numeric".
- Q-007 (odometer default 9999999 vs 999999) — still open. Out of scope for this ticket. It affects AP-2474 and AP-2476, not editing.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

These are risk-based proposals, not confirmed requirements. REQ-003 has no acceptance criteria for validation, so items 2–5 would record behaviour for Q-006 rather than fail it, unless the application crashes or loses data.

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | Double-clicking Save in the edit dialog updates the row once and does not add a second row | Error guessing | A double submit could save the edit as a new parameter on top of the update, leaving a duplicate rule that matches the same contracts. Medium: it is a common slip, and the sibling forms post a full page, which makes a double submit possible. | Medium |
| 2 | Editing Model Year Age from to `-1` (the documented AP-2474 default) saves and shows `-1`, not `1` or `0` | Boundary value analysis | If the edit form strips the minus sign or rejects negatives, an admin can no longer restore the default "any age including next year's models" range. Contracts on brand-new model-year vehicles would stop matching. Medium: the value is documented, so losing it is a real regression. | Medium |
| 3 | Editing Coverage odometer to `9999999` (the documented AP-2474 default, 7 digits) saves without truncation | Boundary value analysis | A column or field length shorter than 7 digits would silently cut the upper bound, so high-mileage contracts fall outside every rule. Medium for the same reason as item 2. | Medium |
| 4 | After the edit is refused with a validation error, correcting the value and saving returns to the **same** assignment's details page and updates the row | State transition | On the sibling Earning Set form, an error moves the user to a standalone page. If the redirect target is lost there, the corrected save lands on the wrong page or creates a new parameter. Medium: only reachable once some validation exists, which AP2475_007 will show. | Medium |
| 5 | Editing Sale Date to an earlier day than Sale Date from (2026-12-31 → 2026-01-01 reversed) does not crash and is recorded | Error guessing | It closes Pass 1 gap 2: a backwards date range makes the parameter match nothing, with no warning. Low: AP2475_006 already shows whether range validation exists at all. | Low |
| 6 | The pencil appears and works on a parameter of a disabled assignment ("Is Enabled?" = No) | Equivalence partitioning (enabled vs disabled assignments are two classes that may be rendered differently) | It closes Pass 1 gap 1. If the icon is tied to the enabled flag, an admin cannot fix rules while an assignment is switched off. Low: it needs a second assignment and the AP-2474 Edit flow to switch it off. | Low |
| 7 | Two browser tabs edit the same parameter; the second save does not silently undo the first without notice | Error guessing | Two admins correcting the same rule could each believe their change stuck. Low: there is one shared admin account on staging, and the ticket says nothing about concurrent edits. | Low |
| 8 | The Earning Group select in the edit dialog lists the earning groups created by AP-2472 (for example `QA-AP2472-…`), not only AV+ | Cross-entity (checking that what one feature produces is read correctly by the next one) | If the dialog's option list is cached or filtered differently from the Add form, an admin cannot re-point a parameter at a new group. Low: AP2475_003 already changes the group to "any option other than AV+", which proves at least one other option exists. | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Cross-entity | Check that what this feature produces is read correctly by the next feature in the workflow. |

> No further candidates were dropped. Text-field cases (special characters, very long values) do not apply: the parameter form has no free-text field.

---

## Recommendation

The current 10 cases are ready to execute as they stand. They cover every acceptance criterion in the ticket. They also cover the three risks the analysis rated High: pre-filling (AP2475_002, 004), saving to the same row (AP2475_003, 005), and validation without a crash (AP2475_006, 007, 010). None of the 8 proposals is High priority. The two worth promoting first, if the QA wants more depth, are **item 2 (Model Year Age `-1`)** and **item 3 (odometer `9999999`)**. They test values AP-2474 explicitly documents, so a failure there would be a firm defect rather than an open question. Item 1 (double-click Save) is the next most likely to find a real defect. Items 5–8 can wait for the product owner's answer to Q-005 and Q-006.
