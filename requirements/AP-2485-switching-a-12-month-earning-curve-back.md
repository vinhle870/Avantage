# AP-2485 — [BUG-001][AP2471_004] — Switching a 12-month earning curve back to Pro-Rata keeps the previous type's factors

**Spec ID:** AP-2485
**Source:** Jira [AP-2485](https://garantieavantageplus.atlassian.net/browse/AP-2485) — Project *Avantage Plus (AP)*, type Bug, priority High, status **QC**
**Reporter:** Vinh Le - QC · **Assignee:** Vinh Le - QC
**Created:** 2026-10-03 · **Last updated:** 2026-10-30
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description, acceptance criteria (none), 1 comment and 3 attachments.
**Parent:** None. Linked: *relates to* AP-2471 — Admin: Earning Curve management (Story, QC)
**Sprint / fix version:** None in the ticket — run folder `no-sprint` (gate_mode reviewer, rule E3).
**Labels:** qa-agent, stlc-automated

> Faithful transcription of AP-2485 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket. This is a bug ticket: its steps to reproduce and expected result are the requirement (bug re-test flow).

## Original requirement text

> **Test Case** | AP2471_004
>
> **Requirement** | REQ-004 / REQ-005 — Earning points table regenerates when the earning curve type changes; Pro-Rata monthly factor = 1 / Term month
> **Severity** | High — a curve labelled Pro-Rata can be saved with Rule of 78 factors, so it recognises premium income on the wrong schedule (front-loaded instead of even), and nothing on the screen warns the admin.
> **Priority** | P2
> **Environment** | Chromium (Playwright) · Windows 11 · v2staging, Avantage Plus System v2.0.0
> **First found** | 2026-10-04
> **Reproducibility** | Always at Term month 12. That is 4/4 attempts on the create page (switching from Rule of 78 and from Reverse rule of 78) plus 1/1 on an existing curve's edit page when re-verified on 2026-10-04. It does not happen at Term month 24 or 60.
>
> ### Summary
>
> On the earning curve form ("Create earning curve" or an existing curve's edit page), with Term month 12, selecting "Rule of 78" (or "Reverse rule of 78") and then "Pro-Rata" again leaves the Earning points table showing the previous type's factors. Clicking "Save" then **stores a curve labelled Pro-Rata with Rule of 78 factors**.
>
> ### Steps to Reproduce
>
> 1. Open https://v2staging.garantieavantageplus.ca/admin/login and sign in with an admin account (Courriel / Mot de passe, then click "Se connecter").
> 2. Go to /admin/earning-curve (sidebar → Risk Management → Earning Curves) and click "Create New". The "Create earning curve" page opens with Term month 12 and Earning curve type "Pro-Rata". The table correctly shows Monthly Factor 0.0833 on all 12 rows.
> 3. Leave Term month at 12. In "Earning curve type", select "Rule of 78". The table regenerates: row 1 Monthly Factor 0.1538, row 12 0.0128.
> 4. In "Earning curve type", select "Pro-Rata" again, and look at the Monthly Factor and Cumulative Factor columns.
> 5. Enter any Name (e.g. ProRata-repro), Coverage odometer from 0 and to 10000, click "Save", then click the Edit (pencil) button on that curve's row in the list.
>
> ### Expected Result
>
> The table regenerates with the Pro-Rata calculation. The acceptance criteria say "When the earning type is changed, the table is generated based the earning type calculations mentioned in the ticket's description". The description gives Pro-Rata as "monthly factor = 1 / {totalMonths}", and Ken Nguyen confirmed on 2026-09-22 that it is constant. Every row should show Monthly Factor 0.0833, with Cumulative Factor running 0.0833, 0.1667 … 1.0000 (row 6 = 0.5000).
>
> ### Actual Result
>
> After step 4, the type box shows "Pro-Rata", but the table still shows the Rule of 78 values. Monthly Factor runs 0.1538, 0.1410, 0.1282, 0.1154, 0.1026, 0.0897, 0.0769, 0.0641, 0.0513, 0.0385, 0.0256, 0.0128, and Cumulative Factor reaches 0.7308 at row 6 instead of 0.5000. After step 5, the save succeeds ("Earning curve saved"), the list row reads "12 · Pro-Rata", and the reopened edit page shows type Pro-Rata with the same Rule of 78 factors, so the wrong factors are stored. The same happens when switching from "Reverse rule of 78" back to "Pro-Rata": the Reverse values (0.0128 rising) stay. With Term month 24 or 60, switching back to Pro-Rata regenerates correctly.
>
> ### Suggested Root Cause
>
> Each type change posts the whole form back to the server (/admin/earning-curve/new/edit or /{id}/edit). The re-render seems to regenerate the points only when the Term month or the stored points differ from the Pro-Rata default, so at the default 12 months the submitted points are returned unchanged. The save then trusts the posted factors instead of recalculating them for a predefined type. Unknown — for developer investigation.
>
> ### Notes
>
> - Pro-Rata is the default type, so the most common path (open form, try another type, go back) hits this.
> - The admin has no visual cue: the factor boxes are read-only for predefined types, so the wrong values look authoritative.
> - Re-verified on 2026-10-04 on curve #13 (QA-AP2471-Del-0043): it is now stored as Pro-Rata with Rule of 78 factors and is left that way as evidence.
>
> ### Evidence
>
> Type set to Pro-Rata, but the Earning points table still shows the Rule of 78 factors (0.1538 down to 0.0128).
> [attachment] Same problem coming from Reverse rule of 78: type Pro-Rata, table still shows the Reverse factors (0.0128 rising).
> [attachment] After Save and reopening: the stored curve is type Pro-Rata with Rule of 78 factors.
> [attachment] Source: QA record qa-artifacts/5-testing-report/AP-2471_bug-report.md → BUG-001 (QA run for AP-2471, 2026-10-04).

## Acceptance criteria (verbatim)

None in the ticket (the `customfield_10150` "Acceptance criteria" field is empty). For a bug re-test the Expected Result above is the pass condition; it quotes AP-2471's acceptance criterion and Ken Nguyen's 2026-09-22 confirmation (see `requirements/AP-2471-admin-earning-curve-management.md`, AC line "When the earning type is changed, the table is generated based the earning type calculations…" and the Comments table).

## Attachments

| File | Read? |
|---|---|
| AP2471_004-step2-ProRataKeepsOtherTypeValues_fail.png | No — listed only |
| AP2471_004-step4-ProRataShowsRuleOf78Factors_fail.png | No — listed only |
| BUG-001-verify-after-save-reopen.png | No — listed only |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-10-28 | Ken Nguyen | Asks Minh Lưu to work on this bug next. |
