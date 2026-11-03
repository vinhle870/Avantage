# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, quote page → Esthetic protection → "Generate Contract" page `/quote/{quoteId}/permaplate-create-contract` (Jira AP-2506)
**Date:** 2026-11-01
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2506-generate-contract-for-a-quotes-esthetic.md`
**Total requirements found:** 5

related_docs: qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/qa-docs/chubb-insurance.md, qa-artifacts/base-test/navigation-map.md

---

## Executive Summary

AP-2506 changes the screen a dealer uses to turn the **Esthetic protection** product on a
quote into a contract. Esthetic protection is the product the system still calls
*Permaplate* in its addresses (`domain`, quote-creation.md: "The Permaplate program is now
labelled 'Esthetic protection' in the EN UI … routes … still say `permaplate`"). The story
asks that the "Generate Contract" action open a **dedicated page** — a full page, not a
*modal* (a pop-up window drawn over the quote page) — holding a two-column card: vehicle
and owner information on the left, the Program Summary and the "Generate Contract" button
on the right. The address `/quote/{quoteId}/permaplate-create-contract` and its internal
route name `quote-permaplate-create-contract` stay the same, and contract creation, the
invoice, the financing and the PDF must keep working exactly as before.

Five requirements were extracted: the action opens the dedicated page in the same tab, at
the unchanged address (REQ-001); the page is laid out in two columns with named sections
(REQ-002); the Program Summary lists the program term, start date, end date, the selected
protection products and a total (REQ-003); the vehicle and owner values are pre-filled
from the quote (REQ-004); and submitting valid values creates the contract through the
existing process (REQ-005).

**One question blocks part of the testing (Q-001).** The description is about the
*Esthetic protection* action, but the first acceptance criterion starts from "a quote with
an extended warranty quote" and has the dealer choose "Generate Contract" from "the
Extended Warranty row actions" — while the address it then expects is the Esthetic
protection address. The two statements contradict each other about which action is under
test, so the criterion as written cannot be judged until the author says which row it
means. The description's own sentence about the Esthetic protection action is clear, so
the dedicated page itself can still be tested from the Esthetic protection row. Nine
Judgement questions remain — among them what "should match Esthetic Protection" compares
against (the description names the same product on both sides), what the "Total" is, how
the end date is worked out, and what the dealer sees after submitting — plus two Info
questions.

Two testability risks are rated High. First, the "current process" after submit has no
recorded baseline in the knowledge sources: the only evidence is in earlier tickets
(AP-2446, AP-2459), not in `domain`. Second, earlier testing found that leaving the
"Financing company" field on "Choose" makes contract generation return an HTTP 500
server error (AP-2459, still in status QA); a test that submits must name the financing
company it uses so that a failure can be traced. The ticket is also in status **QA**,
which this project does not treat as ready for testing, and no pull request is linked, so
the change may not be on the test environment yet.

Overall testability is rated **MEDIUM**: the page, its sections and the pre-fill are easy
to observe, but the entry criterion contradicts the description and the post-submit
behaviour has no documented baseline.

---

## Requirements Detail

### REQ-001 — "Generate Contract" for Esthetic protection opens a dedicated page in the same tab at the unchanged address

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the Esthetic protection "Generate Contract" action to open its own page instead of a modal, so that I can review the contract details on a full page. *(Inferred — the ticket has no user story.)* |
| **Priority** | High — it is the entry point to the whole change; if the action still opens a modal or the address changes, nothing else in the story is reachable as specified. |
| **Source File** | AP-2506-generate-contract-for-a-quotes-esthetic.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. "The “Generate Contract” action for Esthetic protection on the dealer quote should match Esthetic Protection: open a dedicated page (no modal)" (description).
2. "The route `/quote/{quoteId}/permaplate-create-contract` (`quote-permaplate-create-contract`) stays the same." (description).
3. "Given a quote with an extended warranty quote and no contract, when the dealer chooses “Generate Contract” from the Extended Warranty row actions, then `/quote/{quoteId}/permaplate-create-contract` opens in the same tab with no modal." (AC 1) — its *then* clause is clear; its *given* and *when* clauses contradict criterion 1 (Q-001).

**Out of Scope:**

- None stated. The internal route name `quote-permaplate-create-contract` cannot be observed in the browser; only the address can.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| AC 1 names the Extended Warranty row and an extended-warranty quote as the starting point, but expects the Esthetic protection address; the description names the Esthetic protection action. The criterion cannot be judged as written | High | Q-001 (Blocking). Test the description's statement from the Esthetic protection row; keep the AC 1 case BLOCKED until the author answers |
| "Should match Esthetic Protection" compares the Esthetic protection action with itself, so nothing beyond the named points can be judged | Low | Q-002. Judge only the named points; record visible differences from the extended-warranty contract page |
| The location and label of the Esthetic protection row's actions on the quote page are not mapped in `domain` | Medium | Q-011. The executor finds the action on first use, uses the address as a fallback, and writes it back to `quote-creation.md` |
| The ticket is in status QA (not QC) and has no linked pull request; the change may not be deployed | Medium | Q-012. Design only now; execute once the ticket reaches QC |

---

### REQ-002 — The page is a two-column card: vehicle and owner on the left, Program Summary and the submit button on the right

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the vehicle and owner details on one side and the program summary and button on the other, so that I can check everything before generating the contract. *(Inferred.)* |
| **Priority** | Medium — a layout requirement; a wrong layout does not stop a contract from being created, but it is the visible point of the story. |
| **Source File** | AP-2506-generate-contract-for-a-quotes-esthetic.md |
| **Recommended Test Types** | UI · Functional |

**Acceptance Criteria:**

1. "Given the page has loaded, when the dealer inspects it, then it shows the “Vehicle identification” and “Owner information” in a left column, and “Program Summary” and a submit button in a right column." (AC 2)
2. "a two-column card — vehicle and owner information on the left, Program Summary and the “Generate Contract” button on the right." (description)

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The story says "financing … behaviour stay[s] unchanged" but does not place any financing field on the new page | Medium | Q-003. Record where any financing field sits; judge only the four named elements |
| No statement on how the two columns behave at a narrow screen width | Low | Not raised as a question — the story names no width; judge at 1280 × 800 only |

---

### REQ-003 — The Program Summary lists the program term, start date, end date, selected protection products and a total

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the Program Summary to show the term, the coverage period, the products chosen and the total, so that I can confirm the contract terms. *(Inferred.)* |
| **Priority** | High — these values go onto the contract the client signs. |
| **Source File** | AP-2506-generate-contract-for-a-quotes-esthetic.md |
| **Recommended Test Types** | Functional · UI · Edge-case |

**Acceptance Criteria:**

1. "The “Program Summary” shows: Program Term · Start Date · End date · Selected protection products · Total" (AC 2).

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The start date's default value, and whether the dealer may change it, are not stated | Medium | Q-004. Record the default and whether it is editable |
| How the end date is worked out (start date plus the program term, or something else) is not stated | Medium | Q-005. Record the end date and compare it with start date and term without judging |
| Which amount "Total" is — dealer cost, retail price, with or without tax — is not stated | Medium | Q-006. Judge that an amount is shown; record what it equals |

---

### REQ-004 — The vehicle and owner values are pre-filled from the quote

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the form filled from the quote, so that I do not retype the client and vehicle details. *(Inferred.)* |
| **Priority** | High — a wrong VIN or client name would produce a contract for the wrong vehicle or person. |
| **Source File** | AP-2506-generate-contract-for-a-quotes-esthetic.md |
| **Recommended Test Types** | Functional · UI · Edge-case |

**Acceptance Criteria:**

1. "Given the quote has a vehicle and a client, when the page renders, then vehicle and owner values are pre-filled." (AC 3)

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The field list of each section is not given, so "pre-filled" can only be judged for values the test itself entered on the quote | Low | Compare each shown value with the value entered when the quote was built |
| Which fields are editable and which are read-only is not stated | Medium | Q-007. Record the editability of every field |

---

### REQ-005 — Submitting valid values creates the contract through the existing process

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want submitting the page to create the Esthetic protection contract exactly as before, so that invoices, financing and the contract PDF are not affected. *(Inferred.)* |
| **Priority** | High — contract creation produces the legal document and the invoice; a regression here costs money and client trust. |
| **Source File** | AP-2506-generate-contract-for-a-quotes-esthetic.md |
| **Recommended Test Types** | Functional · Regression · Negative |

**Acceptance Criteria:**

1. "Given valid form values, when the dealer submits, then contract is created following the current process." (AC 4)
2. "Contract creation, invoice, financing, and PDF behaviour stay unchanged." (description)

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "The current process" and the "unchanged" invoice, financing and PDF behaviour have no baseline in `domain`; the only record is in earlier tickets (AP-2446, AP-2459) | High | Q-009. Judge that a contract is created and listed on the dealer's "Esthetic protection contracts" list `/permaplate-contracts` with a working PDF download (both mapped in `domain`); record the landing page, message and invoice |
| Leaving "Financing company" on "Choose" was found to return HTTP 500 (AP-2459, status QA). A submit test that leaves it empty would fail on that known defect, not on this story | High | Submit cases name the financing company they choose; the empty-company behaviour is recorded in its own case and traced to AP-2459 |
| What counts as invalid form values, and what the page does with them, is not stated | Medium | Q-008. Record the response to an emptied owner field |
| What the action and the address do on a quote that already has a contract is not stated (AC 1 says "and no contract") | Medium | Q-010. Record it |
| Each generated contract is a permanent record on the shared dealer account (no `cleanup` source) | Medium | Create a fresh quote per submitting case from the test-data vehicle; never reuse another ticket's quote |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Dedicated page at the unchanged address | ✓ | | ✓ | ✓ | ✓ | | | |
| REQ-002 — Two-column layout | ✓ | | | | ✓ | | | |
| REQ-003 — Program Summary content | ✓ | | ✓ | | ✓ | | | |
| REQ-004 — Pre-fill of vehicle and owner | ✓ | | ✓ | | ✓ | | | |
| REQ-005 — Submit creates the contract | ✓ | ✓ | | ✓ | | | | |

**Legend:** ✓ = recommended based on requirement content

---

## Open Questions

Points the requirement leaves unsettled. **Impact** says what each one does to testing:
*Blocking* — an acceptance criterion cannot be judged until it is answered, so its test
cases stay BLOCKED and the story cannot be released; *Judgement* — the main result is
testable, and the test records what the build does on this point instead of guessing;
*Info* — no test result depends on it. Classification test: SKILL.md Step 3b.

| # | Question | Raised against | Impact | Status | Answer (quoted, with source) | Assigned to |
|---|---|---|---|---|---|---|
| Q-001 | AC 1 starts from "a quote with an extended warranty quote" and has the dealer choose "Generate Contract" from "the Extended Warranty row actions", yet expects the Esthetic protection address `/quote/{quoteId}/permaplate-create-contract`; the description is about "the “Generate Contract” action for Esthetic protection". Which row's action should open this page — the Esthetic protection row, the Extended Warranty row, or both — and must the quote carry an extended warranty? | REQ-001 | Blocking | Open | — | Nicolas-Eric Tain |
| Q-002 | The description says the Esthetic protection action "should match Esthetic Protection" — it names the same product on both sides. Which page is the model to match (for example the extended-warranty contract page of AP-2503), and on which points beyond the named sections? | REQ-001, REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-003 | The story says financing behaviour stays unchanged but places no financing field on the new page. Does the page still carry the "Financing company" choice, and in which column? | REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-004 | What is the Program Summary "Start Date" by default (the vehicle delivery date, today, something else), and may the dealer change it on this page? | REQ-003 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-005 | How is the "End date" worked out — start date plus the program term? | REQ-003 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-006 | Which amount is the "Total" — the dealer cost of the selected products, a retail price, before or after tax? | REQ-003 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-007 | Which vehicle and owner fields may the dealer edit on this page, and which are read-only? | REQ-004 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-008 | What are "valid form values"? Which fields are required, and what does the page show when one is emptied before submit? | REQ-005 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-009 | What does "the current process" produce after submit — which page the dealer lands on, which message, whether an invoice is created and where the contract PDF is offered? | REQ-005 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-010 | AC 1 starts from a quote with "no contract". On a quote whose Esthetic protection contract already exists, is "Generate Contract" still offered, and what does the address show if opened directly? | REQ-001 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-011 | Where on the quote page is the Esthetic protection row and its actions, and is the action labelled "Generate Contract"? | REQ-001 | Info | Open | — | Nicolas-Eric Tain |
| Q-012 | AP-2506 is in status QA (this project's ready-for-testing status is QC) and links no pull request. Is the change deployed to v2staging? | REQ-001 – REQ-005 | Info | Open | — | Nicolas-Eric Tain |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-001 | AC 1 contradicts the description on which row's action opens the page (Q-001, Blocking) | High | Open |
| REQ-005 | "Current process" / "unchanged" behaviour has no baseline in `domain` (Q-009) | High | Open |
| REQ-005 | Known HTTP 500 when "Financing company" is left on "Choose" (AP-2459) | High | Open |
| REQ-001 | Location of the Esthetic protection row actions not mapped (Q-011) | Medium | Open |
| REQ-001 | Ticket in status QA, no linked pull request — change may not be deployed (Q-012) | Medium | Open |
| REQ-002 | Placement of financing on the new page not stated (Q-003) | Medium | Open |
| REQ-003 | Start date default and editability, end date rule and the meaning of "Total" not stated (Q-004 – Q-006) | Medium | Open |
| REQ-004 | Editable versus read-only fields not stated (Q-007) | Medium | Open |
| REQ-005 | Invalid values and their handling not stated (Q-008); behaviour on a quote that already has a contract not stated (Q-010) | Medium | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design — one Blocking question (Q-001) is open on REQ-001; the other requirements can proceed (Gate A rule A2)
