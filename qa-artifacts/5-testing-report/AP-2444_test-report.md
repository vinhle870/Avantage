# Test Execution Report

**Report ID:** TR-20260906-AP2444
**Project:** Avantage Plus v2 — Permaplate
**Test Cycle:** AP-2444 — Dealer can select conditional Permaplate options (REQ-003)
**Application version:** Avantage Plus System v2.0.0 on v2staging. Deployed to Staging 2026-08-28; 1 pull request merged.
**Date:** 2026-09-06
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ✅ PASS — Ready for Release

**Rationale:** All five test cases passed and all six acceptance criteria are proven, with no defect of any severity found — the only story in the Permaplate set to come through completely clean.

---

## Executive Summary

This story makes one Permaplate option depend on another: *Extra care* becomes available
only when *Paint* is selected, and the dealer can then decline it. Five test cases were run
and all five passed, covering all six acceptance criteria. **No defects were found.**

Of the eight Permaplate stories, this is the one that needed real business logic rather
than a list or a page, and it is the one built most precisely. Every part of the behaviour
works exactly as specified, including the parts that are easy to get half-right: selecting
the parent both *enables* the child and *ticks it by default*; the child can then be
unticked on its own while the parent stays selected; and de-selecting the parent unticks
**and** disables the child in the same action.

Two safeguards exist that the ticket never asked for. An option cannot be made its own
parent, because the *Parent* select box excludes the option being edited — the mistake is
not merely rejected, it is unofferable. And the parent relationship is carried in the page
markup as `data-parent-id`, so the nesting is real structure rather than a visual
convention.

One question remains open and is not a defect: a two-level chain is configurable, and
nobody has said what should happen at the middle level.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 1 of 1 (REQ-003) |
| Acceptance criteria proven | 6 of 6 |
| Total test cases | 5 |
| Passed | 5 (100%) |
| Failed | 0 (0%) |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **100%** |
| Pass rate threshold | 85% |
| Threshold met? | ✅ Yes |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 |
| Low | 0 | 0 | 0 |
| **Total** | **0** | **0** | **0** |

---

## Exit Criteria Assessment

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| Every High-priority case executed | All | 4 of 4 High cases executed | ✅ |
| Pass rate | ≥ 85% | 100% | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 2 | 0 | ✅ |
| Every acceptance criterion has an executed case | All 6 | 6 of 6 | ✅ |
| Defects filed with evidence | All | None to file | ✅ |

**All six exit criteria are met.**

---

## Requirement Coverage

| Acceptance criterion | Test case | Result |
|---|---|:---:|
| 1 — A *Parent* field on the admin option form | AP2444_001 | ✅ |
| 2 — *Parent* lists only options of the same term | AP2444_001, AP2444_005 | ✅ |
| 3 — A child is shown nested under its parent | AP2444_002 | ✅ |
| 4 — A child is disabled until its parent is selected | AP2444_002, AP2444_003 | ✅ |
| 5 — Selecting the parent enables and ticks the children, each de-selectable | AP2444_003 | ✅ |
| 6 — De-selecting the parent unticks and disables the children | AP2444_004 | ✅ |

### What was actually observed

| Behaviour | Observed state |
|---|---|
| The *Parent* field | Present and labelled exactly "Parent", a select box, at `/admin/permaplate/{termId}/option/{optionId}/edit` |
| Its contents | All options of term 3, **excluding option 18 itself** — self-parenting cannot be selected |
| The child in the page markup | `option_18` carries `data-parent-id="17"`; `disabled = true`, `checked = false` on load |
| Parent ticked | Child `disabled = false` **and** `checked = true` — both halves of criterion 5 |
| Child unticked alone | `checked = false`, `disabled = false`; parent stays `checked = true` — the opt-out works |
| Parent unticked | Child `checked = false` **and** `disabled = true` together — not the partial failure watched for |

**"Term" is now defined.** A term *is* the Permaplate product record: `/admin/permaplate`
is headed "Permaplate Terms", and each term — `10 ans`, `3 ans`, `5 ans`,
`3 Ans (Drive IP)` — owns a set of options. This answers Q-003's first half and is worth
writing into the project's domain knowledge.

---

## Defect Summary

**No defects were found.**

---

## Test Artifacts

| Artifact | Path |
|---|---|
| Requirement | `requirements/AP-2444-permaplate-conditional-options.md` |
| Requirements analysis | `qa-artifacts/1-requirements-analysis/PERMAPLATE_requirements-analysis.md` → REQ-003 |
| Test plan | `qa-artifacts/2-test-plan/PERMAPLATE_test-plan.md` |
| Test cases | `qa-artifacts/3-test-cases/AP2444_TestCases_001-005.md` |
| Peer review | `qa-artifacts/3-test-cases/permaplate/MissingTestCases_TechniqueReview_2026-09-06.md` |
| Execution log | `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2444/` — 3 files |

---

## Risks and Observations

| Item | Note |
|---|---|
| **A two-level chain is configurable** | Option 19's *Parent* select offers option 18, which is itself already a child of 17. So a chain *Paint → Extra care → third option* can be built, and the ticket says nothing about what the middle level should then do. **No chain was created** — confirming it was possible needed only a read, and building one would have left shared option configuration altered. This is an open question, not a defect. |
| No shared configuration was changed | The *Extra care* → *Peinture* parent link was **already configured** before the run, so the planned change-and-restore was never needed. The environment is exactly as it was found. |
| Persistence of the de-selected state not proven | AP2444_003 and AP2444_004 proved the opt-out and the disable **on the form**. The final save was made with both options ticked, because quote 6284 was needed intact for the contract stories downstream. So the screen behaviour of criterion 6 is proven; that the empty selection reaches the stored quote is not. Stated rather than implied. |
| Self-referencing and mutual parents | Self-parenting is impossible. Two options each naming the other was not tested, since it would require two writes to shared configuration. |
| Only one parent/child pair tested | *Peinture → Extra care*, the pair the ticket names. A parent with several children was not exercised. |

---

## Recommendations

1. **Release this story.** It is the cleanest result in the Permaplate set.
2. **Answer the nesting question (Q-003, second half):** is a two-level chain intended? If it is, the enable and disable rules need restating for the middle level. If it is not, the *Parent* select should exclude options that already have a parent — a one-line filter that removes the whole ambiguity.
3. Add a follow-up case saving a quote with the child **de-selected** and carrying it through to a contract and PDF, to prove the opt-out reaches the document the client signs. This was proposal P2-03 in the peer review and is the one gap in an otherwise complete story.
4. Write the term/option model into `qa-artifacts/qa-docs/` — the definition established here is a standing product fact that will otherwise be rediscovered next cycle.

---

## Sign-off

| Role | Name | Status |
|---|---|:---:|
| QA execution | QA Agent — STLC pipeline | Complete |
| QA review | Vinh Le - QC | Pending |
| Development | Minh Lưu | Nothing to fix; confirm the nesting rule |
| Product Owner | Ken Nguyen | No action |

**Ticket status not changed — AP-2444 remains at QC.** The status move is the QA's decision.
