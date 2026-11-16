# Test Case Review — AP2501

**Date:** 2026-11-15
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** `qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md` (corrected 2026-11-15T09:19Z), `qa-artifacts/2-test-plan/AP-2501_test-plan.md` (v1.1, 2026-11-15), `qa-artifacts/3-test-cases/AP2501_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP2501_TestCases_006-006.md` (both revised 2026-11-15); knowledge `domain` (`quote-creation.md` Dev 2026-11-02 and 2026-11-08 sections, `billing-invoices.md` Dev 2026-11-02, `admin-portal.md`) and `navigation` (`navigation-map.md`); link/unlink wording from `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md`

**Scope of this review:** the cases whose expected result changed on 2026-11-15 —
**AP2501_002, AP2501_003, AP2501_004, AP2501_005** (orchestrator instruction: run the
review on the changed cases only). AP2501_001 changed only its actions (current Dev flow)
and its expected results are the same, so its 2026-11-02 PASS stands; AP2501_006 stays
BLOCKED on Q-001. Both were read for consistency with the changed cases, not re-reviewed.
The 2026-11-01 review (`AP2501_ReviewFindings_2026-11-01.md`) still covers the unchanged parts.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

Traceability (the link from each requirement to the tests that check it) is complete for
every acceptance criterion the changed cases cover: REQ-001 AC 1–2 → AP2501_002 (edge case,
a second term) beside AP2501_001; REQ-002 AC 1 → AP2501_003; REQ-003 AC 1 → AP2501_004;
REQ-003 AC 2 → AP2501_005. REQ-004 stays with AP2501_006 (BLOCKED on Q-001).

**Guessed answers.** None found. Each expected result in the changed cases rests on a
quoted source:

- AP2501_003 asserts the Admin "PDF" button and that its description matches the invoice
  page — both from the AP-2099 sentence quoted in its Requirement row (Q-007 Answered).
- AP2501_004 and AP2501_005 assert the list layout "in full, one item per line" — Q-005 is
  `Accepted`, and the analysis already holds the observed value (six lines, 2026-11-02),
  which designer Step 1c says to assert.
- AP2501_002 asserts the term line reads exactly `TERM_B` — the term sold (REQ-001 AC 1),
  in the form Q-002 accepted.

**The test-plan rules are carried into the cases.** The plan's Configuration row for dealer
1380's Permaplate links (§8.1) — record first, change, restore in the same case — is in
AP2501_002 steps 1 and 4; the plan's new suspension rule (§6, an unconfirmed restore stops
the run) is in step 4's expected result; the required Financing company (§8) is in every
contract step.

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | Carried over from 2026-11-01: the test plan's Out of Scope row says an invoice created before the change "may be observed and recorded, never failed", and Q-003 is now `Accepted` with "recorded at execution", but still no case opens a pre-change Permaplate invoice to record it. | Test plan §2.2 (Q-003) | Low | Nobody records whether older Permaplate invoices still lack the term, so Q-003's "accepted" value is never actually observed. Low because no pass or fail depends on it. |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. AP2501_002–005 cite REQ-001 to REQ-003 and Q-002, Q-005, Q-007, all present in the analysis.

**Unresolved Open Questions affecting coverage:**
- Q-001 (Blocking, Open — asked 2026-11-01 comment 19437 and 2026-11-08) — affects only
  AP2501_006 (REQ-004). None of the changed cases depends on it; each records the line order
  for it without judging it. The story cannot move to release while it is open.
- Every other question is `Accepted` (Q-002 to Q-006, Q-008) or `Answered` (Q-007). Q-004
  and Q-006 (Info) affect no result.

**Design notes on the changed cases** (not coverage gaps — no Gate B rule reads them):

- **AP2501_002 restores the shared dealer whatever happens.** Step 4 runs whenever the case
  linked a term, even after a failure or a BLOCKED step, and checks the table against the
  rows recorded before the change. A term already linked by someone else is used but never
  unlinked. This matches the orchestrator's instruction and plan §8.1.
- **Whole-line comparison is needed and is there.** "5 ans" also occurs inside the option
  name "Extra care (5 ans couverture )" and "3 ans" inside "3 Ans (Drive IP)"; the case
  compares the term line as a whole line, so a substring match cannot pass it by accident.
- **Eligibility of `TERM_B` for vehicle 915 is not mapped on Dev.** The options and any age
  rule of "5 ans" and "3 ans" are unknown; step 2 turns "not offered" or "no option" into
  BLOCKED (test data not on Dev) and goes to the restore. This is the right fallback; the
  executor should write the terms' options back to `quote-creation.md` once seen.
- **AP2501_004 and AP2501_005 read `INVOICE_B` after AP2501_002 has unlinked `TERM_B`.**
  Without adding a step, they therefore also show that unlinking a term does not strip it
  from an invoice already issued — a useful side effect worth naming in the execution log.
- **AP2501_003 will most likely FAIL again on AP-2529** (the Admin "PDF" button answered
  HTTP 500 on every invoice on 2026-11-02). The case says so and routes it to Gate C as a
  FAIL on the step under test, not BLOCKED, which is correct.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

These are what a senior tester would add, not confirmed requirements.

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | With the interface switched to French, the new invoice's details page names the term in its French form, and the text is recorded in both languages | Equivalence partitioning | AP-2429 lets an administrator give each term French and English names; Q-002 accepted only the English-UI value ("10 ans"), so a French-speaking dealer — most of this Quebec customer base — could see a missing or untranslated term and nobody would know. Carried over from 2026-11-01 (proposal 1). | Medium |
| 2 | After AP2501_002 unlinks `TERM_B`, the dealer's Permaplate Quote page offers only "10 ans" again | Error guessing | The Admin table could show the restore while a cached link still offers `TERM_B` to dealer 1380, so other tickets testing on the same dealer would see an extra term. Low because the AP-2455 run (2026-09-06) showed the link is enforced on the server, not cached. | Low |
| 3 | An invoice raised before the change is opened and its description recorded | State transition | Records whether historical invoices were back-filled or left as they were, so the accepted value of Q-003 is an observed one (Pass 1 gap 1). Carried over from 2026-11-01 (proposal 2). | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |

The 2026-11-01 proposals 3 (parent/child options), 4 (after payment) and 5 (warranty
invoice) are unchanged by this revision and are not repeated here.

---

## Recommendation

The four changed cases are ready for execution on Dev as they stand. Every acceptance
criterion they cover has a case, no expected result rests on a guessed answer, the shared
dealer's Permaplate link is changed and restored inside AP2501_002 with a stop rule if the
restore cannot be confirmed, and the invoice-PDF case now tests the control AP-2099 names.
No Pass 1 gap cites a requirement and no Pass 2 proposal is High, so nothing needs promoting
before the run. If the designer is re-run for another reason, proposal 1 (French interface)
is the most useful addition, because the English-UI value is the only one Q-002 accepted.
