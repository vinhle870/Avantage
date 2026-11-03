---
name: tracker-manage-child-ticket
description: >-
  Create, update, or comment on a child ticket (sub-task, bug, task) under a parent
  ticket in the project's issue tracker. Accepts a parent ticket reference and ticket
  details. Use when the user asks to "create a subtask", "add a bug under ticket",
  "create child ticket", "log a bug for ticket #XXX", "add subtask to #XXX", "update
  ticket #XXX", "add comment to #XXX", "post a comment on ticket", or provides a parent
  ticket reference and wants to create, modify, or comment on a child. Works with
  whichever tracker the project registry binds — OpenProject, Jira, or another.
---

# Skill — Create / Update / Comment on a Child Ticket

Create a child ticket under a parent, update an existing ticket, or post a comment.
This skill owns every tracker **write** — other skills route through it so the
confirmation prompts and logging stay consistent.

---

## Inputs

| Input | Required | Default | Notes |
|---|---|---|---|
| `parent_ref` | For create | — | Reference of the parent ticket |
| `action` | Yes | — | `create`, `update`, or `comment` |
| `ticket_ref` | For update / comment | — | Reference of the existing ticket |
| `subject` | For create | — | Title of the new child |
| `type` | No | `subtask` | Canonical `tracker.type` value |
| `description` | No | — | Markdown body |
| `status` | No | `todo` | Canonical `tracker.status` value |
| `priority` | No | `normal` | Canonical `tracker.priority` value |
| `assignee` | No | — | Display name — resolved, never guessed |
| `sprint` | No | inherits parent's | Sprint reference |
| `start_date` / `due_date` | No | — | `YYYY-MM-DD` |
| `estimate` | No | — | ISO 8601 duration, e.g. `PT4H` |
| `comment` | For comment | — | Markdown body of the comment |
| `bug_report_file` | **For create when `type` is `bug`** | — | Path to the `bug-report.md` the defect is written in. **Required** — see *Creating a bug ticket* below |
| `bug_id` | **For create when `type` is `bug`** | — | The `BUG-XXX` heading to lift from that file |

Canonical values are defined in [../mcp-tools.md](../mcp-tools.md) → §4. The adapter
translates them — never write a provider's raw ID or status name here.

---

## Creating a bug ticket — two hard rules

These apply whenever `type` is `bug`. They exist because a defect that reads differently
in the tracker than in the QA record is a defect nobody can trace, and evidence a reader
has to scroll to find is evidence they will miss.

### Rule 1 — The description comes from the bug report file, never composed here

**Never write a bug description from memory, from the execution log, or by summarising.**
Read the `BUG-XXX` section of the file at `bug_report_file` and use *its* content as the
ticket description.

- If `bug_report_file` is not supplied, or the `bug_id` heading is not in it, **stop and
  say so.** Do not compose a description instead. A bug report is written by
  `stlc-bug-reporter` precisely so the ticket and the QA record cannot drift apart.
- Carry over only what a developer acts on: Summary, environment and reproducibility,
  Steps to Reproduce, Expected Result, Actual Result, and a Note only when it changes
  what the developer does. Follow the *bug description shape* in [template.md](template.md).
- Condense, never invent: shorten the report's wording to one line each for Summary,
  Expected and Actual, and at most 6 steps — but every fact must come from the report.
- Leave out "Why it matters", Suggested Root Cause, analysis, local artifact paths and any
  pointer to the bug-report file. They stay in the bug report on disk.
- Convert to whatever body format the adapter's *Description format* section names. Do
  not invent a format.

### Rule 1b — Every bug is self-contained. Never cross-reference another ticket

**A developer who opens one bug ticket and nothing else must be able to reproduce it.**
They will not have the other tickets open, the bug report to hand, or any memory of the
test run.

Banned outright in Steps to Reproduce:

| Never write | Write instead |
|---|---|
| *"Create a contract as described in BUG-002 steps 1 to 3"* | The three steps, spelled out again in full |
| *"Set up the quote as in the previous bug"* | Every field and value, again |
| *"Take that client's quote through to a contract"* | Each page, control and value the flow needs |
| *"Log in and navigate to the usual page"* | The route, and the account resolved from `env` |

**Repetition between tickets is correct and expected.** Five bugs found in one flow will
each restate that flow, and that is the right trade: a duplicated setup block costs a
screenful, while a cross-reference costs the developer a hunt through the tracker and
often a reply asking what the other ticket said.

Each step is one concrete action with the real values in it — the route, the exact button
label in quotes, and every field value typed. A step a reader has to interpret is a step
two people will perform differently, and then the bug "does not reproduce".

Where a prerequisite may already be satisfied, say so inline rather than omitting it —
*"choose "10 ans" and click Save (skip if it is already linked)"*.

**The same rule applies to the bug report itself.** If a `BUG-XXX` section in
`bug-report.md` cross-references another bug, fix the report first — it is the source
Rule 1 lifts from, so patching only the ticket puts the two out of step.

### Rule 2 — Screenshots go in the description, not in a comment

**Every screenshot listed in the bug's Evidence section is embedded in the ticket
description.** A reader must see the evidence in the ticket body, without opening an
attachment or scrolling to a comment.

This forces a three-call sequence, because an image cannot be referenced before it
exists:

1. **`tracker.create_ticket`** — with the description from Rule 1, its Evidence section
   left as a placeholder heading.
2. **`tracker.attach_file`** — once per screenshot, following the adapter's recipe.
   Keep the filename each call returns.
3. **`tracker.update_ticket`** — rewrite the description with the images embedded under
   the Evidence heading, using the adapter's *Embedding an attachment in a description*
   recipe and the filenames from step 2.

Give every embedded image a one-line caption above it saying what it shows, in plain
language — an image with no caption makes the reader guess what they are looking at.

**Do not post the evidence as a comment.** Posting it as a comment is the older
behaviour and is now wrong: it separates a defect from its proof, and on a busy ticket
the comment is pushed out of sight by later replies.

If the adapter marks `tracker.attach_file` **Unsupported**, say so, embed whatever
hosted image reference it names instead, and tell the user the files were not uploaded.

---

## Step 0 — Resolve the provider

Resolve the **`tracker`** capability group per [../mcp-tools.md](../mcp-tools.md) → §2
Resolution rule. Read the adapter it names and use its Capability map and Vocabulary
map for every call below.

If `tracker` is `unbound`, stop and ask. If the adapter marks a capability
**Unsupported**, say so and offer the workaround it names — do not substitute another
capability.

---

## Workflow — CREATE

1. **Fetch the parent.** Call **`tracker.get_ticket`** on `parent_ref`. Take from it
   the project reference (never assume it), the sprint reference to inherit, the parent
   subject to confirm back, and any stale-write token the adapter requires.
2. **If `type` is `bug`, build the description from the bug report.** Read the `BUG-XXX`
   section named by `bug_id` out of `bug_report_file` and convert it per *Creating a bug
   ticket* → Rule 1. Stop here if either input is missing. Note the screenshots listed in
   that section's Evidence table — they are needed in step 6.
3. **Resolve names to references.** Translate `type`, `status` and `priority` through
   the adapter's Vocabulary map. Resolve `assignee` with **`tracker.resolve_user`**.
   For a bug, map its **Severity** to a canonical priority using the table in
   [../mcp-tools.md](../mcp-tools.md) → §4 — never carry the severity word across as a
   priority.
4. **Confirm.** Show the prompt in [template.md](template.md) → *CREATE — confirmation
   prompt* and wait for a yes. For a bug, show *CREATE — bug confirmation prompt*
   instead, which names the source file and lists the screenshots about to be embedded.
5. **Create.** Call **`tracker.create_ticket`** with the call shape in
   [template.md](template.md) → *CREATE — call shape*.
6. **For a bug, attach and embed the evidence.** Call **`tracker.attach_file`** once per
   screenshot, then **`tracker.update_ticket`** to rewrite the description with each
   image embedded under its Evidence heading — per *Creating a bug ticket* → Rule 2.
   Verify the images actually rendered, using whatever check the adapter names; if one
   did not, say so rather than reporting the evidence as attached.
7. **Report.** Print *CREATE — result*, or *CREATE — bug result* for a bug.

---

## Workflow — UPDATE

1. **Fetch the current ticket.** Call **`tracker.get_ticket`** on `ticket_ref`. Keep
   whatever stale-write token the adapter requires — it must come from this fetch, not
   an earlier one.
2. **Confirm.** Show the diff in [template.md](template.md) → *UPDATE — confirmation
   diff* and wait for a yes.
3. **Update.** Call **`tracker.update_ticket`** with only the changed fields plus the
   stale-write token. For a status-only change use **`tracker.set_status`**.
4. **Report.** Print *UPDATE — result*.

---

## Workflow — ADD COMMENT

1. **Write the comment to a file** at the path in [template.md](template.md) →
   *COMMENT — file location*.
2. **Confirm.** Show *COMMENT — confirmation prompt* and wait for a yes.
3. **Post.** Call **`tracker.add_comment`**. If the adapter routes this through a
   script or a REST recipe, follow that section of the adapter exactly.
4. **Report.** Print *COMMENT — result*.

---

## Attaching evidence

For a **bug**, evidence handling is defined by *Creating a bug ticket* → Rule 2 above:
every screenshot is attached and then **embedded in the description**, never posted as
a comment. Follow that section — this one does not restate it.

For any **other** ticket type, call **`tracker.attach_file`** once per file, following
the adapter's recipe, and record whatever reference it returns so the evidence traces
back from the ticket. Embedding in the description is preferred here too whenever the
file is an image, for the same reason: a reader should see it without hunting for it.

If the adapter marks `tracker.attach_file` **Unsupported**, use the workaround it names
— usually embedding a hosted image URL in the description — and tell the user the file
was not uploaded.

---

## Rules

- **A bug ticket's description is lifted from the `bug-report.md` section for that
  `BUG-XXX`, never composed here.** Missing file or missing heading means stop and say
  so — never write a description from memory instead.
- **A bug's screenshots are embedded in the description, never posted as a comment.**
  Attach first, then update the description to reference them; an image cannot be
  referenced before it exists.
- **Never cross-reference another ticket in Steps to Reproduce.** No "as described in
  BUG-002", no "same setup as above". Restate the whole flow in every bug, with the real
  route, button label and field value in each step. Duplication between tickets is the
  correct trade — see *Creating a bug ticket* → Rule 1b.
- **Map a bug's Severity to a canonical priority** through `mcp-tools.md` §4. Severity
  and priority are different scales — never copy one into the other.
- Always fetch the parent before creating — never assume the project reference.
- Always take the stale-write token from a fetch made immediately before the write.
- Always confirm with the user before creating, updating, or commenting.
- Inherit the parent's sprint for new children unless the user overrides it.
- If the parent changes on update, verify the new parent exists first.
- Never guess a user reference — resolve it with `tracker.resolve_user`.
- Confirm comment text before posting — most trackers cannot delete a comment via API.
- Never assume a ticket reference is numeric.
- Never copy a tool name, an ID table, or an auth recipe into this file. Link to the
  adapter instead, so there is one place to update.

---

## Resources

- Prompts, call shapes, result blocks: [template.md](template.md)
- Capability vocabulary, canonical values, resolution rule: [../mcp-tools.md](../mcp-tools.md)
- Provider bindings for this project: [../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md)
