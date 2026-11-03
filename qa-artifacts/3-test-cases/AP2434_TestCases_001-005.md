# Test Cases — AP2434 (File 1 of 2)

**Project:** Avantage Plus v2
**Requirement:** AP2434 — Admin API: create warranty notes
**Source:** requirements/AP-2434-admin-api-create-warranty-notes.md · qa-artifacts/1-requirements-analysis/AP-2434_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2434_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2434_001 to AP2434_005 (5 test cases)
**Coverage:** Functional · Edge-case · Negative · API · UI

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin portal (for finding the warranty and checking the note) + the admin API (for creating the note) | `navigation` |
| **Entry route** | Admin login `/admin/login` → `/admin`. The admin page that lists a warranty and its notes is **Not known** — admin warranty pages are not mapped yet (`navigation` §4 "Admin area beyond dealers, insurance and Risk Management"). The executor finds it from the admin sidebar, records the route in the log, and writes it back to the `domain` source | `navigation` |
| **API endpoint** | `POST https://v2staging.garantieavantageplus.ca/api/admin/warranty/-notes` — host from `env` ("assume the same host as the portal until told otherwise"); path exactly as written in the ticket (Q-001) | `env`, capture |
| **API request format** | `multipart/form-data`, header `Authorization: Bearer <key>`. Sent with curl from Git Bash, every text field with `--form-string` (never `-F`: curl reads a `-F` value that starts with `<` from a local file and sends nothing — every `file_content` here starts with `<`): `curl -sS -i -X POST "<endpoint>" -H "Authorization: Bearer $AVP_ADMIN_API_KEY" --form-string "warranty_id=<W>" --form-string "title=<T>" --form-string "description=<D>" --form-string "is_public=<true/false>" --form-string "file_content=<C>" -o "<response file>"; echo "curl exit $?"`. The response file is `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/<TC>_step<n>_response.txt` (status line, headers, body) | test plan §3.3 |
| **Request check** | Applies to every POST step below. The request counts as sent only when curl prints `curl exit 0` and the first line of the response file starts with `HTTP/` (check with `head -1 "<response file>"`). If curl exits non-zero or the file has no HTTP status line, nothing reached the server: the step and the case are **BLOCKED (environment)** with the curl error message recorded — never PASS, never FAIL | F-1 of review R2 (independent) |
| **Loading the key** | Before the first request, from the repository root in Git Bash, load only the key variable by name: `export AVP_ADMIN_API_KEY="$(sed -n 's/^AVP_ADMIN_API_KEY=//p' ./.env)"; AVP_ADMIN_API_KEY="${AVP_ADMIN_API_KEY%$'\r'}"` (values in /.env are unquoted; the second command drops a Windows line ending). Never echo, print or log its value; check only that it is set with `[ -n "$AVP_ADMIN_API_KEY" ] && echo key loaded` | `env` |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging (`https://v2staging.garantieavantageplus.ca`) | `env` |
| **Login** | Admin portal: shared admin account from `env` (`vinhle870@gmail.com`). Admin API key: **[SET IN .env: AVP_ADMIN_API_KEY]** — **Not known**: no key exists in `/.env` or any knowledge file | `env` |
| **Test data** | One existing warranty on staging, chosen in AP2434_001 step 1. `<W>` is the identifier the API accepted in AP2434_001 step 2 (the record ID from the warranty page URL, or the number shown on the page if the URL ID was refused as "warranty not found"); it is recorded in the execution log and reused by every later case | test plan §8.1 |
| **Language** | Admin login page is French ("Connexion", "Courriel", "Mot de passe", "Se connecter"); the rest of the admin area as found | `navigation` |
| **Leaves behind** | One or more notes per case on warranty `<W>`, titled `QA-AP2434-<TC>-<HHMMSS>`. No delete endpoint is described and `cleanup` is `missing` | `cleanup` (missing) |

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | A staging admin API key for QA (and confirmation of the API host) | AP2434_001 – AP2434_005 | Open — Q-002 (Info in the analysis, but it stops execution of every case). Raised 2026-11-01 |
| 2 | The admin page that shows a warranty's notes | AP2434_001 – AP2434_005 | Open — Q-006 (Judgement). Not a stopper on its own: the executor can locate it in the admin portal during s4 |

> Every case below ships with **Status: BLOCKED** and **Blocked by: Q-002** until the key
> is stored in `/.env` as `AVP_ADMIN_API_KEY`. Once it is, set them back to `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2434_001 | A valid API call with the key creates a public note that appears on the warranty in the admin area | Functional | High | BLOCKED |
| AP2434_002 | A note sent with is_public "false" is also created and appears on the warranty in the admin area | Functional | Medium | BLOCKED |
| AP2434_003 | HTML note text just over 255 characters is kept in full, and a 2,000-character note is not silently cut | Edge-case | High | BLOCKED |
| AP2434_004 | A call with no API key — the response and whether any note appears are recorded | Negative | High | BLOCKED |
| AP2434_005 | A call with a wrong API key — the response and whether any note appears are recorded | Negative | Medium | BLOCKED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2434_001 — A valid API call with the key creates a public note that appears on the warranty in the admin area

| Field | Value |
|---|---|
| **TC ID** | AP2434_001 |
| **Title** | A valid API call with the key creates a public note that appears on the warranty in the admin area |
| **Requirement** | AP2434 — REQ-001 (key in the Authorization Bearer header), REQ-002 ("The note is created"), REQ-004 ("displayed in the admin area") |
| **Route** | `POST /api/admin/warranty/-notes`, then the admin warranty page (route recorded at execution) |
| **Type** | Functional · Regression |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-002 — no staging admin API key available to QA |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** This is the whole story in one case: an outside system with an API key writes a note, and an admin can see it. The HTTP response is recorded rather than judged, because the ticket names no status code or response body (Q-003). Which fields the admin area shows is recorded too (Q-006, Q-007). The request goes to the path exactly as the ticket writes it; if that path answers "not found", the case fails against the ticket's own text and the bug asks the author whether the path is a typo (Q-001). The ticket only says "the ID of the warranty", and the admin page may show a number that differs from the record ID in its URL, so both are recorded and a "warranty not found" is kept apart from a "route not found".

**Revisions:**

| Date | Change | Reason |
|---|---|---|
| 2026-11-01 | Step 2: fields sent with `--form-string` and `-sS`; a response with no HTTP status line is BLOCKED (environment) | R2 independent F-1 — `-F "file_content=<…"` makes curl read a local file and send nothing |
| 2026-11-01 | Steps 1–2: record the URL record ID and the displayed number; send the URL ID, retry once with the displayed number on "warranty not found"; only a route "not found" fails for Q-001 | R2 independent F-3 |
| 2026-11-01 | Step 4: the HTML body matches when either the rendered text or the raw markup is shown | R2 independent F-6 |

**Test Data:**

| Variable | Value |
|---|---|
| warranty_id | `<W-url>` recorded in step 1 (retry: `<W-shown>`, see step 2); the accepted one becomes `<W>` |
| title | `QA-AP2434-001-<HHMMSS>` (current time, so the note is unique) |
| description | `Description sent by AP2434_001` |
| is_public | `true` |
| file_content | `<p>Body sent by <b>AP2434_001</b></p>` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the shared admin account ("Courriel" / "Mot de passe" → "Se connecter"). From the admin sidebar, open the warranty list and open any existing warranty. Record: the page route; the record ID in the page URL (`<W-url>`); any warranty or contract number shown on the page (`<W-shown>`, or "none shown"); and the titles of any notes already shown on it. Load the key as in the Execution Context ("Loading the key") | The admin welcome page loads after login. A warranty's page opens; its route, `<W-url>`, `<W-shown>` and existing note titles (or "no notes") are written in the execution log. The key check prints `key loaded` |
| 2 | Send the POST request as in the Execution Context ("API request format"), with the Test Data above, `warranty_id` = `<W-url>` and `-H "Authorization: Bearer $AVP_ADMIN_API_KEY"`. Save to `AP2434_001_step2_response.txt`. If the response says the **warranty** is not found (or invalid) and `<W-shown>` differs from `<W-url>`, send the same request once more with `warranty_id` = `<W-shown>` and save to `AP2434_001_step2b_response.txt`. Record which identifier was accepted as `<W>` | The Request check passes for each call (otherwise BLOCKED — environment). No response is an HTTP 5xx. No response is a **route** "not found" — a 404 whose body names the path or route, or a framework/web-server "page not found" page, rather than the warranty — that fails for Q-001. A "warranty not found" is not a route failure; if every identifier tried is refused as "warranty not found", the step fails (an existing warranty cannot get a note) and both responses are attached. Record the status codes and bodies for Q-003 |
| 3 | Reload the warranty `<W>` page in the admin portal | The page loads without an error page |
| 4 | [Verification] On the warranty `<W>` page, find the note titled `QA-AP2434-001-<HHMMSS>` and compare what is shown with what was sent. Check that every note title recorded in step 1 is still listed | The note with exactly that title is shown on warranty `<W>`. Any of the sent values that is shown (description, body, public flag) matches what was sent, with no value nobody entered. For the HTML body, either the rendered text ("Body sent by AP2434_001", with "AP2434_001" in bold or not) or the raw markup `<p>Body sent by <b>AP2434_001</b></p>` counts as a match; only missing or different words fail. Every earlier note is still listed. Record which fields are shown and where, and whether the body is rendered or raw, for Q-006, Q-007 and Q-008 |

---

### AP2434_002 — A note sent with is_public "false" is also created and appears on the warranty in the admin area

| Field | Value |
|---|---|
| **TC ID** | AP2434_002 |
| **Title** | A note sent with is_public "false" is also created and appears on the warranty in the admin area |
| **Requirement** | AP2434 — REQ-002 (`is_public` is "true or false"; "The note is created"), REQ-004 |
| **Route** | `POST /api/admin/warranty/-notes`, then the admin warranty page recorded in AP2434_001 |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Q-002 — no staging admin API key available to QA |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** The ticket allows both values of `is_public`. A private note must still be created and visible to admins. What "public" changes outside the admin area is not stated (Q-010) and is not tested here.

**Revisions:**

| Date | Change | Reason |
|---|---|---|
| 2026-11-01 | Step 2: fields sent with `--form-string` and `-sS`; the Request check applies | R2 independent F-1 |
| 2026-11-01 | Step 3: the HTML body matches when either the rendered text or the raw markup is shown | R2 independent F-6 |

**Test Data:**

| Variable | Value |
|---|---|
| warranty_id | `<W>` from AP2434_001 |
| title | `QA-AP2434-002-<HHMMSS>` |
| description | `Description sent by AP2434_002` |
| is_public | `false` |
| file_content | `<p>Private body sent by <b>AP2434_002</b></p>` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the shared admin account and open the warranty `<W>` page at the route recorded in AP2434_001 | Warranty `<W>` page is shown |
| 2 | Load the key ("Loading the key") and send the POST request as in the Execution Context ("API request format", `--form-string` for every field) with the Test Data above and the Bearer key. Save to `AP2434_002_step2_response.txt` | The Request check passes (otherwise BLOCKED — environment). The response is not an HTTP 5xx and not "not found". Record the status code and body for Q-003 |
| 3 | [Verification] Reload the warranty `<W>` page and find the note titled `QA-AP2434-002-<HHMMSS>` | The note with exactly that title is shown on warranty `<W>`. Any sent value that is shown matches what was sent; for the HTML body, either the rendered text ("Private body sent by AP2434_002") or the raw markup `<p>Private body sent by <b>AP2434_002</b></p>` counts as a match — only missing or different words fail. Record how the admin area marks it as not public, if at all (Q-006) |

---

### AP2434_003 — HTML note text just over 255 characters is kept in full, and a 2,000-character note is not silently cut

| Field | Value |
|---|---|
| **TC ID** | AP2434_003 |
| **Title** | HTML note text just over 255 characters is kept in full, and a 2,000-character note is not silently cut |
| **Requirement** | AP2434 — REQ-003: `file_content` "Need to allow HTML with more than 255 characters" |
| **Route** | `POST /api/admin/warranty/-notes`, then the admin warranty page recorded in AP2434_001 |
| **Type** | Edge-case |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-002 — no staging admin API key available to QA |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** The ticket says outright that more than 255 characters must be allowed, which suggests an older limit cut notes short. 255 is the last length under that limit and 256 the first one over it — the 256-character note is the check the ticket demands. The 2,000-character note is a realistic long note; because the ticket states no upper limit (Q-009), its acceptance or refusal is recorded, and it fails only if it is stored but silently cut short. Whether the HTML is shown formatted or as raw tags is not stated (Q-008) and is recorded only.

**Revisions:**

| Date | Change | Reason |
|---|---|---|
| 2026-11-01 | Steps 3–4: the 2,000-character result made record-only, except for silent truncation | R2 round 1 F-1 — a refusal at 2,000 characters depends on Q-009 (Judgement, Open) |
| 2026-11-01 | Steps 2–3: the generated body is sent with `--form-string` and `-sS`; the Request check applies to all three calls | R2 independent F-1 |

**Test Data:**

Each body is `<p><b>QA</b>` + the letter `a` repeated + `</p>`, sized to the exact total length. Generate it in Git Bash into a shell variable with `BODY="$(python -c "n=<N>; print('<p><b>QA</b>' + 'a'*(n-16) + '</p>', end='')")"`, check the length with `echo ${#BODY}`, and pass it with `--form-string "file_content=$BODY"` (never `-F`: the body starts with `<`).

| Variable | Value | Notes |
|---|---|---|
| warranty_id | `<W>` from AP2434_001 | |
| title (255) | `QA-AP2434-003-255-<HHMMSS>` | |
| file_content (255) | 255-character body as above (239 × `a`) | Last length at the old limit |
| title (256) | `QA-AP2434-003-256-<HHMMSS>` | |
| file_content (256) | 256-character body (240 × `a`) | First length over the old limit |
| title (2000) | `QA-AP2434-003-2000-<HHMMSS>` | |
| file_content (2000) | 2,000-character body (1,984 × `a`) | Realistic long note |
| description, is_public | `Length test`, `true` | Same for all three |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the shared admin account and open the warranty `<W>` page at the route recorded in AP2434_001 | Warranty `<W>` page is shown |
| 2 | Load the key ("Loading the key"), generate the 255-character body, and send the POST request as in the Execution Context ("API request format") with that body and its title. Save to `AP2434_003_step2_response.txt` | The Request check passes (otherwise BLOCKED — environment). The response is not an HTTP 5xx. Record the status code and body |
| 3 | Send the POST request with the 256-character body and its title, then with the 2,000-character body and its title (each body generated as in Test Data). Save to `AP2434_003_step3a_response.txt` and `AP2434_003_step3b_response.txt` | The Request check passes for both calls (otherwise BLOCKED — environment). Neither response is an HTTP 5xx. The 256-character call is not refused — the ticket requires "more than 255 characters" to be allowed. For the 2,000-character call, record whether it is accepted or refused and the message, for Q-009 (the ticket states no upper limit, so a clear refusal is not a failure) |
| 4 | [Verification] Reload the warranty `<W>` page and open each note that was created. Count the characters of the shown body (for raw text) or the number of `a` letters (for formatted HTML) | The 255 and 256-character notes are shown with their whole body: 239 and 240 letters `a` respectively, ending with the closing of the paragraph — nothing is cut at 255 characters. If the 2,000-character call was accepted, its note shows all 1,984 letters `a`: a note stored but cut short without the call being refused is a lost value. Record whether the HTML is shown formatted ("QA" in bold) or as raw tags, for Q-008 |

---

### AP2434_004 — A call with no API key — the response and whether any note appears are recorded

| Field | Value |
|---|---|
| **TC ID** | AP2434_004 |
| **Title** | A call with no API key — the response and whether any note appears are recorded |
| **Requirement** | AP2434 — REQ-001 (the call is made "with the api key in the Authorization Bearer header"); expected rejection not stated — Q-005 |
| **Route** | `POST /api/admin/warranty/-notes`, then the admin warranty page recorded in AP2434_001 |
| **Type** | Negative |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-002 — no staging admin API key available to QA (needed to confirm the endpoint works at all, through AP2434_001, before this negative case means anything) |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** If the endpoint accepts calls without a key, anyone on the internet could write notes onto customer warranties. The ticket does not say what the rejection should look like (Q-005), so this case records the response and whether a note was created; it fails only on an objective fault. One such fault is named in test plan §3.2: a note stored even though the API refused the call (a 4xx answer followed by the note on `<W>`) — the caller is told "no" while the data is written anyway. A note created after a 2xx answer without a key is reported as a security observation under Q-005 for the author to judge.

**Revisions:**

| Date | Change | Reason |
|---|---|---|
| 2026-11-01 | Step 1 records the listed note titles that step 3 checks | R2 independent F-5 |
| 2026-11-01 | Step 2: fields sent with `--form-string` and `-sS`; the Request check applies | R2 independent F-1 — with `-F` nothing is sent and an empty response would look like a refusal |
| 2026-11-01 | Step 3: a note stored after a 4xx refusal fails the step | R2 independent F-2 — test plan §3.2 |

**Test Data:**

| Variable | Value |
|---|---|
| warranty_id | `<W>` from AP2434_001 |
| title | `QA-AP2434-004-<HHMMSS>` |
| description | `Sent with no API key` |
| is_public | `true` |
| file_content | `<p>No key</p>` |
| Authorization header | none — the `-H "Authorization: …"` option is left out |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the shared admin account and open the warranty `<W>` page at the route recorded in AP2434_001; note the titles currently listed | Warranty `<W>` page is shown; the current note titles (or "no notes") are written in the log |
| 2 | Send the POST request as in the Execution Context ("API request format", `--form-string` for every field) with the Test Data above but **no** `-H "Authorization: …"` option. Save to `AP2434_004_step2_response.txt` | The Request check passes (otherwise BLOCKED — environment: an empty response is not a refusal). The response is not an HTTP 5xx. Record the status code and body for Q-005 |
| 3 | [Verification] Reload the warranty `<W>` page and look for a note titled `QA-AP2434-004-<HHMMSS>` | The page loads without an error page and every note title recorded in step 1 is still there. If the step 2 response was a refusal (HTTP 4xx), no note with this title appears — a note stored despite the refusal **fails** the step (test plan §3.2). If the response was 2xx, record whether the note appears, for Q-005 (an observation, not a failure) |

---

### AP2434_005 — A call with a wrong API key — the response and whether any note appears are recorded

| Field | Value |
|---|---|
| **TC ID** | AP2434_005 |
| **Title** | A call with a wrong API key — the response and whether any note appears are recorded |
| **Requirement** | AP2434 — REQ-001; expected rejection not stated — Q-005 |
| **Route** | `POST /api/admin/warranty/-notes`, then the admin warranty page recorded in AP2434_001 |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Q-002 — no staging admin API key available to QA (the wrong key is the real key with its last character changed) |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** A key that is almost right must not be treated as right. As in AP2434_004, the expected rejection is not stated (Q-005), so the response is recorded and a note created after a 2xx answer with a wrong key is reported as a security observation. A note stored after the API refused the wrong key (4xx) is an objective fault under test plan §3.2 and fails the case.

**Revisions:**

| Date | Change | Reason |
|---|---|---|
| 2026-11-01 | Step 1 records the listed note titles that step 3 checks | R2 independent F-5 |
| 2026-11-01 | Step 2: fields sent with `--form-string` and `-sS`; the Request check applies | R2 independent F-1 |
| 2026-11-01 | Step 3: a note stored after a 4xx refusal fails the step | R2 independent F-2 — test plan §3.2 |

**Test Data:**

| Variable | Value |
|---|---|
| warranty_id | `<W>` from AP2434_001 |
| title | `QA-AP2434-005-<HHMMSS>` |
| description | `Sent with a wrong API key` |
| is_public | `true` |
| file_content | `<p>Wrong key</p>` |
| Authorization header | `Bearer <AVP_ADMIN_API_KEY with its last character replaced by a different character>` — build it in the shell; never write the real or altered key into the log |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the shared admin account and open the warranty `<W>` page at the route recorded in AP2434_001; note the titles currently listed | Warranty `<W>` page is shown; the current note titles (or "no notes") are written in the log |
| 2 | Load the key ("Loading the key"), build the altered key in a shell variable (for example `BAD_KEY="${AVP_ADMIN_API_KEY%?}X"`, or `…Y` if the key already ends in `X`) without printing it, and send the POST request as in the Execution Context ("API request format", `--form-string` for every field) with `-H "Authorization: Bearer $BAD_KEY"`. Save to `AP2434_005_step2_response.txt` (`-i` saves only the response, not the request header; if a key ever appears in the file, remove it before saving) | The Request check passes (otherwise BLOCKED — environment: an empty response is not a refusal). The response is not an HTTP 5xx. Record the status code and body for Q-005 |
| 3 | [Verification] Reload the warranty `<W>` page and look for a note titled `QA-AP2434-005-<HHMMSS>` | The page loads without an error page and every note title recorded in step 1 is still there. If the step 2 response was a refusal (HTTP 4xx), no note with this title appears — a note stored despite the refusal **fails** the step (test plan §3.2). If the response was 2xx, record whether the note appears, for Q-005 (an observation, not a failure) |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — call with the API key in the Bearer header | AP2434_001 | AP2434_004, AP2434_005 | — | — |
| REQ-002 — "The note is created" (multipart, five fields, is_public true/false) | AP2434_001, AP2434_002 | AP2434_006, AP2434_007 | — | — |
| REQ-003 — HTML over 255 characters in `file_content` | — | — | AP2434_003 | — |
| REQ-004 — "displayed in the admin area" | AP2434_001, AP2434_002 | — | — | AP2434_001 (earlier notes still listed) |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2434_001 | _(pending)_ | — |
| AP2434_002 | _(pending)_ | — |
| AP2434_003 | _(pending)_ | — |
| AP2434_004 | _(pending)_ | — |
| AP2434_005 | _(pending)_ | — |
