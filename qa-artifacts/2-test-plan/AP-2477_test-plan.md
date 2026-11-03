# Test Plan

**Plan ID:** TP-20261012-001
**Project:** Avantage Plus v2 — Dealer portal, new-quote vehicle form `/quote/new/edit-vehicle` (Jira AP-2477)
**Version:** 1.0
**Date:** 2026-10-12
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2477_requirements-analysis.md
**Total requirements:** 7

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify all acceptance criteria in REQ-001 to REQ-007 are met on the "Créer une cotation" vehicle form at `/quote/new/edit-vehicle`.
2. Confirm a quote can be created with only Brand, Model and Year, and that the removed fields (kilometres, condition, designation, price) are saved empty rather than with a made-up default.
3. Confirm the "Décoder" button fills Brand, Model and Year from a VIN, and that the decoded technical details (transmission, engine, fuel, cylinders, turbo) still reach the saved vehicle.
4. Confirm missing Brand, Model or Year is refused without creating a quote.
5. Confirm the change did not break the inventory vehicle form, the vehicle edit form opened from a quote, or the next step of a quote built from the minimal form. A regression check means making sure a change did not break something that used to work.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | Five fields, in order, matching the mockup | Functional · UI · Regression |
| REQ-002 | "Décoder" only for VEHICLE-group types | Functional · UI · Regression |
| REQ-003 | Decode pre-fills and keeps hidden details for saving | Functional · Edge-case · Regression |
| REQ-004 | Only Brand / Model / Year required; empty values saved | Functional · Edge-case · Regression |
| REQ-005 | Missing Brand / Model / Year refused, nothing saved | Negative · Edge-case |
| REQ-006 | Other vehicle forms unchanged | Regression |
| REQ-007 | Quote name kept across decode | Functional · Edge-case |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| Direct database checks of NULL columns | No database access from the QA agent. NULL storage is verified through the vehicle details / edit pages instead. |
| Piece-protection vehicle forms | No route is mapped in the knowledge sources; deferred unless found during execution. |
| Full downstream audit (window sticker PDF, warranty field mapping, program terms) | The ticket lists them as a developer audit item. This cycle takes one quote one step further (quote details and the warranty list) as a smoke check, not a full audit. |
| The VinAudit service itself | Outside system. Its failure is recorded as BLOCKED, not as a defect in this ticket. |
| API, accessibility and performance testing | Not named in the ticket. |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end checks of the new-quote vehicle form in a real browser, from login to the saved quote and its vehicle | QA Agent |
| Integration Testing | The VIN decoder round trip (the form calls the outside VinAudit service through the app), checked through the browser only | QA Agent |
| Regression Testing | Inventory vehicle form and the vehicle edit form still require their full fields; a minimal quote opens its details page | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Open the form, read the visible fields, save with Brand/Model/Year, decode a known VIN | Playwright MCP |
| Negative | Submit with Brand, Model or Year missing; compare the quote list before and after | Playwright MCP |
| Edge-case | Decode after choosing Brand (ignored by design); Quote name typed before decoding; Quote name and VIN left empty | Playwright MCP |
| UI / Visual | Compare the form with the attached mockup; check required markers; screenshot each state | Playwright MCP screenshots |
| API | Not applicable — see §3.1 | — |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **Playwright MCP** (see `qa-artifacts/qa-config/tools.md`). The AI agent:
- Drives the browser step by step
- Takes screenshots as evidence
- Records PASS / FAIL / BLOCKED per step and per test case

---

## 4. Entry Criteria

_What has to be ready before testing can usefully start. Starting before these are
in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [ ] Application is deployed and accessible at `https://v2staging.garantieavantageplus.ca`
- [ ] **The AP-2477 build is on staging.** The pre-execution check opens `/quote/new/edit-vehicle`. If Price or Kilometers are still shown, execution stops with "build not deployed" instead of recording failures.
- [ ] `qa-artifacts/1-requirements-analysis/AP-2477_requirements-analysis.md` exists and has been reviewed (done at Gate A, 2026-10-12)
- [ ] At least 5 test cases exist in `qa-artifacts/3-test-cases/AP2477_TestCases_*.md`
- [ ] Test environment is stable (dealer login works)
- [ ] Test data: dealer account 1380 and a known VIN (§8)
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds

---

## 5. Exit Criteria

_What has to be true before we can say testing is finished and the release is safe
to consider. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] All High-priority test cases have been executed
- [ ] Test pass rate ≥ **90%**, the project's release threshold (`story_pass_threshold`). Below it, the story stays in QC
- [ ] Zero **Critical** severity bugs remain open
- [ ] **High** severity bugs ≤ 0 open. A High bug here would mean dealers cannot create a quote, or quotes are saved with wrong vehicle data
- [ ] `qa-artifacts/5-testing-report/AP-2477_test-report.md` has been generated and reviewed
- [ ] All tracker tickets created in `qa-artifacts/5-testing-report/AP-2477_bug-report.md`

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and
what has to be fixed before we pick it back up._

### Suspend testing when:
- Application is inaccessible for more than **30 minutes**
- More than **30%** of test cases are blocked by a single defect
- A **Critical** severity bug is found that prevents further execution
- The form still shows the full field set (build not deployed)

### Resume testing when:
- The blocking issue is resolved and confirmed by dev team
- Environment is stable for at least **15 minutes**
- A patch has been deployed addressing the blocking defect

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | `https://v2staging.garantieavantageplus.ca` — Dealer portal (resolved from the `env` knowledge source) |
| **Browser** | Chromium (Playwright default), viewport 1280 × 800 |
| **OS** | Windows 11 (QA workstation) |
| **Application version** | Not known. The portal shows no build number; AP-2477 deployment is confirmed by the pre-execution check in §4 |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/` |
| **Bug tracker** | Jira (CLI wrapper `tools/jira-cli`), bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Dealer login | Shared staging dealer account, Dealer ID 1380 ("Test QA staging", QC) | Resolved from the `env` knowledge source |
| Known VIN | `1FAHP35NX8W239204`, a 2008 Ford Focus (inventory vehicle 915) | Typed in the step. Expected decode: Ford / Focus / 2008 |
| Brand / Model / Year for manual entry | A make and model available in the lists, e.g. "Toyota" / "Corolla" / 2020; fall back to the first make and first model if those are absent | Chosen in the step |
| New quotes | Created by the cases, named `QA-AP2477-{NNN}-{HHMMSS}` where a name is used | Created by the test cases |
| Inventory form | `/vehicle/new/edit/PASSENGER`, opened read/submit-only for the regression check | Existing screen |

### 8.1 Test Data Classification

_Decided once here, and inherited by every test case._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer login (1380) | Static | None applied | Named in Execution Context, resolved from `env` |
| Known VIN `1FAHP35NX8W239204` | Static | None applied. Decoding reads it and does not change it | Typed in the step |
| Make / model reference lists | Static | None applied | Chosen by visible label |
| Quotes created from the form | Dynamic | Q1: they do not exist yet. Q2: assertions depend on the values entered | Created in the case's own steps. Cost: about 15 seconds each; quotes cannot be deleted by the dealer, so they stay on staging |
| Vehicle records behind those quotes | Dynamic | Q1 | Created by the same save; read back on `/vehicle/{id}/details` |
| VinAudit decoder service | Static (outside dependency) | None applied | A failure is BLOCKED, not FAIL |
| Inventory vehicle 915 | Static, read-only | None applied | Never edited |

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| AP-2477 not deployed on staging | Medium | High | Pre-execution check in §4 |
| VinAudit decoder not configured on staging (Q-001) | Medium | High | Decoder cases record BLOCKED with the screen's response. The rest of the cycle continues |
| Save fails with HTTP 500 because quote-vehicle price is not nullable | Medium | High | This is exactly what REQ-004's main case checks. Recorded as FAIL with evidence |
| Downstream screens break on empty kilometres/condition/price (Q-002) | Medium | High | Smoke step: open the new quote's details and warranty list. Any error page is a FAIL |
| Cannot see NULL in the database | High | Medium | Verify on the vehicle details / edit page that the fields are blank, not defaulted |
| Vehicle type menu not mapped (Q-006) | Medium | Low | Map it during execution; test one VEHICLE type and one other type if available |
| Unstable test environment | Medium | High | Run the environment health check before s4; retry an environment failure once, then mark it BLOCKED |
| Playwright MCP unreachable | Low | High | Run the preflight before starting |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-10-11 | Analysis | Requirements analysis | stlc-requirements-analyst |
| 2026-10-12 | Planning | Test plan design | stlc-test-plan-designer |
| 2026-10-12 | Design | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| 2026-10-12 | Execution | Manual test execution via Playwright MCP | stlc-manual-executor |
| 2026-10-12 | Reporting | Bug reporting + ticket creation | stlc-bug-reporter |
| 2026-10-12 | Reporting | Test report generation | stlc-test-reporter |
| 2026-10-12 | Closure | Tracker ticket update | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Execute all 7 STLC skills, generate all artifacts |
| QA Lead / Human reviewer (Vinh Le) | Review artifacts, decide at Gates A–C, approve sign-off checklist |
| Developer (Minh Lưu) | Fix defects; answer Q-001, Q-004, Q-005, Q-006 |
| Product Owner (Nicolas-Eric Tain, reporter; Ken Nguyen) | Answer Q-002, Q-003; approve exit criteria |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%)
- [ ] Risk mitigations acknowledged by team
