# AP-2459 — [BUG-001][AP2446_001] Permaplate contract generation returns HTTP 500 when Financing company is left unselected

**Spec ID:** AP-2459
**Source:** Jira [AP-2459](https://garantieavantageplus.atlassian.net/browse/AP-2459) — Project *AP (Avantage Plus)*, type Bug, priority High, status **QA**
**Reporter:** Vinh Le - QC · **Assignee:** Vinh Le - QC
**Created:** 2026-09-06 · **Last updated:** 2026-09-08
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description, acceptance criteria, 1 comment and 3 attachments.
**Parent:** None (linked: *relates to* AP-2446 — Permaplate Invoice, Story, Done)

> Faithful transcription of AP-2459 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

> **2026-11-01 — redaction note.** Step 1 of the ticket's Steps to Reproduce contains a
> literal login and password. They are replaced below with a pointer to the `env`
> knowledge source (Dealer/Admin account of dealer 1380). No other text was changed.

---

## User story

Not stated in the ticket.

## Original requirement text

> ||Field||Value||
> |Bug ID|BUG-001|
> |Test Case|AP2446_001|
> |Requirement|REQ-004 — AP-2446, a Permaplate invoice is created when the contract is created|
> |Severity|*High* — a dealer who does not happen to pick a financing company cannot create a Permaplate contract at all, and the screen tells them nothing about why. Not Critical only because a workaround exists once someone knows it.|
> |Priority|P1|
> |Environment|Chromium via Playwright · Windows 11 · v2staging, Avantage Plus System v2.0.0|
> |First found|2026-09-06|
> |Reproducibility|*Always* — 2 of 2 attempts, on two different quotes with different option selections|
>
> h3. Summary
>
> Clicking "Generate Contract" on the Permaplate Contract form returns an HTTP 500 server error and a generic error page whenever the "Financing company" dropdown is left on its default "Choose" value, even though that field is not marked as required and every other field on the form is pre-filled correctly.
>
> h3. Steps to Reproduce
>
> # Sign in to the Admin portal at {{/admin/login}} as [login and password redacted — see the `env` source, Accounts table]
> # Open {{/admin/dealer/1380/permaplate/link}}, choose the product "*10 ans*" in the select box, and click "*Save*". The dealer's eligible-products table now lists "10 ans". _(Skip if it is already linked.)_
> # Sign in to the Dealer portal at {{/login}} with the same account.
> # Open {{/quote/new/client}} and create a client — First name {{Perma}}, Last name {{Repro}}, Email {{perma.repro.0906@yopmail.com}}, Address {{220 Boulevard Saint-Laurent}}, City {{Montreal}}, Province {{Québec}}, Postal code {{H2Y 1Z4}}, Phone (home) {{5145550200}}, Phone (work) {{5145550201}}, tick the policy-agreement checkbox — then click "*Save*". The browser lands on {{/quote/{id}/details}}. _(Both phone fields are required.)_
> # Open {{/quote/{id}/vehicle}}, select the vehicle whose VIN is {{1FAHP35NX8W239204}} (a 2008 Ford Focus), set Delivery date {{2026-09-06}} and Price {{25000}}, then click "*Save*".
> # Open {{/quote/{id}/permaplate}}, select the product radio "*10 ans*", tick the option "*Antirouille – Rust+Sound (combo)*", and click "*Save*".
> # Return to {{/quote/{id}/details}} and click "*Create Contract*", which opens {{/quote/{id}/permaplate-create-contract}}. Every field on this form is pre-filled from the quote.
> # Leave the "*Financing company*" dropdown on its default value "*Choose*" and change nothing else.
> # Click "*Generate Contract*".
>
> Steps 1 and 2 are a *prerequisite owned by AP-2447*, not part of AP-2446: without a Permaplate product linked to the dealer, the Permaplate button does not appear on the quote page at all. Everything from step 3 onward — the quote, the contract, the alert and the invoice — is *Dealer Portal only*, which is the whole of AP-2446's scope.
>
> h3. Expected Result
>
> Either the contract is created — because the field is optional, and the form's own markup says so ({{required = false}}) — or, if a financing company really is mandatory, the form refuses the submission with a message beside the field saying so. This is how the equivalent warranty form on the same product behaves: it rejects a bad submission with "This value should not be blank." next to the offending field.
>
> h3. Actual Result
>
> The request returns HTTP status 500. The page is replaced by a generic error screen reading _"Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois."_ No contract is created, no invoice is raised, and nothing on the screen indicates which field caused the problem. Selecting any financing company — "AutoCapital Canada" was used — and submitting the identical form immediately succeeds with HTTP 200 and the message "Permaplate contract generated successfully", which isolates the cause to this one field.
>
> h3. Suggested Root Cause
>
> Unknown — for developer investigation. The evidence points at the handler for {{permaplate_contract[financingCompany]}} reading a property of the selected financing company without first checking that one was chosen. The contract PDF renders a "SOCIÉTÉ DE FINANCEMENT (si applicable)" block containing the company's name and address, and the words _si applicable_ suggest the block is meant to be optional in the document — so the crash may be in building that block rather than in saving the contract.
>
> h3. Notes
>
> The field is genuinely optional in the markup, so a dealer has no way to know they must set it. A dealer selling Permaplate for cash, with no financing involved, is exactly the person who would leave it blank — and they are the one who cannot complete the sale.
>
> h3. Evidence
>
> First occurrence — quote 6284, "Financing company" left on "Choose":
>
> !AP2446_001-step3-GenerateContractHttp500_fail.png|thumbnail!
>
> Reproduction on a second quote (6285) with a different option — 2 of 2 attempts:
>
> !BUG-001-repro-Quote6285-Http500NoFinancingCompany_fail.png|thumbnail!
>
> The equivalent warranty form validating cleanly instead of crashing, for contrast:
>
> !AP2446_005-step2-WarrantyFormValidatesCleanly_skipped.png|thumbnail!
>
> Console log: one console error recorded at submit; the server returned a rendered error page rather than a stack trace, so no application detail was visible to the browser.
>
> ----
> Raised by the QA Agent STLC pipeline. Test case AP2446_001. Full record: {{qa-artifacts/5-testing-report/PERMAPLATE_bug-report.md}} → BUG-001

## Acceptance criteria (verbatim)

None in the ticket — it is a bug. The ticket's **Expected Result** section (above) is the
pass condition for the re-test: *"Either the contract is created … or, if a financing
company really is mandatory, the form refuses the submission with a message beside the
field saying so."*

## Attachments

| File | Read? |
|---|---|
| AP2446_001-step3-GenerateContractHttp500_fail.png | No — listed only |
| BUG-001-repro-Quote6285-Http500NoFinancingCompany_fail.png | No — listed only |
| AP2446_005-step2-WarrantyFormValidatesCleanly_skipped.png | No — listed only |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-09-06 | Vinh Le - QC | "QA evidence." — embeds the two HTTP 500 screenshots (quote 6284 and the 2-of-2 reproduction on quote 6285). |

> **2026-11-01 — context, not requirement.** The ticket carries no developer comment. On
> the related story AP-2446, Ken Nguyen asked on 2026-09-08 for a re-test "now that
> AP-2459, AP-2460 and AP-2461 are fixed", and the AP-2446 re-test on 2026-09-13
> (`qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2446_2026-09-13.md`) recorded
> the blank-Financing-company submission succeeding with the alert "Esthetic protection
> contract generated successfully". The ticket itself is still in status **QA**, which
> this project does not map to `ready_for_qa`, so this run designs the re-test only.
