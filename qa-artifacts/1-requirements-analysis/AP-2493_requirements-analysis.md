# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, Quote Details page (Jira AP-2493)
**Date:** 2026-11-01 · **Questions re-checked:** 2026-11-15 (knowledge lookup, Step 3c — see *Knowledge lookup — 2026-11-15* below)
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2493-cancelling-a-product-from-a-quote.md`
**Total requirements found:** 3

---

## Executive Summary

AP-2493 lets a dealer **cancel an optional product** on a quote's Details page
(`/quote/{id}/details`, the hub page of a quote in the Dealer portal). The five products in
scope are the extended warranty, Roadside Protection (AutoShield), GAP insurance, creditor
insurance and Esthetic protection (Permaplate). A product can be cancelled only while it is
*not finalized* — the ticket defines that as "while it has no generated contract". The
dealer must confirm in a modal (a pop-up dialog that blocks the page until answered).
Cancelling deletes the product's database row outright (a *hard delete* — the record is
removed, not flagged), frees the slot so a product of the same type can be added again,
and removes the product's amount from the quote's Subtotal.

Three requirements were extracted, one per acceptance criterion; the description's
statements on the hard delete, the freed slot and the Subtotal are folded into the
requirement they belong to. The one contradiction in the ticket — the description said
"delete the row" while the first version of AC 3 said the row stays — was settled by the
reporter on 2026-10-17: *"I've modified the AC3 and we're going to **hard delete** the
row."* (Q-001, Answered).

No question blocks testing: every acceptance criterion has an expected result written in
the ticket's own words. Seven Judgement questions and two Info questions were raised.
On 2026-11-15 each of them was searched for in the project's Jira Stories and Tasks (the
knowledge lookup). No Story or Task defines any of them, so all nine are now **Accepted**:
the behaviour the Dev build showed in the 2026-11-02 run is the expected result, and none
of them is posted to the ticket. One limit applies to Q-003: the ticket's own description
says the Subtotal "reflects only active products", so the Permaplate cost being left out
of the Subtotal is not accepted — that failure (AP-2516) stands. The
Judgement questions cover what the ticket does not spell out — the action's label, the
modal's wording, archived quotes, which amount the Subtotal uses, and whether the
financing section changes — and the tests will record what the build does on those points
rather than guess. Two testability risks are rated High: a database deletion cannot be
seen from the Dealer portal, so only its visible effects can be proven; and the five
products are reached through different, partly unmapped screens (GAP insurance has no
mapped quote stage), so preparing a non-finalized product of every type is the hardest
part of the test.

Overall testability is rated **MEDIUM**. All three criteria are observable on the Details
page; the cost lies in test-data setup across five product types.

---

## Requirements Detail

### REQ-001 — Cancel action offered only for a non-finalized product

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want to cancel an optional product that has not been finalized from a quote's Details page, so that I can remove a product the client no longer wants. (Not stated in the ticket — inferred from the description.) |
| **Priority** | High — it is the entry point of the whole feature; if the action is missing or offered on a finalized product, the feature is either unusable or can destroy a product that already has a contract. |
| **Source File** | AP-2493-cancelling-a-product-from-a-quote.md — AC 1 and description paragraphs 2–3 |
| **Recommended Test Types** | Functional · Negative · UI · Regression |

**Acceptance Criteria:**

1. AC 1 (verbatim): "Given a dealer on the details page of a non-archived quote with an active extended warranty, roadside, GAP, creditor, or Permaplate product that has no generated contract / When the product row is rendered / Then a cancel action is available for that product."
2. Description (verbatim): "A product can only be cancelled while it is **not finalized** — that is, while it has no generated contract. Finalized products keep their existing download action and are out of scope for cancellation here."
3. Description (verbatim): "Products in scope: extended warranty, Roadside Protection (AutoShield), GAP insurance, creditor insurance, Esthetic protection (Permaplate)."

**Out of Scope:**

- Cancelling a finalized product (one with a generated contract). Its existing download action stays.
- Products other than the five named.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The five products are reached through different quote stages, and not all are mapped. Warranty, Roadside and Permaplate have mapped routes; creditor insurance is reached by URL (`/quote/{id}/insurance`); **GAP insurance has no mapped quote stage at all**. If a product cannot be added to a quote, its cancel action cannot be tested and coverage of AC 1 is incomplete. | High | Test design maps each product's add route from the Details page itself in a `[Pre-Condition]` step. A product that cannot be added on staging is recorded BLOCKED with the reason, not skipped silently. |
| The Roadside stage's only button is "Save and Generate Contract" (domain knowledge, 2026-08-29). If saving a Roadside product always generates its contract, a *non-finalized* Roadside product may not be creatable, and only the finalized case can be shown. | Medium | Record what the Roadside row shows after save; if it is finalized at once, mark the Roadside cancel case BLOCKED and raise it in the s7 comment. |
| The criterion says "non-archived quote" but does not state what an archived quote shows (Q-004). | Low | Record-only check on an archived quote if one is reachable. |
| The label of the action is not specified; a developer comment assumes "Delete" from the mockup (Q-002). | Low | The test checks that an action that cancels the product exists; the label is recorded. |

---

### REQ-002 — Cancellation is confirmed in a modal before it is applied

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want to confirm before a product is cancelled, so that a mis-click does not delete a product. (Not stated in the ticket — inferred from the description.) |
| **Priority** | High — the deletion is permanent (hard delete), so the confirmation is the only protection against losing a product by accident. |
| **Source File** | AP-2493-cancelling-a-product-from-a-quote.md — AC 2 and description sentence 2 |
| **Recommended Test Types** | Functional · Negative · UI |

**Acceptance Criteria:**

1. AC 2 (verbatim): "Given an active, non-finalized product on the details page / When the dealer chooses the cancel action / Then a confirmation modal is displayed and no cancellation has occurred yet, and the product is only cancelled after the dealer confirms in that modal."
2. AC 2 (verbatim): "And given the dealer dismisses or declines the confirmation / Then the modal closes and the product is still active and unchanged."
3. Description (verbatim): "Cancelling asks the dealer to confirm in a modal first."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The modal's text and button labels are not specified (Q-005), so a test cannot judge the wording. | Low | Record the modal title, text and buttons; judge only that it appears and that confirm and decline behave as stated. |
| "Dismisses or declines" covers more than one way out (a decline button, a close icon, the Escape key, a click outside). The ticket does not list which exist. | Medium | Test the decline button and every other dismiss control the modal shows; record which ones exist. |
| "Still active and unchanged" needs a before/after comparison of the product row. | Low | Capture the row's values (name, amount) before opening the modal and compare after. |

---

### REQ-003 — A confirmed cancellation deletes the product, frees its slot and updates the Subtotal

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want a cancelled product to leave the quote completely, so that I can add a different product of the same type and the Subtotal shows only what the client is buying. (Not stated in the ticket — inferred from the description.) |
| **Priority** | High — a wrong Subtotal misquotes the client, and a slot that stays taken blocks the dealer from re-quoting. |
| **Source File** | AP-2493-cancelling-a-product-from-a-quote.md — AC 3, description sentences 1, 3 and 4, and the reporter's comment of 2026-10-17 |
| **Recommended Test Types** | Functional · Edge-case · Regression · UI |

**Acceptance Criteria:**

1. AC 3 (verbatim): "Given a product that was cancelled and no active product of that type / When the details page is rendered / Then the add (+) action is available again, and adding a product creates a new row."
2. Description (verbatim): "On the quote details page, a dealer must be able to cancel an optional product by deleting its database row."
3. Description (verbatim): "The cancelled product frees the slot so the dealer can add a new product of the same type."
4. Description (verbatim): "Cancelling a product also removes its amount from the quote Subtotal, so the Subtotal reflects only active products."
5. Comment by Nicolas-Eric Tain, 2026-10-17 (verbatim): "I've modified the AC3 and we're going to **hard delete** the row."

**Out of Scope:**

- Persisting cancelled products or contracts — Ken Nguyen, 2026-10-15: "please modify ACs to remove the need to persist cancelled contracts".

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The deletion of the database row cannot be observed from the Dealer portal. QA has no database access. | High | Prove the visible effects instead: the product row is gone after a page reload, the add (+) action is back, and a newly added product shows the new values, not the cancelled ones. State in the report that the row deletion itself was not verified. |
| The Subtotal is not described in the domain knowledge; where it appears and which product amount feeds it are unknown (Q-003). | Medium | Record the Subtotal and each product amount before cancelling; the check is Subtotal after = Subtotal before − the cancelled product's amount. If the row shows more than one amount, record all and treat the choice as record-only. |
| The ticket does not say whether the financing section (monthly payment) is recalculated (Q-006). A developer comment assumes it is not. | Medium | Record the financing values before and after; no PASS/FAIL hangs on them. |
| The ticket does not say whether cancelling a GAP product changes the creditor insurance premium (domain knowledge: the creditor row tells the dealer to create GAP first "to include the GAP premium amount"). | Medium | Record-only (Q-007). |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Cancel action only for non-finalized products | ✓ | ✓ | | ✓ | ✓ | | | |
| REQ-002 — Confirmation modal | ✓ | ✓ | | | ✓ | | | |
| REQ-003 — Delete, freed slot, Subtotal | ✓ | | ✓ | ✓ | ✓ | | | |

**Legend:** ✓ = recommended based on requirement content

Regression for REQ-001 means a finalized product still shows its download action and no
cancel action. Regression for REQ-003 means the other products on the same quote are
untouched by the cancellation.

---

## Open Questions

Points the requirement leaves unsettled. **Impact** says what each one does to testing:
*Blocking* — an acceptance criterion cannot be judged until it is answered, so its test
cases stay BLOCKED and the story cannot be released; *Judgement* — the main result is
testable, and the test records what the build does on this point instead of guessing;
*Info* — no test result depends on it. Classification test: SKILL.md Step 3b.

| # | Question | Raised against | Impact | Status | Answer (quoted, with source) | Assigned to |
|---|---|---|---|---|---|---|
| Q-001 | The description says cancelling deletes the row, but the first version of AC 3 said the cancelled row remains in the database. Which applies? | REQ-003 | Blocking | Answered | "I've modified the AC3 and we're going to **hard delete** the row." — ticket comment by Nicolas-Eric Tain, 2026-10-17 | Nicolas-Eric Tain (reporter) |
| Q-002 | What is the cancel action called and where is it — a "Delete" item in a row dropdown, as a developer comment assumes from the mockup, or something else? | REQ-001 | Judgement | Accepted | No Story/Task defines it (searched: `delete product quote details`, `cancel product dropdown delete`, `summary of products dropdown`; read AP-2225, AP-2428, AP-2535, AP-2536, AP-2543 — the last three define the **Cancel** button of a *generated contract*, a different function) — current actual result accepted: a red "Delete" item in each product row's "⋯" menu, under Edit and Generate Contract, route `/quote/{id}/cancel-product/{warranty\|roadside\|permaplate\|creditors\|gap}` (execution log 2026-11-02, AP2493_001–005). Matches Minh Lưu's stated assumption of 2026-10-17 | Nicolas-Eric Tain |
| Q-003 | Which amount of a product makes up the Subtotal (for example the sale price or the cost), and where on the Details page is the Subtotal shown? | REQ-003 | Judgement | Accepted | No Story/Task defines it (searched: `quote subtotal`, `subtotal products quote details`, `Permaplate retail price`, `summary of products`; read AP-2428, AP-2456, AP-2427, AP-2496, AP-2537, AP-1948, AP-98 — none states which product amount feeds the quote details Subtotal; AP-2456 only removes the *retail* price from the Permaplate section) — current actual result accepted: the Subtotal sits at the bottom of the "Summary of products" card and uses the row amount (warranty sale price 1,500, not the cost 1,000; Roadside policy sale price; GAP premium 3,094 before tax; creditor monthly premium) (execution log 2026-11-02, AP2493_009, _014). **Not accepted:** the Permaplate cost being absent from the Subtotal — the ticket's description states "Cancelling a product also removes its amount from the quote Subtotal, so the Subtotal reflects only active products.", so the ticket text wins; AP2493_011/_012 stay FAIL (AP-2516) | Nicolas-Eric Tain |
| Q-004 | On an archived quote, should the cancel action be hidden, disabled, or refused? AC 1 only covers non-archived quotes. | REQ-001 | Judgement | Accepted | No Story/Task defines it (searched: `archived quote`, `archive quote product`, `archived quote edit product`; read AP-2422, AP-2494, AP-2496, AP-2101, AP-1161 — AP-2422 lets a dealer create a Roadside contract on a finalized quote, nothing on cancelling) — current actual result accepted: "Delete" is offered and enabled on archived quote 6245 (execution log 2026-11-02, AP2493_013) | Nicolas-Eric Tain |
| Q-005 | What should the confirmation modal say, and what are its buttons called? | REQ-002 | Judgement | Accepted | No Story/Task defines it (searched: `cancel product confirmation modal`, `confirmation modal quote`; read AP-2455, AP-2535, AP-2536, AP-2543 — their modal asks for a cancellation reason on a *generated contract*, not on a non-finalized product) — current actual result accepted: title "Cancel a product - {product}", text "Are you sure you want to cancel this product: {product}?", buttons "Yes, cancel the product" and "No"; no × icon; Escape and a click outside close it (execution log 2026-11-02, AP2493_007, _008) | Nicolas-Eric Tain |
| Q-006 | Is the financing (for example the monthly payment) recalculated when a product is cancelled, or does only the Subtotal change? | REQ-003 | Judgement | Accepted | No Story/Task defines it (searched: `financing monthly payment recalculated`, `monthly payment quote financing`, `financing recalculate product`; read AP-2499, AP-2504, AP-2405) — current actual result accepted: the financing is not recalculated — payment 494.91$ Monthly before and after the cancellation (execution log 2026-11-02, AP2493_011 step 3). Matches Minh Lưu's stated assumption of 2026-10-17 | Nicolas-Eric Tain |
| Q-007 | When a GAP product is cancelled, should a creditor insurance product on the same quote change (its premium includes the GAP amount)? | REQ-003 | Judgement | Accepted | No Story/Task defines it (searched: `GAP premium creditor insurance`, `creditor insurance GAP amount`; read AP-2499, AP-2504, AP-2502 — AP-2499 lists the creditor notice "create the GAP insurance first" only as its own open question) — current actual result accepted: the creditor premium stays CA$20.88 /m after the GAP is cancelled (it was 18.58$/m on a quote that never had GAP) (execution log 2026-11-02, AP2493_014) | Nicolas-Eric Tain |
| Q-008 | What message, if any, confirms a successful cancellation? | REQ-002 | Judgement | Accepted | No Story/Task defines it (searched: `product has been cancelled`, `cancel product success message`, `flash message cancelled`; read AP-2455, AP-2535, AP-2536, AP-2543 — they ask for "a successful flash message" after a *contract* cancellation, with no wording) — current actual result accepted: flash "The product has been cancelled" (execution log 2026-11-02, AP2493_009, _014) | Nicolas-Eric Tain |
| Q-009 | For each product, what exactly counts as a "generated contract" (warranty or Permaplate contract, roadside contract ID, GAP or creditor contract number, per Minh Lưu's comment)? | REQ-001 | Info | Accepted | No Story/Task defines it (searched: `generated contract product finalized`, `generate contract quote product`; read AP-2503, AP-2504, AP-2505, AP-2506, AP-2494, AP-2496, AP-2225 — they describe how each contract is generated, not when a product counts as finalized for cancellation) — current actual result accepted: a creditor product with a generated Chubb contract (AVP000169) shows only its PDF link and no "⋯"/Delete (execution log 2026-11-02, AP2493_006); the other four products' finalized state is recorded at execution | Minh Lưu |
| Q-010 | Is anything else linked to the deleted product row (documents, compliance sends, invoices) also removed? | REQ-003 | Info | Accepted | No Story/Task defines it (searched: `delete product documents compliance`, `cancel product invoice documents` — no hits; `hard delete row`, `delete quote product row` — only AP-2493 and AP-2496). AP-2496 (QC) says only what the combined download leaves out: "Given a quote where an optional product was removed before finalization, or a warranty contract is marked cancelled (WarrantyContract::isCancelled() true), When the dealer downloads all documents, Then no page from that product or contract is included, and the remaining documents are still merged." — it does not say whether linked records are removed — current actual result accepted: recorded at execution | Minh Lưu |

### Knowledge lookup — 2026-11-15

Re-check of every `Open` question by the knowledge lookup (SKILL.md Steps 3b–3c), run
2026-11-15T09:45Z–09:55Z by stlc-ticket-pipeline (`--from analyze --until analyze`, batch
qa-agent 2026-11-15). Query form, from the Jira adapter: `issuetype in (Story, Task) AND
text ~ "<words>"`, any status. For every plausible hit the description, the acceptance
criteria field and all comments were read. A hit counts only when one of its sentences
states the value, rule or workflow; mentioning the field is not enough.

Before the lookup, the ticket itself was re-read: the description and the three acceptance
criteria are unchanged, and the only comments added since capture are the QA's own (see
the capture's *Ticket changes since capture — 2026-11-15*). Neither answers a question.

| # | Word sets tried | Hits read | Result |
|---|---|---|---|
| Q-002 | `delete product quote details` · `cancel product dropdown delete` · `summary of products dropdown` | AP-2225, AP-2428, AP-2535, AP-2536, AP-2543 | Not defined → Accepted |
| Q-003 | `quote subtotal` · `subtotal products quote details` · `Permaplate retail price` · `summary of products` | AP-2428, AP-2456, AP-2427, AP-2496, AP-2537, AP-1948, AP-98, AP-2550, AP-2544 | Not defined → Accepted, Permaplate gap excluded (ticket text wins) |
| Q-004 | `archived quote` · `archive quote product` · `archived quote edit product` | AP-2422, AP-2494, AP-2496, AP-2101, AP-1161 | Not defined → Accepted |
| Q-005 | `cancel product confirmation modal` · `confirmation modal quote` | AP-2455, AP-2535, AP-2536, AP-2543, AP-2505, AP-2497, AP-2498, AP-2436 | Not defined → Accepted |
| Q-006 | `financing monthly payment recalculated` · `monthly payment quote financing` · `financing recalculate product` | AP-2499, AP-2504, AP-2405 | Not defined → Accepted |
| Q-007 | `GAP premium creditor insurance` · `creditor insurance GAP amount` | AP-2499, AP-2504, AP-2502 | Not defined → Accepted |
| Q-008 | `product has been cancelled` · `cancel product success message` · `flash message cancelled` | AP-2455, AP-2535, AP-2536, AP-2543, AP-2537 | Not defined → Accepted |
| Q-009 | `generated contract product finalized` · `generate contract quote product` | AP-2503, AP-2504, AP-2505, AP-2506, AP-2494, AP-2496, AP-2225, AP-2546, AP-2550 | Not defined → Accepted |
| Q-010 | `delete product documents compliance` (none) · `cancel product invoice documents` (none) · `hard delete row` · `delete quote product row` | AP-2496 | Partly touched (download bundle only) → Accepted |

**Later Stories on cancelling.** AP-2535 *Cancelling a quote's Esthetic protection*
(Deploy to staging), AP-2536 *Cancelling a quote's Chubb protection (gap/creditor
insurance)* (PR opened), AP-2543 *Voiding a quote's Roadside protection* (Deploy to
staging) and AP-2537 *Refunding a quote's Roadside protection* (Backlog) all cancel a
**generated contract** from its own contract page, with a reason, a "Cancel" button and
cancellation fields saved on the contract. AP-2493 covers only products **without** a
contract ("Finalized products keep their existing download action and are out of scope for
cancellation here."). None of them redesigns AP-2493's function, so none overrides an
AP-2493 acceptance criterion, and none states a value for Q-002–Q-010.

**What the limits leave in place.** No acceptance criterion of AP-2493 states the result
any of Q-002–Q-010 asks about, so accepting the actual result changes no verdict except
where the ticket text speaks: the description's Subtotal sentence keeps AP2493_011 and
AP2493_012 FAIL (AP-2516, untouched). No question is a contradiction in the ticket's own
text (Q-001's contradiction was settled by the reporter on 2026-10-17). Nothing was posted
to Jira.

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-001 | Five products reached through different screens; GAP has no mapped quote stage, so preparing every product type may not be possible | High | Open |
| REQ-001 | Roadside "Save and Generate Contract" may finalize a Roadside product on save | Medium | Open |
| REQ-001 | Behaviour on an archived quote not stated (Q-004) | Low | Accepted (Q-004, 2026-11-15) |
| REQ-001 | Action label not specified (Q-002) | Low | Accepted (Q-002, 2026-11-15) |
| REQ-002 | Ways to dismiss the modal not listed | Medium | Open |
| REQ-002 | Modal wording not specified (Q-005) | Low | Accepted (Q-005, 2026-11-15) |
| REQ-002 | "Unchanged" needs a before/after comparison | Low | Open |
| REQ-003 | Database row deletion not observable from the UI | High | Open |
| REQ-003 | Subtotal location and source amount unknown (Q-003) | Medium | Accepted except the Permaplate gap (Q-003, 2026-11-15; AP-2516) |
| REQ-003 | Financing recalculation not stated (Q-006) | Medium | Accepted (Q-006, 2026-11-15) |
| REQ-003 | GAP/creditor interaction not stated (Q-007) | Medium | Accepted (Q-007, 2026-11-15) |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design
