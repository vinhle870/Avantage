# Bug Report — AP-2434

**Project:** Avantage Plus v2 — Admin API and admin portal (Jira project AP)
**Report ID:** BR-20261105-001
**Test Cycle:** AP-2434 — Admin API: create warranty notes (single-ticket STLC run, run folder `5.0.0`)
**Date:** 2026-11-05 (written 2026-11-05T05:46Z)
**Reported by:** QA Agent — Bug Reporter Skill (stlc-worker, stage `file-bugs`)
**Source:** qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2434_2026-11-05.md, qa-artifacts/3-test-cases/AP2434_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2434_TestCases_006-008.md
**Environment:** Dev — https://v2dev.garantieavantageplus.ca (the execution environment chosen for this batch)
**Gate C decision:** independent reviewer, R3 round 2, APPROVE — rule C4 (File new) for every FAIL (qa-artifacts/7-reviews/AP-2434_review.md)

| Metric | Value |
|---|:---:|
| Total defects | 3 |
| Critical | 0 |
| High | 1 |
| Medium | 2 |
| Low | 0 |
| Tracker tickets created | 3 |

Five test cases failed on Dev, for three different reasons. Four of them (AP2434_001, _002,
_003 and _008) fail because the API accepts the note's HTML body in `file_content` and then
keeps it nowhere. AP2434_007 fails because an `is_public` value other than true/false crashes
the server (HTTP 500). AP2434_001 also fails at step 2 because the key in the
`Authorization: Bearer` header, as the ticket specifies, is refused. The reviewer's duplicate
search found no open bug on the warranty-notes endpoint, so each defect was filed as a new
ticket and linked to AP-2434.

The API key never appears in this report or in any attached file; where a command needs it,
it is written as `<AVP_ADMIN_API_KEY>`.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2434_001 (step 4), AP2434_002 (step 3), AP2434_003 (step 4), AP2434_008 (step 3) | Admin API POST /api/admin/warranty-notes accepts the file_content HTML body (201) but stores and shows it nowhere — the note body is silently lost at every length | High | P1 | [AP-2547](https://garantieavantageplus.atlassian.net/browse/AP-2547) | Open |
| BUG-002 | AP2434_007 (step 3) | Admin API POST /api/admin/warranty-notes returns HTTP 500 when is_public is not true/false (e.g. 'maybe') instead of a 400 | Medium | P2 | [AP-2548](https://garantieavantageplus.atlassian.net/browse/AP-2548) | Open |
| BUG-003 | AP2434_001 (step 2) | Admin API POST /api/admin/warranty-notes refuses the key in the Authorization Bearer header that AP-2434 specifies (401 Missing API key); only X-API-KEY works | Medium | P2 | [AP-2549](https://garantieavantageplus.atlassian.net/browse/AP-2549) | Open |

---

## Bug Details

---

### BUG-001 — The warranty-notes API accepts the file_content HTML body but stores and shows it nowhere

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2434_001 (step 4), AP2434_002 (step 3), AP2434_003 (step 4), AP2434_008 (step 3) — the step under test in each |
| **Requirement** | REQ-003 — `file_content`: "Text field containing description of the note. Need to allow HTML with more than 255 characters"; REQ-004 — "The note is created and displayed in the admin area" |
| **Severity** | High — an integration that sends the note body the way the ticket describes gets "Warranty note created successfully" and loses the whole body without any error, at every length (37, 255, 256 and 2,000 characters) |
| **Priority** | P1 — the HTML body over 255 characters is the main point of the ticket, and nothing of it is kept |
| **Environment** | Dev (https://v2dev.garantieavantageplus.ca) · curl from Git Bash for the API · Chromium (Playwright) for the admin portal · Windows 11 · viewport 1280 × 800 · app version not shown by Dev |
| **Tracker Ticket** | [AP-2547](https://garantieavantageplus.atlassian.net/browse/AP-2547) |
| **Status** | Open |
| **First found** | 2026-11-05 |
| **Reproducibility** | Always — 6 of 6 notes (64, 65, 66, 67, 68, 69 on warranty 827) |

**Summary:**
`POST /api/admin/warranty-notes` answers 201 "Warranty note created successfully" to a call that carries an HTML body in `file_content`, but the body is not shown on the warranty's notes list in the admin portal and the note's edit page has no field that holds it.

**Steps to Reproduce:**

1. Have an admin API key for Dev (the QA used the key named "QA-automation"; shown here as `<AVP_ADMIN_API_KEY>`).
2. Send this request from a terminal (every field with `--form-string`, so curl sends a value that starts with `<` as text):
   `curl -sS -i -X POST "https://v2dev.garantieavantageplus.ca/api/admin/warranty-notes" -H "X-API-KEY: <AVP_ADMIN_API_KEY>" --form-string "warranty_id=827" --form-string "title=QA-AP2434-001-052803" --form-string "description=Description sent by AP2434_001" --form-string "is_public=true" --form-string "file_content=<p>Body sent by <b>AP2434_001</b></p>"`
3. See the response `HTTP/1.1 201 Created` with body `{"success":true,"noteId":64,"message":"Warranty note created successfully"}`.
4. Sign in to the admin portal at https://v2dev.garantieavantageplus.ca/admin/login with an admin account, open Contracts → "Warranties" → tab "Approved" → row "APOP01-827" (page `/admin/warranty/827`).
5. Find the note "QA-AP2434-001-052803" in the notes list under the contract PDF, then click its "Edit" link (`/admin/warranty/note/64/edit`).
6. Repeat step 2 with a longer body, for example `file_content` = `<p><b>QA</b>` + 1,984 letters `a` + `</p>` (2,000 characters), and look at that note the same way.

**Expected Result:**
The note is created and its `file_content` HTML body ("Body sent by AP2434_001", with "AP2434_001" in bold, or the raw markup) is shown with the note in the admin area, and a body longer than 255 characters is kept in full — as the ticket's `file_content` row and its Then clause ("The note is created and displayed in the admin area") require.

**Actual Result:**
The note card shows only the title "QA-AP2434-001-052803", the date and author ("Created by vinhle870@gmail.com"), the description "Description sent by AP2434_001" and a "Public" badge. The text "Body sent by AP2434_001" does not appear, neither formatted nor as raw markup. The edit page "Edit Note - Warranty Contract #827" has only *Title\**, *Description\**, *Upload a file* and *Is public* — no field holds the body. The same happens for `is_public=false` (note 68, "Private" badge), for 255-, 256- and 2,000-character bodies (notes 65, 66, 67 — no letter of the body is shown) and for a body with a `<script>` tag (note 69 — "Before", "bold" and "After" all missing).

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_001-step4-NoteShownBodyMissing_fail.png` — note 64 on warranty 827: title, description and "Public" only, no body |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_001-step4-NoteEditNoBodyField_fail.png` — note 64 edit page: Title, Description, Upload a file, Is public — no body field |
| Screenshot (context) | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_003-step4-LengthNotesNoBody_fail.png` — the 255/256/2,000-character notes show "Length test" and "Public" only |
| API response | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_001_step2c_response.txt` — 201 Created, noteId 64 (no key in the file) |
| Console log | None tied to the step (one console error appears on every admin page load, before any test call) |

**Suggested Root Cause:**
Unknown — for dev investigation. The OpenAPI spec of the admin API lists a `file` (PDF upload) field and no `file_content`, so the endpoint may simply ignore the unknown field.

**Notes:**
- **Question for the author (Q-007):** what is the difference between `description` ("Description of the note") and `file_content` ("Text field containing description of the note")? Which one is the note body shown in the admin area — and if `file_content` is the body, where should it appear?
- **Q-008 (how HTML and `<script>` tags are shown) is untested** until this is fixed: no body is kept, so there is nothing to render. The script in note 69 did not run, but only because the body was dropped.
- The re-test of this bug re-runs AP2434_001, AP2434_002, AP2434_003 **and AP2434_008** (the script-tag case).
- Test data left on Dev: notes 64–69 on warranty contract 827 (APOP01-827); the API has no delete endpoint.

---

### BUG-002 — The warranty-notes API returns HTTP 500 when is_public is not true or false

| Field | Value |
|---|---|
| **Bug ID** | BUG-002 |
| **Test Case** | AP2434_007 (step 3 — the step under test) |
| **Requirement** | REQ-002 — the payload table: `is_public` — bool — "true or false" |
| **Severity** | Medium — a caller that sends a wrong `is_public` value gets a server crash with no hint of what is wrong; nothing is stored and other calls keep working |
| **Priority** | P2 — fix in the current sprint; a 500 for bad input hides the cause from every API caller |
| **Environment** | Dev (https://v2dev.garantieavantageplus.ca) · curl from Git Bash · Windows 11 · app version not shown by Dev |
| **Tracker Ticket** | [AP-2548](https://garantieavantageplus.atlassian.net/browse/AP-2548) |
| **Status** | Open |
| **First found** | 2026-11-05 |
| **Reproducibility** | Always (2 of 2 attempts, 05:30:30Z and 05:30:40Z) |

**Summary:**
`POST /api/admin/warranty-notes` with `is_public=maybe` answers `HTTP/1.1 500 Internal Server Error` instead of a 400 that says `is_public` must be true or false.

**Steps to Reproduce:**

1. Have an admin API key for Dev (the QA used the key named "QA-automation"; shown here as `<AVP_ADMIN_API_KEY>`).
2. Send this request from a terminal:
   `curl -sS -i -X POST "https://v2dev.garantieavantageplus.ca/api/admin/warranty-notes" -H "X-API-KEY: <AVP_ADMIN_API_KEY>" --form-string "warranty_id=827" --form-string "title=QA-AP2434-007B-053030" --form-string "description=AP2434_007 call B" --form-string "is_public=maybe" --form-string "file_content=<p>Invalid is_public</p>"`
3. Read the status line and body of the response.
4. Send the same request again with the title `QA-AP2434-007B-053040`.

**Expected Result:**
The API refuses the call with a client error (HTTP 400) that names `is_public` as invalid, the same way it answers 400 "Missing required fields: …" when a field is missing and 404 "Warranty contract not found" for an unknown warranty. The ticket defines `is_public` as "true or false".

**Actual Result:**
Both calls answer `HTTP/1.1 500 Internal Server Error` with body `{"type":"https://tools.ietf.org/html/rfc2616#section-10","title":"An error occurred","status":500,"detail":"Internal Server Error"}`. No note is created on warranty 827 (checked in the admin portal at `/admin/warranty/827`).

**Evidence:**

| Type | Path / Link |
|---|---|
| Network lines | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_007-step3-IsPublicMaybeHttp500_fail.txt` — both calls, method, URL and status (a screenshot cannot show an API status) |
| API response | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_007_step3_response.txt` — full 500 response (no key in the file) |
| API response | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_007_step3b_retry_response.txt` — retry, 500 again |

**Suggested Root Cause:**
Unknown — for dev investigation. Probably the value is cast to a boolean without validation.

**Notes:**
- The ticket does not say what an invalid `is_public` should return (open question Q-004); any 4xx with a clear message would meet it, a 500 does not.

---

### BUG-003 — The warranty-notes API refuses the key in the Authorization Bearer header that the ticket specifies

| Field | Value |
|---|---|
| **Bug ID** | BUG-003 |
| **Test Case** | AP2434_001 (step 2) |
| **Requirement** | REQ-001 — When clause: "The user calls a POST request to /api/admin/warranty/-notes with the api key in the Authorization Bearer header" |
| **Severity** | Medium — an integration built from the ticket cannot authenticate at all; the `X-API-KEY` header works, so a workaround exists once the caller knows it |
| **Priority** | P2 — either the API or the ticket must change before integrators use it |
| **Environment** | Dev (https://v2dev.garantieavantageplus.ca) · curl from Git Bash · Windows 11 · app version not shown by Dev |
| **Tracker Ticket** | [AP-2549](https://garantieavantageplus.atlassian.net/browse/AP-2549) |
| **Status** | Open |
| **First found** | 2026-11-05 |
| **Reproducibility** | Always (seen by the QA at 05:41:02Z and by the reviewer's own probe the same morning) |

**Summary:**
`POST /api/admin/warranty-notes` with a valid key in `Authorization: Bearer <key>` answers `HTTP/1.1 401 Unauthorized` `{"error":"Missing API key"}`; the same key is accepted only in an `X-API-KEY` header.

**Steps to Reproduce:**

1. Have an admin API key for Dev (the QA used the key named "QA-automation"; shown here as `<AVP_ADMIN_API_KEY>`).
2. Send this request from a terminal, with the key in the Authorization header and **no** `X-API-KEY` header:
   `curl -sS -i -X POST "https://v2dev.garantieavantageplus.ca/api/admin/warranty-notes" -H "Authorization: Bearer <AVP_ADMIN_API_KEY>" --form-string "warranty_id=827" --form-string "title=QA-AP2434-001B-054102" --form-string "description=Description sent by AP2434_001" --form-string "is_public=true" --form-string "file_content=<p>Body sent by <b>AP2434_001</b></p>"`
3. Read the status line and body of the response.
4. Send the same request with `-H "X-API-KEY: <AVP_ADMIN_API_KEY>"` in place of the Authorization header, and compare.

**Expected Result:**
The call is accepted and the note is created, because the ticket says the key is sent "in the Authorization Bearer header".

**Actual Result:**
Step 2 answers `HTTP/1.1 401 Unauthorized`, `Content-Type: application/json`, body `{"error":"Missing API key"}` — the server does not see the key at all — and no note is created. Step 4 with `X-API-KEY` answers `201 Created` (`{"success":true,"noteId":64,…}` for the QA's first call).

**Evidence:**

| Type | Path / Link |
|---|---|
| API response | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_001_step2d_response.txt` — 401 "Missing API key" for the Bearer header (no key in the file) |
| Network lines (context) | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_001-step2-TicketPath405_info.txt` — the ticket's path answers 405; the documented path answers 201 with `X-API-KEY` |

**Suggested Root Cause:**
Unknown — for dev investigation. The admin API's OpenAPI spec documents `X-API-KEY` only, so the ticket and the build disagree; either the API should also read `Authorization: Bearer`, or the ticket should be corrected.

**Notes:**
- **Context for Q-001 (endpoint path):** the path exactly as the ticket writes it, `POST /api/admin/warranty/-notes`, answers `HTTP/1.1 405 Method Not Allowed` with header `Allow: GET`. All tests ran on the documented path `/api/admin/warranty-notes`. Please confirm which path is correct.

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 1 | AP2434_001, AP2434_002, AP2434_003, AP2434_008 |
| Medium | 2 | AP2434_007, AP2434_001 |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — Authenticate the admin API call with an API key | 1 | BUG-003 |
| REQ-002 — Create a warranty note through POST multipart form data | 1 | BUG-002 |
| REQ-003 — `file_content` accepts HTML longer than 255 characters | 1 | BUG-001 |
| REQ-004 — The created note is displayed in the admin area | 1 | BUG-001 |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Bug Reporter Skill (creation); Ticket Updater Skill (later actions)
**Date:** 2026-11-05

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | [AP-2547](https://garantieavantageplus.atlassian.net/browse/AP-2547) | Created (Gate C rule C4), linked to AP-2434 | Backlog (High, assigned Ken Nguyen) | 2026-11-05T05:48Z |
| BUG-002 | [AP-2548](https://garantieavantageplus.atlassian.net/browse/AP-2548) | Created (Gate C rule C4), linked to AP-2434 | Backlog (Medium, assigned Ken Nguyen) | 2026-11-05T05:51Z |
| BUG-003 | [AP-2549](https://garantieavantageplus.atlassian.net/browse/AP-2549) | Created (Gate C rule C4), linked to AP-2434 | Backlog (Medium, assigned Ken Nguyen) | 2026-11-05T05:52Z |
| — | [AP-2434](https://garantieavantageplus.atlassian.net/browse/AP-2434) (the tested story) | Story result comment posted (Gate D rule §3.1, by reviewer R4) — comment 19473, read back via REST v3 (heading, bold, mention, bug links rendered); no status move, assignee unchanged | QC (assignee Vinh Le - QC) | 2026-11-05T05:58Z |

**Filing notes (2026-11-05T05:52:40Z):** each ticket was created through the Jira CLI with a placeholder body, then its description was written as wiki markup through the REST v2 API (the CLI mangles markup). Evidence was attached and embedded in the description: AP-2547 — 3 screenshots; AP-2548 — 2 text files (network lines and the full 500 response); AP-2549 — 2 text files (the 401 response and the ticket-path 405 network lines). A read-back through REST v3 confirmed every media node has an id, the steps render as a numbered list with no stray level-1 heading, the priority, assignee (Ken Nguyen, `bug_new_assign`) and labels `qa-agent`, `stlc-automated` are set, each ticket is linked to AP-2434 as "Relates", and no fragment of the API key appears in any description or attachment (every attachment was checked before upload). A duplicate search just before filing (`type = Bug AND summary ~ "warranty-notes"`) found only AP-723 (Done, admin notes textarea — a different screen), so nothing was filed twice.
