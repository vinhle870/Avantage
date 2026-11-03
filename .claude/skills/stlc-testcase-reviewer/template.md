# Test Case Review — {{ID_OR_SPRINT}}

**Date:** {{DATE}}
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** {{REQUIREMENTS_ANALYSIS_PATH}}, {{TEST_PLAN_PATH}}, {{TEST_CASES_PATH}}

**Standing caveat:** {{Only include this line if Pass 1 found no real AC for one or more tickets — state it plainly, e.g. "Real acceptance criteria could not be retrieved for this ticket; findings below are risk-based, not AC-confirmed."}}

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | {{Requirement/AC/business rule with no corresponding TC}} | {{AC or REQ number}} | High/Medium/Low | {{one line}} |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- {{TC ID}} → {{cited AC}} — {{not found in requirements-analysis / test-plan}}

**Unresolved Open Questions affecting coverage:**
- {{Q-00N}} — {{still open; blocks: which TCs / what real behavior can't be verified}}

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | {{short, concrete title}} | {{Equivalence partitioning / Boundary value analysis / Decision table / State transition / Error guessing / Security / Cross-entity}} | {{One sentence naming what a real user or the business loses if this ships broken}} | High/Medium/Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| Decision table | Work through every combination of two or more settings that interact, so no combination is left untried. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |
| Cross-entity | Check that what this feature produces is read correctly by the next feature in the workflow. |

> If more than 10 candidates surfaced, list only the top 10 by priority and note: "{{N}} additional lower-priority candidates not listed."

---

## Patterns Across Several Tickets

_Risks that show up again and again across this batch, rather than in one ticket.
These usually point at a habit worth fixing once instead of ticket by ticket._

*(Only when reviewing multiple tickets in one pass — omit this section for a single-ticket review.)*

- {{Pattern visible across 3+ tickets, e.g. "no ticket in this batch tests concurrent edits by two Admins."}}
- {{Workflow chain with no single end-to-end test, e.g. "A → B → C → D has no scenario walking the full chain."}}

---

## Recommendation

{{One paragraph: is this TC set ready for execution as-is, or should specific Pass 1/Pass 2 items be promoted into the TC file first via stlc-testcase-designer? Name the highest-priority 2-3 items if recommending a hold.}}
