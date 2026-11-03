# Run Summary — AP-2435: Admin API - warranty search
Updated: 2026-11-01T02:00:00Z · Run folder: 5.0.0 · Stages run: intake → s3b · Run status: stopped_at_gate

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PIPELINE — AP-2435: Admin API - warranty search
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Requirements : 5 REQ · 1 High risks
 Test cases   : 12 designed (all BLOCKED by Q-012) · 8 proposed by review
 Execution    : 0 PASS · 0 FAIL · 12 BLOCKED (Q-012; not executed — design only)
 Bugs         : 0 filed · 0 linked to existing · 0 not a bug
 Corrected    : 12 test cases reworked (review R2 F-1–F-8) · 0 retired · re-run 0/0 PASS
 Verdict      : — (not executed)
 Tickets      : AP-2435 unchanged · 0 bugs updated (0 → Done, 0 → In Progress)
 Stopped at   : s3b (--until s3b — design only, by the run's instruction)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Stopped:** at s3b — the run was limited to design (`--until s3b`), so nothing was executed. Resume with "AP-2435" (it continues from s4), but only after QA has a staging admin API key stored in `/.env` as `AVP_ADMIN_API_KEY`: every test case is BLOCKED without one.

**What passed**
- None. No test case has been executed yet. Twelve test cases are designed and approved. Five check the ticket's stated match rules: part of a contract vehicle's VIN and the whole VIN return the contract (AP2435_001–002), the client's postal code with and without its space returns it (AP2435_003), and the client's telephone in all four formats the ticket lists returns it (AP2435_004–005). Seven record what the build does where the ticket is silent, and fail only on objective faults: partial, lower-case and `+1` forms (AP2435_006), the key in the Authorization Bearer header (AP2435_007), no key and a wrong key — which must return no contract data (AP2435_008–009), a query that matches nothing (AP2435_010), an empty or missing query (AP2435_011), and a short fragment's result count and paging (AP2435_012).

**Failures**
- None. Execution has not run.

**Decisions made**
- Gate A (rule A3, by reviewer R1 round 1 — APPROVE, 0 blocker / 0 major / 2 minor): continue — 0 Blocking questions, 11 Judgement, 2 Info; nothing posted to the ticket. The ticket contradicts itself on the key header ("Authorization Bearer header" in the text, `X-API-KEY` in the example call) and on the response shape ("a JSON array" vs an object with `items`); both are Judgement, and the tests record which form the build uses.
- Gate B (rule B3, by reviewer R2 round 1 — APPROVE, 0 blocker / 0 major / 2 minor): execute the current cases — every acceptance criterion has a case, and the review found no gap citing an acceptance criterion and no High proposal. Eight Medium/Low proposals were not promoted: wildcard and quote characters, telephone with spaces only, a client with two contracts, first/last 6 VIN characters, a revoked key, stored postal code spelling, a 1,000-character query, extra spaces in a postal code.
- Gate B rework (independent reviewer R2, REWORK — 4 blocker / 1 major / 3 minor): the request recipe was rebuilt so a request that never got an answer can never PASS or FAIL a case (it is BLOCKED instead), the key is loaded from `/.env` by name inside every command and never printed, AP2435_001 now tries both key headers the ticket names and fails only if neither works, and a JSON body is required only for a 2xx answer. The test plan and the cases now both read the reference contract on the dealer `/warranty` page. Rule B3 stands; the coverage review was not re-run. No test case creates an API key: creating a real credential is the QA's decision.
- Gate C: not reached — no execution.
- Gate D: not reached — AP-2435 unchanged.
- Run folder 5.0.0, taken from the ticket's fix version (no sprint). Status QC maps to ready for QA, so no design-only rule applied; the run stopped at s3b only because of `--until s3b`.

**Left behind**
- Test data on staging: None.
- Observations that are not failures: no staging admin API key is known to QA (Q-012); the admin portal has a "Manage API keys" page at `/admin/api-keys` (seen in a 2026-10-02 page snapshot) where one may be created. The dealer warranty contract list (`/warranty`) is not yet mapped, so the executor must record where the VIN, postal code and telephone appear on a contract page.
- Knowledge files added or changed: None. Test plan §3, §6, §7 and §8 updated to match the reworked cases.

**Files**
- [requirement capture](requirements/AP-2435-admin-api-warranty-search.md)
- [requirements analysis](qa-artifacts/1-requirements-analysis/AP-2435_requirements-analysis.md)
- [test plan](qa-artifacts/2-test-plan/AP-2435_test-plan.md)
- [test cases 001–005](qa-artifacts/3-test-cases/AP2435_TestCases_001-005.md) · [006–010](qa-artifacts/3-test-cases/AP2435_TestCases_006-010.md) · [011–012](qa-artifacts/3-test-cases/AP2435_TestCases_011-012.md)
- [review findings](qa-artifacts/3-test-cases/AP2435_ReviewFindings_2026-11-01.md)
- [review record](qa-artifacts/7-reviews/AP-2435_review.md)
- [run state](qa-artifacts/.pipeline/AP-2435.md)

## Automation
Not run yet.
