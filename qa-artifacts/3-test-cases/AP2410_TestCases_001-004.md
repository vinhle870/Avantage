# Test Cases — AP2410 (File 1 of 1)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2410 — Bug: on the Chubb Insurance Quote page, submitting with every required option filled still shows an error message (re-test)
**Source:** requirements/AP-2410-ap-2405-dealer-portal-chubb-insurance-quote.md (bug re-test flow — s1 and s2 skipped; the bug's steps to reproduce and expected result are the requirement). How a successful submit looks on screen comes from the `domain` source `qa-docs/chubb-insurance.md` §1, §5–§6 (verified on staging 2026-10-02/03) and the `contract-setup` source, Stage A–B (verified 2026-09-04).
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2410_001 to AP2410_004 (4 test cases)
**Coverage:** Re-test (steps to reproduce, rate table PM30) · Re-test (rate table PM50, French) · Regression (Insurance Quick Quote, same Chubb rating call) · Re-test (replay of the exact inputs that produced the reported "Debtor is -1 years old" error)
**Revised:** 2026-11-01T01:51Z — rework after review R2 round 1 (independent reviewer, REWORK): F-1 step 1 of AP2410_001 and AP2410_002 judges only the vehicle and the financing and records the "Add creditors insurance" link; F-2 the two attachments were read and the original error text is named, and step 4 records the full text of any banner; F-3 AP2410_002 step 3 confirms each field changed from the restored PM30 / English values.
**Revised:** 2026-11-01T01:55Z — rework after review R2 round 2 (independent reviewer, REWORK): F-1 step 1 of every quote case records the financing's Term months, Date of birth and co-borrower, and every coverage term on the quote insurance page is "the financing term recorded in step 1" (`contract-setup` Stage B: Life Term must "Match the financing term"); a financing added by this batch uses Term months `12`, the term in the reported screenshot. F-2 new AP2410_004 replays the 2026-03-29 inputs; Q-002 (Judgement) added for a financing without a co-borrower. F-3 AP2410_003 Disability fixed to `30D_RETRO`. File renamed from 001-003 to 001-004.
**Revised:** 2026-11-08T03:05Z — rework after review R2 round 3 (2026-11-08, independent reviewer; AP2410_001, 002 and 004 parked; QA ordered "AP-2410 --from design" for the Dev re-test): F-1 the batch is retargeted from staging to **Dev (v2dev)** — quote 6167 (a staging record with no Dev source) is replaced by a quote that AP2410_001's `[Pre-Condition]` step creates on the Dev "Create a quote" form (`QA-AP2410-001-<HHMMSS>`, VIN `2T1BURHE0NC241001`, Toyota / Corolla / 2022), whose id `{QID}` AP2410_002 and 004 reuse; no source confirms that such a quote (no client) reaches the insurance page on Dev, so **Q-003 (Blocking)** is added and AP2410_001, 002 and 004 are BLOCKED by it at design time. F-2 the financing is added through the "Add a financing" modal and the "No applicant" notice is named as expected. F-3 Form is chosen by option value (`GC6201MQ:PM30` / `GC6201MQ:PM50`) and its label recorded, never failed on the label alone. F-4 the test-data reservations are restated for Dev. AP2410_003 unchanged (executable on Dev now — Gate B, R2 round 3).
**Revised:** 2026-11-08T03:13Z — rework after review R2 round 1 of the new design cycle (2026-11-08T03:10:02Z, independent reviewer, REWORK 0/2/1), applied as worded: F-1 the quote is created through the sourced Dev client route `/vehicle/915/details` → "Create quote" → `/quote/new/client?fromVehicleId=915` (client `Retest Chubb2410-001`, `client.stage.2410001@yopmail.com`; vehicle 915 used read-only, no new vehicle) instead of the vehicle-first "Create a quote" form; Q-003 Answered (reviewer, stop rule E4); AP2410_001, 002 and 004 Not Run, Blocked by —; Known blockers, Summary Table and Coverage Matrix updated. F-2 steps 2 and 5 of AP2410_001, 002 and 004 restated for Dev (Financing block + Creditors Insurance Quote form; premium on the Creditors insurance row; Coverage table read on the reopened insurance page); step 4 unchanged. F-3 *Form option* row notes the Dev label 'Monthly Premium PM30' (AP2499_007). AP2410_003 unchanged.
**Revised:** 2026-11-08T03:45Z — rework after review R3 round 1 (2026-11-08T03:43:39Z, independent reviewer, REWORK 0/2/3; `qa-artifacts/7-reviews/AP-2410_review.md`), s3 part only, applied as worded: F-1 AP2410_004 step 1 adds a co-applicant (`Coapp Retest2410`, DOB `1988-04-10`) through the "Add co-applicant" modal (`quote-creation.md` lines 746–750, Dev block AP-2504), so Q-002 no longer applies; step 3 uses Life Decreasing / 12 / Borrower (Residual Value Coverage is not offered on Dev — recorded), Critical illness Decreasing / 12 / **Co borrower**, Disability 30D_RETRO / 12 / **Both**, with a BLOCKED rule if Co borrower or Both is still not offered; steps 4–5 use the co-borrower branch; the borrower-only run of 2026-11-08 is kept as the Q-002 record; Test Data and Leaves behind name the co-applicant; AP2410_004 Status Not Run (s4 re-run is a separate dispatch). F-2 / observation O-3 step 5 Action and Expected of AP2410_001, 002 and 004 read the Coverage table in the Creditors insurance row's chevron details on `/quote/{QID}/details` (this build shows none on the reopened insurance page), then the reopened form's Language and Tax exempt — wording only, AP2410_001 and 002 not re-run.

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/quote/{QID}/insurance` — the Chubb Insurance Quote page named in the bug (on staging it was `/quote/6167/insurance`; heading "Insurance for {client}"), where `{QID}` is the id of the quote AP2410_001 step 1 creates on Dev. Reach it **by URL** (`quote-creation.md`, Dev block AP-2499: opening `/quote/{id}/insurance` as a page shows the same content as the Creditors insurance modal) — the steps never depend on a link or the "+" on the Creditors insurance row, and only record what is shown. AP2410_003 starts at `/quick-insurance-quote` (heading "Creditors Insurance Quick Quote", tab **Creditors insurance**), also reachable from the Dashboard link "Insurance Quick Quote". | `navigation` → `domain` (`chubb-insurance.md` §5, §6) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | **Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca` (`tools.md` `execution_env` = `Dev`; the QA's decision of 2026-11-08 to re-test AP-2410 on Dev) | `env` ("Dev Environment" section) |
| **Login** | Dealer — the dealer account in the "Dev Environment" section of the `env` source (`base-test/execute.env.md`; Dealer ID `1380`). Sign in at `/login`. Do not copy the credential into the execution log. | `env` |
| **Test data** | **A new quote with a client created by AP2410_001 step 1** — no existing Dev quote is used, and staging quote 6167 (the bug's URL) is not used on Dev: no source says what 6167 is there. Create it through the documented Dev client route (`quote-creation.md` Dev blocks AP-2477, AP-2493, AP-2499): `/vehicle/915/details` → **Create quote** → `/quote/new/client?fromVehicleId=915` (a Vehicle card shows the Ford Focus) → fill the client form with Email `client.stage.2410001@yopmail.com`, First name `Retest`, Last name `Chubb2410-001`, Address `100 rue Test`, City `Montréal`, Province "Québec", Postal code `H2X 1Y4`, Home phone `514-555-0410`, Work phone `514-555-0411` (Work phone is required as well as Home phone), tick the policy agreement box → **Save**; saving via `fromVehicleId=915` already attaches the vehicle (Ford Focus 2008, VIN `1FAHP35NX8W239204`). Record its id as **`{QID}`** in the execution log; AP2410_002 and AP2410_004 reuse `{QID}` and never create a second quote. Then the financing is added through the "Add a financing" modal with fixed values (Term months `12`, no co-borrower — see AP2410_001 Test Data), so every case knows the term, date of birth and co-borrower in advance; step 1 of each case still records them as read. Dealer 1380's Dev Chubb configuration (account `AP0001`, `GC6201MQ:PM30`, `GC6201MQ:PM50`, `AVPG:TGGAP` selected — AP-2502 baseline, 2026-11-03) is read only — never change it. **Never write to another ticket's Dev records** (`test-data`, `domain`): quote **6567** (AP-2502), quotes **6588–6602** (AP-2477, AP-2505, AP-2533; 6597 holds roadside contract 2782), creditor contract **AVP000170** on quote **6480** (AP-2494), AVP000169 on 6466 (AP-2493), AVP000171 on 6566 and GAP AVPG000064 on 6564 (AP-2504). Vehicle 915 (shared Dev test vehicle) is used read-only as the `fromVehicleId` source, as AP-2493, AP-2499 and AP-2504 did — never save its Edit vehicle form (it pre-selects the wrong Designation, `test-centralized.md`). Never pick a quote by "newest". | `test-data` (`test-centralized.md` Dev rows), `domain` (`quote-creation.md`, `chubb-insurance.md` Dev blocks), `env` |
| **Form option** | On Dev the dealer Form drop-down labels for Dealer 1380 are not recorded (`chubb-insurance.md` Dev block names only the values). Choose the option whose **value** is `GC6201MQ:PM30` (PM30) or `GC6201MQ:PM50` (PM50) and record its label word for word. Dev label seen 2026-11-02 (AP2499_007): 'Monthly Premium PM30'. "Monthly Premium PM30 / PM50" in the steps are the staging labels — **never fail a step only because the label differs**. Applies to every case, AP2410_003 included. | `domain` (`chubb-insurance.md` Dev block, §6) |
| **Coverage terms** | On the quote insurance page every coverage term (Life, Critical illness, Disability) is **the financing term recorded in step 1** — `contract-setup` Stage B says Life Term must "Match the financing term", so a fixed value could make Chubb refuse the quote for a test-data reason rather than the fix. The financing AP2410_001 step 1 adds uses Term months `12` — the term in the 2026-03-29 screenshot (`12` is in the Dev Term months drop-down, 3–240 in steps of 3) — so AP2410_004 is an exact replay. AP2410_003 has no financing; it uses its own Term months `60` for every coverage. | `contract-setup` Stage B, `domain` §6, `quote-creation.md` Dev block (AP-2499) |
| **Language** | English dealer UI. The quote's insurance **Language** field (English / Français) is test data, not the UI language. | `navigation`, `domain` |
| **Leaves behind** | On Dev, for Dealer 1380: one new quote `{QID}` with client `client.stage.2410001@yopmail.com` on vehicle 915 (no new vehicle), its financing (Term months `12`), the co-applicant **`Coapp Retest2410`** (Date of birth `1988-04-10`, no address) that AP2410_004 step 1 adds to that financing, and a saved Chubb insurance quote. The last one saved stays: after AP2410_002 it is the PM50 / Français quote; if AP2410_004 then saves, it is replaced by the PM30 / English / Tax exempt Yes replay with Life (Borrower), Critical illness (Co borrower) and Disability (Both) coverage; if AP2410_004 is refused or BLOCKED, the quote recorded before its step 4 stays. The co-applicant is not removed. Record `{QID}`, the client email and the co-applicant name in the execution log and the run summary. AP2410_003 shows its result in place; whether the quick quote is stored anywhere is not documented. No Chubb contract is created by this batch. | `cleanup` (missing), `domain` |

**Run order.** AP2410_001 → 002 → 003 → 004. AP2410_001 is the only case that creates the
quote and adds the financing; AP2410_002 and AP2410_004 reuse quote `{QID}` and its financing.
If AP2410_001 step 1 cannot create the quote or the financing, AP2410_002 and AP2410_004 are
BLOCKED with the same reason — never substitute another Dev quote. AP2410_004 runs last because it may leave
the quote's saved insurance with coverage the earlier cases do not use.

**How to spot the error this bug is about.** A Chubb API failure shows as a banner with the
`alert` role whose text starts with "HTTP/2 4xx returned for …" — it does not necessarily
contain the words "error" or "success". Search the page for the `alert` role and for the text
"HTTP", never only for the word "error" (`chubb-insurance.md` §5). The grey sentence "Please
make sure you create the GAP insurance first to include the GAP premium amount in the
creditors insurance." appears on every quote and is not an error.

**The error as originally reported** (read from the ticket's two screenshot attachments on
2026-11-01; both on `/quote/6167/insurance`, page "Insurance for Vinh Le"):

| Attachment | Values submitted (as seen) | Banner text, word for word |
|---|---|---|
| image-20260207-163958.png (description, 2026-02-07) | Rate table RT50 · Language English · Tax exempt No · Life Decreasing, Life Term empty, Life For Co borrower | `HTTP/2 400 returned for "https://creditor-insurance-dev.ken-d1b.workers.dev/quote". - {"success":false,"response":"To sign up for creditor program please contact Unity at 1 (888) 561-1101. \/ Pour s'inscrire au programme de créancier veuillez contacter Unité au 1 (888) 561-1101."} (HTTP 400)` |
| image-20260329-142058.png (comment, 2026-03-29) | Rate table PM30 · Language English · Tax exempt Yes · Life Residual Value Coverage / 12 / Borrower · Critical illness Decreasing / 12 / Co borrower · Disability 30D_RETRO / 12 / Both | `HTTP/2 400 returned for "https://creditor-insurance-dev.ken-d1b.workers.dev/quote". - {"success":false,"response":"Debtor is -1 years old. Age of Debtor is not within the plan limits."} (HTTP 400)` |

The first error came from an RT rate table, which the developer later said is not available
(Q-001); the second, reported after his "please try PM50 or PM30" comment, is the one the fix
must remove — AP2410_004 replays its inputs. In both screenshots the dropdown these cases call
**Form** is labelled **Rate table\*** (the `domain` mapping of 2026-10-03 calls it Form) —
either label is the same field. If a banner appears at step 4, record its **full text** in the
execution log so the bug comment can compare it with these two.

**Calls take time.** "Get Quote" calls Chubb's rating API. Allow at least 10 seconds before
judging the result, and re-read the page rather than trusting a short tool timeout.

**Open questions** — the bug re-test flow has no requirements analysis, so the questions
this batch depends on are listed here:

| # | Question | Impact | Status | Effect on these cases |
|---|---|---|---|---|
| Q-001 | Ken Nguyen's comment (2026-03-23) says "RT is not available right now". Should the **Form** dropdown still offer any RT rate table, and what should happen if one is chosen? The ticket does not say. | Judgement | Open | AP2410_001 step 2 only **records** the options the Form dropdown lists. No result depends on the answer, and no RT option is submitted |
| Q-002 | The reported error came from coverage for the **Co borrower** (Critical illness) and **Both** (Disability). If the quote's financing has **no co-borrower**, should a quote with co-borrower or Both coverage be accepted, or refused — and with what message? The ticket does not say. | Judgement | Open — no longer applies to AP2410_004 (R3 round 1, F-1: step 1 adds a co-applicant) | AP2410_004 step 1 now adds a co-applicant, so Q-002 does not apply and steps 4–5 assert a successful save. The borrower-only run of 2026-11-08 (no co-applicant; Co borrower / Both not offered, every coverage sent for Borrower; saved with the flash, no banner) is kept as the Q-002 record in the execution log |
| Q-003 | On Dev the "Create a quote" form (`/quote/new/edit-vehicle`) makes a quote with a vehicle and **no client** (quotes 6505 and 6602 were left that way). Does such a quote, once its financing is added through the "Add a financing" modal, open `/quote/{id}/insurance` ("Insurance for {client}") and accept a Chubb creditor quote? No source confirms it: every Dev creditor quote recorded so far (AP-2493, AP-2499, AP-2504) was on a quote made with a client. The QA can answer **yes** (then run as written), or name another way to get a Dev quote with a client — e.g. the documented Dev path `/vehicle/{id}/details` → "Create quote" → `/quote/new/client?fromVehicleId={id}` on a vehicle this batch creates, or a Dev quote of Dealer 1380 recorded for AP-2410 in the `test-data` source. | **Blocking** | Answered — reviewer, stop rule E4, 2026-11-08: the cases use the documented Dev route with a client (`quote-creation.md` Dev blocks AP-2477, AP-2493, AP-2499) | None — AP2410_001, 002 and 004 are executable |

**Known blockers:**

| Blocker | Cases | How it clears |
|---|---|---|
| — (none at design time) | — | — |
| Conditional (execution): Co borrower / Both coverage not offered on Dev even with a co-applicant (AP2410_004 step 3) | AP2410_004 | The answer to "Are Co borrower and Both coverages intentionally removed from the dealer creditor-insurance form on Dev?" (posted on AP-2410) |

At execution, if the client form refuses the quote, "Add a financing" stays
disabled or does not save, or `/quote/{QID}/insurance` returns an error page, record AP2410_001, AP2410_002 and AP2410_004 as BLOCKED naming the step and the error (or the known defect, if one is already filed) — never as FAIL, and never substitute another Dev quote.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2410_001 | Getting a Chubb insurance quote with every required option filled and rate table PM30 saves without an error | Re-test | High | PASS |
| AP2410_002 | Getting a Chubb insurance quote in French with rate table PM50 saves without an error | Re-test | High | PASS |
| AP2410_003 | Insurance Quick Quote with rate table PM30 shows priced results without an error | Regression | Medium | PASS |
| AP2410_004 | Replaying the reported inputs (Tax exempt Yes, co-borrower and Both coverage) no longer returns "Debtor is -1 years old" | Re-test | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2410_001 — Getting a Chubb insurance quote with every required option filled and rate table PM30 saves without an error

| Field | Value |
|---|---|
| **TC ID** | AP2410_001 |
| **Title** | Getting a Chubb insurance quote with every required option filled and rate table PM30 saves without an error |
| **Requirement** | AP2410 — Steps to reproduce 1–3 ("Access to 'Chubb Insurance Quote' … /quote/6167/insurance · Select required options · Click 'Get Quote' button") and Expected result: "Submit successfully". Comment, Ken Nguyen 2026-03-23: "please try PM50 or PM30" |
| **Route** | `/vehicle/915/details` → "Create quote" → `/quote/new/client?fromVehicleId=915` → `/quote/{QID}/details` ("Add a financing" modal) → `/quote/{QID}/insurance` |
| **Type** | Re-test |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-08 · Dev (v2dev) · quote 6696 |
| **Result** | Saved without an error on Dev quote 6696 (PM30, CA$15.74 /m); Coverage table read on the details row (O-3) |

**Why this matters:** This is the bug's own reproduction — the steps the reporter took on
quote 6167 (staging), replayed on a quote this case creates on Dev. Before the fix, a dealer who filled every required field still got an error and
could not price creditor insurance for the client, so the sale could not include it.

**Test Data:**

| Variable | Value |
|---|---|
| Client and quote (created in step 1) | Email `client.stage.2410001@yopmail.com` · First name `Retest` · Last name `Chubb2410-001` · Address `100 rue Test` · City `Montréal` · Province "Québec" · Postal code `H2X 1Y4` · Home phone `514-555-0410` · Work phone `514-555-0411` · policy agreement box ticked · vehicle 915 attached by `fromVehicleId` (Ford Focus 2008, VIN `1FAHP35NX8W239204`) → id recorded as `{QID}` |
| Financing (added in step 1) | Date of birth `1985-06-15` · Province "Québec" (pre-selected) · Type "Financing" · Net amount financed including RDPRM `25000` · Residual `0` · Payment frequency "Monthly" · Term months `12` · Interest rate `6.99` · Financing company "AutoCapital Canada" · no co-applicant |
| Language | English |
| Tax exempt | No |
| Form | The option with value `GC6201MQ:PM30` (staging label "Monthly Premium PM30"; record the Dev label) |
| Life / Life Term / Life For | Decreasing / **the financing Term months recorded in step 1** / Borrower |
| Critical illness, Disability | Left unset (optional) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev at `/login` with the dealer account from the `env` source ("Dev Environment" section). Open `/vehicle/915/details` and click **Create quote** (lands on `/quote/new/client?fromVehicleId=915`; a Vehicle card shows the Ford Focus). Fill the client form with the Test Data values (Work phone is required as well as Home phone), tick the policy agreement box → **Save**. Record the quote id from the URL as `{QID}`. Do not open the vehicle step and do not use **Edit vehicle** on 915. On `/quote/{QID}/details` click **Add a financing** (on Dev it opens a **modal** on the details page; wait for the text "Interest rate") and set Date of birth `1985-06-15`, keep Province "Québec", Type "Financing", Net amount financed including RDPRM `25000`, Residual `0`, Payment frequency "Monthly", Term months `12`, Interest rate `6.99`, Financing company "AutoCapital Canada"; add no co-applicant → **Save**. Record the financing's **Term months**, **Date of birth**, **Residual** and **co-borrower** as the page shows them | Save redirects to `/quote/{QID}/details` with heading `#{QID} - Retest Chubb2410-001 1FAHP35NX8W239204`, the vehicle Ford Focus 2008 attached, and the Financing card 'You have not added financing details yet'. After the financing Save the page shows the financing (e.g. "Financing · 12 months · 25,000.00$ · AutoCapital Canada") with the flash "Financing saved"; a **"No applicant"** notice in the Co-applicant block is expected and is **not** an error. Recorded in the execution log: `{QID}`, the client email, Term months `12`, Date of birth `1985-06-15`, Residual `0` and "no co-borrower". Record (only) whether the Creditors insurance row offers a "+" or link — step 2 opens the page by URL |
| 2 | Open `/quote/{QID}/insurance` and open the **Form** dropdown. Record every option it lists — label and value (for Q-001 and the *Form option* row) | `/quote/{QID}/insurance` opens as a page (no error page) with the **Financing** block collapsed to 'Financing · 12 months · 25,000.00$ · AutoCapital Canada' and below it the **Creditors Insurance Quote** form (Language, Tax exempt, Form, Life, Critical illness and Disability blocks, **Get Quote**), with no banner with the `alert` role. Record the page heading as shown. The Form options are recorded word for word in the execution log — record only, for Q-001 |
| 3 | Set Language "English", Tax exempt "No", Form = the option with value `GC6201MQ:PM30` (record its label), Life "Decreasing", Life Term = the Term months recorded in step 1, Life For "Borrower"; leave Critical illness and Disability unset | Each field shows the value just chosen, Form holds the `GC6201MQ:PM30` option (whatever its label), and Life Term equals the financing term recorded in step 1; every field marked as required has a value |
| 4 | Click **Get Quote** and wait at least 10 seconds. If any banner with the `alert` role appears, record its full text word for word | The page redirects to `/quote/{QID}/details` with the flash "Chubb insurance quote saved successfully". No banner with the `alert` role and no text starting "HTTP" appears — in particular not the reported "Debtor is -1 years old. Age of Debtor is not within the plan limits." (see *The error as originally reported*) |
| 5 | [Verification] On `/quote/{QID}/details`, read the Creditors insurance row of Summary of products and open its chevron; then open `/quote/{QID}/insurance` and read the form's Language and Tax exempt fields. | The row shows a monthly premium (`CA$… /m`), not '- None Selected -'. The row's details show Rate table `PM30`, Language English and a Coverage table with a Life row (Decreasing, BORROWER, the term recorded in step 1) with a premium amount. The reopened form reads Language English and Tax exempt No. No banner with the `alert` role and no text starting 'HTTP' anywhere. |

---

### AP2410_002 — Getting a Chubb insurance quote in French with rate table PM50 saves without an error

| Field | Value |
|---|---|
| **TC ID** | AP2410_002 |
| **Title** | Getting a Chubb insurance quote in French with rate table PM50 saves without an error |
| **Requirement** | AP2410 — Steps to reproduce 1–3 and Expected result: "Submit successfully". Comment, Ken Nguyen 2026-03-23: "please try PM50 or PM30" — this case covers the PM50 half |
| **Route** | `/quote/{QID}/details` → `/quote/{QID}/insurance` |
| **Type** | Re-test |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-08 · Dev (v2dev) · quote 6696 |
| **Result** | Saved without an error (PM50 / Français, CA$21.78 /m); reopened form shows PM30 (O-1) |

**Why this matters:** The developer asked for the fix to be checked with both rate tables
the dealer can sell, PM30 and PM50. Running PM50 with the other language as well means a
fix that only works for one combination does not pass unnoticed.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | `{QID}` — the Dev quote AP2410_001 step 1 created (client `Retest Chubb2410-001`, `client.stage.2410001@yopmail.com`, on vehicle 915 Ford Focus 2008), with its financing (Term months `12`, no co-borrower) |
| Language | Français |
| Tax exempt | No |
| Form | The option with value `GC6201MQ:PM50` (staging label "Monthly Premium PM50"; record the Dev label) |
| Life / Life Term / Life For | Decreasing / **the financing Term months recorded in step 1** / Borrower |
| Critical illness, Disability | Left unset (optional) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Signed in to the Dealer portal on Dev with the dealer account from the `env` source ("Dev Environment" section), open `/quote/{QID}/details` — `{QID}` is the quote id AP2410_001 step 1 recorded. Do **not** create a quote or add a financing here: if AP2410_001 did not record `{QID}` or its financing, this case is BLOCKED with AP2410_001's reason. Record the financing's **Term months**, **Date of birth** and **co-borrower** as the page shows them (expand the Financing block with **Edit** if it is collapsed) | Quote `{QID}`'s details page opens (heading starting `#{QID} - Retest Chubb2410-001`) with the vehicle Ford Focus 2008 (VIN `1FAHP35NX8W239204`) and the Financing section showing the financing AP2410_001 added (e.g. "Financing · 12 months · 25,000.00$ · AutoCapital Canada"); the "No applicant" notice in the Co-applicant block is expected and is not an error. Recorded in the execution log: Term months `12`, Date of birth `1985-06-15`, no co-borrower, and the Creditors insurance row as shown (AP2410_001's saved quote, or empty) — record only; step 2 opens the page by URL |
| 2 | Open `/quote/{QID}/insurance` | `/quote/{QID}/insurance` opens as a page (no error page) with the **Financing** block collapsed to 'Financing · 12 months · 25,000.00$ · AutoCapital Canada' and below it the **Creditors Insurance Quote** form (Language, Tax exempt, Form, Life, Critical illness and Disability blocks, **Get Quote**), with no banner with the `alert` role. Record the page heading as shown. A Coverage table from the last saved quote may show between the Financing block and the form — record it. |
| 3 | The page restores the last saved quote (AP2410_001's PM30 / English values, `chubb-insurance.md` §1). Set Language "Français", Tax exempt "No", Form = the option with value `GC6201MQ:PM50` (record its label), Life "Decreasing", Life Term = the Term months recorded in step 1, Life For "Borrower"; leave Critical illness and Disability unset | Each field shows the AP2410_002 value just chosen — confirm field by field that Language reads "Français" and Form holds the `GC6201MQ:PM50` option (not the restored English / PM30; whatever its label), that Life Term equals the financing term recorded in step 1, and that the other fields hold this case's values rather than restored ones; every field marked as required has a value |
| 4 | Click **Get Quote** and wait at least 10 seconds. If any banner with the `alert` role appears, record its full text word for word | The page redirects to `/quote/{QID}/details` with the flash "Chubb insurance quote saved successfully". No banner with the `alert` role and no text starting "HTTP" appears — in particular not the reported "Debtor is -1 years old. Age of Debtor is not within the plan limits." (see *The error as originally reported*) |
| 5 | [Verification] On `/quote/{QID}/details`, read the Creditors insurance row of Summary of products and open its chevron; then open `/quote/{QID}/insurance` and read the form's Language and Tax exempt fields. | The row shows a monthly premium (`CA$… /m`), not '- None Selected -'. The row's details show Rate table `PM50`, Language Français and a Coverage table with a Life row (Decreasing, BORROWER, the term recorded in step 1) with a premium amount. The reopened form reads Language Français and Tax exempt No. No banner with the `alert` role and no text starting 'HTTP' anywhere. |

---

### AP2410_003 — Insurance Quick Quote with rate table PM30 shows priced results without an error

| Field | Value |
|---|---|
| **TC ID** | AP2410_003 |
| **Title** | Insurance Quick Quote with rate table PM30 shows priced results without an error |
| **Requirement** | AP2410 — Expected result: "Submit successfully", checked on the other dealer page that sends the same Chubb creditor quote (regression near the fix). Success looks as documented in `chubb-insurance.md` §6: "'Get Quote' renders the priced result in place — the URL stays `/quick-insurance-quote` and two result tables appear" |
| **Route** | `/quick-insurance-quote` — tab **Creditors insurance** |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-08 · Dev (v2dev) · /quick-insurance-quote |
| **Result** | Two priced result tables in place, no banner |

**Why this matters:** The quick quote uses the same Chubb rating call as the quote's
insurance page, without a quote, a client or a financing. If a fix to the quote page broke
the shared call, a dealer pricing insurance for a walk-in customer would hit the same error.

**Test Data** (the working set recorded in `chubb-insurance.md` §6; every coverage term equals this case's own Term months, so there is no financing to match):

| Variable | Value |
|---|---|
| Form | Monthly Premium PM30 (`GC6201MQ:PM30`) |
| Borrower date of birth | `1990-01-01` |
| Monthly payment | `500` |
| Term months | `60` |
| Residual amount | `0` |
| Life type / term | Decreasing / `60` |
| Critical illness type / term | Decreasing / `60` |
| Disability type / term | `30D_RETRO` / `60` (the option in the 2026-03-29 screenshot; first in the `chubb-insurance.md` §6 list) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Signed in to the Dealer portal with the dealer account from the `env` source, open `/quick-insurance-quote` | The page "Creditors Insurance Quick Quote" opens on the **Creditors insurance** tab, with the Form dropdown listing "Monthly Premium PM30" and "Monthly Premium PM50" |
| 2 | Set Form "Monthly Premium PM30", Borrower date of birth `1990-01-01`, Monthly payment `500`, Term months `60`, Residual amount `0` | Each field shows the value just entered |
| 3 | Set Life "Decreasing" with term `60`, Critical illness "Decreasing" with term `60`, and Disability `30D_RETRO` with term `60` | Each coverage shows the type and term just chosen |
| 4 | Click **Get Quote** and wait at least 10 seconds. If any banner with the `alert` role appears, record its full text word for word | The URL stays `/quick-insurance-quote`. No banner with the `alert` role and no text starting "HTTP" appears |
| 5 | [Verification] Read the area below the form | The priced result is shown on the same page: result tables with premium amounts for the coverages entered (two tables on the 2026-10-03 mapping). No error message is shown anywhere on the page |

---

### AP2410_004 — Replaying the reported inputs (Tax exempt Yes, co-borrower and Both coverage) no longer returns "Debtor is -1 years old"

| Field | Value |
|---|---|
| **TC ID** | AP2410_004 |
| **Title** | Replaying the reported inputs (Tax exempt Yes, co-borrower and Both coverage) no longer returns "Debtor is -1 years old" |
| **Requirement** | AP2410 — Steps to reproduce 1–3 and Expected result: "Submit successfully", with the inputs of the comment screenshot image-20260329-142058.png (2026-03-29) that returned "Debtor is -1 years old. Age of Debtor is not within the plan limits." (HTTP 400) — see *The error as originally reported* |
| **Route** | `/quote/{QID}/details` → `/quote/{QID}/insurance` |
| **Type** | Re-test |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-08T03:53:03Z–03:55:47Z · Dev (v2dev) · quote 6696, co-applicant Coapp Retest2410 added (re-run after R3 round 1, F-1). Earlier run 2026-11-08 · Dev (v2dev) · quote 6696, no co-applicant — kept as the Q-002 record |
| **Result** | PASS (re-run): Co borrower and Both offered once the co-applicant existed; Critical illness Co borrower and Disability Both saved with "Chubb insurance quote saved successfully", CA$150.92 /m, no "years old", no HTTP; no field invalid before Get Quote. (Q-002 record, first run 2026-11-08: borrower-only — Residual Value Coverage, Co borrower and Both not offered without a co-applicant; Life, Critical illness and Disability sent for Borrower; saved without an age error) |

**Why this matters:** AP2410_001 and AP2410_002 cover only borrower Life coverage. The
reported failure came from coverage for the Co borrower and for Both, with Tax exempt Yes —
a fix that only repaired the borrower-only path would pass the other two re-tests while the
dealer who filed the bug would still get the same error. "Debtor is -1 years old" is an age
computed for a person with no date of birth, so the replay needs a co-applicant with a date
of birth on the financing and coverage sent for the Co borrower and for Both; step 1 adds
that co-applicant, so Q-002 no longer applies and the save is judged.

**Test Data** (the 2026-03-29 inputs; terms follow the financing — see *Coverage terms*):

| Variable | Value |
|---|---|
| Quote | `{QID}` — the Dev quote AP2410_001 step 1 created (client `Retest Chubb2410-001`, `client.stage.2410001@yopmail.com`, on vehicle 915 Ford Focus 2008; on this run quote **6696**), with its financing (Term months `12`) |
| Co-applicant (added in step 1) | First name `Coapp` · Last name `Retest2410` · Date of birth `1988-04-10` · no address, phone or province → **Save** through the "Add co-applicant" modal (`quote-creation.md` lines 746–750, Dev block AP-2504). Left on the quote afterwards (see *Leaves behind*) |
| Language | English |
| Tax exempt | Yes |
| Form | The option with value `GC6201MQ:PM30` (staging label "Monthly Premium PM30"; record the Dev label) |
| Life / Life Term / Life For | Decreasing / `12` (**the financing Term months recorded in step 1**) / Borrower — the screenshot's "Residual Value Coverage" is not offered on Dev (`quote-creation.md`, AP-2410 Dev block); record the Life options offered |
| Critical illness / Term / For | Decreasing / `12` (**the financing Term months recorded in step 1**) / **Co borrower** |
| Disability / Term / For | 30D_RETRO / `12` (**the financing Term months recorded in step 1**) / **Both** |

The screenshot used term `12` for all three coverages. When the financing was added by
AP2410_001 (Term months `12`) the terms are an exact replay; the Life type (Decreasing for
Residual Value Coverage) is the only input changed from the screenshot, and the execution log
says so. If step 1 reads another term, the terms follow that financing (the `contract-setup`
rule) and the execution log notes that change as well.

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Signed in to the Dealer portal on Dev with the dealer account from the `env` source ("Dev Environment" section), open `/quote/{QID}/details` — `{QID}` is the quote id AP2410_001 step 1 recorded. Do **not** create a quote or add a financing here: if AP2410_001 did not record `{QID}` or its financing, this case is BLOCKED with AP2410_001's reason. Record the financing's **Term months**, **Date of birth**, **Residual** and **co-borrower** as the page shows them (expand the Financing block with **Edit** if it is collapsed), and the Creditors insurance quote currently shown (rate table, language, coverages). Then, on `/quote/{QID}/details` click **Add co-applicant** in the Co-applicant block (modal, `quote-creation.md` Dev block AP-2504, lines 746–750); set First name `Coapp`, Last name `Retest2410`, Date of birth `1988-04-10` → **Save**; expect the flash 'Co-applicant saved' and the block showing the name and a date of birth (it may read one day early — known, not an error). If the block already shows `Coapp Retest2410`, do not add a second co-applicant — record it and go on | Quote `{QID}`'s details page opens (heading starting `#{QID} - Retest Chubb2410-001`) with the vehicle Ford Focus 2008 (VIN `1FAHP35NX8W239204`) and the Financing section showing the financing AP2410_001 added; before the co-applicant is added the "No applicant" notice in the Co-applicant block is expected and is not an error. Recorded in the execution log: Term months `12`, Date of birth `1985-06-15`, Residual `0`, the co-borrower state before this step, and the Creditors insurance quote shown before this case changes it. After **Save**: the flash 'Co-applicant saved' and the Co-applicant block shows `Coapp Retest2410` with a date of birth (`1988-04-10`, or one day early — known, not an error). Recorded: **co-borrower present → Q-002 does not apply** |
| 2 | Open `/quote/{QID}/insurance` | `/quote/{QID}/insurance` opens as a page (no error page) with the **Financing** block collapsed to 'Financing · 12 months · 25,000.00$ · AutoCapital Canada' and below it the **Creditors Insurance Quote** form (Language, Tax exempt, Form, Life, Critical illness and Disability blocks, **Get Quote**), with no banner with the `alert` role. Record the page heading as shown. A Coverage table from the last saved quote may show between the Financing block and the form — record it (none is expected on this build, observation O-3). |
| 3 | The page restores the last saved quote (Language, Tax exempt and coverages; the Form is not restored — observation O-1). Set Language "English", Tax exempt "Yes", Form = the option with value `GC6201MQ:PM30` (record its label); Life "Decreasing" / Term = the Term months recorded in step 1 (`12`) / For "Borrower" — record the Life types offered (Residual Value Coverage is not offered on Dev — record that); Critical illness "Decreasing" / same Term / For "**Co borrower**"; Disability "30D_RETRO" / same Term / For "**Both**". Record the options each "For" drop-down lists, and any field shown as invalid (red border) before **Get Quote**. If Co borrower or Both is still not offered with a co-applicant, record the options and mark AP2410_004 BLOCKED — reason 'Co borrower / Both coverage not offered on Dev' — and post on AP-2410: 'Are Co borrower and Both coverages intentionally removed from the dealer creditor-insurance form on Dev?'; do not go on to step 4 | Each field shows the AP2410_004 value just chosen — confirm field by field that Language reads "English", Tax exempt "Yes" and Form holds the `GC6201MQ:PM30` option (whatever its label), and that the three coverage blocks show the types, terms and covered persons listed: Life Decreasing / 12 / Borrower, Critical illness Decreasing / 12 / Co borrower, Disability 30D_RETRO / 12 / Both; every field marked as required has a value. Recorded: the Life types offered (no Residual Value Coverage), the "For" options of each block, and any field shown as invalid |
| 4 | Click **Get Quote** and wait at least 10 seconds. If any banner with the `alert` role appears, record its full text word for word | The page redirects to `/quote/{QID}/details` with the flash "Chubb insurance quote saved successfully"; no banner with the `alert` role, no text starting "HTTP" and no text "years old" appears — in particular not "Debtor is -1 years old. Age of Debtor is not within the plan limits." (see *The error as originally reported*) |
| 5 | [Verification] On `/quote/{QID}/details`, read the Creditors insurance row of Summary of products and open its chevron; then open `/quote/{QID}/insurance` and read the form's Language and Tax exempt fields. | The row shows a monthly premium (`CA$… /m`), not '- None Selected -'. The row's details show Rate table `PM30`, Language English, Tax exempt Yes and a Coverage table with Life, Critical illness and Disability rows, each with a premium amount. The reopened form holds the step-3 values (Language English, Tax exempt Yes, the three coverages with their terms and covered persons). No banner with the `alert` role and no text starting 'HTTP' anywhere. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Re-test | Regression |
|---|:---:|:---:|
| Steps to reproduce 1–3 + Expected result "Submit successfully" — quote insurance page, PM30 | AP2410_001 | — |
| Same, rate table PM50 (Ken Nguyen, 2026-03-23: "please try PM50 or PM30") | AP2410_002 | — |
| The reported failure of 2026-03-29 — PM30, Tax exempt Yes, Life Residual Value Coverage / Borrower, Critical illness Decreasing / Co borrower, Disability 30D_RETRO / Both — no longer returns "Debtor is -1 years old" (on Dev with a co-applicant; Life Decreasing, as Residual Value Coverage is not offered) | AP2410_004 | — |
| Coverage terms match the financing term (`contract-setup` Stage B) | AP2410_001, AP2410_002, AP2410_004 (step 1 records the term, step 3 uses it) | — |
| Same Chubb rating call from the Insurance Quick Quote page | — | AP2410_003 |
| Q-001 (Judgement) — whether an RT rate table should be offered | record only in AP2410_001 step 2 | — |
| Q-002 (Judgement) — co-borrower / Both coverage on a financing without a co-borrower | recorded by the borrower-only AP2410_004 run of 2026-11-08 (execution log); no longer applies once step 1 adds the co-applicant | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2410_001 | ✅ PASS | qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2410_2026-11-08.md |
| AP2410_002 | ✅ PASS | qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2410_2026-11-08.md |
| AP2410_003 | ✅ PASS | qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2410_2026-11-08.md |
| AP2410_004 | ✅ PASS | qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2410_2026-11-08.md (*Re-run after review R3*, 2026-11-08T03:55:47Z) · qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_004-rerun-step5-CreditorsRowCoBorrowerBoth_pass.png |
