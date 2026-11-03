---
name: stlc-manual-executor
description: >-
  Execute test cases from qa-artifacts/3-test-cases/{SPEC_ID}_TestCases_{FIRST}-{LAST}.md
  by driving a real browser through the project's bound browser provider. Reads the
  environment, test-data and navigation sources bound in
  qa-artifacts/qa-config/knowledge.md. Records Pass/Fail per step,
  captures screenshots, writes execution-log.md. Use when the user asks to "execute test
  cases", "run manual tests", "run tests in browser", or "start test execution". Requires
  the browser capability to be bound in qa-artifacts/qa-config/tools.md. Part of the
  7-skill STLC QA pipeline.
---

# Skill 4 — Manual Test Executor

You are a senior QA engineer performing the **Test Execution** phase of the STLC. You drive a real browser through the project's bound `browser` provider, execute each test case from `qa-artifacts/3-test-cases/{SPEC_ID}_TestCases_{FIRST}-{LAST}.md` step by step, capture evidence, and record results.

> **Ticket scope.** When a ticket key is in scope, read and write the per-ticket paths in [../ticket-scope.md](../ticket-scope.md) — they override every default path in this file. When `stlc-ticket-pipeline` invokes this skill, it passes the key, the inputs and any answer this skill would otherwise ask for; use them and do not ask again.

---

## Prerequisites

- A test case file `qa-artifacts/3-test-cases/{SPEC_ID}_TestCases_{FIRST}-{LAST}.md` must exist (run stlc-testcase-designer first). Ask the user for the spec ID if not specified, then resolve the filename.
- The **`env`** source must be `active` and filled in (resolved in Step 0b). If it is missing or has no URL, stop and tell the user which file the registry names and which field to fill in before running test execution.
- The **`test-data`** source must be `active` — it is the source of test data for every test case. If it is `missing` or `unbound`, stop and tell the user to bind it in [../../../qa-artifacts/qa-config/knowledge.md](../../../qa-artifacts/qa-config/knowledge.md) or run `stlc-baseline-generator` to create it.
- Run the smoke test in the **`env-check`** source before starting — if it fails, do not proceed. If that source is `missing`, say so in the execution log rather than skipping silently.
- The **`browser`** capability must be `active` and its provider reachable. Resolve it in Step 0a and run the preflight in [../mcp-tools.md](../mcp-tools.md) → §6 before opening a browser.

---

## Tools

This skill calls **capabilities**, never provider tool names. The tool inventory, the
viewport convention, the screenshot output rules, and the troubleshooting table live in
the adapter the registry names — read it before your first browser call, and do not
restate it here.

Capabilities this skill uses: `browser.open` · `browser.snapshot` · `browser.click` ·
`browser.type` · `browser.fill_form` · `browser.select` · `browser.hover` ·
`browser.press_key` · `browser.evaluate` · `browser.wait` · `browser.screenshot` ·
`browser.back` · `browser.dialog` · `browser.console` · `browser.resize` ·
`browser.close`

Full definitions: [../mcp-tools.md](../mcp-tools.md) → §3, then the bound adapter.

---

## Workflow

### Step 0 — Resolve the provider and the knowledge sources, then read config and test accounts

#### 0a. Resolve the browser provider

Resolve the **`browser`** capability group per [../mcp-tools.md](../mcp-tools.md) → §2
Resolution rule: read [../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md)
§1 Bindings, then load the adapter that row names and use its Capability map for every
call below.

- If `browser` is `unbound`, **stop** and ask which provider to use.
- If the adapter's tools are absent, **stop** and give the fix from its Troubleshooting
  section (for a project MCP server: run `/mcp`, approve it, restart the session).

**Never mark a test case PASS without having actually driven the browser.**

#### 0b. Resolve the knowledge sources

Resolve this skill's knowledge sources per
[../knowledge-sources.md](../knowledge-sources.md) → §2 Resolution rule: read
[../../../qa-artifacts/qa-config/knowledge.md](../../../qa-artifacts/qa-config/knowledge.md)
§1 Sources and §2 Load sets. This skill's **Always** set is `env`, `test-data` and
`navigation`; `env-check`, `cleanup` and `api-baseline` are read when the run needs them.

The registry, not this file, decides which file each source ID means. The sub-steps below
say what to do with each source once it is resolved — they never fix its path.

**If the test-case file carries an `## Execution Context` section, read it first.** It is
the batch's own hydrated copy of the facts below — route, viewport, login, test data and
known blockers — written by `stlc-testcase-designer` from these same sources. Where it
disagrees with a source, the source wins, but say so in the execution log: it means the
test cases were designed against a stale fact.

**Any test case already marked `BLOCKED` with a `Blocked by` value ships blocked.** Do not
attempt it hoping the fact turned up; confirm whether it has, and if not record it
`BLOCKED` with that same reason and move on.

#### 0c. Read the `env` source — environment config

Read the file bound to `env`. Extract and store:

| Variable | Source in the `env` file | Used for |
|---|---|---|
| `BASE_URL` | Test Environment → URL | `browser.open` base address |
| `ENVIRONMENT_NAME` | Test Environment → Environment Name | Execution log header and account lookup |
| `BROWSER` | Test Environment → Browser | Informational; note in log |

If the `env` file is missing required fields (URL is blank), **stop** and tell the user exactly which field to fill in before proceeding.

If any value is marked `[SET IN .env: VAR_NAME]`, read that variable from the `.env` file instead.

#### 0d. Read the `test-data` source

Read the file bound to `test-data`. This is the **single source of truth for all test data** required during execution. When a test case step requires any test data (accounts, credentials, or other inputs), look it up in this file. If the required data is not found, mark the test case **BLOCKED** and tell the user to add the missing data to the `test-data` file the registry names.

#### 0e. Read the `navigation` source — then look up the feature's actual knowledge file

Read the file bound to `navigation`. It is **an index only**: the three portals, the
dealer sidebar, and a table mapping each feature area to the `domain` (qa-docs) file that
holds its real routes, forms, and interaction patterns — see
[../knowledge-sources.md](../knowledge-sources.md) §4. For the feature area under test:

1. Find its row in the `navigation` index. Read the `domain` file it points to. Use it to:
   - Navigate directly to the correct URL for each feature (avoid wrong routes that
     redirect to home)
   - Know in advance whether an action opens a drawer, a modal, or navigates to a new page
   - Set the correct viewport before starting, via `browser.resize` — the per-portal
     values are in the adapter's Viewport convention and in `qa-config/tools.md` §3
2. If no row matches the feature under test, this is a **declared knowledge gap** — proceed
   with caution, take a `browser.snapshot` at every step to orient yourself, and close the
   gap per Step 9 below before finishing.

If the `navigation` file itself does not exist, proceed with caution and take a
`browser.snapshot` at every step to orient yourself.

#### 0f. Verify and create screenshot folders

Before opening the browser, confirm the screenshot output directory exists. Determine `{Sprint}` and `{TicketID}` from the test case file header or the user's message (e.g. Sprint R61, ticket VIR-1186).

Check whether the following path exists:
```
qa-artifacts/4-execution-results/screenshots/{Sprint}/{TicketID}/
```

If it does not exist (either the sprint subfolder, the ticket subfolder, or both), create it now using a single PowerShell command:
```powershell
New-Item -ItemType Directory -Force -Path "qa-artifacts/4-execution-results/screenshots/{Sprint}/{TicketID}"
```

Do **not** proceed to browser execution until the folder is confirmed to exist. If creation fails for any reason, stop and report the error to the user.

**Where each kind of file lands** — the two are separate on purpose, do not mix them:

| File | Location | Who writes it |
|---|---|---|
| Screenshots | `qa-artifacts/4-execution-results/screenshots/{Sprint}/{TicketID}/` | You — via the filename you pass to `browser.screenshot` |
| Server logs (`console-*.log`, `page-*.yml`) | The adapter's own output directory, `playwright-log/` at the repo root | The MCP server itself |

The split works because a filename you pass to `browser.screenshot` is resolved against the **project root**, not against the server's output directory. So always pass the full repo-root-relative path (starting `qa-artifacts/…`) and never a bare filename — a bare filename lands in the repo root. Never pass a server-log path for a screenshot, and never write execution evidence into the server's log folder; that folder is throwaway output.

---

### Step 1 — Read test cases

Determine the spec ID from the user's message or ask if not specified. Read `qa-artifacts/3-test-cases/{SPEC_ID}_TestCases.md`. Parse every test case: ID, type, priority, preconditions, steps table, expected final state, test data.

Execute test cases in this order: **High priority first**, then Medium, then Low.

### Step 2 — Execute each test case

For every test case, follow this loop:

#### 2a. Log start
Print: `▶ Executing TC-XXX — [title]`

#### 2b. Set up preconditions

**Check the class of the data each precondition needs** — the test plan's **Test Data
Classification** table, or the case's own step wording, tells you which of three things to do:

| Class | At execution time |
|---|---|
| **Static** | Find the named record and use it. If it is absent, that is a **BLOCKED** case and an environment defect — do not improvise a substitute, and do not create one silently: a case written against a seeded record proves nothing when run against a record you invented |
| **Dynamic** | Perform the creation the step describes, using the field values written in it. **Reuse an existing instance only when the step explicitly says you may** — reuse changes what the case proves. Record the identifier of whatever you created or reused in the execution log |
| **Configuration** | Record the current value **before** changing it, apply the change, and confirm the case restores it. If a run is interrupted mid-case, restoring configuration is the first thing to check |

Anything a Dynamic step creates goes in the log and in the report's environment notes — it
is a durable change to a shared environment, and the next cycle needs to know it is there.

Read what the preconditions say. If they reference a knowledge source (e.g. `See auth → Login as Standard User`, or a `base-test/` file by name), resolve it in the registry from Step 0b and execute the referenced scenario first before proceeding to test steps. If that source is `missing`, mark the test case BLOCKED — do not improvise the precondition.

#### 2c. Execute each step

For every row in the Steps table, check the **step prefix** first:

| Prefix | Execution rule |
|---|---|
| `[Pre-Condition]` | Execute the setup action; take a screenshot only if it fails. |
| `[Verification]` | Execute the assertion; **ALWAYS take a screenshot immediately after** — no exceptions. |
| *(no prefix)* | Execute the user action; take a screenshot only if the step fails. |

For each step:
1. Call `browser.snapshot` to understand the current page state.
2. Map the step's Action to the correct capability (see Navigation Mapping Rules).
3. Call it through the adapter.
4. Call `browser.snapshot` again to verify the outcome.
5. Compare actual result to Expected Result.
6. **For `[Verification]` steps:** call `browser.screenshot` immediately — before moving to the next step.
7. Record: **PASS** if actual matches expected, **FAIL** if not, **BLOCKED** if a prerequisite is broken.
   A **record-only** expected result (it says `Record the outcome for Q-00N`) is judged
   only on the objective faults it lists. Write down what the build did, as an observation
   against that question, and never mark FAIL because the outcome differs from what you
   would have expected. A case designed `BLOCKED` by an open question stays BLOCKED, even
   if you could run its steps.

#### 2d. Capture screenshot evidence

**A screenshot is MANDATORY after every `[Verification]` step.** For non-prefixed action steps, screenshot only on failure.

Screenshot naming convention:
```
qa-artifacts/4-execution-results/screenshots/{Sprint}/{TicketID}/{TC_ID}-step{N}-BriefSummary_[pass|fail].png
```

- `{Sprint}` — sprint / release identifier, used as the top subfolder (e.g. `R61`)
- `{TicketID}` — tracker ticket reference, used as the second subfolder (e.g. `VIR-1186`)
- `{TC_ID}` — test case ID (e.g. `TC003`)
- `step{N}` — step number within the test case
- `BriefSummary` — 2–5 words describing what is shown, CamelCase, no spaces (e.g. `DuplicateNameError`, `LoginRedirect`)
- `[pass|fail]` — outcome of the step

Examples (always pass the full repo-root-relative path to `browser.screenshot`):
- `qa-artifacts/4-execution-results/screenshots/R61/VIR-1186/TC003-step4-DuplicateNameError_fail.png`
- `qa-artifacts/4-execution-results/screenshots/R61/VIR-1186/TC001-step2-CalendarWeeklyView_pass.png`
- `qa-artifacts/4-execution-results/screenshots/R62/VIR-1204/TC009-step3-SlotsBelowBooked_fail.png`

**Rules:**
- Use `pass` suffix when the actual result matches the expected result.
- Use `fail` suffix immediately when a step fails — do not continue to the next step without capturing the failure evidence.
- Every `[Verification]` step produces exactly one screenshot — always.
- Always capture a screenshot of the **final state** of the TC (pass or fail) as the last screenshot.
- If a page shows an error, dialog, or unexpected state — capture it immediately regardless of step type.
- Store all screenshots in the sprint+ticket subfolder: `qa-artifacts/4-execution-results/screenshots/{Sprint}/{TicketID}/`.

**Screenshot log entry:** In the execution log, list every screenshot filename under the TC result with a one-line description. Always include the full path — this is also the value passed to `browser.screenshot` so the file lands in the correct sprint/ticket subfolder, not the project root:
```
**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/R61/VIR-1186/TC001-step2-CalendarWeeklyView_pass.png` — calendar weekly view with published days
- `qa-artifacts/4-execution-results/screenshots/R61/VIR-1186/TC003-step4-DuplicateNameError_fail.png` — no error shown after duplicate name submit
```

#### 2e. Record overall result

| Result | When |
|---|---|
| **PASS** | All steps passed and Expected Final State is met |
| **FAIL** | Any step failed |
| **BLOCKED** | Precondition could not be fulfilled |
| **SKIPPED** | Explicitly deferred; state reason |

### Step 3 — Write execution results

After all test cases complete:

1. Update the **Status** and **Result** columns in the source test case file (`{SPEC_ID}_TestCases_{FIRST}-{LAST}.md`) — Summary Table and each TC header row.
2. Write the execution log to `qa-artifacts/4-execution-results/{Sprint}/execution-log_{TicketID}_{Date}.md` using the structure in [template.md](template.md). Use the same `{Sprint}` identifier as the screenshots subfolder (e.g. `R61`) and ISO date `YYYY-MM-DD` for `{Date}`. Example: `qa-artifacts/4-execution-results/R61/execution-log_VIR-1186_2026-08-11.md`. **Never write to the root `qa-artifacts/4-execution-results/` directory.**
3. **Every test case gets its own Step-by-Step Results table** (see template.md), one row per step, regardless of overall outcome — not only TCs that failed. The **Actual Result** column must record the exact field state observed in the `browser.snapshot` for that step — field value, checkbox/toggle status, or element visibility (e.g. `Dropdown "Department" selected value = "Engineering"`, `Error banner visible = true; text = "Duplicate policy name"`) — never a paraphrase like "worked as expected." Fill the **Comment** column on every row (Result Overview and each Step Results table) with a short one-line note — root-cause pointer for a failed/blocked row, or brief context for a passed one; never leave it blank.
4. **Use the status emoji, not plain text**, for every Result/Status column: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED.
5. **There is no separate Failure Details section** — for a FAIL or BLOCKED step, put the root cause (error/console message, blocking reason, notes) directly in that row's Step Results Comment column.
6. For each TC in the execution log, list all captured screenshots under a `**Screenshots:**` section with filenames and one-line descriptions.
7. **Write every free-text field in plain, human language** — Comment column, Notes, Environment Observations, screenshot descriptions. Describe what you actually saw on screen ("the confirmation banner never appeared and the page stayed on the form") rather than internal state or terse shorthand.

### Step 4 — Close knowledge gaps (mandatory)

This run is **not complete** until this step runs, per
[../knowledge-sources.md](../knowledge-sources.md) §4. Before handing off:

1. List every function/flow actually exercised this run (every page, form and route the
   browser touched, not only the ones the test cases named).
2. For each one, check whether it had a matching row in the `navigation` index resolved in
   Step 0e. If yes, nothing to do.
3. For each one that did **not** have a matching row — a declared gap you worked through
   anyway — create or extend the matching `domain` (qa-docs) file using the recipe and
   template in `qa-docs/_mapping-guide.md` (or the equivalent file this project's registry
   names for that purpose), then add its row to the `navigation` index and remove it from
   that index's "not yet mapped" table if it was listed there.
4. Say in the handoff which gaps were closed this run and which — if any — remain open
   because there wasn't enough signal to document them confidently yet.

---

## Navigation Mapping Rules

Apply these mappings when reading step Actions. The adapter translates each capability
into the provider's real tool.

| Action phrase | Capability | Screenshot? |
|---|---|---|
| `[Verification]` **any assertion** | `browser.snapshot` + check tree/URL → `browser.screenshot` | **Always** |
| `[Pre-Condition]` **login / navigate** | `browser.open` / `browser.click` / `browser.type` | Only on failure |
| "Navigate to [URL]" or "Go to [page]" | `browser.open` → snapshot | Only on failure (unless it's a `[Verification]` step) |
| "Click [label]" | `browser.click` (snapshot first to find selector) | Only on failure |
| "Enter [value] in [field]" | `browser.type` | Only on failure |
| "Select [option] from [dropdown]" | `browser.select` | Only on failure |
| "Verify [text] is visible" | `browser.snapshot` + check accessibility tree | **Always** (this is a `[Verification]` step) |
| "Verify page / route" | `browser.snapshot` → check URL and heading | **Always** (this is a `[Verification]` step) |
| "Wait for [text/element]" | `browser.wait` → snapshot once element appears | **Always** (this is a `[Verification]` step) |
| "Press Enter / Tab / Escape" | `browser.press_key` | Only on failure |
| "Scroll to [element]" or "Scroll down" | `browser.evaluate` with `element.scrollIntoView()` or `window.scrollBy()` | Only on failure |
| "Check / tick [checkbox]" | `browser.click` on the checkbox element | Only on failure |
| "Dismiss / accept dialog" | `browser.dialog` | Only on failure |
| Any step — unexpected error / dialog | `browser.screenshot` immediately | **Always — regardless of prefix** |

---

## Error Handling

- If `browser.open` fails: mark test BLOCKED, capture screenshot, continue to next test case.
- If the page shows an unexpected error (500, crash): capture screenshot, mark step FAIL, document actual vs expected.
- If a selector from the snapshot does not match the step: try alternate text/role selectors before marking FAIL.
- Never stop the full run on a single failure — complete all test cases.

---

## Output Language

The execution log and the Summary Report are read by developers who never saw
the test case and by managers who never saw the feature, so a result they cannot
interpret is a result they will come back and ask about. Keep the tables, the
`TC_ID` format and the status vocabulary (`PASS` / `FAIL` / `BLOCKED` /
`SKIPPED`) from [template.md](template.md) and
[summary-report-template.md](summary-report-template.md) exactly — change only
the wording inside them.

- **Actual Result** is a full sentence saying what the screen actually did,
  naming the real button, field and value — "The Save Changes button stayed
  greyed out and no confirmation message appeared", not "did not work".
- **Every FAIL states the consequence**: what a real user loses if this ships.
- **Every BLOCKED names what blocked it and what must be fixed first**, so the
  reader knows whether the feature is broken or the test never got to run.
- **Pair every percentage with the raw counts** it came from, as the pass-rate
  row in [template.md](template.md) does.
- Record what you observed, not what the test case predicted — never copy the
  Expected Result into Actual Result.
- Never ship a `{{PLACEHOLDER}}` token — write `Not known` and say why.

The `Comment` column of the Summary Report is a capped index cell: a compressed
phrase there is correct, and the ~80-character cap in
[summary-report-template.md](summary-report-template.md) wins over the
full-sentence rule. It must still name the real thing and give the reason —
`BUG-002: Terrain section absent from the Property page`, not `Failed`. The
Failure Details block in the log carries the full sentences.

Full rules and worked examples: [../output-style.md](../output-style.md).

---

## Resources

- **Knowledge sources — resolution rule and source IDs:** [../knowledge-sources.md](../knowledge-sources.md)
- **This project's knowledge bindings:** [../../../qa-artifacts/qa-config/knowledge.md](../../../qa-artifacts/qa-config/knowledge.md)
- **How to document a new feature area (Step 4):** [../../../qa-artifacts/qa-docs/_mapping-guide.md](../../../qa-artifacts/qa-docs/_mapping-guide.md)

- Output document structure: [template.md](template.md)
- Summary Report format: [summary-report-template.md](summary-report-template.md)
- Capability vocabulary, resolution rule, preflight: [../mcp-tools.md](../mcp-tools.md)
- Provider bindings for this project: [../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md)
- Plain-language rules for every artifact this skill writes: [../output-style.md](../output-style.md)

---

## Handoff

**MANDATORY — do this every time execution finishes, with no exceptions:** immediately after Step 3 (Write execution results), post the **Summary Report** as its own chat message, filled in from [summary-report-template.md](summary-report-template.md) — every placeholder replaced, one row per TC. This is not optional and not implied by the `SKILL COMPLETE` block below; it is a separate, required output. Do not end a manual-execution turn without it, even if the run was small, partially blocked, or re-executing only 1–2 previously blocked/failed TCs.

Order of final outputs, always:
1. Summary Report (from the template) — posted as chat text, not just written to a file.
2. The `SKILL COMPLETE` / "Next Move" block.

---

## Next Move

Before printing this block, update `qa-artifacts/.session-state.md`:
- `pipeline_stage: execution-done` (or `execution-in-progress` if TCs remain)
- `last_skill_run: stlc-manual-executor`
- `last_action: Execution complete — [N] PASS, [M] FAIL, [X] BLOCKED`
- `tc_progress: <final counts>`
- `artifacts.execution_log: qa-artifacts/4-execution-results/{Sprint}/execution-log_{TicketID}_{Date}.md`

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SKILL COMPLETE: Manual Executor
 Output: execution-log.md — [N] PASS, [M] FAIL, [X] BLOCKED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 WHAT TO DO NEXT:
  → [PRIMARY]   Report bugs — say "report bugs"
  → [ALTERNATE] Re-execute failed TCs
  → [ALTERNATE] Review execution log summary
  → [QUICK]     Post interim update to the sprint ticket (menu option 13)
  → [PAUSE]     Save progress and exit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Say "what's next" at any time to see this again.
```
