# Test Execution Report

**Report ID:** TR-20260906-AP2456
**Project:** Avantage Plus v2 — Permaplate
**Test Cycle:** AP-2456 — Remove retail pricing from Permaplate contracts and invoices (REQ-008)
**Application version:** Avantage Plus System v2.0.0 on v2staging. 1 pull request merged.
**Date:** 2026-09-06
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ⚠️ CONDITIONAL PASS — Ship with conditions

**Rationale:** All five surfaces are clean and all five acceptance criteria pass, but the ticket never names the field it removes, so each pass rests on "no retail price is visible" rather than on "the named field is gone" — a weaker proof, and the condition is that someone confirms the field name.

---

## Executive Summary

This story strips the consumer-facing retail price from every Permaplate surface a dealer
sees. Five test cases were run, one per surface, and all five passed. No defects were
found.

The result is clean everywhere it was checked. The quote form shows a single figure per
option, each prefixed *"Cost:"*. The quote details page shows *"Cost: 145$"* and nothing
else. The admin option form and its datagrid carry one price field only, labelled *"Dealer
Cost"*, and the word "retail" appears nowhere on the page. The invoice description names
the product, client, vehicle and dealer and carries no price at all. And the contract PDF —
the document the client actually keeps — carries **no money figure whatsoever** and no tax
line, satisfying both halves of criterion 3.

**The caveat matters more than the pass rate.** This ticket has no description at all and
never names the field being removed. Proving a field is gone properly requires knowing
which field it was; a field absent because it was removed looks identical to a field absent
because the page failed to load. Every case therefore worked around it the same way:
recording every money value on the surface, confirming none is presented as a retail price,
**and confirming the surrounding content on that surface is still present and working** so
that a broken section is not mistaken for a successful removal.

That is honest testing of an under-specified requirement, but it is weaker than checking a
named field disappeared. **If the developer confirms what the field was called, these five
passes can be upgraded from inference to verification.**

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 1 of 1 (REQ-008) |
| Acceptance criteria proven | 5 of 5 — by absence, not by field name |
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
| Every case executed | All 5 | 5 of 5 | ✅ |
| Pass rate | ≥ 85% | 100% | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 2 | 0 | ✅ |
| Every acceptance criterion has an executed case | All 5 | 5 of 5 | ✅ |
| Defects filed with evidence | All | None to file | ✅ |
| **Removal verified against a named field** | Yes | **No — the field name is unknown (Q-006)** | ❌ |

**Six of seven exit criteria are met.** The one that fails is the quality of the proof, not
the result.

---

## Requirement Coverage

| Acceptance criterion | Surface | Test case | Result |
|---|---|---|:---:|
| 1 — No retail pricing on the Permaplate quote form | `/quote/{id}/permaplate` | AP2456_001 | ✅ |
| 2 — No retail pricing in the quote details Permaplate section | `/quote/{id}/details` | AP2456_002 | ✅ |
| 3 — No retail pricing **and no taxes** on the generated PDF | the contract PDF | AP2456_003 | ✅ |
| 4 — No retail pricing in the invoice description | `/invoice` | AP2456_004 | ✅ |
| 5 — No retail pricing field on the admin option form and datagrid | `/admin/permaplate/{id}/…` | AP2456_005 | ✅ |

### What was actually observed

| Surface | Money values present | Retail price? | Taxes? |
|---|---|:---:|:---:|
| Quote form | `Cost: 80$` · `Cost: 40$` · `Cost: 75$` · `Cost: 70$` — one per option, each prefixed "Cost:" | No | No |
| Quote details | `Cost: 145$` | No | No |
| Contract PDF page 1 | **None.** Program Summary reads *"Coverage commitments: As per selected protection products"*; the two options are listed by name with no price | No | No |
| Invoice description | **None.** Names product, client, vehicle, VIN and dealer only | No | n/a |
| Admin option datagrid | One column: **Dealer Cost** (75.00, 70.00, 80.00, 40.00 …) | No | No |
| Admin option form | One field: **Dealer Cost** = `70.00`. Labels are Option name · Vehicle age eligibility · Dealer Cost · Enabled · Parent | No | No |

A text search of the contract PDF's page 1 for `$`, `tax`, `TPS`, `TVQ`, `GST`, `QST`,
`retail` and `détail` matched **only the administrator's telephone numbers**.

The admin option form also confirmed that this ticket's *removal* and AP-2444's *addition*
of the **Parent** field coexist on the same form without conflict — the point of running
that case as a regression check.

---

## Defect Summary

**No defects were found.**

---

## Test Artifacts

| Artifact | Path |
|---|---|
| Requirement | `requirements/AP-2456-remove-retail-pricing.md` — note the ticket's description field is empty |
| Requirements analysis | `qa-artifacts/1-requirements-analysis/PERMAPLATE_requirements-analysis.md` → REQ-008 |
| Test plan | `qa-artifacts/2-test-plan/PERMAPLATE_test-plan.md` |
| Test cases | `qa-artifacts/3-test-cases/AP2456_TestCases_001-005.md` |
| Peer review | `qa-artifacts/3-test-cases/permaplate/MissingTestCases_TechniqueReview_2026-09-06.md` |
| Execution log | `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2456/` — 1 file, plus shared evidence under AP-2445 and AP-2447 |

---

## Risks and Observations

| Item | Severity of the gap | Note |
|---|---|---|
| **The removed field is never named (Q-006)** | Medium | The ticket has no description and names no field, so all five passes rest on inference. Each case mitigated this by confirming the surrounding fields still work, but the mitigation is not the same as knowing the field name. **This is the weakest-specified story of the eight.** |
| **Taxes: PDF-only, deliberate or not?** | Medium | Criterion 3 removes taxes from the PDF and no other criterion mentions taxes. The PDF is clean. But the **invoice still carries tax** — $166.71 against a $145 cost. Please confirm the tax removal was meant to be PDF-only. |
| The invoice amount question overlaps AP-2446 | Medium | Criterion 4 removes the retail price from the invoice *description*, implying an amount remains, but neither this ticket nor AP-2446 says what that amount should be. The run established it empirically as dealer cost plus Quebec tax. Separately, the alert announcing that invoice quotes the pre-tax figure — filed as [AP-2460](https://garantieavantageplus.atlassian.net/browse/AP-2460) against AP-2446. |
| A write test was not performed on the option form | Low | AP2456_005's step to save the form twice was **not run**: the field set was read instead. Writing twice to a shared option definition risked leaving it altered if the run were interrupted, for no evidence the read did not already give. Stated rather than glossed. |
| No before-and-after comparison | Low | The surfaces were never captured on a pre-change build, so the removal is proven by current state rather than by difference. |

---

## Recommendations

1. **Ship this story**, subject to the condition below.
2. **Answer Q-006 — what was the retail-pricing field called on each of the five surfaces?** One reply upgrades all five passes from "no second price is visible" to "the named field is gone". This is the single highest-value action on this ticket.
3. **Confirm the tax rule:** criterion 3 removes taxes from the PDF only. Is the tax on the invoice intended to stay?
4. **Add a description to the ticket**, even retrospectively. It is the only one of the eight with an empty description, and that absence is what made this story harder to test than any of the others.
5. Record the surviving labels — *"Cost:"* on the dealer surfaces, *"Dealer Cost"* in the admin — as the expected strings, so a future change is caught as a regression.

---

## Sign-off

| Role | Name | Status |
|---|---|:---:|
| QA execution | QA Agent — STLC pipeline | Complete |
| QA review | Vinh Le - QC | Pending |
| Development | Minh Lưu | **Confirm the removed field's name (Q-006)** |
| Product Owner | Ken Nguyen | Confirm the tax rule; add a description to the ticket |

**Ticket status not changed — AP-2456 remains at QC.** The status move is the QA's decision.
