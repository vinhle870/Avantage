import { Page, Locator } from '@playwright/test';
import { InvoiceOnPage } from '../../data/dealer-portal';

/**
 * Invoice Detail Page - Invoice shown after the sale is finalized.
 * Converted from InvoiceDetail_Page.java + InvoiceDetailPage_Func.java.
 * The page has no ids or test attributes, so these are the legacy absolute XPaths.
 */
const INVOICE = 'xpath=/html/body/div[1]/main/div/div/div[3]/div';

export class InvoiceDetailPage {
    private page: Page;

    // Locators
    readonly lblDealerName: Locator;
    readonly lblDealerAddress: Locator;
    readonly lblDealerLocation: Locator;
    readonly lblDealerEmail: Locator;
    readonly lblDealerPhone: Locator;
    readonly lblInvoiceDescription: Locator;
    readonly lblInvoiceTotal: Locator;
    readonly lblInvoiceGrandTotal: Locator;
    readonly lblAVAddress: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lblDealerName = page.locator(`${INVOICE}/div[2]/div[2]/div[1]/strong`);
        this.lblDealerAddress = page.locator(`${INVOICE}/div[2]/div[2]/div[2]`);
        this.lblDealerLocation = page.locator(`${INVOICE}/div[2]/div[2]/div[3]`);
        this.lblDealerEmail = page.locator(`${INVOICE}/div[2]/div[2]/div[4]`);
        this.lblDealerPhone = page.locator(`${INVOICE}/div[2]/div[2]/div[5]`);
        this.lblInvoiceDescription = page.locator(`${INVOICE}/div[3]/table/tbody/tr/td[1]`).first();
        this.lblInvoiceTotal = page.locator(`${INVOICE}/div[3]/table/tbody/tr/td[2]`).first();
        // The grand total is on the 2nd row of the totals table, or the 3rd when a second tax line is shown
        this.lblInvoiceGrandTotal = page.locator(
            `${INVOICE}/div[4]/div[2]/table/tbody/tr[2]/td[2]/strong | ` +
            `/html/body/div[1]/main/div/div/div[3]/div/div[4]/div[2]/table/tbody/tr[3]/td[2]/strong`).first();
        this.lblAVAddress = page.locator(`${INVOICE}/div[4]/div[1]/p[2]`);
    }

    /**
     * Read the invoice values shown on the page
     */
    async readInvoice(): Promise<InvoiceOnPage> {
        await this.lblDealerName.waitFor({ state: 'visible' });
        const text = async (l: Locator) => (await l.innerText()).trim();
        return {
            dealerName: await text(this.lblDealerName),
            dealerAddress: await text(this.lblDealerAddress),
            dealerLocation: await text(this.lblDealerLocation),
            dealerEmail: await text(this.lblDealerEmail),
            dealerPhone: await text(this.lblDealerPhone),
            invoiceDescription: await text(this.lblInvoiceDescription),
            invoiceTotal: await text(this.lblInvoiceTotal),
            invoiceGrandTotal: await text(this.lblInvoiceGrandTotal),
            avAddress: await text(this.lblAVAddress),
        };
    }
}
