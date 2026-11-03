# Requirements Analysis Report

**Project:** Avantage Plus v2 — AP-2374 Status Change email notification: Add notify email and client email
**Date:** 2026-11-01
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** requirements/AP-2374-status-change-email-notification-notify-email.md
**Total requirements found:** 5
**related_docs:** none — the Claims area (admin and dealer) is not mapped in `qa-artifacts/qa-docs/` yet (`navigation-map.md` §4 lists it as the largest unmapped area)

---

## Executive Summary

AP-2374 adds an email notification to the admin **Change status** form of a claim (a
warranty repair request filed against a warranty contract). The form gains a *Notify by
email* checkbox and a *Recipient email(s)* field that is pre-filled with two addresses:
the claim's own notification address (the database field `notify_email`) and the client
email stored on the claim's warranty contract. When the form is submitted with the box
ticked, an email naming the new status is sent to those recipients, carrying the claim's
attached files and a PDF of the claim details page.

Five requirements were extracted from the ticket's Given/When/Then description. The form
controls (REQ-001, REQ-002), the sending (REQ-003) and the attachments (REQ-005) can be
tested from the ticket text. The message wording (REQ-004) cannot be judged as written:
the ticket gives the message as *"The claim ID 48618 has been updated to status
{{STATUS}}"* with a fixed claim number and a placeholder, and does not say what the real
email must contain. That question (Q-001) is **Blocking** for REQ-004 only, so testing of
the other four requirements can go ahead. Eight further points are left unstated —
default state of the checkbox, empty or duplicate addresses, editing and validating the
recipient list, what else the email may contain, the subject, a claim with no attachments
and the content of the PDF. Those are classed **Judgement**: the tests will record what
the build does rather than guess.

Two bugs were already raised against this story and are now Done — AP-2382 (no email
received after submitting with the box ticked) and AP-2392 (message text missing from the
email). The QA's latest comment (2026-01-07) says the AP-2392 symptom was still happening
on staging and that the email body carried more than the stated message; nobody has
replied. Both are regression targets. Overall testability is **MEDIUM**: the admin claims
screens and the way to read the received emails are not documented in the project
knowledge yet, so the first execution will also have to map them.

---

## Requirements Detail

### REQ-001 — "Notify by email" checkbox on the Change status form

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want a *Notify by email* option when I change a claim's status, so that the people following the claim can be told about the change. (Not stated in the ticket — inferred from the description.) |
| **Priority** | High — it is the entry point of the whole feature; without it nothing else in the ticket can happen. |
| **Source File** | AP-2374-status-change-email-notification-notify-email.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. Given the admin user is logged in the admin area and a claim is created, when the user clicks on change status, a checkbox ‘Notify by email’ is available in the form.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket does not say whether the checkbox starts ticked or unticked (Q-002). | Low | Record the default state; do not pass or fail on it. |
| The admin claim screens and the Change status control have never been mapped, so the route to a claim and the button label are unknown to the test designer. | Medium | Map them during the first execution and write them back to `qa-docs/`. |

---

### REQ-002 — Recipient field pre-filled with the claim's notify email and the contract's client email

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want the recipient list filled in for me with the claim's notification address and the client's address, so that I do not have to look them up. (Inferred.) |
| **Priority** | High — a wrong or missing address sends the notification to the wrong person or to nobody, and the client's address is personal data. |
| **Source File** | AP-2374-status-change-email-notification-notify-email.md |
| **Recommended Test Types** | Functional · Edge-case · Negative · UI |

**Acceptance Criteria:**

1. The form has a field ‘Recipient email(s) - separate by commas for multiple recipient’.
2. The field is populated with the claim’s **notify_email** field and the warranty contract’s client email field separated by comma.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| `notify_email` is a database field name. The ticket does not say where an admin can see or set it, so the expected value may be hard to confirm from the UI. | Medium | The test designer finds where the claim shows or sets this address (claim details or claim form) during mapping; if it cannot be seen, the case is BLOCKED rather than guessed. |
| Behaviour when one or both addresses are empty, or both are the same, is not described (Q-003). | Medium | Record-only cases for each combination. |
| Whether the field can be edited, and how invalid or empty input is handled, is not described (Q-004). | Medium | Record-only negative cases. |

---

### REQ-003 — Email sent to the recipient list when the form is submitted with the box ticked

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want submitting the status change with *Notify by email* ticked to send the notification to every listed recipient, so that they learn about the new status at once. (Inferred.) |
| **Priority** | High — sending is the business purpose of the ticket, and bug AP-2382 (email not received) was already raised against it. |
| **Source File** | AP-2374-status-change-email-notification-notify-email.md |
| **Recommended Test Types** | Functional · Negative · Regression |

**Acceptance Criteria:**

1. When the form is submitted and the ‘notify by email’ checkbox is selected, a notification email is sent to the list of ‘Recipient email(s) - separate by commas for multiple recipient’.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The email goes out through an external mail service that the ticket does not describe; delivery can only be proved by reading a real inbox. | Medium | Use public Yopmail inboxes (`test-data`) as the claim's and client's addresses so each recipient's mail can be read. |
| The ticket does not say that **no** email is sent when the box is unticked (Q-007). | Low | Record what happens; do not fail on it. |
| Ken Nguyen's 2025-12-18 comment asks for testing "with that status and with multiple emails", and says it "should work for all statuses". The description itself names no status, so every status is in scope. | Low | Cover more than one target status and more than one recipient. |

---

### REQ-004 — Message text of the notification email

| Field | Value |
|---|---|
| **User Story** | As a recipient, I want the email to tell me which claim changed and its new status. (Inferred.) |
| **Priority** | Medium — wrong wording misinforms the client but does not stop the status change; bug AP-2392 (message text missing) was already raised against it. |
| **Source File** | AP-2374-status-change-email-notification-notify-email.md |
| **Recommended Test Types** | Functional · Regression |

**Acceptance Criteria:**

1. Message: "The claim ID 48618 has been updated to status {{STATUS}}".

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The message is given with a fixed claim number (48618) and a placeholder (`{{STATUS}}`). The ticket never says that the number is to be replaced by the claim's own ID and the placeholder by the new status name, so the exact expected text cannot be written from the ticket (Q-001). | High | Ask the author (posted at Gate A). Keep REQ-004's cases BLOCKED until answered; record the received text as evidence. |
| The QA's 2026-01-07 comment says the email carried more than this message and asks whether it "should only be" the message. No answer in the ticket (Q-005). | Medium | Record the full body; do not fail on extra content until answered. |
| No email subject is stated (Q-006). | Low | Record the subject. |

---

### REQ-005 — Email attachments: the claim's files and a PDF of the claim details page

| Field | Value |
|---|---|
| **User Story** | As a recipient, I want the claim's documents and a summary of the claim attached, so that I have the full picture without logging in. (Inferred.) |
| **Priority** | Medium — missing attachments reduce the value of the email but do not block the status change. |
| **Source File** | AP-2374-status-change-email-notification-notify-email.md |
| **Recommended Test Types** | Functional · Edge-case |

**Acceptance Criteria:**

1. Attachments: the attachment files from the claim’s attachments.
2. Attachments: a PDF of the claim details page.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| What is sent for a claim with no attachments is not described (Q-008). | Low | Record-only case. |
| What the PDF must contain beyond "the claim details page" — which fields, language, file name — is not described (Q-009). | Medium | Check that a PDF is attached and shows this claim's details; record the rest. |
| Reading attachments depends on the inbox service letting files be opened or downloaded. | Medium | Confirm with Yopmail during execution; BLOCK the case if attachments cannot be inspected. |

---

## Data entities touched

| Entity | How the feature uses it |
|---|---|
| Claim | Read (ID, `notify_email`, attachments, details) and changed (status) |
| Claim status history / status list | The target status chosen in the form |
| Warranty contract | Read — its client email |
| Client | Owner of the client email on the contract |
| Claim attachment files | Read and attached to the email |
| Claim details PDF | Generated per send |
| Outgoing notification email | Created per send, one per recipient list |
| Recipient inboxes (Yopmail) | External — where delivery is observed |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Notify by email checkbox | ✓ | | | ✓ | ✓ | | | |
| REQ-002 — Recipient field pre-filled | ✓ | ✓ | ✓ | | ✓ | | | |
| REQ-003 — Email sent to recipients | ✓ | ✓ | ✓ | ✓ | | | | |
| REQ-004 — Message text | ✓ | | | ✓ | | | | |
| REQ-005 — Attachments | ✓ | | ✓ | | | | | |

**Legend:** ✓ = recommended based on requirement content

---

## Open Questions

Points the requirement leaves unsettled. **Impact** says what each one does to testing:
*Blocking* — an acceptance criterion cannot be judged until it is answered, so its test
cases stay BLOCKED and the story cannot be released; *Judgement* — the main result is
testable, and the test records what the build does on this point instead of guessing;
*Info* — no test result depends on it. Classification test: SKILL.md Step 3b.

| # | Question | Raised against | Impact | Status | Answer (quoted, with source) | Assigned to |
|---|---|---|---|---|---|---|
| Q-001 | The message is written as "The claim ID 48618 has been updated to status {{STATUS}}". Must the email show the claim's own ID in place of 48618 and the new status name in place of {{STATUS}}? If so, which status label (as shown in the status list, or another wording)? | REQ-004 | Blocking | Open | — | Ken Nguyen (reporter) |
| Q-002 | Is the ‘Notify by email’ checkbox ticked or unticked when the form opens? | REQ-001 | Judgement | Open | — | Ken Nguyen |
| Q-003 | What should the recipient field show when the claim has no `notify_email`, when the contract has no client email, when both are empty, or when both are the same address? | REQ-002 | Judgement | Open | — | Ken Nguyen |
| Q-004 | Can the admin edit the recipient list before sending, and what happens when it holds an invalid address or is empty while the box is ticked? | REQ-002, REQ-003 | Judgement | Open | — | Ken Nguyen |
| Q-005 | Must the email body contain only the stated message, or may it contain other text? (Asked by the QA on 2026-01-07; no reply in the ticket.) | REQ-004 | Judgement | Open | — | Ken Nguyen |
| Q-006 | What should the email subject be? | REQ-004 | Judgement | Open | — | Ken Nguyen |
| Q-007 | When the form is submitted with the box unticked, must no email be sent? | REQ-003 | Judgement | Open | — | Ken Nguyen |
| Q-008 | What is attached when the claim has no attachment files — only the claim details PDF? | REQ-005 | Judgement | Open | — | Ken Nguyen |
| Q-009 | What must the claim details PDF contain (which fields, language, file name)? | REQ-005 | Judgement | Open | — | Ken Nguyen |
| Q-010 | Where is a claim's `notify_email` set — which form or field, or is an input for it part of this ticket? No claim form on Dev (dealer or admin) has a notify-email input, so the recipient list only ever holds the client email. *(Raised from Info to Blocking on 2026-11-01 after s4 and review R3: AC 2 and AC 3 cannot be judged until it is answered; AP2374_002–004 BLOCKED. Posted on AP-2374 in the s7 result comment.)* | REQ-002, REQ-003 | Blocking | Open | — | Ken Nguyen |

No question is marked Answered. Two questions are Blocking: Q-001 (REQ-004) and Q-010 (REQ-002, REQ-003). Ken Nguyen's 2025-12-18 comment ("it should work for all
statuses") is consistent with the description, which limits no status, but Ken Nguyen is
in the registry's `not_developers`, so it is not used as an answer.

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-004 | Message given with a fixed claim number and a placeholder; real expected text not stated (Q-001) | High | Open |
| REQ-004 | Whether the body may contain more than the message is unanswered (Q-005) | Medium | Open |
| REQ-002 | `notify_email` location in the UI unknown; expected recipient may not be observable (Q-010) | High | Open — Blocking since 2026-11-01 |
| REQ-002 | Empty / duplicate address behaviour not stated (Q-003) | Medium | Open |
| REQ-003 | Delivery depends on an undescribed external mail service; proved only through real inboxes | Medium | Open |
| REQ-005 | PDF content not defined (Q-009) | Medium | Open |
| REQ-001–005 | Admin Claims area not mapped in project knowledge | Medium | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design — REQ-004 waits on Q-001
