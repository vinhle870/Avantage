---
name: stlc-ticket-pipeline
description: >-
  Run the whole STLC cycle for one tracker ticket from a single ticket key: capture
  the ticket as a requirement, analyse it, plan, design and peer-review test cases,
  execute them in a real browser, report bugs, write the test report and update the
  ticket. Decides each review gate by a fixed rule table, stops only where the ticket leaves a
  question no rule can settle, and resumes where it stopped. Use when the user types
  a bare ticket key such as "AP-1234", or says "test ticket AP-1234", "run the
  pipeline for AP-1234", "full QA for AP-1234", or "resume AP-1234". Part of the
  STLC QA pipeline — it orchestrates the stlc-* skills.
---

# Skill — Ticket Pipeline

Run Intake → s1 → s2 → s3 → s3b → s4 → s4c → s5 → s6 → s7 for one ticket key, one stage at a time, with every artifact scoped to that ticket.

---

## Input

| Input | Required | Example |
|---|---|---|
| `ticket_ref` | Yes | `AP-1234` |
| `--auto` | No | Alias for `gate_mode: rules` on this run (gates decided by rule, no prompts). The registry's `gate_mode` is the normal switch |
| `--from <stage>` | No | `--from execute` — re-run from this stage, keep earlier artifacts |
| `--until <stage>` | No | `--until review-cases` — stop after this stage (design only) |
| `--status` | No | Print the run-state table and stop |

### Stage names

Users type and read the **stage name**. The **code** is the internal ID used in the
run-state file, routing tables and agent hand-offs. Both are accepted after `--from` and
`--until`, in any letter case; map a name to its code before using it.

| Stage name | Code | What happens |
|---|---|---|
| `intake` | `intake` | Read the ticket and save it as a requirement |
| `analyze` | `s1` | Analyse the requirements and list open questions |
| `plan` | `s2` | Write the test plan |
| `design` | `s3` | Write the test cases |
| `review-cases` | `s3b` | Peer-review the test cases for coverage gaps |
| `execute` | `s4` | Run the test cases in the browser |
| `correct-cases` | `s4c` | Fix test cases whose bug was rejected as not a bug, and re-run them |
| `file-bugs` | `s5` | File bugs for the failed cases |
| `report` | `s6` | Write the test report |
| `update-ticket` | `s7` | Comment on the ticket and move its status |

(`automate` = `s8` belongs to `stlc-test-automator`, not this pipeline.) An unknown stage →
stop and print this table.

**In every message to the user** — the run-state table printed by `--status`, the summary,
the closing report, stop messages and next-step suggestions — name a stage by its stage
name, never by its code alone.

---

## Workflow

### Step 0 — Resolve the provider and the scope

1. Resolve the **`tracker`** and **`browser`** groups per [../mcp-tools.md](../mcp-tools.md) → §2 Resolution rule. `tracker` not `active` → stop. `browser` not `active` → run with `--until s3b` and say why.
2. Run the adapter's tracker preflight. On failure, stop and name the fix.
3. Derive `{KEY}`, `{SPEC}` and the paths from [../ticket-scope.md](../ticket-scope.md). Every stage below reads and writes only those paths.

### Step 1 — Load or create the run state

Read `qa-artifacts/.pipeline/{KEY}.md` (schema: [template.md](template.md) §1).

- **Absent** → create it with every stage `pending`.
- **Present, not complete, no `--from`** → `gate_mode: rules`: resume from the next stage and say so. `gate_mode: ask`: show the table and ask _"Resume from <next stage>, restart, or stop?"_.
- **`--status`** → print the table and stop.

Before trusting a `done` row, check that its artifact file exists. A missing artifact turns the row back to `pending`.

### Step 2 — Intake

Follow [routing.md](routing.md) §1. It calls `tracker.get_ticket` with comments, checks the status, fixes `{RUN}`, and writes or appends to the requirement capture. A ticket of canonical type `bug` switches to the re-test flow in [routing.md](routing.md) §4.

### Step 3 — Run the stages

For each stage from the first `pending` row to `--until` (or `s7`), in the order of [routing.md](routing.md) §2:

1. Mark the row `running` and save the run-state file.
2. Invoke the stage's skill with this hand-off line, so it never has to ask: _"Ticket scope: {KEY}. Spec ID: {SPEC}. Run folder: {RUN}. Use the paths in ticket-scope.md. Inputs: <paths from the table>."_
3. Run **s4 in a subagent** when the runtime provides one (it fills context with page snapshots). Tell that subagent: _"Do not ask the user anything. If you need an answer, stop and return the question."_ Run every other stage inline.
4. Check the stage's **done-check** from [routing.md](routing.md) §2. Pass → mark `done` with the artifact path and time. Fail → mark `failed`, record the reason, and stop.
5. If the stage has a gate, decide it by its rule table ([routing.md](routing.md) §3.0–§3) — with `gate_mode: reviewer`, through `stlc-qa-reviewer` at that gate's checkpoint — and write the rule ID, evidence and verdict to the Gate log.

### Step 4 — Close the run

**Write the run summary first, on every ending** — complete, stopped at a stop point, stopped by `--until`, or failed: rewrite `qa-artifacts/5-testing-report/{KEY}_run-summary.md` from [template.md](template.md) §6. It is the only record of the run a reader gets when this pipeline ran inside a worker.

Mark the run `complete`, update `qa-artifacts/.session-state.md`, then print the summary block from [template.md](template.md) §3 followed by the closing report from §5 — same six headings, same order, every run.

---

## Rules

- **Run one stage at a time, in order.** A stage never starts before the previous stage's done-check passes.
- **Every gate is decided by its rule table, not by judgement** ([routing.md](routing.md) §3.0). With `gate_mode: rules` the run asks the user only at the stop points E1–E5. With `gate_mode: ask` every gate shows the rule's result as the recommended option. With `gate_mode: reviewer` the reviewer approves every gate and no stop point reaches the user.
- **Never resolve an ambiguity by assumption.** A rule condition holds only on cited evidence: a count, a tracker status, or a sentence quoted from the capture or a ticket comment. Without that evidence, fall through to the gate's safe fallback rule: post the question, mark the case BLOCKED, file the bug, or stop. Never take the most likely reading.
- **Gate D (ticket outcome)** — story: short result comment (template §4.1 — failed/blocked cases, bugs, blocking questions, next step; the full table stays in the test report); move to the pass status (and assign to `story_pass_assign`) only at ≥ threshold PASS, with no stopping bug and no open Blocking question. Bug: re-test comment; PASS → pass status, FAIL → fail status and re-assigned to the developer. Targets and `apply_mode` come from the registry's *QA outcome rules*; the procedure is [routing.md](routing.md) §3.1–§3.3.
- **Never mark a stage `done` without its artifact on disk.** If a skill says it is done but the file is missing, mark the stage `failed`.
- **Treat environment failures as BLOCKED, not FAIL.** A login failure, a timeout or an HTTP 5xx before the step under test is not a product bug. Retry the case once, then record it BLOCKED. Only FAIL results go to s5.
- **A bug confirmed not valid corrects its test case.** A Gate C rule C1 decision, or a rejected bug confirmed at Intake by rule R1 (or by the user at stop E5), goes to `s4c`: the test case is rewritten to the confirmed behaviour and re-run before s5, so the report counts it correctly ([routing.md](routing.md) §1.5, §2).
- **Never overwrite a requirement capture** — append (see [../ticket-scope.md](../ticket-scope.md) §4).
- **Every tracker write goes through `tracker-manage-child-ticket`.**
- Treat the ticket reference as opaque. Never assume it is numeric.
- When a run stops at a stop point (E1–E5), leave the run state as it is so the next `{KEY}` resumes there.
- **The final message is fixed-format.** Summary block (§3) + closing report (§5) only — no extra headings, no free-form recap.
- **Never end a run without `{KEY}_run-summary.md`.** A stopped or failed run writes it too, with the `Stopped:` line.

---

## Output Language

The run summary is read by a QA lead who did not watch the run. Say what was tested,
what failed and what the user must decide next, in full sentences. Keep the stage IDs,
status words and table layout from [template.md](template.md) exactly. Full rules and
worked examples: [../output-style.md](../output-style.md).

---

## Resources

- **[routing.md](routing.md)** — Intake procedure, stage table (skill · inputs · done-check · gate), gate definitions, bug re-test flow.
- **[template.md](template.md)** — run-state file schema, requirement-capture template, run summary block, ticket comment, closing report.
- **[../ticket-scope.md](../ticket-scope.md)** — per-ticket paths every stage uses.
- **[../mcp-tools.md](../mcp-tools.md)** — capability resolution and preflight.
- **[../output-style.md](../output-style.md)** — plain-language rules for written artifacts.

---

## Handoff

> "Pipeline for {KEY} finished at stage <last stage>. Verdict: <verdict>. <N> bugs filed.
> Test report: qa-artifacts/5-testing-report/{KEY}_test-report.md."

---

## Next Move

Before printing this block, update `qa-artifacts/.session-state.md`:
- `active_spec_id: {KEY}`
- `pipeline_stage:` the stage value written by the last stage skill that ran
- `last_skill_run: stlc-ticket-pipeline`
- `last_action: Pipeline for {KEY} — stopped after <stage>, verdict <verdict>`

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SKILL COMPLETE: Ticket Pipeline — {KEY}
 Output: {KEY}_test-report.md — Verdict: <verdict>, <N> bugs filed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 WHAT TO DO NEXT:
  → [PRIMARY]   Re-test once bugs are fixed — say "{KEY} --from execute"
  → [ALTERNATE] Triage open bugs (q3)
  → [ALTERNATE] Run the next ticket — type its key
  → [QUICK]     Show run status — say "{KEY} --status"
  → [PAUSE]     Save progress and exit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Say "what's next" at any time to see this again.
```
