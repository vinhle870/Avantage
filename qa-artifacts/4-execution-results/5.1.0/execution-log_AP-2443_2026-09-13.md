# Execution Log — AP-2443 (criterion 5 re-test)

**Executed by:** QA Agent — Manual Executor Skill
**Date:** 2026-09-13
**Base URL:** https://v2staging.garantieavantageplus.ca
**Browser:** Chromium (Playwright)
**Duration:** 04:44 UTC → 04:51 UTC

**Context:** AP2443_004 shipped BLOCKED on 2026-09-06 (Q-001 — no dealer-portal account
without the "Account Owner" role existed, so the criterion 5 visibility split could never
be observed). The user supplied a second credential, `vinhle_ap2@yopmail.com` /
`Password@123`, described as an "account owner" account. This re-test re-checked that
claim, found it still held Account Owner, and resolved the blocker directly.

| Metric | Value |
|---|:---:|
| Total test cases | 1 (AP2443_004, re-run) |
| Passed | 1 |
| Failed | 0 |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **100%** |

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2443_004 | A dealer user who is not an account owner sees only the Permaplate contracts from quotes they created | High | ✅ | 5 | 0 | see Step Results below | Q-001 resolved: non-owner account created by editing permissions; split proven both directions |

---

## Step-by-Step Results

### AP2443_004 — A dealer user who is not an account owner sees only the Permaplate contracts from quotes they created — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Signed in to the Dealer portal as `vinhle870@gmail.com` and opened `/users` to check every user's role | The dealership's user list and roles are recorded | Table showed 5 users. All 5, including `vinhle_ap2@yopmail.com` (the account the user supplied), carried "Account Owner" = checked | ✅ | The supplied credential was still an owner account, not a non-owner one — confirms the user's own description ("account with account owner permission") rather than unblocking the case by itself |
| 2 `[Pre-Condition]` | No non-owner account existed, so — using the signed-in owner's own `User management` permission — opened `/user/edit-permission/135` (the user record for `vinhle_ap2@yopmail.com`) and unchecked "Account Owner", then Saved | A non-owner session becomes available | Save returned to `/users`; the row for `vinhle_ap2@yopmail.com` no longer listed "Account Owner" among its roles (Quotes, Payments, Claims, Insurance, View pricing, Window Sticker, Sales Contract, Receive invoice/claims notifications retained) | ✅ | This is the missing non-owner account Ken Nguyen's Jira comment on AP-2443 (2026-09-08) asked for |
| 3 | Logged out, signed in as `vinhle_ap2@yopmail.com` / `Password@123` (required email 2FA — code read from the Yopmail inbox at `https://yopmail.com/en/?login=vinhle_ap2`), opened `/permaplate-contracts` | The contracts visible to the non-owner user are recorded | Table showed `alert: No entities found` — the non-owner user, having created nothing yet, saw zero rows and specifically did not see the owner's 2 existing contracts (quote 6284 "Perma Testclient", quote 6291 "Perma Retest0913") | ✅ | Proves the negative direction: a non-owner cannot see the owner's contracts |
| 4 | As the non-owner, created quote 6292 (client "NonOwner AP2443Test"), added vehicle VIN `1FAHP35NX8W239204`, selected Permaplate term "10 ans" + option "Autosaver", generated the contract, then reopened `/permaplate-contracts` | The non-owner's own new contract appears in their list | Table showed exactly **1 row**: VIN `1FAHP35NX8W239204`, Client name "NonOwner AP2443Test", phone `5145550301`, cost `0.00$`, Download link `/quote/6292/permaplate-contract-download`. The owner's 2 contracts still did not appear | ✅ | Proves the positive direction: a non-owner sees their own contracts. Cost showing `0.00$` instead of the option's $40 is a separate, minor data question, not part of criterion 5 — not filed as a defect here since it is out of this case's scope |
| 5 `[Verification]` | Logged out, signed back in as owner `vinhle870@gmail.com`, opened `/permaplate-contracts` | The account owner sees every contract in the dealership, including the one just created by the non-owner | Table showed **3 rows**: quote 6292 (non-owner's new contract), quote 6291 "Perma Retest0913", quote 6284 "Perma Testclient" — all three, including the non-owner's | ✅ | The visibility split works correctly both ways: owner sees all, non-owner sees only their own |

**Environment restored:** immediately after step 5, `/user/edit-permission/135` was reopened
and "Account Owner" was re-checked and saved for `vinhle_ap2@yopmail.com`, confirmed by the
`/users` list showing "Account Owner" back in that row. The user was asked whether to keep
the account as non-owner for future regression runs or restore it, and chose **restore** —
so the environment is back to its 2026-09-06 state except for the new quote 6292, which is
left in place as it was created as test evidence (dynamic test data, no cleanup source is
bound for this project — see `qa-artifacts/qa-config/knowledge.md` §1, `cleanup` = `missing`).

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2443/AP2443_004-step1-AllFiveUsersStillAccountOwner_beforeChange.png` — `/users` before any change; all 5 rows including `vinhle_ap2@yopmail.com` show Account Owner
- `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2443/AP2443_004-step2-NonOwnerPermissionSaved_pass.png` — `/users` after saving; `vinhle_ap2@yopmail.com`'s row no longer lists Account Owner
- `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2443/AP2443_004-step3-NonOwnerSeesNoContracts_pass.png` — non-owner's `/permaplate-contracts`, "No entities found"
- `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2443/AP2443_004-step4-NonOwnerSeesOnlyOwnContract_pass.png` — non-owner's `/permaplate-contracts` after creating quote 6292, showing exactly 1 row
- `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2443/AP2443_004-step5-OwnerSeesAllThreeContracts_pass.png` — owner's `/permaplate-contracts` showing all 3 rows

---

## Blocked / Skipped Test Cases

None.

---

## Environment Observations

- The non-owner account requires email 2FA on every login; the owner account does not. Not
  investigated further — outside this case's scope, but worth noting for future runs against
  this account (build in time to read the Yopmail inbox).
- New dynamic data left on staging: quote `6292`, client "NonOwner AP2443Test"
  (`perma.nonowner.0913@yopmail.com`), Permaplate contract on VIN `1FAHP35NX8W239204`
  (term "10 ans" + "Autosaver"), cost recorded as `0.00$` rather than the expected $40 — a
  possible pricing display defect, separate from criterion 5, not filed as a bug in this log
  since it wasn't the focus of this run; flag for the next Permaplate pricing pass.
