# Test Plan

**Plan ID:** TP-20261103-AP2504
**Project:** Avantage Plus v2 — Dealer portal, GAP and creditor insurance "Generate Contract" pages `/quote/{quoteId}/insurance/create-contract/gap` and `/quote/{quoteId}/insurance/create-contract` (Jira AP-2504)
**Version:** 1.0
**Date:** 2026-11-03
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2504_requirements-analysis.md

---

## 1. Test Objectives

- Verify that the GAP insurance "Generate Contract" action on a dealer quote opens a dedicated page in the same tab at `/quote/{quoteId}/insurance/create-contract/gap`, not a modal, and that the same address opened directly loads that page (REQ-001).
- Verify that the page shows "Vehicle identification", "Owner information" and "Financing information" in the left column — plus "Co-owner information" when the quote has a co-applicant — and "Program Summary" with a "Generate Contract" button in the right column (REQ-002).
- Verify that the vehicle, owner, co-owner and financing values are pre-filled from the quote and that the financing values cannot be changed on the page (REQ-003).
- Verify that submitting valid values creates the GAP contract, and record what the dealer sees afterwards — landing page, message, invoice, contract number, PDF (REQ-004).
- Verify that the creditor-insurance "Generate Contract" action opens `/quote/{quoteId}/insurance/create-contract` in the same tab and still creates the creditor contract (REQ-005).

---

## 2. Scope

### 2.1 In Scope

| Requirement | Test Types |
|---|---|
| REQ-001 — GAP action opens the dedicated page at the GAP address | Functional, UI, Regression |
| REQ-002 — Two-column layout, co-owner section only with a co-applicant | UI, Functional, Edge-case |
| REQ-003 — Pre-fill and read-only financing | Functional, UI, Negative, Edge-case |
| REQ-004 — Submit creates the GAP contract | Functional, Regression, Negative |
| REQ-005 — Creditor insurance at its own address | Functional, Regression, UI |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| The internal route name `quote-insurance-create-contract` | Not observable in the browser; only the address is |
| GAP and creditor premiums, rates and the Chubb quote itself | Belong to AP-2499 / AP-2405; this story starts from a quote that already holds a GAP or creditor quote |
| The GAP / creditors **add** modal and its defects AP-2526, AP-2527, AP-2528 | Belong to AP-2499. Setup avoids the modal by opening `/quote/{id}/financing` and `/quote/{id}/gap-insurance` / `/quote/{id}/insurance` as pages; a case whose setup is stopped by one of these bugs is BLOCKED naming it |
| The content and wording of the contract PDF and the invoice amounts | The story says they "stay unchanged" and gives no new rule; they are recorded, not judged (Q-008, Q-009) |
| French UI wording | Not mentioned by the story; judgements are made in EN |
| Narrow screen widths | No width is named; judged at 1280 × 800 only |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Description | Responsible |
|---|---|---|
| System Testing | End-to-end checks of the dealer quote and the GAP / creditor generate-contract pages in a real browser | QA Agent |
| Regression | Contract creation from the new pages, compared with the creditor flow recorded in `domain` (chubb-insurance.md §5, quote-creation.md Dev sections) | QA Agent |

### 3.2 Test Types

| Type | Approach |
|---|---|
| Functional | Follow each acceptance criterion step by step on a quote the case builds itself |
| UI | Check the two columns and the sections each one holds, by their headings |
| Negative | Try to type into every financing field (must not change); empty a required-looking owner field before submit and record the response (Q-007) |
| Edge-case | A quote with and without a co-applicant (Q-004); a quote whose GAP contract already exists (Q-010) |
| Regression | After submit, a contract exists for the quote; the creditor flow still creates its contract |

Every expected result that rests on an open Judgement question (Q-002 – Q-011) is
*record-only*: the step records what the build shows, and fails only on an objective
fault — an error page, a lost value, a value different from the one entered. The case for
acceptance criterion 1 as written (the Extended Warranty row) is BLOCKED by Q-001
(Blocking) until the author answers.

### 3.3 Test Execution Method

All manual test cases are executed by **stlc-manual-executor** through the project's
bound `browser` provider, **playwright** (`mcp__playwright__*`, state `active` in
`qa-artifacts/qa-config/tools.md` §1). Bugs and the result comment go through the
`tracker` provider, **jira** (CLI wrapper `tools/jira-cli/jira.sh`, state `active`). The
`notify` group is `disabled`, so no notification is sent. Screenshots go under
`qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/`.

---

## 4. Entry Criteria

- [x] AP-2504 is in QC (canonical `ready_for_qa`) and its development panel shows a merged pull request deployed to `develop` on 2026-10-30.
- [ ] The **Dev** environment (`execution_env: Dev` in the registry) is reachable and the shared dealer account (dealer 1380, from the `env` source's Dev section) can log in.
- [x] The requirements analysis has been through Gate A — rule A2: one Blocking question (Q-001) posted on AP-2504 (comment 19460); the other requirements proceed.
- [ ] Test cases are written and reviewed (`AP2504_TestCases_*.md`, Gate B).
- [ ] Dealer 1380 on Dev can save a financing and a GAP quote (checked in the first case's pre-condition; if not, every case is BLOCKED, not FAIL).

## 5. Exit Criteria

- [ ] Every test case has a status other than `Not Run`.
- [ ] Every FAIL is filed, linked to an existing bug, or dismissed with a quoted reason (Gate C).
- [ ] Pass rate ≥ 90 % (registry `story_pass_threshold`) and Q-001 answered for the story to move to Ready for release.
- [ ] `AP-2504_test-report.md` is written and the result comment is posted on AP-2504.

## 6. Suspension & Resumption Criteria

### Suspend testing when:

- Dev or the dealer login fails twice in a row, or returns HTTP 5xx before the step under test.
- No GAP quote can be saved on a fresh quote (financing or GAP page refuses or errors), so no case can reach the page.
- Generating a GAP contract returns an error on two different quotes — every remaining submitting case would hit the same defect.

### Resume testing when:

- The environment answers again and a login succeeds.
- A GAP quote can be saved again.
- The submit defect is fixed and deployed.

---

## 7. Test Environment

| Component | Details |
|---|---|
| Application URL | **Dev** (v2dev) dealer portal — base URL from the `env` source's "Dev Environment" section |
| Login | The shared dealer account (dealer 1380) from the `env` source; the password is read there at run time and never written into an artifact |
| Browsers | Chromium through playwright, viewport 1280 × 800 |
| Test data | Created per case — see §8 |
| Bug tracker | jira (`tracker`, CLI) |
| Screenshot path | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Dealer login | Shared dealer account, dealer 1380 | `env` source (Dev section) |
| Vehicle 915 | Ford Focus 2008, VIN `1FAHP35NX8W239204`, 5000 km — the shared Dev test vehicle (`test-data`). Only read: every quote is created **from** it via **Create quote**; the vehicle itself is never edited | Static |
| Quote with client | Entered from `/vehicle/915/details` → **Create quote** (`/quote/new/client?fromVehicleId=915`) — never the bare `/quote` entry, which returns HTTP 500 on a quote with no vehicle (`domain`, quote-creation.md) | `[Pre-Condition]` step, one fresh quote per case or per named reuse |
| Financing on the quote | Date of birth `1985-06-15`, Province Québec, Type "Financing", base amount `25000`, residual `0`, Monthly, term `60`, rate `6.99`, first financing company listed — saved on the old page `/quote/{id}/financing` (works on Dev, `domain`) so the setup does not go through the GAP / creditors add modal | `[Pre-Condition]` step |
| GAP quote | `/quote/{id}/gap-insurance` opened as a page: Rate table "TGGAP", Language "English", Tax exempt "No", Gap Term `60` → **Get Quote** (flash "GAP insurance quote saved successfully" on Dev) | `[Pre-Condition]` step |
| Creditor quote | `/quote/{id}/insurance` opened as a page: Language "English", Tax exempt "No", Form "Monthly Premium PM30", Life "Decreasing" / `60` / "Borrower" → **Get Quote** (flash "Chubb insurance quote saved successfully") | `[Pre-Condition]` step (REQ-005 cases only) |
| Co-applicant | First name `Coowner`, last name `Coapp2504`, date of birth `1987-03-20`, plus each further field the form requires (recorded). The way to add one is not mapped (Q-012) — the executor uses the control in the quote's co-applicant section ("No applicant" notice) and writes it back to `domain` | `[Pre-Condition]` step; none found → case BLOCKED "test data not on Dev: no co-applicant control" |
| Client inbox | `client.stage.2504NNN@yopmail.com`, `NNN` = case number | Per case |
| Quotes and contracts of other tickets (e.g. 6276, 6533–6544, 6557–6561) | Reserved for their tickets | **Not used** |

### 8.1 Test Data Classification

_Decided once here, and inherited by every test case._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer login | Static | None applied | Named in Execution Context, resolved from `env` |
| Vehicle 915 | Static | None applied — its VIN, make, model, year and mileage are recorded in `test-data`, and no case changes it | Named in Execution Context; the pre-fill checks compare with the `test-data` values |
| Quote and client | Dynamic | Q1 — does not exist yet; Q2 — pre-fill assertions depend on the client values | Created per case via `fromVehicleId=915`. About 2 minutes, no third party |
| Financing | Dynamic | Q2 — the financing pre-fill and read-only checks depend on its values | Added per case on `/quote/{id}/financing` |
| GAP quote / creditor quote | Dynamic | Q1 — needed before the action exists; it calls Chubb's quote service (third party, a few seconds) | Added per case. A Chubb quote older than 10 days cannot be contracted, so it is always made the same day |
| Co-applicant | Dynamic | Q2 — the co-owner pre-fill depends on its values | Added only in the co-owner case |
| Generated GAP / creditor contract and any invoice | Dynamic | Q3 — consumed; created by the submit cases. Calls Chubb's contract service (third party, ~8 s) | Left on Dev; every contract number, quote id and invoice id is listed in the execution log |

A quote that has not been submitted may be reused by the read-only cases of the same
run (layout, pre-fill and read-only checks never change it); the case still spells out how
to build one when it is absent. A submitted quote is never reused for a pre-submit check.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| No GAP contract has ever been created on Dev, so "the current process" has no observed baseline (Q-008) | High | High | Judge only that a contract exists afterwards (a contract number in place of the GAP row's actions menu, or a row on `/gap-insurance-contracts`); record the rest |
| Chubb's external contract service fails or refuses the quote (e.g. "Contract date entered was at least 10 days older than the original quote date") | Medium | High | Fresh GAP quote the same day; the full banner text is recorded; an error before the step under test is BLOCKED |
| The setup path's known bugs AP-2526, AP-2527, AP-2528 (GAP / creditors add modal) | High | Medium | Setup opens `/quote/{id}/financing` and `/quote/{id}/gap-insurance` as pages, not the modal; a setup stopped by one of the bugs is BLOCKED naming it |
| The Chubb creditor contract PDF returned HTTP 500 on Dev (quote 6480, 2026-11-02) | High | Medium | PDF responses are recorded (Q-009); a PDF failure on the new page is compared with that observation at Gate C |
| No way to add a co-applicant is known (Q-012) | Medium | Medium | The co-owner case records BLOCKED "test data not on Dev" if no control is found |
| Each submit leaves a real Chubb contract on the shared dealer account | High | Medium | Only three cases submit; ids are logged |
| The Program Summary's lines and the financing field list are not stated (Q-003, Q-005) | High | Medium | Those points are record-only; the cases judge only what the sentences state |
| playwright unreachable | Low | High | Browser preflight before s4 |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-11-03 | Analysis | Requirements analysis | stlc-requirements-analyst |
| 2026-11-03 | Planning | Test plan design | stlc-test-plan-designer |
| 2026-11-03 | Design | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| Wave 2 | Execution | Manual test execution on Dev via playwright | stlc-manual-executor |
| Wave 2 | Reporting | Bug reporting + test report | stlc-bug-reporter, stlc-test-reporter |
| Wave 2 | Closure | Story comment and status per Gate D | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Run the STLC skills and write every artifact |
| QA Reviewer (stlc-qa-reviewer) | Approve gates A–D in place of the QA lead (`gate_mode: reviewer`) |
| Developer | Fix defects; confirm the post-submit behaviour (Q-008) |
| Product Owner (Nicolas-Eric Tain) | Answer Q-001 (Blocking) and the Judgement questions Q-002 – Q-011 |

---

## 12. Sign-off Checklist

- [x] Every requirement REQ-001 – REQ-005 is in scope with its test types
- [x] Entry and exit criteria are stated
- [x] Test data is classified and its cost stated
- [x] Risks have mitigations
- [x] Providers named from the registry (jira, playwright; notify disabled)
- [ ] Reviewed by QA Lead (reviewer mode — Gate B covers the cases)
