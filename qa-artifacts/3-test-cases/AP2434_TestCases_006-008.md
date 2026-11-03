# Test Cases — AP2434 (File 2 of 2)

**Project:** Avantage Plus v2
**Requirement:** AP2434 — Admin API: create warranty notes
**Source:** requirements/AP-2434-admin-api-create-warranty-notes.md · qa-artifacts/1-requirements-analysis/AP-2434_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2434_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2434_006 to AP2434_008 (3 test cases)
**Coverage:** Negative · Edge-case · API · UI

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin portal (for checking notes) + the admin API (for sending requests) | `navigation` |
| **Entry route** | Admin login `/admin/login` → `/admin`. The admin warranty page that shows notes is **Not known** at design time — it is recorded by AP2434_001 step 1 and reused here (`navigation` §4: admin warranty pages not mapped) | `navigation` |
| **API endpoint** | `POST https://v2staging.garantieavantageplus.ca/api/admin/warranty/-notes` — host from `env`, path exactly as written in the ticket (Q-001) | `env`, capture |
| **API request format** | `multipart/form-data`, header `Authorization: Bearer $AVP_ADMIN_API_KEY`. Sent with curl from Git Bash, every text field with `--form-string` (never `-F`: curl reads a `-F` value that starts with `<` from a local file and sends nothing — every `file_content` here starts with `<`): `curl -sS -i -X POST "<endpoint>" -H "Authorization: Bearer $AVP_ADMIN_API_KEY" --form-string "<field>=<value>" … -o "<response file>"; echo "curl exit $?"`. A field the case leaves out is simply not given. The response file is `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2434/<TC>_step<n>_response.txt` (status line, headers, body) | test plan §3.3 |
| **Request check** | Applies to every POST step below. The request counts as sent only when curl prints `curl exit 0` and the first line of the response file starts with `HTTP/` (check with `head -1 "<response file>"`). If curl exits non-zero or the file has no HTTP status line, nothing reached the server: the step and the case are **BLOCKED (environment)** with the curl error message recorded — never PASS, never FAIL (an empty response is not a refusal) | F-1 of review R2 (independent) |
| **Loading the key** | Before the first request, from the repository root in Git Bash, load only the key variable by name: `export AVP_ADMIN_API_KEY="$(sed -n 's/^AVP_ADMIN_API_KEY=//p' ./.env)"; AVP_ADMIN_API_KEY="${AVP_ADMIN_API_KEY%$'\r'}"` (values in /.env are unquoted; the second command drops a Windows line ending). Never echo, print or log its value; check only that it is set with `[ -n "$AVP_ADMIN_API_KEY" ] && echo key loaded` | `env` |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging (`https://v2staging.garantieavantageplus.ca`) | `env` |
| **Login** | Admin portal: shared admin account from `env` (`vinhle870@gmail.com`). Admin API key: **[SET IN .env: AVP_ADMIN_API_KEY]** — **Not known**: no key exists in `/.env` or any knowledge file | `env` |
| **Test data** | Warranty `<W>` — the identifier the API accepted in AP2434_001 step 2, recorded in the log; a second warranty `<W2>` chosen in AP2434_007 step 1; an unknown warranty value `<WX>` built in AP2434_007 step 1 in the same format as `<W>` | test plan §8.1 |
| **Language** | Admin login page is French ("Connexion", "Courriel", "Mot de passe", "Se connecter") | `navigation` |
| **Leaves behind** | Any note the API accepts despite missing or invalid input, titled `QA-AP2434-<TC>-…`, on warranty `<W>` | `cleanup` (missing) |

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | A staging admin API key for QA (and confirmation of the API host) | AP2434_006 – AP2434_008 | Open — Q-002 (Info in the analysis, but it stops execution of every case). Raised 2026-11-01 |
| 2 | The admin page that shows a warranty's notes | AP2434_006 – AP2434_008 | Open — Q-006 (Judgement). Recorded by AP2434_001 step 1 during s4 |

> Every case below ships with **Status: BLOCKED** and **Blocked by: Q-002** until the key
> is stored in `/.env` as `AVP_ADMIN_API_KEY`. Once it is, set them back to `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2434_006 | Calls missing the warranty ID or the title — each response is recorded and no note lands with invented values | Negative | Medium | BLOCKED |
| AP2434_007 | Calls with an unknown warranty ID or an is_public value other than true/false are recorded; no other warranty gets a note | Negative | Medium | BLOCKED |
| AP2434_008 | A script tag in the HTML note text — how the admin area shows it is recorded without a server error | Edge-case | Medium | BLOCKED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2434_006 — Calls missing the warranty ID or the title — each response is recorded and no note lands with invented values

| Field | Value |
|---|---|
| **TC ID** | AP2434_006 |
| **Title** | Calls missing the warranty ID or the title — each response is recorded and no note lands with invented values |
| **Requirement** | AP2434 — REQ-002 (the five payload fields); required fields and validation not stated — Q-004 |
| **Route** | `POST /api/admin/warranty/-notes`, then the admin warranty page recorded in AP2434_001 |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Q-002 — no staging admin API key available to QA |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** The ticket lists five fields but does not say which are required or how a bad request is refused (Q-004). This case records what the build does. It fails only on an objective fault: a server error, or a note that appears with a value nobody sent.

**Revisions:**

| Date | Change | Reason |
|---|---|---|
| 2026-11-01 | Steps 2–3: fields sent with `--form-string` and `-sS`; the Request check applies | R2 independent F-1 — with `-F` nothing is sent and an empty response would look like a refusal |

**Test Data:**

| Variable | Call A — no warranty_id | Call B — no title |
|---|---|---|
| warranty_id | *(field left out)* | `<W>` from AP2434_001 |
| title | `QA-AP2434-006A-<HHMMSS>` | *(field left out)* |
| description | `AP2434_006 call A — no warranty_id` | `AP2434_006 call B — no title` |
| is_public | `true` | `true` |
| file_content | `<p>Missing warranty_id</p>` | `<p>Missing title</p>` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the shared admin account and open the warranty `<W>` page at the route recorded in AP2434_001; note the titles currently listed | Warranty `<W>` page is shown; current note titles are written in the log |
| 2 | Load the key ("Loading the key") and send call A as in the Execution Context ("API request format", `--form-string` for every field given; no `warranty_id` field) with the Bearer key. Save to `AP2434_006_step2_response.txt` | The Request check passes (otherwise BLOCKED — environment). The response is not an HTTP 5xx. Record the status code and body for Q-004 |
| 3 | Send call B the same way (no `title` field) with the Bearer key. Save to `AP2434_006_step3_response.txt` | The Request check passes (otherwise BLOCKED — environment). The response is not an HTTP 5xx. Record the status code and body for Q-004 |
| 4 | [Verification] Reload the warranty `<W>` page and look for a note with description "AP2434_006 call B — no title" | The page loads without an error page, and every note listed in step 1 is still there. If a call-B note appears, its shown title is not text taken from another note or record (an empty title or a generic placeholder is recorded, not failed). Record whether it was created and what title it shows, for Q-004 |

---

### AP2434_007 — Calls with an unknown warranty ID or an is_public value other than true/false are recorded; no other warranty gets a note

| Field | Value |
|---|---|
| **TC ID** | AP2434_007 |
| **Title** | Calls with an unknown warranty ID or an is_public value other than true/false are recorded; no other warranty gets a note |
| **Requirement** | AP2434 — REQ-002 (`warranty_id` is "the ID of the warranty"; `is_public` is "true or false"); validation not stated — Q-004 |
| **Route** | `POST /api/admin/warranty/-notes`, then the admin warranty pages of `<W>` and `<W2>` |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Q-002 — no staging admin API key available to QA |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** A note sent for a warranty that does not exist must not end up on somebody else's warranty — that would be a value nobody entered, and a privacy problem. The exact error is not stated (Q-004), so it is recorded only. `warranty_id` is a string and its real format is only known once AP2434_001 has run, so the unknown value is built in the same format as `<W>` rather than assumed numeric.

**Revisions:**

| Date | Change | Reason |
|---|---|---|
| 2026-11-01 | Steps 2–3: fields sent with `--form-string` and `-sS`; the Request check applies | R2 independent F-1 |
| 2026-11-01 | Call A: the fixed `999999999` replaced by `<WX>`, built in the same format as `<W>` and confirmed to open no warranty | R2 independent F-7 — warranty IDs are not known to be numeric |

**Test Data:**

| Variable | Call A — unknown warranty | Call B — invalid is_public |
|---|---|---|
| warranty_id | `<WX>` — `<W>` with its characters changed, same length and format (for example, digits changed to `9`s, or the last letters changed), confirmed in step 1 to open no warranty | `<W>` from AP2434_001 |
| title | `QA-AP2434-007A-<HHMMSS>` | `QA-AP2434-007B-<HHMMSS>` |
| description | `AP2434_007 call A — unknown warranty` | `AP2434_007 call B — is_public maybe` |
| is_public | `true` | `maybe` |
| file_content | `<p>Unknown warranty</p>` | `<p>Invalid is_public</p>` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the shared admin account. Open warranty `<W>` at the route recorded in AP2434_001, then open one other warranty from the admin warranty list and record its identifier (same kind as `<W>`) as `<W2>`. Build `<WX>` from `<W>` as in Test Data and open the warranty route recorded in AP2434_001 with `<WX>` in place of `<W>` (or search for it in the warranty list) | Both warranty pages load; `<W2>` is written in the log. `<WX>` opens no warranty (a not-found page or no search result) and is written in the log — if it opens a warranty, change it again before going on |
| 2 | Load the key ("Loading the key") and send call A (`warranty_id` = `<WX>`) as in the Execution Context ("API request format", `--form-string` for every field) with the Bearer key. Save to `AP2434_007_step2_response.txt` | The Request check passes (otherwise BLOCKED — environment). The response is not an HTTP 5xx. Record the status code and body for Q-004 |
| 3 | Send call B (`is_public` = `maybe`) the same way with the Bearer key. Save to `AP2434_007_step3_response.txt` | The Request check passes (otherwise BLOCKED — environment). The response is not an HTTP 5xx. Record the status code and body for Q-004 |
| 4 | [Verification] Reload warranties `<W>` and `<W2>` and look for notes titled `QA-AP2434-007A-…` and `QA-AP2434-007B-…` | No note titled `QA-AP2434-007A-…` appears on `<W>` or `<W2>`. If a `QA-AP2434-007B-…` note appears on `<W>`, record which public/private state it shows, for Q-004 |

---

### AP2434_008 — A script tag in the HTML note text — how the admin area shows it is recorded without a server error

| Field | Value |
|---|---|
| **TC ID** | AP2434_008 |
| **Title** | A script tag in the HTML note text — how the admin area shows it is recorded without a server error |
| **Requirement** | AP2434 — REQ-003 ("Need to allow HTML"); handling of unsafe HTML not stated — Q-008 |
| **Route** | `POST /api/admin/warranty/-notes`, then the admin warranty page recorded in AP2434_001 |
| **Type** | Edge-case · Security |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Q-002 — no staging admin API key available to QA |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** Allowing HTML means an API caller can put markup in front of admin users. If a `<script>` tag is stored and run, any system holding a key could run code in an admin's browser (stored cross-site scripting). The ticket does not say whether such tags are removed (Q-008), so this case records what happens; a script that runs is reported as a security observation under Q-008.

**Revisions:**

| Date | Change | Reason |
|---|---|---|
| 2026-11-01 | Step 2: fields sent with `--form-string` and `-sS`; the Request check applies | R2 independent F-1 — the `<p>…<script>` body would make `-F` read a local file |

**Test Data:**

| Variable | Value |
|---|---|
| warranty_id | `<W>` from AP2434_001 |
| title | `QA-AP2434-008-<HHMMSS>` |
| description | `AP2434_008 script tag test` |
| is_public | `false` |
| file_content | `<p>Before <b>bold</b></p><script>document.title='AP2434-XSS'</script><p>After</p>` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the shared admin account and open the warranty `<W>` page at the route recorded in AP2434_001 | Warranty `<W>` page is shown |
| 2 | Load the key ("Loading the key") and send the POST request as in the Execution Context ("API request format", `--form-string` for every field, the `file_content` value inside double quotes) with the Test Data above and the Bearer key. Save to `AP2434_008_step2_response.txt` | The Request check passes (otherwise BLOCKED — environment). The response is not an HTTP 5xx. Record the status code and body |
| 3 | [Verification] Reload the warranty `<W>` page, open the note titled `QA-AP2434-008-<HHMMSS>`, and read the browser tab title | The page loads without an error page. If the note is shown, the words "Before", "bold" and "After" are all present (no value lost). Record whether "bold" is formatted, whether the `<script>` text is shown, removed or run, and whether the tab title changed to "AP2434-XSS", for Q-008 |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — call with the API key in the Bearer header | AP2434_001 | AP2434_004, AP2434_005 | — | — |
| REQ-002 — "The note is created" (multipart, five fields, is_public true/false) | AP2434_001, AP2434_002 | AP2434_006, AP2434_007 | — | — |
| REQ-003 — HTML over 255 characters in `file_content` | — | — | AP2434_003, AP2434_008 | — |
| REQ-004 — "displayed in the admin area" | AP2434_001, AP2434_002 | — | — | AP2434_001 |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2434_006 | _(pending)_ | — |
| AP2434_007 | _(pending)_ | — |
| AP2434_008 | _(pending)_ | — |
