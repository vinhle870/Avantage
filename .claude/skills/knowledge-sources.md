# Knowledge Sources — Registry, Load Sets, Resolution

How every skill in this project reaches the **standing knowledge** about the
application under test: its environment, its test data, its routes, and its domain
business rules. This is a reference document, not a skill — nothing invokes it directly.

**Skills never hardcode a knowledge file path.** A skill names a **source ID**
(`navigation`, `domain`), resolves it through the project's registry, and reads
whatever file that registry points at. That is what lets the same skill work on a
project whose navigation map is one file and on one where it is twelve.

It is the same three-layer model as [mcp-tools.md](mcp-tools.md), applied to knowledge
instead of tools:

| Layer | File | Owned by | Answers |
|---|---|---|---|
| **Registry** | [../../qa-artifacts/qa-config/knowledge.md](../../qa-artifacts/qa-config/knowledge.md) | the QA, per project | *Which files hold this project's knowledge?* |
| **Load set** | the same file, §2 | the QA, per project | *Which of them does this skill read, and when?* |
| **Skill** | `.claude/skills/<skill>/SKILL.md` | the framework | *What to do with what it read?* |

Adding a knowledge file touches the registry only. It never touches a skill.

---

## 1. Why this exists

Before the registry, each skill carried its own prose list of files to read. Nine
skills drifted apart, and three of them still name files that no longer exist —
`stlc-testcase-designer` insists on reading `base-test/02-test-data.md`, which was
never created on this project. A skill cannot notice that; a table with a `State`
column can.

The registry gives three things a prose instruction cannot:

- **One place to edit.** A new knowledge file is one new row, not nine skill edits.
- **Declared absence.** A source with `State: missing` tells a skill to say
  *"this is not known"* instead of inventing a value or silently skipping it.
- **A budget.** The load set caps how much a skill reads, so knowledge can grow
  without every skill paying for all of it on every run.

---

## 2. Resolution rule

Every skill that needs standing knowledge starts with this, before any other step:

1. Read [../../qa-artifacts/qa-config/knowledge.md](../../qa-artifacts/qa-config/knowledge.md) §1 Sources and §2 Load sets.
2. Find your skill's row in §2. Read every source listed under **Always**.
3. Read a source listed under **When relevant** only if the current job needs it.
4. Branch on each source's `State` in §1:
   - **`active`** — read the file at that path and use it as authoritative.
   - **`missing`** — the source is declared but the file does not exist. Do **not**
     invent its content. Continue, and name the gap in your output and in your handoff.
   - **`unbound`** — no file chosen yet. Same handling as `missing`, plus offer to
     create it if the user asks.
   - **`stale`** — read it, but treat every fact as unverified: state the
     `Last verified` date wherever you rely on it.
5. On a conflict between two sources, the one with the later `Last verified` wins.
   Say in your output that the conflict existed.

State this in the skill as **Step 0 — Resolve the knowledge sources**, alongside the
provider resolution where the skill also needs a tool. Do not restate the rule
itself; link here.

---

## 3. Source ID vocabulary

The complete set a skill may ask for. A project's registry answers this list — with a
file, or with `missing` / `unbound`.

| Source ID | What it answers |
|---|---|
| `env` | Which environment we test, its URLs, and where its credentials come from |
| `test-data` | The accounts, records and generated values a test may use |
| `navigation` | **An index only** — the portals, the top-level sidebar, and a table mapping each feature area to the `domain` file that holds its actual routes, forms, flows and gotchas. Resolve `navigation` first to find the right `domain` file, then read that file — see §4. |
| `auth` | The reusable login preconditions per role |
| `env-check` | The smoke check that says the environment is fit to test |
| `api-baseline` | API calls used to set up or verify state outside the UI |
| `cleanup` | The teardown steps that leave the environment as it was found |
| `domain` | Feature and business-rule knowledge: what the product is meant to do, what it was observed to do, and what is still unknown |

A source ID missing from a project's §1 is `unbound`.

`domain` is the only source expected to grow every cycle. The others are set up once
and corrected when the environment changes.

---

## 4. Lookup-on-demand and mandatory write-back (feature-level knowledge)

`navigation` and `domain` work together as an index and its entries, not as two
independent sources:

1. **Lookup-on-demand.** When a skill or an agent exploring the live application needs to
   know how a specific function or flow actually works, resolve `navigation` first — it is
   the index. Find the feature area in its table and read the `domain` file it points to.
2. **A feature with no index row is a declared gap**, not a reason to stop. Proceed with
   the task anyway — never block test design or execution on missing docs — but say
   explicitly that the knowledge is missing, and the gap must be closed per point 3 before
   the *overall task* (not just the knowledge lookup) is considered finished.
3. **Mandatory write-back.** Before a manual-execution run or an ad-hoc live-exploration
   task finishes, list every function/flow actually exercised. For any flow with no
   matching row in the `navigation` index: create or extend the matching `domain` file
   (recipe and template in [qa-docs/_mapping-guide.md](../../qa-artifacts/qa-docs/_mapping-guide.md)
   when this project's `domain` source is a `qa-docs/` folder), add its row to the
   `navigation` index, and remove it from the index's "not yet mapped" list if it was
   there. **The task is not complete while it leaves a newly-learned flow undocumented** —
   this is a required step, not optional cleanup.

This rule governs `stlc-manual-executor` explicitly, and applies equally to any live
browser exploration performed outside a named skill, in the same session.

---

## 5. Rules for skill authors

- **Never name a knowledge file path in a skill.** Name the source ID and resolve it.
  The one exception is this document and the registry itself.
- **Never treat `missing` as empty.** Empty means "there is nothing to know"; missing
  means "we do not know". A test case built on a missing source is `BLOCKED`, not
  `PASS`.
- **Declare your load set.** A skill that reads a source not listed in its §2 row is a
  registry bug — fix the registry, do not work around it in the skill.
- **Keep `Always` short.** Everything in it is paid for on every single run. If a
  source is needed by one job in five, it belongs under **When relevant**.
- When a source is added or removed, the registry and the affected skills' `## Resources`
  sections change together.
