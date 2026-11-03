# Test Plan

**Plan ID:** TP-20261101-AP2506
**Project:** Avantage Plus v2 — Dealer portal, Esthetic protection "Generate Contract" page `/quote/{quoteId}/permaplate-create-contract` (Jira AP-2506)
**Version:** 1.0
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2506_requirements-analysis.md

---

## 1. Test Objectives

- Verify that the Esthetic protection "Generate Contract" action on a dealer quote opens a dedicated page at `/quote/{quoteId}/permaplate-create-contract`, not a modal, and that the same address opened directly loads that page (REQ-001). AC 1's "in the same tab" is tied to the Extended Warranty row, open as Q-001, so the tab is recorded until the author answers.
- Verify that the page shows "Vehicle identification" and "Owner information" in the left column, and "Program Summary" and a submit button in the right column (REQ-002).
- Verify that the Program Summary shows the program term, start date, end date, the selected protection products and a total (REQ-003).
- Verify that the vehicle and owner values are pre-filled from the quote (REQ-004).
- Verify that submitting valid values creates the Esthetic protection contract, listed on the dealer's contract list with a working PDF, and record what the dealer sees afterwards — landing page, message, invoice (REQ-005).

---

## 2. Scope

### 2.1 In Scope

| Requirement | Test Types |
|---|---|
| REQ-001 — Dedicated page at the unchanged address | Functional, UI, Regression, Edge-case |
| REQ-002 — Two-column layout | UI, Functional |
| REQ-003 — Program Summary content | Functional, UI, Edge-case |
| REQ-004 — Pre-fill of vehicle and owner | Functional, UI |
| REQ-005 — Submit creates the contract | Functional, Regression, Negative |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| The internal route name `quote-permaplate-create-contract` | Not observable in the browser; only the address is |
| The content and wording of the contract PDF and the invoice amounts | The story says they "stay unchanged" and gives no new rule; they are recorded, not judged (Q-009) |
| Linking an Esthetic protection product to the dealer (admin side) | Belongs to AP-2447; this story starts from a quote that already carries Esthetic protection. Dealer configuration is not changed by this plan |
| The extended warranty's own contract page `/quote/{id}/warranty/generate-contract` | Belongs to AP-2503; it is touched only by the BLOCKED AC 1 case (Q-001) |
| French UI wording; narrow screen widths | Not mentioned by the story; judgements are made in EN at 1280 × 800 |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Description | Responsible |
|---|---|---|
| System Testing | End-to-end checks of the dealer quote and the Esthetic protection contract page in a real browser | QA Agent |
| Regression | Contract creation from the new page, checked against what `domain` records about Esthetic protection contracts (dealer list `/permaplate-contracts`, PDF download `/quote/{quoteId}/permaplate-contract-download`) | QA Agent |

### 3.2 Test Types

| Type | Approach |
|---|---|
| Functional | Follow each acceptance criterion step by step on a quote the case builds itself |
| UI | Check the two columns and the sections each one holds, by their headings |
| Negative | Empty an owner field before submit; leave "Financing company" on "Choose" (the AP-2459 condition); record the response (Q-008) |
| Edge-case | Open the page on a quote whose contract already exists (Q-010); change the start date if it is editable (Q-004) |
| Regression | After submit, the contract appears on "Esthetic protection contracts" and its PDF downloads |

Every expected result that rests on an open Judgement question (Q-002 – Q-010) is
*record-only*: the step records what the build shows, and fails only on an objective
fault — an error page or HTTP 5xx, a lost value, a value different from the one entered.
The case that depends on the Blocking question Q-001 ships BLOCKED.

### 3.3 Test Execution Method

All manual test cases are executed by **stlc-manual-executor** through the project's
bound `browser` provider, **playwright** (`mcp__playwright__*`, state `active` in
`qa-artifacts/qa-config/tools.md` §1). Bugs and the result comment go through the
`tracker` provider, **jira** (CLI wrapper `tools/jira-cli/jira.sh`, state `active`). The
`notify` group is `disabled`, so no notification is sent. Screenshots go under
`qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/`.

---

## 4. Entry Criteria

- [ ] AP-2506 is in QC (canonical `ready_for_qa`) — **not true at capture**: it is in QA and links no pull request, so this run is design only (Q-012).
- [ ] v2staging is reachable and the shared dealer account (from the `env` source) can log in.
- [ ] Gate A has passed — true (rule A2; Q-001 posted on AP-2506 on 2026-11-01).
- [ ] Test cases are written and reviewed (`AP2506_TestCases_*.md`, Gate B).
- [ ] Dealer 1380 is offered at least one Esthetic protection product on a quote (checked in the first case's pre-condition; if none, every case is BLOCKED, not FAIL).

## 5. Exit Criteria

- [ ] Every test case has a status other than `Not Run`.
- [ ] Every FAIL is filed, linked to an existing bug, or dismissed with a quoted reason (Gate C).
- [ ] Pass rate ≥ 90 % (registry `story_pass_threshold`) and Q-001 answered, for the story to move to Ready for release.
- [ ] `AP-2506_test-report.md` is written and the result comment is posted on AP-2506.

## 6. Suspension & Resumption Criteria

### Suspend testing when:

- v2staging or the dealer login fails twice in a row, or returns HTTP 5xx before the step under test.
- No Esthetic protection product is offered on a fresh quote, so no case can reach the page.
- Generating a contract returns an error page on two different quotes with a financing company chosen — every remaining case that submits would hit the same defect.

### Resume testing when:

- The environment answers again and a login succeeds.
- An Esthetic protection product is linked to dealer 1380 (by whoever owns that configuration).
- The submit defect is fixed and deployed.

---

## 7. Test Environment

| Component | Details |
|---|---|
| Application URL | v2staging dealer portal — base URL from the `env` source |
| Login | The shared dealer account (dealer 1380) from the `env` source; the password is read there at run time (`/.env`) and never written into an artifact |
| Browsers | Chromium through playwright, viewport 1280 × 800 |
| Test data | Vehicle 915 (static) plus quotes created per case — see §8 |
| Bug tracker | jira (`tracker`, CLI) |
| Screenshot path | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Dealer login | Shared dealer account (dealer 1380) | `env` source |
| Vehicle | Vehicle 915 — Ford Focus 2008, VIN `1FAHP35NX8W239204`, 5000 km (`test-data`) | Static — used only as the starting point of **Create quote**; the vehicle itself is not edited |
| Quote with client | Entered from `/vehicle/915/details` → **Create quote** (`/quote/new/client?fromVehicleId=915`) — never the bare `/quote` entry, which returns HTTP 500 on a quote with no vehicle (`domain`, quote-creation.md) | `[Pre-Condition]` step |
| Delivery date and price on the quote vehicle | A fixed date and price entered at `/quote/{id}/vehicle`, so the Program Summary and pre-fill can be compared with them | `[Pre-Condition]` step |
| Esthetic protection on the quote | The first product radio and its first enabled option at `/quote/{id}/permaplate` | `[Pre-Condition]` step; names and cost recorded |
| Extended warranty on the quote | Only for the BLOCKED AC 1 case (AP2506_002) | `[Pre-Condition]` step, written but not run until Q-001 is answered |
| Quote 6276 and quotes of other tickets | Shared records reserved for other tickets | **Not used** |

### 8.1 Test Data Classification

_Decided once here, and inherited by every test case._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer login | Static | None applied | Named in Execution Context, resolved from `env` |
| Vehicle 915 | Static | None applied — it exists and the cases do not change it; only quotes are created from it | Named in Execution Context, resolved from `test-data` |
| Quote and client | Dynamic | Q1 — does not exist yet; Q2 — pre-fill assertions depend on the client values | Created per case via `fromVehicleId`. About 2 minutes; left on staging (no `cleanup` source) |
| Delivery date / price on the quote vehicle | Dynamic | Q2 — the Program Summary and pre-fill are compared with them | Set per quote in a `[Pre-Condition]` step |
| Esthetic protection selection on the quote | Dynamic | Q2 — the "Selected protection products" are compared with it | Selected per quote. A quote whose contract was generated is consumed (Q3) and never reused, except by the case that tests that state (AP2506_009) |
| Generated contract and invoice | Dynamic | Q3 — consumed; created by the submit cases | Left on staging; every contract and quote id is listed in the execution log |
| Dealer 1380's Esthetic protection product link | Configuration — read only | Q5 would apply only if a case changed it; none does | Checked, never changed. None linked → cases BLOCKED |

A quote that has not been submitted may be reused by the read-only cases of the same run
(layout, Program Summary, pre-fill never change it); each case still spells out how to
build one when it is absent. A submitted quote is reused only by AP2506_009.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| AC 1 contradicts the description on which row opens the page (Q-001, Blocking) | High | High | Posted on AP-2506 at Gate A; the AC 1 case is BLOCKED; the description's statement is tested from the Esthetic protection row |
| The change may not be on v2staging — ticket in QA, no pull request linked (Q-012) | Medium | High | Design only now; execute once the ticket reaches QC. A page that still opens as a modal is then a FAIL of REQ-001, not an environment issue |
| "Current process" after submit has no baseline in `domain` (Q-009) | High | High | Judge only what `domain` records (contract listed on `/permaplate-contracts`, PDF served by `/quote/{quoteId}/permaplate-contract-download`); record the landing page, message and invoice |
| "Financing company" left on "Choose" returned HTTP 500 (AP-2459, status QA) | High | Medium | Submit cases choose the first company listed and record it; one case leaves it on "Choose" deliberately and traces any HTTP 500 to AP-2459 at Gate C |
| The Esthetic protection row and its actions menu are not mapped; some quote links are hidden (as `domain`, chubb-insurance.md §5, records for the insurance contract link) | Medium | Medium | Every case gives the address `/quote/{id}/permaplate-create-contract` as a fallback, used only when the action is not found, and records which was used (Q-011) |
| No Esthetic protection product linked to dealer 1380 (AP-2428 recorded it as unknown) | Medium | High | The first case's pre-condition records the products offered; none → every case BLOCKED with the reason |
| Each submit leaves a real contract and invoice on the shared dealer account | High | Medium | Only two cases submit (AP2506_006, AP2506_008); ids are logged |
| playwright unreachable | Low | High | Browser preflight before s4 |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-11-01 | Analysis | Requirements analysis | stlc-requirements-analyst |
| 2026-11-01 | Planning | Test plan design | stlc-test-plan-designer |
| 2026-11-01 | Design | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| When AP-2506 reaches QC | Execution | Manual test execution via playwright | stlc-manual-executor |
| When AP-2506 reaches QC | Reporting | Bug reporting + test report | stlc-bug-reporter, stlc-test-reporter |
| When AP-2506 reaches QC | Closure | Story comment and status per Gate D | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Run the STLC skills and write every artifact |
| QA Reviewer (stlc-qa-reviewer) | Approve gates A–D in place of the QA lead (`gate_mode: reviewer`) |
| Developer | Fix defects; confirm the post-submit behaviour (Q-009) and the deployment (Q-012) |
| Product Owner (Nicolas-Eric Tain) | Answer the Blocking question Q-001 and the Judgement questions Q-002 – Q-010 |

---

## 12. Sign-off Checklist

- [x] Every requirement REQ-001 – REQ-005 is in scope with its test types
- [x] Entry and exit criteria are stated
- [x] Test data is classified and its cost stated
- [x] Risks have mitigations
- [x] Providers named from the registry (jira, playwright; notify disabled)
- [ ] Reviewed by QA Lead (reviewer mode — Gate B covers the cases)
