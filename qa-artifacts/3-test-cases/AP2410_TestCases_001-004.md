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

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/quote/6167/insurance` — the Chubb Insurance Quote page named in the bug (heading "Insurance for {client}"). Reach it by URL: the `contract-setup` source (Stage A, 2026-09-04) says an "Add creditors insurance" link appears once financing is saved, but the newer `domain` source (§5, 2026-10-03) says there is no visible link while the Creditors insurance row is empty — so the steps never depend on the link and only record whether it is shown. AP2410_003 starts at `/quick-insurance-quote` (heading "Creditors Insurance Quick Quote", tab **Creditors insurance**), also reachable from the Dashboard link "Insurance Quick Quote". | `navigation` → `domain` (`chubb-insurance.md` §5, §6) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | Staging (v2staging) — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Dealer — the dealer account in the `env` source (`base-test/execute.env.md` → Accounts, "Dealer (Dealer Portal)" row; Dealer ID `1380`). Sign in at `/login`. Do not copy the credential into the execution log. | `env` |
| **Test data** | Quote **6167** — the quote the bug was reported on; it belongs to Dealer 1380 (it answered as a Dealer 1380 quote on 2026-09-06 and has no Chubb contract). Its financing may already exist with values nobody here recorded, so step 1 of AP2410_001, 002 and 004 records the financing's **Term months**, **Date of birth** and **co-borrower** (present with its date of birth / none / no co-borrower field shown) before any coverage is set. Dealer 1380's Chubb configuration (account `AP0001`, forms Creditor Monthly PM30 and Creditor Monthly PM50 assigned) is read only — never change it. **Do not use quotes 6276, 6254 or 6256** — they hold AP-2437's contracts — and do not create quotes on vehicle 915. | `test-data`, `env`, `contract-setup` |
| **Coverage terms** | On the quote insurance page every coverage term (Life, Critical illness, Disability) is **the financing term recorded in step 1** — `contract-setup` Stage B says Life Term must "Match the financing term", so a fixed value could make Chubb refuse the quote for a test-data reason rather than the fix. If this batch has to add the financing (AP2410_001 step 1), it uses Term months `12` — the term in the 2026-03-29 screenshot — so that AP2410_004 is then an exact replay. AP2410_003 has no financing; it uses its own Term months `60` for every coverage. | `contract-setup` Stage B, `domain` §6 |
| **Language** | English dealer UI. The quote's insurance **Language** field (English / Français) is test data, not the UI language. | `navigation`, `domain` |
| **Leaves behind** | On quote 6167: a financing record (only if AP2410_001 had to add one — Term months `12`, no co-borrower) and a saved Chubb insurance quote. The last one saved stays: after AP2410_002 it is the PM50 / Français quote; if AP2410_004 then saves, it is replaced by the PM30 / English / Tax exempt Yes replay with Life, Critical illness and Disability coverage; if AP2410_004 is refused, the PM50 / Français quote stays. AP2410_003 shows its result in place; whether the quick quote is stored anywhere is not documented. No Chubb contract is created by this batch. | `cleanup` (missing), `domain` |

**Run order.** AP2410_001 → 002 → 003 → 004. AP2410_001 is the only case that may add the
financing; AP2410_002 and AP2410_004 reuse it. AP2410_004 runs last because it may leave
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
| Q-002 | The reported error came from coverage for the **Co borrower** (Critical illness) and **Both** (Disability). If quote 6167's financing has **no co-borrower**, should a quote with co-borrower or Both coverage be accepted, or refused — and with what message? The ticket does not say. | Judgement | Open — applies only if AP2410_004 step 1 records no co-borrower | AP2410_004 steps 4–5 become **record-only**: they list only objective faults and record whether the quote was saved or refused (with the full banner text). With a co-borrower present, Q-002 does not apply and AP2410_004 asserts a successful save |

**Known blockers:** None at design time. If quote 6167 no longer opens for Dealer 1380, has
no vehicle (a quote without a vehicle returns HTTP 500 at the insurance step — a separate,
known defect), or its "Add a financing" action stays disabled, record AP2410_001, AP2410_002
and AP2410_004 as **BLOCKED** with that reason. Do not substitute one of the reserved quotes.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2410_001 | Getting a Chubb insurance quote with every required option filled and rate table PM30 saves without an error | Re-test | High | Not Run |
| AP2410_002 | Getting a Chubb insurance quote in French with rate table PM50 saves without an error | Re-test | High | Not Run |
| AP2410_003 | Insurance Quick Quote with rate table PM30 shows priced results without an error | Regression | Medium | Not Run |
| AP2410_004 | Replaying the reported inputs (Tax exempt Yes, co-borrower and Both coverage) no longer returns "Debtor is -1 years old" | Re-test | High | Not Run |

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
| **Route** | `/quote/6167/details` → `/quote/6167/insurance` |
| **Type** | Re-test |
| **Priority** | High |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** This is the bug's own reproduction, on the quote it was reported
against. Before the fix, a dealer who filled every required field still got an error and
could not price creditor insurance for the client, so the sale could not include it.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | 6167 |
| Financing (only if the quote has none) | Date of birth `1985-06-15` · Type "Financing" · Net amount financed including RDPRM `25000` · Residual `0` · Payment frequency "Monthly" · Term months `12` · Interest rate `6.99` · Financing company "AutoCapital Canada" (first match) · no co-borrower |
| Language | English |
| Tax exempt | No |
| Form | Monthly Premium PM30 |
| Life / Life Term / Life For | Decreasing / **the financing Term months recorded in step 1** / Borrower |
| Critical illness, Disability | Left unset (optional) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal at `/login` with the dealer account from the `env` source, then open `/quote/6167/details`. If the Financing section has no financing, click "Add a financing" and at `/quote/6167/financing` set Date of birth `1985-06-15`, Type "Financing", Net amount financed including RDPRM `25000`, Residual `0`, Payment frequency "Monthly", Term months `12`, Interest rate `6.99`, Financing company "AutoCapital Canada"; add no co-borrower → **Save**. Record the financing's **Term months**, **Date of birth** and **co-borrower** (present with its date of birth / none / no co-borrower field shown) | The Quote Details page for quote 6167 opens with a Vehicle section that names a vehicle. The Financing section shows a financing — either already there, or added now with the green flash "Financing saved". Recorded in the execution log: which of the two it was, the Term months, the Date of birth and the co-borrower. Record whether an **Add creditors insurance** link (or an existing Creditors insurance entry) is shown — record only; step 2 opens the page by URL (`chubb-insurance.md` §5) |
| 2 | Open `/quote/6167/insurance` and open the **Form** dropdown. Record every option it lists (for Q-001) | The page "Insurance for {client}" opens with the fields Language, Tax exempt, Form, and the Life, Critical illness and Disability blocks, with no error banner. The Form options are recorded word for word in the execution log — record only, for Q-001 |
| 3 | Set Language "English", Tax exempt "No", Form "Monthly Premium PM30", Life "Decreasing", Life Term = the Term months recorded in step 1, Life For "Borrower"; leave Critical illness and Disability unset | Each field shows the value just chosen, and Life Term equals the financing term recorded in step 1; every field marked as required has a value |
| 4 | Click **Get Quote** and wait at least 10 seconds. If any banner with the `alert` role appears, record its full text word for word | The page redirects to `/quote/6167/details` with the flash "Chubb insurance quote saved successfully". No banner with the `alert` role and no text starting "HTTP" appears — in particular not the reported "Debtor is -1 years old. Age of Debtor is not within the plan limits." (see *The error as originally reported*) |
| 5 | [Verification] On `/quote/6167/details`, read the Creditors insurance section | The section shows a Chubb insurance quote with Rate table "PM30" and Language English (the values entered in step 3), and a coverage table with a Life row and a premium amount. No error message is shown anywhere on the page |

---

### AP2410_002 — Getting a Chubb insurance quote in French with rate table PM50 saves without an error

| Field | Value |
|---|---|
| **TC ID** | AP2410_002 |
| **Title** | Getting a Chubb insurance quote in French with rate table PM50 saves without an error |
| **Requirement** | AP2410 — Steps to reproduce 1–3 and Expected result: "Submit successfully". Comment, Ken Nguyen 2026-03-23: "please try PM50 or PM30" — this case covers the PM50 half |
| **Route** | `/quote/6167/details` → `/quote/6167/insurance` |
| **Type** | Re-test |
| **Priority** | High |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** The developer asked for the fix to be checked with both rate tables
the dealer can sell, PM30 and PM50. Running PM50 with the other language as well means a
fix that only works for one combination does not pass unnoticed.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | 6167 (with the financing from AP2410_001 step 1) |
| Language | Français |
| Tax exempt | No |
| Form | Monthly Premium PM50 |
| Life / Life Term / Life For | Decreasing / **the financing Term months recorded in step 1** / Borrower |
| Critical illness, Disability | Left unset (optional) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Signed in to the Dealer portal with the dealer account from the `env` source, open `/quote/6167/details`. If the Financing section has no financing, add it exactly as in AP2410_001 step 1. Record the financing's **Term months**, **Date of birth** and **co-borrower** (present with its date of birth / none / no co-borrower field shown) | Quote 6167's details page opens with a Vehicle section that names a vehicle and a Financing section that shows a financing (with the green flash "Financing saved" if it was added now). The Term months, Date of birth and co-borrower are recorded in the execution log. Record whether an **Add creditors insurance** link (or an existing Creditors insurance entry) is shown — record only; step 2 opens the page by URL (`chubb-insurance.md` §5) |
| 2 | Open `/quote/6167/insurance` | The page "Insurance for {client}" opens with no error banner |
| 3 | The page restores the last saved quote (AP2410_001's PM30 / English values, `chubb-insurance.md` §1). Set Language "Français", Tax exempt "No", Form "Monthly Premium PM50", Life "Decreasing", Life Term = the Term months recorded in step 1, Life For "Borrower"; leave Critical illness and Disability unset | Each field shows the AP2410_002 value just chosen — confirm field by field that Language reads "Français" and Form "Monthly Premium PM50" (not the restored English / PM30), that Life Term equals the financing term recorded in step 1, and that the other fields hold this case's values rather than restored ones; every field marked as required has a value |
| 4 | Click **Get Quote** and wait at least 10 seconds. If any banner with the `alert` role appears, record its full text word for word | The page redirects to `/quote/6167/details` with the flash "Chubb insurance quote saved successfully". No banner with the `alert` role and no text starting "HTTP" appears — in particular not the reported "Debtor is -1 years old. Age of Debtor is not within the plan limits." (see *The error as originally reported*) |
| 5 | [Verification] On `/quote/6167/details`, read the Creditors insurance section | The section shows Rate table "PM50" and Language Français (the values entered in step 3), and a coverage table with a Life row and a premium amount. No error message is shown anywhere on the page |

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
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

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
| **Route** | `/quote/6167/details` → `/quote/6167/insurance` |
| **Type** | Re-test |
| **Priority** | High |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** AP2410_001 and AP2410_002 cover only borrower Life coverage. The
reported failure came from coverage for the Co borrower and for Both, with Tax exempt Yes —
a fix that only repaired the borrower-only path would pass the other two re-tests while the
dealer who filed the bug would still get the same error. Whether a quote with no co-borrower
may carry co-borrower coverage is not stated (Q-002), so that case is recorded, not judged.

**Test Data** (the 2026-03-29 inputs; terms follow the financing — see *Coverage terms*):

| Variable | Value |
|---|---|
| Quote | 6167 (with the financing from AP2410_001 step 1) |
| Language | English |
| Tax exempt | Yes |
| Form | Monthly Premium PM30 |
| Life / Life Term / Life For | Residual Value Coverage / **the financing Term months recorded in step 1** / Borrower |
| Critical illness / Term / For | Decreasing / **the financing Term months recorded in step 1** / Co borrower |
| Disability / Term / For | 30D_RETRO / **the financing Term months recorded in step 1** / Both |

The screenshot used term `12` for all three coverages. When the financing was added by
AP2410_001 (Term months `12`) this is an exact replay. If quote 6167 already had a financing
with another term, the terms follow that financing (the `contract-setup` rule) and the
execution log notes that the term was the only input changed from the screenshot.

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Signed in to the Dealer portal with the dealer account from the `env` source, open `/quote/6167/details`. If the Financing section has no financing, add it exactly as in AP2410_001 step 1. Record the financing's **Term months**, **Date of birth** and **co-borrower** (present with its date of birth / none / no co-borrower field shown) | Quote 6167's details page opens with a Vehicle section that names a vehicle and a Financing section that shows a financing. The Term months, Date of birth and co-borrower are recorded in the execution log. **If no co-borrower is recorded, Q-002 applies and steps 4–5 are judged as record-only** |
| 2 | Open `/quote/6167/insurance` | The page "Insurance for {client}" opens with no error banner |
| 3 | The page restores the last saved quote (AP2410_002's PM50 / Français values). Set Language "English", Tax exempt "Yes", Form "Monthly Premium PM30"; Life "Residual Value Coverage" / Term = the Term months recorded in step 1 / For "Borrower"; Critical illness "Decreasing" / same Term / For "Co borrower"; Disability "30D_RETRO" / same Term / For "Both" | Each field shows the AP2410_004 value just chosen — confirm field by field that Language reads "English", Tax exempt "Yes" and Form "Monthly Premium PM30" (not the restored Français / PM50), and that the three coverage blocks show the types, terms and covered persons listed; every field marked as required has a value |
| 4 | Click **Get Quote** and wait at least 10 seconds. If any banner with the `alert` role appears, record its full text word for word | **Co-borrower recorded in step 1:** the page redirects to `/quote/6167/details` with the flash "Chubb insurance quote saved successfully"; no banner with the `alert` role and no text starting "HTTP" appears — in particular not "Debtor is -1 years old. Age of Debtor is not within the plan limits." **No co-borrower recorded (Q-002, record-only):** no error page or HTTP 5xx, and no banner stating an age that no date of birth recorded in step 1 produces (the reported "Debtor is -1 years old …" is such a value). Record the outcome for Q-002 — saved with the flash, or refused, with the full banner text |
| 5 | [Verification] On `/quote/6167/details`, read the Creditors insurance section | **Co-borrower recorded:** the section shows Rate table "PM30", Language English and Tax exempt Yes (the values entered in step 3), and a coverage table with Life, Critical illness and Disability rows, each with a premium amount. No error message is shown anywhere on the page. **No co-borrower recorded (Q-002, record-only):** if step 4 saved, the section shows the values entered in step 3, none lost or changed; if step 4 was refused, the section still shows AP2410_002's PM50 / Français quote, unchanged. Record the outcome for Q-002 |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Re-test | Regression |
|---|:---:|:---:|
| Steps to reproduce 1–3 + Expected result "Submit successfully" — quote insurance page, PM30 | AP2410_001 | — |
| Same, rate table PM50 (Ken Nguyen, 2026-03-23: "please try PM50 or PM30") | AP2410_002 | — |
| The reported failure of 2026-03-29 — PM30, Tax exempt Yes, Life Residual Value Coverage / Borrower, Critical illness Decreasing / Co borrower, Disability 30D_RETRO / Both — no longer returns "Debtor is -1 years old" | AP2410_004 | — |
| Coverage terms match the financing term (`contract-setup` Stage B) | AP2410_001, AP2410_002, AP2410_004 (step 1 records the term, step 3 uses it) | — |
| Same Chubb rating call from the Insurance Quick Quote page | — | AP2410_003 |
| Q-001 (Judgement) — whether an RT rate table should be offered | record only in AP2410_001 step 2 | — |
| Q-002 (Judgement) — co-borrower / Both coverage on a financing without a co-borrower | record only in AP2410_004 steps 4–5, when step 1 records no co-borrower | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2410_001 | _(pending)_ | — |
| AP2410_002 | _(pending)_ | — |
| AP2410_003 | _(pending)_ | — |
| AP2410_004 | _(pending)_ | — |
