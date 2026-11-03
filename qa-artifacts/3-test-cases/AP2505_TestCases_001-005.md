# Test Cases — AP2505 (File 1 of 2)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2505 — Generate contract for a quote's Roadside protection product
**Source:** requirements/AP-2505-generate-contract-for-a-quotes-roadside.md · qa-artifacts/1-requirements-analysis/AP-2505_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2505_test-plan.md
**Date:** 2026-11-03
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2505_001 to AP2505_005 (5 test cases)
**Coverage:** Functional · Edge-case · UI · Negative

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Once this section is
complete the executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Environment** | **Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, dealer login page `/login` (registry `execution_env: Dev`) | `env` (Dev Environment section) |
| **Login** | The shared dealer account (dealer 1380, "Test QA staging") in the `env` source's Dev section. Read the login and password there at run time; type them only into the login form; never write them into the log | `env` |
| **Entry route** | New inventory vehicle `/vehicle/{vehicleId}/details` → **Create quote** header action (the `fromVehicleId` entry) → client form → `/quote/{id}/details`, the quote page. Never the bare `/quote` entry, which leaves a quote with no vehicle that returns HTTP 500. The page under test is `/quote/{id}/road-side-protection-create-contract` | `navigation` → `domain` (quote-creation.md) |
| **Where the action is** | `/quote/{id}/details` → right-hand card **"Summary of products"** → **Roadside Protection** row → **⋯** dropdown: **Edit** · **Generate Contract** · **Delete** (shown once a roadside product is saved without a contract). Before AP-2505, on Dev, "Generate Contract" opened a modal that stayed on "Loading..." | `domain` (quote-creation.md, Dev 2026-11-02) |
| **Model page** | The Esthetic protection contract page `/quote/{id}/permaplate-create-contract` ("Esthetic protection Contract": sections "Vehicle identification", "Owner information", "Program Summary", button "Generate Contract"). Used only to record differences (Q-003), never to judge | `domain` (quote-creation.md) |
| **Viewport** | 1280 × 800 | registry `admin_viewport` |
| **Language** | EN for every judgement. `?_locale=en` on any dealer URL switches the session to English; switch back to the language found at the start when the run ends | `domain` (quote-creation.md) |
| **Known bugs** | **AP-2518** (High, open) — on Dev the page under test returned HTTP 500 (French "Erreur — Désolé, l'application éprouve des difficultés techniques") and the ⋯ dialog stayed on "Loading...". **AP-2508** (High, open) — the roadside product form has no contract fields or contract button. AP-2518 split (same in both files and the test plan): opening the page is the **step under test** in **AP2505_001 step 3**, **AP2505_002 step 4** and **AP2505_010 step 3** — a 500 there is a **FAIL** (Gate C compares it with AP-2518). In **AP2505_006 step 3** it is a FAIL only when the 500 is specific to the missing financing (rule in that case). Everywhere else — **AP2505_003 – AP2505_005 step 2** in this file, AP2505_007 – AP2505_009 step 2 in file 2 — opening the page is **setup**: a 500 makes the case **BLOCKED — AP-2518**. A roadside product that cannot be saved makes any case **BLOCKED — AP-2508** | tracker; `domain` |
| **Not to be used** | Vehicle 915 (its VIN already has AutoShield contracts 2697, 2698 and AP-2518 was reproduced on it); vehicles 1106–1118 and quotes 6514–6526 (AP-2498); quotes 6479–6483 (AP-2494); any record of another ticket. Never pick a record by "newest" | `test-data`; `domain` |
| **Leaves behind** | Quote A (AP2505_001, reused unsubmitted by _003 – _005) and quote B (AP2505_002), each with its own vehicle, client, financing and roadside product (quote A also a GAP quote, no GAP contract). **Fallback quotes:** when quote A cannot be reused, AP2505_003, _004 and _005 each build their own quote (`{NNN}` = `003`, `004`, `005`, last names `Owner2505-003` / `-004` / `-005`), each with its own vehicle, client, financing, GAP quote (no GAP contract) and roadside product — up to three more quotes. Any VIN may carry the +100 change (`…505{NNN+100}`). No case in this file submits the page, so no roadside contract or invoice is created here. The `cleanup` source is missing — nothing is removed. Record every vehicle id, VIN, quote id and client email in the execution log | `cleanup` (missing) |

**Shared build values — vehicle (one per quote).** Open `/vehicle/new/edit/PASSENGER?_locale=en`
("Add a vehicle") and enter: VIN `2T1BURHE0NC505{NNN}` where `{NNN}` is the case number
given in the case (e.g. `…505001`), Brand `Toyota` (wait for Model to reload), Model
`Corolla`, Year `2022`, Vehicle Price `20000`, Kilometers `15000`, Condition "used", Fuel
type "GASOLINE", Transmission "Automatic", Cylinders `4`, Engine size `1.8`, Engine size
unit "Litre", Designation "Particular" → **Save**. The browser lands on
`/vehicle/{vehicleId}/details` with "Vehicle saved"; record the vehicle id. If the VIN is
refused as already used, add 100 to `{NNN}` (e.g. `…505101`), record it, and continue.

**Shared build values — client and quote.** On `/vehicle/{vehicleId}/details` click
**Create quote**, then enter: First name `Roadside`, Last name as given in the case, Email
`client.stage.2505{NNN}@yopmail.com` (`{NNN}` as above), Address `300 Rue Test`, City
`Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550501`, Work phone
`5145550502`, "I agree to the policy" ticked → **Save**. The browser lands on
`/quote/{id}/details`; record the quote id. Then at `/quote/{id}/vehicle` keep the
attached vehicle, Delivered at = **the run date** (recorded as `RUN_DATE`), Price `20000`
→ **Save**.

**Shared build values — financing.** Open `/quote/{id}/financing` and enter: Date of birth
`1985-06-15`, Province "Québec", Type "Financing", Net amount financed `25000`, Residual
`0`, Payment frequency "Monthly", Term months `60`, Interest rate `6.99`, Financing company
"AutoCapital Canada" → **Save**. Expected: back on `/quote/{id}/details` with "Financing
saved".

**Shared build values — GAP insurance quote.** On the quote page click the "+" on the **Gap
Insurance** row (or open `/quote/{id}/gap-insurance`), wait for "Gap Insurance Quote", and
enter: Rate table "TGGAP", Language "English", Tax exempt "No", Gap Term `60` → **Get
Quote**. Expected: "GAP insurance quote saved successfully"; the Gap Insurance row shows a
premium and no contract number. Do not generate a GAP contract.

**Shared build values — roadside product.** On the quote page click the red "+" on the
**Roadside Protection** row; in the modal choose Make `Toyota`, Model `Corolla`, Year
`2022` (VIN pre-filled from the vehicle — leave it) → **Continue**; under "Product info"
select the **first** tier radio and enter Policy Sale price `250` → **Save**. Expected: the
Roadside Protection row shows the product and a "⋯" menu; record the tier label and the
amount the row shows. If no tier is offered, record the alert text and mark the case
BLOCKED ("no AutoShield tier for Toyota Corolla 2022 on Dev"); if the product cannot be
saved, mark it **BLOCKED — AP-2508**.

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| Missing fact | Affects | Question | Status set |
|---|---|---|---|
| Which column holds the "Vehicle identification" section — left (description) or right (AC 2) | AP2505_004 | Q-001 (Blocking — unanswered; posted on AP-2505 on 2026-11-03) | BLOCKED |

> One case ships BLOCKED (AP2505_004). The other four are `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2505_001 | On a quote with a GAP quote and a roadside product, "Generate Contract" opens the roadside contract page in the same tab, not a pop-up | Functional | High | FAIL |
| AP2505_002 | On a quote with a roadside product but no GAP quote, the roadside contract page still opens as a full page at its address | Edge-case | Medium | FAIL |
| AP2505_003 | The roadside contract page shows owner and financing on the left, and Program Summary with "Generate Contract" on the right | UI | Medium | BLOCKED |
| AP2505_004 | The roadside contract page shows "Vehicle identification" in the column the author confirms | UI | Medium | BLOCKED |
| AP2505_005 | The roadside contract page is pre-filled with the quote's vehicle, client and financing, and the financing cannot be changed | Functional | High | BLOCKED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Revisions

| Date | TC ID | Change | Why |
|---|---|---|---|
| — | — | — | First version |
| 2026-11-03 | AP2505_001 | Step 3: the same-tab check is the tab count only; where browser Back leads is recorded, not judged | Review R2 round 1, F-2 — the ticket never states where Back leads |
| 2026-11-03 | AP2505_005 | Step 3: at least one financing value must be shown and each shown must equal the entered value; whether "AutoCapital Canada" is shown is recorded only. "Why this matters" aligned | Review R2 round 1, F-1 — Q-007 leaves open which financing values are shown |
| 2026-11-03 | — (Execution Context) | "Known bugs": AP-2518 split stated per case and step (FAIL: 001 step 3, 002 step 4, 010 step 3, 006 step 3 only if specific to no financing; BLOCKED: 003–005 and 007–009 step 2), identical in both files and the test plan | Review R2 round 1, F-3 |
| 2026-11-03 | — (Execution Context) | "Leaves behind": adds the fallback quotes of AP2505_003–005 and the +100 VIN change | Review R2 round 1, F-6 |
| 2026-11-03 | AP2505_003, AP2505_004, AP2505_005 | Test Data: quote A is reused only when its Roadside Protection row shows the saved product with a "⋯" menu and no contract; otherwise the case builds its own quote | Review R2 round 1, F-7 |

---

## Test Cases

---

### AP2505_001 — On a quote with a GAP quote and a roadside product, "Generate Contract" opens the roadside contract page in the same tab, not a pop-up

| Field | Value |
|---|---|
| **TC ID** | AP2505_001 |
| **Title** | On a quote with a GAP quote and a roadside product, "Generate Contract" opens the roadside contract page in the same tab, not a pop-up |
| **Requirement** | AP2505 — REQ-001: AC 1 "Given a quote with a GAP insurance quote and no contract, when the dealer chooses “Generate Contract” from the Roadside protectection row actions, then /quote/{quoteId}/road-side-protection-create-contract opens in the same tab with no modal." Description: "open a dedicated page (no modal)" and "The route … stays the same." |
| **Route** | `/quote/{id}/details` → Roadside Protection row → ⋯ → "Generate Contract" → `/quote/{id}/road-side-protection-create-contract` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-03 — Environment: Dev — execution-log_AP-2505_2026-11-03.md |
| **Result** | FAIL at step 3 — ⋯ → Generate Contract opened a pop-up stuck on "Loading..." and the page GET returned HTTP 500 (quote 6568); step 4 typed address also HTTP 500. Compare with AP-2518 at Gate C |

**Why this matters:** This is the whole point of the story: the action must open a full
page in the same tab, not a pop-up. The quote is built exactly as AC 1 states it — with a
GAP insurance quote and no contract — plus the roadside product the action belongs to; the
no-GAP case is AP2505_002 (Q-002). Opening the page is the **step under test** here, so an
HTTP 500 at step 3 is a FAIL, compared with AP-2518 at Gate C. The address fallback is
**not** allowed in step 3 — the case exists to prove the action itself. Quote A is reused,
unsubmitted, by AP2505_003 – _005.

**Test Data:**

| Variable | Value |
|---|---|
| `{NNN}` | `001` — VIN `2T1BURHE0NC505001`, email `client.stage.2505001@yopmail.com` |
| Client last name | `Owner2505-001` |
| Quote products | Financing (AutoCapital Canada, 25000, 60 months), GAP quote (TGGAP, 60), roadside product (first tier, Policy Sale price 250) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`). Build the vehicle (`{NNN}` = `001`), then the client and quote (last name `Owner2505-001`) and the vehicle step (Delivered at `RUN_DATE`, Price `20000`) with the shared build values | `/quote/{id}/details` shows the quote with client `Roadside Owner2505-001`; vehicle id, VIN and quote id (quote A) are recorded |
| 2 | [Pre-Condition] Add the financing, then the GAP insurance quote, then the roadside product, each with the shared build values; return to `/quote/{id}/details`. Record the number of open browser tabs | "Financing saved", "GAP insurance quote saved successfully"; the Roadside Protection row shows the product with a "⋯" menu and no contract number; tier label and amount recorded. A product that cannot be saved → BLOCKED — AP-2508 |
| 3 | On the Roadside Protection row open the **⋯** menu and click **Generate Contract**. Before doing anything else, inspect the page the action opened and count the tabs (take a screenshot of this state). Then press browser Back once and note the address it leads to | The browser navigates to `/quote/{id}/road-side-protection-create-contract` with quote A's id (the address bar changes) and the page loads — no error page, no HTTP 5xx, no dialog left on "Loading...". It opened **in the same tab**: the tab count equals step 2's (the tab count is the only same-tab check). It is a full page: no modal dialog is open and the quote page is not visible behind or around it; a "Program Summary" section and a "Generate Contract" button are on it. Record the page heading, and record without judging the address browser Back led to (the ticket does not state it) |
| 4 | Open `/quote/{id}/details` again, then type `/quote/{id}/road-side-protection-create-contract` into the address bar and press Enter | The contract page loads directly from the address, without an error page or HTTP 5xx |
| 5 | [Verification] Inspect the page loaded from the address in step 4 | The address is exactly `/quote/{id}/road-side-protection-create-contract` with quote A's id — the route is unchanged; the page is the same full page seen in step 3 — no modal dialog, "Program Summary" and "Generate Contract" present. Leave without submitting |

---

### AP2505_002 — On a quote with a roadside product but no GAP quote, the roadside contract page still opens as a full page at its address

| Field | Value |
|---|---|
| **TC ID** | AP2505_002 |
| **Title** | On a quote with a roadside product but no GAP quote, the roadside contract page still opens as a full page at its address |
| **Requirement** | AP2505 — REQ-001: description "The “Generate Contract” action for Roadside Protection product on the dealer quote should match Esthetic Protection: open a dedicated page (no modal)" — the description names no GAP quote. Whether the action needs a GAP quote is open as Q-002 (Judgement) |
| **Route** | `/quote/{id}/details` → Roadside Protection row → ⋯ → `/quote/{id}/road-side-protection-create-contract` |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-03 — Environment: Dev — execution-log_AP-2505_2026-11-03.md |
| **Result** | FAIL at step 4 — same pop-up and HTTP 500 (quote 6569); step 3 recorded: Generate Contract is offered without a GAP quote (Q-002) |

**Why this matters:** AC 1 starts from "a quote with a GAP insurance quote", but a dealer
can sell roadside protection without GAP. Whether the action is offered without a GAP
quote is not stated (Q-002), so the menu is recorded, not judged. Once the page is
reached, it must still be a working full page — the description's statement does not
depend on GAP. Opening the page is the step under test (step 4): an HTTP 500 there is a
FAIL, compared with AP-2518 at Gate C.

**Test Data:**

| Variable | Value |
|---|---|
| `{NNN}` | `002` — VIN `2T1BURHE0NC505002`, email `client.stage.2505002@yopmail.com` |
| Client last name | `Owner2505-002` |
| Quote products | Financing and roadside product (shared values); **no GAP quote** |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`). Build the vehicle (`{NNN}` = `002`), the client and quote (last name `Owner2505-002`) and the vehicle step with the shared build values | `/quote/{id}/details` shows the quote; vehicle id, VIN and quote id (quote B) recorded |
| 2 | [Pre-Condition] Add the financing and the roadside product with the shared build values — **do not** add a GAP quote | The Gap Insurance row shows "- None Selected -"; the Roadside Protection row shows the product with a "⋯" menu. A product that cannot be saved → BLOCKED — AP-2508 |
| 3 | On the Roadside Protection row open the **⋯** menu | Record the menu items and whether "Generate Contract" is offered without a GAP quote (Q-002) |
| 4 | If "Generate Contract" is offered, click it; otherwise type `/quote/{id}/road-side-protection-create-contract` into the address bar and press Enter. Record which was used | The browser shows `/quote/{id}/road-side-protection-create-contract` with quote B's id; the page loads without an error page or HTTP 5xx and no dialog is left on "Loading...". If the page refuses the quote with a message instead, record the message (Q-002) and mark step 5 not applicable — this is not a fault |
| 5 | [Verification] Inspect the page | A full page: no modal dialog, the quote page not visible behind it, "Program Summary" and a "Generate Contract" button present. Record whether it opened in the same tab. Leave without submitting |

---

### AP2505_003 — The roadside contract page shows owner and financing on the left, and Program Summary with "Generate Contract" on the right

| Field | Value |
|---|---|
| **TC ID** | AP2505_003 |
| **Title** | The roadside contract page shows owner and financing on the left, and Program Summary with "Generate Contract" on the right |
| **Requirement** | AP2505 — REQ-002: AC 2 "it shows the “Owner information”, “Financing information” in the left column, and “Vehicle identification”, “Program Summary” with a “Generate Contract” button in a right column." Description: "a two-column card — vehicle and owner information on the left, Program Summary and the “Generate Contract” button on the right." Only the points both sources agree on, or that only AC 2 states, are judged; the vehicle section's column is AP2505_004 (Q-001) |
| **Route** | `/quote/{id}/road-side-protection-create-contract` |
| **Type** | UI |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | — |
| **Executed on** | 2026-11-03 — Environment: Dev — execution-log_AP-2505_2026-11-03.md |
| **Result** | BLOCKED — AP-2518: contract page HTTP 500 at setup step 2 (quote A 6568) |

**Why this matters:** The layout is the visible point of the story. Owner information on
the left and the Program Summary with the button on the right are stated in both places;
Financing information on the left is stated only in AC 2 and contradicts nothing. The
vehicle section is placed differently by the two sources, so its column is only recorded
here. What the Program Summary lists for a roadside product is not stated (Q-004), so its
lines are recorded. Opening the page is setup here: an HTTP 500 makes this case BLOCKED —
AP-2518.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote A from AP2505_001 only when it exists, its Roadside Protection row shows the saved roadside product with a "⋯" menu, and it has no roadside contract; otherwise (no quote A, product not saved — e.g. AP2505_001 BLOCKED — AP-2508 — or a contract present) build a new quote exactly as AP2505_001 steps 1–2 with `{NNN}` = `003` and last name `Owner2505-003`, and record it as this case's own quote |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`). Use quote A, or build the quote as described in Test Data (vehicle, client, quote, vehicle step, financing, GAP quote, roadside product with the shared build values) | The quote's Roadside Protection row shows the product with a "⋯" menu and no contract number |
| 2 | [Pre-Condition] Open `/quote/{id}/road-side-protection-create-contract` (from the ⋯ menu → Generate Contract, or by the address) | The page loads. HTTP 500 or an error page → BLOCKED — AP-2518 |
| 3 | [Verification] Inspect the page at 1280 × 800: find the headings "Owner information", "Financing information", "Program Summary" and the "Generate Contract" button, and note which of two side-by-side columns each sits in | The content is laid out in two side-by-side columns. **Left column:** "Owner information" and "Financing information". **Right column:** "Program Summary" and, with it, the "Generate Contract" button. A heading that is missing, or sits in the other column, fails the step |
| 4 | [Verification] Record the rest of the page | Record, without judging: the column and position of "Vehicle identification" (Q-001); the page heading; every line the Program Summary lists — e.g. program, tier, term, start date, end date, price, total (Q-004); any section or control not named above, and any visible difference from the Esthetic protection contract page described in the Execution Context (Q-003). Leave without submitting |

---

### AP2505_004 — The roadside contract page shows "Vehicle identification" in the column the author confirms

| Field | Value |
|---|---|
| **TC ID** | AP2505_004 |
| **Title** | The roadside contract page shows "Vehicle identification" in the column the author confirms |
| **Requirement** | AP2505 — REQ-002: description "vehicle and owner information on the left" versus AC 2 "“Vehicle identification”, “Program Summary” with a “Generate Contract” button in a right column" |
| **Route** | `/quote/{id}/road-side-protection-create-contract` |
| **Type** | UI |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Q-001 (Blocking — unanswered) |
| **Executed on** | 2026-11-03 — Environment: Dev — execution-log_AP-2505_2026-11-03.md |
| **Result** | BLOCKED — Q-001 (Blocking, unanswered); not attempted |

**Why this matters:** The two sources contradict each other on the vehicle section's
column, so no result can be judged until the author answers Q-001 (posted on AP-2505 on
2026-11-03). The steps are written so the case runs as soon as the answer arrives; the
disputed expected result stays `Not known — Q-001`. Once runnable, opening the page is
setup: an HTTP 500 makes the case BLOCKED — AP-2518.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote A from AP2505_001 only when it exists, its Roadside Protection row shows the saved roadside product with a "⋯" menu, and it has no roadside contract; otherwise (no quote A, product not saved — e.g. AP2505_001 BLOCKED — AP-2508 — or a contract present) build a new quote exactly as AP2505_001 steps 1–2 with `{NNN}` = `004` and last name `Owner2505-004`, and record it as this case's own quote |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`). Use quote A, or build the quote as described in Test Data | The quote's Roadside Protection row shows the product with a "⋯" menu and no contract number |
| 2 | [Pre-Condition] Open `/quote/{id}/road-side-protection-create-contract` | The page loads. HTTP 500 or an error page → BLOCKED — AP-2518 |
| 3 | [Verification] At 1280 × 800, find the "Vehicle identification" heading and note which of the two side-by-side columns it sits in, and its order relative to the other sections of that column | Not known — Q-001. The section is present with its vehicle fields; its column must match the author's answer |

---

### AP2505_005 — The roadside contract page is pre-filled with the quote's vehicle, client and financing, and the financing cannot be changed

| Field | Value |
|---|---|
| **TC ID** | AP2505_005 |
| **Title** | The roadside contract page is pre-filled with the quote's vehicle, client and financing, and the financing cannot be changed |
| **Requirement** | AP2505 — REQ-003: AC 3 "Given the quote has a vehicle, a client, or a financing, when the page renders, then vehicle client and financing values are pre-filled and financing is read-only" |
| **Route** | `/quote/{id}/road-side-protection-create-contract` |
| **Type** | Functional · Negative |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | — |
| **Executed on** | 2026-11-03 — Environment: Dev — execution-log_AP-2505_2026-11-03.md |
| **Result** | BLOCKED — AP-2518: contract page HTTP 500 at setup step 2 (quote A 6568) |

**Why this matters:** A wrong VIN, client name or lender on the page goes straight onto
the AutoShield contract. Every value is compared with what the case itself entered when it
built the quote, so "pre-filled" is judged on known values only. Which financing values
the page shows is not stated (Q-007), so at least one must be shown, each one shown is
compared, and the list (including whether the financing company is shown) is recorded; AC 3 does state that the financing is read-only, so every financing value shown
must refuse a change. Which vehicle and owner fields are editable is not stated (Q-005) —
recorded only. Formatting differences are not faults: province `Québec` or `QC`, postal
code with or without the space, phones as the same digits in any format, make/model in any
letter case, kilometres with or without a separator. Opening the page is setup: an HTTP
500 makes the case BLOCKED — AP-2518.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote A from AP2505_001 only when it exists, its Roadside Protection row shows the saved roadside product with a "⋯" menu, and it has no roadside contract; otherwise (no quote A, product not saved — e.g. AP2505_001 BLOCKED — AP-2508 — or a contract present) build a new quote exactly as AP2505_001 steps 1–2 with `{NNN}` = `005` and last name `Owner2505-005`, and record it as this case's own quote |
| Expected vehicle | VIN `2T1BURHE0NC505{NNN}` (as recorded), Toyota, Corolla, 2022, 15000 km, delivery date `RUN_DATE` |
| Expected owner | Roadside / `Owner2505-{NNN}`, `300 Rue Test`, Montréal, Québec, H2X 1Y4, `client.stage.2505{NNN}@yopmail.com`, 5145550501, 5145550502 |
| Expected financing | AutoCapital Canada; Financing; 25000; residual 0; Monthly; 60 months; 6.99 % |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`). Use quote A, or build the quote as described in Test Data | The quote's Roadside Protection row shows the product with a "⋯" menu and no contract number |
| 2 | [Pre-Condition] Open `/quote/{id}/road-side-protection-create-contract` | The page loads. HTTP 500 or an error page → BLOCKED — AP-2518 |
| 3 | [Verification] Read every field of the vehicle, owner and financing sections and compare it with Expected vehicle, Expected owner and Expected financing | Every vehicle field shown holds the expected vehicle value, every owner field shown holds the expected owner value, and at least one financing value is shown, and every financing value shown equals the expected financing value (formatting tolerance above). No financing value shown at all, a field that is empty while its value was entered, or a value different from the one entered fails the step. Which financing values are shown is not stated (Q-007): record the list, including whether the financing company "AutoCapital Canada" is shown — its absence alone does not fail the step and the editability of each vehicle and owner field (Q-005) |
| 4 | Try to change each financing value shown: click into it and type `X`, or pick another option if it is a drop-down | Record, per financing value, whether the click or typing had any effect |
| 5 | [Verification] Inspect every financing value after step 4 | Every financing value is read-only: it is shown as text or a disabled/read-only control, and it still holds the expected value. A financing value that accepted the change fails the step. Leave without submitting (do not submit a changed value) |
