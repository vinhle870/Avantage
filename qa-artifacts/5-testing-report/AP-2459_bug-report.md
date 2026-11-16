# Bug Report

**Project:** AP (Avantage)
**Report ID:** BR-20261108-001
**Test Cycle:** AP-2459 bug re-test — "Permaplate contract generation returns HTTP 500 when Financing company is left unselected" — run folder no-sprint
**Date:** 2026-11-08
**Reported by:** QA Agent — Bug Reporter Skill (stlc-worker, QA batch)
**Source:** qa-artifacts/3-test-cases/AP2459_TestCases_001-003.md — Execution Log qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2459_2026-11-08.md
**Environment:** Dev (https://v2dev.garantieavantageplus.ca)

| Metric | Value |
|---|:---:|
| Total defects | 0 |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Tracker tickets created | 0 |

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| — | — | No defects. 2 of the 3 test cases passed on Dev, none failed and none was blocked, so there is nothing to file. | — | — | — | — |

**Gate C decision (applied by reviewer):** skipped — the execution log has no FAIL
(routing.md §3 Gate C skip clause), decided by the independent qa-reviewer (R3 round 1,
APPROVE, 2026-11-08T03:14:45Z). There is no "Not a bug" (C1) decision, so correct-cases was
skipped. No new ticket was filed and nothing was recorded against AP-2459 as a failure.

**The case that did not pass is not a defect.** AP2459_003 (the PDF of a contract created
with no financing company) is SKIPPED by its own step 2 rule: the build now refuses a blank
financing company with a message beside the field, so a contract without a financing
company cannot be created on this build, and there is no such PDF to download.

---

## Bug Details

None. No test case failed.

**Observation that belongs to an existing bug — AP-2512 (High, Backlog, open).** Outside
every test-case step, opening the PDF of the contract this run created with a financing
company (PNA-0000000021, quote 6690, financing company "AutoCapital Canada",
`GET /quote/6690/permaplate-contract-download`) returned HTTP 500 and the French
"Erreur — Désolé, l'application éprouve des difficultés techniques" page. AP-2512 already
reports that same route returning that same error page, so no new bug is filed (the
reviewer confirmed it would be a duplicate). Evidence:
`qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2459/Observation-Quote6690PdfDownload500-AP2512_blocked.png`
and `AP2459_002-AP2459_003-network.txt` (method, URL and status only).

**Prepared comment for AP-2512 (R3 finding F-2, optional — to be posted at update-ticket,
through `tracker-manage-child-ticket`, after the Gate D review).** AP-2512's step 5 says to
leave "Financing company" on "Choose", which Dev now refuses, so its steps no longer
produce a contract. Text, in Jira wiki markup:

```
h3. QA note — still reproduces on Dev · 2026-11-08

Still reproduces on *Dev* on 2026-11-08: opening the PDF of contract *PNA-0000000021* (quote 6690, financing company "AutoCapital Canada") at {{/quote/6690/permaplate-contract-download}} returns HTTP 500 with the "Erreur — Désolé, l'application éprouve des difficultés techniques" page.

*Change to step 5 of the Steps to Reproduce:* Dev now refuses a blank financing company ("This value should not be blank." above the field — see AP-2459), so in step 5 a financing company must be chosen (for example "AutoCapital Canada") for the contract to be generated.

Found during the AP-2459 re-test; no AP-2459 test case depends on it.
```

**Observation that is not a defect — the Financing company label (R3 finding F-1).** The
ticket's Notes say _"The field is genuinely optional in the markup, so a dealer has no way
to know they must set it."_ On Dev the server now refuses a blank financing company, but
the "Financing company" label still carries no "*" (the required-field marker every other
required field on the form has). No AP-2459 step judges the marker, so it changes no
result; it is reported in the test report and the update-ticket comment for the author to
decide whether it needs a ticket.

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
| AP-2459 — generating an Esthetic protection (Permaplate) contract with Financing company left on "Choose" no longer returns HTTP 500: either the contract is created, or the form refuses it with a message beside the field | 0 | — |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** 2026-11-08

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| — (re-tested bug) | AP-2459 | Bug re-test comment posted (Re-test PASSED, comment 19518); status moved per Gate D §3.2 All PASS, approved by qa-reviewer R4 round 1; no assignee change | Done (read back) | 2026-11-08T03:20Z |
| — (related bug) | AP-2512 | Prepared comment posted unchanged (comment 19519), R3 F-2 / R4 | Backlog (unchanged, read back) | 2026-11-08T03:20Z |
