# Execution Log — AP-2493

> Written by the **stlc-manual-executor** skill (stage s4 of `stlc-ticket-pipeline`, run `AP-2493 --from s4 --until s4c`).

---

## Execution Summary

**Ticket:** AP-2493 — Cancelling a product from a quote
**Environment:** Dev (v2dev)
**Executed by:** QA Agent — Manual Executor Skill
**Date:** 2026-11-02
**Base URL:** https://v2dev.garantieavantageplus.ca/ (dealer portal, signed in at `/login` with the Dev dealer account named in the `env` source, "Dev Environment" section)
**Browser:** Chromium (Playwright), viewport 1280 × 800
**Duration:** 2026-11-01T19:39:45Z → 2026-11-01T19:53:40Z (02:39 → 02:53 on 2026-11-02, local time UTC+7). Re-run of AP2493_010 only (R3 round 1 F-1): 2026-11-01T20:04:00Z → 2026-11-01T20:05:11Z, Dev (v2dev)
**Test cases:** qa-artifacts/3-test-cases/AP2493_TestCases_001-005.md · AP2493_TestCases_006-010.md · AP2493_TestCases_011-014.md

The environment was set to Dev (v2dev) by the user's decision for this run. The test cases were designed against staging (their Execution Context says "Staging (v2staging)"); the `env` source's Dev section was used instead and no staging page was opened. The orchestrator had already run the tracker preflight and the environment health check; the `env-check` source is `missing` on this project, so no separate smoke check file exists.

| Metric | Value |
|---|:---:|
| Total test cases | 14 |
| Passed | 12 |
| Failed | 2 |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **86% (12 of 14)** |

Totals after the AP2493_010 re-run (2026-11-01T20:05:11Z). The first run's totals were 11 PASS · 2 FAIL · 1 BLOCKED (79 %); AP2493_010 moved from BLOCKED to PASS after its redesign (R3 F-1). AP2493_011 and AP2493_012 FAIL stand unchanged.

---

## Build check — is AP-2493 on Dev?

The pull request was merged on 2026-10-26 but its deployment was never confirmed, so the build was checked before any case was judged. On the first quote created (6461), the Extended warranty row of the "Summary of products" table carries a "⋯" menu with **Edit · Generate Contract · Delete**, and Delete points to `/quote/6461/cancel-product/warranty`. The cancel-product control exists on Dev, so the cases were run. (The route family `/quote/{id}/cancel-product/{type}` was later seen for `warranty`, `roadside`, `permaplate`, `creditors` and `gap`.)

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2493_001 | An extended warranty with no contract shows a cancel action on the quote details page | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_001-step4-WarrantyMenuDelete_pass.png` | Quote 6461: warranty ⋯ menu offers "Delete" |
| AP2493_002 | A Roadside Protection product with no contract shows a cancel action on the quote details page | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_002-step4-RoadsideMenuDelete_pass.png` | Quote 6462: Roadside saves without a contract on Dev; "Delete" offered |
| AP2493_003 | An Esthetic protection (Permaplate) product with no contract shows a cancel action on the quote details page | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_003-step4-PermaplateMenuDelete_pass.png` | Quote 6463: Esthetic protection ⋯ menu offers "Delete" |
| AP2493_004 | A creditor insurance product quoted but without a contract shows a cancel action on the quote details page | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_004-step4-CreditorMenuDelete_pass.png` | Quote 6464: Creditors insurance ⋯ menu offers "Delete" |
| AP2493_005 | A GAP insurance product quoted but without a contract shows a cancel action on the quote details page | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_005-step4-GapMenuDelete_pass.png` | Quote 6465: GAP route found (`/quote/{id}/gap-insurance`); "Delete" offered |
| AP2493_006 | A creditor insurance product with a generated contract shows no cancel action and keeps its Download link | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_006-step4-FinalizedNoDeleteDownload_pass.png` | Own contract AVP000169 on quote 6466: no menu, PDF link kept |
| AP2493_007 | Choosing cancel opens a confirmation modal, and declining it leaves the warranty on the quote unchanged | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_007-step5-WarrantyKeptAfterNo_pass.png` | Quote W = 6467; "No" keeps the warranty and Subtotal |
| AP2493_008 | Closing the confirmation modal without answering leaves the warranty on the quote unchanged | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_008-step5-WarrantyKeptAfterDismiss_pass.png` | No × icon; Escape and outside click close it; warranty kept |
| AP2493_009 | Confirming the cancellation removes the warranty, brings back the add action and lowers the Subtotal by its amount | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_009-step4-WarrantyRemovedSubtotalDrop_pass.png` | Row gone, "+" back, Subtotal 21,500 → 20,000 (−1,500) |
| AP2493_010 | After a warranty is cancelled, adding a new warranty creates a new row with the new term and amount | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_010-step4-NewWarrantyRow1800Subtotal21800_pass.png` | Re-run (R3 F-1): same term, Sale price 1800 → one row CA$1,800.00, Subtotal CA$21,800.00. First run BLOCKED (one term) |
| AP2493_011 | Cancelling the Permaplate product on a quote that also has a warranty leaves the warranty untouched and lowers the Subtotal | High | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_011-step4-PermaplateRemovedSubtotalUnchanged_fail.png` | Row removed, warranty intact, but Subtotal did not drop by 80$ — Permaplate never counted |
| AP2493_012 | After a Permaplate product is cancelled, adding Permaplate again creates a new row with the new option | Medium | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_012-step4-NewPermaplateSubtotalNotRaised_fail.png` | New row with new options created, but Subtotal did not rise by 145$ |
| AP2493_013 | Opening an archived quote with a product does not show an error, and whether a cancel action is offered is recorded | Low | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_013-step4-ArchivedQuoteRenders_pass.png` | Archived quote 6245 renders; Delete is offered (Q-004, recorded) |
| AP2493_014 | Cancelling a GAP product removes it and leaves the creditor insurance product on the same quote in place | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_014-step4-GapRemovedCreditorKept_pass.png` | Quote 6469: GAP gone, creditor kept, Subtotal = sum of active products |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Test data check on Dev

The cases create every quote they need from vehicle 915 through `/vehicle/915/details` → **Create quote** (`/quote/new/client?fromVehicleId=915`), which works on Dev (quotes 6461–6469 all saved and opened normally). Facts that differ from the staging design, and how each was handled:

- **The quote vehicle step** already holds vehicle 915 with price 10,000 and today's delivery date after the client is saved; the case's values (Delivered at 2026-11-01, Price 20000) were saved over it on every quote.
- **Warranty:** on Dev the warranty is added from the "+" of the Extended warranty row, which opens a modal. Vehicle 915 offers one program ("Automation Test Program", option "default 1") with one term, **20m/20000km**, and the modal requires a **Sale price**, which the design does not give. `1500` was used and recorded. The row then shows Cost CA$1,000.00 · Commission CA$500.00 · amount CA$1,500.00. Because only one term exists, AP2493_010 (which needed a second term) was BLOCKED on the first run; it was redesigned to re-add the same term with Sale price 1800 (R3 F-1) and re-run — PASS.
- **Roadside:** the Dev form has only the tier radios and "Policy Sale price*", and a plain **Save** — no stock number, condition, odometer or "Save and Generate Contract". The design's "Sale price 20000" was typed into Policy Sale price, so the Roadside row reads CA$20,000.00.
- **Permaplate:** product "10 ans" (`permaplate_3`) with options Antirouille – Rust+Sound 80$ (option 20), Peinture – Céramique + Graphene 75$ (option 17, which also ticks Extra care 70$, option 18). The first enabled option in page order is option 20.
- **GAP:** the GAP row's "+" opens `/quote/{id}/gap-insurance` in a modal: Rate table (TGGAP only), Language, Tax exempt, **Gap Term*** — no date of birth, monthly payment or residual fields (the quick-quote field set the design gave does not apply). Gap Term `60` was used.
- **AP2493_006:** quote 6276 is a staging id and was **not** opened on Dev; the case's step 2 (create its own contract) was run.
- **Client inboxes:** `client.stage.947` to `client.stage.955` (one per quote created).

No record this run did not create was changed. The archived quote 6245 read in AP2493_013 was only viewed; no cancellation was confirmed on it.

---

## Step-by-Step Results

Row contents were read from the "Summary of products" table of `/quote/{id}/details`; the cancel links were read from the DOM (`a[href*="cancel-product"]`), which renders them server-side even while the "⋯" menu is closed.

### AP2493_001 — An extended warranty with no contract shows a cancel action on the quote details page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in, `/vehicle/915/details` → Create quote, client form (last name `Produit2493-001`, `client.stage.947@yopmail.com`) → Save; vehicle step 2026-11-01 / 20000 → Save | `/quote/{id}/details` loads with heading `#{id} - Annul Produit2493-001` | URL = /quote/6461/details; heading = "#6461 - Annul Produit2493-001 1FAHP35NX8W239204"; flash "Client saved"; vehicle row = "CA$20,000.00, Delivery date: Nov 1, 2026" after the vehicle save | ✅ | Quote 6461 created. Heading also carries the VIN on Dev |
| 2 `[Pre-Condition]` | Open the warranty control, select the first term, Save | Back on details, a warranty row with term and amount, no contract | Modal program "Automation Test Program", term radio "20m/20000km" (only one), Sale price `1500`; Save → URL = /quote/6461/details?type=extended; flash "Warranty saved"; row "Extended warranty CA$1,500.00"; no contract number; Subtotal = CA$21,500.00 | ✅ | Sale price is required on Dev and not in the design — 1500 used |
| 3 | Open every row control without choosing a destructive item | Every control recorded, incl. where the cancel action sits | Row controls: a chevron (expands details) and a "⋯" button; the "⋯" menu lists "Edit" (/quote/6461/warranty/edit), "Generate Contract" (/quote/6461/warranty/generate-contract), "Delete" (/quote/6461/cancel-product/warranty, red) | ✅ | Q-002: the label is "Delete", a menu item under "⋯" |
| 4 `[Verification]` | Verify the warranty row offers a cancel/delete action | Visible and enabled | Menu item "Delete" visible = true, enabled = true | ✅ | Build check passed on this step |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_001-step4-WarrantyMenuDelete_pass.png` — the warranty row's open "⋯" menu with Edit, Generate Contract and Delete

### AP2493_002 — A Roadside Protection product with no contract shows a cancel action on the quote details page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote (last name `Produit2493-002`, `client.stage.948`), vehicle step | Details page with heading recorded | URL = /quote/6462/details; heading = "#6462 - Annul Produit2493-002 1FAHP35NX8W239204" | ✅ | Quote 6462 |
| 2 `[Pre-Condition]` | Open Roadside, fill the Test Data values, record submit buttons, save without a contract | Back on details, Roadside row with tier and amount; record whether a contract ID is shown | Modal "Product info": 5 tier radios; first = "Protection Hasards PNEU + ROUE \| Standard \| 12 months \| 200$*"; "Policy Sale price*" = 20000; only button = "Save". After Save: flash "The Roadside protection coverage has been saved successfully" plus two warnings "There's already a contract created for the same VIN. Contract #2697, 2698"; row "Roadside Protection CA$20,000.00"; no contract ID | ✅ | Dev Roadside form has no stock number, condition, odometer or "Save and Generate Contract" — the product is not finalized on save |
| 3 | Open every row control | Controls recorded | "⋯" menu: "Edit" (/quote/6462/road-side-protection), "Generate Contract" (/quote/6462/road-side-protection-create-contract), "Delete" (/quote/6462/cancel-product/roadside) | ✅ | Q-002: "Delete" |
| 4 `[Verification]` | Verify the Roadside row (no contract ID) offers a cancel/delete action | Visible and enabled | Menu item "Delete" visible = true, enabled = true | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_002-step4-RoadsideMenuDelete_pass.png` — Roadside row CA$20,000.00 with its "⋯" menu open showing Delete

### AP2493_003 — An Esthetic protection (Permaplate) product with no contract shows a cancel action on the quote details page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote (last name `Produit2493-003`, `client.stage.949`), vehicle step | Details page | URL = /quote/6463/details; heading = "#6463 - Annul Produit2493-003 1FAHP35NX8W239204" | ✅ | Quote 6463 |
| 2 `[Pre-Condition]` | Open Permaplate, first product and first enabled option, Save | Back on details, Esthetic protection row with product and amount, no contract link | First save went through with **no option ticked** (the option click was blocked by its label and Save ran anyway): row "Esthetic protection Cost: CA$0.00$". Re-opened `/quote/6463/permaplate`, ticked "Antirouille – Rust+Sound (combo) Cost: 80$" via its label, Save → flash "Esthetic protection quote saved successfully"; row "Esthetic protection Antirouille – Rust+Sound (combo) Cost: CA$80.00$", amount column "-"; Subtotal = CA$20,000.00 | ✅ | Product saved as designed on the second save. Observation: the page accepts a Permaplate quote with no option (0$) |
| 3 | Open every row control | Controls recorded | "⋯" menu: "Edit" (/quote/6463/permaplate), "Generate Contract" (/quote/6463/permaplate-create-contract), "Delete" (/quote/6463/cancel-product/permaplate) | ✅ | Q-002: "Delete" |
| 4 `[Verification]` | Verify the Esthetic protection row offers a cancel/delete action | Visible and enabled | Menu item "Delete" visible = true, enabled = true | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_003-step4-PermaplateMenuDelete_pass.png` — full page, Esthetic protection row with its "⋯" menu open

### AP2493_004 — A creditor insurance product quoted but without a contract shows a cancel action on the quote details page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote (last name `Produit2493-004`, `client.stage.950`), vehicle step | Details page | URL = /quote/6464/details; heading = "#6464 - Annul Produit2493-004 1FAHP35NX8W239204" | ✅ | Quote 6464 |
| 2 `[Pre-Condition]` | Add a financing (Financing values) → Save; `/quote/{id}/insurance` (Creditor values) → Get Quote | "Financing saved", then "Chubb insurance quote saved successfully"; creditor row with premium and no contract | "Add a financing" enabled; flash "Financing saved"; Payment amount = "494.91$ Monthly". Insurance form: Language English, Tax exempt No, Form "Monthly Premium PM30", Life Decreasing / 60 / Borrower → flash "Chubb insurance quote saved successfully"; row "Creditors insurance CA$18.58 /m", no contract number; Subtotal = CA$20,018.58 | ✅ | Creditor premium is counted in the Subtotal on Dev |
| 3 | Open every row control | Controls recorded | Chevron (coverage table) and "⋯" menu: "Edit" (/quote/6464/insurance), "Generate Contract" (/quote/6464/insurance/create-contract), "Delete" (/quote/6464/cancel-product/creditors) | ✅ | Q-002: "Delete" |
| 4 `[Verification]` | Verify the Creditors insurance row offers a cancel/delete action | Visible and enabled | Menu item "Delete" visible = true, enabled = true | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_004-step4-CreditorMenuDelete_pass.png` — full page, Creditors insurance row CA$18.58 /m with its menu open

### AP2493_005 — A GAP insurance product quoted but without a contract shows a cancel action on the quote details page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote (last name `Produit2493-005`, `client.stage.951`), vehicle step | Details page | URL = /quote/6465/details; heading = "#6465 - Annul Produit2493-005 1FAHP35NX8W239204" | ✅ | Quote 6465 |
| 2 `[Pre-Condition]` | Add a financing → Save; click the GAP control, fill, submit | "Financing saved"; GAP row with premium and no contract | Flash "Financing saved", payment 494.91$ Monthly. GAP control = the "+" on the "Gap Insurance" row, `href="/quote/6465/gap-insurance"`, opens a modal "Gap Insurance Quote": Rate table "TGGAP", Language "English", Tax exempt "No", Gap Term* = 60 → Get Quote → flash "GAP insurance quote saved successfully"; row "Gap Insurance CA$3,094.00"; no contract number; Subtotal = CA$23,094.00 | ✅ | The quick-quote GAP fields (DOB, payment, residual) are not on this form |
| 3 | Open every row control | Controls recorded | "⋯" menu: "Edit" (/quote/6465/gap-insurance), "Generate Contract" (/quote/6465/insurance/create-contract/gap), "Delete" (/quote/6465/cancel-product/gap) | ✅ | Q-002: "Delete" |
| 4 `[Verification]` | Verify the GAP row offers a cancel/delete action | Visible and enabled | Menu item "Delete" visible = true, enabled = true | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_005-step4-GapMenuDelete_pass.png` — full page, Gap Insurance row CA$3,094.00 with its menu open

### AP2493_006 — A creditor insurance product with a generated contract shows no cancel action and keeps its Download link — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quote/6276/details` and look for contract AVP000160 | Record whether the shortcut exists | Not run on Dev: 6276 is a staging quote id, and this run must never write to it nor rely on it. Step 2 was run instead | ✅ | Per the run's instructions the case creates its own contract |
| 2 `[Pre-Condition]` | Create a quote (last name `Produit2493-006`, `client.stage.952`), Financing, Creditor insurance (Get Quote), open `/quote/{id}/insurance/create-contract` and submit | Flash "Chubb insurance contract created successfully"; contract number and Download link | Quote 6466; "Financing saved"; "Chubb insurance quote saved successfully" (CA$18.58 /m). The Dev create-contract page is a long pre-filled form whose submit button is **"Generate Contract"** (not "Create Contract"); no required field was empty. After about 8 s: flash "Chubb insurance contract created successfully"; row "Creditors insurance AVP000169 CA$18.58 /m" with a PDF link `/quote/6466/chubb/insurance/contract-pdf`; no `HTTP` banner | ✅ | Contract AVP000169 created on Dev (permanent) |
| 3 | Open every control of the finalized row | Controls recorded | Controls: the chevron (expands the coverage table) and the PDF link. No "⋯" button. `a[href*="cancel-product"]` on the page = none | ✅ | — |
| 4 `[Verification]` | Verify no cancel/delete action and the Download link is present | No cancel/delete; Download visible | Cancel/delete action count = 0; PDF link `/quote/6466/chubb/insurance/contract-pdf` visible = true | ✅ | The guard on finalized products holds |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_006-step4-FinalizedNoDeleteDownload_pass.png` — full page, Creditors insurance row with AVP000169 and the PDF icon, no menu

### AP2493_007 — Choosing cancel opens a confirmation modal, and declining it leaves the warranty on the quote unchanged — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create "AP2493 quote W" (last name `Produit2493-007`, `client.stage.953`), vehicle step, warranty first term | Warranty row; quote id, term, amount and Subtotal recorded | Quote W = 6467; warranty "Program 26 20m/20000km, Start date Nov 1, 2026, Cost CA$1,000.00, Commission CA$500.00", amount CA$1,500.00 (sale price 1500); Subtotal = CA$21,500.00 | ✅ | — |
| 2 | Choose the warranty row's cancel/delete action | A modal opens | "⋯" → "Delete" opened a modal dialog; URL stayed /quote/6467/details?type=extended | ✅ | — |
| 3 `[Verification]` | With the modal open, verify the row is unchanged; record modal wording | Modal visible; row unchanged | Modal title = "Cancel a product - Extended warranty"; text = "Are you sure you want to cancel this product: Extended warranty?"; buttons = "Yes, cancel the product" (red) and "No" (link to /quote/6467/details); no close icon. Behind it: row "Extended warranty CA$1,500.00", Subtotal CA$21,500.00 | ✅ | Q-005 wording recorded, not judged |
| 4 | Click "No", then reload `/quote/{id}/details` | Modal closes without error | Modal closed; reload URL = /quote/6467/details; no error; alerts = none except the "Compliance documents sent" table's "No entities found" | ✅ | — |
| 5 `[Verification]` | Verify warranty row and Subtotal unchanged | Unchanged after reload | Row = "Extended warranty Program 26 20m/20000km … Cost CA$1,000.00 Commission CA$500.00 CA$1,500.00"; Subtotal = CA$21,500.00 | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_007-step3-ConfirmModalRowUnchanged_pass.png` — the confirmation modal with the warranty row still listed behind it
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_007-step5-WarrantyKeptAfterNo_pass.png` — after "No" and a reload, the warranty and Subtotal are unchanged

### AP2493_008 — Closing the confirmation modal without answering leaves the warranty on the quote unchanged — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quote/6467/details` | Warranty row; term, amount, Subtotal recorded | Warranty 20m/20000km, CA$1,500.00; Subtotal CA$21,500.00 | ✅ | Quote W reused while its warranty was active |
| 2 | Open cancel, close with the "×" icon | Modal closes, or "no close icon" recorded | No close icon: the only dismiss-type element in the modal is the "No" link | ✅ | Recorded: no close icon |
| 3 | Open cancel and press Escape; open again and click outside | Each method recorded | Escape: modal closed (`.modal.show` = none), URL unchanged. Click on the backdrop outside the dialog box: modal closed, URL unchanged | ✅ | Both dismiss methods close the modal |
| 4 | Close any open modal with "No", reload | Reload without error | No modal was open; reload of /quote/6467/details without error | ✅ | — |
| 5 `[Verification]` | Verify warranty and Subtotal unchanged | Unchanged | Row = "Extended warranty Program 26 20m/20000km … CA$1,500.00"; Subtotal = CA$21,500.00 | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_008-step5-WarrantyKeptAfterDismiss_pass.png` — warranty and Subtotal unchanged after the Escape and outside-click dismissals

### AP2493_009 — Confirming the cancellation removes the warranty, brings back the add action and lowers the Subtotal by its amount — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quote/6467/details`; record term, every amount, Subtotal and where it is | Recorded | Term 20m/20000km; amounts on the row: Cost CA$1,000.00, Commission CA$500.00, row amount CA$1,500.00; Subtotal CA$21,500.00, bottom of the "Summary of products" card (right column) | ✅ | — |
| 2 | "⋯" → Delete → "Yes, cancel the product" | Modal closes, no error page; record message | URL = /quote/6467/details; flash "The product has been cancelled"; no error page, no HTTP banner | ✅ | Q-008: "The product has been cancelled" |
| 3 | Reload `/quote/{id}/details` | Loads without error | Loaded without error | ✅ | — |
| 4 `[Verification]` | Verify (a) no warranty row, (b) add action back, (c) Subtotal after = before − warranty amount | All three hold | (a) row = "Extended warranty - None Selected -"; (b) "+" link `/quote/6467/warranty/edit` present; (c) Subtotal = CA$20,000.00 = 21,500.00 − 1,500.00; `cancel-product` links on page = none | ✅ | Q-003: the drop equals the row amount (sale price 1,500), not the Cost (1,000). Hard delete (AC3) can only be judged from the page: the product is gone from it |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_009-step2-AfterConfirmMessage_pass.png` — the "The product has been cancelled" flash and the emptied warranty row
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_009-step4-WarrantyRemovedSubtotalDrop_pass.png` — after reload: no warranty, "+" back, Subtotal CA$20,000.00

### AP2493_010 — After a warranty is cancelled, adding a new warranty creates a new row with the new term and amount — Step Results

#### Re-run — 2026-11-01T20:04:00Z → 20:05:11Z — PASS (current result)

Redesigned per R3 round 1 F-1: the new warranty is the same 20m/20000km term with Sale price `1800`, so the new row (CA$1,800.00) is told apart from the cancelled one (CA$1,500.00). Run on quote 6467, still in the state AP2493_009 left it. Fresh sign-in at the Dev `/login`.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in, open `/quote/6467/details` | No warranty row; add action shown; Subtotal CA$20,000.00 | Heading "#6467 - Annul Produit2493-007 1FAHP35NX8W239204"; row "Extended warranty - None Selected -" with "+" `/quote/6467/warranty/edit`; Subtotal CA$20,000.00 | ✅ | Cancelled warranty at hand: 20m/20000km, CA$1,500.00 (AP2493_009) |
| 2 | Warranty "+", select 20m/20000km, Sale price `1800`, Save | Back on details without error; record message | Modal: program "Automation Test Program", option "default 1", one radio "20m/20000km", "Sale price*". After Save: URL = /quote/6467/details?type=extended; flash "Warranty saved"; no error page, no `HTTP` text | ✅ | — |
| 3 | Reload `/quote/6467/details` | Loads without error | Loaded without error | ✅ | — |
| 4 `[Verification]` | Verify exactly one warranty row of CA$1,800.00 and Subtotal CA$21,800.00 | One row CA$1,800.00; Subtotal CA$21,800.00; no error page | Warranty rows = 1: "Extended warranty — Program 26, 20m/20000km, Start date: Nov 1, 2026, Cost: CA$1,000.00, Commission: CA$800.00", amount CA$1,800.00 (not CA$1,500.00); Subtotal = CA$21,800.00 = 20,000.00 + 1,800.00; no error page | ✅ | The freed slot takes a new warranty; the new row carries the new sale price (commission 800 = 1,800 − cost 1,000), not the cancelled row's values |

**Screenshots (re-run):**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_010-step4-NewWarrantyRow1800Subtotal21800_pass.png` — full page after reload: one Extended warranty row CA$1,800.00 (expanded: Program 26, 20m/20000km, Commission CA$800.00), Subtotal CA$21,800.00

#### First run — 2026-11-01 — BLOCKED (superseded by the re-run above)

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quote/6467/details` after AP2493_009 | No warranty row; add action shown | Row "Extended warranty - None Selected -"; "+" shown; Subtotal CA$20,000.00 | ✅ | — |
| 2 | Click the warranty add action, select the **second** term radio, Save | Back on details without error | The modal lists one program and **one** term radio only ("20m/20000km"). No second term exists for vehicle 915 on Dev. Modal closed with Escape; nothing saved | 🚫 | BLOCKED — test data not on dev: a second warranty term for vehicle 915 (Dev offers only "Automation Test Program" 20m/20000km) |
| 3 | Reload | — | Not run | 🚫 | Blocked at step 2 |
| 4 `[Verification]` | Verify one new row with the second term | — | Not run | 🚫 | To unblock: give vehicle 915 (or another Dev vehicle) a program with two terms, or rewrite the case to re-add the same term |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_010-step2-OnlyOneTermBlocked_blocked.png` — warranty modal on quote 6467 showing a single term radio (renamed in this log from `_fail` to `_blocked` per R3 F-3; the file was copied to the new name and the original `…_fail.png` is kept on disk because the R3 review record cites it)

### AP2493_011 — Cancelling the Permaplate product on a quote that also has a warranty leaves the warranty untouched and lowers the Subtotal — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create "AP2493 quote M" (last name `Produit2493-011`, `client.stage.954`), vehicle, warranty, Permaplate (first product, first enabled option), financing | Warranty row, Esthetic protection row, Financing panel; all values recorded | Quote M = 6468. Warranty 20m/20000km, Cost 1,000 / Commission 500, amount CA$1,500.00. Esthetic protection "Antirouille – Rust+Sound (combo) Cost: CA$80.00$", amount column "-". Financing: Financing 60 months, AutoCapital Canada, 25,000.00$, residual 0.00$, 6.9900%, payment 494.91$ Monthly. Subtotal = CA$21,500.00 (= vehicle 20,000 + warranty 1,500; the 80$ Permaplate cost is **not** in it) | ✅ | — |
| 2 | Esthetic protection "⋯" → Delete → "Yes, cancel the product" | Modal closes, no error | Modal "Cancel a product - Esthetic protection" / "Are you sure you want to cancel this product: Esthetic protection?"; confirmed; page stayed on /quote/6468/details without an error | ✅ | — |
| 3 | Reload and record Financing (Q-006) | Loads; financing recorded | Loaded without error. Financing unchanged: 25,000.00$, 0.00$, 60, 6.9900%, 494.91$ Monthly | ✅ | Q-006: financing not recalculated (payment unchanged; the Permaplate was never part of it) |
| 4 `[Verification]` | Verify (a) no Esthetic row and add action back, (b) warranty unchanged, (c) Subtotal after = before − Permaplate amount | All three hold | (a) row = "Esthetic protection -", "+" `/quote/6468/permaplate` present — holds. (b) warranty row = "Program 26 20m/20000km … CA$1,500.00" — holds. (c) Subtotal after = CA$21,500.00; expected 21,500.00 − 80.00 = CA$21,420.00 — **does not hold** | ❌ | The Permaplate cost (80$) is never added to the Subtotal on Dev — its amount column shows "-" — so cancelling it cannot lower the Subtotal. A dealer sees a Subtotal that leaves out an active Esthetic protection product |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_011-step4-PermaplateRemovedSubtotalUnchanged_fail.png` — full page after reload: no Esthetic row, warranty intact, Subtotal still CA$21,500.00

### AP2493_012 — After a Permaplate product is cancelled, adding Permaplate again creates a new row with the new option — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quote/6468/details` after AP2493_011 | No Esthetic row; add action; Subtotal recorded | Row "Esthetic protection -", "+" present; Subtotal CA$21,500.00 | ✅ | — |
| 2 | Add Permaplate: first product, a different option, Save | Back on details, no error; "already exists" is a FAIL | The Permaplate page opened with nothing ticked (the cancelled selection is not kept). Product "10 ans" + "Peinture – Céramique + Graphene" (option 17, 75$), which also ticked "Extra care (5 ans couverture )" (option 18, 70$); Cost 145$. Save → /quote/6468/details, flash "Esthetic protection quote saved successfully"; no error | ✅ | Different option from the cancelled one (option 20) |
| 3 | Reload | Loads without error | Loaded without error | ✅ | — |
| 4 `[Verification]` | Verify one Esthetic row with the new option, warranty unchanged, Subtotal rose by the new amount | One new row; Subtotal +145$ | Esthetic rows = 1: "Peinture – Céramique + Graphene, Extra care (5 ans couverture ) Cost: CA$145.00$" — holds. Warranty "… CA$1,500.00" — holds. Subtotal = CA$21,500.00; expected 21,500.00 + 145.00 = CA$21,645.00 — **does not hold** | ❌ | Same cause as AP2493_011: the Permaplate cost is not counted in the Subtotal. The freed slot itself works — a new row with the new options was created |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_012-step4-NewPermaplateSubtotalNotRaised_fail.png` — full page: new Esthetic row with 145$ options, Subtotal still CA$21,500.00

### AP2493_013 — Opening an archived quote with a product does not show an error, and whether a cancel action is offered is recorded — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | `/quotes` → Archived tab; read the first 10 ids from `data-href` | Up to 10 ids recorded | Archived tab = link `/quotes/archived` (a separate route on Dev). Ids: 6245, 6164, 6163, 6161, 6160, 6159, 6158, 6157, 6156, 6155 | ✅ | — |
| 2 | Open each until one has a product without a contract | One found | 6245 (first) has Roadside Protection CA$25,000.00 and Creditors insurance CA$18.58 /m, neither with a contract (its warranty has contract 26df1-829). The other nine carry only a warranty with a contract | ✅ | Archived quote 6245 (client "Vinh LeAVtage", vehicle 915) |
| 3 | Open every control of that row without confirming | Controls recorded for Q-004 | Roadside "⋯" menu on the archived quote: "Edit" (/quote/6245/road-side-protection), "Generate Contract" (/quote/6245/road-side-protection-create-contract), "Delete" (/quote/6245/cancel-product/roadside, enabled). Creditors row also carries /quote/6245/cancel-product/creditors. The quote header has Back and Send compliance documents but no Archive button. Nothing was confirmed | ✅ | Q-004: on an archived quote the cancel action is offered and enabled (recorded, not judged) |
| 4 `[Verification]` | Verify the archived quote renders without an error | No error page / HTTP 5xx | URL = /quote/6245/details; heading "#6245 - Vinh LeAVtage 1FAHP35NX8W239204"; no error page; no `HTTP` text; only alert = "No entities found" (compliance table) | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_013-step4-ArchivedQuoteRenders_pass.png` — full page of archived quote 6245 with the Roadside menu open (Delete offered)

### AP2493_014 — Cancelling a GAP product removes it and leaves the creditor insurance product on the same quote in place — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote (last name `Produit2493-014`, `client.stage.955`), vehicle, Add a financing | Financing panel; id and monthly payment recorded | Quote 6469; "Add a financing" enabled; payment 494.91$ Monthly | ✅ | — |
| 2 `[Pre-Condition]` | GAP control (record URL), fill, submit; then Creditor insurance → Get Quote | GAP and Creditors rows without contracts; amounts and Subtotal recorded | GAP URL `/quote/6469/gap-insurance` (modal), TGGAP / English / No / Gap Term 60 → "GAP insurance quote saved successfully"; then PM30, Life Decreasing 60 Borrower → "Chubb insurance quote saved successfully". Rows: Gap Insurance CA$3,094.00 (tax 463.33$, total 3,557.33$); Creditors insurance CA$20.88 /m ("creditor premium before"; equivalent single premium 1,001.65$, commission 300.49$); vehicle CA$20,000.00. Subtotal = CA$23,114.88 = 20,000 + 3,094 + 20.88, so the creditor premium **is** counted | ✅ | With GAP present the creditor premium is 20.88; on quote 6464 without GAP it was 18.58 |
| 3 | GAP "⋯" → Delete → "Yes, cancel the product"; reload | Reload without error; record message | Modal "Cancel a product - Gap Insurance"; flash "The product has been cancelled"; reload of /quote/6469/details without error, no `HTTP` text | ✅ | Q-008 message as in AP2493_009 |
| 4 `[Verification]` | Record creditor premium after; verify (a) no GAP row, add control back, (b) Creditors row still shown, (c) Subtotal after = before − GAP − (creditor before − after) | All three hold | Creditor premium after = CA$20.88 /m (unchanged). (a) row "Gap Insurance - None Selected -", "+" `/quote/6469/gap-insurance` present. (b) "Creditors insurance CA$20.88 /m" with its coverage table and its own Delete link. (c) Subtotal = CA$20,020.88 = 23,114.88 − 3,094.00 − (20.88 − 20.88) | ✅ | Q-007: the creditor premium did not change after the GAP was cancelled (it still includes the GAP-based 20.88, not the 18.58 seen without GAP) — recorded, not judged |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_014-step2-GapAndCreditorBefore_pass.png` — full page before cancelling: GAP CA$3,094.00, creditor CA$20.88 /m, Subtotal CA$23,114.88
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/AP2493_014-step4-GapRemovedCreditorKept_pass.png` — after cancel and reload: GAP gone, creditor kept, Subtotal CA$20,020.88

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| — | — | None after the AP2493_010 re-run. (First run: AP2493_010 was 🚫 — vehicle 915 offers a single warranty term on Dev; resolved by the R3 F-1 redesign, re-run PASS on 2026-11-01T20:05:11Z) |

---

## Recorded answers for the open Judgement questions (not judged)

| Question | What the Dev build does |
|---|---|
| Q-002 (label and place) | A red "Delete" item in each product row's "⋯" dropdown, under Edit and Generate Contract; route `/quote/{id}/cancel-product/{warranty\|roadside\|permaplate\|creditors\|gap}` |
| Q-003 (which amount feeds the Subtotal) | The row amount (warranty sale price 1,500, not Cost 1,000; Roadside policy sale price; GAP total premium 3,094 before tax; creditor monthly premium). The Permaplate cost is **not** in the Subtotal at all (AP2493_011/012) |
| Q-004 (archived quote) | Delete is offered and enabled on archived quote 6245 |
| Q-005 (modal wording) | Title "Cancel a product - {product}"; text "Are you sure you want to cancel this product: {product}?"; buttons "Yes, cancel the product" and "No"; no × icon; Escape and a backdrop click close it |
| Q-006 (financing) | Not recalculated — payment 494.91$ before and after a cancellation |
| Q-007 (creditor after GAP cancel) | Creditor premium stays 20.88$/m after the GAP is cancelled (it was 18.58$/m on a quote that never had GAP) |
| Q-008 (success message) | Flash "The product has been cancelled" |

---

## Test data left on Dev

| Record | Created by | State at end of run |
|---|---|---|
| Quote 6461 (`Produit2493-001`, client.stage.947) | AP2493_001 | Warranty 20m/20000km, 1,500 — active, no contract |
| Quote 6462 (`Produit2493-002`, client.stage.948) | AP2493_002 | Roadside tier 1, 20,000 — active, no contract |
| Quote 6463 (`Produit2493-003`, client.stage.949) | AP2493_003 | Esthetic protection Antirouille 80$ — active, no contract |
| Quote 6464 (`Produit2493-004`, client.stage.950) | AP2493_004 | Financing + Chubb creditor quote 18.58$/m — no contract |
| Quote 6465 (`Produit2493-005`, client.stage.951) | AP2493_005 | Financing + GAP quote 3,094 — no contract |
| Quote 6466 (`Produit2493-006`, client.stage.952) | AP2493_006 | Financing + **Chubb creditor contract AVP000169** (permanent) |
| Quote 6467 "AP2493 quote W" (`Produit2493-007`, client.stage.953) | AP2493_007–010 | Warranty cancelled (deleted) by AP2493_009; then a new warranty 20m/20000km, Sale price 1,800 (Commission 800), added by the AP2493_010 re-run — active, no contract; Subtotal CA$21,800.00 |
| Quote 6468 "AP2493 quote M" (`Produit2493-011`, client.stage.954) | AP2493_011–012 | Warranty 1,500; financing; Esthetic protection (Peinture + Extra care, 145$) re-added — Antirouille 80$ deleted |
| Quote 6469 (`Produit2493-014`, client.stage.955) | AP2493_014 | Financing + creditor quote 20.88$/m; GAP deleted |

Nine quotes and their clients, one Chubb contract. Quotes cannot be deleted; the `cleanup` source is `missing`.

---

## Environment Observations

- Dev was responsive throughout; the Chubb quote calls took 2–5 s and the contract call about 8 s. No HTTP 5xx and no `alert`-role "HTTP" banner was seen.
- The Permaplate page accepted a save with a product but **no option** ticked and stored an Esthetic protection row of "Cost: CA$0.00$" (quote 6463, first attempt). Not in this ticket's scope; noted for the author.
- Saving a Roadside product on vehicle 915 shows the warning "There's already a contract created for the same VIN. Contract #2697, 2698" twice (duplicated flash).
- On Dev the "Summary of products" table replaces the staging Warranty section, and quote headings append the VIN ("#6461 - Annul Produit2493-001 1FAHP35NX8W239204").

## Knowledge gaps closed this run

- The GAP insurance route and form on a quote (`/quote/{id}/gap-insurance`, modal) and the Dev "Summary of products" table with its "⋯" menus and cancel-product routes were not mapped; written to `qa-artifacts/qa-docs/quote-creation.md` as labelled Dev entries (2026-11-02, AP-2493 s4), with the navigation index row updated.
- The Dev Chubb create-contract page (submit "Generate Contract") and the archived-quote route `/quotes/archived` were added to the same Dev section.
