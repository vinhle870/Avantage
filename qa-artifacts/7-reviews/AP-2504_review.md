# QA Review Record — AP-2504

## R1 — Requirements analysis — round 1 — 2026-11-03T04:12:07Z
Reviewed: requirements/AP-2504-generate-contract-for-a-quotes-gap.md, qa-artifacts/1-requirements-analysis/AP-2504_requirements-analysis.md, qa-artifacts/.pipeline/AP-2504.md
Verdict: **APPROVE** · Gate A: post the Blocking question on AP-2504 and continue — rule A2
Findings: 0 blocker · 0 major · 1 minor

Inline review by the worker (gate_mode reviewer, run inside a subagent). Every
acceptance criterion and the Creditor Insurance note map to a requirement (AC 1 → REQ-001,
AC 2 → REQ-002, AC 3 → REQ-003, AC 4 → REQ-004, Note → REQ-005); no requirement adds
behaviour the capture does not state; all 13 questions carry an Impact and a Status, and
none is marked Answered.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP-2504_requirements-analysis.md — REQ-004 risk table | The creditor post-submit facts (flash text, contract number on the row) are quoted from `domain`, not from the capture; they are labelled as a baseline only, not as expected results | None required; test cases must keep them record-only for GAP (Q-008) |

Gate A evidence: 5 REQ; 1 Blocking + Open (Q-001, REQ-001 only); 10 Judgement (Q-002 – Q-011); 2 Info (Q-012, Q-013). The ticket had 0 comments, so the question had not been asked before. Questions comment 19460 posted on AP-2504 at 2026-11-03T04:12Z and read back (heading + table rendered); status QC unchanged.

## R2 — Test cases — round 1 — 2026-11-03T05:00:00Z
Reviewed: requirements/AP-2504-generate-contract-for-a-quotes-gap.md, qa-artifacts/.pipeline/AP-2504.md, qa-artifacts/1-requirements-analysis/AP-2504_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2504_test-plan.md, qa-artifacts/3-test-cases/AP2504_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2504_TestCases_006-010.md, qa-artifacts/3-test-cases/AP2504_TestCases_011-011.md, qa-artifacts/3-test-cases/AP2504_ReviewFindings_2026-11-03.md, qa-artifacts/qa-docs/quote-creation.md (Dev sections), qa-artifacts/qa-docs/chubb-insurance.md, qa-artifacts/base-test/test-centralized.md, qa-artifacts/base-test/06-chubb-contract-setup.md (register), qa-artifacts/3-test-cases/AP2505_TestCases_*.md (vehicle 915 exclusion), Jira AP-2504 (comment read back via the tracker CLI)
Verdict: **APPROVE** · Gate B: execute the current cases — rule B3
Findings: 0 blocker · 0 major · 4 minor

Independent review by the qa-reviewer subagent (the worker wrote no R2 section). The
eleven cases cover every acceptance criterion and the Creditor note; every PASS/FAIL hangs
on ticket wording or an objective fault (error page, HTTP 5xx, wrong saved data), and every
point resting on Q-002–Q-011 is record-only. AP2504_002 is the only case blocked by Q-001,
and Q-001 is on the ticket as the QA's comment (read back today; no answer yet), so the
block is justified and limited to criterion 1 as written — AP2504_001 tests the description's
GAP-row statement. The setup routes are confirmed by `domain` (quote-creation.md, Dev AP-2499
section: "Opening either route as a page shows the same content without the modal"; "The old
financing page `/quote/{id}/financing` still works on Dev"), every setup that can still trip
on AP-2526/2527/2528 is BLOCKED naming the bug, and the cases type addresses directly, so no
hidden link can stop them. Vehicle 915 is safe for Chubb contracts: the AutoShield contracts
2697/2698 that made AP-2505 avoid it belong to a different outside service (roadside), and
Chubb has already accepted creditor contracts on this VIN (AVP000160 on quote 6276, staging;
AVP000170 on quote 6480, Dev). The creditor PDF HTTP 500 is record-only in AP2504_007 and
_011 step 5 with the address and the 6480 observation, so Gate C can tell a pre-existing
fault from a new one. AP2504_004's "BLOCKED — test data not on Dev: no co-applicant control"
names a real, recorded gap (Q-012; `domain` shows only a "No applicant" notice) and is
acceptable. No credential value appears in any AP-2504 artifact (compared against the `env`
source's password lines without printing them). The minor points below can be fixed in a
later pass and change no result.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP2504_TestCases_006-010.md — AP2504_007 step 3; AP2504_TestCases_011-011.md — AP2504_011 step 3 | A refusal from Chubb's contract service that names the test data (for example a duplicate VIN, or GAP not set up for dealer 1380) would be recorded as a FAIL of the step, although it is a test-data / outside-service refusal; AP-2505 carries such a rule for AutoShield, this file does not. Risk is low because Chubb accepted two creditor contracts on vehicle 915's VIN | Add one line to the Execution Context: a contract-service banner naming the VIN, the dealer's product set-up or the quote date is recorded with its text and the case is BLOCKED "Chubb refused test data"; any other failure at submit stays a FAIL |
| F-2 | Minor | AP2504_TestCases_006-010.md — AP2504_009 step 1 | Quote C is reused only if its Gap Insurance row shows a contract number, but AP2504_007 step 4 also passes when the contract appears only on `/gap-insurance-contracts`; in that case 009 would build a second quote and create a second real GAP contract for nothing, and its steps 2 and 4 compare row contract numbers that may not exist | Reuse quote C whenever AP2504_007 recorded a contract by either evidence, and in steps 2 and 4 compare against the contract number from the row or from the `/gap-insurance-contracts` list, whichever 007 recorded |
| F-3 | Minor | AP2504_TestCases_006-010.md — AP2504_010 "Why this matters" and step 4; AP2504_TestCases_001-005.md — AP2504_001 Requirement | AP2504_010 grounds "same tab, no modal" on "similar to GAP", which is the open Q-011 territory; the stated basis is the Note's "will be redirected to `/quote/{quoteId}/insurance/create-contract`" (a modal does not change the address on Dev). AP2504_001's "same tab" cites AC 1's then-clause only; its other basis is the description's "should match Esthetic Protection" with AP-2506 AC 1 "opens in the same tab with no modal" | Re-word the Requirement / Why-this-matters lines to cite those sentences; the steps themselves need no change |
| F-4 | Minor | AP-2504_requirements-analysis.md — Q-012; AP2504_TestCases_001-005.md — AP2504_004 | Q-012 is classed Info ("no test result depends on it"), yet AP2504_004 — the only coverage of the co-owner parts of AC 2 and AC 3 — becomes BLOCKED when it has no answer | Re-class Q-012 as Judgement at the next s1 re-run (the one owed for Q-001) and keep AP2504_004's BLOCKED reason naming Q-012 |

Not re-raised (batch decision): the execution environment is Dev.
Gate B evidence: Pass 1 has 0 gaps; Pass 2 has 9 proposals, none High (5 Medium, 4 Low) → B3; unpromoted proposals P1–P9.

## R3 — Execution results — round 1 — 2026-11-03T04:45:00Z
Reviewed: qa-artifacts/.pipeline/AP-2504.md, requirements/AP-2504-generate-contract-for-a-quotes-gap.md, qa-artifacts/1-requirements-analysis/AP-2504_requirements-analysis.md (Q-001, Q-008 to Q-010), qa-artifacts/3-test-cases/AP2504_TestCases_001-005.md, AP2504_TestCases_006-010.md, AP2504_TestCases_011-011.md, qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2504_2026-11-03.md, every file in qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/ (both network .txt files read in full), qa-artifacts/5-testing-report/AP-2504_run-summary.md, qa-artifacts/qa-docs/quote-creation.md (AP-2504 section), Jira AP-2504 (comments), the open AP bugs returned by 23 duplicate searches, and the AP-2519 description. Dev browser re-check, read-only (GET requests only, nothing submitted).
Verdict: **APPROVE** · Gate C: AP2504_006 → File new — rule C4; record-only observations → see the Gate C plan below
Findings: 0 blocker · 0 major · 3 minor

The execution log is complete and can be trusted. It covers 11 cases (9 PASS, 1 FAIL, 1 BLOCKED), the counts and the 81.8% pass rate match the per-case rows, every screenshot path exists, and the ten images inspected show what the Actual Results claim. The one FAIL holds against the wording of AC 3, "financing values are pre-filled": the dealer entered "Monthly" and "Financing", and the quote page shows those values, but the contract page shows the internal codes `FREQUENCY_MONTHLY` and `TYPE_FINANCING` instead. I re-checked this on Dev. The GAP page for quote 6562 shows the codes in English and in French. The creditor page shows the same codes; I checked it read-only on creditor quote 6539, because quote 6566 now has a contract and redirects. On the French page, five labels stay in English: Creditor address, Due type, Financing type, Loan term and Residual value.

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | Execution log, AP2504_006 step 3; screenshots folder | The French and creditor-page occurrences of the raw codes are backed only by a text line in `AP2504_006-step3-FinancingRawCodes_network_fail.txt`. No screenshot shows them. The reviewer confirmed both on Dev, so the result is not affected. | When s5 files the bug, describe the French and creditor occurrences in it: the GAP page of quote 6562 with `?_locale=fr`, and the creditor page of any quote that has a creditor quote and no contract. |
| F-2 | Minor | Screenshots AP2504_003-step4 and AP2504_005-step3; AP2504_006-step3 and step5; AP2504_009-step2 and step4 | The two files in each pair are byte-identical (same MD5), so one capture is filed under two step names. Each image still shows what both steps claim, because the page state was the same, but the names suggest separate captures. | In later runs, take a separate capture for each step, or reference the one image from both steps. No re-run is needed. |
| F-3 | Minor | qa-artifacts/qa-docs/quote-creation.md, line 101 | The AP-2493 line saying `/gap-insurance-contracts` is empty (2026-11-02) is now out of date, because contract AVPG000064 exists. The write-back itself only adds content: the new AP-2504 section (lines 614–655) is appended at the end of the file and dated, and no earlier section mentions AP-2504. The file is untracked in git, so no earlier version was available to compare against. | Optionally add a dated refresh note under line 101 at the next write-back, and keep the old line. |

Screenshots inspected:
- AP2504_006-step3-FinancingRawCodesShown_fail.png: matches (Payment frequency FREQUENCY_MONTHLY, Financing type TYPE_FINANCING, English page)
- AP2504_001-step5-GapContractFullPage_pass.png: matches
- AP2504_004-step5-CoOwnerPrefilled_pass.png: matches
- AP2504_005-step4-OwnerPrefilled_pass.png: matches
- AP2504_007-step4-GapRowContractNumber_pass.png: matches (AVPG000064)
- AP2504_007-step5-GapPdfHttp500Recorded_pass.png: matches (technical-error page, in French)
- AP2504_009-step3-RedirectFlashCreditorAlreadyCreated_pass.png: matches
- AP2504_010-step4-CreditorContractFullPage_pass.png: matches
- AP2504_011-step4-CreditorRowContractNumber_pass.png: matches (AVP000171)

Other checks:
- BLOCKED AP2504_002: Q-001 is still unanswered. AP-2504 has one comment, the QA questions comment, and no reply. The BLOCKED reason is valid.
- Run summary and run-state times: the run state was written at 04:35:51Z and the run summary at 04:36:10Z, both after the execution log (04:35:02Z). The "Updated 04:36:10Z" line is the real write time, and the summary shows the final results (9 PASS, 1 FAIL, 1 BLOCKED, with every quote and contract listed). No finding.
- Credentials: the Dev username and password values do not appear in any AP-2504 artifact or screenshot file name. I compared exact strings without printing the values. The two network .txt files hold only the method, URL, status and content type of each request, and no cookie, token or authorization header.

Gate C plan for s5. I searched open AP bugs for each of these phrases: FREQUENCY_MONTHLY, TYPE_FINANCING, FREQUENCY, raw code, enum, translation, untranslated, not translated, label English French, financing information, payment frequency, contract pdf, contract-pdf, PDF 500, chubb, already created, Creditor insurance already, wrong product message, invoice, date of birth, co-applicant, GAP contract, create-contract. I also listed every bug created in the last 10 days (AP-2507 to AP-2532) and searched the descriptions of AP-2526, AP-2527, AP-2528, AP-2532, AP-2519, AP-2508 and AP-2517 for the codes.
- **AP2504_006 (FAIL): file new, one bug (rule C4).** No open bug covers the financing section of the contract pages or raw codes. AP-2526, AP-2527 and AP-2528 (from AP-2499) are about the add modal, and AP-2530, AP-2531 and AP-2532 (from AP-2503) are about the warranty page. The bug should name both pages, GAP `/quote/{id}/insurance/create-contract/gap` and creditor `/quote/{id}/insurance/create-contract`, in English and French. Both pages show the same "Financing information" list with the same wrong values, so this is one defect. Add the five English labels on the French page to the same bug as a second point: they are a translation gap in the same section, and a separate bug would add a second triage item for the same fix area. Suggested priority: Medium.
- **(a) Contract PDFs return HTTP 500: file new, one bug, linked "relates to" AP-2519 and AP-2512.** No open bug is about the Chubb contract PDFs. AP-2519 mentions `/quote/6480/chubb/insurance/contract-pdf` returning 500 only as secondary evidence in its Notes, which is a partial match (reviewer rule E2). AP-2512 is the Permaplate PDF returning 500. I re-checked on Dev: `/quote/6564/gap/insurance/contract-pdf`, `/quote/6566/chubb/insurance/contract-pdf` and `/quote/6480/chubb/insurance/contract-pdf` all return 500. The creditor PDF already failed before this change and the GAP PDF has no earlier baseline, so this is not an AP-2504 regression: "PDF behaviour stay[s] unchanged" holds for the creditor PDF. Do not count it against AP-2504's outcome, and keep step 5 of AP2504_007 and AP2504_011 as PASS (record-only).
- **(b) No invoice for either Chubb contract: leave it recorded.** The ticket says invoice behaviour "stay[s] unchanged", and no baseline shows that a Chubb contract has ever created an invoice. Q-008 and Q-009 already ask the author about this, so it is not an objective fault.
- **(c) "Creditor insurance already created" on the GAP redirect: file new (rule C4), Low.** The message is false: quote 6564 has no creditor insurance, and the screenshot shows "Creditors insurance – None Selected –". The redirect itself is acceptable under Q-010; only the message text is wrong. No duplicate was found.
- **(d) Co-applicant date of birth shown one day early on the quote page: file new as a standalone bug, Low, not linked as an AP-2504 failure.** This is an objective display fault. The stored value is 1987-03-20, and the contract page pre-fills it correctly, but the quote page shows "Thursday, March 19, 1987". It is outside AP-2504's acceptance criteria. No duplicate was found.

## R1 — Requirements analysis — round 1 — 2026-11-15T10:05:00Z
Reviewed: requirements/AP-2504-generate-contract-for-a-quotes-gap.md (incl. *Ticket changes since capture — 2026-11-15*), qa-artifacts/1-requirements-analysis/AP-2504_requirements-analysis.md (whole file, incl. *Knowledge lookup — 2026-11-15*), qa-artifacts/.pipeline/AP-2504.md, qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2504_2026-11-03.md, .claude/skills/stlc-requirements-analyst/SKILL.md Steps 3b–3c, .claude/skills/stlc-ticket-pipeline/routing.md Gate A, .claude/skills/providers/jira.md (knowledge lookup query); Jira read via the tracker CLI: AP-2504 (status, comments), AP-2544, AP-2545, AP-2546, AP-2550, AP-2431, AP-2493 (description + Acceptance Criteria field, read in full)
Verdict: **APPROVE** · Gate A: do not post (Q-001 already asked on 2026-11-02, comment 19460, and 2026-11-08, comment 19533); continue — rule A2
Findings: 0 blocker · 0 major · 4 minor

Independent review of the 2026-11-15 re-analysis (knowledge lookup on every Open question). Every quoted answer was read in Jira in full and is verbatim: AP-2544 (Acceptance Criteria field: "All inputs are read-only except for the VIN input.", "THEN the form is prefilled with the quote’s vehicle information.", "a dealer provide the VIN (required) and In service date (optional)", "saves the vin and service date in vehicle."), AP-2545 ("WHEN a dealer generates a contract and is succesfull. THEN it update the quote’s client information"), AP-2546 (summary with the detail collapsed behind "More"), AP-2550 (description: "The Owner and Co-owner information can always be updated."), AP-2431 (Done; "Download contract PDF button with the PDF icon" under the GAP (Chubb) list), AP-2493 ("Finalized products keep their existing download action…"); "The change affects all quote products:" with GAP and Creditor Insurance is in all three of AP-2544/2545/2546 (Deploy to staging). Every value the Accepted answers cite (Q-002 heading/differences, Q-003 GAP and creditor Program Summary lines, Q-004 absent section, Q-005 nine fields, Q-007 "This value should not be blank." and the required-field lists, Q-008 302 → details + flash + AVPG000064 + PDF link + no invoice, Q-010 withdrawn menu + redirect, Q-012 "Add co-applicant" modal) matches the 2026-11-03 execution log line for line. The analysis can be trusted; the minor points change no result in this batch, where AP-2504 stops at s1.

Q-001 stays Blocking + Open correctly: Step 3b sends a contradiction inside the ticket's own text to Open, not to the lookup, and AC 1's *when* clause ("from the Extended Warranty row actions") contradicts its own *given*/*then* clauses and the description ("the “Generate Contract” action for GAP product"). AP-2504 has three comments, all by the QA account (19460, 19462, 19533), no answer, and nothing was posted today. AP2504_002 stays BLOCKED; no other case is unblocked. The AC-wins limit is kept: read-only financing is set by AC 3 (Q-005), the raw codes stay AP-2538 and the wrong-product flash stays AP-2540; the HTTP 500 stays AP-2539 as an objective fault.

AP-2550 as evidence (orchestrator's question): it is valid lookup evidence — Step 3c searches any status, and it overrides no AP-2504 acceptance criterion (AP-2504 says nothing on owner/co-owner editability), so the orchestrator's "In Progress does not supersede" rule is not engaged. It is not load-bearing for the owner: the delivered AP-2545 already makes the owner card the /quote/{quoteId}/client inputs and updates the client on success. For the co-owner it is the only Story, and it agrees with the 2026-11-03 observation (co-owner fields editable, AP2504_004 step 5). See F-1.

Attribution note (orchestrator's question): agreed. AP-2504's own text states nothing about vehicle editability, so an editable vehicle field cannot fail AP-2504 on a build that does not carry AP-2544 — failing it would be invented scope (check 1.2). On a build that carries AP-2544 (delivered, same page), the orchestrator's supersession decision applies and the Answered expectation holds. The note lacks an observable marker for which build is under test — see F-2.

Spot-checked lookups with the adapter's knowledge-lookup query (`issuetype in (Story, Task) AND text ~ "<words>"`, key,type,status,summary, --paginate 0:100): `chubb contract invoice` → AP-2504 only (matches "none besides AP-2504", Q-008); `co-owner information` → AP-2550, AP-2504 (matches Q-004/Q-006); `add co-applicant` → AP-2504, AP-2405 (matches Q-012). Credentials: the `env` source's login/password values do not appear in the analysis, the capture or the run state (exact-string comparison, values not printed).

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | Minor | AP-2504_requirements-analysis.md — Q-006 Answer column and the *Later Stories used as answers* note | Co-owner editability rests only on AP-2550, which is In Progress (not delivered); the attribution note covers AP-2544 only, so a future build where the co-owner fields are read-only could be failed against AP-2504 on an undelivered Story. The owner part is also covered by the delivered AP-2545 but the answer does not say so | At the next s1 re-run, add to the note: "AP-2550 is In Progress; a co-owner field that is not editable on a build without AP-2550 is recorded, not failed, for AP-2504", and cite AP-2545's "the “Owner information” card show the same input from /quote/{quoteId}/client" as the delivered basis for owner editability |
| F-2 | Minor | AP-2504_requirements-analysis.md — *Later Stories used as answers* note | "Whether they are on Dev today is not known" leaves the executor no way to apply the attribution rule | Name an observable marker of AP-2544 on the build (the "In service date" input in the vehicle card, or the vehicle card being a form with every input read-only except the VIN) and of AP-2546 (financing detail collapsed behind "More"), so s3 can write the check |
| F-3 | Minor | AP-2504_requirements-analysis.md — REQ-002 / Q-005 | Delivered AP-2546 collapses the financing detail behind "More", and AP-2544 calls the card "Vehicle information" while AC 2 names "Vehicle identification"; the analysis does not say how s3 should treat either on a build that carries them (Q-005 accepts nine fields seen flat on 2026-11-03) | At the next s1 re-run, add a risk line: on a build with AP-2546, read the nine fields after "More"; the heading "Vehicle identification" stays judged by AC 2 unless a delivered Story explicitly renames it (AP-2544 does not state a rename) |
| F-4 | Minor | AP-2504_requirements-analysis.md — Q-012 | R2 round 1 F-4 asked to re-class Q-012 from Info to Judgement at the next s1 re-run (AP2504_004 is BLOCKED without it); it is still Info. It is now Accepted, so no gate or result changes | Re-class Q-012 to Judgement at the next s1 re-run |

Gate A evidence: 5 REQ, every AC and the Creditor note mapped (AC 1 → REQ-001, AC 2 → REQ-002, AC 3 → REQ-003, AC 4 → REQ-004, Note → REQ-005); 13 questions, each with Impact and Status; 1 Blocking + Open (Q-001, on REQ-001 only) → not every requirement is blocked → A2; Q-001 already asked in comments 19460 and 19533 (no answer) → nothing to post; Q-006, Q-009, Q-011 Answered with verified quotes; Q-002–Q-005, Q-007, Q-008, Q-010, Q-012, Q-013 Accepted, queries named, never posted. Per the orchestrator's batch decision, AP-2504 stops at s1 in this batch (no case unblocked); stages s2–s7 stand from 2026-11-03.
