# Test Plan

**Plan ID:** TP-20261101-001
**Project:** Avantage Plus v2 — Client portal (AP-1948 CBI / CVE Tesla Price modification)
**Version:** 1.0
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-1948_requirements-analysis.md
**Total requirements:** 3 (REQ-001 – REQ-003)

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify that the price the Client portal shows for a selected warranty term equals the *suggested retail price* configured on that program term in the admin area (REQ-002).
2. Verify that the program terms offered on the Client portal are filtered by the vehicle model's Category A, B or C (REQ-001) — once Q-001 says which models are in which category.
3. Verify the Tesla figures of the "Original ask" (REQ-003) — only if Q-002 confirms they still apply and names the term each figure belongs to.
4. Record, without judging, what the build does where the ticket is silent: empty category, price format, price refresh on term change (Q-004 – Q-006).
5. Confirm that behaviour accepted as live on 2024-04-03 by the reporter has not regressed — the ticket shipped in 1.39.0, so this run is in practice a regression check.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | Program terms filtered by vehicle model Category (A, B, C) | Functional · Negative · Edge-case · UI — cases BLOCKED at design time by Q-001 |
| REQ-002 | Term price equals the program term's suggested retail price | Functional · Edge-case · Regression · UI |
| REQ-003 | Tesla pricing figures from the "Original ask" | Functional · Regression · UI — cases BLOCKED at design time by Q-002 |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| Dealer-portal and admin-portal quoting prices | The ticket's component is *Client portal* and its Given names the customer portal only. The admin area is used only to read a term's configured price |
| Contract generation, invoicing and payment after the quote request | Not mentioned in the ticket |
| API, performance and accessibility testing | Nothing in the ticket implies them; the project tests through the UI only (`api-baseline` is a declared gap) |
| French-language display | Not mentioned; the run uses the default language |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end check in the browser: read a term's price in the admin area, then see it on the Client portal | QA Agent |
| Integration Testing | N/A — no API contract is described; the admin → Client portal link is covered at system level | — |
| Regression Testing | Re-verification that pricing accepted live in April 2024 still holds (*regression* = checking that something that used to work still works) | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Select a term on the Client portal and compare the price shown with the term's admin *suggested retail price* | playwright |
| Negative | REQ-001 only: confirm a term of a different category is *not* offered (blocked until Q-001) | playwright |
| Edge-case | Switching between terms; a category with no term (record-only, Q-004) | playwright |
| UI / Visual | Screenshot of the term selector and the price shown | playwright screenshots |
| API | N/A — not in scope (§2.2) | — |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **playwright** (`mcp__playwright__*`, state `active` in `qa-artifacts/qa-config/tools.md`). The AI agent:
- Drives the browser step by step
- Takes screenshots as evidence under `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/`
- Records PASS / FAIL / BLOCKED per step and per test case

Capability groups this pipeline needs: `tracker` (jira CLI, active), `browser` (playwright, active). `notify` is `disabled` — no notification is sent, which is not a failure.

---

## 4. Entry Criteria

_What has to be ready before testing can usefully start. Starting before these are
in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [ ] Application is deployed and accessible at `https://v2staging.garantieavantageplus.ca` (from the `env` source)
- [ ] `AP-1948_requirements-analysis.md` exists and has passed Gate A (rule A2)
- [ ] At least 1 `AP1948_TestCases_*.md` file exists, and the review at Gate B is done
- [ ] Test environment is stable (the pipeline's environment health check passes before s4)
- [ ] Test data is available: customer 1493's Client portal link opens, and at least one program term with a *suggested retail price* is visible in the admin area
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds

---

## 5. Exit Criteria

_What has to be true before we can say testing is finished and the release is safe
to consider. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] All High-priority test cases have been executed or recorded BLOCKED with their question
- [ ] Test pass rate ≥ **90%** — the registry's `story_pass_threshold`; BLOCKED cases count as not passed, so this cannot be met while Q-001 or Q-002 is open
- [ ] Zero **Critical** severity bugs remain open
- [ ] **High** severity bugs ≤ 0 open — a wrong customer price is High, and one is enough to stop the release
- [ ] `AP-1948_test-report.md` has been generated and reviewed
- [ ] All tracker tickets listed in `AP-1948_bug-report.md`

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and
what has to be fixed before we pick it back up._

### Suspend testing when:
- Application is inaccessible for more than **30 minutes**
- More than **30%** of test cases are blocked by a single defect
- A **Critical** severity bug is found that prevents further execution
- Customer 1493's Client portal link returns an error page — it is the only known entry point

### Resume testing when:
- The blocking issue is resolved and confirmed by dev team
- Environment is stable for at least **15 minutes**
- A patch has been deployed addressing the blocking defect
- Q-001 / Q-002 are answered — re-run from s1 to unblock REQ-001 / REQ-003

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | `https://v2staging.garantieavantageplus.ca` — Client portal `/customer/1493/quote-request` (no login); admin area `/admin/login` (from the `env` source) |
| **Browser** | Chromium (Playwright default), viewport 1280 × 800 |
| **OS** | Windows 11 |
| **Application version** | Not known — the ticket's fix version is 1.39.0 (released 2024-04-04); staging runs a later build, which is not exposed in the UI as far as QA knows |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/` |
| **Bug tracker** | jira — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Client portal customer | Customer 1493 — the only Client portal link known (`env`) | Static — named in the Execution Context |
| Customer's vehicle | A vehicle (make, model) for which program terms are offered; a Tesla where REQ-003 applies | Created or chosen on the Client portal page in a `[Pre-Condition]` step — how the vehicle is entered is not mapped yet |
| User account (role: admin) | Admin login from `env`, to read a term's *suggested retail price* | Static — `env` source |
| User account (role: standard) | N/A — the Client portal has no login | — |
| Program terms | Existing terms with a category and a *suggested retail price* in the admin area | Read, not changed — see §8.1 |

### 8.1 Test Data Classification

Classified with the procedure in `stlc-testcase-designer` SKILL.md → Step 4. First Yes decides; undecided means Dynamic.

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Admin login | Static | None applied | Named in the Execution Context, resolved from `env` |
| Client portal link for customer 1493 | Static | None applied | Named in the Execution Context, resolved from `env` |
| Vehicle entered on the Client portal | Dynamic | Q2 — the terms and price asserted depend on the make and model entered | Entered in a `[Pre-Condition]` step with its make and model stated |
| Quote request submitted from the Client portal | Dynamic | Q1 — does not exist yet | Created only if a case submits; left on staging (no cleanup source) |
| Program term *suggested retail price* (read) | Static | None applied — read, not changed | Read in the admin area in a `[Pre-Condition]` step; the value is recorded, not assumed |
| Program term *suggested retail price* (changed) | Configuration | Q5 — a case that changes it alters shared configuration | Only if a case must change it: record the original, change, verify, restore inside the same case |

Cost of the Dynamic items: entering a vehicle on the Client portal takes a minute and calls no third party that QA knows of; a submitted quote request stays on staging because `cleanup` is a declared gap.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| Unstable test environment | Medium | High | The pipeline's health check runs before s4 |
| Client portal flow not mapped in any knowledge source; only customer 1493 is known | High | High | Designer derives the route; executor writes it back to `qa-docs` per the mapping guide. If 1493's page fails, cases are BLOCKED, not FAIL |
| Admin screen holding *suggested retail price* not mapped | High | Medium | Locate it during execution and record the route |
| Ambiguous ACs in REQ-001 (Q-001) and REQ-003 (Q-002) | High | High | Questions posted on AP-1948 (comment 19432, 2026-11-01); dependent cases BLOCKED at design time |
| Changing term prices on shared staging disrupts others | Medium | Medium | Read existing values; any change is restored in the same case |
| playwright unreachable | Low | High | Run the preflight before starting; reconnect if needed |
| Ticket is 2.5 years old; later work may have changed the pricing on purpose | Medium | Medium | A mismatch goes through Gate C; it is not called "not a bug" without a quotable sentence |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| Day 1 | Analysis | Requirements analysis | stlc-requirements-analyst |
| Day 1 | Planning | Test plan design | stlc-test-plan-designer |
| Day 1 | Design | Test case design and review | stlc-testcase-designer · stlc-testcase-reviewer |
| Day 2 | Execution | Manual test execution via playwright | stlc-manual-executor |
| Day 2 | Reporting | Bug reporting + ticket creation | stlc-bug-reporter |
| Day 2 | Reporting | Test report generation | stlc-test-reporter |
| Day 2 | Closure | Tracker ticket update | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Execute all 7 STLC skills, generate all artifacts |
| QA Lead / Human reviewer | Review artifacts, approve sign-off checklist (gates decided by `stlc-qa-reviewer` on this project) |
| Developer | Fix defects; confirm fixes before re-test |
| Product Owner (Eric Lindquist, reporter) | Answer Q-001 and Q-002; approve exit criteria |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%)
- [ ] Risk mitigations acknowledged by team
