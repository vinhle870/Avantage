import { test, expect } from '../../core/fixtures/test-fixtures';
import { config } from '../../data/config';
import testData from '../../data/testData.json';

/**
 * Dealer Existing Quote Management Tests
 * Converted from Test_Dealer_ExistingQuoteManage.java
 */
test.describe('Dealer Existing Quote Management', () => {

    test.beforeEach(async ({ page, loginPage }) => {
        // Navigate to dealer portal and login
        await page.goto(config.dealerPortalUrl);
        await loginPage.loginToPortal(
            testData.credentials.dealer.username,
            testData.credentials.dealer.password
        );
    });

    test('TC020 - Dealer can view quotes list', async ({
        page,
        dealerLeftMenu,
        dealerQuotesPage
    }) => {
        // Navigate to quotes page
        await dealerLeftMenu.goToQuotesPage();

        // Verify quotes page loaded
        await expect(dealerQuotesPage.lnkCreateAQuote).toBeVisible();
    });

    test('TC021 - Dealer can access create quote from quotes page', async ({
        page,
        dealerLeftMenu,
        dealerQuotesPage
    }) => {
        // Navigate to quotes page
        await dealerLeftMenu.goToQuotesPage();

        // Verify create quote link is accessible
        const isVisible = await dealerQuotesPage.isCreateQuoteLinkVisible();
        expect(isVisible).toBe(true);

        // Click create quote
        await dealerQuotesPage.openNewQuotePage();

        // Verify navigation to new quote page
        await expect(page).toHaveURL(/.*quote.*/);
    });
});
