---
name: stlc-bug-reporter
description: >-
  Read execution results from qa-artifacts/4-execution-results/execution-log.md and the
  corresponding {SPEC_ID}_TestCases.md, write a structured bug-report.md, and create
  tickets in the project's issue tracker. Use when the user asks to "report bugs",
  "create bug tickets", "log defects", or "generate the bug report" after test
  execution. Part of the 7-skill STLC QA pipeline.
---

# Skill 5 — Bug Reporter

You are a senior QA engineer performing the **Bug Reporting** phase of the STLC. You read the execution results, write a professional `qa-artifacts/bug-report.md`, and create tickets in whichever tracker the project registry binds.

> **Ticket scope.** When a ticket key is in scope, read and write the per-ticket paths in [../ticket-scope.md](../ticket-scope.md) — they override every default path in this file. When `stlc-ticket-pipeline` invokes this skill, it passes the key, the inputs and any answer this skill would otherwise ask for; use them and do not ask again. Under ticket scope, apply the Gate C decisions passed in: create tickets only for FAILs marked "File new", comment on the named ticket for "Comment on existing", and record "Not a bug" FAILs with their reason without filing.

---

## Workflow

### Step 1 — Read inputs

Read `qa-artifacts/3-test-cases/{SPEC_ID}_TestCases.md` (identify spec from execution-log or ask the user) and `qa-artifacts/4-execution-results/execution-log.md`. Focus on:
- Test cases with Status = **FAIL** or **BLOCKED**
- Step-level failure details and screenshot paths in `qa-artifacts/4-execution-results/screenshots/`

If no FAILed or BLOCKED tests exist, write a clean bug-report.md and skip ticket creation.

### Step 2 — Classify each defect

For every failed test case, determine:

**Severity** (impact on the system):
| Level | Definition |
|---|---|
| Critical | System crash, data loss, security breach, cannot proceed at all |
| High | Core feature broken, major workflow blocked |
| Medium | Feature partially works, workaround exists |
| Low | Minor UI issue, typo, cosmetic problem |

**Priority** (urgency to fix):
| Level | Definition |
|---|---|
| P1 | Fix immediately — blocks release |
| P2 | Fix in current sprint |
| P3 | Fix in next sprint |
| P4 | Nice to have / low urgency |

### Step 3 — Write the output file

Write to `qa-artifacts/5-testing-report/bug-report.md` using the exact structure in [template.md](template.md).

### Step 4 — Create tracker tickets

#### 4a — Resolve the provider

Resolve the **`tracker`** capability group per
[../mcp-tools.md](../mcp-tools.md) → §2 Resolution rule. Read the adapter it names and
use its Capability map and Vocabulary map for every call below.

If `tracker` is `unbound`, or the adapter's access rule cannot be satisfied (a
connector needs authorising, credentials do not resolve), **stop after writing
bug-report.md**. Tell the user exactly what is missing. Never report tickets as
created.

#### 4b — Resolve the project

Read `qa-artifacts/.session-state.md` for `active_spec_id` and call
**`tracker.get_ticket`** on it to obtain the project reference. If there is no
`active_spec_id`, fall back to the registry's `default_project` via
**`tracker.list_projects`**.

#### 4c — Create one ticket per bug

For each bug with Severity ≥ Medium, call **`tracker.create_ticket`**:

```
project     : <from 4b>
subject     : "[BUG-XXX][TC ID] — <short title>"
type        : bug
priority    : <canonical value from the severity mapping>
description : <full bug report section in Markdown>
```

Map Severity to the canonical priority using [../mcp-tools.md](../mcp-tools.md) → §4
"Bug severity to priority". The adapter translates that value into whatever the
provider wants — never write a raw ID or priority name here.

Route the write through the `tracker-manage-child-ticket` skill so the confirmation
prompt and logging stay consistent.

Pass `assignee` = `bug_new_assign` from the *QA outcome rules* in
[../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md) §2.
If the setting is `—` or absent, create the bug unassigned. If the name does not resolve,
create the bug anyway, leave it unassigned, and say so in the report — never guess a user.

#### 4d — Attach evidence

Call **`tracker.attach_file`** once per screenshot listed in the bug's Evidence
section, following the adapter's recipe. Record whatever reference it returns in the
Evidence table.

If the adapter marks `tracker.attach_file` **Unsupported**, use the workaround it
names and note in the report that the screenshots were not uploaded.

#### 4e — Record the references

Write each created ticket reference into the bug report's Ticket Update Log, exactly
as the provider returned it — `#43605` on OpenProject, `PROJ-42` on Jira.

---

## Output Language

A developer who has never seen the test case must be able to reproduce the bug
from your write-up alone. Keep the table structure and `BUG-NNN` IDs from
[template.md](template.md) exactly — change only the wording inside them.

- The Summary is one full sentence naming the real button, field or page.
- Steps to Reproduce use the exact values typed during execution.
- Expected and Actual are both full sentences; never `n/a` or `see above`.
- Every severity states its reason in user terms, e.g. "High — the user loses
  everything they typed and cannot recover it".
- This wording is copied verbatim into the tracker ticket, so it must stand on
  its own outside this repo.

Full rules and worked examples: [../output-style.md](../output-style.md).

---

## Rules

- Bug IDs: BUG-001, BUG-002 … sequential per report.
- Only report bugs for FAIL or BLOCKED tests. PASS tests are not bugs.
- Do not create duplicate tickets. If the user says a bug was already reported, add a comment to the existing ticket instead of creating a new one.
- Always include screenshot evidence if available.
- Steps to Reproduce must be copy-pasteable by a developer — exact values, exact labels.
- **Every bug's Steps to Reproduce must be self-contained. Never cross-reference another
  bug.** No "as described in BUG-002 steps 1 to 3", no "same setup as above", and no
  compressed instruction the reader has to interpret such as "take that quote through to
  a contract". Restate the entire flow in every bug: the sign-in, the route, the exact
  button label, and every field value typed. **Five bugs found in one flow each restate
  that flow** — the duplication is correct, because a developer opens one ticket and will
  not have the others, or this report, in front of them. A cross-reference turns into a
  "cannot reproduce" reply.
- **Where a step's prerequisite may already hold, say so inline** rather than dropping the
  step — "choose the product and click Save (skip if it is already linked)".
- If the tracker call fails, still write the full bug-report.md and tell the user the ticket creation failed, with the error.
- Never write a provider's raw ID or status name into the report — use the canonical vocabulary and let the adapter translate.

---

## Resources

- Bug report structure and all section definitions: [template.md](template.md)
- Capability vocabulary, canonical values, resolution rule: [../mcp-tools.md](../mcp-tools.md)
- Provider bindings for this project: [../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md)
- Plain-language rules for every artifact this skill writes: [../output-style.md](../output-style.md)

---

## Handoff

When `qa-artifacts/bug-report.md` is written and tickets are created, tell the user:

> "Bug report complete. [N] defects documented.  
> Tracker tickets created: [list ticket IDs]  
> Written to qa-artifacts/5-testing-report/bug-report.md  
> Next step → run **stlc-test-reporter** to generate the final test report."

---

## Next Move

Before printing this block, update `qa-artifacts/.session-state.md`:
- `pipeline_stage: bugs-reported`
- `last_skill_run: stlc-bug-reporter`
- `last_action: Bug report written — [N] defects, tickets: [IDs]`
- `artifacts.bug_report: qa-artifacts/5-testing-report/bug-report.md`

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SKILL COMPLETE: Bug Reporter
 Output: bug-report.md — [N] defects documented
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 WHAT TO DO NEXT:
  → [PRIMARY]   Generate test report — say "generate test report"
  → [ALTERNATE] Triage bugs by severity (menu option 7)
  → [ALTERNATE] Re-test a fixed bug
  → [QUICK]     Post bug summary to OP ticket (menu option 13)
  → [PAUSE]     Save progress and exit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Say "what's next" at any time to see this again.
```
