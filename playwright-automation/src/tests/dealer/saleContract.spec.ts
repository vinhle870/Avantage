import { test } from '../../core/fixtures/test-fixtures';
import { loadDealerAccount, loadQuoteInfo } from '../../data/testDataLoader';

/**
 * Dealer sale contracts — sell a vehicle (optionally with a trade-in) and verify the PDF.
 * Converted from Test_Dealer_NewQuoteManage.java (TC011, TC012, TC0914, TC0920–TC0924,
 * TC1417, TC01419–TC01427). Test_Dealer_ExistingQuoteManage.java repeated the same
 * methods with the same data files, so each case is migrated once.
 * The legacy "add the vehicle to the inventory first" step is gone: the current app
 * creates the vehicle together with the quote.
 */

interface SaleContractCase {
    id: string;
    file: string;
    /** Adds the trade-in vehicle from <QuoteExchangeVehicle> */
    withExchangeVehicle: boolean;
}

const exchangeCase = (id: string, file: string): SaleContractCase => ({ id, file, withExchangeVehicle: true });

const SALE_CONTRACT_CASES: SaleContractCase[] = [
    exchangeCase('TC011_DealerCanCreateSaleContractWithExchangeVehicle', 'TC011_DealerCanCreateSaleContractWithExchangeVehicle.xml'),
    { id: 'TC012_DealerCanCreateSaleContract', file: 'TC012_DealerCanCreateSaleContract.xml', withExchangeVehicle: false },
    ...[914, 920, 921, 922, 923, 924].map(n => exchangeCase(
        `TC0${n}_DealerCanCreateSaleContractWithExchangeVehicle`,
        `TC${n}_DealerCanCreateSaleContractWithExchangeVehicle.xml`)),
    { id: 'TC1417_DealerCanCreateSaleContract', file: 'TC1417_DealerCanCreateSaleContract.xml', withExchangeVehicle: false },
    ...[1419, 1420, 1421, 1422, 1423, 1424, 1425, 1426, 1427].map(n => exchangeCase(
        `TC0${n}_DealerCanCreateSaleContractWithExchangeVehicle`,
        `TC${n}_DealerCanCreateSaleContractWithExchangeVehicle.xml`)),
];

test.describe('Dealer sale contract @dealer @saleContract', () => {
    test.describe.configure({ timeout: 300_000 });

    for (const tc of SALE_CONTRACT_CASES) {
        test(tc.id, async ({ dealerUser }) => {
            const quoteInfo = loadQuoteInfo(`DealerPortal/${tc.file}`);

            await dealerUser.loginToDealerPortal();
            // Creates the quote with its vehicle, then adds the client
            await dealerUser.createNewQuote(quoteInfo, true, tc.id);
            await dealerUser.addQuoteVehicle(quoteInfo);
            if (tc.withExchangeVehicle) {
                await dealerUser.addExchangeVehicle(quoteInfo.quoteSale.quoteExchangeVehicle, true);
            }
            await dealerUser.createSaleContractInfo(quoteInfo.quoteSale.quoteSaleContract, true);

            const actual = await dealerUser.downloadAndReadSaleContractPdf(`${tc.id}.pdf`);
            await dealerUser.verifySaleContractContentIsCorrect(actual, quoteInfo, loadDealerAccount());
        });
    }
});
