h3. QA result — FAIL · Dev · 2026-11-07

*5/10 passed (50%, needs 90%)* · 4 failed · 1 blocked

*Failed / blocked:*
* AP2505_001 — page opens in the same tab (AC 1 met); no "Program Summary" heading (AC 2) — AP-2553
* AP2505_002 — same without a GAP quote; "Product Summary", no "Program Summary" — AP-2553
* AP2505_003 — "Owner identification", no "Financing information" left, "Product Summary" right — AP-2553
* AP2505_004 — not run: which column holds "Vehicle identification" — Q-001
* AP2505_005 — financing not pre-filled (CASH, company "Choose") and editable — AP-2554
*Passed:* 006–010 (contract 2782 created on quote 6597; details and en/fr PDFs open; no second contract)

*Bugs:*
AP-2554 (High) — The roadside contract page does not pre-fill the quote's financing, lets the dealer change it, and saves the contract as "Cash" with no lender
AP-2553 (Medium) — The roadside contract page shows "Product Summary" and "Owner identification" and has no "Financing information" section in the left column
AP-2518 (High) — HTTP 500 / "Loading..." on the roadside contract page — not reproduced on Dev 2026-11-07 (comment 19512); closure left to the triager
*Questions:* [~accountid:557058:fd7f3bd0-545e-44ce-835d-ab014a39ed06] Q-001 — The description says "vehicle and owner information on the left", but AC 2 puts "Vehicle identification" in the right column. Which column should hold it?
*Question for the developer:* The roadside contract page pre-fills Home phone {{5145550501}} from the client record (the client form accepted it), and Generate Contract is then refused with 'One or more validation errors occurred.The phone number is invalid. Please ensure it follows the format: ###\-###\-####.' (quotes 6597, 6599, Dev 2026-11-07). With the phone typed as {{514-555-0501}} the same submit created contract 2782 on quote 6597 and saved the dashed phone back to the client. Should the page format the pre-filled phone, or should the client form require the ###\-###\-#### format? A dealer who keeps the pre-filled values cannot generate the contract.
*Also recorded, not judged — please confirm whether any is unintended:* a submit refused by validation still saved Stock number and In service date to the quote; contract 2782's details page shows Total Tax CAD 0 while both PDFs show Taxes 29.95; contract 2782 carries vehicleConditionCode "used" with purchaseState "New" and isNew 1; the French PDF viewer shows 5 pages while its footer reads "Page 1 de 8".

*Next:* Stays in QC — re-test after AP-2554 and AP-2553 are fixed and Q-001 is answered.
Not moved to Ready for release: pass rate 50% (needs 90%); AP-2554 (High) and AP-2518 (High, not reproduced) open; Q-001 (Blocking) unanswered.
