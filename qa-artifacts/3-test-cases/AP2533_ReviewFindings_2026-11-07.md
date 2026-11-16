# Test Case Review — AP2533

**Date:** 2026-11-07
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2533_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2533_test-plan.md, qa-artifacts/3-test-cases/AP2533_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2533_TestCases_006-010.md · knowledge: `domain` (qa-docs/quote-creation.md), `navigation` (base-test/navigation-map.md → quote-creation.md), `test-data` (base-test/test-centralized.md)

The ticket's real acceptance criteria were retrieved (two Given/When/Then blocks and their
screenshots), so this is a review against confirmed criteria, not a placeholder scope. One
part of one criterion — the hidden inputs of REQ-001 — cannot be judged until Q-002 is
answered, and its case is correctly BLOCKED.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

Every requirement and acceptance criterion traces to at least one test case:

- **REQ-001 AC 1 (visible part), AC 2 (TESLA / Model 3 / 2020 screenshot), AC 3 (no empty card)** → AP2533_001; negative AP2533_005; edge case AP2533_006; carried to the saved vehicle by AP2533_004.
- **REQ-001 AC 1 (hidden part)** → AP2533_002, BLOCKED by Q-002 (Blocking, Open) at design time, with steps written so it can run once answered; AP2533_001 steps 2 and 4 record the hidden inputs before and after the decode as observations only.
- **REQ-002 AC 1 and AC 2** → AP2533_003 (proof by the case's own quote name and a before/after VIN-search count, not by "newest row"); also checked in AP2533_005 and AP2533_006.
- **REQ-002 regression "Save after decode creates exactly one quote"** (analysis risk table and test plan §3.2) → AP2533_004.
- **REQ-003 AC 1 and AC 2** → AP2533_007 (label exact, position judged by page order and on-screen position); AP2533_008 (holds on another type); AP2533_009 (holds in French).
- **Test plan build-check rule** → AP2533_001 step 1, with a three-row decision table and a safe fallback (an inconclusive check falls to "fixed build not deployed on Dev", never to a click); every other decode case (002–006) cites it in its first step. The stop rule ends decode clicks after the first unwanted quote.
- **Test plan regression on other UI changes (Q-008)** → AP2533_010 step 2 maps the live form against the 2026-11-01 map.

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| — | No gap found: every requirement and acceptance criterion has at least one test case | — | — | — |

**Guessed answers check.** Every Expected Result was read against the capture. None asserts
an answer to an open question: the hidden-input values (Q-002) are `Not known — Q-002`; the
message for a bad VIN (Q-003), which values win after a hand choice (Q-004), the inventory
vehicle (Q-005), "Décoder" per type (Q-006), type-change behaviour and default (Q-007), other
UI changes (Q-008) and the French label (Q-009) are all record-only with objective faults
listed. Two expected results go beyond the capture's words, and both are acceptable as
written: AP2533_004 ("exactly one quote") is labelled regression and comes from the analysis's
risk table; AP2533_010's "a message under each empty required field" is the AP-2477 behaviour
mapped on Dev on 2026-11-01 (`domain`), labelled regression, and the exact wording is only
compared and recorded.

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every case cites REQ-001, REQ-002 or REQ-003 and AC numbers that exist in the analysis.

**Data check.** VIN `5YJ3E1EA0LF734293` matches `test-data` (2020 TESLA Model 3 Standard
Range Plus, Dev, 2026-11-02) and the acceptance-criterion screenshot. No case uses AP-2507's
Ford VIN for decoding, and no case opens quote 6437, vehicle 1067 or vehicle 915. Hand-chosen
Ford / Focus / 2008 in AP2533_006 is only chosen from the lists, with a fallback if absent.
No credential value appears in either file; the login is named by variable and source only.

**Unresolved Open Questions affecting coverage:**
- Q-002 (Blocking, Open — posted 2026-11-07, comment 19510) — AP2533_002 stays BLOCKED; until answered, nobody can say whether the decode fills the hidden technical details a later warranty may price on.
- Q-001 (Judgement) — the visible result is taken from the AC screenshot; AP2533_001 records any layout difference.
- Q-003, Q-004, Q-005, Q-006, Q-007, Q-008, Q-009 (Judgement) — recorded by AP2533_005, 006, 003, 008, 007/008, 010 and 009 respectively; no result depends on a guessed answer.
- Q-010 (Info) — no effect on any result.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | Decoding the Tesla VIN on a second car type (for example the first car type other than the default in "Vehicle type") fills the form and creates no quote | Equivalence partitioning | The fix builds the key from the form's name; if another car type's form is named differently or loads another script, the decode there could still save an undeletable quote or show the empty card, while the default type passes. High because the criterion is not limited to one type and a failure leaves permanent unwanted quotes | High |
| 2 | Decoding a well-formed 17-character VIN the decoding service does not know keeps the form, shows no error page and creates no quote | Equivalence partitioning | AP2533_005 covers a malformed and an empty VIN only; an unknown but valid-looking VIN takes a different path (the service answers "not found"), which could crash the page or save a quote with no vehicle. Medium because dealers rarely type a well-formed unknown VIN | Medium |
| 3 | Decoding 16- and 18-character VINs keeps the form and creates no quote | Boundary value analysis | Off-by-one length checks are where VIN validation usually breaks; a 16-character VIN reaching the service could return an error page. Medium: AP2533_005 already proves a far-too-short VIN is safe | Medium |
| 4 | Double-clicking "Décoder" quickly sends no duplicate save and leaves one filled form | Error guessing | A double-click is common; two overlapping requests could race and re-render a half-filled form or, on a partly fixed build, save a quote. Medium because the fixed request should not save at all | Medium |
| 5 | Pressing Enter in the VIN field does not save a quote by surprise | Error guessing | Dealers often press Enter after typing a VIN; if Enter submits the whole form as "Save" while a Brand/Model/Year is already filled, the dealer gets a quote they did not mean to create. Medium because validation still refuses an empty Brand | Medium |
| 6 | Decoding a VIN containing markup (`<b>X</b>5YJ3E1EA0LF734293`) shows it as plain text after the re-render | Security | The decode re-renders the form from the server's answer; if the typed VIN is echoed without escaping, a crafted value could run script in the dealer's session. Medium: requires a crafted input, but the re-render path is new code | Medium |
| 7 | Decoding a second, different VIN after a first decode replaces Brand, Model and Year with the second vehicle | State transition | A form that keeps the first decode's values (or mixes them) would quote the wrong vehicle. Medium; needs a second Dev VIN that is not reserved by another ticket (for example `2T1BURHE0NC505001`, Toyota Corolla 2022, typed only — not AP-2507's Ford VIN) | Medium |
| 8 | Changing "Vehicle type" after a decode keeps or clears the decoded values without an error page | State transition | Moving the type control into the form means a type change may now reload the form and lose the decode; record-only for Q-007, failing only on an error page or empty form. Low because Q-007 is unanswered and AP2533_008 already covers the type change itself | Low |
| 9 | A quote saved after the decode offers the warranty programs expected for a 2020 TESLA Model 3 | Cross-entity | If the decoded technical details never reach the saved vehicle, the warranty step could offer no program or the wrong one. Low for now: what the vehicle must carry depends on Q-002, so the result would be record-only | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |
| Cross-entity | Check that what this feature produces is read correctly by the next feature in the workflow. |

> 9 candidates surfaced; all are listed. Proposal 1 is the only High one.

---

## Recommendation

The ten test cases cover every requirement and acceptance criterion of AP-2533, keep the
hidden-input check BLOCKED by Q-002 as its own case, and guard every "Décoder" click behind a
read-only build check and a stop rule, so the set is ready for execution once Gate B is
decided. Pass 1 found no gap. Of the Pass 2 proposals, **proposal 1 (decode on a second car
type)** is High and is the one worth promoting before execution: it is the same acceptance
criterion on a different form variant, and a failure there leaves undeletable quotes. Proposals
2, 4 and 5 (unknown well-formed VIN, double-click, Enter key) are the next most useful if the
reviewer wants broader negative coverage; the rest can wait for a later cycle or for answers to
Q-002 and Q-007.
