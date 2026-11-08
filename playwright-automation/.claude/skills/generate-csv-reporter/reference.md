# CSV Reporter — Reference

Why the layer is shaped the way it is, and what breaks when it is not.

---

## Hook ordering — the constraint that dictates the design

Playwright runs these in a fixed order within one `playwright test` invocation:

```
onBegin  →  onTestEnd (per test)  →  globalTeardown  →  reporter.onEnd()
```

Two consequences, both load-bearing:

1. **`globalTeardown` cannot read a reporter's output file.** By the time the built-in
   `json` reporter writes anything, teardown has already finished. Any design of the form
   "write JSON in `onEnd`, convert it in teardown" silently produces nothing.
2. **Rows must be gathered in `onTestEnd`.** Every test has finished before teardown
   starts, so the store is guaranteed complete when teardown reads it.

Since the reporter and teardown share one Node process, the hand-off is a module-level
array (`csv-row-store.ts`). No temp file, no artifact to clean up.

---

## Output directory — never `outputDir`

Playwright **wipes each project's `outputDir` at the start of every run**. Writing the CSV
there means each run deletes the previous run's report before teardown can even execute.
Use a sibling folder (`csv-report/`) that Playwright does not manage.

Worth deciding at scaffold time: `csv-report/` accumulates one file per run forever.
Either git-ignore it, or agree a retention habit with the team.

---

## Run label — why `process.argv`

`--grep` on the CLI is **not** exposed on `FullConfig`. That object only carries
`testConfig.grep` / `testProject.grep` set inside `playwright.config.ts`; the CLI flag is
applied as a separate internal runtime filter. Reporters and `globalTeardown` run in the
root process that parsed the original command, so `process.argv` is the only place the
flag is visible. Test workers are spawned separately and are not involved.

Label handling:

| Invocation | Output |
|---|---|
| `--grep @TC35` | one file, `TC35_<timestamp>.csv` |
| `--grep "@TC35\|@TC36"` | one file, `TC35_TC36_<timestamp>.csv` |
| no `--grep` | one file **per spec file**, named after that spec |

The tag form groups everything the CLI asked for into a single report regardless of how
many spec files it touched — that matches how people actually read these reports.

---

## Filename scheme

```
<label>_<MMDDYYYY>_<HHmmss>.csv      e.g.  TC57_08132026_213401.csv
```

Seconds are mandatory. Without them two runs in the same minute overwrite each other and
the loss is silent.

---

## Row shape

| Column | Source | Note |
|---|---|---|
| `suite` | `test.titlePath().slice(3, -1)` | describe blocks only — drops root/project/file |
| `testCase` | `test.title` | |
| `tags` | `test.tags.join(";")` | `;` not `,` — avoids quoting every row |
| `project` | nearest ancestor suite of type `project` | |
| `status` | `result.status` | `passed` / `failed` / `timedOut` / `skipped` |
| `retry` | `result.retry` | `0` on first attempt |
| `durationMs` | `result.duration` | |
| `startedAt` | `result.startTime.toISOString()` | UTC, unlike the filename timestamp |
| `file` | path relative to config dir | separators normalised to `/` |
| `errorMessage` | joined `result.errors` | always quote-escaped; contains commas and newlines |

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `[csv-report] No test results found` | A CLI `--reporter=` flag replaced the configured reporters, so the collector never ran | Drop the flag; configure reporters in `playwright.config.ts` |
| No CSV, no log line at all | `globalTeardown` not registered, or its path is wrong | Check the `globalTeardown` entry resolves to a real file |
| CSV disappears between runs | Output points inside `outputDir` | Move it to `csv-report/` |
| Rows from an earlier run appear | `resetRows()` missing from `onBegin` | Add it — matters for `--repeat-each` and watch mode |
| Columns shift on failed tests | Error text not escaped | Ensure `escapeCsvField` wraps values containing `"`, `,`, newline |
| Filename is `undefined_...` | `--grep` value read from the wrong argv slot | Handle both `--grep X` and `--grep=X` forms |

---

## Verification checklist

- [ ] Untagged run of one spec produces `<spec-name>_<timestamp>.csv`
- [ ] `--grep @TCnn` run produces `TCnn_<timestamp>.csv`
- [ ] A failing test's `errorMessage` is quoted and keeps the row on one record
- [ ] Two runs in the same minute produce two files
- [ ] `test-results/` contains no CSV
