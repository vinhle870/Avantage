# 3 — Test Cases

This folder holds the executable test cases — the detailed, step-by-step
instructions that the executor skill (or a human tester) follows.

**Filled in by:** the `stlc-testcase-designer` skill, then extended by
`stlc-testcase-reviewer`.
**Output files:** `{SPEC_ID}_TestCases_{FIRST}-{LAST}.md`, for example
`FR9_TestCases_001-005.md`.

Conventions to keep files readable and executable:

- At most **5 test cases per file** and at most **5 steps per test case**.
- Test case IDs carry the spec prefix, for example `FR9_001`.
- Every case states its preconditions, its test data, and one expected result
  per step.
- The **Status** column is left blank by the designer and is filled in by
  `stlc-manual-executor` after the case actually runs.

**Next step:** run `stlc-testcase-reviewer` to find coverage gaps, then
`stlc-manual-executor` to execute.
