# Test Execution Report

**Report ID:** TR-20261107-001
**Project:** AP (Avantage)
**Test Cycle:** AP-2507 bug re-test — "Clicking "Décoder" on the new-quote vehicle form saves a quote and empties the form instead of re-rendering it pre-filled" — run folder no-sprint
**Application version:** Dev (https://v2dev.garantieavantageplus.ca), footer "Avantage Plus System v2.0.0", page bundle `/build/app.18b4959e.js` — the build carrying AP-2533's decoder change. No build number is shown by the application.
**Environment:** Dev
**Date:** 2026-11-07
**Prepared by:** QA Agent — Test Reporter Skill (stlc-worker, QA batch)

---

## Verdict

> # ✅ PASS — Ready for Release

**Rationale:** All 3 of 3 test cases passed on Dev (100%, above the 90% threshold), no bug was found and none is open, so the problem reported in AP-2507 — one "Décoder" click saving an unwanted quote and emptying the form — no longer happens on the build tested.

---

## Executive Summary

AP-2507 reported that on the "Create a quote" vehicle form, clicking the "Décoder" button
next to the vehicle identification number (VIN) saved a new quote straight away and left
the form empty. Dealers never saw the decoded vehicle, could not name the quote first, and
cannot delete the quote that was created. The developer said the fix was delivered with
another ticket, AP-2533. The QA team first checked that this fix is actually in the
application running on the Dev environment, then re-tested with 3 test cases: the original
steps, and two neighbouring checks (re-checks of features close to the change, to be sure
nothing else broke). All 3 passed. Clicking "Décoder" now fills in Ford, Focus and 2008
and saves nothing; the quote is saved only when the dealer clicks Save, with the decoded
vehicle and with the quote name the dealer typed. A second, independent run made earlier
today for AP-2477 saw the same result. The bug can be closed. The result applies to Dev
only; Staging was not tested.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 1 of 1 (the bug report is the requirement) |
| Total test cases | 3 |
| Passed | 3 (100%) |
| Failed | 0 (0%) |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **100% (3 of 3)** |
| Pass rate threshold | 90% |
| Threshold met? | ✅ Yes |

The pass rate is the share of test cases that passed, out of every case except skipped
ones: 3 passed ÷ (3 total − 0 skipped) = 100%. Defect density (bugs per test case) is
0 ÷ 3 = 0.

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 |
| Low | 0 | 0 | 0 |
| **Total** | **0** | **0** | **0** |

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

There is no test plan for this ticket (a bug re-test skips planning), so the default exit
criteria apply.

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 100% (AP2507_001, 002 — 2 of 2) | ✅ |
| Pass rate | ≥ 90% | 100% (3 of 3) | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 2 | 0 | ✅ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| AP-2507 — clicking "Décoder" re-renders the form pre-filled with the decoded vehicle and saves no quote until the dealer clicks Save | 3 | 3 | 0 | 0 | 100% |
| **Total** | **3** | **3** | **0** | **0** | **100%** |

| TC ID | What was checked | Priority | Result |
|---|---|:---:|:---:|
| AP2507_001 | Build check first (read-only): the page bundle `/build/app.18b4959e.js` builds the decoder key as `i+"[novalidate]"` from the form name, with no hardcoded `vehicle[novalidate]` — fix present (table row 1). Then, with Quote name empty and VIN `1FAHP35NX8W239204`, one "Décoder" click answered 200 (not 302), the form came back with Ford / Focus / 2008, and the top of `/quotes` stayed at 6599 — the re-test of the reported bug | High | ✅ PASS |
| AP2507_002 | After the decode, the dealer's own Save created exactly one quote (6600) on a new vehicle (1155) holding Ford Focus 2008 and the VIN; the decoded details were recorded without a verdict (regression) | High | ✅ PASS |
| AP2507_003 | A quote name typed before "Décoder" was still in the form after the decode and was saved with quote 6601 (vehicle 1156) (regression) | Medium | ✅ PASS |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| — | No defects found in this run | — | — | — | — | — |

Gate C (the check before filing bugs) was skipped because no case failed — decided by the
independent qa-reviewer (R3 round 1, APPROVE, 0 findings). No bug was filed or linked and
nothing was recorded against AP-2507 as a failure.

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2507-decoder-saves-quote-and-empties-form.md` | 2026-11-07 |
| Requirements Analysis | Not written — skipped in the bug re-test flow (the bug report is the requirement) | — |
| Test Plan | Not written — skipped in the bug re-test flow | — |
| Test Cases | `qa-artifacts/3-test-cases/AP2507_TestCases_001-003.md` | 2026-11-07 (reworked after R2 round 1) |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2507_2026-11-07.md` | 2026-11-07 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2507_bug-report.md` | 2026-11-07 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2507/` (8 .png, 4 .txt) | 2026-11-07 |
| Review record | `qa-artifacts/7-reviews/AP-2507_review.md` | 2026-11-07 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2507_test-report.md` | 2026-11-07 |

**Evidence.** Screenshots: `AP2507_001-step3-DecodePrefillsFordFocus2008_pass.png`,
`AP2507_001-step4-QuotesTopStill6599NoDecodeQuote_pass.png`,
`AP2507_002-step2-Quote6600DetailsVehicleSaved_pass.png`,
`AP2507_002-step2-QuotesOneNew6600_pass.png`,
`AP2507_002-step4-Vehicle1155EditFordFocus2008_pass.png`,
`AP2507_003-step3-NameKeptAfterDecode_pass.png`,
`AP2507_003-step4-Quote6601NameOnDetails_pass.png`,
`AP2507_003-step4-QuotesList6601Named_pass.png`. Text records (no cookies, tokens or
credentials): `AP2507_001-step1-BuildCheckNovalidate_pass.txt` (the two `novalidate`
lines in `app.18b4959e.js`, word for word), `AP2507_001-step2-DecoderPostRequest_pass.txt`
(POST `/quote/new/edit-vehicle` → 200, body field names including
`quote_vehicle[novalidate]`), `AP2507_001-step4-QuotesTopRows_pass.txt` (top-row ids 6599,
6598, 6597 — the list shows no id column) and `AP2507_002-003-QuotesListIds_pass.txt`.
The qa-reviewer inspected all 12 files at R3 and found each matches its result.

**Corroboration.** Today's AP-2477 run (09:47–09:58 UTC, same Dev build) recorded
AP2477_007 — the case that first raised this bug — as PASS: the decode answered 200,
re-rendered Ford / Focus / 2008, and saved nothing. Two independent runs agree.

---

## Risks and Observations

- **The fix lives on another ticket.** The developer (Minh Lưu, 2026-11-03) states the fix
  was delivered by AP-2533 ("Update quote form UI", Story, status QC), not by a change on
  AP-2507. The build check confirmed that change is on Dev. If AP-2533 is reverted or held
  back from a release, this bug comes back with it, so the two should ship together.
- **Dev only.** Staging was not tested. The related bug AP-2492 (the same form returns
  HTTP 404 on Staging) is still in Backlog, so this form cannot be checked on Staging yet.
- **Note for the QA lead — engine size unit (not judged here).** After the decode the
  form's hidden engine size unit is "kW", while the saved vehicle 1155 shows "Litre". This
  is already filed as **AP-2552** (Medium) from AP2477_008; AP2507_002 step 4 only records
  it. It does not affect this verdict.
- **Other record-only details.** The decode now also returns hidden cylinders, engine
  size, fuel type and an inventory id (`id=863`, an existing vehicle with this VIN). Save
  did not reuse vehicle 863; it created new vehicles 1155 and 1156.
- **Test data left behind on Dev (dealers cannot delete quotes):**
  - quote **6600** "QA-AP2507-002-105955" with vehicle **1155** (Ford Focus 2008, VIN `1FAHP35NX8W239204`) — AP2507_002;
  - quote **6601** "QA-AP2507-003-110048" with vehicle **1156** (Ford Focus 2008, VIN `1FAHP35NX8W239204`) — AP2507_003.
  - AP2507_001 saved nothing. Quote 6437 and vehicles 1067 / 915 (left by AP-2477) were not used.

---

## Recommendations

1. Close AP-2507: post the bug re-test comment and move it to `Done` (see the outcome plan below).
2. Release AP-2533 together with this fix, or not at all — AP-2507's fix is AP-2533's change to the decoder script.
3. Re-run AP2507_001 on Staging once AP-2492 is fixed and the form exists there.
4. Track the kW / Litre engine size unit in AP-2552; no action on AP-2507 is needed for it.

### Outcome plan for Gate D (for review by R4 — not applied by this stage)

Source: the *QA outcome rules* in `qa-artifacts/qa-config/tools.md` §2 and
`stlc-ticket-pipeline/routing.md` §3.2 (bug tickets). `apply_mode: automatic`.

| # | Ticket | Rule | Action | Evidence |
|---|---|---|---|---|
| 1 | AP-2507 (bug, re-tested) | §3.2 — re-test result of the bug's test cases is **All PASS** | Post the bug re-test comment (template §4.2): "Re-test PASSED — 2026-11-07", Environment: Dev, Build/run: no-sprint, one row per case AP2507_001–003 all PASS, "The reported behaviour no longer occurs: clicking Décoder re-renders the form with Ford / Focus / 2008 and saves nothing; the quote is saved only on Save, with its name" | Execution log: 3 PASS · 0 FAIL · 0 BLOCKED; R3 APPROVE |
| 2 | AP-2507 | §3.2 All PASS | Move to `bug_pass_status` = **Done**, then read the ticket back to confirm | Same |
| 3 | AP-2507 | §3.2 — re-assignment only on FAIL or BLOCKED | **No assignee change** | No FAIL or BLOCKED case |
| — | Other bugs | §3.2 second clause | No action — `AP-2507_bug-report.md` lists no bug tickets. AP-2552 is AP-2477's bug and its case did not run here | 0 defects |

No story rules (§3.1) apply, because AP-2507 is a bug. AP-2507 is in status QC (the
project's ready-for-QA status). A transition the tracker refuses is reported with the
current status, never retried with another status.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | PASS | _(automated)_ | 2026-11-07 |
| QA Lead | Not known — not named in the ticket | Pending | | |
| Development Lead | Not known — not named in the ticket | Pending | | |
| Product Owner | Not known — not named in the ticket | Pending | | |
