# Scaffold Skill — Defect Mode (harness defect audit)

Used when a skill misbehaved during real use (QA_AGENTS.md → *Skill Defect Rule*). Unlike a
plain Review, it starts from **evidence** and finds the text that caused it. That text is
often in a *different* skill or adapter from the one that ran.

## Input

| Input | Example |
|---|---|
| Skill that produced the output | `stlc-bug-reporter` |
| Evidence | "AP-2552 description is 52 lines; the shape allows about 15" |
| Artifact (optional) | ticket key, file path, result block |

Do not ask for anything the caller already gave. Ask only if the skill cannot be identified.

## Step D1 — Map the step that went wrong

Read the producing skill's `SKILL.md` and support files. Then list **every other file
that instructs the same step**:

- skills it hands work to or is called by (grep `.claude/skills` and `.claude/agents` for
  its name);
- the adapter in `.claude/skills/providers/` for any capability the step uses;
- the agent definition that runs it (`.claude/agents/*.md`);
- the checklist of the reviewer that should have caught it (`stlc-qa-reviewer`).

## Step D2 — Trace the defect

For each file in the map, quote the lines that govern the failed step. Classify the cause:

| Cause | Meaning |
|---|---|
| `conflict` | Two files give different instructions for the same step |
| `stale` | A file predates a newer rule and was never updated (check `git log`, mtime) |
| `bypass` | A recipe lets the agent skip the step that enforces the rule |
| `vague` | The rule exists but is not testable (no number, no example) |
| `no-check` | No reviewer or gate verifies the output against the rule |
| `missing` | No rule covers this at all |

A defect usually has more than one cause. Report all of them.

## Step D3 — Run the GOLDEN checklist

Run Step R2 of SKILL.md on the producing skill, and on any other file Step D2 blamed.

## Step D4 — Report and propose the fix

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 HARNESS DEFECT: <one line>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 EVIDENCE   <what was produced vs what the rule says>
 CAUSES     conflict — <file:line> says X; <file:line> says Y
            no-check — no reviewer verifies <output>
 FIX        1. <file:line> — before: "…" → after: "…"
            2. …
 CHECK      <how the next run proves it fixed: reviewer item, eval, grep>
 RECORDS    <existing outputs the defect left wrong, and how to repair them>
 GOLDEN     <n> ❌  <n> ⚠
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Rules for the fix:
- Fix the source of truth and make the other files point to it. Never copy the rule
  into a second place.
- Every `no-check` cause gets a check, usually one item in the reviewer's checklist.
- Keep each change minimal. Do not restyle files beyond the defect.
- **Apply only after the user agrees**, then re-run Step D2 on the changed files to
  confirm no conflict remains. Repairing `RECORDS` is a separate user decision.
