# Run Summary — AP-2502: separate compliance document PDF for GC960 and 6201
Updated: 2026-11-07T11:05:42Z · Run folder: no-sprint · Stages run: Gate B probe only (worker --from execute --until correct-cases; s4 not executed); intake → review-cases re-checked earlier today; execution figures below are from the 2026-11-03 run · Run status: stopped · Environment: Dev

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2502: separate compliance document PDF for GC960 and 6201
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 4 REQ · 0 Blocking questions (7 Judgement, 2 Info)
 Test cases   : 5 designed · 6 proposed by review (none promoted, Gate B rule B3)
 Execution    : 0 PASS · 5 FAIL · 0 BLOCKED  (Environment: Dev)
 Bugs         : 1 filed (AP-2542, Critical / Highest) · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · s4c skipped (no C1 decision)
 Verdict      : FAIL
 Tickets      : AP-2502 unchanged (QC, now assigned to Vinh Le - QC) · AP-2542 in Deploy to staging
 Stopped at   : execute, before it ran (Gate B probe: send form HTTP 500 on Dev)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Stopped:** at execute, before any test case ran. The R2 reviewer approved Gate B (rule B3) on one condition: load the send form once on Dev and execute only if it returns HTTP 200. At 2026-11-07T11:05:01Z the dealer account on Dev got HTTP 500 and the error page "Erreur — Désolé, l'application éprouve des difficultés techniques" for `GET /compliance-documents/send?redirectUrl=/quick-insurance-quote`, so AP-2542 still reproduces on Dev. The five cases keep their 2026-11-03 FAIL results; nothing was filed, posted or moved. Resume with "AP-2502 --from execute" once the AP-2542 fix is confirmed on Dev.

Re-check on 2026-11-07: **nothing in the requirement changed**, so the test plan, the five test cases and the review findings were confirmed as they are and only marked "re-checked 2026-11-07, no change". The description, the acceptance criteria and both attachments are identical to the 2026-11-03 capture, and there is no new comment from anyone but the QA. What changed is metadata only: Ken Nguyen reassigned AP-2502 to the QA account on 2026-11-03T22:30 −05:00 without a comment, and the ticket now links to its bug AP-2542, which is in Deploy to staging (not QC). The analysis stands: 4 requirements, 9 open questions (0 Blocking). The last verdict is still FAIL — 0 of 5 on Dev (2026-11-03), blocked by AP-2542.

**What passed**
- Nothing at test-case level: all five cases failed at the send step.
- Supporting steps worked on Dev: the admin Chubb page saves and reads back every creditor-form selection tried, quote 6567 could be created from vehicle 915, and dealer 1380's configuration was restored after every case and equals the start-of-run state.

**Failures**
- AP2502_001, AP2502_002, AP2502_003, AP2502_004, AP2502_005 — opening the "Send compliance documents" form (`GET /compliance-documents/send?redirectUrl=...`, from Insurance Quick Quote and from Quote Details) returns HTTP 500 on Dev for every creditor-form setup tried, including the unchanged GC6201 setup (regression, AP2502_002), so no dealer can send compliance documents. Gate C: filed as AP-2542 (rule C3 resolved as "file new" by reviewer rule E2; relates to AP-2452).
- The document content (product line, GC960 footers, English GC960 file) is untested because the send form failed: the GC960 change is unproven, not disproven.

**Decisions made**
- Intake (2026-11-07): ticket updated after the capture → a dated "Ticket changes since capture" section was appended to the capture (earlier text untouched) and flagged for Gate A. Status QC → continue; run folder no-sprint unchanged.
- Analyze (2026-11-07): no requirement or question changed; a dated re-check section was added to the analysis, and the "no 960 form seen" test-data risk was marked mitigated on Dev (four GC960 forms seen in the 2026-11-03 run). Gate A is left to the orchestrator's R1 reviewer.
- Gate A (rule A3, by reviewer — R1 of 2026-11-07, APPROVE): continue, post nothing — 0 Blocking questions; 9 Open (7 Judgement Q-001–Q-004, Q-007–Q-009; 2 Info Q-005, Q-006). R1 minor F-1 applied: the three 2026-11-03 sentences saying no 960 form had been seen are now marked "(superseded 2026-11-07 — see re-check: four GC960 forms on Dev)", with the original wording kept.
- Plan, design, review-cases (2026-11-07): re-checked against the unchanged requirement and confirmed — REQ-001 to REQ-004 are all still covered by AP2502_001–005, and the review still has 0 gaps and 0 High proposals. Nothing was rewritten; dated Revisions rows and a re-check section were added. Two minor wording findings from the 2026-11-03 R2 review (test plan §9 mitigation wording, seven-digit inbox numbers) are still not applied; no result depends on them. Test-case statuses keep the 2026-11-03 FAIL results — no reset, because execution is decided later.
- Gate B (rule B3, proposed by the worker; the R2 review decides): execute the current cases — 0 uncovered ACs, 0 High proposals; 6 proposals left unpromoted (2 Medium, 4 Low).
- Gate C (rule C3 → reviewer rule E2, R3 round 1 APPROVED): one new bug for all five FAILs, severity Critical (canonical `immediate`, Jira Highest), linked "relates to" AP-2502 and AP-2452. AP-2452 is a 500 on Send with a client name of 256+ characters on Staging; this one is the form never loading, on Dev, for any input.
- Gate D (rules, automatic): AP-2502 not moved — pass rate 0% (needs 90%) and AP-2542 (Critical) blocks AP2502_001–005. Comment 19463 posted with all 5 cases, the bug and all 9 open questions. AP-2542 is in Backlog, so no bug re-test action applies.
- Not filed, by the reviewer's plan: the empty dealer Form drop-down with only `GC960S:S30` (recorded under Q-001) and the admin page accepting an empty selection, after which the dealer page shows "Your account is not configured with creditors insurance. Please contact support." (recorded under Q-008).

**Left behind**
- Test data on Dev: quote 6567 (vehicle 915, client Rosalie Bouchard AP2502-004, `client.stage.2502004@yopmail.com`). Dealer 1380's configuration is at its baseline (`AP0001`; `GC6201MQ:PM30`, `GC6201MQ:PM50`, `AVPG:TGGAP`). No records were created in s5–s7.
- Observations that are not failures: Q-001 empty Form drop-down for a GC960-only dealer; Q-008 empty creditor-form selection accepted without a message.
- 2026-11-07 run: no test data created, no tracker writes, no knowledge files changed, dealer 1380 configuration not touched. Probe evidence (Environment: Dev): `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_probe_2026-11-07_send-form-500_blocked.png` and `..._blocked_network.txt`.
- Warning for the re-test (2026-11-07, R1 F-2): AP-2542's own comments put the fix in doubt. Ken Nguyen wrote on 2026-11-05T16:26 −05:00, "looks like it's still not working". Minh Lưu wrote on 2026-11-06T05:47 −05:00, "I can't reproduce the 500 locally", and asked Ken Nguyen for Dev's `prod.log` CRITICAL lines and the `QPDF_PATH` setting. Until Dev is confirmed fixed, expect the send form to still return HTTP 500.
- Knowledge files added or changed (2026-11-03 run): `qa-artifacts/qa-docs/chubb-insurance.md` (dated Dev note beside the stale "S30 and M30 … have not appeared anywhere" sentence, R3 F-3), `qa-artifacts/qa-docs/compliance-documents.md` (AP-2542 reference added to the 2026-11-03 Dev block). The execution log's AP2502_005 step 2 now records the dealer-page message (R3 F-1).

**Files**
- [requirement capture](requirements/AP-2502-separate-compliance-document-pdf-for-gc960.md)
- [AP-2502_requirements-analysis.md](qa-artifacts/1-requirements-analysis/AP-2502_requirements-analysis.md)
- [AP-2502_test-plan.md](qa-artifacts/2-test-plan/AP-2502_test-plan.md)
- [AP2502_TestCases_001-005.md](qa-artifacts/3-test-cases/AP2502_TestCases_001-005.md)
- [AP2502_ReviewFindings_2026-11-03.md](qa-artifacts/3-test-cases/AP2502_ReviewFindings_2026-11-03.md)
- [AP-2502_test-report.md](qa-artifacts/5-testing-report/AP-2502_test-report.md)
- [AP-2502_bug-report.md](qa-artifacts/5-testing-report/AP-2502_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2502_2026-11-03.md)
- [run state](qa-artifacts/.pipeline/AP-2502.md)

## Automation
Not run yet.
