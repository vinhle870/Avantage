# Bug Report

**Project:** Avantage Plus v2 — Dealer portal, AP-2477: Simplify /quote/new/edit-vehicle to minimal fields with VIN decoder pre-fill
**Report ID:** BR-20261101-001 (supersedes BR-20261012-001, whose BUG-001 is kept below unchanged)
**Test Cycle:** AP-2477 single-ticket STLC run, run folder 5.2.0. First pass on v2staging on 2026-10-12 (12 BLOCKED — build missing). Second pass on **Dev (v2dev)** on 2026-11-01, by the user's decision: 9 PASS, 1 FAIL, 2 BLOCKED.
**Date:** 2026-11-01
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2477_2026-11-01.md · qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2477_2026-10-12.md · qa-artifacts/3-test-cases/AP2477_TestCases_*.md

**Tested on: Dev (v2dev)** for the 2026-11-01 results. BUG-001 was found on staging on 2026-10-12.

| Metric | Value |
|---|:---:|
| Total defects | 2 |
| Critical | 0 |
| High | 2 |
| Medium | 0 |
| Low | 0 |
| Tracker tickets created | 2 (AP-2492 on 2026-10-12, AP-2507 on 2026-11-01) |

**Decisions:**
- 2026-10-12 (by the QA): all 12 cases were BLOCKED on staging because the AP-2477 form was not deployed there. The QA asked for the deployment gap to be filed as a bug (BUG-001, AP-2492).
- 2026-11-01 (Gate C, by the reviewer — R3 APPROVE): the one FAIL, AP2477_007, is filed as a **new** bug (BUG-002) and linked to AP-2492 as *relates to*. Rule C3 → reviewer rule E2. AP-2492 names the same screen but a different wrong behaviour (the route returns HTTP 404 on staging), so it is not a duplicate. No capture sentence or comment says that decoding should save the quote, so rule C1 (not a bug) does not hold. Duplicate search for open bugs ("Décoder", "decode saves quote", "edit-vehicle", "VIN decode saves", "vinlookup") returned only AP-2492 and AP-2490 (client province list, unrelated).
- AP2477_008 and AP2477_009 are BLOCKED by AP2477_007 and are not filed separately.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2477_001 (blocked AP2477_001–012 on staging) | The simplified new-quote vehicle form is missing on staging: /quote/new/edit-vehicle returns HTTP 404 | High | P1 | [AP-2492](https://garantieavantageplus.atlassian.net/browse/AP-2492) | Open |
| BUG-002 | AP2477_007 (blocks AP2477_008, AP2477_009) | Clicking "Décoder" on the new-quote vehicle form saves a quote and empties the form instead of re-rendering it pre-filled | High | P1 | [AP-2507](https://garantieavantageplus.atlassian.net/browse/AP-2507) | Open |

---

## Bug Details

---

### BUG-001 — The simplified new-quote vehicle form is missing on staging: /quote/new/edit-vehicle returns HTTP 404

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2477_001 (BLOCKED at step 2); the same cause blocks AP2477_002–012 |
| **Requirement** | AP-2477 REQ-001 to REQ-007 — the whole feature is absent |
| **Severity** | High — the story cannot be QA'd or released, and the Playwright new-quote tests, which expect the vehicle-first flow, fail on staging |
| **Priority** | P1 — blocks the AP-2477 release |
| **Environment** | Chromium (Playwright) · Windows 11 · Staging (v2staging), Dealer portal, Dealer ID 1380 · app version not exposed |
| **Tracker Ticket** | [AP-2492](https://garantieavantageplus.atlassian.net/browse/AP-2492) — Bug, priority High, labels qa-agent / stlc-automated, assigned to Minh Lưu (reassigned from Ken Nguyen at the QA's request), linked Relates → AP-2477; 2 screenshots embedded in the description (verified) |
| **Status** | Open |
| **First found** | 2026-10-12 |
| **Reproducibility** | Always: 2 of 2 for the route and 2 of 2 for "Create a quote" |

**Summary:**
Jira shows AP-2477 as merged and deployed to Staging on 2026-10-06, but on 2026-10-12 v2staging has none of it. `/quote/new/edit-vehicle` returns HTTP 404, and "Create a quote" still opens the old client-first form.

**Steps to Reproduce:**

1. Sign in to the Dealer portal at `https://v2staging.garantieavantageplus.ca/login` with the shared dealer account.
2. Open `/quotes` and click **Create a quote**. Note the page that opens.
3. Open `https://v2staging.garantieavantageplus.ca/quote/new/edit-vehicle` directly.

**Expected Result:**
Step 2 opens "Créer une cotation" at `/quote/new/edit-vehicle`, showing only Quote name, NIV (with **Décoder**), Marque, Modèle and Année. Step 3 opens the same form.

**Actual Result:**
Step 2 opens the old client-first form at `/quote/new/client` (Client section, Email*, Tel work*, Save). Step 3 returns HTTP 404, "Désolé, la page recherchée est introuvable". The existing quote vehicle step `/quote/6431/vehicle` still shows "Prix".

**Evidence:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-EditVehicleRoute404_fail.png`
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-CreateQuoteOpensClientForm_fail.png`
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-QuoteVehicleStepStillHasPrix_fail.png` (not attached to the ticket)

**Suggested fix:** redeploy the merged AP-2477 change to v2staging, and check why the 2026-10-06 staging deployment no longer contains it.

**Notes (2026-11-01):** On 2026-10-28 Ken Nguyen commented on AP-2477 that the feature "is now on v2dev.garantieavantageplus.ca" and that "the feature is not ready for staging yet". AP-2492 is still in Backlog. Whether it should stay open is for the team to decide; this run did not change it.

---

### BUG-002 — Clicking "Décoder" on the new-quote vehicle form saves a quote and empties the form instead of re-rendering it pre-filled

| Field | Value |
|---|---|
| **Bug ID** | BUG-002 |
| **Test Case** | AP2477_007 (FAIL at steps 2 and 3); it also blocks AP2477_008 and AP2477_009 |
| **Requirement** | AP-2477 REQ-003 — decoding a VIN pre-fills Brand, Model and Year and keeps the hidden details for saving (acceptance criterion on the VIN decoder) |
| **Severity** | High — the VIN decoder, the fastest way for a dealer to fill a vehicle correctly, does not work: one click creates a quote the dealer did not ask for, without a name, and dealers cannot delete quotes |
| **Priority** | P1 — blocks the AP-2477 release; two other test cases cannot run until it is fixed |
| **Environment** | Chromium (Playwright) · Windows 11 · **Dev (v2dev)** `https://v2dev.garantieavantageplus.ca/`, Dealer portal, Dealer ID 1380 ("Test QA staging") · footer "Avantage Plus System v2.0.0" |
| **Tracker Ticket** | [AP-2507](https://garantieavantageplus.atlassian.net/browse/AP-2507) — Bug, priority High, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2492 and Relates → AP-2477; 2 screenshots embedded in the description (verified: 2 media nodes with ids) |
| **Status** | Open |
| **First found** | 2026-11-01 |
| **Reproducibility** | Seen on the one click made (1 of 1). The click was deliberately not retried, because every attempt would create another quote that cannot be deleted |

**Summary:**
On Dev (v2dev), clicking "Décoder" next to the VIN on the "Create a quote" vehicle form saves a new quote straight away and leaves the form card empty, instead of re-rendering the form with Brand, Model and Year filled in for the dealer to review and save.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login` and sign in with a dealer account (the QA used dealer ID 1380, "Test QA staging").
2. Open `https://v2dev.garantieavantageplus.ca/quotes` and click **Create a quote**. The browser goes to `/quote` and is redirected to `/quote/new/edit-vehicle`, heading "Create a quote", vehicle type button "Passenger".
3. Leave **Quote name** empty and leave **Brand** on "Choose". Type `1FAHP35NX8W239204` in **VIN**.
4. Click **Décoder** next to the VIN field.
5. Look at the form, then open `https://v2dev.garantieavantageplus.ca/quotes` and read the newest row.

**Expected Result:**
After step 4 the form is re-rendered in place, pre-filled, and nothing is saved yet. The acceptance criterion says: "The VIN lookup runs, the form is re-rendered pre-filled with the decoded vehicle values". VIN still holds `1FAHP35NX8W239204`, Brand shows Ford, Model Focus and Year 2008, and the form still shows only Quote name, VIN, Brand, Model and Year. The ticket's Tech approach adds that the decoder's `novalidate` short-circuit "is required by assets/js/vinlookup.js so the AJAX returns the re-rendered form instead of redirecting". A quote is created only when the dealer clicks **Save**. In step 5 the newest row is still the one that was there before.

**Actual Result:**
Clicking **Décoder** sends an AJAX `POST /quote/new/edit-vehicle`. The page's VIN-lookup script sends the whole `quote_vehicle` form plus `quote_vehicle[novalidate]=true`. The server answers **302 → `/quote/6437/details`**, and that page returns 200. The form card then becomes empty: only the heading "Create a quote" and the "Passenger" button remain, with no fields and no message. A quote has been saved: **#6437 "1FAHP35NX8W239204"**, banner "Vehicle saved", vehicle Ford Focus 2008 (vehicle 1067), no quote name and no client. It is the newest row on `/quotes`, and vehicle 1067 also appears at the top of the dealer's **Vehicle Inventory**. The decoder itself works, because it returned Ford / Focus / 2008. But the dealer never sees the decoded values on the form, cannot add a quote name first, and cannot press Save themselves.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_007-step2-FormGoneAfterDecode_fail.png` — the page right after "Décoder": heading and type button only, the form card is empty |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_007-step3-DecodeSavedQuote6437_fail.png` — quote #6437 that the decode saved, with "Vehicle saved" and Ford Focus 2008 |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for dev investigation. A likely lead is that the `novalidate` short-circuit in `VehicleType::configureOptions` does not take effect on this form. The ticket describes the flag as `vehicle[novalidate]`, but this form is named `quote_vehicle`, so the request sends `quote_vehicle[novalidate]`. Once the decoder fills Brand, Model and Year in `PRE_SUBMIT`, the minimal validation group passes, and `EditVehicle` saves the quote and redirects.

**Notes:**
- Related to AP-2492, which covers the same screen but a different defect: on staging the route `/quote/new/edit-vehicle` returns HTTP 404. This bug is about dev, where the form exists and "Décoder" saves the quote.
- Test cases AP2477_008 (decoded extras kept after the dealer's own Save) and AP2477_009 (Quote name kept across a decode) cannot run until this is fixed.
- **Observation for the AP2477_008 re-run (no verdict):** on `/quote/new/edit-vehicle` only `quote_vehicle[transmission]` and `quote_vehicle[engineSizeUnit]` are rendered as hidden inputs. Fuel type, cylinders, engine size and turbo are not on the page, although the Tech approach ("Keep the hidden children working") asks for those children to stay as hidden inputs. Vehicle 1067, saved by this decode, does hold fuel GASOLINE, Automatic, 4 cylinders, 2 L and turbo off, so the server merged them on this save path.
- Test data left on Dev by this click: quote 6437 and vehicle 1067. Dealers cannot delete quotes.

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 2 | AP2477_001–012 on staging (BUG-001); AP2477_007, 008, 009 on dev (BUG-002) |
| Medium | 0 | — |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 to REQ-007 — whole feature on staging | 1 | BUG-001 |
| REQ-003 — Decode pre-fills and keeps hidden details | 1 | BUG-002 |
| REQ-007 — Quote name kept across decode (blocked) | 1 | BUG-002 |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** 2026-11-01 (pipeline s7, Gate D — `apply_mode: automatic`)

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2492 | No action — in Backlog, not in the QA status, so Gate D §3.2 does not apply | Backlog (unchanged) | 2026-11-01 |
| BUG-002 | AP-2507 | Created, assigned to Ken Nguyen, linked Relates → AP-2492 and AP-2477, 2 screenshots embedded | Backlog (new) | 2026-11-01 |
| — | AP-2477 (story) | Story result comment 19441 posted and read back (12 test-case rows); not moved — pass rate 75% (needs 90%), AP-2507 blocks AP2477_008–009 | QC (unchanged), assignee unchanged | 2026-11-01 |
