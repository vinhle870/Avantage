# Requirements Analysis Report

**Project:** Avantage Plus v2 — Permaplate feature set
**Date:** 2026-09-06
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2443-permaplate-contract-list-dealer.md`, `requirements/AP-2444-permaplate-conditional-options.md`, `requirements/AP-2445-permaplate-conditions-pdf.md`, `requirements/AP-2446-permaplate-invoice.md`, `requirements/AP-2447-admin-assign-permaplate-products.md`, `requirements/AP-2448-admin-permaplate-contracts.md`, `requirements/AP-2455-admin-unlink-permaplate.md`, `requirements/AP-2456-remove-retail-pricing.md`
**Total requirements found:** 8

---

## Executive Summary

Eight Jira stories were analysed, one per requirement file. Together they are not eight
separate features but one product area: **Permaplate**, a paint-and-appearance protection
product that Avantage Plus dealers sell alongside their warranty products. The eight
stories build that product end to end — an administrator decides which dealers may sell
which Permaplate products (AP-2447) and can withdraw that permission again (AP-2455); the
dealer quotes the product with conditional add-on options (AP-2444), turns the quote into
a contract, and is billed for it automatically (AP-2446); the resulting contract is listed
for the dealer (AP-2443) and for the administrator (AP-2448); the product's terms and
conditions are appended to the contract document (AP-2445); and a late change strips the
consumer-facing retail price from every one of those surfaces (AP-2456).

Because the stories chain together, they cannot honestly be tested in isolation. A dealer
cannot reach the quote form in AP-2444 unless the administrator has first linked a product
in AP-2447, and no contract list in AP-2443 or AP-2448 can be checked until a contract has
actually been created. This dependency shapes the whole test plan: the tests must be run in
build order, not ticket order.

**Overall testability is rated MEDIUM.** Most stories carry a genuine Given/When/Then
acceptance-criteria field naming real page titles, column headings and button labels, which
is far more than the previous cycle (AP-2437) had to work with, and much of it can be
checked directly against the screen. Twenty-six testability risks were flagged, eight of
them High. The High risks are concentrated in four places: AP-2456 has no description at
all and never says what "retail pricing" is called on screen, so a tester cannot prove a
field was removed without first being told which field it was; AP-2445 already has a
reported failure sitting in its own comments, meaning it is being handed to QA in a state
its author knows does not work; AP-2443 splits its list by an "account owner" permission
that is defined nowhere in the ticket; and AP-2446 says the invoice must behave "the same
way as a warranty contract invoice" without stating what that behaviour is, which pushes
the definition of correct outside the ticket entirely.

The single biggest gap is not in any one story. It is that the `domain` knowledge source
for this project is unbound — nothing is written down about what Permaplate is, what a
"term" means, what its options are, or how its pricing works. Every fact in this analysis
therefore came from the tickets themselves or from the project's navigation map, and where
the tickets are silent this report says so rather than filling the space.

---

## Requirements Detail

### REQ-001 — Admin can assign Permaplate products to a dealer

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want to decide which Permaplate products a dealer is allowed to sell, so that a dealer only ever quotes products their agreement actually covers. |
| **Priority** | High — nothing else in the Permaplate set can be reached until a product is linked to a dealer, so this requirement gates the other seven. The ticket itself is marked Medium, but its position in the chain makes it the highest test priority. |
| **Source File** | `AP-2447-admin-assign-permaplate-products.md` |
| **Recommended Test Types** | Functional · Negative · Edge-case · UI · Regression |

**Acceptance Criteria:**

1. On the Dealer details page in the admin area, a new tab named *Permaplate Products* is available.
2. That tab shows a navigation component titled *Eligible Permaplate products* with a *Link a product* button.
3. That tab shows a datagrid (a table of records with one row per item) of all linked Permaplate products, using the same datagrid as the Permaplate index page.
4. Clicking *Link a product* opens a modal window titled *Link a permaplate product to dealer {{Dealer company name}}*, containing a select box listing all the Permaplate products and a Save button.
5. Once a product is linked, it is available for selection on the dealer portal's Permaplate quote page.
6. If a dealer has no Permaplate product linked at all, the Permaplate button is not shown on that dealer's quote page.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The acceptance criteria do not say what happens when the administrator tries to link a product that is already linked to the same dealer. Without that, a tester cannot tell whether a duplicate row is a bug or the intended behaviour. | Medium | Ask the product owner whether the select box should hide already-linked products, or whether saving a duplicate should be rejected with a message. |
| The criteria do not say what the datagrid shows when no product has been linked yet — an empty table, a message, or nothing at all. | Low | Confirm the empty-state text before writing the test case; test the empty state against whatever the page actually does and record it. |
| Criterion 6 changes what the dealer sees, but the ticket does not say whether a dealer with an existing Permaplate quote keeps access to it after their last product is unlinked. | Medium | Raise as Q-002 below; it decides whether unlinking is safe on a live dealer. |

---

### REQ-002 — Admin can unlink a Permaplate product from a dealer

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want to unlink a Permaplate product from a dealer, so that the product stops appearing when that dealer creates a quote. |
| **Priority** | High — this is the reverse of REQ-001 and shares its data. If unlinking does not work correctly, a dealer can keep selling a product the business has withdrawn, which is a commercial exposure rather than a cosmetic fault. |
| **Source File** | `AP-2455-admin-unlink-permaplate.md` |
| **Recommended Test Types** | Functional · Negative · UI · Regression |

**Acceptance Criteria:**

1. On the Dealer > Permaplate products page, when the linked-product datagrid is not empty, an *unlink* button is shown.
2. Clicking that button opens a confirmation modal titled *"Unlink a permaplate product"*.
3. The modal's content reads *"Please confirm that you want to unlink dealer {{company name}} to the permaplate {{permaplate product title}}"*.
4. The modal has a *"Continue"* button.
5. On submitting the form, a success message appears on the page and the product is removed from the datagrid.
6. After unlinking, the product no longer appears in the form when that dealer creates a Permaplate quote.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The criteria never say what happens to Permaplate contracts and quotes that already exist for the unlinked product. If unlinking deletes or hides a signed contract, the business loses a record it is legally required to keep. | High | Confirm with the product owner before testing on any dealer that has real contracts. Test it deliberately on a throwaway link and record what happens either way. |
| The exact wording of the success message is not given, only that one appears. A test can prove a message appeared but not that the right message appeared. | Low | Record the actual message text during execution and treat any future change to it as a regression. |
| The modal has a *Continue* button but no cancel path is described. A user who opens the modal by accident has no stated way out. | Low | Check for a Cancel button or a close control and report the real behaviour. |

---

### REQ-003 — Dealer can select conditional Permaplate options

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the *Extra care* option to become available when the *Paint* option is selected, and to be able to opt out of it, so that the quote only offers add-ons that are valid for what the client is buying. |
| **Priority** | High — this is the only story in the set that adds real business logic rather than a list or a page. A fault here produces a quote that sells the client a combination of options the product does not actually allow. |
| **Source File** | `AP-2444-permaplate-conditional-options.md` |
| **Recommended Test Types** | Functional · Negative · Edge-case · UI |

**Acceptance Criteria:**

1. When an admin user edits a Permaplate option, a new field *Parent* is available.
2. The *Parent* field is a select box listing all the options whose term matches the current option.
3. On the dealer's Permaplate quote form, an option that has a parent is displayed as a child of that parent.
4. A child field is disabled by default and only becomes enabled when its parent is selected.
5. When the parent is selected, all its child fields become enabled and are selected by default, and each can then be de-selected individually.
6. When the parent is de-selected, all its child fields are de-selected and disabled again.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The word "term" is used to limit which options may be chosen as a parent, but the ticket never says what a term is. A tester cannot confirm the select box is correctly filtered without knowing what it is filtering on. | Medium | Ask the developer what field "term" maps to, and record the answer in the project's domain knowledge so the next cycle does not have to ask again. |
| Nothing says whether a child option may itself be a parent of a third option. If two levels of nesting are possible, the enable and disable rules in criteria 4 to 6 are ambiguous for the middle level. | Medium | Ask whether nesting is limited to one level; if it is not, the disable rule needs restating before it can be tested. |
| The ticket does not say whether an option can be its own parent, or whether two options can be each other's parent. Either would produce a form that can never be filled in. | Low | Test both as negative cases and report whatever the form does. |
| The description names *Paint* and *Extra care* as the real example, but the acceptance criteria are written generically. It is not stated whether that specific pair is already configured on the test environment. | Medium | Confirm during execution; if the pair does not exist, the test creates it through the admin *Parent* field first. |

---

### REQ-004 — A Permaplate invoice is created when the contract is created

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want an invoice raised automatically when I create a Permaplate contract, so that I can pay for the product through the billing screen I already use for warranty contracts. |
| **Priority** | High — this is the requirement that moves money. If the invoice is not raised, the dealer receives the product without ever being billed for it, and the business loses the revenue silently. |
| **Source File** | `AP-2446-permaplate-invoice.md` |
| **Recommended Test Types** | Functional · Negative · Regression · UI |

**Acceptance Criteria:**

1. When a dealer creates a Permaplate contract from an existing Permaplate quote, a Permaplate invoice is created.
2. An alert message is shown telling the user an invoice has been created, in the same way as for a warranty contract invoice.
3. The invoice appears in the invoices index page.
4. The invoice can be paid in the same way a warranty invoice is paid.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Three of the four criteria define correct behaviour by pointing at the warranty invoice rather than describing it, so a tester who does not already know the warranty flow cannot tell whether what they are looking at is right. | High | Walk the warranty contract-to-invoice flow first and write down what it does, then use that as the comparison baseline. This is recorded as Q-004. |
| No invoice amount is specified. The criteria never say whether the invoice is for the cost price, the retail price, or a price including taxes — which directly collides with AP-2456, the story that removes retail pricing. | High | Ask the product owner what amount the Permaplate invoice must carry. Until answered, the amount can be recorded but not passed or failed. |
| Nothing describes what happens if invoice creation fails after the contract is already created. The contract could exist with no bill against it, and the business would never be paid. | Medium | Ask whether contract creation and invoice creation are a single transaction. Report the observed behaviour if it can be provoked. |

---

### REQ-005 — Permaplate contract list on the dealer page

| Field | Value |
|---|---|
| **User Story** | As a dealer user, I want to see the Permaplate contracts created under my dealer, so that I can find a client's contract and print it without asking the administrator for a copy. |
| **Priority** | High — this list is the dealer's only route to their own signed contracts, and it also carries a permission rule that decides whether one salesperson can see another's clients. |
| **Source File** | `AP-2443-permaplate-contract-list-dealer.md` |
| **Recommended Test Types** | Functional · Negative · Edge-case · UI · Regression |

**Acceptance Criteria:**

1. In the dealer area, the menu under *Contracts* contains a *Permaplate* item.
2. Clicking *Permaplate* opens the Permaplate index page.
3. The page has a navigation component titled *Permaplate contracts*.
4. The page has a datagrid of the dealer's Permaplate contracts.
5. If the logged-in user's permission is *account owner*, every contract belonging to the current dealer is listed. Otherwise only the contracts belonging to the user who created the quote are listed.
6. The datagrid columns are: VIN, Client name, Client phone, Contract cost price, and Actions.
7. The Actions column holds a *Download contract PDF* button carrying a PDF icon.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Criterion 5 turns on a permission called *account owner*, which the ticket never defines and which no project document describes. Proving the rule needs two dealer logins with different permissions, and the ticket does not say how to tell them apart. | High | Ask which permission flag or role name *account owner* corresponds to, and whether the staging environment has a non-owner dealer account. Recorded as Q-001. Until it is answered, criterion 5 cannot be tested at all. |
| Criterion 6 asks for a "Contract cost price" column but does not say whether that figure includes taxes. AP-2456 separately removes taxes from the PDF, so the two stories may disagree about the same number. | Medium | Ask the product owner to confirm whether the dealer list shows the cost price with or without tax. |
| The page is described but no sorting, filtering, paging or empty-state behaviour is specified, even though every other index page in this product has them. | Low | Test what the page actually does and record it, rather than passing or failing against an unstated rule. |

---

### REQ-006 — Admin user can see all Permaplate contracts

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want to see every Permaplate contract in the system, so that I can look up any dealer's contract and inspect both the signed document and the money billed against it. |
| **Priority** | Medium — this is the administrator's read-only view. A fault here delays support work but does not stop a dealer selling or a client being covered. |
| **Source File** | `AP-2448-admin-permaplate-contracts.md` |
| **Recommended Test Types** | Functional · Edge-case · UI · Regression |

**Acceptance Criteria:**

1. In the admin area, the menu contains a *Permaplate* item under *Contracts*.
2. Clicking CONTRACTS > *Permaplate* opens the Permaplate Contract Index page.
3. The page has a navigation component titled *"Permaplate Contracts"*.
4. The page has a datagrid of all Permaplate contracts with a *Client* column showing client name, email and phone number.
5. The datagrid has a *Dealer* column showing dealer company name and email.
6. The datagrid has a *Vehicle* column showing vehicle make, model, year and VIN.
7. The datagrid has a *Program* column showing the Permaplate contract term and the components selected.
8. The datagrid has an *Actions* column with a view button carrying an eye icon.
9. Clicking the view button opens a contract details page showing the contract PDF inside an iframe (a panel that displays another document inside the page).
10. The contract details page also shows a datagrid of all invoices created for that contract.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| At capture time this story had no merged pull request recorded, unlike the other seven. It may not be deployed to the staging environment at all. | High | Confirm deployment before execution. If it is not deployed, every case for this requirement must be reported as Blocked, not Failed — a fault invented from an undeployed build wastes the developer's time and damages trust in the whole run. |
| Criterion 7 asks the *Program* column to show "the components selected", but does not say how several selected components are presented in one table cell, nor what happens when there are many. | Medium | Record what the column actually renders and confirm it with the product owner rather than judging it against a rule that was never written. |
| The criteria do not say whether the invoice datagrid on the details page shows anything when a contract has no invoice yet. | Low | Record the empty state observed. |

---

### REQ-007 — Permaplate conditions appended to the contract PDF

| Field | Value |
|---|---|
| **User Story** | As a dealer or client receiving a Permaplate contract, I want the product conditions document attached to the contract PDF in my own language, so that the terms I am agreeing to travel with the contract instead of having to be requested separately. |
| **Priority** | High — the conditions are the legal terms of the product. A contract that goes to a client without them is a document the business may not be able to rely on. |
| **Source File** | `AP-2445-permaplate-conditions-pdf.md` |
| **Recommended Test Types** | Functional · Edge-case · Regression |

**Acceptance Criteria:**

1. When the user opens a Permaplate contract, the contract contains the conditions PDF.
2. The conditions PDF is in the respective language — English or French — matching the contract.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket's own latest comment, from its author on 2026-09-01, reports that the conditions PDF is not loading, with a screen recording attached. The story is being handed to QA in a state its author already knows is broken. | High | Re-test this requirement first. If the failure still happens, report it as a confirmation of a known defect rather than as a new discovery, so the developer is not sent looking for a second fault. |
| Two criteria carry the whole story. Nothing says where in the merged document the conditions go — before the contract, after it, or as a separate file — so a tester cannot fail a document for putting them in the wrong place. | Medium | Ask for the expected page order. The equivalent AP-2437 work placed its appended form as page 1, so the answer is not obvious. |
| "The respective language" is not defined. It is not stated whether the language follows the client's language setting, the dealer's, or a field on the contract itself. | Medium | Ask which setting decides the language, and record it in the project's domain knowledge. |
| Only two condition documents are attached, one English and one French. Nothing says what happens if the document for the required language is missing. | Low | Test the two known languages and report the absence of any other path. |

---

### REQ-008 — Remove retail pricing from Permaplate contracts and invoices

| Field | Value |
|---|---|
| **User Story** | Not stated on the ticket. The description field of AP-2456 is empty; only acceptance criteria were supplied. |
| **Priority** | Medium — this is a change to what is displayed rather than to what the system does. It matters commercially because it hides a margin from the dealer, but no function breaks if it is missed. |
| **Source File** | `AP-2456-remove-retail-pricing.md` |
| **Recommended Test Types** | Functional · Regression · UI |

**Acceptance Criteria:**

1. On the Permaplate quote form, the retail pricing is removed.
2. On the quote details page's Permaplate section, the retail pricing is removed.
3. On the generated Permaplate PDF, the retail pricing and the taxes are removed.
4. In the invoice description, the retail pricing is removed.
5. On the admin's Permaplate option edit form and its datagrid, the retail pricing field is removed.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket has no description at all, and never says what "retail pricing" is called on screen. A tester cannot prove a field was removed without first being told which field it was. This is the weakest-specified story of the eight. | High | Capture the five surfaces on a build from before this change, or ask the developer which field name was removed. Recorded as Q-006. |
| Criterion 4 says the retail price goes out of the invoice *description*, which implies the invoice still carries an amount somewhere. Read together with REQ-004, which never states the invoice amount, nobody has said what number the dealer is actually billed. | High | Resolve together with Q-005 on REQ-004. Until both are answered, the invoice amount can be recorded but not passed or failed. |
| Criterion 3 removes taxes from the PDF but no other criterion mentions taxes, so it is unclear whether taxes should remain on the quote form and the invoice. | Medium | Ask whether the tax removal is PDF-only and deliberate. |
| Removal is inherently hard to prove. A field that is absent because it was removed looks identical to a field that is absent because the page failed to load that section. | Medium | Every removal case must also confirm that the surrounding fields on the same surface are still present, so an empty section is not mistaken for a successful removal. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Admin assigns Permaplate products | ✓ | ✓ | ✓ | ✓ | ✓ | | | |
| REQ-002 — Admin unlinks a Permaplate product | ✓ | ✓ | | ✓ | ✓ | | | |
| REQ-003 — Dealer conditional options | ✓ | ✓ | ✓ | | ✓ | | | |
| REQ-004 — Permaplate invoice created | ✓ | ✓ | | ✓ | ✓ | | | |
| REQ-005 — Dealer contract list | ✓ | ✓ | ✓ | ✓ | ✓ | | | |
| REQ-006 — Admin contract list | ✓ | | ✓ | ✓ | ✓ | | | |
| REQ-007 — Conditions PDF appended | ✓ | | ✓ | ✓ | | | | |
| REQ-008 — Retail pricing removed | ✓ | | | ✓ | ✓ | | | |

**Legend:** ✓ = recommended based on requirement content

Accessibility and performance are not recommended for any requirement in this set,
because no story states an accessibility or speed expectation. That is an absence in the
requirements, not a decision that these qualities do not matter.

The application programming interface column (API — the machine-to-machine route into the
system) is empty for every row because this project tests through the screen only, as
recorded in the project's knowledge registry.

---

## Open Questions

Questions that must be answered by the product team before test case design begins:

| # | Question | Raised against | Assigned to | Due |
|---|---|---|---|---|
| Q-001 | What does the *account owner* permission correspond to in the dealer portal, and does the staging environment have a dealer account without it? Without a second account the split-visibility rule cannot be tested at all. | REQ-005 | Ken Nguyen | 2026-09-09 |
| Q-002 | When an administrator unlinks a Permaplate product, what happens to the quotes and signed contracts that already use it? | REQ-002 | Ken Nguyen | 2026-09-09 |
| Q-003 | What field does "term" refer to when the *Parent* select box is filtered to options of the same term, and can a child option itself be a parent? | REQ-003 | Minh Lưu | 2026-09-09 |
| Q-004 | What exactly does the warranty contract-to-invoice flow do, since three of REQ-004's four criteria define correctness by pointing at it? | REQ-004 | Ken Nguyen | 2026-09-09 |
| Q-005 | What amount does the Permaplate invoice carry — cost price, retail price, with or without taxes? Neither REQ-004 nor REQ-008 says. | REQ-004, REQ-008 | Ken Nguyen | 2026-09-09 |
| Q-006 | What is the retail-pricing field actually called on each of the five surfaces AP-2456 removes it from? | REQ-008 | Minh Lưu | 2026-09-09 |
| Q-007 | Is the conditions-PDF failure reported in AP-2445's own comment on 2026-09-01 fixed in the build now on staging? | REQ-007 | Minh Lưu | 2026-09-08 |
| Q-008 | Where in the merged Permaplate document do the conditions belong, and which setting decides whether the English or the French version is used? | REQ-007 | Ken Nguyen | 2026-09-09 |
| Q-009 | Is AP-2448 deployed to staging? It is the only one of the eight with no merged pull request recorded. | REQ-006 | Minh Lưu | 2026-09-08 |
| Q-010 | Does the dealer's *Contract cost price* column show the figure with or without taxes? | REQ-005 | Ken Nguyen | 2026-09-09 |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-002 | Nothing states what happens to existing quotes and signed contracts when a product is unlinked, so the test itself could destroy a record the business must keep. | High | Open |
| REQ-004 | Correctness is defined by pointing at the warranty invoice flow rather than describing it, so the standard lives outside the ticket. | High | Open |
| REQ-004 | The invoice amount is never specified. | High | Open |
| REQ-005 | The *account owner* permission that splits the list is defined nowhere. | High | Open |
| REQ-006 | No merged pull request is recorded, so the story may not be on staging at all. | High | Open |
| REQ-007 | The story's own author reported on 2026-09-01 that the conditions PDF does not load. | High | Open |
| REQ-008 | The ticket has no description and never names the retail-pricing field being removed. | High | Open |
| REQ-008 | Read together with REQ-004, nobody has stated what number the dealer is billed. | High | Open |
| REQ-001 | Duplicate linking of the same product to the same dealer is undefined. | Medium | Open |
| REQ-001 | The effect on a dealer's existing quote when their last product is unlinked is undefined. | Medium | Open |
| REQ-003 | The word "term", which filters the *Parent* select box, is never defined. | Medium | Open |
| REQ-003 | Whether options may nest more than one level deep is not stated. | Medium | Open |
| REQ-003 | It is not stated whether the *Paint* and *Extra care* pair already exists on staging. | Medium | Open |
| REQ-004 | The behaviour when invoice creation fails after the contract exists is undefined. | Medium | Open |
| REQ-005 | Whether the *Contract cost price* column includes taxes is not stated, and AP-2456 removes taxes elsewhere. | Medium | Open |
| REQ-006 | How several selected components render inside one *Program* cell is not stated. | Medium | Open |
| REQ-007 | The page position of the appended conditions is not stated. | Medium | Open |
| REQ-007 | Which setting decides the conditions language is not stated. | Medium | Open |
| REQ-008 | Whether taxes should also be removed from the quote form and invoice, or only from the PDF, is not stated. | Medium | Open |
| REQ-008 | A removed field and a section that failed to load look identical on screen. | Medium | Open |
| REQ-001 | The empty state of the linked-products datagrid is not described. | Low | Open |
| REQ-002 | The exact success-message wording is not given. | Low | Open |
| REQ-002 | No cancel path out of the confirmation modal is described. | Low | Open |
| REQ-003 | Self-referencing and mutually-referencing parents are not addressed. | Low | Open |
| REQ-005 | Sorting, filtering, paging and the empty state of the dealer list are not specified. | Low | Open |
| REQ-006 | The empty state of the invoice datagrid on the contract details page is not specified. | Low | Open |
| REQ-007 | Behaviour when the conditions document for the required language is missing is not stated. | Low | Open |

---

## Data entities touched

Named here, not classified. `stlc-test-plan-designer` §6.1 decides which of these are
Static, Dynamic or Configuration.

| Entity | Touched by | What the feature does to it |
|---|---|---|
| Dealer account | REQ-001, REQ-002, REQ-005 | Read; its list of eligible Permaplate products is changed |
| Dealer portal user and their permission level | REQ-005 | Read; decides how much of the contract list is shown |
| Permaplate product | REQ-001, REQ-002, REQ-003, REQ-008 | Read; linked to and unlinked from a dealer |
| Permaplate option, and its new *Parent* field | REQ-003, REQ-008 | Read and changed in the admin area |
| Quote | REQ-003, REQ-004, REQ-008 | Created by the dealer; carries the Permaplate selection |
| Client record | REQ-005, REQ-006 | Created as part of the quote; its name, phone and email appear in both lists |
| Vehicle record, including the VIN | REQ-005, REQ-006 | Created as part of the quote; appears in both lists |
| Permaplate contract | REQ-004, REQ-005, REQ-006, REQ-007 | Created from the quote |
| Permaplate contract PDF | REQ-005, REQ-006, REQ-007, REQ-008 | Generated; the conditions document is merged into it |
| Permaplate conditions documents, English and French | REQ-007 | Read and merged into the contract PDF |
| Invoice | REQ-004, REQ-006, REQ-008 | Created automatically with the contract; paid by the dealer |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [x] Ready to proceed to Test Plan Design
