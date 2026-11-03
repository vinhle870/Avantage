# Test Cases — AP1948 (File 2 of 2)

**Project:** Avantage Plus v2 — Client portal
**Requirement:** AP1948 — CBI / CVE Tesla Price modification (Jira AP-1948)
**Source:** requirements/AP-1948-cbi-cve-tesla-price-modification.md · qa-artifacts/1-requirements-analysis/AP-1948_requirements-analysis.md · qa-artifacts/2-test-plan/AP-1948_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP1948_006 to AP1948_009 (4 test cases)
**Coverage:** Edge-case · Functional · Regression
**Revision 2026-11-01:** AP1948_009 added — promoted from AP1948_ReviewFindings_2026-11-01.md Pass 2 #1 (High) by Gate B rule B2. File renamed from `AP1948_TestCases_006-008.md`.
**Revision 2026-11-01 (review R2 independent, F-3/F-4):** AP1948_009 step 2 no longer labelled `[Pre-Condition]` — it holds the price change under test. Vehicle-entry fallback added to the Execution Context.

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Client portal (no login) for the terms and price shown to the customer; Admin portal only to read program-term configuration | `navigation` §1 |
| **Entry route** | `https://v2staging.garantieavantageplus.ca/customer/1493/quote-request` — customer 1493's quote-request page. Its fields and the warranty-term selector are **not mapped** in any knowledge source (`navigation-map.md` §4); the executor records the real labels and writes them back per `qa-docs/_mapping-guide.md` | `env`, `navigation` |
| **Viewport** | 1280 × 800 | `navigation` §1 (admin/dealer value; the Client portal row gives none) |
| **Environment** | Staging (v2staging) — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Client portal: none. Admin portal: `/admin/login` with the shared admin account from `env` (`execute.env.md` → Portals → Admin Portal); the login page renders in French | `env`, `navigation` §1 |
| **Test data** | Customer 1493. No vehicle, program or program term is recorded in `test-data`; each case enters its vehicle in a `[Pre-Condition]` step | `env`, `test-data` |
| **Language** | EN as the page renders by default; not stated otherwise | `navigation` |
| **Leaves behind** | Each case may leave the entered vehicle / an unsubmitted request on customer 1493. Not known whether it can be deleted — `cleanup` is `missing`. AP1948_009 changes one program term's suggested retail price and restores it in the same case — it must leave nothing changed | `cleanup` (missing) |

**Standing facts only.** Vehicles are dynamic and are entered in each case's `[Pre-Condition]` step. Program-term configuration is read, never changed — except in AP1948_009, which records the original value, changes it, and restores it inside the same case (Configuration class, test plan §8.1).

**Navigation gap (not a blocker):** the admin screen that holds a program term's
*suggested retail price* is not mapped (`admin-portal.md`: 39 of 49 sidebar routes
unexplored). The executor finds it from the admin sidebar and records the route in the
execution log. If it cannot be found, the affected step is BLOCKED, not FAIL.

**Vehicle entry gap (not a blocker):** every Client portal step assumes the unmapped
quote-request page lets the customer enter make, model and year. If the page takes the
vehicle another way (for example a VIN, or a vehicle already loaded), the executor records
how, marks that step and the rest of the case BLOCKED ("vehicle entry differs from design"),
not FAIL, and maps the page per `qa-docs/_mapping-guide.md`.

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | Which vehicle models belong to Category A, B and C, and where a model's and a term's category are set | AP1948_006 (and AP1948_004–005 in file 1) | Open — Q-001 (Blocking), asked on AP-1948 comment 19432, 2026-11-01 |
| 2 | Whether the "Original ask" Tesla figures (2500$–2900$, +200$ / +800$) still apply, which term each figure belongs to, and whether the surcharge is added on top of the term price | AP1948_007, AP1948_008 | Open — Q-002 (Blocking), asked on AP-1948 comment 19432, 2026-11-01 |

> Every test case named in **Affects** ships with **Status: BLOCKED** and a **Blocked by**
> value — not `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP1948_006 | Vehicle whose category has no program term → page shows no wrong-category term and no error | Edge-case | Low | BLOCKED |
| AP1948_007 | Tesla Model 3 or Model Y → each term's price is the original-ask figure plus 200$ | Functional | Medium | BLOCKED |
| AP1948_008 | Tesla Model S or Model X → each term's price is the original-ask figure plus 800$ | Functional | Medium | BLOCKED |
| AP1948_009 | Admin changes a term's suggested retail price → customer portal shows the new price for that term | Functional | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP1948_006 — Vehicle whose category has no program term → page shows no wrong-category term and no error

| Field | Value |
|---|---|
| **TC ID** | AP1948_006 |
| **Title** | Vehicle whose category has no program term → page shows no wrong-category term and no error |
| **Requirement** | AP1948 — REQ-001: "The program terms are filtered by vehicle model Category (Category A,B or C)"; the empty-state display is record-only — Q-004 (Judgement) |
| **Route** | `/customer/1493/quote-request` — Client portal quote request |
| **Type** | Edge-case |
| **Priority** | Low |
| **Status** | BLOCKED |
| **Blocked by** | Q-001 (Blocking — unanswered): without the category mapping, no vehicle whose category has no term can be chosen |
| **Executed on** | 2026-11-01 — Dev (v2dev) — `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-01.md` |
| **Result** | 🚫 BLOCKED — Q-001 still unanswered (AP-1948 comment 19432) |

**Why this matters:** the ticket does not say what a customer sees when their vehicle's category has no term (Q-004). Once a suitable vehicle is known, this case judges only objective faults — an error page, or a term of another category being offered — and records the empty-state display.

**Test Data:**

| Variable | Value |
|---|---|
| Client portal link | `https://v2staging.garantieavantageplus.ca/customer/1493/quote-request` |
| Vehicle whose category has no program term | Not known — Q-001 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] In the admin area, identify a vehicle category with no program term and a make/model in that category (screen: Not known — Q-001) | Not known — Q-001 |
| 2 | [Pre-Condition] Open the Client portal link and enter that vehicle's make, model and year | The page loads without an error page |
| 3 | Continue to the warranty term choice and record what the page shows | The page's display is recorded as seen (empty list, message, or terms) |
| 4 | [Verification] Check the page for objective faults | No error page or HTTP 5xx, and no term belonging to another category is offered (judged against the step 1 list once Q-001 is answered). Record the empty-state display for Q-004 |

---

### AP1948_007 — Tesla Model 3 or Model Y → each term's price is the original-ask figure plus 200$

| Field | Value |
|---|---|
| **TC ID** | AP1948_007 |
| **Title** | Tesla Model 3 or Model Y → each term's price is the original-ask figure plus 200$ |
| **Requirement** | AP1948 — REQ-003: "…have the same pricing schematic 2500$, 2600$, 2700$, 2800$ and 2900$ respectively for the terms" and "Model 3 or Model Y are selected - add additional 200$ on the price" |
| **Route** | `/customer/1493/quote-request` — Client portal quote request |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Q-002 (Blocking — unanswered): whether the original-ask figures still apply, which term each belongs to, and whether +200$ is added on top |
| **Executed on** | 2026-11-01 — Dev (v2dev) — `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-01.md` |
| **Result** | 🚫 BLOCKED — Q-002 still unanswered (AP-1948 comment 19432) |

**Why this matters:** if the original figures still apply, a Model 3 or Model Y customer must see them with the 200$ surcharge; a missing surcharge undercharges every such sale.

**Test Data:**

| Variable | Value |
|---|---|
| Client portal link | `https://v2staging.garantieavantageplus.ca/customer/1493/quote-request` |
| Vehicles entered | Make "Tesla", Model "Model 3", Year 2023; then Make "Tesla", Model "Model Y", Year 2023 |
| Expected price per term | Not known — Q-002 (term → figure mapping not stated) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open the Client portal link and enter the vehicle: Make "Tesla", Model "Model 3", Year 2023; continue until the warranty term choice is shown | The warranty term selector is shown |
| 2 | Select each listed term in turn and record its label and price | Every term's label and price is recorded |
| 3 | Repeat steps 1–2 with Make "Tesla", Model "Model Y", Year 2023 | Every term's label and price is recorded for the Model Y |
| 4 | [Verification] Compare each recorded price with the original-ask figure for that term plus 200$ | Not known — Q-002. Once answered: each price equals the stated figure for its term plus 200$, for both models |

---

### AP1948_008 — Tesla Model S or Model X → each term's price is the original-ask figure plus 800$

| Field | Value |
|---|---|
| **TC ID** | AP1948_008 |
| **Title** | Tesla Model S or Model X → each term's price is the original-ask figure plus 800$ |
| **Requirement** | AP1948 — REQ-003: "…have the same pricing schematic 2500$, 2600$, 2700$, 2800$ and 2900$ respectively for the terms" and "Model S or X are selected - add additional 800$ on the price" |
| **Route** | `/customer/1493/quote-request` — Client portal quote request |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Q-002 (Blocking — unanswered): whether the original-ask figures still apply, which term each belongs to, and whether +800$ is added on top |
| **Executed on** | 2026-11-01 — Dev (v2dev) — `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-01.md` |
| **Result** | 🚫 BLOCKED — Q-002 still unanswered (AP-1948 comment 19432) |

**Why this matters:** if the original figures still apply, a Model S or Model X customer must see them with the 800$ surcharge; a missing surcharge undercharges every such sale.

**Test Data:**

| Variable | Value |
|---|---|
| Client portal link | `https://v2staging.garantieavantageplus.ca/customer/1493/quote-request` |
| Vehicles entered | Make "Tesla", Model "Model S", Year 2023; then Make "Tesla", Model "Model X", Year 2023 |
| Expected price per term | Not known — Q-002 (term → figure mapping not stated) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open the Client portal link and enter the vehicle: Make "Tesla", Model "Model S", Year 2023; continue until the warranty term choice is shown | The warranty term selector is shown |
| 2 | Select each listed term in turn and record its label and price | Every term's label and price is recorded |
| 3 | Repeat steps 1–2 with Make "Tesla", Model "Model X", Year 2023 | Every term's label and price is recorded for the Model X |
| 4 | [Verification] Compare each recorded price with the original-ask figure for that term plus 800$ | Not known — Q-002. Once answered: each price equals the stated figure for its term plus 800$, for both models |

---

### AP1948_009 — Admin changes a term's suggested retail price → customer portal shows the new price for that term

| Field | Value |
|---|---|
| **TC ID** | AP1948_009 |
| **Title** | Admin changes a term's suggested retail price → customer portal shows the new price for that term |
| **Requirement** | AP1948 — REQ-002: "The price should be the pricing set in the program term > **suggested retail price**" |
| **Route** | `/customer/1493/quote-request` — Client portal quote request; admin program-term screen (route recorded at execution) |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) — `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-01.md` (re-run 15:39Z–15:45Z after review R3 F-1, vehicle 2022 TESLA Model 3 / Long Range) |
| **Result** | ✅ PASS — term 16 price 1025 → 1125 showed Subtotal CA$1,125.00 on the portal; restored to 1025 and confirmed (admin and portal) |

**Why this matters:** AP1948_001 proves the two prices match at one moment. Only a change made in admin and seen on the Client portal proves the price is *read from* the program term, as REQ-002 states, rather than fixed in code — the ticket's "Original ask" listed fixed Tesla prices. Promoted from review finding Pass 2 #1 (Gate B rule B2). The term's price is shared configuration, so this case restores it before it ends.

**Test Data:**

| Variable | Value |
|---|---|
| Client portal link | `https://v2staging.garantieavantageplus.ca/customer/1493/quote-request` |
| Vehicle entered | Make "Tesla", Model "Model 3", Year 2023 |
| Admin login | Admin Portal account from `env` |
| Changed price | The original suggested retail price + 100 (e.g. 2500 → 2600) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open the Client portal link, enter the vehicle Make "Tesla", Model "Model 3", Year 2023, select the first warranty term listed, and record its program name, term label and price | One price is shown for the selected term; label and price recorded |
| 2 | Log in at `/admin/login` with the admin account, open the same program term (record the route), record its current "suggested retail price" as the **original**, change it to original + 100 and save | The admin screen confirms the save and the field now shows original + 100 |
| 3 | Reload the Client portal link, enter the same vehicle and select the same term; record the price shown | One price is shown for the term; record it |
| 4 | In the admin program term, set "suggested retail price" back to the **original** value recorded in step 2 and save | The admin screen confirms the save and the field shows the original value |
| 5 | [Verification] Compare the step 3 price with original + 100, and the admin field with the original | The Client portal price in step 3 equals original + 100 (not the original), and the admin field shows the original value again — nothing is left changed |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — terms filtered by vehicle model Category | AP1948_004 (file 1, BLOCKED) | AP1948_005 (file 1, BLOCKED) | AP1948_006 (BLOCKED) | — |
| REQ-002 — price = term's suggested retail price | AP1948_001 (file 1), AP1948_009 | — | AP1948_002 (file 1) | AP1948_003 (file 1) |
| REQ-003 — Tesla figures, Model 3 / Y (+200$) | AP1948_007 (BLOCKED) | — | — | — |
| REQ-003 — Tesla figures, Model S / X (+800$) | AP1948_008 (BLOCKED) | — | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP1948_006 | 🚫 BLOCKED | — |
| AP1948_007 | 🚫 BLOCKED | — |
| AP1948_008 | 🚫 BLOCKED | — |
| AP1948_009 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_009-step5-AdminTerm16Restored1025_pass.png` |
