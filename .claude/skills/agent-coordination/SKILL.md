---
name: agent-coordination
description: >-
  QA session entry point. Greets the user and shows an interactive action menu.
  No auto-detection on startup. After any STLC skill completes, automatically
  shows next-step suggestions based on the last pipeline stage. Use when the
  user says "initiate session", "start qa session", "agent coordination",
  "qa agent", "daily standup", "what's my next move", or "qa next".
---

# Skill — Agent Coordination

On every invocation: print the **greeting**, then show the **action menu**.
No file reading on startup — all context work is deferred to the chosen option.

---

## Step 0 — Ticket Key Rule

If the user's message is a ticket key, alone or with pipeline flags — it matches
`^[A-Z][A-Z0-9]+-[0-9]+( --[a-z]+( [a-zA-Z0-9-]+)?)*$`, e.g. `AP-1234`, `AP-1234 --auto`,
`AP-1234 --from execute` (stage names: `stlc-ticket-pipeline` → *Stage names*) — skip Steps 1–2. Print the greeting line, then invoke
`stlc-ticket-pipeline` with the key and flags. This applies at session start and
mid-session alike.

---

## Step 1 — Greet

```
Good [morning/afternoon/evening]! QA Agent ready. What would you like to do?
```

---

## Step 2 — Show Action Menu

### Cursor (AskQuestion available) — two-step picker

**Step 2a — Pick a category:**

```
AskQuestion:
  title: "QA Agent — What would you like to do?"
  questions:
    - id: "category"
      prompt: "Select a category:"
      allow_multiple: false
      options:
        - id: "op"  label: "Tracker"
        - id: "qa"  label: "QA Pipeline"
        - id: "ce"  label: "Code & Environment"
```

**Step 2b — Pick an action** (category name = non-selectable title):

If `op` →
```
AskQuestion:
  title: "Tracker"
  questions:
    - id: "action"  prompt: "Select an action:"  allow_multiple: false
      options:
        - id: "op1"  label: "List sprint tickets"
        - id: "op2"  label: "Read ticket detail"
        - id: "op3"  label: "List blocked tickets"
        - id: "op4"  label: "Check sprint progress"
        - id: "op5"  label: "Review yesterday's activity"
        - id: "op6"  label: "Post comment"
        - id: "op7"  label: "View team workload"
        - id: "back" label: "← Back to categories"
        - id: "exit" label: "Exit session"
```

If `qa` →
```
AskQuestion:
  title: "QA Pipeline"
  questions:
    - id: "action"  prompt: "Select an action:"  allow_multiple: false
      options:
        - id: "q1"   label: "View daily QA summary"
        - id: "q2"   label: "View execution queue"
        - id: "q3"   label: "Triage open bugs"
        - id: "q4"   label: "Analyse QA coverage gaps"
        - id: "s1"   label: "Run: Analyze requirements"
        - id: "s2"   label: "Run: Design test plan"
        - id: "s3"   label: "Run: Write test cases"
        - id: "s3b"  label: "Run: Peer-review test cases"
        - id: "s4"   label: "Run: Execute test cases"
        - id: "s5"   label: "Run: Report bugs"
        - id: "s6"   label: "Run: Generate test report"
        - id: "s7"   label: "Run: Update tracker tickets"
        - id: "s0"   label: "Run: Full pipeline for one ticket"
        - id: "s8"   label: "Run: Automate test cases"
        - id: "s9"   label: "Run: QA batch — every ticket in QC or assigned to me"
        - id: "rv"   label: "Run: Review results or automation specs"
        - id: "back" label: "← Back to categories"
        - id: "exit" label: "Exit session"
```

If `ce` →
```
AskQuestion:
  title: "Code & Environment"
  questions:
    - id: "action"  prompt: "Select an action:"  allow_multiple: false
      options:
        - id: "c1"   label: "Review code changes for a ticket"
        - id: "c2"   label: "Check environment health"
        - id: "back" label: "← Back to categories"
        - id: "exit" label: "Exit session"
```

If `back` is selected → re-show Step 2a.
Route using the `action` ID from Step 2b.

### Claude Code (AskQuestion NOT available) — plain-text menu

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 QA AGENT — What would you like to do?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 TRACKER
  op1. List sprint tickets
  op2. Read ticket detail
  op3. List blocked tickets
  op4. Check sprint progress
  op5. Review yesterday's activity
  op6. Post comment
  op7. View team workload

 QA PIPELINE
   q1. View daily QA summary
   q2. View execution queue
   q3. Triage open bugs
   q4. Analyse QA coverage gaps
   s1. Run: Analyze requirements
   s2. Run: Design test plan
   s3. Run: Write test cases
  s3b. Run: Peer-review test cases
   s4. Run: Execute test cases
   s5. Run: Report bugs
   s6. Run: Generate test report
   s7. Run: Update tracker tickets
   s0. Run: Full pipeline for one ticket (or just type its key)
   s8. Run: Automate test cases
   s9. Run: QA batch — every ticket in QC or assigned to me
   rv. Run: Review results or automation specs (QA reviewer)

 CODE & ENVIRONMENT
   c1. Review code changes for a ticket
   c2. Check environment health

    0. Exit session
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Type an ID to select, or describe what you want.
```

---

## Sprint Resolution Rule

> Ask: _"Which sprint? (e.g. 'Sprint 08/06/2026', or Enter for the active one)"_
> - User provides a name → use it directly.
> - User presses Enter / says "active" → read `qa-artifacts/.session-state.md`
>   silently to get `active_sprint`, then use that value.

---

## s0–s9 Dispatch

Route directly to the chosen STLC skill — no sub-menu:

| ID  | Skill                        |
|-----|------------------------------|
| s1  | `stlc-requirements-analyst`  |
| s2  | `stlc-test-plan-designer`    |
| s3  | `stlc-testcase-designer`     |
| s3b | `stlc-testcase-reviewer`     |
| s4  | `stlc-manual-executor`       |
| s5  | `stlc-bug-reporter`          |
| s6  | `stlc-test-reporter`         |
| s7  | `stlc-ticket-updater`        |
| s0  | `stlc-ticket-pipeline` — ask _"Enter the ticket key:"_ first |
| s8  | `stlc-test-automator` — ask _"Enter the ticket key:"_ first |
| s9  | `stlc-qa-orchestrator` — no sprint needed; it selects the tickets itself |
| rv  | `stlc-qa-reviewer` — ask _"Enter the ticket key and checkpoint (R1–R5, or all):"_ first |

After any s1–s9 skill completes → trigger **Post-Skill Completion** (see [routing.md](routing.md)).
Post-Skill Completion chains: if the chosen next step is also s1–s9, it fires again.

---

## Rules

- **Never read any file at startup.** Greet → menu → wait. The one exception is the
  **Ticket Key Rule** (Step 0), which routes straight to `stlc-ticket-pipeline`.
- `back` in Cursor → re-show Step 2a category picker.
- If `qa-artifacts/` does not exist and a QA Pipeline option is picked:
  _"Workspace not initialised. Run `stlc-init-workspace` first."_
- For sprint prompts always apply the **Sprint Resolution Rule** — never assume.
- Tracker and browser options resolve their provider through
  [../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md) — see the Tracker & Tool
  Access Rule in [routing.md](routing.md). Never assume a provider.
- Notification actions are only offered when the `notify` capability is `active`.

---

## Resources

- **[routing.md](routing.md)** — detailed option routing (op1–op7, q1–q4, c1–c2),
  Post-Skill Completion behaviour, stage→next-step table, Tracker & Tool Access Rule,
  session state read/write contract.
- **[template.md](template.md)** — Daily Summary Briefing format, session-state
  schema, Next Move block structure.
