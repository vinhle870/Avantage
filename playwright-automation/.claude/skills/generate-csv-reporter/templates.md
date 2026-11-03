# CSV Reporter — File Templates

Copy each block verbatim into the utilities folder, adjusting only the import paths.
Paths below assume `src/utilities/`.

---

## 1 — `csv-report-generator.ts`

Owns the row shape, CSV serialisation, and file naming.

```ts
import { promises as fs } from "fs";
import path from "path";

export interface CsvReportRow {
  suite: string;
  testCase: string;
  tags: string;
  project: string;
  status: string;
  retry: number;
  durationMs: number;
  startedAt: string;
  file: string;
  errorMessage: string;
}

const CSV_HEADERS: (keyof CsvReportRow)[] = ["suite", "testCase", "tags", "project", "status", "retry", "durationMs", "startedAt", "file", "errorMessage"];

function escapeCsvField(value: unknown): string {
  const str = String(value ?? "");
  return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function rowsToCsv(rows: CsvReportRow[]): string {
  const lines = rows.map((row) => CSV_HEADERS.map((key) => escapeCsvField(row[key])).join(","));
  return [CSV_HEADERS.join(","), ...lines].join("\n");
}

function groupRowsByFile(rows: CsvReportRow[]): Map<string, CsvReportRow[]> {
  const grouped = new Map<string, CsvReportRow[]>();

  for (const row of rows) {
    const bucket = grouped.get(row.file) ?? [];
    bucket.push(row);
    grouped.set(row.file, bucket);
  }

  return grouped;
}

/** Spec file name without directory or `.spec.ts`, e.g. `member-portal-signup_TC01`. */
function specFileBaseName(file: string): string {
  return path.basename(file).replace(/\.spec\.ts$/, "");
}

/** Formats a Date as `MMDDYYYY_HHmmss` (local time), e.g. `08042026_194432`. */
function formatExecutionTimestamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getMonth() + 1)}${pad(date.getDate())}${date.getFullYear()}_${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

export async function generateCsvReport(rows: CsvReportRow[], outputDir: string, runLabel?: string): Promise<void> {
  if (rows.length === 0) {
    console.warn("[csv-report] No test results found — skipping CSV generation.");
    return;
  }

  const timestamp = formatExecutionTimestamp(new Date());

  await fs.mkdir(outputDir, { recursive: true });

  if (runLabel) {
    const outputPath = path.join(outputDir, `${runLabel}_${timestamp}.csv`);
    await fs.writeFile(outputPath, rowsToCsv(rows), "utf-8");
    console.log(`[csv-report] Wrote ${rows.length} row(s) to ${outputPath}`);
    return;
  }

  for (const [file, fileRows] of groupRowsByFile(rows)) {
    const outputPath = path.join(outputDir, `${specFileBaseName(file)}_${timestamp}.csv`);
    await fs.writeFile(outputPath, rowsToCsv(fileRows), "utf-8");
    console.log(`[csv-report] Wrote ${fileRows.length} row(s) to ${outputPath}`);
  }
}
```

---

## 2 — `csv-row-store.ts`

The reporter → teardown hand-off. Both run in the same Node process, so a
module-level array is sufficient and no intermediate file is written.

```ts
import type { CsvReportRow } from "./csv-report-generator";

const rows: CsvReportRow[] = [];

export function addRow(row: CsvReportRow): void {
  rows.push(row);
}

export function getRows(): CsvReportRow[] {
  return rows;
}

export function resetRows(): void {
  rows.length = 0;
}
```

---

## 3 — `csv-row-collector-reporter.ts`

Collects during `onTestEnd`, never `onEnd`.

```ts
import path from "path";
import type { FullConfig, Reporter, Suite, TestCase, TestResult } from "@playwright/test/reporter";
import type { CsvReportRow } from "./csv-report-generator";
import { addRow, resetRows } from "./csv-row-store";

function getProjectName(test: TestCase): string {
  let suite: Suite | undefined = test.parent;
  while (suite && suite.type !== "project") suite = suite.parent;
  return suite?.title ?? "";
}

function formatErrorMessage(result: TestResult): string {
  if (result.errors.length) return result.errors.map((e) => e.message ?? "").join(" | ");
  if (result.error?.message) return result.error.message;
  return "";
}

export default class CsvRowCollectorReporter implements Reporter {
  private repoRoot = "";

  onBegin(config: FullConfig, _suite: Suite): void {
    this.repoRoot = config.configFile ? path.dirname(config.configFile) : process.cwd();
    resetRows(); // drop rows from a previous run sharing this process (e.g. --repeat-each)
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const titlePath = test.titlePath(); // [root, project, file, ...describe blocks, test title]

    addRow({
      suite: titlePath.slice(3, -1).join(" > "),
      testCase: test.title,
      tags: test.tags.join(";"),
      project: getProjectName(test),
      status: result.status,
      retry: result.retry,
      durationMs: result.duration,
      startedAt: result.startTime.toISOString(),
      file: path.relative(this.repoRoot, test.location.file).split(path.sep).join("/"),
      errorMessage: formatErrorMessage(result),
    });
  }
}
```

---

## 4 — `global-teardown.ts`

```ts
import path from "path";
import type { FullConfig } from "@playwright/test/reporter";
import { generateCsvReport } from "./csv-report-generator";
import { getRows } from "./csv-row-store";

/**
 * Derives a filename-safe label from the `--grep`/`-g` value the CLI was invoked with,
 * e.g. `--grep @TC35` -> `TC35`, `--grep "@TC35|@TC36"` -> `TC35_TC36`.
 */
function extractGrepTag(): string | undefined {
  const argv = process.argv;
  const flagIndex = argv.findIndex((arg) => arg === "--grep" || arg === "-g");
  const inlineFlag = argv.find((arg) => arg.startsWith("--grep=") || arg.startsWith("-g="));

  const raw = flagIndex !== -1 ? argv[flagIndex + 1] : inlineFlag?.split("=").slice(1).join("=");
  if (!raw) return undefined;

  const label = raw.replace(/[^a-zA-Z0-9_]+/g, "_").replace(/^_+|_+$/g, "");
  return label || undefined;
}

export default async function globalTeardown(config: FullConfig): Promise<void> {
  const repoRoot = config.configFile ? path.dirname(config.configFile) : process.cwd();
  const outputDir = path.resolve(repoRoot, "csv-report");

  await generateCsvReport(getRows(), outputDir, extractGrepTag());
}
```

---

## 5 — `playwright.config.ts` wiring

```ts
import path from "path";

export default defineConfig({
  reporter: [["html", { open: "always" }], [path.resolve(__dirname, "src/utilities/csv-row-collector-reporter.ts")]],
  globalTeardown: path.resolve(__dirname, "src/utilities/global-teardown.ts"),
  // ...
});
```

If a `globalTeardown` already exists, import `generateCsvReport` and `getRows` into it
and append the CSV write to the end of the existing function instead of replacing it.
