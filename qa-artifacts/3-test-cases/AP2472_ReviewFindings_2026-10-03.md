# Test Case Review — AP-2472

**Date:** 2026-10-03
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2472_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2472_test-plan.md, qa-artifacts/3-test-cases/AP2472_TestCases_001-005.md, AP2472_TestCases_006-010.md, AP2472_TestCases_011-015.md, AP2472_TestCases_016-016.md

The real acceptance criteria were retrieved from the ticket (`customfield_10150`), so this is a full-coverage review, not a smoke-check review. All 8 requirements and every written acceptance criterion trace to at least one of the 16 test cases.

One knowledge gap applies to every batch. The Earning Groups route is not in `navigation` or `domain`. The designer handled it correctly: the Execution Context says the route is unknown, the cases navigate through the sidebar, and AP2472_001 records the URL. This is not a blocker, so the empty Known blockers tables are correct.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | No case checks which curves the "Earning Curve" select offers, in particular whether a **disabled** curve can be assigned. | REQ-005 risk, Q-005 | Medium | An admin could put a disabled curve into a group, and nobody would know whether the group then earns on a curve that was meant to be switched off. |
| 2 | The empty state of the Earning Groups list itself is only recorded "if the list is empty" (AP2472_002 step 4). On staging the list is unlikely to be empty, so this will not be observed. | REQ-002 risk | Low | Nothing important. The analysis rated this an observation only. |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every TC cites a REQ and AC number present in the analysis.

**Unresolved Open Questions affecting coverage:**
- Q-001 (name required / unique / length): AP2472_005, 006 and 007 run, but 006 and 007 can only record what happens. Only a blank name has a reasonable pass/fail expectation.
- Q-002 (Is Enabled? source and default): AP2472_004 and 016 record the value and whether Edit offers it. No case can pass or fail on it.
- Q-003 (does unassign delete the curve): AP2472_015 resolves this by observation. It is the most valuable case in the set.
- Q-004 (duplicate assignment): AP2472_012 judges a duplicate row as FAIL. That is an assumption about intent, and the case says so.
- Q-005 (select contents): no case. See Pass 1 #1 and Pass 2 #1.
- Q-006 (what Edit opens): AP2472_016 tests the minimum only.
- Q-007 to Q-010: outside what this run can verify. They are recorded in the analysis.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

These cases come from risk-based design, not from confirmed acceptance criteria.

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | A disabled earning curve is either missing from the "Earning Curve" select or refused when assigned | Equivalence partitioning | A curve the admin switched off could still end up driving a group's earnings, so contracts earn on a pattern that was retired. Medium because the ticket does not say disabled curves are excluded. | Medium |
| 2 | A name made only of spaces is refused like a blank name | Boundary value analysis | A group whose name looks empty in every list cannot be told apart from others. Medium because the blank-name case (AP2472_005) may pass while whitespace slips through, which is a common gap. | Medium |
| 3 | Double-clicking the Create New submit button creates only one group | Error guessing | A slow server plus an impatient admin produces two identical groups, which then have to be told apart and cleaned up by hand. Medium because there is no delete action to fix it. | Medium |
| 4 | Double-clicking the assign submit button adds the curve only once | Error guessing | Same root cause as #3, but it produces a duplicate curve row inside one group, which AP2472_012 only tests through the select. | Medium |
| 5 | A change to a curve's odometer range in Earning Curves shows up in every group that holds it | Cross-entity | If the group grid keeps a stale copy of the curve's values, admins check the group against old numbers. Medium because AP-2471's edit flow is itself under test. | Medium |
| 6 | Opening a group's details URL after logging out redirects to the admin login | Security | An unauthenticated visitor could read or change earning groups. Low because the rest of the admin portal already enforces login (seen in earlier runs). | Low |
| 7 | Unassigning the last curve leaves the group with an empty grid and an empty "Earning curves" cell in the list | State transition | The list could keep showing a curve that is no longer in the group, misleading the admin. Low because AP2472_015 already checks the list after an unassign. | Low |
| 8 | Opening a details URL for a group id that does not exist shows a not-found page, not a server error | Error guessing | A server error page on a bad link exposes internal details and looks broken. Low because it is cosmetic for an admin-only screen. | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |
| Cross-entity | Check that what this feature produces is read correctly by the next feature in the workflow. |

---

## Recommendation

The 16 test cases are ready to execute as they stand. They cover every written acceptance criterion, and AP2472_015 directly tests the highest-impact risk: whether unassigning destroys a shared curve. None of the proposed cases is High priority. The most useful to promote later are #1 (disabled curve in the select), #2 (whitespace-only name) and #3 (double-submit on create). Each takes under a minute, and the executor may note their outcome as observations alongside AP2472_005 and AP2472_009 without changing the test-case files.
