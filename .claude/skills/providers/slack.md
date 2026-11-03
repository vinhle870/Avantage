# Provider Adapter — Slack (`notify`)

Implements the `notify` capability group. Bound to a project through
[../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md).

**Tool prefix:** `mcp__claude_ai_Slack__` · **Transport:** remote claude.ai connector

> This adapter is only in play when the registry's `notify` row names `slack` and its
> state is `active`. While `notify` is `disabled`, every skill skips its notify step
> and says so — that is not a failure.

---

## Access rule

1. **Authorisation** — a remote connector, authorised through the user's claude.ai
   connector settings. A non-interactive session cannot run the OAuth flow.
2. **Always ask the user before posting.** A Slack message is outward-facing and
   cannot be quietly undone.
3. If the connector is not authorised, or the target channel is not set in the
   registry, skip the step and say so.

---

## Capability map

| Capability | Implementation | Notes |
|---|---|---|
| `notify.post_message` | `send_message` | Target channel from the registry's `notify` settings |

---

## Content rules

- Post the Executive Summary and the go/no-go verdict only — never the full report.
- Link to the artifact path rather than pasting tables.
- Show the user the exact text and get a yes before sending.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| No `mcp__claude_ai_Slack__*` tools | Connector not authorised | Ask the user to authorise it in claude.ai connector settings, then skip the step |
| No channel configured | Registry `notify` settings incomplete | Ask the user for the channel and offer to add it to the registry |
