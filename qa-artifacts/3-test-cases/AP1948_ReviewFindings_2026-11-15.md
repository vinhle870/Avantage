# Test Case Review — AP-1948

**Date:** 2026-11-15
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-1948_requirements-analysis.md (2026-11-15), qa-artifacts/2-test-plan/AP-1948_test-plan.md (version 2.0), qa-artifacts/3-test-cases/AP1948_TestCases_001-005.md, qa-artifacts/3-test-cases/AP1948_TestCases_006-009.md (both redesigned 2026-11-15) · knowledge: `domain` (`qa-docs/client-portal-quote-request.md`, `qa-docs/admin-portal.md`), `navigation` (`navigation-map.md` §1), `test-data` (`test-centralized.md`)
**Supersedes:** AP1948_ReviewFindings_2026-11-01.md (its Pass 2 #1 became AP1948_009; its #3 is now covered by AP1948_004–006 in part — see Pass 2 #1 below)

**Standing caveat:** AP-1948 has no separate acceptance-criteria field; its two acceptance statements come from the description's Given / When / Then block. Two of the nine cases (AP1948_007, AP1948_008) stay BLOCKED on Q-002, so this set cannot prove the Tesla "Original ask" figures (REQ-003). AP1948_003 stays BLOCKED at the Stripe payment page because `test-data` has no Stripe test card. The filter cases AP1948_004–006 rely on an admin screen — the vehicle model's "category" field — that no knowledge source maps; each has a BLOCKED fallback if it cannot be found.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| — | None. REQ-001 AC 1 (as clarified by Q-001) → AP1948_004 (offered terms tick the model's configured category), AP1948_005 (a term excluding the category is not offered), AP1948_006 (a category with no offered term). REQ-002 AC 1 → AP1948_001, 002, 003, 009. REQ-003 AC 1–3 → AP1948_007, 008 (BLOCKED, Q-002). Test-plan objective 2 (negative without a CVE term) → AP1948_005 paths A/B; objective 5 → Q-004 (AP1948_006, 005), Q-005 (001, 003), Q-006 (002, 003), Q-010 (004), CVE state F-1 (002, 004, 007, 008). | — | — | — |

**Guessed answers check.** AP1948_004 step 5 and AP1948_005 step 5 judge a term by its "Category A–E" checkboxes on `/admin/program-term/{id}/edit`. Ken Nguyen's answer (19545) covers only the model's field; the term side is QA's reading, labelled as such in the analysis's REQ-001 acceptance-criterion note and approved at Gate A (R1 round 2), and it is the only category setting on a program term in `qa-docs/admin-portal.md`. Not a gap. No other expected result asserts behaviour the capture or an answered question does not state: Q-004, Q-005, Q-006 and Q-010 outcomes are record-only, and missing CVE terms are never a FAIL.

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. AP1948_001 and AP1948_009 cite REQ-002 (price cases); the filter cases 004–006 cite REQ-001.

**Unresolved Open Questions affecting coverage:**
- Q-002 (Blocking) — still open (asked in 19432, re-asked in 19457 and 19524); blocks AP1948_007, 008. Even once answered, a disabled CVE program on Dev keeps them BLOCKED (fact F-1).
- Q-004 (Judgement) — open; AP1948_006 records the empty-state display; it may not be reached if every allowed category has a term.
- Q-005, Q-006 (Judgement) — open; recorded by AP1948_001, 002, 003.
- Q-010 (Judgement) — open; AP1948_004 records each offered term's fuel type, vehicle type, years and km without judging them. On 2026-11-01 term 16 (fuel types gasoline and diesel only) was offered for a Tesla.
- Q-007 – Q-009 (Info) — open; no test result depends on them.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | A second Tesla model whose configured category differs from the Model 3's (e.g. a Model S, if its category is read as B while the Model 3 is A) → each sees only terms that tick its own category, with no admin change | Equivalence partitioning | AP1948_004 checks one category as configured; a filter that works for one stored category but leaks for another would ship. Comment 19544 says Tesla was split into A and B, so two real categories exist without touching shared data. Medium because AP1948_005 path B already exercises a second category value, though by a temporary change | Medium |
| 2 | A non-Tesla BEV model (any battery-electric entry on the vehicle list) → offered terms tick its configured category | Equivalence partitioning | Comment 19544 puts "Tesla and other BEV vehicles" in scope; a filter wired only for the Tesla make would show other BEV customers terms from the wrong category. Medium because the rule is the same and the vehicle list's BEV entries are not mapped | Medium |
| 3 | The CVE program is disabled in admin → none of its terms (ids 122–126) is offered, even for a category-A Tesla whose category the terms tick | State transition | A disabled program whose terms stay on sale would let customers buy coverage the business withdrew (comment 19544, "loss retention" issues). Read-only: it checks the program's disabled state and the portal, and never re-enables CVE. Medium because no acceptance statement covers program status | Medium |
| 4 | A term that ticks the model's category but excludes BEV in its fuel types → whether it is offered is recorded for the author | Decision table | Shows how category and fuel type interact, which is Q-010. Record-only until Q-010 is answered, so Low | Low |
| 5 | Admin changes the model's category while a customer is between "Select Coverage" and "Summary" → the Summary does not price a term that is no longer eligible, or shows no error | Error guessing | A session that keeps a term after it became ineligible could sell the wrong coverage. Low because the window is short and needs a shared-data change | Low |
| 6 | Changing the customer ID in the link (`/customer/1494/quote-request`) → another customer's data is not exposed | Security | Carried from 2026-11-01 (#4): the Client portal has no login, so a guessed ID could leak a customer's dealer, vehicle or quote. Medium because it is outside the ticket's scope but on the same page | Medium |
| 7 | Browser Back or reload after choosing a term → the Summary price still matches the term shown as selected | Error guessing | Carried from 2026-11-01 (#5). AP1948_002 now uses Back between terms, which covers part of this. Low | Low |
| 8 | A term whose suggested retail price has cents (e.g. 1025.99) → the Subtotal shows the exact amount | Boundary value analysis | Carried from 2026-11-01 (#6): a rounding fault would misquote every non-round price. Low because it needs another price change and current prices are round | Low |

One more candidate from 2026-11-01 (#7, dealer price vs retail price on the dealer portal, Low) is not listed again: the dealer portal is out of scope.

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| Decision table | Work through every combination of two or more settings that interact, so no combination is left untried. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |

---

## Recommendation

The set is ready for execution on Dev. REQ-001 is now covered by three runnable cases (AP1948_004–006) that follow the model's configured category and never rely on a CVE term; REQ-002 keeps its four price cases; REQ-003 stays BLOCKED on Q-002. No High proposal surfaced. If one Medium item is worth promoting, it is #1 (a second Tesla model in its own configured category): it proves the filter on two stored categories without changing shared data, and it is cheap once AP1948_004 has located the model category screen. #3 (disabled CVE program not offered) is also cheap and read-only. Execution must run AP1948_005 path B and AP1948_006 one at a time and confirm each restore before the next case, because both change the Tesla Model 3's category on shared Dev.

---

# Re-review — 2026-11-15 09:22 UTC — changed cases only (AP1948_007, AP1948_008)

**Scope:** only the cases redesigned in this run — AP1948_007 and AP1948_008 (file 2), after Q-002 was Accepted by the 2026-11-15 knowledge lookup. The findings above (08:36 UTC) stand for AP1948_001–006 and 009, whose 2026-11-15 results are kept; AP1948_005's step 5 wording fix (sibling S on path A) changes no coverage.
**Sources:** AP-1948_requirements-analysis.md (REQ-003 AC 1 = Q-002 Accepted; "Original ask" figures relabelled as background, R1 round 3 F-1), AP-1948_test-plan.md (version 2.1), AP1948_TestCases_006-009.md · knowledge: `domain` (`qa-docs/admin-portal.md` — TESLA model categories on Dev: Model 3 #3124 A, Model Y #3126 A, Model S #3127 B, Model X #4725 B, X #4724 B; `qa-docs/client-portal-quote-request.md` — Tesla list entries)

## Pass 1 — Things the Documents Say We Should Test, But Don't (changed cases)

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| — | None. REQ-003 AC 1 (Tesla term price = suggested retail price, nothing added) → AP1948_007 for Model 3 and Model Y (Category A), AP1948_008 for Model S and Model X (Category B). All four Tesla models named in the ticket are covered, on every term each is offered. | — | — | — |

**Guessed answers check.** Step 5 of both cases asserts the Q-002 Accepted result (price = the term's own suggested retail price, no +200$ / +800$) and the Q-005 Accepted format — record-and-accept per designer Step 1c, citing the analysis. "Every listed term ticks the model's category" asserts REQ-001 as answered by Q-001 (19545). Neither case expects a CVE term to appear: for Category B models the Category-A-only CVE terms are absent by the category rule (R1 round 3 F-2), and a missing CVE term is never a FAIL. No expected result asserts the "Original ask" figures. Not a gap.

**Orphan references:** none — both cases cite REQ-003 AC 1, which now exists in the analysis.

**Unresolved Open Questions affecting these cases:** none. Q-002 and Q-005 are Accepted; Q-007 and Q-008 (Info, Open) do not touch them.

## Pass 2 — Tests a Senior Tester Would Add (changed cases)

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 9 | The "2024 TESLA X" list entry (linked to vehicle model #4724 "X", a second model record besides #4725 "Model X") → offered terms tick #4724's category and each price equals its suggested retail price | Equivalence partitioning | Dev holds two vehicle-model records for the Model X. AP1948_008 uses one "2022 TESLA Model X" entry; if the other record were mis-categorised or priced differently, a customer picking that entry would see the wrong terms. Low because both records read Category B on 2026-11-15 | Low |
| 10 | An older Tesla Model S entry (e.g. 2015) → the same terms and the same price as the 2022 entry | Equivalence partitioning | A year-based surcharge or eligibility rule would price older Model S customers differently from what the term states. Low because the year is not a test condition in the ticket and term eligibility years are recorded elsewhere (Q-010 accepted) | Low |

AP1948_008 now also covers most of the earlier Pass 2 #1 (a second Tesla model in its own configured category, Category B, with no admin change): its step 5 checks every listed term ticks the Model S / X category.

## Recommendation (changed cases)

AP1948_007 and AP1948_008 are ready to execute on Dev, read-only, before the cases that change configuration. 0 Pass 1 gaps citing a REQ/AC and 0 High Pass 2 proposals in this re-review; two Low proposals (#9, #10). Expect AP1948_008 to see only term 16 (Category B): that is a PASS when its Subtotal equals term 16's suggested retail price, not a BLOCK.
