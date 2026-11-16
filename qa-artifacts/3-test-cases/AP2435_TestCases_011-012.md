# Test Cases — AP2435 (File 3 of 3)

**Project:** Avantage Plus v2
**Requirement:** AP2435 — Admin API: warranty search
**Source:** requirements/AP-2435-admin-api-warranty-search.md · qa-artifacts/1-requirements-analysis/AP-2435_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2435_test-plan.md
**Date:** 2026-11-01 (Execution Context and send/verification steps reworked 2026-11-01 after review R2 independent, findings F-1 to F-8; reworked again 2026-11-01 after R2 round 2, findings F-1 to F-4)
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2435_011 to AP2435_012 (2 test cases)
**Coverage:** Negative · Edge-case · API

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | The admin API only. The reference contract values come from the AP2435_001 entry of the execution log (dealer portal `/warranty` — the only warranty contract list in the `navigation` source) | `navigation` |
| **Entry route** | Not applicable — no page is opened in this batch unless AP2435_001 has not run, in which case perform its steps 1 and 2 (dealer login `/login` → **Contracts → Warranty** `/warranty`, then the header probe) | `navigation` |
| **API endpoint** | `GET https://v2dev.garantieavantageplus.ca/api/admin/search-warranty` — host and path exactly as in the ticket's example call | capture |
| **Request recipe (R)** | One Bash (Git Bash) command per request — the shell keeps **no** variables between commands, so the key is loaded inside every command. Replace `<TC>`, `<n>`, `<value>` and `<KEY_HEADER>`; change nothing else unless a step says so. See the block below this table | test plan §3.3 |
| **`<KEY_HEADER>`** | **The accepted form** recorded by AP2435_001 step 2 (Q-001): `XK` = `-H "X-API-KEY: $AVP_ADMIN_API_KEY"` or `BR` = `-H "Authorization: Bearer $AVP_ADMIN_API_KEY"` — `XK` when both were accepted | capture · Q-001 |
| **Valid send** | A request counts as sent only when the command prints `send=OK`: curl exit code 0 **and** the saved file starts with an HTTP status line (`HTTP/1.1 NNN` or `HTTP/2 NNN`). Anything else (non-zero exit, empty file, no status line) is retried once; if it still fails, the step is **BLOCKED (environment)** — never PASS, never FAIL. `STOP: AVP_ADMIN_API_KEY is empty` → the case is **BLOCKED by Q-012**, no retry. `send=INVALID key echoed` (the response still held part of the key after redaction, so the file was replaced by a notice) → **BLOCKED (environment)**, no retry | review F-1 · R2 round 2 F-3, F-4 |
| **Status** | The `http_code=` value on the `--- curl` trailer line at the end of the saved file. The body is the text between the blank line after the headers and that trailer line | — |
| **Result rules** | (1) Status 5xx → FAIL. (2) Status 401 or 403 → **BLOCKED** (key refused; confirm the key is still active on `/admin/api-keys` and record it with Q-012), never PASS or FAIL. (3) The ticket does not say what an empty, missing or very short query returns (Q-010, Q-003), so a 4xx validation answer with or without JSON is acceptable: "valid JSON, every entry carries a `contractNumber`" is asserted **only when the status is 2xx**; for a 4xx, the status, content type and body are recorded. (4) Record the number of entries and any paging fields (`total`, `page`, `next`, `limit` — Q-008) for every 2xx response | review F-3, F-4, F-8 |
| **Viewport** | 1280 × 800 (only if AP2435_001 step 1 must be performed) | `navigation` |
| **Environment** | Dev (`https://v2dev.garantieavantageplus.ca`) — `execution_env: Dev` in `qa-config/tools.md`. The cases were designed against v2staging (2026-11-01); the 2026-11-05 run used Dev with the same path | `env` · `tools.md` |
| **Login** | Admin API key: read by the recipe from the gitignored `/.env` variable **`AVP_ADMIN_API_KEY`**, by name only — never `echo` it, never use `curl -v`, never write it into an artifact. **Known** (Q-012 resolved 2026-11-05): `/.env` holds the Dev admin API key `QA-automation` (expires 2026-12-05) as `AVP_ADMIN_API_KEY` — value never shown here | `env` |
| **Test data** | Reference contract `<C>`, `<VIN>` and the accepted key form, recorded by AP2435_001 steps 1–2 | test plan §8.1 |
| **Language** | The API returns JSON for a 2xx; a 4xx may not | — |
| **Leaves behind** | Nothing — searches change no data | `cleanup` (missing) |

**Request recipe (R)** — run from the repository root; it prints `send=OK` or `send=INVALID`:

```bash
cd "$(git rev-parse --show-toplevel)" || exit 1
AVP_ADMIN_API_KEY="$(grep -E '^AVP_ADMIN_API_KEY=' .env | tail -n 1 | cut -d= -f2- | tr -d '\r' | sed -e 's/^["'\'']//' -e 's/["'\'']$//')"
[ -n "$AVP_ADMIN_API_KEY" ] || { echo "STOP: AVP_ADMIN_API_KEY is empty or missing in /.env - case stays BLOCKED by Q-012"; exit 1; }
OUT="qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/<TC>_step<n>_response.txt"
mkdir -p "$(dirname "$OUT")"
curl -sS -i --max-time 30 -G "https://v2dev.garantieavantageplus.ca/api/admin/search-warranty" \
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

The exact URL sent is in the trailer line (`url_effective=`). The saved file holds response headers and body only — the request headers are never written. A server may still echo the key it received, so before anything reads the file the recipe replaces every 8-character run of the key found in it with `<redacted>` and prints `redacted=YES` (note that in the execution log); if any 8-character run is still present afterwards, the whole file is replaced by a one-line notice and the command prints `send=INVALID key echoed`. These checks never print the key.

**Known blockers** — a fact these test cases needed that was not supplied at design time:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | A Dev admin API key for QA | AP2435_011 – AP2435_012 | **Resolved 2026-11-05** — Q-012: Dev key `QA-automation` (expires 2026-12-05) stored in `/.env` as `AVP_ADMIN_API_KEY`. Raised 2026-11-01 |

> No open blocker. The cases shipped BLOCKED by Q-012 on 2026-11-01, went back to **Not Run** on 2026-11-05 when the key was supplied, and were executed on Dev the same day (see Revisions).
>
> If the key expires or is revoked, the cases go back to **BLOCKED by Q-012** until a new key is stored in `/.env` as
> `AVP_ADMIN_API_KEY`. The test cases never create a key and never write `/.env` — creating a real credential is the QA's decision.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2435_011 | A search with an empty or missing query answers without a server error — the response is recorded | Negative | Medium | PASS |
| AP2435_012 | A short VIN fragment that matches many contracts — result count, paging and contract types are recorded | Edge-case | Low | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2435_011 — A search with an empty or missing query answers without a server error — the response is recorded

| Field | Value |
|---|---|
| **TC ID** | AP2435_011 |
| **Title** | A search with an empty or missing query answers without a server error — the response is recorded |
| **Requirement** | AP2435 — REQ-005; open question Q-010 (Judgement) |
| **Route** | `GET /api/admin/search-warranty` |
| **Type** | Negative · API |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — (Q-012 resolved 2026-11-05: Dev admin API key stored in `/.env` as `AVP_ADMIN_API_KEY`) |
| **Executed on** | 2026-11-05 — Dev (`https://v2dev.garantieavantageplus.ca`), see `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2435_2026-11-05.md` |
| **Result** | PASS — empty and missing query: 400 "Missing query parameter" |

**Why this matters:** An outside system may send an empty search box value or forget the parameter. The ticket does not say whether that returns every contract, none, or a validation error (Q-010), so the response is recorded. A server error (HTTP 5xx) is an objective fault, because the caller gets no usable answer; a 4xx validation answer is a fair one.

**Test Data:**

| Variable | Value |
|---|---|
| request A | `query` present but empty: recipe R with `<value>` left empty, which sends `.../search-warranty?query=` |
| request B | no `query` parameter: recipe R with only the text `--data-urlencode "query=<value>"` deleted from its line — keep `-H "accept: application/json" <KEY_HEADER> \` on that line — which sends `.../search-warranty` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Read the accepted key form from the AP2435_001 entry of the execution log. If AP2435_001 has not run, perform its steps 1 and 2 first | The accepted form is known |
| 2 | Run recipe R for request A with `<TC>`=`AP2435_011`, `<n>`=`2`, `<KEY_HEADER>` = the accepted form | `send=OK`; the trailer shows `?query=`; the status is not 5xx (401/403 → BLOCKED) |
| 3 | Run recipe R for request B with `<n>`=`3`, same key form | `send=OK`; the trailer shows no `query` parameter; the status is not 5xx (401/403 → BLOCKED) |
| 4 | [Verification] Read both saved responses | For each: if the status is 2xx, the body is valid JSON and every listed entry carries a `contractNumber` — record how many are listed and any paging fields. If it is 4xx, record the status, content type and body (any error message). Both go to the author with Q-010 |

---

### AP2435_012 — A short VIN fragment that matches many contracts — result count, paging and contract types are recorded

| Field | Value |
|---|---|
| **TC ID** | AP2435_012 |
| **Title** | A short VIN fragment that matches many contracts — result count, paging and contract types are recorded |
| **Requirement** | AP2435 — REQ-002, REQ-005; open questions Q-003, Q-008, Q-011 (Judgement) |
| **Route** | `GET /api/admin/search-warranty` |
| **Type** | Edge-case · API |
| **Priority** | Low |
| **Status** | PASS |
| **Blocked by** | — (Q-012 resolved 2026-11-05: Dev admin API key stored in `/.env` as `AVP_ADMIN_API_KEY`) |
| **Executed on** | 2026-11-05 — Dev (`https://v2dev.garantieavantageplus.ca`), see `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2435_2026-11-05.md` |
| **Result** | PASS (record-only) — KB: 7 entries incl. APOP01-836, no paging; broad queries cap at 10 (Q-008) |

**Why this matters:** A two-character fragment can match a large part of the contract base. The ticket states no minimum length (Q-003), no result limit or paging (Q-008) and no rule on which contracts are searchable (Q-011). This case records all three. A minimum-length rejection (4xx) is a fair answer; if results are returned, every listed entry must still be a contract with a `contractNumber`, which the ticket's example shows.

**Test Data:**

| Variable | Value |
|---|---|
| query | Characters 10 and 11 of `<VIN>` (for `1FAHP35NX8W239204`: `8W`) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Read `<C>`, `<VIN>` and the accepted key form from the AP2435_001 entry of the execution log and take characters 10 and 11. If AP2435_001 has not run, perform its steps 1 and 2 first | The two-character query and the accepted form are written in the execution log |
| 2 | Run recipe R with `<TC>`=`AP2435_012`, `<n>`=`2`, `<value>` = the two-character query, `<KEY_HEADER>` = the accepted form, and note how long it took | `send=OK` within the 30-second limit (a timeout is curl exit 28 → retry once, then BLOCKED, and record it for Q-008); the status is not 5xx (401/403 → BLOCKED) |
| 3 | [Verification] Read the saved response | If the status is 2xx: the body is valid JSON and every listed entry carries a `contractNumber`; record the number of entries, any paging fields (`total`, `page`, `next` or similar) for Q-008, whether `<C>` is listed (a result limit could leave it out, so its absence alone is not a fault), and the contract-number prefixes seen (`CVE-` or others) for Q-011. If it is 4xx: record the status, content type and body as the minimum-length answer for Q-003 |

---

## Revisions

| Date | TC ID | Change | Reason |
|---|---|---|---|
| 2026-11-05 | AP2435_011–012 | Status BLOCKED → Not Run; *Blocked by* Q-012 cleared | Q-012 resolved: Dev admin API key (`QA-automation`, expires 2026-12-05) stored in `/.env` as `AVP_ADMIN_API_KEY` — s4 worker, before execution |
| 2026-11-05 | AP2435_011–012 | Status Not Run → PASS; *Executed on* and *Result* filled | s4 run on Dev — execution log `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2435_2026-11-05.md` |
| 2026-11-05 | Execution Context — **API endpoint**, **Environment**, **Login**, request recipe host, **Known blockers** | Host changed from v2staging to Dev; key marked known (`/.env` `AVP_ADMIN_API_KEY`, value not shown); Q-012 blocker marked resolved 2026-11-05 | R3 finding F-2 (stale context after the Dev run) — s6 worker. No step or expected result changed |
