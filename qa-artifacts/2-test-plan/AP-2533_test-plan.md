# Test Plan

**Plan ID:** TP-20261107-001
**Project:** Avantage Plus v2 — Dealer portal, "Create a quote" form `/quote/new/edit-vehicle` (Jira AP-2533 — Update quote form UI)
**Version:** 1.0
**Date:** 2026-11-07
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2533_requirements-analysis.md
**Total requirements:** 3

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify that clicking "Décoder" with VIN `5YJ3E1EA0LF734293` keeps the dealer on the "Create a quote" form and fills Brand **TESLA**, Model **Model 3** and Year **2020**, as the screenshot attached to the first acceptance criterion shows (REQ-001), instead of replacing the form with an empty card.
2. Verify that the decode does not create a quote (REQ-002), and that a quote the dealer then saves on purpose is created exactly once with the decoded vehicle — a regression check, meaning a check that the change did not break something that used to work.
3. Verify that the vehicle-type drop-down sits before the Quote name field and is labelled "Vehicle type" (REQ-003), and record how it behaves when the type changes.
4. Record, without passing or failing on them, the points the ticket leaves open (Q-001, Q-003 to Q-009), so the author can answer from evidence; keep the hidden-input check of REQ-001 BLOCKED until Q-002 is answered.
5. Confirm, before any "Décoder" click, that the fixed build is on Dev, because on an unfixed build every click saves a quote the dealer cannot delete (AP-2507).

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | "Décoder" fills the form with the vehicle decoded from the VIN — visible Brand/Model/Year (testable) and hidden inputs (BLOCKED by Q-002) | Functional · Negative · Edge-case · UI · Regression |
| REQ-002 | "Décoder" does not create the quote; a later Save creates exactly one quote | Functional · Negative · Regression |
| REQ-003 | The "Vehicle type" drop-down is placed before the Quote name | Functional · UI · Regression |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| Other forms that carry a VIN lookup (inventory add-vehicle form, warranty Generate Contract page) | The ticket names only the create-quote form. Their own tickets (AP-2497, AP-2503) cover them. |
| AP-2507's verdict and status | AP-2507's own re-test (AP2507_001–003) owns it. AP-2533's REQ-002 cases judge AP-2533 only and cite AP-2507 as related; a REQ-002 FAIL is linked to AP-2507 at Gate C (no new bug), and AP-2533's s7 never changes AP-2507's status or comments on it. |
| The outside VIN-decoding service itself | An outside system. Its outage before the step under test is recorded as BLOCKED, not as a defect in this ticket. |
| The 17 failing dealer automation specs of 2026-11-05 | Orchestrator context, not verified. This cycle maps the live form once and records differences (Q-008); repairing the automation suite is the automator's job. |
| API, accessibility and performance testing | Not named in the ticket. |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end checks of the "Create a quote" form in a real browser, from login to the decoded form, the quote list and, for one case, the saved quote | QA Agent |
| Integration Testing | The VIN decoding round trip (the form posts to the app, which asks an outside service), observed through the browser only | QA Agent |
| Regression Testing | Save after decode still creates exactly one quote; the required-field check on Save still refuses an empty Brand/Model/Year; the live form fields are compared with the map of 2026-11-01 | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Execute each acceptance criterion step by step: decode → visible values; decode → no quote; form render → drop-down position and label | playwright |
| Negative | Decode a malformed VIN and an empty VIN; save with Brand/Model/Year empty. Fail only on objective faults: an error page or HTTP 5xx, an empty card, a quote created, a typed value lost | playwright |
| Edge-case | Decode after the dealer already chose a Brand, Model and Year by hand (Q-004) — record which values the form keeps | playwright |
| UI / Visual | Document order and on-screen position of the "Vehicle type" control relative to Quote name; English label exact; French label recorded | playwright screenshots |
| Regression | Decode then Save; required-field validation; field-id map compared with `quote-creation.md` (2026-11-01) | playwright |

**How open questions shape the cases.** Q-002 is Blocking: the hidden-input check is its own test case, BLOCKED at design time. Q-001 and Q-003 to Q-009 are Judgement: those expected results are record-only — they list objective faults and record the outcome for the question, never a guessed answer. The visible decode case may read the hidden inputs' names and values before and after the decode as observations only. Q-010 is Info and changes no result.

**Build check before any decode.** Every case that clicks "Décoder" starts with a read-only check of the page's scripts for the vinlookup.js change (`formName + "[novalidate]"`, as AP2507_001 step 1), with no click. If the fix is absent, every case that clicks "Décoder" is BLOCKED "fixed build not deployed on Dev", not FAIL, and no decode is clicked.

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **playwright** (`mcp__playwright__*`, see `qa-artifacts/qa-config/tools.md`). The AI agent:
- Drives the browser step by step on the Dev environment (`execution_env: Dev`)
- Takes screenshots as evidence, and saves request lines (method, URL, status only) where a screenshot cannot show them
- Records PASS / FAIL / BLOCKED per step and per test case

Bugs and the ticket outcome go through the `tracker` provider, **jira** (CLI wrapper `tools/jira-cli/jira.sh`, REST for wiki-markup comments). The `notify` group is `disabled`, so no notification is sent; this is not a failure. The `vcs` group (github) is used only by the later automation stage, not by this plan.

---

## 4. Entry Criteria

_Entry criteria are what has to be ready before testing can usefully start. Starting before these are
in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [ ] Dev (`https://v2dev.garantieavantageplus.ca`) is reachable and the dealer login of the `env` source's "Dev Environment" section works
- [ ] `qa-artifacts/1-requirements-analysis/AP-2533_requirements-analysis.md` exists and Gate A is decided (done: rule A2, Q-002 posted on AP-2533 as comment 19510 on 2026-11-07)
- [ ] `AP2533_TestCases_*.md` exist with at least 8 test cases and Gate B is decided
- [ ] The read-only build check has been run once on the day of execution; its result decides whether the decode cases run or are BLOCKED
- [ ] Test environment is stable: the health check before execution passes
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds

---

## 5. Exit Criteria

_Exit criteria are what has to be true before we can say testing is finished and the story can
be considered for release. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] Every test case not BLOCKED at design time has been executed
- [ ] Test pass rate ≥ **90%** over all cases except SKIPPED — the registry's `story_pass_threshold`; a lower rate means at least one acceptance criterion is in doubt
- [ ] Zero **Critical** severity bugs remain open
- [ ] **High** severity bugs: 0 open filed or linked by this run — a decode that still saves a quote is High (it is AP-2507's behaviour) and keeps the story out of release
- [ ] Q-002 is answered, or the story stays out of "Ready for release" (Gate D will not move it while a Blocking question is open)
- [ ] `qa-artifacts/5-testing-report/AP-2533_test-report.md` has been generated and reviewed
- [ ] Every FAIL is filed in `AP-2533_bug-report.md`, linked to an existing bug (AP-2507 for REQ-002) or dismissed at Gate C

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and
what has to be fixed before we pick it back up._

### Suspend testing when:
- Dev is inaccessible for more than **30 minutes**
- The build check shows the fix is not on Dev — the decode cases (more than 30% of the set) are then BLOCKED by a single cause; the non-decode cases (REQ-003 and the Save validation) still run
- A **Critical** severity bug is found that prevents further execution
- A decode click creates a quote: stop clicking "Décoder" in further cases (each click would leave another undeletable quote), record the quote id, and mark the remaining decode cases BLOCKED naming the failure

### Resume testing when:
- The blocking issue is resolved and confirmed by the developer
- Dev is stable for at least **15 minutes**
- A build carrying the vinlookup.js change is confirmed on Dev by the build check

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | Dev (v2dev) — `https://v2dev.garantieavantageplus.ca` (`execution_env: Dev`; "Dev Environment" section of the `env` source) |
| **Browser** | Chromium (Playwright default), viewport 1280 × 800 |
| **OS** | Windows 11 (QA workstation) |
| **Application version** | Not known — Dev shows no build number. The ticket's pull request was deployed to an environment named "develop" on 2026-11-04 03:28 UTC; whether that is Dev is unverified, so the build check decides it |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/` |
| **Bug tracker** | jira — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Dealer login | Dealer ID 1380 ("Test QA staging") on Dev — `DEALER_USERNAME` / `DEALER_PASSWORD` of the `env` source's "Dev Environment" section | Existing account; never copied into a test file |
| VIN `5YJ3E1EA0LF734293` | 2020 TESLA Model 3 Standard Range Plus on Dev (`test-data`, AP-2377 run 2026-11-02); the VIN in the acceptance-criterion screenshot | Typed into the form; not a stored record |
| Malformed VIN `ABC123` and an empty VIN | Negative decode inputs (Q-003) | Typed |
| Hand-chosen Brand/Model/Year before decode | Ford / Focus / 2008 chosen from the lists (Q-004) | Chosen in the case |
| Quote names `QA-AP2533-<NNN>-<HHMMSS>` | Each case's own name, so a quote is found by name with the `/quotes` keyword search, never by "newest row" | Typed in the case |
| Excluded records | Quote 6437, vehicle 1067 and vehicle 915 are never opened, edited or reused; AP-2507's Ford VIN `1FAHP35NX8W239204` is AP-2507's data and is not used for decoding here | — |

### 8.1 Test Data Classification

_Decided once here and inherited by every test case. The decision procedure is
`stlc-testcase-designer` SKILL.md → Step 4: (1) does not exist yet, (2) creation-time values
the assertions depend on, (3) consumed by the run, (4) one instance per run or per case,
(5) shared configuration this feature changes. First Yes decides; undecided means Dynamic._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer login (Dealer 1380) | Static | None applied — it exists, nothing depends on how it was made, nothing consumes it | Named in the Execution Context, resolved from `env` |
| VIN `5YJ3E1EA0LF734293` | Static | None applied — a typed value the decoder looks up; the run does not change it | Named in the Execution Context and Test Data tables |
| An unsaved form with a case-specific Quote name | Dynamic | Q4 — each case needs its own name so its quote, if one is created, can be found by name | Typed in the case's own steps |
| The quote saved by the decode-then-Save regression case | Dynamic | Q1 — it does not exist yet; Q2 — the assertions depend on the decoded vehicle and the typed name | Created in that case's steps; recorded under Leaves behind |
| The quote list search result for a case's name | Dynamic | Q1 — depends on what the case just did | Read in the case's last step |
| Dealer UI language (`?_locale=fr`) | Configuration | Q5 — the French-label case switches the shared account's session language | Original language recorded; switched back with `?_locale=en` inside the same case |
| The vehicle-type selection on the form | Static | None applied — choosing a type only reloads the unsaved form; nothing is saved | Chosen in the case; nothing to restore |

**Cost of the Dynamic data.** On a fixed build only the decode-then-Save case saves anything: one quote and one vehicle, both named `QA-AP2533-004-<HHMMSS>`, which dealers cannot delete. Each decode calls the outside VIN-decoding service once (a few seconds). On an unfixed build that slipped past the build check, each decode click would save one more unwanted quote, which is why the suspension rule stops further clicks after the first.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| The fix is not deployed on Dev ("develop" not mapped to v2dev — unverified). Likelihood Medium because the panel shows a deployment but no source names its target | Medium | High — every decode click on an unfixed build saves an undeletable quote | Read-only build check first; decode cases BLOCKED "fixed build not deployed on Dev" if absent |
| The hidden-input part of REQ-001 cannot be judged (Q-002 Blocking, posted 2026-11-07, comment 19510). Likelihood High because no answer is expected before execution | High | Medium — part of an acceptance criterion stays unproven and the story cannot move to release | Separate BLOCKED case; hidden inputs recorded as observations in the visible decode case |
| The outside VIN-decoding service is down or no longer knows the VIN | Low | High — the decode cases cannot reach the step under test | Retry once; BLOCKED, not FAIL, when the service fails before the step under test |
| "No quote created" proven only by absence on a shared dealer account | Medium | Medium — another tester's quote could be mistaken for one created by the decode | Each case types its own `QA-AP2533-…` name and searches for it; the VIN search count is compared before and after |
| Other UI changes break things the ticket does not mention (Q-008; 17 automation specs reportedly failing, unverified) | Medium | Medium — a renamed field or button could silently break dealers' habits or the automation suite | Map the live form's fields and ids once and compare with the 2026-11-01 map; record differences; fail only when the form stops working |
| The French label is unknown (Q-009) | High | Low — only a wording point | Record the label shown with `?_locale=fr`; switch the session back |
| playwright unreachable | Low | High | Run the preflight before starting; reconnect if needed |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-11-07 | Analysis | Requirements analysis (done; Gate A rule A2) | stlc-requirements-analyst |
| 2026-11-07 | Planning | Test plan design | stlc-test-plan-designer |
| 2026-11-07 | Design | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| Wave 2 of the batch | Execution | Manual test execution via playwright on Dev | stlc-manual-executor |
| After execution | Reporting | Bug reporting (REQ-002 FAIL linked to AP-2507, no new bug) | stlc-bug-reporter |
| After execution | Reporting | Test report generation | stlc-test-reporter |
| After reporting | Closure | AP-2533 comment and status (not to "Ready for release" while Q-002 is open) | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Execute the STLC stages and generate all artifacts |
| QA reviewer (qa-reviewer subagent, `gate_mode: reviewer`) | Decide Gates A–D independently of the producing worker |
| Developer (Minh Lưu) | Fix defects; confirm the build on Dev carries the vinlookup.js change |
| Reporter / Product Owner (Nicolas-Eric Tain) | Answer Q-002 and the Judgement questions |
| Triage (Ken Nguyen) | Receives the Gate A questions mention; release assignee once the story passes |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%)
- [ ] Risk mitigations acknowledged by team
