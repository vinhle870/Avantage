# Test Plan

**Plan ID:** TP-20261101-AP2501
**Project:** Avantage Plus v2 — AP-2501, Permaplate invoice: include the name of the term in the description
**Version:** 1.1
**Date:** 2026-11-01
**Revised:** 2026-11-15 — after the 2026-11-15 analysis re-run and the R1 round 2 Gate A decision (rule A2): execution moves to Dev (the registry's `execution_env`); Q-002 to Q-006 and the new Q-008 are Accepted (record-and-accept), Q-007 is Answered by AP-2099, Q-001 stays Blocking + Open; dealer 1380's Permaplate product link becomes Configuration data that AP2501_002 (and the AP2501_004/005 fallback) changes and restores itself; a Permaplate contract on Dev now needs a Financing company. See §13
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** `qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md`

---

## 1. Test Objectives

- Verify that when a dealer creates a Permaplate contract, the invoice generated for it names the contract's term in its description, on the invoice details page (REQ-001).
- Verify that the same term name appears in the invoice PDF (REQ-002) and in the invoice list of both the Dealer Portal and the Admin area (REQ-003).
- Record where the term sits relative to the contract number, and judge it once the reporter answers Q-001 (REQ-004). Q-008 (Accepted) already fixes the position as the line directly after the contract number; Q-001 decides which name must sit there.
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
| Paying the invoice | Covered by AP-2446; taking a real payment on Dev would leave a financial record behind. |
| Renaming a term in the Admin Permaplate catalogue | The catalogue is shared configuration other testers rely on, and no test result in this ticket depends on it (Q-004 is Info). |
| Any wording, language or list layout other than what the build showed on 2026-11-02 | Q-002 and Q-005 are Accepted (no Story or Task defines them): the cases assert the observed values — the term line reads exactly as the term's label on the Permaplate Quote page ("10 ans" on Dev) and both invoice lists show the description in full, one item per line. Other forms are not tested. |
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
happens in a later run. Execution runs on **Dev (v2dev)** — the registry's `execution_env` (`qa-artifacts/qa-config/tools.md`, QA orchestrator selection) — using the *Dev Environment* section of the `env` source.

---

## 4. Entry Criteria

Entry criteria are the conditions that must hold before execution starts.

- [ ] Dev (v2dev) is reachable and the Dealer and Admin logins from the `env` source (*Dev Environment* section) work (environment health check before s4).
- [ ] AP-2501's change is deployed to Dev — confirmed independently of the result under test: the ticket is in **QC**, its pull request is merged (Jira development panel), and a deploy note or build reference for Dev is recorded where one exists. Deployment is **never** inferred from the invoices themselves: a new invoice without a term line is a **FAIL** in AP2501_001, not an unmet entry criterion.
- [ ] Dealer 1380 has at least one Permaplate product linked (AP-2447 prerequisite — "10 ans", product 3, on Dev since 2026-11-02). A second term is **not** an entry criterion any more: AP2501_002 links one itself (term 2 "5 ans", else term 1 "3 ans") at `/admin/dealer/1380/permaplate/link` and unlinks it again before the case ends.
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

- Dev (v2dev) is unreachable or returns HTTP 5xx before the step under test.
- Creating a Permaplate contract fails (for example the AP-2459 HTTP 500 returns), since every case depends on a new invoice.
- The Permaplate product is no longer linked to Dealer 1380, so no Permaplate quote can be made.
- A case that linked a second term to Dealer 1380 cannot confirm that the unlink restored the original link list (only "10 ans"). Run no further case: other tickets share Dealer 1380, and a term left linked changes what their quote pages offer. Report it in the execution log and the run summary.

### Resume testing when:

- The environment answers normally and a Permaplate contract can be created again; re-run the suspended cases from their first step.

---

## 7. Test Environment

| Component | Details |
|---|---|
| Application URL | Dev (v2dev) — Dealer Portal and Admin Portal URLs from the *Dev Environment* section of the `env` source (`qa-artifacts/base-test/execute.env.md`) |
| Browsers | Chromium (Playwright default), 1280 × 800 |
| Test data | Generated at run time: one client and one quote per contract; vehicle 915 from the `test-data` source; invoice 941 / contract PNA-0000000020 (created on Dev by AP2501_001 on 2026-11-02) reused by AP2501_003–006 |
| Bug tracker | `jira` (CLI), bound in `qa-artifacts/qa-config/tools.md` |
| Screenshot path | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/` |

---

## 8. Test Data Requirements

- User accounts: the shared Dealer Portal login (Dealer ID 1380) and the Admin Portal login, both from the `env` source. No credential is copied into this plan.
- Pre-populated records: vehicle 915 (VIN `1FAHP35NX8W239204`, Ford Focus 2008) from the `test-data` source; the Permaplate product "10 ans" linked to Dealer 1380; on Dev, invoice 941 (contract PNA-0000000020, term "10 ans") from the 2026-11-02 run.
- Contract form on Dev: the Financing company is required since 2026-11-08 (`domain`, `quote-creation.md`); every case that generates a contract picks **AutoCapital Canada**.
- Edge-case values: two different Permaplate terms on the quote page; a client name with accents is not needed, but the term label itself carries an accent (`complète`), which the PDF must render.

### 8.1 Test Data Classification

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer and Admin logins | Static | None applied | Named in the Execution Context, resolved from `env` |
| Vehicle 915 | Static | None applied — it is only selected, never changed | Named in the Execution Context, from `test-data` |
| Client and quote | Dynamic | Q1 — it does not exist yet | Created in a `[Pre-Condition]` step with a fresh name per run |
| Permaplate contract and its invoice | Dynamic | Q1 — created by the case; Q2 — assertions depend on the term chosen at creation | Created in a `[Pre-Condition]` step; the term label and contract number are recorded for the checks |
| Permaplate terms in the Admin catalogue (`/admin/permaplate`) | Static | None applied — read only | Named in the cases; never edited |
| Dealer 1380's linked Permaplate products (`/admin/dealer/1380/permaplate`) | Configuration | Q5 — AP2501_002 (and the AP2501_004/005 fallback) links a second term, which every other ticket using Dealer 1380 would then see | The case records the linked rows first, links term 2 "5 ans" (or 1 "3 ans"), and unlinks it again in the same case; the restore is confirmed against the recorded rows. Unlinking destroys no contract or invoice (AP-2455 run, 2026-09-06) |

**Cost of the Dynamic data:** each contract takes about two minutes to create through the
Dealer Portal, calls no third party, and leaves behind a client, a quote, a Permaplate
contract and an unpaid invoice on Dealer 1380. The project has no cleanup procedure
(`cleanup` source is missing), so these stay on Dev. One contract can be reused by the
PDF and list-page cases (invoice 941); the edge case needs a second contract with a different term,
which leaves one more client, quote, contract and **permanent** invoice. The term link it adds is
removed by the same case.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| Q-001 is not answered before execution, so the position check (REQ-004) cannot be judged. | High | Medium | The case is designed BLOCKED; the story stays in QC until it is answered. Likelihood is High because it was asked on 2026-11-01 and 2026-11-08 and is still unanswered. |
| The exact text of the term (bilingual label, single language, short form) is not stated (Q-002). | Low | Low | Q-002 Accepted: the term line must read exactly as the term's label on the Permaplate Quote page ("10 ans" on Dev). |
| The invoice PDF (Admin invoice page **PDF** button, `/admin/invoice/{id}/pdf` — AP-2099) answers HTTP 500 on Dev (AP-2529, open). | High | High | AP2501_003 still runs: the PDF control is the step under test, so an error there is a FAIL linked to AP-2529, never BLOCKED. |
| Dealer 1380 offers only one term on Dev, so the edge case has no second term to sell. | High | Medium | AP2501_002 links a second term itself and unlinks it in the same case. If neither "5 ans" nor "3 ans" can be linked, or the new term offers no option for vehicle 915, the case is BLOCKED (test data not on Dev). |
| The second term stays linked to Dealer 1380 because the case stopped before its unlink step. | Low | High | The unlink step runs whatever happened in the steps before it; if the restore cannot be confirmed, no further case runs (§6) and the run summary says so. |
| A Permaplate contract cannot be generated with Financing company "Choose" on Dev (since 2026-11-08). | High | Low | Every case picks AutoCapital Canada. |
| Contract creation regresses (AP-2459 HTTP 500). | Low | High | Suspension criterion above; retry once, then BLOCKED. |
| `notify` capability is `disabled`. | — | None | Not needed by this plan. |

---

## 10. Test Schedule

| Phase | Activity | Owner |
|---|---|---|
| 2026-11-01 | Requirements analysis, test plan, test case design and review (this run, `--until s3b`) | stlc-requirements-analyst, stlc-test-plan-designer, stlc-testcase-designer, stlc-testcase-reviewer |
| 2026-11-02 | First execution on Dev — 1 PASS, 1 FAIL (AP-2529), 4 BLOCKED | stlc-manual-executor |
| 2026-11-15 | Analysis re-run, plan and cases revised, review of the changed cases (Wave 1) | stlc-requirements-analyst, stlc-test-plan-designer, stlc-testcase-designer, stlc-testcase-reviewer |
| Next execution wave | Re-execution on Dev of AP2501_002–005 (AP2501_001 keeps its PASS; AP2501_006 stays BLOCKED on Q-001) | stlc-manual-executor |
| Same day as execution | Bug reporting and test report | stlc-bug-reporter, stlc-test-reporter |
| Same day | Ticket result comment and outcome | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent (pipeline worker) | Designs and executes the cases, files bugs, writes the reports |
| stlc-qa-reviewer | Decides gates A–D in place of a manual review |
| Ken Nguyen (reporter) | Answers Q-001 — the only question still open (Q-002 to Q-006 and Q-008 Accepted, Q-007 Answered by AP-2099) |
| Minh Lưu (developer, per the ticket comment) | Fixes any bug filed |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by product owner
- [ ] Environment confirmed available
- [ ] Entry criteria met before execution begins
- [ ] Q-001 answered or accepted as a release blocker

---

## 13. Revisions

| Date | Change | Reason |
|---|---|---|
| 2026-11-15 | Environment v2staging → Dev throughout (§2.2, §3.3, §4, §6, §7, §8) | The registry's `execution_env` is Dev (user decision 2026-11-01); the 2026-11-02 execution already ran there |
| 2026-11-15 | §1, §2.2, §9, §11: wording and list layout move from "recorded, not judged" to record-and-accept; Q-008 fixes the position; only Q-001 still needs an answer | 2026-11-15 analysis: Q-002 to Q-006 and Q-008 Accepted, Q-007 Answered (AP-2099), Q-001 Blocking + Open (R1 round 2, rule A2) |
| 2026-11-15 | §4, §6, §8.1, §9: dealer 1380's Permaplate link reclassified Configuration; a second term is set up and restored by AP2501_002; new suspension rule for an unconfirmed restore | Orchestrator decision 2026-11-15 (batch qa-agent): the cases BLOCKED on 2026-11-02 set up their own second term |
| 2026-11-15 | §8, §9: Financing company AutoCapital Canada on every contract | Dev refuses a blank Financing company since 2026-11-08 (`domain`, `quote-creation.md`, AP-2459 run) |
| 2026-11-15 | §9: the invoice PDF risk replaces the two "not mapped" risks | Admin invoice list and PDF control mapped 2026-11-02 (`billing-invoices.md`); Q-007 Answered by AP-2099; AP-2529 open |
