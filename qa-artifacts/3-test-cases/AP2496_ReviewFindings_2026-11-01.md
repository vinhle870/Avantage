# Test Case Review — AP-2496

**Date:** 2026-11-01
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2496_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2496_test-plan.md, qa-artifacts/3-test-cases/AP2496_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2496_TestCases_006-008.md; knowledge: `domain` (qa-docs/quote-creation.md, qa-docs/chubb-insurance.md), `navigation` (base-test/navigation-map.md), `test-data` (base-test/test-centralized.md)

The ticket has real acceptance criteria (four, in Given/When/Then form), so this review checks against them and is not a placeholder-scope review.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

Every acceptance criterion has at least one test case: REQ-001 → AP2496_001; REQ-002 →
AP2496_002 (judged), AP2496_003 and AP2496_008 (record-only); REQ-003 → AP2496_004,
AP2496_005; REQ-004 → AP2496_006 (removed product) and AP2496_007 (cancelled warranty
contract). No expected result asserts an answer to an open question: the Judgement points
(Q-001 to Q-005) are recorded, not judged. The gaps below come from the test plan's §3.2
edge-case list only, so they carry no REQ ID.

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | The test plan lists "only contract cancelled (record-only)" as an edge case; no case builds a quote whose only contract is a cancelled warranty contract | Test plan §3.2 (Q-007) | Medium | A quote whose only contract was cancelled may show an action that returns an empty or broken file |
| 2 | The test plan lists "archived quote (record-only)"; no case opens an archived quote | Test plan §3.2 (Q-009) | Low | The action may be missing, or broken, on archived quotes, which dealers open to re-print old contracts |
| 3 | The test plan lists "another dealer's quote URL (record-only)"; no case requests a quote of another dealership | Test plan §3.2 (Q-008) | High | See Pass 2 #1 — one dealership could download another dealership's client contracts |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every case cites REQ-001 to REQ-004 or a quoted part of the description.

**Unresolved Open Questions affecting coverage:**
- Q-001 — "finalized quote" is undefined. AP2496_002 uses the criterion's own example ("a quote whose products were removed before finalization"), so its "not shown" result is judged; AP2496_003 (a quote with no product at all) stays record-only. The executor should record any quote state the page shows in AP2496_002 as well.
- Q-002, Q-004 — which documents and in what order: AP2496_005 records them.
- Q-003 — file name pattern and inline/attachment: AP2496_004 records them.
- Q-005 — position and French label: AP2496_001 records them.
- Q-006 — no known screen marks a warranty contract cancelled: AP2496_007 may be BLOCKED at run time.
- Q-007, Q-008, Q-009 — not exercised by any case (gaps 1–3 above).
- Q-010 (Info) — the remove action used in AP2496_002 and AP2496_006 is recorded.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | Requesting the download-all address with another dealership's quote id does not return that dealership's documents | Security | A dealer could read another dealership's client contracts — names, addresses, financing and insurance details — by changing a number in the address. High because it is a privacy breach, not a cosmetic fault | High |
| 2 | Generating a new contract after a first "Download all documents" makes the next download include it | State transition | A cached or stale merged file could hand the client a set that misses the contract just signed. Medium because the individual link is still available as a workaround | Medium |
| 3 | A quote whose only generated contract is a cancelled warranty contract — record whether the action is shown and what it returns | Decision table | The two rules "shown when a contract exists" and "cancelled contracts are excluded" collide here; the action may return an empty or invalid PDF. Medium because it needs Q-006 to be reachable at all | Medium |
| 4 | The merged file includes a contract of each other type the quote page can generate (Esthetic protection, GAP, warranty, sales contract) | Equivalence partitioning | One contract type could be silently left out of the merged file while the cases with roadside and Chubb pass. Medium because the type list itself is open (Q-002) and several flows are unmapped | Medium |
| 5 | Double-clicking "Download all documents" returns one valid PDF and no server error | Error guessing | A double request could produce a corrupt file or an HTTP 500 on a slow merge. Low because a retry recovers | Low |
| 6 | "Download all documents" on an archived quote — record whether it is shown and works | Equivalence partitioning | Dealers re-printing an old quote's documents may find the action missing or broken. Low because the individual links remain | Low |
| 7 | The action label and the downloaded file in the French interface | Equivalence partitioning | A French-speaking dealer could see an untranslated label or a different file name. Low because AP2496_001 already records the French label | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Decision table | Work through every combination of two or more settings that interact, so no combination is left untried. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |

No further candidates surfaced beyond these seven.

---

## Recommendation

The current eight cases cover all four acceptance criteria and judge only what the
criteria state, so they are ready for execution. One proposal should be promoted first:
Pass 2 #1, the cross-dealership download, because it is the only High-priority risk and
no current case would catch it. It must be designed record-only for the expected response,
because Q-008 is open and the capture does not say what a dealer may access; an HTTP 5xx
is the only objective fault, and a returned file holding another dealership's documents
must be recorded as a security observation so the story comment puts it to the developer. The Medium and Low proposals (#2–#7) can wait for a later cycle; #3
depends on Q-006 being answered first.
