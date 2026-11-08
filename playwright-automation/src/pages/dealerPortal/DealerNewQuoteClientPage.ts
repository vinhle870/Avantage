import { Page, Locator } from '@playwright/test';
import { QuoteClient } from '../../data/dealer-portal';
import { selectCheckbox, selectDropdownOption } from '../../core/utils/uiActions';

/**
 * Quote Client Page (/quote/{id}/client) - The client of a quote.
 * Converted from Dealer_NewQuoteClientPage.java + Dealer_NewQuoteClientPageFunc.java.
 * The legacy app opened this form when creating a quote; it is now reached from the
 * quote detail page once the quote (vehicle) exists.
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
        this.btnSave = page.locator('form:has(#quote_client_email) [type="submit"]').first();
    }

    /**
     * Fill the new client form. Every field is written, empty values clear the field.
     */
    async fillNewClientForm(client: QuoteClient, submit: boolean = true): Promise<void> {
        await this.txtEmail.fill(client.email);
        await this.txtFirstName.fill(client.firstName);
        await this.txtLastName.fill(client.lastName);
        await this.txtSecondaryOwnerOrCompany.fill(client.secondaryOwnerOrCompany);
        await this.txtDistributorName.fill(client.distributorName);
        await this.txtAddress.fill(client.address);
        await this.txtAddress2.fill(client.address2);
        await this.txtCity.fill(client.city);
        await selectDropdownOption(this.dpdProvince, client.province);
        await this.txtPostalCode.fill(client.postalCode);
        await this.txtTelHome.fill(client.telHome);
        await this.txtTelWork.fill(client.telWork);
        await this.txtIndianStatusCertificate.fill(client.indianStatusCertificate);
        await this.txtDriversLicense.fill(client.driversLicense);
        await selectCheckbox(this.chkAgreePolicy);

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
