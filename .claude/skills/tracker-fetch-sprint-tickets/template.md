# Fetch Sprint Tickets — Output Formats

Everything this skill prints or writes. Structure is fixed; only the values change.

Show the ticket reference exactly as the provider returns it — `#43040` on OpenProject,
`PROJ-42` on Jira. Show `—` for any field the provider leaves null. Use the provider's
own status names in these tables, not the canonical vocabulary — a human reads them
against the tracker UI.

---

## 1. On-screen table

```markdown
## Sprint: <sprint_name> — <project_name>
Total: <N> tickets

| # | Ticket | Subject | Type | Status | Priority | Assignee | Due Date | % Done |
|---|---|---|---|---|---|---|---|---|
| 1 | #43040 | Replace field "Job Placement Rate"… | Task | In progress | Normal | Hoai Dung | 2026-06-02 | 0% |
```

## 2. Status summary

```
Status summary:
  To Do         : X
  In progress   : X
  Done          : X
  (other)       : X
```

---

## 3. Saved file

**Location:** `qa-artifacts/0-sprint-tickets/`

**Filename** — a short slug from the sprint name:

| Sprint name | File |
|---|---|
| `S4: Epic 4+10: Complete Schedule Flow…` | `sprint4-tickets.md` |
| `Sprint 08/06/2026` | `sprint-08-06-2026-tickets.md` |
| *(no usable slug)* | `sprint-<sprint_reference>-tickets.md` |

**Contents:**

```markdown
# <sprint_name> — <project_name>
**Tracker:** <provider> | **Sprint ref:** <sprint_reference>
**Total:** <N> tickets | **Fetched:** <YYYY-MM-DD>

---

## <Status Group> (<count>)

| Ticket | Subject | Type | Assignee | Due Date | % Done |
|--------|---------|------|----------|----------|--------|
| 41857 | FR17 – … | User story | Vinh Le | 2026-05-27 | 0% |

---

## Status Summary

| Status | Count |
|--------|-------|
| Ready for QA | X |
| … | X |
| **Total** | **N** |
```

- Group tickets by status, same grouping as the on-screen table.
- Create the folder if it does not exist.
- Overwrite a file of the same name — the list may have changed.

---

## 4. Next Move block

Before printing it, update `qa-artifacts/.session-state.md`:
- `pipeline_stage: sprint-fetched`
- `last_skill_run: tracker-fetch-sprint-tickets`
- `last_action: Sprint tickets fetched — [N] tickets in [sprint_name]`

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SKILL COMPLETE: Fetch Sprint Tickets
 Output: [N] tickets in [sprint_name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 WHAT TO DO NEXT:
  → [PRIMARY]   View specific ticket details (menu option 2)
  → [ALTERNATE] Check blocked items (menu option 8)
  → [ALTERNATE] Start execution for a Ready-for-QA ticket — say "execute test cases"
  → [QUICK]     Post sprint status to a ticket (menu option 13)
  → [PAUSE]     Save progress and exit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Say "what's next" at any time to see this again.
```
