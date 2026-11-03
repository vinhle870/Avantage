# Project Knowledge Registry

**Owned by the QA on this project — not by the skill framework.**

Every skill that needs standing knowledge about the application under test reads this
file *first* to decide which files to open. Skills never hardcode a knowledge path;
they name a **source ID** (`navigation`, `domain`) and let this table resolve it.

The resolution rule, the source-ID vocabulary and the rules for skill authors are in
[../../.claude/skills/knowledge-sources.md](../../.claude/skills/knowledge-sources.md).
This file holds only *this project's* answers.

Application under test: **Avantage Plus v2** — three portals (Dealer, Admin, Client).

---

## 1. Sources

| Source ID | File | State | Last verified | Answers |
|---|---|---|---|---|
| `env` | [../base-test/execute.env.md](../base-test/execute.env.md) | active | 2026-09-01 | v2staging portal URLs, shared login, password, Dealer ID 1380 and the Chubb Insurance Configuration route |
| `test-data` | [../base-test/test-centralized.md](../base-test/test-centralized.md) | active | 2026-08-29 | Vehicles, dealer account, generated Yopmail client inboxes |
| `navigation` | [../base-test/navigation-map.md](../base-test/navigation-map.md) | active | 2026-10-03 | **Index only** — the three portals, the dealer sidebar, and a table mapping each feature area to the `qa-docs/*.md` file with its actual routes/forms/flows. Resolve this first, then read the file it points to (see [knowledge-sources.md](../../.claude/skills/knowledge-sources.md) §4) |
| `auth` | `../base-test/01-auth-steps.md` | missing | — | Reusable login preconditions per role — folded into `navigation` §1 for now |
| `env-check` | `../base-test/03-environment-check.md` | missing | — | Pre-execution smoke check |
| `api-baseline` | `../base-test/04-api-baseline.md` | missing | — | Not needed yet — this project tests through the UI only |
| `cleanup` | `../base-test/05-cleanup-steps.md` | missing | — | Teardown. Quotes, Chubb contracts and sent compliance emails are currently left behind |
| `contract-setup` | [../base-test/06-chubb-contract-setup.md](../base-test/06-chubb-contract-setup.md) | active | 2026-09-04 | Canonical record of how a Chubb creditor-insurance contract is created, and the register of those created so far. **Designer reference only** — a contract is dynamic test data, so each test case creates one in its own `[Pre-Condition]` step rather than pointing here |
| `domain` | [../qa-docs/](../qa-docs/) | active | 2026-10-04 | Feature knowledge: both business rules **and** routes/forms/flows (the latter formerly lived in `navigation-map.md` directly — now split out, one file per feature area). Files so far: [quote-creation.md](../qa-docs/quote-creation.md), [chubb-insurance.md](../qa-docs/chubb-insurance.md), [compliance-documents.md](../qa-docs/compliance-documents.md), [admin-portal.md](../qa-docs/admin-portal.md), [risk-management.md](../qa-docs/risk-management.md), [earning-groups.md](../qa-docs/earning-groups.md), [earning-curves.md](../qa-docs/earning-curves.md), [billing-invoices.md](../qa-docs/billing-invoices.md), [admin-api.md](../qa-docs/admin-api.md), [claims.md](../qa-docs/claims.md) (Dev, 2026-11-01), [_mapping-guide.md](../qa-docs/_mapping-guide.md) (process, not feature content) — see §3 |

**`State` values:** `active` (read it, trust it) · `stale` (read it, date every fact
taken from it) · `missing` (declared but absent — name the gap, never invent the
content) · `unbound` (no file chosen yet).

> **⚠️ Three skills still name `base-test/02-test-data.md`, which does not exist on this
> project.** Its real content lives in `test-centralized.md`, bound above as `test-data`.
> Any skill reaching that path directly is reading a file from a previous project's
> layout — resolve `test-data` through this table instead.

---

## 2. Load sets

What each skill reads. **Always** is paid for on every run — keep it short.

| Skill | Always | When relevant |
|---|---|---|
| `stlc-requirements-analyst` | `domain` | — |
| `stlc-test-plan-designer` | `domain` | `env` |
| `stlc-testcase-designer` | `test-data`, `navigation`, `domain` | `env`, `auth`, `contract-setup` |
| `stlc-testcase-reviewer` | `domain`, `navigation` | `test-data` |
| `stlc-manual-executor` | `env`, `test-data`, `navigation` | `env-check`, `cleanup`, `api-baseline`, `contract-setup` |
| `stlc-bug-reporter` | `env` | `navigation`, `domain` |
| `stlc-test-reporter` | `env` | — |
| `stlc-baseline-generator` | — | all — it *writes* these files |
| `stlc-ticket-pipeline` | — | `env` (status check before s4 only — each stage loads its own set) |
| `stlc-test-automator` | `navigation` | `domain`, `test-data` |
| `stlc-qa-reviewer` | — | `domain`, `navigation` (E4 answers and R2 checks only) |
| `stlc-qa-orchestrator` | — | `env` (health check before Wave 2 only — each worker loads its own set) |
| `agent-coordination` | — | — |
| `tracker-*` | — | — |

A skill absent from this table reads no standing knowledge.

---

## 3. `domain` — bound, partial coverage

This is the source that holds what the agent knows about the product's features: both
business rules (the Quebec-only rule behind the Send Compliance Documents button, what
PM30 and PM50 are) **and**, since 2026-10-03, the routes/forms/flows that used to live
directly in `navigation-map.md`. `navigation` (above) is now a pure index into this
folder — see [knowledge-sources.md](../../.claude/skills/knowledge-sources.md) §4 for the
lookup-on-demand / mandatory-write-back rule that governs how skills use the two together.

**Written so far:**
- [quote-creation.md](../qa-docs/quote-creation.md) — client → vehicle → warranty →
  financing → sales flow, including the `fromVehicleId` entry-point gotcha (HTTP 500
  without it)
- [chubb-insurance.md](../qa-docs/chubb-insurance.md) — the Chubb insurance feature
  end-to-end (admin config → quoting → contract listing → compliance docs →
  acceptance/waiver form), **plus** its UI/route reference (the `/quote/{id}/insurance`
  flow, the stale-quote-date error, the dealer-side config-reading trick)
- [compliance-documents.md](../qa-docs/compliance-documents.md) — the AP-2436 send flow,
  registers, and email content
- [admin-portal.md](../qa-docs/admin-portal.md) — 10 of 49 admin sidebar routes
- [risk-management.md](../qa-docs/risk-management.md) — admin Risk Management: Earning Sets
  (create/edit dialog, validation, boundaries) and the Curves / Groups / Assignments lists (2026-10-03)
- [earning-groups.md](../qa-docs/earning-groups.md) — admin Earning Groups: create/edit modal,
  assign/unassign curves, validation, fixtures (2026-10-03)
- [earning-curves.md](../qa-docs/earning-curves.md) — admin Earning Curves: list, create/edit form,
  curve types and factor table (fraction scale), validation, no delete, fixtures (2026-10-04)
- [_mapping-guide.md](../qa-docs/_mapping-guide.md) — not feature content; the process a
  skill or agent follows to document a new feature area and the required write-back step

Still missing: everything outside these seven feature areas, including the Quebec-only
gate on Send Compliance Documents and 39 of 49 admin sidebar routes — tracked in
`navigation-map.md` §4 "Not yet mapped".

`stlc-testcase-reviewer` already reads `qa-artifacts/qa-docs/` when a
requirements-analysis names it under `related_docs:`, so the wiring exists on that side.

---

## Rules

- **Never put knowledge in this file.** It names files; it never holds their content.
  A fact that lives only here is a fact no skill can find.
- **Never hardcode a credential here.** Credentials belong in the gitignored `/.env`;
  `env` names the variables.
- `Last verified` is a promise. Change it only when someone has actually re-checked the
  file against the running application, and set the source to `stale` when the
  environment moves under it.
- A source that turns out to be wrong is set to `stale` immediately, before the fix.
  A wrong `active` source is worse than a `missing` one.
- When a source is added, removed, or re-bound, update §1 and §2 in the same edit.
