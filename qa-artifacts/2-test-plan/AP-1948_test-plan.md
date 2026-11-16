# Test Plan

**Plan ID:** TP-20261115-001
**Project:** Avantage Plus v2 — Client portal (AP-1948 CBI / CVE Tesla Price modification)
**Version:** 2.1 — 2026-11-15 09:20 UTC: REQ-003 planned against Q-002 Accepted (Tesla term price = suggested retail price, nothing added; the "Original ask" figures are background), Q-004/Q-005/Q-006/Q-010 Accepted (record-and-accept), §3.2 Negative row aligned with AP1948_005 step 2. Version 2.0 — re-plan after the answers to Q-001 (comment 19545) and Q-003 (comment 19544), and the reporter's note that the CVE program is disabled (fact F-1). Replaces version 1.0 (TP-20261101-001, 2026-11-01)
**Date:** 2026-11-15
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-1948_requirements-analysis.md (2026-11-15, Gate A approved by reviewer R1 round 3, rule A3 — no Blocking + Open question)
**Total requirements:** 3 (REQ-001 – REQ-003)

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify that the program terms offered on the Client portal follow the **category configured on the test vehicle's model** in the admin area (REQ-001). Ken Nguyen's answer to Q-001 (comment 19545) makes this testable: "test it based on the cateogry configured for your model".
2. Verify that a term whose eligibility categories exclude the model's category is **not** offered (REQ-001, negative). Where no active term already excludes the model's category, the case changes the model's category in the admin and restores it in the same case.
3. Verify that the price the Client portal shows for a selected term equals the *suggested retail price* configured on that program term (REQ-002), and that a change to that price in the admin reaches the customer.
4. Verify that every term offered on the Client portal for a Tesla Model 3, Y, S or X is priced at that term's suggested retail price with nothing added (REQ-003, Q-002 Accepted 2026-11-15). The "Original ask" figures (2500$–2900$, +200$ / +800$) are background, not acceptance criteria, and no case expects them.
5. Where the ticket is silent, record what the build does and accept the current result found by the 2026-11-15 knowledge lookup (record-and-accept): a category with no term (Q-004), price format (Q-005), price refresh and carry-over (Q-006), and eligibility settings other than category (Q-010). Record whether the CVE program's terms are still offered on Dev (fact F-1) — their absence is not a failure.

The ticket shipped in 1.39.0 (April 2024) and the reporter accepted it as live on 2024-04-03, so this cycle is in practice a regression check (*regression* = checking that something that used to work still works).

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | Program terms filtered by the vehicle model's configured category — filter cases AP1948_004 (functional), AP1948_005 (negative), AP1948_006 (edge case: a category with no term) | Functional · Negative · Edge-case · UI |
| REQ-002 | Term price equals the program term's suggested retail price — price cases AP1948_001, AP1948_002, AP1948_003, AP1948_009 | Functional · Edge-case · Regression · UI |
| REQ-003 | Tesla term price = suggested retail price with nothing added (Q-002 Accepted) — AP1948_007 (Model 3 / Y, Category A on Dev), AP1948_008 (Model S / X, Category B on Dev) | Functional · Regression · UI |

AP1948_001 and AP1948_009 are REQ-002 **price** cases (term 16, non-CVE). The REQ-001 **filter** cases are AP1948_004–006, and none of them depends on a CVE term.

Comment 19544 places "Tesla and other BEV vehicles" in scope. This cycle tests the filter on a Tesla; another BEV make is a coverage candidate for the test-case review, not a requirement of this plan.

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| Re-enabling the CVE program, on any environment | The reporter disabled it on purpose for a business reason (comment 19544). Turning it back on would test a configuration the business withdrew and would change shared data other tickets read |
| Dealer-portal and admin-portal quoting prices | The ticket's component is *Client portal* and its Given names the customer portal only. The admin area is used only to read or temporarily change a term's price and a model's category |
| Paying on the Stripe checkout page | `test-data` holds no Stripe test card. AP1948_003 stays BLOCKED at the payment page until one is added |
| Contract generation and invoicing after payment | Not mentioned in the ticket |
| API, performance and accessibility testing | Nothing in the ticket implies them; the project tests through the UI only (`api-baseline` is a declared gap) |
| French-language display | Not mentioned; the run uses the default English page |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end in the browser: read or change configuration in the admin area, then see its effect on the Client portal | QA Agent |
| Integration Testing | N/A — no API contract is described; the admin → Client portal link is covered at system level | — |
| Regression Testing | Re-verification that the pricing accepted live in April 2024 still holds | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | REQ-001: for the test vehicle, read its model's configured category, then check that every term offered on "Select Coverage" ticks that category on its admin edit page. REQ-002: select a term, read the Summary page "Subtotal", compare with the term's admin "Suggested retail price" | playwright |
| Negative | REQ-001: a term that excludes the model's category must not be offered (AP1948_005). **Path A** only when an active non-CVE term T that does not tick the model's category belongs to a program that already has an offered term S, and T matches S on fuel type, vehicle type, eligibility years and km — then only the category separates T from S. **Path B** otherwise: change the model's category to an allowed value Y that an offered non-CVE term T (prefer 16) does not tick, check that T disappears, and restore the category in the same case. Before either path, the model's category must equal the X recorded by AP1948_004 | playwright |
| Edge-case | Switching between terms (REQ-002); a model category that no offered term ticks — the empty-state display is record-only for Q-004 (REQ-001) | playwright |
| UI / Visual | Screenshots of "Select Coverage", the Summary page and the admin fields read or changed | playwright screenshots |
| API | N/A — not in scope (§2.2) | — |

**How open questions shape the cases.** No Blocking question is open. Q-001 and Q-003 are answered and are asserted like acceptance criteria. Q-002, Q-004, Q-005, Q-006 and Q-010 are **Accepted** (2026-11-15 knowledge lookup — no Story or Task defines them): the steps that touch them are record-and-accept — they record what the build shows and accept the current result the analysis cites, and fail only on an objective fault (an offered term that does not tick the model's category, a price that differs from the admin value, an error page) or where the ticket's AC says otherwise. For REQ-003 that means price = the term's suggested retail price with no +200$ / +800$. On Dev the CVE terms 122–126 tick only Category A and Model S / X are Category B, so a Model S / X is likely offered only term 16; a CVE term missing for a Category B model follows the category rule and is not a FAIL. AP1948_007 / 008 are BLOCKED only when no term is offered.

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **playwright** (`mcp__playwright__*`, state `active` in `qa-artifacts/qa-config/tools.md`), on the **Dev** environment (`execution_env: Dev` in the registry's QA orchestrator selection). The AI agent:
- Drives the browser step by step
- Takes screenshots as evidence under `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/`
- Records PASS / FAIL / BLOCKED per step and per test case

Capability groups this pipeline needs: `tracker` (jira, active), `browser` (playwright, active). `notify` is `disabled` — no notification is sent, which is not a failure.

**Execution order.** Run the read-only cases first (001, 002, 004, and 007, 008 on this re-run), then the cases that change shared configuration one at a time (009 changes a term price; 005 and 006 may change the model's category), each restoring before the next starts.

---

## 4. Entry Criteria

_What has to be ready before testing can usefully start. Starting before these are
in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [ ] Dev is deployed and reachable at `https://v2dev.garantieavantageplus.ca/` (the `env` source, Dev Environment section), and customer 1493's quote-request page `/customer/1493/quote-request` opens without an error
- [x] `AP-1948_requirements-analysis.md` exists and passed Gate A (rule A2, reviewer R1 round 2, 2026-11-15)
- [ ] The `AP1948_TestCases_*.md` files exist and the review at Gate B is done
- [ ] The pipeline's environment health check passes before execution
- [ ] Test data is available on Dev: the vehicle list entry "2022 TESLA Model 3 / Long Range" (id 80) offers at least one active term; the admin login works
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds

---

## 5. Exit Criteria

_What has to be true before we can say testing is finished and the release is safe
to consider. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] All High-priority test cases have been executed or recorded BLOCKED with a stated reason
- [ ] Test pass rate ≥ **90%** — the registry's `story_pass_threshold`. BLOCKED cases count as not passed; with AP1948_003 BLOCKED on the Stripe test card the best case is 8 of 9 = 89%
- [ ] Zero **Critical** severity bugs remain open
- [ ] **High** severity bugs ≤ 0 open — a wrong customer price or a wrong-category term is High, and one is enough to stop the release
- [ ] Every shared value a case changed (term 16's suggested retail price; the test model's category) is confirmed restored in the execution log
- [ ] `AP-1948_test-report.md` has been generated and reviewed
- [ ] All tracker tickets listed in `AP-1948_bug-report.md`

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and
what has to be fixed before we pick it back up._

### Suspend testing when:
- Dev is inaccessible for more than **30 minutes**
- More than **30%** of test cases are blocked by a single defect
- A **Critical** severity bug is found that prevents further execution
- Customer 1493's Client portal link returns an error page — it is the only known entry point
- A model category or term price that a case changed cannot be restored — stop all further cases and report the value left changed

### Resume testing when:
- The blocking issue is resolved and confirmed by the dev team
- Dev is stable for at least **15 minutes**
- A patch has been deployed addressing the blocking defect
- A Stripe sandbox test card is added to `test-data` — re-run AP1948_003

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | Dev — `https://v2dev.garantieavantageplus.ca/`; Client portal `/customer/1493/quote-request` (no login); admin area `/admin/login` with the Dev admin account (`env` source, Dev Environment section) |
| **Browser** | Chromium (Playwright default), viewport 1280 × 800 |
| **OS** | Windows 11 |
| **Application version** | Not known — the ticket's fix version is 1.39.0 (released 2024-04-04); Dev runs a later build, which the UI does not expose as far as QA knows |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/` |
| **Bug tracker** | jira — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Client portal customer | Customer 1493 — the only known Client portal link; exists on Dev (2026-11-01) | Static — named in the Execution Context |
| Customer's vehicle | Picked from the fixed list "I'd like a warranty for a*". Price and filter cases use "2022 TESLA Model 3 / Long Range" (id 80; offered terms 16 and 122–126 on 2026-11-01 and 2026-11-15); AP1948_002 and AP1948_007 use a 2023 TESLA Model Y entry (id 81); AP1948_008 uses a "2022 TESLA Model S" and a "2022 TESLA Model X" entry (both listed on Dev, 2026-11-01). Vehicle model categories on Dev (2026-11-15): Model 3 #3124 A, Model Y #3126 A, Model S #3127 B, Model X #4725 / #4724 B. The year is not a test condition. Each run also types a VIN, mileage and market value | Entered in a `[Pre-Condition]` step with the list entry and values stated |
| User account (role: admin) | Dev admin login from `env`, to read and change a term's *suggested retail price* and a model's category | Static — `env` source |
| User account (role: standard) | N/A — the Client portal has no login | — |
| Program terms | Active terms with "Category A–E" checkboxes and a "Suggested retail price" on `/admin/program-term/{id}/edit`. Term 16 "L'Avantageuse AT 36m/60000km" (1025, categories A, B, C) is non-CVE. CVE terms 122–126 may be gone on Dev (fact F-1) | Read; term 16's price changed and restored only by AP1948_009 |
| Vehicle model category | The "category" field on each vehicle model in the admin (comment 19545). The admin screen holding it is **not mapped** in any knowledge source — the executor locates it and writes the route back to `qa-docs/admin-portal.md` | Read by AP1948_004; changed and restored only by AP1948_005 (path B) and AP1948_006 |
| Stripe test card | Needed for AP1948_003 to pass the payment page — not in `test-data` | Not available — AP1948_003 BLOCKED at the payment page |

### 8.1 Test Data Classification

Classified with the procedure in `stlc-testcase-designer` SKILL.md → Step 4. First Yes decides; undecided means Dynamic.

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Admin login (Dev) | Static | None applied | Named in the Execution Context, resolved from `env` (Dev Environment section) |
| Client portal link for customer 1493 | Static | None applied | Named in the Execution Context |
| Vehicle picked on the Client portal, with VIN, mileage and market value | Dynamic | Q2 — the terms and price asserted depend on the vehicle picked | Picked in a `[Pre-Condition]` step with the list entry and typed values stated |
| Ownership and Client Info values (name `Marie Tremblay`, fresh `client.stage.NNN@yopmail.com`) | Dynamic | Q4 — a fresh inbox per run | Written into the step; every value recorded in the log |
| Quote request taken to the Stripe checkout | Dynamic | Q1 — does not exist yet | Only AP1948_003; the unpaid checkout session is left on Dev (no cleanup source) |
| Program term *suggested retail price* (read) | Static | None applied — read, not changed | Read on `/admin/program-term/{id}/edit` in a step; the value is recorded, not assumed |
| Program term *suggested retail price* (changed) | Configuration | Q5 — AP1948_009 changes shared configuration | Original recorded, changed to original + 100, restored and confirmed inside AP1948_009 |
| Program term eligibility categories (read) | Static | None applied — read, not changed | Read on the term's edit page; no case ticks or unticks a term's category |
| Vehicle model "category" (read) | Static | None applied | AP1948_004 reads and records it |
| Vehicle model "category" (changed) | Configuration | Q5 — AP1948_005 (path B) and AP1948_006 change shared reference data every quote for that model reads | Original recorded, changed, restored and confirmed inside the same case; the Client portal re-checked after the restore |

Cost of the Dynamic and Configuration items: picking a vehicle and walking to "Select Coverage" takes about a minute and calls no third party QA knows of; walking on to the Summary page adds the ownership and client forms. Changing a model's category affects every quote for that model on Dev for the minutes the case runs, so the change is restored before the case ends. The unpaid Stripe sandbox checkout created by AP1948_003 stays on Dev because `cleanup` is a declared gap.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| Unstable test environment | Medium | High | The pipeline's health check runs before execution |
| The admin screen holding a vehicle model's "category" field is not mapped. Without it, AP1948_004–006 cannot read or set the category | Medium | High | Locate it from the admin sidebar during execution and write the route back to `qa-docs/admin-portal.md` as a dated Dev entry. Not found → the filter cases are BLOCKED "test data not on Dev: model category field not found", never guessed |
| Changing a model's category on shared Dev changes the terms every other tester sees for that model, and could break the AP-1948 automation spec (vehicle id 80) if it is not restored | Medium | High | Only AP1948_005 (path B) and AP1948_006 change it; each records the original, restores it in the same case, re-opens the field to confirm and re-checks the Client portal. Never left changed between cases |
| The CVE program was disabled by the reporter (fact F-1). CVE terms 122–126 may not be offered on Dev | High | Low | Their absence is not a FAIL and no case re-enables CVE. Only AP1948_002 (its second term, 122) used a CVE term; its fallback is any second active term, else BLOCKED "test data not on Dev: second active term". The filter cases never rely on term 122 for the negative check |
| No active term excludes any category the model field allows (for example, if the field allows only A–C and term 16 ticks A, B and C) | Medium | Medium | AP1948_005 and AP1948_006 are then BLOCKED "test data not on Dev", not FAIL |
| Other eligibility settings (fuel type, vehicle type, years, km) may also filter terms — not stated (Q-010) | Medium | Low | Judge only the category rule; record the other settings without a verdict. The negative case uses a term already offered for the vehicle, so only the category differs |
| Ambiguous REQ-003 (Q-002) — closed as Accepted 2026-11-15 | Low | Medium | The expected result is the current one (term price = suggested retail price, nothing added); not posted. If the author later states the figures apply, re-run from analysis |
| Model S / X (Category B) are not offered the Category-A-only CVE terms on Dev, so AP1948_008 may see only term 16 | High | Low | AP1948_008 checks every offered term and records which appear; a missing CVE term follows the category rule and is not a FAIL; BLOCKED only if no term is offered |
| Changing term prices on shared Dev disrupts others | Medium | Medium | Only AP1948_009 changes term 16's price; it restores it in the same case |
| `test-data` has no Stripe test card | High | Low | AP1948_003 stays BLOCKED at the payment page; unblock by adding a Stripe sandbox card to `test-data` |
| playwright unreachable | Low | High | Run the preflight before starting; reconnect if needed |
| The ticket is 2.5 years old; later work may have changed the pricing on purpose | Medium | Medium | A mismatch goes through Gate C; it is not called "not a bug" without a quotable sentence |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-11-15 | Analysis | Requirements re-analysis (done, Gate A approved) | stlc-requirements-analyst |
| 2026-11-15 | Planning | Test plan re-design (this document) | stlc-test-plan-designer |
| 2026-11-15 | Design | Test case redesign and review | stlc-testcase-designer · stlc-testcase-reviewer |
| Next Wave 2 slot | Execution | Manual test execution on Dev via playwright | stlc-manual-executor |
| Same day | Reporting | Bug reporting + ticket creation | stlc-bug-reporter |
| Same day | Reporting | Test report generation | stlc-test-reporter |
| Same day | Closure | Tracker ticket update | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Execute the STLC skills and generate all artifacts |
| QA Lead / Human reviewer | Review artifacts, approve sign-off checklist (gates decided by `stlc-qa-reviewer` on this project) |
| Developer (Ken Nguyen) | Fix defects; answered Q-001; asked Q-002 |
| Product Owner (Eric Lindquist, reporter) | Answered Q-003; may overrule an Accepted result (Q-002, Q-004–Q-006, Q-010); approve exit criteria |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%)
- [ ] Risk mitigations acknowledged by team
