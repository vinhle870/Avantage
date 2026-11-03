# Test Plan

**Plan ID:** TP-20260906-001
**Project:** Avantage Plus v2 — Permaplate feature set (AP-2443 · AP-2444 · AP-2445 · AP-2446 · AP-2447 · AP-2448 · AP-2455 · AP-2456)
**Version:** 1.0
**Date:** 2026-09-06
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** `qa-artifacts/1-requirements-analysis/PERMAPLATE_requirements-analysis.md`
**Total requirements:** 8

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify that all acceptance criteria in REQ-001 through REQ-008 are met under normal conditions, on the staging environment, using the dealer and admin accounts this project already owns.
2. Confirm that the eight stories work as one chain and not only in isolation: that a product linked by an administrator really does appear on the dealer's quote form, that the quote really does become a contract, and that the contract really does raise an invoice.
3. Confirm the system rejects invalid input and handles empty states gracefully, particularly around linking and unlinking products, where the requirements are silent about duplicates and about data that already exists.
4. Re-test the conditions-PDF failure that the author of AP-2445 reported on his own ticket on 2026-09-01, so that the team learns whether the build now on staging still has it.
5. Establish the first written record of how the Permaplate area of this product behaves, because the project's `domain` knowledge source is unbound and nothing about Permaplate is documented anywhere today.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | Admin can assign Permaplate products to a dealer (AP-2447) | Functional · Negative · Edge-case · UI · Regression |
| REQ-002 | Admin can unlink a Permaplate product from a dealer (AP-2455) | Functional · Negative · UI · Regression |
| REQ-003 | Dealer can select conditional Permaplate options (AP-2444) | Functional · Negative · Edge-case · UI |
| REQ-004 | A Permaplate invoice is created with the contract (AP-2446) | Functional · Negative · Regression · UI |
| REQ-005 | Permaplate contract list on the dealer page (AP-2443) | Functional · Negative · Edge-case · UI · Regression |
| REQ-006 | Admin user can see all Permaplate contracts (AP-2448) | Functional · Edge-case · UI · Regression |
| REQ-007 | Permaplate conditions appended to the contract PDF (AP-2445) | Functional · Edge-case · Regression |
| REQ-008 | Retail pricing removed from Permaplate surfaces (AP-2456) | Functional · Regression · UI |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| Performance and load testing | No story in this set states a speed or volume expectation, so there is no stated standard to test against. This is a gap in the requirements rather than a decision that speed does not matter. |
| Accessibility testing | For the same reason: no story states an accessibility expectation. Recorded here so the absence is visible, not hidden. |
| Application programming interface (API — the machine-to-machine route into the system) testing | This project tests through the screen only, as recorded in the project's knowledge registry. No separate API host has been given. |
| Actually paying a Permaplate invoice through to a completed payment | REQ-004 criterion 4 says the invoice can be paid "the same way" as a warranty invoice. Taking a real payment on staging would leave a financial record behind and depends on a payment provider whose staging behaviour nobody has described. The test will reach the payment screen and confirm the invoice is payable, and will stop there. This limitation is stated in the test report. |
| The retention and archival of Permaplate documents | Not mentioned by any of the eight stories. |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end validation of each story in a real browser against the staging deployment. This is the bulk of the effort. | QA Agent |
| Integration Testing | The joins between stories: the admin link surfacing on the dealer form, the contract raising an invoice, the conditions document merging into the contract PDF. Tested through the screen, not through the API. | QA Agent |
| Regression Testing | Re-verification of features that existed before this work — the warranty quote and contract flow, the invoices index page, and the dealer's other contract lists — so that adding Permaplate has not broken them. Regression testing means re-running checks on things that already worked, to prove a change did not break them. | QA Agent |
| Unit Testing | Not performed by QA. It belongs to the development team and no unit test results were supplied with these tickets. |  Development team |
| User acceptance testing (UAT — the customer's own final check) | Not in this cycle. The tickets sit at status QC, which is the stage before UAT. | Product Owner, later |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Execute each acceptance criterion step by step against the real page, comparing what appears on screen with what the criterion says. | Playwright |
| Negative | Submit input the feature should refuse — a duplicate product link, an option chosen as its own parent — and confirm the refusal is clear rather than silent. | Playwright |
| Edge-case | Empty states, a dealer with no linked product, a contract with no invoice yet, and a parent option with several children. | Playwright |
| UI / Visual | Confirm the page titles, column headings, button labels and icons named in the acceptance criteria appear exactly as written, captured in a screenshot. | Playwright screenshots |
| Regression | Re-run the warranty quote-to-contract-to-invoice path and the existing contract lists to confirm the Permaplate work did not disturb them. | Playwright |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's
bound `browser` provider, **Playwright** (see `qa-artifacts/qa-config/tools.md` §1). The
agent drives the browser step by step, takes a screenshot at each verification point as
evidence, and records Pass, Fail or Blocked for each step and for each test case.

Defects are filed into the project's bound `tracker` provider, **Jira**, reached through
the command-line wrapper `tools/jira-cli/jira.sh` rather than through a Jira MCP server.
That distinction matters: the MCP route is granted for a different Atlassian tenant and
does not resolve this project's ticket keys.

The `notify` capability group is **disabled** on this project, so no summary is posted to
a chat channel at the end of the run. This is recorded in the risk table below because it
means the result reaches the team only through the tickets and the report.

### 3.4 Execution order — build order, not ticket order

The eight stories chain together, so the run order is fixed and is not the numeric order
of the tickets:

1. **REQ-001** (AP-2447) — link a product to the dealer. Nothing downstream can be reached until this passes, so it runs first and a failure here suspends the cycle.
2. **REQ-003** (AP-2444) — the conditional options on the quote form, which needs a linked product.
3. **REQ-004** (AP-2446) — turn the quote into a contract and check the invoice, which needs a quote.
4. **REQ-007** (AP-2445) — the conditions document inside the contract PDF, which needs a contract.
5. **REQ-005** (AP-2443) and **REQ-006** (AP-2448) — the dealer and admin contract lists, which need a contract to list.
6. **REQ-008** (AP-2456) — the retail-pricing removals, which touch the quote form, the PDF, the invoice and the admin option form, all of which exist by this point.
7. **REQ-002** (AP-2455) — unlinking runs **last**, because it removes the product the earlier cases depend on. Running it earlier would block everything after it.

---

## 4. Entry Criteria

_What has to be ready before testing can usefully start. Entry criteria are the
conditions that must hold before the first test is run; starting before they are in place
produces results nobody can trust._

- [ ] The application is deployed and reachable at `https://v2staging.garantieavantageplus.ca`.
- [ ] `qa-artifacts/1-requirements-analysis/PERMAPLATE_requirements-analysis.md` exists and has been reviewed.
- [ ] Test cases exist in `qa-artifacts/3-test-cases/` — at least **35** cases, covering every one of the 8 requirements.
- [ ] The test environment is stable, with no known blocking infrastructure fault.
- [ ] Test data is available: the admin login, the dealer login for Dealer ID 1380, at least one Permaplate product defined in the admin area, and a vehicle that can be quoted.
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and Playwright responds.
- [ ] The `tracker` capability preflight passes — `tools/jira-cli/jira.sh me` returns an account.
- [ ] **Q-009 is answered:** it is confirmed whether AP-2448 is actually deployed to staging. It is the only one of the eight with no merged pull request recorded, and testing an undeployed story produces defects that waste the developer's time.

Entry criteria that are **not** met at the time of writing, and the decision taken about
each, are listed in §9.

---

## 5. Exit Criteria

_What has to be true before we can say testing is finished. Exit criteria are the
conditions that must hold before the result is trustworthy enough to act on. If any box
is unticked, testing is not done._

- [ ] Every High-priority test case has been executed, or has a stated reason why it could not be.
- [ ] The test pass rate is **at least 85%** of the cases actually executed. The usual threshold on this project is 90%; 85% is used here because eight of the twenty-six testability risks are High and several acceptance criteria cannot be judged at all until an open question is answered. Holding a run to 90% when a tenth of it is unjudgeable would either fail the release for a documentation gap or tempt a tester to pass a case they cannot really prove.
- [ ] Zero Critical-severity bugs remain open. A Critical bug here would be one that loses a signed contract or bills the wrong amount.
- [ ] No more than **2** High-severity bugs remain open, and each of those has a named owner and a date.
- [ ] Every one of the 8 requirements has at least one executed case, so that no story is signed off having never been run.
- [ ] `qa-artifacts/5-testing-report/PERMAPLATE_test-report.md` has been written and reviewed.
- [ ] Every defect found has a Jira ticket, linked to the story it came from, with a screenshot attached.
- [ ] The 10 open questions from the requirements analysis are either answered or restated on the tickets, so none of them is silently dropped.

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and what has
to be fixed before we pick it back up._

### Suspend testing when:

- The application is unreachable for more than **30 minutes**.
- More than **30%** of the test cases are blocked by a single defect.
- A Critical-severity bug is found that prevents further execution.
- **REQ-001 fails.** Linking a product to a dealer is the first link in the chain; if it does not work, everything except the admin-side option form is unreachable and continuing would produce a long list of Blocked results that tell the team nothing new.
- The staging environment is redeployed mid-run. Results from two different builds cannot honestly be reported as one run.

### Resume testing when:

- The blocking issue is resolved and the development team confirms the fix is on staging.
- The environment has been stable for at least **15 minutes**.
- Any case executed against the superseded build has been re-run against the new one.

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | `https://v2staging.garantieavantageplus.ca` — resolved from the `env` knowledge source |
| **Admin portal** | `https://v2staging.garantieavantageplus.ca/admin/login` |
| **Dealer portal** | `https://v2staging.garantieavantageplus.ca/login` |
| **Browser** | Chromium, driven by Playwright |
| **Viewports** | 1280 × 800 for admin work, 390 × 844 for any mobile check — from `qa-artifacts/qa-config/tools.md` §3 |
| **OS** | Windows 11 |
| **Application version** | Not known. No build identifier is displayed in the portal and none was given on the tickets. The run is instead pinned by date and by the merge state of each story's pull request, recorded in the requirements files. |
| **Dealer under test** | Dealer ID `1380`, company *Test QA staging*, province QC |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/5.1.0/{TicketID}/` |
| **Bug tracker** | Jira, project key `AP`, reached through `tools/jira-cli/jira.sh` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Admin login | The account used for every admin-area step, including linking products and reading the admin contract list. | Already exists; resolved from the `env` source |
| Dealer login, Dealer ID 1380 | The account used for every dealer-area step. | Already exists; resolved from the `env` source |
| A second dealer login without the *account owner* permission | Needed to prove REQ-005 criterion 5, which shows a different list to owners and non-owners. | **Not available.** Q-001 asks whether such an account exists. Until it is answered the split-visibility rule cannot be tested and its cases ship as Blocked. |
| Permaplate product | At least one product must exist in the admin area to be linked to the dealer. | Read from the admin Permaplate product list; created there if none exists |
| Permaplate options, including a parent and child pair | REQ-003 needs one option configured as the parent of another. The ticket names *Paint* and *Extra care*. | Checked first; if the pair is not already configured, created through the admin option form's new *Parent* field, which is itself part of REQ-003 |
| Vehicle | Every quote needs one. | Resolved from the `test-data` source |
| Client record | Created as the first step of each new quote. | Created per run |
| Permaplate quote | Needed by REQ-004, REQ-007, REQ-005, REQ-006 and REQ-008. | Created inside the test case that needs it |
| Permaplate contract | Needed by REQ-005, REQ-006, REQ-007 and REQ-004. | Created inside the test case that needs it |

### 6.1 Test Data Classification

_Decided once here, and inherited by every test case. `stlc-testcase-designer` reads this
table instead of re-deriving it, and puts Static values in the Execution Context, Dynamic
values in a `[Pre-Condition]` step, and Configuration values in a change-then-restore pair._

The decision procedure asks in order whether the item (1) does not exist yet, (2) has
creation-time values the assertions depend on, (3) is consumed by the run, (4) needs one
instance per run or per parallel case, or (5) is shared configuration this feature
changes. The first Yes decides. Undecided means Dynamic.

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Admin login | Static | None applied — it exists, nothing about it is created at run time, and no case changes it | Named in the Execution Context, resolved from `env` |
| Dealer login, Dealer ID 1380 | Static | None applied — same reasoning | Named in the Execution Context, resolved from `env` |
| Vehicle used for the quote | Static | None applied — an existing vehicle record is looked up, not created | Named in the Execution Context, resolved from `test-data` |
| Permaplate product definition | Static | None applied — the product catalogue exists and the cases read it | Named in the Execution Context; if none exists the case is Blocked, not improvised |
| The dealer's linked Permaplate products | Configuration | Q5 — this is shared configuration that REQ-001 and REQ-002 deliberately change, and every downstream case depends on its state | The case records the original set of linked products, changes it, and restores it at the end. REQ-002 runs last precisely because it leaves this changed. |
| The *Parent* field on a Permaplate option | Configuration | Q5 — REQ-003 changes a shared option definition that other dealers' quotes also read | Recorded, changed, and restored inside the same case |
| Client record for the quote | Dynamic | Q1 — it does not exist yet | Created in a `[Pre-Condition]` step with its field values written into that step |
| Permaplate quote | Dynamic | Q2 — the assertions depend on which options were selected when it was created | Created in a `[Pre-Condition]` step, with the exact option selections written into the step |
| Permaplate contract | Dynamic | Q2 — the contract PDF, the contract list rows and the invoice all assert on values fixed at creation | Created in a `[Pre-Condition]` step; the contract number is logged in the execution log |
| Permaplate invoice | Dynamic | Q3 — it is produced by the run and, if paid, consumed by it | Created as a side effect of contract creation; its number is logged |
| Permaplate contract PDF | Dynamic | Q2 — its content is fixed at generation time | Downloaded inside the case that inspects it |

**What the Dynamic items cost.** Creating a Permaplate quote and contract means walking
the full dealer flow — client, vehicle, quote, Permaplate selection, contract generation —
which took roughly ten to fifteen minutes per contract in the comparable AP-2437 cycle.
Each one leaves a permanent client record, quote, contract and invoice on the staging
environment; the project has no cleanup procedure, so this residue accumulates and is
accepted rather than removed. None of it calls a third party for payment, because taking a
real payment is out of scope.

**Reuse.** One Permaplate contract can serve REQ-005, REQ-006, REQ-007 and REQ-008
together, and the cases should reuse it rather than each creating their own. The contract
number is recorded in the execution log the first time it is created. Each case still
spells out how to create one from scratch, so that a case run on its own, on a fresh
environment, still works.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| AP-2448 may not be deployed to staging at all — it is the only one of the eight with no merged pull request recorded. | High | High — a whole requirement would be untestable, and a tester who did not know might raise defects against a build that does not exist | Confirm deployment before execution (Q-009). If it is not deployed, report every REQ-006 case as Blocked with that reason, never as Failed. |
| The conditions PDF is already known not to load — the author of AP-2445 reported it on his own ticket on 2026-09-01. | High | High — REQ-007 is the legal terms of the product; a contract without them may not be relied on | Run REQ-007 early and report the result either way. If the fault is still there, file it as a confirmation of the known defect so the developer is not sent hunting for a second one. |
| Eight of the twenty-six testability risks are High, and several acceptance criteria cannot be judged until an open question is answered. | High | Medium — cases will be executed but not honestly passable, which inflates the Blocked count | All ten open questions are posted to the tickets before execution starts. Any case that depends on an unanswered question is recorded as Blocked with the question number, never as Passed. |
| No dealer account without the *account owner* permission is known to exist. | High | Medium — REQ-005 criterion 5, the permission split, cannot be proven at all | Q-001. Until answered, the split-visibility cases ship as Blocked and the report says plainly that this rule was never tested. |
| Unlinking a product (REQ-002) may affect quotes and contracts that already exist, and nobody has said what should happen. | Medium | High — the test itself could remove a record the business is required to keep | REQ-002 runs last, on a link created for the purpose, after every other case has taken the evidence it needs. Q-002 is asked before the run. |
| The retail-pricing field that AP-2456 removes is never named, so its absence cannot be distinguished from a section that failed to load. | High | Medium — a false pass, which is worse than a failure because nobody looks again | Every removal case also confirms that the neighbouring fields on the same surface are still present. Q-006 asks the developer for the field name. |
| The chain of dependencies means one early failure blocks many later cases. | Medium | High — a single defect could turn most of the run into Blocked results | The run order in §3.4 is build order, so a break is found as early as possible; REQ-001 failing is an explicit suspension trigger. |
| The staging environment is redeployed during the run. | Medium | Medium — results from two builds get mixed into one report | Record the time each case ran. If a redeployment happens, re-run everything executed before it. |
| The `notify` capability is disabled on this project. | High | Low — the result reaches the team only through the tickets and the report, with no chat summary | Accepted. The ticket comments written by `stlc-ticket-updater` are the notification. |
| Playwright becomes unreachable mid-run. | Low | High — execution stops entirely | Run the preflight in `mcp-tools.md` before starting, and reconnect if it drops. |
| The project's `domain` knowledge source is unbound, so nothing about Permaplate is written down. | High | Medium — every fact has to be rediscovered from the screen, which is slow and easy to get wrong | Record what is learned during this run so the next cycle does not start from nothing. Recommended as a follow-up action in the test report. |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| Day 1 — 2026-09-06 | Analysis | Requirements analysis of all 8 stories | stlc-requirements-analyst |
| Day 1 — 2026-09-06 | Planning | Test plan design | stlc-test-plan-designer |
| Day 1 — 2026-09-06 | Design | Test case design, one file set per story | stlc-testcase-designer |
| Day 1 — 2026-09-06 | Review | Peer review of the test cases for coverage gaps | stlc-testcase-reviewer |
| Day 1–2 | Execution | Manual execution in the browser, in the build order of §3.4 | stlc-manual-executor |
| Day 2 | Reporting | Bug reporting and Jira ticket creation | stlc-bug-reporter |
| Day 2 | Reporting | Test report generation | stlc-test-reporter |
| Day 2 | Closure | Ticket status and comment updates | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Run the STLC skills in order and produce every artifact in `qa-artifacts/`. |
| Vinh Le — QC | Review the artifacts, approve the sign-off checklist, and decide whether the cycle's verdict is acted on. Named QC assignee on AP-2443, AP-2444, AP-2447 and AP-2448. |
| Minh Lưu — Developer | Fix the defects found and confirm each fix is on staging before it is re-tested. Answers Q-003, Q-006, Q-007 and Q-009. |
| Ken Nguyen — Product Owner and reporter of all eight stories | Clarify the open questions, particularly the ones about the invoice amount and the *account owner* permission, and approve the exit criteria. |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by the Product Owner
- [ ] Scope agreed with the development team, including the four items in §2.2 that are deliberately excluded
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution, especially Q-009 on whether AP-2448 is deployed
- [ ] Exit criteria thresholds agreed — pass rate at least 85%, with the reason for the lower-than-usual figure understood
- [ ] Risk mitigations acknowledged by the team, particularly that REQ-002 runs last and may change data
