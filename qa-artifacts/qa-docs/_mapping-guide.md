# Mapping Guide — How to Document a Feature Area

This file holds the *process* of building QA domain knowledge — not knowledge about the
application itself. Read it whenever a test case, manual execution run, or live
exploration takes you somewhere not yet covered by any `qa-docs/*.md` file.

The whole point of this file and the per-feature docs it produces: **the next run does not
repeat the exploration.** The write-up matters as much as the clicking.

---

## 1. Where documented knowledge goes

- **`navigation-map.md`** ([../base-test/navigation-map.md](../base-test/navigation-map.md))
  is an **index only** — the three portals, the dealer sidebar, and a table mapping each
  feature area to the `qa-docs/*.md` file that holds its detail. It carries no deep
  per-feature content.
- **`qa-docs/<feature>.md`** — one file per feature area. This is where routes, forms,
  flows, gotchas and validation text actually live.
- A feature area not yet in the index table is a **declared gap**, listed in
  [navigation-map.md](../base-test/navigation-map.md)'s "Not yet mapped" table.

## 2. Lookup-on-demand

When a skill (or an agent exploring live) needs to know how a function/flow actually works:

1. Check the index table in `navigation-map.md` for a row matching the feature.
2. If found, read the linked `qa-docs/<feature>.md` file.
3. If **not** found, this is a knowledge gap — proceed with the task anyway (never block
   test design or execution on missing docs), but the gap must be closed per §3 before the
   task is considered finished.

## 3. Mandatory write-back after manual execution or live exploration

**Before finishing a manual-execution run or an ad-hoc exploration session:** list every
function/flow actually exercised. For any flow with no matching row in `navigation-map.md`'s
index:

1. Create or extend the matching `qa-docs/<feature>.md` file (recipe in §4 below).
2. Add or update its row in `navigation-map.md`'s index table.
3. Remove the area from `navigation-map.md`'s "Not yet mapped" table if it was listed there.

A manual-execution or exploration task is **not complete** while it leaves a newly-learned
flow undocumented — this is a required step, not optional cleanup.

## 4. The exploration recipe

Work in this order — it is cheapest first, and each step tells you what to look at next.

1. **Enumerate the routes before opening anything.** One `browser.evaluate` can read the
   whole navigation without a single click:
   ```js
   () => Array.from(document.querySelectorAll('nav a'))
     .map(a => a.getAttribute('href') + ' | ' + a.textContent.trim().replace(/\s+/g,' '))
     .join('\n')
   ```
2. **Survey the routes in bulk.** Fetch each one and report its heading, form fields, table
   columns and buttons — ten routes in one call, no navigation:
   ```js
   async () => { const routes = ['/a','/b']; const out = [];
     for (const u of routes) { const r = await fetch(u, {credentials:'same-origin'});
       const d = new DOMParser().parseFromString(await r.text(), 'text/html');
       const h = d.querySelector('main h1');
       const f = Array.from(d.querySelectorAll('main input:not([type=hidden]),main select'))
         .map(e => e.name + ':' + (e.tagName === 'SELECT' ? 'select[' + e.options.length + ']' : e.type));
       const th = Array.from(d.querySelectorAll('main table th')).map(t => t.textContent.trim());
       const btns = Array.from(d.querySelectorAll('main button')).map(b => b.textContent.trim()).filter(Boolean);
       out.push(u + ' [' + r.status + ' -> ' + new URL(r.url).pathname + '] h1="' + (h ? h.textContent.trim() : '-') + '"'
         + '\n  fields: ' + (f.join(', ') || 'none') + '\n  columns: ' + JSON.stringify(th) + '\n  buttons: ' + JSON.stringify(btns)); }
     return out.join('\n'); }
   ```
3. **Walk the happy path once for real, in the browser.** Only this tells you what the
   survey cannot: what redirects where, which button is disabled until when, and whether a
   click opens a modal or navigates.
4. **Read the option values, not the labels.** A `select` label is for humans; the value is
   what a test must set. Capture the full list when it is short, and the interesting subset
   when it is long.
5. **Find the required fields the labels hide.** Submit the form near-empty once and record
   the exact validation text against each field. Server-side messages are part of the map.
6. **Probe one boundary.** Longest field, largest number, empty list. Boundaries are where
   the map earns its keep, and a 500 found here is a bug found cheaply.
7. **Follow the data.** After a successful action, go and look at every place it should have
   landed — a list, a log, a linked record, an email. That is how the per-quote "Compliance
   documents sent" section (see [compliance-documents.md](compliance-documents.md)) was
   found, and it changed a test result.
8. **Search for outcomes by role/structure, not by guessing keywords.** A flash or error
   banner's exact wording is often unpredictable (e.g. an HTTP-400 banner that contains
   neither "error" nor "success" — see [chubb-insurance.md](chubb-insurance.md) §5). Prefer
   `alert`-role searches or full snapshots over narrow regex guesses; a narrow search can
   silently walk past a real result and produce a false conclusion.
9. **Restore what you changed.** Language, configuration, anything toggled. Note the
   fixtures you left behind so the next run can reuse rather than recreate them.

## 5. The file template

Copy this shape for a new `qa-docs/<feature>.md` file. Drop a heading rather than writing
"N/A" under it — an empty heading reads as though the answer is nothing, when it means
nobody looked.

```markdown
# Knowledge — {Feature area}

**Mapped:** {YYYY-MM-DD}, {portal}, account {who}.

## Routes
| Purpose | Route | Heading | Notes |

## Entry points
Where a user starts this flow, and what the control actually is — link, button, row,
menu item. Name the CSS class if the styling is part of an acceptance criterion.

## The flow
An ASCII diagram of page -> action -> page, including redirects.

## Forms
Form prefix, then a field table: name, type, required, option values. Call out any
field whose label does not reveal that it is mandatory.

## Page or modal
Which actions open a modal, which navigate, and where validation errors render.

## Validation and messages
Input -> exact message. Note the language the message is in.

## Side effects — where the data lands
Every surface the action writes to: lists, logs, linked records, emails, PDFs.
Include the column names and the timezone of any timestamp.

## Gotchas
What cost time, what looked broken but was not, what a snapshot will not show.
```

## 6. What earns a place, and what does not

**Write it down if** a future run would waste a call rediscovering it: a real route, a form
field name, an option value, a redirect, a required field, an exact error string, a
timezone, a place data lands, or a dead end that looks like a live control.

**Leave it out if** it is a test result, a bug, or a judgement. Those belong in the
execution log and the bug report. These files describe how the application *is*, not
whether it is right — mixing the two means a bug fix silently invalidates the map.

**Flag rather than guess.** If a route 404s, a page is empty, or a control's purpose is
unclear, say exactly that. "`/quote/{id}/dyr-rates` renders no heading and no form — likely
needs prior data" is useful. Silence is not.

## 7. Keeping it honest

- Anything corrected later gets corrected **in the relevant qa-docs file**, not only in the
  execution log. A run that proves a fact wrong must edit the fact, not just note the
  contradiction elsewhere.
- When evidence contradicts an existing claim but you haven't re-verified it, **flag it in
  place** rather than silently overwriting — note the contradiction and what would resolve
  it, so the next reader knows it's an open question, not a confirmed correction.
- Update `navigation-map.md`'s index and "Not yet mapped" table in the same edit that adds
  or extends a `qa-docs/<feature>.md` file.
- The executing agent extends these files as it goes; it does not wait for a separate
  mapping session.
