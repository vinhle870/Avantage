---
name: stlc-test-plan-designer
description: >-
  Design a formal test plan from requirements-analysis.md and write
  qa-artifacts/test-plan.md following IEEE 829 structure. Use when the user asks to
  "design the test plan", "create the test plan", or after stlc-requirements-analyst
  has produced its output. Part of the 7-skill STLC QA pipeline.
---

# Skill 2 — Test Plan Designer

You are a senior QA engineer performing the **Test Planning** phase of the STLC. Read `qa-artifacts/requirements-analysis.md`, then write a formal `qa-artifacts/test-plan.md` aligned to **IEEE 829** standards.

> **Ticket scope.** When a ticket key is in scope, read and write the per-ticket paths in [../ticket-scope.md](../ticket-scope.md) — they override every default path in this file. When `stlc-ticket-pipeline` invokes this skill, it passes the key, the inputs and any answer this skill would otherwise ask for; use them and do not ask again.

---

## Workflow

### Step 1 — Read inputs

Read these files in order:
1. `qa-artifacts/requirements-analysis.md` — the requirement IDs, priorities, test types, and risks you must cover.
2. Any additional context files the user provides (architecture docs, environment specs, etc.).

If `requirements-analysis.md` is missing, stop and say: _"Run stlc-requirements-analyst first to generate qa-artifacts/requirements-analysis.md."_

### Step 2 — Determine test strategy

For each requirement, decide:
- Which **test levels** apply: Unit · Integration · System · UAT
- Which **test types** apply (from the recommended list in requirements-analysis.md)
- **Entry criteria** — what must be true before testing begins
- **Exit criteria** — what must be true before testing is considered done
- **Suspension/resumption criteria** — when to pause and restart

### Step 3 — Identify environment and tooling

State the required:
- **Browsers / devices** (if UI testing is in scope)
- **Test data strategy** (seed data, generated data, production clone)
- **Tools and test execution mode**: read [../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md)
  §1 Bindings and name the actual providers this project is bound to, plus which
  capability groups the pipeline needs — [../mcp-tools.md](../mcp-tools.md) → §7. Do
  not invent a tool name or assume a provider is reachable. Any capability group in the
  `unbound` or `disabled` state goes in the plan's risk table.

### Step 4 — Write the output file

Write to `qa-artifacts/2-test-plan/test-plan.md`. Use the full structure defined in [template.md](template.md). Do not omit any section.

---

## Output Template

See full template with all 12 sections and placeholder variables: [template.md](template.md)

Quick structure:

````markdown
# Test Plan

**Plan ID:** TP-[YYYYMMDD]-001
**Project:** [project name]
**Version:** 1.0
**Date:** [today's date]
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/requirements-analysis.md

---

## 1. Test Objectives

[What this test effort aims to verify. 3–5 bullet points.]

- Verify that all acceptance criteria in REQ-001 through REQ-[N] are met.
- Confirm the system behaves correctly under valid, invalid, and boundary inputs.
- Identify defects before the feature reaches production.

---

## 2. Scope

### In Scope
[List features / requirements / test types that WILL be tested]

| Requirement | Test Types |
|---|---|
| REQ-001 — [name] | Functional, Negative, Regression |
| REQ-002 — [name] | Functional, Edge-case, UI |

### Out of Scope
[Features or test types explicitly excluded, with reason]

---

## 3. Test Strategy

### 3.1 Test Levels
| Level | Description | Responsible |
|---|---|---|
| System Testing | End-to-end feature validation via browser | QA Agent |
| Regression | Re-run of prior passing tests after changes | QA Agent |

### 3.2 Test Types
| Type | Approach |
|---|---|
| Functional | Verify each AC step by step |
| Negative | Submit invalid inputs, verify error handling |
| Edge-case | Boundary values, empty states, max/min inputs |
| UI | Visual checks via screenshot comparison |

### 3.3 Test Execution Method
All manual test cases will be executed by the **stlc-manual-executor** skill through the project's bound `browser` provider (see `qa-artifacts/qa-config/tools.md`). The AI agent navigates the browser, captures screenshots as evidence, and logs step results.

---

## 4. Entry Criteria
- [ ] Application is deployed and accessible at `APP_BASE_URL`
- [ ] All requirement files are present in `requirements/`
- [ ] `qa-artifacts/requirements-analysis.md` has been reviewed
- [ ] Test cases have been written (`qa-artifacts/test-cases.md` exists)

## 5. Exit Criteria
- [ ] All High-priority test cases executed
- [ ] No open Critical or High-severity bugs
- [ ] Test pass rate ≥ [X]% (define threshold here)
- [ ] `qa-artifacts/test-report.md` generated and reviewed

## 6. Suspension Criteria
Testing is suspended if:
- The application is inaccessible for more than 30 minutes
- More than 30% of test cases are blocked by a single defect
- A Critical-severity bug is found that prevents further execution

---

## 5. Test Environment

| Component | Details |
|---|---|
| Application URL | `APP_BASE_URL` (set in .env) |
| Browsers | Chromium (Playwright default) |
| Test data | [describe: seed scripts / manual setup / generated] |
| Bug tracker | the `tracker` provider bound in `qa-artifacts/qa-config/tools.md` |
| Screenshot path | `reports/screenshots/` |

---

## 6. Test Data Requirements

[List specific data that must exist before testing:]

- User accounts: [roles needed]
- Pre-populated records: [describe]
- Edge-case values: [boundary inputs to prepare]

### 6.1 Test Data Classification

_Decided once here, and inherited by every test case. `stlc-testcase-designer` reads this
table instead of re-deriving it, and puts Static values in the Execution Context, Dynamic
values in a `[Pre-Condition]` step, and Configuration values in a change-then-restore pair._

Classify each data item with the decision procedure in
`stlc-testcase-designer` SKILL.md → Step 4 (*Static versus dynamic test data*): ask in
order whether it (1) does not exist yet, (2) has creation-time values the assertions
depend on, (3) is consumed by the run, (4) needs one instance per run or per parallel
case, or (5) is shared configuration this feature changes. First Yes decides. **Undecided
means Dynamic.**

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| {{e.g. Dealer login}} | Static | None applied | Named in Execution Context, resolved from `env` |
| {{e.g. A Chubb contract}} | Dynamic | Q2 — assertions depend on values set at creation | Created in a `[Pre-Condition]` step with its field values |
| {{e.g. Dealer Chubb configuration}} | Configuration | Q5 — a case changes shared configuration | Original recorded, changed, restored inside the same case |

**Anything classified Dynamic is a cost**, so say what it costs: how long creation takes,
whether it calls a third party, and what it leaves on the environment. If a Dynamic item
can safely be reused across cases, say so and name the instance — but the case still
spells out how to create one when it is absent.

---

## 7. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| [Unstable test environment] | Medium | High | Run smoke test before full execution |
| [Missing test data] | Low | High | Document setup steps in preconditions |
| [Ambiguous ACs in REQ-00X] | High | Medium | Raise as open question before execution |

---

## 8. Test Schedule

| Phase | Activity | Owner |
|---|---|---|
| Day 1 | Requirements analysis | stlc-requirements-analyst |
| Day 1 | Test plan design | stlc-test-plan-designer |
| Day 2 | Test case design | stlc-testcase-designer |
| Day 2–3 | Test execution | stlc-manual-executor |
| Day 3 | Bug reporting | stlc-bug-reporter |
| Day 3 | Test reporting | stlc-test-reporter |
| Day 4 | Ticket update | stlc-ticket-updater |

---

## 9. Sign-off Checklist
- [ ] Test objectives reviewed by product owner
- [ ] Environment confirmed available
- [ ] Entry criteria met before execution begins
````

---

## Output Language

The IEEE 829 section structure is fixed, but the text inside it must read
plainly. Keep every heading, table and numbered section from
[template.md](template.md) — change only the wording inside them.

- Full sentences in every prose field, not fragments.
- Gloss each technical term on first use, including entry criteria, exit
  criteria, regression and smoke test.
- Give the reason behind every risk rating and every go/no-go threshold.
- Never ship a `{{PLACEHOLDER}}` token — write `Not known` and say why.

Full rules and worked examples: [../output-style.md](../output-style.md).

---

## Resources

- Output format and all section definitions: this file, §Output Template
- Plain-language rules for every artifact this skill writes: [../output-style.md](../output-style.md)

---

## Rules

- Never skip a section — write "N/A" with a reason if a section does not apply.
- Reference requirement IDs (REQ-001 etc.) from `requirements-analysis.md` exactly.
- Do not design test cases here — that is the job of `stlc-testcase-designer`.
- **Always fill §6.1 Test Data Classification.** Classifying data once at planning time is what lets the designer write self-contained preconditions without re-deriving the same judgement for every case. A plan that leaves it blank pushes the decision into 20 separate test cases, where it will be made inconsistently.
- Keep the strategy prescriptive: state which test types and levels apply to which requirements.

---

## Handoff

When `qa-artifacts/test-plan.md` is written, tell the user:

> "Test plan complete (IEEE 829). Covers [N] requirements across [M] test types.  
> Next step → run **stlc-testcase-designer** to write detailed test cases."

---

## Next Move

Before printing this block, update `qa-artifacts/.session-state.md`:
- `pipeline_stage: test-plan-done`
- `last_skill_run: stlc-test-plan-designer`
- `last_action: Test plan written — [N] requirements, [M] test types`

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SKILL COMPLETE: Test Plan Designer
 Output: test-plan.md — [N] requirements, [M] test types
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 WHAT TO DO NEXT:
  → [PRIMARY]   Write test cases — say "design test cases"
  → [ALTERNATE] Review test plan for coverage gaps
  → [ALTERNATE] Run QA coverage gap analysis (menu option 12)
  → [QUICK]     Check environment health before execution (menu option 10)
  → [PAUSE]     Save progress and exit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Say "what's next" at any time to see this again.
```
