---
description: Best practices for authoring Agent skills and workflows
---

# Authoring rules for Agentic AI

## Structure

- **YAML frontmatter:** `name` / `description` — when to activate the skill.
- **Goal** in 1–3 lines; **Prerequisites**; numbered **Steps** with **Action** / **Gate** where needed.

## Write for execution

- **Imperative verbs:** “**Read** `path`”, not “the agent should consider reading”.
- **Tools:** Use real tool names (**Read**, **Write**, **Grep**, **Shell**, **StrReplace**) — not obsolete IDE-only names unless your runtime still maps them.

## Anti-patterns

- Vague steps; wrapping APIs with zero value; `sleep` instead of assertions; committing secrets.

## Paths

- Repo-relative from project root: `testing/...`, `specs/...`, `.agents/...`. One convention per repo.

## Self-check

- Before saving: “Are env/credentials/scope assumptions explicit?” “Any duplicate content in this file?”

## Optional

- **Turbo:** comment `// turbo` above a step to auto-run safe shell commands when your agent supports it.

**Golden rule:** Deterministic instructions — ambiguous rules get interpreted randomly.
