---
name: tracker-get-ticket
description: >-
  Fetch and display the details of one ticket from the project's issue tracker —
  metadata and description only. Use when the user asks to "show ticket #XXX", "get
  details of #XXX", "view ticket", or "what is ticket #XXX". Works with whichever
  tracker the project registry binds — OpenProject, Jira, or another.
---

# Skill — Get Ticket Details

Fetch a single ticket and render its detail card.

---

## Input

| Input | Required | Example |
|---|---|---|
| `ticket_ref` | Yes | `43040` (OpenProject) · `PROJ-42` (Jira) |

Pass the reference through exactly as the user gave it. Never assume it is numeric.

---

## Workflow

### Step 0 — Resolve the provider

Resolve the **`tracker`** capability group per
[../mcp-tools.md](../mcp-tools.md) → §2 Resolution rule. Read the adapter it names and
use its Capability map. If `tracker` is `unbound`, stop and ask.

### Step 1 — Fetch the ticket

Call **`tracker.get_ticket`** with the reference. Nothing else — do **not** fetch
children or the activity log.

---

## Output Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 <ticket_ref> — <subject>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Project    : <project name>
 Type       : <type>
 Status     : <status>
 Priority   : <priority>
 Sprint     : <sprint name or —>
 Assignee   : <assignee name or Unassigned>
 Author     : <author name>
 Parent     : <parent_ref> — <parent title>  (or None)
 Start      : <start date or —>
 Due        : <due date or —>
 Progress   : <percent done>%
 Estimated  : <estimate or —>
 Created    : <created at>
 Updated    : <updated at>
 Attachments: <count>
 Link       : <ticket URL from the adapter>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Description
<description — or "(no description)" if empty>
```

Show status, type and priority using the **provider's own names**, not the canonical
vocabulary — this card is read against the tracker UI. Show `—` for any field the
provider does not return.

---

## Rules

- Only call `tracker.get_ticket` — no additional calls.
- If the ticket is not found, tell the user: `Ticket <ticket_ref> not found.`
- Never truncate the description — render it in full.
- Convert an ISO 8601 estimate to something readable: `PT8H` → `8h`, `PT4H30M` → `4h 30m`.

---

## Resources

- Capability vocabulary, resolution rule, preflight: [../mcp-tools.md](../mcp-tools.md)
- Provider bindings for this project: [../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md)
