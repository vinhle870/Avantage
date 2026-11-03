# AP-2225 — Dealer Area: AutoShield create contract

**Spec ID:** AP-2225
**Source:** Jira [AP-2225](https://garantieavantageplus.atlassian.net/browse/AP-2225) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee:** Ken Nguyen
**Created:** 2025-04-01 · **Last updated:** 2026-07-05
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description, 10 comments and 3 attachments. The ticket has no separate acceptance-criteria field; the Given/When/Then blocks in the description are the acceptance criteria.
**Parent:** None
**Sprint / fix version:** No sprint. Fix version **3.0.0** (released 2025-04-29) — run folder `3.0.0`.
**Linked issues:** Is tested by AP-2259 – AP-2265 (seven Xray Test issues, all Backlog). Tests AP-2258 — "[AP-2225] - AutoShield Contract - After click on Generate Contract button, The Quote Dashboard is shown with Error message on the top instead of redirected autoShield contract page and pdf file to be generated" (Bug, Highest, Done — closed by the QA on 2025-06-25: "this bug no longer occurs"). Referenced in the description: AP-2188 (autoShield quote), AP-2226 (financing company autoshieldLenderID field). Referenced in a comment: AP-2242 (bug that blocked Save/Submit on 2025-05-13).

> Faithful transcription of AP-2225 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket.

## Original requirement text

> The auto shield API allows the dealer to create a contract. After receiving a autoshield-quote ([AP-2188](https://garantieavantageplus.atlassian.net/browse/AP-2188)), the dealer can enter additional info and create a contract using the autoShield API.

## Acceptance criteria (verbatim)

> ### Given
>
> A dealer user has created a vehicle’s quote
>
> ### When
>
> The user is on the quote > ‘Road side protection’ page.
>
> ### Then
>
> The autoShield-quote is created ([AP-2188](https://garantieavantageplus.atlassian.net/browse/AP-2188)) with a list of products available and it’s pricing
>
> There is a list of fields for Vehicle and Client info that is prepopulated with the quote data
>
> There is a button 'Generate Contract'
>
> french: 'Générer le contrat'
>
> *(image: image-20250401-151044.png)*
>
> ### When
>
> The user clicks on the 'Save' button
>
> ### Then
>
> The autoShield, vehicle, client data is saved in the autoShield quote (separate from the vehicle’s quote)
>
> ### When
>
> The user clicks on the 'Generate Contract' button
>
> ### Then
>
> 1. The backend app
>    1. calls [autoshield login API](https://lively-firefly-110249-1.postman.co/workspace/Team-Workspace~00352935-a02d-4b3d-8876-9aa66976cc39/request/14512310-7b8fef70-51e4-4618-af2f-4de6a83a6a1c?action=share&source=copy-link&creator=14512310&ctx=documentation) with the username and password
>    2. get the selected financing company and check for the financing company’s autoshieldLenderID field ([AP-2226](https://garantieavantageplus.atlassian.net/browse/AP-2226))
>       1. If it’s empty, call [create lender API](https://lively-firefly-110249-1.postman.co/workspace/Team-Workspace~00352935-a02d-4b3d-8876-9aa66976cc39/request/14512310-23e96e05-065c-4ccb-80e3-fd3a63babf86?action=share&source=copy-link&creator=14512310&ctx=documentation), then store the returned lender ID
>    3. creates the contract VIA autoshield API using the [create contract rest API](https://lively-firefly-110249-1.postman.co/workspace/Team-Workspace~00352935-a02d-4b3d-8876-9aa66976cc39/request/14512310-91242308-4aba-4ca1-ad0c-41cb1feffd1e?action=share&source=copy-link&creator=14512310&ctx=documentation), using the lenderId field for financing company’s autoshieldLenderID field
> 2. The user is redirected to the autoShield contract page
>    1. Data is retrieved from the [get contract rest API](https://lively-firefly-110249-1.postman.co/workspace/Team-Workspace~00352935-a02d-4b3d-8876-9aa66976cc39/request/14512310-2922d62e-6a40-442d-bad6-520841e58f94?action=share&source=copy-link&creator=14512310&ctx=documentation)
>    2. user can see the following info:
>       1. autoshield contract ID
>       2. fields form the rest API response:
>          1. `appNumber`
>          2. `statusCode`
>          3. `effectiveDate`
>          4. `expiryDate`
>          5. `termInMonths`
>          6. `tier`
>          7. `product.name`
>          8. `client`
>          9. `vehicle`
>          10. `coverageKm`
>          11. `provincialSalesTax`
>          12. `gstHst`
>          13. `totalTaxCAD`
>          14. `salePriceWithTaxCAD`
>          15. `deductible`
>          16. `surcharges`
>          17. `isPayed`
>       3. the PDF link retrieved from the [get contract rest API](https://lively-firefly-110249-1.postman.co/workspace/Team-Workspace~00352935-a02d-4b3d-8876-9aa66976cc39/request/14512310-2922d62e-6a40-442d-bad6-520841e58f94?action=share&source=copy-link&creator=14512310&ctx=documentation) response in the field `documentationAggregate.url`

## Attachments

| File | Read? |
|---|---|
| image-20250401-151044.png (embedded in the description — mock-up of the Road side protection page) | No — listed only |
| image-20250416-093456.png (Minh Lưu comment, 2025-04-16 — "Purchase type") | No — listed only |
| image-20250416-093633.png (Minh Lưu comment, 2025-04-16 — get contract API error) | No — listed only |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2025-04-01 | Ken Nguyen | Asks Minh Lưu to work on the ticket next. |
| 2025-04-12 | Minh Lưu | Asks for the mapping of the contract form's vehicle fields (VIN, Stock Number, Condition, Odometer Reading, Purchase Price, In Service Date, Purchase Date, Delivery Date, Classification Date, Purchase Type, Financed Amount, Interest Rate, Sale Price (CAD), Financing Company) to quote data. |
| 2025-04-14 | Ken Nguyen | Gives the field mapping and says "These are the default values that can be overridden by the user when filling out the form" — see the mapping table below. |
| 2025-04-16 | Minh Lưu | Asks whether Purchase Type really comes from the delivery date ("Is there any mistake?") and reports an error calling the get contract API (two screenshots). No written answer to the Purchase Type question follows. |
| 2025-04-16 | Ken Nguyen | Posts working example requests/responses for the AutoShield test API: Get Quote (pricing info for dealer 81 and a VIN — products with tier prices and enhancements), Create Contract (returns contract id 1172) and Get Contract (contract 1172 with client, vehicle, product, taxes, surcharges, `isPayed`). Credentials and tokens in the comment are not transcribed here. |
| 2025-04-22 | Ken Nguyen | Has change requests on the PR. |
| 2025-04-22 | Minh Lưu | Updated the PR. "We cannot use the PDF link directly, as it will automatically download (I believe the 'Content-Disposition' header is set to 'attachment')". |
| 2025-05-13 | Vinh Le - QC | Ticket blocked by bug AP-2242 — also happens when clicking Submit or Save. |
| 2025-05-14 | Ken Nguyen | "you should be good to QA this now". |
| 2025-05-15 | Vinh Le - QC | Reports blocker bug AP-2258 (Generate Contract shows the Quote Dashboard with an error instead of the contract page and PDF). AP-2258 has since been closed as Done (2025-06-25, "this bug no longer occurs"). |

### Field mapping stated by Ken Nguyen, 2025-04-14 (verbatim)

> VIN: QuoteVehicle->getVIN()
> Stock Number: QuoteVehicle->getStockNumber()
> Condition: QuoteVehicle->getCondition()
> Oodometer Reading: **Vehicle’s current mileage**
> Purchase Price: **Vehicle’s sale price**
> In Service Date **Delivery date or today if empty**
> Purchase Date **Delivery date or today if empty**
> Delivery Date: QuoteVehicle->getDeliveredAt()
> Classification Date [ **Empty]**
> Purchase Type **Delivery date**
> Financed Amount **Financing amount or Vehicle sale price if empty**
> Interest Rate: QuoteFinancing->getInterestRate()
> Sale Price (CAD): QuoteVehicle->getPrice()
> Financing Company: QuoteFinancing->getInterestRate()->getFinancingCompany()
>
> These are the default values that can be overridden by the user when filling out the form
