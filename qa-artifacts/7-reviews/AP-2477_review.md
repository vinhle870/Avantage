# QA Review — AP-2477

## R3 — Execution results — round 1 — 2026-11-01T15:01:00Z
Reviewed: qa-artifacts/.pipeline/AP-2477.md, requirements/AP-2477-simplify-quote-new-edit-vehicle-minimal-fields.md, qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2477_2026-11-01.md, qa-artifacts/3-test-cases/AP2477_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2477_TestCases_006-010.md, qa-artifacts/3-test-cases/AP2477_TestCases_011-012.md, qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/ (20 files)
Verdict: **APPROVE** · Gate C: AP2477_007 — File new, linked to AP-2492 as *relates to* — rule C3 → reviewer rule E2
Findings: 0 blocker · 0 major · 2 minor

Reviewed inline (this run is itself a worker subagent), from the files on disk under the fresh-eyes rule. The dev execution log now has a result for all twelve cases — 9 PASS, 1 FAIL, 2 BLOCKED, 0 Not Run, pass rate 75% (9 of 12) — and the counts match the per-case rows. Every PASS step states the observed value (quote and vehicle ids, field values, server messages, list rows), every screenshot path exists, and the inspected images show what the log claims. The one FAIL (AP2477_007) is a product fault, not an environment fault: the decoder answered, and the page saved quote 6437 instead of re-rendering the form, which the capture's Tech approach says the AJAX must do ("so the AJAX returns the re-rendered form instead of redirecting"). The results can be trusted for s5.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | execution-log_AP-2477_2026-11-01.md — AP2477_004 step 3 | The PASS on Condition and Designation rests on reading the HTML (`selected` attribute) and the details page, because the full edit form displays "new" and "Particular" for empty values; the reasoning is stated and the details page confirms Designation is blank, but no screenshot shows the missing `selected` attribute | None required for this gate. Keep the observation in the report so the developer sees that the edit form would store these defaults on its next save |
| F-2 | Minor | execution-log_AP-2477_2026-11-01.md — AP2477_008 | The BLOCKED case reuses the AP2477_007 screenshot as its evidence | None required — the case never ran; the reason and the blocking case are named |

Checklist R3: 3.1 pass (12 of 12 have a result) · 3.2 pass (9/1/2/0, 75%) · 3.3 pass · 3.4 pass (20 of 20 screenshot paths exist) · 3.5 pass (8 images inspected, below) · 3.6 pass (AP2477_007 steps 2 and 3 name the difference) · 3.7 pass (no login, timeout or 5xx before a step under test) · 3.8 pass (AP2477_008, AP2477_009 name the AP2477_007 failure) · 3.9 pass (decision below quotes its evidence).

Gate C evidence for AP2477_007 (actual: "Décoder" saved quote #6437 and the form disappeared, instead of re-rendering pre-filled):
- C1 does not hold — no capture sentence or non-developer comment says that decoding saves the quote. The capture says the opposite: the decoder "re-posts it to the form action with vehicle[novalidate] = true, and replaces the form with the HTML response", and the validation short-circuit "is required by assets/js/vinlookup.js so the AJAX returns the re-rendered form instead of redirecting".
- Duplicate search (`tracker.search_tickets`, open bugs in AP): "Décoder" → AP-2492; "VIN decoder quote" → none; "edit-vehicle" → AP-2492, AP-2490; "decode saves quote" → none; "VIN lookup" → none.
- C2 does not hold — AP-2492 names the same screen (`/quote/new/edit-vehicle`) but a different wrong behaviour: "The simplified new-quote vehicle form is missing on staging: /quote/new/edit-vehicle returns HTTP 404". AP-2490 is a different screen (client province list).
- C3 holds (same screen, behaviour differs) → stop point E2 → reviewer rule E2: **File new**, linked to AP-2492 as *relates to*, with a description line naming AP-2492 and the difference (deployment 404 on staging vs. decode auto-saves on dev).
- AP2477_008 and AP2477_009 are BLOCKED by this failure and are not filed separately.
- No C1 decision → s4c is skipped.

Screenshots inspected:
- `AP2477_007-step2-FormGoneAfterDecode_fail.png` — matches (heading and "Passenger" only, empty form card)
- `AP2477_007-step3-DecodeSavedQuote6437_fail.png` — matches ("Vehicle saved", #6437 - 1FAHP35NX8W239204, Ford Focus 2008)
- `AP2477_001-step3-FiveFieldsOnly_pass.png` — matches (Quote name, VIN + Décoder, Brand*, Model*, Year*, Save)
- `AP2477_003-step3-Quote6438DetailsToyotaCorolla_pass.png` — matches (#6438, Toyota Corolla 2020, Vehicle saved)
- `AP2477_003-step3-QuotesListNewest6438_pass.png` — matches (Toyota Corolla 2020 above Ford Focus 2008)
- `AP2477_004-step3-VehicleEdit1069PriceKmEmpty_pass.png` — matches (Vehicle #1069, Vehicle Price and Kilometers empty; Condition shows "new", Designation "Particular" as explained in F-1)
- `AP2477_006-step2-YearBlankRefused_pass.png` — matches (error at Year, Toyota / Corolla kept)
- `AP2477_012-step4-WarrantyModalAsksKmFuel_pass.png` — matches (Kilometers empty, Fuel type "Choose", "There are no eligible program for the vehicle")

## R3 — Execution results — round 1 — 2026-11-01T15:08:00Z
Reviewed: qa-artifacts/.pipeline/AP-2477.md, requirements/AP-2477-simplify-quote-new-edit-vehicle-minimal-fields.md, qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2477_2026-11-01.md, qa-artifacts/3-test-cases/AP2477_TestCases_006-010.md, qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/ (20 log paths checked, 6 images inspected), qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/base-test/navigation-map.md, qa-artifacts/qa-config/knowledge.md, .claude/skills/stlc-ticket-pipeline/routing.md §3 Gate C; live re-check on v2dev (read-only, "Décoder" not clicked); Jira duplicate search re-run
Verdict: **APPROVE** · Gate C: AP2477_007 — File new, linked to AP-2492 as *relates to* — rule C3 → reviewer rule E2
Findings: 0 blocker · 0 major · 5 minor

Independent review (the earlier R3 section above was the worker's own inline review). The dev log can be trusted: all twelve cases have a result, the counts recount to 9 PASS / 1 FAIL / 2 BLOCKED / 0 Not Run (75%), every screenshot path exists, and the six images inspected show what the log claims. AP2477_007 is a genuine FAIL against the second acceptance criterion ("the form is re-rendered pre-filled with the decoded vehicle values"): the decoder answered (Ford / Focus / 2008 on quote 6437), so this is not the "decoder not available" BLOCKED case of the Execution Context, and the page saved quote #6437 and emptied the form card instead of re-rendering it. AP2477_008 (decoded extras kept after the dealer's own Save) and AP2477_009 (quote name kept across a re-render) both need the decode to re-render without saving, so they are correctly BLOCKED by AP2477_007, and not running them avoided creating more unwanted quotes. The domain write-back keeps every staging fact (the 404 section, the HTTP 500 entry-point table) and adds dev as a separate, dated subsection; its dev facts are accurate, with the minor gaps below.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | execution-log_AP-2477_2026-11-01.md — AP2477_007 step 2, and *Environment Observations* bullet 5 | The log says the decode request body was "empty quote name, the VIN, `vehicle[novalidate]=true`", but no request record was kept, and the live dev bundle's VIN-lookup handler serializes the **whole** form and appends `{form name}[novalidate]`; the form's name is `quote_vehicle`, so the key sent is `quote_vehicle[novalidate]` and Brand, Model, Year and the hidden inputs travel too. The FAIL itself is unaffected | When s5 writes the bug, describe the request as "the whole `quote_vehicle` form plus `quote_vehicle[novalidate]=true`" (or drop the body detail) rather than copying `vehicle[novalidate]` from the log |
| F-2 | Minor | qa-artifacts/qa-docs/quote-creation.md:103-105 | "every click creates a quote" generalises from a single click that was deliberately not retried | Reword to "the one click made on 2026-11-01 (AP2477_007) saved quote 6437; treat every click as creating a quote" |
| F-3 | Minor | qa-artifacts/qa-docs/quote-creation.md:3, 14, 21, 36 | The header still reads "Mapped … Staging" with no mention of the 2026-11-01 dev extension, and the Routes diagram and the line "`/quote` redirects to `/quote/new/client`" are unqualified although dev now redirects to `/quote/new/edit-vehicle`. The staging facts are correct and kept; only the environment label is missing | Add "extended 2026-11-01 (Dev, AP-2477)" to the header and label the Routes diagram and line 21 "on staging (as of 2026-10-12) — on dev see *On Dev (v2dev)* below" |
| F-4 | Minor | qa-artifacts/base-test/navigation-map.md:55; qa-artifacts/qa-docs/ | The navigation index row for quote creation still says the AP-2477 form is "not deployed (HTTP 404) as of 2026-10-12"; the inventory add form `/vehicle/new/edit/{TYPE}` (AP2477_011), `/vehicle` → 404, and the fact that a quote vehicle saved from this form appears in Vehicle Inventory (vehicle 1067) are not written back anywhere | Update the index row's summary and date to cover the dev mapping, and add the inventory add-form facts to a domain file (knowledge-sources.md §4) |
| F-5 | Minor | qa-artifacts/.pipeline/AP-2477.md — *Warnings* | The warning "domain qa-docs/quote-creation.md is stale for dev … (not yet written back)" is out of date — the dev subsection now exists | Remove or update the warning at the next run-state write |

Checklist R3: 3.1 pass (12 of 12) · 3.2 pass (recounted 9/1/2/0; 9 ÷ 12 = 75%) · 3.3 pass (every PASS step states observed values: quote and vehicle ids, labels, messages, list rows) · 3.4 pass (20 of 20 paths exist) · 3.5 pass (6 images below) · 3.6 pass (AP2477_007 steps 2 and 3 state the difference: saved and redirected vs. re-rendered pre-filled) · 3.7 pass (login, decoder and server all answered; the 302 to a saved quote is product behaviour, not an outage) · 3.8 pass (AP2477_008 and AP2477_009 name the AP2477_007 failure) · 3.9 pass (Gate C evidence quoted).

Live re-check on v2dev (read-only, no data changed, tab closed): `/quote/new/edit-vehicle` holds a form named `quote_vehicle` with `quote_vehicle[quote_name]`, `quote_vehicle[VIN]` (class `vinlookup`), selects `#vehicle_make` / `#vehicle_model` (required), `#vehicle_year` (required), and hidden `transmission`, `engineSizeUnit`, `id`, `_token`, matching the log and the domain doc. The VIN-lookup handler posts the serialized form to the form action and replaces the form with `form[name="quote_vehicle"]` taken from the response; a response that is the quote details page has no such form, which explains the empty card in `AP2477_007-step2-FormGoneAfterDecode_fail.png`. Note for the AP2477_008 re-run: only `transmission` and `engineSizeUnit` are rendered hidden; fuel type, cylinders, engine size and turbo are not on the page, although tech item 3 asks for those children to stay as hidden inputs.

Gate C evidence for AP2477_007 (re-run by this reviewer):
- C1 does not hold: the capture states the opposite of the actual result, "the form is re-rendered pre-filled with the decoded vehicle values" (AC 2) and the `novalidate` short-circuit "is required … so the AJAX returns the re-rendered form instead of redirecting" (Tech approach 5).
- `tracker.search_tickets` (open bugs, AP): "Décoder" → AP-2492; "decoder quote" → none; "edit-vehicle" → AP-2492, AP-2490; "VIN decode saves" → none; "vinlookup" → none.
- C2 does not hold: AP-2492 reads "The simplified new-quote vehicle form is missing on staging: /quote/new/edit-vehicle returns HTTP 404" (same screen, different behaviour). AP-2490 is the client province list.
- C3 holds → E2 → reviewer rule: **File new**, *relates to* AP-2492, with a description line naming AP-2492 and the difference. No C1 decision, so s4c stays skipped. s5 must still file this bug; the current bug report holds only AP-2492.

Screenshots inspected:
- `AP2477_007-step2-FormGoneAfterDecode_fail.png` — matches (heading "Create a quote", "Passenger", empty form card)
- `AP2477_007-step3-DecodeSavedQuote6437_fail.png` — matches ("Vehicle saved", "#6437 - 1FAHP35NX8W239204", Ford Focus 2008, no client)
- `AP2477_001-step3-FiveFieldsOnly_pass.png` — matches (Quote name, VIN + Décoder, Brand*, Model*, Year*, Save; nothing else)
- `AP2477_003-step3-QuotesListNewest6438_pass.png` — matches (Toyota Corolla 2020 row above Ford Focus 2008)
- `AP2477_004-step3-VehicleDetails1069Blank_pass.png` — matches (Toyota Corolla 2020, "Mileage: km", "Designation:" blank)
- `AP2477_012-step4-WarrantyModalAsksKmFuel_pass.png` — matches (empty Kilometers*, Fuel type "Choose", "There are no eligible program for the vehicle")

## R4 — Outcome plan (Gate D) — round 1 — 2026-11-01T15:12:00Z
Reviewed: qa-artifacts/.pipeline/AP-2477.md, requirements/AP-2477-simplify-quote-new-edit-vehicle-minimal-fields.md, qa-artifacts/5-testing-report/AP-2477_test-report.md, qa-artifacts/5-testing-report/AP-2477_bug-report.md, qa-artifacts/1-requirements-analysis/AP-2477_requirements-analysis.md, qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2477_2026-11-01.md, qa-artifacts/qa-config/tools.md §2 *QA outcome rules*; tracker reads of AP-2477 (QC, Vinh Le - QC), AP-2492 (Backlog) and AP-2507 (Backlog)
Verdict: **APPROVE** · Gate D: AP-2477 — post the story result comment, leave status QC and assignee unchanged; no bug-ticket action — rule D (§3.1, §3.2)
Findings: 0 blocker · 0 major · 1 minor

Reviewed inline (this run is itself a worker subagent), from the files on disk under the fresh-eyes rule. The pass rate recomputes to 9 ÷ (12 − 0 SKIPPED) = 75%, matching the test report, and it is below `story_pass_threshold` 90%. The one FAIL (AP2477_007) is filed as AP-2507. AP-2507 is a stopping bug on both counts: it made AP2477_008 and AP2477_009 BLOCKED, and its severity is High. AP-2492 is also open and High. So the story must not move, and the plan says so. Neither bug ticket is in the tracker's QA status (both are in Backlog), so §3.2 gives them no action. The planned comment lists all twelve test cases with their status and bug.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP-2477_requirements-analysis.md — Open Questions | The table has no Impact column, so the "no open Blocking question" check of §3.1 cannot be evaluated. It does not change the outcome, because the pass-rate and stopping-bug checks already fail | Classify Q-001–Q-006 (Blocking / Judgement / Info) at the next `--from s1` run; the comment lists them as unclassified |

Checklist R4: 4.1 pass (75% recomputed) · 4.2 pass (AP2477_007 → AP-2507) · 4.3 pass (AP-2507 blocks 008–009 and is High; AP-2492 High) · 4.4 pass (no move: pass rate 75% < 90% and stopping bugs open) · 4.5 pass (12 rows planned) · 4.6 pass (no re-assignment planned).

## R5 — Automation specs — round 1 — 2026-11-01T15:27:00Z
Reviewed: qa-artifacts/6-automation/AP-2477_automation-report.md, playwright-automation/src/tests/dealer/minimalQuoteVehicleForm_AP2477.spec.ts, playwright-automation/src/flows/QuoteVehicleFormFlow.ts, playwright-automation/src/pages/dealerPortal/DealerQuoteVehicleFormPage.ts, playwright-automation/src/pages/dealerPortal/DealerQuoteRecordPage.ts, playwright-automation/src/pages/dealerPortal/VehicleAddFormPage.ts, qa-artifacts/3-test-cases/AP2477_TestCases_*.md, the 2026-11-01 execution log, `git status` of playwright-automation/
Verdict: **APPROVE** · Gate —
Findings: 0 blocker · 0 major · 2 minor

Reviewed inline (this run is itself a worker subagent), from the files on disk under the fresh-eyes rule. The spec automates exactly the nine cases whose final manual status is PASS. Every `[Verification]` step has an assertion in the flow, and no test clicks "Décoder". Only new files were added: none of the QA's modified or untracked files changed, and the new page objects are imported by path instead of through the QA's `index.ts`. Credentials come from `getCredentials`. The suite skips itself unless the dealer portal URL is v2dev, so it cannot run against staging, where the feature is absent.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | Check 5.1 | The suite was not run with `--repeat-each=2`, because each repeat leaves 3 more undeletable quotes on dev. The equivalent evidence is that, after the last code change, AP2477_003, 004 and 012 passed in two consecutive runs (round 2 and the final run). The six non-creating tests passed in run 1 and in the final run, and the change does not touch their code | None for this gate. Run `--repeat-each=2` only if the QA accepts 6 more quotes |
| F-2 | Minor | QuoteVehicleFormFlow.saveAndVerifyQuoteCreated / verifyNoQuoteCreated | AP2477_003 compares the newest /quotes row with the baseline. If another session creates a quote on the shared dealer account at the same moment, it would fail on a false negative | None — the project runs one worker per account (`playwright.config.ts`) |

Run: `npm run lint` — pass; `npx playwright test --project=chromium --grep @AP-2477` — 9 passed, 0 failed, 0 fixme, no flaky tests across the two runs after the fix.

Traceability:
| TC ID | Step | Expected result | Assertion |
|---|---|---|---|
| AP2477_001 | 3 | Exactly Quote name, VIN, Brand, Model, Year, then Save; no removed field | QuoteVehicleFormFlow.verifyOnlyFiveFieldsInOrder() — expect(labels).toEqual(5), expect(controls).toEqual(5), btnSave toHaveText('Save'), price/km toHaveCount(0) |
| AP2477_002 | 2 | Only Brand*, Model*, Year* starred and required | verifyOnlyBrandModelYearRequired() — required labels toEqual, required controls toEqual, quote name / VIN not required |
| AP2477_003 | 2–3 | Saved, `/quote/{id}/details`, Toyota Corolla 2020, newest row | saveAndVerifyQuoteCreated() — toHaveURL, banner "Vehicle saved", heading, vehicle text; verifyNewestQuote() — newest id = new id > baseline |
| AP2477_004 | 3 | Km, condition, designation, price blank; quote shows the name | saveAndVerifyQuoteCreated() heading with name; verifyVehicleStoredEmpty() — "Mileage: km", "Designation:" blank, price '' , km '', no selected condition |
| AP2477_005 | 2–3 | Refused at Brand and Model; no new quote | saveAndVerifyRefused() — error text at both, 2 errors only, URL unchanged, name kept; verifyNoQuoteCreated() |
| AP2477_006 | 2–3 | Refused at Year; Brand/Model kept; no new quote | saveAndVerifyRefused() — error at Year only, Brand/Model titles kept; verifyNoQuoteCreated() |
| AP2477_010 | 3, 5 | Décoder on Passenger with `vinlookup`; none on RV CLASS A, five fields | verifyDecoderShownForPassenger(); chooseVehicleType() URL + label; verifyNoDecoderAndFiveFields() |
| AP2477_011 | 2–4 | Full field set; refused at Price and Kilometers; no new vehicle | verifyInventoryFormKeepsPriceAndKilometers(); saveInventoryFormAndVerifyRefused(); verifyNoInventoryVehicleAdded() |
| AP2477_012 | 2, 4 | Details load twice without error; warranty step asks for Kilometers / Fuel type | verifyQuoteDetailsLoad() (two passes); openWarrantyStepAndVerifyItAsksForMissingValues() — HTTP 200, km empty and required, fuel "Choose", "Update vehicle" visible, no-program message |

Checklist R5: 5.1 pass (see F-1) · 5.2 pass · 5.3 pass · 5.4 pass (no waitForTimeout, no test.only; routes are relative, the v2dev check reads config) · 5.5 pass (no expect or test.step in the three page objects) · 5.6 pass (no existing file changed) · 5.7 pass (`Date.now()` names and VIN) · 5.8 n/a (no fixme) · 5.9 pass (every new locator has a count in the report).
