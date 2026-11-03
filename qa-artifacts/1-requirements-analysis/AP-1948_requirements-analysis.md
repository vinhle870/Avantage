# Requirements Analysis Report

**Project:** Avantage Plus v2 — Client portal
**Date:** 2026-11-01
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** requirements/AP-1948-cbi-cve-tesla-price-modification.md (Jira AP-1948, Task, priority High, status QC, fix version 1.39.0)
**Total requirements found:** 3
**related_docs:** none — the `domain` source has no file for the Client portal. `navigation-map.md` §4 lists the Client portal (`/customer/{id}/quote-request`) as "no flow mapped at all". This is a declared knowledge gap, not an assumption.

---

## Executive Summary

AP-1948 changes how the Client portal (the no-login, per-customer quote-request page at
`/customer/{id}/quote-request`) offers warranty terms and prices. The ticket's
Given / When / Then block gives two acceptance statements: the program terms offered are
filtered by the vehicle model's Category (A, B or C), and the price shown is the
"suggested retail price" set on the program term. Below a horizontal rule, the ticket
also keeps an "Original ask" with fixed Tesla prices (2500$ to 2900$) and model
surcharges (+200$ for Model 3 / Y, +800$ for Model S / X).

Three requirements were extracted. REQ-002 (price equals the term's suggested retail
price) can be tested as written. REQ-001 (category filter) cannot be judged until someone
says which vehicle models belong to which category and how a program term is tied to a
category. REQ-003 (the Tesla figures of the original ask) cannot be judged until someone
says whether those figures are still a requirement or were replaced by the configured
term pricing, and which term each figure belongs to. Two questions are therefore
**Blocking**, four are **Judgement** and three are **Info**. Overall testability is rated
**LOW-MEDIUM**: the ticket is short, has no separate acceptance-criteria field, and the
Client portal has never been mapped by QA. The ticket was released in 1.39.0 in April 2024
and the reporter said on 2024-04-03 that it "works ( live ) with the correct pricing", so
this run is in practice a regression check of live behaviour.

---

## Requirements Detail

### REQ-001 — Program terms filtered by vehicle model Category

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. The Given / When / Then reads: a customer user on the customer portal selects the warranty term, and the program terms are filtered by vehicle model Category |
| **Priority** | High — the ticket is High priority, and offering a term from the wrong category would quote the customer a coverage and price that does not apply to their vehicle |
| **Source File** | AP-1948-cbi-cve-tesla-price-modification.md — Then, item 1 |
| **Recommended Test Types** | Functional · Negative · Edge-case · UI |

**Acceptance Criteria:**

1. "The program terms are filtered by vehicle model Category (Category A,B or C)" — when the customer selects the warranty term on the customer portal (quoted from the ticket).

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The capture does not say which vehicle models are in Category A, B or C, nor where a model's category or a term's category is set. Without that, a tester cannot say which terms *should* be listed for a given vehicle (Q-001) | High | Ask the author for the model → category mapping and the admin screen where it is configured; keep the filter cases BLOCKED until answered |
| The Client portal flow (how the vehicle is chosen, where the term selector is) is not mapped in any knowledge source, and the only known link is customer 1493's page | Medium | The test-case designer must create the route steps from live exploration and write them back to `qa-docs` per the mapping guide |
| No behaviour is stated for a vehicle whose category has no program term (Q-004) | Low | Record what the build shows; do not judge it |

---

### REQ-002 — Term price equals the program term's suggested retail price

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. The Given / When / Then reads: when the customer selects the warranty term, the price shown is the price set on the program term as **suggested retail price** |
| **Priority** | High — a wrong price is shown directly to the end customer and is the purpose of the ticket ("Price modification") |
| **Source File** | AP-1948-cbi-cve-tesla-price-modification.md — Then, item 2 |
| **Recommended Test Types** | Functional · Edge-case · Regression · UI |

**Acceptance Criteria:**

1. "The price should be the pricing set in the program term > **suggested retail price**" (quoted from the ticket). Observable as: the price the Client portal shows for a selected term equals the value in that term's *suggested retail price* field in the admin area.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The admin screen holding the program term's *suggested retail price* is not mapped in `qa-docs` (39 of 49 admin routes are unmapped). Ken Nguyen's comment only says "You can add program terms in the admin area" | Medium | Locate the field during design or execution and write the route back to `qa-docs` |
| Display format of the price (currency sign position, decimals, taxes included or not) is not stated (Q-005) | Low | Compare the amount only; record the format without judging it |
| Changing a term's suggested retail price on the shared staging environment affects every other tester and quote | Medium | Prefer reading existing values over editing them; if a value is changed, restore it in a cleanup step |

---

### REQ-003 — Tesla pricing figures from the "Original ask"

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket |
| **Priority** | Medium — the figures are kept under "Original ask" below the acceptance block, so their standing is unclear; if they still apply, a wrong figure is a wrong customer price |
| **Source File** | AP-1948-cbi-cve-tesla-price-modification.md — "Original ask" section |
| **Recommended Test Types** | Functional · Regression · UI |

**Acceptance Criteria:**

1. "Make and Model pricing of Tesla vehicles 3, S, Y and X  have the same pricing schematic 2500$, 2600$, 2700$, 2800$ and 2900$ respectively for the terms" (quoted).
2. "Model 3 or Model Y are selected - add additional 200$ on the price" (quoted).
3. "Model S or X are selected - add additional 800$ on the price" (quoted).

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket presents these figures as the "Original ask" beneath the current Given / When / Then, which instead says the price comes from the program term's suggested retail price. It is not stated whether the figures still apply or were replaced (Q-002) | High | Ask the author; keep REQ-003 cases BLOCKED until answered |
| "respectively for the terms" does not name the five terms (lengths in months / kilometres) the five figures belong to, and does not say whether the +200$ / +800$ is added on top of the term price or built into the configured suggested retail price (Q-002) | High | Same question; no expected price can be written without it |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Terms filtered by model Category | ✓ | ✓ | ✓ | | ✓ | | | |
| REQ-002 — Price = term's suggested retail price | ✓ | | ✓ | ✓ | ✓ | | | |
| REQ-003 — Tesla figures (original ask) | ✓ | | | ✓ | ✓ | | | |

**Legend:** ✓ = recommended based on requirement content

**Data entities touched:** customer record (customer 1493, the only known Client portal link) · customer's vehicle (make, model, model category) · warranty program terms (category, term, suggested retail price — admin configuration) · the customer's quote request created on the Client portal.

---

## Open Questions

Points the requirement leaves unsettled. **Impact** says what each one does to testing:
*Blocking* — an acceptance criterion cannot be judged until it is answered, so its test
cases stay BLOCKED and the story cannot be released; *Judgement* — the main result is
testable, and the test records what the build does on this point instead of guessing;
*Info* — no test result depends on it. Classification test: SKILL.md Step 3b.

| # | Question | Raised against | Impact | Status | Answer (quoted, with source) | Assigned to |
|---|---|---|---|---|---|---|
| Q-001 | Which vehicle models belong to Category A, B and C, and where (which admin screen and field) are a vehicle model's category and a program term's category set? Without this, the list of terms that *should* appear for a given vehicle cannot be written. | REQ-001 | Blocking | Open | — | Ken Nguyen (asked 2026-11-03, comment 19457; was Eric Lindquist) |
| Q-002 | Do the "Original ask" figures still apply — Tesla 3 / S / Y / X at 2500$, 2600$, 2700$, 2800$, 2900$ "respectively for the terms", plus 200$ (Model 3 / Y) or 800$ (Model S / X) — or were they replaced by the price configured as the program term's suggested retail price? If they apply, which term does each figure belong to, and is the surcharge added on top of the term price? | REQ-003 | Blocking | Open | — | Ken Nguyen (asked 2026-11-03, comment 19457; was Eric Lindquist) |
| Q-003 | Does the category filter and suggested-retail pricing apply to every make, or only to Tesla (the ticket title says "Tesla", the acceptance block does not)? And what do "CBI" and "CVE" in the title refer to — two programs this applies to? | REQ-001, REQ-002 | Judgement | Open | — | Eric Lindquist (reporter) |
| Q-004 | What should the customer portal show when no program term exists for the vehicle model's category (empty list, message, or all terms)? | REQ-001 | Judgement | Open | — | Eric Lindquist (reporter) |
| Q-005 | How should the price be displayed — currency format, decimals, and whether taxes are included? | REQ-002 | Judgement | Open | — | Eric Lindquist (reporter) |
| Q-006 | Should the price shown update when the customer changes the selected term (no page reload), and is the selected term's price carried into the submitted quote request? | REQ-002 | Judgement | Open | — | Eric Lindquist (reporter) |
| Q-007 | What does the attached screenshot (Screenshot 2024-03-13 at 1.02.28 PM.png) show? It is embedded under item 2 and was listed, not read, at intake. | REQ-002 | Info | Open | — | QA (read the attachment) |
| Q-008 | Ken Nguyen's comment of 2024-04-03 ends mid-sentence ("You can add program terms in the admin area and play with the"). Was more guidance intended? | REQ-001, REQ-002 | Info | Open | — | Ken Nguyen |
| Q-009 | Eric Lindquist's comment of 2024-04-03 says "Yes.  It works  ( live )  with the correct pricing.   Awesome". It confirms the reporter accepted the live behaviour but does not state what the correct prices are, so it answers none of Q-001 – Q-006. Is there a record of the prices he checked? | REQ-002, REQ-003 | Info | Open | — | Eric Lindquist (reporter) |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-001 | Model → category mapping and the term ↔ category link are not stated (Q-001) | High | Open |
| REQ-003 | Unclear whether the original-ask figures still apply, and to which terms (Q-002) | High | Open |
| REQ-001 | Client portal flow is not mapped in any knowledge source; only customer 1493's link is known | Medium | Open |
| REQ-002 | Admin location of the term's *suggested retail price* is not mapped | Medium | Open |
| REQ-002 | Editing term prices on shared staging affects other users; restore any change | Medium | Open |
| REQ-001 | No empty-category behaviour stated (Q-004) | Low | Open |
| REQ-002 | Price display format not stated (Q-005) | Low | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design — REQ-002 yes; REQ-001 and REQ-003 wait on Q-001 and Q-002
