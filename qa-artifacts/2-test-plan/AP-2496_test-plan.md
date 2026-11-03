# Test Plan

**Plan ID:** TP-20261101-AP2496
**Project:** Avantage Plus v2 — Dealer portal, "Download all documents" on the quote page (Jira AP-2496)
**Version:** 1.0
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2496_requirements-analysis.md

---

## 1. Test Objectives

- Verify that a quote with at least one generated contract shows exactly one "Download all documents" action on its quote page (REQ-001).
- Verify that a quote with no generated contract does not show the action (REQ-002).
- Verify that triggering the action returns one PDF, served as `application/pdf`, whose file name contains the quote id, and which contains the pages of every individual contract download of that quote (REQ-003).
- Verify that a product removed before finalization, and a warranty contract marked cancelled, contribute no page to the merged file while the other documents are still merged (REQ-004).
- Record what the build does on every Judgement question (Q-001 to Q-009) so the author can confirm it, without failing a case on a guessed answer.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Test Types |
|---|---|
| REQ-001 — Action shown with a generated contract | Functional, UI, Edge-case, Regression |
| REQ-002 — Action hidden with nothing to download | Functional, Negative, UI |
| REQ-003 — One PDF named with the quote id | Functional, Edge-case, Regression |
| REQ-004 — Removed / cancelled items excluded | Functional, Negative, Edge-case |

Regression here means checking that each product's existing individual download link still works after the change, because the merged file is built from the same documents.

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| Admin portal and client portal | The ticket names only the dealer's quote page. |
| The content of each individual contract PDF (wording, figures) | Owned by the tickets that built each contract; this ticket only merges existing documents. |
| Performance of the merge on very large quotes | No size or time limit is stated; a slow download is recorded, not judged. |
| GAP insurance contracts | No GAP contract flow is mapped in the domain knowledge; a GAP contract is included only if one already exists on a reusable quote. |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Description | Responsible |
|---|---|---|
| System Testing | End-to-end checks of the quote page and the downloaded file in a real browser on staging | QA Agent (stlc-manual-executor) |
| Regression | Each product's individual download link still returns its PDF | QA Agent |

### 3.2 Test Types

| Type | Approach | Tool |
|---|---|---|
| Functional | Execute each acceptance criterion step by step on a prepared quote | playwright (browser provider) |
| Negative | Quote with no generated contract; removed product; cancelled warranty contract | playwright |
| Edge-case | Exactly one contract; only contract cancelled (record-only); archived quote (record-only); another dealer's quote URL (record-only) | playwright |
| UI | Count of matching controls, label, position (position and French label record-only) | playwright screenshots |
| API / response | Response status, `Content-Type` and `Content-Disposition` of the download request, read from the browser's network log | playwright network requests |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **playwright** (`mcp__playwright__*`, see `qa-artifacts/qa-config/tools.md`). The AI agent drives the dealer portal, captures screenshots as evidence, reads the download response headers from the network log, and counts PDF pages against each individual contract download. Bugs go to the `tracker` provider, **jira** (CLI wrapper `tools/jira-cli`).

---

## 4. Entry Criteria

_What has to be ready before testing can usefully start. Starting before these are in place produces results nobody can trust._

- [ ] The AP-2496 change is deployed on v2staging (the ticket is in QC; the build should contain it)
- [ ] `AP-2496_requirements-analysis.md` exists and Gate A is approved
- [ ] `AP2496_TestCases_*.md` exist and Gate B is approved
- [ ] The environment health check (a smoke test: dealer login and `/quotes` load) passes
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds

---

## 5. Exit Criteria

_What has to be true before we can say testing is finished. If any box is unticked, testing is not done._

- [ ] All High-priority test cases executed
- [ ] Pass rate ≥ **90%** over all cases except SKIPPED — the registry's `story_pass_threshold`, chosen so one failure in ten blocks release
- [ ] Zero Critical and zero High severity bugs open — a wrong document set handed to a client is a compliance problem
- [ ] `AP-2496_test-report.md` generated and reviewed
- [ ] Every FAIL filed, linked or dismissed in `AP-2496_bug-report.md`

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and what has to be fixed before we pick it back up._

### Suspend testing when:
- The staging application is unreachable for more than 30 minutes
- More than 30% of the test cases are blocked by a single defect (for example the action is missing on every quote)
- The quote page returns HTTP 500 for every prepared quote

### Resume testing when:
- The blocking issue is fixed and confirmed by the developer
- The environment has been stable for at least 15 minutes
- A patch addressing the blocking defect is deployed

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | Dealer portal URL from the `env` knowledge source (`qa-artifacts/base-test/execute.env.md`) — v2staging |
| **Login** | The shared dealer account named in the `env` source; credentials are taken from there at run time and never copied into artifacts |
| **Browser** | Chromium (Playwright default), viewport 1280 × 800 |
| **OS** | Windows 11 (QA workstation) |
| **Application version** | Not known — the ticket has no fix version; the run folder is `no-sprint` |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/` |
| **Bug tracker** | jira — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Dealer login | Shared dealer account (dealer 1380, "Test QA staging") | `env` source |
| Vehicle 915 | `1FAHP35NX8W239204`, entry point for new quotes via `/vehicle/915/details` → Create quote (avoids the HTTP 500 of a bare `/quote/new/client`) | `test-data` source |
| Quote A — several contracts | A quote with at least two generated contracts, for example a roadside contract ("Save and Generate Contract") and a Permaplate contract | Created in a `[Pre-Condition]` step; quote 6276 (Chubb contract AVP000160) may be reused if it still has its contract |
| Quote B — no contract | A quote with a client and vehicle 915 but no generated contract | Created in a `[Pre-Condition]` step |
| Quote C — removed product | A quote with one generated contract plus one optional product removed before its contract was generated | Created in a `[Pre-Condition]` step |
| Quote D — cancelled warranty contract | A quote with a warranty contract marked cancelled plus at least one other generated contract | Setup path not known (Q-006); the case states the setup and is recorded BLOCKED if no screen sets the flag |

### 8.1 Test Data Classification

_Decided once here, and inherited by every test case._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Dealer login | Static | None applied | Named in Execution Context, resolved from `env` |
| Vehicle 915 | Static | None applied — read only, never changed | Named in Execution Context, from `test-data` |
| Quote A with several generated contracts | Dynamic | Q2 — the assertions depend on which contracts exist on the quote at creation | Created in a `[Pre-Condition]` step with the products listed; may reuse an existing quote that matches, recorded by id. Cost: about 5 minutes per quote, no third party for roadside / Permaplate; Chubb calls the insurer's API (~5 s) and goes stale after 10 days |
| Quote B with no generated contract | Dynamic | Q1 — does not exist yet | Created in a `[Pre-Condition]` step |
| Quote C with a removed product | Dynamic | Q2 — assertions depend on which product was removed | Created in a `[Pre-Condition]` step |
| Quote D with a cancelled warranty contract | Dynamic | Q2 — assertions depend on the cancelled contract | Created in a `[Pre-Condition]` step if a screen exists; otherwise BLOCKED on Q-006 |
| Individual contract PDFs (reference) | Dynamic | Q2 — generated per quote | Downloaded in the case from each product's own link, used as the page-count reference |

Each quote left on staging is listed in the execution log; there is no cleanup source (`cleanup` is missing), so quotes and contracts stay behind.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| No screen sets `WarrantyContract::isCancelled()` (Q-006) — rated High because half of REQ-004 may be untestable | High | High | State the setup in the case; record BLOCKED with Q-006 if no screen does it; ask the developer in the story comment |
| Building a quote with several contracts is slow and the warranty contract flow is unmapped | Medium | High | Use the mapped roadside and Permaplate flows; reuse quote 6276 if suitable; record types used |
| "Finalized quote" undefined (Q-001) | Medium | Medium | Precondition = at least one generated contract; record any quote state shown |
| File served inline, so the browser opens it rather than saving it (Q-003) | Medium | Low | Read `Content-Type` and `Content-Disposition` from the network log; check the name there |
| Chubb contract creation fails on a stale quote (> 10 days) | Medium | Medium | Do not depend on Chubb for the several-contracts case |
| playwright unreachable | Low | High | Run the preflight before s4 |
| Shared dealer account used by other tickets at the same time | Medium | Low | Use fresh quotes per run; record ids |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-11-01 | Analysis | Requirements analysis | stlc-requirements-analyst |
| 2026-11-01 | Planning | Test plan design | stlc-test-plan-designer |
| 2026-11-01 | Design | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| Next execution wave | Execution | Manual test execution via playwright | stlc-manual-executor |
| Next execution wave | Reporting | Bug reporting + test report | stlc-bug-reporter, stlc-test-reporter |
| Next execution wave | Closure | Story comment and status per Gate D | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Run the STLC skills and write every artifact |
| QA Reviewer (stlc-qa-reviewer) | Approve gates A–D in place of the QA lead (`gate_mode: reviewer`) |
| Developer | Fix defects; answer Q-006 and Q-008 |
| Product Owner (Nicolas-Eric Tain) | Answer the Judgement questions; accept the recorded behaviour |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%)
- [ ] Risk mitigations acknowledged by team
