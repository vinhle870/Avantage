# AP-2471 — Admin: Earning Curve management

**Spec ID:** AP-2471
**Source:** Jira [AP-2471](https://garantieavantageplus.atlassian.net/browse/AP-2471) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee:** Vinh Le - QC
**Created:** 2026-09-18 · **Last updated:** 2026-09-30
**Captured on:** 2026-10-03 by stlc-ticket-pipeline from the description, acceptance criteria (`customfield_10150`), 4 comments and 4 attachments.
**Parent:** None
**Sprint / fix version:** None in the ticket — run folder `5.2.0` chosen by the QA.

> Faithful transcription of AP-2471 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

As an admin user, I can create, edit and delete earning curves

## Original requirement text

> # Definition of earning curve
>
> An insurance earning curve is a set of actuarial factors that defines how premium revenue is recognized (earned) over the life of a policy, matching income (payments) with expected losses (claims).
>
> The factors can be defined for each earning point. Each month is an earning point, so for a 36 month contract, there are 36 earning points and 36 factors. For a 48 month contract, there are 48 earning points and 48 factors.
>
> ## Earning Curve types
>
> To calculate the factors, there are 3 different types that are predefined.
>
> 1. Pro-rata
> 2. Rule of 78
> 3. Reverse rule of 78
>
> Besides these 3 predefined types, there can also be a custom type where the admin defines the factors manually, for each earning point. So in total, there can be 4 different types of earning curves.
>
> ### Pro-Rata
>
> It assumes that earning is distributed perfectly evenly across the entire duration of a policy.
>
> Under a pro-rata earning curve, premium is recognized in a **straight line**. Every single day or month of the policy earns an identical dollar amount.
>
> *[image: Screenshot 2026-09-19 at 9.48.09 AM.png]*
>
> **The Math:** If a client buys a 1-year policy for **$1,200**, the system recognizes **$100** as earned revenue each month ($1,200 / 12 months).
>
> ```
> monthly factor = 1 / {totalMonths}
> ```
>
> Example of 1 year (12 months) contract
>
> | Earning point (current month) | Monthly factor | Cumulative Factor |
> |---|---|---|
> | 1 | 8.3333% | 8.33% |
> | 2 | 8.3333% | 16.67% |
> | 3 | 8.3333% | 25.00% |
> | 4 | 8.3333% | 33.33% |
> | 5 | 8.3333% | 41.67% |
> | 6 | 8.3333% | 50.00% |
> | 7 | 8.3333% | 58.33% |
> | 8 | 8.3333% | 66.67% |
> | 9 | 8.3333% | 75.00% |
> | 10 | 8.3333% | 83.33% |
> | 11 | 8.3333% | 91.67% |
> | 12 | 8.3333% | 100.00% |
>
> ### What is rule of 78
>
> The **Rule of 78** is a mathematical method used by insurers to calculate how much income an insurer earns each month on a fixed-term policy.
>
> ### Why is it called the "Rule of 78"?
>
> The number 78 comes from adding up the digits of the months for a one-year (12-month) policy:
>
> 1+2+3+4+5+6+7+8+9+10+11+12=78
>
> If you have a 24-month policy, you would sum the numbers from 1 to 24 (which equals 300), and use that as the denominator.
>
> ### How It Works (The Mechanics)
>
> Under this rule, the months are applied in **reverse order** to determine the income fraction.
>
> - In the **first month** of a 12 month policy, the lender takes **12/78ths** of the total amount.
> - In the **second month**, they take **11/78ths**.
> - In the **final month**, they take only **1/78th**.
>
> Because of this structure, by the time you reach the halfway point of your loan term, you have actually earned roughly **70% of the total amount**, even though you've only completed 50% of the timeline.
>
> *[image: Screenshot 2026-09-19 at 9.54.50 AM.png]*
>
> ```php
> public function calculateFactors(int $totalMonths, int $currentMonth, int $precision = 6): array
> {
>     // ⚠️ Defensive Guard: Ensure month parameters are logically valid
>     if ($totalMonths < 1) {
>         throw new InvalidArgumentException("Total months must be at least 1.");
>     }
>
>     if ($currentMonth < 1 || $currentMonth > $totalMonths) {
>         throw new InvalidArgumentException("Current month must be between 1 and total months ($totalMonths).");
>     }
>
>     // 1. Calculate the standard Sum-of-the-Months-Digits (The Denominator)
>     $denominator = ($totalMonths * ($totalMonths + 1)) / 2;
>
>     // 2. Individual Month Factor Formula: (N - m + 1) / Denominator
>     $monthlyNumerator = $totalMonths - $currentMonth + 1;
>     $monthlyFactor = round($monthlyNumerator / $denominator, $precision);
>
>     // 3. Cumulative Factor Formula: (m * (2N - m + 1)) / (N * (N + 1))
>     // Note: We use the simplified step here matching the denominator structure
>     $cumulativeNumerator = ($currentMonth * ((2 * $totalMonths) - $currentMonth + 1)) / 2;
>     $cumulativeFactor = round($cumulativeNumerator / $denominator, $precision);
>
>     // 4. Remaining Liability (Unearned Premium Reserve factor)
>     $unearnedFactor = round(1.0 - $cumulativeFactor, $precision);
>
>     return [
>         'monthly_factor'     => (float) $monthlyFactor,
>         'cumulative_factor'  => (float) $cumulativeFactor,
>         'unearned_factor'    => (float) $unearnedFactor,
>     ];
> }
> ```
>
> ### Reverse rule of 78
>
> The **Reverse Rule of 78** is the exact mathematical inverse of the standard Rule of 78. Instead of front-loading revenue, it **back-loads** premium recognition.
>
> In a 12-month contract, the earning factors are applied in **forward chronological order** rather than reverse order: [[1]](https://www.linkedin.com/pulse/rule-78-made-easy-one-excel-formula-does-all-lou-mortillaro-hiq0e)
>
> - In **Month 1**, the system earns **1/78th** of the premium.
> - In **Month 2**, it earns **2/78ths**.
> - In **Month 12**, it earns the largest slice: **12/78ths**.
>
> *[image: Screenshot 2026-09-19 at 10.17.58 AM.png]*
>
> ```php
> /**
>  * Calculates the back-loaded earning factors using the Reverse Rule of 78.
>  *
>  * @param int $totalMonths  The complete term length of the contract (N)
>  * @param int $currentMonth The specific month being evaluated (m)
>  * @param int $precision    Decimal precision (Default: 6)
>  * @return array
>  */
> public function calculateReverseFactors(int $totalMonths, int $currentMonth, int $precision = 6): array
> {
>     if ($totalMonths < 1 || $currentMonth < 1 || $currentMonth > $totalMonths) {
>         throw new InvalidArgumentException("Invalid parameters provided.");
>     }
>
>     $denominator = ($totalMonths * ($totalMonths + 1)) / 2;
>
>     // 🔄 Reverse Math: The numerator matches the current month chronologically
>     $monthlyNumerator = $currentMonth;
>     $monthlyFactor = round($monthlyNumerator / $denominator, $precision);
>
>     // Cumulative sum from Month 1 to current month: (m * (m + 1)) / 2
>     $cumulativeNumerator = ($currentMonth * ($currentMonth + 1)) / 2;
>     $cumulativeFactor = round($cumulativeNumerator / $denominator, $precision);
>
>     $unearnedFactor = round(1.0 - $cumulativeFactor, $precision);
>
>     return [
>         'monthly_factor'    => (float) $monthlyFactor,
>         'cumulative_factor' => (float) $cumulativeFactor,
>         'unearned_factor'   => (float) $unearnedFactor,
>     ];
> }
> ```
>
> Example for 12 months contract
>
> | Earning Point | Earning Factor (rule of 78) | Cumulative Factor (rule of 78) | Earning Factor (REVERSE rule of 78) | Cumulative Factor (REVERSE rule of 78) |
> |---|---|---|---|---|
> | 1 | 15.38 | 15.38 | 1.28 | 1.28 |
> | 2 | 14.10 | 29.49 | 2.56 | 3.85 |
> | 3 | 12.82 | 42.31 | 3.85 | 7.69 |
> | 4 | 11.54 | 53.85 | 5.13 | 12.82 |
> | 5 | 10.26 | 64.10 | 6.41 | 19.23 |
> | 6 | 8.97 | 73.08 | 7.69 | 26.92 |
> | 7 | 7.69 | 80.77 | 8.97 | 35.90 |
> | 8 | 6.41 | 87.18 | 10.26 | 53.85 |
> | 9 | 5.13 | 92.31 | 11.54 | 57.69 |
> | 10 | 3.85 | 96.15 | 12.82 | 70.51 |
> | 11 | 2.56 | 98.72 | 14.10 | 84.62 |
> | 12 | 1.28 | 100 | 15.38 | 100.00 |

## Acceptance criteria (verbatim)

Source: Jira field `customfield_10150` ("Acceptance criteria"). The plain CLI view does not show this field.

> ## Given the admin user is in the admin area
>
> ### When
>
> The user opens the menu
>
> ### Then
>
> The “Risk Management” section is available containing “Earning Curves” menu item
>
> - Icon: `fa-tachometer-alt-average`
>
> *[image: Screenshot 2026-09-18 at 4.47.19 PM.png]*
>
> ### When
>
> The user clicks on Earning Curves
>
> ### Then
>
> The earning curves page opens containing the following components
>
> #### Navigation component
>
> Title: Earning Curves
>
> Nav Items:
>
> 1. Create New
>
> #### Datagrid
>
> A datagrid containing the list of Earning Curves created with the following columns
>
> 1. Name
> 2. Term month
> 3. Coverage odometer
>    `Coverage odometer from` - `Coverage odometer to`
> 4. Earning curve type
> 5. Is Enabled?
> 6. Actions
>    1. Edit
>
> ### When
>
> The user clicks on “Create New”
>
> ### Then
>
> A new page opens with the Edit Form containing the following field
>
> 1. Name
>    1. Text
> 2. Term month
>    1. Numeric
>    2. Default value: 12
> 3. Coverage odometer from
>    1. Numeric
> 4. Coverage odometer to
>    1. Numeric
> 5. Earning curve type
>    1. Select Box with the following options
>       1. Pro-Rata (Default)
>       2. Rule of 78
>       3. Reverse rule of 78
>       4. Custom
> 6. Is Enabled?
>    1. Yes/No toggle
> 7. Earning points table
>    A table containing the number of rows equivalent to the **Term month** field
>    1. The table contains following columns
>       1. Earning point (starts from 1 and increments by 1 for each row)
>       2. Monthly Factor
>          1. Numeric Input field
>          2. float type with 4 decimals
>       3. Cumulative Factor
>          The sum of Monthly Factor previous row and current row
>    2. When the term month field is changed, the table is generated containing the same amount of rows than the months value. For example, if the user enters 24 in Term Month, then 24 rows are generated
>    3. When the earning type is changed, the table is generated based the earning type calculations mentioned in the ticket’s description (See examples in the ticket’s description about how to generate each earning curve type)
>    4. When ‘Custom’ is selected for earning curve type, show textboxes in Monthly Factor to allow editing each monthly factor. (Cumulative factor should recalculate the cumulative sum every time there are changes in the monthly factor)
>
> ### Save button

*(The acceptance criteria end at the "Save button" heading. The ticket has no text under it.)*

> Scope clarification — 2026-10-04, from Vinh Le (QA) at Gate C, based on the reporter's mock-up `Screenshot 2026-09-18 at 4.47.19 PM.png`: the icon `fa-tachometer-alt-average` belongs to the **Risk Management** section (its button in the left sidebar rail). "Earning Curves" is a plain-text item in that section's flyout, with no icon of its own.

## Attachments

| File | Read? |
|---|---|
| Screenshot 2026-09-18 at 4.47.19 PM.png | No — listed only (admin menu: Risk Management → Earning Curves) |
| Screenshot 2026-09-19 at 9.48.09 AM.png | No — listed only (Pro-Rata illustration) |
| Screenshot 2026-09-19 at 9.54.50 AM.png | No — listed only (Rule of 78 illustration) |
| Screenshot 2026-09-19 at 10.17.58 AM.png | No — listed only (Reverse Rule of 78 illustration) |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-09-21 | Ken Nguyen | Tells Minh Lưu the story is ready for development and invites questions. |
| 2026-09-22 | Minh Lưu | Points out the Pro-Rata formula `1/totalMonths * currentMonth` grows each month, while the example shows a constant monthly factor, and asks which is right. |
| 2026-09-22 | Ken Nguyen | Confirms that formula describes the cumulative factor; the Pro-Rata monthly factor is constant (1/totalMonths). |
| 2026-09-24 | Ken Nguyen | Reports that with the Custom type the manual monthly-factor input does not save and the cumulative factor is not recalculated; asks the developer to verify. |

---

## Ticket changes since capture — 2026-11-01

**Ticket last updated:** 2026-10-30T11:32:54-04:00 · **Previous capture:** 2026-10-03

Re-captured on 2026-11-01 by stlc-ticket-pipeline from the description, the acceptance
criteria field (`customfield_10150`), 6 comments, 4 attachments, 2 linked issues and the
ticket's change history.

**The description and the acceptance criteria have not changed.** The last description edit
was on 2026-09-22 and the last acceptance-criteria edit on 2026-09-21, both before the first
capture. Both were compared again on 2026-11-01 and match the text transcribed above word for
word, including the acceptance criteria still ending at an empty "Save button" heading. No
earlier statement in this file is replaced.

What changed after 2026-10-03:

| Date | Who | Change |
|---|---|---|
| 2026-10-03 | Vinh Le - QC | Linked AP-2485 and AP-2486 to AP-2471 as "relates to" (the two bugs filed by the previous QA run). Both are now in status QC. |
| 2026-10-16 | Vinh Le - QC | Re-assigned AP-2471 to Ken Nguyen. |
| 2026-10-30 | Ken Nguyen | Re-assigned AP-2471 back to Vinh Le - QC. Status is still **QC**. |

No sprint and no fix version are set on the ticket.

New comments (both written by the QA account, so neither answers an open question):

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-10-03 | Vinh Le - QC | Asks Ken Nguyen three questions the ticket does not cover: should an odometer "from" greater than "to" be refused (and are overlapping ranges allowed), must Custom factors total 100%, and should negative Custom factors be refused. All three currently save without error. |
| 2026-10-03 | Vinh Le - QC | Posts the previous QA result (FAIL, 11 of 15 passed), lists AP-2485 and AP-2486, and asks whether delete is still in scope and what the empty "Save button" criterion should say. |

No one outside the QA account has commented since 2026-09-24, so every question asked on
2026-10-03 is still unanswered.
