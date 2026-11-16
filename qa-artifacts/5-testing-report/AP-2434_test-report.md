# Test Execution Report

**Report ID:** TR-20261105-001
**Project:** Avantage Plus v2 — Admin API and admin portal (Jira project AP)
**Test Cycle:** AP-2434 — Admin API: create warranty notes (single-ticket STLC run, run folder `5.0.0`)
**Application version:** Not known — the Dev environment does not show a build number; fix version on the ticket is 5.0.0
**Environment:** Dev — https://v2dev.garantieavantageplus.ca
**Date:** 2026-11-05 (written 2026-11-05T05:54Z)
**Prepared by:** QA Agent — Test Reporter Skill (stlc-worker, stage `report`)

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** Only 3 of 8 test cases passed (37.5%, against the 90% the project requires), and one High-severity bug (AP-2547) is open: the HTML note body the ticket is mainly about is accepted by the API and then lost.

---

## Executive Summary

The QA team tested the new admin API call that lets another system add a note to a warranty contract, on the Dev environment, with 8 test cases covering the ticket's 4 requirements. The safety checks work: calls without a key or with a wrong key are refused, incomplete calls are refused, and a call for a warranty that does not exist is refused without touching any other warranty. But the main purpose of the ticket does not work: the note's HTML body (the `file_content` field, which the ticket says must allow more than 255 characters) is accepted with a "created successfully" answer and then stored nowhere, so it never appears in the admin area (AP-2547, High). Two smaller problems were also found: an invalid "public" flag value crashes the server instead of returning a clear error (AP-2548, Medium), and the key is refused when sent the way the ticket describes, in the "Authorization: Bearer" header — only a different header works (AP-2549, Medium). The story should stay in QC until AP-2547 is fixed and the author answers which field is the note body.

---

## Test Metrics

_The pass rate is the share of test cases that passed, out of all cases except skipped ones._

| Metric | Value |
|---|:---:|
| Requirements covered | 4 of 4 (every requirement has at least one executed case; none is fully passing) |
| Total test cases | 8 |
| Passed | 3 (37.5%) |
| Failed | 5 (62.5%) |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **37.5% (3 of 8)** |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |
| Defect density | 0.375 (3 bugs ÷ 8 test cases) |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 1 | 0 | 1 |
| Medium | 2 | 0 | 2 |
| Low | 0 | 0 | 0 |
| **Total** | **3** | **0** | **3** |

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished
(the test plan's exit criteria), and whether each one actually holds. Anything marked ❌
is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 100% (AP2434_001, 003, 004 all ran) | ✅ |
| Every test case has a status other than Not Run | 8 of 8 | 8 of 8 | ✅ |
| Pass rate | ≥ 90% | 37.5% | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | 0 (test plan: no open Critical or High bug against AP-2434) | 1 (AP-2547) | ❌ |
| Every Judgement question has the build's behaviour recorded | Yes | Yes, except Q-008 (HTML/script display) — untestable while the body is lost | ❌ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Authenticate the call with an API key (AP2434_001, 004, 005) | 3 | 2 | 1 | 0 | 67% |
| REQ-002 — Create a note through POST multipart form data (AP2434_001, 002, 006, 007) | 4 | 1 | 3 | 0 | 25% |
| REQ-003 — `file_content` accepts HTML longer than 255 characters (AP2434_003, 008) | 2 | 0 | 2 | 0 | 0% |
| REQ-004 — The created note is displayed in the admin area (AP2434_001, 002) | 2 | 0 | 2 | 0 | 0% |
| **Total (distinct test cases)** | **8** | **3** | **5** | **0** | **37.5%** |

A case that covers several requirements is counted under each, so the rows add up to
more than 8; the total row counts each case once.

**Per test case**

| TC ID | Title | Priority | Result | Failing step — what happened | Bug |
|---|---|:---:|:---:|---|---|
| AP2434_001 | A valid API call with the key creates a public note that appears on the warranty | High | ❌ FAIL | Step 2: the key in the `Authorization: Bearer` header (as the ticket says) is refused with 401 "Missing API key". Step 4: the note made with `X-API-KEY` (note 64) shows title, description and "Public", but not the `file_content` body | AP-2549, AP-2547 |
| AP2434_002 | A note sent with is_public "false" is created and appears | Medium | ❌ FAIL | Step 3: note 68 is marked "Private", but its body is missing | AP-2547 |
| AP2434_003 | HTML just over 255 characters is kept in full; a 2,000-character note is not cut | High | ❌ FAIL | Step 4: the 255-, 256- and 2,000-character bodies were all accepted (201) and none of them is shown — not one letter | AP-2547 |
| AP2434_004 | A call with no API key | High | ✅ PASS | — (401 "Missing API key", no note stored) | — |
| AP2434_005 | A call with a wrong API key | Medium | ✅ PASS | — (401 "Invalid API key", no note stored) | — |
| AP2434_006 | Calls missing the warranty ID or the title | Medium | ✅ PASS | — (400 "Missing required fields", no note stored) | — |
| AP2434_007 | Unknown warranty ID, or is_public other than true/false | Medium | ❌ FAIL | Step 3: `is_public=maybe` returns HTTP 500 (2 of 2 tries). The unknown warranty (999) gets a clean 404 | AP-2548 |
| AP2434_008 | A script tag in the HTML note text | Medium | ❌ FAIL | Step 3: note 69 created, but "Before", "bold" and "After" are all missing (body lost). The script did not run, but only because nothing was kept | AP-2547 |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | Admin API POST /api/admin/warranty-notes accepts the file_content HTML body (201) but stores and shows it nowhere — the note body is silently lost at every length (AP2434_001, 002, 003, 008) | High | P1 | REQ-003, REQ-004 | [AP-2547](https://garantieavantageplus.atlassian.net/browse/AP-2547) | Open (Backlog) |
| BUG-002 | Admin API POST /api/admin/warranty-notes returns HTTP 500 when is_public is not true/false (e.g. 'maybe') instead of a 400 (AP2434_007) | Medium | P2 | REQ-002 | [AP-2548](https://garantieavantageplus.atlassian.net/browse/AP-2548) | Open (Backlog) |
| BUG-003 | Admin API POST /api/admin/warranty-notes refuses the key in the Authorization Bearer header that AP-2434 specifies (401 Missing API key); only X-API-KEY works (AP2434_001) | Medium | P2 | REQ-001 | [AP-2549](https://garantieavantageplus.atlassian.net/browse/AP-2549) | Open (Backlog) |

All three are new tickets (Gate C rule C4, decided by the independent reviewer), linked to
AP-2434 and assigned to Ken Nguyen.

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2434-admin-api-create-warranty-notes.md` | 2026-11-01 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2434_requirements-analysis.md` | 2026-11-01 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2434_test-plan.md` | 2026-11-01 |
| Test Cases | `qa-artifacts/3-test-cases/AP2434_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP2434_TestCases_006-008.md` | 2026-11-01 (results 2026-11-05) |
| Review findings | `qa-artifacts/3-test-cases/AP2434_ReviewFindings_2026-11-01.md` | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2434_2026-11-05.md` | 2026-11-05 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2434_bug-report.md` | 2026-11-05 |
| Screenshots and API responses | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/` (29 files: 12 screenshots, 17 response or network-line text files) | 2026-11-05 |
| Review record | `qa-artifacts/7-reviews/AP-2434_review.md` | 2026-11-01 – 2026-11-05 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2434_test-report.md` | 2026-11-05 |

---

## Risks and Observations

- **Q-008 (how HTML and `<script>` tags are shown) is untested.** The ticket asks for HTML in the note body, which raises the question whether a script sent through the API could run in an admin's browser. AP2434_008's script did not run, but only because the body is never stored, so this run says nothing about whether the admin area is safe. When AP-2547 is fixed, its re-test must re-run AP2434_008 as well as 001, 002 and 003.
- **Q-007 is the root question behind AP-2547:** the ticket describes both `description` and `file_content` as "description of the note". The bug asks the author which one is the body shown in the admin area. The API's own documentation lists a `file` (PDF upload) field and no `file_content`.
- **Q-001 — endpoint path:** the path exactly as the ticket writes it, `POST /api/admin/warranty/-notes`, answers 405 "Method Not Allowed" (only GET allowed). The tests used the documented path `/api/admin/warranty-notes`. This is recorded as an observation for the author, not a failure.
- **Header:** every passing call used `X-API-KEY`, as the API documentation requires; the ticket's `Authorization: Bearer` form is refused (AP-2549). Either the API or the ticket must change.
- Behaviour recorded for the open Judgement questions (not failures): a successful call returns 201 with `noteId` (Q-003); the 400 for a missing field lists all three required fields whichever one is missing (Q-004); a missing key gives 401 "Missing API key" and a wrong key 401 "Invalid API key" (Q-005); the note appears on the warranty page `/admin/warranty/{id}` with title, description, Public/Private badge, author ("Created by" the admin who owns the key) and local time (Q-006); a 2,000-character body is accepted without a length message (Q-009).
- The test cases' Execution Context still names staging as the host and is out of date on the key row (reviewer finding F-4); refresh it when the cases are next touched, at the re-test.
- Test data left on Dev: warranty notes 64–69 on warranty contract 827 (APOP01-827, dealer 1380). The API has no delete endpoint.

---

## Recommendations

1. Fix AP-2547 (High) before release: store the `file_content` HTML body and show it with the note in the admin area — after the author answers Q-007 on which field is the body.
2. When AP-2547 is fixed, re-test AP2434_001, 002, 003 and 008; AP2434_008 then answers Q-008 (whether a stored `<script>` is removed or shown safely).
3. Fix AP-2548: return a 400 with a clear message when `is_public` is not true or false.
4. Resolve AP-2549 together with Q-001: either accept the key in `Authorization: Bearer` and the ticket's path, or correct the ticket so integrators use `X-API-KEY` and `/api/admin/warranty-notes`.
5. Keep AP-2434 in QC; re-run the full set (`AP-2434 --from execute`) once the three bugs are fixed.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-05 |
| QA Lead | Vinh Le - QC | Pending | | |
| Development Lead | Not known | Pending | | |
| Product Owner | Ken Nguyen | Pending | | |
