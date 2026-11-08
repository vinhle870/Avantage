import { test } from '../../core/fixtures/test-fixtures';
import { loadDealerAccount, loadQuoteInfo } from '../../data/testDataLoader';

/**
 * Dealer Existing Quote Management Tests
 * Converted from Test_Dealer_ExistingQuoteManage.java.
 * Only TC001 is specific to this class; its sale contract tests duplicated the ones in
 * Test_Dealer_NewQuoteManage.java and are covered by saleContract.spec.ts.
 */
test.describe('Dealer Existing Quote Management @dealer @smoke', () => {
    test.describe.configure({ timeout: 300_000 });

    test('TC001_SmokeTest_DealerCanCreateNewWarrantyForExistingVehicle', async ({ dealerUser }) => {
        const quoteInfo = loadQuoteInfo('DealerPortal/TC010_DealerCanFinishQuoteForClient_DealerPortal.xml');
        const vehicleInfo = quoteInfo.quoteVehicle.vehicleInfo;

        await dealerUser.loginToDealerPortal();
        await dealerUser.createNewQuote(quoteInfo, true, 'TC001_SmokeTest_DealerCanCreateNewWarrantyForExistingVehicle');
        await dealerUser.createNewWarranty(quoteInfo, true);

        const actual = await dealerUser.downloadAndReadWarrantyContractPdf();
        await dealerUser.verifyWarrantyContentIsCorrect(actual, quoteInfo, loadDealerAccount(), vehicleInfo);
    });
});
