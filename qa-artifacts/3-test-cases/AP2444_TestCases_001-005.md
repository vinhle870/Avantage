# Test Cases — AP2444 (File 1 of 1)

**Project:** Avantage Plus v2 — Permaplate feature set
**Requirement:** AP2444 — Dealer can select conditional Permaplate options (REQ-003)
**Source:** `requirements/AP-2444-permaplate-conditional-options.md`
**Date:** 2026-09-06
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2444_001 to AP2444_005 (5 test cases)
**Coverage:** Functional · Negative · Edge-case · UI

---

## Execution Context

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin for the *Parent* field, Dealer for the conditional behaviour on the quote form | `navigation` |
| **Entry route** | Dealer side: `/quote/{id}/permaplate` — the "Permaplate Quote" page. Admin side: the Permaplate option edit form, whose route is not yet mapped. | `navigation` |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Admin at `/admin/login` and Dealer at `/login`, both `vinhle870@gmail.com` / `<password from the env source>` | `env` |
| **Test data** | Dealer ID `1380`. Quote created in AP2447_003 and reused here. Vehicle `915`, VIN `1FAHP35NX8W239204`. | `test-data` |
| **Language** | English | `navigation` |
| **Leaves behind** | A saved Permaplate selection on the reused quote, and — if the *Paint* / *Extra care* parent link did not already exist — a changed Permaplate option definition, which AP2444_002 restores. | `cleanup` |

**Known blockers** — facts these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | The route of the admin Permaplate option edit form has never been mapped. The navigation map records `/quote/{id}/permaplate` on the dealer side but nothing on the admin side. | AP2444_001, AP2444_002 | Open — new, resolved by exploration in AP2444_001 |
| 2 | What "term" means, which is the field the *Parent* select box filters on. Without it the filtering in criterion 2 cannot be judged correct or incorrect — only recorded. | AP2444_001 | Open — Q-003 |
| 3 | Whether a child option may itself be the parent of a third option. If nesting is allowed, criteria 4 to 6 do not say what the middle level should do. | AP2444_005 | Open — Q-003 |
| 4 | Whether the *Paint* and *Extra care* pair named in the ticket description is already configured on staging. | AP2444_003, AP2444_004 | Open — resolved by observation in AP2444_001 |

> AP2444_005 ships **BLOCKED**: the ticket gives no expected behaviour for a two-level
> nesting, so the case can record what happens but cannot judge it. The other four are
> `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2444_001 | The admin Permaplate option form offers a "Parent" select box listing only options of the same term | Functional | High | PASS |
| AP2444_002 | Setting one Permaplate option as the parent of another makes the child appear nested under it on the dealer quote form | Functional | High | PASS |
| AP2444_003 | Selecting the parent option enables its child options and ticks them by default | Functional | High | PASS |
| AP2444_004 | De-selecting the parent option unticks and disables every child, and a child can be unticked on its own while the parent stays selected | Functional | High | PASS |
| AP2444_005 | A Permaplate option cannot be made its own parent, and a two-level chain behaves predictably | Negative | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2444_001 — The admin Permaplate option form offers a "Parent" select box listing only options of the same term

| Field | Value |
|---|---|
| **TC ID** | AP2444_001 |
| **Title** | The admin Permaplate option form offers a "Parent" select box listing only options of the same term |
| **Requirement** | AP2444 — criteria 1 and 2 |
| **Route** | The admin Permaplate option edit form. Route recorded during this case, since it is not yet mapped |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** The *Parent* field is the only place the parent-and-child relationship
can be set up. If the select box offers options from other terms, an administrator can build
a relationship the quote form cannot honour, and the dealer sees a child option that never
becomes selectable.

**Test Data:**

| Variable | Value |
|---|---|
| Admin login | `vinhle870@gmail.com` / `<password from the env source>` |
| Option under inspection | The option named *Extra care*, or if it does not exist, the second option in the Permaplate options list |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal at `/admin/login`, then find the Permaplate section of the admin menu and open the list of Permaplate options. Record the route | The Permaplate options list loads and its route is written into the execution log |
| 2 | Open the edit form for the option named "**Extra care**". If no such option exists, open the second option in the list and record its name instead | The option edit form opens |
| 3 | [Verification] Confirm the form contains a field labelled exactly "**Parent**" that is a select box, and record every option the select box offers together with the term of the option being edited | The "Parent" field is present and is a select box. Its full contents are recorded, so that whether it is correctly filtered by term can be judged once Q-003 answers what a term is |

---

### AP2444_002 — Setting one Permaplate option as the parent of another makes the child appear nested under it on the dealer quote form

| Field | Value |
|---|---|
| **TC ID** | AP2444_002 |
| **Title** | Setting one Permaplate option as the parent of another makes the child appear nested under it on the dealer quote form |
| **Requirement** | AP2444 — criterion 3 |
| **Route** | The admin Permaplate option edit form, then `/quote/{id}/permaplate` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** This is the join between the administrator's configuration and what
the dealer sees. It is also the case that sets up the *Paint* and *Extra care* pair the next
two cases depend on, so it must run before them. The option definition is shared
configuration, so this case records the original parent value and puts it back at the end.

**Test Data:**

| Variable | Value |
|---|---|
| Child option | *Extra care* |
| Parent option | *Paint* |
| Original *Parent* value | Recorded in step 1 before any change, and restored in step 5 |
| Quote | The quote created in AP2447_003 for client `Perma Testclient` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal, open the edit form for the Permaplate option "**Extra care**", and write down the current value of its "**Parent**" field before changing anything | The form opens and the original "Parent" value is recorded in the execution log so it can be restored |
| 2 | Set "**Parent**" to "**Paint**" and save the form | The option saves and the list shows *Extra care* with *Paint* as its parent |
| 3 | Sign in to the Dealer portal at `/login` and open `/quote/{id}/permaplate` for the quote created in AP2447_003 | The "Permaplate Quote" page loads with its product radio buttons and option checkboxes |
| 4 | [Verification] Confirm "**Extra care**" is now displayed as a child of "**Paint**" — indented beneath it or otherwise visibly grouped under it — and that its checkbox is disabled while "Paint" is unticked | *Extra care* appears nested under *Paint* and its checkbox cannot be ticked while *Paint* is unticked |
| 5 | Return to the admin option form for "**Extra care**" and set "**Parent**" back to the value recorded in step 1 | The shared option definition is restored to how it was before this case ran. **Skip this step only if AP2444_003 and AP2444_004 have not yet run**, and restore after they finish instead — note in the log which was done |

---

### AP2444_003 — Selecting the parent option enables its child options and ticks them by default

| Field | Value |
|---|---|
| **TC ID** | AP2444_003 |
| **Title** | Selecting the parent option enables its child options and ticks them by default |
| **Requirement** | AP2444 — criteria 4 and 5 |
| **Route** | `/quote/{id}/permaplate` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** This is the behaviour the story was written for — the dealer gets
*Extra care* offered as soon as *Paint* is chosen. If the child stays disabled, the dealer
cannot sell the add-on at all and the business loses the revenue on every quote.

**Test Data:**

| Variable | Value |
|---|---|
| Parent option | *Paint* |
| Child option | *Extra care*, made a child of *Paint* in AP2444_002 |
| Quote | The quote from AP2447_003 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/quote/{id}/permaplate` for the quote from AP2447_003, and select a Permaplate product radio button so the option checkboxes are live | The "Permaplate Quote" page shows the option checkboxes with "Paint" unticked and "Extra care" disabled |
| 2 | Tick the "**Paint**" checkbox | The page reacts without a full reload |
| 3 | [Verification] Confirm "**Extra care**" is now enabled and is ticked automatically, without the user having ticked it | *Extra care* is enabled and already ticked. If it is enabled but not ticked, that is a failure of criterion 5, which says child fields are "selected by default" |
| 4 | Untick "**Extra care**" while leaving "**Paint**" ticked, then click "**Save**" | *Extra care* unticks and stays enabled; *Paint* stays ticked. The quote saves |
| 5 | [Verification] Reload `/quote/{id}/permaplate` and confirm the saved state is *Paint* ticked and *Extra care* unticked | The saved selection survives the reload, proving the dealer really can opt out of the child option — the second half of what the ticket description asked for |

---

### AP2444_004 — De-selecting the parent option unticks and disables every child, and a child can be unticked on its own while the parent stays selected

| Field | Value |
|---|---|
| **TC ID** | AP2444_004 |
| **Title** | De-selecting the parent option unticks and disables every child, and a child can be unticked on its own while the parent stays selected |
| **Requirement** | AP2444 — criterion 6 |
| **Route** | `/quote/{id}/permaplate` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** If unticking the parent leaves the child ticked, the quote sells an
add-on that depends on a product the client is not buying. The client is then charged for
something that cannot be delivered, which is a billing dispute rather than a display fault.

**Test Data:**

| Variable | Value |
|---|---|
| Parent option | *Paint* |
| Child option | *Extra care* |
| Quote | The quote from AP2447_003 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/quote/{id}/permaplate`, select a product, and tick "**Paint**" so that "**Extra care**" is enabled and ticked | Both "Paint" and "Extra care" are ticked and enabled |
| 2 | Untick the "**Paint**" checkbox | The page reacts without a full reload |
| 3 | [Verification] Confirm "**Extra care**" has become unticked **and** disabled at the same moment | *Extra care* is both unticked and greyed out. A child that is unticked but still clickable is a partial failure of criterion 6 and must be recorded as such |
| 4 | Click "**Save**" with "Paint" unticked, then reload the page | The quote saves and, after the reload, neither "Paint" nor "Extra care" is ticked and "Extra care" is disabled |
| 5 | [Verification] Confirm the saved quote records no Permaplate options for this pair, by opening `/quote/{id}/details` and reading the Permaplate section | The quote details page shows the Permaplate section without *Paint* or *Extra care*, so the de-selection reached the stored quote and not only the screen |

---

### AP2444_005 — A Permaplate option cannot be made its own parent, and a two-level chain behaves predictably

| Field | Value |
|---|---|
| **TC ID** | AP2444_005 |
| **Title** | A Permaplate option cannot be made its own parent, and a two-level chain behaves predictably |
| **Requirement** | AP2444 — criteria 2, 4 and 6, and the gaps beside them |
| **Route** | The admin Permaplate option edit form, then `/quote/{id}/permaplate` |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | Q-003 — the ticket does not say whether an option may be its own parent, nor what a child that is itself a parent should do. Without that, the case can observe but not judge. |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** An option that is its own parent can never be enabled, because it
waits for itself. If the admin form allows it, a dealer is left with a checkbox that looks
available but can never be ticked, and nobody looking at the quote form can see why.

**Test Data:**

| Variable | Value |
|---|---|
| Self-parent attempt | Set the *Extra care* option's "Parent" field to *Extra care* |
| Two-level chain | *Paint* → *Extra care* → a third option, chosen during the run and named in the log |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal and open the edit form for the Permaplate option "**Extra care**", recording its current "Parent" value first | The form opens and the original value is recorded for restoration |
| 2 | Inspect the "**Parent**" select box and record whether the option being edited appears in its own list. If it does, choose it and save | Record whether the form offers self-selection at all, and if it does, whether saving is refused with a message or accepted |
| 3 | Restore "Parent" to the value recorded in step 1, then set a third option's "Parent" to "**Extra care**", building a chain of *Paint* → *Extra care* → third option | The chain is saved, or the save is refused. Record which, and the message if any |
| 4 | Open `/quote/{id}/permaplate` in the Dealer portal, tick "**Paint**", then untick it again | Record what the third option in the chain does at each step: whether it enables when *Extra care* enables, and whether unticking *Paint* reaches all the way down the chain |
| 5 | [Verification] Restore every option's "Parent" field to the value it had before this case ran, and confirm on the option list that the original configuration is back | The shared option configuration is exactly as it was. The observed behaviour is recorded in full and the case is reported Blocked, not Pass or Fail, until Q-003 is answered |

---

## Coverage Matrix

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| Criterion 1 — the admin *Parent* field exists | AP2444_001 | — | — | — |
| Criterion 2 — *Parent* lists only options of the same term | AP2444_001 | AP2444_005 | — | — |
| Criterion 3 — a child is shown nested under its parent | AP2444_002 | — | — | — |
| Criterion 4 — a child is disabled until its parent is selected | AP2444_002, AP2444_003 | — | AP2444_005 | — |
| Criterion 5 — selecting the parent enables and ticks the children, each de-selectable | AP2444_003 | — | — | — |
| Criterion 6 — de-selecting the parent unticks and disables the children | AP2444_004 | — | AP2444_005 | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2444_001 | PASS | see execution log |
| AP2444_002 | PASS | see execution log |
| AP2444_003 | PASS | see execution log |
| AP2444_004 | PASS | see execution log |
| AP2444_005 | PASS | see execution log |
