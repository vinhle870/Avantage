# Test Plan

**Plan ID:** TP-20261101-AP2377
**Project:** Avantage Plus v2 — Customer portal, online warranty purchase (AP-2377 "Customer portal changes")
**Version:** 1.0
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2377_requirements-analysis.md
**Total requirements:** 6

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify all acceptance criteria in REQ-001 through REQ-006 are met under normal conditions on the customer purchase flow `/customer/avantage-plus/buy`.
2. Confirm the new step order — Vehicle → Client Info → Coverage — works in both directions a customer can move, and that no step is skipped or repeated.
3. Confirm the new labels ("Continue" / "Continuer", "Get rates now" / "Demander un devis") and the FORM L25 consent checkbox appear in English and French as written in the ticket.
4. Confirm a surcharge the customer answers YES to is carried from the Coverage step to the summary page, and — once a warranty is paid — to the admin warranty details page.
5. Record, without judging, the behaviours the ticket leaves open (validation of the new fields, the unticked consent checkbox, NO answers, French wording), so the author can confirm them in one pass.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | Vehicle step — current manufacturer / extended warranty fields and the "Continue" button | Functional · UI · Negative (record-only) · Edge-case (record-only) · Regression |
| REQ-002 | Client Info step now follows the Vehicle step | Functional · UI · Regression |
| REQ-003 | Client Info step — FORM L25 consent checkbox and "Get rates now" button | Functional · UI · Negative (record-only) · Regression |
| REQ-004 | "Get rates now" opens the Coverage step | Functional · Regression |
| REQ-005 | Summary page lists surcharges answered YES | Functional · UI · Edge-case (record-only) |
| REQ-006 | Admin warranty details page shows the chosen surcharges after payment | Functional · Regression |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| The old per-customer quote-request portal (`/customer/273/quote-request`, `/customer/1493/quote-request`) | The ticket names it only "for reference"; every acceptance criterion names `/customer/avantage-plus/buy` (Q-008, Info). |
| Price calculation of surcharges | No acceptance criterion states how a surcharge changes the price; the summary's totals are only checked for being present and not empty. |
| Whether the current-warranty end date moves the new warranty's start date | The help text describes it, but no acceptance criterion asks for it to be checked (REQ-001 risk). The summary's start date is recorded, not judged. |
| AP-2394 (customer claim error) | A linked bug about customer claims, already Done; it is not part of the purchase flow. |
| Performance, accessibility, API | No requirement implies them; the flow is tested through the browser only. |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end walk of the customer purchase flow in a real browser, plus one admin-portal check | QA Agent |
| Integration Testing | Not planned separately — the hand-off from the customer portal to the admin warranty page (REQ-006) is checked at system level | QA Agent |
| Regression Testing | Re-checking that the existing steps (vehicle entry, coverage choice, summary, Back navigation) still work after the re-ordering. "Regression" means making sure something that used to work has not been broken by the change. | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Walk each acceptance criterion step by step on the customer purchase flow | Playwright (browser provider) |
| Negative | Leave the new fields empty, type unusual values, leave the FORM L25 box unticked — **record-only**, because the ticket gives no rule (Q-001, Q-004): a case fails only on an objective fault such as an error page, an HTTP 5xx or a lost value | Playwright |
| Edge-case | A NO surcharge answer, a past warranty end date — record-only (Q-001, Q-007) | Playwright |
| UI / Visual | Labels, button text and step bar in English and French, checked against the exact wording quoted in the capture; screenshots as evidence | Playwright screenshots |
| API | Not used — the project tests through the UI only (`api-baseline` source is `missing`) | — |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **Playwright** (`mcp__playwright__*`, see `qa-artifacts/qa-config/tools.md`). The AI agent:
- Drives the browser step by step
- Takes screenshots as evidence
- Records PASS / FAIL / BLOCKED per step and per test case

Bugs and comments go through the bound `tracker` provider, **Jira** (CLI wrapper `tools/jira-cli`). The `notify` group is `disabled`, so no channel is notified; that is expected, not a gap.

---

## 4. Entry Criteria

_What has to be ready before testing can usefully start. Starting before these are
in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [ ] The application is deployed and reachable at `https://v2staging.garantieavantageplus.ca`, and `/customer/avantage-plus/buy` loads without login
- [ ] `qa-artifacts/1-requirements-analysis/AP-2377_requirements-analysis.md` exists and Gate A passed (rule A3, 2026-11-01)
- [ ] `qa-artifacts/3-test-cases/AP2377_TestCases_*.md` exist with at least 6 test cases — one per requirement
- [ ] The environment health check (agent-coordination c2) passes
- [ ] Test data is ready: a fresh client email per run (`client.stage.NNN@yopmail.com`); for REQ-006 only, a staging test payment method (currently **not known** — see §9)
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds
- [ ] AP-2377 is in QC (ready for QA), so the build is expected to contain the change — confirmed at intake on 2026-11-01

---

## 5. Exit Criteria

_What has to be true before we can say testing is finished and the release is safe
to consider. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] All High-priority test cases have been executed (or recorded BLOCKED with a named reason)
- [ ] Test pass rate ≥ **90%** — the project's `story_pass_threshold`, chosen so a story moves to release only when nearly everything was proven; BLOCKED counts as not passed
- [ ] Zero **Critical** severity bugs remain open
- [ ] **High** severity bugs: 0 open — the purchase flow takes customers' money, so a High bug (e.g. a step that loses entered data) stops the release
- [ ] `qa-artifacts/5-testing-report/AP-2377_test-report.md` has been generated and reviewed
- [ ] Every FAIL is filed, linked or dismissed in `qa-artifacts/5-testing-report/AP-2377_bug-report.md`

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and
what has to be fixed before we pick it back up._

### Suspend testing when:
- The application is inaccessible for more than **30 minutes**
- More than **30%** of test cases are blocked by a single defect — for this ticket, a broken Vehicle step would block every later case, so it is the most likely trigger
- A **Critical** severity bug is found that prevents further execution

### Resume testing when:
- The blocking issue is resolved and confirmed by dev team
- Environment is stable for at least **15 minutes**
- A patch has been deployed addressing the blocking defect

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | `https://v2staging.garantieavantageplus.ca` (`env` source); customer flow at `/customer/avantage-plus/buy` (from the ticket); Admin portal at `/admin/login` |
| **Browser** | Chromium (Playwright default) |
| **OS** | Windows 11 (the QA workstation) |
| **Application version** | Build deployed to v2staging on the execution date; ticket fix version 3.6.0 |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/` |
| **Bug tracker** | Jira — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Customer purchase flow | Public page `/customer/avantage-plus/buy`, no login | None — exists |
| Vehicle for the purchase | The example from the ticket's summary screenshot (A3): 2020 TESLA Model 3 Plus, VIN `5YJ3E1EA0LF734293`, 10000 km. Used because it is the only vehicle the ticket shows with a surcharge question (air suspension) | Typed into the Vehicle step in each case |
| Current-warranty values | From attachment A1: Warranty Number `2131331`, Warranty end date a future date (e.g. `2027-12-18`; A1's sample `2025-12-18` is now in the past), Warranty mileage limit `100000` | Typed in each case |
| Client details | Name, address in Quebec, phone, and a fresh `client.stage.NNN@yopmail.com` per run | Typed in each case |
| Program with a surcharge | CVE · CVE 60m/0km · BEV, with the question "Is this vehicle equipped with an air suspension system?" (A3) | Selected at the Coverage step |
| Admin account (role: admin) | `vinhle870@gmail.com` — for the REQ-006 check | `env` source |
| Test payment method | A card or method the customer portal accepts on staging | **Not known** — no source holds it |

### 8.1 Test Data Classification

_Decided once here, and inherited by every test case. `stlc-testcase-designer` reads this
table instead of re-deriving it, and puts Static values in the Execution Context, Dynamic
values in a `[Pre-Condition]` step, and Configuration values in a change-then-restore pair._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Customer purchase page `/customer/avantage-plus/buy` | Static | None applied — it exists and nothing in the run changes it | Named in the Execution Context |
| Admin login `vinhle870@gmail.com` | Static | None applied | Named in the Execution Context, resolved from `env` |
| Program CVE 60m/0km BEV and its air-suspension question | Static | None applied — the tests read it, never change it | Named in the Execution Context; if staging no longer offers it for the Tesla, the affected cases are BLOCKED |
| An in-progress online purchase (vehicle + current-warranty values) | Dynamic | Q1 — it does not exist until the customer types it; Q2 — the assertions depend on the values typed | Created in a `[Pre-Condition]` step with every value written in |
| Client details with `client.stage.NNN@yopmail.com` | Dynamic | Q4 — each run needs its own address so earlier mail or records are not mistaken for new ones | Created in a `[Pre-Condition]` step |
| Surcharge answer YES / NO | Dynamic | Q2 — the summary assertion depends on the answer chosen | Set in the step that chooses coverage |
| Paid warranty contract | Dynamic | Q1 and Q3 — it does not exist and each payment consumes a purchase | Created in a `[Pre-Condition]` step; blocked until a payment method is known |

**Anything classified Dynamic is a cost.** Walking the flow to the summary takes about two
to three minutes per case and calls no third party; it leaves behind one unpaid online
purchase (and a client record, if the portal saves one at the Client Info step) per run.
A paid contract would call the payment provider and leave a real contract on staging with
no defined clean-up (`cleanup` source is `missing`). Partial purchases are not reused
across cases, because each case's assertions depend on the step it starts from.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| No staging test payment method is known, so REQ-006 cannot be executed | High — no source holds one | High — the admin-side criterion stays unproven and the pass rate falls below 90% | The REQ-006 case is BLOCKED at design and listed as a known blocker; ask the team for a staging test card before execution |
| The customer purchase flow is not mapped in the knowledge base (`navigation` lists only the old per-customer link) | High | Medium — the executor finds labels and routes as it goes | Steps quote the labels from the capture; the executor writes the mapped flow back to `qa-docs` (knowledge-sources.md §4) |
| The Tesla / CVE BEV program no longer offers the air-suspension question on staging | Medium | Medium — REQ-005 and REQ-006 cannot be shown | The case records BLOCKED with that reason rather than picking another program on a guess |
| Unstable test environment | Medium | High | Run the health check before execution; notify the dev team |
| Ambiguous behaviour on the new fields, the unticked checkbox and NO answers (Q-001, Q-004, Q-007) | High | Low — those results are record-only | The s7 comment lists each open question with what the build does |
| Playwright unreachable | Low | High | Run the preflight before starting; reconnect if needed |
| The Admin warranty details page route is unknown | Medium | Medium | Found at execution from the Admin portal and written back to the knowledge base |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-11-01 | Analysis | Requirements analysis | stlc-requirements-analyst |
| 2026-11-01 | Planning | Test plan design | stlc-test-plan-designer |
| 2026-11-01 | Design | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| Next execution slot | Execution | Manual test execution via Playwright | stlc-manual-executor |
| Same day | Reporting | Bug reporting + ticket creation | stlc-bug-reporter |
| Same day | Reporting | Test report generation | stlc-test-reporter |
| Same day | Closure | Jira ticket update | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Execute all STLC skills, generate all artifacts |
| QA Reviewer (stlc-qa-reviewer) | Approves each gate in place of a manual review (`gate_mode: reviewer`) |
| QA Lead / Human reviewer | Supplies the staging test payment method; reads the run summary |
| Developer | Fix defects; confirm fixes before re-test |
| Product Owner (Ken Nguyen, reporter) | Answer the open questions Q-001–Q-008 |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%)
- [ ] Risk mitigations acknowledged by team
