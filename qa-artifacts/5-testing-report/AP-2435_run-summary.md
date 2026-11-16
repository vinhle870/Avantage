# Run Summary — AP-2435: Admin API - warranty search
Updated: 2026-11-05T06:22:40Z · Run folder: 5.0.0 · Stages run: update-ticket · Run status: complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2435: Admin API - warranty search
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 5 REQ · 1 High risks
 Test cases   : 12 designed · 8 proposed by review (not promoted)
 Execution    : 12 PASS · 0 FAIL · 0 BLOCKED (Environment: Dev) — 100% (12 of 12)
 Bugs         : 0 filed · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS
 Verdict      : PASS
 Tickets      : AP-2435 → Ready for release, assigned to Ken Nguyen · 0 bugs updated
 Stopped at   : — (complete after update-ticket)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Done:** the ticket outcome was applied as the independent R4 review decided (Gate D). All 12 test cases passed on Dev (Environment: Dev), no bug was filed, and the verdict is PASS. The result comment is on AP-2435 (comment 19474), the ticket moved from QC to Ready for release, and it is now assigned to Ken Nguyen, who is asked about Q-008, Q-001 and Q-009 in the comment.

**What passed**
- Finding a contract by its vehicle (Environment: Dev): part of the VIN, the whole VIN, a lower-case fragment and a two-letter fragment all return contract APOP01-836 (AP2435_001, 002, 012).
- Finding a contract by the client's postal code: with and without its space, and in lower case, the search returns the same contracts, including APOP01-836; a partial postal code returns nothing, as "full match" requires (AP2435_003, 006).
- Finding a contract by the client's telephone: hyphens, plain digits, dots and parentheses all return APOP01-836; a partial number or one with `+1` returns nothing (AP2435_004, 005, 006).
- Protecting client data with the key: no key and a wrong key are both refused with 401 and no contract data, and an admin portal session in the browser does not open the API either (AP2435_008, 009).
- Clean answers for edge inputs: no match → 200 `{"items":[]}`; empty or missing query → 400 "Missing query parameter"; no server error anywhere (AP2435_010, 011).

**Failures**
None.

**Decisions made**
- Gate A (rule A3, by the reviewer) and Gate B (rule B3, by the reviewer): unchanged from the 2026-11-01 run — see the run state's Gate log.
- Gate C (by the reviewer, R3 round 1, APPROVE): nothing to file — the execution log has no FAIL (12 PASS / 0 FAIL / 0 BLOCKED), so Gate C is skipped by its own rule; correct-cases stays skipped. The refused Bearer header was ruled record-only for this ticket (its own text and example contradict each other), so no bug was filed and AP-2549 was not linked.
- file-bugs: the bug report records no bugs filed; no tracker search, ticket or comment was made.
- report: verdict PASS — 12 of 12 passed (100%, threshold 90%), no open bug, no open Blocking question. Observations O-1, O-2 and O-3 are listed first, as the reviewer asked.
- The reviewer's three minor findings were applied: F-1 — the execution log no longer says the record-836 screenshot shows the Client section; it shows the Vehicle section only, and the client values are proven by the list-row capture and the API answers. F-2 — the Execution Context of all three test-case files now names the Dev host, says the key is known (`/.env` `AVP_ADMIN_API_KEY`, value never shown) and marks Q-012 resolved on 2026-11-05, each with a Revisions row; no step or expected result changed. F-3 — O-1 now says results are ordered by record number, highest first (APOP01-847, dated 2026-10-03, comes before APOP01-846, dated 2026-11-09), in the log, the report and `qa-docs/admin-api.md`.
- Gate D (rule §3.1, by the reviewer, R4 round 1, APPROVE): pass rate 100% (needs 90%), no stopping bug, no open Blocking question. Applied in order on 2026-11-05 (Environment: Dev): (1) story result comment 19474 posted through REST v2 — read back through REST v3 with an h3 heading, bold labels, the mention of Ken Nguyen and AP-2549 rendered as an issue reference (named only, not linked); no client personal value and no API key value in it; (2) QC → Ready for release, read back as Ready for release; (3) assigned to Ken Nguyen (accountId 5ae11c42b076312e0e25c600), read back as Ken Nguyen. No QA comment existed before posting, so there is no duplicate.

**Left behind**
- Test data on Dev: None. The update-ticket run touched only Jira; the earlier execute run made 25 read-only searches and only viewed the admin portal.
- Observations that are not failures: **O-1 (Q-008)** — results stop at 10, ordered by record number (highest first), with no total or paging field, so matching contracts are dropped: VATP-794, VATP-767 and VATP-766 have the queried home telephone stored, yet the home-telephone search does not list them. **O-2 (Q-001)** — the `Authorization: Bearer` header named in the ticket's text is refused with 401 "Missing API key"; only `X-API-KEY` works — the same behaviour as AP-2549 on the warranty-notes endpoint. **O-3 (Q-009)** — each result has 24 fields, including the client's name, email, street address and both telephones (field names `client_first_name`, `client_last_name`, `client_email`, `client_address`, `client_tel_home`, `client_tel_work` and others), while the ticket shows only `contractNumber`. Also: both telephones are searched (Q-006); VIN and postal searches ignore case (Q-004); `+1` stops a telephone matching (Q-007); some contract numbers contain a space.
- Knowledge files added or changed: `qa-artifacts/qa-docs/admin-api.md` (§3.2 result-size row reworded: record-number order, matches beyond the 10th dropped).
- Key check (2026-11-05T06:18Z): every AP-2435 artifact written or changed by this run was scanned for each 12-character piece of the key without printing it. No piece was found.
- The Dev admin API key `QA-automation` expires on 2026-12-05; a re-test after that needs a new key.

**Files**
- [AP-2435_test-report.md](qa-artifacts/5-testing-report/AP-2435_test-report.md)
- [AP-2435_bug-report.md](qa-artifacts/5-testing-report/AP-2435_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2435_2026-11-05.md)
- [run state](qa-artifacts/.pipeline/AP-2435.md)

## Automation
- Spec: `playwright-automation/src/tests/admin/warrantySearchApi_AP2435.spec.ts` · tag `@AP-2435` (Dev only; needs `AVP_ADMIN_API_KEY` exported for the run)
- 12 of 12 PASSED cases automated — 12 passing, 0 fixme (lint clean, two separate full runs on Dev 2026-11-05, 12/12 each)
- Rework round 1 after R5 REWORK (2026-11-05): requests now sent with Node `fetch`, so a failed send cannot write the key into the HTML report (F-1, proven with a fake key against unreachable origins: 0 hits); 2xx annotations record field names only (F-2); AP-2377 data overlap named as a maintenance risk (F-3). Re-run: lint clean, 12/12 in two separate runs, real-key scan 0 hits
- Not automated: none
- PR: not opened — awaiting R5 (`--review external`; report: [AP-2435_automation-report.md](qa-artifacts/6-automation/AP-2435_automation-report.md))
