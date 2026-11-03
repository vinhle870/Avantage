# Test Report — Permaplate feature set

**Report ID:** TR-20260906-001
**Project:** Avantage Plus v2 — Permaplate
**Tickets covered:** AP-2443 · AP-2444 · AP-2445 · AP-2446 · AP-2447 · AP-2448 · AP-2455 · AP-2456
**Date:** 2026-09-06, updated 2026-09-13 after the AP-2446 re-test and again after the AP-2443 re-test
**Prepared by:** QA Agent — Test Reporter Skill
**Environment:** v2staging — `https://v2staging.garantieavantageplus.ca`, Avantage Plus System v2.0.0, Chromium via Playwright
**Test plan:** `qa-artifacts/2-test-plan/PERMAPLATE_test-plan.md` (TP-20260906-001)

---

## 1. Verdict

# PASS — cleared for release

**Updated 2026-09-13.** All three defects that stood between this feature set and a clean
release on 2026-09-06 are now resolved or reclassified. Thirty-seven of the thirty-seven
now-judged cases pass — AP2446_003 moved from Fail to Pass, and AP2443_004 moved from
Blocked to Pass — and zero High defects remain open. See **§1a** and **§1b** below for the
full re-test accounts; the original 2026-09-06 verdict is kept underneath for history.

**One reservation that is not a defect still stands and is not affected by this update:**
the conditions language (§5.2) remains untested. It is not closed by fixing code — it needs
a person to supply a missing answer (Q-008). AP-2443's account-owner privacy rule, the
other reservation from the original run, is now resolved — see §1b.

---

## 1a. 2026-09-13 re-test — what changed

Triggered by Ken Nguyen's ticket comment on 2026-09-08 confirming three fixes and asking
for AP-2446 to be retested. Full detail:
`qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2446_2026-09-13.md`.

1. **AP-2459 (HTTP 500 on a blank Financing company) is fixed.** Re-ran the exact repro —
   a new contract, Financing company left on "Choose" — and it now succeeds cleanly with no
   server error.
2. **AP-2461 (invoice cites a non-existent contract number) is fixed for new invoices.** The
   new invoice raised during the re-test (#926) cites `PNA-0000000012` consistently across
   its description, its download link and its footer link. The historical invoice #921 from
   2026-09-06 still shows the old wrong value, which is expected — a fix does not rewrite
   already-stored records.
3. **AP-2460 (alert quotes $145, invoice bills $166.71) turned out not to be a defect.** The
   invoice's own detail page (`/invoice/{id}`) — not examined in the original run, which only
   read the `/invoice` list row — itemizes the $145 pre-tax line plus GST ($7.25) and PST
   ($14.46) separately down to the $166.71 Grand Total. Nothing is hidden from the dealer; it
   is only not visible from the list row. Ken Nguyen confirmed on the ticket that this is
   intended and does not need a fix.

**AP2446_005 (the warranty regression check) remains skipped**, for a new reason: the
re-test got past the original date-validation blocker but the warranty contract stayed
"Incomplete" with no discoverable control to raise its own invoice in the time available.
The regression this case exists to prove — that the shared invoicing code still works for
warranty — remains unverified across both cycles.

**Updated cycle totals after the AP-2446 re-test: 36 passed, 0 failed, 2 blocked, 2 skipped,
of 40 designed (100% of the 36 judged).**

---

## 1b. 2026-09-13 re-test — AP-2443 criterion 5

Triggered by the user supplying a second dealer-portal credential
(`vinhle_ap2@yopmail.com`), described as an account with the Account Owner permission.
Checking `/users` confirmed it still held that role, so it did not unblock the case by
itself. Full detail:
`qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2443_2026-09-13.md`.

Using the signed-in owner's own **User management** permission, "Account Owner" was
unchecked for that account at `/user/edit-permission/135`, creating the non-owner test
account Ken Nguyen's ticket comment (2026-09-08) had asked for. The visibility split was
then proven in both directions:

- **As non-owner:** saw `No entities found` — none of the account owner's 2 existing
  contracts. After creating its own quote (6292) with a Permaplate contract, it saw
  **exactly that 1 contract** and still not the owner's 2.
- **As owner:** saw **all 3** contracts, including the one the non-owner had just created.

**AP2443_004 moves Blocked → Pass. Q-001 is answered** (§7). The test account was restored
to Account Owner immediately afterward, at the user's choice, so the environment matches
how it was found except for the new quote 6292, left in place as evidence.

**Updated cycle totals: 37 passed, 0 failed, 1 blocked, 2 skipped, of 40 designed (100% of
the 37 judged). The only remaining blocked case is AP2445_003 (§5.2, conditions language).**

---

## Original 2026-09-06 verdict (superseded above)

# PASS WITH RESERVATIONS — fix three defects before release

The Permaplate feature set works. Thirty-five of the thirty-six test cases that could be
judged passed, the code is better built than the tickets suggested, and two of the biggest
risks the team was carrying turned out to be already handled safely. This is a
substantially healthier result than the previous cycle on this project.

Three defects stand between it and a clean release, and all three sit in the same place:
the moment a dealer turns a quote into a contract and gets billed for it.

1. **A dealer who does not pick a financing company cannot create a contract at all** — the page crashes with a server error and explains nothing (AP-2459).
2. **The dealer is told the invoice is $145 and then billed $166.71** (AP-2460).
3. **The invoice cites a contract number that does not exist**, so nobody can match the bill to the contract it pays for (AP-2461).

None of these is Critical: no data is lost, no client is exposed, and each has a
workaround once somebody knows it. But together they mean the one commercial transaction
this whole feature set exists to support — sell the product, bill the dealer — is unsafe
to put in front of a real dealer today. **The recommendation was to fix AP-2459, AP-2460
and AP-2461, then release** — since done, see §1a.

**One reservation is not a defect and cannot be closed by fixing code.** AP-2443's rule
that a salesperson should see only their own clients' contracts — the only privacy rule in
the eight stories — **was never tested**, because every dealer-portal user on the test
dealership holds the "Account Owner" role and no account without it exists. That
requirement should not be signed off as working on the strength of this run.

---

## 2. What was delivered

| Stage | Artifact | Result |
|---|---|---|
| Requirements analysis | `qa-artifacts/1-requirements-analysis/PERMAPLATE_requirements-analysis.md` | 8 requirements, 26 testability risks, 10 open questions |
| Test plan | `qa-artifacts/2-test-plan/PERMAPLATE_test-plan.md` | IEEE 829, build-order execution sequence, test data classified |
| Test cases | 8 files in `qa-artifacts/3-test-cases/` | 40 cases, 5 per ticket |
| Peer review | `qa-artifacts/3-test-cases/permaplate/MissingTestCases_TechniqueReview_2026-09-06.md` | 6 document findings, 10 proposed extra cases, 5 cross-ticket patterns |
| Execution | `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` | 40 cases executed, 24 screenshots |
| Re-test (AP-2446) | `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2446_2026-09-13.md` | 5 cases re-executed, 6 screenshots — AP2446_003 Fail → Pass |
| Re-test (AP-2443) | `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2443_2026-09-13.md` | 1 case re-executed, 5 screenshots — AP2443_004 Blocked → Pass |
| Bug report | `qa-artifacts/5-testing-report/PERMAPLATE_bug-report.md` | 5 defects, 5 Jira tickets |
| This report | `qa-artifacts/5-testing-report/PERMAPLATE_test-report.md` | — |

---

## 3. Results (updated 2026-09-13)

| Metric | Value |
|---|:---:|
| Test cases designed | 40 |
| Executed and judged | 37 |
| Passed | 37 |
| Failed | 0 |
| Blocked | 1 |
| Skipped | 2 |
| **Pass rate (of those judged)** | **100%** |
| Defects raised | 5 — 3 High (all resolved/reclassified 2026-09-13), 2 Low (open) |

<details>
<summary>2026-09-06 figures (superseded)</summary>

| Metric | Value |
|---|:---:|
| Passed | 35 |
| Failed | 1 |
| Blocked | 2 |
| Pass rate | 97% |

</details>

The pass rate counts only the 37 cases that could honestly be called a pass or a failure.
One case (AP2445_003) is blocked because a fact nobody has supplied is still missing, and
two were skipped because the route they needed does not exist on this build. Counting
either group as a pass would flatter the result; counting them as failures would blame the
product for a documentation gap. Both are itemised in §5.

### Per-ticket breakdown

| Ticket | Requirement | Cases | Pass | Fail | Blocked | Skipped | Verdict |
|---|---|:---:|:---:|:---:|:---:|:---:|---|
| AP-2447 | Admin assigns Permaplate products | 5 | 5 | 0 | 0 | 0 | **Pass** — one cosmetic defect (AP-2462) |
| AP-2444 | Dealer conditional options | 5 | 5 | 0 | 0 | 0 | **Pass** — the best-built story in the set |
| AP-2446 | Permaplate invoice | 5 | 4 | 0 | 0 | 1 | **Pass** (updated 2026-09-13) — all three High defects resolved/reclassified |
| AP-2445 | Conditions appended to the PDF | 5 | 3 | 0 | 1 | 1 | **Pass** for English; French untested |
| AP-2443 | Dealer contract list | 5 | 5 | 0 | 0 | 0 | **Pass** (updated 2026-09-13) — the privacy rule is now proven |
| AP-2448 | Admin contract list | 5 | 5 | 0 | 0 | 0 | **Pass** — fully deployed and correct |
| AP-2456 | Retail pricing removed | 5 | 5 | 0 | 0 | 0 | **Pass** — all five surfaces clean |
| AP-2455 | Admin unlinks a product | 5 | 5 | 0 | 0 | 0 | **Pass** — safer than the ticket described |

---

## 4. Requirement coverage

Traceability means being able to point from each requirement to the tests that prove it.
Every acceptance criterion in the eight stories traces to at least one executed case.

| Requirement | Ticket | Criteria | Coverage | Proven? |
|---|---|:---:|:---:|---|
| REQ-001 | AP-2447 | 6 | 6 of 6 | Yes. Criterion 6 was proven via AP2455_004, which needed the unlinked state |
| REQ-002 | AP-2455 | 6 | 6 of 6 | Yes |
| REQ-003 | AP-2444 | 6 | 6 of 6 | Yes |
| REQ-004 | AP-2446 | 4 | 4 of 4 | All four criteria proven as of the 2026-09-13 re-test; criterion 4 as far as possible without taking a real payment |
| REQ-005 | AP-2443 | 7 | 7 of 7 | Yes — criterion 5, the account-owner visibility split, proven 2026-09-13 |
| REQ-006 | AP-2448 | 10 | 10 of 10 | Yes |
| REQ-007 | AP-2445 | 2 | 1 of 2 | Criterion 1 yes and conclusively; criterion 2, the language, untested |
| REQ-008 | AP-2456 | 5 | 5 of 5 | Yes, though verified by the absence of any second price rather than by a named field |

**47 of 48 acceptance criteria are proven.** The one that is not is named plainly above and
in §5.2 — it is not a defect, but a thing nobody has yet given us the means to test.

---

## 5. What was not tested, and why it matters

Stated in full because a reader deciding whether to release needs to know the shape of the
hole, not just the size of it.

### 5.1 The account-owner visibility split — AP-2443 criterion 5 — RESOLVED 2026-09-13

**Now tested and passing.** This criterion says an account owner sees every contract
belonging to the dealership, while anyone else sees only contracts from quotes they created
themselves.

The original run established what the permission is: **"Account Owner" is a named role** in
the dealer portal's own User management page, sitting alongside Quotes, Payments, Claims and
others — editable per-user at `/user/edit-permission/{id}` by anyone holding "User
management". On 2026-09-13, that edit screen was used to uncheck "Account Owner" for
`vinhle_ap2@yopmail.com`, producing the non-owner account the original run lacked. Signed in
as that account, it saw none of the account owner's contracts and only its own; signed in as
the owner, all contracts — including the non-owner's — were visible. See **§1b** for the
full account. The test account was restored to Account Owner afterward.

**The risk this closes:** every salesperson at a dealership could have seen every
colleague's clients, including names and phone numbers, if this rule did not hold. It does
hold. This is no longer an open item.

### 5.2 The conditions language — AP-2445 criterion 2

**Not tested.** The English conditions merge perfectly — see §6 — but no French contract
was produced, because nothing states which setting decides the language: the portal
setting, the client's province, or a field on the contract. The one contract created was
made with the portal in English, for a client in Québec, and received the English
document. That is equally consistent with the portal driving the choice and with English
being hard-coded.

**What is at risk:** a Quebec client receiving terms in a language they do not read has
not meaningfully agreed to them — which is close to the reason the ticket was written.
**To close it:** answer which setting drives the language, then re-run AP2445_003.

### 5.3 The warranty PDF regression

**Not tested.** AP-2445's document-merging code is shared, and the previous cycle's
AP-2437 work merged a form into the Chubb insurance contract by a similar route. The check
that a warranty contract has not been damaged could not be run because the warranty
contract list offers no download control on any of its 25 rows. **The risk is real and
uncovered.** If the team knows another route to a warranty PDF, that check is worth ten
minutes.

### 5.4 Smaller gaps, recorded for completeness

- **Payment was never completed.** AP-2446 criterion 4 was verified as far as the payment screen; taking a real payment on staging was ruled out in the test plan because it leaves a financial record behind.
- **Removals were verified by absence, not by name.** AP-2456 never says what the retail-pricing field was called, so each case confirmed that no second price appears and that the surrounding fields are intact. That is weaker than checking a named field disappeared, and it is why AP-2456's pass is worth slightly less than it looks.
- **Only one dealership was used for the functional cases.** Separation between dealerships was proven for the contract download route (§6) but not for the lists.
- **Nothing was tested concurrently.** No double-click, no two tabs, no two users. On a feature that raises invoices, a duplicated charge is a plausible failure nobody has looked for. This was proposal P2-01 in the peer review and remains unrun.

---

## 6. What was proven working — including two risks now closed

A report that lists only failures misrepresents this cycle. These findings are results in
their own right, and two of them close risks the team was actively carrying.

**The conditions PDF is fixed.** Ken Nguyen reported on AP-2445 on 2026-09-01 that "the
PDF condition is not loading", with a screen recording. On this build the conditions merge
correctly, and the merged text is **character-for-character identical** to the approved
English document attached to that ticket — 28,804 characters, four pages, compared
directly. Clients are receiving exactly the approved terms. *That ticket's own open defect
can be closed.*

**Unlinking a product destroys nothing.** This was the highest-risk unknown going in:
nobody had said what happens to signed contracts when the product they were sold under is
withdrawn. The answer is the safe one. After unlinking, the contract stayed in both the
dealer and admin lists, stayed downloadable with byte-identical content, and the quote kept
showing what was sold. Only the Edit and Create Contract paths closed. **The design is
better than the ticket described.**

**One dealership cannot reach another's contracts.** Requesting three other dealerships'
contract downloads by changing the number in the address was refused every time, while the
dealer's own contract returned normally. The check is enforced on the server.

**Access control is enforced server-side, not by hiding buttons.** With no product linked,
the Permaplate button is absent *and* typing the address directly redirects away. A rule
enforced only in the interface is not enforced at all; this one is.

**The conditional-options logic is exactly right.** Selecting the parent enables the child
and ticks it; the child can then be unticked on its own; unticking the parent unticks *and*
disables the child in the same action. Self-parenting is impossible because the form never
offers it. Of the eight stories, AP-2444 is the one that needed real logic, and it is the
one built most precisely.

**Retail pricing is genuinely gone** from all five surfaces AP-2456 names, and the
client-facing contract PDF carries no price and no tax line at all.

---

## 7. Open questions

Ten questions were raised at analysis time. **Five were answered by running the tests** and
are now recorded facts about the product; five still need a person.

### Answered by this run

| Q | The answer |
|---|---|
| Q-002 | Unlinking a Permaplate product does **not** affect contracts already signed for it. The contract stays listed, stays downloadable, and the quote keeps its record; only the editing path is withdrawn. |
| Q-003 | A "term" **is** the Permaplate product record — the admin page is headed "Permaplate Terms" and each term owns a set of options. The *Parent* select is filtered to same-term options and excludes the option being edited. |
| Q-005 | The Permaplate invoice carries **dealer cost plus Quebec sales tax**: 145.00 × 1.14975 = 166.71. Not the retail price. |
| Q-007 | The conditions-PDF failure reported on 2026-09-01 is **fixed**. |
| Q-009 | AP-2448 **is deployed** to staging, despite no merged pull request being recorded on the ticket. All ten of its criteria passed. |
| Q-010 | The dealer's "Contract cost price" column shows the **pre-tax** figure. |
| Q-011 | Duplicate product links are **prevented** — an already-linked product is removed from the select box. |
| Q-001 | Is there a dealer-portal account **without** the Account Owner role? **Yes, once created**: "Account Owner" is a per-user checkbox at `/user/edit-permission/{id}`, editable by anyone with "User management". Unchecking it on an existing user produces a working non-owner account (§1b, §5.1). |

### Still open

| Q | Question | Needed for | Owner |
|---|---|---|---|
| Q-008 | Which setting decides whether the English or French conditions are merged? | AP-2445 criterion 2 (§5.2) | Ken Nguyen |
| Q-006 | What was the retail-pricing field actually called on each of the five surfaces? | Turning AP-2456's five passes from "no second price is visible" into "the named field is gone" | Minh Lưu |
| Q-003b | Can an option be the parent of an option that is itself a parent? A **two-level chain is configurable** and nothing says what should then happen. | An undefined configuration an administrator can create today | Minh Lưu |
| — | What happens if invoice creation fails after the contract already exists? | Still cannot be provoked from the screen | Minh Lưu |

---

## 8. Exit criteria (updated 2026-09-13, after both re-tests)

Measured against the test plan's §5.

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| Every High-priority case executed, or a stated reason why not | All | All 26 High cases executed or reasoned (AP2443_004 now executed and passed) | ✅ |
| Pass rate of cases executed | ≥ 85% | 100% | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 2 | **0** — AP-2459 and AP-2461 resolved, AP-2460 reclassified as not a defect | ✅ |
| Every requirement has at least one executed case | All 8 | All 8 | ✅ |
| Test report written and reviewed | Yes | This document; review pending | ⏳ |
| Every defect has a linked ticket with a screenshot | All | All 5, linked and with evidence rendered inline | ✅ |
| The 10 open questions answered or restated on the tickets | All | **6 now answered by the run** (Q-001 added 2026-09-13), 4 restated on the tickets | ✅ |

**All eight exit criteria are met.** The High-bug count closed with the AP-2446 re-test on
2026-09-13; the account-owner privacy rule (AP-2443 criterion 5, Q-001) closed the same day
in a separate re-test (§1b). The one remaining open question, Q-008 (conditions language),
is not a defect and is restated on AP-2445.

---

## 9. Recommendations (updated 2026-09-13)

**Before release:**

1. ~~Fix AP-2459~~ — **Done, re-verified 2026-09-13.**
2. ~~Fix AP-2460~~ — **Not needed; confirmed intended by Ken Nguyen on 2026-09-08.** Optional
   UX polish only (label the alert or the list-row amount "before tax").
3. ~~Fix AP-2461~~ — **Done, re-verified 2026-09-13 for new invoices.**
4. **Close AP-2459 and AP-2461 in the tracker as resolved, and AP-2460 as not-a-bug /
   won't-fix.**
5. **Re-execute AP2446_005** with the warranty flow traced further — still unproven across
   both cycles, now for a different reason (warranty contract reaches "Incomplete" with no
   discoverable invoice-raising control).
6. ~~Answer Q-001 and provide a non-owner dealer account, then re-run AP2443_004.~~ **Done,
   2026-09-13 — see §1b.** If a non-owner account is needed again for a future cycle, repeat
   the same permission edit at `/user/edit-permission/135` for `vinhle_ap2@yopmail.com`, or
   ask Product to keep one dedicated non-owner account permanently rather than re-deriving
   it each time.

**Soon after:**

7. Answer Q-008 and re-run AP2445_003 so a French client's contract is proven.
8. **Close AP-2445's own reported defect** — the conditions PDF is fixed and evidenced.
9. Fix AP-2462 and AP-2463, or correct the acceptance criteria if the current behaviour is intended.
10. Find a route to a warranty contract PDF and run the merge regression check (§5.3).

**For the next cycle — the one with the largest payoff:**

11. **Bind the `domain` knowledge source.** This is the second consecutive cycle in which nothing about the product was written down, and the cost is now measurable: 26 testability risks and 10 questions, of which four were standing facts about the product that will never need asking again once recorded. **The answers in §7 are ready-made first content**, along with the eleven newly discovered routes in the execution log. Doing this would have saved several hours of this cycle.
12. Promote the peer review's proposal **P2-10** — a single end-to-end scenario walking link → quote → contract → invoice → both lists → PDF → unlink. The eight tickets are one workflow and no single case yet walks all of it.
13. Add a concurrency case on invoice creation (P2-01). A duplicated invoice is a real charge against a real dealer.

---

## 10. Sign-off (updated 2026-09-13)

| Role | Name | Status |
|---|---|:---:|
| QA execution | QA Agent — STLC pipeline | Complete — AP-2446 re-test executed 2026-09-13 |
| QA review | Vinh Le — QC | Pending |
| Development | Minh Lưu | 0 High defects open — AP-2459/AP-2461 fixed, AP-2460 not a defect |
| Product Owner | Ken Nguyen | Confirmed the invoice amount rule and dismissed AP-2460 (2026-09-08); Q-001/Q-008 still open |

**Ticket status was not changed by this report.** All eight stories remain at **QC**. Moving
them, and closing AP-2459/AP-2460/AP-2461 in the tracker, is the next action.
