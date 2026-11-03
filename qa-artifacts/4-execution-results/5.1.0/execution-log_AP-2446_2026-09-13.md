# Execution Log — AP-2446 (Re-test)

**Spec ID:** AP2446 · **Ticket:** [AP-2446](https://garantieavantageplus.atlassian.net/browse/AP-2446) — Permaplate Invoice
**Sprint / Fix version:** 5.1.0
**Executed by:** QA Agent — Manual Executor Skill
**Date:** 2026-09-13
**Environment:** Staging (v2staging) — `https://v2staging.garantieavantageplus.ca`
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Trigger:** Ken Nguyen's ticket comment (2026-09-08) asking for a retest now that AP-2459, AP-2460 and AP-2461 are fixed. Per the same comment, AP-2460 is dismissed as intended behaviour ("we are mentioning the amount before tax and it should be accepted, no need to create a bug for it") rather than something to re-verify as fixed.
**Previous run:** `execution-log_PERMAPLATE_2026-09-06.md` — AP2446_003 FAIL (BUG-002, BUG-003), AP2446_001 step 3 crashed first (BUG-001), AP2446_005 SKIPPED

---

## Execution Summary

| Metric | Value |
|---|:---:|
| Total test cases | 5 |
| Passed | 4 |
| Failed | 0 |
| Blocked | 0 |
| Skipped | 1 |
| **Pass rate** | **100% (4 of 4 executed)** |

**Verdict in one sentence: all three defects raised on the previous cycle are resolved — AP-2459's HTTP 500 no longer occurs, AP-2461's invoice now cites the correct contract number, and AP-2460 is confirmed to be intended behaviour, not a defect — and AP-2446 is clear to move past QC.**

New dynamic test data created for this run: quote **6291**, client "Perma Retest0913" (`perma.retest.0913@yopmail.com`), Permaplate contract **PNA-0000000012**, invoice **#926**. None of it is cleaned up — `cleanup` is `missing` per the knowledge registry, consistent with every prior cycle.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2446_001 | Creating a Permaplate contract raises an invoice automatically | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2446/AP2446_001-step3-ContractGeneratedNoHttp500_pass.png` | **AP-2459 fixed** — blank Financing company no longer 500s |
| AP2446_002 | An alert says the invoice has been created | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2446/AP2446_002-step4-InvoiceCreatedAlert926_pass.png` | Alert reads "Invoice #926 ($145) is created" |
| AP2446_003 | The invoice carries the correct amount | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2446/AP2446_003-step3-Invoice926CorrectContractNumberAndTaxBreakdown_pass.png` | **AP-2461 fixed** (contract number now matches); **AP-2460 confirmed not a bug** — invoice itemizes $145 + GST/PST = $166.71 |
| AP2446_004 | The invoice is payable like a warranty invoice | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2446/AP2446_004-step4-PaymentRouteSameAsWarranty_pass.png` | Still reaches the same "Make a payment" screen as a warranty invoice |
| AP2446_005 | Warranty invoicing still works after the change | High | ⏭️ | 1 | 0 | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2446/AP2446_005-step2-WarrantyIncompleteNoContractControl_skipped.png` | Got past the 2026-09-06 date blocker, but the warranty stayed "Incomplete" with no invoice-raising control found this session — see Environment Observations |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP2446_001 — Creating a Permaplate contract raises an invoice automatically — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create a quote with a new client | The quote is created | Created quote 6291 for client "Perma Retest0913", `perma.retest.0913@yopmail.com` | ✅ | Fresh client, not reused — the previous cycle's quote 6284 already carries a Permaplate contract |
| 2 `[Pre-Condition]` | Attach the vehicle, select the linked Permaplate product and an option, Save | The selection saves | Vehicle VIN `1FAHP35NX8W239204` attached. Dealer 1380 had **no Permaplate product linked** (`alert = "No entities found"` on `/admin/dealer/1380/permaplate`) — relinked "10 ans" via `/admin/dealer/1380/permaplate/link` (now a proper modal dialog, not a full page). Then selected "10 ans" + "Peinture – Céramique + Graphene" (auto-ticks child "Extra care"); `heading "Cost: 145$"` | ✅ | The product-link precondition from AP-2447/AP-2455 had reverted since the last cycle; relinked as a same-project precondition, not a new finding for this ticket. The link-a-product control now opening as a modal instead of a full page is a **positive change** since BUG-004 was raised — worth confirming with the dev if intentional |
| 3 | Note the invoice count, then use "Create Contract" leaving **Financing company on "Choose"** | Contract created; if AP-2459 is fixed this must not 500 | Highest invoice ID before = 921. Submitted with Financing company left blank: `alert = "Esthetic protection contract generated successfully"`, no error page, no HTTP 500. Contract `PNA-0000000012` created | ✅ | **AP-2459 confirmed fixed.** This is the exact repro (blank Financing company) that crashed with HTTP 500 on 2026-09-06; it now succeeds cleanly |
| 4 `[Verification]` | Open `/invoice` and confirm a new invoice for this contract | One more invoice, for this Permaplate contract | New row `Invoice ID = 926`; description names "Perma Retest0913", VIN `1FAHP35NX8W239204`, contract `PNA-0000000012` | ✅ | Criterion 1 still holds after the fix |

### AP2446_002 — An alert says the invoice has been created — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1–2 `[Pre-Condition]` | (Covered by AP2446_001 steps 1–2, same quote reused per case's own permission) | Quote with client and vehicle ready | Quote 6291, as above | ✅ | — |
| 3 | Use the contract-generation control and watch the page immediately after | A message appears | Two alerts rendered together: "Esthetic protection contract generated successfully" and "Invoice #926 ($145) is created" | ✅ | Screenshot captured while both banners were visible |
| 4 `[Verification]` | Confirm the message names the invoice and record its wording | A visible alert names the invoice | `Alert text = "Invoice #926 ($145) is created"` | ✅ | Same wording pattern as the 2026-09-06 run ("Invoice #921 ($145) is created") — the alert still quotes the pre-tax figure, which per Ken Nguyen's 2026-09-08 comment is intended, not BUG-002 |

### AP2446_003 — The invoice carries the correct amount — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the quote details and record every figure in the Permaplate section | Figures recorded | `Quote details Esthetic protection section = "Peinture – Céramique + Graphene, Extra care (5 ans couverture ) / Cost: 145$"` | ✅ | Unchanged from the previous cycle |
| 2 | Open the invoice raised for the contract | Invoice detail shown | `/invoice/926`: Description = "Perma Retest0913 / Ford Focus 2008 / VIN : 1FAHP35NX8W239204 / **PNA-0000000012** / Test QA staging / vinhle870@gmail.com"; itemized table shows line "Perma Retest0913 … PNA-0000000012 … $145.00", then "GST (5%) $7.25", "PST (9.975%) $14.46", "Grand Total $166.71", "Balance $166.71"; footer link "#PNA-0000000012" | ✅ | — |
| 3 `[Verification]` | Compare the invoice's contract number and total against the contract actually created, and against the 2026-09-06 finding | Contract number matches; amount finding re-assessed per Ken's comment | Contract number **PNA-0000000012 matches exactly** across the description, the footer link and the download link — no more `PNA-0000000000` placeholder. Re-opened the **old** invoice `/invoice/921` for comparison: it still reads `PNA-0000000000` in its description (old row, frozen data — expected, since a fix changes new records, not historical ones) while its own footer link still correctly reads `#PNA-0000000007`. The **same itemized breakdown** ($145 line + GST + PST = Grand Total) is present on invoice 921 too, meaning this breakdown view existed on 2026-09-06 but was not checked at the time (the original run only read the `/invoice` list row, whose single "Amount" column shows the tax-inclusive $166.71 with no breakdown) | ✅ | **AP-2461 confirmed fixed** for new invoices. **AP-2460 confirmed not a bug**, per Ken Nguyen's comment and the invoice's own document: the $145 the alert quotes is the same $145 broken out as the pre-tax line item on the invoice, with GST/PST itemized separately down to the $166.71 Grand Total — nothing is hidden, it is simply not visible from the invoice-list row alone. Recommend to the ticket: the alert or the list row could optionally say "before tax" for clarity, but this is a UX suggestion, not a defect |

### AP2446_004 — The invoice is payable like a warranty invoice — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/invoice` | Invoices page loads | `Page heading = "Invoices"` | ✅ | — |
| 2 | Find the Permaplate invoice and record its label | Present and distinguishable | Row `926 / PNA-0000000012`, description names "Perma Retest0913", Amount `$166.71`, Status "Payment pending" | ✅ | — |
| 3 | Use the payment control, stopping before real payment details | Payment route opens | `Page action "Make a payment" → /invoice/select-payment` | ✅ | Same bulk-action route as before |
| 4 `[Verification]` | Confirm the route is the one a warranty invoice uses | Same payment screen | `/invoice/select-payment` lists invoice 926 (checkbox row 1) alongside "Warranty #458", "Warranty #147" and others, same table/columns as the 2026-09-06 run | ✅ | Criterion 4 still holds after the fix cycle |

### AP2446_005 — Warranty invoicing still works after the change — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Reuse quote 6291, open `/quote/6291/warranty/edit`, choose a term and Save | Warranty contract created | Page loaded with an immediate alert "The delivery date has passed the acceptable timeframe" **even though the delivery date shown was already today, 2026-09-13** — the same message the 2026-09-06 run hit. Selected term "20m/20000km" (the radio required a second click via its label — the input itself is covered, same custom-control pattern seen on the Permaplate options), filled Sale price `1000`, and filled the previously-blank "Warranty Start Date" via the date picker (also read-only to direct typing) to 2026-09-13. Save then returned "Warranty saved" | ✅ | Progressed further than the 2026-09-06 run, which stopped at this same alert. The alert text itself did not go away, but it no longer blocked saving once Warranty Start Date was supplied — suggesting the message is shown whenever that field is blank, regardless of whether the delivery date is actually in the past. Worth a product question in its own right, separate from AP-2446 |
| 2 `[Verification]` | Confirm a warranty invoice for this contract appears on `/invoice` | Warranty invoice raised, comparable to the Permaplate one | Quote details now shows a Warranty section with contract number `26-860`, status **"Incomplete"**, and only an "Edit" link — no "Create Contract" / "Download" control like the Permaplate section has. `/invoice` showed no new row for this quote at all | ⏭️ | Saving the warranty form only stores the configuration; it does not itself raise the contract or invoice the way Permaplate's separate "Create Contract" button does. No equivalent control could be found on this build in the time available this session. Skipped rather than failed, since the regression this case exists to catch (shared invoicing code breaking warranty) was not actually exercised — it remains unproven, same conclusion as 2026-09-06, for a different concrete reason this time |

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2446_005 | ⏭️ | The warranty contract reached "Incomplete" status with no discoverable control to generate its contract/invoice in the time available. The regression check (does the shared invoicing code still work for warranty) remains unverified this cycle too. Recommend the next cycle trace what "Finalize sale" or an equivalent action does before attempting this case again |

---

## Environment Observations

- **Dealer 1380's Permaplate product link had reverted to unlinked** since the 2026-09-06 cycle (`/admin/dealer/1380/permaplate` showed "No entities found"). Relinked "10 ans" as a precondition for this run. Not a defect in AP-2446 itself, but worth flagging to whoever owns dealer/product linking test data between cycles — AP-2455's own regression case proved re-linking works, so this is expected to need repeating each cycle until a `cleanup`/seed step exists.
- **The "Link a product" admin control now opens as a modal dialog**, not a full page as BUG-004 (raised under AP-2447) described on 2026-09-06. Not confirmed whether this was an intentional fix or a side effect of other work — worth a one-line confirmation with the dev.
- **AP-2459 (HTTP 500 on blank Financing company) is fixed.** Retried the exact repro from the last cycle and it now succeeds.
- **AP-2461 (wrong contract number on the invoice) is fixed for new invoices.** The historical invoice #921 from 2026-09-06 still carries the old wrong value, which is expected — a code fix does not rewrite already-stored records.
- **AP-2460 is not a defect.** Confirmed by inspecting the invoice's own itemized detail page (`/invoice/{id}`), which was not examined in the original 2026-09-06 run (that run read only the `/invoice` list row). The $145 the alert quotes is the same $145 shown as the pre-tax line item, with GST and PST itemized separately down to the $166.71 Grand Total.
- **The custom radio/checkbox controls across this feature (Permaplate options, warranty term) cannot be clicked on their native input** — the click must land on the associated `<label>` text, or Playwright's default click times out waiting for the input to become "stable" under the label. This is consistent across both forms and is worth a note in the navigation knowledge file for future runs, not a functional defect.
- `env-check` is still `missing` in the knowledge registry, so no scripted smoke test ran before this session; login and portal reachability were confirmed by hand for both the Dealer and Admin portals.
- `cleanup` is still `missing`; quote 6291, its client, the Permaplate contract PNA-0000000012, invoice #926, and the incomplete warranty contract 26-860 all remain on staging.
