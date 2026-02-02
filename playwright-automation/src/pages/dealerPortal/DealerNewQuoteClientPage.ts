import { Page, Locator, expect } from '@playwright/test';

/**
 * Quote Client data interface
 */
export interface QuoteClientData {
    email: string;
    firstName: string;
    lastName: string;
    secondaryOwnerOrCompany?: string;
    distributorName?: string;
    address?: string;
    address2?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    telHome?: string;
    telWork?: string;
    indianStatusCertificate?: string;
    driversLicense?: string;
}

/**
 * Dealer New Quote Client Page - Create new quote with client info.
 * Converted from Dealer_NewQuoteClientPage.java + Dealer_NewQuoteClientPageFunc.java
 */
export class DealerNewQuoteClientPage {
    private page: Page;

    // Locators
    readonly txtEmail: Locator;
    readonly txtFirstName: Locator;
    readonly txtLastName: Locator;
    readonly txtSecondaryOwnerOrCompany: Locator;
    readonly txtDistributorName: Locator;
    readonly txtAddress: Locator;
    readonly txtAddress2: Locator;
    readonly txtCity: Locator;
    readonly dpdProvince: Locator;
    readonly txtPostalCode: Locator;
    readonly txtTelHome: Locator;
    readonly txtTelWork: Locator;
    readonly txtIndianStatusCertificate: Locator;
    readonly txtDriversLicense: Locator;
    readonly chkAgreePolicy: Locator;
    readonly btnSave: Locator;

    constructor(page: Page) {
        this.page = page;
        this.txtEmail = page.locator('#quote_client_email');
        this.txtFirstName = page.locator('#quote_client_firstName');
        this.txtLastName = page.locator('#quote_client_lastName');
        this.txtSecondaryOwnerOrCompany = page.locator('#quote_client_company');
        this.txtDistributorName = page.locator('#quote_client_distributorName');
        this.txtAddress = page.locator('#quote_client_address');
        this.txtAddress2 = page.locator('#quote_client_address2');
        this.txtCity = page.locator('#quote_client_city');
        this.dpdProvince = page.locator("//div[*[@for='quote_client_province']]/div");
        this.txtPostalCode = page.locator('#quote_client_postalCode');
        this.txtTelHome = page.locator('#quote_client_telHome');
        this.txtTelWork = page.locator('#quote_client_telWork');
        this.txtIndianStatusCertificate = page.locator('#quote_client_indianStatusCertificate');
        this.txtDriversLicense = page.locator('#quote_client_driversLicense');
        this.chkAgreePolicy = page.locator('#quote_client_isAgreePolicy');
        this.btnSave = page.locator('[type="submit"]');
    }

    /**
     * Fill new client form with provided data
     */
    async fillNewClientForm(client: QuoteClientData, submit: boolean = true): Promise<void> {
        await this.txtEmail.fill(client.email);
        await this.txtFirstName.fill(client.firstName);
        await this.txtLastName.fill(client.lastName);

        if (client.secondaryOwnerOrCompany) await this.txtSecondaryOwnerOrCompany.fill(client.secondaryOwnerOrCompany);
        if (client.distributorName) await this.txtDistributorName.fill(client.distributorName);
        if (client.address) await this.txtAddress.fill(client.address);
        if (client.address2) await this.txtAddress2.fill(client.address2);
        if (client.city) await this.txtCity.fill(client.city);
        if (client.province) {
            await this.dpdProvince.click();
            await this.page.locator(`li:has-text("${client.province}")`).click();
        }
        if (client.postalCode) await this.txtPostalCode.fill(client.postalCode);
        if (client.telHome) await this.txtTelHome.fill(client.telHome);
        if (client.telWork) await this.txtTelWork.fill(client.telWork);
        if (client.indianStatusCertificate) await this.txtIndianStatusCertificate.fill(client.indianStatusCertificate);
        if (client.driversLicense) await this.txtDriversLicense.fill(client.driversLicense);

        // Always check agree policy
        await this.chkAgreePolicy.check();

        if (submit) {
            await this.btnSave.click();
        }
    }

    /**
     * Click save button
     */
    async save(): Promise<void> {
        await this.btnSave.click();
    }
}
