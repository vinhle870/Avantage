# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, quote page `/quote/{id}/details`, "Summary of products" → Gap Insurance / Creditors insurance add modal (Jira AP-2499)
**Date:** 2026-11-01
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2499-add-gap-creditors-insurance-financing-form.md`
**Total requirements found:** 6

related_docs: qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/qa-docs/chubb-insurance.md, qa-artifacts/base-test/test-centralized.md

---

## Executive Summary

AP-2499 removes a dead end in the dealer's quote. Today, when a dealer clicks the **+**
button on the *Gap Insurance* or *Creditors insurance* row of the quote's "Summary of
products" card and the quote has no financing, the modal shows only a red alert —
*"Please add a financing in order to get a GAP quote."* or *"…a creditors quote."* The
dealer must close the modal, add the financing from the quote's Financing card, and
re-open the product (the first ticket screenshot shows this on quote #6432…, a Cadillac
ATS 2022). The story puts the **financing form** — the loan or lease details the
insurance premium is calculated from — at the top of that modal, with the GAP or
creditors insurance quote form and its priced results below it. The form is prefilled
from the quote's stored financing (`QuoteFinancing`, the financing record attached to a
quote), and submitting it saves the financing and moves on to the insurance step in the
same modal.

Six requirements were extracted, one per acceptance criterion: the financing form
replaces the alert when no financing exists; the financing form is always shown first,
above the insurance form, whether or not a financing exists and for both Chubb and
Humania dealers; the form is prefilled field by field from the stored financing; a
submit saves the financing and refreshes the modal to the insurance step without leaving
the page; the insurance result renders below the form, and a failure shows an error
without losing what was typed; and missing or invalid financing fields give field-level
errors with nothing saved. Every criterion is written in Given/When/Then form with an
observable outcome, so **no question blocks testing**. Eleven Judgement questions and
four Info questions remain — mainly what counts as an "invalid" value for each field,
whether residual and date of birth are required, what "backed by the saved financing"
shows on the insurance form, how an insurance failure can be produced, and which dealer
account on staging is a Humania dealer. The tests will record what the build does on
those points instead of guessing.

Three testability risks are rated High. First, the GAP/creditors add modal opened from
"Summary of products" is not mapped in the domain knowledge — `chubb-insurance.md`
describes a separate creditor page `/quote/{id}/insurance` and `quote-creation.md`
describes the financing page `/quote/{id}/financing`, but not the modal — so the test
cases must navigate by the screenshots and the executor must map the modal on first use.
Second, *Humania* (a second insurance provider named in one criterion) appears nowhere in
the project's knowledge or test data, so the Humania half of REQ-002 may have no dealer
to run on and would be recorded BLOCKED. Third, every submit writes a real financing,
and possibly a Chubb insurance quote, onto a quote; each case must create its own quote
from its own vehicle so no other ticket's data changes.

Overall testability is rated **MEDIUM**: the main outcomes are easy to see on screen,
but the validation rules, the provider failure path and the Humania account are not
described.

---

## Requirements Detail

### REQ-001 — The financing form replaces the "Please add a financing" alert

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want to enter the financing inside the GAP or creditors insurance modal, so that a quote without financing does not stop me at an alert. (Not stated in the ticket — inferred from the description.) |
| **Priority** | High — this is the purpose of the ticket; while the alert remains, the dealer still has to leave the modal and the insurance sale is slowed or lost. |
| **Source File** | AP-2499-add-gap-creditors-insurance-financing-form.md — description and AC "Financing form replaces the alert"; screenshots image-20261016-161139.png and image-20261016-161228.png |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. AC verbatim: "Given a quote with no financing, When the dealer opens add-GAP or add-creditors insurance, Then the modal shows the financing form and not the "Please add a financing…" alert."
2. Description verbatim: "Instead, the modal should render the **financing form** at the top, followed by the GAP/creditors insurance quote form and its results."
3. Description verbatim: "This removes the current close-modal → add financing → reopen-product detour and keeps the dealer in a single flow."

**Out of Scope:**

- None stated. Extended warranty, Roadside Protection and Esthetic protection rows of the same card are not mentioned.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The add modal opened by the Gap Insurance / Creditors insurance **+** buttons is not mapped in the domain knowledge. `chubb-insurance.md` §5 describes a creditor page at `/quote/{id}/insurance` reached by URL, which may or may not be the same form. | High | Navigate by the screenshot (Summary of products → Gap Insurance **+** / Creditors insurance **+**). Record the modal's fields and write them back to the `domain` source after the first run. |
| Both products must be checked separately — the ticket names two alerts. | Medium | Design one case for GAP and one for creditors, each on a quote with no financing. |
| Whether any other entry point to GAP/creditors insurance (for example the creditor page `/quote/{id}/insurance` by URL) must also show the financing form is not stated (Q-001). | Low | Judge the modal from "Summary of products"; record what other entry points show. |

---

### REQ-002 — The financing form is always shown first, with the insurance form and results below it

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the financing always visible at the top of the insurance modal, so that I can check or correct it before pricing the insurance. (Inferred.) |
| **Priority** | High — the criterion covers every opening of the modal, for both providers; a form that disappears once a financing exists would bring back the detour for corrections. |
| **Source File** | AP-2499-add-gap-creditors-insurance-financing-form.md — AC "Financing form is always present above the insurance form" |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. AC verbatim: "Given the add-GAP/creditors modal is open (financing present or absent, Chubb or Humania dealer), Then the financing form renders first and the insurance form/results render below it, and the financing form does not disappear when a financing already exists."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| *Humania* is named as a dealer type, but no Humania dealer, configuration or feature appears in the project's knowledge or test data. The staging dealer used so far (Dealer ID 1380, see the `env` source) is known only as Chubb-configured (Q-002). | High | Design the Humania case with a precondition "a dealer account configured for Humania". If no such account is available at execution, record the case BLOCKED with the reason — never substitute the Chubb dealer. |
| The combinations are 2 products × financing present/absent × 2 providers = 8. | Medium | Cover each value at least once (pairwise): GAP and creditors each with and without financing on the Chubb dealer, plus at least one Humania case. |
| What the insurance part of the modal shows before the first quote is submitted (an empty form only, or a form plus an empty result area) is not stated (Q-003). | Low | Judge the order "financing form, then insurance form"; record what sits below it. |

---

### REQ-003 — The financing form is prefilled from the quote's existing financing

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the modal to show the financing already stored on the quote, so that I do not re-enter it. (Inferred from the description.) |
| **Priority** | High — a blank or wrong prefill would make the dealer re-type, or overwrite a correct financing with a mistake on submit. |
| **Source File** | AP-2499-add-gap-creditors-insurance-financing-form.md — description and AC "Prefill from the existing financing" |
| **Recommended Test Types** | Functional · Edge-case · Regression |

**Acceptance Criteria:**

1. AC verbatim: "Given the quote already has a `QuoteFinancing`, When the modal opens, Then each field shows the stored value — type, base amount, residual, payment frequency, term months, interest rate, financing company, applicant date of birth — and any field with no stored value falls back to its normal empty/placeholder state."
2. Description verbatim: "The financing form is prefilled from the quote's existing `QuoteFinancing` when one is present"

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| `QuoteFinancing` is a code name. The tester can only see the stored values through the dealer UI — the quote's Financing card and the financing page `/quote/{id}/financing`, whose fields (`quote-creation.md`) match the eight named in the criterion. | Medium | Create the financing through `/quote/{id}/financing` with known values, then open the modal and compare all eight fields one by one. |
| "Its normal empty/placeholder state" is not described for each field — for example what the financing company drop-down or the type drop-down shows with no value (Q-004). | Medium | Leave one optional field (such as residual) empty in the stored financing; judge that it is not filled with an invented value, and record what it shows. |
| Number formatting of the prefilled values (decimals, thousands separators, percent) is not stated. | Low | Judge the value; record the format. |

---

### REQ-004 — Submitting the financing saves it and continues to the insurance step in the modal

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want my financing saved and the insurance step ready in the same modal, so that I never leave the quote page. (Inferred from the description.) |
| **Priority** | High — this is where data is written. A financing shown as saved but not stored, or a submit that leaves the page, defeats the ticket. |
| **Source File** | AP-2499-add-gap-creditors-insurance-financing-form.md — description and AC "Submit persists and continues in the modal" |
| **Recommended Test Types** | Functional · Regression · Edge-case |

**Acceptance Criteria:**

1. AC verbatim: "Given the dealer fills or corrects the financing form, When it is submitted, Then the financing is persisted on the quote, the modal refreshes to the insurance step backed by the saved financing, and the page does not navigate away."
2. Description verbatim: "submitting it saves the financing and continues to the insurance quote in the same modal."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "Backed by the saved financing" has no observable definition — whether insurance fields such as monthly payment, term or residual are filled from the financing, or only that the insurance request uses it (Q-005). | Medium | Judge that the insurance step is shown after submit; record which insurance fields carry financing values. |
| Both "fills" (new financing) and "corrects" (existing financing) are covered. Whether correcting updates the same financing or creates a second one is not stated (Q-006). | Medium | Run both. After a correction, check the quote's Financing card shows the new values once, and record whether a second financing appears anywhere. |
| "Persisted on the quote" must be checked outside the modal. | Low | Close the modal, reload `/quote/{id}/details` and read the Financing card; re-open the modal and confirm the prefill. |
| "The page does not navigate away" must be checked objectively. | Low | Compare the page URL before and after submit and confirm the modal stays open. |

---

### REQ-005 — The insurance result renders below the form; a failure shows an error and keeps the values

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the GAP or creditors price shown in the same modal, and my entries kept if the quote fails, so that I can retry without re-typing. (Inferred.) |
| **Priority** | High — the priced result is what the dealer sells; losing the entries on a provider failure would bring the detour back. |
| **Source File** | AP-2499-add-gap-creditors-insurance-financing-form.md — description and AC "Insurance results render below the form" |
| **Recommended Test Types** | Functional · Negative · Regression |

**Acceptance Criteria:**

1. AC verbatim: "Given a saved financing, When the dealer submits the GAP/creditors insurance form and the quote is returned, Then the result renders below the form in the same modal; on failure an error is shown without discarding the entered values."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The failure path needs the insurance provider to reject the quote. The capture does not say what makes it fail (Q-007). `chubb-insurance.md` records the Chubb API rejecting some requests with a visible error banner, and bug AP-2410 records a valid creditor submission returning an error. | Medium | Try an out-of-range value the provider is likely to reject (for example a term far beyond the financing term) and record the result. If no failure can be produced, record the failure half BLOCKED with the reason — never claim it passed. |
| The fields of the GAP and creditors insurance forms inside the modal are not listed. `chubb-insurance.md` §6 lists the quick-quote fields for both, which is the closest known reference. | Medium | Use the §6 working set (form PM30, coverage types, term 60) for creditors and `gapTerm` for GAP; map the modal's real fields on first use. |
| Whether the result stays visible after the modal is closed and re-opened is not stated (Q-008). | Low | Record what the modal shows on re-open. |
| AC 1 says "a saved financing" — whether submitting the insurance form also re-submits unsaved changes in the financing form above it is not stated (Q-009). | Low | Record the behaviour when the financing form is edited but not submitted before the insurance submit. |

---

### REQ-006 — Missing or invalid financing fields give field-level errors and nothing is saved

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want a clear error on each bad financing field, so that no incomplete financing or insurance reaches the quote. (Inferred.) |
| **Priority** | High — a partial save would leave a broken financing that insurance premiums and the sale are calculated from. |
| **Source File** | AP-2499-add-gap-creditors-insurance-financing-form.md — AC "Validation" |
| **Recommended Test Types** | Negative · Edge-case · Functional |

**Acceptance Criteria:**

1. AC verbatim: "Given missing or invalid financing fields (type, base amount, payment frequency, term, interest rate, financing company), When submitted, Then field-level errors are shown and no partial financing or insurance row is persisted."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "Invalid" is not defined for any field — negative or zero amounts, non-numeric values, an interest rate above 100, decimals (Q-010). | Medium | Judge "missing" for each of the six named fields, and non-numeric / negative values for base amount and interest rate; record the build's response to boundaries. |
| Residual and applicant date of birth are in the form (REQ-003) but not in the validation list. Whether they are optional is not stated (Q-011). | Medium | Record what an empty residual and an empty date of birth do on submit. |
| "No partial financing or insurance row is persisted" needs proof outside the modal, and needs both the no-financing case and the existing-financing case (an invalid correction must leave the stored financing unchanged). | Medium | Submit invalid values on a quote with no financing → Financing card still empty after reload; submit an invalid correction on a quote with a financing → stored values unchanged after reload. |
| The error message text is not given. | Low | Judge "an error shown next to the offending field"; record the text. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Financing form replaces the alert | ✓ | | | ✓ | ✓ | | | |
| REQ-002 — Financing form always first, insurance below | ✓ | | | ✓ | ✓ | | | |
| REQ-003 — Prefill from the stored financing | ✓ | | ✓ | ✓ | | | | |
| REQ-004 — Submit saves and continues in the modal | ✓ | | ✓ | ✓ | | | | |
| REQ-005 — Insurance result below; failure keeps values | ✓ | ✓ | | ✓ | | | | |
| REQ-006 — Financing validation, nothing saved | ✓ | ✓ | ✓ | | | | | |

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
| Q-001 | Must other entry points to GAP/creditors insurance (for example the creditor page `/quote/{id}/insurance` reached by URL) also show the financing form, or only the modal opened from "Summary of products"? | REQ-001 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-002 | Which dealer account on staging is configured for Humania, so the "Humania dealer" case of the criterion can be run? | REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-003 | Before the first insurance quote is submitted, what sits below the financing form — the insurance form only, or the form plus an empty result area? | REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-004 | What is the "normal empty/placeholder state" of each financing field with no stored value — in particular the type, payment frequency and financing company drop-downs? | REQ-003 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-005 | What does "the insurance step backed by the saved financing" show — are insurance fields such as monthly payment, term or residual filled from the financing? | REQ-004 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-006 | When a dealer corrects an existing financing in the modal, is the same financing updated, or is a new one created? | REQ-004 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-007 | What makes the GAP/creditors quote fail, so the "error shown without discarding the entered values" branch can be tested on staging? | REQ-005 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-008 | After an insurance result is returned, does closing and re-opening the modal still show that result? | REQ-005 | Info | Open | — | Nicolas-Eric Tain |
| Q-009 | If the dealer edits the financing form but submits the insurance form without submitting the financing first, which financing values does the insurance quote use? | REQ-005 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-010 | What counts as "invalid" for base amount, term, interest rate and the drop-downs (zero, negative, non-numeric, decimals, upper limits)? | REQ-006 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-011 | Are residual and applicant date of birth optional? The Validation criterion does not list them. | REQ-006 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-012 | What are the exact field labels and error texts in the French UI of the modal? | REQ-001, REQ-006 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-013 | Does the creditors-insurance notice "Please make sure you create the GAP insurance first to include the GAP premium amount in the creditors insurance." change with this story? It shows on every quote today (`chubb-insurance.md` §5). | REQ-001 | Info | Open | — | Nicolas-Eric Tain |
| Q-014 | Does the existing financing page `/quote/{id}/financing` (the Financing card's "Add a financing") keep working unchanged? | REQ-004 | Info | Open | — | Nicolas-Eric Tain |
| Q-015 | What does the modal show for a dealer configured for neither Chubb nor Humania? | REQ-002 | Info | Open | — | Nicolas-Eric Tain |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-001 | The GAP/creditors add modal is not mapped in the domain knowledge; navigation relies on the ticket screenshots | High | Open |
| REQ-002 | No Humania dealer is known on staging; the Humania half of the criterion may be BLOCKED | High | Open |
| REQ-004, REQ-006 | Every submit writes a real financing (and possibly a Chubb quote) on a quote; each case needs its own quote and vehicle | High | Open |
| REQ-005 | The insurance failure path has no known trigger; it may be BLOCKED | Medium | Open |
| REQ-004 | "Backed by the saved financing" has no observable definition; update-versus-create on correction not stated | Medium | Open |
| REQ-006 | "Invalid" is not defined; residual and date of birth validation not stated | Medium | Open |
| REQ-003 | Empty/placeholder state of each field not described | Medium | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [x] Ready to proceed to Test Plan Design — no Blocking question
