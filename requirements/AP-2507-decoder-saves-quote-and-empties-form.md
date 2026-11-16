# AP-2507 — [BUG-002][AP2477_007] — Clicking "Décoder" on the new-quote vehicle form saves a quote and empties the form instead of re-rendering it pre-filled

**Spec ID:** AP-2507
**Source:** Jira [AP-2507](https://garantieavantageplus.atlassian.net/browse/AP-2507) — Project *Avantage Plus (AP)*, type Bug, priority High, status **QC**
**Reporter:** Vinh Le - QC · **Assignee:** Vinh Le - QC
**Created:** 2026-11-01 · **Last updated:** 2026-11-03
**Captured on:** 2026-11-07 by stlc-ticket-pipeline from the description, 1 comment and 2 attachments.
**Parent:** None
**Labels:** qa-agent, stlc-automated · **Sprint:** none · **Fix version:** none
**Linked issues:** Relates to AP-2492 (Bug, High, Backlog — "[BUG-001][AP2477_001] — The simplified new-quote vehicle form is missing on staging") · Relates to AP-2477 (Story, Medium, QC — "Simplify /quote/new/edit-vehicle to minimal fields with VIN decoder pre-…")

> Faithful transcription of AP-2507 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket. This is a Bug filed by the QA from the AP-2477 run of 2026-11-01
(BUG-002 in `qa-artifacts/5-testing-report/AP-2477_bug-report.md`, failing test case
AP2477_007). Its steps to reproduce and expected result are the requirement for the re-test.

## Original requirement text

> **Tested on: Dev (v2dev)** — https://v2dev.garantieavantageplus.ca/ · Dealer portal · Dealer ID 1380 ("Test QA staging") · Chromium (Playwright) · Windows 11 · footer "Avantage Plus System v2.0.0"
>
> | Field | Value |
> |---|---|
> | Test case | AP2477_007 (FAIL at steps 2 and 3); also blocks AP2477_008 and AP2477_009 |
> | Requirement | AP-2477 REQ-003 — decoding a VIN pre-fills Brand, Model and Year and keeps the hidden details for saving |
> | Severity | High — the VIN decoder, the fastest way for a dealer to fill a vehicle correctly, does not work: one click creates a quote the dealer did not ask for, without a name, and dealers cannot delete quotes |
> | Priority | P1 — blocks the AP-2477 release; two other test cases cannot run until it is fixed |
> | First found | 2026-11-01 |
> | Reproducibility | Seen on the one click made (1 of 1). The click was deliberately not retried, because every attempt would create another quote that cannot be deleted |
>
> ### Summary
>
> On Dev (v2dev), clicking "Décoder" next to the VIN on the "Create a quote" vehicle form saves a new quote straight away and leaves the form card empty, instead of re-rendering the form with Brand, Model and Year filled in for the dealer to review and save.
>
> ### Steps to reproduce
>
> 1. Open https://v2dev.garantieavantageplus.ca/login and sign in with a dealer account (the QA used dealer ID 1380, "Test QA staging").
> 2. Open https://v2dev.garantieavantageplus.ca/quotes and click **Create a quote**. The browser goes to /quote and is redirected to /quote/new/edit-vehicle, heading "Create a quote", vehicle type button "Passenger".
> 3. Leave **Quote name** empty and leave **Brand** on "Choose". Type 1FAHP35NX8W239204 in **VIN**.
> 4. Click **Décoder** next to the VIN field.
> 5. Look at the form, then open https://v2dev.garantieavantageplus.ca/quotes and read the newest row.
>
> ### Expected result
>
> After step 4 the form is re-rendered in place, pre-filled, and nothing is saved yet. The acceptance criterion says: "The VIN lookup runs, the form is re-rendered pre-filled with the decoded vehicle values". VIN still holds 1FAHP35NX8W239204, Brand shows Ford, Model Focus and Year 2008, and the form still shows only Quote name, VIN, Brand, Model and Year. The ticket's Tech approach adds that the decoder's novalidate short-circuit "is required by assets/js/vinlookup.js so the AJAX returns the re-rendered form instead of redirecting". A quote is created only when the dealer clicks **Save**. In step 5 the newest row is still the one that was there before.
>
> ### Actual result
>
> Clicking **Décoder** sends an AJAX POST /quote/new/edit-vehicle. The page's VIN-lookup script sends the whole quote_vehicle form plus quote_vehicle[novalidate]=true. The server answers **302 → /quote/6437/details**, and that page returns 200. The form card then becomes empty: only the heading "Create a quote" and the "Passenger" button remain, with no fields and no message. A quote has been saved: **#6437 "1FAHP35NX8W239204"**, banner "Vehicle saved", vehicle Ford Focus 2008 (vehicle 1067), no quote name and no client. It is the newest row on /quotes, and vehicle 1067 also appears at the top of the dealer's **Vehicle Inventory**. The decoder itself works, because it returned Ford / Focus / 2008. But the dealer never sees the decoded values on the form, cannot add a quote name first, and cannot press Save themselves.
>
> ### Suggested root cause
>
> Unknown — for dev investigation. A likely lead is that the novalidate short-circuit in VehicleType::configureOptions does not take effect on this form. The ticket describes the flag as vehicle[novalidate], but this form is named quote_vehicle, so the request sends quote_vehicle[novalidate]. Once the decoder fills Brand, Model and Year in PRE_SUBMIT, the minimal validation group passes, and EditVehicle saves the quote and redirects.
>
> ### Notes
>
> - Related to AP-2492, which covers the same screen but a different defect: on staging the route /quote/new/edit-vehicle returns HTTP 404. This bug is about dev, where the form exists and "Décoder" saves the quote.
> - Test cases AP2477_008 (decoded extras kept after the dealer's own Save) and AP2477_009 (Quote name kept across a decode) cannot run until this is fixed.
> - **Observation for the AP2477_008 re-run (no verdict):** on /quote/new/edit-vehicle only quote_vehicle[transmission] and quote_vehicle[engineSizeUnit] are rendered as hidden inputs. Fuel type, cylinders, engine size and turbo are not on the page, although the Tech approach ("Keep the hidden children working") asks for those children to stay as hidden inputs. Vehicle 1067, saved by this decode, does hold fuel GASOLINE, Automatic, 4 cylinders, 2 L and turbo off, so the server merged them on this save path.
> - Test data left on Dev by this click: quote 6437 and vehicle 1067. Dealers cannot delete quotes.
>
> ### Evidence
>
> The page right after clicking "Décoder": only the heading and the "Passenger" button remain — the form card is empty. [attachment]
>
> Quote #6437, saved by the single "Décoder" click, with the "Vehicle saved" banner and Ford Focus 2008. [attachment]
>
> Source record: qa-artifacts/5-testing-report/AP-2477_bug-report.md (BUG-002) in the QA repository.

## Acceptance criteria (verbatim)

None as a separate field — this is a Bug. The **Expected result** section above is the
pass condition for the re-test; it quotes AP-2477's acceptance criterion: "The VIN lookup
runs, the form is re-rendered pre-filled with the decoded vehicle values".

## Attachments

| File | Read? |
|---|---|
| AP2477_007-step2-FormGoneAfterDecode_fail.png | No — listed only (same file is on disk: `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/`) |
| AP2477_007-step3-DecodeSavedQuote6437_fail.png | No — listed only (same file is on disk: `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/`) |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-11-03 | Minh Lưu | Says AP-2507 is already fixed by AP-2533: vinlookup.js hardcoded `vehicle[novalidate]` while the form is `quote_vehicle`; AP-2533 now posts `formName + "[novalidate]"` (plus quote_name and the token), so Décoder re-renders the form pre-filled (Ford / Focus / 2008) and nothing is saved until Save |

> **Re-test context (added by the QA pipeline, 2026-11-07).** The fix is delivered by
> AP-2533 ("Update quote form UI", Story, status QC on 2026-11-07), not by a change on
> AP-2507 itself. The ticket does not say whether AP-2533 is deployed to Dev; the re-test
> design must check the build on Dev rather than assume it. Per the orchestrator's
> hand-off, Ken Nguyen assigned AP-2507 to the QA on 2026-11-03. The related bug AP-2492
> (staging 404 on /quote/new/edit-vehicle) is still Backlog; execution is on Dev, where the
> route exists. Original failing case: AP2477_007 in
> `qa-artifacts/3-test-cases/AP2477_TestCases_006-010.md`; it also blocked AP2477_008 and
> AP2477_009 — natural regression neighbours. Every "Décoder" click on a broken build
> creates a quote dealers cannot delete; quote 6437 and vehicle 1067 are AP-2477's
> left-behind records and must not be reused.
