# Test Case Review — AP2505

**Date:** 2026-11-03
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2505_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2505_test-plan.md, qa-artifacts/3-test-cases/AP2505_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2505_TestCases_006-010.md; knowledge sources `domain` (quote-creation.md — Dev "Summary of products" and ⋯ menus, Dev add-roadside-protection modal after AP-2498, Esthetic protection contract form, extended-warranty contract page after AP-2503, roadside contract details page and list), `navigation` (navigation-map.md), `test-data` (test-centralized.md); tracker bugs AP-2508 and AP-2518

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

Every requirement and acceptance criterion has at least one test case: REQ-001 (AC 1 and
the description's "dedicated page (no modal)" and unchanged route) → AP2505_001, with the
no-GAP variant in AP2505_002 and the after-contract state in AP2505_010; REQ-002 (AC 2 and
the description's two-column card) → AP2505_003 for the points both sources agree on and
AP2505_004 (BLOCKED on Q-001) for the vehicle section's column; REQ-003 (AC 3 pre-fill and
read-only financing) → AP2505_005, with the no-financing variant in AP2505_006; REQ-004
(AC 4 submit, and "Contract creation, invoice, financing, and PDF behaviour stay
unchanged") → AP2505_007 (creation, invoice recorded), AP2505_008 (PDF), AP2505_009
(invalid value). No expected result was found asserting something the capture does not
say: AC 1's "in the same tab" is judged only in AP2505_001, whose quote is built exactly as
AC 1's given clause states; every point resting on an open Judgement question (Q-002 –
Q-010) is written as record-only; the disputed vehicle column is BLOCKED; and the
post-submit checks judge only the outcomes `domain` already records for roadside
contracts (a row on `/road-side-protection-contracts`, a details page with PDF links).

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| — | None found | — | — | — |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None.

**Known-bug handling checked:** every case states how AP-2518 (HTTP 500 on this address on
Dev) and AP-2508 (roadside product form) affect it — a FAIL where opening the page is the
step under test (AP2505_001, _002, and _006 only when the fault is specific to the missing
financing), BLOCKED where it is setup (AP2505_003 – _005, _007 – _010).

**Unresolved Open Questions affecting coverage:**
- Q-001 (Blocking) — which column holds "Vehicle identification". AP2505_004 is BLOCKED; AP2505_003 records the column. **REQ-002 is not fully covered until the author answers, and the story cannot be released while it is open.**
- Q-002 — whether the action needs a GAP quote; AP2505_002 records the menu without a GAP quote.
- Q-003 — what "match Esthetic Protection" covers beyond the named points; AP2505_003 records differences.
- Q-004 — what the Program Summary lists for roadside; AP2505_003 records every line. **No case judges the Program Summary's values**, because the capture names none.
- Q-005, Q-007 — editable vehicle/owner fields and which financing values are meant; AP2505_005 records both and judges every financing value shown as read-only.
- Q-006 — the page without a financing; AP2505_006 records it.
- Q-008 — what "valid form values" excludes; AP2505_009 records the response.
- Q-009 — what "the current process" produces after submit; AP2505_007 records the landing page, message and invoice. **The "invoice … behaviour stays unchanged" sentence is therefore proven only as far as the invoice is recorded, not judged.**
- Q-010 — behaviour once the contract exists or for a VIN with a contract; AP2505_007 and AP2505_010 record it.
- Q-011, Q-012 (Info) — the route name in brackets; whether AP-2518 is fixed by this change. Neither changes a result.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

These are what a senior tester would add, not confirmed requirements.

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | When the roadside modal holds a different Make/Model/Year from the inventory vehicle, the contract page shows the values the roadside product was priced on, and the contract carries them | Cross-entity | `domain` (AP-2498) records that the roadside program's VIN/Make/Model/Year can differ from the vehicle's and "the RSP values win". A page that pre-fills from the vehicle instead would put a vehicle on the AutoShield contract that the price was not quoted for. Medium, not High, because the capture does not say which source the pre-fill uses, so the result could only be recorded | Medium |
| 2 | Double-clicking "Generate Contract" creates one AutoShield contract and one invoice, not two | Error guessing | The submit now sits on a full page and calls an outside service that takes seconds; a lost double-submit guard bills the client twice | Medium |
| 3 | Opening the contract address for a quote with no roadside product shows a clear message, not HTTP 500 | Error guessing | The address is bookmarkable; `domain` records the Esthetic protection page redirecting with "Please create a quote first" in the same state, while the quote entry already crashes with HTTP 500 elsewhere | Medium |
| 4 | Another dealer's quote id in the contract address does not show that dealer's client data | Security | A page reachable by address could leak another dealer's client name, address and phone. Needs a second dealer's quote id, which `test-data` does not supply on Dev | Medium |
| 5 | The page opened on an archived quote does not let a contract be generated, or says why | State transition | `domain` records that an archived quote still offers Delete on its products; it may also still offer Generate Contract, creating a contract on a quote the dealer closed | Low |
| 6 | Owner details changed on the page (if editable) are what the AutoShield contract and its PDF show | Cross-entity | If owner fields are editable (Q-005) but the contract is built from the quote's client, the PDF carries the old details | Low |
| 7 | Browser Back after a successful submit, then resubmit, does not create a second contract | State transition | A cached form resubmitted from history is a common duplicate-contract path | Low |
| 8 | The page in French (`?_locale=fr`) shows translated section headings and button | Equivalence partitioning | A new page often ships with untranslated labels; the dealer portal is used in French in Québec | Low |
| 9 | At a narrow width (390 px) the two columns stack without hiding the "Generate Contract" button | Boundary value analysis | A two-column card can push the button off-screen on a tablet or phone | Low |

No proposal is rated High: each one either rests on a point the capture does not state
(so it could only record a result) or repeats a risk the existing cases already reach
through a different path.

---

## Summary

| Pass | Findings |
|---|---|
| Pass 1 — gaps citing a REQ/AC | 0 |
| Pass 1 — orphan references | 0 |
| Pass 2 — proposals | 9 (0 High, 4 Medium, 5 Low) |
