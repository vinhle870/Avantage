# Test Plan

**Plan ID:** TP-20261101-AP2503
**Project:** Avantage Plus v2 — Dealer portal, extended warranty "Generate Contract" page `/quote/{quoteId}/warranty/generate-contract` (Jira AP-2503)
**Version:** 2.0 — re-planned 2026-11-15 with the QA's answer to Q-001 – Q-011 (version 1.0 of 2026-11-01 treated them as open)
**Date:** 2026-11-15
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2503_requirements-analysis.md (updated 2026-11-15)

---

## 1. Test Objectives

- Verify that the extended warranty's "Generate Contract" action — the item between Edit and Delete in the ⋯ menu of the Extended warranty row (Q-011) — opens a dedicated page at `/quote/{quoteId}/warranty/generate-contract`, not a modal, and that the same address typed directly loads that page (REQ-001).
- Verify the two-column layout: "Vehicle identification", "Owner information" and "Financing information" in the left column, in that order (Q-001); "Program Summary", the "Generate Contract" button, an "Open PDF in new tab" link and one embedded preview of the extended-warranty contract draft in the right column (Q-002, Q-010) (REQ-002).
- Verify that the Program Summary shows the vehicle delivery date (AC 2 — still missing on Dev, bug AP-2530), an editable warranty start date that defaults to the delivery date (Q-004) and the warranty sale price entered with the quote's warranty, without tax, in an editable field (Q-005) (REQ-003).
- Verify that client, vehicle and financing values are pre-filled from the quote, that the VIN and the delivery date are read-only (AC 3 — editable on Dev, bug AP-2531), that Make, Model, Year and Mileage are editable (Q-003) and that the owner fields and the start date are editable (REQ-004).
- Verify that submitting valid values creates the contract through the process Dev showed on 2026-11-02 (Q-007): landing page, invoice message, contract link, PDF and contract-list row; that an emptied owner field is refused by the browser check (Q-006); that owner edits reach the contract only (Q-009); and that a quote without financing can be submitted (AC 1 / AC 4 — blocked on Dev, bug AP-2532) (REQ-005).

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
| The full wording and layout of the contract PDF and of the invoice | The story says they "stay unchanged" and gives no new rule. Q-007 makes Dev's recorded behaviour the baseline: the tests judge that the PDF opens, the start date and the edited owner values on it, and the invoice message and amount — not every line of the document |
| Program eligibility (which programs a vehicle qualifies for) | Belongs to AP-2497; this story starts from a quote that already has an extended warranty |
| Esthetic protection's own contract page | Belongs to AP-2428 / AP-2506. Q-010 accepts the recorded differences; the tests record this page's labels and styling and do not open the Esthetic protection page |
| French UI wording | Not mentioned by the story; judgements are made in EN |
| The "delivery date has passed the acceptable timeframe" banner | Seen on every Dev generate-contract page, even for today's delivery date; it does not stop a submit. It belongs to AP-2489 (closed as not a bug) and is recorded only |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Description | Responsible |
|---|---|---|
| System Testing | End-to-end checks of the dealer quote and the generate-contract page in a real browser | QA Agent |
| Regression | Contract creation from the new page, compared with the post-submit behaviour Dev showed on 2026-11-02 — now the agreed baseline (Q-007). Regression testing means re-checking behaviour that already worked, to prove the change did not break it | QA Agent |

### 3.2 Test Types

| Type | Approach |
|---|---|
| Functional | Follow each acceptance criterion step by step on a quote the case builds itself |
| UI | Check the two columns, the order of the sections in each, and the labels, by their headings |
| Negative | Empty the owner's last name before submit and judge the browser's own refusal (Q-006); empty the warranty start date before submit and record the result (Q-004, record-and-accept) |
| Edge-case | A quote with no financing (Q-008 display; AP-2532 submit); a warranty start date 30 days before the delivery date (Q-004) |
| Regression | After submit: the quote page with "Invoice #N ($amount) is created", the contract number link and PDF icon replacing the ⋯ menu, and the `/warranty` row "Pending approval" with its invoice "Payment pending" (Q-007) |

**How the answered questions turn into expected results.** Every question Q-001 – Q-011
is Answered (2026-11-15): the behaviour recorded in
`execution-log_AP-2503_2026-11-02.md` is expected, so the steps that were *record-only* in
version 1.0 are now **judged** against those values. Six points were not recorded on
2026-11-02; each gets a **record-and-accept** step — the step records what the build
shows and accepts it as expected, and it fails only on an objective fault (an error page,
HTTP 5xx, a lost value, or a value nobody entered):

| Point | Question | Case |
|---|---|---|
| Editability of Cylinders, Engine size, transmission, condition and the Diesel/Turbo/4x4/FWD boxes | Q-003 | AP2503_005 |
| An empty warranty start date on submit | Q-004 | AP2503_008 |
| An edited sale price reaching the contract or invoice | Q-005 | AP2503_009 |
| Which other owner fields are required | Q-006 | AP2503_008 |
| An edited owner name and address reaching the contract | Q-009 | AP2503_007 |
| Card styling and labels | Q-010 | AP2503_002 |

**Where the acceptance criteria win.** The answer covers the questions only. Where the
AC text states the expected result, the AC wins over the current behaviour, and the three
bugs stay open and valid. Their cases keep the failing expected result until the bug is
fixed:

| Bug | AC text | Case and step that still expect the AC |
|---|---|---|
| AP-2530 (Medium) | AC 2 — the Program Summary shows the vehicle delivery date | AP2503_003 step 3 |
| AP-2531 (Medium) | AC 3 — vehicle identifiers and delivery date are read-only | AP2503_005 steps 2 and 5 (VIN and delivery date) |
| AP-2532 (High) | AC 1 / AC 4 — a quote with a vehicle and an extended warranty; the contract is created following the current process | AP2503_007 step 3 (no-financing quote) |

AP2503_008 and AP2503_009 pick a financing company first, so that only their own input is
under test; that is a setup choice around AP-2532, not a change of the expected result.

### 3.3 Test Execution Method

All manual test cases are executed by **stlc-manual-executor** through the project's
bound `browser` provider, **playwright** (`mcp__playwright__*`, state `active` in
`qa-artifacts/qa-config/tools.md` §1). Bugs and the result comment go through the
`tracker` provider, **jira** (state `active`). The `notify` group is `disabled`, so no
notification is sent. Execution runs on the environment named by `execution_env` —
**Dev (v2dev)**. Screenshots go under
`qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/`.

---

## 4. Entry Criteria

_Entry criteria are the conditions that must hold before execution starts._

- [ ] AP-2503 is in QC (canonical `ready_for_qa`) — true on 2026-11-15 (batch plan check).
- [ ] Dev (v2dev) is reachable and the shared dealer account (dealer 1380, `env` source, Dev section) can log in — checked by the environment health check before execution.
- [ ] The requirements analysis has no Blocking + Open question — true (Gate A, rule A3, 2026-11-15).
- [ ] Test cases are re-designed with the answers and reviewed (`AP2503_TestCases_*.md`, Gate B).
- [ ] The dealer has an extended-warranty program a fresh vehicle qualifies for — on 2026-11-02 a new Toyota Corolla 2023 at 12000 km was offered 12 programs; re-checked by the first case's pre-condition (none → every case BLOCKED, not FAIL).

## 5. Exit Criteria

_Exit criteria are the conditions under which testing of this ticket is finished._

- [ ] Every test case has a status other than `Not Run`.
- [ ] Every FAIL is filed, linked to an existing bug (AP-2530, AP-2531, AP-2532 for the three known faults), or dismissed with a quoted reason (Gate C).
- [ ] Pass rate ≥ 90 % (registry `story_pass_threshold`) and no open stopping bug for the story to move to Ready for release. While AP-2530, AP-2531 and AP-2532 stay open, the story cannot reach 90 % with ten cases (at most 7 of 10 pass) and AP-2532 is High, so it stays in QC.
- [ ] `AP-2503_test-report.md` is written and the result comment is posted on AP-2503.

## 6. Suspension & Resumption Criteria

### Suspend testing when:

- Dev or the dealer login fails twice in a row, or returns HTTP 5xx before the step under test.
- No extended-warranty program can be added to a fresh quote, so no case can reach the page.
- Generating a contract returns an error page on two different quotes — every remaining case that submits would hit the same defect.

### Resume testing when:

- The environment answers again and a login succeeds.
- A program is available for a fresh vehicle.
- The submit defect is fixed and deployed.

---

## 7. Test Environment

| Component | Details |
|---|---|
| Application URL | Dev (v2dev) dealer portal — `DEALER_PORTAL_URL` of the `env` source, Dev Environment section |
| Login | The shared dealer account (dealer 1380) from the `env` source; the password is read there at run time and never written into an artifact |
| Browsers | Chromium through playwright, viewport 1280 × 800, UI language English (`?_locale=en`) |
| Test data | Created per case — see §8 |
| Bug tracker | jira (`tracker`) |
| Screenshot path | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Dealer login | Shared dealer account | `env` source, Dev section |
| Vehicle | A new inventory vehicle (`/vehicle/new/edit/PASSENGER`): VIN per case and run, Toyota Corolla 2023, 12000 km, Price 25000, Cylinders `4`, Engine size `1.8` (both required, no default on Dev) | `[Pre-Condition]` step |
| Quote with client | Entered from `/vehicle/{vehicleId}/details` → **Create quote** — never the bare `/quote` entry, which returns HTTP 500 on a quote with no vehicle (`domain`, quote-creation.md) | `[Pre-Condition]` step |
| Delivery date on the quote vehicle | The run date, typed on the quote vehicle step (Dev pre-fills the server's Montréal date, which may be a day earlier) | `[Pre-Condition]` step |
| Extended warranty from a program | First program and first term offered (on Dev 2026-11-02: "Garantie de base AP" → option 1 → 100m/20000km, cost CA$456.00), Sale price `2500` | `[Pre-Condition]` step; the program, term and cost are recorded |
| Financing on the quote | Base amount, term, rate and the first financing company (only for the pre-fill and pre-filled submit cases) | `[Pre-Condition]` step at `/quote/{id}/financing` |
| Quote 6276 and vehicle 915 | Shared records reserved for other tickets | **Not used** |
| Records from the 2026-11-02 run (vehicles 1125–1129, quotes 6557–6561, contracts APOP01-845/846/847) | Earlier evidence | **Not reused** — quotes 6558, 6559 and 6561 are consumed; every run builds its own |

### 8.1 Test Data Classification

_Decided once here, and inherited by every test case._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer login | Static | None applied | Named in Execution Context, resolved from `env` (Dev section) |
| Inventory vehicle | Dynamic | Q2 — the pre-fill and read-only checks depend on the VIN and values set at creation | Created per case in a `[Pre-Condition]` step. About 2 minutes, no third party; left on Dev (no `cleanup` source) |
| Quote and client | Dynamic | Q1 — does not exist yet; Q2 — pre-fill assertions depend on the client values | Created per case via **Create quote** on the vehicle. About 2 minutes |
| Extended warranty on the quote | Dynamic | Q2 — sale price, cost and term are compared on the page and on the invoice | Added per case. A quote whose contract was generated is consumed (Q3) and is never reused |
| Financing on the quote | Dynamic | Q2 — the financing pre-fill depends on it | Added only in AP2503_004 / _006 |
| Generated contract and invoice | Dynamic | Q3 — consumed; created by the submit cases | **Permanent** on the shared dealer account — a contract cannot be deleted. Every contract and invoice id is listed in the execution log |

A quote that has not been submitted may be reused by the cases of the same run that never
submit (AP2503_002, _003, _005, _010); the case still spells out how to build one when it
is absent. A submitted quote is never reused.

**What a full run leaves on Dev:** five vehicles, clients and quotes (quotes A and B are
reused; up to ten if a reused quote is missing), and **three or
four permanent contracts with their invoices** — AP2503_006, _007 and _009 each create
one; AP2503_008 creates one only if Dev accepts an empty start date (Q-004,
record-and-accept).

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| Each submit leaves a permanent contract and invoice on the shared dealer account (rated High in the analysis) | High | High | Only AP2503_006 – _009 submit; three to four contracts per run; every id logged; no quote reused after a submit |
| No program accepts a fresh vehicle, so no case reaches the page | Low | High | The first case's pre-condition records the programs offered; none → every case BLOCKED with the reason. Twelve programs were offered on 2026-11-02 |
| AP-2532: a quote without financing cannot be submitted — six required financing-company fields | High (open bug) | High | AP2503_007 step 3 FAILs on it and then picks the first company so steps 4–5 still run; AP2503_008 and _009 pick a company first. Gate C links the FAIL to AP-2532 |
| AP-2530 / AP-2531 still open — AP2503_003 and _005 fail on them | High (open bugs) | Medium | Expected results kept as the AC states; Gate C links the FAIL to the open bug instead of filing a duplicate |
| The six record-and-accept points have no recorded value yet | Medium | Low | Each step records the value and accepts it; it fails only on an error page, HTTP 5xx, a lost value or a value nobody entered |
| An empty start date accepted on submit creates an extra permanent contract (AP2503_008) | Medium | Low | Logged in "Leaves behind"; the case uses its own quote |
| The "delivery date has passed the acceptable timeframe" banner shows on every page | High | Low | Recorded, not judged (AP-2489) |
| In the automation run of 2026-11-02 the browser's required-field check did not stop a submit (AP2503_008 automation is fixme) | Low | Low | Manual execution judges what the browser shows; noted for the automator |
| playwright unreachable | Low | High | Browser preflight before s4 |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-11-01 | Analysis | Requirements analysis (11 open questions) | stlc-requirements-analyst |
| 2026-11-02 | Execution | First run on Dev — 7 PASS, 3 FAIL; bugs AP-2530/2531/2532 | stlc-manual-executor, stlc-bug-reporter |
| 2026-11-15 | Analysis | Re-analysis with the QA's answer — Q-001 – Q-011 Answered | stlc-requirements-analyst |
| 2026-11-15 | Planning, design | Test plan 2.0, re-designed cases and peer review | stlc-test-plan-designer, stlc-testcase-designer, stlc-testcase-reviewer |
| Next execution wave | Execution | Manual test execution on Dev via playwright | stlc-manual-executor |
| Next execution wave | Reporting | Bug linking or filing + test report | stlc-bug-reporter, stlc-test-reporter |
| Next execution wave | Closure | Story comment and status per Gate D | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Run the STLC skills and write every artifact |
| QA Reviewer (stlc-qa-reviewer) | Approve gates A–D in place of the QA lead (`gate_mode: reviewer`) |
| Developer (Ken Nguyen, assignee of AP-2530/2531/2532) | Fix the three open bugs |
| QA (Vinh Le) | Answered Q-001 – Q-011 on 2026-11-15; keeps AP-2530/2531/2532 open |
| Product Owner (Nicolas-Eric Tain) | Owner of the acceptance criteria that the open bugs rest on |

---

## 12. Sign-off Checklist

- [x] Every requirement REQ-001 – REQ-005 is in scope with its test types
- [x] Entry and exit criteria are stated
- [x] Test data is classified and its cost stated, including the permanent contracts
- [x] Risks have mitigations
- [x] Providers named from the registry (jira, playwright; notify disabled); environment Dev per `execution_env`
- [x] Every answered question is mapped to a judged or record-and-accept step (§3.2)
- [ ] Reviewed by QA Lead (reviewer mode — Gate B covers the cases)
