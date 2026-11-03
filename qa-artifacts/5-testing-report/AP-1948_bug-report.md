# Bug Report — AP-1948

**Project:** Avantage Plus v2 — Client portal and Admin portal (Jira project AP)
**Report ID:** BR-20261101-001
**Test Cycle:** Story test of AP-1948 "CBI / CVE Tesla Price modification" — warranty terms offered on the Client portal quote request and their price (run folder `1.39.0`, the ticket's fix version)
**Date:** 2026-11-01
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-01.md (including *Re-run after review R3*), qa-artifacts/3-test-cases/AP1948_TestCases_001-005.md and qa-artifacts/3-test-cases/AP1948_TestCases_006-009.md
**Tested on:** Dev (v2dev) — https://v2dev.garantieavantageplus.ca/ (the user's decision for this batch, instead of staging)

| Metric | Value |
|---|:---:|
| Total defects | 0 |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Tracker tickets created | 0 |

No test case failed, so there is nothing to report as a defect. Three cases passed: the price
the customer sees on the Summary page ("Subtotal") equals the program term's "Suggested retail
price" in admin, it follows the term the customer picks, and it changes on the next page load
when the admin changes that price (AP1948_001, 002, 009). Six cases are BLOCKED, and a blocked
case is not a product defect: nothing in the build was seen to behave wrongly — the cases could
not be judged at all. Their reasons are listed below so nobody files them as bugs later.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| — | — | No defects found in this run | — | — | — | — |

---

## Bug Details

None. No test case failed.

Gate C (the duplicate check before filing) was not applicable: the execution log has no FAIL,
so no bug search was made and no "file new", "comment on existing" or "not a bug" decision was
taken. Recorded by the independent reviewer in qa-artifacts/7-reviews/AP-1948_review.md (R3,
round 2, APPROVE, 2026-11-01T15:50:59Z).

**Blocked cases — not defects, not filed:**

| TC ID | Why it is blocked | What unblocks it |
|---|---|---|
| AP1948_003 | Steps 1–2 passed (the Summary page shows back the chosen term "AT 36m/60000km" and Subtotal CA$1,025.00). Pressing "Continue with payment" opens a Stripe sandbox checkout that asks for card details; the test data has no payment details, so nothing was entered and steps 3–4 could not be run. The server answered HTTP 302, not an error | Stripe sandbox test-card data in the `test-data` source, or a test-case revision that ends "submit" at the Summary page |
| AP1948_004, 005, 006 | Q-001 is unanswered: which vehicle models are in Category A, B and C, and where a model's category is set. Without it no one can say which terms *should* be offered | The author's answer to Q-001 on AP-1948 (asked in comment 19432) |
| AP1948_007, 008 | Q-002 is unanswered: whether the "Original ask" Tesla figures (2500$–2900$ plus 200$ / 800$) still apply, and to which terms | The author's answer to Q-002 on AP-1948 (asked in comment 19432) |

Observations recorded for the open Judgement questions are not defects either: the price is
shown only on the Summary page, not on the term cards (Q-006), and as "CA$1,025.00" while admin
stores the plain number 1025 (Q-005). They are listed in the test report.

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
| REQ-001 — Program terms filtered by vehicle model Category | 0 | — (not judged: Q-001 open) |
| REQ-002 — Term price equals the program term's suggested retail price | 0 | — |
| REQ-003 — Tesla pricing figures from the "Original ask" | 0 | — (not judged: Q-002 open) |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** 2026-11-01

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| — | AP-1948 | Story result comment 19442 posted (Tested on: Dev (v2dev); 9 TC rows; Q-001/Q-002 reminder) and read back. Not moved: pass rate 33% (needs 90%), Q-001 and Q-002 (Blocking) unanswered. Assignee unchanged | QC (unchanged) | 2026-11-01T15:55:29Z |
