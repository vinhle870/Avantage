# Test Execution Report

**Report ID:** TR-20260906-AP2445
**Project:** Avantage Plus v2 — Permaplate
**Test Cycle:** AP-2445 — Permaplate conditions appended to the contract PDF (REQ-007)
**Application version:** Avantage Plus System v2.0.0 on v2staging. Deployed to Staging 2026-09-03; 5 repositories touched.
**Date:** 2026-09-06
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ⚠️ CONDITIONAL PASS — Ship with conditions

**Rationale:** The English conditions merge correctly and are proven identical to the approved document, and the defect the ticket's own author reported is fixed — but criterion 2, the language, was never tested because nobody has said which setting selects it.

---

## Executive Summary

This story appends the Permaplate product conditions to the contract PDF, so the terms a
client agrees to travel with the document they sign. Five test cases were run: three
passed, one was blocked and one was skipped.

**The most important result is that the defect this ticket carried against itself is
fixed.** Its author reported on 2026-09-01, with a screen recording, that "the PDF
condition is not loading". On the build now on staging the conditions merge correctly. The
contract PDF is five pages — page 1 the contract, pages 2 to 5 the conditions — and the
merged conditions text was compared character by character against the approved English
document attached to this ticket: **28,804 characters, identical, zero differences.**
Clients are receiving exactly the approved terms. That open defect can be closed.

The conditions also appear identically in the administrator's view: the PDF served in the
admin contract page is byte-for-byte the same file the dealer downloads, so support staff
see exactly what the client received.

Two things were not proven. **Criterion 2 — that the conditions appear in the respective
language — was never tested**, because nothing states which setting decides the language.
Only English was ever produced. And the check that this story's shared document-merging
code has not damaged the *warranty* contract PDF could not be run at all, because the
warranty contract list offers no download control.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 1 of 1 (REQ-007) |
| Acceptance criteria proven | **1 of 2** |
| Total test cases | 5 |
| Passed | 3 (100% of the 3 judged) |
| Failed | 0 (0%) |
| Blocked | 1 |
| Skipped | 1 |
| **Pass rate** | **100%** of those judged |
| Pass rate threshold | 85% |
| Threshold met? | ✅ Yes — but on only 3 of 5 cases |

**The pass rate flatters this story and should not be read alone.** Three cases passed
cleanly, but two of the five could not be judged, and one of those two is half the
acceptance criteria.

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 |
| Low | 0 | 0 | 0 |
| **Total** | **0** | **0** | **0** |

**One pre-existing defect confirmed FIXED:** the conditions-PDF failure reported by Ken
Nguyen on this ticket on 2026-09-01.

---

## Exit Criteria Assessment

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| Every High-priority case executed | All | 2 of 3 High cases executed; 1 blocked | ⚠️ |
| Pass rate | ≥ 85% | 100% of the 3 judged | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 2 | 0 | ✅ |
| Every acceptance criterion has an executed case | All 2 | **1 of 2** | ❌ |
| Defects filed with evidence | All | None to file | ✅ |

**One exit criterion fails:** criterion 2 has no executed case.

---

## Requirement Coverage

| Acceptance criterion | Test case | Result |
|---|---|:---:|
| 1 — The contract contains the conditions PDF | AP2445_001, AP2445_002, AP2445_004, AP2445_005 | ✅ Proven conclusively |
| 2 — The conditions are in the respective language | AP2445_003 | 🚫 **Not tested** |

### What was actually observed

| Item | Value |
|---|---|
| Contract PDF | `permaplate-7.pdf`, 478,824 bytes, `%PDF-1.4`, **5 pages** |
| Page 1 | The contract — "APPEARANCE PROTECTION WARRANTY PROGRAM", contract `PNA-0000000007` |
| Pages 2–5 | The conditions — "TERMS AND CONDITIONS OF THE APPEARANCE PROTECTION WARRANTY PROGRAM", footers "Page 1 of 4" … "Page 4 of 4" |
| Reference document | `PP-OneB-Av_5-2026_EN_FINALE_1 - logo AV+.pdf`, 473,507 bytes, fetched from this ticket's attachments |
| Text comparison | Reference 28,804 characters; merged conditions 28,804 characters; **character-by-character identical** |
| Revision marker | "9/2026" present in both |
| Admin view | `/admin/permaplate-contract/7/pdf` — 478,824 bytes, identical size and page structure to the dealer download |
| Language produced | **English only** |

**Half of Q-008 is now answered:** the conditions are appended **after** the contract, not
before it. Page 1 is the contract. This is the opposite of the comparable AP-2437 work,
where the appended form was page 1 — so the answer was genuinely not obvious.

---

## Defect Summary

**No new defects were found.**

One pre-existing defect is confirmed fixed — see the Executive Summary.

---

## Test Artifacts

| Artifact | Path |
|---|---|
| Requirement | `requirements/AP-2445-permaplate-conditions-pdf.md` |
| Requirements analysis | `qa-artifacts/1-requirements-analysis/PERMAPLATE_requirements-analysis.md` → REQ-007 |
| Test plan | `qa-artifacts/2-test-plan/PERMAPLATE_test-plan.md` |
| Test cases | `qa-artifacts/3-test-cases/AP2445_TestCases_001-005.md` |
| Peer review | `qa-artifacts/3-test-cases/permaplate/MissingTestCases_TechniqueReview_2026-09-06.md` |
| Execution log | `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2445/` — 2 files |
| Reference documents | Attachments 13894 (EN) and 13893 (FR) on this ticket |

---

## Risks and Observations

| Item | Severity of the gap | Note |
|---|---|---|
| **The language criterion was never tested** | High | Nothing states which setting selects the conditions language — the portal setting, the client's province, or a field on the contract. The one contract produced was created with the portal in English, for a client in **Québec**, and received the English document. That is equally consistent with the portal driving the choice and with English being hard-coded. Producing a French contract without knowing which lever to pull would have proved nothing either way. |
| **What a Quebec client stands to lose** | — | A client who receives terms in a language they do not read has not meaningfully agreed to them. This dealership's province is QC and French is the working language of most of its clients, so this is the more likely path in production, not the edge case. |
| **The warranty-PDF regression is uncovered** | Medium | The warranty contract list at `/warranty` offers **no download, print or PDF control** on any of its 25 rows, so there is no comparable route through which to re-test. The risk this case existed to cover — shared merge code damaging another contract type — is real and unchecked. The comparable AP-2437 work merged a form into the Chubb contract by a similar route, so it is not a theoretical concern. |
| Missing-language document behaviour | Low | Nothing says what happens if the document for the required language is absent. Only two documents exist, both attached here, so there is no third language to test with and no way to remove one from the screen. |
| Page order | — | Now established as contract-then-conditions. Worth confirming that is intended, since AP-2437 did the opposite. |

---

## Recommendations

1. **Close the defect reported on this ticket on 2026-09-01.** It is fixed and the evidence is conclusive.
2. **Answer Q-008 — which setting selects the conditions language — then re-run AP2445_003.** Until that is done, half of this story is unverified, and it is the half that matters most in Quebec.
3. **Confirm the page order is intended:** contract on page 1, conditions on pages 2 to 5.
4. **Find a route to a warranty contract PDF** and run the merge regression check. If none exists in the interface, that is worth knowing in its own right.
5. Ship the English path with confidence. It is proven to the byte.

---

## Sign-off

| Role | Name | Status |
|---|---|:---:|
| QA execution | QA Agent — STLC pipeline | Complete |
| QA review | Vinh Le - QC | Pending |
| Development | Minh Lưu | Nothing to fix; answer which setting drives the language |
| Product Owner | Ken Nguyen | Confirm page order; confirm the language rule |

**Ticket status not changed — AP-2445 remains at QC.** Recommend it does not advance until
criterion 2 has been tested, even though no defect is open against it.
