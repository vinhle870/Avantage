# Test Case Review — AP2477

**Date:** 2026-10-12
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2477_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2477_test-plan.md, qa-artifacts/3-test-cases/AP2477_TestCases_001-005.md, AP2477_TestCases_006-010.md, AP2477_TestCases_011-012.md

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

All seven requirements trace to at least one test case. Each of the ticket's four
Given/When/Then blocks has a case that saves and reads back, so this is real coverage,
not a smoke check. Three gaps remain.

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | REQ-006 AC 1: "editing a vehicle from the quote details page keeps the current full form" has no case. AP2477_004 and AP2477_008 open that form but only read values. They do not confirm the full field set is still there. | REQ-006 AC 1 (Assumptions) | Medium | The quote-side vehicle edit form could also have been shrunk, and dealers could never add kilometres or price to a quote afterwards. |
| 2 | The ticket says decoding is **ignored when a Brand is already chosen** (Tech approach item 4). The cases avoid this path instead of checking it. | REQ-003 risk | Low | If the guard was removed, decoding over a chosen Brand could produce mixed data; if it behaves as designed, dealers need to know. Either way it is not recorded. |
| 3 | The Year rule (`checkYear()`) is listed as a risk (Q-005) but no case tries an out-of-range year. | REQ-004 risk, Q-005 | Low | A year such as 1800 or 3000 could save and break vehicle-age warranty rules. |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every case cites REQ-001 to REQ-007 or an open question in the analysis.

**Unresolved Open Questions affecting coverage:**
- Q-001: whether the decoder is configured on staging. AP2477_007–009 become BLOCKED if it is not, which would leave REQ-003 and REQ-007 unproven.
- Q-002: what warranty does with empty kilometres or condition. AP2477_012 records the behaviour; whatever it shows is judged only for "no error page".
- Q-003: required markers. AP2477_002 follows the Assumptions over the mockup.
- Q-004, Q-005, Q-006: recorded as observations in AP2477_009, Pass 1 gap 3, and AP2477_010.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | The window sticker for a vehicle saved from the minimal form (no price) opens without an error | Cross-entity | The ticket itself flags `WindowStickerPdf` calling `number_format(getPrice())`. On a null price, that crashes the window sticker the dealer prints for the car. | High |
| 2 | Editing the vehicle of a minimal quote from the quote details page still shows the full form and can add kilometres and price | State transition | Covers Pass 1 gap 1. Without it, a dealer cannot complete the vehicle data the minimal form left out, so later warranty pricing stays impossible. | Medium |
| 3 | A refused save after decoding (Year cleared) keeps the decoded hidden details once Year is fixed and the quote is saved | State transition | The re-rendered error page may drop the hidden decoded inputs, so the saved vehicle silently loses transmission, fuel and engine data. | Medium |
| 4 | "Décoder" with an invalid VIN (e.g. `12345`) shows a clear message and keeps what the dealer typed | Error guessing | A bad VIN could blank the form or show an error page, losing the dealer's Quote name and choices. | Medium |
| 5 | Year `1800`, `3000` and next year + 1 are refused or accepted per the Year rule | Boundary value analysis | Covers Pass 1 gap 3. An absurd year saved on a vehicle breaks age-based warranty eligibility. | Medium |
| 6 | Decoding after choosing a Brand leaves the chosen Brand and fills nothing (the documented guard) | State transition | Covers Pass 1 gap 2. Confirms the by-design behaviour, or catches mixed data if the guard changed. | Low |
| 7 | Double-clicking "Sauvegarder" creates only one quote | Error guessing | Two identical quotes for one vehicle, which the dealer cannot delete. | Low |
| 8 | A 255-character Quote name with accents (é, à) saves and displays intact | Boundary value analysis | The quote name could be truncated, crash the save, or display garbled text. | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Cross-entity | Check that what this feature produces is read correctly by the next feature in the workflow. |

Two other candidates were dropped. The piece-protection vehicle forms were left out because no route is mapped and the plan puts them out of scope. A direct database check of the NULL columns was left out because the QA agent has no database access.

---

## Recommendation

The twelve designed cases are ready to execute. They cover every acceptance criterion,
the decoder round trip and its persistence, the two negative paths and a downstream
smoke check. One proposal is High priority: **#1, the window sticker on a vehicle with
no price**. The ticket itself names it as a likely crash, and it sits one click away from
the screens already being tested. Promote it before execution if you want the downstream
risk covered in this cycle. **#2** (the quote-side vehicle edit form keeps its full
fields) is the next most valuable, because it closes the only acceptance-level gap in
Pass 1.
