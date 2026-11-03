---
name: stlc-qa-orchestrator
description: >-
  Test every ticket waiting for QA with three dedicated subagents: select the open
  tickets that are ready for QA or assigned to the QA account, plan each ticket (skip,
  design only, resume, bug re-test or full run), and hand each ticket to an stlc-worker
  (full STLC stages), have every review checkpoint approved by an independent qa-reviewer
  subagent (analysis, test-case design, testing results, ticket outcome, automation specs), and — only when manual testing passed at least 90% with no
  open High/Highest bug — hand it to a qa-automator that writes the Playwright specs and
  one pull request per ticket. Posts a status card per ticket at each phase in the chat
  and combines everything into one batch report. Designs tickets in parallel and
  executes them one at a time on the shared browser and dealer account. Use when the user
  says "test my tickets", "run QA on everything in QC", "test all tickets assigned to
  me", "run the QA batch", "orchestrate QA", or "/stlc-qa-orchestrator AP-1234" (one
  ticket through every stage with subagent reviews). Part of the STLC QA pipeline.
---

# Skill — QA Orchestrator

Select the tickets waiting for QA, plan each one, run it through three subagents, post its status as it moves, and combine the results into one batch report. The orchestrator plans, dispatches, checks and reports; it never runs a stage itself.

| Subagent | Definition | Does |
|---|---|---|
| `stlc-worker` | [../../agents/stlc-worker.md](../../agents/stlc-worker.md) | The STLC stages intake → s7 for one ticket (design, execution, bugs, report, ticket update) |
| `qa-reviewer` | [../../agents/qa-reviewer.md](../../agents/qa-reviewer.md) | Independent review at **every** checkpoint: `R1` analysis · `R2` test cases · `R3` testing results · `R4` ticket outcome plan · `R5` automation specs |
| `qa-automator` | [../../agents/qa-automator.md](../../agents/qa-automator.md) | Stage s8 — automation and one PR — only for tickets that pass the automation gate |

**Per ticket** (stage names from `stlc-ticket-pipeline` → *Stage names*; every review
ends in `APPROVE`, `PARK`, or a `REWORK` that re-dispatches the producer with the findings, up to round 3):

```
Wave 1  worker intake→analyze ─ R1 ─ worker plan→review-cases ─ R2
Wave 2  worker execute→correct-cases ─ R3 ─ worker file-bugs→report ─ R4 ─ worker update-ticket
        automation gate ─ automator (specs, no PR) ─ R5 ─ automator (open PR)
```

---

## Input

| Input | Required | Example |
|---|---|---|
| `<keys>` | No | `/stlc-qa-orchestrator AP-1234` or `AP-1234,AP-1235` — a bare key list is the same as `--only` |
| `--only <keys>` | No | `--only AP-2477,AP-2487` — plan just these tickets, whatever their status or assignee |
| `--mine` | No | Select only tickets assigned to the QA account |
| `--status-only` | No | Select only tickets in the ready-for-QA status |
| `--design-only` | No | Run Wave 1 only — no browser, no tracker status changes |
| `--no-automation` | No | Never dispatch `qa-automator` |
| `--plan` | No | Print the plan and stop, without dispatching anything |
| `--prs` | No | Only follow up on open automation PRs (Step 1b) |

---

## Workflow

### Step 0 — Resolve the providers and select the tickets

1. Resolve **`tracker`**, **`browser`** and **`vcs`** per [../mcp-tools.md](../mcp-tools.md) §2. `tracker` not `active` → stop. `browser` not `active` → set `--design-only`. `vcs` not `active` or `vcs.preflight` fails → the automator runs with `--no-pr`; say why once.
2. Run the tracker preflight once. On failure, stop and name the fix.
3. Read `execution_env` from the registry ([../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md), *QA orchestrator selection*). Every agent tests only there.
4. Select the tickets by [routing.md](routing.md) §0, then `tracker.get_ticket` on each. Zero tickets → stop: _"No ticket is ready for QA or assigned to you."_
5. `{BATCH}` = today's `{DATE}`. A batch file for today already exists → re-plan into it.

### Step 1 — Read each ticket's context, then plan it

For every ticket, collect its context first ([routing.md](routing.md) §1.0): current status and who changed it, comments since the last run that are not the QA account's own, the status of every bug it filed or links to, its run state, and any recorded blocker. Then apply the planning rules (§1.1), first match wins — `skip`, `re-plan with answer`, `retest-after-fix`, `re-capture`, `resume`, `bug-retest`, `full` or `design-only` — each with a Wave 1 range, a Wave 2 range and a one-line **Next**. Only external changes (not the QA agent's own comments or status moves) trigger a re-run. Order Wave 2 by §2. Write `qa-artifacts/.pipeline/_batch-{BATCH}.md` ([template.md](template.md) §1) with its *Ticket context* section, print the plan table, and post a **planned** status card ([template.md](template.md) §4) for every ticket that will run; list the skipped ones in one table with what each waits for.

### Step 1b — Follow up on automation PRs

List every automation PR and read its state by [routing.md](routing.md) §6. `feedback` or `conflicting` → plan a `pr-fix` slot (a `qa-automator` with `--fix-pr`) at the front of Wave 2. `--plan` → stop here. `--prs` → skip Wave 1.

### Step 2 — Wave 1: design in parallel

Up to **4 tickets at a time**; reviewers may run in parallel. Per ticket, check every result with [routing.md](routing.md) §4 and act on every verdict by §4.1:

1. **Analyse** — `stlc-worker` from the plan's first stage `--until analyze` (§3.1), then `qa-reviewer` `R1` (§3.4). Skip both when `s1` is already `done` and the plan does not re-run it.
2. **Design** — `stlc-worker` `--from plan --until review-cases` with the R1 Gate A decision (§3.1), then `qa-reviewer` `R2`.

Post a **design** status card when R2 approves or parks.

### Step 3 — Questions

With `gate_mode: reviewer`, the reviewer answers or parks a worker's question (`stlc-qa-reviewer` checklists §6). Otherwise ask the `STOPPED` questions together, at most 4 per prompt. E1 (every requirement blocked by the author) → `waiting on author`, no question to the user.

### Step 4 — Wave 2: one ticket at a time

Skip with `--design-only`. Run the environment health check once on `execution_env` (`agent-coordination` routing → c2); FAIL → every Wave 2 ticket `blocked — environment down`, go to Step 5. Run the `pr-fix` slots first, then each ticket's **slot** in Wave 2 order — nothing else uses the browser or the `playwright-automation/` workbench until the slot ends:

1. **Execute** — `stlc-worker` `--from <stage> --until correct-cases` (§3.2), then `qa-reviewer` `R3`. Post an **execution** status card. Bugs are never filed before R3 approves.
2. **Bugs and report** — `stlc-worker` `--from file-bugs --until report` with the R3 Gate C decisions (§3.2), then `qa-reviewer` `R4` on the ticket outcome plan.
3. **Update the ticket** — `stlc-worker` `--from update-ticket --until update-ticket` with the R4-approved outcome (§3.2). Post an **outcome** status card with the Jira status read back.
4. **Automation gate** ([routing.md](routing.md) §7). Fail → post the **automation** card with the gate reason; no automation. Pass → `qa-automator` `--review external` (§3.6) writes and runs the specs without opening a PR, then `qa-reviewer` `R5` re-runs them; `REWORK` re-dispatches the automator with the findings. On `APPROVE` (or `PARK` of some tests) → `qa-automator` `--pr-only` (§3.7) opens the PR. Post the **automation** status card.

Check every result with §4 and update the batch file before the next slot.

### Step 5 — Combine the results

Read each run summary and review record; open other reports only for a missing figure. Write `qa-artifacts/5-testing-report/{BATCH}_qa-batch-report.md` ([template.md](template.md) §2), mark the batch `complete`, update `qa-artifacts/.session-state.md`, and print the closing report (§3).

---

## Rules

- **The orchestrator never runs a stage itself.** Every stage runs in `stlc-worker`, every approval in `qa-reviewer`, every spec in `qa-automator`. Never use `general-purpose` for these roles.
- **One ticket per agent.** Never give an agent two tickets or let two agents hold one ticket at once.
- **Only one browser user at a time.** Wave 1 never touches the browser; Wave 2 slots run strictly in sequence.
- **No self-approval.** Every checkpoint R1–R5 is decided by a `qa-reviewer` subagent — never by the worker or automator that produced the work, and never inline. Each dispatch ends where a review is due; the next dispatch carries the reviewer's decision.
- **Automation only through the gate.** `qa-automator` runs only when [routing.md](routing.md) §7 passes: ≥ 90% PASS (SKIPPED excluded) and no open High/Highest bug from the run.
- **Post the status card at every phase** ([template.md](template.md) §4) — the chat is the QA's live view.
- **Agents never ask the user and never write `qa-artifacts/.session-state.md`.** The orchestrator writes it once, in Step 5.
- **Never trust an agent's word over the disk** ([routing.md](routing.md) §4). **One failure never stops the batch.**
- **Never merge a PR.** **Never pause for the QA's approval of a ticket outcome** — a PASS moves the ticket at s7 by the registry's outcome rules; report it afterwards.
- **Never re-plan from guesses.** Treat a ticket reference as opaque.

---

## Output Language

The batch report and status cards are read by a QA lead deciding what can ship: what was tested, what failed, what someone must do next, in full sentences. Keep plan names, stage IDs, status words and table layouts from [template.md](template.md) exactly. Rules: [../output-style.md](../output-style.md).

---

## Resources

- **[routing.md](routing.md)** — selection, planning, Wave 2 order, agent hand-offs, result checks, automation gate, PR follow-up.
- **[template.md](template.md)** — batch run-state file, batch report, closing report, status card.
- **[../ticket-scope.md](../ticket-scope.md)** · **[../mcp-tools.md](../mcp-tools.md)** · **[../output-style.md](../output-style.md)**

---

## Handoff

> "QA batch {BATCH}: <N> tickets planned, <N> passed, <N> failed, <N> blocked, <N> parked.
> <N> bugs filed, <N> tickets automated. Batch report:
> qa-artifacts/5-testing-report/{BATCH}_qa-batch-report.md."

---

## Next Move

Before printing this block, update `qa-artifacts/.session-state.md`: `pipeline_stage: batch-done`, `last_skill_run: stlc-qa-orchestrator`, `last_action: QA batch {BATCH} — <N> passed, <N> failed, <N> blocked, <N> bugs filed`.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SKILL COMPLETE: QA Orchestrator — batch {BATCH}
 Output: {BATCH}_qa-batch-report.md — <N>/<N> tickets complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 WHAT TO DO NEXT:
  → [PRIMARY]   Review and merge the PRs listed above — comment on a PR to ask for changes
  → [ALTERNATE] After commenting, say "run the QA batch --prs" to get them fixed
  → [ALTERNATE] Triage open bugs (q3)
  → [ALTERNATE] Re-run one ticket — type its key
  → [QUICK]     Show the plan only — say "run the QA batch --plan"
  → [PAUSE]     Save progress and exit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Say "what's next" at any time to see this again.
```
