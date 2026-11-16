# Bug Report

**Project:** Avantage Plus v2 — Dealer portal, AP-2477: Simplify /quote/new/edit-vehicle to minimal fields with VIN decoder pre-fill
**Report ID:** BR-20261107-001 (supersedes BR-20261101-001; BUG-001 and BUG-002 are kept below, BUG-003 is new)
**Test Cycle:** AP-2477 single-ticket STLC run, run folder 5.2.0. First pass on v2staging on 2026-10-12 (12 BLOCKED — build missing). Second pass on Dev (v2dev) on 2026-11-01: 9 PASS, 1 FAIL, 2 BLOCKED. **Third pass — re-test after the AP-2507 fix — on Dev (v2dev) on 2026-11-07, 09:47–09:58 UTC: 11 PASS, 1 FAIL, 0 BLOCKED.**
**Date:** 2026-11-07
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2477_2026-11-07.md (current) · execution-log_AP-2477_2026-11-01.md · execution-log_AP-2477_2026-10-12.md · qa-artifacts/3-test-cases/AP2477_TestCases_*.md

**Environment: Dev (v2dev)** for the 2026-11-01 and 2026-11-07 results. BUG-001 was found on staging on 2026-10-12.

| Metric | Value |
|---|:---:|
| Total defects | 3 |
| Critical | 0 |
| High | 2 |
| Medium | 1 |
| Low | 0 |
| Tracker tickets created | 3 (AP-2492 on 2026-10-12, AP-2507 on 2026-11-01, AP-2552 on 2026-11-07) |

**Decisions:**
- 2026-10-12 (by the QA): all 12 cases were BLOCKED on staging because the AP-2477 form was not deployed there. The QA asked for the deployment gap to be filed as a bug (BUG-001, AP-2492).
- 2026-11-01 (Gate C, by the reviewer — R3 APPROVE): the one FAIL, AP2477_007, is filed as a **new** bug (BUG-002, AP-2507) and linked to AP-2492 as *relates to*. Rule C3 → reviewer rule E2.
- **2026-11-07 (Gate C, by the reviewer — R3 round 1 APPROVE, 0 blocker / 0 major / 3 minor):** the one FAIL, AP2477_008, is filed as a **new** bug (BUG-003, **AP-2552**), linked *relates to* AP-2507 and AP-2477. Rule C3 → reviewer rule E2. AP-2507 names the same screen but a different wrong behaviour (there, "Décoder" saved a quote; here, the decoded engine size unit is not persisted when the dealer saves), so it is not a duplicate. No capture sentence or non-developer comment says storing "Litre" is intended, so rule C1 (not a bug) does not hold and correct-cases was skipped. The reviewer's duplicate search ("engine size unit", "engine size", "kW", "Litre", "vehicle unit", "decoded values not saved", "Décoder", "decoder", "VIN decode", "hidden inputs", "edit-vehicle") found only AP-2507 and AP-2492 on this screen.
- 2026-11-07: AP2477_007 (the AP-2507 scenario) **passed** — the decode re-renders the form and saves nothing. This run makes **no change to AP-2507**: it is in QC and its own bug re-test (AP2507_001–003, later today) owns its verdict. AP-2492 was not re-tested (Dev only) and stays as filed.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2477_001 (blocked AP2477_001–012 on staging) | The simplified new-quote vehicle form is missing on staging: /quote/new/edit-vehicle returns HTTP 404 | High | P1 | [AP-2492](https://garantieavantageplus.atlassian.net/browse/AP-2492) | Open (Backlog) |
| BUG-002 | AP2477_007 (blocked AP2477_008, AP2477_009 on 2026-11-01) | Clicking "Décoder" on the new-quote vehicle form saves a quote and empties the form instead of re-rendering it pre-filled | High | P1 | [AP-2507](https://garantieavantageplus.atlassian.net/browse/AP-2507) | Open (QC — fix not reproduced 2026-11-07; awaiting its own re-test) |
| BUG-003 | AP2477_008 | Saving a quote after "Décoder" stores the decoded engine size unit "kW" as "Litre" on the vehicle | Medium | P2 | [AP-2552](https://garantieavantageplus.atlassian.net/browse/AP-2552) | Open (Backlog) |

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
| **Status** | Open (QC since 2026-11-03 — fix not reproduced on 2026-11-07; its own re-test owns the verdict) |
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
- **2026-11-07 re-test:** AP2477_007 passed on Dev at 09:47–09:58 UTC — "Décoder" posts by AJAX (200, no redirect), re-renders the form with Ford / Focus / 2008 and saves nothing (quotes 6588–6592 are all accounted for by deliberate saves). AP2477_008 and AP2477_009 ran; 008 found BUG-003. No change was made to AP-2507 by this run.

---

### BUG-003 — Saving a quote after "Décoder" stores the decoded engine size unit "kW" as "Litre" on the vehicle

| Field | Value |
|---|---|
| **Bug ID** | BUG-003 |
| **Test Case** | AP2477_008 (FAIL at step 4 of 4, the verification step; it blocks no other case) |
| **Requirement** | AP-2477 REQ-003 — decoded values are kept and stored on the vehicle row when the quote is saved (acceptance criterion 2) |
| **Severity** | Medium — the decode-and-save flow works and four of the five compared values are stored, but one decoded attribute, the engine size unit, is stored wrong without the dealer seeing it. The dealer can correct it on the vehicle's edit form, so there is a workaround; nothing is lost and no screen breaks. (The test plan's exit criteria describe a High bug as one where "quotes are saved with wrong vehicle data"; this is one hidden attribute out of five, so it was rated Medium under the bug-reporter's definitions — R4 may weigh this.) |
| **Priority** | P2 — fix in the current cycle; it breaks the wording of acceptance criterion 2 but does not block the release of the rest of the story on its own |
| **Environment** | Dev (v2dev) `https://v2dev.garantieavantageplus.ca/` · Dealer portal, dealer ID 1380 ("Test QA staging") · Chromium (Playwright) · Windows 11 · footer "Avantage Plus System v2.0.0" |
| **Tracker Ticket** | [AP-2552](https://garantieavantageplus.atlassian.net/browse/AP-2552) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2507 and Relates → AP-2477; description written in wiki markup through REST v2; the `_fail` screenshot embedded (read back: 2 media nodes with ids) and the DecodedVsStoredValues .txt attached |
| **Status** | Open (Backlog) |
| **First found** | 2026-11-07 |
| **Reproducibility** | 1 of 1 save after a decode checked at this level of detail; the same VIN decoded to "kW" in all three decodes of the run |

**Summary:**
On Dev (v2dev), when a dealer clicks "Décoder" on the "Create a quote" vehicle form and then saves the quote, the vehicle is stored with engine size unit "Litre", although the decoder filled the form with engine size unit "kW".

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login` and sign in with a dealer account (the QA used dealer ID 1380, "Test QA staging").
2. Open `https://v2dev.garantieavantageplus.ca/quotes` and click **Create a quote**. The browser goes to `/quote` and is redirected to `/quote/new/edit-vehicle`, heading "Create a quote", Vehicle type "Passenger".
3. Leave **Brand** on "Choose". Type `1FAHP35NX8W239204` in **VIN** and click **Décoder**. Wait for the form to re-render with Brand Ford, Model Focus, Year 2008.
4. In the browser developer tools, read the form's hidden inputs: `quote_vehicle[engineSizeUnit]` = "kW", `quote_vehicle[engineSize]` = "2", `quote_vehicle[cylinders]` = "4", `quote_vehicle[fuelType]` = "GASOLINE", `quote_vehicle[transmission]` = "automatic".
5. Type `QA-AP2477-008-095303` in **Quote name** and click **Save**. The quote details page opens (`/quote/6591/details`, banner "Vehicle saved", Ford Focus 2008).
6. From the quote's vehicle card, open the vehicle's edit page (`/vehicle/1146/edit`, heading "Vehicle #1146"). Do not save it. Read **Engine size unit**, **Engine size** and **Cylinders**.

**Expected Result:**
The saved vehicle holds the decoded engine size unit "kW", like the other decoded values. Acceptance criterion 2 says the decoded values "are kept and assigned to the App\Entity\Vehicle attributes — Brand, Model and Year, plus the decoded transmission, engine size, engine size unit, cylinders, fuel type and turbo — so they are stored on the vehicle row when the quote is saved, even though those extra fields are no longer displayed."

**Actual Result:**
Vehicle 1146 shows **Engine size unit = "Litre"** (option `l` carries `selected`), while the form submitted "kW". Value by value: **Cylinders 4 and Engine size 2 were carried over from the decode.** **Fuel type GASOLINE and Transmission Automatic** match the decode, but a vehicle saved from the same form without a decode (vehicle 1144, AP2477_004) shows the same two values, so this run cannot tell them apart from the form's defaults. **The engine size unit is the one value that differs** ("kW" submitted, "Litre" stored). Turbo / 4x4 / AWD are unticked, and the form carries no hidden input for them, so there is nothing to compare. Either the save drops the decoded unit and falls back to the default "l", or the decoder returns the wrong unit ("kW") for this gasoline 2.0 engine — the developer must say which. For an electric vehicle, a decoded kW figure would be stored as litres.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_008-step4-Vehicle1146EngineUnitLitreNotKW-20261107_fail.png` — vehicle 1146 edit form (not saved): Engine size 2, unit Litre, Cylinders 4, Price and Kilometers empty. Embedded in AP-2552's description |
| Text evidence | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_008-step1-4-DecodedVsStoredValues-20261107_fail.txt` — hidden values read before saving (kW) next to the stored values, plus request lines (method, URL, status only). Attached to AP-2552 |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for dev investigation. Two leads: the save path does not map `quote_vehicle[engineSizeUnit]` onto the new vehicle (falling back to the entity default "l"), or the decoder maps VinAudit's engine data to "kW" for a combustion engine.

**Notes:**
- **Risk observation (no verdict):** after "Décoder", hidden `quote_vehicle[id]` holds **863**, an existing inventory vehicle of dealer 1380 with the same VIN (Ford Focus 2008, price 20000.00, 20000 km). Saving still created a new vehicle (1146) and vehicle 863 was unchanged when re-read at 09:57 UTC. No criterion says whether an existing vehicle should be reused; noted because a form carrying another vehicle's id could update that vehicle if the save path changes. Stated in AP-2552 too.
- Related to AP-2507 (same screen, different behaviour: there the decode saved a quote; on this build it does not). AP2477_007, the AP-2507 scenario, passed on 2026-11-07.
- Test data left on Dev: quote 6591 "QA-AP2477-008-095303" with vehicle 1146. Vehicle 863 was only read.

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 2 | AP2477_001–012 on staging (BUG-001); AP2477_007, 008, 009 on dev on 2026-11-01 (BUG-002 — not reproduced on 2026-11-07) |
| Medium | 1 | AP2477_008 on dev on 2026-11-07 (BUG-003) |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 to REQ-007 — whole feature on staging | 1 | BUG-001 |
| REQ-003 — Decode pre-fills and keeps hidden details | 2 | BUG-002, BUG-003 |
| REQ-007 — Quote name kept across decode | 1 | BUG-002 (2026-11-01 only; passed 2026-11-07) |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** 2026-11-01 (pipeline s7, Gate D — `apply_mode: automatic`); 2026-11-07 (pipeline s5, Gate C filing — `apply_mode: automatic`); 2026-11-07 (pipeline s7, Gate D by reviewer R4 — `apply_mode: automatic`)

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2492 | No action — in Backlog, not in the QA status, so Gate D §3.2 does not apply | Backlog (unchanged) | 2026-11-01 |
| BUG-002 | AP-2507 | Created, assigned to Ken Nguyen, linked Relates → AP-2492 and AP-2477, 2 screenshots embedded | Backlog (new) | 2026-11-01 |
| — | AP-2477 (story) | Story result comment 19441 posted and read back (12 test-case rows); not moved — pass rate 75% (needs 90%), AP-2507 blocks AP2477_008–009 | QC (unchanged), assignee unchanged | 2026-11-01 |
| BUG-003 | AP-2552 | Created (Gate C 2026-11-07, by reviewer), priority Medium, labels qa-agent / stlc-automated, assigned to Ken Nguyen, linked Relates → AP-2507 and AP-2477; description via REST v2 wiki markup; `_fail` screenshot embedded and .txt attached; read back 10:08 UTC | Backlog (new) | 2026-11-07 |
| BUG-002 | AP-2507 | No action by this run — in QC, but its own bug re-test (AP2507_001–003) owns its verdict (orchestrator instruction) | QC (unchanged) | 2026-11-07 |
| BUG-001 | AP-2492 | No action — not re-tested (Dev only), Backlog | Backlog (unchanged) | 2026-11-07 |
| — | AP-2477 (story) | Story result comment 19511 posted via REST v2 wiki markup (11/12 = 91.7%; AP2477_008 → AP-2552) and read back via v3 (h3 heading, 2 bullet lists, issue links render); not moved — AP-2507 and AP-2492 (High) still open (Gate D rule D §3.1, by reviewer R4). No §3.2 action on AP-2492, AP-2507 or AP-2552 | QC (unchanged), assignee Vinh Le - QC (unchanged) | 2026-11-07 |
