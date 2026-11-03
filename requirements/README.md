# requirements/

This folder is where you put the requirement `.md` files that the whole STLC
pipeline reads from. Nothing else in `qa-artifacts/` can be generated until at
least one requirement file lives here, so this is always the first step of a new
test cycle.

Write each file so that it fully describes one or more features, using:

- **User stories** — "As a &lt;role&gt; I want &lt;capability&gt; so that &lt;benefit&gt;."
- **Acceptance criteria** — a numbered list, or Given / When / Then scenarios.
- **Out of scope** — optional, but stating what is *not* covered prevents the
  test-case designer from inventing cases nobody asked for.

Give each file a spec ID in its name (for example `FR9-membership-renewal.md`),
because that ID becomes the prefix of every test case ID generated from it.

**Next step:** run the `stlc-requirements-analyst` skill to turn these files into
`qa-artifacts/1-requirements-analysis/requirements-analysis.md`.
