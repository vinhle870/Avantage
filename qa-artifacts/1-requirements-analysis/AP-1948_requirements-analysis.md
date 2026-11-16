# Requirements Analysis Report

**Project:** Avantage Plus v2 — Client portal
**Date:** 2026-11-15 (re-run of the 2026-11-01 analysis, after the answers to Q-001 and Q-003; revised 2026-11-15 08:24 UTC for R1 round 1 findings F-1–F-3: term 16 is not a CVE term, Q-010 added, Q-001 answer cell trimmed; 08:29 UTC wording fix for R1 round 2 F-1: AP1948_001/009 are REQ-002 price cases, the REQ-001 filter cases are 004–006; 09:12 UTC knowledge lookup (SKILL.md Step 3c, batch instruction 2026-11-15): Q-002, Q-004, Q-005, Q-006, Q-009, Q-010 → Accepted, Q-007 and Q-008 stay Open as not knowledge questions; 09:19 UTC R1 round 3 F-1: REQ-003 "Original ask" figures relabelled as background, the acceptance criterion is the Q-002 accepted result)
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** requirements/AP-1948-cbi-cve-tesla-price-modification.md (Jira AP-1948, Task, priority High, status QC, fix version 1.39.0), including its section "Ticket changes since capture — 2026-11-15"
**Total requirements found:** 3
**related_docs:** qa-artifacts/qa-docs/client-portal-quote-request.md (Client portal quote request, mapped on Dev 2026-11-01) · qa-artifacts/qa-docs/admin-portal.md (program term edit page `/admin/program-term/{id}/edit`, mapped on Dev 2026-11-01). The admin screen that holds a **vehicle model's** "category" field was mapped at execution on 2026-11-15 (`/admin/vehicle-model` → `/admin/vehicle-model-edit/{id}/edit`, qa-docs/admin-portal.md, Dev).

---

## Executive Summary

AP-1948 changes how the Client portal (the no-login, per-customer quote-request page at
`/customer/{id}/quote-request`, reached from the authorised distributor "CBI" website)
offers warranty terms and prices. The ticket's Given / When / Then block gives two
acceptance statements: the program terms offered are filtered by the vehicle model's
Category (A, B or C), and the price shown is the "suggested retail price" set on the
program term. Below a horizontal rule, the ticket keeps an "Original ask" with fixed Tesla
prices (2500$ to 2900$) and model surcharges (+200$ for Model 3 / Y, +800$ for Model S / X).

**What changed since 2026-11-01.** Two answers arrived on the ticket:

- **Q-001 is answered** by Ken Nguyen (comment 19545, 2026-11-09): "each model has a field
  called ‘category’ which can be configured to be part of a category. you can change it in
  the admin and test it based on the cateogry configured for your model". The category is
  therefore a setting on each vehicle model, and the expected list of terms is written from
  the category configured for the test vehicle's model — not from a fixed list of models.
  Eric Lindquist adds that "Tesla had been categorized into A and B" (comment 19544).
  REQ-001 is now testable.
- **Q-003 is answered** by Eric Lindquist, the reporter (comment 19544, 2026-11-08): "This
  program applied to Tesla and other BEV vehicles" (BEV = battery electric vehicle), and it
  "had been applied when the client selected the program thru the CBI website ( the
  autorised distributor )". The change is therefore not limited to Tesla: any BEV model
  with a configured category is in scope, and "CBI" is the distributor's website through
  which the Client portal is reached.

**Fact from the author (F-1) — the CVE program is disabled.** In the same comment Eric
Lindquist writes: "please be aware that I disabled the program at the beginning of the
month due to issues with the loss retention of those vehicles … the CVE program will no
longer be available in the market until further notice". This is a statement of fact by
the reporter, not a change to the acceptance criteria. What it means for the test scope:

1. **The acceptance criteria do not change.** Neither statement in the Then block names
   CVE; they apply to whatever program terms the Client portal offers. REQ-001 and REQ-002
   are judged on the active program terms offered on Dev, whichever program they belong to.
2. **CVE terms may legitimately be missing on Dev.** The comment says the program was
   disabled "at the beginning of the month" (November 2026) and is not available "in the
   market"; it does not say on which environment. On 2026-11-01 Dev still offered the CVE
   terms, program term ids 122–126 (e.g. term 122 "CVE CVE A 12m/0km", 2700, category A,
   fuel type BEV). Program term 16 is **not** a CVE term: it is "L'Avantageuse AT
   36m/60000km" (suggested retail price 1025, categories A, B, C), and the CVE shutdown does
   not affect it. Of the cases run on 2026-11-01, only AP1948_002 (its second term, 122)
   depends on a CVE term; AP1948_001 and AP1948_009 use term 16. So at execution the tester
   first records whether the CVE program is active on Dev. If CVE terms are not offered,
   that is the expected effect of the author's action and is **not a FAIL**.
3. **No test re-enables the CVE program.** The reporter switched it off on purpose for a
   business reason; turning it back on, even on Dev, would test a configuration the
   business has withdrawn and would change shared data other tickets read. A case that
   needs a CVE term while the program is disabled is BLOCKED "test data not on Dev: CVE
   program active". A case that only needs *some* active term for a category uses another
   active program term offered for that category; if none is offered, it is BLOCKED the
   same way.
4. **REQ-003 is unaffected in status.** The "Original ask" Tesla figures belong to the CVE
   program, but nobody has said they are withdrawn. The note does not answer Q-002; the
   2026-11-15 knowledge lookup closed it as Accepted (see Open Questions).

**Knowledge lookup (2026-11-15, 09:12 UTC).** Every open question about product
knowledge was searched in Jira Story and Task tickets (SKILL.md Step 3c; queries in
"Knowledge lookup — queries tried" below). No Story or Task defines any of them, so each
is **Accepted**: the build's current actual result, as recorded in today's execution log,
is the expected result. For Q-002 that means the Client portal price of a Tesla term is
the term's suggested retail price, with no fixed Tesla figure and no +200$ / +800$ added —
the same result the ticket's current Then item 2 states, and what AP1948_002 observed for
the Model Y (term 122, CA$2,700.00 = 2700). Accepted questions are never posted to Jira.

This leaves the question classification as: no **Blocking** question open (Q-001
Answered; Q-002 Accepted); one **Judgement** question answered (Q-003) and four Accepted
(Q-004, Q-005, Q-006, Q-010); one **Info** question Accepted (Q-009) and two Open that are
not knowledge questions (Q-007, the attachment's content; Q-008, a comment author's
intent) and change no test result. The CVE note raises no question: it leaves no
requirement undecidable, because the acceptance statements do not depend on which program
is active. Q-010 (whether eligibility settings other than category also filter the term
list) was raised in this re-run from a point previously logged only as a REQ-001 risk; it
is now Accepted. Overall testability is rated **MEDIUM-HIGH** (up from MEDIUM): REQ-001
and REQ-002 can be judged, REQ-003 can now be judged against the accepted result (Tesla
term price = the term's suggested retail price, nothing added), and the vehicle model's
category field was mapped at execution (`/admin/vehicle-model`). The ticket was released in 1.39.0 in April 2024
and the reporter said on 2024-04-03 that it "works ( live ) with the correct pricing", so
this run is in practice a regression check of live behaviour.

---

## Requirements Detail

### REQ-001 — Program terms filtered by vehicle model Category

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. The Given / When / Then reads: a customer user on the customer portal selects the warranty term, and the program terms are filtered by vehicle model Category |
| **Priority** | High — the ticket is High priority, and offering a term from the wrong category would quote the customer a coverage and price that does not apply to their vehicle |
| **Source File** | AP-1948-cbi-cve-tesla-price-modification.md — Then, item 1; answers in "Ticket changes since capture — 2026-11-15" (comments 19545, 19544) |
| **Recommended Test Types** | Functional · Negative · Edge-case · UI |

**Acceptance Criteria:**

1. "The program terms are filtered by vehicle model Category (Category A,B or C)" — when the customer selects the warranty term on the customer portal (quoted from the ticket).
   Clarified by Q-001: the category is "a field called ‘category’" on each vehicle model, "configured" in the admin area, and the test is "based on the cateogry configured for your model" (Ken Nguyen, comment 19545). Observable as: for a vehicle whose model is configured with category X, the Client portal's term list contains no program term whose eligibility categories (the "Category A–E" checkboxes on `/admin/program-term/{id}/edit`) exclude X; changing the model's category in the admin changes which terms are offered.
   QA's reading (not part of the answer): the term side of the match is the "Category A–E" eligibility checkboxes on `/admin/program-term/{id}/edit`, because qa-docs/admin-portal.md shows no other category setting on a program term. Ken Nguyen's answer covers only the model's field; the checkboxes were shown to him in 19524 and he did not comment on them.

**Out of Scope:**

- None stated. (Comment 19544 places non-Tesla BEV models in scope — see Q-003.)

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The admin screen and field that hold a vehicle model's "category" are not mapped in any knowledge source. Ken Nguyen says only that it is "in the admin". Without the screen, the tester cannot read or set the test vehicle's category, so the expected term list cannot be built | Medium | Locate the vehicle model's category field during design or execution and write the route back to `qa-docs` (admin-portal.md) as a dated Dev entry. If it cannot be found, the filter cases are BLOCKED "test data not on Dev: model category field not found" — never guessed |
| Changing a model's category is a change to shared reference data on Dev and affects every quote for that model | Medium | Prefer a model whose configured category already gives the needed case; if a case changes the category, it records the original value and restores it in the same case, as AP1948_009 does for the term price |
| A term can also be limited by fuel type, vehicle type, eligibility years and kilometres. On 2026-11-01, term 16 (categories A, B, C; fuel types gasoline and diesel only) was offered for a 2022 Tesla Model 3, although comment 19544 says the program applied to BEV vehicles. The ticket does not say whether those other eligibility settings must also filter the list (Q-010, Accepted 2026-11-15: no Story/Task defines it for the Client portal; fuel type does not filter the list today) | Low | Judge the category rule: a term whose categories exclude the model's category is a FAIL. A term offered despite its fuel type is the accepted current behaviour, not a FAIL. A term with a matching category that is missing is recorded |
| The CVE program was disabled by the reporter in early November 2026 (fact F-1). If it is disabled on Dev, the CVE terms (ids 122–126) are not offered. The non-CVE term 16 "L'Avantageuse AT 36m/60000km" (categories A, B, C) is unaffected; the REQ-002 price cases AP1948_001 and AP1948_009 use it. The REQ-001 filter cases are AP1948_004–006, and they must not depend on a CVE term: on 2026-11-01 the only active term with a narrower category set was CVE term 122 (category A only) | Low | Record the CVE program's state at the start of execution. Use any active term for the category; do not re-enable CVE. If no active term excludes the test vehicle's category, a filter case changes the model's category in the admin and restores it in the same case (risk row 2), or is BLOCKED "test data not on Dev". With no active term for a needed category, BLOCK the case "test data not on Dev: active program term for category X" |
| No behaviour is stated for a vehicle whose category has no program term (Q-004, Accepted 2026-11-15) | Low | Expect the accepted current result: an empty "Select Coverage" list with no message; Continue answers "This value is not valid.". An error page or HTTP 5xx is still a FAIL |

---

### REQ-002 — Term price equals the program term's suggested retail price

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. The Given / When / Then reads: when the customer selects the warranty term, the price shown is the price set on the program term as **suggested retail price** |
| **Priority** | High — a wrong price is shown directly to the end customer and is the purpose of the ticket ("Price modification") |
| **Source File** | AP-1948-cbi-cve-tesla-price-modification.md — Then, item 2 |
| **Recommended Test Types** | Functional · Edge-case · Regression · UI |

**Acceptance Criteria:**

1. "The price should be the pricing set in the program term > **suggested retail price**" (quoted from the ticket). Observable as: the price the Client portal shows for a selected term (the Summary page "Subtotal") equals the value in that term's "Suggested retail price" field on `/admin/program-term/{id}/edit`. Comment 19544 ("the direct pricing in the program pricing") is consistent with this and does not change it.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The CVE program may be disabled on Dev (fact F-1). Of the cases that passed on 2026-11-01, only AP1948_002 used a CVE term (its second term, 122, 2700$); AP1948_001 and AP1948_009 used the non-CVE term 16 "L'Avantageuse AT 36m/60000km" (1025$), which F-1 does not affect | Low | Run the price check on any active term offered for the test vehicle; a CVE term that is no longer offered is not a FAIL. Only the CVE-term part of AP1948_002 may be BLOCKED "test data not on Dev: CVE program active". If no term is offered at all, BLOCK "test data not on Dev: active program term" |
| Display format of the price (currency sign position, decimals, taxes included or not) is not stated (Q-005, Accepted 2026-11-15). On 2026-11-01 and 2026-11-15 the price appeared on the Summary page as "CA$1,025.00" labelled Subtotal, before GST and PST | Low | Compare the amount; the accepted format is "CA$" + thousands comma + 2 decimals, Subtotal before taxes |
| Whether the price updates live and is carried into the submitted request is not stated (Q-006, Accepted 2026-11-15) | Low | Expect the accepted current result: a term change reloads the page and the Subtotal follows the new term; what the submitted request keeps is recorded at execution. A price shown back that differs from the selection is still a FAIL |
| Changing a term's suggested retail price on shared Dev affects every other tester and quote | Medium | Prefer reading existing values; if a value is changed, restore it in the same case and confirm the restore |

---

### REQ-003 — Tesla pricing figures from the "Original ask"

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket |
| **Priority** | Medium — the figures are kept under "Original ask" below the acceptance block, so their standing is unclear; if they still apply, a wrong figure is a wrong customer price |
| **Source File** | AP-1948-cbi-cve-tesla-price-modification.md — "Original ask" section |
| **Recommended Test Types** | Functional · Regression · UI |

**Acceptance Criteria** (from Q-002 Accepted, 2026-11-15 — the current actual result):

1. On the Client portal, the price of every term offered for a Tesla model (Model 3, Y, S, X) equals that term's admin suggested retail price, with no fixed Tesla figure and no model surcharge added.

**Background — not acceptance criteria.** The ticket's "Original ask" keeps these figures
below the acceptance block. Q-002 was Accepted on 2026-11-15 (no Story or Task defines
them), so no test case expects them; they are quoted here for reference only:

- "Make and Model pricing of Tesla vehicles 3, S, Y and X  have the same pricing schematic 2500$, 2600$, 2700$, 2800$ and 2900$ respectively for the terms" (quoted).
- "Model 3 or Model Y are selected - add additional 200$ on the price" (quoted).
- "Model S or X are selected - add additional 800$ on the price" (quoted).

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket presents these figures as the "Original ask" beneath the current Given / When / Then, which instead says the price comes from the program term's suggested retail price. Nobody on the ticket said whether the figures still apply (Q-002, asked in 19432, 19457 and 19524). The 2026-11-15 knowledge lookup found no Story or Task that defines them, so Q-002 is **Accepted**: the expected result is the current actual one — a Tesla term's price is its suggested retail price, nothing added (observed: Model Y term 122 CA$2,700.00 = 2700) | Medium (was High) | Redesign AP1948_007 (Model 3 / Y) and AP1948_008 (Model S / X) to check that the portal price of each offered term equals its admin suggested retail price with no +200$ / +800$ added. A difference is a FAIL only when it is an objective fault or contradicts Then item 2 |
| "respectively for the terms" does not name the five terms the five figures belong to, and does not say whether the +200$ / +800$ is added on top of the term price (Q-002) | Low (was High) | Closed by the same acceptance: no fixed figure and no surcharge is expected |
| The CVE program, whose terms carried the original figures, was disabled by the reporter in early November 2026 (fact F-1); on Dev on 2026-11-15 the CVE terms 122–126 still tick only Category A, and Model S / X are Category B, so a Model S / X may be offered only term 16 | Medium | REQ-003 is now judged on whatever terms are offered: check price = suggested retail price on every offered term and record which terms appear. A CVE term missing for a Category B model follows the category rule and is not a FAIL. BLOCK "test data not on Dev: no term offered" only when no term is offered. Never re-enable CVE |

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

**Data entities touched:** customer record (customer 1493, the only known Client portal link) · vehicle model reference data (make, model, the model's configurable "category" field) · warranty programs (CVE and any other active program; the program's enabled / disabled state) · program terms (eligibility categories A–E, fuel type and vehicle type eligibility, suggested retail price — admin configuration) · the customer's quote request created on the Client portal.

---

## Open Questions

Points the requirement leaves unsettled. **Impact** says what each one does to testing:
*Blocking* — an acceptance criterion cannot be judged until it is answered, so its test
cases stay BLOCKED and the story cannot be released; *Judgement* — the main result is
testable, and the test records what the build does on this point instead of guessing;
*Info* — no test result depends on it. Classification test: SKILL.md Step 3b.

| # | Question | Raised against | Impact | Status | Answer (quoted, with source) | Assigned to |
|---|---|---|---|---|---|---|
| Q-001 | Which vehicle models belong to Category A, B and C, and where (which admin screen and field) are a vehicle model's category and a program term's category set? Without this, the list of terms that *should* appear for a given vehicle cannot be written. | REQ-001 | Blocking | Answered | "each model has a field called ‘category’ which can be configured to be part of a category. you can change it in the admin and test it based on the cateogry configured for your model" — ticket comment 19545 by Ken Nguyen, 2026-11-09. Supported by "Tesla had been categorized into A and B" — comment 19544 by Eric Lindquist, 2026-11-08. | Ken Nguyen (answered 19545) |
| Q-002 | Do the "Original ask" figures still apply — Tesla 3 / S / Y / X at 2500$, 2600$, 2700$, 2800$, 2900$ "respectively for the terms", plus 200$ (Model 3 / Y) or 800$ (Model S / X) — or were they replaced by the price configured as the program term's suggested retail price? If they apply, which term does each figure belong to, and is the surcharge added on top of the term price? | REQ-003 | Blocking | Accepted | No Story/Task defines it (searched: `issuetype in (Story, Task) AND text ~ "Tesla price Model 2500"`, `… "Tesla Model S X surcharge"`, `… "CVE Tesla pricing"`, `… "Tesla Model Y additional"` — only AP-1948 itself; AP-1685, AP-2310, AP-2311 read, none states the Tesla figures or a model surcharge) — current actual result accepted: the Client portal price for a Tesla term is that term's suggested retail price, with no fixed Tesla figure and no +200$ / +800$ added. Observed 2026-11-15 (execution-log_AP-1948_2026-11-15.md, AP1948_002): 2023 TESLA Model Y, term 122 Subtotal CA$2,700.00 = suggested retail price 2700 (no +200$); AP1948_001: 2022 TESLA Model 3, term 16 Subtotal CA$1,025.00 = 1025. Consistent with the ticket's current Then item 2. Model S / X not observed — recorded at execution. Not posted. | Ken Nguyen (asked 19432 / 19457 / 19524; closed by knowledge lookup 2026-11-15) |
| Q-003 | Does the category filter and suggested-retail pricing apply to every make, or only to Tesla (the ticket title says "Tesla", the acceptance block does not)? And what do "CBI" and "CVE" in the title refer to — two programs this applies to? | REQ-001, REQ-002 | Judgement | Answered | "This program applied to Tesla and other BEV vehicles. … This had been applied when the client selected the program thru the CBI website ( the autorised distributor )" — ticket comment 19544 by Eric Lindquist, 2026-11-08. CVE is "the CVE program" (same comment). | Eric Lindquist (answered 19544) |
| Q-004 | What should the customer portal show when no program term exists for the vehicle model's category (empty list, message, or all terms)? | REQ-001 | Judgement | Accepted | No Story/Task defines it (searched: `issuetype in (Story, Task) AND text ~ "program term category empty"` — no result; `… "no program term available"`, `… "no eligible program message"`, `… "customer portal program terms"` — AP-42, AP-257, AP-530, AP-810, AP-72 and Client portal stories AP-1554, AP-1685, AP-2083, AP-2233, AP-2377, AP-2311 read, none states the empty-category display) — current actual result accepted. Observed 2026-11-15 (AP1948_005, AP1948_006): "Select Coverage — Please choose the program" with no term card and no message; Continue returns `/program` with HTTP 422 and "ERROR This value is not valid." (a form validation response, not an error page). Not posted. | — (closed by knowledge lookup 2026-11-15) |
| Q-005 | How should the price be displayed — currency format, decimals, and whether taxes are included? | REQ-002 | Judgement | Accepted | No Story/Task defines it (searched: `issuetype in (Story, Task) AND text ~ "suggested retail price"` — AP-1749, AP-2082, AP-1684 read: AP-1749 defines the field and the DYR `suggestedPrice`, not the portal display; `… "price taxes subtotal currency"`, `… "quote request summary subtotal"` — only AP-1948, AP-2496) — current actual result accepted. Observed 2026-11-15 (AP1948_001, AP1948_003): Summary shows Subtotal "CA$1,025.00" (currency prefix, thousands comma, 2 decimals) before taxes, then GST CA$51.25, PST CA$102.24 and Total CA$1,178.49. Not posted. | — (closed by knowledge lookup 2026-11-15) |
| Q-006 | Should the price shown update when the customer changes the selected term (no page reload), and is the selected term's price carried into the submitted quote request? | REQ-002 | Judgement | Accepted | No Story/Task defines it (searched: `issuetype in (Story, Task) AND text ~ "quote request selected term price"` — AP-2405, AP-1948; `… "warranty term price update"` — AP-2499, AP-1684, AP-80; `… "client portal warranty term"` — AP-2445, AP-2377; none states it) — current actual result accepted. Observed 2026-11-15: changing the term is a full page POST and reload, and the Summary Subtotal follows the new term (AP1948_002: CA$1,025.00 then CA$2,700.00); the Stripe sandbox checkout shows the Summary Total CA$1,178.49 and "TESLA", not the term (AP1948_003). Whether the submitted request keeps the term is recorded at execution (AP1948_003 is blocked at the card page). Not posted. | — (closed by knowledge lookup 2026-11-15) |
| Q-007 | What does the attached screenshot (Screenshot 2024-03-13 at 1.02.28 PM.png) show? It is embedded under item 2 and was listed, not read, at intake. | REQ-002 | Info | Open | — Not a knowledge question (it asks what a file attached to this ticket shows), so the Step 3c lookup does not apply; QA can close it by reading the attachment. No test result depends on it | QA (read the attachment) |
| Q-008 | Ken Nguyen's comment of 2024-04-03 ends mid-sentence ("You can add program terms in the admin area and play with the"). Was more guidance intended? | REQ-001, REQ-002 | Info | Open | — Not a knowledge question (it asks what a comment's author meant to write), so the Step 3c lookup does not apply. Comment 19545 gives the category guidance; no test result depends on it | Ken Nguyen |
| Q-009 | Eric Lindquist's comment of 2024-04-03 says "Yes.  It works  ( live )  with the correct pricing.   Awesome". It confirms the reporter accepted the live behaviour but does not state what the correct prices are. Is there a record of the prices he checked? | REQ-002, REQ-003 | Info | Accepted | No Story/Task records them (searched: the Q-002 queries above — only AP-1948; AP-1685's comment of 2024-01-23 "Once the 500$ modification on Tesla S and X are modified then we can release it" mentions a Tesla S / X change but states no price list) — current actual result accepted: the prices the build shows are the term prices recorded at execution (see Q-002). Not posted. | — (closed by knowledge lookup 2026-11-15) |
| Q-010 | Besides the vehicle model's category, must the term list also be filtered by the program term's other eligibility settings — fuel type, vehicle type, eligibility years and kilometres? On 2026-11-01 term 16 (fuel types gasoline and diesel only) was offered for a 2022 Tesla Model 3, while comment 19544 says the program applied to BEV vehicles. | REQ-001 | Judgement | Accepted | No Story/Task defines it for the Client portal (searched: `issuetype in (Story, Task) AND text ~ "program term fuel type eligibility"` — AP-257, AP-350, AP-1925; `… "vehicle type eligibility filter terms"` — AP-533; `… "vehicle model category"` — AP-42, AP-45, AP-1564, AP-1013; also AP-530). AP-257 (comment by Ken Nguyen, 2020) states "When I am creating a warranty, the list of program terms should be available if ALL of the following conditions are met: … fuel type eligibility contains the vehicle fuel type", and AP-530 adds vehicle type — both under the **Dealer portal** heading, written before the Client portal existed (AP-1554, 2022); neither names the Client portal, so they do not define it — current actual result accepted. Observed 2026-11-15 (AP1948_004 step 5): term 16 (GASOLINE, DIESEL) is offered for the BEV 2022 TESLA Model 3 — fuel type does not filter the Client portal list. Not posted. | — (closed by knowledge lookup 2026-11-15) |

### Knowledge lookup — queries tried (2026-11-15, 09:09–09:12 UTC)

Run under SKILL.md Step 3c with the Jira adapter's knowledge-lookup query
`issuetype in (Story, Task) AND text ~ "<words>"`, any status. Nothing was posted to Jira.

| # | Word sets tried | Hits read | Defining sentence? | Status |
|---|---|---|---|---|
| Q-002 | "Tesla price Model 2500" · "Tesla Model S X surcharge" · "CVE Tesla pricing" · "Tesla Model Y additional" | Only AP-1948 matched; related reads AP-1685, AP-2310, AP-2311 | None — AP-1685 mentions "the 500$ modification on Tesla S and X" without a price rule; AP-2310 and AP-2311 define configurable surcharges (MSRP), not Tesla figures | Accepted |
| Q-004 | "program term category empty" (0 hits) · "no program term available" · "no eligible program message" · "customer portal program terms" | AP-42, AP-257, AP-530, AP-810, AP-72, AP-1554, AP-1685, AP-2083, AP-2233, AP-2311, AP-2377 | None | Accepted |
| Q-005 | "suggested retail price" · "price taxes subtotal currency" · "quote request summary subtotal" | AP-1749, AP-2082, AP-1684, AP-2496 | None — AP-1749 defines the admin field and the DYR `suggestedPrice`, not the portal display | Accepted |
| Q-006 | "quote request selected term price" · "warranty term price update" · "client portal warranty term" · "customer portal quote request" | AP-2405, AP-2499, AP-1684, AP-80, AP-2445, AP-2377, AP-1554, AP-1685, AP-2083, AP-2233 | None | Accepted |
| Q-009 | The Q-002 word sets | AP-1685 | None | Accepted |
| Q-010 | "program term fuel type eligibility" · "vehicle type eligibility filter terms" · "vehicle model category" · "BEV program terms" | AP-257, AP-350, AP-1925, AP-533, AP-530, AP-42, AP-45, AP-1564, AP-1013 | Dealer portal only (AP-257, AP-530) — not the Client portal | Accepted |
| Q-007, Q-008 | Not run — not knowledge questions (an attachment's content; a comment author's intent) | — | — | Open (Info) |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-003 | Unclear whether the original-ask figures still apply, and to which terms (Q-002) | High | Closed — Q-002 Accepted by knowledge lookup 2026-11-15 (term price = suggested retail price, nothing added) |
| REQ-001, REQ-002 | The CVE program was disabled by the reporter in early November 2026 (fact F-1); the CVE terms (ids 122–126) may not be offered on Dev. Only AP1948_002 (term 122) depends on one; AP1948_001 and AP1948_009 use the non-CVE term 16 "L'Avantageuse AT 36m/60000km" (categories A–C), which is unaffected | Low | Open |
| REQ-001 | Model → category mapping and where it is set (Q-001) | High | Closed — answered in 19545 |
| REQ-001 | Admin screen holding the vehicle model's "category" field is not mapped | Medium | Closed — mapped at execution 2026-11-15 (`/admin/vehicle-model`, qa-docs/admin-portal.md) |
| REQ-001 | Changing a model's category edits shared Dev reference data; restore any change | Medium | Open |
| REQ-002 | Editing term prices on shared Dev affects other users; restore any change | Medium | Open |
| REQ-003 | CVE program disabled — Tesla CVE terms may be absent; Model S / X (Category B) are not offered the Category-A-only CVE terms | Low | Open — cases check every offered term and BLOCK only when none is offered |
| REQ-001 | Client portal flow not mapped | Medium | Closed — mapped in qa-docs/client-portal-quote-request.md (2026-11-01) |
| REQ-002 | Admin location of the term's suggested retail price not mapped | Medium | Closed — mapped in qa-docs/admin-portal.md (2026-11-01) |
| REQ-001 | Other eligibility settings (fuel type, vehicle type) may also filter terms; not stated (Q-010) | Low | Closed — Q-010 Accepted 2026-11-15 (fuel type does not filter the Client portal list) |
| REQ-001 | No empty-category behaviour stated (Q-004) | Low | Closed — Q-004 Accepted 2026-11-15 (empty list, no message; Continue gives "This value is not valid.") |
| REQ-002 | Price display format and live update not stated (Q-005, Q-006) | Low | Closed — Q-005 and Q-006 Accepted 2026-11-15 ("CA$1,025.00" Subtotal before GST/PST; full page reload on term change) |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [x] Ready to proceed to Test Plan Design — REQ-001, REQ-002 and REQ-003 (REQ-003 against the Q-002 accepted result, 2026-11-15)
