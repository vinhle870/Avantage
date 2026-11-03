# Test Case Review — AP-2441

**Date:** 2026-11-01
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** `qa-artifacts/1-requirements-analysis/AP-2441_requirements-analysis.md`, `qa-artifacts/2-test-plan/AP-2441_test-plan.md`, `qa-artifacts/3-test-cases/AP2441_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP2441_TestCases_006-010.md`, `qa-artifacts/3-test-cases/AP2441_TestCases_011-011.md`; knowledge sources `domain` (`qa-docs/admin-portal.md`), `navigation` (`base-test/navigation-map.md`), `test-data` (`base-test/test-centralized.md`)

The ticket has real acceptance criteria (the Jira acceptance-criteria field), so this
review checks against them, not against a guessed scope.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | The test plan's §9 mitigation "record the User Details page URL and write it back to the `domain` source" is a post-execution task, not a test case; nothing in the cases reminds the executor to do the write-back beyond the Execution Context note. | Test plan §9 | Low | The next ticket on this page would again start without a mapped route; no product defect is hidden. |

Every requirement and acceptance criterion traces to at least one case: REQ-001 AC 1–2 →
AP2441_001, _002, _011; REQ-002 AC 1–2 → AP2441_001, _002, _011; REQ-003 AC 1 → _003;
AC 2 → _004; AC 3 → _005, _006; AC 4 → _007, _008; REQ-004 AC 1 → _009, _010. Every test-plan
objective (§1, items 1–5) is covered. No expected result asserts a guessed answer: every
point that rests on Q-001 to Q-006 is written as record-only, and the comparison with the
Dealer Details > Users page — the oracle the acceptance criterion itself names — is used
wherever the ticket does not say what an action does.

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None.

**Unresolved Open Questions affecting coverage:**
- Q-001 (Judgement) — the page-header "Edit user" button on the User Details page is recorded, not judged, in AP2441_001.
- Q-002 (Judgement) — any non-user edit control in the rows is recorded in AP2441_001 and _002.
- Q-003 (Judgement) — the landing page after each action is recorded in AP2441_003–007.
- Q-004 (Judgement) — the Unlink confirmation's existence and wording are recorded in AP2441_007 and _008; if there is none, _008 ends SKIPPED.
- Q-005 (Judgement) — what the User Details page shows with no dealer left is recorded in AP2441_007.
- Q-006 (Judgement) — the Edit user button on the Dealer Details > Users page is recorded in AP2441_011.
- Q-007, Q-008 (Info) — no test result depends on them.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

The biggest weakness of the current set is that **every data-changing case runs on a user
with only one dealer**. On a one-dealer user, a button wired to "the first dealer" or "the
user's dealer" instead of "this row's dealer" behaves correctly, so AP2441_005 and _007 would
pass even if the page acted on the wrong dealership for anyone with two. AP2441_002 and _010
look at a multi-dealer user, but only at the buttons' presence and the row link.

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | On a user with several dealers, Edit Permissions from the **last** row opens the form for that row's dealer with that dealer's roles — closed without saving | Equivalence partitioning | If the button is wired to the user's first dealer, an administrator editing a second dealership's permissions would silently change the first dealership's access instead. Read-only (the form is closed unsaved, proven safe by AP2441_006), so it can run on an existing multi-dealer user without changing anyone's access. | High |
| 2 | On a user with several dealers, Autoshield and Deal your rate from the last row open for that row's dealer | Equivalence partitioning | Same wrong-dealer wiring for the two actions the ticket never describes. Not safe on another person's user until Q-007 says whether these buttons act immediately. | Medium |
| 3 | Open the User Details page and an action link while logged out | Security | If the new row actions do not require an admin session, anyone holding a link could change a dealer user's permissions or unlink them. | Medium |
| 4 | Open the User Details page of a user linked to no dealer at all | Equivalence partitioning | An empty Dealers table could crash the page (HTTP 500) now that each row renders action buttons, hiding the user's details from the administrator. | Medium |
| 5 | A permission changed from the User Details page takes effect in the Dealer Portal for that user | Cross-entity | The admin Roles column could update while the dealer user's real access does not. Needs the test user's Dealer Portal password, which QA does not hold (test plan §2.2). | Medium |
| 6 | Click "Save" on Edit Permissions twice quickly | Error guessing | A double submission could save twice or show an error page, leaving the administrator unsure whether the change landed. | Low |
| 7 | After Unlink, press the browser's Back button and click a button on the stale dealer row | Error guessing | A stale row could let the administrator act on a link that no longer exists and get an error page or re-create a half link. | Low |
| 8 | A user with many dealers (enough to need scrolling or paging) shows the buttons on every row and keeps them clickable at 1280 × 800 | Boundary value analysis | Buttons could overflow or wrap off-screen on long tables, so the last dealers cannot be managed. | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |
| Cross-entity | Check that what this feature produces is read correctly by the next feature in the workflow. |

No candidates were dropped; 8 surfaced and all are listed.

---

## Recommendation

The set is close to ready: every acceptance criterion has a case, the open questions are
handled as record-only, and every data-changing case restores the test user before it ends.
One item should be promoted before execution: **proposal 1** (High) — Edit Permissions from
the last row of a multi-dealer user, opened and closed unsaved — because without it the
"right dealer" half of REQ-003 is never really tested. Proposals 2–8 can stay in the backlog;
proposal 2 should be reconsidered once Q-007 says whether Autoshield and Deal your rate act
immediately.
