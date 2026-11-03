# Bug Report

**Project:** Avantage Plus v2 — Admin and Dealer portals, AP-2501: Permaplate invoice — include name of the term in the description
**Report ID:** BR-20261102-001
**Test Cycle:** AP-2501 single-ticket STLC run, run folder no-sprint. Executed on **Dev (v2dev)** on 2026-11-02 (UTC), by the user's decision: 1 PASS, 1 FAIL, 4 BLOCKED.
**Date:** 2026-11-02
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md · qa-artifacts/3-test-cases/AP2501_TestCases_001-005.md, AP2501_TestCases_006-006.md

**Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Admin portal and Dealer portal (dealer 1380, "Test QA staging"). Staging was not checked in this run; the test-case files still name v2staging as their environment (R3 finding F-2).

| Metric | Value |
|---|:---:|
| Total defects | 1 |
| Critical | 0 |
| High | 1 |
| Medium | 0 |
| Low | 0 |
| Tracker tickets created | 1 (AP-2529 — status Backlog) |

**Decisions:**
- Gate C (by the independent reviewer — R3 round 1 APPROVE, the R3 section of `qa-artifacts/7-reviews/AP-2501_review.md`): the one FAIL, AP2501_003, is filed as a **new** bug — rule C4. Rule C1 (not a bug) does not hold: the requirement capture and the two AP-2501 comments contain no sentence saying the invoice PDF is meant to return an error. No open bug names the Admin invoice "PDF" button or `/admin/invoice/{id}/pdf`: AP-2512 is the Permaplate **contract** download from the quote page (`/quote/{quoteId}/permaplate-contract-download`) and AP-2519 is "Download all documents" (`/quote/{id}/documents/download`) — a different screen and a different document, so neither C2 nor C3 holds. A second search at s5 (2026-11-02T00:53Z, open bugs matching "invoice pdf" or "invoice") found no new candidate.
- The bug is written as a route-wide invoice-PDF fault, not as "the term is missing from the PDF": the term on the PDF could not be checked at all.
- It is a **stopping bug** for AP-2501 (Gate D): it blocks AP2501_003 steps 3–4 and the PDF part of AP2501_006, and its severity is High.
- The four BLOCKED cases are not bugs and are reported in the test report: AP2501_002, AP2501_004 and AP2501_005 (environment — dealer 1380 has only one Permaplate term, "10 ans", linked on Dev) and AP2501_006 (Q-001, Blocking, unanswered).

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2501_003 | Admin invoice PDF button (/admin/invoice/{id}/pdf) returns an HTTP 500 error page on Dev for every invoice | High | P1 | [AP-2529](https://garantieavantageplus.atlassian.net/browse/AP-2529) | Open |

---

## Bug Details

---

### BUG-001 — Admin invoice PDF button (/admin/invoice/{id}/pdf) returns an HTTP 500 error page on Dev for every invoice

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2501_003 (step 2) |
| **Requirement** | AP-2501 REQ-002 — "The invoice PDF shows the term name in the description" (acceptance criterion surface "On the invoice generated PDF") |
| **Severity** | High — no invoice PDF can be produced at all, for any invoice, so Avantage Plus staff cannot issue the invoice document to a dealer, and AP-2501's change to the PDF cannot be checked |
| **Priority** | P1 — it blocks the release of AP-2501, whose acceptance criterion names the invoice PDF |
| **Environment** | **Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Admin portal · Chromium (Playwright) · Windows 11 · viewport 1280 × 800. Staging was not checked |
| **Tracker Ticket** | [AP-2529](https://garantieavantageplus.atlassian.net/browse/AP-2529) — Bug, priority High, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2501 and Relates → AP-2512; 1 screenshot embedded in the description (verified: 1 media node with id), filed 2026-11-02T00:54Z UTC |
| **Status** | Open |
| **First found** | 2026-11-02 (an earlier sighting on invoice 934 during the AP-1381 run on 2026-11-01 was not filed) |
| **Reproducibility** | Always — 9 of 9 invoices tried by the executor (941, 940, 937, 936, 935, 934, 930, 900, 800) and 7 of 7 re-checked by the reviewer (941, 940, 934, 800, 500, 200, 50); two attempts on 941 (direct request and a real click into a new tab) |

**Summary:**
On the Admin portal invoice page (`/admin/invoice/{id}`), the **PDF** button opens `/admin/invoice/{id}/pdf`, which answers HTTP 500 with the French error page "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." instead of the invoice PDF, for every invoice tried — Permaplate and warranty invoices alike — while the invoice page itself loads normally.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/admin/login` and sign in with an Avantage Plus admin account (the QA used the Dev admin account).
2. In the Admin sidebar click **Invoices**. The list `https://v2dev.garantieavantageplus.ca/admin/invoices` opens with the columns Invoice ID · Description · Amount · Created at · Status.
3. Open invoice 941 — click its row, or go to `https://v2dev.garantieavantageplus.ca/admin/invoice/941`. The page "Invoice #941" loads (HTTP 200) with the buttons Back, Print, Edit, Credit memo, Add payment and **PDF**; its Description reads "Terme Invoice1102 / Ford Focus 2008 / VIN : 1FAHP35NX8W239204 / PNA-0000000020 / 10 ans / Test QA staging vinhle870@gmail.com" and its Grand Total is $91.98. (Invoice 941 is a Permaplate invoice created on 2026-11-01 from quote 6555, contract PNA-0000000020; any other invoice id gives the same result.)
4. Click **PDF**. It opens `https://v2dev.garantieavantageplus.ca/admin/invoice/941/pdf` in a new tab.
5. Look at the new tab, and at the request in the browser's network panel.
6. Repeat steps 3–5 with any other invoice, for example `https://v2dev.garantieavantageplus.ca/admin/invoice/934/pdf` (a warranty invoice) or `https://v2dev.garantieavantageplus.ca/admin/invoice/800/pdf`.

**Expected Result:**
The PDF of invoice 941 opens (HTTP 200, `Content-Type: application/pdf`), showing invoice number 941, Grand Total $91.98 and the invoice description — which, after AP-2501, should name the Permaplate term sold ("10 ans"). AP-2501's acceptance criterion lists "On the invoice generated PDF" as one of the places the term name must appear.

**Actual Result:**
No PDF is served. The request and its answer are:

`GET https://v2dev.garantieavantageplus.ca/admin/invoice/941/pdf → 500, Content-Type: text/html; charset=UTF-8`

The new tab shows the French technical-error page "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois.", drawn inside the **dealer** portal layout (dealer sidebar "Test QA staging") although it was opened from the Admin portal. The same HTTP 500 answer came back for invoices 940, 937 (warranty), 936, 935, 934 (warranty), 930, 900 and 800 during execution, and for 941, 940, 934, 800, 500, 200 and 50 when the reviewer re-checked at 2026-11-02T00:49Z, while `/admin/invoice/941` itself answered 200 and shows the PDF button. Because no PDF is ever served, whether the PDF names the Permaplate term ("10 ans") could not be checked. The dealer's own invoice page (`/invoice/941`) offers no invoice PDF at all — only **Print**, which calls the browser's `window.print()` on the HTML page — so there is no other route to the invoice PDF.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_003-step2-AdminInvoicePdfHttp500_fail.png` — the tab opened by the Admin "PDF" button for invoice 941: the French "Erreur" technical-error page instead of the invoice PDF. The screenshot does not show the address bar; the request line and status are quoted in the Actual Result above |
| Network | `GET /admin/invoice/941/pdf → 500 text/html; charset=UTF-8` (executor, two attempts, and reviewer re-check) |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for dev investigation. The fault is route-wide (every invoice id, Permaplate and warranty), so it lies in the invoice PDF generation itself rather than in the Permaplate description. The Permaplate contract download (`/quote/{quoteId}/permaplate-contract-download`, AP-2512) fails with the same error page on Dev, so a shared PDF-rendering dependency is a likely common cause. Nothing on record shows this route working on Dev, and its first sighting (2026-11-01) is after AP-2501's pull request was merged (2026-10-30), so whether the AP-2501 change caused it cannot be said either way.

**Notes:**
- Earlier sighting: during the AP-1381 run on 2026-11-01, `/admin/invoice/934/pdf` (warranty invoice 934) returned the same error page; it was not filed then.
- Related: AP-2501 (the story whose PDF check this blocks — AP2501_003 steps 3–4 and the PDF part of AP2501_006), AP-2512 (same error page on the Permaplate contract download, a different route and document).
- Test data left on Dev: quote 6555 with Permaplate contract PNA-0000000020 and unpaid invoice 941 ($80.00, Grand Total $91.98).

---

## Defect Distribution

_One serious problem: the invoice PDF cannot be produced for any invoice on Dev, which also stops the AP-2501 PDF check._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 1 | AP2501_003 (and the PDF part of AP2501_006) |
| Medium | 0 | — |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — Term name on the invoice details page | 0 | — |
| REQ-002 — Term name on the invoice PDF | 1 | BUG-001 |
| REQ-003 — Term name on the dealer and admin invoice lists | 0 | — |
| REQ-004 — Term name follows the contract number | 0 (PDF part not checkable because of BUG-001) | — |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill (stage s7 of stlc-ticket-pipeline, Gate D)
**Date:** 2026-11-02T00:57Z (UTC)

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2529 | Filed in s5; no Gate D action — the bug is in Backlog, not in the QA status (routing §3.2) | Backlog | 2026-11-02T00:57Z |
| — (story) | AP-2501 | Story result comment 19455 posted (FAIL, 1/6, Tested on: Dev (v2dev), Staging not checked; Q-001 reminder; Q-007 raised) and read back; status not changed — pass rate 17% (needs 90%), AP-2529 stopping, Q-001 open | QC (unchanged) | 2026-11-02T00:57Z |
