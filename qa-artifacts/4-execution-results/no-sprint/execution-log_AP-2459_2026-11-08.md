# Execution Log — AP-2459 (bug re-test)

**Ticket:** AP-2459 — [BUG-001][AP2446_001] Permaplate contract generation returns HTTP 500 when Financing company is left unselected (High)
**Spec ID:** AP2459 · **Run folder:** no-sprint
**Environment:** Dev
**Executed by:** QA Agent — Manual Executor Skill (stlc-worker, `--from execute --until correct-cases`)
**Date:** 2026-11-08
**Base URL:** https://v2dev.garantieavantageplus.ca/ (Admin portal and Dealer portal, dealer 1380 "Test QA staging", shared account from the `env` source's Dev section — credentials typed only into the login forms, not written here)
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800, English UI (`?_locale=en`)
**Duration:** 2026-11-08T03:02:46Z → 2026-11-08T03:09:58Z
**Test-case file:** `qa-artifacts/3-test-cases/AP2459_TestCases_001-003.md` (designed 2026-11-01, Gate B approved by qa-reviewer R2 round 1, rule B3)
**Why this run:** bug re-test on the QA's decision of 2026-11-08. AP-2459 is in Jira status "QA" (not "QC"); the QA asked for it to be re-tested now, on Dev only.
**Pre-checks:** tracker preflight and environment health check passed before dispatch (orchestrator). The `env-check` source is `missing`, so no separate smoke test was run; the admin and dealer logins, vehicle 915, quote, Permaplate, contract-list and invoice pages all loaded normally.
**Execution Context vs sources:** the case file's Execution Context names v2staging; this run used Dev, as `execution_env` in `qa-config/tools.md` requires. Every route the cases name exists on Dev and answered as described below.

---

## Execution Summary

| Metric | Value |
|---|:---:|
| Total test cases | 3 |
| Passed | 2 |
| Failed | 0 |
| Blocked | 0 |
| Skipped | 1 |
| Not Run | 0 |
| **Pass rate** | **100% (2 PASS of 2 cases counted; 1 SKIPPED by the case's own rule is left out)** |

**In one sentence:** the reported crash is gone on Dev — leaving "Financing company" on "Choose" and clicking "Generate Contract" no longer shows the French technical-error page; the build now **refuses** the submission and shows "ERROR This value should not be blank." directly above the Financing company field (branch (b) of AP2459_001), while choosing a financing company still creates the contract and its invoice (AP2459_002). Because a contract without a financing company can no longer be created, AP2459_003 is SKIPPED by its own step 2 rule.

**Which branch the build chose (record-only, ticket Expected Result):** branch **(b)** — the form refuses a blank financing company with a message beside the field. This differs from the earlier Dev fact of 2026-11-02 ("leaving it is accepted on Dev", AP-2428) and from the AP-2446 staging re-test of 2026-09-13; it is recorded, not judged.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2459_001 | Generating an Esthetic protection contract with no financing company chosen no longer shows a server error page | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/AP2459_001-step4-BlankCompanyRefusedWithFieldMessage_pass.png` | Branch (b): POST 200, form refused with message above Financing company; no 500, no contract |
| AP2459_002 | Generating an Esthetic protection contract with a financing company chosen still succeeds and lists the contract | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/AP2459_002-step5-ContractRowFinance2459Listed_pass.png` | AutoCapital Canada → PNA-0000000021, invoice 945 |
| AP2459_003 | The PDF of a contract created with no financing company downloads without a server error | Medium | ⏭️ | 1 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/AP2459_003-step2-FallbackQuoteRefusedBlankCompany_skipped.png` | SKIPPED by step 2 rule: blank company refused, so no such contract can exist |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Notes applied during execution (step substitutions on the current Dev UI)

- **Entry route unchanged.** `/vehicle/915/details` → "Create quote" still links to `/quote/new/client?fromVehicleId=915`, and that page is still the **client form** (Email, First name, Last name, Address, City, Province, Postal code, Tel home, Tel work, FORM-L25 checkbox). The new vehicle-first form the hand-off mentions (Vehicle type, Quote name, VIN, Brand, Model, Year) is the `/quote/new/edit-vehicle` route, which these cases do not use — no substitution was needed.
- **Vehicle step unchanged.** `/quote/{id}/vehicle` still shows Vehicle (pre-selected 915 / `1FAHP35NX8W239204`), Delivery date and Price, so Delivered at `2026-11-01` and Price `25000` were set there as the cases say. No `/vehicle/{id}/edit` step was needed.
- **"Create Contract" button → ⋯ menu "Generate Contract" (AP2459_001/002 step 4).** The quote details page has no "Create Contract" button. The Esthetic protection row's ⋯ menu offers Edit (`/quote/{id}/permaplate`) · **Generate Contract** (`/quote/{id}/permaplate-create-contract`) · Delete. The menu item was clicked — the same route the case names. Recorded as "button missing", as the case asks.
- **Contract page layout (redesigned, roadside-style).** H1 "Esthetic protection Contract"; left: H4 "Vehicle identification" (collapsed summary "Ford · Focus · 2008 · 1FAHP35NX8W239204 · CA$10,000.00" with a "Vehicle details" toggle) and H4 "Owner identification" (First name*, Last name*, Company, Address*, City*, Province*, Postal code*, Email, Home phone, Work phone — pre-filled from the client); right: H4 "Product Summary" (Program Term 10 ans, Start Date 2026-11-01, End date 2036-11-01, **Financing company** select default "Choose", Selected protection products, Total CA$80.00) and the red "Generate Contract" button. The "Financing company" field the cases name is in "Product Summary" (formerly in "Owner information"); the steps were mapped onto it. The case can be judged on this layout: the step under test is the submit with that field left on "Choose".
- **Product link (Configuration):** dealer 1380 already had "10 ans" linked on Dev (`/admin/dealer/1380/permaplate` lists `3 · 10 ans · 120 · Yes`). This run **did not link it**, so nothing is to be unlinked.
- **Client emails:** the `NNN` rule was applied as ticket-scoped numbers that no earlier run used: `client.stage.2459001` (001), `2459002` (002), `2459003` (003 fallback).
- **Known defects:** AP-2512 (Permaplate contract PDF download HTTP 500) was not reached by any case step (AP2459_003 was SKIPPED at step 2). See the observation under Environment Observations. AP-2532 not hit.

---

## Step-by-Step Results

### AP2459_001 — Generating an Esthetic protection contract with no financing company chosen no longer shows a server error page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Admin login; open `/admin/dealer/1380/permaplate`; link "10 ans" only if missing | Table lists "10 ans"; whether this step linked it is recorded | Heading "Eligible Esthetic protection products"; row `3 · 10 ans · 120 · Enabled Yes · Unlink`. Already linked — **this run did not link it** | ✅ | Nothing to restore afterwards |
| 2 `[Pre-Condition]` | Dealer login; `/vehicle/915/details` → Create quote; fill client form (Perma / Retest2459, `client.stage.2459001@yopmail.com`, Test Data address and phones, Province Québec), tick FORM-L25, Save | Lands on `/quote/{id}/details`, heading "#{id} - Perma Retest2459"; id recorded as quote A | "Create quote" → `/quote/new/client?fromVehicleId=915`; Save → `/quote/6689/details`, flash "Client saved", heading "#6689 - Perma Retest2459 1FAHP35NX8W239204". **Quote A = 6689** | ✅ | — |
| 3 `[Pre-Condition]` | `/quote/6689/vehicle`: VIN `1FAHP35NX8W239204`, Delivered at `2026-11-01`, Price `25000` → Save; `/quote/6689/permaplate`: "10 ans" + "Antirouille – Rust+Sound (combo)" → Save | Both saves without error page; details shows Esthetic protection with option and Cost | Vehicle select = 915 (`1FAHP35NX8W239204`) pre-selected; date `2026-11-01`, price `25000` → "Vehicle saved", summary "Delivery date: Nov 1, 2026 CA$25,000.00". Permaplate: options offered Antirouille 80$, Peinture – Céramique + Graphene 75$, Extra care 70$ (disabled); Antirouille ticked, "Cost: 80$" → "Esthetic protection quote saved successfully"; row "Esthetic protection — Antirouille – Rust+Sound (combo) Cost: CA$80.00$ — CA$80.00", Subtotal CA$25,080.00 | ✅ | Option name and Cost recorded: Antirouille, CA$80.00 |
| 4 | Click Create Contract (or open the form); leave Financing company on "Choose"; change nothing; Generate Contract | No HTTP 500, no "Erreur — Désolé…" screen; either (a) success alert or (b) form again with a message beside "Financing company"; branch, text and URL recorded | No "Create Contract" button — used ⋯ → "Generate Contract" → `/quote/6689/permaplate-create-contract` (200). Financing company = "Choose"; Generate Contract clicked once. `POST /quote/6689/permaplate-create-contract => 200`; URL unchanged; the form came back with the Financing company select marked invalid (red border) and **"ERROR This value should not be blank."** directly above it in the same cell; a red "1" error badge beside "Product Summary". Owner and product values kept (Perma, Retest2459, 220 Boulevard Saint-Laurent, Montreal, Québec, H2Y 1Z4, email, 5145550200, 5145550201). No success alert, no error page, no 5xx | ✅ | **Branch (b)** recorded (record-only which branch is correct). The Financing company label carries no "*" although the server requires it (observation) |
| 5 `[Verification]` | Branch (b): message beside "Financing company"; `/permaplate-contracts` has no row for "Perma Retest2459" | Field message visible next to "Financing company"; no contract created | Message "This value should not be blank." is in the Financing company cell (above the select, x 1018, same width as the select). `/permaplate-contracts` = **7 rows** before and after, **0 rows** for "Retest2459" (list: Terme Invoice1102, Adresse Modifiee2428, Double Clic2428, Perma Contrat2428, NonOwner AP2443Test, Perma Retest0913, Perma Testclient). Top invoice stayed **944** until AP2459_002 made 945 — no invoice for quote 6689 | ✅ | Refusal names the field; nothing created |

**Screenshots / evidence:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/AP2459_001-step4-BlankCompanyRefusedWithFieldMessage_pass.png` — the returned form: "ERROR This value should not be blank." above the red-bordered Financing company select, values kept
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/AP2459_001-step4-network_pass.txt` — GET/POST request lines with status (200 / 200)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/AP2459_001-step5-NoContractRowForRetest2459_pass.png` — the Esthetic protection contract list with no "Perma Retest2459" row

### AP2459_002 — Generating an Esthetic protection contract with a financing company chosen still succeeds and lists the contract — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Skip if AP2459_001 step 1 ran in this session | "10 ans" linked; recorded | Skipped as allowed — AP2459_001 step 1 ran at 03:03Z and found "10 ans" linked | ✅ | — |
| 2 `[Pre-Condition]` | `/vehicle/915/details` → Create quote; client Perma / Finance2459, `client.stage.2459002@yopmail.com`, other Test Data; FORM-L25; Save | `/quote/{id}/details`, heading "#{id} - Perma Finance2459"; quote B recorded | `/quote/new/client?fromVehicleId=915` → Save → `/quote/6690/details`, "Client saved", heading "#6690 - Perma Finance2459 1FAHP35NX8W239204". **Quote B = 6690** | ✅ | — |
| 3 `[Pre-Condition]` | Vehicle step 915 / `2026-11-01` / `25000`; Permaplate "10 ans" + Antirouille → Save | Both saves without error; Esthetic protection section with option and Cost | Vehicle 915, `2026-11-01`, `25000` saved (summary CA$25,000.00, Nov 1, 2026); Antirouille ticked, Cost 80$ → "Esthetic protection quote saved successfully"; row Antirouille – Rust+Sound (combo) CA$80.00 | ✅ | — |
| 4 | Create Contract (⋯ → Generate Contract); choose "AutoCapital Canada"; Generate Contract | No error page, no 500; success alert, wording recorded | ⋯ → Generate Contract → `/quote/6690/permaplate-create-contract` (200). Financing company set to "AutoCapital Canada" (value 39; it is in this page's list). `POST … => 302` → `/quote/6690/details` 200 with alerts **"Esthetic protection contract generated successfully"** and **"Invoice #945 ($80) is created"**. Esthetic protection row now shows **PNA-0000000021** (link `/quote/6690/permaplate-contract`) and a PDF icon (`/quote/6690/permaplate-contract-download`, `target=_blank`) instead of the ⋯ menu | ✅ | Wording: "Esthetic protection contract generated successfully" |
| 5 `[Verification]` | `/permaplate-contracts` row for Perma Finance2459 / VIN; `/invoice` newest invoice naming Perma Finance2459 | Contract row listed; new invoice exists; numbers recorded | `/permaplate-contracts` = **8 rows**; new row "1FAHP35NX8W239204 · Perma Finance2459 · Cell: 5145550201 Home: 5145550200 · 80.00$ · Download (`/quote/6690/permaplate-contract-download`)". `/invoice` top row **945** "#PNA-0000000021 Perma Finance2459 Ford Focus 2008 VIN : 1FAHP35NX8W239204 PNA-0000000021 10 ans Test QA staging … $91.98 … Payment pending" | ✅ | Contract PNA-0000000021, invoice 945 ($80 + 14.975 % = $91.98) |

**Screenshots / evidence:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/AP2459_002-step5-ContractRowFinance2459Listed_pass.png` — contract list with the Perma Finance2459 row
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/AP2459_002-step5-Invoice945Finance2459_pass.png` — invoice list with 945 for PNA-0000000021
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/AP2459_002-AP2459_003-network.txt` — request lines for 002 step 4, 003 step 2 and the PDF observation

### AP2459_003 — The PDF of a contract created with no financing company downloads without a server error — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | AP2459_001 made no contract → build fallback quote (Perma / Pdf2459, `client.stage.2459003@yopmail.com`, 915 / `2026-11-01` / `25000`, "10 ans" + Antirouille) | A quote with an Esthetic protection selection exists; id and client recorded | `/quote/new/client?fromVehicleId=915` → **quote 6691** "#6691 - Perma Pdf2459"; vehicle step saved (915, Nov 1, 2026, CA$25,000.00); Permaplate saved ("Esthetic protection quote saved successfully", Antirouille CA$80.00) | ✅ | — |
| 2 `[Pre-Condition]` | Open `/quote/6691/permaplate-create-contract`, leave Financing company on "Choose", Generate Contract; if refused with a field message → SKIPPED | A contract with no financing company exists, or the case is SKIPPED | Page 200, Financing company "Choose"; `POST … => 200`, form returned with "This value should not be blank." on Financing company only (the only invalid field); no contract | ⏭️ | SKIPPED — the build refuses a blank financing company (branch (b)), so no contract without a financing company can exist |
| 3–4 | Download the PDF; check status, type, file name, financing block | — | Not run (case SKIPPED at step 2) | ⏭️ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/AP2459_003-step2-FallbackQuoteRefusedBlankCompany_skipped.png` — quote 6691's contract form after the refused submit

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2459_003 | ⏭️ | Step 2 rule: the build refuses a blank Financing company with a field message, so a contract without a financing company — the case's subject — cannot be created on this build |

---

## Records left on Dev (Environment: Dev — `cleanup` source missing, nothing removed)

| Case | Quote | Client | Email | Vehicle | Product | Contract / invoice |
|---|---|---|---|---|---|---|
| AP2459_001 (quote A) | 6689 | Perma Retest2459 | client.stage.2459001@yopmail.com | 915 (`1FAHP35NX8W239204`), Delivered 2026-11-01, Price 25000 | Esthetic protection 10 ans + Antirouille CA$80.00 | none (one refused submit) |
| AP2459_002 (quote B) | 6690 | Perma Finance2459 | client.stage.2459002@yopmail.com | 915, 2026-11-01, 25000 | same | **PNA-0000000021** (financing company AutoCapital Canada), **invoice 945** ($91.98, Payment pending) |
| AP2459_003 (fallback) | 6691 | Perma Pdf2459 | client.stage.2459003@yopmail.com | 915, 2026-11-01, 25000 | same | none (one refused submit) |

Product link "10 ans" on dealer 1380: found linked, not changed. Not touched: quotes 6588–6688 and roadside contract 2782 from earlier runs; the seven existing Esthetic protection contracts on the dealer list; vehicle 915 (only selected on the quote vehicle step, never edited).

---

## Environment Observations

- **Environment: Dev.** All pages answered normally (HTTP 200/302); the only 5xx in this run was the PDF observation below.
- **Observation (not a case step) — AP-2512 still reproduces:** opening the PDF of the new contract PNA-0000000021 (`GET /quote/6690/permaplate-contract-download`, a contract **with** a financing company) returned **HTTP 500** with the French "Erreur — Désolé, l'application éprouve des difficultés techniques" page. Evidence: `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/Observation-Quote6690PdfDownload500-AP2512_blocked.png` and the network .txt. This belongs to AP-2512 (High, Backlog), not to AP-2459, and judges no case.
- **Contract page vehicle summary price:** the collapsed "Vehicle identification" line shows "CA$10,000.00" (the inventory vehicle's price) although the quote's vehicle step was saved with Price 25000 (quote summary CA$25,000.00). Recorded only.
- **Financing company label:** the field has no "*" and its select carries `required`, but the click posted anyway and the server refused it — the refusal is server-side.
- Language: the session ran in English; the admin login page opened in French and was not used for any judgement.
