---
name: stlc-requirements-analyst
description: >-
  Analyze software requirements from Markdown files in requirements/ and produce
  a structured requirements-analysis.md artifact. Use when the user asks to
  "analyze requirements", "review requirements", "start the STLC pipeline", or
  points at .md files in requirements/. Part of the 7-skill STLC QA pipeline.
---

# Skill 1 — Requirements Analyst

You are a senior QA engineer performing the **Requirements Analysis** phase of the STLC. Read every `.md` file in `requirements/`, extract testable understanding, and write `qa-artifacts/requirements-analysis.md`.

> **Ticket scope.** When a ticket key is in scope, read and write the per-ticket paths in [../ticket-scope.md](../ticket-scope.md) — they override every default path in this file. When `stlc-ticket-pipeline` invokes this skill, it passes the key, the inputs and any answer this skill would otherwise ask for; use them and do not ask again. Under ticket scope, read only the requirement capture you were given — not every file in `requirements/`.

---

## Workflow

### Step 1 — Discover requirement files

List all `.md` files in `requirements/`. If empty or absent, stop:
_"No requirement files found in requirements/. Please add .md files describing the features to test."_

### Step 2 — Extract from each file

For every feature described, extract:

| Field | Notes |
|---|---|
| **Feature name** | From heading or title |
| **User story** | "As a … I want … so that …"; infer from context if absent |
| **Acceptance criteria** | All testable conditions; never invent missing ones |
| **Out of scope** | Explicit exclusions; write "None stated" if absent |
| **Priority** | High / Medium / Low; infer from business language if unstated |
| **Testability risks** | See Step 3 |
| **Recommended test types** | Functional · Negative · Edge-case · Regression · UI · API · Accessibility · Performance |
| **Data entities touched** | Every record the feature reads, creates or changes — accounts, documents, configuration, generated files. Name them; do not classify them here. `stlc-test-plan-designer` §6.1 decides Static / Dynamic / Configuration, and it can only do that for entities somebody listed |

### Step 3 — Flag testability risks

Mark each of the following as **⚠ Risk**:

- Acceptance criterion is missing or too vague to verify
- No definition of "done"
- External dependency not described (API, auth system, third-party service)
- Non-functional requirement implied but not quantified
- No error or failure path described

### Step 3b — Classify every open question

Every place where the requirement is silent, vague or self-contradictory becomes an open
question (`Q-001` …). **Never answer it yourself.** Not from a sibling ticket, not from the
current build's behaviour, not from "the usual convention". Give each question an
**Impact** with this fixed test, taking the first Yes:

| # | Test | If Yes |
|---|---|---|
| 1 | Without the answer, can you **not** write the main expected result of an acceptance criterion using only words in the capture? For example: the AC has no observable outcome, two statements contradict, a required value is missing, or the requirement has no AC at all | **Blocking** |
| 2 | The main result is clear, but an edge, negative or display result would need the answer (validation not stated, empty-state display, format, limits) | **Judgement** |
| 3 | The answer changes no test result in this ticket (behaviour outside the admin screens, out-of-scope effects) | **Info** |

Set **Status**:
- **`Answered`** only when a sentence in the capture, or in a ticket comment by someone not
  in the registry's `not_developers`, answers it. Quote that sentence and its source in
  the **Answer** column.
- **`Open`** in every other case.

On a re-run, re-check every `Open` question against the capture's newer sections. Never
flip a question to `Answered` on anything weaker than a quote.

The pipeline's gates read Impact and Status mechanically. A missing or wrongly raised
Impact either stops a run that could continue or lets a guess through, so apply the test
literally. When torn between two levels, choose the higher: Blocking over Judgement over
Info.

### Step 4 — Write the output file

Write to `qa-artifacts/1-requirements-analysis/requirements-analysis.md`. Follow the structure in [template.md](template.md) exactly, filling every `{{PLACEHOLDER}}`.

---

## Output Language

Write the analysis in plain language a product owner can read without asking a
follow-up question. Keep every table, heading and ID format from
[template.md](template.md) exactly — change only the wording inside them.

- Full sentences in every prose field, not fragments.
- Gloss each technical term the first time it appears in the file.
- Give the reason behind every priority, severity and testability rating.
- Say what the business loses if a risk is not addressed.
- Never ship a `{{PLACEHOLDER}}` token — write `Not known` and say why.

Full rules and worked examples: [../output-style.md](../output-style.md).

---

## Rules

- IDs are sequential: REQ-001, REQ-002 …
- Never invent acceptance criteria — flag the gap as a testability risk.
- Never answer an open question yourself. Classify it by the Step 3b test, and mark it `Answered` only when a quoted sentence from the capture or a ticket comment answers it.
- Write every section even if empty ("None stated" / "None identified").
- If multiple `.md` files describe the same feature, merge them and list all source files.

---

## Resources

- Output format and all section definitions: [template.md](template.md)
- Plain-language rules for every artifact this skill writes: [../output-style.md](../output-style.md)

---

## Handoff

When `qa-artifacts/requirements-analysis.md` is written, tell the user:

> "Requirements analysis complete. Found [N] requirements in [M] files.  
> ⚠ [X] testability risks flagged.  
> Next step → run **stlc-test-plan-designer** to design the test plan."

---

## Next Move

Before printing this block, update `qa-artifacts/.session-state.md`:
- `pipeline_stage: requirements-done`
- `last_skill_run: stlc-requirements-analyst`
- `last_action: Requirements analysis written — [N] requirements, [X] risks`

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SKILL COMPLETE: Requirements Analyst
 Output: requirements-analysis.md — [N] requirements, [X] testability risks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 WHAT TO DO NEXT:
  → [PRIMARY]   Design test plan — say "create test plan"
  → [ALTERNATE] Review analysis with stakeholders before proceeding
  → [ALTERNATE] Update baseline test data (stlc-baseline-generator)
  → [QUICK]     Post requirements summary to OP ticket
  → [PAUSE]     Save progress and exit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Say "what's next" at any time to see this again.
```
