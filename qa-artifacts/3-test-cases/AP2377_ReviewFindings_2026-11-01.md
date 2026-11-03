# Test Case Review — AP2377

**Date:** 2026-11-01
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2377_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2377_test-plan.md, qa-artifacts/3-test-cases/AP2377_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2377_TestCases_006-010.md; knowledge: `domain` (qa-docs — no file covers the customer portal), `navigation` (lists only the old per-customer link), `test-data`

**Standing caveat:** The ticket's acceptance criteria are real (six Given / When / Then
blocks), but three of them point at screenshots. The test cases rely on the capture's
word-for-word transcription of those screenshots. Neither `domain` nor `navigation` maps
the customer purchase flow `/customer/avantage-plus/buy`, so the field labels above "Market
Value*", the coverage-step controls and the admin warranty details route were designed
without verified knowledge; both batch files say so in their Execution Context and ask the
executor to record them. AP2377_010 is BLOCKED, so REQ-006 will stay unproven until a
staging test payment method is supplied.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | Test plan §2.2 says the summary's start date is "recorded, not judged" when a current-warranty end date is entered, but no case records the "Date de début" shown on the summary after a future current-warranty end date. | Test plan §2.2 (no REQ — the help text is not an acceptance criterion) | Low | A start date that ignores the customer's existing warranty would go unrecorded, so the author never sees it. |
| 2 | Test plan §1 objective 2 says the new order must work "in both directions a customer can move". Back navigation is used inside AP2377_004 and AP2377_007 only to re-read values; no case goes Back from Client Info to the Vehicle step and checks the step and values there. | Test plan §1 (no REQ) | Medium | A "Back" button that skips the Vehicle step or wipes its values after the re-ordering. |

Every requirement and acceptance criterion has at least one test case: REQ-001 (AP2377_001,
002, 004), REQ-002 (003), REQ-003 (002, 005, 007), REQ-004 (006), REQ-005 (008, 009),
REQ-006 (010, BLOCKED). No expected result was found asserting something the capture does
not say: the one candidate — "FORM-L25" being a link, inferred from its colour in A2 — had
already been made record-only in AP2377_005 step 3.

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None.

**Unresolved Open Questions affecting coverage:**
- Q-001 (Judgement) — still open; AP2377_004 records what the build does with empty or unusual current-warranty values instead of judging it.
- Q-002 (Judgement) — still open; AP2377_002 records the French labels of the new fields.
- Q-003 (Judgement) — still open; AP2377_006 records which step follows Coverage.
- Q-004 (Judgement) — still open; AP2377_007 records whether the FORM L25 box is required.
- Q-005 (Judgement) — still open; AP2377_002 and AP2377_005 record the French checkbox text and the link target.
- Q-006 (Info) — still open; the cases follow the written label "Get rates now", not the mock-up's "Continue".
- Q-007 (Judgement) — still open; AP2377_009 and AP2377_010 record how a NO answer and the admin wording appear.
- Q-008 (Info) — still open; the old per-customer portal is out of scope.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| P2-1 | Changing the air-suspension answer from Oui to Non (via "Back" or "Éditer") removes the OUI line from the summary | State transition | A customer who changes their mind is still shown — and may be charged — a surcharge they declined. Priority High because it touches what the customer pays and changing an answer is an everyday action. | High |
| P2-2 | "Back" from the Client Info step returns to the Vehicle step with VIN, mileage, market value and the three current-warranty values kept | State transition | After the re-ordering, Back could lead to the wrong step or wipe the vehicle data, forcing the customer to retype it (also Pass 1 gap 2). Medium: annoying and costs sales, but no wrong data is saved. | Medium |
| P2-3 | "Éditer" beside "Information du propriétaire" on the summary opens Client Info, and moving on from there does not skip Coverage or lose the chosen program | State transition | The edit links were built for the old order; one may now send the customer to the wrong step or drop their coverage choice. Medium for the same reason as P2-2. | Medium |
| P2-4 | Opening the Coverage step's URL directly, without passing Client Info, does not show rates without the FORM L25 confirmation | Security | A customer could get prices — and buy — without the consent the ticket adds. Medium: needs a deliberate URL edit, but it bypasses a legal confirmation. | Medium |
| P2-5 | The current-warranty values typed at the Vehicle step are still present when the customer comes back to it from Coverage | Cross-entity | Values silently dropped between steps would never reach the contract, so the existing-warranty information the ticket adds is lost. Medium: the purchase still completes. | Medium |
| P2-6 | A client with an Ontario address still sees the FORM L25 checkbox | Equivalence partitioning | If the checkbox were wrongly tied to the province, customers outside Quebec would get no consent prompt, or the reverse; the ticket puts no condition on it. Medium. | Medium |
| P2-7 | Switching English ↔ Français on the Client Info step keeps the client details and the checkbox state | Error guessing | A language switch that reloads the page empty makes bilingual customers retype everything. Low: a workaround exists. | Low |
| P2-8 | Double-clicking "Get rates now" creates only one purchase and one client record | Error guessing | Duplicate client or quote records on staging and in reports. Low: no money moves at this step. | Low |
| P2-9 | The new fields and the FORM L25 checkbox are usable at phone width (390 × 844) | Equivalence partitioning | On a phone, the long consent text or the new section could overflow and hide the button. Low: the ticket's mock-ups are desktop only. | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |
| Cross-entity | Check that what this feature produces is read correctly by the next feature in the workflow. |

No candidates were dropped; nine are listed.

---

## Recommendation

The ten cases cover every acceptance criterion, keep every Judgement question
record-only, and block the one case that cannot run (AP2377_010, payment). They are ready
for execution once P2-1 is promoted: it is the only High-priority proposal, because a
customer changing the surcharge answer is common and a stale YES on the summary is
something they would pay for. P2-2 and P2-3 (Back and Éditer after the re-ordering) are the
next most valuable and are worth adding if the run has time; they also close Pass 1 gap 2.
Before execution, the team should supply a staging test payment method so REQ-006 can be
proven.
