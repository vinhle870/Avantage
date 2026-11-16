# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, quote page `/quote/{id}/details` (Jira AP-2496)
**Date:** 2026-11-01 · **Revised:** 2026-11-15 (Step 3b–3c knowledge lookup applied to every Open question — see *Knowledge lookup — 2026-11-15* below; reworked 2026-11-15T10:02Z after R1 round 1 REWORK F-1..F-3: Q-001 back to Open, Q-007 wording, AC field read)
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2496-download-all-finalized-documents-from-quote.md`
**Total requirements found:** 4

related_docs: qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/qa-docs/chubb-insurance.md, qa-artifacts/base-test/06-chubb-contract-setup.md

---

## Executive Summary

AP-2496 adds a single "Download all documents" action to the dealer's quote page. Today a
dealer who wants every contract of a quote has to open each product's own download link
one by one — the extended warranty, roadside protection, GAP insurance (insurance that
covers the gap between the vehicle's value and the loan balance), creditor insurance (the
Chubb loan-protection insurance), Esthetic protection (Permaplate) and so on. The new
action returns all the documents that already exist for the quote as one PDF file.

Four requirements were extracted, one per acceptance criterion: the action is shown when
the quote has at least one generated contract; it is hidden when there is nothing to
download; the download is one PDF named with the quote id and served as
`application/pdf`; and products removed before finalization, or warranty contracts marked
cancelled, never appear in the merged file while the rest still do. Every criterion is
written in Given/When/Then form and names an observable outcome, so **no question blocks
testing**. Nine Judgement questions and one Info question remain. They cover what the
ticket leaves open: what "finalized quote" means on the screen, which document types are
included, in what order, the exact file name pattern, where the action sits and how it is
labelled in French, what happens when the only contract is cancelled, and whether a dealer
can download another dealership's quote. The tests will record what the build does on
those points rather than guess.

**Update 2026-11-15.** Every question was checked against the project's other Jira
Stories and Tasks. Two are now answered by another Story (Q-010 by AP-2493, Q-006 by
AP-917), six are accepted as the build's current behaviour because no Story defines them
(Q-002, Q-003, Q-004, Q-005, Q-008, Q-009), and two stay open. Q-001 stays open because
the project uses "finalized" in two ways — a product with a generated contract (AP-2493)
and a quote-level "Finalize sale" state (AP-517, AP-2422, AP-2101) — and this ticket's
own AC 2 rules out the first meaning for a quote. Q-007 stays open because answering it
would mean choosing between two readings of this ticket's own words. None of them blocks
testing, and nothing was posted to Jira.

Two testability risks are rated High. First, the domain knowledge has no recorded way to
mark a warranty contract cancelled (`WarrantyContract::isCancelled()` is a code-level
flag), so the cancelled-contract half of the fourth criterion may not be reachable through
the user interface. Second, building a quote with several generated contracts is the most
expensive part of the test: the warranty contract flow is not mapped, and the creditor
insurance contract needs the full Chubb flow.

Overall testability is rated **MEDIUM**: the outcomes are easy to observe (a button and a
PDF), but the test data behind them is costly to prepare.

---

## Requirements Detail

### REQ-001 — "Download all documents" is shown on a quote with a generated contract

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want one "Download all documents" action on the quote page, so that I can get every contract of a quote without opening each product's link. (Not stated in the ticket — inferred from the description.) |
| **Priority** | Medium — the ticket's priority is Medium; a missing button costs the dealer time but loses no data, because the individual download links remain. |
| **Source File** | AP-2496-download-all-finalized-documents-from-quote.md — description and AC "Action shown for a quote with documents to download" |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. AC verbatim: "Given a finalized quote that has at least one generated contract that still exists, When the dealer opens the quote page, Then a single "Download all documents" action is shown."
2. Description verbatim: "The action lives on the quote page and returns the documents that already exist for that quote as one download."

**Out of Scope:**

- None stated. The admin portal and the client portal are not mentioned.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "Finalized quote" is not defined. The capture never says whether it is a quote-level state (for example a created sale) or simply a quote with a generated contract (Q-001, Open: other tickets use both meanings). | Medium | Use a quote with at least one generated contract as the precondition; record-only: note any quote-level finalized state visible on the page, and do not judge on it. |
| The exact location of the action on the page is not stated, and neither is its French label (Q-005). | Low | Judge the English label "Download all documents"; record the position and the French text. |
| "A single action" — the test must confirm there is exactly one such control, not one per product. | Low | Count the matching controls on the page. |

---

### REQ-002 — The action is hidden when the quote has nothing to download

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the download action hidden when there is nothing to download, so that I never click an action that returns an empty file. (Inferred.) |
| **Priority** | Medium — showing a dead action is confusing but not harmful. |
| **Source File** | AP-2496-download-all-finalized-documents-from-quote.md — AC "Action hidden when there is nothing to download" |
| **Recommended Test Types** | Functional · Negative · UI |

**Acceptance Criteria:**

1. AC verbatim: "Given a finalized quote with no generated contract (for example a quote whose products were removed before finalization), When the dealer opens the quote page, Then the download action is not shown."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| A "finalized quote with no generated contract" may not be creatable if finalization requires a contract (Q-001, Open). A brand-new quote with no product is the closest reachable state. | Medium | Test the hidden state on a quote with no generated contract; record-only: note whether the quote shows any quote-level finalized state, and do not judge on it. |
| The case where the quote's only contract is a cancelled warranty contract is not covered by either AC 1 or AC 2 (Q-007). | Medium | Record-only: note whether the action is shown. |

---

### REQ-003 — One concatenated PDF named with the quote id is returned

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want all documents of a quote in one PDF, so that I can print or send them in one step. (Inferred from the description.) |
| **Priority** | High — this is the purpose of the ticket; a broken or incomplete file defeats the feature and the dealer may hand a client an incomplete contract set. |
| **Source File** | AP-2496-download-all-finalized-documents-from-quote.md — description and AC "One concatenated PDF is returned" |
| **Recommended Test Types** | Functional · Regression · Edge-case |

**Acceptance Criteria:**

1. AC verbatim: "Given a finalized quote with several contracts, When the dealer triggers "Download all documents", Then a single PDF file named with the quote id is returned (content type `application/pdf`)."
2. Description verbatim: "download every finalized contract/document that belongs to a quote with a single action, instead of opening each product's individual download link."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The exact file name pattern is not given — only that it is "named with the quote id" (Q-003). | Low | Judge that the file name contains the quote id; record the full name. |
| The capture does not list which document types are included (warranty, roadside, GAP, creditor insurance, Permaplate, sales contract) (Q-002), nor their order in the merged file (Q-004). | Medium | Use each product's individual download link as the reference: every page of each individual document must appear in the merged file. Record the order. |
| Building a quote with several generated contracts is expensive; the warranty contract flow is not mapped in the domain knowledge, and creditor insurance needs the full Chubb flow (06-chubb-contract-setup.md). | High | Use the cheapest two contract types that have mapped flows (roadside "Save and Generate Contract", Permaplate) for the several-contracts case; record which types were used. |

---

### REQ-004 — Removed products and cancelled warranty contracts are excluded from the merged file

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want removed or cancelled items left out of the download, so that the client never receives a contract that no longer applies. (Inferred.) |
| **Priority** | High — including a cancelled contract in a document set handed to a client is a business and compliance error. |
| **Source File** | AP-2496-download-all-finalized-documents-from-quote.md — AC "Removed or cancelled items are never rendered" |
| **Recommended Test Types** | Functional · Negative · Edge-case |

**Acceptance Criteria:**

1. AC verbatim: "Given a quote where an optional product was removed before finalization, or a warranty contract is marked cancelled (`WarrantyContract::isCancelled()` true), When the dealer downloads all documents, Then no page from that product or contract is included, and the remaining documents are still merged."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| No recorded way exists to mark a warranty contract cancelled through the dealer or admin interface; `WarrantyContract::isCancelled()` is a code-level flag (Q-006). If no screen sets it, the cancelled half of this criterion cannot be tested through the UI. | High | Design the cancelled-contract case with its setup step stated; if no screen sets the flag at execution time, record the case BLOCKED and ask the developer how to set it. |
| How a product is "removed before finalization" is not described in this ticket (Q-010). The domain knowledge does not map a remove/cancel action on the quote page. | Medium | Use whatever remove action the quote page offers for a product that has no contract; record the action used. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Action shown with a generated contract | ✓ | | ✓ | ✓ | ✓ | | | |
| REQ-002 — Action hidden with nothing to download | ✓ | ✓ | ✓ | | ✓ | | | |
| REQ-003 — One PDF named with the quote id | ✓ | | ✓ | ✓ | | | | |
| REQ-004 — Removed / cancelled items excluded | ✓ | ✓ | ✓ | | | | | |

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
| Q-001 | What makes a quote "finalized"? Is it a quote-level state (for example a created sale), or simply a quote with at least one generated contract? Should the action appear on a quote that has a generated contract but is not otherwise "finalized"? | REQ-001, REQ-002 | Judgement | Open | Two definitions found, neither for "finalized quote" in this ticket's sense. (1) Product level — "A product can only be cancelled while it is **not finalized** — that is, while it has no generated contract." — Story AP-2493 (description; its AC also says "non-finalized product … that has no generated contract"; status QC). (2) Quote level — "a button to finalize the quote is available in the navigation component label: “Finalize sale“ When clicked the user is redirected to the finalize quote pa[ge]" — Task AP-517 (Done); "A quote is created and finalized" — Story AP-2422 (Done); "when a quote is finalized with a financing" — Story AP-2101 (Done), comment by Ken Nguyen 2024-10-28. AC 2's wording rules out applying the product definition to the quote: "a finalized quote with no generated contract" would be impossible if a finalized quote meant a quote with a generated contract. So the ticket reads two ways, and the actual result must not choose between them. Execution log 2026-11-02 (AP2496_002 step 4): the v2 quote page shows "No status badge and no 'finalized' text". Keep record-only. | Nicolas-Eric Tain (reporter) |
| Q-002 | Which document types are included in the download — extended warranty, roadside, GAP, creditor insurance (with its acceptance/waiver form), Permaplate, the sales contract, compliance documents? | REQ-003 | Judgement | Accepted | No Story/Task defines it (searched: "download all documents", "merged PDF", "documents download quote", "sales contract PDF quote") — current actual result accepted, recorded at execution (the merged download returned HTTP 500 on every quote tried on 2026-11-02, so no merged file was seen). Exception — AC 4 wins over the actual result: no page of a removed product or of a cancelled warranty contract may appear. | Nicolas-Eric Tain |
| Q-003 | What is the exact file name pattern (for example `quote-6431.pdf`)? Is the PDF served as an attachment (saved to disk) or inline (opened in the browser)? | REQ-003 | Judgement | Accepted | No Story/Task defines it (searched: "quote id file name", "contract PDF file name", "concatenated PDF") — current actual result accepted, recorded at execution (no merged file was returned on 2026-11-02; the individual PDFs of quote 6040 are served `inline; filename=contrat.pdf`). Exception — AC 3 wins over the actual result: the file name must contain the quote id and the content type must be `application/pdf`. | Nicolas-Eric Tain |
| Q-004 | In what order are the documents merged? | REQ-003 | Judgement | Accepted | No Story/Task defines it (searched: "documents order PDF", "merged PDF", "concatenated PDF") — current actual result accepted, recorded at execution (no merged file was returned on 2026-11-02). | Nicolas-Eric Tain |
| Q-005 | Where on the quote page is the action placed, and what is its label in the French interface? | REQ-001 | Judgement | Accepted | No Story/Task defines it (searched: "Télécharger tous les documents", "download all documents", "documents download quote") — current actual result accepted. Observed 2026-11-02 (execution log S-1, quote 6040): exactly one link "in the last row of the 'Summary of products' table directly under Subtotal"; French label "Télécharger tous les documents". Exception — AC 1 wins for the English label "Download all documents" and for "a single" action. | Nicolas-Eric Tain |
| Q-006 | How is a warranty contract marked cancelled (`WarrantyContract::isCancelled()` true) — is there a dealer or admin screen that does it? | REQ-004 | Judgement | Answered | "On the warranty details page, if the contract is not approved, a cancel button appears" · "When the dealer submits the form, the contract is cancelled" · "when an admin cancels the warranty, the same modal window should also appear" — Story AP-917 (Done, description). Also Story AP-708 (Done): "When admin cancels a contract, the contract # disappears in the contract PDF" · "Instead of contract #, **CANCELLED** will be displayed in that area". Neither Story names `isCancelled()`; the dealer's button needs a contract that is not approved. | Minh Lưu (developer, per the PR comment) |
| Q-007 | When the quote's only generated contract is a cancelled warranty contract, is the action shown or hidden? | REQ-002, REQ-004 | Judgement | Open | Not settled by the lookup (searched: "cancel warranty contract", "warranty cancelled", "isCancelled", "Cancelling a quote's Extended warranty", "cancel extended warranty quote"). Nearest hit: AP-2536, comment by Minh Lưu 2026-11-12 — "should a cancelled contract be excluded from “Download all documents”? [Yes to both.]" (the bracket is Minh Lưu's own proposed default). Ken Nguyen replied the same day, but his reply does not address this point explicitly (it covers the Chubb cancellation email). The point is about GAP/creditor contracts and the file's content, not the action's visibility. Stays Open because the answer turns on reading this ticket's own words: AC 1 shows the action for "at least one generated contract that still exists" and AC 2 hides it only with "no generated contract"; whether a cancelled warranty contract "still exists" is two readings of the AC, and the actual result must not choose between them (Step 3c limit). Not observed yet (AP2496_007 BLOCKED by AP-2518). | Nicolas-Eric Tain |
| Q-008 | Can a dealer download the documents of another dealership's quote by typing its URL? What should happen — an error page, a redirect, an empty file? | REQ-003 | Judgement | Accepted | No Story/Task defines it (searched: "another dealership quote", "other dealer quote access", "dealer access denied quote", "quote belongs dealer", "quote access dealer") — current actual result accepted, recorded at execution (AP2496_009 was BLOCKED on 2026-11-02). Limit: an HTTP 5xx, or another quote's documents in the response, is still a FAIL. | Minh Lưu |
| Q-009 | Is the action also shown on an archived quote? | REQ-001 | Judgement | Accepted | No Story/Task defines it (searched: "archived quote", "archived quote download"; AP-2422 "Show Roadside protection when quote is archived" read — it covers the roadside contract and its PDF only) — current actual result accepted. Observed 2026-11-02 (execution log S-1): archived quote 6040 shows exactly one "Download all documents" link. | Nicolas-Eric Tain |
| Q-010 | How is an optional product "removed before finalization" on this build — is it the product cancellation of AP-2493 or another action? | REQ-002, REQ-004 | Info | Answered | "On the quote details page, a dealer must be able to cancel an optional product by deleting its database row." · "A product can only be cancelled while it is **not finalized** — that is, while it has no generated contract." — Story AP-2493 (description; status QC). It overrides no AC point. Matches the execution log 2026-11-02 (AP2496_002 step 3): row menu "Delete" → "Yes, cancel the product". | Nicolas-Eric Tain |

### Knowledge lookup — 2026-11-15

Run by SKILL.md Step 3c on every question that was Open. Query: `issuetype in (Story, Task) AND text ~ "<words>"`, any status, AP project. Hits read (description, acceptance criteria and comments): AP-2493, AP-2494, AP-2535, AP-2536, AP-2543, AP-2503, AP-2504, AP-2505, AP-2422, AP-708, AP-917, AP-517, AP-742, AP-2436, AP-2502, AP-824, AP-2101. The acceptance-criteria field (`customfield_10150`, hidden by `--plain`) was read with `--raw` on 2026-11-15T10:02Z for every hit: AP-2493's AC repeats the product-level definition ("non-finalized product … that has no generated contract"); AP-2494, AP-2535, AP-2536, AP-2543, AP-2503, AP-2504, AP-2505, AP-2436 and AP-2502 have AC text that settles none of Q-001–Q-010; AP-517, AP-742, AP-2422, AP-2101, AP-917, AP-708 and AP-824 have the field empty. Comments on those tickets by the QA account were not used as answers. Nothing was posted to Jira.

| # | Word sets tried | Plausible hits read | Defining sentence? | Result |
|---|---|---|---|---|
| Q-001 | "finalized quote" · "download all documents" · "remove product quote" | AP-2493, AP-2494, AP-2422, AP-517, AP-742, AP-2101 | Two conflicting — AP-2493 defines a finalized *product* as one with a generated contract; AP-517 (Task, Done: "Finalize sale" → finalize quote page), AP-2422 (Done: "A quote is created and finalized") and AP-2101 (Done, Ken Nguyen comment: "when a quote is finalized with a financing") describe a quote-level finalized state. AC 2 ("a finalized quote with no generated contract") rules out applying the product definition to the quote | Open — two readings; keep record-only |
| Q-002 | "download all documents" · "merged PDF" · "documents download quote" · "sales contract PDF quote" | AP-2536, AP-2505, AP-2503, AP-2502, AP-2436 | No — AP-2536 says a cancelled GAP/creditor contract is excluded, but no Story lists the included types | Accepted |
| Q-003 | "quote id file name" · "contract PDF file name" · "concatenated PDF" | AP-2503, AP-2504, AP-2502 | No | Accepted (AC 3 exception) |
| Q-004 | "documents order PDF" · "merged PDF" · "concatenated PDF" | AP-2505 (AP-2445 title only) | No | Accepted |
| Q-005 | "Télécharger tous les documents" · "download all documents" · "documents download quote" | AP-2436 | No | Accepted (AC 1 exception) |
| Q-006 | "cancel warranty contract" · "warranty cancelled" · "isCancelled" · "reason of cancellation" | AP-917, AP-708, AP-2535, AP-2536 | Yes — AP-917 (dealer and admin cancel), AP-708 (admin cancel, PDF shows CANCELLED) | Answered (AP-917) |
| Q-007 | "cancel warranty contract" · "warranty cancelled" · "isCancelled" · "Cancelling a quote's Extended warranty" · "cancel extended warranty quote" | AP-2536, AP-2535, AP-2543, AP-917 | No sentence on the action's visibility | Open — two readings of AC 1 "still exists" |
| Q-008 | "another dealership quote" · "other dealer quote access" (0 hits) · "dealer access denied quote" (0 hits) · "quote belongs dealer" · "quote access dealer" | AP-2494, AP-824 | No | Accepted |
| Q-009 | "archived quote" · "archived quote download" | AP-2422, AP-2493, AP-2494 | No — AP-2422 covers only the roadside contract on an archived quote | Accepted |
| Q-010 | "remove product quote" · "finalized quote" · "cancel warranty contract" | AP-2493 | Yes | Answered (AP-2493) |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-004 | No known screen sets `WarrantyContract::isCancelled()`; the cancelled half may be untestable through the UI. 2026-11-15: AP-917 and AP-708 name a dealer cancel button (warranty details page, contract not approved) and an admin cancel (Q-006); still unproven on Dev until AP2496_007 runs | High | Reduced — Q-006 Answered |
| REQ-003 | Several generated contracts on one quote are expensive to build; the warranty contract flow is unmapped | High | Open |
| REQ-001 / REQ-002 | "Finalized quote" is undefined; other tickets use a product-level (AP-2493) and a quote-level (AP-517, AP-2422, AP-2101) meaning; the quote's finalized state is record-only | Medium | Open — Q-001 |
| REQ-003 | Included document types and their order are not listed | Medium | Accepted — Q-002, Q-004 (recorded at execution) |
| REQ-002 | Only-contract-cancelled case not covered | Medium | Open — Q-007 |
| REQ-004 | The "remove before finalization" action is not described | Medium | Closed — Q-010 Answered (AP-2493) |
| REQ-003 | Exact file name pattern not given | Low | Accepted — Q-003 (AC 3: quote id, application/pdf) |
| REQ-001 | Action position and French label not given | Low | Accepted — Q-005 (observed under Subtotal; "Télécharger tous les documents") |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [x] Ready to proceed to Test Plan Design
