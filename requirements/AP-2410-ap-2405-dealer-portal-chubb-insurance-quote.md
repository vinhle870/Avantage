# AP-2410 — [AP-2405] Dealer portal - Chubb Insurance Quote - page, although fill all required options but still receive an error message when submit

**Spec ID:** AP-2410
**Source:** Jira [AP-2410](https://garantieavantageplus.atlassian.net/browse/AP-2410) — Project *Avantage Plus (AP)*, type Bug, priority High, status **QA**
**Reporter:** Vinh Le - QC · **Assignee:** Vinh Le - QC
**Created:** 2026-02-07 · **Last updated:** 2026-04-04
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description, acceptance criteria, 2 comments and 2 attachments.
**Parent:** None. Linked issue: *relates to* AP-2405 — Chubb financing insurance (Story, Done).

> Faithful transcription of AP-2410 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket.

## Original requirement text

> 1. Access to "Chubb Insurance Quote " Garantie Avantage Plus https://v2staging.garantieavantageplus.ca/quote/6167/insurance
> 2. Select required options
> 3. Click "Get Quote" button
>
> Actual result: Submit unsuccessfully with the error message
>
> Expected result: Submit successfully
>
> [image-20260207-163958.png]

## Acceptance criteria (verbatim)

None in the ticket. This is a bug: the steps to reproduce and the expected result above are
the requirement (bug re-test flow, `stlc-ticket-pipeline/routing.md` §4).

## Attachments

| File | Read? |
|---|---|
| image-20260207-163958.png (on the description, 2026-02-07) | No — listed only |
| image-20260329-142058.png (on the 2026-03-29 comment) | No — listed only |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-03-23 | Ken Nguyen | Asks QA to try PM50 or PM30, because "RT is not available right now". |
| 2026-03-29 | Vinh Le - QC | Reports the bug still happens and asks Ken Nguyen to double-check; attaches a screenshot. |

> 2026-11-01 — Captured while the ticket is in Jira status **QA**, which this project does
> not map to `ready_for_qa`. The run is design only (stops after s3b); the build may not
> contain the fix yet.

> 2026-11-01 — Attachments read (downloaded read-only from Jira for review R2 F-2). Both show
> `/quote/6167/insurance`, page "Insurance for Vinh Le", with a red banner:
> - **image-20260207-163958.png** — Rate table **RT50**, Language English, Tax exempt No, Life
>   Decreasing / (term empty) / Co borrower. Banner: `HTTP/2 400 returned for
>   "https://creditor-insurance-dev.ken-d1b.workers.dev/quote". - {"success":false,"response":"To
>   sign up for creditor program please contact Unity at 1 (888) 561-1101. \/ Pour s'inscrire au
>   programme de cr\u00e9ancier veuillez contacter Unit\u00e9 au 1 (888) 561-1101."} (HTTP 400)`
> - **image-20260329-142058.png** — Rate table **PM30**, Language English, Tax exempt Yes, Life
>   Residual Value Coverage / 12 / Borrower, Critical illness Decreasing / 12 / Co borrower,
>   Disability 30D_RETRO / 12 / Both. Banner: `HTTP/2 400 returned for
>   "https://creditor-insurance-dev.ken-d1b.workers.dev/quote". - {"success":false,"response":"Debtor
>   is -1 years old. Age of Debtor is not within the plan limits."} (HTTP 400)`
>
> The rate-table dropdown is labelled "Rate table*" in both screenshots.
