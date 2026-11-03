# Bug Report — AP-1381

**Project:** Avantage Plus v2 — Dealer portal and Admin portal (Jira project AP)
**Report ID:** BR-20261101-001
**Test Cycle:** Test of AP-1381 "duplicate name visual" — the dealer's name shown once in the "To:" block of a dealer invoice, in the Dealer portal and the Admin portal (run folder `1.25.0`, the ticket's fix version)
**Date:** 2026-11-01
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/1.25.0/execution-log_AP-1381_2026-11-01.md and qa-artifacts/3-test-cases/AP1381_TestCases_001-004.md
**Tested on:** Dev (v2dev) — https://v2dev.garantieavantageplus.ca (the user's decision for this run, instead of Staging)

| Metric | Value |
|---|:---:|
| Total defects | 0 |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Tracker tickets created | 0 |

No test case failed, so there is nothing to report as a defect. Three cases passed: the
newest warranty invoice of dealer 1380 (invoice 934) names the dealer once in its "To:"
block, as "Offical VinhLe870@gmail.com", in both the Dealer portal (AP1381_001) and the
Admin portal (AP1381_002), and the company name "Test QA staging" is not shown as a second
name; the oldest invoice (65, created in 2020) still opens without an error (AP1381_004).
One case was SKIPPED by its own rule (AP1381_003): the Dealer portal invoice page offers no
PDF copy, only a "Print" button.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| — | — | No defects found in this run | — | — | — | — |

---

## Bug Details

None. No test case failed.

Gate C (the duplicate check before filing) was not applicable: the execution log has no
FAIL, so no bug search was made and no "file new", "comment on existing" or "not a bug"
decision was taken. Recorded by the independent reviewer in
qa-artifacts/7-reviews/AP-1381_review.md (R3, round 1, APPROVE, 2026-11-01T16:16:00Z).

**Skipped case — not a defect, not filed:**

| TC ID | Why it was skipped | What would bring it back |
|---|---|---|
| AP1381_003 | The Dealer portal invoice page `/invoice/934` has only "Back" and "Print" (the browser's print dialog); its step 2 says to record SKIPPED "no PDF copy offered" in that case | An answer to Q-003 (does the rule cover the PDF copy?). If the PDF is in scope, the case should be pointed at the Admin portal PDF as well (R3 finding F-2) |

**Observation outside the tested scope — not filed:**

On the Admin portal invoice page `/admin/invoice/934`, the "PDF" button leads to
`/admin/invoice/934/pdf`, which showed the French error page "Erreur — Désolé,
l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." The
execution log records it as HTTP 500 but does not say how the status code was read (the
screenshot shows only the error page). It was seen once, on Dev only, and was not retried.
No test case covers the Admin portal PDF, and whether AP-1381 covers the PDF at all is the
open Judgement question Q-003, so it is out of scope for this ticket and no bug is filed.
If Q-003 is answered "the PDF is in scope", retry it once and check it on Staging before
any bug is filed. Evidence:
`qa-artifacts/4-execution-results/screenshots/1.25.0/AP-1381/AP1381_003-obs-AdminInvoice934PdfHttp500.png`.

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 0 | — |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — Dealer portal invoice shows the dealer's name only once | 0 | — |
| REQ-002 — Admin portal invoice shows the dealer's name only once | 0 | — |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** 2026-11-01

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| — | AP-1381 | Story result comment 19443 posted (Tested on: Dev (v2dev); 4 TC rows; Q-002/Q-003; admin PDF HTTP 500 under "Observations that are not failures", attached to Q-003) and read back. Moved to Ready for release (pass rate 100%, 3 of 3; no bug; no Blocking question open) and assigned to Ken Nguyen (accountId 5ae11c42b076312e0e25c600); both read back | Ready for release | 2026-11-01T16:18:58Z |
