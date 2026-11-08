import { Page } from '@playwright/test';
import { clickSidebarLink } from '../../core/utils/uiActions';

/**
 * Dealer Left Menu Panel - Navigation menu for Dealer Portal.
 * Converted from Dealer_LeftMenuPanel.java + Dealer_LeftMenuPanelFunc.java.
 * Quotes and Inventory sit in the collapsible "Vehicles" section of the sidebar.
 */
export class DealerLeftMenu {
    private page: Page;

    static readonly QUOTES = '/quotes';
    static readonly INVENTORY = '/vehicle/inventory';
    static readonly LOGOUT = '/logout';

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to Quotes page
     */
    async goToQuotesPage(): Promise<void> {
        await clickSidebarLink(this.page, DealerLeftMenu.QUOTES);
    }

    /**
     * Navigate to Inventory page
     */
    async goToInventoryPage(): Promise<void> {
        await clickSidebarLink(this.page, DealerLeftMenu.INVENTORY);
    }

    /**
     * Logout from dealer portal
     */
    async logout(): Promise<void> {
        await clickSidebarLink(this.page, DealerLeftMenu.LOGOUT);
    }
}
