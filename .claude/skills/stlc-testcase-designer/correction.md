# Test Case Designer — Correction Mode

Correct test cases whose expected result was wrong, after the bug they raised is
confirmed **not valid**. Read this file when correction mode is triggered from
SKILL.md. This skill owns `{SPEC}_TestCases_*.md`, so every correction happens here.

---

## 1. Triggers

| Trigger | Source of the confirmation |
|---|---|
| Gate C rule **C1 — Not a bug** in `stlc-ticket-pipeline` | The quoted sentence from the requirement capture or a ticket comment that states the intended behaviour |
| A filed bug comes back rejected (closed as not a bug, works as designed, won't fix because intended) | The bug ticket's comment that states the intended behaviour — confirmed by pipeline rule R1, or by the user at stop E5 |
| The user says it directly — "AP-2462 is not a bug", "BUG-003 is invalid, update the test case" | The user |

A rejection found in the tracker is a **candidate** until rule R1 confirms it (the comment
states the correct behaviour, and its author is not in `not_developers`) or the user does.
Never correct a test case on a status change or a bare "not a bug" alone.

---

## 2. Inputs

For each invalid bug, collect:

| Item | Where |
|---|---|
| Bug ID and ticket ref | The ticket's bug report — `{KEY}_bug-report.md` (see [../ticket-scope.md](../ticket-scope.md)) |
| TC ID(s) | The bug report row, or the `[BUG-NNN][TC_ID]` prefix of the ticket title |
| Failing step and actual result | The latest execution log for the ticket |
| **Confirmed correct behaviour** | The Gate C rule C1 quote, the rule R1 comment, or the user's answer at stop E5 — always as quoted text |
| Who confirmed it, and when | Same |

If the confirmation says the bug is invalid but **does not say what the correct
behaviour is**, ask: _"What should <TC ID> expect instead at step <N>?"_ Never derive
the new expectation from the actual result alone — "the app did X" is not proof that
X is intended.

---

## 3. Decide: correct or retire

| The confirmation says… | Action |
|---|---|
| The behaviour is intended, and the case still tests something in scope | **Correct** — rewrite the expectation (§4) |
| The scenario itself is out of scope or impossible by design | **Retire** — status `SKIPPED`, Result `Retired — <reason>`; keep the steps as written |
| It is a duplicate of another bug | Not a correction — leave the case as it is and tell the user |

Never delete a test case and never reuse its TC ID.

---

## 4. Correct the test case

In the TC file, for each affected case:

1. Rewrite the **Expected Result** of the failing step to the confirmed behaviour, in
   observable terms. Rewrite the final `[Verification]` step too if it asserted the old
   behaviour. Change actions only if the confirmation says the steps were wrong.
2. Set **Status** to `Not Run` and clear **Executed on** and **Result** — the corrected
   case has not been executed yet. Update the Summary Table row to match.
3. Add or extend a **Revisions** table directly under the TC's header table:

   ```markdown
   **Revisions:**

   | Date | Change | Reason | Confirmed by |
   |---|---|---|---|
   | 2026-10-04 | Step 4 expected result: duplicate descriptions are rejected → are allowed | BUG-001 (AP-2475) not a bug — descriptions need not be unique | Ken Nguyen, ticket comment 2026-10-04 |
   ```

4. Keep the TC ID, title format, step count limit and every other rule in SKILL.md.

---

## 5. Propagate the clarification

| File | Change |
|---|---|
| Requirement capture `requirements/{KEY}-{SLUG}.md` | Append a dated blockquote under the acceptance criteria: _"Scope clarification — <date>, from <who>: <confirmed behaviour>."_ Never edit the transcribed text |
| Bug report `{KEY}_bug-report.md` | Mark the bug **Not a defect** with the reason and the TC change |
| `domain` source | If the confirmation states a business rule, follow the write-back rule in [../knowledge-sources.md](../knowledge-sources.md) §4 |
| Tracker | No write from this mode. `stlc-ticket-pipeline` s7 or `stlc-ticket-updater` reports it |

---

## 6. Hand back

Report one line per case — `<TC ID>: corrected (step N) | retired — <reason>` — and the
list of TC IDs now `Not Run`, so the caller can re-execute exactly those.
