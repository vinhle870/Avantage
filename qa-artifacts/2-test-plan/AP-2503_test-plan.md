# Test Plan

**Plan ID:** TP-20261101-AP2503
**Project:** Avantage Plus v2 — Dealer portal, extended warranty "Generate Contract" page `/quote/{quoteId}/warranty/generate-contract` (Jira AP-2503)
**Version:** 1.0
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2503_requirements-analysis.md

---

## 1. Test Objectives

- Verify that the extended warranty's "Generate Contract" action on a dealer quote opens a dedicated page at `/quote/{quoteId}/warranty/generate-contract`, not a modal, and that the same URL opened directly loads that page (REQ-001).
- Verify that the page shows "Owner information" and "Financing information" in the left column, and "Program Summary", a PDF preview and a submit button in the right column (REQ-002).
- Verify that the Program Summary shows the vehicle delivery date, an editable warranty start date and the warranty sale price (REQ-003).
- Verify that the client, vehicle and financing values are pre-filled from the quote, that the vehicle delivery date is read-only and that the owner fields and the warranty start date are editable (REQ-004).
- Verify that submitting valid values creates the extended-warranty contract, and record what the dealer sees afterwards — landing page, invoice, contract PDF (REQ-005).

---

## 2. Scope

### 2.1 In Scope

| Requirement | Test Types |
|---|---|
| REQ-001 — Dedicated page at the unchanged route | Functional, UI, Regression |
| REQ-002 — Two-column layout with PDF preview | UI, Functional |
| REQ-003 — Program Summary content | Functional, UI, Edge-case |
| REQ-004 — Pre-fill, read-only and editable fields | Functional, UI, Negative, Edge-case |
| REQ-005 — Submit creates the contract | Functional, Regression, Negative |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| The internal route name `quote-warranty-generate-contract` | Not observable in the browser; only the URL is |
| The content and wording of the contract PDF and the invoice amounts | The story says they "stay unchanged" and gives no new rule; they are recorded, not judged (Q-007) |
| Program eligibility (which programs a vehicle qualifies for) | Belongs to AP-2497; this story starts from a quote that already has an extended warranty |
| Esthetic protection's own contract page | Belongs to AP-2428 / AP-2506; it is only the reference the description compares with (Q-010) |
| French UI wording | Not mentioned by the story; judgements are made in EN |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Description | Responsible |
|---|---|---|
| System Testing | End-to-end checks of the dealer quote and the generate-contract page in a real browser | QA Agent |
| Regression | Contract creation from the new page, compared with the old modal flow recorded in the automation suite | QA Agent |

### 3.2 Test Types

| Type | Approach |
|---|---|
| Functional | Follow each acceptance criterion step by step on a quote the case builds itself |
| UI | Check the two columns and the sections each one holds, by their headings |
| Negative | Empty a required-looking owner field and an editable date before submit; record the response (Q-004, Q-006) |
| Edge-case | A quote with no financing (Q-008); a warranty start date before the delivery date (Q-004) |
| Regression | After submit, a contract exists and the quote page offers the invoice as before |

Every expected result that rests on an open Judgement question (Q-001 – Q-010) is
*record-only*: the step records what the build shows, and fails only on an objective
fault — an error page, a lost value, a value different from the one entered.

### 3.3 Test Execution Method

All manual test cases are executed by **stlc-manual-executor** through the project's
bound `browser` provider, **playwright** (`mcp__playwright__*`, state `active` in
`qa-artifacts/qa-config/tools.md` §1). Bugs and the result comment go through the
`tracker` provider, **jira** (CLI wrapper `tools/jira-cli/jira.sh`, state `active`). The
`notify` group is `disabled`, so no notification is sent. Screenshots go under
`qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/`.

---

## 4. Entry Criteria

- [ ] AP-2503 is in QC (canonical `ready_for_qa`) and its pull request is merged — both true at capture on 2026-11-01.
- [ ] v2staging is reachable and the shared dealer account (from the `env` source) can log in.
- [ ] The requirements analysis has no Blocking + Open question — true (Gate A, rule A3).
- [ ] Test cases are written and reviewed (`AP2503_TestCases_*.md`, Gate B).
- [ ] The dealer has at least one extended-warranty program that a freshly created vehicle qualifies for (checked in the first case's pre-condition; if none, every case is BLOCKED, not FAIL).

## 5. Exit Criteria

- [ ] Every test case has a status other than `Not Run`.
- [ ] Every FAIL is filed, linked to an existing bug, or dismissed with a quoted reason (Gate C).
- [ ] Pass rate ≥ 90 % (registry `story_pass_threshold`) for the story to move to Ready for release.
- [ ] `AP-2503_test-report.md` is written and the result comment is posted on AP-2503.

## 6. Suspension & Resumption Criteria

### Suspend testing when:

- v2staging or the dealer login fails twice in a row, or returns HTTP 5xx before the step under test.
- No extended-warranty program can be added to a fresh quote, so no case can reach the page.
- Generating a contract returns an error page on two different quotes — every remaining case that submits would hit the same defect.

### Resume testing when:

- The environment answers again and a login succeeds.
- A program is available for a fresh vehicle, or the developer names a vehicle profile that qualifies.
- The submit defect is fixed and deployed.

---

## 7. Test Environment

| Component | Details |
|---|---|
| Application URL | v2staging dealer portal — base URL from the `env` source |
| Login | The shared dealer account (dealer 1380) from the `env` source; the password is read there at run time and never written into an artifact |
| Browsers | Chromium through playwright, viewport 1280 × 800 |
| Test data | Created per case — see §8 |
| Bug tracker | jira (`tracker`, CLI) |
| Screenshot path | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Dealer login | Shared dealer account | `env` source |
| Vehicle | A new inventory vehicle with VIN, make, model, year and kilometres stored, created for the case | `[Pre-Condition]` step from Inventory `/vehicle/inventory` |
| Quote with client | Entered from `/vehicle/{vehicleId}/details` → **Create quote** (`/quote/new/client?fromVehicleId={vehicleId}`) — never the bare `/quote` entry, which returns HTTP 500 on a quote with no vehicle (`domain`, quote-creation.md) | `[Pre-Condition]` step |
| Delivery date on the quote vehicle | A fixed date entered on the quote vehicle step, so the Program Summary can be compared with it | `[Pre-Condition]` step |
| Extended warranty from a program | The first program term offered for the vehicle, with a sale price the case enters | `[Pre-Condition]` step on the quote page; the term chosen and the price are recorded |
| Financing on the quote | A financing with a base amount, term and rate the case enters (only for the pre-fill case) | `[Pre-Condition]` step at `/quote/{id}/financing` |
| Quote 6276 and vehicle 915 | Shared records reserved for other tickets | **Not used** |

### 8.1 Test Data Classification

_Decided once here, and inherited by every test case._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer login | Static | None applied | Named in Execution Context, resolved from `env` |
| Inventory vehicle | Dynamic | Q2 — the pre-fill and read-only checks depend on the VIN and values set at creation | Created per case in a `[Pre-Condition]` step. Cost about 2 minutes, no third party; left on staging (no `cleanup` source) |
| Quote and client | Dynamic | Q1 — does not exist yet; Q2 — pre-fill assertions depend on the client values | Created per case via `fromVehicleId`. Cost about 2 minutes |
| Extended warranty on the quote | Dynamic | Q2 — sale price and term are compared on the page | Added per case. A quote whose contract was generated is consumed (Q3) and is never reused |
| Financing on the quote | Dynamic | Q2 — the financing pre-fill depends on it | Added only in the case that checks financing pre-fill |
| Generated contract and invoice | Dynamic | Q3 — consumed; created by the submit cases | Left on staging; every contract and invoice id is listed in the execution log |

A quote that has not been submitted may be reused by the read-only cases of the same
run (layout, pre-fill, read-only checks never change it); the case still spells out how
to build one when it is absent. A submitted quote is never reused.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| The old modal flow, which the story says stays "unchanged" after submit, is not in the knowledge sources — rated High impact because REQ-005 has no baseline | High | High | Use the behaviour recorded in the automation suite (`playwright-automation/src/pages/dealerPortal/QuoteDetailPage.ts`, `WarrantyDetailsPage.ts`, `flows/DealerFlow.ts`: the Extended warranty row's menu links to `…/warranty/generate-contract`; the modal embedded the PDF `/quote/{id}/pdf`; its submit `#warranty_finalize_save` created an invoice, after which the quote page shows a link to `/invoice/…`) as the observable regression check; record everything else (Q-007) |
| No program accepts a fresh vehicle, so no case reaches the page | Medium | High | The first case's pre-condition records the programs offered; none → every case BLOCKED with the reason |
| Each submit leaves a real contract and invoice on the shared dealer account | High | Medium | Only two cases submit; ids are logged |
| An optional "Financing company" left on "Choose" made the Permaplate contract submit fail with HTTP 500 (AP-2459) — the warranty page may share it | Medium | Medium | The submit case records the financing values used; an HTTP 500 on submit is a FAIL with the full input set recorded |
| Left-column, preview and identifier questions (Q-001 – Q-003) are open | High | Medium | Those points are record-only; the cases judge only what the sentences state |
| A "delivery date has passed the acceptable timeframe" banner was seen on the old Generate Contract (AP-2489, closed as not a bug) | Medium | Low | Use a recent delivery date (the run date); record any banner |
| playwright unreachable | Low | High | Browser preflight before s4 |

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
| Developer | Fix defects; confirm the post-submit behaviour (Q-007) |
| Product Owner (Nicolas-Eric Tain) | Answer the Judgement questions Q-001 – Q-010 |

---

## 12. Sign-off Checklist

- [x] Every requirement REQ-001 – REQ-005 is in scope with its test types
- [x] Entry and exit criteria are stated
- [x] Test data is classified and its cost stated
- [x] Risks have mitigations
- [x] Providers named from the registry (jira, playwright; notify disabled)
- [ ] Reviewed by QA Lead (reviewer mode — Gate B covers the cases)
