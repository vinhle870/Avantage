# Bug Report

**Project:** AP (Avantage)
**Report ID:** BR-20261108-001
**Test Cycle:** AP-2506 — "Generate contract for a quote's Esthetic protection product" — run folder no-sprint
**Date:** 2026-11-08
**Reported by:** QA Agent — Bug Reporter Skill (stlc-worker, QA batch)
**Source:** qa-artifacts/3-test-cases/AP2506_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2506_TestCases_006-009.md — Execution Log qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2506_2026-11-08.md
**Environment:** Dev (v2dev, https://v2dev.garantieavantageplus.ca)

| Metric | Value |
|---|:---:|
| Total defects | 3 (2 new, 1 already filed) |
| Critical | 0 |
| High | 2 (BUG-002 new; AP-2512 existing) |
| Medium | 1 (BUG-001 new) |
| Low | 0 |
| Tracker tickets created | 2 — AP-2555 (BUG-001), AP-2556 (BUG-002); 1 comment on existing AP-2512 |

Three of the nine test cases failed on Dev on 2026-11-08. The new Esthetic protection
contract page names two of its sections differently from acceptance criterion 2 (BUG-001),
and it shows the vehicle's inventory price instead of the price the dealer entered on the
quote (BUG-002). The contract PDF download still returns a server error, which is already
reported as AP-2512, so a comment was added there instead of a new bug.

**Gate C decision (applied by reviewer):** decided by the independent qa-reviewer (R3
round 1, APPROVE, 2026-11-08T03:33:28Z). AP2506_003 → file new, rule C4, linked *relates
to* AP-2506 and AP-2553. AP2506_005 → file new, rule C4, linked *relates to* AP-2506.
AP2506_006 → comment on existing AP-2512, rule C2, and link AP-2512 *relates to* AP-2506.
No failure was ruled "not a bug" (no C1), so correct-cases was skipped.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2506_003 (steps 3, 4) | The Esthetic protection contract page shows "Owner identification" and "Product Summary" instead of "Owner information" and "Program Summary" | Medium | P3 | [AP-2555](https://garantieavantageplus.atlassian.net/browse/AP-2555) | Open (Backlog) |
| BUG-002 | AP2506_005 (step 3) | The Esthetic protection contract page shows the vehicle's inventory price (CA$10,000.00) instead of the quote's vehicle price (CA$25,000.00) | High | P2 | [AP-2556](https://garantieavantageplus.atlassian.net/browse/AP-2556) | Open (Backlog) |
| — (existing) | AP2506_006 (step 5) | The contract PDF download (`/quote/6693/permaplate-contract-download`) returns HTTP 500 | High (existing) | — | [AP-2512](https://garantieavantageplus.atlassian.net/browse/AP-2512) — existing, commented | Open (Backlog) |

---

## Bug Details

---

### BUG-001 — The Esthetic protection contract page shows "Owner identification" and "Product Summary" instead of "Owner information" and "Program Summary"

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2506_003 (steps 3 and 4) |
| **Requirement** | REQ-002 — two-column layout with named sections (AC 2) |
| **Severity** | Medium — the page works and the contract can be generated, but two section headings are not the ones the acceptance criterion names, so the page cannot be accepted as written until the author confirms which headings are meant |
| **Priority** | P3 |
| **Environment** | Dev (v2dev) · Chromium (Playwright) · 1280 × 800 · English (`?_locale=en`) · dealer portal, dealer 1380 |
| **Tracker Ticket** | [AP-2555](https://garantieavantageplus.atlassian.net/browse/AP-2555) — Medium, assigned to Minh Lưu, relates to AP-2506 and AP-2553 |
| **Status** | Open |
| **First found** | 2026-11-08 |
| **Reproducibility** | Always (seen on quote 6692 by AP2506_001, _003, _004 and _005; the same headings on quotes 6693–6695) |

**Summary:**
On the Esthetic protection contract page (`/quote/{quoteId}/permaplate-create-contract`), the owner section in the left column is headed "Owner identification" and the summary section in the right column is headed "Product Summary", while acceptance criterion 2 of AP-2506 names them "Owner information" and "Program Summary".

**Steps to Reproduce:**

1. Open https://v2dev.garantieavantageplus.ca/login?_locale=en and sign in with the shared dealer account (dealer 1380).
2. Open `/vehicle/915/details` (Ford Focus 2008, VIN 1FAHP35NX8W239204), click **Create quote** and fill the client form: First name `Esthetic`, Last name `Owner2506-001`, Email any unused address, Address `200 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550301`, Work phone `5145550302`; tick "I agree to the policy" and click **Save**.
3. Open `/quote/{quoteId}/vehicle`, keep the vehicle, set **Delivered at** to today and **Price** `25000`, and click **Save**.
4. Open `/quote/{quoteId}/permaplate`, click the product **10 ans**, tick **Antirouille – Rust+Sound (combo)** and click **Save**.
5. On `/quote/{quoteId}/details`, in the **Esthetic protection** row, click **⋯** and choose **Generate Contract**.
6. Read the section headings in the left and right columns of the page that opens.

**Expected Result:**
The left column shows sections headed "Vehicle identification" and "Owner information", and the right column shows a section headed "Program Summary" with the "Generate Contract" button (AC 2: "it shows the “Vehicle identification” and “Owner information” in a left column, and “Program Summary” and a submit button in a right column").

**Actual Result:**
The left column shows "Vehicle identification" and "Owner identification"; the right column shows "Product Summary" and the "Generate Contract" button. No section on the page is headed "Owner information" or "Program Summary". The column placement itself is correct.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot (embedded in AP-2555, attachment 14293, verified) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_003-step4-RightColumnProductSummary_fail.png` — the full page: "Owner identification" on the left, "Product Summary" and the button on the right |
| Screenshot (context) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_003-step3-LeftColumnOwnerIdentification_fail.png` — the left column headings |
| Network lines | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_003-step3-4-network_fail.txt` — GET quote page 200, GET contract page 200, headings read |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for dev investigation. The page was redesigned on 2026-11-07 and now uses the same headings as the roadside contract page (AP-2553), which suggests a shared layout; whether those headings are intended is not stated anywhere.

**Notes:**
The roadside contract page shows the same two headings (AP-2553, Medium, Backlog). Question for the ticket author: are the redesigned headings "Owner identification" and "Product Summary" intended? If so, AC 2 should be updated and this bug closed; if not, both pages need the AC 2 headings.

---

### BUG-002 — The Esthetic protection contract page shows the vehicle's inventory price (CA$10,000.00) instead of the quote's vehicle price (CA$25,000.00)

| Field | Value |
|---|---|
| **Bug ID** | BUG-002 |
| **Test Case** | AP2506_005 (step 3) |
| **Requirement** | REQ-004 — vehicle and owner values pre-filled from the quote (AC 3) |
| **Severity** | High — the contract page shows a vehicle price different from the one the dealer agreed on the quote, the field cannot be corrected on the page, and a contract built from it would carry the wrong price |
| **Priority** | P2 |
| **Environment** | Dev (v2dev) · Chromium (Playwright) · 1280 × 800 · English (`?_locale=en`) · dealer portal, dealer 1380 |
| **Tracker Ticket** | [AP-2556](https://garantieavantageplus.atlassian.net/browse/AP-2556) — High, assigned to Minh Lưu, relates to AP-2506 |
| **Status** | Open |
| **First found** | 2026-11-08 |
| **Reproducibility** | Always (quote 6692; the summary line shows CA$10,000.00 on every quote built from vehicle 915) |

**Summary:**
On the Esthetic protection contract page (`/quote/{quoteId}/permaplate-create-contract`), the "Vehicle identification" section shows "Vehicle Price 10000.00" and a summary line ending "CA$10,000.00" — the vehicle's inventory price — while the quote's vehicle step was saved with Price 25000 and the quote page shows CA$25,000.00.

**Steps to Reproduce:**

1. Open https://v2dev.garantieavantageplus.ca/login?_locale=en and sign in with the shared dealer account (dealer 1380).
2. Open `/vehicle/915/details` (Ford Focus 2008, VIN 1FAHP35NX8W239204, inventory price 10,000), click **Create quote** and fill the client form: First name `Esthetic`, Last name `Owner2506-001`, Email any unused address, Address `200 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550301`, Work phone `5145550302`; tick "I agree to the policy" and click **Save**.
3. Open `/quote/{quoteId}/vehicle`, keep the vehicle, set **Delivered at** to today and **Price** `25000`, and click **Save**. The quote page's vehicle row now shows CA$25,000.00.
4. Open `/quote/{quoteId}/permaplate`, click the product **10 ans**, tick **Antirouille – Rust+Sound (combo)** and click **Save**.
5. On `/quote/{quoteId}/details`, in the **Esthetic protection** row, click **⋯** and choose **Generate Contract**.
6. In the "Vehicle identification" section, read the summary line, click **Vehicle details** and read **Vehicle Price**.

**Expected Result:**
The vehicle price on the contract page is the quote's vehicle price, 25,000 (AC 3: "vehicle and owner values are pre-filled" from the quote), as the quote page shows it.

**Actual Result:**
The summary line reads "Ford · Focus · 2008 · 1FAHP35NX8W239204 · CA$10,000.00" and "Vehicle Price" reads 10000.00 — the vehicle's inventory price. The field is read-only text, so the dealer cannot correct it. Every other vehicle and owner value (VIN, make, model, year, odometer 5000, delivery date, name, address, phones, email) is pre-filled correctly.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot (embedded in AP-2556, attachment 14294, verified) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_005-step3-VehiclePrice10000Not25000_fail.png` — "Vehicle details" expanded: Vehicle Price 10000.00 and the summary line CA$10,000.00 |
| Network lines (attached to AP-2556, attachment 14295 — R3 F-1) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_005-step3-network_fail.txt` — GET quote page 200, GET contract page 200, and the two price values (quote page CA$25,000.00, contract page 10000.00) |
| Console log | None captured |

The quote-page value (vehicle row CA$25,000.00, subtotal CA$25,080.00 on quote 6692) is recorded in the execution log (AP2506_001 steps 1–2) and in the network file; no screenshot of the quote page was taken in this run (R3 finding F-1). Capture one on the next run that opens quote 6692.

**Suggested Root Cause:**
Unknown — for dev investigation. The page appears to read the price from the vehicle record (inventory) rather than from the quote's vehicle step. The GAP and creditor contract pages pre-fill the quote's vehicle price (`domain`, quote-creation.md).

**Notes:**
Whether the price stored on a created contract is also 10,000 could not be checked: the contract PDF download returns HTTP 500 on Dev (AP-2512).

---

### Existing defect — AP-2512 (AP2506_006 step 5) — not filed again

AP2506_006 created contract **PNA-0000000022** (quote 6693, financing company "AutoCapital
Canada", invoice 946 for $80) on the first submit. Opening its PDF from the **Download**
button on `/permaplate-contracts` opened `/quote/6693/permaplate-contract-download`, which
returned **HTTP 500** and the French technical-error page; typing the address again gave
HTTP 500 again (2 of 2).

AP-2512 (Bug, High, Backlog, assignee Minh Lưu) already says: _"On Dev, the PDF icon on a
quote's "Esthetic protection" row opens /quote/❬quoteId❭/permaplate-contract-download,
which returns HTTP 500 and the technical-error page instead of the Permaplate contract
PDF."_ Same address, same fault — Gate C rule C2. A comment with only the new facts was
added to AP-2512 and the link AP-2512 *relates to* AP-2506 was added. No status or
assignee change on AP-2512.

Evidence: `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_006-step5-PdfDownloadHttp500_fail.png`,
`AP2506_006-step5-ContractRowListed_fail.png`, `AP2506_006-step5-network_fail.txt`.

---

### Observations that are not defects (no bug filed)

- **Financing company has no "*".** The "Financing company" select is required on submit
  (blank → "This value should not be blank.", AP2506_008) and carries the HTML `required`
  attribute, but its label shows no "*". No requirement covers required markers and
  Q-003 / Q-008 are Judgement questions, so this is record-only; it goes in the story
  comment.
- **AP-2516 may be fixed.** AP-2516 says the Esthetic protection row shows "-" and the
  subtotal leaves it out. On quotes 6692–6695 the row showed CA$80.00 and the subtotal
  CA$25,080.00. This run did not follow AP-2516's cancel-and-re-add steps and has no
  screenshot of the subtotal. A short QA note for AP-2516 is prepared for update-ticket
  (`qa-artifacts/4-execution-results/comment_AP-2516_2026-11-08.md`), with no status change.

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 2 | AP2506_005 (BUG-002), AP2506_006 (AP-2512, existing) |
| Medium | 1 | AP2506_003 (BUG-001) |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — dedicated page at the unchanged address | 0 | — |
| REQ-002 — two-column layout with named sections | 1 | BUG-001 |
| REQ-003 — Program Summary content | 0 | — |
| REQ-004 — vehicle and owner pre-filled from the quote | 1 | BUG-002 |
| REQ-005 — submit creates the contract through the current process | 1 | AP-2512 (existing) |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Bug Reporter Skill (file-bugs, through tracker-manage-child-ticket; apply_mode automatic)
**Date:** 2026-11-08

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2555 | Created (Bug, priority Medium, labels qa-agent + stlc-automated); description condensed to the bug description shape (one-sentence summary, environment, 6 steps, Expected, Actual, 2-line Note, caption + screenshot) via REST v2; screenshot attached and embedded (1 of 1 rendered, v3 media id verified); assigned to Minh Lưu (bug_new_assign); linked Relates → AP-2506 and AP-2553; all read back | Backlog | 2026-11-08T03:38Z |
| BUG-002 | AP-2556 | Created (Bug, priority High, labels qa-agent + stlc-automated); description condensed to the bug description shape via REST v2; screenshot attached and embedded (1 of 1 rendered, v3 media id verified); network file attached (R3 F-1); assigned to Minh Lưu (bug_new_assign); linked Relates → AP-2506; all read back | Backlog | 2026-11-08T03:38Z |
| — (existing) | AP-2512 | Comment posted (id 19520, new facts only: quote 6693, PNA-0000000022, Download button on /permaplate-contracts, HTTP 500 2 of 2) — Gate C rule C2; link Relates AP-2512 → AP-2506 added; no status or assignee change; read back | Backlog (unchanged) | 2026-11-08T03:39Z |
| — (observation) | AP-2516 | QA note prepared, **not posted** — for update-ticket after Gate D: `qa-artifacts/4-execution-results/comment_AP-2516_2026-11-08.md`; no status change | Backlog (unchanged) | — |
| — (observation) | AP-2516 | update-ticket (Gate D, R4 round 1, by reviewer): QA note posted via REST v2 (comment id 19522, from `comment_AP-2516_2026-11-08.md`); no status or assignee change; read back | Backlog (unchanged) | 2026-11-08T03:45Z |
| — (story) | AP-2506 | update-ticket (Gate D, R4 round 1, by reviewer): story result comment posted via REST v2 wiki markup (comment id 19521, `comment_AP-2506_2026-11-08.md`) — 9 cases, bugs AP-2556/AP-2512/AP-2555, Q-001 with mention of Nicolas-Eric Tain (v3 mention node verified), Financing company "*" record-only line; no status or assignee change; read back | QA (unchanged) | 2026-11-08T03:45Z |
