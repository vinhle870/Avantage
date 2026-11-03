# AP-2486 — [BUG-002][AP2471_014] — Saving a Custom earning curve with an empty monthly factor shows an HTTP 500 error page

**Spec ID:** AP-2486
**Source:** Jira [AP-2486](https://garantieavantageplus.atlassian.net/browse/AP-2486) — Project *Avantage Plus (AP)*, type Bug, priority Medium, status **QC**
**Reporter:** Vinh Le - QC · **Assignee:** Vinh Le - QC
**Created:** 2026-10-03 · **Last updated:** 2026-10-30
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description, 2 comments and 1 attachment. The ticket has no separate acceptance-criteria field.
**Parent:** None
**Sprint / fix version:** None in the ticket, and the registry has no `default_run_folder` — run folder `no-sprint` used by the pipeline (fixed for this batch run).
**Linked issues:** Relates to AP-2471 — Admin: Earning Curve management (Story, QC).

> Faithful transcription of AP-2486 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket. This is a bug ticket: its steps to reproduce are its requirement.

## Original requirement text

> | Field | Value |
> |---|---|
> | **Test Case** | AP2471_014 |
> | **Requirement** | REQ-006 / REQ-007 — Custom type monthly factors (Numeric Input field, float with 4 decimals) and saving a curve |
> | **Severity** | Medium — the admin hits a generic French "technical difficulties" page instead of a message telling them which box to fill in. The curve is not damaged (nothing is written), and filling the box works around it. |
> | **Priority** | P2 |
> | **Environment** | Chromium (Playwright) · Windows 11 · v2staging, Avantage Plus System v2.0.0 |
> | **First found** | 2026-10-04 |
> | **Reproducibility** | Always (4/4 attempts: 2 during execution, 2 when re-verified on 2026-10-04) |
>
> ### Summary
>
> On an earning curve's edit page with type "Custom", clicking "Save" while one Monthly Factor box is empty returns an HTTP 500 error page ("Erreur — Désolé, l'application éprouve des difficultés techniques") instead of a validation message or a successful save.
>
> ### Steps to Reproduce
>
> 1. Open https://v2staging.garantieavantageplus.ca/admin/login and sign in with an admin account (Courriel / Mot de passe, then click "Se connecter").
> 2. Go to /admin/earning-curve and click "Create New". Enter Name `Custom-500-repro`, Term month `4` (press Tab; the table shows 4 rows), Coverage odometer from `0`, Coverage odometer to `60000`, and select Earning curve type "Custom". Type Monthly Factors `0.4000`, `0.3000`, `0.2000` and `0.1000` into rows 1–4, then click "Save". The list shows "Earning curve saved".
> 3. In the list, click the Edit (pencil) button on the `Custom-500-repro` row. The page "Earning curve #{id}" opens at `/admin/earning-curve/{id}/edit`.
> 4. Click into the row 4 Monthly Factor box, delete its value so the box is **empty**, and press Tab. The Cumulative Factor column recalculates as if the box were 0, and no request is sent.
> 5. Click "Save".
>
> ### Expected Result
>
> Either the form refuses to save and shows a message on the empty Monthly Factor box (as it already does for a blank Name: "This value should not be blank."), or, if an empty factor is allowed, the curve saves. The ticket's acceptance criteria do not say whether a Custom factor is required, but either behaviour is acceptable. A server error is not.
>
> ### Actual Result
>
> The Save request (`POST /admin/earning-curve/{id}/edit`) returns **HTTP 500**, and the browser shows the error page "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." with an "Aller à l'accueil" button. Reopening the curve shows the previously saved factors unchanged, so nothing was written. The Monthly Factor input has an HTML `required` attribute, but the form submits anyway.
>
> ### Suggested Root Cause
>
> The server-side form handling probably casts each `points[N][monthlyFactor]` value to a float, or computes the cumulative sum, without a NotBlank/Type constraint, so an empty string throws an unhandled exception. Unknown — for developer investigation.
>
> ### Notes
>
> - Found on curve #12 (`QA-AP2471-Neg-Custom90-0043`) during the QA run. The steps above recreate it from scratch.
> - First seen when typing `abc`, which the number box rejects, leaving it empty. Re-verified on 2026-10-04 by simply clearing the box, with the same result. The error comes from the **Save** request, not from leaving the box: tabbing out sends nothing to the server.
> - Related open question to the reporter (AP-2471 comment 19344, 2026-10-04): whether Custom factors must total 100% and whether negative factors are allowed.
>
> ### Evidence
>
> HTTP 500 error page shown after clearing a Custom Monthly Factor box and clicking Save.
>
> [attachment] Source: QA record `qa-artifacts/5-testing-report/AP-2471_bug-report.md` → BUG-002 (QA run for AP-2471, 2026-10-04).

## Acceptance criteria (verbatim)

None in the ticket. For a bug re-test the **Expected Result** above is the pass condition: either a field message on the empty Monthly Factor box with nothing saved, or a successful save — and never a server error.

## Attachments

| File | Read? |
|---|---|
| BUG-002-verify-cleared-factor-save.png | No — listed only (the evidence screenshot of the original HTTP 500 page) |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-10-28 | Ken Nguyen | Asks Minh Lưu to work on this ticket next. |
| 2026-10-29 | Minh Lưu | Reports two open points on the fix: negative factors are still accepted (the AP-2471 question on negatives and a 100% total is unanswered, so they were not blocked), and a ±1000 bound was added so a Monthly Factor and the running total of up to 999 rows cannot overflow the decimal(10,4) columns — only that bound needs changing once the real rule is decided. |

> **Scope note (2026-11-01, stlc-ticket-pipeline):** the developer's comment is the only
> description of the fix. It names a new ±1000 bound on Monthly Factor values but does not
> say whether the bound is inclusive or which message it shows, so the re-test does not
> assert the bound. Negative factors are explicitly still accepted and are out of scope for
> this re-test (the open question belongs to AP-2471).
