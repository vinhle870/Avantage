---
name: stlc-qa-reviewer
description: >-
  Independently review one ticket's QA work and decide its gates, so no manual review is
  needed: requirements analysis (Gate A), test cases (Gate B), execution results and
  their screenshots (Gate C), the ticket outcome plan (Gate D) and the Playwright
  automation specs (re-running them itself). Returns APPROVE, REWORK with numbered
  findings, or PARK, and writes a review record. Use when the user says "review the
  results for AP-1234", "review the automation specs", "review AP-1234", or when
  gate_mode is reviewer and stlc-ticket-pipeline, stlc-qa-orchestrator or
  stlc-test-automator reaches a checkpoint. Part of the STLC QA pipeline.
---

# Skill — QA Reviewer

Review one checkpoint of one ticket against fixed checklists, decide its gate, and return a verdict the caller acts on without asking the user.

**Ticket scope:** every path follows [../ticket-scope.md](../ticket-scope.md).

---

## Input

| Input | Required | Example |
|---|---|---|
| `ticket_ref` | Yes | `AP-2487` |
| `checkpoint` | Yes | `R1` analysis · `R2` test cases · `R3` execution results · `R4` outcome plan · `R5` automation · `all` (R3 + R4 + R5 on finished work) |
| `round` | No | `1` (default) or `2` — the rework round this review belongs to |

---

## Workflow

### Step 0 — Resolve and read fresh

1. Resolve **`tracker`** per [../mcp-tools.md](../mcp-tools.md) → §2 Resolution rule. Not `active` → review files only, and return `PARK` for any decision that needs a tracker read.
2. Read the run state `qa-artifacts/.pipeline/{KEY}.md` and the requirement capture.
3. **Fresh-eyes rule.** Read every artifact of the checkpoint from disk now. Never rely on memory of having written it — if you wrote it in this context, review the file, not your recollection.

### Step 1 — Run the checkpoint's checklist

Apply the checklist for `checkpoint` from [checklists.md](checklists.md), every item, in order. Record each finding as `F-n · severity · where (file + TC/step or line) · what is wrong · required fix`. Severity: **Blocker** · **Major** · **Minor** ([checklists.md](checklists.md) §0).

### Step 2 — Decide the gate

For R1–R4, evaluate the gate's rule table in `stlc-ticket-pipeline` [routing.md](../stlc-ticket-pipeline/routing.md) §3 on the reviewed artifacts. Every stop point E1–E5 is replaced by the reviewer rule in [checklists.md](checklists.md) §6 — never stop for the user.

### Step 3 — Give the verdict

| Verdict | When | The caller does |
|---|---|---|
| `APPROVE` | No Blocker or Major finding | Applies the gate decision and continues |
| `REWORK` | ≥ 1 Blocker or Major, and `round` < 3 | Re-runs the named stage with the findings in its hand-off, then calls this review again with `round + 1` |
| `PARK` | A finding needs a fact only someone outside QA has, or `round` = 3 still has Blocker/Major findings | Posts the park reason on `{KEY}` via `tracker-manage-child-ticket`, marks the affected cases BLOCKED, and continues with the rest |

Minor findings never block. They are listed in the record and the final report.

### Step 4 — Write the record

Append a section to `qa-artifacts/7-reviews/{KEY}_review.md` ([template.md](template.md) §1). Create the file and folder if missing; never rewrite earlier sections. Then return the verdict block ([template.md](template.md) §2) as the last thing in the reply.

---

## Rules

- **Review, never fix.** The reviewer does not edit any artifact or spec. Every fix goes back to the skill that owns the file, through `REWORK`.
- **Never approve on trust.** Every claim is checked on disk: a PASS needs a concrete actual result and an existing screenshot; a spec needs a run the reviewer performed itself.
- **Never answer a product question by assumption.** If the decision needs the intended behaviour and no capture sentence or ticket comment states it, the verdict for that item is `PARK`, not a guess.
- **Never stop for the user.** Every gate and every stop point ends in `APPROVE`, `REWORK` or `PARK`.
- **At most two rework rounds per checkpoint.** Round 3 with Blocker/Major findings → `PARK`.
- **Run independently when you can.** A caller that is not itself a subagent launches this review as a general-purpose subagent with only the ticket key and checkpoint. Inside a subagent, run inline under the fresh-eyes rule.
- **Never write `qa-artifacts/.session-state.md`** when called by a pipeline, orchestrator or automator — only when the user invoked the review directly.
- Treat a ticket reference as opaque. Never assume it is numeric.

---

## Output Language

The review record is read by a QA lead who skipped the manual review and must trust this
one. Every finding names the file, the test case and step (or code line), what is wrong
and the exact fix, in full sentences. Keep checkpoint IDs, severities and verdict words
from [template.md](template.md) exactly. Full rules and worked examples:
[../output-style.md](../output-style.md).

---

## Resources

- **[checklists.md](checklists.md)** — severities, the R1–R5 checklists, and the reviewer replacement for stop points E1–E5.
- **[template.md](template.md)** — review record section and the verdict block.
- **[../stlc-ticket-pipeline/routing.md](../stlc-ticket-pipeline/routing.md)** §3 — the gate rule tables.
- **[../ticket-scope.md](../ticket-scope.md)** — per-ticket paths.
- **[../mcp-tools.md](../mcp-tools.md)** — capability resolution.
- **[../output-style.md](../output-style.md)** — plain-language rules for written artifacts.

---

## Handoff

> "Review {checkpoint} for {KEY}: <verdict> — <B> blocker, <M> major, <m> minor findings.
> Record: qa-artifacts/7-reviews/{KEY}_review.md."

---

## Next Move

Only when the user invoked this review directly, update `qa-artifacts/.session-state.md`:
- `pipeline_stage: review-done`
- `last_skill_run: stlc-qa-reviewer`
- `last_action: {KEY} review {checkpoint} — <verdict>, <N> findings`

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SKILL COMPLETE: QA Reviewer — {KEY} {checkpoint}
 Output: {KEY}_review.md — <verdict>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 WHAT TO DO NEXT:
  → [PRIMARY]   Apply the rework — say "{KEY} --from <stage name, e.g. design or execute>"
  → [ALTERNATE] Review another checkpoint — say "review {KEY} R5"
  → [ALTERNATE] Run the next ticket — type its key
  → [PAUSE]     Save progress and exit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Say "what's next" at any time to see this again.
```
