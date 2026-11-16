# QA Agents — Session Startup

## Auto-Invocation Rule

At the start of **every** new session — on the very first user message — automatically read and execute `.claude/skills/agent-coordination/SKILL.md` without waiting for the user to ask.

This means: greet the user and display the QA Agent action menu immediately, before responding to anything else.

**Exception — a bare ticket key.** If the message is a ticket key such as `AP-1234`
(optionally with `--auto`, `--from <stage>`, `--until <stage>` or `--status`), follow the
skill's **Step 0 — Ticket Key Rule**: greet in one line and run `stlc-ticket-pipeline`
instead of showing the menu.

**Trigger phrases that also invoke this skill mid-session:**
- "daily standup"
- "initiate session"
- "start qa session"
- "qa next"
- "what's my next move"
- "good morning" / "good afternoon" / "good evening"

## Skill Defect Rule — audit the harness whenever a skill misbehaves

A **harness defect** is a fault in the skills, agents or templates themselves, not in the
application under test or the environment. Treat any of these, seen while a skill is in
use, as one:

- What a skill produced breaks that skill's own template or rules (e.g. a bug ticket
  description far longer than the *bug description shape*).
- Two skills, or a skill and an adapter, give conflicting instructions for the same step.
- An agent skipped or bypassed a step its skill makes mandatory.
- A reviewer finding, or a REWORK that repeats, traces back to wording in a skill.
- The user says something a skill produced is wrong, too long, or not in the template.

When one is found:

1. Make the current item safe first (finish or stop it). Never leave a ticket half-written.
2. Run `scaffold-skill` in **Defect mode** (its `defect-audit.md`) on the skill that
   produced the output. Pass the skill name and the evidence, so it does not ask. It also
   cross-checks the skills and adapters on the same step.
3. Report the audit, the root cause with file:line references, and the proposed fix as
   before/after text for each file. Also report the existing records the defect left
   wrong (e.g. tickets already filed).
4. **Apply the fix only after the user agrees.** Skill files drive every future run.
   Repairing the records already produced is a separate decision, also the user's.

**Subagents** (`stlc-worker`, `qa-reviewer`, `qa-automator`) do not run the audit. They add
a `harness_defect: <skill> — <what happened, with evidence>` line to their result block,
and the orchestrator runs the audit after the batch report. Batch work is not stopped for it.
