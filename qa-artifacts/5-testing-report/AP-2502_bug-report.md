# Bug Report

**Project:** Avantage Plus v2 — Dealer portal, AP-2502: separate compliance document PDF for GC960 and 6201
**Report ID:** BR-20261103-002
**Test Cycle:** AP-2502 single-ticket STLC run, run folder no-sprint. Executed on **Dev (v2dev)** on 2026-11-03 (UTC): 5 test cases — 0 PASS, 5 FAIL, 0 BLOCKED (pass rate 0%).
**Date:** 2026-11-03
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2502_2026-11-03.md · qa-artifacts/3-test-cases/AP2502_TestCases_001-005.md · Gate C decisions in qa-artifacts/7-reviews/AP-2502_review.md (R3 round 1)

**Environment: Dev** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal and Admin portal (dealer 1380, "Test QA staging"). Staging was not checked in this run.

| Metric | Value |
|---|:---:|
| Total defects | 1 |
| Critical | 1 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Tracker tickets created | 1 (AP-2542 — status Backlog) |

**Decisions:**
- Gate C was decided by the independent reviewer (R3 round 1, APPROVE). All five FAILs (AP2502_001–005) share one cause and are filed as **one new bug** (rule C3, resolved as "file new" by reviewer rule E2). The only open bug on the same screen is AP-2452 ("A client name of 256 characters or more makes the compliance send return HTTP 500"). That bug is on Staging and fails on the **Send** request after the form is filled; this one fails before the form loads, for any input, on Dev. The new bug is linked "relates to" AP-2452. A second duplicate check at s5 (2026-11-03T05:08Z, open bugs mentioning "compliance" or created in the last day) found no other candidate.
- Rule C1 (not a bug) does not hold: no sentence in the requirement capture or in a ticket comment says that an HTTP 500 on the send form is intended.
- **Not filed**, by the reviewer's Gate C plan: (a) with only `GC960S:S30` assigned, the dealer's creditor **Form** drop-down on Insurance Quick Quote is empty — recorded under question Q-001 in the AP-2502 story comment; (b) the admin page accepts an empty creditor-form selection without a message, and the dealer page then shows "Your account is not configured with creditors insurance. Please contact support." — recorded under question Q-008 in the story comment.
- **What this bug does and does not say about AP-2502.** The send form failed, so no document reached any client. The GC960 / GC6201 document content (product line, footers, English GC960 file) is **untested** — the GC960 change is unproven, not disproven.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2502_001, AP2502_002, AP2502_003, AP2502_004, AP2502_005 | Opening the "Send compliance documents" form returns HTTP 500 on Dev for every creditor-form setup and from both entry points, so no compliance documents can be sent | Critical | P1 | [AP-2542](https://garantieavantageplus.atlassian.net/browse/AP-2542) | Open |

---

## Bug Details

---

### BUG-001 — Opening the "Send compliance documents" form returns HTTP 500 on Dev for every creditor-form setup and from both entry points, so no compliance documents can be sent

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2502_001 (step 2), AP2502_002 (step 2), AP2502_003 (step 2), AP2502_004 (step 3), AP2502_005 (step 2) |
| **Requirement** | AP-2502 acceptance criteria: "**Given** the dealer user is sending compliance documents … **When** the compliance documents are sent **Then** a separate document is filled for each product families" — REQ-001 (GC960 dealer), REQ-002 (GC6201 dealer keeps the existing document), REQ-003 (both families), REQ-004 (English GC960 file) |
| **Severity** | Critical — no dealer on Dev can send compliance documents to a client at all, including the existing GC6201 send that worked before this change; there is no workaround |
| **Priority** | P1 — it blocks the whole AP-2502 feature and the existing compliance send |
| **Environment** | **Environment: Dev** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal and Admin portal · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · UI language English. Seen on Dev only; Staging was not checked |
| **Tracker Ticket** | [AP-2542](https://garantieavantageplus.atlassian.net/browse/AP-2542) — Bug, priority Highest (canonical `immediate`), labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2502 and AP-2452; 5 screenshots embedded in the description and 5 network .txt files attached (verified: 10 media nodes with ids); filed 2026-11-03T05:11Z UTC |
| **Status** | Open |
| **First found** | 2026-11-03 |
| **Reproducibility** | Always — 11 of 11 attempts across four creditor-form setups and two entry points (2026-11-03T04:55Z–04:59Z), and reproduced again read-only by the QA reviewer at 2026-11-03T05:05Z |

**Summary:**
Clicking "Send compliance documents" on the dealer pages Insurance Quick Quote (`/quick-insurance-quote`) and Quote Details (`/quote/{id}/details`) opens a modal that stays on "Loading..." forever, because the request that loads the send form, `GET /compliance-documents/send?redirectUrl=...`, answers HTTP 500 with the page "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois."; this happens whatever creditor forms the dealer is assigned, including the existing GC6201 setup.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login?_locale=en` and sign in with a dealer account that sells Chubb creditor insurance (the QA used dealer 1380, "Test QA staging"; its creditor forms were left as found: `GC6201MQ:PM30` "Creditor Monthly PM30", `GC6201MQ:PM50` "Creditor Monthly PM50" and `AVPG:TGGAP` "GAP", creditor account number `AP0001`).
2. Open `https://v2dev.garantieavantageplus.ca/quick-insurance-quote` (page "Insurance Quick Quote").
3. Click the **Send compliance documents** link in the page header. A modal dialog opens.
4. Wait. The modal stays on "Loading..."; the Client name and Client email fields never appear, so nothing can be typed or sent.
5. In the same browser, open the form's address directly: `https://v2dev.garantieavantageplus.ca/compliance-documents/send?redirectUrl=/quick-insurance-quote`. The response is HTTP 500 and the page reads "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois."
6. Quote Details entry point: open the details page of any quote of this dealer, for example `https://v2dev.garantieavantageplus.ca/quote/6567/details` (quote #6567, client Rosalie Bouchard AP2502-004, vehicle VIN `1FAHP35NX8W239204`), and click **Send compliance documents**. The modal again stays on "Loading..."; its request `GET /compliance-documents/send?redirectUrl=/quote/6567/details&clientEmail=client.stage.2502004@yopmail.com` answers HTTP 500.
7. Optional — the result does not depend on the dealer's creditor forms. Open `https://v2dev.garantieavantageplus.ca/admin/login` and sign in to the Admin portal (the QA used the same account as in step 1; the page is in French: "Courriel", "Mot de passe", "Se connecter"). Open `https://v2dev.garantieavantageplus.ca/admin/dealer/1380/chubb-insurance`, note the selected creditor forms, then in the creditor form multi-select choose one of these setups and click **Save**, keeping the creditor account number as it is: (a) only `GC960S:S30` "Creditor (Commercial) S30"; (b) the forms noted plus `GC960S:S30`; (c) no form at all. After each Save, repeat steps 2–5. Every setup gives the same HTTP 500. Afterwards, select the forms noted at the start again and click **Save**.

**Expected Result:**
The "Send compliance documents" form opens with the Client name and Client email fields; after the dealer fills them and clicks Send, the page returns with "Compliance documents have been sent." and the client receives the compliance documents — per the acceptance criteria, a separately filled document for each product family the dealer is assigned (GC960 for a 960-form dealer, the existing parlons-assurance-(EN/FR).pdf for a GC6201 dealer).

**Actual Result:**
The send form never loads. `GET /compliance-documents/send?redirectUrl=...` answers **HTTP 500** every time:
- creditor forms as found (`GC6201MQ:PM30`, `GC6201MQ:PM50`, `AVPG:TGGAP`) — Insurance Quick Quote: 500 (modal, then two direct loads);
- `GC960S:S30` only — Insurance Quick Quote: 500 (direct load, then modal); Quote Details of quote 6567: 500 (modal, then direct load);
- `GC6201MQ:PM30`, `GC6201MQ:PM50`, `GC960S:S30`, `AVPG:TGGAP` — Insurance Quick Quote: 500 (modal, then direct load);
- no creditor form — Insurance Quick Quote: 500 (modal, then direct load).

The modal stays on "Loading..."; loaded directly, the address shows the French technical-difficulties error page. No email reached any test inbox (`client.stage.2502005@yopmail.com` was checked and is empty). Every other page used in the run (both logins, `/admin/dealer/1380/chubb-insurance`, `/quick-insurance-quote`, `/vehicle/915/details`, `/quote/new/client`, `/quote/6567/details`, `/insurance-compliance-log`) answered normally, so Dev was not down.

Because no document was sent, the AP-2502 content checks — the product line, the GC960 footers and the English GC960 file — are **untested**: the GC960 change is unproven, not disproven.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_002-step2-SendFormHttp500_fail.png` — the send form's address loaded directly with the dealer's unchanged GC6201 forms: the French technical-difficulties error page |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_001-step2-SendModalStuckLoading_fail.png` — Insurance Quick Quote with only `GC960S:S30` assigned: the send modal stuck on "Loading..." |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_003-step2-SendModalStuckLoading_fail.png` — Insurance Quick Quote with GC6201 and GC960 forms assigned: the send modal stuck on "Loading..." |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_004-step3-QuoteSendModalStuckLoading_fail.png` — Quote Details of quote #6567: the send modal stuck on "Loading..." |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_005-step2-SendModalStuckLoading_fail.png` — Insurance Quick Quote with no creditor form assigned: the send modal stuck on "Loading..." |
| Network lines | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_001-step2-SendFormHttp500_fail.txt`, `AP2502_002-step2-SendFormHttp500_fail.txt`, `AP2502_003-step2-SendFormHttp500_fail.txt`, `AP2502_004-step3-QuoteSendFormHttp500_fail.txt`, `AP2502_005-step2-SendFormHttp500_fail.txt` — method, address and status (500) of every attempt, with the creditor-form setup and time |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for developer investigation. The cause is not visible from the UI. The failure is on the request that builds the send form, before any client data is entered. Whether it comes from the AP-2502 change is not known: the change was merged and moved to QC on 2026-11-02, and dealer 1380's compliance log on Dev (`/insurance-compliance-log`) shows its most recent successful send on Oct 2, 2026, so the last time the send worked on Dev is not known more precisely.

**Notes:**
- **Regression:** AP2502_002 is the regression case for the existing GC6201 send. With dealer 1380's unchanged GC6201 forms, the send can no longer be opened at all.
- **Related, not a duplicate:** AP-2452 — "A client name of 256 characters or more makes the compliance send return HTTP 500". AP-2452 is a 500 on **Send** with a client name of 256 characters or more, on Staging; this bug is the form itself never loading, on Dev, for any input.
- Seen on Dev only; Staging was not checked.
- Re-test: once fixed, QA re-runs AP2502_001–005 with "AP-2502 --from s4", which also checks the GC960 / GC6201 document content for the first time.

---

## Defect Distribution

_One serious defect explains all five failures; it stops the compliance send entirely, so the AP-2502 document changes themselves could not be checked._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 1 | AP2502_001, AP2502_002, AP2502_003, AP2502_004, AP2502_005 |
| High | 0 | — |
| Medium | 0 | — |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — A dealer assigned to a 960 form sends a separately filled GC960 document | 1 | BUG-001 (content untested) |
| REQ-002 — A dealer assigned to a GC6201 form keeps the existing parlons-assurance document | 1 | BUG-001 (regression: the existing send fails) |
| REQ-003 — A dealer assigned to both families receives one document per family | 1 | BUG-001 (content untested) |
| REQ-004 — The English GC960 document is the English file supplied in the ticket | 1 | BUG-001 (content untested) |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill (stage s7 of stlc-ticket-pipeline, Gate D)
**Date:** 2026-11-03T05:14Z (UTC)

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2542 | Filed in s5 (new, Gate C by reviewer R3: rule C3 via reviewer rule E2), priority Highest, assigned to Ken Nguyen, linked Relates → AP-2502 and AP-2452 | Backlog | 2026-11-03T05:11Z |
| — (story) | AP-2502 | Story result comment 19463 posted (FAIL, 0/5, Environment: Dev; table of all 5 cases; AP-2542; all 9 open questions with Q-001 and Q-008 observations; records left on Dev) and read back (1 table, 6 rows, 1 mention); status not changed — pass rate 0% (needs 90%) and AP-2542 (Critical) is a stopping bug. AP-2542 is not in the QA status, so §3.2 gives no bug action | QC (unchanged) | 2026-11-03T05:14Z |
