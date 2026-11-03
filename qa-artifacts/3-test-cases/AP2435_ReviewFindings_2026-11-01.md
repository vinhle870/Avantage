# Test Case Review — AP2435

**Date:** 2026-11-01
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2435_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2435_test-plan.md, qa-artifacts/3-test-cases/AP2435_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2435_TestCases_006-010.md, qa-artifacts/3-test-cases/AP2435_TestCases_011-012.md

The ticket's acceptance criteria were retrieved in full (one Given/When/Then block with worked examples), so this review checks real criteria, not placeholders. All twelve cases are BLOCKED at design time because no admin API key is available to QA (Q-012); that is an execution gap, not a coverage gap, and it is recorded in every batch's Known blockers table.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

Every acceptance criterion has at least one case: REQ-001 AC 1 → AP2435_001, 007, 008, 009 · REQ-002 AC 1 → AP2435_001 · REQ-002 AC 2 → AP2435_002 · REQ-003 AC 1–2 → AP2435_003 · REQ-004 AC 1–2 → AP2435_004, 005 · REQ-005 AC 1 → AP2435_001, 010. No expected result asserts an answer to an Open question: every Judgement point (Q-001 to Q-011) is record-only, and the asserted results quote the capture.

The gaps below cite only the test plan or the analysis's risk tables, not an acceptance criterion.

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | The test plan (§3.2 Edge-case) and the analysis (REQ-005 risk, Q-011) ask to record whether a contract matched by two rules is listed once. No case does this. | Test plan §3.2; Q-011 | Low | A caller receives the same contract twice and counts it twice; record-only, so it would not fail a case anyway. |
| 2 | The analysis (REQ-003 risk) asks whether spaces are removed from the **stored** postal code too. AP2435_003 records the stored spelling of one contract but cannot vary it. | Analysis REQ-003 risk table | Medium | A client whose postal code was saved as `H3K 7B1` is never found by any search, because only the query's spaces are removed. |
| 3 | The analysis (REQ-004 risk, Q-006) asks which client telephone fields are searched. No case searches a second phone field. | Analysis REQ-004 risk table; Q-006 | Medium | A contract is not found by the client's work or mobile number; record-only until Q-006 is answered. |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every case cites REQ-001 to REQ-005 or a question that exists in the analysis.

**Unresolved Open Questions affecting coverage:**
- Q-012 (Info) — no staging admin API key; every case AP2435_001–012 is BLOCKED until one is stored in `/.env` as `AVP_ADMIN_API_KEY`.
- Q-001 (Judgement) — key header; AP2435_007 records whether `Authorization: Bearer` is accepted.
- Q-002 (Judgement) — missing/wrong key response; AP2435_008, 009 record it, asserting only that no contract data is returned.
- Q-003, Q-004, Q-005, Q-007, Q-008 (Judgement) — VIN length and case, partial postal code and phone, country code, result limit; AP2435_002, 006, 012 record them.
- Q-006 (Judgement) — which phone fields are searched; not covered (Pass 1 gap 3).
- Q-009, Q-010, Q-011 (Judgement) — response shape, status codes, searchable contracts; AP2435_001, 010, 011, 012 record them.
- Q-013 (Info) — key scopes; no case depends on it.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | Wildcard and quote characters (`%`, `_`, `'`) as the query list no contracts and cause no server error | Security | If the VIN partial match is built as an unescaped SQL `LIKE`, a `%` query returns every contract and a `'` causes an HTTP 500 — a database fault exposed to any API caller. Medium: the caller already holds an admin key, so the exposure is limited to someone who is trusted. | Medium |
| 2 | A telephone written with spaces only (`514 977 9047`) returns the contract | Equivalence partitioning | The capture says "all spaces … are removed", but the four examples include spaces only inside `(123) 123-1234`. A search that strips punctuation but not spaces would miss this common format. Medium: the parenthesised case already sends spaces, so a total miss is unlikely. | Medium |
| 3 | A client with two warranty contracts: searching their telephone lists both contract numbers | Equivalence partitioning | A search that returns only the first match hides a client's second contract from the calling system. Medium: needs a second contract as test data. | Medium |
| 4 | The first 6 and the last 6 characters of the VIN each return the contract | Boundary value analysis | A partial match that only searches from the start (or only "contains" in the middle) misses the most common lookup — the last 6 characters of a VIN. Medium: AP2435_001 uses a middle fragment, so an anchored search would already fail there. | Medium |
| 5 | A key deleted on `/admin/api-keys` no longer returns contract data | Security · State transition | A revoked key that still works leaves a former partner able to look up clients. Medium: revocation is not described in the ticket (Q-013), so the expected result would be record-only. | Medium |
| 6 | A postal code stored without a space is found by a query with a space, and the reverse | Decision table | Covers Pass 1 gap 2 with both stored spellings. Needs two contracts with the two spellings. | Medium |
| 7 | A query of 1,000 characters answers without a server error | Boundary value analysis | An unbounded query crashes the endpoint (HTTP 500) or slows the database. Low: unlikely for a real caller. | Low |
| 8 | Postal code with leading, trailing or double spaces (` H3K  7B1 `) returns the contract | Equivalence partitioning | "All spaces are removed" may be implemented as removing one space only. Low: unusual input. | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| Decision table | Work through every combination of two or more settings that interact, so no combination is left untried. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |

---

## Recommendation

The twelve cases cover every acceptance criterion and keep every unanswered point record-only, so the set is ready for execution as it stands once an admin API key is available (Q-012). No proposal is High priority and no Pass 1 gap cites an acceptance criterion, so nothing needs promoting before execution. If the executor has time, proposals 1 (wildcard and quote characters) and 2 (telephone with spaces only) are the cheapest additions with the best chance of finding a real defect.
