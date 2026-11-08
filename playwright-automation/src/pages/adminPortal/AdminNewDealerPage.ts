import { Page, Locator } from '@playwright/test';
import { Dealer } from '../../data/admin-portal';
import { selectDropdownOption } from '../../core/utils/uiActions';

/**
 * Admin New Dealer Page - Create/Edit dealer form.
 * Converted from Admin_NewDealersPage.java + Admin_NewDealerPageFunc.java
 */
export class AdminNewDealerPage {
    private page: Page;

    // Locators
    readonly txtEmail: Locator;
    readonly txtName: Locator;
    readonly txtPhone: Locator;
    readonly txtFax: Locator;
    readonly txtCompanyName: Locator;
    readonly txtAddress: Locator;
    readonly txtCity: Locator;
    readonly dpdProvince: Locator;
    readonly txtPostalCode: Locator;
    readonly txtInternalId: Locator;
    readonly txtContactTitle: Locator;
    readonly txtLicenseNo: Locator;
    readonly txtRegistrationGST: Locator;
    readonly txtRegistrationPST: Locator;
    readonly dpdGroup: Locator;
    readonly txtNotes: Locator;
    readonly dpdHumaniaCommissionRate: Locator;
    readonly btnSave: Locator;
    readonly lblDealerSaved: Locator;

    constructor(page: Page) {
        this.page = page;
        this.txtEmail = page.locator('#dealer_email');
        this.txtName = page.locator('#dealer_name');
        this.txtPhone = page.locator('#dealer_phone');
        this.txtFax = page.locator('#dealer_fax');
        this.txtCompanyName = page.locator('#dealer_companyName');
        this.txtAddress = page.locator('#dealer_address');
        this.txtCity = page.locator('#dealer_city');
        this.dpdProvince = page.locator('#dealer_province');
        this.txtPostalCode = page.locator('#dealer_postalCode');
        this.txtInternalId = page.locator('#dealer_internalId');
        this.txtContactTitle = page.locator('#dealer_contactTitle');
        this.txtLicenseNo = page.locator('#dealer_licenseNo');
        this.txtRegistrationGST = page.locator('#dealer_registrationTps');
        this.txtRegistrationPST = page.locator('#dealer_registrationTvq');
        this.dpdGroup = page.locator('#dealer_dealerGroup');
        this.txtNotes = page.locator('#dealer_notes');
        this.dpdHumaniaCommissionRate = page.locator('#dealer_humaniaCommissionRate');
        this.btnSave = page.locator('[type="submit"]').first();
        this.lblDealerSaved = page.locator("//div[@role='alert' and contains(text(), 'Dealer saved')]");
    }

    /**
     * Fill the new dealer form. Every field is written, empty values clear the field.
     */
    async fillNewDealerForm(dealer: Dealer, submit: boolean = true): Promise<void> {
        await this.txtEmail.fill(dealer.email);
        await this.txtName.fill(dealer.name);
        await this.txtPhone.fill(dealer.phone);
        await this.txtFax.fill(dealer.fax);
        await this.txtCompanyName.fill(dealer.companyName);
        await this.txtAddress.fill(dealer.address);
        await this.txtCity.fill(dealer.city);
        await selectDropdownOption(this.dpdProvince, dealer.province);
        await this.txtPostalCode.fill(dealer.postalCode);
        await this.txtInternalId.fill(dealer.internalId);
        await this.txtContactTitle.fill(dealer.contactTitle);
        await this.txtLicenseNo.fill(dealer.licenseNo);
        await this.txtRegistrationGST.fill(dealer.registrationGST);
        await this.txtRegistrationPST.fill(dealer.registrationPST);
        await selectDropdownOption(this.dpdGroup, dealer.group);
        await this.txtNotes.fill(dealer.notes);
        // The Humania commission rate field was removed from the current form
        if ((await this.dpdHumaniaCommissionRate.count()) > 0) {
            await selectDropdownOption(this.dpdHumaniaCommissionRate, dealer.humaniaCommissionRate);
        }

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
