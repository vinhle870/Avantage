# Run Summary — AP-2377: Customer portal changes
Updated: 2026-11-02T01:09:00+07:00 · Run folder: 3.6.0 · Stages run: s5 → s7 · Run status: complete · **Tested on: Dev (v2dev)**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2377: Customer portal changes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 6 REQ · 1 High risks
 Test cases   : 11 designed (1 promoted at Gate B, 1 BLOCKED at design) · 9 proposed by review
 Execution    : 7 PASS · 3 FAIL · 1 BLOCKED  (Dev, v2dev — pass rate 63.6%, 7 of 11)
 Bugs         : 2 filed (AP-2510, AP-2511) · 0 linked to existing · 0 not a bug
 Corrected    : 0 test cases rewritten · 0 retired · re-run 0/0 PASS  (s4c skipped — no C1 decision)
 Verdict      : FAIL
 Tickets      : AP-2377 unchanged (QC — comment 19446) · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s7 (complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Result:** AP-2377 FAIL — 7 of 11 test cases passed on Dev (v2dev), missing the 90% pass-rate threshold (63.6%). 2 bugs filed. Ticket comment posted and verified (comment 19446); the story stays in QC.

**What passed**
- Vehicle step: the new "Current manufacturer/extended warranty" section — heading, both help sentences and the three fields — sits at the end of the form word for word as in the ticket's mock-up, and the button reads "Continue" ("Continuer" in French) (AP2377_001, 002).
- Step order: submitting the vehicle step now opens Client Info, and the step bar reads Info du véhicule · Info Client · Choisir la couverture · Sommaire (AP2377_003).
- Client Info step: the FORM-L25 consent checkbox is shown unticked with the mock-up's exact text, and the button reads "Get rates now" ("Demander un devis") (AP2377_005, 002). With the box ticked, the button opens the Coverage step with priced terms (AP2377_006); unticked, the page refuses with a message and keeps every value (AP2377_007).
- Summary: a surcharge answered No is not listed, also after changing an earlier Oui to Non (AP2377_009; AP2377_011 step 5).

**Failures**
- AP2377_004 — letters ("abc") in the optional "Warranty mileage limit" field and Continue give the HTTP 500 error page instead of a validation message (2 of 2). Gate C: filed as AP-2510 (Medium).
- AP2377_008 — after answering Oui to the air-suspension question, the summary line shows the question and "(MSRP: 1500.00)" but not "OUI", unlike the ticket's image A3; the surcharge is charged correctly (4 700 = 3 200 + 1 500). Gate C: filed as AP-2511 (Medium).
- AP2377_011 — step 2 fails on the same summary line as AP2377_008. Gate C: filed as AP-2511, one bug for both cases.
- AP2377_010 — BLOCKED, not a failure: no test payment method, so the admin warranty details page (AC 6) was not reached.

**Decisions made**
- Gate A (rule A3, by reviewer R1): continue — 0 Blocking, 6 Judgement, 2 Info open questions; nothing posted (earlier run).
- Gate B (rule B2, by reviewer R2): promote the one High proposal P2-1 as AP2377_011 (earlier run).
- Gate C (rule C4 for each FAIL, by reviewer R3): AP2377_004 → file new (AP-2510); AP2377_008 + AP2377_011 → file new, one bug (AP-2511). C1 held for none — no sentence in the capture or its two comments says the behaviour is intended; 17 duplicate searches found no ticket on this flow.
- Gate D (rules, automatic, by reviewer R4 inline): AP-2377 not moved: pass rate 63.6% (needs 90%); neither bug is stopping (both Medium, no case cut short) and no Blocking question is open. AP-2510 and AP-2511 are new bugs in Backlog, so they get no re-test action.
- Severity: AP-2510 Medium (a customer who types letters cannot continue, but empty or numeric input works); AP-2511 Medium (display difference from the ticket image, price correct). Both ask the author a question — the mileage-limit rule (Q-001) and whether "OUI" is required.
- Both bugs are assigned to Ken Nguyen (`bug_new_assign`), linked to AP-2377 as *Relates*, and carry 2 embedded screenshots each. AP-2510 states that no capture of the form with "abc" typed before Continue was taken.
- Environment: Dev (v2dev) only, by the user's decision; stated as "Tested on: Dev (v2dev)" in both bugs, the test report and comment 19446.

**Left behind**
- Test data on Dev (v2dev): purchase sessions for `client.stage.932`–`940@yopmail.com`; 935–938 reached the summary page. Nothing was paid. Whether the portal stored client or quote records was not checked (`cleanup` source missing). Automation (s8) added one more session during locator discovery (`client.stage.941@yopmail.com`, reached the summary with No) and leaves 7 new sessions per spec run (three runs today: 21 sessions with `client.stage.<timestamp>@yopmail.com` emails).
- Observations that are not failures: the header logo image returns HTTP 500 on every page of the flow; summary dates are in English on the French page; opening `?_locale=fr` directly does not switch the language; after a No answer an empty "Surcharge" heading stays (Q-007).
- Knowledge files added or changed: None in this run (s4's write-backs are listed in the execution log).

**Files**
- [AP-2377_test-report.md](qa-artifacts/5-testing-report/AP-2377_test-report.md)
- [AP-2377_bug-report.md](qa-artifacts/5-testing-report/AP-2377_bug-report.md)
- [execution log](qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2377_2026-11-02.md)
- [run state](qa-artifacts/.pipeline/AP-2377.md)
- [story comment draft](qa-artifacts/4-execution-results/comment_AP-2377_2026-11-02.md) · [review record](qa-artifacts/7-reviews/AP-2377_review.md) (R4 appended)

## Automation
- Spec `playwright-automation/src/tests/client/buyOnline_AP2377.spec.ts`, tag `@AP-2377` (new files only: `src/pages/common/BuyOnlinePage.ts`, `src/flows/BuyOnlineFlow.ts`); runs on Dev (v2dev) only and leaves 7 new purchase sessions on Dev per run, nothing paid.
- 7 of 7 PASSED cases automated — 7 passing, 0 fixme (lint pass; `--repeat-each=2` 14/14 passed; reviewer R5 inline APPROVE, 2 minor).
- Not automated: AP2377_004 — FAIL (AP-2510); AP2377_008 — FAIL (AP-2511); AP2377_011 — FAIL (AP-2511); AP2377_010 — BLOCKED (no payment test data).
- PR skipped: gh CLI not installed (--no-pr). Report: [AP-2377_automation-report.md](qa-artifacts/6-automation/AP-2377_automation-report.md).
