# Execution Log — AP-2463 (bug re-test)

**Ticket:** AP-2463 — Permaplate contract list "Client phone" shows the work number while the quote page shows the home number
**Test cases:** `qa-artifacts/3-test-cases/AP2463_TestCases_001-003.md`

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (pipeline stage s4)
**Date:** 2026-10-04
**Base URL:** https://v2staging.garantieavantageplus.ca (Staging, v2staging)
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 01:36 → 01:38 UTC (browser time)

| Metric | Value |
|---|:---:|
| Total test cases | 3 |
| Passed | 3 |
| Failed | 0 |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **100% (3 of 3)** |

**Verdict:** the fix is in. Both lists now show both numbers for Perma Testclient, each labelled, on two lines — `Cell: 5145550101` and `Home: 5145550100` — with Cell carrying the work number and Home the home number, as agreed. The only difference from the agreed format is that the digits are not dashed (expected `514-555-0101`); per the judging rule this is recorded as an observation, not a failure.

**Smoke check:** the `env-check` source is `missing` in the knowledge registry, so no separate smoke test was run; both logins succeeding at the start served as the environment check.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2463_001 | Dealer list shows both labelled numbers for Perma Testclient | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2463/AP2463_001-step4-pass.png` | Cell reads "Cell: 5145550101 / Home: 5145550100" — labels right, digits undashed |
| AP2463_002 | Admin list shows the same labelled numbers | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2463/AP2463_002-step4-pass.png` | Same two lines inside the admin "Client" cell, as tel: links |
| AP2463_003 | Other columns, Download and quote-page home number unchanged | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2463/AP2463_003-step5-pass.png` | Five headers unchanged; PDF returns 200; quote page still shows 5145550100 |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP2463_001 — The dealer's Permaplate contract list shows both the client's cell and home numbers, labelled, for Perma Testclient — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in to the Dealer portal at `/login` | Dealer home opens for "Test QA staging" | Filled "Courriel" and "Mot de passe", clicked "Login"; URL = `/`; heading = "Hi Vinh Le 1 Welcome to Test QA staging's account" | ✅ | Logged in on the first attempt |
| 2 | Open `/permaplate-contracts` | The list loads; record heading and sidebar label | URL = `/permaplate-contracts`; page heading = "Esthetic protection contracts"; sidebar link "Esthetic protection" → `/permaplate-contracts` | ✅ | The program is now labelled "Esthetic protection" — recorded, not failed |
| 3 | Find the row for Perma Testclient / VIN `1FAHP35NX8W239204` (every page) | The row is found | Table has 3 rows and no pagination; row 3 = VIN "1FAHP35NX8W239204", Client name "Perma Testclient", Download → `/quote/6284/permaplate-contract-download` | ✅ | The list has no contract-number column; the row was matched by client, VIN and quote 6284 in its Download link, which is contract PNA-0000000007 |
| 4 `[Verification]` | Read the "Client phone" cell of that row | "Cell: 514-555-0101" and "Home: 514-555-0100" on two lines; FAIL if one number, missing label or swapped | Cell innerText = `"Cell: 5145550101\nHome: 5145550100"`; innerHTML = `Cell: 5145550101<br>Home: 5145550100`; on screen two lines "Cell: 5145550101" over "Home: 5145550100" | ✅ | Both numbers, both labels, Cell = work (…0101), Home = home (…0100). Digits are not dashed — observation, not a failure, per the agreed judging rule |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2463/AP2463_001-step4-pass.png` — close-up of the Perma Testclient row on the dealer list, phone cell reading "Cell: 5145550101" over "Home: 5145550100"

### AP2463_002 — The admin Permaplate contract list shows the same labelled cell and home numbers as the dealer list — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in at `/admin/login` ("Courriel", "Mot de passe", "Se connecter") | `/admin` opens | Clicked "Se connecter"; URL = `/admin` | ✅ | Dealer session was still held in the same browser |
| 2 | Open `/admin/permaplate-contracts` | List loads; record heading and column headers | URL = `/admin/permaplate-contracts`; heading = "Esthetic protection Contracts"; headers = "Client", "Dealer", "Vehicle", "Program", "Actions"; pagination "1, 2, Next, Last" | ✅ | There is no separate "Client phone" column on the admin list — the phones sit inside the "Client" cell, under the e-mail |
| 3 | Find the row for PNA-0000000007 / Perma Testclient (every page) | The row is found | Page 1, row 8: Client "Perma Testclient", Dealer "Test QA staging", Vehicle "Ford Focus 2008 VIN: 1FAHP35NX8W239204", Program "10 ans (120 months)"; eye icon → `/admin/permaplate-contract/7`, whose heading reads "Esthetic protection Contract PNA-0000000007" | ✅ | Contract number confirmed on the details page because the list does not show it. Page 2 checked too (contracts 1–4) |
| 4 `[Verification]` | Read the phone shown for that row | "Cell: 514-555-0101" and "Home: 514-555-0100", same format as the dealer list | Client cell innerText = `"Perma Testclient\nperma.test.0906@yopmail.com\nCell: 5145550101\nHome: 5145550100"`; HTML = `Cell: <a href="tel:5145550101">5145550101</a><br> Home: <a href="tel:5145550100">5145550100</a>` | ✅ | Identical labels, order and digits to the dealer list; numbers are clickable tel: links. Same undashed formatting observation |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2463/AP2463_002-step4-pass.png` — close-up of the Perma Testclient row on the admin list, Client cell showing "Cell: 5145550101" and "Home: 5145550100" under the e-mail

### AP2463_003 — After the fix, the dealer list's other columns, its Download button and the quote page's home number are unchanged — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Signed in as dealer; open `/permaplate-contracts` | The list loads | URL = `/permaplate-contracts`; heading = "Esthetic protection contracts"; 3 rows | ✅ | Dealer session from AP2463_001 reused |
| 2 `[Verification]` | Read column headers and the PNA-0000000007 row; check every row's phone layout | Headers "VIN", "Client name", "Client phone", "Contract cost price", "Actions"; row VIN `1FAHP35NX8W239204`, "Perma Testclient", `145.00$`, Download with PDF icon → `/quote/6284/permaplate-contract-download`; every row uses "Cell: … / Home: …" | Headers = "VIN", "Client name", "Client phone", "Contract cost price", "Actions"; row = "1FAHP35NX8W239204 \| Perma Testclient \| Cell: 5145550101 / Home: 5145550100 \| 145.00$ \| Download"; Download icon class = `fad fa-file-pdf`, href = `/quote/6284/permaplate-contract-download`, target = `_blank`. Other rows: NonOwner AP2443Test "Cell: 5145550301\nHome: 5145550300"; Perma Retest0913 "Cell: 5145550201\nHome: 5145550200" | ✅ | Columns and row values unchanged since 2026-09-06. Every dealer row has both numbers, so no missing-number row exists on this list — see Environment Observations for how the admin list shows one. Heading rename recorded, not failed |
| 3 | Click "Download" on the PNA-0000000007 row | Contract PDF opens or downloads (HTTP 200, application/pdf) | Click opened a new tab at `/quote/6284/permaplate-contract-download`; a GET of the same URL in the dealer session returned status = 200, content-type = `application/pdf`, Content-Disposition = `inline; filename=permaplate-7.pdf`, body starts `%PDF-1.4`, 492,778 bytes | ✅ | File name ties it to contract id 7 (PNA-0000000007). PDF text is compressed, so client name inside was not machine-read. Tab closed afterwards |
| 4 | Open `/quote/6284/details` | "#6284 - Perma Testclient" loads | URL = `/quote/6284/details`; heading = "#6284 - Perma Testclient 1FAHP35NX8W239204" | ✅ | VIN is part of the heading text |
| 5 `[Verification]` | Read the phone in the Client section | Still the home number 5145550100 | Client card innerText = "Perma Testclient / 100 Rue Principale / Montreal Québec / H2X 1Y4 / perma.test.0906@yopmail.com / 5145550100" (phone icon, no label) | ✅ | Quote page unchanged: home number only, unlabelled |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2463/AP2463_003-step2-pass.png` — full dealer list: the five column headers and all three rows, each phone cell in the "Cell: … / Home: …" layout
- `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2463/AP2463_003-step5-pass.png` — Client card on quote 6284 showing 5145550100 next to the phone icon

---

## Environment Observations

- **Digit formatting differs from the agreed format.** Ken Nguyen's agreed fix (2026-09-10) says `Cell: xxx-xxx-xxxx`. Both lists print the number as stored: `Cell: 5145550101`, `Home: 5145550100`. Where a number was stored with dashes it shows with dashes (admin rows for Ken Nguyen show `Cell: 124-123-1234` next to `Home: 5146906330`), so formatting is inconsistent across rows. Worth a note on the ticket; not a failure under this run's rules.
- **Program renamed.** Dealer sidebar item and heading now read "Esthetic protection" / "Esthetic protection contracts"; admin heading "Esthetic protection Contracts" and sidebar "Esthetic protection" (the admin product catalogue is still "Permaplate" → `/admin/permaplate`). Routes still use `permaplate`.
- **Missing-number rows (admin list only).** A missing number drops its whole line rather than showing an empty label: contracts 4 and 14 (Ken Nguyen) show only `Home: 5146906330`; contract "TEST CONTRAT" (LNQ Test Portal) shows no phone line at all. Contract 3 (MATHIEU GUILBAULT) shows `Cell: 3` — junk data in the source record, displayed as stored. The dealer list for dealer 1380 has no such rows.
- **Neither list shows the contract number**, so a contract is found by client/VIN (dealer) or via the details page `/admin/permaplate-contract/{id}` (admin).
- No data was changed. No console errors were investigated beyond the single pre-existing one on each login page.
- No test data was created; PNA-0000000007 (admin id 7, quote 6284) was re-used unchanged.
