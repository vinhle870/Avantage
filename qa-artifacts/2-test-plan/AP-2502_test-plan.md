# Test Plan

**Plan ID:** TP-20261103-AP2502
**Project:** Avantage Plus v2 — AP-2502 "separate compliance document PDF for GC960 and 6201"
**Version:** 1.0
**Date:** 2026-11-03
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2502_requirements-analysis.md
**Total requirements:** 4

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify that a dealer assigned to a 960 creditor form sends a separately filled GC960 document, built from the French and English files supplied in the ticket, whose product line mentions only GC960 (REQ-001, REQ-004).
2. Confirm that a dealer assigned to a GC6201 creditor form still sends the existing `parlons-assurance` French and English document, whose product line mentions only GC6201. Whether a GC960 document is also attached is recorded, not judged — the ticket does not say (Q-009) (REQ-002 — regression, meaning a re-check that existing behaviour still works after the change).
3. Confirm that a dealer assigned to both families receives one document per family, each mentioning only its own family (REQ-003).
4. Record, without judging, what the build does where the ticket is silent: the exact product line wording, the pre-filled values, attachment names and count, the waiver forms, and a dealer with no creditor form (Q-002, Q-003, Q-004, Q-007, Q-008).
5. Leave dealer 1380's Chubb configuration on Dev exactly as it was found.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | A 960-form dealer sends a separately filled GC960 document | Functional · Negative · Edge-case |
| REQ-002 | A GC6201-form dealer keeps the existing parlons-assurance document | Functional · Regression |
| REQ-003 | A dealer with both families receives one document per family | Functional · Edge-case |
| REQ-004 | The English GC960 document is the supplied English file | Functional · Regression |

Both send entry points are in scope: **Insurance Quick Quote** (`/quick-insurance-quote`, no quote needed) and **Quote Details** (`/quote/{id}/details`).

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| The Chubb contract PDF packet (AP-2437) and the "Download all documents" bundle (AP-2496) | The acceptance criteria cover only "when the compliance documents are sent" (Q-006, Info) |
| The send form's own validation, the Quebec-only gate and the registers' columns | Unchanged by this ticket; covered by AP-2436 |
| Legal review of the PDF wording | QA checks that the build sends the files the ticket supplied, not whether their text is correct |
| Performance, accessibility and API testing | The change is to which file is attached; no load, accessibility or API surface changed |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | Configure the dealer in the Admin portal, send from the Dealer portal, read the email and its PDF attachments in the Yopmail inbox | QA Agent |
| Integration Testing | The send reads the dealer's Chubb creditor-form configuration and picks the family document from it | QA Agent |
| Regression Testing | The GC6201 send keeps the existing document | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | One send per family configuration; identify each attached document by its content | playwright |
| Negative | A dealer with no creditor form assigned — record what is sent (Q-008) | playwright |
| Edge-case | Both families assigned at once (a decision table — every combination of the two settings) | playwright |
| Regression | GC6201-only send, the dealer's current configuration | playwright |
| Content check | Download each PDF attachment and read its text: page-1 heading, summary title, page footer (form version) and the product line | playwright download + PDF text extraction |

**How a document is identified.** By content, never by file name (Q-004):

| Document | Page 1 heading | Summary title (page 2) | Summary footer |
|---|---|---|---|
| GC960 — French | "PARLONS ASSURANCE !" | "Plan de protection de paiement pour propriétaire d'équipement" | `PSF_GC960S(201907)` |
| GC960 — English | "LET'S TALK INSURANCE!" | "Equipment Owner Payment Protection Plan" | `PSE_GC960M(202601)` |
| GC6201 — French / English | the existing `parlons-assurance-fr.pdf` / `parlons-assurance-en.pdf` | recorded on the first run | recorded on the first run |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **playwright** (see `qa-artifacts/qa-config/tools.md`). The AI agent:
- Drives the browser step by step
- Takes screenshots as evidence
- Records PASS / FAIL / BLOCKED per step and per test case

Test cases change shared configuration and must run **one at a time**, never in parallel with another ticket that uses dealer 1380.

---

## 4. Entry Criteria

_What has to be ready before testing can usefully start. Starting before these are
in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [ ] The Dev environment (v2dev) is up and the dealer and admin logins work (health check before Wave 2)
- [ ] `AP-2502_requirements-analysis.md` exists and Gate A is decided — done, rule A3
- [ ] `AP2502_TestCases_*.md` exist and Gate B is approved by the independent reviewer
- [ ] The Dev admin page `/admin/dealer/1380/chubb-insurance` is reachable, and its creditor-form list is read once to see whether a form whose label or value contains "960" exists. If none exists, every GC960 case is BLOCKED "test data not on Dev: no 960 creditor form"
- [ ] Yopmail (`https://yopmail.com`) is reachable and shows attachments
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds

---

## 5. Exit Criteria

_What has to be true before we can say testing is finished and the release is safe
to consider. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] All High-priority test cases have been executed
- [ ] Test pass rate ≥ **90%** (the registry's `story_pass_threshold`, over all cases except SKIPPED)
- [ ] Zero **Critical** severity bugs remain open
- [ ] **High** severity bugs: 0 open — a High bug here means clients receive the wrong disclosure document
- [ ] Dealer 1380's creditor-form assignment on Dev equals the value recorded before the first case
- [ ] `AP-2502_test-report.md` has been generated and reviewed
- [ ] All tracker tickets created in `AP-2502_bug-report.md`

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and
what has to be fixed before we pick it back up._

### Suspend testing when:
- Application is inaccessible for more than **30 minutes**
- More than **30%** of test cases are blocked by a single defect
- A **Critical** severity bug is found that prevents further execution
- The admin Chubb configuration cannot be saved or restored — stop at once, restore by hand if possible, and record the state left behind

### Resume testing when:
- The blocking issue is resolved and confirmed by dev team
- Environment is stable for at least **15 minutes**
- A patch has been deployed addressing the blocking defect

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | Dev — `https://v2dev.garantieavantageplus.ca` (Dealer portal `/`, Admin portal `/admin`), from the "Dev Environment" section of the `env` source |
| **Browser** | Chromium (Playwright default), 1280 × 800 |
| **OS** | Windows 11 |
| **Application version** | Dev build after the AP-2502 pull request was merged (Jira development panel: 1 pull request MERGED, 2026-11-02) |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/` |
| **Bug tracker** | jira — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Dealer account (dealer 1380, "Test QA staging") | Sends the compliance documents | Existing — `env` source, Dev section |
| Admin account | Reads and changes the dealer's Chubb creditor forms | Existing — same credentials as the dealer portal (`navigation` §1) |
| Dealer 1380's Chubb creditor-form assignment | Decides which family document is sent | Recorded, changed and restored inside each case |
| Client inbox | `client.stage.2502NNN@yopmail.com`, one fresh address per case (`NNN` = the case number) | Typed in the send form |
| Quote with a client e-mail | Only for the Quote Details entry point | Created in the case from vehicle 915 → "Create quote" |

### 8.1 Test Data Classification

_Decided once here, and inherited by every test case._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer and admin logins | Static | None applied | Named in Execution Context, resolved from `env` (Dev) |
| Vehicle 915 (Ford Focus 2008, Dev) | Static | None applied | Named in Execution Context, from `test-data` |
| Dealer 1380's Chubb creditor-form assignment | Configuration | Q5 — the cases change shared configuration other tickets depend on | Original selection recorded in step 1, changed, restored in the same case before its last verification |
| Client inbox `client.stage.2502NNN@yopmail.com` | Dynamic | Q4 — a fresh address per case so earlier mail cannot be mistaken for this run's | Typed in the send step |
| Client name for the send | Dynamic | Q2 — the greeting and log row show the value typed | Written in the step |
| A quote for the Quote Details send | Dynamic | Q1 — it does not exist yet | Created in a `[Pre-Condition]` step with its field values |
| The compliance email and log rows | Dynamic (output) | Q1 | Created by the send; left behind |

**Cost of the dynamic data.** Each send takes a few seconds and calls no third party except
the mail relay; it leaves one email in a public Yopmail inbox and one row in the dealer's
`/insurance-compliance-log`. The Quote Details case leaves one quote on vehicle 915. No
Chubb API call is made — no Chubb quote or contract is needed for a send.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| No "960 form" exists in the Dev admin creditor-form list (nobody has seen one on any environment) | Medium | High | Read the list read-only at entry; with none, the GC960 cases are BLOCKED for missing test data, never run against a guessed code (Q-001) |
| A case changes dealer 1380's creditor forms and fails before restoring them, breaking other tickets that use the dealer | Medium | High | The original selection is written in the execution log at step 1; restore is its own step; if a case stops early, the executor restores by hand before the next case |
| The product line text is inside compressed PDF page content and can be missed | Medium | Medium | Extract the text of every page of every attachment and search for "GC960" and "GC6201"; screenshot the page holding the product line |
| Ambiguous wording of "product line text" and "filled" | High | Medium | Judgement questions Q-002, Q-003 — expected results record, never assert, the exact wording |
| Yopmail delays or drops the email | Low | Medium | Wait up to 2 minutes and refresh; a missing email after that is recorded as a FAIL of the send only when the success flash was shown |
| playwright unreachable | Low | High | Run the preflight before starting; reconnect if needed |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-11-03 | Analysis | Requirements analysis | stlc-requirements-analyst |
| 2026-11-03 | Planning | Test plan design | stlc-test-plan-designer |
| 2026-11-03 | Design | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| Wave 2 | Execution | Manual test execution via playwright on Dev | stlc-manual-executor |
| Wave 2 | Reporting | Bug reporting + ticket creation | stlc-bug-reporter |
| Wave 2 | Reporting | Test report generation | stlc-test-reporter |
| Wave 2 | Closure | Tracker ticket update | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Execute the STLC skills, generate all artifacts |
| Independent qa-reviewer | Approve the test-case design (R2) and the results (R3) |
| Developer (Minh Lưu) | Fix defects; confirm fixes before re-test |
| Product Owner (Ken Nguyen) | Answer the open questions Q-001 to Q-008 |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%)
- [ ] Risk mitigations acknowledged by team

---

## Revisions

| Date | Change | By |
|---|---|---|
| 2026-11-03 | Created | stlc-worker (Wave 1) |
| 2026-11-03T04:23Z | §1 objective 2: "and no GC960 document" replaced — whether a GC960 document is also attached for a GC6201-only dealer is recorded for Q-009, not asserted (R2 round 1, F-6) | stlc-worker (R2 rework) |
