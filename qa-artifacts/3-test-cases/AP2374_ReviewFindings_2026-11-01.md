# Test Case Review — AP2374

**Date:** 2026-11-01
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2374_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2374_test-plan.md, qa-artifacts/3-test-cases/AP2374_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2374_TestCases_006-010.md; knowledge: `domain` (no Claims file exists), `navigation` (`navigation-map.md` — Claims listed as unmapped), `test-data` (`test-centralized.md` — Yopmail convention)

The ticket's acceptance criteria were retrieved in full (the Given/When/Then description),
so this review checks against real criteria, not placeholders. Coverage is real for
REQ-001, REQ-002, REQ-003 and REQ-005. REQ-004 (the message wording) has one case, and it
is BLOCKED by Q-001: until the author answers, the set can only record what the email
says, not prove it right. Both batch files declare the unmapped admin Claims area as a
navigation gap and carry a Known blockers section, so the cases are honest about the facts
nobody has verified yet.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | AP2374_003 step 5's action asserts the email is "one new email **from Avantage Plus**". The capture names neither a sender nor a limit of one email per recipient, and no Answered question settles either — a guessed result inside a verdict step. The sender should be recorded, and "one" should read "a" | REQ-003 AC 3 | High | A correct build could be failed because its sender name differs from a guess, or a duplicate send could be judged on a rule nobody wrote |
| 2 | Q-003 is covered only for an empty notify email (AP2374_008). A contract with **no client email**, and a claim whose notify email **equals** the client email, have no case | Test plan §3.2 (Edge-case row) · Q-003 | Low | A stray comma or a doubled address in the recipient field goes unrecorded for the author; no acceptance criterion depends on it |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every case cites REQ-001 – REQ-005 / AC 1 – AC 5 or a listed question, all of which exist in the analysis.

**Unresolved Open Questions affecting coverage:**
- Q-001 (Blocking) — still open; AP2374_005 is BLOCKED, so the message text in REQ-004 cannot be verified. Posted on AP-2374, comment 19433.
- Q-002 – Q-009 (Judgement) — open; each is handled as a record-only result (AP2374_001, 002, 003, 005, 006, 007, 008, 009, 010). These cases prove no error occurs and record the behaviour; they do not prove the behaviour the author wants.
- Q-010 (Info) — open; where the notify email is set is found during execution. If it cannot be set at all, AP2374_002–006, 009 and 010 become BLOCKED at execution.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | Adding a third Yopmail address to the recipient list sends the email to all three; removing one stops it reaching that one | Equivalence partitioning | An admin who adds the dealer or removes the client would see the email go to the pre-filled list instead of the one they submitted. Medium, not High: AP2374_003 already proves sending to more than one recipient, and whether editing is allowed is unanswered (Q-004) | Medium |
| 2 | The claim details PDF sent to the client shows no internal-only data (admin notes, costs, dealer-only fields) | Security | Internal claim information could be emailed to the client. Medium: the ticket asks for "a PDF of the claim details page" without saying which audience it is written for, so this is recorded for the author, not judged | Medium |
| 3 | A contract client with no email: the recipient field shows only the notify email, without a stray comma | Equivalence partitioning | A leading or trailing comma could make the mail server reject the whole send. Low: record-only under Q-003 | Low |
| 4 | Notify email equal to the client email: the address appears once, or the recipient receives two copies | Boundary value analysis | The client receives duplicate emails for every status change. Low: annoying, not harmful | Low |
| 5 | Recipient list typed with spaces after the commas, or with a semicolon instead of a comma | Boundary value analysis | Recipients typed the way people usually type them silently receive nothing. Low: Q-004 record-only | Low |
| 6 | Double-clicking the submit button sends one email and records one status change | Error guessing | Recipients get duplicate notifications and the claim history shows a doubled change. Low: no evidence of double-submit on this form | Low |
| 7 | A claim with several attachments, including a large file (about 10 MB), still sends the email with every file | Boundary value analysis | The email fails or arrives without some documents once total size passes the mail server's limit. Low: the size limit is not stated anywhere | Low |
| 8 | A status whose label carries French accents (for example "Approuvé", if present) is rendered correctly in the email | Error guessing | Garbled characters in the message the client reads. Low: record-only, ties to Q-001 | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |

No further candidates surfaced beyond these eight.

---

## Recommendation

The set is close to ready. One item must go back to the designer before execution: Pass 1
gap 1 — AP2374_003's verification names a sender ("from Avantage Plus") and a count ("one
new email") the ticket never states; both should become recorded values. No Pass 2
proposal is High, so nothing else needs promoting; proposals 1 and 2 (editing the
recipient list, internal data in the PDF) are the most valuable to add later, once Q-004
and Q-009 are answered. REQ-004 stays unverifiable until the author answers Q-001.
