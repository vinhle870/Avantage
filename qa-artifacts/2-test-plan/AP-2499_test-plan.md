# Test Plan

**Plan ID:** TP-20261101-AP2499
**Project:** Avantage Plus v2 — Dealer portal, financing form inside the add-GAP / add-creditors insurance modal of a quote (Jira AP-2499)
**Version:** 1.1
**Date:** 2026-11-01 · updated 2026-11-15 (after the 2026-11-15 re-analysis: Q-007 Answered, Q-011 Accepted; execution on Dev)
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2499_requirements-analysis.md
**Total requirements:** 6

---

## 1. Test Objectives

- Verify that opening add-GAP or add-creditors insurance on a quote with no financing shows the financing form, and not the "Please add a financing…" alert (REQ-001).
- Verify that the financing form is always the first thing in the modal, with the insurance form and its results below it, whether or not a financing exists and for a Chubb dealer and a Humania dealer (REQ-002).
- Verify that each of the eight financing fields is prefilled with the value stored on the quote, and that a field with no stored value is left empty rather than filled with an invented value (REQ-003).
- Verify that submitting the financing saves it on the quote (it survives a reload), moves the modal on to the insurance step, and does not navigate away from the quote page (REQ-004).
- Verify that a GAP and a creditors insurance quote each render their result below the form in the same modal, and that a creditors quote refused because the borrower has no date of birth (the AP-2405 trigger, Q-007 Answered) shows an error without discarding the entered values (REQ-005). No GAP failure trigger is defined, so the failure half is tested on creditors only.
- Verify that missing financing fields give an error next to each field and save nothing — neither a new financing nor a change to an existing one (REQ-006).
- Assert the behaviour the build showed on 2026-11-02 for every Accepted question (Q-001, Q-003 to Q-006, Q-009 to Q-015 — record-and-accept), assert the quoted answers of Q-007 and Q-008, and keep Q-002 (Humania dealer, test data) open.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | Financing form replaces the alert | Functional, UI, Regression |
| REQ-002 | Financing form always first, insurance below (financing present/absent, Chubb/Humania) | Functional, UI, Regression |
| REQ-003 | Prefill from the stored financing | Functional, Edge-case, Regression |
| REQ-004 | Submit saves the financing and continues in the modal | Functional, Edge-case, Regression |
| REQ-005 | Insurance result below the form; failure keeps the values | Functional, Negative, Regression |
| REQ-006 | Financing validation, nothing saved | Functional, Negative, Edge-case |

Regression here means checking that what used to work still works after the change: a
GAP or creditors quote can still be priced and shown on the quote's "Summary of
products" card once a financing exists.

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| The other rows of "Summary of products" (Extended warranty, Roadside Protection, Esthetic protection) | The ticket names only GAP and creditors insurance. |
| The correctness of the GAP / creditors premiums | Pricing is computed by the insurance provider and is not described in the ticket. The tests prove that a result renders and record its figures. |
| Creating the Chubb insurance contract (`/quote/{id}/insurance/create-contract`) and its PDF | Not mentioned in the ticket; covered by the earlier Chubb tickets (AP-2405, AP-2437). |
| The standalone quick-quote page `/quick-insurance-quote` | Not mentioned in the ticket. |
| Admin portal and client portal | The ticket describes only the dealer's quote. |
| A dealer configured for neither Chubb nor Humania | Q-015 (Info). Recorded only if such a dealer is reachable. |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end checks of the quote page, the GAP / creditors add modal and the quote's stored financing in a real browser on staging | QA Agent (stlc-manual-executor) |
| Integration Testing | The modal's insurance request reaches the provider and its answer (result or error) is shown — observed through the screen and the browser's network log, not called directly | QA Agent |
| Regression Testing | A priced GAP / creditors quote still appears on "Summary of products" after the modal closes | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Execute each acceptance criterion step by step on a quote prepared for the case | playwright (browser provider) |
| Negative | Each of the six validated financing fields left empty; non-numeric and negative base amount and interest rate; an invalid correction of an existing financing, to prove nothing is partly saved | playwright |
| Edge-case | A stored financing with the applicant date of birth left empty — the field must open blank, as Q-004 (Accepted) observed for fields with no value; residual is required (Q-011 Accepted), so it is always stored as `0`; empty residual and date of birth on submit; boundary values (Q-010 Accepted) | playwright |
| UI / Visual | Order of the blocks in the modal (financing form first), absence of the alert text, URL unchanged on submit | playwright snapshots and screenshots |
| API | Not tested directly. The network log is read around each submit only to prove there was no full page navigation and to capture a provider error message | playwright network log |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's
bound `browser` provider, **playwright** (`mcp__playwright__*`, see
`qa-artifacts/qa-config/tools.md`). The AI agent drives the dealer portal, captures
screenshots as evidence, and records PASS / FAIL / BLOCKED per step. Bugs go to the
`tracker` provider, **jira** (CLI wrapper `tools/jira-cli`). The `notify` group is
`disabled`; nothing in this plan needs it.

---

## 4. Entry Criteria

_What has to be ready before testing can usefully start. Starting before these are in place produces results nobody can trust._

- [ ] The AP-2499 change is deployed on v2staging (the ticket is in QC and its pull request is merged, so the build should contain it)
- [ ] `AP-2499_requirements-analysis.md` exists and Gate A is approved
- [ ] `AP2499_TestCases_*.md` exist and Gate B is approved
- [ ] The environment health check (a smoke test: dealer login and `/quotes` load) passes
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds

---

## 5. Exit Criteria

_What has to be true before we can say testing is finished. If any box is unticked, testing is not done._

- [ ] All High-priority test cases executed
- [ ] Pass rate ≥ **90%** over all cases except SKIPPED — the registry's `story_pass_threshold`, chosen so one failure in ten blocks release
- [ ] Zero Critical and zero High severity bugs open — a partly saved or silently lost financing changes the insurance premium the client is sold
- [ ] `AP-2499_test-report.md` generated and reviewed
- [ ] Every FAIL filed, linked or dismissed in `AP-2499_bug-report.md`

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and what has to be fixed before we pick it back up._

### Suspend testing when:
- The staging application is unreachable for more than 30 minutes
- More than 30% of the test cases are blocked by a single defect (for example the modal never opens, or it returns HTTP 500)
- A quote cannot be created, so no case can get its own data

### Resume testing when:
- The blocking issue is fixed and confirmed by the developer
- The environment has been stable for at least 15 minutes
- A patch addressing the blocking defect is deployed

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | Dealer portal URL from the "Dev Environment" section of the `env` knowledge source — Dev (v2dev), the registry's `execution_env` since 2026-11-01 (was v2staging in version 1.0) |
| **Login** | The shared dealer account (dealer 1380) named in the `env` source; credentials are taken from there at run time and never copied into artifacts |
| **Browser** | Chromium (Playwright default), viewport 1280 × 800 |
| **OS** | Windows 11 (QA workstation) |
| **Application version** | Not known — the ticket has no fix version; the run folder is `no-sprint` |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/` |
| **Bug tracker** | jira — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Dealer login (Chubb) | Shared dealer account, dealer 1380, Chubb-configured with creditor forms PM30 and PM50 (`domain`: `chubb-insurance.md` §6) | `env` source |
| Dealer login (Humania) | A dealer account configured for Humania | **Not known** — no Humania dealer appears in `env`, `test-data` or `domain` (Q-002). The Humania case is designed with this as a precondition and recorded BLOCKED if no account is available |
| Vehicle 915 | Ford Focus 2008, VIN `1FAHP35NX8W239204`, the dealer's shared inventory vehicle (`test-data`) | Used only as the vehicle each new quote is created from. This story changes the quote's financing, not the vehicle, so the vehicle is not modified |
| Quote without financing | A new quote on vehicle 915, entered from `/vehicle/915/details` → **Create quote** (`/quote/new/client?fromVehicleId=915`), which avoids the HTTP 500 of a quote with no vehicle | Created in a `[Pre-Condition]` step |
| Quote with a stored financing | A new quote as above, plus a financing with known values for all eight fields (in the prefill edge case and the insurance-failure case, the applicant date of birth is left empty; the residual cannot be left empty — Q-011) | Created in a `[Pre-Condition]` step through `/quote/{id}/financing` (`domain`: `quote-creation.md`). If "Add a financing" is disabled on the new quote, the step instead saves the financing once through the AP-2499 modal and re-opens it |
| Financing values | A fixed valid set: type (first non-empty option), base amount 25000, residual 0 (required), payment frequency monthly, term 60 months, interest rate 6.99, financing company (first non-empty option), applicant date of birth 1990-01-01 | Written into each case's steps |
| Insurance values | Creditors: form PM30, Life type DECREASING, term 60 (the working set in `chubb-insurance.md` §6). GAP: `gapTerm` 60 | Written into each case's steps |

### 8.1 Test Data Classification

_Decided once here, and inherited by every test case._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer login (Chubb, dealer 1380) | Static | None applied | Named in Execution Context, resolved from `env` |
| Dealer login (Humania) | Static | None applied — but not known | Named as a precondition; the case is BLOCKED when `env` has no such account |
| Vehicle 915 | Static | None applied — it is only read when a quote is created from it | Named in Execution Context, resolved from `test-data` |
| Quote (with or without financing) | Dynamic | Q1 — does not exist yet; Q3 — the case writes a financing onto it | Created per case in a `[Pre-Condition]` step. Cost: about 2 minutes (client form + vehicle), no third party. Left on staging (no `cleanup` source) |
| Client of the quote | Dynamic | Q1 — does not exist yet | Entered in the same `[Pre-Condition]` step with the minimum required client fields from `domain` (`quote-creation.md`), using a unique Yopmail address |
| Stored financing | Dynamic | Q2 — the prefill assertions depend on the values set at creation | Created in a `[Pre-Condition]` step with every value written into the step |
| Stored financing **without** a date of birth | Dynamic | Q2 — the prefill check (AP2499_005) and the insurance failure (AP2499_009) happen *because* the date of birth was left empty at creation | Created in the case's own `[Pre-Condition]` step. Whether the build stores it at all is recorded there; if it is refused, or a date of birth is stored anyway, the case is BLOCKED with that reason |
| GAP / creditors insurance quote | Dynamic | Q3 — produced by the run | Produced by the case itself. **Calls a third party** (the Chubb quote API), so each call adds a quote record on the provider side |
| Dealer Chubb / Humania configuration | Configuration — read only | Q5 does not apply: no case changes it | Never changed by this plan |

**No quote is reused across cases**, because every case writes a financing onto its
quote. Every quote id is listed in the execution log, because nothing is cleaned up.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| The GAP / creditors add modal is not mapped in the domain knowledge — rated High impact because every case starts there | High | High | Navigate by the ticket screenshots (Summary of products → Gap Insurance **+** / Creditors insurance **+**); the executor maps the modal on first use and writes it back to the `domain` source |
| No Humania dealer is known on staging (Q-002) | High | Medium | Design the Humania case with an explicit precondition; record BLOCKED if no account exists, never substitute the Chubb dealer |
| Dealer 1380 may not be configured for GAP (only PM30 / PM50 creditor forms have been seen) | Medium | High | The GAP case records what the modal offers; if the dealer has no GAP configuration the GAP insurance step is recorded BLOCKED with that reason |
| The AP-2405 failure trigger (missing borrower date of birth, Q-007) cannot be set up on Dev, or Chubb still prices the request | Medium | Medium | AP2499_009 records in its first steps whether a financing and quote client without a date of birth can be stored; if not, or if Chubb prices the request, the case is BLOCKED with that reason — never PASS. No GAP failure trigger is defined, so GAP failure is not tested |
| The Chubb quote API is slow or failing (bug AP-2410 records errors on valid creditor submissions) | Medium | High | Retry once; an error before the step under test is BLOCKED, not FAIL. A failure on the step under test goes to Gate C, where AP-2410 is checked as a duplicate candidate |
| "Add a financing" may be disabled on a new quote, so a stored financing cannot be prepared through the old page | Medium | Medium | Fall back to saving the financing once through the modal and re-opening it; note it in the log |
| playwright unreachable | Low | High | Run the preflight before s4 |
| Shared dealer account used by other tickets at the same time | Medium | Low | Fresh quotes per case; record their ids |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-11-01 | Analysis | Requirements analysis | stlc-requirements-analyst |
| 2026-11-01 | Planning | Test plan design | stlc-test-plan-designer |
| 2026-11-01 | Design | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| Next execution wave | Execution | Manual test execution via playwright | stlc-manual-executor |
| Next execution wave | Reporting | Bug reporting + test report | stlc-bug-reporter, stlc-test-reporter |
| Next execution wave | Closure | Story comment and status per Gate D | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Run the STLC skills and write every artifact |
| QA Reviewer (stlc-qa-reviewer) | Approve gates A–D in place of the QA lead (`gate_mode: reviewer`) |
| Developer | Fix defects (AP-2526, AP-2527, AP-2528). Q-007 was answered by AP-2405 (developer comment, 2026-01-22); Q-005 and Q-006 are Accepted as observed |
| Product Owner (Nicolas-Eric Tain) | Answer the Judgement questions, name a Humania dealer account (Q-002), accept the recorded behaviour |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%)
- [ ] Risk mitigations acknowledged by team

---

## 13. Revisions

| Date | Section | Change | Reason |
|---|---|---|---|
| 2026-11-15 | 1, 3.2, 7, 8, 8.1, 9, 11 | REQ-005 failure half now asserted on the AP-2405 trigger (creditors only); prefill edge case moved from an empty residual to an empty date of birth; residual always `0`; execution environment Dev; new Dynamic data row for a financing without a date of birth; Q-007 risk and Developer role updated | 2026-11-15 re-analysis — Q-007 Answered (AP-2405), Q-011 Accepted (residual required); Gate A by reviewer (R1 round 1, F-2) |
