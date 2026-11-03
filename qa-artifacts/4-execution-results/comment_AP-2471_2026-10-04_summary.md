[~accountid:5ae11c42b076312e0e25c600] *QA result for AP-2471 — FAIL — Not Ready for Release (2026-10-04)*

Tested: 15 test cases covering 8 requirements (menu, list page, create/edit form, earning points table, Pro-Rata / Rule of 78 / Reverse rule of 78 calculations, Custom factors, Save, Delete), on v2staging.
Result: 11 passed, 3 failed, 0 blocked, 1 skipped (73.3%; the test plan requires 90% and no open High bug).

What works:
* The menu, list page and form match the acceptance criteria.
* All three predefined calculations match the formulas exactly. The build correctly gives 0.4615 at Reverse month 8; the example table in the description shows 53.85%, which is a typo.
* The issue reported on 2026-09-24 is fixed: Custom monthly factors now save, and the cumulative factor recalculates live.

Bugs:
* AP-2485 (High): switching a 12-month curve back to Pro-Rata keeps the previous type's factors, and saves them, so a "Pro-Rata" curve can earn as Rule of 78.
* AP-2486 (Medium): saving a Custom curve with an empty monthly factor shows an HTTP 500 error page.

Blocked: None.
Skipped: Delete. There is no delete control on the list or the edit form, although the user story says "create, edit and delete". Is delete still in scope?

Open questions:
* Inverted odometer range, Custom total ≠ 100%, and negative factors all save without warning. Asked in the comment above.
* The "Save button" acceptance criterion is empty. What message and validation are expected?

Full report: qa-artifacts/5-testing-report/AP-2471_test-report.md
