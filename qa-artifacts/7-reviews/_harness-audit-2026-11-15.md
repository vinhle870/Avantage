# Harness defect audit — 2026-11-15 (proposals, NOT applied)

Source: scaffold-skill Defect mode, run during QA batch 2026-11-15 on the `harness_defect`
lines in `qa-artifacts/.pipeline/_batch-2026-11-15.md`. Nothing below has been applied.
Each needs the QA's agreement (QA_AGENTS.md → Skill Defect Rule).

Already applied today (part of the user-requested knowledge-lookup change): analyst Steps
3b–3c and Rules, designer Step 1c, executor step 2c, ticket-pipeline Gate A wording,
qa-reviewer checklists 1.5/1.6/2.5/E4, agents/qa-reviewer.md, providers/jira.md
(knowledge-lookup query; `--plain` hides customfield_10150), knowledge-sources.md.

## Decisions needed from the QA

| # | Question |
|---|---|
| D1 | Should a comment by **Ken Nguyen** (listed in `not_developers`) count as an answer to a QA question? Today it does not (analyst Step 3b), though questions are routed to him. Proposal: only the QA account's own comments are excluded. Also for Gate C1 / R1 / `correction.md`? |
| D2 | Does Jira status **Deploy to staging** count as "delivered" (canonical `dev_done`) for a later Story superseding an older AC? The batch used that rule ad hoc (AP-2503, AP-2225). |

## Proposals

1. **Evidence overwritten on re-runs** (`stlc-manual-executor` Step 2d, `ticket-scope.md` §2/§4, `providers/playwright.md:87`, `agents/stlc-worker.md:50-51`, `ARCHITECTURE.md:298`, executor `template.md`). Screenshot/values names have no run part; four tracked files were overwritten today (all restored from git). Fix: add token `{STAMP}` (run start, `YYYYMMDD-HHmm`) to the name `{TC_ID}-{STAMP}-step{N}-Summary_[pass|fail|blocked].png`; one rule in ticket-scope §4 — a same-day second run appends `# Run N` to the log, never overwrites; R3 item 3.4 also checks that no earlier evidence is modified.
2. **ReviewFindings overwritten on a same-day re-review** (`stlc-testcase-reviewer/SKILL.md:78`, `ticket-scope.md:48`, pipeline routing.md:80/252, checklists.md:39). Fix: append a `# Re-review` section (same ticket-scope §4 rule); Gate B reads the latest section.
3. **Parallel agents share one scratchpad** (no rule anywhere). Fix: ticket-scope §3 row "Scratch files → {SCRATCH}/{KEY}/", referenced from the three agent definitions; then drop the per-brief mitigation used today.
4. **`not_developers` used as an answer filter** (analyst SKILL.md:64-66; pipeline routing.md:57/61/278; designer correction.md:18; checklists.md:70 wording reversed). Depends on D1. Records to re-check at their next s1: AP-2441 Q-006, AP-2374 (Ken 2025-12-18), AP-1381 Q-002.
5. **No rule for an AC superseded by a later delivered Story** (analyst, Gate C1, executor, checklists; jira adapter has no `dev_done` mapping). Fix: analyst rule "A later Story supersedes" (created later, delivered, same element, recorded as `Superseded point`), C1 extension, checklist 1.7. Depends on D2.
6. **Test-reporter verdict bands** (`stlc-test-reporter/SKILL.md:40,46-52`). The plan's single threshold T should replace 90% in the PASS row; CONDITIONAL = 80% ≤ rate < T; and the pass-rate formula should be PASS ÷ (Total − Skipped), the Gate D formula.
7. **s7 comment draft not on disk at R4** (qa-agent routing, pipeline routing.md:84/300, ticket-scope §3, checklists.md:78). Fix: s6 writes the outcome draft `comment_{KEY}_{DATE}.md`; s7 posts it unchanged; R4 item 4.8 checks R4 did not write it. Record: AP-2503 comment 19584 was written by R4 (not independently reviewed) — re-review is the QA's call.
8. **A Story defines only part of a question, or two Stories disagree** (analyst Step 3c). Fix: split the question (`Split from Q-00N`); disagreeing Stories → the later wins only if it supersedes (#5), else Open with both quoted.

## Size note
`stlc-requirements-analyst/SKILL.md` body is now 166 lines (> 150 GOLDEN limit) after today's
lookup edits — propose moving Steps 3b–3c to `stlc-requirements-analyst/questions.md`.
`stlc-manual-executor/SKILL.md` (380 lines) predates today.

9. **A FAIL that matches a Done bug linked to the ticket** (pipeline routing.md §3 Gate C searches open bugs only; §3.2 re-tests only QA-status bugs). Seen on AP-2374 (AP2374_005 vs AP-2392 Done); R3 decided C4 file new + "relates to" the Done bug, never reopen. Proposal: make that the written rule, or let the QA choose reopen vs new.
10. **Stage skills' Next Move write .session-state.md** (stlc-ticket-pipeline, stlc-bug-reporter, stlc-test-reporter) while agents/stlc-worker.md forbids it. Proposal: skip that step when run as a subagent.
11. **Reviewer timestamps not from the real clock** (stlc-qa-reviewer record headings stamped later than `date -u`; AP-2501 R4, AP-2496 R1). Proposal: the record heading time must come from `date -u`.
