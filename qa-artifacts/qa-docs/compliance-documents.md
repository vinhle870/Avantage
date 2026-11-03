# Knowledge — AP-2436 Compliance-Document Send Feature

**Mapped:** 2026-08-29, Staging (v2staging), dealer `vinhle870@gmail.com` ("Test QA staging").
Verified live again 2026-10-02 (see [chubb-insurance.md](chubb-insurance.md) §0 for that
retest's findings — the send flow itself is documented here).

Base URL and credentials: [execute.env.md](../base-test/execute.env.md).

---

## Where the send button lives

Two entry points, both rendering the control as an `<a class="btn btn-dark">` — a styled
link, **not** an HTML `<button>`, so locate it by role `link`:

| Page | Route | Button href |
|---|---|---|
| Insurance Quick Quote | `/quick-insurance-quote` | `/compliance-documents/send?redirectUrl=/quick-insurance-quote` |
| Quote Details | `/quote/{id}/details` | `/compliance-documents/send?redirectUrl=/quote/{id}/details&clientEmail={email}` |

Labels: EN **"Send compliance documents"** · FR **"Envoyer les documents de comformité"**
(the misspelling is in the build and in the story — see the bug report before "fixing" it).

---

## The send form — modal *and* page

Clicking the button opens a **modal `dialog`** over the current page. Submitting it
navigates to the **full page** `/compliance-documents/send?...`, and that is where
validation errors are rendered. So the same form has two skins: modal on open, full page
after any submit.

Form prefix `compliance_document_send[...]`:

| Field | EN label | FR label |
|---|---|---|
| `clientName` | Client name* | Nom du client |
| `clientEmail` | Client email* | Courriel du client |
| submit | Send | Envoyer |

**Pre-fill:** opened from Quote Details, `clientEmail` arrives filled from the quote's
`?clientEmail=` parameter; `clientName` arrives **empty** even though the quote knows the
name. Opened from Insurance Quick Quote, both are empty.

**Validation** (server-side, both messages are English-only strings from the framework):

| Input | Message |
|---|---|
| Either field empty | `This value should not be blank.` |
| Malformed address (`client-at-example`, `client@`) | `This value is not a valid email address.` |
| `clientName` ≥ 256 characters | **HTTP 500** — no message. 255 succeeds, 256 fails |

**On success:** redirect to `redirectUrl` with an `alert` reading
**"Compliance documents have been sent."** and a Close button.

> **Dev — 2026-11-03 (AP-2502 run).** On Dev the form itself fails to load: `GET
> /compliance-documents/send?redirectUrl=…` returns **HTTP 500** (French error page "Erreur —
> Désolé, l'application éprouve des difficultés techniques…") for dealer 1380 with every
> creditor-form selection tried (GC6201 + GAP, GC960 only, both, none) and from both entry
> points; the modal stays on "Loading...". The Dev `/insurance-compliance-log`'s newest row is
> Log ID 24, Oct 2, 2026. Re-check before relying on a Dev send.
> Filed as **AP-2542** (Critical / Highest, 2026-11-03T05:11Z) — relates to AP-2452 (a
> different 500, on Send with a client name ≥ 256 characters, on Staging).

---

## What the client receives

Subject "Compliance documents", from `Systeme Avantage Plus <no-reply@garantieavantageplus.ca>`.
Body is **bilingual** — French then English — greeting `Bonjour {name},` / `Hello {name},`
and listing four documents. It does **not** match the copy in the story.

Six attachments, **both language variants every time**, so there is no language rule to test:

| File | Nature |
|---|---|
| `parlons-assurance-fr.pdf`, `parlons-assurance-en.pdf` | Generated per send by `pypdf`; carries a filled AcroForm |
| `waiver-form-30-fr.pdf`, `waiver-form-30-en.pdf` | Static blank template |
| `waiver-form-50-fr.pdf`, `waiver-form-50-en.pdf` | Static blank template |

**How to verify the pre-fill without opening a PDF by hand.** The generated Talk Insurance
PDFs expose their filled values as PDF form fields, readable straight from the raw bytes:

| AcroForm field | Value seen for this dealer |
|---|---|
| `AccountName` | `Test QA staging` |
| `AccountAddress` | `Address cccc QC 22222` |
| `InsurerName` | `Chubb du Canada compagnie d'assurance vie` (fr) / `Chubb Life Insurance Company of Canada` (en) |

Fetch the attachment and scan for `/V (…)` and `/T (…)`. The **product list** is in the
compressed page content, not a form field, so that part still needs a person.

---

## The two register surfaces

| Surface | Route | Columns | Contains |
|---|---|---|---|
| Global log | `/insurance-compliance-log` (FR "Journal d'envoi de documents de conformité") | Log ID, Client Name, Client Email, Sent At | **Every** send by this dealer |
| Per-quote section | "Compliance documents sent" on `/quote/{id}/details` | same four | Only sends made **from that quote** |

A send from Insurance Quick Quote has no quote context, so it appears in the global log
only. A send from Quote Details appears in both. An empty per-quote section renders
"No entities found".

Rows carry no link and no click handler on either surface — a past send cannot be reopened
or re-downloaded. Timestamps are **Eastern time (UTC−4)**: a send at 15:03 UTC logs as
11:03 AM. Rejected submissions create no row.

**There is no Avantage Plus (admin) view of either register.**
`/admin/insurance-compliance-log` is a 404 and no compliance route exists in the admin
navigation.
