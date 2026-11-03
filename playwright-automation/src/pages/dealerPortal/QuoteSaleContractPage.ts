import { Page, Locator } from '@playwright/test';
import { QuoteSaleContract } from '../../data/dealer-portal';
import { downloadEmbeddedPdf } from '../../core/utils/uiActions';

/**
 * Quote Sale Contract Page - Sale contract form and its generated PDF.
 * Converted from QuoteSaleContractPage.java + quoteSaleContractPage_Func.java
 */
export class QuoteSaleContractPage {
    private page: Page;

    // Locators
    readonly txtContractNumber: Locator;
    readonly txtSalesRepName: Locator;
    readonly txtDeliveredAt: Locator;
    readonly txtSignedAt: Locator;
    readonly txtSignedLocation: Locator;
    readonly txtDiscountAmount: Locator;
    readonly txtVehicleMarketValue: Locator;
    readonly txtTransitAmount: Locator;
    readonly txtRdprmAmount: Locator;
    readonly txtWarrantyAmount: Locator;
    readonly txtAccessories: Locator;
    readonly txtAccessoriesAmount: Locator;
    readonly txtNewTiresDutyAmount: Locator;
    readonly txtMaintenanceScheduleAmount: Locator;
    readonly txtReplacementInsuranceAmount: Locator;
    readonly txtReplacementInsuranceNumber: Locator;
    readonly txtLoanInsuranceAmount: Locator;
    readonly txtLoanInsuranceNumber: Locator;
    readonly txtDepositAmount: Locator;
    readonly txtOtherClause: Locator;
    readonly embedPdf: Locator;
    readonly btnSave: Locator;

    constructor(page: Page) {
        this.page = page;
        this.txtContractNumber = page.locator('#sales_contract_contractNumber');
        this.txtSalesRepName = page.locator('#sales_contract_salesRepName');
        this.txtDeliveredAt = page.locator('#sales_contract_deliveredAt');
        this.txtSignedAt = page.locator('#sales_contract_signedAt');
        this.txtSignedLocation = page.locator('#sales_contract_signedLocation');
        this.txtDiscountAmount = page.locator('#sales_contract_discountAmount');
        this.txtVehicleMarketValue = page.locator('#sales_contract_vehicleMarketValue');
        this.txtTransitAmount = page.locator('#sales_contract_transitAmount');
        this.txtRdprmAmount = page.locator('#sales_contract_rdprmAmount');
        this.txtWarrantyAmount = page.locator('#sales_contract_warrantyAmount');
        this.txtAccessories = page.locator('#sales_contract_accessories');
        this.txtAccessoriesAmount = page.locator('#sales_contract_accessoriesAmount');
        this.txtNewTiresDutyAmount = page.locator('#sales_contract_newTiresDutyAmount');
        this.txtMaintenanceScheduleAmount = page.locator('#sales_contract_maintenanceScheduleAmount');
        this.txtReplacementInsuranceAmount = page.locator('#sales_contract_replacementInsuranceAmount');
        this.txtReplacementInsuranceNumber = page.locator('#sales_contract_replacementInsuranceNumber');
        this.txtLoanInsuranceAmount = page.locator('#sales_contract_loanInsuranceAmount');
        this.txtLoanInsuranceNumber = page.locator('#sales_contract_loanInsuranceNumber');
        this.txtDepositAmount = page.locator('#sales_contract_depositAmount');
        this.txtOtherClause = page.locator('#sales_contract_otherClause');
        this.embedPdf = page.locator('embed').first();
        this.btnSave = page.locator('[type="submit"]').first();
    }

    /**
     * Fill the sale contract form. Every field is written, empty values clear the field.
     */
    async fillSaleContractInfo(contract: QuoteSaleContract, submit: boolean = true): Promise<void> {
        await this.txtContractNumber.fill(contract.contractNumber);
        await this.txtSalesRepName.fill(contract.salesRepName);
        await this.txtDeliveredAt.fill(contract.deliveredOn);
        await this.txtSignedAt.fill(contract.signedOn);
        await this.txtSignedLocation.fill(contract.signedLocation);
        await this.txtDiscountAmount.fill(contract.discountAmount);
        await this.txtVehicleMarketValue.fill(contract.vehicleMarketValue);
        await this.txtTransitAmount.fill(contract.transitAmount);
        await this.txtRdprmAmount.fill(contract.rdprmAmount);
        await this.txtWarrantyAmount.fill(contract.warrantyAmount);
        await this.txtAccessories.fill(contract.accessories);
        await this.txtAccessoriesAmount.fill(contract.accessoriesAmount);
        await this.txtNewTiresDutyAmount.fill(contract.newTiresDutyAmount);
        await this.txtMaintenanceScheduleAmount.fill(contract.maintenanceScheduleAmount);
        await this.txtReplacementInsuranceAmount.fill(contract.replacementInsuranceAmount);
        await this.txtReplacementInsuranceNumber.fill(contract.replacementInsuranceContractNumber);
        await this.txtLoanInsuranceAmount.fill(contract.loanInsuranceAmount);
        await this.txtLoanInsuranceNumber.fill(contract.loanInsuranceContractNumber);
        await this.txtDepositAmount.fill(contract.depositAmount);
        await this.txtOtherClause.fill(contract.otherClause);

        if (submit) {
            await this.btnSave.click();
        }
    }

    /**
     * Bytes of the sale contract PDF embedded on the page after saving
     */
    async downloadSaleContractPdf(): Promise<Buffer> {
        return await downloadEmbeddedPdf(this.page, this.embedPdf);
    }
}
