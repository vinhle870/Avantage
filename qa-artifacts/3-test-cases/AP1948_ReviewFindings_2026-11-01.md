# Test Case Review — AP-1948

**Date:** 2026-11-01
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-1948_requirements-analysis.md, qa-artifacts/2-test-plan/AP-1948_test-plan.md, qa-artifacts/3-test-cases/AP1948_TestCases_001-005.md, qa-artifacts/3-test-cases/AP1948_TestCases_006-008.md · knowledge: `domain` (no Client portal file), `navigation` (`navigation-map.md` §1, §4), `test-data` (`test-centralized.md`)

**Standing caveat:** AP-1948 has no separate acceptance-criteria field; its two acceptance statements come from the description's Given / When / Then block. Five of the eight test cases (AP1948_004 – AP1948_008) are BLOCKED at design time on two Blocking questions (Q-001, Q-002), so as designed this set can only prove REQ-002 — that the price shown equals the configured suggested retail price. It cannot yet prove the category filter (REQ-001) or the Tesla figures (REQ-003). The Client portal itself has never been mapped by QA, so every Client portal step names its controls by what they do, not by a verified label.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| — | None. REQ-001 AC 1 → AP1948_004, 005, 006; REQ-002 AC 1 → AP1948_001, 002, 003; REQ-003 AC 1–3 → AP1948_007, 008. Test-plan objective 4 (record Q-004 – Q-006) → AP1948_006 (Q-004), AP1948_001 (Q-005), AP1948_002 / 003 (Q-006). No expected result asserts behaviour the capture does not state. | — | — | — |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None.

**Unresolved Open Questions affecting coverage:**
- Q-001 (Blocking) — still open; blocks AP1948_004, 005, 006. The category filter, the main point of REQ-001, cannot be verified until the model → category mapping is known.
- Q-002 (Blocking) — still open; blocks AP1948_007, 008. No expected Tesla price can be written until the term → figure mapping and the surcharge rule are confirmed.
- Q-003 (Judgement) — still open; no case uses a non-Tesla vehicle, so whether the change applies to every make is not observed (see Pass 2 #2).
- Q-004, Q-005, Q-006 (Judgement) — open; recorded, not judged, by AP1948_006, 001, 002 / 003.
- Q-007 – Q-009 (Info) — open; no test result depends on them.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | Admin changes a term's suggested retail price → the Client portal shows the new price for that term (then restore the original) | State transition | AP1948_001 only proves the two numbers match at one moment. The "Original ask" listed fixed Tesla prices, so a build that hard-coded them would pass AP1948_001 whenever the configured value happens to equal the hard-coded one — and every later price change in admin would silently never reach customers. High because it is the only test that proves the price is *read from* the term, which is what REQ-002 states. | High |
| 2 | A non-Tesla vehicle (e.g. Ford Focus 2008) → price shown still equals its term's suggested retail price | Equivalence partitioning | If the change was wired only for Tesla, every other make could show a stale or empty price. Medium because the ticket's scope by make is itself an open Judgement question (Q-003), so the result can only be recorded. | Medium |
| 3 | One vehicle from each of Category A, B and C → each sees only its own category's terms | Equivalence partitioning | A filter that works for one category but leaks or drops terms in another would ship. Medium; blocked on Q-001 like AP1948_004. | Medium |
| 4 | Changing customer ID in the link (`/customer/1494/quote-request`) → another customer's data is not exposed | Security | The Client portal has no login; if any customer's name, vehicle or quote shows for a guessed ID, customer data leaks. Medium because it is outside this ticket's stated scope but on the same page. | Medium |
| 5 | Browser Back or page reload after choosing a term → the price shown still matches the term shown as selected | Error guessing | A price that stays on the previous term after Back/reload would quote the wrong amount. Low because it needs an unusual navigation path. | Low |
| 6 | A term whose suggested retail price has cents (e.g. 2599.99) → shown with the right amount, not rounded or truncated | Boundary value analysis | A rounding fault would misquote every non-round price by up to a dollar. Low because it needs a configuration change and the current figures are round. | Low |
| 7 | Same program term priced on the Client portal and in a dealer-portal quote → the Client portal uses the suggested retail price, not the dealer's cost | Cross-entity | Showing a dealer price instead of the retail price exposes dealer margins to customers. Low because the dealer portal is out of this ticket's scope. | Low |

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

The set is ready for execution for REQ-002 only; REQ-001 and REQ-003 wait on Q-001 and Q-002, which were posted on AP-1948 on 2026-11-01. Before execution, promote Pass 2 #1 (change a term's suggested retail price in admin and confirm the Client portal follows it, restoring the original value in the same case): it is the only test that tells a configured price from a hard-coded one, and the ticket's own history lists hard-coded figures. The Medium and Low proposals can stay in the backlog; #3 would be blocked by Q-001 anyway.
