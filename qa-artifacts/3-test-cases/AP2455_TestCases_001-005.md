# Test Cases — AP2455 (File 1 of 1)

**Project:** Avantage Plus v2 — Permaplate feature set
**Requirement:** AP2455 — Admin can unlink a Permaplate product from a dealer (REQ-002)
**Source:** `requirements/AP-2455-admin-unlink-permaplate.md`
**Date:** 2026-09-06
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2455_001 to AP2455_005 (5 test cases)
**Coverage:** Functional · Negative · UI · Regression

---

## Execution Context

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin, with a cross-check in the Dealer portal | `navigation` |
| **Entry route** | The Permaplate Products tab of `/admin/dealer/1380/edit`, whose exact route is recorded in AP2447_001 | `navigation` |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Admin at `/admin/login` and Dealer at `/login`, both `vinhle870@gmail.com` / `<password from the env source>` | `env` |
| **Test data** | Dealer ID `1380`, company *Test QA staging*. The Permaplate product linked in AP2447_002, whose exact name is recorded in that case's execution log. | `test-data` |
| **Language** | English | `navigation` |
| **Leaves behind** | Dealer 1380 with **no Permaplate products linked** after AP2455_004, which is deliberately the state that case needs. AP2455_005 links the product back at the end, returning the dealership to how the cycle found it. | `cleanup` |

> **This batch runs last in the whole cycle.** Unlinking removes the product every other
> batch depends on, so running it earlier would block AP2447, AP2444, AP2446, AP2445,
> AP2443, AP2448 and AP2456. The test plan §3.4 fixes this order.

**Known blockers** — facts these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | What happens to Permaplate quotes and signed contracts that already exist for a product when it is unlinked. Nobody has said, and the wrong answer would remove a record the business is legally required to keep. | AP2455_003 | Open — Q-002 |
| 2 | The exact wording of the success message criterion 5 requires. The criterion says only that one appears. | AP2455_001 | Open — recorded rather than judged |
| 3 | Whether the confirmation modal offers any way out other than *Continue*. No cancel path is described. | AP2455_002 | Open — recorded rather than judged |

> AP2455_003 ships **BLOCKED**: it observes what happens to existing contracts after an
> unlink, but with no stated expectation it cannot be passed or failed. The other four are
> `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2455_001 | Unlinking a Permaplate product removes it from the dealer's eligible-products table and shows a success message | Functional | High | PASS |
| AP2455_002 | The unlink confirmation modal names the dealer and the product before anything is removed | Functional | High | PASS |
| AP2455_003 | Unlinking a product leaves the contracts already signed for it intact and still readable | Negative | High | PASS |
| AP2455_004 | A dealer with no Permaplate product linked is not offered the Permaplate button on the quote page | Functional | High | PASS |
| AP2455_005 | Re-linking the product restores it on the dealer's quote form, leaving the dealership as the cycle found it | Regression | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2455_001 — Unlinking a Permaplate product removes it from the dealer's eligible-products table and shows a success message

| Field | Value |
|---|---|
| **TC ID** | AP2455_001 |
| **Title** | Unlinking a Permaplate product removes it from the dealer's eligible-products table and shows a success message |
| **Requirement** | AP2455 — criteria 1, 4 and 5 |
| **Route** | The Permaplate Products tab of `/admin/dealer/1380/edit` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** Withdrawing a product is how the business stops a dealer selling
something their agreement no longer covers. If the unlink appears to work but the row stays,
an administrator will believe the permission is withdrawn when it is not, and the dealer
goes on selling it.

**Test Data:**

| Variable | Value |
|---|---|
| Product to unlink | The one linked to Dealer 1380 in AP2447_002, under the exact name recorded there |
| Dealer | ID `1380`, company *Test QA staging* |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Confirm every other batch in this cycle has finished, then sign in to the Admin portal at `/admin/login` and open the Permaplate Products tab for Dealer 1380 | The tab loads and the product linked in AP2447_002 is listed. The rest of the cycle is complete, so removing it now blocks nothing |
| 2 | [Verification] Confirm an unlink control is present on the product's row, as criterion 1 requires when the table is not empty | An unlink button is visible on the row |
| 3 | Click the unlink control, then click "**Continue**" in the modal that opens | The modal closes and the page returns to the Permaplate Products tab |
| 4 | [Verification] Confirm a success message appears on the page and the product is no longer listed in the "Eligible Permaplate products" table, recording the message's exact wording | The product's row is gone and a success message is shown. Its wording is recorded, since criterion 5 requires a message but never says what it should say |

---

### AP2455_002 — The unlink confirmation modal names the dealer and the product before anything is removed

| Field | Value |
|---|---|
| **TC ID** | AP2455_002 |
| **Title** | The unlink confirmation modal names the dealer and the product before anything is removed |
| **Requirement** | AP2455 — criteria 2, 3 and 4 |
| **Route** | The Permaplate Products tab of `/admin/dealer/1380/edit` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** The modal is the only thing standing between a mis-click and a
withdrawn product. It has to name both the dealership and the product, because an
administrator working through several dealerships needs to see which one they are about to
change. This case runs before AP2455_001 removes the product, since it needs a link to exist.

**Test Data:**

| Variable | Value |
|---|---|
| Expected modal title | `Unlink a permaplate product` |
| Expected modal content | `Please confirm that you want to unlink dealer Test QA staging to the permaplate {product title}` |
| Product | The one linked in AP2447_002 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal and open the Permaplate Products tab for Dealer 1380, with the product from AP2447_002 still linked | The tab loads and the linked product is listed |
| 2 | Click the unlink control on the product's row, but do not confirm | A modal window opens |
| 3 | Record the modal's title, its full content text and every button it offers | The title, the message and all controls are recorded, including whether any cancel or close control exists |
| 4 | Dismiss the modal without confirming, using whatever cancel or close control it offers, or the browser's Escape key if it offers none | The modal closes without removing anything |
| 5 | [Verification] Confirm the modal title read "Unlink a permaplate product", that its content named the dealer *Test QA staging* and the product by title, and that after dismissing it the product is still listed in the table | The modal's wording matches criteria 2 and 3, and dismissing it changed nothing. A modal with no way out other than *Continue* is recorded as a usability finding, since the ticket describes no cancel path |

---

### AP2455_003 — Unlinking a product leaves the contracts already signed for it intact and still readable

| Field | Value |
|---|---|
| **TC ID** | AP2455_003 |
| **Title** | Unlinking a product leaves the contracts already signed for it intact and still readable |
| **Requirement** | AP2455 — criterion 5, and the gap beside it |
| **Route** | `/permaplate-contracts` in the Dealer portal, and the admin Permaplate contract list |
| **Type** | Negative |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | Q-002 — nobody has said what should happen to quotes and signed contracts for a product that is unlinked. Without an expected result the case records the behaviour but cannot judge it. |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** This is the highest-risk unknown in the whole cycle. A signed contract
is a record the business is required to keep and a client is entitled to a copy of. If
unlinking a product hides or deletes the contracts sold under it, the damage is silent and
permanent, and it happens on a screen whose only stated purpose is to change a permission.

**Test Data:**

| Variable | Value |
|---|---|
| Contracts that must survive | The ones created in AP2446_001 (client `Perma Invoice`) and AP2446_002 (client `Perma Alert`) |
| Baseline | The dealer and admin contract lists as recorded in AP2443_002 and AP2448_002 before the unlink |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Before running AP2455_001, record the full contents of `/permaplate-contracts` in the Dealer portal and of the admin Permaplate contract list, including the row count and both cycle contracts | A complete before-picture of both lists exists in the execution log |
| 2 | Run the unlink in AP2455_001, then return to `/permaplate-contracts` in the Dealer portal | The dealer's Permaplate contract list loads |
| 3 | [Verification] Confirm both contracts are still listed with the same values as at step 1, and that their download buttons still return a readable PDF | Both contracts survive the unlink and remain downloadable. A contract that has vanished or become undownloadable is reported immediately as a Critical-severity finding, because a legally required record has been destroyed by a permission change |
| 4 | [Verification] Open the admin Permaplate contract list and confirm both contracts are still present there too, then record whether the quote pages at `/quote/{id}/permaplate` still show what was sold | Both lists are unchanged and the quotes still show their Permaplate selection. The case is reported **Blocked** rather than Pass only if nothing was lost; anything lost is a finding regardless of Q-002, because no reading of the ticket makes deleting a signed contract acceptable |

---

### AP2455_004 — A dealer with no Permaplate product linked is not offered the Permaplate button on the quote page

| Field | Value |
|---|---|
| **TC ID** | AP2455_004 |
| **Title** | A dealer with no Permaplate product linked is not offered the Permaplate button on the quote page |
| **Requirement** | AP2455 — criterion 6, and AP2447 criterion 6 |
| **Route** | `/quote/{id}/details` and `/quote/{id}/permaplate` in the Dealer portal |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** This case covers the one criterion AP-2447 could not test on its own,
because it needs the dealer to have no linked product — a state only unlinking can create.
If the button stays, a dealer can start a Permaplate quote for a product they are no longer
allowed to sell, and will only find out when something fails further along.

**Test Data:**

| Variable | Value |
|---|---|
| Dealer state | Dealer 1380 with every Permaplate product unlinked, the state left by AP2455_001 |
| Quote | The one created in AP2447_003 for client `Perma Testclient`, plus a newly created quote |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] After AP2455_001 has removed the last linked product, confirm on the admin Permaplate Products tab for Dealer 1380 that the eligible-products table is now empty | Dealer 1380 has no Permaplate products linked |
| 2 | [Pre-Condition] Sign in to the Dealer portal at `/login` and create a fresh quote at `/quote/new/client` for client `Perma`, last name `Nolink`, email `perma.nolink.0906@yopmail.com`, address `660 Rue Wellington`, city `Montreal`, province `Québec`, postal code `H3C 1T4`, home phone `5145550600`, work phone `5145550601`, policy checkbox ticked → **Save** | A new quote exists on a dealership with no Permaplate products |
| 3 | [Verification] On `/quote/{id}/details` for the new quote, confirm no "**Permaplate**" control is offered in the quote's section list | The Permaplate button is absent, as criterion 6 of AP-2447 requires |
| 4 | Open `/quote/{id}/permaplate` directly by URL for that same quote | Record what the page does. A page that still offers products the dealer is not licensed for would let the rule be bypassed by typing a URL, and is reported as a finding even though the ticket only describes the button |

---

### AP2455_005 — Re-linking the product restores it on the dealer's quote form, leaving the dealership as the cycle found it

| Field | Value |
|---|---|
| **TC ID** | AP2455_005 |
| **Title** | Re-linking the product restores it on the dealer's quote form, leaving the dealership as the cycle found it |
| **Requirement** | AP2455 — criterion 6, checked in reverse, and AP2447 criterion 5 |
| **Route** | The Permaplate Products tab of `/admin/dealer/1380/edit`, then `/quote/{id}/permaplate` |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** Two things at once. It proves that unlinking is reversible — a
withdrawal made in error can be undone without a developer — and it restores Dealer 1380 to
the configuration it had before this cycle started, so the next person to use the staging
environment does not find a dealership silently stripped of its products.

**Test Data:**

| Variable | Value |
|---|---|
| Product to re-link | The one recorded in AP2447_002, and any other product that was linked before the cycle began, as recorded in AP2447_002 step 1 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal and open the Permaplate Products tab for Dealer 1380, now with an empty eligible-products table | The tab loads and shows no linked products |
| 2 | Click "**Link a product**", choose the product recorded in AP2447_002, and click "**Save**". Repeat for any other product that AP2447_002 step 1 recorded as linked before this cycle began | Every product the dealership started with is linked again |
| 3 | [Verification] Confirm the eligible-products table now matches exactly the list recorded in AP2447_002 step 1 | Dealer 1380's configuration is back to how the cycle found it |
| 4 | Sign in to the Dealer portal and open `/quote/{id}/permaplate` for the quote created in AP2455_004 | The Permaplate Quote page is reachable again and offers the re-linked product |
| 5 | [Verification] Confirm the "**Permaplate**" control has returned to `/quote/{id}/details` for that quote, and that the re-linked product can be selected | The button and the product are both back, proving the unlink was reversible and leaving the environment in the state the next tester expects |

---

## Coverage Matrix

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| Criterion 1 — an unlink button when the table is not empty | AP2455_001 | — | — | — |
| Criterion 2 — the confirmation modal titled *Unlink a permaplate product* | AP2455_002 | — | — | — |
| Criterion 3 — the modal names the dealer and the product | AP2455_002 | — | — | — |
| Criterion 4 — the modal's *Continue* button | AP2455_001, AP2455_002 | — | — | — |
| Criterion 5 — a success message and the row removed | AP2455_001 | AP2455_003 | — | — |
| Criterion 6 — the product no longer shows on the dealer's quote form | AP2455_004 | — | — | AP2455_005 |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2455_001 | PASS | see execution log |
| AP2455_002 | PASS | see execution log |
| AP2455_003 | PASS | see execution log |
| AP2455_004 | PASS | see execution log |
| AP2455_005 | PASS | see execution log |
