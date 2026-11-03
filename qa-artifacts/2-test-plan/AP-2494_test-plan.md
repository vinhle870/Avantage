# Test Plan

**Plan ID:** TP-20261101-AP2494
**Project:** Avantage Plus v2 — Dealer portal quote list `/quotes` (Jira AP-2494)
**Version:** 1.0
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2494_requirements-analysis.md
**Total requirements:** 5

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify all acceptance criteria in REQ-001 to REQ-005 are met: the "Produits" column is gone, a "Contracts" column takes its place on both tabs, it lists each generated contract, and the new search finds quotes by quote name, client first name, last name, email, full name and VIN.
2. Confirm the column stays clean for quotes with no contract, or with a product that has no contract yet — a blank cell, never a blank or broken line (AC 5 and AC 6).
3. Confirm the search handles inputs it was not written for — a value that matches nothing, a different letter case, a partial value — without an error page. Where the ticket does not say what should happen, the test records what the build does.
4. Check that the list still works as before for paging and the two tabs (regression — re-checking something that worked before the change).
5. Record the answers the build gives to the open Judgement questions (Q-001 to Q-014), so the product owner can confirm or correct them.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | "Contracts" column replaces "Produits" on both tabs | Functional · UI · Regression |
| REQ-002 | "Contracts" column lists each generated contract | Functional · Edge-case · UI · Regression |
| REQ-003 | Search by partial, case-insensitive quote name | Functional · Negative · Edge-case · UI |
| REQ-004 | Search by client first name, last name, email or full name | Functional · Negative · Edge-case |
| REQ-005 | Search by partial VIN | Functional · Edge-case |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| Admin portal quote and contract screens | The ticket names only the dealer list `/quotes`. |
| Generating contracts as a feature | Contracts are created only as test data for this ticket; their own flows belong to other tickets (Chubb, Permaplate, roadside). |
| Performance of the search on large lists | No target is stated, and the dealer account under test holds a few hundred quotes at most. |
| API testing | The project tests through the UI only (`api-baseline` is missing in the knowledge registry). |
| Accessibility | Not requested by the ticket; no accessibility standard is stated for the dealer portal. |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end checks of the list and the search in the dealer portal, in a real browser | QA Agent |
| Integration Testing | N/A — no API contract is exposed or described for this change | — |
| Regression Testing | The tabs, the remaining columns and paging of `/quotes` still behave as recorded in the domain knowledge | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Execute each acceptance criterion against a quote prepared for it | playwright |
| Negative | Search for a value that matches no quote; search with an empty box | playwright |
| Edge-case | A quote with no contract; a quote with several contracts; a product without a contract next to one with a contract; partial and different-case search values | playwright |
| UI / Visual | Read the column headers and their order in English and French; screenshot each checked row | playwright screenshots |
| API | N/A — UI only | — |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **playwright** (see `qa-artifacts/qa-config/tools.md`). The AI agent:
- Drives the browser step by step
- Takes screenshots as evidence
- Records PASS / FAIL / BLOCKED per step and per test case

Bugs go to the bound `tracker` provider, **jira** (CLI access). The `notify` group is
`disabled` and is not needed by this plan.

---

## 4. Entry Criteria

_What has to be ready before testing can usefully start. Starting before these are
in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [ ] Application is deployed and accessible at the Staging URL from the `env` knowledge source
- [ ] `AP-2494_requirements-analysis.md` exists and has been reviewed (Gate A passed, rule A3)
- [ ] `AP2494_TestCases_*.md` files exist with at least 10 test cases
- [ ] Test environment is stable (no known blocking infrastructure issues)
- [ ] Test data is seeded: quotes of dealer 1380 carrying each contract type listed in §8, or a confirmed way to create them
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds

---

## 5. Exit Criteria

_What has to be true before we can say testing is finished and the release is safe
to consider. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] All High-priority test cases have been executed
- [ ] Test pass rate ≥ **90%** — the registry's `story_pass_threshold`
- [ ] Zero **Critical** severity bugs remain open
- [ ] **High** severity bugs ≤ 0 open — a wrong or missing contract misleads the dealer about what was sold
- [ ] `AP-2494_test-report.md` has been generated and reviewed
- [ ] All tracker tickets created in `AP-2494_bug-report.md`

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and
what has to be fixed before we pick it back up._

### Suspend testing when:
- Application is inaccessible for more than **30 minutes**
- More than **30%** of test cases are blocked by a single defect
- A **Critical** severity bug is found that prevents further execution — for example `/quotes` returning an error page

### Resume testing when:
- The blocking issue is resolved and confirmed by dev team
- Environment is stable for at least **15 minutes**
- A patch has been deployed addressing the blocking defect

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | Staging (v2staging) dealer portal — URL and login from the `env` knowledge source (credentials in `/.env`, never in this plan) |
| **Browser** | Chromium (Playwright default) |
| **OS** | Windows 11 |
| **Application version** | Not known — Staging exposes no build number; the ticket's linked Bitbucket pull request was merged on 2026-10-22 |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/` |
| **Bug tracker** | jira — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Dealer login | Shared dealer account of dealer 1380 ("Test QA staging") | Static — from the `env` source |
| Quote with an extended-warranty contract | A quote whose warranty contract has been generated | Reuse an existing quote of dealer 1380 if the list shows one; else create one through the quote flow (vehicle 915 entry point) |
| Quote with roadside, GAP or creditor-insurance contracts | One quote per type, or one quote with several | Reuse where found; roadside via "Save and Generate Contract" on `/quote/{id}/road-side-protection`; creditor via the Chubb flow (`contract-setup` source); GAP has no mapped route — reuse only |
| Quote with a Permaplate or sales contract | Permaplate contract, and a sales contract with a known contract number | Reuse where found; sales contract via `/quote/{id}/sales` (contractNumber field) |
| Quote with no contract | Any quote with no generated contract | Create a fresh quote from vehicle 915 |
| Quote with one product without a contract | A quote with one generated contract plus one product saved but not finalized | Add a product to a quote that already has a contract, without generating its contract |
| Quote with a known name, client and VIN | A fresh quote with a unique client first name, last name, Yopmail email and a vehicle of known VIN | Create in a `[Pre-Condition]` step; quote name only if the build lets the dealer set one (Q-010) |

### 8.1 Test Data Classification

_Decided once here, and inherited by every test case. `stlc-testcase-designer` reads this
table instead of re-deriving it, and puts Static values in the Execution Context, Dynamic
values in a `[Pre-Condition]` step, and Configuration values in a change-then-restore pair._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer login (dealer 1380) | Static | None applied | Named in Execution Context, resolved from `env` |
| Vehicle 915 (VIN `1FAHP35NX8W239204`) | Static | None applied | Named in Execution Context, from `test-data` |
| Quote with a unique client (search cases) | Dynamic | Q2 — the search assertions depend on the client name, email and VIN set at creation | Created in a `[Pre-Condition]` step with a unique run suffix in the names and a fresh `client.stage.NNN@yopmail.com` email |
| Quote with no contract | Dynamic | Q1 — it does not exist yet for this run | Created in a `[Pre-Condition]` step from vehicle 915 |
| Quote carrying a generated contract of a given type | Dynamic | Q2 — the assertion compares the cell with that contract's number | Reuse an existing quote of dealer 1380 when one is found on the list, recording its id and contract number; otherwise the case creates one in its `[Pre-Condition]` step |
| UI language (EN / FR) | Configuration | Q5 — the French check switches the shared account's session language | Switch with `?_locale=fr`, then restore `?_locale=en` inside the same case |

**Cost of the Dynamic items.** A plain quote takes about a minute to create and leaves a
quote on dealer 1380. A roadside contract adds a minute. A creditor-insurance contract runs
the full Chubb flow (several minutes, leaves a Chubb contract — see `contract-setup`). GAP
has no mapped creation route, so a GAP case depends on finding an existing quote; if none
exists the case is BLOCKED, not FAILED. Nothing is cleaned up — the `cleanup` source is
missing, so every created quote is listed in the execution log.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| Unstable test environment | Medium | High | Run the environment health check before s4; notify dev team |
| No quote with a GAP contract can be found or created (no mapped route) | High | Medium | Search the list for one first; record the case BLOCKED with the reason if none exists |
| A quote name cannot be set on Staging (AP-2477 vehicle-first form not deployed as of 2026-10-12) — Q-010 | Medium | High | Check during the pre-condition; the quote-name cases become BLOCKED, not FAILED |
| Ambiguous display of non-Permaplate contracts (Q-001) and separators (Q-002) | High | Medium | Judge only that an entry identifying each contract exists; record the exact text |
| Shared dealer account left in French after the language check | Medium | Low | Restore `?_locale=en` in the same case |
| playwright unreachable | Low | High | Run the preflight before starting; reconnect if needed |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-11-01 | Analysis | Requirements analysis | stlc-requirements-analyst |
| 2026-11-01 | Planning | Test plan design | stlc-test-plan-designer |
| 2026-11-01 | Design | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| Next browser slot | Execution | Manual test execution via playwright | stlc-manual-executor |
| After execution | Reporting | Bug reporting + ticket creation | stlc-bug-reporter |
| After execution | Reporting | Test report generation | stlc-test-reporter |
| After execution | Closure | Tracker ticket update | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Execute the STLC skills, generate all artifacts |
| QA Lead / Human reviewer | Review artifacts, approve sign-off checklist (gate_mode reviewer: stlc-qa-reviewer decides the gates) |
| Developer | Fix defects; confirm fixes before re-test |
| Product Owner (Nicolas-Eric Tain) | Answer open questions Q-001 to Q-015; approve exit criteria |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%)
- [ ] Risk mitigations acknowledged by team
