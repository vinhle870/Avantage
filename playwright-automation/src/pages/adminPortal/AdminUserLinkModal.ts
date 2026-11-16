import { Locator, Page } from '@playwright/test';

/** Locale-free fingerprint of a form shown in the modal (AP-2441 parity checks). */
export type FormSignature = {
    name: string;
    action: string;
    /** "field name=value" for every visible field; passwords are never read. */
    fields: string[];
};

export type RoleCheckbox = { value: string; label: string; checked: boolean };

/**
 * The shared admin modal (#myModal) that every row action loads its form into (AP-2441): Auto Shield,
 * Deal your rate, Edit permissions, Unlink, Edit user and Link user. The modal has no Cancel / × control —
 * Escape closes it without submitting. Its content is fetched from the clicked link's data-href, so a
 * caller waits for the form whose action carries the expected route before reading it.
 */
export class AdminUserLinkModal {
    readonly root: Locator;
    readonly lblHeading: Locator;
    readonly frm: Locator;
    readonly btnSubmit: Locator;
    /** Edit permissions form — one checkbox per role. */
    readonly chkRoles: Locator;
    /** Link user form — email and one checkbox per permission. */
    readonly txtLinkEmail: Locator;
    readonly chkPermissions: Locator;
    /** Flash message shown on the page the form redirects to after a submit. */
    readonly lblFlash: Locator;

    constructor(private readonly page: Page) {
        this.lblFlash = page.locator('.alert');
        this.root = page.locator('#myModal');
        this.lblHeading = page.locator('#myModal.show h1');
        this.frm = page.locator('#myModal.show form');
        this.btnSubmit = page.locator('#myModal.show form button[type="submit"]');
        this.chkRoles = page.locator('#myModal.show input[type="checkbox"][name="form[roles][]"]');
        this.txtLinkEmail = page.locator('#myModal.show #form_email');
        this.chkPermissions = page.locator('#myModal.show input[type="checkbox"][name="form[permissions][]"]');
    }

    /** The loaded form whose action contains this route (e.g. /admin/edit-permission/261). */
    formFor(route: string): Locator {
        return this.page.locator(`#myModal.show form[action*="${route}"]`);
    }

    async readFormSignature(): Promise<FormSignature> {
        return this.frm.first().evaluate(f => ({
            name: f.getAttribute('name') || '',
            action: new URL(f.getAttribute('action') || '', location.href).pathname,
            fields: Array.from(f.querySelectorAll('input, select, textarea'))
                .map(e => e as HTMLInputElement)
                .filter(e => e.type !== 'hidden')
                .map(e => `${e.name}=${e.type === 'password' ? '(password, not read)'
                    : e.type === 'checkbox' || e.type === 'radio' ? String(e.checked) : e.value}`),
        }));
    }

    async readCheckboxes(boxes: Locator): Promise<RoleCheckbox[]> {
        return boxes.evaluateAll(els => els.map(e => {
            const i = e as HTMLInputElement;
            const label = i.id ? document.querySelector(`label[for="${i.id}"]`)?.textContent : '';
            return { value: i.value, label: (label || '').trim(), checked: i.checked };
        }));
    }

    checkboxByValue(boxes: Locator, value: string): Locator {
        return boxes.and(this.page.locator(`[value="${value}"]`));
    }

    /** Ticks exactly the boxes whose label is in `labels`; unticks every other one. */
    async setCheckedLabels(boxes: Locator, labels: string[]): Promise<void> {
        const wanted = new Set(labels);
        const all = await this.readCheckboxes(boxes);
        for (let i = 0; i < all.length; i++) {
            await boxes.nth(i).setChecked(wanted.has(all[i].label));
        }
    }

    async close(): Promise<void> {
        await this.page.keyboard.press('Escape');
    }

    async fillLinkEmail(email: string): Promise<void> {
        await this.txtLinkEmail.fill(email);
    }
}
