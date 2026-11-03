---
name: stlc-init-workspace
description: >-
  Initialise the qa-artifacts workspace by creating all required folders and
  placeholder files for the STLC pipeline. Use when the user asks to "init the
  workspace", "set up qa-artifacts", "create the output folders", "initialise
  the QA project", or at the very start of a new test cycle before any other
  STLC skill runs. Safe to re-run — existing files are never overwritten.
---

# Skill 0 — Workspace Initialiser

You are setting up the **qa-artifacts** workspace for a new STLC test cycle. Create the folder structure, seed placeholder files, and confirm everything is ready before the pipeline begins.

---

## Workflow

### Step 1 — Check if workspace already exists

Check whether `qa-artifacts/` exists in the project root.

- If it exists and is non-empty: tell the user which folders already exist and ask:
  _"qa-artifacts/ already exists. Should I reset it (delete existing artifacts) or keep existing files and only create missing folders?"_
  - **Reset**: delete `qa-artifacts/` and recreate from scratch.
  - **Keep**: create only the missing sub-folders; leave existing files untouched.
- If it does not exist: proceed directly to Step 2.

### Step 2 — Create folder structure

Create the following folders. Use the shell commands in [scripts/init.ps1](scripts/init.ps1) (Windows) or [scripts/init.sh](scripts/init.sh) (macOS/Linux).

```
qa-artifacts/
├── 0-sprint-tickets/
├── 1-requirements-analysis/
├── 2-test-plan/
├── 3-test-cases/
├── 4-execution-results/
│   └── screenshots/
├── 5-testing-report/
├── base-test/
├── qa-config/
└── qa-docs/
```

Also create `requirements/` in the project root if it does not exist — this is where the user places their `.md` requirement files.

### Step 3 — Seed README files

Write a `README.md` into each sub-folder explaining its purpose. Use the content from [template.md](template.md). Do not overwrite an existing `README.md`.

### Step 4 — Verify

List all created paths and confirm each folder exists. Report any failures.

### Step 5 — Create execute.env.md

If `qa-artifacts/base-test/execute.env.md` does not exist, create it using the `execute.env.md` template from [template.md](template.md).

Tell the user:
_"execute.env.md has been created at qa-artifacts/base-test/. Please fill in your Test Environment URL, accounts, and any third-party service credentials before running the pipeline."_

> If `qa-artifacts/base-test/execute.env.md` already exists, do NOT overwrite it — tell the user it was found and skipped.

### Step 6 — Create test-centralized.md

If `qa-artifacts/base-test/test-centralized.md` does not exist, create it using the `test-centralized.md` template from [template.md](template.md).

Tell the user:
_"test-centralized.md has been created at qa-artifacts/base-test/. This is the single source of truth for all QA/UAT test accounts. Update the credentials table if your project uses different accounts."_

> If `qa-artifacts/base-test/test-centralized.md` already exists, do NOT overwrite it — tell the user it was found and skipped.

### Step 7 — Seed the two registries

The scripts in [scripts/](scripts/) write both registry files into `qa-artifacts/qa-config/`
if they are absent. Neither is ever regenerated afterwards — from that point on both are
hand-maintained by the QA.

| File | Binds | Ships as |
|---|---|---|
| `tools.md` | each capability group (`tracker`, `browser`, `notify`) to a provider | `tracker` `unbound`, `browser` bound to `playwright` |
| `knowledge.md` | each knowledge source ID (`env`, `test-data`, `navigation`, `domain`, …) to a file | every source `unbound` |

Both ship deliberately unbound. **An unbound row is a question for the user, not a
default to guess at** — a skill that finds its row unbound stops and asks.

Tell the user:
_"Two registries created in qa-artifacts/qa-config/. Open tools.md to bind your tracker, and knowledge.md to bind your knowledge sources — every skill resolves through these two files, so nothing else needs editing when a tool or a knowledge file changes."_

> If either file already exists, do NOT overwrite it — say it was found and skipped.

### Step 8 — Explain `qa-docs/`

`qa-artifacts/qa-docs/` is created empty, with a README. It is the home of the `domain`
knowledge source: what the team has learned about the product's features, keeping **what
a spec says**, **what a run observed** and **what is still unknown** visibly apart.

It is the only folder under `qa-artifacts/` that is not generated and not per-cycle — it
outlives every test cycle, and it stays `unbound` in `knowledge.md` until the first file
is written.

---

## Output Language

The placeholder files you create are the first thing a new team member opens, so
each one must explain itself. Keep the folder names and file names exactly as
specified — change only the wording inside the files.

- Every placeholder file opens with one plain sentence saying what belongs in
  it and which skill fills it in.
- Write instructions to the reader as full sentences, not terse notes.
- Prefer "This file is filled in by the requirements analyst skill" over
  "TBD — auto-generated".

Full rules and worked examples: [../output-style.md](../output-style.md).

---

## Rules

- Never delete or overwrite files that already contain content.
- `qa-artifacts/base-test/execute.env.md` must never be overwritten if it already exists.
- `qa-artifacts/base-test/test-centralized.md` must never be overwritten if it already exists.
- `qa-artifacts/qa-config/tools.md` and `qa-artifacts/qa-config/knowledge.md` must never be overwritten if they already exist — they are hand-maintained by the QA from the moment they are seeded.
- **Never bind a registry row on the user's behalf.** Both registries ship unbound by design; guessing a tracker or a knowledge file is worse than asking.
- `.gitkeep` files in empty folders are optional — skip if not using git.
- Always confirm the final folder list to the user after creation.

---

## Resources

- Init scripts: [scripts/init.ps1](scripts/init.ps1) (Windows) · [scripts/init.sh](scripts/init.sh) (macOS/Linux)
- README content for each folder: [template.md](template.md)
- Knowledge contract — source IDs and the resolution rule the seeded `knowledge.md` serves: [../knowledge-sources.md](../knowledge-sources.md)
- Capability contract — the equivalent for the seeded `tools.md`: [../mcp-tools.md](../mcp-tools.md)
- Plain-language rules for every artifact this skill writes: [../output-style.md](../output-style.md)

---

## Handoff

When the workspace is ready, tell the user:

> "Workspace initialised.  
> qa-artifacts/ and requirements/ are ready.  
> execute.env.md created at qa-artifacts/base-test/ — fill in your environment URL, accounts, and test data before running the pipeline.  
> test-centralized.md created at qa-artifacts/base-test/ — update credentials if your project uses different accounts.  
> tools.md and knowledge.md created at qa-artifacts/qa-config/ — bind your tracker and your knowledge sources; every skill resolves through these two files.  
> qa-docs/ created empty — this is where feature and domain knowledge accumulates across cycles.  
> Next step → add your requirement .md files to requirements/ then run **stlc-requirements-analyst**."
