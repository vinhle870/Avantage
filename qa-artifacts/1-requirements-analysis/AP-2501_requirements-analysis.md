# Requirements Analysis Report

**Project:** Avantage Plus v2 — Permaplate ("Esthetic protection") invoicing
**Date:** 2026-11-01
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2501-permaplate-invoice-include-name-of-the.md`
**Total requirements found:** 4

---

## Executive Summary

AP-2501 asks that the invoice raised when a dealer creates a Permaplate contract carries the
name of the contract's term in its description. A Permaplate contract (the paint and
appearance protection product, labelled "Esthetic protection" in the English interface) is
created from a Permaplate quote, and creating it raises an invoice automatically (AP-2446).
Today that invoice's description lists the client, the vehicle, the VIN, the contract number
and the dealer; this ticket adds the term. The acceptance criteria name four places the
description must show it: the invoice details page, the invoice PDF, and the invoice list in
both the Dealer Portal and the Admin area.

Four requirements were extracted. Three of them — the term appears on the details page, on
the PDF and on the two list pages — can be tested now, because the ticket's summary and
description both say plainly that the term's name goes into the invoice description. The
fourth — that it sits directly after the contract number — cannot yet be judged: the one
acceptance criterion that states the position says "the **name of the invoice** should follow
the contract number", while the ticket's title and description say "the name of the **term**".
An invoice has no name, so the sentence contradicts the rest of the ticket, and the position
check stays BLOCKED until the reporter confirms which name is meant (Q-001, Blocking).

Overall testability is **Medium** — the change is small and its main result is visible on
screen, but the one positional rule is worded ambiguously, the exact text of a term's "name"
is never given (the reporter's screenshot suggests a bilingual label such as
`10 ans/yrs ( suite complète )`), and the Admin-area invoice list has never been mapped by QA.
If the term is missing from the invoice, a dealer or the accounting team cannot tell which
coverage length they were billed for without opening the contract, which is the whole point
of the ticket.

---

## Requirements Detail

### REQ-001 — The invoice details page shows the term name in the Permaplate invoice description

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. For traceability only: as a dealer, I want the Permaplate invoice to name the term I sold, so that I can see from the invoice itself what coverage I am being billed for. |
| **Priority** | High — this is the core of the ticket. If the term is not in the description, the story has delivered nothing. |
| **Source File** | `AP-2501-permaplate-invoice-include-name-of-the.md` (description; AC line "On the invoice details page") |
| **Recommended Test Types** | Functional · Regression · UI |

**Acceptance Criteria:**

1. Given a Permaplate quote is created, when the Permaplate contract is created and its invoice is generated, the description of that invoice includes the name of the term ("include name of the term in the description of the invoice when it is generated").
2. This is shown on the invoice details page ("On the invoice details page").

**Out of Scope:**

- Invoices for other products (warranty, Road Side Protection, creditor insurance, GAP). The ticket names only the Permaplate invoice.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket never says what text counts as "the name of the term". The only hint is the reporter's screenshot, which highlights the line `10 ans/yrs ( suite complète )` — a bilingual label. Whether the invoice must show that label exactly, a single-language version, or a shorter form like "10 ans" is not stated. | Medium | Compare the description against the label of the term chosen on the Permaplate Quote page and record the exact text; do not fail on wording or language until Q-002 is answered. |
| A sentence in the capture says invoices get the term "when it is generated". Whether invoices created before the change should also show it is not said. | Low | Test only new invoices for pass/fail; record what an older invoice shows (Q-003). |

---

### REQ-002 — The invoice PDF shows the term name in the description

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. For traceability only: as a dealer, I want the downloaded invoice PDF to carry the same term name as the screen, so that the document I file or send matches what I was billed for. |
| **Priority** | High — the PDF is the document that leaves the system and goes to the dealer's accounting; if it disagrees with the screen, the paper record is wrong. |
| **Source File** | `AP-2501-permaplate-invoice-include-name-of-the.md` (AC line "On the invoice generated PDF") |
| **Recommended Test Types** | Functional · UI |

**Acceptance Criteria:**

1. The PDF generated for the Permaplate invoice includes the name of the term in its description ("On the invoice generated PDF").

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| QA has not yet recorded how the invoice PDF is reached or what its description block looks like; earlier runs (AP-2446) only noted that a download link exists on the invoice details page. | Medium | Locate the PDF control on the invoice details page during execution, record its label and route, and write the finding back to the navigation knowledge. |
| Accented characters ("complète") may not render in a PDF if the PDF font lacks them. | Low | Record the exact rendering; a garbled character is an objective fault. |

---

### REQ-003 — The invoice list pages, in the Dealer Portal and the Admin area, show the term name in the description

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. For traceability only: as a dealer or an administrator scanning a list of invoices, I want to see each Permaplate invoice's term without opening it, so that I can find and reconcile invoices quickly. |
| **Priority** | Medium — the list is a convenience view; the details page and PDF carry the billing record, but the ticket names the list explicitly, in both portals. |
| **Source File** | `AP-2501-permaplate-invoice-include-name-of-the.md` (AC line "On the invoice list page (on dealer portal and admin area)") |
| **Recommended Test Types** | Functional · UI |

**Acceptance Criteria:**

1. The Dealer Portal invoice list page shows the term name in the Permaplate invoice's description.
2. The Admin area invoice list page shows the term name in the Permaplate invoice's description.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The Admin-area invoice list has never been mapped by QA — neither the `navigation` index nor the `domain` file `admin-portal.md` names its route or columns. | Medium | Find it from the Admin sidebar during execution, record its route and columns, and write it back to `admin-portal.md`. |
| A list cell may shorten or flatten a multi-line description, so the term may be present but cut off. The ticket does not say how the description should be laid out in a list. | Low | Pass when the term's text is present in the row; record the layout (Q-005). |

---

### REQ-004 — The term name follows the contract number in the description

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. |
| **Priority** | Medium — the position matters for readability and for matching the reporter's screenshot, but a description that contains the term in another place still tells the dealer what was billed. |
| **Source File** | `AP-2501-permaplate-invoice-include-name-of-the.md` (AC "Then the name of the invoice should follow the contract number in the description") |
| **Recommended Test Types** | Functional · UI |

**Acceptance Criteria:**

1. "Then the name of the invoice should follow the contract number in the description" — on the details page, the PDF and the list pages.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The criterion says "the name of the **invoice**", while the ticket's title and description both say "the name of the **term**". An invoice has no name field, so the sentence cannot be checked as written; reading it as "term" would be a guess, however likely. | High | Ask the reporter (Q-001). Until answered, the position check is BLOCKED and the story cannot be released. |
| "Follow" could mean the very next line, or anywhere after the contract number. | Low | Record the exact order of lines; judge "directly after" only once Q-001 is answered. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression (re-checking that something which used to work still works) checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Term name on the invoice details page | ✓ | | ✓ | ✓ | ✓ | | | |
| REQ-002 — Term name on the invoice PDF | ✓ | | | | ✓ | | | |
| REQ-003 — Term name on the dealer and admin invoice lists | ✓ | | | | ✓ | | | |
| REQ-004 — Term name follows the contract number | ✓ | | | | ✓ | | | |

**Legend:** ✓ = recommended based on requirement content

Regression for REQ-001 covers the rest of the description that AP-2446 and AP-2456 already
fixed: the contract number must still be the real one (AP-2461) and no retail price may
reappear (AP-2456 criterion 4). Edge-case for REQ-001 covers a second, different term, so a
hard-coded or wrong term is caught.

---

## Open Questions

Points the requirement leaves unsettled. **Impact** says what each one does to testing:
*Blocking* — an acceptance criterion cannot be judged until it is answered, so its test
cases stay BLOCKED and the story cannot be released; *Judgement* — the main result is
testable, and the test records what the build does on this point instead of guessing;
*Info* — no test result depends on it. Classification test: SKILL.md Step 3b.

| # | Question | Raised against | Impact | Status | Answer (quoted, with source) | Assigned to |
|---|---|---|---|---|---|---|
| Q-001 | The acceptance criterion says "the name of the **invoice** should follow the contract number in the description", but the title and description say "the name of the **term**". Does the criterion mean the term's name — and must it be the line directly after the contract number? | REQ-004 | Blocking | Open | — | Ken Nguyen (reporter) |
| Q-002 | What exact text is "the name of the term" — the full label shown on the Permaplate Quote page (the screenshot shows `10 ans/yrs ( suite complète )`), or a shorter or single-language form? Does it change with the interface language (English / French)? | REQ-001, REQ-002, REQ-003 | Judgement | Open | — | Ken Nguyen |
| Q-003 | Should invoices generated before this change also show the term, or only invoices generated from now on? | REQ-001 | Judgement | Open | — | Ken Nguyen |
| Q-004 | If an administrator later renames a term in the Permaplate catalogue, should existing invoices keep the name they were generated with? | REQ-001 | Info | Open | — | Ken Nguyen |
| Q-005 | How should the description be laid out on the list pages, where it may be shortened or put on one line — must the term be visible in full? | REQ-003 | Judgement | Open | — | Ken Nguyen |
| Q-006 | Should other products' invoices (for example warranty, which also has a term such as "20m/20000km") get the same change, or is it Permaplate only? | REQ-001 | Info | Open | — | Ken Nguyen |
| Q-007 | The Dealer Portal invoice page (`/invoice/{id}`) offers no invoice PDF — only **Print** (the browser's print of the page); the only invoice PDF control is the Admin portal's **PDF** button (`/admin/invoice/{id}/pdf`). Is the "invoice generated PDF" in the acceptance criterion that Admin PDF, or should a dealer also be able to download the invoice PDF? _(Added 2026-11-02 at s7 from the s4 observation; R2 round 2 F-1.)_ | REQ-002 | Judgement | Open | — | Ken Nguyen |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-004 | The positional criterion names "the name of the invoice", which contradicts "the name of the term" in the title and description. | High | Open |
| REQ-001 | The exact text of a term's name, and its language, is not stated. | Medium | Open |
| REQ-002 | How the invoice PDF is reached and laid out has not been recorded by QA. | Medium | Open |
| REQ-003 | The Admin-area invoice list has never been mapped. | Medium | Open |
| REQ-001 | Whether older invoices should show the term is not stated. | Low | Open |
| REQ-002 | Accented characters may not render in the PDF. | Low | Open |
| REQ-003 | A list cell may shorten the description; the required layout is not stated. | Low | Open |
| REQ-004 | "Follow" may mean the next line or anywhere after. | Low | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design — yes for REQ-001 to REQ-003; REQ-004 waits on Q-001
