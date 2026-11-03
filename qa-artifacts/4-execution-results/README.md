# 4 — Execution Results

This folder records what actually happened when the test cases were run, which
is the evidence every downstream report and bug ticket is built from.

**Filled in by:** the `stlc-manual-executor` skill.
**Output file:** `execution-log.md`
**Evidence:** `screenshots/`

The execution log contains:

- A Pass / Fail / Blocked verdict for every test case that was attempted.
- Step-level detail for each failure: what was expected, what was observed, and
  the environment and account used.
- Links to the screenshots captured during the browser run.

**Next step:** run `stlc-bug-reporter` to raise tickets for the failures, then
`stlc-test-reporter` for the executive summary.
