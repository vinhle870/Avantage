# Output Style — Plain-Language Rules for QA Artifacts

Applies to every artifact written into `qa-artifacts/` by an STLC skill.
Read this before writing any output document.

The reader is not always a QA engineer. A product owner, a developer joining
mid-sprint, or a manager scanning for risk must be able to read these files and
know what happened without asking a follow-up question.

**Structure is not the target of this rule.** Keep every table, heading, ID
scheme, and checklist exactly as the skill's `template.md` defines it. Change
only the *words inside* them.

---

## The seven rules

### 1. Write full sentences in prose fields

Summary, Expected Result, Actual Result, Recommendation, Notes and any field
whose value is a description get a complete sentence with a subject and a verb.

| Don't | Do |
|---|---|
| `Save fails on unusual TLD` | `The Save Changes button does nothing when the email address ends in an uncommon domain such as .museum.` |
| `AC not testable` | `This acceptance criterion cannot be tested as written because it does not say what the user should see when the upload succeeds.` |

**Narrow index cells are the one exception.** A cell in a scan-at-a-glance table
whose whole job is to label a row — the `Comment` column of the Summary Report,
a one-line bug title, a `Reason` cell in a Skipped table — may be a compressed
phrase instead of a sentence, and the skill's own `template.md` may cap its
length. The exception covers only cells whose template caps them; it never
covers Summary, Expected Result, Actual Result, Recommendation or Notes, and it
never licenses dropping the reason (rule 3) or the real button and field names
(rule 5). `BUG-002: Terrain section absent from the Property page` is a good
compressed cell. `Failed` is not.

### 2. Gloss a technical term the first time it appears in a file

Name the term, then explain it in the same breath. Do not drop the term — it is
what ties the finding back to standard practice — and do not gloss it again
later in the same file.

> Boundary value analysis (testing the exact edges of an allowed range, where
> off-by-one mistakes hide) shows no case covering a room booked to its exact
> capacity.

Terms that always need a gloss on first use: equivalence partitioning, boundary
value analysis, decision table, state transition, error guessing, regression,
smoke test, entry/exit criteria, traceability.

### 3. Say what a reader would actually ask

Every severity, priority, risk rating and go/no-go verdict is followed by the
reason for it. A rating with no reason is an assertion the reader cannot check.

| Don't | Do |
|---|---|
| `Severity: High` | `Severity: High — the user loses everything they typed, and there is no way to recover it.` |
| `Testability: MEDIUM` | `Testability: Medium — most requirements are clear, but two have no acceptance criteria, so we cannot yet prove they work.` |

### 4. Prefer the everyday word

| Instead of | Write |
|---|---|
| utilise, leverage | use |
| performs validation of | checks |
| is not able to be verified | cannot be tested |
| navigate to | open, go to |
| the system shall display | the page shows |
| defect was observed to occur | the bug happened |

### 5. Name real things, not placeholders

Refer to the button label, field name, page title and value the user actually
sees. `Click the blue Submit button at the bottom of the Checkout page` beats
`Click the submit control`. Never ship a `{{PLACEHOLDER}}` token in a finished
artifact — if the value is genuinely unknown, write `Not known` and say why.

### 6. State the consequence, not just the observation

Anyone reading a finding wants to know whether it matters. End a finding with
what a real user or the business loses if it ships.

> The booking counter does not decrease when a booking is cancelled. The room
> then looks fully booked when it is actually free, so customers are turned
> away from a room nobody is using.

### 7. Be honest in plain words

If coverage is thin, if the real acceptance criteria could not be retrieved, or
if a result is uncertain, say so in a sentence a non-specialist understands.
Never let a limitation hide behind a formal phrase.

| Don't | Do |
|---|---|
| `Coverage: partial pending AC confirmation` | `We could not get the real acceptance criteria for this ticket, so these tests only confirm the screen loads. They do not prove the feature works correctly.` |

---

## What not to change

- Table columns, headings, and section order from `template.md`
- ID formats: `REQ-001`, `FR9_001`, `BUG-001`, `Q-001`, `TC-002`
- Status vocabulary: `Pass`, `Fail`, `Blocked`, `Not Run`, `Open`, `Closed`
- Severity and priority scales: `Critical / High / Medium / Low`, `P1`–`P4`
- File paths, screenshot names, and tracker ticket links

These are read by other skills and by humans scanning for a known token.
Rewriting them breaks the pipeline.

---

## Self-check before writing any artifact

- [ ] Every prose field is a full sentence, not a fragment (capped index cells excepted)
- [ ] Every technical term is glossed on first use in this file
- [ ] Every severity, priority and verdict states its reason
- [ ] Every finding says what the user or business loses
- [ ] No `{{PLACEHOLDER}}` tokens remain
- [ ] Buttons, fields and pages are named as they appear on screen
- [ ] Any gap or uncertainty is stated plainly, not softened
- [ ] Table structure and IDs are unchanged from `template.md`
