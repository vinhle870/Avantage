# Bug Report

**Project:** AP (Avantage)
**Report ID:** BR-20261105-001
**Test Cycle:** AP-2435 story test — "Admin API - warranty search" — run folder 5.0.0
**Date:** 2026-11-05 (written 2026-11-05T06:16Z)
**Reported by:** QA Agent — Bug Reporter Skill (stlc-worker, QA batch)
**Source:** qa-artifacts/3-test-cases/AP2435_TestCases_001-005.md, AP2435_TestCases_006-010.md, AP2435_TestCases_011-012.md — Execution Log qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2435_2026-11-05.md
**Environment:** Dev (https://v2dev.garantieavantageplus.ca, endpoint `GET /api/admin/search-warranty`)

| Metric | Value |
|---|:---:|
| Total defects | 0 |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Tracker tickets created | 0 |

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| — | — | No defects. All 12 test cases (AP2435_001–012) passed on Dev, so there is nothing to file. | — | — | — | — |

**Gate C decision (applied by reviewer):** skipped — the execution log has no FAIL
(12 PASS, 0 FAIL, 0 BLOCKED; routing.md §3 Gate C skip clause), decided by the
independent qa-reviewer (R3 round 1, APPROVE, 2026-11-05T06:13:13Z). No tracker search,
no new ticket and no comment on an existing ticket were made by this stage. AP-2549 is
not linked: the reviewer ruled the refused Bearer header a record-only point for this
ticket (see below).

---

## Bug Details

None. No test case failed or was blocked.

**Observations that are not defects of this run.** The run recorded behaviours that the
ticket does not settle. Each belongs to an open Judgement question for the ticket's
author (Ken Nguyen), so none is a failure and no ticket was filed. They are described in
the test report (AP-2435_test-report.md, *Risks and Observations*) and will reach the
author in the ticket comment. The three the reviewer named first:

- **O-1 (Q-008) — results stop at 10, so matching contracts are dropped.** Every broad search returns at most 10 contracts, ordered by record number (highest first), with no total or paging field. The home-telephone search for the reference client omits three contracts (VATP-794, VATP-767, VATP-766) whose stored home telephone is the queried number; they appear only in the work-telephone search.
- **O-2 (Q-001) — the `Authorization: Bearer` header named in the ticket's text is refused** with 401 "Missing API key"; only the `X-API-KEY` header from the ticket's example works. The same behaviour is already filed as AP-2549 for the warranty-notes endpoint.
- **O-3 (Q-009) — each result carries 24 fields, including client personal data,** while the ticket's example and the spec show only `contractNumber`.

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 0 | — |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — Authenticate the search call with the admin API key | 0 | — |
| REQ-002 — A query that is part of a contract vehicle's VIN finds that contract | 0 | — |
| REQ-003 — A query equal to a client's whole postal code finds the contract, spaces ignored | 0 | — |
| REQ-004 — A query equal to a client's whole telephone number finds the contract, punctuation ignored | 0 | — |
| REQ-005 — The response lists the contracts found | 0 | — |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** 2026-11-05T06:22:11Z

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| — | AP-2435 (the tested story itself) | Story result comment 19474 posted (REST v2, read back via v3: heading, bold, mention, issue reference rendered); moved QC → Ready for release; assigned to Ken Nguyen — Gate D rule §3.1 by reviewer (R4 round 1, APPROVE) | Ready for release · assignee Ken Nguyen (both read back) | 2026-11-05T06:22:11Z |
