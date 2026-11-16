# Requirements Analysis Report

**Project:** Avantage Plus v2 — Permaplate ("Esthetic protection") invoicing
**Date:** 2026-11-01 · **Re-checked:** 2026-11-15 (Step 3c knowledge lookup on every Open question — see *Knowledge lookup — 2026-11-15*; no Jira change, nothing posted) · **Corrected:** 2026-11-15T09:19Z (R1 round 1 REWORK F-1: Q-001 back to Blocking + Open; its position half split off as Q-008)
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

> **Update 2026-11-15 — knowledge lookup.** Jira Story and Task tickets were searched for a
> sentence that settles each open question (queries in *Knowledge lookup — 2026-11-15*).
> Q-007 is `Answered` by AP-2099 (the invoice PDF is the Admin invoice page's PDF button).
> Q-002 to Q-006 are `Accepted`. No question is posted to Jira.
>
> **Correction 2026-11-15T09:19Z (R1 round 1, F-1).** An earlier version of this note marked
> Q-001 `Accepted` and let the 2026-11-02 actual result choose the term's name as the
> criterion's subject. That was wrong: Q-001 is a contradiction in the ticket's own text
> (the criterion says "the name of the **invoice**", the title and description say "the
> name of the **term**"), not a gap in product knowledge, and the actual result may never
> choose between two readings of the ticket's text. Q-001 is again **Blocking + Open**, and
> REQ-004 stays BLOCKED until the reporter answers. It was already asked on 2026-11-01
> (comment 19437) and again on 2026-11-08, so it is not posted again. Its second half —
> whether "follow" means the very next line — is a format question and is now Q-008
> (Judgement, `Accepted`: the next line).

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
| The criterion says "the name of the **invoice**", while the ticket's title and description both say "the name of the **term**". An invoice has no name field, so the sentence cannot be checked as written; reading it as "term" would be a guess, however likely. | High | Ask the reporter (Q-001 — asked 2026-11-01, comment 19437, and 2026-11-08; not answered). Until answered, the position check is BLOCKED. The knowledge lookup (2026-11-15) cannot settle it, and the actual result may not choose between the two readings. _(Corrected 2026-11-15T09:19Z, R1 round 1 F-1 — an earlier 2026-11-15 version had marked this Accepted.)_ |
| "Follow" could mean the very next line, or anywhere after the contract number. | Low | Q-008 (Judgement, `Accepted`): no Story/Task defines it, so the current actual result — the very next line — is the expected position once Q-001 says which name is meant. |

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
| Q-001 | The acceptance criterion says "the name of the **invoice** should follow the contract number in the description", but the title and description say "the name of the **term**". Does the criterion mean the term's name? | REQ-004 | Blocking | Open | Not product knowledge — the AC ("the name of the invoice") contradicts the title and description ("the name of the term"); lookup run, nothing settles it (searched: `permaplate invoice description term`; `invoice description contract number`; `permaplate invoice name`; `term description invoice generated` — read AP-2428, AP-2443, AP-2446, AP-2448, AP-2456, AP-2504, AP-2505, AP-2506); asked on AP-2501 2026-11-01 (comment 19437) and 2026-11-08, no answer. The actual result is not used to choose between the two readings. _(Corrected 2026-11-15T09:19Z, R1 round 1 F-1: was `Accepted`; the position half moved to Q-008.)_ | Ken Nguyen (reporter) |
| Q-002 | What exact text is "the name of the term" — the full label shown on the Permaplate Quote page (the screenshot shows `10 ans/yrs ( suite complète )`), or a shorter or single-language form? Does it change with the interface language (English / French)? | REQ-001, REQ-002, REQ-003 | Judgement | Accepted | No Story/Task defines it (searched: `permaplate term name`; `permaplate product name label` — read AP-2425, AP-2426, AP-2429) — current actual result accepted: the term line reads exactly **"10 ans"** in the English interface (execution log 2026-11-02, AP2501_001 step 5), the same text as the term's radio label on the Permaplate Quote page. Context only, not a definition of the invoice text: AP-2429 says "The user has the option to add french/english translations for the term name". The French-interface text is recorded at execution | Ken Nguyen |
| Q-003 | Should invoices generated before this change also show the term, or only invoices generated from now on? | REQ-001 | Judgement | Accepted | No Story/Task defines it (searched: `invoice existing regenerate description` — no hits; `term description invoice generated` — AP-2505, AP-2501, neither defines it) — current actual result accepted: recorded at execution (no pre-change Permaplate invoice was read on 2026-11-02) | Ken Nguyen |
| Q-004 | If an administrator later renames a term in the Permaplate catalogue, should existing invoices keep the name they were generated with? | REQ-001 | Info | Accepted | No Story/Task defines it (searched: `permaplate product rename` — no hits; `permaplate term name` — read AP-2425, AP-2426, AP-2429, none says what happens to issued invoices) — current actual result accepted: recorded at execution (not observed; no case renames a term) | Ken Nguyen |
| Q-005 | How should the description be laid out on the list pages, where it may be shortened or put on one line — must the term be visible in full? | REQ-003 | Judgement | Accepted | No Story/Task defines it (searched: `invoice list description`; `invoices datagrid description column`; `invoice description multiline` — no hits; read AP-2446, AP-2448, AP-2456, AP-415) — current actual result accepted: on both the Dealer `/invoice` and Admin `/admin/invoices` lists the description is shown **in full, one item per line** (6 lines, not shortened) (execution log 2026-11-02, AP2501_004 step 2, AP2501_005 step 3) | Ken Nguyen |
| Q-006 | Should other products' invoices (for example warranty, which also has a term such as "20m/20000km") get the same change, or is it Permaplate only? | REQ-001 | Info | Accepted | No Story/Task defines it for this change (searched: `warranty invoice description term`; `roadside invoice description`; `invoice term months` — read AP-1280, AP-2505) — current actual result accepted: recorded at execution. Context: AP-1280's tech approach shows the warranty invoice description already carries the term as `{TermMonths}m / {TermKm}km`, so the question matters only for Road Side Protection and GAP invoices, which this ticket does not name | Ken Nguyen |
| Q-007 | The Dealer Portal invoice page (`/invoice/{id}`) offers no invoice PDF — only **Print** (the browser's print of the page); the only invoice PDF control is the Admin portal's **PDF** button (`/admin/invoice/{id}/pdf`). Is the "invoice generated PDF" in the acceptance criterion that Admin PDF, or should a dealer also be able to download the invoice PDF? _(Added 2026-11-02 at s7 from the s4 observation; R2 round 2 F-1.)_ | REQ-002 | Judgement | Answered | "Given: The admin user is logged in — When: The user Is on the invoice details page — Then: The the navigation header contains a button to download the invoice PDF … A PDF render is created and opens in a new window. The PDF should contain the same data as the print function on the invoice page" — Story **AP-2099** "Generate invoice PDF" (Done). The invoice PDF is the **Admin** invoice details page's PDF button (`/admin/invoice/{id}/pdf`); no Story defines a dealer download (searched: `invoice pdf download dealer`; `invoice pdf` — read AP-2099, AP-2148, AP-2446) | Ken Nguyen |
| Q-008 | Does "follow the contract number" mean the line directly after the contract number, or anywhere after it? _(Split from Q-001 2026-11-15T09:19Z, R1 round 1 F-1.)_ | REQ-004 | Judgement | Accepted | No Story/Task defines it (searched: `permaplate invoice description term`; `invoice description contract number`; `permaplate invoice name`; `term description invoice generated` — read as Q-001) — current actual result accepted: the line directly after the contract number (execution log 2026-11-02: on invoice 941 the line after "PNA-0000000020" is "10 ans" on the details page and both lists). This sets only the position; which name must sit there stays with Q-001 | Ken Nguyen |


---

## Knowledge lookup — 2026-11-15

Step 3c of the analyst skill, run on every question that was `Open`. Each query was
`issuetype in (Story, Task) AND text ~ "<words>"` on project AP, any status, through the
tracker CLI. Nothing was posted to Jira. The two comments added to AP-2501 since capture
(2026-11-01, 2026-11-08) are the QA's own and hold no answer; no one outside QA has commented.

| Question | Queries tried (hits) | Tickets read | Defining sentence? | Status |
|---|---|---|---|---|
| Q-001 | `permaplate invoice description term` (AP-2501, AP-2448) · `invoice description contract number` (AP-2505, AP-2501, AP-2448, AP-2446, AP-2167, AP-528) · `permaplate invoice name` (AP-2501, AP-2456, AP-2448, AP-2443, AP-2428) · `term description invoice generated` (AP-2505, AP-2501) | AP-2446, AP-2448, AP-2456, AP-2505, AP-2506; added 2026-11-15T09:19Z (R1 F-3): AP-2428, AP-2443, AP-2504 | None. AP-2446 asks only for an invoice "so that the dealers can pay"; AP-2456 removes retail prices; AP-2448 lists contracts; AP-2505 and AP-2506 change the contract page and say the invoice behaviour stays unchanged; AP-2428 (dealer Permaplate contract form), AP-2443 (dealer Permaplate contract list) and AP-2504 (GAP contract page — "invoice … behaviour stay unchanged") have no invoice-description sentence. In any case the lookup cannot settle a contradiction in the ticket's own text | Open — Blocking; already asked 2026-11-01 (comment 19437) and 2026-11-08 |
| Q-002 | `permaplate term name` (AP-2501, AP-2494, AP-2448, AP-2429, AP-2428, AP-2426, AP-2425) · `permaplate product name label` (AP-2494, AP-2456, AP-2428) | AP-2425, AP-2426, AP-2429 | None for the invoice text. AP-2425 gives the term datagrid a "Name" column; AP-2429 adds French/English translations for the term name. Neither says which text the invoice shows | Accepted — actual: "10 ans" (English UI) |
| Q-003 | `invoice existing regenerate description` (none) · `term description invoice generated` (AP-2505, AP-2501) | AP-2505 | None | Accepted — recorded at execution |
| Q-004 | `permaplate product rename` (none) · `permaplate term name` (as Q-002) | AP-2425, AP-2426, AP-2429 | None | Accepted — recorded at execution |
| Q-005 | `invoice list description` (AP-2505, AP-2501, AP-2448, AP-2446, AP-2167, AP-1680) · `invoices datagrid description column` (AP-2456, AP-2448, AP-415) · `invoice description multiline` (none) | AP-2446, AP-2448, AP-2456, AP-415 | None. AP-415 says only that the invoice "should be visible on the invoices page" | Accepted — actual: full text, one item per line, on both lists |
| Q-006 | `warranty invoice description term` (AP-2033, AP-1280) · `roadside invoice description` (AP-2505) · `invoice term months` (AP-2504, AP-2366, AP-2033, AP-1969, AP-454) | AP-1280, AP-2505 | None for this change. AP-1280 shows the warranty invoice already prints `{TermMonths}m / {TermKm}km` | Accepted — recorded at execution |
| Q-007 | `invoice pdf download dealer` (AP-2501, AP-2446, AP-2443, AP-2428, AP-1381, AP-1092) · `invoice pdf` (26 hits, including AP-2099, AP-2148, AP-2100) | AP-2099, AP-2148, AP-2446 | **Yes — AP-2099:** "The admin user is logged in … The user Is on the invoice details page … The the navigation header contains a button to download the invoice PDF … The PDF should contain the same data as the print function on the invoice page" | Answered |
| Q-008 | Same queries as Q-001 | As Q-001 | None — no ticket says where the term sits in the invoice description | Accepted — actual: the line directly after "PNA-0000000020" |

**What this changes for testing**

- **AP2501_006 stays BLOCKED on Q-001; its line-order observations stay record-only.**
  The criterion's subject ("the name of the invoice" against "the name of the term") is a
  contradiction in the ticket's own text, which only the reporter can settle. Q-008 sets
  the position (the very next line) for the day Q-001 is answered. Its PDF part also
  depends on AP-2529 (the Admin invoice PDF returns HTTP 500 on Dev). _(Corrected
  2026-11-15T09:19Z, R1 round 1 F-1 — an earlier version said Q-001 no longer blocks.)_
- **For the s7 story comment (R1 F-2):** Q-002, Q-005 and Q-007 were posted with
  screenshots on 2026-11-08 and are now settled — Q-002 and Q-005 by the knowledge lookup
  (the current actual result is accepted), Q-007 by AP-2099. The comment should say they
  need no answer, so only Q-001 is still open. No new question is posted.
- **Q-007 is answered.** The "invoice generated PDF" is the Admin invoice details page's
  PDF button. AP2501_003 already tests that control, so its expected result stands, and
  AP-2099 adds that the PDF should hold the same data as the page's Print view. Its Q-007
  BLOCKED branch is no longer needed.
- **Q-002 and Q-005:** the observed values ("10 ans"; full text, one item per line) become
  the expected values in AP2501_001 to AP2501_005.
- **Not a knowledge question — environment test data.** AP2501_002, 004 and 005 stay
  BLOCKED because dealer 1380 has only one Permaplate term ("10 ans", product 3) linked on
  Dev. The case itself could set up a second term: the Dev catalogue holds other enabled
  terms (1 "3 ans", 2 "5 ans"), and an administrator links one to a dealer under Admin →
  dealer 1380 → Esthetic protection (`/admin/dealer/1380/permaplate/link`, the AP-2447
  control). The current cases do not authorise this. `design` can add it as the case's own
  setup step and record the link it leaves behind, because it changes a dealer account
  that other tickets share.

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-004 | The positional criterion names "the name of the invoice", which contradicts "the name of the term" in the title and description. | High | Open — REQ-004 BLOCKED on Q-001 (asked 2026-11-01 and 2026-11-08; corrected 2026-11-15T09:19Z) |
| REQ-001 | The exact text of a term's name, and its language, is not stated. | Medium | Accepted 2026-11-15 (Q-002 — "10 ans") |
| REQ-002 | How the invoice PDF is reached and laid out has not been recorded by QA. | Medium | Closed 2026-11-15 (Q-007 answered by AP-2099: the Admin invoice PDF button, mapped in `billing-invoices.md`; its layout is not observable while AP-2529 is open) |
| REQ-003 | The Admin-area invoice list has never been mapped. | Medium | Closed 2026-11-02 (`/admin/invoices`, mapped in `billing-invoices.md`) |
| REQ-001 | Whether older invoices should show the term is not stated. | Low | Accepted 2026-11-15 (Q-003) |
| REQ-002 | Accented characters may not render in the PDF. | Low | Open |
| REQ-003 | A list cell may shorten the description; the required layout is not stated. | Low | Accepted 2026-11-15 (Q-005 — full text, one item per line) |
| REQ-004 | "Follow" may mean the next line or anywhere after. | Low | Accepted 2026-11-15 (Q-008 — the next line) |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [x] Ready to proceed to Test Plan Design — yes for REQ-001 to REQ-003; REQ-004 BLOCKED on Q-001 (Blocking + Open — a contradiction in the ticket's own text; already asked 2026-11-01 and 2026-11-08, not posted again). Corrected 2026-11-15T09:19Z (R1 round 1 F-1)
