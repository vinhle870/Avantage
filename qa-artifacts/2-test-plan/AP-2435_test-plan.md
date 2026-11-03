# Test Plan

**Plan ID:** TP-20261101-AP2435
**Project:** Avantage Plus v2 — AP-2435 Admin API: warranty search
**Version:** 1.0
**Date:** 2026-11-01
**Revised:** 2026-11-01 — §3.2, §3.3, §6 and §8 aligned with the test cases after review R2 round 2 (F-1 to F-4)
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2435_requirements-analysis.md

---

## 1. Test Objectives

- Verify that a GET request to `/api/admin/search-warranty?query=…` carrying a valid admin API key is accepted and returns the contracts found (REQ-001, REQ-005).
- Verify the three match rules the ticket states: part of a contract vehicle's VIN (REQ-002), the client's whole postal code with or without its space (REQ-003), and the client's whole telephone number in each of the four formats the ticket lists (REQ-004).
- Verify the response carries one `contractNumber` entry per contract found, as in the ticket's example body (REQ-005).
- Record, without judging, what the build does where the ticket is silent: which key header is accepted, the response to a missing or wrong key, case sensitivity, partial postal code and phone queries, country-code phone formats, no-match and empty queries, result limits and which contract types are searchable (Judgement questions Q-001 to Q-011).

---

## 2. Scope

### 2.1 In Scope

| Requirement | Test Types |
|---|---|
| REQ-001 — Authenticate with the admin API key | Functional, Negative (record-only), API |
| REQ-002 — VIN partial match | Functional, Edge-case (record-only for case and length), API |
| REQ-003 — Postal code full match, spaces ignored | Functional, Edge-case, Negative (record-only), API |
| REQ-004 — Telephone full match, spaces/dots/parentheses/hyphens ignored | Functional, Edge-case, Negative (record-only), API |
| REQ-005 — Response lists the contracts found | Functional, Negative (record-only), Edge-case, API |

### 2.2 Out of Scope

- How API keys are created or managed — the ticket assumes one exists ("The admin API user has an API key created"). The admin "Manage API keys" page is used only to obtain a key if none is supplied.
- Key scopes or per-dealer restrictions (Q-013, Info) — the ticket says nothing about them.
- Performance and load of the search — nothing in the ticket quantifies it.
- Other admin API endpoints (for example AP-2434's warranty notes endpoint).
- The admin portal's own search screens — the ticket covers the API only.

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Description | Responsible |
|---|---|---|
| System Testing | Call the deployed staging API with real contract data and compare the response with the contract's values as shown on the dealer portal's warranty contract page (`/warranty`) | QA Agent |
| Regression | Not applicable as a separate level — the endpoint is new and changes no existing screen. A regression test re-runs earlier passing tests to prove a change broke nothing; here there is nothing earlier to re-run | — |

### 3.2 Test Types

| Type | Approach |
|---|---|
| Functional | One valid request per acceptance criterion: VIN fragment, whole VIN, postal code with and without space, telephone in each of the four listed formats. The contract under test must appear in `items` by its `contractNumber` |
| Negative | Missing key, wrong key, a query that matches nothing, an empty and a missing `query`. The ticket states no expected response, so each is **recorded**, not judged (Q-002, Q-010). A case fails only on an objective fault: contract data returned without a valid key, an HTTP 5xx (server error), or a 2xx response whose body is not JSON. A 4xx body need not be JSON — its status, content type and body are recorded |
| Edge-case | Lower-case VIN fragment and postal code (Q-004), a partial postal code and a partial telephone (Q-005), a telephone with a `+1` country code (Q-007), a short VIN fragment to observe result count (Q-008). All record-only |
| API | GET requests with the query value URL-encoded by `curl --data-urlencode` (space → `+`, `(` → `%28`, `)` → `%29`, `+` → `%2B`). The first case sends the key in both the `X-API-KEY` header (the ticket's example) and `Authorization: Bearer` (the ticket's text), records which is accepted (Q-001) and fails only if neither is accepted while the key is confirmed active, read-only, on `/admin/api-keys`; if both forms get 401/403 and the key cannot be confirmed active, the cases are BLOCKED by Q-012. Every later case uses the accepted form |

### 3.3 Test Execution Method

The project's bound providers (`qa-artifacts/qa-config/tools.md` §1) are: `browser` → Playwright MCP (active), `tracker` → Jira CLI (active), `vcs` → GitHub (active), `notify` → disabled. There is no `api` capability group, and the `api-baseline` knowledge source is `missing`.

- **API steps** are sent by `stlc-manual-executor` from the QA workstation with `curl -sS -i --max-time 30 -G --data-urlencode "query=<value>"`, one self-contained Bash command per request that reads `AVP_ADMIN_API_KEY` from the gitignored `/.env` by name and stops if it is empty — the key is never printed or written into an artifact. The full response (status line, headers, body) plus a trailer with the exact URL, the HTTP status and curl's exit code is saved as a text evidence file in the screenshots folder. A request whose curl exit code is not 0 or whose file has no HTTP status line is retried once, then BLOCKED (environment) — never PASS or FAIL. An empty or missing key stops the command and the case is BLOCKED by Q-012, with no retry. A server may echo the key it received, so the command replaces every 8-character run of the key in the saved file with `<redacted>`; if one is still present, the file is replaced by a notice and the step is BLOCKED (environment). When `curl` cannot reach the host, the step is BLOCKED (environment); only if the QA chooses to can the same request then be sent with `fetch` from a page of the admin portal through the browser provider, and that choice is recorded in the execution log.
- **Reference-data steps** (finding a contract and reading its VIN, client postal code and telephone) are driven through the Playwright browser provider in the dealer portal (`/login` → **Contracts → Warranty**, `/warranty`), with screenshots as evidence. The dealer page is used because it is the only warranty contract list in the `navigation` source — the admin portal's warranty contract screens are not mapped — and any contract the shared dealer can see is searchable through the admin API.
- The `notify` group is disabled; nothing in this plan needs it.

---

## 4. Entry Criteria

Entry criteria are the conditions that must hold before execution starts.

- [ ] The staging host `https://v2staging.garantieavantageplus.ca` is reachable (the ticket's example call uses this host) and the shared admin login works (from the `env` source).
- [ ] **An admin API key for staging is available to QA** and stored in `/.env` (Q-012) — supplied by the team or created on `/admin/api-keys`. Without it, every case is BLOCKED.
- [ ] One warranty contract is identified whose vehicle VIN, client postal code and client telephone are all filled in, and those values are recorded (see §8).
- [ ] Test cases `AP2435_TestCases_*.md` are written and reviewed (s3, s3b).

---

## 5. Exit Criteria

Exit criteria are the conditions that must hold before testing of this ticket is called done.

- [ ] Every test case has a status other than Not Run.
- [ ] Pass rate meets the registry threshold (90% of cases, excluding SKIPPED) — the project-wide release rule.
- [ ] No open Critical or High bug against AP-2435 — a severe open bug means the feature is not fit to release whatever the pass rate.
- [ ] Every Judgement question has the build's actual behaviour recorded for the s7 comment.
- [ ] `AP-2435_test-report.md` is written.

---

## 6. Suspension & Resumption Criteria

### Suspend testing when:

- No admin API key is available — suspend all cases and record them BLOCKED by Q-012.
- The endpoint cannot be reached — curl's exit code is not 0 (for example a timeout) or the response has no HTTP status line: retry once, then BLOCKED (environment). An HTTP 5xx from the endpoint under test is an answer, not an outage: that step is FAIL, as in every case's result rule 1.
- The dealer portal is unreachable, so the reference contract cannot be read.

### Resume testing when:

- A key is stored in `/.env`.
- The endpoint answers a request with an HTTP status line.
- The dealer portal login succeeds.

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | `https://v2staging.garantieavantageplus.ca/admin` (resolved from the `env` knowledge source) |
| **API endpoint** | `https://v2staging.garantieavantageplus.ca/api/admin/search-warranty?query=<value>` — exactly as in the ticket's example call |
| **Browser** | Chromium (Playwright default), viewport 1280 × 800 — reference-data steps only (dealer portal) |
| **HTTP client** | `curl` on the QA workstation (Windows 11, Git Bash) |
| **OS** | Windows 11 (QA workstation) |
| **Application version** | Not known — fix version 5.0.0 on the ticket; the admin portal shows no build number |
| **Screenshot / evidence path** | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/` |
| **Bug tracker** | Jira (CLI wrapper `tools/jira-cli`) — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

- **Accounts:** the shared dealer login (from `env`) for reading the reference contract; an admin API key (Q-012) for every API call.
- **Reference contract:** one warranty contract (`CVE-…`) on staging whose vehicle has a VIN and whose client has a postal code and a 10-digit telephone. Its contract number, VIN, postal code and telephone are recorded in the execution log by the first case's `[Pre-Condition]` step.
- **Derived query values** (built from the reference contract at run time): a 6-character middle VIN fragment; the whole VIN; the postal code as `A1A1A1` and `A1A 1A1`; the telephone as `NNN-NNN-NNNN`, `NNNNNNNNNN`, `NNN.NNN.NNNN` and `(NNN) NNN-NNNN`; lower-case variants; the first 3 characters of the postal code; the first 6 digits of the telephone; the telephone with `+1 `.
- **Invalid values:** a wrong API key — the fixed, obviously fake value `QA-AP2435-INVALID-KEY-` padded with `0` to the real key's length (it takes the key's length only, never a character of it, so an echoed key cannot leak the real one); a no-match query `ZZQA2435NOMATCH` (letters I, O and Q never appear in a VIN, and this string is no postal code or phone).

### 8.1 Test Data Classification

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer portal login | Static | None applied | Named in Execution Context, resolved from `env` |
| Admin API key | Static | None applied — it is provided, not created by the test | Named in Execution Context, read from `/.env` as `AVP_ADMIN_API_KEY`; never written in an artifact. The tests never create one: creating a real credential (for example on `/admin/api-keys`) is the QA's decision, after which the cases go from BLOCKED to Not Run |
| Reference warranty contract (VIN, postal code, telephone) | Dynamic | Q2 — the assertions depend on its VIN, postal code and telephone | Located in the first case's `[Pre-Condition]` step: open an existing `CVE-…` contract on the dealer portal's `/warranty` page and record its four values. If no contract has all three fields, create one through the dealer quote flow (`domain` → quote-creation.md) with a client postal code and telephone. Reused by every later case, which re-states how to locate it if absent |
| Derived query strings | Static | None applied — fixed transformations of the recorded values | Written into the test step as a rule (for example "the telephone as `(NNN) NNN-NNNN`") |
| Wrong key, no-match query | Static | None applied | Written into the test step |

**Cost of Dynamic data:** locating an existing contract is a read in the dealer portal (a few minutes, no third party, nothing left behind). Creating one, only if none exists, takes the full dealer quote flow (about 10 minutes) and leaves a quote and contract on staging, which must be listed in the execution log. Searches themselves change nothing.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| No admin API key for QA (Q-012) | High | High | Obtain one from `/admin/api-keys` or Ken Nguyen before s4; all cases BLOCKED until provided. High likelihood because no key is recorded anywhere in the project's knowledge files |
| Ticket contradicts itself on the key header (Q-001) | High | Medium | Send `X-API-KEY` (as the example) and `Authorization: Bearer` (as the text); a case fails only if neither works |
| No `api` capability or API baseline in the framework | High | Medium | Use `curl` from the shell, saving full responses as evidence |
| Reference contract lacks a postal code or telephone | Medium | Medium | Choose a contract with all three values; create one only if none exists |
| A partial postal code or phone fragment matches some VIN by coincidence, confusing the "fully" checks | Medium | Low | Those checks are record-only and use fragments that do not appear in the reference contract's VIN |
| Unencoded query characters cause errors that are not product faults | Medium | Low | Always use `--data-urlencode` |
| Search returns client data without a valid key | Low | High | Negative cases with a missing and a wrong key; any contract data returned is an objective security fault |

---

## 10. Test Schedule

| Phase | Activity | Owner |
|---|---|---|
| 2026-11-01 | Requirements analysis | stlc-requirements-analyst |
| 2026-11-01 | Test plan design | stlc-test-plan-designer |
| 2026-11-01 | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| When an API key is available (Q-012) | Execution | stlc-manual-executor |
| After execution | Bug reporting, test report, ticket update | stlc-bug-reporter, stlc-test-reporter, stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Designs and executes the cases, files bugs, writes reports |
| QA reviewer (stlc-qa-reviewer) | Decides Gates A–D in reviewer mode |
| Ken Nguyen (reporter) | Answers open questions, supplies or approves the staging API key |
| Developer | Not named on the ticket; fixes defects |

---

## 12. Sign-off Checklist

- [x] Every requirement REQ-001 to REQ-005 is in scope
- [x] Entry and exit criteria defined
- [x] Test data classified
- [x] Risks logged, including the missing API key and the header contradiction
- [ ] API key received (Q-012)
- [ ] Plan reviewed by QA Lead
