# Knowledge — Admin Earning Curves

**Mapped:** 2026-10-04, Staging (v2staging), Admin portal, shared admin account from
[execute.env.md](../base-test/execute.env.md). Source run: AP-2471 manual execution,
`qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2471_2026-10-04.md`.

List, create, edit, every curve type, Term month boundaries (1, 4, 12, 24, 36, 60) and form
validation were walked. How curves are attached to groups is in
[earning-groups.md](earning-groups.md). The sibling Risk Management pages are in
[risk-management.md](risk-management.md).

---

## Routes

| Purpose | Route | Heading | Notes |
|---|---|---|---|
| Earning curves list | `/admin/earning-curve` | Earning Curves | Columns: Name · Term month · Coverage odometer (`{from} - {to}`) · Earning curve type · Is Enabled? (Yes/No) · Actions. Newest first, **10 rows per page**, `?page=N` |
| Create earning curve | `/admin/earning-curve/new/edit` | Create earning curve | A **full page**, not a modal |
| Edit earning curve | `/admin/earning-curve/{id}/edit` | Earning curve #{id} | Same form as Create |
| Delete | — | — | **None.** No delete control in the list or the edit form (2026-10-04) |

## Entry points

Admin sidebar → the **Risk Management** rail icon (`h6.nav-link` with
`<i class="nav-icon fad fa-tachometer-alt-average">`). Clicking it opens a flyout with
Earning Curves · Earning Sets · Earning Groups · Earning Assignments. **The tachometer icon is on
the section heading; the four menu items carry no icon.** Item links exist in the DOM while
hidden, so navigating by URL is faster.

List page nav area (`main ul.nav`): one red **Create New** link (`a.btn.btn-primary[href="/admin/earning-curve/new/edit"]`).

Row action: a pencil icon button (`a.btn.btn-primary` > `span.fal.fa-pen`) wrapped in a
tooltip span whose `data-original-title` is "Edit". It has no visible text, so find it by
`a[href$="/edit"]` inside the row, not by text.

## The flow

```
/admin/earning-curve --Create New--> /admin/earning-curve/new/edit
    change Term month (on blur) or Earning curve type --> form POSTs to the same URL and re-renders
    --Save (valid)--> /admin/earning-curve + alert "Earning curve saved"
    --Save (invalid)--> same URL re-rendered with field errors
    --Save with an empty factor box--> HTTP 500 "Erreur" page (see Gotchas)
/admin/earning-curve --pencil--> /admin/earning-curve/{id}/edit --Save--> list + "Earning curve saved"
```

## Forms

Form prefix `earning_curve`. Button: **Save** (`button[name="earning_curve[save]"]`, submit).

| Field | Type | Required | Notes |
|---|---|---|---|
| `earning_curve[name]` | text, label "Name*" | Yes | Blank → "This value should not be blank." (server side) |
| `earning_curve[termMonth]` | number, label "Term month*", `min=1 max=999` | Yes | Default **12**. 0 or -1 → "This value should be between 1 and 999." (browser: "Value must be greater than or equal to 1."). Sets the number of earning-point rows |
| `earning_curve[coverageOdometerFrom]` | number, `min=0` | Yes | Empty by default |
| `earning_curve[coverageOdometerTo]` | number, `min=0` | Yes | Empty by default. **No from ≤ to check**: 50000 / 10000 saves |
| `earning_curve[type]` | select (bootstrap-select) | Yes | `pro_rata` = Pro-Rata (default) · `rule_of_78` = Rule of 78 · `reverse_rule_of_78` = Reverse rule of 78 · `custom` = Custom. Visible control is `button.dropdown-toggle` next to the hidden native select; options are `.dropdown-menu.show a.dropdown-item` |
| `earning_curve[isEnabled]` | checkbox, label "Is Enabled?" (`.form-check-input`) | — | **Checked by default**. A plain checkbox, not a switch |
| `earning_curve[points][N][monthlyFactor]` | number, `step=any`, required | Yes | N = 0 … term−1. **Read-only** for Pro-Rata / Rule of 78 / Reverse; **editable** for Custom (starts at `0.0000`) |
| `earning_curve[points][N][cumulativeFactor]` | number, `step=any`, required | Yes | Always read-only |
| `earning_curve[_token]` | hidden | — | CSRF |

Earning points table (`#earning_curve_points`, rows `.earning-curve-point-row`): columns
Earning point · Monthly Factor · Cumulative Factor; rows numbered 1 … Term month.

**Factor scale: a fraction with 4 decimals**, not a percentage. 12-month Pro-Rata = `0.0833`
each, cumulative `1.0000` at the last row. Factor cells are `<input>`s, so their values are not
in the page text. Read them with
`[...document.querySelectorAll('input[name$="[monthlyFactor]"]')].map(i => i.value)`.

Formulas confirmed (4 decimals): Pro-Rata 1/N · Rule of 78 (N−m+1)/(N(N+1)/2) · Reverse
m/(N(N+1)/2). Example rows: 12-month Rule of 78 row 1 = 0.1538; Reverse row 8 cumulative =
0.4615; 24-month Rule of 78 row 1 = 0.0800; 60-month Rule of 78 row 60 = 0.0005.

## Page or modal

- Create and Edit are full pages (unlike Earning Groups and Sets, which use modals).
- Changing **Earning curve type**, or changing **Term month** and leaving the field (blur/Tab),
  POSTs the whole form to the same URL and re-renders the page server side. Typing in Term month
  alone does nothing until blur.
- Custom cumulative factors recalculate **client side** on every `input` event in a monthly
  box. No request is sent.
- Field errors render under the field on the re-rendered page (`.invalid-feedback`, English).

## Validation and messages

| Input | Result |
|---|---|
| Blank Name | "This value should not be blank." under Name |
| Term month 0 or -1 | "This value should be between 1 and 999." under Term month |
| Odometer from > to (50000 / 10000) | **Saves** — no rule |
| Custom factors totalling 0.90 | **Saves** — no rule, no warning |
| Custom factor -0.05 | **Saves** |
| Custom factor box empty (e.g. after typing letters into the number box) | **HTTP 500**, French "Erreur — Désolé, l'application éprouve des difficultés techniques…" page |
| Valid save | Redirect to `/admin/earning-curve`, alert "Earning curve saved" (English) |

## Side effects — where the data lands

- New curve → first row of `/admin/earning-curve` (newest first).
- Edit updates the same row (same id); no duplicate is created.
- Curves appear in the Earning Groups assign dropdown as `{name} ({from} - {to})` — see
  [earning-groups.md](earning-groups.md).

## Gotchas

- **Pro-Rata at Term month 12 does not regenerate.** After switching from Rule of 78 or Reverse
  back to Pro-Rata while Term month is 12, the table keeps the previous type's factors. At 24 and
  60 months it regenerates correctly. Reload the create page to get the clean Pro-Rata default.
- **Fill the odometer fields last.** Every type or term change re-posts the form. Check the
  odometer values right before Save.
- **No delete.** Test curves cannot be removed from the UI. Never edit seeded curves 1–6
  ("1 year" … "6 years", Rule of 78) or the AP-2472 curves 7–8.
- **Pagination at 10.** With 13 curves, "1 year" (id 1) is on page 2.
- The Name field has HTML `required`, but the form still submits empty fields to the server
  (the server returns the validation, or a 500 for an empty factor).
- Admin login fields are `_username` / `_password`. The French labels are not linked to the
  inputs, so label-based locators time out.

## Test fixtures left behind (2026-10-04, AP-2471 run)

| Id | Name | Term | Odometer | Type | Enabled |
|---|---|---|---|---|---|
| 9 | QA-AP2471-Custom-0043 | 4 | 0 - 60000 | Custom (0.4/0.3/0.2/0.1) | Yes |
| 10 | QA-AP2471-Edited-0043 | 36 | 0 - 100000 | Rule of 78 | Yes |
| 11 | QA-AP2471-Neg-Range | 12 | 50000 - 10000 | Pro-Rata | Yes |
| 12 | QA-AP2471-Neg-Custom90-0043 | 4 | 0 - 60000 | Custom (0.4/0.3/0.1/-0.05) | Yes |
| 13 | QA-AP2471-Del-0043 | 12 | 0 - 10000 | Pro-Rata | No |

Ids 9 and 10 are clean, reusable curves. Ids 11 and 12 hold invalid data on purpose: do not
assign them to groups used for other tests.

## Dev (v2dev) — observed 2026-11-02 (AP-2471 run)

Source: `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. Build footer "Avantage Plus System v2.0.0". Routes, fields and formulas above hold on Dev. Differences from the staging notes above:

- **Pro-Rata at Term month 12 now regenerates** after switching from Rule of 78 (AP-2485 fixed on Dev).
- **An empty factor box no longer gives HTTP 500**: Save re-shows the form with "This value should not be blank." under that box (AP-2486 fixed on Dev).
- Term month 0 or −1 does not regenerate the table (it keeps the previous rows); Save then shows "This value should be between 1 and 999."
- Custom factors reset to 0.0000 when you select Custom, when you switch away from Custom and back, and when you change Term month on a Custom curve (new or saved). Custom totals of 0.00 save without warning.
- A disabled curve (Is Enabled? No) is still offered in the Earning Group assign-curve dropdown.
- After Term month + Tab, wait ~2 s for the re-post before reading the table.
- Delete: still none on Dev.

Fixtures left on Dev by the 2026-11-02 run: #32 QA-AP2471-Custom-190721 (Custom 0.4/0.3/0.2/0.1, clean) · #33 QA-AP2471-Edited-190835 (36, Rule of 78, clean) · #34 QA-AP2471-Neg-Range-190916 (odometer 50000 - 10000) · #35 QA-AP2471-Neg-Custom90-191022 (0.4/0.3/0.1/−0.05) · #36 QA-AP2471-Switch-191209 (Custom zeros) · #37 QA-AP2471-Shorten-191304 (3 months, Custom zeros). Ids 34–37 hold invalid data on purpose. Dev also holds #14, #15 (AP-2485) and #16–#31 (AP-2486); leave them.
