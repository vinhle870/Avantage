# Requirements Analysis Report

**Project:** Avantage Plus v2 (Jira project AP)
**Date:** 2026-11-01
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** requirements/AP-2491-cleanup-deprecated-functions.md
**Total requirements found:** 1

---

## Executive Summary

One requirement was extracted from ticket AP-2491, "Cleanup deprecated functions". The ticket has no description, no acceptance criteria, no comments and no attachments, so the summary line is the only requirement text. A "deprecated function" is code the developers have marked as no longer to be used; cleaning it up normally means deleting it, which users should not notice. Because the ticket does not say which functions were removed, which portal (Dealer, Admin or Client) or screens they served, or what a user should observe afterwards, no expected result can be written from the ticket's own words. One Blocking question and one Judgement question are raised. Overall testability is rated LOW: nothing can be tested until the author names the removed functions and the areas they touched.

---

## Requirements Detail

### REQ-001 — Cleanup of deprecated functions

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. A plausible reading would be "As the development team, we want deprecated functions removed so that the code base is easier to maintain", but that is an inference, not a requirement, and no test result relies on it. |
| **Priority** | Medium — taken from the ticket's own Jira priority; the ticket gives no business reason to raise or lower it. |
| **Source File** | AP-2491-cleanup-deprecated-functions.md |
| **Recommended Test Types** | Regression · Functional (once the affected areas are named) |

**Acceptance Criteria:**

None stated in the ticket. No criterion is invented here; the gap is raised as Q-001 (Blocking).

**Out of Scope:**

- None stated.

**Data entities touched:**

- Not known. The ticket does not name the functions removed, so the records they read or wrote (quotes, contracts, vehicles, invoices, configuration) cannot be listed.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| No acceptance criterion and no description — there is no definition of "done" and no observable outcome to check. | High | The author lists the functions removed and states what a user should see (normally: no change in behaviour on the named screens). Until then the requirement cannot be signed off; the business risk is that a removal breaks a screen nobody thought to check. |
| The affected portal, screens and flows are not named, so the regression scope is unknown. | High | The author names the screens or flows that used the removed functions, so regression cases can target them instead of re-testing the whole application. |
| No failure path is described — it is not said whether a removed endpoint or route should now return an error, redirect, or simply no longer be reachable. | Medium | The author states the expected behaviour for any removed route or endpoint that a user or integration could still call. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Cleanup of deprecated functions | ✓ | | | ✓ | ✓ | | | |

**Legend:** ✓ = recommended based on requirement content. Functional and UI apply only to the screens the author names in answer to Q-001; regression is the main test type for a code cleanup.

---

## Open Questions

Points the requirement leaves unsettled. **Impact** says what each one does to testing:
*Blocking* — an acceptance criterion cannot be judged until it is answered, so its test
cases stay BLOCKED and the story cannot be released; *Judgement* — the main result is
testable, and the test records what the build does on this point instead of guessing;
*Info* — no test result depends on it. Classification test: SKILL.md Step 3b.

| # | Question | Raised against | Impact | Status | Answer (quoted, with source) | Assigned to |
|---|---|---|---|---|---|---|
| Q-001 | Which deprecated functions were removed, which portal (Dealer, Admin or Client) and which screens or flows used them, and what should a user observe on those screens after the cleanup (for example: no visible change)? The ticket has no description or acceptance criteria, so no expected result can be written. | REQ-001 | Blocking | Open | — | Nicolas-Eric Tain (reporter and assignee) |
| Q-002 | Did the cleanup remove any route, page or API endpoint that a user or an integration could still call directly? If so, what should that call return now (an error page, a redirect, HTTP 404)? | REQ-001 | Judgement | Open | — | Nicolas-Eric Tain |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-001 | No description and no acceptance criteria — no definition of done | High | Open |
| REQ-001 | Affected portal, screens and flows not named — regression scope unknown | High | Open |
| REQ-001 | Behaviour of removed routes or endpoints not described | Medium | Open |

---

## Sign-off Checklist

- [ ] All requirements have at least one acceptance criterion — REQ-001 has none (Q-001)
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design — blocked by Q-001
