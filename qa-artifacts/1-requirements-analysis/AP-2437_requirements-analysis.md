# Requirements Analysis Report

**Project:** Avantage Plus (AP) — Dealer Portal, Chubb creditor-insurance contract printing
**Date:** 2026-09-03
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2437-acceptance-waiver-form-in-chubb-contract-pdf.md` (transcribed from Jira story [AP-2437](https://garantieavantageplus.atlassian.net/browse/AP-2437), including its Given/When/Then acceptance-criteria field, its five attachments and all thirteen ticket comments)
**Total requirements found:** 6

> **File-naming note.** This report is written as `AP-2437_requirements-analysis.md`
> rather than the skill's default `requirements-analysis.md`, because that default file
> already holds the AP-2436 analysis and writing here would have destroyed it. Any skill
> reading "the requirements analysis" for AP-2437 must open this file by name.

---

## Executive Summary

One feature area was analysed from one requirement file: **AP-2437**, which makes the
dealer portal insert an *acceptance-or-waiver form* — the page on which the client
acknowledges having been told what the dealership earns on a credit-insurance sale — into
the Chubb insurance contract PDF automatically, on the contract's first page, choosing
between four versions of that form according to the insurance rate and the contract
language. Six requirements were extracted. **Sixteen testability risks were flagged,
nine of them High.**

Overall testability is rated **LOW-to-MEDIUM**, and the reason is unusual and worth
stating plainly: *the single most important rule in this story was never written down.*
The acceptance-criteria field in Jira sets out a four-branch decision — rate contains
"50" and language French, rate contains "50" and language English, language French,
everything else — and then leaves **all four branch bodies empty**. Which of the four
attached PDFs each branch selects is nowhere stated in words. We have inferred the
mapping from the four attachment filenames, which line up one-to-one with the four
branches, but an inference is not a specification: if we test against it and the
developer implemented a different mapping, we will either pass a wrong build or raise
four false defects. **Q-001 must be answered before execution, not during it.**

The second area of exposure is the technical one. The story's real work turned out to be
a PDF-engine problem: Chubb's live contract endpoint returns a PDF 1.7 file that uses a
compressed cross-reference stream (a modern index format) and is encrypted with an empty
password, and the portal's existing PDF library — `Zend_Pdf`, from the long-abandoned
Zend Framework 1 — supports neither, so contract generation threw a hard exception. The
agreed fix adds `setasign/fpdi` as the merge engine and pre-processes every Chubb PDF
through the `qpdf` command-line tool. That fix introduces a **system-level binary
dependency**, which is the highest-probability production failure on this ticket: it
works wherever `qpdf` happens to be installed and returns a server error wherever it is
not, and nothing in the portal surfaces the difference until a dealer clicks download.

The third area is not testable at all today. A third of the description covers
**retention** — the signed form being scanned back to Avantage+, and a copy staying
accessible to the dealership for audit — and the ticket itself says the method "reste à
confirmer" with the product owner. There is no screen, no route and no rule to test
against, so REQ-006 is recorded as **Deferred**, and no test case will be written for it
until the product team supplies the mechanism.

Business exposure if this ships unverified: the form AP-2437 attaches is the document
that proves a Quebec dealership disclosed its commission to a client before the sale. A
missing form, the wrong percentage on it, or a contract PDF that silently fails to
generate all produce the same outcome — a dealership that believes a legal disclosure
obligation was met when there is no signed evidence that it was.

---

## Requirements Detail

### REQ-001 — Automatic insertion of the acceptance/waiver form into the contract PDF

| Field | Value |
|---|---|
| **User Story** | As a dealer F&I advisor, I want the acceptance-or-waiver form to be inserted into the Chubb insurance contract PDF automatically when I print the contract, so that the client signs the remuneration disclosure as part of the same document set without me finding and attaching it by hand. |
| **Priority** | High |
| **Source File** | `AP-2437-acceptance-waiver-form-in-chubb-contract-pdf.md` |
| **Recommended Test Types** | Functional · Negative · Regression · UI |

**Acceptance Criteria:**

1. When a Chubb insurance contract is created and the dealer prints or downloads it, the acceptance-or-waiver form is present in the resulting PDF.
2. The advisor performs no additional action — no extra button, no upload, no choice of file. Insertion is automatic.
3. The merge happens in code at download time, per contract, against the PDF fetched live from Chubb's API for that contract. No pre-saved, manually converted or cached file is acceptable.
4. The contract PDF that previously downloaded without the form must still download successfully — the change must not break existing contract printing.

**Out of Scope:**

- Sending the form by email. That is AP-2436's *Send compliance documents* flow, a separate story.
- Any workflow after the client signs the form — see REQ-006.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The story never names the screen or the button from which a Chubb insurance contract is printed. The dealer portal has a *Creditors insurance* contracts page at `/creditor-insurance-contracts`, but the navigation map's scope covers only quote creation and AP-2436, so the download control has not been mapped. Without it the executor cannot reach step 1. | High | Map the creditor-insurance contract download route before execution, or ask the developer for the exact route and control label. Raised as Q-005. |
| The story does not say whether the form is inserted once per contract or once per insurance product when a contract carries more than one. A contract with two products could plausibly produce one form or two, and both would look correct to a tester who was not told which to expect. | Medium | Ask the product owner. Raised as Q-008. |
| No error path is described. Nothing in the story says what the dealer sees if the form cannot be inserted — whether the contract downloads without the form, or the download fails outright. Silent omission is the dangerous outcome, because the dealer would print a contract that is missing its legal disclosure and have no signal that anything went wrong. | High | Ask the developer to state the failure behaviour, and prefer a visible failure to a silent one. Raised as Q-009. |

---

### REQ-002 — The form is placed on the first page of the contract PDF

| Field | Value |
|---|---|
| **User Story** | As a client signing a credit-insurance contract, I want the acceptance-or-waiver page to be the first thing in the document, so that I read the disclosure before the contract terms rather than after them. |
| **Priority** | High |
| **Source File** | `AP-2437-acceptance-waiver-form-in-chubb-contract-pdf.md` |
| **Recommended Test Types** | Functional · Edge-case · UI |

**Acceptance Criteria:**

1. The acceptance form appears **on the first page** of the insurance contract PDF, ahead of the Chubb-supplied contract pages.
2. Every Chubb-supplied page that was in the original contract is still present after the merge, in its original order, immediately following the inserted form.
3. The total page count of the merged PDF equals the original Chubb page count plus the page count of the inserted form.

**Out of Scope:**

- Page numbering, headers or footers renumbered across the merged document — the story says nothing about them.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The phrase "attach on the first page" is ambiguous between two readings: the form becomes page 1 and the contract shifts down, or the form is stamped as an overlay *onto* the existing first page. These produce visibly different documents and the wording does not distinguish them. | High | Confirm with the developer which was implemented. The attached forms are full-page documents, which favours the first reading, but that is inference. Raised as Q-006. |
| The story does not state how many pages each of the four attached forms has, so the expected total page count cannot be predicted without opening the attachments. | Low | Open each of the four attached PDFs during test design and record its page count in the test data table. Resolvable by QA without asking anyone. |

---

### REQ-003 — Four-branch selection of the correct form variant

| Field | Value |
|---|---|
| **User Story** | As a compliance officer, I want the system to pick the form version that matches the insurance rate sold and the contract's language, so that the client signs a disclosure that states the correct commission percentage in a language they can read. |
| **Priority** | High |
| **Source File** | `AP-2437-acceptance-waiver-form-in-chubb-contract-pdf.md` |
| **Recommended Test Types** | Functional · Negative · Edge-case |

**Acceptance Criteria:**

1. The selection is driven by exactly two inputs: whether the insurance table rate **contains the text "50"**, and the value of `quote_financing_insurance_chubb.language` (`F` for French, `E` for anything else).
2. Rate contains "50" **and** language `F` → the French 50 % form.
3. Rate contains "50" **and** language `E` → the English 50 % form.
4. Rate does not contain "50" **and** language `F` → the French 30 % form.
5. Any other combination → the English 30 % form. This is the fall-through default, so an unset or unrecognised language yields the English 30 % form rather than an error.

> **These five criteria are the analyst's reconstruction, not the ticket's text.** Jira
> states the four *conditions* and leaves the four *outcomes* blank. See the risk below.

**Out of Scope:**

- Any third rate tier. The rule is binary: "contains 50", or everything else.
- Languages other than French and English.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| **The four decision branches have empty bodies in Jira.** Which PDF each branch selects is stated nowhere. The mapping in the acceptance criteria above was inferred from the four attachment filenames. If the implementation differs, testing against this inference either passes a wrong build or raises four false defects. | **High** | Do not execute the branch tests until the developer or product owner confirms the mapping in writing on the ticket. Raised as Q-001 and treated as an execution blocker. |
| "The insurance table rate contains '50'" does not name a field, a table or a set of possible values. A *contains* test implies the rate is text, not a number, but the story does not say so, and the dealer-facing label for it is unknown. | **High** | Ask the developer for the field and its possible values. Until then a tester cannot deliberately produce a 50 % contract or a non-50 % one, which blocks every branch test. Raised as Q-002. |
| `quote_financing_insurance_chubb.language` is a database column, not a control the tester can see. Nothing states what sets it — the dealer portal's language setting, the client's preferred language, or a language choice on the Chubb form itself. The tester cannot steer the branch without knowing. | **High** | Ask the developer which UI action writes this column. Raised as Q-003. |
| A *contains "50"* test is a substring match, which admits false positives no one has considered: a rate of "150", "50.5" or "PM50" all contain "50". Whether those are intended to take the 50 % form is unstated. | Medium | Ask the product owner whether the substring behaviour is deliberate. Design an edge-case test for it regardless, since the risk is a wrong commission percentage on a signed legal document. Raised as Q-004. |
| The `PM50` / `PM30` creditor form codes already recorded for AP-2436 in the project's test-data source look related to this rate rule, but no source states that they are the same thing. | Medium | Confirm the relationship rather than assuming it. A wrong assumption here silently invalidates every branch test. |

---

### REQ-004 — Required content of the acceptance/waiver form

| Field | Value |
|---|---|
| **User Story** | As a Quebec regulator, I want the signed form to record every disclosure the dealership was obliged to make, so that the dealership can prove the client was informed before the sale concluded. |
| **Priority** | High |
| **Source File** | `AP-2437-acceptance-waiver-form-in-chubb-contract-pdf.md` |
| **Recommended Test Types** | Functional · UI |

**Acceptance Criteria:**

1. The form confirms the client received the **Sommaire des protections** (the coverage summary).
2. The form confirms the client received the **Parlons assurances** document.
3. The form states the **remuneration percentage** applicable to the dealership.
4. The form records the client's acknowledgement that this information was received **before the sale concluded**.
5. The form's text is in the language selected by the REQ-003 branch — a French contract must not present an English form.

**Out of Scope:**

- The wording of the form itself. It is supplied as four fixed PDFs on the ticket and is not generated by the portal.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The story does not say whether the remuneration percentage is fixed text inside each PDF or a value merged in per dealership. If it is merged in, there is a data-correctness test here — the printed percentage must match what the dealership actually earns — and no source says where that value is configured. | **High** | Open the four attached PDFs and check whether the percentage is printed or blank. If merged, ask where the dealership rate is configured. Raised as Q-007. A wrong percentage on a signed legal document is a compliance defect, not a cosmetic one. |
| No source states whether the form carries client-specific data — name, contract number, date — or is a blank template the client fills in by hand. | Medium | Determine from the attached PDFs during test design and record the finding. |
| The four criteria describe the *content of a supplied PDF*, which the portal does not generate. Testing them verifies that the correct file was attached, not that the portal produced correct text. | Low | Frame these as "the attached form is the right file and is legible in the merged output", not as content generation tests. |

---

### REQ-005 — The merged contract PDF remains valid and readable

| Field | Value |
|---|---|
| **User Story** | As a dealer F&I advisor, I want the contract I download to open, print and read correctly every time, so that I can have the client sign it in front of me without discovering the file is corrupt. |
| **Priority** | High |
| **Source File** | `AP-2437-acceptance-waiver-form-in-chubb-contract-pdf.md` (numbered criteria AC-9, AC-10, and the technical-decision table) |
| **Recommended Test Types** | Functional · Negative · Edge-case · Regression · Performance |

**Acceptance Criteria:**

1. The merged PDF opens without error in Adobe Acrobat, Chrome's built-in viewer and Edge's viewer.
2. No `Zend_Pdf_Exception` — and no other server error — is raised during contract generation. The specific historical failure was `PDF file syntax error. Offset - 0x2F862C. Wrong W dictionary entry.`
3. Every piece of client-specific data on the Chubb-supplied pages survives the merge unchanged.
4. Text in the merged document remains selectable and searchable; the pages are not flattened to images.
5. The merged PDF prints correctly — the historical Chubb file restricted print permission, and the `qpdf --decrypt` pre-pass is expected to have removed that restriction.
6. Contract generation completes within a time a dealer would accept at the counter, since the flow now performs a live Chubb API call plus an external `qpdf` process plus a merge on every download.

**Out of Scope:**

- Which merge engine ships. The team debated `setasign/fpdi` versus `Zend_Pdf` with a qpdf pre-pass and the final choice is not recorded; the observable outcome is the same either way.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| **`qpdf` is a system binary, not a PHP package.** It must be installed on every server that runs this code. Nothing in the ticket confirms it is present on v2staging or provisioned for production. This is the highest-probability failure on the story: identical code works on one host and returns a server error on the next, with no warning until a dealer clicks download. | **High** | Confirm `qpdf` on staging before execution, and ask whether production provisioning was updated. Raised as Q-005. Test the missing-binary path deliberately if a host without it can be reached. |
| Criterion 6 is a performance expectation with no number attached. "Acceptable at the counter" cannot be passed or failed. | Medium | Ask the product owner for a target, or record the observed generation time as an observation rather than a pass/fail assertion. |
| The Chubb `/contract` endpoint is an external live dependency. The story describes no behaviour for it being slow, down, or returning a non-PDF error payload — all of which would reach the merge step. | **High** | Ask the developer what the dealer sees when the Chubb call fails. A truncated or half-merged contract must never be delivered as if it were complete. Raised as Q-010. |
| Chubb may return PDFs with different security or version settings for different contracts or dealerships. One passing contract does not prove the fix general. | Medium | Test with more than one contract, and if possible more than one creditor form code, rather than only the `AP0001` configuration named in the comments. |
| The merge engine changed for this code path only. Any other feature still generating PDFs through `Zend_Pdf` is now on a divergent path and may have been disturbed. | Medium | Include a regression pass over other PDF-producing features — warranty contracts, invoices — in the test plan. |

---

### REQ-006 — Retention, archival and audit access for the signed form *(Deferred)*

| Field | Value |
|---|---|
| **User Story** | As an Avantage+ compliance officer, I want the signed acceptance form stored and retrievable, so that a dealership's disclosure can be produced on demand during an audit. |
| **Priority** | Medium |
| **Source File** | `AP-2437-acceptance-waiver-form-in-chubb-contract-pdf.md` |
| **Recommended Test Types** | Not determinable — see risks |

**Acceptance Criteria:**

1. The signed document is scanned and transmitted to Avantage+ with the rest of the file.
2. A copy remains accessible to the dealership for compliance and audit purposes.

**Out of Scope:**

- Everything, for this release. The ticket states the retention, archival and consultation method **"reste à confirmer"** with the product owner (@lindquist1305), and no confirmation appears in any of the thirteen comments.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The requirement is explicitly unconfirmed in its own source text. There is no screen, no route, no upload control and no storage rule to test against. | **High** | Record REQ-006 as **Deferred** and write no test cases for it. Ask the product owner whether it is in scope for this release at all; if it is, it needs its own story. Raised as Q-011. |
| Criterion 1 involves a manual, human step — scanning a signed paper form — that no automated or browser-driven test can exercise. | Medium | Even once confirmed, treat this as a process check rather than a software test. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Automatic insertion | ✓ | ✓ | | ✓ | ✓ | | | |
| REQ-002 — First-page placement | ✓ | | ✓ | | ✓ | | | |
| REQ-003 — Four-branch form selection | ✓ | ✓ | ✓ | | | | | |
| REQ-004 — Required form content | ✓ | | | | ✓ | | | |
| REQ-005 — Merged PDF validity | ✓ | ✓ | ✓ | ✓ | | ✓ | | ✓ |
| REQ-006 — Retention *(Deferred)* | | | | | | | | |

**Legend:** ✓ = recommended based on requirement content

Accessibility is not marked anywhere: the deliverable is a downloaded PDF, and no
accessibility requirement is stated in the story. If Avantage+ has a standing PDF
accessibility obligation, it is not recorded in any source this analysis could reach.

---

## Open Questions

Questions that must be answered by the product team before test case design begins:

| # | Question | Raised against | Assigned to | Due |
|---|---|---|---|---|
| Q-001 | The four decision branches in the acceptance-criteria field have empty bodies. Which of the four attached PDFs does each branch select? Please confirm the mapping in writing on the ticket. | REQ-003 | Ken Nguyen / Minh Lưu | Before execution — **blocker** |
| Q-002 | What is "the insurance table rate"? Which field or table does it come from, what are its possible values, and how does a tester deliberately produce a contract whose rate contains "50" and one whose rate does not? | REQ-003 | Minh Lưu | Before execution — **blocker** |
| Q-003 | What sets `quote_financing_insurance_chubb.language`? Is it the dealer portal language setting, the client's language, or a choice on the Chubb form — and can a tester change it from the UI? | REQ-003 | Minh Lưu | Before execution — **blocker** |
| Q-004 | "Rate contains 50" is a substring test. Is it intended that rates such as "150", "50.5" or "PM50" also take the 50 % form? | REQ-003 | Ken Nguyen | Before execution |
| Q-005 | Is the `qpdf` binary installed on v2staging, and has production provisioning been updated to include it? | REQ-001, REQ-005 | Minh Lưu / DevOps | Before execution — **blocker** |
| Q-006 | Does "attach on the first page" mean the form becomes page 1 and the contract shifts down, or that the form is stamped as an overlay onto the existing first page? | REQ-002 | Minh Lưu | Before execution |
| Q-007 | Is the dealership's remuneration percentage fixed text inside each supplied PDF, or merged in per dealership at generation time? If merged, where is the dealership's rate configured? | REQ-004 | Ken Nguyen | Before execution |
| Q-008 | Is the form inserted once per contract, or once per insurance product when a contract carries more than one? | REQ-001 | Ken Nguyen | Before execution |
| Q-009 | What does the dealer see if the form cannot be inserted — does the contract download without it, or does the download fail with a visible error? | REQ-001 | Minh Lưu | Before execution |
| Q-010 | What does the dealer see when the Chubb `/contract` API is slow, unreachable, or returns a non-PDF error payload? | REQ-005 | Minh Lưu | Before execution |
| Q-011 | Is the retention/archival requirement in scope for this release? The ticket says the method is still to be confirmed with @lindquist1305, and no confirmation is recorded. | REQ-006 | Ken Nguyen / @lindquist1305 | Before sign-off |
| Q-012 | Which merge engine shipped — `setasign/fpdi`, or `Zend_Pdf` with a `qpdf` pre-pass? Ken asked this on 2026-08-26 *after* approving the FPDI approach and no reply is recorded. | REQ-005 | Minh Lưu | Before sign-off |
| Q-013 | Which route and control does a dealer use to print or download a Chubb creditor-insurance contract? The navigation map does not cover this flow. | REQ-001 | Minh Lưu | Before execution — **blocker** |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-003 | The four decision branches have empty bodies — the form each branch selects is stated nowhere and has been inferred from attachment filenames | High | Open |
| REQ-003 | "Insurance table rate" names no field and no possible values, so a tester cannot steer the branch | High | Open |
| REQ-003 | `quote_financing_insurance_chubb.language` is a database column with no known UI control that sets it | High | Open |
| REQ-003 | "Contains 50" is a substring match whose false positives ("150", "50.5", "PM50") are unaddressed | Medium | Open |
| REQ-003 | The relationship between this rate rule and the existing `PM50` / `PM30` creditor form codes is assumed, not stated | Medium | Open |
| REQ-005 | `qpdf` is a system binary whose presence on staging and production is unconfirmed | High | Open |
| REQ-005 | The Chubb `/contract` endpoint is an external live dependency with no described failure behaviour | High | Open |
| REQ-005 | Generation-time expectation is stated in words with no measurable target | Medium | Open |
| REQ-005 | Chubb PDFs may vary in version and security settings between contracts; one passing case does not generalise | Medium | Open |
| REQ-005 | The merge engine changed for this path only; other `Zend_Pdf` consumers may be disturbed | Medium | Open |
| REQ-001 | No route or control is named for printing a Chubb insurance contract | High | Open |
| REQ-001 | No error path described — a silently missing form would look like success | High | Open |
| REQ-001 | Unstated whether one form or several are inserted on a multi-product contract | Medium | Open |
| REQ-002 | "Attach on the first page" is ambiguous between insertion and overlay | High | Open |
| REQ-004 | Unstated whether the remuneration percentage is fixed in the PDF or merged per dealership | High | Open |
| REQ-006 | The retention method is explicitly unconfirmed in the ticket's own text — nothing to test | High | Deferred |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged — 16 recorded, 9 High
- [x] Open questions have been assigned to stakeholders — 13 recorded, 5 marked execution blockers
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design — *proceeding, with the five blockers carried forward into the plan's entry criteria*
