# Test Case Review Findings — Permaplate feature set

**Batch:** AP-2443 · AP-2444 · AP-2445 · AP-2446 · AP-2447 · AP-2448 · AP-2455 · AP-2456
**Date:** 2026-09-06
**Reviewer:** QA Agent — Test Case Reviewer Skill
**Inputs reviewed:**
- `qa-artifacts/1-requirements-analysis/PERMAPLATE_requirements-analysis.md`
- `qa-artifacts/2-test-plan/PERMAPLATE_test-plan.md`
- All 8 test-case files in `qa-artifacts/3-test-cases/AP24**_TestCases_001-005.md`
- Knowledge sources: `navigation` (active), `test-data` (active), `domain` (**unbound**)

---

## Scope statement — read this before anything else

**This test-case set is real coverage, not a placeholder smoke check.** That distinction
matters, because the previous cycle on this project (AP-2437) produced a set where twenty
of twenty-three cases were blocked at design time and the tests could only prove screens
loaded. This batch is different: seven of the eight tickets carry a genuine Given/When/Then
acceptance-criteria field naming real page titles, column headings and button labels, and
40 cases were written against them, of which 34 are executable today.

Two honest limitations sit alongside that:

1. **Six cases ship BLOCKED at design time** — AP2447_004, AP2444_005, AP2446_003,
   AP2445_003, AP2443_004 and AP2456_004. In every one, the ticket does not state an
   expected result, so the case can record behaviour but not judge it.
2. **The `domain` knowledge source is unbound.** Nothing about Permaplate is written down
   anywhere on this project — not what a term is, not what the products are, not how the
   pricing works. Every case was designed from the ticket text and the navigation map. Where
   the tickets are silent, the cases record rather than assert, and that is a weaker form of
   testing than it looks.

---

## Pass 1 — Document consistency

_Checking that every requirement, acceptance criterion and open question named upstream
traces to at least one test case, and that no test case cites something that does not exist._

### 1.1 Traceability — every acceptance criterion has a case

All 48 acceptance criteria across the eight requirements trace to at least one test case.
No untraced criterion was found. Two are covered only by a case that ships BLOCKED, and
those are the real gaps:

| # | Finding | Priority | What would ship undetected |
|---|---|:---:|---|
| P1-01 | **REQ-005 criterion 5 — the *account owner* visibility split — is covered only by AP2443_004, which is BLOCKED on Q-001.** No dealer account without the permission is known to exist, so the rule cannot be exercised at all. | High | Every salesperson at a dealership could see every colleague's clients, with names and phone numbers. That is a data-protection failure, and this cycle would sign AP-2443 off without ever having tested it. |
| P1-02 | **REQ-004's invoice amount is covered only by AP2446_003, which is BLOCKED on Q-005.** Nobody has stated what the dealer should be billed. | High | The dealer could be billed the retail price rather than their cost price on every Permaplate sale. The error is invisible until someone reconciles the accounts, and AP-2456 removes the retail price from the invoice description, deleting the very text that would have shown it. |

### 1.2 Orphan references

No test case cites a requirement, criterion or open question that does not exist upstream.
The eight files' Coverage Matrix tables were checked against the requirements analysis
criterion by criterion.

One deliberate cross-file arrangement is worth recording so it is not later mistaken for an
orphan: **AP-2447 criterion 6** — that a dealer with no linked product is not offered the
Permaplate button — is covered by **AP2455_004**, in a different file. It cannot be tested
in the AP2447 file because it needs a dealership with nothing linked, a state only the
unlink story can create. Both files say so.

### 1.3 Unresolved open questions

Ten open questions were raised in the requirements analysis and **none has been answered or
even asked on the tickets yet.** Their state at review time:

| Q | Subject | Blocks | Priority |
|---|---|---|:---:|
| Q-001 | What *account owner* means, and whether a non-owner dealer account exists | AP2443_004 — hard block | High |
| Q-002 | What happens to existing contracts when a product is unlinked | AP2455_003 — hard block | High |
| Q-003 | What "term" means, and whether options may nest more than one level | AP2444_001, AP2444_005 | Medium |
| Q-004 | What the warranty contract-to-invoice flow actually does | AP2446_002, AP2446_005 — answered by running AP2446_005 | Medium |
| Q-005 | What amount the Permaplate invoice carries | AP2446_003, AP2456_004 — hard block on both | High |
| Q-006 | What the retail-pricing field is called on each of five surfaces | All five AP2456 cases — weakens all of them | High |
| Q-007 | Whether the conditions-PDF failure reported on 2026-09-01 is fixed | AP2445_001 — answered by running it | High |
| Q-008 | Where the conditions belong in the merged PDF, and which setting picks the language | AP2445_002, AP2445_003 — hard block on AP2445_003 | Medium |
| Q-009 | Whether AP-2448 is deployed to staging at all | All five AP2448 cases | High |
| Q-010 | Whether the dealer's *Contract cost price* includes taxes | AP2443_003 | Medium |

**Four of these are answered by simply running the tests** — Q-004, Q-007, Q-009 and part of
Q-008. The remaining six need a person: Ken Nguyen for Q-001, Q-002, Q-005 and Q-010, and
Minh Lưu for Q-003 and Q-006.

| # | Finding | Priority | What would ship undetected |
|---|---|:---:|---|
| P1-03 | **None of the ten open questions has been posted to its ticket.** They exist only inside the QA artifacts, where the people who can answer them will not see them. | High | The same questions get re-derived next cycle, exactly as happened with AP-2437, where nine questions went to the developer that a written-down answer would have covered. The cost is a repeat of this cycle's blocked cases. |

### 1.4 Findings against the test-case files themselves

| # | Finding | Priority | What would ship undetected |
|---|---|:---:|---|
| P1-04 | **Three admin-side routes are unmapped and are discovered during execution rather than before it** — the Permaplate Products tab on Dealer Details, the admin Permaplate option edit form, and the admin Permaplate contract index. Each is a Known blocker in its own file. | Medium | Nothing is untested, but the first case in three of the eight files spends its time exploring instead of asserting. If a route turns out not to exist, that discovery lands mid-run rather than at planning time. |
| P1-05 | **AP2444_002 leaves the restore of a shared option definition conditional**, telling the executor to restore in step 5 *or* after AP2444_003 and AP2444_004 finish. A conditional restore is a restore that gets forgotten. | Medium | The *Extra care* option would be left permanently parented to *Paint* on staging. Every later tester's quote form would show a nesting nobody configured on purpose, and would have no way of knowing it came from a test. |
| P1-06 | **No case checks that the dealer's `Contract cost price` column and the invoice total agree with each other.** AP2443_003 records the column, AP2446_003 records the invoice, but nothing compares them. | Medium | The list could show one figure and the bill charge another, and both cases would pass individually. A dealer quoting from the list and paying from the invoice would find the numbers do not match. |

---

## Pass 2 — Technique-driven missing cases

_What a senior manual tester would insist on adding. These are proposals, not verified
requirements, and none of them is written into the test-case files — that file is owned by
the designer, and promoting an item here into a real case is a separate step._

Fourteen candidates surfaced. The ten highest-value are listed; **four were dropped** and
are named at the end so the cap is not silent.

| # | Proposed case | Technique | Priority | The defect it would catch |
|---|---|---|:---:|---|
| P2-01 | Two Permaplate contracts created from the same quote in quick succession — click the generate control twice before the first response returns | Error guessing, specifically a race condition (two actions overlapping when the code assumed one at a time) | High | Two contracts and two invoices for one sale. The dealer is billed twice, and no screen shows which of the two is the real one. Double-submit on a slow response is the single most common way this happens, and nothing in the eight tickets mentions guarding against it. |
| P2-02 | Unlink a Permaplate product while a dealer has that product selected on an unsaved quote in another browser tab, then save the quote | State transition (checking the before-and-after state of an action that changes state) combined with cross-entity integration | High | The dealer saves a quote for a product they are no longer allowed to sell, or the save fails with an error that names nothing the dealer can act on. AP-2455 says only that the product "will not show in the form" and never addresses a form already open. |
| P2-03 | A Permaplate quote where the parent option is selected and every child is individually de-selected, taken all the way to a contract and its PDF | Equivalence partitioning (grouping inputs into classes that should behave alike, then testing one from each class) | High | The contract or invoice silently includes the children anyway, because the de-selection was only ever tested on the form. The client is charged for add-ons they explicitly declined — the exact scenario the AP-2444 description was written for, and no current case follows it past the form. |
| P2-04 | Link a Permaplate product to a **second** dealer, create a contract there, and check what Dealer 1380's list shows | Equivalence partitioning across the dealer dimension | High | Dealer 1380 sees another dealership's contracts, or the admin list shows only one dealer's. AP2448_002 counts dealers in the list but cannot prove separation with only one dealership's data in it. Client names and phone numbers crossing between dealerships is a privacy breach. |
| P2-05 | A Permaplate contract for a client whose name contains an apostrophe and an accented character — for example `Marie-Ève O'Brien` | Boundary value analysis (testing the exact edges of what is allowed, where off-by-one and encoding mistakes hide), applied to character encoding | Medium | The name breaks the generated PDF, or renders as `Marie-Ãˆve` in the contract the client signs. This product serves a Quebec dealership where accented names are the norm, not the edge, and the merged-PDF code is new. |
| P2-06 | Generate a Permaplate contract on a quote that has **no vehicle attached** | Error guessing, informed by history | Medium | An unhandled server error. The comparable AP-2437 cycle found exactly this: creditors insurance on a vehicle-less quote returned an HTTP 500, raised as BUG-011. The same shape of quote reaches the Permaplate flow, and nothing tests it. |
| P2-07 | The admin Permaplate contract list with more contracts than fit one page — check paging, and whether a contract on page two can still be opened | Boundary value analysis applied to list length | Medium | The administrator can only ever reach the most recent contracts, so the page fails at precisely the moment the system has enough data to be useful. No ticket in the batch specifies paging, and no case tests it. |
| P2-08 | Set a Permaplate option's *Parent* to an option of a **different term**, if the select box permits it, then open the dealer quote form | Decision table (two independent conditions interacting — the term filter and the parent relationship) | Medium | A child option that can never be enabled, because its parent never appears on the same form. The dealer sees a permanently greyed checkbox with nothing explaining why. AP-2444 criterion 2 restricts the select box by term but nothing tests what happens when that restriction is bypassed. |
| P2-09 | Open the dealer's Permaplate contract download URL for a contract belonging to a **different dealership**, by changing the identifier in the address | Security testing, specifically an insecure direct object reference (guessing another record's identifier in a URL to reach data you should not see) | High | One dealership downloads another's signed contracts, complete with client names, phone numbers and vehicle identification numbers. AP-2443 states a visibility rule for the list but says nothing about the download route, and a rule enforced only in the list is not enforced at all. |
| P2-10 | End-to-end: link a product, quote it with a parent and child option, contract it, check the invoice, both lists, the PDF conditions and the retail-price removals, then unlink — as one continuous scenario | Cross-entity integration | High | Each story passes in isolation while the chain breaks between them. The eight tickets are one workflow, and no single case currently walks the whole of it — the closest, the execution order in test plan §3.4, is a sequence of separate cases rather than one scenario with one contract carried through. |

**Four candidates were dropped** to stay within the cap of ten, all Low priority: browser
back-button behaviour after the unlink confirmation modal; the quote form's behaviour at the
390 × 844 mobile viewport, since no ticket states a mobile expectation; sorting the admin
contract list by each column, which no criterion describes; and the display of a contract
whose dealer has since been deactivated, which no ticket in this batch touches.

---

## Patterns Across Several Tickets

_Risks visible only when the eight tickets are read together. Per-ticket findings are not
repeated here._

### Pattern 1 — Nothing in the batch tests two dealerships

Seven of the eight stories are about who may see or sell what: an administrator grants a
permission, withdraws it, and two different lists show contracts to two different audiences.
**Every one of the 40 test cases runs against a single dealership, Dealer 1380.** Separation
between dealerships is the property most of these stories exist to provide, and it is the one
property the current set structurally cannot prove. P2-04 and P2-09 both attack this, and
together they are the most valuable addition proposed in this review.

### Pattern 2 — Five of the eight stories end in a document or a number, and nobody has said what the number should be

AP-2443 shows a cost price, AP-2446 raises an invoice, AP-2448 shows a program summary,
AP-2445 merges a conditions document, and AP-2456 removes prices and taxes from four
surfaces. Across all five, **not one ticket states an expected figure or an expected page
order.** Three cases are blocked on this directly (AP2446_003, AP2456_004, AP2445_003) and
several more can only record what they see. The single question *"what amount is the dealer
billed, and is it before or after tax?"* would unblock more of this cycle than any other
answer.

### Pattern 3 — The batch was written as eight stories but delivered as one feature, and there is no test for the seam

Each ticket has its own acceptance criteria, and each set is internally complete. What no
ticket owns is the join: that the product an administrator links is the one the dealer
quotes, that the options quoted are the ones contracted, that the contract billed is the one
listed. The test plan handles this by fixing a build-order execution sequence, which is the
right instinct, but a sequence of independent cases is not the same as one scenario carried
through. **P2-10 proposes that missing end-to-end case, and it is the single highest-value
addition in this review.**

### Pattern 4 — No case in the batch tests concurrency, and one story creates money

Nothing anywhere in the 40 cases involves two things happening at once — two clicks, two
tabs, two users. That is an acceptable gap on a list page. It is a less comfortable one on
AP-2446, which raises an invoice, because a duplicated invoice is a real charge against a
real dealer. P2-01 and P2-02 cover the two most likely shapes of it.

### Pattern 5 — The `domain` source being unbound is now costing this project measurably

This is the second cycle in a row where the requirements analysis has had to record that
nothing about the product is written down. Last cycle it cost four blocked cases and nine
questions to the developer. This cycle it costs six blocked cases and ten questions, four of
which — what a term is, what account owner means, what the invoice amount is, which setting
picks the document language — are standing facts about the product that would never need
asking again once written. **Binding `domain` is recommended as a follow-up action in the
test report, with the answers from this run as its first content.**

---

## Recommended actions before execution

1. **Post the ten open questions to their tickets** before the run starts, so the answers can
   arrive while testing proceeds rather than after it. This is P1-03 and it costs minutes.
2. **Promote P2-10, the end-to-end scenario, into a real test case** through a re-run of
   `stlc-testcase-designer`. It is the only proposal that tests the thing the batch was
   actually built to do.
3. **Promote P2-09, the cross-dealership download check.** It tests a privacy property, it
   takes one browser request, and the current set cannot prove it any other way.
4. **Fix P1-05** — make AP2444_002's restore step unconditional, or move it into its own
   final case, so a shared option definition is not left changed on staging.
5. Treat P2-01, P2-03 and P2-04 as the next tier if time allows. Each catches a defect that
   costs a real dealer money or exposes a real client's details.

---

## Summary

| Pass | Findings |
|---|---|
| Pass 1 — document consistency | 6 findings: 3 High, 3 Medium. No untraced acceptance criterion and no orphan reference. |
| Pass 2 — technique-driven proposals | 10 proposed cases: 6 High, 4 Medium. 4 further Low-priority candidates dropped and named. |
| Patterns across tickets | 5 patterns, of which the missing end-to-end scenario and the single-dealership blind spot are the most serious. |
