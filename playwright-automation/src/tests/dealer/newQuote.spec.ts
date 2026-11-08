import { test } from '../../core/fixtures/test-fixtures';
import { loadQuoteInfo } from '../../data/testDataLoader';

/**
 * Dealer New Quote Management Tests
 * Converted from Test_Dealer_NewQuoteManage.java (TC007, TC008).
 * The warranty and sale contract tests of that class are in warranty.spec.ts / saleContract.spec.ts.
 */
test.describe('Dealer New Quote Management @dealer', () => {

    test('TC007_DealerCanLoginToDealerPortal', async ({ dealerUser }) => {
        await dealerUser.loginToDealerPortal();
    });

    test('TC008_DealerCanCreateNewQuote', async ({ dealerUser }) => {
        const quoteInfo = loadQuoteInfo('DealerPortal/TC008_DealerCanCreateNewQuote.xml');

        await dealerUser.loginToDealerPortal();
        // As in the Java test, the new-quote form is filled but not submitted
        await dealerUser.createNewQuote(quoteInfo, false, 'TC008_DealerCanCreateNewQuote');
    });
});
