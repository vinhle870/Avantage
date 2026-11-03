# Test Plan

**Plan ID:** TP-20261101-AP2498
**Project:** Avantage Plus v2 — Dealer portal, vehicle form (VIN, Year, Make, Model) in the add-roadside-protection flow of a quote (Jira AP-2498)
**Version:** 1.0
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2498_requirements-analysis.md

---

## 1. Test Objectives

- Verify that opening the add-roadside-protection flow from a quote always shows the vehicle form, with the AutoShield product results or the "no products" notice below it — including when make and model are already stored and products are returned, which is the defect the ticket fixes (REQ-001, REQ-002).
- Verify that the form is the existing Make/Model/Continue form plus a VIN text input and a Year input, that only VIN is required, that there is no VIN lookup, and that nothing from the full vehicle editor, client info or contract appears (REQ-003).
- Verify that the Make list is filled and the Model list follows the selected Make (REQ-004), within what the screen can show — QA has no copy of the AutoShield catalogue (Q-006).
- Verify that the form is prefilled from the quote's RSP program, falling back to the vehicle's VIN and year (REQ-005).
- Verify that a submit keeps the dealer on the RSP screen, saves VIN/Year/Make/Model (they come back when the flow is re-opened), and refreshes the product results below the form (REQ-006, REQ-008).
- Verify that a submit with only a VIN is accepted, keeps the VIN, and shows the existing notice below the form — not an error screen — when no products return (REQ-007).
- Record what the build does on every Judgement question (Q-001 to Q-010, Q-012) so the author can confirm it, without failing a case on a guessed answer.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Test Types |
|---|---|
| REQ-001 — Form always visible, results or notice below | Functional, UI, Regression |
| REQ-002 — Form stays when make/model stored and products returned | Functional, Regression |
| REQ-003 — Existing fields + VIN + Year; only VIN required; no lookup | Functional, Negative, UI |
| REQ-004 — Make/Model lists from the AutoShield catalogue | Functional, Regression |
| REQ-005 — Prefill from the RSP program / vehicle | Functional, Edge-case, Regression |
| REQ-006 — Submit saves on the RSP program and re-quotes in place | Functional, Edge-case, Regression |
| REQ-007 — VIN-only submit accepted, notice below the form | Functional, Negative, Edge-case |
| REQ-008 — Results update, form stays | Functional, Regression |

Regression here means checking that what used to work still works: a dealer can still
choose a product tier from the results and continue to the existing roadside-protection
contract step once products are listed.

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| The other rows of "Summary of products" (Extended warranty — AP-2497, Gap Insurance, Creditors insurance, Esthetic protection) | The ticket names only Roadside Protection. |
| Which products and prices AutoShield returns for a given vehicle | AutoShield is an external service and its rules are not described (Q-001). The tests prove that results or the notice render and refresh, and record what appears. |
| Generating and submitting a roadside-protection contract | Not in the acceptance criteria. Only reaching the existing product step is checked as regression; what VIN the contract uses is recorded (Q-012). |
| The road-side-protection contract list `/road-side-protection-contracts` | Not mentioned in the ticket. |
| Admin portal and client portal | The ticket describes only the dealer's quote. |
| Code-level statements — "no new form type", calls to `VehicleMakeModelService` | Not observable in the UI; judged only through field names and list behaviour (analysis REQ-003, REQ-004). |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Description | Responsible |
|---|---|---|
| System Testing | End-to-end checks of the quote page, the roadside-protection modal/page and the persisted values, in a real browser on staging | QA Agent (stlc-manual-executor) |
| Regression | A quote that gets products still lists them and a tier can still be chosen | QA Agent |

### 3.2 Test Types

| Type | Approach | Tool |
|---|---|---|
| Functional | Execute each acceptance criterion step by step on a quote prepared for the case | playwright (browser provider) |
| Negative | Submit with VIN empty (required); submit with VIN only; Year/Make/Model left empty must not cause an error screen | playwright |
| Edge-case | Prefill when the RSP program has no values (falls back to the vehicle's VIN/year); prefill when both hold different values (record-only, Q-008); a short or odd VIN and an odd year (record-only, Q-004/Q-005) | playwright |
| UI | Field set and their `name` attributes, the `required` attribute on VIN only, absence of a lookup/decode button, the form sitting above the results/notice, the notice text | playwright snapshots and screenshots |
| Persistence | After a submit, close the flow, reload the quote page and re-open it: the submitted values come back. Read `/vehicle/{id}/details` before and after (Q-010 recorded) | playwright |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's
bound `browser` provider, **playwright** (`mcp__playwright__*`, see
`qa-artifacts/qa-config/tools.md`). The AI agent drives the dealer portal, captures
screenshots as evidence, and reads the page URL around each submit to show the dealer
stays on the RSP screen. Bugs go to the `tracker` provider, **jira** (CLI wrapper
`tools/jira-cli`). The `notify` group is `disabled`; nothing in this plan needs it.

---

## 4. Entry Criteria

_What has to be ready before testing can usefully start. Starting before these are in place produces results nobody can trust._

- [ ] The AP-2498 change is deployed on v2staging (the ticket is in QC and its pull request is merged, so the build should contain it)
- [ ] `AP-2498_requirements-analysis.md` exists and Gate A is approved
- [ ] `AP2498_TestCases_*.md` exist and Gate B is approved
- [ ] The environment health check (a smoke test: dealer login and `/quotes` load) passes
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds

---

## 5. Exit Criteria

_What has to be true before we can say testing is finished. If any box is unticked, testing is not done._

- [ ] All High-priority test cases executed
- [ ] Pass rate ≥ **90%** over all cases except SKIPPED — the registry's `story_pass_threshold`, chosen so one failure in ten blocks release
- [ ] Zero Critical and zero High severity bugs open — a form that disappears, or a VIN that is shown as saved but lost, would price roadside protection on the wrong vehicle
- [ ] `AP-2498_test-report.md` generated and reviewed
- [ ] Every FAIL filed, linked or dismissed in `AP-2498_bug-report.md`

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and what has to be fixed before we pick it back up._

### Suspend testing when:
- The staging application is unreachable for more than 30 minutes
- More than 30% of the test cases are blocked by a single defect (for example the RSP flow returns HTTP 500 or the form never appears)
- The AutoShield service does not answer at all (every open of the flow errors or times out) — that is an outage of an external service, recorded as BLOCKED, not a product FAIL
- A new inventory vehicle or a quote cannot be created, so no case can get its own data

### Resume testing when:
- The blocking issue is fixed and confirmed by the developer
- The environment, and AutoShield, have been stable for at least 15 minutes
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
| **External service** | AutoShield pricing, called by staging. Which staging/sandbox AutoShield instance it reaches is not known |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/` |
| **Bug tracker** | jira — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Dealer login | Shared dealer account (dealer 1380) | `env` source |
| Vehicle N — "no products" | A new inventory vehicle with **no VIN**, the state of the ticket screenshot (quote #6432, Cadillac ATS 2022 with empty VIN). Created for the case | `[Pre-Condition]` step from Inventory `/vehicle/inventory` (the add-vehicle form is not mapped yet — the executor maps it and writes it back to `domain`). If the inventory form refuses an empty VIN, the case records that and continues with the quote's RSP form left without a VIN |
| Vehicle P — "products" | A new inventory vehicle with a 17-character VIN with a valid check digit, a recent year and a common make/model (for example a 2022 passenger car). Created for the case | `[Pre-Condition]` step the same way. Whether AutoShield returns products for it is not known (Q-001); if it returns none, the cases needing products are BLOCKED with the VIN recorded, not FAILED |
| Quote on the case's vehicle | One quote per vehicle, entered from `/vehicle/{id}/details` → **Create quote** (`/quote/new/client?fromVehicleId={id}`), which avoids the HTTP 500 of a quote with no vehicle | `[Pre-Condition]` step |
| RSP program with make/model stored | The quote's RSP program after a first submit of Make/Model in the form | Built inside the case (submit once, then re-open) |
| Vehicle 915 | The shared Ford Focus 2008 in `test-data` | **Not used.** Whether the RSP submit also changes the vehicle is unknown (Q-010) |

### 8.1 Test Data Classification

_Decided once here, and inherited by every test case._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer login | Static | None applied | Named in Execution Context, resolved from `env` |
| Vehicle N (no VIN) | Dynamic | Q2 — the "no products" assertions depend on the missing VIN set at creation; Q3 — a submit may change it (Q-010) | Created per case in a `[Pre-Condition]` step with its values written in the step. Cost: about 2 minutes, no third party. Left on staging (no `cleanup` source) |
| Vehicle P (complete, valid VIN) | Dynamic | Q2 — the prefill and "products" assertions depend on the VIN/year set at creation | Created per case in a `[Pre-Condition]` step. Same cost |
| Quote on the case's vehicle | Dynamic | Q1 — does not exist yet | Created in a `[Pre-Condition]` step via `fromVehicleId`. Cost: about 2 minutes, no third party |
| Client of the quote | Dynamic | Q1 — does not exist yet | Entered in the same `[Pre-Condition]` step with the minimum required client fields from `domain` (`quote-creation.md`) |
| RSP program values (VIN/Year/Make/Model) | Dynamic | Q3 — the run writes them | Set inside the case by submitting the form; every opening of the RSP flow calls AutoShield (third party) |

A submit writes to the quote's RSP program and maybe to the vehicle, so **no quote or
vehicle is reused across cases**. Every vehicle id, VIN and quote id is listed in the
execution log, because nothing is cleaned up.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| AutoShield returns no products for every staging vehicle, so the "products" state (REQ-002, REQ-008, part of REQ-001) cannot be reached | Medium | High | Try Vehicle P with its VIN and then with a catalogue Make/Model; record each attempt. Cases needing products are BLOCKED with the attempts listed, and Q-001 goes in the story comment |
| The RSP modal is not mapped in the domain knowledge; `quote-creation.md` maps only the page `/quote/{id}/road-side-protection` (Q-002) | High | Medium | Navigate by the ticket screenshot (Summary of products → Roadside Protection **+**); the executor records the URL and writes the flow back to `quote-creation.md` |
| The Make/Model lists cannot be compared with the real AutoShield catalogue (Q-006) | High | Medium | Judge non-empty Make list and a Model list that changes with the Make; record counts and samples |
| Persistence on `RoadSideProtectionProgram` is not directly visible | Medium | Medium | Judge it by closing, reloading and re-opening the flow |
| A submit may change the vehicle (Q-010) and break other tickets' data | Medium | High | Never use vehicle 915; one new vehicle per case |
| The inventory form may not allow a vehicle with no VIN | Medium | Medium | Fall back to a vehicle with a VIN and clear VIN in the RSP form only for the empty-VIN negative check |
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
| Developer | Fix defects; answer Q-001 (AutoShield data on staging), Q-006 (catalogue) and Q-010 (vehicle record) |
| Product Owner (Nicolas-Eric Tain) | Answer the Judgement questions; accept the recorded behaviour |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%)
- [ ] Risk mitigations acknowledged by team
