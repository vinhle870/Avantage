import path from 'path';
import { test, expect } from '@playwright/test';
import { Dealer } from '../../data/admin-portal';
import { loadQuoteInfo, TEST_DATA_ROOT } from '../../data/testDataLoader';
import { buildExpectedSaleContractPdfContent, calculateSaleContractAmounts } from '../../expectations/saleContractPdf';
import { buildExpectedWarrantyPdfContent } from '../../expectations/warrantyContractPdf';
import { normalizePdfText, readPdfText } from '../../core/utils/pdfReader';
import { addMonthsIso, formatAccounting, formatGrouped } from '../../core/utils/javaFormat';

/**
 * Offline checks for the PDF verification pipeline — no browser, no application.
 * They pin the ported Java formatting/tax maths and prove that text extracted from
 * a real contract PDF produced by the application matches the expected content.
 */

const sampleDealer: Dealer = {
    // Dealer account as printed on test-data/TestDocument/SaleContract_230201033655.pdf
    email: '', name: 'vinh', phone: '99999', fax: '', companyName: '', address: 'Address', city: '',
    province: 'Northwest territories', postalCode: '22222', internalId: '', contactTitle: '',
    licenseNo: '123456789', registrationGST: 'GST', registrationPST: 'PST', isShowTaxInfo: 'True',
    group: '', notes: '', humaniaCommissionRate: '',
};

test.describe('PDF expectations (offline)', () => {
    test('Java number/date formatting is reproduced', () => {
        expect(formatGrouped(21000)).toBe('21,000.00');
        expect(formatGrouped(3150)).toBe('3,150.00');
        expect(formatAccounting(-1234.5)).toBe('(1,234.50)');
        expect(addMonthsIso('2022-06-04', 100)).toBe('2030-10-04');
        expect(addMonthsIso('2024-01-31', 1)).toBe('2024-02-29');
    });

    test('sale contract amounts follow pdfFactory', () => {
        const quote = loadQuoteInfo('DealerPortal/TC920_DealerCanCreateSaleContractWithExchangeVehicle.xml');
        const a = calculateSaleContractAmounts(quote);
        // Price 10,000 − discount − exchange, then GST 5 % and QST 9.975 % for a taxable client
        const e = a.E_subTotalWithExchange;
        expect(a.F_gst).toBeCloseTo(e > 0 ? e * 0.05 : 0, 6);
        expect(a.I_qst).toBeCloseTo(e > 0 ? e * 0.09975 : 0, 6);
        expect(a.payableBalanceExcludingQst).toBeCloseTo(a.financedBalanceIncludingQst - a.I_qst, 6);
    });

    test('TC914 expected sale contract matches the sale contract PDF the app produced', async () => {
        const quote = loadQuoteInfo('DealerPortal/TC914_DealerCanCreateSaleContractWithExchangeVehicle.xml');
        quote.quoteVehicle.vehicleInfo.vehicleId = '639'; // stock No. of the vehicle used for that PDF

        const expected = normalizePdfText(buildExpectedSaleContractPdfContent(quote, sampleDealer));
        const actual = normalizePdfText(
            await readPdfText(path.join(TEST_DATA_ROOT, 'TestDocument', 'SaleContract_230201033655.pdf')));

        expect(actual).toContain(expected);
    });

    test('warranty expected content renders every placeholder', () => {
        const quote = loadQuoteInfo('DealerPortal/TC1576_DealerCanFinishQuoteForClient_DealerPortal.xml');
        const content = buildExpectedWarrantyPdfContent(quote, sampleDealer, quote.quoteVehicle.vehicleInfo);
        expect(content).not.toMatch(/\$\{[^}]+\}/);
        // Alberta: 5 % GST only
        expect(content).toContain('Sale price : $21,000.00\nGST : $1,050.00\nTotal : $22,050.00');
    });
});
