# Bug Report

**Project:** Avantage Plus v2 — Admin portal, AP-2474: Earning Assignment
**Report ID:** BR-20261004-002
**Test Cycle:** AP-2474 single-ticket STLC run, run folder 5.2.0 — 18 test cases executed on v2staging on 2026-10-04
**Date:** 2026-10-04
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md · qa-artifacts/3-test-cases/AP2474_TestCases_*.md

| Metric | Value |
|---|:---:|
| Total defects | 1 |
| Critical | 0 |
| High | 0 |
| Medium | 1 |
| Low | 0 |
| Tracker tickets created | 1 |

**Gate C decisions (by the QA, 2026-10-04):**
- **AP2474_006**, the only FAIL, is filed as a new bug (BUG-001). The open bug AP-2478 is the same kind of fault (an empty select crashes the server), but on a different screen and form (Earning Groups → Assign curve), so it needs its own fix and its own re-test.
- **Not filed — observations for the product owner (open questions, not defects):** a second assignment for the same earning set and dealer group saves without warning (AP2474_007, Q-002); inverted from/to ranges save without warning (AP2474_012, Q-006); an identical parameter saves as a second row (AP2474_016, Q-011). The ticket defines none of these rules.
- **Not filed from this run:** a parallel AP-2475 run reported that the Earning Assignment details page returns HTTP 500 once an assignment holds 11 parameters. No AP-2474 case added more than two parameters, so this run neither reproduced nor ruled it out. It is left to the AP-2475 bug review.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2474_006 | Saving a new earning assignment with no Earning Set or no Dealer Group chosen shows an HTTP 500 error page | Medium | P2 | [AP-2482](https://garantieavantageplus.atlassian.net/browse/AP-2482) | Open |

---

## Bug Details

---

### BUG-001 — Saving a new earning assignment with no Earning Set or no Dealer Group chosen shows an HTTP 500 error page

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2474_006 |
| **Requirement** | REQ-003 — Create New form (modal) |
| **Severity** | Medium — the admin hits a crash page with no explanation and loses the description they typed, but nothing is saved or damaged and the save works once a value is chosen |
| **Priority** | P2 |
| **Environment** | Chromium (Playwright) · Windows 11 · v2staging (`https://v2staging.garantieavantageplus.ca`) · build not exposed (Staging deployment 2026-10-01) |
| **Tracker Ticket** | [AP-2482](https://garantieavantageplus.atlassian.net/browse/AP-2482) — Relates to AP-2474; assigned to Ken Nguyen; labels qa-agent, stlc-automated; both screenshots embedded in the description (verified: 2 media nodes resolved) |
| **Status** | Open |
| **First found** | 2026-10-04 |
| **Reproducibility** | Always (3/3 attempts: 2 with Earning Set empty, 1 with Dealer Group empty) |

**Summary:**
In the admin "Create New" earning assignment form, clicking "Save" while "Earning Set" or "Dealer Group" is left on its "Choose" option returns an HTTP 500 server error page instead of a validation message.

**Steps to Reproduce:**

1. Open `https://v2staging.garantieavantageplus.ca/admin/login`, enter "Courriel" `vinhle870@gmail.com` and "Mot de passe" (the QA admin account), and click "Se connecter".
2. Open `/admin/earning-assignment` (sidebar: Risk Management → Earning Assignments) and click "Create New". The "Create earning assignment" form opens in a modal.
3. Enter Description `Bug500-repro`, leave "Earning Set" on "Choose", choose "Dealer Group" "Group A", leave "Is Enabled?" ticked, and click "Save".
4. Observe the error page. Then repeat steps 2–3 with "Earning Set" "Profit" and "Dealer Group" left on "Choose", and click "Save".

**Expected Result:**
The form is refused with a validation message next to the empty field, for example "This value should not be blank.", which is how the same form already treats a blank Description. The admin keeps what they typed and nothing is saved. The ticket does not define this case, so this is the reasonable expectation rather than a written criterion.

**Actual Result:**
Both times the browser shows, at `/admin/earning-assignment/new/edit`, an HTTP 500 page reading "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." No assignment is created; the list is unchanged afterwards. Both selects offer the empty "Choose" option (value ""), so an admin can easily reach this state.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_006-step2-fail.png` — HTTP 500 "Erreur" page after saving with Earning Set on "Choose" |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_006-step3-fail.png` — the same HTTP 500 page after saving with Dealer Group on "Choose" |
| Console log | None captured |

**Suggested Root Cause:**
The `earningSet` and `dealerGroup` relations are probably not marked as required (no NotBlank / NotNull constraint), so the empty value reaches the database or an entity getter and throws. The Earning Groups assign form has the same pattern (AP-2478).

**Notes:**
Same class of defect as AP-2478 (Earning Groups: "Assign" with no curve selected → HTTP 500), but on a different form; fixing one does not fix the other. Found by AP2474_006 in the AP-2474 run of 2026-10-04.

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 1 | AP2474_006 |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-003 — Create New form (modal) | 1 | BUG-001 |
| REQ-001, REQ-002, REQ-004 to REQ-007 | 0 | — |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** _(filled by updater)_

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2482 | Created by stlc-bug-reporter (Backlog, Medium, assigned Ken Nguyen) | Backlog | 2026-10-04 |
