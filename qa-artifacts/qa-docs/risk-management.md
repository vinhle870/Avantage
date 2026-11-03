# Knowledge — Admin Risk Management (Earning Sets, Curves, Groups, Assignments)

**Mapped:** 2026-10-03, Staging (v2staging), Admin portal, shared admin account from
[execute.env.md](../base-test/execute.env.md). Source run: AP-2473 manual execution,
`qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2473_2026-10-03.md`.

Updated 2026-10-04 (AP-2475 run): Earning Assignment details page, Add/Edit Parameter
dialog and parameter delete — see the last section.

Updated 2026-10-11 (AP-2476 run): the Add/Edit Parameter form changed — six fields are now
optional with an "All" placeholder, new odometer default, Coverage Code is a multi-select, and two
new "Start date" fields exist. See **"Add / Edit Parameter form after AP-2476"** below; it
supersedes the older form tables where they disagree.

Earning Sets was walked end to end (create, edit, validation, boundaries). The three
sibling pages were opened and surveyed only: heading, columns and rows, not their forms
(except the Earning Assignment create form's fields, read by fetch).

---

## Routes

| Purpose | Route | Heading | Notes |
|---|---|---|---|
| Earning sets list | `/admin/earning-set` | Earning Sets | Columns: Description, Actions (Edit). Newest first, **10 rows per page**, `?page=N` |
| Create earning set | `/admin/earning-set/new/edit` | Create earning set | Opens as a **modal dialog** over the list. Also a standalone page if opened directly or after a validation error |
| Edit earning set | `/admin/earning-set/{id}/edit?redirectUrl={abs list url}` | Earning set #{id} | Same modal dialog, pre-filled |
| Earning curves list | `/admin/earning-curve` | Earning Curves | Columns: Name, Term month, Coverage odometer, Earning curve type, Is Enabled?, Actions. Edit `/admin/earning-curve/{id}/edit`. 6 seeded curves (1–6 years, Rule of 78) |
| Earning groups list | `/admin/earning-group` | Earning Groups | Columns: Name, Earning curves, Default Earning curve type, Is Enabled?, Actions (View → `/admin/earning-group/{id}/details`). 1 seeded group "AV+" |
| Earning assignments list | `/admin/earning-assignment` | Earning Assignments | Columns: Description, Earning Set, Dealer Group, Is Enabled?, Actions (View → `/admin/earning-assignment/{id}/details`). 1 seeded row "AV+ / Profit / Group A / Yes" |
| Create earning assignment | `/admin/earning-assignment/new/edit` | Create earning assignment | Fields: `earning_assignment[description]` (text), `earning_assignment[earningSet]` (select of every earning set, alphabetical), `earning_assignment[dealerGroup]` (select: 1 Group A, 2 Group B, 3 group c, 4 Group D), `earning_assignment[isEnabled]` (checkbox) |

> Earning Groups (details, assign/unassign, edit) and the Earning Curve create form are
> documented in full in [earning-groups.md](earning-groups.md) (AP-2472 run, 2026-10-03).

Each of these list pages has a red **Create New** button top right linking to
`/admin/{entity}/new/edit`.

## Entry points

Admin sidebar → **Risk Management** (icon-only rail; clicking it opens a fly-out). Items in
order: **Earning Curves · Earning Sets · Earning Groups · Earning Assignments**. The menu
label is "Earning Sets" (capital S). The fly-out closes on every page load, so navigate by
URL instead.

## The flow — Earning Sets

```
/admin/earning-set  --Create New-->  modal "Create earning set"  --Save (valid)-->  /admin/earning-set  + alert "Earning set saved"
                    --Edit (row)-->  modal "Earning set #{id}"   --Save (valid)-->  /admin/earning-set  + alert "Earning set saved"
                                     modal                       --Save (blank)-->  /admin/earning-set/new/edit (standalone page) with field error
                                     modal                       --browser Back-->  /admin/earning-set (nothing saved, no warning)
```

## Forms

Form name `earning_set`, POST to the route it was loaded from.

| Field | Type | Required | Notes |
|---|---|---|---|
| `earning_set[description]` | textarea, label "Description*" | Yes (server-side) | Blank or whitespace-only → "This value should not be blank." **No `maxlength`**; 255 and 256 characters both save in full. **No uniqueness check**: duplicates save silently |
| `earning_set[redirect_url]` | hidden | — | Where Save returns to |
| `earning_set[_token]` | hidden | — | CSRF |

The only button is **Save**. There is **no Cancel, Back or close (×) button** in the dialog.

## Page or modal

- Create New and Edit open a Bootstrap modal (`#myModal`, `.modal.show`). The browser URL
  does not change while it is open; target it with `role=dialog` selectors.
- Success: the dialog closes, the list reloads and shows a green alert "Earning set saved".
- Validation error: the browser's own `required` check does **not** fire inside the dialog;
  the server rejects the save and the user lands on the standalone page
  `/admin/earning-set/new/edit` with the error under the field.

## Gotchas

- **Pagination at 10.** After a few test records the seeded "Profit" set moves to page 2.
  Count rows across all pages when a case counts rows.
- **Long unbroken text widens the grid.** A 255-character description without spaces pushes
  the Actions column (every Edit button) behind a horizontal scrollbar.
- **HTML and accents are safe.** `Échéance à 100% "test" & <b>bold</b>` is stored and shown
  literally (escaped) in both the grid and the Edit form.
- **Duplicates flow downstream.** Duplicate earning-set descriptions appear as identical
  options in the Earning Assignment "Earning Set" dropdown.
- **No delete action** on earning sets. Test records stay on staging.

## Test fixtures left behind (2026-10-03, AP-2473 run)

Earning sets 4–12, all `QA-AP2473-…` or `Q`. Seeded sets are 1 Profit, 2 Statutory,
3 Reinsurance — do not edit them. Full list in the execution log above.

---

## Add / Edit Parameter form after AP-2476 (2026-10-11)

**Mapped:** 2026-10-11, Staging (v2staging), Admin portal. Source run: AP-2476 manual execution,
`qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2476_2026-10-11.md`. **This section wins over
the two older form tables below** (dated 2026-10-04) wherever they disagree.

### Fields now (13, same on Add and Edit)

| Field (id `earning_assignment_parameter_…`) | Label | Required? | Add-form default / empty display |
|---|---|---|---|
| `condition` | Condition | optional, no `*` | **"All"** (value `""`, selected by default) · New · Used |
| `coverageCodes` (name `coverageCodes[]`) | Coverage Code | optional, no `*` | **Multi-select** with a search box and **Select All / Deselect All**. No "All" list item — with nothing ticked the button reads **"All"**. The old single `…_coverageCode` id is gone |
| `saleDateFrom` / `saleDateTo` | Sale Date from / to | optional, no `*` | Empty, HTML placeholder **"All"** |
| `warrantyStartDateFrom` / `warrantyStartDateTo` | **Start date from / Start date To** | optional, no `*` | **AP-2487 fields.** Text input + gijgo date picker (same widget as Sale Date), `yyyy-mm-dd`. Empty, **no "All" placeholder** (Sale Date has one). Grid column "Start date", right after "Sale Date" — see "AP-2487 additions" below |
| `coverageOdometerFrom` / `coverageOdometerTo` | Coverage odometer from / to | required, `*` | **0 / 999999** (six digits; was 9999999). Blank → "This value should not be blank." |
| `modelYearAgeFrom` / `modelYearAgeTo` | Model Year Age From / to | required, `*` | -1 / 99. Blank → "This value should not be blank." |
| `make` | Make | optional, no `*` | **"All"** (value `""`) then makes alphabetically |
| `lagInterval` | Lag Interval | required, `*` | 0 · 6 · 12 |
| `earningGroup` | Earning Group | optional, no `*` | **"All"** (value `""`) then groups |

Playwright: `selectOption('#…_coverageCodes', {label: 'AP-CADV - Advanced'})` ticks one code;
`selectOption('#…_coverageCodes', [])` clears it back to "All". `selectOption(…, '')` resets Condition,
Make or Earning Group to "All".

### Behaviour (observed 2026-10-11)

- Saving with all six optional fields empty works on Add ("Parameter added") and on Edit ("Parameter saved").
  Clearing filled values on Edit really empties them; filling empty ones on Edit stores them.
- **Grid display of an empty optional field is "All"** (Condition, Coverage Code, Sale Date, Make, Earning
  Group). A half-filled date range renders `2026-01-01 - All`. The Start date column is blank when empty.
- Sale Date from alone (no "to") is accepted and kept.
- Edit dialog of a row with empty fields shows "All" in them and keeps the stored odometer (defaults apply
  to new rows only). Pre-AP-2476 rows such as seeded #1 keep `0 - 9999999`.
- Required fields are unchanged: blank Model Year Age or blank odometer → standalone `/parameter/add` page
  with "This value should not be blank."; nothing saved, no HTTP 500.

### Test fixtures left behind (2026-10-11, AP-2476 run)

Assignment **#15 "QA-AP2476-233044"** (Profit / Group A / Enabled) with 6 parameters, ids 22–27
(odometer to 100003, 100004, 100005, 100006, 100009, 100010). Room for 4 more before the 10-row limit.

### AP-2487 additions — Start date range and multi-code Coverage Code (observed 2026-10-12)

Source run: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2487_2026-10-12.md` (12/12 PASS).

**Start date from / To**
- Both optional; stored on Add and Edit; Edit pre-fills them; clearing both on Edit empties them.
- Grid "Start date" cell: full range `2026-01-01 - 2026-12-31`; **empty → blank** (every other empty optional
  field shows "All"); **half range → `2026-04-01 -` or `- 2026-04-30`** (Sale Date shows `… - All`).
- Reversed range (`from` later than `to`) **saves silently** exactly as entered — no check (open Q-002 on AP-2487).
- Non-date text (`abc`) is typed into the box freely, but Submit is refused server-side: standalone
  `/parameter/add` page, "This value is not valid." under Start date from, other values kept, nothing saved.
- The gijgo picker stays open after typing and covers the Submit button; click elsewhere in the dialog first.

**Coverage Code multi-select**
- 57 codes on 2026-10-12 (first three: AP-CADV - Advanced, AFPP - AFPP, AFPPAVN - AFPPAVN). Option values are
  program ids (AP-CADV = 50, AFPP = 52, AX = 3). Some labels repeat (`AVR - AVR` twice, `1 - AVLX` / `1 - SEGAVL`).
- Ticking a second code keeps the first. Closed button text = comma list of labels ("AP-CADV - Advanced, AFPP - AFPP"),
  cut off with "..." when long — never a count.
- Grid cell lists every stored code on its own line (`<div>` per code, full "CODE - Name" label). "Select All" stores
  all 57 and the grid lists all 57 (row ~1,560 px tall), in database order, not dropdown order — not summarised as "All".
- Edit ticks exactly the stored codes; un-ticking on Edit really removes a code.
- Pre-change rows were migrated: seeded parameter 1 opens with its single code (AX - Motopropulseur - AX) ticked.

**Automation gotchas (Playwright)**
- After pressing Escape on a dialog, its old form stays in `#myModal`. Before filling a newly opened dialog, wait for
  `#myModal form` `action` to end with the expected route (`/parameter/add` or `/parameter/{id}/edit`) — waiting for the
  label "Coverage odometer from" alone matches the stale form and the fresh one then overwrites what was typed.
- Close the open Coverage Code list with its own toggle button. A click at a fixed point in the dialog header can land
  on the list's **Deselect All** button and silently clear every tick.

**Seeded #1 note:** parameter 1's Condition now shows "All" (recorded as "New" on 2026-10-04); not touched by any QA run since.

### Test fixtures left behind (2026-10-12, AP-2487 run)

- Assignment **#16 "QA-AP2487-102722"** (Profit / Group A / Enabled) — **9 parameters**: 28 (odometer to 248702),
  29 (248703), 30 (248704), 32 (248755), 33 (248705), 34 (248706, reversed start range), 36 (248708, 2 codes),
  37 (248709, 2 codes), 38 (248711). Room for **1** more before the 10-row limit (AP-2484).
- Assignment **#17 "QA-AP2487-103520"** (Profit / Group A / Enabled) — 1 parameter: 39 (248712, all 57 codes).
- Parameter ids 31 and 35 were created by script slips and deleted (unassigned) in the same run.

---

## Earning Assignment details and parameters (AP-2474 / AP-2475)

**Mapped:** 2026-10-04, Staging, Admin portal. Source run: AP-2475 manual execution,
`qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2475_2026-10-04.md`.

### Routes

| Purpose | Route | Heading | Notes |
|---|---|---|---|
| Create assignment → Save | `/admin/earning-assignment/new/edit` | Create earning assignment | Save lands on the details page with alert "Earning assignment saved" |
| Assignment details | `/admin/earning-assignment/{id}/details` | Earning Assignment {description} | Nav links **Edit** (`/{id}/edit`) and **Add Parameter**. Empty grid shows "No entities found" |
| Add Parameter | `/admin/earning-assignment/{id}/parameter/add` | Add Parameter | Bootstrap modal (`#myModal`) loaded by AJAX; the URL does not change. Submit → details page + alert "Parameter added" |
| Edit parameter (pencil) | `/admin/earning-assignment/{id}/parameter/{paramId}/edit` | Edit Parameter | Same modal, pre-filled with every stored value. Submit → details page + alert "Parameter saved". Opening the URL directly gives a standalone page |
| Delete parameter (trash can) | `/admin/earning-assignment/{id}/parameter/{paramId}/unassign` | Unassign parameter | Modal text "Are you sure you want to delete this record?", buttons **Continue** / **No**. Continue → alert "Parameter unassigned" |

Parameter ids are global (shared by every assignment), not per assignment.

### Parameter datagrid

Columns: Condition · Coverage Code · Sale Date (`from - to`) · Coverage odometer (`from - to`) ·
Model Year Age (`from - to`) · Make · Lag Interval · Earning Group · Actions. **Newest row first.**
Actions holds two `btn-light` links: pencil (`fal fa-pen`, edit) then trash can
(`fal fa-trash-alt`, unassign). Neither has a `title` or `aria-label` — target them by `href`
(`a[href$="/parameter/{id}/edit"]`).

### Add / Edit Parameter form

Form name `earning_assignment_parameter`; element ids `earning_assignment_parameter_{field}`.
The selects are Bootstrap-select widgets over real `<select>`s — Playwright `selectOption` on the
hidden select works. Both forms have exactly the same 11 fields; every field is editable.

| Field | Type | Add-form default | Notes |
|---|---|---|---|
| `[condition]` | select | New | New · Used |
| `[coverageCode]` | select | Choose | ~50 programs, label "CODE - Name"; first option "AP-CADV - Advanced", second "AFPP - AFPP" |
| `[saleDateFrom]`, `[saleDateTo]` | text + gijgo datepicker | blank | Format `yyyy-mm-dd`; typing the value directly works |
| `[coverageOdometerFrom]`, `[coverageOdometerTo]` | number | 0 / **9999999** | Letters cannot be typed (field stays empty) |
| `[modelYearAgeFrom]`, `[modelYearAgeTo]` | number | -1 / 99 | — |
| `[make]` | select | Choose | ~200 makes alphabetical; first "Acura", second "Adventurer" |
| `[lagInterval]` | select | 0 | 0 · 6 · 12 |
| `[earningGroup]` | select | Choose | AV+ plus the QA-AP2472-… groups |
| `[save]` | submit "Submit" | — | The only button: **no Cancel and no ×**. Esc closes the modal without saving |

All fields carry `required` and a `*` label, but the browser's required check does not stop the
submit inside the modal. AP-2476 ("All" placeholders, optional fields) was **not deployed** on 2026-10-04 —
it is on staging from 2026-10-11; see "Add / Edit Parameter form after AP-2476" above for the current form.

### Validation (as observed 2026-10-04)

- Blank number field → server error "This value should not be blank." under the field label; the
  user is moved out of the modal to the **standalone** edit/add page with the other values kept.
- **No range check:** odometer from 50000 / to 1000 saves silently and shows `50000 - 1000`.
- Duplicate parameter rows: not observed yet (AP2475_010 was blocked).

### Gotchas

- **The details page returns HTTP 500 once an assignment has 11 parameters** (observed on
  assignment #4: fine with 10 rows, 500 on every load after the 11th, `?page=2` too; the record itself
  is saved). Keep fixture assignments at **10 parameters or fewer**, and spread multi-row test cases
  across more than one assignment. Root cause not confirmed (suspected pagination at 10).
- Modal content arrives by AJAX: wait for a field label (e.g. "Coverage odometer from") before filling.
- A parallel run creating parameters elsewhere makes parameter ids jump — never predict an id; read it
  from the pencil's `href`.
- Earning assignments have no delete action.

### Test fixtures left behind (2026-10-04, AP-2475 run)

Assignment **#4 "QA-AP2475-011346"** (Profit / Group A / Enabled) with 11 parameters (ids 2–8, 10, 12,
15, 16; id 14 deleted). Its details page currently returns HTTP 500 because of the 11-row problem
above — removing one parameter should restore it. Assignments 2, 3 and the "QA-AP2474-…" rows belong
to the AP-2474 runs. Seeded assignment #1 "AV+" (one parameter: New / AX - Motopropulseur - AX /
1990-09-28 - 2099-09-28 / 0 - 9999999 / -1 - 99 / Acura / 0 / AV+) — never edit it.

---

## Earning Assignments — full mapping (added 2026-10-04, AP-2474 run)

**Mapped:** 2026-10-04, Staging (v2staging), Admin portal, shared admin account. Source run: AP-2474
manual execution, `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md`.
Walked end to end: list, create, details, edit, add parameter, unassign parameter, validation.

> This section complements the AP-2475 section above, written the same day by a parallel run. Where
> both describe the parameter form and grid they agree. Read the AP-2475 section for the **Edit
> Parameter** flow ("Parameter saved") and the **HTTP 500 once an assignment holds 11 parameters**
> gotcha. This section adds the assignment Create/Edit form, the list page, and the empty-select HTTP 500.

### Routes

| Purpose | Route | Heading | Notes |
|---|---|---|---|
| Assignments list | `/admin/earning-assignment` | Earning Assignments | Nav item "Create New" only. Columns Description · Earning Set · Dealer Group · Is Enabled? · Actions (View). Newest first, **10 rows per page**, `?page=N` — from 2026-10-04 the seeded "AV+" row is on page 2 |
| Create assignment | `/admin/earning-assignment/new/edit` | Create earning assignment | **Modal** (`#myModal`) over the list. Standalone page after a validation error |
| Assignment details | `/admin/earning-assignment/{id}/details` | Earning Assignment {description} | Nav items **Edit** · **Add Parameter**. Parameter grid below |
| Edit assignment | `/admin/earning-assignment/{id}/edit` | Earning assignment #{id} | **Modal** over the details page, same fields as Create, pre-filled. Save → back to details + "Earning assignment saved" |
| Add parameter | `/admin/earning-assignment/{id}/parameter/add` | Add Parameter | **Modal** over the details page; standalone page after a validation error |
| Edit parameter | `/admin/earning-assignment/{id}/parameter/{paramId}/edit` | Edit Parameter | Pencil icon in the grid's Actions. Same 11 fields. **Not in the AP-2474 ticket**; opened read-only, never submitted |
| Unassign parameter | `/admin/earning-assignment/{id}/parameter/{paramId}/unassign` | Unassign parameter | Trash icon opens a confirmation **modal**; the real action is its POST form to this URL |

### Forms

**Assignment** — prefix `earning_assignment`, POST to the route it was loaded from.

| Field | Label | Type | Notes |
|---|---|---|---|
| `earning_assignment[description]` | Description | text, HTML `required` | `required` does not stop a submit from the modal; server refuses blank/spaces with "This value should not be blank." (spaces trimmed). No uniqueness check |
| `earning_assignment[earningSet]` | Earning Set | single select (bootstrap-select) | Placeholder **"Choose"** (value ""), then every earning set alphabetically (value = set id). **Leaving "Choose" → HTTP 500** |
| `earning_assignment[dealerGroup]` | Dealer Group | single select (bootstrap-select) | "Choose" (""), 1 Group A, 2 Group B, 3 group c, 4 Group D. One dealer group per assignment. **Leaving "Choose" → HTTP 500** |
| `earning_assignment[isEnabled]` | Is Enabled? | checkbox, value 1 | **Checked by default** on Create. Click its `label[for=earning_assignment_isEnabled]` |
| `earning_assignment[save]` | Save | submit (`#earning_assignment_save`) | Only button. No Cancel / × — use Escape (closes the modal) |

**Parameter** — prefix `earning_assignment_parameter`, form heading "Add Parameter", button **Submit**
(`#earning_assignment_parameter_save`). Success → back to details + green alert "Parameter added".

| Field | Label | Type | Default / options |
|---|---|---|---|
| `[condition]` | Condition | select | `new`=New (default, **no placeholder**) · `used`=Used |
| `[coverageCode]` | Coverage Code | select, required | "Choose" + 52 warranty programs, text `{code} - {name}` (first "AP-CADV - Advanced", last "00010730 - VL0730_Program_0001"). Empty → clean "This value should not be blank." |
| `[saleDateFrom]` / `[saleDateTo]` | Sale Date from / Sale Date to | text + gijgo datepicker (`.gj-picker`), required | Empty by default. Format `yyyy-mm-dd`. Typing a date works. Empty → "This value should not be blank." |
| `[coverageOdometerFrom]` / `[coverageOdometerTo]` | Coverage odometer from / to | `type=number`, required | **0** / **9999999**. Letters cannot be typed (value stays empty). Blank → "This value should not be blank." |
| `[modelYearAgeFrom]` / `[modelYearAgeTo]` | Model Year Age From / Model Year Age to | `type=number`, required | **-1** / **99** |
| `[make]` | Make | select, required | "Choose" + 200 brands alphabetical ("Acura" … "Zodiac") |
| `[lagInterval]` | Lag Interval | select | 0 (default) · 6 · 12 |
| `[earningGroup]` | Earning Group | select, required | "Choose" + every earning group alphabetical (value = group id; AV+ = 1) |

**Unassign confirmation** — modal title "Unassign parameter", text **"Are you sure you want to delete this
record?"** (ticket says "Are you sure to delete this record?"). Buttons **Continue** (`#form_save`, submit)
and **No** (`a[data-dismiss=modal]`). Continue → details + alert "Parameter unassigned".

### Parameter grid

Columns: Condition · Coverage Code · Sale Date · Coverage odometer · **Model Year Age** (not "Model Year Age
From") · Make · Lag Interval · Earning Group · Actions (pencil = edit, trash = unassign). Ranges render as
`{from} - {to}` (e.g. `2026-01-01 - 2026-12-31`, `0 - 9999999`, `-1 - 99`). Newest row first.
**An empty grid renders only the alert "No entities found" — no column headers at all.**

### Validation summary (observed)

| Input | Result |
|---|---|
| Description blank / spaces | Refused, standalone page, "This value should not be blank." |
| Earning Set or Dealer Group = "Choose" | **HTTP 500 "Erreur" page** (AP2474_006, 3/3). Nothing written |
| Same earning set + dealer group as an existing assignment | Saved silently |
| Parameter: blank numeric, blank date, blank Coverage Code | Refused cleanly on standalone `/parameter/add` page |
| Parameter: inverted from/to (dates, odometer, model-year age) | Saved silently, shown as entered |
| Parameter: identical to an existing row | Saved silently as a second row |

### Gotchas

- **Validation errors land on a standalone page.** After a refused Add Parameter the user is on
  `/admin/earning-assignment/{id}/parameter/add`, not the details page; the other fields keep their values.
- **Escape** closes the Create / Add Parameter modals, but not after the gijgo datepicker has had focus —
  reload the page instead. Escape on an open bootstrap-select menu closes the whole modal.
- **bootstrap-select menus stay in the DOM.** Scope every pick to its own `.bootstrap-select` container;
  a page-wide "open menu" selector can grab the wrong dropdown's items.
- **Seeded data:** assignment 1 "AV+" (Profit / Group A / Yes) with one parameter (id 1: New ·
  AX - Motopropulseur - AX · 1990-09-28 - 2099-09-28 · 0 - 9999999 · -1 - 99 · Acura · 0 · AV+). Never edit.
- **No delete** for assignments; parameters can be unassigned.
- Other runs (e.g. AP-2475) write to the same tables in parallel — ids are not contiguous.

### Test fixtures left behind (2026-10-04, AP-2474 run)

Assignments 2, 3, 5–14, all `QA-AP2474-…` (id 5 renamed `…-EDITED`, disabled). Parameters 9, 11, 13, 18,
19, 20, 21 on them. Full table in the execution log above. Id 4 (`QA-AP2475-011346`) belongs to AP-2475.
