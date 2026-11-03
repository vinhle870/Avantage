# AP-2463 — [BUG-005][AP2443_003] Permaplate contract list shows the client work phone while the quote page shows the home phone

**Spec ID:** AP-2463
**Source:** Jira [AP-2463](https://garantieavantageplus.atlassian.net/browse/AP-2463) — Project *Avantage Plus (AP)*, type Bug, priority Low, status **QC**
**Reporter:** Vinh Le - QC · **Assignee:** Vinh Le - QC
**Created:** 2026-09-06 · **Last updated:** 2026-09-25
**Captured on:** 2026-10-04 by stlc-ticket-pipeline from the description, 4 comments and 1 attachment.
**Parent:** None — Relates to AP-2443 (Permaplate contract list, dealer)
**Sprint / fix version:** None in the ticket — run folder `5.1.0`, the folder of the Permaplate run that raised the bug (2026-09-06).
**History:** Fixed by Minh Lưu (In Progress 2026-09-10 → PR opened 2026-09-11); Deploy to staging → QC on 2026-09-21; assigned to QA 2026-09-25.

> Faithful transcription of AP-2463 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket — it is a bug report. Its steps to reproduce are the requirement.

## Original requirement text

> **Summary.** The "Client phone" column on the dealer's Permaplate contracts list shows the client's work number, while the quote details page and the contract PDF's "Phone (res.)" field show their home number. A dealer comparing the two screens sees two different numbers for the same client with nothing saying which is which.
>
> **Severity:** Low · **Reproducibility:** Always — the same choice is made on the dealer list and the admin list · **Environment:** Chromium via Playwright · Windows 11 · v2staging, Avantage Plus System v2.0.0 · **Test case:** AP2443_003 · **Requirement:** REQ-005 — criterion 6, the "Client phone" column.
>
> **Steps to Reproduce**
> 1. Sign in to the Admin portal at /admin/login, open /admin/dealer/1380/permaplate/link, choose "10 ans" and click "Save". (Skip if it is already linked.)
> 2. Sign in to the Dealer portal at /login with the same account.
> 3. Open /quote/new/client and create a client whose two phone numbers differ — First name Perma, Last name Testclient, Email perma.test.0906@yopmail.com, Address 100 Rue Principale, City Montreal, Province Québec, Postal code H2X 1Y4, Phone (home) 5145550100, Phone (work) 5145550101, tick the policy-agreement checkbox — then click "Save".
> 4. Open /quote/{id}/vehicle, select the vehicle whose VIN is 1FAHP35NX8W239204, set Delivery date 2026-09-06 and Price 25000, then click "Save".
> 5. Open /quote/{id}/permaplate, select the product radio "10 ans", tick "Peinture – Céramique + Graphene", and click "Save".
> 6. Open /quote/{id}/details, click "Create Contract", select any "Financing company", and click "Generate Contract".
> 7. Open Contracts → Permaplate at /permaplate-contracts and read the "Client phone" column on that contract's row. Record the number.
> 8. Return to /quote/{id}/details and read the phone number shown in the Client section. Compare it with the number from step 7.
> 9. For a third view, open the admin list at /admin/permaplate-contracts and read the phone in the Client column, and download the contract PDF to read its "Phone (res.)" and "Phone (cell.)" fields.
>
> **Expected Result.** The number shown is the same one the rest of the product treats as the client's main contact number, or the column heading says which number it is — for example "Client phone (work)". Criterion 6 asks only for "Client phone" and does not say which, so either behaviour could be defended; what should not happen is two screens disagreeing silently.
>
> **Actual Result.** The Permaplate list shows 5145550101, the work number. The quote details page shows 5145550100, the home number. The admin Permaplate contract list also shows 5145550101. The contract PDF shows both, correctly labelled "Phone (res.)" and "Phone (cell.)".
>
> **Suggested Root Cause.** Unknown — most likely the list reads telWork where the quote page reads telHome.
>
> **Notes.** Raised as a question as much as a defect. If showing the work number is deliberate, the answer is to label the column, not to change the data. Either way it should be decided once and applied to both the dealer and admin lists together.

## Acceptance criteria (verbatim)

None in the ticket's acceptance-criteria field. The agreed fix is stated in Ken Nguyen's comment of 2026-09-10 (below), which this re-test treats as the expected behaviour:

> let's list both. Under that column, the template should be
> Cell: xxx-xxx-xxxx
> Home: xxx-xxx-xxxx

## Attachments

| File | Read? |
|---|---|
| AP2443_002-step3-DealerListAllFiveColumns_pass.png | No — listed only (original evidence) |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-09-06 | Vinh Le - QC | QA evidence: the column shows 5145550101 (work) while the quote page shows 5145550100 (home). |
| 2026-09-08 | Ken Nguyen | Asks the developer to check; notes the Permaplate program is renamed "ESTHETIC PROTECTION" / "Protection esthétique". |
| 2026-09-10 | Minh Lưu | Explains the list shows ownerPhoneCell ?: ownerPhoneRes (snapshotted on the contract), the quote page reads the live home number; asks which number to show. |
| 2026-09-10 | Ken Nguyen | Decision: list both, as "Cell: xxx-xxx-xxxx" and "Home: xxx-xxx-xxxx" under the column. |
