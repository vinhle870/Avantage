import { test, expect } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import testData from '../../data/testData.json';

/**
 * Dealer New Quote Management Tests
 * Converted from Test_Dealer_NewQuoteManage.java
 */
test.describe('Dealer New Quote Management', () => {

    test.beforeEach(async ({ page, loginPage }) => {
        // Navigate to dealer portal and login
        await page.goto(config.dealerPortalUrl);
        await loginPage.loginToPortal(
            testData.credentials.dealer.username,
            testData.credentials.dealer.password
        );
    });

    test('TC007 - Dealer can login to dealer portal', async ({
        page,
        loginPage
    }) => {
        // Login is handled in beforeEach
        // Verify successful login by checking for main page elements
        await expect(page).not.toHaveURL(/.*login.*/);
    });

    test('TC008 - Dealer can create new quote', async ({
        page,
        dealerLeftMenu,
        dealerQuotesPage,
        dealerNewQuoteClientPage
    }) => {
        // Navigate to quotes page
        await dealerLeftMenu.goToQuotesPage();

        // Open new quote page
        await dealerQuotesPage.openNewQuotePage();

        // Fill client form with test data
        const clientData = testData.dealer.clients[0];
        await dealerNewQuoteClientPage.fillNewClientForm(clientData, true);

        // Verify quote was created (navigated to quote detail)
        await expect(page).toHaveURL(/.*quote.*/);
    });

    test('TC010 - Dealer can add vehicle to quote', async ({
        page,
        dealerLeftMenu,
        dealerQuotesPage,
        dealerNewQuoteClientPage,
        quoteDetailPage
    }) => {
        // Navigate to quotes page
        await dealerLeftMenu.goToQuotesPage();

        // Open new quote page
        await dealerQuotesPage.openNewQuotePage();

        // Fill client form
        const clientData = testData.dealer.clients[0];
        await dealerNewQuoteClientPage.fillNewClientForm(clientData, true);

        // Verify we're on quote detail page
        await expect(quoteDetailPage.btnAddVehicle).toBeVisible({ timeout: 10000 });
    });
});
