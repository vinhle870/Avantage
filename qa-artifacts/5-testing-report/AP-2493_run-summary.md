# Run Summary — AP-2493: Cancelling a product from a quote
Updated: 2026-11-15T09:56:00Z · Run folder: no-sprint · Stages run: analyze → analyze · Run status: complete (re-analysis only; execution results below are from the 2026-11-01/02 run)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2493: Cancelling a product from a quote
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 3 REQ · 2 High risks
 Test cases   : 14 designed · 8 proposed by review
 Execution    : 12 PASS · 2 FAIL · 0 BLOCKED (2026-11-02 run, not re-run)
 Bugs         : 1 filed · 0 linked to existing · 0 not a bug (2026-11-01 run)
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS
 Verdict      : FAIL (unchanged from the 2026-11-01 run)
 Tickets      : AP-2493 unchanged (QC) · 0 bugs updated
 Stopped at   : analyze (--until analyze)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Stopped:** at analyze — `--until analyze` (batch qa-agent 2026-11-15, analysis only, group B: no re-execution). The open questions were re-checked against Jira; the analysis waits for the independent Gate A review (R1). Resume with "AP-2493".

**What passed**
- This run executed nothing. The latest execution (Dev (v2dev), 2026-11-02) stands: 12 of 14 cases PASS (86 %) — the cancel action, its confirmation window, the deletion and the re-add all work for the five products.

**Failures**
- AP2493_011, AP2493_012 — the quote Subtotal never includes the Permaplate cost (2026-11-02 run). Gate C: filed as AP-2516 (unchanged; not touched in this run).

**Decisions made**
- Knowledge lookup (analysis Steps 3b–3c, 2026-11-15): Q-002–Q-010 searched in Jira Stories and Tasks with two to four word sets each; no Story or Task defines any of them, so all nine move from Open to **Accepted** — the behaviour seen on Dev on 2026-11-02 is the expected result. Nothing posted to Jira.
- Q-003 limit: the description says the Subtotal "reflects only active products", so the Permaplate cost missing from the Subtotal is not accepted; AP2493_011/_012 stay FAIL and AP-2516 stays open.
- Later Stories AP-2535, AP-2536, AP-2543 and AP-2537 cancel a generated contract, which AP-2493 puts out of scope; none overrides an AP-2493 acceptance criterion.
- Gate A: not decided here — the orchestrator's qa-reviewer (R1) decides it. Questions now: 0 Blocking + Open (Q-001 Answered), 9 Accepted.
- s2–s7 were not re-marked pending (orchestrator decision). The next design pass should turn record-only steps on Accepted questions into record-and-accept steps (noted in the run state).
- Environment: Dev (v2dev) for the standing results; no browser opened in this run.

**Left behind**
- Test data on Dev (v2dev): none new in this run. Earlier runs left quotes 6461–6469, Chubb contract AVP000169 (quote 6466) and automation quotes 6470–6478.
- Observations that are not failures: accepted current behaviour — "Delete" in each row's "⋯" menu (Q-002); Subtotal = row amount (Q-003, Permaplate excepted); Delete offered on an archived quote (Q-004); modal "Cancel a product - {product}" with "Yes, cancel the product" / "No" (Q-005); financing not recalculated (Q-006); creditor premium unchanged after a GAP cancel (Q-007); flash "The product has been cancelled" (Q-008); a creditor product with a contract shows no Delete (Q-009); linked records — recorded at execution (Q-010).
- Knowledge files added or changed: None. The requirement capture got an appended "Ticket changes since capture — 2026-11-15" section (QA comments and screenshots only; description and AC unchanged).

**Files**
- [AP-2493_requirements-analysis.md](qa-artifacts/1-requirements-analysis/AP-2493_requirements-analysis.md)
- [requirement capture](requirements/AP-2493-cancelling-a-product-from-a-quote.md)
- [AP-2493_test-report.md](qa-artifacts/5-testing-report/AP-2493_test-report.md)
- [AP-2493_bug-report.md](qa-artifacts/5-testing-report/AP-2493_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md)
- [run state](qa-artifacts/.pipeline/AP-2493.md)

## Automation
- Spec: `playwright-automation/src/tests/dealer/cancelQuoteProduct_AP2493.spec.ts`, tag `@AP-2493` (Dev only; skips elsewhere). Report: qa-artifacts/6-automation/AP-2493_automation-report.md.
- 12 of 12 PASSED cases automated — 12 passing, 0 fixme (lint pass; `--repeat-each=2`: 24/24, no flaky tests; reviewer R5 APPROVE, run inline).
- AP2493_011, AP2493_012 — not automated: they FAILED manually (bug AP-2516).
- PR skipped: gh CLI not installed.
- Each run creates three Dev quotes (AP2493_009, _010, _014, new yopmail clients, no contract); the runs of 2026-11-02 left quotes 6470–6478.
