# Project Tool Registry

**Owned by the QA on this project — not by the skill framework.**

Every skill that touches a tracker, a browser, or a notification channel reads this
file *first* to decide which provider to call. Skills never name a provider
themselves; they name a **capability** (`tracker.get_ticket`) and let this table
resolve it to a real tool.

To move this project onto a different tracker, change the `tracker` row below. No
skill file changes.

---

## 1. Bindings

| Capability group | Provider | Access | Adapter | State |
|---|---|---|---|---|
| `tracker` | `jira` | `tools/jira-cli/jira.sh` / `jira.ps1` (CLI) | [../../.claude/skills/providers/jira.md](../../.claude/skills/providers/jira.md) | active |
| `browser` | `playwright` | `mcp__playwright__*` | [../../.claude/skills/providers/playwright.md](../../.claude/skills/providers/playwright.md) | active |
| `notify` | `none` | — | — | disabled |
| `vcs` | `github` | `git` + `tools/gh-cli/gh.sh` (project-scoped `gh`) | [../../.claude/skills/providers/github.md](../../.claude/skills/providers/github.md) | active |

**`State` values:** `active` (use it), `disabled` (skip the step and say so — not a
failure), `unbound` (no provider chosen yet — ask the user before doing anything).

A capability group missing from this table is `unbound`.

---

## 2. `tracker` settings — `jira`

**The connection is not configured here.** `site_url`, the project key and the
credential all live in the gitignored repo-root `.env`, which is the single source of
truth. This table names the variables; it never holds their values.

| Setting | Where it comes from |
|---|---|
| `site_url` | `$JIRA_SITE_URL` in `/.env` |
| `default_project` | `$JIRA_PROJECT` in `/.env` |
| `login` | `$JIRA_LOGIN` in `/.env` — the Atlassian account that owns the token |
| `credentials` | `$JIRA_API_TOKEN` in `/.env` — unscoped Atlassian API token, never committed |
| `cloud_id` | not used — the CLI authenticates with `login` + `credentials`; see below |

Copy `tools/jira-cli/.env.example` to `/.env` and fill it in. Nothing else needs editing
when the site changes.

### Access paths

| Path | Status | How it reads the settings |
|---|---|---|
| **CLI** — `tools/jira-cli/jira.sh` / `jira.ps1` | **the binding** | reads `/.env` and syncs `tools/jira-cli/config.yml` to match on every run |
| MCP — `mcp__jira__*`, `mcp__claude_ai_Atlassian_Rovo__*` | **do not use** | wrong tenant — see below |

> **⚠️ The `tracker` capability resolves to the CLI, not to MCP.**
> Every `tracker.*` capability is a shell call to the wrapper. Verified working against
> `garantieavantageplus.atlassian.net` — `jira.sh me`, `project list` and `issue view`
> all succeed with the `/.env` credentials.
>
> The Jira **MCP** servers are deliberately unbound. The recorded `cloud_id`
> `4c5bb3d9-030c-4db4-a255-7d498b228706` belongs to `oneplanet-solutions.atlassian.net`,
> where only `BAION` and `PM` are visible and this project's keys do not resolve. If a
> session happens to have `mcp__jira__*` or `mcp__claude_ai_Atlassian_Rovo__*` tools
> present, **ignore them and use the CLI.**
>
> One capability is the exception: **`tracker.attach_file` has no CLI command** and goes
> through the Jira REST API with the same `/.env` credentials. The adapter documents the
> two-step recipe.

### QA outcome rules

What `stlc-ticket-pipeline` does to a ticket when a run ends (its s7 stage). Status
values are **this project's own names** — the CLI moves by name. Change this table, not
the skill, when the workflow changes.

| Setting | Value |
|---|---|
| `story_pass_threshold` | 90 — percent of test cases PASS, over all cases except `SKIPPED` |
| `story_pass_status` | `Ready for release` |
| `story_pass_assign` | `Ken Nguyen` — assignee once the story moves to `story_pass_status` (Jira accountId `5ae11c42b076312e0e25c600`, unique and assignable on AP as of 2026-10-04) |
| `story_fail_status` | — (stays where it is; the comment says why) |
| `bug_new_assign` | `Ken Nguyen` — assignee of every new bug ticket `stlc-bug-reporter` files (same account as `story_pass_assign`) |
| `bug_pass_status` | `Done` |
| `bug_fail_status` | `In Progress` |
| `bug_fail_assign` | the developer — see `stlc-ticket-pipeline/routing.md` §3.3 |
| `qa_account` | `$JIRA_LOGIN` (shown in Jira as *Vinh Le - QC*) — never the "developer" |
| `not_developers` | `qa_account`, `Ken Nguyen` — people who triage or release but never fix. Skipped when finding the developer to re-assign a failed bug to |
| `apply_mode` | `automatic` — comments, status changes and re-assignment are applied without asking. Set `confirm` to see the plan and approve it first |

### Pipeline gate rules

How `stlc-ticket-pipeline` decides gates A–C. The rule tables themselves are in
`.claude/skills/stlc-ticket-pipeline/routing.md` §3. This table only switches them.

| Setting | Value |
|---|---|
| `gate_mode` | `reviewer` — each gate is reviewed and decided by `stlc-qa-reviewer` (checkpoints R1–R4, plus R5 for automation), and no stop point reaches the user: E1–E5 become the reviewer's PARK rules (`stlc-qa-reviewer/checklists.md` §6). Other values: `rules` — each gate is decided by its rule table, with no prompt. The run asks the user only at stop points E1–E5: every requirement blocked by an unanswered question, a partly matching duplicate bug, an unknown run folder, a subagent question, or a rejected bug with no stated behaviour. Set `ask` to be asked at every gate, with the rule's result shown as the recommended option |
| `default_run_folder` | — (none). When a ticket has no sprint and no fix version, the run asks once. Set a value such as `5.2.0` to use it instead |

### QA orchestrator selection

Which tickets `stlc-qa-orchestrator` picks up. This project does not use sprints.

| Setting | Value |
|---|---|
| `select_statuses` | `QC` — the status that maps to canonical `ready_for_qa` |
| `select_assignee` | `qa_account` — tickets assigned to *Vinh Le - QC*, whatever their status |
| `select_types` | `story`, `bug`, `task` — Jira Story, Bug, Task. Excludes the Xray *Test*, *Test Plan* and *Test Execution* issues assigned to the QA account, which are test records, not features to test |
| `exclude` | status category Done |
| `execution_env` | `Dev` — the environment every agent executes on (the user's decision, 2026-11-01). Its URLs and accounts are the "Dev Environment" section of the `env` knowledge source. Set `Staging` to switch back |
| `automation_gate` | `qa-automator` runs only when the manual pass rate ≥ `story_pass_threshold` and no open High/Highest bug was filed or linked by the run (orchestrator routing §7) |

Tracker writes made at a gate (Gate A questions comment, Gate C bug filing) follow
`apply_mode` above, the same as Gate D.

Statuses on AP, for reference: Backlog · Selected for Development · In Progress ·
PR opened · Deploy to staging · QC · QA · Blocked · UAT · Ready for release ·
Documentation · Done. There is no *Closed* status.

---

## 3. `browser` settings

| Setting | Value |
|---|---|
| `screenshot_root` | `qa-artifacts/4-execution-results/screenshots` — evidence; set per call via the `filename` argument, one subfolder per `{Sprint}/{TicketID}` |
| `server_log_dir` | `playwright-log` — throwaway server output (`--output-dir` in `.mcp.json`). Never evidence |
| `admin_viewport` | 1280 × 800 |
| `member_viewport` | 390 × 844 |

`--output-dir` does **not** redirect screenshots — see the adapter.

## 4. `notify` settings

Disabled. To enable, set the `notify` row to a provider with an adapter, and add the
target channel here.

---

## 5. `vcs` settings — `github`

| Setting | Value |
|---|---|
| `remote` | `origin` — `https://github.com/vinhle870/Avantage` |
| `base_branch` | `dev` — every automation PR targets it |
| `pr_split` | `per-ticket` — one branch and one PR per ticket |
| `branch_prefix` | `qa-automation/` → `qa-automation/AP-2501` |
| `pr_label` | `qa-automation` |
| `worktree_root` | `.worktrees` (git-ignored) — where PR branches are built |
| `on_feedback` | `fix` — comments posted after the latest commit are fixed and pushed on the next batch run. `report` = list them only |
| `merge` | `never` — the QA merges |

**Prerequisite:** the project-scoped GitHub CLI installed (`tools/gh-cli/install.ps1`) and signed in (`bash tools/gh-cli/gh.sh auth login`), and the automation
framework committed to `dev` — otherwise the workbench check fails and every PR is
skipped with the reason.

---

## Switching provider

1. Confirm an adapter exists at `.claude/skills/providers/<provider>.md`. If not,
   write one — the contract is in
   [../../.claude/skills/mcp-tools.md](../../.claude/skills/mcp-tools.md) § "Adapter contract".
2. Change the `Provider`, `Access` and `Adapter` cells in §1.
3. Replace the matching settings section with that provider's settings.
4. Run the preflight in `mcp-tools.md` § "Preflight".

Adapters that exist today: `jira` (tracker) · `playwright` (browser) · `slack` (notify) · `github` (vcs)
· `openproject` (tracker — **not used by this project**, kept only so the framework
still supports OpenProject elsewhere).

> **Note on `.mcp.json`:** it declares `playwright` (stdio) and `jira` (SSE to
> Atlassian's official remote endpoint). Both are project-scoped — they travel with the
> repo, and each person approves them once per machine via `/mcp`. Jira additionally
> needs a browser sign-in; no token is stored in the repo.

---

## Rules

- **Never hardcode a credential here.** Name the environment variable that holds it.
- A skill that finds its capability `unbound` must ask the user which provider to use
  and offer to add the row — it must never guess, and never report the operation done.
- When a provider is added or removed, this file and the adapter change together.
