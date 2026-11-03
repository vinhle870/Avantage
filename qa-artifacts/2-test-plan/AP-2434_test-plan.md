# Test Plan

**Plan ID:** TP-20261101-AP2434
**Project:** Avantage Plus v2 — AP-2434 Admin API: create warranty notes
**Version:** 1.0
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2434_requirements-analysis.md

---

## 1. Test Objectives

- Verify that a POST request to the admin API endpoint, carrying an API key in the Authorization Bearer header and the five form fields, creates a note on the named warranty (REQ-001, REQ-002).
- Verify that `file_content` accepts HTML longer than 255 characters and keeps it in full (REQ-003).
- Verify that the created note can be found on its warranty in the admin area (REQ-004).
- Record, without judging, what the build does where the ticket is silent: the success response, validation of bad input, rejection of a missing or wrong key, HTML display and the length ceiling (Judgement questions Q-001, Q-003 to Q-009).

---

## 2. Scope

### 2.1 In Scope

| Requirement | Test Types |
|---|---|
| REQ-001 — Authenticate with API key (Bearer header) | Functional, Negative (record-only), API |
| REQ-002 — Create note via POST multipart form data | Functional, Negative (record-only), Edge-case, API |
| REQ-003 — `file_content` accepts HTML over 255 characters | Functional, Edge-case, Negative (record-only), API |
| REQ-004 — Note displayed in the admin area | Functional, UI, Regression |

### 2.2 Out of Scope

- How API keys are created or managed — the ticket assumes a key already exists ("The admin API user has an API key created").
- Display of public notes in the dealer or client portal (Q-010, Info) — the ticket names only the admin area.
- Performance and load of the API — nothing in the ticket quantifies it.
- Other admin API endpoints, including the cloned AP-2371 claim-attachment endpoint, except as a reference for request format.

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Description | Responsible |
|---|---|---|
| System Testing | Call the deployed staging API, then check the result in the admin portal | QA Agent |
| Regression | Confirm an existing warranty's earlier notes (if any) are still shown after a note is added through the API | QA Agent |

### 3.2 Test Types

| Type | Approach |
|---|---|
| Functional | Send one valid request per acceptance criterion and confirm the note in the admin area |
| Negative | Missing key, wrong key, missing field, unknown `warranty_id`, invalid `is_public`. The ticket states no expected error, so each response is **recorded**, not judged (Q-004, Q-005). A case fails only on an objective fault: a note is created despite a rejected key, an HTTP 5xx (server error), or data loss |
| Edge-case | `file_content` at 255, 256 and about 2,000 characters of HTML; `is_public` true and false |
| UI | Find the note on the warranty in the admin portal, record where it appears and which fields are shown (Q-006, Q-007, Q-008) |
| API | Requests sent as `multipart/form-data` (the form encoding the ticket names) with `Authorization: Bearer <key>` |

### 3.3 Test Execution Method

The project's bound providers (`qa-artifacts/qa-config/tools.md` §1) are: `browser` → Playwright MCP (active), `tracker` → Jira CLI (active), `vcs` → GitHub (active), `notify` → disabled. There is no `api` capability group, and the `api-baseline` knowledge source is `missing`.

- **API steps** are sent by `stlc-manual-executor` from the QA workstation with `curl -F` (multipart form fields) and `-H "Authorization: Bearer $KEY"`, where the key is read from an environment variable in the gitignored `/.env` — never written into an artifact. The full response (status line, headers, body) is saved as a text evidence file next to the screenshots. As an alternative when `curl` cannot reach the host, the same request can be sent with `fetch` and `FormData` from a page of the admin portal through the browser provider.
- **Admin-area steps** are driven through the Playwright browser provider, with screenshots as evidence.
- The `notify` group is disabled; nothing in this plan needs it.

---

## 4. Entry Criteria

- [ ] The staging admin portal `https://v2staging.garantieavantageplus.ca` is reachable and the shared admin login works (resolved from the `env` source).
- [ ] **An admin API key for staging is available to QA** and stored in `/.env` (Q-002). Without it, every case is BLOCKED.
- [ ] The API base URL is confirmed. Until told otherwise, the portal host is used (`env`: "assume the same host as the portal until told otherwise").
- [ ] An existing warranty is identified in the admin portal and its ID recorded (see §8).
- [ ] Test cases `AP2434_TestCases_*.md` are written and reviewed (s3, s3b).

---

## 5. Exit Criteria

- [ ] Every test case has a status other than Not Run.
- [ ] Pass rate meets the registry threshold (90% of cases, excluding SKIPPED).
- [ ] No open Critical or High bug against AP-2434.
- [ ] Every Judgement question has the build's actual behaviour recorded for the s7 comment.
- [ ] `AP-2434_test-report.md` is written.

---

## 6. Suspension & Resumption Criteria

### Suspend testing when:

- No admin API key is available — suspend all cases and record them BLOCKED by Q-002.
- The endpoint returns HTTP 5xx or times out on the first valid request — retry once, then BLOCKED (environment), not FAIL.
- The admin portal is unreachable or the login fails.

### Resume testing when:

- A key is provided and stored in `/.env`.
- The endpoint answers a valid request without a server error.
- The admin portal login succeeds.

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | `https://v2staging.garantieavantageplus.ca/admin` (resolved from the `env` knowledge source) |
| **API endpoint** | `https://v2staging.garantieavantageplus.ca/api/admin/warranty/-notes` — host assumed per `env`, path exactly as written in the ticket (Q-001) |
| **Browser** | Chromium (Playwright default), admin viewport 1280 × 800 |
| **HTTP client** | `curl` on the QA workstation (Windows 11, Git Bash) |
| **OS** | Windows 11 (QA workstation) |
| **Application version** | Not known — fix version 5.0.0 on the ticket; the admin portal shows no build number |
| **Screenshot / evidence path** | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/` |
| **Bug tracker** | Jira (CLI wrapper `tools/jira-cli`) — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

- **Accounts:** the shared admin login (from `env`) for the admin-area checks; an admin API key (Q-002) for the API calls.
- **Warranty:** one existing warranty on staging, identified by browsing the admin portal at execution time. Its ID is recorded in the execution log.
- **Note values:** a unique title per case, `QA-AP2434-<case>-<HHMMSS>`, so each note can be found without confusion with earlier runs.
- **HTML payloads:** 255 characters, 256 characters and about 2,000 characters of simple HTML (`<p>`, `<b>`, `<ul><li>`), padded with plain text to the exact length; one payload with a `<script>` tag to record sanitising (Q-008).
- **Invalid values:** a wrong API key (the real key with its last character changed), a non-existent `warranty_id` (for example `999999999`), `is_public` = `maybe`.

### 8.1 Test Data Classification

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Admin portal login | Static | None applied | Named in Execution Context, resolved from `env` |
| Admin API key | Static | None applied — it is provided, not created by the test | Named in Execution Context, read from `/.env`; never written in an artifact |
| Warranty to attach notes to | Static | None applied — the test reads an existing warranty; assertions do not depend on its creation values | Chosen once in the first case's `[Pre-Condition]` step and its ID recorded; reused by later cases |
| Warranty note | Dynamic | Q1 — does not exist yet | Created by the case under test with a unique title |
| HTML payloads, invalid values | Static | None applied — fixed input strings | Written into the test step |

**Cost of Dynamic data:** each note is created by one API call (under a second, no third party). Notes stay on the staging warranty afterwards — the ticket describes no delete endpoint and the `cleanup` source is `missing`. Every note created is listed in the execution log.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| No admin API key for QA (Q-002) | High | High | Ask Ken Nguyen before s4; all cases BLOCKED until provided |
| Endpoint path in the ticket is a typo (Q-001) | Medium | High | Call the path exactly as written; a 404 is recorded and becomes a bug that asks the author |
| No `api` capability or API baseline in the framework | High | Medium | Use `curl` from the shell, saving full responses as evidence |
| Admin area location of notes not mapped in `domain` / `navigation` | Medium | Medium | Executor locates it, records the route, and writes it back to the `domain` source |
| HTML stored and rendered unsanitised (stored cross-site scripting) | Low | High | One case sends a harmless `<script>` marker and records whether it survives; an executed script is an objective fault |
| Notes left on staging data | High | Low | Unique titles; list every note in the execution log |

---

## 10. Test Schedule

| Phase | Activity | Owner |
|---|---|---|
| 2026-11-01 | Requirements analysis | stlc-requirements-analyst |
| 2026-11-01 | Test plan design | stlc-test-plan-designer |
| 2026-11-01 | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| When Q-002 is answered | Execution | stlc-manual-executor |
| After execution | Bug reporting, test report, ticket update | stlc-bug-reporter, stlc-test-reporter, stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Designs and executes the cases, files bugs, writes reports |
| QA reviewer (stlc-qa-reviewer) | Decides Gates A–D in reviewer mode |
| Ken Nguyen (reporter) | Answers open questions, supplies the staging API key |
| Developer (Minh Lưu, per the 2026-07-27 comment) | Fixes defects |

---

## 12. Sign-off Checklist

- [x] Every requirement REQ-001 to REQ-004 is in scope
- [x] Entry and exit criteria defined
- [x] Test data classified
- [x] Risks logged, including the missing API key
- [ ] API key received (Q-002)
- [ ] Plan reviewed by QA Lead
