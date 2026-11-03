# Baseline — Creating a Chubb creditor-insurance contract (AP-2437 precondition)

**Purpose:** the canonical record of how a Chubb creditor-insurance contract is created,
plus the register of contracts already created and what each run leaves behind.

> **This file is reference material for the test-case designer, not a step the executor
> follows.** A contract is *dynamic test data*: per `stlc-testcase-designer` SKILL.md
> Step 4 (*Static versus dynamic test data*), every test case that needs one creates it in
> its own `[Pre-Condition]` step, with the field values written into that step. No test
> case may satisfy a data prerequisite by pointing here. Keep this file in step with those
> steps — if the flow changes, the test cases change too.

**Verified end to end:** 2026-09-04, Staging (v2staging), dealer `vinhle870@gmail.com`,
Dealer ID `1380`. Produced contract **AVP000160** on quote **6276**.

> **This flow calls Chubb's live development API and creates a durable contract record.**
> It is not a read-only setup step. Each run leaves a permanent contract on shared
> staging that nothing in this project currently deletes — see *What it leaves behind*.

---

## 1. What you need before starting

| Fact | Value |
|---|---|
| Portal | Dealer — `https://v2staging.garantieavantageplus.ca/login` |
| Login | `vinhle870@gmail.com` / `<password from the env source>` (Dealer ID `1380`, province QC) |
| Viewport | 1280 × 800 |
| A quote with a client and a vehicle | Reuse an existing one from `/quotes`, or create via `/quote` → `/quote/new/client`. Quote **6276** (Marie Tremblay, Ford Focus 2008, vehicle 915) already carries a full contract as of 2026-09-04 |
| Chubb configuration | Dealer 1380, creditor account number `AP0001`, with Creditor Monthly PM30 and Creditor Monthly PM50 assigned. Already in place — do not change it |

**Reaching a quote:** rows in the `/quotes` list carry `data-href="/quote/{id}/details"`.
They are clickable, and reachable directly by URL. *(The navigation map's note that quote
rows cannot be opened under automation is out of date — corrected 2026-09-03.)*

---

## 2. The flow — four stages

Each stage must complete before the next becomes available. There is no shortcut: the
*Add creditors insurance* link does not appear until financing is saved, and *Generate
Contract* does not appear until the insurance quote is saved.

### Stage A — Add financing · `/quote/{id}/financing`

Reached from `/quote/{id}/details` → **"Add a financing"**.

| Field | Value used | Notes |
|---|---|---|
| Date of birth* | `1985-06-15` | Any adult date |
| Type* | **Financing** | Submits as `TYPE_FINANCING` |
| Net amount financed including RDPRM* | `25000` | |
| Residual* | `0` | |
| Payment frequency* | **Monthly** | Submits as `FREQUENCY_MONTHLY` |
| Term months* | `60` | |
| Interest rate* | `6.99` | |
| Financing company* | **AutoCapital Canada 200-11, Church Street Toronto** | Any entry works |

Click **Save** → redirects to `/quote/{id}/details` with the green flash
**"Financing saved"**. The Financing panel now shows the computed payment (494.91 $
monthly for the values above), and **"Add creditors insurance"** appears.

> If a GAP premium should be included in the creditors-insurance calculation, add GAP
> insurance *before* stage B — the details page says so explicitly. Not needed for AP-2437.

### Stage B — Add the creditors-insurance quote · `/quote/{id}/insurance`

Reached from `/quote/{id}/details` → **"Add creditors insurance"**.

**This is the screen that controls which acceptance/waiver form AP-2437 attaches.** Both
inputs in the AP-2437 decision rule are set here, by hand, from the dealer UI:

| Field | Options | Submitted value | AP-2437 relevance |
|---|---|---|---|
| **Language*** | English · Français | `E` · **`F`** | This *is* `quote_financing_insurance_chubb.language`. The submitted values are literally `E` and `F`, matching the acceptance criteria word for word |
| **Form*** | Monthly Premium PM30 · Monthly Premium PM50 | `GC6201MQ:PM30` · **`GC6201MQ:PM50`** | This *is* the "insurance table rate". The details page labels it **"Rate table: PM50"**. Only the PM50 value contains the characters "50" |
| Tax exempt* | Yes · No | `1` · `0` | Leave **No** |
| Life* | Decreasing · Decreasing Acc. | `DECREASING` | At least one coverage is required |
| Life Term* | `60` | | Match the financing term |
| Life For* | Borrower | `BORROWER` | |

Critical illness and Disability may be left unset — one coverage is enough to get a quote.

Click **Get Quote** → redirects to `/quote/{id}/details` with the flash **"Chubb insurance
quote saved successfully"**. The Creditors insurance panel now shows Form, **Rate table**,
Language, Tax exempt, the coverage table, the Equivalent Single Premium, and a
**Commission (50%)** row — 623.15 $ on the reference run.

> **Takes several seconds** — it calls Chubb's rating API. Allow at least 10 s and do not
> treat a slow response as a failure.

**To select each AP-2437 branch, set these two fields:**

| Branch | Language | Form | Expected form on page 1 |
|---|---|---|---|
| 1 | Français | Monthly Premium PM50 | French 50 % — **confirmed 2026-09-04** |
| 2 | English | Monthly Premium PM50 | English 50 % — not yet confirmed |
| 3 | Français | Monthly Premium PM30 | French 30 % — not yet confirmed |
| 4 | English | Monthly Premium PM30 | English 30 % — not yet confirmed |

### Stage C — Generate the contract · `/quote/{id}/insurance/create-contract`

Reached from `/quote/{id}/details` → **"Generate Contract"** in the Creditors insurance panel.

This link opens a **confirmation page**, it does not create anything by itself. The page
repeats Form, Rate table, Language, the coverage table and the commission, and carries a
single **"Create Contract"** submit button.

Click **Create Contract** → redirects to `/quote/{id}/details` with the flash **"Chubb
insurance contract created successfully"**. A contract number is assigned — `AVP000160`
on the reference run.

> **This is the durable, outward-facing step.** It calls Chubb's live `/contract` endpoint
> and writes a contract record. Also several seconds; allow at least 10 s.

### Stage D — Download the contract PDF · the subject of every AP-2437 test

`/creditor-insurance-contracts` now lists the contract. Its single action is
**"Download"**, pointing at:

```
/quote/{quoteId}/chubb/insurance/contract-pdf
```

Note the route is keyed on the **quote** id, not the contract number.

**Reference response, 2026-09-04, quote 6276:**

| Property | Value |
|---|---|
| HTTP status | 200 |
| Content-Type | `application/pdf` |
| Content-Disposition | `inline; filename=contrat.pdf` |
| Size | 2,868,256 bytes |
| PDF version | 1.7 |
| Encrypted | **No** — `/Encrypt` absent, so the `qpdf --decrypt` pre-pass ran and stripped it |
| Pages | 12 |
| Page 1 | The French 50 % acceptance/waiver form |
| Pages 2–12 | The Chubb contract, beginning with the AMF "PARLONS ASSURANCE !" sheet carrying contract number AVP000160 |
| Generation time | ~2.7 s |
| `Zend_Pdf` error | None |

Because `Content-Disposition` is **inline**, the browser renders the PDF in a tab rather
than downloading it to disk — so the executing agent reads page content from the rendered
viewer. Set a tall viewport (1100 × 1500) to capture a whole page in one screenshot.

---

## 3. What this baseline establishes

Facts confirmed by running it, which several AP-2437 open questions were waiting on:

| Question | Answer |
|---|---|
| Q-013 — the contract download route | `/quote/{quoteId}/chubb/insurance/contract-pdf`, via the **Download** action on `/creditor-insurance-contracts` |
| Q-002 — what is "the insurance table rate" | The **Form** dropdown on `/quote/{id}/insurance`, values `GC6201MQ:PM30` / `GC6201MQ:PM50`, displayed as **"Rate table"** on the details page |
| Q-003 — what sets `…chubb.language` | The **Language** dropdown on the same screen; values `E` and `F` |
| Q-005 — is `qpdf` installed on staging | **Yes** — the produced PDF has no `/Encrypt`, so the decrypt pre-pass ran. *Production remains unconfirmed* |
| Q-001 — branch-to-form mapping | **Branch 1 confirmed** by observation: Français + PM50 produces the French 50 % form. Branches 2, 3 and 4 still need running |

---

## 4. What it leaves behind

Each run of this baseline creates, and **nothing in this project removes**:

- a financing record on the quote,
- a Chubb insurance quote on the quote,
- a **Chubb contract** with its own number, visible to everyone using this dealership,
- a row on `/creditor-insurance-contracts`.

The `cleanup` knowledge source is `missing` on this project, so there is no teardown skill
to undo any of it. Two consequences worth planning around:

1. **Reuse before you create.** Once a contract exists for a given language/rate
   combination, later runs should reuse it rather than generating another. Record each
   contract created below.
2. **A new contract is needed per branch.** The language and rate are fixed at stage B, so
   testing all four branches means four contracts on four quotes.

### Contracts created so far

| Contract | Quote | Client | Language | Rate table | Created | Purpose |
|---|---|---|---|---|---|---|
| `AVP000160` | 6276 | Marie Tremblay | Français | PM50 | 2026-09-04 | Branch 1 — AP2437_001–005, 006, 011, 012 |
| `AVP000161` | 6256 | sVinhle sdfsd | English | PM30 | 2026-09-06 | Branch 4 — AP2437_009, 011 |
| `AVP000162` | 6254 | sdfs sdfds | English | PM50 | 2026-09-06 | Branch 2 — AP2437_007, 021 |
| *(none)* | 6245, 6253 | — | Français | PM30 | — | **Branch 3 could not be created** — Create Contract fails silently (BUG-010). Financing and insurance-quote records were left on both quotes |
| *(none)* | 6257, 6277 | — | — | — | — | 6257 failed silently at Create Contract; 6277 returns HTTP 500 at the insurance step (no vehicle — BUG-011). Records left behind on both |
| `AVP000170` | 6480 (**Dev**, v2dev) | Credito Chubbline-957 | Français | PM50 | 2026-11-02 | **Dev entry** — AP2494_006 (Contracts column). Created through Chubb's development API in about 10 s; the Dev contract screen's button is labelled "Generate Contract". The quote also carries a roadside product without contract and sale `AP2494-S-957`. Staging rows above are unchanged |

---

## 5. Known gaps in this baseline

- **Only branch 1 has a contract.** Branches 2, 3 and 4 need three more quotes taken
  through the same flow, with the Language and Form values from the stage B table.
- **Two contracts on the same dealership** are needed for `AP2437_021` (each contract
  carries its own client's data). Only one exists.
- **A second dealership login** is still missing, so the cross-dealership half of
  `AP2437_023` remains untestable. Unchanged since the AP-2436 cycle.
- **Stages B and C each exceed a 5-second automation timeout.** A tool that gives up at
  5 s will report a failure while the action actually succeeds. Verify by re-reading the
  page rather than trusting the timeout.
