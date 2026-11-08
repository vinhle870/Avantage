import { expect, Locator, Page } from '@playwright/test';

/**
 * UI action helpers shared by the page objects.
 * Ports the behaviour of the Java dropdownImpl / checkboxImpl components.
 */

const normalize = (value: string): string => value.replace(/\s+/g, ' ').trim();

/**
 * Select an option from an application dropdown.
 *
 * - Native <select>: selects by visible label.
 * - Custom dropdown (the default in this app): clicks the root, then clicks the
 *   `ul > li` whose `span` text equals `optionText` (whitespace-normalised, so a
 *   two-line option such as "Fiat 500 2015 10,000$\n33333333" matches).
 *
 * The option list is retried until it contains the option, which replaces the
 * fixed Thread.sleep the Java code used while dependent lists (e.g. Model after
 * Make) loaded.
 */
export async function selectDropdownOption(root: Locator, optionText: string, timeout = 15000): Promise<void> {
    await root.waitFor({ state: 'visible', timeout });

    const tagName = await root.evaluate(el => el.tagName.toLowerCase());
    if (tagName === 'select') {
        await root.selectOption({ label: optionText });
        return;
    }

    const items = root.locator('ul li');
    const nativeOptions = root.locator('select option');
    let wanted = normalize(optionText);

    // Dependent lists (e.g. Model after Make) are reloaded by AJAX: wait until the hidden
    // <select> offers the option before opening the widget, so stale options are never used
    if ((await nativeOptions.count()) > 0) {
        await expect(async () => {
            const label = await labelForValue(root, optionText);
            expect(label, `Option "${optionText}" not offered by dropdown ${root}`).not.toBeNull();
            wanted = normalize(label!);
        }).toPass({ timeout });
    }

    let target: Locator | undefined;
    await expect(async () => {
        if (!(await items.first().isVisible())) {
            await root.click();
        }
        const count = await items.count();
        expect(count, `Dropdown ${root} is empty`).toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
            const span = items.nth(i).locator('span').first();
            if ((await span.count()) === 0) continue;
            if (normalize(await span.innerText()) === wanted) {
                target = items.nth(i);
                return;
            }
        }
        // Not there yet: close the list so the next attempt reopens it with fresh options
        await root.press('Escape').catch(() => undefined);
        throw new Error(`Option "${optionText}" not found in dropdown ${root}`);
    }).toPass({ timeout });

    await target!.click();
}

/**
 * The custom dropdowns wrap a hidden native <select>. Test data sometimes holds an
 * option's value (e.g. "l") instead of its label ("Litre"). Returns the label to look
 * for: the text itself when an option is labelled with it, else the label of the
 * option whose value equals it, else null (not offered yet).
 */
async function labelForValue(root: Locator, optionText: string): Promise<string | null> {
    const options = await root.locator('select option').evaluateAll(els =>
        els.map(el => ({ value: (el as HTMLOptionElement).value, label: (el.textContent ?? '').trim() })));
    const wanted = normalize(optionText);
    if (options.some(o => normalize(o.label) === wanted)) return optionText;
    return options.find(o => o.value === optionText)?.label ?? null;
}

/**
 * Tick a checkbox if it is not already ticked (Java checkboxImpl.select()).
 * Clicks the element rather than calling check(), as the Java code did.
 */
export async function selectCheckbox(checkbox: Locator): Promise<void> {
    if (!(await checkbox.isChecked())) {
        await checkbox.click();
    }
}

/**
 * Fetch the PDF shown in an <embed> on the page.
 * Replaces the Java approach (open the PDF in a new tab, press Ctrl+S through
 * java.awt.Robot): the file is requested with the browser context's cookies, so it
 * works headless and on CI.
 */
export async function downloadEmbeddedPdf(page: Page, embed: Locator, timeout = 30000): Promise<Buffer> {
    await embed.waitFor({ state: 'attached', timeout });
    const src = await embed.getAttribute('src');
    if (!src) throw new Error('The PDF <embed> has no src attribute');

    const url = new URL(src, page.url()).toString();
    const response = await page.context().request.get(url, { timeout });
    if (!response.ok()) {
        throw new Error(`Downloading the PDF from ${url} failed: HTTP ${response.status()}`);
    }
    return Buffer.from(await response.body());
}

/**
 * Click a sidebar link by href. Links sit in collapsible sections
 * (`li.nav-dropdown > h6` + `ul.nav-dropdown-items`). On the dealer portal the
 * header expands the section; the admin sidebar is minimized and shows the section as
 * a fly-out while hovered. Hovering, then clicking the header if still needed, covers both.
 * Some hrefs appear in two sections; the first is used.
 */
export async function clickSidebarLink(page: Page, href: string): Promise<void> {
    const nav = page.locator('nav').first();
    const link = nav.locator(`a[href="${href}"]`).first();
    const section = nav.locator('li.nav-dropdown')
        .filter({ has: page.locator(`a[href="${href}"]`) })
        .first();
    const isTopLevel = (await section.count()) === 0;

    // Retry the whole open-and-click: the admin sidebar collapses into minimized mode
    // shortly after the page loads, which can hide a link that was visible a moment before
    await expect(async () => {
        if (!isTopLevel && !(await link.isVisible())) {
            await section.hover();
            if (!(await link.isVisible())) {
                await section.locator('xpath=./h6').click();
            }
        }
        await link.click({ timeout: 3000 });
    }).toPass({ timeout: 20000 });
}
