# Knowledge — Admin Portal Routes

**Mapped:** 2026-08-29, Staging (v2staging). Full sidebar enumeration (49 links) is in the
execution log `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2437_2026-09-06.md`.
Below are only the routes exercised so far — 10 of 49.

Base URL and credentials: [execute.env.md](../base-test/execute.env.md).

---

## Routes that matter so far

| Purpose | Route |
|---|---|
| Dealers list | `/admin/dealers` |
| One dealer | `/admin/dealer/{id}/edit` · `/admin/dealer/{id}/rate-client` |
| Add a dealer | `/admin/dealer/new/edit` |
| Dealer users | `/admin/dealer-users` · `/admin/dealer-user/{id}/change-password` |
| Dealer groups / wholesalers | `/admin/dealer-groups` · `/admin/wholesalers` |
| Insurance | `/admin/insurance` |
| Chubb Insurance Configuration | `/admin/dealer/{id}/chubb-insurance` — see [chubb-insurance.md](chubb-insurance.md) |
| Programs list · one program term | `/admin/programs` (rows link to `/admin/program/{id}/edit`, `/translation/en` · `/translation/fr`, `/assign-coverage-component`) · `/admin/program-term/{id}/edit` — form `program_term[...]`: `programOption` (select), `eligibilityYears`, `eligibilityKm`, `termMonths`, `termKm`, `franchiseAmount`, `repairAmountPerVisit`, `repairAmountTotal`, `repairAmountText`, **`suggestedRetailPrice`** (label "Suggested retail price"), checkboxes `eligibilityCategory[]` (Category A–E), `fuelTypeEligibility[]` (GASOLINE, BEV, DIESEL, HYBRID), `vehicleTypeEligibility[]`. No sidebar link goes straight to a term; the term id is the value of the Client portal's term radio. Mapped 2026-11-01 on Dev (AP-1948 run). "Save" redirects to `/admin/program-terms` with the message "Program terms saved" (used once on term 16 in the AP-1948 re-run and restored the same minute) |
| Financing companies | `/admin/financing-company` (sidebar "Financing Company"; columns Name, Address, Actions — no lender-ID column) · edit `/admin/financing-company/{id}/edit?redirectUrl=…` · delete `/admin/financing-company/{id}/delete`. Edit form labels: Name, Address, City, Province, Postal code, Phone, **Auto shield lender id** (the AP-2226 field). Mapped 2026-11-01 on Dev (AP-2225 run, read only): AutoCapital Canada is id 39 with an empty Auto shield lender id; first page lists ids 58, 45, 44, 43, 42, 41, 40, 39, 38, 37 |
| Risk Management — Earning Sets / Curves / Groups / Assignments | `/admin/earning-set` · `/admin/earning-curve` · `/admin/earning-group` · `/admin/earning-assignment` — see [risk-management.md](risk-management.md) (mapped 2026-10-03) |

**The Dealers list search only works through its dialog.** The magnifier link in the page
header (`href="#"`, the first `.btn` on the page) reveals a form holding
`dealer_search[name]` and `dealer_search[_token]`. A plain GET with just the name parameter
is ignored — the CSRF token must come from that form. Columns are Dealer ID, Name, Company,
Email, Phone, Group, Actions: **no province and no account-label column.**

**Historical open problem (resolved 2026-09-01):** the dealership behind
`vinhle870@gmail.com` displays as "Test QA staging" in the dealer portal but did not match
any row in Admin → Dealers when searched by that label. Resolution: **search by email, not
by the portal-displayed company label** — the list's search box matches the dealer's
**Name** field ("Offical VinhLe870@gmail.com"), not the **Company** field ("Test QA
staging"). Dealer ID is **1380**. See
[execute.env.md](../base-test/execute.env.md) for the full record.

**Non-Quebec dealerships that do exist** (useful once a dealer-user password is available):
ONTARIO TAX TEST, TESTING Alberta, TESTING for BC, TESTING Nova Scotia, SASKATCHEWAN TEST,
Manitoba TEst, NF Test, PEI TEST, NWT TEST, YUKON TEST, NUNAVUT TEST.

---

## Not yet mapped

38 of 49 sidebar routes remain unexplored (Programs mapped 2026-11-01). See the mapping guide
([_mapping-guide.md](_mapping-guide.md)) before diving into any of them.
