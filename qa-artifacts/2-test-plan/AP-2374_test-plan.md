# Test Plan

**Plan ID:** TP-20261101-001
**Project:** Avantage Plus v2 — AP-2374 Status Change email notification: Add notify email and client email
**Version:** 1.0
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2374_requirements-analysis.md
**Total requirements:** 5 (REQ-001 – REQ-005)

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify that the admin **Change status** form of a claim shows a *Notify by email* checkbox and a *Recipient email(s)* field pre-filled with the claim's notification address and the contract's client email, separated by a comma (REQ-001, REQ-002).
2. Prove that submitting the form with the box ticked delivers an email to every listed recipient, for more than one target status and more than one recipient, as the reporter asked on 2025-12-18 (REQ-003).
3. Check that the email carries the claim's attached files and a PDF of the claim details page (REQ-005).
4. Record the message text and the full email body as evidence for REQ-004, whose expected wording waits on the author's answer to Q-001 (posted on AP-2374 on 2026-11-01).
5. Re-check the two bugs already raised against this story and closed — AP-2382 (email not received) and AP-2392 (message text missing) — so a regression is caught.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | *Notify by email* checkbox on the Change status form | Functional, UI, Regression |
| REQ-002 | Recipient field pre-filled with `notify_email` + contract client email | Functional, Edge-case, Negative, UI |
| REQ-003 | Email sent to the recipient list on submit with the box ticked | Functional, Negative, Edge-case, Regression |
| REQ-004 | Message text of the email — **record-only until Q-001 is answered**; its verdict case is BLOCKED | Functional, Regression |
| REQ-005 | Attachments: claim files + claim details PDF | Functional, Edge-case |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| The status change itself (which statuses exist, what each one does to the claim) | The ticket only adds the notification; status changing existed before. Only the status value shown back is checked |
| Dealer-portal claim screens | The ticket is about the admin area ("The admin user is logged in the admin area") |
| Email rendering across mail clients, spam scoring, delivery speed | Not stated in the ticket; delivery is checked in one web inbox (Yopmail) |
| Exact PDF layout | Not defined (Q-009); only that a PDF of this claim's details is attached |
| Performance, accessibility, API-level testing | Not recommended by the analysis; the feature is tested through the UI |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Description | Responsible |
|---|---|---|
| System Testing | End-to-end in the admin portal and the recipients' inboxes | QA Agent |
| Regression | AP-2382 and AP-2392 scenarios re-checked | QA Agent |

### 3.2 Test Types

| Type | Approach |
|---|---|
| Functional | Walk each acceptance criterion: open Change status, check the controls, submit, read the inbox |
| Negative | Box unticked (Q-007), edited / invalid / empty recipient list (Q-004) — **record-only**, since the ticket states no expected behaviour |
| Edge-case | Claim without `notify_email` or without client email, identical addresses (Q-003); claim with no attachment (Q-008) — **record-only** |
| Regression | Email is received at all (AP-2382) and contains the status message text (AP-2392) |
| UI | Checkbox and field label match the ticket's wording |

### 3.3 Test Execution Method

All manual test cases will be executed by **stlc-manual-executor** through the bound
`browser` provider — `playwright` (`mcp__playwright__*`), state `active` in
`qa-artifacts/qa-config/tools.md` §1. The agent drives the admin portal and opens the
recipients' Yopmail inboxes in the same browser, capturing screenshots as evidence.
Tracker work (questions, bugs, the result comment) goes through the `tracker` provider —
`jira` via `tools/jira-cli` (state `active`). `notify` is `disabled` and is not needed.
Capability groups needed: `tracker`, `browser`.

---

## 4. Entry Criteria

- [ ] Staging (`env`) is reachable and the admin login works.
- [ ] The build contains the change: the Change status form of a claim shows a *Notify by email* checkbox (checked in the first case; if absent, every case is BLOCKED, not FAIL).
- [ ] The admin route to a claim and its Change status control have been mapped (Claims is unmapped in `navigation` — see §9).
- [ ] A claim exists whose `notify_email` and contract client email are Yopmail addresses the QA controls (see §8).
- [ ] Test cases reviewed (s3b) and Gate B decided.

## 5. Exit Criteria

- [ ] Every test case has a status other than Not Run.
- [ ] Pass rate ≥ 90 % of cases (all except SKIPPED), per the registry's `story_pass_threshold`.
- [ ] No open Critical or High bug linked to this run.
- [ ] Q-001 (Blocking) answered — otherwise the story cannot move to *Ready for release*, whatever the pass rate.
- [ ] `AP-2374_test-report.md` written.

## 6. Suspension & Resumption Criteria

### Suspend testing when:

- Staging or the admin login is unavailable (record cases BLOCKED, not FAIL).
- Yopmail cannot be reached, so delivery cannot be observed.
- The Change status form has no *Notify by email* checkbox (build not deployed).

### Resume testing when:

- The environment and inbox service respond again and the build check passes.

---

## 7. Test Environment

| Component | Details |
|---|---|
| Application URL | Staging admin portal from the `env` source (`execute.env.md`) |
| Browsers | Chromium (Playwright default), admin viewport 1280 × 800 |
| Mail | Public Yopmail inboxes `https://yopmail.com/en/?login=<name>` (`test-data`) |
| Bug tracker | `jira` (AP project) via `tools/jira-cli` |
| Screenshot path | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Admin login | Shared staging admin account | Resolved from `env` |
| Notify address | `client.stage.NNN@yopmail.com` style address set as the claim's `notify_email`, fresh number per run | Set on the claim in a pre-condition (where it is set is still to be mapped — Q-010) |
| Client email | A second fresh Yopmail address on the warranty contract's client | On the contract's client record when the claim's contract is created or chosen |
| Claim with attachments | A claim on that contract with at least one attached file (e.g. a small PNG or PDF) | Created or prepared in a pre-condition |
| Claim without attachments | A second claim, for the record-only Q-008 case | Created in a pre-condition |
| Target statuses | At least two different statuses from the Change status list | Chosen by visible label in the step |

### 8.1 Test Data Classification

_Decided once here, and inherited by every test case._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Admin login | Static | None applied | Named in Execution Context, resolved from `env` |
| Status list values | Static | None applied | Named in the step by visible label |
| Claim under test (with `notify_email`, contract client email, attachments) | Dynamic | Q2 — the assertions depend on the two addresses and the attachments set when it is prepared | Prepared in a `[Pre-Condition]` step with fresh Yopmail addresses. Can be reused across the cases of one run, since each send only adds a status change. Cost: unknown until Claims is mapped — likely a warranty contract plus a claim through the UI; no third party; the claim and contract stay on staging |
| Claim's status | Dynamic | Q3 — each case consumes it by changing it | Each case changes it to a status different from the current one and records both |
| Yopmail inboxes | Dynamic | Q4 — one fresh pair per run, so earlier mail cannot be mistaken for this run's | Named in the pre-condition with the next unused number |
| Claim with no attachments | Dynamic | Q1 — does not exist yet | Created in the Q-008 case's pre-condition |

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| Q-001 (Blocking) unanswered: REQ-004's expected message cannot be judged | High | High | Question posted on AP-2374 (comment 19433). REQ-004's verdict case stays BLOCKED; the received text is recorded |
| The admin Claims area is unmapped — routes, the Change status control and where `notify_email` is set are unknown | High | Medium | First execution maps them and writes them back to `qa-docs/`; a case whose data cannot be prepared is BLOCKED, not guessed |
| Creating a warranty contract and claim with controlled emails may be long or impossible from the admin UI | Medium | High | Prefer an existing staging claim whose addresses can be edited to Yopmail addresses; otherwise create through the dealer portal |
| Emails go to real people if an existing claim with real addresses is used | Medium | High | Never send from a claim whose recipients are not QA Yopmail addresses; clear or replace the field first |
| Yopmail delays or drops mail, or will not open attachments | Medium | Medium | Wait up to 2 minutes and refresh; record BLOCKED if attachments cannot be inspected |
| AP-2392 symptom reported still present on 2026-01-07 | Medium | Medium | Dedicated regression case records the received message text |
| `browser` / `tracker` bindings | Low | High | Both `active` in the registry; `notify` disabled and unused |

---

## 10. Test Schedule

| Phase | Activity | Owner |
|---|---|---|
| 2026-11-01 | Requirements analysis, test plan, test case design and review (intake → s3b) | stlc-ticket-pipeline |
| Next execution slot | Map admin Claims, execute cases (s4) | stlc-manual-executor |
| After execution | Bugs, report, ticket outcome (s5–s7) | stlc-bug-reporter, stlc-test-reporter, stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Design, execute and report |
| QA reviewer (stlc-qa-reviewer) | Decide gates A–D |
| Ken Nguyen (reporter) | Answer Q-001 and the Judgement questions |
| QA lead (Vinh Le - QC) | Merge automation and read the run summary |

---

## 12. Sign-off Checklist

- [x] Every requirement REQ-001 – REQ-005 is in scope with test types
- [x] Entry and exit criteria defined
- [x] Test data classified (Static / Dynamic / Configuration)
- [x] Risks logged, including the open Blocking question
- [ ] Test cases designed and reviewed
- [ ] Ready for execution
