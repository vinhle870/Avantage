# Test Execution Report

**Report ID:** TR-20260904-001
**Project:** Avantage Plus (AP) — Dealer portal, Chubb creditor-insurance contract printing
**Test Cycle:** AP-2437 — Attach the acceptance/waiver form in the Chubb insurance contract PDF
**Application version:** 5.1.0 · Staging (v2staging), deployed 2026-08-26 (3 pull requests merged)
**Date:** 2026-09-04
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** Only 3 of 23 test cases could be run at all, giving a pass rate of 9 % (2 of
23) against a 90 % threshold, and one High-severity defect is open — but the decisive point
is not the arithmetic: **no test in this cycle ever opened a Chubb insurance contract, so
the feature this story delivers has not been tested even once.**

> **Read this verdict correctly.** ❌ FAIL here means *"we cannot say this works"*, not
> *"we have proved this is broken"*. The distinction matters for what happens next: the
> fix is not a round of bug-fixing, it is supplying the test data and the four answers
> that would let the cycle actually run.

---

## Executive Summary

AP-2437 makes the dealer portal add a legally required disclosure page — the form on which
a client acknowledges being told what the dealership earns on an insurance sale — to the
front of the printed insurance contract, choosing automatically between four versions of
that form depending on the rate sold and the contract's language.

Twenty-three tests were written for it. **Three could be run. Twenty could not**, because
the dealership used for testing has no insurance contract on the staging system to print —
the page that lists them is empty. Creating one means walking a quote through financing and
then binding a real insurance policy against the insurer's system, which was not done
without the QA team's approval because it leaves a permanent record on a shared
environment.

Of the three tests that did run, two passed and one failed. The failure is the important
result of this cycle, and it was found not in the software but **in the documents the
story supplies**: of the four disclosure forms attached to the ticket, only two state the
dealership's commission at all. The two intended for the lower rate tier omit the
disclosure sentence entirely, so a client signing one would never be told what the
dealership earns — which is the single obligation this whole story exists to meet. That is
logged as AP-2457 and needs a corrected document, not a code change, because the figure is
printed inside the PDF rather than filled in by the system. A second, smaller issue
(AP-2458) is that none of the four forms says the client was informed *before* the sale
concluded, which the story explicitly requires.

The one genuine reassurance is that the change has not damaged anything nearby: warranty
contracts, which still use the old document engine, print correctly and are unaffected.

**The recommendation is not to ship, and not to schedule another test run yet.** Supply one
insurance contract on staging and answer four outstanding questions first; without them a
second cycle would produce the same twenty blocked results.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 2 of 6 partially covered; **0 of 6 fully covered** |
| Total test cases | 23 |
| Passed | 2 (9 % of 23) |
| Failed | 1 (4 % of 23) |
| Blocked | 20 (87 % of 23) |
| Skipped | 0 |
| **Pass rate** | **9 % (2 of 23)** |
| Pass rate among executed cases | 67 % (2 of 3) — a true figure about a sample too small to mean anything |
| Pass rate threshold | 90 % |
| Threshold met? | ❌ No |
| Defect density | 0.09 bugs per test case (2 bugs ÷ 23 cases) — understates the real rate, since 20 cases never ran and could not find anything |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 1 | 0 | 1 |
| Medium | 1 | 0 | 1 |
| Low | 0 | 0 | 0 |
| **Total** | **2** | **0** | **2** |

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed, or BLOCKED with a named reason | 100 % | 100 % — every blocked case names the fact that blocks it | ✅ |
| High-priority TCs actually executed | — | 13 % (2 of 15 High-priority cases) | ❌ |
| Pass rate | ≥ 90 % | 9 % (2 of 23) | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | 0 against REQ-001/002/003/005 | 1 — AP-2457, against REQ-004 | ❌ |
| All four decision branches exercised at least once | 4 of 4 | **0 of 4** | ❌ |
| Regression pass over other PDF features | Complete | Partial — warranty PDF verified; the AP-2436 compliance send was not re-run | ❌ |
| Test report generated and reviewed | Yes | Yes — this document | ✅ |

**3 of 8 exit criteria met.** The plan's threshold was deliberately set at 90 % rather than
the usual 80 %, on the grounds that a 10 % failure rate on a legal compliance document
means one contract in ten reaching a client without valid proof of disclosure. Nothing in
this cycle's results argues for relaxing it.

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Form inserted automatically into the contract PDF | 4 | 0 | 0 | 4 | **0 %** |
| REQ-002 — Form placed on the first page, Chubb pages intact | 3 | 0 | 0 | 3 | **0 %** |
| REQ-003 — Four-branch selection of the correct form variant | 5 | 0 | 0 | 5 | **0 %** |
| REQ-004 — Required content of the acceptance/waiver form | 4 | 1 | 1 | 2 | 50 % |
| REQ-005 — Merged contract PDF remains valid and readable | 6 | 1 | 0 | 5 | 17 % |
| *(Unstated in AP-2437)* — Authorisation on the contract download endpoint | 1 | 0 | 0 | 1 | **0 %** |
| REQ-006 — Retention and audit access | 0 | 0 | 0 | 0 | Out of scope — see below |
| **Total** | **23** | **2** | **1** | **20** | **13 %** |

**REQ-006 was excluded from this cycle by the test plan**, because AP-2437's own text says
the retention and archival method *"reste à confirmer"* with the product owner and no
confirmation exists. There is no screen and no rule to test against. It is not a gap in
this cycle's work; it is a requirement that is not yet ready to be tested, and it needs its
own story.

**The three requirements at 0 % are the heart of the feature.** Whether the form is
inserted, whether it lands on the first page, and whether the right one of four variants is
chosen — none of it has been observed even once.

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-008 | The two "30 %" acceptance/waiver forms disclose no remuneration percentage at all | High | P1 | REQ-004 / AC-7 | [AP-2457](https://garantieavantageplus.atlassian.net/browse/AP-2457) | Open |
| BUG-009 | No acceptance/waiver form records that the client was informed before the sale concluded | Medium | P2 | REQ-004 / AC-8 | [AP-2458](https://garantieavantageplus.atlassian.net/browse/AP-2458) | Open |

Both defects are in the **documents attached to the ticket**, not in the application code.
Both were found by opening those four PDFs, and both would have been findable on 10 August
by anyone who did the same. Neither can be fixed in code: test AP2437_014 established that
the commission percentage is fixed printed text inside each PDF, not a value the portal
merges in at print time, so a corrected document must be produced and re-attached.

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement transcription | `requirements/AP-2437-acceptance-waiver-form-in-chubb-contract-pdf.md` | 2026-09-03 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2437_requirements-analysis.md` | 2026-09-03 |
| Test Plan (IEEE 829) | `qa-artifacts/2-test-plan/AP-2437_test-plan.md` | 2026-09-03 |
| Test Cases | `qa-artifacts/3-test-cases/AP2437_TestCases_001-005.md`, `_006-010.md`, `_011-015.md`, `_016-020.md`, `_021-023.md` | 2026-09-03 |
| Test Case Peer Review | `qa-artifacts/3-test-cases/AP2437_ReviewFindings_2026-09-03.md` | 2026-09-03 |
| Execution Log | `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2437_2026-09-03.md` | 2026-09-03 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2437_bug-report.md` | 2026-09-03 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2437/` (9 files) | 2026-09-03 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2437_test-report.md` | 2026-09-04 |

All AP-2437 artifacts carry spec-scoped filenames because the pipeline's default filenames
already hold the completed AP-2436 cycle. Anyone or any skill looking for "the test plan"
or "the requirements analysis" for AP-2437 must open these files by name.

---

## Risks and Observations

- **The blocker was not what the plan predicted, and that is good news.** The plan assumed
  the contract download route was unmapped. It is not — `/creditor-insurance-contracts`
  exists and loads correctly. The real obstacle is that Dealer 1380 has **no Chubb
  creditor-insurance contract at all**; the page reports "No entities found". A missing
  route would have been a development question; missing test data is something the team
  can fix this week.

- **Creating that test data has a real-world side effect, which is why it was not done.**
  The path is `/quote/{id}/details` → *Add a financing* → then insurance. Binding the
  insurance calls the insurer's live development API and creates a durable contract record
  on a shared staging environment. That goes beyond what the designed cases contemplate and
  was left for the QA team to authorise.

- **Two long-standing questions were answered without asking anyone.** The commission
  percentage is fixed text inside each supplied PDF rather than merged per dealership
  (Q-007, answered — and it is what makes AP-2457 un-fixable in code). And the Quick Quote
  page's **Form** dropdown offers exactly "Monthly Premium PM30" and "Monthly Premium PM50",
  of which only PM50 contains the characters "50" — a strong candidate answer to what the
  acceptance criteria mean by *"the insurance table rate contains 50"* (Q-002). Strong
  candidate, not confirmation; the developer should still say so in writing.

- **The single most important requirement in this story is still unwritten.** The Jira
  acceptance-criteria field states four decision conditions and leaves **all four outcomes
  blank** — which of the four PDFs each branch selects appears nowhere. The five branch
  test cases assert against a mapping inferred from the attachment filenames. Even if the
  environment were ready tomorrow, a pass from those five would only mean "the build agrees
  with our guess" (Q-001).

- **`qpdf` remains unverified, on staging and in production.** The fix depends on this
  command-line tool being installed on every server that prints a contract. No contract
  download was attempted, so its presence was never exercised. Code that works in one
  environment and returns a server error in the next, with no warning until a dealer clicks
  print, is the highest-probability way this story fails on release day (Q-005).

- **The suite has no security coverage that has actually run.** AP2437_023 — whether one
  dealership can fetch another's contract PDF by its URL — is blocked like the rest. The
  document in question now carries client names, premiums and coverage.

- **The project still has no `domain` knowledge source.** Thirteen open questions were
  raised for this one story, most of which a written record of the product's business rules
  would have answered or at least shown as already asked. The same pattern cost the AP-2436
  cycle four blocked cases and nine developer questions. This is now a repeating tax, and
  binding that source is the cheapest structural fix available to this project.

---

## Recommendations

1. **Correct the two "30 %" disclosure forms and re-attach them to AP-2437 (AP-2457, High, P1).**
   Or, if the lower tier genuinely has no disclosure obligation, reword AC-7, which today
   states the requirement unconditionally. Either way this is a decision for the product
   owner, and it blocks release regardless of what the code does.
2. **Rule on whether the signature date satisfies the "before the sale concluded"
   requirement (AP-2458, Medium, P2).** Two outcomes are acceptable — add a sentence to the
   four forms, or close AC-8 with a written note. What is not acceptable is leaving it
   silent, because the story states it as a requirement.
3. **Create one Chubb creditor-insurance contract on staging for Dealer 1380.** This single
   act unblocks 17 of the 20 blocked cases. QA can do it through the financing flow with
   the team's go-ahead, or a developer can seed it directly — seeding is preferable, as it
   avoids calling the insurer's API.
4. **Answer Q-001 in writing on the ticket: which of the four attached PDFs does each
   decision branch select?** Without this the five branch tests cannot be scored, only
   compared against a guess. This is the shortest, highest-value message anyone can send
   about this story.
5. **Confirm `qpdf` is installed on staging and that production provisioning includes it.**
   If the answer for production is no, that is a release blocker discovered now rather than
   on deployment day.
6. **Then re-run the full suite**, in this order: AP2437_001–005 (does it work at all),
   AP2437_006–010 (the four branches, once Q-001 lands), AP2437_021–023 (two contracts,
   re-download, authorisation), and finally the negative and performance cases.
7. **Bind the `domain` knowledge source before the next story** — create
   `qa-artifacts/qa-docs/` and write down what has been learned about this product. Two
   cycles have now paid the same cost for its absence.
8. **Fix `--output-dir` in `.mcp.json`.** The browser server is writing throwaway logs into
   the evidence folder. Harmless to these results, but it will eventually put a disposable
   file where an auditor expects evidence.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | ❌ FAIL | _(automated)_ | 2026-09-04 |
| QA Lead | Vinh Le - QC | Pending | | |
| Development Lead | Minh Lưu | Pending | | |
| Product Owner | Ken Nguyen | Pending | | |
