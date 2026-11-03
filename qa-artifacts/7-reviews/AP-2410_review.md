# QA Review Record — AP-2410

## R2 — Test cases — round 1 — 2026-11-01T01:44:01Z
Reviewed: qa-artifacts/.pipeline/AP-2410.md, requirements/AP-2410-ap-2405-dealer-portal-chubb-insurance-quote.md, qa-artifacts/3-test-cases/AP2410_TestCases_001-003.md, qa-artifacts/qa-docs/chubb-insurance.md (§5, §6), qa-artifacts/base-test/06-chubb-contract-setup.md (Stage A–B)
Verdict: **APPROVE** · Gate B: Execute the current cases — rule B3
Findings: 0 blocker · 0 major · 3 minor

This is a bug re-test batch (s1, s2 and s3b skipped by routing §4), so the bug's steps to
reproduce and its expected result "Submit successfully" are the requirement. The two re-test
cases reproduce the ticket's steps on its own quote 6167, with both rate tables the developer
named in his 2026-03-23 comment, and judge only whether the submit succeeds without an error;
the regression case checks the same Chubb rating call from the Insurance Quick Quote page.
The one open question (Q-001, RT rate table, Judgement) is record-only and no result depends
on it. Every expected result is observable, test data is either the ticket's own quote or
created in a `[Pre-Condition]` step with its values written in, no credential is copied, and
no record reserved for another ticket (quotes 6276, 6254, 6256; vehicle 915) is written. The
batch can be executed once the fix reaches staging.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2410_TestCases_001-003.md — AP2410_003 Test Data, Disability | "The first option in the list" is not a fixed value, so two runs could price different disability coverage. | No change needed now; the case already asks the executor to record which option was used. Fix the value after the first run. |
| F-2 | Minor | AP2410_TestCases_001-003.md — Execution Context, Test data | Quote 6167 comes from the requirement capture, not from the `test-data` source. | After execution, add quote 6167 and what AP-2410 leaves on it to the `test-data` source so later tickets do not reuse it unknowingly. |
| F-3 | Minor | AP2410_TestCases_001-003.md — AP2410_001 step 1 | The financing precondition is conditional ("if the Financing section has no financing"), so the executor must record which branch was taken. | Executor: state in the execution log whether financing already existed or was added. |

## R2 — Test cases — round 1 — 2026-11-01T01:46:08Z (independent reviewer)
Reviewed: qa-artifacts/.pipeline/AP-2410.md, requirements/AP-2410-ap-2405-dealer-portal-chubb-insurance-quote.md, qa-artifacts/3-test-cases/AP2410_TestCases_001-003.md, qa-artifacts/qa-docs/chubb-insurance.md (§1, §2, §5, §6), qa-artifacts/base-test/06-chubb-contract-setup.md (Stages A–C), qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2437_2026-09-06.md (quote 6167 and "Rate table" evidence), Jira AP-2410 description and 2 comments (read live via tracker.get_ticket)
Verdict: **REWORK** · Gate B: Execute the current cases — rule B3 (applies once F-1 is fixed)
Findings: 0 blocker · 1 major · 2 minor

The batch is a bug re-test (s1, s2 and s3b skipped by routing §4). The ticket's three steps and
its expected result "Submit successfully" are covered by AP2410_001 (PM30, English) and
AP2410_002 (PM50, Français), matching Ken Nguyen's comment of 2026-03-23, read live: "please
try PM50 or PM30, RT is not available right now". AP2410_003 is a sensible regression on the
Insurance Quick Quote page. Expected results are concrete and grounded in the domain and
contract-setup sources (flash text, `alert` role / "HTTP" detection, "Rate table" label on the
details page), Q-001 is correctly record-only, and no reserved quote or vehicle is touched.
One pre-condition expected result, however, judges a link whose presence the two sources
disagree on, and that can turn the High re-test into a FAIL for a reason that has nothing to
do with the bug. Fix it before execution.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Major | AP2410_TestCases_001-003.md — AP2410_001 step 1 and AP2410_002 step 1 (Expected Result) | Both pre-condition steps require that "Add creditors insurance" is available. The `contract-setup` source (Stage A, verified 2026-09-04) says the link appears after financing is saved, but the newer `domain` source `chubb-insurance.md` §5 (mapped 2026-10-03) says the insurance page has no visible link while the Creditors insurance row is empty and must be opened by URL. Step 2 of both cases already opens `/quote/6167/insurance` by URL, so the link is not needed, yet its absence would fail or block the bug's own re-test and send the bug back to the developer for a reason outside the fix. | In both step 1 expected results, judge only the vehicle, the financing (and the "Financing saved" flash if it was added now), and change the link clause to "Record whether an **Add creditors insurance** link (or an existing Creditors insurance entry) is shown — record only; step 2 opens the page by URL (chubb-insurance.md §5)". |
| F-2 | Minor | requirements/AP-2410-ap-2405-dealer-portal-chubb-insurance-quote.md — Attachments; AP2410_TestCases_001-003.md — AP2410_001 step 4 | The two attachments (image-20260207-163958.png, image-20260329-142058.png) were not read, so the batch does not name the original error text the fix must remove. The `alert`-role / "HTTP" check still detects any error, so no result changes. | Executor: if a banner appears at step 4, record its full text in the log so the bug comment can compare it with the reported error. |
| F-3 | Minor | AP2410_TestCases_001-003.md — AP2410_002 | AP2410_002 runs on the same quote after AP2410_001 and overwrites the PM30 Chubb quote it saved; reopening `/quote/6167/insurance` restores the last quote (chubb-insurance.md §1), so the fields may be pre-filled with AP2410_001's values. Step 3 sets every field, so no result changes. | Executor: in step 3, confirm each field was changed to the AP2410_002 value rather than left at the restored one. |

## R2 — Test cases — round 2 — 2026-11-01T01:53:37Z (independent reviewer)
Reviewed: qa-artifacts/.pipeline/AP-2410.md, requirements/AP-2410-ap-2405-dealer-portal-chubb-insurance-quote.md (including the 2026-11-01 attachments section), qa-artifacts/3-test-cases/AP2410_TestCases_001-003.md, qa-artifacts/qa-config/knowledge.md, qa-artifacts/qa-docs/chubb-insurance.md (§1, §2, §5, §6), qa-artifacts/base-test/06-chubb-contract-setup.md (§2 Stages A–B), .claude/skills/stlc-ticket-pipeline/routing.md (§3 Gate B, §4), qa-artifacts/7-reviews/AP-2410_review.md (round 1)
Verdict: **REWORK** · Gate B: Execute the current cases — rule B3 (applies once F-1 and F-2 are fixed; no review-findings file exists because s3b is skipped by the bug re-test flow, so B1 and B2 cannot hold)
Findings: 0 blocker · 2 major · 1 minor

The round-1 findings are fixed: step 1 of AP2410_001 and AP2410_002 now only records the
"Add creditors insurance" link, both attachments were read and their banner text is quoted
word for word, step 4 of every case records any `alert` banner in full, and AP2410_002 step 3
checks each field against the restored PM30 / English values. Expected results remain
concrete and grounded in the sources, Q-001 stays record-only, and no reserved quote or
vehicle is touched. Reading the attachments, however, exposed two problems the batch must fix
before execution: the coverage terms are fixed at 60 even when quote 6167 keeps a financing
of unknown term, which the `contract-setup` source says must match, and neither High re-test
replays the inputs that actually produced the reported error, so both could PASS while the
reported failure still happens.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Major | AP2410_TestCases_001-003.md — AP2410_001 Test Data and steps 1 and 3; AP2410_002 Test Data and steps 1 and 3 | Life Term is hard-coded to `60`, but step 1 keeps any financing already on quote 6167 without recording its term, and `06-chubb-contract-setup.md` Stage B (verified 2026-09-04) says Life Term must "Match the financing term". The 2026-03-29 screenshot used terms of 12, so the existing financing may not be 60 months; a mismatched term can make Chubb reject the quote and fail the bug's own re-test for a reason in the test data, not in the fix. | In step 1 of both cases, record the existing financing's Term months, Date of birth and whether a co-borrower is present (or the values added now). In step 3 and the Test Data, set Life Term to "the financing term recorded in step 1" instead of a fixed `60`. |
| F-2 | Major | AP2410_TestCases_001-003.md — Summary Table, Coverage Matrix; AP2410_001 and AP2410_002 Test Data | The error the fix must remove ("Debtor is -1 years old. Age of Debtor is not within the plan limits.", 2026-03-29) was produced with Tax exempt Yes, Life Residual Value Coverage / 12 / Borrower, Critical illness Decreasing / 12 / Co borrower and Disability 30D_RETRO / 12 / Both. Both re-test cases use only borrower Life coverage with Tax exempt No, so no case replays the reported input — in particular coverage for the Co borrower or Both — and a fix that works only for borrower-only coverage would pass both High re-tests while the reported failure remains. | Add a High re-test case (AP2410_004) on quote 6167 that replays the 2026-03-29 inputs exactly as listed in *The error as originally reported*, with the same step 4 / step 5 checks, and add it to the Summary Table, Coverage Matrix and the *Leaves behind* row. Do not guess the intended behaviour when the financing has no co-borrower: if step 1 shows none, the designer adds Q-002 (Judgement — whether co-borrower coverage on a quote without a co-borrower should be accepted or refused, and with what message), and that case's success or refusal is record-only, while the full text of any banner is still recorded. |
| F-3 | Minor | AP2410_TestCases_001-003.md — AP2410_003 Test Data, Disability | "The first option in the list" is still not a fixed value (carried from round 1, inline review F-1); `chubb-insurance.md` §6 lists the options, the first being `30D_RETRO`. | Set Disability to `30D_RETRO` (the option in the 2026-03-29 screenshot), or keep the record-only instruction. |

## R2 — Test cases — round 3 — 2026-11-01T01:58:32Z (independent reviewer)
Reviewed: qa-artifacts/.pipeline/AP-2410.md, requirements/AP-2410-ap-2405-dealer-portal-chubb-insurance-quote.md (including the 2026-11-01 attachments section), qa-artifacts/3-test-cases/AP2410_TestCases_001-004.md, qa-artifacts/qa-docs/chubb-insurance.md (§5, §6), qa-artifacts/base-test/06-chubb-contract-setup.md (§2 Stages A–B), .claude/skills/stlc-ticket-pipeline/routing.md (§3 Gate B), qa-artifacts/7-reviews/AP-2410_review.md (rounds 1–2)
Verdict: **APPROVE** · Gate B: Execute the current cases — rule B3 (no review-findings file exists because s3b is skipped by the bug re-test flow, so B1 and B2 cannot hold; no unpromoted proposals)
Findings: 0 blocker · 0 major · 3 minor

The round-2 findings are fixed. F-1: step 1 of AP2410_001, 002 and 004 now records the
financing's Term months, Date of birth and co-borrower, and every coverage term is "the
financing term recorded in step 1". Making the replay's terms follow the recorded financing
term rather than a fixed 12 is acceptable and is the better choice: `06-chubb-contract-setup.md`
Stage B is the only source that states a term rule ("Match the financing term"); when this
batch adds the financing it uses Term months 12, so AP2410_004 is then an exact replay of the
2026-03-29 screenshot; and when an older financing with another term is kept, the case logs
the term as the only changed input. The reported error ("Debtor is -1 years old. Age of
Debtor is not within the plan limits.") is about the debtor's age, not the term, so a term
that follows the financing does not weaken the replay of the reported symptom, while a fixed
12 against a non-12 financing would risk a refusal caused by the test data. F-2: AP2410_004
(High, 5 steps) replays PM30 / English / Tax exempt Yes / Life Residual Value Coverage–Borrower /
Critical illness Decreasing–Co borrower / Disability 30D_RETRO–Both and is in the Summary
Table, Coverage Matrix, Leaves behind and run order. Q-002 (Judgement) makes steps 4–5
record-only when no co-borrower exists, and still judges only objective faults (an error
page, HTTP 5xx, or an age no recorded date of birth produces, such as "-1 years old"), so the
reported error itself still fails the case and no PASS/FAIL hangs on a guessed answer. F-3:
AP2410_003 Disability is now `30D_RETRO`. Every case cites the ticket, every expected result
is concrete, the file holds 4 cases of at most 5 steps with IDs AP2410_001–004 and no gaps,
Q-001 and Q-002 are record-only, no case depends on a Blocking question, and no reserved
quote (6276, 6254, 6256) or vehicle 915 is written. The batch can be trusted for execution
once the fix reaches staging; the three Minor points below are executor notes and do not
change any result's design.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2410_TestCases_001-004.md — AP2410_004 Test Data (Life) and step 1 | Life "Residual Value Coverage" is the label from the screenshot; `chubb-insurance.md` §6 lists only codes (`DECREASING_RESIDUAL`, `DECREASING_ACC_RESIDUAL`), and the financing this batch may add has Residual `0`. No source says a residual coverage needs a residual amount, so this is not a design fault, but if Chubb refuses for that reason the cause would be test data, not the fix. | Executor: in step 1 also record the financing's Residual amount and the exact Life option label chosen in step 3; if a refusal names the residual, record it as a test-data observation in the log rather than as evidence the bug remains. |
| F-2 | Minor | AP2410_TestCases_001-004.md — AP2410_004 step 5 (no co-borrower branch) | The refused branch expects the section to "still show AP2410_002's PM50 / Français quote, unchanged", which is only true if AP2410_002 saved; if AP2410_002 failed or was blocked, the expected value is wrong. | Executor: before step 4, record the Creditors insurance quote shown on `/quote/6167/details` and judge step 5's refused branch against that recorded quote, not against AP2410_002's values. |
| F-3 | Minor | AP2410_TestCases_001-004.md — Execution Context, Coverage terms and AP2410_001 Test Data | When this batch adds the financing it adds no co-borrower, so AP2410_004 will then always take the Q-002 record-only branch, and the success path for co-borrower / Both coverage is not asserted until Q-002 is answered. This follows the round-2 required fix and the reported symptom is still caught as an objective fault. | No change now. When Q-002 is answered, update AP2410_004 steps 4–5 to the stated behaviour (and, if co-borrower coverage needs a co-borrower, add one with a stated date of birth in the pre-condition). |
