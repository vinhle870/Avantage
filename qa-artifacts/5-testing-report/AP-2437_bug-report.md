# Bug Report

**Project:** Avantage Plus (AP) — Dealer portal, Chubb creditor-insurance contract printing
**Report ID:** BR-20260903-001 *(revised 2026-09-07)*
**Test Cycle:** AP-2437 — Attach the acceptance/waiver form in the Chubb insurance contract PDF · release 5.1.0 · Staging
**Date:** 2026-09-03
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** `qa-artifacts/3-test-cases/AP2437_TestCases_*.md` — execution logs `execution-log_AP-2437_2026-09-03.md` (run 1) and `execution-log_AP-2437_2026-09-06.md` (run 2)

> **Bug IDs continue the project sequence.** BUG-001 to BUG-007 belong to the AP-2436
> cycle in `bug-report.md`; this report starts at BUG-008 so no ID is reused.

| Metric | Value |
|---|:---:|
| Total defects | 4 |
| Critical | 0 |
| High | 2 |
| Medium | 2 |
| Low | 0 |
| Tracker tickets created | 4 |

> **This report covers two runs.** BUG-008 and BUG-009 were found on 2026-09-03 by
> inspecting the four PDFs attached to AP-2437 — they are defects in the supplied
> documents, not in the code. BUG-010 and BUG-011 were found on 2026-09-06, once contracts
> could be created and the feature could actually be exercised, and they *are* application
> defects.
>
> **BUG-008 was escalated by the second run.** It began as an observation about the
> attachments; contract AVP000161 was then generated at a PM30 rate, the portal displayed
> "Commission (30%) — 267.39 $" on its own screen, and the form attached to the client's
> contract stated no percentage at all. The disclosure obligation is unmet in live
> generated output, not merely in a file on the ticket.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-008 | AP2437_014 | The two "30 %" acceptance/waiver forms disclose no remuneration percentage at all | High | P1 | [AP-2457](https://garantieavantageplus.atlassian.net/browse/AP-2457) | Open |
| BUG-009 | AP2437_013 | No acceptance/waiver form records that the client was informed before the sale concluded | Medium | P2 | [AP-2458](https://garantieavantageplus.atlassian.net/browse/AP-2458) | Open |
| BUG-010 | AP2437_016 | "Create Contract" fails silently: no contract, no error message, on three of six quotes | High | P1 | [AP-2464](https://garantieavantageplus.atlassian.net/browse/AP-2464) | Open |
| BUG-011 | AP2437_007 | Adding creditors insurance to a quote with no vehicle returns HTTP 500 | Medium | P2 | [AP-2465](https://garantieavantageplus.atlassian.net/browse/AP-2465) | Open |

---

## Bug Details

---

### BUG-008 — The two "30 %" acceptance/waiver forms disclose no remuneration percentage at all

| Field | Value |
|---|---|
| **Bug ID** | BUG-008 |
| **Test Case** | AP2437_014 |
| **Requirement** | REQ-004 / AC-7 — the form states the remuneration percentage applicable to the dealership |
| **Severity** | High |
| **Priority** | P1 |
| **Environment** | Chromium (Playwright) · Windows 11 · app version 5.1.0 · Staging. The defect is in the source documents and is environment-independent |
| **Tracker Ticket** | [AP-2457](https://garantieavantageplus.atlassian.net/browse/AP-2457) |
| **Status** | Open |
| **First found** | 2026-09-03 |
| **Reproducibility** | Always — it is a property of the attached files |

**Summary:**
The two acceptance/waiver forms attached to AP-2437 for the non-50 % branch —
`Formulaire d'acceptation ou de renonciation — Assurance crédit.pdf` and `Acceptance or
Waiver Form — Credit Insurance (30 %).pdf` — contain no remuneration percentage anywhere
on the page, so a client signing one is never told what the dealership earns on the sale.

**Steps to Reproduce:**

1. Open Jira ticket [AP-2437](https://garantieavantageplus.atlassian.net/browse/AP-2437) and download all four attached PDF forms.
2. Open `Acceptance or Waiver Form — Credit Insurance (50 %).pdf` and read section **1 — DOCUMENTATION PROVIDED TO THE CLIENT**. The second checkbox reads: *"I confirm that I have received the credit insurance product summary and that I was informed that, pursuant to section 431 of the Act respecting the distribution of financial products and services, the distributor's profit is fifty percent (50 %)."*
3. Now open `Acceptance or Waiver Form — Credit Insurance (30 %).pdf` and read the same section.
4. Repeat the comparison with the French pair: `Formulaire d'acceptation ou de renonciation — Assurance crédit (50 %).pdf` against `Formulaire d'acceptation ou de renonciation — Assurance crédit.pdf`.
5. Search each of the four documents for the characters "%", "30", "trente" and "thirty".

**Expected Result:**
Each of the four forms states the remuneration percentage that applies to its branch, so
that whichever form the system attaches, the client signs a document disclosing the
dealership's actual commission. The two files named for the 30 % tier should carry a
disclosure clause naming 30 %, mirroring the 50 % clause in their counterparts.

**Actual Result:**
Only the two 50 % forms carry a percentage. In both of them the disclosure reads "the
distributor's profit is fifty percent (50 %)" / "le profit du distributeur est de
cinquante pour cent (50 %)". In both 30 % forms **the entire article 431 disclosure
clause is absent** — the checkbox text simply ends at "I confirm that I have received the
credit insurance product summary." / "Je confirme avoir reçu le sommaire du produit
d'assurance-crédit." There is no 30 %, no other figure, and no blank space where a figure
could be written. Searching the two documents for "%", "30", "trente" and "thirty"
returns nothing in the body text.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2437/AP2437_014-step5-FormEN30NoPercentage_fail.png` — the English "30 %" form, whole page, with no percentage anywhere · uploaded to AP-2457 (attachment 13927) and shown inline in a comment |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2437/AP2437_014-step2-FormFR30Complete_pass.png` — the French "30 %" form, showing the truncated clause |
| Screenshot (comparison) | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2437/AP2437_014-step3-FormEN50Complete_pass.png` — the English 50 % form, showing the full clause the 30 % form is missing |
| Screenshot (comparison) | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2437/AP2437_013-step3-FormFR50Complete_pass.png` — the French 50 % form |
| Console log | None captured — the defect is in the documents, not in the application |

**Suggested Root Cause:**
The 30 % variants look as though they were produced by deleting the article 431 sentence
from the 50 % versions rather than by editing the figure within it. Note that the French
30 % file is not even named for a percentage — it is
`Formulaire d'acceptation ou de renonciation — Assurance crédit.pdf`, with no "(30 %)"
suffix — which is consistent with it having been authored as a generic form before the
two-tier requirement existed.

**Notes:**
Two things make this more serious than a document typo.

First, **the percentage cannot be corrected in code.** Test AP2437_014 established that
where a percentage does appear it is fixed printed text inside the PDF, not a form field
and not a placeholder the portal fills in. The portal has no way to supply the missing
figure at generation time, so the only fix is a corrected PDF re-attached to the ticket.

Second, **this branch is probably the common one.** If the rate rule reads the creditor
form code, the branch is taken by every contract whose rate does not contain "50" — which
on Dealer 1380's current configuration means every PM30 contract. The consequence is a
signed, legally binding document that omits precisely the disclosure AP-2437 exists to
capture, while looking to everyone involved like the obligation was met.

There is a third possibility the product owner should rule on rather than QA: that the
non-50 % tier is genuinely not required to disclose a percentage, and these files are
correct as written. If so, the ticket's AC-7 needs rewording, because it currently states
the requirement unconditionally.

---

### BUG-009 — No acceptance/waiver form records that the client was informed before the sale concluded

| Field | Value |
|---|---|
| **Bug ID** | BUG-009 |
| **Test Case** | AP2437_013 |
| **Requirement** | REQ-004 / AC-8 — the form carries the client's acknowledgement that this information was received **before the sale concluded** |
| **Severity** | Medium |
| **Priority** | P2 |
| **Environment** | Chromium (Playwright) · Windows 11 · app version 5.1.0 · Staging. Environment-independent |
| **Tracker Ticket** | [AP-2458](https://garantieavantageplus.atlassian.net/browse/AP-2458) |
| **Status** | Open |
| **First found** | 2026-09-03 |
| **Reproducibility** | Always — it is a property of the attached files |

**Summary:**
None of the four acceptance/waiver forms attached to AP-2437 contains a statement that
the client received the disclosure information before the sale was concluded; each offers
only a "DATE SIGNED" / "SIGNÉ LE" line, which records when the form was signed but
asserts nothing about the timing of the disclosure.

**Steps to Reproduce:**

1. Open Jira ticket [AP-2437](https://garantieavantageplus.atlassian.net/browse/AP-2437) and download all four attached PDF forms.
2. Open each form in turn and read all three sections — **1 Documentation provided to the client**, **2 Insurance products offered**, and **3 Signatures**.
3. Search each document for "avant la conclusion", "before the sale", "prior to", and "conclusion de la vente".

**Expected Result:**
Each form carries a statement the client signs to the effect that the listed information
was received *before the sale was concluded*, as AP-2437's description requires: *"reconnaît
avoir reçu ces informations avant la conclusion de la vente."* This is the element that
turns the form into evidence of timely disclosure rather than merely of disclosure.

**Actual Result:**
No such statement appears in any of the four forms. Section 1 confirms the client
*received* the documents, section 2 records the accept/waive choice per product, and
section 3 provides name and signature lines for the client, the co-buyer and the
representative, plus a single "DATE SIGNED" / "SIGNÉ LE" field. Searching for "avant la
conclusion", "before the sale", "prior to" and "conclusion de la vente" returns no match
in any document.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2437/AP2437_013-step3-FormFR50Complete_pass.png` — the French 50 % form, whole page including the full signature block · uploaded to AP-2458 (attachment 13931) and shown inline in a comment |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2437/AP2437_014-step3-FormEN50Complete_pass.png` — the English 50 % form, whole page |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2437/AP2437_013-step4-FormFR50Signatures_pass.png` — the signature block in detail |
| Console log | None captured — the defect is in the documents, not in the application |

**Suggested Root Cause:**
The forms were most likely drafted against the AMF's standard acceptance-or-waiver
structure, which covers *what* was disclosed and *what the client chose* but not *when*.
AP-2437's description adds the timing requirement on top of that standard, and it appears
not to have been carried into the documents.

**Notes:**
Severity is Medium rather than High because the requirement may be satisfied in practice
by the signature date: if the form is signed before the contract, the dated signature is
itself evidence of the sequence. Whether that is legally sufficient is a question for the
product owner and @lindquist1305, not for QA — which is exactly why it is worth recording
as a decision rather than leaving as a silent omission. Two outcomes are acceptable: a
sentence is added to the four forms, or AC-8 is closed with a written note that the
signature date satisfies it.

One related observation, not raised as a defect: the forms name the disclosure documents
slightly differently from the ticket. The ticket says **"Sommaire des protections"** where
the forms say *"le sommaire du produit d'assurance-crédit"*, and the ticket says
**"Parlons assurances"** where the forms say *« Parlons assurance »* in the singular.
These are very likely the same two documents under their official AMF names, but a
confirmation would let AP2437_012 assert the exact wording instead of accepting either.

---

### BUG-010 — "Create Contract" fails silently: no contract, no error message, on three of six quotes

| Field | Value |
|---|---|
| **Bug ID** | BUG-010 |
| **Test Case** | AP2437_016 (also blocks AP2437_008) |
| **Requirement** | REQ-001 — the acceptance/waiver form is inserted when a Chubb insurance contract is created. No error path is described in the story |
| **Severity** | High |
| **Priority** | P1 |
| **Environment** | Chromium (Playwright) · Windows 11 · app version 5.1.0 · Staging (v2staging) · Dealer `vinhle870@gmail.com`, Dealer ID 1380 |
| **Tracker Ticket** | [AP-2464](https://garantieavantageplus.atlassian.net/browse/AP-2464) |
| **Status** | Open |
| **First found** | 2026-09-06 |
| **Reproducibility** | **Always, on the affected quotes.** Failed on quotes 6257, 6245 and 6253 — each retried once, failing identically. Succeeded on quotes 6276, 6256 and 6254 |

**Summary:**
Clicking **"Create Contract"** on the Create Insurance Contract confirmation page returns
HTTP 200 and redirects to the quote details page with no success message, no error
message and no contract created, so a dealer completes the flow believing the client's
insurance contract exists when it does not.

**Steps to Reproduce:**

1. Sign in to the dealer portal at `https://v2staging.garantieavantageplus.ca/login` as `vinhle870@gmail.com` / `<password from the env source>` (Dealer ID 1380).
2. Open quote **6253** directly at `https://v2staging.garantieavantageplus.ca/quote/6253/details`. (Any of quotes 6253, 6245 or 6257 reproduces it. Quote rows on `/quotes` carry `data-href="/quote/{id}/details"` if you prefer to navigate by clicking.)
3. Click **"Add a financing"** to open `/quote/6253/financing` and fill in: Date of birth `1985-06-15`, Type **"Financing"**, Net amount financed including RDPRM `25000`, Residual `0`, Payment frequency **"Monthly"**, Term months `60`, Interest rate `6.99`, Financing company **"AutoCapital Canada 200-11, Church Street Toronto"**. Click **"Save"**. (Skip this step if the quote already shows a Financing panel.)
4. Back on `/quote/6253/details`, click **"Add creditors insurance"** to open `/quote/6253/insurance` and set: Language **"Français"**, Tax exempt **"No"**, Form **"Monthly Premium PM30"**, Life **"Decreasing"**, Life Term `60`, Life For **"Borrower"**. Leave Critical illness and Disability unset. Click **"Get Quote"** and wait — the call takes about 5 seconds.
5. Confirm the quote saved: the flash reads "Chubb insurance quote saved successfully" and the Creditors insurance panel now shows `Form: GC6201MQ`, `Rate table: PM30`, `Language: Français` and a `Commission (30%) 267.39$` row.
6. In that Creditors insurance panel, click **"Generate Contract"** to open `/quote/6253/insurance/create-contract`. The page repeats the coverage table and commission and offers a single **"Create Contract"** button.
7. Click **"Create Contract"** and wait for the redirect.
8. Open `https://v2staging.garantieavantageplus.ca/creditor-insurance-contracts` and look for a contract for quote 6253.

**Expected Result:**
The contract is created and the dealer is told so — as happens on the quotes where this
works: the browser returns to `/quote/{id}/details` with the green flash **"Chubb
insurance contract created successfully"**, a contract number is assigned (for example
`AVP000160`), the Creditors insurance panel stops offering "Generate Contract", and the
contract appears on `/creditor-insurance-contracts` with a **Download** action. If the
contract genuinely cannot be created, the dealer should be shown a clear message saying so.

**Actual Result:**
The browser returns to `/quote/6253/details` with **no flash message of any kind** — no
success, no error, no warning. The page looks exactly as it did before the click. No
contract number is assigned, nothing is added to `/creditor-insurance-contracts`, and the
only visible clue that anything went wrong is that the Creditors insurance panel still
offers **"Generate Contract"**. Clicking "Create Contract" a second time produces the same
silent non-result. The HTTP response is 200 throughout; nothing appears in the browser
console.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2437/AP2437_016-step5-CreateContractSilentFailure_fail.png` — the quote details page immediately after clicking "Create Contract": no message, and "Generate Contract" still offered |
| Execution log | `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2437_2026-09-06.md` — AP2437_016 and AP2437_008 |
| Console log | No console error was logged for the request; the response was HTTP 200 |

**Which quotes failed and which succeeded** — this is the fastest route to the cause:

| Quote | Client | Language | Rate table | Vehicle | Result |
|---|---|---|---|---|---|
| 6276 | Marie Tremblay | Français | PM50 | Ford Focus, VIN `1FAHP35NX8W239204` | **Succeeded** — AVP000160 |
| 6256 | sVinhle sdfsd | English | PM30 | Ford Focus, VIN `1FAHP35NX8W239204` | **Succeeded** — AVP000161 |
| 6254 | sdfs sdfds | English | PM50 | Ford Focus, VIN `1FAHP35NX8W239204` | **Succeeded** — AVP000162 |
| 6257 | vinh.00003 sdf | English | PM50 | Fiat 500, VIN `33333333` | **Failed silently** (twice) |
| 6245 | Vinh LeAVtage | Français | PM30 | Ford Focus, VIN `1FAHP35NX8W239204` | **Failed silently** |
| 6253 | Vinh test002 | Français | PM30 | Ford Focus, VIN `1FAHP35NX8W239204` | **Failed silently** (twice) |

**Suggested Root Cause:**
Unknown — for developer investigation. The pattern points at the Chubb `/contract` call
failing and the failure being swallowed rather than surfaced: the response is 200, the
redirect happens, and no record is written. **A server-side log for the three failing
attempts on quotes 6253, 6245 and 6257 should identify it in minutes**, and that is the
single most useful next step.

Two observations that may or may not be the cause, offered as leads rather than
conclusions. Both Français + PM30 attempts failed, which would make branch 3 of the
AP-2437 decision rule the trigger — but quote 6257 failed on English + PM50, so the branch
alone does not explain it. Quote 6257 also carries an invalid 8-character VIN
(`33333333`) where every success carries a valid 17-character VIN, so 6257 may be failing
for a different reason again.

**Notes:**
Two consequences worth separating.

The first is the silence itself, and it is the serious one. AP-2437 exists so that a
client signs a document disclosing the dealership's commission. A dealer who clicks
"Create Contract", sees no error and moves on has no contract, no disclosure and no
signal — and will only discover it if somebody later checks the contract list. Half the
quotes tried in this run behaved this way, so this is not an edge case. Whatever the
underlying cause turns out to be, **the failure needs to be visible to the dealer.**

The second is that this blocks testing. No contract could be created for the Français +
PM30 combination on either quote attempted, so branch 3 of the four-branch form-selection
rule is the one branch that remains unverified. Branches 1, 2 and 4 were confirmed
correct against live generated contracts.

This may also be the answer to an open question on AP-2437: the story never says what the
dealer should see when the Chubb API fails. If the Chubb call is what fails here, then the
answer today is "nothing visible happens".

---

### BUG-011 — Adding creditors insurance to a quote with no vehicle returns HTTP 500

| Field | Value |
|---|---|
| **Bug ID** | BUG-011 |
| **Test Case** | AP2437_007 |
| **Requirement** | REQ-001 — reaching the Chubb insurance contract flow. No error path is described in the story |
| **Severity** | Medium |
| **Priority** | P2 |
| **Environment** | Chromium (Playwright) · Windows 11 · app version 5.1.0 · Staging (v2staging) · Dealer `vinhle870@gmail.com`, Dealer ID 1380 |
| **Tracker Ticket** | [AP-2465](https://garantieavantageplus.atlassian.net/browse/AP-2465) |
| **Status** | Open |
| **First found** | 2026-09-06 |
| **Reproducibility** | Always on a quote with no vehicle. Reproduced with both Français and English, so it is not language-related |

**Summary:**
Clicking **"Get Quote"** on the Creditors Insurance Quote page for a quote that has no
vehicle attached returns HTTP 500 and the generic page "Erreur — Désolé, l'application
éprouve des difficultés techniques", instead of telling the dealer that a vehicle is
required.

**Steps to Reproduce:**

1. Sign in to the dealer portal at `https://v2staging.garantieavantageplus.ca/login` as `vinhle870@gmail.com` / `<password from the env source>` (Dealer ID 1380).
2. Open quote **6277** directly at `https://v2staging.garantieavantageplus.ca/quote/6277/details`. This quote has a client (John Smith) but **no vehicle** — its Vehicle panel is empty and the row on `/quotes` shows "-" in the Vehicle column. Any quote with no vehicle reproduces it.
3. Click **"Add a financing"** to open `/quote/6277/financing` and fill in: Date of birth `1985-06-15`, Type **"Financing"**, Net amount financed including RDPRM `25000`, Residual `0`, Payment frequency **"Monthly"**, Term months `60`, Interest rate `6.99`, Financing company **"AutoCapital Canada 200-11, Church Street Toronto"**. Click **"Save"**. (Skip this step if the quote already shows a Financing panel.)
4. Confirm financing saved — the flash reads "Financing saved" and **"Add creditors insurance"** now appears in the Creditors insurance panel.
5. Click **"Add creditors insurance"** to open `/quote/6277/insurance`, and set: Language **"English"**, Tax exempt **"No"**, Form **"Monthly Premium PM50"**, Life **"Decreasing"**, Life Term `60`, Life For **"Borrower"**. Leave Critical illness and Disability unset.
6. Click **"Get Quote"**.
7. Repeat steps 5 and 6 with Language set to **"Français"** to confirm the language makes no difference.

**Expected Result:**
Either the quote is priced normally, or — if a vehicle is genuinely required before
creditors insurance can be quoted — the dealer is shown a clear, specific message saying
a vehicle must be added first, with the page staying on the form so the values already
typed are not lost. The same flow on a quote that does have a vehicle (for example quote
6254, Ford Focus, VIN `1FAHP35NX8W239204`) prices the quote and shows the Creditors
insurance panel with `Rate table: PM50` and a commission row.

**Actual Result:**
The request returns **HTTP 500** and the browser shows the generic error page: the heading
**"Erreur"** and the text **"Désolé, l'application éprouve des difficultés techniques.
Veuillez recommencer une autre fois."** with an "Aller à l'accueil" link. Everything typed
into the form is lost. Nothing tells the dealer that the missing vehicle is the problem.
The same result occurs with Language "Français", so the language setting is not involved.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2437/AP2437_007-step2-GetQuote500Error_fail.png` — the generic "Erreur / difficultés techniques" page returned by "Get Quote" on quote 6277 |
| Execution log | `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2437_2026-09-06.md` — AP2437_007, step 2 |
| Console log | HTTP status 500 on the POST to `/quote/6277/insurance`; no specific message in the browser console |

**Suggested Root Cause:**
Unknown — for developer investigation. The rating call almost certainly needs vehicle
details (the Chubb request is built from the financed vehicle), and the code appears to
dereference the vehicle without checking that one exists. A guard plus a validation
message on the form would be the natural fix.

**Notes:**
This is Medium rather than High because a dealer would not normally quote creditors
insurance before adding the vehicle, and the workaround — add the vehicle first — is
obvious once you know. It matters for two reasons anyway. A new dealership working through
a quote in an unexpected order hits a crash rather than guidance, and loses whatever they
had typed. And it cost time during this test run: the first attempt to build an
English + 50 % contract was made on this quote, and the 500 initially looked as though the
English language setting might be the trigger. It took a second run with Français on the
same quote, and then a successful English contract on a quote that did have a vehicle, to
establish that the language had nothing to do with it.

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 2 | AP2437_014, AP2437_016 |
| Medium | 2 | AP2437_013, AP2437_007 |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-004 — Required content of the acceptance/waiver form | 2 | BUG-008, BUG-009 |
| REQ-001 — Automatic insertion / reaching the contract flow | 2 | BUG-010, BUG-011 |
| REQ-002 — First-page placement | 0 | Verified clean on 2026-09-06 — the form is an inserted page 1 ahead of an intact Chubb contract |
| REQ-003 — Four-branch form selection | 0 | Branches 1, 2 and 4 verified clean against live contracts. **Branch 3 is unverified** — blocked by BUG-010, not known to be broken |
| REQ-005 — Merged PDF validity | 0 | Verified clean — PDF 1.7, unencrypted, searchable, no Zend_Pdf error, generates in under 3 s |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Bug Reporter Skill
**Date:** 2026-09-03

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-008 | AP-2457 | Created | Backlog | 2026-09-03 |
| BUG-009 | AP-2458 | Created | Backlog | 2026-09-03 |
| BUG-010 | AP-2464 | Created, linked to AP-2437, screenshot attached and shown inline | Backlog | 2026-09-07 |
| BUG-011 | AP-2465 | Created, linked to AP-2437, screenshot attached and shown inline | Backlog | 2026-09-07 |
| — | AP-2437 (parent story) | Comment added — full testing status: FAIL verdict, 3 of 23 cases executed, both defects summarised, four outstanding questions restated | QC (unchanged) | 2026-09-04 |
