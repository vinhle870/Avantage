import { Locator, Page } from '@playwright/test';

/** Values typed on step 1 "Enter the vehicle" of the buy-online flow. */
export interface BuyOnlineVehicle {
    vin: string;
    mileage: string;
    email: string;
    postalCode: string;
    marketValue: string;
    warrantyNumber?: string;
    warrantyEndDate?: string;   // YYYY-MM-DD
    warrantyMileageLimit?: string;
}

/** Values typed on step 2 "Client Info". */
export interface BuyOnlineClient {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    provinceValue: string;      // option value: 1 = Québec, 2 = Ontario, 7 = Nova Scotia, 8 = New Brunswick
    postalCode: string;
    phone1: string;
    email: string;
}

/**
 * Customer portal — buy a warranty online, no login
 * (/customer/avantage-plus/buy → /client → /coverage → /coverage-2 → /summary).
 * Added for AP-2377. Locators verified on Dev (v2dev) 2026-11-02, each with a match count of 1.
 * Map: qa-artifacts/qa-docs/customer-portal-buy-online.md.
 * The summary's "I accept the terms and conditions" box and "Continue with payment" button have no
 * locator here on purpose: no spec may enter payment data or press a pay/checkout button.
 */
export class BuyOnlinePage {
    private readonly page: Page;

    // Every step
    readonly lblPageTitle: Locator;
    readonly lnkFrancais: Locator;
    readonly stepBarItems: Locator;
    readonly btnSubmit: Locator;
    readonly lnkBack: Locator;

    // Step 1 — Enter the vehicle
    readonly frmVehicle: Locator;
    readonly txtVin: Locator;
    readonly txtMileage: Locator;
    readonly txtEmail: Locator;
    readonly txtPostalCode: Locator;
    readonly txtMarketValue: Locator;
    readonly lblWarrantySectionHeading: Locator;
    readonly lblWarrantySectionHelp: Locator;
    readonly txtWarrantyNumber: Locator;
    readonly txtWarrantyEndDate: Locator;
    readonly txtWarrantyMileageLimit: Locator;
    readonly vehicleInputs: Locator;

    // Step 2 — Client Info
    readonly frmClient: Locator;
    readonly txtFirstName: Locator;
    readonly txtLastName: Locator;
    readonly txtAddress1: Locator;
    readonly txtCity: Locator;
    readonly ddlProvince: Locator;
    readonly txtClientPostalCode: Locator;
    readonly txtPhone1: Locator;
    readonly txtClientEmail: Locator;
    readonly chkAgreePolicy: Locator;
    readonly lblAgreePolicy: Locator;
    readonly lnkFormL25: Locator;
    readonly lblAgreePolicyError: Locator;
    readonly clientCheckboxes: Locator;

    // Step 3a / 3b — Coverage
    readonly lblStepHeading: Locator;
    readonly ddlProgramTerm: Locator;

    // Step 4 — Summary
    readonly lblSummaryProgram: Locator;
    readonly blkSummarySurcharge: Locator;
    readonly lblSummaryTotal: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lblPageTitle = page.locator('h1');
        this.lnkFrancais = page.getByRole('link', { name: 'Français', exact: true });
        this.stepBarItems = page.locator('div.row.text-center > div.col');
        this.btnSubmit = page.locator('form button[type="submit"]');
        this.lnkBack = page.locator('form a', { hasText: /^\s*(Back|Retour)\s*$/ });

        this.frmVehicle = page.locator('form[name="customer_buy_vehicle"]');
        this.txtVin = page.locator('#customer_buy_vehicle_vin');
        this.txtMileage = page.locator('#customer_buy_vehicle_mileage');
        this.txtEmail = page.locator('#customer_buy_vehicle_email');
        this.txtPostalCode = page.locator('#customer_buy_vehicle_postal_code');
        this.txtMarketValue = page.locator('#customer_buy_vehicle_marketValue');
        this.lblWarrantySectionHeading = page.locator('form[name="customer_buy_vehicle"] h4');
        this.lblWarrantySectionHelp = page.locator('form[name="customer_buy_vehicle"] h4 + p');
        this.txtWarrantyNumber = page.locator('#customer_buy_vehicle_warrantyNumber');
        this.txtWarrantyEndDate = page.locator('#customer_buy_vehicle_manufacturerWarrantyEndDate');
        this.txtWarrantyMileageLimit = page.locator('#customer_buy_vehicle_manufacturerWarrantyEndKm');
        this.vehicleInputs = page.locator('form[name="customer_buy_vehicle"] input:not([type="hidden"])');

        this.frmClient = page.locator('form[name="customer_quote_client"]');
        this.txtFirstName = page.locator('#customer_quote_client_firstName');
        this.txtLastName = page.locator('#customer_quote_client_lastName');
        this.txtAddress1 = page.locator('#customer_quote_client_address1');
        this.txtCity = page.locator('#customer_quote_client_city');
        this.ddlProvince = page.locator('#customer_quote_client_province');
        this.txtClientPostalCode = page.locator('#customer_quote_client_postalCode');
        this.txtPhone1 = page.locator('#customer_quote_client_phone1');
        this.txtClientEmail = page.locator('#customer_quote_client_email');
        this.chkAgreePolicy = page.locator('#customer_quote_client_isAgreePolicy');
        this.lblAgreePolicy = page.locator('label[for="customer_quote_client_isAgreePolicy"]');
        this.lnkFormL25 = page.locator('label[for="customer_quote_client_isAgreePolicy"] a');
        this.lblAgreePolicyError = page.locator('label[for="customer_quote_client_isAgreePolicy"] .form-error-message');
        this.clientCheckboxes = page.locator('form[name="customer_quote_client"] input[type="checkbox"]');

        this.lblStepHeading = page.locator('h3').first();
        this.ddlProgramTerm = page.locator('#customer_buy_coverage_programTerm');

        this.lblSummaryProgram = page.locator("xpath=//dl[dt[normalize-space()='Program' or normalize-space()='Programme']]/dd");
        this.blkSummarySurcharge = page.locator("xpath=//dl[dt[normalize-space()='Surcharge']]");
        this.lblSummaryTotal = page.locator("xpath=//tr[td[normalize-space()='Total' or strong[normalize-space()='Total']]]/td[last()]");
    }

    /** Surcharge radio on step 3b, e.g. id 50 = air suspension. Yes = value 1, No = value 0 (No preselected). */
    rdoSurcharge(surchargeId: string, answer: 'yes' | 'no'): Locator {
        return this.page.locator(`#surcharge_${surchargeId}_${answer}`);
    }

    async open(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /** Clicking the link switches the session language; opening ?_locale=fr directly does not. */
    async switchToFrench(): Promise<void> {
        await this.lnkFrancais.click();
    }

    async submit(): Promise<void> {
        await this.btnSubmit.click();
    }

    async enterVehicle(v: BuyOnlineVehicle): Promise<void> {
        await this.txtVin.fill(v.vin);
        await this.txtMileage.fill(v.mileage);
        await this.txtEmail.fill(v.email);
        await this.txtPostalCode.fill(v.postalCode);
        await this.txtMarketValue.fill(v.marketValue);
        if (v.warrantyNumber !== undefined) await this.txtWarrantyNumber.fill(v.warrantyNumber);
        if (v.warrantyEndDate !== undefined) {
            await this.txtWarrantyEndDate.fill(v.warrantyEndDate);
            await this.txtWarrantyEndDate.press('Escape');   // close the date picker so it covers nothing
        }
        if (v.warrantyMileageLimit !== undefined) await this.txtWarrantyMileageLimit.fill(v.warrantyMileageLimit);
    }

    /** Fills Client Info. The province select sits under a bootstrap-select widget — selectOption works on it. */
    async enterClient(c: BuyOnlineClient): Promise<void> {
        await this.txtFirstName.fill(c.firstName);
        await this.txtLastName.fill(c.lastName);
        await this.txtAddress1.fill(c.address1);
        await this.txtCity.fill(c.city);
        await this.ddlProvince.selectOption(c.provinceValue);
        await this.txtClientPostalCode.fill(c.postalCode);
        await this.txtPhone1.fill(c.phone1);
        await this.txtClientEmail.fill(c.email);
    }

    async tickAgreePolicy(): Promise<void> {
        await this.chkAgreePolicy.check();
    }

    async selectProgramTerm(termId: string): Promise<void> {
        await this.ddlProgramTerm.selectOption(termId);
    }

    async answerSurcharge(surchargeId: string, answer: 'yes' | 'no'): Promise<void> {
        await this.rdoSurcharge(surchargeId, answer).check();
    }
}
