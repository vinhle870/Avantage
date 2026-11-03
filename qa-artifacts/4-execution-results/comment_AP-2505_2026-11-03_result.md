h3. QA result — FAIL (2026-11-03)

*Environment:* Dev · *Run:* no-sprint · *Pass rate:* 0% (0 of 10; threshold 90%)
*Result:* 0 PASS · 2 FAIL · 8 BLOCKED · 0 SKIPPED

||TC ID||Title||Priority||Status||Bug||
|AP2505_001|On a quote with a GAP quote and a roadside product, "Generate Contract" opens the roadside contract page in the same tab, not a pop-up|High|FAIL|AP-2518|
|AP2505_002|On a quote with a roadside product but no GAP quote, the roadside contract page still opens as a full page at its address|Medium|FAIL|AP-2518|
|AP2505_003|The roadside contract page shows owner and financing on the left, and Program Summary with "Generate Contract" on the right|Medium|BLOCKED|AP-2518|
|AP2505_004|The roadside contract page shows "Vehicle identification" in the column the author confirms|Medium|BLOCKED|- (Q-001)|
|AP2505_005|The roadside contract page is pre-filled with the quote's vehicle, client and financing, and the financing cannot be changed|High|BLOCKED|AP-2518|
|AP2505_006|On a quote with no financing, the roadside contract page opens pre-filled with the vehicle and client|Medium|BLOCKED|AP-2518|
|AP2505_007|Clicking "Generate Contract" with the pre-filled values creates the roadside contract, shown on the quote and the contract list|High|BLOCKED|AP-2518|
|AP2505_008|The roadside contract created from the new page has a details page whose PDF opens|High|BLOCKED|AP-2518|
|AP2505_009|Submitting the roadside contract page with the owner's last name emptied gives no server error and no unnamed contract|Medium|BLOCKED|AP-2518|
|AP2505_010|After its roadside contract exists, the quote cannot make a second contract by reopening the page|Medium|BLOCKED|AP-2518|

What happened: on every quote built for this test (quotes 6568–6573), the Roadside Protection row's ⋯ → "Generate Contract" still opens a pop-up that stays on "Loading...", and {{/quote/\{id\}/road-side-protection-create-contract}} answers HTTP 500 with the French technical-error page, whether opened from the menu or by its address. AP2505_001 (step 3) and AP2505_002 (step 4) fail on it; the other cases need that page as a setup step and are blocked.

*Bugs:*
* AP-2518 — Opening the roadside "Generate Contract" page of a quote returns an HTTP 500 error page (High, Backlog) — existing bug, not new. New evidence added in comment 19464: the 500 also happens on six fresh VINs with no roadside contract, with and without a GAP quote and with and without financing, which rules out the "existing contracts on the same VIN" cause it suggested. Now linked to this story (relates to).

*Question for the developer — is AP-2505 deployed to Dev?* On Dev the Roadside row's "Generate Contract" link is still {{data-toggle="modal" data-target="#myModal"}}, while the GAP row's link on the same quote is a plain link to its own page. This ticket's development info shows 1 Bitbucket branch (last updated 2026-10-30) and no pull request. Is the change merged and deployed to Dev? QA will re-test with "AP-2505 --from s4" once it is.

*Open questions:*
* Q-001 (Blocking) — The description says "vehicle and owner information on the left", but AC 2 puts "Vehicle identification" in the right column. Which column should hold it? — Not observable today (the page does not open); AP2505_004 waits for the answer (asked in the comment above).
* Q-002 (Judgement) — Must the quote carry a GAP insurance quote for the roadside "Generate Contract" action to be offered? — Today the action is offered without a GAP quote (quote 6569).
* Q-003 (Judgement) — On which points must the roadside page match the Esthetic protection contract page? — Not observable today (HTTP 500).
* Q-004 (Judgement) — What should the Program Summary list for a roadside product? — Not observable today.
* Q-005 (Judgement) — Which vehicle and owner fields may the dealer edit on this page? — Not observable today.
* Q-006 (Judgement) — With no financing on the quote, what does "Financing information" show, and can the contract still be generated? — Not observable today; the roadside product itself saves without financing (quote 6570).
* Q-007 (Judgement) — Which "financing values" are meant (company, loan terms, or both), and are all read-only? — Not observable today.
* Q-008 (Judgement) — What are "valid form values", and what does the page show when one is emptied? — Not observable today.
* Q-009 (Judgement) — What does "the current process" produce after submit (landing page, message, invoice, PDF)? — Not observable today; no contract could be created.
* Q-010 (Judgement) — Once a roadside contract exists, is "Generate Contract" still offered, and what does the address show? — Not observable today.
* Q-011 (Info) — Is "quote-insurance-create-contract" the roadside route's internal name? — Not observable in the browser.
* Q-012 (Info) — Does this change also fix AP-2518, or is that fix expected separately? — Open; AP-2518 still occurs on Dev.

Not moved to Ready for release: pass rate 0% (needs 90%); AP-2518 (High, open) blocks AP2505_003, AP2505_005–AP2505_010; Q-001 (Blocking) unanswered — REQ-002 not judged.

Records left on Dev: vehicles 1130–1135 and quotes 6568–6573, each with a roadside product (CA$250.00) and no contract or invoice.

Full report: qa-artifacts/5-testing-report/AP-2505\_test-report.md
