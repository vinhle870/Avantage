# Ticket Pipeline — Routing Reference

Read this file while executing `stlc-ticket-pipeline`. Paths use the tokens from
[../ticket-scope.md](../ticket-scope.md) §2.

---

## 1. Intake

### 1.1 Fetch

Call **`tracker.get_ticket`** for `{KEY}` with its comments (the adapter's capability map
gives the comment flag). If the ticket has a parent, call `tracker.get_ticket` on the
parent too, for its subject and description only.

Ticket not found → stop: `Ticket {KEY} not found.`

### 1.2 Check the status

Map the provider status to its canonical value through the adapter's Vocabulary map.

| Canonical status | `gate_mode: rules` | `gate_mode: ask` |
|---|---|---|
| `ready_for_qa` | Continue | Continue |
| Anything else | Design only: set `--until s3b` and say why — the build may not contain the change | Ask: _"{KEY} is <status> — the build may not contain this change yet. Continue, design only (stop after review-cases), or stop?"_ (Recommended: design only) |
| No canonical equivalent | Treat as "Anything else" and name the provider status | Same |

### 1.3 Fix the run folder

Set `{RUN}` to the first of these that exists: the ticket's sprint name, its fix version,
or `default_run_folder` from the registry's *Pipeline gate rules*. If none exists, ask
once (E3): _"Which run folder should results go under? (e.g. 5.1.0)"_. Never borrow a
folder from a sibling ticket. Write `{RUN}` and its source into the run-state file.

### 1.4 Write the requirement capture

- **No file matches `requirements/{KEY}-*.md`** → write `requirements/{KEY}-{SLUG}.md`
  from [template.md](template.md) §2. Transcribe the description and acceptance criteria
  word for word, list attachments by name, and summarise each comment in one line with
  its author and date.
- **A file exists** → compare the ticket's `updated` time with the file's `Captured on`
  line. If the ticket changed later, append the section from [template.md](template.md)
  §2.1 and flag it at Gate A. Never rewrite the existing text.

Mark `intake` done when the capture file exists.

### 1.5 Check filed bugs for rejections

Only when `{KEY}_bug-report.md` already exists (a resume or a `--from` re-run). For each
bug in it that has a ticket ref and is not yet marked Not a defect:

1. Call `tracker.get_ticket` with comments.
2. It is a **rejection candidate** when its canonical status is `done` or `closed` and its
   resolution or latest comments say the behaviour is intended — "not a bug", "works as
   designed", "as expected", "won't fix — by design".
3. Decide each candidate by rule, quoting the deciding comment:
   - **R1 — confirm.** The comment is by someone not in `not_developers` **and** states
     what the correct behaviour is ("descriptions need not be unique — duplicates are
     allowed"). That sentence is the confirmed behaviour.
   - **R2 — stop for the user (E5).** The comment only says "not a bug" or "works as
     designed" without stating the behaviour, or the author is in `not_developers`. Ask:
     _"<bug> was closed as not a bug without saying what should happen. What should
     <TC ID> expect?"_
4. Confirmed → run `stlc-testcase-designer` in correction mode
   ([../stlc-testcase-designer/correction.md](../stlc-testcase-designer/correction.md)).
   The corrected cases are `Not Run`, so the next `s4` executes them.

A bug that is `done` because it was **fixed** is not a candidate — it goes to re-test as
normal.

---

## 2. Stage table

| Stage | Skill | Inputs passed in the hand-off | Done-check (all must hold) | Gate after |
|---|---|---|---|---|
| `s1` | `stlc-requirements-analyst` | the capture file only — not the whole `requirements/` folder | `{KEY}_requirements-analysis.md` exists and lists ≥ 1 REQ ID | **A** |
| `s2` | `stlc-test-plan-designer` | analysis file | `{KEY}_test-plan.md` exists | — |
| `s3` | `stlc-testcase-designer` | analysis + test plan; spec ID `{SPEC}` | ≥ 1 `{SPEC}_TestCases_*.md` exists | — |
| `s3b` | `stlc-testcase-reviewer` | analysis + test plan + every `{SPEC}_TestCases_*.md` | `{SPEC}_ReviewFindings_{DATE}.md` exists | **B** |
| `s4` | `stlc-manual-executor` | every `{SPEC}_TestCases_*.md`; `{RUN}` as the sprint | an execution log for `{KEY}` dated `{DATE}` exists and every TC has a status other than `Not Run` | **C** |
| `s4c` | `stlc-testcase-designer` (correction mode), then `stlc-manual-executor` for the corrected TC IDs only | Gate C rule C1 "Not a bug" decisions with their quoted behaviour | every corrected case has a Revisions row and a re-run result in the execution log | **C** again, once, for any corrected case that still fails |
| `s5` | `stlc-bug-reporter` | latest execution log + TC files + the Gate C decisions | `{KEY}_bug-report.md` exists; every FAIL is filed, linked or dismissed | — |
| `s6` | `stlc-test-reporter` | every artifact above | `{KEY}_test-report.md` exists with a verdict line | — |
| `s7` | `stlc-ticket-updater` | test report + bug report; target ticket `{KEY}` | every action in the Gate D plan is applied and read back | **D** (inside s7) |

**Before s4**, run the environment health check (`agent-coordination` routing → c2).
FAIL → mark `s4` `failed` with the reason "environment down" and stop. Do not execute
test cases against a broken environment.

**s3b is skipped** when the run uses `--from s4` or later. Record it as `skipped`.

**s4c is skipped** when Gate C has no "Not a bug" (C1) decision. The executor appends the re-run
to the same day's execution log under a `Re-run after correction` heading — it never
starts a new log for it.

---

## 3. Gates

### 3.0 How a gate is decided

Every gate is a **rule table**. Read `gate_mode` from the registry's *Pipeline gate
rules* ([../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md) §2):

- **`rules`** — evaluate the gate's rules top to bottom, take the **first rule whose
  condition holds**, apply its action, and continue without asking. Print the gate block
  (≤ 12 lines) for the record, ending with `Decided by rule <ID>`.
- **`ask`** — evaluate the rules the same way, then show the block and ask, with the rule's
  result as the **(Recommended)** option. The user's answer overrides the rule.
- **`reviewer`** — run `stlc-qa-reviewer` at the gate's checkpoint (table below) and act on
  its verdict block. Launch it as a general-purpose subagent with only `{KEY}` and the
  checkpoint when this run is not itself a subagent; otherwise run it inline. `APPROVE` →
  apply its gate decision. `REWORK` → re-run `rework_stage` for `rework_scope` with the
  findings in the hand-off, then review again with `round + 1`. `PARK` → post the park
  reason on `{KEY}`, mark the affected cases BLOCKED, continue. The stop points below
  never reach the user — the reviewer's rules in `stlc-qa-reviewer/checklists.md` §6
  replace them.
  **Inside an `stlc-worker` dispatched by `stlc-qa-orchestrator`** — the orchestrator's
  `qa-reviewer` decides every gate, so never review your own work: stop at the `--until`
  stage **before** its gate and return `DONE`. When the hand-off carries a *Gate … decided
  by qa-reviewer* line, apply that decision first (post the questions, promote the
  cases, file the bugs, apply the outcome) and log it `by reviewer`.

| Gate | Reviewer checkpoint | Runs |
|---|---|---|
| A | `R1` | after `s1` |
| B | `R2` | after `s3b` (or after `s3` when `s3b` is skipped) |
| C | `R3` | after `s4`, before `s5` files anything |
| D | `R4` | inside `s7`, before any tracker write |

**The no-assumption rule.** A rule's condition holds only on **evidence you can cite**: a
count from an artifact, a status from the tracker, or a sentence quoted word for word from
the requirement capture or a ticket comment. A condition you could only satisfy by
guessing what the author meant — "probably", "most likely", "the usual behaviour", "the
sibling ticket did" — **does not hold**. Fall through to the next rule. Every gate's last
rule is a safe fallback that needs no interpretation.

Write each decision to the run-state Gate log as:
`<time> — Gate <X>: <action> — rule <ID> — by <rules | user> — evidence: <counts, quote, or ticket refs>`.

**The pipeline stops for the user only at these points.** Anything else is decided by a
rule:

| # | Stop point | Why a rule cannot decide it |
|---|---|---|
| E1 | Gate A rule A1 — every requirement is blocked by an unanswered question | Nothing can be tested until the author answers |
| E2 | Gate C rule C3 — a possible duplicate that matches only partly | Only a human can tell whether two descriptions are the same defect |
| E3 | Intake §1.3 — no sprint, no fix version and no `default_run_folder` | The folder name is a team convention, not ticket data |
| E4 | A subagent returns a question (§5) | The question is outside every rule |
| E5 | Intake §1.5 — a rejection whose deciding comment does not state the intended behaviour | Correcting a test case needs the right behaviour written down |

`--auto` is kept as an alias for `gate_mode: rules` on one run. It no longer changes any rule.

### Gate A — after requirements analysis

**Input:** the Open Questions table of `{KEY}_requirements-analysis.md`. Every question
carries an **Impact** — `Blocking`, `Judgement` or `Info` — and a **Status** — `Open` or
`Answered`. The analyst sets both by fixed tests
([../stlc-requirements-analyst/SKILL.md](../stlc-requirements-analyst/SKILL.md) Step 3b).
A requirement with **no acceptance criterion** always has a `Blocking` question. If the
table has no Impact column, or any row has none, mark `s1` `failed` with "open questions
not classified" and re-run `s1`. Never classify a question yourself at the gate.

| Rule | Condition (first match wins) | Action |
|---|---|---|
| **A1** | Every requirement has at least one `Blocking` + `Open` question | Post the Blocking questions on `{KEY}` (comment below). **Stop** (E1). Resume with `{KEY} --from analyze` once the author answers |
| **A2** | At least one `Blocking` + `Open` question, but not on every requirement | Post the Blocking questions on `{KEY}`. **Continue.** `s3` marks every test case that depends on them `BLOCKED` at design time, and Gate D will not move the story while they are open |
| **A3** | No `Blocking` + `Open` question | **Continue** |

`Judgement` and `Info` questions never stop the run and are never posted at Gate A. They
reach the author in the s7 story comment. `s3` turns each `Judgement` question into
*record-only* expected results, so no test result depends on a guessed answer.

**Questions comment** — post once per run, through `tracker-manage-child-ticket`,
following `apply_mode`. Before posting, read the ticket's comments. If a QA comment
already lists the same question IDs, do not post again; record "already asked on <date>":

```
h3. QA questions before testing — {{DATE}}

Testing of {{KEY}} cannot judge the requirements below until these are answered:

||#||Question||Blocks||
|Q-00N|{{question}}|REQ-00N — {{test cases that stay BLOCKED}}|

Please answer in a comment on this ticket. QA re-runs analysis once answered.
```

A ticket that changed after capture (Intake §1.4) needs no gate rule: s1 has already read
the appended section. Log the flag in the Gate A line.

### Gate B — after test-case review

**Input:** `{SPEC}_ReviewFindings_{DATE}.md` — Pass 1 gaps (each with its **Cites**) and
Pass 2 proposals (each with its **Priority**).

| Rule | Condition (first match wins) | Action |
|---|---|---|
| **B1** | A Pass 1 gap cites a **requirement or acceptance criterion** (`REQ-00N` / `AC n`) that has no test case | Promote **only those gaps**, plus every **High** Pass 2 proposal. Re-run `s3` with them as input, then go to `s4` |
| **B2** | At least one Pass 2 proposal has priority **High** | Promote **only the High proposals**. Re-run `s3`, then go to `s4` |
| **B3** | Otherwise | **Execute the current cases.** List the unpromoted proposals in the Gate B log line |

Promotion happens **at most once per run**. After the re-run of `s3`, do not run `s3b`
again — go straight to `s4`. A gap that cites only the test plan (not a requirement) is
not a B1 trigger. A promoted case follows the same no-assumption design rules as every
other case.

### Gate C — before filing bugs

Skip it when the execution log has no FAIL. Otherwise, for every FAIL:

1. Build a search from the TC's feature area and 3–5 words from the actual result.
2. Call **`tracker.search_tickets`** for open `bug` tickets in the project. If the
   adapter marks it **Unsupported**, say so. Every FAIL then goes through rule C4.
3. Read each candidate's summary and description (`tracker.get_ticket`).
4. Apply the rules below **per FAIL**.

| Rule | Condition (first match wins) | Decision |
|---|---|---|
| **C1** | The requirement capture, or a ticket comment by someone not in `not_developers`, contains a sentence stating that the **actual** result is the intended behaviour | **Not a bug.** Quote the sentence and its source. The quote is the confirmed behaviour `s4c` rewrites the case to expect |
| **C2** | A candidate bug is open and its summary or description names **the same screen or field** and **the same wrong behaviour** as the actual result | **Comment on existing <ref>.** Quote the candidate sentence that matches |
| **C3** | A candidate names the same screen or field, but its described behaviour differs or is too vague to compare | **Stop for the user** (E2). Show TC ID · actual result · candidate ref and its sentence. Ask: _File new, or comment on <ref>?_ |
| **C4** | Otherwise | **File new** |

**Never pick Not a bug on reasoning.** "Seems reasonable", "the sibling field does the
same", "the developer probably meant it" are not C1 evidence. Without a quotable sentence
the FAIL falls through to C2–C4, and the bug ticket asks the question for you.

A FAIL on a step whose expected result is *record-only* (a `Judgement` question) should
not happen, because such steps fail only on objective faults. If one does, the fault is
objective — an error page, a lost value, a stored value different from what was entered —
so it goes through C2–C4 like any other FAIL.

Pass the decisions to `s5`. Filing and commenting follow `apply_mode`: `automatic` files
without asking, `confirm` shows the per-FAIL plan first.

### Gate D — ticket outcome (rule-based)

Read the *QA outcome rules* in
[../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md) §2.
They give the target statuses, the pass threshold, the QA account and `apply_mode`.
Build the **outcome plan** from §3.1–§3.3, then:

- `apply_mode: automatic` → apply every action, in the order listed, without asking.
- `apply_mode: confirm` → show the plan and apply it on a yes.

Apply through `stlc-ticket-updater`: comment first, then status, then assignee. After
each write, re-read the ticket and confirm the change landed. A transition the tracker
refuses is reported with the ticket's current status — never retried with another
status. Record every action and its result in the run-state Gate log.

#### 3.1 Story (or task) ticket

Always post the **story result comment** ([template.md](template.md) §4.1): the totals,
one line per failed or blocked case, the passed IDs on one line, bugs, the questions that
need an answer, and the next step. Keep it to about 10 lines — the full per-case table
stays in the test report.

Move to `story_pass_status` only when **all** of these hold:

| Check | Pass when |
|---|---|
| Pass rate | PASS ÷ (all cases − `SKIPPED`) × 100 ≥ `story_pass_threshold`. `BLOCKED` and `Not Run` count as not passed |
| No stopping bug | No bug linked to this run is still open **and** a stopping bug (below) |
| No blocking question | No `Blocking` question in `{KEY}_requirements-analysis.md` is still `Open`. An unanswered Blocking question means a requirement was never judged, whatever the pass rate |

A bug is **stopping** when either is true:

1. **It blocks testing.** It made another test case `BLOCKED`, or it failed a step that is
   not the case's last, so the remaining steps of that case could not be run.
2. **It is severe.** Its bug-report severity is Critical or High.

"Linked to this run" means every bug in `{KEY}_bug-report.md`, filed now or earlier, that
is not marked Not a defect and whose ticket is not in `bug_pass_status`.

When it moves, also assign the story to `story_pass_assign` (skip this when the setting is
`—`). The assignee changes only together with a successful move to `story_pass_status` —
if the transition is refused, the assignee stays as it is.

Otherwise leave the status and assignee unchanged. The comment's last line names the failed check:
_"Not moved to <story_pass_status>: pass rate 85% (needs 90%)"_ or _"…: AP-2490 blocks
AP2473_004–005"_.

#### 3.2 Bug tickets

Applies to the ticket of a **bug re-test run** (§4), and to every bug in
`{KEY}_bug-report.md` that is in the tracker's QA status and whose linked test case ran
in this run.

| Re-test result of the bug's test case(s) | Actions, in order |
|---|---|
| All PASS | **Bug re-test comment** ([template.md](template.md) §4.2) → move to `bug_pass_status` |
| Any FAIL or BLOCKED | Bug re-test comment with the failing step and evidence → move to `bug_fail_status` → assign to the developer (§3.3) |

A bug whose test case did not run in this run gets no action.

#### 3.3 Who "the developer" is

Anyone in the registry's `not_developers` list (the QA account, and whoever triages new
bugs or receives releases) is **never** the developer, even when they are the current
assignee. Take the first person who is not on that list:

1. The bug's current assignee.
2. Walking `tracker.get_history` from newest to oldest: each earlier assignee, in turn.
3. In the same history, whoever moved the bug into the QA status.

Example: AP-2491 was filed and assigned to Ken Nguyen, Ken assigned it to Minh Lưu, then
reassigned it to himself to review. Current assignee Ken is skipped; walking back finds
Minh Lưu.

None found → apply the comment and status, leave the assignee unchanged, and list it
under **Left behind** in the closing report: _"AP-2491: no developer found in the ticket
history — assign by hand."_

---

## 4. Bug re-test flow

When Intake finds the ticket's canonical type is `bug`:

| Stage | Change |
|---|---|
| `s1`, `s2` | `skipped` — a bug's steps to reproduce are its requirement |
| `s3` | Design a re-test case from the steps to reproduce + 1–2 regression cases nearby |
| `s3b` | `skipped` |
| `s4` | As normal |
| `s5` | A FAIL here means the fix did not work. Record it in the bug report against `{KEY}` — never file a new bug for it |
| `s6` | As normal |
| `s7` | Gate D §3.2 on `{KEY}`: PASS → `bug_pass_status`; FAIL → `bug_fail_status` and re-assign to the developer |

---

## 5. Failure handling

| Situation | Action |
|---|---|
| A stage skill errors out | Mark it `failed` with the error in one sentence. Stop |
| A subagent returns a question | Ask the user that question, then re-run the stage with the answer in the hand-off |
| A done-check fails | Mark it `failed`, name the missing artifact. Stop |
| The user interrupts mid-stage | Leave the row `running`. The next run asks whether to restart that stage |
| A tracker write fails | Keep the local artifact. Report the failure. Never claim the ticket was written |
