# Test Plan

**Plan ID:** TP-{{YYYYMMDD}}-001
**Project:** {{PROJECT_NAME}}
**Version:** 1.0
**Date:** {{DATE}}
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/requirements-analysis.md
**Total requirements:** {{TOTAL_REQUIREMENTS}}

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify all acceptance criteria in {{REQ_ID_RANGE}} are met under normal conditions.
2. Confirm the system rejects invalid inputs and handles error states gracefully.
3. Validate UI elements render correctly and are accessible to all users.
4. Detect defects before the feature reaches production.
5. {{ADDITIONAL_OBJECTIVE}}

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | {{FEATURE_NAME}} | Functional · Negative · Regression |
| REQ-002 | {{FEATURE_NAME}} | Functional · Edge-case · UI |
| REQ-003 | {{FEATURE_NAME}} | Functional · Negative · API |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| {{FEATURE_OR_TEST_TYPE}} | {{REASON — e.g. "Performance testing — deferred to load test cycle"}} |
| {{FEATURE_OR_TEST_TYPE}} | {{REASON}} |

_(Write "None" if everything is in scope)_

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end feature validation in browser | QA Agent |
| Integration Testing | API contracts between frontend and backend | QA Agent |
| Regression Testing | Re-verification of existing features after changes | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Execute each acceptance criterion step by step | {{BROWSER_PROVIDER}} |
| Negative | Submit invalid/boundary inputs; verify error handling | {{BROWSER_PROVIDER}} |
| Edge-case | Empty states, max length, zero values, special characters | {{BROWSER_PROVIDER}} |
| UI / Visual | Screenshot comparison, layout checks | {{BROWSER_PROVIDER}} screenshots |
| API | Verify HTTP responses, status codes, payloads | {{BROWSER_PROVIDER}} / direct API |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **{{BROWSER_PROVIDER}}** (see `qa-artifacts/qa-config/tools.md`). The AI agent:
- Drives the browser step by step
- Takes screenshots as evidence
- Records PASS / FAIL / BLOCKED per step and per test case

---

## 4. Entry Criteria

_What has to be ready before testing can usefully start. Starting before these are
in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [ ] Application is deployed and accessible at `APP_BASE_URL`
- [ ] `qa-artifacts/requirements-analysis.md` exists and has been reviewed
- [ ] `qa-artifacts/test-cases.md` exists with at least {{MIN_TEST_CASES}} test cases
- [ ] Test environment is stable (no known blocking infrastructure issues)
- [ ] Test data is seeded: {{TEST_DATA_REQUIREMENTS}}
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds

---

## 5. Exit Criteria

_What has to be true before we can say testing is finished and the release is safe
to consider. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] All High-priority test cases have been executed
- [ ] Test pass rate ≥ **{{PASS_RATE_THRESHOLD}}%** (recommended: 90%)
- [ ] Zero **Critical** severity bugs remain open
- [ ] **High** severity bugs ≤ {{MAX_HIGH_BUGS}} open
- [ ] `qa-artifacts/test-report.md` has been generated and reviewed
- [ ] All tracker tickets created in `qa-artifacts/bug-report.md`

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and
what has to be fixed before we pick it back up._

### Suspend testing when:
- Application is inaccessible for more than **30 minutes**
- More than **30%** of test cases are blocked by a single defect
- A **Critical** severity bug is found that prevents further execution

### Resume testing when:
- The blocking issue is resolved and confirmed by dev team
- Environment is stable for at least **15 minutes**
- A patch has been deployed addressing the blocking defect

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | `APP_BASE_URL` (configured in .env) |
| **Browser** | Chromium (Playwright default) |
| **OS** | {{OS — e.g. Windows 10 / macOS / Linux}} |
| **Application version** | {{VERSION or BUILD_ID}} |
| **Screenshot path** | `reports/screenshots/` |
| **Bug tracker** | {{TRACKER_PROVIDER}} — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| {{DATA_NAME}} | {{DESCRIPTION}} | {{Manual / Seed script / API call}} |
| User account (role: admin) | Admin user for setup steps | Create via `{{URL/script}}` |
| User account (role: standard) | Regular user for happy path tests | Create via `{{URL/script}}` |
| {{ENTITY}} records | Pre-existing data for read/update tests | {{SETUP_METHOD}} |

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| Unstable test environment | Medium | High | Run smoke test before full execution; notify dev team |
| Missing or incomplete test data | Low | High | Document setup steps in TC preconditions |
| Ambiguous ACs in {{REQ_ID}} | High | Medium | Raise open questions before execution starts |
| {{BROWSER_PROVIDER}} unreachable | Low | High | Run the preflight before starting; reconnect if needed |
| {{ADDITIONAL_RISK}} | {{L/M/H}} | {{L/M/H}} | {{MITIGATION}} |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| Day 1 | Analysis | Requirements analysis | stlc-requirements-analyst |
| Day 1 | Planning | Test plan design | stlc-test-plan-designer |
| Day 2 | Design | Test case design | stlc-testcase-designer |
| Day 2–3 | Execution | Manual test execution via {{BROWSER_PROVIDER}} | stlc-manual-executor |
| Day 3 | Reporting | Bug reporting + ticket creation | stlc-bug-reporter |
| Day 3 | Reporting | Test report generation | stlc-test-reporter |
| Day 4 | Closure | Tracker ticket update | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Execute all 7 STLC skills, generate all artifacts |
| QA Lead / Human reviewer | Review artifacts, approve sign-off checklist |
| Developer | Fix defects; confirm fixes before re-test |
| Product Owner | Clarify open questions; approve exit criteria |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ {{THRESHOLD}}%)
- [ ] Risk mitigations acknowledged by team
