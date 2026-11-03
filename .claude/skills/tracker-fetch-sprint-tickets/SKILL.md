---
name: tracker-fetch-sprint-tickets
description: >-
  Fetch every ticket in a sprint from the project's issue tracker by sprint name.
  Accepts a sprint name such as "Sprint 08/06/2026" and an optional project name or key.
  Use when the user asks to "list tickets in sprint", "show sprint tickets", "get sprint
  work packages", "fetch sprint", or provides a sprint name like "Sprint DD/MM/YYYY".
  Works with whichever tracker the project registry binds — OpenProject, Jira, or another.
---

# Skill — Fetch Sprint Tickets

Fetch every ticket belonging to a named sprint in the project's issue tracker.

---

## Inputs

| Input | Required | Example |
|---|---|---|
| `sprint_name` | Yes | `Sprint 08/06/2026` |
| `project` | Yes* | `DrivingHope` |

\* If the user does not supply a project, read `qa-artifacts/.session-state.md` for
`active_sprint` context, then the registry's `default_project`. If it is still unknown,
ask: _"Which project should I search?"_ — never assume.

---

## Workflow

### Step 0 — Resolve the provider

Resolve the **`tracker`** capability group per [../mcp-tools.md](../mcp-tools.md) → §2
Resolution rule. Read the adapter it names and use its Capability map for every call
below. If `tracker` is `unbound`, stop and ask.

### Step 1 — Resolve the project

If the user gave a project name, call **`tracker.list_projects`** to get the provider's
project reference. If they gave a reference the adapter accepts directly, use it as-is.

### Step 2 — Find the sprint by name

Call **`tracker.list_sprints`** for the resolved project. Match the sprint name
case-insensitively and trimmed.

If there is no exact match, show the user every sprint returned and ask them to confirm
the right one. If the provider returns no sprints at all, tell the user the project has
no sprints configured.

### Step 3 — Fetch every ticket in the sprint

Call **`tracker.list_sprint_tickets`** for the resolved project and sprint. Sort by
status, then by ticket reference, ascending.

> Honour the adapter's paging rule — several providers cap a page well below the sprint
> size and will silently return a partial list otherwise.

### Step 4 — Display results

Print the table and the status summary from [template.md](template.md) §1 and §2.

### Step 5 — Save to file

Write the full list to `qa-artifacts/0-sprint-tickets/` using the filename convention
and file format in [template.md](template.md) §3. Then tell the user:
_"Saved to qa-artifacts/0-sprint-tickets/<filename>"_

---

## Rules

- Always show the sprint name and project name in the heading.
- Truncate subjects longer than 80 characters with `…`.
- If the sprint has 0 tickets, say so clearly and do not print an empty table.
- Never guess a sprint reference — always look it up in Step 2.
- Never assume a ticket reference is numeric; pass through whatever the adapter returns.

---

## Resources

- Output formats, filename convention, Next Move block: [template.md](template.md)
- Capability vocabulary, resolution rule, preflight: [../mcp-tools.md](../mcp-tools.md)
- Provider bindings for this project: [../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md)

---

## Next Move

Update `qa-artifacts/.session-state.md` and print the block in
[template.md](template.md) §4.
