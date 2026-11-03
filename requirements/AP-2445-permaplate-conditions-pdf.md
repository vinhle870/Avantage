# AP-2445 — Permaplate conditions appended to the contract PDF

**Spec ID:** AP-2445
**Source:** Jira story [AP-2445](https://garantieavantageplus.atlassian.net/browse/AP-2445) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee (QC):** Ken Nguyen
**Created:** 2026-08-26 · **Last updated:** 2026-09-02
**Captured on:** 2026-09-06 from the Jira description, the Given/When/Then acceptance-criteria field, 2 attachments and 1 comment.
**Attachments (the two condition documents):**
- `PP-OneB-Av_5-2026_EN_FINALE_1 - logo AV+.pdf` — English conditions
- `PP-OneB-Av_5-2026_FR_FINALE_2 - Logo AV+.pdf` — French conditions
**Delivery state at capture:** 5 repositories touched; deployment environment **Staging — DEPLOYED** on 2026-09-03.

> Faithful transcription of AP-2445 for the STLC pipeline. Part of the **Permaplate** feature set.

---

## User story

As a **dealer or client receiving a Permaplate contract**, I want the product conditions
document attached to the contract PDF in my own language, so that the terms I am agreeing
to travel with the contract instead of having to be requested separately.

## Original requirement text (Jira description)

> Add permaplate conditions under each permaplate contract PDF

## Acceptance criteria (verbatim, Given/When/Then field)

**When** the user opens a Permaplate contract
**Then** the contract contains the conditions PDF in the respective language.

## Comments — a known open defect

Ken Nguyen (2026-09-01):

> @Minh Lưu same problem here, the PDF condition is not loading
> https://www.awesomescreenshot.com/video/56112314?key=9098b915c39f2bfe937d130320e2c4d4

**This is a reported failure of this ticket's own acceptance criterion, recorded before
QA started.** It must be re-tested first, not assumed fixed.

## Out of scope

None stated.
