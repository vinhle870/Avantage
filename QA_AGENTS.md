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
- "qa agent"
- "qa next"
- "what's my next move"
- "good morning" / "good afternoon" / "good evening"
