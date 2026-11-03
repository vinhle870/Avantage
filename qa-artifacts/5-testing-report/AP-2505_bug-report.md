# Bug Report — AP-2505

**Project:** Avantage Plus v2 — Dealer portal (Jira project AP)
**Report ID:** BR-20261103-001
**Test Cycle:** AP-2505 — Generate contract for a quote's Roadside protection product (single-ticket STLC run, run folder `no-sprint`)
**Date:** 2026-11-03
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2505_2026-11-03.md, qa-artifacts/3-test-cases/AP2505_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2505_TestCases_006-010.md
**Environment:** Dev (v2dev) — https://v2dev.garantieavantageplus.ca/ (the execution environment chosen for this batch)
**Gate C decision:** independent reviewer, R3 round 1, APPROVE — rule C2 for both failures (qa-artifacts/7-reviews/AP-2505_review.md)

| Metric | Value |
|---|:---:|
| Total defects | 1 (already filed as AP-2518 — no new ticket) |
| Critical | 0 |
| High | 1 |
| Medium | 0 |
| Low | 0 |
| Tracker tickets created | 0 |

Two test cases failed, AP2505_001 at step 3 and AP2505_002 at step 4, and both failed for the
same reason: the roadside contract page `/quote/{quote id}/road-side-protection-create-contract`
answers HTTP 500 on Dev, and the Roadside Protection row's "Generate Contract" menu item opens a
pop-up that never stops showing "Loading...". This is the defect already open as **AP-2518**
(High, Backlog). Following the reviewer's Gate C decision (rule C2), no new bug was filed. The new
evidence from this run was added to AP-2518 as a comment with the screenshots, and AP-2518 was
linked to AP-2505 ("relates to").

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2505_001 (step 3), AP2505_002 (step 4) | Opening the roadside contract page of a quote returns HTTP 500, and its "Generate Contract" pop-up stays on "Loading..." | High | P1 | [AP-2518](https://garantieavantageplus.atlassian.net/browse/AP-2518) — commented, not new | Open |

---

## Bug Details

---

### BUG-001 — The roadside contract page returns HTTP 500 and the "Generate Contract" pop-up stays on "Loading..."

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2505_001 (step 3 — the step under test) and AP2505_002 (step 4 — the step under test). The same fault also blocked AP2505_003, _005, _006, _007, _008, _009 and _010 |
| **Requirement** | REQ-001 — AC 1: "Given a quote with a GAP insurance quote and no contract, when the dealer chooses “Generate Contract” from the Roadside protectection row actions, then /quote/{quoteId}/road-side-protection-create-contract opens in the same tab with no modal." |
| **Severity** | High — a dealer cannot create a roadside protection contract from any quote: the menu item never finishes loading and the page itself is a technical-error page |
| **Priority** | P1 — it blocks the whole story: nine of the ten test cases depend on this page |
| **Environment** | Dev (v2dev) · Dealer portal, dealer 1380 "Test QA staging" · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · app version not shown by Dev |
| **Tracker Ticket** | [AP-2518](https://garantieavantageplus.atlassian.net/browse/AP-2518) (existing, High, Backlog) — Gate C rule C2: comment on existing |
| **Status** | Open |
| **First found** | 2026-11-02 (AP-2494 run, quotes 6479/6480); seen again 2026-11-03 in this run |
| **Reproducibility** | Always — 6 of 6 new quotes (6568–6573), by the menu and by typing the address |

**Summary:**
On Dev, choosing "Generate Contract" in the ⋯ menu of a quote's Roadside Protection row opens a pop-up that stays on "Loading...", and opening `/quote/{quote id}/road-side-protection-create-contract` directly returns HTTP 500 with the French technical-error page — even for a brand-new vehicle whose VIN has no roadside contract.

**Steps to Reproduce:**

1. Open https://v2dev.garantieavantageplus.ca/login and sign in to the Dealer portal with the QA dealer account (dealer 1380).
2. Open `/vehicle/new/edit/PASSENGER` and add an inventory vehicle: VIN `2T1BURHE0NC505001` (or any unused 17-character VIN), Make "Toyota", Model "Corolla", Year 2022, then click "Save". The message "Vehicle saved" appears; note the vehicle id from the address bar (this run: 1130).
3. Open `/quote/new/client?fromVehicleId=<vehicle id>` and fill the client form: Email `client.stage.2505001@yopmail.com` (any unused address), First name "Roadside", Last name "Owner2505-001", a street address, city, province "Québec", postal code and phone, tick the "I agree" box and click "Save". The quote page `/quote/<quote id>/details` opens (this run: 6568).
4. On the vehicle step, set "Delivered at" to today's date and "Price" to 20000 and save. Add a financing to the quote and save it ("Financing saved"). (Optional: also save a GAP insurance quote — the fault happens with and without one.)
5. On the quote page, open the Roadside Protection row, choose the first tier "Protection Hasards PNEU + ROUE | Standard | 12 months | 200$", type Policy Sale price 250 and click "Save". The message "The Roadside protection coverage has been saved successfully" appears and the Roadside Protection row shows CA$250.00 with a ⋯ menu (Edit · Generate Contract · Delete).
6. Open the Roadside Protection row's ⋯ menu and click "Generate Contract". **Wrong result:** the address bar stays on `/quote/<quote id>/details`, a pop-up opens over the quote and stays on "Loading...", and the request `GET /quote/<quote id>/road-side-protection-create-contract` answers 500.
7. Type `https://v2dev.garantieavantageplus.ca/quote/<quote id>/road-side-protection-create-contract` in the address bar. **Wrong result:** HTTP 500 and the page "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." No "Program Summary" and no "Generate Contract" button appear.

**Expected Result:**
Per AC 1 of AP-2505, choosing "Generate Contract" from the Roadside Protection row opens `/quote/{quoteId}/road-side-protection-create-contract` in the same tab, with no pop-up, as a full page showing the owner, financing and vehicle sections and a "Program Summary" with a "Generate Contract" button. Opening the same address directly shows the same page.

**Actual Result:**
The menu item opens a pop-up (its link still carries `data-toggle="modal" data-target="#myModal"`) that stays on "Loading...", because the page behind it answers HTTP 500. Typed directly, the address shows the French technical-error page with HTTP 500. This happened on all six quotes built in this run — 6568 (financing + GAP quote), 6569 (financing, no GAP), 6570 (no financing), 6571, 6572 and 6573 (financing) — all on new VINs `2T1BURHE0NC505001/002/006/007/008/009` that have no roadside contract.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_001-step3-ModalStuckLoading_fail.png` — quote 6568, pop-up stuck on "Loading..." |
| Network lines | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_001-step3-network_fail.txt` — `GET /quote/6568/road-side-protection-create-contract => 500`, address bar unchanged, link markup |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_001-step4-DirectAddressHttp500_fail.png` — quote 6568, address typed directly, technical-error page |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_002-step4-ModalStuckLoading_fail.png` — quote 6569 (no GAP quote), pop-up stuck on "Loading..." |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_002-step4-DirectAddressHttp500_fail.png` — quote 6569, address typed directly, technical-error page (faint: captured during the fade-in, reviewer F-11) |
| Console log | 500 response on the request above; no other error recorded |

**Suggested Root Cause:**
Unknown — for dev investigation. AP-2518 suggested that existing roadside contracts on the same VIN (contracts #2697 and #2698 on vehicle 915) might cause the error. This run rules that out: the six VINs used here are new and have no roadside contract, and the error occurs with and without a GAP quote and with and without financing. Separately, the Roadside row's link is still a pop-up link on Dev while the GAP row's link on the same quote is a plain link, so the AP-2505 change itself does not appear to be deployed to Dev (AP-2505 shows one Bitbucket branch, last updated 2026-10-30, and no pull request). That is a deployment question for AP-2505, not a separate defect.

**Notes:**
- Gate C (R3 round 1, rule C2): AP-2518's summary names the same page and the same wrong behaviour — "opening its contract page /quote/{quote id}/road-side-protection-create-contract returns HTTP 500 and the French technical-error page … from the roadside row's ⋯ menu → Generate Contract the dialog stays on "Loading..." and the browser console logs a 500 from the same URL." Duplicate searches: "road-side-protection-create-contract", "roadside contract 500", "Roadside Generate Contract", "roadside Loading", "roadside protection contract", "road side protection". Other candidates (AP-2508, AP-2517, AP-2523, AP-2524, AP-2525) describe a different behaviour or screen.
- Known defect AP-2508 (roadside product form) was not hit: every roadside product saved with a plain "Save".
- Test data left on Dev: vehicles 1130–1135, quotes 6568–6573, each with a roadside product (CA$250.00) and no contract or invoice.

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 1 | AP2505_001, AP2505_002 (FAIL); blocks AP2505_003, _005–_010 |
| Medium | 0 | — |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — Dedicated page at the unchanged address | 1 | BUG-001 (AP-2518) |
| REQ-002 — Two-column layout | 0 | — (blocked by BUG-001; AP2505_004 also blocked by Q-001) |
| REQ-003 — Pre-fill and read-only financing | 0 | — (blocked by BUG-001) |
| REQ-004 — Submit creates the contract | 0 | — (blocked by BUG-001) |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** 2026-11-03

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2518 | Gate C rule C2: comment 19464 posted (Environment: Dev) with 4 screenshots embedded and the network .txt attached (attachments 14222–14226; read back: 5 media nodes resolved); link AP-2518 relates to AP-2505 added and read back on both tickets. No new bug filed | Backlog (unchanged — not in a QA status, so no Gate D action) | 2026-11-03T05:37:56Z |
| — | AP-2505 | Gate D: story result comment 19465 posted (Environment: Dev; FAIL, 10 TC rows, deployment question to the developer, Q-001–Q-012) and read back. Not moved: pass rate 0% (needs 90%), AP-2518 open, Q-001 unanswered | QC (unchanged) | 2026-11-03T05:39:19Z |
