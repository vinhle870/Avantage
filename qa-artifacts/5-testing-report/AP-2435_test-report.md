# Test Execution Report

**Report ID:** TR-20261105-001
**Project:** AP (Avantage)
**Test Cycle:** AP-2435 story test — "Admin API - warranty search" — run folder 5.0.0 (fix version)
**Application version:** Dev (https://v2dev.garantieavantageplus.ca), the build deployed on Dev on 2026-11-05. The API and the application show no build number.
**Environment:** Dev
**Date:** 2026-11-05 (executed 06:00–06:04 UTC; report written 2026-11-05T06:17Z)
**Prepared by:** QA Agent — Test Reporter Skill (stlc-worker, QA batch)

---

## Verdict

> # ✅ PASS — Ready for Release

**Rationale:** All 12 of 12 test cases passed on Dev (100%, above the 90% threshold), no bug was found and none is open, and no open question blocks a requirement. Three behaviours the ticket does not settle (a 10-result cap that drops matching contracts, the refused Bearer header, and client personal data in every result) go to the author as questions; none of them breaks a sentence the ticket states.

---

## Executive Summary

AP-2435 adds a search to the administration API: a program holding an admin API key
(a secret password for programs) sends one search word and gets back the warranty
contracts whose vehicle VIN contains it, or whose client postal code or telephone number
equals it. The QA team tested it on the Dev environment with 12 test cases covering all
five requirements, by sending real requests to the search address and reading the
answers. All 12 passed: a part of a VIN, a whole VIN, a postal code with or without its
space, and a telephone number written four different ways all find the reference
contract; a search without a key, or with a wrong key, is refused and returns no client
data; and a search that matches nothing, or has no search word, gets a clean answer
rather than a server error. No defect was found. Three points need the product owner's
decision before customers rely on the search: results stop at 10 with no way to get the
rest, so some matching contracts are silently left out; the key works only in the
`X-API-KEY` header, not in the "Authorization Bearer" header the ticket's text names;
and each result carries the client's name, email, address and telephones, while the
ticket shows only the contract number.

---

## Test Metrics

_The pass rate is the share of test cases that passed, out of all cases that were meant
to run (skipped cases are left out)._

| Metric | Value |
|---|:---:|
| Requirements covered | 5 of 5 |
| Total test cases | 12 |
| Passed | 12 (100%) |
| Failed | 0 (0%) |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **100% (12 of 12)** |
| Pass rate threshold | 90% |
| Threshold met? | ✅ Yes |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 |
| Low | 0 | 0 | 0 |
| **Total** | **0** | **0** | **0** |

Defect density (bugs per test case): 0 of 12 = 0.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet.
They come from the test plan (AP-2435_test-plan.md §5)._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| Every test case has a status other than Not Run | 12 of 12 | 12 of 12 (all PASS) | ✅ |
| All High-priority TCs executed | 100% | 100% (6 of 6: AP2435_001, _003, _004, _005, _008, _009) | ✅ |
| Pass rate | ≥ 90% | 100% (12 of 12) | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | 0 | 0 | ✅ |
| Every Judgement question has the build's behaviour recorded | Q-001 to Q-011 | Recorded for Q-001 to Q-011 (execution log, *Observations*; this report, *Risks and Observations*) | ✅ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken. Some cases
cover more than one requirement, so the rows add up to more than 12._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Authenticate the search call with the admin API key (AP2435_001, _007, _008, _009) | 4 | 4 | 0 | 0 | 100% |
| REQ-002 — Part of a contract vehicle's VIN finds that contract (AP2435_001, _002, _012) | 3 | 3 | 0 | 0 | 100% |
| REQ-003 — A whole postal code finds the contract, spaces ignored (AP2435_003, _006) | 2 | 2 | 0 | 0 | 100% |
| REQ-004 — A whole telephone number finds the contract, punctuation ignored (AP2435_004, _005, _006) | 3 | 3 | 0 | 0 | 100% |
| REQ-005 — The response lists the contracts found (AP2435_001, _010, _011, _012) | 4 | 4 | 0 | 0 | 100% |
| **Total (distinct cases)** | **12** | **12** | **0** | **0** | **100%** |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| — | No defects found. Gate C was skipped because no case failed (decided by the qa-reviewer, R3 round 1, APPROVE). | — | — | — | — | — |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2435-admin-api-warranty-search.md` | 2026-11-01 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2435_requirements-analysis.md` | 2026-11-01 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2435_test-plan.md` | 2026-11-01 |
| Test Cases | `qa-artifacts/3-test-cases/AP2435_TestCases_001-005.md`, `AP2435_TestCases_006-010.md`, `AP2435_TestCases_011-012.md` | 2026-11-01, reworked 2026-11-01 (R2), Execution Context refreshed 2026-11-05 (R3 F-2) |
| Review Findings | `qa-artifacts/3-test-cases/AP2435_ReviewFindings_2026-11-01.md` | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2435_2026-11-05.md` | 2026-11-05 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2435_bug-report.md` | 2026-11-05 |
| Evidence | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/` (28 files: 25 saved API responses, 3 screenshots) | 2026-11-05 |
| Review record | `qa-artifacts/7-reviews/AP-2435_review.md` | 2026-11-01 to 2026-11-05 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2435_test-report.md` | 2026-11-05 |

---

## Risks and Observations

These are **record-only observations, not failures.** Each one is a point the ticket
does not settle; the test recorded what the build does instead of guessing what was
meant, and no result depends on it. The first three need the author's decision.

- **O-1 (Q-008) — the search returns at most 10 contracts, so matching contracts are silently dropped.** Every broad search returns exactly 10 entries and nothing tells the caller that more matched: there is no total, page, next or limit field, and no way to ask for the next 10. Results are ordered by record number, highest first, not by date — APOP01-847 (start date 2026-10-03) is listed before APOP01-846 (start date 2026-11-09). The clearest proof that real matches are lost: contracts VATP-794, VATP-767 and VATP-766 have the queried home telephone (5146906330) stored as their client's home telephone, yet the home-telephone search does not list them, because its 10 places are taken by contracts with higher record numbers; they appear only in the work-telephone search. The ticket says "The list of contracts found is returned" — whether a 10-item cap is intended, and how a caller should get the rest, is for the author.
- **O-2 (Q-001) — the key is accepted only in the `X-API-KEY` header; the `Authorization: Bearer` header named in the ticket's text is refused.** With the valid key sent as `Authorization: Bearer <key>`, the API answers 401 "Missing API key" (AP2435_001 step 2, AP2435_007); it does not read that header at all (a wrong key in it gives the same "Missing API key", AP2435_009). The ticket's example call sends `X-API-KEY`, which works. The same refusal is already filed as AP-2549 for the warranty-notes endpoint, so the author can settle both together: either the Bearer form should be accepted, or the ticket text should name `X-API-KEY`.
- **O-3 (Q-009) — each result carries 24 fields, including client personal data.** The ticket's example and the spec (`qa-docs/admin-api.md` §3.2) show only `contractNumber`. Each entry also returns `date_start`, `vehicle_make`, `vehicle_model`, `vehicle_year`, `vehicle_vin`, `vehicle_kilometers`, `vehicle_price`, `client_email`, `client_last_name`, `client_first_name`, `client_company`, `client_address`, `client_address2`, `client_city`, `client_postal_code`, `client_tel_home`, `client_tel_work`, `term_months`, `term_km`, `franchise_amount`, `repair_amount_per_visit`, `repair_amount_total` and `sale_price`. Any key holder can therefore read a client's name, email, street address and telephones by searching a postal code or phone number. Whether this is intended is a scope and data-exposure decision for the author.
- **O-4 (Q-006) — both client telephones are searched.** A query equal to the client's work telephone (stored with hyphens) finds the contract as well as the home telephone does.
- **O-5 (Q-004, Q-005, Q-007) — matching details.** VIN and postal-code searches ignore letter case; a part of a postal code (`H7L`) or of a telephone (`514690`) returns nothing, as "fully matches" requires; a telephone with a `+1` country code does not match the stored 10-digit number.
- **O-6 (Q-002, Q-010) — answers to unusual requests.** No key → 401 `{"error":"Missing API key"}`; a wrong key → 401 `{"error":"Invalid API key"}`; no match → 200 `{"items":[]}`; an empty or missing search word → 400 `{"success":false,"error":"Missing query parameter"}`. An admin portal session in the browser does not open the API without the key header.
- **O-7 — contract number format.** Some contract numbers contain a space (for example `APAP OP3-842`), which a caller that splits on spaces would break.
- **Q-003, Q-011 — short queries and contract types.** A two-character VIN fragment (`KB`) is accepted (no minimum length) and answered in 0.69 s; results mix contract prefixes `APOP01`, `AVLmoto`, `AT`, `APAP OP3`, `ATplus`, `CVE`, `VATP`.
- **Tested on Dev, designed for staging.** The cases were designed against v2staging; the run used Dev as the project's `execution_env` requires, with the same path. The reference contract was APOP01-836 (warranty record 836), read only. The Execution Context of the three test-case files was refreshed to Dev after the run (R3 F-2).
- **Evidence note.** The admin-portal screenshot of record 836 shows the Vehicle section only (VIN); the client's postal code and telephones were confirmed from the contract list row and the API answers (R3 F-1, execution log corrected).
- **Test data left behind on Dev.** None. All 25 requests were read-only searches and the admin portal was only viewed. The API key used (`QA-automation`) expires on 2026-12-05; a re-test after that date needs a new key.

---

## Recommendations

1. Move AP-2435 forward: 12 of 12 cases passed with no bug and no open Blocking question, which meets the project's release rule (≥ 90% pass, no stopping bug, no open Blocking question).
2. Ask Ken Nguyen (author) to decide Q-008 (O-1): is the 10-result cap intended? If callers must see every matching contract, the API needs paging or a total count — today a client with more than 10 contracts cannot be fully found.
3. Ask Ken Nguyen to decide Q-001 (O-2) together with AP-2549: accept `Authorization: Bearer`, or correct the ticket text to `X-API-KEY`, so integrators follow one documented form.
4. Ask Ken Nguyen to decide Q-009 (O-3): should the search return only `contractNumber` as the example shows, or are the client's name, email, address and telephones meant to be exposed to every admin key holder? If not, trim the response before release.
5. Before any re-test after 2026-12-05, store a new Dev admin API key in `/.env` as `AVP_ADMIN_API_KEY`.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | PASS | _(automated)_ | 2026-11-05 |
| QA Lead | Not known — not named in the test plan | Pending | | |
| Development Lead | Not known — not named in the test plan | Pending | | |
| Product Owner | Ken Nguyen (author) | Pending | | |
