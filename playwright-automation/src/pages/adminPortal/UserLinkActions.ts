import { Locator } from '@playwright/test';

/**
 * The row action buttons of a user-to-dealer link (AP-2441). The same icon buttons appear on
 * Dealer Details > Users (/admin/dealer/{id}/users, one row per user) and on the Dealer User Details page
 * (/admin/dealer-users/{id}, one row per dealer). Each is an <a data-href> inside a tooltip <span>.
 * Locale-free: actions are told apart by the route their data-href opens, never by the tooltip text.
 */
export type LinkAction = 'autoShield' | 'dealYourRate' | 'editPermissions' | 'unlink';

/** Route prefix each action opens; the link id follows it (e.g. /admin/edit-permission/261). */
export const LINK_ACTION_PATH: Record<LinkAction, string> = {
    autoShield: '/admin/auto-shield/',
    dealYourRate: '/admin/rate-user/',
    editPermissions: '/admin/edit-permission/',
    unlink: '/admin/unlink-permission/',
};

export const LINK_ACTIONS = Object.keys(LINK_ACTION_PATH) as LinkAction[];

/** One action button as read from the DOM. */
export type RowButton = { path: string; tooltip: string; icon: string };

export class UserLinkActions {
    /** Every action button of the row, left to right. */
    static buttons(row: Locator): Locator {
        return row.locator('.table-column-group-action a[data-href]');
    }

    static action(row: Locator, action: LinkAction): Locator {
        return row.locator(`.table-column-group-action a[data-href^="${LINK_ACTION_PATH[action]}"]`);
    }

    /** "Edit user" row button: opens /admin/dealer-user/{userId}/edit. */
    static editUser(row: Locator): Locator {
        return row.locator('.table-column-group-action a[data-href^="/admin/dealer-user/"][data-href*="/edit"]');
    }

    /** Pencil icon anywhere in the row's action group. */
    static pencilIcon(row: Locator): Locator {
        return row.locator('.table-column-group-action .fa-pen');
    }

    static badges(row: Locator): Locator {
        return row.locator('.badge');
    }

    /** Route (query dropped), tooltip and icon class of each button, left to right. */
    static async readButtons(row: Locator): Promise<RowButton[]> {
        return UserLinkActions.buttons(row).evaluateAll(links => links.map(a => {
            const wrap = a.parentElement;
            const tooltip = wrap?.getAttribute('data-original-title') || wrap?.getAttribute('title')
                || a.getAttribute('data-original-title') || a.getAttribute('title') || '';
            const iconEl = a.querySelector('[class*="fa-"]');
            const icon = iconEl ? Array.from(iconEl.classList).filter(c => /^fa-/.test(c)).join(' ') : '';
            return { path: (a.getAttribute('data-href') || '').split('?')[0], tooltip: tooltip.trim(), icon };
        }));
    }

    static async readBadges(row: Locator): Promise<string[]> {
        return (await UserLinkActions.badges(row).allInnerTexts()).map(t => t.trim()).filter(Boolean);
    }
}
