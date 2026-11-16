# Execution Log — AP-2435 (Admin API: warranty search)

## Execution Summary

**Environment:** Dev
**Executed by:** QA Agent — Manual Executor Skill (stlc-worker, stage `execute`)
**Date:** 2026-11-05
**Base URL:** `https://v2dev.garantieavantageplus.ca` (admin portal `/admin`, admin API `/api/admin/search-warranty`)
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800 — used for the reference data (admin portal) and one capture of the no-key call
**API client:** curl from Git Bash, recipe R of the test-case files with the Dev host, `-sS -i --max-time 30 -G --data-urlencode`
**Duration:** 2026-11-05T06:00:38Z (health check) → 2026-11-05T06:04:26Z (browser closed); every request was sent between 06:02:39Z and 06:04:00Z (the exact `sent_at` time is on the last line of each response file)
**Test case files:** `qa-artifacts/3-test-cases/AP2435_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP2435_TestCases_006-010.md`, `qa-artifacts/3-test-cases/AP2435_TestCases_011-012.md`
**Run folder:** `5.0.0` (fix version, from the run-state file)
**Health check (before s4):** `GET /` → 302 (redirect to login), `GET /admin/login` → 200; `/.env` holds `AVP_ADMIN_API_KEY` (64 characters, value never printed) and is git-ignored. Environment up.

| Metric | Value |
|---|:---:|
| Total test cases | 12 |
| Passed | 12 |
| Failed | 0 |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **100% (12 of 12)** |

All 12 cases had been marked BLOCKED at design time by Q-012 (no admin API key). Q-012 is resolved (Dev key `QA-automation`, expires 2026-12-05), so every case was set back to **Not Run** before this run (Revisions rows added to all three files) and then executed.

### Deviations from the test cases (read before the results)

| # | Test cases say | Executed instead | Why |
|---|---|---|---|
| D-1 | Host `https://v2staging.garantieavantageplus.ca` (cases designed 2026-11-01 against staging) | Host `https://v2dev.garantieavantageplus.ca` for every API call and admin page | `execution_env` in `qa-artifacts/qa-config/tools.md` is `Dev`; the key in `/.env` is a Dev key. The path is unchanged |
| D-2 | Path `/api/admin/search-warranty` (ticket example) | Same path | The ticket path and the spec path in `qa-docs/admin-api.md` §3.2 are identical, so no extra call at a "ticket path" was needed |
| D-3 | AP2435_001 step 1: reference contract found on the **dealer** portal `/warranty` (or one created through the quote flow) | Reference contract found read-only on the **admin** portal: Contracts → Warranties → Approved, record `/admin/warranty/836/edit` (Vehicle and Client sections) | Orchestrator hand-off: use existing Dev contracts found through the admin portal or knowledge sources. Nothing was created. See *Test data* for why 836 was chosen over 827 |
| D-4 | Recipe R loads the key with `grep … \| cut` and runs one command per request | Same recipe logic in a script (`r.sh` in the session scratchpad, not committed): key loaded with the `sed` snippet of `qa-docs/admin-api.md` §4 inside each run, `WRONG` built from the key's length only, the 8-character redaction loop and the `send=OK` check unchanged. The trailer line also records `time_total`, and `curl_exit` is followed by `sent_at` and `header_mode` | Orchestrator instruction (key only via the admin-api.md snippet); timing is needed for AP2435_012 |
| D-5 | Ticket text: key in the `Authorization: Bearer` header | The Bearer form was **sent and recorded** wherever a case states it: AP2435_001 step 2 (`BR`, 401), AP2435_007 step 2 (`BR`, 401), AP2435_009 step 3 (`WBR`, 401). Every other call used `X-API-KEY`, the form AP2435_001 step 2 found accepted | Orchestrator instruction (lesson from AP-2434 R3). **For R3:** AP-2434's R3 judged a refused Bearer call a FAIL against *that* ticket's case text. AP2435's cases are written differently: AP2435_001 step 2 fails only if *neither* form gets a 2xx, and AP2435_007 says "A 401/403 is recorded, not failed" (record-only for Q-001). Both steps are therefore marked PASS here, with the refusal recorded as a Q-001 observation. The reviewer may judge otherwise against the ticket's own sentence ("with the api key in the Authorization Bearer header") |
| D-6 | `[Verification]` steps → one browser screenshot each | API verification steps have no page to capture; their evidence is the saved response file named by the case recipe (`<TC>_step<n>_response.txt`, headers + body + curl trailer). The only browser captures are the reference-data pages (AP2435_001 step 1) and the no-key call opened directly in the browser (AP2435_008) | The cases define the response file as the evidence. No capture is reused for more than one step: each step points at its own response file |
| D-7 | Three extra calls not in any case | `AP2435_004_stepobs3` (work telephone `1241231234`), `AP2435_012_stepobs1` (`query=1`) and `AP2435_012_stepobs2` (`query=A`) | Observations only, for Q-006 (which phone field is searched) and Q-008 (result cap). They do not change any case result |

### Request template used (key redacted)

```bash
AVP_ADMIN_API_KEY=$(sed -n 's/^AVP_ADMIN_API_KEY=//p' .env | tail -n 1 | tr -d '\r' | sed -e 's/^"//' -e 's/"$//')   # never printed
curl -sS -i --max-time 30 -G "https://v2dev.garantieavantageplus.ca/api/admin/search-warranty" \
  --data-urlencode "query=<value>" -H "accept: application/json" -H "X-API-KEY: <AVP_ADMIN_API_KEY>" \
  -w '\n--- curl url_effective=%{url_effective} http_code=%{http_code} time_total=%{time_total}s\n' > "<TC>_step<n>_response.txt"
# header modes: XK = X-API-KEY: <AVP_ADMIN_API_KEY> · BR = Authorization: Bearer <AVP_ADMIN_API_KEY> · NONE = no key header
#               WXK / WBR = the same two headers with the fixed fake key QA-AP2435-INVALID-KEY-000… (64 characters)
```

Every one of the 25 requests (22 case requests + 3 observations) printed `send=OK` (curl exit 0 and an `HTTP/1.1 NNN` status line). No response echoed the key: `redacted=YES` was never printed, and a final scan of every AP-2435 artifact found no 12-character piece of the key (see *Key check* at the end).

### Test data

| Item | Value | How chosen |
|---|---|---|
| `<C>` | **APOP01-836** — warranty record **836** on Dev, dealer 1363 "Test Dealer 2", client Ken Nguyen, Honda CR-V 2024, approved September 3, 2026, invoice #917 paid | Admin → Contracts → Warranties → Approved tab, row confirmed in the list (`AP2435_001-step1-ListRowAPOP01-836_pass.png`). Named as a known Dev record in the orchestrator hand-off; not chosen by "newest". Read only |
| `<VIN>` | `BKVG64C7AKB4145G5` (17 characters) | `/admin/warranty/836/edit` → Vehicle → VIN* |
| `<PC>` | `H7L0C4` — **stored with a space**, `H7L 0C4` | `/admin/warranty/836/edit` → Client → Client postal code |
| `<TEL>` | `5146906330` — stored as 10 plain digits in **Client tel home**; **Client tel work** is `124-123-1234` (stored with hyphens) | `/admin/warranty/836/edit` → Client |
| Fragment (001, 002) | characters 7–12 of `<VIN>`: `C7AKB4`; lower case `c7akb4` | Case test data |
| Two-character query (012) | characters 10–11 of `<VIN>`: `KB` | Case test data |
| 006 queries | A `h7l0c4` · B `H7L` (not in `<VIN>`) · C `514690` (not in `<VIN>`) · D `+1 514-690-6330` | Case test data, checked against `<VIN>` before sending |
| Not used: warranty 827 | `/admin/warranty/827/edit` shows placeholder data — VIN `123123123123` (12 characters), postal code `12345`, tel home `11111`, tel work `22222` | The cases need a 17-character VIN, a real postal code and a 10-digit telephone (Execution Context *Test data*), so 827 cannot serve as `<C>` |

**Records left on Dev:** none. Every call is a read-only search; no quote, contract, client or key was created, edited or revealed. The admin portal was used read-only (no Save clicked).

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2435_001 | Searching part of a contract vehicle's VIN returns that contract's number in the results | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_001-step1-Warranty836VinPostalTel_pass.png`, `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_001_step2xk_response.txt` | `C7AKB4` → 200, 2 entries incl. APOP01-836. X-API-KEY accepted; Bearer → 401 "Missing API key" (Q-001) |
| AP2435_002 | Searching a contract vehicle's whole VIN returns that contract; a lower-case fragment's result is recorded | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_002_step2_response.txt` | Whole VIN → APOP01-836; lower-case `c7akb4` also matches (Q-004) |
| AP2435_003 | Searching a client's postal code with and without its space returns the same contract both times | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_003_step3_response.txt` | `H7L0C4` and `H7L 0C4` → same 10 entries incl. APOP01-836 |
| AP2435_004 | Searching a client's telephone with hyphens or as plain digits returns that contract | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_004_step2_response.txt` | `514-690-6330` and `5146906330` → same 10 entries incl. APOP01-836 |
| AP2435_005 | Searching a client's telephone with dots or with parentheses returns that contract | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_005_step3_response.txt` | `514.690.6330` and `(514) 690-6330` → same 10 entries incl. APOP01-836 |
| AP2435_006 | Partial, lower-case and country-code forms of the postal code and telephone — results are recorded | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_006_step3d_response.txt` | Record-only: lower-case postal matches; `H7L`, `514690`, `+1 514-690-6330` → `{"items":[]}` |
| AP2435_007 | A telephone search with the key in the Authorization Bearer header — whether it is accepted is recorded | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_007_step2_response.txt` | Record-only: Bearer → 401 "Missing API key", same as 001 step 2 (Q-001) |
| AP2435_008 | A search with no API key returns no contract data | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_008-step3-NoKeyBrowser401NoContract_pass.png` | 401 "Missing API key", no contract; also 401 in a browser with an admin session |
| AP2435_009 | A search with a wrong API key returns no contract data | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_009_step2_response.txt` | Wrong X-API-KEY → 401 "Invalid API key"; wrong Bearer → 401 "Missing API key" |
| AP2435_010 | A search that matches no VIN, postal code or telephone lists no contracts | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_010_step2_response.txt` | 200 `{"items":[]}` (Q-010) |
| AP2435_011 | A search with an empty or missing query answers without a server error — the response is recorded | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_011_step3_response.txt` | Both → 400 `{"success":false,"error":"Missing query parameter"}` (Q-010) |
| AP2435_012 | A short VIN fragment that matches many contracts — result count, paging and contract types are recorded | Low | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_012_step2_response.txt` | `KB` → 7 entries incl. APOP01-836, 0.69 s; no paging field. Results cap at 10 (Q-008) |

---

## Step-by-Step Results

### AP2435_001 — Searching part of a contract vehicle's VIN returns that contract's number in the results — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Find a warranty contract with a VIN, client postal code and telephone; record `<C>`, `<VIN>`, `<PC>`, `<TEL>` and the route | A contract page with a contract number, a 17-character VIN, a postal code and a telephone; all values written in the log | Admin portal (Dev), logged in as the shared admin account. The Approved list row shows "Ken Nguyen … Honda CR-V 2024 VIN: BKVG64C7AKB4145G5 … APOP01-836 100m/20000km … Invoice #917 Paid". Route `/admin/warranty/836/edit`: Vehicle → VIN* = `BKVG64C7AKB4145G5`; Client → Client postal code = `H7L 0C4`, Client tel home = `5146906330`, Client tel work = `124-123-1234` | ✅ | Deviation D-3 (admin portal instead of dealer portal, no contract created). Warranty 827 was checked first and rejected (placeholder data, see Test data) |
| 2 | Header probe (Q-001): recipe R with fragment `C7AKB4`, once with `XK` (`2xk`), once with `BR` (`2br`) | Both `send=OK`, neither 5xx; record each status; accepted form = every form with a 2xx | `2xk`: `send=OK`, URL `…/search-warranty?query=C7AKB4`, **HTTP 200**, `application/json`, 0.98 s. `2br`: `send=OK`, same URL, **HTTP 401**, body `{"error":"Missing API key"}` — the server ignores `Authorization: Bearer` and reports the key as missing. **Accepted form: `XK`** | ✅ | Bearer form (the ticket's text) refused, recorded for Q-001 — see D-5 for the reviewer. The step fails only when neither form gets a 2xx |
| 3 `[Verification]` | Read the body of the accepted response (`AP2435_001_step2xk_response.txt`) | Record count, paging, shape and extra fields first; then valid JSON, every entry has `contractNumber`, one equals `<C>` | Valid JSON, top level **an object with `items`** (Q-009), **2 entries**, no paging field (Q-008): `APOP01-836` and `APOP01-834` (both on VIN `BKVG64C7AKB4145G5`). Every entry has `contractNumber`. Each entry also carries 23 more fields: `date_start`, `vehicle_make`, `vehicle_model`, `vehicle_year`, `vehicle_vin`, `vehicle_kilometers`, `vehicle_price`, `client_email`, `client_last_name`, `client_first_name`, `client_company`, `client_address`, `client_address2`, `client_city`, `client_postal_code`, `client_tel_home`, `client_tel_work`, `term_months`, `term_km`, `franchise_amount`, `repair_amount_per_visit`, `repair_amount_total`, `sale_price` | ✅ | APOP01-836 listed. The extra fields (client name, email, address, phones, prices) go beyond the ticket's example and the spec, which show only `contractNumber` — recorded as observation O-3 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_001-step1-Warranty836VinPostalTel_pass.png` — full page of `/admin/warranty/836/edit` with the **Vehicle section only** open: it shows the VIN `BKVG64C7AKB4145G5`; the Client section is closed, so the postal code and telephones are not visible in this capture. The Client values are confirmed by the list-row capture below (telephone 5146906330, VIN, APOP01-836) and by the API response bodies (APOP01-836 with `client_postal_code`, `client_tel_home` and `client_tel_work` equal to the values in step 1). _Corrected 2026-11-05 after R3 F-1._
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_001-step1-ListRowAPOP01-836_pass.png` — the Approved list row that ties record 836 to contract number APOP01-836
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_001_step2xk_response.txt` — X-API-KEY call: 200 with 2 entries
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_001_step2br_response.txt` — Bearer call: 401 "Missing API key"

### AP2435_002 — Searching a contract vehicle's whole VIN returns that contract; a lower-case fragment's result is recorded — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Read `<C>`, `<VIN>` and the accepted form from AP2435_001 | Known | `<C>` = APOP01-836, `<VIN>` = `BKVG64C7AKB4145G5`, accepted form `XK` | ✅ | From the AP2435_001 entry above |
| 2 | Recipe R, `query=BKVG64C7AKB4145G5`, `XK` | `send=OK`, not 5xx | `send=OK`, HTTP 200, 0.73 s | ✅ | — |
| 3 | Recipe R, `query=c7akb4`, `XK` | `send=OK`, not 5xx | `send=OK`, HTTP 200, 0.70 s | ✅ | — |
| 4 `[Verification]` | Read both saved responses | Step 2: 2xx, valid JSON, lists `<C>`. Step 3: record status and whether `<C>` is listed (Q-004) | Step 2: valid JSON `{"items":[…]}`, 2 entries (`APOP01-836`, `APOP01-834`), no paging field — `<C>` listed. Step 3: HTTP 200, valid JSON, the same 2 entries — **the lower-case fragment matches** (VIN search is case-insensitive) | ✅ | Q-004 observation: lower case matches |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_002_step2_response.txt` — whole VIN: 200, 2 entries incl. APOP01-836
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_002_step3_response.txt` — lower-case fragment: 200, same 2 entries

### AP2435_003 — Searching a client's postal code with and without its space returns the same contract both times — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Read `<C>`, `<PC>`, accepted form; note stored spelling | Known; stored spelling recorded | `<C>` = APOP01-836, `<PC>` = `H7L0C4`, form `XK`. The contract stores the postal code **with** a space: `H7L 0C4` | ✅ | — |
| 2 | Recipe R, `query=H7L0C4`, `XK` | `send=OK`, not 5xx | `send=OK`, HTTP 200, 0.68 s | ✅ | — |
| 3 | Recipe R, `query=H7L 0C4`, `XK` | `send=OK`, not 5xx | `send=OK`, URL `…?query=H7L+0C4` (space sent as `+`), HTTP 200, 0.63 s | ✅ | — |
| 4 `[Verification]` | Read both saved responses | Both 2xx, valid JSON, both list `<C>` | Both valid JSON `{"items":[…]}` with the **same 10 entries** in the same order: APAP OP3-842, APAP OP3-838, APOP01-837, **APOP01-836**, APAP OP3-835, ATplus-820, CVE-815, CVE-814, CVE-801, VATP-800. No paging field | ✅ | Spaces are ignored both ways. Exactly 10 entries — the result cap seen in O-1 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_003_step2_response.txt` — `H7L0C4`: 200, 10 entries incl. APOP01-836
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_003_step3_response.txt` — `H7L 0C4`: 200, the same 10 entries

### AP2435_004 — Searching a client's telephone with hyphens or as plain digits returns that contract — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Read `<C>`, `<TEL>`, accepted form; note stored spelling | Known | `<C>` = APOP01-836, `<TEL>` = `5146906330` (Client tel home, stored as plain digits), form `XK` | ✅ | — |
| 2 | Recipe R, `query=514-690-6330`, `XK` | `send=OK`, not 5xx | `send=OK`, HTTP 200, 0.92 s | ✅ | — |
| 3 | Recipe R, `query=5146906330`, `XK` | `send=OK`, not 5xx | `send=OK`, HTTP 200, 0.73 s | ✅ | — |
| 4 `[Verification]` | Read both saved responses | Both 2xx, valid JSON, both list `<C>` | Both valid JSON with the same 10 entries as AP2435_003, **APOP01-836** included; no paging field | ✅ | Hyphens are ignored |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_004_step2_response.txt` — `514-690-6330`: 200, 10 entries incl. APOP01-836
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_004_step3_response.txt` — `5146906330`: 200, the same 10 entries
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_004_stepobs3_response.txt` — observation (D-7): work telephone `1241231234` → 200, 10 entries incl. APOP01-836 (Q-006)

### AP2435_005 — Searching a client's telephone with dots or with parentheses returns that contract — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Read `<C>`, `<TEL>`, accepted form | Known | APOP01-836, `5146906330`, `XK` | ✅ | — |
| 2 | Recipe R, `query=514.690.6330`, `XK` | `send=OK`, not 5xx | `send=OK`, HTTP 200, 0.69 s | ✅ | — |
| 3 | Recipe R, `query=(514) 690-6330`, `XK` | `send=OK`, not 5xx | `send=OK`, URL `…?query=%28514%29+690-6330`, HTTP 200, 0.66 s | ✅ | — |
| 4 `[Verification]` | Read both saved responses | Both 2xx, valid JSON, both list `<C>` | Both valid JSON with the same 10 entries as AP2435_003, **APOP01-836** included; no paging field | ✅ | Dots, parentheses and the space are ignored |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_005_step2_response.txt` — `514.690.6330`: 200, 10 entries incl. APOP01-836
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_005_step3_response.txt` — `(514) 690-6330`: 200, the same 10 entries

### AP2435_006 — Partial, lower-case and country-code forms of the postal code and telephone — results are recorded — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Build queries A–D | Four queries and the accepted form written in the log | A `h7l0c4` · B `H7L` (not in `<VIN>`) · C `514690` (not in `<VIN>`) · D `+1 514-690-6330`; form `XK` | ✅ | — |
| 2 | Recipe R for A (`2a`) and B (`2b`) | Both `send=OK`, not 5xx | A: `send=OK`, HTTP 200. B: `send=OK`, HTTP 200 | ✅ | — |
| 3 | Recipe R for C (`3c`) and D (`3d`) | Both `send=OK`, not 5xx | C: `send=OK`, HTTP 200. D: `send=OK`, URL `…?query=%2B1+514-690-6330`, HTTP 200 | ✅ | — |
| 4 `[Verification]` | Read all four responses | Every 2xx body valid JSON; record status, count, paging and whether `<C>` is listed | All four valid JSON, no paging field. **A** (lower-case postal code): 10 entries, `<C>` listed — case-insensitive (Q-004). **B** (`H7L`, partial postal): `{"items":[]}` — 0 entries, `<C>` not listed. **C** (`514690`, partial phone): `{"items":[]}` — 0 entries. **D** (`+1` country code): `{"items":[]}` — 0 entries, `<C>` not listed (Q-007) | ✅ | Record-only; no objective fault. Partial postal/phone do not match (full match as specified); a `+1` prefix stops the phone matching |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_006_step2a_response.txt` — `h7l0c4`: 200, 10 entries incl. APOP01-836
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_006_step2b_response.txt` — `H7L`: 200, empty list
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_006_step3c_response.txt` — `514690`: 200, empty list
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_006_step3d_response.txt` — `+1 514-690-6330`: 200, empty list

### AP2435_007 — A telephone search with the key in the Authorization Bearer header — whether it is accepted is recorded — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Read `<C>`, `<TEL>` and the 001 probe result | Known | APOP01-836, `5146906330`; 001 step 2: `XK` 200, `BR` 401 | ✅ | — |
| 2 | Recipe R, `query=5146906330`, `BR` (no `X-API-KEY` header) | `send=OK`, not 5xx | `send=OK`, HTTP 401, 0.59 s | ✅ | — |
| 3 `[Verification]` | Read the saved response; compare with 001 step 2 `BR` | Record status (and count if 2xx); a 401/403 is recorded, not failed | HTTP 401, `application/json`, body `{"error":"Missing API key"}` — identical to AP2435_001 step 2 `BR`. The same query with `X-API-KEY` returns 10 entries (AP2435_004 step 3) | ✅ | Q-001 observation: the Authorization Bearer form named in the ticket text is not accepted; only `X-API-KEY` works. See D-5 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_007_step2_response.txt` — Bearer call: 401 "Missing API key"

### AP2435_008 — A search with no API key returns no contract data — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Read `<C>`, `<TEL>`; confirm AP2435_004 step 3 listed `<C>` | Known; the query returns `<C>` with a key | AP2435_004 step 3 (`5146906330`, `XK`) listed APOP01-836 | ✅ | — |
| 2 | Recipe R, `query=5146906330`, `NONE` | `send=OK`, not 5xx | `send=OK`, HTTP 401, 0.58 s | ✅ | — |
| 3 `[Verification]` | Read the saved response | No `<C>` and no `contractNumber`; record status, content type, body (Q-002) | HTTP 401, `application/json`, body `{"error":"Missing API key"}` — no contract data. The same URL opened in the browser while logged in to the admin portal also returned **HTTP 401** with the same body, so an admin session cookie does not open the API | ✅ | Q-002 observation: 401 + JSON error |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_008_step2_response.txt` — curl, no key header: 401
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_008-step3-NoKeyBrowser401NoContract_pass.png` — the browser showing `{"error":"Missing API key"}` for `/api/admin/search-warranty?query=5146906330` (HTTP 401 reported by the browser tool)

### AP2435_009 — A search with a wrong API key returns no contract data — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Read `<C>`, `<TEL>`; confirm AP2435_004 step 3 listed `<C>` | Known | Confirmed (APOP01-836 listed with the real key) | ✅ | — |
| 2 | Recipe R, `query=5146906330`, `WXK` (fixed fake key, 64 characters) | `send=OK`, not 5xx | `send=OK`, HTTP 401, 0.62 s | ✅ | — |
| 3 | Recipe R, same query, `WBR` | `send=OK`, not 5xx | `send=OK`, HTTP 401, 0.60 s | ✅ | — |
| 4 `[Verification]` | Read both responses | No `<C>`, no `contractNumber`; record statuses, content types, bodies | Step 2: 401, `application/json`, `{"error":"Invalid API key"}`. Step 3: 401, `application/json`, `{"error":"Missing API key"}` (the Bearer header is not read at all). No contract data in either | ✅ | Q-002 observation: wrong key → "Invalid API key" |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_009_step2_response.txt` — wrong X-API-KEY: 401 "Invalid API key"
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_009_step3_response.txt` — wrong Bearer: 401 "Missing API key"

### AP2435_010 — A search that matches no VIN, postal code or telephone lists no contracts — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Read the accepted form | Known | `XK` | ✅ | — |
| 2 | Recipe R, `query=ZZQA2435NOMATCH`, `XK` | `send=OK`, not 5xx | `send=OK`, HTTP 200, 0.69 s | ✅ | — |
| 3 `[Verification]` | Read the saved response | 2xx (or 4xx other than 401/403), no `contractNumber`; if 2xx, valid JSON; record the exact body | HTTP 200, `application/json`, exact body `{"items":[]}` | ✅ | Q-009/Q-010 observation: nothing found = 200 with an empty `items` list |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_010_step2_response.txt` — 200 `{"items":[]}`

### AP2435_011 — A search with an empty or missing query answers without a server error — the response is recorded — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Read the accepted form | Known | `XK` | ✅ | — |
| 2 | Request A: `query` present but empty, `XK` | `send=OK`, trailer shows `?query=`, not 5xx | `send=OK`, URL `…/search-warranty?query=`, HTTP 400 | ✅ | — |
| 3 | Request B: no `query` parameter, `XK` | `send=OK`, no `query` in the trailer, not 5xx | `send=OK`, URL `…/search-warranty` (no parameter), HTTP 400 | ✅ | — |
| 4 `[Verification]` | Read both responses | 2xx → valid JSON; 4xx → record status, content type, body (Q-010) | Both: HTTP 400, `application/json`, body `{"success":false,"error":"Missing query parameter"}` | ✅ | Q-010 observation: an empty query is treated like a missing one (400) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_011_step2_response.txt` — empty query: 400
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_011_step3_response.txt` — no query parameter: 400

### AP2435_012 — A short VIN fragment that matches many contracts — result count, paging and contract types are recorded — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Characters 10–11 of `<VIN>` | Query and form written in the log | `KB`, form `XK` | ✅ | — |
| 2 | Recipe R, `query=KB`, `XK`; note the time | `send=OK` within 30 s, not 5xx | `send=OK`, HTTP 200, **0.69 s** | ✅ | — |
| 3 `[Verification]` | Read the saved response | 2xx → valid JSON, every entry has `contractNumber`; record count, paging, whether `<C>` is listed, prefixes | Valid JSON `{"items":[…]}`, **7 entries**, every one with `contractNumber`: APOP01-836, APOP01-834, APOP01-539, AVLmoto-529, AT-227, AVLmoto-182, AVLmoto-151. No paging field. `<C>` listed. Prefixes seen: `APOP01`, `AVLmoto`, `AT` (Q-011). No minimum-length rejection for 2 characters (Q-003) | ✅ | Record-only for Q-003, Q-008, Q-011. Extra calls `query=1` and `query=A` (D-7) each returned **exactly 10** entries, highest record number first, with no paging or total field — see O-1 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_012_step2_response.txt` — `KB`: 200, 7 entries
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_012_stepobs1_response.txt` — observation `query=1`: 200, 10 entries (APOP01-847 … AT-833)
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2435/AP2435_012_stepobs2_response.txt` — observation `query=A`: 200, 10 entries (APOP01-847 … 26df1-829)

---

## Observations for the open questions (not failures)

| # | Question | What the build did on Dev |
|---|---|---|
| O-1 | Q-008 result limit / paging | Every broad query returns **at most 10 entries**, ordered by record number, highest first (not by date: APOP01-847, dated 2026-10-03, is listed before APOP01-846, dated 2026-11-09 — corrected after R3 F-3), with **no** `total`, `page`, `next` or `limit` field — so a caller cannot tell that more contracts matched or fetch them. Seen on `query=1`, `query=A`, the postal code and both telephones of client Ken Nguyen (home-phone search lists APAP OP3-842 … VATP-800; the work-phone search lists VATP-794, VATP-767 and VATP-766, which the home-phone search never reached). The ticket says "The list of contracts found is returned"; whether a 10-item cap is intended is for the author |
| O-2 | Q-001 key header | `X-API-KEY` accepted. `Authorization: Bearer <key>` is not read at all: 401 "Missing API key" with the real key (001, 007) and with a wrong key (009) |
| O-3 | Response content (Q-009, spec) | Top level is `{"items":[…]}` as the example shows. Each item carries 24 fields, not only `contractNumber`: vehicle data, prices, and the client's full name, email, street address, city, postal code and both telephones. The spec (`qa-docs/admin-api.md` §3.2) lists only `contractNumber` |
| O-4 | Q-006 phone fields | Both **Client tel home** and **Client tel work** are searched (work number `124-123-1234` stored with hyphens matched the query `1241231234`) |
| O-5 | Q-004 / Q-005 / Q-007 | VIN and postal code searches are case-insensitive; partial postal code or telephone returns nothing; a `+1` country code makes the telephone not match |
| O-6 | Q-002 / Q-010 | No key → 401 "Missing API key"; wrong key → 401 "Invalid API key"; no match → 200 `{"items":[]}`; empty or missing query → 400 `{"success":false,"error":"Missing query parameter"}` |
| O-7 | Contract number format | Some contract numbers contain a space, e.g. `APAP OP3-842` |

## Environment observations

- Every request answered in under 1 second; no 5xx, no timeout, no retry was needed.
- An admin portal session in the browser does not authenticate `/api/admin/search-warranty` (401 without the key header).
- `/admin/warranty/{id}/edit` shows the vehicle VIN under the **Vehicle** accordion (open by default) and the client's postal code and two telephones under the **Client** accordion (closed by default). Written back to `qa-docs/admin-portal.md`.

## Key check

After every artifact was written, each AP-2435 file (this log, the three test-case files, the run-state file, the run summary and every file in `screenshots/5.0.0/AP-2435/`) was scanned for every 12-character piece of the key, without printing the key. Result: see the run summary (`qa-artifacts/5-testing-report/AP-2435_run-summary.md`, *Key check*).
