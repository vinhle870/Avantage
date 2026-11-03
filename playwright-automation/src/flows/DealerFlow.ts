import fs from 'fs';
import { expect, Page, test, TestInfo } from '@playwright/test';
import { config, getCredentials } from '../data/config';
import { Dealer } from '../data/admin-portal';
import {
    InvoiceInfo, QuoteClient, QuoteExchangeVehicle, QuoteInfo, QuoteSaleContract, VehicleInfo,
} from '../data/dealer-portal';
import { LoginPage } from '../pages/common/LoginPage';
import {
    DealerLeftMenu, DealerNewQuoteClientPage, DealerNewQuotePage, DealerQuotesPage, ExchangeVehicleModal, InvoiceDetailPage,
    QuoteDetailPage, QuoteSaleContractPage, VehicleInventoryPage, WarrantyDetailsPage,
} from '../pages/dealerPortal';
import { buildExpectedSaleContractPdfContent } from '../expectations/saleContractPdf';
import { buildExpectedWarrantyPdfContent } from '../expectations/warrantyContractPdf';
import { formatGrouped, toNumber } from '../core/utils/javaFormat';
import { flattenPdfText, normalizePdfText, readPdfText } from '../core/utils/pdfReader';

/**
 * Dealer Portal business flows.
 * Converted from DealerSteps.java — one method per Serenity @Step, same names.
 */

const DEALER_PROVINCE_TAXES: Record<string, { code: string; gst: number; pst: number }> = {
    'Quebec': { code: 'QC', gst: 0.05, pst: 0.09975 },
    'New Brunswick': { code: 'NB', gst: 0.15, pst: 0 },
    'Ontario': { code: 'ON', gst: 0.13, pst: 0 },
    // Nova Scotia HST is 14 % since 2025-04-01 (was 15 %)
    'Nova Scotia': { code: 'NS', gst: 0.14, pst: 0 },
    'Alberta': { code: 'AB', gst: 0.05, pst: 0 },
    'British Columbia': { code: 'BC', gst: 0.05, pst: 0.07 },
    'Manitoba': { code: 'MB', gst: 0.05, pst: 0.07 },
    'Saskatchewan': { code: 'SK', gst: 0.05, pst: 0.06 },
    'Prince Edward Island': { code: 'PE', gst: 0.15, pst: 0 },
    'Newfoundland and Labrador': { code: 'NL', gst: 0.15, pst: 0 },
    'Nunavut': { code: 'NU', gst: 0.05, pst: 0 },
    'Yukon': { code: 'YT', gst: 0.05, pst: 0 },
    'Northwest territories': { code: 'NT', gst: 0.05, pst: 0 },
};

export class DealerFlow {
    private readonly loginPage: LoginPage;
    private readonly leftMenu: DealerLeftMenu;
    private readonly quotesPage: DealerQuotesPage;
    private readonly newQuotePage: DealerNewQuotePage;
    private readonly newQuoteClientPage: DealerNewQuoteClientPage;
    private readonly quoteDetailPage: QuoteDetailPage;
    private readonly warrantyDetailsPage: WarrantyDetailsPage;
    private readonly saleContractPage: QuoteSaleContractPage;
    private readonly exchangeVehicleModal: ExchangeVehicleModal;
    private readonly inventoryPage: VehicleInventoryPage;
    private readonly invoiceDetailPage: InvoiceDetailPage;

    constructor(private readonly page: Page, private readonly testInfo: TestInfo) {
        this.loginPage = new LoginPage(page);
        this.leftMenu = new DealerLeftMenu(page);
        this.quotesPage = new DealerQuotesPage(page);
        this.newQuotePage = new DealerNewQuotePage(page);
        this.newQuoteClientPage = new DealerNewQuoteClientPage(page);
        this.quoteDetailPage = new QuoteDetailPage(page);
        this.warrantyDetailsPage = new WarrantyDetailsPage(page);
        this.saleContractPage = new QuoteSaleContractPage(page);
        this.exchangeVehicleModal = new ExchangeVehicleModal(page);
        this.inventoryPage = new VehicleInventoryPage(page);
        this.invoiceDetailPage = new InvoiceDetailPage(page);
    }

    async loginToDealerPortal(): Promise<void> {
        await test.step('Dealer goes to Dealer Portal page', async () => {
            const { username, password } = getCredentials('dealer');
            await this.page.goto(config.dealerPortalUrl);
            await this.loginPage.loginToPortal(username, password);
            await expect(this.loginPage.txtUsername, `Unable to login ${username} to the dealer portal`)
                .toBeHidden();
        });
    }

    async logoutFromDealerPortal(): Promise<void> {
        await test.step('Dealer Logout From Portal', async () => {
            await this.leftMenu.logout();
        });
    }

    /**
     * Create a quote. The current app starts a quote from its vehicle (vehicle form +
     * quote name), then the client is added from the quote detail page. The vehicle's
     * inventory ID is stored in vehicleInfo.vehicleId (stock No. on the sale contract).
     * With submit = false the new-quote form is only filled (legacy TC008).
     */
    async createNewQuote(quoteInfo: QuoteInfo, submit: boolean, quoteName: string): Promise<void> {
        await test.step('Dealer Create New Quote on Dealer Portal', async () => {
            const vehicle = quoteInfo.quoteVehicle.vehicleInfo;
            await this.leftMenu.goToQuotesPage();
            await this.quotesPage.openNewQuotePage();
            await this.newQuotePage.fillNewQuoteForm(vehicle, quoteName, submit);
            if (!submit) return;

            await expect(this.page, 'Quote was not created').toHaveURL(/\/quote\/\d+\/details/);
            vehicle.vehicleId = await this.quoteDetailPage.getVehicleId();
            await this.addQuoteClient(quoteInfo.quoteClient);
        });
    }

    async addQuoteClient(client: QuoteClient): Promise<void> {
        await test.step('Dealer Adds Client To Quote', async () => {
            await this.quoteDetailPage.openClientForm();
            await this.newQuoteClientPage.fillNewClientForm(client, true);
            await expect(this.page, 'Quote client was not saved').toHaveURL(/\/quote\/\d+\/details/);
        });
    }

    /**
     * Adds the vehicle to the inventory and stores its inventory ID in vehicle.vehicleId
     * (printed as the stock No. on the sale contract).
     */
    async addNewVehicle(vehicle: VehicleInfo, submit: boolean): Promise<void> {
        await test.step('Dealer Add New Vehicle', async () => {
            await this.leftMenu.goToInventoryPage();
            await this.inventoryPage.openAddNewVehiclePage(vehicle.vehicleType);
            await this.inventoryPage.fillVehicleForm(vehicle, submit);
            await this.inventoryPage.goBack();
            vehicle.vehicleId = await this.inventoryPage.getNewestVehicleId();
        });
    }

    async addQuoteVehicle(quoteInfo: QuoteInfo): Promise<void> {
        await test.step('Dealer Adds Vehicle To Quote Detail', async () => {
            await this.quoteDetailPage.addQuoteVehicle(quoteInfo.quoteVehicle);
        });
    }

    /**
     * Same sequence as DealerSteps.createNewWarranty: (re)adds the quote vehicle,
     * then opens the warranty page and selects the program.
     */
    async createNewWarranty(quoteInfo: QuoteInfo, submit: boolean): Promise<void> {
        await test.step('Dealer Create New Warranty Contract', async () => {
            await this.quoteDetailPage.addQuoteVehicle(quoteInfo.quoteVehicle);
            await this.quoteDetailPage.openWarrantyDetailsPage();
            await this.warrantyDetailsPage.selectWarrantyProgram(quoteInfo.quoteWarranty, submit);
        });
    }

    async updateExistingProgram(quoteInfo: QuoteInfo, submit: boolean): Promise<void> {
        await test.step('Dealer Update Warranty Program', async () => {
            await this.warrantyDetailsPage.selectWarrantyProgram(quoteInfo.quoteWarranty, submit);
        });
    }

    async backToQuoteFromWarrantyDetail(): Promise<void> {
        await test.step('Back To Quote From Warranty Detail', async () => {
            await this.warrantyDetailsPage.backToQuote();
        });
    }

    async finalizeSale(submit: boolean): Promise<void> {
        await test.step('Dealer Finalize Sale', async () => {
            // Current app: finalizing = "Generate Contract" on the warranty, which creates the invoice
            if (await this.warrantyDetailsPage.lnkFinalizeSale.isVisible()) {
                await this.warrantyDetailsPage.finalizeSale(submit);
                return;
            }
            await this.quoteDetailPage.openWarrantyContractModal();
            if (submit) {
                await this.warrantyDetailsPage.generateContract();
                await expect(this.quoteDetailPage.lnkGotoInvoice, 'Warranty contract was not generated').toBeVisible();
            }
        });
    }

    async goToInvoiceAfterFinalizeSale(): Promise<void> {
        await test.step('Go to Invoice detail page after finalize sale', async () => {
            await this.quoteDetailPage.gotoInvoicePageAfterFinalize();
        });
    }

    /** Downloads the warranty PDF, attaches it to the report and returns its text */
    async downloadAndReadWarrantyContractPdf(): Promise<string> {
        return await test.step('Dealer Downloads the Warranty Contract PDF', async () => {
            // Current app: the contract preview is in the warranty's "Generate Contract" modal
            // (opened, not submitted). Legacy app: an <embed> on the page after saving.
            await expect(this.quoteDetailPage.rowWarranty.or(this.warrantyDetailsPage.embedPdf).first())
                .toBeVisible();
            if (!(await this.warrantyDetailsPage.embedPdf.isVisible())) {
                await this.quoteDetailPage.openWarrantyContractModal();
            }
            const pdf = await this.warrantyDetailsPage.downloadWarrantyContractPdf();
            await this.attachFile('WarrantyContract.pdf', pdf, 'application/pdf');
            return await readPdfText(pdf);
        });
    }

    async addExchangeVehicle(exchange: QuoteExchangeVehicle, submit: boolean): Promise<void> {
        await test.step('Dealer Add Exchange Vehicle', async () => {
            await this.exchangeVehicleModal.open();
            await this.exchangeVehicleModal.fillExchangeVehicleInfo(exchange, submit);
        });
    }

    async createSaleContractInfo(contract: QuoteSaleContract, submit: boolean): Promise<void> {
        await test.step('Dealer Creates Sale Contract Info', async () => {
            await this.quoteDetailPage.openSaleContractDetailsPage();
            await this.saleContractPage.fillSaleContractInfo(contract, submit);
        });
    }

    /** Downloads the sale contract PDF, attaches it to the report and returns its text */
    async downloadAndReadSaleContractPdf(fileName: string): Promise<string> {
        return await test.step('Dealer Downloads the Sale Contract PDF', async () => {
            const pdf = await this.saleContractPage.downloadSaleContractPdf();
            await this.attachFile(fileName, pdf, 'application/pdf');
            return await readPdfText(pdf);
        });
    }

    async verifyWarrantyContentIsCorrect(actualContent: string, quoteInfo: QuoteInfo, dealer: Dealer,
                                         vehicle: VehicleInfo): Promise<void> {
        await test.step('VERIFICATION POINT: WARRANTY CONTENT MUST BE CORRECT', async () => {
            const expected = buildExpectedWarrantyPdfContent(quoteInfo, dealer, vehicle);
            await this.expectPdfContains(actualContent, expected, 'Warranty PDF File is not correct as expected.');
        });
    }

    async verifySaleContractContentIsCorrect(actualContent: string, quoteInfo: QuoteInfo, dealer: Dealer): Promise<void> {
        await test.step('VERIFICATION POINT: SALE CONTRACT CONTENT MUST BE CORRECT', async () => {
            const expected = buildExpectedSaleContractPdfContent(quoteInfo, dealer);
            await this.expectPdfContains(actualContent, expected, 'Sale Contract PDF File is not correct as expected.');
        });
    }

    /**
     * Port of InvoiceDetailPage_Func.verifyInvoiceInfo — reports every mismatching field
     */
    async verifyInvoiceInfo(invoiceInfo: InvoiceInfo, dealer: Dealer): Promise<void> {
        await test.step('Verify invoice info', async () => {
            const invoice = await this.invoiceDetailPage.readInvoice();
            const province = DEALER_PROVINCE_TAXES[dealer.province];
            const total = toNumber(invoice.invoiceTotal.replace('$', ''));
            const expectedGrandTotal = formatGrouped(total + total * (province?.gst ?? 0) + total * (province?.pst ?? 0));

            const mismatches: string[] = [];
            const check = (ok: boolean, field: string) => { if (!ok) mismatches.push(field); };
            check(invoice.dealerName.includes(dealer.name), "Dealer's name");
            check(invoice.dealerAddress.includes(dealer.address), "Dealer's address");
            check(invoice.dealerLocation.includes(dealer.postalCode), 'Postalcode');
            check(invoice.dealerLocation.includes(dealer.city), "Dealer's city");
            check(invoice.dealerLocation.includes(province?.code ?? ''), "Dealer's province");
            check(invoice.dealerEmail.includes(dealer.email), "Dealer's email");
            check(invoice.dealerPhone.includes(dealer.phone), "Dealer's phone");
            check(invoice.avAddress.includes(invoiceInfo.taxInfo1), 'Tax info 1');
            check(invoice.avAddress.includes(invoiceInfo.taxInfo2), 'Tax info 2');
            check(invoice.avAddress.includes(invoiceInfo.apt1), 'APT address 1');
            check(invoice.avAddress.includes(invoiceInfo.apt2), 'APT address 2');
            check(invoice.invoiceGrandTotal.replace('$', '') === expectedGrandTotal, 'Grand total');

            expect(mismatches, `Invoice info is not correct as expected. Invoice: ${JSON.stringify(invoice)}`)
                .toEqual([]);
        });
    }

    /**
     * The PDF must contain the expected block (DealerSteps used String.contains).
     * Both texts are attached to the report so a failure can be diffed.
     */
    private async expectPdfContains(actual: string, expected: string, message: string): Promise<void> {
        const actualText = normalizePdfText(actual);
        const expectedText = normalizePdfText(expected);
        // Line-per-line files for diffing; the check itself ignores where lines break
        await this.attachFile('pdf-actual.txt', actualText, 'text/plain');
        await this.attachFile('pdf-expected.txt', expectedText, 'text/plain');
        expect(flattenPdfText(actual), message).toContain(flattenPdfText(expected));
    }

    /** Save a file in the test's output folder (test-results/...) and attach it to the report */
    private async attachFile(name: string, body: Buffer | string, contentType: string): Promise<void> {
        const filePath = this.testInfo.outputPath(name);
        fs.writeFileSync(filePath, body);
        await this.testInfo.attach(name, { path: filePath, contentType });
    }
}
