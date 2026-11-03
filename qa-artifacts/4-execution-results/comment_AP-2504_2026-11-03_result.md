h3. QA result — FAIL (2026-11-03)

*Environment:* Dev · *Run:* no-sprint · *Pass rate:* 81.8% (9 of 11; threshold 90%)
*Result:* 9 PASS · 1 FAIL · 1 BLOCKED · 0 SKIPPED

||TC ID||Title||Priority||Status||Bug||
|AP2504_001|GAP "Generate Contract" opens the GAP contract page in the same tab, not a pop-up|High|PASS|-|
|AP2504_002|"Generate Contract" from the Extended Warranty row opens the GAP page (AC 1 as written)|High|BLOCKED|- (Q-001)|
|AP2504_003|GAP page layout: vehicle, owner, financing left; Program Summary and button right|Medium|PASS|-|
|AP2504_004|Co-applicant on the quote adds a pre-filled "Co-owner information" section|High|PASS|-|
|AP2504_005|GAP page pre-filled with the quote's vehicle and owner values|High|PASS|-|
|AP2504_006|GAP page shows the quote's financing values and none can be changed|High|FAIL|AP-2538|
|AP2504_007|Submitting the GAP page creates the GAP contract|High|PASS|-|
|AP2504_008|Submitting with the owner's last name emptied does not end on an error page|Medium|PASS|-|
|AP2504_009|Quote with an existing GAP contract: row and address end on no error page|Medium|PASS|-|
|AP2504_010|Creditors "Generate Contract" opens the creditor contract page in the same tab|High|PASS|-|
|AP2504_011|Submitting the creditor page creates the creditor contract|High|PASS|-|

*Bugs:*
* AP-2538 — Financing information on the GAP and creditor contract pages shows FREQUENCY\_MONTHLY / TYPE\_FINANCING instead of "Monthly" / "Financing", and five labels stay in English on the French page (Medium, Backlog) — fails AC 3
* AP-2539 — GAP and creditor (Chubb) contract PDF links answer HTTP 500 on Dev (High, Backlog) — not caused by this story: the creditor PDF already failed on quote 6480 before it; related to AP-2519 and AP-2512
* AP-2540 — Reopening the GAP contract page of a quote that has a GAP contract redirects with "Creditor insurance already created", the wrong product (Low, Backlog)
* AP-2541 — The quote page shows the co-applicant's date of birth one day early (Low, Backlog) — found while testing, outside this story

*Open questions:*
* Q-001 (Blocking) — AC 1 has the dealer choose "Generate Contract" from "the Extended Warranty row actions" but expects the GAP page. Which row should open it — the GAP insurance row, the Extended Warranty row, or both? — Today the GAP insurance row's action opens {{/quote/\{id\}/insurance/create-contract/gap}} in the same tab; AP2504\_002 waits for the answer (asked in the comment above).
* Q-002 (Judgement) — On which points beyond the named sections must the GAP page match the Esthetic protection page? — Today its heading is "GAP insurance", with no financing-company picker and no embedded PDF preview.
* Q-003 (Judgement) — Which lines must the GAP and creditor "Program Summary" show? — Today GAP shows Form AVPG, Rate table TGGAP, Language, Tax exempt and a Gap / BORROWER / 60 months / premium / tax / total table; creditor shows Form GC6201MQ, PM30, premiums, Equivalent Single Premium and Commission.
* Q-004 (Judgement) — Without a co-applicant, should "Co-owner information" be absent or shown empty? — Today it is absent.
* Q-005 (Judgement) — What does "Financing information" contain, and is all of it read-only? — Today: company, creditor address, net amount financed, payment frequency, due type, financing type, loan term, residual value and interest rate, all plain text (read-only).
* Q-006 (Judgement) — Which vehicle, owner and co-owner fields may the dealer edit, and does an edit change the quote? — Today every vehicle, owner and co-owner field is editable.
* Q-007 (Judgement) — What are "valid form values"? — Today an emptied owner last name is refused by the server with "This value should not be blank." under the field, and nothing is created.
* Q-008 (Judgement) — What does "the current process" produce after a GAP submit? — Today the dealer lands on the quote with "Chubb insurance contract created successfully" and the contract number on the Gap row; no invoice is created (for GAP or creditor).
* Q-009 (Judgement) — Is the GAP contract PDF offered from the quote row, and is the creditor PDF's HTTP 500 known? — Today both rows offer a PDF link and both answer HTTP 500 (filed as AP-2539).
* Q-010 (Judgement) — Once a GAP contract exists, is "Generate Contract" still offered, and what does the address show? — Today the action is withdrawn and the address redirects to the quote, with the wrong-product message filed as AP-2540.
* Q-011 (Judgement) — Must the creditor page show the same columns, sections, pre-fill and read-only financing as GAP? — Today it does.
* Q-012 (Info) — How does a dealer add a co-applicant? — Answered by observation: the "Add co-applicant" link in the quote's Financing card.
* Q-013 (Info) — Does another {{create-contract/\{type\}}} address exist for creditor insurance? — Not checked; the creditor action uses {{/quote/\{id\}/insurance/create-contract}}.

Not moved to Ready for release: pass rate 81.8% (needs 90%); Q-001 (Blocking) unanswered — AC 1 (REQ-001) not judged; AC 3 fails (AP-2538).

Records left on Dev: quotes 6562–6566, co-applicant on quote 6563, GAP contract AVPG000064 (quote 6564), creditor contract AVP000171 (quote 6566).

Full report: qa-artifacts/5-testing-report/AP-2504\_test-report.md
