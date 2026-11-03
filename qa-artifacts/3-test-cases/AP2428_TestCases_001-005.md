# Test Cases — AP2428 (File 1 of 4)

**Project:** Avantage Plus v2 — AP-2428 Dealer Permaplate Contract
**Requirement:** AP2428 — Dealer creates a Permaplate contract from a quote (REQ-001 to REQ-003)
**Source:** `requirements/AP-2428-dealer-permaplate-contract.md` · `qa-artifacts/1-requirements-analysis/AP-2428_requirements-analysis.md` · `qa-artifacts/2-test-plan/AP-2428_test-plan.md`
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**Revisions:** 2026-11-02 — s4 worker: the clear-text login and password in the Execution Context **Login** row were replaced with a reference to the `env` source (credential policy). No step or expected result changed.
**TC Range:** AP2428_001 to AP2428_005 (5 test cases)
**Coverage:** Functional · Negative · UI

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer for every case; Admin only for the Permaplate product-link check in AP2428_001 step 1 | `navigation` |
| **Entry route** | `/vehicle/915/details` → **Create quote** (the `fromVehicleId` entry point — the bare `/quote/new/client` route returns HTTP 500 on save). The quote hub is `/quote/{id}/details`; the Permaplate stage is `/quote/{id}/permaplate`; the contract form was seen at `/quote/{id}/permaplate-create-contract` on 2026-09-06. Admin product link `/admin/dealer/1380/permaplate`, `/admin/dealer/1380/permaplate/link`, unlink `/admin/dealer/{id}/permaplate/{productId}/unlink` | `navigation` (vehicle 915 entry, quote hub, Permaplate stage); `permaplate-create-contract` and the `/admin/dealer/…/permaplate` routes: `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` (not in `navigation` / `domain`) |
| **Viewport** | 1280 × 800 | `navigation` (registry `admin_viewport`) |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Dealer portal `/login` and Admin portal `/admin/login`, both the shared QA account from the `env` source (login and password are read from there at run time and never copied into this file) (Dealer ID 1380, province QC) | `env` |
| **Test data** | Vehicle 915 — Ford Focus 2008, VIN `1FAHP35NX8W239204`, 5000 km. Dealer 1380's Permaplate product link: **Configuration**; it was left with **no product linked** after the 2026-09-06 run, current state not known | `test-data`, `domain` |
| **Language** | EN. The UI labels Permaplate as "Esthetic protection" in English; routes still say `permaplate` | `domain` |
| **Leaves behind** | Per run: one client and one quote ("AP2428 quote A") from AP2428_001, one client and one quote without Permaplate from AP2428_002. If AP2428_001 had to link a Permaplate product to dealer 1380, that link (see the note below) | `cleanup` (missing — recorded here) |

**Standing facts only.** The clients and quotes these cases need are created in their
`[Pre-Condition]` steps with every value written in the case.

**Product-link note (Configuration).** AP2428_001 step 1 records whether dealer 1380 has a
Permaplate product linked and links one if none is. That link must stay in place for the
rest of this ticket's cases (all 15 depend on it), so it is **restored by unlinking it
after the last AP-2428 case has run**, at `/admin/dealer/1380/permaplate/{productId}/unlink`,
only if step 1 had to create it. This is the one deliberate exception to "restore in the
same case", logged in the design hand-off.

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | The value the Year field should be prefilled with — the ticket says "Text field with the vehicle's model prefilled" | AP2428_004 | Open — Q-001 (Blocking), asked on AP-2428 2026-11-01 (comment 19434) |

> AP2428_004 ships **BLOCKED**. The other four are `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2428_001 | A quote with a saved Permaplate selection shows a Create contract button that opens the contract form | Functional | High | PASS |
| AP2428_002 | A quote with no Permaplate selection does not crash when the contract form is looked for or opened | Negative | Medium | PASS |
| AP2428_003 | The contract form prefills make, model, VIN, odometer and delivery date from the quote's vehicle | Functional | High | PASS |
| AP2428_004 | The contract form's Year field is prefilled with the value the ticket specifies | Functional | Medium | BLOCKED |
| AP2428_005 | The contract form prefills the owner's name, company, address, province, phones and email from the client | Functional | High | FAIL |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2428_001 — A quote with a saved Permaplate selection shows a Create contract button that opens the contract form

| Field | Value |
|---|---|
| **TC ID** | AP2428_001 |
| **Title** | A quote with a saved Permaplate selection shows a Create contract button that opens the contract form |
| **Requirement** | AP2428 — REQ-001, AC 1 and AC 2 |
| **Route** | `/vehicle/915/details` → Create quote → `/quote/{id}/details` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md` |
| **Result** | PASS — control "Generate Contract" in the quote details row menu opens the contract form |

**Why this matters:** This is the only way into the feature. The QA account reported on
2026-08-14 that no Permaplate contract was shown, and nobody replied, so this case also
tells the team whether that report still holds. It creates "AP2428 quote A", which the
later cases reuse.

**Test Data:**

| Variable | Value |
|---|---|
| Client email | `client.stage.NNN@yopmail.com` — next unused NNN, record it |
| First name / Last name | `Perma` / `Contrat2428` |
| Company | `Garage Test 2428 Inc` |
| Address / City / Province / Postal code | `123 rue Principale` / `Montréal` / `Québec` / `H2X 1Y4` |
| Tel. home / Tel. work | `5145550100` / `5145550101` |
| Delivery date on the quote's vehicle | `2026-11-01` (use the date picker if typing is refused; record the stored format) |
| Vehicle price on the quote | `20000` |
| Permaplate selection | The first product radio offered and every option that becomes enabled with it — record each name and the Cost shown |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal, open `/admin/dealer/1380/permaplate` and record the linked products. If none is linked, open `/admin/dealer/1380/permaplate/link`, link the first product offered and record its name and id | Dealer 1380 has at least one linked Permaplate product, and whether this step linked it is recorded |
| 2 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form with the Test Data values, tick the policy-agreement box and click **Save** | `/quote/{id}/details` loads with heading `#{id} - Perma Contrat2428`; the quote id is recorded as "AP2428 quote A" |
| 3 | [Pre-Condition] At `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; then at `/quote/{id}/permaplate` select the first product, tick every enabled option → **Save** | Each save completes without an error and the quote details page shows a Permaplate section naming the selected options and a Cost; names and Cost are recorded |
| 4 | On `/quote/{id}/details` and on `/quote/{id}/permaplate`, find the control that creates the contract (expected label "Create contract") and click it | A page opens without an error; its URL is recorded. Where the control was found (quote details or the Permaplate page) is recorded for Q-004 |
| 5 | [Verification] Verify the opened page is a contract form with a Vehicle information section, an Owner information section, a Program Summary section and a "Generate Contract" submit button | All three sections and the "Generate Contract" button are visible. No create-contract control anywhere on the quote, or an error page, is a FAIL |

---

### AP2428_002 — A quote with no Permaplate selection does not crash when the contract form is looked for or opened

| Field | Value |
|---|---|
| **TC ID** | AP2428_002 |
| **Title** | A quote with no Permaplate selection does not crash when the contract form is looked for or opened |
| **Requirement** | AP2428 — REQ-001, AC 1 condition "a permaplate quote exists" (record-only for Q-005) |
| **Route** | `/vehicle/915/details` → Create quote → `/quote/{id}/details` |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md` |
| **Result** | PASS — no control; direct URL redirects with "Please create a quote first" |
| **Revisions** | 2026-11-01 — reviewer R2 independent round 1 F-1: step 4 made record-only for Q-005 (fails only on an error page or HTTP 5xx; never submits) |

**Why this matters:** The ticket shows the button only "when a permaplate quote exists",
but does not say what a quote without one shows (Q-005). The case records what the build
does and fails only on an objective fault, such as a server error or a contract created
with no product.

**Test Data:**

| Variable | Value |
|---|---|
| Client email | `client.stage.NNN@yopmail.com` — next unused NNN, record it |
| First name / Last name | `Sans` / `Permaplate2428` |
| Address / City / Province / Postal code | `456 rue Saint-Denis` / `Montréal` / `Québec` / `H2J 2K6` |
| Tel. home / Tel. work | `5145550200` / `5145550201` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form with the Test Data values, tick the policy-agreement box and click **Save** | `/quote/{id}/details` loads for `Sans Permaplate2428`; the quote id is recorded. No Permaplate selection is saved on it |
| 2 | Read the quote details page and the `/quote/{id}/permaplate` page and record every control that creates a contract | The list of controls is recorded (expected: none, for Q-005) |
| 3 | Open `/quote/{id}/permaplate-create-contract` directly by URL and record the HTTP status, the page heading and any message | The response is recorded |
| 4 | [Verification] Verify no step showed an error page or HTTP 5xx. Record whether the contract form opened in step 3 and, if it did, what its Selected protection products table holds. Do **not** click Generate Contract | No error page and no HTTP 5xx in any step — anything else is a FAIL. Whether the form opened and what its products table shows are recorded only, for Q-005; neither decides PASS/FAIL |

---

### AP2428_003 — The contract form prefills make, model, VIN, odometer and delivery date from the quote's vehicle

| Field | Value |
|---|---|
| **TC ID** | AP2428_003 |
| **Title** | The contract form prefills make, model, VIN, odometer and delivery date from the quote's vehicle |
| **Requirement** | AP2428 — REQ-002, AC 1, 2, 4, 5, 6 |
| **Route** | `/quote/{id}/details` → Create contract |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md` |
| **Result** | PASS — all five values prefilled; Make, Model, Delivery date read-only (noted) |

**Why this matters:** The VIN and delivery date identify the protected vehicle and set the
contract start date. A wrong prefill puts the wrong car or the wrong dates on a legal
contract. Year is tested separately in AP2428_004 because its expected value is disputed.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | "AP2428 quote A" from AP2428_001, if it still has no contract; otherwise create one exactly as AP2428_001 steps 2–3 with the same Test Data values |
| VIN | `1FAHP35NX8W239204` |
| Odometer | `5000` km |
| Delivery date | `2026-11-01` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and open `/vehicle/915/details`; record the Make, Model, Year, VIN and mileage shown | The vehicle's values are recorded (expected VIN `1FAHP35NX8W239204`, 5000 km) |
| 2 | [Pre-Condition] Open "AP2428 quote A" at `/quote/{id}/details` and click the create-contract control found in AP2428_001 | The contract form opens with its Vehicle information section |
| 3 | Read each Vehicle information field: Make, Model, VIN, Odometer at delivery, Delivery date — record its value and whether it is an editable text field | Every value is recorded |
| 4 | [Verification] Verify Make and Model equal the values from step 1, VIN = `1FAHP35NX8W239204`, Odometer at delivery = `5000`, Delivery date = 2026-11-01 (in any date format), and each is an editable text field | All five fields are text fields prefilled with exactly these values. An empty field or a different value is a FAIL |

---

### AP2428_004 — The contract form's Year field is prefilled with the value the ticket specifies

| Field | Value |
|---|---|
| **TC ID** | AP2428_004 |
| **Title** | The contract form's Year field is prefilled with the value the ticket specifies |
| **Requirement** | AP2428 — REQ-002, AC 3 ("Text field with the vehicle's model prefilled", verbatim) |
| **Route** | `/quote/{id}/details` → Create contract |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Q-001 (Blocking — unanswered): the ticket says the Year field is prefilled with the vehicle's model |
| **Executed on** | 2026-11-02 — Dev (v2dev), `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md` |
| **Result** | BLOCKED — Q-001 unanswered; Year shows 2008 read-only (recorded only) |

**Why this matters:** The label says Year, the description says model. Taking it as the
year would be a guess. The steps are written so the case runs as soon as the author answers.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | "AP2428 quote A" from AP2428_001, if it still has no contract; otherwise create one exactly as AP2428_001 steps 2–3 |
| Vehicle 915 year / model | Read from `/vehicle/915/details` in step 1 (recorded in test data as a 2008 Ford Focus) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and open `/vehicle/915/details`; record the Year and Model shown | Year and Model recorded |
| 2 | [Pre-Condition] Open "AP2428 quote A" and click the create-contract control | The contract form opens |
| 3 | Read the Year field: its value and whether it is an editable text field | Value and field type recorded |
| 4 | [Verification] Verify the Year field is a text field prefilled with the value Q-001's answer specifies | Not known — Q-001. Until answered, record the value shown |

---

### AP2428_005 — The contract form prefills the owner's name, company, address, province, phones and email from the client

| Field | Value |
|---|---|
| **TC ID** | AP2428_005 |
| **Title** | The contract form prefills the owner's name, company, address, province, phones and email from the client |
| **Requirement** | AP2428 — REQ-003, AC 1–6 ("Information about the client pre-filled"; Phone mapping record-only for Q-007) |
| **Route** | `/quote/{id}/details` → Create contract |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md` |
| **Result** | FAIL — "Other name on file" empty although the client has a company; Province is a text box, not a dropdown |

**Why this matters:** The owner block names the person the contract protects, and the
province drives the taxes. The ticket names "phone1" and "phone2", which are not labels on
the client form, so the case only checks that both phone fields carry the client's own
numbers and records which went where (Q-007).

**Test Data:**

| Variable | Value |
|---|---|
| Quote | "AP2428 quote A" from AP2428_001, if it still has no contract; otherwise create one exactly as AP2428_001 steps 2–3 with these values |
| Last name / First name | `Contrat2428` / `Perma` |
| Other name on file (company) | `Garage Test 2428 Inc` |
| Address / City / Province / Postal code | `123 rue Principale` / `Montréal` / `Québec` / `H2X 1Y4` |
| Client phones | home `5145550100`, work `5145550101` |
| Email | the `client.stage.NNN@yopmail.com` recorded in AP2428_001 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open "AP2428 quote A" at `/quote/{id}/details` and click the create-contract control | The contract form opens with its Owner information section |
| 2 | Read every Owner information field — Last name, First name, Other name on file, Address, City, Province, Postal code, Phone (res), Phone (cell), Email — recording value and field type | Every value and type is recorded |
| 3 | Open the Province dropdown and record its options and the selected one | Options and selection recorded |
| 4 | [Verification] Verify Last name = `Contrat2428`, First name = `Perma`, Other name on file = `Garage Test 2428 Inc`, Address = `123 rue Principale`, City = `Montréal`, Province dropdown lists the Canadian provinces and territories (record the list) with `Québec` selected, Postal code = `H2X 1Y4`, Email = the recorded address; Phone (res) and Phone (cell) each hold one of `5145550100` / `5145550101` | Every field is prefilled with the client's value. An empty field, a value the client does not have, or a phone field holding neither client number is a FAIL. Record which number is in Phone (res) and which in Phone (cell) for Q-007 |
