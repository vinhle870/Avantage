import { Page } from '@playwright/test';
import { clickSidebarLink } from '../../core/utils/uiActions';

/**
 * Admin Left Menu Panel - Navigation menu for Admin Portal.
 * Converted from Admin_LeftMenuPanel.java + Admin_LeftMenuPanelFunc.java.
 * Links sit in collapsible sidebar sections (Users, Warranty Configuration, Parameters, ...).
 */
export class AdminLeftMenu {
    private page: Page;

    static readonly DEALERS = '/admin/dealers';
    static readonly PROGRAMS = '/admin/programs';
    static readonly PROGRAM_COMPONENTS = '/admin/list-program-components';
    static readonly WARRANTY_CONDITIONS = '/admin/warranty-conditions';
    static readonly CUSTOM_PRICE_RULES = '/admin/price-rule';
    static readonly LOGOUT = '/admin/logout';

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to Users > Dealers page
     */
    async goToUsersPage(): Promise<void> {
        await clickSidebarLink(this.page, AdminLeftMenu.DEALERS);
    }

    /**
     * Navigate to Programs page
     */
    async goToProgramsPage(): Promise<void> {
        await clickSidebarLink(this.page, AdminLeftMenu.PROGRAMS);
    }

    /**
     * Navigate to Program Components page
     */
    async goToProgramComponentsPage(): Promise<void> {
        await clickSidebarLink(this.page, AdminLeftMenu.PROGRAM_COMPONENTS);
    }

    /**
     * Navigate to Warranty Conditions page
     */
    async goToWarrantyConditionsPage(): Promise<void> {
        await clickSidebarLink(this.page, AdminLeftMenu.WARRANTY_CONDITIONS);
    }

    /**
     * Navigate to Custom Price Rules page
     */
    async goToPriceRulesPage(): Promise<void> {
        await clickSidebarLink(this.page, AdminLeftMenu.CUSTOM_PRICE_RULES);
    }

    /**
     * Logout from admin portal
     */
    async logout(): Promise<void> {
        await clickSidebarLink(this.page, AdminLeftMenu.LOGOUT);
    }
}
