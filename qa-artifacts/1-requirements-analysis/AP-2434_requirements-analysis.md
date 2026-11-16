# Requirements Analysis Report

**Project:** Avantage Plus v2 — AP-2434 Admin API: create warranty notes
**Date:** 2026-11-01 · **Updated:** 2026-11-15 (open questions re-checked with the knowledge lookup, Steps 3b–3c)
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** requirements/AP-2434-admin-api-create-warranty-notes.md
**Total requirements found:** 4

---

## Executive Summary

AP-2434 adds an endpoint to the admin API (the programmatic interface that outside systems use instead of the admin web screens). A caller that holds an API key (a secret token that identifies the calling system) sends a POST request with five form fields, and the system creates a note on a warranty that admin users can then see in the admin area. The ticket gives one Given/When/Then block, which this analysis splits into four requirements: authenticating with the key, creating the note, accepting long HTML text in `file_content`, and showing the note in the admin area.

The main result of every requirement can be written from the ticket's own words, so no question is Blocking. Eight questions are Judgement: the ticket does not say what the API returns, which fields are required, how bad input or a bad key is rejected, where exactly the note appears, how `description` differs from `file_content`, whether HTML is rendered or shown as text, or what the upper length limit is. The tests record what the build does on these points rather than guessing. Two questions are Info. The largest practical risk is test access: the project's knowledge files hold no admin API key and no API base URL, and the project has so far tested only through the browser, so execution needs a key from the team before any of these cases can run (superseded: a Dev admin API key has been in use since 2026-11-05 — Q-002). Overall testability is rated **Medium**.

**Update 2026-11-15.** The ten questions were re-checked against Jira Stories and Tasks. Two are now answered by delivered Stories: AP-2308 says how an admin creates an API key (Q-002), and AP-1596 says the dealer portal shows only notes marked public (Q-010). Six have no defining Story, so the build's own behaviour, recorded on Dev on 2026-11-05, is now the expected result (Q-003, Q-004, Q-005, Q-006, Q-008, Q-009). The path question (Q-001) is answered by the ticket itself: its When sentence says the call goes to "/api/admin/warranty/-notes", so that path must create the note, and the 405 the build gave there on 2026-11-05 becomes a FAIL at the next re-test of AP2434_001, together with AP-2549. The `file_content` question (Q-007) is Accepted, because no Story defines the field — except that the field being stored nowhere is not accepted: the ticket says it must "allow HTML with more than 255 characters", so that loss stays a FAIL (AP-2547). No question stays open, and nothing new was posted. The API key problem is solved: a Dev key has been in use since 2026-11-05.

---

## Requirements Detail

### REQ-001 — Authenticate the admin API call with an API key

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. Derived from the Given/When text: as an admin API user, I want to call the admin API with my API key in the Authorization Bearer header so that the system knows the call is allowed. |
| **Priority** | High — every other requirement depends on the call being accepted, and an endpoint that accepts calls without a valid key would let anyone write to warranty records. |
| **Source File** | AP-2434-admin-api-create-warranty-notes.md |
| **Recommended Test Types** | Functional · Negative · API |

**Acceptance Criteria:**

1. Given "The admin API user has an API key created", a POST request to the endpoint "with the api key in the Authorization Bearer header" is accepted and creates the note (the call succeeds; the note exists afterwards).

**Out of Scope:**

- How an API key is created or managed. The ticket assumes one already exists ("has an API key created").

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| No admin API key and no API base URL are recorded in the project's knowledge files (`env` lists "API Base URL: Not known"), and the project has no API test baseline. Without a key, no case in this ticket can run. Superseded: a Dev admin API key has been in use since 2026-11-05 (Q-002). | High | Ask the team for a staging admin API key, or for where to create one (Q-002), before execution. Keep the key in the gitignored `/.env`, never in an artifact. Resolved 2026-11-05 — Dev key in `/.env` as `AVP_ADMIN_API_KEY`. |
| The ticket does not say what happens when the key is missing, wrong or revoked. A security check exists only on the success path. | Medium | Record the build's response for a missing and an invalid key (Q-005). |

---

### REQ-002 — Create a warranty note through POST multipart form data

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. Derived: as an admin API user, I want to POST a note to a warranty so that it is stored against that warranty. |
| **Priority** | High — this is the purpose of the ticket. |
| **Source File** | AP-2434-admin-api-create-warranty-notes.md |
| **Recommended Test Types** | Functional · Negative · Edge-case · API |

**Acceptance Criteria:**

1. A POST request to "/api/admin/warranty/-notes", sent "as a form multipart data" (the HTML form encoding that can carry text fields and files), with the fields `warranty_id` (string, "the ID of the warranty"), `title` (string, "Title of the note"), `description` (string, "Description of the note"), `is_public` (bool, "true or false") and `file_content` (string), results in: "The note is created".
2. `is_public` accepts both "true" and "false".

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The path "/api/admin/warranty/-notes" looks unusual (a hyphen right after a slash, and no warranty ID in the path). It may be exact or a typo. | Medium | Call the path exactly as written. Record the response; if it is not found, the bug ticket asks the author (Q-001). |
| No response is specified — no HTTP status code (the number the server returns to say success or failure) and no response body. "Created" can only be confirmed by looking for the note afterwards. | Medium | Record the status and body the build returns (Q-003); confirm creation through the admin area (REQ-004). |
| No field is marked required or optional, and no validation or error response is described. | Medium | Record the build's behaviour for missing fields, an unknown `warranty_id` and an invalid `is_public` value (Q-004). |

---

### REQ-003 — `file_content` accepts HTML longer than 255 characters

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. Derived: as an admin API user, I want to send a long HTML note body so that rich, detailed notes are not cut short. |
| **Priority** | Medium — it is stated explicitly ("Need to allow"), which suggests an earlier limit of 255 characters caused a problem, but the note can still be created without it. |
| **Source File** | AP-2434-admin-api-create-warranty-notes.md |
| **Recommended Test Types** | Functional · Edge-case · Negative · API |

**Acceptance Criteria:**

1. `file_content` is a "Text field containing description of the note. Need to allow HTML with more than 255 characters": a value containing HTML markup and longer than 255 characters is accepted and stored in full (not cut to 255 characters).

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| No upper limit is stated, so "more than 255" has no ceiling to test against. | Low | Test 255, 256 and a clearly longer value (for example 2,000 characters); record any limit the build enforces (Q-009). |
| The ticket does not say whether the stored HTML is shown as formatted text or as raw markup, nor whether scripts are removed. Unremoved scripts would let an API caller run code in an admin's browser (stored cross-site scripting). | Medium | Record how the admin area shows the HTML and whether a `<script>` tag survives (Q-008). |
| The field is named `file_content` but described as a text field, and `description` has nearly the same description. | Low | Send different values in each field so the admin area shows which one appears where (Q-007). |

---

### REQ-004 — The created note is displayed in the admin area

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. Derived: as an admin user, I want to see notes created through the API in the admin area so that I know what outside systems recorded on a warranty. |
| **Priority** | High — it is the only observable proof in the ticket that the note was created. |
| **Source File** | AP-2434-admin-api-create-warranty-notes.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. "The note is created and displayed in the admin area": after the POST, the note with the sent title can be found on the warranty in the admin portal.

**Out of Scope:**

- Display outside the admin area (dealer or client portal). The ticket names only the admin area.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket does not say where in the admin area the note appears, or which of its fields are shown. The project's `domain` and `navigation` sources do not map an admin warranty page or a notes section yet. | Medium | The executor locates the warranty in the admin portal and records the route, then writes it back to the `domain` source. Field-level display is record-only (Q-006). |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Authenticate with API key | ✓ | ✓ | | | | ✓ | | |
| REQ-002 — Create note via POST multipart | ✓ | ✓ | ✓ | | | ✓ | | |
| REQ-003 — HTML over 255 characters in `file_content` | ✓ | ✓ | ✓ | | | ✓ | | |
| REQ-004 — Note displayed in admin area | ✓ | | | ✓ | ✓ | | | |

**Legend:** ✓ = recommended based on requirement content

---

## Open Questions

Points the requirement leaves unsettled. **Impact** says what each one does to testing:
*Blocking* — an acceptance criterion cannot be judged until it is answered, so its test
cases stay BLOCKED and the story cannot be released; *Judgement* — the main result is
testable, and the test records what the build does on this point instead of guessing;
*Info* — no test result depends on it. Classification test: SKILL.md Step 3b.

| # | Question | Raised against | Impact | Status | Answer (quoted, with source) | Assigned to |
|---|---|---|---|---|---|---|
| Q-001 | Is the endpoint path exactly "/api/admin/warranty/-notes" as written, or is it a typo for another path (for example `/api/admin/warranty-notes`)? Tests call the path exactly as written. | REQ-002 | Judgement | Answered | AP-2434 capture (the ticket's own When clause): "The user calls a POST request to /api/admin/warranty/-notes with the api key in the Authorization Bearer header". The acceptance criterion states the path, so the expected result is written in the ticket: a POST to that path must create the note. No Story or Task defines another warranty-notes path (searched: "warranty notes", "warranty-notes", "admin API warranty", "notes admin API", "api admin path endpoint"). Observed 2026-11-05 on Dev: the written path answers HTTP 405 with `Allow: GET`; notes are created only at `/api/admin/warranty-notes`. That 405 is a FAIL against the AC wording, not a record-only observation: it is recorded as a FAIL at the next re-test of AP2434_001 (step 2), together with AP-2549, which carries the same When sentence's Bearer header. Already asked in AP-2434 comment 19473 and named in AP-2549 — not posted again (re-classified 2026-11-15 after R1 re-analysis F-1) | Ken Nguyen |
| Q-002 | How does an admin API user get an API key, and which key and API base URL should QA use on staging? | REQ-001 | Info | Answered | AP-2308 (Story "Admin API keys", Done): "As an admin user, I can create API keys for my account for external app to use" and "When the menu opens, a sub item is available “Manage API keys” (french: “Gérer les clés API“)". The test-access part is settled: a Dev key "QA-automation" (expires 2026-12-05) has been in the gitignored `/.env` as `AVP_ADMIN_API_KEY` since 2026-11-05, and the Dev host `https://v2dev.garantieavantageplus.ca` is the `env` source's (searched: "admin API key", "API key X-API-KEY") | Ken Nguyen |
| Q-003 | What does a successful call return — which HTTP status code, and does the body contain the new note's ID or the note itself? | REQ-002 | Judgement | Accepted | No Story/Task defines it (searched: "warranty notes", "notes admin API", "API response status code") — current actual result accepted. Observed 2026-11-05 on Dev: `HTTP/1.1 201 Created`, body `{"success":true,"noteId":64,"message":"Warranty note created successfully"}` — the new note's ID, not the note | Ken Nguyen |
| Q-004 | Which fields are required, and what does the API return when a field is missing, `warranty_id` does not exist, or `is_public` is not true/false? | REQ-002 | Judgement | Accepted | No Story/Task defines it (searched: "warranty notes", "required fields validation API", "is_public note") — current actual result accepted. Observed 2026-11-05 on Dev: a missing `warranty_id` or `title` → `400` `{"success":false,"error":"Missing required fields: warranty_id, title, description"}`; an unknown `warranty_id` → `404` `{"success":false,"error":"Warranty contract not found"}`. Not accepted: `is_public=maybe` → HTTP 500 is an objective fault and stays a FAIL (AP-2548) | Ken Nguyen |
| Q-005 | What does the API return when the Authorization header is missing, or carries a wrong or revoked key? | REQ-001 | Judgement | Accepted | No Story/Task defines it (searched: "admin API key", "Missing API key", "Invalid API key", "Authorization Bearer header") — current actual result accepted. Observed 2026-11-05 on Dev: no key → `401` `{"error":"Missing API key"}`; a wrong key → `401` `{"error":"Invalid API key"}`; no note stored either way. A revoked key: recorded at execution. This does not cover the ticket's Bearer header, which the AC states and AP-2549 carries | Ken Nguyen |
| Q-006 | Where exactly in the admin area does the note appear (which page, which section), and which fields are shown — title, description, `file_content`, public flag, author, date? | REQ-004 | Judgement | Accepted | Where: AP-1596 (Story "Admin can add multiple notes in the warranty contract", Done): "The user is on the warranty details page" / "The following components appear at the bottom of the content" / "Notes list" / "A list of all notes related to the warranty". Which fields: no Story/Task defines them (searched: "warranty notes", "warranty note admin", "notes list warranty details") — current actual result accepted. Observed 2026-11-05 on Dev at `/admin/warranty/{id}`: title, description, a Public/Private badge, "Created by" the key owner's e-mail, and the date and time in local time. Whether `file_content` must show is Q-007, not settled here | Ken Nguyen |
| Q-007 | What is the difference between `description` ("Description of the note") and `file_content` ("Text field containing description of the note")? Which one is shown as the note body? | REQ-002, REQ-003, REQ-004 | Judgement | Accepted | No Story/Task defines it (searched: "file_content", "warranty notes", "note description body", "HTML 255 characters"; AP-2371 and AP-2362 repeat the same `file_content` wording for claim attachments and claim notes without defining it; AP-2267 and AP-2408 define note upload and edit, not this field) — current actual result accepted. Not accepted: `file_content` is stored nowhere (observed 2026-11-05 on Dev — not on the note card, no field on the edit page), which the capture row "Need to allow HTML with more than 255 characters" makes a FAIL (AP-2547). Which field shows as the note body is recorded at execution once AP-2547 is fixed. Nothing posted (re-classified 2026-11-15 after R1 re-analysis F-2) | Ken Nguyen |
| Q-008 | Is HTML in `file_content` shown formatted or as raw text in the admin area, and are unsafe tags such as `<script>` removed? | REQ-003, REQ-004 | Judgement | Accepted | No Story/Task defines it (searched: "note HTML script", "HTML 255 characters", "file_content") — current actual result accepted: recorded at execution. Not observable on 2026-11-05 because no `file_content` body is kept (AP-2547); AP2434_008 re-runs after the fix. A script that runs in the admin's browser would still be a FAIL | Ken Nguyen |
| Q-009 | Is there an upper length limit for `file_content`, and what happens above it? | REQ-003 | Judgement | Accepted | No Story/Task defines it (searched: "HTML 255 characters", "file_content") — current actual result accepted. Observed 2026-11-05 on Dev: a 2,000-character body is accepted (`201`) with no limit message; whether it is kept in full is recorded at execution once AP-2547 is fixed | Ken Nguyen |
| Q-010 | What does `is_public` change — is a public note visible to the dealer or the client, and where? | REQ-002 | Info | Answered | Dealer portal: AP-1596 (Story "Admin can add multiple notes in the warranty contract", Done), Dealer Area: "I am logged in the dealer portal" / "I go to the warranty page" / "I see a list of only notes where “Is public” value is checked" (searched: "is_public note", "public notes dealer portal"). AP-1596 covers the Dealer Area and the admin notes list only — client portal: not covered by AP-1596 (no test result depends on it) | Ken Nguyen |

**Knowledge lookup — 2026-11-15.** Every Open question was re-checked under Steps 3b–3c. Each query was `issuetype in (Story, Task) AND text ~ "<words>"`, any status, on AP. Plausible hits read in full: AP-1596, AP-2267, AP-2308, AP-2362, AP-2371, AP-2401, AP-2402, AP-2404, AP-2408, AP-2435, AP-707. Result: 3 Answered (Q-001 by the capture's own When sentence, Q-002, Q-010), 7 Accepted (Q-003, Q-004, Q-005, Q-006, Q-007, Q-008, Q-009), 0 Open (Q-001 and Q-007 re-classified after R1 re-analysis round 1, F-1 and F-2). No question is Blocking. Nothing was posted to Jira. The capture has no newer section that answers anything: the two comments added since capture are both by the QA account.

**For the next design pass:** steps that only record the build's behaviour on an Accepted question (Q-003, Q-004, Q-005, Q-006, Q-007, Q-008, Q-009) become record-and-accept steps — the recorded value above is the expected result. These stay FAILs: Q-004's HTTP 500 (AP-2548), any running script (Q-008), and `file_content` stored nowhere (Q-007, AP-2547). Q-001 is Answered by the AC: AP2434_001 step 2 asserts that a POST to the written path "/api/admin/warranty/-notes" creates the note, so a 405 (or any refusal) there is a FAIL at the next re-test of AP2434_001, recorded with AP-2549 — no longer a record-only observation.

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-001 | No admin API key or API base URL is known to QA; nothing can be executed without one | High | Resolved 2026-11-05 (Q-002) |
| REQ-001 | Response to a missing, wrong or revoked key is not specified | Medium | Accepted (Q-005) |
| REQ-002 | Endpoint path may be a typo | Medium | Answered — AC states it (Q-001); the 405 on the written path is a FAIL at the next re-test of AP2434_001 (with AP-2549) |
| REQ-002 | No success response (status code, body) specified | Medium | Accepted (Q-003) |
| REQ-002 | Required fields and validation errors not specified | Medium | Accepted (Q-004) |
| REQ-003 | HTML handling (rendered or escaped, scripts removed) not specified — possible stored cross-site scripting | Medium | Accepted (Q-008) — recorded at execution |
| REQ-003 | No upper length limit stated | Low | Accepted (Q-009) |
| REQ-003 | `description` and `file_content` are described almost identically | Low | Accepted (Q-007) — except `file_content` stored nowhere, a FAIL (AP-2547); body field recorded at execution after the fix |
| REQ-004 | Location and shown fields of the note in the admin area not specified; not yet mapped in `domain` | Medium | Accepted (Q-006) — mapped 2026-11-05 |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design — yes for design; execution needs an admin API key (Q-002) — superseded: the Dev key has been in use since 2026-11-05
- [x] 2026-11-15 — open questions re-checked with the knowledge lookup: 0 Blocking + Open; the Dev API key has been available since 2026-11-05
