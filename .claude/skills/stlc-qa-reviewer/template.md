# QA Reviewer — Templates

---

## 1. Review record — `qa-artifacts/7-reviews/{KEY}_review.md`

One file per ticket. Append one section per review; never rewrite an earlier one.

```markdown
## {{CHECKPOINT}} — {{checkpoint name}} — round {{n}} — {{ISO-8601}}
Reviewed: {{every file read, comma-separated}}
Verdict: **{{APPROVE | REWORK | PARK}}** · Gate {{A–D | —}}: {{action}} — rule {{ID}}
Findings: {{B}} blocker · {{M}} major · {{m}} minor

{{Two or three sentences: what was reviewed, whether it can be trusted, and what must
change before it can.}}

| # | Severity | Where | What is wrong | Required fix |
|---|---|---|---|---|
| F-1 | {{Blocker|Major|Minor}} | {{file — TC ID step n | file:line}} | {{one sentence}} | {{one sentence}} |

{{R3 only}} Screenshots inspected: {{list of paths, each with "matches" or "does not match"}}
{{R5 only}} Run: `{{command}}` — {{P}} passed, {{F}} failed, {{X}} fixme, {{flaky list or "no flaky tests"}}
{{R5 only}} Traceability:
| TC ID | Step | Expected result | Assertion |
|---|---|---|---|
| {{TC_ID}} | {{n}} | {{expected}} | {{Flow.method() — expect(...) | MISSING}} |

{{PARK only}} Parked because: {{the fact that is missing, and who must give it}}
```

---

## 2. Verdict block — the last thing in the reply

```
=== REVIEW VERDICT ===
ticket: <KEY>
checkpoint: <R1–R5>
round: <n>
verdict: APPROVE | REWORK | PARK
gate: <Gate X: action — rule ID | —>
rework_stage: <s1 | s3 | s4 | s5 | s6 | s8 | —>
rework_scope: <TC IDs or files to redo | —>
findings: <B>/<M>/<m>
park_reason: <one sentence | —>
record: qa-artifacts/7-reviews/<KEY>_review.md
=== END ===
```

The caller passes `rework_scope` and every Blocker/Major finding, word for word, into
the re-run's hand-off.
