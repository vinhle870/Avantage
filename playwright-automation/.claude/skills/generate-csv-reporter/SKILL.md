---
name: generate-csv-reporter
description: >-
  Generate the CSV run-report layer for a Playwright automation framework — a
  collector reporter, an in-memory row store, a CSV generator, and a
  globalTeardown that writes timestamped CSVs to csv-report/. Wires both into
  playwright.config.ts and verifies with a smoke run. Use when the user says
  "generate the csv reporter", "add CSV reporting", "set up the CSV report", or
  when initialising an automation framework that needs one CSV row per test.
---

# Generate CSV Reporter — Skill

Scaffolds a four-file CSV reporting layer that writes one row per finished test to
`csv-report/<label>_<MMDDYYYY>_<HHmmss>.csv`, and wires it into `playwright.config.ts`.

> **Hard rule**: `globalTeardown` runs BEFORE any reporter's `onEnd()`. Teardown can
> therefore never read a reporter's output file. The hand-off MUST be the in-memory
> row store — this is the whole reason the layer is split across four files.

---

## Workflow

### Step 1 — Confirm the target paths

Read `playwright.config.ts` and establish:

| Question | Default if unstated |
|---|---|
| Where do shared utilities live? | `src/utilities/` |
| Is a `globalTeardown` already configured? | none |
| Is `csv-report/` git-tracked or ignored? | ask — it accumulates one file per run |

Stop and ask if a `globalTeardown` already exists — it must be merged, not overwritten.

### Step 2 — Generate the four files

Copy from [templates.md](templates.md) into the utilities folder. Never collapse them
into fewer files; each exists for a reason given in [reference.md](reference.md).

| File | Role |
|---|---|
| `csv-report-generator.ts` | `CsvReportRow` type, CSV escaping, filename + timestamp, `generateCsvReport()` |
| `csv-row-store.ts` | Module-level array; the reporter → teardown hand-off |
| `csv-row-collector-reporter.ts` | `Reporter` that pushes a row in `onTestEnd` |
| `global-teardown.ts` | Reads the store, derives the run label, writes the CSV |

### Step 3 — Wire `playwright.config.ts`

Add the reporter alongside any existing ones, and register the teardown:

```ts
reporter: [["html", { open: "always" }], [path.resolve(__dirname, "src/utilities/csv-row-collector-reporter.ts")]],
globalTeardown: path.resolve(__dirname, "src/utilities/global-teardown.ts"),
```

The reporter path is a **file path**, not a package name — it is a local reporter.

### Step 4 — Verify with a smoke run

Run one fast spec and confirm a CSV appears:

```bash
pnpm exec playwright test <one-spec> --project=chromium --workers=1
ls csv-report/
```

Then run the same spec with `--grep @TC07` and confirm the filename becomes
`TC07_<timestamp>.csv`. Both checks must pass before declaring done.

> Do **not** verify with `--reporter=line`. A CLI `--reporter` flag REPLACES the
> configured reporters, so the collector never runs and teardown reports
> `[csv-report] No test results found`. That is expected, not a bug.

### Step 5 — Report what was created

List the files written, the config lines changed, and the two verification results.

---

## Rules

1. **Never write the CSV into `test-results/`** (or whatever `outputDir` is). Playwright
   wipes `outputDir` at the START of every run, deleting the previous run's report before
   teardown executes. Always use a sibling folder such as `csv-report/`.
2. **Never read `--grep` from `FullConfig`.** The CLI flag is applied as an internal
   runtime filter and never reaches the public config object. Parse `process.argv`.
3. **Never move row collection into `onEnd()`.** It fires after teardown has finished.
4. **Always include seconds in the timestamp** so two runs in the same minute cannot
   silently overwrite each other.
5. **Call `resetRows()` in `onBegin`** — one process can host several runs
   (`--repeat-each`, watch mode) and rows would otherwise accumulate across them.
6. Escape every CSV field: wrap in quotes and double any `"` when the value contains
   `"`, `,`, or a newline. Error messages routinely contain all three.

---

## Resources

| File | Read it for |
|---|---|
| [templates.md](templates.md) | The four file bodies and the config snippet, ready to copy |
| [reference.md](reference.md) | Hook ordering, run-label rules, filename scheme, troubleshooting |
