# Domain Knowledge — Chubb Insurance

**Covers tickets:** AP-2400, AP-2405, AP-2431, AP-2436, AP-2437 (+ linked bugs)
**Last verified:** 2026-10-02 — confirmed end-to-end against **Staging** (v2staging),
dealer `vinhle870@gmail.com` / Dealer ID `1380`. See §5.

## 0. 2026-10-02 end-to-end verification — key findings

- **The AP-2437 blocker from 2026-09-04 ("No entities found" on
  `/creditor-insurance-contracts`) is gone.** The list now shows 3 real Chubb
  creditor-insurance contracts for Dealer 1380: `AVP000162` (PM50, English),
  `AVP000161` (PM30, English), `AVP000160` (PM50, Français) — linked to quotes
  6254, 6256, 6276 respectively.
- **Acceptance/waiver form merge is working.** Downloaded
  `/quote/{id}/chubb/insurance/contract-pdf` for all 3 — each is a ~2.8 MB,
  12-page PDF with the Acceptance/Waiver form as **page 1**, followed by the
  "Let's Talk Insurance!" fact sheet, the Chubb summary/Certificate of
  Insurance, and the Application to Enroll — i.e. AP-2437's requirement is
  implemented and shipping to staging.
- **AP-2457 reproduced live.** PM50 contract (`AVP000162`) page 1 states: *"I
  was informed that, pursuant to section 431 of the Act respecting the
  distribution of financial products and services, the distributor's profit is
  fifty percent (50 %)."* The PM30 contract (`AVP000161`) page 1 has **no
  equivalent sentence at all** — the paragraph is simply absent, not blank.
- **AP-2458 reproduced live.** On both forms, §3 Signatures has only a "DATE
  SIGNED" field — nothing states the disclosure happened *before* the sale was
  finalized.
- **No admin configuration sets the commission percentage (relevant to AP-2457).**
  Checked `/admin/dealer/1380/chubb-insurance` (only `creditorAccountNumber` text
  field + `creditorForm[]` multi-select — no numeric/percentage field),
  `/admin/dealer/1380/edit`, `/admin/dealer/1380/rate-client` (unrelated — a DYR
  client ID for the warranty rate system), and `/admin/insurance` (warranty
  approvals only). The 30%/50% split is determined purely by **which
  `creditorForm` code is assigned** (`PM30`, `PM50`, `S30`, `S45`, `M25`, `M30`,
  `GAP`); each code maps to its own **static PDF template**, and the commission
  sentence is hardcoded text inside that template. So AP-2457 is a **template
  content defect** (the PM30 template is missing the sentence the PM50 template
  has) — there is no config field anywhere that a fix could instead populate.
- **Compliance-document send flow (AP-2436) verified working.** From
  `/quote/6254/details`, clicked "Send compliance documents" (pre-filled
  `clientEmail=vinhle0002@yopmail.com` from the quote, `clientName` typed in),
  submitted → success alert *"Compliance documents have been sent."* → the
  quote's own "Compliance documents sent" table populated immediately → the
  Yopmail inbox received the "Compliance documents" email from Systeme
  Avantage Plus within seconds, matching the navigation map's documented
  behaviour (bilingual body, 6 attachments).

## 1. End-to-end flow

1. **Admin configures the dealer (AP-2400, Done).** On a dealer's detail page in the
   Admin portal, an "Chubb insurance" button opens a modal with:
   - **Chubb creditor account number** (text)
   - **Chubb creditor rate** (multi-select): `RT50`, `RT30`
   Saved values pre-populate the modal on reopen. A dealer cannot quote or see any
   Chubb feature below until this step is done.

2. **Dealer quotes Chubb insurance (AP-2405, Done).** On the quote edit page, once the
   dealer is Chubb-configured, an "Add insurance" button opens a modal: rate table
   (options come from the dealer's configured rates), language (`E`/`F`), tax exempt
   (Yes/No), and three coverage blocks — Life, Critical Illness, Disability — each with
   a type, term (numeric), and covered-person (`BORROWER`/`CO_BORROWER`/`BOTH`).
   Submitting calls the Chubb quote API (`POST /quote` to
   `creditor-insurance-dev.ken-d1b.workers.dev`) and displays returned premiums/tax per
   coverage code in a table. The request/response are persisted so reopening the form
   restores the last quote.
   - Related bug: **AP-2410** (High, status QA) — valid form submission still returns
     an error.

3. **Dealer portal lists contracts (AP-2431, Done).** Adds a "Contracts" menu with three
   sections, each showing an "account not configured" message if the dealer lacks that
   integration, and scoping visible contracts to "all dealer contracts" for account
   owners vs. "only contracts I created" for other users:
   - **Road Side Protection (Autoshield)** — datagrid (VIN, client name/phone, sale
     price, Autoshield contract ID) → Details.
   - **Creditor Insurance (Chubb)** — datagrid (Borrower, Loan terms, Coverage table,
     **Download PDF**).
   - **GAP Insurance (Chubb)** — same shape as Creditor Insurance.

4. **Compliance documents are sent to the client (AP-2436, Done — Phase 1).** A section
   at the top of the relevant interface lets an F&I advisor enter client name + email
   and click **"Envoyer"**. This auto-sends three documents: *Sommaire des
   protections*, *Parlons assurances*, and the commission-percentage disclosure. Each
   send is timestamped and logged in a registry visible to both Avantage+ and the
   dealer; the dealer also gets quick access to download the pre-filled PDFs.
   - Linked bugs: AP-2449 (commission disclosure sometimes missing, Backlog), AP-2450
     (no send-record for Avantage+ staff, Done), AP-2451 (admin can't reach Dealer
     Details, Done), AP-2452 (256+ char client name breaks it, Backlog), AP-2453 (no
     dealer-side download control, Backlog), AP-2454 (client province doesn't gate the
     feature, Backlog).

5. **Acceptance/waiver form merged into the contract PDF (AP-2437, in QC — Phase 2,
   "Finalisation du contrat").** When the insurance is sold and the contract is
   printed, the system must automatically merge an acceptance/waiver form into the
   client's signature packet. The form must confirm the client: received the
   *Sommaire des protections*; received *Parlons assurances*; was informed of the
   dealer's commission %; and acknowledges this happened **before** the sale closed.
   Signed copies must be scanned back to Avantage+ and stay accessible to the dealer
   for audit. Conservation/archiving method on the Avantage+ side was still an open
   question as of the ticket description (flagged to `@lindquist1305`).
   - Linked bugs: AP-2457 (High, Backlog) — the two "30%" acceptance/waiver PDFs omit
     the commission-percentage sentence entirely (present in the 50% forms); this is a
     defect in the attached PDF content, not fixable in code. AP-2458 (Medium,
     Backlog) — none of the 4 forms states disclosure happened *before* the sale
     closed, only a signature date. AP-2464 (High, Backlog) — "Create Contract" fails
     silently (no contract, no error message) on 3 of 6 quotes.
   - QA status as of 2026-09-04 (AP-2437 latest comment): blocked — no seeded Chubb
     creditor-insurance contract exists for Dealer 1380 on staging
     (`/creditor-insurance-contracts` shows "No entities found"), blocking 20 of 23
     written test cases. Also open: which of the 4 attached PDFs maps to which
     acceptance-criteria branch, what "the insurance table rate" and
     `quote_financing_insurance_chubb.language` are driven by, and whether `qpdf` is
     installed on staging/production.

## 2. Key vocabulary

| Term | Meaning |
|---|---|
| `PM50` / `PM30` (also seen as `RT50`/`RT30` in admin config) | Chubb rate-table tiers, tied to the dealer's configured commission percentage (50% / 30%) |
| `rateTable` | Selected option value from the insurance quote form's rate-table field, sent to the Chubb API |
| Account owner vs. other user | Account owners see all of the dealer's contracts; other users see only contracts they personally created |
| `formNo: GC6201` | Hardcoded form number sent in every Chubb quote API request |
| Acceptance/waiver form | The signed document proving the client was told about coverage summary, disclosure brochure, and commission %, before sale — merged into the final contract PDF (AP-2437) |

## 3. Known gaps / unconfirmed facts

- PDF-to-branch mapping for the 4 acceptance/waiver form variants is unconfirmed (QA
  matched by filename only).
- Source of "the insurance table rate" and of
  `quote_financing_insurance_chubb.language` is unknown.
- Whether `qpdf` (used to fix a malformed cross-reference stream before handing the
  Chubb PDF to FPDI) is installed on staging and is part of the production build is
  unconfirmed.
- Document retention/archival method on the Avantage+ side for signed acceptance forms
  was unresolved at last check.

## 5. UI/route reference — Chubb creditor insurance on a quote (mapped 2026-10-03)

Reached from `/quote/{id}/details` (no visible link when the Creditors insurance row has
nothing yet — navigate by URL) or, once a quote carries a Chubb quote, from the expanded
"Creditors insurance" row. Heading "Insurance for {client}".

**Form `quick_insurance_chubb`-shaped** (same field set as `/quick-insurance-quote` — see
§6 below): `language` (English/Français), `taxExempt`, `form` (`Monthly Premium PM30` /
`PM50`), then Life/Critical illness/Disability blocks (type, term, covered-person), each
optional except Life. Submitting ("Get Quote") shows a **"Chubb insurance quote saved
successfully"** flash and redirects to `/quote/{id}/details`, where the Creditors
insurance row shows the coverage table and a **Commission (30%/50%)** figure.

**`/quote/{id}/insurance/create-contract`** is reached by URL, not currently surfaced as a
link on `/quote/{id}/details` after a quote is saved — the "Generate Contract" link
documented in earlier execution logs was not found on this page as of this mapping; reach
it directly. Repeats the coverage table and commission, one **Create Contract** button.
Calls the Chubb `/contract` API (takes ~5s). Two known outcomes:

- **Success:** redirects to `/quote/{id}/details` with flash **"Chubb insurance contract
  created successfully"**, a contract number is assigned (e.g. `AVP000163`), and the row's
  Download link goes to `/quote/{id}/chubb/insurance/contract-pdf`.
- **Failure (stale quote):** an `alert`-role banner reading *"HTTP/2 400 returned for
  '.../contract'. - {"success":false,"response":"Contract date entered was at least 10 days
  older than the original quote date. Please requote in order to continue."}"* — this is a
  real, visible error, not a silent failure. **Search by `alert` role or the text "HTTP",
  not by guessing words like "error"/"success"** — this exact banner does not contain
  either of those words, and a narrower search will miss it (cost real time on 2026-10-03,
  led to a false "still silently failing" conclusion on AP-2464 before this was caught).

**Boilerplate, not a precondition:** the message "Please make sure you create the GAP
insurance first to include the GAP premium amount in the creditors insurance." appears on
*every* quote's Creditors insurance row regardless of outcome — including quotes with an
already-successful, downloadable contract. Do not treat it as a blocker or a diagnostic
lead.

## 6. Reading the dealer's Chubb configuration without admin access

The **Form\*** dropdown on `/quick-insurance-quote` is driven by the signed-in dealer's own
Chubb creditor form configuration, so its option values *are* the assigned codes:

```
GC6201MQ:PM30   "Monthly Premium PM30"   (selected by default)
GC6201MQ:PM50   "Monthly Premium PM50"
```

Both present ⇒ the dealer belongs to both the 30 % and the 50 % creditor form groups, which
is why both waiver forms arrive. This makes the configuration **readable** from the dealer
portal — enough to prove a precondition — but not **writable**. Only `PM30` and `PM50` have
been seen; the story also names `S30` and `M30`, which have not appeared anywhere.

> **Dev note — 2026-11-03 (AP-2502 s5).** The sentence above is superseded **on Dev**: the
> admin creditor-form list there now offers `GC960S:S30`, `GC960S:S45`, `GC960M:M25` and
> `GC960M:M30` (see the Dev block below). Not re-checked on Staging.

> **Dev — 2026-11-03 (AP-2502 run).** The admin multi-select `chubb_insurance[creditorForm][]`
> on `/admin/dealer/1380/chubb-insurance` offers nine options, in this order:
> `GC6201:PM30` "Creditor PM30" · `GC6201:PM50` "Creditor PM50" · `GC6201MQ:PM30` "Creditor
> Monthly PM30" · `GC6201MQ:PM50` "Creditor Monthly PM50" · `GC960S:S30` "Creditor (Commercial)
> S30" · `GC960S:S45` "Creditor (Commercial) S45" · `GC960M:M25` "Creditor Monthly (Commercial)
> M25" · `GC960M:M30` "Creditor Monthly (Commercial) M30" · `AVPG:TGGAP` "GAP". So the GC960
> ("960") forms exist on Dev. Dealer 1380's baseline there: account `AP0001`, selected
> `GC6201MQ:PM30`, `GC6201MQ:PM50`, `AVPG:TGGAP`. The page is a native multi-select (set it with
> a select-option call); **Save** redirects to `/admin/dealer/1380` and an empty selection is
> accepted without a message. The dealer Form drop-down then follows the assignment: GAP never
> appears in it; `GC960S:S30` appears as "Total Premium (Commercial) S30" when assigned with the
> GC6201 forms, but with `GC960S:S30` as the **only** form the drop-down had no options at all.

### `/quick-insurance-quote` — Creditors Insurance form

Prefix `quick_insurance_chubb[...]`. Heading "Creditors Insurance Quick Quote", tabs
**Creditors insurance** / **Gap Insurance** (`/quick-insurance-quote/gap`).

| Field | Values |
|---|---|
| `form` | `GC6201MQ:PM30`, `GC6201MQ:PM50` |
| `borrowerDOB`, `coBorrowerDOB` | date text — `1990-01-01` is accepted |
| `monthlyPayment`, `termMonths` | text |
| `residualAmount` | text, defaults to `0` |
| `lifeType` | `DECREASING`, `DECREASING_ACC`, `DECREASING_RESIDUAL`, `DECREASING_ACC_RESIDUAL` |
| `criticalIllnessType` | `DECREASING`, `DECREASING_RESIDUAL` |
| `disabilityType` | `30D_RETRO`, `30D_RETRO_6M`, `30D_RETRO_12M`, `30D_ELIM`, `30D_ELIM_6M`, `30D_ELIM_12M`, and the same six prefixed `ACC_` |
| `lifeTerm`, `criticalIllnessTerm`, `disabilityTerm` | text |

A working set: form `GC6201MQ:PM30`, DOB `1990-01-01`, monthlyPayment `500`, termMonths
`60`, residual `0`, each coverage type set with term `60`. **"Get Quote" renders the priced
result in place** — the URL stays `/quick-insurance-quote` and two result tables appear.
There is no separate insurance quote-details page.

The Gap tab takes a smaller set: borrowerDOB, coBorrowerDOB, monthlyPayment, termMonths,
residualAmount, `gapTerm`.

## 7. Sources

Derived from Jira: AP-2400, AP-2405, AP-2410, AP-2431, AP-2436, AP-2437, AP-2449
through AP-2454, AP-2457, AP-2458, AP-2464 (descriptions and comments), read via the
project's bound `tracker` capability (Jira CLI) on 2026-10-02. §0 was confirmed live
against Staging on 2026-10-02 via the project's bound `browser` capability
(Playwright), using Admin Portal `/admin/dealer/1380/chubb-insurance`, Dealer Portal
`/creditor-insurance-contracts` and `/quote/6254/details`, and the generated PDFs
downloaded from `/quote/{id}/chubb/insurance/contract-pdf` (saved to
`qa-artifacts/4-execution-results/screenshots/AP-2437_*`).
