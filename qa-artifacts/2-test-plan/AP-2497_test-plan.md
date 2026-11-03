# Test Plan

**Plan ID:** TP-20261101-AP2497
**Project:** Avantage Plus v2 — Dealer portal, vehicle form in the add-extended-warranty flow of a quote (Jira AP-2497)
**Version:** 1.0
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2497_requirements-analysis.md

---

## 1. Test Objectives

- Verify that opening the add-extended-warranty flow from a quote shows the vehicle form, with the eligible-program results or the "no program" notice below it, instead of the old dead-end message on its own (REQ-001).
- Verify that the form holds exactly the six fields Year, Kilometers, Make, Model, Fuel type and Vehicle type, each editable, and nothing from the full vehicle editor (REQ-002).
- Verify that each of the six fields is prefilled with the value stored on the quote's vehicle (REQ-003).
- Verify that a submit saves the values on the quote's vehicle (they survive a reload), re-runs eligibility, and refreshes the results in the same modal without a page navigation, with the form still showing the saved values (REQ-004).
- Verify that an empty, non-numeric or negative Year or Kilometers gives an error next to that field and saves nothing at all, not even the other changed fields (REQ-005).
- Record what the build does on every Judgement question (Q-001 to Q-006, Q-008 to Q-010) so the author can confirm it, without failing a case on a guessed answer.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Test Types |
|---|---|
| REQ-001 — Form shown in the extended-warranty flow, results below | Functional, UI, Regression |
| REQ-002 — Only the six fields, each editable | Functional, UI |
| REQ-003 — Prefilled from the stored vehicle | Functional, Edge-case, Regression |
| REQ-004 — Submit saves and refreshes in place | Functional, Edge-case, Regression |
| REQ-005 — Year / Kilometers validation, no partial save | Functional, Negative, Edge-case |

Regression here means checking that what used to work still works after the change: a
vehicle that already qualifies still lists its programs, and a program can still be
chosen from the results to add the warranty to the quote.

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| The other rows of "Summary of products" (Roadside Protection, Gap Insurance, Creditors insurance, Esthetic protection) | The ticket names only the extended warranty. |
| The correctness of which programs are eligible for a given vehicle | The eligibility rules are not described (Q-006). The tests prove that results refresh, and record which programs appear. |
| Pricing and contract generation of the chosen warranty | Not mentioned in the ticket; owned by the existing warranty flow. |
| Admin portal and client portal | The ticket describes only the dealer's quote. |
| Vehicle type groups other than a passenger car (RV, boat, construction) | Q-011 (Info). One car is tested; any other group is recorded if it appears in the Vehicle type control. |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Description | Responsible |
|---|---|---|
| System Testing | End-to-end checks of the quote page, the extended-warranty modal and the vehicle record in a real browser on staging | QA Agent (stlc-manual-executor) |
| Regression | A qualifying vehicle still lists programs and a program can still be selected | QA Agent |

### 3.2 Test Types

| Type | Approach | Tool |
|---|---|---|
| Functional | Execute each acceptance criterion step by step on a quote prepared for the case | playwright (browser provider) |
| Negative | Empty, non-numeric and negative Year and Kilometers; a valid change combined with an invalid value, to prove nothing is partly saved | playwright |
| Edge-case | A vehicle with an empty stored value (prefill record-only, Q-004); Year in the future and Kilometers of 0 (record-only, Q-010); empty Make / Model (record-only, Q-009) | playwright |
| UI | Field count and labels, field order, that the results sit below the form, that the URL does not change on submit | playwright snapshots and screenshots |
| Persistence | After a submit, reload the quote page and re-open the form; also read the vehicle's details page `/vehicle/{id}/details` (Q-005, Q-007 recorded) | playwright |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's
bound `browser` provider, **playwright** (`mcp__playwright__*`, see
`qa-artifacts/qa-config/tools.md`). The AI agent drives the dealer portal, captures
screenshots as evidence, and reads the page URL and network log around each submit to
prove there was no full page navigation. Bugs go to the `tracker` provider, **jira** (CLI
wrapper `tools/jira-cli`). The `notify` group is `disabled`; nothing in this plan needs it.

---

## 4. Entry Criteria

_What has to be ready before testing can usefully start. Starting before these are in place produces results nobody can trust._

- [ ] The AP-2497 change is deployed on v2staging (the ticket is in QC, so the build should contain it)
- [ ] `AP-2497_requirements-analysis.md` exists and Gate A is approved
- [ ] `AP2497_TestCases_*.md` exist and Gate B is approved
- [ ] The environment health check (a smoke test: dealer login and `/quotes` load) passes
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds

---

## 5. Exit Criteria

_What has to be true before we can say testing is finished. If any box is unticked, testing is not done._

- [ ] All High-priority test cases executed
- [ ] Pass rate ≥ **90%** over all cases except SKIPPED — the registry's `story_pass_threshold`, chosen so one failure in ten blocks release
- [ ] Zero Critical and zero High severity bugs open — a partly saved or silently lost vehicle value changes what warranty the client is sold
- [ ] `AP-2497_test-report.md` generated and reviewed
- [ ] Every FAIL filed, linked or dismissed in `AP-2497_bug-report.md`

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and what has to be fixed before we pick it back up._

### Suspend testing when:
- The staging application is unreachable for more than 30 minutes
- More than 30% of the test cases are blocked by a single defect (for example the form never appears, or the modal returns HTTP 500)
- A new inventory vehicle or a quote cannot be created, so no case can get its own data

### Resume testing when:
- The blocking issue is fixed and confirmed by the developer
- The environment has been stable for at least 15 minutes
- A patch addressing the blocking defect is deployed

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | Dealer portal URL from the `env` knowledge source (`qa-artifacts/base-test/execute.env.md`) — v2staging |
| **Login** | The shared dealer account (dealer 1380) named in the `env` source; credentials are taken from there at run time and never copied into artifacts |
| **Browser** | Chromium (Playwright default), viewport 1280 × 800 |
| **OS** | Windows 11 (QA workstation) |
| **Application version** | Not known — the ticket has no fix version; the run folder is `no-sprint` |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/` |
| **Bug tracker** | jira — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Dealer login | Shared dealer account (dealer 1380) | `env` source |
| Vehicle V1 — complete | A new inventory vehicle of the dealer with all six values stored (e.g. Year 2022, Kilometers 15000, a Make/Model from the list, a Fuel type, Vehicle type car), created for this run | Created in a `[Pre-Condition]` step from Inventory `/vehicle/inventory` (the add-vehicle form is not mapped yet — the executor maps it and writes it back to `domain`) |
| Vehicle V2 — missing value | A new inventory vehicle with Kilometers left empty, the dead-end state of the ticket screenshot | Created in a `[Pre-Condition]` step the same way; if the inventory form refuses an empty Kilometers, the case records that and uses V1 with Kilometers cleared through the AP-2497 form instead |
| Quote on V1 / quote on V2 | One quote per vehicle, entered from `/vehicle/{id}/details` → **Create quote** (`/quote/new/client?fromVehicleId={id}`), which avoids the HTTP 500 of a quote with no vehicle | Created in a `[Pre-Condition]` step |
| Vehicle 915 | The shared Ford Focus 2008 in `test-data` | **Not used.** Submitting the form would change it for every other ticket's tests |

### 8.1 Test Data Classification

_Decided once here, and inherited by every test case._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer login | Static | None applied | Named in Execution Context, resolved from `env` |
| Vehicle V1 (all values stored) | Dynamic | Q2 — the prefill assertions depend on the values set at creation; Q3 — a submit changes it | Created per case in a `[Pre-Condition]` step with the six values written into the step. Cost: about 2 minutes, no third party. Left on staging (no `cleanup` source) |
| Vehicle V2 (Kilometers empty) | Dynamic | Q2 — the case depends on the missing value | Created per case in a `[Pre-Condition]` step. Same cost |
| Quote on the case's vehicle | Dynamic | Q1 — does not exist yet | Created in a `[Pre-Condition]` step via `fromVehicleId`. Cost: about 2 minutes (client form + vehicle step), no third party |
| Client of the quote | Dynamic | Q1 — does not exist yet | Entered in the same `[Pre-Condition]` step with the minimum required client fields from `domain` (`quote-creation.md`) |

A vehicle is changed by most cases, so **no vehicle is reused across cases**: each case
creates its own vehicle and quote. Every vehicle and quote id is listed in the execution
log, because nothing is cleaned up.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| The extended-warranty modal and the inventory add-vehicle form are not mapped in the domain knowledge — rated High impact because every case starts there | High | High | Navigate by the ticket screenshot (Summary of products → Extended warranty **+**); the executor maps both screens on first use and writes them back to `quote-creation.md` |
| A submit changes a shared vehicle and breaks other tickets' tests | Medium | High | Never use vehicle 915; one new vehicle per case |
| The eligibility rules are not described (Q-006), so a "no program" result may be correct or a defect | High | Medium | Judge only that results or a notice render and refresh; record the programs and notice text |
| The inventory form may not allow an empty Kilometers, so the dead-end state cannot be prepared | Medium | Medium | Fall back to clearing Kilometers through the form and recording the result; note it in the log |
| AP-2477 (vehicle-first quote form) may or may not be on staging, which changes the quote entry route | Medium | Low | Use the `fromVehicleId` entry from `domain`, which works either way |
| playwright unreachable | Low | High | Run the preflight before s4 |
| Shared dealer account used by other tickets at the same time | Medium | Low | Fresh vehicles and quotes per case; record their ids |

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
| Developer | Fix defects; answer Q-006 (eligibility rules) and Q-007 (inventory vehicle) |
| Product Owner (Nicolas-Eric Tain) | Answer the Judgement questions; accept the recorded behaviour |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%)
- [ ] Risk mitigations acknowledged by team
