---
name: stlc-testcase-reviewer
description: >-
  Peer-review an existing test-case file against its requirements-analysis and
  test-plan for coverage gaps, then generate additional missing test cases
  using formal manual test-design techniques (equivalence partitioning,
  boundary value analysis, decision tables, state transition, error guessing,
  negative/security testing). Use when the user says "review test cases",
  "peer-review test cases", "find missing test cases", "check test case
  coverage", or "review test coverage". Part of the 7-skill STLC QA pipeline —
  runs after stlc-testcase-designer, before stlc-manual-executor.
---

# Skill 3b — Test Case Reviewer

Peer-review test cases for coverage gaps against upstream docs, then propose missing cases a senior manual tester would insist on adding.

> **Ticket scope.** When a ticket key is in scope, read and write the per-ticket paths in [../ticket-scope.md](../ticket-scope.md) — they override every default path in this file. When `stlc-ticket-pipeline` invokes this skill, it passes the key, the inputs and any answer this skill would otherwise ask for; use them and do not ask again.

---

## Workflow

Runs two independent passes per ticket/spec ID. Always run both — Pass 2 is valuable even when Pass 1 finds no real ACs to check against.

### Step 1 — Read inputs

1. `qa-artifacts/1-requirements-analysis/{sprint}/requirements-analysis_{ID}_{date}.md` (or unscoped path if no sprint folder)
2. `qa-artifacts/2-test-plan/{sprint}/test-plan_{ID}_{date}.md`
3. `qa-artifacts/3-test-cases/{sprint}/{ID}_TestCases_*.md` — all batches for this spec ID
4. The knowledge sources this skill's load set names — resolve them per
   [../knowledge-sources.md](../knowledge-sources.md) → §2 against
   [../../../qa-artifacts/qa-config/knowledge.md](../../../qa-artifacts/qa-config/knowledge.md).
   **Always:** `domain` (the business rules the test cases must not contradict) and
   `navigation` (the real screens and routes). **When relevant:** `test-data`.
   Never open a knowledge file by a path written in this skill.
5. The `## Execution Context` section of the test-case file, if present — a batch whose
   Known blockers table is missing or empty while `domain` or `navigation` is `missing`
   or `unbound` is itself a review finding: the cases were designed against facts nobody
   has verified.

If the test-cases file doesn't exist yet, stop and say: _"Run stlc-testcase-designer first."_

### Step 2 — Pass 1: doc-consistency check

Compare the three docs line by line:
- Every requirement / AC / business rule / edge case named in requirements-analysis or test-plan must trace to at least one TC. List every one that doesn't.
- Check the reverse: any TC citing an AC/requirement number that doesn't exist upstream is an orphan reference — flag it.
- List every unresolved Open Question from requirements-analysis. If the ticket's real AC text could not be retrieved (a recurring situation on this project — see the ticket's own Open Questions), state explicitly that the TC set is placeholder/smoke-check scope, not full coverage — do not let this pass silently.

For each finding: cite the exact AC/requirement/OQ, priority (High/Medium/Low), and one line on what real defect would ship undetected. In the **Cites** column write the requirement ID and AC number (`REQ-002 AC 1`) whenever the gap is an acceptance criterion with no test case. The pipeline's Gate B rule B1 promotes exactly those rows, so a gap that cites only the test plan must not carry a REQ ID.

Also flag any expected result that asserts something the capture does not say and that no `Answered` question settles: a guessed answer slipped into a test case. List it as a Pass 1 gap citing the REQ, priority High, so Gate B rule B1 sends it back to the designer.

### Step 3 — Pass 2: technique-driven missing-case generation

Apply to the feature itself, independent of whether real ACs exist. Use the domain knowledge from Step 1's files, not guesses:

| Technique | What to look for |
|---|---|
| Equivalence partitioning | Input/state classes not yet covered (tiers, roles, record statuses, booking types) |
| Boundary value analysis | Exact-limit conditions (capacity==booked, char-length limits, date/year rollovers, DST transitions) |
| State transition | Before/after state on state-changing actions (cancel, edit, delete, toggle) — do dependent counters/flags update correctly |
| Decision tables | Two or more independent conditions that interact (e.g. holiday override vs default hours) |
| Error guessing / negative / security | Race conditions (double-click, concurrent edits, two users competing for one resource), 3rd-party API failure modes, injection, PII leakage, enumeration |
| Cross-entity / integration | Does this feature's output correctly feed the next feature downstream in the same workflow chain |

For each proposed case: short title, technique used, one-line justification of the concrete defect it would catch, priority. Do not repeat anything already in the TC file. Cap at 8–10 highest-value cases per spec ID — if more surface, keep only the top 10 by priority and note how many were dropped.

If Pass 1 found the ticket has no real AC, caveat every Pass 2 case as risk-based/pending-AC-confirmation — these are candidates for the backlog, not ready-to-execute TCs.

### Step 4 — When reviewing multiple related tickets together

Add a **Patterns Across Several Tickets** section: risks or missing coverage that recur across 3+ tickets (e.g. no ticket in the batch tests concurrency; a multi-ticket workflow chain has no single end-to-end scenario walking all of it). Do not repeat per-ticket findings here — only patterns visible at the batch level.

### Step 5 — Write output

Single ticket: `qa-artifacts/3-test-cases/{ID}_ReviewFindings_{date}.md`
Whole sprint/batch: `qa-artifacts/3-test-cases/{sprint}/MissingTestCases_TechniqueReview_{date}.md`

Use [template.md](template.md) for structure.

---

## Output Language

This file names more test-design techniques than any other artifact, so glossing
matters most here. Keep the table structure from [template.md](template.md)
exactly — change only the wording inside them.

- Name the technique, then explain it in the same breath on first use, e.g.
  "boundary value analysis (testing the exact edges of an allowed range, where
  off-by-one mistakes hide)". Do not drop the term and do not re-gloss it.
- Every proposed case states the concrete defect it would catch, in terms of
  what a real user or the business loses.
- Every priority states its reason.
- Say plainly when coverage is thin — "these tests only confirm the screen
  loads; they do not prove the feature works" beats "partial coverage".

Full rules and worked examples: [../output-style.md](../output-style.md).

---

## Rules

- Never treat a "does it exist" smoke check as full coverage — if Pass 1 shows the TC file is placeholder-scope, say so before listing anything else.
- Every missing-case proposal must name the technique used — a proposal with no technique attached is error-guessing dressed up as rigor; still allowed, but must be labeled "Error guessing," never left blank.
- Do not invent acceptance criteria and present them as confirmed — Pass 2 output is always framed as "what a senior tester would test," not as verified requirements.
- Do not silently cap findings — if you drop items past the top 10, state how many and why.
- Do not add these proposed cases directly into the `{ID}_TestCases_*.md` file — that file is owned by `stlc-testcase-designer`. This skill only produces the review/findings file; promoting an item into real TCs is a separate, explicit step.

---

## Resources

- **[template.md](template.md)** — output file structure for both single-ticket and sprint-batch review findings.
- Plain-language rules for every artifact this skill writes: [../output-style.md](../output-style.md)

---

## Handoff

> "Review complete for [ID / Sprint]. Pass 1: [N] doc gaps found. Pass 2: [M] technique-driven missing cases proposed.
> File: [path].
> Next step → promote confirmed cases via **stlc-testcase-designer**, or proceed to **stlc-manual-executor** if current scope is accepted."

---

## Next Move

Before printing this block, update `qa-artifacts/.session-state.md`:
- `pipeline_stage: test-cases-reviewed`
- `last_skill_run: stlc-testcase-reviewer`
- `last_action: Reviewed [ID/Sprint] — [N] doc gaps, [M] technique-driven cases proposed`
- `artifacts.review_findings: <path to file>`

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SKILL COMPLETE: Test Case Reviewer
 Output: [N] doc gaps, [M] missing cases proposed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 WHAT TO DO NEXT:
  → [PRIMARY]   Promote confirmed cases — say "design test cases" for the added scope
  → [ALTERNATE] Escalate unresolved Open Questions — say "update ticket"
  → [ALTERNATE] Proceed to execution as-is — say "execute test cases"
  → [PAUSE]     Save progress and exit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Say "what's next" at any time to see this again.
```
