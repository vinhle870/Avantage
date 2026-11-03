# Requirements Analysis Report

**Project:** Avantage Plus v2 — Admin portal, Risk Management (AP-2474: Earning Assignment)
**Date:** 2026-10-04
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** requirements/AP-2474-earning-assignment.md (transcribed from Jira AP-2474: description and the acceptance-criteria field `customfield_10150`. The ticket has no comments and no attachments)
**Total requirements found:** 7

related_docs: [qa-docs/risk-management.md](../qa-docs/risk-management.md) (mapped 2026-10-03 during the AP-2473 run) already records the Earning Assignments list route `/admin/earning-assignment`, its columns, one seeded row ("AV+ / Profit / Group A / Yes"), the create route `/admin/earning-assignment/new/edit` and the create form's four fields. [qa-docs/earning-groups.md](../qa-docs/earning-groups.md) records how the sibling Earning Groups details page, its assign form and its unassign confirmation behave. The Earning Assignment **details page, its Edit action and the Add Parameter form have never been opened** — that part is not known and will be learned during execution.

---

## Executive Summary

AP-2474 adds the **earning assignment** screens to the Risk Management area of the admin portal. Read with its sibling tickets, an earning assignment ties an *earning set* (AP-2473) to a *dealer group*, and its **parameters** decide which *earning group* (AP-2472 — a bundle of earning curves, the monthly income-recognition tables from AP-2471) applies to a contract, based on the vehicle's condition, the coverage code, the sale date, the odometer, the model-year age, the make and a lag interval. The ticket does not say this in words, and it does not describe how the parameters are used downstream, so this analysis only tests what the screens show and store.

The ticket's acceptance criteria are much richer than those of the sibling tickets. They split into seven requirements:

1. The "Earning Assignments" menu item under Risk Management.
2. The Earning Assignments list page (title, "Create New", a five-column datagrid with a **View** action).
3. The Create New form in a modal (Description, Earning Set, Dealer Group, Is Enabled?, Save).
4. Saving the form, which must land on the new assignment's **details page** with the title "Earning Assignment {description}", nav items **Edit** and **Add Parameter**, and a parameters datagrid.
5. The **Add Parameter** form in a modal: ten fields with stated types, options and four stated default values.
6. Submitting a parameter, which must add it to the details page's parameter datagrid with ranges shown as "from - to".
7. Removing a parameter through a trash-can icon and a confirmation dialog.

**12 testability risks** are flagged, 3 of them High, and there are **11 open questions**. The High risks are: no validation or required-field rules for either form; no rule that a range's "from" must not exceed its "to"; and no criteria at all for the **Edit** nav item, which the ticket shows but never describes.

Overall testability is **Medium-to-High**. Everything the admin sees — menus, columns, field types, options and default values — is stated precisely and can be proven. What cannot be signed off as written is how the forms react to bad input, and what Edit does.

---

## Requirements Detail

### REQ-001 — "Earning Assignments" menu item under Risk Management

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want an "Earning Assignments" item in the admin menu so that I can reach the earning-assignment screens. |
| **Priority** | Medium. It is the only menu entry into the feature, but it is simple to confirm and the AP-2473 run already saw the item in the menu. |
| **Source File** | AP-2474-earning-assignment.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. Given the admin user is in the admin area, when the user opens the menu, the "Risk Management" section is available containing an "Earning Assignments" menu item.
2. When the user clicks Earning Assignments, the earning assignments page opens.

**Out of Scope:**

- The other Risk Management items (Earning Curves AP-2471, Earning Groups AP-2472, Earning Sets AP-2473), which have their own tickets.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket does not say which admin roles may see the item, so we cannot tell whether a lower-privilege admin should be refused. | Low | Test with the shared admin account only. Raise Q-010. |

---

### REQ-002 — Earning Assignments list page

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want a page listing every earning assignment so that I can see which earning set applies to which dealer group and open one to manage its parameters. |
| **Priority** | Medium. It is the hub of the feature; if the grid shows the wrong set or dealer group, an admin would misread which rules apply to which dealers. |
| **Source File** | AP-2474-earning-assignment.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. The page has a navigation component titled "Earning Assignments".
2. The navigation component has one nav item, "Create New".
3. The page has a datagrid (a table of records) listing the earning assignments created, with the columns **Description**, **Earning Set**, **Dealer Group**, **Is Enabled?** and **Actions**.
4. The Actions column offers **View**, which redirects the user to the assignment details page.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Nothing describes the empty state, sorting, filtering or paging of the grid. Domain knowledge says sibling grids page at 10 rows, newest first. | Low | Record what the page does as an observation; do not fail it. |

---

### REQ-003 — Create New form (modal)

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want a form to enter an earning assignment's description, earning set, dealer group and enabled flag so that I can create an assignment. |
| **Priority** | High. It is the only way to create an assignment. A dropdown missing an earning set or a dealer group would block the admin from configuring that dealer group at all. |
| **Source File** | AP-2474-earning-assignment.md |
| **Recommended Test Types** | Functional · Negative · Edge-case · UI |

**Acceptance Criteria:**

1. When the user clicks "Create New", a new modal window (a dialog shown over the page) opens with the Edit Form.
2. The form has **Description** — a text field.
3. The form has **Earning Set** — a select box whose options are the list of earning sets.
4. The form has **Dealer Groups** — a select box whose options are the list of dealer groups.
5. The form has **Is Enabled?** — Yes/No.
6. The form has a **Save** button.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| No validation is described: which fields are required, the maximum length of Description, whether duplicate descriptions are allowed, or whether the same earning set + dealer group pair may be assigned twice. Without an error path we cannot say whether accepting an empty description, or a second assignment for the same dealer group, is a bug — and two assignments for one dealer group could make it unclear which rules apply to that dealer's contracts. | High | Run the negative tests (blank description, very long text, duplicate pair) and report results as observations unless the behaviour is plainly harmful (e.g. an HTTP 500). Raise Q-001 and Q-002. |
| "Is Enabled? — Yes/No" does not say whether it is a checkbox, a radio pair or a select, nor what the default is. Domain knowledge (2026-10-03) shows a checkbox. | Low | Accept any control that lets the admin choose Yes or No; record the default. Raise Q-005. |
| The label is "Dealer Groups" (plural) on the form but "Dealer Group" in the grid. It is unclear whether one assignment can cover several dealer groups. Domain knowledge shows a single-choice select. | Medium | Treat it as single choice; record the label and whether multi-select is possible. Raise Q-003. |
| "List of Earning Sets" and "List of Dealer Groups" do not say whether disabled or duplicate entries appear. AP-2473 left duplicate set names on staging, which show as identical options. | Low | Compare the options with the Earning Sets list and the dealer groups known on staging; record differences. |

---

### REQ-004 — Saving an assignment and the details page

| Field | Value |
|---|---|
| **User Story** | As an admin user, I can create an earning assignment. |
| **Priority** | High. Saving is the step that delivers the story, and the details page is where every parameter is managed. |
| **Source File** | AP-2474-earning-assignment.md |
| **Recommended Test Types** | Functional · Negative · Regression · UI |

**Acceptance Criteria:**

1. When the form is submitted, the user is redirected to the Earning Assignment details page.
2. The details page has a navigation component titled "Earning Assignment {{description}}" — the word "Earning Assignment" followed by the description just entered.
3. The navigation component has the nav items **Edit** and **Add Parameter**.
4. The details page has a datagrid of parameters with the columns **Condition**, **Coverage Code**, **Sale Date** (shown as "{Sale date from} - {Sale date to}"), **Coverage odometer** ("{from} - {to}"), **Model Year Age From** ("{Model Year Age from} - {Model Year Age to}"), **Make**, **Lag Interval**, **Earning Group** and **Actions**.
5. The Actions column has a trash-can icon (Unassign) — covered by REQ-007.
6. The new assignment also appears in the Earning Assignments list (implied by REQ-002 criterion 3).

**Out of Scope:**

- Deleting a whole assignment — no action for it is listed.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The **Edit** nav item is listed but nothing says what it does — which fields it shows, whether it is pre-filled, or where Save lands. We cannot sign off Edit, and an Edit that silently overwrote another assignment would corrupt live configuration. | High | Test the minimum implied: Edit opens the form pre-filled with this assignment's values and a changed description is saved and shown in the title. Raise Q-004. |
| The fourth range column is headed "Model Year Age From" although it shows a from–to range; the other range columns drop the "From". Likely a copy slip. | Low | Accept "Model Year Age From" or "Model Year Age"; record the exact header. Raise Q-007. |
| No success message is described, and the empty state of the parameter grid before any parameter is added is not described. | Low | Record both as observations. |

---

### REQ-005 — Add Parameter form (modal)

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want to add parameters to an earning assignment so that I can say which earning group applies to which kind of contract. |
| **Priority** | High. Parameters are the substance of an assignment. A wrong default value (for example an odometer upper limit lower than stated) would silently exclude contracts from the rule. |
| **Source File** | AP-2474-earning-assignment.md |
| **Recommended Test Types** | Functional · Negative · Edge-case · UI |

**Acceptance Criteria:**

1. When the user clicks "Add Parameter", the Parameter form opens in a modal.
2. **Condition** — select box, options **New** and **Used**.
3. **Coverage Code** — select box listing the warranty programs in the system.
4. **Sale Date from** — date picker.
5. **Sale Date to** — date picker.
6. **Coverage odometer from** — numeric text field, default **0**.
7. **Coverage odometer to** — numeric text field, default **9999999**.
8. **Model Year Age From** — numeric text field, default **-1**.
9. **Model Year Age to** — numeric text field, default **99**.
10. **Make** — select box listing the vehicle brands in the system.
11. **Lag Interval** — select box, options **0**, **6** and **12**.
12. **Earning Group** — select box listing the earning groups in the system.
13. A **Submit** button.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| No rule says that "from" must not be greater than "to" for sale dates, odometer or model-year age, and no field is said to be required. A parameter with an inverted range could never match a contract, so a silent save would leave a dealer group without the intended earning rule. | High | Submit inverted ranges, blank fields, negative and non-numeric values and record what happens. Report as observations unless the result is plainly harmful (HTTP 500, unreadable grid). Raise Q-006. |
| "List of warranty programs", "list of vehicle brands" and "list of earning groups" are not defined further — whether disabled entries appear, and what text each option shows (code or name). | Medium | Record the option count and a sample; compare earning groups with the Earning Groups list. Raise Q-008. |
| Lag Interval options 0, 6 and 12 have no unit stated (presumably months) and no default. | Low | Accept the three values as shown; record any unit label. Raise Q-009. |
| Model Year Age default -1 is unusual (an age below zero) — it may be intentional to include next-year models, but it is not explained. | Low | Test the default as stated; do not judge its meaning. |

---

### REQ-006 — Submitting a parameter

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want a submitted parameter to appear in the assignment's parameter list so that I can confirm the rule was recorded. |
| **Priority** | High. If the grid shows different values from those entered, the admin cannot trust the configuration. |
| **Source File** | AP-2474-earning-assignment.md |
| **Recommended Test Types** | Functional · Regression · Edge-case |

**Acceptance Criteria:**

1. When the form is submitted, the parameter is created and available in the Earning Assignment parameter datagrid.
2. Its values appear in the columns of REQ-004 criterion 4, with each range shown as "from - to".

**Out of Scope:**

- How the parameters are applied to contracts or earnings calculations — not described in this ticket.
- Editing an existing parameter — no action for it is listed.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Nothing says whether two parameters that overlap (same condition, coverage code and make, overlapping ranges) are allowed. Overlaps could make it ambiguous which earning group applies. | Medium | Add an overlapping parameter and record the result as an observation. Raise Q-011. |
| Date display format in the grid is not stated. | Low | Record the format; fail only if the dates shown differ from those picked. |

---

### REQ-007 — Removing a parameter (Unassign)

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want to remove a parameter, with a confirmation first, so that I can correct a mistake without deleting something by accident. |
| **Priority** | Medium. It is the only correction path for a wrong parameter; the confirmation protects against misclicks. |
| **Source File** | AP-2474-earning-assignment.md |
| **Recommended Test Types** | Functional · Negative · UI |

**Acceptance Criteria:**

1. Each parameter row has a trash-can icon (Unassign) in its Actions column.
2. When clicked, a modal opens asking "Are you sure to delete this record?" before deletion.
3. (Implied) Confirming removes the parameter from the grid; declining leaves it unchanged.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The stated confirmation text "Are you sure to delete this record?" differs from what the sibling Earning Groups page shows ("Are you sure you want to delete this record?"). The ticket wording may be a paraphrase. | Low | Accept either wording that asks for confirmation; record the exact text. Raise Q-007. |
| The button labels of the confirmation and what "No" does are not described. On Earning Groups they are Continue / No. | Low | Test both buttons and record their labels. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Menu item | ✓ | | | ✓ | ✓ | | | |
| REQ-002 — List page | ✓ | | | ✓ | ✓ | | | |
| REQ-003 — Create form | ✓ | ✓ | ✓ | | ✓ | | | |
| REQ-004 — Save & details page | ✓ | ✓ | | ✓ | ✓ | | | |
| REQ-005 — Add Parameter form | ✓ | ✓ | ✓ | | ✓ | | | |
| REQ-006 — Submit parameter | ✓ | | ✓ | ✓ | | | | |
| REQ-007 — Remove parameter | ✓ | ✓ | | | ✓ | | | |

**Legend:** ✓ = recommended based on requirement content

**Data entities touched:** earning assignment records (created and edited by this run — dynamic test data; each case should create its own with a unique description such as `QA-AP2474-<timestamp>`); assignment parameters (created and removed by this run — dynamic); earning sets (read only — from AP-2473; seeded 1 Profit, 2 Statutory, 3 Reinsurance must not be edited); dealer groups (read only — 1 Group A, 2 Group B, 3 group c, 4 Group D); earning groups (read only — from AP-2472, seeded "AV+"); warranty programs / coverage codes (read only); vehicle makes (read only); the admin user account (static); the admin sidebar menu configuration. The seeded assignment "AV+" must not be edited.

---

## Open Questions

Questions that must be answered by the product team before test case design begins:

| # | Question | Raised against | Assigned to | Due |
|---|---|---|---|---|
| Q-001 | Which fields of the assignment form are required? What is Description's maximum length? Are duplicate descriptions allowed? | REQ-003 | Ken Nguyen (reporter) | Before s4 |
| Q-002 | May the same dealer group be assigned more than once (to the same or a different earning set)? If not, what error should appear? | REQ-003 | Ken Nguyen | Before s4 |
| Q-003 | Can one assignment cover several dealer groups ("Dealer Groups" on the form) or exactly one ("Dealer Group" in the grid)? | REQ-003 | Ken Nguyen | Before s4 |
| Q-004 | What does the Edit nav item on the details page do — same form pre-filled, and where does Save land? | REQ-004 | Ken Nguyen | Before s4 |
| Q-005 | What is the default of "Is Enabled?" on a new assignment, and what does disabling it change? | REQ-003 | Ken Nguyen | Before s6 |
| Q-006 | Which parameter fields are required? Must each "from" be ≤ its "to" (sale date, odometer, model-year age)? What are the allowed ranges? | REQ-005 | Ken Nguyen | Before s4 |
| Q-007 | Are the wordings "Model Year Age From" (grid header) and "Are you sure to delete this record?" exact, or paraphrases? | REQ-004, REQ-007 | Ken Nguyen | Before s6 |
| Q-008 | Should the Coverage Code, Make and Earning Group lists include disabled entries? Does Coverage Code show a code or a program name? | REQ-005 | Ken Nguyen | Before s6 |
| Q-009 | What unit is Lag Interval (months?), and which option is the default? | REQ-005 | Ken Nguyen | Before s6 |
| Q-010 | Which admin roles may see and use Earning Assignments? | REQ-001 | Ken Nguyen | Before s6 |
| Q-011 | Are overlapping parameters on the same assignment allowed? If not, how is the conflict reported? | REQ-006 | Ken Nguyen | Before s6 |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-003 | No validation rules for the assignment form (required fields, length, duplicate descriptions, duplicate dealer-group assignment). | High | Open |
| REQ-004 | The Edit nav item has no acceptance criteria. | High | Open |
| REQ-005 | No required-field or "from ≤ to" rules for the parameter ranges. | High | Open |
| REQ-003 | "Dealer Groups" (plural, form) vs "Dealer Group" (grid) — single or multiple choice is unclear. | Medium | Open |
| REQ-005 | Contents of the Coverage Code, Make and Earning Group lists are not defined. | Medium | Open |
| REQ-006 | Overlapping parameters are not addressed. | Medium | Open |
| REQ-003 | "Is Enabled? Yes/No" — control type and default not stated. | Low | Open |
| REQ-003 | Disabled or duplicate entries in the Earning Set / Dealer Group dropdowns not addressed. | Low | Open |
| REQ-004 | "Model Year Age From" column header likely a copy slip; no success message or empty-grid state described. | Low | Open |
| REQ-005 | Lag Interval unit and default not stated; the -1 model-year default is unexplained. | Low | Open |
| REQ-007 | Confirmation wording and button labels may differ from the ticket. | Low | Open |
| REQ-001 / REQ-002 | Roles not stated; empty state, sorting and paging of the list not described. | Low | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion — REQ-007 criterion 3 is implied; the Edit nav item (REQ-004) has none
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [ ] Open questions have been assigned to stakeholders — assigned in this file, not yet sent to the reporter
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design — waiting for Gate A
