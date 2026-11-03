# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, quote page → GAP insurance / Creditors insurance → "Generate Contract" page `/quote/{quoteId}/insurance/create-contract/gap` and `/quote/{quoteId}/insurance/create-contract` (Jira AP-2504)
**Date:** 2026-11-03
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2504-generate-contract-for-a-quotes-gap.md`
**Total requirements found:** 5

related_docs: qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/qa-docs/chubb-insurance.md, qa-artifacts/base-test/navigation-map.md

---

## Executive Summary

AP-2504 changes the screen a dealer uses to turn a **GAP insurance** quote on a vehicle
quote into a contract. GAP insurance (Guaranteed Asset Protection) covers the gap between
what the client still owes on the loan and what the vehicle is worth if it is written off;
on this product it is sold through the insurer Chubb, alongside Chubb *creditor insurance*
(insurance that pays the loan if the borrower dies, falls ill or becomes disabled). The
story asks that the "Generate Contract" action open a **dedicated page** — a full page, not
a *modal* (a pop-up window drawn over the quote page) — holding a two-column card: the
vehicle, owner, co-owner and financing information on the left, the Program Summary and
the "Generate Contract" button on the right. The address
`/quote/{quoteId}/insurance/create-contract/{type}` stays the same, and contract creation,
the invoice, the financing and the PDF must keep working exactly as before. A note extends
the same change to Creditor Insurance, whose button leads to
`/quote/{quoteId}/insurance/create-contract`.

Five requirements were extracted: the GAP action opens the dedicated page in the same tab
at the GAP address (REQ-001); the page shows the named sections in two columns, with the
co-owner section only when the quote has a co-applicant (REQ-002); vehicle, owner,
co-owner and financing values are pre-filled and the financing is read-only (REQ-003);
submitting valid values creates the contract through the existing process (REQ-004); and
the creditor-insurance action follows the same process at its own address (REQ-005).

**One question blocks part of the testing (Q-001).** The first acceptance criterion starts
from "a quote with a GAP insurance quote" but has the dealer choose "Generate Contract"
from "the Extended Warranty row actions", and then expects the GAP address. On the current
Dev build the Extended Warranty row's "Generate Contract" leads to the extended-warranty
page (`domain`, quote-creation.md, AP-2503 section), so the criterion contradicts itself
about which row is under test. The description's own sentence about "the “Generate
Contract” action for GAP product" is clear, so the dedicated page can still be tested from
the GAP row; only the criterion as written stays blocked. The same wording was raised as a
Blocking question on the sibling ticket AP-2506. Ten Judgement questions remain — among
them which lines the Program Summary shows for GAP, what "financing is read-only" covers,
how the page looks without a co-applicant, and what the dealer sees after submitting —
plus two Info questions.

Three testability risks are rated High. First, no GAP contract has ever been created on
the Dev environment (`/gap-insurance-contracts` was empty on 2026-11-02), so "the current
process" for GAP has no observed baseline. Second, contract creation calls Chubb's external
contract service, which refuses a quote older than 10 days and is outside this team's
control. Third, the setup path — adding a financing and a GAP quote through the GAP /
creditors add modal — carries three open bugs filed for AP-2499 (AP-2526, AP-2527,
AP-2528); a case whose setup trips on one of them is BLOCKED, not failed. The Chubb
creditor contract PDF also returned HTTP 500 on Dev on 2026-11-02 (quote 6480), which
matters for "PDF behaviour stay[s] unchanged".

Overall testability is rated **MEDIUM**: the page, its columns, the pre-fill and the
read-only financing are easy to observe, but the entry criterion contradicts itself, the
Program Summary content is not listed, and the post-submit behaviour for GAP has no
documented baseline.

---

## Requirements Detail

### REQ-001 — "Generate Contract" for GAP opens a dedicated page in the same tab at the GAP address

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the GAP "Generate Contract" action to open its own page instead of a modal, so that I can review the contract details on a full page. *(Inferred — the ticket has no user story.)* |
| **Priority** | High — it is the entry point to the whole change; if the action still opens a modal or the address changes, nothing else in the story is reachable as specified. |
| **Source File** | AP-2504-generate-contract-for-a-quotes-gap.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. "The “Generate Contract” action for GAP product on the dealer quote should match Esthetic Protection: open a dedicated page (no modal)" (description).
2. "The route `/quote/{quoteId}/insurance/create-contract/{type}` (`quote-insurance-create-contract`) stays the same." (description).
3. "Given a quote with a GAP insurance quote and no contract, when the dealer chooses “Generate Contract” from the Extended Warranty row actions, then `/quote/{quoteId}/insurance/create-contract/gap` opens in the same tab with no modal." (AC 1) — its *then* clause is clear; its *when* clause names the Extended Warranty row, which contradicts criterion 1 (Q-001).

**Out of Scope:**

- None stated. The internal route name `quote-insurance-create-contract` cannot be observed in the browser; only the address can.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| AC 1 names the Extended Warranty row as the starting point but expects the GAP address; the description names the GAP action. The criterion cannot be judged as written | High | Q-001 (Blocking). Test the description's statement from the GAP row; keep the AC 1 case BLOCKED until the author answers |
| "Should match Esthetic Protection" names a model page without saying on which points beyond the named sections | Low | Q-002. Judge only the named points; record visible differences from the Esthetic protection and extended-warranty contract pages |
| What the action and the address do on a quote whose GAP contract already exists is not stated (AC 1 says "and no contract") | Medium | Q-010. Record it |

---

### REQ-002 — The page shows the named sections in two columns; the co-owner section only with a co-applicant

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the vehicle, owner, co-owner and financing details on one side and the program summary and button on the other, so that I can check everything before generating the contract. *(Inferred.)* |
| **Priority** | Medium — a layout requirement; a wrong layout does not stop a contract from being created, but it is the visible point of the story. |
| **Source File** | AP-2504-generate-contract-for-a-quotes-gap.md |
| **Recommended Test Types** | UI · Functional · Edge-case |

**Acceptance Criteria:**

1. "Given the page has loaded, when the dealer inspects it, then it shows the “Vehicle identification”, “Owner information”, “Co-owner information” (if has co-applicant), “Financing information” in a left column, and “Program Summary” with a “Generate Contract” button in a right column." (AC 2)
2. "a two-column card — vehicle and owner information on the left, Program Summary and the “Generate Contract” button on the right." (description)

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The lines of the GAP Program Summary are not listed (AP-2506 lists five for Esthetic protection; this ticket lists none) | Medium | Q-003. Judge only that a "Program Summary" heading and the "Generate Contract" button are in the right column; record every line shown |
| "(if has co-applicant)" says when the co-owner section shows, but not what the page shows without a co-applicant | Medium | Q-004. Judge presence with a co-applicant; record what is shown without one |
| How a co-applicant is added to a quote is not mapped in `domain` (only a "No applicant" notice in the financing panel is recorded) | Medium | Q-012 (Info). The executor finds the control, writes it back to `quote-creation.md`; if none exists on Dev the case is BLOCKED "test data not on Dev" |
| No statement on how the two columns behave at a narrow screen width | Low | Not raised as a question — the story names no width; judge at 1280 × 800 only |

---

### REQ-003 — Vehicle, owner, co-owner and financing values are pre-filled; financing is read-only

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the form filled from the quote and the financing locked, so that I do not retype the details and cannot change the loan on the contract. *(Inferred.)* |
| **Priority** | High — a wrong VIN, client name or loan figure would put the insurance contract on the wrong vehicle, person or amount. |
| **Source File** | AP-2504-generate-contract-for-a-quotes-gap.md |
| **Recommended Test Types** | Functional · UI · Edge-case |

**Acceptance Criteria:**

1. "Given the quote has a vehicle, a client, a co-applicant or a financing, when the page renders, then vehicle and owner, co-owner and financing values are pre-filled and financing is read-only" (AC 3)

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The field list of each section is not given, so "pre-filled" can only be judged for values the test itself entered on the quote | Low | Compare each shown value with the value entered when the quote was built |
| "Financing information" is not defined — the loan terms (amount, term, rate, payment) or the financing company's name and address (as on the AP-2503 warranty page) | Medium | Q-005. Judge pre-fill and read-only on every field the section shows; record which fields they are |
| Which vehicle and owner fields the dealer may edit is not stated (only financing is said to be read-only) | Medium | Q-006. Record the editability of every vehicle and owner field; judge read-only only for financing |

---

### REQ-004 — Submitting valid values creates the GAP contract through the existing process

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want submitting the page to create the GAP contract exactly as before, so that invoices, financing and the contract PDF are not affected. *(Inferred.)* |
| **Priority** | High — contract creation produces the insurance contract the client signs and the invoice; a regression here costs money and client trust. |
| **Source File** | AP-2504-generate-contract-for-a-quotes-gap.md |
| **Recommended Test Types** | Functional · Regression · Negative |

**Acceptance Criteria:**

1. "Given valid form values, when the dealer submits, then contract is created following the current process." (AC 4)
2. "Contract creation, invoice, financing, and PDF behaviour stay unchanged." (description)

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| No GAP contract has been created on Dev before (`/gap-insurance-contracts` empty on 2026-11-02), so "the current process" for GAP has no observed baseline. The only recorded baseline is the creditor one: flash "Chubb insurance contract created successfully" and a contract number on the quote row | High | Q-008. Judge that a contract exists afterwards — a contract number on the quote's GAP row, or a row on `/gap-insurance-contracts`; record landing page, message, invoice and PDF |
| Contract creation calls Chubb's external contract service, which refuses a quote older than 10 days ("Contract date entered was at least 10 days older than the original quote date") | High | Each submitting case builds a fresh GAP quote the same day; an error from the external service is recorded with its text, and a banner before the step under test is an environment BLOCK |
| The setup (financing + GAP quote) goes through the GAP / creditors add modal, which has three open bugs: AP-2526 (financing form folded behind Edit), AP-2527 (creditors Save draws the quote page in the modal), AP-2528 (Get Quote closes the modal and reloads the page) | High | Setup may use the old financing page `/quote/{id}/financing`; a case whose setup is stopped by one of these bugs is BLOCKED naming it |
| The Chubb creditor contract PDF `/quote/{id}/chubb/insurance/contract-pdf` returned HTTP 500 on Dev (quote 6480, 2026-11-02); the GAP PDF has never been opened on Dev | Medium | Q-009. Record the PDF response; a PDF failure is compared with the creditor HTTP 500 at Gate C |
| What counts as invalid form values, and what the page does with them, is not stated | Medium | Q-007. Record the response to an emptied owner field |
| Each generated contract is a permanent record on the shared dealer account (no `cleanup` source) | Medium | Create a fresh quote per submitting case; never reuse another ticket's quote |

---

### REQ-005 — Creditor insurance follows the same process at `/quote/{quoteId}/insurance/create-contract`

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the creditor-insurance "Generate Contract" action to work like the GAP one, so that both Chubb products are contracted the same way. *(Inferred.)* |
| **Priority** | Medium — the note is short and says only "similar"; the creditor contract flow already works on Dev (contract AVP000169, AVP000170), so the main risk is a regression of the address or of creation. |
| **Source File** | AP-2504-generate-contract-for-a-quotes-gap.md |
| **Recommended Test Types** | Functional · Regression · UI |

**Acceptance Criteria:**

1. "For Creditor Insurance, the process is similar to GAP except the dealer will be redirected to `/quote/{quoteId}/insurance/create-contract` when clicking on “Generate contract”." (Note in the Acceptance Criteria field)

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "Similar to GAP" does not say whether the creditor page must show the same two columns, sections, pre-fill and read-only financing | Medium | Q-011. Judge the address, the same-tab dedicated page and contract creation; record the layout against the GAP page |
| The description gives the address with `{type}` while the note gives the creditor address without it | Low | Q-013 (Info). Use the address the note names |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — GAP action opens the dedicated page | ✓ | | ✓ | ✓ | ✓ | | | |
| REQ-002 — Two-column layout and conditional co-owner section | ✓ | | ✓ | | ✓ | | | |
| REQ-003 — Pre-fill and read-only financing | ✓ | ✓ | ✓ | | ✓ | | | |
| REQ-004 — Submit creates the GAP contract | ✓ | ✓ | | ✓ | | | | |
| REQ-005 — Creditor insurance at its own address | ✓ | | | ✓ | ✓ | | | |

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
| Q-001 | AC 1 starts from "a quote with a GAP insurance quote" but has the dealer choose "Generate Contract" from "the Extended Warranty row actions", and expects the GAP address `/quote/{quoteId}/insurance/create-contract/gap`; the description is about "the “Generate Contract” action for GAP product". Which row's action should open this page — the GAP insurance row, the Extended Warranty row, or both? | REQ-001 | Blocking | Open | — | Nicolas-Eric Tain |
| Q-002 | The description says the GAP action "should match Esthetic Protection". On which points beyond the named sections must the GAP page match the Esthetic protection contract page? | REQ-001, REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-003 | Which lines must the GAP "Program Summary" show (for example the GAP term, coverage, premium, taxes, start date), and the creditor one? | REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-004 | When the quote has no co-applicant, should the "Co-owner information" section be absent, or shown empty? | REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-005 | What does "Financing information" contain — the loan terms (amount financed, term, interest rate, payment), the financing company's name and address, or both — and does "read-only" cover every one of those fields? | REQ-003 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-006 | Which vehicle, owner and co-owner fields may the dealer edit on this page, and does an edit change the quote's client and vehicle or only the contract? | REQ-003 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-007 | What are "valid form values"? Which fields are required, and what does the page show when one is emptied before submit? | REQ-004 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-008 | What does "the current process" produce after a GAP submit — which page the dealer lands on, which message, whether an invoice is created, and where the contract number and PDF are shown? | REQ-004 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-009 | "PDF behaviour stay[s] unchanged": is the GAP contract PDF offered from the quote row (as the creditor one is, `/quote/{id}/chubb/insurance/contract-pdf`), and is the creditor PDF's HTTP 500 on Dev (2026-11-02, quote 6480) a known defect? | REQ-004 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-010 | AC 1 starts from a quote with "no contract". On a quote whose GAP contract already exists, is "Generate Contract" still offered, and what does the address show if opened directly? | REQ-001 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-011 | "For Creditor Insurance, the process is similar to GAP": must the creditor page show the same two columns, sections, pre-fill and read-only financing as the GAP page? | REQ-005 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-012 | How does a dealer add a co-applicant to a quote (the financing panel shows a "No applicant" notice on Dev)? | REQ-002, REQ-003 | Info | Open | — | Nicolas-Eric Tain |
| Q-013 | The description gives the address as `/quote/{quoteId}/insurance/create-contract/{type}`, the note gives the creditor address without `{type}`. Does `/quote/{quoteId}/insurance/create-contract/creditors` (or another type) also exist? | REQ-005 | Info | Open | — | Nicolas-Eric Tain |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-001 | AC 1 names the Extended Warranty row for the GAP action (Q-001, Blocking) | High | Open |
| REQ-004 | No GAP contract ever created on Dev — "current process" has no observed baseline (Q-008) | High | Open |
| REQ-004 | External Chubb contract service; 10-day quote-age limit | High | Open |
| REQ-004 | Setup path carries open bugs AP-2526, AP-2527, AP-2528 (GAP / creditors add modal) | High | Open |
| REQ-004 | Creditor contract PDF returned HTTP 500 on Dev; GAP PDF never opened (Q-009) | Medium | Open |
| REQ-002 | Program Summary lines not listed (Q-003); no-co-applicant display not stated (Q-004); co-applicant entry not mapped (Q-012) | Medium | Open |
| REQ-003 | "Financing information" content (Q-005) and editability of other fields (Q-006) not stated | Medium | Open |
| REQ-004 | Invalid values and their handling not stated (Q-007) | Medium | Open |
| REQ-001 | Behaviour on a quote that already has a GAP contract not stated (Q-010) | Medium | Open |
| REQ-005 | "Similar to GAP" not defined for the creditor page (Q-011) | Medium | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design — one Blocking question (Q-001) is open on REQ-001; the other requirements can proceed (Gate A rule A2)
