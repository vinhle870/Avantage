# Execution Log — AP-2494

> Written by the **stlc-manual-executor** skill (stage s4 of `stlc-ticket-pipeline`, run `AP-2494 --from s4 --until s4c`).

---

## Execution Summary

**Ticket:** AP-2494 — Quotes list: replace "Produits" with "Contracts" and add quote search
**Environment:** Dev (v2dev)
**Executed by:** QA Agent — Manual Executor Skill
**Date:** 2026-11-02
**Base URL:** https://v2dev.garantieavantageplus.ca/ (dealer portal `/login` and admin portal `/admin/login`, signed in with the Dev account named in the `env` source, "Dev Environment" section)
**Browser:** Chromium (Playwright), viewport 1280 × 800
**Duration:** 2026-11-01T20:32:00Z → 2026-11-01T20:53:00Z (03:32 → 03:53 on 2026-11-02, local time UTC+7)
**Test cases:** qa-artifacts/3-test-cases/AP2494_TestCases_001-005.md · AP2494_TestCases_006-010.md · AP2494_TestCases_011-015.md · AP2494_TestCases_016-019.md

The environment was set to Dev (v2dev) by the user's decision for this run. The test cases were designed against staging (their Execution Context says "Staging (v2staging)"); the `env` source's Dev section was used instead and no staging page was opened. The orchestrator had already run the tracker preflight and the environment health check; the `env-check` source is `missing` on this project, so no separate smoke check file exists. Staging quote 6276 and contract `AVP000160` were never written to (quote 6276 on Dev is a different record and was not opened).

| Metric | Value |
|---|:---:|
| Total test cases | 19 |
| Passed | 14 |
| Failed | 1 |
| Blocked | 4 |
| Skipped | 0 |
| **Pass rate** | **74% (14 of 19)** |

---

## Build check — is AP-2494 on Dev?

Yes. The very first page opened, `/quotes?_locale=en`, shows the headers **Vehicle · Client · Contracts · Date Created** — the "Program" column that staging showed on 2026-10-12 is gone and a "Contracts" column is in its place. A dark magnifier button next to **Create a quote** opens a search dialog, which is the new search. Every case was run against this build.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2494_001 | Quote list Active tab shows a "Contracts" column and no "Produits" column | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_001-step3-ActiveTabContractsHeader_pass.png` | Headers Vehicle · Client · Contracts · Date Created on the "Active" tab |
| AP2494_002 | Quote list Archived tab shows a "Contracts" column and no "Produits" column | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_002-step3-ArchivedTabContractsHeader_pass.png` | Same four headers, same order, on "Archived" |
| AP2494_003 | Quote list in French shows no "Produits" column; the new column's French label is recorded | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_003-step5-LanguageRestoredEnglish_pass.png` | French header is "Contrats"; English restored |
| AP2494_004 | A quote with a generated extended-warranty contract lists that contract in its Contracts cell | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_004-step4-WarrantyContractInCell_pass.png` | Quote 6454 cell shows `26df1-844`, plain text |
| AP2494_005 | A quote with a newly generated roadside contract lists that contract in its Contracts cell | High | 🚫 | 1 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_005-step2-RoadsideGenerateContractHttp500_fail.png` | BLOCKED by AP-2518: roadside Generate Contract returns HTTP 500 on Dev |
| AP2494_006 | A quote with a creditor-insurance contract lists that contract in its Contracts cell | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_006-step5-CreditorContractInCell_pass.png` | Quote 6480, Chubb contract `AVP000170` shown |
| AP2494_007 | A quote with a GAP insurance contract lists that contract in its Contracts cell | Medium | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_007-step1-GapContractListEmpty_fail.png` | Test data not on dev: no GAP insurance contract exists |
| AP2494_008 | A quote with two generated contracts lists each one as its own entry, with no blank line | High | 🚫 | 1 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_008-step2-RoadsideGenerateContractHttp500_fail.png` | BLOCKED by AP-2518: second contract (roadside) cannot be generated, HTTP 500 |
| AP2494_009 | A quote with a Permaplate contract shows that contract's number in its Contracts cell | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_009-step4-PermaplateNumberInCell_pass.png` | Quote 6460 cell shows `PNA-0000000019`, as on admin page |
| AP2494_010 | A quote with a sales contract shows the sales contract number in its Contracts cell | Medium | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_010-step4-SalesContractMissingInCell_fail.png` | Sale `AP2494-S-957` saved on 6480 but absent from the cell (sale proven on details page — R3 F-2 re-capture) |
| AP2494_011 | A quote with no generated contract shows a blank Contracts cell | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_011-step3-BlankContractsCell_pass.png` | Quote 6481 cell empty, no placeholder |
| AP2494_012 | A product saved without a contract adds no entry and no blank line to the Contracts cell | High | 🚫 | 0 | 0 | — | BLOCKED by AP-2518: needs the AP2494_005 roadside contract, which Dev cannot generate |
| AP2494_013 | Searching part of a quote name in a different letter case lists that quote | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_013-step3-QuoteNameSearchPhyrine_pass.png` | `PHYRINE` finds only quote 6482 "Zephyrine AP2494 959" |
| AP2494_014 | Searching a client's first name, last name, email or full name lists that client's quote | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_014-step5-FullNameSearch_pass.png` | All four searches list only quote 6483 |
| AP2494_015 | Searching part of a client's name or email in lower case — the result is recorded | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_015-step4-ReversedNameSearch_pass.png` | Partial, lower-case and reversed searches all find 6483 |
| AP2494_016 | Searching part of a vehicle's VIN lists the quotes on that vehicle | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_016-step4-LowercaseVinSearchPage5of5FullPage_pass.png` | 43 quotes over 5 pages (unfiltered: 57), all on vehicle 915; 6483 first on page 1 — re-captured for R3 F-1 |
| AP2494_017 | Searching a term that matches no quote lists no quote and shows no error | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_017-step4-SearchClearedFullList_pass.png` | "No entities found"; special characters inert; clear restores list |
| AP2494_018 | Searching on the Archived tab and clearing the search — tab, paging and results are recorded | Low | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_018-step4-ActiveTabPage2AfterClear_pass.png` | Search is scoped to the tab being viewed |
| AP2494_019 | Searching a client who belongs to another dealership lists none of that dealership's quotes | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_019-step5-OtherDealerVinNoResult_pass.png` | PNA-0000000016 (Test Dealer 2) never listed |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP2494_001 — Quote list Active tab shows a "Contracts" column and no "Produits" column — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in to the Dealer portal and open `/quotes?_locale=en` | "Quotes" page loads in English with tabs and a table | Login landed on `/`; `/quotes?_locale=en` heading = "Quotes"; tabs "Active", "Archived"; table of 10 rows; pagination 1–57 | ✅ | Dev dealer account from the `env` source, typed only into the login form |
| 2 | Click the first tab; note label and URL | Tab selected, at least one row; label and URL recorded | Tab "Active" has class `active`; URL = `/quotes`; 10 rows | ✅ | Q-004: the first tab is labelled "Active" in English and "Créé" in French (AP2494_003), which matches AC 1's `created` |
| 3 `[Verification]` | Read every column header left to right | No "Produits"; exactly one "Contracts"; order recorded | Headers = "Vehicle", "Client", "Contracts", "Date Created"; no "Produits" | ✅ | Q-005: "Contracts" is the third column, where staging showed "Program" on 2026-10-12 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_001-step3-ActiveTabContractsHeader_pass.png` — Active tab with the four column headers, "Contracts" third

### AP2494_002 — Quote list Archived tab shows a "Contracts" column and no "Produits" column — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quotes?_locale=en` | Page loads in English | Heading "Quotes", English labels, no error page | ✅ | Same session as AP2494_001 |
| 2 | Click "Archived"; note URL | Archived tab selected, table renders; URL and row count recorded | URL = `/quotes/archived`; tab "Archived" active; 10 rows on page 1, 39 pages | ✅ | Archived rows already carry contracts, e.g. quote 6245 "26df1-829", 6164 "AX-806" |
| 3 `[Verification]` | Read every column header | No "Produits"; exactly one "Contracts"; order compared with AP2494_001 | Headers = "Vehicle", "Client", "Contracts", "Date Created" — identical to the Active tab | ✅ | Both tabs share one header layout |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_002-step3-ArchivedTabContractsHeader_pass.png` — Archived tab headers and rows with contract numbers

### AP2494_003 — Quote list in French shows no "Produits" column; the new column's French label is recorded — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quotes`; record the current interface language | List loads; original language recorded | The login page and `/quotes` were in English ("Login", "Quotes") before any switch — original language = English | ✅ | The page's `html lang` attribute stays "en" in both languages, so the visible labels were used |
| 2 | Open `/quotes?_locale=fr` | List reloads in French; no error page | Heading "Cotations"; tabs "Créé" and "Archivée"; button "Créer une cotation" | ✅ | — |
| 3 | Read every header on the first tab, then on the archived tab | No "Produits" on either tab; French label recorded | First tab: "Véhicule", "Client", "Contrats", "Date de création". Archived tab (`/quotes/archived`): same four headers | ✅ | Q-006: the French label is "Contrats", not "Contracts" |
| 4 | Open `/quotes?_locale=en` | List reloads in the original language | Heading "Quotes"; tabs "Active", "Archived" | ✅ | Language restored for the shared account |
| 5 `[Verification]` | Check language and headers once more | Back in English; no "Produits" | Heading "Quotes"; headers "Vehicle", "Client", "Contracts", "Date Created" | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_003-step5-LanguageRestoredEnglish_pass.png` — quote list back in English after the French check

### AP2494_004 — A quote with a generated extended-warranty contract lists that contract in its Contracts cell — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/warranty`, take the newest contract; find its quote on `/quotes` | A quote id is recorded | Newest warranty = `26df1-844`, client Marie Tremblay (`client.stage.931@yopmail.com`), Ford Focus 2008 VIN `1FAHP35NX8W239204`, status Pending approval. Its quote, found by reading `/quotes` page by page, is **6454** (page 3, row 5) | ✅ | Existing Dev data from the AP-2374 run (2026-11-01); reused, not changed |
| 2 `[Pre-Condition]` | Open `/quote/6454/details`, read the Warranty section | Warranty finalized; contract identifier recorded | "Extended warranty" row shows the link "26df1-844" (→ `/warranty/844`), CA$500.00 and a PDF link `/warranty/844/pdf` | ✅ | Contract identifier = `26df1-844` |
| 3 | Open `/quotes?_locale=en&page=3` | Row of quote 6454 visible | Row 5 of page 3 = quote 6454, Marie Tremblay | ✅ | — |
| 4 `[Verification]` | Read the "Contracts" cell of quote 6454 | Not blank; identifies `26df1-844`; no "null"/"undefined" | Cell = one list item "26df1-844" (HTML `<ul><li>26df1-844</li></ul>`); no link inside the cell | ✅ | Q-001: the cell shows the contract number as plain text, not a link and not the product name |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_004-step4-WarrantyContractInCell_pass.png` — page 3 with quote 6454's row outlined, Contracts cell "26df1-844"

### AP2494_005 — A quote with a newly generated roadside contract lists that contract in its Contracts cell — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | `/vehicle/915/details` → **Create quote**; client Roadie Contrat-956 → **Save** | "Client saved"; `/quote/{id}/details` loads; id recorded | Flash "Client saved"; `/quote/6479/details`, heading "#6479 - Roadie Contrat-956 1FAHP35NX8W239204" | ✅ | Client email `client.stage.956@yopmail.com` |
| 2 `[Pre-Condition]` | Open `/quote/6479/road-side-protection`, fill the roadside fields → **Save and Generate Contract** | Contract generated with no error; identifier recorded | The Dev page has no stock number, vehicle condition, odometer or "Save and Generate Contract" (a known Dev difference, quote-creation.md). Chose tier "Protection Hasards PNEU + ROUE \| Standard \| 12 months \| 200$", Policy Sale price 25000 → **Save** → flash "The Roadside protection coverage has been saved successfully". Then **Generate Contract**: opened by URL `/quote/6479/road-side-protection-create-contract` → **HTTP 500**, French page "Erreur Désolé, l'application éprouve des difficultés techniques"; retried from the row's ⋯ menu → the modal stayed on "Loading..." and the console logged a 500 from the same URL; retried once more after changing the Policy Sale price to 200 → HTTP 500 again | 🚫 | Blocked by an environment fault before the step under test: Dev cannot generate a roadside contract. The page also warned "There's already a contract created for the same VIN. Contract #2697, 2698". The roadside product stays saved on 6479 without a contract |
| 3 | Open `/quotes?_locale=en` | Quote is newest on page 1 | Not run | 🚫 | Blocked by step 2 |
| 4 `[Verification]` | Read the Contracts cell | Exactly one roadside entry | Not run as designed. Observation: quote 6479 (roadside saved, no contract) shows an empty Contracts cell | 🚫 | The observation is consistent with AC 6 but is not this case's check |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_005-step2-RoadsideGenerateContractHttp500_fail.png` — HTTP 500 error page at the roadside Generate Contract URL
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_005-step2-RoadsideModalStuckLoading_fail.png` — the ⋯ → Generate Contract modal stuck on "Loading..."

### AP2494_006 — A quote with a creditor-insurance contract lists that contract in its Contracts cell — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | `/vehicle/915/details` → **Create quote**; client Credito Chubbline-957 → **Save** | "Client saved"; quote id recorded | Flash "Client saved"; `/quote/6480/details`, heading "#6480 - Credito Chubbline-957 1FAHP35NX8W239204" | ✅ | Client email `client.stage.957@yopmail.com` |
| 2 `[Pre-Condition]` | **Add a financing**, fill the Financing values → **Save** | "Financing saved"; Financing panel shows it; record whether **Add creditors insurance** is shown | **Add a financing** opened a modal on the details page. Saved DOB 1985-06-15, Financing, 25000, residual 0, Monthly, 60 months, 6.99 %, first company "AutoCapital Canada" → flash "Financing saved"; panel "Financing 60 months AutoCapital Canada · Type: Financing · Financed amount: 25,000.00" (payment 494.91$ Monthly). No link labelled "Add creditors insurance"; the Creditors insurance row has an unlabelled "+" link to `/quote/6480/insurance` | ✅ | A separate notice "No applicant" (co-applicant section) also appeared; it is not an error |
| 3 `[Pre-Condition]` | Open `/quote/6480/insurance` (by URL), fill Creditors insurance → **Get Quote**; open `/quote/6480/insurance/create-contract` → create the contract | "Chubb insurance quote saved successfully", then "Chubb insurance contract created successfully" and an `AVP…` number | `/quote/6480/insurance` opened **by URL**, heading "Insurance for Credito Chubbline-957". Language Français, Form "Monthly Premium PM50", Tax exempt No, Life Decreasing / 60 / Borrower → **Get Quote** → `/quote/6480/details` with "Chubb insurance quote saved successfully". A **Generate Contract** link then existed in the row's ⋯ menu; the page `/quote/6480/insurance/create-contract` was opened **by URL** (heading "Creditor Insurance", Commission (50%) 623.15$). Its button is labelled **Generate Contract**, not "Create Contract" → after about 10 s, `/quote/6480/details` with "Chubb insurance contract created successfully"; contract number **AVP000170**. No `alert`-role banner and no text containing "HTTP" | ✅ | Chubb's development API answered both calls. Contract AVP000170 is durable test data on Dev |
| 4 | Open `/quotes?_locale=en`, find quote 6480 | Row visible | Page 1, row 1 = quote 6480 | ✅ | — |
| 5 `[Verification]` | Read the Contracts cell of quote 6480 | Not blank; identifies AVP000170; no "null"/"undefined" | Cell = one list item "AVP000170"; no link | ✅ | Q-001: creditor contract shown by its Chubb number, plain text |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_006-step5-CreditorContractInCell_pass.png` — quote 6480 outlined, Contracts cell "AVP000170"

### AP2494_007 — A quote with a GAP insurance contract lists that contract in its Contracts cell — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/gap-insurance-contracts`, take the first row | A quote id and GAP contract recorded; if empty, BLOCKED | Heading "Gap insurance contracts"; body "No entities found" — the list is empty | 🚫 | BLOCKED — test data not on dev: a GAP insurance contract (Known blocker 1) |
| 2 `[Pre-Condition]` | Open `/quote/{id}/details` | GAP product with a contract | Not run | 🚫 | Blocked by step 1 |
| 3 | Open `/quotes` at the quote's row | Row visible | Not run | 🚫 | Blocked by step 1 |
| 4 `[Verification]` | Read the Contracts cell | Identifies the GAP contract | Not run | 🚫 | Blocked by step 1 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_007-step1-GapContractListEmpty_fail.png` — empty GAP insurance contract list on Dev

### AP2494_008 — A quote with two generated contracts lists each one as its own entry, with no blank line — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quote/6480/details` (the AP2494_006 quote) | Creditors insurance row shows an `AVP…` number | Creditors insurance row shows **AVP000170** | ✅ | Reused the AP2494_006 quote as designed |
| 2 `[Pre-Condition]` | Open `/quote/6480/road-side-protection`, fill the roadside fields → generate the contract | Both contracts shown as generated | Tier 1 "Protection Hasards PNEU + ROUE … 200$", Policy Sale price 25000 → **Save** succeeded; `/quote/6480/road-side-protection-create-contract` → **HTTP 500** French technical-error page | 🚫 | Same Dev fault as AP2494_005: the second contract cannot be generated. Quote 6480 keeps a roadside product saved without a contract |
| 3 | Open `/quotes` at quote 6480 | Row visible | Not run as designed | 🚫 | Blocked by step 2 |
| 4 `[Verification]` | Read the Contracts cell | One entry per contract, no blank line; separator and order recorded | Not run as designed. Observation for Q-002 from existing Dev data: quote 6254 shows two entries, "2698" and "AVP000162", as two items of one list (one per line); and quote 6480's cell still holds only "AVP000170" although a roadside product without a contract was saved on it — no empty item | 🚫 | Observations only; the case needs two contracts generated in this run |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_008-step2-RoadsideGenerateContractHttp500_fail.png` — HTTP 500 at the roadside Generate Contract URL for quote 6480

### AP2494_009 — A quote with a Permaplate contract shows that contract's number in its Contracts cell — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/permaplate-contracts`, take the first row; read the quote id from Download | A quote id recorded | Heading "Esthetic protection contracts", 6 rows; first row VIN `1FAHP35NX8W239204`, client "Adresse Modifiee2428", Download → `/quote/6460/permaplate-contract-download` → quote **6460** | ✅ | Existing Dev data from the AP-2428 run |
| 2 `[Pre-Condition]` | Admin `/admin/login`; `/admin/permaplate-contracts`; open the matching row with the eye icon | Heading "Esthetic protection Contract {number}" | Admin login succeeded (`/admin`). The row "Adresse Modifiee2428 · Test QA staging · Ford Focus 2008 VIN 1FAHP35NX8W239204" → eye icon → `/admin/permaplate-contract/19`, heading "Esthetic protection Contract PNA-0000000019" | ✅ | Dev fact: dealer 1380 is listed as "Test QA staging" in this admin list, not "Offical VinhLe870@gmail.com" |
| 3 | Dealer `/quotes?_locale=en` at quote 6460 | Row visible | Page 3, quote 6460, client "Adresse Modifiee2428" | ✅ | — |
| 4 `[Verification]` | Read the Contracts cell | Shows `PNA-0000000019` exactly | Cell = one list item "PNA-0000000019" | ✅ | Exact match with the admin heading |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_009-step4-PermaplateNumberInCell_pass.png` — quote 6460 outlined, Contracts cell "PNA-0000000019"

### AP2494_010 — A quote with a sales contract shows the sales contract number in its Contracts cell — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quote/6480/details` (the AP2494_006 quote) | Sale section with an enabled **Create sale** | **Create sale** is an enabled button (`/quote/6480/sales`) | ✅ | Known blocker 2 did not apply |
| 2 `[Pre-Condition]` | **Create sale**, fill the Test Data → **Save**; use any separate generate/finalize action | Sale saves; details shows `AP2494-S-957`; record whether a separate generate step existed | `/quote/6480/sales` (heading "Sales contract"): contract number `AP2494-S-957`, sales rep "QA Agent", delivered on and signed on 2026-11-01, signed at "Montréal" → **Save** → flash "Contract saved", an "Open PDF in new tab" link (`/quote/6480/sales/pdf`). No separate generate or finalize action exists on the sales page or the details page. `/quote/6480/details` Sale section: "#AP2494-S-957 · Sales rep: QA Agent · Edit sale" | ✅ | Q-003: saving is the only step — there is no "generate" or "finalize" step for a sale |
| 3 | Open `/quotes?_locale=en` at quote 6480 | Row visible | Page 1, row 1 = quote 6480 | ✅ | — |
| 4 `[Verification]` | Read the Contracts cell | Shows `AP2494-S-957` alongside the other entries; no blank line | Cell = one list item "AVP000170" only. `AP2494-S-957` does **not** appear | ❌ | AC 4 says a quote with a sale contract shows that contract number. A dealer scanning the list cannot see which quotes already have a signed sale. Note: archived quotes 6040 ("APOP01-671", "11111") and 6041 ("APOP01-663", "ContractNumber_12345") do show a sale number next to a warranty contract, so the rule the list uses for sales is unclear. Page reloaded once; same result |

**Re-capture 2026-11-01T21:05Z (R3 F-2, read-only — nothing saved):**
- Step 2 evidence: `/quote/6480/details` Sale section shows heading "#AP2494-S-957", "Sales rep: QA Agent" and an **Edit sale** link (→ `/quote/6480/sales`). Summary of products: Extended warranty "- None Selected -", Roadside Protection CA$25,000.00 (no contract), Gap Insurance "- None Selected -", Creditors insurance AVP000170. Quote 6480 has **no warranty** and is on the Active tab.
- Step 4 comparison: on `/quotes/archived`, searched `ap_automation_test@yopmail.com` → `/quotes/archived?quote_search[keyword]=ap_automation_test%40yopmail.com`. Row "Automation Test Automation Test · Fiat 500 2015 VIN 33333333 · Apr 14, 2024" (quote **6041**) Contracts = "APOP01-663", "ContractNumber_12345"; row "firstName lastName · VIN 33333333 · Mar 30, 2024" (quote **6040**) Contracts = "APOP01-671", "11111".
- Warranty on 6040 / 6041: `/quote/6040/details` Sale "#11111", Sales rep "11111"; Extended warranty **APOP01-671** (→ `/warranty/671`, CA$1,111.00, PDF). `/quote/6041/details` Sale "#ContractNumber_12345", Sales rep "SalesRepName_VL"; Extended warranty **APOP01-663** (→ `/warranty/663`, CA$8,888.00, PDF). Both quotes therefore carry a **generated warranty contract** (contract number, PDF, invoice). Their status on `/warranty`: APOP01-671 is in **Pending approval** (Invoice #688 Paid, Credit Memo #692); APOP01-663 is in **Cancelled** ("Cancelled by Le 1 Vinh … Warranty created in error", Invoice #644 Paid, Credit Memo #645 Refund Pending) — yet 6041's Contracts cell still lists APOP01-663. Neither is in "Approved". `/warranty/671` itself shows no status, only File a claim · Cancel · Request e-signature · Open PDF.
- What this means for the result: the FAIL stands. Both quotes whose sale number shows (6040, 6041) are **archived** and carry a generated warranty contract; quote 6480 is **active** and has no warranty. So the list may show a sale number only when a warranty contract exists, or only on archived quotes — this run cannot tell which. Q-003 goes to the author with the bug.

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_010-step4-SalesContractMissingInCell_fail.png` — quote 6480's Contracts cell showing only "AVP000170", no sale number
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_010-step2-Quote6480SaleSectionAP2494-S-957_fail.png` — full `/quote/6480/details`: Sale "#AP2494-S-957 · Sales rep: QA Agent · Edit sale"; Extended warranty "- None Selected -"; Creditors insurance AVP000170
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_010-step4-Archived6040And6041ContractsCells_fail.png` — `/quotes/archived` search on the 6040/6041 client email: 6041 "APOP01-663 / ContractNumber_12345", 6040 "APOP01-671 / 11111"
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_010-step4-Quote6040DetailsSaleAndWarranty_fail.png` — full `/quote/6040/details`: Sale "#11111", Extended warranty APOP01-671
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_010-step4-Quote6041DetailsSaleAndWarranty_fail.png` — full `/quote/6041/details`: Sale "#ContractNumber_12345", Extended warranty APOP01-663
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_010-step4-Warranty671ContractOf6040_fail.png` — `/warranty/671` contract page (quote 6040)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_010-step4-Warranty671PendingApprovalRow_fail.png` — `/warranty` (Pending approval) row APOP01-671
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_010-step4-Warranty663CancelledRow_fail.png` — `/warranty/cancelled` row APOP01-663, "Warranty created in error"

### AP2494_011 — A quote with no generated contract shows a blank Contracts cell — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | `/vehicle/915/details` → **Create quote**; client Vide Contrat-958 → **Save** | "Client saved"; no product; id recorded | Flash "Client saved"; `/quote/6481/details` | ✅ | Client email `client.stage.958@yopmail.com` |
| 2 | Open `/quotes?_locale=en` | Quote 6481 newest on page 1 | Page 1, row 1 = quote 6481 | ✅ | — |
| 3 `[Verification]` | Read the Contracts cell | Blank; client "Vide Contrat-958"; vehicle 2008 Ford Focus | Contracts cell text = "" (whitespace only, no list element); Client "Vide Contrat-958 client.stage.958@yopmail.com 5145550101"; Vehicle "Ford Focus 2008 VIN: 1FAHP35NX8W239204" | ✅ | No placeholder such as "-", "null" or "undefined" |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_011-step3-BlankContractsCell_pass.png` — quote 6481 outlined with an empty Contracts cell

### AP2494_012 — A product saved without a contract adds no entry and no blank line to the Contracts cell — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the AP2494_005 quote's details | Roadside product with a generated contract | Quote 6479 has a roadside product but **no** contract — AP2494_005 could not generate one (HTTP 500), and the designed fallback (AP2494_005 steps 1–2) hits the same fault | 🚫 | BLOCKED by AP-2518 (Dev roadside Generate Contract HTTP 500) |
| 2 `[Pre-Condition]` | Save a warranty without a contract | Warranty saved, not finalized | Not run | 🚫 | Blocked by step 1 |
| 3 | Find the quote on `/quotes` | Row visible | Not run | 🚫 | Blocked by step 1 |
| 4 `[Verification]` | Read the Contracts cell | Only the roadside entry | Not run as designed. Observations for AC 6: quote 6479 (roadside saved, no contract) has an empty cell; quote 6480 (creditor contract + roadside saved without contract + sale) shows only "AVP000170" with no empty item | 🚫 | Observations only |

**Screenshots:** none — the case stopped at a precondition already evidenced in AP2494_005.

### AP2494_013 — Searching part of a quote name in a different letter case lists that quote — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | `/quotes` → "Create a quote"; set Quote name `Zephyrine AP2494 959`, VIN `1FAHP35NX8W239204` → **Save** | Quote named; id and where the name was set recorded | "Create a quote" → `/quote/new/edit-vehicle` with a "Quote name" field. Saved name "Zephyrine AP2494 959", VIN `1FAHP35NX8W239204`, Brand Ford, Model Focus, Year 2008 → `/quote/6482/details`, flash "Vehicle saved", heading "#6482-Zephyrine AP2494 959" | ✅ | Q-010: on Dev the name is set on the vehicle-first form (AP-2477). "Décoder" was not clicked |
| 2 | Open `/quotes?_locale=en`, open the search, submit `PHYRINE` | List reloads, no error; control label and submit recorded | Dark magnifier button beside "Create a quote" opens a dialog with the label "Quote name, client name, client email or VIN", one text box and a **Search** button; GET → `/quotes?quote_search[keyword]=PHYRINE`, HTTP 200 | ✅ | Q-007: dialog + Search button (Enter also submits). A separate global "Search" box in the top bar is not this feature |
| 3 `[Verification]` | Read the listed rows | Quote 6482 listed; every other row contains `phyrine` | One row: quote 6482, Vehicle cell "ZEPHYRINE AP2494 959 Ford Focus 2008 VIN: 1FAHP35NX8W239204", Client "-", Contracts blank. Row count 1, no other rows to check | ✅ | The quote name is shown above the vehicle, in capitals |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_013-step3-QuoteNameSearchPhyrine_pass.png` — search `PHYRINE` listing only quote 6482

### AP2494_014 — Searching a client's first name, last name, email or full name lists that client's quote — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | `/vehicle/915/details` → **Create quote**; client Ysolde Brakwater-960 → **Save** | "Client saved"; id recorded | Flash "Client saved"; `/quote/6483/details` | ✅ | Client email `client.stage.960@yopmail.com` |
| 2 | Search `Ysolde` | Quote 6483 listed; no error | 1 row: quote 6483 "Ysolde Brakwater-960"; HTTP 200 | ✅ | Submitted through the search dialog |
| 3 | Search `Brakwater-960` | 6483 listed; every row's client is Ysolde Brakwater-960 | 1 row: quote 6483 | ✅ | Same GET request the dialog sends |
| 4 | Search `client.stage.960@yopmail.com` | 6483 listed | 1 row: quote 6483 | ✅ | — |
| 5 `[Verification]` | Search `Ysolde Brakwater-960` | 6483 listed; every row's client is Ysolde Brakwater-960 | 1 row: quote 6483, client "Ysolde Brakwater-960" | ✅ | Submitted through the search dialog |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_014-step5-FullNameSearch_pass.png` — full-name search listing only quote 6483

### AP2494_015 — Searching part of a client's name or email in lower case — the result is recorded — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Confirm the AP2494_014 quote exists | Quote id known | Quote 6483 | ✅ | — |
| 2 | Search `ysolde`, then `brakw` | Lists with no error; record whether 6483 listed | `ysolde` → 1 row (6483); `brakw` → 1 row (6483) | ✅ | Q-012: client-name search is partial and case-insensitive |
| 3 | Search `stage.960@yopmail`, then `Brakwater-960 Ysolde` | Lists with no error; record whether 6483 listed | `stage.960@yopmail` → 1 row (6483); `Brakwater-960 Ysolde` → 1 row (6483) | ✅ | Q-012: email fragment matches. Q-013: reversed "last first" matches |
| 4 `[Verification]` | Review every result | No error page; no row without the term | All four searches HTTP 200; every listed row is quote 6483 | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_015-step4-ReversedNameSearch_pass.png` — reversed-name search listing quote 6483

### AP2494_016 — Searching part of a vehicle's VIN lists the quotes on that vehicle — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Confirm the AP2494_014 quote id | Known | Quote 6483 | ✅ | — |
| 2 | Search `8W239204`; page through | No error; 6483 listed; page, position and count recorded | 43 rows over 5 pages; 6483 on page 1, position 1 | ✅ | Q-011: newest-first order kept under a search; page links keep the keyword (`?quote_search[keyword]=…&page=N`) |
| 3 | Search `1FAHP35NX8W239204` | 6483 listed; every row on vehicle 915 | 43 rows over 5 pages; 6483 page 1 position 1; all 43 rows "Ford Focus 2008 VIN: 1FAHP35NX8W239204" | ✅ | All pages read |
| 4 `[Verification]` | Search `1fahp35nx8w239204`; review step 2's rows | Every step-2 row on vehicle 915; lower-case search returns a list | Step 2: 0 of 43 rows on another VIN. Lower-case search: 43 rows, 6483 page 1 position 1. **Re-run 2026-11-01T21:04Z (R3 F-1):** submitted through the search dialog → URL `/quotes?quote_search[keyword]=1fahp35nx8w239204` (shown as `quote_search%5Bkeyword%5D`); page 1 = 10 rows (6483 first), pagination "1 2 3 4 Next Last" with Last → `&page=5`; page 5 = 3 rows (last page, no Next) → 4 × 10 + 3 = 43 rows over 5 pages; every row "Ford Focus 2008 VIN: 1FAHP35NX8W239204". The unfiltered list at the same moment: Last → `/quotes?_locale=en&page=57` (57 pages). Reopening the dialog shows `1fahp35nx8w239204` still in the box | ✅ | Q-012: VIN search is case-insensitive. The search was applied (5 pages vs 57 unfiltered) — result unchanged |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_016-step4-LowercaseVinSearch_pass.png` — lower-case VIN search, page 1 of 5 (top of page only; superseded by the three below — R3 F-1)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_016-step4-LowercaseVinSearchPage1of5FullPage_pass.png` — full page 1 of the search: 10 rows, 6483 first, pagination 1–4 · Next · Last
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_016-step4-LowercaseVinSearchPage5of5FullPage_pass.png` — full page 5 (`&page=5`): 3 rows, pagination First · Prev · 2 3 4 **5**, no Next — the search has 5 pages
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_016-step4-LowercaseVinSearchTermInDialog_pass.png` — search dialog reopened on page 5, box holding `1fahp35nx8w239204`

### AP2494_017 — Searching a term that matches no quote lists no quote and shows no error — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quotes?_locale=en`, count page 1 | Quote rows shown | 10 rows on page 1, 57 pages | ✅ | — |
| 2 | Search `qzxwv-AP2494-nomatch` | No row; no error; empty state recorded | No table; text "No entities found"; HTTP 200 | ✅ | Q-009: the empty state is "No entities found" |
| 3 | Search `%_'"<b>` | No error/500; not rendered as HTML | No rows, "No entities found"; no bold element on the page; the box shows the term exactly as typed | ✅ | `%` and `_` are not treated as wildcards |
| 4 `[Verification]` | Clear the search | No error; how cleared and what shows recorded | No clear control exists. Emptied the box → **Search** → `/quotes?quote_search[keyword]=` → 10 rows, 57 pages (same as step 1), box empty | ✅ | Q-009: clearing = submitting an empty box |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_017-step4-SearchClearedFullList_pass.png` — full list back after submitting an empty search

### AP2494_018 — Searching on the Archived tab and clearing the search — tab, paging and results are recorded — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | `/quotes?_locale=en` → "Archived"; read first row's client last name | Last name recorded | First archived row = quote 6245, client "Vinh LeAVtage" → last name `LeAVtage` | ✅ | — |
| 2 | On Archived, search `LeAVtage` | No error; record listing and tab | `/quotes/archived?quote_search[keyword]=LeAVtage` → 1 row (6245); "Archived" stays selected | ✅ | Q-011: the search form submits to the tab being viewed |
| 3 | On Archived, search `Brakwater-960` | No error; record whether 6483 appears | "No entities found"; the active quote 6483 does not appear | ✅ | Q-011: search covers only the current tab |
| 4 `[Verification]` | Clear the search, click the first tab, open page 2 | No error page; clearing, box, tab, rows and page 2 recorded | Empty box + Search → `/quotes/archived?quote_search[keyword]=` (10 rows, 39 pages, box empty). Clicked "Active" → `/quotes` (the tab link carries no keyword): 10 rows, quotes 6483 … 6474, 57 pages. `/quotes?page=2` → quotes 6473 … 6464, different from page 1. No error page at any point | ✅ | Record-only per design |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_018-step4-ActiveTabPage2AfterClear_pass.png` — Active tab page 2 after clearing the search

### AP2494_019 — Searching a client who belongs to another dealership lists none of that dealership's quotes — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Admin `/admin/permaplate-contracts`; pick the first other-dealer row not on VIN 915 and with no dealer-1380 client+VIN twin; open it | Heading "Esthetic protection Contract {number}"; details recorded | Both list pages read (19 rows). On Dev dealer 1380 shows as "Test QA staging". First qualifying row: client "Ken Nguyen", dealer "Test Dealer 2", Kia Forte 2017 VIN `3KPFL4A76HE021135` → `/admin/permaplate-contract/16`, heading "Esthetic protection Contract **PNA-0000000016**". No "Test QA staging" row on pages 1–2 has that client and VIN | ✅ | Dev data replaced the staging dealer name in the step's filter |
| 2 `[Pre-Condition]` | Dealer `/quotes?_locale=en` | List loads | Quote list loads | ✅ | — |
| 3 | Search `Nguyen` | No error; rows recorded | "No entities found" (0 rows), HTTP 200 | ✅ | — |
| 4 | Search `3KPFL4A76HE021135` | No error; rows recorded | "No entities found" (0 rows), HTTP 200 | ✅ | — |
| 5 `[Verification]` | Review steps 3–4 rows | No row is the other dealership's contract | No rows were listed, so no row shows PNA-0000000016 and none needs a details check | ✅ | Q-014: no leak; the dealer sees "No entities found" |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_019-step5-OtherDealerVinNoResult_pass.png` — other dealership's VIN search returning "No entities found"

> **R3 F-6 note (2026-11-01T21:08Z, from the existing record, not re-run):** this image was taken after step 4, the last search of the case, so the "No entities found" it shows belongs to the **VIN search `3KPFL4A76HE021135`** (`/quotes?quote_search[keyword]=3KPFL4A76HE021135`), not to `Nguyen`. The step-3 `Nguyen` search also returned "No entities found" but has no image. The image shows neither term nor URL; the result does not change, because the unfiltered list is never empty.

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2494_005 | 🚫 | BLOCKED by AP-2518 — Dev cannot generate a roadside contract: `/quote/{id}/road-side-protection-create-contract` returns HTTP 500 (3 tries on quote 6479, by URL and by the ⋯ menu). Fix the roadside contract generation on Dev, then re-run |
| AP2494_007 | 🚫 | Test data not on dev: GAP insurance contract — `/gap-insurance-contracts` is empty |
| AP2494_008 | 🚫 | BLOCKED by AP-2518 — needs a second generated contract; the roadside contract fails with the same HTTP 500 on quote 6480 |
| AP2494_012 | 🚫 | BLOCKED by AP-2518 — needs the AP2494_005 roadside contract; same HTTP 500 |

---

## Test data left on Dev

| Record | Created by | State |
|---|---|---|
| Quote 6479 — Roadie Contrat-956, `client.stage.956@yopmail.com`, vehicle 915 | AP2494_005 | Roadside product saved (tier 194-883, Policy Sale price changed 25000 → 200 during the retry), no contract |
| Quote 6480 — Credito Chubbline-957, `client.stage.957@yopmail.com`, vehicle 915 | AP2494_006 / 008 / 010 | Financing (25,000, 60 months, AutoCapital Canada), Chubb creditor quote (Français, PM50), **Chubb creditor contract AVP000170** (Chubb development API), roadside product saved without contract (Policy Sale price 25000), sale `AP2494-S-957` |
| Quote 6481 — Vide Contrat-958, `client.stage.958@yopmail.com`, vehicle 915 | AP2494_011 | Client only |
| Quote 6482 — quote name "Zephyrine AP2494 959", VIN `1FAHP35NX8W239204` (Ford Focus 2008, no client) | AP2494_013 | Vehicle-first quote; a vehicle record may have been added to Vehicle Inventory by this form |
| Quote 6483 — Ysolde Brakwater-960, `client.stage.960@yopmail.com`, vehicle 915 | AP2494_014 | Client only |

Inboxes `client.stage.956`, `957`, `958` and `960` were used; `959` was used only as the quote-name number. Nothing was deleted or archived. The dealer interface language was switched to French and restored to English (AP2494_003).

---

## Environment Observations

- **Roadside Generate Contract is broken on Dev.** `/quote/{id}/road-side-protection-create-contract` returns HTTP 500 on both new quotes (6479, 6480), whatever the Policy Sale price. This is not part of AP-2494, but it blocks three of its cases. The Roadside page also shows the warning "There's already a contract created for the same VIN. Contract #2697, 2698" on vehicle 915 — possibly the cause, not confirmed.
- **No GAP insurance contract exists on Dev**, so AC 3 for GAP could not be checked.
- **Sales contract numbers:** the sale saved in this run does not show in the Contracts column (AP2494_010 FAIL), but two older archived quotes (6040, 6041) do show a sale number next to a warranty contract.
- **Quote name display:** a named quote shows its name in capitals above the vehicle in the Vehicle cell (quote 6482, and older automation quotes such as 6431 "TC1411_DealerCanFinalizeSaleAndSeeInvoice").
- **Search dialog:** label "Quote name, client name, client email or VIN", field `quote_search[keyword]`, button **Search**, GET request to the current tab's URL; empty result reads "No entities found"; no clear control.
- **Chubb on Dev:** both Chubb calls answered within about 10 s; the contract screen's button is "Generate Contract" (the test case says "Create Contract").
- **Admin dealer name on Dev:** dealer 1380 appears as "Test QA staging" in `/admin/permaplate-contracts`, not "Offical VinhLe870@gmail.com" as on staging.
- Quotes 6470–6478 were created by other runs between the AP-2493 run and this one.

---

## Evidence re-capture — R3 round 1 (2026-11-01T21:03Z → 21:08Z)

Requested by the independent R3 review (qa-artifacts/7-reviews/AP-2494_review.md, R3 round 1, findings F-1, F-2 and F-6). Dev (v2dev) only, dealer portal signed in with the Dev account from the `env` source (typed only into the login form). **Read-only:** only GET pages and search submissions were used; nothing was saved, archived, cancelled or edited. No other step was re-run and no other result changed.

| Finding | Case / step | What was done | Outcome | Result change |
|---|---|---|---|---|
| F-1 (Blocker) | AP2494_016 step 4 | Search `1fahp35nx8w239204` submitted through the dialog; full-page screenshots of page 1 and page 5; dialog reopened to show the term; unfiltered page count read | URL `/quotes?quote_search[keyword]=1fahp35nx8w239204`; 5 pages (10+10+10+10+3 = 43 rows), every row on VIN `1FAHP35NX8W239204`; unfiltered list = 57 pages. The search was applied | None — stays ✅ PASS |
| F-2 (Major) | AP2494_010 steps 2 and 4 | Opened `/quote/6480/details`, `/quote/6040/details`, `/quote/6041/details`, `/warranty/671`, `/warranty` (Pending approval) and `/warranty/cancelled`; searched `/quotes/archived` for the 6040/6041 client email | 6480 Sale "#AP2494-S-957" exists, no warranty, Active tab. 6040: archived, Contracts "APOP01-671 · 11111", warranty APOP01-671 **Pending approval**. 6041: archived, Contracts "APOP01-663 · ContractNumber_12345", warranty APOP01-663 **Cancelled** ("Warranty created in error"). Neither is Approved | None — stays ❌ FAIL. Sale numbers appear only on archived quotes that carry a generated warranty contract (one of them cancelled); 6480 has neither, so the rule is still Q-003 for the author |
| F-6 (Minor) | AP2494_019 step 5 image | From the existing record (not re-run) | The "No entities found" image belongs to the VIN search `3KPFL4A76HE021135` (step 4) | None |

Not done here: F-3 (rename `_fail` → `_blocked` for BLOCKED evidence — "on the next execution of these cases"), F-4 (bug filing at s5) and F-5 (wording fix in `qa-artifacts/qa-docs/quote-creation.md`) are outside this re-capture. The F-2 facts above are the input F-5 asks for: 6040 and 6041 both carry a generated warranty contract (APOP01-671 Pending approval; APOP01-663 Cancelled); 6480 has none.

New screenshots (10): `AP2494_016-step4-LowercaseVinSearchPage1of5FullPage_pass.png`, `AP2494_016-step4-LowercaseVinSearchPage5of5FullPage_pass.png`, `AP2494_016-step4-LowercaseVinSearchTermInDialog_pass.png`, `AP2494_010-step2-Quote6480SaleSectionAP2494-S-957_fail.png`, `AP2494_010-step4-Archived6040And6041ContractsCells_fail.png`, `AP2494_010-step4-Quote6040DetailsSaleAndWarranty_fail.png`, `AP2494_010-step4-Quote6041DetailsSaleAndWarranty_fail.png`, `AP2494_010-step4-Warranty671ContractOf6040_fail.png`, `AP2494_010-step4-Warranty671PendingApprovalRow_fail.png`, `AP2494_010-step4-Warranty663CancelledRow_fail.png` — all under `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/`. The browser tab was closed afterwards.

Counts after the re-capture: 19 cases — 14 PASS · 1 FAIL · 4 BLOCKED · 0 SKIPPED (unchanged, 74 %).

---

## Bugs filed at s5 (2026-11-01T21:16Z UTC)

Filed by stlc-bug-reporter under the R3 round 2 Gate C decision (qa-artifacts/7-reviews/AP-2494_review.md). Results are unchanged; only the BLOCKED reasons now name the bug (R3 round 1 F-4).

| Bug | Ticket | Test cases | Link |
|---|---|---|---|
| BUG-001 — a saved sale contract number does not appear in the Contracts column | AP-2517 (Medium, assigned to Ken Nguyen) | AP2494_010 — FAIL | Relates → AP-2494 |
| BUG-002 — the roadside "Generate Contract" page returns HTTP 500 | AP-2518 (High, assigned to Ken Nguyen) | AP2494_005, AP2494_008, AP2494_012 — BLOCKED | Relates → AP-2494, Relates → AP-2508 |

AP2494_007 stays BLOCKED for test data not on dev (no GAP insurance contract); it has no bug.
