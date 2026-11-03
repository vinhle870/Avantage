# Provider Adapter — OpenProject (`tracker`)

Implements the `tracker` capability group. Bound to a project through
[../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md).

**Tool prefix:** `mcp__openproject__` · **Vocabulary:** work package = ticket, version = sprint

---

## Access rule

1. **Primary** — the OpenProject MCP tools below.
2. **Fallback** — if the server is not connected, or the capability has no MCP tool
   (see *REST-only capabilities*), call the REST API at the registry's `base_url`,
   authenticating with `Authorization: Basic <base64("apikey:<OPENPROJECT_API_KEY>")>`.
   A bare `apikey <token>` header returns **404**, not 401 — always use Basic auth.
3. **Writes** (create, update, comment, status) — route through the
   `tracker-manage-child-ticket` skill so confirmation prompts and logging stay consistent.

Read credentials from the registry's `credentials` setting. If an `openproject` server
is declared in `.mcp.json`, its `env` block holds them:

```powershell
$cfg     = Get-Content ".mcp.json" | ConvertFrom-Json
$apiKey  = $cfg.mcpServers.openproject.env.OPENPROJECT_API_KEY
$baseUrl = $cfg.mcpServers.openproject.env.OPENPROJECT_URL
```

Otherwise read `OPENPROJECT_API_KEY` and `OPENPROJECT_URL` from the environment.

---

## Capability map

| Capability | Implementation | Notes |
|---|---|---|
| `tracker.list_projects` | `list_projects` | Filter on `name_and_identifier`, operator `~` |
| `tracker.list_sprints` | `list_project_versions` | Needs `projectId`. Match the name case-insensitively and trimmed |
| `tracker.list_sprint_tickets` | `list_project_work_packages` | **Not `list_work_packages`** — see *Pitfalls* |
| `tracker.get_ticket` | `get_work_package` | Returns `lockVersion` — required before any update |
| `tracker.search_tickets` | `list_project_work_packages` | `projectId` plus a `subject` filter with operator `~` and a `type` / `status` filter. One search word per call is the most reliable; merge the results |
| `tracker.create_ticket` | `create_work_package` | Needs `projectId`; pass `parentId` for a child |
| `tracker.update_ticket` | `update_work_package` | Must carry the `lockVersion` from a fresh `get` |
| `tracker.set_status` | `update_work_package` with `statusId` | Same `lockVersion` rule |
| `tracker.assign` | `update_work_package` with `assigneeId` | Same `lockVersion` rule; resolve the user with `tracker.resolve_user` first |
| `tracker.get_history` | **REST only** | `GET /api/v3/work_packages/{id}/activities` — read the `details` of each activity |
| `tracker.resolve_user` | `list_users` | Match by display name. Never guess a user ID |
| `tracker.add_comment` | **REST only** | `POST /api/v3/work_packages/{id}/activities` |
| `tracker.attach_file` | **REST only** | Multipart upload |

**Ticket URL:** `{base_url}/work_packages/{id}`

---

## Vocabulary map

Skills speak the canonical vocabulary defined in
[../mcp-tools.md](../mcp-tools.md). This table translates it. Names are for humans —
always send the ID.

### `tracker.type`

| Canonical | ID | OpenProject name |
|---|---|---|
| `task` | 1 | Task |
| `story` | 6 | User story |
| `bug` | 7 | Bug |
| `subtask` | 8 | Sub-Task |

### `tracker.status`

| Canonical | ID | OpenProject name | Closed? |
|---|---|---|---|
| `todo` | 1 | To Do | No |
| `in_progress` | 7 | In progress | No |
| `blocked` | 15 | Blocked | No |
| `dev_done` | 16 | Dev Completed | No |
| `fixing` | 18 | Fixing | No |
| `in_review` | 19 | In Review | No |
| `ready_for_qa` | 20 | Ready for QA | No |
| `qa_done` | 26 | QA Completed | No |
| `ready_for_uat` | 21 | Ready for UAT | No |
| `uat_done` | 27 | UAT Completed | No |
| `done` | 17 | Done | Yes |
| `closed` | 12 | Closed | Yes |

OpenProject enforces workflow transition rules per type and per role. If a transition
is rejected, report the error and suggest the user change it in the OpenProject UI or
ask someone with the right role — never retry silently.

### `tracker.priority`

| Canonical | ID | OpenProject name |
|---|---|---|
| `low` | 7 | Low |
| `normal` | 8 | Normal *(default)* |
| `high` | 9 | High |
| `immediate` | 10 | Immediate |

---

## Pitfalls

- Use `list_project_work_packages` with `projectId` plus a `version` filter. Calling
  `list_work_packages` with a combined project and version filter raises `InvalidQuery`.
- Page size caps at 50. If the response `total` exceeds the page size, repeat the call
  with an increasing offset until every ticket is fetched.
- `projectId` and `versionId` are not top-level fields on a work package — extract the
  numeric segment from `_links.project.href` and `_links.version.href`.
- `estimatedTime` is ISO 8601: `PT8H` becomes `8h`, `PT4H30M` becomes `4h 30m`.
- Comments cannot be deleted through the API. Always confirm the text with the user
  before posting.

---

## REST recipes

Use these only for the REST-only capabilities above.

### `tracker.add_comment`

Preferred — the helper script, which reads credentials itself:

```bash
node .claude/skills/providers/resources/openproject-add-wp-comment.mjs <ticket_id> <file.md>
```

Or directly:

```powershell
$auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("apikey:$apiKey"))
$body = @{ comment = @{ raw = "<markdown text>" } } | ConvertTo-Json -Depth 3
Invoke-RestMethod -Uri "$baseUrl/api/v3/work_packages/<id>/activities" `
  -Method POST -Body $body `
  -Headers @{ Authorization = "Basic $auth"; "Content-Type" = "application/json" }
```

> `PATCH /work_packages/{id}` with a `comment` field returns 200 but does **not**
> create an Activity comment. Always POST to `/activities`.

### `tracker.attach_file` — single multipart call

Preferred for screenshot evidence. Write the script to the scratchpad directory and
run it from there.

```powershell
$creds     = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("apikey:$apiKey"))
$fileName  = [IO.Path]::GetFileName($filePath)
$fileBytes = [IO.File]::ReadAllBytes($filePath)
$boundary  = "----FormBoundary" + [Guid]::NewGuid().ToString("N")
$enc  = [Text.Encoding]::UTF8
$CRLF = [char]13 + [string][char]10
$ms   = [IO.MemoryStream]::new()
$p1 = $enc.GetBytes("--$boundary$CRLF" + "Content-Disposition: form-data; name=" + '"metadata"' + "$CRLF" + "Content-Type: application/json$CRLF$CRLF" + "{""fileName"":""$fileName""}$CRLF")
$ms.Write($p1, 0, $p1.Length)
$p2 = $enc.GetBytes("--$boundary$CRLF" + "Content-Disposition: form-data; name=" + '"file"' + "; filename=" + """$fileName""" + "$CRLF" + "Content-Type: image/png$CRLF$CRLF")
$ms.Write($p2, 0, $p2.Length)
$ms.Write($fileBytes, 0, $fileBytes.Length)
$p3 = $enc.GetBytes("$CRLF--$boundary--$CRLF")
$ms.Write($p3, 0, $p3.Length)
$result = Invoke-RestMethod -Uri "$baseUrl/api/v3/work_packages/$wpId/attachments" `
  -Method POST -Headers @{ Authorization = "Basic $creds" } `
  -ContentType "multipart/form-data; boundary=$boundary" `
  -Body $ms.ToArray() -ErrorAction Stop
Write-Output "Uploaded: id=$($result.id) file=$($result.fileName)"
```

Record the returned attachment ID in the bug report's Evidence table.

### `tracker.attach_file` — three-step prepared upload

Use this when the single multipart call is rejected, for example on a large file.

```powershell
# 1 - prepare: get a pre-signed upload URL
$h = @{ Authorization = "Basic $creds" }
$prepare = Invoke-RestMethod -Uri "$baseUrl/api/v3/work_packages/$wpId/attachments/prepare" `
  -Method POST -Headers $h -ContentType "application/json" `
  -Body '{"fileName":"TC-001-fail-step3.png","fileSize":12345}'

# 2 - upload the file bytes
Invoke-RestMethod -Uri $prepare._links.uploadUrl.href -Method PUT `
  -InFile $filePath -ContentType "image/png"

# 3 - finalise: link the attachment to the work package
$finish = '{"_links":{"addAttachment":{"href":"/api/v3/attachments/' + $prepare.id + '"}}}'
Invoke-RestMethod -Uri "$baseUrl/api/v3/work_packages/$wpId/attachments" `
  -Method POST -Headers $h -ContentType "application/json" -Body $finish
```

Supported MIME types: `image/png`, `image/jpeg`, `image/gif`, `application/pdf`.

### Embedding an already-hosted image instead

If the screenshot is reachable at a URL — a CI artifact or an internal server — skip
the upload and embed it in the `description` markdown:
`![Screenshot](https://your-server.com/screenshots/TC-001-fail-step3.png)`.

| Situation | Method |
|---|---|
| Screenshot is already at a URL | Embed it in the description |
| Screenshot is a local file | Multipart upload |
| Several screenshots | Repeat the upload per file, or embed several URLs |

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| No `mcp__openproject__*` tools | Server not declared in `.mcp.json`, or not approved on this machine | Use the REST fallback and tell the user the server is missing |
| **404** on a write | `apikey <token>` sent as a bare header | Use `Authorization: Basic <base64("apikey:<token>")>` |
| **409** on an update | Stale `lockVersion` | Re-run `get_work_package`, retry with the fresh value |
| `InvalidQuery` listing sprint tickets | Used `list_work_packages` with project + version | Use `list_project_work_packages` with `projectId` |
| A status change is rejected | The workflow forbids that transition for this type or role | Report it and ask the user to change it in the UI |
| Comment posts but is invisible | Used `PATCH` instead of `POST /activities` | Use the recipe above |

---

## Declaring the server

When an OpenProject MCP package is available, add it to `.mcp.json` and keep the key
in the environment rather than committing it:

```json
"openproject": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "<openproject-mcp-package>"],
  "env": {
    "OPENPROJECT_URL": "https://op.bigin.vn",
    "OPENPROJECT_API_KEY": "<token>"
  }
}
```

Then set `server_declared_in_mcp_json: yes` in the registry.

---

## Resources

- Comment helper: [resources/openproject-add-wp-comment.mjs](resources/openproject-add-wp-comment.mjs)
