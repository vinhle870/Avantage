# QA Orchestrator — Routing Reference

Read this file while executing `stlc-qa-orchestrator`. Paths use the tokens from
[../ticket-scope.md](../ticket-scope.md) §2. `{BATCH}` is the date of the orchestrator
run. Each worker resolves its own ticket's `{RUN}` at Intake (sprint, then fix version,
then `default_run_folder`); with `gate_mode: reviewer` a ticket with none of those uses
`no-sprint` instead of stopping at E3.

---

## 0. Selection rule

Settings come from the registry's *QA orchestrator selection* in
[../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md) §2.
Call **`tracker.search_tickets`** once with the filter for the run's flag, scoped to
`default_project`:

| Flag | Filter |
|---|---|
| none (default) | (status in `select_statuses` **or** assignee = `qa_account`) **and** status category not done **and** type in `select_types` |
| `--mine` | assignee = `qa_account` **and** status category not done **and** type in `select_types` |
| `--status-only` | status in `select_statuses` **and** type in `select_types` |
| `--only <keys>`, or bare keys (`/stlc-qa-orchestrator AP-1234`) | no search — call `tracker.get_ticket` on each key. When a named ticket is planned `skip`, say why in one line and what would make it run (e.g. "AP-1234 was tested on 2026-11-02 and nothing changed since — it waits for AP-2519 to be fixed") |

Take every page — the adapter's paging rule applies. The adapter's capability map gives
the query for each filter. A ticket assigned to the QA account but not ready for QA is
still selected: rule P8 plans it as `design-only`.

---

## 1. Ticket context and planning rules

### 1.0 Read each ticket's context first

Before any rule, collect these signals for every selected ticket and write them to the
batch file's *Ticket context* section ([template.md](template.md) §1). "Since the run"
means after the run state's `updated` time; with no run state, everything counts as new.

| Signal | How | Note |
|---|---|---|
| **C1 Status** | `tracker.get_ticket` (canonical status, assignee) + `tracker.get_history` | Did the status or assignee change since the run, and who changed it? A change made by `qa_account` is the QA's own s7 move — not new |
| **C2 Comments** | `tracker.get_ticket` with comments | Every comment since the run **not** written by `qa_account`: author, date, one-line gist. Mark it an **answer** when it replies to an open question in the requirements analysis (it quotes or addresses a Q-ID, or it is the first non-QA comment after the QA's questions comment) |
| **C3 Bugs filed by the run** | refs in `qa-artifacts/5-testing-report/{KEY}_bug-report.md`, then `tracker.get_ticket` on each | Current canonical status and priority of each. A bug now `ready_for_qa` or `done` is **fixed-for-retest** |
| **C4 Linked issues** | the ticket's links | Status of each linked issue; a linked bug that moved to `ready_for_qa` / `done` counts like C3 |
| **C5 Run state** | `qa-artifacts/.pipeline/{KEY}.md` | `run_status`, next pending stage, stop point, which stages are done |
| **C6 Recorded blocker** | the run summary's blockers, the batch file's previous rows | A prerequisite (missing API key, test data, payment card, author answer). Still missing? Check the cheapest evidence: the variable name in `/.env` (name only, never the value), the knowledge source, the comments |

Only a change from someone other than `qa_account` counts as **external**. The QA
agent's own comments and status moves never trigger a re-run.

### 1.1 Planning rules

Evaluate per ticket, top to bottom. **First match wins.** Map statuses and types to
canonical values through the adapter's Vocabulary map. Every rule holds only on a C1–C6
signal or a file on disk — never on a guess.

| Rule | Condition | Plan | Wave 1 range | Wave 2 range |
|---|---|---|---|---|
| **P1** | The ticket's project is not `default_project` (possible with `--only`) | `skip` — other project | — | — |
| **P2** | Canonical status `done` or `closed` | `skip` — already closed | — | — |
| **P3** | C6: a recorded prerequisite is still missing (e.g. `AVP_ADMIN_API_KEY` not in `/.env`) and nothing external changed | `skip` — blocked: name the prerequisite and who must provide it | — | — |
| **P4** | C2: an **answer** to an open question arrived since the run | `re-plan with answer` — the answer becomes the requirement for that Q-ID | from `s1` → `s3b` | `s4` → `s7`, then gate — only if the status is `ready_for_qa` |
| **P5** | C3/C4: a bug filed or linked by the run is now `ready_for_qa` or `done`, and the ticket is `ready_for_qa` | `retest-after-fix` — re-execute the whole set on the current build | — | `s4` → `s7`, then gate |
| **P6** | C1: the status changed **externally** back to `ready_for_qa` since a run that ended FAIL/BLOCKED (the developer says it is ready again) | `retest-after-fix` | — | `s4` → `s7`, then gate |
| **P7** | Run state `complete`, and no external change in C1–C4 | `skip` — tested, no change since. Name what it waits for (open bugs, unanswered Q-IDs) | — | — |
| **P8** | C1/C2: another external change since a complete run (description or acceptance criteria edited, an informational comment) | `re-capture` — re-read the ticket, update the analysis and cases | from `intake` → `s3b` | `s4` → `s7`, then gate — only if `ready_for_qa` |
| **P9** | Design done (`s3`/`s3b` done) and the status is **not** `ready_for_qa` | `skip` — designed, waiting for QC | — | — |
| **P10** | Run state exists, not `complete`, next stage `s4` or later, status `ready_for_qa` | `resume` | — | from that stage → `s7`, then gate |
| **P11** | Run state exists, not `complete`, next stage before `s4` | `resume` | from that stage → `s3b` | `s4` → `s7`, then gate — only if `ready_for_qa` |
| **P12** | Canonical type `bug`, status `ready_for_qa`, no run state | `bug-retest` | `intake` → `s3` (re-test flow) | `s4` → `s7`, then gate |
| **P13** | Status `ready_for_qa`, no run state | `full` | `intake` → `s3b` | `s4` → `s7`, then gate |
| **P14** | Any other status, no run state | `design-only` — the build may not contain the change | `intake` → `s3b` | — |

Then apply the run flags: `--design-only` drops every Wave 2 range; `--no-automation`
drops the automation gate.

A run stopped at E1 (every requirement blocked by the author) stays `skip — waiting on
author` under P7/P9 until C2 shows an answer, which makes it P4.

Each plan carries a one-line **Next** for the planned status card: what will run, or —
for a `skip` — what the ticket waits for and from whom (e.g. "waits for AP-2512 (High)
to be fixed", "waits for Ken's answer to Q-010").

---

## 2. Wave 2 order

Run tickets in this order. Earlier groups unblock developers sooner.

1. `bug-retest` and `retest-after-fix` tickets — short runs, and a developer is waiting on each.
2. `resume` tickets — work already started.
3. `full`, `re-plan with answer` and `re-capture` tickets, by canonical priority: `immediate` → `high` → `normal` → `low`.
4. Ties: ticket reference ascending.

A ticket whose Wave 1 ended `STOPPED` or `FAILED` is left out of Wave 2 until its
question is answered and its Wave 1 re-run returns `DONE`.

---

## 3. Agent hand-offs

Launch every agent with the **Agent** tool and the named `subagent_type` — never
`general-purpose`. The standing rules (environment, credentials, test data, evidence,
result block) live in the agent definitions under `.claude/agents/`, so a hand-off only
carries what changes per dispatch. Fill every `{{…}}`.

Every worker dispatch **ends where a review is due**. The worker stops before that
gate; the reviewer decides it; the next dispatch carries the decision in
`{{GATE_LINE}}` and the worker applies it first. Reviewer checkpoints by stage:

| Dispatch ends after | Review | Next dispatch starts at |
|---|---|---|
| `analyze` (s1) | `R1` → Gate A | `plan` |
| `review-cases` (s3b) | `R2` → Gate B | `execute` (Wave 2) |
| `correct-cases` (s4c) | `R3` → Gate C | `file-bugs` |
| `report` (s6) | `R4` → Gate D | `update-ticket` |
| automator, no PR | `R5` | automator `--pr-only` |

A dispatch whose range is already past a checkpoint skips it (e.g. a `retest-after-fix`
plan starts at `execute`).

### 3.1 Wave 1 — design (`subagent_type: stlc-worker`)

Two dispatches per ticket, with `R1` and `R2` after them.

```
Ticket: {{KEY}}. Run: --from {{FROM}} --until analyze        (Wave 1 — do NOT use the browser)
Ticket: {{KEY}}. Run: --from plan --until review-cases       (Wave 1 — do NOT use the browser)
The tracker preflight already passed. Gates are reviewed by the orchestrator's qa-reviewer —
stop before the gate of your last stage.
{{GATE_LINE}}
{{CONTEXT_LINES}}
{{ANSWER_LINE}}
```

### 3.2 Wave 2 — execute, report, update (`subagent_type: stlc-worker`)

Three dispatches per slot, with `R3` and `R4` between them. Skip a dispatch whose stages
are already `done`.

```
Ticket: {{KEY}}. Run: --from {{FROM}} --until correct-cases  (execute; you hold the browser and test accounts)
Ticket: {{KEY}}. Run: --from file-bugs --until report        (file the R3-approved bugs, write the test report)
Ticket: {{KEY}}. Run: --from update-ticket --until update-ticket  (apply the R4-approved outcome)
The tracker preflight and the environment health check already passed. Gates are reviewed
by the orchestrator's qa-reviewer — stop before the gate of your last stage.
{{GATE_LINE}}
{{CONTEXT_LINES}}
{{ANSWER_LINE}}
```

`{{GATE_LINE}}` — empty on a dispatch that starts at `intake` or `analyze`. Otherwise the
previous reviewer's decision, word for word from its verdict block: _"Gate <A|B|C|D> decided
by qa-reviewer (R<n> round <r>): <gate_decision>. Apply it first and log it `by reviewer`."_

`{{CONTEXT_LINES}}` — only facts the agent cannot read from disk: the ticket's plan rule and its C1–C4 context (§1.0) — the answer and its Q-ID (P4), the fixed bugs to verify (P5/P6), what changed on the ticket (P8) — the user's decisions
for this batch (e.g. how to treat open questions), the Gate C decisions from the latest
R3 (for the s5–s7 dispatch: which bugs to file, their links, the wording the reviewer
asked for), bugs filed earlier in the batch that may block this ticket's setup, and
records other tickets left on the environment that this ticket must not touch.

`{{ANSWER_LINE}}` — empty on a first dispatch. After a user answer: _"The user answered
'<question>': '<answer>'."_ After a `REWORK`: _"A reviewer rejected your work (round <n>).
Redo only <rework_scope>. Findings: <every Blocker/Major finding, word for word>."_

### 3.3 Result blocks

The agents end with the block from their own definition: `=== WORKER RESULT ===`
(`stlc-worker`), `=== REVIEW VERDICT ===` (`qa-reviewer`, from the stlc-qa-reviewer
`template.md` §2) and `=== AUTOMATION RESULT ===` (`qa-automator`).

### 3.4 Independent review (`subagent_type: qa-reviewer`)

```
Ticket: {{KEY}}. Checkpoint: {{R1 | R2 | R3 | R4 | R5}}. Round: {{n}}.
{{REVIEW_FOCUS}}
```

`{{REVIEW_FOCUS}}` — the producer's own claims the reviewer must test (question
classifications for R1; each FAIL/BLOCKED reason, any substitution or workaround, any
write-back to a shared knowledge file for R2/R3; the planned status move and comment for
R4; the automator's pass/fixme counts and new locators for R5), and the batch decisions
it must not re-raise. For R3 and R5 it holds the browser and the `playwright-automation/`
workbench for the slot.

### 3.5 PR fix (`subagent_type: qa-automator`)

```
Ticket: {{KEY}}. Mode: --fix-pr. PR #{{N}} ({{URL}}) is {{feedback | conflicting}}.
You hold the browser, the test accounts and the playwright-automation/ workbench.
```

Check it like any result (§4), plus: `vcs.get_pr` shows a new commit after the dispatch
started and a comment starting with the agent marker that lists what changed.

### 3.6 Automation (`subagent_type: qa-automator`)

Only after the automation gate (§7) passes. The first dispatch writes and runs the specs
but opens no PR; `qa-reviewer` `R5` follows.

```
Ticket: {{KEY}}. Mode: --review external{{ --no-pr — reason}}.
Passed manual cases: {{TC IDs}}. Records this ticket left on the environment: {{ids or —}}.
You hold the browser, the test accounts and the playwright-automation/ workbench.
{{ANSWER_LINE}}
```

`REWORK` at R5 → the same dispatch again with the findings in `{{ANSWER_LINE}}`; the
automator fixes only `rework_scope`, re-runs, and rewrites the report.

### 3.7 Open the PR (`subagent_type: qa-automator`)

After R5 `APPROVE`, or a `PARK` scoped to some tests (the automator marks those
`test.fixme()` first). Skip with `--no-pr`, or when R5 parked every test.

```
Ticket: {{KEY}}. Mode: --pr-only. R5 verdict: {{APPROVE | PARK of <tests> — reason}}.
You hold the playwright-automation/ workbench.
```

---

## 4. Checking an agent's result

Before updating the batch run state, check every claim against the disk:

| Check | Action when it fails |
|---|---|
| The reply ends with the agent's result block | Record `failed — no result block`; keep the reply's last 3 lines as the reason |
| `ticket:` equals the dispatched `{KEY}` | Record `failed — wrong ticket` |
| Every path in `artifacts:` / `files:` exists | Record `failed — missing <path>` |
| The run summary's `Updated:` time is after the dispatch started | Record `failed — no run summary` |
| `qa-artifacts/.pipeline/{KEY}.md` agrees with `last_stage` | Trust the run-state file over the reply |
| After s7: read the ticket back with `tracker.get_ticket` | Report the status Jira shows, not the one claimed |
| Every bug in `open_bugs` exists in the tracker with that priority | Use the tracker's priority for the automation gate |
| After a `qa-automator`: the automation report exists; `pr:` names a PR that `vcs.get_pr` returns `OPEN` | Record automation `failed` / `pr failed — not found` |
| After the slot, `git status --porcelain -- playwright-automation` differs from before **only** by the paths the automator listed in `files:` | Stop Wave 2 and report the unexpected paths — the next ticket would build on a dirty workbench |

### 4.1 Acting on a reviewer verdict

| Verdict | Action |
|---|---|
| `APPROVE` | R1 → dispatch `plan → review-cases` with the Gate A decision · R2 → the ticket enters Wave 2 · R3 → dispatch `file-bugs → report` with the Gate C decisions · R4 → dispatch `update-ticket` with the Gate D outcome · R5 → dispatch the automator `--pr-only` (§3.7) |
| `REWORK` | Re-dispatch the producer — `stlc-worker` with `--from <rework_stage>` and the **same `--until`** as the reviewed dispatch (an evidence-only R3 rework may be scoped to re-capture), or the `qa-automator` for R5 — with the findings in `{{ANSWER_LINE}}`, then review again with `round + 1` |
| `PARK` | Whole ticket → post the park reason on `{KEY}` (it goes into the s7 comment when s7 still runs, otherwise through `tracker-manage-child-ticket`) and report it `parked`. Scoped to some cases → those cases stay BLOCKED; the rest continue |
| No verdict block | Re-dispatch the reviewer once; still none → `PARK` with "reviewer gave no verdict" |

A review never exceeds round 3. Record every verdict in the batch Worker log and post it
in the ticket's next status card.

---

## 5. Failure handling

| Situation | Action |
|---|---|
| A worker returns `FAILED` | Record it with the reason. Continue with the next ticket |
| A Wave 2 worker leaves the browser open or a tab hanging | Close all tabs (`browser.tabs` → close) before the next dispatch |
| A Wave 2 worker reports the environment went down mid-run | Stop Wave 2. Mark the remaining tickets `blocked — environment down` |
| The user interrupts | Leave the batch run state as it is. Running the batch again re-selects and re-plans from §0 — finished tickets match P3 and are skipped |
| The Agent tool is not available | Run each ticket's ranges inline, one ticket at a time, in Wave 2 order. Say that parallel design is unavailable |

---

## 6. Automation PR follow-up

Read the `vcs` settings in the registry. Call `vcs.list_prs` for `pr_label` (open, merged and closed),
take `{KEY}` from the branch name, and read each one's canonical `vcs.pr_state`
(adapter Vocabulary map) with `vcs.get_pr`. Only PRs that are open, or were merged or closed since the
previous batch file, matter.

| State | Action |
|---|---|
| `merged` | Record `merged` in the ticket's automation report and run summary. `vcs.remove_worktree` and delete the local branch if they still exist |
| `closed` | Record `closed without merge`. Do not reopen. List it under *Needs you* — the QA closed it, so ask whether the spec should be dropped |
| `feedback` | `on_feedback: fix` → plan a `pr-fix` slot (§3.5). `report` → list each comment under *Needs you* |
| `conflicting` | Plan a `pr-fix` slot — a rebase onto the base branch |
| `waiting` | Nothing to do. List it under *Waiting for merge* |

A `pr-fix` slot that fails twice in a row for the same comments → stop planning it,
post a `🤖 QA agent:` comment on the PR saying what could not be fixed, and list it under
*Needs you*.

---

## 7. Automation gate

Run after the s5–s7 worker returns and its result passes §4. **All** must hold:

| Condition | Source |
|---|---|
| Manual pass rate ≥ `story_pass_threshold` (90%) — PASS ÷ (all cases − SKIPPED) | the execution log's summary, not the worker's reply |
| No open bug with priority **High or Highest** filed or linked by this run | `tracker.get_ticket` on every bug in `open_bugs` |
| At least one PASSED case | the execution log |
| Not `--no-automation`, and the ticket was not parked | the run flags and the batch file |

Pass → dispatch `qa-automator` (§3.6). Fail → no automation; the status card names the
failing condition (e.g. "pass rate 63.6% < 90%", "AP-2512 High is open"). A ticket that
fails the gate gets automated in a later batch, once its re-test passes the gate.

