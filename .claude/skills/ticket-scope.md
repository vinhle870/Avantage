# Ticket Scope — Per-Ticket Artifact Paths

Where each STLC artifact lives when the work is scoped to **one tracker ticket**. This is
a reference document, not a skill — nothing invokes it directly.

Every `stlc-*` skill names a default output path (`requirements-analysis.md`,
`bug-report.md`, …). Those defaults hold one feature at a time, so a second ticket
overwrites the first. When a ticket key is in scope, the paths below **override** the
skill's defaults, for inputs and outputs alike.

---

## 1. When ticket scope applies

A ticket key is **in scope** when any of these is true:

- `stlc-ticket-pipeline` invoked the skill and passed the key.
- The user's message names a ticket key (`AP-1234`, `PROJ-42`, `43040`).
- The input file the skill was pointed at already carries a key prefix
  (`AP-2437_test-plan.md`, `AP2437_TestCases_001-005.md`).

Without a key, the skill's own default paths apply unchanged.

---

## 2. Tokens

| Token | Meaning | Example |
|---|---|---|
| `{KEY}` | The ticket reference exactly as the tracker returns it | `AP-2437` |
| `{SPEC}` | `{KEY}` with every non-alphanumeric character removed — the test-case ID prefix | `AP2437` |
| `{SLUG}` | The ticket subject in lowercase, words joined by `-`, at most 6 words | `acceptance-waiver-form-in-chubb` |
| `{RUN}` | The run folder: the ticket's sprint name, else its fix version, else asked once | `5.1.0` |
| `{DATE}` | ISO date of the run | `2026-10-03` |

A ticket reference is opaque — never assume it is numeric or hyphenated.

---

## 3. Paths

| Artifact | Written by | Path |
|---|---|---|
| Requirement capture | `stlc-ticket-pipeline` (Intake) | `requirements/{KEY}-{SLUG}.md` |
| Requirements analysis | `stlc-requirements-analyst` | `qa-artifacts/1-requirements-analysis/{KEY}_requirements-analysis.md` |
| Test plan | `stlc-test-plan-designer` | `qa-artifacts/2-test-plan/{KEY}_test-plan.md` |
| Test cases | `stlc-testcase-designer` | `qa-artifacts/3-test-cases/{SPEC}_TestCases_{FIRST}-{LAST}.md` |
| Review findings | `stlc-testcase-reviewer` | `qa-artifacts/3-test-cases/{SPEC}_ReviewFindings_{DATE}.md` |
| Execution log | `stlc-manual-executor` | `qa-artifacts/4-execution-results/{RUN}/execution-log_{KEY}_{DATE}.md` |
| Screenshots | `stlc-manual-executor` | `qa-artifacts/4-execution-results/screenshots/{RUN}/{KEY}/` |
| Bug report | `stlc-bug-reporter` | `qa-artifacts/5-testing-report/{KEY}_bug-report.md` |
| Test report | `stlc-test-reporter` | `qa-artifacts/5-testing-report/{KEY}_test-report.md` |
| Pipeline run state | `stlc-ticket-pipeline` | `qa-artifacts/.pipeline/{KEY}.md` |
| Automation PR | `stlc-test-automator` | branch `qa-automation/{KEY}` → `dev` (registry `vcs` §5), built in `.worktrees/{KEY}` |
| Run summary | `stlc-ticket-pipeline` (+ `## Automation` from `stlc-test-automator`) | `qa-artifacts/5-testing-report/{KEY}_run-summary.md` — rewritten at the end of every run, so it always describes the latest one |
| Automation report | `stlc-test-automator` | `qa-artifacts/6-automation/{KEY}_automation-report.md` |
| Automation spec | `stlc-test-automator` | `playwright-automation/src/tests/<portal>/<feature>_{SPEC}.spec.ts`, tagged `@{KEY}` |
| Review record | `stlc-qa-reviewer` | `qa-artifacts/7-reviews/{KEY}_review.md` (appended, one section per review) |
| QA batch run state | `stlc-qa-orchestrator` | `qa-artifacts/.pipeline/_batch-{DATE}.md` |
| QA batch report | `stlc-qa-orchestrator` | `qa-artifacts/5-testing-report/{DATE}_qa-batch-report.md` |

When a stage reads "the latest" execution log for a ticket, it takes the file with the
newest `{DATE}` in `qa-artifacts/4-execution-results/{RUN}/` whose name contains `_{KEY}_`.

---

## 4. Rules

- **Never write a ticket's artifact to the unprefixed default path** while a key is in
  scope — that file may hold another ticket's work.
- **Never overwrite an existing requirement capture.** It may carry hand-written scope
  clarifications from the QA. Append a dated section instead (see
  `stlc-ticket-pipeline/template.md` §2).
- Set `active_spec_id` in `qa-artifacts/.session-state.md` to `{KEY}` and record every
  path written under `artifacts:`.
- A skill that cannot resolve `{RUN}` from the ticket asks the user once, then records
  the answer in the run-state file so no later stage asks again.
