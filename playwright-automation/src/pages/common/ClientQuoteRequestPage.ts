import { Locator, Page } from '@playwright/test';

/** Values typed on the five-step Client portal quote request (no login, per-customer link). */
export interface ClientQuoteVehicle {
    vehicleId: string;      // option value of "I'd like a warranty for a*", e.g. 80 = 2022 TESLA Model 3 Long Range
    vin: string;
    mileage: string;
    marketValue: string;
}

export interface ClientQuoteOwnership {
    dateOwner: string;      // YYYY-MM-DD
}

export interface ClientQuoteClient {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    provinceValue: string;  // option value, e.g. 1 = Québec
    postalCode: string;
    phone1: string;
    email: string;
}

/**
 * Client portal — quote request (/customer/{id}/quote-request → /ownership → /program → /client → /payment).
 * Added for AP-1948. Locators verified on Dev (v2dev) 2026-11-01, each with a match count of 1.
 * Map: qa-artifacts/qa-docs/client-portal-quote-request.md. Never submits the Summary page:
 * "Continue with payment" opens a Stripe checkout and has no locator here on purpose.
 */
export class ClientQuoteRequestPage {
    private readonly page: Page;

    // Every step: the single submit button "Continue"
    readonly btnContinue: Locator;

    // Step 1 — Enter the vehicle
    readonly ddlVehicle: Locator;
    readonly txtVin: Locator;
    readonly txtMileage: Locator;
    readonly txtMarketValue: Locator;

    // Step 2 — Enter the ownership info
    readonly txtDateOwner: Locator;
    readonly rdoHowPurchaseFranchised: Locator;
    readonly rdoInspectedYes: Locator;

    // Step 4 — Client Info
    readonly txtFirstName: Locator;
    readonly txtLastName: Locator;
    readonly txtAddress1: Locator;
    readonly txtCity: Locator;
    readonly ddlProvince: Locator;
    readonly txtPostalCode: Locator;
    readonly txtPhone1: Locator;
    readonly txtEmail: Locator;
    readonly chkAgreePolicy: Locator;

    // Step 5 — Summary
    readonly lblModel: Locator;
    readonly lblProgram: Locator;
    readonly lblWarrantyTerm: Locator;
    readonly lblSubtotal: Locator;

    constructor(page: Page) {
        this.page = page;
        this.btnContinue = page.locator('button[type="submit"]');

        this.ddlVehicle = page.locator('#customer_quote_vehicle_manufacturerVehicle');
        this.txtVin = page.locator('input[name="customer_quote_vehicle[vin]"]');
        this.txtMileage = page.locator('input[name="customer_quote_vehicle[mileage]"]');
        this.txtMarketValue = page.locator('input[name="customer_quote_vehicle[marketValue]"]');

        this.txtDateOwner = page.locator('#customer_quote_ownership_dateOwner');
        this.rdoHowPurchaseFranchised = page.locator('#customer_quote_ownership_howPurchase_0');
        this.rdoInspectedYes = page.locator('#customer_quote_ownership_isInspected_0');

        this.txtFirstName = page.locator('#customer_quote_client_firstName');
        this.txtLastName = page.locator('#customer_quote_client_lastName');
        this.txtAddress1 = page.locator('#customer_quote_client_address1');
        this.txtCity = page.locator('#customer_quote_client_city');
        this.ddlProvince = page.locator('#customer_quote_client_province');
        this.txtPostalCode = page.locator('#customer_quote_client_postalCode');
        this.txtPhone1 = page.locator('#customer_quote_client_phone1');
        this.txtEmail = page.locator('#customer_quote_client_email');
        this.chkAgreePolicy = page.locator('#customer_quote_client_isAgreePolicy');

        this.lblModel = page.locator("xpath=//dl[dt[normalize-space()='Model']]/dd");
        this.lblProgram = page.locator("xpath=//dl[dt[normalize-space()='Program']]/dd");
        this.lblWarrantyTerm = page.locator("xpath=//dl[dt[normalize-space()='Warranty term']]/dd");
        this.lblSubtotal = page.locator("xpath=//tr[td[strong[normalize-space()='Subtotal']]]/td[last()]");
    }

    /** Term card on "Select Coverage" — the visible card wrapping the term's radio (value = program term id). */
    termCard(termId: string): Locator {
        return this.page.locator(`label:has(> input.card-input-element[value="${termId}"]) .card`);
    }

    /** The radio inside that card. */
    termRadio(termId: string): Locator {
        return this.page.locator(`label > input.card-input-element[value="${termId}"]`);
    }

    async open(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async continue(): Promise<void> {
        await this.btnContinue.click();
    }

    async enterVehicle(v: ClientQuoteVehicle): Promise<void> {
        // The native select sits under a bootstrap-select widget (opacity 0) — selectOption works on it.
        await this.ddlVehicle.selectOption(v.vehicleId);
        await this.txtVin.fill(v.vin);
        await this.txtMileage.fill(v.mileage);
        await this.txtMarketValue.fill(v.marketValue);
    }

    /** Radios first: typing the date opens a datepicker that covers them. Original owner / report keep their default Yes. */
    async enterOwnership(o: ClientQuoteOwnership): Promise<void> {
        await this.rdoHowPurchaseFranchised.check();
        await this.rdoInspectedYes.check();
        await this.txtDateOwner.fill(o.dateOwner);
    }

    async selectTerm(termId: string): Promise<void> {
        await this.termCard(termId).click();
    }

    async enterClient(c: ClientQuoteClient): Promise<void> {
        await this.txtFirstName.fill(c.firstName);
        await this.txtLastName.fill(c.lastName);
        await this.txtAddress1.fill(c.address1);
        await this.txtCity.fill(c.city);
        await this.ddlProvince.selectOption(c.provinceValue);
        await this.txtPostalCode.fill(c.postalCode);
        await this.txtPhone1.fill(c.phone1);
        await this.txtEmail.fill(c.email);
        await this.chkAgreePolicy.check();
    }

    /** Going back to a term choice keeps every Client Info field except the policy checkbox. */
    async tickAgreePolicy(): Promise<void> {
        await this.chkAgreePolicy.check();
    }

    async subtotalText(): Promise<string> {
        return ((await this.lblSubtotal.textContent()) || '').trim();
    }
}
