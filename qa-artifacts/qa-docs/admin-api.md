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
