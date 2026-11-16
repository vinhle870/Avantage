# QA Orchestrator — Templates

---

## 1. Batch run-state file — `qa-artifacts/.pipeline/_batch-{BATCH}.md`

One file per day's batch. Rewrite the whole file after every worker result.

```markdown
# QA Batch — {{BATCH}}
selection: {{status in select_statuses or assignee = qa_account | --mine | --status-only | --only …}}
selected: {{N}} tickets
flags: {{--design-only | --no-automation | none}}
started: {{ISO-8601}}
updated: {{ISO-8601}}
run_status: {{planning|wave1|questions|wave2|complete}}
environment_check: {{PASS|FAIL|not run}} — {{time}}

| # | Ticket | Type | Status at plan | Assignee | Run folder | Plan | Rule | Wave 1 | Wave 2 | Result | Reviews | Verdict | Bugs | Automated |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | {{KEY}} — {{subject ≤ 40 chars}} | {{story|bug|task}} | {{canonical status}} | {{name}} | {{RUN}} | {{skip|design-only|resume|bug-retest|full}} | {{P1–P8}} | {{intake→s3b | —}} | {{s4→s7+s8 | —}} | {{pending|running|DONE|STOPPED|FAILED|parked|skipped}} | {{R2 ✓ · R3 ✓ · R5 ✓ — or the round/verdict, e.g. "R3 rework 2"}} | {{PASS|FAIL|BLOCKED|—}} | {{refs | —}} | {{N TCs | —}} |

## Ticket context
One line per ticket, from routing §1.0 — the evidence behind its plan rule:
- {{KEY}} — status {{canonical}} ({{changed by <who> on <date> | unchanged since run}}) · comments since run: {{author date — gist (answer to Q-n)} | none external} · bugs: {{AP-1 → done; AP-2 → backlog} | —} · blocker: {{prerequisite — still missing | —}} → **{{rule}} {{plan}}** · next: {{one line}}

## Automation PRs
| Ticket | PR | State | This run |
|---|---|---|---|
| {{KEY}} | {{#n url}} | {{waiting|feedback|conflicting|merged|closed}} | {{opened | fixed n comments | rebased | — }} |

## Open questions
| Ticket | Stop point | Question | Asked | Answer |
|---|---|---|---|---|

## Worker log
- {{time}} — {{KEY}} — wave {{1|2}} — {{result}} — {{reason or "ok"}}
```

---

## 2. Batch report — `qa-artifacts/5-testing-report/{BATCH}_qa-batch-report.md`

```markdown
# QA Batch Report — {{BATCH}}
Generated: {{DATE}} · Selected: {{N}} (ready for QA: {{n}}, assigned to me: {{n}}) · Tested: {{N}} · Skipped: {{N}}

## Summary
{{Two to four sentences: how many tickets are ready to release, how many are not and
why, and the one thing the team must do first.}}

| Verdict | Tickets |
|---|---|
| Ready for release | {{refs or —}} |
| Not ready — failed | {{refs or —}} |
| Not ready — blocked | {{refs or —}} |
| Waiting on author | {{refs or —}} |
| Parked by reviewer | {{refs with park reason, or —}} |
| Design only (build not in QA) | {{refs or —}} |
| Skipped | {{refs with rule, or —}} |

## Per ticket
| Ticket | Plan | Verdict | PASS | FAIL | BLOCKED | Bugs filed | Automated | Report |
|---|---|---|---|---|---|---|---|---|
| {{KEY}} | {{plan}} | {{verdict}} | {{n}} | {{n}} | {{n}} | {{refs}} | {{n TCs}} | [summary]({{KEY}}_run-summary.md) |

## Ticket details
One section per ticket that ran, in the Per ticket order. Copy from the ticket's
`{KEY}_run-summary.md` — do not re-derive. Skipped tickets get no section.

### {{KEY}} — {{subject}}
**{{Result or Stopped line, copied from the run summary}}**

- **Where it is:** last stage {{stage}} · Jira {{status before}} → {{status now | unchanged}} · {{assignee now}}
- **Failures:** {{one line per FAIL: TC ID — actual result — bug ref | "None"}}
- **Decisions:** {{one line per gate: Gate X rule ID — action — by reviewer R-n, round n}}
- **Needs someone:** {{open question or park reason, and who must act | "Nothing"}}
- **Left behind:** {{test data and observations, from the run summary | "Nothing"}}
- **Automation:** {{from the run summary's Automation section | "Not run"}}

[Full run summary]({{KEY}}_run-summary.md) · [Test report]({{KEY}}_test-report.md) · [Review record](../7-reviews/{{KEY}}_review.md)

## Bugs filed in this batch
| Bug | Severity | Ticket | Summary |
|---|---|---|---|

## Open questions
{{Every unanswered question, with its ticket and who must answer it. "None" if empty.}}

## Reviews
{{Per ticket: checkpoints passed, rework rounds needed, and every Minor finding left
open. Link qa-artifacts/7-reviews/{KEY}_review.md.}}

## Automation pull requests — waiting for you
| Ticket | PR | State | What happened this run | Tests |
|---|---|---|---|---|
| {{KEY}} | [#{{n}}]({{url}}) | {{waiting for merge | fixed — waiting for merge | merged | closed | conflicting — needs you}} | {{opened | fixed 2 comments | rebased onto dev | —}} | {{P passing, F fixme}} |

{{"None" if no PR is open or changed.}} To ask for changes, comment on the PR; the next
`run the QA batch` (or `--prs`) fixes it and pushes to the same branch.
```

---

## 3. Closing report — the chat message after Step 5

Same five headings, same order, every run:

```
**QA batch {{BATCH}} — {{N}}/{{N}} tickets complete**

**Results** — one line per tested ticket: `KEY — verdict — PASS/FAIL/BLOCKED — bugs`.

**PRs waiting for merge** — one line per open automation PR: `KEY — #n url — tests`.
"None" when empty.

**Needs you** — every open question, every FAILED worker, every closed or unfixable PR,
with the one action that unblocks it. "Nothing" when empty.

**Left behind** — test data created and not cleaned up, specs that do not pass,
tracker writes that failed. "Nothing" when empty.

**Files** — the batch report path, then the batch run-state path.
```

---

## 4. Status card — a chat message per ticket, at every phase

The orchestrator posts one card per ticket each time a phase ends, as its own chat
message, so the QA can follow the batch live. Phases: `planned` · `design` ·
`execution` · `outcome` · `automation` (and `parked` / `blocked` / `failed` whenever a
ticket stops). Keep it to these lines; drop a line that has nothing to say.

```
**{{KEY}} — {{subject ≤ 60 chars}}**  ·  {{phase}}  ·  {{n}}/{{N}} in batch
- **Result:** {{one sentence — what just happened}}
- **Context:** {{planned only — status, new external comments, bug states that decided the plan (routing §1.0)}}
- **Tests:** {{P}} pass · {{F}} fail · {{B}} blocked{{ · S skipped}} ({{pass rate}})        ← execution, outcome
- **Review:** {{R2|R3}} round {{n}} — {{APPROVE | REWORK: one-line reason | PARK: reason}}
- **Bugs:** {{AP-1 High — title; AP-2 Medium — title | none}}                              ← outcome
- **Jira:** {{status before}} → {{status after, read back}}                                ← outcome
- **Automation:** {{gate passed → N tests, PR #n | gate failed: reason | skipped: reason}}  ← outcome, automation
- **Next:** {{what runs next for this ticket, or what the QA must do}}
```

Rules: post after the reviewer's verdict, never on a worker's claim alone; the `Jira`
line shows the status read back from the tracker; never put a credential, token or
test-account value in a card.
