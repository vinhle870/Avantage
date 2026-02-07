import { Page, Locator, expect } from "@playwright/test";
import { AdminNewDealerLocator } from "../locators/AdminNewDealerLocator";

/**
 * Dealer data interface for form filling
 */
export interface DealerData {
  email: string;
  name: string;
  phone?: string;
  fax?: string;
  companyName?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  internalId?: string;
  contactTitle?: string;
  licenseNo?: string;
  registrationGST?: string;
  registrationPST?: string;
  group?: string;
  notes?: string;
  humaniaCommissionRate?: string;
}

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
    this.txtEmail = page.locator(AdminNewDealerLocator.txtEmailLocator);
    this.txtName = page.locator(AdminNewDealerLocator.txtNameLocator);
    this.txtPhone = page.locator(AdminNewDealerLocator.txtPhoneLocator);
    this.txtFax = page.locator(AdminNewDealerLocator.txtFaxLocator);
    this.txtCompanyName = page.locator(
      AdminNewDealerLocator.txtCompanyNameLocator,
    );
    this.txtAddress = page.locator(AdminNewDealerLocator.txtAddressLocator);
    this.txtCity = page.locator(AdminNewDealerLocator.txtCityLocator);
    this.dpdProvince = page.locator(AdminNewDealerLocator.dpdProvinceLocator);
    this.txtPostalCode = page.locator(
      AdminNewDealerLocator.txtPostalCodeLocator,
    );
    this.txtInternalId = page.locator(
      AdminNewDealerLocator.txtInternalIdLocator,
    );
    this.txtContactTitle = page.locator(
      AdminNewDealerLocator.txtContactTitleLocator,
    );
    this.txtLicenseNo = page.locator(AdminNewDealerLocator.txtLicenseNoLocator);
    this.txtRegistrationGST = page.locator(
      AdminNewDealerLocator.txtRegistrationGSTLocator,
    );
    this.txtRegistrationPST = page.locator(
      AdminNewDealerLocator.txtRegistrationPSTLocator,
    );
    this.dpdGroup = page.locator(AdminNewDealerLocator.dpdGroupLocator);
    this.txtNotes = page.locator(AdminNewDealerLocator.txtNotesLocator);
    this.dpdHumaniaCommissionRate = page.locator(
      AdminNewDealerLocator.dpdHumaniaCommissionRateLocator,
    );
    this.btnSave = page.locator(AdminNewDealerLocator.btnSaveLocator);
    this.lblDealerSaved = page.locator(
      AdminNewDealerLocator.lblDealerSavedLocator,
    );
  }

  /**
   * Fill the new dealer form with provided data
   */
  async fillNewDealerForm(
    dealer: DealerData,
    submit: boolean = true,
  ): Promise<void> {
    await this.txtEmail.fill(dealer.email);
    await this.txtName.fill(dealer.name);

    if (dealer.phone) await this.txtPhone.fill(dealer.phone);
    if (dealer.fax) await this.txtFax.fill(dealer.fax);
    if (dealer.companyName) await this.txtCompanyName.fill(dealer.companyName);
    if (dealer.address) await this.txtAddress.fill(dealer.address);
    if (dealer.city) await this.txtCity.fill(dealer.city);
    if (dealer.province)
      await this.dpdProvince.selectOption({ label: dealer.province });
    if (dealer.postalCode) await this.txtPostalCode.fill(dealer.postalCode);
    if (dealer.internalId) await this.txtInternalId.fill(dealer.internalId);
    if (dealer.contactTitle)
      await this.txtContactTitle.fill(dealer.contactTitle);
    if (dealer.licenseNo) await this.txtLicenseNo.fill(dealer.licenseNo);
    if (dealer.registrationGST)
      await this.txtRegistrationGST.fill(dealer.registrationGST);
    if (dealer.registrationPST)
      await this.txtRegistrationPST.fill(dealer.registrationPST);
    if (dealer.group) await this.dpdGroup.selectOption({ label: dealer.group });
    if (dealer.notes) await this.txtNotes.fill(dealer.notes);
    if (dealer.humaniaCommissionRate) {
      await this.dpdHumaniaCommissionRate.selectOption({
        label: dealer.humaniaCommissionRate,
      });
    }

    if (submit) {
      await this.btnSave.click();
    }
  }

  /**
   * Verify dealer saved message is displayed
   */
  async verifyDealerSaved(): Promise<void> {
    await expect(this.lblDealerSaved).toBeVisible();
  }

  /**
   * Click save button
   */
  async save(): Promise<void> {
    await this.btnSave.click();
  }
}
