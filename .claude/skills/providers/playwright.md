# Provider Adapter — Playwright (`browser`)

Implements the `browser` capability group. Bound to a project through
[../../../qa-artifacts/qa-config/tools.md](../../../qa-artifacts/qa-config/tools.md).

**Tool prefix:** `mcp__playwright__` · **Transport:** stdio, `npx @playwright/mcp@latest`

---

## Access rule

1. **Primary** — the Playwright MCP tools below. There is no fallback: without this
   server, browser-driven execution cannot run.
2. The server is declared in `.mcp.json` at the repo root and starts with the session.
   It must be **approved once per machine** — if the tools are missing, run `/mcp`,
   approve `playwright`, and restart the session.
3. If the tools are absent, stop and say so. Never mark a test case Pass without
   having driven the browser.
4. **One browser per agent session.** `.mcp.json` starts the server with `--isolated`:
   each Claude session launches its own server process with an in-memory browser
   profile, so parallel sessions never share cookies, tabs or a login, and never fight
   over a profile lock. The cost: nothing persists between sessions — every run logs in
   through its `[Pre-Condition]` step. Subagents inside one session share that
   session's browser, so run browser work in one subagent at a time.

---

## Capability map

| Capability | Implementation | Notes |
|---|---|---|
| `browser.open` | `browser_navigate` | Open a URL |
| `browser.snapshot` | `browser_snapshot` | Read the accessibility tree — do this before every interaction to orient yourself |
| `browser.click` | `browser_click` | Click a button, link, or element |
| `browser.type` | `browser_type` | Type text into an input |
| `browser.fill_form` | `browser_fill_form` | Fill several fields in one call |
| `browser.select` | `browser_select_option` | Choose a dropdown value |
| `browser.hover` | `browser_hover` | Hover over an element |
| `browser.press_key` | `browser_press_key` | Enter, Tab, Escape, PageDown, End, … |
| `browser.evaluate` | `browser_evaluate` | Run JavaScript — scrolling, checkbox state, custom interactions |
| `browser.wait` | `browser_wait_for` | Wait for text or an element |
| `browser.screenshot` | `browser_take_screenshot` | Capture evidence |
| `browser.back` | `browser_navigate_back` | Return to the previous page |
| `browser.dialog` | `browser_handle_dialog` | Accept or dismiss an alert or confirm |
| `browser.console` | `browser_console_messages` | Diagnose JavaScript errors |
| `browser.network` | `browser_network_requests` | Inspect traffic when verifying an API response |
| `browser.resize` | `browser_resize` | Set the viewport before starting a run |
| `browser.tabs` | `browser_tabs` | List, open, or switch tabs |
| `browser.find` | `browser_find` | Locate an element by description when the snapshot is large |
| `browser.close` | `browser_close` | Close the browser when the run is finished |

---

## Viewport convention

Values come from the registry's `browser` settings. For this project:

| Portal | Viewport | Call |
|---|---|---|
| Admin (back office) | 1280 × 800 | `browser.resize(1280, 800)` |
| Member (consumer app) | 390 × 844 | `browser.resize(390, 844)` |

Set the viewport **before** the first `browser.open`.

---

## Screenshots vs server output — two different directories

These are **not** the same place, and the distinction decides whether evidence lands
where the pipeline can find it.

| What | Where it goes | Controlled by |
|---|---|---|
| **Screenshots** (`browser.screenshot`) | `qa-artifacts/4-execution-results/screenshots/{Sprint}/{TicketID}/` | The `filename` **you** pass on each call |
| **Server logs** (`console-*.log`, `page-*.yml`) | `playwright-log/` at the repo root | `--output-dir` in `.mcp.json` |

**A filename passed to `browser.screenshot` resolves against the project root, not
against `--output-dir`.** So:

- **Always pass the full repo-root-relative path**, starting `qa-artifacts/…`. A bare
  filename lands in the repo root.
- `--output-dir` does **not** redirect screenshots. Pointing it at the evidence folder
  only dumps throwaway server logs in among the evidence.
- Never write a screenshot into `playwright-log/`, and never treat anything in there as
  evidence — it is disposable server output.

Name each file `{TC_ID}-step{N}-BriefSummary_[pass|fail].png`. Create the
`{Sprint}/{TicketID}` folder before opening the browser — the MCP server will not
create it for you.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| No `mcp__playwright__*` tools | Project server not approved on this machine | Run `/mcp`, approve `playwright`, restart the session |
| Screenshots land in the repo root | A bare filename was passed | Pass the full repo-root-relative path, starting `qa-artifacts/…` |
| Screenshots land in `playwright-log/` | Assumed `--output-dir` redirects screenshots | It does not — set the path in the `filename` argument |
| Server logs clutter the evidence folder | `--output-dir` points inside `qa-artifacts/` | Point it at `playwright-log` |
| "Browser is already in use" or one session's tab appears in another | Server started without `--isolated`, so sessions share one on-disk profile | Add `--isolated` to the args in `.mcp.json`, then restart the server (`/mcp`) in every session |
| Logged out at the start of every session | Expected with `--isolated` — the profile lives in memory | Log in through the test case's `[Pre-Condition]` step |
| Element not found after a click | The page changed without a re-read | Take a fresh `browser.snapshot` before every interaction |
| A modal or drawer never appears | Wrong viewport for the portal | Set the viewport per the convention above and retry |
