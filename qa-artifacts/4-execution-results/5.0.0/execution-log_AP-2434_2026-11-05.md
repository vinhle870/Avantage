# Execution Log — AP-2434 (Admin API: create warranty notes)

## Execution Summary

**Environment:** Dev
**Executed by:** QA Agent — Manual Executor Skill (stlc-worker, stage `execute`)
**Date:** 2026-11-05
**Base URL:** `https://v2dev.garantieavantageplus.ca` (admin portal `/admin`, admin API `/api/admin/*`)
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**API client:** curl from Git Bash, every field sent with `--form-string`, `-sS -i --max-time 30`
**Duration:** 2026-11-05T05:26:10Z → 2026-11-05T05:31:30Z; rework (R3 round 1 F-1, AP2434_001 step 2 only) at 2026-11-05T05:41:02Z
**Test case files:** `qa-artifacts/3-test-cases/AP2434_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP2434_TestCases_006-008.md`
**Run folder:** `5.0.0` (fix version, from the run-state file)

| Metric | Value |
|---|:---:|
| Total test cases | 8 |
| Passed | 3 |
| Failed | 5 |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **37.5% (3 of 8)** |

### Deviations from the test cases (read before the results)

| # | Test cases say | Executed instead | Why |
|---|---|---|---|
| D-1 | Host `https://v2staging.garantieavantageplus.ca` (cases designed on 2026-11-01 against staging) | Host `https://v2dev.garantieavantageplus.ca` for every API call and admin page | `execution_env` in `qa-artifacts/qa-config/tools.md` is `Dev`; the key in `/.env` is a Dev key (a staging key would not work on Dev) |
| D-2 | Header `Authorization: Bearer $AVP_ADMIN_API_KEY` | Header `X-API-KEY: <AVP_ADMIN_API_KEY>` | `qa-docs/admin-api.md` §2 (from the OpenAPI spec): every `/api/admin/*` endpoint requires `X-API-KEY`. Confirmed by the orchestrator hand-off. AP2434_005's "wrong key" was sent in the same header with its last character changed. **Rework after R3 round 1 (F-1), 2026-11-05T05:41:02Z:** the ticket's Bearer form was sent once in AP2434_001 step 2 (no `X-API-KEY` header) and refused with 401 — step 2 is now FAIL; `X-API-KEY` stays the route that let 001 steps 3–4 and every other case run |
| D-3 | Path exactly as the ticket writes it: `POST /api/admin/warranty/-notes` | Tried once as written (AP2434_001 step 2: **HTTP 405 Method Not Allowed, `Allow: GET`** — no POST route there). Every note call after that went to `POST /api/admin/warranty-notes` | The executor rule: where the Execution Context disagrees with a knowledge source, the source wins and the log says so. The `domain` source `qa-docs/admin-api.md` §3.1 (OpenAPI spec) documents `POST /api/admin/warranty-notes`. The ticket-path result is recorded for **Q-001** — see AP2434_001 step 2. **For R3:** the case text says a route-level "not found" at the ticket path fails the step; a 405 is a route-level refusal, so the reviewer may judge that step 2 should be FAIL against the ticket text instead of an observation |
| D-4 | Key loaded with `export AVP_ADMIN_API_KEY=...` | Key loaded with the snippet in `qa-docs/admin-api.md` §4 into a shell variable inside one script; the value was never printed, logged or written. Commands below show it as `<AVP_ADMIN_API_KEY>` | Orchestrator instruction; credential policy |
| D-5 | Each negative case's step 1 (note titles listed) is done in the browser just before its call | The calls for 003/004/005 and 002/006/007/008 were sent in two batches; the titles "listed before the call" are the notes the earlier 201 responses had created (IDs known), and the page check after each batch confirmed the full list | Same evidence, fewer page loads; nothing else wrote notes to warranty 827 in the window (every note shows "Created by vinhle870@gmail.com" and an AP2434 title) |
| D-5 (evidence) | One screenshot per row | Several evidence files are byte-identical copies of one capture (same MD5): `AP2434_003-step4-…` = `AP2434_004-step3-…` = `AP2434_005-step3-…` (one capture of warranty 827, taken 2026-11-05T05:29:50Z after the 004/005 calls at 05:29:26–27Z, notes 64–67); `AP2434_002-step3-…` = `AP2434_006-step4-…` = `AP2434_007-step4-Warranty827No007Notes…` = `AP2434_008-step3-…` (one capture of warranty 827, taken 2026-11-05T05:31:03Z after the last call at 05:30:40Z, notes 64–69). Each copy still shows what its row claims | Added in the R3 round 1 rework (F-2): the page state after each batch answers every case in that batch |

### Request template used (key redacted)

```bash
KEY=$(sed -n 's/^AVP_ADMIN_API_KEY=//p' .env | tr -d '\r' | sed 's/^"//;s/"$//')   # never printed
curl -sS -i --max-time 30 -H "X-API-KEY: <AVP_ADMIN_API_KEY>" -H "Accept: application/json" \
  --form-string "warranty_id=827" --form-string "title=QA-AP2434-<TC>-<HHMMSS>" \
  --form-string "description=<D>" --form-string "is_public=<true|false>" \
  --form-string "file_content=<C>" \
  "https://v2dev.garantieavantageplus.ca/api/admin/warranty-notes" -o "<response file>"; echo "curl exit $?"
```

Every call passed the Request check: `curl exit 0` and the response file starts with `HTTP/1.1`. Every response file was checked for the key after saving — none contains it.

### Test data

| Item | Value | How chosen |
|---|---|---|
| `<W>` | Warranty contract record **827** — contract number **APOP01-827** (shown in the warranty list and the contract PDF; the page heading shows only "Warranty #"), dealer 1380 "Offical VinhLe870@gmail.com" (the QA's own test dealer), client "firstName lastName", approved June 5, 2026 14:25, no notes before this run | Admin → Contracts → Warranties → Approved tab; an approved contract on the QA dealer, not named by any other ticket in `test-data` or any artifact; not chosen by "newest" (it is the 9th approved row) |
| `<W-url>` / `<W-shown>` | `827` / `APOP01-827`. The API accepted `827` on the first call, so no retry with `APOP01-827` was needed | AP2434_001 step 1–2 |
| `<W2>` | Warranty contract **836** — APOP01-836, dealer 1363 "Test Dealer 2", client Ken Nguyen. **Read only** (no note sent to it) | Approved tab, a different dealer |
| `<WX>` | `999` — same format as `827` (digits); `/admin/warranty/999` returns **HTTP 404** in the admin portal | AP2434_007 step 1 |

**Records left on Dev (no delete endpoint; `cleanup` source is missing):** warranty notes **64, 65, 66, 67, 68, 69** on warranty contract **827** (titles below). No note was created by the refused calls (004, 005, 006 A/B, 007 A, 007 B ×2, and the rework's Bearer-header call 001 step 2d — 401, title `QA-AP2434-001B-054102`).

| Note ID | Title | is_public shown | From |
|---|---|---|---|
| 64 | `QA-AP2434-001-052803` | Public | AP2434_001 |
| 65 | `QA-AP2434-003-255-052913` | Public | AP2434_003 |
| 66 | `QA-AP2434-003-256-052913` | Public | AP2434_003 |
| 67 | `QA-AP2434-003-2000-052913` | Public | AP2434_003 |
| 68 | `QA-AP2434-002-053000` | Private | AP2434_002 |
| 69 | `QA-AP2434-008-053032` | Private | AP2434_008 |

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2434_001 | A valid API call with the key creates a public note that appears on the warranty in the admin area | High | ❌ | 2 | 2 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_001-step4-NoteShownBodyMissing_fail.png`, `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_001_step2d_response.txt` | Step 2: key in the Authorization Bearer header (as the ticket states) refused — 401 "Missing API key"; only X-API-KEY works. Step 4: note 64 (created with X-API-KEY, 201) shown with title, description and "Public", but the `file_content` HTML body is stored nowhere |
| AP2434_002 | A note sent with is_public "false" is also created and appears on the warranty in the admin area | Medium | ❌ | 2 | 1 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_002-step3-PrivateNoteBodyMissing_fail.png` | Note 68 shown as "Private"; its `file_content` body is missing, as in 001 |
| AP2434_003 | HTML note text just over 255 characters is kept in full, and a 2,000-character note is not silently cut | High | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_003-step4-LengthNotesNoBody_fail.png` | 255/256/2,000-char bodies all accepted (201) but none of the bodies is shown or editable — every letter is lost |
| AP2434_004 | A call with no API key — the response and whether any note appears are recorded | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_004-step3-NoKeyNoNoteStored_pass.png` | 401 `{"error":"Missing API key"}`; no note stored |
| AP2434_005 | A call with a wrong API key — the response and whether any note appears are recorded | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_005-step3-WrongKeyNoNoteStored_pass.png` | 401 `{"error":"Invalid API key"}`; no note stored |
| AP2434_006 | Calls missing the warranty ID or the title — each response is recorded and no note lands with invented values | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_006-step4-NoNoteFromRefusedCalls_pass.png` | Both calls 400 "Missing required fields: warranty_id, title, description"; no note created |
| AP2434_007 | Calls with an unknown warranty ID or an is_public value other than true/false are recorded; no other warranty gets a note | Medium | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_007-step3-IsPublicMaybeHttp500_fail.txt` | `is_public=maybe` returns HTTP 500 (twice); unknown warranty 999 gives a clean 404 |
| AP2434_008 | A script tag in the HTML note text — how the admin area shows it is recorded without a server error | Medium | ❌ | 2 | 1 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_008-step3-ScriptNoteBodyMissing_fail.png` | Note 69 created; "Before", "bold", "After" all missing (body dropped); script did not run |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

**Common root cause of four FAILs (001, 002, 003, 008):** the endpoint accepts a `file_content` field without complaint (201), but the warranty note has no place to keep it. The admin note card shows only the title, the description and a Public/Private badge, and the note edit page (`/admin/warranty/note/{id}/edit`) has only *Title\**, *Description\**, *Upload a file* and *Is public*. The OpenAPI spec (`qa-docs/admin-api.md` §3.1) lists `file` (a PDF upload) instead of `file_content`. The ticket's table says `file_content` is the "Text field containing description of the note. Need to allow HTML with more than 255 characters" (capture line 39). An API caller that follows the ticket loses the whole note body without being told. Q-007 (which field is the body) is still open, so R3 should weigh whether this is one bug or a question for the author.

---

## Step-by-Step Results

### AP2434_001 — A valid API call with the key creates a public note that appears on the warranty in the admin area — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in at `/admin/login`; Contracts → Warranties → open a warranty; record route, URL ID, shown number, existing notes; load the key | Admin welcome page loads; warranty page opens; route, IDs and notes recorded; key check prints `key loaded` | Login page heading = "Connexion", fields "Courriel"/"Mot de passe" → after "Se connecter" URL = `/admin`. Sidebar Contracts → "Warranties" (`/admin/warranty`, default tab "Pending approval") → tab "Approved" (`/admin/warranty/approved`) → row "APOP01-827 100m/20000km" → URL = `/admin/warranty/827`; heading = "Warranty #" (no number in heading); `<W-url>` = 827; `<W-shown>` = "APOP01-827" (list row and "# CONTRAT" in the embedded PDF); notes listed = none (only the "Add note" link `/admin/warranty/827/create-note`). Key script printed `key loaded` | ✅ | Admin warranty page route mapped for Q-006 and written back to the `domain` source |
| 2 | POST with the Test Data, `warranty_id=827`, key header; save the response | Request check passes; no 5xx; no route "not found"; record status and body | **Ticket path** `POST /api/admin/warranty/-notes` → `HTTP/1.1 405 Method Not Allowed`, header `Allow: GET`, body `{"title":"An error occurred","status":405,"detail":"Method Not Allowed"}` (file `AP2434_001_step2_response.txt`). **Documented path** `POST /api/admin/warranty-notes` → `HTTP/1.1 201 Created`, body `{"success":true,"noteId":64,"message":"Warranty note created successfully"}` (file `AP2434_001_step2c_response.txt`). `curl exit 0` both times. `<W>` = 827 accepted on the first try. **Rework (R3 round 1 F-1), 2026-11-05T05:41:02Z — ticket's header:** `POST /api/admin/warranty-notes` with the step's Test Data (`warranty_id=827`, title `QA-AP2434-001B-054102`, `is_public=true`, same description and `file_content`), header `Authorization: Bearer <AVP_ADMIN_API_KEY>` and **no** `X-API-KEY` → `HTTP/1.1 401 Unauthorized`, `Content-Type: application/json`, body `{"error":"Missing API key"}`; `curl exit 0`, first line `HTTP/1.1` (Request check passed); response file holds no key (file `AP2434_001_step2d_response.txt`). No note created. **Key in the Authorization Bearer header (as the ticket states) is refused: HTTP 401 {"error":"Missing API key"}; only X-API-KEY is accepted** | ❌ | FAIL on REQ-001 as the ticket writes it ("api key in the Authorization Bearer header"). The X-API-KEY call (201, note 64) is the route that let steps 3–4 run (deviation D-2). Q-001 observation (not a FAIL, per R3 round 1): the ticket's path has no POST route on Dev — 405, only GET allowed there. Q-003: success = 201 with `noteId` |
| 3 | Reload the warranty 827 page | Page loads without an error page | URL = `/admin/warranty/827`; page title "Garantie Avantage Plus"; a notes list now appears under the contract PDF | ✅ | — |
| 4 `[Verification]` | Find note `QA-AP2434-001-052803`; compare shown values with what was sent; earlier notes still listed | Note shown; every shown value matches; HTML body shown rendered or raw — only missing or different words fail; earlier notes still listed | Note card heading = "QA-AP2434-001-052803"; meta = "Thursday, November 5, 2026 at 12:28 AM Created by vinhle870@gmail.com"; paragraph = "Description sent by AP2434_001"; badge = "Public"; link "Edit" → `/admin/warranty/note/64/edit`. **Body text "Body sent by AP2434_001" visible = false, raw markup visible = false.** Edit page "Edit Note - Warranty Contract #827" fields: Title\* = "QA-AP2434-001-052803", Description\* = "Description sent by AP2434_001", "Upload a file" (Browse), checkbox "Is public" checked = true — no field holds the body. Earlier notes: none existed | ❌ | The `file_content` value was accepted (201) but stored nowhere: an integration sending the note body per the ticket loses it silently. Q-006/Q-007: shown fields = title, description, Public/Private, author, date/time (shown in local time, 12:28 AM for 05:28Z) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434-envcheck-DevAdminLogin_pass.png` — Dev admin login form shown (environment health check before execution)
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_001-step1-Warranty827BeforeNotes_pass.png` — warranty 827 before the run: contract APOP01-827 in the PDF, no notes, only "Add note"
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_001-step2-TicketPath405_info.txt` — network lines: ticket path 405, spec path 201
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_001_step2d_response.txt` — step 2 FAIL evidence (rework): Bearer header on the spec path → `HTTP/1.1 401 Unauthorized` `{"error":"Missing API key"}` (a screenshot cannot show an API status; no key in the file)
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_001-step4-NoteShownBodyMissing_fail.png` — the new note card shows title, description and "Public" but no body
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_001-step4-NoteEditNoBodyField_fail.png` — note 64 edit page: Title, Description, Upload a file, Is public — no body field

### AP2434_002 — A note sent with is_public "false" is also created and appears on the warranty in the admin area — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open warranty 827 | Warranty 827 page shown | `/admin/warranty/827` loaded in the same admin session (heading "Warranty #", contract PDF APOP01-827) | ✅ | — |
| 2 | POST `is_public=false` with the Test Data and the key | Request check passes; not 5xx; not "not found"; record status and body | 2026-11-05T05:30:01Z `POST /api/admin/warranty-notes` → `HTTP/1.1 201 Created`, `{"success":true,"noteId":68,"message":"Warranty note created successfully"}`; `curl exit 0` | ✅ | Q-003: same 201 shape as 001 |
| 3 `[Verification]` | Reload 827; find `QA-AP2434-002-053000` | Note shown; shown values match; body shown rendered or raw — missing words fail; record how "not public" is marked | Note card heading = "QA-AP2434-002-053000"; meta "…12:30 AM Created by vinhle870@gmail.com"; paragraph = "Description sent by AP2434_002"; badge = **"Private"**. Body "Private body sent by AP2434_002" visible = false (rendered or raw) | ❌ | Same lost `file_content` as 001. Q-006: a non-public note is marked with a "Private" badge in place of "Public" |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_002-step3-PrivateNoteBodyMissing_fail.png` — warranty 827 notes list after all calls; note QA-AP2434-002-053000 marked "Private", no body

### AP2434_003 — HTML note text just over 255 characters is kept in full, and a 2,000-character note is not silently cut — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open warranty 827 | Warranty 827 page shown | `/admin/warranty/827` loaded; note 64 listed | ✅ | — |
| 2 | Generate the 255-character body (`${#BODY}` = 255) and POST it, title `QA-AP2434-003-255-052913` | Request check passes; not 5xx; record status/body | 2026-11-05T05:29:13Z → `HTTP/1.1 201 Created`, `noteId` 65; `curl exit 0` | ✅ | — |
| 3 | POST the 256-character body (`${#BODY}` = 256) and the 2,000-character body (`${#BODY}` = 2000) | Request check passes for both; no 5xx; 256 not refused; record 2,000 outcome | 256 → `201 Created`, `noteId` 66. 2,000 → `201 Created`, `noteId` 67. `curl exit 0` both | ✅ | Q-009: a 2,000-character `file_content` is accepted, no limit message |
| 4 `[Verification]` | Reload 827; open each note; count the `a` letters | 255/256 notes show 239/240 `a`; the 2,000 note shows 1,984 `a`; record formatted or raw | Note cards "QA-AP2434-003-255-052913", "…-256-…", "…-2000-…": each shows paragraph "Length test" and badge "Public" only. Letters `a` shown = **0** in each (neither "QA" in bold nor raw `<p><b>QA</b>` visible). Edit pages have no body field (see 001 step 4) | ❌ | All three bodies were accepted and then lost — the "more than 255 characters" HTML the ticket requires is not kept at any length. Q-008 cannot be answered: no HTML is shown at all |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_003-step4-LengthNotesNoBody_fail.png` — full warranty 827 page: the three length notes show only "Length test" and "Public"

### AP2434_004 — A call with no API key — the response and whether any note appears are recorded — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open warranty 827; note the listed titles | Page shown; titles recorded | Titles listed before the call: QA-AP2434-001-052803, QA-AP2434-003-255-052913, QA-AP2434-003-256-052913, QA-AP2434-003-2000-052913 (notes 64–67) | ✅ | See deviation D-5 |
| 2 | POST with no key header, title `QA-AP2434-004-052926` | Request check passes; not 5xx; record status/body | 2026-11-05T05:29:26Z → `HTTP/1.1 401 Unauthorized`, body `{"error":"Missing API key"}`; `curl exit 0` | ✅ | Q-005: missing key → 401 "Missing API key" |
| 3 `[Verification]` | Reload 827; look for `QA-AP2434-004-052926` | Page loads; earlier titles still there; after a 4xx no such note | Page `/admin/warranty/827` loaded; notes 64–67 all listed; note "QA-AP2434-004-052926" visible = false | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_004-step3-NoKeyNoNoteStored_pass.png` — warranty 827 after the no-key and wrong-key calls: only notes 64–67, no 004 note

### AP2434_005 — A call with a wrong API key — the response and whether any note appears are recorded — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open warranty 827; note the listed titles | Page shown; titles recorded | Same four titles as 004 step 1 (notes 64–67) | ✅ | See deviation D-5 |
| 2 | Build the altered key in the shell (last character changed, not printed) and POST with it in `X-API-KEY`, title `QA-AP2434-005-052927` | Request check passes; not 5xx; record status/body | 2026-11-05T05:29:27Z → `HTTP/1.1 401 Unauthorized`, body `{"error":"Invalid API key"}`; `curl exit 0`; response file holds no key | ✅ | Q-005: wrong key → 401 "Invalid API key" |
| 3 `[Verification]` | Reload 827; look for `QA-AP2434-005-052927` | Page loads; earlier titles still there; after a 4xx no such note | Notes 64–67 listed; note "QA-AP2434-005-052927" visible = false | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_005-step3-WrongKeyNoNoteStored_pass.png` — warranty 827 after the wrong-key call: no 005 note

### AP2434_006 — Calls missing the warranty ID or the title — each response is recorded and no note lands with invented values — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open warranty 827; note the listed titles | Page shown; titles recorded | Titles before the calls: notes 64–68 (001, 003 ×3, 002) | ✅ | See deviation D-5 |
| 2 | Call A — no `warranty_id`, title `QA-AP2434-006A-053002` | Request check passes; not 5xx; record | → `HTTP/1.1 400 Bad Request`, `{"success":false,"error":"Missing required fields: warranty_id, title, description"}`; `curl exit 0` | ✅ | Q-004 |
| 3 | Call B — no `title`, `warranty_id=827` | Request check passes; not 5xx; record | → `HTTP/1.1 400 Bad Request`, same body `"Missing required fields: warranty_id, title, description"`; `curl exit 0` | ✅ | Q-004: the message lists all three required fields whichever one is missing — it does not say which is missing |
| 4 `[Verification]` | Reload 827; look for a note with description "AP2434_006 call B — no title" | Page loads; step-1 notes still there; any call-B note has no borrowed title | Notes 64–69 listed (69 is AP2434_008's); note with description "AP2434_006 call B — no title" visible = false; note "QA-AP2434-006A-…" visible = false | ✅ | Neither refused call created a note |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_006-step4-NoNoteFromRefusedCalls_pass.png` — warranty 827 final notes list: no 006 note

### AP2434_007 — Calls with an unknown warranty ID or an is_public value other than true/false are recorded; no other warranty gets a note — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open 827, pick `<W2>`, build `<WX>` and confirm it opens no warranty | Both pages load; `<W2>` recorded; `<WX>` opens nothing | `<W2>` = 836 (`/admin/warranty/836`, dealer "Test Dealer 2" `/admin/dealer/1363`, no notes). `<WX>` = 999: `/admin/warranty/999` → HTTP status 404 | ✅ | — |
| 2 | Call A — `warranty_id=999`, title `QA-AP2434-007A-053030` | Request check passes; not 5xx; record | → `HTTP/1.1 404 Not Found`, `{"success":false,"error":"Warranty contract not found"}`; `curl exit 0` | ✅ | Q-004: unknown warranty → 404 with a clear message |
| 3 | Call B — `warranty_id=827`, `is_public=maybe`, title `QA-AP2434-007B-053030` | Request check passes; **not an HTTP 5xx**; record | → `HTTP/1.1 500 Internal Server Error`, body `{"title":"An error occurred","status":500,"detail":"Internal Server Error"}`; `curl exit 0`. Retried once at 05:30:40Z (title `QA-AP2434-007B-053040`) → `500 Internal Server Error` again | ❌ | Reproduced 2/2. A caller sending any `is_public` value other than true/false gets a server crash instead of a 400 telling it what is wrong |
| 4 `[Verification]` | Reload 827 and 836; look for 007A/007B notes | No 007A note on 827 or 836; record any 007B note | Warranty 827: notes 64–69 only — "QA-AP2434-007A-…" visible = false, "QA-AP2434-007B-…" visible = false. Warranty 836: no notes at all | ✅ | No note went to another warranty; the 500 calls stored nothing |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_007-step3-IsPublicMaybeHttp500_fail.txt` — network lines: both `is_public=maybe` calls returned 500 (a screenshot cannot show an API status)
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_007-step4-Warranty827No007Notes_fail.png` — warranty 827 final notes: no 007A or 007B note
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_007-step4-Warranty836NoNotes_fail.png` — warranty 836 (other dealer) with no notes

### AP2434_008 — A script tag in the HTML note text — how the admin area shows it is recorded without a server error — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open warranty 827 | Page shown | `/admin/warranty/827` loaded | ✅ | — |
| 2 | POST the script-tag body (`is_public=false`), title `QA-AP2434-008-053032` | Request check passes; not 5xx; record | 2026-11-05T05:30:32Z → `HTTP/1.1 201 Created`, `noteId` 69; `curl exit 0` | ✅ | — |
| 3 `[Verification]` | Reload 827; open the note; read the tab title | Page loads; if shown, "Before", "bold" and "After" all present; record script handling and tab title | Note card heading = "QA-AP2434-008-053032"; paragraph = "AP2434_008 script tag test"; badge "Private". Page text contains "Before" = false, "After" = false, "bold" body text = false. `<script>` elements inside the content = 0. `document.title` = "Garantie Avantage Plus" (not "AP2434-XSS") | ❌ | The body words are lost (same root cause as 001). Q-008: the script did not run — but only because the body is not kept at all, so XSS handling of a stored body is still untested |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/AP2434_008-step3-ScriptNoteBodyMissing_fail.png` — warranty 827 final page: note 69 with description and "Private" only, tab title unchanged

---

## Blocked / Skipped Test Cases

None.

---

## Environment Observations

- **Environment: Dev.** Health check before execution: `GET https://v2dev.garantieavantageplus.ca/admin/login` → 200 in 0.61 s; login form "Connexion" visible (screenshot `AP2434-envcheck-DevAdminLogin_pass.png`). The `env-check` source is `missing`; this check followed `agent-coordination` routing c2.
- The test cases' Execution Context names staging and a Bearer header and the ticket path; the `env`/`domain` sources and the orchestrator name Dev, `X-API-KEY` and `/api/admin/warranty-notes`. Sources won (D-1 to D-3); the Execution Context is stale on these three facts.
- Notes created through the API show "Created by vinhle870@gmail.com" — the admin account that owns the key ("QA-automation"), not the calling app's name.
- Note times are shown in local time (Eastern): "12:28 AM" for a note created 05:28 UTC.
- The admin warranty page heading is "Warranty #" with no number; the contract number (APOP01-827) appears only in the list and in the embedded PDF.
- Responses carry Cloudflare headers; no rate limiting was seen across 13 calls in about 3 minutes (plus 1 rework call at 05:41:02Z).
- The admin console logged 1 error on the login page and on each warranty page load (present before any test call; not tied to a step).
