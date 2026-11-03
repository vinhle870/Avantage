# screenshots/

This folder holds the browser screenshots captured by `stlc-manual-executor`
during test execution. They are the visual evidence attached to bug tickets, so
do not rename or delete them while a cycle's tickets are still open.

Naming convention: `TC-XXX-[pass|fail]-stepN.png`

Examples:

- `TC-001-pass-step4.png` — TC-001 passed; screenshot taken after the final step.
- `TC-002-fail-step3.png` — TC-002 failed at step 3; this is the failure evidence.
- `TC-003-blocked.png` — TC-003 could not be started at all.
