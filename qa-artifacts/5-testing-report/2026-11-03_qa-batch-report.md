# QA Batch Report — 2026-11-03
Generated: 2026-11-03T05:40Z · Selected: 25 (status QC or assigned to the QA account) · Tested: 3 · Skipped: 22 · Environment: Dev (v2dev)

## Summary
None of the three tickets tested on Dev today is ready for release. AP-2502 fails because sending compliance documents returns HTTP 500 for every dealer setup, which also breaks the existing GC6201 send (AP-2542, Highest). AP-2504 works end to end except that both contract pages show raw financing codes (AP-2538) and the Chubb contract PDFs return HTTP 500 (AP-2539). AP-2505's change does not look deployed on Dev: the roadside contract page still opens as a modal and returns HTTP 500 (existing AP-2518). The team should fix AP-2542 first, then confirm AP-2505 is deployed.

| Verdict | Tickets |
|---|---|
| Ready for release | — |
| Not ready — failed | AP-2502, AP-2504, AP-2505 |
| Not ready — blocked | AP-2434, AP-2435 (P3 — AVP_ADMIN_API_KEY missing) |
| Waiting on author | AP-2491 (Q-001 to Nicolas-Eric Tain) |
| Parked by reviewer | — |
| Design only (build not in QA) | AP-2410, AP-2441, AP-2459, AP-2495, AP-2506 (P9 — designed, waiting for QC) |
| Skipped | AP-1948, AP-2225, AP-2374, AP-2377, AP-2428, AP-2477, AP-2493, AP-2494, AP-2496, AP-2497, AP-2498, AP-2499, AP-2501, AP-2503 (P7 — tested 2026-11-01/02, no external change) |

## Per ticket
| Ticket | Plan | Verdict | PASS | FAIL | BLOCKED | Bugs filed | Automated | Report |
|---|---|---|---|---|---|---|---|---|
| AP-2504 | full | FAIL | 9 | 1 | 1 | AP-2538, AP-2539, AP-2540, AP-2541 | 0 — gate failed | [summary](AP-2504_run-summary.md) |
| AP-2502 | full | FAIL | 0 | 5 | 0 | AP-2542 | 0 — gate failed | [summary](AP-2502_run-summary.md) |
| AP-2505 | full | FAIL | 0 | 2 | 8 | — (comment on AP-2518) | 0 — gate failed | [summary](AP-2505_run-summary.md) |

## Ticket details

### AP-2504 — Generate contract: GAP/Creditor Insurance
**FAIL — 9 PASS, 1 FAIL, 1 BLOCKED (81.8%)**

- **Where it is:** last stage s7 · Jira QC → unchanged · Ken Nguyen
- **Failures:** AP2504_006 — "Financing information" on the GAP and creditor contract pages shows FREQUENCY_MONTHLY / TYPE_FINANCING instead of "Monthly" / "Financing" (EN and FR), and five French labels stay in English — AP-2538
- **Decisions:** Gate B B3 — execute — R2 round 1 · Gate C C4 — file new AP-2538; observations filed as AP-2539, AP-2540, AP-2541; missing invoice recorded — R3 round 1 · Gate D — stays QC, comment 19462
- **Needs someone:** Q-001 (AC 1 names the Extended Warranty row but expects the GAP page) — author / Ken Nguyen, comment 19460
- **Left behind:** quotes 6562–6566; co-applicant on 6563; GAP contract AVPG000064 (quote 6564, first GAP contract on Dev); creditor contract AVP000171 (quote 6566)
- **Automation:** Not run — gate failed (81.8% < 90%; AP-2539 High open)

[Full run summary](AP-2504_run-summary.md) · [Test report](AP-2504_test-report.md) · [Review record](../7-reviews/AP-2504_review.md)

### AP-2502 — separate compliance document PDF for GC960 and 6201
**FAIL — 0 PASS, 5 FAIL (0%)**

- **Where it is:** last stage s7 · Jira QC → unchanged · Ken Nguyen
- **Failures:** AP2502_001–005 — GET /compliance-documents/send returns HTTP 500 for every creditor-form setup and from both Quick Quote and Quote Details; document content untested — AP-2542
- **Decisions:** Gate B B3 — execute — R2 round 2 (round 1 REWORK: product line not located) · Gate C C3→E2 — file new AP-2542 (relates to AP-2452) — R3 round 1 · Gate D — stays QC, comment 19463
- **Needs someone:** AP-2542 fixed (developer); empty Form drop-down recorded under Q-001 and empty admin selection under Q-008 for Ken Nguyen
- **Left behind:** quote 6567 (client.stage.2502004@yopmail.com); dealer 1380 creditor-form configuration restored to baseline and verified
- **Automation:** Not run — gate failed (0% < 90%; AP-2542 Highest open)

[Full run summary](AP-2502_run-summary.md) · [Test report](AP-2502_test-report.md) · [Review record](../7-reviews/AP-2502_review.md)

### AP-2505 — Generate contract: Roadside protection
**FAIL — 0 PASS, 2 FAIL, 8 BLOCKED (0%)**

- **Where it is:** last stage s7 · Jira QC → unchanged · Vinh Le - QC
- **Failures:** AP2505_001 step 3 and AP2505_002 step 4 — roadside Generate Contract opens a modal stuck on "Loading..." and GET /quote/{id}/road-side-protection-create-contract returns HTTP 500 — existing AP-2518 (comment 19464)
- **Decisions:** Gate B B3 — execute — R2 round 2 (round 1 REWORK: a step asserted on Q-007) · Gate C C2 — comment on AP-2518, relates link — R3 round 1 · Gate D — stays QC, comment 19465 with a deployment question
- **Needs someone:** developer — is the AP-2505 change merged and deployed to Dev? (branch present, no PR, link still opens a modal); Q-001 ("Vehicle identification" left or right column) — author
- **Left behind:** vehicles 1130–1135, quotes 6568–6573; no contract, no invoice
- **Automation:** Not run — gate failed (0% < 90%; AP-2518 High open)

[Full run summary](AP-2505_run-summary.md) · [Test report](AP-2505_test-report.md) · [Review record](../7-reviews/AP-2505_review.md)

## Bugs filed in this batch
| Bug | Severity | Ticket | Summary |
|---|---|---|---|
| AP-2542 | Highest | AP-2502 (relates AP-2452) | "Send compliance documents" form returns HTTP 500 on Dev for every setup, including GC6201 (regression) |
| AP-2539 | High | AP-2504 (relates AP-2519, AP-2512) | Chubb GAP and creditor contract PDFs return HTTP 500 |
| AP-2538 | Medium | AP-2504 | Raw financing codes and untranslated French labels on the GAP/creditor contract pages |
| AP-2540 | Low | AP-2504 | "Creditor insurance already created" shown on a GAP-contract redirect |
| AP-2541 | Low | standalone (relates AP-2504) | Quote page shows the co-applicant's date of birth one day early |

## Open questions
- AP-2504 Q-001 — Extended Warranty row vs GAP page in AC 1 — author / Ken Nguyen (comment 19460)
- AP-2505 Q-001 — "Vehicle identification" in the left or right column — author (posted on AP-2505)
- AP-2505 — is the change deployed to Dev? — developer (comment 19465)
- AP-2502 Q-001, Q-008 and the other Judgement questions — Ken Nguyen (comment 19463)
- Carried over: AP-2491 Q-001 (Nicolas-Eric Tain); AP-1948 Q-001/Q-002 (Ken Nguyen); AP-2374 Q-010; AP-2428 Q-001–Q-003; AP-2499 Q-011

## Reviews
- **AP-2504** — R2 APPROVE round 1, R3 APPROVE round 1. Open minors: Q-012 should be re-classed Judgement; requirement citations; three byte-identical screenshot pairs. [record](../7-reviews/AP-2504_review.md)
- **AP-2502** — R2 REWORK → APPROVE round 2, R3 APPROVE round 1. Open minors: test plan §9 still says to search every page; inbox naming. [record](../7-reviews/AP-2502_review.md)
- **AP-2505** — R2 REWORK → APPROVE round 2, R3 APPROVE round 1. Open minors: F-8–F-10 wording; two faint screenshots; quote-building script not kept on disk. [record](../7-reviews/AP-2505_review.md)

## Automation pull requests — waiting for you
None. No ticket passed the automation gate, and gh is not signed in (`bash tools/gh-cli/gh.sh auth login`).
