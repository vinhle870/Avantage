# Run Summary — AP-2501: Permaplate invoice - include name of the term in the description
Updated: 2026-11-02T00:58:00Z · Run folder: no-sprint · Stages run: s5 → s7 · Run status: complete · Environment: Dev (v2dev)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2501: Permaplate invoice - include name of the term in the description
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 4 REQ · 1 High risk (REQ-004, Q-001 Blocking open)
 Test cases   : 6 designed · 5 proposed by review (none promoted)
 Execution    : 1 PASS · 1 FAIL · 4 BLOCKED
 Bugs         : 1 filed (AP-2529) · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · s4c skipped (no C1 decision)
 Verdict      : FAIL
 Tickets      : AP-2501 unchanged (QC) · 0 bugs updated
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2501 FAIL. 1 of 6 test cases passed on Dev (v2dev), well below the 90% threshold. Staging was not checked. 1 bug filed (AP-2529, High). The ticket comment (19455) was posted and verified, and AP-2501 stays in QC.

**What passed**
- Invoice details page (AP2501_001): a new Permaplate invoice (941) names the term sold. The description reads client · vehicle · VIN · contract number "PNA-0000000020" · **"10 ans"** · dealer, with the real contract number and no retail price. The Dealer and Admin invoice lists show the same lines in full for that invoice. They were not counted as passes, because no second-term invoice could be compared.

**Failures**
- AP2501_003: the invoice PDF cannot be opened. The Admin "PDF" button (`GET /admin/invoice/941/pdf → 500 text/html`) shows the French "Erreur" page for every invoice tried, warranty invoices included, so nobody could check whether the PDF names the term. Gate C: filed as AP-2529 (rule C4).

**Decisions made**
- Gate A (rule A2, earlier run): Q-001 was posted as comment 19437 on 2026-11-01. It is still unanswered, so AP2501_006 stays BLOCKED.
- Gate B (rule B3, earlier run, after the R2 rework): the cases were run as designed. Nothing was promoted.
- Gate C (rule C4, by the independent R3 reviewer, APPROVE): AP2501_003 was filed as new bug **AP-2529**, "[BUG-001][AP2501_003] — Admin invoice PDF button (/admin/invoice/{id}/pdf) returns an HTTP 500 error page on Dev for every invoice". It is High, assigned to Ken Nguyen and linked as *relates to* AP-2501 and AP-2512, and the screenshot is embedded and verified. No open bug names this route. AP-2512 (contract download) and AP-2519 (all-documents download) are different screens. A second search at s5 found no new candidate.
- Gate D (rules, automatic; R4 inline APPROVE): AP-2501 was not moved to Ready for release. The pass rate is 17% (needs 90%), AP-2529 is a stopping bug (High, and it blocks AP2501_003 steps 3–4 and the PDF part of AP2501_006), and Q-001 (Blocking) is unanswered. The comment reminds the author of Q-001 and raises the new question Q-007, which is now recorded in the analysis as Judgement against REQ-002. AP-2529 is in Backlog, so it got no Gate D action.
- Environment: Dev (v2dev) only, by the user's decision. Staging was not checked, and the test-case files still name v2staging (R3 F-2).

**Left behind**
- Test data on Dev: quote 6555 (client Terme Invoice1102) with Permaplate contract PNA-0000000020 and unpaid invoice 941 ($91.98), plus quote 6556 (client Terme Second1102) with no product. These cannot be deleted.
- AP2501_002, 004 and 005 stay BLOCKED because dealer 1380 has only one Permaplate term ("10 ans") linked on Dev. To unblock them, the QA decides whether to link a second enabled term (for example "5 ans") under Admin → dealer → Esthetic protection, then re-runs with "AP-2501 --from s4". AP2501_006 stays BLOCKED on Q-001.
- Observations that are not failures: the Dealer invoice page has no invoice PDF, only Print (`window.print()`), which is asked as Q-007. The contract download returns HTTP 500 (known AP-2512). The Permaplate cost is missing from the quote Subtotal (known AP-2516).
- Knowledge files added or changed: none in this run. `qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md` gained the Q-007 row.

**Files**
- [AP-2501_test-report.md](qa-artifacts/5-testing-report/AP-2501_test-report.md)
- [AP-2501_bug-report.md](qa-artifacts/5-testing-report/AP-2501_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md)
- [run state](qa-artifacts/.pipeline/AP-2501.md)

## Automation
- Spec: `playwright-automation/src/tests/dealer/permaplateInvoiceTerm_AP2501.spec.ts`, tag `@AP-2501`. It is read-only, checks invoice 941 and quote 6555, and runs on Dev (v2dev) only.
- 1 of 1 PASSED cases automated — 1 passing, 0 fixme. Lint is clean, `--repeat-each=2` passed, and the inline R5 review approved it.
- Not automated: AP2501_003 FAILED manually (AP-2529), and AP2501_002, 004, 005 and 006 were BLOCKED manually, so none of them has a confirmed expected behaviour.
- PR skipped: gh CLI not installed.
