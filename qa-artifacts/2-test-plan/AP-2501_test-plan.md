# Test Plan

**Plan ID:** TP-20261101-AP2501
**Project:** Avantage Plus v2 — AP-2501, Permaplate invoice: include the name of the term in the description
**Version:** 1.0
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** `qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md`

---

## 1. Test Objectives

- Verify that when a dealer creates a Permaplate contract, the invoice generated for it names the contract's term in its description, on the invoice details page (REQ-001).
- Verify that the same term name appears in the invoice PDF (REQ-002) and in the invoice list of both the Dealer Portal and the Admin area (REQ-003).
- Record where the term sits relative to the contract number, and judge it once the reporter answers Q-001 (REQ-004).
- Confirm that adding the term did not undo earlier invoice fixes: the description still carries the real contract number (AP-2461) and still shows no retail price (AP-2456).

---

## 2. Scope

### 2.1 In Scope

| Requirement | Test Types |
|---|---|
| REQ-001 — Term name on the invoice details page | Functional, Edge-case (a second, different term), Regression (contract number, no retail price), UI |
| REQ-002 — Term name on the invoice PDF | Functional, UI |
| REQ-003 — Term name on the Dealer and Admin invoice lists | Functional, UI |
| REQ-004 — Term name follows the contract number | Functional, UI — BLOCKED until Q-001 is answered |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| Invoices for warranty, Road Side Protection, creditor insurance and GAP products | The ticket names only the Permaplate invoice (Q-006 is Info). |
| Paying the invoice | Covered by AP-2446; taking a real payment on staging would leave a financial record behind. |
| Renaming a term in the Admin Permaplate catalogue | The catalogue is shared configuration other testers rely on, and no test result in this ticket depends on it (Q-004 is Info). |
| Exact wording, language and line layout of the term | Not stated by the ticket (Q-002, Q-005). Recorded, not judged. |
| Back-filling invoices created before the change | Not stated (Q-003). An old invoice may be observed and recorded, never failed. |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Description | Responsible |
|---|---|---|
| System testing | End-to-end through the browser: create a Permaplate quote and contract in the Dealer Portal, then inspect the invoice it raises on every named surface. | QA Agent |
| Regression | Regression testing (re-checking behaviour that already worked) of the description fields fixed by AP-2446/AP-2461 and AP-2456. | QA Agent |

### 3.2 Test Types

| Type | Approach |
|---|---|
| Functional | For each surface, check that a line naming the term chosen on the Permaplate Quote page is present in the invoice description. |
| Edge-case | Create a second contract with a different term and check the invoice names that term, not the first one — this catches a hard-coded or cached value. |
| Regression | On the same invoice, check the contract number matches the contract created and that no retail price appears. |
| UI | Screenshot each surface; record the exact text, the language and the order of lines. |

### 3.3 Test Execution Method

All manual test cases will be executed by **stlc-manual-executor** through the bound `browser`
provider — `playwright` (`mcp__playwright__*`), state `active` in
`qa-artifacts/qa-config/tools.md` §1. Bugs and the result comment go through the `tracker`
provider — `jira` through the CLI wrapper `tools/jira-cli`, state `active`. The `notify`
group is `disabled` and is not needed. This run (`--until s3b`) designs only; execution
happens in a later run.

---

## 4. Entry Criteria

Entry criteria are the conditions that must hold before execution starts.

- [ ] v2staging is reachable and the Dealer and Admin logins from the `env` source work (environment health check before s4).
- [ ] AP-2501's change is deployed to v2staging — confirmed independently of the result under test: the ticket is in **QC**, its pull request is merged (Jira development panel), and a deploy note or build reference for v2staging is recorded where one exists. Deployment is **never** inferred from the invoices themselves: a new invoice without a term line is a **FAIL** in AP2501_001, not an unmet entry criterion.
- [ ] Dealer 1380 has a Permaplate product linked (AP-2447 prerequisite) with at least two different terms selectable on `/quote/{id}/permaplate`.
- [ ] `AP-2501_requirements-analysis.md` and the test cases have passed reviewer gates A and B.

---

## 5. Exit Criteria

Exit criteria are the conditions that must hold before testing of this ticket is considered done.

- [ ] Every test case has a status other than Not Run.
- [ ] Every FAIL has a bug filed, linked or dismissed at Gate C.
- [ ] Pass rate ≥ 90% of all non-SKIPPED cases (the project's `story_pass_threshold`) — below this the story stays in QC, because one in ten checks failing on a four-surface change means a surface is missing the term.
- [ ] No open Critical or High bug, and Q-001 answered — otherwise REQ-004 was never judged and the story cannot move to release.

---

## 6. Suspension & Resumption Criteria

### Suspend testing when:

- v2staging is unreachable or returns HTTP 5xx before the step under test.
- Creating a Permaplate contract fails (for example the AP-2459 HTTP 500 returns), since every case depends on a new invoice.
- The Permaplate product is no longer linked to Dealer 1380, so no Permaplate quote can be made.

### Resume testing when:

- The environment answers normally and a Permaplate contract can be created again; re-run the suspended cases from their first step.

---

## 7. Test Environment

| Component | Details |
|---|---|
| Application URL | v2staging — Dealer Portal and Admin Portal URLs from the `env` source (`qa-artifacts/base-test/execute.env.md`) |
| Browsers | Chromium (Playwright default), 1280 × 800 |
| Test data | Generated at run time: one client and one quote per contract; vehicle 915 from the `test-data` source |
| Bug tracker | `jira` (CLI), bound in `qa-artifacts/qa-config/tools.md` |
| Screenshot path | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/` |

---

## 8. Test Data Requirements

- User accounts: the shared Dealer Portal login (Dealer ID 1380) and the Admin Portal login, both from the `env` source. No credential is copied into this plan.
- Pre-populated records: vehicle 915 (VIN `1FAHP35NX8W239204`, Ford Focus 2008) from the `test-data` source; the Permaplate product linked to Dealer 1380.
- Edge-case values: two different Permaplate terms on the quote page; a client name with accents is not needed, but the term label itself carries an accent (`complète`), which the PDF must render.

### 8.1 Test Data Classification

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer and Admin logins | Static | None applied | Named in the Execution Context, resolved from `env` |
| Vehicle 915 | Static | None applied — it is only selected, never changed | Named in the Execution Context, from `test-data` |
| Client and quote | Dynamic | Q1 — it does not exist yet | Created in a `[Pre-Condition]` step with a fresh name per run |
| Permaplate contract and its invoice | Dynamic | Q1 — created by the case; Q2 — assertions depend on the term chosen at creation | Created in a `[Pre-Condition]` step; the term label and contract number are recorded for the checks |
| Permaplate product and its terms (Admin catalogue) | Configuration | Q5 would apply only if changed — this plan never changes it | Read only; nothing to restore |

**Cost of the Dynamic data:** each contract takes about two minutes to create through the
Dealer Portal, calls no third party, and leaves behind a client, a quote, a Permaplate
contract and an unpaid invoice on Dealer 1380. The project has no cleanup procedure
(`cleanup` source is missing), so these stay on staging. One contract can be reused by the
PDF and list-page cases; the edge case needs a second contract with a different term.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| Q-001 is not answered before execution, so the position check (REQ-004) cannot be judged. | High | Medium | The case is designed BLOCKED; the story stays in QC until it is answered. Likelihood is High because the reporter has not been asked before. |
| The exact text of the term (bilingual label, single language, short form) is not stated (Q-002). | High | Low | Compare against the term label on the Permaplate Quote page and record; never fail on wording. |
| The Admin-area invoice list has never been mapped, so its route is not known. | Medium | Medium | Find it from the Admin sidebar during execution and write it back to `admin-portal.md`; if no list exists, the case is BLOCKED, not FAIL. |
| How to reach the invoice PDF has not been recorded. | Medium | Medium | Locate the download control on the invoice details page and record its label and route. |
| Dealer 1380's Permaplate product offers only one term, so the edge case cannot pick a second one. | Low | Medium | Record the available terms; mark the edge case BLOCKED if only one exists. |
| Contract creation regresses (AP-2459 HTTP 500). | Low | High | Suspension criterion above; retry once, then BLOCKED. |
| `notify` capability is `disabled`. | — | None | Not needed by this plan. |

---

## 10. Test Schedule

| Phase | Activity | Owner |
|---|---|---|
| 2026-11-01 | Requirements analysis, test plan, test case design and review (this run, `--until s3b`) | stlc-requirements-analyst, stlc-test-plan-designer, stlc-testcase-designer, stlc-testcase-reviewer |
| Next execution wave | Test execution on v2staging | stlc-manual-executor |
| Same day as execution | Bug reporting and test report | stlc-bug-reporter, stlc-test-reporter |
| Same day | Ticket result comment and outcome | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent (pipeline worker) | Designs and executes the cases, files bugs, writes the reports |
| stlc-qa-reviewer | Decides gates A–D in place of a manual review |
| Ken Nguyen (reporter) | Answers Q-001 to Q-006 |
| Minh Lưu (developer, per the ticket comment) | Fixes any bug filed |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by product owner
- [ ] Environment confirmed available
- [ ] Entry criteria met before execution begins
- [ ] Q-001 answered or accepted as a release blocker
