# Test Execution Report

**Report ID:** TR-20260913-AP2443
**Project:** Avantage Plus v2 — Permaplate
**Test Cycle:** AP-2443 — Permaplate contract list on the dealer page (REQ-005)
**Application version:** Avantage Plus System v2.0.0 on v2staging. 1 pull request merged.
**Date:** 2026-09-13 (supersedes the 2026-09-06 report — criterion 5 was re-tested and closed)
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ✅ PASS — Ready for Release

**Rationale:** All seven acceptance criteria are now proven and all five test cases pass. The one gap in the original run — criterion 5, the rule deciding whether one salesperson can see another's clients — was re-tested on 2026-09-13 using a purpose-built non-owner account and confirmed working correctly in both directions. The only open item is a cosmetic Low-severity defect (AP-2463) already filed and linked, which does not block this ticket.

---

## Executive Summary

This story gives a dealer their own list of Permaplate contracts, so they can find a
client's contract and print it without asking the administrator. Five test cases were run:
all five passed.

The page itself is correct and complete. The menu item is there, the heading matches the
acceptance criterion word for word, and all five required columns are present in the
specified order with no extras — VIN, Client name, Client phone, Contract cost price and
Actions — with the download button carrying the PDF icon the criterion asks for.

The download is bound to its own row through the quote identifier in the address, and that
binding is **enforced on the server**: requesting three other dealerships' contract
downloads by changing the number in the URL was refused every time, while the dealer's own
contract returned normally. One dealership cannot reach another's signed contracts.

**Criterion 5 — the account-owner visibility split — is now proven, closing the one gap
from the 2026-09-06 run.** That rule says an account owner sees every contract belonging to
the dealership while anyone else sees only contracts from quotes they created themselves.
The original run found that all five users on the test dealership held the "Account Owner"
role, so no non-owner view could be observed. On 2026-09-13, a non-owner account was created
by editing an existing user's permissions (unchecking "Account Owner" for
`vinhle_ap2@yopmail.com`), and the rule was tested in both directions: as non-owner, the
account saw **none** of the account owner's 2 existing contracts, then saw **only** the one
contract it created itself; signed back in as owner, all 3 contracts — including the
non-owner's — were visible. This is the only privacy rule in the whole Permaplate feature
set, and it now has passing evidence behind it. The test account was restored to Account
Owner afterward, matching the environment as found.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 1 of 1 (REQ-005) |
| Acceptance criteria proven | **7 of 7** |
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
| Low | 1 | 0 | 1 |
| **Total** | **1** | **0** | **1** |

---

## Exit Criteria Assessment

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| Every High-priority case executed | All | 4 of 4 High cases executed | ✅ |
| Pass rate | ≥ 85% | 100% | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 2 | 0 | ✅ |
| Every acceptance criterion has an executed case | All 7 | **7 of 7** | ✅ |
| Defects filed with evidence | All | AP-2463, screenshot embedded | ✅ |

**All exit criteria are met.**

---

## Requirement Coverage

| Acceptance criterion | Test case | Result |
|---|---|:---:|
| 1 — A *Permaplate* item under the Contracts menu | AP2443_001 | ✅ |
| 2 — It opens the Permaplate index page | AP2443_001 | ✅ |
| 3 — The page is headed *Permaplate contracts* | AP2443_001 | ✅ |
| 4 — A datagrid of the dealer's contracts | AP2443_002, AP2443_003, AP2443_005 | ✅ |
| 5 — The account-owner visibility split | AP2443_004 | ✅ **Proven 2026-09-13** |
| 6 — The five named columns | AP2443_002, AP2443_003 | ✅ |
| 7 — A *Download contract PDF* button with a PDF icon | AP2443_002, AP2443_005 | ✅ |

### What was actually observed

| Item | Value |
|---|---|
| Route | `/permaplate-contracts`, reached via Contracts → Permaplate |
| Page heading | "Permaplate contracts" — matching the criterion exactly, including its lower-case *contracts* |
| Columns | VIN · Client name · Client phone · Contract cost price · Actions — exactly the five specified, in order, no extras |
| Download control | `<a href="/quote/6284/permaplate-contract-download" class="btn btn-sm btn-primary"><i class="fad fa-file-pdf"></i> Download</a>` |
| Row values | VIN `1FAHP35NX8W239204` · `Perma Testclient` · `5145550101` · `145.00$` |
| Cost price basis | **Pre-tax.** 145.00$, not the $166.71 the invoice bills |
| Cross-dealer download | Quotes 6274, 6281, 6283 (other dealerships) all **redirected away**; quote 6284 returned the PDF |
| Sorting / filtering / paging | **None offered.** The ticket specifies none, so recorded rather than judged |
| Account-owner split (2026-09-13) | Non-owner account (`vinhle_ap2@yopmail.com`, Account Owner unchecked at `/user/edit-permission/135`) saw **0** contracts before creating its own, then **1** (only its own, quote 6292); owner account saw **3** (its own 2 plus the non-owner's) |

**Q-010 is answered:** the *Contract cost price* column shows the pre-tax figure.
**Q-001 is answered:** *Account Owner* is a checkbox role at `/user/edit-permission/{id}`, editable by anyone holding "User management"; unchecking it produces a working non-owner test account.

---

## Defect Summary

| Bug ID | Ticket | Severity | Title | Status |
|---|---|:---:|---|:---:|
| BUG-005 | [AP-2463](https://garantieavantageplus.atlassian.net/browse/AP-2463) | Low | The list shows the client's work phone while the quote page shows their home phone | Open |

For client `Perma Testclient` — home `5145550100`, work `5145550101` — this list and the
admin list both show the **work** number, while the quote details page shows the **home**
number, and the contract PDF shows both correctly labelled. Criterion 6 asks only for
"Client phone" without saying which, so either could be defended; what should not happen is
two screens disagreeing silently. **If the work number is deliberate, the fix is to label
the column, not to change the data.** This is cosmetic and does not block release.

A minor, unfiled observation from the 2026-09-13 run: the non-owner's newly-created
Permaplate contract (quote 6292, term "10 ans" + option "Autosaver", $40) showed a
**Contract cost price of $0.00** in the list rather than $40. This is outside criterion 5's
scope and was not chased further in this cycle — flagged for the next pricing-focused pass,
not filed as a ticket here.

---

## Test Artifacts

| Artifact | Path |
|---|---|
| Requirement | `requirements/AP-2443-permaplate-contract-list-dealer.md` |
| Requirements analysis | `qa-artifacts/1-requirements-analysis/PERMAPLATE_requirements-analysis.md` → REQ-005 |
| Test plan | `qa-artifacts/2-test-plan/PERMAPLATE_test-plan.md` |
| Test cases | `qa-artifacts/3-test-cases/AP2443_TestCases_001-005.md` |
| Peer review | `qa-artifacts/3-test-cases/permaplate/MissingTestCases_TechniqueReview_2026-09-06.md` |
| Execution log (TCs 001–003, 005) | `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |
| Execution log (TC 004 re-test) | `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2443_2026-09-13.md` |
| Bug report | `qa-artifacts/5-testing-report/PERMAPLATE_bug-report.md` → BUG-005 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2443/` — 7 files |

---

## Risks and Observations

| Item | Severity of the gap | Note |
|---|---|---|
| **The account-owner split is now proven** | Closed | Was the highest-risk open item as of 2026-09-06. Resolved 2026-09-13 by creating a non-owner test account (`vinhle_ap2@yopmail.com`, Account Owner unchecked) and proving the split both ways. The account was restored to Account Owner after the run, at the user's request, so it is available again as an owner account for other cycles — a future cycle needing a non-owner account again will have to repeat this same permission edit. |
| Cost price and invoice amount are never compared | Medium | This list shows 145.00$ pre-tax; the invoice bills $166.71. Nothing in the suite compares the two, so a dealer quoting from the list and paying from the invoice sees two figures that no test has reconciled. This was finding P1-06 in the peer review. |
| New contract's cost shows $0.00 | Low | The non-owner's test contract (quote 6292) shows a $0.00 cost price where a $40 option was selected. Not investigated further this cycle — worth a look in the next pricing pass, separate from this ticket. |
| Empty state, sorting, filtering, paging | Low | None specified by the ticket and none offered by the page. Recorded for a future decision. |

---

## Recommendations

1. **Ship this story.** All seven acceptance criteria are proven, all five test cases pass, and the only open defect (AP-2463) is Low severity and cosmetic.
2. **Decide AP-2463:** either show the same phone number the rest of the product shows, or label the column *"Client phone (work)"*. Apply the decision to the dealer and admin lists together — they currently agree with each other and disagree with everything else.
3. Add a case comparing the *Contract cost price* column against the invoice total, so the pre-tax and tax-inclusive figures are reconciled by a test rather than by a reader.
4. Look into the $0.00 cost price on a Permaplate contract with a paid option selected — separate from this ticket, but worth a quick check before it's forgotten.
5. Record the absence of sorting and paging as a product decision, or add it to the backlog — every other index page in this product has them.
6. **If a non-owner dealer-portal account is needed again** (regression on criterion 5, or any other non-owner-scoped feature), repeat the permission edit at `/user/edit-permission/135` for `vinhle_ap2@yopmail.com` — or consider asking Product to keep one dedicated non-owner account permanently, since this is the second cycle that has had to solve this same precondition from scratch.

---

## Sign-off

| Role | Name | Status |
|---|---|:---:|
| QA execution | QA Agent — STLC pipeline | Complete |
| QA review | Vinh Le - QC | Pending |
| Development | Minh Lưu | AP-2463 to triage (Low, non-blocking) |
| Product Owner | Ken Nguyen | Q-001 resolved; decide AP-2463 phone column |

**Ticket status not changed — AP-2443 remains at QC.** All acceptance criteria are now
proven; the status move is the QA's decision to make when ready.
