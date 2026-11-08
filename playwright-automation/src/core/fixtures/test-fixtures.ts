import { test as base } from '@playwright/test';
import { LoginPage } from '../../pages/common/LoginPage';
import {
    AdminLeftMenu, AdminDealersPage, AdminNewDealerPage, AdminPriceRulesPage, AdminNewPriceRulePage,
    AdminProgramsPage, AdminNewProgramPage, AdminProgramDetailPage,
} from '../../pages/adminPortal';
import {
    DealerLeftMenu, DealerQuotesPage, DealerNewQuoteClientPage, QuoteDetailPage, InvoiceDetailPage,
    VehicleInventoryPage, WarrantyDetailsPage, QuoteSaleContractPage, ExchangeVehicleModal,
} from '../../pages/dealerPortal';
import { AdminFlow } from '../../flows/AdminFlow';
import { DealerFlow } from '../../flows/DealerFlow';

/**
 * Page object and flow fixtures for all tests.
 * `adminUser` / `dealerUser` replace the Serenity @Steps AdminUser / DealerUser of TestBase.java.
 */

// Define fixtures type
type PageFixtures = {
    // Flows
    adminUser: AdminFlow;
    dealerUser: DealerFlow;

    // Common
    loginPage: LoginPage;

    // Admin Portal
    adminLeftMenu: AdminLeftMenu;
    adminDealersPage: AdminDealersPage;
    adminNewDealerPage: AdminNewDealerPage;
    adminPriceRulesPage: AdminPriceRulesPage;
    adminNewPriceRulePage: AdminNewPriceRulePage;
    adminProgramsPage: AdminProgramsPage;
    adminNewProgramPage: AdminNewProgramPage;
    adminProgramDetailPage: AdminProgramDetailPage;

    // Dealer Portal
    dealerLeftMenu: DealerLeftMenu;
    dealerQuotesPage: DealerQuotesPage;
    dealerNewQuoteClientPage: DealerNewQuoteClientPage;
    quoteDetailPage: QuoteDetailPage;
    warrantyDetailsPage: WarrantyDetailsPage;
    quoteSaleContractPage: QuoteSaleContractPage;
    exchangeVehicleModal: ExchangeVehicleModal;
    invoiceDetailPage: InvoiceDetailPage;
    vehicleInventoryPage: VehicleInventoryPage;
};

/**
 * Extended test with page object and flow fixtures
 */
export const test = base.extend<PageFixtures>({
    // Flows
    adminUser: async ({ page }, use) => {
        await use(new AdminFlow(page));
    },
    dealerUser: async ({ page }, use, testInfo) => {
        await use(new DealerFlow(page, testInfo));
    },

    // Common pages
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    // Admin Portal pages
    adminLeftMenu: async ({ page }, use) => {
        await use(new AdminLeftMenu(page));
    },
    adminDealersPage: async ({ page }, use) => {
        await use(new AdminDealersPage(page));
    },
    adminNewDealerPage: async ({ page }, use) => {
        await use(new AdminNewDealerPage(page));
    },
    adminPriceRulesPage: async ({ page }, use) => {
        await use(new AdminPriceRulesPage(page));
    },
    adminNewPriceRulePage: async ({ page }, use) => {
        await use(new AdminNewPriceRulePage(page));
    },
    adminProgramsPage: async ({ page }, use) => {
        await use(new AdminProgramsPage(page));
    },
    adminNewProgramPage: async ({ page }, use) => {
        await use(new AdminNewProgramPage(page));
    },
    adminProgramDetailPage: async ({ page }, use) => {
        await use(new AdminProgramDetailPage(page));
    },

    // Dealer Portal pages
    dealerLeftMenu: async ({ page }, use) => {
        await use(new DealerLeftMenu(page));
    },
    dealerQuotesPage: async ({ page }, use) => {
        await use(new DealerQuotesPage(page));
    },
    dealerNewQuoteClientPage: async ({ page }, use) => {
        await use(new DealerNewQuoteClientPage(page));
    },
    quoteDetailPage: async ({ page }, use) => {
        await use(new QuoteDetailPage(page));
    },
    warrantyDetailsPage: async ({ page }, use) => {
        await use(new WarrantyDetailsPage(page));
    },
    quoteSaleContractPage: async ({ page }, use) => {
        await use(new QuoteSaleContractPage(page));
    },
    exchangeVehicleModal: async ({ page }, use) => {
        await use(new ExchangeVehicleModal(page));
    },
    invoiceDetailPage: async ({ page }, use) => {
        await use(new InvoiceDetailPage(page));
    },
    vehicleInventoryPage: async ({ page }, use) => {
        await use(new VehicleInventoryPage(page));
    },
});

export { expect } from '@playwright/test';
