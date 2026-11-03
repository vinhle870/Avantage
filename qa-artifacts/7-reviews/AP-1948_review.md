# QA Review Record — AP-1948

## R1 — Requirements analysis — round 1 — 2026-11-01T00:20:00Z
Reviewed: requirements/AP-1948-cbi-cve-tesla-price-modification.md, qa-artifacts/1-requirements-analysis/AP-1948_requirements-analysis.md, qa-artifacts/.pipeline/AP-1948.md
Verdict: **APPROVE** · Gate A: Post the Blocking questions on AP-1948 and continue — rule A2
Findings: 0 blocker · 0 major · 1 minor

The analysis maps both acceptance statements of the Given / When / Then block and the
"Original ask" figures to REQ-001 – REQ-003, invents no behaviour, and classifies all nine
open questions with an Impact and a Status. Two Blocking questions are open (Q-001 on
REQ-001, Q-002 on REQ-003); REQ-002 has none, so not every requirement is blocked and the
run can continue under rule A2 with the REQ-001 and REQ-003 cases BLOCKED at design time.

Checklist: 1.1 pass — "filtered by vehicle model Category" → REQ-001, "pricing set in the
program term > suggested retail price" → REQ-002, the three Original-ask sentences →
REQ-003. 1.2 pass — every REQ quotes the capture; REQ-002's "observable as" line only
restates where the quoted field is read. 1.3 pass — Q-001 – Q-009 each carry Impact and
Status. 1.4 pass — every REQ has at least one quoted criterion. 1.5 pass — no question is
marked Answered; Q-009 correctly records that Eric Lindquist's "It works ( live ) with the
correct pricing" states no behaviour.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP-1948_requirements-analysis.md — Q-003 | Q-003 bundles two questions (make scope and the meaning of "CBI / CVE"), which makes its answer harder to track. | Split it into two rows on the next re-run of s1; no result changes. |

## R2 — Test cases — round 1 — 2026-11-01T00:50:00Z
Reviewed: qa-artifacts/3-test-cases/AP1948_TestCases_001-005.md, qa-artifacts/3-test-cases/AP1948_TestCases_006-008.md (as designed by s3, before promotion), qa-artifacts/3-test-cases/AP1948_ReviewFindings_2026-11-01.md, qa-artifacts/1-requirements-analysis/AP-1948_requirements-analysis.md, qa-artifacts/2-test-plan/AP-1948_test-plan.md, qa-artifacts/base-test/navigation-map.md, qa-artifacts/base-test/execute.env.md, qa-artifacts/base-test/test-centralized.md
Verdict: **APPROVE** · Gate B: Promote the one High Pass 2 proposal (#1) and re-run s3 — rule B2
Findings: 0 blocker · 0 major · 2 minor

Eight cases cover all three requirements: REQ-002 by three runnable cases (AP1948_001 – 003),
REQ-001 and REQ-003 by five cases correctly BLOCKED on Q-001 and Q-002 with "Not known — Q-00N"
expected results. Judgement questions Q-004 – Q-006 appear only as record-only results with
objective faults as the pass condition. The review findings list no Pass 1 gap that cites a
requirement or acceptance criterion, so rule B1 does not hold; Pass 2 #1 is High, so rule B2
promotes it alone. The Medium and Low proposals (#2 – #7) are not promoted.

Checklist: 2.1 pass — every REQ has ≥ 1 case, every case cites a REQ. 2.2 pass — runnable
results name a compared amount, a list or an absence; BLOCKED results say "Not known — Q-00N".
2.3 pass — 5 + 3 cases, ≤ 5 steps each, AP1948_001 – 008 with no gap. 2.4 pass — AP1948_004 –
008 BLOCKED with Blocked by Q-001 / Q-002. 2.5 pass — Q-004 (006), Q-005 (001), Q-006 (002, 003)
are record-only. 2.6 pass — the one High proposal is promoted by this gate. 2.7 pass — the
entry route and customer 1493 come from `env` / `navigation`; each vehicle is entered in a
`[Pre-Condition]` step with its make, model and year.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP1948_TestCases_001-005.md — AP1948_001 step 3, AP1948_002 step 3 | The admin screen holding a term's "suggested retail price" is not in any knowledge source, so the step names it by purpose, not by route. | No change before execution; the executor records the route and writes it back to `qa-docs` per the mapping guide. |
| F-2 | Minor | Both files — Client portal steps | Client portal field and button labels are unverified ("as labelled on the page") because the Client portal is unmapped (`navigation-map.md` §4). | No change before execution; record the real labels in the execution log and map the page afterwards. |

## R2 — Test cases — round 1 (independent reviewer, after promotion) — 2026-11-01T00:55:17Z
Reviewed: qa-artifacts/3-test-cases/AP1948_TestCases_001-005.md, qa-artifacts/3-test-cases/AP1948_TestCases_006-009.md, qa-artifacts/3-test-cases/AP1948_ReviewFindings_2026-11-01.md, qa-artifacts/1-requirements-analysis/AP-1948_requirements-analysis.md, qa-artifacts/2-test-plan/AP-1948_test-plan.md, requirements/AP-1948-cbi-cve-tesla-price-modification.md, qa-artifacts/.pipeline/AP-1948.md, qa-artifacts/qa-config/knowledge.md, qa-artifacts/base-test/execute.env.md, qa-artifacts/base-test/test-centralized.md, qa-artifacts/base-test/navigation-map.md
Verdict: **REWORK** · Gate B: rule B2 already applied (Pass 2 #1 promoted as AP1948_009); after this rework go straight to s4 without re-running s3b — rule B2
Findings: 1 blocker · 1 major · 2 minor

This independent review read the nine cases as they now stand on disk, including the
promoted AP1948_009. Coverage is complete and traceable. The five BLOCKED cases name Q-001
or Q-002 correctly, and AP1948_009 turns the High proposal into a sound
change-verify-restore case. One case cannot be trusted as written: AP1948_003 judges
whether the selected term and price are carried into the submitted quote request. That is
exactly what Judgement question Q-006 asks, so a PASS or FAIL there would rest on a guessed
answer. The same case also has the executor make up its own form data instead of using the
`test-data` patterns. Only AP1948_003 needs rework. The other eight cases can run as they are.

Checklist: 2.1 pass — REQ-001 → AP1948_004, 005, 006; REQ-002 → 001, 002, 003, 009;
REQ-003 AC 1–3 → 007 (AC 1, 2), 008 (AC 1, 3); every case cites a REQ. 2.2 pass — runnable
results compare named amounts, lists or an absence; BLOCKED results say "Not known — Q-00N".
2.3 pass — 5 + 4 cases, at most 5 steps each (AP1948_009 has 5), IDs AP1948_001 – 009 with
no gap or duplicate. 2.4 pass — AP1948_004 – 006 Blocked by Q-001, 007 – 008 Blocked by Q-002.
2.5 **fail** — AP1948_003 (F-1); Q-004 (006) and Q-005 (001) are record-only, and AP1948_002
judges only the REQ-002 price after the switch while recording the refresh mechanism for
Q-006, which is correct. 2.6 pass — the one High proposal (#1) is AP1948_009; #2 – #7 are
Medium or Low and are logged in the run state's Gate B line. 2.7 **fail** — AP1948_003
step 2 (F-2); elsewhere the entry route and customer 1493 come from `env`, the admin account
from `env`, and each vehicle is entered in a `[Pre-Condition]` step with make, model and year.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Blocker | AP1948_TestCases_001-005.md — AP1948_003 title and step 4 | The title ("the chosen term and its price are kept, not lost") and step 4's expected result ("not missing, blank or different") fail the case if the submitted request does not show the price. Whether the price must be carried into the submitted request is Q-006, an open Judgement question, so the case hangs a FAIL on a guessed answer. The words "where shown" and "not missing" also contradict each other, so two executors could reach different results. | Rewrite the title and step 4 so that the only FAIL conditions are an error page or HTTP 5xx, or a term or price that is shown back but differs from the one selected in step 2. Record whether the term and price appear at all as a record-only result for Q-006. Remove "missing" and "blank" as failure conditions. |
| F-2 | Major | AP1948_TestCases_001-005.md — AP1948_003 step 2 | "Fill any other required field the page shows with test values" leaves the executor to invent the data for a case that really submits a request. Any email or name field would then hold made-up values, and a made-up email could reach a real inbox. The `test-data` source already defines dynamic patterns for this: client email `client.stage.NNN@yopmail.com` and a client name such as `Marie Tremblay`. | State in step 2, or in a `[Pre-Condition]` step, that any email field takes a fresh `client.stage.NNN@yopmail.com` address and any name field takes a client name from `test-centralized.md` → Dynamic Test Data. Any other required field is filled with a value that is recorded in the log. |
| F-3 | Minor | AP1948_TestCases_006-009.md — AP1948_009 step 2 | Step 2 is labelled `[Pre-Condition]`, but it holds the admin price change that the case exists to test. | Drop the `[Pre-Condition]` label from step 2, or split the read of the original value (pre-condition) from the change (action). No result changes. |
| F-4 | Minor | AP1948_TestCases_001-005.md — AP1948_001 step 1, AP1948_003 step 1 | Both cases assume the unmapped Client portal page lets the customer enter make, model and year. If it does not, the cases cannot proceed. | No change before execution. If the page takes the vehicle in another way (for example a VIN or a pre-loaded vehicle), the executor records how and marks the step BLOCKED, not FAIL, then maps the page per `qa-docs/_mapping-guide.md`. |

## R2 — Test cases — round 2 — 2026-11-01T01:03:44Z
Reviewed: qa-artifacts/3-test-cases/AP1948_TestCases_001-005.md, qa-artifacts/3-test-cases/AP1948_TestCases_006-009.md, qa-artifacts/1-requirements-analysis/AP-1948_requirements-analysis.md (Q-001 – Q-009), qa-artifacts/base-test/test-centralized.md (Dynamic Test Data), qa-artifacts/qa-config/knowledge.md, qa-artifacts/.pipeline/AP-1948.md, qa-artifacts/7-reviews/AP-1948_review.md (round-1 findings), .claude/skills/stlc-ticket-pipeline/routing.md §3 Gate B
Verdict: **APPROVE** · Gate B: rule B2 already applied (Pass 2 #1 promoted as AP1948_009); go straight to s4 without re-running s3b — rule B2
Findings: 0 blocker · 0 major · 1 minor

This round re-read both test-case files as they now stand on disk and checked each
round-1 finding against them. All four are fixed. AP1948_003 now fails only when a term or
price that is shown back differs from the one selected in step 2, or on an error page or
HTTP 5xx; whether the term and price are shown back at all is recorded for Q-006 and is
explicitly "not a failure", so no PASS or FAIL rests on the open Judgement question (F-1
closed). Its form data now comes from `test-data`: a fresh `client.stage.NNN@yopmail.com`
and `Marie Tremblay`, both matching `test-centralized.md` → Dynamic Test Data, with any
other required field recorded by label and value (F-2 closed). AP1948_009 step 2 no longer
carries the `[Pre-Condition]` label (F-3 closed), and both Execution Contexts now say that
a vehicle-entry mismatch is BLOCKED, not FAIL (F-4 closed). The nine cases can be executed.

Checklist: 2.1 pass — REQ-001 → AP1948_004, 005, 006; REQ-002 → 001, 002, 003, 009;
REQ-003 → 007, 008; every case cites a REQ. 2.2 pass — runnable results compare named
amounts, lists, a stated FAIL condition or an absence; BLOCKED results say "Not known —
Q-00N". 2.3 pass — 5 + 4 cases, at most 5 steps each, IDs AP1948_001 – 009 with no gap or
duplicate. 2.4 pass — AP1948_004 – 006 Blocked by Q-001, 007 – 008 Blocked by Q-002, both
still Blocking + Open in the analysis. 2.5 pass — Q-004 (006), Q-005 (001), Q-006 (002, 003)
are record-only. 2.6 pass — the one High proposal (#1) is AP1948_009; #2 – #7 are logged in
the run state's Gate B line. 2.7 pass — entry route and customer 1493 from `env`, admin
account from `env`, AP1948_003 form data from `test-data`, each vehicle entered in a
`[Pre-Condition]` step with make, model and year.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP1948_TestCases_001-005.md — AP1948_003 step 4 | The FAIL condition "a term or price that appears differs from the one selected" does not say that only the amount is compared, as AP1948_001 does for Q-005. A confirmation page that shows the same amount in another format (for example "2 500,00 $" against "$2,500.00") could be read as "differs". | No rework needed before execution. The executor compares the amount only and records any format difference for Q-005, never as a FAIL; on the next re-run of s3, add "amount only — format recorded for Q-005" to step 4. |

## R3 — Execution results — round 1 — 2026-11-01T16:10:00Z
Reviewed: qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-01.md, qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/ (7 files), qa-artifacts/3-test-cases/AP1948_TestCases_001-005.md, qa-artifacts/3-test-cases/AP1948_TestCases_006-009.md, qa-artifacts/2-test-plan/AP-1948_test-plan.md §8.1, qa-artifacts/1-requirements-analysis/AP-1948_requirements-analysis.md, requirements/AP-1948-cbi-cve-tesla-price-modification.md, qa-artifacts/.pipeline/AP-1948.md, AP-1948 comments read from Jira (tracker CLI, 4 comments)
Verdict: **REWORK** · Gate C: — (no FAIL in the log; Gate C is skipped, nothing to decide) — rule "Skip it when the execution log has no FAIL"
Findings: 0 blocker · 1 major · 2 minor

The log is complete and its one PASS can be trusted: AP1948_002's Summary subtotals
(CA$1,025.00 and CA$2,700.00) and the admin "Suggested retail price" values (1025, 2700)
are stated as observed values and the screenshots show them. The five cases blocked by
Q-001 and Q-002 are legitimately BLOCKED — Jira AP-1948 still has no answer after the QA
questions comment. The three cases blocked for "no 2023 Tesla Model 3 on Dev" are not
legitimately BLOCKED: the year 2023 appears nowhere in the capture or the analysis, the test
plan says the vehicle matters only by make and model, and none of the three expected results
depends on the vehicle at all. Dev lists 2022 and 2024 Tesla Model 3 entries, so
AP1948_001, 003 and 009 must be re-executed with one of them.

Checklist: 3.1 pass — all nine cases appear, none `Not Run`. 3.2 pass — recount 1 PASS,
0 FAIL, 8 BLOCKED, 0 SKIPPED; 1 ÷ 9 = 11 %. 3.3 pass — every AP1948_002 PASS step states an
observed value (URL, labels, term ids, CA$ amounts, admin values). 3.4 pass — all 7 screenshot
paths exist. 3.5 pass — no FAIL and no High-priority PASS; the blocking and AP1948_002
evidence screenshots were inspected anyway (below). 3.6 n/a — no FAIL. 3.7 pass — no
environment failure recorded as FAIL. 3.8 **fail** — AP1948_001, 003, 009 name a reason, but
the reason does not block them (F-1); 004–008 name Q-001 / Q-002 correctly. 3.9 n/a — no
Gate C decision.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Major | execution-log_AP-1948_2026-11-01.md — AP1948_001 step 1, AP1948_003 step 1, AP1948_009 step 1 | The three cases were marked BLOCKED because Dev's vehicle list has no 2023 Tesla Model 3, and the log says "the design forbids substituting another vehicle". Neither test-case file says that. The year 2023 is not in the requirement capture or the analysis. The test plan §8.1 classifies the vehicle as Dynamic because "the terms and price asserted depend on the make and model entered" — the year is not part of it. All three expected results compare the selected term's Client portal price with that same term's own admin "suggested retail price" (009: with that price + 100), so no expected result changes with the year. The vehicle list on Dev offers "2022 TESLA Model 3 / Long Range", "2022 TESLA Model 3 / Standard Range Plus" (visible in the blocking screenshot) and a 2024 Model 3. The executor itself ran AP1948_002 through the same list, so a fixed list is not the "vehicle entry differs from design" fallback (that covers a VIN or a pre-loaded vehicle). Two High-priority cases of REQ-002, including the only case that proves the price is read from the program term, were left unexecuted with no real blocker. | Re-run s4 for AP1948_001, AP1948_003 and AP1948_009 only, on v2dev, with the list entry "2022 TESLA Model 3 / Long Range" (or, if it offers no term, a 2024 Tesla Model 3), and record in each step 1 the entry chosen and "Model 3 2023 not on Dev — year is not a test condition (test plan §8.1, review R3 F-1)". Read the price on the Summary page "Subtotal", as in AP1948_002. AP1948_009: record the original suggested retail price before the change and restore it in step 4; confirm the restored value in the log. AP1948_003 step 3: tick "I accept the terms and conditions" and press "Continue with payment"; if that opens a page asking for card or payment details, stop there, enter nothing, record the page, and mark steps 3–4 BLOCKED ("submission requires payment — no payment test data in `test-data`"), not FAIL. Append the re-run to the same day's log; leave the AP1948_002 and 004–008 rows as they are. |
| F-2 | Minor | execution-log_AP-1948_2026-11-01.md — AP1948_002 step 2 / Data left behind | The Client Info values the executor chose are visible in the step 4 screenshot (address "123 Rue Test Montreal, Québec H2X 1Y4", Phone 1 "5145550100") but are not recorded in the log; only the name and email are. The test-case Execution Context asks that every executor-chosen required field be recorded. | On the re-run, record each Client Info field label and value used, for AP1948_002 as an addendum and for the re-run cases. No result changes. |
| F-3 | Minor | AP1948_TestCases_001-005.md and AP1948_TestCases_006-009.md — Test Data and step 1 of 001, 003, 009; Execution Context | The files still name Staging, a typed make / model / year and a 2023 Model 3, expect the price at term selection (it shows only on Summary as "Subtotal"), and do not say what "submit" means when the last button is "Continue with payment". | On the next re-run of s3, change the vehicle to a listed Tesla Model 3 entry, say "read the Subtotal on the Summary page", and define the AP1948_003 submit boundary. No result of this run changes. |

Screenshots inspected:
- qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_001-step1-No2023Model3InVehicleList_blocked.png — matches (list goes 2022 Model 3 ×2, 2022 Model Y / S / X, then 2023 Toyota Camry; no 2023 Model 3). It also shows the two 2022 Model 3 entries usable for the re-run
- qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_002-step4-SecondTermPriceEqualsAdmin_pass.png — matches (Summary, 2023 TESLA Model Y, Program CVE 12m/0km, Subtotal CA$2,700.00)
- qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_002-step3-AdminTerm122SuggestedRetail2700_pass.png — matches (CVE CVE A 12m/0km, Suggested retail price 2700, Category A, BEV, Passenger)

## R3 — Execution results — round 2 — 2026-11-01T15:50:59Z
Reviewed: qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-01.md (whole log, including *Re-run after review R3*), qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/ (13 files, MD5 compared), qa-artifacts/.pipeline/AP-1948.md, qa-artifacts/7-reviews/AP-1948_review.md (R3 round 1), qa-artifacts/base-test/execute.env.md (Dev Environment), qa-artifacts/base-test/test-centralized.md, .claude/skills/stlc-ticket-pipeline/routing.md §2–§3; live read-only re-check on v2dev of `/admin/program-term/16/edit`
Verdict: **APPROVE** · Gate C: — (no FAIL in the log after the re-run; Gate C is skipped, nothing to decide) — rule "Skip it when the execution log has no FAIL"
Findings: 0 blocker · 0 major · 3 minor

This round checked the re-run of AP1948_001, 003 and 009 that round 1 asked for (F-1). All
three were re-run on v2dev with "2022 TESLA Model 3 / Long Range", and each step 1 records
the substitution and why. AP1948_001 and AP1948_009 PASS with observed values: the Summary
Subtotal CA$1,025.00 equals admin term 16's Suggested retail price 1025, and after the admin
change 1025 → 1125 the Summary showed CA$1,125.00. The screenshots show these values.
AP1948_003 is correctly BLOCKED at the Stripe sandbox checkout, exactly as round 1 told the
executor to handle it: nothing was entered and the reason names the missing payment test
data. The restore of term 16 was confirmed independently by this reviewer (see below), so
nothing is left changed on Dev. Round-1 F-2 (Client Info values) is closed by the
executor-chosen values table and the AP1948_002 addendum. Round-1 F-3 stays open for the
next s3 re-run.

Restore check (live, read only, v2dev, 2026-11-01T15:50Z): the admin login used the Dev
Environment account from the `env` source; `/admin/program-term/16/edit`, heading
"L'Avantageuse AT 36m/60000km", showed Suggested retail price **1025**. The other fields
match the first run's evidence: franchise 100, repair per visit 5000, repair total 5000,
categories A, B, C, fuel types GASOLINE and DIESEL, vehicle type PASSENGER. Nothing was
saved and the tab was closed.

Checklist: 3.1 pass — all nine cases appear, none `Not Run`. 3.2 pass — recount 3 PASS (001,
002, 009), 0 FAIL, 6 BLOCKED (003, 004–008), 0 SKIPPED; 3 ÷ 9 = 33 %, as the summary says.
3.3 pass — every PASS step of the re-run states an observed value (URL, term id, CA$ amounts,
admin 1025 / 1125, the save message). 3.4 pass — all six re-run screenshot paths exist.
3.5 pass with F-1 — six images inspected (below). 3.6 n/a — no FAIL. 3.7 pass — the Stripe
page is a missing-test-data block after a successful HTTP 302, recorded as BLOCKED, not FAIL.
3.8 pass — AP1948_003 names "submission requires payment — no payment test data in
`test-data`" (confirmed: `test-centralized.md` has no payment or card data); 004–008 name
Q-001 / Q-002. 3.9 n/a — no Gate C decision.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | execution-log_AP-1948_2026-11-01.md — AP1948_009 step 5 screenshot `AP1948_009-step5-AdminTerm16Restored1025_pass.png` | The restore screenshot is byte-identical (same MD5, 424e6463…) to `AP1948_001-step4-AdminTerm16Equals1025_pass.png`, taken before the price was changed, and it shows neither the term heading nor anything that dates it after the restore. On its own it cannot prove the restore. The reviewer's live re-check shows term 16 at 1025 with an unchanged form, and the AP1948_003 Summary taken later shows CA$1,025.00, so the result stands. | No re-run needed. On future change-and-restore cases, capture the restored form with the term heading in view (or the "Program terms saved" message) so the image differs from the pre-change capture. |
| F-2 | Minor | execution-log_AP-1948_2026-11-01.md — AP1948_009 step 2 | The log says the admin field was re-opened and showed 1125, but no admin screenshot shows 1125. The step 3 Summary showing CA$1,125.00 proves the save took effect, so the result does not change. | No re-run needed. Next time, take a screenshot of the admin field after the change as well as after the restore. |
| F-3 | Minor | AP1948_TestCases_001-005.md — AP1948_003 steps 3–4; execution log *Re-run — data left behind* | AP1948_003 cannot pass until the submit boundary is defined or payment test data exists. Pressing "Continue with payment" for `client.stage.918@yopmail.com` also created a Stripe sandbox checkout session; whether a pending quote or order was left on customer 1493 is not known (`cleanup` is `missing`). | On the next s3 re-run (together with round-1 F-3), either add Stripe sandbox test-card data to `test-data` or define the Summary page as the submit boundary. Report the unpaid checkout for `client.stage.918@yopmail.com` in the test report's data-left-behind section. |

Screenshots inspected:
- qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_001-step2-SummaryModel3Term16Subtotal_pass.png — matches (2022 TESLA Model 3 Long Range, AT 36m/60000km, Subtotal CA$1,025.00, client.stage.917)
- qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_001-step4-AdminTerm16Equals1025_pass.png — matches (Suggested retail price 1025, categories A–C, GASOLINE + DIESEL); no heading in frame
- qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_009-step3-SummarySubtotal1125AfterChange_pass.png — matches (same vehicle and term, Subtotal CA$1,125.00, GST 56.25, PST 112.22, Total CA$1,293.47)
- qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_009-step5-AdminTerm16Restored1025_pass.png — shows 1025 as claimed, but is the same file as the 001 step 4 image (F-1); the restore is proven by the live re-check instead
- qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_003-step2-SummaryBeforeSubmit_pass.png — matches (client.stage.918, AT 36m/60000km, Subtotal CA$1,025.00, Total CA$1,178.49)
- qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_003-step3-StripeCheckoutPaymentPage_blocked.png — matches (Stripe "Sandbox", Pay Garantie Avantage Plus, CA$1,178.49 / ₫22,627,955, empty card fields)

## R4 — Outcome plan (Gate D) — round 1 — 2026-11-01T15:55:09Z
Reviewed: qa-artifacts/.pipeline/AP-1948.md, qa-artifacts/5-testing-report/AP-1948_test-report.md, qa-artifacts/5-testing-report/AP-1948_bug-report.md, qa-artifacts/1-requirements-analysis/AP-1948_requirements-analysis.md (Open Questions), qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-01.md, qa-artifacts/4-execution-results/comment_AP-1948_2026-11-01.md (planned comment), qa-artifacts/qa-config/tools.md §2 *QA outcome rules*; tracker read of AP-1948 (status QC, assignee Vinh Le - QC, 4 comments — the latest is the QA questions comment 19432, no answer after it)
Verdict: **APPROVE** · Gate D: AP-1948 — post the story result comment, leave status QC and assignee unchanged; no bug-ticket action — rule D (§3.1)
Findings: 0 blocker · 0 major · 1 minor

Reviewed inline (this run is itself a worker subagent), from the files on disk under the fresh-eyes rule. The pass rate recomputes to 3 ÷ (9 − 0 SKIPPED) = 33%, matching the test report, and it is below `story_pass_threshold` 90%. There is no FAIL, so no bug is needed and none is linked; there is no stopping bug. Q-001 and Q-002 are Blocking and still Open in the analysis, and the fresh tracker read shows no answer after comment 19432. Two of the three §3.1 checks fail, so the story must not move, and the plan says so. The planned comment lists all nine cases with status and bug, says what passed and what is blocked and why, names the environment as "Tested on: Dev (v2dev)", and reminds the author of Q-001/Q-002 by reference to the existing questions comment instead of re-posting them.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | comment_AP-1948_2026-11-01.md — Open questions | The Info questions Q-007–Q-009 are not listed. They are addressed to the QA or ask for background only, and none decides a result | None for this gate |

Checklist R4: 4.1 pass (33% recomputed) · 4.2 pass (no FAIL) · 4.3 pass (no bug, so no stopping bug) · 4.4 pass (no move: pass rate 33% < 90% and Q-001/Q-002 Blocking + Open) · 4.5 pass (9 rows planned) · 4.6 pass (no re-assignment planned).

## R5 — Automation specs — round 1 — 2026-11-01T16:04:35Z
Reviewed: qa-artifacts/6-automation/AP-1948_automation-report.md (draft), playwright-automation/src/tests/client/termPrice_AP1948.spec.ts, playwright-automation/src/flows/TermPriceFlow.ts, playwright-automation/src/pages/common/ClientQuoteRequestPage.ts, playwright-automation/src/pages/adminPortal/AdminProgramTermPage.ts, qa-artifacts/3-test-cases/AP1948_TestCases_001-005.md, qa-artifacts/3-test-cases/AP1948_TestCases_006-009.md, the 2026-11-01 execution log, `git status` of playwright-automation/; live read-only check of /admin/program-term/16/edit on v2dev after the runs
Verdict: **APPROVE** · Gate —
Findings: 0 blocker · 0 major · 2 minor

Reviewed inline (this run is itself a worker subagent), from the files on disk under the fresh-eyes rule. The spec automates exactly the three cases whose final manual status is PASS (AP1948_001, 002, 009) and nothing BLOCKED. Every `[Verification]` step has an assertion in the flow. AP1948_009 records the original price before any change, touches only term 16's suggested retail price, and restores it in a `finally` block that asserts the restored value, with an `afterEach` fallback flagged by `pendingRestore`; after three 009 runs the live admin form showed 1025. No test presses "Continue with payment" (the page object has no locator for it). Only new files were added; the QA's AdminFlow.ts, DealerFlow.ts, index.ts and test-fixtures.ts are unchanged, and the new classes are imported by path. Credentials come from `getCredentials` via `AdminFlow.loginToAdminPortal()`; URLs come from `config`; the suite skips itself unless the base URL is v2dev.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | termPrice_AP1948.spec.ts — AP1948_009 restore path | The `finally` / `afterEach` restore has only run on the success path; it was not exercised with a forced assertion failure. The code path is short (open the edit form, compare, save only when different, assert) | None for this gate |
| F-2 | Minor | termPrice_AP1948.spec.ts — test data | Customer 1493, vehicle ids 80 / 81 and term ids 16 / 122 are Dev data constants. The v2dev skip guard keeps the suite off staging, where these ids are not confirmed | Move them to a Dev test-data file if the framework gains one |

Run: `npm run lint` — pass; `npx playwright test --project=chromium --grep @AP-1948` — 3 passed; `--repeat-each=2` — 6 passed, 0 failed, 0 fixme, no flaky tests.

Traceability:
| TC ID | Step | Expected result | Assertion |
|---|---|---|---|
| AP1948_001 | 2 | One price is shown for the selected term | TermPriceFlow.chooseTermAndReachSummary() — expect(lblSubtotal).toHaveText(CA$ amount); readSummarySubtotal() — expect(lblWarrantyTerm).toHaveText('36 months and/or 60000 km') |
| AP1948_001 | 3 | The admin field has a value | TermPriceFlow.readSuggestedRetailPrice() — expect(txtSuggestedRetailPrice).not.toHaveValue('') |
| AP1948_001 | 4 | Portal amount equals the admin value | TermPriceFlow.verifyPriceEquals(portal, admin) — expect(portal).toBe(admin) |
| AP1948_002 | 2 | Each selection shows one price | chooseTermAndReachSummary() / switchTermAndReachSummary() + readSummarySubtotal() per term (term label asserted) |
| AP1948_002 | 4 | After the second selection the price equals the second term's suggested retail price, not the first's | verifyPriceEquals(secondPortal, secondAdmin); verifyPriceEquals(firstPortal, firstAdmin); verifyPricesDiffer(firstPortal, secondPortal) |
| AP1948_009 | 2 | Save confirmed and the field shows original + 100 | setSuggestedRetailPrice() — expect(page).toHaveURL(/admin/program-terms/), expect(lblSaved).toBeVisible(), expect(stored).toBe(original + 100) |
| AP1948_009 | 4 | Field shows the original again | restoreSuggestedRetailPrice() — expect(stored).toBe(original) |
| AP1948_009 | 5 | Portal price = original + 100; admin shows the original again | verifyPriceEquals(after, original + 100); restoreSuggestedRetailPrice() assertion |
