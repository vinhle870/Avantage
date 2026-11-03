# Test Execution Report

**Report ID:** TR-20261102-001
**Project:** Avantage Plus v2 — Dealer portal, AP-2428: Dealer Permaplate Contract
**Test Cycle:** AP-2428 single-ticket STLC run, run folder 5.0.0 (the ticket's fix version)
**Application version:** Not known — the Dev site does not show a build number. **Tested on: Dev (v2dev)** `https://v2dev.garantieavantageplus.ca`, by the user's decision; staging was not opened.
**Date:** 2026-11-02
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** 9 of 15 test cases passed (60%), below the 90% threshold, and one High-severity bug is open: no contract PDF can be downloaded on Dev, so a dealer has nothing to give the client to sign.

---

## Executive Summary

The QA agent tested the new Permaplate ("Esthetic protection") contract feature for dealers on the Dev site, with 15 test cases covering all 8 requirements of the ticket. A dealer can find the "Generate Contract" action on a quote, the contract form opens with the vehicle details filled in correctly, and generating the contract works, even when it is clicked twice. But 4 test cases failed and 4 bugs were filed. The most serious one (AP-2512, High) is that the contract PDF cannot be downloaded at all on Dev: every download returns an error page, although the same download worked on staging in October. Three smaller form problems were also found: the client's company is not copied into the form (AP-2513), the province is a free-text box instead of a list (AP-2514), and the dealer's cost is labelled "Total" instead of "Cost Price" (AP-2515). Two more test cases could not be judged, because three questions to the ticket author about the Year field and about taxes are still unanswered. The feature should not be released until the PDF download works and the author answers those questions.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 8 of 8 (every requirement has at least one executed case; REQ-005 and REQ-007 have no passing case) |
| Total test cases | 15 |
| Passed | 9 (60%) |
| Failed | 4 (27%) |
| Blocked | 2 |
| Skipped | 0 |
| **Pass rate** | **60%** (9 of 15 — the pass rate is the share of test cases that passed, counted over every case except skipped ones; blocked cases count as not passed) |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 1 | 0 | 1 |
| Medium | 2 | 0 | 2 |
| Low | 1 | 0 | 1 |
| **Total** | **4** | **0** | **4** |

Defect density: 4 bugs over 15 test cases = 0.27 per test case.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 88% (7 of 8 — AP2428_008 is blocked by unanswered questions Q-002 and Q-003) | ❌ |
| Pass rate | ≥ 90% | 60% (9 of 15) | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 0 | 1 (AP-2512) | ❌ |
| Test report generated | Yes | Yes | ✅ |
| All tracker tickets created | Yes | Yes — AP-2512, AP-2513, AP-2514, AP-2515 | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

Some test cases check more than one requirement, so the rows add up to more than 15.

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Create contract button (AP2428_001, _002, _013) | 3 | 3 | 0 | 0 | 100% |
| REQ-002 — Vehicle information prefill (AP2428_003, _004, _011) | 3 | 2 | 0 | 1 | 67% |
| REQ-003 — Owner information prefill (AP2428_005, _011, _012) | 3 | 1 | 2 | 0 | 33% |
| REQ-004 — Program summary (AP2428_006) | 1 | 1 | 0 | 0 | 100% |
| REQ-005 — Pricing and taxes (AP2428_007, _008) | 2 | 0 | 1 | 1 | 0% |
| REQ-006 — Generate Contract submit (AP2428_009, _011, _012, _015) | 4 | 3 | 1 | 0 | 75% |
| REQ-007 — Contract PDF download (AP2428_010) | 1 | 0 | 1 | 0 | 0% |
| REQ-008 — Values stored at creation (AP2428_014) | 1 | 1 | 0 | 0 | 100% |
| **Total (unique test cases)** | **15** | **9** | **4** | **2** | **60%** |

### Test case results

| TC ID | Title | Priority | Status | Bug |
|---|---|:---:|:---:|---|
| AP2428_001 | A quote with a saved Permaplate selection shows a Create contract button that opens the contract form | High | PASS | — |
| AP2428_002 | A quote with no Permaplate selection does not crash when the contract form is looked for or opened | Medium | PASS | — |
| AP2428_003 | The contract form prefills make, model, VIN, odometer and delivery date from the quote's vehicle | High | PASS | — |
| AP2428_004 | The contract form's Year field is prefilled with the value the ticket specifies | Medium | BLOCKED | — (Q-001) |
| AP2428_005 | The contract form prefills the owner's name, company, address, province, phones and email from the client | High | FAIL | AP-2513, AP-2514 |
| AP2428_006 | The program summary shows term, start date equal to delivery date, end date and every selected option as read-only text | Medium | PASS | — |
| AP2428_007 | The contract form shows a Cost Price for the selected Permaplate options | High | FAIL | AP-2515 |
| AP2428_008 | The contract form shows retail price, subtotal, taxes for the client's province and grand total as the ticket specifies | High | BLOCKED | — (Q-002, Q-003) |
| AP2428_009 | Submitting Generate Contract returns the dealer to the quote details page with a PDF download button | High | PASS | — |
| AP2428_010 | The downloaded contract PDF opens and never shows a vehicle or owner different from the contract form | High | FAIL | AP-2512 |
| AP2428_011 | Submitting the contract form with Last name and VIN cleared does not crash or lose data silently | Medium | PASS | — |
| AP2428_012 | An address edited on the contract form does not crash, and where the edited value ends up is recorded | Medium | FAIL | AP-2512 |
| AP2428_013 | A quote whose contract was already generated does not crash when the create-contract control is looked for | Medium | PASS | — |
| AP2428_014 | An existing contract keeps its cost price after an administrator changes the option's Dealer Cost | Medium | PASS | — |
| AP2428_015 | Double-clicking Generate Contract creates exactly one contract for the quote | High | PASS | — |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | Downloading a Permaplate contract PDF from the quote details page returns an HTTP 500 error page on Dev (AP2428_010, AP2428_012) | High | P1 | REQ-007 | [AP-2512](https://garantieavantageplus.atlassian.net/browse/AP-2512) | Open |
| BUG-002 | "Other name on file (Company's name)" on the Permaplate contract form is empty although the client has a company (AP2428_005) | Medium | P2 | REQ-003 | [AP-2513](https://garantieavantageplus.atlassian.net/browse/AP-2513) | Open |
| BUG-003 | Province on the Permaplate contract form is a free-text box instead of a dropdown of provinces (AP2428_005) | Medium | P2 | REQ-003 | [AP-2514](https://garantieavantageplus.atlassian.net/browse/AP-2514) | Open |
| BUG-004 | The Program Summary on the Permaplate contract form has no "Cost Price" label; the cost is shown as "Total" (AP2428_007) | Low | P3 | REQ-005 | [AP-2515](https://garantieavantageplus.atlassian.net/browse/AP-2515) | Open |

All four are assigned to Ken Nguyen and linked to AP-2428 as *relates to*; AP-2512 also relates to AP-2459.

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2428-dealer-permaplate-contract.md` | 2026-11-01 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2428_requirements-analysis.md` | 2026-11-01 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2428_test-plan.md` | 2026-11-01 |
| Test Cases | `qa-artifacts/3-test-cases/AP2428_TestCases_001-005.md`, `_006-010.md`, `_011-014.md`, `_015-015.md` | 2026-11-01 |
| Test-case review findings | `qa-artifacts/3-test-cases/AP2428_ReviewFindings_2026-11-01.md` | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md` | 2026-11-02 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2428_bug-report.md` | 2026-11-02 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/` (14 files) | 2026-11-02 |
| Review record (R1–R3) | `qa-artifacts/7-reviews/AP-2428_review.md` | 2026-11-01 – 2026-11-02 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2428_test-report.md` | 2026-11-02 |

---

## Risks and Observations

- **Tested on Dev only.** All 15 cases ran on Dev (v2dev). The PDF download worked on staging on 2026-10-04 and fails on Dev, so the staging build may behave differently; the release decision should rest on a run on the build that will ship.
- **Three Blocking questions are still unanswered** (asked on AP-2428 on 2026-11-01): Q-001 — what the Year field should hold (the form shows the year, 2008, read-only); Q-002 — which amount is taxed and at which rate; Q-003 — whether the form should still show Retail price, Subtotal, Taxes and Grand Total now that AP-2456 removes retail pricing. AP2428_004 and AP2428_008 stay blocked until they are answered.
- **The PDF content is untested.** Because no PDF can be downloaded, nothing is known yet about what the contract PDF contains, its language, or whether an address edited on the form (AP2428_012) reaches it.
- **Editability of vehicle fields (Judgement).** Make, Model and Delivery date are read-only on the contract form; the ticket says only "Text field with … prefilled". AP2428_003 passed because every value is correct; whether these fields should be editable is a question for the author.
- **Invoice amount differs from the banner.** After Generate Contract the banner says "Invoice #N ($225) is created", but the invoice list shows $258.69 (225 plus 14.975 % Quebec taxes). Recorded for Q-002 and AP-2446; not judged here.
- **Cosmetic:** the quote details row prints the currency twice ("Cost: CA$225.00$"); the vehicle section is titled "Vehicle identification", not "Vehicle information". Not in any expected result.
- **The two QA reports from August no longer reproduce on Dev:** the contract control exists, and Generate Contract with Financing company left on "Choose" works (it crashed on staging, AP-2459).
- **Test data left on Dev:** quotes 6456–6460, contracts PNA-0000000017, -18 and -19, invoices #938, #939 and #940 ($258.69 each). Option 20's Dealer Cost was changed for AP2428_014 and restored to 80.00.

---

## Recommendations

1. Fix AP-2512 (High) first: find why `/quote/{id}/permaplate-contract-download` returns HTTP 500 on Dev for every contract, starting with the server log and the HTMLtoPDF change. Then re-run AP2428_010, AP2428_012 and the PDF part of AP2428_014.
2. Ken Nguyen to answer Q-001, Q-002 and Q-003 on AP-2428, so AP2428_004 and AP2428_008 can be judged; the story cannot move to Ready for release while they are open.
3. Fix AP-2513 (copy the client's company into "Other name on file") and AP-2514 (use the province dropdown) together, then re-run AP2428_005, which passes only when both are fixed.
4. AP-2515 (Low — "Total" should read "Cost Price") can be fixed with the others or deferred; re-run AP2428_007 after it.
5. After the fixes, run the whole AP-2428 set again (`AP-2428 --from s4`) on the build that will ship, and decide whether staging must be re-tested before release.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-02 |
| QA Lead | Vinh Le - QC | Pending | | |
| Development Lead | Minh Lưu | Pending | | |
| Product Owner | Ken Nguyen | Pending | | |
