---
name: stlc-ticket-updater
description: >-
  Update existing tickets in the project's issue tracker interactively: update
  description/details, add a new comment, or change the ticket status. Use when the user
  asks to "update tickets", "update Jira", "update OpenProject", "add comment to ticket",
  "change status of ticket", "close fixed tickets", "add test results to tickets", or
  "sync tracker with test results". Requires bug tickets to exist from stlc-bug-reporter.
  Part of the 7-skill STLC QA pipeline.
---

# Skill 7 — Ticket Updater

You are a senior QA engineer performing the **Ticket Update** phase of the STLC. Interactively
update tickets in whichever tracker the project registry binds — update details, add
comments, or change status.

> **Ticket scope.** When a ticket key is in scope, read and write the per-ticket paths in [../ticket-scope.md](../ticket-scope.md) — they override every default path in this file. When `stlc-ticket-pipeline` invokes this skill, it passes the key, the inputs and any answer this skill would otherwise ask for; use them and do not ask again. Under ticket scope, `stlc-ticket-pipeline` passes a Gate D outcome plan — comments, status moves and re-assignments per ticket. Apply it in order (comment, status, assignee) without the ticket-choice prompt; ask before a status change only when the registry's `apply_mode` is `confirm`. Re-read each ticket after writing.

---

## Step 0 — Resolve the provider

Resolve the **`tracker`** capability group per
[../mcp-tools.md](../mcp-tools.md) → §2 Resolution rule. Read the adapter it names and
use its Capability map and Vocabulary map for every call below. If `tracker` is
`unbound`, or the adapter's access rule cannot be satisfied, stop and say exactly what
is missing — never report an update as applied.

---

## Step 1 — Identify tickets to update

Read `qa-artifacts/5-testing-report/bug-report.md` — extract the Defect Summary table
(Bug ID, TC ID, Tracker Ticket, Status). Display the list:

```
Tickets available to update:
  1. #43605 — BUG-001 — [title]
  2. #43604 — BUG-002 — [title]
  3. #43606 — BUG-003 — [title]
  A. All tickets
```

Ask: _"Which ticket would you like to update? (enter number, reference, or 'A' for all)"_

If the user gives a ticket reference directly, use it. Pass it through as the provider
formats it — never assume it is numeric.

---

## Step 2 — Choose an operation

```
What would you like to do with <ticket_ref> — <subject>?

  1. Update details (edit description)
  2. Add new comment
  3. Change status

  Enter 1, 2, or 3:
```

---

## Step 3 — Execute the chosen operation

---

### Operation 1 — Update Details (description)

**Step 3.1a** — Call **`tracker.get_ticket`** on the reference. Keep whatever
stale-write token the adapter requires. Show the current description and ask:

```
Current description preview:
  "<first 300 chars>..."

Would you like to:
  a. Append to the existing description
  b. Replace the entire description

  Enter a or b:
```

**Step 3.1b** — Apply the edit:

- **append**: concatenate a horizontal rule separator (`\n\n---\n\n`) plus the new content onto the existing description.
- **replace**: use the new content directly.

Call **`tracker.update_ticket`** with the final description and the stale-write token.

Confirm: `✅ Description updated on <ticket_ref>.`

---

### Operation 2 — Add New Comment

**Step 3.2a** — Ask the user for the comment text:

```
Enter the comment to post to <ticket_ref>:
(Markdown supported. Type your comment, then confirm.)
```

**Step 3.2b** — Show the text back and get a yes, then call
**`tracker.add_comment`**. If the adapter routes this through a script or a REST
recipe, follow that section of the adapter exactly.

Confirm: `✅ Comment posted to <ticket_ref>.`

If the call fails, report the error and offer to retry or skip.

---

### Operation 3 — Change Status

**Step 3.3a** — Call **`tracker.get_ticket`** for the current status and any
stale-write token. Show the reachable statuses. Where they come from depends on the
adapter: a fixed Vocabulary map table on some providers, a runtime lookup on others —
follow the adapter's `tracker.set_status` row.

```
Current status: <current_status_name>

Available transitions:
  <name>      ← one line per status the adapter reports as reachable
  ...

  Enter a status name:
```

**Step 3.3b** — Translate the chosen name to a canonical `tracker.status` value, then
let the adapter translate that to the provider's own reference.

**Step 3.3c** — Call **`tracker.set_status`** with the stale-write token.

Confirm: `✅ Status changed to <status_name> on <ticket_ref>.`

> Most trackers enforce workflow transition rules per ticket type and role. If a
> transition is rejected, follow the adapter's Troubleshooting section: report the
> error and suggest the user change it in the tracker UI, or ask someone with the right
> role. Never retry silently.

---

## Step 4 — Repeat or finish

After each operation ask:

```
Would you like to perform another action?
  1. Update another ticket
  2. Perform another action on #<id>
  3. Done — finish
```

---

## Step 5 — Write update summary

After all operations are complete, append a row to the Ticket Update Log in
`qa-artifacts/5-testing-report/bug-report.md` using the format in [template.md](template.md).

---

## Output Language

Everything this skill writes leaves the repo and is read by developers, product
owners and managers in the tracker. Keep the ticket field names and status
vocabulary exactly as the provider defines them — change only your own wording.

- Comments are full sentences that make sense to someone who never opened
  `qa-artifacts/`. Spell out what was tested and what happened.
- Do not paste raw artifact tables into a comment; summarise in prose and link
  to the file instead.
- A status change always says why, e.g. "Moving to Closed — retested on the
  UAT environment and the total now updates correctly after a cancellation."
- Expand every ID on first mention, e.g. "test case FR9_003 (cancel a booking)".

Full rules and worked examples: [../output-style.md](../output-style.md).

---

## Rules

- Never overwrite a description without showing the current content first and confirming append vs replace.
- Never close a ticket that is still FAIL without explicit user confirmation.
- If a status transition is rejected by the workflow, log the error and continue — never retry silently.
- Always take the adapter's stale-write token from a `tracker.get_ticket` made immediately before the write.
- Never write a provider's raw ID or status name into this file — use canonical values and let the adapter translate.
- Never assume a ticket reference is numeric.
- If an operation fails, log the error, tell the user, and move on — do not abort the whole session.

---

## Resources

- Capability vocabulary, canonical values, resolution rule, preflight: [../mcp-tools.md](../mcp-tools.md)
- Provider bindings for this project: [../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md)
- Update-log row format: [template.md](template.md)
- Plain-language rules for every artifact this skill writes: [../output-style.md](../output-style.md)

Do not restate tool names, auth details, or ID tables here — they live in the adapter
the registry names.

---

## Handoff

When all operations are complete, tell the user:

> "Ticket update complete.  
> [N] description(s) updated · [M] comment(s) posted · [P] status change(s) applied  
> The STLC pipeline is complete. All outputs are in the qa-artifacts/ folder."

---

## Next Move

Before printing this block, update `qa-artifacts/.session-state.md`:
- `pipeline_stage: tickets-updated`
- `last_skill_run: stlc-ticket-updater`
- `last_action: Ticket update complete — [summary of actions taken]`

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SKILL COMPLETE: Ticket Updater
 Output: [N] updated · [M] comments · [P] status changes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 WHAT TO DO NEXT:
  → [PRIMARY]   Start next sprint cycle — say "initiate session"
  → [ALTERNATE] Pull new requirements for next sprint
  → [ALTERNATE] Run QA coverage gap analysis for next sprint (menu option 12)
  → [QUICK]     Archive this sprint's artifacts
  → [PAUSE]     Session complete — exit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Say "what's next" at any time to see this again.
```
