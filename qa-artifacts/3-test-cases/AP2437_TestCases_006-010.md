# Test Cases — AP2437 (File 2 of 5)

**Project:** Avantage Plus (AP) — Dealer Portal, Chubb creditor-insurance contract printing
**Requirement:** AP-2437 — Attach the acceptance/waiver form to the Chubb insurance contract PDF
**Source:** `qa-artifacts/1-requirements-analysis/AP-2437_requirements-analysis.md` · `qa-artifacts/2-test-plan/AP-2437_test-plan.md` · Jira [AP-2437](https://garantieavantageplus.atlassian.net/browse/AP-2437)
**Date:** 2026-09-03
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2437_006 to AP2437_010 (5 test cases)
**Coverage:** Functional · Edge-case — REQ-003, the four-branch form selection

---

## Execution Context

_Same environment as file 1. Repeated here so the executor needs only this file open._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf`. The branch is chosen when the contract is *created*, on `/quote/{id}/insurance` | `navigation`, `contract-setup` |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | Staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | `/login` — `vinhle870@gmail.com` / `<password from the env source>` · Dealer ID `1380`, province QC | `env` |
| **Admin login (setup)** | `/admin/login`, same credentials · `/admin/dealer/1380/chubb-insurance` | `env` |
| **Test data** | One contract **per branch** — each fixes its language and rate table at creation. Branch 1 exists: **AVP000160** (quote 6276, Français + PM50). Branches 2–4 must be created via `contract-setup`. The four acceptance-form PDFs attached to AP-2437, each **1 page** | `test-data`, `contract-setup` |
| **Language** | Both. Set by the **Language*** dropdown on `/quote/{id}/insurance`, submitted as `E` / `F` — **Q-003 closed 2026-09-04** | `contract-setup` |
| **Contract setup** | Contracts are **dynamic test data** — each case that needs one creates it in its own `[Pre-Condition]` step, with the field values written there. Background, rationale and the full register live in `base-test/06-chubb-contract-setup.md`; that file is reference material for the designer, not a step the executor follows | `contract-setup` |
| **Contracts already created** | `AVP000160` — quote 6276, Marie Tremblay, **Français / PM50** (branch 1). Reuse it rather than creating another; every stage A–C run leaves a permanent contract that nothing removes. Branches 2–4 have none yet | `contract-setup` |
| **Leaves behind** | Contracts created to reach each branch, and any Chubb configuration change. `cleanup` is `missing` — restore Dealer 1380 to Creditor Monthly PM30, Creditor Monthly PM50 and GAP after any test that changes the assignment | `cleanup` (missing) |

**The decision rule under test.** Jira states the four conditions and leaves the four
outcomes blank; the mapping below is inferred from the attachment filenames, and
**branch 1 was confirmed by observation on 2026-09-04**:

| Branch | Set on `/quote/{id}/insurance` | Expected form | Confirmed? |
|---|---|---|---|
| 1 | Language **Français** + Form **Monthly Premium PM50** | `Formulaire d'acceptation ou de renonciation — Assurance crédit (50 %).pdf` | **Yes** — contract AVP000160, page 1 of the merged PDF is the French 50 % form |
| 2 | Language **English** + Form **Monthly Premium PM50** | `Acceptance or Waiver Form — Credit Insurance (50 %).pdf` | Not yet |
| 3 | Language **Français** + Form **Monthly Premium PM30** | `Formulaire d'acceptation ou de renonciation — Assurance crédit.pdf` | Not yet |
| 4 | Language **English** + Form **Monthly Premium PM30** | `Acceptance or Waiver Form — Credit Insurance (30 %).pdf` | Not yet |

The two inputs are the **Language*** dropdown (`E` / `F`) and the **Form*** dropdown
(`GC6201MQ:PM30` / `GC6201MQ:PM50`, shown as *"Rate table"* on the quote details page).
Both are ordinary dealer-UI controls — **Q-002 and Q-003 are closed.**

**Known blockers:**

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | **Written confirmation of the branch-to-form mapping.** Branch 1 now matches the inference, which is strong evidence but not a specification. Branches 2–4 remain unconfirmed by either the ticket or a run. | AP2437_006 – AP2437_009 | Open — **Q-001**. Weaker than before: a run can now *demonstrate* each mapping, so these cases score against observed behaviour and the developer confirms the intent |
| 2 | Whether "contains 50" is deliberately a substring test, so that a rate such as "150" would also take the 50 % form | AP2437_010 | Open — **Q-004**. Note the Form dropdown offers only PM30 and PM50, so a substring-colliding rate may not be reachable from the UI at all — if so, mark AP2437_010 SKIPPED with that finding |

> **These cases are executable now.** Each needs its own contract, created through
> `contract-setup` with the language and form for its branch. Branch 1's contract already
> exists (AVP000160); branches 2, 3 and 4 need one new quote each.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2437_006 | A French contract at a 50 % rate attaches the French 50 % acceptance form | Functional | High | PASS |
| AP2437_007 | An English contract at a 50 % rate attaches the English 50 % acceptance form | Functional | High | PASS |
| AP2437_008 | A French contract at a non-50 % rate attaches the French 30 % acceptance form | Functional | High | BLOCKED |
| AP2437_009 | A contract with no French language set falls through to the English 30 % form rather than failing | Functional | High | PASS |
| AP2437_010 | A rate of "150" is not treated as a 50 % rate — or, if it is, the substring behaviour is deliberate | Edge-case | Medium | SKIPPED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2437_006 — A French contract at a 50 % rate attaches the French 50 % acceptance form

| Field | Value |
|---|---|
| **TC ID** | AP2437_006 |
| **Title** | A French contract at a 50 % rate attaches the French 50 % acceptance form |
| **Requirement** | REQ-003, branch 1 — rate contains "50" AND `quote_financing_insurance_chubb.language = "F"` |
| **Route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — Q-002, Q-003 and Q-013 closed 2026-09-04. Q-001 still governs *intent*: the mapping this case asserts is inferred, though branch 1 now matches it in practice |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — AVP000160 (Francais + PM50) attached the French 50 % form stating "cinquante pour cent (50 %)". Branch 1 confirmed |

**Why this matters:** This is the branch most likely to matter in production. Avantage+'s
dealerships are Quebec-based and the story is written in French, so French contracts are
the common case, and the 50 % rate carries the higher commission disclosure. Attaching
the 30 % form here would understate the dealership's commission on a signed legal
document — a compliance defect, not a display bug.

**Test Data:**

| Variable | Value |
|---|---|
| Insurance rate | A rate whose text contains "50" — the exact field and value are **Not known**, Q-002 |
| `quote_financing_insurance_chubb.language` | `F` — how to set it is **Not known**, Q-003 |
| Expected form | `Formulaire d'acceptation ou de renonciation — Assurance crédit (50 %).pdf` *(inferred — Q-001)* |
| Identifying marks | Record the French title text and page count of this attachment before the run, so the produced page can be matched against it |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal as `vinhle870@gmail.com` / `<password from the env source>`, and open the four AP-2437 attachments locally | The dashboard loads. All four reference forms are **1 page** each, recorded by AP2437_013 — so the merged contract should be the Chubb page count plus one |
| 2 | [Pre-Condition] Reuse contract **AVP000160** (quote 6276) if present. Otherwise, on a fresh quote: at `/quote/{id}/financing` set Date of birth `1985-06-15`, Type "Financing", Net amount financed `25000`, Residual `0`, Payment frequency "Monthly", Term `60`, Interest rate `6.99`, Financing company "AutoCapital Canada" → **Save**; at `/quote/{id}/insurance` set **Language "Français"**, Tax exempt "No", **Form "Monthly Premium PM50"**, Life "Decreasing", Life Term `60`, Life For "Borrower" → **Get Quote**; then **Generate Contract** → **Create Contract** on the confirmation page | The quote details show **Rate table: PM50** and **Language: Français**. Record the contract number and quote id |
| 3 | Open `/creditor-insurance-contracts`, click **"Download"** on that contract's row, and view the PDF | The PDF renders in a browser tab (`inline; filename=contrat.pdf`) with no error |
| 4 | Read the acceptance form on page 1 and compare its title text against the four reference forms | The page 1 form matches exactly one of the four references |
| 5 | [Verification] Verify the form on page 1 is the **French 50 %** variant — its text is in French and it states the 50 % remuneration figure | Page 1 is `Formulaire d'acceptation ou de renonciation — Assurance crédit (50 %)`. If it is the French 30 % form, that is a branch-selection FAIL; if it is an English form, that is a language FAIL. Record which of the four was produced either way, and capture a screenshot of page 1 |

---

### AP2437_007 — An English contract at a 50 % rate attaches the English 50 % acceptance form

| Field | Value |
|---|---|
| **TC ID** | AP2437_007 |
| **Title** | An English contract at a 50 % rate attaches the English 50 % acceptance form |
| **Requirement** | REQ-003, branch 2 — rate contains "50" AND `quote_financing_insurance_chubb.language = "E"` |
| **Route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — for execution. Q-001 still governs the *expected* form: the mapping is inferred, not specified |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — AVP000162 (English + PM50, quote 6254) attached the English 50 % form stating "fifty percent (50 %)". Branch 2 confirmed. First attempt on quote 6277 hit BUG-011 |

**Why this matters:** This case pairs with AP2437_006 to prove the *language* half of the
decision independently of the *rate* half. Holding the rate constant and changing only
the language is the only way to show that the two conditions are being combined rather
than one of them silently ignored — a classic implementation slip in a four-branch
if/else chain.

**Test Data:**

| Variable | Value |
|---|---|
| Insurance rate | The same rate used in AP2437_006 — one whose text contains "50" |
| `quote_financing_insurance_chubb.language` | `E` — how to set it is **Not known**, Q-003 |
| Expected form | `Acceptance or Waiver Form — Credit Insurance (50 %).pdf` *(inferred — Q-001)* |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal with the four AP-2437 reference forms open locally | The dashboard loads; reference forms available |
| 2 | [Pre-Condition] On a fresh quote — same rate table as AP2437_006, differing only in language: at `/quote/{id}/financing` set Date of birth `1985-06-15`, Type "Financing", Net amount financed `25000`, Residual `0`, Payment frequency "Monthly", Term `60`, Interest rate `6.99`, Financing company "AutoCapital Canada" → **Save**; at `/quote/{id}/insurance` set **Language "English"**, Tax exempt "No", **Form "Monthly Premium PM50"**, Life "Decreasing", Life Term `60`, Life For "Borrower" → **Get Quote**; then **Generate Contract** → **Create Contract** on the confirmation page | The quote details show **Rate table: PM50** and **Language: English**. Record the contract number and quote id |
| 3 | Open `/creditor-insurance-contracts`, click **"Download"** on that contract's row, and view the PDF | The PDF renders in a browser tab (`inline; filename=contrat.pdf`) with no error |
| 4 | Read the acceptance form on page 1 | The page 1 form is in English |
| 5 | [Verification] Verify page 1 is the **English 50 %** variant, and that the only difference from AP2437_006's result is the language — the same 50 % rate produced a 50 % form in both cases | Page 1 is `Acceptance or Waiver Form — Credit Insurance (50 %)`. If the French form appears despite an English contract, the language condition is being ignored — report as High severity. Capture a screenshot of page 1 |

---

### AP2437_008 — A French contract at a non-50 % rate attaches the French 30 % acceptance form

| Field | Value |
|---|---|
| **TC ID** | AP2437_008 |
| **Title** | A French contract at a non-50 % rate attaches the French 30 % acceptance form |
| **Requirement** | REQ-003, branch 3 — `quote_financing_insurance_chubb.language = "F"` with a rate that does not contain "50" |
| **Route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | — for execution. Q-001 still governs the *expected* form: the mapping is inferred, not specified |
| **Executed on** | 2026-09-06 |
| **Result** | BLOCKED — no branch-3 contract could be created. Quotes 6245 and 6253 both failed silently at Create Contract, twice each (BUG-010). Branch 3 remains the one unverified branch |

**Why this matters:** This is the mirror of AP2437_006: same language, different rate. It
proves the *rate* half of the decision. Between the two, a tester can say which of the
two conditions is broken when a branch misfires, instead of reporting only that "the
wrong form appeared".

**Test Data:**

| Variable | Value |
|---|---|
| Insurance rate | A rate whose text does **not** contain "50" — for example a 30 % rate. Exact field and value **Not known**, Q-002 |
| `quote_financing_insurance_chubb.language` | `F` |
| Expected form | `Formulaire d'acceptation ou de renonciation — Assurance crédit.pdf` — the French 30 % form *(inferred — Q-001)* |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal with the four AP-2437 reference forms open locally | The dashboard loads; reference forms available |
| 2 | [Pre-Condition] On a fresh quote — same language as AP2437_006, differing only in rate table: at `/quote/{id}/financing` set Date of birth `1985-06-15`, Type "Financing", Net amount financed `25000`, Residual `0`, Payment frequency "Monthly", Term `60`, Interest rate `6.99`, Financing company "AutoCapital Canada" → **Save**; at `/quote/{id}/insurance` set **Language "Français"**, Tax exempt "No", **Form "Monthly Premium PM30"**, Life "Decreasing", Life Term `60`, Life For "Borrower" → **Get Quote**; then **Generate Contract** → **Create Contract** on the confirmation page | The quote details show **Rate table: PM30** and **Language: Français**. Record the contract number and quote id |
| 3 | Open `/creditor-insurance-contracts`, click **"Download"** on that contract's row, and view the PDF | The PDF renders in a browser tab (`inline; filename=contrat.pdf`) with no error |
| 4 | Read the acceptance form on page 1 and compare it against the two French reference forms | The form is in French and matches one of the two French references |
| 5 | [Verification] Verify page 1 is the **French 30 %** variant and not the French 50 % variant | Page 1 is `Formulaire d'acceptation ou de renonciation — Assurance crédit` (the 30 % form). If the 50 % form appears on a non-50 % contract, the rate condition is inverted or ignored — report as High severity, since it overstates the dealership's disclosed commission. Capture a screenshot of page 1 |

---

### AP2437_009 — A contract with no French language set falls through to the English 30 % form rather than failing

| Field | Value |
|---|---|
| **TC ID** | AP2437_009 |
| **Title** | A contract with no French language set falls through to the English 30 % form rather than failing |
| **Requirement** | REQ-003, branch 4 — the `Else` default: any combination not matching branches 1–3 |
| **Route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — for execution. Q-001 still governs the *expected* form: the mapping is inferred, not specified |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — AVP000161 (English + PM30, quote 6256) attached the English 30 % form. A form was attached on the default branch. An unset language is unreachable from the UI, so the branch was exercised with E |

**Why this matters:** Branch 4 is written as a bare `Else`, which means it catches
everything the first three did not — including a language value that is empty, null, or
something nobody anticipated. A default branch is exactly where a four-way if/else
quietly attaches nothing at all, and the resulting contract would download looking
perfectly normal with no disclosure page in it. The point of this case is to prove the
default *produces a form*, not merely that it does not crash.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| `quote_financing_insurance_chubb.language` | Empty, unset, or a value that is neither `F` nor `E` | How to produce this is **Not known** — Q-003. If the field cannot be left unset from the UI, use `E` and record that the true default path was not exercised |
| Insurance rate | A rate that does not contain "50" | Q-002 |
| Expected form | `Acceptance or Waiver Form — Credit Insurance (30 %).pdf` *(inferred — Q-001)* |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal with the four AP-2437 reference forms open locally | The dashboard loads; reference forms available |
| 2 | [Pre-Condition] On a fresh quote: at `/quote/{id}/financing` set Date of birth `1985-06-15`, Type "Financing", Net amount financed `25000`, Residual `0`, Payment frequency "Monthly", Term `60`, Interest rate `6.99`, Financing company "AutoCapital Canada" → **Save**; at `/quote/{id}/insurance` set **Language "English"**, Tax exempt "No", **Form "Monthly Premium PM30"**, Life "Decreasing", Life Term `60`, Life For "Borrower" → **Get Quote**; then **Generate Contract** → **Create Contract** on the confirmation page. The Language dropdown offers only English and Français, so an unset value is unreachable — record that the default branch was exercised with `E`, the weaker reading | The quote details show **Rate table: PM30** and **Language: English** |
| 3 | Download the contract PDF and open it | A PDF is produced and opens without error — the download must not fail merely because no language was set |
| 4 | Read page 1 | Page 1 is an acceptance/waiver form, not a Chubb contract page. A contract whose page 1 is a Chubb page means **no form was attached at all** — the worst outcome, and a High-severity FAIL |
| 5 | [Verification] Verify page 1 is the **English 30 %** variant and that a form was attached despite the unrecognised language | Page 1 is `Acceptance or Waiver Form — Credit Insurance (30 %)`. Capture a screenshot of page 1, and record the exact language value the contract carried |

---

### AP2437_010 — A rate of "150" is not treated as a 50 % rate — or, if it is, the substring behaviour is deliberate

| Field | Value |
|---|---|
| **TC ID** | AP2437_010 |
| **Title** | A rate of "150" is not treated as a 50 % rate — or, if it is, the substring behaviour is deliberate |
| **Requirement** | REQ-003 / AC-4 — the rule is a *contains "50"* text test, not an equality test |
| **Route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | SKIPPED |
| **Blocked by** | — for execution, but the Form dropdown offers only PM30 and PM50, so a substring-colliding rate may be unreachable from the UI. Q-004 governs whether the behaviour is intended |
| **Executed on** | 2026-09-06 |
| **Result** | SKIPPED — the Form dropdown offers only GC6201MQ:PM30 and GC6201MQ:PM50, so no substring-colliding rate is reachable. Answers Q-004 in practice: latent risk, not a current defect |

**Why this matters:** "Contains 50" is a substring test, and substring tests match more
than their author usually intends. A rate written "150", "50.5" or "PM50" all contain
"50" and would all take the 50 % form under a literal reading. If any of those values
can occur in real data, a contract could disclose a 50 % commission when the dealership
earns something else entirely — the printed percentage on a document the client signs
would simply be wrong. This case does not assume the behaviour is a defect; it
establishes what the behaviour actually is so the product owner can rule.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Rate A | A rate whose text is `150` or contains "50" inside a larger number | Only if such a rate can exist — confirm with Q-002 first |
| Rate B | A rate whose text is `50.5` | Same caveat |
| Rate C | A rate coded `PM50` | The `PM50` / `PM30` creditor form codes are recorded for AP-2436; whether they are the same "rate" this rule reads is unconfirmed |
| Expected | **Not known.** Record the observed behaviour and put it to the product owner — Q-004 | This case reports a finding rather than asserting a pass |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal and confirm with the developer's answer to Q-002 which of Rate A, B or C can actually be produced | At least one substring-matching rate value is producible. If none is, mark the case SKIPPED with the reason, not FAILED |
| 2 | [Pre-Condition] Create or open a Chubb creditor-insurance contract carrying that rate, with language French | A contract exists carrying the substring-matching rate |
| 3 | Open `/creditor-insurance-contracts`, click **"Download"** on that contract's row, and view the PDF | The PDF renders in a browser tab (`inline; filename=contrat.pdf`) with no error |
| 4 | Read the acceptance form on page 1 and identify which of the four variants it is | The variant is identified and recorded, together with the exact rate value used |
| 5 | [Verification] Verify which form the substring rate produced, and record it as a finding for the product owner rather than as a pass or fail against an expected value | The observed form and the rate that produced it are recorded in the execution log and raised on the ticket under Q-004. Mark PASS if the 50 % form appeared **and** the product owner has confirmed that is intended; mark FAIL if the product owner confirms it should not; leave the result as an open observation if Q-004 is still unanswered. Capture a screenshot of page 1 |

---

## Coverage Matrix

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-003 branch 1 — FR + 50 % | AP2437_006 | — | — | — |
| REQ-003 branch 2 — EN + 50 % | AP2437_007 | — | — | — |
| REQ-003 branch 3 — FR + non-50 % | AP2437_008 | — | — | — |
| REQ-003 branch 4 — the `Else` default | AP2437_009 | — | — | — |
| REQ-003 / AC-4 — "contains 50" is a substring test | — | — | AP2437_010 | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2437_006 | PASS | see execution-log_AP-2437_2026-09-06.md |
| AP2437_007 | PASS | see execution-log_AP-2437_2026-09-06.md |
| AP2437_008 | BLOCKED | see execution-log_AP-2437_2026-09-06.md |
| AP2437_009 | PASS | see execution-log_AP-2437_2026-09-06.md |
| AP2437_010 | SKIPPED | see execution-log_AP-2437_2026-09-06.md |
