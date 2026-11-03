# Bug Report

**Project:** Avantage Plus (AP) — Dealer portal
**Report ID:** BR-20261102-001
**Test Cycle:** AP-2496 — Download all finalized documents from a quote in one click (run folder `no-sprint`)
**Date:** 2026-11-02
**Reported by:** QA Agent — Bug Reporter Skill (inside stlc-ticket-pipeline, `--from s5`)
**Source:** `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2496_2026-11-02.md` and `qa-artifacts/3-test-cases/AP2496_TestCases_006-009.md`
**Tested on:** Dev (v2dev) — chosen by the user for this run

| Metric | Value |
|---|:---:|
| Total defects | 1 |
| Critical | 0 |
| High | 1 |
| Medium | 0 |
| Low | 0 |
| Tracker tickets created | 1 |

**Gate C decisions applied (R3 round 2, APPROVE — `qa-artifacts/7-reviews/AP-2496_review.md`):** AP2496_008 FAIL → rule C4, **File new**. The duplicate search found no open bug that names `/quote/{id}/documents/download` or the "Download all documents" action. AP-2512 is a different address (`/quote/{id}/permaplate-contract-download`) and AP-2518 is contract creation, not download.

**BLOCKED cases are not filed as new bugs.** AP2496_001, 004, 005, 006, 007 and 009 are blocked by the existing open bug **AP-2518** (opening the roadside "Generate Contract" page of a quote returns HTTP 500 on Dev). AP2496_009 is also blocked because no quote id of another dealership is known on Dev. These cases are re-run with "AP-2496 --from s4" once AP-2518 is fixed.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2496_008 | "Download all documents" (`/quote/{id}/documents/download`) returns an HTTP 500 error page on Dev, even when every source PDF downloads correctly | High | P1 | [AP-2519](https://garantieavantageplus.atlassian.net/browse/AP-2519) | Open |

---

## Bug Details

---

### BUG-001 — "Download all documents" returns an HTTP 500 error page instead of the merged PDF

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2496_008 (quote 6488); main reproduction on existing quote 6040 |
| **Requirement** | REQ-003 — One concatenated PDF is returned when "Download all documents" is used (AP-2496 acceptance criterion 3); also REQ-002 (the address must answer without a server error) |
| **Severity** | High — the story's core feature does not work at all: a dealer who clicks "Download all documents" on a quote that holds contracts gets a French technical-error page instead of the merged PDF, and has to download every document one by one |
| **Priority** | P1 |
| **Environment** | Tested on: Dev (v2dev) — https://v2dev.garantieavantageplus.ca/ · Chromium (Playwright) 1280 × 800 · Windows 11 |
| **Tracker Ticket** | [AP-2519](https://garantieavantageplus.atlassian.net/browse/AP-2519) — linked *relates to* AP-2496, assigned to Ken Nguyen (`bug_new_assign`), priority High, labels `qa-agent`, `stlc-automated` |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always — quote 6040: 4 of 4 tries; quote 6488: 4 of 4 tries; also quotes 6480 and 6486 |

**Summary:**
On the Dev Dealer portal, the "Download all documents" link on a quote's details page opens `/quote/{id}/documents/download`, which returns HTTP 500 and the French page "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." instead of one merged PDF, even on quote 6040 where each of the two documents it should merge downloads correctly on its own.

**Steps to Reproduce:**

Main reproduction — quote 6040, which already holds a warranty contract and a sales contract:

1. Open https://v2dev.garantieavantageplus.ca/login and sign in to the Dealer portal with the shared QA dealer account (dealer 1380, "Test QA staging").
2. Open https://v2dev.garantieavantageplus.ca/quote/6040/details. The page loads normally.
3. Open https://v2dev.garantieavantageplus.ca/warranty/671/pdf. The warranty contract PDF downloads: HTTP 200, `application/pdf`, 5 pages.
4. Open https://v2dev.garantieavantageplus.ca/quote/6040/sales/pdf. The sales contract PDF downloads: HTTP 200, `application/pdf`, 6 pages.
5. Go back to https://v2dev.garantieavantageplus.ca/quote/6040/details. In the "Summary of products" table, in the last row directly under "Subtotal", click the link "Download all documents" (French: "Télécharger tous les documents"). It opens `/quote/6040/documents/download` in a new tab.
6. Observe the new tab, or open https://v2dev.garantieavantageplus.ca/quote/6040/documents/download directly, and look at the response status in the browser's developer tools (Network tab).

Test-case reproduction (AP2496_008) — a quote with no product, quote 6488:

7. While still signed in, open https://v2dev.garantieavantageplus.ca/quote/6488/details. The page loads normally with the heading "#6488 - Docs Download2496-008B 1FAHP35NX8W239204".
8. Open https://v2dev.garantieavantageplus.ca/quote/6488/documents/download and look at the response status.

To create a fresh quote like 6488 instead: open https://v2dev.garantieavantageplus.ca/vehicle/915/details, click "Create quote", enter a client last name (for example `Download2496-008B`) and an email, click "Save", then on the vehicle step set the delivery date to today and the price to 20000 and click "Save". Do not add any product. Then open `/quote/{new id}/documents/download`.

**Expected Result:**
On quote 6040, "Download all documents" returns HTTP 200 with one PDF (`application/pdf`) that holds the pages of both the warranty contract and the sales contract, as AP-2496's acceptance criterion says ("One concatenated PDF is returned"). On quote 6488, which holds no contract, the address answers without a server error — for example with an empty result, a message, a redirect or an access-denied page, but not an HTTP 5xx.

**Actual Result:**
On quote 6040, `GET /quote/6040/documents/download` returns **HTTP 500** (`text/html; charset=UTF-8`) and the page "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." No file is downloaded. This happened 4 times out of 4, although both source PDFs (steps 3 and 4) download with HTTP 200. On quote 6488, `GET /quote/6488/documents/download` also returns **HTTP 500** with the same page, 4 times out of 4, while `/quote/6488/details` loads normally in the same signed-in session — so the error comes from the download address, not from sign-in or from the quote.

**Evidence:**

| Type | Path / Link |
|---|---|
| Network requests (quote 6040) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/Supplementary-NetworkRequests-6040_fail.txt` — `[GET] https://v2dev.garantieavantageplus.ca/quote/6040/documents/download => [500]` twice; method, URL and status only |
| Network requests (quote 6488, AP2496_008) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_008-step4-NetworkRequests-6488_fail.txt` — `[GET] https://v2dev.garantieavantageplus.ca/quote/6488/documents/download => [500]` twice; method, URL and status only |
| Screenshot (quote 6040) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/Supplementary-Quote6040-DownloadAll500-Recapture.png` — the French "Erreur" page returned for quote 6040 |
| Screenshot (quote 6488) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_008-step4-DownloadAllQuote6488-Recapture500_fail.png` — the same page returned for quote 6488, dealer "Test QA staging" signed in |
| Console log | None captured. The server log for these requests (2026-11-01 22:01:59Z – 22:02:23Z UTC) should show the exception |

**Suggested Root Cause:**
Unknown — for developer investigation. Because both source PDFs of quote 6040 download correctly on their own, the fault is most likely in the merge step of `/quote/{id}/documents/download` (collecting the documents or concatenating them), not in the individual document generators. The same 500 on a quote with no document at all (6488, 6486) suggests the action also does not handle an empty document list.

**Notes:**
- Secondary evidence, weaker: quote 6480 (Chubb creditor contract AVP000170) also returns HTTP 500 on `/quote/6480/documents/download`, but its own Chubb contract PDF (`/quote/6480/chubb/insurance/contract-pdf`) returns HTTP 500 too, so on that quote the merge may only be failing because one source document fails.
- A quote with no product (6486) returns HTTP 500 on the same address as well.
- Possibly related, different address: AP-2512 (downloading an Esthetic protection contract PDF, `/quote/{quoteId}/permaplate-contract-download`, returns HTTP 500 on Dev). It is listed only so the developer can check whether the two share a cause.
- The "Download all documents" link itself is shown correctly: once on quotes that hold a contract, hidden on quotes that hold none (AP2496_002 and AP2496_003 passed).
- Records left on Dev by this run: quotes 6484–6489 (client inboxes `client.stage.961` to `client.stage.966@yopmail.com`); no contract was created.

---

## Defect Distribution

_How the bugs break down by how serious they are: one problem, but it stops the story's main feature._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 1 | AP2496_008 |
| Medium | 0 | — |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-002 — "Download all documents" action shown only when there is something to download | 1 | BUG-001 |
| REQ-003 — One concatenated PDF is returned | 1 | BUG-001 |

---

## Blocked test cases (not filed — existing bug)

| TC ID | Blocked by | Note |
|---|---|---|
| AP2496_001 | AP-2518 | Roadside Generate Contract HTTP 500 on quote 6484 (2 of 2) |
| AP2496_004 | AP-2518 | Needs a roadside contract |
| AP2496_005 | AP-2518 | Needs a roadside contract |
| AP2496_006 | AP-2518 | Needs a roadside contract |
| AP2496_007 | AP-2518 | Needs a roadside contract; Q-006 (no known cancel screen) also open |
| AP2496_009 | AP-2518 | Also: no quote id of another dealership is known on Dev |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** 2026-11-02

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2519 | Created by stlc-bug-reporter (s5): description written as wiki markup, 4 evidence files attached (2 network-request `.txt` files linked, 2 page captures embedded — all 4 resolved), linked *relates to* AP-2496, assigned Ken Nguyen | Backlog | 2026-11-02 |
| — (story) | AP-2496 | Gate D (s7): story result comment posted (Jira comment 19451, 9 test-case rows, read back), Tested on: Dev (v2dev). Status and assignee left unchanged — pass rate 22% (needs 90%), AP-2519 (High) open, AP-2518 blocks 6 cases | QC (unchanged) | 2026-11-02 |
