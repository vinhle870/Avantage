# Test Case Review — AP-2499 (re-designed cases AP2499_005 and AP2499_009 only)

**Date:** 2026-11-15
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2499_requirements-analysis.md (re-analysed 2026-11-15), qa-artifacts/2-test-plan/AP-2499_test-plan.md (version 1.1), qa-artifacts/3-test-cases/AP2499_TestCases_001-005.md (AP2499_005), qa-artifacts/3-test-cases/AP2499_TestCases_006-010.md (AP2499_009); knowledge: `domain` (qa-docs/quote-creation.md — AP-2499 Dev modal map of 2026-11-02, AP-2504 co-applicant map of 2026-11-03, AP-2410 notes of 2026-11-08; qa-docs/chubb-insurance.md), `navigation` (base-test/navigation-map.md)

**Scope:** only the two cases re-designed on 2026-11-15. The other eleven cases are unchanged
and keep their 2026-11-02 results; the 2026-11-01 review
(`AP2499_ReviewFindings_2026-11-01.md`) still covers them. The ticket has real acceptance
criteria, so this is not a placeholder-scope review.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

Both re-designed cases trace to a real acceptance criterion and keep their requirement's
coverage whole:

- **AP2499_005 → REQ-003 AC 1**, the half "any field with no stored value falls back to its
  normal empty/placeholder state". The AC names "applicant date of birth" among the eight
  fields. With the residual now required (Q-011, Accepted), Date of birth is the only named
  field that can be stored empty, so the case checks the right field. The expected "blank"
  is the value Q-004 (Accepted) observed on Dev for fields with no value — record-and-accept,
  not a guess.
- **AP2499_009 → REQ-005 AC 1**, the failure half "on failure an error is shown without
  discarding the entered values". The trigger is the one Q-007 (Answered) quotes from
  AP-2405 (developer comment, 2026-01-22). The expected result uses the AC's wording; the
  AP-2405 message text is recorded, not required. The case is creditors only, as Q-007 and
  the test plan state.

Reviewer requirement R1 F-2 is met in both cases: step 2 records whether a financing (and,
in 009, the quote client) without a date of birth can be stored, and stops BLOCKED with that
reason if not. AP2499_009 keeps the "Chubb still prices it → BLOCKED, never PASS" branch.

Guessed-assertion check (expected results that say more than the capture or an Answered
question): one was found during this review and fixed in the same s3 pass before this file
was written — AP2499_009 step 5 first failed the case when the modal closed after
**Get Quote**. The AC says the result renders "in the same modal" but does not say where a
failure's error appears, so the step now re-opens the modal, judges only "error shown" and
"no value discarded", and records a closed modal against known bug AP-2528. No guessed
assertion remains.

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| — | No gap — both re-designed cases cover the AC halves they target | — | — | — |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. AP2499_005 cites REQ-003 AC 1, REQ-002, Q-004 and Q-011; AP2499_009 cites REQ-005
  AC 1 and Q-007 — all exist in the analysis.

**Unresolved Open Questions affecting coverage:**
- None for these two cases. Q-002 (Humania dealer, test data) stays Open and affects only
  AP2499_013, which is unchanged and stays BLOCKED.
- Not a question but a coverage limit, stated plainly: **REQ-005's failure half is tested
  for creditors only.** No Story defines a GAP failure trigger, so a GAP modal that wipes the
  dealer's entries on a provider error would not be caught in this cycle.
- The co-borrower half of the AP-2405 trigger ("DOB of Co-Debtor is required") is not run:
  the co-applicant form requires a date of birth (`domain`, AP-2504 map), so that state
  cannot be created through the UI.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | After the date-of-birth failure, typing the date of birth into the modal's financing form and pressing Get Quote again prices the creditors quote | State transition | A dealer who fixes the missing date of birth after the error still cannot get a price without closing the modal — the detour the ticket removes comes back through the retry | Medium |
| 2 | A creditors quote for a borrower with no date of birth is refused before Chubb is called, and no creditors row is stored on the quote | Cross-entity | A refused request still leaves a half-made creditors line on "Summary of products", which could reach a contract with no age-based premium | Medium |
| 3 | Re-opening the GAP modal after AP2499_005 and saving the financing unchanged does not write a date of birth into the stored financing | Error guessing | A save that silently fills Date of birth with a default (today, or `1900-01-01`) would change the borrower's age sent to Chubb without the dealer seeing it | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Cross-entity | Check that what this feature produces is read correctly by the next feature in the workflow. |

No other candidates surfaced; none were dropped.

---

## Recommendation

AP2499_005 and AP2499_009 are ready for execution as designed: each traces to a real
acceptance criterion, asserts only what the AC, an Answered question or an Accepted
observation states, and stops BLOCKED with a named reason when its date-of-birth set-up
cannot be made or Chubb still prices the request. No Pass 1 gap needs promoting. The three
Pass 2 proposals are Medium or Low and can wait for the next design pass; if the
orchestrator wants one more case in this cycle, proposal 1 (retry after fixing the date of
birth) is the most useful, because it is the dealer's real next move after the error.
