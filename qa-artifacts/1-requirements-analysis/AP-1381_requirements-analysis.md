# Requirements Analysis Report

**Project:** Avantage Plus v2 — Billing & Payments, dealer invoice "TO" section (Jira AP-1381)
**Date:** 2026-11-01
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-1381-duplicate-name-visual.md`
**Total requirements found:** 2

---

## Executive Summary

AP-1381 is a small display fix on the dealer invoice. The reporter, Eric Lindquist, wrote
that "on the invoice - the name of the dealer is duplicated - only company name is needed to
show". A developer comment (Trinh Le, 2022-03-26) places the duplication in the invoice's
**TO** section (the block naming who the invoice is addressed to), which showed "the dealer
name + the dealer company". After the fix, the reporter confirmed on 2022-08-03: "the *Name is
what will appear in the invoice" — that is, the dealer's mandatory *Name* field (the asterisk
marks it as required) is the single name the invoice should show. The ticket has two linked
Xray tests (test records in the tracker), AP-1551 for the Dealer portal and AP-1552 for the
Admin portal, so the same rule is checked on the invoice as seen from each portal.

Two requirements were extracted: one per portal. The ticket has no separate
acceptance-criteria field, so the acceptance criterion of each requirement is the
description sentence itself, quoted word for word. Three open questions were raised. The one
that decides the main result — *which* name stays — is answered by the reporter's quoted
comment, so nothing blocks testing. The other two are Judgement questions (the main result is
clear, but an edge result would need the answer): whether invoices created before the fix
should also change, and whether the PDF or emailed copy of the invoice is in scope. Tests
record what the build does on those points instead of guessing.

Overall testability is rated **Medium**: the expected result ("the dealer's name appears once
in the TO section, with no second company line") is clear and visible on screen, but the
ticket was written in 2022 for release 1.25.0, before the v2 portals this project tests, and
the project's knowledge base does not yet describe the v2 invoice layout. If the v2 invoice no
longer has a TO section, the test cases will need their location wording adjusted at
execution.

---

## Requirements Detail

### REQ-001 — Dealer portal invoice shows the dealer's name only once

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. Implied by the description: as a dealer, I want my name to appear once on my invoice so that the invoice does not look wrong to me or my customer. |
| **Priority** | Medium — the ticket's own priority. The defect is cosmetic: no amount or payment is affected, but every invoice a dealer sees carries it. |
| **Source File** | AP-1381-duplicate-name-visual.md (description; linked Xray test AP-1551 "[AP-1381] Dealer portal - Verify only Dealer name is displayed on invoic…") |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. From the description, verbatim: "on the invoice - the name of the dealer is duplicated - only company name is needed to show". Read together with the reporter's answer of 2022-08-03 (Q-001): the invoice's TO section shows the dealer's *Name value once, and the dealer company is not shown as a second name line.

**Out of Scope:**

- Invoices created before the fix was released. The developer comment of 2022-09-15 says these "already has that info stamped on them so we cannot modify those"; whether they should change is Q-002.
- Every other part of the invoice (amounts, line items, the dealer's address). The ticket says nothing about them.

**Data entities touched:** the dealer account (its *Name and company values), a dealer invoice (created by a sale, such as a contract or a Permaplate sale), the invoice view in the Dealer portal (`/invoice`).

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The description says "only company name", while the linked Xray tests say "only Dealer name" and a developer comment says "remove dealer company". These read as opposite choices; only the reporter's 2022-08-03 comment ("the *Name is what will appear") settles which value stays. | Medium — if the test relied on the description alone, it could fail a correct build. | Base the expected result on the reporter's quoted answer (Q-001) and record both values on screen. |
| If the dealer's *Name and company values are identical in the test data, a test cannot tell which one the invoice shows — only that it is shown once. | Medium — a test on such data proves de-duplication but not which field is used. | Use, or record, a dealer whose *Name and company differ, and note both values in the test case. |
| The fix was made in 2022 (release 1.25.0) and the project's knowledge base has no description of the v2 invoice layout or its TO section. | Medium — the test cases may name a section that the v2 invoice labels differently. | Confirm the section name at execution and record it; update the `domain` knowledge afterwards. |
| An invoice must exist for the test dealer, and only invoices created after the fix are in scope. | Low — invoices are easy to create through a sale, but an old invoice would give a misleading result. | Create a fresh invoice in a pre-condition step, or note the creation date of any existing one used. |

---

### REQ-002 — Admin portal invoice shows the dealer's name only once

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. Implied by linked Xray test AP-1552: as an administrator, I want the dealer's invoice to show the dealer's name once so that the invoice I review or send matches what the dealer sees. |
| **Priority** | Medium — the ticket's own priority, for the same cosmetic reason as REQ-001. |
| **Source File** | AP-1381-duplicate-name-visual.md (description; linked Xray test AP-1552 "[AP-1381] Admin portal - Verify only Dealer name is displayed on invoice…") |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. From the description, verbatim: "on the invoice - the name of the dealer is duplicated - only company name is needed to show". Read with the reporter's answer of 2022-08-03 (Q-001): the same invoice, opened from the Admin portal, shows the dealer's *Name value once in its TO section, with no second company line.

**Out of Scope:**

- Invoices created before the fix (see Q-002).
- Every other part of the invoice.

**Data entities touched:** the dealer account, the same dealer invoice as REQ-001, the Admin portal's view of dealer invoices (route not recorded in the knowledge base).

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The knowledge base does not say where the Admin portal shows a dealer's invoice. | Medium — the test case cannot name an exact route until it is found. | Locate the admin invoice view at execution, record its route, and write it back to the `domain` knowledge. |
| Same name-choice and identical-data risks as REQ-001. | Medium — see REQ-001. | See REQ-001. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Dealer portal invoice, name once | ✓ | | ✓ | ✓ | ✓ | | | |
| REQ-002 — Admin portal invoice, name once | ✓ | | ✓ | ✓ | ✓ | | | |

**Legend:** ✓ = recommended based on requirement content. Edge-case here means a dealer whose *Name and company values differ, and the PDF/printed copy of the invoice; no negative test applies, because the change has no user input.

---

## Open Questions

Points the requirement leaves unsettled. **Impact** says what each one does to testing:
*Blocking* — an acceptance criterion cannot be judged until it is answered, so its test
cases stay BLOCKED and the story cannot be released; *Judgement* — the main result is
testable, and the test records what the build does on this point instead of guessing;
*Info* — no test result depends on it. Classification test: SKILL.md Step 3b.

| # | Question | Raised against | Impact | Status | Answer (quoted, with source) | Assigned to |
|---|---|---|---|---|---|---|
| Q-001 | Which single name should the invoice's TO section show: the "company name" named in the description, or the dealer name named in the linked Xray tests? | REQ-001, REQ-002 | Blocking | Answered | "This looks fine. the *Name is what will appear in the invoice" — ticket comment by Eric Lindquist (reporter), 2022-08-03 | Eric Lindquist |
| Q-002 | Should invoices created before the fix was released also show the name only once, or is it acceptable that they keep the duplicated name? The only statement is a developer-side comment by Ken Nguyen, who is in the registry's `not_developers` list, so it cannot answer the question for this analysis. | REQ-001, REQ-002 | Judgement | Open | — | Eric Lindquist |
| Q-003 | Does the rule apply to every form of the invoice — the on-screen view, the downloaded or printed PDF and any emailed copy — or only to one of them? The ticket says only "on the invoice". | REQ-001, REQ-002 | Judgement | Open | — | Eric Lindquist |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-001, REQ-002 | The description and the linked tests name different fields; only the reporter's later comment (Q-001) settles which name stays. | Medium | Mitigated — answered by quote |
| REQ-001, REQ-002 | Test data with identical *Name and company values cannot show which field the invoice uses. | Medium | Open |
| REQ-001, REQ-002 | The v2 invoice layout, its TO section and the Admin portal invoice route are not in the knowledge base. | Medium | Open |
| REQ-001, REQ-002 | Behaviour of invoices created before the fix is not stated by the author (Q-002). | Low | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion (taken from the description; the ticket has no separate acceptance-criteria field)
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [x] Ready to proceed to Test Plan Design
