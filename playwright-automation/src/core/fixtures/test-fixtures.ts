import { test as base, Page } from "@playwright/test";
import { LoginPage } from "../../pages/common/login/Page/LoginPage";
import {
  AdminLeftMenu,
  AdminDealersPage,
  AdminNewDealerPage,
  AdminPriceRulesPage,
  AdminNewPriceRulePage,
  AdminProgramsPage,
} from "../../pages/adminPortal";
import {
  DealerLeftMenu,
  DealerQuotesPage,
  DealerNewQuoteClientPage,
  QuoteDetailPage,
  InvoiceDetailPage,
  VehicleInventoryPage,
} from "../../pages/dealerPortal";

/**
 * Page object fixtures for all tests.
 * Provides pre-initialized page objects to test specs.
 */

// Define fixtures type
type PageFixtures = {
  // Common
  loginPage: LoginPage;

  // Admin Portal
  adminLeftMenu: AdminLeftMenu;
  adminDealersPage: AdminDealersPage;
  adminNewDealerPage: AdminNewDealerPage;
  adminPriceRulesPage: AdminPriceRulesPage;
  adminNewPriceRulePage: AdminNewPriceRulePage;
  adminProgramsPage: AdminProgramsPage;

  // Dealer Portal
  dealerLeftMenu: DealerLeftMenu;
  dealerQuotesPage: DealerQuotesPage;
  dealerNewQuoteClientPage: DealerNewQuoteClientPage;
  quoteDetailPage: QuoteDetailPage;
  invoiceDetailPage: InvoiceDetailPage;
  vehicleInventoryPage: VehicleInventoryPage;
};

/**
 * Extended test with page object fixtures
 */
export const test = base.extend<PageFixtures>({
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
  invoiceDetailPage: async ({ page }, use) => {
    await use(new InvoiceDetailPage(page));
  },
  vehicleInventoryPage: async ({ page }, use) => {
    await use(new VehicleInventoryPage(page));
  },
});

export { expect } from "@playwright/test";
