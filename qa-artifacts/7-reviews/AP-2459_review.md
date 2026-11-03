# QA Review Record — AP-2459

## R2 — Test cases — round 1 — 2026-11-01T01:48:26Z
Reviewed: qa-artifacts/.pipeline/AP-2459.md, requirements/AP-2459-permaplate-contract-generation-returns-http-500.md, qa-artifacts/3-test-cases/AP2459_TestCases_001-003.md
Verdict: **APPROVE** · Gate B: execute the current cases (design-only run — stops after s3b) — rule B3
Findings: 0 blocker · 0 major · 2 minor

The three test cases for this bug re-test were reviewed inline (the pipeline runs as a
worker subagent) by re-reading the files from disk. Every expected result rests on a
sentence the ticket states — the either/or Expected Result, the "AutoCapital Canada"
success path, the REQ-004 invoice row and the PDF block named in the Suggested Root Cause —
and the two points the ticket leaves open (which branch is intended, what the empty
financing block shows) are record-only. There is no requirements analysis, test plan or
review-findings file because the bug flow skips s1, s2 and s3b, so checks 2.4–2.6 have
nothing to apply to and Gate B falls to rule B3. No credential is copied into the
artifacts, the entry route avoids the bare `/quote/new/client` route that has crashed since
2026-10-03, every hidden link has a URL fallback, and the shared product link on dealer 1380
is only restored by this run if this run created it.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2459_TestCases_001-003.md — AP2459_003 step 1 | The fallback path relies on AP2459_001 step 1 for the dealer's product link instead of carrying the link check itself. | None required now; if AP2459_003 is ever run on its own, add the product-link check to its step 1 as in AP2459_002 step 1. |
| F-2 | Minor | AP2459_TestCases_001-003.md — all cases, Delivered at | The fixed delivery date `2026-11-01` will be in the past if execution happens weeks later; nothing in the ticket says a past date is refused, but the quote stage may behave differently. | Executor records the date used; if the vehicle save refuses it, use the execution date and note it. |

## R2 — Test cases — round 1 — 2026-11-01T01:50:36Z
Reviewed: qa-artifacts/.pipeline/AP-2459.md, requirements/AP-2459-permaplate-contract-generation-returns-http-500.md, qa-artifacts/3-test-cases/AP2459_TestCases_001-003.md, qa-artifacts/qa-config/knowledge.md, qa-artifacts/base-test/test-centralized.md, qa-artifacts/base-test/navigation-map.md, qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2446_2026-09-13.md, qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2463_2026-10-04.md, .claude/skills/stlc-ticket-pipeline/routing.md (§3 Gate B, §4 bug re-test flow)
Verdict: **APPROVE** · Gate B: execute the current cases (design-only run, status "QA" — no execution in this batch) — rule B3
Findings: 0 blocker · 0 major · 2 minor

Independent reviewer pass (separate subagent, artifacts read fresh from disk; the earlier
inline R2 record was not relied on). The three cases follow the bug re-test flow in
routing.md §4 — one re-test of the steps to reproduce plus two nearby regression checks —
and every expected result traces to a sentence in the capture: the either/or Expected
Result (AP2459_001), the "AutoCapital Canada" success path in the Actual Result
(AP2459_002) and the PDF financing block in the Suggested Root Cause (AP2459_003). The one
open product point (which branch the build should choose, and what the empty financing
block shows) is record-only, so no PASS/FAIL hangs on a guess. Test data and routes were
checked against the sources: vehicle 915 / VIN `1FAHP35NX8W239204` and the
`client.stage.NNN` inbox rule are in `test-data`, the `/vehicle/915/details` → Create quote
entry and the `/quote/new/client` HTTP 500 warning are in `domain` quote-creation.md, the
dealer contract list and `permaplate-{contractId}.pdf` download are in `domain`, and the
invoice description naming the client is evidenced by the AP-2446 run of 2026-09-13
(invoice #926). The admin product-link routes and the contract-form route come from the
ticket's own steps, which the Execution Context discloses. There is no analysis, plan or
review-findings file because the bug flow skips s1, s2 and s3b, so checks 2.4 and 2.6 have
nothing to apply to, and Gate B falls to B3. The cases can be trusted for execution once the
ticket reaches QC; the two minor points below do not change any result.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2459_TestCases_001-003.md — AP2459_003 step 4 | The expected result requires the PDF to show the client name and VIN, but no source states the PDF's contents, and the AP-2463 run of 2026-10-04 records that the PDF text is compressed and the client name inside was not read — so the executor may be unable to confirm it, or could fail the case on an unsourced expectation. | When next touched, identify the document by the `permaplate-{contractId}.pdf` file name and the quote id in the Download link (as AP-2463 did), and record the client name and VIN seen in the PDF as observed values only; the pass condition stays HTTP 200 + `application/pdf` with no error page. |
| F-2 | Minor | AP2459_TestCases_001-003.md — AP2459_003 step 1 (fallback path) | The fallback quote depends on dealer 1380 having "10 ans" linked but points to AP2459_001 step 1 instead of carrying the link check itself, so the case is not self-contained if run alone. | When next touched, copy AP2459_002 step 1's conditional link check ("skip if AP2459_001 step 1 already ran") into AP2459_003's fallback path. |
