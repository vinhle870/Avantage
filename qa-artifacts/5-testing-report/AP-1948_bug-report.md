# Bug Report — AP-1948

**Project:** Avantage Plus v2 — Client portal and Admin portal (Jira project AP)
**Report ID:** BR-20261115-002 (replaces BR-20261115-001, which was written before Run 2)
**Test Cycle:** Story re-test of AP-1948 "CBI / CVE Tesla Price modification" — which warranty terms the Client portal quote request offers for a vehicle, and their price (run folder `1.39.0`, the ticket's fix version). Covers both sections of the execution log: the morning run (08:46–08:54Z) and Run 2 (09:54–09:59Z, AP1948_007 and AP1948_008)
**Date:** 2026-11-15
**Reported by:** QA Agent — Bug Reporter Skill (inside `stlc-ticket-pipeline`, qa-agent batch 2026-11-15)
**Source:** qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-15.md (both sections), qa-artifacts/3-test-cases/AP1948_TestCases_001-005.md and qa-artifacts/3-test-cases/AP1948_TestCases_006-009.md
**Environment:** Dev (v2dev) — https://v2dev.garantieavantageplus.ca/ (the registry's `execution_env`)

| Metric | Value |
|---|:---:|
| Total defects | 0 |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Tracker tickets created | 0 |
| Existing bugs commented on | 0 |

No test case failed, so there is nothing to file. Eight of nine cases passed. The price the
customer sees on the Summary page ("Subtotal") equals the program term's admin "Suggested retail
price", follows the term the customer picks and changes when admin changes it (AP1948_001, 002,
009). The terms offered for a Tesla follow the category set on its vehicle model (AP1948_004, 005,
006). For all four Tesla models, every offered term's Subtotal equals its suggested retail price
with nothing added — 24 term-and-model pairs compared (AP1948_007, 008). One case, AP1948_003, is
BLOCKED because there is no Stripe test card to pay with. A blocked case is not a defect: nothing
was seen to behave wrongly; the case could not be finished.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| — | — | No defects found in this run | — | — | — | — |

---

## Bug Details

None. No test case failed.

**Gate C: skipped — the execution log has no FAIL; no bug to file or link, s4c stays skipped**
(routing §3 Gate C skip condition). Decided by the independent reviewer: R3 round 2, APPROVE,
2026-11-15T10:05:27Z, recorded in qa-artifacts/7-reviews/AP-1948_review.md. No tracker search was
made and no "file new", "comment on existing" or "not a bug" decision was taken.

**Blocked case — not a defect, not filed:**

| TC ID | Why it is blocked | What unblocks it |
|---|---|---|
| AP1948_003 | Steps 1–2 passed (Summary shows term "AT 36m/60000km", Subtotal CA$1,025.00). "Continue with payment" opens a Stripe sandbox checkout (HTTP 200, no error) that asks for card details; neither `test-data` nor `env` holds a Stripe test card, so nothing was entered and steps 3–4 could not be run | Stripe sandbox test-card data in the `test-data` source |

**Observations — not defects, not filed.** Each is covered by an accepted answer or a stated
fact, or no customer-visible or saved value is wrong:

| Observation | Why it is not a defect |
|---|---|
| CVE terms are still offered on Dev — "CVE A" 122–126 for the Category A Model 3 / Model Y and "CVE B" 129–133 for the Category B Model S / Model X — although comment 19544 says the CVE program was disabled | Fact F-1: the reporter said CVE terms not being offered is not a FAIL; their still being offered is recorded for the reporter, not judged. Each set is offered only to its own category, as REQ-001 requires |
| Term 16 allows only GASOLINE and DIESEL, yet it is offered for electric (BEV) Teslas — fuel type does not filter the list | Q-010 Accepted (no Story or Task says fuel type must filter the Client portal list); the current behaviour is the expected one |
| Each hidden term radio on "Select Coverage" carries a `price` attribute that differs from the suggested retail price (term 16 = 625.00, term 129 = 0.00) | The customer never sees it; the price shown (Summary Subtotal) is correct for all 24 pairs. Whether the amount sent to Stripe could ever use this attribute is unverified while AP1948_003 is blocked — kept as a risk in the test report (R3 round 2 F-3), not filed |
| With no term for the vehicle's category, "Select Coverage" shows an empty list with no message; Continue answers "This value is not valid." (HTTP 422) | Q-004 Accepted: no Story or Task defines the empty state; a 422 validation answer is not an error page or 5xx |

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
| REQ-001 — Program terms filtered by vehicle model Category | 0 | — (AP1948_004–006 PASS) |
| REQ-002 — Term price equals the program term's suggested retail price | 0 | — (AP1948_001, 002, 009 PASS; AP1948_003 BLOCKED at the Stripe page) |
| REQ-003 — Tesla term price (Q-002 Accepted: suggested retail price, nothing added) | 0 | — (AP1948_007, 008 PASS) |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** 2026-11-01

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| — | AP-1948 | Story result comment 19442 posted (Tested on: Dev (v2dev); 9 TC rows; Q-001/Q-002 reminder) and read back. Not moved: pass rate 33% (needs 90%), Q-001 and Q-002 (Blocking) unanswered. Assignee unchanged | QC (unchanged) | 2026-11-01T15:55:29Z |
