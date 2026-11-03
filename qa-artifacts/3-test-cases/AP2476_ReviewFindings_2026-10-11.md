# Test Case Review — AP2476

**Date:** 2026-10-11
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2476_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2476_test-plan.md, qa-artifacts/3-test-cases/AP2476_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2476_TestCases_006-010.md

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

The ticket has real acceptance criteria and all four requirements trace to at least one
functional test. The ten cases go beyond a smoke check: they save rows and read them back
after a reload. Two small gaps remain.

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | Only "Sale Date from" is tested on its own; "Sale Date to" alone (no start date) is not. | REQ-001 risk "only one of the two sale dates", Q-005 | Low | A rule "every sale up to 2026-12-31" could be refused or lose its date while the mirror case passes. |
| 2 | The test plan's regression list names "fields outside the ticket behave as before"; Model Year Age is covered (AP2476_007) but Lag Interval is not. Lag Interval has no empty choice and defaults to 0, so the risk is small. | Test plan §1 objective 4 | Low | Lag Interval wrongly gaining an "All" option or losing its 0 default would not be caught. AP2476_001 step 4 could note it at no extra cost. |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every TC cites REQ-001 to REQ-004 or an open question that exists in the analysis.

**Unresolved Open Questions affecting coverage:**
- Q-001 — meaning of "All" in the earning calculation. Still open; no test can verify it from the admin screens. The report must say the calculation effect is unverified.
- Q-002 — 999999 vs 9999999. AP2476_002 and AP2476_008 test the ticket as written; a mismatch goes to Gate C.
- Q-003 — whether "All" becomes Condition's default. AP2476_001 records which option is pre-selected rather than judging it.
- Q-004 — how the list shows an empty field. AP2476_003 and AP2476_004 accept any clear rendering and record it.
- Q-005, Q-006, Q-007 — recorded as observations in AP2476_009, AP2476_001 and AP2476_008.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | An existing rule saved with odometer-to 9999999 can still be edited and saved after the default changes to 999999 | Boundary value analysis | If the change also added a 999999 maximum, every rule saved before it (including the seeded "AV+" rule) could no longer be edited — admins would be locked out of their own rules. | Medium |
| 2 | After a refused save (for example blank Model Year Age), the standalone page still shows "All" in the six fields the admin left empty | State transition | If the error page refills empty fields with the first option ("AP-CADV - Advanced", "Acura", "New"), an admin who fixes the one error and saves narrows the rule without noticing. | Medium |
| 3 | A rule with only Coverage Code on "All" and every other field filled saves and keeps the filled values | Equivalence partitioning | Tests a mixed rule (some fields "All", some set), the most common real case; a bug that clears neighbouring fields when one is empty would ship. | Medium |
| 4 | Two rules on the same assignment both left fully on "All" are both saved (or the second is refused) without an error page | Error guessing | Two catch-all rules overlap completely; if the server crashes on the second, or the earning engine later picks one at random, contracts get unpredictable curves. | Medium |
| 5 | A rule with only "Sale Date to" filled saves and keeps that date | Equivalence partitioning | Mirror of AP2476_009 — see Pass 1 gap 1. | Low |
| 6 | Pressing Escape on a half-filled Add Parameter dialog and reopening it shows "All" and the odometer defaults again | State transition | Leftover values from an abandoned dialog would be saved into the next rule. | Low |
| 7 | Opening the pencil on the seeded "AV+" parameter (read only, never submitted) still shows its stored values, not "All" | Cross-entity | Rules saved before the change could appear empty on Edit after the deploy, inviting admins to re-enter or wrongly widen them. | Low |
| 8 | A rule with Sale Date from later than Sale Date to, others on "All", is refused or saved as entered without an error page | Boundary value analysis | Already known to save silently before the change (no range check); the new optional handling could turn it into a crash. | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Cross-entity | Check that what this feature produces is read correctly by the next feature in the workflow. |

Two further candidates were considered and dropped: the effect of "All" on contract earnings (High value, but outside this ticket and not observable from admin — kept as Q-001), and concurrent edits by two admins (no evidence of risk specific to this change).

---

## Recommendation

The ten designed cases are ready to execute as they are. They cover every acceptance
criterion on both Add and Edit, the main regression (a fully filled rule) and the scope
boundary (fields not in the list stay required). None of the eight proposed cases is High
priority. The two worth promoting first, if the user wants more depth before execution,
are **#1** (editing a rule saved with 9999999 — it is the case most likely to hit real
production rules) and **#2** (the error page keeping "All"), because both would let
admins change rules without meaning to.
