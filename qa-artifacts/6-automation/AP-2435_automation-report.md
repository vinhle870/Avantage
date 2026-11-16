# Automation Report — AP-2435
Date: 2026-11-05 (rework round 1 after R5 REWORK: 2026-11-05T06:39Z) · Source log: qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2435_2026-11-05.md
Spec: playwright-automation/src/tests/admin/warrantySearchApi_AP2435.spec.ts · Tag: @AP-2435
Result: 12 of 12 PASSED cases automated — 12 passing, 0 fixme

## Summary
All twelve AP-2435 cases passed manually on Dev, and all twelve now run automatically as API tests against `GET /api/admin/search-warranty`, sending each request with Node's built-in `fetch` instead of curl (not Playwright's request API — see *Rework round 1*). They search read-only for the Dev reference contract APOP01-836 (warranty record 836) and create nothing. The suite runs only on Dev (v2dev) and only when the Dev admin API key is exported as `AVP_ADMIN_API_KEY`; otherwise it skips itself with the reason. The framework had no API layer, so this ticket adds one: an API object (`src/api/AdminWarrantySearchApi.ts`) that sends the request, and a flow (`src/flows/WarrantySearchApiFlow.ts`) that holds the assertions.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2435_001 | Searching part of a contract vehicle's VIN returns that contract's number in the results | automated — passing | — |
| AP2435_002 | Searching a contract vehicle's whole VIN returns that contract; a lower-case fragment's result is recorded | automated — passing | — |
| AP2435_003 | Searching a client's postal code with and without its space returns the same contract both times | automated — passing | — |
| AP2435_004 | Searching a client's telephone with hyphens or as plain digits returns that contract | automated — passing | — |
| AP2435_005 | Searching a client's telephone with dots or with parentheses returns that contract | automated — passing | — |
| AP2435_006 | Partial, lower-case and country-code forms of the postal code and telephone — results are recorded | automated — passing | Record-only, as in the case: asserts no 5xx and a valid JSON body; the results go to annotations |
| AP2435_007 | A telephone search with the key in the Authorization Bearer header — whether it is accepted is recorded | automated — passing | Record-only, as in the case: a 401 for Bearer is recorded, not failed (Q-001) |
| AP2435_008 | A search with no API key returns no contract data | automated — passing | — |
| AP2435_009 | A search with a wrong API key returns no contract data | automated — passing | — |
| AP2435_010 | A search that matches no VIN, postal code or telephone lists no contracts | automated — passing | — |
| AP2435_011 | A search with an empty or missing query answers without a server error — the response is recorded | automated — passing | Record-only for the status and body (Q-010); asserts no 5xx |
| AP2435_012 | A short VIN fragment that matches many contracts — result count, paging and contract types are recorded | automated — passing | Record-only for the count, paging and prefixes (Q-003, Q-008, Q-011) |

### How the manual result rules were carried over
- **5xx → fail** in every test.
- **401/403 on the accepted key form (`X-API-KEY`) → BLOCKED by Q-012.** The test is skipped with a reason that names the key (`QA-automation`, expires 2026-12-05) and says to check `/admin/api-keys`. It does not pass and does not fail, which is what the manual rule says. After the key expires, the suite reports skips, not failures.
- **"Valid JSON" and "lists APOP01-836" are asserted only on a 2xx.** The body may be `{"items":[…]}` or a bare list (Q-009). Every entry must carry a string `contractNumber`.
- **Observations O-1 to O-3 are not asserted.** These are the 10-item cap, the Bearer 401 and the 24 fields per item. AP2435_001 asserts only that at least one header form is accepted and lists APOP01-836, and records the Bearer status. AP2435_007 records the Bearer status. Neither test checks the field count or the cap.
- Each request's status, entry count and contract numbers are written to the test's annotations (type `AP-2435 observation`) in the HTML report. On a 2xx the annotation also records the body's shape by **name only** (R5 F-2; AP2435_001 step 3, 011 step 4, 012 step 3): the top-level shape and keys (`object {items}` or `bare list`, Q-009), any paging field names among them (Q-008), and the entry field names besides `contractNumber` (23 on Dev, O-3). No field value is written, because the entries hold client personal data. The key is never written there.

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| all | — | `WarrantySearchApiFlow.open(playwright, origin, key)` / `dispose()` — a new API object per test; requests go through Node `fetch`, so no Playwright request context is opened and `dispose()` has nothing to release | new |
| AP2435_001 | 1 | Reference data fixed in the spec (`REF`): APOP01-836, VIN `BKVG64C7AKB4145G5`, postal `H7L0C4`, tel `5146906330` — from the execution log and `test-centralized.md`, so no portal page is opened | new (constant) |
| AP2435_001 | 2–3 | `WarrantySearchApiFlow.probeKeyHeaderForms('C7AKB4', C)` → `AdminWarrantySearchApi.search(q, 'xApiKey' / 'bearer')` | new |
| AP2435_002 | 2, 4 | `searchListsContract(VIN, C)` | new |
| AP2435_002 | 3, 4 | `recordSearch('c7akb4', C)` | new |
| AP2435_003 | 2–4 | `searchListsContract('H7L0C4', C)`, `searchListsContract('H7L 0C4', C)` | new |
| AP2435_004 | 2–4 | `searchListsContract('514-690-6330', C)`, `searchListsContract('5146906330', C)` | new |
| AP2435_005 | 2–4 | `searchListsContract('514.690.6330', C)`, `searchListsContract('(514) 690-6330', C)` | new |
| AP2435_006 | 2–4 | `recordSearch` × 4: `h7l0c4`, `H7L`, `514690`, `+1 514-690-6330` | new |
| AP2435_007 | 2–3 | `recordSearch('5146906330', C, 'bearer')` | new |
| AP2435_008 | 2–3 | `searchReturnsNoContractData('5146906330', C, 'none')` | new |
| AP2435_009 | 2–4 | `searchReturnsNoContractData(…, 'wrongXApiKey')`, `searchReturnsNoContractData(…, 'wrongBearer')` — fixed fake key `QA-AP2435-INVALID-KEY-000…` (64 characters) | new |
| AP2435_010 | 2–3 | `searchListsNoContracts('ZZQA2435NOMATCH')` | new |
| AP2435_011 | 2–4 | `recordSearch('', C)` (sends `?query=`), `recordSearch(undefined, C)` (no `query` parameter) | new |
| AP2435_012 | 2–3 | `recordSearch('KB', C)` (30-second request timeout, as in the case) | new |

## New locators
None. These are API tests, so the browser was not opened and no locator was needed.

## Files changed
| File | Change |
|---|---|
| playwright-automation/src/api/AdminWarrantySearchApi.ts | new: the first API object in the framework. It has `search(query, mode)` with key modes `xApiKey`, `bearer`, `none`, `wrongXApiKey` and `wrongBearer`. The key is held in a private `#key` field and sent per request through Node's built-in `fetch` with `AbortSignal.timeout(30_000)` — not Playwright's `APIRequestContext`, whose own report step would record the headers on a failed send (R5 F-1). A send that gets no answer throws one new, cause-less error line: the label plus the error's name, message and code and each `cause` in its chain, with the key removed from all of it |
| playwright-automation/src/flows/WarrantySearchApiFlow.ts | new flow: `open`, `dispose`, `probeKeyHeaderForms`, `searchListsContract`, `recordSearch`, `searchReturnsNoContractData`, `searchListsNoContracts`. Every assertion lives here, and every method runs inside `test.step`. It no longer opens a Playwright request context (R5 F-1), and on a 2xx its annotation records the body's top-level keys, paging field names and entry field names — names only (R5 F-2) |
| playwright-automation/src/tests/admin/warrantySearchApi_AP2435.spec.ts | new spec: one describe `Admin API Warranty Search @admin @AP-2435` with 12 tests. It skips on any base URL other than v2dev and when `AVP_ADMIN_API_KEY` is unset. A top-level `test.use({ trace: 'off', screenshot: 'off', video: 'off' })` stops traces from storing request headers |

No file outside these three was changed: not `config.ts` (the key is read with the existing `getEnvConfig('AVP_ADMIN_API_KEY')`), not `test-fixtures.ts`, and none of the QA's uncommitted AP-2441 or AP-2495 files.

## Run
Command: `AVP_ADMIN_API_KEY="<exported from /.env in the same shell command, never echoed>" npx playwright test --project=chromium --grep @AP-2435`
Lint: pass · Run (rework round 1, after the F-1 change): 12 passed, 0 fixme, 13.2 s (run 1) · 12 passed, 0 fixme, 15.1 s (run 2). These were two separate full runs on Dev on 2026-11-05 (no `--repeat-each`), with no flaky tests. The first round's two runs (13.1 s, 12.9 s) were also 12/12.

Both runs returned the same results as the manual run, request for request:
- **001:** `C7AKB4` with X-API-KEY → 200, 2 entries (APOP01-836, APOP01-834); shape `object {items}`, paging fields none, 23 entry fields besides `contractNumber`. With Bearer → 401 `{"error":"Missing API key"}`.
- **003–005:** every postal code and telephone format → 200, the same 10 entries, including APOP01-836.
- **006:** `h7l0c4` → 10 entries, including APOP01-836. `H7L`, `514690` and `+1 514-690-6330` → `{"items":[]}`.
- **007 and 008:** 401 `Missing API key`.
- **009:** wrong X-API-KEY → 401 `Invalid API key`. Wrong Bearer → 401 `Missing API key`.
- **010:** 200 `{"items":[]}`.
- **011:** 400 `Missing query parameter`, twice.
- **012:** `KB` → 7 entries, including APOP01-836; shape `object {items}`, paging fields none (Q-008: no paging on this build), the same 23 entry field names.

**Key check — failed send (R5 F-1 proof, fake key):** a throwaway spec, never committed and kept outside `playwright-automation/src` (in the session scratchpad, `leak2/`, with its own config, report and results folders), drove the real `WarrantySearchApiFlow` with a fake 34-character key, read from an environment variable so the key is in no source line, and with the spec's own `test.use({ trace: 'off', screenshot: 'off', video: 'off' })`. It made five sends that get no answer: connection refused (`127.0.0.1:59999`, via `searchListsContract` and via `probeKeyHeaderForms`), DNS failure (`no-such-host.invalid`, via `recordSearch` without a query), connect timeout (`10.255.255.1`), and the 30-second abort (a local server that accepts and never answers). All five failed with the one-line redacted error, as intended. A scan of the whole throwaway folder — `playwright-report/index.html` plus its 2 decoded embedded-zip entries, `test-results/` and the JSON results — found **0 hits** for the fake key and **0 hits** for `X-API-KEY:`. For contrast, the same scan of the reviewer's pre-fix report (`leak/report`) finds `X-API-KEY: <fake key>` in its zip. With `fetch` there is no Playwright API-call step left to record the headers.

**Key check — real runs:** after each of the two real runs, a script scanned for every 12-character piece of the 64-character key (53 pieces) without printing it. It covered `test-results/` (only `.last-run.json`), `playwright-report/` (index.html plus the 2 decoded embedded-zip entries), `csv-report/` (absent), the three source files, this report, the run summary and the throwaway folder. It found **0 hits**. The key was passed only as an environment variable exported inside the run command. The framework's `.env` and the repo-root `/.env` were never printed.

**Leaves behind on Dev:** nothing. Every call is a read-only search.

## Pull request
PR not opened — awaiting R5 (`--review external`: the orchestrator's qa-reviewer reviews the specs next; the PR follows with `--pr-only`).

## Not passing
None.

**Maintenance risks for the reviewer:**
- **The 10-item cap.** The postal code and telephone searches (003–005, 006 A) return exactly 10 entries, the Dev build's cap (O-1), ordered by record number with the highest first. APOP01-836 is 4th. If seven or more new contracts on Dev get the same client postal code or telephone (H7L 0C4, 514-690-6330, or work telephone 124-123-1234), APOP01-836 would drop out of the 10 and these tests would fail even though the search works. This is a real overlap, not a hypothetical one (R5 F-3): the AP-2377 automation, `playwright-automation/src/tests/client/buyOnline_AP2377.spec.ts` (line 31, vehicle postal code `H7L0C4`; lines 42–43, client postal code `H7L0C4` and telephone `5146906330`), uses the same postal code and telephone on Dev and leaves 7 purchase sessions per run. Whether an unpaid purchase session ever becomes a searchable contract is not known; if one does, a single AP-2377 run can push APOP01-836 out of the 10 and 003–005 fail. **Whoever triages a 003–005 failure should first check whether AP-2377 ran on Dev since the last green run.** The assertion's message already names the cap. The fix then is to pick a reference contract whose postal code and telephone are unique on Dev, or, if the API gains paging, to follow the pages.
- **The key expires on 2026-12-05.** After that date, every test that needs the key skips with "BLOCKED by Q-012". AP2435_008 and 009 still run, because they do not use the real key. Store the renewed key in `/.env` as `AVP_ADMIN_API_KEY`.

## Rework round 1 (R5 REWORK, 2026-11-05)
| Finding | Change |
|---|---|
| F-1 (Major) | `AdminWarrantySearchApi.search` now sends with Node's built-in `fetch(url, { headers, signal: AbortSignal.timeout(30_000) })`. The constructor no longer takes an `APIRequestContext`. The `ApiAnswer` shape and the label are unchanged. A failed send throws one new error with no `cause`; its single line holds the label and the name, message and code of the error and of each `cause` in its chain (up to 5 levels), with the key removed from every part. `WarrantySearchApiFlow.open` keeps its signature but opens no request context, and `dispose()` is a no-op, so the spec is unchanged (tests, titles, tags, assertions). Proof: *Key check — failed send* above |
| F-2 (Minor) | The flow's 2xx annotation adds the body's top-level shape and keys, paging field names and entry field names besides `contractNumber` — names only, never values |
| F-3 (Minor) | The maintenance-risk paragraph names the AP-2377 data overlap (`buyOnline_AP2377.spec.ts` lines 31, 42–43; 7 purchase sessions per run) |
