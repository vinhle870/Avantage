# Execution Log — AP-2496: Download all finalized documents from a quote in one click

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (inside stlc-ticket-pipeline, `--from s4 --until s4c`)
**Date:** 2026-11-02
**Environment:** Dev (v2dev)
**Base URL:** https://v2dev.garantieavantageplus.ca/ (the "Dev Environment" section of the `env` source — chosen by the user for this run; v2staging was not opened)
**Browser:** Chromium (Playwright), viewport 1280 × 800
**Duration:** 2026-11-02 04:42 → 04:51 (UTC+7)
**Login:** the shared dealer account (dealer 1380, "Test QA staging") and the same account on the Admin portal, both read from the `env` source and typed only into the login forms
**Test cases:** `AP2496_TestCases_001-005.md`, `AP2496_TestCases_006-009.md` (as designed after three review rounds; not changed)
**`env-check` source:** missing — no smoke check file exists. The environment health check was run by the orchestrator before this run and passed.

| Metric | Value |
|---|:---:|
| Total test cases | 9 |
| Passed | 2 |
| Failed | 1 |
| Blocked | 6 |
| Skipped | 0 |
| **Pass rate** | **22% (2 of 9)** |

**What this run shows in one paragraph.** The "Download all documents" action is deployed on Dev: it is shown on quotes that hold a contract and hidden on quotes that hold none (AP2496_002, AP2496_003 PASS). But the download itself fails: `/quote/{id}/documents/download` returned HTTP 500 (the French "Erreur — Désolé, l'application éprouve des difficultés techniques" page) for **every quote tried** — quote 6488 in AP2496_008 (2 of 2), and, as supplementary evidence outside the designed cases, quotes 6040 and 6480 which really hold contracts. On quote 6040 the two individual documents the merge should combine both download correctly (warranty PDF 200, 5 pages; sales-contract PDF 200, 6 pages), so the 500 comes from the merged download, not from a broken source document. Six cases could not reach their step under test because their set-up needs a roadside contract, and roadside contract generation returns HTTP 500 on Dev (known bug **AP-2518**, reproduced on quotes 6484, 6487 and 6489 in this run).

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2496_001 | A quote with one generated roadside contract shows exactly one "Download all documents" action | High | 🚫 | 1 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_001-step2-RoadsideCreateContract500_fail.png` | Blocked at step 2: AP-2518 — roadside create-contract HTTP 500 (2 of 2) on quote 6484 |
| AP2496_002 | A quote whose only optional product was removed before its contract was generated shows no download action | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_002-step4-NoDownloadAllAfterRemoval_pass.png` | Branch (a): Save made no contract; after Delete no action shown (quote 6485) |
| AP2496_003 | A new quote with no product at all — the page loads without error and the download action state is recorded | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_003-step4-NoProductActionHidden_pass.png` | No fault; Q-001 outcome: action hidden on a product-less quote (6486) |
| AP2496_004 | "Download all documents" on a quote with two contracts returns one PDF named with the quote id | High | 🚫 | 0 | 0 | — (same failure as AP2496_001 step 2) | Blocked at step 1: AP-2518 — roadside contract cannot be generated on Dev |
| AP2496_005 | The merged PDF holds every page of each individual contract, and each individual download still works | High | 🚫 | 0 | 0 | — (same failure as AP2496_001 step 2) | Blocked at step 1: AP-2518 — roadside contract cannot be generated on Dev |
| AP2496_006 | A product removed before finalization adds no page to the merged PDF, and the roadside contract is still merged | High | 🚫 | 0 | 0 | — (same failure as AP2496_001 step 2) | Blocked at step 1: AP-2518 — roadside contract cannot be generated on Dev |
| AP2496_007 | A cancelled warranty contract adds no page to the merged PDF, and the roadside contract is still merged | High | 🚫 | 0 | 0 | — (same failure as AP2496_001 step 2) | Blocked at step 1: AP-2518; Q-006 cancel screen not reached |
| AP2496_008 | Opening the download-all address directly for a quote with no contract causes no server error and returns no other quote's documents | Medium | ❌ | 2 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_008-step4-DownloadAllQuoteB500_fail.png` | `/quote/6488/documents/download` → HTTP 500, 2 of 2 (step 1 set-up blocked by AP-2518) |
| AP2496_009 | Requesting the download-all address with another dealership's quote id — the response is recorded and causes no server error | High | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_009-step2-AdminContractNoQuoteId_blocked.png` | Blocked: AP-2518 (step 1) and "no known quote id of another dealership" (step 2) |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

**Execution order:** High first (001, 002, 004–007, 009), then Medium (003, 008) — 003 was run right after 002 because both create a product-less quote; the order does not change any result.

---

## Step-by-Step Results

### AP2496_001 — A quote with one generated roadside contract shows exactly one "Download all documents" action — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in, `/vehicle/915/details` → Create quote, client last name `Download2496-001` (`client.stage.961@yopmail.com`) → Save; vehicle Delivered at 2026-11-01, Price 20000 → Save | `/quote/{id}/details` with heading `#{id} - Docs Download2496-001`; id recorded | URL = `/quote/6484/details`; flash "Vehicle saved"; heading = "#6484 - Docs Download2496-001 1FAHP35NX8W239204" | ✅ | Quote **6484** created. Dev appends the VIN to the heading |
| 2 `[Pre-Condition]` | Road Side Protection: first tier, sale price 20000 → Save; then Generate Contract (`/quote/6484/road-side-protection-create-contract`) | Page returns to details; Roadside row shows a contract number and its download link | Roadside form on Dev has only tier + "Policy Sale price" (no VIN/stock/condition/odometer fields, no "Save and Generate Contract"). Save → flash "The Roadside protection coverage has been saved successfully", row "CA$20,000.00", ⋯ menu Edit · Generate Contract · Delete. Generate Contract → HTTP 500, French technical-error page; retried → HTTP 500 again | 🚫 | **BLOCKED by AP-2518** (roadside create-contract HTTP 500 on dev), 2 of 2 tries. The page also warned "There's already a contract created for the same VIN. Contract #2697, 2698" |
| 3 | Reload; record position; French label; back to EN | Recorded for Q-005 / Q-001 | Not run on 6484 (no contract). Quote 6484 itself shows **no** "Download all documents" action (roadside product saved without contract) | 🚫 | Blocked by step 2. See supplementary evidence S-1 for the position and French label read on quote 6040 |
| 4 `[Verification]` | Count "Download all documents" controls | Exactly one | Not run | 🚫 | Blocked by step 2 (AP-2518) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_001-step2-RoadsideCreateContract500_fail.png` — the French "Erreur" page returned by roadside Generate Contract on quote 6484
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_001-step2-Quote6484NoContractNoAction_blocked.png` — final state: quote 6484 with a roadside product but no contract, and no "Download all documents" action

### AP2496_002 — A quote whose only optional product was removed before its contract was generated shows no download action — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote, client `Download2496-002` (`client.stage.962@yopmail.com`); vehicle 2026-11-01 / 20000 | Heading `#{id} - Docs Download2496-002`; id recorded | URL = `/quote/6485/details`; flash "Vehicle saved"; heading = "#6485 - Docs Download2496-002 1FAHP35NX8W239204" | ✅ | Quote **6485** |
| 2 `[Pre-Condition]` | Permaplate: first product radio ("10 ans"), first enabled option → Save | Esthetic protection row shows the product; branch (a) or (b) recorded | First Save went through with no option ticked (the option click was intercepted by its label); re-opened `/quote/6485/permaplate`, ticked "Antirouille – Rust+Sound (combo)" (Cost 80$) via its label → Save → flash "Esthetic protection quote saved successfully"; row = "Esthetic protection · Antirouille – Rust+Sound (combo) Cost: CA$80.00$", amount "-". **Branch (a)**: no contract number (no `PNA-` text) and no `permaplate-contract-download` link; the row's menu still offered Generate Contract | ✅ | Saving a Permaplate product does **not** generate a contract on Dev (answers Known blocker 3 / 5). No "Download all documents" shown while only an un-contracted product existed |
| 3 | Row ⋯ → Delete → confirm | Row no longer shows an active product; action label recorded for Q-010 | Menu item label **"Delete"** (`/quote/6485/cancel-product/permaplate`); modal "Cancel a product - Esthetic protection" / "Are you sure you want to cancel this product: Esthetic protection?"; clicked "Yes, cancel the product" → back on details | ✅ | Q-010 observation: the remove action is labelled "Delete" in the menu and "cancel the product" in its confirmation |
| 4 `[Verification]` | Reload; note contracts / download links; look for "Download all documents"; record quote state for Q-001 | No active contract remains → no "Download all documents" action | Rows: Extended warranty, Roadside Protection, Gap Insurance, Creditors insurance = "- None Selected -"; Esthetic protection = "-". Contract/PDF links on page = none. "Download all documents" visible = false. No status badge and no "finalized" text on the page | ✅ | Judged branch: no contract remained → criterion judged → PASS. Q-001: the quote shows no state badge |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_002-step4-NoDownloadAllAfterRemoval_pass.png` — quote 6485 after removing the Esthetic protection product: every product row empty and no download action

### AP2496_003 — A new quote with no product at all — the page loads without error and the download action state is recorded — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote, client `Download2496-003` (`client.stage.963@yopmail.com`); vehicle 2026-11-01 / 20000 | Heading `#{id} - Docs Download2496-003` | URL = `/quote/6486/details`; heading = "#6486 - Docs Download2496-003 1FAHP35NX8W239204"; flash "Vehicle saved" | ✅ | Quote **6486** |
| 2 | Look at every section for a "Download all documents" control | No product contract number shown | All five product rows "- None Selected -" / "-"; contract numbers on page = none; "Download all documents" present = false | ✅ | An info alert "No entities found" sits in the Compliance documents sent section — not an error |
| 3 | If the control is present, click it and record the response | No error page / 5xx; record for Q-001 | Control not present — nothing to click | ✅ | Step not applicable; recorded |
| 4 `[Verification]` | Check page and any download for objective faults | No error page or 5xx; no other quote's documents | Page loaded with HTTP 200 and no error; no download made. **Q-001 outcome: the action is hidden on a quote with no product** | ✅ | PASS — record-only case, no objective fault |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_003-step4-NoProductActionHidden_pass.png` — quote 6486 with no product and no download action

### AP2496_004 — "Download all documents" on a quote with two contracts returns one PDF named with the quote id — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote `Download2496-004` + roadside contract | Roadside contract number shown | Not attempted for this case. Roadside Generate Contract returned HTTP 500 on every attempt in this run (quote 6484 ×2, 6487, 6489) and on 6479/6480 in the AP-2494 run | 🚫 | **BLOCKED by AP-2518**. No quote was created for this case, to avoid leaving another broken quote on Dev |
| 2 `[Pre-Condition]` | Financing + Chubb creditor contract | Creditor contract number | Not run | 🚫 | Blocked by step 1 |
| 3 | Individual downloads + click "Download all documents" | Both individual PDFs; action response recorded | Not run | 🚫 | Blocked by step 1. See S-2/S-3: the merged download returns HTTP 500 on quotes that do hold contracts |
| 4 `[Verification]` | HTTP 200, `application/pdf`, file name with quote id, more pages than each part | — | Not run | 🚫 | Blocked by step 1 |

### AP2496_005 — The merged PDF holds every page of each individual contract, and each individual download still works — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote `Download2496-005` + roadside contract | Roadside contract number | Not attempted — same reason as AP2496_004 step 1 | 🚫 | **BLOCKED by AP-2518** |
| 2 `[Pre-Condition]` | Financing + Chubb creditor contract | Creditor contract number | Not run | 🚫 | Blocked by step 1 |
| 3 | Individual downloads | 200 `application/pdf` | Not run | 🚫 | Blocked by step 1. Note S-2: the Chubb contract PDF of existing quote 6480 itself returns HTTP 500 on Dev |
| 4 | Click "Download all documents" | One PDF | Not run | 🚫 | Blocked by step 1 |
| 5 `[Verification]` | Merged file contains both contracts' pages | — | Not run | 🚫 | Blocked by step 1 |

### AP2496_006 — A product removed before finalization adds no page to the merged PDF, and the roadside contract is still merged — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote `Download2496-006` + roadside contract | Roadside contract number | Not attempted — same reason as AP2496_004 step 1 | 🚫 | **BLOCKED by AP-2518** |
| 2 `[Pre-Condition]` | Permaplate product → Save, record branch, Delete | Branch recorded | Not run for this case. AP2496_002 showed on the same day that Save makes no contract (branch (a)) and Delete leaves no contract | 🚫 | Blocked by step 1 |
| 3 | Roadside PDF + merged download | Both 200 `application/pdf` | Not run | 🚫 | Blocked by step 1 |
| 4 `[Verification]` | No excluded-product words on non-roadside pages | — | Not run | 🚫 | Blocked by step 1 |

### AP2496_007 — A cancelled warranty contract adds no page to the merged PDF, and the roadside contract is still merged — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote `Download2496-007` + roadside contract | Roadside contract number | Not attempted — same reason as AP2496_004 step 1 | 🚫 | **BLOCKED by AP-2518** |
| 2 `[Pre-Condition]` | Warranty + Generate Contract | Warranty contract number | Not run | 🚫 | Blocked by step 1 (warranty contracts can be generated on Dev — quote-creation.md *On Dev*) |
| 3 `[Pre-Condition]` | Cancel the warranty contract (dealer `/warranty`, admin) | Cancelled status | Not run | 🚫 | Blocked by step 1; Q-006 (no known cancel screen) still open |
| 4 | Merged download | 200 `application/pdf` | Not run | 🚫 | Blocked by step 1 |
| 5 `[Verification]` | Warranty number absent from merged file | — | Not run | 🚫 | Blocked by step 1 |

### AP2496_008 — Opening the download-all address directly for a quote with no contract causes no server error and returns no other quote's documents — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Quote A (`Download2496-008A`, `client.stage.964@yopmail.com`), vehicle, roadside → generate contract | Roadside contract number and "Download all documents" action; id recorded | Quote **6487** created ("#6487 - Docs Download2496-008A …"); roadside saved; Generate Contract `/quote/6487/road-side-protection-create-contract` → HTTP 500 | 🚫 | **BLOCKED by AP-2518** — quote A has no contract and so no action of its own |
| 2 `[Pre-Condition]` | Quote B (`Download2496-008B`, `client.stage.965@yopmail.com`), vehicle saved, no product | Heading `#{id} - Docs Download2496-008B`; id recorded | URL = `/quote/6488/details`; heading = "#6488 - Docs Download2496-008B 1FAHP35NX8W239204"; flash "Vehicle saved"; no product; no download action | ✅ | Quote **6488** |
| 3 | Open the action's address with quote B's id | Record status, page/file, `Content-Type` | Quote A could not supply its own `href`, so the address shape was taken from the same action on quotes 6040 and 6480 on Dev: `href="/quote/{id}/documents/download"`. Opened `/quote/6488/documents/download` → **HTTP 500**, `text/html; charset=UTF-8`, page heading "Erreur Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." No redirect, no file. **Re-capture 2026-11-01T22:01:59Z (UTC), R3 F-1:** browser network-request list shows `[GET] https://v2dev.garantieavantageplus.ca/quote/6488/documents/download => [500]`, same "Erreur" heading | ✅ | Response recorded. The address shape is the action's own `href` on Dev, so only the source quote differs from the design. Address + status evidence: `AP2496_008-step4-NetworkRequests-6488_fail.txt` |
| 4 `[Verification]` | Check for objective faults: not HTTP 5xx; no file with quote A's documents | Not an HTTP 5xx | **HTTP 500**, retried → HTTP 500 again (2 of 2). No file returned, so no quote A document could leak. **Re-capture 2026-11-01T22:01:59Z–22:02:13Z (UTC):** `/quote/6488/documents/download` → **[500]** twice more (network list, saved to file); in the same signed-in session `/quote/6488/details` loaded normally (heading "#6488 - Docs Download2496-008B 1FAHP35NX8W239204"), so the 500 is not a sign-in or set-up fault | ❌ | **FAIL** — the merged-download address crashes with a server error instead of answering. A dealer who opens a bookmarked or typed address gets the generic error page. The 500 is the download itself, not set-up: quote B's page loaded normally. Result unchanged by the re-capture (4 of 4 tries → 500) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_008-step1-RoadsideCreateContract500_blocked.png` — roadside Generate Contract HTTP 500 on quote A (6487)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_008-step4-DownloadAllQuoteB500_fail.png` — `/quote/6488/documents/download` showing the French technical-error page (HTTP 500). Page only — shows neither address nor status (R3 F-1); see the two files below
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_008-step4-NetworkRequests-6488_fail.txt` — **address + status evidence**: the browser network-request list, `[GET] https://v2dev.garantieavantageplus.ca/quote/6488/documents/download => [500]` (2 of 2), re-captured 2026-11-01T22:01:59Z (UTC); method, URL and status only
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_008-step4-DownloadAllQuote6488-Recapture500_fail.png` — the page returned by that re-captured request (French "Erreur" page, dealer "Test QA staging" signed in); the page capture has no address bar, so the `.txt` file above is what ties the 500 to the address

### AP2496_009 — Requesting the download-all address with another dealership's quote id — the response is recorded and causes no server error — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Own quote (`Download2496-009`, `client.stage.966@yopmail.com`), vehicle, roadside → generate contract; record the action's `href` | Roadside contract number and the action | Quote **6489** created; roadside saved; Generate Contract → HTTP 500; no contract, no action on 6489 | 🚫 | **BLOCKED by AP-2518** |
| 2 `[Pre-Condition]` | Admin `/admin/permaplate-contracts` → a row of another dealer → `/admin/permaplate-contract/{id}`; record quote id, dealer, client | Another dealership's quote id recorded | Signed in to the Admin portal. Rows of other dealers: 16 and 15 (Test Dealer 2), 14 and 10 (Permaplate test Drive IP), 11 (LNQ Test Portal). Contract 16's page shows only heading "Esthetic protection Contract PNA-0000000016" and an invoice table (invoice 936, Ken Nguyen, Kia Forte 2017, Test Dealer 2) — **no quote id**. Pages 15, 14, 11 and 10 contain no `/quote/{id}` link and no quote number either | 🚫 | **BLOCKED "no known quote id of another dealership"** (Known blocker 4). No quote id was guessed |
| 3 | Open the address with the other dealership's quote id | Record response | Not run | 🚫 | Blocked by step 2 |
| 4 `[Verification]` | Not an HTTP 5xx; record for Q-008 | — | Not run | 🚫 | Blocked. S-3 suggests the address returns HTTP 500 for any id on Dev today |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_009-step1-RoadsideCreateContract500_blocked.png` — roadside Generate Contract HTTP 500 on quote 6489
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_009-step2-AdminContractNoQuoteId_blocked.png` — admin contract PNA-0000000016 page showing no quote id

---

## Supplementary evidence (not a test-case result)

Read-only checks on quotes that already existed on Dev, made because six designed cases could not reach the download. They change no test-case status; they tell the developer where the fault is.

| # | Quote | What was requested | Result |
|---|---|---|---|
| S-1 | 6040 (archived; warranty APOP01-671, sale "11111") | The quote page in EN and FR | Exactly **one** "Download all documents" link, `href="/quote/6040/documents/download"`, `target="_blank"`, in the last row of the "Summary of products" table directly under Subtotal. French label (`?_locale=fr`): **"Télécharger tous les documents"**. Locale switched back with `?_locale=en`. (Q-005 observation) |
| S-2 | 6480 (Chubb creditor contract AVP000170) | `/quote/6480/chubb/insurance/contract-pdf` and `/quote/6480/documents/download`, and a click on the action | Both **HTTP 500** (`text/html`). The click opened a new tab with the French "Erreur" page |
| S-3 | 6040 | `/warranty/671/pdf`, `/quote/6040/sales/pdf`, `/quote/6040/documents/download` (×2) and a click on the action | Warranty PDF **200** `application/pdf`, `inline; filename=contrat.pdf`, 5 pages; sales PDF **200** `application/pdf`, `inline; filename=contrat.pdf`, 6 pages; merged download **HTTP 500** both times, and the click opened the French "Erreur" page in a new tab |
| S-4 | 6486 (no product) | `/quote/6486/documents/download` | **HTTP 500**, no redirect |

Page counts were taken by counting `/Type /Page` objects in the fetched bytes.

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/Supplementary-Quote6480-DownloadAll500.png` — "Download all documents" on quote 6480 opens the HTTP 500 error page
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/Supplementary-Quote6040-DownloadAll500.png` — the same on quote 6040, whose two individual PDFs download correctly
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/Supplementary-NetworkRequests-6040_fail.txt` — **address + status evidence for S-3**: `[GET] https://v2dev.garantieavantageplus.ca/quote/6040/documents/download => [500]` (2 of 2), re-captured 2026-11-01T22:02:14Z (UTC); method, URL and status only
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/Supplementary-Quote6040-DownloadAll500-Recapture.png` — the page returned by that re-captured request (French "Erreur" page)

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2496_001 | 🚫 | AP-2518 — roadside Generate Contract returns HTTP 500 on Dev (quote 6484, 2 of 2). Fix AP-2518 first |
| AP2496_004 | 🚫 | AP-2518 — the case needs a roadside contract; not attempted again after four 500s in this run |
| AP2496_005 | 🚫 | AP-2518 — same |
| AP2496_006 | 🚫 | AP-2518 — same |
| AP2496_007 | 🚫 | AP-2518 — same; Q-006 (no known screen cancels a warranty contract) also still open |
| AP2496_009 | 🚫 | AP-2518 (step 1) and "no known quote id of another dealership": admin Esthetic protection contract pages on Dev show no quote id (step 2) |

AP-2512 (Permaplate contract PDF download HTTP 500) did not block any step: no case reached a Permaplate contract, because saving a Permaplate product makes no contract.

---

## Gate C (C1 check for s4c)

One FAIL: AP2496_008. Rule C1 needs a sentence in the requirement capture or a ticket comment stating that the actual result (an HTTP 500 from the download address) is intended. The capture has no such sentence (its only comment, Ken Nguyen 2026-10-22, is about PR review), so **C1 does not hold** and there is no "Not a bug" decision. **s4c is skipped.** Rules C2–C4 (duplicate search and filing) belong to s5 and the R3 review, which run after this stage.

---

## Environment Observations

- **Dev forms differ from the designed (staging) steps.** The roadside page on Dev has only the tier radios and "Policy Sale price" — no VIN, stock number, vehicle condition or odometer fields and no "Save and Generate Contract" button. The contract is generated from the Roadside row's ⋯ menu → Generate Contract, which is where AP-2518 fails.
- The quote heading on Dev ends with the VIN ("#6485 - Docs Download2496-002 1FAHP35NX8W239204"); the designed heading check was read as matching.
- On the Permaplate page the option checkbox cannot be clicked directly (its label intercepts the click); click the label. Quote 6485 was saved once with no option before the option was ticked and saved again — the final state is the designed one.
- Delivery date of the vehicle step was already 2026-11-01 (server date, UTC) on every quote.
- **Records left on Dev:** quotes 6484 (roadside product, no contract), 6485 (Permaplate product removed), 6486 (no product), 6487 (roadside product, no contract), 6488 (no product), 6489 (roadside product, no contract); client inboxes `client.stage.961` to `client.stage.966@yopmail.com`. No contract was created. The `cleanup` source is missing, so nothing was removed. Read-only checks touched quotes 6040 and 6480 and admin contracts 10, 11, 14, 15, 16 without changing them.

---

## Re-run — AP2496_008 steps 3–4 evidence re-capture (R3 round 1, F-1) — 2026-11-01T22:01Z–22:03Z (UTC) / 2026-11-02 05:01–05:03 (UTC+7)

**Why:** review R3 round 1 finding F-1 (Blocker) — the step-4 screenshot showed only the generic "Erreur" page, with no address and no status, so nothing on disk tied the HTTP 500 to `/quote/6488/documents/download`.
**Scope:** AP2496_008 steps 3–4 only, plus supplementary S-3 (quote 6040). No other case was touched. **Read-only:** nothing was saved, created or changed on Dev.
**Environment:** Dev (v2dev), the "Dev Environment" section of the `env` source; v2staging was not opened. Signed in as the shared dealer account (credential typed only into the login form).
**Method:** after sign-in, opened each address directly in the browser, then read the browser's network-request list (`browser_network_requests`) and saved only the method, URL and status lines to a text file next to the screenshots. No cookie, token or credential is in those files. Each address was opened twice.

| Address | Tries | Status | Page shown | Evidence |
|---|:---:|:---:|---|---|
| `/quote/6488/documents/download` (AP2496_008, quote B) | 2 | **500**, 500 | French "Erreur — Désolé, l'application éprouve des difficultés techniques…" | `AP2496_008-step4-NetworkRequests-6488_fail.txt`, `AP2496_008-step4-DownloadAllQuote6488-Recapture500_fail.png` |
| `/quote/6040/documents/download` (S-3, quote with warranty + sales contract) | 2 | **500**, 500 | same French "Erreur" page | `Supplementary-NetworkRequests-6040_fail.txt`, `Supplementary-Quote6040-DownloadAll500-Recapture.png` |
| `/quote/6488/details` (control, same session) | 1 | loaded normally (no HTTP error reported) | heading "#6488 - Docs Download2496-008B 1FAHP35NX8W239204" | — |

**Result:** the HTTP 500 still reproduces (AP2496_008: 4 of 4 tries across both captures; quote 6040: 4 of 4 including S-3). **AP2496_008 stays ❌ FAIL**; counts unchanged (2 PASS · 1 FAIL · 6 BLOCKED). The control shows the session was signed in and quote 6488 itself is healthy, so the 500 belongs to the download address. The PNG captures are page-only (no address bar); the `.txt` files are the evidence that shows address and status together.

The browser tab was closed after the capture.
