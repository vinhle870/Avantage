# Test Cases — AP2435 (File 2 of 3)

**Project:** Avantage Plus v2
**Requirement:** AP2435 — Admin API: warranty search
**Source:** requirements/AP-2435-admin-api-warranty-search.md · qa-artifacts/1-requirements-analysis/AP-2435_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2435_test-plan.md
**Date:** 2026-11-01 (Execution Context and send/verification steps reworked 2026-11-01 after review R2 independent, findings F-1 to F-8; reworked again 2026-11-01 after R2 round 2, findings F-1 to F-4)
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2435_006 to AP2435_010 (5 test cases)
**Coverage:** Edge-case · Negative · API

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | The admin API only. The reference contract values come from the AP2435_001 entry of the execution log (dealer portal `/warranty` — the only warranty contract list in the `navigation` source) | `navigation` |
| **Entry route** | Not applicable — no page is opened in this batch unless AP2435_001 has not run, in which case perform its steps 1 and 2 (dealer login `/login` → **Contracts → Warranty** `/warranty`, then the header probe) | `navigation` |
| **API endpoint** | `GET https://v2staging.garantieavantageplus.ca/api/admin/search-warranty?query=<value>` — host and path exactly as in the ticket's example call | capture |
| **Request recipe (R)** | One Bash (Git Bash) command per request — the shell keeps **no** variables between commands, so the key is loaded (and any wrong key is built) inside every command. Replace `<TC>`, `<n>`, `<value>` and `<KEY_HEADER>`; change nothing else. See the block below this table | test plan §3.3 |
| **`<KEY_HEADER>`** | `XK` = `-H "X-API-KEY: $AVP_ADMIN_API_KEY"` · `BR` = `-H "Authorization: Bearer $AVP_ADMIN_API_KEY"` · `NONE` = nothing (delete the placeholder) · `WXK` / `WBR` = `-H "X-API-KEY: $WRONG"` / `-H "Authorization: Bearer $WRONG"`. **The accepted form** is the one AP2435_001 step 2 recorded as accepted (Q-001) — `XK` when both were | capture · Q-001 |
| **Valid send** | A request counts as sent only when the command prints `send=OK`: curl exit code 0 **and** the saved file starts with an HTTP status line (`HTTP/1.1 NNN` or `HTTP/2 NNN`). Anything else (non-zero exit, empty file, no status line) is retried once; if it still fails, the step is **BLOCKED (environment)** — never PASS, never FAIL. `STOP: AVP_ADMIN_API_KEY is empty` → the case is **BLOCKED by Q-012**, no retry. `send=INVALID key echoed` (the response still held part of the key after redaction, so the file was replaced by a notice) → **BLOCKED (environment)**, no retry. This matters most for AP2435_008–010, whose expected result is an absence: an unanswered request must not pass them | review F-1 · R2 round 2 F-3, F-4 |
| **Status** | The `http_code=` value on the `--- curl` trailer line at the end of the saved file. The body is the text between the blank line after the headers and that trailer line | — |
| **Result rules** | (1) Status 5xx → FAIL. (2) Status 401 or 403 on a request sent with the accepted key form (AP2435_006 and 010) → **BLOCKED** (key refused; confirm the key is still active on `/admin/api-keys` and record it with Q-012), never PASS or FAIL. (3) "Valid JSON" is asserted only when the status is 2xx. (4) Record the number of entries and any paging fields (`total`, `page`, `next`, `limit` — Q-008) for every 2xx response | review F-3, F-4, F-8 |
| **Viewport** | 1280 × 800 (only if AP2435_001 step 1 must be performed) | `navigation` |
| **Environment** | v2staging (`https://v2staging.garantieavantageplus.ca`) | `env` |
| **Login** | Admin API key: read by the recipe from the gitignored `/.env` variable **`AVP_ADMIN_API_KEY`**, by name only — never `echo` it or `$WRONG`, never use `curl -v`, never write either into an artifact. **Not known** today: `/.env` has no such variable (Q-012) | `env` |
| **Test data** | Reference contract `<C>`, `<VIN>`, `<PC>`, `<TEL>` and the accepted key form, recorded by AP2435_001 steps 1–2 | test plan §8.1 |
| **Language** | The API returns JSON | — |
| **Leaves behind** | Nothing — searches change no data | `cleanup` (missing) |

**Request recipe (R)** — run from the repository root; it prints `send=OK` or `send=INVALID`:

```bash
cd "$(git rev-parse --show-toplevel)" || exit 1
AVP_ADMIN_API_KEY="$(grep -E '^AVP_ADMIN_API_KEY=' .env | tail -n 1 | cut -d= -f2- | tr -d '\r' | sed -e 's/^["'\'']//' -e 's/["'\'']$//')"
[ -n "$AVP_ADMIN_API_KEY" ] || { echo "STOP: AVP_ADMIN_API_KEY is empty or missing in /.env - case stays BLOCKED by Q-012"; exit 1; }
WRONG="QA-AP2435-INVALID-KEY-"; while [ ${#WRONG} -lt ${#AVP_ADMIN_API_KEY} ]; do WRONG="${WRONG}0"; done; WRONG="${WRONG:0:${#AVP_ADMIN_API_KEY}}"
[ "$WRONG" != "$AVP_ADMIN_API_KEY" ] || { echo "STOP: the fixed wrong key equals the real key - BLOCKED (environment)"; exit 1; }
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

`WRONG` is a fixed, obviously fake value — `QA-AP2435-INVALID-KEY-` padded with `0` (or cut) to the real key's length. It takes only the **length** of the real key, never a character of it, so a server that echoes the key it received cannot expose the real key in AP2435_009's evidence; it is built in the same command that uses it. `--data-urlencode` encodes a space as `+` and `+` as `%2B`; the exact URL sent is in the trailer line (`url_effective=`). The saved file holds response headers and body only — the request headers are never written. A server may still echo the key it received, so before anything reads the file the recipe replaces every 8-character run of the key found in it with `<redacted>` and prints `redacted=YES` (note that in the execution log); if any 8-character run is still present afterwards, the whole file is replaced by a one-line notice and the command prints `send=INVALID key echoed`. These checks never print the key.

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | A staging admin API key for QA | AP2435_006 – AP2435_010 | Open — Q-012. Raised 2026-11-01 |

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
| AP2435_006 | Partial, lower-case and country-code forms of the postal code and telephone — results are recorded | Edge-case | Medium | BLOCKED |
| AP2435_007 | A telephone search with the key in the Authorization Bearer header — whether it is accepted is recorded | Negative | Medium | BLOCKED |
| AP2435_008 | A search with no API key returns no contract data | Negative | High | BLOCKED |
| AP2435_009 | A search with a wrong API key returns no contract data | Negative | High | BLOCKED |
| AP2435_010 | A search that matches no VIN, postal code or telephone lists no contracts | Negative | Medium | BLOCKED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2435_006 — Partial, lower-case and country-code forms of the postal code and telephone — results are recorded

| Field | Value |
|---|---|
| **TC ID** | AP2435_006 |
| **Title** | Partial, lower-case and country-code forms of the postal code and telephone — results are recorded |
| **Requirement** | AP2435 — REQ-003 and REQ-004 ("fully matches"); open questions Q-004, Q-005, Q-007 (Judgement) |
| **Route** | `GET /api/admin/search-warranty` |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Q-012 — no staging admin API key available to QA |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** The ticket says postal code and telephone must match "fully" but does not say what a partial value, a lower-case postal code or a `+1` country code does. These results are **record-only**: the case passes when no objective fault occurs (every request is sent, no status is 5xx, every 2xx body is valid JSON), and the recorded behaviour goes to the author with Q-004, Q-005 and Q-007. A partial value may still match a VIN by coincidence, so the fragments are chosen to be absent from `<VIN>`.

**Test Data:**

| Variable | Value |
|---|---|
| query A | `<PC>` in lower case (for `H3K7B1`: `h3k7b1`) |
| query B | The first 3 characters of `<PC>` (for example `H3K`) — check it does not appear in `<VIN>`; if it does, use the last 3 characters |
| query C | The first 6 digits of `<TEL>` (for `5149779047`: `514977`) — check it does not appear in `<VIN>` |
| query D | `+1 ` followed by `<TEL>` as `NNN-NNN-NNNN` (for example `+1 514-977-9047`, sent as `query=%2B1+514-977-9047`) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Read `<C>`, `<VIN>`, `<PC>`, `<TEL>` and the accepted key form from the AP2435_001 entry of the execution log and build queries A–D. If AP2435_001 has not run, perform its steps 1 and 2 first | Four query strings and the accepted form are written in the execution log |
| 2 | Run recipe R with `<TC>`=`AP2435_006`, `<KEY_HEADER>` = the accepted form, for query A (`<n>`=`2a`) and then query B (`<n>`=`2b`) | Both print `send=OK`; neither status is 5xx (401/403 → BLOCKED) |
| 3 | Run recipe R for query C (`<n>`=`3c`) and then query D (`<n>`=`3d`), same key form | Both print `send=OK`; neither status is 5xx (401/403 → BLOCKED) |
| 4 | [Verification] Read all four saved responses | Every 2xx body is valid JSON. Record, for each query, the status, the number of entries, any paging fields and whether `<C>` is listed: A for Q-004, B and C for Q-005, D for Q-007. For a 4xx, record the status, content type and body instead |

---

### AP2435_007 — A telephone search with the key in the Authorization Bearer header — whether it is accepted is recorded

| Field | Value |
|---|---|
| **TC ID** | AP2435_007 |
| **Title** | A telephone search with the key in the Authorization Bearer header — whether it is accepted is recorded |
| **Requirement** | AP2435 — REQ-001 ("with the api key in the Authorization Bearer header"); open question Q-001 (Judgement) |
| **Route** | `GET /api/admin/search-warranty` |
| **Type** | Negative · API |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Q-012 — no staging admin API key available to QA |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** The ticket's text says the key goes in the Authorization Bearer header, while its example call sends `X-API-KEY`. AP2435_001 step 2 already tries both forms on a VIN query and fails only if neither is accepted while the key is confirmed active on `/admin/api-keys`. This case repeats the Bearer form on the ticket's own example query (a plain telephone) and records the result for Q-001, without judging which form is correct. It does not fail on a refused Bearer form — that verdict belongs to AP2435_001.

**Test Data:**

| Variable | Value |
|---|---|
| query | `<TEL>` as 10 plain digits (as in the ticket's example call) |
| header | `BR` — `Authorization: Bearer $AVP_ADMIN_API_KEY`, and **no** `X-API-KEY` header |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Read `<C>`, `<TEL>` and the AP2435_001 step 2 probe result from the execution log. If AP2435_001 has not run, perform its steps 1 and 2 first | `<C>`, `<TEL>` and the probe result are known |
| 2 | Run recipe R with `<TC>`=`AP2435_007`, `<n>`=`2`, `<value>` = `<TEL>`, `<KEY_HEADER>` = `BR` | `send=OK`; the status is not 5xx |
| 3 | [Verification] Read the saved response | Record the status, and if it is 2xx, the number of entries and whether `<C>` is listed (Q-001); compare with the AP2435_001 step 2 `BR` result. A 2xx body must be valid JSON. A 401/403 is recorded, not failed |

---

### AP2435_008 — A search with no API key returns no contract data

| Field | Value |
|---|---|
| **TC ID** | AP2435_008 |
| **Title** | A search with no API key returns no contract data |
| **Requirement** | AP2435 — REQ-001 (Given "The admin API user has an API key created"; the call is made "with the api key"); open question Q-002 (Judgement) for the exact response |
| **Route** | `GET /api/admin/search-warranty` |
| **Type** | Negative · API |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-012 — no staging admin API key available to QA (needed for the comparison in step 1) |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** The search returns client postal codes and phone numbers matched to contracts. If it answers without a key, anyone on the internet can look up whose contract a phone number belongs to. The exact status code and message are not stated (Q-002) and are recorded; returning the contract is an objective security fault. The send must be valid: an unanswered request proves nothing and is BLOCKED, never PASS.

**Test Data:**

| Variable | Value |
|---|---|
| query | `<TEL>` as 10 plain digits — a query AP2435_004 showed returns `<C>` with a key |
| header | `NONE` — neither `X-API-KEY` nor `Authorization` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Read `<C>` and `<TEL>` from the execution log, and confirm AP2435_004 step 3 listed `<C>` for the plain-digit telephone | `<C>` and `<TEL>` are known; the same query returns `<C>` when a key is sent |
| 2 | Run recipe R with `<TC>`=`AP2435_008`, `<n>`=`2`, `<value>` = `<TEL>`, `<KEY_HEADER>` = `NONE` (delete the placeholder; the key is still loaded by the recipe but not sent) | `send=OK`; the status is not 5xx |
| 3 | [Verification] Read the saved response | The body does not contain `<C>` or any `contractNumber` value. Record the status, content type and body (Q-002). A 2xx that lists any contract is a FAIL |

---

### AP2435_009 — A search with a wrong API key returns no contract data

| Field | Value |
|---|---|
| **TC ID** | AP2435_009 |
| **Title** | A search with a wrong API key returns no contract data |
| **Requirement** | AP2435 — REQ-001 (the call is made "with the api key"); open question Q-002 (Judgement) for the exact response |
| **Route** | `GET /api/admin/search-warranty` |
| **Type** | Negative · API |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-012 — no staging admin API key available to QA |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** A key check that accepts any value is no check at all. The exact rejection is not stated (Q-002) and is recorded; returning the contract for a wrong key is an objective security fault. Both header forms are tried, because either may be the one the build reads (Q-001).

**Test Data:**

| Variable | Value |
|---|---|
| query | `<TEL>` as 10 plain digits |
| header | `WXK` (step 2) and `WBR` (step 3) — `$WRONG` is the fixed fake value `QA-AP2435-INVALID-KEY-000…` built by the recipe in the same command (it shares only its length with the real key); never write the real key into the log |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Read `<C>` and `<TEL>` from the execution log, and confirm AP2435_004 step 3 listed `<C>` for the plain-digit telephone | `<C>` and `<TEL>` are known; the same query returns `<C>` with the real key |
| 2 | Run recipe R with `<TC>`=`AP2435_009`, `<n>`=`2`, `<value>` = `<TEL>`, `<KEY_HEADER>` = `WXK` | `send=OK`; the status is not 5xx |
| 3 | Run recipe R with `<n>`=`3`, same value, `<KEY_HEADER>` = `WBR` | `send=OK`; the status is not 5xx |
| 4 | [Verification] Read both saved responses | Neither body contains `<C>` or any `contractNumber` value. Record both statuses, content types and bodies (Q-002). A 2xx that lists any contract is a FAIL |

---

### AP2435_010 — A search that matches no VIN, postal code or telephone lists no contracts

| Field | Value |
|---|---|
| **TC ID** | AP2435_010 |
| **Title** | A search that matches no VIN, postal code or telephone lists no contracts |
| **Requirement** | AP2435 — REQ-005 ("The list of contracts found is returned"); open question Q-010 (Judgement) for the exact response |
| **Route** | `GET /api/admin/search-warranty` |
| **Type** | Negative · API |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Q-012 — no staging admin API key available to QA |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** When nothing is found, the list of contracts found is empty. A contract listed for a query that cannot match anything would mean the filter is not applied. The query contains `Q`, a letter VINs never use, and is neither a postal code nor a telephone. Whether "nothing found" is an empty list with HTTP 200 or an error status is not stated (Q-010) and is recorded. A refused key (401/403) proves nothing about the no-match result, so it cannot pass this case.

**Test Data:**

| Variable | Value |
|---|---|
| query | `ZZQA2435NOMATCH` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Read the accepted key form from the AP2435_001 entry of the execution log. If AP2435_001 has not run, perform its steps 1 and 2 first | The accepted form is known |
| 2 | Run recipe R with `<TC>`=`AP2435_010`, `<n>`=`2`, `<value>` = `ZZQA2435NOMATCH`, `<KEY_HEADER>` = the accepted form | `send=OK`; the status is not 5xx. A 401 or 403 → BLOCKED (result rule 2), never PASS |
| 3 | [Verification] Read the saved response | The status is 2xx, or a 4xx other than 401/403; and the body holds no `contractNumber` value. If 2xx, the body is valid JSON. Record the status and the exact body, for example `{"items": []}` or `[]` (Q-009, Q-010) |
