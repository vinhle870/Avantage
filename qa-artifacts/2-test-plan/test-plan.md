# Test Plan

**Plan ID:** TP-20260828-001
**Project:** Avantage Plus (AP) — Dealer Portal, release 5.1.0, story [AP-2436](https://garantieavantageplus.atlassian.net/browse/AP-2436)
**Version:** 1.0
**Date:** 2026-08-28
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/requirements-analysis.md
**Total requirements:** 7

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify that all acceptance criteria in **REQ-001 through REQ-007** are met under normal conditions, so that a Quebec dealer can email the insurance compliance documents to a client from the Insurance Quick Quote and Quote Details pages.
2. Confirm the **Send compliance documents** form rejects invalid input — an empty client name, an empty or malformed email address — and shows the dealer an error instead of silently doing nothing.
3. Prove the conditional waiver-form logic is right in all four Chubb configuration states: 50 % only, 30 % only, both, and none. The product owner asked for the single-assignment case explicitly on 2026-08-26, and the empty case is the one QC already stumbled into.
4. Check the contents of every attached PDF against the reference copies attached to AP-2436, because the product owner has confirmed the file names do not matter but the contents do.
5. Re-verify the two items QC previously could not finish: access to the **Dealer Details** page used to set up a dealer's Chubb configuration, which was reported fixed on 2026-08-26, and the send register that records each dispatch with its date and time.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | Entry point: **Send compliance documents** button for Quebec dealers | Functional · Negative · UI · Regression |
| REQ-002 | The **Send compliance documents** modal form | Functional · Negative · Edge-case · UI |
| REQ-003 | Email delivery and email body | Functional · Negative · Edge-case · API |
| REQ-004 | Conditional waiver-form attachment from the Chubb creditor form codes | Functional · Negative · Edge-case · Regression |
| REQ-005 | Pre-filled Talk Insurance, protection summary and remuneration disclosure PDFs | Functional · Edge-case |
| REQ-006 | Timestamped send register readable by Avantage Plus and by the dealer | Functional · UI · Regression |
| REQ-007 | Quick access to download the pre-filled disclosure PDFs | Functional · UI |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| Later phases of the insurance submission interface | AP-2436 is titled "Phase 1 – Interface de soumission des assurances". Anything the story does not describe belongs to a later ticket. |
| Dealers outside the Quebec province | The story's Given clause limits the feature to Quebec dealers and states no behaviour for other provinces. One exploratory check is still run under REQ-001 to record what actually happens, but the result is reported as an observation, not as a pass or a fail, because there is no agreed expected result. |
| Accessibility testing | The requirement file sets no keyboard or screen-reader expectation, so any result would be measured against a standard nobody has agreed to. Raise it as its own ticket if the team wants it. |
| Performance and load testing | No delivery-time or throughput figure is quantified anywhere in AP-2436. Deferred until the product team gives a number. |
| Automated regression scripts | This cycle is executed manually through the browser provider. Converting these cases into Playwright specs is a separate piece of work under `automation-framework-builder`. |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end validation in the browser: dealer logs in, opens a quote, sends the documents, and the email arrives in the test inbox. This is where the bulk of AP-2436 is verified. | QA Agent |
| Integration Testing | The join between the dealer portal and the Chubb configuration held in the `dealer_chubb_insurance` table, and the hand-off to the email service. Verified indirectly by changing the configuration in the admin area and observing which attachments arrive. | QA Agent |
| Regression Testing | Regression means re-checking features that already worked, to prove this change did not break them. Here that is the Insurance Quick Quote and Quote Details pages themselves — quoting must still work with the new button present — and the **Dealer Details** page in the admin area, which was recently repaired. | QA Agent |
| User Acceptance Testing | Not run by this pipeline. The documents are legal disclosures, so final content approval belongs to Avantage Plus staff, not to QA. Noted here so the gap is visible. | Product Owner |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Execute each acceptance criterion step by step against the running dealer portal, then open the received email and each attached PDF. | playwright |
| Negative | Submit the modal form with an empty **Client Name**, an empty **Client Email**, and a malformed address such as `client-at-example`, then confirm the form blocks the send and says why. | playwright |
| Edge-case | A very long client name, an address containing an apostrophe or an accented character, a dealer with an empty Chubb configuration, and a send repeated twice in a row to the same address. | playwright |
| UI / Visual | Screenshot the button on both quote pages in English and in French, the open modal, and the register row, and check the label text and the Dark button style against the story. | playwright screenshots |
| API | Watch the network request the modal issues on **Send** and record its status code, so that a send that fails on the server can be told apart from one that never left the browser. Needed because the story defines no on-screen success message. | playwright network capture |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **playwright** (`mcp__playwright__*`, bound `active` in `qa-artifacts/qa-config/tools.md`). The AI agent:

- Drives the browser step by step
- Takes screenshots as evidence into `qa-artifacts/4-execution-results/screenshots/{Sprint}/AP-2436/`
- Records PASS / FAIL / BLOCKED per step and per test case

Capability groups this cycle needs, per `.claude/skills/mcp-tools.md` §7:

| Capability group | Provider | State | Used for |
|---|---|---|---|
| `browser` | playwright | active | Every test case in this plan is executed through it. Without it nothing in section 2.1 can run. |
| `tracker` | jira | active | Filing bug tickets under AP-2436 and posting the result comment. **See the risk table** — the MCP route to this Jira site is not authorised for the `garantieavantageplus` tenant, and the working route today is the `tools/jira-cli` wrapper. |
| `notify` | none | disabled | No notification is sent at the end of this cycle. This is a configuration choice, not a failure. |

---

## 4. Entry Criteria

_Entry criteria are what has to be ready before testing can usefully start.
Starting before these are in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [ ] The dealer portal is deployed and reachable at the environment URL. **Not yet met** — `qa-artifacts/base-test/execute.env.md` is still the unfilled template and `/.env` holds only Jira variables, so no dealer-portal URL exists anywhere in this workspace. This must be filled in before execution.
- [ ] A dealer-portal login for a **Quebec** dealer exists, and an admin login that can open the **Dealer Details** page exists. **Not yet met** — `qa-artifacts/base-test/test-centralized.md` lists accounts for a member and admin portal that are not this dealer portal, so no usable account is on file.
- [ ] `qa-artifacts/1-requirements-analysis/requirements-analysis.md` exists and has been reviewed.
- [ ] `qa-artifacts/3-test-cases/AP-2436_TestCases_*.md` exists with at least **20** test cases, which is roughly three per requirement and enough to cover the four Chubb configuration states separately.
- [ ] A test inbox is available for the client email address, so an attached PDF can be opened and read. **Not yet met** — no email-capture service is configured in `execute.env.md`.
- [ ] The test environment is stable, with no known blocking infrastructure issue.
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and the playwright provider responds to a navigation call.
- [ ] Open questions **Q-004** (dealer with no Chubb configuration) and **Q-009** (**Dealer Details** page access) are answered, because REQ-004 cannot be fully judged without them.

---

## 5. Exit Criteria

_Exit criteria are what has to be true before we can say testing is finished and the
release is safe to consider. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] All High-priority test cases have been executed. Six of the seven requirements are High priority, so this is nearly the whole suite.
- [ ] Test pass rate ≥ **90 %**. Ninety per cent is the right bar here rather than a full hundred because REQ-006 and REQ-007 may stay Blocked on open questions Q-006 and Q-007, and a blocked case is not a defect.
- [ ] Zero **Critical** severity bugs remain open. A Critical bug in this feature would mean a client receives the wrong disclosure document or no document at all, which is a compliance failure, not an inconvenience.
- [ ] **High** severity bugs ≤ **0** open. The threshold is zero rather than a tolerance because every High case in this story is either a wrong document or a lost record, and both are things Avantage Plus would have to answer for.
- [ ] `qa-artifacts/5-testing-report/test-report.md` has been generated and reviewed.
- [ ] Every defect in `qa-artifacts/5-testing-report/bug-report.md` has a matching ticket under AP-2436 in Jira.
- [ ] Any test case left Blocked is listed in the report with the open question it waits on, so nobody reads a blocked case as a passing one.

---

## 6. Suspension & Resumption Criteria

_Suspension criteria say when we stop testing partway through because carrying on
would waste time, and what has to be fixed before we pick it back up._

### Suspend testing when:

- The dealer portal is inaccessible for more than **30 minutes**.
- More than **30 %** of test cases are blocked by a single defect. The realistic candidate is the **Dealer Details** page: if a dealer's Chubb configuration cannot be changed, every REQ-004 and REQ-005 case is blocked at once, which is more than a third of the suite.
- A **Critical** severity bug is found that prevents further execution — for example the **Send** button throws a server error for every dealer.
- The email service stops delivering, because then no attachment can be checked and a passing result would be meaningless.

### Resume testing when:

- The blocking issue is resolved and the fix is confirmed by the development team on the AP-2436 ticket.
- The environment has been stable for at least **15 minutes**.
- A build containing the fix is deployed to the test environment and a short smoke test — a quick check that the main path still works before spending time on the details — passes: log in as the dealer, open a quote, open the modal, send once.

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | Not known. `qa-artifacts/base-test/execute.env.md` has not been filled in and `/.env` holds only the Jira connection, so the dealer-portal URL has to be supplied before execution. |
| **Browser** | Chromium, the playwright default. Admin viewport 1280 × 800 and member viewport 390 × 844 per `qa-artifacts/qa-config/tools.md` §3. |
| **OS** | Windows 11, the machine this pipeline runs on. |
| **Application version** | Release 5.1.0, the fix version recorded on AP-2436. The exact build identifier of the deployed environment is not known and should be captured at execution time. |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/{Sprint}/AP-2436/` |
| **Bug tracker** | jira — bound in `qa-artifacts/qa-config/tools.md`. Site `garantieavantageplus.atlassian.net`, project key `AP`. |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Dealer user, Quebec province | The main account for every test. Must belong to a dealership whose province is Quebec, otherwise the button under test never appears. | Manual — supply an existing account, or have an Avantage Plus admin create one. |
| Dealer user, province other than Quebec | Used once, to record what a non-Quebec dealer actually sees. | Manual. |
| Admin user with access to **Dealer Details** | Needed to change the dealer's Chubb Insurance Configuration between the four waiver-form cases. This is the account whose page access was broken on 2026-08-23 and reported fixed on 2026-08-26. | Manual. |
| Dealer with **PM50** only | Chubb creditor form configuration containing PM50 and none of the 30 % codes, so that exactly one waiver form is expected. | Set in the admin area on the **Dealer Details** page. |
| Dealer with **PM30**, **S30** or **M30** only | The mirror case, expecting only the 30 % waiver form. | Set on the **Dealer Details** page. |
| Dealer with both 50 % and 30 % codes | Expecting both waiver forms, which is the state QC's dealer was in on 2026-08-23. | Set on the **Dealer Details** page. |
| Dealer with an empty Chubb configuration | The undefined case behind open question Q-004. Prepared so the case can be run the moment the product owner answers. | Set on the **Dealer Details** page. |
| An Insurance Quick Quote and a saved quote | One quote reachable from the Insurance Quick Quote page and one from the Quote Details page, since the button must appear on both. | Created through the dealer portal during setup. |
| Client email inbox | An inbox the agent can open to read the received email and its attachments. | Manual — a real test mailbox, or an email-capture service recorded in `execute.env.md`. |
| Reference PDFs | The four waiver forms and the two *Parlons assurances + Sommaire* PDFs attached to AP-2436, used to compare against what arrives. | Download from the AP-2436 attachments. |
| Edge-case input values | A 300-character client name, a name containing an accent such as `Josée Côté`, and a malformed address such as `client-at-example`. | Typed at execution time. |

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| No environment URL and no dealer-portal account are on file, so execution cannot start at all. This is the single biggest risk in the plan because it stops everything rather than degrading one case. | High | High | Fill in `qa-artifacts/base-test/execute.env.md` with the dealer-portal URL, the Quebec dealer login and the admin login before execution, using `stlc-baseline-generator`. |
| No email-capture inbox is configured, so the attachments — the actual subject of REQ-004 and REQ-005 — cannot be opened. | High | High | Agree a test mailbox and record it in `execute.env.md`. Without it, seven of the plan's objectives can only be reported as untested. |
| The **Dealer Details** page may still be inaccessible, blocking every waiver-form case. It was reported fixed on 2026-08-26 but has not been retested. | Medium | High | Retest that page first, as the very first test case of the run. If it fails, mark REQ-004 and REQ-005 Blocked immediately and suspend rather than working around it. |
| Ambiguous acceptance criteria in REQ-006 and REQ-007 — no screen is named for the send register or the quick download — so those cases cannot be judged. | High | Medium | Open questions Q-006 and Q-007 are already assigned to Ken Nguyen with a 2026-09-02 date. Run the rest of the suite first and keep these two Blocked until the answer arrives. |
| Behaviour for a dealer with no Chubb configuration is undefined, so the result of that case cannot be called right or wrong. | High | Medium | Q-004 is assigned to Ken Nguyen. Execute the case anyway and record the observed behaviour, clearly labelled as an observation. |
| The `tracker` capability reaches Jira over MCP with a cloud identifier granted only for `oneplanet-solutions.atlassian.net`, so a bug-filing call against `garantieavantageplus.atlassian.net` is refused. | High | Medium | Use the `tools/jira-cli` wrapper, which reads `/.env` and does reach the right site — this is the route that fetched AP-2436 for this cycle. Have the Atlassian connector granted for the correct tenant so the MCP route works again. |
| The playwright provider is unreachable when the run starts. | Low | High | Run the preflight in `.claude/skills/mcp-tools.md` before starting, and reconnect if it fails. |
| Testing the document language without a stated rule may produce a false defect — a French PDF reported as wrong when French is in fact intended. | Medium | Medium | Q-005 covers this. Until it is answered, record the language received without calling it a failure. |
| Changing one dealer's Chubb configuration four times during the run may leave the data in a state that confuses a later case or another tester. | Medium | Low | Note the original configuration before the first change and restore it at the end of the run. |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| Day 1 — 2026-08-28 | Analysis | Requirements analysis of AP-2436 | stlc-requirements-analyst |
| Day 1 — 2026-08-28 | Planning | Test plan design | stlc-test-plan-designer |
| Day 1 — 2026-08-28 | Design | Test case design | stlc-testcase-designer |
| Day 2 | Design review | Peer review for coverage gaps using formal test-design techniques | stlc-testcase-reviewer |
| Day 2 | Setup | Fill in the environment file and prepare the four Chubb configurations | stlc-baseline-generator |
| Day 2–3 | Execution | Manual test execution through playwright | stlc-manual-executor |
| Day 3 | Reporting | Bug reporting and ticket creation under AP-2436 | stlc-bug-reporter |
| Day 3 | Reporting | Test report generation | stlc-test-reporter |
| Day 4 | Closure | Update AP-2436 with the result and move its status | stlc-ticket-updater |

The schedule assumes the environment details and the answers to Q-004 and Q-009 arrive
by Day 2. If they do not, execution slips and Day 2–3 becomes setup time instead.

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Run the STLC skills, generate every artifact in `qa-artifacts/`, execute the cases in the browser and capture evidence. |
| QA Lead / Human reviewer — Vinh Le - QC | Review these artifacts, supply the environment URL and the dealer accounts, and approve the sign-off checklist. Named because AP-2436 is assigned to this person for QC. |
| Developer — Minh Lưu | Fix defects raised against AP-2436 and confirm each fix on the ticket before it is re-tested. Named from the ticket comments. |
| Product Owner — Ken Nguyen | Answer open questions Q-001 to Q-009, confirm the document contents are legally correct, and approve the exit criteria. |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable, and its URL recorded in `execute.env.md`
- [ ] Dealer and admin test accounts supplied
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90 %, zero open Critical or High bugs)
- [ ] Risk mitigations acknowledged by team
