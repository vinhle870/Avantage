# Tool Access — Capabilities, Resolution, Preflight

How every skill in this project reaches a real tool. This is a reference document,
not a skill — nothing invokes it directly.

**Skills never name a provider.** A skill names a **capability** (`tracker.get_ticket`),
resolves it through the project's registry, and calls whatever that registry points at.
That is what makes the same skill work on OpenProject, on Jira, or on the next tracker.

---

## 1. The three layers

| Layer | File | Owned by | Answers |
|---|---|---|---|
| **Registry** | [../../qa-artifacts/qa-config/tools.md](../../qa-artifacts/qa-config/tools.md) | the QA, per project | *Which provider does this project use?* |
| **Adapter** | `.claude/skills/providers/<provider>.md` | the framework | *How does that provider implement each capability?* |
| **Skill** | `.claude/skills/<skill>/SKILL.md` | the framework | *Which capabilities, in what order, to do the job?* |

Switching tracker touches the registry only. Adding a tracker adds one adapter file.
Neither touches a skill.

---

## 2. Resolution rule

Every skill that needs a tool starts with this, before any other step:

1. Read [../../qa-artifacts/qa-config/tools.md](../../qa-artifacts/qa-config/tools.md) §1 Bindings.
2. Find the row for the capability group you need (`tracker`, `browser`, `notify`, `vcs`).
3. Branch on its `State`:
   - **`active`** — read the adapter named in that row, then call the capability
     through the implementation the adapter's *Capability map* gives.
   - **`disabled`** — skip that part of the workflow and tell the user you skipped it.
     Not a failure.
   - **`unbound`**, or the row is missing — **stop**. Tell the user the capability is
     not bound, list the adapters in `.claude/skills/providers/`, and offer to add the
     row. Never guess a provider. Never report the operation as done.
4. If the adapter marks the capability **Unsupported**, say so and offer the
   workaround the adapter names. Do not substitute a different capability.

State this in the skill as **Step 0 — Resolve the provider**. Do not restate the rule
itself; link here.

---

## 3. Capability vocabulary

The complete set a skill may ask for. Every adapter's *Capability map* answers this
list — with an implementation, or with **Unsupported**.

### `tracker`

| Capability | Meaning |
|---|---|
| `tracker.list_projects` | Resolve a project name to the provider's project reference |
| `tracker.list_sprints` | List the sprints (iterations, versions) of a project |
| `tracker.list_sprint_tickets` | List every ticket in one sprint |
| `tracker.get_ticket` | Read one ticket by its provider reference |
| `tracker.search_tickets` | Find tickets by free text plus type / status filters — the duplicate-bug check |
| `tracker.create_ticket` | Create a ticket, optionally under a parent |
| `tracker.update_ticket` | Edit fields on an existing ticket |
| `tracker.set_status` | Move a ticket to another status |
| `tracker.assign` | Change a ticket's assignee |
| `tracker.get_history` | Read a ticket's change log — who changed assignee and status, and when |
| `tracker.add_comment` | Post a comment on a ticket |
| `tracker.attach_file` | Attach a local file as evidence |
| `tracker.resolve_user` | Resolve a display name to the provider's user reference |

A **ticket reference** is opaque: a number on OpenProject, a key like `PROJ-42` on
Jira. Store and pass whatever the adapter returns — never assume it is numeric.

### `browser`

`browser.open` · `browser.snapshot` · `browser.click` · `browser.type` ·
`browser.fill_form` · `browser.select` · `browser.hover` · `browser.press_key` ·
`browser.evaluate` · `browser.wait` · `browser.screenshot` · `browser.back` ·
`browser.dialog` · `browser.console` · `browser.network` · `browser.resize` ·
`browser.tabs` · `browser.find` · `browser.close`

### `notify`

| Capability | Meaning |
|---|---|
| `notify.post_message` | Post a summary to the configured channel |

### `vcs`

| Capability | Meaning |
|---|---|
| `vcs.preflight` | Confirm the CLI is signed in and the base branch exists on the remote |
| `vcs.create_branch` | Create (or reopen) a branch from the base branch in a separate worktree |
| `vcs.commit` | Commit a listed set of paths — never everything |
| `vcs.push_branch` | Push the branch to the remote |
| `vcs.rebase` | Rebase the branch onto the latest base branch |
| `vcs.open_pr` | Open a pull request from the branch into the base branch |
| `vcs.list_prs` | List the pull requests carrying a label — open, merged and closed |
| `vcs.get_pr` | Read a pull request's state, commits and comments |
| `vcs.comment_pr` | Post a comment on a pull request |
| `vcs.remove_worktree` | Remove the worktree (and, after merge, the local branch) |
| `vcs.merge_pr` | Never used by an agent — the QA merges |

Canonical **`vcs.pr_state`**: `waiting` · `feedback` · `conflicting` · `merged` · `closed`.

---

## 4. Canonical value vocabulary

Skills use these values. Each adapter's *Vocabulary map* translates them into the
provider's own names or IDs. **Never write a provider's raw ID or status name into a
skill file.**

**`tracker.type`** — `task` · `story` · `bug` · `subtask`

**`tracker.status`** — `todo` · `in_progress` · `blocked` · `dev_done` · `fixing` ·
`in_review` · `ready_for_qa` · `qa_done` · `ready_for_uat` · `uat_done` · `done` · `closed`

**`tracker.priority`** — `low` · `normal` · `high` · `immediate`

### Bug severity to priority

Provider-independent. Applies in every tracker.

| Severity | Canonical priority |
|---|---|
| Critical | `immediate` |
| High | `high` |
| Medium | `normal` |
| Low | `low` |

If an adapter has no equivalent for a canonical value, it says so in its Vocabulary
map. Report that to the user instead of mapping to the nearest thing.

---

## 5. Credentials

**Never hardcode a credential in a skill file, an adapter, an artifact, or a commit.**
The registry names the environment variable; the adapter says how to read it.

| Value | Read from | If missing |
|---|---|---|
| Tracker base URL, project, credentials | `qa-artifacts/qa-config/tools.md` §2 | Stop and ask the user |
| Browser screenshot dir, viewports | `qa-artifacts/qa-config/tools.md` §3 | Fall back to the adapter's stated default |
| Notify channel | `qa-artifacts/qa-config/tools.md` §4 | Skip the notify step and say so |
| App URL, browser, environment name | the `env` source — see [knowledge-sources.md](knowledge-sources.md) | Stop and ask the user to fill it in |
| Test data, login accounts | the `test-data` source — see [knowledge-sources.md](knowledge-sources.md) | Mark the test case BLOCKED |

If a value in `execute.env.md` reads `[SET IN .env: VAR_NAME]`, read that variable
from `.env` instead of using the placeholder literally.

---

## 6. Preflight

Run through this before any skill that touches a browser or a tracker.

- [ ] `qa-artifacts/qa-config/tools.md` exists and the capability group you need is `active`.
- [ ] The adapter file that row points at exists and covers the capabilities you need.
- [ ] The adapter's tools actually respond, or its documented fallback is available.
- [ ] For `browser` work: the screenshot folder for this run exists —
      `qa-artifacts/4-execution-results/screenshots/{Sprint}/{TicketID}/`.
- [ ] For `browser` work: the `env` source resolves to a file that is filled in and the
      environment URL is not blank.
- [ ] For `browser` work: the `test-data` source resolves to a file that holds the
      accounts the test cases need.
- [ ] For `tracker` work: the credentials named in the registry resolve.

If a check fails, stop and tell the user which one and how to fix it. Never substitute
a guess for a missing environment value.

Provider-specific symptoms and fixes live in each adapter's *Troubleshooting* section.

---

## 7. Which capability groups each skill needs

Stable across providers — a tracker switch does not change this table.

| Skill | `tracker` | `browser` | `notify` |
|---|---|---|---|

`vcs` is used by two skills only: `stlc-test-automator` (create_branch · commit · push ·
open_pr · get_pr · comment_pr · rebase — optional; without it the PR step is skipped) and
`stlc-qa-orchestrator` (preflight · list_prs · get_pr — to find PRs waiting for fixes or merged).

| `stlc-init-workspace` | — | — | — |
| `stlc-baseline-generator` | — | — | — |
| `stlc-requirements-analyst` | — | — | — |
| `stlc-test-plan-designer` | names them in the plan | names them in the plan | names them in the plan |
| `stlc-testcase-designer` | — | — | — |
| `stlc-testcase-reviewer` | — | — | — |
| `stlc-manual-executor` | — | **required** | — |
| `stlc-bug-reporter` | create · attach | — | — |
| `stlc-test-reporter` | — | — | optional |
| `stlc-ticket-updater` | get · update · comment · set_status · assign | — | — |
| `stlc-ticket-pipeline` | get · search · get_history · comment · set_status · assign (writes via `tracker-manage-child-ticket`) | **required** for s4; without it the run stops after s3b | optional (via s6) |
| `stlc-test-automator` | — | optional — locator discovery; without it only steps covered by existing page objects are automated | — |
| `stlc-qa-reviewer` | get · search (writes a PARK comment via `tracker-manage-child-ticket`) | — (reads screenshots from disk; R5 runs the Playwright suite itself) | — |
| `stlc-qa-orchestrator` | search · get (workers use the `stlc-ticket-pipeline` set) | health check only — workers drive it one at a time | — |
| `tracker-fetch-sprint-tickets` | list_projects · list_sprints · list_sprint_tickets | — | — |
| `tracker-get-ticket` | get | — | — |
| `tracker-manage-child-ticket` | create · update · comment · attach · resolve_user | — | — |
| `agent-coordination` | get · list · comment | health check only | — |
| `automation-framework-builder` | — | generates Playwright code | — |

---

## 8. Adapter contract

To support a new provider, add `.claude/skills/providers/<provider>.md` with these
sections, in this order:

1. **Title** — provider name and the capability group it implements.
2. **Access rule** — primary path, fallback, authorisation, and what to do when it is
   unavailable.
3. **Capability map** — one row per capability in §3 for that group. Every capability
   gets a row: an implementation, or **Unsupported** with the workaround.
4. **Vocabulary map** — the §4 canonical values translated to this provider's names or
   IDs, and any canonical value it cannot express.
5. **Pitfalls** — quirks that will otherwise bite: pagination, stale-write tokens,
   reference formats, query syntax.
6. **Troubleshooting** — symptom, cause, fix.

Then add the row to `qa-artifacts/qa-config/tools.md` §1 and its settings section. No skill changes.

---

## 9. Rules for skill authors

- Resolve the provider in **Step 0**. Never assume one from the skill's name or history.
- Call capabilities, not tool names. `tracker.get_ticket`, never `get_work_package`.
- Use canonical values, never a provider's raw ID or status string.
- Never copy a tool inventory, auth recipe, credential path, or ID table into a skill.
  Link to the adapter section instead — one place to update.
- Provider-specific wording in a skill's `name` or `description` is a bug: it stops the
  skill from triggering on a project that uses a different provider.
- When a required capability is unavailable, say exactly that and stop. Never report
  the operation as done.
