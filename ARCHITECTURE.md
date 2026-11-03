# Agent Architecture

This document describes the skills organisation for the QA Agent project.
**Use this file as the authoritative reference for every skill's location, group, and purpose.**

---

## Skills Location

All skills live in `.claude/skills/` (repo-relative from project root).
Each skill is a folder containing a `SKILL.md` entry point plus optional support files.

---

## Skills Organisation

### 1. Coordination

| Skill | SKILL.md | Role |
|---|---|---|
| `agent-coordination` | `.claude/skills/agent-coordination/SKILL.md` | Session entry point. Greets the user and presents the interactive action menu (Tracker · QA Pipeline · Code & Environment). Invoked automatically at session startup via `QA_AGENTS.md`. |

Support files:
```
.claude/skills/agent-coordination/
├── SKILL.md          ← entry point & menu logic
├── routing.md        ← option routing (op1–op7, q1–q4, c1–c2, post-skill completion)
└── template.md       ← Daily Summary Briefing format, session-state schema, Next Move block
```

---

### 2. STLC Pipeline Skills

Executed in sequence to complete one full test cycle.

| # | Skill | SKILL.md | Output |
|---|---|---|---|
| 0 | `stlc-init-workspace` | `.claude/skills/stlc-init-workspace/SKILL.md` | Creates `qa-artifacts/` folder structure |
| — | `stlc-baseline-generator` | `.claude/skills/stlc-baseline-generator/SKILL.md` | `qa-artifacts/base-test/*.md` |
| 1 | `stlc-requirements-analyst` | `.claude/skills/stlc-requirements-analyst/SKILL.md` | `qa-artifacts/1-requirements-analysis/requirements-analysis.md` |
| 2 | `stlc-test-plan-designer` | `.claude/skills/stlc-test-plan-designer/SKILL.md` | `qa-artifacts/2-test-plan/test-plan.md` |
| 3 | `stlc-testcase-designer` | `.claude/skills/stlc-testcase-designer/SKILL.md` | `qa-artifacts/3-test-cases/{SPEC_ID}_TestCases_{FIRST}-{LAST}.md` |
| 3b | `stlc-testcase-reviewer` | `.claude/skills/stlc-testcase-reviewer/SKILL.md` | `qa-artifacts/3-test-cases/{SPEC_ID}_ReviewFindings_{date}.md` (single ticket) or `qa-artifacts/3-test-cases/{sprint}/MissingTestCases_TechniqueReview_{date}.md` (sprint batch) |
| 4 | `stlc-manual-executor` | `.claude/skills/stlc-manual-executor/SKILL.md` | `qa-artifacts/4-execution-results/execution-log.md` + screenshots |
| 5 | `stlc-bug-reporter` | `.claude/skills/stlc-bug-reporter/SKILL.md` | `qa-artifacts/5-testing-report/bug-report.md` + tracker tickets |
| 6 | `stlc-test-reporter` | `.claude/skills/stlc-test-reporter/SKILL.md` | `qa-artifacts/5-testing-report/test-report.md` |
| 7 | `stlc-ticket-updater` | `.claude/skills/stlc-ticket-updater/SKILL.md` | Updates tickets in the bound tracker |
| 8 | `stlc-test-automator` | `.claude/skills/stlc-test-automator/SKILL.md` | Playwright spec in `playwright-automation/src/tests/` tagged `@{KEY}` + `qa-artifacts/6-automation/{KEY}_automation-report.md`. Automates only test cases that PASSED manually, then opens **one GitHub PR per ticket** into `dev` (built in a git worktree, only the ticket's files staged) and never merges it. `--fix-pr` addresses the QA's PR comments or a merge conflict |
| ✓ | `stlc-qa-reviewer` | `.claude/skills/stlc-qa-reviewer/SKILL.md` | Independent reviewer that approves every gate when `gate_mode: reviewer`: R1 analysis (A) · R2 test cases (B) · R3 execution results + screenshots (C) · R4 outcome plan (D) · R5 automation specs, re-run by itself. Verdict APPROVE / REWORK (≤ 2 rounds) / PARK. Writes `qa-artifacts/7-reviews/{KEY}_review.md`. Never edits what it reviews |
| ▶▶ | `stlc-qa-orchestrator` | `.claude/skills/stlc-qa-orchestrator/SKILL.md` | Orchestrates three subagents (`.claude/agents/`) for every ticket in QC or assigned to the QA account: **`stlc-worker`** runs the STLC stages intake → s7, each dispatch ending where a review is due; **`qa-reviewer`** independently decides every checkpoint — R1 analysis, R2 test cases, R3 results, R4 ticket outcome, R5 automation specs — up to 3 rounds, rework sent back to the producer; `/stlc-qa-orchestrator AP-1234` runs one ticket this way; **`qa-automator`** runs s8 only when manual testing passed ≥ 90% with no open High/Highest bug. Posts a status card per ticket at each phase in the chat. Writes `qa-artifacts/.pipeline/_batch-{DATE}.md` and `qa-artifacts/5-testing-report/{DATE}_qa-batch-report.md` |
| ▶ | `stlc-ticket-pipeline` | `.claude/skills/stlc-ticket-pipeline/SKILL.md` | Orchestrates Intake → 1 → 2 → 3 → 3b → 4 → 4c → 5 → 6 → 7 for one ticket key (4c corrects and re-runs test cases whose bug was confirmed not valid), with review gates and resume. Writes `requirements/{KEY}-{SLUG}.md`, `qa-artifacts/.pipeline/{KEY}.md` and, at the end of every run, `qa-artifacts/5-testing-report/{KEY}_run-summary.md`; every other artifact comes from the stage skills |

### Subagents (`.claude/agents/`) — dispatched by `stlc-qa-orchestrator`

| Agent | File | Runs | Returns |
|---|---|---|---|
| `stlc-worker` | `.claude/agents/stlc-worker.md` | `stlc-ticket-pipeline` for one ticket, a given stage range (intake → s7), stopping before each reviewed gate. Never s8, never reviews itself | `=== WORKER RESULT ===` incl. pass rate, open bugs, Jira status |
| `qa-reviewer` | `.claude/agents/qa-reviewer.md` | `stlc-qa-reviewer` at R1 (analysis), R2 (test cases), R3 (results), R4 (ticket outcome) or R5 (automation specs), rounds 1–3. Never edits | `=== REVIEW VERDICT ===` |
| `qa-automator` | `.claude/agents/qa-automator.md` | `stlc-test-automator` (s8) — only after the automation gate (≥ 90% pass, no open High/Highest bug). `--review external` (specs, no PR) → R5 → `--pr-only` | `=== AUTOMATION RESULT ===` |

The agents carry the standing rules (execution environment, credential handling, test data, evidence); the orchestrator's hand-offs carry only per-dispatch facts.

> **Stage names.** Users type and read plain stage names — `AP-1234 --from execute`,
> `--until review-cases`. The codes (`s1`–`s7`) stay as internal IDs and are still
> accepted. Name ↔ code table: `stlc-ticket-pipeline/SKILL.md` → *Stage names*.

> **▶ One-key run.** Typing a ticket key (`AP-1234`) at any point routes through
> `agent-coordination` Step 0 to `stlc-ticket-pipeline`, which runs the stages above in
> order. Every gate — A (after 1), B (after 3b), C (filing bugs), D (ticket outcome) — is
> decided by a fixed rule table (`routing.md` §3), switched by `gate_mode` in the registry's
> *Pipeline gate rules*. A rule fires only on cited evidence, never on an assumed answer.
> Open questions are classified Blocking / Judgement / Info by the analyst; Blocking ones
> are posted to the ticket and their cases stay BLOCKED. The run stops for the user only
> at stop points E1–E5. Gate D applies the *QA outcome rules*
> in `qa-artifacts/qa-config/tools.md` §2 — story comment + move to release, or bug
> re-test comment + close / re-open and re-assign. All artifacts follow the
> per-ticket paths in `.claude/skills/ticket-scope.md`.

> **▶▶ QA batch — orchestrator-workers.** `stlc-qa-orchestrator` selects every open
> ticket in the ready-for-QA status (`QC`) or assigned to the QA account — the selection
> lives in the registry's *QA orchestrator selection*, since this project has no
> sprints — plans every ticket by a fixed rule table (`routing.md` §1: skip · design-only ·
> resume · bug-retest · full), and hands each ticket to its own **general-purpose worker
> subagent**. A worker runs `stlc-ticket-pipeline` for its one ticket, then
> `stlc-test-automator` (s8). **Wave 1** (intake → s3b) runs up to 4 workers in parallel
> and never touches the browser. **Wave 2** (s4 → s7 + s8) runs one worker at a time,
> because there is one browser and one shared dealer account. Workers never ask the user
> and never write `.session-state.md`; the orchestrator batches their questions, checks
> every claimed artifact on disk, and writes one batch report. Each ticket's automation
> ends as a GitHub PR into `dev` that waits for the QA to merge; every batch run (or
> `--prs` alone) first follows up on open PRs — fixing what the QA commented, rebasing
> conflicts, and recording merges.

> **✓ Reviewer mode.** With `gate_mode: reviewer` in the registry, `stlc-qa-reviewer`
> approves every gate in place of the user, and stop points E1–E5 become its PARK rules
> (questions go to the ticket author, never to the QA). The orchestrator adds an
> independent `qa-reviewer` subagent at every checkpoint — R1 after analysis, R2 after
> test design, R3 between execution and bug filing, R4 before the ticket update, R5
> before the automation PR opens — so no worker's output is approved by the agent that
> produced it.

> **Step 3b is optional.** Run it between #3 and #4 to peer-review coverage before execution.
> It only writes its own findings file — promoting a proposed case into real TCs is a separate
> re-run of `stlc-testcase-designer`, which owns `{ID}_TestCases_*.md`.

Support files per skill (where present):
```
.claude/skills/stlc-<name>/
├── SKILL.md
├── template.md                  ← output document template
├── summary-report-template.md   ← (stlc-manual-executor only)
└── scripts/
    ├── init.sh                  ← (stlc-init-workspace, automation-framework-builder)
    └── init.ps1
```

---

### 3. Tracker Skills

Standalone skills for direct tracker access — callable from `agent-coordination` or
independently. **Provider-agnostic:** each resolves the `tracker` capability through
`qa-artifacts/qa-config/tools.md` and calls the adapter that row names, so the same skill works on
OpenProject, Jira, or any provider with an adapter.

| Skill | SKILL.md | Purpose |
|---|---|---|
| `tracker-fetch-sprint-tickets` | `.claude/skills/tracker-fetch-sprint-tickets/SKILL.md` | Fetch every ticket in a sprint by name |
| `tracker-get-ticket` | `.claude/skills/tracker-get-ticket/SKILL.md` | Fetch and display details of a single ticket |
| `tracker-manage-child-ticket` | `.claude/skills/tracker-manage-child-ticket/SKILL.md` | Create, update, or comment on a child ticket — owns every tracker write |

---

### 4. Infrastructure Skills

| Skill | SKILL.md | Purpose |
|---|---|---|
| `automation-framework-builder` | `.claude/skills/automation-framework-builder/SKILL.md` | Scaffold a Playwright + POM + Builder framework project |
| `scaffold-skill` | `.claude/skills/scaffold-skill/SKILL.md` | Create or audit a new agent skill following GOLDEN best practices |

Support files:
```
.claude/skills/automation-framework-builder/
├── SKILL.md
├── CHECKLIST.md
├── README.md
└── scripts/
    ├── init.sh
    └── init.ps1

.claude/skills/scaffold-skill/
├── SKILL.md
├── create.md      ← creation workflow
└── checklist.md   ← GOLDEN quality checklist
```

---

### 5. Shared Reference Documents

None of these is a skill — all are reference documents read by skills.
The tool-access layers are listed first, outermost (project-owned) to innermost, then the
knowledge-access layers, which follow the identical three-layer model.

```
qa-artifacts/qa-config/tools.md               ← project-owned, NOT part of the framework
```

**The project tool registry.** Written by the QA on this project. Binds each capability
group (`tracker`, `browser`, `notify`) to a provider, an adapter, and its settings.
This is the only file that changes when a project moves to a different tracker.

It lives under `qa-artifacts/` alongside the other QA-authored inputs
(`base-test/execute.env.md`, `base-test/test-centralized.md`). Like those, it is
**hand-written and never regenerated** — `stlc-init-workspace` seeds it once and then
leaves it alone.

```
.claude/skills/mcp-tools.md
```

**The capability contract.** The three-layer model, the resolution rule every skill's
Step 0 follows, the capability vocabulary, the canonical type / status / priority
values, the credential policy, the preflight, the adapter contract, and the rules for
skill authors. Read it before any skill that drives a browser or touches a tracker.

```
.claude/skills/knowledge-sources.md
```

**The knowledge contract.** The same three-layer model as `mcp-tools.md`, applied to
*standing knowledge* instead of tools: the resolution rule every skill's
`Step 0 — Resolve the knowledge sources` follows, the source-ID vocabulary
(`env`, `test-data`, `navigation`, `auth`, `env-check`, `api-baseline`, `cleanup`,
`domain`), the `State` handling, and the rules for skill authors.

**Skills must never hardcode a knowledge file path.** A skill names a source ID
(`navigation`), resolves it through the project registry, and reads whatever file that
row points at — so a project can hold its navigation knowledge in one file or in twelve
without any skill changing.

```
qa-artifacts/qa-config/knowledge.md           ← project-owned, NOT part of the framework
```

**The project knowledge registry.** Written by the QA on this project. §1 binds each
source ID to a file with a `State` and a `Last verified` date; §2 declares each skill's
**load set** — what it reads always, and what only when relevant. Adding a knowledge file
is one row, not nine skill edits, and a source can be declared `missing` so skills say
*"this is not known"* instead of inventing it.

Seeded once alongside `tools.md` and then hand-maintained — never regenerated.

```
.claude/skills/providers/
├── openproject.md   ← tracker adapter
├── jira.md          ← tracker adapter
├── playwright.md    ← browser adapter
├── slack.md         ← notify adapter
├── github.md        ← vcs adapter (branches, commits, pull requests — never merges)
└── resources/
    └── openproject-add-wp-comment.mjs
```

**Provider adapters.** One file per provider, each answering the same capability list:
how this provider implements each capability, how it names the canonical values, its
pitfalls, and its troubleshooting. Adding a provider means adding one adapter and one
registry row — **no skill changes**.

**Skills must never name a provider.** A skill names a capability
(`tracker.get_ticket`), resolves it through the registry, and calls the adapter. Tool
names, auth recipes, and ID tables live only in adapters.

```
.claude/skills/ticket-scope.md
```

**The per-ticket path contract.** The tokens (`{KEY}`, `{SPEC}`, `{RUN}`) and the path of
every STLC artifact when work is scoped to one ticket. Each `stlc-*` skill carries a
**Ticket scope** line pointing here; these paths override the skill's default paths
whenever a ticket key is in scope, so one ticket's artifacts never overwrite another's.

```
.claude/skills/agentic-ai-rules.md
```

Best practices for **writing agent skills** (structure, imperative verbs,
anti-patterns, path conventions, self-check).
Read this before creating or editing any skill.

```
.claude/skills/output-style.md
```

Plain-language rules for **artifacts written into `qa-artifacts/`** — full
sentences, glossing technical terms on first use, stating the reason behind every
rating, and naming what a real user loses. Every `stlc-*` skill carries an
`## Output Language` section that summarises these rules inline and links here,
and lists it under `## Resources`. The tracker and infrastructure skills do not
carry one yet. Structure, IDs and status vocabulary are explicitly out of scope
— those must stay exactly as each skill's `template.md` defines them, and a
table cell whose template caps its length may stay a compressed phrase.

---

## Project Folder Structure

```
Avantage/                            ← project root
├── CLAUDE.md                        ← session config (read first by agent)
├── ARCHITECTURE.md                  ← this file (skills & folder reference)
├── requirements/                    ← INPUT: user-provided .md requirement files
│                                       (place feature specs here before running the pipeline)
├── .claude/
│   └── skills/                      ← all agent skills (see Skills Folder Layout below)
└── qa-artifacts/                    ← QA workspace: generated artifacts + hand-written config
    ├── .session-state.md            ← pipeline stage tracker (written by every STLC skill)
    ├── .pipeline/                   ← {KEY}.md run state per ticket (stlc-ticket-pipeline)
    ├── qa-config/                   ← INPUT: project registries (hand-written)
    │   ├── tools.md                 ← which provider backs each capability group
    │   └── knowledge.md             ← which file backs each knowledge source ID
    ├── qa-docs/                     ← INPUT: domain & feature knowledge (`domain` source)
    │                                  not yet created — see qa-config/knowledge.md §3
    ├── base-test/                   ← reusable preconditions, test data, cleanup steps
    │   ├── 01-auth-steps.md
    │   ├── 02-test-data.md
    │   ├── 03-environment-check.md
    │   ├── 04-api-baseline.md
    │   └── 05-cleanup-steps.md
    ├── 1-requirements-analysis/     ← requirements-analysis.md
    ├── 2-test-plan/                 ← test-plan.md
    ├── 3-test-cases/                ← {SPEC_ID}_TestCases_{FIRST}-{LAST}.md
    │                                  {SPEC_ID}_ReviewFindings_{date}.md
    │                                  {sprint}/MissingTestCases_TechniqueReview_{date}.md
    ├── 4-execution-results/         ← execution-log.md
    │   └── screenshots/             ← {TC_ID}-step{N}-[pass|fail].png
    ├── 5-testing-report/            ← test-report.md · bug-report.md · {DATE}_qa-batch-report.md
    ├── 6-automation/                ← {KEY}_automation-report.md (stlc-test-automator)
    └── 7-reviews/                   ← {KEY}_review.md (stlc-qa-reviewer)
```

---

## Skills Folder Layout

```
.claude/skills/
│
├── mcp-tools.md                             ← capability contract & resolution rule
├── knowledge-sources.md                     ← knowledge contract & resolution rule
├── ticket-scope.md                          ← per-ticket artifact paths
├── agentic-ai-rules.md                      ← how to write skills
├── output-style.md                          ← how artifacts must read (plain language)
│
├── providers/                               ← [Provider adapters]
│   ├── openproject.md
│   ├── jira.md
│   ├── playwright.md
│   ├── slack.md
│   ├── github.md
│   └── resources/openproject-add-wp-comment.mjs
│
├── agent-coordination/                      ← [Coordination]
│   ├── SKILL.md
│   ├── routing.md
│   └── template.md
│
├── stlc-init-workspace/                     ← [STLC #0]
│   ├── SKILL.md
│   ├── template.md
│   └── scripts/ (init.sh · init.ps1)
│
├── stlc-baseline-generator/                 ← [STLC —]
│   ├── SKILL.md
│   └── template.md
│
├── stlc-requirements-analyst/               ← [STLC 1]
│   ├── SKILL.md
│   └── template.md
│
├── stlc-test-plan-designer/                 ← [STLC 2]
│   ├── SKILL.md
│   └── template.md
│
├── stlc-testcase-designer/                  ← [STLC 3]
│   ├── SKILL.md
│   ├── template.md
│   └── correction.md   ← correct/retire a TC after its bug is confirmed not valid
│
├── stlc-testcase-reviewer/                  ← [STLC 3b — optional, explicit-invocation only]
│   ├── SKILL.md
│   └── template.md
│
├── stlc-manual-executor/                    ← [STLC 4]
│   ├── SKILL.md
│   ├── template.md
│   └── summary-report-template.md
│
├── stlc-bug-reporter/                       ← [STLC 5]
│   ├── SKILL.md
│   └── template.md
│
├── stlc-test-reporter/                      ← [STLC 6]
│   ├── SKILL.md
│   └── template.md
│
├── stlc-ticket-updater/                     ← [STLC 7]
│   ├── SKILL.md
│   └── template.md
│
├── stlc-ticket-pipeline/                    ← [STLC ▶ one-ticket pipeline]
│   ├── SKILL.md
│   ├── routing.md      ← intake, stage table, gates, bug re-test flow
│   └── template.md     ← run-state file, requirement capture, summaries
│
├── stlc-test-automator/                     ← [STLC 8]
│   ├── SKILL.md
│   ├── template.md     ← automation report, code-writing order, spec skeleton, PR body
│   └── pr.md           ← workbench check, opening the PR, fix mode for PR comments
│
├── stlc-qa-reviewer/                        ← [STLC ✓ gate reviewer]
│   ├── SKILL.md
│   ├── checklists.md   ← severities, R1–R5 checklists, E1–E5 reviewer rules
│   └── template.md     ← review record, verdict block
│
├── stlc-qa-orchestrator/                    ← [STLC ▶▶ orchestrator-workers]
│   ├── SKILL.md
│   ├── routing.md      ← selection, planning rules, wave order, worker hand-offs, result checks, PR follow-up
│   └── template.md     ← batch run state, batch report, closing report
│
├── tracker-fetch-sprint-tickets/            ← [Tracker]
│   ├── SKILL.md
│   └── template.md
│
├── tracker-get-ticket/                      ← [Tracker]
│   └── SKILL.md
│
├── tracker-manage-child-ticket/             ← [Tracker]
│   ├── SKILL.md
│   └── template.md
│
├── automation-framework-builder/            ← [Infrastructure]
│   ├── SKILL.md
│   ├── CHECKLIST.md
│   ├── README.md
│   └── scripts/ (init.sh · init.ps1)
│
└── scaffold-skill/                          ← [Infrastructure]
    ├── SKILL.md
    ├── create.md
    └── checklist.md
```
