---
name: stlc-test-automator
description: >-
  Turn one ticket's executed manual test cases into Playwright TypeScript automation in
  playwright-automation/ — reusing its page objects and flows, adding only verified
  locators, writing a spec tagged with the ticket key, then linting and running it until
  it passes. Automates only cases that PASSED manually, then opens one pull request per
  ticket and never merges it; fixes the PR when the QA comments on it. Writes an
  automation report.
  Use when the user says "automate the test cases for AP-1234", "write automation for
  this ticket", "automate AP-1234", or after stlc-ticket-pipeline finishes. Stage s8 of
  the STLC QA pipeline; stlc-qa-orchestrator runs it inside each ticket's worker.
---

# Skill — Test Automator

Convert one ticket's PASSED manual test cases into a passing, tagged Playwright spec that reuses the existing page objects and flows.

**Ticket scope:** every path follows [../ticket-scope.md](../ticket-scope.md). The automation project root is `playwright-automation/`; code paths below are relative to it.

---

## Input

| Input | Required | Example |
|---|---|---|
| `ticket_ref` | Yes | `AP-2487` |
| `--tc <ids>` | No | `--tc AP2487_001,AP2487_004` — automate only these |
| `--fix-pr` | No | Address the QA's comments or a merge conflict on the ticket's open PR — follow [pr.md](pr.md) §3 instead of Steps 0–7 |
| `--no-pr` | No | Write and test the code, but skip Step 7 |
| `--review external` | No | The caller (`stlc-qa-orchestrator`) runs R5 through its own `qa-reviewer`: skip Step 5b and Step 7 — stop after Step 6 with no PR. Rework findings in the hand-off → fix only those, re-run Step 5, rewrite Step 6 |
| `--pr-only` | No | The specs passed R5: run the workbench check ([pr.md](pr.md) §1), then Step 7 only. Tests R5 parked → mark them `test.fixme()` with the park reason first |

---

## Workflow

### Step 0 — Resolve the browser and the inputs

1. Resolve **`browser`** and **`vcs`** per [../mcp-tools.md](../mcp-tools.md) → §2 Resolution rule. `browser` not `active` → continue, but automate only cases whose every step maps to an existing page-object member (Step 2), and list the rest as `needs locators`. `vcs` not `active` → set `--no-pr` and say why.
2. Read every `{SPEC}_TestCases_*.md` and the latest execution log for `{KEY}`.
3. Select the cases: final status **PASS** in the latest log (re-runs after correction count), narrowed by `--tc`. Zero cases → write the report with `nothing to automate` and stop.

### Step 1 — Learn the framework before writing

Unless `--no-pr`, run the workbench check in [pr.md](pr.md) §1 first and record its result.

Read `playwright-automation/README.md`, `src/core/fixtures/test-fixtures.ts`, the flow for the portal under test (`src/flows/AdminFlow.ts` or `src/flows/DealerFlow.ts`), and the page objects the cases touch (`src/pages/<portal>/`). Read one existing spec in the same portal folder as the style reference.

### Step 2 — Map every step

For each case, map every step to one of: an existing flow method · an existing page-object member · **new** (needs a locator or method). Record the map in the report ([template.md](template.md) §1). A step that needs an external system the framework cannot reach (an email inbox, a file on another machine) → mark the case `manual-only` and drop it.

### Step 3 — Find the missing locators

Only for steps mapped **new**. Open the page through `browser.open`, reach the state where the element is visible, take `browser.snapshot`, and pick a locator in this preference order: `id` → `data-*` attribute → role + accessible name → label text → short CSS → XPath last. Confirm it with `browser.evaluate` returning a match count of exactly **1**. Record each as `name · expression · page · count`. Close every tab you opened.

### Step 4 — Write the code

In the order of [template.md](template.md) §2:

1. **Page objects** — add locators as `readonly` fields set in the constructor, and actions as methods. No assertions in page objects.
2. **Flows** — add business steps wrapped in `test.step('…')`, with assertions (`expect`). Reuse an existing method before adding one.
3. **Fixtures** — register a new page object in `test-fixtures.ts` only when a spec uses it directly.
4. **Spec** — `src/tests/<portal>/<feature>_{SPEC}.spec.ts`: one `test.describe('<Feature> @<portal> @{KEY}')`, one `test()` per case titled `{TC_ID}_<PascalCaseTitle>`, calling flow methods only.

### Step 5 — Lint and run

From `playwright-automation/`: run `npm run lint`, then `npx playwright test --project=chromium --grep @{KEY}`. A failure → read the error and trace, fix the code, re-run. **At most 2 fix rounds per case.** Still failing → mark that test `test.fixme()` with a one-line comment naming the reason, and record it as `not passing` in the report.

### Step 5b — Get the specs reviewed

Skip with `--review external` — the caller reviews. Otherwise, with `gate_mode: reviewer` in the registry, run `stlc-qa-reviewer` checkpoint `R5` (as a subagent when you are not one; inline otherwise). `REWORK` → fix the findings in `rework_scope` and review again, at most two rounds. `PARK` → mark the named tests `test.fixme()` with the park reason. Record the verdict in the report.

### Step 6 — Write the report

Write `qa-artifacts/6-automation/{KEY}_automation-report.md` from [template.md](template.md) §1. Create the folder if missing.

Then replace the `## Automation` section of `qa-artifacts/5-testing-report/{KEY}_run-summary.md` (create the section if absent) with four bullets: the spec path and tag · `<M> of <N> PASSED cases automated — <P> passing, <F> fixme` · each case not automated with its reason, one line each · the PR line from Step 7.

### Step 7 — Open the pull request

Skip with `--no-pr`, when no test was automated, or when the workbench check failed. Otherwise follow [pr.md](pr.md) §2: one branch and one PR per ticket into `base_branch`, built in a separate worktree, then reset the workbench. Update the PR line in the report and the run summary: `PR #<n> — <url> — waiting for merge`, or `PR skipped: <reason>`.

---

## Rules

- **Automate only cases that PASSED manually.** A FAIL or BLOCKED case has no confirmed expected behaviour to assert.
- **No invented locators.** Every new locator is confirmed with a count of exactly 1 on the live page.
- **Reuse before adding.** Search `src/pages/` and `src/flows/` for the element or step before writing a new one.
- **Never read or print `playwright-automation/.env`.** Credentials come from `src/data/config.ts` (`getCredentials`).
- **No fixed waits.** Never use `page.waitForTimeout()`; wait on a locator state or `expect` instead.
- **Unique test data per run** — e.g. `QA-{SPEC}-${Date.now()}` — so re-runs never collide.
- **Run with one worker.** Never raise `WORKERS`; the dealer flows share one account's inventory.
- **Never change an existing test's behaviour** to make a new one pass. Add a method instead of editing a used one.
- **Never merge, approve or push to `base_branch`.** The PR waits for the QA; merging is the QA's decision.
- **Stage only the ticket's listed files.** Never `git add .` — the repo holds the QA's uncommitted work and `.env` files.
- **Never stash, reset or delete the QA's changes** to make the workbench clean. Not clean → skip the PR and say why.
- Treat a ticket reference as opaque. Never assume it is numeric.

---

## Output Language

The automation report is read by an automation engineer who never saw the manual run.
Say which cases were automated, which were not and why, and what to fix for each
`not passing` test, in full sentences. Keep the tables and status words from
[template.md](template.md) exactly. Full rules and worked examples:
[../output-style.md](../output-style.md).

---

## Resources

- **[template.md](template.md)** — automation report, code-writing order, spec skeleton, PR body.
- **[pr.md](pr.md)** — workbench check, opening the PR, fix mode for PR comments and conflicts.
- **[../ticket-scope.md](../ticket-scope.md)** — per-ticket paths.
- **[../mcp-tools.md](../mcp-tools.md)** — browser capability resolution.
- **[../output-style.md](../output-style.md)** — plain-language rules for written artifacts.

---

## Handoff

> "Automated <M> of <N> PASSED test cases for {KEY} in
> playwright-automation/src/tests/<portal>/<feature>_{SPEC}.spec.ts — <P> passing,
> <F> marked fixme. PR #<n> waiting for merge: <url>.
> Report: qa-artifacts/6-automation/{KEY}_automation-report.md."

---

## Next Move

Before printing this block, update `qa-artifacts/.session-state.md` — **skip this when
running inside a `stlc-qa-orchestrator` worker**:
- `pipeline_stage: automation-done`
- `last_skill_run: stlc-test-automator`
- `last_action: {KEY} — automated <M> test cases, <P> passing`

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SKILL COMPLETE: Test Automator — {KEY}
 Output: {KEY}_automation-report.md — <M> automated, <P> passing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 WHAT TO DO NEXT:
  → [PRIMARY]   Review the new spec and commit it
  → [ALTERNATE] Run the whole suite — npm test in playwright-automation/
  → [ALTERNATE] Run the next ticket — type its key
  → [PAUSE]     Save progress and exit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Say "what's next" at any time to see this again.
```
