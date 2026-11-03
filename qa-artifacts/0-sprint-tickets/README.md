# 0 — Sprint Tickets

This folder holds the ticket lists pulled from the issue tracker, so you can see
exactly which work items a test cycle is meant to cover.

**Filled in by:** the `tracker-fetch-sprint-tickets` skill, against whichever tracker
`qa-artifacts/qa-config/tools.md` binds.
**Output files:** one file per sprint fetched, for example `sprint-08-06-2026-tickets.md`.

Each generated file lists every ticket in the sprint, grouped by status, with its
reference, type, subject, and assignee. Use it to decide which requirements
need test coverage this cycle before you run the requirements analyst.
