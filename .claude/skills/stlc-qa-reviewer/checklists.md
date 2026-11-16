# QA Reviewer — Checklists

Read this file while executing `stlc-qa-reviewer`. Paths use the tokens from
[../ticket-scope.md](../ticket-scope.md) §2. Every item is checked on the file on disk.

---

## 0. Severity

| Severity | Meaning | Blocks approval |
|---|---|---|
| **Blocker** | A result, decision or test that is wrong or unproven — shipping on it would mislead | Yes |
| **Major** | Missing coverage, missing evidence or a rule broken in a way that changes a result | Yes |
| **Minor** | Wording, naming or style that does not change any result | No |

When unsure between two severities, take the higher one.

---

## 1. R1 — Requirements analysis (Gate A)

Input: `{KEY}_requirements-analysis.md` + the requirement capture.

| # | Check | Severity if it fails |
|---|---|---|
| 1.1 | Every acceptance criterion in the capture maps to at least one `REQ-00N` | Major |
| 1.2 | No `REQ` states behaviour that the capture does not contain (invented scope) | Blocker |
| 1.3 | Every Open Question has an Impact (`Blocking` / `Judgement` / `Info`) and a Status | Blocker |
| 1.4 | Every requirement without an acceptance criterion has a `Blocking` question | Major |
| 1.5 | A question marked `Answered` quotes the comment, capture or Jira Story/Task sentence (with its key) that answers it | Major |
| 1.6 | Every knowledge question went through the knowledge lookup (analyst Step 3c): `Accepted` names the queries searched, and no `Accepted` or lookup-answered question is posted to the tracker | Major |

Rework stage: `s1`.

---

## 2. R2 — Test cases (Gate B)

Input: every `{SPEC}_TestCases_*.md`, the analysis, the test plan and `{SPEC}_ReviewFindings_{DATE}.md`.

| # | Check | Severity if it fails |
|---|---|---|
| 2.1 | Every `REQ` / acceptance criterion has ≥ 1 test case, and every test case cites one | Major |
| 2.2 | Every expected result is observable and concrete — a value, a message text, a visible element, a URL. "Works correctly", "as expected", "is saved properly" fail | Major |
| 2.3 | Each file has ≤ 5 cases, each case ≤ 5 steps, IDs follow `{SPEC}_NNN` with no gaps or duplicates | Minor |
| 2.4 | A case depending on a `Blocking` + `Open` question is `BLOCKED` and names the question in **Blocked by** | Blocker |
| 2.5 | A `Judgement` + `Open` question's expected result is *record-only*, and an `Accepted` question's is *record-and-accept* (fails only on an objective fault or contrary AC text) — no PASS/FAIL hangs on a guessed answer | Blocker |
| 2.6 | Every **High** Pass 2 proposal in the review findings was promoted or has a logged reason | Major |
| 2.7 | Test data and entry route come from the `test-data` / `navigation` sources, or are created in a `[Pre-Condition]` step | Major |

Rework stage: `s3` (promotion counts as the Gate B re-run, not as a rework round).

---

## 3. R3 — Execution results (Gate C)

Input: the latest execution log for `{KEY}`, its screenshots folder, the test-case files.

| # | Check | Severity if it fails |
|---|---|---|
| 3.1 | Every test case in the TC files appears in the log; none is left `Not Run` | Blocker |
| 3.2 | Summary counts and pass rate equal the per-case rows (recount them) | Major |
| 3.3 | Every PASS step's **Actual Result** states the observed value and matches its **Expected Result**. "As expected", "OK", "correct", a copy of the expected text with no observed value, or an empty cell fail | Major |
| 3.4 | Every screenshot path in the log exists on disk | Major |
| 3.5 | **Look at the screenshots** (Read the image): every FAIL, and the last `[Verification]` step of every High-priority PASS, at most 10 images. The image must show what the Actual Result claims | Blocker |
| 3.5a | Every PASS on a step that checks saved values survive a save, reopen or reload has a `{TC_ID}-step{N}-values.txt` next to its screenshot (`stlc-manual-executor` 2d), with a capture time and the checked values, and those values match the Actual Result. A screenshot alone does not prove persistence | Major |
| 3.6 | Every FAIL names the failing step, and its Actual Result differs from the Expected Result in a stated way | Major |
| 3.7 | No environment failure is recorded as FAIL — a login failure, timeout or HTTP 5xx *before* the step under test is `BLOCKED`, retried once | Blocker |
| 3.8 | Every BLOCKED case has a reason and names the bug, question or outage that blocks it | Major |
| 3.9 | Gate C decisions (C1–C4) quote their evidence; a C1 "Not a bug" quotes a sentence from the capture or a non-developer comment | Blocker |

Rework stage: `s4` for the named TC IDs only — never re-run the whole log for one bad case.

---

## 4. R4 — Outcome plan (Gate D)

Input: the test report, the bug report, the analysis, the registry's *QA outcome rules*.

| # | Check | Severity if it fails |
|---|---|---|
| 4.1 | Recompute the pass rate: PASS ÷ (all − SKIPPED) × 100. It equals the report's figure | Blocker |
| 4.2 | Every FAIL has a filed, linked or dismissed bug in the bug report | Blocker |
| 4.3 | Stopping bugs (§3.1 of the pipeline routing) are identified correctly | Blocker |
| 4.4 | The planned status move matches all three checks — pass rate, no stopping bug, no open Blocking question | Blocker |
| 4.5 | The story comment lists every test case with its status and bug | Major |
| 4.6 | Bug tickets: the re-assign target is not in `not_developers` | Blocker |
| 4.6a | Every question the outcome comment lists (and every Gate A question posted this run) has a `{KEY}_Q-00N_highlighted.png` on disk. **Read the image**: a red box frames the field, button or message the question is about. A question without one is listed on the `*No screenshot yet:*` line and has a reason (not captured yet, or no screen to show); the s7 comment supplies the captured ones | Major |
| 4.7 | Every bug filed in this run: read its tracker description back. It follows the *bug description shape* (`tracker-manage-child-ticket` → template.md): one-sentence summary, at most 6 steps, one line each for Expected and Actual, at most about 20 lines of text. It has no analysis, guessed root cause or local path. A reference to another ticket appears only in the template's optional Note line (e.g. "relates to AP-NNNN", at most 2 lines), never in the steps, Expected or Actual | Major |

Rework stage: `s6` (report wrong) or `s5` (a FAIL without a bug, or a bug description that fails 4.7, which s5 rewrites).

---

## 5. R5 — Automation specs

Input: `qa-artifacts/6-automation/{KEY}_automation-report.md`, the spec tagged `@{KEY}`
and every file listed under *Files changed*. Run the commands from `playwright-automation/`.

| # | Check | Severity if it fails |
|---|---|---|
| 5.1 | **Run it yourself:** `npm run lint`, then `npx playwright test --project=chromium --grep @{KEY} --repeat-each=2`. Every non-fixme test passes both times | Blocker (fails) · Major (passes once only — flaky) |
| 5.2 | Every `test()` title starts with a TC ID whose final manual status is PASS; the `describe` carries `@{KEY}` | Major |
| 5.3 | **Traceability:** every `[Verification]` step's expected result has an `expect` that checks it — same value, text or state. List the step → assertion pairs in the record | Blocker (a test with no assertion) · Major (a step not asserted) |
| 5.4 | No `page.waitForTimeout`, no `test.only`, no hard-coded credential, URL or account — credentials via `getCredentials` | Blocker |
| 5.5 | Page objects hold locators and actions only — no `expect`, no `test.step`. Flows hold `test.step` and assertions. Specs call flows | Major |
| 5.6 | Existing methods keep their behaviour: in `git diff`, a changed line inside a method another spec uses is a finding | Blocker |
| 5.7 | Test data is unique per run (`Date.now()` or similar), never a fixed name | Major |
| 5.8 | Every `test.fixme()` has a reason comment and appears under *Not passing* in the report. All tests fixme → Major | Minor |
| 5.9 | Every new locator in the report has a match count of 1 recorded | Major |

Run R5 only while holding the browser and test accounts (Wave 2 slot, or a single-ticket
run). Rework stage: `s8`.

---

## 6. Stop points in reviewer mode

With `gate_mode: reviewer`, no stop point reaches the user:

| Stop | Reviewer rule |
|---|---|
| **E1** — every requirement blocked | `PARK` the ticket: the Blocking questions are already posted at Gate A. Record `waiting on author`; resume with `{KEY} --from analyze` once answered |
| **E2** — partial duplicate | **File new**, linked to the candidate as *relates to*, with a line in the description naming the candidate and the difference. A duplicate costs a triage minute; a lost bug costs a release |
| **E3** — no run folder | Use `{RUN}` = `no-sprint` and log it. The folder name carries no test meaning |
| **E4** — a worker question | Answer from a quotable sentence in the capture, a ticket comment, or a `domain` / `navigation` source. Otherwise, for unknown knowledge (field meaning or values, a workflow), run the knowledge lookup (analyst Step 3c): a Story/Task that defines it answers it, else the current actual result is accepted — no question posted, no PARK. `PARK` and post on `{KEY}` only for a question the lookup cannot settle (missing test data, access, or the ticket's own text contradicting itself or reading two ways — analyst Step 3b) |
| **E5** — rejection without stated behaviour | `PARK` the test case: post on the **rejected bug** asking for the intended behaviour, keep the case BLOCKED, continue the run |
