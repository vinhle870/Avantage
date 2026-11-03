# Test Cases — AP2428 (File 3 of 4)

**Project:** Avantage Plus v2 — AP-2428 Dealer Permaplate Contract
**Requirement:** AP2428 — Negative and edge cases on the contract form, and stored contract values (REQ-001, REQ-002, REQ-003, REQ-006, REQ-008)
**Source:** `requirements/AP-2428-dealer-permaplate-contract.md` · `qa-artifacts/1-requirements-analysis/AP-2428_requirements-analysis.md` · `qa-artifacts/2-test-plan/AP-2428_test-plan.md`
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**Revisions:** 2026-11-02 — s4 worker: the clear-text login and password in the Execution Context **Login** row were replaced with a reference to the `env` source (credential policy). No step or expected result changed.
**TC Range:** AP2428_011 to AP2428_014 (4 test cases)
**Coverage:** Negative · Edge-case · Regression

---

## Execution Context

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer; Admin for AP2428_014 steps 2 and 4 | `navigation` |
| **Entry route** | `/vehicle/915/details` → Create quote → `/quote/{id}/details` → create-contract control. Dealer contract list `/permaplate-contracts` ("Esthetic protection contracts": VIN · Client name · Client phone · Contract cost price · Actions). Admin Permaplate catalogue `/admin/permaplate` → `/admin/permaplate/{id}/details` → option form `/admin/permaplate/{termId}/option/{optionId}/edit` (field "Dealer Cost") | `navigation`, `domain` (quote-creation.md) for the vehicle 915 entry and quote hub; `/admin/permaplate/{termId}/option/{optionId}/edit` and its "Dealer Cost" field: `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` (not in `navigation` / `domain`) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Dealer `/login` and Admin `/admin/login`, both the shared QA account from the `env` source (login and password are read from there at run time and never copied into this file) | `env` |
| **Test data** | Vehicle 915 — Ford Focus 2008, VIN `1FAHP35NX8W239204`, 5000 km. The Permaplate option Dealer Cost changed by AP2428_014 is **Configuration** and is restored in the same case | `test-data` |
| **Language** | EN | `domain` |
| **Leaves behind** | AP2428_011 and AP2428_012 each create a client, a quote and (if submission succeeds) a Permaplate contract with its invoice. AP2428_014 leaves no change: the Dealer Cost is restored | `cleanup` (missing — recorded here) |

**Known blockers:** None.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2428_011 | Submitting the contract form with Last name and VIN cleared does not crash or lose data silently | Negative | Medium | PASS |
| AP2428_012 | An address edited on the contract form does not crash, and where the edited value ends up is recorded | Edge-case | Medium | FAIL |
| AP2428_013 | A quote whose contract was already generated does not crash when the create-contract control is looked for | Edge-case | Medium | PASS |
| AP2428_014 | An existing contract keeps its cost price after an administrator changes the option's Dealer Cost | Regression | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2428_011 — Submitting the contract form with Last name and VIN cleared does not crash or lose data silently

| Field | Value |
|---|---|
| **TC ID** | AP2428_011 |
| **Title** | Submitting the contract form with Last name and VIN cleared does not crash or lose data silently |
| **Requirement** | AP2428 — REQ-002, REQ-003, REQ-006 (validation record-only for Q-006) |
| **Route** | `/quote/{id}/details` → Create contract |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md` |
| **Result** | PASS — blank Last name and VIN refused with "This value should not be blank."; no contract |

**Why this matters:** The ticket states no validation for the form (Q-006). A contract
without an owner name or VIN cannot identify what it protects. The case records how the
build handles it and fails only on a server error.

**Test Data:**

| Variable | Value |
|---|---|
| Client email | `client.stage.NNN@yopmail.com` — next unused NNN, record it |
| First name / Last name | `Vide` / `Champs2428` |
| Address / City / Province / Postal code | `789 boul. René-Lévesque` / `Montréal` / `Québec` / `H3B 1X9` |
| Tel. home / Tel. work | `5145550300` / `5145550301` |
| Delivery date / Price | `2026-11-01` / `20000` |
| Permaplate selection | The first product and every enabled option |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form with the Test Data values, tick the policy-agreement box → **Save** | `/quote/{id}/details` loads for `Vide Champs2428`; quote id recorded |
| 2 | [Pre-Condition] At `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; at `/quote/{id}/permaplate` select the first product, tick every enabled option → **Save**; then click the create-contract control on `/quote/{id}/details` | The contract form opens |
| 3 | Clear the "Last name" and "VIN" fields and click **Generate Contract** | The response is recorded: any validation message word for word, or the page landed on |
| 4 | [Verification] Verify no error page or HTTP 5xx appeared, and if a contract was generated, record what its PDF shows for owner last name and VIN | No server error. Record whether the form refused the blank fields or generated a contract, for Q-006 |

---

### AP2428_012 — An address edited on the contract form does not crash, and where the edited value ends up is recorded

| Field | Value |
|---|---|
| **TC ID** | AP2428_012 |
| **Title** | An address edited on the contract form does not crash, and where the edited value ends up is recorded |
| **Requirement** | AP2428 — REQ-003, REQ-006 (persistence of edits record-only for Q-006) |
| **Route** | `/quote/{id}/details` → Create contract |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md` |
| **Result** | FAIL — contract generated but its PDF download returns HTTP 500 (same cause as AP2428_010) |

**Why this matters:** The form exists "to confirm the selection and other details", so a
dealer may correct an address there. The ticket does not say whether the correction goes
onto the contract, the client record, or both (Q-006). The case records it.

**Test Data:**

| Variable | Value |
|---|---|
| Client email | `client.stage.NNN@yopmail.com` — next unused NNN, record it |
| First name / Last name | `Adresse` / `Modifiee2428` |
| Original address / City / Province / Postal code | `10 rue Ontario Est` / `Montréal` / `Québec` / `H2X 1G8` |
| Edited address on the contract form | `99 avenue du Parc` |
| Tel. home / Tel. work | `5145550400` / `5145550401` |
| Delivery date / Price | `2026-11-01` / `20000` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form with the Test Data values (original address), tick the policy-agreement box → **Save** | `/quote/{id}/details` loads for `Adresse Modifiee2428`; quote id recorded |
| 2 | [Pre-Condition] At `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; at `/quote/{id}/permaplate` select the first product, tick every enabled option → **Save**; click the create-contract control | The contract form opens with Address = `10 rue Ontario Est` |
| 3 | Replace Address with `99 avenue du Parc` and click **Generate Contract** | The response is recorded; no error page |
| 4 | Download the contract PDF from `/quote/{id}/details` and record the address it shows; open `/quote/{id}/client` and record the client's address | Both addresses recorded |
| 5 | [Verification] Verify no error page appeared and the PDF address is one of the two values entered (`99 avenue du Parc` or `10 rue Ontario Est`) | No server error, and no address nobody entered. Record which address the PDF and the client record carry, for Q-006 |

---

### AP2428_013 — A quote whose contract was already generated does not crash when the create-contract control is looked for

| Field | Value |
|---|---|
| **TC ID** | AP2428_013 |
| **Title** | A quote whose contract was already generated does not crash when the create-contract control is looked for |
| **Requirement** | AP2428 — REQ-001 (behaviour after generation record-only for Q-005) |
| **Route** | `/quote/{id}/details` |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md` |
| **Result** | PASS — no second-contract control; direct URL redirects to quote details |

**Why this matters:** If the control is still offered after a contract exists, a dealer
could create and be billed for a second contract on the same sale. The ticket does not say
what should happen (Q-005), so this case records it **without submitting a second time**,
to avoid leaving a duplicate contract and invoice on staging.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | "AP2428 quote A" with the contract generated in AP2428_009. If AP2428_009 did not generate one, this case is BLOCKED by that result |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and open "AP2428 quote A" at `/quote/{id}/details` | The page shows the contract download button from AP2428_009 |
| 2 | Record every control on the quote details page and on `/quote/{id}/permaplate` that creates a contract or edits the Permaplate selection | Controls recorded |
| 3 | If a create-contract control is still offered, open it (do **not** click Generate Contract) and record the page; otherwise open `/quote/{id}/permaplate-create-contract` directly and record the response | Response recorded |
| 4 | [Verification] Verify no step showed an error page or HTTP 5xx | No server error. Record whether a second contract can be started, for Q-005 |

---

### AP2428_014 — An existing contract keeps its cost price after an administrator changes the option's Dealer Cost

| Field | Value |
|---|---|
| **TC ID** | AP2428_014 |
| **Title** | An existing contract keeps its cost price after an administrator changes the option's Dealer Cost |
| **Requirement** | AP2428 — REQ-008 (comment by Ken Nguyen, 2026-08-06: "Using joins can create issues if the admin changes the values in the backend and will cascade all the existing contracts") |
| **Route** | `/permaplate-contracts` (dealer) · `/admin/permaplate/{termId}/option/{optionId}/edit` (admin) |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md` |
| **Result** | PASS — contract cost price stayed 225.00$ after Dealer Cost +10.00; restored to 80.00 |

**Why this matters:** The reporter asked for each contract to keep its own copy of option
values and prices, so that a later admin price change does not rewrite contracts already
sold. The dealer contract list's "Contract cost price" is the visible place to check it.
The admin change is shared configuration, so it is restored in the same case.

**Test Data:**

| Variable | Value |
|---|---|
| Contract | The contract generated in AP2428_009 for `Perma Contrat2428`, VIN `1FAHP35NX8W239204`. If AP2428_009 did not generate a contract, this case is BLOCKED by that result |
| Option to change | The first option recorded in AP2428_001 step 3 |
| Temporary Dealer Cost | Original value + `10.00` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/permaplate-contracts`, find the row for `Perma Contrat2428` with VIN `1FAHP35NX8W239204`, record its Contract cost price; download its PDF and record the option names it shows | Cost price and option names recorded |
| 2 | [Pre-Condition] Sign in to the Admin portal, open `/admin/permaplate`, open the term holding the option from the Test Data, open that option's edit form, record its "Dealer Cost", set it to original + `10.00` → **Save** | The option's Dealer Cost now shows the new value; the original is recorded |
| 3 | In the Dealer portal reload `/permaplate-contracts` and record the same row's Contract cost price; download the PDF again and record its option names | Values recorded |
| 4 | In the Admin portal set the option's "Dealer Cost" back to the original value → **Save** | The option shows its original Dealer Cost again |
| 5 | [Verification] Verify the Contract cost price and option names from step 3 equal those from step 1, and the option's Dealer Cost equals the original | The existing contract did not change when the option price changed, and the option is restored. A cost price that moved by 10.00 is a FAIL |
