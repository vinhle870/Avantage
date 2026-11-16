# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, quote page → GAP insurance / Creditors insurance → "Generate Contract" page `/quote/{quoteId}/insurance/create-contract/gap` and `/quote/{quoteId}/insurance/create-contract` (Jira AP-2504)
**Date:** 2026-11-03 · **Re-checked:** 2026-11-15 (Step 3c knowledge lookup on every Open question — see *Knowledge lookup — 2026-11-15*; no Jira change, nothing posted)
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2504-generate-contract-for-a-quotes-gap.md` (including its section *Ticket changes since capture — 2026-11-15*); observed values from `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2504_2026-11-03.md`
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

> **Update 2026-11-15 — knowledge lookup.** Jira Story and Task tickets were searched for a
> sentence that settles each open question (queries in *Knowledge lookup — 2026-11-15*).
> Three questions are now `Answered` by quoted sentences: Q-006 (which fields the dealer
> may edit, and what an edit changes — AP-2544, AP-2545, AP-2550), Q-009 (where the GAP
> contract PDF is offered — AP-2431) and Q-011 (the creditor page uses the same standard
> sections — AP-2544, AP-2545, AP-2546). Nine are `Accepted`: no Story or Task defines them,
> so the build's current actual result, as recorded on 2026-11-03, is the expected result.
> **Q-001 stays Blocking and Open.** It is a contradiction inside this ticket's own text
> (AC 1 names the Extended Warranty row but starts from a GAP quote and expects the GAP
> address; the description names the GAP action), not a gap in product knowledge. The
> lookup found no sentence that settles it — the sibling stories AP-2505 and AP-2506 carry
> the same copied wording, and AP-2506's identical question is unanswered — and the actual
> result is never used to pick one reading. AP2504_002 therefore stays BLOCKED and no test
> case becomes runnable. Q-006 and Q-011 are answered by **later** Stories on the same
> check-out page (created 2026-11-04 and 2026-11-06, status *Deploy to staging* /
> *In Progress*); see the note under the questions table. Nothing is posted to Jira.

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
| "Should match Esthetic Protection" names a model page without saying on which points beyond the named sections | Low | Q-002 — Accepted 2026-11-15: no Story/Task lists the matching points; the differences recorded on 2026-11-03 are the expected result |
| What the action and the address do on a quote whose GAP contract already exists is not stated (AC 1 says "and no contract") | Medium | Q-010 — Accepted 2026-11-15: the action is withdrawn and the address redirects to the quote with a message (wording: bug AP-2540) |

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
| The lines of the GAP Program Summary are not listed (AP-2506 lists five for Esthetic protection; this ticket lists none) | Medium | Q-003 — Accepted 2026-11-15: the GAP lines recorded on 2026-11-03 (Form, Rate table, Language, Tax exempt, coverage/premium/tax table) are the expected lines |
| "(if has co-applicant)" says when the co-owner section shows, but not what the page shows without a co-applicant | Medium | Q-004 — Accepted 2026-11-15: without a co-applicant the section is absent |
| How a co-applicant is added to a quote is not mapped in `domain` (only a "No applicant" notice in the financing panel is recorded) | Medium | Q-012 (Info) — Accepted 2026-11-15: the "Add co-applicant" link of the Financing card, opening a modal (found 2026-11-03) |
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
| "Financing information" is not defined — the loan terms (amount, term, rate, payment) or the financing company's name and address (as on the AP-2503 warranty page) | Medium | Q-005 — Accepted 2026-11-15: the nine fields recorded on 2026-11-03; read-only is set by AC 3 itself; the raw codes stay bug AP-2538 |
| Which vehicle and owner fields the dealer may edit is not stated (only financing is said to be read-only) | Medium | Q-006 — Answered 2026-11-15 by later Stories AP-2544, AP-2545, AP-2550 (vehicle read-only except the VIN; owner and co-owner editable; a successful contract updates the quote's client) |

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
| No GAP contract has been created on Dev before (`/gap-insurance-contracts` empty on 2026-11-02), so "the current process" for GAP has no observed baseline. The only recorded baseline is the creditor one: flash "Chubb insurance contract created successfully" and a contract number on the quote row | High | Q-008 — Accepted 2026-11-15 (redirect to the quote details, flash "Chubb insurance contract created successfully", contract number and PDF link on the row, no invoice). Judge that a contract exists afterwards — a contract number on the quote's GAP row, or a row on `/gap-insurance-contracts`; record landing page, message, invoice and PDF |
| Contract creation calls Chubb's external contract service, which refuses a quote older than 10 days ("Contract date entered was at least 10 days older than the original quote date") | High | Each submitting case builds a fresh GAP quote the same day; an error from the external service is recorded with its text, and a banner before the step under test is an environment BLOCK |
| The setup (financing + GAP quote) goes through the GAP / creditors add modal, which has three open bugs: AP-2526 (financing form folded behind Edit), AP-2527 (creditors Save draws the quote page in the modal), AP-2528 (Get Quote closes the modal and reloads the page) | High | Setup may use the old financing page `/quote/{id}/financing`; a case whose setup is stopped by one of these bugs is BLOCKED naming it |
| The Chubb creditor contract PDF `/quote/{id}/chubb/insurance/contract-pdf` returned HTTP 500 on Dev (quote 6480, 2026-11-02); the GAP PDF has never been opened on Dev | Medium | Q-009 — Answered 2026-11-15 by AP-2431 (the Gap insurance contracts list offers a "Download contract PDF" button); the HTTP 500 is bug AP-2539 (High, open), an objective fault |
| What counts as invalid form values, and what the page does with them, is not stated | Medium | Q-007 — Accepted 2026-11-15: the server refuses an emptied required field with "This value should not be blank." under it, and creates nothing |
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
| "Similar to GAP" does not say whether the creditor page must show the same two columns, sections, pre-fill and read-only financing | Medium | Q-011 — Answered 2026-11-15 by AP-2544, AP-2545, AP-2546 (same standard sections on every product, Creditor Insurance included); the two columns are the accepted current result |
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
| Q-001 | AC 1 starts from "a quote with a GAP insurance quote" but has the dealer choose "Generate Contract" from "the Extended Warranty row actions", and expects the GAP address `/quote/{quoteId}/insurance/create-contract/gap`; the description is about "the “Generate Contract” action for GAP product". Which row's action should open this page — the GAP insurance row, the Extended Warranty row, or both? | REQ-001 | Blocking | Open | Not product knowledge — the ticket's own text contradicts itself: AC 1's *when* clause ("from the Extended Warranty row actions") against its own *given* and *then* clauses (a GAP insurance quote, the GAP address) and against the description ("the “Generate Contract” action for GAP product"). Lookup run 2026-11-15, nothing settles it (searched: `generate contract extended warranty row`; `gap row generate contract`; `GAP generate contract` — read AP-2503, AP-2505, AP-2506: AP-2505's AC 1 also starts from "a quote with a GAP insurance quote" but names the Roadside row, and AP-2506's AC 1 names the Extended Warranty row for the Esthetic page, where the same question has been open since 2026-10-31). Asked on AP-2504 on 2026-11-02 (comment 19460) and 2026-11-08 (comment 19533), no answer. The actual result is not used to choose between the readings | Nicolas-Eric Tain |
| Q-002 | The description says the GAP action "should match Esthetic Protection". On which points beyond the named sections must the GAP page match the Esthetic protection contract page? | REQ-001, REQ-002 | Judgement | Accepted | No Story/Task defines the matching points (searched: `create contract page esthetic protection`; `program summary` — read AP-2506, which repeats the same "should match Esthetic Protection" sentence without a list, and AP-2550) — current actual result accepted (execution log 2026-11-03, AP2504_001 step 5 and AP2504_003 step 4): heading "GAP insurance" (Esthetic page: "Esthetic protection Contract"), no Financing-company picker, no embedded PDF preview, and a Program Summary holding the Chubb quote table with no start date, end date or total line | Nicolas-Eric Tain |
| Q-003 | Which lines must the GAP "Program Summary" show (for example the GAP term, coverage, premium, taxes, start date), and the creditor one? | REQ-002 | Judgement | Accepted | No Story/Task lists them (searched: `program summary`; `co-owner information` — read AP-2506, which lists five lines for Esthetic protection only, and AP-2550, which says only "For each program, all specific field for the contract are shown in the “Product summary”") — current actual result accepted (execution log 2026-11-03): GAP (AP2504_003 step 4) — Form: AVPG · Rate table: TGGAP · Language: English · Tax exempt: No · table Coverage Type Gap / Coverage BORROWER / Term Months 60 / Total Premium 3,094.00$ / Tax 463.33$ / Total Premium 3,557.33$; creditor (AP2504_010 step 4) — Form GC6201MQ, Rate table PM30, English, Tax exempt No, Life Decreasing BORROWER 60 18.58$ + 1.67$ = 20.25$, Equivalent Single Premium 891.31$, Commission (30%) 267.39$ | Nicolas-Eric Tain |
| Q-004 | When the quote has no co-applicant, should the "Co-owner information" section be absent, or shown empty? | REQ-002 | Judgement | Accepted | No Story/Task defines it (searched: `co-owner information` — read AP-2550; `co-applicant` — read AP-2399, AP-2405) — current actual result accepted: the section is **absent**; Owner information is followed directly by Financing information (execution log 2026-11-03, AP2504_003 step 3) | Nicolas-Eric Tain |
| Q-005 | What does "Financing information" contain — the loan terms (amount financed, term, interest rate, payment), the financing company's name and address, or both — and does "read-only" cover every one of those fields? | REQ-003 | Judgement | Accepted | No Story/Task lists the fields for the GAP or creditor page (searched: `financing read-only`; `payment frequency financing` — read AP-2546, AP-2499) — current actual result accepted for the **field list** (execution log 2026-11-03, AP2504_006 step 3): Financing company, Creditor address, Net amount financed including RDPRM, Payment frequency, Due type, Financing type, Loan term, Residual value, Interest rate. **Read-only** is stated by AC 3 itself ("financing is read-only"), so the AC sets it for every field; it held on 2026-11-03 (step 4). The raw codes "FREQUENCY_MONTHLY" / "TYPE_FINANCING" are not accepted: they stay bug AP-2538 (AC 3 FAIL). Context, not a field list: the later Story AP-2546 (Deploy to staging) says "the “Financing information” show a resume of the financing contract and the detailed content is collapsed." and "WHEN the dealer click on “More” THEN the content is revealed"; AP-2499 lists financing fields for the add modal, a different screen | Nicolas-Eric Tain |
| Q-006 | Which vehicle, owner and co-owner fields may the dealer edit on this page, and does an edit change the quote's client and vehicle or only the contract? | REQ-003 | Judgement | Answered | Vehicle: "the “Vehicule information” card is presented in a form view styled like the “Owner information” card. All inputs are read-only except for the VIN input." and "it generates the contract as usual and saves the vin and service date in `vehicle`." — Story **AP-2544** "Standardize the vehicule section when generating a contract" (names GAP and Creditor Insurance). Owner and co-owner: "The Owner and Co-owner information can always be updated." — Story **AP-2550** "Update the checkout ux". Effect of an owner edit: "WHEN a dealer generates a contract and is succesfull. THEN it update the quote’s client information" — Story **AP-2545** "Standardize the owner form when generating a contract" (names GAP and Creditor Insurance). Searched: `GAP generate contract`; `required owner information`; `co-owner information`. These are later Stories on the same page — see the note below the table | Nicolas-Eric Tain |
| Q-007 | What are "valid form values"? Which fields are required, and what does the page show when one is emptied before submit? | REQ-004 | Judgement | Accepted | No Story/Task defines the owner fields' validation or the message (searched: `required owner information`; `contract already created` — read AP-2544, AP-2550, AP-2559) — current actual result accepted (execution log 2026-11-03): the form has `novalidate`; the server re-renders the page with the emptied field outlined red and "This value should not be blank." under it, no redirect and no contract (AP2504_008 steps 3–4); required (*) fields — owner First name, Last name, Date of birth, Address, City, Province, Postal code, Email, Home phone, Work phone; vehicle Year, Make, Model (AP2504_005 steps 3–4); co-owner First name, Last name, Date of birth (AP2504_004 step 5). One part is defined by a later Story: "a dealer provide the VIN (required) and In service date (optional)" — AP-2544 — so the VIN is required once AP-2544 is on Dev | Nicolas-Eric Tain |
| Q-008 | What does "the current process" produce after a GAP submit — which page the dealer lands on, which message, whether an invoice is created, and where the contract number and PDF are shown? | REQ-004 | Judgement | Accepted | No Story/Task defines it (searched: `chubb contract invoice`; `gap insurance invoice`; `insurance contract created successfully` — no hit beyond AP-2504 and AP-2505, read AP-2505) — current actual result accepted (execution log 2026-11-03, AP2504_007 steps 3–5): POST → 302 → `/quote/{id}/details`, flash "Chubb insurance contract created successfully" (the same as the creditor baseline), the Gap row shows the contract number (AVPG000064) and a PDF link instead of the "⋯" menu, the contract is listed on `/gap-insurance-contracts`, and **no invoice** is created (as for the creditor contract, AP2504_011 step 5) | Nicolas-Eric Tain |
| Q-009 | "PDF behaviour stay[s] unchanged": is the GAP contract PDF offered from the quote row (as the creditor one is, `/quote/{id}/chubb/insurance/contract-pdf`), and is the creditor PDF's HTTP 500 on Dev (2026-11-02, quote 6480) a known defect? | REQ-004 | Judgement | Answered | Under "GAP (Chubb)", "The datagrid has the following columns:" including the column "Download" — "Download contract PDF button with the PDF icon" — Story **AP-2431** "Dealer portal: List autoshield contracts, list Chubb and Gap contracts" (Done). The PDF link on the quote's Gap row (`/quote/{id}/gap/insurance/contract-pdf`, AP2504_007 step 4) is not defined by a Story and is accepted as current behaviour. The HTTP 500 half is not product knowledge: it is filed as bug **AP-2539** (High, open; relates to AP-2512, AP-2519), and an HTTP 500 stays a fault. Searched: `gap contract pdf`; `gap insurance contract` — read AP-2431, AP-2437, AP-2502, AP-2536 | Nicolas-Eric Tain |
| Q-010 | AC 1 starts from a quote with "no contract". On a quote whose GAP contract already exists, is "Generate Contract" still offered, and what does the address show if opened directly? | REQ-001 | Judgement | Accepted | No Story/Task defines it (searched: `contract already created`; `gap row generate contract` — read AP-2493, which says only that "Finalized products keep their existing download action and are out of scope for cancellation here.", and AP-2536, which makes the contract number a link to a future detail page) — current actual result accepted (execution log 2026-11-03, AP2504_009 steps 2–3): the Gap row's "⋯" menu and "Generate Contract" are withdrawn; the address typed directly redirects to `/quote/{id}/details` with a red flash, and no second contract is made. The flash's wording "Creditor insurance already created" on a GAP quote is not accepted: it stays bug AP-2540 (Low, open) | Nicolas-Eric Tain |
| Q-011 | "For Creditor Insurance, the process is similar to GAP": must the creditor page show the same two columns, sections, pre-fill and read-only financing as the GAP page? | REQ-005 | Judgement | Answered | Each of the three standardisation Stories says "The change affects all quote products:" followed by the list Extended Warranty · Esthetic Protection · GAP · Creditor Insurance · Roadside Protection — **AP-2544** (Vehicle information), **AP-2545** (Owner information), **AP-2546** (Financing information); AP-2544 adds "THEN the form is prefilled with the quote’s vehicle information." So the creditor page has the same standard sections and pre-fill as the GAP page. The two-column card and the read-only financing on the creditor page are not stated by a Story and are accepted as current behaviour (execution log 2026-11-03, AP2504_010 step 4). Searched: `creditor insurance contract`; `gap insurance quote` | Nicolas-Eric Tain |
| Q-012 | How does a dealer add a co-applicant to a quote (the financing panel shows a "No applicant" notice on Dev)? | REQ-002, REQ-003 | Info | Accepted | No Story/Task defines the control (searched: `add co-applicant`; `co-applicant` — read AP-2399, which says only "The user is able to enter co-applicant address", and AP-2405) — current actual result accepted (execution log 2026-11-03, AP2504_004 step 2): the "Add co-applicant" link in the quote's Financing card opens a modal at `/quote/{id}/financing/co-applicant` (First name*, Last name*, Date of birth*, address fields, phone) | Nicolas-Eric Tain |
| Q-013 | The description gives the address as `/quote/{quoteId}/insurance/create-contract/{type}`, the note gives the creditor address without `{type}`. Does `/quote/{quoteId}/insurance/create-contract/creditors` (or another type) also exist? | REQ-005 | Info | Accepted | No Story/Task defines it (searched: `insurance create-contract` — read AP-2431, AP-2536) — current actual result accepted: recorded at execution (only `/gap` and the address without a type were opened on 2026-11-03) | Nicolas-Eric Tain |

**Later Stories used as answers (Q-006, Q-011, and the VIN part of Q-007).** AP-2544,
AP-2545 and AP-2546 (created 2026-11-04, status *Deploy to staging*) and AP-2550 (created
2026-11-06, status *In Progress*) change the same contract "check out" page and name GAP and
Creditor Insurance, so their sentences define the page's expected behaviour. They
post-date the 2026-11-03 execution, which showed every vehicle field editable (AP2504_005
step 3), and whether they are on Dev today is not known. A vehicle field still editable on
a build without AP-2544 is therefore judged under AP-2544, not as an AP-2504 failure.
AP-2504's own acceptance criteria are unchanged and win wherever they state the result.
---

## Knowledge lookup — 2026-11-15

Step 3c of the analyst skill, run on every question that was `Open`. Every query is
`issuetype in (Story, Task) AND text ~ "<words>"`, any status (the adapter's *knowledge
lookup* query). Hits are in brackets; AP-2504 itself is in most hit lists and is left out.

| Q | Queries tried (hits) | Read | Defining sentence | Result |
|---|---|---|---|---|
| Q-001 | `generate contract extended warranty row` (AP-2506, AP-2503, AP-2498, AP-2494, AP-2493, AP-2491, AP-80) · `gap row generate contract` (AP-2505, AP-2494, AP-2493) · `GAP generate contract` (AP-2559, AP-2546, AP-2545, AP-2544, AP-2505, AP-2494, AP-2493, AP-2437) | AP-2503, AP-2505, AP-2506 | None. AP-2505 and AP-2506 carry the same copied AC 1 wording, and AP-2506's identical question is unanswered. In any case the lookup cannot settle a contradiction in the ticket's own text | Open — Blocking; asked 2026-11-02 (19460) and 2026-11-08 (19533) |
| Q-002 | `create contract page esthetic protection` (AP-2506, AP-2505, AP-2503, AP-2496, AP-2493, AP-2428) · `program summary` (AP-2550, AP-2506, AP-2505, AP-2503, AP-2498, AP-2497, AP-2456, AP-2428, AP-1948, AP-214) | AP-2506, AP-2550 | None — AP-2506 repeats "should match Esthetic Protection" without a list | Accepted — actual: differences recorded 2026-11-03 |
| Q-003 | `program summary` (as Q-002) · `co-owner information` (AP-2550) | AP-2506, AP-2550 | None for GAP or creditor — AP-2506 lists Esthetic lines only; AP-2550 says only that each program's contract fields are in the "Product summary" | Accepted — actual: GAP and creditor lines recorded 2026-11-03 |
| Q-004 | `co-owner information` (AP-2550) · `co-applicant` (AP-2405, AP-2399, AP-2309, AP-2240) | AP-2550, AP-2399, AP-2405 | None | Accepted — actual: section absent |
| Q-005 | `financing read-only` (AP-2546, AP-2506, AP-2505, AP-2503, AP-2491, AP-2225) · `payment frequency financing` (AP-2499) | AP-2546, AP-2499 | None for the field list. AP-2546: a summary with the detail collapsed behind "More" (context); AP-2499: add-modal fields (another screen). Read-only comes from AC 3 itself | Accepted — actual: nine fields; read-only by AC 3; raw codes stay AP-2538 |
| Q-006 | `GAP generate contract` (as Q-001) · `required owner information` (AP-2550, AP-2544, AP-2505, AP-2503, AP-2379, AP-1960) · `co-owner information` (AP-2550) | AP-2544, AP-2545, AP-2550, AP-2559 | AP-2544 (vehicle read-only except the VIN; VIN saved to the vehicle), AP-2550 (owner and co-owner can always be updated), AP-2545 (a successful contract updates the quote's client) | Answered (later Stories, same page) |
| Q-007 | `required owner information` (as Q-006) · `contract already created` (AP-2536, AP-2455, AP-2446, AP-2443, AP-2431, AP-2428, AP-2423, AP-2372, AP-1185, AP-1166, AP-770) | AP-2544, AP-2550, AP-2559 | Only the VIN: "a dealer provide the VIN (required)" — AP-2544. AP-2559 covers vehicle-card errors only | Accepted — actual: server message "This value should not be blank."; VIN required per AP-2544 |
| Q-008 | `chubb contract invoice` (none besides AP-2504) · `gap insurance invoice` (AP-2505) · `insurance contract created successfully` (none besides AP-2504) | AP-2505 | None — AP-2505 says only that invoice behaviour stays unchanged | Accepted — actual: details page, flash, contract number + PDF link, no invoice |
| Q-009 | `gap contract pdf` (AP-2536, AP-2505, AP-2502, AP-2431, AP-2225) · `gap insurance contract` (AP-2559, AP-2546, AP-2545, AP-2544, AP-2536, AP-2505, AP-2502, AP-2494, AP-2493, AP-2437, AP-2431) | AP-2431, AP-2437, AP-2502, AP-2536 | AP-2431: the Gap insurance contracts datagrid's "Download contract PDF button with the PDF icon" | Answered; the HTTP 500 is bug AP-2539 |
| Q-010 | `contract already created` (as Q-007) · `gap row generate contract` (as Q-001) | AP-2493, AP-2536 | None — AP-2493: finalized products "keep their existing download action"; AP-2536 (PR opened): the contract number becomes a link | Accepted — actual: action withdrawn, redirect with a message; wording stays AP-2540 |
| Q-011 | `creditor insurance contract` (AP-2559, AP-2546, AP-2545, AP-2544, AP-2536, AP-2502, AP-2500, AP-2494, AP-2493, AP-2437, AP-2431) · `gap insurance quote` (AP-2559, AP-2546, AP-2545, AP-2544, AP-2536, AP-2505, AP-2502, AP-2499, AP-2494, AP-2493, AP-2437, AP-2436, AP-2431) | AP-2544, AP-2545, AP-2546 | "The change affects all quote products:" — the list includes GAP and Creditor Insurance (all three); AP-2544 pre-fill sentence | Answered (later Stories, same page) |
| Q-012 | `add co-applicant` (AP-2405) · `co-applicant` (as Q-004) | AP-2399, AP-2405 | None | Accepted — actual: "Add co-applicant" link → modal |
| Q-013 | `insurance create-contract` (AP-2536, AP-2505, AP-2494, AP-2493, AP-2471, AP-2437, AP-2431, AP-1510, AP-265) | AP-2431, AP-2536 | None | Accepted — recorded at execution |

**Effect on testing.** No test case becomes runnable: the only BLOCKED case,
AP2504_002, waits on Q-001, which stays Open. The accepted and answered questions turn
record-only steps into checked ones at the next execution. AP-2504's status and the open
bugs AP-2512, AP-2519, AP-2526, AP-2530, AP-2538, AP-2539, AP-2540 and AP-2541 are not
touched. Nothing was posted to Jira.

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-001 | AC 1 names the Extended Warranty row for the GAP action (Q-001, Blocking) | High | Open — re-checked 2026-11-15: a contradiction in the ticket's own text; lookup found nothing; AP2504_002 BLOCKED |
| REQ-004 | No GAP contract ever created on Dev — "current process" has no observed baseline (Q-008) | High | Closed 2026-11-15 — Q-008 Accepted: the 2026-11-03 submit (AVPG000064) is the baseline |
| REQ-004 | External Chubb contract service; 10-day quote-age limit | High | Open |
| REQ-004 | Setup path carries open bugs AP-2526, AP-2527, AP-2528 (GAP / creditors add modal) | High | Open |
| REQ-004 | Creditor contract PDF returned HTTP 500 on Dev; GAP PDF never opened (Q-009) | Medium | Q-009 Answered 2026-11-15 (AP-2431); the HTTP 500 stays bug AP-2539 (High, open) |
| REQ-002 | Program Summary lines not listed (Q-003); no-co-applicant display not stated (Q-004); co-applicant entry not mapped (Q-012) | Medium | Closed 2026-11-15 — Q-003, Q-004, Q-012 Accepted |
| REQ-003 | "Financing information" content (Q-005) and editability of other fields (Q-006) not stated | Medium | Closed 2026-11-15 — Q-005 Accepted (read-only by AC 3; AP-2538 open), Q-006 Answered (AP-2544, AP-2545, AP-2550) |
| REQ-004 | Invalid values and their handling not stated (Q-007) | Medium | Closed 2026-11-15 — Q-007 Accepted (VIN required per AP-2544) |
| REQ-001 | Behaviour on a quote that already has a GAP contract not stated (Q-010) | Medium | Closed 2026-11-15 — Q-010 Accepted; message wording stays bug AP-2540 |
| REQ-005 | "Similar to GAP" not defined for the creditor page (Q-011) | Medium | Closed 2026-11-15 — Q-011 Answered (AP-2544, AP-2545, AP-2546) |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design — one Blocking question (Q-001) is open on REQ-001 (re-checked 2026-11-15, still Open); the other requirements can proceed (Gate A rule A2). Since 2026-11-15 Q-002 – Q-013 are Answered or Accepted
