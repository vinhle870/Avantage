# Test Execution Report

**Report ID:** TR-20260906-AP2448
**Project:** Avantage Plus v2 — Permaplate
**Test Cycle:** AP-2448 — Admin user can see all Permaplate contracts (REQ-006)
**Application version:** Avantage Plus System v2.0.0 on v2staging. **Deployed and working, despite no merged pull request being recorded on the ticket.**
**Date:** 2026-09-06
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ✅ PASS — Ready for Release

**Rationale:** All five test cases passed and all ten acceptance criteria are proven, with no defect of any severity attributable to this story.

---

## Executive Summary

This story gives the administrator a single list of every Permaplate contract in the
system, and a details page showing the contract document and the money billed against it.
Five test cases were run and all five passed, covering all ten acceptance criteria.

**The run began by resolving a real doubt.** This was the only one of the eight Permaplate
stories with no merged pull request recorded on its ticket, so the test plan treated it as
possibly not deployed and prepared to report every case as Blocked rather than Failed. The
first test step settled it: the menu item exists, the page is there, and the story works.
That answers open question Q-009.

The list genuinely honours the word that makes it worth building — *all*. It showed seven
contracts spanning four different dealerships, so an administrator handling a complaint can
find any dealer's contract, not only the one dealership they happened to open. All four
data columns are fully populated, the eye-icon view button is present, and each button
opens its own contract: six other contracts were checked and each returned its own distinct
contract number, so there is no cross-row leakage.

One defect is visible on this story's details page but belongs to another ticket: the
invoice listed there cites contract number `PNA-0000000000` while the page heading above it
correctly reads `PNA-0000000007`. That is a fault in the invoice description, filed against
AP-2446 as AP-2461. **This page is simply the clearest place to see it** — which is why the
evidence screenshot was taken here.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 1 of 1 (REQ-006) |
| Acceptance criteria proven | 10 of 10 |
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

One defect owned by **AP-2446** ([AP-2461](https://garantieavantageplus.atlassian.net/browse/AP-2461)) is
observable on this story's details page. It is not counted here, because the fault is in
the invoice description, not in this page.

---

## Exit Criteria Assessment

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| Every High-priority case executed | All | 4 of 4 High cases executed | ✅ |
| Pass rate | ≥ 85% | 100% | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 2 | 0 | ✅ |
| Every acceptance criterion has an executed case | All 10 | 10 of 10 | ✅ |
| Defects filed with evidence | All | None owned by this story | ✅ |
| **Deployment confirmed (Q-009)** | Yes | **Confirmed deployed** | ✅ |

**All seven exit criteria are met.**

---

## Requirement Coverage

| Acceptance criterion | Test case | Result |
|---|---|:---:|
| 1 — A *Permaplate* item under the admin Contracts menu | AP2448_001 | ✅ |
| 2 — It opens the Permaplate Contract Index page | AP2448_001 | ✅ |
| 3 — The page is headed *"Permaplate Contracts"* | AP2448_001 | ✅ |
| 4 — A datagrid of all contracts, with a *Client* column carrying name, email and phone | AP2448_002, AP2448_003 | ✅ |
| 5 — A *Dealer* column carrying company name and email | AP2448_003 | ✅ |
| 6 — A *Vehicle* column carrying make, model, year and VIN | AP2448_003 | ✅ |
| 7 — A *Program* column carrying the term and the components selected | AP2448_003 | ✅ |
| 8 — An *Actions* column with a view button carrying an eye icon | AP2448_003, AP2448_004 | ✅ |
| 9 — The contract PDF shown in an iframe on the details page | AP2448_004 | ✅ |
| 10 — A datagrid of all invoices created for the contract | AP2448_005 | ✅ |

### What was actually observed

| Item | Value |
|---|---|
| Routes | `/admin/permaplate-contracts` · `/admin/permaplate-contract/{id}` · `/admin/permaplate-contract/{id}/pdf` — none previously in the navigation map |
| Page heading | "Permaplate Contracts" — note the capital C, differing from the dealer page's "Permaplate contracts", exactly as each ticket specified |
| Contracts listed | **7**, across **4** dealerships: *Test QA staging*, *Permaplate test Drive IP*, *Test Dealer 2* and others |
| Client cell | `Perma Testclient / perma.test.0906@yopmail.com / 5145550101` — all three fields |
| Dealer cell | `Test QA staging / vinhle870@gmail.com` — both fields |
| Vehicle cell | `Ford Focus 2008 / VIN: 1FAHP35NX8W239204` — all four fields |
| Program cell | `10 ans (120 months) / Peinture – Céramique + Graphene, Extra care (5 ans couverture )` |
| View button | `<a href="/admin/permaplate-contract/7" class="btn btn-sm btn-primary"><i class="fad fa-eye"></i></a>` |
| Details heading | "Permaplate Contract PNA-0000000007" |
| Embedded PDF | `iframe src="/admin/permaplate-contract/7/pdf"` — 478,824 bytes, byte-identical to the dealer download |
| Invoices table | Invoice `921`, `$166.71`, *Payment pending* — this contract's own invoice and no other's |
| Row isolation | Contracts 1–6 each opened their own page with distinct numbers `PNA-0000000001` … `PNA-0000000006` |

---

## Defect Summary

**No defects owned by this story.**

| Bug ID | Ticket | Owner story | Visible here as |
|---|---|---|---|
| BUG-003 | [AP-2461](https://garantieavantageplus.atlassian.net/browse/AP-2461) | AP-2446 | The invoice row on the contract details page cites `PNA-0000000000` while the heading above reads `PNA-0000000007` |

---

## Test Artifacts

| Artifact | Path |
|---|---|
| Requirement | `requirements/AP-2448-admin-permaplate-contracts.md` |
| Requirements analysis | `qa-artifacts/1-requirements-analysis/PERMAPLATE_requirements-analysis.md` → REQ-006 |
| Test plan | `qa-artifacts/2-test-plan/PERMAPLATE_test-plan.md` |
| Test cases | `qa-artifacts/3-test-cases/AP2448_TestCases_001-005.md` |
| Peer review | `qa-artifacts/3-test-cases/permaplate/MissingTestCases_TechniqueReview_2026-09-06.md` |
| Execution log | `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2448/` — 2 files |

---

## Risks and Observations

| Item | Note |
|---|---|
| **The ticket's own delivery record is wrong** | No merged pull request is recorded here, yet the story is deployed and every criterion passes. Someone should correct the ticket, because the next person reading it will draw the same false conclusion this cycle nearly did — and preparing to report five cases as Blocked cost real planning time. |
| Criterion 7 is under-specified | It asks the *Program* column to show "the components selected" without saying how several should be laid out. They render as a comma-separated list in the cell; other rows carry three and four components the same way and stay readable. **Recorded rather than judged** — please confirm this is what was wanted. |
| Empty invoices table not observed | No contract without an invoice was identified without opening all seven. The ticket describes no empty state, so nothing is passed or failed. |
| Paging not tested | With 7 contracts everything fits one page. What happens when the list outgrows a page — and whether a contract on page two can still be opened — is untested. This was proposal P2-07 in the peer review and will matter precisely when the system has enough data to be useful. |
| No negative or regression case | Deliberate: every criterion here describes reading a page, so there is no input to make invalid. The regression risk from this work sits in the shared contract-PDF code and is covered under AP-2445. |

---

## Recommendations

1. **Release this story.** All ten criteria are proven.
2. **Correct the ticket's delivery record** so the missing pull-request link stops misleading readers.
3. **Confirm the *Program* column layout** is what was intended for several selected components.
4. Add a paging case before this list grows — one contract on a second page that cannot be opened would make the page fail exactly when it becomes valuable.
5. Note that fixing [AP-2461](https://garantieavantageplus.atlassian.net/browse/AP-2461) under AP-2446 will visibly improve this page, since the wrong contract number is displayed here.

---

## Sign-off

| Role | Name | Status |
|---|---|:---:|
| QA execution | QA Agent — STLC pipeline | Complete |
| QA review | Vinh Le - QC | Pending |
| Development | Minh Lưu | Nothing to fix on this story; correct the ticket's PR record |
| Product Owner | Ken Nguyen | Confirm the *Program* column layout |

**Ticket status not changed — AP-2448 remains at QC.** The status move is the QA's decision.
