# Requirements Analysis Report

**Project:** Avantage Plus v2 — AP-2435 Admin API: warranty search
**Date:** 2026-11-01
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** requirements/AP-2435-admin-api-warranty-search.md
**Total requirements found:** 5

---

## Executive Summary

AP-2435 adds a search endpoint to the admin API (the programmatic interface that outside systems use instead of the admin web screens). A caller that holds an API key (a secret token that identifies the calling system) sends a GET request to `/api/admin/search-warranty` with a `query` value, and the system returns the warranty contracts that match it. The ticket names three ways a contract can match: the query is part of the contract vehicle's VIN (vehicle identification number), the query is the client's whole postal code with spaces ignored, or the query is the client's whole telephone number with spaces, dots, parentheses and hyphens ignored. This analysis splits the single Given/When/Then block into five requirements: authenticating with the key, the three match rules, and the response format.

The main result of every requirement can be written from the ticket's own words, including worked examples for the postal code and telephone formats, so no question is Blocking. Eleven questions are Judgement. The most visible ones are two contradictions inside the ticket: the text says the key goes "in the Authorization Bearer header" while the example call sends it in an `X-API-KEY` header, and the text says "a JSON array" while the example response is an object holding an `items` array. The tests send the key in both ways the ticket shows and record which one the build accepts, and they check the contract numbers in `items` as the example shows. The ticket is also silent on case sensitivity, no-match and empty-query responses, result limits, which contracts are searchable, and which of a client's phone numbers count. Two questions are Info.

The largest practical risks are test access and test data. The project's knowledge files hold no admin API key, although the admin portal has a "Manage API keys" page (`/admin/api-keys`, seen in an earlier page snapshot) where one may be created. Each search also needs a warranty contract whose VIN, postal code and telephone are known, so test cases must create or locate such a contract first. Overall testability is rated **Medium**.

---

## Requirements Detail

### REQ-001 — Authenticate the search call with the admin API key

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. Derived from the Given/When text: as an admin API user, I want to call the search endpoint with my API key so that the system knows the call is allowed. |
| **Priority** | High — every other requirement depends on the call being accepted, and a search that answers without a valid key would expose client postal codes, phone numbers and contract numbers to anyone. |
| **Source File** | AP-2435-admin-api-warranty-search.md |
| **Recommended Test Types** | Functional · Negative · API |

**Acceptance Criteria:**

1. Given "The admin API user has an API key created", a GET request to "/api/admin/search-warranty?query={{KEYWORD}}" sent "with the api key" is accepted and returns the list of contracts found.

**Out of Scope:**

- How an API key is created or managed. The ticket assumes one already exists ("has an API key created").

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket contradicts itself on where the key goes: the text says "in the Authorization Bearer header", the example call sends `-H 'X-API-KEY: xxx'`. A test that uses only one form could fail a correct build. | Medium | Send the key both ways the ticket shows and record which the build accepts (Q-001). The main result — the list is returned — does not depend on the answer. |
| No admin API key is recorded in the project's knowledge files, and the project has no API test baseline. Without a key, no case in this ticket can run. The base URL is given by the ticket's example call (`https://v2staging.garantieavantageplus.ca`). | High | Create a key on the admin "Manage API keys" page (`/admin/api-keys`) or ask the team for one (Q-012). Keep it in the gitignored `/.env`, never in an artifact. |
| The ticket does not say what happens when the key is missing, wrong or revoked. | Medium | Record the build's response for a missing and an invalid key (Q-002). A search result returned without a valid key is an objective security fault. |

---

### REQ-002 — A query that is part of a contract vehicle's VIN finds that contract

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. Derived: as an admin API user, I want to find warranty contracts by typing part of a VIN so that I can locate a contract when I only know some characters of the vehicle number. |
| **Priority** | High — it is the first match rule the ticket lists, and VIN is the main identifier of the covered vehicle. |
| **Source File** | AP-2435-admin-api-warranty-search.md |
| **Recommended Test Types** | Functional · Edge-case · Negative · API |

**Acceptance Criteria:**

1. "Where query partially matches a warranty contract vehicle VIN": a query equal to part of a contract vehicle's VIN (for example its last 6 characters) returns that contract's `contractNumber` in the result.
2. A query equal to the whole VIN also returns the contract (a whole value is also a part of itself).

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "Partially" is not bounded: no minimum query length, no statement whether the part must be at the start, end or anywhere, and no case rule (VINs are upper case; a lower-case query may or may not match). | Medium | Test a middle fragment, a whole VIN and a lower-case fragment; record the build's behaviour for case and very short queries (Q-003, Q-004). |
| A short fragment may match many contracts, and no result limit or paging is stated. | Low | Record the number of results for a short fragment (Q-008). |

---

### REQ-003 — A query equal to a client's whole postal code finds the contract, spaces ignored

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. Derived: as an admin API user, I want to find warranty contracts by the client's postal code, written with or without its space, so that the format I type does not hide a contract. |
| **Priority** | High — explicitly stated with a worked example. |
| **Source File** | AP-2435-admin-api-warranty-search.md |
| **Recommended Test Types** | Functional · Negative · Edge-case · API |

**Acceptance Criteria:**

1. "OR Where query fully matches a warranty client postal code": a query equal to the client's whole postal code returns that contract.
2. "Make sure that all spaces are removed in the search. Exemple: “H3K7B1”, “H3K 7B1” should all match": the postal code written without a space and with a space both return the same contract.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "Fully" implies a part of a postal code (for example `H3K`) should not match by postal code, but the ticket does not say so in words, and the same fragment could still match a VIN by REQ-002, which makes a "no result" check unreliable. | Medium | Record the result of a postal-code fragment, choosing a fragment that does not appear in any VIN of the test contract; treat it as record-only (Q-005). |
| Case is not stated: Canadian postal codes are written in upper case, and a lower-case query (`h3k7b1`) may or may not match. | Low | Record the build's behaviour (Q-004). |
| The ticket does not say whether the spaces are removed from the stored postal code as well as from the query (a stored `H3K 7B1` searched as `H3K7B1`). The example says both forms "should all match", which covers this only if the stored value is in one of those forms. | Low | Use a contract whose stored postal code has the space and one that does not, if available; otherwise record which form the stored value has. |

---

### REQ-004 — A query equal to a client's whole telephone number finds the contract, punctuation ignored

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. Derived: as an admin API user, I want to find warranty contracts by the client's telephone number written in any common format so that formatting differences do not hide a contract. |
| **Priority** | High — explicitly stated with four worked examples, and the ticket's own example call searches a telephone number (`query=5149779047`). |
| **Source File** | AP-2435-admin-api-warranty-search.md |
| **Recommended Test Types** | Functional · Negative · Edge-case · API |

**Acceptance Criteria:**

1. "OR Where query fully matches a warranty client telephone": a query equal to the client's whole telephone number returns that contract.
2. "Make sure that all spaces, dots, parentheses and hyphens are removed in the search. Exemple: “123-123-1234”, “1231231234”, “123.123.1234”, “(123) 123-1234“ should all match": each of the four formats of the same number returns the same contract.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| A client can carry more than one telephone (the project already tracks a work-versus-home phone question on AP-2463). The ticket says "a warranty client telephone" without saying which ones are searched. | Medium | Search the main phone first; record whether other phone fields also match (Q-006). |
| Formats beyond the four examples (a leading `+1` or `1`, an extension) are not covered. | Low | Record the result for `+1 514-977-9047` as record-only (Q-007). |
| A partial phone number should not match by phone ("fully"), but the same digits could match part of a VIN. | Low | Record-only, with a fragment that does not appear in the test contract's VIN (Q-005). |
| The query values contain characters that must be URL-encoded in a GET request (space, parentheses). A client that does not encode them may get an error that is not a product fault. | Low | Encode the query in every test step (space as `%20`, `(` as `%28`, `)` as `%29`). |

---

### REQ-005 — The response lists the contracts found

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. Derived: as an admin API user, I want the matching contracts returned in a predictable JSON form so that my system can read them. |
| **Priority** | High — the response is the only output of the endpoint. |
| **Source File** | AP-2435-admin-api-warranty-search.md |
| **Recommended Test Types** | Functional · Negative · Edge-case · API |

**Acceptance Criteria:**

1. "The list of contracts found is returned as a JSON array matching the following": the body is JSON (JavaScript Object Notation, the text data format APIs exchange) shaped like the example — `{"items": [{"contractNumber": "CVE-815"}, {"contractNumber": "CVE-793"}]}` — with one entry per matching contract, each carrying its `contractNumber`.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The text says "a JSON array" but the example is an object with an `items` array. | Low | Check against the example (the more specific statement) and record the actual top-level shape (Q-009). |
| No HTTP status code (the number the server returns to say success or failure) is given for success, no match, or a bad request. | Medium | Record the status codes the build returns (Q-010). |
| No-match and empty or missing `query` responses are not described. | Medium | Record the build's response to a query that matches nothing and to an empty or missing `query` (Q-010). An HTTP 500 (server error) is an objective fault. |
| The ticket does not say which contracts are searchable — only warranty (`CVE-…`) contracts, or also cancelled, draft, PermaPlate or Chubb contracts — and whether a contract matching on two rules appears once or twice. | Medium | Record which contract types appear, and check that a contract matched by two rules is not listed twice as record-only (Q-011). |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Authenticate with API key | ✓ | ✓ | | | | ✓ | | |
| REQ-002 — VIN partial match | ✓ | ✓ | ✓ | | | ✓ | | |
| REQ-003 — Postal code full match, spaces ignored | ✓ | ✓ | ✓ | | | ✓ | | |
| REQ-004 — Telephone full match, punctuation ignored | ✓ | ✓ | ✓ | | | ✓ | | |
| REQ-005 — Response lists contracts found | ✓ | ✓ | ✓ | | | ✓ | | |

**Legend:** ✓ = recommended based on requirement content

**Data entities touched:** admin API key; warranty contracts (contract number, status, type); the contract's vehicle (VIN); the contract's client (postal code, telephone numbers).

---

## Open Questions

Points the requirement leaves unsettled. **Impact** says what each one does to testing:
*Blocking* — an acceptance criterion cannot be judged until it is answered, so its test
cases stay BLOCKED and the story cannot be released; *Judgement* — the main result is
testable, and the test records what the build does on this point instead of guessing;
*Info* — no test result depends on it. Classification test: SKILL.md Step 3b.

| # | Question | Raised against | Impact | Status | Answer (quoted, with source) | Assigned to |
|---|---|---|---|---|---|---|
| Q-001 | Which header carries the key — "the Authorization Bearer header" (text) or `X-API-KEY` (example call)? Are both accepted? | REQ-001 | Judgement | Open | — | Ken Nguyen |
| Q-002 | What does the API return when the key is missing, wrong or revoked? | REQ-001 | Judgement | Open | — | Ken Nguyen |
| Q-003 | Is there a minimum query length for the VIN partial match, and can the part be anywhere in the VIN? | REQ-002 | Judgement | Open | — | Ken Nguyen |
| Q-004 | Is the search case-insensitive for VIN and postal code (for example `h3k7b1`)? | REQ-002, REQ-003 | Judgement | Open | — | Ken Nguyen |
| Q-005 | Should a part of a postal code or of a telephone number return nothing (since those rules say "fully")? | REQ-003, REQ-004 | Judgement | Open | — | Ken Nguyen |
| Q-006 | Which client telephone fields are searched — main phone only, or also work, home and mobile phones? | REQ-004 | Judgement | Open | — | Ken Nguyen |
| Q-007 | Should a number with a country code (`+1 514-977-9047`, `15149779047`) match a stored 10-digit number? | REQ-004 | Judgement | Open | — | Ken Nguyen |
| Q-008 | Is the number of results limited or paged? | REQ-002, REQ-005 | Judgement | Open | — | Ken Nguyen |
| Q-009 | Is the body the object `{"items": [...]}` shown in the example, or a bare JSON array as the text says? Are other fields returned besides `contractNumber`? | REQ-005 | Judgement | Open | — | Ken Nguyen |
| Q-010 | What status code and body are returned for a successful search, a search with no match, and an empty or missing `query`? | REQ-005 | Judgement | Open | — | Ken Nguyen |
| Q-011 | Which contracts are searchable (warranty only, or also cancelled, draft, PermaPlate, Chubb), and is a contract matched by two rules listed once? | REQ-005 | Judgement | Open | — | Ken Nguyen |
| Q-012 | Which API key should QA use on staging — is one created on the admin "Manage API keys" page (`/admin/api-keys`)? | REQ-001 | Info | Open | — | Ken Nguyen |
| Q-013 | Do API keys have scopes or per-dealer limits that restrict which contracts a key can find? | REQ-001, REQ-005 | Info | Open | — | Ken Nguyen |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-001 | No admin API key known to QA; nothing can be executed without one | High | Open |
| REQ-001 | Key header contradicts itself (Authorization Bearer vs `X-API-KEY`) | Medium | Open |
| REQ-001 | Response to a missing, wrong or revoked key is not specified | Medium | Open |
| REQ-002 | "Partially" not bounded — length, position, case | Medium | Open |
| REQ-002 | No result limit or paging stated | Low | Open |
| REQ-003 | Partial postal code behaviour implied, not stated; overlaps with VIN match | Medium | Open |
| REQ-003 | Case and stored-value spacing not stated | Low | Open |
| REQ-004 | Which client telephone fields are searched is not stated | Medium | Open |
| REQ-004 | Country-code formats not covered | Low | Open |
| REQ-004 | Query characters need URL encoding | Low | Open |
| REQ-005 | "JSON array" vs `{"items": [...]}` example | Low | Open |
| REQ-005 | Status codes, no-match and empty-query responses not specified | Medium | Open |
| REQ-005 | Searchable contract set and duplicates not specified | Medium | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design — yes for design; execution needs an admin API key (Q-012) and a contract with known VIN, postal code and telephone
