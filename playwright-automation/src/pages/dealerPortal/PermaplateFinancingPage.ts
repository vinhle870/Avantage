import { Page, Locator } from '@playwright/test';

/**
 * Dealer Permaplate ("Esthetic protection") pages AP-2459 needs beyond PermaplateContractPage:
 * the Permaplate Quote step (/quote/{id}/permaplate), the "Financing company" field of the contract form
 * (/quote/{id}/permaplate-create-contract, "Product Summary" column), the flash alerts, the contract number
 * on the quote hub, the dealer contract list row and the dealer invoice list row.
 * Locators verified on v2dev, 2026-11-08 (AP-2459 s8): each counts 1 on quotes 6689 (selection, no contract)
 * and 6690 (contract PNA-0000000021), /permaplate-contracts and /invoice (invoice 945).
 * No assertions here — see PermaplateFinancingFlow.
 */
export class PermaplateFinancingPage {
    private page: Page;

    // Permaplate Quote step
    readonly frmPermaplateQuote: Locator;
    readonly btnPermaplateQuoteSave: Locator;

    // Contract form — Product Summary
    readonly lblFinancingCompany: Locator;
    readonly selFinancingCompany: Locator;
    readonly lblFinancingCompanyError: Locator;
    readonly lblAllFieldErrors: Locator;

    // Shared
    readonly lblAlerts: Locator;
    readonly lblServerErrorPage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.frmPermaplateQuote = page.locator('#permaplateQuoteForm');
        this.btnPermaplateQuoteSave = page.locator('#permaplateQuoteForm button[type="submit"]');

        this.lblFinancingCompany = page.locator('xpath=//dt[normalize-space()="Financing company"]');
        this.selFinancingCompany = page.locator('#permaplate_contract_financingInformation_financingCompany');
        this.lblFinancingCompanyError = page.locator('dd:has(#permaplate_contract_financingInformation_financingCompany) .form-error-message');
        this.lblAllFieldErrors = page.locator('form[name="permaplate_contract"] .form-error-message');

        this.lblAlerts = page.locator('.alert');
        this.lblServerErrorPage = page.locator('body', { hasText: /difficultés techniques|HTTP 500/ });
    }

    async open(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /** Label of a term radio on the Permaplate Quote step, e.g. "10 ans" (the radio itself is a hidden custom control). */
    lblTerm(term: string): Locator {
        return this.frmPermaplateQuote.locator('.custom-radio label').filter({ hasText: term });
    }

    /** Label of an option checkbox on the Permaplate Quote step, e.g. "Antirouille – Rust+Sound (combo)". */
    lblOption(option: string): Locator {
        return this.frmPermaplateQuote.locator('.custom-checkbox label').filter({ hasText: option });
    }

    alertWithText(text: string): Locator {
        return this.lblAlerts.filter({ hasText: text });
    }

    /** Contract number link of the Esthetic protection row once the contract exists, e.g. "PNA-0000000021". */
    lnkContractNumber(quoteId: string): Locator {
        return this.page.locator(`a[href="/quote/${quoteId}/permaplate-contract"]`);
    }

    /** Row of /permaplate-contracts whose Download link belongs to the quote. */
    contractListRow(quoteId: string): Locator {
        return this.page.locator(`tbody tr:has(a[href="/quote/${quoteId}/permaplate-contract-download"])`);
    }

    /** Row of /invoice for one invoice number. */
    invoiceListRow(invoiceId: string): Locator {
        return this.page.locator(`tr[data-href="/invoice/${invoiceId}"]`);
    }

    async selectTermAndOption(term: string, option: string): Promise<void> {
        await this.lblTerm(term).click();
        await this.lblOption(option).click();
    }

    async savePermaplateQuote(): Promise<void> {
        await this.btnPermaplateQuoteSave.click();
    }

    /** The select is wrapped by bootstrap-select; the hidden native <select> is set by value and its change event fired. */
    async chooseFinancingCompany(companyId: string): Promise<void> {
        await this.selFinancingCompany.selectOption(companyId, { force: true });
    }

    async readSelectedFinancingCompany(): Promise<string> {
        return this.selFinancingCompany.evaluate(el => (el as HTMLSelectElement).selectedOptions[0]?.text.trim() ?? '');
    }

    async readContractNumber(quoteId: string): Promise<string> {
        return ((await this.lnkContractNumber(quoteId).innerText()) || '').trim();
    }
}
