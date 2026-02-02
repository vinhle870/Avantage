import { Page, Locator, expect } from '@playwright/test';
import { TableComponent } from '../../core/components/TableComponent';

/**
 * Admin Dealers Page - Manage dealers in admin portal.
 * Converted from Admin_DealersPage.java + Admin_DealerPageFunc.java
 */
export class AdminDealersPage {
    private page: Page;

    // Locators
    readonly lnkAddNewDealer: Locator;
    readonly tblDealers: TableComponent;
    readonly btnDeleteConfirm: Locator;
    readonly btnDeleteCancel: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lnkAddNewDealer = page.locator('[href="/admin/dealer/new/edit"]');
        this.tblDealers = new TableComponent(page, "//table[@class='table table-striped table-borderless m-0 table-hover']");
        this.btnDeleteConfirm = page.locator("//button[@type='submit' and @class='btn btn-primary']");
        this.btnDeleteCancel = page.locator('a[data-dismiss="modal"]');
    }

    /**
     * Click on Add New Dealer link to open new dealer page
     */
    async openNewDealerPage(): Promise<void> {
        await this.lnkAddNewDealer.click();
    }

    /**
     * Delete a dealer by name
     */
    async deleteDealer(dealerName: string, submit: boolean = true): Promise<void> {
        await this.tblDealers.clickOnChildInRow(dealerName, "//span[@class='fal fa-trash']");

        if (submit) {
            await this.btnDeleteConfirm.click();
        } else {
            await this.btnDeleteCancel.click();
        }
    }

    /**
     * Check if a dealer is available in the list
     */
    async isDealerAvailableOnList(dealerName: string): Promise<boolean> {
        const row = await this.tblDealers.findRow(dealerName);
        return row !== null;
    }

    /**
     * Wait for dealers table to be visible
     */
    async waitForTableVisible(): Promise<void> {
        await this.tblDealers.waitForVisible();
    }
}
