# 1 — Requirements Analysis

This folder holds the structured reading of everything in `requirements/` — the
bridge between what the product team wrote and what QA is going to test.

**Filled in by:** the `stlc-requirements-analyst` skill.
**Output file:** `requirements-analysis.md`

The generated analysis contains:

- Every user story and acceptance criterion, extracted and given a stable ID.
- Testability risks flagged per requirement, so ambiguous wording is caught
  before anyone writes a test case against it.
- The test types recommended for each requirement (functional, negative,
  boundary, security, and so on).
- Open questions that need a product-team answer before testing can be signed off.

**Next step:** run the `stlc-test-plan-designer` skill.
