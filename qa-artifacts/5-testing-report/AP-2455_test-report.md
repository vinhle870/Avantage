# Test Execution Report

**Report ID:** TR-20260906-AP2455
**Project:** Avantage Plus v2 — Permaplate
**Test Cycle:** AP-2455 — Admin user can unlink a Permaplate product from a dealer (REQ-002)
**Application version:** Avantage Plus System v2.0.0 on v2staging. 1 pull request merged.
**Date:** 2026-09-06
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ✅ PASS — Ready for Release

**Rationale:** All five test cases passed and all six acceptance criteria are proven, with no defects found — and the cycle's highest-risk unknown, whether unlinking destroys signed contracts, was answered safely.

---

## Executive Summary

This story lets an administrator withdraw a Permaplate product from a dealer so it stops
appearing when that dealer creates a quote. Five test cases were run and all five passed,
covering all six acceptance criteria. **No defects were found.**

**The most valuable result answers the question that worried the team most going in.**
Nobody had stated what happens to Permaplate contracts already signed for a product when
that product is withdrawn, and the wrong answer would have destroyed a record the business
is required to keep and a client is entitled to a copy of. It was tested deliberately,
against a full before-picture, and **nothing is lost**: after unlinking, the contract stayed
in both the dealer and the admin lists, its PDF still downloaded byte-for-byte identical,
and the quote kept showing what was sold. Only the *Edit* and *Create Contract* paths were
withdrawn. **The design is better than the ticket described** — the signed record keeps its
document while the selling path closes.

The confirmation modal matches its criteria word for word, including the substituted dealer
company name and product title. It also carries a **"No" button** that the ticket never
described, giving an administrator a way out of a mis-click; dismissing with it changed
nothing.

Two further behaviours exceed what was asked. After unlinking, the rule that the dealer
gets no Permaplate button is **enforced on the server** — typing the address directly
redirects away, so it cannot be bypassed. And unlinking is fully **reversible**: re-linking
restored the product on the dealer's quote form immediately, so a withdrawal made in error
can be undone without a developer.

This batch ran last in the cycle by design, because unlinking removes the product every
other story depends on.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 1 of 1 (REQ-002) |
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
| Environment restored after a data-changing story | Yes | Dealer 1380 returned to its found state | ✅ |

**All seven exit criteria are met.**

---

## Requirement Coverage

| Acceptance criterion | Test case | Result |
|---|---|:---:|
| 1 — An unlink button when the products table is not empty | AP2455_001 | ✅ |
| 2 — A confirmation modal titled *"Unlink a permaplate product"* | AP2455_002 | ✅ |
| 3 — The modal names the dealer and the product | AP2455_002 | ✅ |
| 4 — The modal has a *"Continue"* button | AP2455_001, AP2455_002 | ✅ |
| 5 — A success message appears and the row is removed | AP2455_001, AP2455_003 | ✅ |
| 6 — The product no longer shows when the dealer creates a quote | AP2455_004, AP2455_005 | ✅ |

### What was actually observed

| Item | Value |
|---|---|
| Unlink control | `<a data-toggle="modal" data-target="#myModal" data-href="/admin/dealer/1380/permaplate/3/unlink" class="btn btn-light btn-sm">` — a genuine modal, unlike AP-2447's link form |
| Modal title | "Unlink a permaplate product" — exact match |
| Modal body | "Please confirm that you want to unlink dealer **Test QA staging** to the permaplate **10 ans**" — the template's placeholders correctly substituted |
| Modal buttons | **Continue** and **No** |
| Cancel behaviour | Dismissing with *No* closed the modal; the product row remained |
| Success message | "Permaplate product unlinked" |
| Table after unlink | 0 rows, empty state "No entities found" |
| Contract after unlink | Still listed in the dealer list, identical values; download HTTP 200, `application/pdf`, **478,824 bytes — byte-identical to before** |
| Admin list after unlink | Still 7 rows, still including the affected contract |
| Quote after unlink | Still shows "Peinture – Céramique + Graphene, Extra care (5 ans couverture ) Cost: 145$" with its Download link; only Edit and Create Contract withdrawn |
| URL bypass | `GET /quote/{id}/permaplate` while unlinked → **redirect** to the quote details page |
| After re-linking | Route reachable again; product offered on the quote form |

---

## Defect Summary

**No defects were found.**

---

## Test Artifacts

| Artifact | Path |
|---|---|
| Requirement | `requirements/AP-2455-admin-unlink-permaplate.md` |
| Requirements analysis | `qa-artifacts/1-requirements-analysis/PERMAPLATE_requirements-analysis.md` → REQ-002 |
| Test plan | `qa-artifacts/2-test-plan/PERMAPLATE_test-plan.md` — §3.4 fixes this batch as last |
| Test cases | `qa-artifacts/3-test-cases/AP2455_TestCases_001-005.md` |
| Peer review | `qa-artifacts/3-test-cases/permaplate/MissingTestCases_TechniqueReview_2026-09-06.md` |
| Execution log | `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2455/` — 4 files |

---

## Risks and Observations

| Item | Note |
|---|---|
| **Q-002 answered, and safely** | Unlinking does not affect existing contracts or quotes. This was the highest-risk unknown of the cycle — the test itself could have destroyed a legally required record. It is worth recording the observed behaviour as *intended* so nobody "fixes" it later into something more destructive. |
| **A cancel path exists but is undocumented** | The *No* button is not in the acceptance criteria. It should be added, so a future change that removes it is caught as a regression rather than accepted as matching the spec. |
| **The success message wording is undocumented** | Criterion 5 requires a message but never says what it should say. *"Permaplate product unlinked"* is recorded here as the expected string for the same reason. |
| **This story proved AP-2447's criterion 6** | AP-2447's rule — no linked product means no Permaplate button — needs a dealership with nothing linked, a state only this story creates. AP2455_004 proved it in **both** directions: absent when unlinked, present once linked. |
| Environment left as found | Dealer 1380 was discovered with **no** Permaplate products linked and was deliberately returned to that state, rather than left with a product linked for convenience. **Anyone continuing this testing must link one first** at `/admin/dealer/1380/permaplate/link`, or the dealer-side Permaplate surfaces are unreachable. |
| A concurrent-edit case is unrun | Unlinking while a dealer has that product selected on an unsaved quote in another tab was not tested. The ticket addresses a form already open nowhere. This was proposal P2-02 in the peer review. |
| Only one dealership, one product | The unlink was exercised on a single product on a single dealership. A dealership with several linked products, unlinking one of them, was not tested. |

---

## Recommendations

1. **Release this story.** It is one of the two cleanest results in the Permaplate set.
2. **Add the *No* button and the success-message wording to the acceptance criteria**, so both are protected by the spec rather than only by this report.
3. **Record "unlinking preserves signed contracts" as intended behaviour** in the product documentation. It is the correct design, it was not specified, and an unspecified good behaviour is one a later change can remove without anyone noticing.
4. Add the concurrent-edit case (P2-02): unlink while a dealer has the product selected on an unsaved quote, then save. A dealer saving a quote for a product they may no longer sell is the plausible failure this story does not address.
5. Note for whoever tests Permaplate next: **the dealership currently has no product linked.** Link one before starting.

---

## Sign-off

| Role | Name | Status |
|---|---|:---:|
| QA execution | QA Agent — STLC pipeline | Complete |
| QA review | Vinh Le - QC | Pending |
| Development | Minh Lưu | Nothing to fix |
| Product Owner | Ken Nguyen | Add the *No* button and the message wording to the criteria |

**Ticket status not changed — AP-2455 remains at QC.** The status move is the QA's decision.
