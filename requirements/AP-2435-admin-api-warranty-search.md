# AP-2435 — Admin API - warranty search

**Spec ID:** AP-2435
**Source:** Jira [AP-2435](https://garantieavantageplus.atlassian.net/browse/AP-2435) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee:** Vinh Le - QC
**Created:** 2026-08-07 · **Last updated:** 2026-08-10
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description (Given/When/Then), 0 comments and 0 attachments.
**Parent:** None
**Sprint / fix version:** No sprint. Fix version `5.0.0` (released 2026-08-12) — used as the run folder.
**Linked issues:** None.

> Faithful transcription of AP-2435 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket.

## Original requirement text

> ### Given
>
> The admin API user has an API key created
>
> ### When
>
> The user calls a GET request to **/api/admin/search-warranty?query={{KEYWORD}} with the api key** in the Authorization Bearer header
>
> ```
> curl -X 'GET' \
>   'https://v2staging.garantieavantageplus.ca/api/admin/search-warranty?query=5149779047' \
>   -H 'accept: application/json' \
>   -H 'X-API-KEY: xxx'
> ```
>
> ### Then
>
> The list of contracts found is returned as a JSON array matching the following
>
> * Where **query** _partially_ matches a warranty contract vehicle VIN
>   * OR Where **query** _fully_ matches a warranty client postal code
>     (Make sure that all _spaces_ are removed in the search. Exemple: “H3K7B1”, “H3K 7B1” should all match)
>   * OR Where **query** _fully_ matches a warranty client telephone
>     (Make sure that all spaces, dots, parentheses and hyphens are removed in the search. Exemple: “123-123-1234”, “1231231234”, “123.123.1234”, “(123) 123-1234“ should all match)
>
> ```json
> {
>   "items": [
>     {
>       "contractNumber": "CVE-815"
>     },
>     {
>       "contractNumber": "CVE-793"
>     }
>   ]
> }
> ```

## Acceptance criteria (verbatim)

The Given / When / Then block above is the only acceptance criterion in the ticket. No separate acceptance-criteria field is filled.

> Then: "The list of contracts found is returned as a JSON array matching the following" — VIN partial match, postal code full match (spaces removed), telephone full match (spaces, dots, parentheses and hyphens removed).

## Attachments

| File | Read? |
|---|---|
| None | — |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| — | — | No comments on the ticket. |
