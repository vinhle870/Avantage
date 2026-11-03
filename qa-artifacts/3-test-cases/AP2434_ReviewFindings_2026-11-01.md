# Test Case Review — AP2434

**Date:** 2026-11-01
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2434_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2434_test-plan.md, qa-artifacts/3-test-cases/AP2434_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2434_TestCases_006-008.md

**Standing caveat:** The ticket's only acceptance criterion is one Given/When/Then block. It names the endpoint, the five fields and two outcomes ("created", "displayed in the admin area") and nothing else, so most negative and display results in these cases are record-only. In addition, **all eight cases are BLOCKED at design time** because QA has no staging admin API key (Q-002). Until a key is supplied, this set cannot prove anything about the build.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

Every requirement has at least one test case: REQ-001 (AP2434_001, _004, _005), REQ-002 (AP2434_001, _002, _006, _007), REQ-003 (AP2434_003, _008), REQ-004 (AP2434_001, _002). The 255 / 256 / 2,000-character boundary from the test plan is in AP2434_003, and the regression check that earlier notes stay listed is in AP2434_001 step 4. No expected result asserts an answer to an open question: every Judgement point is recorded, and the only asserted outcomes quote the capture ("The note is created", "displayed in the admin area", "more than 255 characters").

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | The test plan's negative list says "missing field", but only `warranty_id` and `title` are left out (AP2434_006). Leaving out `description`, `is_public` or `file_content` is not tried. | Test plan §3.2 (Negative) | Low | A server error when an optional-looking field such as `file_content` is omitted would not be seen. |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every case cites REQ-001 to REQ-004, which all exist in the analysis.

**Unresolved Open Questions affecting coverage:**
- Q-002 (Info) — no staging admin API key or confirmed API host. Blocks AP2434_001 – AP2434_008: nothing can be executed.
- Q-001 (Judgement) — the path `/api/admin/warranty/-notes` may be a typo. If the literal path answers "not found", AP2434_001 fails and the bug ticket asks the author.
- Q-003, Q-004, Q-005 (Judgement) — success response, validation and key rejection are not specified; AP2434_001, _002, _004 – _007 record them only.
- Q-006, Q-007 (Judgement) — where the note appears and which of `description` / `file_content` is shown; recorded in AP2434_001 and _002.
- Q-008, Q-009 (Judgement) — HTML display, script removal and upper length limit; recorded in AP2434_003 and _008.
- Q-010 (Info) — what `is_public` changes outside the admin area; not tested.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

Every proposal below is risk-based: the ticket states no rule for any of them, so each would be written with record-only expected results except where an objective fault (server error, lost or altered value) is possible.

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | French accented text (é, è, ç, à, «») in title, description and HTML body is shown exactly as sent | Equivalence partitioning | This is a Quebec product; if multipart text is decoded with the wrong character set, admins see garbled notes such as "Ã©" instead of "é" — a value shown that differs from what was entered. | Medium — likely input on this product, but the main flow still works |
| 2 | A title longer than 255 characters (256 and 1,000) — response recorded, no server error | Boundary value analysis | Titles are often stored in a 255-character column; a longer one could crash the endpoint (HTTP 500) or be silently cut, losing text. | Medium — the ticket raised the 255 limit only for `file_content`, so the title is the obvious next weak spot |
| 3 | Quotes, apostrophes and SQL-like text (`O'Brien`, `"; DROP --`) in title and description are stored and shown unchanged | Security | Unescaped quotes can break the database query (server error) or alter data; apostrophes are common in French text ("l'avis"). | Medium |
| 4 | The same valid request sent twice in quick succession creates exactly the notes sent, with nothing lost or mixed | Error guessing | A client retry after a timeout could create a duplicate or a merged note; admins would see confusing history. | Low — no rule states whether duplicates are allowed, so only lost or mixed values could fail |
| 5 | Empty strings for title, description and file_content — response recorded, no server error | Equivalence partitioning | An empty but present field is a different input class from a missing field; it may pass validation and create a blank note admins cannot identify. | Low |
| 6 | The same body sent as JSON instead of multipart form data — response recorded, no server error | Error guessing | Integrators often send JSON by default; a crash rather than a clear refusal would make the API hard to use. | Low |
| 7 | Leaving out `description`, `is_public` or `file_content` one at a time — response recorded, no server error (closes Pass 1 gap 1) | Equivalence partitioning | An omitted optional-looking field could cause a server error instead of a clear refusal or a default. | Low |
| 8 | A public note (is_public true) is or is not visible on the dealer side for the same warranty — recorded | Cross-entity | If public notes leak to dealers who should not see them — or never reach them — the meaning of the flag is wrong; but the ticket names only the admin area (Q-010, Info). | Low — out of the ticket's stated scope |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |
| Cross-entity | Check that what this feature produces is read correctly by the next feature in the workflow. |

---

## Recommendation

The eight designed cases cover every requirement and keep every unstated behaviour record-only, so the set is ready to execute as soon as a staging admin API key is available (Q-002). That key is the real hold: without it every case stays BLOCKED and the story cannot be released. No Pass 1 gap cites a requirement and no Pass 2 proposal is High, so nothing needs promoting before execution. If the team wants broader coverage, proposals 1 (French accents) and 2 (titles over 255 characters) are the most likely to find a real defect and are the first to add.
