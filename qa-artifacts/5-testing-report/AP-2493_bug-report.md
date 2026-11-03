# Bug Report

**Project:** Avantage Plus v2 — Dealer portal, AP-2493: Cancelling a product from a quote
**Report ID:** BR-20261102-001
**Test Cycle:** AP-2493 single-ticket STLC run, run folder no-sprint. 14 test cases executed on **Dev (v2dev)** on 2026-11-02, by the user's decision: 12 PASS, 2 FAIL, 0 BLOCKED (86 %).
**Date:** 2026-11-02
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md · qa-artifacts/3-test-cases/AP2493_TestCases_*.md · Gate C decision in qa-artifacts/7-reviews/AP-2493_review.md (R3 round 1 decision, confirmed by R3 round 2 APPROVE)

**Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca`. Staging was not opened in this run.

| Metric | Value |
|---|:---:|
| Total defects | 1 |
| Critical | 0 |
| High | 0 |
| Medium | 1 |
| Low | 0 |
| Tracker tickets created | 1 (AP-2516 on 2026-11-02) |

**Decisions (Gate C, by the reviewer — R3 round 2 APPROVE, rule C4):**
- No FAIL meets rule C1 (not a bug): no sentence in the requirement capture or in a comment by someone outside `not_developers` says the Permaplate cost is meant to stay out of the Subtotal. The capture says the opposite: "Cancelling a product also removes its amount from the quote Subtotal, so the Subtotal reflects only active products", with Esthetic protection (Permaplate) among the listed products.
- Open and closed AP bugs were searched for "Permaplate", "Subtotal", "Esthetic protection", "Permaplate subtotal", "sub-total", "invoice total", "Summary of products", "quote total" and "cancel product" (R3), and again for "Permaplate" and "Subtotal" just before filing (2026-11-01T20:08Z UTC). The nearest candidates (AP-2512, AP-2513, AP-2514, AP-2515, AP-2459, AP-2460, AP-2461) are about the Permaplate contract form, its PDF or its invoice — none names the quote details Subtotal. So the bug is filed new (C4).
- AP2493_011 and AP2493_012 fail on the same root cause, which shows up before any cancellation: the Permaplate cost is never part of the Subtotal. They share **one** bug, written about the Subtotal, not about the cancel action — the cancel action itself works.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2493_011 (step 4), AP2493_012 (step 4) | The quote Subtotal never includes the Esthetic protection (Permaplate) cost, so adding, cancelling or re-adding Permaplate never changes the Subtotal | Medium | P2 | [AP-2516](https://garantieavantageplus.atlassian.net/browse/AP-2516) | Open |

---

## Bug Details

---

### BUG-001 — The quote Subtotal never includes the Esthetic protection (Permaplate) cost, so adding, cancelling or re-adding Permaplate never changes the Subtotal

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2493_011 (FAIL at step 4, check c) and AP2493_012 (FAIL at step 4). Also seen, before any cancellation, in AP2493_003 step 2 (which passed, because it does not check the Subtotal) |
| **Requirement** | AP-2493 REQ-003 — "Cancelling a product also removes its amount from the quote Subtotal, so the Subtotal reflects only active products." Products in scope include "Esthetic protection (Permaplate)" |
| **Severity** | Medium — the dealer sees a quote Subtotal that leaves out an active Esthetic protection product, so the total shown to the client is too low by the Permaplate cost; there is no evidence that a billed or stored amount is wrong, and the dealer can add the cost by hand |
| **Priority** | P2 — fix in the current release; it keeps AP-2493's Subtotal rule from holding for one of the five products |
| **Environment** | **Tested on: Dev (v2dev)** `https://v2dev.garantieavantageplus.ca` · Dealer portal · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · app version not exposed |
| **Tracker Ticket** | [AP-2516](https://garantieavantageplus.atlassian.net/browse/AP-2516) — Bug, priority Medium, labels qa-agent / stlc-automated, status Backlog, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2493; 2 screenshots embedded in the description (verified: 2 media nodes with ids) |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always — 3 of 3 quotes on Dev (6463, 6468 with an 80$ option, 6468 again with a 145$ option) |

**Summary:**
On Dev (v2dev), the **Subtotal** in the "Summary of products" card of the quote details page (`/quote/{id}/details`) never includes the cost of an active **Esthetic protection** (Permaplate) product: the row shows "Cost: CA$80.00$" under the product name but "-" in its amount column, and the Subtotal equals vehicle + warranty only — so cancelling the Permaplate product leaves the Subtotal unchanged, and adding a new 145$ Permaplate product does not raise it either.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login` and sign in with a dealer account.
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/915/details` (Ford Focus 2008, VIN `1FAHP35NX8W239204`) and click **Create quote**. The client form opens at `/quote/new/client?fromVehicleId=915`.
3. Fill the client form: Email `client.stage.954@yopmail.com` (any unused address), First name `Annul`, Last name `Produit2493-011`, Address `123 rue Principale`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Tel. home `5145550100`, Tel. work `5145550101`. Tick the policy-agreement box and click **Save**. The page `/quote/{id}/details` opens with the alert "Client saved".
4. Open `/quote/{id}/vehicle`, set **Delivered at** to `2026-11-01` and **Price** to `20000`, and click **Save**. On `/quote/{id}/details` the Subtotal now reads **CA$20,000.00**.
5. In the "Summary of products" card, click the **+** on the **Extended warranty** row. In the modal, keep the program "Automation Test Program" and option "default 1", choose the term **20m/20000km**, type **Sale price** `1500`, and click **Save**. The alert "Warranty saved" appears; the warranty row shows **CA$1,500.00** and the Subtotal reads **CA$21,500.00** (20,000 + 1,500 — the warranty is counted).
6. Click the **+** on the **Esthetic protection** row (opens `/quote/{id}/permaplate`). Click the product **10 ans**, tick **Antirouille – Rust+Sound (combo)** (80$) by clicking its label, and click **Save**. The alert "Esthetic protection quote saved successfully" appears.
7. On `/quote/{id}/details`, read the **Esthetic protection** row and the **Subtotal**. **← first wrong result:** the row reads "Antirouille – Rust+Sound (combo) Cost: CA$80.00$" with **"-"** in its amount column, and the Subtotal is still **CA$21,500.00** (expected CA$21,580.00).
8. On the **Esthetic protection** row, click the **⋯** button, choose **Delete**, and in the modal "Cancel a product - Esthetic protection" click **Yes, cancel the product**. Reload `/quote/{id}/details`. The row now reads "Esthetic protection -" with its **+** back, the warranty row is unchanged at CA$1,500.00, and the Subtotal is still **CA$21,500.00**.
9. Click the **+** on the **Esthetic protection** row again. Click the product **10 ans**, tick **Peinture – Céramique + Graphene** (75$; this also ticks **Extra care (5 ans couverture )**, 70$ — "Cost: 145$"), and click **Save**. Reload `/quote/{id}/details`. **← second wrong result:** one new Esthetic protection row reads "Peinture – Céramique + Graphene, Extra care (5 ans couverture ) Cost: CA$145.00$" with **"-"** in its amount column, and the Subtotal is still **CA$21,500.00** (expected CA$21,645.00).

**Expected Result:**
The Subtotal reflects every active product, as the ticket says: "Cancelling a product also removes its amount from the quote Subtotal, so the Subtotal reflects only active products", and Esthetic protection (Permaplate) is one of the five products in scope. So at step 7 the Subtotal should include the 80$ Permaplate cost (CA$21,580.00), at step 8 cancelling it should lower the Subtotal by 80$ (back to CA$21,500.00), and at step 9 the new 145$ product should raise it to CA$21,645.00. The other four products all work this way on Dev: the warranty adds its sale price, Roadside its policy sale price, GAP its premium and creditor insurance its monthly premium, and cancelling each one lowers the Subtotal by that amount.

**Actual Result:**
The Permaplate cost is never part of the Subtotal. With an active 80$ Permaplate product the Subtotal is CA$21,500.00 (vehicle 20,000 + warranty 1,500 only), and the Esthetic protection row's amount column shows "-" while "Cost: CA$80.00$" is printed under the product name. Cancelling the product leaves the Subtotal at CA$21,500.00, and re-adding a 145$ product leaves it at CA$21,500.00. The same happens on a quote with no warranty and no financing (quote 6463: 80$ Permaplate active, Subtotal CA$20,000.00 = vehicle only), so financing and the warranty play no part.

**The cancel action itself works.** At step 8 the Permaplate row is deleted, its **+** add action comes back, the warranty is untouched, and at step 9 the re-add creates one new row with the new options (no "already exists" error). Only the Subtotal is wrong.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_011-step4-PermaplateRemovedSubtotalUnchanged_fail.png` — quote 6468 after cancelling the 80$ Permaplate and reloading: no Esthetic protection row, warranty CA$1,500.00 intact, Subtotal still CA$21,500.00 |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_012-step4-NewPermaplateSubtotalNotRaised_fail.png` — quote 6468 after re-adding a 145$ Permaplate: new Esthetic protection row "Cost: CA$145.00$" with "-" in the amount column, Subtotal still CA$21,500.00 |
| Console log | None captured. No error page and no HTTP 5xx at any step |

**Suggested Root Cause:**
Unknown — for dev investigation. The Esthetic protection row renders "-" in the amount column that feeds the Subtotal for the other four products, so the Subtotal calculation (or the row's amount value) likely has no amount for a Permaplate product — perhaps because Permaplate has a cost but no sale price.

**Notes:**
- **Tested on: Dev (v2dev).**
- **Question for the product owner (Q-003): should the Permaplate cost — or a Permaplate sale price — count in the quote Subtotal?** If Permaplate is meant to stay out of the Subtotal, please say so in a comment and the QA test cases will be corrected; the ticket text currently says the Subtotal reflects every active product.
- **Whether this predates AP-2493 could not be proven.** The Subtotal is computed when the page is shown, so older quotes show the current build's behaviour, and no build from before the AP-2493 merge is reachable on Dev. What is proven is that the omission does not depend on cancelling: it is visible as soon as a Permaplate product is added (step 7).
- Relates to AP-2493 (Cancelling a product from a quote), where the two failing test cases ran — linked as "Relates" on AP-2516.
- Test data left on Dev: quote 6468 (client `client.stage.954@yopmail.com`, last name `Produit2493-011`) with the warranty, financing and the re-added 145$ Permaplate; quote 6463 (`Produit2493-003`) with an 80$ Permaplate.
- Side observation, not part of this bug: the Permaplate page accepted a save with the product chosen but no option ticked, which stored an Esthetic protection row of "Cost: CA$0.00$" (quote 6463, first attempt).

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 1 | AP2493_011, AP2493_012 |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — Cancel action offered only for a non-finalized product | 0 | — |
| REQ-002 — Cancellation confirmed in a modal | 0 | — |
| REQ-003 — Cancelled product deleted, slot freed, Subtotal reflects only active products | 1 | BUG-001 |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** 2026-11-02 (2026-11-01T20:12:47Z UTC)

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2516 | Filed by stlc-bug-reporter (s5); linked Relates → AP-2493; assigned to Ken Nguyen | Backlog | 2026-11-02 |
| — | AP-2493 | s7 Gate D: story result comment posted (id 19449, read back); not moved — pass rate 86% (needs 90%); assignee unchanged. No action on AP-2516 (Backlog, not in the QA status) | QC (unchanged) | 2026-11-02 |
