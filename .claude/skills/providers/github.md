# Provider Adapter — GitHub (`vcs`)

Implements the `vcs` capability group. Bound to a project through
[../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md).

**Access:** `git` + the GitHub CLI, run from the repo root through the project wrapper
`bash tools/gh-cli/gh.sh`. **Every `gh …` in this file means `bash tools/gh-cli/gh.sh …`** —
the wrapper runs the pinned `tools/gh-cli/gh.exe` with its login kept in
`tools/gh-cli/config/` (both git-ignored), and falls back to a `gh` on PATH.

---

## Access rule

1. **Primary** — `git` for branches, commits and pushes; `gh` for pull requests. There is
   no MCP fallback.
2. `gh` must be installed and signed in once per machine, project-scoped:
   `powershell -ExecutionPolicy Bypass -File tools/gh-cli/install.ps1` (pinned version,
   SHA-256 checked), then `bash tools/gh-cli/gh.sh auth login` (GitHub.com · HTTPS ·
   browser). The agent never runs `auth login` — it is interactive, and the token it
   writes to `tools/gh-cli/config/` is a secret that must never be read or printed.
3. Preflight: `gh auth status` succeeds **and** `git ls-remote --exit-code --heads origin <base_branch>` succeeds.
   Either fails → the PR step is skipped with the reason; the automation itself is kept.
4. **The agent never merges, never approves, never pushes to `base_branch`, and never
   force-pushes without `--force-with-lease`.**

---

## Capability map

| Capability | Implementation | Notes |
|---|---|---|
| `vcs.preflight` | `gh auth status` · `git ls-remote --exit-code --heads origin <base>` | See Access rule 3 |
| `vcs.create_branch` | `git fetch origin <base>` then `git worktree add <worktree_root>/<KEY> -b <branch> origin/<base>` | A worktree, so the user's working tree and its uncommitted changes are never touched. Existing branch → `git worktree add <worktree_root>/<KEY> <branch>` |
| `vcs.commit` | In the worktree: `git add -- <each path>` then `git commit -F <msg file>` | **Never `git add .` or `-A`.** Stage only the listed paths |
| `vcs.push_branch` | `git push -u origin <branch>` · after a rebase: `git push --force-with-lease origin <branch>` | |
| `vcs.rebase` | In the worktree: `git fetch origin <base>` then `git rebase origin/<base>` | Conflict → see Pitfalls |
| `vcs.open_pr` | `gh pr create --base <base> --head <branch> --title "<title>" --body-file <file> --label <label>` | Label missing → create it once: `gh label create <label> --color 0E8A16` |
| `vcs.list_prs` | `gh pr list --label <label> --state all --limit 100 --json number,url,headRefName,state,mergedAt,closedAt` | Branch name gives the ticket key: `qa-automation/AP-2501` → `AP-2501` |
| `vcs.get_pr` | `gh pr view <branch> --json number,url,state,mergedAt,mergeable,headRefOid,commits,comments,reviews` | Inline review comments: `gh api repos/{owner}/{repo}/pulls/<n>/comments` |
| `vcs.comment_pr` | `gh pr comment <n> --body-file <file>` | Body must start with the agent marker (Pitfalls) |
| `vcs.remove_worktree` | `git worktree remove <worktree_root>/<KEY>` · after merge also `git branch -D <branch>` | Only after the push is confirmed |
| `vcs.merge_pr` | **Unsupported by policy** | The QA merges. Never call `gh pr merge` |

---

## Vocabulary map — `vcs.pr_state`

Evaluate top to bottom, first match wins:

| Canonical | GitHub condition |
|---|---|
| `merged` | `state = MERGED` |
| `closed` | `state = CLOSED` |
| `conflicting` | `state = OPEN` and `mergeable = CONFLICTING` |
| `feedback` | `state = OPEN` and a comment or review comment **without the agent marker** was created after the newest commit's `committedDate` |
| `waiting` | `state = OPEN` otherwise |

`mergeable = UNKNOWN` right after a push → wait 10 seconds with `gh pr view` and read again, at most 3 times; still unknown → treat as `waiting`.

---

## Pitfalls

- **A PR author cannot "Request changes" on their own PR.** The agent pushes with the
  QA's own `gh` account, so `reviewDecision` never becomes `CHANGES_REQUESTED`. Feedback
  is detected from comments instead (`feedback` above).
- **Agent marker.** Every comment the agent posts starts with `🤖 QA agent:` so the
  feedback check never mistakes the agent's own comment for the QA's.
- **`git add .` would publish secrets and unrelated work.** The repo has many
  uncommitted changes and `.env*` files. Stage listed paths only.
- **The worktree has no `node_modules` and no `.env`.** Never run tests in it. Tests run
  in the main working tree; the worktree only builds the commit.
- **Rebase conflict.** Keep both sides when both add members (methods, locators, fixture
  entries) — that is the usual case. Any other conflict → `git rebase --abort`, comment
  on the PR, and report `conflicting` for the QA.
- **Windows line endings.** Copy files byte for byte; do not re-save them through an
  editor that rewrites CRLF.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `gh.exe not found` / `gh: command not found` | Project CLI not installed | `powershell -ExecutionPolicy Bypass -File tools/gh-cli/install.ps1` |
| `You are not logged into any GitHub hosts` | Not signed in | `bash tools/gh-cli/gh.sh auth login` (the QA runs it) |
| `fatal: '<branch>' is already checked out` | A worktree from an earlier run still holds it | `git worktree list`, then `git worktree remove` the stale one |
| `could not add label` | Label does not exist | `gh label create <label>` once |
| `pull request create failed: ... No commits between` | Nothing was copied into the worktree | Check the file list against the automation report |
