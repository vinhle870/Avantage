# Requirements Analysis Report

**Project:** Avantage Plus v2 — AP-2374 Status Change email notification: Add notify email and client email
**Date:** 2026-11-01 · re-run 2026-11-15 (Step 3c knowledge lookup on every Open question)
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

**Update 2026-11-15 — knowledge lookup.** Every open question was checked against Jira
Stories and Tasks. The claim's `notify_email` is set through the Admin API (field
`notifyEmail` on `POST /api/admin/claim`, Stories AP-2357 and AP-2372), not on any form,
so the recipient-list tests (REQ-002, REQ-003) can now run on a claim created through that
API. The PDF content is defined by AP-2387. No Story defines the message wording, subject,
default checkbox state, validation or attachment rules, so the build's current behaviour
is accepted for those — except that REQ-004 AC 1 still requires the sentence "The claim ID
… has been updated to status …", which the last run did not find in any email. No question
remains Open, so nothing blocks the test plan; the plan and test cases are now stale and
must be redone.

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
| The ticket does not say whether the checkbox starts ticked or unticked (Q-002). | Low | Accepted 2026-11-15: ticked on open on the Authorized and Refused forms is the expected default; the label itself must still read ‘Notify by email’ (AC 1). |
| The admin claim screens and the Change status control have never been mapped, so the route to a claim and the button label are unknown to the test designer. | Medium | Closed 2026-11-01: mapped on Dev in `qa-docs/claims.md` (`/admin/claim/{id}/details` → Change status dropdown → `/admin/claim/{id}/change-status?status=…`). |

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
| `notify_email` is a database field name. The ticket does not say where an admin can see or set it, so the expected value may be hard to confirm from the UI. | Medium | Answered 2026-11-15 (Q-010, AP-2357 / AP-2372): no form sets it; the test creates the claim through the Admin API (`POST /api/admin/claim` with `notifyEmail` set to a fresh test inbox, key `AVP_ADMIN_API_KEY`) as setup, then judges the pre-filled recipient list in the Change status form against that address. |
| Behaviour when one or both addresses are empty, or both are the same, is not described (Q-003). | Medium | Accepted 2026-11-15: assert the observed result (no notify email → the client email alone, no stray comma); record the other combinations and accept them unless an objective fault appears. |
| Whether the field can be edited, and how invalid or empty input is handled, is not described (Q-004). | Medium | Accepted 2026-11-15: assert the observed result (editable; invalid or empty list saves with "Claim saved", no email sent). |

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
| The ticket does not say that **no** email is sent when the box is unticked (Q-007). | Low | Accepted 2026-11-15: an unticked submit saves the status and sends no email — asserted. |
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
| The message is given with a fixed claim number (48618) and a placeholder (`{{STATUS}}`). The ticket never says that the number is to be replaced by the claim's own ID and the placeholder by the new status name, so the exact expected text cannot be written from the ticket (Q-001). | High | Accepted 2026-11-15 (Q-001): the test judges the email against the AC sentence "The claim ID … has been updated to status …" — its absence is a FAIL — and records which claim number and status label stand in for 48618 and {{STATUS}}, accepting those values. Copy the received text word for word as evidence. |
| The QA's 2026-01-07 comment says the email carried more than this message and asks whether it "should only be" the message. No answer in the ticket (Q-005). | Medium | Accepted 2026-11-15: extra text is allowed and recorded; it is never a FAIL on its own, but the AC sentence must still be present (Q-001). |
| No email subject is stated (Q-006). | Low | Accepted 2026-11-15: subject "Claim updated" is asserted as observed. |

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
| What is sent for a claim with no attachments is not described (Q-008). | Low | Accepted 2026-11-15: only the claim PDF (`claim-{id}.pdf`) is attached — asserted. |
| What the PDF must contain beyond "the claim details page" — which fields, language, file name — is not described (Q-009). | Medium | Answered 2026-11-15 (AP-2387): assert the claim status is shown before “Contract information” in the details page's colour and the Avantage Plus logo is at the top; file name `claim-{id}.pdf` accepted; language recorded. |
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
| Q-001 | The message is written as "The claim ID 48618 has been updated to status {{STATUS}}". Must the email show the claim's own ID in place of 48618 and the new status name in place of {{STATUS}}? If so, which status label (as shown in the status list, or another wording)? | REQ-004 | Blocking | Accepted | No Story/Task defines it (searched: "updated to status", "claim ID updated status", "has been updated to status", "claim updated email message") — current actual result accepted **only for the two values**: which number stands for 48618 and which label stands for {{STATUS}} are recorded at execution. **The AC wins on the sentence itself:** REQ-004 AC 1 requires the message "The claim ID … has been updated to status …", so its absence cannot be accepted. Latest execution (2026-11-01, claim 331, Refused and Authorized emails): sentence present = false, claim ID in body = false. AP-946 ("the admin user will receive an email notification telling them that the claim ID XXX has been updated") defines a different email — the admin users' own claim notification — and does not define this one | Ken Nguyen (reporter) |
| Q-002 | Is the ‘Notify by email’ checkbox ticked or unticked when the form opens? | REQ-001 | Judgement | Accepted | No Story/Task defines it (searched: "Notify by email checkbox", "notify customer by email") — current actual result accepted: ticked on open on the Authorized and Refused forms; the Pending form shows "Notify customer by email", unticked (execution log 2026-11-01, AP2374_001 step 4). The label is not accepted — AC 1 names the checkbox ‘Notify by email’ (the forms without it are bug AP-2509) | Ken Nguyen |
| Q-003 | What should the recipient field show when the claim has no `notify_email`, when the contract has no client email, when both are empty, or when both are the same address? | REQ-002 | Judgement | Accepted | No Story/Task defines it (searched: "Recipient email separate commas", "recipient emails validation") — current actual result accepted: no notify email → the client email alone, no stray comma (AP2374_008, claim 332). No client email, both empty and both equal: recorded at execution | Ken Nguyen |
| Q-004 | Can the admin edit the recipient list before sending, and what happens when it holds an invalid address or is empty while the box is ticked? | REQ-002, REQ-003 | Judgement | Accepted | No Story/Task defines it (searched: "Recipient email separate commas", "recipient emails validation") — current actual result accepted: the field is editable; an invalid address (`not-an-email`) and an empty list both save with "Claim saved", no validation message, no email sent (AP2374_009) | Ken Nguyen |
| Q-005 | Must the email body contain only the stated message, or may it contain other text? (Asked by the QA on 2026-01-07; no reply in the ticket.) | REQ-004 | Judgement | Accepted | No Story/Task defines it (searched: "claim updated email message", "claim email template", "claim refused email", "claim authorized email") — current actual result accepted for the **other** text: the body is a full letter per status (Refused: "Hello, Following the review of your claim …"; Authorized: "Hello, Thank you for your claim request …"), AP2374_005. The AC does not forbid extra text, but it still requires its own sentence (see Q-001) | Ken Nguyen |
| Q-006 | What should the email subject be? | REQ-004 | Judgement | Accepted | No Story/Task defines it (searched: "claim updated email subject", "claim email template") — current actual result accepted: subject "Claim updated", sender "Systeme Avantage Plus <no-reply@garantieavantageplus.ca>" (AP2374_003 step 5) | Ken Nguyen |
| Q-007 | When the form is submitted with the box unticked, must no email be sent? | REQ-003 | Judgement | Accepted | No Story/Task defines it (searched: "Notify by email checkbox", "notify customer by email") — current actual result accepted: an unticked submit saves the status and sends no email (AP2374_007, claim 331 Refused at 17:10:19Z) | Ken Nguyen |
| Q-008 | What is attached when the claim has no attachment files — only the claim details PDF? | REQ-005 | Judgement | Accepted | No Story/Task defines it (searched: "claim attachments email", "claim PDF attachment email", "claim details PDF"; read AP-2365, which defines the claim attachment types Invoice / Work order / Other but not the email) — current actual result accepted: only the claim PDF, `claim-332.pdf` (AP2374_010) | Ken Nguyen |
| Q-009 | What must the claim details PDF contain (which fields, language, file name)? | REQ-005 | Judgement | Answered | AP-2387 (Story, Done) "Claim PDF changes": "When a claim PDF is generated … The claim status is displayed before “contract information” • The claim status value is displayed one size bigger and contains the same color code as on the claim details page • The Avantage Plus logo is displayed on the top of the page". AP-2385 (Story, Done): "The claim PDF is downloaded instead of the print prompt" (the claim details page's Print button gives the same claim PDF). File name and language are not defined (same searches) — current actual result accepted: `claim-{id}.pdf` (e.g. `claim-331.pdf`, made by wkhtmltopdf, AP2374_006 step 4); language recorded at execution | Ken Nguyen |
| Q-010 | Where is a claim's `notify_email` set — which form or field, or is an input for it part of this ticket? No claim form on Dev (dealer or admin) has a notify-email input, so the recipient list only ever holds the client email. *(Raised from Info to Blocking on 2026-11-01 after s4 and review R3: AC 2 and AC 3 cannot be judged until it is answered; AP2374_002–004 BLOCKED. Posted on AP-2374 in the s7 result comment.)* | REQ-002, REQ-003 | Blocking | Answered | AP-2357 (Story, Done) "Admin API: create claim": `POST /api/admin/claim` payload field "notifyEmail · string · Additional email to send notifications when clain is approved" and Then 6: "a new field called notify_email is saved"; AP-2372 (Story, Done) "Admin API: Replace Claim" carries the same field on `PUT /api/admin/claim/{claimId}`. So the notify email is set **through the Admin API**, not a UI form — no Story defines a form input for it (searched: "notify email claim", "notify_email", "claim notify email field"). The AC still wins: REQ-002 AC 2 requires the notify email in the recipient list, so a claim created or replaced through the Admin API with `notifyEmail` is the test data for AP2374_002–004; the current single-address behaviour is not accepted | Ken Nguyen |

**Re-checked 2026-11-15 (Step 3c knowledge lookup).** No question is Open. Q-009 and Q-010
are **Answered** from Jira Stories (quotes above). Q-001–Q-008 are **Accepted**: no Story
or Task defines them, so the build's current behaviour is the expected result — except
where the ticket's own acceptance criterion states the result, which still wins (Q-001:
the sentence "The claim ID … has been updated to status …" is required; Q-002: the label
‘Notify by email’ is required; Q-010: the notify email must be in the recipient list).
No AP-2374 comment since capture answers a question: the only new comments are the QA's
own (19433, 19445 and the 2026-11-08 question screenshots). Ken Nguyen's 2025-12-18
comment is still not used as an answer (he is in the registry's `not_developers`).
Nothing from this lookup is posted to Jira.

**Reworded 2026-11-15 after review R1 (minor F-1):** the per-requirement risk tables no
longer advise keeping cases BLOCKED or record-only for questions now Answered or
Accepted; each row states how the answer is tested.

### Knowledge lookup log — 2026-11-15

Query (Jira adapter, *knowledge lookup*): `issuetype in (Story, Task) AND text ~ "<words>"`, any status, project AP.

| Question | Word sets tried | Plausible hits read | Defines it? |
|---|---|---|---|
| Q-001 | "updated to status"; "claim ID updated status"; "has been updated to status"; "claim updated email message" | AP-946 | No — AP-946 defines the admin users' own notification ("claim ID XXX has been updated"), sent when the dealer changes the status; not this email |
| Q-002, Q-007 | "Notify by email checkbox"; "notify customer by email" | AP-2109 (Change status window, Good Will checkbox) | No — only AP-2374 matches the words |
| Q-003, Q-004 | "Recipient email separate commas"; "recipient emails validation" | AP-28 (contract e-signature) | No |
| Q-005, Q-006 | "claim updated email message"; "claim updated email subject"; "claim email template"; "claim refused email"; "claim authorized email" | AP-1960, AP-1874 | No — AP-1874 is the contract PDF's claims-procedure text; AP-1960 is contract cancellation |
| Q-008 | "claim attachments email"; "claim PDF attachment email"; "claim details PDF" | AP-2365 | No — AP-2365 defines claim attachment types and upload (pdf, image, json, csv), not what the email carries |
| Q-009 | "claim details PDF"; "claim PDF attachment email" | AP-2387, AP-2385 | Yes — AP-2387 (PDF content); file name and language not defined |
| Q-010 | "notify email claim"; "notify_email"; "claim notify email field" | AP-2357, AP-2372, AP-267, AP-2536, AP-1874 | Yes — AP-2357 / AP-2372 (Admin API field `notifyEmail`) |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-004 | Message given with a fixed claim number and a placeholder; real expected text not stated (Q-001) | High | Accepted 2026-11-15 — the sentence is required by AC 1; the two values are recorded at execution |
| REQ-004 | Whether the body may contain more than the message is unanswered (Q-005) | Medium | Accepted 2026-11-15 — extra text allowed |
| REQ-002 | `notify_email` location in the UI unknown; expected recipient may not be observable (Q-010) | High | Answered 2026-11-15 — set through the Admin API (AP-2357, AP-2372); the tests need an Admin API key to create the claim |
| REQ-002 | Empty / duplicate address behaviour not stated (Q-003) | Medium | Accepted 2026-11-15 |
| REQ-003 | Delivery depends on an undescribed external mail service; proved only through real inboxes | Medium | Open |
| REQ-005 | PDF content not defined (Q-009) | Medium | Answered 2026-11-15 — AP-2387 |
| REQ-001–005 | Admin Claims area not mapped in project knowledge | Medium | Closed — mapped 2026-11-01 in qa-docs/claims.md |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [x] Ready to proceed to Test Plan Design — 2026-11-15: no question Open; the plan and cases must add Admin API claim creation with `notifyEmail` (Q-010) and judge REQ-004 against the AC sentence (Q-001)
