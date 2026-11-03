# Test Cases — AP2435 (File 1 of 3)

**Project:** Avantage Plus v2
**Requirement:** AP2435 — Admin API: warranty search
**Source:** requirements/AP-2435-admin-api-warranty-search.md · qa-artifacts/1-requirements-analysis/AP-2435_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2435_test-plan.md
**Date:** 2026-11-01 (Execution Context and send/verification steps reworked 2026-11-01 after review R2 independent, findings F-1 to F-8; reworked again 2026-11-01 after R2 round 2, findings F-1 to F-4)
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2435_001 to AP2435_005 (5 test cases)
**Coverage:** Functional · Edge-case · API

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer portal (to find the reference warranty contract and read its VIN, client postal code and telephone) + the admin API (for every search). The dealer `/warranty` page is used, not the Admin Portal, because it is the only warranty contract list in the `navigation` source; the Admin Portal's warranty contract screens are not mapped. Any contract the shared dealer can see works as the reference contract, because the admin API searches all contracts | `navigation` |
| **Entry route** | Dealer login `/login` → sidebar **Contracts → Warranty** (`/warranty`). The warranty contract list and contract page are listed in `navigation` §4 "Not yet mapped", so the executor records the contract page route and where the VIN, postal code and telephone are shown, then writes them back to the `domain` source | `navigation` |
| **API endpoint** | `GET https://v2staging.garantieavantageplus.ca/api/admin/search-warranty?query=<value>` — host and path exactly as in the ticket's example call | capture |
| **Request recipe (R)** | One Bash (Git Bash) command per request — the shell keeps **no** variables between commands, so the key is loaded inside every command. Replace `<TC>`, `<n>`, `<value>` and `<KEY_HEADER>`; change nothing else. See the block below this table | test plan §3.3 |
| **`<KEY_HEADER>`** | `XK` = `-H "X-API-KEY: $AVP_ADMIN_API_KEY"` (the ticket's example call) · `BR` = `-H "Authorization: Bearer $AVP_ADMIN_API_KEY"` (the ticket's text). The ticket contradicts itself (Q-001), so AP2435_001 step 2 sends both and records which is accepted. Every later case uses **the accepted form** — `XK` when both are accepted. If AP2435_001 has not run, perform its step 2 first | capture · Q-001 |
| **Valid send** | A request counts as sent only when the command prints `send=OK`: curl exit code 0 **and** the saved file starts with an HTTP status line (`HTTP/1.1 NNN` or `HTTP/2 NNN`). Anything else (non-zero exit, empty file, no status line) is retried once; if it still fails, the step is **BLOCKED (environment)** — never PASS, never FAIL. `STOP: AVP_ADMIN_API_KEY is empty` → the case is **BLOCKED by Q-012**, no retry. `send=INVALID key echoed` (the response still held part of the key after redaction, so the file was replaced by a notice) → **BLOCKED (environment)**, no retry | review F-1 · R2 round 2 F-3, F-4 |
| **Status** | The `http_code=` value on the `--- curl` trailer line at the end of the saved file. The body is the text between the blank line after the headers and that trailer line | — |
| **Result rules** | (1) Status 5xx → FAIL. (2) Status 401 or 403 on a request sent with the accepted key form → **BLOCKED** (key refused; confirm the key is still active on `/admin/api-keys` and record it with Q-012), never PASS or FAIL. The one exception is AP2435_001 step 2, the probe, which runs before any form is known to be accepted: a 401/403 on one form is recorded, not judged, when the other form returns 2xx; when **both** forms return 401 or 403, the key is checked read-only on `/admin/api-keys` — listed as active → FAIL, otherwise → BLOCKED by Q-012 (see the step). (3) "Valid JSON" and "lists `<C>`" are asserted only when the status is 2xx. (4) Before a FAIL for "`<C>` is not listed", record the number of entries and any paging fields (`total`, `page`, `next`, `limit` or similar — Q-008); if a cap or paging is visible, follow the next page or use a longer query (a longer VIN fragment or the whole VIN) and record that, and only then record the FAIL | review F-3, F-4, F-8 · R2 round 2 F-1 |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging (`https://v2staging.garantieavantageplus.ca`) | `env` |
| **Login** | Dealer portal: shared account from `env` (`vinhle870@gmail.com`). Admin API key: read by the recipe from the gitignored `/.env` variable **`AVP_ADMIN_API_KEY`**, by name only — never `echo` it, never use `curl -v`, never write it into an artifact. **Not known** today: `/.env` has no such variable (Q-012) | `env` |
| **Test data** | One reference warranty contract, chosen in AP2435_001 step 1. Its contract number `<C>`, vehicle VIN `<VIN>`, client postal code `<PC>` (written without a space, for example `H3K7B1`) and client telephone `<TEL>` (10 digits, for example `5149779047`) are recorded in the execution log and reused by every later case | test plan §8.1 |
| **Language** | Dealer portal as found; the API returns JSON | `navigation` |
| **Leaves behind** | Nothing — searches change no data. Only if no existing contract has a VIN, postal code and telephone does AP2435_001 create one, and that quote and contract are then listed in the execution log | `cleanup` (missing) |

**Request recipe (R)** — run from the repository root; it prints `send=OK` or `send=INVALID`:

```bash
cd "$(git rev-parse --show-toplevel)" || exit 1
AVP_ADMIN_API_KEY="$(grep -E '^AVP_ADMIN_API_KEY=' .env | tail -n 1 | cut -d= -f2- | tr -d '\r' | sed -e 's/^["'\'']//' -e 's/["'\'']$//')"
[ -n "$AVP_ADMIN_API_KEY" ] || { echo "STOP: AVP_ADMIN_API_KEY is empty or missing in /.env - case stays BLOCKED by Q-012"; exit 1; }
OUT="qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/<TC>_step<n>_response.txt"
mkdir -p "$(dirname "$OUT")"
curl -sS -i --max-time 30 -G "https://v2staging.garantieavantageplus.ca/api/admin/search-warranty" \
  --data-urlencode "query=<value>" -H "accept: application/json" <KEY_HEADER> \
  -w '\n--- curl url_effective=%{url_effective} http_code=%{http_code}\n' > "$OUT"
RC=$?; echo "curl_exit=$RC" >> "$OUT"
K="$AVP_ADMIN_API_KEY"; N=8; [ "${#K}" -lt "$N" ] && N=${#K}; B="$(cat "$OUT")"; H=0
for ((i=0; i+N<=${#K}; i++)); do S="${K:i:N}"; case "$B" in *"$S"*) B="${B//"$S"/<redacted>}"; H=1;; esac; done
[ "$H" -eq 0 ] || { printf '%s\n' "$B" > "$OUT"; echo "redacted=YES"; }
L=0; B="$(cat "$OUT")"; for ((i=0; i+N<=${#K}; i++)); do case "$B" in *"${K:i:N}"*) L=1;; esac; done
[ "$L" -eq 0 ] || { printf 'response withheld: it echoed the API key\n' > "$OUT"; echo "send=INVALID key echoed - BLOCKED (environment), no retry"; exit 1; }
if [ "$RC" -eq 0 ] && head -n 1 "$OUT" | grep -Eq '^HTTP/[0-9.]+ [0-9]{3}'; then echo "send=OK $(tail -n 2 "$OUT" | head -n 1)"; else echo "send=INVALID curl_exit=$RC - retry once, then BLOCKED (environment)"; fi
```

`--data-urlencode` encodes a space as `+` and `(` `)` as `%28` `%29`; the exact URL sent is in the trailer line (`url_effective=`). The saved file holds response headers and body only — the request headers are never written. A server may still echo the key it received, so before anything reads the file the recipe replaces every 8-character run of the key found in it with `<redacted>` and prints `redacted=YES` (note that in the execution log); if any 8-character run is still present afterwards, the whole file is replaced by a one-line notice and the command prints `send=INVALID key echoed`. These checks never print the key.

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | A staging admin API key for QA | AP2435_001 – AP2435_012 | Open — Q-012 (Info in the analysis, but it stops execution of every case). Raised 2026-11-01 |

> Every case below ships with **Status: BLOCKED** and **Blocked by: Q-012**.
>
> **How the block is lifted:** the QA decides to create a staging admin API key (for
> example on the Admin Portal page **Manage API keys**, `/admin/api-keys`) or obtains one
> from the ticket's author, and stores it in the gitignored `/.env` as
> `AVP_ADMIN_API_KEY=<value>`. Then every case in this file goes back to **Not Run** and
> the run resumes with `AP-2435 --from s4`. The test cases never create a key and never
> write `/.env` — creating a real credential is the QA's decision.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2435_001 | Searching part of a contract vehicle's VIN returns that contract's number in the results | Functional | High | BLOCKED |
| AP2435_002 | Searching a contract vehicle's whole VIN returns that contract; a lower-case fragment's result is recorded | Functional | Medium | BLOCKED |
| AP2435_003 | Searching a client's postal code with and without its space returns the same contract both times | Functional | High | BLOCKED |
| AP2435_004 | Searching a client's telephone with hyphens or as plain digits returns that contract | Functional | High | BLOCKED |
| AP2435_005 | Searching a client's telephone with dots or with parentheses returns that contract | Functional | High | BLOCKED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2435_001 — Searching part of a contract vehicle's VIN returns that contract's number in the results

| Field | Value |
|---|---|
| **TC ID** | AP2435_001 |
| **Title** | Searching part of a contract vehicle's VIN returns that contract's number in the results |
| **Requirement** | AP2435 — REQ-001 (call "with the api key"), REQ-002 ("query partially matches a warranty contract vehicle VIN"), REQ-005 ("The list of contracts found is returned") |
| **Route** | Dealer `/warranty` (reference data), then `GET /api/admin/search-warranty` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-012 — no staging admin API key available to QA |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** This is the first match rule in the ticket and the case that also proves the key is accepted and the response has the example's shape. The ticket's text puts the key in the Authorization Bearer header while its example call sends `X-API-KEY` (Q-001), so both are tried. The case fails only if neither is accepted while the key is confirmed active on `/admin/api-keys`; a key that cannot be confirmed active blocks the case (Q-012) instead, because a mistyped or revoked key proves nothing about the build. The top-level shape (`{"items": [...]}` or a bare array) and the status code are recorded, because the ticket contradicts itself on the first (Q-009) and is silent on the second (Q-010).

**Test Data:**

| Variable | Value |
|---|---|
| query | Characters 7 to 12 of `<VIN>` (a 6-character middle fragment — for VIN `1FAHP35NX8W239204` this is `5NX8W2`) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/login` with the shared dealer account. Open **Contracts → Warranty** (`/warranty`), open a warranty contract whose client has a postal code and a telephone, and record its contract number `<C>`, vehicle VIN `<VIN>`, client postal code `<PC>` (without space) and client telephone `<TEL>` (digits only), plus the page route. If no contract shows all three values, create one through the dealer quote flow (**Create quote** on vehicle `915`, VIN `1FAHP35NX8W239204`) with a new client named `QA AP2435`, postal code `H3K 7B1` and telephone `514-555-2435`, complete the warranty to a contract, and record it as left behind | A warranty contract page is shown with a contract number, a 17-character VIN, a postal code and a telephone; all four values and the route are written in the execution log |
| 2 | Header probe (Q-001). Run recipe R with `<TC>`=`AP2435_001`, `<value>` = the Test Data fragment, `<KEY_HEADER>` = `XK`, `<n>` = `2xk`. Then run it again with `<KEY_HEADER>` = `BR`, `<n>` = `2br` | Both commands print `send=OK` and neither status is 5xx. Record each status. The **accepted form** is every form whose status is 2xx; write it in the execution log as `XK`, `BR` or `XK+BR` (Q-001). If neither status is 2xx, record both statuses and bodies, then: **(a)** if both are 401 or 403, log in to the Admin Portal and open **Manage API keys** (`/admin/api-keys`) **read-only** — do not create, edit, regenerate, reveal or copy any key — and check that the key in use is listed as active, matching it by the name or masked characters the page shows (never print or write the key). Listed and active → mark the case FAIL (no documented header form accepts a valid key). Not listed, inactive, revoked, or not confirmable → mark AP2435_001 and every case that needs the accepted form (AP2435_002–007 and 010–012) **BLOCKED by Q-012**. **(b)** Any other pair without a 2xx (for example 400 and 404, or 401 and 404) → FAIL |
| 3 | [Verification] Read the body of the accepted response (`AP2435_001_step2xk_response.txt` when `XK` was accepted, otherwise `_step2br_`) | Record first: the number of entries and any paging fields (Q-008), the top-level shape — object with `items` or bare array (Q-009) — and any fields besides `contractNumber`. Then: the body is valid JSON, every entry carries a `contractNumber`, and an entry's `contractNumber` equals `<C>` (if `<C>` is absent, apply result rule 4 before recording a FAIL) |

---

### AP2435_002 — Searching a contract vehicle's whole VIN returns that contract; a lower-case fragment's result is recorded

| Field | Value |
|---|---|
| **TC ID** | AP2435_002 |
| **Title** | Searching a contract vehicle's whole VIN returns that contract; a lower-case fragment's result is recorded |
| **Requirement** | AP2435 — REQ-002 AC 1–2 ("partially matches a warranty contract vehicle VIN" — the whole VIN contains itself) |
| **Route** | `GET /api/admin/search-warranty` |
| **Type** | Functional · Edge-case |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Q-012 — no staging admin API key available to QA |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** A caller who has the full VIN must still find the contract. Whether a lower-case fragment matches is not stated (Q-004), so that part is recorded only.

**Test Data:**

| Variable | Value |
|---|---|
| query (step 2) | `<VIN>` — all 17 characters, as recorded in AP2435_001 |
| query (step 3) | The AP2435_001 fragment in lower case (for `5NX8W2`: `5nx8w2`) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Read `<C>`, `<VIN>` and the accepted key form from the AP2435_001 entry of the execution log. If AP2435_001 has not run, perform its steps 1 and 2 first | `<C>`, `<VIN>` and the accepted form are known |
| 2 | Run recipe R with `<TC>`=`AP2435_002`, `<n>`=`2`, `<value>` = `<VIN>`, `<KEY_HEADER>` = the accepted form | `send=OK`; the status is not 5xx (401/403 → BLOCKED, result rule 2) |
| 3 | Run recipe R with `<n>`=`3`, `<value>` = the lower-case fragment, same key form | `send=OK`; the status is not 5xx (401/403 → BLOCKED) |
| 4 | [Verification] Read both saved responses | Step 2: status 2xx, the body is valid JSON and lists an entry with `contractNumber` = `<C>` (record the entry count and paging fields first; if `<C>` is absent, apply result rule 4). Step 3: record the status, and if it is 2xx, whether the body is valid JSON and lists `<C>` (Q-004) |

---

### AP2435_003 — Searching a client's postal code with and without its space returns the same contract both times

| Field | Value |
|---|---|
| **TC ID** | AP2435_003 |
| **Title** | Searching a client's postal code with and without its space returns the same contract both times |
| **Requirement** | AP2435 — REQ-003 AC 1–2 ("fully matches a warranty client postal code"; "“H3K7B1”, “H3K 7B1” should all match") |
| **Route** | `GET /api/admin/search-warranty` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-012 — no staging admin API key available to QA |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** The ticket's own example says both spellings of a postal code must match. A caller copying a postal code from a letter (with the space) or from a database (without it) must get the same answer.

**Test Data:**

| Variable | Value |
|---|---|
| query (step 2) | `<PC>` without a space (for example `H3K7B1`) |
| query (step 3) | `<PC>` with a space after the third character (for example `H3K 7B1`); `--data-urlencode` sends it as `query=H3K+7B1`, which a server decodes as a space — confirm it in the trailer's `url_effective=` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Read `<C>`, `<PC>` and the accepted key form from the AP2435_001 entry of the execution log, and note whether the contract page showed the postal code with or without a space. If AP2435_001 has not run, perform its steps 1 and 2 first | `<C>`, `<PC>` and the accepted form are known, and the stored spelling is recorded |
| 2 | Run recipe R with `<TC>`=`AP2435_003`, `<n>`=`2`, `<value>` = `<PC>` without a space, `<KEY_HEADER>` = the accepted form | `send=OK`; the status is not 5xx (401/403 → BLOCKED) |
| 3 | Run recipe R with `<n>`=`3`, `<value>` = `<PC>` with a space, same key form | `send=OK`; the status is not 5xx (401/403 → BLOCKED) |
| 4 | [Verification] Read both saved responses | Record each entry count and any paging fields first. Both statuses are 2xx, both bodies are valid JSON and both list an entry with `contractNumber` = `<C>` (if `<C>` is absent from either, apply result rule 4 before recording a FAIL) |

---

### AP2435_004 — Searching a client's telephone with hyphens or as plain digits returns that contract

| Field | Value |
|---|---|
| **TC ID** | AP2435_004 |
| **Title** | Searching a client's telephone with hyphens or as plain digits returns that contract |
| **Requirement** | AP2435 — REQ-004 AC 1–2 ("fully matches a warranty client telephone"; "“123-123-1234”, “1231231234” … should all match") |
| **Route** | `GET /api/admin/search-warranty` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-012 — no staging admin API key available to QA |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** The ticket's example call searches a plain 10-digit telephone, and the hyphenated form is the most common way a phone is written. Which of the client's phone fields are searched is not stated (Q-006); this case uses the telephone shown on the contract page.

**Test Data:**

| Variable | Value |
|---|---|
| query (step 2) | `<TEL>` as `NNN-NNN-NNNN` (for `5149779047`: `514-977-9047`) |
| query (step 3) | `<TEL>` as 10 plain digits (for example `5149779047`) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Read `<C>`, `<TEL>` and the accepted key form from the AP2435_001 entry of the execution log, and note how the contract page wrote the telephone. If AP2435_001 has not run, perform its steps 1 and 2 first | `<C>`, `<TEL>` and the accepted form are known, and the stored spelling is recorded |
| 2 | Run recipe R with `<TC>`=`AP2435_004`, `<n>`=`2`, `<value>` = the hyphenated telephone, `<KEY_HEADER>` = the accepted form | `send=OK`; the status is not 5xx (401/403 → BLOCKED) |
| 3 | Run recipe R with `<n>`=`3`, `<value>` = the 10 plain digits, same key form | `send=OK`; the status is not 5xx (401/403 → BLOCKED) |
| 4 | [Verification] Read both saved responses | Record each entry count and any paging fields first. Both statuses are 2xx, both bodies are valid JSON and both list an entry with `contractNumber` = `<C>` (if `<C>` is absent from either, apply result rule 4 before recording a FAIL) |

---

### AP2435_005 — Searching a client's telephone with dots or with parentheses returns that contract

| Field | Value |
|---|---|
| **TC ID** | AP2435_005 |
| **Title** | Searching a client's telephone with dots or with parentheses returns that contract |
| **Requirement** | AP2435 — REQ-004 AC 2 ("“123.123.1234”, “(123) 123-1234“ should all match") |
| **Route** | `GET /api/admin/search-warranty` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-012 — no staging admin API key available to QA |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** Dots, parentheses and the space after the area code are the formats most likely to break a search that only strips hyphens. The parentheses and space must be URL-encoded, which `--data-urlencode` does, so an error here is the product's, not the client's.

**Test Data:**

| Variable | Value |
|---|---|
| query (step 2) | `<TEL>` as `NNN.NNN.NNNN` (for `5149779047`: `514.977.9047`) |
| query (step 3) | `<TEL>` as `(NNN) NNN-NNNN` (for `5149779047`: `(514) 977-9047`, sent by `--data-urlencode` as `query=%28514%29+977-9047` — confirm it in the trailer's `url_effective=`) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Read `<C>`, `<TEL>` and the accepted key form from the AP2435_001 entry of the execution log. If AP2435_001 has not run, perform its steps 1 and 2 first | `<C>`, `<TEL>` and the accepted form are known |
| 2 | Run recipe R with `<TC>`=`AP2435_005`, `<n>`=`2`, `<value>` = the dotted telephone, `<KEY_HEADER>` = the accepted form | `send=OK`; the status is not 5xx (401/403 → BLOCKED) |
| 3 | Run recipe R with `<n>`=`3`, `<value>` = the parenthesised telephone, same key form | `send=OK`; the status is not 5xx (401/403 → BLOCKED) |
| 4 | [Verification] Read both saved responses | Record each entry count and any paging fields first. Both statuses are 2xx, both bodies are valid JSON and both list an entry with `contractNumber` = `<C>` (if `<C>` is absent from either, apply result rule 4 before recording a FAIL) |
