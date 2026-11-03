# Test Case Review — AP2437

**Date:** 2026-09-03
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** `qa-artifacts/1-requirements-analysis/AP-2437_requirements-analysis.md`, `qa-artifacts/2-test-plan/AP-2437_test-plan.md`, `qa-artifacts/3-test-cases/AP2437_TestCases_001-005.md`, `…_006-010.md`, `…_011-015.md`, `…_016-020.md`

**Standing caveat:** The real acceptance criteria for the central rule of this story could not be retrieved. The Jira acceptance-criteria field states the four decision conditions and leaves **all four branch bodies empty**, so which of the four attached PDFs each branch selects is written down nowhere. Test cases AP2437_006 to AP2437_010 assert against a mapping *inferred from the attachment filenames*. Until Q-001 is answered, that batch is a risk-based reconstruction, not AC-confirmed coverage, and a PASS from it means only "the build agrees with our guess".

**Second caveat, and the more important one for planning:** 17 of the 20 designed cases ship BLOCKED. The three that can run today — AP2437_013, AP2437_014 and AP2437_019 — inspect the four PDFs attached to the ticket and regression-check the warranty PDF path. **None of them opens a Chubb insurance contract.** Executing everything that is currently runnable would therefore prove nothing whatsoever about the feature AP-2437 delivers. This suite is not thin by design error; it is correctly scoped and comprehensively gated. But nobody should read "3 cases executed, 3 passed" as evidence the story works.

**Knowledge-source note.** The `domain` source is `unbound` and `cleanup` is `missing` in the project knowledge registry. Per this skill's Step 1, a batch designed against unverified facts is itself a finding — but in this case each of the four batch files does carry a populated Known blockers table naming exactly what is unverified, and the cases affected ship BLOCKED rather than `Not Run`. **That obligation is met.** The `cleanup` gap is handled inside AP2437_017, which restores the configuration it breaks in its own final step. No finding is raised here.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have at
least one test checking it. This section lists the ones that have none, plus any test
that points at a requirement number which does not exist._

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | **No test downloads two different contracts and confirms each carries its own client's data.** The criterion says the merge happens per contract against a PDF fetched live from Chubb for *that* contract, each carrying unique client data. Every existing case exercises one contract in isolation, so nothing in the suite would notice if the same generated file were served for all of them. | REQ-001 criterion 3, AC-10 | **High** | A cached or misidentified PDF: client A is handed a legally binding contract carrying client B's name, premium and coverage. This is both a contract defect and a personal-data disclosure, and it is invisible to every test that only ever looks at one contract. |
| 2 | **Nothing verifies the four required confirmations survive into the merged output.** AP2437_013 reads them in the *source* attachments and AP2437_012 checks the merged form is French, but no case confirms that the Sommaire des protections line, the Parlons assurances line, the percentage and the pre-sale acknowledgement are all present and legible **after** the qpdf decrypt and the FPDI re-encode. | REQ-004 / AC-5 to AC-8, via REQ-005 | **High** | The right form is attached and arrives with its text mangled, a font substituted, or a line dropped by the re-encode. Selection tests pass, source-document tests pass, and the client signs a disclosure missing one of its four legally required statements. |
| 3 | **The test plan's own regression scope is not fully covered.** Plan §3.2 commits to re-running "one AP-2436 compliance send to confirm the shared Chubb configuration was not disturbed". AP2437_019 regression-tests the warranty PDF path; no case touches AP-2436. | Test plan §3.2, §5 exit criteria | Medium | AP-2437 and AP-2436 both read Dealer 1380's Chubb configuration. A change to how that configuration is read would break the compliance-document send — a feature already executed and reported at 60 % pass — with no test in either suite noticing the interaction. |
| 4 | **No case tests the missing-`qpdf` failure**, although the analysis names it the highest-probability production failure and the plan's risk table calls for it. Q-005 appears as a *blocker* on several cases but never as the *subject* of one. | REQ-005, plan risk table row 3 | Medium | The feature passes QC on a staging host where `qpdf` happens to be installed and fails on release day on a production host where it is not. The defect is a provisioning gap, and no test in the suite is shaped to find it. Honest mitigation may be a written provisioning confirmation rather than a test — but that decision should be recorded, not left implicit. |
| 5 | **Q-012 — which merge engine actually shipped — has no coverage and probably cannot have any.** Ken asked on 2026-08-26 whether `qpdf` alone would let them keep `Zend_Pdf` and drop the `setasign/fpdi` dependency; no reply is recorded. | REQ-005, Q-012 | Low | Nothing user-visible. Recorded here only so the test report does not imply the engine question was settled. It should be closed by asking the developer, not by testing. |

**Orphan references** (a test cites something that does not exist where it says it does):

- **`AP2437_TestCases_001-005.md`, coverage matrix, REQ-002 row → "*(file 4 — AP2437_015)*"** — AP2437_015 is in **file 3** (`…_011-015.md`), not file 4. A reader following the pointer lands in the wrong file. Same table, REQ-001 row, correctly points at AP2437_016 in file 4.
- **`AP2437_TestCases_016-020.md`, coverage matrix** — AP2437_020 is filed under the **Edge-case** column, but the case's own Type field says **Performance**. Cosmetic, but it makes the matrix disagree with the case.
- No test cites a requirement or AC number that is absent from the analysis. Every `REQ-00N` and `AC-N` reference resolves.

**Unresolved Open Questions affecting coverage:**

- **Q-001** — the branch-to-form mapping is unspecified. Blocks AP2437_006 to AP2437_010, and weakens AP2437_011 and AP2437_012, which need to know which form *should* have appeared before judging its contents. **This is the one to answer first.**
- **Q-002 / Q-003** — no known way to set the insurance rate or the contract language. Blocks the same five cases at step 2; they cannot even be attempted.
- **Q-005** — `qpdf` on staging unconfirmed. If absent, AP2437_001 to AP2437_005 all fail identically and the run is void.
- **Q-013** — the contract download route is unmapped. Blocks all 17 portal-based cases at step 2. Cheapest of the five to resolve, and worth doing even before the others are answered.
- **Q-006** — "attach on the first page" is ambiguous between inserting a page and stamping an overlay. AP2437_002 handles this correctly by recording both outcomes, but cannot score itself until the ambiguity is settled.
- **Q-007** — whether the percentage is fixed in the PDF or merged per dealership. AP2437_014 is designed to answer it, which is the right shape; noted here so the dependency is visible.
- **Q-008 / Q-009 / Q-010** — multi-product behaviour, the intended failure path, and the Chubb-API failure path. AP2437_015, AP2437_016 and AP2437_018 exist for these but each records a finding rather than asserting a result, because no expected behaviour has been stated.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | Two different contracts downloaded in the same session each carry their own client's data and their own acceptance form | Cross-entity | A cached or reused generated file hands client A a contract bearing client B's name and premium — a wrong legal document and a personal-data disclosure in one. Also the only way to prove the "fetched live per contract" criterion. | **High** |
| 2 | Downloading the same contract a second time produces an identical PDF with exactly one acceptance form, not two | State transition | If the merge appends to a stored file rather than rebuilding from the Chubb original, the second download carries the form twice and every later one adds another. The dealer prints a contract with duplicate disclosure pages, and the page-count assertion in AP2437_002 would have passed on the first download. | **High** |
| 3 | A user who is not signed in, or is signed in as a different dealership, cannot fetch another dealership's contract PDF by its URL or ID | Security | Contract PDFs now carry client names, premiums and coverage. If the download endpoint authorises by contract ID alone, guessing or enumerating IDs exposes another dealership's clients — a data breach, not a bug. Nothing in the current suite touches authorisation. | **High** |
| 4 | The four required confirmations are present and text-searchable on the acceptance form *inside the merged contract*, not only in the source PDF | Cross-entity | The correct form is attached but the qpdf and FPDI re-encode drops a line, substitutes a font, or flattens the page to an image. Every selection test passes and the client signs an incomplete or unsearchable disclosure. Pairs with Pass 1 gap 2. | **High** |
| 5 | A language value of lowercase `f`, or a leading/trailing space, still selects the French form | Equivalence partitioning | The rule is written as `language = "F"`. A case-sensitive or untrimmed comparison sends a French-speaking Quebec client an English disclosure — the exact compliance failure the language branch exists to prevent, produced by a data-entry difference nobody would think to look at. | Medium |
| 6 | A contract with an empty, null or zero insurance rate still produces an acceptance form rather than an error | Boundary value analysis | AP2437_010 probes rates that contain "50" as a substring; nothing probes the lower edge. An empty rate could make the substring test throw rather than fall through to the default branch, turning a data gap into a failed contract download at the counter. | Medium |
| 7 | Clicking the download control twice in quick succession produces one valid contract, not a corrupt or truncated one | Error guessing | The merge now spawns an external `qpdf` process writing temporary files. Two overlapping runs for the same contract are a classic temp-file collision, and the visible result is a corrupt download from an action every impatient user performs. | Medium |
| 8 | Two dealerships downloading contracts at the same moment each receive their own correct contract | Error guessing | The same temp-file collision as case 7, but across users, where the failure mode is worse: not a corrupt file but a *swapped* one. Worth running even briefly, because the consequence is the same client-data crossover as case 1 and it would never appear in single-user testing. | Medium |
| 9 | A Chubb contract with an unusually large page count still merges within the request timeout | Boundary value analysis | Every download now runs an external process and a full re-encode. A long contract is where that first exceeds the PHP or web-server timeout, and the dealer sees a failed download with no explanation on precisely the largest, most valuable deals. | Medium |
| 10 | After AP-2437's contract download, the AP-2436 compliance-document send for the same dealership still works | Cross-entity | Both features read Dealer 1380's Chubb configuration. This is the test plan's own committed regression scope (Pass 1 gap 3) and the cheapest way to prove the two features have not been coupled by accident. | Medium |

**1 additional lower-priority candidate is not listed:** a check that the merged PDF's
metadata — title, author, creation date — is not left showing internal tooling or a
temporary file path. It is a genuine tidiness and information-leak concern, but it is
well below the ten above and would not change a release decision.

**What the techniques mean** — only the ones used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people acting at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |
| Cross-entity | Check that what this feature produces is read correctly by the next feature in the workflow. |

---

## Actioned — 2026-09-03

Applied immediately after this review was written:

| Finding | Action taken |
|---|---|
| Pass 1 gap 1 — no test proves per-contract live fetch | Promoted as **AP2437_021** in `AP2437_TestCases_021-023.md` |
| Pass 1 gap 2 — confirmations not verified in the merged output | Folded into **AP2437_012**, whose final verification step now checks all four confirmations are present and text-searchable in the merged PDF and match the source wording recorded by AP2437_013. The case was re-scoped to REQ-004 / AC-5 to AC-8 and raised from Medium to High |
| Pass 2 case 2 — re-download idempotency | Promoted as **AP2437_022** |
| Pass 2 case 3 — download-endpoint authorisation | Promoted as **AP2437_023** |
| Orphan reference — file 1 pointed at "file 4 — AP2437_015" | Corrected to file 3 |
| Orphan reference — AP2437_020 filed under Edge-case | Moved to the Functional column, labelled *(Performance — observational)* |

Not actioned, and deliberately so: Pass 1 gaps 3, 4 and 5, and Pass 2 cases 5 to 10.
They remain valid candidates in this file. Gaps 3 and 4 and Pass 2 case 10 are worth
promoting once the download route is mapped; Pass 2 cases 5 to 9 are worth promoting
once Q-002 and Q-003 make the rate and language settable, since most of them need
exactly that control. Promoting them now would add BLOCKED cases without adding
runnable coverage.

The suite is now **23 cases across 5 files**.

---

## Recommendation

**Hold execution, but not because the suite is weak — because five unanswered questions
make almost all of it unrunnable, and one of the five would make the largest batch
meaningless even if it ran.** The 20 designed cases trace cleanly to every in-scope
requirement, and the four Known blockers tables do the job they exist for. What the
review found is not sloppiness in the cases but three real holes in *what was thought to
test at all*, and they cluster around the same blind spot: every case looks at one
contract, once, as one user.

Three items should be promoted into the test-case file before execution is scheduled.
**Pass 2 case 1** (two different contracts, each with its own client data) closes the
only stated acceptance criterion with no test against it, and the defect it catches —
one client's contract handed to another — is the worst outcome this feature can produce.
**Pass 2 case 2** (re-download is idempotent) costs one extra click during a run that is
already happening and catches a duplicate-form defect that the existing page-count
assertion would sail past. **Pass 2 case 3** (authorisation on the download endpoint) is
the only security coverage anywhere in this suite, over a document containing client PII.
Pass 1 gap 2 is best folded into that promotion as an added verification step on
AP2437_012 rather than a new case.

Everything else can wait for the answers. The order to unblock in is **Q-013** first — it
is a five-minute mapping exercise, it unblocks 17 cases, and it can be done without
anyone else's input — then **Q-001**, without which the five branch cases assert against
a guess, then **Q-002 and Q-003** together, then **Q-005**. In the meantime, run
AP2437_013, AP2437_014 and AP2437_019 now: the first two convert Q-007 into a recorded
fact and produce the reference page counts the rest of the suite needs, and the third
would catch a regression in the untouched PDF path before anyone spends time on the
blockers. Just do not let those three passes be reported as coverage of AP-2437 — they
are preparation for it.
