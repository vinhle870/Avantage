# Ticket Pipeline — Templates

---

## 1. Run-state file — `qa-artifacts/.pipeline/{KEY}.md`

One file per ticket. Rewrite the whole file after every stage change.

```markdown
# Pipeline Run — {{KEY}}
ticket: {{KEY}} — {{subject}}
spec_id: {{SPEC}}
run_folder: {{RUN}} ({{sprint | fix version | default_run_folder | user}})
gate_mode: {{rules|ask}}
until: {{stage or "s7"}}
started: {{ISO-8601}}
updated: {{ISO-8601}}
run_status: {{in_progress|stopped_at_gate|failed|complete}}

| Stage | Status | Artifact | Finished | Note |
|---|---|---|---|---|
| intake | {{pending|running|done|skipped|failed}} | requirements/{{KEY}}-{{SLUG}}.md | {{time or —}} | {{one line or —}} |
| s1 | … | qa-artifacts/1-requirements-analysis/{{KEY}}_requirements-analysis.md | … | … |
| s2 | … | qa-artifacts/2-test-plan/{{KEY}}_test-plan.md | … | … |
| s3 | … | qa-artifacts/3-test-cases/{{SPEC}}_TestCases_*.md | … | … |
| s3b | … | qa-artifacts/3-test-cases/{{SPEC}}_ReviewFindings_{{DATE}}.md | … | … |
| s4 | … | qa-artifacts/4-execution-results/{{RUN}}/execution-log_{{KEY}}_{{DATE}}.md | … | … |
| s4c | … | corrected {{SPEC}}_TestCases_*.md + re-run in the execution log | … | … |
| s5 | … | qa-artifacts/5-testing-report/{{KEY}}_bug-report.md | … | … |
| s6 | … | qa-artifacts/5-testing-report/{{KEY}}_test-report.md | … | … |
| s7 | … | comment on {{KEY}} | … | … |

## Gate log
- {{ISO-8601}} — Gate {{A|B|C|D}}: {{action}} — rule {{A1|A2|A3|B1|B2|B3|C1|C2|C3|C4|D}} — by {{rules | user}} — evidence: {{counts, quoted sentence with source, or ticket refs}}

## Warnings
- {{e.g. Q-002 (Blocking, REQ-003) still open — AP2473_004–005 BLOCKED; story cannot move until answered}}
```

---

## 2. Requirement capture — `requirements/{KEY}-{SLUG}.md`

```markdown
# {{KEY}} — {{subject}}

**Spec ID:** {{KEY}}
**Source:** {{tracker type}} [{{KEY}}]({{ticket URL}}) — Project *{{project}}*, type {{type}}, priority {{priority}}, status **{{status}}**
**Reporter:** {{author}} · **Assignee:** {{assignee or Unassigned}}
**Created:** {{date}} · **Last updated:** {{date}}
**Captured on:** {{DATE}} by stlc-ticket-pipeline from the description, acceptance criteria, {{N}} comments and {{M}} attachments.
**Parent:** {{parent ref — subject, or None}}

> Faithful transcription of {{KEY}} for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

{{verbatim if present; otherwise "Not stated in the ticket." — never invent one}}

## Original requirement text

> {{description, verbatim}}

## Acceptance criteria (verbatim)

{{verbatim; or "None in the ticket — flagged for Gate A."}}

## Attachments

| File | Read? |
|---|---|
| {{name}} | {{No — listed only}} |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| {{date}} | {{author}} | {{summary}} |
```

### 2.1 Appended section when the ticket changed after capture

```markdown
---

## Ticket changes since capture — {{DATE}}

**Ticket last updated:** {{updated time}} · **Previous capture:** {{Captured on value}}

{{Changed description or acceptance criteria, verbatim; new comments as rows of the
Comments table above. State plainly which earlier statement each change replaces.}}
```

---

## 3. Run summary block

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — {{KEY}}: {{subject}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : {{N}} REQ · {{X}} High risks
 Test cases   : {{T}} designed · {{P}} proposed by review
 Execution    : {{pass}} PASS · {{fail}} FAIL · {{blocked}} BLOCKED
 Bugs         : {{new}} filed · {{linked}} linked to existing · {{dismissed}} not a bug
 Corrected    : {{C}} test cases rewritten · {{R}} retired · re-run {{pass}}/{{C}} PASS
 Verdict      : {{PASS|CONDITIONAL PASS|FAIL}}
 Tickets      : {{KEY}} {{→ STATUS | unchanged}} · {{n}} bugs updated ({{closed}} → BUG_PASS_STATUS, {{reopened}} → BUG_FAIL_STATUS)
 Stopped at   : {{stage}} ({{reason, or "complete"}})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 4. Ticket comments (s7)

Written in Jira wiki markup, the format the AP tracker renders (headings `h3.`, bold
`*…*`, bullets `* `). For another tracker, the adapter's format section says how to
convert.

**Keep it short — a developer or PO reads it in 30 seconds.** Aim for about 10 lines;
never over 20. List only what someone must act on. Passed cases are one line of IDs, not
a table; the full per-case table, every question and every observation stay in the test
report on disk. One line per item, no "today the build does…" explanations, no file
paths, no record lists unless someone must clean them up.

### 4.1 Story result comment

```
h3. QA result — {{verdict}} · {{environment name}} · {{DATE}}

*{{pass}}/{{counted}} passed ({{rate}}%, needs {{story_pass_threshold}}%)* · {{fail}} failed · {{blocked}} blocked

*Failed / blocked:*
* {{TC ID}} — {{what went wrong, ≤ 12 words}} — {{bug ref | Q-00N}}
*Passed:* {{TC IDs as ranges, e.g. 001, 003–005, 007–011 | none}}

*Bugs:* {{"REF (Priority) — title" per line, or "None"}}
*Questions:* {{[~accountid:…]}} {{only Blocking questions and Judgement questions whose answer changes a result — "Q-00N — question" one line each, at most 3; or "None"}}

*Next:* {{Moved to STORY_PASS_STATUS. | Stays in <status> — re-test after <bug refs fixed / Q-00N answered / change deployed>.}}
```

A Judgement question that only records behaviour is not listed — it stays in the
requirements analysis and test report.

### 4.2 Bug re-test comment

```
h3. Re-test {{PASSED | FAILED}} — {{DATE}}

*Environment:* {{environment name}} · *Build/run:* {{RUN}}

||TC ID||What was checked||Status||
|{{TC ID}}|{{steps to reproduce, in one line}}|{{PASS / FAIL / BLOCKED}}|

{{PASSED: "The reported behaviour no longer occurs: <what happens now>." → moved to BUG_PASS_STATUS.
  FAILED: "Still failing at step N: <expected> — actual: <actual>." → moved to BUG_FAIL_STATUS and assigned to DEVELOPER.}}

Evidence: {{screenshot names or execution-log path}}
```

---

## 5. Closing report — the chat message after the summary block

Print this directly under the §3 block, every run. Keep **all six headings, in this
order**, even when a section is empty: write `None.` rather than dropping it. Never add
other headings. Each bullet is one or two plain sentences.

```markdown
**Result:** {{KEY}} {{verdict}} — {{pass}} of {{total}} test cases passed on {{environment name}}{{, meeting / missing}} the {{pass-rate threshold}}% threshold. {{N}} bugs filed. {{Ticket comment posted and verified | not posted, because …}}.

**What passed**
- {{feature area}}: {{what was proven, in user terms}}

**Failures**
- {{TC ID}} — {{actual result in one sentence}}. Gate C: {{filed as REF | linked to REF | not a bug: reason → test case corrected, re-run RESULT}}.

**Decisions made**
- Gate A (rule {{A1|A2|A3}}{{, confirmed by you}}): {{action}} — {{evidence: Blocking/Judgement/Info counts; questions posted or not}}
- Gate B (rule {{B1|B2|B3}}{{, confirmed by you}}): {{action}} — {{evidence: uncovered ACs, High proposals}}
- Gate C (rules {{C1–C4 per FAIL}}{{; you at C3}}): {{one line per FAIL with its rule and quote, or "not reached — no failures"}}
- Gate D (rules, {{automatic | confirmed by you}}): {{one line per ticket — "AP-2473 → Ready for release, assigned to Ken Nguyen" · "AP-2491 → In Progress, assigned to Minh Lưu" · "AP-2473 not moved: pass rate 85%"}}
- {{any other choice: run folder, status check, skipped stage}}

**Left behind**
- Test data on {{environment}}: {{records and IDs, or "None"}}
- Observations that are not failures: {{one per bullet, or "None"}}
- Knowledge files added or changed: {{paths, or "None"}}

**Files**
- [{{KEY}}_test-report.md](qa-artifacts/5-testing-report/{{KEY}}_test-report.md)
- [{{KEY}}_bug-report.md](qa-artifacts/5-testing-report/{{KEY}}_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/{{RUN}}/execution-log_{{KEY}}_{{DATE}}.md)
- [run state](qa-artifacts/.pipeline/{{KEY}}.md)
```

When the run stops early (a stop point E1–E5, a failed stage, `--until`), replace
**Result** with `**Stopped:** at {{stage}} — {{reason}}. Resume with "{{KEY}}".` and keep
the other headings, filling only what the run reached.

---

## 6. Run summary file — `qa-artifacts/5-testing-report/{KEY}_run-summary.md`

The §3 block and the §5 closing report, saved to disk. Rewrite the whole file at the end
of every run; keep an existing `## Automation` section only if this run did not reach s4
(the automation still describes the latest execution).

```markdown
# Run Summary — {{KEY}}: {{subject}}
Updated: {{ISO-8601}} · Run folder: {{RUN}} · Stages run: {{first}} → {{last}} · Run status: {{complete | stopped_at_gate | failed}}

{{the §3 summary block, inside a fenced block}}

{{the §5 closing report, all six headings}}

## Automation
{{Written by stlc-test-automator. Until it runs: "Not run yet."}}
```
