# Provider Adapter — Jira (`tracker`)

Implements the `tracker` capability group. Bound to a project through
[../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md).

**Access:** `tools/jira-cli` (the `jira-cli` binary via its project wrapper) ·
**Vocabulary:** issue = ticket, sprint = sprint

---

## Access rule

1. **The CLI is the only supported path.** Every capability below is a shell call to
   the project wrapper:

   - Git Bash / WSL — `./tools/jira-cli/jira.sh <args>`
   - PowerShell — `./tools/jira-cli/jira.ps1 <args>`

   The wrapper reads the repo-root `.env`, syncs `tools/jira-cli/config.yml` to match,
   and points the binary at that config — never the global `~/.config/.jira/`. Call the
   wrapper, **never `jira.exe` directly**: invoking the binary yourself picks up the
   wrong config and the wrong project.

2. **Do not use the Jira MCP server.** `mcp__jira__*` and
   `mcp__claude_ai_Atlassian_Rovo__*` are **not** the binding for this project. The
   recorded MCP `cloud_id` points at a different Atlassian tenant
   (`oneplanet-solutions`) where this project's keys do not resolve. If a skill finds
   those tools present, ignore them and use the CLI.

3. **Preflight.** Before the first real call, run `./tools/jira-cli/jira.sh me`. It
   prints the authenticated account on success. If it fails, stop and tell the user to
   fill in the repo-root `.env` (copy `tools/jira-cli/.env.example`) — then **stop**.
   Never ask them for a token in chat, and never report the operation as done.

4. **Credentials.** `JIRA_SITE_URL`, `JIRA_PROJECT`, `JIRA_LOGIN` and
   `JIRA_API_TOKEN` live only in the gitignored repo-root `.env`. Never echo
   `JIRA_API_TOKEN`, and never paste it into a command line that gets logged.

---

## Capability map

`$K` = issue key (`AP-2436`). `$P` = project key from the registry's
`default_project`. Add `--plain --no-headers` to any list for parseable output, or
`--raw` for JSON.

| Capability | Command | Notes |
|---|---|---|
| `tracker.list_projects` | `jira.sh project list` | No `--plain` flag on this subcommand — output is already tab-separated |
| `tracker.list_sprints` | `jira.sh sprint list --table --plain --state active,closed,future` | Needs a **board**. Returns "No result found" for a classic project without one — fall back to JQL on the `sprint` field and say the board is missing |
| `tracker.list_sprint_tickets` | `jira.sh sprint list <SPRINT_ID> --plain` | Or `jira.sh issue list -q 'sprint = "<name>"' --plain` |
| `tracker.get_ticket` | `jira.sh issue view $K --plain` | Add `--comments N` for comments. Takes a key, not a number |
| `tracker.search_tickets` | `jira.sh issue list -q '<JQL>' --plain --no-headers --no-truncate --columns key,status,summary` | Duplicate check JQL (the wrapper already scopes to `$P`): `type = Bug AND statusCategory != Done AND text ~ "<3-5 words>"`. Escape double quotes inside the words. Verified on AP 2026-10-03. QA orchestrator selection, each followed by ` AND issuetype in (Story, Bug, Task)`: default `(status = "QC" OR assignee = currentUser()) AND statusCategory != Done` · `--mine` `assignee = currentUser() AND statusCategory != Done` · `--status-only` `status = "QC"`. Verified on AP 2026-10-31 — 26 tickets; without the type clause ~100, mostly Xray tests. `currentUser()` is `$JIRA_LOGIN`, the `qa_account`. No `ORDER BY` (see the `-q` pitfall). Add `--paginate 0:100` and page on while 100 come back |
| `tracker.list_tickets` | `jira.sh issue list -p $P --plain --no-headers --columns key,status,summary` | Filters: `-s`, `-t`, `-y`, `-a`, `-l`, `--created`, `--updated` |
| `tracker.create_ticket` | `jira.sh issue create -t Bug -s "<summary>" -b "<body>" -y High -l qa-agent --no-input` | `--no-input` is **required** in an agent context, else it prompts and hangs. `-P $PARENT` for a sub-task |
| `tracker.update_ticket` | `jira.sh issue edit $K -s "<summary>" -b "<body>" --no-input` | `-l` **appends** labels; `-C` **replaces** components |
| `tracker.set_status` | `jira.sh issue move $K "<status name>"` | Takes the **target status name**, not a transition ID — the CLI resolves the transition. Unreachable status = error; report it |
| `tracker.get_history` | **REST** — `GET $SITE/rest/api/2/issue/$K?expand=changelog&fields=summary` | Read `changelog.histories[].items[]` where `field` is `assignee` or `status`; same `.env` parse helper as `attach_file` |
| `tracker.assign` | `jira.sh issue assign $K "<email or display name>"` | `x` unassigns, `default` assigns the default |
| `tracker.add_comment` | `jira.sh issue comment add $K "<body>"` | Or `-T <file>` to read the body from a file — prefer that for multi-line or accented text |
| `tracker.attach_file` | **REST, not the CLI** — see below | `jira-cli` has **no `attach` subcommand** |
| `tracker.link` | `jira.sh issue link $K $K2 <link-type>` | `jira.sh issue link --help` lists the types |

**Ticket URL:** `$JIRA_SITE_URL/browse/$K`, e.g.
`https://garantieavantageplus.atlassian.net/browse/AP-2436`. `jira.sh open $K` opens it
in a browser.

---

## `tracker.attach_file` — the REST fallback

`jira-cli` cannot attach files, so this one capability bypasses it. Two steps, both
against the REST API with the same `.env` credentials.

**Read the credentials by parsing `.env`, not by sourcing it.** `.env` values may carry
a leading space or CRLF, and `source .env` breaks on comment lines. Use a small
parse helper that strips `\r`, surrounding whitespace and surrounding quotes from the
value of one key, e.g. a `sed`-based `getv JIRA_LOGIN`.

**1. Upload.** `X-Atlassian-Token: no-check` is mandatory:

```bash
curl -s -u "$LOGIN:$TOK" -X POST -H "X-Atlassian-Token: no-check" \
  -F "file=@<path>" "$SITE/rest/api/3/issue/$K/attachments"
```

**2. Comment referencing it — via API v2, with wiki markup:**

```bash
curl -s -u "$LOGIN:$TOK" -X POST -H "Content-Type: application/json" \
  --data '{"body":"<note>\n\n!<filename>|thumbnail!"}' \
  "$SITE/rest/api/2/issue/$K/comment"
```

Jira converts `!filename!` into a real inline image. **Do not hand-build a v3 ADF
`media` node** — it is rejected with `ATTACHMENT_VALIDATION_ERROR` because the media
`collection` UUID is not knowable from the attachment response.

Verify by re-reading the comment through `/rest/api/3/issue/$K/comment/<id>` and
confirming a `mediaSingle` node is present. If the upload succeeded but the comment did
not, say so — do not claim the screenshot is attached.

> **For a bug ticket, evidence belongs in the description, not a comment.** The comment
> recipe above stays for non-bug evidence and for ad-hoc notes. See the next two sections.

---

## Description format

Jira has two body formats and they are not interchangeable:

| API | Description format | Use it for |
|---|---|---|
| **v2** — `/rest/api/2/issue/$K` | **wiki markup**, a plain string | Reading and writing a description as text. **This is the one to use.** |
| v3 — `/rest/api/3/issue/$K` | ADF, a nested JSON document | Reading back to *verify* what rendered. Do not hand-build it |

Wiki markup a skill will actually need:

| Intent | Markup |
|---|---|
| Heading | `h2. Title` · `h3. Subheading` |
| Bold | `*bold*` |
| Numbered list | `# item` (one `#` per line) |
| Bullet list | `* item` |
| Horizontal rule | `----` |
| Inline image | `!filename.png|thumbnail!` |
| Table | header `||TC ID||Status||`, each row `|AP2473_001|PASS|` — one line per row |
| Literal dollar sign in a shell heredoc | escape as `\$` or the shell eats it |

**`jira.sh issue create -b/-T` and `issue edit -b` do NOT take wiki markup.** The CLI
treats the body as Markdown and converts it to ADF: a wiki numbered item `# step` becomes
an `h1` heading, `*bold*` becomes italic, and `(`, `-`, `_` get backslash-escaped
(observed on AP-2488..2490, 2026-10-06). Create the issue with a one-line placeholder
body, then write the real description through the **v2 REST API** (`PUT
/rest/api/2/issue/$K` with `{"fields":{"description":"<wiki markup>"}}`), and verify via
v3 that the ADF has `orderedList` nodes and no stray `heading` level 1.

---

## Embedding an attachment in a description

The recipe `tracker-manage-child-ticket` uses for bug evidence. **Verified working on
this project 2026-09-06.**

**An image cannot be referenced before it exists**, so the order is fixed: create, then
attach, then rewrite the description. There is no way to do it in one call.

**1. Create the issue** with the description ending in an `h3. Evidence` heading and
nothing under it.

**2. Attach each screenshot** using the upload call in the previous section. Keep the
`filename` each response returns — that string, not the local path, is what the markup
references.

**3. Read the current description back as wiki markup, append the images, and PUT it:**

```bash
cur=$(curl -s -u "$LOGIN:$TOK" "$SITE/rest/api/2/issue/$K?fields=description" \
  | python -c "import json,sys;print(json.load(sys.stdin)['fields']['description'] or '')")

new="$cur

<caption line saying what the image shows>

!<filename>|thumbnail!"

python -c "import json,sys;print(json.dumps({'fields':{'description':sys.argv[1]}}))" "$new" \
  | curl -s -o /dev/null -w '%{http_code}' -u "$LOGIN:$TOK" -X PUT \
      -H "Content-Type: application/json" --data-binary @- "$SITE/rest/api/2/issue/$K"
```

A successful PUT returns **204** with an empty body — not 200, and not a JSON payload.

**4. Verify it rendered.** A 204 only means the string was stored; it does not mean Jira
resolved the filename to a real image. Read the description back through **v3** and
confirm `media` nodes are present with a resolved `attrs.id`:

```bash
curl -s -u "$LOGIN:$TOK" "$SITE/rest/api/3/issue/$K?fields=description" | python -c "
import json,sys
def walk(n,acc):
    if isinstance(n,dict):
        if n.get('type')=='media': acc.append(n.get('attrs',{}).get('id',''))
        for v in n.values(): walk(v,acc)
    elif isinstance(n,list):
        for v in n: walk(v,acc)
    return acc
print(walk(json.load(sys.stdin)['fields']['description'],[]))"
```

An empty list, or a `media` node with no `id`, means the filename did not resolve —
usually a typo, or the attachment was never uploaded. **Report that; never claim the
evidence is embedded when the check comes back empty.**

**Pass the body through a file or stdin, never inline on the command line.** Bug
descriptions carry newlines, accented characters and dollar signs, all of which a shell
will mangle.

---

## Reading output

Three formats, in order of preference for a skill:

- **`--raw`** — JSON. Values nest under `fields`: `.key`, `.fields.summary`,
  `.fields.status.name`, `.fields.issuetype.name`, `.fields.priority.name`. Reading
  `.status` instead of `.fields.status.name` yields nothing.
- **`--plain --no-headers`** — tab-separated rows. Set `--columns` explicitly; add
  `--no-truncate` or long summaries are cut. `--delimiter` changes the separator.
- **Default (interactive TUI)** — never use in a skill; it expects a terminal.

---

## Vocabulary map

Skills speak the canonical vocabulary defined in [../mcp-tools.md](../mcp-tools.md).
Jira takes **names**, not numeric IDs.

### `tracker.type`

Issue types are configured per project. Confirm the project's real type set before
creating rather than assuming this table.

| Canonical | Jira issue type |
|---|---|
| `task` | Task |
| `story` | Story |
| `bug` | Bug |
| `subtask` | Sub-task |

### `tracker.status`

Jira workflows are per-project, so **this table is a starting point, not authority**.
`jira.sh issue move` accepts a status name and resolves the transition itself; if it
rejects the name, show the user the ticket's current status and ask.

Statuses observed on **AP** (Avantage Plus):

| Canonical | AP status |
|---|---|
| `todo` | Backlog |
| `in_progress` | In Progress |
| `ready_for_qa` | QC |
| `done` | Done |

Gaps to report rather than paper over: **`blocked`, `in_review`, `dev_done`,
`ready_for_uat`, `qa_done`, `uat_done`, `closed`** have no confirmed AP equivalent.
Tell the user instead of mapping to the nearest status.

### `tracker.priority`

| Canonical | Jira priority |
|---|---|
| `low` | Low |
| `normal` | Medium |
| `high` | High |
| `immediate` | Highest |

---

## Ticket conventions

When a skill files a bug through this adapter:

- Project key from the registry's `default_project` setting (`AP`).
- Issue type `Bug`.
- Summary `[BUG-XXX][TC ID] — <short title>`.
- Priority mapped from severity via the canonical table in `mcp-tools.md`.
- Labels `qa-agent` and `stlc-automated`.

---

## Pitfalls

- **`--no-input` on every write.** `issue create` and `issue edit` prompt for optional
  fields and open an editor without it — in an agent context that hangs the call.
- **`-q/--jql` runs inside a project context, so the CLI adds its own `project =`
  clause.** Passing `-q "project = AP ORDER BY created DESC"` produces malformed JQL
  and a `400`. Either use `-p AP` with the filter flags, or give `-q` a fragment with
  no `project` clause: `-q 'sprint = "Sprint 08/06/2026"'`.
- **JQL string values must be quoted**, and the quoting must survive the shell:
  `-q 'sprint = "Sprint 08/06/2026"'`.
- **Jira identifies issues by key** (`AP-2436`), never a bare number. A skill that
  stores `2436` will not round-trip — and a wrong number returns a `404` phrased as
  *"Issue does not exist or you do not have permission to see it"*, which looks like a
  permission problem but usually is not.
- **`project list` rejects `--plain`.** Several subcommands accept only a subset of the
  global output flags; check `--help` rather than assuming.
- **`sprint list` needs a board.** A classic project without one returns "No result
  found" even though the project has issues.
- **`issue edit -l` appends labels but `-C` replaces components.** Read before writing
  if you need to preserve either.
- **No stale-write protection.** `issue edit` silently overwrites a concurrent edit —
  re-read immediately before writing.
- **Leading whitespace in `.env`.** The wrapper trims it; your own `curl` calls do not.
  Parse and trim, as above.
- The wrapper prints `note: config.yml <key> -> <value>` to **stderr** when it syncs.
  That is normal, not an error — do not treat stderr output as failure.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `jira.exe not found` | Binary not installed | `powershell -ExecutionPolicy Bypass -File tools/jira-cli/install.ps1` |
| `JIRA_API_TOKEN is not set` | No repo-root `.env` | Copy `tools/jira-cli/.env.example` to `/.env` and fill it in |
| `401` / `me` fails | Wrong token type, or token not owned by `JIRA_LOGIN` | Create an **unscoped** token ("Create API token", not "with scopes") on the account in `JIRA_LOGIN` |
| `404 Issue does not exist or you do not have permission` | Wrong key, or a bare number instead of a key | Confirm the key; probe with `issue view` before writing |
| `400 Error in the JQL Query` | `-q` given a full query including `project =` / `ORDER BY` | See the `-q` pitfall above |
| Command hangs with no output | Interactive prompt or TUI | Add `--no-input`, and `--plain` for lists |
| Every status/type reads as empty | Read the JSON top level instead of `fields` | See *Reading output* |
| `unknown flag: --plain` | Subcommand does not accept it | Check `--help` for that subcommand |
| Sprint list empty on a project with issues | No board attached | Fall back to JQL on `sprint`; say the board is missing |
| `ATTACHMENT_VALIDATION_ERROR` on a comment | Hand-built v3 ADF `media` node | Post `!filename!` wiki markup to `/rest/api/2/.../comment` |
| Cannot attach via the CLI | No `attach` subcommand exists | Use the REST fallback above |
