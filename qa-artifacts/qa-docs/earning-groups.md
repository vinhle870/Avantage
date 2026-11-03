# Knowledge — Admin Earning Groups (and the Earning Curve routes they use)

**Mapped:** 2026-10-03, Staging (v2staging), Admin portal, shared admin account from
[execute.env.md](../base-test/execute.env.md). Source run: AP-2472 manual execution,
`qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2472_2026-10-03.md`.

Earning Groups was walked end to end: create, view, assign, unassign, edit, validation and
boundaries. The Earning Curve create form was used to make test curves. The sibling pages
(Earning Sets, Earning Assignments) are in [risk-management.md](risk-management.md).

---

## Routes

| Purpose | Route | Heading | Notes |
|---|---|---|---|
| Earning groups list | `/admin/earning-group` | Earning Groups | Columns: Name · Earning curves · Default Earning curve type · Is Enabled? · Actions (View). Newest first, **10 rows per page**, `?page=N` |
| Create earning group | `/admin/earning-group/new/edit` | Create earning group | Opens as a **modal** over the list. Becomes a standalone page after a validation error or when opened directly |
| Group details | `/admin/earning-group/{id}/details` | Earning Group {name} | Nav item "Edit". Assign form on top, assigned-curves grid below. The assign form POSTs back to this same URL |
| Edit earning group | `/admin/earning-group/{id}/edit` | Earning group #{id} | Modal over the details page, same fields as Create |
| Unassign a curve | `/admin/earning-group/{id}/curve/{curveId}/unassign` | Unassign earning curve | The trash-can link opens a confirmation **modal**. The real action is the modal's POST form to this URL |
| Earning curves list | `/admin/earning-curve` | Earning Curves | Columns: Name · Term month · Coverage odometer · Earning curve type · Is Enabled? · Actions (Edit). Newest first |
| Create earning curve | `/admin/earning-curve/new/edit` | Create earning curve | A **full page**, not a modal (unlike groups and sets) |
| Edit earning curve | `/admin/earning-curve/{id}/edit` | Earning curve #{id} | Full detail in [earning-curves.md](earning-curves.md) (2026-10-04). Never edit seeded curves 1–6 |

## Entry points

Admin sidebar → **Risk Management**: an `h6.nav-link` heading with an icon. Clicking it expands
the group. Items in order: Earning Curves · Earning Sets · **Earning Groups** · Earning
Assignments. The links exist in the DOM even while collapsed (they are hidden), so navigating
by URL is faster.

Each list page has a red **Create New** link (`a[href="/admin/{entity}/new/edit"]`) in the
page's nav area. It is the only item there.

## The flow

```
/admin/earning-group --Create New--> modal "Create earning group"
     modal --Save (valid)--> /admin/earning-group/{id}/details  + alert "Earning group saved"
     modal --Save (blank/spaces)--> /admin/earning-group/new/edit (standalone page, field error)
     modal --Escape--> list (nothing saved)    [there is no Cancel or close button]

/admin/earning-group/{id}/details
     --pick curve + Assign--> same URL + alert "Earning curve assigned"
     --Assign with no option (select empty)--> HTTP 500 "Erreur" page   (see Gotchas)
     --trash icon--> modal "Unassign earning curve"
           --Continue--> same URL + alert "Earning curve unassigned"
           --No--> modal closes, nothing changes
     --Edit--> modal "Earning group #{id}" --Save--> details page + alert "Earning group saved"
```

## Forms

**Earning group** — form prefix `earning_group`

| Field | Type | Required | Notes |
|---|---|---|---|
| `earning_group[name]` | text, label "Name*" | Yes (server-side) | Has HTML `required`, but it does not stop a submit from the modal. Blank or spaces-only → "This value should not be blank." **No `maxlength`**; 255 characters saves in full. **No uniqueness check**: duplicates save silently |
| `earning_group[defaultEarningMethod]` | select, label "Default Earning Method*" | Yes | `pro_rata` = Pro-Rata (default) · `rule_of_78` = Rule of 78 · `reverse_rule_of_78` = Reverse rule of 78. Shown with bootstrap-select (a visible `button.dropdown-toggle` plus `a.dropdown-item[role=option]` items over a hidden native select) |
| `earning_group[_token]` | hidden | — | CSRF |

There is no Is Enabled? field on Create or Edit. Every group shows "Yes" in the list.
The only button is **Save**.

**Assign curve** (details page) — form prefix `earning_group_curve`

| Field | Type | Notes |
|---|---|---|
| `earning_group_curve[earningCurve]` | select, label "Earning Curve*" | Option value = curve id, text = `{name} ({from} - {to})`. Lists **every** curve (disabled curves included) **except** those already in this group. **No empty placeholder option**: the first curve is pre-selected. When no curves are left, the select has 0 options and bootstrap-select shows "Nothing selected" |
| button "Assign" | submit | — |

A curve id that is already assigned, if forced into the POST, is refused with
"This value is not valid."

**Unassign confirmation** — modal form `form`, POST to `.../curve/{curveId}/unassign`. Text
"Are you sure you want to delete this record?". Buttons: **Continue** (`#form_save`, submit) and
**No** (`a[data-dismiss=modal]`).

**Earning curve** — form prefix `earning_curve` (full page)

| Field | Type | Notes |
|---|---|---|
| `earning_curve[name]` | text, required | — |
| `earning_curve[termMonth]` | number, required | Sets how many earning-point rows appear |
| `earning_curve[coverageOdometerFrom]` / `[coverageOdometerTo]` | number, required | Blank → "This value should not be blank." |
| `earning_curve[type]` | select | `pro_rata` · `rule_of_78` · `reverse_rule_of_78` · `custom`. Pro-Rata auto-fills the points (12 months → 0.0833 each) as read-only |
| `earning_curve[isEnabled]` | checkbox | Checked by default |
| `earning_curve[points][N][monthlyFactor]` / `[cumulativeFactor]` | number, required | One pair per term month |
| `earning_curve[save]` | submit "Save" | Success → `/admin/earning-curve` + alert "Earning curve saved" |

## Page or modal

- Group Create and Edit, and Unassign: Bootstrap modal (`.modal.show`, `role=dialog`); the URL
  does not change.
- Curve Create: a full page.
- Validation errors on a group render on the standalone `/new/edit` page, not in the modal.

## Side effects — where the data lands

- New group → first row of the list (newest first); "Earning curves" cell = `None`.
- Assign → details grid row (Name · Term month · Coverage odometer · Earning curve type · Is
  Enabled? · Actions with a trash icon), and the list cell gets one item `{name} ({from} - {to})`.
- One curve can be in many groups. Assigning it to one group does not remove it from another.
- Unassign removes only the group–curve link. The curve stays in the Earning Curves list and in
  every other group (verified 2026-10-03).

## Gotchas

- **Empty Assign → HTTP 500.** When a group already holds every curve, the select is empty
  ("Nothing selected"), and clicking Assign gives the French "Erreur … difficultés techniques"
  page with HTTP 500. Nothing is written.
- **A plain Assign click assigns the first curve.** There is no placeholder option.
- **No Cancel/× on the group modal.** Use Escape (click the modal heading first if focus is in
  the select) or browser Back.
- **Long names widen the grid.** A 255-character name without spaces pushes the Actions/View
  column off-screen behind a horizontal scrollbar.
- **HTML and accents are safe.** `QA-AP2472 É & <b>x</b>` is stored and shown escaped.
- **Pagination at 10.** After the AP-2472 run there are 16 groups, and the seeded "AV+" (id 1) is
  on page 2. Count across pages.
- **Never touch "AV+"** (id 1, Rule of 78, curves 1–6). Its select is empty because it already
  holds all six seeded curves, plus whichever QA curves exist.
- **Curve create form:** the odometer fields once came back empty after other fields changed.
  Check them right before Save.
- **No delete action** for groups. Test groups stay on staging.

## Test fixtures left behind (2026-10-03, AP-2472 run)

Curves: 7 `QA-AP2472-Curve-A` (12, 0–50000, Pro-Rata, enabled; reuse it as "Curve X") and
8 `QA-AP2472-Curve-B-Disabled` (same, disabled). Groups 2–16, all named `QA-AP2472-…`; full
table in the execution log above. Seeded: curves 1–6 ("1 year" … "6 years", Rule of 78) and
group 1 "AV+". Do not edit them.
