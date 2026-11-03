---
name: stlc-testcase-designer
description: >-
  Design detailed test cases from requirements and test plan. Writes files to
  qa-artifacts/3-test-cases/ named {SPEC_ID}_TestCases_{FIRST}-{LAST}.md
  (e.g. FR9_TestCases_001-005.md). TC IDs use spec prefix format FR9_001.
  Max 5 test cases per file, max 5 steps per test case.
  Also corrects existing test cases when the bug they raised is confirmed not
  valid. Use when the user asks to "design test cases", "write test cases", or
  "create test cases", or says "this bug is not valid", "BUG-003 is not a bug",
  or "update the test case for the rejected bug". Part of the 7-skill STLC QA
  pipeline.
---

# Skill 3 — Test Case Designer

Design detailed, executable test cases for a given requirement or spec ID and write them to `qa-artifacts/3-test-cases/`.

> **Ticket scope.** When a ticket key is in scope, read and write the per-ticket paths in [../ticket-scope.md](../ticket-scope.md) — they override every default path in this file. When `stlc-ticket-pipeline` invokes this skill, it passes the key, the inputs and any answer this skill would otherwise ask for; use them and do not ask again.

> **Correction mode.** When a bug raised by one of these test cases is confirmed **not
> valid** — a Gate C rule C1 "Not a bug" decision, a rejected bug confirmed by rule R1 or the user, or the
> user saying so — do not design new cases. Follow [correction.md](correction.md):
> rewrite the wrong expected result (or retire the case), add a Revisions row, set the
> case back to `Not Run`, and hand back the TC IDs to re-execute.

---

## Workflow

### Step 0 — Resolve the knowledge sources

Resolve this skill's knowledge sources per
[../knowledge-sources.md](../knowledge-sources.md) → §2 Resolution rule: read
[../../../qa-artifacts/qa-config/knowledge.md](../../../qa-artifacts/qa-config/knowledge.md)
§1 Sources and §2 Load sets, then read the files bound to this skill's **Always** set —
`test-data`, `navigation`, `domain` — plus `env` and `auth` when the batch needs them.

- **Never open a knowledge file by a path written in this skill.** The registry is the
  only place that knows where these files live on this project.
- A source whose `State` is `missing` or `unbound` is a **known gap**, not an empty file.
  Carry it into the Known blockers table in Step 1b — never invent its content.

### Step 1 — Read inputs

1. `qa-artifacts/1-requirements-analysis/requirements-analysis.md` — requirement IDs, ACs, risks, test types.
2. `qa-artifacts/2-test-plan/test-plan.md` — scope, strategy, test types per requirement.
3. The knowledge sources resolved in Step 0 — `test-data` is authoritative for every
   value that reaches a Test Data table. Never write a test value that contradicts it.
4. The original requirement file if the user points to one directly.

If `qa-artifacts/1-requirements-analysis/requirements-analysis.md` is missing for this spec, and a requirement file (input 4) is available, offer a choice before proceeding:

**Cursor:**
```
AskQuestion:
  title: "Requirements Analysis Missing"
  questions:
    - id: "missing_ra"
      prompt: "No requirements-analysis.md found for this spec. How would you like to proceed?"
      allow_multiple: false
      options:
        - id: "analyze_first" label: "Generate requirements analysis first, then design test cases"
        - id: "design_now"    label: "Design test cases now, directly from the raw requirement"
```

**Claude Code:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 REQUIREMENTS ANALYSIS NOT FOUND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 No qa-artifacts/1-requirements-analysis/requirements-analysis.md for this spec.
  1. Generate requirements analysis first, then design test cases
  2. Design test cases now, directly from the raw requirement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

- **Option 1 (`analyze_first`)** — invoke `stlc-requirements-analyst` on the requirement file. Once it completes, re-read `requirements-analysis.md` (and `test-plan.md` if present) and continue this workflow from Step 1 with the full inputs.
- **Option 2 (`design_now`)** — skip inputs 1 and 2. Derive requirement IDs, ACs, and test types directly from the raw requirement file. Add a "Why this matters" note under the TC metadata table on each affected test case: _"Derived directly from the raw requirement — no formal requirements analysis exists yet for this spec."_

If neither `requirements-analysis.md` nor a requirement file is available at all, stop and ask the user for the source.

### Step 1b — Hydrate the execution context

Fill in the **Execution Context** section of [template.md](template.md) *before* writing
a single test case. Every cell comes from a source resolved in Step 0 — portal, entry
route, viewport and language from `navigation`; environment and login from `env`; the
named records from `test-data`.

**The purpose is that the executor opens one file and nothing else.** A test case whose
route or account lives only in another file is not self-contained, however complete its
steps look.

**The Execution Context carries *standing* facts only** — things that already exist and
are the same on every run: the portal, the route, the viewport, the login, the fixed
records the environment was seeded with. **It never carries data the test itself has to
bring into existence.** That belongs in a `[Pre-Condition]` step — see
Step 4 → *Static versus dynamic test data*.

Then build the **Known blockers** table, and this is the part that pays for itself:

1. Walk the Execution Context cells. Any cell you could only fill with
   `Not known — {why}` is a blocker.
2. Walk the test cases you are about to write. Any that needs a role, a record or a
   permission the resolved sources do not supply is a blocker.
3. For each blocker, name the missing fact, list every TC ID it affects, and state
   whether it is already an open question (`Q-004`) or a new one.
4. **Set every affected test case to `Status: BLOCKED` with a `Blocked by` value now**,
   at design time. Do not ship it as `Not Run` for the executor to discover.

If the blockers table is non-empty, say so in the Handoff with the count, so the user can
resolve those facts before an execution run is scheduled rather than during one.


### Step 1c — Apply the open questions — never design on a guess

Read the Open Questions table of the requirements analysis. For every question with
**Status `Open`**, treat each test case whose expected result depends on it by its
**Impact**:

| Impact | What the test case does |
|---|---|
| **Blocking** | Set `Status: BLOCKED` and `Blocked by: Q-00N (Blocking — unanswered)` at design time. Add it to the Known blockers table. Still write the steps, so the case runs as soon as the answer arrives, but leave the disputed expected result as `Not known — Q-00N` |
| **Judgement** | Make that expected result **record-only**. It lists only **objective faults** — an error page or HTTP 5xx, a value lost, a value stored or shown that differs from what was entered, a value nobody entered — then says `Record the outcome for Q-00N`. It **never** asserts the answer you think likely. The case passes when no objective fault occurs |
| **Info** | No effect on the case. Name the question in "Why this matters" if it helps the reader |

A question with Status `Answered` is part of the requirement: assert its quoted answer
like any acceptance criterion, and cite the quote in the case's Requirement row.

**Self-check before writing a file:** read every Expected Result and ask, *"Does this cell
assert something the capture does not say?"* If yes, it depends on an unlisted question.
Add the question to the analysis's Open Questions (classified by the analyst's Step 3b
test) and apply the table above. Never ship the assumption.

### Step 2 — Determine the spec ID and TC ID format

Extract the spec ID from the user's message, the requirement filename, or the requirement ID.
Strip hyphens when forming the prefix: `US-012` → `US012`.

**TC ID format:** `{SPEC_ID}_{NNN}` (zero-padded to 3 digits)

| Spec | First TC | Fifth TC | Sixth TC (overflow) |
|---|---|---|---|
| FR9 | `FR9_001` | `FR9_005` | `FR9_006` |
| US012 | `US012_001` | `US012_005` | `US012_006` |
| REQ003 | `REQ003_001` | `REQ003_005` | `REQ003_006` |

**Filename format:** `{SPEC_ID}_TestCases_{FIRST_ID}-{LAST_ID}.md`
where `{FIRST_ID}` and `{LAST_ID}` are the zero-padded numbers of the first and last TC in that file.

| TCs in file | Filename |
|---|---|
| FR9_001 → FR9_005 | `FR9_TestCases_001-005.md` |
| FR9_006 → FR9_010 | `FR9_TestCases_006-010.md` |
| FR9_011 → FR9_014 | `FR9_TestCases_011-014.md` |

### Step 3 — Plan test coverage

For each requirement / AC:
- At minimum 1 **Functional** (happy path) test case
- At minimum 1 **Negative** test case (invalid input, unauthorized access, missing data)
- **Edge-case** tests where boundaries exist (empty, max/min length, zero, boundary values)
- **Regression** marker if this is a change to existing behaviour

Use test types from the test plan coverage table.

### Step 4 — Write each test case

#### Golden Rule for Test Case Titles

> **A title must answer: "What is being tested, under what condition, and what should happen?"**
>
> Anyone — developer, product manager, or a new QA — should read the title and immediately know:
> 1. **What feature or behavior** is under test
> 2. **The specific scenario or input condition**
> 3. **The expected outcome** (the pass state)

**Title formula:**
```
[Feature] — [Condition/Scenario] → [Expected Outcome]
```
Or in plain language:
```
"When [user does X under condition Y], the system should [Z]"
```

**5 title rules (apply every time):**

| # | Rule | ❌ Bad | ✅ Good |
|---|---|---|---|
| 1 | Write for the reader, not the system | "ASHRAE zone 3B maps to warm bucket" | "A school in Los Angeles scores high when the student prefers warm weather" |
| 2 | State the condition, not just the feature | "Climate preference works" | "Climate preference 'Cold' ranks Minnesota schools above Florida schools" |
| 3 | Include the expected outcome | "Test College Town in Teaser Flow" | "Selecting 'College Town' in Teaser Flow returns only town-area schools at 100% match" |
| 4 | Name the key data — avoid internal IDs | "Locale 33 college_town classification verified" | "Dartmouth College (a remote-town campus) appears in 'College Town' match results" |
| 5 | Keep under 120 characters | Write a "Why this matters" note for complex context instead of cramming it all in the title | — |

**Self-test:** Read the title aloud. If a colleague says *"I get it"* — it's good. If they say *"what does that mean?"* — rewrite it.

> All structural constraints (max TCs, max steps, ID format, status values) are enforced in the → **Rules** section below. Apply them throughout this step.

**Step prefix rules — every Action cell must begin with one of these prefixes:**

| Prefix | When to use | Screenshot required? |
|---|---|---|
| `[Pre-Condition]` | Setup steps before the test begins: login, navigate to starting page, **create any dynamic test data this case needs — with its field values written into the step** | No |
| `[Verification]` | Assert-only steps: check visible text, URL, element state, count, status — **no user action** | **Yes — always** |
| *(no prefix)* | Normal user-action steps: click, type, select, upload, drag, press key | Only on failure |

**Steps table format:**

```markdown
| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as standard customer (john@example.com / Test@1234) | Logged in, dashboard visible |
| 2 | [Pre-Condition] Navigate to My Account page via avatar dropdown | My Account page loads |
| 3 | Click "Edit" | Edit mode: all four fields become inputs; "Save Changes" and "Cancel" appear |
| 4 | Clear "First Name", type "TemporaryName" | Field shows "TemporaryName" |
| 5 | [Verification] Verify "First Name" field value equals "TemporaryName" and "Save Changes" button is enabled | Field value correct; button enabled |
```

**Consolidation rules to stay within 5 steps:**
- Merge multiple field verifications into a single `[Verification]` step (e.g. "Verify First Name, Last Name, Email, Phone are read-only" = 1 step).
- Combine closely related preconditions into one `[Pre-Condition]` row.
- A multi-screen creation flow is **one** `[Pre-Condition]` row per screen, not one per field. Chain the fields inside the row with commas and mark the submit control in bold.
- Aim for 1–2 `[Pre-Condition]` rows, 2–3 action rows, and 1 `[Verification]` row as the final step.
- A `[Verification]` step should always be the **last step** in a test case to confirm the expected final state.

**Static versus dynamic test data — classify every value the case touches.**

The test plan's **Test Data Classification** table — in its Test Data Requirements
section — should already carry the answer for this feature. **Where it does, use it.** Where a value is absent from it, or you are
designing without a plan, derive the class with the decision procedure below and add what
you decided to the plan so the next cycle inherits it.

**The decision procedure — ask these in order and stop at the first Yes:**

| # | Question | If **Yes** |
|---|---|---|
| 1 | Does this record **not exist yet** in the target environment, right now? | **Dynamic** |
| 2 | Do the case's assertions depend on **values chosen when the record was created**? | **Dynamic** |
| 3 | Does the case **consume, exhaust or invalidate** it, so a second run could not reuse it? | **Dynamic** |
| 4 | Must two runs — or two cases running at the same time — each hold **their own instance**? | **Dynamic** |
| 5 | Does the case **change** it, where it is environment configuration other cases and other people share? | **Configuration** |
| — | None of the above | **Static** |

**Question 2 is the one most often got wrong, and it is the one that matters most.** If a
case asserts that X happens *because* a field was set to Y when the record was made, then
the case must set Y itself — otherwise the reader cannot see why that result is expected,
and the case silently passes or fails on somebody else's data choice. A record that looks
permanent can still be dynamic for this reason alone.

**When you cannot decide, choose Dynamic.** A wrongly-dynamic case is slower and leaves a
record behind. A wrongly-static case cannot be executed at all, or quietly depends on
leftovers from an earlier run — a worse failure, and a harder one to diagnose.

**The three classes and what each one obliges you to write:**

| Class | Meaning | Where it lives | Obligation |
|---|---|---|---|
| **Static** | Already exists, reused unchanged, unaffected by the run | **Execution Context** table, resolved from `env` / `test-data` | Name the record precisely enough to find it. A reference to the registry is fine |
| **Dynamic** | The case must bring it into existence | **A `[Pre-Condition]` step**, field values written into the step | Spell out the creation. Record it in the Execution Context's **Leaves behind** cell |
| **Configuration** | Exists and is shared, but this case changes it | Current value in the **Execution Context**; the change **and its restore** in the steps | Record the original value in an early step and restore it before the case ends. Never leave the environment altered |

**Worked examples from this project** — the reasoning, not just the answer:

| Value | Q that decided it | Class |
|---|---|---|
| Dealer login `vinhle870@gmail.com` | No to all — it exists, nothing depends on how it was made, nothing consumes it | Static |
| Vehicle `915` (seeded Ford Focus) | No to all — reused unchanged across cases | Static |
| A **Chubb creditor-insurance contract** | **Q2** — the case asserts which disclosure form is attached *because* Language and Form were set at creation. Also Q1 when none exists | Dynamic |
| Client inbox `client.stage.NNN@yopmail.com` | **Q4** — a fresh address per run, so old mail cannot be mistaken for new | Dynamic |
| Dealer 1380's **Chubb creditor-form assignment** | **Q5** — AP2437_017 deselects the forms to test the empty state, and every other case depends on them | Configuration |
| A **second** contract for a different client | **Q4** — the case compares two contracts, so one instance cannot serve | Dynamic |

**Dynamic test data must be created inside a `[Pre-Condition]` step, with its values
written in the step itself. Never point at `test-data`, `base-test/` or any other file
for it.** A step that says *"run the contract-setup baseline"* is not an executable step:
the executor cannot perform it without opening another document, cannot tell whether they
performed it correctly, and cannot see which field values decided the outcome they are
about to assert on. Write the values in:

```markdown
| 1 | [Pre-Condition] Create a Chubb contract on a quote with a client and vehicle: at `/quote/{id}/financing` set Date of birth `1985-06-15`, Type "Financing", Net amount `25000`, Residual `0`, Payment frequency "Monthly", Term `60`, Interest rate `6.99`, Financing company "AutoCapital Canada" → **Save** | Flash "Financing saved"; "Add creditors insurance" appears |
| 2 | [Pre-Condition] At `/quote/{id}/insurance` set **Language "Français"** and **Form "Monthly Premium PM50"**, Life "Decreasing" / `60` / "Borrower" → **Get Quote**, then **Generate Contract** → **Create Contract** | Flash "Chubb insurance contract created successfully"; the contract is listed on `/creditor-insurance-contracts` |
```

Both rows are dense, and that is correct — density beats a cross-reference. **The fields
that decide the test's outcome must be visible in the step that sets them.** In the
example the Language and Form values select which document the feature attaches, so a
reader can see at a glance why this case expects the result it does.

Where the same creation flow is used by many cases, a `base-test/` file may still hold the
**canonical copy, the background and the register of what has been created** — but it is a
reference for the designer, never a substitute for the steps. The test case still spells
out what to do.

**Reuse before creating.** When a created record can safely serve more than one case, say
so in the step: *"Use contract AVP000160 if it still exists; otherwise create one as
follows…"*. Then note in the Execution Context's **Leaves behind** cell what each run
leaves on the environment.

Each test case must be:
- **Self-contained**: every value the executor must type is in the Test Data table or in the step itself. Static records may be named and resolved through the registry; **dynamic records are created in a `[Pre-Condition]` step, never referenced out to another file**.
- **Unambiguous**: exact UI labels, button text, and field names in quotes.
- **Verifiable**: expected results are observable (visible text, URL change, toast message, HTTP status).

### Step 5 — Assign TC IDs and compute filenames

Before writing any file:
1. Assign TC IDs sequentially: `{SPEC_ID}_001`, `{SPEC_ID}_002`, …
2. Group into batches of 5.
3. Compute the filename for each batch from the first and last ID in that batch.

Example for 14 test cases on FR9:

| Batch | TC IDs | Filename |
|---|---|---|
| 1 | FR9_001 – FR9_005 | `FR9_TestCases_001-005.md` |
| 2 | FR9_006 – FR9_010 | `FR9_TestCases_006-010.md` |
| 3 | FR9_011 – FR9_014 | `FR9_TestCases_011-014.md` |

### Step 6 — Write output files

Write each batch file to `qa-artifacts/3-test-cases/` using the structure in [template.md](template.md).

If files for this spec ID already exist, read them to find the highest existing TC number, then continue from the next number and compute new filenames accordingly.

---

## Output Language

Write each test case so someone who has never seen the feature could execute it
by hand. Keep the table structure and the `{SPEC_ID}_NNN` ID format from
[template.md](template.md) exactly — change only the wording inside them.

- Every step names the real button, field, page and value the user sees.
- Every Expected Result is a full sentence describing what appears on screen,
  not a fragment such as `Saved OK`.
- Preconditions say what state the system must be in and how to get there.
- Never ship a `{{PLACEHOLDER}}` token — write `Not known` and say why.

Full rules and worked examples: [../output-style.md](../output-style.md).

---

## Rules

### Title rules
- **A TC title must state what is tested, the condition, and the expected outcome** — one sentence, plain English, readable by any team member without QA background.
- **Never use internal codes, field names, or tech jargon in the title.** Move those to the steps or a "Why this matters" note.
- **Title must be under 120 characters.** If more context is needed, add a "Why this matters" paragraph directly below the TC metadata table.
- **The title is a mini-assertion.** If the test fails, the title alone must tell a developer exactly what broke.

### Structure rules
- **Always resolve the knowledge sources in Step 0 before writing any Test Data table.** The file bound to `test-data` is authoritative; never fabricate a value that conflicts with it, and never reach a knowledge file by a hardcoded path.
- **The Execution Context section is mandatory** — a batch file without it is incomplete, even if all five test cases are written.
- **A missing fact is `BLOCKED` at design time.** Never ship a test case as `Not Run` when Step 1b already showed it cannot be executed.
- **TC ID and filename format:** defined with examples in Step 2 above — follow exactly. Never use `TC-` prefix. IDs are globally sequential per spec; never reuse.
- **Max 5 TCs per file.** Start a new file at TC 6. Compute the filename from the actual first–last ID range in that batch.
- **Max 5 rows in the Steps table** (including `[Pre-Condition]` and `[Verification]` rows).
- **No separate Preconditions block.** Use `[Pre-Condition]` step rows only.
- **Classify every data value the case touches before writing its steps** — Static, Dynamic or Configuration — using the test plan's Test Data Classification table where it exists, otherwise the decision procedure in Step 4 → *Static versus dynamic test data*. When undecided, choose Dynamic.
- **Dynamic test data is created in a `[Pre-Condition]` step, with its field values written into that step.** Never satisfy it by referring the executor to `test-data`, a `base-test/` file, or any other document.
- **Configuration data that a case changes must be restored by that same case**, with the original value recorded in an earlier step.
- **If a creation flow will not fit the 5-row limit, split the test case or drop a low-value action step — never compress it into a cross-reference.** A case that cannot be executed from its own steps is worth less than a case with narrower scope.
- **Every step Action must start with `[Pre-Condition]`, `[Verification]`, or have no prefix** (plain action). Never leave a step prefix ambiguous.
- **The last step of every test case must be a `[Verification]` step** confirming the expected final state.
- Step actions must quote exact UI labels: `Click "Save Changes"`, `Enter "John" in "First Name"`.
- Expected results must be observable — no vague phrases like "it works".
- Test data must be complete. For sensitive values: `[SET IN .env: VAR_NAME]`.
- **Never assert an unanswered question's answer.** An expected result that depends on an `Open` question is BLOCKED (Blocking) or record-only (Judgement) — Step 1c.
- Status is `Not Run` at design time, except cases set to `BLOCKED` by Step 1b or 1c. Status values (`PASS`, `FAIL`, `BLOCKED`, `SKIPPED`) are reference data — see template.md.

---

## Resources

- Full file structure and all placeholder variables: [template.md](template.md)
- Correcting cases after a bug is confirmed not valid: [correction.md](correction.md)
- **Knowledge sources — resolution rule and source IDs:** [../knowledge-sources.md](../knowledge-sources.md)
- **This project's knowledge bindings:** [../../../qa-artifacts/qa-config/knowledge.md](../../../qa-artifacts/qa-config/knowledge.md)
- Plain-language rules for every artifact this skill writes: [../output-style.md](../output-style.md)

---

## Handoff

> "Test case design complete. [M] test cases written for [SPEC_ID] across [N] file(s).  
> Files: FR9_TestCases_001-005.md [, FR9_TestCases_006-010.md …]  
> Next step → run **stlc-manual-executor** to execute the test cases in the browser."

---

## Next Move

Before printing this block, update `qa-artifacts/.session-state.md`:
- `pipeline_stage: test-cases-done`
- `last_skill_run: stlc-testcase-designer`
- `last_action: [M] test cases written for [SPEC_ID]`
- `artifacts.test_cases: <path to file(s)>`

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SKILL COMPLETE: Test Case Designer
 Output: [M] test cases for [SPEC_ID] in [N] file(s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 WHAT TO DO NEXT:
  → [PRIMARY]   Execute test cases — say "execute test cases"
  → [ALTERNATE] Peer-review test cases before execution
  → [ALTERNATE] Check execution environment is ready (menu option 10)
  → [QUICK]     View today's execution queue (menu option 6)
  → [PAUSE]     Save progress and exit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Say "what's next" at any time to see this again.
```
