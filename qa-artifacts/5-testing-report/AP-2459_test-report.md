# Test Execution Report

**Report ID:** TR-20261108-001
**Project:** AP (Avantage)
**Test Cycle:** AP-2459 bug re-test — "Permaplate contract generation returns HTTP 500 when Financing company is left unselected" — run folder no-sprint
**Application version:** Dev (https://v2dev.garantieavantageplus.ca), footer "Avantage Plus System v2.0.0". No build number is shown by the application.
**Environment:** Dev
**Date:** 2026-11-08
**Prepared by:** QA Agent — Test Reporter Skill (stlc-worker, QA batch)

---

## Verdict

> # ✅ PASS — Ready for Release

**Rationale:** Both counted test cases passed on Dev (2 of 2, 100%, above the 90% threshold; the third was skipped by its own rule), no bug was found and none is open, so the problem reported in AP-2459 — a server error page when "Financing company" is left on "Choose" — no longer happens on the build tested.

---

## Executive Summary

AP-2459 reported that when a dealer generated an Esthetic protection (Permaplate) contract
and left the "Financing company" drop-down on its default "Choose", the application crashed
with a French "technical difficulties" error page and created nothing. The ticket accepts
either of two fixes: the contract is created without a financing company, or the form
refuses the submission with a message beside the field. The QA team re-tested on the Dev
environment with 3 test cases: the original steps, and two neighbouring checks
(regression checks — re-checks of features close to the change, to be sure nothing else
broke). The crash is gone: the form now refuses a blank financing company and shows "This
value should not be blank." directly above the field, keeps everything the dealer typed,
and creates no contract or invoice. Choosing a financing company still creates the
contract and its invoice. The third case, which needed a contract with no financing
company, could not apply because such a contract can no longer be created. The bug can be
closed. One point is left for the author: the field is still not marked with "*" as
required, although it now is. The result applies to Dev only; Staging was not tested.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 1 of 1 (the bug report is the requirement) |
| Total test cases | 3 |
| Passed | 2 (100% of the 2 counted) |
| Failed | 0 (0%) |
| Blocked | 0 |
| Skipped | 1 (AP2459_003 — by its own step 2 rule) |
| **Pass rate** | **100% (2 of 2 counted)** |
| Pass rate threshold | 90% |
| Threshold met? | ✅ Yes |

The pass rate is the share of test cases that passed, out of every case except skipped
ones: 2 passed ÷ (3 total − 1 skipped) = 100%. Counted over all 3 cases it would be 67%,
but a skipped case is one whose subject cannot exist on this build, not a case that failed.
Defect density (bugs per test case) is 0 ÷ 3 = 0.

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

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

There is no test plan for this ticket (a bug re-test skips planning), so the default exit
criteria apply.

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 100% (AP2459_001, 002 — 2 of 2) | ✅ |
| Pass rate | ≥ 90% | 100% (2 of 2 counted) | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 2 | 0 | ✅ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| AP-2459 — generating an Esthetic protection contract with Financing company on "Choose" no longer returns HTTP 500: either the contract is created, or the form refuses it with a message beside the field | 3 (1 skipped) | 2 | 0 | 0 | 100% |
| **Total** | **3** | **2** | **0** | **0** | **100%** |

| TC ID | What was checked | Priority | Result |
|---|---|:---:|:---:|
| AP2459_001 | The reported steps: quote 6689 (Perma Retest2459, vehicle 915, "10 ans" + Antirouille CA$80), ⋯ → "Generate Contract", Financing company left on "Choose", Generate Contract. POST answered 200 (no 500, no error page); the form came back with "ERROR This value should not be blank." directly above the Financing company field and every other value kept; no contract and no invoice created. **Branch (b)** of the ticket's Expected Result — the re-test of the reported bug | High | ✅ PASS |
| AP2459_002 | Same flow on quote 6690 (Perma Finance2459) with "AutoCapital Canada" chosen: "Esthetic protection contract generated successfully", contract PNA-0000000021 listed on the dealer's contract list, invoice 945 created ($80 + tax = $91.98) (regression) | High | ✅ PASS |
| AP2459_003 | The PDF of a contract created with no financing company. The fallback quote 6691 (Perma Pdf2459) was refused the same way at step 2, so no such contract can exist; skipped by the case's own rule | Medium | ⏭️ SKIPPED |

**Which branch the build chose.** Which of the two fixes is the intended one was a
record-only point in the approved design. The build chose (b) — refusal with a field
message. This differs from Dev on 2026-11-02 (AP-2428 run: a blank company was accepted)
and from the AP-2446 Staging re-test of 2026-09-13; it is recorded, not judged.

**Step mapping on the current Dev screens.** The quote page has no "Create Contract"
button; the Esthetic protection row's ⋯ menu → "Generate Contract" opens the same route
the case names (`/quote/{id}/permaplate-create-contract`). The Financing company field now
sits in the contract page's "Product Summary" section. The qa-reviewer (R3) accepted both
mappings.

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| — | No defects found in this run | — | — | — | — | — |

Gate C (the check before filing bugs) was skipped because no case failed — decided by the
independent qa-reviewer (R3 round 1, APPROVE, 0 blocker · 0 major · 2 minor). No bug was
filed or linked and nothing was recorded against AP-2459 as a failure.

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2459-permaplate-contract-generation-returns-http-500.md` | 2026-11-01 |
| Requirements Analysis | Not written — skipped in the bug re-test flow (the bug report is the requirement) | — |
| Test Plan | Not written — skipped in the bug re-test flow | — |
| Test Cases | `qa-artifacts/3-test-cases/AP2459_TestCases_001-003.md` | 2026-11-01 (Gate B approved, R2 round 1, rule B3) |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2459_2026-11-08.md` | 2026-11-08 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2459_bug-report.md` | 2026-11-08 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/` (6 .png, 2 .txt) | 2026-11-08 |
| Review record | `qa-artifacts/7-reviews/AP-2459_review.md` | 2026-11-08 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2459_test-report.md` | 2026-11-08 |

**Evidence.** Screenshots: `AP2459_001-step4-BlankCompanyRefusedWithFieldMessage_pass.png`,
`AP2459_001-step5-NoContractRowForRetest2459_pass.png`,
`AP2459_002-step5-ContractRowFinance2459Listed_pass.png`,
`AP2459_002-step5-Invoice945Finance2459_pass.png`,
`AP2459_003-step2-FallbackQuoteRefusedBlankCompany_skipped.png`,
`Observation-Quote6690PdfDownload500-AP2512_blocked.png`. Request lines (method, URL and
status only — no cookies, tokens or credentials): `AP2459_001-step4-network_pass.txt`,
`AP2459_002-AP2459_003-network.txt`. The qa-reviewer inspected every file at R3 and found
each matches its result.

---

## Risks and Observations

- **The "Financing company" field is required but not marked as required (R3 finding F-1 —
  observation only, does not change the result).** The ticket's Notes say _"The field is
  genuinely optional in the markup, so a dealer has no way to know they must set it."_ The
  server now refuses a blank value, but the label still has no "*", unlike the other
  required fields on the same form (First name*, Last name*, Address*, …). A dealer selling
  for cash still cannot tell before clicking that a company must be chosen; they now get a
  clear message instead of an error page. No AP-2459 step judges the marker. The author
  should decide whether it needs its own ticket.
- **Cash sales now need a financing company.** Because the build chose to refuse a blank
  company, a dealer with no financing involved must pick a company to complete the sale.
  The ticket accepts this branch; whether it suits cash sales is a product decision.
- **Related bug AP-2512 still reproduces.** Opening the PDF of contract PNA-0000000021
  (quote 6690, a contract **with** a financing company) returned HTTP 500 and the French
  error page. This is AP-2512 (High, Backlog), not AP-2459, and judges no case. Its step 5
  ("leave Financing company on Choose") no longer works on Dev; a comment saying so is
  prepared in the bug report for the update-ticket stage.
- **Contract page vehicle price.** The collapsed "Vehicle identification" line on the
  contract page shows CA$10,000.00 (the inventory vehicle's price) although the quote's
  vehicle step was saved with Price 25000. Recorded only.
- **Status and environment.** AP-2459 is in Jira status "QA", not the project's
  ready-for-QA status "QC"; the QA decided on 2026-11-08 to re-test it now. Dev only —
  Staging was not tested.
- **Test data left behind on Dev (dealers cannot delete quotes):**
  - quote **6689** "Perma Retest2459" (`client.stage.2459001@yopmail.com`) — no contract (AP2459_001);
  - quote **6690** "Perma Finance2459" (`client.stage.2459002@yopmail.com`) — contract **PNA-0000000021** (AutoCapital Canada), **invoice 945** ($91.98, Payment pending) (AP2459_002);
  - quote **6691** "Perma Pdf2459" (`client.stage.2459003@yopmail.com`) — no contract (AP2459_003 fallback).
  - All on vehicle 915 (`1FAHP35NX8W239204`). Dealer 1380's "10 ans" product link was found linked and left unchanged.

---

## Recommendations

1. Close AP-2459: post the bug re-test comment and move it to `Done` (see the outcome plan below).
2. Decide whether the "Financing company" label should carry the "*" required marker, now that the server requires the field; if yes, raise a small UI ticket.
3. Post the prepared note on AP-2512 so its steps choose a financing company in step 5; fix AP-2512 before release, as the PDF of the contract created in this run could not be opened on Dev.
4. Re-run AP2459_001 on Staging when the build is deployed there.

### Outcome plan for Gate D (for review by R4 — not applied by this stage)

Source: the *QA outcome rules* in `qa-artifacts/qa-config/tools.md` §2 and
`stlc-ticket-pipeline/routing.md` §3.2 (bug tickets). `apply_mode: automatic`.

| # | Ticket | Rule | Action | Evidence |
|---|---|---|---|---|
| 1 | AP-2459 (bug, re-tested) | §3.2 — re-test result of the bug's test cases is **All PASS** (AP2459_003 SKIPPED by its own rule, not FAIL or BLOCKED) | Post the bug re-test comment (template §4.2): "Re-test PASSED — 2026-11-08", Environment: Dev, Build/run: no-sprint, rows AP2459_001 PASS, AP2459_002 PASS, AP2459_003 SKIPPED; "The reported behaviour no longer occurs: with Financing company on Choose, Generate Contract no longer shows the error page; the form refuses it with 'This value should not be blank.' above the field." Plus one observation line: the Financing company label has no "*" although the server now requires it | Execution log: 2 PASS · 0 FAIL · 0 BLOCKED · 1 SKIPPED; R3 APPROVE |
| 2 | AP-2459 | §3.2 All PASS | Move to `bug_pass_status` = **Done**, then read the ticket back to confirm | Same |
| 3 | AP-2459 | §3.2 — re-assignment only on FAIL or BLOCKED | **No assignee change** | No FAIL or BLOCKED case |
| 4 | AP-2512 (related, open) | R3 finding F-2 (optional) | Post the prepared comment from `AP-2459_bug-report.md` (still reproduces 2026-11-08 with PNA-0000000021, quote 6690, AutoCapital Canada; a company must now be chosen in step 5). No status or assignee change | Observation in the execution log; AP-2512 not linked to any AP-2459 case |

No story rules (§3.1) apply, because AP-2459 is a bug. AP-2459 is in Jira status "QA"; the
QA's decision of 2026-11-08 applies the normal outcome rules. A transition the tracker
refuses is reported with the current status, never retried with another status.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | PASS | _(automated)_ | 2026-11-08 |
| QA Lead | Not known — not named in the ticket | Pending | | |
| Development Lead | Not known — not named in the ticket | Pending | | |
| Product Owner | Not known — not named in the ticket | Pending | | |
