# Test Automator — Pull Request Procedures

Read this file for Step 7 (open a PR) and for `--fix-pr` mode. Capabilities are the
`vcs.*` group in [../mcp-tools.md](../mcp-tools.md) §3; settings come from the registry's
`vcs` section in [../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md) §5.

**The workbench rule.** Code is written and tested in the main working tree's
`playwright-automation/` (it has `node_modules` and `.env`). The PR branch is built in a
separate worktree that only receives copies of the ticket's files. Before s8 starts, the
workbench must equal `origin/<base_branch>`; after the PR is pushed, it is reset to that
state again, so the next ticket starts clean.

---

## 1. Workbench check — before writing any code (Step 1)

Run `git fetch origin <base_branch>`, then both:

- `git diff --quiet origin/<base_branch> -- playwright-automation` (no change to a tracked file)
- `git status --porcelain --untracked-files=all -- playwright-automation` lists nothing that is not git-ignored

Either fails → write the code anyway, but record `PR skipped: workbench not clean — <paths>`.
Never stash, reset or delete files to make it clean: they are the QA's work.

When the workbench lacks a file `origin/<base_branch>` has, run nothing — that is the
same "not clean" case.

---

## 2. Open the PR — Step 7

Only when the R5 verdict is `APPROVE` (or `gate_mode` is not `reviewer`), the workbench
check passed, and `vcs.preflight` passes.

1. **List the ticket's files:** `git status --porcelain --untracked-files=all -- playwright-automation`.
   The list must equal the report's *Files changed* plus the spec. A mismatch → stop the
   PR step: `PR skipped: unexpected change <path>`.
2. **Branch:** `vcs.create_branch` with `<branch_prefix><KEY>` (e.g. `qa-automation/AP-2501`).
3. **Copy** each listed file from the workbench to the same path in the worktree.
4. **Commit:** `vcs.commit` with the listed paths and this message:
   ```
   test(<KEY>): automate <M> test cases — <ticket subject ≤ 50 chars>

   <TC ID — title>, one per line
   Spec: <spec path> · Run: <P> passed, <F> fixme · Reviewer R5: APPROVE

   Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
   ```
5. **Push:** `vcs.push_branch`.
6. **Open:** `vcs.open_pr` — title `test(<KEY>): <ticket subject>`, body from
   [template.md](template.md) §3, label `<pr_label>`.
7. **Read back:** `vcs.get_pr` must return `state = OPEN` and the pushed commit. Only then:
8. **Reset the workbench:** `git restore --source=origin/<base_branch> --staged --worktree -- <each listed tracked path>`
   and delete each listed untracked path. Touch nothing outside the list.
9. `vcs.remove_worktree`. Record the PR number, URL and branch in the automation report,
   the run summary's `## Automation` section, and the result block (`pr:`).

Any step 2–7 fails → leave the workbench as it is (the code is not lost), record
`PR failed at step <n>: <error>`, and stop.

---

## 3. Fix mode — `--fix-pr`

Run when the orchestrator finds the ticket's PR in canonical state `feedback` or
`conflicting`. The workbench check (§1) must pass first.

1. **Load the branch into the workbench:** `git fetch origin <branch>`, then
   `git checkout origin/<branch> -- <every path the PR changes>` (list them with
   `gh pr diff <n> --name-only`). This touches only `playwright-automation/` paths.
2. **Read the feedback:** every comment and review comment without the agent marker,
   newer than the newest commit. Each one becomes a finding to fix. A comment that asks
   a question rather than for a change → answer it in the step-8 comment, change nothing for it.
3. **Conflicting:** build the worktree on the branch, `vcs.rebase`; resolve per the
   adapter's Pitfalls; copy the resolved files back into the workbench.
4. **Fix** in the workbench, following the same rules as Steps 2–4 of the skill.
5. **Lint and run** (Step 5). Then `stlc-qa-reviewer` `R5`, round 1.
6. **Copy** the changed files into the worktree on the branch, commit
   `test(<KEY>): address review — <one line>`, push (`--force-with-lease` after a rebase).
7. **Reset the workbench** exactly as §2 step 8.
8. **Comment** with `vcs.comment_pr`: `🤖 QA agent:` then one line per comment addressed —
   what changed, or the answer — and the new run result.

The PR stays open. Merging is the QA's decision.
