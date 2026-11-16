# Admin API — Garantie Avantage Plus

Source: the OpenAPI 3 spec published by NelmioApiDocBundle at `/api/doc` (UI) and
`/api/doc.json` (raw). Read 2026-11-03 from staging; the dev spec is identical for the
endpoints below (24 paths on both). Raw copy:
[api/openapi_staging_2026-11-03.json](api/openapi_staging_2026-11-03.json).

Used by: AP-2434 (create warranty notes), AP-2435 (warranty search).

---

## 1. Hosts

| Environment | Base URL | Spec |
|---|---|---|
| Dev (batch default since 2026-11-01) | `https://v2dev.garantieavantageplus.ca` | `/api/doc` |
| Staging | `https://v2staging.garantieavantageplus.ca` | `/api/doc` |

The API is served from the portal host itself — there is no separate API host.

## 2. Authentication — two schemes

| Endpoints | Scheme | How to send it |
|---|---|---|
| Every `/api/admin/*` endpoint (13) | **Admin API key** | Header `X-API-KEY: <key>` |
| All other endpoints (`/api/{accountId}/…`, `/api/make`, `/api/check-contract`, `/api/dyr/…`, `/api/accounts`) | **Bearer JWT** | `Authorization: Bearer <jwt>` — obtained from `POST /api/user/authenticate`, renewed with `POST /api/user/refresh-token` |

The spec declares Bearer as the global default, but each `/api/admin/*` operation
declares a required `X-API-KEY` header. **The admin API uses `X-API-KEY`, not
`Authorization: Bearer`.** This settles the contradiction in AP-2435 (text says Bearer,
example uses `X-API-KEY`): the spec agrees with the example.

Observed 2026-11-03: `GET /api/admin/search-warranty` with no key returns **401** on both
dev and staging — the endpoint exists and is protected.

### Where the key comes from

- The Admin Portal has a **"Manage API keys"** page at `/admin/api-keys` (seen on staging
  2026-10-02; not yet verified on dev). A key is environment-specific — a staging key is
  not expected to work on dev.
- Store it in the repo-root `/.env` (git-ignored) as **`AVP_ADMIN_API_KEY`**. Never write
  the value into any artifact, log or comment.
- Creating a key is the QA's decision — no skill creates one.
- **Dev key in use (2026-11-05):** app name `QA-automation` on v2dev, created by the QA
  account with the QA's approval, **expires 2026-12-05**. Stored in `/.env` as
  `AVP_ADMIN_API_KEY`. Checked: `GET /api/admin/search-warranty` returns 401 without it
  and 400 (authenticated, parameters missing) with it. After it expires, create a new
  one the same way.
- How keys work (AP-2308, Done): Admin menu **Apps → Manage API keys** (between USERS and
  REPORTS). **Create a key** opens a modal with *App name* and *Expires in* (30 days,
  1 year, never). The key is `bin2hex(random_bytes(32))` — 64 hex characters, shown
  hidden in the grid with a reveal button. Each key belongs to the admin account that
  created it and can be deleted from the grid.

## 3. Endpoints in scope

### 3.1 `POST /api/admin/warranty-notes` — create a note on a warranty contract (AP-2434)

| | |
|---|---|
| Auth | `X-API-KEY` (required) |
| Body | `multipart/form-data` |
| Required fields | `warranty_id` (string), `title` (string), `description` (string) |
| Optional fields | `is_public` (boolean, `true`/`false`), `file` (binary — a PDF) |
| 201 | `{ "success": true, "noteId": 123, "message": "Warranty note created successfully" }` |
| 400 | Invalid request |
| 401 | Unauthorized (missing / wrong key) |
| 404 | Warranty contract not found |

Not stated by the spec: maximum lengths, whether `warranty_id` is the record id or the
contract number, the allowed file size, or what `is_public` changes in the UI. These stay
open questions for AP-2434 (record, don't guess).

**Observed on Dev, 2026-11-05 (AP-2434 run, warranty contract 827):**

| Call | Result |
|---|---|
| `POST /api/admin/warranty/-notes` (the path as the AP-2434 ticket writes it) | **405 Method Not Allowed**, `Allow: GET` — no POST route there |
| Valid key, all fields | **201** `{"success":true,"noteId":<n>,"message":"Warranty note created successfully"}` |
| No `X-API-KEY` header | **401** `{"error":"Missing API key"}` |
| Wrong key (last character changed) | **401** `{"error":"Invalid API key"}` |
| `warranty_id` or `title` left out | **400** `{"success":false,"error":"Missing required fields: warranty_id, title, description"}` — the same message whichever field is missing |
| `warranty_id` that does not exist (`999`) | **404** `{"success":false,"error":"Warranty contract not found"}` |
| `is_public=maybe` | **500 Internal Server Error** (reproduced twice) |
| `warranty_id` | The record id from `/admin/warranty/{id}` (e.g. `827`) is accepted; the contract number (`APOP01-827`) was not tried |
| `file_content` (the ticket's HTML body field) | Accepted without error at 255, 256 and 2,000 characters, but **not stored or shown anywhere** — the note keeps only title, description, is_public (and an optional file) |
| Admin display | Note appears on `/admin/warranty/{id}` with title, description, Public/Private badge, "Created by <the admin who owns the key>" and local time |

### 3.2 `GET /api/admin/search-warranty` — search warranty contracts (AP-2435)

| | |
|---|---|
| Auth | `X-API-KEY` (required) |
| Query | `query` (required) — a **VIN (partial match)**, a **postal code (full match)** or a **telephone (full match)**. Example `5149779847` |
| 200 | `{ "items": [ { "contractNumber": "CVE-815" }, … ] }` |
| 400 | Missing `query` parameter |
| 401 | Missing / invalid / expired API key |

The response is an **object with an `items` array**, not a bare array — this settles the
second AP-2435 contradiction. The spec lists only `contractNumber` per item; any other
field in a real response is extra (record it). No paging or result-limit field is
documented.

**Observed on Dev, 2026-11-05 (AP-2435 run, reference contract APOP01-836 — record 836, VIN `BKVG64C7AKB4145G5`, postal `H7L 0C4`, tel home `5146906330`, tel work `124-123-1234`):**

| Call | Result |
|---|---|
| `X-API-KEY: <key>` | **200** `{"items":[…]}` |
| `Authorization: Bearer <key>` (real or wrong key), no `X-API-KEY` | **401** `{"error":"Missing API key"}` — the Bearer header is not read |
| No key | **401** `{"error":"Missing API key"}` — also from a browser holding an admin portal session |
| Wrong `X-API-KEY` | **401** `{"error":"Invalid API key"}` |
| `query=` empty, or no `query` | **400** `{"success":false,"error":"Missing query parameter"}` |
| No match (`ZZQA2435NOMATCH`) | **200** `{"items":[]}` |
| VIN | Partial, case-insensitive (`C7AKB4`, `c7akb4`, `KB` all match) |
| Postal code | Full match, spaces and letter case ignored (`H7L0C4`, `H7L 0C4`, `h7l0c4` match; `H7L` does not) |
| Telephone | Full match on **tel home and tel work**; spaces, dots, parentheses and hyphens ignored; a `+1` prefix or a 6-digit part does not match |
| Item fields | 24 per item: `contractNumber`, `date_start`, `vehicle_make`, `vehicle_model`, `vehicle_year`, `vehicle_vin`, `vehicle_kilometers`, `vehicle_price`, `client_email`, `client_last_name`, `client_first_name`, `client_company`, `client_address`, `client_address2`, `client_city`, `client_postal_code`, `client_tel_home`, `client_tel_work`, `term_months`, `term_km`, `franchise_amount`, `repair_amount_per_visit`, `repair_amount_total`, `sale_price` |
| Result size | **At most 10 items**, ordered by record number, highest first (not by date — corrected 2026-11-05 after AP-2435 R3), no `total`/paging field (`query=1`, `query=A` → 10); matching contracts beyond the 10th are dropped |
| Contract numbers | Prefixes seen: `APOP01`, `APAP OP3` (contains a space), `ATplus`, `AT`, `AVLmoto`, `CVE`, `VATP`, `26df1` |
| Response time | 0.6–1.0 s per call |

## 4. Running the requests safely (Git Bash)

Load only the one variable, never print it, stop if it is empty, and always save the
status line:

```bash
KEY=$(sed -n 's/^AVP_ADMIN_API_KEY=//p' .env | tr -d '\r' | sed 's/^"//;s/"$//')
[ -n "$KEY" ] || { echo "AVP_ADMIN_API_KEY missing"; exit 1; }
BASE=https://v2dev.garantieavantageplus.ca

# Search (AP-2435)
curl -sS -i --max-time 30 -H "X-API-KEY: $KEY" -H "Accept: application/json" \
  --get --data-urlencode "query=1FAHP35NX8W239204" "$BASE/api/admin/search-warranty"

# Create a note (AP-2434) — --form-string, NOT -F, so values starting with "<" or "@"
# are sent as text instead of being read as a local file
curl -sS -i --max-time 30 -H "X-API-KEY: $KEY" -H "Accept: application/json" \
  --form-string "warranty_id=<id>" --form-string "title=QA-AP2434-<stamp>" \
  --form-string "description=<p>QA note</p>" --form-string "is_public=true" \
  "$BASE/api/admin/warranty-notes"
```

A request counts as sent only if curl exits 0 and the output starts with `HTTP/`. Before
saving a response as evidence, remove any occurrence of the key from it.

## 5. Other admin endpoints (not in scope yet)

`POST /api/admin/claim`, `PUT /api/admin/claim/{claimId}`, `GET /api/admin/claim/{id}`,
`POST /api/admin/claim-note`, `POST /api/admin/claim-attachment`,
`GET /api/admin/claim-attachment/download/{attachmentId}`,
`GET /api/admin/claim-item-components`, `GET /api/admin/warranty/{fullId}/claims`,
`GET /api/admin/warranty-pdf/{fullId}/{lang}`, `GET /api/admin/users`,
`GET /api/admin/service-centers` — all `X-API-KEY`. See the raw spec for their fields.

## 6. Claim endpoints on Dev — observed 2026-11-15 (AP-2374)

| Call | Observed |
|---|---|
| `POST /api/admin/claim` without `items` | **400** `{"success":false,"error":"Invalid items format. Expected JSON array."}` — send `"items":[]` |
| `POST /api/admin/claim` with `contractNumber`, `diagnostic`, `vehicleKmAtClaim`, `notifyEmail`, `items:[]` | **201** `{"success":true,"claimId":333,"assignedTo":null,"message":"Claim created successfully"}` |
| `GET /api/admin/claim/{id}` | **200**, includes `notifyEmail`, `statusCode` (`submitted` on create), `contractNumber`, `warrantyContractId` |
| `POST /api/admin/claim-attachment` (multipart `claimId`, `type=other`, `file` PNG) | **500** "Failed to upload attachment: Unable to create the …/uploads/claim_attachments/ directory." |
