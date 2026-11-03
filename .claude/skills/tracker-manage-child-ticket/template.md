# Manage Child Ticket — Prompts and Output Blocks

Every prompt this skill shows and every result it prints. Structure is fixed; only the
values change. Show ticket references exactly as the provider returns them.

---

## CREATE — confirmation prompt

```
About to create:
  Type     : <type>
  Subject  : <subject>
  Parent   : <parent_ref> — <parent_subject>
  Status   : <status>
  Priority : <priority>
  Assignee : <name or unassigned>
  Sprint   : <sprint or unset>
  Due date : <due_date or —>

Proceed? (yes / edit fields)
```

## CREATE — bug confirmation prompt

Shown instead of the prompt above whenever `type` is `bug`. It names the source file so
the user can see the description was lifted, not composed, and lists the images that will
be embedded in the description.

```
About to create a BUG:
  Subject     : <subject>
  Parent      : <parent_ref> — <parent_subject>
  Severity    : <severity from the report>  →  Priority: <canonical priority>
  Source      : <bug_report_file> → <bug_id>
  Description : lifted from that section (<N> lines)

  Screenshots to embed in the description:
    1. <filename> — <caption>
    2. <filename> — <caption>

Proceed? (yes / edit fields)
```

If `bug_report_file` or `bug_id` is missing, show this instead and stop:

```
❌ Cannot create a bug ticket without its bug report.
   Missing: <bug_report_file | bug_id>
   A bug description must be lifted from bug-report.md, never composed here.
   Run stlc-bug-reporter first, or supply the file and the BUG-XXX id.
```

## CREATE — call shape

```
project     : <resolved in Step 1>
parent      : <parent_ref>
subject     : <subject>
type        : <canonical tracker.type>
status      : <canonical tracker.status>
priority    : <canonical tracker.priority>
assignee    : <resolved reference, or omit>
sprint      : <inherited or overridden, or omit>
description : <markdown, or omit>
start_date  : <YYYY-MM-DD, or omit>
due_date    : <YYYY-MM-DD, or omit>
estimate    : <ISO 8601, or omit>
```

Omit every field the user did not supply. The adapter translates the canonical values.

## CREATE — result

```
✅ Created <new_ref> — <subject>
   Parent  : <parent_ref> — <parent_subject>
   Type    : <type>
   Status  : <status>
   Sprint  : <sprint or —>
   Link    : <ticket URL from the adapter>
```

## CREATE — bug result

Printed instead of the block above for a bug. The evidence line reports what actually
rendered in the description, checked — not what was uploaded and hoped for.

```
✅ Created <new_ref> — <subject>
   Parent   : <parent_ref> — <parent_subject>
   Severity : <severity>  →  Priority: <priority>
   Source   : <bug_report_file> → <bug_id>
   Evidence : <N> of <M> screenshots embedded in the description and verified
   Link     : <ticket URL from the adapter>
```

If any image failed to render, name it and say so plainly rather than rounding up:

```
   ⚠ <filename> uploaded but did not render in the description — it is attached to the
     ticket but a reader will not see it inline.
```

## CREATE — bug description shape

The order the description is written in. The content is lifted from the `BUG-XXX`
section of the bug report and condensed; only the Evidence block is built by this skill.

**Keep it short — about 15 lines of text plus the images.** A developer must see what is
wrong, how to see it, and what should happen, without scrolling past analysis.

```
<Summary — one sentence: what is wrong, where>

*Environment:* <env> · <Always | N of M tries> · Found by <TC ID> (<parent ref>)

*Steps*
  # <at most 6 numbered steps, real values and exact labels>

*Expected:* <one line — cite the AC in a few words>
*Actual:* <one line — the observed result, HTTP status if any>

*Note:* <only if it changes what the developer does — e.g. "also on the creditor page",
        "not caused by this story", "relates to AP-2519". At most 2 lines. Omit otherwise>

<caption line>
<embedded image>   (the failing screenshot; a second only if it shows something new)
```

Never put in the ticket: "Why it matters", a guessed root cause, test-run analysis, gate
rules, local file paths or a pointer to `bug-report.md`. They stay in the bug report.

---

## UPDATE — confirmation diff

```
Updating <ticket_ref> — <subject>

  Field       Current            → New
  ──────────────────────────────────────
  Status    : In progress        → Ready for QA
  Assignee  : Hoai Dung          → (unchanged)
  Priority  : Normal             → High
```

## UPDATE — result

```
✅ Updated <ticket_ref> — <subject>
   Changed : <list of changed fields>
```

---

## COMMENT — file location

```
qa-artifacts/4-execution-results/comment_<ticket_ref>_<YYYY-MM-DD>.md
```

## COMMENT — confirmation prompt

```
About to post a comment on:
  Ticket : <ticket_ref>
  File   : <path>
  Preview: <first 5 lines>

Proceed? (yes / edit)
```

## COMMENT — result

```
✅ Comment posted on <ticket_ref>
```
