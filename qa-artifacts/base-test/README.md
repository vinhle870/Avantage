# base-test/

This folder holds the shared, reusable inputs that every test cycle depends on,
rather than the output of any single pipeline stage. Files here are edited by
hand and read by the other skills — they are never regenerated.

| File | Purpose | Maintained by |
|---|---|---|
| `execute.env.md` | The environment under test: base URL, browser, accounts, and third-party service credentials. Read by `stlc-manual-executor` at the start of every run. | You, by hand |
| `test-centralized.md` | The single source of truth for QA and UAT test accounts across portals and roles. | You, by hand |
| `navigation-map.md` | The application's real routes, form field names, page-vs-modal behaviour, and automation gotchas. Read by `stlc-manual-executor` at Step 0d so a run navigates by URL instead of hunting. Extend it whenever a case explores new ground, and date the entry. | You and the executing agent |
| Baseline step files | Reusable preconditions, login and test-data setup, environment checks, and cleanup steps shared across test cases. | The `stlc-baseline-generator` skill |

Because `execute.env.md` holds credentials, keep it out of source control —
add it to `.gitignore` and reference secrets as `[SET IN .env: VAR_NAME]`.
