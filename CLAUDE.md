## QA Agent Instructions

See [ARCHITECTURE.md](ARCHITECTURE.md) for the authoritative reference on all agent skills — their locations, groups, and purposes. **Read this file at the start of every session before invoking any skill.**

## Tool Access

Tools are reached through three layers. **Read them in this order before any skill that drives a browser or touches a tracker.**

1. **[qa-artifacts/qa-config/tools.md](qa-artifacts/qa-config/tools.md)** — the project tool registry, owned by the QA. Binds each capability group (`tracker`, `browser`, `notify`) to a provider. *This is the only file that changes when the project moves to a different tracker.*
2. **[.claude/skills/mcp-tools.md](.claude/skills/mcp-tools.md)** — the capability contract: the resolution rule every skill's Step 0 follows, the capability vocabulary, canonical status/type/priority values, credential policy, preflight, and the adapter contract.
3. **[.claude/skills/providers/](.claude/skills/providers/)** — one adapter per provider: tool names, auth recipes, ID tables, pitfalls, troubleshooting.

**Skills never name a provider.** A skill names a capability (`tracker.get_ticket`), resolves it through the registry, and calls whatever adapter that row points at. Tool names, auth recipes, and ID tables live only in adapters — when one changes, edit the adapter only.

## Knowledge Access

Standing knowledge about the application under test — its environment, test data, routes
and domain rules — is reached the same way tools are, through two layers:

1. **[qa-artifacts/qa-config/knowledge.md](qa-artifacts/qa-config/knowledge.md)** — the project knowledge registry, owned by the QA. §1 binds each source ID (`env`, `test-data`, `navigation`, `domain`, …) to a file with a `State` and a `Last verified` date; §2 declares each skill's load set.
2. **[.claude/skills/knowledge-sources.md](.claude/skills/knowledge-sources.md)** — the knowledge contract: the resolution rule every skill's `Step 0 — Resolve the knowledge sources` follows, the source-ID vocabulary, and the rules for skill authors.

**Skills never hardcode a knowledge file path.** A skill names a source ID, resolves it
through the registry, and reads whatever file that row points at. A source marked
`missing` or `unbound` is a declared gap: say *"this is not known"* — never invent it.

@QA_AGENTS.md