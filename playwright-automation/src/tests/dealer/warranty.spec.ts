import { test } from '../../core/fixtures/test-fixtures';
import { loadDealerAccount, loadDealerPortalData, loadQuoteInfo } from '../../data/testDataLoader';

/**
 * Dealer warranty contracts — create a warranty on a new quote and verify the PDF.
 * Converted from Test_Dealer_NewQuoteManage.java (TC010, TC1411, TC1576–TC1588).
 * Each case runs the same flow with its own test data file (one province per file).
 */

const WARRANTY_CASES = [
    { id: 'TC010_DealerCanCreateWarranty', file: 'TC010_DealerCanFinishQuoteForClient_DealerPortal.xml' },
    ...[1576, 1577, 1578, 1579, 1580, 1581, 1582, 1583, 1584, 1585, 1586, 1587, 1588].map(n => ({
        id: `TC${n}_DealerCanCreateWarranty`,
        file: `TC${n}_DealerCanFinishQuoteForClient_DealerPortal.xml`,
    })),
];

test.describe('Dealer warranty contract @dealer @warranty', () => {
    test.describe.configure({ timeout: 300_000 });

    for (const tc of WARRANTY_CASES) {
        test(tc.id, async ({ dealerUser }) => {
            const quoteInfo = loadQuoteInfo(`DealerPortal/${tc.file}`);
            const vehicleInfo = quoteInfo.quoteVehicle.vehicleInfo;

            await dealerUser.loginToDealerPortal();
            // Creates the quote with its vehicle, then adds the client
            await dealerUser.createNewQuote(quoteInfo, true, tc.id);
            await dealerUser.addQuoteVehicle(quoteInfo);
            await dealerUser.createNewWarranty(quoteInfo, true);

            const actual = await dealerUser.downloadAndReadWarrantyContractPdf();
            await dealerUser.verifyWarrantyContentIsCorrect(actual, quoteInfo, loadDealerAccount(), vehicleInfo);

            await dealerUser.backToQuoteFromWarrantyDetail();
        });
    }

    test('TC1411_DealerCanFinalizeSaleAndSeeInvoice', async ({ dealerUser }) => {
        const data = loadDealerPortalData('DealerPortal/TC1411_DealerCanFinishQuoteForClient_DealerPortal.xml');
        const quoteInfo = data.quoteInfo!;
        // Generating the contract requires a recent delivery date, so the sale is dated today
        const today = new Date().toISOString().slice(0, 10);
        quoteInfo.quoteVehicle.deliveryDate = today;
        quoteInfo.quoteWarranty.vehicleDeliveryDate = today;
        quoteInfo.quoteWarranty.warrantyStartDate = today;

        await dealerUser.loginToDealerPortal();
        await dealerUser.createNewQuote(quoteInfo, true, 'TC1411_DealerCanFinalizeSaleAndSeeInvoice');
        await dealerUser.addQuoteVehicle(quoteInfo);
        await dealerUser.createNewWarranty(quoteInfo, true);

        await dealerUser.backToQuoteFromWarrantyDetail();
        await dealerUser.finalizeSale(true);
        await dealerUser.goToInvoiceAfterFinalizeSale();
        await dealerUser.verifyInvoiceInfo(data.invoiceInfo!, loadDealerAccount());
    });
});
