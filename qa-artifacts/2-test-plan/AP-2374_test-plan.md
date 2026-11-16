# Test Plan

**Plan ID:** TP-20261115-001 (replaces TP-20261101-001)
**Project:** Avantage Plus v2 — AP-2374 Status Change email notification: Add notify email and client email
**Version:** 2.0
**Date:** 2026-11-15 (version 1.0: 2026-11-01)
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2374_requirements-analysis.md (re-run 2026-11-15, Gate A rule A3 by reviewer)
**Total requirements:** 5 (REQ-001 – REQ-005)

**Why version 2.0.** The 2026-11-15 knowledge lookup answered the two questions that blocked
testing on 2026-11-01. The claim's notify email (Q-010) is set through the Admin API, not a
form, so the recipient-list tests can now run on a claim created through that API. The
message wording (Q-001) is accepted except for the sentence the acceptance criterion itself
states, so the message test can now give a verdict. No question is Open. This version
re-plans the five cases that were BLOCKED (AP2374_002–006) and turns every *record-only*
expectation on an Accepted question into *record-and-accept* — the observed value becomes
the expected value. Cases whose expected result does not change keep their 2026-11-01
result.

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify that the admin **Change status** form shows a *Notify by email* checkbox and a *Recipient email(s)* field, and that the field is pre-filled with the claim's notify email and the contract's client email, separated by a comma (REQ-001, REQ-002) — on more than one target status, including the approval decision that AP-2357 ties the notify email to.
2. Prove that submitting the form with the box ticked delivers the email to **both** listed recipients, for at least two different target statuses (REQ-003; the reporter asked on 2025-12-18 for "multiple emails" and "all statuses").
3. Judge the message against the acceptance criterion's sentence "The claim ID … has been updated to status …", accepting whichever claim number and status label the build fills in (REQ-004, Q-001 Accepted).
4. Check that the email carries the claim's attached file and a PDF of the claim details page whose content follows AP-2387 (REQ-005, Q-009 Answered).
5. Re-check the two bugs raised against this story — AP-2382 (email not received) and AP-2392 (message text missing) — and bug AP-2509 (checkbox missing on most status forms, open) where a case touches it.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | *Notify by email* checkbox on the Change status form | Functional, UI, Regression |
| REQ-002 | Recipient field pre-filled with `notify_email` + contract client email | Functional, Edge-case, Negative, UI |
| REQ-003 | Email sent to the recipient list on submit with the box ticked | Functional, Negative, Edge-case, Regression |
| REQ-004 | Message text — the AC sentence is required; its two values are accepted as built | Functional, Regression |
| REQ-005 | Attachments: claim files + claim details PDF (content per AP-2387) | Functional, Edge-case |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| The status change itself (which statuses exist, what each does to the claim) | The ticket adds only the notification; status changing existed before |
| Testing the Admin API `POST /api/admin/claim` | It belongs to AP-2357. Here it is **setup only** — the way to put a notify email on a claim. A failed call blocks the case; it is never this ticket's FAIL |
| Dealer-portal claim screens | The ticket is about the admin area. The dealer portal is used only to make the quote and contract |
| Email rendering across mail clients, spam scoring, delivery speed | Not stated; delivery is checked in one web inbox (Yopmail) |
| Performance, accessibility | Not recommended by the analysis |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Description | Responsible |
|---|---|---|
| System Testing | End-to-end: a claim made through the Admin API, the admin Change status form, the recipients' inboxes | QA Agent |
| Regression | AP-2382 and AP-2392 scenarios; AP-2509 observed where a case opens a status form | QA Agent |

A *regression* check is a re-run of something that worked or was fixed before, to catch it breaking again.

### 3.2 Test Types

| Type | Approach |
|---|---|
| Functional | Walk each acceptance criterion: create the claim, open Change status, check the controls, submit, read both inboxes |
| Negative | Box unticked (Q-007), invalid or empty recipient list (Q-004) — **record-and-accept**: the behaviour observed on 2026-11-01 is the expected result |
| Edge-case | Claim without a notify email (Q-003); claim without attachments (Q-008) — **record-and-accept** |
| Regression | Email received at all (AP-2382); AC sentence present (AP-2392) |
| UI | Checkbox and field labels match the ticket's wording — the AC wins over the build (Q-002: label not accepted) |

**How Accepted and Answered questions are used.** An *Answered* question (Q-009, Q-010) is
part of the requirement and is asserted like an acceptance criterion. An *Accepted* question
(Q-001–Q-008: no Story or Task defines it) is *record-and-accept*: the case asserts the value
the build showed on 2026-11-01, and fails only on an objective fault or where the AC text
says something different — the AC wins (Q-001 sentence, Q-002 label, Q-010 notify email in
the list).

### 3.3 Test Execution Method

All manual test cases are executed by **stlc-manual-executor** through the bound `browser`
provider — `playwright`, state `active` in `qa-artifacts/qa-config/tools.md` §1. The agent
drives the admin portal and opens the Yopmail inboxes in the same browser. The setup call to
the Admin API is made from the Git Bash shell with `curl`, loading the key from the repo-root
`/.env` without printing it (`qa-docs/admin-api.md` §4). Tracker work goes through the
`tracker` provider (`jira`, `active`). `notify` is `disabled` and not needed. Capability
groups needed: `tracker`, `browser`.

---

## 4. Entry Criteria

*Entry criteria* are the conditions that must hold before execution starts; if one is
missing, the affected cases are BLOCKED rather than run on a broken setup.

- [ ] Dev (`execution_env: Dev`) is reachable at the `env` source's Dev `BASE_URL` (`https://v2dev.garantieavantageplus.ca/`) and the admin login works.
- [ ] `AVP_ADMIN_API_KEY` is present in the repo-root `/.env` and valid on Dev. The key in use (app `QA-automation`) expires **2026-12-05**; after that date a new one must be created by the QA (`qa-docs/admin-api.md` §2). Without it AP2374_002–006 are BLOCKED "Admin API key missing or expired".
- [x] The admin Claims area is mapped (`qa-docs/claims.md`, Dev, 2026-11-01).
- [ ] Test cases reviewed (s3b) and Gate B decided.

## 5. Exit Criteria

*Exit criteria* are what must be true to call testing finished.

- [ ] Every test case has a status other than Not Run.
- [ ] Pass rate ≥ 90 % of cases (all except SKIPPED), per the registry's `story_pass_threshold`. The threshold is the team's release bar; below it the story stays in QC.
- [ ] No open Critical or High bug linked to this run.
- [ ] No Blocking question Open (none at plan time).
- [ ] `AP-2374_test-report.md` written.

## 6. Suspension & Resumption Criteria

### Suspend testing when:

- Dev or the admin login is unavailable (cases BLOCKED, not FAIL).
- The Admin API returns 401 for the key (expired or revoked) — AP2374_002–006 BLOCKED until the QA renews it.
- Yopmail cannot be reached, so delivery cannot be observed.

### Resume testing when:

- The environment, the key and the inbox service respond again.

---

## 7. Test Environment

| Component | Details |
|---|---|
| Environment | **Dev** — `execution_env` in `tools.md`; URLs from the `env` source, section "Dev Environment": `BASE_URL` `https://v2dev.garantieavantageplus.ca/`, admin login `/admin/login`, dealer login `/login` |
| Admin API | Same host. `POST /api/admin/claim` (JSON) and `POST /api/admin/claim-attachment` (multipart), header `X-API-KEY` = the value of `AVP_ADMIN_API_KEY` in `/.env` — the name only is written in artifacts, never the value |
| Browsers | Chromium (Playwright default), admin viewport 1280 × 800 |
| Mail | Public Yopmail inboxes `https://yopmail.com/en/?login=<name>` (`test-data`) |
| Bug tracker | `jira` (AP project) |
| Screenshot path | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Admin and dealer login | Shared Dev account | `env` → Dev Environment (never copied into an artifact) |
| Vehicle 915 | Dev Ford Focus 2008, VIN `1FAHP35NX8W239204`, one warranty term (20m/20000km) | Standing data (`test-data`) |
| Client email inbox | `client.stage.2374002@yopmail.com` — this run's client on the new contract | Typed when the quote's client is created |
| Notify email inbox | `client.stage.2374001@yopmail.com` — this run's claim `notifyEmail` | Sent in the Admin API create-claim call |
| Warranty contract | New contract on vehicle 915 for client `Marie Tremblay AP2374` with the client email above | Dealer: `/vehicle/915/details` → Create quote → client → Save → warranty → Save → Extended warranty ⋯ → Generate Contract |
| API claim | One claim on that contract, `notifyEmail` = `client.stage.2374001@yopmail.com` | `POST /api/admin/claim` (setup) |
| Claim attachment | `AP2374-attachment.png` (a small PNG made from a run screenshot) | AP2374_006 only: admin Add attachment, one try; on HTTP 500, one try through `POST /api/admin/claim-attachment` |
| Kept 2026-11-01 data | Contract `26df1-844`, claims 331 (no notify email) and 332, inbox `client.stage.931` | Used only by the kept results of AP2374_001, 007–010; not re-used by the re-run cases |

### 8.1 Test Data Classification

_Decided once here, and inherited by every test case._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Admin / dealer login | Static | None applied | Named in Execution Context, resolved from `env` (Dev) |
| Vehicle 915 | Static | None applied | Named in Execution Context (`test-data`) |
| `AVP_ADMIN_API_KEY` | Static | None applied | Named only; read from `/.env` at execution, never printed |
| Status list values | Static | None applied | Named in the step by visible label |
| Warranty contract with client email `client.stage.2374002` | Dynamic | Q2 — the expected recipient list depends on the client email typed at creation | Created in a `[Pre-Condition]` step; reused by every re-run case of this run. Cost: about 3 minutes of dealer-portal steps; no third party; leaves a quote, a contract and an invoice on Dev |
| API claim with `notifyEmail` `client.stage.2374001` | Dynamic | Q2 — the expected recipient list depends on the `notifyEmail` sent at creation; Q1 — it does not exist yet | Created in a `[Pre-Condition]` step by `POST /api/admin/claim`; reused by AP2374_002–006 in one run. Cost: one API call; leaves a claim "created by User Machine" on Dev |
| Claim status | Dynamic | Q3 — each sending case consumes it by changing it | Each case moves it to a status different from the current one and records both |
| Yopmail inboxes `client.stage.2374001` / `2374002` | Dynamic | Q4 — fresh per run, so mail from an earlier run cannot be mistaken for this run's | Named in the pre-condition. A later re-run takes the next unused pair (`2374003` / `2374004`, …) |
| Claim attachment `AP2374-attachment.png` | Dynamic | Q1 — not on any claim (upload HTTP 500 on 2026-11-01) | Attached in AP2374_006's own pre-condition |

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| The Admin API key expires (2026-12-05) or is refused on Dev | Low | High | Checked before the first call; a 401 makes AP2374_002–006 BLOCKED "Admin API key", never FAIL. The QA renews it — no skill creates keys |
| AP-2357 says the notify email is "to send notifications when claim is approved", while AC 2/3 set no status limit | Medium | High | AC wins: AP2374_002–004 cover the approval decision (Authorized) **and** at least one other status (Refused), and AP2374_002 also opens the Preapproved form (status code `approved`). A missing notify email on any status the form offers is judged against AC 2/3 |
| The Preapproved and most other status forms have no notify checkbox (bug AP-2509, Medium, open) | High | Medium | AP2374_002 records the Preapproved form against AP-2509 instead of re-filing it; sending is tested on the statuses that offer the checkbox |
| Admin claim Add attachment returned HTTP 500 on Dev (2 of 2, 2026-11-01) | High | Medium | AP2374_006 tries the admin form once, then the Admin API `claim-attachment` endpoint once (listed in `qa-docs/admin-api.md` §5 and its raw spec). Both failing → BLOCKED naming the HTTP 500 |
| Emails reach a real person if a claim with real addresses is used | Low | High | Only this run's claim, whose two addresses are QA Yopmail inboxes, is ever submitted with the box ticked |
| AC sentence still absent (seen 2026-11-01; AP-2392 Done covers the same symptom) | High | Medium | AP2374_005 now gives a verdict; Gate C checks AP-2392 / open bugs before filing |
| Yopmail delays mail or will not open attachments | Medium | Medium | Wait up to 2 minutes and refresh; BLOCKED if attachments cannot be inspected |
| `browser` / `tracker` bindings | Low | High | Both `active`; `notify` disabled and unused |

---

## 10. Test Schedule

| Phase | Activity | Owner |
|---|---|---|
| 2026-11-15 (Wave 1) | Test plan v2, test case redesign and review (plan → review-cases) | stlc-ticket-pipeline in stlc-worker |
| 2026-11-15 (Wave 2) | Execute AP2374_002–006 on Dev (s4) | stlc-manual-executor |
| After execution | Bugs, report, ticket outcome (s5–s7) | stlc-bug-reporter, stlc-test-reporter, stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Design, execute and report |
| QA reviewer (stlc-qa-reviewer) | Decide gates A–D |
| Ken Nguyen (reporter) | Reads the result comment; owner of AP-2509 |
| QA lead | Owns the Admin API key and reads the run summary |

---

## 12. Sign-off Checklist

- [x] Every requirement REQ-001 – REQ-005 is in scope with test types
- [x] Entry and exit criteria defined
- [x] Test data classified (Static / Dynamic / Configuration)
- [x] Risks logged, including the Admin API key and AP-2357's "approved" wording
- [ ] Test cases designed and reviewed
- [ ] Ready for execution

---

## Revisions

| Date | Section | Change | Reason |
|---|---|---|---|
| 2026-11-15 | Whole plan (v2.0) | Notify email set through the Admin API (setup); REQ-004 judged against the AC sentence; Accepted questions record-and-accept; Dev environment and `AVP_ADMIN_API_KEY` named; new inbox pair `client.stage.2374001/2374002` | Analysis re-run 2026-11-15 (Q-010 Answered, Q-001 Accepted), Gate A rule A3, review R1 minors F-2 and F-3 |
