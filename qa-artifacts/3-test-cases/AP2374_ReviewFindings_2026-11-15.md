# Test Case Review — AP2374

**Date:** 2026-11-15 (replaces the 2026-11-01 review for this run)
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2374_requirements-analysis.md (re-run 2026-11-15), qa-artifacts/2-test-plan/AP-2374_test-plan.md (v2.0), qa-artifacts/3-test-cases/AP2374_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2374_TestCases_006-010.md (both redesigned 2026-11-15); knowledge: `domain` (`qa-docs/claims.md` — Dev 2026-11-01; `qa-docs/admin-api.md` — create-claim and claim-attachment endpoints, `AVP_ADMIN_API_KEY`), `navigation` (`navigation-map.md` index → `claims.md`), `test-data` (`test-centralized.md` — Yopmail convention; no `client.stage.2374…` inbox used before)

The ticket's acceptance criteria were retrieved in full, and no question is Open any more,
so this review checks against real criteria. Coverage is now real for all five requirements:
the notify email — the part the 2026-11-01 run could not reach — is put on a claim through the
Admin API as setup, and AP2374_002–004 judge the recipient list and both deliveries against
it. REQ-004 now has a verdict (the AC sentence must be present). Both files carry an Execution
Context on Dev and a Known blockers table; the only standing risk, the claim-attachment HTTP
500, is declared there with a documented second route.

One honest limit: AP2374_007–010 keep their 2026-11-01 results, which were obtained on claims
with **no** notify email. They prove the unticked, invalid-list, no-notify and no-attachment
behaviours for the client address only; they say nothing about the notify address. Pass 2
proposals 1 and 2 cover that.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | Q-003 names four combinations (no notify email, no client email, both empty, both equal). Only "no notify email" has a case (AP2374_008). The analysis says the others are "recorded at execution", but no case records them | Test plan §3.2 (Edge-case row) · Q-003 | Low | A doubled address or stray comma in the recipient list goes unrecorded. No acceptance criterion depends on it, so this does not trigger promotion |

**Guessed results check.** Every Expected Result was read against the capture and the
Answered/Accepted questions. None asserts something the capture or a quoted answer does not
state: sender and subject (AP2374_003) are the Q-006 accepted values; the PDF checks
(AP2374_006) quote AP-2387 (Q-009 Answered); the single-address formatting (AP2374_008), the
saved-without-validation result (AP2374_009) and the single PDF (AP2374_010) are the
Q-003/Q-004/Q-008 accepted values; the AC 1 sentence (AP2374_005) and the ‘Notify by email’
label (AP2374_001) come from the AC text itself. AP2374_002's handling of the Preapproved form
(absent field → recorded against AP-2509 and judged in AP2374_001) avoids failing the same
defect twice without hiding it.

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every case cites REQ-001 – REQ-005 with the AC numbers of the analysis, or a listed question.

**Unresolved Open Questions affecting coverage:**
- None Open. Q-009 and Q-010 are Answered and asserted (AP2374_006; AP2374_002–004). Q-001 – Q-008 are Accepted and asserted as observed, except where the AC text wins (Q-001 sentence in AP2374_005, Q-002 label in AP2374_001, notify email in the list in AP2374_002).

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | On the API claim (notify email set), an unticked submit sends nothing to the notify address either | Equivalence partitioning | The notify contact gets emails the admin chose not to send. Medium, not High: AP2374_007 already proves the unticked path for the client address; a code path sending the notify address separately is possible but not evidenced | Medium |
| 2 | On the API claim, editing the recipient list to drop the notify address means it receives nothing | Equivalence partitioning | An admin removes the claim contact from one notification and the email still reaches them because the server re-reads `notify_email`. Medium: AP2374_009 proves the submitted list is used for the client address only | Medium |
| 3 | After `PUT /api/admin/claim/{id}` replaces `notifyEmail` (AP-2372), the Change status form pre-fills the new address, not the old one | State transition | Notifications keep going to a contact who was replaced. Medium: AP-2372 defines the replace call; this ticket only reads the field | Medium |
| 4 | A claim whose `notifyEmail` holds a non-address (`qa-docs/claims.md`: some Dev claims created through the API carry the literal value `string` as an email) opens Change status and saves without an error page | Error guessing | Real Dev data already holds such values; a send could fail with HTTP 500 for the whole list, so the client is not told either. Medium | Medium |
| 5 | The Pending form ("Notify customer by email") sends to both addresses when ticked | Equivalence partitioning | A third status that offers the option silently sends to the client only. Medium: AP2374_001 already fails the Pending label (AP-2509), so the gap is the delivery, not the control | Medium |
| 6 | The claim PDF sent to the client shows no internal-only data (admin notes, costs, dealer-only fields) | Security | Internal claim information is emailed to the client. Medium: AP-2387 defines layout points, not the audience, so it would be recorded, not judged | Medium |
| 7 | Notify email equal to the client email: the address appears once, or the recipient gets two copies | Boundary value analysis | The client receives duplicate emails for every status change. Low: annoying, not harmful (Q-003 Accepted) | Low |
| 8 | Double-clicking **Save** sends one email and records one status change | Error guessing | Duplicate notifications and a doubled history entry. Low: no evidence of double-submit on this form | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| State transition | Check what happens when a record moves from one state to another — here, a claim whose notify email is replaced. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking or odd stored values. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |

Two further candidates were dropped as lower value than the eight above: semicolon-separated
recipient lists (Q-004 Accepted already covers invalid input) and a large multi-file
attachment (no size limit is stated anywhere).

---

## Recommendation

The set is ready to execute. Pass 1 has one Low gap that cites only the test plan and Q-003,
not an acceptance criterion, and no Pass 2 proposal is High, so nothing needs promoting.
Proposals 1 and 2 are the most valuable additions: they would extend the kept 2026-11-01
results of AP2374_007 and AP2374_009 to the notify address, which those runs could not reach.
They can run on the same API claim at almost no extra setup cost.
